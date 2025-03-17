//Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/core/Fragment",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/library",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/utils",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/utils/AppType",
    "sap/ushell/EventHub"
], function (
    Element,
    Fragment,
    Device,
    JSONModel,
    ushellLibrary,
    Config,
    Container,
    resources,
    utils,
    WindowUtils,
    AppTypeUtils,
    EventHub
) {
    "use strict";

    // shortcut for sap.ushell.AppType
    const AppType = ushellLibrary.AppType;

    const oQuickAccess = {
        oModel: new JSONModel({
            recentActivities: [],
            frequentActivities: []
        }),
        oQuickAccessDialog: null,

        /**
         * Creates the Quick Access dialog and sets the models.
         *
         * @param {string} [sFocusIdAfterClose] the DOM id of the element to focus after close
         * @returns {Promise<object>} that resolves with the created Dialog
         * @private
         */
        _createQuickAccessDialog: async function (sFocusIdAfterClose) {
            const oFragment = await Fragment.load({
                name: "sap.ushell.ui.QuickAccess",
                type: "XML",
                controller: this
            });

            oFragment.setModel(this.oModel);
            oFragment.attachAfterClose(this._onAfterClose.bind(this, sFocusIdAfterClose));
            Element.getElementById("mainShell").addDependent(oFragment);

            this.oQuickAccessDialog = oFragment;
            return oFragment;
        },

        /**
         * Handles the after close event of the QuickAccess Dialog.
         * Destroys the dialog and sets the focus depending on how the dialog was opened before.
         *
         * @param {string} [sFocusIdAfterClose] the DOM id of the element to focus after close
         * @since 1.121
         * @private
         */
        _onAfterClose: function (sFocusIdAfterClose) {
            this.oQuickAccessDialog.destroy();

            if (Device.system.desktop) {
                const oFocusElement = Element.getElementById(sFocusIdAfterClose);

                if (oFocusElement) {
                    oFocusElement.focus();
                } else {
                    sap.ui.require(["sap/ushell/components/ComponentKeysHandler"], (ComponentKeysHandler) => {
                        ComponentKeysHandler.getInstance().then((ComponentKeysHandlerInstance) => {
                            ComponentKeysHandlerInstance.goToLastVisitedTile();
                        });
                    });
                }
            }
        },

        /**
         * Updates the Quick Access dialog.
         *
         * @param {object} oDialog the Quick Access dialog.
         * @returns {Promise<undefined>} an empty Promise
         * @private
         */
        _updateQuickAccessDialog: async function (oDialog) {
            const oIconTabBar = oDialog.getContent()[0];
            oIconTabBar.setBusy(true);

            const oUserRecentsService = await Container.getServiceAsync("UserRecents");
            const aRecentActivities = await new Promise(function (resolve) {
                oUserRecentsService.getRecentActivity().then(
                    function (aActivities) {
                        resolve(aActivities.map(function (oActivity) {
                            oActivity.timestamp = utils.formatDate(oActivity.timestamp);
                            return oActivity;
                        }));
                    },
                    function () {
                        resolve([]);
                    }
                );
            });
            const aFrequentActivities = await new Promise(function (resolve) {
                oUserRecentsService.getFrequentActivity().then(
                    function (aActivity) {
                        resolve(aActivity);
                    },
                    function () {
                        resolve([]);
                    }
                );
            });

            this.oModel.setData({
                recentActivities: aRecentActivities,
                frequentActivities: aFrequentActivities
            });
            this._setDialogContentHeight(oDialog, Math.max(aRecentActivities.length, aFrequentActivities.length));
            oIconTabBar.setBusy(false);
        },

        _setDialogContentHeight: function (oDialog, iItems) {
            // 4rem is the height of the 1 item
            // For the calculation we assume that we need more space as half of the item
            // 2.75 is the header of IconTabBar
            let iHeight = (iItems + 0.5) * 4 + 2.75;

            if (iHeight < 18) {
                iHeight = 18;
            } else if (iHeight > 42) {
                iHeight = 42;
            }
            oDialog.setContentHeight(iHeight + "rem");
        },

        /**
         * Closes and destroys the Quick Access dialog.
         *
         * @private
         */
        _closeDialog: function () {
            this.oQuickAccessDialog.close();
        },

        /**
         * Formats a title string based on the app type.
         *
         * @param {string} sTitle Title to be formatted.
         * @param {string} sAppType The app type.
         * @returns {string} The formatted title.
         *
         * @private
         */
        _titleFormatter: function (sTitle, sAppType) {
            if (sAppType === AppType.SEARCH) {
                sTitle = "\"" + sTitle + "\"";
            }
            return sTitle;
        },

        /**
         * Formats the description based on the app type.
         *
         * @param {string} sAppType The app type.
         * @returns {string} The formatted description.
         *
         * @private
         */
        _descriptionFormatter: function (sAppType) {
            if (sAppType === AppType.SEARCH) {
                return resources.i18n.getText("recentActivitiesSearchDescription");
            }
            return AppTypeUtils.getDisplayName(sAppType);
        },

        /**
         * Navigates to the given item hash or url.
         *
         * @param {object} oEvent the press event
         * @private
         */
        _itemPress: function (oEvent) {
            const sPath = oEvent.getParameter("listItem").getBindingContextPath();
            const oItemModel = this.oModel.getProperty(sPath);

            EventHub.emit("UITracer.trace", {
                reason: "LaunchApp",
                source: "Link",
                data: {
                    targetUrl: oItemModel.url
                }
            });
            if (oItemModel.url[0] === "#") {
                window.hasher.setHash(oItemModel.url);
                this._closeDialog();
            } else {
                const bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                if (bLogRecentActivity) {
                    const oRecentEntry = {
                        title: oItemModel.title,
                        appType: AppType.URL,
                        url: oItemModel.url,
                        appId: oItemModel.url
                    };
                    Container.getRendererInternal("fiori2").logRecentActivity(oRecentEntry);
                }

                WindowUtils.openURL(oItemModel.url, "_blank");
            }
        }
    };

    return {
        /**
         * Opens and updates the Quick Access dialog and sets the given filter id as active.
         *
         * @param {string} sFilterId the id of the IconTabFilter that should be active
         * @param {string} [sFocusIdAfterClose] the DOM id of the element to focus after close
         * @returns {Promise<undefined>} after the fragment was loaded.
         * @since 1.65.0
         * @private
         */
        openQuickAccessDialog: async function (sFilterId, sFocusIdAfterClose) {
            const oDialog = await oQuickAccess._createQuickAccessDialog(sFocusIdAfterClose);
            const oIconTabBar = oDialog.getContent()[0];
            oQuickAccess._updateQuickAccessDialog(oDialog);
            oIconTabBar.setSelectedKey(sFilterId);
            oDialog.setInitialFocus(sFilterId);
            oDialog.open();
        },
        // Used for qunit tests
        _getQuickAccess: function () {
            return oQuickAccess;
        }
    };
});

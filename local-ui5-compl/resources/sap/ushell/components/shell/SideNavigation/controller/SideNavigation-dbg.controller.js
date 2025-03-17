// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/tnt/NavigationListItem",
    "sap/ui/core/CustomData",
    "sap/ui/core/EventBus",
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/utils/WindowUtils"
], function (
    ObjectPath,
    NavigationListItem,
    CustomData,
    EventBus,
    Controller,
    Device,
    JSONModel,
    Container,
    EventHub,
    UrlParsing,
    WindowUtils
) {
    "use strict";

    /**
     * @alias sap.ushell.components.shell.SideNavigation.controller.SideNavigation
     * @class
     * @classdesc Controller of the SideNavigation view.
     *
     * @param {string} sId Controller id
     * @param {object} oParams Controller parameter
     *
     * @extends sap.ui.core.mvc.Controller
     *
     * @since 1.132.0
     * @private
     */
    return Controller.extend("sap.ushell.components.shell.SideNavigation.controller.SideNavigation", /** @lends sap.ushell.components.shell.SideNavigation.controller.SideNavigation.prototype */ {

        /**
         * UI5 lifecycle method which is called upon controller initialization.
         * It gets all the required UShell services and
         * initializes the view.
         *
         * @private
         * @since 1.132.0
         */
        onInit: function () {
            const oSideNavigation = this.byId("sideNavigation");

            if (Device.support.touch) {
                oSideNavigation.addStyleClass("sapUiSizeCozy");
            } else {
                oSideNavigation.addStyleClass("sapUiSizeCompact");
            }

            this.oContainerRouter = Container.getRendererInternal().getRouter();

            this.oContainerRouter.getRoute("home").attachMatched(this._selectIndexAfterRouteChange, this);
            this.oContainerRouter.getRoute("openFLPPage").attachMatched(this._selectIndexAfterRouteChange, this);
            this.oContainerRouter.getRoute("openWorkPage").attachMatched(this._selectIndexAfterRouteChange, this);

            this._addHamburgerButton();

            this.oEnableMenuBarNavigationListener = EventHub.on("enableMenuBarNavigation").do((bEnableSideNavigation) => this.onEnableSideNavigation(bEnableSideNavigation));
            EventBus.getInstance().subscribe("sap.ushell", "appOpened", this.deselectSideNavigationEntryOnAppOpened, this);

            this.sNoneSelectedKey = "NONE";
            const oViewConfiguration = new JSONModel({
                //We need to initialize with a non-empty key to avoid flickering of the selection.
                selectedKey: this.sNoneSelectedKey,
                enableSideNavigation: true
            });

            this.getView().setModel(oViewConfiguration, "viewConfiguration");

            this.oGetDefaultSpacePromise = Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.getDefaultSpace();
                });

            this._selectIndexAfterRouteChange();
        },

        /**
        * Deselects the currently selected side navigation entry when an app is opened,
        * which removes the visual indicator from the currently selected entry.
        *
        * - It sets the selected key in the view configuration model to the value
        * of the string "sNoneSelectedKey".
        *
        * @private
        * @since 1.132.0
        */
        deselectSideNavigationEntryOnAppOpened: function () {
            this.getView().getModel("viewConfiguration").setProperty("/selectedKey", this.sNoneSelectedKey);
        },

        /**
        * Enables or disables the side navigation based on the provided flag.
        * It sets the "enableSideNavigation" property in the view configuration model to the provided value.
        *
        * @param {boolean} bEnableSideNavigation A flag indicating whether to enable or disable the side navigation.
        *
        * @private
        * @since 1.132.0
        */
        onEnableSideNavigation: function (bEnableSideNavigation) {
            this.getView().getModel("viewConfiguration").setProperty("/enableSideNavigation", bEnableSideNavigation);
        },

        /**
         * Triggered whenever a user selects a side navigation item.
         *
         * @param {sap.base.Event} oEvent The 'itemSelect' event.
         *
         * @private
         * @since 1.132.0
         */
        onSideNavigationItemSelection: function (oEvent) {
            const sSelectedNavigationEntryKey = oEvent.getParameter("item").getProperty("key");
            const oSideNavigationModel = this.getView().getModel("sideNavigation");
            let aSideNavigationEntries = oSideNavigationModel.getProperty("/");
            const oDestinationIntent = this._getNestedSideNavigationEntryByUid(aSideNavigationEntries, sSelectedNavigationEntryKey);

            if (oDestinationIntent.type === "IBN") {
                this._performNavigation(oDestinationIntent.target);
            } else if (oDestinationIntent.type === "URL") {
                this._openURL(oDestinationIntent.target);
            }
        },

        /**
        * Recursively searches for a nested side navigation entry that satisfies the provided check function.
        *
        * @param {object[]} aSideNavigationEntries An array of side navigation entries to search through.
        * @param {function} fnCheck A function that takes a side navigation entry object and returns a boolean indicating whether it satisfies the desired condition.
        * @returns {object|undefined} The matched side navigation entry object or undefined if no match is found.
        *
        * @private
        * @since 1.132.0
        */
        _getNestedSideNavigationEntry: function (aSideNavigationEntries, fnCheck) {
            return aSideNavigationEntries.reduce((oSelectedSideNavigationEntry, oSideNavigationEntry) => {
                if (oSelectedSideNavigationEntry) {
                    return oSelectedSideNavigationEntry;
                }

                if (fnCheck(oSideNavigationEntry)) {
                    return oSideNavigationEntry;
                }

                if (oSideNavigationEntry.menuEntries) {

                    return this._getNestedSideNavigationEntry(oSideNavigationEntry.menuEntries, fnCheck);
                }
            }, undefined);
        },

        /**
        * Searches for a nested side navigation entry with the specified unique
        * identifier (UID) by calling the "_getNestedSideNavigationEntry" function
        * with a custom check function.
        *
        * @param {object[]} aSideNavigationEntries An array of side navigation entries to search through.
        * @param {string} sUid The unique identifier (UID) of the side navigation entry to find.
        * @returns {object|undefined} The matched side navigation entry object or undefined if no match is found.
        *
        * @private
        * @since 1.132.0
        */
        _getNestedSideNavigationEntryByUid: function (aSideNavigationEntries, sUid) {
            function fnCheck (oSideNavigationEntry) {
                return oSideNavigationEntry.uid === sUid;
            }
            return this._getNestedSideNavigationEntry(aSideNavigationEntries, fnCheck);
        },

        /**
        * Factory function for creating a new NavigationListItem.
        *
        * - Responsible for rendering all side navigation entries upon initialization.
        *
        * @param {string} sId The ID of the NavigationListItem.
        * @param {object} oContext The context containing the side navigation entry data.
        * @returns {sap.tnt.NavigationListItem} The created NavigationListItem instance.
        *
        * @private
        * @since 1.132.0
        */
        _sideNavigationFactory: function (sId, oContext) {
            let sIcon = oContext.getProperty("icon");
            // Provide icon fallback only for Top Level Menu Entries
            if (!sIcon && this._isTopLevelEntry(oContext)) {
                sIcon = "sap-icon://document-text";
            }

            const oNewItem = new NavigationListItem(sId, {
                key: "{sideNavigation>uid}", // is not unique if used multiple times in a hierarchy
                icon: sIcon,
                text: "{sideNavigation>title}",
                enabled: "{viewConfiguration>/enableSideNavigation}",
                items: {
                    path: "sideNavigation>menuEntries",
                    factory: this._sideNavigationFactory.bind(this)
                },
                customData: [new CustomData({
                    key: "help-id",
                    value: "{= 'MenuEntry-' + ${sideNavigation>help-id}}",
                    writeToDom: "{= !!${sideNavigation>help-id}}"
                })]
            });

            return oNewItem;
        },

        /**
        * Checks for top level menu entries.
        *
        * @param {oContext} oContext The context containing the menu entry path.
        * @returns {boolean} True if top level menu entry.
        *
        * @private
        * @since 1.132.0
        */
        _isTopLevelEntry: function (oContext) {
            return oContext.getPath().split("/").length === 2;
        },

        /**
        * Performs navigation to the specified destination target using the Navigation service.
        *
        * @param {object} oDestinationTarget The destination target object containing the navigation details.
        * @returns {Promise} A promise that resolves when the navigation is completed.
        *
        * @private
        * @since 1.132.0
        */
        _performNavigation: function (oDestinationTarget) {
            return Container.getServiceAsync("Navigation").then(function (oNavigationService) {
                const oParams = {};
                oDestinationTarget.parameters.forEach(function (oParameter) {
                    if (oParameter.name && oParameter.value) {
                        oParams[oParameter.name] = [oParameter.value];
                    }
                });

                oNavigationService.navigate({
                    target: {
                        semanticObject: oDestinationTarget.semanticObject,
                        action: oDestinationTarget.action
                    },
                    params: oParams
                });
            });
        },

        /**
         * Opens the provided URL in a new browser tab.
         *
         * @param {object} destinationTarget
         *  The destination target which is used to determine the URL which should be
         *  opened in a new browser tab
         *
         * @private
         * @since 1.132.0
         */
        _openURL: function (destinationTarget) {
            WindowUtils.openURL(destinationTarget.url, "_blank");
        },

        /**
        * Selects the appropriate side navigation entry after a route change
        * based on the current hash and default space.
        *
        * - Updates the "selectedKey" property of the view configuration model,
        * which is responsible for the visual indication of the currently selected
        * side navigation entry.
        *
        * @returns {Promise} A promise that resolves when the selection is completed.
        *
        * @private
        * @since 1.132.0
        */
        _selectIndexAfterRouteChange: function () {
            const oViewConfigModel = this.getView().getModel("viewConfiguration");

            return Promise.all([
                this.oGetDefaultSpacePromise,
                this.getOwnerComponent().oMenuModelPromise
            ]).then((aResults) => {
                const oDefaultSpace = aResults[0];

                let sSelectedMenuKey;
                const sHash = window.hasher.getHash();
                const oHashParts = UrlParsing.parseShellHash(sHash);
                const aSideNavigationEntries = this.getView().getModel("sideNavigation").getProperty("/");

                if (oHashParts.semanticObject === "Shell" && oHashParts.action === "home") {
                    // Determine the user's default page and initiate loading
                    const oDefaultSpacePage = oDefaultSpace && oDefaultSpace.children && oDefaultSpace.children[0];
                    sSelectedMenuKey = (oDefaultSpacePage) ? this._getMenuUID(aSideNavigationEntries, oDefaultSpace.id, oDefaultSpacePage.id) || "" : "";
                    oViewConfigModel.setProperty("/selectedKey", sSelectedMenuKey);
                } else {
                    const sSpaceId = ObjectPath.get("params.spaceId.0", oHashParts);
                    const sPageId = ObjectPath.get("params.pageId.0", oHashParts);

                    // First evaluate the last clicked key and search for the top level entry if it matches the parameters
                    const sSelectedKey = oViewConfigModel.getProperty("/selectedKey");

                    const oSideNavigationEntry = this._getNestedSideNavigationEntryByUid(aSideNavigationEntries, sSelectedKey);
                    if (this._hasSpaceIdAndPageId(oSideNavigationEntry, sSpaceId, sPageId)) {
                        sSelectedMenuKey = oSideNavigationEntry.uid;
                    } else {
                        sSelectedMenuKey = this._getMenuUID(aSideNavigationEntries, sSpaceId, sPageId);
                    }

                    if (sSelectedMenuKey) {
                        oViewConfigModel.setProperty("/selectedKey", sSelectedMenuKey);
                    } else {
                        oViewConfigModel.setProperty("/selectedKey", this.sNoneSelectedKey);
                    }
                }
            });
        },

        /**
        * Retrieves the menu unique identifier (UID) based on the provided space ID and page ID.
        *
        * @param {object[]} aSideNavigationEntries An array of side navigation entries to search through.
        * @param {string} spaceId The space ID to match.
        * @param {string} pageId The page ID to match.
        * @returns {string|undefined} The menu UID if found, or undefined if not found.
        *
        * @private
        * @since 1.132.0
        */
        _getMenuUID: function (aSideNavigationEntries, spaceId, pageId) {
            function fnCheck (oSideNavigationEntry) {
                return this._hasSpaceIdAndPageId(oSideNavigationEntry, spaceId, pageId);
            }
            const oMatchedSideNavigationEntry = this._getNestedSideNavigationEntry(aSideNavigationEntries, fnCheck.bind(this));
            return oMatchedSideNavigationEntry && oMatchedSideNavigationEntry.uid;
        },

        /**
        * Checks if a side navigation entry has the specified space ID and page ID in its target parameters.
        *
        * @param {object} oSideNavigationEntry The side navigation entry object to check.
        * @param {string} sSpaceId The space ID to match.
        * @param {string} sPageId The page ID to match.
        * @returns {boolean} True if the side navigation entry has the specified space ID and page ID, false otherwise.
        *
        * @private
        * @since 1.132.0
        */
        _hasSpaceIdAndPageId: function (oSideNavigationEntry, sSpaceId, sPageId) {
            const aParameters = ObjectPath.get("target.parameters", oSideNavigationEntry) || [];
            const oSpaceIdParam = aParameters.some(function (oParameter) {
                return oParameter.name === "spaceId" && oParameter.value === sSpaceId;
            });
            const oPageIdParam = aParameters.some(function (oParameter) {
                return oParameter.name === "pageId" && oParameter.value === sPageId;
            });
            return oSpaceIdParam !== false && oPageIdParam !== false;
        },

        onCollapseSideNavigationPress: function () {
            const oSideNavigation = this.getView().byId("sideNavigation");
            oSideNavigation.setExpanded(!oSideNavigation.getExpanded());
        },

        /**
        * Creates a header item for the side navigation button (hamburger button) in the shell bar.
        * The button is used to expand or collapse the side navigation.
        * @returns {Promise<sap.ushell.services.Extension.Item>} A promise that resolves to the newly created header item.
        *
        * @see sap.ushell.services.Extension#createHeaderItem
        * @async
        * @since 1.132.0
        * @private
        */
        _hamburgerButtonFatory: async function () {
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            const sTooltipSideMenu = oResourceBundle.getText("ShellBar.SideNavigation.Button.Tooltip");
            const sTitle = oResourceBundle.getText("ShellBar.SideNavigation.Button.Text");
            const Extension = await Container.getServiceAsync("Extension");

            return await Extension.createHeaderItem({
                id: "sideMenuExpandCollapseBtn",
                ariaLabel: sTooltipSideMenu,
                ariaHaspopup: "dialog",
                icon: "sap-icon://menu2",
                tooltip: sTooltipSideMenu,
                text: sTitle,
                press: this.onCollapseSideNavigationPress.bind(this)
            }, {
                position: "begin"
            });
        },

         /**
         * Adds (attach) the hamburger button to the shell bar.
         * Shows the button on the home page and for all apps.
         *
         * @since 1.132.0
         * @private
         * @async
         */
        _addHamburgerButton: async function () {
            this.headerHamburgerButtonItemStart = await this._hamburgerButtonFatory();
            this.headerHamburgerButtonItemStart.showOnHome();
            this.headerHamburgerButtonItemStart.showForAllApps();
        },

        /**
         * UI5 lifecycle method which is called upon controller destruction.
         * It detaches the router events and config listeners.
         *
         * @private
         * @since 1.132.0
         */
        onExit: function () {
            this.oEnableMenuBarNavigationListener.off();
            EventBus.getInstance().unsubscribe("sap.ushell", "appOpened", this.deselectSideNavigationEntryOnAppOpened, this);
        }
    });
});

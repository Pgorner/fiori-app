// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/Title",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/base/Log",
    "sap/base/util/isEmptyObject",
    "sap/ui/Device",
    "sap/ushell/Container"
], function (
    Label,
    Text,
    Controller,
    Fragment,
    Title,
    JSONModel,
    AppConfiguration,
    Config,
    resources,
    Log,
    isEmptyObject,
    Device,
    Container
) {
    "use strict";
    return Controller.extend("sap.ushell.ui.footerbar.AboutDialog.controller", {

        /**
         * Triggered before the About Dialog is opened. Sets up it's model.
         * @since 1.89.0
         * @private
         */
        onBeforeOpen: function () {
            this._setupAboutDialogModel();
            this._updateHeaderButtonVisibility();

            // Set the first item in the list as selected
            var oAboutDialogMasterList = Fragment.byId("aboutDialogFragment", "aboutDialogEntryList");
            oAboutDialogMasterList.setSelectedItem(oAboutDialogMasterList.getItems()[0]);
        },

        /**
         * Triggered when the About Dialog's "Cancel" button is pressed.
         * @since 1.89.0
         * @private
         */
        onClose: function () {
            this._getDialog().close();
        },

        /**
         * Destroys the About Dialog control.
         * @since 1.89.0
         * @private
         */
        onAfterClose: function () {
            this._getDialog().destroy();
        },

        /**
         * Retrieves the About Dialog control by its ID, stores it into a local variable and returns it.
         * @returns {sap.m.Dialog} The About Dialog control.
         * @since 1.89.0
         */
        _getDialog: function () {
            if (!this.oAboutDialog) {
                this.oAboutDialog = Fragment.byId("aboutDialogFragment", "aboutDialog");
            }
            return this.oAboutDialog;
        },

        /**
         * Retrieve all data needed to build the dialog and store it into a model.
         * @since 1.89.0
         * @private
         */
        _setupAboutDialogModel: function () {

            var oAboutDialog = this._getDialog();

            // application info
            this._setupAppInfoModel().catch(function (error) {
                Log.error("Failed to setup application info model.", error);
            });
            // system information
            var oSystemInformation = this._getSystemInformation();
            var oSystemInformationModel = new JSONModel(oSystemInformation);
            // user environment information
            var oUserEnvironmentInformation = this._getUserEnvironmentInformation();
            var oUserEnvironmentModel = new JSONModel(oUserEnvironmentInformation);

            oAboutDialog.setModel(oSystemInformationModel, "SysInfo");
            oAboutDialog.setModel(oUserEnvironmentModel, "UserEnvInfo");
        },

        /**
         * Retrieves the SplitApp object from the About Dialog fragment.
         * @returns {sap.m.SplitApp} The SplitApp object.
         * @since 1.130.0
         * @private
         */
        _getSplitAppObj: function () {
            var oResult = Fragment.byId("aboutDialogFragment", "aboutDialogContainer");
            if (!oResult) {
                Log.info("SplitContainer object can't be found");
            }
            return oResult;
        },

        /**
         * Triggered after the master area of the SplitApp is closed.
         * @since 1.130.0
         * @private
         */
        onAfterMasterClose: function () {
            this._getSplitAppObj().setMode("ShowHideMode");
            this._updateHeaderButtonVisibility();
        },

        /**
        * Triggered when an item in the master list is pressed.
        * @param {sap.ui.base.Event} oEvent The event object.
        * @since 1.130.0
        * @private
        */
        onItemPress: function (oEvent) {
            var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
            var sToPageIdOnFragment = Fragment.createId("aboutDialogFragment", sToPageId);
            this._getSplitAppObj().toDetail(sToPageIdOnFragment);
            if (Device.system.desktop) {
                this._getSplitAppObj().hideMaster();
            }
            if (Device.system.phone) {
                this._getSplitAppObj().setMode("HideMode");
                this.onAfterMasterClose();
                this._updateHeaderButtonVisibility();
            }
        },

        /**
         * Navigates back to the master area of the SplitApp.
         * @since 1.130.0
         * @private
         */
        navigateBackToMaster: function () {
            this._getSplitAppObj().backToTopMaster();
            this._updateHeaderButtonVisibility();
        },

        /**
         * Triggered before the master area of the SplitApp is opened.
         * @since 1.130.0
         * @private
         */
        onBeforeMasterOpen: function () {
            this._updateHeaderButtonVisibility();
        },

        /**
         * Triggered when the "Menu" button is pressed.
         * @since 1.130.0
         * @private
         */
        navToggleButtonPressHandler: function () {
            if (this._getSplitAppObj().isMasterShown()) {
                this._getSplitAppObj().hideMaster();
            } else {
                this._getSplitAppObj().showMaster();
            }
            this._updateHeaderButtonVisibility();
        },

        /**
         * Updates the visibility of the header buttons.
         * @since 1.130.0
         * @private
         */
        _updateHeaderButtonVisibility: function () {
            var bIsMasterShown = this._getSplitAppObj().isMasterShown();
            var oBackButton = Fragment.byId("aboutDialogFragment", "aboutDialogNavBackButton");
            var oMenuButton = Fragment.byId("aboutDialogFragment", "aboutDialogMenuButton");
            if (Device.system.phone) {
                oBackButton.setVisible(!bIsMasterShown);
                if (!oBackButton) {
                    Log.info("oBackButton object can't be found");
                }
            } else {
                if (Device.orientation.portrait) {
                    oMenuButton.setVisible(true);
                    oMenuButton.setPressed(bIsMasterShown);
                    oMenuButton.setTooltip(resources.i18n.getText(bIsMasterShown ? "ToggleButtonHide" : "ToggleButtonShow"));
                } else {
                    oMenuButton.setVisible(false);
                }
                if (!oMenuButton) {
                    Log.info("oMenuButton object can't be found");
                }
            }
        },

        /**
         * Sets up the application information model.
         * @since 1.89.0
         * @private
         * @returns {Promise} A promise that resolves when the application information model is set up.
         */
        _setupAppInfoModel: function () {
            var oAboutDialog = this._getDialog();

            return new Promise(function (resolve, reject) {
                Container.getServiceAsync("AppLifeCycle")
                    .then(function (oAppLifeCycle) {
                        var oCurrentApplication = oAppLifeCycle.getCurrentApplication();
                        return Promise.all([
                            oCurrentApplication.getAllAppInfo(true),
                            oCurrentApplication.getAllAppInfo(false),
                            this._getContentProviderLabel(oCurrentApplication)
                        ]);
                    }.bind(this))
                    .then(function (aResults) {
                        const oMetaData = AppConfiguration.getMetadata();
                        const oAllAppInfoValues = aResults[0] || {};
                        const oAllAppInfo = aResults[1] || {};
                        const sProviderId = aResults[2];

                        // 1. title from WebGUI/WDA (PostMessage API)
                        // 2. appTitle from cFLP
                        // 3. title from metadata
                        oAllAppInfoValues.appTitle = oAllAppInfoValues.title || oAllAppInfoValues.appTitle || oMetaData.title || "";
                        oAllAppInfoValues.contentProviderLabel = sProviderId;

                        const oApplicationInformation = this._buildApplicationInformationObject(oAllAppInfoValues, oAllAppInfo);
                        oAboutDialog.setModel(new JSONModel(oApplicationInformation), "AppInfo");
                        resolve();
                    }.bind(this))
                    .catch(function (error) {
                        reject(error);
                    });

            }.bind(this));

        },

        _buildApplicationInformationObject: function (oParameterInfo, oParameterInfoExtended) {
            const aSortOrder = [
                "appTitle",
                "appId",
                "appVersion",
                "appSupportInfo",
                "technicalAppComponentId",
                "appFrameworkId",
                "appFrameworkVersion",
                "contentProviderLabel"
            ];
            var oAppInfoModelData = {
                entries: [],
                customEntries: []
            };

            aSortOrder.forEach((sParameterName) => {
                if (oParameterInfo[sParameterName]) {
                    oAppInfoModelData.entries.push({
                        parameterName: sParameterName,
                        value: `{i18n>${sParameterName}}`,
                        type: "label"
                    });

                    oAppInfoModelData.entries.push({
                        parameterName: sParameterName,
                        value: oParameterInfo[sParameterName],
                        type: "text"
                    });
                }
            });

            // CustomProperties
            const aCustomProperties = Object.keys(oParameterInfoExtended)
                .filter((sParameter) => {
                    const oParameter = oParameterInfoExtended[sParameter];
                    return oParameter.showInAbout;
                })
                .sort((sParameter1, sParameter2) => {
                    return sParameter1.toLowerCase() < sParameter2.toLowerCase() ? -1 : 1;
                })
                .map((sParameter) => {
                    const oParameter = oParameterInfoExtended[sParameter];
                    return {
                        parameterName: sParameter,
                        ...oParameter
                    };
                });

            aCustomProperties.forEach((oParameter) => {
                oAppInfoModelData.customEntries.push({
                    parameterName: oParameter.parameterName,
                    value: oParameter.label,
                    type: "label"
                });

                oAppInfoModelData.customEntries.push({
                    parameterName: oParameter.parameterName,
                    value: oParameter.value,
                    type: "text"
                });
            });

            return oAppInfoModelData;
        },

        _getSystemInformation: function () {
            const oLogonSystem = Container.getLogonSystem();
            const oSysInfoModelData = {
                entries: []
            };

            const sProductName = oLogonSystem.getProductName();
            if (sProductName) {
                oSysInfoModelData.entries.push({
                    parameterName: "productName",
                    value: "{i18n>productName}",
                    type: "label"
                });
                oSysInfoModelData.entries.push({
                    parameterName: "productName",
                    value: sProductName,
                    type: "text"
                });
            }

            const sProductVersion = oLogonSystem.getProductVersion();
            if (sProductVersion) {
                oSysInfoModelData.entries.push({
                    parameterName: "productVersion",
                    value: "{i18n>productVersionFld}",
                    type: "label"
                });
                oSysInfoModelData.entries.push({
                    parameterName: "productVersion",
                    value: sProductVersion,
                    type: "text"
                });
            }

            const sSystemName = oLogonSystem.getSystemName();
            if (sSystemName) {
                oSysInfoModelData.entries.push({
                    parameterName: "systemName",
                    value: "{i18n>systemName}",
                    type: "label"
                });
                oSysInfoModelData.entries.push({
                    parameterName: "systemName",
                    value: sSystemName,
                    type: "text"
                });
            }

            const sSystemRole = oLogonSystem.getSystemRole();
            if (sSystemRole) {
                oSysInfoModelData.entries.push({
                    parameterName: "systemRole",
                    value: "{i18n>systemRole}",
                    type: "label"
                });
                oSysInfoModelData.entries.push({
                    parameterName: "systemRole",
                    value: sSystemRole,
                    type: "text"
                });
            }

            const sTenantRole = oLogonSystem.getTenantRole();
            if (sTenantRole) {
                oSysInfoModelData.entries.push({
                    parameterName: "tenantRole",
                    value: "{i18n>tenantRole}",
                    type: "label"
                });
                oSysInfoModelData.entries.push({
                    parameterName: "tenantRole",
                    value: sTenantRole,
                    type: "text"
                });
            }

            return oSysInfoModelData;
        },

        _getUserEnvironmentInformation: function () {
            const oUser = Container.getUser();
            const oUserEnvInfoModelData = {
                entries: []
            };

            const sDeviceType = this._getDeviceType();
            if (sDeviceType) {
                oUserEnvInfoModelData.entries.push({
                    parameterName: "deviceType",
                    value: "{i18n>deviceType}",
                    type: "label"
                });
                oUserEnvInfoModelData.entries.push({
                    parameterName: "deviceType",
                    value: sDeviceType,
                    type: "text"
                });
            }

            const sTheme = oUser.getTheme();
            oUserEnvInfoModelData.entries.push({
                parameterName: "activeTheme",
                value: "{i18n>activeTheme}",
                type: "label"
            });
            oUserEnvInfoModelData.entries.push({
                parameterName: "activeTheme",
                value: sTheme,
                type: "text"
            });

            const bOptimizedForTouchInput = oUser.getContentDensity() === "cozy";
            oUserEnvInfoModelData.entries.push({
                parameterName: "optimizedForTouch",
                value: "{i18n>AppearanceContentDensityLabel}",
                type: "label"
            });
            oUserEnvInfoModelData.entries.push({
                parameterName: "optimizedForTouch",
                value: bOptimizedForTouchInput ? "{i18n>yes}" : "{i18n>no}",
                type: "text"
            });

            const bTouchSupported = this._isTouchSupported();
            oUserEnvInfoModelData.entries.push({
                parameterName: "touchSupported",
                value: "{i18n>touchSupported}",
                type: "label"
            });
            oUserEnvInfoModelData.entries.push({
                parameterName: "touchSupported",
                value: bTouchSupported ? "{i18n>yes}" : "{i18n>no}",
                type: "text"
            });

            oUserEnvInfoModelData.entries.push({
                parameterName: "userAgentFld",
                value: "{i18n>userAgentFld}",
                type: "label"
            });
            oUserEnvInfoModelData.entries.push({
                parameterName: "userAgentFld",
                value: navigator.userAgent,
                type: "text"
            });

            return oUserEnvInfoModelData;
        },

        _getContentProviderLabel: function (oApplication) {
            if (Config.last("/core/contentProviders/providerInfo/enabled")) {
                return oApplication.getSystemContext().then(function (oSystemContext) {
                    return oSystemContext.label;
                });
            }
            return Promise.resolve(undefined);
        },

        _getDeviceType: function () {
            var sDeviceType;
            if (Device.system.combi) {
                sDeviceType = "{i18n>configuration.form_factor_combi}";
            } else if (Device.system.desktop) {
                sDeviceType = "{i18n>configuration.form_factor_desktop}";
            } else if (Device.system.tablet) {
                sDeviceType = "{i18n>configuration.form_factor_tablet}";
            } else if (Device.system.phone) {
                sDeviceType = "{i18n>configuration.form_factor_phone}";
            }
            return sDeviceType;
        },

        _isTouchSupported: function () {
            return Device.support.touch && (Device.system.tablet || Device.system.phone || Device.system.combi);
        },

        itemFactory: function (id, context) {
            const sType = context.getProperty("type");

            switch (sType) {
                case "label":
                    return new Label({
                        text: context.getProperty("value")
                    });
                case "title":
                    return new Title({
                        text: context.getProperty("value")
                    });
                default: // case "text"
                    return new Text({
                        text: context.getProperty("value")
                    });
            }
        },

        /**
         * Formatter function to calculate the number of columns displayed in a form depending on the model content.
         * @param {object} modelData The object that stores the form's data.
         * @returns {int} Returns 1 in case there is a maximum of two properties in the object. Otherwise returns 2.
         * @since 1.89.0
         * @private
         */
        calculateNumberOfColumns: function (modelData) {
            if (!this.isFormVisible(modelData)) {
                return 1;
            }
            return Object.keys(modelData).length > 1 ? 2 : 1;
        },

        /**
         * Formatter function to check if a form should be visible on the About Dialog.
         * @param {object} modelData The object that stores the form's data.
         * @returns {boolean} Returns false in case the object is empty or undefined. Otherwise returns true.
         * @since 1.89.0
         * @private
         */
        isFormVisible: function (modelData) {
            return !!modelData && !isEmptyObject(modelData);
        }
    });
});

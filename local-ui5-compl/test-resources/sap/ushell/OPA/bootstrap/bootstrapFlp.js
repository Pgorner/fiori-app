// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global */
sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/bootstrap/cdm/cdm.constants",
    "sap/ushell/bootstrap/common/common.create.configcontract.core",
    "sap/ushell/bootstrap/common/common.load.launchpad",
    "sap/ushell/bootstrap/common/common.util",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/opa/utils/OpaUtils",
    "sap/ushell/state/StateManager",
    "sap/ushell/ui5service/ShellUIServiceFactory"
], function (
    deepClone,
    Element,
    EventBus,
    HashChanger,
    JSONModel,
    hasher,
    oCdmConstants,
    CommonCreateConfigcontract,
    CommonLoadLaunchpad,
    CommonUtils,
    Config,
    Container,
    OpaUtils,
    StateManager,
    ShellUIServiceFactory
) {
    "use strict";

    var BootstrapFlp = {};

    /**
     * Returns the parsed json for a specified path.
     *
     * @param {string} path The path to certain json file.
     *
     * @returns {Promise<object>} A promise which resolves with the parsed json.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp._loadConfiguration = function (path) {
        return new Promise(function (fnResolve) {
            var oModel = new JSONModel(path);
            oModel.attachRequestCompleted(function () {
                fnResolve(oModel.getData());
            });
        });
    };

    /**
     * Registers a new configuration in sap.ushell.Config.
     *
     * @param {object} configuration The configuration which should overwrite the currently active one.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp._applyConfiguration = function (configuration) {
        Config._reset();
        Config.registerConfiguration(null, CommonCreateConfigcontract.createConfigContract(configuration));

        // reset the config model
        StateManager.resetAll();
        // reset all dangling services
        ShellUIServiceFactory.reset();
    };

    /**
     * Destroys UI5 controls.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp._cleanupControlInstances = function () {
        var fnDestroy = function (sId) {
            var oControl = Element.getElementById(sId);
            if (oControl) {
                oControl.destroy();
            }
        };

        fnDestroy("defaultParametersSelector");
        fnDestroy("userSettingsDialog");
        fnDestroy("userPrefThemeSelector");
        fnDestroy("notificationsSetting--columnListItemNotifications");
        fnDestroy("detailuserPrefThemeSelector");

        var oFloatingContainerWrapper = document.getElementById("sapUshellFloatingContainerWrapper");
        if (oFloatingContainerWrapper) {
            oFloatingContainerWrapper.remove(oFloatingContainerWrapper);
        }

        // UserActionsMenu
        fnDestroy("sapUshellUserActionsMenuPopover");
        fnDestroy("aboutBtn");
        fnDestroy("logoutBtn");
        fnDestroy("openCatalogBtn");
        fnDestroy("userSettingsBtn");
        fnDestroy("ActionModeBtn");

        // ShellHeader
        fnDestroy("backBtn");
        fnDestroy("endItemsOverflowBtn");
        fnDestroy("openCatalogBtn");
        fnDestroy("ContactSupportBtn");
    };

    /**
     * Merges the configuration and creates the FLP renderer.
     *
     * @param {("cdm"|"local")} platform The platform to be used (e.g. cdm)
     * @param {string} defaultConfigPath The path to the default configuration json.
     * @param {(string|object)} [ushellConfig]
     *  The UShell configuration. Either provide a path to a json file
     *  containing the config which gets loaded automatically
     *  or directly pass a configuration object.
     *
     * @returns {Promise} A Promise which resolves as soon as the FLP is bootstrapped.
     *
     * @since 1.76.0
     * @private
     */
    BootstrapFlp.init = function (platform, defaultConfigPath, ushellConfig) {
        var oAdapterConstants = {};

        if (ushellConfig?.ushell?.opa5?.directAppHash) {
            location.hash = ushellConfig.ushell.opa5.directAppHash;
        }
        // In the future we also want to include the abap constants.
        // This currently doesn't work as it breaks the safety net. ushell_abap resources aren't loaded there.
        if (platform === "cdm") {
            oAdapterConstants = oCdmConstants.defaultConfig;
        }

        if (!this._oBootstrapFinished) {
            // sap.ushell.Container must be deleted to allow the boot-task to properly start.
            // If this does not happen, not all launchpad services will be recovered correctly
            Container.resetServices();
            this._oBootstrapFinished = new Promise(function (fnResolve) {
                this._getConfiguration(defaultConfigPath, oAdapterConstants, ushellConfig).then(function (oConfiguration) {
                    // migrate adapter config
                    CommonUtils.migrateV2ServiceConfig(oConfiguration);

                    window["sap-ushell-config"] = oConfiguration;

                    Container.init(platform).then(function () {
                        // Clear the personalization for a clean sandbox
                        Container.getServiceAsync("PersonalizationV2").then(function (oPersonalization) {
                            oPersonalization.deleteContainer("flp.settings.FlpSettings");
                            this._applyConfiguration(oConfiguration);
                            fnResolve();
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
        return this._oBootstrapFinished;
    };

    /**
     * Merges the provided bootstrap config with platform defaults, further overrides can be done via the init method.
     *
     * @param {string} defaultConfigPath The path to the default configuration json.
     * @param {object} defaultConstants The adapter constants json to be used.
     * @param {(string|object)} [ushellConfig]
     *  The UShell configuration. Either provide a path to a json file
     *  containing the config which gets loaded automatically
     *  or directly pass a configuration object.
     *
     * @returns {Promise} A promise which resolves after the configuration was applied.
     *
     * @since 1.76.0
     * @private
     */
    BootstrapFlp._getConfiguration = function (defaultConfigPath, defaultConstants, ushellConfig) {
        var oDefaultConstants = deepClone(defaultConstants);
        var oDefaultConfigPromise = this._loadConfiguration(defaultConfigPath);
        var oUshellConfigPromise = Promise.resolve();

        if (ushellConfig) {
            if (typeof ushellConfig === "string") {
                oUshellConfigPromise = this._loadConfiguration(ushellConfig);
            } else {
                oUshellConfigPromise = Promise.resolve(ushellConfig);
            }
        }

        return Promise.all([oDefaultConfigPromise, oUshellConfigPromise]).then(function (aConfigs) {
            CommonUtils.mergeConfig(oDefaultConstants, aConfigs[0], true);
            CommonUtils.mergeConfig(oDefaultConstants, aConfigs[1], true);

            // Config URLs in OPA test data are not adapted to the <base> value of the new test suite.
            // Make them to absolute URLs.
            var oServices = oDefaultConstants.services;
            var oCdm = oServices.CommonDataModel;
            var oCdmAdapterConfig = oCdm && oCdm.adapter && oCdm.adapter.config;
            if (oCdmAdapterConfig) { // not available in ABAP OPA tests
                oCdmAdapterConfig.siteDataUrl = OpaUtils.normalizeConfigPath(oCdmAdapterConfig.siteDataUrl);
            }
            return oDefaultConstants;
        });
    };

    /**
     * Calls init and places the Launchpad in the DOM
     *
     * @param {string} domId The id where to place the Launchpad.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp.placeAt = function (domId) {
        this.init().then(CommonLoadLaunchpad.bind(null, domId));
    };

    /**
     * Cleans up.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp.exit = function () {
        this._oBootstrapFinished = null;
        Container.getRendererInternal("fiori2").destroy();
        EventBus.getInstance().destroy();
        this._cleanupControlInstances();
        if (hasher && hasher.setHash) {
            hasher.setHash("Shell-home");
        }

        // reset HashChanger to avoid broken FLP flow with next bootstrap
        var oNewHashChangerInstance = new HashChanger();
        HashChanger.replaceHashChanger(oNewHashChangerInstance);

        // reset the config model
        StateManager.resetAll();
        // reset all dangling services
        ShellUIServiceFactory.reset();
    };

    return BootstrapFlp;
});

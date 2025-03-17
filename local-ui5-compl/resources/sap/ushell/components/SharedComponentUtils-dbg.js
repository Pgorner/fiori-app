// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/Device",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/ushell/Container"
], function (
    Device,
    Config,
    EventHub,
    Log,
    Component,
    Container
) {
    "use strict";

    var oSharedComponentUtils = {
        PERS_KEY: "flp.settings.FlpSettings",
        bFlpSettingsAdded: false,

        /**
         * Toggles the UserActivityLog.
         */
        toggleUserActivityLog: function () {
            EventHub.join(
                EventHub.once("CoreResourcesComplementLoaded"), // sap/ushell/UserActivityLog is preloaded as part of core-ext
                Config.on("/core/extension/SupportTicket")
            ).do((oCoreExtResult, bConfigured) => {
                sap.ui.require(["sap/ushell/UserActivityLog"], (userActivityLog) => {
                    if (bConfigured) {
                        userActivityLog.activate();
                    } else {
                        userActivityLog.deactivate();
                    }
                });
            });
        },

        /**
         * Registers component keys.
         */
        initializeAccessKeys: function () {
            if (Device.system.desktop) {
                sap.ui.require([
                    "sap/ushell/components/ComponentKeysHandler",
                    "sap/ushell/renderer/AccessKeysHandler"
                ], function (ComponentKeysHandler, AccessKeysHandler) {
                    ComponentKeysHandler.getInstance().then(function (ComponentKeysHandlerInstance) {
                        AccessKeysHandler.registerAppKeysHandler(ComponentKeysHandlerInstance.handleFocusOnMe);
                    });
                });
            }
        },

        /**
         * Retrieves the value of the given config path from the personalization service.
         * If the "enableHomePageSettings" config is explicitly set to false, the value is taken from the FLP config.
         * The personalization item ID is extracted from the given config path.
         *
         * @param {string} sConfigPath The config path.
         * @param {string} [sConfigurablePath] The config path that enables/disables changing the "sConfigPath" config.
         * @returns {Promise<any>} Resolves to the effective config value.
         */
        getEffectiveHomepageSetting: function (sConfigPath, sConfigurablePath) {
            if (Config.last(sConfigurablePath) === false) {
                // change nothing if the config is not allowed to be changed; simply return current config value
                return Promise.resolve(Config.last(sConfigPath));
            }

            var sItemID = sConfigPath.split("/").pop();
            return this._getPersonalization(sItemID)
                .then(function (sValue) {
                    if (typeof sValue === "undefined") {
                        // change nothing if the config does not yet exist in the personalization; simply return current config value
                        return Config.last(sConfigPath);
                    }
                    Config.emit(sConfigPath, sValue);
                    return sValue;
                })
                .catch(function () {
                    return Config.last(sConfigPath);
                });
        },

        /**
         * Retrieves the data of the given personalization item.
         *
         * @param {string} sItem The personalization item ID;
         * @returns {Promise<object>} Resolves to the requested config value.
         * @private
         */
        _getPersonalization: function (sItem) {
            return oSharedComponentUtils.getPersonalizer(sItem, Container.getRendererInternal("fiori2"))
                .then(function (oPersonalizer) {
                    return oPersonalizer.getPersData();
                })
                .catch(function (sError) {
                    Log.error("Failed to load " + sItem + " from the personalization", sError, "sap.ushell.components.flp.settings.FlpSettings");
                    return Promise.reject(sError);
                });
        },

        /**
         * @param {string} sItem The personalization item ID.
         * @param {object} oComponent The component the personalization is to be retrieved for.
         * @returns {Promise<sap.ushell.services.PersonalizationV2.Personalizer>} Resolves to the personalization content of the given item.
         * @private
         */
        getPersonalizer: function (sItem, oComponent) {
            return Container.getServiceAsync("PersonalizationV2")
                .then(function (oPersonalizationService) {
                    var oOwnerComponent = Component.getOwnerComponentFor(oComponent);
                    var oScope = {
                        keyCategory: oPersonalizationService.KeyCategory.FIXED_KEY,
                        writeFrequency: oPersonalizationService.WriteFrequency.LOW,
                        clientStorageAllowed: true
                    };
                    var oPersId = {
                        container: this.PERS_KEY,
                        item: sItem
                    };

                    return oPersonalizationService.getPersonalizer(oPersId, oScope, oOwnerComponent);
                }.bind(this));
        }
    };

    return oSharedComponentUtils;
});

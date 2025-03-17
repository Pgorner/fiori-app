// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "./common.constants",
    "./common.debug.mode",
    "./common.read.metatags",
    "./common.util",
    "./common.read.ushell.config.from.url",
    "sap/base/util/ObjectPath",
    "sap/base/Log",
    "sap/base/util/extend"
], function (oConstants, oDebugMode, oMetaTagReader, oUtil, oConfigFromUrl, ObjectPath, Log, extend) {
    "use strict";

    // Some settings of the ushell which are dependent on user personalisation
    // are included in the config by direct reference to their respective
    // container in the personalisation storage.
    //
    // This function transforms the stored key-value pairs into a structure the
    // ushell configuration processor understands.
    function fixUpPersonalisedSettings (oUShellConfig, sSettingPath) {
        var oPersonalizedSetting;

        if (!oUShellConfig || !sSettingPath) {
            return;
        }

        oPersonalizedSetting = ObjectPath.get(sSettingPath, oUShellConfig);

        if (oPersonalizedSetting && oPersonalizedSetting.items) {
            extend(oPersonalizedSetting, oPersonalizedSetting.items);

            delete oPersonalizedSetting.items;
            delete oPersonalizedSetting.__metadata;
        }
    }

    function createGlobalConfigs (aMetaConfigItems, oDefaultConfiguration, bDebugSources, aServerConfigItems) {
        const sConfigPropertyName = oConstants.ushellConfigNamespace;

        aMetaConfigItems = aMetaConfigItems || [];
        oDefaultConfiguration = oDefaultConfiguration || {};
        aServerConfigItems = aServerConfigItems || [];
        const oWindowConfig = window[sConfigPropertyName] || {};

        // URL param sap-ushell-xx-config-values can be used to set single config params
        // this is ONLY for simplified testing and supportability
        const oUshellConfigFromUrl = oConfigFromUrl.getConfig() || {};

        const oUShellConfig = [
            oWindowConfig,
            oDefaultConfiguration,
            ...aMetaConfigItems,
            ...aServerConfigItems,
            oUshellConfigFromUrl
        ].reduce((oMergedConfig, oConfig) => {
            /**
             * Each configuration part might miss a configuration node for v2 services.
             * Therefore we fetch the migration differences and apply it in addition.
             *
             * With this procedure each configuration part is still able to overwrite
             * previous configurations according to the configuration order.
             */

            const oMigrationConfig = oUtil.getV2ServiceMigrationConfig(oConfig);

            oUtil.mergeConfig(oMergedConfig, oMigrationConfig, true);
            oUtil.mergeConfig(oMergedConfig, oConfig, true);

            return oMergedConfig;
        }, {});

        oUShellConfig["sap-ui-debug"] = bDebugSources;

        // write the config to the global namespace in case it is not there yet
        window[sConfigPropertyName] = oUShellConfig;

        // log the config for better debugging
        Log.info("finally applied sap-ushell-config", JSON.stringify(oUShellConfig), "sap/ushell/bootstrap/common/common.boot.script");
    }

    /**
     * Activates FLP spaces (based on pages and sections therein)
     * or the classic homepage mode (based on app groups)
     * by setting the configuration switch <code>config.ushell.spaces.enabled</code> .
     *
     * @param {object} config FLP Configuration passed from backend
     */
    function setSpacesOrHomepageMode (config) {

        var bSpacesConfigurableByUser = ObjectPath.get("ushell.spaces.configurable", config);
        if (bSpacesConfigurableByUser) {

            var bSpacesEnabledByUser = ObjectPath.get("services.Container.adapter.config.userProfilePersonalization.spacesEnabled", config);

            if (bSpacesEnabledByUser === true) {
                ObjectPath.set("ushell.spaces.enabled", true, config);
            } else if (bSpacesEnabledByUser === false) {
                ObjectPath.set("ushell.spaces.enabled", false, config);
            }
        }
    }

    /**
     * Sets the sap-ushell-config based on all available sources for it (e.g. meta tags)
     *
     * @param {object} oSettings Optional default configuration.
     *
     * @returns {object} The ushell configuration.
     *
     * @private
     */
    function configureUshell (oSettings) {
        const oDefaultConfiguration = oSettings?.defaultUshellConfig;
        const aMetaConfigItems = oMetaTagReader.readMetaTags(oConstants.configMetaPrefix);

        createGlobalConfigs(aMetaConfigItems, oDefaultConfiguration, oDebugMode.isDebug(), null);

        const oUShellConfig = window[oConstants.ushellConfigNamespace];

        fixUpPersonalisedSettings(
            oUShellConfig,
            "services.Container.adapter.config.userProfilePersonalization"
        );

        setSpacesOrHomepageMode(oUShellConfig);

        return oUShellConfig;
    }

    return configureUshell;

});

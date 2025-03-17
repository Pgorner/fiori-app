// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/base/util/ObjectPath"
], function (Localization, ObjectPath) {
    "use strict";

    /**
     * Configures UI5 language based on the shell configuration.
     *
     * @param {object} oUshellConfig The ushell configuration.
     *
     * @private
     */
    function configureUI5Language (oUshellConfig) {
        var oUserProfileDefaults = ObjectPath.get("services.Container.adapter.config.userProfile.defaults", oUshellConfig);
        var sLanguageBcp47 = oUserProfileDefaults && oUserProfileDefaults.languageBcp47;

        // note: the sap-language query parameter must be considered by the server
        // and will change the language defaults read above
        // only consider BCP-47 language, don't set ABAP language (see BCP 2380072963)
        if (sLanguageBcp47) {
            Localization.setLanguage(sLanguageBcp47);
        }
    }

    return configureUI5Language;
});

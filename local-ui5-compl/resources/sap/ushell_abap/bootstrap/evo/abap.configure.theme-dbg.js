// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    // Extract theme root and user theme. Note that the user theme is in userProfile. startupConfig contains default theme.
    // Ignore URL themes, ui5 core takes care about them itself (including checks against "sap-allowed-theme-origins")
    function extractThemeParameters (oConfig) {
        let oThemeRoots;

        const oStartupConfig = oConfig?.startupConfig || {};
        const oThemeEntry = oStartupConfig.userProfile?.find((entry) => entry?.id === "THEME");

        // 1) theme from UserProfile; 2) default theme from config; 3) sap_horizon as SAP default theme
        const sTheme = oThemeEntry?.value || oStartupConfig.theme || "sap_horizon";

        let sThemeRoot = oStartupConfig.themeRoot;
        if (!sThemeRoot && oStartupConfig.client) {
            sThemeRoot = "/sap/public/bc/themes/~client-" + oStartupConfig.client;
        }
        if (sThemeRoot && !sTheme.startsWith("sap_")) { // set the theme root for the custom theme only
            oThemeRoots = {};
            oThemeRoots[sTheme] = sThemeRoot.replace(/\/?$/, "/UI5/"); // Add /UI5/, theme roots from ABAP theming service do not contain UI5 at the end.
        }
        return {theme: sTheme, themeRoots: oThemeRoots};
    }

    return extractThemeParameters;
});

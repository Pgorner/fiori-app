// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Dark Mode Support
 *
 * The service provides dark/high contrast mode detection functionality.
 * The service detects the dark/contrast mode of the browser via media query (at start)
 * and activates a corresponding theme from the set.
 *
 * According to the current W3C conventions, there are only two options - light/dark and normal/contrast,
 * where light and normal are considered as browser default ("no-preference" value is deprecated and not supported).
 * Therefore, no-preference has to be implemented in the user settings.
 * Dark mode is activated and deactivated by the user in the launchpad settings,
 * but the check of the activation is done by the calling code and not internally.
 *
 * Theme sets are retrieved via the corresponding UserInfo API.
 * If a set API is not available for a product, the two predefined vendor sets (Quartz and Horizon) are used.
 *
 * If a theme does not belong to a set, existing theme remains active disregarding the browser preference.
 * The service is disabled if a theme is provided via a url parameter.
 *
 * No media listener is used in runtime. If a user changes the browser settings,
 * the launchpad has to be restarted to see the change (no listeners for once-in-a-year events).
 *
 * For performance, no tracking of a previous theme is done. Therefore, if the user
 * disables dark mode automatic, the currently active theme remains selected. In the settings dialog,
 * the selected entry switches, for example, from ABC set to the (current) ABC High Contrast Light.
 *
 * @version 1.132.1
 * @private
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Theming",
    "sap/ushell/Container"
], function (
    Log,
    Theming,
    Container
) {
    "use strict";

    const PREFERS_DARK = "(prefers-color-scheme: dark)";
    const FORCED_COLORS = "(forced-colors: active)";
    const PREFERS_CONTRAST = "(prefers-contrast: more)"; // seems to be used in Mac OS

    // Default theme sets in case when there is no information from the server
    const _aDefaultThemeSets = [{
        id: "sap_fiori_3_set",
        type: "SET",
        label: "SAP Quartz (Set)",
        set: {
            themes: [
                {
                    id: "sap_fiori_3",
                    colorScheme: "LIGHT",
                    contrast: "LOW"
                },
                {
                    id: "sap_fiori_3_dark",
                    colorScheme: "DARK",
                    contrast: "LOW"
                },
                {
                    id: "sap_fiori_3_hcw",
                    colorScheme: "LIGHT",
                    contrast: "HIGH"
                },
                {
                    id: "sap_fiori_3_hcb",
                    colorScheme: "DARK",
                    contrast: "HIGH"
                }
            ]
        }
    },
    {
        id: "sap_horizon_set",
        type: "SET",
        label: "SAP Horizon (Set)",
        set: {
            themes: [
                {
                    id: "sap_horizon",
                    colorScheme: "LIGHT",
                    contrast: "LOW"
                },
                {
                    id: "sap_horizon_dark",
                    colorScheme: "DARK",
                    contrast: "LOW"
                },
                {
                    id: "sap_horizon_hcw",
                    colorScheme: "LIGHT",
                    contrast: "HIGH"
                },
                {
                    id: "sap_horizon_hcb",
                    colorScheme: "DARK",
                    contrast: "HIGH"
                }
            ]
        }
    }];

    /**
     * @alias sap.ushell.services.DarkModeSupport
     * @class
     * @classdesc Dark Mode service.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const DarkModeSupport = await Container.getServiceAsync("DarkModeSupport");
     *     // do something with the DarkModeSupport service
     *   });
     * </pre>
     *
     * @hideconstructor
     *
     * @since 1.72.0
     * @private
     */
    function DarkModeSupport () {}

    /**
     * @alias sap.ushell.services.DarkModeSupport.Mode
     * @since 1.72.0
     * @private
     */
    DarkModeSupport.Mode = {
        LIGHT: "LIGHT",
        DARK: "DARK"
    };

    DarkModeSupport.prototype.prefersDark = function () {
        return window.matchMedia(PREFERS_DARK).matches;
    };

    DarkModeSupport.prototype.prefersContrast = function () {
        // Windows sets forced-colors, but MacOS may use prefers-contrast for HC themes
        return window.matchMedia(FORCED_COLORS).matches || window.matchMedia(PREFERS_CONTRAST).matches;
    };

    DarkModeSupport.prototype.setup = async function () {
        if (Container.getUser().getDetectDarkMode()) {
            await this.enableDarkModeBasedOnSystem();
        }
    };

    // All browsers support the corresponding media queries.
    // The service is disabled only if the theme is provided via a url parameter.
    DarkModeSupport.prototype.canAutomaticallyToggleDarkMode = function () {
        const oUrlSearch = new URLSearchParams(window.location.search);
        if (oUrlSearch.get("sap-theme") || oUrlSearch.get("sap-ui-theme")) {
            return false;
        }
        return true;
    };

    // Check if a theme belongs to a set
    DarkModeSupport.prototype.isThemeSupportDarkMode = function (sTheme) {
        sTheme = sTheme || this._getCurrentTheme();
        return !!this._getThemeSet(sTheme);
    };

    // If the current theme belongs to a set, switch to another theme in the set
    // according to user preferences (dark/contrast)
    DarkModeSupport.prototype._toggleDarkModeBasedOnSystemColorScheme = function () {
        const sCurrentTheme = this._getCurrentTheme();
        const oThemeSet = this._getThemeSet(sCurrentTheme);
        const oCurrentTheme = this._getThemeFromSet(oThemeSet, sCurrentTheme);

        if (oCurrentTheme) {
            const sColorScheme = this.prefersDark() ? "DARK" : "LIGHT";
            const sContrast = this.prefersContrast() ? "HIGH" : "LOW";
            // find the theme that corresponds to the browser preference
            // if not found (no contrast pairs), try the dark/light pair
            const oNewTheme = this._findThemeInSet(oThemeSet, sColorScheme, sContrast) ||
                              this._findThemeInSet(oThemeSet, sColorScheme, oCurrentTheme.contrast);
            if (oNewTheme?.id) {
                Container.getUser().applyTheme(oNewTheme.id);
            }
        }
    };

    DarkModeSupport.prototype._applyDefaultUserTheme = function () {
        var oUser = Container.getUser();
        if (oUser.constants && oUser.constants.themeFormat) {
            oUser.applyTheme(oUser.getTheme(oUser.constants.themeFormat.ORIGINAL_THEME));
        }
    };

    // Activate/deactivate media listener to react on the change immediately
    DarkModeSupport.prototype._toggleMediaListener = function (bActive) {
        if (bActive && !this.fnOnMediaChange) {
            this.fnOnMediaChange = this._toggleDarkModeBasedOnSystemColorScheme.bind(this);
            window.matchMedia(PREFERS_DARK).addEventListener("change", this.fnOnMediaChange);
        }
        if (!bActive && this.fnOnMediaChange) {
            window.matchMedia(PREFERS_DARK).removeEventListener("change", this.fnOnMediaChange);
            this.fnOnMediaChange = null;
        }
    };

    /**
     * Enable dark mode detection.
     * If system does not support the mode detection, the warning will be logged in console.
     *
     * @private
     */
    DarkModeSupport.prototype.enableDarkModeBasedOnSystem = async function () {
        if (!this.canAutomaticallyToggleDarkMode()) {
            Log.warning("Automatic dark mode detection is disabled when the theme is provided via url parameter");
            return;
        }

        // request theme sets only if the theme can be automatically switched
        const oUserInfo = await Container.getServiceAsync("UserInfo");
        // UserInfo service requests theme list together with sets
        let oThemeList;
        if (oUserInfo?.getThemeList) {
            oThemeList = await oUserInfo.getThemeList();
        }

        this._aThemeSets = oThemeList?.sets?.length ? oThemeList.sets : _aDefaultThemeSets;
        //set the correct theme mode based on the current system preference
        this._toggleDarkModeBasedOnSystemColorScheme();
        this._toggleMediaListener(true);
    };

    DarkModeSupport.prototype.disableDarkModeBasedOnSystem = function () {
        this._toggleMediaListener(false);
        this._applyDefaultUserTheme(); // restore the default theme from settings
    };

    DarkModeSupport.prototype.toggleDetection = function (bActive) {
        if (bActive) {
            this.enableDarkModeBasedOnSystem();
        } else {
            this.disableDarkModeBasedOnSystem();
        }
    };

    DarkModeSupport.prototype._getCurrentTheme = function () {
        return Theming.getTheme();
    };

    // If a theme id belongs to a set, return the set
    DarkModeSupport.prototype._getThemeSet = function (sTheme) {
        return (this._aThemeSets || []).find((oSet) => {
            return !!oSet.set.themes?.find?.((theme) => theme?.id === sTheme);
        });
    };

    // Get the theme data from a set
    DarkModeSupport.prototype._getThemeFromSet = function (oThemeSet, sTheme) {
        return oThemeSet?.set.themes.find((theme) => theme.id === sTheme);
    };

    // Get a theme corresponding to the required criteria from a set
    DarkModeSupport.prototype._findThemeInSet = function (oThemeSet, sColorScheme, sContrast) {
        return oThemeSet?.set.themes.find(
            (theme) => theme?.colorScheme === sColorScheme && theme?.contrast === sContrast
        );
    };

    DarkModeSupport.hasNoAdapter = true;

    return DarkModeSupport;
}, true /* bExport */);

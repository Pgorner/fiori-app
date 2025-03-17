// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/AppConfiguration",
    "sap/ui/Device",
    "sap/ushell/Config",
    "sap/ushell/utils",
    "sap/ui/performance/Measurement",
    "sap/ui/util/Mobile",
    "sap/ui/core/Theming",
    "sap/ushell/Container",
    "sap/base/util/deepEqual"
], function (
    AppConfiguration,
    Device,
    Config,
    ushellUtils,
    Measurement,
    Mobile,
    Theming,
    Container,
    deepEqual
) {
    "use strict";

    function AppMeta () {
        /**
         * Helper function to get the favicon image URL based on a given theme parameter.
         */
        this.bIconSet = {};

        this._getFavicon = async function () {
            let [sFavicon] = await ushellUtils.getThemingParameters(["sapUiShellFavicon"]);
            let bCustomFavicon = false;
            if (sFavicon) { // custom theme favicon
                var match = /url[\s]*\('?"?([^'")]*)'?"?\)/.exec(sFavicon);
                if (match) {
                    sFavicon = match[1];
                    bCustomFavicon = true;
                } else if (sFavicon === "''" || sFavicon === "none") {
                    sFavicon = null;
                }
            }

            var sConfigFavicon = Config.last("/core/shell/favIcon");
            if (sConfigFavicon && (sFavicon === null || sFavicon === undefined)) { // configuration favicon
                sFavicon = sConfigFavicon;
                bCustomFavicon = true;
            }

            if (!sFavicon) { // default favicon
                var sModulePath = sap.ui.require.toUrl("sap/ushell");
                sFavicon = sModulePath + "/themes/base/img/launchpad_favicon.ico";
            }

            return {
                favicon: sFavicon,
                isCustomFavicon: bCustomFavicon
            };
        };

        this.getAppIcon = function () {
            var sIcon = "sap-icon://folder";
            var appMetaData = AppConfiguration.getMetadata();
            if (appMetaData && appMetaData.icon) {
                sIcon = appMetaData.icon;
            }
            return sIcon;
        };

        this.setAppIcons = function () {
            // performance debug
            Measurement.start("FLP:ShellController.setAppIcons", "setValues", "FLP");
            Theming.attachApplied(() => this.setValues());

            Measurement.end("FLP:ShellController.setAppIcons");
        };

        this.setValues = async function () {
            var sModulePath = sap.ui.require.toUrl("sap/ushell");
            var oDefaultFavicon = await this._getFavicon();
            var sFavicon = oDefaultFavicon.favicon;

            if (oDefaultFavicon.isCustomFavicon) {
                const oIconArgs = {
                    phone: sFavicon,
                    "phone@2": sFavicon,
                    tablet: sFavicon,
                    "tablet@2": sFavicon,
                    favicon: sFavicon,
                    precomposed: false
                };

                if (deepEqual(this.bIconSet, oIconArgs)) {
                    return;
                }

                Mobile.setIcons(oIconArgs);
                this.bIconSet = oIconArgs;
            } else {
                const oIconArgs = {
                    phone: sModulePath + "/themes/base/img/launchicons/phone-icon_120x120.png",
                        "phone@2": sModulePath + "/themes/base/img/launchicons/phone-retina_180x180.png",
                    tablet: sModulePath + "/themes/base/img/launchicons/tablet-icon_152x152.png",
                    "tablet@2": sModulePath + "/themes/base/img/launchicons/tablet-retina_167x167.png",
                    favicon: sFavicon,
                    precomposed: false
                };

                if (deepEqual(this.bIconSet, oIconArgs)) {
                    return;
                }

                Mobile.setIcons(oIconArgs);
                this.bIconSet = oIconArgs;
            }
        };

        // The following logic is applied for compact/cozy:
        // - Pure touch devices: always cozy. Other settings are ignored.
        // - Desktop and combi (laptops with a touch screen):
        // -- If the application supports only one (compact or cozy), apply that one;
        // -- If the application supports both, use the user preference from settings;
        // -- If the application supports both and no user preference, take device default,
        //    (device default is compact for desktop and cozy for combi).

        // If application supports only one density, force it on desktop/combi.
        // Otherwise, the same behavior as in _applyContentDensityClass.
        this._applyContentDensityByPriority = async function (isCompact, isUserChange) {
            if (isCompact === undefined) {
                const appMetaData = AppConfiguration.getMetadata();
                if (appMetaData.compactContentDensity && !appMetaData.cozyContentDensity) {
                    isCompact = true;
                } else if (!appMetaData.compactContentDensity && appMetaData.cozyContentDensity) {
                    isCompact = false;
                }
            }
            await this._applyContentDensityClass(isCompact, isUserChange);
        };

        this._applyContentDensityClass = async function (isCompact, isUserChange) {
            function setClasses(compact) {
                document.body.classList.toggle("sapUiSizeCompact", compact);
                document.body.classList.toggle("sapUiSizeCozy", !compact);

                if (isUserChange === true) {
                    sap.ui.require(["sap/ushell/components/applicationIntegration/application/PostMessageUtils"], function (PostMessageUtils) {
                        PostMessageUtils.postMessageToMultipleIframes("sap.ushell.appRuntime", "uiDensityChange", { isTouch: (compact ? "0" : "1") });
                    });
                }
            }

            // on pure touch devices, force cozy (app support and user preference are both ignored)
            if (!Device.system.desktop && !Device.system.combi) {
                isCompact = false;
            }

            // apply user preference only on desktop/combi and only when the app supports both densities
            if (isCompact === undefined) {
                const userInfoService = await Container.getServiceAsync("UserInfo");
                const sContentDensity = userInfoService.getUser?.()?.getContentDensity();
                if (sContentDensity === "compact") {
                    isCompact = true;
                } else if (sContentDensity === "cozy") {
                    isCompact = false;
                } else {
                    isCompact = this._isCompactContentDensityByDevice();
                }
            }
            setClasses(!!isCompact);
        };

        // Default content density for touch (including combi) devices is cozy.
        this._isCompactContentDensityByDevice = function () {
            return !Device.support.touch;
        };

        this.restore = function () {
            this._applyContentDensityByPriority();
            this.setAppIcons();
        };
    }

    return new AppMeta();
}, /* bExport= */ true);

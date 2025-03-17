// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

function getUrlParams () {
    "use strict";

    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    vars.demoConfig = "fioriDemoConfigIsolation";
    return vars;
}

var configFileUrl = decodeURIComponent(getUrlParams().configFileUrl),
    sapUshellConfig = {
        flpPlatform: "DEMO",
        services: {
            Container: {
                adapter: {
                    config: {
                        image: "img/283513_SAP.jpg"
                    }
                }
            },

            NavTargetResolution: {
                config: {
                    // enable to inject the NavTarget for #Test-url etc. directly via url parameters
                    // .../FioriLaunchpad.html?
                    //   sap-ushell-test-url-url=%2Fushell%2Ftest-resources%2Fsap%2Fushell%2Fdemoapps%2FAppNavSample&
                    //   sap-ushell-test-url-additionalInformation=SAPUI5.Component%3Dsap.ushell.demo.AppNavSample
                    //   #Test-url
                    allowTestUrlComponentConfig: true
                }
            },
            SupportTicket: {
                // service has to be enabled explicitly for the demo platform
                config: {
                    enabled: true
                }
            },
            AllMyApps: {
                config: {
                    enabled: true,
                    showHomePageApps: true,
                    showCatalogApps: true,
                    showExternalProviders: true
                }
            },
            UserInfo: {
                adapter: {
                    config: {
                        themes: [
                            { id: "sap_belize_plus", name: "SAP Belize Plus"},
                            { id: "sap_belize", name: "SAP Belize"},
                            { id: "theme1_id", name: "Custom Theme"},
                            { id: "sap_fiori_3_hcb", name: "SAP Quartz HCB"},
                            { id: "sap_fiori_3_hcw", name: "SAP Quartz HCW"},
                            { id: "sap_fiori_3", name: "SAP Quartz Light"},
                            { id: "sap_fiori_3_dark", name: "SAP Quartz Dark"},
                            { id: "sap_horizon", name: "SAP Morning Horizon"},
                            { id: "sap_horizon_dark", name: "SAP Evening Horizon"},
                            { id: "sap_horizon_hcw", name: "SAP HCW (SAP Horizon)"},
                            { id: "sap_horizon_hcb", name: "SAP HCB (SAP Horizon)"}
                        ]
                    }
                }
            }
        },
        ushell: {
            home: {
                featuredGroup: {
                    enable: false
                }
            }
        },
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        sessionTimeoutIntervalInMinutes: 30,
                        sessionTimeoutReminderInMinutes: 25,
                        enableNotificationsUI: false,
                        enableSetTheme: true,
                        enableSetLanguage: true,
                        enableHelp: true,
                        enablePersonalization: true,
                        preloadLibrariesForRootIntent: false,
                        enableRecentActivity: true,
                        enableRecentActivityLogging: true,
                        enableContentDensity: true,
                        enableUserDefaultParameters: true,
                        enableBackGroundShapes: true,
                        disableAppFinder: false,
                        moveContactSupportActionToShellHeader: true,
                        enableUserImgConsent: false,
                        sizeBehavior: "Responsive",
                        title: "Welcome FLP User, this is a very long long long long longtitle",
                        enableAutomaticSignout: false,
                        enableFeaturePolicyInIframes: false,
                        applications: {
                            "Shell-home": {
                                optimizeTileLoadingThreshold: 200,
                                enableEasyAccess: true,
                                enableEasyAccessSAPMenu: true,
                                enableEasyAccessSAPMenuSearch: true,
                                enableEasyAccessUserMenu: true,
                                enableEasyAccessUserMenuSearch: true,
                                enableCatalogSearch: true,
                                enableCatalogTagFilter: true,
                                enableActionModeMenuButton: true,
                                disableSortedLockedGroups: false,
                                enableTileActionsIcon: false,
                                appFinderDisplayMode: "appBoxes", //"tiles"
                                enableHideGroups: true,
                                homePageGroupDisplay: "scroll",
                                enableHomePageSettings: true
                            }
                        },
                        rootIntent: "Shell-home",
                        esearch: {
                            searchBusinessObjects: true
                        }
                    }
                }
            }
        },
        bootstrapPlugins: {
            AppBeforeCloseEventPlugin: {
                component: "sap.ushell.demo.AppBeforeCloseEvent",
                url: "../../../../../test-resources/sap/ushell/demoapps/AppBeforeCloseEvent"
            },
            YellowBoxPlugin: {
                component: "sap.ushell.demo.BootstrapPluginSample.CFLPPluginsSample.yellowBoxPlugin",
                url: "../../../../../test-resources/sap/ushell/demoapps/BootstrapPluginSample/CFLPPluginsSample/YellowBoxPlugin",
                enabled: true,
                config: {
                    "sap-plugin-agent": true,
                    "sap-plugin-agent-id": "BlueBoxPlugin"
                }
            }
        }
    };

var oXHR = new XMLHttpRequest();
if (configFileUrl !== "undefined") {
    oXHR.open("GET", configFileUrl, false);
    oXHR.onreadystatechange = function () {
        "use strict";
        if (this.status === 200 && this.readyState === 4) {
            sapUshellConfig = JSON.parse(oXHR.responseText);
        }
    };
    oXHR.send();
}

window["sap-ushell-config"] = sapUshellConfig;

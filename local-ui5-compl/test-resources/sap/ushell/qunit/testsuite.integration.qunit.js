// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(function () {
    "use strict";

    return {
        name: "Integration TestSuite for sap.ushell",
        defaults: {
            qunit: {
                version: 2,
                testTimeout: 60000
            },
            sinon: {
                version: 4
            },
            ui5: {
                libs: ["sap.ui.core", "sap.m", "sap.ui.layout", "sap.ushell"],
                language: "en"
            },
            loader: {
                paths: {
                    "sap/ushell/test": "test-resources/sap/ushell/test",
                    "sap/ushell/cdmLiveSiteData": "test-resources/sap/ushell/cdmLiveSiteData",
                    "sap/ushell/cdmSiteData": "test-resources/sap/ushell/cdmSiteData",
                    "sap/ushell/demo": "test-resources/sap/ushell/demoapps",
                    "sap/ushell/shells/demo": "test-resources/sap/ushell/shells/demo",
                    "sap/ushell": "resources/sap/ushell",
                    "sap/ushell/opa": "test-resources/sap/ushell/OPA",
                    "sap/ushell/testUtils": "test-resources/sap/ushell/test/utils"
                }
            },
            coverage: {
                only: ["sap/ushell"],
                branchTracking: true
            },
            page: "test-resources/sap/ushell/qunit/teststarter.integration.qunit.html?test={name}",
            beforeBootstrap: "sap/ushell/test/utils/QUnitNamespaceExtension",
            autostart: true,
            reorder: false,
            bootCore: true
        },
        tests: {
            "../test/adapters/cdm/v3/_LaunchPage/readUtils.integration": {
                title: "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils.integration"
            },
            "../test/adapters/cflp/UserDefaultParameterPersistence.integration": {
                title: "sap/ushell/adapters/cflp/UserDefaultParameterPersistence.integration",
                loader: {
                    paths: {
                        "sap/ushell/renderer": "../../../../../../sap/ushell/renderer/"
                    }
                }
            },
            "../test/bootstrap/SchedulingAgent.integration": {
                title: "sap/ushell/bootstrap/SchedulingAgent.integration"
            },
            "../test/components/shell/Settings/UserSettings.integration": {
                group: "QUnit",
                title: "UserSettings - integration test - grouped entries as tabs"
            },
            "../test/state/KeepAlive.integration": {
                group: "QUnit",
                title: "sap/ushell/state/KeepAlive.integration"
            },
            "../test/state/StateManager.integration": {
                group: "QUnit",
                title: "sap/ushell/state/StateManager.integration"
            },
            WorkPageBuilderEditMode: {
                group: "OPA, CEP WorkpageBuilder",
                title: "CEP WorkpageBuilder Edit Mode",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/workPageBuilder/journeys/EditMode"
                    }
                }
            },
            WorkPageBuilderDisplayMode: {
                group: "OPA, CEP WorkpageBuilder",
                title: "CEP WorkpageBuilder DisplayMode",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/workPageBuilder/journeys/DisplayMode"
                    }
                }
            },
            // CEPSearchResult: {
            //     group: "OPA, CEP SearchResult",
            //     title: "CEP SearchResult Application",
            //     module: "test-resources/sap/ushell/OPA/JourneyExecutor",
            //     autostart: false,
            //     loader: {
            //         paths: {
            //             journey: "test-resources/sap/ushell/OPA/tests/cepsearchresult/journeys/SearchAppView"
            //         }
            //     }
            // },
            ContentFinder: {
                group: "OPA, CEP ContentFinder",
                title: "CEP ContentFinder",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/contentFinder/journeys/General"
                    }
                }
            },
            ContentFinderStandalone: {
                group: "OPA, CEP ContentFinder",
                title: "CEP ContentFinder Standalone (Fullscreen)",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/contentFinderStandalone/journeys/General"
                    }
                }
            },
            /**
            * @deprecated since 1.117
            */
            Accessibility: {
                group: "OPA, Classical FLP",
                title: "Classic Homepage Accessibility",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/Accessibility"
                    }
                }
            },
            /**
            * @deprecated since 1.117
            */
            AnchorNavigationBar: {
                group: "OPA, Classical FLP",
                title: "AnchorNavigationBar",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/AnchorNavigationBar"
                    }
                }
            },
            /**
            * @deprecated since 1.117
            */
            AppFinder: {
                group: "OPA, Classical FLP",
                title: "AppFinder",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/AppFinder"
                    }
                }
            },
            /**
            * @deprecated since 1.117
            */
            Bookmark: {
                group: "OPA, Classical FLP",
                title: "Bookmark",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/demoapps/journeys/BookmarkAppClassicHomepage"
                    }
                }
            },
            EndItemsOverflow: {
                group: "OPA, Spaces mode",
                title: "EndItemsOverflow",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/header/journeys/EndItemsOverflow"
                    }
                }
            },
            FloatingContainer: {
                group: "OPA, Spaces mode",
                title: "FloatingContainer",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/header/journeys/FloatingContainer",
                        "sap/ushell/demo/PluginAddDummyCopilot/component": "test-resources/sap/ushell/demoapps/BootstrapPluginSample/PluginAddDummyCopilot/component",
                        "sap/ushell/demo/PluginAddDummyCopilot/component/controller": "test-resources/sap/ushell/demoapps/BootstrapPluginSample/PluginAddDummyCopilot/component/controller",
                        "sap/ushell/demo/PluginAddDummyCopilot": "test-resources/sap/ushell/demoapps/BootstrapPluginSample/PluginAddDummyCopilot"
                    }
                }
            },
            UserActionsMenu: {
                group: "OPA, Spaces mode",
                title: "UserActionsMenu",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/header/journeys/UserActionsMenu"
                    }
                }
            },
            TileSize: {
                group: "OPA, Spaces mode",
                title: "TileSize",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/homepage/journeys/TileSize"
                    }
                }
            },
            DisplayFormatCdm: {
                group: "OPA, Display format",
                title: "DisplayFormatCdm",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        "sap/ushell/demotiles": "test-resources/sap/ushell/demotiles",
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/DisplayFormatCdm"
                    }

                }
            },
            // BCP Incident: 2280105407
            //DisplayFormatAbap: {
            //    group: "OPA, Display format",
            //    title: "DisplayFormatAbap",
            //    module: "test-resources/sap/ushell/OPA/JourneyExecutor",
            //    autostart: false,
            //    loader: {
            //        paths: {
            //            "sap/ushell/demotiles": "test-resources/sap/ushell/demotiles",
            //            journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/DisplayFormatAbap"
            //        }
            //    }
            //},
            AppExtensionsIsolated: {
                group: "OPA, Isolation",
                title: "AppExtensions",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/isolation/journeys/AppExtensionsIsolated"
                    }
                }
            },
            // JiRa: FLPCOREANDUX-9216
            //AccessibilitySpaces: {
            //    group: "OPA, Spaces mode",
            //    title: "AccessibilitySpaces",
            //    module: "test-resources/sap/ushell/OPA/JourneyExecutor",
            //    autostart: false,
            //    loader: {
            //        paths: {
            //            journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/Accessibility"
            //        }
            //    }
            //},
            AppFinderSpaces: {
                group: "OPA, Spaces mode",
                title: "AppFinderSpaces",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/AppFinder"
                    }
                }
            },
            AppFinderWithoutSectionId: {
                group: "OPA, Spaces mode",
                title: "AppFinderSpaces",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/AppFinderWithoutSectionId"
                    }
                }
            },
            BookmarkApp: {
                group: "OPA, Spaces mode",
                title: "Bookmark",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/demoapps/journeys/BookmarkAppSpacesMode"
                    }
                }
            },
            BookmarkSpaces: {
                group: "OPA, Spaces mode",
                title: "BookmarkSpaces",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/Bookmark"
                    }
                }
            },
            EditMode: {
                group: "OPA, Spaces mode",
                title: "EditMode",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/EditMode"
                    }
                }
            },
            HierarchyMenu: {
                group: "OPA, Spaces mode",
                title: "HierarchyMenu",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/HierarchyMenu"
                    }
                }
            },
            HomeApp: {
                group: "OPA, Spaces mode",
                title: "HomeApp",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/HomeApp"
                    }
                }
            },
            MenuBarPersonalization: {
                group: "OPA, Spaces mode",
                title: "MenuBarPersonalization",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/MenuBarPersonalization"
                    }
                }
            },
            MenuBarAccessibility: {
                group: "OPA, Spaces mode",
                title: "MenuBarAccessibility",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/MenuBarAccessibility"
                    }
                }
            },
            MenuBarPersonalizationWithoutHomeApp: {
                group: "OPA, Spaces mode",
                title: "MenuBarPersonalizationWithoutHomeApp",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/MenuBarPersonalizationWithoutHomeApp"
                    }
                }
            },
            RuntimeTests: {
                group: "OPA, Spaces mode",
                title: "RuntimeTests",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/RuntimeTests"
                    }
                }
            },
            AboutDialog: {
                group: "OPA, miscellaneous",
                title: "AboutDialog",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/userSettings/journeys/AboutDialog"
                    }
                }
            },
            AllMyAppsMenu: {
                group: "OPA, miscellaneous",
                title: "AllMyAppsMenu",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/spacesMode/journeys/AllMyAppsMenu"
                    }
                }
            },
            FlpBootstrap: {
                group: "OPA, miscellaneous",
                title: "FlpBootstrap",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/FlpBootstrap",
                        "sap/ushell/shells/sandbox": "test-resources/sap/ushell/shells/sandbox",
                        "sap/ushell/shells/cdm": "test-resources/sap/ushell/shells/cdm"
                    }
                }
            },
            UserDefaults: {
                group: "OPA, miscellaneous",
                title: "UserDefaults",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/userSettings/journeys/UserDefaults",
                        sandbox: "test-resources/sap/ushell/bootstrap/sandbox"
                    }
                }
            },
            basicIsolationAppLoad: {
                group: "OPAtests",
                title: "basicIsolationAppLoad",
                module: "test-resources/sap/ushell/test/opaTests/basicIsolationAppLoad",
                autostart: true
            },
            CozyCompact: {
                group: "OPAtests",
                title: "CozyCompact",
                module: "test-resources/sap/ushell/test/opaTests/cozyCompact/CozyCompact"
            },
            PersonalizationRestart: {
                group: "OPAtests",
                title: "PersonalizationRestart",
                module: "test-resources/sap/ushell/test/opaTests/rta/PersonalizationRestart"
            },
            VariantsNavigation: {
                group: "OPAtests",
                title: "VariantsNavigation",
                module: "test-resources/sap/ushell/test/opaTests/rta/VariantsNavigation"
            },
            stateLean: {
                group: "OPAtests",
                title: "stateLean",
                module: "test-resources/sap/ushell/test/opaTests/stateLean/stateLean"
            },
            // FESR tests have impact on other tests, so we execute them at the latest.
            FESRDeepLink: {
                group: "OPA, Spaces mode",
                title: "FESRDeepLink",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/FESR/journeys/DeepLink"
                    }
                }
            },
            FESRCustomHomepage: {
                group: "OPA, Spaces mode",
                title: "FESRCustomHomepage",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/FESR/journeys/CustomHomepage"
                    }
                }
            },
            FESRPageRuntime: {
                group: "OPA, Spaces mode",
                title: "FESRPageRuntime",
                module: "test-resources/sap/ushell/OPA/JourneyExecutor",
                autostart: false,
                loader: {
                    paths: {
                        journey: "test-resources/sap/ushell/OPA/tests/FESR/journeys/PagesRuntime"
                    }
                }
            }
        }
    };
});

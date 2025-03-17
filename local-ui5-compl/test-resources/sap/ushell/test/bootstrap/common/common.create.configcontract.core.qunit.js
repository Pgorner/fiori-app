// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.create.configcontract.core.js
 */
sap.ui.define([
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.create.configcontract.core",
    "sap/ushell/bootstrap/common/common.debug.mode"
], function (
    testUtils,
    CommonCreateConfigContract,
    oDebugMode
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.createSandbox({});
    var oDefaultContract = {
        core: { // the unified shell core
            extension: {
                SupportTicket: false,
                enableHelp: false
            },
            services: {
                allMyApps: {
                    enabled: true,
                    showHomePageApps: true,
                    showCatalogApps: true
                }
            },
            navigation: {
                enableInPlaceForClassicUIs: {
                    GUI: false,
                    WDA: false,
                    WCF: true
                },
                enableWdaLocalResolution: true,
                enableWebguiLocalResolution: true,
                flpURLDetectionPattern: "[/]FioriLaunchpad.html[^#]+#[^-]+?-[^-]+",
                enableWdaCompatibilityMode: false
            },
            spaces: {
                enabled: false,
                configurable: false,
                myHome: {
                    enabled: false,
                    myHomeSpaceId: null,
                    myHomePageId: null,
                    presetSectionId: "3WO90XZ1DX1AS32M7ZM9NBXEF",
                    userEnabled: true
                },
                extendedChangeDetection: { enabled: true },
                homeNavigationTarget: undefined,
                currentSpaceAndPage: undefined,
                hideEmptySpaces: {
                    enabled: false,
                    userEnabled: true
                }
            },
            workPages: {
                enabled: false,
                contentApiUrl: "/cep/graphql",
                myHome: {
                    pageId: null
                },
                tileCard: false,
                customTileCard: false,
                component: {
                    name: "sap.ushell.components.workPageRuntime",
                    asyncHints: {
                        preloadBundles: [
                            "sap/ushell/preload-bundles/workpage-rt-common.js",
                            "sap/ushell/preload-bundles/workpage-rt-0.js",
                            "sap/ushell/preload-bundles/workpage-rt-1.js",
                            "sap/ushell/preload-bundles/workpage-rt-2.js",
                            "sap/ushell/preload-bundles/workpage-rt-3.js"
                        ]
                    },
                    addCoreResourcesComplement: false
                },
                defaultComponent: {
                    name: "sap.ushell.components.workPageRuntime",
                    asyncHints: {
                        preloadBundles: [
                            "sap/ushell/preload-bundles/workpage-rt-common.js",
                            "sap/ushell/preload-bundles/workpage-rt-0.js",
                            "sap/ushell/preload-bundles/workpage-rt-1.js",
                            "sap/ushell/preload-bundles/workpage-rt-2.js",
                            "sap/ushell/preload-bundles/workpage-rt-3.js"
                        ]
                    }
                },
                runtimeSwitcher: true,
                contentFinderStandalone: false,
                enableSmartBusiness: true
            },
            homeApp: {
                enabled: false,
                component: {}
            },
            menu: {
                enabled: false,
                visibleInAllStates: false,
                personalization: {
                    enabled: false
                },
                position: "Top"
            },
            menuQueryAvailable: false,
            darkMode: {
                enabled: false,
                supportedThemes: [{
                    dark: "sap_fiori_3_dark",
                    light: "sap_fiori_3"
                }, {
                    dark: "sap_fiori_3_hcb",
                    light: "sap_fiori_3_hcw"
                }, {
                    dark: "sap_horizon_dark",
                    light: "sap_horizon"
                }, {
                    dark: "sap_horizon_hcb",
                    light: "sap_horizon_hcw"
                }]
            },
            companyLogo: {
                accessibleText: "",
                url: ""
            },
            contentProviders: {
                providerInfo: {
                    enabled: false,
                    userConfigurable: false,
                    showContentProviderInfoOnVisualizations: false
                }
            },
            productSwitch: {
                enabled: false,
                url: ""
            },
            userPreferences: {
                dialogTitle: "Settings",
                isDetailedEntryMode: false,
                activeEntryPath: null,
                entries: [],
                profiling: []
            },
            userSettings: {
                displayUserId: false
            },
            shell: {
                cacheConfiguration: {},
                enablePersonalization: true,
                enableAbout: true,
                enableRecentActivity: true,
                enableRecentActivityLogging: true,
                enableFiori3: true,
                sessionTimeoutIntervalInMinutes: -1,
                enableFeaturePolicyInIframes: true,
                enableOpenIframeWithPost: true,
                favIcon: undefined,
                enableMessageBroker: true,
                enablePersistantAppstateWhenSharing: false,
                homePageTitle: "",
                windowTitleExtension: "",
                useAppTitleFromNavTargetResolution: [],
                intentNavigation: false,
                model: {
                    enableBackGroundShapes: false,
                    personalization: undefined,
                    contentDensity: undefined,
                    setTheme: undefined,
                    userDefaultParameters: undefined,
                    disableHomeAppCache: undefined,
                    enableHelp: undefined,
                    enableTrackingActivity: undefined,
                    searchAvailable: false,
                    enableSAPCopilotWindowDocking: undefined,
                    searchFiltering: true,
                    searchTerm: "",
                    isPhoneWidth: false,
                    enableNotifications: false,
                    enableNotificationsUI: false,
                    notificationsCount: 0,
                    currentViewPortState: "Center",
                    allMyAppsMasterLevel: undefined,
                    userStatus: undefined,
                    userStatusUserEnabled: true,
                    migrationConfig: undefined,
                    shellAppTitleData: {
                        currentViewInPopover: "navigationMenu",
                        enabled: false,
                        showGroupsApps: false,
                        showCatalogsApps: false,
                        showExternalProvidersApps: false
                    },
                    userImage: {
                        personPlaceHolder: null,
                        account: "sap-icon://account"
                    },
                    shellAppTitleState: "",
                    showRecentActivity: true
                }
            },
            shellHeader: {
                rootIntent: "",
                homeUri: ""
            },
            state: {
                shellMode: ""
            },
            site: {
                siteId: null
            },
            home: {
                disableSortedLockedGroups: false,
                draggedTileLinkPersonalizationSupported: true,
                editTitle: false,
                enableHomePageSettings: true,
                enableRenameLockedGroup: false,
                enableTileActionsIcon: false,
                enableTransientMode: false,
                featuredGroup: {
                    enable: false,
                    frequentCard: false,
                    recentCard: false
                },
                homePageGroupDisplay: "scroll",
                isInDrag: false,
                optimizeTileLoadingThreshold: 100,
                segments: undefined,
                tileActionModeActive: false,
                sizeBehavior: "Responsive",
                sizeBehaviorConfigurable: false,
                wrappingType: "Normal"
            },
            catalog: {
                enabled: true,
                appFinderDisplayMode: undefined,
                easyAccessNumbersOfLevels: undefined,
                enableCatalogSearch: true,
                enableCatalogSelection: true,
                enableCatalogTagFilter: true,
                enableEasyAccess: true,
                enableEasyAccessOnTablet: false,
                enableEasyAccessUserMenu: true,
                enableEasyAccessUserMenuSearch: true,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessSAPMenuSearch: true,
                enableHideGroups: true,
                sapMenuServiceUrl: undefined,
                userMenuServiceUrl: undefined
            },
            esearch: {
                defaultSearchScopeApps: false,
                searchBusinessObjects: true,
                searchScopeWithoutAll: false
            },
            customPreload: {
                enabled: false,
                coreResourcesComplement: []
            },
            ui5: {
                timeZoneFromServerInUI5: false
            },
            uiTracer: {
                enabled: false
            }
        }
    };

    QUnit.module("sap/ushell/bootstrap/common/common.create.configcontract.core", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("should return contract with default value or undefined when ushell config is empty", function (assert) {
        var oContract = CommonCreateConfigContract.createConfigContract({});

        assert.deepEqual(oContract, oDefaultContract, "Contract should be fill in with default value or undefined");
    });

    [{
        description: "from shell config with true and home with false",
        aPath: [{
            sPath: "/renderers/fiori2/componentData/config/enablePersonalization",
            bValue: true
        }, {
            sPath: "/renderers/fiori2/componentData/config/applications/Shell-home/enablePersonalization",
            bValue: false
        }],
        expectedFlag: true
    }, {
        description: "from shell config with undefined and home with false",
        aPath: [{
            sPath: "/renderers/fiori2/componentData/config/applications/Shell-home/enablePersonalization",
            bValue: false
        }],
        expectedFlag: false
    }, {
        description: "from shell config with false and home with true",
        aPath: [{
            sPath: "/renderers/fiori2/componentData/config/enablePersonalization",
            bValue: false
        }, {
            sPath: "/renderers/fiori2/componentData/config/applications/Shell-home/enablePersonalization",
            bValue: true
        }],
        expectedFlag: false
    }].forEach(function (oFix) {
        QUnit.test("contract for core/shell/personalization is correct when " + oFix.description, function (assert) {
            var oUshellConfig = oFix.aPath.reduce(function (acc, oTuple) {
                var sKey = oTuple.sPath;
                var oObj = {};
                oObj[sKey] = oTuple.bValue;
                return testUtils.overrideObject(acc, oObj);
            }, {});

            var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

            assert.deepEqual(oContract.core.shell.enablePersonalization, oFix.expectedFlag,
                "Contract should be fill in with default value or undefined");
        });
    });

    QUnit.test("contract for core/navigation is correct", function (assert) {
        var oUshellConfig = testUtils.overrideObject({}, {
            "/services/ClientSideTargetResolution/config/enableInPlaceForClassicUIs": {
                GUI: true,
                WDA: false
            }
        });

        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        var oExpectedContract = oDefaultContract.core.navigation;
        oExpectedContract.enableInPlaceForClassicUIs.GUI = true;

        assert.deepEqual(oContract.core.navigation, oExpectedContract, "Contract should be fill in with default value or undefined");
    });

    QUnit.test("contract for enableHelp is correctly applied for enableHelp", function (assert) {
        var oUshellConfig = testUtils.overrideObject({}, {
            "/renderers/fiori2/componentData/config/enableHelp": true
        });

        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        assert.equal(oContract.core.extension.enableHelp, true, "Contract for enable help adapted based on different ushell config");
    });

    [{
        // this test case might be redundant
        sDescription: "enableEasyAccess is false, use defaults",
        oConfig: {
            enableEasyAccess: false,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessSAPMenuSearch: true,
            enableEasyAccessUserMenu: true,
            enableEasyAccessUserMenuSearch: true
        },
        oExpected: {
            enableEasyAccess: false,
            enableEasyAccessSAPMenu: false,
            enableEasyAccessSAPMenuSearch: false,
            enableEasyAccessUserMenu: false,
            enableEasyAccessUserMenuSearch: false
        }
    }, {
        sDescription: "enableEasyAccess: all undefined",
        oConfig: {
            enableEasyAccess: undefined,
            enableEasyAccessSAPMenu: undefined,
            enableEasyAccessSAPMenuSearch: undefined,
            enableEasyAccessUserMenu: undefined,
            enableEasyAccessUserMenuSearch: undefined
        },
        oExpected: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessSAPMenuSearch: true,
            enableEasyAccessUserMenu: true,
            enableEasyAccessUserMenuSearch: true
        }
    }, {
        sDescription: "enableEasyAccess: undefined, enableEasyAccessSAPMenu/Search, enableEasyAccessUserMenuSearch: false",
        oConfig: {
            enableEasyAccess: undefined,
            enableEasyAccessSAPMenu: false,
            enableEasyAccessSAPMenuSearch: false,
            enableEasyAccessUserMenu: false,
            enableEasyAccessUserMenuSearch: false
        },
        oExpected: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: false,
            enableEasyAccessSAPMenuSearch: false,
            enableEasyAccessUserMenu: false,
            enableEasyAccessUserMenuSearch: false
        }
    }, {
        sDescription: "enableEasyAccess, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: all true" +
            " - model saves enableEasyAccessSAPMenu/Search, enableEasyAccessUserMenu/Search as true",
        oConfig: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessUserMenu: true
        },
        oExpected: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessSAPMenuSearch: true,
            enableEasyAccessUserMenu: true,
            enableEasyAccessUserMenuSearch: true
        }
    }, {
        sDescription: "enableEasyAccess: true, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: undefined" +
            " - model saves enableEasyAccessSAPMenu/Search, enableEasyAccessUserMenu/Search as true",
        oConfig: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: undefined,
            enableEasyAccessSAPMenuSearch: undefined,
            enableEasyAccessUserMenu: undefined,
            enableEasyAccessUserMenuSearch: undefined
        },
        oExpected: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessSAPMenuSearch: true,
            enableEasyAccessUserMenu: true,
            enableEasyAccessUserMenuSearch: true
        }
    }, {
        sDescription: "enableEasyAccess: true, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: undefined, enableEasyAccessSAPMenuSearch: false" +
            " - model saves enableEasyAccessSAPMenu, enableEasyAccessUserMenu/Search as true, enableEasyAccessSAPMenuSearch as false",
        oConfig: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: undefined,
            enableEasyAccessSAPMenuSearch: false,
            enableEasyAccessUserMenu: undefined,
            enableEasyAccessUserMenuSearch: undefined
        },
        oExpected: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessSAPMenuSearch: false,
            enableEasyAccessUserMenu: true,
            enableEasyAccessUserMenuSearch: true
        }
    }, {
        sDescription: "enableEasyAccess: true, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: false - model saves enableEasyAccessSAPMenu, enableEasyAccessUserMenu as false",
        oConfig: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: false,
            enableEasyAccessSAPMenuSearch: true,
            enableEasyAccessUserMenu: false,
            enableEasyAccessUserMenuSearch: true
        },
        oExpected: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: false,
            enableEasyAccessSAPMenuSearch: false,
            enableEasyAccessUserMenu: false,
            enableEasyAccessUserMenuSearch: false
        }
    }, {
        sDescription: "enableEasyAccess: false, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: true - model saves enableEasyAccessSAPMenu, enableEasyAccessUserMenu as false",
        oConfig: {
            enableEasyAccess: false,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessSAPMenuSearch: true,
            enableEasyAccessUserMenu: true,
            enableEasyAccessUserMenuSearch: true
        },
        oExpected: {
            enableEasyAccess: false,
            enableEasyAccessSAPMenu: false,
            enableEasyAccessSAPMenuSearch: false,
            enableEasyAccessUserMenu: false,
            enableEasyAccessUserMenuSearch: false
        }
    }, {
        sDescription: "enableEasyAccess: undefined, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: true - model saves enableEasyAccessSAPMenu, enableEasyAccessUserMenu as true",
        oConfig: {
            enableEasyAccess: undefined,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessSAPMenuSearch: true,
            enableEasyAccessUserMenu: true,
            enableEasyAccessUserMenuSearch: true
        },
        oExpected: {
            enableEasyAccess: true,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessSAPMenuSearch: true,
            enableEasyAccessUserMenu: true,
            enableEasyAccessUserMenuSearch: true
        }
    }].forEach(function (oData) {
        QUnit.test("enableEasyAccess configurations: " + oData.sDescription, function (assert) {
            var oMockConfig = {
                renderers: { fiori2: { componentData: { config: { applications: { "Shell-home": oData.oConfig } } } } }
            };
            var oContract = CommonCreateConfigContract.createConfigContract(oMockConfig);

            // check the different values
            assert.equal(oContract.core.catalog.enableEasyAccess, oData.oExpected.enableEasyAccess, "enableEasyAccess set correctly");
            assert.equal(oContract.core.catalog.enableEasyAccessSAPMenu, oData.oExpected.enableEasyAccessSAPMenu,
                "enableEasyAccessSAPMenu set correctly");
            assert.equal(oContract.core.catalog.enableEasyAccessSAPMenuSearch, oData.oExpected.enableEasyAccessSAPMenuSearch,
                "enableEasyAccessSAPMenuSearch set correctly");
            assert.equal(oContract.core.catalog.enableEasyAccessUserMenu, oData.oExpected.enableEasyAccessUserMenu,
                "enableEasyAccessUserMenu set correctly");
            assert.equal(oContract.core.catalog.enableEasyAccessUserMenuSearch, oData.oExpected.enableEasyAccessUserMenuSearch,
                "enableEasyAccessUserMenuSearch set correctly");
        });
    });

    QUnit.test("enableEasyAccessOnTablet configurations: eEAM: true, eEAMonTablet: true", function (assert) {
        var oMockConfig = {
            renderers: {
                fiori2: {
                    componentData: {
                        config: {
                            applications: {
                                "Shell-home": {
                                    enableEasyAccess: true,
                                    enableEasyAccessUserMenuOnTablet: true
                                }
                            }
                        }
                    }
                }
            }
        };
        var oExpectedConfig = {
            enableEasyAccess: true,
            enableEasyAccessOnTablet: true
        };

        var oContract = CommonCreateConfigContract.createConfigContract(oMockConfig);

        // check the different values
        assert.equal(oContract.core.catalog.enableEasyAccess, oExpectedConfig.enableEasyAccess, "enableEasyAccess set correctly");
        assert.equal(oContract.core.catalog.enableEasyAccessOnTablet, oExpectedConfig.enableEasyAccessOnTablet,
            "enableEasyAccessOnTablet set correctly");
    });

    QUnit.test("enableEasyAccessOnTablet configurations: eEAM: true, eEAMonTablet: false", function (assert) {
        var oMockConfig = {
            renderers: {
                fiori2: {
                    componentData: {
                        config: {
                            applications: {
                                "Shell-home": {
                                    enableEasyAccess: true,
                                    enableEasyAccessUserMenuOnTablet: false
                                }
                            }
                        }
                    }
                }
            }
        };
        var oExpectedConfig = {
            enableEasyAccess: true,
            enableEasyAccessOnTablet: false
        };

        var oContract = CommonCreateConfigContract.createConfigContract(oMockConfig);

        // check the different values
        assert.equal(oContract.core.catalog.enableEasyAccess, oExpectedConfig.enableEasyAccess, "enableEasyAccess set correctly");
        assert.equal(oContract.core.catalog.enableEasyAccessOnTablet, oExpectedConfig.enableEasyAccessOnTablet,
            "enableEasyAccessOnTablet set correctly");
    });

    QUnit.test("enableEasyAccessOnTablet configurations: eEAM: false, eEAMonTablet: true", function (assert) {
        var oMockConfig = {
            renderers: {
                fiori2: {
                    componentData: {
                        config: {
                            applications: {
                                "Shell-home": {
                                    enableEasyAccess: false,
                                    enableEasyAccessUserMenuOnTablet: true
                                }
                            }
                        }
                    }
                }
            }
        };
        var oExpectedConfig = {
            enableEasyAccess: false,
            enableEasyAccessOnTablet: false
        };

        var oContract = CommonCreateConfigContract.createConfigContract(oMockConfig);

        // check the different values
        assert.equal(oContract.core.catalog.enableEasyAccess, oExpectedConfig.enableEasyAccess, "enableEasyAccess set correctly");
        assert.equal(oContract.core.catalog.enableEasyAccessOnTablet, oExpectedConfig.enableEasyAccessOnTablet,
            "enableEasyAccessOnTablet set correctly");
    });

    QUnit.test("getDefaultConfiguration should return the config defaults when createConfigContract was already called", function (assert) {
        CommonCreateConfigContract.createConfigContract({});
        var oDefaultConfiguration = CommonCreateConfigContract.getDefaultConfiguration();

        // Taking only one config value here to avoid checking the whole object again
        assert.deepEqual(oDefaultConfiguration["renderers/fiori2/componentData/config/applications/Shell-home/enableEasyAccess"], true,
            "The default config was returned");
    });

    [{
        sDescription: "enableBackGroundShapes: undefined, spaces: off, - shapes are false",
        oConfig: {
            spaces: false,
            backgroundShapes: undefined
        },
        bExpected: false
    }, {
        sDescription: "enableBackGroundShapes: undefined, spaces: on, - shapes are disabled",
        oConfig: {
            spaces: true,
            backgroundShapes: false
        },
        bExpected: false
    }, {
        sDescription: "enableBackGroundShapes: true, spaces: off, - shapes are enabled",
        oConfig: {
            spaces: false,
            backgroundShapes: true
        },
        bExpected: true
    }, {
        sDescription: "enableBackGroundShapes: true, spaces: on, - shapes are disabled",
        oConfig: {
            spaces: true,
            backgroundShapes: true
        },
        bExpected: false
    }, {
        sDescription: "enableBackGroundShapes: false, spaces: off, - shapes are disabled",
        oConfig: {
            spaces: false,
            backgroundShapes: false
        },
        bExpected: false
    }, {
        sDescription: "enableBackGroundShapes: false, spaces: on, - shapes are disabled",
        oConfig: {
            spaces: true,
            backgroundShapes: false
        },
        bExpected: false
    }].forEach(function (oData) {
        QUnit.test("enableBackGroundShapes with " + oData.sDescription, function (assert) {
            var oUshellConfig = testUtils.overrideObject({}, {
                "/ushell/spaces/enabled": oData.oConfig.spaces,
                "/renderers/fiori2/componentData/config/enableBackGroundShapes": oData.oConfig.backgroundShapes
            });
            var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);
            var bRenderShapes = oContract.core.shell.model.enableBackGroundShapes;
            assert.equal(bRenderShapes, oData.bExpected, "Shapes are " + (oData.bExpected ? "" : " not ") + "rendered.");
        });
    });

    [{
        sDescription: "enabled when personalization is disabled, appfinder is enabled",
        oConfig: {
            enablePersonalization: false,
            applications: { "Shell-home": { enablePersonalization: false } },
            enableAppFinder: true
        },
        bExpected: true
    }, {
        sDescription: "enabled when personalization is enabled",
        oConfig: {
            enablePersonalization: true,
            applications: { "Shell-home": { enablePersonalization: false } },
            enableAppFinder: false
        },
        bExpected: true
    }, {
        sDescription: "enabled when personalization in Shell-home is enabled",
        oConfig: {
            enablePersonalization: undefined,
            applications: { "Shell-home": { enablePersonalization: true } },
            enableAppFinder: false
        },
        bExpected: true
    }, {
        sDescription: "disabled when personalization and appfinder are disabled",
        oConfig: {
            enablePersonalization: false,
            applications: { "Shell-home": { enablePersonalization: false } },
            enableAppFinder: false
        },
        bExpected: false
    }].forEach(function (oData) {
        QUnit.test("AppFinder is " + oData.sDescription, function (assert) {
            var oMockConfig = {
                renderers: { fiori2: { componentData: { config: oData.oConfig } } }
            };
            var oContract = CommonCreateConfigContract.createConfigContract(oMockConfig);

            // check the different values
            assert.equal(oContract.core.catalog.enabled, oData.bExpected, "enableEasyAccess set correctly");
        });
    });

    QUnit.test('"ushell/contentProviders/providerInfo/enabled" is false by default', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/contentProviders/providerInfo/enabled": undefined
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.contentProviders.providerInfo.enabled, false, "Config value is as expected");
    });

    QUnit.test('"ushell/contentProviders/providerInfo/userConfigurable" is false by default (#1)', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/contentProviders/providerInfo/enabled": false,
            "/ushell/contentProviders/providerInfo/userConfigurable": undefined
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.contentProviders.providerInfo.userConfigurable, false, "Config value is as expected");
    });

    QUnit.test('"ushell/contentProviders/providerInfo/userConfigurable" is false by default (#2)', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/contentProviders/providerInfo/enabled": true,
            "/ushell/contentProviders/providerInfo/userConfigurable": undefined
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.contentProviders.providerInfo.userConfigurable, false, "Config value is as expected");
    });

    QUnit.test('"ushell/contentProviders/providerInfo/userConfigurable" is false when "enabled" is false', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/contentProviders/providerInfo/enabled": false,
            "/ushell/contentProviders/providerInfo/userConfigurable": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.contentProviders.providerInfo.userConfigurable, false, "Config value is as expected");
    });

    QUnit.test('"ushell/contentProviders/providerInfo/userConfigurable" is used when "enabled" is true (#1)', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/contentProviders/providerInfo/enabled": true,
            "/ushell/contentProviders/providerInfo/userConfigurable": false
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.contentProviders.providerInfo.userConfigurable, false, "Config value is as expected");
    });

    QUnit.test('"ushell/contentProviders/providerInfo/userConfigurable" is used when "enabled" is true (#2)', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/contentProviders/providerInfo/enabled": true,
            "/ushell/contentProviders/providerInfo/userConfigurable": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.contentProviders.providerInfo.userConfigurable, true, "Config value is as expected");
    });

    QUnit.test('"ushell/contentProviders/providerInfo/showContentProviderInfoOnVisualizations" is true by default (when possible)',
        function (assert) {
            // Arrange
            var oUshellConfig = testUtils.overrideObject({}, {
                "/ushell/contentProviders/providerInfo/enabled": true,
                "/ushell/contentProviders/providerInfo/userConfigurable": true,
                "/ushell/contentProviders/providerInfo/showContentProviderInfoOnVisualizations": undefined
            });

            // Act
            var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

            // Assert
            assert.strictEqual(oContract.core.contentProviders.providerInfo.showContentProviderInfoOnVisualizations, true,
                "Config value is as expected");
        }
    );

    QUnit.test('"ushell/contentProviders/providerInfo/showContentProviderInfoOnVisualizations" is false when not possible (#1)',
        function (assert) {
            // Arrange
            var oUshellConfig = testUtils.overrideObject({}, {
                "/ushell/contentProviders/providerInfo/enabled": false,
                "/ushell/contentProviders/providerInfo/userConfigurable": false,
                "/ushell/contentProviders/providerInfo/showContentProviderInfoOnVisualizations": true
            });

            // Act
            var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

            // Assert
            assert.strictEqual(oContract.core.contentProviders.providerInfo.showContentProviderInfoOnVisualizations, false,
                "Config value is as expected");
        }
    );

    QUnit.test('"ushell/contentProviders/providerInfo/showContentProviderInfoOnVisualizations" is false when not possible (#2)',
        function (assert) {
            // Arrange
            var oUshellConfig = testUtils.overrideObject({}, {
                "/ushell/contentProviders/providerInfo/enabled": true,
                "/ushell/contentProviders/providerInfo/userConfigurable": false,
                "/ushell/contentProviders/providerInfo/showContentProviderInfoOnVisualizations": true
            });

            // Act
            var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

            // Assert
            assert.strictEqual(oContract.core.contentProviders.providerInfo.showContentProviderInfoOnVisualizations, false,
                "Config value is as expected");
        }
    );

    QUnit.test('"ushell/contentProviders/providerInfo/showContentProviderInfoOnVisualizations" is false when not possible (#3)',
        function (assert) {
            // Arrange
            var oUshellConfig = testUtils.overrideObject({}, {
                "/ushell/contentProviders/providerInfo/enabled": false,
                "/ushell/contentProviders/providerInfo/userConfigurable": true,
                "/ushell/contentProviders/providerInfo/showContentProviderInfoOnVisualizations": true
            });

            // Act
            var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

            // Assert
            assert.strictEqual(oContract.core.contentProviders.providerInfo.showContentProviderInfoOnVisualizations, false,
                "Config value is as expected");
        }
    );

    QUnit.test('"homeUri" is initially empty when "rootIntent" is falsy', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/renderers/fiori2/componentData/config/rootIntent": ""
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.shellHeader.homeUri, "", "Config value is as expected");
    });

    QUnit.test('"homeUri" is initially an URI based on "rootIntent" when the latter is non-empty', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/renderers/fiori2/componentData/config/rootIntent": "Shell-home"
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.shellHeader.homeUri, "#Shell-home", "Config value is as expected");
    });

    QUnit.test('"homeApp" is enabled when "spaces" is enabled and the component is not empty', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/spaces/enabled": true,
            "/ushell/homeApp/component": { url: "url/to/component" }
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.spaces.myHome.enabled, true, "Config value is as expected");
        assert.strictEqual(oContract.core.homeApp.enabled, true, "Config value is as expected");
        assert.deepEqual(oContract.core.homeApp.component, { url: "url/to/component" }, "Config value is as expected");
    });

    QUnit.test('"core/homeApp" is disabled when "core/spaces" is disabled and the component is not empty', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/spaces/enabled": false,
            "/ushell/homeApp/component": { url: "url/to/component" }
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.spaces.myHome.enabled, false, "Config value is as expected");
        assert.strictEqual(oContract.core.homeApp.enabled, false, "Config value is as expected");
        assert.deepEqual(oContract.core.homeApp.component, { url: "url/to/component" }, "Config value is as expected");
    });

    QUnit.test('"core/spaces/hideEmptySpaces" is disabled by default when "core/spaces" is enabled', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/spaces/enabled": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.spaces.hideEmptySpaces.enabled, false, "Config value is as expected");
    });

    QUnit.test('"core/spaces/hideEmptySpaces" is disabled when "core/spaces" is disabled', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/spaces/enabled": false,
            "/ushell/spaces/hideEmptySpaces": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.spaces.hideEmptySpaces.enabled, false, "Config value is as expected");
    });

    QUnit.test('"core/menu" is enabled by default when "core/spaces/" is enabled', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/spaces/enabled": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.menu.enabled, true, "Config value is as expected");
    });

    QUnit.test('"core/menu" is disabled when "core/spaces" is enabled but the menu is disabled explicitly', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/spaces/enabled": true,
            "/ushell/menu/enabled": false
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.menu.enabled, false, "Config value is as expected");
    });

    QUnit.test('"core/menu/enabled" takes over the value from "ushell/menu/enabled" when "core/spaces" is disabled', function (assert) {
        // Arrange
        var oUshellConfigTrue = testUtils.overrideObject({}, {
            "/ushell/menu/enabled": true
        });
        var oUshellConfigFalse = testUtils.overrideObject({}, {
            "/ushell/menu/enabled": false
        });

        // Act
        var oContractTrue = CommonCreateConfigContract.createConfigContract(oUshellConfigTrue);
        var oContractFalse = CommonCreateConfigContract.createConfigContract(oUshellConfigFalse);

        // Assert
        assert.strictEqual(oContractTrue.core.menu.enabled, true, "Config value is as expected");
        assert.strictEqual(oContractFalse.core.menu.enabled, false, "Config value is as expected");
    });

    QUnit.test('"core/workPages/myHome/pageId" takes over the value from "ushell/spaces/myHome/myHomePageId"', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/spaces/myHome/myHomePageId": "my-home-page-id"
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.workPages.myHome.pageId, "my-home-page-id", "Config value is as expected");
    });

    QUnit.test('"core/workPages/component" takes over the value from "ushell/workPages/component"', function (assert) {
        // Arrange
        var oComponentConfig = {
            name: "external.workpage.component",
            url: "some/path",
            additionalOptions: "foobar"
        };
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/workPages/component": oComponentConfig
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.deepEqual(oContract.core.workPages.component, oComponentConfig, "Config value is as expected");
    });

    QUnit.test('"core/workPages/tileCard" takes over the value from "ushell/workPages/tileCard"', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/workPages/tileCard": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.workPages.tileCard, true, "Config value is as expected");
    });

    QUnit.test('"core/workPages/enableSmartBusiness" takes over the value from "ushell/workPages/enableSmartBusiness"', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/workPages/enableSmartBusiness": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.workPages.enableSmartBusiness, true, "Config value is as expected");
    });

    QUnit.test('"core/workPages/customTileCard" takes over the value from "ushell/workPages/customTileCard"', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/workPages/customTileCard": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.workPages.customTileCard, true, "Config value is as expected");
    });

    QUnit.test('"core/workPages/runtimeSwitcher" takes over the value from "ushell/workPages/runtimeSwitcher"', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/workPages/runtimeSwitcher": false
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.workPages.runtimeSwitcher, false, "Config value is as expected");
    });

    QUnit.test('"core/workPages/runtimeSwitcher" is false when "ushell/spaces/myHome/myHomePageId" is defined', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/spaces/myHome/myHomePageId": "my-home-page-id"
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.workPages.runtimeSwitcher, false, "Config value is as expected");
    });

    QUnit.test('"core/site/siteId" takes over the value from "ushell/site/siteId"', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/site/siteId": "my-site-id"
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.site.siteId, "my-site-id", "Config value is as expected");
    });

    QUnit.test('should return config for "core/customPreload" contract when "ushell/customPreload" is defined', function (assert) {
        // Arrange
        var oCustomPreloadConfig = {
            enabled: true,
            coreResources: ["some/module"],
            coreResourcesComplement: ["some/other/module"]
        };
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/customPreload": oCustomPreloadConfig
        });
        sandbox.stub(oDebugMode, "isDebug").returns(false);

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.deepEqual(oContract.core.customPreload, {
            enabled: true,
            coreResourcesComplement: ["some/other/module"]
        }, "Config value is as expected");
    });

    QUnit.test('should return false for "/core/customPreload/enabled" contract when debug mode is true', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/customPreload": { enabled: true }
        });
        sandbox.stub(oDebugMode, "isDebug").returns(true);

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.customPreload.enabled, false,
            "Config value is as expected");
    });

    QUnit.test('"core/uiTracer/enabled" takes over the value from "services/UITracer/config/enabled"', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/services/UITracer/config/enabled": true
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.strictEqual(oContract.core.uiTracer.enabled, true, "Config value is as expected");
    });

    QUnit.test('"core/shell/useAppTitleFromNavTargetResolution" returns string array for comma-separated list in "ushell/useAppTitleFromNavTargetResolution"', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/useAppTitleFromNavTargetResolution": "sap.app1, sap.app2, sap.app3"
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.deepEqual(oContract.core.shell.useAppTitleFromNavTargetResolution,
            ["sap.app1", "sap.app2", "sap.app3"], "Config value is as expected");
    });

    QUnit.test('"core/shell/useAppTitleFromNavTargetResolution" returns empty array for invalid entry', function (assert) {
        // Arrange
        var oUshellConfig = testUtils.overrideObject({}, {
            "/ushell/useAppTitleFromNavTargetResolution": function () { }
        });

        // Act
        var oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.deepEqual(oContract.core.shell.useAppTitleFromNavTargetResolution,
            [], "Config value is as expected");
    });

    QUnit.test("appFinderDisplayMode is set to \"tiles\" with upper case AppFinderDisplayMode in path", function (assert) {
        // Arrange
        const oUshellConfig = testUtils.overrideObject({}, {
            "/renderers/fiori2/componentData/config/applications/Shell-home/AppFinderDisplayMode": "tiles"
        });

        // Act
        const oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.deepEqual(oContract.core.catalog.appFinderDisplayMode,
            "tiles", "Config value is as expected");
    });

    QUnit.test("appFinderDisplayMode is set to \"tiles\" with lower case appFinderDisplayMode in path", function (assert) {
        // Arrange
        const oUshellConfig = testUtils.overrideObject({}, {
            "/renderers/fiori2/componentData/config/applications/Shell-home/appFinderDisplayMode": "tiles"
        });

        // Act
        const oContract = CommonCreateConfigContract.createConfigContract(oUshellConfig);

        // Assert
        assert.deepEqual(oContract.core.catalog.appFinderDisplayMode,
            "tiles", "Config value is as expected");
    });

});

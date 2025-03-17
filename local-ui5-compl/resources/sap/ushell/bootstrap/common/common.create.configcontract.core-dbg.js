// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview Provides a factory defining the configuration contract of the FLP core component.
 */
sap.ui.define([
    "sap/ushell/bootstrap/common/common.debug.mode",
    "sap/base/util/deepExtend"
], function (
    oDebugMode,
    deepExtend
) {
    "use strict";

    var oDefaultConfigValues = {};
    var oSearchParams = new URLSearchParams(document.location.search);

    function createConfigContract (oMergedSapUshellConfig) {
        var oGetConfigValueMemory = {};

        /**
         * Retrieves the value from "oMergedSapUshellConfig" relative to the given a path.
         * This method memoizes the parent path accessed in order to provide fast access across multiple calls.
         *
         * @param {object} oMemory Memoization object for the parent path, to avoid iterating on a deeply nested object.
         * @param {string} sPath A "/"-separated path to a property in "oMergedSapUshellConfig", not starting with a "/".
         * @returns {any} A property of "oMergedSapUshellConfig" that can be found under the given "sPath".
         * @private
         */
        function getValueFromConfig (oMemory, sPath) {
            var aPathParts = sPath.split("/");
            var sParentPath = aPathParts.slice(0, aPathParts.length - 1).join("/");
            var sLastPart = aPathParts.pop();

            if (oMemory.hasOwnProperty(sParentPath)) {
                return oMemory[sParentPath][sLastPart];
            }

            var oDeepObject = aPathParts.reduce(function (oObject, sPathPart) {
                if (!oObject || !oObject.hasOwnProperty(sPathPart)) {
                    return {};
                }
                return oObject[sPathPart];
            }, oMergedSapUshellConfig);

            // avoid iterating on a deep structure next time
            oMemory[sParentPath] = oDeepObject;

            return oDeepObject[sLastPart];
        }

        /**
         * Retrieves the value from the configuration object or returns the default value.
         * @param {string} sPath the path to the configuration value
         * @param {string|boolean|int|object} oDefaultValue default value if the configuration value is not found
         * @returns {string|boolean|int|object} the found configuration value or the default value
         */
        function getConfigValue (sPath, oDefaultValue) {
            var oSegment = getValueFromConfig(oGetConfigValueMemory, sPath);
            oDefaultConfigValues[sPath] = oDefaultValue;
            return (oSegment !== undefined) ? oSegment : oDefaultValue;
        }

        // do not render background shapes in Spaces mode
        // "enableBackGroundShapes" has default value of "false" in Spaces FLP and "true" in Classic FLP
        function getEnableBackGroundShapes () {
            var sPath = "renderers/fiori2/componentData/config/enableBackGroundShapes";
            var bEnableShapes = !!getValueFromConfig(oGetConfigValueMemory, sPath);
            if (bEnableShapes) {
                bEnableShapes = !getConfigValue("ushell/spaces/enabled", false);
            }
            oDefaultConfigValues[sPath] = bEnableShapes;
            return bEnableShapes;
        }

        function getEnablePersonalization () {
            // default is "true"
            return getConfigValue("renderers/fiori2/componentData/config/enablePersonalization",
                getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enablePersonalization", true));
        }

        function getHomeUri () {
            // "homeUri" might change during runtime; see "HeaderManager"
            var homeUri = getConfigValue("renderers/fiori2/componentData/config/rootIntent", "");
            if (homeUri) {
                homeUri = "#" + homeUri;
            }
            return homeUri;
        }

        function getHomeAppEnabled () {
            // Only set home app enabled if a home app component id is set and spaces is enabled
            return getConfigValue("ushell/spaces/enabled", false) && !!getConfigValue("ushell/homeApp/component", false);
        }

        // "Easy Access Menu" values, allowing for individual read and making the logic clearer
        var bEnableEasyAccess = getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableEasyAccess", true);
        var oEasyAccessMenu = {
            enableEasyAccessOnTablet: getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableEasyAccessUserMenuOnTablet", false),
            enableEasyAccessSAPMenu: getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableEasyAccessSAPMenu", bEnableEasyAccess),
            enableEasyAccessSAPMenuSearch: getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableEasyAccessSAPMenuSearch", true),
            enableEasyAccessUserMenu: getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableEasyAccessUserMenu", bEnableEasyAccess),
            enableEasyAccessUserMenuSearch: getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableEasyAccessUserMenuSearch", true)
        };

        /**
         * Logic for the enableEasyAccessUserMenuSearch and the enableEasyAccessSAPMenuSearch.
         * Both pairs:
         *   - "enableEasyAccessSAPMenu / enableEasyAccessSAPMenuSearch"
         *   - "enableEasyAccessUserMenu / enableEasyAccessUserMenuSearch"
         * follow the same logic:
         *   - "enableEasyAccess === false": set everything to "false"
         *   - "enableEasyAccess === true": take over the MenuSearch configuration only if Menu is "true", else return "false"
         *
         * @param {string} sMenu The path to the corresponding Menu configuration.
         * @returns {boolean} The correct configuration value.
         */
        function enableEasyAccessSearchLogic (sMenu) {
            if (bEnableEasyAccess === true) {
                return oEasyAccessMenu[sMenu] ? oEasyAccessMenu[sMenu + "Search"] : false;
            }
            return false;
        }

        /**
         * Converts a string with comma-separated values into a string array
         * @param {string} sCsv comma-separated values
         * @returns {string[]} values as array
         */
        function csvToArray (sCsv) {
            if (typeof sCsv !== "string") {
                return [];
            }

            return sCsv.split(",").map(function (entry) {
                return entry.trim();
            });
        }

        /**
         * Gets the default work page runtime component configuration
         *
         * @private
         * @returns {object} the default work page runtime component configuration
         */
        function getDefaultWorkpageComponent () {
            return {
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
            };
        }

        var oConfigDefinition = {
            core: { // the unified shell core
                site: {
                    siteId: getConfigValue("ushell/site/siteId", null)
                },
                extension: {
                    enableHelp: getConfigValue("renderers/fiori2/componentData/config/enableHelp", false),
                    SupportTicket: getConfigValue("services/SupportTicket/config/enabled", false)
                },
                services: {
                    allMyApps: {
                        enabled: getConfigValue("services/AllMyApps/config/enabled", true),
                        // TODO: Change this once we fix the path on the backend.
                        // Added both paths to allow for a change in BE independently from us.
                        // Will be resolved with FLPCOREANDUX-6164.
                        showHomePageApps: getConfigValue("services/AllMyApps/config/showHomePageApps", true),
                        showCatalogApps: getConfigValue("services/AllMyApps/config/showCatalogApps", true)
                    }
                },
                navigation: {
                    enableInPlaceForClassicUIs: {
                        GUI: getConfigValue("services/ClientSideTargetResolution/config/enableInPlaceForClassicUIs/GUI", false),
                        WDA: getConfigValue("services/ClientSideTargetResolution/config/enableInPlaceForClassicUIs/WDA", false),
                        WCF: getConfigValue("services/ClientSideTargetResolution/config/enableInPlaceForClassicUIs/WCF", true)
                    },
                    enableWebguiLocalResolution: true,
                    enableWdaLocalResolution: true,
                    flpURLDetectionPattern: getConfigValue("services/ClientSideTargetResolution/config/flpURLDetectionPattern", "[/]FioriLaunchpad.html[^#]+#[^-]+?-[^-]+"),
                    enableWdaCompatibilityMode: getConfigValue("ushell/navigation/wdaCompatibilityMode", false)
                },
                spaces: {
                    enabled: getConfigValue("ushell/spaces/enabled", false),
                    configurable: getConfigValue("ushell/spaces/configurable", false),
                    myHome: {
                        userEnabled: true,
                        // FLP or Custom (S/4) My Home is enabled
                        enabled: getConfigValue("startupConfig/spacesMyhome", false) || getHomeAppEnabled(),
                        myHomeSpaceId: getConfigValue("startupConfig/spacesMyhomeSpaceid", null),
                        myHomePageId: getConfigValue("startupConfig/spacesMyhomePageid", null),
                        // hardcoded Section ID of the "My Apps" Section on the "My Home" Page
                        presetSectionId: "3WO90XZ1DX1AS32M7ZM9NBXEF"
                    },
                    hideEmptySpaces: {
                        enabled: getConfigValue("ushell/spaces/enabled", false) && getConfigValue("ushell/spaces/hideEmptySpaces/enabled", false),
                        userEnabled: true
                    },
                    extendedChangeDetection: {
                        // only for support purposes; should not be used in production!
                        enabled: getConfigValue("ushell/spaces/extendedChangeDetection/enabled", true)
                    },
                    homeNavigationTarget: getConfigValue("renderers/fiori2/componentData/config/homeNavigationTarget", undefined),
                    currentSpaceAndPage: undefined
                },
                workPages: {
                    enabled: getConfigValue("ushell/spaces/enabled", false) && getConfigValue("ushell/workPages/enabled", false),
                    defaultComponent: getDefaultWorkpageComponent(),
                    component: getConfigValue("ushell/workPages/component",
                        deepExtend(getDefaultWorkpageComponent(), {
                            addCoreResourcesComplement: false
                        })
                    ),
                    contentApiUrl: getConfigValue("ushell/workPages/contentApiUrl", "/cep/graphql"),
                    tileCard: getConfigValue("ushell/workPages/tileCard", !!oSearchParams.get("sap-ushell-tilecard")),
                    customTileCard: getConfigValue("ushell/workPages/customTileCard", !!oSearchParams.get("sap-ushell-customtilecard")),
                    myHome: {
                        pageId: getConfigValue("ushell/spaces/myHome/myHomePageId", null)
                    },
                    runtimeSwitcher: getConfigValue("ushell/workPages/runtimeSwitcher",
                        getConfigValue("ushell/spaces/myHome/myHomePageId", null) === null),
                    contentFinderStandalone: getConfigValue("core/workPages/contentFinderStandalone", true)
                        && getConfigValue("ushell/workPages/enabled", false),
                    enableSmartBusiness: getConfigValue("ushell/workPages/enableSmartBusiness", true)
                },
                homeApp: {
                    // the homeApp is currently only supposed to work for Spaces
                    enabled: getHomeAppEnabled(),
                    component: getConfigValue("ushell/homeApp/component", {})
                },
                menu: { // Menu Bar
                    // The menu bar is enabled for Spaces by default, unless it is disabled explicitly
                    enabled: (getConfigValue("ushell/spaces/enabled", false) &&
                        getConfigValue("ushell/menu/enabled") !== false) ||
                        getConfigValue("ushell/menu/enabled", false),
                    personalization: {
                        enabled: getConfigValue("ushell/menu/personalization/enabled", false)
                    },
                    position: getConfigValue("ushell/menu/position", "Top"),
                    visibleInAllStates: getConfigValue("ushell/menu/visibleInAllStates", false)
                },
                menuQueryAvailable: getConfigValue("ushell/menuQueryAvailable", false),
                darkMode: {
                    enabled: getConfigValue("ushell/darkMode/enabled", false),
                    supportedThemes: getConfigValue("ushell/darkMode/supportedThemes", [{
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
                    }])
                },
                contentProviders: {
                    providerInfo: {
                        enabled: getConfigValue("ushell/contentProviders/providerInfo/enabled", false),
                        userConfigurable: getConfigValue("ushell/contentProviders/providerInfo/enabled", false)
                            && getConfigValue("ushell/contentProviders/providerInfo/userConfigurable", false),
                        showContentProviderInfoOnVisualizations: getConfigValue("ushell/contentProviders/providerInfo/enabled", false)
                            && getConfigValue("ushell/contentProviders/providerInfo/userConfigurable", false)
                    }
                },
                productSwitch: {
                    enabled: !!getConfigValue("ushell/productSwitch/url", ""),
                    url: getConfigValue("ushell/productSwitch/url", "")
                },
                shellHeader: {
                    rootIntent: getConfigValue("renderers/fiori2/componentData/config/rootIntent", ""),
                    homeUri: getHomeUri() // "homeUri" might change during runtime; see "HeaderManager"
                },
                companyLogo: {
                    accessibleText: getConfigValue("ushell/companyLogo/accessibleText", ""),
                    url: getConfigValue("ushell/companyLogo/url", "")
                },
                userPreferences: {
                    dialogTitle: "Settings",
                    isDetailedEntryMode: false,
                    activeEntryPath: null,
                    entries: [],
                    profiling: []
                },
                userSettings: {
                    displayUserId: getConfigValue("renderers/fiori2/componentData/config/displayUserId", false)
                },
                shell: {
                    cacheConfiguration: getConfigValue("renderers/fiori2/componentData/config/cacheConfiguration", {}),
                    // switch to toggle the "About" button in the "UserActionsMenu"
                    enableAbout: getConfigValue("renderers/fiori2/componentData/config/enableAbout", true),
                    enablePersonalization: getEnablePersonalization(),
                    enableRecentActivity: getConfigValue("renderers/fiori2/componentData/config/enableRecentActivity", true),
                    // switch for enterprise portal
                    enableRecentActivityLogging: getConfigValue("renderers/fiori2/componentData/config/enableRecentActivityLogging", true),
                    enableFiori3: true, // since 1.66, it is always "true"
                    sessionTimeoutIntervalInMinutes: getConfigValue("renderers/fiori2/componentData/config/sessionTimeoutIntervalInMinutes", -1),
                    enableFeaturePolicyInIframes: getConfigValue("renderers/fiori2/componentData/config/enableFeaturePolicyInIframes", true),
                    enableOpenIframeWithPost: getConfigValue("renderers/fiori2/componentData/config/enableOpenIframeWithPost", true),
                    favIcon: getConfigValue("renderers/fiori2/componentData/config/favIcon", undefined),
                    enableMessageBroker: getConfigValue("services/MessageBroker/config/enabled", true),
                    enablePersistantAppstateWhenSharing: getConfigValue("services/AppState/config/persistentWhenShared", false),
                    homePageTitle: getConfigValue("ushell/header/title/home", ""),
                    windowTitleExtension: getConfigValue("ushell/window/title/extension", ""),
                    useAppTitleFromNavTargetResolution: csvToArray(getConfigValue("ushell/useAppTitleFromNavTargetResolution")),
                    intentNavigation: getConfigValue("ushell/intentNavigation", false),
                    model: {
                        enableSAPCopilotWindowDocking: undefined, // todo: remove (done in follow up)
                        enableBackGroundShapes: getEnableBackGroundShapes(),
                        personalization: undefined,
                        contentDensity: undefined,
                        setTheme: undefined,
                        userDefaultParameters: undefined,
                        disableHomeAppCache: undefined,
                        enableHelp: undefined,
                        enableTrackingActivity: undefined,
                        searchAvailable: false,
                        searchFiltering: true,
                        searchTerm: "",
                        isPhoneWidth: false,
                        enableNotifications: getConfigValue("services/NotificationsV2/config/enabled",
                            getConfigValue("services/Notifications/config/enabled", false)),
                        enableNotificationsUI: false,
                        notificationsCount: 0,
                        currentViewPortState: "Center", // todo: remove (done in follow up)
                        migrationConfig: undefined,
                        shellAppTitleState: "",
                        allMyAppsMasterLevel: undefined,
                        userStatus: undefined, // todo: remove (done in follow up)
                        userStatusUserEnabled: true, // todo: remove (done in follow up)
                        shellAppTitleData: { // todo: remove (done in follow up)
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
                        showRecentActivity: true
                    }
                },
                state: {
                    shellMode: getConfigValue("renderers/fiori2/componentData/config/appState", "") // only used as initial value
                },
                home: {
                    disableSortedLockedGroups:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/disableSortedLockedGroups", false),
                    draggedTileLinkPersonalizationSupported: true,
                    editTitle: false,
                    enableHomePageSettings:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableHomePageSettings", true),
                    enableRenameLockedGroup:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableRenameLockedGroup", false),
                    enableTileActionsIcon: getConfigValue("renderers/fiori2/componentData/config/enableTileActionsIcon",
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableTileActionsIcon", false)),
                    enableTransientMode: getConfigValue("ushell/home/enableTransientMode", false),
                    featuredGroup: {
                        enable: getConfigValue("ushell/home/featuredGroup/enable", false),
                        frequentCard: getConfigValue("ushell/home/featuredGroup/frequentCard", true)
                            && getConfigValue("ushell/home/featuredGroup/enable", false),
                        recentCard: getConfigValue("ushell/home/featuredGroup/recentCard", true)
                            && getConfigValue("ushell/home/featuredGroup/enable", false)
                    },
                    homePageGroupDisplay:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/homePageGroupDisplay", "scroll"),
                    isInDrag: false,
                    optimizeTileLoadingThreshold:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/optimizeTileLoadingThreshold", 100),
                    sizeBehavior: getConfigValue("renderers/fiori2/componentData/config/sizeBehavior", "Responsive"),
                    sizeBehaviorConfigurable: getConfigValue("renderers/fiori2/componentData/config/sizeBehaviorConfigurable", false),
                    wrappingType: getConfigValue("ushell/home/tilesWrappingType", "Normal"),
                    segments: getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/segments", undefined),
                    tileActionModeActive: false
                },
                catalog: {
                    enabled: getEnablePersonalization() || getConfigValue("renderers/fiori2/componentData/config/enableAppFinder", false),
                    appFinderDisplayMode:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/AppFinderDisplayMode",
                            getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/appFinderDisplayMode", undefined)),
                    easyAccessNumbersOfLevels:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/easyAccessNumbersOfLevels",
                            undefined),
                    enableCatalogSearch: getConfigValue("renderers/fiori2/componentData/config/enableSearchFiltering",
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableSearchFiltering",
                            getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableCatalogSearch", true))),
                    enableCatalogSelection: getConfigValue("renderers/fiori2/componentData/config/enableCatalogSelection",
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableCatalogSelection", true)),
                    enableCatalogTagFilter:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableTagFiltering",
                            getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableCatalogTagFilter", true)),
                    enableEasyAccess: bEnableEasyAccess,
                    enableEasyAccessSAPMenu: bEnableEasyAccess ? oEasyAccessMenu.enableEasyAccessSAPMenu : false,
                    enableEasyAccessOnTablet: bEnableEasyAccess ? oEasyAccessMenu.enableEasyAccessOnTablet : false,
                    enableEasyAccessSAPMenuSearch: enableEasyAccessSearchLogic("enableEasyAccessSAPMenu"),
                    enableEasyAccessUserMenu: bEnableEasyAccess ? oEasyAccessMenu.enableEasyAccessUserMenu : false,
                    enableEasyAccessUserMenuSearch: enableEasyAccessSearchLogic("enableEasyAccessUserMenu"),
                    enableHideGroups: getConfigValue("renderers/fiori2/componentData/config/enableHideGroups",
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/enableHideGroups", true)),
                    sapMenuServiceUrl: undefined,
                    userMenuServiceUrl:
                        getConfigValue("renderers/fiori2/componentData/config/applications/Shell-home/userMenuServiceUrl", undefined)
                },
                esearch: {
                    defaultSearchScopeApps: getConfigValue("renderers/fiori2/componentData/config/esearch/defaultSearchScopeApps", false),
                    searchBusinessObjects: getConfigValue("renderers/fiori2/componentData/config/esearch/searchBusinessObjects", true),
                    searchScopeWithoutAll: getConfigValue("renderers/fiori2/componentData/config/esearch/searchScopeWithoutAll", false)
                },
                customPreload: {
                    // expose only the "enabled" and "coreResourcesComplement" configs to higher-level consumers
                    // "enabled" is always false when debug mode is enabled
                    enabled: !oDebugMode.isDebug() && getConfigValue("ushell/customPreload/enabled", false),
                    // "coreResourcesComplement" should be relevant only for bootstrap
                    coreResourcesComplement: getConfigValue("ushell/customPreload/coreResourcesComplement", [])
                },
                ui5: {
                    timeZoneFromServerInUI5: getConfigValue("ui5/timeZoneFromServerInUI5", false)
                },
                uiTracer: {
                    enabled: getConfigValue("services/UITracer/config/enabled", false)
                }

            }
        };

        return oConfigDefinition;
    }

    /**
     * Returns the default configuration shared by the platforms in backend format.
     *
     * @returns {object} The configuration defaults.
     * @private
     */
    function getDefaultConfiguration () {
        return oDefaultConfigValues;
    }

    return {
        createConfigContract: createConfigContract,
        getDefaultConfiguration: getDefaultConfiguration
    };
});

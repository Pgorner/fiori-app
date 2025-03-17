//Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {

  "use strict";

  return [
    {
      id: "OverloadedApp1",
      title: "Bookmark Sample",
      subtitle: "#Overloaded-start",
      icon: "sap-icon://favorite",
      technicalAttributes: ["APPTYPE_SEARCHAPP"],
      visualizations: [
        {
          vizId: "OverloadedApp1",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "OverloadedApp1",
                inboundId: "Overloaded-start"
              }
            }
          },
          title: "Bookmark Sample",
          subtitle: "#Overloaded-start",
          icon: "sap-icon://favorite",
          info: "An Info Text",
          target: {
            appId: "OverloadedApp1",
            inboundId: "Overloaded-start"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Overloaded-start?sap-ui-app-id-hint=OverloadedApp1",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: { appId: "OverloadedApp1", inboundId: "Overloaded-start" }
    },
    {
      id: "OverloadedApp2",
      title: "AppNav Sample",
      subtitle: "#Overloaded-start",
      icon: "sap-icon://Fiori2/F0018",
      visualizations: [
        {
          vizId: "OverloadedApp2",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "OverloadedApp2",
                inboundId: "Overloaded-start"
              }
            }
          },
          title: "AppNav Sample",
          subtitle: "#Overloaded-start",
          icon: "sap-icon://Fiori2/F0018",
          info: "An Info Text",
          target: {
            appId: "OverloadedApp2",
            inboundId: "Overloaded-start"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Overloaded-start?sap-ui-app-id-hint=OverloadedApp2",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: { appId: "OverloadedApp2", inboundId: "Overloaded-start" }
    },
    {
      id: "sap.ushell.demo.AppNavSample",
      title: "This AppNavSample action has a special default value, but requires /ui2/par",
      subtitle: "AppNavSample",
      icon: "sap-icon://Fiori2/F0018",
      keywords: ["Keyword1"],
      technicalAttributes: ["APPTYPE_HOMEPAGE"],
      visualizations: [
        {
          vizId: "hyphenatedApp1",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Pseudopseudohypoparathyroidism",
              subTitle: "should be hyphenated"
            },
            "sap.flp": {
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            }
          },
          title: "Pseudopseudohypoparathyroidism",
          subtitle: "should be hyphenated",
          icon: "sap-icon://Fiori2/F0018",
          keywords: ["keyword1"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "CustomTileContractStatus",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": { title: "Contract Status" },
            "sap.ui": {
              icons: { icon: "sap-icon://show" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              indicatorDataSource: {
                path: "../../test/counts/count22.json",
                refresh: 900
              },
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            }
          },
          title: "Contract Status",
          subtitle: "AppNavSample",
          icon: "sap-icon://show",
          keywords: ["keyword1"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          indicatorDataSource: {
            path: "../../test/counts/count22.json",
            refresh: 900
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              "sap.ui5": {
                componentName: "sap.ushell.components.tiles.cdm.applauncher"
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: ["standard", "compact"],
          preview: true
        },
        {
          vizId: "customtile1component",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Blue Custom Tile",
              subTitle: "img from component's manifest"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              indicatorDataSource: {
                path: "../../test/counts/count1.json",
                refresh: 900
              },
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            }
          },
          title: "Blue Custom Tile",
          subtitle: "img from component's manifest",
          icon: "sap-icon://time-entry-request",
          keywords: ["keyword1"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          indicatorDataSource: {
            path: "../../test/counts/count1.json",
            refresh: 900
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              "sap.ui5": {
                componentName: "sap.ushell.components.tiles.cdm.applauncher"
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: ["standard", "compact"],
          preview: true
        },
        {
          vizId: "custom_tile_component_base",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Orange Custom Tile",
              subTitle: "img from manifest URL specifid in vizType"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              indicatorDataSource: {
                path: "../../demotiles/cdm/customtile/odata/indicator/count23.json",
                refresh: 90
              },
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            }
          },
          title: "Orange Custom Tile",
          subtitle: "img from manifest URL specifid in vizType",
          icon: "sap-icon://time-entry-request",
          keywords: ["keyword1"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          indicatorDataSource: {
            path: "../../demotiles/cdm/customtile/odata/indicator/count23.json",
            refresh: 90
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              "sap.ui5": {
                componentName: "sap.ushell.components.tiles.cdm.applauncher"
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: ["standard", "compact"],
          preview: true
        },
        {
          vizId: "customtile2component",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Green Custom Tile",
              subTitle: "img from VizType"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              indicatorDataSource: {
                path: "../../test/counts/count333.json",
                refresh: 30
              },
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            }
          },
          title: "Green Custom Tile",
          subtitle: "img from VizType",
          icon: "sap-icon://time-entry-request",
          keywords: ["keyword1"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          indicatorDataSource: {
            path: "../../test/counts/count333.json",
            refresh: 30
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              "sap.ui5": {
                componentName: "sap.ushell.components.tiles.cdm.applauncher"
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: ["standard", "compact"],
          preview: true
        },
        {
          vizId: "customtile2WithVizChanges",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Pink Custom Tile",
              subTitle: "img from visualization"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              indicatorDataSource: {
                path: "../../test/counts/count4444.json",
                refresh: 30
              },
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            },
            "custom.namespace.of.tile": {
              backgroundImageRelativeToComponent: "custom_tile_2.png"
            }
          },
          title: "Pink Custom Tile",
          subtitle: "img from visualization",
          icon: "sap-icon://time-entry-request",
          keywords: ["keyword1"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          indicatorDataSource: {
            path: "../../test/counts/count4444.json",
            refresh: 30
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              "sap.ui5": {
                componentName: "sap.ushell.components.tiles.cdm.applauncher"
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: ["standard", "compact"],
          preview: true
        },
        {
          vizId: "sap.ushell.demo.AppNavSample",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            }
          },
          title: "This AppNavSample action has a special default value, but requires /ui2/par",
          subtitle: "AppNavSample",
          icon: "sap-icon://Fiori2/F0018",
          keywords: ["keyword1"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "dynamic_tile_component",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile Component",
              subTitle: "configured as custom tile"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              indicatorDataSource: {
                path: "../../test/counts/count4444.json",
                refresh: 300
              },
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            }
          },
          title: "Dynamic Tile Component",
          subtitle: "configured as custom tile",
          icon: "sap-icon://time-entry-request",
          keywords: ["keyword1"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          indicatorDataSource: {
            path: "../../test/counts/count4444.json",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              "sap.ui5": {
                componentName: "sap.ushell.components.tiles.cdm.applauncher"
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: ["standard", "compact"],
          preview: true
        },
        {
          vizId: "CustomTileApplication",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "title - Custom Tile",
              info: "info - Custom Tile",
              subTitle: "subtitle - Custom Tile"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              indicatorDataSource: {
                path: "../../test/counts/count22.json",
                refresh: 900
              },
              target: {
                appId: "sap.ushell.demo.AppNavSample",
                inboundId: "inb1"
              }
            }
          },
          title: "title - Custom Tile",
          subtitle: "subtitle - Custom Tile",
          icon: "sap-icon://time-entry-request",
          keywords: ["keyword1"],
          info: "info - Custom Tile",
          target: {
            appId: "sap.ushell.demo.AppNavSample",
            inboundId: "inb1"
          },
          indicatorDataSource: {
            path: "../../test/counts/count22.json",
            refresh: 900
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              "sap.ui5": {
                componentName: "sap.ushell.components.tiles.cdm.applauncher"
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=sap.ushell.demo.AppNavSample",
          supportedDisplayFormats: ["standard", "compact"],
          preview: true
        }
      ],
      target: {
        appId: "sap.ushell.demo.AppNavSample",
        inboundId: "inb1"
      }
    },
    {
      id: "appNavSampleWithDataSource",
      title: "AppNav Sample with Data Source",
      visualizations: [
        {
          vizId: "odataTileV2inline",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile",
              subTitle: "with $inlinecount=allpages",
              info: "OData v2"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" }
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/v2/$inlinecount.json?$inlinecount=allpages",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile",
          subtitle: "with $inlinecount=allpages",
          icon: "sap-icon://time-entry-request",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "OData v2",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/v2/$inlinecount.json?$inlinecount=allpages",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "odataTileV2count",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile",
              subTitle: "with plain response",
              info: "OData v2"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" }
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/v2/$count.txt",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile",
          subtitle: "with plain response",
          icon: "sap-icon://time-entry-request",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "OData v2",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/v2/$count.txt",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: [] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "odataTileV2response",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile",
              subTitle: "with object response",
              info: "OData v2"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" }
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/v2/response.json",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile",
          subtitle: "with object response",
          icon: "sap-icon://time-entry-request",
          keywords: [],
          info: "OData v2",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/v2/response.json",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "odataTileV2nestedResponse",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile",
              subTitle: "with nested response",
              info: "OData v2"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" }
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/v2/nestedResponse.json",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile",
          subtitle: "with nested response",
          icon: "sap-icon://time-entry-request",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "OData v2",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/v2/nestedResponse.json",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "odataTileV2resultsSum",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile",
              subTitle: "with results sum (works only in CDM Tile)",
              info: "OData v2"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" }
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/v2/resultsSum.json",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile",
          subtitle: "with results sum (works only in CDM Tile)",
          icon: "sap-icon://time-entry-request",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "OData v2",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/v2/resultsSum.json",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword3"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "odataTileV4count",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile",
              subTitle: "with $count=true",
              info: "OData v4"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" }
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/v4/$count.json?$count=true&$top=0",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile",
          subtitle: "with $count=true",
          icon: "sap-icon://time-entry-request",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "OData v4",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/v4/$count.json?$count=true&$top=0",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "dynamicTile",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile",
              subTitle: "with dynamic data",
              info: "Info"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" }
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/count.json",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile",
          subtitle: "with dynamic data",
          icon: "sap-icon://time-entry-request",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "Info",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/count.json",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "dynamicTileWithDataSourceFromApp",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile with Data Source",
              subTitle: "from App"
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                dataSource: "dataSource001",
                path: "count.json",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile with Data Source",
          subtitle: "from App",
          icon: "",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            dataSource: "dataSource001",
            path: "count.json",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          dataSource: { uri: "../../test/counts/" },
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "dynamicTileWithDataSourceFromViz",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile with Data Source",
              subTitle: "from Visualization",
              dataSources: {
                dataSource002: {
                  uri: "../../test/counts/alternativeDataSource"
                }
              }
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                dataSource: "dataSource002",
                path: "count.json",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile with Data Source",
          subtitle: "from Visualization",
          icon: "",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            dataSource: "dataSource002",
            path: "count.json",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          dataSource: {
            uri: "../../test/counts/alternativeDataSource"
          },
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        },
        {
          vizId: "dynamicTileWithUserDefaults",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Dynamic Tile with User Defaults",
              subTitle: "see count request"
            },
            "sap.flp": {
              target: {
                appId: "appNavSampleWithDataSource",
                inboundId: "Action-toappnavsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/count.json?costCenter={%%UserDefault.UshellSampleCostCenter%%}",
                refresh: 300
              }
            }
          },
          title: "Dynamic Tile with User Defaults",
          subtitle: "see count request",
          icon: "",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: {
            appId: "appNavSampleWithDataSource",
            inboundId: "Action-toappnavsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/count.json?costCenter={%%UserDefault.UshellSampleCostCenter%%}",
            refresh: 300
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappnavsample?sap-ui-app-id-hint=appNavSampleWithDataSource",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "appNavSampleWithDataSource",
        inboundId: "Action-toappnavsample"
      }
    },
    {
      id: "parameterTest",
      title: "Parameter Test",
      icon: "sap-icon://customize",
      visualizations: [
        {
          vizId: "parameterTile",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Tile with parameters",
              subTitle: "Required with filter, defaulted, renamed"
            },
            "sap.flp": {
              target: {
                appId: "parameterTest",
                inboundId: "parameterTest-inb1",
                parameters: {
                  "a-required": {
                    value: { value: "1", format: "plain" }
                  },
                  "c-renamed": {
                    value: { value: "3", format: "plain" }
                  },
                  "d-additional": {
                    value: { value: "4", format: "plain" }
                  },
                  "sap-ui-app-id-hint": {
                    value: {
                      value: "parameterTest",
                      format: "plain"
                    }
                  }
                }
              }
            }
          },
          title: "Tile with parameters",
          subtitle: "Required with filter, defaulted, renamed",
          icon: "sap-icon://customize",
          keywords: ["Tag Keyword"],
          info: "",
          target: {
            appId: "parameterTest",
            inboundId: "parameterTest-inb1",
            parameters: {
              "a-required": {
                value: { value: "1", format: "plain" }
              },
              "c-renamed": {
                value: { value: "3", format: "plain" }
              },
              "d-additional": {
                value: { value: "4", format: "plain" }
              },
              "sap-ui-app-id-hint": {
                value: {
                  value: "parameterTest",
                  format: "plain"
                }
              }
            }
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Parameters-test?a-required=1&c-renamed=3&d-additional=4&sap-ui-app-id-hint=parameterTest",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "parameterTest",
        inboundId: "parameterTest-inb1",
        parameters: {
          "a-required": { value: { value: "1", format: "plain" } },
          "c-renamed": { value: { value: "3", format: "plain" } },
          "d-additional": {
            value: { value: "4", format: "plain" }
          },
          "sap-ui-app-id-hint": {
            value: { value: "parameterTest", format: "plain" }
          }
        }
      }
    },
    {
      id: "parameterTest",
      title: "Parameter Test",
      icon: "sap-icon://customize",
      visualizations: [
        {
          vizId: "parameterTileWithUserDefaults",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Tile with parameters from user defaults"
            },
            "sap.flp": {
              target: {
                appId: "parameterTest",
                inboundId: "parameterTest-inb2"
              }
            }
          },
          title: "Tile with parameters from user defaults",
          subtitle: "",
          icon: "sap-icon://customize",
          info: "An Info Text",
          target: {
            appId: "parameterTest",
            inboundId: "parameterTest-inb2"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",

                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Parameters-testUserDefaults?sap-ui-app-id-hint=parameterTest",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "parameterTest",
        inboundId: "parameterTest-inb2"
      }
    },
    {
      id: "appstateformsampledynamictile",
      title: "App State form sample",
      subtitle: "parameter Rename Case 1",
      description: "App State form sample description with a very long descrption for this application that can be displayed in the search result application with a list.",
      icon: "../../../../../resources/sap/ushell/themes/base/img/SAPLogo.svg",
      visualizations: [
        {
          vizId: "appstateformsampledynamictile",
          vizType: "sap.ushell.DynamicAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "appstateformsampledynamictile",
                inboundId: "Action-toappstateformsample"
              },
              indicatorDataSource: {
                path: "../../test/counts/count1.json",
                toBeDeleted: true
              }
            }
          },
          title: "App State form sample",
          subtitle: "parameter Rename Case 1",
          icon: "../../../../../resources/sap/ushell/themes/base/img/SAPLogo.svg",
          info: "An Info Text",
          target: {
            appId: "appstateformsampledynamictile",
            inboundId: "Action-toappstateformsample"
          },
          indicatorDataSource: {
            path: "../../test/counts/count1.json",
            toBeDeleted: true
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                _version: "1.0.0",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                description: "",
                ach: "CA-FLP-FE-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                  type: "JS"
                },
                handleValidation: false
              }
            }
          },
          targetURL: "#Action-toappstateformsample?sap-ui-app-id-hint=appstateformsampledynamictile",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "appstateformsampledynamictile",
        inboundId: "Action-toappstateformsample"
      }
    },
    {
      id: "AppStateSampleIcon",
      title: "App State - Icons",
      subtitle: "icons with categories",
      icon: "../../../../../resources/sap/ushell/themes/base/img/SAPLogo.svg",
      visualizations: [
        {
          vizId: "AppStateSampleIcon",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "AppStateSampleIcon",
                inboundId: "Action-toappstatesample"
              }
            }
          },
          title: "App State - Icons",
          subtitle: "icons with categories",
          icon: "../../../../../resources/sap/ushell/themes/base/img/SAPLogo.svg",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: {
            appId: "AppStateSampleIcon",
            inboundId: "Action-toappstatesample"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Action-toappstatesample?sap-ui-app-id-hint=AppStateSampleIcon",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "AppStateSampleIcon",
        inboundId: "Action-toappstatesample"
      }
    },
    {
      id: "AppPersSampleFav",
      title: "App Personalization Sample Favourites",
      subtitle: "set favourites",
      icon: "sap-icon://undefined/favorite",
      visualizations: [
        {
          vizId: "AppPersSampleFav",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "AppPersSampleFav",
                inboundId: "Action-toAppPersSampleFav"
              }
            }
          },
          title: "App Personalization Sample Favourites",
          subtitle: "set favourites",
          icon: "sap-icon://undefined/favorite",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: {
            appId: "AppPersSampleFav",
            inboundId: "Action-toAppPersSampleFav"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Action-toAppPersSampleFav?sap-ui-app-id-hint=AppPersSampleFav",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "AppPersSampleFav",
        inboundId: "Action-toAppPersSampleFav"
      }
    },
    {
      id: "sap.ushell.demo.bookmark",
      title: "Bookmark Sample App",
      subtitle: "sample subtitle",
      icon: "sap-icon://favorite",
      visualizations: [
        {
          vizId: "sap.ushell.demo.bookmark",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "sap.ushell.demo.bookmark",
                inboundId: "target"
              }
            }
          },
          title: "Bookmark Sample App",
          subtitle: "sample subtitle",
          icon: "sap-icon://favorite",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.bookmark",
            inboundId: "target"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Action-toBookmark?sap-ui-app-id-hint=sap.ushell.demo.bookmark",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: { appId: "sap.ushell.demo.bookmark", inboundId: "target" }
    },
    {
      id: "sap.ushell.example.startURL",
      title: "New York Times",
      subtitle: "",
      icon: "sap-icon://world",
      info: "The New York Times is an American daily newspaper",
      keywords: ["Keyword1", "Tag Keyword"],
      target: { type: "URL", url: "http://www.nytimes.com" },
      visualizations: [
        {
          vizId: "sap.ushell.example.startURL",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "New York Times",
              info: "The New York Times is an American daily newspaper"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://world" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              target: {
                type: "URL",
                url: "http://www.nytimes.com"
              }
            }
          },
          title: "New York Times",
          subtitle: "",
          icon: "sap-icon://world",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "The New York Times is an American daily newspaper",
          target: { type: "URL", url: "http://www.nytimes.com" },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "http://www.nytimes.com",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ]
    },
    {
      id: "sap.ushell.example.startURL2",
      title: "Example Page...",
      subtitle: "a real example",
      icon: "sap-icon://world",
      info: "An Info Text",
      keywords: ["Keyword1", "Tag Keyword"],
      target: { type: "URL", url: "https://www.example.com" },
      visualizations: [
        {
          vizId: "sap.ushell.example.startURL2",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Example Page...",
              subTitle: "a real example"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://world" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              target: {
                type: "URL",
                url: "https://www.example.com"
              }
            }
          },
          title: "Example Page...",
          subtitle: "a real example",
          icon: "sap-icon://world",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: { type: "URL", url: "https://www.example.com" },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "https://www.example.com",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ]
    },
    {
      id: "parameterRenameCase1",
      title: "Action parameter Rename Case 1",
      subtitle: "parameter Rename Case 1",
      icon: "sap-icon://Fiori2/F0005",
      visualizations: [
        {
          vizId: "parameterRenameCase1",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "parameterRenameCase1",
                inboundId: "Action-parameterRename"
              }
            }
          },
          title: "Action parameter Rename Case 1",
          subtitle: "parameter Rename Case 1",
          icon: "sap-icon://Fiori2/F0005",
          keywords: ["Action"],
          info: "An Info Text",
          target: {
            appId: "parameterRenameCase1",
            inboundId: "Action-parameterRename"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Action"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Action-parameterRename?sap-ui-app-id-hint=parameterRenameCase1",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "parameterRenameCase1",
        inboundId: "Action-parameterRename"
      }
    },
    {
      id: "parameterRenameCase8",
      title: "Parameter rename",
      subtitle: "Case 8",
      icon: "sap-icon://Fiori2/F0005",
      technicalAttributes: ["APPTYPE_SEARCHAPP", "APPTYPE_HOMEPAGE"],
      visualizations: [
        {
          vizId: "parameterRenameCase8",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "parameterRenameCase8",
                inboundId: "Action-parameterRename"
              }
            }
          },
          title: "Parameter rename",
          subtitle: "Case 8",
          icon: "sap-icon://Fiori2/F0005",
          keywords: ["Test", "A Case With", " 3 Keywords"],
          info: "An Info Text",
          target: {
            appId: "parameterRenameCase8",
            inboundId: "Action-parameterRename"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Action-parameterRename?sap-ui-app-id-hint=parameterRenameCase8",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "parameterRenameCase8",
        inboundId: "Action-parameterRename"
      }
    },
    {
      id: "AppDescId1234",
      title: "translated title of application",
      icon: "sap-icon://Fiori2/F0018",
      visualizations: [
        {
          vizId: "AppDescId1234",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "AppDescId1234",
                inboundId: "start"
              }
            }
          },
          title: "translated title of application",
          subtitle: "",
          icon: "sap-icon://Fiori2/F0018",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: { appId: "AppDescId1234", inboundId: "start" },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Start-me?sap-ui-app-id-hint=AppDescId1234",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: { appId: "AppDescId1234", inboundId: "start" }
    },
    {
      id: "WDANavTarget-display",
      title: "Display navigation targets",
      subtitle: "WDANavTarget-display",
      icon: "sap-icon://Fiori5/F0818",
      visualizations: [
        {
          vizId: "WDANavTarget-display",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "WDANavTarget-display",
                inboundId: "WDANavTarget-display"
              }
            }
          },
          title: "Display navigation targets",
          subtitle: "WDANavTarget-display",
          icon: "sap-icon://Fiori5/F0818",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: {
            appId: "WDANavTarget-display",
            inboundId: "WDANavTarget-display"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#WDANavTarget-display?sap-ui-app-id-hint=WDANavTarget-display",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "WDANavTarget-display",
        inboundId: "WDANavTarget-display"
      }
    },
    {
      id: "sap.ushell.example.startURL3",
      title: "UI5 Demokit",
      subtitle: "a real demokit!",
      icon: "sap-icon://sap-ui5",
      info: "An Info Text",
      keywords: ["Keyword1", "Tag Keyword"],
      target: { type: "URL", url: "https://ui5.sap.com" },
      visualizations: [
        {
          vizId: "sap.ushell.example.startURL3",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "UI5 Demokit",
              subTitle: "a real demokit!"
            },
            "sap.ui": {
              icons: { icon: "sap-icon://sap-ui5" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              target: {
                type: "URL",
                url: "https://ui5.sap.com"
              }
            }
          },
          title: "UI5 Demokit",
          subtitle: "a real demokit!",
          icon: "sap-icon://sap-ui5",
          keywords: ["Application"],
          info: "An Info Text",
          target: { type: "URL", url: "https://ui5.sap.com" },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "https://ui5.sap.com",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ]
    },
    {
      id: "sap.ushell.example.startURL.Concur",
      title: "Concur",
      subtitle: "absolute icon URL",
      icon: "https://www-us.api.concursolutions.com/appcenter/api/v3/listings/550353cc99066b13221bcded/images/57e5b5bab490ec6ac904e887",
      info: "An Info Text",
      description: "App State form sample description with a very long descrption for this application that can be displayed in the search result application with a list.",
      keywords: ["Cocur", "Travel", "Expense", "Management"],
      target: { type: "URL", url: "https://www.concur.com/" },
      visualizations: [
        {
          vizId: "sap.ushell.example.startURL.Concur",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": {
              title: "Concur",
              subTitle: "absolute icon URL"
            },
            "sap.ui": {
              icons: {
                icon: "https://www-us.api.concursolutions.com/appcenter/api/v3/listings/550353cc99066b13221bcded/images/57e5b5bab490ec6ac904e887"
              },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              target: {
                type: "URL",
                url: "https://www.concur.com/"
              }
            }
          },
          title: "Concur",
          subtitle: "absolute icon URL",
          icon: "https://www-us.api.concursolutions.com/appcenter/api/v3/listings/550353cc99066b13221bcded/images/57e5b5bab490ec6ac904e887",
          keywords: ["Tag Keyword"],
          info: "An Info Text",
          target: { type: "URL", url: "https://www.concur.com/" },
          isBookmark: false,
          contentProviderId: "",
          contentProviderLabel: "Concur Provider",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Other"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "https://www.concur.com/",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ]
    },
    {
      id: "sap.ushell.demotiles.cdm.newstile",
      title: "News",
      subtitle: "no subtitle",
      icon: "sap-icon://time-entry-request",
      info: "An Info Text",
      keywords: ["Keyword1", "Tag Keyword"],
      target: { semanticObject: "Action", action: "toappnavsample" },
      visualizations: [
        {
          vizId: "sap.ushell.demotiles.cdm.newstile",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.app": { title: "News", subTitle: "no subtitle" },
            "sap.ui": {
              icons: { icon: "sap-icon://time-entry-request" },
              deviceTypes: {
                desktop: true,
                tablet: true,
                phone: true
              }
            },
            "sap.flp": {
              target: {
                semanticObject: "Action",
                action: "toappnavsample"
              }
            }
          },
          title: "News",
          subtitle: "no subtitle",
          icon: "sap-icon://time-entry-request",
          keywords: ["Keyword1", "Tag Keyword"],
          info: "An Info Text",
          target: {
            semanticObject: "Action",
            action: "toappnavsample"
          },
          isBookmark: false,
          contentProviderId: "",
          contentProviderLabel: "Another Provider",
          displayFormatHint: "standardWide",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              "sap.ui5": {
                componentName: "sap.ushell.components.tiles.cdm.applauncher"
              }
            }
          },
          targetURL: "#Action-toappnavsample",
          supportedDisplayFormats: ["standardWide", "compact"],
          preview: true
        }
      ]
    },
    {
      id: "DisplayOnDesktopOnly",
      title: "Display only on Desktop",
      icon: "sap-icon://Fiori2/F0018",
      visualizations: [
        {
          vizId: "DisplayOnDesktopOnly",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "DisplayOnDesktopOnly",
                inboundId: "start"
              }
            }
          },
          title: "Display only on Desktop",
          subtitle: "",
          icon: "sap-icon://Fiori2/F0018",
          info: "An Info Text",
          target: {
            appId: "DisplayOnDesktopOnly",
            inboundId: "start"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Display-Desktop?sap-ui-app-id-hint=DisplayOnDesktopOnly",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: { appId: "DisplayOnDesktopOnly", inboundId: "start" }
    },
    {
      id: "OnlyInCat",
      title: "This App only in a catalog",
      icon: "sap-icon://Fiori2/F0022",
      visualizations: [
        {
          vizId: "OnlyInCat",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: { appId: "OnlyInCat", inboundId: "start" }
            }
          },
          title: "This App only in a catalog",
          subtitle: "",
          icon: "sap-icon://Fiori2/F0022",
          description: "This is a description of the app. it is a very long description that should be displayed in the search result application with a list. "+
          "It is expected that the description will be not truncated but wrapped to the next line. ",
          info: "An Info Text",
          target: { appId: "OnlyInCat", inboundId: "start" },
          isBookmark: false,
          contentProviderId: "",
          contentProviderLabel: "MyProviderLabel",
          displayFormatHint: "standard",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Only-incat?sap-ui-app-id-hint=OnlyInCat",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: { appId: "OnlyInCat", inboundId: "start" }
    },
    {
      id: "sap.ushell.demo.AppDirtyStateProvider",
      title: "Dirty state providers demo",
      subtitle: "AppDirtyStateProvider",
      icon: "sap-icon://sys-monitor",
      visualizations: [
        {
          vizId: "sap.ushell.demo.AppDirtyStateProvider",
          vizType: "sap.ushell.StaticAppLauncher",
          vizConfig: {
            "sap.flp": {
              target: {
                appId: "sap.ushell.demo.AppDirtyStateProvider",
                inboundId: "inb1"
              }
            }
          },
          title: "Dirty state providers demo",
          subtitle: "AppDirtyStateProvider",
          icon: "sap-icon://sys-monitor",
          info: "An Info Text",
          target: {
            appId: "sap.ushell.demo.AppDirtyStateProvider",
            inboundId: "inb1"
          },
          isBookmark: false,
          contentProviderId: "",
          displayFormatHint: "standard",
          description: "This is a description of the app. it is a very long description that should be displayed in the search result application with a list. "+
          "It is expected that the description will be not truncated but wrapped to the next line. ",
          _instantiationData: {
            platform: "CDM",
            vizType: {
              _version: "1.21.0",
              "sap.flp": {
                type: "tile",
                tileSize: "1x1",
                vizOptions: {
                  displayFormats: {
                    supported: [
                      "standard",
                      "compact",
                      "flat",
                      "flatWide",
                      "standardWide"
                    ],
                    default: "standard"
                  }
                }
              },
              "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component",
                applicationVersion: { version: "1.0.0" },
                title: "",
                tags: { keywords: ["Keyword1", "Tag Keyword"] },
                ach: "CA-FE-FLP-COR"
              },
              "sap.ui": {
                _version: "1.1.0",
                technology: "UI5",
                icons: { icon: "" },
                deviceTypes: {
                  desktop: true,
                  tablet: true,
                  phone: true
                },
                supportedThemes: [
                  "sap_hcb",
                  "sap_belize",
                  "sap_belize_plus"
                ]
              },
              "sap.ui5": {
                _version: "1.1.0",
                componentName: "sap.ushell.components.tiles.cdm.applauncher",
                dependencies: {
                  minUI5Version: "1.42",
                  libs: { "sap.m": {} }
                },
                rootView: {
                  viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                  type: "XML"
                },
                handleValidation: false,
                contentDensities: {
                  compact: true,
                  cozy: true
                }
              }
            }
          },
          targetURL: "#Action-toappdirtystateprovider?sap-ui-app-id-hint=sap.ushell.demo.AppDirtyStateProvider",
          supportedDisplayFormats: [
            "standard",
            "compact",
            "flat",
            "flatWide",
            "standardWide"
          ],
          preview: true
        }
      ],
      target: {
        appId: "sap.ushell.demo.AppDirtyStateProvider",
        inboundId: "inb1"
      }
    }
  ];
});

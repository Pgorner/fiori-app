// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.utilsCdm
 */
sap.ui.define([
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications",
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ushell/test/adapters/cdm/ClientSideTargetResolutionAdapter.testData"
], function (oUtilsCdm, urlParsing, readApplications, Log, ObjectPath) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    var O_CDM_SITE_SERVICE_MOCK_DATA = ObjectPath.get("sap.ushell.test.data.cdm.cdmSiteService"),
        O_CDM_SITE = O_CDM_SITE_SERVICE_MOCK_DATA.site;

    QUnit.module("sap.ushell.test.utils.utilsCdm");

    QUnit.test("#mapOne returns correct inbound for cards", function (assert) {
        // Arrange
        var oVisualization = {},
            oVisualizationType = { "sap.app": { type: "card" } };

        // Act
        var oResult = oUtilsCdm.mapOne(undefined, undefined, undefined, oVisualization, oVisualizationType).tileResolutionResult;

        // Assert
        assert.ok(oResult.isCard, "The isCard Property of the returned Inboud is true");
    });

    QUnit.test("#mapOne can forward the correct templateContext to ClientSideTargetResolution", function (assert) {
        var sKey = "INBOUND_KEY";

        var oTemplatePayload = {
            urlTemplate: "SOME_TEMPLATE",
            parameters: { names: { SOME: "TEMPLATE PARAMETERS" } }
        };

        var oSite = {
            urlTemplates: {
                "url.template.fiori": {
                    identification: { id: "url.template.fiori" },
                    payload: oTemplatePayload
                }
            }
        };
        var oSrc = {
            semanticObject: "InvoiceList",
            action: "manage",
            signature: {
                parameters: {},
                additionalParameters: "allowed"
            }
        };
        var oApp = {
            "sap.app": { destination: "fiori_blue_box" },
            "sap.integration": {
                urlTemplateId: "url.template.fiori",
                urlTemplateParams: {
                    appId: "cus.sd.billingdoclist.manages1",
                    platform: "CF"
                }
            },
            "sap.flp": {},
            "sap.ui": { technology: "URL" }
        };

        // act
        var oMapped = oUtilsCdm.mapOne(sKey, oSrc, oApp, undefined, undefined, oSite); // don't care about return value.

        // assert
        assert.strictEqual(oMapped.hasOwnProperty("templateContext"), true, "templateContext was found in the mapped target");
        if (oMapped.templateContext) {
            assert.deepEqual(oMapped.templateContext, {
                payload: oTemplatePayload,
                site: oSite,
                siteAppSection: oApp
            }, "templateContext is as expected");
        }
    });

    QUnit.test("#mapOne does not modify input parameters", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            semanticObject: "so",
            action: "action",
            signature: {} // used to get modified
        };
        var oApp = {
            "sap.app": {
                id: "foo",
                crossNavigation: {
                    inbounds: {
                        INBOUND_KEY: {
                            semanticObject: "so",
                            action: "action"
                        }
                    }
                }
            },
            "sap.url": { uri: "http://path/to/resource" },
            "sap.ui": {
                technology: "URL",
                deviceTypes: {} // used to get modified
            }
        };
        var oVisualization = {
            vizType: "vizType1",
            vizConfig: {
                "sap.app": { title: "Pink Custom Tile" },
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
                        appId: "foo",
                        inboundId: "INBOUND_KEY"
                    }
                },
                "custom.namespace.of.tile": { backgroundImageRelativeToComponent: "custom_tile_2.png" }
            }
        };
        var oVizType = {
            "sap.app": {
                id: "customtile2component",
                applicationVersion: { version: "1.0.0" },
                title: "Green Custom Tile",
                ach: "CA-UI2-INT-FE"
            },
            "sap.flp": {
                type: "tile",
                tileSize: "1x1"
            },
            "sap.ui5": { componentName: "sap.ushell.demotiles.cdm.customtile" },
            "sap.ui": {
                deviceTypes: {
                    desktop: true,
                    tablet: true,
                    phone: true
                }
            },
            "custom.namespace.of.tile": { backgroundImageRelativeToComponent: "custom_tile_3.png" },
            "sap.platform.runtime": {
                includeManifest: true,
                componentProperties: {
                    name: "componentName",
                    url: "componentUrl"
                }
            }
        };

        var sKeyClone = sKey;
        var oSrcClone = JSON.parse(JSON.stringify(oSrc)); // clone without dependencies
        var oAppClone = JSON.parse(JSON.stringify(oApp)); // clone without dependencies
        var oVisualizationClone = JSON.parse(JSON.stringify(oVisualization)); // clone without dependencies
        var oVizTypeClone = JSON.parse(JSON.stringify(oVizType)); // clone without dependencies

        // act
        oUtilsCdm.mapOne(sKey, oSrc, oApp, oVisualization, oVizType); // don't care about return value.

        // assert
        assert.strictEqual(sKey, sKeyClone, "sKey was not modified");
        assert.deepEqual(oSrc, oSrcClone, "oSrc was not modified");
        assert.deepEqual(oApp, oAppClone, "oApp was not modified");
        assert.deepEqual(oVisualization, oVisualizationClone, "oVisualization was not modified");
        assert.deepEqual(oVizType, oVizTypeClone, "oVisualizationType was not modified");
    });

    QUnit.test("#mapOne uses `sap.url` when 'getMember(oApp, \"sap|ui.technology\") === \"URL\"', and `oApp` has no `sap.platform.runtime`", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            semanticObject: "so",
            action: "action"
        };
        var oApp = {
            "sap.app": {
                id: "foo",
                crossNavigation: {
                    inbounds: {
                        INBOUND_KEY: {
                            semanticObject: "so",
                            action: "action"
                        }
                    }
                }
            },
            "sap.url": { uri: "http://path/to/resource" },
            "sap.ui": { technology: "URL" }
        };

        var oExpectedInbound = {
            semanticObject: "so",
            action: "action",
            title: undefined,
            info: undefined,
            icon: undefined,
            subTitle: undefined,
            shortTitle: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: "foo",
                applicationType: "URL",
                url: "http://path/to/resource",
                "sap.platform.runtime": { url: "http://path/to/resource" },
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: undefined,
                "sap.ui": { technology: "URL" }
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            deviceTypes: {
                desktop: true,
                phone: true,
                tablet: true
            },
            tileResolutionResult: {
                appId: "foo",
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: true,
                    tablet: true
                },
                description: undefined,
                icon: undefined,
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                technicalInformation: undefined,
                tileComponentLoadInfo: {},
                title: undefined,
                keywords: undefined,
                numberUnit: undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp);

        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("mapOne returns indicatorDataSource and dataSources if defined", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            semanticObject: "so",
            action: "action"
        };
        var oApp = {
            "sap.app": {
                id: "bar",
                dataSources: {
                    fooService: { uri: "/sap/opu/odata/foo/" }
                },
                crossNavigation: {
                    inbounds: {
                        INBOUND_KEY: {
                            semanticObject: "so",
                            action: "action"
                        }
                    }
                }
            },
            "sap.url": { uri: "http://path/to/resource" },
            "sap.ui": { technology: "URL" }
        };

        var oVisualization = {
            vizType: "sap.ushell.StaticAppLauncher",
            businessApp: "The.BusinessApp",
            vizConfig: {
                "sap.flp": {
                    target: {
                        appId: "bar",
                        inboundId: "INBOUND_KEY"
                    },
                    indicatorDataSource: {
                        dataSource: "fooService",
                        path: "test/counts/count1.json"
                    }
                }
            }
        };

        var oExpectedInbound = {
            semanticObject: "so",
            action: "action",
            title: undefined,
            info: undefined,
            icon: undefined,
            subTitle: undefined,
            shortTitle: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: "bar",
                applicationType: "URL",
                url: "http://path/to/resource",
                "sap.platform.runtime": { url: "http://path/to/resource" },
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: undefined,
                "sap.ui": { technology: "URL" }
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            deviceTypes: {
                desktop: true,
                phone: true,
                tablet: true
            },
            tileResolutionResult: {
                appId: "bar",
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: true,
                    tablet: true
                },
                description: undefined,
                icon: undefined,
                indicatorDataSource: {
                    dataSource: "fooService",
                    path: "test/counts/count1.json"
                },
                dataSources: { fooService: { uri: "/sap/opu/odata/foo/" } },
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                technicalInformation: undefined,
                tileComponentLoadInfo: {},
                title: undefined,
                keywords: undefined,
                numberUnit: undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp, oVisualization);
        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("mapOne returns content provider id if defined", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            semanticObject: "so",
            action: "action"
        };
        var oApp = {
            "sap.app": {
                id: "bar",
                contentProviderId: "sContentProviderId",
                dataSources: { fooService: { uri: "/sap/opu/odata/foo/" } },
                crossNavigation: {
                    inbounds: {
                        INBOUND_KEY: {
                            semanticObject: "so",
                            action: "action"
                        }
                    }
                }
            },
            "sap.url": { uri: "http://path/to/resource" },
            "sap.ui": { technology: "URL" }
        };

        var oVisualization = {
            vizType: "sap.ushell.StaticAppLauncher",
            businessApp: "The.BusinessApp",
            vizConfig: {
                "sap.flp": {
                    target: {
                        appId: "bar",
                        inboundId: "INBOUND_KEY"
                    },
                    indicatorDataSource: {
                        dataSource: "fooService",
                        path: "test/counts/count1.json"
                    }
                }
            }
        };

        var oExpectedInbound = {
            semanticObject: "so",
            action: "action",
            title: undefined,
            info: undefined,
            icon: undefined,
            subTitle: undefined,
            shortTitle: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: "bar",
                applicationType: "URL",
                url: "http://path/to/resource",
                "sap.platform.runtime": { url: "http://path/to/resource" },
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: undefined,
                "sap.ui": { technology: "URL" }
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            deviceTypes: {
                desktop: true,
                phone: true,
                tablet: true
            },
            tileResolutionResult: {
                appId: "bar",
                contentProviderId: "sContentProviderId",
                deviceTypes: {
                    desktop: true,
                    phone: true,
                    tablet: true
                },
                description: undefined,
                icon: undefined,
                indicatorDataSource: {
                    dataSource: "fooService",
                    path: "test/counts/count1.json"
                },
                dataSources: { fooService: { uri: "/sap/opu/odata/foo/" } },
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                technicalInformation: undefined,
                tileComponentLoadInfo: {},
                title: undefined,
                keywords: undefined,
                numberUnit: undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp, oVisualization);
        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("mapOne returns correct numberUnit if defined", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            semanticObject: "so",
            action: "action"
        };
        var oApp = {
            "sap.app": {
                id: "bar",
                dataSources: { fooService: { uri: "/sap/opu/odata/foo/" } },
                crossNavigation: {
                    inbounds: {
                        INBOUND_KEY: {
                            semanticObject: "so",
                            action: "action"
                        }
                    }
                }
            },
            "sap.url": { uri: "http://path/to/resource" },
            "sap.ui": { technology: "URL" }
        };

        var oVisualization = {
            vizType: "sap.ushell.StaticAppLauncher",
            businessApp: "The.BusinessApp",
            vizConfig: {
                "sap.flp": {
                    target: {
                        appId: "bar",
                        inboundId: "INBOUND_KEY"
                    },
                    indicatorDataSource: {
                        dataSource: "fooService",
                        path: "test/counts/count1.json"
                    },
                    numberUnit: "someUnit"
                }
            }
        };

        var oExpectedInbound = {
            semanticObject: "so",
            action: "action",
            title: undefined,
            info: undefined,
            icon: undefined,
            subTitle: undefined,
            shortTitle: undefined,
            keywords: undefined,
            numberUnit: "someUnit",
            resolutionResult: {
                appId: "bar",
                applicationType: "URL",
                url: "http://path/to/resource",
                "sap.platform.runtime": { url: "http://path/to/resource" },
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: undefined,
                "sap.ui": { technology: "URL" }
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            deviceTypes: {
                desktop: true,
                phone: true,
                tablet: true
            },
            tileResolutionResult: {
                appId: "bar",
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: true,
                    tablet: true
                },
                description: undefined,
                icon: undefined,
                indicatorDataSource: {
                    dataSource: "fooService",
                    path: "test/counts/count1.json"
                },
                dataSources: { fooService: { uri: "/sap/opu/odata/foo/" } },
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                technicalInformation: undefined,
                tileComponentLoadInfo: {},
                title: undefined,
                keywords: undefined,
                numberUnit: "someUnit"
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp, oVisualization);
        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("#mapOne uses `sap.platform.runtime` when `sap.url` is not available", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            semanticObject: "so",
            action: "action"
        };
        var oApp = {
            "sap.app": {
                id: "fooBar",
                crossNavigation: {
                    inbounds: {
                        INBOUND_KEY: {
                            semanticObject: "so",
                            action: "action"
                        }
                    }
                }
            },
            "sap.ui": { technology: "URL" },
            "sap.platform.runtime": { uri: "http://path/to/resource" }
        };

        var oExpectedInbound = {
            semanticObject: "so",
            action: "action",
            title: undefined,
            info: undefined,
            icon: undefined,
            subTitle: undefined,
            shortTitle: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: "fooBar",
                applicationType: "URL",
                url: "http://path/to/resource",
                uri: "http://path/to/resource",
                "sap.platform.runtime": {
                    uri: "http://path/to/resource",
                    url: "http://path/to/resource"
                },
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: undefined,
                "sap.ui": { technology: "URL" }
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            deviceTypes: {
                desktop: true,
                phone: true,
                tablet: true
            },
            tileResolutionResult: {
                appId: "fooBar",
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: true,
                    tablet: true
                },
                description: undefined,
                icon: undefined,
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: { uri: "http://path/to/resource" },
                size: undefined,
                subTitle: undefined,
                technicalInformation: undefined,
                tileComponentLoadInfo: {},
                title: undefined,
                keywords: undefined,
                numberUnit: undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp);

        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("#mapOne uses neither `sap.url` nor `sap.platform.runtime` when neither of them are defined", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            semanticObject: "so",
            action: "action"
        };
        var oApp = {
            "sap.app": {
                crossNavigation: {
                    inbounds: {
                        INBOUND_KEY: {
                            semanticObject: "so",
                            action: "action"
                        }
                    }
                }
            },
            "sap.ui": { technology: "URL" }
        };

        var oExpectedInbound = {
            semanticObject: "so",
            action: "action",
            title: undefined,
            info: undefined,
            icon: undefined,
            subTitle: undefined,
            shortTitle: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: undefined,
                applicationType: "URL",
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: undefined,
                "sap.ui": { technology: "URL" }
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            deviceTypes: {
                desktop: true,
                phone: true,
                tablet: true
            },
            tileResolutionResult: {
                appId: undefined,
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: true,
                    tablet: true
                },
                description: undefined,
                icon: undefined,
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                technicalInformation: undefined,
                tileComponentLoadInfo: {},
                title: undefined,
                keywords: undefined,
                numberUnit: undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp);

        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("#mapOne maps catalog tile correctly for a visualization type with 'includeManifest: true' and componentProperties", function (assert) {
        var sKey = "My-customTile2";
        var oSrc = {
            semanticObject: "My",
            action: "customTile",
            signature: {
                additionalParameters: "ignored",
                parameters: {}
            }
        };
        var oVisualization = {
            vizType: "sap.ushell.demotiles.cdm.customtile",
            businessApp: "The.BusinessApp",
            vizConfig: {
                "sap.flp": {
                    target: {
                        appId: "sap.ushell.demo.AppNavSample",
                        inboundId: "Overloaded-start"
                    },
                    indicatorDataSource: {
                        path: "/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=4&srv=234132432",
                        refresh: 900
                    }
                },
                "sap.ui.smartbusiness.app": {
                    kpi: 24
                }
            }
        };
        var oApp = {
            "sap.app": {
                id: "sap.ushell.demo.AppNavSample",
                title: "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                subTitle: "AppNavSample",
                ach: "CA-UI2-INT-FE",
                applicationVersion: { version: "1.0.0" },
                crossNavigation: {
                    inbounds: {
                        inb1: {
                            semanticObject: "Action",
                            action: "toappnavsample",
                            title: "This AppNavSample action has a special default value, but requires /ui2/par",
                            signature: {
                                parameters: {
                                    "/ui2/par": { required: true },
                                    aand: {
                                        defaultValue: { value: "ddd=1234" }
                                    }
                                },
                                additionalParameters: "allowed"
                            }
                        },
                        inb2: {
                            semanticObject: "Action",
                            action: "toappnavsample",
                            signature: {
                                parameters: { P1: { renameTo: "P1New" } },
                                additionalParameters: "allowed"
                            }
                        }
                    }
                },
                tags: {
                    keywords: [
                        "keyword1 for AppNavSample",
                        "keyword2 for AppNavSample"
                    ]
                }
            },
            "sap.flp": { type: "application" },
            "sap.ui": {
                technology: "UI5",
                icons: { icon: "sap-icon://Fiori2/F0018" },
                deviceTypes: {
                    desktop: true,
                    tablet: false,
                    phone: false
                }
            },
            "sap.ui5": { componentName: "sap.ushell.demo.AppNavSample" },
            "sap.platform.runtime": { componentProperties: { url: "../../demoapps/AppNavSample?A=URL" } }
        };
        var oVisualizationType = {
            anyProperty: "must not be lost",
            "sap.ui5": { componentName: "sap.ushell.demotiles.cdm.customtile" },
            "sap.platform.runtime": {
                componentProperties: { url: "../../../../sap/ushell/demotiles/cdm/customtile" },
                includeManifest: true
            }
        };
        var oExpectedResult = {
            action: "customTile",
            deviceTypes: {
                desktop: true,
                phone: false,
                tablet: false
            },
            icon: "sap-icon://Fiori2/F0018",
            info: undefined,
            keywords: [
                "keyword1 for AppNavSample",
                "keyword2 for AppNavSample"
            ],
            numberUnit: undefined,
            resolutionResult: {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                appId: "sap.ushell.demo.AppNavSample",
                applicationDependencies: { url: "../../demoapps/AppNavSample?A=URL" },
                applicationType: "SAPUI5",
                componentProperties: { url: "../../demoapps/AppNavSample?A=URL" },
                "sap.platform.runtime": { componentProperties: { url: "../../demoapps/AppNavSample?A=URL" } },
                "sap.ui": { technology: "UI5" },
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                url: "../../demoapps/AppNavSample?A=URL"
            },
            semanticObject: "My",
            shortTitle: undefined,
            signature: {
                additionalParameters: "ignored",
                parameters: {}
            },
            subTitle: "AppNavSample",
            tileResolutionResult: {
                appId: "sap.ushell.demo.AppNavSample",
                contentProviderId: "",
                dataSources: undefined,
                description: undefined,
                deviceTypes: {
                    desktop: true,
                    phone: false,
                    tablet: false
                },
                icon: "sap-icon://Fiori2/F0018",
                indicatorDataSource: {
                    path: "/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=4&srv=234132432",
                    refresh: 900
                },
                info: undefined,
                isCard: false,
                runtimeInformation: { componentProperties: { url: "../../demoapps/AppNavSample?A=URL" } },
                size: undefined,
                subTitle: "AppNavSample",
                technicalInformation: undefined,
                tileComponentLoadInfo: {
                    componentName: "sap.ushell.demotiles.cdm.customtile",
                    componentProperties: {
                        manifest: {
                            anyProperty: "must not be lost",
                            "sap.ui5": {
                                componentName: "sap.ushell.demotiles.cdm.customtile"
                            },
                            "sap.flp": {
                                target: {
                                    appId: "sap.ushell.demo.AppNavSample",
                                    inboundId: "Overloaded-start"
                                },
                                indicatorDataSource: {
                                    path: "/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=4&srv=234132432",
                                    refresh: 900
                                }
                            },
                            "sap.ui.smartbusiness.app": {
                                kpi: 24
                            }
                        },
                        url: "../../../../sap/ushell/demotiles/cdm/customtile"
                    }
                },
                title: "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                keywords: [
                    "keyword1 for AppNavSample",
                    "keyword2 for AppNavSample"
                ],
                numberUnit: undefined
            },
            title: "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)"
        };
        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp, oVisualization, oVisualizationType);
        assert.deepEqual(oInbound, oExpectedResult, "Inbound is formatted as expected. The visualization's configuration is considered properly.");
    });

    [{
        testDescription: "WDA Application",
        input: {
            sKey: "Desktop-display",
            oSrc: {
                semanticObject: "Desktop",
                action: "display"
            },
            oApp: {
                "sap.app": {
                    applicationVersion: { version: "1.0.0" },
                    title: "WDA application",
                    subTitle: "",
                    description: "this is a WDA application",
                    destination: { name: "UI2_WDA" },
                    ach: "CA-UI2-INT-FE",
                    crossNavigation: {
                        inbounds: {
                            "Desktop-display": {
                                semanticObject: "Desktop",
                                action: "display"
                            }
                        }
                    }
                },
                "sap.ui": {
                    technology: "WDA",
                    icons: { icon: "sap-icon://Fiori2/F0032" },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.wda": { applicationId: "WDR_TEST_FLP_NAVIGATION" }
            }
        },
        expectedResult: {
            oInbound: {
                semanticObject: "Desktop",
                action: "display",
                info: undefined,
                title: "WDA application",
                icon: "sap-icon://Fiori2/F0032",
                subTitle: "",
                shortTitle: undefined,
                keywords: undefined,
                numberUnit: undefined,
                resolutionResult: {
                    appId: undefined,
                    applicationType: "WDA",
                    "sap.wda": { applicationId: "WDR_TEST_FLP_NAVIGATION" },
                    systemAlias: "UI2_WDA",
                    systemAliasSemantics: "apply",
                    text: "WDA application",
                    "sap.ui": { technology: "WDA" }
                },
                deviceTypes: {
                    desktop: true,
                    tablet: false,
                    phone: false
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {}
                },
                tileResolutionResult: {
                    appId: undefined,
                    contentProviderId: "",
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    },
                    description: "this is a WDA application",
                    icon: "sap-icon://Fiori2/F0032",
                    indicatorDataSource: undefined,
                    dataSources: undefined,
                    info: undefined,
                    isCard: false,
                    size: undefined,
                    runtimeInformation: undefined,
                    subTitle: "",
                    technicalInformation: "WDR_TEST_FLP_NAVIGATION",
                    tileComponentLoadInfo: {},
                    title: "WDA application",
                    keywords: undefined,
                    numberUnit: undefined
                }
            }
        }
    }, {
        testDescription: "GUI Application",
        input: {
            sKey: "X-PAGE:SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY",
            oSrc: {
                semanticObject: "X-PAGE",
                action: "SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY"
            },
            oApp: {
                "sap.app": {
                    id: "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                    applicationVersion: { version: "1.0.0" },
                    title: "Maintain users",
                    description: "to maintain users",
                    subTitle: "Maintain users",
                    destination: { name: "U1YCLNT111" },
                    ach: "FIN",
                    crossNavigation: {
                        inbounds: {
                            tosu01: {
                                semanticObject: "Action",
                                action: "tosu01",
                                signature: {
                                    parameters: { "sap-system": { defaultValue: { value: "U1YCLNT111" } } }
                                },
                                deviceTypes: {
                                    desktop: true,
                                    tablet: false,
                                    phone: false
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    technology: "GUI",
                    icons: { icon: "sap-icon://Fiori2/F0018" },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.flp": { type: "application" },
                "sap.gui": { transaction: "SU01" }
            }
        },
        expectedResult: {
            oInbound: {
                semanticObject: "X-PAGE",
                action: "SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY",
                info: undefined,
                title: "Maintain users",
                icon: "sap-icon://Fiori2/F0018",
                subTitle: "Maintain users",
                shortTitle: undefined,
                keywords: undefined,
                numberUnit: undefined,
                resolutionResult: {
                    appId: "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                    applicationType: "TR",
                    "sap.gui": { transaction: "SU01" },
                    systemAlias: "U1YCLNT111",
                    systemAliasSemantics: "apply",
                    text: "Maintain users",
                    "sap.ui": { technology: "GUI" }
                },
                deviceTypes: {
                    desktop: true,
                    tablet: false,
                    phone: false
                },
                signature: {
                    additionalParameters: "allowed",
                    parameters: {}
                },
                tileResolutionResult: {
                    appId: "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                    contentProviderId: "",
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    },
                    description: "to maintain users",
                    icon: "sap-icon://Fiori2/F0018",
                    indicatorDataSource: undefined,
                    dataSources: undefined,
                    info: undefined,
                    isCard: false,
                    runtimeInformation: undefined,
                    size: undefined,
                    subTitle: "Maintain users",
                    technicalInformation: "SU01",
                    tileComponentLoadInfo: {},
                    title: "Maintain users",
                    keywords: undefined,
                    numberUnit: undefined
                }
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test("#mapOne maps WDA and GUI application as expected when " + oFixture.testDescription, function (assert) {
            var oInbound = oUtilsCdm.mapOne(oFixture.input.sKey, oFixture.input.oSrc, oFixture.input.oApp);
            assert.deepEqual(oInbound, oFixture.expectedResult.oInbound, "Inbound are formatted as expected");
        });
    });

    QUnit.test("#mapOne processes parameter 'sap-hide-intent-link' correctly", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            semanticObject: "so",
            action: "action",
            signature: {
                parameters: {
                    "sap-hide-intent-link": {
                        defaultValue: {
                            value: "true"
                        }
                    }
                }
            }
        };
        var oApp = {
            "sap.app": {
                id: "foo",
                crossNavigation: {
                    inbounds: {
                        INBOUND_KEY: {
                            semanticObject: "so",
                            action: "action"
                        }
                    }
                }
            },
            "sap.url": { uri: "http://path/to/resource" },
            "sap.ui": { technology: "URL" }
        };

        var oExpectedInbound = {
            semanticObject: "so",
            action: "action",
            title: undefined,
            info: undefined,
            icon: undefined,
            subTitle: undefined,
            shortTitle: undefined,
            keywords: undefined,
            numberUnit: undefined,
            hideIntentLink: true,
            resolutionResult: {
                appId: "foo",
                applicationType: "URL",
                url: "http://path/to/resource",
                "sap.platform.runtime": { url: "http://path/to/resource" },
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: undefined,
                "sap.ui": { technology: "URL" }
            },
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            deviceTypes: {
                desktop: true,
                phone: true,
                tablet: true
            },
            tileResolutionResult: {
                appId: "foo",
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: true,
                    tablet: true
                },
                description: undefined,
                icon: undefined,
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                technicalInformation: undefined,
                tileComponentLoadInfo: {},
                title: undefined,
                keywords: undefined,
                numberUnit: undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp);

        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("#formatSite: returns an empty array when called with undefined", function (assert) {
        var oFormattedSite = oUtilsCdm.formatSite(/* undefined */);
        assert.deepEqual(oFormattedSite, [], "got empty array");
    });

    QUnit.test("#formatSite", function (assert) {
        var res = oUtilsCdm.formatSite(O_CDM_SITE);
        var O_CDM_FORMATTED_AINBOUNDS = [{
            action: "viaStatic",
            contentProviderId: "",
            deviceTypes: {
                desktop: true,
                phone: false,
                tablet: false
            },
            icon: "sap-icon://Fiori2/F0018",
            subTitle: undefined,
            info: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: undefined,
                applicationType: "WDA",
                "sap.wda": { applicationId: "WDR_TEST_FLP_NAVIGATION" },
                systemAlias: "U1YCLNT000",
                systemAliasSemantics: "apply",
                text: "translated title of application",
                "sap.ui": { technology: "WDA" }
            },
            semanticObject: "App1",
            shortTitle: "short Title",
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            tileResolutionResult: {
                appId: undefined,
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: false,
                    tablet: false
                },
                description: "description of a WDA application",
                technicalInformation: "WDR_TEST_FLP_NAVIGATION",
                icon: "sap-icon://Fiori2/F0018",
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                tileComponentLoadInfo: {},
                title: "translated title of application",
                keywords: undefined,
                numberUnit: undefined
            },
            title: "translated title of application"
        }, {
            action: "viaStatic",
            contentProviderId: "",
            deviceTypes: {
                desktop: true,
                phone: false,
                tablet: false
            },
            icon: "sap-icon://Fiori2/F0018",
            subTitle: undefined,
            info: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: undefined,
                applicationType: "WDA",
                "sap.wda": { applicationId: "WDR_TEST_FLP_NAVIGATION" },
                systemAlias: "U1YCLNT000",
                systemAliasSemantics: "apply",
                text: "translated title of application",
                "sap.ui": { technology: "WDA" }
            },
            semanticObject: "App1",
            shortTitle: "short Title",
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            tileResolutionResult: {
                appId: undefined,
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: false,
                    tablet: false
                },
                description: "description of a WDA application",
                technicalInformation: "WDR_TEST_FLP_NAVIGATION",
                icon: "sap-icon://Fiori2/F0018",
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                tileComponentLoadInfo: {},
                title: "translated title of application",
                keywords: undefined,
                numberUnit: undefined
            },
            title: "translated title of application"
        }, {
            action: "tosu01",
            contentProviderId: "",
            deviceTypes: {
                desktop: true,
                phone: false,
                tablet: true
            },
            icon: "sap-icon://Fiori2/F0018",
            subTitle: "Maintain users",
            info: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                "sap.ui": { technology: "GUI" },
                applicationType: "TR",
                "sap.gui": { transaction: "SU01" },
                systemAlias: "U1YCLNT111",
                systemAliasSemantics: "apply",
                text: "Maintain users"
            },
            semanticObject: "Action",
            shortTitle: "short Title",
            signature: {
                additionalParameters: "allowed",
                parameters: { "sap-system": { defaultValue: { value: "U1YCLNT111" } } }
            },
            tileResolutionResult: {
                appId: "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: false,
                    tablet: true
                },
                description: "to maintain users",
                technicalInformation: "SU01",
                icon: "sap-icon://Fiori2/F0018",
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: "Maintain users",
                tileComponentLoadInfo: {},
                title: "Maintain users",
                keywords: undefined,
                numberUnit: undefined
            },
            title: "Maintain users"
        }, {
            action: "toappnavsample",
            contentProviderId: "demoContentProvider1",
            deviceTypes: {
                desktop: true,
                phone: false,
                tablet: false
            },
            icon: "sap-icon://Fiori2/F0018",
            subTitle: "AppNavSample",
            info: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: undefined,
                "sap.ui": { technology: "UI5" },
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationDependencies: {
                    url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                applicationType: "SAPUI5",
                componentProperties: { url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                "sap.platform.runtime": {
                    componentProperties: { url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                "someThingElse_e.g._for_HCP": "soso",
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: "This AppNavSample action has a special default value, but requires /ui2/par",
                url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
            },
            semanticObject: "Action",
            shortTitle: "short Title",
            signature: {
                additionalParameters: "ignored",
                parameters: {
                    "/ui2/par": { required: true },
                    aand: { defaultValue: { value: "ddd=1234" } }
                }
            },
            tileResolutionResult: {
                appId: undefined,
                contentProviderId: "demoContentProvider1",
                deviceTypes: {
                    desktop: true,
                    phone: false,
                    tablet: false
                },
                icon: "sap-icon://Fiori2/F0018",
                description: "description of a UI5 application",
                technicalInformation: undefined,
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: {
                    componentProperties: { url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                size: undefined,
                subTitle: "AppNavSample",
                tileComponentLoadInfo: {},
                title: "This AppNavSample action has a special default value, but requires /ui2/par",
                keywords: undefined,
                numberUnit: undefined
            },
            title: "This AppNavSample action has a special default value, but requires /ui2/par"
        }, {
            action: "toappnavsample",
            contentProviderId: "demoContentProvider1",
            deviceTypes: {
                desktop: true,
                phone: false,
                tablet: false
            },
            icon: "sap-icon://Fiori2/F0018",
            subTitle: "AppNavSample",
            info: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: undefined,
                "sap.ui": { technology: "UI5" },
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationDependencies: { url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                applicationType: "SAPUI5",
                componentProperties: { url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                "sap.platform.runtime": {
                    componentProperties: { url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                "someThingElse_e.g._for_HCP": "soso",
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
            },
            semanticObject: "Action",
            shortTitle: "short Title",
            signature: {
                additionalParameters: "allowed",
                parameters: { P1: { renameTo: "P1New" } }
            },
            tileResolutionResult: {
                contentProviderId: "demoContentProvider1",
                appId: undefined,
                deviceTypes: {
                    desktop: true,
                    phone: false,
                    tablet: false
                },
                icon: "sap-icon://Fiori2/F0018",
                description: "description of a UI5 application",
                technicalInformation: undefined,
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: {
                    componentProperties: { url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                size: undefined,
                subTitle: "AppNavSample",
                tileComponentLoadInfo: {},
                title: "Demo actual title AppNavSample : Demos startup parameter passing "
                    + "( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                keywords: undefined,
                numberUnit: undefined
            },
            title: "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)"
        }, {
            action: "launchURL",
            contentProviderId: "",
            deviceTypes: {
                desktop: true,
                phone: false,
                tablet: false
            },
            icon: "sap-icon://Fiori2/F0018",
            subTitle: "A uri",
            info: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: undefined,
                "sap.ui": { technology: "URL" },
                applicationType: "URL",
                "sap.platform.runtime": {
                    uri: "http://nytimes.com",
                    url: "http://nytimes.com"
                },
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: "Demo starting foreign URI",
                uri: "http://nytimes.com",
                url: "http://nytimes.com"
            },
            semanticObject: "Shell",
            shortTitle: "short Title",
            signature: {
                additionalParameters: "ignored",
                parameters: {
                    "sap-external-url": {
                        filter: { value: "http://www.nytimes.com" },
                        required: true
                    }
                }
            },
            tileResolutionResult: {
                appId: undefined,
                contentProviderId: "",
                deviceTypes: {
                    desktop: true,
                    phone: false,
                    tablet: false
                },
                icon: "sap-icon://Fiori2/F0018",
                description: "description of a URL application",
                technicalInformation: undefined,
                indicatorDataSource: undefined,
                dataSources: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: { uri: "http://nytimes.com" },
                size: undefined,
                subTitle: "A uri",
                tileComponentLoadInfo: {},
                title: "Demo starting foreign URI",
                keywords: undefined,
                numberUnit: undefined
            },
            title: "Demo starting foreign URI"
        }];
        QUnit.dump.maxDepth = 10;
        assert.deepEqual(res, O_CDM_FORMATTED_AINBOUNDS, "formatted site ok");
    });

    QUnit.test("#formatSite with exception", function (assert) {
        sandbox.stub(Log, "error");
        sandbox.stub(oUtilsCdm, "_formatApplicationType").throws("Deliberate Exception");

        var aInbounds = oUtilsCdm.formatSite(O_CDM_SITE);

        assert.deepEqual(aInbounds, [], "obtained the expected response in case of error");

        assert.strictEqual(Log.error.callCount, 5, "Log.error was called once");

        [
            "Error in application AppDesc1: Deliberate Exception",
            "Error in application X-PAGE:SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY: Deliberate Exception",
            "Error in application sap.ushell.demo.AppNavSample: Deliberate Exception",
            "Error in application sap.ushell.demo.startURL: Deliberate Exception",
            "Error in application shellPluginToBeIgnored: Deliberate Exception"
        ].forEach(function (sError, iIdx) {
            assert.strictEqual(Log.error.getCall(iIdx).args[0], sError, "got expected first argument on call " + iIdx + " of Log.error");
        });

        sandbox.restore();
    });

    [{
        testDescription: "applicationType is defined",
        oApp: {},
        oResolutionResult: { applicationType: "foo" },
        expectedApplicationType: "foo"
    }, {
        testDescription: "applicationType cannot be detected",
        oApp: {},
        oResolutionResult: {},
        expectedApplicationType: "URL"
    }, {
        testDescription: "application technology is UI5",
        oApp: { "sap.ui": { technology: "UI5" } },
        oResolutionResult: {},
        expectedApplicationType: "SAPUI5"
    }, {
        testDescription: "application technology is WDA",
        oApp: { "sap.ui": { technology: "WDA" } },
        oResolutionResult: {},
        expectedApplicationType: "WDA"
    }, {
        testDescription: "application technology is GUI",
        oApp: { "sap.ui": { technology: "GUI" } },
        oResolutionResult: {},
        expectedApplicationType: "TR"
    }, {
        testDescription: "application technology is URL",
        oApp: { "sap.ui": { technology: "URL" } },
        oResolutionResult: {},
        expectedApplicationType: "URL"
    }].forEach(function (oFixture) {
        QUnit.test("#_formatApplicationType: returns " + oFixture.expectedApplicationType + " when " + oFixture.testDescription, function (assert) {
            var sGotApplicationType;

            sandbox.stub(Log, "warning");
            sandbox.stub(Log, "error");

            sGotApplicationType = oUtilsCdm._formatApplicationType(oFixture.oResolutionResult, oFixture.oApp);

            assert.strictEqual(sGotApplicationType, oFixture.expectedApplicationType, "got expected application type");
            assert.strictEqual(Log.warning.callCount, 0, "no calls to Log.warning");
            assert.strictEqual(Log.error.callCount, 0, "no calls to Log.error");

            sandbox.restore();
        });
    });

    QUnit.module("toHashFromInbound", {
        beforeEach: function () {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result when called with inbound", function (assert) {
        // Act
        var sResult = oUtilsCdm.toHashFromInbound({
            semanticObject: "SampleObject",
            action: "sampleAction"
        });

        // Assert
        assert.strictEqual(sResult, "SampleObject-sampleAction", "Returned the correct result");
    });

    QUnit.test("Returns the correct result when called with inbound and appID", function (assert) {
        // Act
        var sResult = oUtilsCdm.toHashFromInbound({
            semanticObject: "SampleObject",
            action: "sampleAction"
        }, "sampleAppId");

        // Assert
        assert.strictEqual(sResult, "SampleObject-sampleAction?sap-ui-app-id-hint=sampleAppId", "Returned the correct result");
    });

    QUnit.module("toHashFromVizData", {
        beforeEach: function () {
            this.aVizDataMock = {
                empty: {},
                url: {
                    target: {
                        type: "URL",
                        url: "someUrl"
                    }
                },
                appId: {
                    target: {
                        appId: "someAppId",
                        inboundId: "someInboundId",
                        parameters: {
                            some: {
                                value: {
                                    value: "parameter",
                                    format: "plain"
                                }
                            }
                        },
                        appSpecificRoute: "/test"
                    }
                },
                appIdWithoutParameters: {
                    target: {
                        appId: "someAppId",
                        inboundId: "someInboundId"
                    }
                },
                semanticObject: {
                    target: {
                        semanticObject: "Action",
                        action: "toSample",
                        parameters: {
                            another: {
                                value: {
                                    value: "parameter",
                                    format: "plain"
                                }
                            }
                        },
                        appSpecificRoute: "/anotherTest"
                    }
                },
                emptyTarget: {
                    target: {}
                }
            };
            this.oApplicationsMock = {
                id: "Applications"
            };

            this.oGetInboundTargetStub = sandbox.stub(readApplications, "getInboundTarget");
            this.oGetInboundTargetStub.withArgs(this.oApplicationsMock, "someAppId", "someInboundId").returns(this.aVizDataMock.semanticObject.target);
            this.oToHashFromTargetStub = sandbox.stub(oUtilsCdm, "toHashFromTarget");
            this.oToHashFromTargetStub.callsFake(function (oTarget) {
                try {
                    var sHash = "#" + oTarget.semanticObject + "-" + oTarget.action + "?";
                    Object.keys(oTarget.parameters).forEach(function (sKey) {
                        var oParameter = oTarget.parameters[sKey];
                        sHash += sKey + "=" + oParameter.value.value + "&";
                    });
                    sHash += oTarget.appSpecificRoute;
                    return sHash;
                } catch (oErr) {
                    return undefined;
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result if there is no target", function (assert) {
        // Arrange
        // Act
        var sResult = oUtilsCdm.toHashFromVizData(this.aVizDataMock.empty, this.oApplicationsMock);
        // Assert
        assert.deepEqual(sResult, undefined, "Returned the correct result");
        assert.strictEqual(this.oGetInboundTargetStub.callCount, 0, "getInboundTarget was not called");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 0, "toHashFromTarget was not called");
    });

    QUnit.test("Returns the correct result if target is a url", function (assert) {
        // Arrange
        var sExpectedResult = "someUrl";
        // Act
        var sResult = oUtilsCdm.toHashFromVizData(this.aVizDataMock.url, this.oApplicationsMock);
        // Assert
        assert.deepEqual(sResult, sExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oGetInboundTargetStub.callCount, 0, "getInboundTarget was not called");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 0, "toHashFromTarget was not called");
    });

    QUnit.test("Returns the correct result if target is an existing appId and inboundId", function (assert) {
        // Arrange
        var sExpectedResult = "#Action-toSample?some=parameter&sap-ui-app-id-hint=someAppId&/test";
        // Act
        var sResult = oUtilsCdm.toHashFromVizData(this.aVizDataMock.appId, this.oApplicationsMock);
        // Assert
        assert.deepEqual(sResult, sExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oGetInboundTargetStub.callCount, 1, "getInboundTarget was called once");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 1, "toHashFromTarget was called once");
    });

    QUnit.test("Returns the correct result if target is an existing appId and inboundId but the target does not contain any parameters", function (assert) {
        // Arrange
        var sExpectedResult = "#Action-toSample?sap-ui-app-id-hint=someAppId&";
        // Act
        var sResult = oUtilsCdm.toHashFromVizData(this.aVizDataMock.appIdWithoutParameters, this.oApplicationsMock);
        // Assert
        assert.deepEqual(sResult, sExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oGetInboundTargetStub.callCount, 1, "getInboundTarget was called once");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 1, "toHashFromTarget was called once");
    });

    QUnit.test("Returns the correct result if target is a not existing appId and inboundId", function (assert) {
        // Arrange
        this.oGetInboundTargetStub.withArgs(this.oApplicationsMock, "someAppId", "someInboundId").returns();
        // Act
        var sResult = oUtilsCdm.toHashFromVizData(this.aVizDataMock.appId, this.oApplicationsMock);
        // Assert
        assert.deepEqual(sResult, undefined, "Returned the correct result");
        assert.strictEqual(this.oGetInboundTargetStub.callCount, 1, "getInboundTarget was called once");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 1, "toHashFromTarget was called once");
    });

    QUnit.test("Returns the correct result if target is semanticObject and action", function (assert) {
        // Arrange
        var sExpectedResult = "#Action-toSample?another=parameter&/anotherTest";
        // Act
        var sResult = oUtilsCdm.toHashFromVizData(this.aVizDataMock.semanticObject, this.oApplicationsMock);
        // Assert
        assert.deepEqual(sResult, sExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oGetInboundTargetStub.callCount, 0, "getInboundTarget was not called");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 1, "toHashFromTarget was called once");
    });

    QUnit.test("Returns the correct result if target is none of the above", function (assert) {
        // Arrange
        // Act
        var sResult = oUtilsCdm.toHashFromVizData(this.aVizDataMock.emptyTarget, this.oApplicationsMock);
        // Assert
        assert.deepEqual(sResult, undefined, "Returned the correct result");
        assert.strictEqual(this.oGetInboundTargetStub.callCount, 0, "getInboundTarget was not called");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 1, "toHashFromTarget was called once");
    });

    QUnit.module("toHashFromTargetIntent ", {
        beforeEach: function () {

            this.oToHashFromTargetStub = sandbox.stub(oUtilsCdm, "toHashFromTarget");
            this.oToHashFromTargetStub.callsFake(function (oTarget) {
                try {
                    var sHash = "#" + oTarget.semanticObject + "-" + oTarget.action + "?";
                    Object.keys(oTarget.parameters).forEach(function (sKey) {
                        var oParameter = oTarget.parameters[sKey];
                        sHash += sKey + "=" + oParameter.value.value + "&";
                    });
                    sHash += oTarget.appSpecificRoute;
                    return sHash;
                } catch (oErr) {
                    return undefined;
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result with no target parameters", function (assert) {
        // Arrange
        var sExpectedResult = "#Sample-display?sap-ui-app-id-hint=1233&/anotherTest";

        var oTargetIntentMock = {
            semanticObject: "Sample",
            action: "display",
            businessAppId: "1233"
        };
        var oTargetMock = {
            appId: "1233",
            inboundId: "1233___GenericDefaultSemantic-__GenericDefaultAction",
            parameters: {},
            type: "IBN",
            appSpecificRoute: "/anotherTest"
        };
        var oExpectedTarget = {
            semanticObject: "Sample",
            action: "display",
            parameters: {
                "sap-ui-app-id-hint": {
                    value: {
                        format: "plain",
                        value: "1233"
                    }
                }
            },
            appSpecificRoute: "/anotherTest"
        };

        // Act
        var sResult = oUtilsCdm.toHashFromTargetIntent(oTargetIntentMock, oTargetMock);

        // Assert
        assert.strictEqual(sResult, sExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 1, "toHashFromTarget was called once");
        assert.deepEqual(this.oToHashFromTargetStub.getCall(0).args, [oExpectedTarget], "toHashFromTarget was called with correct parameters");
    });

    QUnit.test("Returns the correct result with target parameters", function (assert) {
        // Arrange
        var sExpectedResult = "#Sample-display?param1=value1&param2=value2,value3&sap-ui-app-id-hint=1233&";

        var oExpectedTargetwithParam = {
            semanticObject: "Sample",
            action: "display",
            parameters: {
                param1: {
                    value: {
                        value: "value1",
                        format: "plain"
                    }
                },
                param2: {
                    value: {
                        value: ["value2", "value3"],
                        format: "plain"
                    }
                },
                "sap-ui-app-id-hint": {
                    value: {
                        format: "plain",
                        value: "1233"
                    }
                }
            },
            appSpecificRoute: ""
        };
        var oTargetIntentMock = {
            semanticObject: "Sample",
            action: "display",
            businessAppId: "1233"
        };
        var oTargetMockwithParam = {
            appId: "1233",
            inboundId: "1233___GenericDefaultSemantic-__GenericDefaultAction",
            parameters: {
                param1: {
                    value: {
                        value: "value1",
                        format: "plain"
                    }
                },
                param2: {
                    value: {
                        value: ["value2", "value3"],
                        format: "plain"
                    }
                }
            },
            type: "IBN"
        };
        // Act
        var sResult = oUtilsCdm.toHashFromTargetIntent(oTargetIntentMock, oTargetMockwithParam);

        // Assert
        assert.strictEqual(sResult, sExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oToHashFromTargetStub.callCount, 1, "toHashFromTarget was called once");
        assert.deepEqual(this.oToHashFromTargetStub.getCall(0).args, [oExpectedTargetwithParam], "toHashFromTarget was called with correct parameters");
    });

    QUnit.test("Returns the undefined if an error occurs", function (assert) {
        // Arrange
        var sExpectedResult;
        // Act
        var sResult = oUtilsCdm.toHashFromTargetIntent(undefined);
        // Assert
        assert.strictEqual(sResult, sExpectedResult, "Returned the correct result");
    });

    QUnit.test("Returns the URL when target type is url ", function (assert) {
        // Arrange
        var sExpectedResult = "www.google.com";
        this.oTargetIntentMock = {
            semanticObject: "Sample",
            action: "display",
            businessAppId: "1233"
        };
        this.oTargetMock = {
            appId: "1233",
            inboundId: "1233___GenericDefaultSemantic-__GenericDefaultAction",
            parameters: {},
            type: "URL",
            url: "www.google.com"
        };
        // Act
        var sResult = oUtilsCdm.toHashFromTargetIntent(this.oTargetIntentMock, this.oTargetMock);
        // Assert
        assert.strictEqual(sResult, sExpectedResult, "Returned the correct result");
    });

    QUnit.module("toHashFromTarget", {
        beforeEach: function () {
            this.sIntent = "someIntent";
            this.oTargetMockWithParameters = {
                semanticObject: "Action",
                action: "toSample",
                parameters: {
                    param1: {
                        value: {
                            value: "value1",
                            format: "plain"
                        }
                    },
                    param2: {
                        value: {
                            value: ["value2", "value3"],
                            format: "plain"
                        }
                    }
                },
                appSpecificRoute: "/test"
            };
            this.oExpectedTarget = {
                target: {
                    semanticObject: "Action",
                    action: "toSample"
                },
                params: {
                    param1: ["value1"],
                    param2: ["value2", "value3"]
                },
                appSpecificRoute: "/test"
            };

            this.oConstructShellHashStub = sandbox.stub(urlParsing, "constructShellHash");
            this.oConstructShellHashStub.withArgs(this.oExpectedTarget).returns(this.sIntent);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result with target parameters", function (assert) {
        // Arrange
        var sExpectedResult = "#someIntent";
        // Act
        var sResult = oUtilsCdm.toHashFromTarget(this.oTargetMockWithParameters);
        // Assert
        assert.strictEqual(sResult, sExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oConstructShellHashStub.callCount, 1, "constructShellHash was called once");
        assert.deepEqual(this.oConstructShellHashStub.getCall(0).args, [this.oExpectedTarget], "constructShellHash was called with correct parameters");
    });

    QUnit.test("Returns the undefined if an error occurs", function (assert) {
        // Arrange
        var sExpectedResult;
        // Act
        var sResult = oUtilsCdm.toHashFromTarget(undefined);
        // Assert
        assert.strictEqual(sResult, sExpectedResult, "Returned the correct result");
    });

    QUnit.module(".toTargetFromHash(...)", {
        beforeEach: function () {
            this.oParseShellHashStub = sandbox.stub(urlParsing, "parseShellHash");
            // Case 1: Hash
            this.sIntentHash = "#SemOb-toSample?A=B&/someInnerAppState";
            this.oParseShellHashStub.withArgs(this.sIntentHash).returns({
                semanticObject: "SemOb",
                action: "toSample",
                params: {
                    paramA: ["valueB", "valueC"]
                },
                appSpecificRoute: "/someInnerAppState"
            });
            // Case 2: URL
            this.sUrlHash = "https://www.example.com/flp#SemOb-myAction";
            this.oParseShellHashStub.withArgs(this.sUrlHash).returns(undefined);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns an object with split info as result when the given hash is an intent", function (assert) {
        // Arrange
        var oExpectedResult = {
            semanticObject: "SemOb",
            action: "toSample",
            parameters: [
                { name: "paramA", value: "valueB" },
                { name: "paramA", value: "valueC" }
            ],
            appSpecificRoute: "/someInnerAppState"
        };
        // Act
        var oResult = oUtilsCdm.toTargetFromHash(this.sIntentHash);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oParseShellHashStub.callCount, 1, "parseShellHash was called once");
    });

    QUnit.test("Returns an object with type URL when the hash is a full url host", function (assert) {
        // Arrange
        var oExpectedResult = {
            type: "URL",
            url: this.sUrlHash
        };
        // Act
        var oResult = oUtilsCdm.toTargetFromHash(this.sUrlHash);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oParseShellHashStub.callCount, 1, "parseShellHash was called once");
    });

    QUnit.module("The function isSameTarget", {
        beforeEach: function () {
            this.oTargetA = {
                semanticObject: "Action",
                action: "toBookmark",
                parameters: {
                    a: {
                        value: {
                            value: "b",
                            format: "plain"
                        }
                    },
                    "abc?": {
                        value: {
                            value: "xyz?",
                            format: "plain"
                        }
                    }
                },
                appSpecificRoute: "&/View1/"
            };
            this.oTargetB = JSON.parse(JSON.stringify(this.oTargetA));

            this.oUrlTargetA = {
                type: "URL",
                url: "http://www.sap.com"
            };
            this.oUrlTargetB = JSON.parse(JSON.stringify(this.oUrlTargetA));
        },
        afterEach: function () {
        }
    });

    QUnit.test("Returns true if the targets are equal.", function (assert) {
        //Arrange

        //Act
        var bResult = oUtilsCdm.isSameTarget(this.oTargetA, this.oTargetB);

        //Assert
        assert.strictEqual(bResult, true, "The targets are evaluated as equal.");
    });

    QUnit.test("Returns false if the semantic objects are different.", function (assert) {
        //Arrange
        this.oTargetB.semanticObject = "Cut";

        //Act
        var bResult = oUtilsCdm.isSameTarget(this.oTargetA, this.oTargetB);

        //Assert
        assert.strictEqual(bResult, false, "The targets are evaluated as unequal.");
    });

    QUnit.test("Returns false if the actions are different.", function (assert) {
        //Arrange
        this.oTargetB.action = "toappnavsample";

        //Act
        var bResult = oUtilsCdm.isSameTarget(this.oTargetA, this.oTargetB);

        //Assert
        assert.strictEqual(bResult, false, "The targets are evaluated as unequal.");
    });

    QUnit.test("Returns false if the inner app routes are different.", function (assert) {
        //Arrange
        this.oTargetB.appSpecificRoute = "&/View2/";

        //Act
        var bResult = oUtilsCdm.isSameTarget(this.oTargetA, this.oTargetB);

        //Assert
        assert.strictEqual(bResult, false, "The targets are evaluated as unequal.");
    });

    QUnit.test("Returns false if the parameters are different.", function (assert) {
        //Arrange
        this.oTargetB.parameters = {
            a: {
                value: { value: "c", format: "plain" }
            },
            "abcd?": {
                value: { value: "xyz?", format: "plain" }
            }
        };

        //Act
        var bResult = oUtilsCdm.isSameTarget(this.oTargetA, this.oTargetB);

        //Assert
        assert.strictEqual(bResult, false, "The targets are evaluated as unequal.");
    });

    QUnit.test("Returns true for equal URL targets.", function (assert) {
        //Arrange

        //Act
        var bResult = oUtilsCdm.isSameTarget(this.oUrlTargetA, this.oUrlTargetB);

        //Assert
        assert.strictEqual(bResult, true, "The targets are evaluated as equal.");
    });

    QUnit.test("Returns false for unequal URL targets.", function (assert) {
        //Arrange
        this.oUrlTargetB.url = "http://www.sap.com/FLP";

        //Act
        var bResult = oUtilsCdm.isSameTarget(this.oUrlTargetA, this.oUrlTargetB);

        //Assert
        assert.strictEqual(bResult, false, "The targets are evaluated as unequal.");
    });

    QUnit.test("Returns false for different target types", function (assert) {
        //Arrange

        //Act
        var bResult = oUtilsCdm.isSameTarget(this.oUrlTargetA, this.oTargetA);

        //Assert
        assert.strictEqual(bResult, false, "The targets are evaluated as unequal.");
    });
});

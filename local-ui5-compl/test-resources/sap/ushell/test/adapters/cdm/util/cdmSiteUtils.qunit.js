// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for the module "cdmSiteUtils" in "sap.ushell.adapters.cdm.util.cdmSiteUtils"
 * "
 */

/* global QUnit, sinon */
sap.ui.define([
    "sap/ushell/adapters/cdm/util/cdmSiteUtils",
    "sap/ushell/adapters/cdm/util/AppForInbound",
    "sap/ushell/adapters/cdm/v3/utilsCdm"
], function (cdmSiteUtils, AppForInbound, utilsCdm) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function getVisualizations", {
        beforeEach: function () {
            this.oToTargetFromHashStub = sandbox.stub(utilsCdm, "toTargetFromHash");
            this.oToTargetFromHashStub.withArgs("#Action-toSample?A=B&/someInnerAppState").returns({
                semanticObject: "Action",
                action: "toSample",
                parameters: [
                    {
                        name: "A",
                        value: "B"
                    }
                ],
                appSpecificRoute: "/someInnerAppState"
            });
            this.oToTargetFromHashStub.withArgs("url-1").returns({
                type: "URL",
                url: "url-1"
            });
            this.oToTargetFromHashStub.withArgs(undefined).returns({
                type: "URL",
                url: undefined
            });
            this.oToTargetFromHashStub.withArgs("url-3").returns({
                type: "URL",
                url: "url-3"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Gets the visualizations from the visualization data handed over as parameter", function (assert) {
        // Arrange
        var oVisualizationData = {
            "viz-1": {
                subTitle: "subTitle-1",
                vizType: "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER",
                icon: "icon-1",
                info: "info-1",
                keywords: ["keyword-1"],
                numberUnit: "EUR-1",
                title: "title-1",
                size: "size-1",
                indicatorDataSource: {
                    path: "path-1",
                    refresh: 200
                },
                url: "#Action-toSample?A=B&/someInnerAppState",
                isCustomTile: false,
                _instantiationData: {
                    platform: "ABAP",
                    simplifiedChipFormat: true,
                    chip: {}
                }
            },
            "viz-2": {
                subTitle: "subTitle-2",
                vizType: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                icon: "icon-2",
                info: "info-2",
                keywords: ["keyword-2"],
                numberUnit: "EUR-2",
                title: "title-2",
                size: "size-2",
                isCustomTile: false,
                _instantiationData: {
                    platform: "ABAP",
                    simplifiedChipFormat: true,
                    chip: {}
                }
            },
            "viz-3": {
                subTitle: "subTitle-3",
                vizType: "X-SAP-UI2-CHIP:/UI2/CUSTOM_APPLAUNCHER",
                icon: "icon-3",
                info: "info-3",
                keywords: [],
                numberUnit: "EUR-3",
                title: "title-3",
                size: "size-3",
                indicatorDataSource: {
                    path: "path-3",
                    refresh: 200
                },
                isCustomTile: true,
                _instantiationData: {
                    platform: "ABAP",
                    simplifiedChipFormat: true,
                    chip: {}
                },
                url: "url-3"
            }
        };

        var oVisualizationsExpected = {
            "viz-1": {
                vizType: "sap.ushell.DynamicAppLauncher",
                vizConfig: {
                    "sap.app": {
                        info: "info-1",
                        subTitle: "subTitle-1",
                        title: "title-1",
                        tags: {
                            keywords: ["keyword-1"]
                        }
                    },
                    "sap.flp": {
                        indicatorDataSource: {
                            path: "path-1",
                            refresh: 200
                        },
                        target: {
                            semanticObject: "Action",
                            action: "toSample",
                            parameters: [
                                {
                                    name: "A",
                                    value: "B"
                                }
                            ],
                            appSpecificRoute: "/someInnerAppState"
                        },
                        tileSize: "size-1",
                        numberUnit: "EUR-1"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-1"
                        }
                    }
                }
            },
            "viz-2": {
                vizType: "sap.ushell.StaticAppLauncher",
                vizConfig: {
                    "sap.app": {
                        info: "info-2",
                        subTitle: "subTitle-2",
                        title: "title-2",
                        tags: {
                            keywords: ["keyword-2"]
                        }
                    },
                    "sap.flp": {
                        indicatorDataSource: undefined,
                        target: {
                            type: "URL",
                            url: undefined
                        },
                        tileSize: "size-2",
                        numberUnit: "EUR-2"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-2"
                        }
                    }
                }
            },
            "viz-3": {
                vizType: "X-SAP-UI2-CHIP:/UI2/CUSTOM_APPLAUNCHER",
                vizConfig: {
                    "sap.app": {
                        info: "info-3",
                        subTitle: "subTitle-3",
                        title: "title-3",
                        tags: {
                            keywords: []
                        }
                    },
                    "sap.flp": {
                        _instantiationData: {
                            chip: {},
                            platform: "ABAP",
                            simplifiedChipFormat: true
                        },
                        indicatorDataSource: {
                            path: "path-3",
                            refresh: 200
                        },
                        target: {
                            type: "URL",
                            url: "url-3"
                        },
                        tileSize: "size-3",
                        numberUnit: "EUR-3"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-3"
                        }
                    }
                }
            }
        };

        // Act
        var oVisualizations = cdmSiteUtils.getVisualizations(oVisualizationData);

        // Assert
        assert.deepEqual(oVisualizations, oVisualizationsExpected, "Correct visualizations were returned");
        assert.strictEqual(this.oToTargetFromHashStub.callCount, 3, "toTargetFromHash was called three times");
    });

    QUnit.module("The function getApplications", {
        beforeEach: function () {
            this.oGetAppStub = sandbox.stub(AppForInbound, "get").returns({});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Gets the applications from the navigation data handed over as parameter", function (assert) {
        // Arrange
        var oNavigationData = {
            "permanent-key-1": {
                permanentKey: "permanent-key-1"
            },
            "inbound-id-2": {
                id: "inbound-id-2"
            },
            "permanent-key-3": {
                permanentKey: "permanent-key-3"
            }
        };
        var oExpectedApplications = {
            "permanent-key-1": {},
            "inbound-id-2": {},
            "permanent-key-3": {}
        };

        // Act
        var oApplications = cdmSiteUtils.getApplications(oNavigationData);

        // Assert
        assert.deepEqual(oApplications, oExpectedApplications, "Correct applications are returned");
        assert.strictEqual(this.oGetAppStub.getCall(0).args[0], "permanent-key-1", "The inbound id is used to .get the application.");
        assert.strictEqual(this.oGetAppStub.getCall(0).args[1], oNavigationData["permanent-key-1"], "The inbound id is used as well.");
    });

    QUnit.module("The function getVizTypes");

    QUnit.test("Returns correct vizTypes", function (assert) {
        // Arrange
        var oVizTypesData = {
            vizType1: {
                id: "vizType1",
                url: "https://sap.com/1",
                vizOptions: {
                    displayFormats: {
                        supported: ["standard", "flat"],
                        default: "standard"
                    }
                },
                tileSize: "2x2"
            },

            vizType2: {
                id: "vizType2",
                url: "https://sap.com/2",
                vizOptions: {
                    displayFormats: {
                        supported: ["standard", "flat", "compact"],
                        default: "compact"
                    }
                },
                tileSize: "1x1"
            }
        };

        var oExpectedVizTypes = {
            vizType1: {
                "sap.app": {
                    id: "vizType1",
                    type: "chipVizType"
                },
                "sap.flp": {
                    vizOptions: {
                        displayFormats: {
                            supported: ["standard", "flat"],
                            default: "standard"
                        }
                    },
                    tileSize: "2x2"
                }
            },
            vizType2: {
                "sap.app": {
                    id: "vizType2",
                    type: "chipVizType"
                },
                "sap.flp": {
                    vizOptions: {
                        displayFormats: {
                            supported: ["standard", "flat", "compact"],
                            default: "compact"
                        }
                    },
                    tileSize: "1x1"
                }
            }
        };

        // Act
        var oVizTypes = cdmSiteUtils.getVizTypes(oVizTypesData);

        // Assert
        assert.deepEqual(oVizTypes, oExpectedVizTypes, "The function returns the correct vizTypes");
    });
});

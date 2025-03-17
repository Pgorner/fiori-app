// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.v3._LaunchPage.readVisualizations
 */
sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/utils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/library"
], function (
    deepClone,
    readVisualizations,
    utils,
    readUtils,
    ushellLibrary
) {
    "use strict";

    /* global QUnit, sinon */

    var DisplayFormat = ushellLibrary.DisplayFormat;

    QUnit.module("getInboundId method", {
        beforeEach: function () {
            this.oGetTargetStub = sinon.stub(readVisualizations, "getTarget");
            this.sMockViz = "sMockViz";
        },
        afterEach: function () {
            this.oGetTargetStub.restore();
        }
    });

    QUnit.test("getTarget returns a string", function (assert) {
        //Arrange
        this.oGetTargetStub.withArgs(this.sMockViz).returns({ inboundId: "inboundId" });
        //Act
        var sResult = readVisualizations.getInboundId(this.sMockViz);
        //Assert
        assert.strictEqual(this.oGetTargetStub.callCount, 1, "getTarget was called once");
        assert.strictEqual(sResult, "inboundId", "returns the correct result");
    });

    QUnit.test("getTarget returns undefined if a non-existent inbound ID is passed", function (assert) {
        //Arrange
        this.oGetTargetStub.withArgs(this.sMockViz).returns({ inboundId2: "inboundId" });
        //Act
        var sResult = readVisualizations.getInboundId(this.sMockViz);
        //Assert
        assert.strictEqual(this.oGetTargetStub.callCount, 1, "getTarget was called once");
        assert.strictEqual(sResult, undefined, "returns the correct result");
    });

    QUnit.test("getTarget returns undefined", function (assert) {
        //Arrange
        this.oGetTargetStub.withArgs(this.sMockViz).returns();
        //Act
        var sResult = readVisualizations.getInboundId(this.sMockViz);
        //Assert
        assert.strictEqual(this.oGetTargetStub.callCount, 1, "getTarget was called once");
        assert.strictEqual(sResult, undefined, "returns the correct result");
    });

    QUnit.module("getKeywords method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["sap|app.tags.keywords", "sap|app.tags.keywords"];

            this.oGetNestedObjectPropertyStub.withArgs(["obj2", "obj4"], this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct keywords", function (assert) {
        //Arrange
        const oClone = deepClone(this.aCdmParts, 20);
        //Act
        var sResult = readVisualizations.getKeywords(this.aCdmParts);
        //Assert
        assert.deepEqual(this.aCdmParts, oClone, "input was not altered");
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getTitle method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["title", "sap|app.title", "title", "sap|app.title"];

            this.oGetNestedObjectPropertyStub.withArgs(this.aCdmParts, this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct title", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getTitle(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getSubTitle method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["subTitle", "sap|app.subTitle", "subTitle", "sap|app.subTitle"];

            this.oGetNestedObjectPropertyStub.withArgs(this.aCdmParts, this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct subTitle", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getSubTitle(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getIcon method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["icon", "sap|ui.icons.icon", "icon", "sap|ui.icons.icon"];

            this.oGetNestedObjectPropertyStub.withArgs(this.aCdmParts, this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct icon", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getIcon(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getInfo method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["info", "sap|app.info", "info", "sap|app.info"];

            this.oGetNestedObjectPropertyStub.withArgs(this.aCdmParts, this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct info", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getInfo(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("The function getNumberUnit", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");

            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["numberUnit", "sap|flp.numberUnit"];

            this.oGetNestedObjectPropertyStub.withArgs(["obj1", "obj2"], this.aParams).returns("EUR");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct numberUnit", function (assert) {
        // Act
        var sResult = readVisualizations.getNumberUnit(this.aCdmParts);

        // Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once.");
        assert.strictEqual(sResult, "EUR", "returns the correct value.");
    });

    QUnit.module("getShortTitle method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["sap|app.shortTitle", "shortTitle", "sap|app.shortTitle"];

            this.oGetNestedObjectPropertyStub.withArgs(["obj2", "obj3", "obj4"], this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct shortTitle", function (assert) {
        //Arrange
        const oClone = deepClone(this.aCdmParts, 20);
        //Act
        var sResult = readVisualizations.getShortTitle(this.aCdmParts);
        //Assert
        assert.deepEqual(this.aCdmParts, oClone, "input was not altered");
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getInstantiationData method");

    QUnit.test("Returns the correct instantiation data", function (assert) {
        //Arrange
        var oVisualization = {
            vizConfig: {
                "sap.flp": {
                    _instantiationData: {
                        instantiation: "data"
                    }
                }
            }
        };
        var oExpectedResult = {
            instantiation: "data"
        };

        //Act
        var oInstantiationData = readVisualizations.getInstantiationData(oVisualization);

        //Assert
        assert.deepEqual(oInstantiationData, oExpectedResult, "the instantiation data was read correctly");
    });

    QUnit.test("Returns undefined if there is no instantiation data", function (assert) {
        //Arrange
        var oVisualization = {};

        //Act
        var oInstantiationData = readVisualizations.getInstantiationData(oVisualization);

        //Assert
        assert.deepEqual(oInstantiationData, undefined, "the instantiation data reading didn't break");
    });

    QUnit.module("getIndicatorDataSource ");

    QUnit.test("Returns the correct indicatorDataSource", function (assert) {
        //Arrange
        var oVisualization = {
            vizConfig: {
                "sap.flp": {
                    indicatorDataSource: {
                        indicator: "DataSource"
                    }
                }
            }
        };
        var oExpectedResult = {
            indicator: "DataSource"
        };

        //Act
        var oResult = readVisualizations.getIndicatorDataSource(oVisualization);

        //Assert
        assert.deepEqual(oResult, oExpectedResult, "the indicatorDataSource was read correctly");
    });

    QUnit.test("Returns undefined if there is no indicatorDataSource", function (assert) {
        //Arrange
        var oVisualization = {};

        //Act
        var oResult = readVisualizations.getIndicatorDataSource(oVisualization);

        //Assert
        assert.deepEqual(oResult, undefined, "the indicatorDataSource reading didn't break");
    });

    QUnit.module("isStandardVizType method");

    QUnit.test("Returns true for the static tile", function (assert) {
        //Arrange
        var sVizType = "sap.ushell.StaticAppLauncher";

        //Act
        var bIsStandardVizType = readVisualizations.isStandardVizType(sVizType);

        //Assert
        assert.strictEqual(bIsStandardVizType, true, "The static tile was recognized as standard viz type");
    });

    QUnit.test("Returns true for the dynamic tile", function (assert) {
        //Arrange
        var sVizType = "sap.ushell.DynamicAppLauncher";

        //Act
        var bIsStandardVizType = readVisualizations.isStandardVizType(sVizType);

        //Assert
        assert.strictEqual(bIsStandardVizType, true, "The dynamic tile was recognized as standard viz type");
    });

    QUnit.test("Returns false for custom vizTypes", function (assert) {
        //Arrange
        var sVizType = "custom.Newstile";

        //Act
        var bIsStandardVizType = readVisualizations.isStandardVizType(sVizType);

        //Assert
        assert.strictEqual(bIsStandardVizType, false, "The custom tile was not recognized as standard viz type");
    });

    QUnit.module("getSupportedDisplayFormats");

    QUnit.test("Returns the supported displayFormats of the vizType", function (assert) {
        //Arrange
        var oVizType = {
            "sap.flp": {
                vizOptions: {
                    displayFormats: {
                        supported: [DisplayFormat.Standard]
                    }
                }
            }
        };
        var aExpectedResult = [DisplayFormat.Standard];

        //Act
        var aSupportedDisplayFormats = readVisualizations.getSupportedDisplayFormats(oVizType);

        //Assert
        assert.deepEqual(aSupportedDisplayFormats, aExpectedResult, "Returned correct displayFormats");
    });

    QUnit.test("Returns undefined when the vizType has no supported displayFormats", function (assert) {
        //Arrange
        var oVizType = {};

        //Act
        var aSupportedDisplayFormats = readVisualizations.getSupportedDisplayFormats(oVizType);

        //Assert
        assert.strictEqual(aSupportedDisplayFormats, undefined, "Returned undefined");
    });

    QUnit.test("Returns undefined when the vizType is undefined", function (assert) {
        //Arrange
        //Act
        var aSupportedDisplayFormats = readVisualizations.getSupportedDisplayFormats();

        //Assert
        assert.strictEqual(aSupportedDisplayFormats, undefined, "Returned undefined");
    });

    QUnit.module("getDefaultDisplayFormat");

    QUnit.test("Returns the default displayFormat of the vizType", function (assert) {
        //Arrange
        var oVizType = {
            "sap.flp": {
                vizOptions: {
                    displayFormats: {
                        default: DisplayFormat.Standard
                    }
                }
            }
        };

        //Act
        var sDefaultDisplayFormats = readVisualizations.getDefaultDisplayFormat(oVizType);

        //Assert
        assert.deepEqual(sDefaultDisplayFormats, DisplayFormat.Standard, "Returned correct displayFormat");
    });

    QUnit.test("Returns undefined when the vizType has no default displayFormat", function (assert) {
        //Arrange
        var oVizType = {};

        //Act
        var sDefaultDisplayFormats = readVisualizations.getDefaultDisplayFormat(oVizType);

        //Assert
        assert.strictEqual(sDefaultDisplayFormats, undefined, "Returned undefined");
    });

    QUnit.test("Returns undefined when the vizType is undefined", function (assert) {
        //Arrange
        //Act
        var sDefaultDisplayFormats = readVisualizations.getDefaultDisplayFormat();

        //Assert
        assert.strictEqual(sDefaultDisplayFormats, undefined, "Returned undefined");
    });

    QUnit.module("getTileSize");

    QUnit.test("Returns the tileSize of the vizType", function (assert) {
        //Arrange
        var oVizType = {
            "sap.flp": {
                tileSize: "1x2"
            }
        };

        //Act
        var sTileSize = readVisualizations.getTileSize(oVizType);

        //Assert
        assert.deepEqual(sTileSize, "1x2", "Returned correct tileSize");
    });

    QUnit.test("Returns undefined when the vizType has no tileSize", function (assert) {
        //Arrange
        var oVizType = {};

        //Act
        var sTileSize = readVisualizations.getTileSize(oVizType);

        //Assert
        assert.strictEqual(sTileSize, undefined, "Returned undefined");
    });

    QUnit.test("Returns undefined when the vizType is undefined", function (assert) {
        //Arrange
        //Act
        var sTileSize = readVisualizations.getTileSize();

        //Assert
        assert.strictEqual(sTileSize, undefined, "Returned undefined");
    });

    QUnit.module("getDataSource method", {
        beforeEach: function () {
            this.aCdmParts = [{}, {}, {}, {}];

            this.oDataSources = {
                dataSource001: {
                    uri: "/test/path1"
                },
                dataSource002: {
                    uri: "/test/path2"
                }
            };

            this.aReducedCdmParts = [{}, {}];
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.oGetNestedObjectPropertyStub.withArgs(this.aReducedCdmParts, ["sap|app.dataSources", "sap|app.dataSources"]).returns(this.oDataSources);
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct data source", function (assert) {
        //Arrange
        var oExpectedDataSource = {
            uri: "/test/path1"
        };

        //Act
        var oDataSource = readVisualizations.getDataSource(this.aCdmParts, "dataSource001");

        //Assert
        assert.deepEqual(oDataSource, oExpectedDataSource, "The correct data source was returned.");
    });

    QUnit.test("Returns undefined if the data source ID was not supplied", function (assert) {
        //Arrange

        //Act
        var oDataSource = readVisualizations.getDataSource(this.aCdmParts);

        //Assert
        assert.strictEqual(oDataSource, undefined, "undefined was returned.");
    });

    QUnit.test("Returns undefined if no data source was not found", function (assert) {
        //Arrange
        this.oGetNestedObjectPropertyStub.withArgs(this.aReducedCdmParts, ["sap|app.dataSources", "sap|app.dataSources"]).returns(undefined);

        //Act
        var oDataSource = readVisualizations.getDataSource(this.aCdmParts);

        //Assert
        assert.strictEqual(oDataSource, undefined, "undefined was returned.");
    });

    QUnit.module("component and integration tests", {
        beforeEach: function () {
            this.oTile = {
                icon: "tileIcon",
                info: "tileInfo",
                subTitle: "tileSubtitle",
                title: "tileTitle",
                vizId: "vizId1"
            };
            this.oSite = {
                applications: {
                    appId1: {
                        "sap.app": {
                            info: "applicationInfo",
                            crossNavigation: {
                                inbounds: {
                                    inboundId1: {
                                        icon: "inboundIcon",
                                        info: "inboundInfo",
                                        shortTitle: "inboundShortTitle",
                                        subTitle: "inboundSubtitle",
                                        title: "inboundTitle"
                                    }
                                }
                            },
                            shortTitle: "applicationShortTitle",
                            subTitle: "applicationSubtitle",
                            tags: { keywords: "applicationKeywords" },
                            title: "applicationTitle"
                        },
                        "sap.ui": {
                            icons: { icon: "applicationIcon" }
                        }
                    }
                },
                visualizations: {
                    vizId1: {
                        vizConfig: {
                            "sap.app": {
                                info: "visualizationInfo",
                                shortTitle: "visualizationShortTitle",
                                subTitle: "visualizationSubtitle",
                                tags: { keywords: "visualizationKeywords" },
                                title: "visualizationTitle"
                            },
                            "sap.flp": {
                                target: {
                                    appId: "appId1",
                                    inboundId: "inboundId1"
                                },
                                _instantiationData: {
                                    instantiation: "data"
                                }
                            },
                            "sap.ui": {
                                icons: { icon: "visualizationIcon" }
                            }
                        },
                        vizType: "vizType1"
                    }
                }
            };
        }
    });

    QUnit.test("get evaluated properties from groupTile", function (assert) {
        //Arrange
        var oExpectedResult = {
            keywords: "visualizationKeywords",
            title: "tileTitle",
            subTitle: "tileSubtitle",
            icon: "tileIcon",
            info: "tileInfo",
            shortTitle: "visualizationShortTitle"
        };
        //Act
        var aCdmParts = readUtils.getCdmParts(this.oSite, this.oTile);
        var oResult = {
            keywords: readVisualizations.getKeywords(aCdmParts),
            title: readVisualizations.getTitle(aCdmParts),
            subTitle: readVisualizations.getSubTitle(aCdmParts),
            icon: readVisualizations.getIcon(aCdmParts),
            info: readVisualizations.getInfo(aCdmParts),
            shortTitle: readVisualizations.getShortTitle(aCdmParts)
        };
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returns correct result");
    });

    QUnit.test("get evaluated properties from visualization", function (assert) {
        //Arrange
        var oExpectedResult = {
            keywords: "visualizationKeywords",
            title: "visualizationTitle",
            subTitle: "visualizationSubtitle",
            icon: "visualizationIcon",
            info: "visualizationInfo",
            shortTitle: "visualizationShortTitle"
        };
        this.oTile = { vizId: this.oTile.vizId };
        //Act
        var aCdmParts = readUtils.getCdmParts(this.oSite, this.oTile);
        var oResult = {
            keywords: readVisualizations.getKeywords(aCdmParts),
            title: readVisualizations.getTitle(aCdmParts),
            subTitle: readVisualizations.getSubTitle(aCdmParts),
            icon: readVisualizations.getIcon(aCdmParts),
            info: readVisualizations.getInfo(aCdmParts),
            shortTitle: readVisualizations.getShortTitle(aCdmParts)
        };
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returns correct result");
    });

    QUnit.test("get evaluated properties from applicationInbound", function (assert) {
        //Arrange
        var oExpectedResult = {
            keywords: "applicationKeywords",
            title: "inboundTitle",
            subTitle: "inboundSubtitle",
            icon: "inboundIcon",
            info: "inboundInfo",
            shortTitle: "inboundShortTitle"
        };
        this.oTile = { vizId: this.oTile.vizId };
        delete this.oSite.visualizations.vizId1.vizConfig["sap.app"];
        delete this.oSite.visualizations.vizId1.vizConfig["sap.ui"];
        //Act
        var aCdmParts = readUtils.getCdmParts(this.oSite, this.oTile);
        var oResult = {
            keywords: readVisualizations.getKeywords(aCdmParts),
            title: readVisualizations.getTitle(aCdmParts),
            subTitle: readVisualizations.getSubTitle(aCdmParts),
            icon: readVisualizations.getIcon(aCdmParts),
            info: readVisualizations.getInfo(aCdmParts),
            shortTitle: readVisualizations.getShortTitle(aCdmParts)
        };
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returns correct result");
    });

    QUnit.test("get evaluated properties from application", function (assert) {
        //Arrange
        var oExpectedResult = {
            keywords: "applicationKeywords",
            title: "applicationTitle",
            subTitle: "applicationSubtitle",
            icon: "applicationIcon",
            info: "applicationInfo",
            shortTitle: "applicationShortTitle"
        };
        this.oTile = { vizId: this.oTile.vizId };
        delete this.oSite.visualizations.vizId1.vizConfig["sap.app"];
        delete this.oSite.visualizations.vizId1.vizConfig["sap.ui"];
        delete this.oSite.applications.appId1["sap.app"].crossNavigation.inbounds.inboundId1;
        //Act
        var aCdmParts = readUtils.getCdmParts(this.oSite, this.oTile);
        var oResult = {
            keywords: readVisualizations.getKeywords(aCdmParts),
            title: readVisualizations.getTitle(aCdmParts),
            subTitle: readVisualizations.getSubTitle(aCdmParts),
            icon: readVisualizations.getIcon(aCdmParts),
            info: readVisualizations.getInfo(aCdmParts),
            shortTitle: readVisualizations.getShortTitle(aCdmParts)
        };
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returns correct result");
    });

    QUnit.module("getChipConfigFromVizReference");

    QUnit.test("Returns the chipConfig", function (assert) {
        // Arrange
        var oVizReference = {
            vizConfig: {
                "sap.flp": {
                    chipConfig: {}
                }
            }
        };
        // Act
        var oConfig = readVisualizations.getChipConfigFromVizReference(oVizReference);
        // Assert
        assert.strictEqual(oConfig, oVizReference.vizConfig["sap.flp"].chipConfig, "Returned the correct config");
    });

    QUnit.test("Returns undefined when chipConfig is not present", function (assert) {
        // Arrange
        var oVizReference = {
            vizConfig: {
                "sap.flp": {
                }
            }
        };
        // Act
        var oConfig = readVisualizations.getChipConfigFromVizReference(oVizReference);
        // Assert
        assert.strictEqual(oConfig, undefined, "Returned undefined");
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.workpage.WorkPageVizInstantiation
 */
sap.ui.define([
    "sap/ushell/utils/workpage/WorkPageVizInstantiation",
    "sap/base/util/ObjectPath",
    "sap/ushell/Config"
], function (
    WorkPageVizInstantiation,
    ObjectPath,
    Config
) {
    "use strict";
    /* global sinon QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("getInstance", {
        beforeEach: function () {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        return WorkPageVizInstantiation.getInstance().then((oWorkPageVizInstantiation) => {
            assert.ok(oWorkPageVizInstantiation, "The WorkPageVizInstantiation was instantiated.");

            const oVizInstance = oWorkPageVizInstantiation.createVizInstance({
                id: "test-viz-id",
                type: "sap.ushell.StaticAppLauncher",
                descriptor: {
                    value: {
                        "sap.app": {
                            title: "test-title"
                        }
                    }
                }
            });

            // just do some spot checks here
            assert.ok(oVizInstance.isA("sap.ushell.ui.launchpad.VizInstanceCdm"), "Created viz instance is VizInstanceCdm");
            assert.strictEqual(oVizInstance.getTitle(), "test-title", "Created viz instance has correct title");
            const sVizTypeComponentId = ObjectPath.get(["vizType", "sap.app", "id"], oVizInstance.getInstantiationData());
            assert.strictEqual(sVizTypeComponentId, "sap.ushell.components.tiles.cdm.applauncher",
                "Created viz instance has correct viz type component");

        });
    });

    QUnit.module("createVizInstance", {
        beforeEach: function () {
            this.oSetActiveStub = sandbox.stub();
            this.bModifyVizData = false;
            this.oInstantiateVisualizationStub = sandbox.stub().callsFake((vizData) => {
                if (this.bModifyVizData) {
                    ObjectPath.set(["indicatorDataSource", "addedProperty"], "modified viz data", vizData);
                }

                return {
                    setActive: this.oSetActiveStub
                };
            });
            const oVisualizationInstantiationStub = {
                instantiateVisualization: this.oInstantiateVisualizationStub
            };
            const oStandardVizTypes = {
                vizType: {
                    test: "fakeVizType"
                }
            };
            this.oWorkPageVizInstantiation = new WorkPageVizInstantiation(oVisualizationInstantiationStub, oStandardVizTypes);
            this.oDataInput = {
                id: "test-viz-id",
                type: "vizType",
                descriptor: {
                    value: {
                        "sap.app": {
                            title: "test-title",
                            subTitle: "test-subtitle",
                            info: "test-info",
                            tags: {
                                keywords: ["test-keyword"]
                            }
                        },
                        "sap.ui": {
                            icons: {
                                icon: "test-icon"
                            }
                        },
                        "sap.flp": {
                            numberUnit: "test-numberUnit",
                            indicatorDataSource: {
                                dataSource: "testIndicatorDataSource"
                            },
                            target: {
                                appId: "test-app"
                            },
                            vizOptions: {
                                displayFormats: {
                                    default: "standard",
                                    supported: [
                                        "flat",
                                        "standard"
                                    ]
                                }
                            }
                        }
                    },
                    indicatorDataSource: {
                        url: "testdata/testurl",
                        refreshInterval: "0"
                    }
                }
            };
            this.oExpectedInstantiationData = {
                id: "test-viz-id",
                title: "test-title",
                subtitle: "test-subtitle",
                info: "test-info",
                icon: "test-icon",
                keywords: ["test-keyword"],
                _instantiationData: {
                    platform: "CDM",
                    vizType: {
                        test: "fakeVizType"
                    }
                },
                indicatorDataSource: undefined,
                vizType: "vizType",
                dataSource: undefined,
                contentProviderId: undefined,
                contentProviderLabel: undefined,
                displayProviderLabel: false,
                target: undefined,
                targetURL: undefined,
                vizConfig: {
                    "sap.app": {
                        title: "test-title",
                        subTitle: "test-subtitle",
                        info: "test-info",
                        tags: {
                            keywords: ["test-keyword"]
                        }
                    },
                    "sap.ui": {
                        icons: {
                            icon: "test-icon"
                        }
                    },
                    "sap.flp": {
                        numberUnit: "test-numberUnit",
                        indicatorDataSource: {
                            dataSource: "testIndicatorDataSource"
                        },
                        target: {
                            appId: "test-app"
                        },
                        vizOptions: {
                            displayFormats: {
                                default: "standard",
                                supported: [
                                    "flat",
                                    "standard"
                                ]
                            }
                        }
                    }
                },
                supportedDisplayFormats: [
                    "flat",
                    "standard"
                ],
                displayFormatHint: "standard",
                numberUnit: "test-numberUnit",
                vizId: "test-viz-id",
                preview: undefined
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls the VisualizationInstantiation service with correct data when no _siteData is provided", function (assert) {
        this.oWorkPageVizInstantiation.createVizInstance(this.oDataInput);
        assert.strictEqual(this.oInstantiateVisualizationStub.callCount, 1, "VisualizationInstantiation.instantiateVisualization was called exactly once.");
        assert.deepEqual(this.oInstantiateVisualizationStub.getCall(0).args, [this.oExpectedInstantiationData],
            "VisualizationInstantiation.instantiateVisualization was called with correct data.");
    });

    QUnit.test("sets the created viz instance active", function (assert) {
        this.oWorkPageVizInstantiation.createVizInstance(this.oDataInput);

        assert.strictEqual(this.oSetActiveStub.callCount, 1, "setActive was called exactly once.");
        assert.deepEqual(this.oSetActiveStub.getCall(0).args, [true],
            "setActive was called with correct data.");
    });

    QUnit.test("calls the VisualizationInstantiation service with correct data when _siteData is provided", function (assert) {
        const oFakeDataSource = {
            uri: "/test/uri"
        };
        this.oDataInput._siteData = {
            dataSource: oFakeDataSource,
            contentProviderId: "test-content-provider",
            contentProviderLabel: "Test Content Provider",
            target: {
                some: "target"
            },
            targetURL: "#Some-hash?with=parameters"
        };
        this.oExpectedInstantiationData.dataSource = oFakeDataSource;
        this.oExpectedInstantiationData.contentProviderId = "test-content-provider";
        this.oExpectedInstantiationData.contentProviderLabel = "Test Content Provider";
        this.oExpectedInstantiationData.target = {
            some: "target"
        };
        this.oExpectedInstantiationData.targetURL = "#Some-hash?with=parameters";

        this.oWorkPageVizInstantiation.createVizInstance(this.oDataInput);

        assert.strictEqual(this.oInstantiateVisualizationStub.callCount, 1, "VisualizationInstantiation.instantiateVisualization was called exactly once.");
        assert.deepEqual(this.oInstantiateVisualizationStub.getCall(0).args, [this.oExpectedInstantiationData],
            "VisualizationInstantiation.instantiateVisualization was called with correct data.");
    });

    QUnit.test("calls the VisualizationInstantiation service with correct data when preview is provided", function (assert) {
        this.oDataInput.preview = true;
        this.oExpectedInstantiationData.preview = true;

        this.oWorkPageVizInstantiation.createVizInstance(this.oDataInput);

        assert.strictEqual(this.oInstantiateVisualizationStub.callCount, 1, "VisualizationInstantiation.instantiateVisualization was called exactly once.");
        assert.deepEqual(this.oInstantiateVisualizationStub.getCall(0).args, [this.oExpectedInstantiationData],
            "VisualizationInstantiation.instantiateVisualization was called with correct data.");
    });

    QUnit.test("clones the indicatorDataSource before passing it to the visualization instantiation service", function (assert) {

        this.bModifyVizData = true;

        this.oWorkPageVizInstantiation.createVizInstance(this.oDataInput);

        const oIndicatorDataSource = ObjectPath.get(["descriptor", "value", "sap.flp", "indicatorDataSource"], this.oDataInput);
        assert.strictEqual(oIndicatorDataSource.addedProperty, undefined, "Viz data was not modified");
    });

    QUnit.test("checks if the displayProviderLabel is true based on the configuration", function (assert) {

        // enable content providers and show content provider info on visualizations
        const oExpected = structuredClone(this.oExpectedInstantiationData);
        oExpected.displayProviderLabel = true;

        sandbox.stub(Config, "last")
            .withArgs("/core/contentProviders/providerInfo/enabled").returns(true)
            .withArgs("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations").returns(true);

        this.oWorkPageVizInstantiation.createVizInstance(this.oDataInput);

        assert.strictEqual(this.oInstantiateVisualizationStub.callCount, 1, "VisualizationInstantiation.instantiateVisualization was called exactly once.");
        assert.deepEqual(this.oInstantiateVisualizationStub.getCall(0).args, [oExpected],
            "VisualizationInstantiation.instantiateVisualization was called with correct data.");
    });

    QUnit.test("checks if the displayProviderLabel is false  based on the configuration", function (assert) {

        // enable content providers and disable show content provider info on visualizations
        sandbox.stub(Config, "last")
            .withArgs("/core/contentProviders/providerInfo/enabled").returns(true)
            .withArgs("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations").returns(false);

        this.oWorkPageVizInstantiation.createVizInstance(this.oDataInput);

        assert.strictEqual(this.oInstantiateVisualizationStub.callCount, 1, "VisualizationInstantiation.instantiateVisualization was called exactly once.");
        assert.deepEqual(this.oInstantiateVisualizationStub.getCall(0).args, [this.oExpectedInstantiationData],
            "VisualizationInstantiation.instantiateVisualization was called with correct data.");
    });

    QUnit.test("checks if the displayProviderLabel is false correctly based on the configuration", function (assert) {

        // disable content providers and enable show content provider info on visualizations
        sandbox.stub(Config, "last")
            .withArgs("/core/contentProviders/providerInfo/enabled").returns(false)
            .withArgs("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations").returns(true);

        this.oWorkPageVizInstantiation.createVizInstance(this.oDataInput);

        assert.strictEqual(this.oInstantiateVisualizationStub.callCount, 1, "VisualizationInstantiation.instantiateVisualization was called exactly once.");
        assert.deepEqual(this.oInstantiateVisualizationStub.getCall(0).args, [this.oExpectedInstantiationData],
            "VisualizationInstantiation.instantiateVisualization was called with correct data.");
    });

    QUnit.test("create the correct smart business tile if feature flag is enabled", function (assert) {
        const oInput = {
            id: "someId",
            _siteData: {
                title: "someTitle",
                subtitle: "someSubtitle",
                info: "someInfo",
                icon: "someIcon",
                keywords: "someKeywords",
                dataSource: "someDataSource",
                contentProviderLabel: "someContentProviderLabel",
                supportedDisplayFormats: "someSupportedDisplayFormats",
                displayFormatHint: "someDisplayFormatHint",
                target: "someTarget",
                targetURL: "someTargetURL"
            },
            provider: {
                id: "someProviderId"
            },
            vizType: "someVizType",
            type: "ssuite.smartbusiness.tiles.one",
            indicatorDataSource: "someIndicatorDataSource",
            descriptor: {
                value: {
                    "sap.flp": {
                        numberUnit: "someNumberUnit"
                    }
                }
            },
            preview: "somePreview"
        };

        const oExpected = {
            _instantiationData: {
              platform: "CDM",
              vizType: "someVizType"
            },
            contentProviderId: "someProviderId",
            contentProviderLabel: "someContentProviderLabel",
            dataSource: "someDataSource",
            displayFormatHint: "someDisplayFormatHint",
            displayProviderLabel: undefined,
            icon: "someIcon",
            id: "someId",
            indicatorDataSource: "someIndicatorDataSource",
            info: "someInfo",
            keywords: "someKeywords",
            numberUnit: "someNumberUnit",
            preview: "somePreview",
            subtitle: "someSubtitle",
            supportedDisplayFormats: "someSupportedDisplayFormats",
            target: "someTarget",
            targetURL: "someTargetURL",
            title: "someTitle",
            vizConfig: {
              "sap.flp": {
                numberUnit: "someNumberUnit"
              }
            },
            vizId: "someId",
            vizType: "ssuite.smartbusiness.tiles.one"
          };

        sandbox.stub(Config, "last")
            .withArgs("/core/workPages/enableSmartBusiness").returns(true);

        this.oWorkPageVizInstantiation.createVizInstance(oInput);

        assert.deepEqual(this.oInstantiateVisualizationStub.getCall(0).args, [oExpected],
        "VisualizationInstantiation.instantiateVisualization was called with correct data.");
    });

    QUnit.test("does not create smart business tile if feature flag is disabled", function (assert) {
        const oInput = {
            id: "someId",
            _siteData: {
                title: "someTitle",
                subtitle: "someSubtitle",
                info: "someInfo",
                icon: "someIcon",
                keywords: "someKeywords",
                dataSource: "someDataSource",
                contentProviderLabel: "someContentProviderLabel",
                supportedDisplayFormats: "someSupportedDisplayFormats",
                displayFormatHint: "someDisplayFormatHint",
                target: "someTarget",
                targetURL: "someTargetURL"
            },
            provider: {
                id: "someProviderId"
            },
            vizType: "someVizType",
            type: "ssuite.smartbusiness.tiles.one",
            indicatorDataSource: "someIndicatorDataSource",
            descriptor: {
                value: {
                    "sap.flp": {
                        numberUnit: "someNumberUnit",
                        indicatorDataSource: {
                            dataSource: "testIndicatorDataSource"
                        },
                        target: {
                            appId: "test-app"
                        },
                        vizOptions: {
                            displayFormats: {
                                default: "standard",
                                supported: [
                                    "flat",
                                    "standard"
                                ]
                            }
                        }
                    }
                }
            },
            preview: "somePreview"
        };

        // It's okay to get undefined, since the structure of SMB tiles is not being
        // propery transformed due to the feature flag being disabled
        const oExpected = {
            _instantiationData: {
              platform: "CDM",
              vizType: undefined
            },
            contentProviderId: undefined,
            contentProviderLabel: "someContentProviderLabel",
            dataSource: "someDataSource",
            displayFormatHint: "standard",
            displayProviderLabel: undefined,
            icon: undefined,
            id: "someId",
            indicatorDataSource: "someIndicatorDataSource",
            info: undefined,
            keywords: [],
            numberUnit: "someNumberUnit",
            preview: "somePreview",
            subtitle: undefined,
            supportedDisplayFormats: [
                "flat",
                "standard"
            ],
            target: "someTarget",
            targetURL: "someTargetURL",
            title: undefined,
            vizConfig: {
              "sap.flp": {
                    numberUnit: "someNumberUnit",
                    indicatorDataSource: {
                        dataSource: "testIndicatorDataSource"
                    },
                    target: {
                        appId: "test-app"
                    },
                    vizOptions: {
                        displayFormats: {
                            default: "standard",
                            supported: [
                                "flat",
                                "standard"
                            ]
                        }
                    }
                }
            },
            vizId: "someId",
            vizType: "ssuite.smartbusiness.tiles.one"
          };

        sandbox.stub(Config, "last")
            .withArgs("/core/workPages/enableSmartBusiness").returns(false);

        this.oWorkPageVizInstantiation.createVizInstance(oInput);

        assert.deepEqual(this.oInstantiateVisualizationStub.getCall(0).args, [oExpected],
        "VisualizationInstantiation.instantiateVisualization was called with correct data.");
    });
});

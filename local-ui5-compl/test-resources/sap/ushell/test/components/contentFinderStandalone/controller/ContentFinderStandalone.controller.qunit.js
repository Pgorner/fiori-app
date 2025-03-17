// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.contentFinderStandalone.controller.ContentFinderStandalone.controller
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/components/contentFinderStandalone/controller/ContentFinderStandalone.controller",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ui/model/json/JSONModel"
], function (
    Log,
    ContentFinderStandaloneController,
    AppLifeCycle,
    Container,
    ushellResources,
    JSONModel
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("The onInit method", {
        beforeEach: function () {
            this.oByIdStub = sandbox.stub().returns(this.oComponentContainer);
            this.oController = new ContentFinderStandaloneController();

            sandbox.stub(this.oController, "getView").returns({
                byId: this.oByIdStub
            });

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                getModel: sandbox.stub().returns({
                    getResourceBundle: sandbox.stub()
                })
            });

            sandbox.stub(Container, "getRendererInternal").returns({
                getRouter: sandbox.stub().returns({
                    getRoute: sandbox.stub().returns({
                        attachMatched: sandbox.stub()
                    })
                })
            });
        },

        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("initializes the controller", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.ok(this.oController.oWorkPageService, "WorkPageService was initialized");
        assert.ok(this.oController.oCatalogService, "CatalogService was initialized");
    });

    QUnit.test("navigation handling", function (assert) {
        // Arrange
        sandbox.stub(AppLifeCycle, "getShellUIService").returns({
            setTitle: sandbox.stub()
        });

        const sTitle = ushellResources.i18n.getText("appFinderTitle");

        // Act
        this.oController.onInit();
        this.oController._handleContentFinderNavigation();

        // Assert
        assert.deepEqual(this.oController.oShellUIService.setTitle.firstCall.args, [sTitle], "setTitle called with correct args");
    });

    QUnit.module("The appSearchComponentCreated method", {
        beforeEach: function () {
            this.oController = new ContentFinderStandaloneController();
            this.oVisualizationData = { a: "b" };
            this.oStubs = {
                component: {
                    attachVisualizationFilterApplied: sandbox.stub(),
                    setVisualizationData: sandbox.stub(),
                    getUiModel: sandbox.stub()
                },
                controller: {
                    setCategoryTree: sandbox.stub(this.oController, "setCategoryTree")
                },
                workPageService: {
                    loadVisualizations: sandbox.stub().resolves(this.oVisualizationData)
                },
                event: {
                    getParameter: sandbox.stub()
                },
                uiModel: {
                    setProperty: sandbox.stub()
                }
            };

            this.oComponent = {
                attachVisualizationFilterApplied: this.oStubs.component.attachVisualizationFilterApplied,
                setVisualizationData: this.oStubs.component.setVisualizationData,
                getUiModel: this.oStubs.component.getUiModel
            };
            this.oStubs.event.getParameter.withArgs("component").returns(this.oComponent);
            this.oEvent = {
                getParameter: this.oStubs.event.getParameter
            };
            this.oController.oWorkPageService = {
                loadVisualizations: this.oStubs.workPageService.loadVisualizations
            };
            this.oStubs.component.getUiModel.returns({
                setProperty: this.oStubs.uiModel.setProperty
            });
        },

        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("initializes the appSearch component", async function (assert) {
        // Act
        await this.oController.appSearchComponentCreated(this.oEvent);

        // Assert
        assert.ok(this.oStubs.component.attachVisualizationFilterApplied.calledOnce, "attachVisualizationFilterApplied was called once.");
        assert.deepEqual(this.oStubs.component.setVisualizationData.callCount, 1, "setVisualizationData was called once.");
        assert.deepEqual(this.oStubs.component.setVisualizationData.firstCall.args[0], this.oVisualizationData, "setVisualizationData was called with the correct data.");
        assert.deepEqual(this.oStubs.workPageService.loadVisualizations.callCount, 1, "loadVisualizations was called once.");
        assert.deepEqual(this.oStubs.workPageService.loadVisualizations.firstCall.args[0], {}, "setVisualizationData was called with the correct data.");
        assert.deepEqual(this.oStubs.controller.setCategoryTree.callCount, 1, "setCategoryTree was called once.");
        assert.deepEqual(this.oStubs.uiModel.setProperty.callCount, 1, "setProperty was called once.");
        assert.deepEqual(this.oStubs.uiModel.setProperty.firstCall.args[0], "/linkToAppFinder", "setProperty was called with the correct path.");
    });

    QUnit.module("The setCategoryTree method", {
        beforeEach: function () {
            this.oController = new ContentFinderStandaloneController();
            this.oCatalogs = { catalogs: [1, 2, 3], totalCount: 3 };
            this.oController.oCatalogService = {
                getCatalogs: sandbox.stub()
            };
            this.oController.oComponent = {
                setCategoryTree: sandbox.stub()
            };
            this.oController.oResourceBundle = {
                getText: sandbox.stub().returns("someText")
            };
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Call setCategoryTree with response", async function (assert) {
        // Arrange
        const aExpectedData = [
            {
                id: undefined,
                title: "someText",
                filterIsTitle: true,
                inactive: false,
                allowedFilters: ["tiles"]
            },
            {
                id: "$$catalogs",
                title: "someText",
                inactive: true,
                filterIsTitle: false,
                nodes: [1, 2, 3],
                $count: 3,
                allowedFilters: ["tiles"]
            }
        ];
        this.oController.oCatalogService.getCatalogs.resolves(this.oCatalogs);

        // Act
        await this.oController.setCategoryTree();

        // Assert
        assert.ok(this.oController.oComponent.setCategoryTree.calledOnce, "setCategoryTree was called once.");
        assert.deepEqual(this.oController.oComponent.setCategoryTree.firstCall.args[0], aExpectedData, "setCategoryTree was called with the correct data.");
    });

    QUnit.test("Call setCategoryTree with empty response", async function (assert) {
        // Arrange
        this.oController.oCatalogService.getCatalogs.resolves([]);

        // Act
        await this.oController.setCategoryTree();

        // Assert
        assert.ok(this.oController.oComponent.setCategoryTree.calledOnce, "setCategoryTree was called once.");
        assert.deepEqual(this.oController.oComponent.setCategoryTree.firstCall.args[0], [], "setCategoryTree was called with the correct data.");
    });

    QUnit.test("Call setCategoryTree with error response", async function (assert) {
        // Arrange
        this.oController.oCatalogService.getCatalogs.throws("some error");
        const oLogErrorStub = sandbox.stub(Log, "error");

        // Act
        await this.oController.setCategoryTree();

        // Assert
        assert.strictEqual(this.oController.oComponent.setCategoryTree.callCount, 0, "setCategoryTree was not called.");
        assert.ok(oLogErrorStub.calledOnce, "Log.error was called once.");
        assert.strictEqual(oLogErrorStub.firstCall.args[0], "Catalog fetching failed with:{\"name\":\"some error\"}", "Log.error was called with the correct arguments.");
    });

    QUnit.module("The _onVisualizationFilterApplied method", {
        beforeEach: function () {
            this.oSetVisualizationDataStub = sandbox.stub();

            this.oComponent = {
                setVisualizationData: this.oSetVisualizationDataStub
            };

            this.oParameters = {
                pagination: {
                    top: 0,
                    skip: 30
                },
                search: "test",
                types: [
                    "sap.ushell.StaticAppLauncher",
                    "sap.ushell.DynamicAppLauncher"
                ]
            };

            this.oVisualizationData = {
                visualizations: {
                    nodes: [
                        { id: "viz-0" },
                        { id: "viz-1" },
                        { id: "viz-2" },
                        { id: "viz-3" },
                        { id: "viz-4" },
                        { id: "viz-5" },
                        { id: "viz-6" },
                        { id: "viz-7" },
                        { id: "viz-8" },
                        { id: "viz-9" }
                    ],
                    totalCount: 10
                }
            };

            this.oTransformedFilterParams = {
                top: 0,
                skip: 30,
                filter: [{
                    type: [
                        { eq: "sap.ushell.StaticAppLauncher" },
                        { eq: "sap.ushell.DynamicAppLauncher" }
                    ],
                    descriptor: [
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/title",
                                    stringFilter: [{ containsIgnoreCase: "test" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/subTitle",
                                    stringFilter: [{ containsIgnoreCase: "test" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/info",
                                    stringFilter: [{ containsIgnoreCase: "test" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.fiori/registrationIds",
                                    anyFilter: [
                                        {
                                            conditions: [
                                                {
                                                    stringFilter: [{ containsIgnoreCase: "test" }]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }]
            };

            this.oGetParametersStub = sandbox.stub().returns(this.oParameters);

            this.oEvent = {
                getParameters: this.oGetParametersStub,
                getParameter: sandbox.stub()
            };
            this.oLoadVisualizationsStub = sandbox.stub().resolves(this.oVisualizationData);

            this.oController = new ContentFinderStandaloneController();

            this.oController.oWorkPageService = {
                loadVisualizations: this.oLoadVisualizationsStub
            };

            this.oController.oComponent = this.oComponent;

            this.oTransformFilterParamsStub = sandbox.stub(this.oController, "_transformFilterParams").returns(this.oTransformedFilterParams);
        },

        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("sets visualizations to the ContentFinder component", function (assert) {
        // Act
        return this.oController._onVisualizationFilterApplied(this.oEvent).then(() => {
            // Assert
            assert.ok(this.oTransformFilterParamsStub.calledOnce, "_transformFilterParams was called once.");
            assert.deepEqual(this.oTransformFilterParamsStub.firstCall.args[0], this.oParameters, "_transformFilterParams was called with the expected arguments.");
            assert.ok(this.oLoadVisualizationsStub.calledOnce, "loadVisualizations was called once.");
            assert.deepEqual(this.oLoadVisualizationsStub.firstCall.args[0], this.oTransformedFilterParams, "loadVisualizations was called with the expected arguments.");
            assert.ok(this.oSetVisualizationDataStub.calledOnce, "setVisualizationData was called once.");
            assert.deepEqual(this.oSetVisualizationDataStub.firstCall.args[0], this.oVisualizationData, "setVisualizationData was called with the expected arguments.");
        });
    });


    QUnit.module("The _transformFilterParams method", {
        beforeEach: function () {
            this.oController = new ContentFinderStandaloneController();
        },

        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("transforms the given filters to graphql format - no search", function (assert) {
        // Arrange
        this.oParameters = {
            pagination: {
                top: 0,
                skip: 30
            },
            search: null,
            types: [
                "sap.ushell.StaticAppLauncher",
                "sap.ushell.DynamicAppLauncher"
            ]
        };

        // Act
        const oResult = this.oController._transformFilterParams(this.oParameters);

        // Assert
        assert.deepEqual(oResult, {
            top: 0,
            skip: 30,
            filter: [{ type: [{ in: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"] }] }]
        }, "The filter were transformed as expected.");
    });

    QUnit.test("transforms the given filters to graphql format - no types", function (assert) {
        // Arrange
        this.oParameters = {
            pagination: {
                top: 120,
                skip: 150
            },
            search: "test my search"
        };

        // Act
        const oResult = this.oController._transformFilterParams(this.oParameters);

        // Assert
        assert.deepEqual(oResult, {
            top: 120,
            skip: 150,
            filter: [
                {
                    type: [],
                    descriptor: [
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/title",
                                    stringFilter: [{ containsIgnoreCase: "test my search" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/subTitle",
                                    stringFilter: [{ containsIgnoreCase: "test my search" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/info",
                                    stringFilter: [{ containsIgnoreCase: "test my search" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.fiori/registrationIds",
                                    anyFilter: [
                                        {
                                            conditions: [
                                                {
                                                    stringFilter: [{ containsIgnoreCase: "test my search" }]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }

            ]
        }, "The filter were transformed as expected.");
    });

    QUnit.test("transforms the given filters to graphql format - all filters", function (assert) {
        // Arrange
        this.oParameters = {
            pagination: {
                top: 90,
                skip: 120
            },
            search: "test my search",
            types: [
                "sap.ushell.StaticAppLauncher",
                "sap.ushell.DynamicAppLauncher",
                "sap.card"
            ]
        };

        // Act
        const oResult = this.oController._transformFilterParams(this.oParameters);

        // Assert
        assert.deepEqual(oResult, {
            top: 90,
            skip: 120,
            filter: [
                {
                    type: [
                        { in: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher", "sap.card"] }
                    ],
                    descriptor: [
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/title",
                                    stringFilter: [{ containsIgnoreCase: "test my search" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/subTitle",
                                    stringFilter: [{ containsIgnoreCase: "test my search" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.app/info",
                                    stringFilter: [{ containsIgnoreCase: "test my search" }]
                                }
                            ]
                        },
                        {
                            conditions: [
                                {
                                    propertyPath: "/sap.fiori/registrationIds",
                                    anyFilter: [
                                        {
                                            conditions: [
                                                {
                                                    stringFilter: [{ containsIgnoreCase: "test my search" }]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }

            ]
        }, "The filter were transformed as expected.");
    });
});

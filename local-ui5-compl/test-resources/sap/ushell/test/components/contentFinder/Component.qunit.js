// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.contentFinder.Component
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/ResourceBundle",
    "sap/base/util/deepExtend",
    "sap/ui/core/Component",
    "sap/ui/core/mvc/View",
    "sap/ushell/components/contentFinder/Component",
    "./mockData/contentFinderVisualizations",
    "./mockData/contentFinderContextData",
    "./mockData/contentFinderCategoryTree",
    "sap/ushell/components/contentFinder/model/GraphQLModel",
    "sap/ushell/Config",
    "sap/f/library"
], function (
    Log,
    ResourceBundle,
    deepExtend,
    Component,
    View,
    ContentFinderComponent,
    visualizationsMock,
    restrictedVisualizationsMock,
    categoryTreeMock,
    GraphQLModel,
    Config,
    fLibrary
) {
    "use strict";
    /* global QUnit, sinon */

    QUnit.dump.maxDepth = 10;

    const sandbox = sinon.createSandbox();
    const LayoutType = fLibrary.LayoutType;

    const fnCreateComponent = async function (oSettings, oComponentData) {
        sandbox.stub(View, "create").resolves();
        return Component.create({
            name: "sap.ushell.components.contentFinder",
            settings: oSettings || {},
            componentData: oComponentData || {}
        });
    };

    QUnit.module("The ContentFinder Component init", {
        beforeEach: function () {
            this.oComponentData = {
                visualizationFilters: {
                    displayed: ["tiles", "cards"],
                    selected: "tiles",
                    available: [
                        {
                            key: "tiles",
                            title: "Tiles",
                            types: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"]
                        },
                        {
                            key: "cards",
                            title: "Cards",
                            types: ["sap.card"]
                        }
                    ]
                }
            };
            this.fnStubInitCalls = function () {
                this.oInitializeUiModelSpy = sandbox.spy(ContentFinderComponent.prototype, "initializeUiModel");
                this.oInitializeDataModelSpy = sandbox.spy(ContentFinderComponent.prototype, "initializeDataModel");
                this.oInitializeSelectionModelSpy = sandbox.spy(ContentFinderComponent.prototype, "initializeSelectionModel");
                this.oInitializeSidebarStatusSpy = sandbox.spy(ContentFinderComponent.prototype, "_initializeSidebarStatus");
            }.bind(this);
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("Instantiation of the component with default settings", async function (assert) {
        // Arrange
        this.fnStubInitCalls();

        // Act
        this.oComponent = await fnCreateComponent();

        // Assert
        assert.strictEqual(this.oComponent.getEnablePersonalization(), true, "The enablePersonalization setting was set correctly.");
        assert.strictEqual(this.oComponent.getNoItemsInCatalogDescription(), "", "The noItemsInCatalogDescription setting was set correctly.");
        assert.strictEqual(this.oComponent.getShowAppBoxFieldsPlaceholder(), true, "The showAppBoxFieldsPlaceholder setting was set correctly.");
        assert.strictEqual(this.oComponent.getShowCategoryTreeWhenEmpty(), true, "The showCategoryTreeWhenEmpty setting was set correctly.");
        assert.strictEqual(this.oComponent.getShowApplicationLaunchButton(), false, "The showApplicationLaunchButton setting was set correctly.");
    });

    QUnit.test("Instantiation of the component with componentData", async function (assert) {
        // Arrange
        this.fnStubInitCalls();

        // Act
        this.oComponent = await fnCreateComponent({}, this.oComponentData);

        // Assert
        assert.ok(this.oComponent.oResourceBundle instanceof ResourceBundle, "The resource bundle was initialized.");
        assert.ok(this.oInitializeUiModelSpy.calledOnce, "The initializeUiModel method was called once.");
        assert.ok(this.oInitializeDataModelSpy.calledOnce, "The initializeDataModel method was called once.");
        assert.ok(this.oInitializeSelectionModelSpy.calledOnce, "The initializeSelectionModel method was called once.");
        assert.ok(this.oInitializeSidebarStatusSpy.calledOnce, "The _initializeSidebarStatus method was called once.");
        assert.deepEqual(this.oComponent.getComponentData(), this.oComponentData, "The component data was set correctly.");
        assert.deepEqual(this.oComponent.oRestrictedVisualizationsMap, new Map(), "The restricted visualizations map was initialized.");
    });

    QUnit.test("Instantiation of the component with non-default settings", async function (assert) {
        // Arrange
        const oComponentSettings = {
            enablePersonalization: false,
            noItemsInCatalogDescription: "My Description",
            showAppBoxFieldsPlaceholder: false,
            showCategoryTreeWhenEmpty: false,
            showApplicationLaunchButton: true
        };
        this.fnStubInitCalls();

        // Act
        this.oComponent = await fnCreateComponent(oComponentSettings);

        // Assert
        assert.strictEqual(this.oComponent.getEnablePersonalization(), oComponentSettings.enablePersonalization, "The enablePersonalization setting was set correctly.");
        assert.strictEqual(this.oComponent.getNoItemsInCatalogDescription(), oComponentSettings.noItemsInCatalogDescription, "The noItemsInCatalogDescription setting was set correctly.");
        assert.strictEqual(this.oComponent.getShowAppBoxFieldsPlaceholder(), oComponentSettings.showAppBoxFieldsPlaceholder, "The showAppBoxFieldsPlaceholder setting was set correctly.");
        assert.strictEqual(this.oComponent.getShowCategoryTreeWhenEmpty(), oComponentSettings.showCategoryTreeWhenEmpty, "The showCategoryTreeWhenEmpty setting was set correctly.");
        assert.strictEqual(this.oComponent.getShowApplicationLaunchButton(), oComponentSettings.showApplicationLaunchButton, "The showApplicationLaunchButton setting was set correctly.");
    });

    QUnit.module("The getUiModel method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("Initialization of the 'ui' model", function (assert) {
        // Act
        const oModel = this.oComponent.getUiModel();

        // Assert
        assert.ok(oModel.isA("sap.ui.model.json.JSONModel"), "The UI model is a JSONModel.");
    });

    QUnit.module("The getDataModel method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("Initialization of the 'data' model", function (assert) {
        // Act
        const oModel = this.oComponent.getDataModel();

        // Assert
        assert.ok(oModel.isA("sap.ushell.components.contentFinder.model.GraphQLModel"), "The data model is a GraphQLModel.");
    });

    QUnit.module("The getSelectionModel method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("Initialization of the 'selection' model", function (assert) {
        // Arrange
        const oExpectedData = {
            visualizations: {
                items: [],
                totalCount: 0,
                restrictedItems: []
            }
        };

        // Act
        const oModel = this.oComponent.getSelectionModel();

        // Assert
        assert.ok(oModel.isA("sap.ui.model.json.JSONModel"), "The selection model is a JSONModel.");
        assert.deepEqual(oModel.getData(), oExpectedData, "The selection model was initialized correctly.");
    });

    QUnit.module("The component properties 'set' methods", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("The _setComponentSettingsProperty method", function (assert) {
        // Act
        this.oComponent._setComponentSettingsProperty("noItemsInCatalogDescription", "Some Description Text");

        // Assert
        assert.strictEqual(this.oComponent.getNoItemsInCatalogDescription(), "Some Description Text", "The noItemsInCatalogDescription property was set correctly.");
        assert.strictEqual(
            this.oComponent.getUiModel().getProperty("/componentSettings/noItemsInCatalogDescription"),
            "Some Description Text",
            "The noItemsInCatalogDescription property was set correctly in the model."
        );
    });

    QUnit.test("The setEnablePersonalization method", function (assert) {
        this.oComponent.setEnablePersonalization(true);
        assert.strictEqual(this.oComponent.getEnablePersonalization(), true, "The enablePersonalization property was set correctly.");

        this.oComponent.setEnablePersonalization(false);
        assert.strictEqual(this.oComponent.getEnablePersonalization(), false, "The enablePersonalization property was set correctly.");
    });

    QUnit.test("The setNoItemsInCatalogDescription method", function (assert) {
        this.oComponent.setNoItemsInCatalogDescription("My Description");
        assert.strictEqual(this.oComponent.getNoItemsInCatalogDescription(), "My Description", "The noItemsInCatalogDescription property was set correctly.");
    });

    QUnit.test("The setShowAppBoxFieldsPlaceholder method", function (assert) {
        this.oComponent.setShowAppBoxFieldsPlaceholder(true);
        assert.strictEqual(this.oComponent.getShowAppBoxFieldsPlaceholder(), true, "The setShowAppBoxFieldsPlaceholder property was set correctly.");

        this.oComponent.setShowAppBoxFieldsPlaceholder(false);
        assert.strictEqual(this.oComponent.getShowAppBoxFieldsPlaceholder(), false, "The setShowAppBoxFieldsPlaceholder property was set correctly.");
    });

    QUnit.test("The setShowCategoryTreeWhenEmpty method", function (assert) {
        this.oComponent.setShowCategoryTreeWhenEmpty(true);
        assert.strictEqual(this.oComponent.getShowCategoryTreeWhenEmpty(), true, "The setShowCategoryTreeWhenEmpty property was set correctly.");

        this.oComponent.setShowCategoryTreeWhenEmpty(false);
        assert.strictEqual(this.oComponent.getShowCategoryTreeWhenEmpty(), false, "The setShowCategoryTreeWhenEmpty property was set correctly.");
    });

    QUnit.test("The setShowApplicationLaunchButton method", function (assert) {
        this.oComponent.setShowApplicationLaunchButton(true);
        assert.strictEqual(this.oComponent.getShowApplicationLaunchButton(), true, "The setShowApplicationLaunchButton property was set correctly.");

        this.oComponent.setShowApplicationLaunchButton(false);
        assert.strictEqual(this.oComponent.getShowApplicationLaunchButton(), false, "The setShowApplicationLaunchButton property was set correctly.");
    });

    QUnit.module("The setCategoryTree method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("set a valid category tree", function (assert) {
        // Act
        this.oComponent.setCategoryTree(categoryTreeMock);

        // Assert
        assert.deepEqual(this.oComponent.getDataModel().getProperty("/categoryTree"), categoryTreeMock, "The category tree was set correctly.");
    });

    QUnit.test("set a invalid category tree", function (assert) {
        // Arrange
        const oLogErrorStub = sandbox.stub(Log, "error");

        // Act
        this.oComponent.setCategoryTree(null);

        // Assert
        assert.strictEqual(oLogErrorStub.callCount, 1, "An error was logged.");
        assert.deepEqual(this.oComponent.getDataModel().getProperty("/categoryTree"), [], "The category tree was not set.");
    });

    QUnit.module("The queryVisualizations method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("queryVisualizations with default parameters", async function (assert) {
        // Arrange
        this.oComponent.attachVisualizationFilterApplied(null, (oEvent) => {
            // Assert
            const oParameters = oEvent.getParameters();
            assert.ok(true, "visualizationFilterApplied was fired.");
            assert.deepEqual(oParameters, {
                pagination: {
                    skip: 0,
                    top: 100
                },
                types: [],
                search: null,
                categoryId: null
            }, "The visualizationFilterApplied event was fired with the expected parameters");
        });
        // Act
        this.oComponent.queryVisualizations();
    });

    QUnit.test("queryVisualizations with non-default parameters", async function (assert) {
        // Arrange
        this.oComponent.getUiModel().setProperty("/visualizations/growingThreshold", 123);
        this.oComponent.attachVisualizationFilterApplied(null, (oEvent) => {
            // Assert
            const oParameters = oEvent.getParameters();
            assert.ok(true, "visualizationFilterApplied was fired.");
            assert.deepEqual(oParameters, {
                pagination: {
                    skip: 5,
                    top: 123
                },
                types: [],
                search: "Test Search",
                categoryId: "testCategoryId"
            }, "The visualizationFilterApplied event was fired with the expected parameters");

        });
        // Act
        this.oComponent.queryVisualizations(5, "Test Search", "testCategoryId");
    });

    QUnit.test("queryVisualizations loading flag", async function (assert) {
        // Arrange
        this.oComponent.attachVisualizationFilterApplied(null, () => {
            // Assert
            assert.ok(true, "visualizationFilterApplied was fired.");
            assert.strictEqual(this.oComponent._bLoading, true, "loading was set to true.");
            assert.strictEqual(
                this.oComponent.getUiModel().getProperty("/visualizations/loaded"),
                false,
                "loaded was set to false."
            );

        });
        // Act
        assert.strictEqual(this.oComponent._bLoading, false, "loading was set to false.");
        assert.strictEqual(
            this.oComponent.getUiModel().getProperty("/visualizations/loaded"),
            false,
            "loaded is initially false."
        );
        this.oComponent.queryVisualizations();
    });

    QUnit.test("queryVisualizations with tiles filter", async function (assert) {
        // Arrange
        this.oComponent.getUiModel().setProperty("/visualizations/filters", {
            selected: "tiles",
            available: [
                {
                    key: "tiles",
                    types: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"]
                },
                {
                    key: "cards",
                    types: ["sap.card"]
                }
            ]
        });

        this.oComponent.attachVisualizationFilterApplied(null, (oEvent) => {
            // Assert
            const oParameters = oEvent.getParameters();
            assert.ok(true, "visualizationFilterApplied was fired.");
            assert.deepEqual(oParameters, {
                pagination: {
                    skip: 0,
                    top: 100
                },
                types: [
                    "sap.ushell.StaticAppLauncher",
                    "sap.ushell.DynamicAppLauncher"
                ],
                search: null,
                categoryId: null
            }, "The visualizationFilterApplied event was fired with the expected parameters");
        });

        // Act
        this.oComponent.queryVisualizations();
    });

    QUnit.test("queryVisualizations with cards filter", async function (assert) {
        // Arrange
        this.oComponent.getUiModel().setProperty("/visualizations/filters", {
            selected: "cards",
            available: [
                {
                    key: "tiles",
                    types: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"]
                },
                {
                    key: "cards",
                    types: ["sap.card"]
                }
            ]
        });

        this.oComponent.attachVisualizationFilterApplied(null, (oEvent) => {
            // Assert
            const oParameters = oEvent.getParameters();
            assert.ok(true, "visualizationFilterApplied was fired.");
            assert.deepEqual(oParameters, {
                pagination: {
                    skip: 0,
                    top: 100
                },
                types: [
                    "sap.card"
                ],
                search: null,
                categoryId: null
            }, "The visualizationFilterApplied event was fired with the expected parameters");
        });
        // Act
        this.oComponent.queryVisualizations();
    });

    QUnit.module("The setVisualizationData method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("setVisualizationData with appended data (pagination)", async function (assert) {
        // Arrange
        const oDataModel = this.oComponent.getDataModel();
        sandbox.stub(this.oComponent, "_prepareVisualizations").returns(visualizationsMock.visualizations.nodes);
        const oVisualizationsMockCopy = deepExtend({}, visualizationsMock);
        oVisualizationsMockCopy.visualizations.totalCount *= 2;


        // Act
        this.oComponent.setVisualizationData(oVisualizationsMockCopy);

        // Assert
        assert.deepEqual(oDataModel.getProperty("/visualizations/items"), oVisualizationsMockCopy.visualizations.nodes, "The visualizations were set correctly.");
        assert.strictEqual(oDataModel.getProperty("/visualizations/totalCount"), oVisualizationsMockCopy.visualizations.totalCount, "The total count was set correctly.");
        assert.strictEqual(this.oComponent.getUiModel().getProperty("/visualizations/loaded"), true, "The loaded flag was set to true.");
        assert.strictEqual(this.oComponent._bLoading, false, "The loading flag was set to false.");

        // Call a second time with the same data to append it and check the totalCount calculated by the backend.
        // Act
        this.oComponent.setVisualizationData(oVisualizationsMockCopy);

        // Assert
        assert.deepEqual(
            oDataModel.getProperty("/visualizations/items"),
            [].concat(oVisualizationsMockCopy.visualizations.nodes, oVisualizationsMockCopy.visualizations.nodes),
            "The visualizations were set correctly."
        );
        assert.strictEqual(oDataModel.getProperty("/visualizations/totalCount"), oVisualizationsMockCopy.visualizations.totalCount, "The total count was set correctly.");
        assert.strictEqual(this.oComponent.getUiModel().getProperty("/visualizations/loaded"), true, "The loaded flag was set to true.");
        assert.strictEqual(this.oComponent._bLoading, false, "The loading flag was set to false.");

    });

    QUnit.test("setVisualizationData with replaced data", async function (assert) {
        // Arrange
        const oDataModel = this.oComponent.getDataModel();
        sandbox.stub(this.oComponent, "_prepareVisualizations").returns(visualizationsMock.visualizations.nodes);
        const oVisualizationsMockCopy = deepExtend({}, visualizationsMock);

        // Act
        this.oComponent.setVisualizationData(oVisualizationsMockCopy);

        // Assert
        assert.deepEqual(oDataModel.getProperty("/visualizations/items"), oVisualizationsMockCopy.visualizations.nodes, "The visualizations were set correctly.");
        assert.strictEqual(oDataModel.getProperty("/visualizations/totalCount"), oVisualizationsMockCopy.visualizations.totalCount, "The total count was set correctly.");
        assert.strictEqual(this.oComponent.getUiModel().getProperty("/visualizations/loaded"), true, "The loaded flag was set to true.");
        assert.strictEqual(this.oComponent._bLoading, false, "The loading flag was set to false.");

        // Call a second time with the same data to replace it and check the totalCount calculated by the backend.
        // Act
        this.oComponent.setVisualizationData(oVisualizationsMockCopy, true);

        // Assert
        assert.deepEqual(oDataModel.getProperty("/visualizations/items"), oVisualizationsMockCopy.visualizations.nodes, "The visualizations were set correctly.");
        assert.strictEqual(oDataModel.getProperty("/visualizations/totalCount"), oVisualizationsMockCopy.visualizations.totalCount, "The total count was set correctly.");
        assert.strictEqual(this.oComponent.getUiModel().getProperty("/visualizations/loaded"), true, "The loaded flag was set to true.");
        assert.strictEqual(this.oComponent._bLoading, false, "The loading flag was set to false.");

    });

    QUnit.module("The setContextData method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("setContextData with data", async function (assert) {
        // Act
        this.oComponent.setContextData(restrictedVisualizationsMock);

        // Assert
        assert.deepEqual(
            this.oComponent.getDataModel().getProperty("/visualizations/restrictedItems"),
            restrictedVisualizationsMock.restrictedVisualizations,
            "The restricted visualizations were set correctly."
        );
        assert.strictEqual(
            this.oComponent.oRestrictedVisualizationsMap.has(restrictedVisualizationsMock.restrictedVisualizations[0]),
            true,
            "The restricted visualizations were set correctly."
        );
    });

    QUnit.test("setContextData with empty data", async function (assert) {
        // Act
        this.oComponent.setContextData({});

        // Assert
        assert.deepEqual(
            this.oComponent.getDataModel().getProperty("/visualizations/restrictedItems"),
            [],
            "The empty restricted visualizations were set correctly."
        );
        assert.strictEqual(
            this.oComponent.oRestrictedVisualizationsMap.size,
            0,
            "The empty restricted visualizations were set correctly in the map."
        );
    });

    QUnit.module("The addVisualizations method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("addVisualizations with data", async function (assert) {
        // Arrange
        const aVisualizations = visualizationsMock.visualizations.nodes.slice(0, 2);
        this.oComponent.attachVisualizationsAdded(null, (oEvent) => {
            // Assert
            assert.ok(true, "visualizationsAdded was fired.");
            assert.deepEqual(oEvent.getParameters().visualizations, aVisualizations, "The visualizations were set correctly.");
        });

        // Act
        this.oComponent.addVisualizations(aVisualizations);
    });

    QUnit.test("addVisualizations with data", async function (assert) {
        // Arrange
        const aVisualizations = visualizationsMock.visualizations.nodes.slice(0, 2);
        this.oComponent.attachVisualizationsAdded(null, (oEvent) => {
            // Assert
            assert.ok(true, "visualizationsAdded was fired.");
            assert.deepEqual(oEvent.getParameters().visualizations, aVisualizations, "The visualizations were set correctly.");
        });

        // Act
        this.oComponent.addVisualizations(aVisualizations);
    });

    QUnit.test("addVisualizations with empty data", async function (assert) {
        // Arrange
        const aVisualizations = [];
        this.oComponent.attachVisualizationsAdded(null, () => {
            // Assert
            assert.ok(false, "visualizationsAdded should not be fired.");
        });

        // Act
        this.oComponent.addVisualizations(aVisualizations);
        assert.ok(true, "The event was not fired.");
    });

    QUnit.module("The event trigger methods", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
            this.fnEventHandlerStub = sandbox.stub();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("contentFinderClosed event is fired and handler is called", function (assert) {
        // Act
        this.oComponent.attachContentFinderClosed(this.fnEventHandlerStub);
        this.oComponent.triggerContentFinderClosed();

        // Assert
        assert.strictEqual(this.fnEventHandlerStub.callCount, 1, "contentFinderClosed handler was called once");

        // Check that it was called with no arguments
        assert.deepEqual(this.fnEventHandlerStub.firstCall.args[0].getParameters(), {}, "contentFinderClosed was called with no data");
    });

    QUnit.test("widgetSelected event is fired with widgetId and handler is called with correct data", function (assert) {
        var widgetId = "123";

        // Act
        this.oComponent.attachWidgetSelected(this.fnEventHandlerStub);
        this.oComponent.triggerWidgetSelected(widgetId);

        // Assert
        assert.strictEqual(this.fnEventHandlerStub.callCount, 1, "widgetSelected handler was called once");
        assert.strictEqual(this.fnEventHandlerStub.firstCall.args[0].getParameter("widgetId"), widgetId, "The correct event data should be available.");
    });

    QUnit.module("The resetAppSearch method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
            this.oInitializeUiModelStub = sandbox.stub(ContentFinderComponent.prototype, "initializeUiModel");
            this.oInitializeSelectionStub = sandbox.stub(ContentFinderComponent.prototype, "initializeSelectionModel");
            this.oUseSelectionModelStub = sandbox.stub(ContentFinderComponent.prototype, "useSelectionModel");
            this.oUpdateSidebarStatusStub = sandbox.stub(ContentFinderComponent.prototype, "updateSidebarStatus");
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("resetAppSearch", async function (assert) {
        this.oComponent.resetAppSearch();

        assert.strictEqual(this.oInitializeUiModelStub.callCount, 1, "The initializeUiModel method was called once.");
        assert.strictEqual(this.oInitializeSelectionStub.callCount, 1, "The initializeSelectionModel method was called once.");
        assert.strictEqual(this.oUseSelectionModelStub.callCount, 1, "The useSelectionModel method was called once.");
        assert.strictEqual(this.oUseSelectionModelStub.args[0][0], false, "The useSelectionModel method was called with the correct parameter.");
        assert.strictEqual(this.oUpdateSidebarStatusStub.callCount, 1, "The updateSidebarStatus method was called once.");
    });

    QUnit.module("The useSelectionModel method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
            this.oSelectionModel = this.oComponent.getSelectionModel();
            this.oDataModel = this.oComponent.getDataModel();
            this.oGetSelectionModelSpy = sandbox.spy(ContentFinderComponent.prototype, "getSelectionModel");
            this.oGetDataModelSpy = sandbox.spy(ContentFinderComponent.prototype, "getDataModel");
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("Use the selection model", async function (assert) {
        // Act
        this.oComponent.useSelectionModel(true);

        // Assert
        assert.strictEqual(this.oGetSelectionModelSpy.callCount, 1, "The getSelectionModel method was called once.");
        assert.strictEqual(this.oGetDataModelSpy.callCount, 0, "The getDataModel method was not called.");
        assert.strictEqual(this.oComponent.getModel("data"), this.oSelectionModel, "The selection model was set as data model.");
    });

    QUnit.test("Use the data model", async function (assert) {
        // Act
        this.oComponent.useSelectionModel(false);

        // Assert
        assert.strictEqual(this.oGetSelectionModelSpy.callCount, 0, "The getSelectionModel method was not called.");
        assert.strictEqual(this.oGetDataModelSpy.callCount, 1, "The getDataModel method was called once.");
        assert.strictEqual(this.oComponent.getModel("data"), this.oDataModel, "The data model was set as data model.");
    });

    QUnit.module("The initializeUiModel method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
            this.oExpectedData = {
                layoutType: LayoutType.TwoColumnsMidExpanded,
                preservedLayoutType: LayoutType.TwoColumnsMidExpanded,
                maxColumnsCount: 2,
                componentSettings: {
                    enablePersonalization: true,
                    noItemsInCatalogDescription: "",
                    showAppBoxFieldsPlaceholder: true,
                    showCategoryTreeWhenEmpty: true,
                    showApplicationLaunchButton: false
                },
                categoryTree: {
                    hasData: false,
                    itemPressed: false,
                    selectedId: undefined,
                    selectedTitle: undefined,
                    visible: true
                },
                visualizations: {
                    appliedSearchTerm: "",
                    filters: {
                        displayed: [],
                        filterIsTitle: true,
                        selected: "tiles",
                        available: []
                    },
                    growingThreshold: 100,
                    listView: false,
                    loaded: false,
                    searchFieldValue: "",
                    searchTerm: "",
                    showSelectedPressed: false
                }
            };
            this.oChangedData = {
                layoutType: "ThreeColumnsMidExpanded",
                preservedLayoutType: "ThreeColumnsMidExpanded",
                maxColumnsCount: 5,
                componentSettings: {
                    enablePersonalization: false,
                    noItemsInCatalogDescription: "some description",
                    showAppBoxFieldsPlaceholder: false,
                    showCategoryTreeWhenEmpty: true,
                    showApplicationLaunchButton: true
                },
                categoryTree: {
                    hasData: true,
                    itemPressed: true,
                    selectedId: "someId",
                    selectedTitle: "someTitle",
                    visible: false
                },
                visualizations: {
                    appliedSearchTerm: "search something",
                    filters: {
                        displayed: ["some", "filter"],
                        filterIsTitle: false,
                        selected: "some",
                        available: ["some"]
                    },
                    growingThreshold: 200,
                    listView: true,
                    loaded: true,
                    searchFieldValue: "search something",
                    searchTerm: "search Something",
                    showSelectedPressed: true
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("initializeUiModel with default data", async function (assert) {
        // Act
        this.oComponent.initializeUiModel();

        // Assert
        assert.deepEqual(this.oComponent.getUiModel().getData(), this.oExpectedData, "The UI model was initialized correctly.");
    });

    QUnit.test("initializeUiModel with changed and preserve data", async function (assert) {
        const oPreservedData = {
            preservedLayoutType: this.oChangedData.preservedLayoutType,
            categoryTree: this.oChangedData.categoryTree,
            visualizations: {
                filters: this.oChangedData.visualizations.filters,
                listView: this.oChangedData.visualizations.listView
            }
        };

        // Arrange
        this.oComponent.getUiModel().setData(this.oChangedData);

        // Act
        this.oComponent.initializeUiModel(true);

        // Assert
        assert.deepEqual(this.oComponent.getUiModel().getData(), deepExtend(this.oExpectedData, oPreservedData), "ui model was initialized correctly.");
    });

    QUnit.test("initializeUiModel with changed and don't preserve data", async function (assert) {
        // Arrange
        this.oComponent.getUiModel().setData(this.oChangedData);

        // Act
        this.oComponent.initializeUiModel(false);

        // Assert
        assert.deepEqual(this.oComponent.getUiModel().getData(), this.oExpectedData, "ui model was initialized correctly.");
    });

    QUnit.module("The initializeDataModel method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
            this.oExpectedData = {
                categoryTree: [],
                visualizations: {
                    items: [],
                    totalCount: 0,
                    restrictedItems: []
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("initializeDataModel with default data", async function (assert) {
        // Act
        this.oComponent.initializeDataModel();

        // Assert
        assert.deepEqual(this.oComponent.getDataModel().getData(), this.oExpectedData, "The data model was initialized correctly.");
    });

    QUnit.test("initializeDataModel with changed data", async function (assert) {
        // Arrange
        const oChangeData = {
            categoryTree: ["a", "b", "c"],
            visualizations: {
                items: [1, 2, 3],
                totalCount: 99
            }
        };
        this.oComponent.getDataModel().setData(oChangeData);

        // Act
        this.oComponent.initializeDataModel();

        // Assert
        assert.deepEqual(this.oComponent.getDataModel().getData(), this.oExpectedData, "The data model was initialized correctly.");
    });

    QUnit.module("The initializeSelectionModel method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
            this.oExpectedData = {
                visualizations: {
                    items: [],
                    totalCount: 0,
                    restrictedItems: []
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("initializeDataModel with default data", async function (assert) {
        // Act
        this.oComponent.initializeSelectionModel();

        // Assert
        assert.deepEqual(this.oComponent.getSelectionModel().getData(), this.oExpectedData, "The selection model was initialized correctly.");
    });

    QUnit.test("initializeDataModel with changed data", async function (assert) {
        // Arrange
        const oChangeData = {
            visualizations: {
                items: [1, 2, 3],
                totalCount: 99
            }
        };
        this.oComponent.getSelectionModel().setData(oChangeData);

        // Act
        this.oComponent.initializeSelectionModel();

        // Assert
        assert.deepEqual(this.oComponent.getSelectionModel().getData(), this.oExpectedData, "The selection model was initialized correctly.");
    });

    QUnit.module("The resetVisualizations method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("resetVisualizations", async function (assert) {
        // Arrange
        const oExpectedData = {
            visualizations: {
                items: [],
                totalCount: 0
            },
            someOtherPath: "something"
        };
        this.oComponent.getDataModel().setData({
            visualizations: {
                items: ["a", "b", "c"],
                totalCount: 99
            },
            someOtherPath: "something"
        });

        // Act
        this.oComponent.resetVisualizations();

        // Assert
        assert.deepEqual(this.oComponent.getDataModel().getData(), oExpectedData, "The selection model was initialized correctly.");
    });


    QUnit.module("The _initializeSidebarStatus method", {
        beforeEach: async function () {
            this.oInitializeSidebarStatusStub = sandbox.stub(ContentFinderComponent.prototype, "_initializeSidebarStatus");
            this.oUpdateSidebarStatusStub = sandbox.stub(ContentFinderComponent.prototype, "updateSidebarStatus");
            this.oOnUpdateSidebarStatusSpy = sandbox.spy(ContentFinderComponent.prototype, "onUpdateSidebarStatus");
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("_initializeSidebarStatus called", async function (assert) {
        const fnAsync = assert.async();
        const oUiModel = this.oComponent.getUiModel();
        const oDataModel = this.oComponent.getDataModel();
        this.oInitializeSidebarStatusStub.restore();

        assert.strictEqual(this.oUpdateSidebarStatusStub.callCount, 0, "The updateSidebarStatus method was not called yet.");

        this.oComponent._initializeSidebarStatus();

        assert.strictEqual(this.oUpdateSidebarStatusStub.callCount, 1, "The updateSidebarStatus method was called once.");
        assert.strictEqual(this.oOnUpdateSidebarStatusSpy.callCount, 0, "The onUpdateSidebarStatus method was not called yet.");

        oDataModel.setProperty("/categoryTree/length", 5);
        assert.strictEqual(this.oOnUpdateSidebarStatusSpy.callCount, 1, "The onUpdateSidebarStatus method was called.");

        oUiModel.setProperty("/componentSettings/showCategoryTreeWhenEmpty", false);
        assert.strictEqual(this.oOnUpdateSidebarStatusSpy.callCount, 2, "The onUpdateSidebarStatus method was called.");

        oUiModel.setProperty("/maxColumnsCount", 123);
        assert.strictEqual(this.oOnUpdateSidebarStatusSpy.callCount, 3, "The onUpdateSidebarStatus method was called.");

        oUiModel.setProperty("/visualizations/filters/selected", "tomatoes");
        assert.strictEqual(this.oOnUpdateSidebarStatusSpy.callCount, 4, "The onUpdateSidebarStatus method was called.");

        setTimeout(() => {
            assert.strictEqual(this.oUpdateSidebarStatusStub.callCount, 2, "The updateSidebarStatus method was only called twice.");
            fnAsync();
        });
    });

    QUnit.module("The onUpdateSidebarStatus method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();

            // Stub after component was created to ignore the initial calls
            this.oUpdateSidebarStatusStub = sandbox.stub(ContentFinderComponent.prototype, "updateSidebarStatus");
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("onUpdateSidebarStatus called multiple times", async function (assert) {
        const fnAsync = assert.async();

        assert.strictEqual(this.oUpdateSidebarStatusStub.callCount, 0, "The updateSidebarStatus method was not called before.");

        this.oComponent.onUpdateSidebarStatus();

        assert.strictEqual(this.oUpdateSidebarStatusStub.callCount, 0, "The updateSidebarStatus method was not called directly after the function call.");
        assert.ok(this.oComponent.iUpdateSidebarStatusTimeout > 0, "The timeout was set.");

        const iTimeout = this.oComponent.iUpdateSidebarStatusTimeout;
        this.oComponent.onUpdateSidebarStatus();
        assert.strictEqual(this.oComponent.iUpdateSidebarStatusTimeout, iTimeout, "The timeout was not reset yet.");

        setTimeout(() => {
            assert.strictEqual(this.oUpdateSidebarStatusStub.callCount, 1, "The updateSidebarStatus method was only called once.");
            assert.strictEqual(this.oComponent.iUpdateSidebarStatusTimeout, null, "The timeout was reset.");
            fnAsync();
        }, 0);
    });

    QUnit.module("The updateSidebarStatus method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("updateSidebarStatus with default parameters, no data", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setShowCategoryTreeWhenEmpty(true);

        // Act
        this.oComponent.updateSidebarStatus();

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.TwoColumnsMidExpanded, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.TwoColumnsMidExpanded, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), false, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), true, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with layoutType MidColumnFullScreen, no data", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setShowCategoryTreeWhenEmpty(true);

        // Act
        this.oComponent.updateSidebarStatus(LayoutType.MidColumnFullScreen);

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.MidColumnFullScreen, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.MidColumnFullScreen, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), false, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), false, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with layoutType OneColumn, no data", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setShowCategoryTreeWhenEmpty(true);

        // Act
        this.oComponent.updateSidebarStatus(LayoutType.OneColumn);

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.TwoColumnsMidExpanded, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.OneColumn, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), false, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), true, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with default parameters, no data, showCategoryTreeWhenEmpty is false", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setShowCategoryTreeWhenEmpty(false);

        // Act
        this.oComponent.updateSidebarStatus();

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.TwoColumnsMidExpanded, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.MidColumnFullScreen, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), false, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), false, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with layoutType MidColumnFullScreen, no data, showCategoryTreeWhenEmpty is false", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setShowCategoryTreeWhenEmpty(false);

        // Act
        this.oComponent.updateSidebarStatus(LayoutType.MidColumnFullScreen);

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.MidColumnFullScreen, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.MidColumnFullScreen, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), false, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), false, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with layoutType OneColumn, no data, showCategoryTreeWhenEmpty is false", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setShowCategoryTreeWhenEmpty(false);

        // Act
        this.oComponent.updateSidebarStatus(LayoutType.OneColumn);

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.TwoColumnsMidExpanded, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.OneColumn, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), false, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), true, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with default parameters, with data", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setCategoryTree(categoryTreeMock);

        // Act
        this.oComponent.updateSidebarStatus();

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.TwoColumnsMidExpanded, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.TwoColumnsMidExpanded, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), true, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), true, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with layoutType MidColumnFullScreen, with data", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setCategoryTree(categoryTreeMock);

        // Act
        this.oComponent.updateSidebarStatus(LayoutType.MidColumnFullScreen);

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.MidColumnFullScreen, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.MidColumnFullScreen, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), true, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), false, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with layoutType OneColumn, with data", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        this.oComponent.setCategoryTree(categoryTreeMock);

        // Act
        this.oComponent.updateSidebarStatus(LayoutType.OneColumn);

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.TwoColumnsMidExpanded, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.OneColumn, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), true, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), true, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with default parameters, visualization filter selected is 'cards'", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        oUiModel.setProperty("/visualizations/filters/selected", "cards");
        this.oComponent.setCategoryTree(categoryTreeMock);

        // Act
        this.oComponent.updateSidebarStatus();

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.TwoColumnsMidExpanded, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.MidColumnFullScreen, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), true, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), false, "The visible property was set correctly.");
    });

    QUnit.test("updateSidebarStatus with layoutType TwoColumnsMidExpanded and maxColumnCount is 1", async function (assert) {
        // Arrange
        const oUiModel = this.oComponent.getUiModel();
        oUiModel.setProperty("/maxColumnsCount", 1);
        this.oComponent.setCategoryTree(categoryTreeMock);

        // Act
        this.oComponent.updateSidebarStatus(LayoutType.TwoColumnsMidExpanded);

        // Assert
        assert.strictEqual(oUiModel.getProperty("/preservedLayoutType"), LayoutType.TwoColumnsMidExpanded, "The preservedLayoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/layoutType"), LayoutType.TwoColumnsMidExpanded, "The layoutType property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/hasData"), true, "The hasData property was set correctly.");
        assert.strictEqual(oUiModel.getProperty("/categoryTree/visible"), false, "The visible property was set correctly.");
    });


    QUnit.module("The _prepareVisualizations method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();

            this.oVisualization = {
                id: "vizId1",
                type: "myType",
                systemLabel: "mySystemLabel",
                descriptor: {
                    value: {
                        "sap.app": {
                            id: "appId1",
                            title: "myTitle",
                            subTitle: "mySubTitle",
                            info: "myInfo"
                        },
                        "sap.fiori": {
                            registrationIds: ["regId1"]
                        },
                        "sap.flp": {
                            target: "123"
                        },
                        "sap.ui": {
                            icons: {
                                icon: "sap-icon://add"
                            }
                        }
                    }
                },
                targetAppIntent: {
                    action: "myAction",
                    semanticObject: "mySemanticObject"
                }
            };

            this.oExpectedVisualization = {
                id: "vizId1",
                appId: "regId1",
                icon: "sap-icon://add",
                info: "myInfo",
                launchUrl: "#mySemanticObject-myAction?sap-ui-app-id-hint=null",
                subtitle: "mySubTitle",
                title: "myTitle",
                type: "myType",
                dataHelpId: "vizId1",
                vizData: {
                    id: "vizId1",
                    type: "myType",
                    systemLabel: "mySystemLabel",
                    descriptor: {
                        value: {
                            "sap.app": {
                                id: "appId1",
                                title: "myTitle",
                                subTitle: "mySubTitle",
                                info: "myInfo"
                            },
                            "sap.fiori": {
                                registrationIds: [
                                    "regId1"
                                ]
                            },
                            "sap.flp": {
                                target: "123"
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://add"
                                }
                            }
                        }
                    },
                    targetAppIntent: {
                        action: "myAction",
                        semanticObject: "mySemanticObject"
                    }
                },
                added: false,
                systemLabel: "mySystemLabel"
            };

        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("Call _prepareVisualizations with default visualization", async function (assert) {
        // Act
        const aResult = this.oComponent._prepareVisualizations([this.oVisualization]);

        // Assert
        assert.deepEqual(aResult, [this.oExpectedVisualization], "The visualizations were prepared correctly.");
    });

    QUnit.test("Call _prepareVisualizations visualization - no registrationId, but use appId", async function (assert) {
        // Arrange
        this.oVisualization.descriptor.value["sap.fiori"].registrationIds = [];
        this.oExpectedVisualization.appId = "appId1";
        this.oExpectedVisualization.vizData.descriptor.value["sap.fiori"].registrationIds = [];

        // Act
        const aResult = this.oComponent._prepareVisualizations([this.oVisualization]);

        // Assert
        assert.deepEqual(aResult, [this.oExpectedVisualization], "The visualizations were prepared correctly.");
    });

    QUnit.test("Call _prepareVisualizations visualization - no descriptor", async function (assert) {
        // Arrange
        this.oVisualization.descriptor = undefined;
        const oLogErrorSpy = sandbox.spy(Log, "error");

        // Act
        const aResult = this.oComponent._prepareVisualizations([this.oVisualization]);

        // Assert
        assert.deepEqual(aResult, [], "The result is empty.");
        assert.strictEqual(
            oLogErrorSpy.calledWith("No descriptor available. Cannot load this visualization.", null, "sap.ushell.components.ContentFinder.Component"),
            true,
            "The error was logged correctly."
        );
    });

    QUnit.test("Call _prepareVisualizations visualization - no descriptor value", async function (assert) {
        // Arrange
        this.oVisualization.descriptor.value = undefined;
        const oLogErrorSpy = sandbox.spy(Log, "error");

        // Act
        const aResult = this.oComponent._prepareVisualizations([this.oVisualization]);

        // Assert
        assert.deepEqual(aResult, [], "The result is empty.");
        assert.strictEqual(
            oLogErrorSpy.calledWith("No descriptor available. Cannot load this visualization.", null, "sap.ushell.components.ContentFinder.Component"),
            true,
            "The error was logged correctly."
        );
    });

    QUnit.module("The setVisualizationsFilters method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();

            // Stub after component was created to ignore the initial calls
            this.oUiModelSetPropertyStub = sandbox.stub();
            sandbox.stub(ContentFinderComponent.prototype, "getUiModel").returns({
                setProperty: this.oUiModelSetPropertyStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("Call setVisualizationsFilters with values", async function (assert) {
        // Arrange
        const oVisualizationsFilters = {
            displayed: ["some", "filter"],
            selected: "some",
            available: ["some"]
        };

        // Act
        this.oComponent.setVisualizationsFilters(oVisualizationsFilters);

        // Assert
        assert.deepEqual(this.oUiModelSetPropertyStub.getCall(0).args, ["/visualizations/filters/available", oVisualizationsFilters.available], "The data was set correctly.");
        assert.deepEqual(this.oUiModelSetPropertyStub.getCall(1).args, ["/visualizations/filters/displayed", oVisualizationsFilters.displayed], "The data was set correctly.");
        assert.deepEqual(this.oUiModelSetPropertyStub.getCall(2).args, ["/visualizations/filters/selected", oVisualizationsFilters.selected], "The data was set correctly.");
    });
});

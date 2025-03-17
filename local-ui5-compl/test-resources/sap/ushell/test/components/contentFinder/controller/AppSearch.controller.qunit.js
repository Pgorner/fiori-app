// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.contentFinder.controller.AppSearch.controller
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/components/contentFinder/controller/AppSearch.controller",
    "sap/ushell/utils/WindowUtils",
    "sap/f/library",
    "sap/m/library"
], function (
    Log,
    JSONModel,
    Filter,
    FilterOperator,
    hasher,
    AppSearchController,
    WindowUtils,
    fLibrary,
    mLibrary
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();
    const LayoutType = fLibrary.LayoutType;

    QUnit.module("The onInit method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oExpectedUiModel = { a: "b" };
            this.oStubs = {
                controller: {
                    attachStateChange: sandbox.stub(),
                    getView: {
                        setModel: sandbox.stub()
                    },
                    _initializeVisualizationsFilter: sandbox.stub()
                },
                component: {
                    getModel: sandbox.stub(),
                    getUiModel: sandbox.stub(),
                    getDataModel: sandbox.stub(),
                    getSelectionModel: sandbox.stub()
                },
                resourceBundle: sandbox.stub()
            };
            this.oStubs.component.getModel.withArgs("i18n").returns({
                getResourceBundle: this.oStubs.resourceBundle
            });
            this.oStubs.component.getUiModel.returns(this.oExpectedUiModel);
            sandbox.stub(this.oAppSearchController, "getOwnerComponent")
                .returns(this.oStubs.component);
            sandbox.stub(this.oAppSearchController, "byId")
                .withArgs("contentFinderAppSearchFlexibleColumnLayout")
                .returns({
                    attachStateChange: this.oStubs.controller.attachStateChange
                });
            sandbox.stub(this.oAppSearchController, "getView").returns(this.oStubs.controller.getView);
            sandbox.stub(this.oAppSearchController, "_initializeVisualizationsFilter")
                .returns(this.oStubs.controller._initializeVisualizationsFilter);
        },
        afterEach: function () {
            this.oAppSearchController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onInit called", function (assert) {
        // Act
        this.oAppSearchController.onInit();

        // Assert
        assert.strictEqual(this.oStubs.resourceBundle.callCount, 1, "ResourceBundle was set.");
        assert.strictEqual(this.oStubs.component.getUiModel.callCount, 1, "UiModel was set.");
        assert.strictEqual(this.oStubs.component.getDataModel.callCount, 1, "DataModel was set.");
        assert.strictEqual(this.oStubs.component.getSelectionModel.callCount, 1, "SelectionModel was set.");
        assert.strictEqual(
            this.oStubs.controller.attachStateChange.callCount,
            1,
            "attachStateChange of the 'FlexibleColumnLayout' was called."
        );
        assert.strictEqual(this.oStubs.controller.getView.setModel.callCount, 1, "The view model was set.");
        assert.deepEqual(
            this.oStubs.controller.getView.setModel.firstCall.args,
            [this.oExpectedUiModel, "ui"],
            "The view model was set with the correct arguments."
        );
    });

    QUnit.module("onFlexibleColumnLayoutStateChange method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oSetPropertyStub = sandbox.stub();
            this.oAppSearchController.oUiModel = {
                setProperty: this.oSetPropertyStub
            };
            this.oGetParameterStub = sandbox.stub();
            this.oEvent = {
                getParameter: this.oGetParameterStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("onFlexibleColumnLayoutStateChange called with 'maxColumnsCount'", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("maxColumnsCount").returns(2);

        // Act
        this.oAppSearchController.onFlexibleColumnLayoutStateChange(this.oEvent);

        // Assert
        assert.ok(this.oSetPropertyStub.calledWith("/maxColumnsCount", 2), "'maxColumnsCount' was updated correctly.");
    });

    QUnit.module("onSelectVisualizationsFilter method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oStubs = {
                component: {
                    resetVisualizations: sandbox.stub(),
                    queryVisualizations: sandbox.stub()
                },
                model: {
                    ui: {
                        getProperty: sandbox.stub()
                    }
                }
            };
            this.oAppSearchController.oComponent = this.oStubs.component;
            this.oAppSearchController.oUiModel = this.oStubs.model.ui;

            this.sSearchTerm = "Test Search Term";
            this.sCategoryId = "My Category";
            this.oStubs.model.ui.getProperty.withArgs("/visualizations/searchTerm").returns(this.sSearchTerm);
            this.oStubs.model.ui.getProperty.withArgs("/categoryTree/selectedId").returns(this.sCategoryId);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("onSelectVisualizationsFilter called", function (assert) {
        // Act
        this.oAppSearchController.onSelectVisualizationsFilter();

        // Assert
        assert.strictEqual(this.oStubs.component.resetVisualizations.callCount, 1, "resetVisualizations was called once.");
        assert.strictEqual(this.oStubs.component.queryVisualizations.callCount, 1, "queryVisualizations was called once.");
        assert.deepEqual(this.oStubs.component.queryVisualizations.firstCall.args, [0, this.sSearchTerm, this.sCategoryId], "queryVisualizations was called with the correct arguments.");
    });

    QUnit.module("The onSearch method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oStubs = {
                controller: {
                    toggleSelectionView: sandbox.stub(this.oAppSearchController, "toggleSelectionView")
                },
                component: {
                    resetVisualizations: sandbox.stub(),
                    queryVisualizations: sandbox.stub()
                },
                event: {
                    getParameter: sandbox.stub()
                },
                model: {
                    ui: {
                        getProperty: sandbox.stub(),
                        setProperty: sandbox.stub()
                    }
                }
            };
            this.oAppSearchController.oComponent = this.oStubs.component;
            this.oAppSearchController.oUiModel = this.oStubs.model.ui;
            this.sSearchTerm = "Test Search Term";
        },
        afterEach: function () {
            this.oAppSearchController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onSearch called with query", function (assert) {
        // Arrange
        this.oAppSearchController.sCurrentSearchTerm = "Search Term before";
        this.oStubs.model.ui.getProperty.withArgs("/categoryTree/selectedId").returns();
        this.oStubs.event.getParameter.withArgs("query").returns(this.sSearchTerm);

        // Act
        this.oAppSearchController.onSearch(this.oStubs.event);

        // Assert
        assert.ok(this.oStubs.component.resetVisualizations.calledOnce, "resetVisualizations was called once.");
        assert.ok(this.oStubs.controller.toggleSelectionView.calledOnce, "toggleSelectionView was called once.");
        assert.strictEqual(this.oStubs.controller.toggleSelectionView.firstCall.args[0], false, "toggleSelectionView was called with the expected argument.");
        assert.ok(this.oStubs.component.queryVisualizations.calledOnce, "queryVisualizations was called once.");
        assert.deepEqual(this.oStubs.component.queryVisualizations.firstCall.args, [0, "Test Search Term", undefined], "queryVisualizations was called with the expected arguments.");
        assert.deepEqual(this.oStubs.model.ui.setProperty.firstCall.args, ["/visualizations/searchTerm", this.sSearchTerm], "Search term in the model is updated.");
        assert.strictEqual(this.oAppSearchController.sCurrentSearchTerm, this.sSearchTerm, "Search term in the controller is updated.");
    });

    QUnit.test("onSearch called with empty query", function (assert) {
        // Arrange
        const sSelectedCategoryId = "selectedCategory1";
        this.oAppSearchController.sCurrentSearchTerm = "Search Term before";
        this.oStubs.model.ui.getProperty.withArgs("/categoryTree/selectedId").returns(sSelectedCategoryId);
        this.oStubs.event.getParameter.withArgs("query").returns();

        // Act
        this.oAppSearchController.onSearch(this.oStubs.event);

        // Assert
        assert.ok(this.oStubs.component.resetVisualizations.calledOnce, "resetVisualizations was called once.");
        assert.ok(this.oStubs.controller.toggleSelectionView.calledOnce, "toggleSelectionView was called once.");
        assert.strictEqual(this.oStubs.controller.toggleSelectionView.firstCall.args[0], false, "toggleSelectionView was called with the expected argument.");
        assert.ok(this.oStubs.component.queryVisualizations.calledOnce, "queryVisualizations was called once.");
        assert.deepEqual(this.oStubs.component.queryVisualizations.firstCall.args, [0, "", sSelectedCategoryId], "queryVisualizations was called with the expected arguments.");
        assert.deepEqual(this.oStubs.model.ui.setProperty.firstCall.args, ["/visualizations/searchTerm", ""], "Search term in the model is updated.");
        assert.strictEqual(this.oAppSearchController.sCurrentSearchTerm, "", "Search term in the controller is updated.");
    });

    QUnit.test("onSearch called with query and selected categoryId", function (assert) {
        // Arrange
        const sSelectedCategoryId = "selectedCategory1";
        this.oAppSearchController.sCurrentSearchTerm = "Search Term before";
        this.oStubs.model.ui.getProperty.withArgs("/categoryTree/selectedId").returns(sSelectedCategoryId);
        this.oStubs.event.getParameter.withArgs("query").returns(this.sSearchTerm);

        // Act
        this.oAppSearchController.onSearch(this.oStubs.event);

        // Assert
        assert.ok(this.oStubs.component.resetVisualizations.calledOnce, "resetVisualizations was called once.");
        assert.ok(this.oStubs.controller.toggleSelectionView.calledOnce, "toggleSelectionView was called once.");
        assert.strictEqual(this.oStubs.controller.toggleSelectionView.firstCall.args[0], false, "toggleSelectionView was called with the expected argument.");
        assert.ok(this.oStubs.component.queryVisualizations.calledOnce, "queryVisualizations was called once.");
        assert.deepEqual(this.oStubs.component.queryVisualizations.firstCall.args, [0, "Test Search Term", sSelectedCategoryId], "queryVisualizations was called with the expected arguments.");
        assert.deepEqual(this.oStubs.model.ui.setProperty.firstCall.args, ["/visualizations/searchTerm", this.sSearchTerm], "Search term in the model is updated.");
        assert.strictEqual(this.oAppSearchController.sCurrentSearchTerm, this.sSearchTerm, "Search term in the controller is updated.");
    });

    // @TODO tests for onCatalogSearch

    QUnit.module("The onAppBoxSelected method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oStubs = {
                controller: {
                    toggleSelectionView: sandbox.stub(this.oAppSearchController, "toggleSelectionView")
                },
                component: {
                    addVisualizations: sandbox.stub()
                },
                event: {
                    getParameter: sandbox.stub(),
                    getSource: sandbox.stub()
                },
                model: {
                    ui: {
                        getProperty: sandbox.stub(),
                        setProperty: sandbox.stub()
                    },
                    selection: {
                        getProperty: sandbox.stub(),
                        setProperty: sandbox.stub()
                    }
                },
                listGetMode: sandbox.stub()
            };
            this.oAppSearchController.oComponent = this.oStubs.component;
            this.oAppSearchController.oUiModel = this.oStubs.model.ui;
            this.oAppSearchController.oSelectionModel = this.oStubs.model.selection;

            this.oStubs.event.getSource.returns({ getMode: this.oStubs.listGetMode });

            this.oListItemMock = {
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/visualizations/items/0"),
                    getObject: sandbox.stub().returns({ id: "id1" })
                })
            };
            this.aListItemsMock = [
                {
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/visualizations/items/0"),
                        getObject: sandbox.stub().returns({ id: "id1" })
                    })
                },
                {
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/visualizations/items/1"),
                        getObject: sandbox.stub().returns({ id: "id2" })
                    })
                }
            ];
            this.aListItems = [
                { id: "id1", index: 0 },
                { id: "id2", index: 1 }
            ];
        },
        afterEach: function () {
            this.oAppSearchController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onAppBoxSelected called with list mode MultiSelect, item selected, nothing selected before", function (assert) {
        // Arrange
        this.oStubs.listGetMode.returns(mLibrary.ListMode.MultiSelect);
        this.oStubs.event.getParameter.withArgs("selected").returns(true);
        const oSelectedItemBefore = { id: "id3", index: 2 };
        this.oStubs.model.selection.getProperty.withArgs("/visualizations/items").returns([oSelectedItemBefore]);
        this.oStubs.model.selection.getProperty.withArgs("/visualizations/items/length").returns(3);
        this.oStubs.event.getParameter.withArgs("listItems").returns(this.aListItemsMock);

        // Act
        this.oAppSearchController.onAppBoxSelected(this.oStubs.event);

        // Assert
        assert.deepEqual(this.oStubs.model.selection.setProperty.firstCall.args, ["/visualizations/items", [].concat(this.aListItems, oSelectedItemBefore) ], "The expected items were set");
        assert.strictEqual(this.oStubs.controller.toggleSelectionView.callCount, 0, "toggleSelectionView was not called.");
    });

    QUnit.test("onAppBoxSelected called with list mode MultiSelect, item selected, items were selected before, sorts the items", function (assert) {
        // Arrange
        this.oStubs.listGetMode.returns(mLibrary.ListMode.MultiSelect);
        this.oStubs.event.getParameter.withArgs("selected").returns(true);
        this.oStubs.model.selection.getProperty.withArgs("/visualizations/items").returns([]);
        this.oStubs.model.selection.getProperty.withArgs("/visualizations/items/length").returns(2);
        this.oStubs.event.getParameter.withArgs("listItems").returns(this.aListItemsMock);

        // Act
        this.oAppSearchController.onAppBoxSelected(this.oStubs.event);

        // Assert
        assert.deepEqual(this.oStubs.model.selection.setProperty.firstCall.args, ["/visualizations/items", this.aListItems ], "The expected items were set");
        assert.strictEqual(this.oStubs.controller.toggleSelectionView.callCount, 0, "toggleSelectionView was not called.");
    });

    QUnit.test("onAppBoxSelected called with list mode MultiSelect, item unselected", function (assert) {
        // Arrange
        this.oStubs.listGetMode.returns(mLibrary.ListMode.MultiSelect);
        this.oStubs.event.getParameter.withArgs("selected").returns(false);
        this.oStubs.model.selection.getProperty.withArgs("/visualizations/items").returns(this.aListItems);
        this.oStubs.model.selection.getProperty.withArgs("/visualizations/items/length").returns(1);
        this.oStubs.event.getParameter.withArgs("listItems").returns([this.oListItemMock]);

        // Act
        this.oAppSearchController.onAppBoxSelected(this.oStubs.event);

        // Assert
        assert.deepEqual(this.oStubs.model.selection.setProperty.firstCall.args, ["/visualizations/items", [this.aListItems[1]] ], "The expected items were set");
        assert.strictEqual(this.oStubs.controller.toggleSelectionView.callCount, 0, "toggleSelectionView was not called.");
    });

    QUnit.test("onAppBoxSelected called with list mode MultiSelect, all items unselected", function (assert) {
        // Arrange
        this.oStubs.listGetMode.returns(mLibrary.ListMode.MultiSelect);
        this.oStubs.event.getParameter.withArgs("selected").returns(false);
        this.oStubs.model.selection.getProperty.withArgs("/visualizations/items").returns(this.aListItems);
        this.oStubs.model.selection.getProperty.withArgs("/visualizations/items/length").returns(0);
        this.oStubs.event.getParameter.withArgs("listItems").returns(this.aListItemsMock);

        // Act
        this.oAppSearchController.onAppBoxSelected(this.oStubs.event);

        // Assert
        assert.deepEqual(this.oStubs.model.selection.setProperty.firstCall.args, ["/visualizations/items", [] ], "The expected items were set");
        assert.strictEqual(this.oStubs.controller.toggleSelectionView.callCount, 1, "toggleSelectionView was called once.");
    });

    QUnit.test("onAppBoxSelected called with list mode SingleSelectMaster (used for cards)", function (assert) {
        // Arrange
        this.oStubs.listGetMode.returns(mLibrary.ListMode.SingleSelectMaster);
        this.oStubs.event.getParameter.withArgs("listItem").returns(this.oListItemMock);

        // Act
        this.oAppSearchController.onAppBoxSelected(this.oStubs.event);

        // Assert
        assert.strictEqual(this.oStubs.component.addVisualizations.callCount, 1, "addVisualizations was called once.");
        assert.deepEqual(this.oStubs.component.addVisualizations.firstCall.args, [[{id: "id1"}]], "addVisualizations was called with the expected arguments.");
    });

    QUnit.module("The onUpdateStarted method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oStubs = {
                component: {
                    queryVisualizations: sandbox.stub()
                },
                event: {
                    getParameter: sandbox.stub()
                },
                model: {
                    ui: {
                        getProperty: sandbox.stub()
                    }
                }
            };
            this.oAppSearchController.oComponent = this.oStubs.component;
            this.oAppSearchController.oUiModel = this.oStubs.model.ui;
        },
        afterEach: function () {
            this.oAppSearchController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onUpdateStarted calls queryVisualizations with the expected parameters", function (assert) {
        // Arrange
        const iSkip = 5;
        const sSearchTerm = "Test Search Term";
        const sCategoryId = "selectedCategory1";
        this.oStubs.model.ui.getProperty.withArgs("/visualizations/searchTerm").returns(sSearchTerm);
        this.oStubs.model.ui.getProperty.withArgs("/categoryTree/selectedId").returns(sCategoryId);
        this.oStubs.event.getParameter
            .withArgs("reason").returns("Growing")
            .withArgs("actual").returns(iSkip);

        // Act
        this.oAppSearchController.onUpdateStarted(this.oStubs.event);

        // Assert
        assert.ok(this.oStubs.component.queryVisualizations.calledOnce, "queryVisualizations was called once.");
        assert.deepEqual(this.oStubs.component.queryVisualizations.firstCall.args, [iSkip, sSearchTerm, sCategoryId], "queryVisualizations was called with the expected arguments.");
    });

    QUnit.test("onUpdateStarted does not call queryVisualizations", function (assert) {
        // Arrange
        this.oStubs.event.getParameter.withArgs("reason").returns("somethingElse");

        // Act
        this.oAppSearchController.onUpdateStarted(this.oStubs.event);

        // Assert
        assert.strictEqual(this.oStubs.component.queryVisualizations.callCount, 0, "queryVisualizations was not called.");
    });


    QUnit.module("The onShowSelectedPressed method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oToggleSelectionViewStub = sandbox.stub(this.oAppSearchController, "toggleSelectionView");
            this.oEvent = {
                getParameter: sandbox.stub()
            };

        },
        afterEach: function () {
            this.oAppSearchController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onShowSelectedPressed called and button is 'pressed'", function (assert) {
        // Arrange
        this.oEvent.getParameter.withArgs("pressed").returns(true);

        // Act
        this.oAppSearchController.onShowSelectedPressed(this.oEvent);

        // Assert
        assert.ok(this.oToggleSelectionViewStub.calledOnce, "toggleSelectionView was called once.");
        assert.strictEqual(this.oToggleSelectionViewStub.firstCall.args[0], true, "oToggleSelectionViewStub was called with the expected argument.");
    });

    QUnit.test("onShowSelectedPressed called and button is not 'pressed'", function (assert) {
        // Arrange
        this.oEvent.getParameter.withArgs("pressed").returns(false);

        // Act
        this.oAppSearchController.onShowSelectedPressed(this.oEvent);

        // Assert
        assert.ok(this.oToggleSelectionViewStub.calledOnce, "toggleSelectionView was called once.");
        assert.strictEqual(this.oToggleSelectionViewStub.firstCall.args[0], false, "oToggleSelectionViewStub was called with the expected argument.");
    });

    // @TODO tests for onViewSelectionChange

    QUnit.module("The toggleSelectionView method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oStubs = {
                component: {
                    useSelectionModel: sandbox.stub()
                },
                model: {
                    ui: {
                        setProperty: sandbox.stub()
                    }
                }
            };
            this.oAppSearchController.oComponent = this.oStubs.component;
            this.oAppSearchController.oUiModel = this.oStubs.model.ui;
            this.sSearchTerm = "Test Search Term";
            this.oAppSearchController.sCurrentSearchTerm = this.sSearchTerm;

        },
        afterEach: function () {
            this.oAppSearchController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("sets the Selection model if called with true", function (assert) {
        // Act
        this.oAppSearchController.toggleSelectionView(true);

        // Assert
        assert.strictEqual(this.oStubs.model.ui.setProperty.callCount, 2, "setProperty was called twice.");
        assert.deepEqual(this.oStubs.model.ui.setProperty.firstCall.args, ["/visualizations/searchFieldValue", ""], "setProperty was called once.");
        assert.deepEqual(this.oStubs.model.ui.setProperty.secondCall.args, ["/visualizations/showSelectedPressed", true], "setProperty was called once.");
        assert.strictEqual(this.oStubs.component.useSelectionModel.callCount, 1, "useSelectionModel was called once.");
        assert.deepEqual(this.oStubs.component.useSelectionModel.firstCall.args, [true], "useSelectionModel was called with the expected argument.");
    });

    QUnit.test("sets the Selection model if called with false", function (assert) {
        // Act
        this.oAppSearchController.toggleSelectionView(false);

        // Assert
        assert.strictEqual(this.oStubs.model.ui.setProperty.callCount, 2, "setProperty was called twice.");
        assert.deepEqual(this.oStubs.model.ui.setProperty.firstCall.args, ["/visualizations/searchFieldValue", this.sSearchTerm], "setProperty was called once.");
        assert.deepEqual(this.oStubs.model.ui.setProperty.secondCall.args, ["/visualizations/showSelectedPressed", false], "setProperty was called once.");
        assert.strictEqual(this.oStubs.component.useSelectionModel.callCount, 1, "useSelectionModel was called once.");
        assert.deepEqual(this.oStubs.component.useSelectionModel.firstCall.args, [false], "useSelectionModel was called with the expected argument.");
    });

    QUnit.module("The resetVisualizationsSearchField method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oUiModelSetPropertyStub = sandbox.stub();
            this.oAppSearchController.oUiModel = {
                setProperty: this.oUiModelSetPropertyStub
            };
            this.oAppSearchController.sCurrentSearchTerm = "An existing search term";

        },
        afterEach: function () {
            this.oAppSearchController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("resetVisualizationsSearchField called", function (assert) {
        // Act
        this.oAppSearchController.resetVisualizationsSearchField(true);

        // Assert
        assert.strictEqual(this.oAppSearchController.sCurrentSearchTerm, "", "Search term in the controller is reset.");
        assert.ok(this.oUiModelSetPropertyStub.calledTwice, "setProperty was called twice.");
        assert.deepEqual(this.oUiModelSetPropertyStub.firstCall.args, ["/visualizations/searchTerm", ""], "setProperty was called with the expected arguments.");
        assert.deepEqual(this.oUiModelSetPropertyStub.secondCall.args, ["/visualizations/searchFieldValue", ""], "setProperty was called with the expected arguments.");
    });

    // @TODO tests for onCategoryTreeItemPressed
    // @TODO tests for onCategoryTreeUpdateFinished

    QUnit.module("The onCategoryTreeTogglePressed method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oUiModelGetPropertyStub = sandbox.stub();
            this.oAppSearchController.oUiModel = {
                getProperty: this.oUiModelGetPropertyStub
            };
            this.oUpdateSidebarStatusStub = sandbox.stub();
            this.oAppSearchController.oComponent = {
                updateSidebarStatus: this.oUpdateSidebarStatusStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("called with 'MidColumnFullScreen' and 'maxColumnsCount' less than 2", function (assert) {
        // Arrange
        this.oUiModelGetPropertyStub.withArgs("/layoutType").returns(LayoutType.MidColumnFullScreen);
        this.oUiModelGetPropertyStub.withArgs("/maxColumnsCount").returns(1);

        // Act
        this.oAppSearchController.onCategoryTreeTogglePressed();

        // Assert
        assert.ok(this.oUpdateSidebarStatusStub.calledWith(LayoutType.OneColumn), "The new 'layoutType' is 'OneColumn'.");
    });

    QUnit.test("called with 'MidColumnFullScreen' and 'maxColumnsCount' that equals 2", function (assert) {
        // Arrange
        this.oUiModelGetPropertyStub.withArgs("/layoutType").returns(LayoutType.MidColumnFullScreen);
        this.oUiModelGetPropertyStub.withArgs("/maxColumnsCount").returns(2);

        // Act
        this.oAppSearchController.onCategoryTreeTogglePressed();

        // Assert
        assert.ok(this.oUpdateSidebarStatusStub.calledWith(LayoutType.TwoColumnsMidExpanded), "The new 'layoutType' is 'TwoColumnsMidExpanded'.");
    });

    QUnit.test("called with 'TwoColumnsMidExpanded' and 'maxColumnsCount' that equals 1", function (assert) {
        // Arrange
        this.oUiModelGetPropertyStub.withArgs("/layoutType").returns(LayoutType.TwoColumnsMidExpanded);
        this.oUiModelGetPropertyStub.withArgs("/maxColumnsCount").returns(1);
        // Act
        this.oAppSearchController.onCategoryTreeTogglePressed();

        // Assert
        assert.ok(this.oUpdateSidebarStatusStub.calledWith(LayoutType.OneColumn), "The new 'layoutType' is 'OneColumn'.");
    });

    QUnit.test("called with 'TwoColumnsMidExpanded' and 'maxColumnsCount' that is greater than 1", function (assert) {
        // Arrange
        this.oUiModelGetPropertyStub.withArgs("/layoutType").returns(LayoutType.TwoColumnsMidExpanded);
        this.oUiModelGetPropertyStub.withArgs("/maxColumnsCount").returns(2);
        // Act
        this.oAppSearchController.onCategoryTreeTogglePressed();

        // Assert
        assert.ok(this.oUpdateSidebarStatusStub.calledWith(LayoutType.MidColumnFullScreen), "The new 'layoutType' is 'MidColumnFullScreen'.");
    });

    QUnit.test("called with 'OneColumn' and 'maxColumnsCount' is any number", function (assert) {
        // Arrange
        this.oUiModelGetPropertyStub.withArgs("/layoutType").returns(LayoutType.TwoColumnsMidExpanded);
        this.oUiModelGetPropertyStub.withArgs("/maxColumnsCount").returns(2);

        // Act
        this.oAppSearchController.onCategoryTreeTogglePressed();

        // Assert
        assert.ok(this.oUpdateSidebarStatusStub.calledWith(LayoutType.MidColumnFullScreen), "The new 'layoutType' is 'MidColumnFullScreen'.");
    });

    QUnit.module("The onLaunchApplicationPressed method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oGetObjectStub = sandbox.stub().returns({
                launchUrl: this.sLaunchUrl
            });
            this.oAppboxMock = {
                getBindingContext: sandbox.stub().returns({
                    getObject: this.oGetObjectStub
                })
            };
            this.oEvent = {
                getSource: sandbox.stub().returns(this.oAppboxMock)
            };

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Call with launchUrl consisting of #", function (assert) {
        // Arrange
        const sLaunchUrl = "#Open-me";
        this.oGetObjectStub.returns({
            launchUrl: sLaunchUrl
        });

        const oHasherStub = sandbox.stub(hasher, "setHash");

        // Act
        this.oAppSearchController.onLaunchApplicationPressed(this.oEvent);

        // Assert
        assert.ok(oHasherStub.calledOnce, "setHash was called once");
        assert.deepEqual(oHasherStub.firstCall.args, [sLaunchUrl], "setHash was called with the expected arguments.");
    });

    QUnit.test("Call with launchUrl consisting of URL", function (assert) {
        // Arrange
        const sLaunchUrl = "www.sap.com";
        this.oGetObjectStub.returns({
            launchUrl: sLaunchUrl
        });

        const oWindowUtilStub = sandbox.stub(WindowUtils, "openURL");

        // Act
        this.oAppSearchController.onLaunchApplicationPressed(this.oEvent);

        // Assert
        assert.ok(oWindowUtilStub.calledOnce, "openURL was called once");
        assert.deepEqual(oWindowUtilStub.firstCall.args, [sLaunchUrl, "_blank"], "openURL was called with the expected arguments.");
    });

    QUnit.test("Call with empty launchUrl", function (assert) {
        // Arrange
        const sLaunchUrl = "";
        this.oGetObjectStub.returns({
            launchUrl: sLaunchUrl
        });

        const oLogInfoStub = sandbox.stub(Log, "info");
        const oWindowUtilStub = sandbox.stub(WindowUtils, "openURL");
        const oHasherStub = sandbox.stub(hasher, "setHash");

        // Act
        this.oAppSearchController.onLaunchApplicationPressed(this.oEvent);

        // Assert
        assert.strictEqual(oLogInfoStub.callCount, 1, "Log.info was called once");
        assert.deepEqual(
            oLogInfoStub.firstCall.args,
            [ "AppBox url property is not set.", null, "sap.ushell.components.Catalog.controller" ],
            "Log.info was called with the expected arguments."
        );
        assert.strictEqual(oWindowUtilStub.callCount, 0, "openURL was not called");
        assert.strictEqual(oHasherStub.callCount, 0, "setHash was not called");
    });

    QUnit.module("The onUpdateVisualizationsFilterData method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oUpdateVisualizationsFilterStub = sandbox.stub(this.oAppSearchController, "_updateVisualizationsFilter");
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("onUpdateVisualizationsFilterData called multiple times", function (assert) {
        const fnAsync = assert.async();

        assert.strictEqual(this.oUpdateVisualizationsFilterStub.callCount, 0, "The onUpdateVisualizationsFilterData method was not called before.");

        this.oAppSearchController.onUpdateVisualizationsFilterData();

        assert.strictEqual(this.oUpdateVisualizationsFilterStub.callCount,
            0,
            "The onUpdateVisualizationsFilterData method was not called directly after the function call."
        );
        assert.ok(this.oAppSearchController.iVisualizationsFilterDataTimeout > 0, "The timeout was set.");

        const iTimeout = this.oAppSearchController.iVisualizationsFilterDataTimeout;
        this.oAppSearchController.onUpdateVisualizationsFilterData();
        assert.strictEqual(this.oAppSearchController.iVisualizationsFilterDataTimeout, iTimeout, "The timeout was not reset yet.");

        setTimeout(() => {
            assert.strictEqual(this.oUpdateVisualizationsFilterStub.callCount, 1, "The onUpdateVisualizationsFilterData method was only called once.");
            assert.strictEqual(this.oAppSearchController.iVisualizationsFilterDataTimeout, null, "The timeout was reset.");
            fnAsync();
        }, 0);
    });

    QUnit.module("The _initializeVisualizationsFilter method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oUiModel = new JSONModel({
                visualizations: {
                    filters: {
                        displayed: ["a"],
                        available: ["a", "b"]
                    }
                }
            });
            this.oAppSearchController.oUiModel = this.oUiModel;
            this.oOnUpdateVisualizationsFilterDataStub = sandbox.stub(this.oAppSearchController, "onUpdateVisualizationsFilterData");
            this.oUpdateVisualizationsFilterStub = sandbox.stub(this.oAppSearchController, "_updateVisualizationsFilter");


        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("_initializeVisualizationsFilter called", function (assert) {
        const fnAsync = assert.async();

        assert.strictEqual(this.oOnUpdateVisualizationsFilterDataStub.callCount, 0, "The onUpdateVisualizationsFilterData method was not called yet.");

        this.oAppSearchController._initializeVisualizationsFilter();

        assert.strictEqual(this.oUpdateVisualizationsFilterStub.callCount, 1, "The _updateVisualizationsFilter method was called once.");
        assert.strictEqual(this.oOnUpdateVisualizationsFilterDataStub.callCount, 0, "The onUpdateVisualizationsFilterData method was not called yet.");

        this.oUiModel.setProperty("/visualizations/filters/displayed", ["x"]);
        assert.strictEqual(this.oOnUpdateVisualizationsFilterDataStub.callCount, 1, "The onUpdateVisualizationsFilterData method was called.");

        this.oUiModel.setProperty("/visualizations/filters/displayed", ["x", "y"]);
        assert.strictEqual(this.oOnUpdateVisualizationsFilterDataStub.callCount, 2, "The onUpdateVisualizationsFilterData method was called.");

        setTimeout(() => {
            assert.strictEqual(this.oOnUpdateVisualizationsFilterDataStub.callCount, 2, "The onUpdateVisualizationsFilterData method was only called twice.");
            fnAsync();
        });
    });

    QUnit.module("The _updateVisualizationsFilter method", {
        beforeEach: function () {
            this.oAppSearchController = new AppSearchController();
            this.oByIdStub = sandbox.stub(this.oAppSearchController, "byId");
            this.oUiModelGetPropertyStub = sandbox.stub();
            this.oAppSearchController.oUiModel = {
                getProperty: this.oUiModelGetPropertyStub
            };
            this.oBindingFilterStub = sandbox.stub();
            this.oByIdStub.withArgs("selectVisualizationsFilter").returns({
                getBinding: sandbox.stub().withArgs("items").returns({
                    filter: this.oBindingFilterStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("_updateVisualizationsFilter called", function (assert) {
        // Arrange
        this.oUiModelGetPropertyStub.withArgs("/visualizations/filters/displayed").returns(["c", "b"]);
        const oExpectedFilter = new Filter([
            new Filter("key", FilterOperator.EQ, "c"),
            new Filter("key", FilterOperator.EQ, "b")
        ]);

        // Act
        this.oAppSearchController._updateVisualizationsFilter();

        // Assert
        assert.deepEqual(this.oBindingFilterStub.firstCall.args[0], oExpectedFilter, "The filter was set correctly.");
    });
});

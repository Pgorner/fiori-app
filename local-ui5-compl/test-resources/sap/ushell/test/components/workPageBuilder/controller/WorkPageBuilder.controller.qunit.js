// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controller.WorkPageBuilder.controller
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.controller",
    "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.layout",
    "sap/ushell/components/workPageBuilder/controls/WorkPage",
    "sap/ushell/components/workPageBuilder/controls/WorkPageRow",
    "sap/ushell/components/workPageBuilder/controls/WorkPageColumn",
    "sap/ushell/components/workPageBuilder/controls/WorkPageCell",
    "sap/ushell/utils/workpage/WorkPageVizInstantiation",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/Context",
    "sap/ushell/utils/workpage/WorkPageHost",
    "sap/ui/core/Fragment",
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ui/core/InvisibleMessage",
    "sap/ui/integration/widgets/Card",
    "sap/ushell/utils",
    "sap/m/library",
    "sap/ushell/Container",
    "sap/base/util/deepExtend",
    "sap/ushell/utils/workpage/DestinationResolver"
], function (
    Localization,
    WorkPageBuilderController,
    WorkPageBuilderLayoutHelper,
    WorkPage,
    WorkPageRow,
    WorkPageColumn,
    WorkPageCell,
    WorkPageVizInstantiation,
    JSONModel,
    ResourceModel,
    Context,
    WorkPageHost,
    Fragment,
    utilsCdm,
    readUtils,
    readVisualizations,
    InvisibleMessage,
    Card,
    utils,
    mLibrary,
    Container,
    deepExtend,
    destinationResolver
) {
    "use strict";
    /* global QUnit sinon */

    var LoadState = mLibrary.LoadState;

    QUnit.dump.maxDepth = 10;

    var sandbox = sinon.sandbox.create();

    QUnit.module("WorkPageBuilderController", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });
    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oController, "The controller was instantiated.");
    });

    QUnit.module("onInit", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oRegisterStub = sandbox.stub(WorkPageBuilderLayoutHelper, "register");

            this.oSetModelStub = sandbox.stub();

            sandbox.stub(this.oController, "getView").returns({
                setModel: this.oSetModelStub
            });

            this.oFakeWorkPageVizInstantiation = {
                test: "WorkPageVizInstantiation"
            };
            this.oWorkPageVizInstantiationGetInstanceStub = sandbox.stub(WorkPageVizInstantiation, "getInstance").resolves(this.oFakeWorkPageVizInstantiation);

            this.oSaveHostStub = sandbox.stub(this.oController, "_saveHost");

            this.oByIdStub = sandbox.stub(this.oController, "byId");
            this.oBindElementStub = sandbox.stub();
            this.oByIdStub.withArgs("workPage").returns({
                bindElement: this.oBindElementStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });
    QUnit.test("initializes the controller", function (assert) {
        // Act
        var oPromise = this.oController.onInit();
        // Assert
        assert.ok(this.oController._fnDeleteRowHandler, "deleteRow was bound.");
        assert.ok(this.oController._fnSaveCardConfiguration, "_onSaveCardEditor was bound.");
        assert.ok(this.oController._fnResetCardConfiguration, "_onResetCardConfigurations was bound.");

        assert.ok(this.oWorkPageVizInstantiationGetInstanceStub.calledOnce, "WorkPageVizInstantiation.getInstance was called.");

        assert.strictEqual(this.oController.oModel.iSizeLimit, Infinity, "The model size limit was set to Infinity.");
        assert.ok(this.oBindElementStub.calledOnce, "bindElement was called.");
        assert.ok(this.oSaveHostStub.calledOnce, "saveHost was called.");
        assert.deepEqual(this.oBindElementStub.firstCall.args[0], {
            path: "/data/workPage"
        }, "bindElement was called.");

        return oPromise.then(function () {
            assert.deepEqual(this.oController.oWorkPageVizInstantiation, this.oFakeWorkPageVizInstantiation, "WorkPageVizInstantiation was initialized.");
            assert.ok(this.oRegisterStub.calledOnce, "register was called.");
            assert.ok(this.oSetModelStub.calledTwice, "setModel was called twice.");
            assert.ok(this.oSetModelStub.withArgs(sinon.match.any, "viewSettings").calledOnce, "setModel was called once for the viewSettings model.");
            assert.deepEqual(this.oController.oModel.getData(), {
                maxColumns: 4,
                editMode: false,
                loaded: false,
                data: {
                    workPage: null,
                    visualizations: [],
                    usedVisualizations: []
                },
                navigationDisabled: false,
                previewMode: false,
                showFooter: false,
                showPageTitle: true
            }, "The model was initialized");
        }.bind(this));

    });

    QUnit.module("WorkPageBuilderController - onAddColumn", {
        beforeEach: function () {
            this.oModel = new JSONModel({
                editMode: false,
                data: {
                    workPage: {
                        rows: [{
                            id: "ExistingRow",
                            columns: [{
                                id: "ExistingColumn",
                                descriptor: {
                                    value: {
                                        columnWidth: 24
                                    }
                                },
                                cells: [{
                                    id: "",
                                    descriptor: {},
                                    widgets: []
                                }]
                            }]
                        }]
                    }
                }
            });
            this.oMockRow = new WorkPageRow();
            this.oMockRow.setBindingContext(new Context(this.oModel, "/data/workPage/rows/0"));
            this.oMockColumn = new WorkPageColumn();
            this.oMockColumn.setBindingContext(new Context(this.oModel, "/data/workPage/rows/0/columns/0"));
            this.oMockRow.addAggregation("columns", this.oMockColumn);

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("left").returns(true);

            this.oMockEvent = {
                getSource: sandbox.stub().returns(this.oMockColumn),
                getParameter: this.oGetParameterStub
            };
            this.oController = new WorkPageBuilderController();

            this.oFireEventStub = sandbox.stub();
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

            sandbox.stub(this.oController, "_generateUniqueId").returns("test-column-id-0");

            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });
    QUnit.test("adds a column to the left of the existing column", function (assert) {
        // Act
        this.oController.onAddColumn(this.oMockEvent);

        // Assert
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns").length,
            2,
            "Two columns were expected."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/0/descriptor/value/columnWidth"),
            12,
            "The columnWidth 12 was expected."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/1/descriptor/value/columnWidth"),
            12,
            "The columnWidth 12 was expected."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/1/id"),
            "ExistingColumn",
            "The existing column has index 1."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/0/id"),
            "test-column-id-0",
            "The new column has index 0."
        );
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called");
    });

    QUnit.test("adds a column between the existing columns", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("left").returns(false);
        this.oModel.setData({
            editMode: false,
            data: {
                workPage: {
                    rows: [{
                        id: "ExistingRow",
                        columns: [{
                            id: "ExistingColumn0",
                            descriptor: { value: { columnWidth: 12 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }, {
                            id: "ExistingColumn1",
                            descriptor: { value: { columnWidth: 12 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }]
                    }]
                }
            }
        });

        this.oMockColumn2 = new WorkPageColumn();
        this.oMockColumn2.setBindingContext(new Context(this.oModel, "/data/workPage/rows/0/columns/1"));

        // Act
        this.oController.onAddColumn(this.oMockEvent);

        // Assert
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns").length,
            3,
            "Three columns were expected."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/0/descriptor/value/columnWidth"),
            8,
            "The columnWidth 8 was expected."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/1/descriptor/value/columnWidth"),
            8,
            "The columnWidth 8 was expected."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/2/descriptor/value/columnWidth"),
            8,
            "The columnWidth 8 was expected."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/0/id"),
            "ExistingColumn0",
            "The first existing column has index 0."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/2/id"),
            "ExistingColumn1",
            "The second existing column has index 2."
        );
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns/1/id"),
            "test-column-id-0",
            "The new column has index 1."
        );
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called");
    });

    QUnit.test("does not add a column if the column count is >= MAX_COLS", function (assert) {
        // Arrange
        this.oModel.setData({
            editMode: false,
            data: {
                workPage: {
                    rows: [{
                        id: "ExistingRow0",
                        columns: [{
                            id: "ExistingColumn0",
                            descriptor: { value: { columnWidth: 4 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }, {
                            id: "ExistingColumn1",
                            descriptor: { value: { columnWidth: 4 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }, {
                            id: "ExistingColumn2",
                            descriptor: { value: { columnWidth: 4 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }, {
                            id: "ExistingColumn3",
                            descriptor: { value: { columnWidth: 4 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }, {
                            id: "ExistingColumn4",
                            descriptor: { value: { columnWidth: 4 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }, {
                            id: "ExistingColumn5",
                            descriptor: { value: { columnWidth: 4 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }]
                    }]
                }
            }
        });

        // Act
        this.oController.onAddColumn(this.oMockEvent);

        // Assert
        assert.strictEqual(
            this.oModel.getProperty("/data/workPage/rows/0/columns").length,
            6,
            "Six columns were expected."
        );
    });


    QUnit.module("WorkPageBuilderController - onDeleteColumn", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oFireEventStub = sandbox.stub();
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
            this.oModel = new JSONModel({
                editMode: false,
                data: {
                    workPage: {
                        rows: [{
                            id: 0,
                            columns: [{
                                id: 0,
                                descriptor: { value: { columnWidth: 12 } },
                                cells: [{
                                    id: "",
                                    descriptor: {},
                                    widgets: []
                                }]
                            }, {
                                id: 1,
                                descriptor: { value: { columnWidth: 12 } },
                                cells: [{
                                    id: "",
                                    descriptor: {},
                                    widgets: []
                                }]
                            }]
                        }]
                    }
                }
            });
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });
            this.oMockRow = new WorkPageRow();
            this.oMockRow.setBindingContext(new Context(this.oModel, "/data/workPage/rows/0"));
            this.oMockColumn = new WorkPageColumn();
            this.oMockColumn.setBindingContext(new Context(this.oModel, "/data/workPage/rows/0/columns/0"));
            this.oMockRow.addAggregation("columns", this.oMockColumn);
            this.oInvalidateSpy = sandbox.spy(this.oMockRow, "invalidate");

            this.oMockEvent = {
                getSource: sandbox.stub().returns(this.oMockColumn)
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Removes the column from the model", function (assert) {
        // Act
        this.oController.onDeleteColumn(this.oMockEvent);

        // Assert
        assert.strictEqual(this.oModel.getProperty("/data/workPage/rows/0/columns").length, 1, "The column count was 1.");
        assert.strictEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/id"), 1, "The column with id 1 was not deleted.");
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called.");
        assert.ok(this.oInvalidateSpy.calledOnce, "invalidate was called on the row control.");
    });


    QUnit.module("WorkPageBuilderController - onAddFirstRow", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oFireEventStub = sandbox.stub();

            this.oModel = new JSONModel({
                editMode: false,
                data: {
                    workPage: {
                        rows: []
                    }
                }
            });

            this.oGetModelStub = sandbox.stub().returns(this.oModel);
            this.oGetModelStub.withArgs("i18n").returns(new ResourceModel({
                bundleUrl: "../../../../../../../resources/sap/ushell/components/workPageBuilder/resources/resources.properties"
            }));

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub
            });
            sandbox.stub(this.oController, "_generateUniqueId").returns("test-row-id-1");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Adds the first row to the Workpage", function (assert) {
        // Act
        this.oController.onAddFirstRow();

        // Assert
        assert.strictEqual(this.oModel.getProperty("/data/workPage/rows/").length, 1, "The row was created.");
        var oDescriptor = this.oModel.getProperty("/data/workPage/rows/0/descriptor/value");
        assert.ok(oDescriptor.title !== undefined, "Title given");
        assert.strictEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/").length, 1, "The column was created.");
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called.");

    });

    QUnit.module("WorkPageBuilderController - onAddRow", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oFireEventStub = sandbox.stub();

            this.oModel = new JSONModel({
                editMode: false,
                data: {
                    workPage: {
                        rows: [{
                            id: "ExistingRow0",
                            columns: [{
                                id: "ExistingColumn0",
                                descriptor: { value: { columnWidth: 12 } },
                                cells: [{
                                    id: "",
                                    descriptor: {},
                                    widgets: []
                                }]
                            }]
                        }, {
                            id: "ExistingRow1",
                            columns: [{
                                id: "ExistingColumn1",
                                descriptor: { value: { columnWidth: 12 } },
                                cells: [{
                                    id: "",
                                    descriptor: {},
                                    widgets: []
                                }]
                            }]
                        }]
                    }
                }
            });

            this.oGetModelStub = sandbox.stub().returns(this.oModel);
            this.oGetModelStub.withArgs("i18n").returns(new ResourceModel({
                bundleUrl: "../../../../../../../resources/sap/ushell/components/workPageBuilder/resources/resources.properties"
            }));

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub
            });

            this.oGetParameterStub = sandbox.stub().withArgs("bottom").returns(true);
            this.oMockPage = new WorkPage();
            this.oMockPage.setBindingContext(new Context(this.oModel, "/data/workPage"));
            this.oMockRow = new WorkPageRow();
            this.oMockRow.setBindingContext(new Context(this.oModel, "/data/workPage/rows/0"));
            this.oMockPage.addAggregation("rows", this.oMockRow);
            this.oMockEvent = {
                getSource: sandbox.stub().returns(this.oMockRow),
                getParameter: this.oGetParameterStub
            };

            sandbox.stub(this.oController, "byId").withArgs("workPage").returns(this.oMockPage);

            sandbox.stub(this.oController, "_generateUniqueId").returns("test-row-id-1");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Adds a new row after the given row", function (assert) {
        // Act
        this.oController.onAddRow(this.oMockEvent);

        // Assert
        assert.strictEqual(this.oModel.getProperty("/data/workPage/rows/").length, 3, "The row was created.");
        assert.strictEqual(this.oModel.getProperty("/data/workPage/rows/0/id"), "ExistingRow0", "The row id was expected.");
        assert.strictEqual(this.oModel.getProperty("/data/workPage/rows/1/id"), "test-row-id-1", "The new row was inserted.");
        assert.strictEqual(this.oModel.getProperty("/data/workPage/rows/2/id"), "ExistingRow1", "The row id was expected.");
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called.");
    });

    QUnit.module("WorkPageBuilderController - executeAction", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();
            this.oModel = new JSONModel();
            this.oController.oModel = this.oModel;
            this.oPreventDefaultStub = sandbox.stub();

            Container.init("local").then(function () {
                sandbox.stub(this.oController, "getOwnerComponent").returns({
                    getUshellContainer: sandbox.stub().returns(Container)
                });

                Container.getServiceAsync("Navigation")
                    .then(function (NavigationService) {
                        this.oNavigationService = NavigationService;
                        this.oController._saveHost();
                        fnDone();
                    }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.oHost.destroy();
            this.oController.destroy();
        }
    });

    QUnit.test("Execute action - ibn, target, param, appSpecificRoute", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oEvent = {
            preventDefault: this.oPreventDefaultStub,
            getParameter: function (sName) {
                if (sName === "parameters") {
                    return {
                        ibnTarget: {
                            semanticObject: "semanticObject",
                            action: "action"
                        },
                        ibnParams: {
                            param1: "1",
                            param2: "2"
                        },
                        ibnAppSpecificRoute: "app/specific/route?question=mark"
                    };
                } else if (sName === "card") {
                    return new Card();
                }
                return "Navigation";
            }
        };
        var oToExternalObject = {
            target: {
                semanticObject: "semanticObject",
                action: "action"
            },
            params: {
                param1: "1",
                param2: "2"
            },
            appSpecificRoute: "app/specific/route?question=mark"
        };
        sandbox.stub(this.oNavigationService, "navigate").withArgs(oToExternalObject).returns(true);
        // Act
        return this.oController
            .oHost._executeNavigation(oEvent)
            .then(function (oExecResult) {
                // Assert
                assert.ok(oExecResult, true);
                assert.ok(this.oPreventDefaultStub.calledOnce, "preventDefault was called once.");
                assert.strictEqual(this.oPreventDefaultStub.firstCall.args[0], true, "preventDefault was called with true");
                fnDone();
            }.bind(this));
    });

    QUnit.test("Execute action - ibn, target, param", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oEvent = {
            preventDefault: this.oPreventDefaultStub,
            getParameter: function (sName) {
                if (sName === "parameters") {
                    return {
                        ibnTarget: {
                            semanticObject: "semanticObject",
                            action: "action"
                        },
                        ibnParams: {
                            param1: "1",
                            param2: "2"
                        }
                    };
                } else if (sName === "card") {
                    return new Card();
                }
                return "Navigation";
            }
        };
        var oToExternalObject = {
            target: {
                semanticObject: "semanticObject",
                action: "action"
            },
            params: {
                param1: "1",
                param2: "2"
            }
        };
        sandbox.stub(this.oNavigationService, "navigate").withArgs(oToExternalObject).returns(true);
        // Act
        return this.oController
            .oHost._executeNavigation(oEvent)
            .then(function (oExecResult) {
                // Assert
                assert.ok(oExecResult, true);
                assert.ok(this.oPreventDefaultStub.calledOnce, "preventDefault was called once.");
                assert.strictEqual(this.oPreventDefaultStub.firstCall.args[0], true, "preventDefault was called with true");
                fnDone();
            }.bind(this));
    });

    QUnit.test("Execute action - ibn, target", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oEvent = {
            preventDefault: this.oPreventDefaultStub,
            getParameter: function (sName) {
                if (sName === "parameters") {
                    return {
                        ibnTarget: {
                            semanticObject: "semanticObject",
                            action: "action"
                        }
                    };
                } else if (sName === "card") {
                    return new Card();
                }
                return "Navigation";
            }
        };
        var oToExternalObject = {
            target: {
                semanticObject: "semanticObject",
                action: "action"
            }
        };
        sandbox.stub(this.oNavigationService, "navigate").withArgs(oToExternalObject).returns(true);
        // Act
        return this.oController
            .oHost._executeNavigation(oEvent)
            .then(function (oExecResult) {
                // Assert
                assert.ok(oExecResult, true);
                assert.ok(this.oPreventDefaultStub.calledOnce, "preventDefault was called once.");
                assert.strictEqual(this.oPreventDefaultStub.firstCall.args[0], true, "preventDefault was called with true");
                fnDone();
            }.bind(this));
    });

    QUnit.test("Execute action resolves with undefined if navigation is disabled", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oModel.setProperty("/navigationDisabled", true);
        var oEvent = {
            preventDefault: this.oPreventDefaultStub,
            getParameter: function (sName) {
                if (sName === "parameters") {
                    return {
                        ibnTarget: {
                            semanticObject: "",
                            action: ""
                        }
                    };
                } else if (sName === "card") {
                    return new Card();
                }
                return "Navigation";
            }
        };
        sandbox.stub(this.oNavigationService, "navigate").returns(true);
        // Act
        return this.oController
            .oHost._executeNavigation(oEvent)
            .then(function (oExecResult) {
                // Assert
                assert.strictEqual(oExecResult, undefined, "The result was undefined");
                assert.ok(this.oPreventDefaultStub.notCalled, "preventDefault was not called.");
                fnDone();
            }.bind(this));
    });

    QUnit.test("Execute action resolves with undefined for url navigation", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oModel.setProperty("/navigationDisabled", false);
        var oEvent = {
            preventDefault: this.oPreventDefaultStub,
            getParameter: function (sName) {
                if (sName === "parameters") {
                    return {
                        url: ""
                    };
                } else if (sName === "card") {
                    return new Card();
                }
                return "Navigation";
            }
        };
        sandbox.stub(this.oNavigationService, "navigate").returns(true);
        // Act
        return this.oController
            .oHost._executeNavigation(oEvent)
            .then(function (oExecResult) {
                // Assert
                assert.strictEqual(oExecResult, undefined, "The result was undefined");
                assert.ok(this.oPreventDefaultStub.notCalled, "preventDefault was not called.");
                fnDone();
            }.bind(this));
    });

    QUnit.module("WorkPageBuilderController - widgetFactory", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.sWidgetId = "test-widget-id";
            this.oCreateVizInstanceStub = sandbox.stub(this.oController, "_createVizInstance");
            this.oContextGetPropertyStub = sandbox.stub();
            this.oContextGetPropertyStub.withArgs("configurations").returns([]);
            this.oContextGetPathStub = sandbox.stub().returns("/path/to/test/widget");
            this.oModelMock = new JSONModel();
            this.oI18nModelMock = new JSONModel();
            this.oModelStub = sandbox.stub();
            this.oModelStub.returns(this.oModelMock);
            this.oModelStub.withArgs("i18n").returns({
                getResourceBundle: sandbox.stub().returns({
                    getText: sandbox.stub()
                })
            });

            this.oWidgetContext = {
                getProperty: this.oContextGetPropertyStub,
                getPath: this.oContextGetPathStub
            };
            sandbox.stub(this.oController, "createId").returns("test-created-id");
            this.oGetMergedAndSortedConfigurationsStub = sandbox.stub(this.oController, "_getMergedAndSortedConfigurations");
            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oModelStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns error vizInstance if no vizId is found", function (assert) {
        // Act
        var oResult = this.oController.widgetFactory(this.sWidgetId + "-1", this.oWidgetContext);

        // Assert
        assert.ok(oResult.isA("sap.ushell.ui.launchpad.VizInstanceCdm"), "A vizInstance was returned");
        assert.strictEqual(oResult.getState(), LoadState.Failed, "The state was 'Failed'");

        oResult.destroy();
    });

    QUnit.test("Returns error vizInstance if no viz is found", function (assert) {
        // Arrange
        this.oContextGetPropertyStub.returns("my-viz-id");

        // Act
        var oResult = this.oController.widgetFactory(this.sWidgetId + "-2", this.oWidgetContext);

        // Assert
        assert.ok(oResult.isA("sap.ushell.ui.launchpad.VizInstanceCdm"), "A vizInstance was returned");
        assert.strictEqual(oResult.getState(), LoadState.Failed, "The state was 'Failed'");

        oResult.destroy();
    });

    QUnit.test("Returns error vizInstance if type is not sap.card|sap.ushell.StaticAppLauncher|sap.ushell.DynamicAppLauncher|ssuite.smartbusiness.tiles.*", function (assert) {
        // Arrange
        this.oContextGetPropertyStub.returns("my-viz-id");
        this.oModelMock.setData({
            data: {
                usedVisualizations: {
                    "my-viz-id": {
                        id: "viz",
                        descriptor: {
                            value: {
                                "sap.app": {
                                    test: true
                                }
                            }
                        },
                        type: "sap.tile"
                    }
                }
            }
        });

        // Act
        var oResult = this.oController.widgetFactory(this.sWidgetId, this.oWidgetContext);

        // Assert
        assert.ok(oResult.isA("sap.ushell.ui.launchpad.VizInstanceCdm"), "A vizInstance was returned");
        assert.strictEqual(oResult.getState(), LoadState.Failed, "The state was 'Failed'");

        oResult.destroy();
    });

    QUnit.test("Returns card if type is sap.card", function (assert) {
        // Arrange
        this.oContextGetPropertyStub.returns("my-viz-id");
        this.oModelMock.setData({
            data: {
                usedVisualizations: {
                    "my-viz-id": {
                        id: "viz",
                        descriptor: {
                            value: {
                                "sap.app": {
                                    id: "test1"
                                },
                                "sap.card": {
                                    id: "test1"
                                }
                            }
                        },
                        type: "sap.card"
                    }
                }
            }
        });

        // Act
        var oResult = this.oController.widgetFactory(this.sWidgetId, this.oWidgetContext);

        // Assert
        assert.ok(oResult.isA("sap.ui.integration.widgets.Card"), "A Card was returned");

        oResult.destroy();
    });

    QUnit.test("Creates vizInstance if type is sap.ushell.StaticAppLauncher|sap.ushell.DynamicAppLauncher", function (assert) {
        // Arrange
        this.oContextGetPropertyStub.returns("my-viz-id");
        this.oModelMock.setData({
            data: {
                usedVisualizations: {
                    "my-viz-id": {
                        id: "viz",
                        descriptor: {
                            value: {
                                "sap.app": {
                                    id: "test1"
                                },
                                "sap.card": {
                                    id: "test1"
                                }
                            }
                        },
                        type: "sap.ushell.StaticAppLauncher"
                    }
                }
            }
        });

        // Act
        this.oController.widgetFactory(this.sWidgetId, this.oWidgetContext);

        // Assert
        assert.strictEqual(this.oCreateVizInstanceStub.callCount, 1, "_createVizInstance was called.");
        assert.ok(this.oCreateVizInstanceStub.calledWith({
            id: "viz",
            descriptor: {
                value: {
                    "sap.app": {
                        id: "test1"
                    },
                    "sap.card": {
                        id: "test1"
                    }
                }
            },
            type: "sap.ushell.StaticAppLauncher"
        }), "_createVizInstance was called with the expected arguments");
    });

    [
        {
            description: "Creates vizInstance if type is ssuite.smartbusiness.tiles.dual",
            type: "ssuite.smartbusiness.tiles.dual"
        },
        {
            description: "Creates vizInstance if type is ssuite.smartbusiness.tiles.numeric",
            type: "ssuite.smartbusiness.tiles.numeric"
        },
        {
            description: "Creates vizInstance if type is ssuite.smartbusiness.tiles.contribution",
            type: "ssuite.smartbusiness.tiles.contribution"
        },
        {
            description: "Creates vizInstance if type is ssuite.smartbusiness.tiles.deviation",
            type: "ssuite.smartbusiness.tiles.deviation"
        },
        {
            description: "Creates vizInstance if type is ssuite.smartbusiness.tiles.trend",
            type: "ssuite.smartbusiness.tiles.trend"
        },
        {
            description: "Creates vizInstance if type is ssuite.smartbusiness.tiles.comparison",
            type: "ssuite.smartbusiness.tiles.comparison"
        }
    ].forEach((oTestCase) => {
        QUnit.test(oTestCase.description, function (assert) {
            // Arrange
            this.oContextGetPropertyStub.returns("my-viz-id");
            this.oModelMock.setData({
                data: {
                    usedVisualizations: {
                        "my-viz-id": {
                            id: "viz",
                            descriptor: {
                                value: {
                                    "sap.app": {
                                        id: "test1"
                                    }
                                }
                            },
                            type: oTestCase.type
                        }
                    }
                }
            });

            // Act
            this.oController.widgetFactory(this.sWidgetId, this.oWidgetContext);

            // Assert
            assert.strictEqual(this.oCreateVizInstanceStub.callCount, 1, "_createVizInstance was called.");
            assert.ok(this.oCreateVizInstanceStub.calledWith({
                id: "viz",
                descriptor: {
                    value: {
                        "sap.app": {
                            id: "test1"
                        }
                    }
                },
                type: oTestCase.type
            }), "_createVizInstance was called with the expected arguments");
        });
    });

    QUnit.test("Merges and sorts the given widget and viz configurations", function (assert) {
        // Arrange
        this.oContextGetPropertyStub.returns("my-viz-id");
        var aWidgetConfs = [
            { id: "conf_widget_0", level: "US", settings: { value: { "/sap.card/header/title": "Sample title (US)" } } },
            { id: "conf_widget_1", level: "PG", settings: { value: { "/sap.card/header/title": "Sample title (PG)" } } },
            { id: "conf_widget_2", level: "CO", settings: { value: { "/sap.card/header/title": "Sample title (CO)" } } },
            { id: "conf_widget_3", level: "PR", settings: { value: { "/sap.card/header/title": "Sample title (PR)" } } }
        ];
        var aVizConfs = [
            { id: "conf_viz_0", level: "US", settings: { value: { "/sap.card/header/title": "Sample title (US)" } } },
            { id: "conf_viz_1", level: "PG", settings: { value: { "/sap.card/header/title": "Sample title (PG)" } } },
            { id: "conf_viz_2", level: "CO", settings: { value: { "/sap.card/header/title": "Sample title (CO)" } } },
            { id: "conf_viz_3", level: "PR", settings: { value: { "/sap.card/header/title": "Sample title (PR)" } } }
        ];
        this.oContextGetPropertyStub.withArgs("configurations").returns(aWidgetConfs);

        this.oModelMock.setData({
            data: {
                usedVisualizations: {
                    "my-viz-id": {
                        id: "viz",
                        configurations: aVizConfs,
                        descriptor: {
                            value: {
                                "sap.app": {
                                    id: "test1"
                                },
                                "sap.card": {
                                    id: "test1"
                                }
                            }
                        },
                        type: "sap.card"
                    }
                }
            }
        });

        // Act
        this.oController.widgetFactory(this.sWidgetId, this.oWidgetContext);

        // Assert
        assert.strictEqual(this.oGetMergedAndSortedConfigurationsStub.callCount, 1, "_getMergedAndSortedConfigurations was called once");
        assert.deepEqual(this.oGetMergedAndSortedConfigurationsStub.firstCall.args, [aWidgetConfs, aVizConfs], "_getMergedAndSortedConfigurations was called with the expected arguments");
    });


    QUnit.module("WorkPageBuilderController - _getMergedAndSortedConfigurations", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns empty array if no configurations exist", function (assert) {
        // Act
        var aResult = this.oController._getMergedAndSortedConfigurations([], []);

        // Assert
        assert.deepEqual(aResult, [], "The result was empty array.");
    });

    QUnit.test("returns sorted widget configurations array if no configurations exist on the viz", function (assert) {
        // Arrange
        var aInputConfigurations = [
            { id: "conf_widget_0", level: "US", settings: { value: { "/sap.card/header/title": "Sample title (US)" } } },
            { id: "conf_widget_1", level: "PG", settings: { value: { "/sap.card/header/title": "Sample title (PG)" } } },
            { id: "conf_widget_2", level: "CO", settings: { value: { "/sap.card/header/title": "Sample title (CO)" } } },
            { id: "conf_widget_3", level: "PR", settings: { value: { "/sap.card/header/title": "Sample title (PR)" } } }
        ];

        var aExpectedSortedConfigurations = [
            { "/sap.card/header/title": "Sample title (PR)" },
            { "/sap.card/header/title": "Sample title (CO)" },
            { "/sap.card/header/title": "Sample title (PG)" }
        ];

        // Act
        var aResult = this.oController._getMergedAndSortedConfigurations(aInputConfigurations, []);

        // Assert
        assert.deepEqual(aResult, aExpectedSortedConfigurations, "The result was the expected sorted array.");
    });

    QUnit.test("returns sorted viz configurations array if no configurations exist on the widget", function (assert) {
        // Arrange
        var aInputConfigurations = [
            { id: "conf_viz_0", level: "US", settings: { value: { "/sap.card/header/title": "Sample title (US)" } } },
            { id: "conf_viz_1", level: "PG", settings: { value: { "/sap.card/header/title": "Sample title (PG)" } } },
            { id: "conf_viz_2", level: "CO", settings: { value: { "/sap.card/header/title": "Sample title (CO)" } } },
            { id: "conf_viz_3", level: "PR", settings: { value: { "/sap.card/header/title": "Sample title (PR)" } } }
        ];

        var aExpectedSortedConfigurations = [
            { "/sap.card/header/title": "Sample title (PR)" },
            { "/sap.card/header/title": "Sample title (CO)" },
            { "/sap.card/header/title": "Sample title (PG)" }
        ];

        // Act
        var aResult = this.oController._getMergedAndSortedConfigurations([], aInputConfigurations);

        // Assert
        assert.deepEqual(aResult, aExpectedSortedConfigurations, "The result was the expected sorted array.");
    });

    QUnit.test("returns merged and sorted configurations array if configurations exist on the widget and the viz", function (assert) {
        // Arrange
        var aWidgetInputConfigurations = [
            {
                id: "conf_widget_0",
                level: "US",
                settings: { value: { "/sap.card/header/title": "Sample title WIDGET (US)" } }
            },
            {
                id: "conf_widget_1",
                level: "PG",
                settings: { value: { "/sap.card/header/title": "Sample title WIDGET (PG)" } }
            },
            {
                id: "conf_widget_2",
                level: "CO",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title WIDGET (CO)",
                        "/sap.card/configuration/parameters/maxItems": 5
                    }
                }
            },
            {
                id: "conf_widget_3",
                level: "PR",
                settings: { value: { "/sap.card/header/title": "Sample title WIDGET (PR)" } }
            }
        ];

        var aVizInputConfigurations = [
            { id: "conf_viz_0", level: "US", settings: { value: { "/sap.card/header/title": "Sample title VIZ (US)" } } },
            {
                id: "conf_viz_1",
                level: "PG",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title VIZ (PG)",
                        "/sap.card/header/subTitle": "Sample sub title VIZ (PG)",
                        "/sap.card/configuration/parameters/maxItems": 10
                    }
                }
            },
            {
                id: "conf_viz_2",
                level: "CO",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title VIZ (CO)",
                        "/sap.card/header/subTitle": "Sample sub title VIZ (CO)"
                    }
                }
            },
            {
                id: "conf_viz_3",
                level: "PR",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title VIZ (PR)"
                    }
                }
            }
        ];

        var aExpectedSortedConfigurations = [
            {
                "/sap.card/header/title": "Sample title WIDGET (PR)"
            },
            {
                "/sap.card/header/title": "Sample title WIDGET (CO)",
                "/sap.card/header/subTitle": "Sample sub title VIZ (CO)",
                "/sap.card/configuration/parameters/maxItems": 5
            },
            {
                "/sap.card/header/title": "Sample title WIDGET (PG)",
                "/sap.card/header/subTitle": "Sample sub title VIZ (PG)",
                "/sap.card/configuration/parameters/maxItems": 10
            }
        ];

        // Act
        var aResult = this.oController._getMergedAndSortedConfigurations(aWidgetInputConfigurations, aVizInputConfigurations);

        // Assert
        assert.deepEqual(aResult, aExpectedSortedConfigurations, "The result was the expected sorted array.");
    });

    QUnit.module("WorkPageBuilderController - _openCardConfigurationEditor", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oModelStub = sandbox.stub();
            this.oGetTextStub = sandbox.stub();
            this.oModelStub.withArgs("i18n").returns({
                getResourceBundle: sandbox.stub().returns({
                    getText: this.oGetTextStub
                })
            });
            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oModelStub
            });
            this.oManifest = {
                "sap.app": {
                    id: "test1"
                },
                "sap.card": {
                    id: "test1"
                }
            };

            this.oAttachPressStub = sandbox.stub();
            this.oDetachPressStub = sandbox.stub();
            this.oSaveCardConfigurationStub = sandbox.stub();
            this.oController._fnSaveCardConfiguration = this.oSaveCardConfigurationStub;

            this.oRemoveAllContentStub = sandbox.stub();
            this.oBeginButton = {
                detachPress: this.oDetachPressStub,
                attachPress: this.oAttachPressStub
            };
            this.oDetachPressStub.returns(this.oBeginButton);
            this.oAttachPressStub.returns(this.oBeginButton);

            this.oGetBeginButtonStub = sandbox.stub().returns(this.oBeginButton);
            this.oAddContentStub = sandbox.stub();
            this.oOpenStub = sandbox.stub();
            this.oSetTitleStub = sandbox.stub();

            this.oCardEditorDialog = {
                removeAllContent: this.oRemoveAllContentStub,
                getBeginButton: this.oGetBeginButtonStub,
                addContent: this.oAddContentStub,
                open: this.oOpenStub,
                setTitle: this.oSetTitleStub
            };

            this.oSetCardStub = sandbox.stub().returns(new Card());

            this.oCardEditor = {
                setCard: this.oSetCardStub
            };

            this.oController.oCardEditorDialogPromise = Promise.resolve(this.oCardEditorDialog);

            this.oGetCardEditorDialogStub = sandbox.stub(this.oController, "_createCardEditorDialog").resolves(this.oCardEditorDialog);
            this.oGetCardEditorStub = sandbox.stub(this.oController, "_createCardEditor").resolves(this.oCardEditor);
            sandbox.stub(this.oController, "_getCardTitle");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates the dialog", function (assert) {
        // Arrange
        this.oController.oCardEditorDialogPromise = null;
        //Act
        var oCard = new Card();

        return this.oController._openCardConfigurationEditor({}, {
            card: oCard,
            widgetContextPath: "testPath"
        }).then(function () {
            // Assert
            assert.ok(this.oGetCardEditorDialogStub.calledOnce, "The dialog was created");
        }.bind(this));
    });

    QUnit.test("A dialog is created and contains a card editor (creation promises exist)", function (assert) {
        // Arrange

        //Act
        var oCard = new Card();

        return this.oController._openCardConfigurationEditor({}, {
            card: oCard,
            widgetContextPath: "testPath"
        }).then(function () {
            // Assert
            assert.ok(this.oGetCardEditorStub.calledOnce, "_createCardEditor was called once.");
            assert.deepEqual(this.oGetCardEditorStub.firstCall.args, [oCard], "_createCardEditor was called with the card instance.");

            assert.ok(this.oRemoveAllContentStub.calledOnce, "removeAllContent was called on the editor dialog");

            assert.ok(this.oDetachPressStub.calledOnce, "detachPress was called on the editor dialog begin button");
            assert.deepEqual(this.oDetachPressStub.firstCall.args[0], this.oSaveCardConfigurationStub, "detachPress was called on the editor dialog begin button");

            assert.ok(this.oAttachPressStub.calledOnce, "attachPress was called on the editor dialog begin button");
            assert.deepEqual(
                this.oAttachPressStub.firstCall.args,
                ["testPath", this.oSaveCardConfigurationStub],
                "attachPress was called on the editor dialog begin button with the expected arguments."
            );

            assert.ok(this.oAddContentStub.calledOnce, "addContent was called on the editor dialog");
            assert.deepEqual(this.oAddContentStub.firstCall.args, [this.oCardEditor], "addContent was called with the expected arguments");

            assert.ok(this.oOpenStub.calledOnce, "open was called once on the dialog");
        }.bind(this));
    });

    QUnit.test("The card dialog has the correct title", function (assert) {
        // Arrange
        this.oGetTextStub.returns("Dialog Title");

        //Act
        var oCard = new Card();

        return this.oController._openCardConfigurationEditor({}, {
            card: oCard,
            widgetContextPath: "testPath"
        }).then(function () {
            // Assert
            assert.ok(this.oSetTitleStub.calledOnce, "The dialog title was set");
            assert.ok(this.oSetTitleStub.calledWith("Dialog Title"), "The dialog title was correct.");
        }.bind(this));
    });

    QUnit.module("WorkPageBuilderController - _createCardEditorDialog", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getResourceBundle: sandbox.stub().returns({
                        getText: sandbox.stub()
                    })
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns a card editor dialog control", function (assert) {
        // Act
        return this.oController._createCardEditorDialog().then(function (oDialog) {

            // Assert
            assert.ok(oDialog.isA("sap.m.Dialog"), "The dialog control was returned");
        });
    });

    QUnit.module("WorkPageBuilderController - _createCardEditor", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns a card editor instance", function (assert) {
        var fnDone = assert.async();
        // Act
        var oCard = new Card();
        var oEditorPromise = this.oController._createCardEditor(oCard);
        oEditorPromise.then(function (oEditor) {
            // Assert
            assert.ok(oEditor.isA("sap.ui.integration.designtime.editor.CardEditor"), "The CardEditor instance was returned");
            assert.strictEqual(oEditor.getPreviewPosition(), "right", "The preview position was correct");
            assert.strictEqual(oEditor.getMode(), "content", "The mode was 'content'");
            assert.deepEqual(oEditor.getCard(), oCard, "The card was correct");
            fnDone();
        });
    });

    QUnit.module("WorkPageBuilderController - _onSaveCardEditor", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oController.oModel = new JSONModel({
                my: {
                    test: {
                        path: {
                            configurations: [
                                {
                                    id: "conf_0",
                                    level: "US",
                                    settings: { value: { "/sap.card/header/title": "Sample title (US)" } }
                                },
                                {
                                    id: "conf_1",
                                    level: "PG",
                                    settings: {
                                        value: {
                                            "/sap.card/configuration/parameters/subTitle": "My old Subtitle",
                                            "/sap.card/configuration/parameters/title": "My old Title"
                                        }
                                    }
                                },
                                {
                                    id: "conf_2",
                                    level: "CO",
                                    settings: { value: { "/sap.card/header/title": "Sample title (CO)" } }
                                },
                                {
                                    id: "conf_3",
                                    level: "PR",
                                    settings: { value: { "/sap.card/header/title": "Sample title (PR)" } }
                                }
                            ]
                        }
                    }
                }
            });

            this.oGenerateUniqueIdStub = sandbox.stub(this.oController, "_generateUniqueId").returns("test-unique-id");

            this.oFireEventStub = sandbox.stub();
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

            this.oSetManifestChangesStub = sandbox.stub();

            this.oCard = {
                setManifestChanges: this.oSetManifestChangesStub
            };

            this.oGetCardStub = sandbox.stub().returns(this.oCard);

            this.oGetCurrentSettingsStub = sandbox.stub().returns({
                "/sap.card/configuration/parameters/title": "My new Title"
            });

            this.oCardEditor = {
                getCard: this.oGetCardStub,
                getCurrentSettings: this.oGetCurrentSettingsStub
            };

            this.oCloseStub = sandbox.stub();
            this.oDestroyStub = sandbox.stub();

            this.oDialog = {
                getContent: sandbox.stub().returns([this.oCardEditor]),
                close: this.oCloseStub,
                destroy: this.oDestroyStub
            };

            this.oEvent = {
                getSource: sandbox.stub().returns({
                    getParent: sandbox.stub().returns(this.oDialog)
                })
            };

            this.sWidgetContextPath = "/my/test/path";
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Overrides the PG settings with the settings saved in the editor but keeps old settings", function (assert) {
        // Act
        this.oController._onSaveCardEditor(this.oEvent, this.sWidgetContextPath);

        // Assert
        assert.deepEqual(this.oController.oModel.getData(), {
            my: {
                test: {
                    path: {
                        configurations: [
                            {
                                id: "conf_0",
                                level: "US",
                                settings: { value: { "/sap.card/header/title": "Sample title (US)" } }
                            },
                            {
                                id: "conf_1",
                                level: "PG",
                                settings: {
                                    value: {
                                        "/sap.card/configuration/parameters/subTitle": "My old Subtitle",
                                        "/sap.card/configuration/parameters/title": "My new Title"
                                    }
                                }
                            },
                            {
                                id: "conf_2",
                                level: "CO",
                                settings: { value: { "/sap.card/header/title": "Sample title (CO)" } }
                            },
                            {
                                id: "conf_3",
                                level: "PR",
                                settings: { value: { "/sap.card/header/title": "Sample title (PR)" } }
                            }
                        ]
                    }
                }
            }
        }, "The model data was changed as expected.");

        assert.deepEqual(this.oSetManifestChangesStub.firstCall.args[0], [{
            "/sap.card/configuration/parameters/title": "My new Title"
        }], "setManifestChanges was called with the expected arguments.");

        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called once.");
        assert.deepEqual(this.oFireEventStub.firstCall.args[0], "workPageEdited", "The workPageEdited event was fired.");

    });

    QUnit.test("Overrides the PG settings with the settings saved in the editor but keeps old settings", function (assert) {
        // Arrange
        this.oController.oModel.setData({
            my: {
                test: {
                    path: {
                        configurations: []
                    }
                }
            }
        });

        // Act
        this.oController._onSaveCardEditor(this.oEvent, this.sWidgetContextPath);

        // Assert
        assert.deepEqual(this.oController.oModel.getData(), {
            my: {
                test: {
                    path: {
                        configurations: [
                            {
                                id: "test-unique-id",
                                level: "PG",
                                settings: {
                                    value: {
                                        "/sap.card/configuration/parameters/title": "My new Title"
                                    },
                                    schemaVersion: "3.2.0"
                                }
                            }
                        ]
                    }
                }
            }
        }, "The model data was changed as expected.");

        assert.deepEqual(this.oSetManifestChangesStub.firstCall.args[0], [{
            "/sap.card/configuration/parameters/title": "My new Title"
        }], "setManifestChanges was called with the expected arguments.");
    });

    QUnit.test("Creates the configurations array if it does not exist", function (assert) {
        // Arrange
        this.oController.oModel.setData({
            my: {
                test: {
                    path: {}
                }
            }
        });

        // Act
        this.oController._onSaveCardEditor(this.oEvent, this.sWidgetContextPath);

        // Assert
        assert.deepEqual(this.oController.oModel.getData(), {
            my: {
                test: {
                    path: {
                        configurations: [
                            {
                                id: "test-unique-id",
                                level: "PG",
                                settings: {
                                    value: {
                                        "/sap.card/configuration/parameters/title": "My new Title"
                                    },
                                    schemaVersion: "3.2.0"
                                }
                            }
                        ]
                    }
                }
            }
        }, "The model data was changed as expected.");

        assert.deepEqual(this.oSetManifestChangesStub.firstCall.args[0], [{
            "/sap.card/configuration/parameters/title": "My new Title"
        }], "setManifestChanges was called with the expected arguments.");
    });

    QUnit.module("WorkPageBuilderController - _createCard", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();
            this.oManifest = {
                "sap.app": {
                    id: "test1"
                },
                "sap.card": {
                    id: "test1"
                }
            };

            this.oGetTextStub = sandbox.stub();
            this.oGetTextStub.withArgs("WorkPage.Card.ActionDefinition.Reset").returns("Reset");
            this.oGetTextStub.withArgs("WorkPage.Card.ActionDefinition.Configure").returns("Configure");

            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getResourceBundle: sandbox.stub().returns({
                        getText: this.oGetTextStub
                    })
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns an empty card if there is no descriptor|descriptorResource", function (assert) {
        // Act
        var oCard = this.oController._createCard({});

        // Assert
        assert.ok(oCard.isA("sap.ui.integration.widgets.Card"), "A Card was returned");
    });

    QUnit.test("Sets the manifest and the baseUrl if they exist at the expected locations", function (assert) {
        //Act
        var oCard = this.oController._createCard({
            descriptor: {
                value: this.oManifest
            },
            descriptorResources: {
                baseUrl: "/testBaseUrl",
                descriptorPath: "/testPath"
            }
        });

        // Assert
        assert.deepEqual(oCard.getManifest(), this.oManifest, "The manifest was set");
        assert.strictEqual(oCard.getBaseUrl(), "/testBaseUrl/testPath/", "The baseUrl was set and a trailing slash was added");
        oCard.destroy();
    });

    QUnit.test("Sets the manifest to the given url if descriptor is empty", function (assert) {
        // Act
        var oCard = this.oController._createCard({
            descriptor: {},
            descriptorResources: {
                baseUrl: "/testBaseUrl",
                descriptorPath: "/testPath"
            }
        });

        // Assert
        assert.strictEqual(oCard.getManifest(), "/testBaseUrl/testPath/manifest.json", "The manifest was set");
        oCard.destroy();
    });

    QUnit.test("Sets the manifest to the given url if json file is already in path", function (assert) {
        // Act
        var oCard = this.oController._createCard({
            descriptor: {},
            descriptorResources: {
                baseUrl: "/testBaseUrl",
                descriptorPath: "/testPath/myOwnManifest.json"
            }
        });

        // Assert
        assert.strictEqual(oCard.getManifest(), "/testBaseUrl/testPath/myOwnManifest.json", "The manifest was set");
        oCard.destroy();
    });

    QUnit.test("Sets the host to the card", function (assert) {
        // Arrange
        this.oController.oHost = new WorkPageHost("sap.shell.host.environment", {
            resolveDestination: function (sDestinationName) {
                if (!sDestinationName) {
                    return Promise.reject();
                }
                return Promise.resolve("/dynamic_dest/" + sDestinationName);
            }
        });

        // Act
        var oCard = this.oController._createCard({
            descriptor: {},
            descriptorResources: {
                baseUrl: "/testBaseUrl",
                descriptorPath: "/testPath"
            }
        });

        // Assert
        assert.strictEqual(oCard.getHost(), "sap.shell.host.environment", "The host was set");
        oCard.destroy();
        this.oController.oHost.destroy();
    });

    QUnit.test("Returns a card without an action definition ", function (assert) {
        //Arrange
        var oVizData = {
            id: "viz",
            descriptor: {
                value: {
                    "sap.app": {
                        id: "test1"
                    },
                    "sap.card": {
                        id: "test1"
                    }
                }
            },
            type: "sap.card"
        };

        var aWidgetConfigurations = [];

        var aManifestChangesToApply = [];

        // Act
        var oResult = this.oController._createCard(oVizData, aWidgetConfigurations, aManifestChangesToApply, "/test/path/to/widget");


        // Assert
        assert.ok(oResult.isA("sap.ui.integration.widgets.Card"), "A Card was returned");
        assert.deepEqual(oResult.getActionDefinitions(), [], "Card doesn't have any ActionDefinition");
        assert.deepEqual(oResult.getManifestChanges(), aManifestChangesToApply, "manifestChanges was set accordingly to the card by level");
    });

    QUnit.test("Returns a card with the 'Reset' action definition ", function (assert) {
        //Arrange
        var oVizData = {
            id: "viz",
            descriptor: {
                value: {
                    "sap.app": {
                        id: "test1"
                    },
                    "sap.card": {
                        id: "test1"
                    }
                }
            },
            type: "sap.card"
        };

        var aWidgetConfigurations = [
            {
                id: "conf_0",
                level: "PR",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title (PR)"
                    }
                }
            },
            {
                id: "conf_1",
                level: "CO",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title (CO)"
                    }
                }
            },
            {
                id: "conf_2",
                level: "PG",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title (PG)"
                    }
                }
            },
            {
                id: "conf_3",
                level: "US",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title (US)"
                    }
                }
            }
        ];

        var aManifestChangesToApply = [
            { "/sap.card/header/title": "Sample title (PR)" },
            { "/sap.card/header/title": "Sample title (CO)" },
            { "/sap.card/header/title": "Sample title (PG)" },
            { "/sap.card/header/title": "Sample title (US)" }
        ];

        // Act
        var oResult = this.oController._createCard(oVizData, aWidgetConfigurations, aManifestChangesToApply, "/test/path/to/widget");


        // Assert
        assert.ok(oResult.isA("sap.ui.integration.widgets.Card"), "A Card was returned");
        assert.strictEqual(oResult.getActionDefinitions().length, 1, "Card has one ActionDefinition");
        assert.ok(oResult.getActionDefinitions()[0].isA("sap.ui.integration.ActionDefinition"), "An action definition was assigned to the card");
        assert.strictEqual(oResult.getActionDefinitions()[0].getText(), "Reset", "Card has the 'Reset' ActionDefinition");
        assert.deepEqual(oResult.getManifestChanges(), aManifestChangesToApply, "manifestChanges was set accordingly to the card by level");
    });

    QUnit.test("Returns a card with the 'Configure' action definition", function (assert) {
        //Arrange
        var oVizData = {
            id: "viz",
            descriptor: {
                value: {
                    "sap.app": {
                        id: "test1"
                    },
                    "sap.card": {
                        id: "test1",
                        configuration: {
                            parameters: {
                                title: {
                                    value: "test title"
                                }
                            }
                        }
                    }
                }
            },
            type: "sap.card"
        };

        var aWidgetConfigurations = [];

        var aManifestChangesToApply = [];

        // Act
        var oResult = this.oController._createCard(oVizData, aWidgetConfigurations, aManifestChangesToApply, "/test/path/to/widget");

        // Assert
        assert.ok(oResult.isA("sap.ui.integration.widgets.Card"), "A Card was returned");
        assert.strictEqual(oResult.getActionDefinitions().length, 1, "Card has one ActionDefinition");
        assert.ok(oResult.getActionDefinitions()[0].isA("sap.ui.integration.ActionDefinition"), "An action definition was assigned to the card");
        assert.strictEqual(oResult.getActionDefinitions()[0].getText(), "Configure", "Card has the 'Configure' ActionDefinition");
    });

    QUnit.test("Returns a card with the 'Configure' and 'Reset' action definitions", function (assert) {
        //Arrange
        var oVizData = {
            id: "viz",
            descriptor: {
                value: {
                    "sap.app": {
                        id: "test1"
                    },
                    "sap.card": {
                        id: "test1",
                        configuration: {
                            parameters: {
                                title: {
                                    value: "test title"
                                }
                            }
                        }
                    }
                }
            },
            type: "sap.card"
        };

        var aWidgetConfigurations = [
            {
                id: "conf_0",
                level: "PR",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title (PR)"
                    }
                }
            },
            {
                id: "conf_1",
                level: "CO",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title (CO)"
                    }
                }
            },
            {
                id: "conf_2",
                level: "PG",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title (PG)"
                    }
                }
            },
            {
                id: "conf_3",
                level: "US",
                settings: {
                    value: {
                        "/sap.card/header/title": "Sample title (US)"
                    }
                }
            }
        ];

        var aManifestChangesToApply = [
            { "/sap.card/header/title": "Sample title (PR)" },
            { "/sap.card/header/title": "Sample title (CO)" },
            { "/sap.card/header/title": "Sample title (PG)" },
            { "/sap.card/header/title": "Sample title (US)" }
        ];

        // Act
        var oResult = this.oController._createCard(oVizData, aWidgetConfigurations, aManifestChangesToApply, "/test/path/to/widget");

        // Assert
        assert.ok(oResult.isA("sap.ui.integration.widgets.Card"), "A Card was returned");
        assert.strictEqual(oResult.getActionDefinitions().length, 2, "Card has two ActionDefinitions");
        assert.ok(oResult.getActionDefinitions()[0].isA("sap.ui.integration.ActionDefinition"), "An action definition was assigned to the card");
        assert.ok(oResult.getActionDefinitions()[1].isA("sap.ui.integration.ActionDefinition"), "An action definition was assigned to the card");
        assert.strictEqual(oResult.getActionDefinitions()[0].getText(), "Configure", "Card has the 'Configure' ActionDefinition");
        assert.strictEqual(oResult.getActionDefinitions()[1].getText(), "Reset", "Card has the 'Reset' ActionDefinition");
    });

    QUnit.module("WorkPageBuilderController - _saveHost", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            this.oController = new WorkPageBuilderController();

            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            Container.init("local").then(function () {
                sandbox.stub(this.oController, "getOwnerComponent").returns({
                    getUshellContainer: sandbox.stub().returns(Container)
                });
                sandbox.stub(this.oController, "getView").returns({
                    getModel: sandbox.stub().returns({
                        getResourceBundle: sandbox.stub().returns({
                            getText: sandbox.stub()
                        })
                    })
                });
                fnDone();
            }.bind(this));

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.oHost.destroy();
            this.oController.destroy();
        }
    });

    QUnit.test("saves the host and attaches the action handler", function (assert) {
        // Act
        this.oController.oModel = new JSONModel();
        this.oController._saveHost();

        // Assert
        assert.ok(this.oController.oHost.isA("sap.ui.integration.Host"), "The host was created.");
        assert.strictEqual(this.oController.oHost.mEventRegistry.action.length, 1, "The action handler was attached to the host.");
    });

    QUnit.test("propagates navigationDisabled correctly to host", function (assert) {
        // Act
        this.oController.oModel = new JSONModel();
        this.oController._saveHost();
        this.oController.oHost._setNavigationDisabled = sandbox.stub();
        var oBindings = this.oController.oModel.getBindings();

        // Assert
        assert.ok(this.oController.oHost.isA("sap.ui.integration.Host"), "The host was created.");
        assert.ok(this.oController.oHost._bNavigationDisabled === false, "_bNavigationDisabled false on host");
        assert.ok(oBindings[0].getValue() === undefined, "binding/model value for /navigationDisabled is undefined");
        assert.ok(oBindings.length === 1, "has a property binding");
        assert.ok(oBindings[0].getPath() === "/navigationDisabled", "property binding points to /navigationDisabled");
        assert.ok(oBindings[0].mEventRegistry.change[0], "property binding has a change handler");
        assert.ok(this.oController.oHost._setNavigationDisabled.notCalled, "_setNavigationDisabled not called");

        // Act - value change for navigationDisabled - true
        this.oController.oModel.setProperty("/navigationDisabled", true);

        // Assert
        assert.ok(this.oController.oModel.getProperty("/navigationDisabled") === true, "Model value is updated true");
        assert.ok(this.oController.oHost._setNavigationDisabled.calledOnce, "setNavigationDisabled (binding listener) called first time on host");

        // Act - value change for navigationDisabled - false
        this.oController.oModel.setProperty("/navigationDisabled", false);

        // Assert
        assert.ok(this.oController.oModel.getProperty("/navigationDisabled") === false, "Model value is updated to false");
        assert.ok(this.oController.oHost._setNavigationDisabled.calledTwice, "setNavigationDisabled (binding listener) called second time on host");
    });

    QUnit.test("avoids property binding if there is no model", function (assert) {
        // Act
        this.oController._saveHost();

        // Assert
        assert.ok(this.oController.oHost.isA("sap.ui.integration.Host"), "The host was created.");
        assert.strictEqual(this.oController.oHost.mEventRegistry.action.length, 1, "The action handler was attached to the host.");
    });

    QUnit.test("the host resolves the destination correctly", function (assert) {
        // Act
        this.oController._saveHost();

        // Assert
        return this.oController.oHost.getResolveDestination()("testDest", "oCard").then(function (sDestination) {
            assert.strictEqual(sDestination, "/dynamic_dest/testDest", "The destination was created");
        });
    });

    QUnit.test("the host rejects if no destination name is given", function (assert) {
        // Act
        this.oController._saveHost();

        // Assert
        return this.oController.oHost.getResolveDestination()().catch(function () {
            assert.ok(true, "The promise was rejected.");
        });
    });

    QUnit.module("WorkPageBuilderController - closeEditMode", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oFireEventStub = sandbox.stub();
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("SaveEditChanges fires the 'closeEditMode' event", function (assert) {
        // Act
        this.oController.saveEditChanges();

        // Assert
        assert.ok(this.oFireEventStub.calledWith("closeEditMode", { saveChanges: true }), "The 'closeEditMode' event with saveChanges:true was fired");
    });

    QUnit.test("CancelEditChanges fires the 'closeEditMode' event", function (assert) {
        // Act
        this.oController.cancelEditChanges();

        // Assert
        assert.ok(this.oFireEventStub.calledWith("closeEditMode", { saveChanges: false }), "The 'closeEditMode' event with saveChanges:false was fired");
    });

    QUnit.module("setEditMode", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oSetPropertyStub = sandbox.stub();
            this.oController.oModel = new JSONModel();

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("sets editMode: true to the model.", function (assert) {
        // Act
        this.oController.setEditMode(true);

        // Assert
        assert.strictEqual(this.oController.oModel.getProperty("/editMode"), true, "editMode was set to true.");
    });

    QUnit.test("sets editMode: false to the model.", function (assert) {
        // Act
        this.oController.setEditMode(false);

        // Assert
        assert.strictEqual(this.oController.oModel.getProperty("/editMode"), false, "editMode was set to false.");
    });

    QUnit.module("getPreviewMode", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oController.oModel = new JSONModel({
                previewMode: true,
                loaded: false,
                data: {
                    WorkPage: null,
                    Visualizations: [],
                    UsedVisualizations: []
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("returns the value of previewMode", function (assert) {
        // Assert
        assert.strictEqual(this.oController.getPreviewMode(true), true, "previewMode was returned.");
    });

    QUnit.module("setPreviewMode", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oSetPropertyStub = sandbox.stub();
            this.oController.oModel = new JSONModel();

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("sets previewMode: true to the model.", function (assert) {
        // Act
        this.oController.setPreviewMode(true);

        // Assert
        assert.strictEqual(this.oController.oModel.getProperty("/previewMode"), true, "previewMode was set to true.");
    });

    QUnit.test("sets previewMode: false to the model.", function (assert) {
        // Act
        this.oController.setPreviewMode(false);

        // Assert
        assert.strictEqual(this.oController.oModel.getProperty("/previewMode"), false, "previewMode was set to false.");
    });

    QUnit.module("getEditMode", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oController.oModel = new JSONModel({
                editMode: true,
                loaded: false,
                data: {
                    workPage: null,
                    visualizations: [],
                    usedVisualizations: []
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("returns the value of editMode", function (assert) {
        // Assert
        assert.strictEqual(this.oController.getEditMode(true), true, "editMode was returned.");
    });


    QUnit.module("setPageData", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oController.oModel = new JSONModel({
                editMode: true,
                loaded: false,
                data: {
                    workPage: null,
                    visualizations: [],
                    usedVisualizations: []
                }
            });
            this.oPageData = {
                workPage: {
                    contents: {
                        rows: [{
                            id: 0,
                            columns: [{
                                id: 0,
                                descriptor: { value: { columnWidth: 12 } },
                                cells: [{
                                    id: "",
                                    descriptor: {},
                                    widgets: []
                                }]
                            }]
                        }, {
                            id: 1,
                            columns: [{
                                id: 0,
                                descriptor: { value: { columnWidth: 12 } },
                                cells: [{
                                    id: "",
                                    descriptor: {},
                                    widgets: []
                                }]
                            }]
                        }]
                    }
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("sets the given data to the /data property and sets /loaded to true", function (assert) {
        // Act
        this.oController.setPageData(this.oPageData);

        // Assert
        assert.deepEqual(this.oController.oModel.getProperty("/data/workPage"), this.oPageData.workPage.contents, "The page data was set to the model");
        assert.strictEqual(this.oController.oModel.getProperty("/loaded"), true, "The /loaded property was set to true");
    });

    QUnit.test("transforms the usedVisualizations to a map", function (assert) {
        // Arrange
        this.oPageData.workPage.usedVisualizations = {
            nodes: [{
                id: "viz1",
                descriptor: {
                    value: {
                        "sap.app": {
                            title: "Test 1"
                        }
                    }
                }
            }, {
                id: "viz2",
                descriptor: {
                    value: {
                        "sap.app": {
                            title: "Test 2"
                        }
                    }
                }
            }, {
                id: "viz3",
                descriptor: {
                    value: {
                        "sap.app": {
                            title: "Test 3"
                        }
                    }
                }
            }]
        };

        var oExpectedUsedVisualizations = {
            viz1: {
                id: "viz1",
                descriptor: {
                    value: {
                        "sap.app": {
                            title: "Test 1"
                        }
                    }
                }
            },
            viz2: {
                id: "viz2",
                descriptor: {
                    value: {
                        "sap.app": {
                            title: "Test 2"
                        }
                    }
                }
            },
            viz3: {
                id: "viz3",
                descriptor: {
                    value: {
                        "sap.app": {
                            title: "Test 3"
                        }
                    }
                }
            }
        };
        // Act
        this.oController.setPageData(this.oPageData);

        // Assert
        assert.deepEqual(this.oController.oModel.getProperty("/data/workPage"), this.oPageData.workPage.contents, "The page data was set to the model");
        assert.deepEqual(this.oController.oModel.getProperty("/data/usedVisualizations"), oExpectedUsedVisualizations, "The usedVisualizations data was mapped and set to the model");
        assert.strictEqual(this.oController.oModel.getProperty("/loaded"), true, "The /loaded property was set to true");
    });


    QUnit.test("if no usedVisualizations exist, create empty object", function (assert) {
        // Arrange
        this.oPageData.workPage.usedVisualizations = {
            nodes: []
        };
        // Act
        this.oController.setPageData(this.oPageData);

        // Assert
        assert.deepEqual(this.oController.oModel.getProperty("/data/workPage"), this.oPageData.workPage.contents, "The page data was set to the model");
        assert.deepEqual(this.oController.oModel.getProperty("/data/usedVisualizations"), {}, "The usedVisualizations data was mapped and set to the model");
        assert.strictEqual(this.oController.oModel.getProperty("/loaded"), true, "The /loaded property was set to true");
    });

    QUnit.module("getPageData", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oModelData = {
                visualizations: [],
                usedVisualizations: {
                    viz1: {
                        id: "viz1",
                        descriptor: {},
                        type: "vizType"
                    },
                    viz2: {
                        id: "viz2",
                        descriptor: {},
                        type: "vizType"
                    }
                },
                workPage: {
                    rows: [{
                        id: 0,
                        columns: [{
                            id: 0,
                            descriptor: { value: { columnWidth: 12 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }]
                    }, {
                        id: 1,
                        columns: [{
                            id: 0,
                            descriptor: { value: { columnWidth: 12 } },
                            cells: [{
                                id: "",
                                descriptor: {},
                                widgets: []
                            }]
                        }]
                    }]
                }
            };
            this.oController.oModel = new JSONModel({
                editMode: false,
                loaded: false,
                data: this.oModelData
            });

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("returns the value of /data/workPage", function (assert) {
        // Assert
        assert.deepEqual(this.oController.getPageData(), {
            workPage: {
                contents: this.oModelData.workPage,
                usedVisualizations: {
                    nodes: [{
                        id: "viz1",
                        descriptor: {},
                        type: "vizType"
                    }, {
                        id: "viz2",
                        descriptor: {},
                        type: "vizType"
                    }]
                }
            }
        }, "The workPage data was returned.");
    });

    QUnit.module("setVisualizationData", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oController.oModel = new JSONModel({
                editMode: true,
                loaded: false,
                data: {
                    workPage: null,
                    visualizations: [],
                    usedVisualizations: []
                }
            });
            this.oContentFinder = {
                setVisualizationData: sandbox.stub()
            };
            this.oController.oContentFinderPromise = Promise.resolve(this.oContentFinder);
            this.aVisualizationData = {
                visualizations: {
                    nodes: [
                        { id: "Viz1" },
                        { id: "Viz2" },
                        { id: "Viz3" }
                    ]
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("sets the visualization data in the ContentFinder", function (assert) {
        // Act
        return this.oController.setVisualizationData(this.aVisualizationData).then(function () {
            // Assert
            assert.ok(this.oContentFinder.setVisualizationData.calledOnce, "ContentFinder setVisualizationData API was called");

        }.bind(this));
    });

    QUnit.module("setCategoryTree", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oContentFinder = {
                setCategoryTree: sandbox.stub()
            };
            this.oController.oContentFinderPromise = Promise.resolve(this.oContentFinder);
            this.aCategoryTree = {
                categories: {
                    nodes: [
                        { id: "Cat1" },
                        { id: "Cat2" },
                        { id: "Cat3" }
                    ]
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("sets the category tree data in the ContentFinder", function (assert) {
        // Act
        return this.oController.setCategoryTree(this.aCategoryTree).then(function () {
            // Assert
            assert.ok(this.oContentFinder.setCategoryTree.calledOnce, "ContentFinder setCategoryTree API was called");
            assert.deepEqual(this.oContentFinder.setCategoryTree.firstCall.args[0], this.aCategoryTree, "was called with the expected arguments");
        }.bind(this));
    });

    QUnit.module("setVisualizationDataPaginated", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oController.oModel = new JSONModel({
                editMode: true,
                loaded: false,
                data: {
                    workPage: null,
                    visualizations: [],
                    usedVisualizations: []
                }
            });
            this.oContentFinder = {
                setVisualizationData: sandbox.stub()
            };
            this.oController.oContentFinderPromise = Promise.resolve(this.oContentFinder);
            this.oVisualizationData = {
                visualizations: {
                    nodes: [
                        { id: "Viz1" },
                        { id: "Viz2" },
                        { id: "Viz3" }
                    ]
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("sets the visualization data paginated in the ContentFinder", function (assert) {
        // Act
        return this.oController.setVisualizationData(this.oVisualizationData).then(function () {
            // Assert
            assert.ok(this.oContentFinder.setVisualizationData.calledOnce, "ContentFinder setVisualizationDataPaginated API was called");
            assert.deepEqual(
                this.oContentFinder.setVisualizationData.firstCall.args[0],
                this.oVisualizationData,
                "ContentFinder setVisualizationData API was called with the expected arguments"
            );

        }.bind(this));
    });

    QUnit.module("_resizeAllowed", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oModel = new JSONModel({
                currentBreakpoint: {
                    columnMinFlex: 4,
                    maxColumnsPerRow: 4
                }
            });

            this.oGetModelStub = sandbox.stub().returns(this.oModel);

            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });


    QUnit.test("returns false if the left column would become too small", function (assert) {
        // Act
        var bResult = this.oController._resizeAllowed(4, 4, 8, 2);

        this.oModel.setProperty("/currentBreakpoint/columnMinFlex", 6);

        var bResult2 = this.oController._resizeAllowed(4, 6, 8, 2);

        // Assert
        assert.strictEqual(bResult, false, "The expected result was returned");
        assert.strictEqual(bResult2, false, "The expected result was returned");
    });

    QUnit.test("returns false if the right column would become too small", function (assert) {
        // Act
        var bResult = this.oController._resizeAllowed(4, 8, 4, -2);

        this.oModel.setProperty("/currentBreakpoint/columnMinFlex", 6);

        var bResult2 = this.oController._resizeAllowed(4, 8, 6, -2);

        // Assert
        assert.strictEqual(bResult, false, "The expected result was returned");
        assert.strictEqual(bResult2, false, "The expected result was returned");
    });

    QUnit.test("returns false if the column count is larger than max columns per row", function (assert) {
        // Arrange
        this.oModel.setProperty("/currentBreakpoint/maxColumnsPerRow", 3);

        // Act
        var bResult = this.oController._resizeAllowed(4, 12, 12, -2);

        this.oModel.setProperty("/currentBreakpoint/maxColumnsPerRow", 2);

        var bResult2 = this.oController._resizeAllowed(3, 6, 12, -2);

        // Assert
        assert.strictEqual(bResult, false, "The expected result was returned");
        assert.strictEqual(bResult2, false, "The expected result was returned");
    });

    QUnit.test("returns true if all values are valid", function (assert) {
        // Arrange
        this.oModel.setProperty("/currentBreakpoint/maxColumnsPerRow", 3);

        // Act
        var bResult = this.oController._resizeAllowed(2, 12, 12, -2);

        this.oModel.setProperty("/currentBreakpoint/maxColumnsPerRow", 4);
        this.oModel.setProperty("/currentBreakpoint/columnMinFlex", 5);

        var bResult2 = this.oController._resizeAllowed(3, 12, 8, -2);

        // Assert
        assert.strictEqual(bResult, true, "The expected result was returned");
        assert.strictEqual(bResult2, true, "The expected result was returned");
    });

    QUnit.module("onResize", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oFireEventStub = sandbox.stub();
            this.oFireEventStub.withArgs("workPageEdited");

            this.oUpdateModelWithColumnWidthsStub = sandbox.stub(this.oController, "_updateModelWithColumnWidths");
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

            this.oGetRTLStub = sandbox.stub(Localization, "getRTL").returns(false);

            this.oGetSingleColumnWidthStub = sandbox.stub().returns(42);
            this.oGetColumnMinFlexStub = sandbox.stub().returns(5);
            this.oIndexOfAggregationStub = sandbox.stub().returns(1);
            this.oGetColumnFlexValuesStub = sandbox.stub().returns([4, 8, 8, 12]);
            this.oSetGridLayoutStringStub = sandbox.stub();

            this.oRow = {
                getSingleColumnWidth: this.oGetSingleColumnWidthStub,
                getColumnMinFlex: this.oGetColumnMinFlexStub,
                indexOfAggregation: this.oIndexOfAggregationStub,
                getColumnFlexValues: this.oGetColumnFlexValuesStub,
                setGridLayoutString: this.oSetGridLayoutStringStub
            };

            this.oColumn = {
                getParent: sandbox.stub().returns(this.oRow)
            };

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("posXDiff").returns(42);
            this.oGetSourceStub = sandbox.stub().returns(this.oColumn);

            this.oEvent = {
                getParameter: this.oGetParameterStub,
                getSource: this.oGetSourceStub
            };

            this.oResizeAllowedStub = sandbox.stub(this.oController, "_resizeAllowed").returns(false);

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("returns if the columnWidth is 0", function (assert) {
        // Arrange
        this.oGetSingleColumnWidthStub.returns(0);

        // Act
        this.oController.onResize(this.oEvent);

        // Assert
        assert.ok(this.oUpdateModelWithColumnWidthsStub.notCalled, "_updateModelWithColumnWidths was not called.");
    });

    QUnit.test("returns if the deltaFromOrigin is >-1 and <1", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("posXDiff").returns(41);

        // Act
        this.oController.onResize(this.oEvent);

        // Assert
        assert.ok(this.oUpdateModelWithColumnWidthsStub.notCalled, "_updateModelWithColumnWidths was not called.");
    });

    QUnit.test("returns if _resizeAllowed returns false", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("posXDiff").returns(-42);

        // Act
        this.oController.onResize(this.oEvent);

        // Assert
        assert.ok(this.oResizeAllowedStub.calledOnce, "_resizeAllowed was called once.");
        assert.deepEqual(this.oResizeAllowedStub.firstCall.args, [4, 4, 8, 2], "_resizeAllowed was called with the expected arguments.");
        assert.ok(this.oSetGridLayoutStringStub.notCalled, "setGridLayoutString was not called.");
        assert.ok(this.oUpdateModelWithColumnWidthsStub.notCalled, "_updateModelWithColumnWidths was not called.");
    });

    QUnit.test("drag to the right calculates the correct columnWidths", function (assert) {
        // Arrange
        this.oResizeAllowedStub.returns(true);
        this.oGetColumnMinFlexStub.returns(2);

        // Act
        this.oController.onResize(this.oEvent);

        // Assert
        assert.ok(this.oSetGridLayoutStringStub.calledOnce, "setGridLayoutString was called.");
        assert.deepEqual(this.oSetGridLayoutStringStub.firstCall.args[0], [6, 6, 8, 12], "setGridLayoutString was called with the expected arguments.");
        assert.ok(this.oUpdateModelWithColumnWidthsStub.calledOnce, "_updateModelWithColumnWidths was called.");
        assert.deepEqual(this.oUpdateModelWithColumnWidthsStub.firstCall.args, [this.oRow, 0, 1, 6, 6], "_updateModelWithColumnWidths was called with the correct arguments.");
    });

    QUnit.test("drag to the left calculates the correct columnWidths", function (assert) {
        // Arrange
        this.oResizeAllowedStub.returns(true);
        this.oIndexOfAggregationStub.returns(2);
        this.oGetParameterStub.withArgs("posXDiff").returns(-42);

        // Act
        this.oController.onResize(this.oEvent);

        // Assert
        assert.ok(this.oSetGridLayoutStringStub.calledOnce, "setGridLayoutString was called.");
        assert.deepEqual(this.oSetGridLayoutStringStub.firstCall.args[0], [4, 6, 10, 12], "setGridLayoutString was called with the expected arguments.");
        assert.ok(this.oUpdateModelWithColumnWidthsStub.calledOnce, "_updateModelWithColumnWidths was called.");
        assert.deepEqual(this.oUpdateModelWithColumnWidthsStub.firstCall.args, [this.oRow, 1, 2, 6, 10], "_updateModelWithColumnWidths was called with the correct arguments.");
    });

    QUnit.module("onResizeCompleted", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oFireEventStub = sandbox.stub();
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("fires the workPageEdited event", function (assert) {
        // Act
        this.oController.onResizeCompleted();

        // Assert
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called.");
        assert.strictEqual(this.oFireEventStub.firstCall.args[0], "workPageEdited", "fireEvent was called with the expected arguments.");
    });

    QUnit.module("_updateModelWithColumnWidths", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oModel = new JSONModel({
                TestPath: {
                    columns: [{
                        descriptor: { value: { columnWidth: 12 } }
                    }, {
                        descriptor: { value: { columnWidth: 12 } }
                    }]
                }
            });
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });

            this.oRow = {
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/TestPath")
                })
            };

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("sets the new column widths to the model", function (assert) {
        // Act
        this.oController._updateModelWithColumnWidths(this.oRow, 0, 1, 14, 10);

        // Assert
        assert.strictEqual(this.oModel.getProperty("/TestPath/columns/0/descriptor/value/columnWidth"), 14, "The left column width was set.");
        assert.strictEqual(this.oModel.getProperty("/TestPath/columns/1/descriptor/value/columnWidth"), 10, "The right column width was set.");
    });

    QUnit.module("onDeleteCell", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oModel = new JSONModel({
                TestPath: {
                    cells: [{
                        id: 1
                    }, {
                        id: 2
                    }, {
                        id: 3
                    }]
                }
            });

            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });

            this.oFireEventStub = sandbox.stub().withArgs("workPageEdited");
            this.oIndexOfAggregationStub = sandbox.stub().returns(0);
            this.oGetBindingContextStub = sandbox.stub().returns({
                getPath: sandbox.stub().returns("/TestPath")
            });
            this.oColumn = {
                indexOfAggregation: this.oIndexOfAggregationStub,
                getBindingContext: this.oGetBindingContextStub
            };
            this.oCellWidgets = [];
            this.oCell = {
                getParent: sandbox.stub().returns(this.oColumn),
                getWidgets: sandbox.stub().returns(this.oCellWidgets)
            };

            this.oEvent = {
                getSource: sandbox.stub().returns({
                    getParent: sandbox.stub().returns({
                        getParent: sandbox.stub().returns(this.oCell)
                    })
                })
            };

            this.oDetachEventStub = sandbox.stub();
            this.oAttachEventStub = sandbox.stub();
            this.oSetModelStub = sandbox.stub();
            this.oOpenStub = sandbox.stub();

            this.oDialog = {
                setModel: this.oSetModelStub,
                getBeginButton: sandbox.stub().returns({
                    detachEvent: this.oDetachEventStub,
                    attachEvent: this.oAttachEventStub
                }),
                open: this.oOpenStub
            };

            sandbox.stub(Fragment, "load").resolves(this.oDialog);

            this.oCreateIdStub = sandbox.stub().returns("TestId");
            this.oRootView = {
                createId: this.oCreateIdStub
            };

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub,
                getRootControl: sandbox.stub().returns(this.oRootView)
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("opens the delete dialog", function (assert) {
        // Act
        return this.oController.onDeleteCell(this.oEvent).then(function () {
            // Assert
            assert.ok(this.oSetModelStub.calledOnce, "setModel was called on the dialog.");
            assert.ok(this.oDetachEventStub.calledOnce, "detachEvent was called on the dialog.");
            assert.strictEqual(this.oDetachEventStub.firstCall.args[0], "press", "detachEvent was called with the correct args.");
            assert.ok(this.oAttachEventStub.calledOnce, "attachEvent was called on the dialog.");
            assert.strictEqual(this.oAttachEventStub.firstCall.args[0], "press", "attachEvent was called with the correct args.");
            assert.deepEqual(this.oAttachEventStub.firstCall.args[1], {
                cell: this.oCell,
                dialog: true
            }, "attachEvent was called with the correct args.");
            assert.ok(this.oOpenStub.calledOnce, "open was called on the dialog.");
        }.bind(this));
    });

    QUnit.test("ignore the delete dialog for cards", function (assert) {
        // Arrange
        var oIsAStub = sandbox.stub();
        oIsAStub.withArgs("sap.ui.integration.widgets.Card").returns(true);
        this.oCellWidgets[0] = { isA: oIsAStub };

        var oDeleteCellStub = sandbox.stub(this.oController, "deleteCell");
        oDeleteCellStub.returns(Promise.resolve());

        // Act
        return this.oController.onDeleteCell(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(oIsAStub.firstCall.args[0], "sap.ui.integration.widgets.Card", "isA was called to check if widget is a card.");
            assert.deepEqual(oDeleteCellStub.firstCall.args, [this.oEvent, {
                cell: this.oCell,
                dialog: false
            }], "deleteCell was called with the correct parameters");
            assert.notOk(this.oSetModelStub.called, "setModel was not called on the dialog.");
            assert.notOk(this.oDetachEventStub.called, "detachEvent was not called on the dialog.");
            assert.notOk(this.oAttachEventStub.called, "attachEvent was not called on the dialog.");
            assert.notOk(this.oOpenStub.called, "open was not called on the dialog.");
        }.bind(this));
    });

    QUnit.module("deleteCell", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oModel = new JSONModel({
                TestPath: {
                    cells: [{
                        id: 1
                    }, {
                        id: 2
                    }, {
                        id: 3
                    }]
                }
            });

            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });

            this.oFireEventStub = sandbox.stub().withArgs("workPageEdited");
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

            this.oIndexOfAggregationStub = sandbox.stub().returns(0);
            this.oGetBindingContextStub = sandbox.stub().returns({
                getPath: sandbox.stub().returns("/TestPath")
            });
            this.oColumn = {
                indexOfAggregation: this.oIndexOfAggregationStub,
                getBindingContext: this.oGetBindingContextStub
            };
            this.oCell = {
                getParent: sandbox.stub().returns(this.oColumn)
            };

            this.oEvent = {
                getSource: sandbox.stub().returns({
                    getParent: sandbox.stub().returns({
                        getParent: sandbox.stub().returns(this.oCell)
                    })
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("removes the cell from the model at index 0", function (assert) {
        // Act
        return this.oController.deleteCell(this.oEvent, { cell: this.oCell, dialog: false }).then(function () {
            // Assert
            assert.deepEqual(this.oModel.getProperty("/TestPath/cells"), [{ id: 2 }, { id: 3 }], "The cell was deleted.");
            assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called.");
        }.bind(this));
    });

    QUnit.test("removes the cell from the model at index 1", function (assert) {
        // Arrange
        this.oIndexOfAggregationStub.returns(1);
        // Act
        return this.oController.deleteCell(this.oEvent, { cell: this.oCell, dialog: false }).then(function () {
            // Assert
            assert.deepEqual(this.oModel.getProperty("/TestPath/cells"), [{ id: 1 }, { id: 3 }], "The cell was deleted.");
            assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called.");
        }.bind(this));
    });

    QUnit.test("removes the cell from the model at index 2", function (assert) {
        // Arrange
        this.oIndexOfAggregationStub.returns(2);
        // Act
        return this.oController.deleteCell(this.oEvent, { cell: this.oCell, dialog: false }).then(function () {
            // Assert
            assert.deepEqual(this.oModel.getProperty("/TestPath/cells"), [{ id: 1 }, { id: 2 }], "The cell was deleted.");
            assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called.");
        }.bind(this));
    });

    QUnit.module("onCellDeleteCancel", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oCloseStub = sandbox.stub();
            this.oDialog = {
                close: this.oCloseStub
            };
            this.oController.oDeleteCell = Promise.resolve(this.oDialog);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });
    QUnit.test("resolves with the dialog", function (assert) {
        // Act
        return this.oController.onCellDeleteCancel().then(function () {
            // Assert
            assert.ok(this.oCloseStub.calledOnce, "The dialog was closed.");
        }.bind(this));
    });

    QUnit.module("onVisualizationPress", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oModel = new JSONModel({
                widgets: [{
                    visualization: {
                        id: 1
                    }
                }, {
                    visualization: {
                        id: 2
                    }
                }, {
                    visualization: {
                        id: 3
                    }
                }]
            });

            this.oIndexOfVisualizationStub = sandbox.stub();

            this.oGetPathStub = sandbox.stub().returns("/widgets/0");
            this.oCell = {
                id: "Cell1",
                widgets: [],
                indexOfAggregation: this.oIndexOfVisualizationStub
            };

            this.oVizInstance = {
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oGetPathStub
                }),
                getParent: sandbox.stub().returns({
                    getParent: sandbox.stub().returns(this.oCell)
                })
            };

            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("scope").returns("Actions");
            this.oGetParameterStub.withArgs("action").returns("Remove");

            this.oEvent = {
                getSource: sandbox.stub().returns(this.oVizInstance),
                getParameter: this.oGetParameterStub
            };

            this.oFireEventStub = sandbox.stub().withArgs("workPageEdited");
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Removes the widget from the model at index 0", function (assert) {
        // Arrange
        this.oIndexOfVisualizationStub.returns(0);
        // Act
        this.oController.onVisualizationPress(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/widgets"), [{
            visualization: {
                id: 2
            }
        }, {
            visualization: {
                id: 3
            }
        }], "The widget at index 0 was deleted");
    });

    QUnit.test("Removes the widget from the model at index 1", function (assert) {
        // Arrange
        this.oIndexOfVisualizationStub.returns(1);
        // Act
        this.oController.onVisualizationPress(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/widgets"), [{
            visualization: {
                id: 1
            }
        }, {
            visualization: {
                id: 3
            }
        }], "The widget at index 1 was deleted");
    });

    QUnit.test("Removes the widget from the model at index 2", function (assert) {
        // Arrange
        this.oIndexOfVisualizationStub.returns(2);
        // Act
        this.oController.onVisualizationPress(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/widgets"), [{
            visualization: {
                id: 1
            }
        }, {
            visualization: {
                id: 2
            }
        }], "The widget at index 2 was deleted");
    });

    QUnit.module("onEditTitle", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oFireEventStub = sandbox.stub().withArgs("workPageEdited");
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("fires the 'workPageEdited' event", function (assert) {
        // Act
        this.oController.onEditTitle();

        // Assert
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called");
        assert.strictEqual(this.oFireEventStub.firstCall.args[0], "workPageEdited", "fireEvent was called with the corrected arguments");
    });

    QUnit.module("onWidgetAdded", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oFireEventStub = sandbox.stub().withArgs("workPageEdited");
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("fires the 'workPageEdited' event", function (assert) {
        // Act
        this.oController.onWidgetAdded();

        // Assert
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called");
        assert.strictEqual(this.oFireEventStub.firstCall.args[0], "workPageEdited", "fireEvent was called with the corrected arguments");
    });


    QUnit.module("_instantiateWidgetData", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oGenerateUniqueIdStub = sandbox.stub(this.oController, "_generateUniqueId");
            this.oGenerateUniqueIdStub.onCall(0).returns("viz1-unique-id");
            this.oGenerateUniqueIdStub.onCall(1).returns("viz2-unique-id");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }

    });

    QUnit.test("returns the expected array", function (assert) {
        // Act
        var aResult = this.oController._instantiateWidgetData([{
            vizData: {
                id: "viz1"
            }
        }, {
            vizData: {
                id: "viz2"
            }
        }]);

        // Assert
        assert.deepEqual(aResult, [{
            id: "viz1-unique-id",
            visualization: {
                id: "viz1"
            }
        }, {
            id: "viz2-unique-id",
            visualization: {
                id: "viz2"
            }
        }], "The expected array was returned");
    });

    QUnit.module("ContentFinder", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oModel = new JSONModel({
                data: {
                    usedVisualizations: {
                        viz1: { type: "sap.ushell.StaticAppLauncher" },
                        viz2: { type: "sap.ushell.DynamicAppLauncher" },
                        viz3: { type: "sap.card" }
                    }
                }
            });
            this.oController = new WorkPageBuilderController();
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs().returns(this.oModel);

            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub
            });

            const oResourceModel = new ResourceModel({
                bundleUrl: "../../../../../../../resources/sap/ushell/components/workPageBuilder/resources/resources.properties"
            });
            this.oResourceBundle = oResourceModel.getResourceBundle();
            this.oGetModelStub.withArgs("i18n").returns(oResourceModel);

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                createId: sandbox.stub(),
                fireEvent: sandbox.stub()
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }

    });

    QUnit.test("onContentFinderComponentCreated", function (assert) {
        this.oController.fnContentFinderPromiseResolve = sandbox.stub();
        var oContentFinderComponentMock = {
            attachContentFinderClosed: sandbox.stub()
        };
        var oEventMock = {
            getParameter: sandbox.stub().returns(oContentFinderComponentMock)
        };
        return this.oController.onContentFinderComponentCreated(oEventMock).then(function () {
            assert.strictEqual(oEventMock.getParameter.withArgs("component").callCount, 1, "The component was fetched from the event was called once.");
            assert.strictEqual(oContentFinderComponentMock.attachContentFinderClosed.callCount, 1, "The attachContentFinderClosed was called once.");
        });
    });

    QUnit.test("openContentFinder", function (assert) {
        var oExpectedShowParameter = {
            visualizationFilters: {
                displayed: ["tiles", "cards"],
                selected: "tiles",
                available: [
                    {
                        key: "tiles",
                        title: this.oResourceBundle.getText("ContentFinder.AppSearch.VisualizationsFilter.Tiles"),
                        types: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"]
                    },
                    {
                        key: "cards",
                        title: this.oResourceBundle.getText("ContentFinder.AppSearch.VisualizationsFilter.Cards"),
                        types: ["sap.card"]
                    }
                ]
            }
        };

        var oEvent = {
            getSource: sandbox.stub().returns({
                getWidgets: sandbox.stub(),
                getHeaderBar: sandbox.stub()
            })
        };
        var oContentFinderResolve = {
            attachVisualizationsAdded: sandbox.stub(),
            attachVisualizationFilterApplied: sandbox.stub(),
            show: sandbox.stub()
        };

        this.oController.oContentFinderPromise = Promise.resolve(oContentFinderResolve);

        this.oGetModelStub.withArgs("i18n").returns(new ResourceModel({
            bundleUrl: "../../../../../../../resources/sap/ushell/components/workPageBuilder/resources/resources.properties"
        }));

        return this.oController.openContentFinder(oEvent).then(function () {
            assert.strictEqual(oContentFinderResolve.attachVisualizationsAdded.calledOnce, true);
            assert.strictEqual(oContentFinderResolve.attachVisualizationFilterApplied.calledOnce, true);
            assert.deepEqual(oContentFinderResolve.show.firstCall.args, [oExpectedShowParameter], "The ContentFinder was opened with the expected parameters.");
        });
    });

    QUnit.test("openTilesAppSearch", function (assert) {
        var oWorkPageCell = new WorkPageCell();

        oWorkPageCell.getWidgets = sandbox.stub().returns([{
            getProperty: sandbox.stub(),
            isA: sandbox.stub().returns("sap.ushell.ui.launchpad.VizInstanceCdm")
        }]);

        var oExpectedShowParameter = {
            visualizationFilters: {
                displayed: ["tiles"],
                selected: "tiles",
                available: [
                    {
                        key: "tiles",
                        title: this.oResourceBundle.getText("ContentFinder.AppSearch.VisualizationsFilter.Tiles"),
                        types: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"]
                    }
                ]
            }
        };

        var oEvent = {
            getSource: sandbox.stub().returns({
                getParent: sandbox.stub().returns({
                    getParent: sandbox.stub().returns(oWorkPageCell)
                })
            })
        };

        var oContentFinderResolve = {
            setContextData: sandbox.stub(),
            attachVisualizationsAdded: sandbox.stub(),
            attachVisualizationFilterApplied: sandbox.stub(),
            show: sandbox.stub()
        };

        this.oController.oContentFinderPromise = Promise.resolve(oContentFinderResolve);

        return this.oController.openTilesAppSearch(oEvent).then(function () {
            assert.strictEqual(oContentFinderResolve.setContextData.calledOnce, true);
            assert.strictEqual(oContentFinderResolve.attachVisualizationsAdded.calledOnce, true);
            assert.strictEqual(oContentFinderResolve.attachVisualizationFilterApplied.calledOnce, true);
            assert.deepEqual(oContentFinderResolve.show.firstCall.args, [oExpectedShowParameter], "The ContentFinder was opened with the expected parameters.");
        });
    });

    QUnit.test("onAddVisualization: WorkPageCell", function (assert) {
        var oWorkPageCell = new WorkPageCell();
        var aVisualization = [
            {
                id: "viz1",
                vizData: {
                    id: "viz1",
                    type: "sap.ushell.StaticAppLauncher"
                }
            },
            {
                id: "viz4",
                vizData: {
                    id: "viz4",
                    type: "sap.ushell.StaticAppLauncher"
                }
            }];

        var oEvent = { getParameter: sandbox.stub().withArgs("visualizations").returns(aVisualization) };

        var sPath = "/data/workPage/rows/0/columns/0/cells/0";
        var oGetPropertyStub = sandbox.stub().withArgs(sPath).returns({ widgets: [] });
        this.oModel.getProperty = oGetPropertyStub;

        sandbox.stub(oWorkPageCell, "getBindingContext").returns({
            getPath: sandbox.stub().returns(sPath)
        });

        sandbox.spy(this.oController, "_instantiateWidgetData");
        sandbox.spy(this.oController, "_setCellData");


        this.oController._generateUniqueId = sandbox.stub();
        this.oController.onWidgetAdded = sandbox.stub();

        //Act
        this.oController._onAddVisualization(oEvent, oWorkPageCell);

        //Assert
        assert.strictEqual(this.oController._instantiateWidgetData.firstCall.args[0], aVisualization);
        assert.strictEqual(this.oController._setCellData.firstCall.args[0], oWorkPageCell);
    });

    QUnit.test("onAddVisualization: WorkPageColumn", function (assert) {
        var oWorkPageColumn = new WorkPageColumn();
        var aVisualization = [
            {
                id: "viz3",
                vizData: {
                    id: "viz3",
                    type: "sap.card"
                }
            },
            {
                id: "viz4",
                vizData: {
                    id: "viz4",
                    type: "sap.ushell.StaticAppLauncher"
                }
            }];

        var oEvent = { getParameter: sandbox.stub().withArgs("visualizations").returns(aVisualization) };

        var sPath = "/data/workPage/rows/0/columns/0";
        var oGetPropertyStub = sandbox.stub().withArgs(sPath).returns({ cells: [] });
        this.oModel.getProperty = oGetPropertyStub;


        sandbox.stub(oWorkPageColumn, "getBindingContext").returns({
            getPath: sandbox.stub().returns(sPath)
        });

        sandbox.spy(this.oController, "_instantiateWidgetData");
        sandbox.spy(this.oController, "_setColumnData");


        this.oController._generateUniqueId = sandbox.stub();
        this.oController.onWidgetAdded = sandbox.stub();

        //Act
        this.oController._onAddVisualization(oEvent, oWorkPageColumn);

        //Assert
        assert.strictEqual(this.oController._instantiateWidgetData.firstCall.args[0], aVisualization);
        assert.strictEqual(this.oController._setColumnData.firstCall.args[0], oWorkPageColumn);
    });

    QUnit.module("onDeleteRow", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();
            this.oAddDependentStub = sandbox.stub();

            this.oWorkPageRowContext = {
                row: "context"
            };

            this.oEvent = {
                getSource: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns(this.oWorkPageRowContext)
                })
            };

            this.oDetachEventStub = sandbox.stub();
            this.oAttachEventStub = sandbox.stub();
            this.oSetModelStub = sandbox.stub();
            this.oOpenStub = sandbox.stub();

            this.oDialog = {
                setModel: this.oSetModelStub,
                getBeginButton: sandbox.stub().returns({
                    detachEvent: this.oDetachEventStub,
                    attachEvent: this.oAttachEventStub
                }),
                open: this.oOpenStub
            };

            sandbox.stub(Fragment, "load").resolves(this.oDialog);

            this.oCreateIdStub = sandbox.stub().returns("TestId");
            this.oRootView = {
                createId: this.oCreateIdStub
            };
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                getRootControl: sandbox.stub().returns(this.oRootView)
            });

            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub()
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });
    QUnit.test("opens the delete dialog", function (assert) {
        // Act
        return this.oController.onDeleteRow(this.oEvent).then(function () {

            // Assert
            assert.ok(this.oSetModelStub.calledOnce, "setModel was called on the dialog.");
            assert.ok(this.oDetachEventStub.calledOnce, "detachEvent was called on the dialog.");
            assert.strictEqual(this.oDetachEventStub.firstCall.args[0], "press", "detachEvent was called with the correct args.");
            assert.ok(this.oAttachEventStub.calledOnce, "attachEvent was called on the dialog.");
            assert.strictEqual(this.oAttachEventStub.firstCall.args[0], "press", "attachEvent was called with the correct args.");
            assert.deepEqual(this.oAttachEventStub.firstCall.args[1], { rowContext: this.oWorkPageRowContext }, "attachEvent was called with the correct args.");
            assert.ok(this.oOpenStub.calledOnce, "open was called on the dialog.");
        }.bind(this));
    });

    QUnit.module("deleteRow", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();
            this.oModel = new JSONModel({
                data: {
                    workPage: {
                        rows: [
                            { id: 1, descriptor: { value: { title: "Test 1" } } },
                            { id: 2, descriptor: { value: { title: "Test 2" } } },
                            { id: 3, descriptor: { value: { title: "Test 3" } } }
                        ]
                    }
                }
            });

            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });

            this.oGetObjectStub = sandbox.stub().returns({ id: 1, descriptor: { value: { title: "Test 1" } } });
            this.oRowContext = {
                getObject: this.oGetObjectStub
            };

            this.oRowData = {
                rowContext: this.oRowContext
            };

            this.oCloseStub = sandbox.stub();
            this.oDialog = {
                close: this.oCloseStub
            };

            this.oController.oLoadDeleteDialog = Promise.resolve(this.oDialog);

            this.oFireEventStub = sandbox.stub().withArgs("workPageEdited");

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });
    QUnit.test("removes the row at index 0 from the model", function (assert) {
        // Act
        return this.oController.deleteRow(null, this.oRowData).then(function () {

            // Assert
            assert.deepEqual(this.oModel.getProperty("/data/workPage/rows"), [
                { id: 2, descriptor: { value: { title: "Test 2" } } },
                { id: 3, descriptor: { value: { title: "Test 3" } } }
            ], "The row at index 0 was deleted.");
            assert.ok(this.oCloseStub.calledOnce, "close was called on the dialog");
            assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called");
        }.bind(this));
    });

    QUnit.test("removes the row at index 1 from the model", function (assert) {
        // Arrange
        this.oGetObjectStub.returns({ id: 2, descriptor: { value: { title: "Test 2" } } });

        // Act
        return this.oController.deleteRow(null, this.oRowData).then(function () {

            // Assert
            assert.deepEqual(this.oModel.getProperty("/data/workPage/rows"), [
                { id: 1, descriptor: { value: { title: "Test 1" } } },
                { id: 3, descriptor: { value: { title: "Test 3" } } }
            ], "The row at index 1 was deleted.");
            assert.ok(this.oCloseStub.calledOnce, "close was called on the dialog");
            assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called");
        }.bind(this));
    });

    QUnit.test("removes the row at index 2 from the model", function (assert) {
        // Arrange
        this.oGetObjectStub.returns({ id: 3, descriptor: { value: { title: "Test 3" } } });

        // Act
        return this.oController.deleteRow(null, this.oRowData).then(function () {

            // Assert
            assert.deepEqual(this.oModel.getProperty("/data/workPage/rows"), [
                { id: 1, descriptor: { value: { title: "Test 1" } } },
                { id: 2, descriptor: { value: { title: "Test 2" } } }
            ], "The row at index 1 was deleted.");
            assert.ok(this.oCloseStub.calledOnce, "close was called on the dialog");
            assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called");
        }.bind(this));
    });

    QUnit.module("onRowDeleteCancel", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();

            this.oCloseStub = sandbox.stub();
            this.oDialog = {
                close: this.oCloseStub
            };
            this.oController.oLoadDeleteDialog = Promise.resolve(this.oDialog);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });
    QUnit.test("resolves with the dialog", function (assert) {
        // Act
        return this.oController.onRowDeleteCancel().then(function () {

            // Assert
            assert.ok(this.oCloseStub.calledOnce, "The dialog was closed.");
        }.bind(this));
    });

    QUnit.module("_createVizInstance", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();

            this.oGetLayoutStub = sandbox.stub().returns({
                columns: 2,
                rows: 2
            });

            this.oVizInstance = {
                getLayout: this.oGetLayoutStub
            };

            this.oAttachPressStub = sandbox.stub().returns(this.oVizInstance);
            this.oBindEditableStub = sandbox.stub().returns(this.oVizInstance);
            this.oBindSizeBehaviorStub = sandbox.stub().returns(this.oVizInstance);
            this.oBindClickableStub = sandbox.stub().returns(this.oVizInstance);
            this.oSetLayoutDataStub = sandbox.stub().returns(this.oVizInstance);
            this.oSetActiveStub = sandbox.stub().returns(this.oVizInstance);
            this.oBindPreviewStub = sandbox.stub().returns(this.oVizInstance);

            this.oVizInstance.attachPress = this.oAttachPressStub;
            this.oVizInstance.bindEditable = this.oBindEditableStub;
            this.oVizInstance.bindSizeBehavior = this.oBindSizeBehaviorStub;
            this.oVizInstance.bindClickable = this.oBindClickableStub;
            this.oVizInstance.setLayoutData = this.oSetLayoutDataStub;
            this.oVizInstance.setActive = this.oSetActiveStub;
            this.oVizInstance.bindPreview = this.oBindPreviewStub;

            this.oController.oWorkPageVizInstantiation = new WorkPageVizInstantiation();
            this.oCreateVizInstanceStub = sandbox.stub(this.oController.oWorkPageVizInstantiation,
                "createVizInstance").returns(this.oVizInstance);

            this.oController.oModel = new JSONModel({
                navigationDisabled: false,
                previewMode: true
            });

            this.oDataInput = {
                id: "test-viz-id"
            };
            this.oExpectedVizData = deepExtend({}, this.oDataInput, {
                preview: true
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("returns error VizInstance if VizInstance was not created service is not initialized", function (assert) {
        // Arrange
        this.oCreateVizInstanceStub.returns(null);

        // Act
        var oResult = this.oController._createVizInstance(this.oDataInput);

        // Assert
        assert.ok(oResult.isA("sap.ushell.ui.launchpad.VizInstanceCdm"), "The VizInstance was created.");

    });

    QUnit.test("calls createVizInstance with the expected arguments", function (assert) {

        // Act
        this.oController._createVizInstance(this.oDataInput);

        // Assert
        assert.deepEqual(this.oCreateVizInstanceStub.firstCall.args[0], this.oExpectedVizData, "The viz data was as expected.");

        assert.ok(this.oSetActiveStub.calledOnce, "setActive was called");
        assert.ok(this.oBindPreviewStub.calledOnce, "bindPreview was called");
        assert.ok(this.oAttachPressStub.calledOnce, "attachPress was called");
        assert.ok(this.oBindEditableStub.calledOnce, "bindEditable was called");
        assert.ok(this.oBindSizeBehaviorStub.calledOnce, "bindSizeBehavior was called");
        assert.ok(this.oBindClickableStub.calledOnce, "bindClickable was called");
        assert.ok(this.oSetLayoutDataStub.calledOnce, "setLayoutData was called");
    });

    QUnit.test("does not modify the data input", function (assert) {
        const oOriginalDataInput = deepExtend({}, this.oDataInput);

        // Act
        this.oController._createVizInstance(this.oDataInput);

        // Assert
        assert.deepEqual(oOriginalDataInput, this.oDataInput, "The original viz data was not modified.");
    });

    QUnit.test("calls createVizInstance with the expected arguments when navigation is disabled and _siteData is provided", function (assert) {
        // Arrange
        this.oController.oModel.setProperty("/navigationDisabled", true);
        this.oDataInput._siteData = {
            target: { some: "target" },
            targetURL: "#Some-hash?with=parameters"
        };
        this.oExpectedVizData._siteData = {};

        // Act
        this.oController._createVizInstance(this.oDataInput);

        // Assert
        assert.deepEqual(this.oCreateVizInstanceStub.firstCall.args[0], this.oExpectedVizData, "The instantiation data was as expected.");
    });

    QUnit.test("calls createVizInstance with the expected arguments when navigation is disabled and no _siteData is provided", function (assert) {
        // Arrange
        this.oController.oModel.setProperty("/navigationDisabled", true);

        // Act
        this.oController._createVizInstance(this.oDataInput);

        // Assert
        assert.deepEqual(this.oCreateVizInstanceStub.firstCall.args[0], this.oExpectedVizData, "The instantiation data was as expected.");
    });


    QUnit.module("getNavigationDisabled / setNavigationDisabled", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();
            this.oController.oModel = new JSONModel({
                navigationDisabled: false
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("navigationDisabled property is correctly set", function (assert) {
        // Act
        this.oController.setNavigationDisabled(true);
        // Assert
        assert.strictEqual(this.oController.getNavigationDisabled(), true, "navigationDisabled was set to true");
        // Act
        this.oController.setNavigationDisabled(false);
        // Assert
        assert.strictEqual(this.oController.getNavigationDisabled(), false, "navigationDisabled was set to false");
    });

    QUnit.module("onCellDrop", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();

            this.oIndexOfAggregationStub = sandbox.stub();
            this.oSourceColumn = {
                indexOfAggregation: this.oIndexOfAggregationStub
            };
            this.oSourceCell = {
                getParent: sandbox.stub().returns(this.oSourceColumn)
            };

            this.oTargetColumn = {
                indexOfAggregation: this.oIndexOfAggregationStub
            };
            this.oTargetCell = {
                getParent: sandbox.stub().returns(this.oTargetColumn)
            };

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("draggedControl").returns(this.oSourceCell);
            this.oGetParameterStub.withArgs("droppedControl").returns(this.oTargetCell);

            this.oEvent = {
                getParameter: this.oGetParameterStub
            };

            this.oMoveCellStub = sandbox.stub(this.oController, "_moveCell");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("calls _moveCell as expected", function (assert) {
        // Arrange
        this.oIndexOfAggregationStub.returns(123);
        // Act
        this.oController.onCellDrop(this.oEvent);
        // Assert
        assert.strictEqual(this.oMoveCellStub.callCount, 1, "_moveCell was called exactly once");
        assert.deepEqual(this.oMoveCellStub.getCall(0).args, [this.oSourceColumn, this.oTargetColumn, 123, 123], "_moveCell was called with the expected arguments");
    });

    QUnit.test("properly adjusts the index when dropPosition is 'After'", function (assert) {
        // Arrange
        this.oIndexOfAggregationStub.returns(123);
        this.oGetParameterStub.withArgs("dropPosition").returns("After");
        // Act
        this.oController.onCellDrop(this.oEvent);
        // Assert
        assert.strictEqual(this.oMoveCellStub.callCount, 1, "_moveCell was called exactly once");
        assert.deepEqual(this.oMoveCellStub.getCall(0).args, [this.oSourceColumn, this.oTargetColumn, 123, 124], "_moveCell was called with the expected arguments");
    });

    QUnit.module("onCellDropOnEmptyColumn", {
        beforeEach: function () {
            this.oDestinationFetchStub = sandbox.stub(destinationResolver.prototype, "fetchData")
                .returns("test-data");

            this.oDestinationResolverStub = sandbox.stub(destinationResolver.prototype, "resolveCardDestination")
                .returns(Promise.resolve("/dynamic_dest/testDest"));

            this.oController = new WorkPageBuilderController();

            this.oIndexOfAggregationStub = sandbox.stub();
            this.oSourceColumn = {
                indexOfAggregation: this.oIndexOfAggregationStub
            };
            this.oSourceCell = {
                getParent: sandbox.stub().returns(this.oSourceColumn)
            };

            this.oTargetColumn = {
                indexOfAggregation: this.oIndexOfAggregationStub
            };

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("draggedControl").returns(this.oSourceCell);
            this.oGetParameterStub.withArgs("droppedControl").returns(this.oTargetColumn);

            this.oEvent = {
                getParameter: this.oGetParameterStub
            };

            this.oMoveCellStub = sandbox.stub(this.oController, "_moveCell");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("calls _moveCell as expected", function (assert) {
        // Arrange
        this.oIndexOfAggregationStub.returns(123);
        // Act
        this.oController.onCellDropOnEmptyColumn(this.oEvent);
        // Assert
        assert.strictEqual(this.oMoveCellStub.callCount, 1, "_moveCell was called exactly once");
        assert.deepEqual(this.oMoveCellStub.getCall(0).args, [this.oSourceColumn, this.oTargetColumn, 123, 0], "_moveCell was called with the expected arguments");
    });

    QUnit.module("_moveCell", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oData = {
                data: {
                    workPage: {
                        rows: [
                            {
                                id: "row0",
                                columns: [
                                    {
                                        id: "row0_col0",
                                        cells: [
                                            {
                                                id: "row0_col0_cell0",
                                                widgets: [
                                                    {
                                                        id: "1"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "row0_col1",
                                        cells: [
                                            {
                                                id: "row0_col1_cell0",
                                                widgets: [
                                                    {
                                                        id: "2"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "row0_col2",
                                        cells: [
                                            {
                                                id: "row0_col2_cell0",
                                                widgets: [
                                                    {
                                                        id: "3"
                                                    }
                                                ]
                                            },
                                            {
                                                id: "row0_col2_cell1",
                                                widgets: [
                                                    {
                                                        id: "4"
                                                    }
                                                ]
                                            },
                                            {
                                                id: "row0_col2_cell2",
                                                widgets: [
                                                    {
                                                        id: "5"
                                                    }
                                                ]
                                            }
                                        ]

                                    }
                                ]
                            }
                        ]
                    }
                }
            };

            this.oModel = new JSONModel(this.oData);

            this.oModelStub = sandbox.stub();
            this.oModelStub.withArgs("i18n").returns({
                getResourceBundle: sandbox.stub().returns({
                    getText: sandbox.stub()
                })
            });
            this.oModelStub.withArgs().returns(this.oModel);

            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oModelStub
            });

            this.oSourceColumnBindingPathStub = sandbox.stub();
            this.oTargetColumnBindingPathStub = sandbox.stub();

            this.oSourceColumn = {
                getId: sandbox.stub().returns("test-source-id"),
                indexOfAggregation: this.oSourceIndexOfAggregationStub,
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oSourceColumnBindingPathStub
                })
            };
            this.oTargetColumn = {
                getId: sandbox.stub().returns("test-target-id"),
                indexOfAggregation: this.oTargetIndexOfAggregationStub,
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oTargetColumnBindingPathStub
                })
            };

            this.oInvisibleMessageAnnounceStub = sandbox.stub();
            sandbox.stub(InvisibleMessage, "getInstance").returns({
                announce: this.oInvisibleMessageAnnounceStub
            });

            this.oFireEventStub = sandbox.stub();
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("moves the cell in the model from one column to another", function (assert) {
        // Arrange
        var iSourceIndex = 0;
        var iTargetIndex = 1;
        this.oSourceColumnBindingPathStub.returns("/data/workPage/rows/0/columns/0");
        this.oTargetColumnBindingPathStub.returns("/data/workPage/rows/0/columns/1");

        // Act
        this.oController._moveCell(this.oSourceColumn, this.oTargetColumn, iSourceIndex, iTargetIndex);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0"), {
            cells: [],
            id: "row0_col0"
        }, "The column was removed from the source position.");

        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/1"), {
            cells: [
                {
                    id: "row0_col1_cell0",
                    widgets: [
                        {
                            id: "2"
                        }
                    ]
                },
                {
                    id: "row0_col0_cell0",
                    widgets: [
                        {
                            id: "1"
                        }
                    ]
                }
            ],
            id: "row0_col1"
        }, "The column was inserted at position 0 of the target array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.test("moves the cell in the model within the same column below the current position", function (assert) {
        // Arrange
        var iSourceIndex = 0;
        var iTargetIndex = 3;
        this.oSourceColumnBindingPathStub.returns("/data/workPage/rows/0/columns/2");
        this.oTargetColumnBindingPathStub.returns("/data/workPage/rows/0/columns/2");

        // Act
        this.oController._moveCell(this.oSourceColumn, this.oSourceColumn, iSourceIndex, iTargetIndex);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/2"), {
            id: "row0_col2",
            cells: [{
                id: "row0_col2_cell1",
                widgets: [
                    {
                        id: "4"
                    }
                ]
            },
            {
                id: "row0_col2_cell2",
                widgets: [
                    {
                        id: "5"
                    }
                ]
            },
            {
                id: "row0_col2_cell0",
                widgets: [
                    {
                        id: "3"
                    }
                ]
            }]
        }, "The cell was moved to the correct position within the column.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.test("moves the cell in the model within the same column above the current position", function (assert) {
        // Arrange
        var iSourceIndex = 2;
        var iTargetIndex = 1;
        this.oSourceColumnBindingPathStub.returns("/data/workPage/rows/0/columns/2");
        this.oTargetColumnBindingPathStub.returns("/data/workPage/rows/0/columns/2");

        // Act
        this.oController._moveCell(this.oSourceColumn, this.oSourceColumn, iSourceIndex, iTargetIndex);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/2"), {
            id: "row0_col2",
            cells: [{
                id: "row0_col2_cell0",
                widgets: [
                    {
                        id: "3"
                    }
                ]
            },
            {
                id: "row0_col2_cell2",
                widgets: [
                    {
                        id: "5"
                    }
                ]
            },
            {
                id: "row0_col2_cell1",
                widgets: [
                    {
                        id: "4"
                    }
                ]
            }]
        }, "The cell was moved to the correct position within the column.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.test("does not modify the model when the target position is the same as the source position and InvisibleMessage is not announced and workPageEdited event is not fired", function (assert) {
        // Arrange
        var iSourceIndex = 0;
        var iTargetIndex = 1;
        this.oSourceColumnBindingPathStub.returns("/data/workPage/rows/0/columns/2");
        this.oTargetColumnBindingPathStub.returns("/data/workPage/rows/0/columns/2");

        // Act
        this.oController._moveCell(this.oSourceColumn, this.oSourceColumn, iSourceIndex, iTargetIndex);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/2"), {
            id: "row0_col2",
            cells: [{
                id: "row0_col2_cell0",
                widgets: [
                    {
                        id: "3"
                    }
                ]
            },
            {
                id: "row0_col2_cell1",
                widgets: [
                    {
                        id: "4"
                    }
                ]
            },
            {
                id: "row0_col2_cell2",
                widgets: [
                    {
                        id: "5"
                    }
                ]
            }]
        }, "The cell was moved to the correct position within the column.");

        assert.ok(this.oInvisibleMessageAnnounceStub.notCalled, "InvisibleMessage was not announced.");
        assert.ok(this.oFireEventStub.notCalled, "The workPageEdited event was not fired.");
    });

    QUnit.module("onWidgetOnCellDrop", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oData = {
                data: {
                    workPage: {
                        rows: [
                            {
                                id: "row0",
                                columns: [
                                    {
                                        id: "row0_col0",
                                        cells: [
                                            {
                                                id: "row0_col0_cell0",
                                                widgets: [
                                                    {
                                                        id: "1"
                                                    },
                                                    {
                                                        id: "2"
                                                    },
                                                    {
                                                        id: "3"
                                                    }

                                                ]
                                            }
                                        ]

                                    },
                                    {
                                        id: "row0_col1",
                                        cells: [
                                            {
                                                id: "row0_col1_cell0",
                                                widgets: [
                                                    {
                                                        id: "4"
                                                    },
                                                    {
                                                        id: "5"
                                                    },
                                                    {
                                                        id: "6"
                                                    }

                                                ]
                                            }
                                        ]

                                    }
                                ]
                            }
                        ]
                    }
                }
            };

            this.oModel = new JSONModel(this.oData);

            this.oIndexOfAggregationStub = sandbox.stub();
            this.oGetPropertyStub = sandbox.stub().withArgs("widgets");

            this.oSourceCellBindingPathStub = sandbox.stub();
            this.oTargetCellBindingPathStub = sandbox.stub();

            this.oSourceCell = {
                indexOfAggregation: this.oIndexOfAggregationStub,
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oSourceCellBindingPathStub
                })
            };
            this.oTargetCell = {
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oTargetCellBindingPathStub,
                    getProperty: this.oGetPropertyStub
                })
            };

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("draggedControl").returns({
                getParent: sandbox.stub().returns({
                    getParent: sandbox.stub().returns(this.oSourceCell)
                })
            });

            this.oGetParameterStub.withArgs("droppedControl").returns(this.oTargetCell);

            this.oEvent = {
                getParameter: this.oGetParameterStub
            };

            this.oFireEventStub = sandbox.stub();

            this.oModelStub = sandbox.stub();
            this.oModelStub.withArgs("i18n").returns({
                getResourceBundle: sandbox.stub().returns({
                    getText: sandbox.stub()
                })
            });
            this.oModelStub.withArgs().returns(this.oModel);


            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oModelStub
            });

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

            this.oInvisibleMessageAnnounceStub = sandbox.stub(InvisibleMessage, "getInstance").returns({
                announce: sandbox.stub()
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("adds widget to the last position in the target cell and removes it from the source cell", function (assert) {
        // Arrange
        this.oSourceCellBindingPathStub.returns("/data/workPage/rows/0/columns/1/cells/0");
        this.oTargetCellBindingPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oIndexOfAggregationStub.returns(0);
        this.oGetPropertyStub.returns(this.oData.data.workPage.rows[0].columns[0].cells[0].widgets);

        // Act
        this.oController.onWidgetOnCellDrop(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0/widgets"), [
            {
                id: "1"
            },
            {
                id: "2"
            },
            {
                id: "3"
            },
            {
                id: "4"
            }
        ], "The widget was added to the target array.");

        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/1/cells/0/widgets"), [
            {
                id: "5"
            },
            {
                id: "6"
            }
        ], "The widget was removed from the source array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.test("adds widget to an empty widgets array in the target cell and removes it from the source cell", function (assert) {
        // Arrange
        this.oSourceCellBindingPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oTargetCellBindingPathStub.returns("/data/workPage/rows/0/columns/1/cells/0");
        this.oModel.setProperty("/data/workPage/rows/0/columns/1/cells/0/widgets", []);
        this.oIndexOfAggregationStub.returns(2);
        this.oGetPropertyStub.returns(this.oData.data.workPage.rows[0].columns[1].cells[0].widgets);

        // Act
        this.oController.onWidgetOnCellDrop(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0/widgets"), [
            {
                id: "1"
            },
            {
                id: "2"
            }
        ], "The widget was removed from the source array.");

        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/1/cells/0/widgets"), [
            {
                id: "3"
            }
        ], "The widget was added to the target array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.module("onGridDrop", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oData = {
                data: {
                    workPage: {
                        rows: [
                            {
                                id: "row0",
                                columns: [
                                    {
                                        id: "row0_col0",
                                        cells: [
                                            {
                                                id: "row0_col0_cell0",
                                                widgets: [
                                                    {
                                                        id: "1"
                                                    },
                                                    {
                                                        id: "2"
                                                    },
                                                    {
                                                        id: "3"
                                                    }

                                                ]
                                            }
                                        ]

                                    },
                                    {
                                        id: "row0_col1",
                                        cells: [
                                            {
                                                id: "row0_col1_cell0",
                                                widgets: [
                                                    {
                                                        id: "4"
                                                    },
                                                    {
                                                        id: "5"
                                                    },
                                                    {
                                                        id: "6"
                                                    }

                                                ]
                                            }
                                        ]

                                    }
                                ]
                            }
                        ]
                    }
                }
            };

            this.oModel = new JSONModel(this.oData);

            this.oSourceIndexOfAggregationStub = sandbox.stub();
            this.oTargetIndexOfAggregationStub = sandbox.stub();
            this.oGetPropertyStub = sandbox.stub().withArgs("widgets");

            this.oSourceCellBindingPathStub = sandbox.stub();
            this.oTargetCellBindingPathStub = sandbox.stub();

            this.oSourceCell = {
                getId: sandbox.stub().returns("test-source-id"),
                indexOfAggregation: this.oSourceIndexOfAggregationStub,
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oSourceCellBindingPathStub
                })
            };
            this.oTargetCell = {
                getId: sandbox.stub().returns("test-target-id"),
                indexOfAggregation: this.oTargetIndexOfAggregationStub,
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oTargetCellBindingPathStub
                })
            };

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("draggedControl").returns({
                getParent: sandbox.stub().returns({
                    getParent: sandbox.stub().returns(this.oSourceCell)
                })
            });

            this.oGetSourceStub = sandbox.stub().returns(this.oTargetCell);

            this.oEvent = {
                getParameter: this.oGetParameterStub,
                getSource: this.oGetSourceStub
            };

            this.oFireEventStub = sandbox.stub();

            this.oModelStub = sandbox.stub();
            this.oModelStub.withArgs("i18n").returns({
                getResourceBundle: sandbox.stub().returns({
                    getText: sandbox.stub()
                })
            });
            this.oModelStub.withArgs().returns(this.oModel);


            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oModelStub
            });

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

            this.oInvisibleMessageAnnounceStub = sandbox.stub(InvisibleMessage, "getInstance").returns({
                announce: sandbox.stub()
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("inserts widget to 2nd position in the target cell and removes it from the source cell", function (assert) {
        // Arrange
        this.oSourceCellBindingPathStub.returns("/data/workPage/rows/0/columns/1/cells/0");
        this.oTargetCellBindingPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oSourceIndexOfAggregationStub.returns(0);
        this.oTargetIndexOfAggregationStub.returns(1);
        this.oGetPropertyStub.returns(this.oData.data.workPage.rows[0].columns[0].cells[0].widgets);
        this.oGetParameterStub.withArgs("dropPosition").returns("Before");

        // Act
        this.oController.onGridDrop(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0/widgets"), [
            {
                id: "1"
            },
            {
                id: "4"
            },
            {
                id: "2"
            },
            {
                id: "3"
            }
        ], "The widget was inserted at position 2 of the target array.");

        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/1/cells/0/widgets"), [
            {
                id: "5"
            },
            {
                id: "6"
            }
        ], "The widget was removed from the source array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.test("adds widget to the last position of the target cell and removes it from the source cell", function (assert) {
        // Arrange
        this.oSourceCellBindingPathStub.returns("/data/workPage/rows/0/columns/1/cells/0");
        this.oTargetCellBindingPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oSourceIndexOfAggregationStub.returns(2);
        this.oTargetIndexOfAggregationStub.returns(2);
        this.oGetParameterStub.withArgs("dropPosition").returns("After");
        this.oGetPropertyStub.returns(this.oData.data.workPage.rows[0].columns[0].cells[0].widgets);

        // Act
        this.oController.onGridDrop(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0/widgets"), [
            {
                id: "1"
            },
            {
                id: "2"
            },
            {
                id: "3"
            },
            {
                id: "6"
            }
        ], "The widget was added to the target array.");

        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/1/cells/0/widgets"), [
            {
                id: "4"
            },
            {
                id: "5"
            }

        ], "The widget was removed from the source array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.test("moves a widget from index 0 to index 2 in the same cell", function (assert) {
        // Arrange
        this.oSourceCellBindingPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oGetSourceStub.returns(this.oSourceCell);
        this.oSourceIndexOfAggregationStub.onCall(0).returns(0);
        this.oSourceIndexOfAggregationStub.onCall(1).returns(2);
        this.oGetParameterStub.withArgs("dropPosition").returns("After");
        this.oGetPropertyStub.returns(this.oData.data.workPage.rows[0].columns[0].cells[0].widgets);

        // Act
        this.oController.onGridDrop(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0/widgets"), [
            {
                id: "2"
            },
            {
                id: "3"
            },
            {
                id: "1"
            }
        ], "The widget was moved from index 0 to index 2 in the array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.test("moves a widget from index 2 to index 0 in the same cell", function (assert) {
        // Arrange
        this.oSourceCellBindingPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oGetSourceStub.returns(this.oSourceCell);
        this.oSourceIndexOfAggregationStub.onCall(0).returns(2);
        this.oSourceIndexOfAggregationStub.onCall(1).returns(0);
        this.oGetParameterStub.withArgs("dropPosition").returns("Before");
        this.oGetPropertyStub.returns(this.oData.data.workPage.rows[0].columns[0].cells[0].widgets);

        // Act
        this.oController.onGridDrop(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0/widgets"), [
            {
                id: "3"
            },
            {
                id: "1"
            },
            {
                id: "2"
            }
        ], "The widget was moved from index 2 to index 0 in the array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
    });

    QUnit.test("does not move a widget when dropped to the initial position", function (assert) {
        // Arrange
        this.oSourceCellBindingPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oGetSourceStub.returns(this.oSourceCell);
        this.oSourceIndexOfAggregationStub.onCall(0).returns(2);
        this.oSourceIndexOfAggregationStub.onCall(1).returns(2);
        this.oGetParameterStub.withArgs("dropPosition").returns("Before");
        this.oGetPropertyStub.returns(this.oData.data.workPage.rows[0].columns[0].cells[0].widgets);

        // Act
        this.oController.onGridDrop(this.oEvent);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0/widgets"), [
            {
                id: "1"
            },
            {
                id: "2"
            },
            {
                id: "3"
            }
        ], "The widget was not moved in the array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.notCalled, "InvisibleMessage was not announced.");
        assert.ok(this.oFireEventStub.notCalled, "The workPageEdited event was not fired.");
    });

    QUnit.module("tileMode", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oModel = new JSONModel({
                data: {
                    usedVisualizations: {
                        a: { type: "sap.ushell.StaticAppLauncher" },
                        b: { type: "sap.ushell.DynamicAppLauncher" },
                        c: { type: "sap.ushell.StaticAppLauncher" },
                        d: { type: "sap.ushell.StaticAppLauncher" },
                        e: { type: "sap.ushell.DynamicAppLauncher" },
                        f: { type: "sap.ushell.StaticAppLauncher" },
                        g: { type: "sap.card" },
                        h: { type: undefined }
                    }
                }
            });
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("returns the expected results", function (assert) {
        // Act
        var bResult1 = this.oController.tileMode([]);

        // Assert
        assert.strictEqual(bResult1, true, "Returns true if the widgets array is empty.");

        // Act
        var bResult2 = this.oController.tileMode(undefined);

        // Assert
        assert.strictEqual(bResult2, false, "Returns false if the widgets array is undefined.");

        // Act
        var bResult3 = this.oController.tileMode([
            { visualization: { id: "a" } },
            { visualization: { id: "b" } },
            { visualization: { id: "c" } },
            { visualization: { id: "d" } },
            { visualization: { id: "e" } },
            { visualization: { id: "f" } }
        ]);

        // Assert
        assert.strictEqual(bResult3, true, "Returns true if the widgets array is only tiles.");

        // Act
        var bResult4 = this.oController.tileMode([
            { visualization: { id: "a" } },
            { visualization: { id: "b" } },
            { visualization: { id: "c" } },
            { visualization: { id: "d" } },
            { visualization: { id: "e" } },
            { visualization: { id: "f" } },
            { visualization: { id: "g" } }
        ]);

        // Assert
        assert.strictEqual(bResult4, true, "Returns true if the widgets array is not only tiles but more than 1 entry.");

        // Act
        var bResult5 = this.oController.tileMode([
            { visualization: { id: "a" } },
            { visualization: { id: "b" } },
            { visualization: { id: "c" } },
            { visualization: { id: "d" } },
            { visualization: { id: "e" } },
            { visualization: { id: "f" } },
            { visualization: { id: "h" } }
        ]);

        // Assert
        assert.strictEqual(bResult5, true, "Returns true if the widgets array contains an undefined tile.");

        // Act
        var bResult6 = this.oController.tileMode([
            { visualization: { id: "g" } }
        ]);

        // Assert
        assert.strictEqual(bResult6, false, "Returns false if the widgets array length === 1 and contains a card.");
    });

    QUnit.module("showAppSearchButton", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oTileModeStub = sandbox.stub(this.oController, "tileMode");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns true if tileMode is true and editMode is true", function (assert) {
        // Arrange
        this.oTileModeStub.returns(true);

        // Act
        var bResult = this.oController.showAppSearchButton([], true);

        // Assert
        assert.strictEqual(true, bResult, "The result was true");
    });

    QUnit.test("Returns false if tileMode is true and editMode is false", function (assert) {
        // Arrange
        this.oTileModeStub.returns(true);

        // Act
        var bResult = this.oController.showAppSearchButton([], false);

        // Assert
        assert.strictEqual(false, bResult, "The result was false");
    });

    QUnit.test("Returns false if tileMode is false and editMode is true", function (assert) {
        // Arrange
        this.oTileModeStub.returns(false);

        // Act
        var bResult = this.oController.showAppSearchButton([], true);

        // Assert
        assert.strictEqual(false, bResult, "The result was false");
    });

    QUnit.test("Returns false if tileMode is false and editMode is false", function (assert) {
        // Arrange
        this.oTileModeStub.returns(false);

        // Act
        var bResult = this.oController.showAppSearchButton([], false);

        // Assert
        assert.strictEqual(false, bResult, "The result was false");
    });

    QUnit.module("onWidgetOnCellDragEnter", {
        beforeEach: function () {
            const oGetParameterStub = sandbox.stub();
            const oPreventDefaultStub = sandbox.stub();
            const oGetBindingContextStub = sandbox.stub();
            const oGetPropertyStub = sandbox.stub();
            const oGetTileModeStub = sandbox.stub();

            this.oController = new WorkPageBuilderController();
            this.oEvent = {
                getParameter: oGetParameterStub,
                preventDefault: oPreventDefaultStub
            };

            this.aWidgets = [];
            this.oCell = {
                getBindingContext: oGetBindingContextStub,
                getTileMode: oGetTileModeStub
            };

            oGetBindingContextStub.returns({
                getProperty: oGetPropertyStub
            });
            oGetPropertyStub.withArgs("widgets").returns(this.aWidgets);
            oGetParameterStub.withArgs("target").returns(this.oCell);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Calls preventDefault when the Cell is in TileMode and Widgets are present", function (assert) {
        // Arrange
        this.aWidgets.push(
            { some: "Widget" },
            { another: "Widget" }
        );
        this.oCell.getTileMode.returns(true);

        // Act
        this.oController.onWidgetOnCellDragEnter(this.oEvent);

        // Assert
        assert.strictEqual(this.oEvent.preventDefault.callCount, 1, "preventDefault was called");
    });

    QUnit.test("Calls preventDefault when the Cell is in TileMode and Widgets are not present", function (assert) {
        // Arrange
        this.oCell.getTileMode.returns(true);

        // Act
        this.oController.onWidgetOnCellDragEnter(this.oEvent);

        // Assert
        assert.strictEqual(this.oEvent.preventDefault.callCount, 0, "preventDefault was not called");
    });

    QUnit.test("Calls preventDefault when the Cell is not in TileMode, Widgets are present and Widgets are expected", function (assert) {
        // Arrange
        this.aWidgets.push(
            { some: "Widget" },
            { another: "Widget" }
        );
        this.oCell.getTileMode.returns(false);

        // Act
        this.oController.onWidgetOnCellDragEnter(this.oEvent, true);

        // Assert
        assert.strictEqual(this.oEvent.preventDefault.callCount, 1, "preventDefault was called");
    });

    QUnit.test("Does not call preventDefault when the Cell is not in TileMode, Widgets are not present and Widgets are expected", function (assert) {
        // Arrange
        this.oCell.getTileMode.returns(false);

        // Act
        this.oController.onWidgetOnCellDragEnter(this.oEvent, true);

        // Assert
        assert.strictEqual(this.oEvent.preventDefault.callCount, 0, "preventDefault was called");
    });

    QUnit.test("Does not call preventDefault when the Cell is not in TileMode, Widgets are present and Widgets are not expected", function (assert) {
        // Arrange
        this.aWidgets.push(
            { some: "Widget" },
            { another: "Widget" }
        );
        this.oCell.getTileMode.returns(false);

        // Act
        this.oController.onWidgetOnCellDragEnter(this.oEvent, false);

        // Assert
        assert.strictEqual(this.oEvent.preventDefault.callCount, 0, "preventDefault was called");
    });

    QUnit.module("onGridColumnsChange", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("columns").returns(5);

            this.oFirstWidgetStub = {
                isA: sandbox.stub().returns(false),
                setLayoutData: sandbox.stub()
            };

            this.oSecondWidgetStub = {
                isA: sandbox.stub().returns(true),
                setLayoutData: sandbox.stub()
            };

            this.oThirdWidgetStub = {
                isA: sandbox.stub().returns(true),
                setLayoutData: sandbox.stub()
            };

            this.oCell = {
                getWidgets: sandbox.stub().returns([
                    this.oFirstWidgetStub,
                    this.oSecondWidgetStub,
                    this.oThirdWidgetStub
                ]),
                getHeaderBar: sandbox.stub()
            };

            this.oEvent = {
                getParameter: this.oGetParameterStub,
                getSource: sandbox.stub().returns(this.oCell)
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("sets new layout data on all of the cards", function (assert) {
        // Act
        this.oController.onGridColumnsChange(this.oEvent);

        // Assert
        assert.ok(this.oFirstWidgetStub.isA.calledOnce, "isA was called on the VizInstance");
        assert.ok(this.oFirstWidgetStub.setLayoutData.notCalled, "setLayoutData was not called on the VizInstance");

        assert.ok(this.oSecondWidgetStub.isA.calledOnce, "isA was called on the Card");
        assert.ok(this.oSecondWidgetStub.setLayoutData.calledOnce, "setLayoutData was called once on the Card");
        assert.ok(this.oSecondWidgetStub.setLayoutData.firstCall.args[0].isA("sap.f.GridContainerItemLayoutData"), "setLayoutData was called on the card with the expected arguments");
        assert.strictEqual(this.oSecondWidgetStub.setLayoutData.firstCall.args[0].getColumns(), 5, "setLayoutData was called on the card with the expected arguments");
        assert.strictEqual(this.oSecondWidgetStub.setLayoutData.firstCall.args[0].getMinRows(), 1, "setLayoutData was called on the card with the expected arguments");

        assert.ok(this.oThirdWidgetStub.isA.calledOnce, "isA was called on the Card");
        assert.ok(this.oThirdWidgetStub.setLayoutData.calledOnce, "setLayoutData was called once on the Card");
        assert.ok(this.oThirdWidgetStub.setLayoutData.firstCall.args[0].isA("sap.f.GridContainerItemLayoutData"), "setLayoutData was called on the card with the expected arguments");
        assert.strictEqual(this.oThirdWidgetStub.setLayoutData.firstCall.args[0].getColumns(), 5, "setLayoutData was called on the card with the expected arguments");
        assert.strictEqual(this.oThirdWidgetStub.setLayoutData.firstCall.args[0].getMinRows(), 1, "setLayoutData was called on the card with the expected arguments");
    });

    QUnit.module("_generateUniqueId", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oGenerateUniqueIdStub = sandbox.stub(utils, "generateUniqueId");
            this.oController.oModel = new JSONModel({
                data: {
                    workPage: {
                        id: "workpage-1",
                        rows: [{
                            id: "row-1",
                            columns: [{
                                id: "col-11",
                                cells: [{
                                    id: "cell-111",
                                    widgets: [
                                        { id: "wid-1111" },
                                        { id: "wid-1112" },
                                        { id: "wid-1113" }
                                    ]
                                }, {
                                    id: "cell-112",
                                    widgets: [
                                        { id: "wid-1121" }
                                    ]
                                }, {
                                    id: "cell-113",
                                    widgets: [
                                        { id: "wid-1131" },
                                        { id: "wid-1132" }
                                    ]
                                }]
                            }, {
                                id: "col-12",
                                cells: [{
                                    id: "cell-121",
                                    widgets: [
                                        { id: "wid-1211" },
                                        { id: "wid-1212" },
                                        { id: "wid-1213" }
                                    ]
                                }, {
                                    id: "cell-122",
                                    widgets: [
                                        { id: "wid-1221" }
                                    ]
                                }]
                            }, {
                                id: "col-13"
                            }]
                        }, {
                            id: "row-2"
                        }, {
                            id: "row-3",
                            configurations: [
                                { id: "conf_row_3" },
                                { id: "conf_row_31" }
                            ],
                            columns: [{
                                id: "col-31",
                                cells: [{
                                    id: "cell-311",
                                    widgets: [
                                        { id: "wid-3111" },
                                        { id: "wid-3112" },
                                        {
                                            id: "wid-3113",
                                            configurations: [
                                                { id: undefined },
                                                { id: "conf_widget_3113" },
                                                { id: "conf_widget_31131" }
                                            ]
                                        }
                                    ]
                                }, {
                                    id: "cell-312"
                                }, {
                                    id: "cell-313"
                                }]
                            }, {
                                id: "col-32",
                                cells: []
                            }, {
                                id: "col-33",
                                cells: [
                                    { id: "cell-331" }
                                ]
                            }]
                        }]
                    }
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("calls the utils function correctly if no rows exist yet", function (assert) {
        // Arrange
        this.oController.oModel.setData({
            data: {
                workPage: {
                    id: "test-workpage-id"
                }
            }
        });

        // Act
        this.oController._generateUniqueId();

        // Assert
        assert.ok(this.oGenerateUniqueIdStub.calledOnce, "The utils function was called once.");
        assert.deepEqual(this.oGenerateUniqueIdStub.firstCall.args[0], ["test-workpage-id"], "The utils function was called with the expected array of ids.");
    });

    QUnit.test("collects all existing ids from the page and merges them with the passed array of ids", function (assert) {
        // Act
        this.oController._generateUniqueId(["passedid-1", "passedid-2", "passedid-3"]);

        // Assert
        assert.ok(this.oGenerateUniqueIdStub.calledOnce, "The utils function was called once.");
        assert.deepEqual(this.oGenerateUniqueIdStub.firstCall.args[0], [
            "passedid-1",
            "passedid-2",
            "passedid-3",
            "workpage-1",
            "row-1",
            "col-11",
            "cell-111",
            "wid-1111",
            "wid-1112",
            "wid-1113",
            "cell-112",
            "wid-1121",
            "cell-113",
            "wid-1131",
            "wid-1132",
            "col-12",
            "cell-121",
            "wid-1211",
            "wid-1212",
            "wid-1213",
            "cell-122",
            "wid-1221",
            "col-13",
            "row-2",
            "row-3",
            "conf_row_3",
            "conf_row_31",
            "col-31",
            "cell-311",
            "wid-3111",
            "wid-3112",
            "wid-3113",
            "conf_widget_3113",
            "conf_widget_31131",
            "cell-312",
            "cell-313",
            "col-32",
            "col-33",
            "cell-331"
        ], "The utils function was called with the expected array of ids.");
    });

    QUnit.module("onGridContainerBorderReached", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Calls the WorkPageBuilderAccessibility modules Event Handler with the original Event", function (assert) {
        // Arrange
        var oWorkPage = { some: "workPage" };
        var oEvent = { some: "Event" };
        var oHandleBorderReachedStub = sandbox.stub();
        sandbox.stub(this.oController, "byId").withArgs("workPage").returns(oWorkPage);
        this.oController.oWorkPageBuilderAccessibility = {
            _handleBorderReached: oHandleBorderReachedStub
        };

        // Act
        this.oController.onGridContainerBorderReached(oEvent);

        // Assert
        assert.strictEqual(oHandleBorderReachedStub.callCount, 1, "The handler was called exactly once");
        assert.deepEqual(oHandleBorderReachedStub.getCall(0).args, [oEvent, oWorkPage], "The handler was called with the expected arguments");
    });

    QUnit.module("_openResetCardConfigurationDialog", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oController._fnResetCardConfiguration = function () {
            };

            this.oBeginButton = {};
            this.oBeginButton.attachPress = sandbox.stub().returns(this.oBeginButton);
            this.oBeginButton.detachPress = sandbox.stub().returns(this.oBeginButton);

            this.oGetBeginButtonStub = sandbox.stub().returns(this.oBeginButton);

            this.oOpenStub = sandbox.stub();
            this.oDialog = {
                open: this.oOpenStub,
                getBeginButton: this.oGetBeginButtonStub
            };
            this.oAddDependentStub = sandbox.stub();
            this.oCreateResetDialogStub = sandbox.stub(this.oController, "_createResetCardConfigurationDialog").resolves(this.oDialog);
            sandbox.stub(this.oController, "getView").returns({
                addDependent: this.oAddDependentStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("opens the card reset dialog and attaches the handler", function (assert) {
        // Act
        return this.oController._openResetCardConfigurationDialog({}, { test: "data" }).then(function () {
            // Assert
            assert.strictEqual(this.oCreateResetDialogStub.callCount, 1, "_createResetCardConfigurationDialog was called.");
            assert.deepEqual(this.oController.oCardResetDialog, this.oDialog, "The dialog was saved.");
            assert.strictEqual(this.oAddDependentStub.callCount, 1, "addDependent was called once.");
            assert.strictEqual(this.oAddDependentStub.firstCall.args[0], this.oDialog, "addDependent was called with the expected arguments.");
            assert.strictEqual(this.oGetBeginButtonStub.callCount, 1, "getBeginButton was called once.");
            assert.strictEqual(this.oBeginButton.detachPress.callCount, 1, "attachPress was called once.");
            assert.deepEqual(this.oBeginButton.detachPress.firstCall.args, [this.oController._fnResetCardConfiguration], "detachPress was called with the expected arguments.");
            assert.strictEqual(this.oBeginButton.attachPress.callCount, 1, "attachPress was called once.");
            assert.deepEqual(this.oBeginButton.attachPress.firstCall.args, [{ test: "data" }, this.oController._fnResetCardConfiguration], "attachPress was called with the expected arguments.");
        }.bind(this));

    });

    QUnit.test("uses the existing dialog promise", function (assert) {
        // Arrange
        this.oController.oCardResetDialogPromise = Promise.resolve(this.oDialog);

        // Act
        return this.oController._openResetCardConfigurationDialog({}, { test: "data" }).then(function () {
            // Assert
            assert.strictEqual(this.oCreateResetDialogStub.callCount, 0, "_createResetCardConfigurationDialog was not called.");
            assert.strictEqual(this.oAddDependentStub.callCount, 1, "addDependent was called once.");
            assert.strictEqual(this.oAddDependentStub.firstCall.args[0], this.oDialog, "addDependent was called with the expected arguments.");
            assert.strictEqual(this.oGetBeginButtonStub.callCount, 1, "getBeginButton was called once.");
            assert.strictEqual(this.oBeginButton.detachPress.callCount, 1, "attachPress was called once.");
            assert.deepEqual(this.oBeginButton.detachPress.firstCall.args, [this.oController._fnResetCardConfiguration], "detachPress was called with the expected arguments.");
            assert.strictEqual(this.oBeginButton.attachPress.callCount, 1, "attachPress was called once.");
            assert.deepEqual(this.oBeginButton.attachPress.firstCall.args, [{ test: "data" }, this.oController._fnResetCardConfiguration], "attachPress was called with the expected arguments.");
        }.bind(this));
    });

    QUnit.module("_onResetCardConfigurations", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oFireEventStub = sandbox.stub();
            this.oCloseStub = sandbox.stub();

            this.aWidgetConfigurations = [
                { id: "conf_0", level: "PR", settings: { value: { title: "PR" } } },
                { id: "conf_0", level: "CO", settings: { value: { title: "CO" } } },
                { id: "conf_0", level: "PG", settings: { value: { title: "PG" } } },
                { id: "conf_0", level: "US", settings: { value: { title: "US" } } }
            ];
            this.oController.oModel = new JSONModel({
                path: {
                    to: {
                        test: {
                            configurations: this.aWidgetConfigurations
                        }
                    }
                }
            });

            this.oContextData = {
                widgetConfigurations: this.aWidgetConfigurations,
                widgetContextPath: "/path/to/test"
            };

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

            this.oEvent = {
                getSource: sandbox.stub().returns({
                    getParent: sandbox.stub().returns({ close: this.oCloseStub })
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("filters the PG configurations, sets the new array to the model and closes the dialog", function (assert) {
        // Act
        this.oController._onResetCardConfigurations(this.oEvent, this.oContextData);

        // Assert
        assert.deepEqual(this.oController.oModel.getData(), {
            path: {
                to: {
                    test: {
                        configurations: [
                            { id: "conf_0", level: "PR", settings: { value: { title: "PR" } } },
                            { id: "conf_0", level: "CO", settings: { value: { title: "CO" } } },
                            { id: "conf_0", level: "US", settings: { value: { title: "US" } } }
                        ]
                    }
                }
            }
        }, "The PG configurations were filtered out.");

        assert.strictEqual(this.oCloseStub.callCount, 1, "close was called once on the dialog.");
        assert.ok(this.oFireEventStub.calledOnce, "fireEvent was called once.");
        assert.deepEqual(this.oFireEventStub.firstCall.args[0], "workPageEdited", "The workPageEdited event was fired.");
    });

    QUnit.module("_createResetCardConfigurationDialog", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getResourceBundle: sandbox.stub().returns({
                        getText: sandbox.stub()
                    })
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("creates the dialog", function (assert) {
        // Act
        return this.oController._createResetCardConfigurationDialog().then(function (oDialog) {
            // Assert
            assert.ok(oDialog.isA("sap.m.Dialog"), "The dialog was returned");
        });
    });

    QUnit.module("onVisualizationDropBetweenCells", {
        beforeEach: function () {
            this.oGetParameterStub = sandbox.stub();
            this.oController = new WorkPageBuilderController();
            this.oEvent = {
                getParameter: this.oGetParameterStub
            };
            this.oMoveVisualizationToCellOrColumnStub = sandbox.stub(this.oController, "_moveVisualizationToCellOrColumn");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Calls _moveVisualizationToCellOrColumn with the expected arguments when dropPosition is 'On'", function (assert) {
        // Arrange
        const oSourceCell = { some: "Cell" };
        const oSourceVis = {
            getParent: sandbox.stub().returns({
                getParent: sandbox.stub().returns(oSourceCell)
            })
        };
        const oIndexOfAggregationStub = sandbox.stub();
        const oTargetColumn = {
            indexOfAggregation: oIndexOfAggregationStub
        };
        const oTargetCell = {
            getParent: sandbox.stub().returns(oTargetColumn)
        };
        const iPosInTargetColumn = 2;
        oIndexOfAggregationStub.withArgs("cells", oTargetCell).returns(iPosInTargetColumn);
        this.oGetParameterStub.withArgs("draggedControl").returns(oSourceVis);
        this.oGetParameterStub.withArgs("droppedControl").returns(oTargetCell);
        this.oGetParameterStub.withArgs("dropPosition").returns("On");

        const aExpectedArguments = [oSourceVis, oSourceCell, oTargetColumn, iPosInTargetColumn];
        // Act
        this.oController.onVisualizationDropBetweenCells(this.oEvent);

        // Assert
        assert.strictEqual(this.oMoveVisualizationToCellOrColumnStub.callCount, 1, "_moveVisualizationToCellOrColumn was called exactly once");
        assert.deepEqual(this.oMoveVisualizationToCellOrColumnStub.getCall(0).args, aExpectedArguments, "_moveVisualizationToCellOrColumn was called with the expected arguments");
    });

    QUnit.test("Calls _moveVisualizationToCellOrColumn with the expected arguments when dropPosition is 'Before'", function (assert) {
        // Arrange
        const oSourceCell = { some: "Cell" };
        const oSourceVis = {
            getParent: sandbox.stub().returns({
                getParent: sandbox.stub().returns(oSourceCell)
            })
        };
        const oIndexOfAggregationStub = sandbox.stub();
        const oTargetColumn = {
            indexOfAggregation: oIndexOfAggregationStub
        };
        const oTargetCell = {
            getParent: sandbox.stub().returns(oTargetColumn)
        };
        const iPosInTargetColumn = 2;
        oIndexOfAggregationStub.withArgs("cells", oTargetCell).returns(iPosInTargetColumn);
        this.oGetParameterStub.withArgs("draggedControl").returns(oSourceVis);
        this.oGetParameterStub.withArgs("droppedControl").returns(oTargetCell);
        this.oGetParameterStub.withArgs("dropPosition").returns("Before");

        const aExpectedArguments = [oSourceVis, oSourceCell, oTargetColumn, iPosInTargetColumn];
        // Act
        this.oController.onVisualizationDropBetweenCells(this.oEvent);

        // Assert
        assert.strictEqual(this.oMoveVisualizationToCellOrColumnStub.callCount, 1, "_moveVisualizationToCellOrColumn was called exactly once");
        assert.deepEqual(this.oMoveVisualizationToCellOrColumnStub.getCall(0).args, aExpectedArguments, "_moveVisualizationToCellOrColumn was called with the expected arguments");
    });

    QUnit.test("Calls _moveVisualizationToCellOrColumn with the expected arguments when dropPosition is 'After'", function (assert) {
        // Arrange
        const oSourceCell = { some: "Cell" };
        const oSourceVis = {
            getParent: sandbox.stub().returns({
                getParent: sandbox.stub().returns(oSourceCell)
            })
        };
        const oIndexOfAggregationStub = sandbox.stub();
        const oTargetColumn = {
            indexOfAggregation: oIndexOfAggregationStub
        };
        const oTargetCell = {
            getParent: sandbox.stub().returns(oTargetColumn)
        };
        const iPosInTargetColumn = 0;
        oIndexOfAggregationStub.withArgs("cells", oTargetCell).returns(iPosInTargetColumn);
        this.oGetParameterStub.withArgs("draggedControl").returns(oSourceVis);
        this.oGetParameterStub.withArgs("droppedControl").returns(oTargetCell);
        this.oGetParameterStub.withArgs("dropPosition").returns("After");

        const aExpectedArguments = [oSourceVis, oSourceCell, oTargetColumn, iPosInTargetColumn + 1];
        // Act
        this.oController.onVisualizationDropBetweenCells(this.oEvent);

        // Assert
        assert.strictEqual(this.oMoveVisualizationToCellOrColumnStub.callCount, 1, "_moveVisualizationToCellOrColumn was called exactly once");
        assert.deepEqual(this.oMoveVisualizationToCellOrColumnStub.getCall(0).args, aExpectedArguments, "_moveVisualizationToCellOrColumn was called with the expected arguments");
    });

    QUnit.module("onVisualizationDropOnCell", {
        beforeEach: function () {
            this.oGetParameterStub = sandbox.stub();
            this.oController = new WorkPageBuilderController();
            this.oEvent = {
                getParameter: this.oGetParameterStub
            };
            this.oMoveVisualizationToCellOrColumnStub = sandbox.stub(this.oController, "_moveVisualizationToCellOrColumn");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Calls _moveVisualizationToCellOrColumn with the expected arguments", function (assert) {
        // Arrange
        const oSourceCell = {
            some: "Cell"
        };
        const oSourceVis = {
            getParent: sandbox.stub().returns({
                getParent: sandbox.stub().returns(oSourceCell)
            })
        };
        const oTargetColumn = {
            some: "Column"
        };
        const aExpectedArguments = [oSourceVis, oSourceCell, oTargetColumn, 0];

        this.oGetParameterStub.withArgs("draggedControl").returns(oSourceVis);
        this.oGetParameterStub.withArgs("droppedControl").returns(oTargetColumn);

        // Act
        this.oController.onVisualizationDropOnCell(this.oEvent);

        // Assert
        assert.strictEqual(this.oMoveVisualizationToCellOrColumnStub.callCount, 1, "_moveVisualizationToCellOrColumn was called exactly once");
        assert.deepEqual(this.oMoveVisualizationToCellOrColumnStub.getCall(0).args, aExpectedArguments, "_moveVisualizationToCellOrColumn was called with the expected arguments");
    });

    QUnit.module("onVisualizationDropOnEmptyWidgetContainer", {
        beforeEach: function () {
            this.oGetParameterStub = sandbox.stub();
            this.oController = new WorkPageBuilderController();
            this.oEvent = {
                getParameter: this.oGetParameterStub
            };
            this.oMoveVisualizationToCellOrColumnStub = sandbox.stub(this.oController, "_moveVisualizationToCellOrColumn");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Calls _moveVisualizationToCellOrColumn with the expected arguments", function (assert) {
        // Arrange
        const oSourceCell = {
            some: "Cell"
        };
        const oSourceVis = {
            getParent: sandbox.stub().returns({
                getParent: sandbox.stub().returns(oSourceCell)
            })
        };
        const oTargetColumn = {
            some: "Column"
        };
        const aExpectedArguments = [oSourceVis, oSourceCell, oTargetColumn];

        this.oGetParameterStub.withArgs("draggedControl").returns(oSourceVis);
        this.oGetParameterStub.withArgs("droppedControl").returns(oTargetColumn);

        // Act
        this.oController.onVisualizationDropOnEmptyWidgetContainer(this.oEvent);

        // Assert
        assert.strictEqual(this.oMoveVisualizationToCellOrColumnStub.callCount, 1, "_moveVisualizationToCellOrColumn was called exactly once");
        assert.deepEqual(this.oMoveVisualizationToCellOrColumnStub.getCall(0).args, aExpectedArguments, "_moveVisualizationToCellOrColumn was called with the expected arguments");
    });

    QUnit.module("_moveVisualizationToCellOrColumn", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();
            this.oData = {
                data: {
                    workPage: {
                        rows: [
                            {
                                id: "row0",
                                columns: [
                                    {
                                        id: "row0_col0",
                                        cells: [
                                            {
                                                id: "row0_col0_cell0",
                                                widgets: [
                                                    {
                                                        id: "1"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "row0_col1",
                                        cells: [
                                            {
                                                id: "row0_col1_cell0",
                                                widgets: [
                                                    {
                                                        id: "2"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "row0_col2",
                                        cells: [
                                            {
                                                id: "row0_col2_cell0",
                                                widgets: [
                                                    {
                                                        id: "3"
                                                    }
                                                ]
                                            },
                                            {
                                                id: "row0_col2_cell1",
                                                widgets: [
                                                    {
                                                        id: "4"
                                                    }
                                                ]
                                            },
                                            {
                                                id: "row0_col2_cell2",
                                                widgets: [
                                                    {
                                                        id: "5"
                                                    }
                                                ]
                                            },
                                            {
                                                id: "row0_col2_cell3",
                                                widgets: []
                                            }
                                        ]

                                    }
                                ]
                            }
                        ]
                    }
                }
            };

            this.oModel = new JSONModel(this.oData);

            this.oModelStub = sandbox.stub();
            this.oModelStub.withArgs("i18n").returns({
                getResourceBundle: sandbox.stub().returns({
                    getText: sandbox.stub()
                })
            });
            this.oModelStub.withArgs().returns(this.oModel);

            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oModelStub
            });

            this.oInvisibleMessageAnnounceStub = sandbox.stub();
            sandbox.stub(InvisibleMessage, "getInstance").returns({
                announce: this.oInvisibleMessageAnnounceStub
            });

            this.oFireEventStub = sandbox.stub();
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                fireEvent: this.oFireEventStub
            });

            this.oIsAStub = sandbox.stub();
            this.oTargetControlGetPathStub = sandbox.stub();
            this.oSourceCellGetPathStub = sandbox.stub();
            this.oVisualizationGetPathStub = sandbox.stub();
            this.oIndexOfAggregationStub = sandbox.stub();

            this.oTargetControl = {
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oTargetControlGetPathStub
                }),
                isA: this.oIsAStub
            };

            this.oSourceCell = {
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oSourceCellGetPathStub
                }),
                indexOfAggregation: this.oIndexOfAggregationStub
            };
            this.oVisualization = {
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oVisualizationGetPathStub
                })
            };

            this.oSetColumnDataSpy = sandbox.spy(this.oController, "_setColumnData");
            this.oSetCellDataSpy = sandbox.spy(this.oController, "_setCellData");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Moves the Visualization in the model to a Cell", function (assert) {
        // Arrange
        this.oIsAStub.withArgs("sap.ushell.components.workPageBuilder.controls.WorkPageCell").returns(true);
        this.oTargetControlGetPathStub.returns("/data/workPage/rows/0/columns/2/cells/3");
        this.oIndexOfAggregationStub.withArgs("widgets", this.oVisualization).returns(0);
        this.oSourceCellGetPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oVisualizationGetPathStub.returns("/data/workPage/rows/0/columns/0/cells/0/widgets/0");

        // Act
        this.oController._moveVisualizationToCellOrColumn(this.oVisualization, this.oSourceCell, this.oTargetControl);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0"), {
            id: "row0_col0_cell0",
            widgets: []
        }, "The Visualization was removed from the source position.");

        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/2/cells/3"), {
            id: "row0_col2_cell3",
            widgets: [
                {
                    id: "1"
                }
            ]
        }, "The Visualization was inserted at position 0 of the target cells widgets array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
        assert.strictEqual(this.oSetColumnDataSpy.callCount, 0, "_setColumnData was not called");
        assert.strictEqual(this.oSetCellDataSpy.callCount, 1, "_setCellData was called exactly once");
    });

    QUnit.test("Moves the Visualization in the model to Column 1 in front of the already existing Cell", function (assert) {
        // Arrange
        this.oIsAStub.withArgs("sap.ushell.components.workPageBuilder.controls.WorkPageColumn").returns(true);
        this.oTargetControlGetPathStub.returns("/data/workPage/rows/0/columns/1");
        this.oIndexOfAggregationStub.withArgs("widgets", this.oVisualization).returns(0);
        this.oSourceCellGetPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oVisualizationGetPathStub.returns("/data/workPage/rows/0/columns/0/cells/0/widgets/0");
        sandbox.stub(this.oController, "_generateUniqueId").returns("1337");

        // Act
        this.oController._moveVisualizationToCellOrColumn(this.oVisualization, this.oSourceCell, this.oTargetControl, 0);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0"), {
            id: "row0_col0_cell0",
            widgets: []
        }, "The Visualization was removed from the source position.");

        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/1"), {
            id: "row0_col1",
            cells: [
                {
                    descriptor: {
                        schemaVersion: "3.2.0",
                        value: {}
                    },
                    id: "1337",
                    widgets: [
                        {
                            id: "1"
                        }
                    ]
                },
                {
                    id: "row0_col1_cell0",
                    widgets: [
                        {
                            id: "2"
                        }
                    ]
                }
            ]
        }, "The Visualization was inserted at position 0 of the target cells widgets array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
        assert.strictEqual(this.oSetColumnDataSpy.callCount, 1, "_setColumnData was called exactly once");
        assert.strictEqual(this.oSetCellDataSpy.callCount, 0, "_setCellData was not called");
    });

    QUnit.test("Moves the Visualization in the model to Column 1 after the already existing Cell", function (assert) {
        // Arrange
        this.oIsAStub.withArgs("sap.ushell.components.workPageBuilder.controls.WorkPageColumn").returns(true);
        this.oTargetControlGetPathStub.returns("/data/workPage/rows/0/columns/1");
        this.oIndexOfAggregationStub.withArgs("widgets", this.oVisualization).returns(0);
        this.oSourceCellGetPathStub.returns("/data/workPage/rows/0/columns/0/cells/0");
        this.oVisualizationGetPathStub.returns("/data/workPage/rows/0/columns/0/cells/0/widgets/0");
        sandbox.stub(this.oController, "_generateUniqueId").returns("1337");

        // Act
        this.oController._moveVisualizationToCellOrColumn(this.oVisualization, this.oSourceCell, this.oTargetControl, 1);

        // Assert
        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/0/cells/0"), {
            id: "row0_col0_cell0",
            widgets: []
        }, "The Visualization was removed from the source position.");

        assert.deepEqual(this.oModel.getProperty("/data/workPage/rows/0/columns/1"), {
            id: "row0_col1",
            cells: [
                {
                    id: "row0_col1_cell0",
                    widgets: [
                        {
                            id: "2"
                        }
                    ]
                },
                {
                    descriptor: {
                        schemaVersion: "3.2.0",
                        value: {}
                    },
                    id: "1337",
                    widgets: [
                        {
                            id: "1"
                        }
                    ]
                }
            ]
        }, "The Visualization was inserted at position 0 of the target cells widgets array.");

        assert.ok(this.oInvisibleMessageAnnounceStub.calledOnce, "InvisibleMessage was announced.");
        assert.ok(this.oFireEventStub.calledWith("workPageEdited"), "The workPageEdited event was fired.");
        assert.strictEqual(this.oSetColumnDataSpy.callCount, 1, "_setColumnData was called exactly once");
        assert.strictEqual(this.oSetCellDataSpy.callCount, 0, "_setCellData was not called");
    });

    QUnit.module("onExit", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oDeregisterStub = sandbox.stub(WorkPageBuilderLayoutHelper, "deregister");

            this.oContentFinderDestroyStub = sandbox.stub();
            this.oCardEditorDialogDestroyStub = sandbox.stub();
            this.oCardResetDialogDestroyStub = sandbox.stub();
            this.oDeleteCellDestroyStub = sandbox.stub();
            this.oLoadDeleteDialogDestroyStub = sandbox.stub();

            this.oController.oContentFinderPromise = Promise.resolve().then(() => ({
                destroy: this.oContentFinderDestroyStub
            }));
            this.oController.oCardEditorDialogPromise = Promise.resolve().then(() => ({
                destroy: this.oCardEditorDialogDestroyStub
            }));
            this.oController.oCardResetDialogPromise = Promise.resolve().then(() => ({
                destroy: this.oCardResetDialogDestroyStub
            }));
            this.oController.oDeleteCell = Promise.resolve().then(() => ({
                destroy: this.oDeleteCellDestroyStub
            }));
            this.oController.oLoadDeleteDialog = Promise.resolve().then(() => ({
                destroy: this.oLoadDeleteDialogDestroyStub
            }));
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Destroys the component and the dialogs", function (assert) {
        this.oController.onExit();

        return Promise.all([
            this.oController.oContentFinderPromise,
            this.oController.oCardEditorDialogPromise,
            this.oController.oCardResetDialogPromise,
            this.oController.oDeleteCell,
            this.oController.oLoadDeleteDialog
        ]).then(() => {
            assert.ok(this.oDeregisterStub.calledOnce, "deregister was called on WorkPageBuilderLayoutHelper");
            assert.ok(this.oContentFinderDestroyStub.calledOnce, "destroy was called on the ContentFinder");
            assert.ok(this.oCardEditorDialogDestroyStub.calledOnce, "destroy was called on the CardEditor");
            assert.ok(this.oCardResetDialogDestroyStub.calledOnce, "destroy was called on the CardReset dialog");
            assert.ok(this.oDeleteCellDestroyStub.calledOnce, "destroy was called on the DeleteCell dialog");
            assert.ok(this.oLoadDeleteDialogDestroyStub.calledOnce, "destroy was called on the LoadDelete dialog");
        });
    });

    QUnit.module("formatRowAriaLabel", {
        beforeEach: function () {
            this.oController = new WorkPageBuilderController();

            this.oResourceModel = new ResourceModel({
                bundleUrl: sap.ui.require.toUrl("sap/ushell/components/workPageBuilder/resources/resources.properties")
            });

            this.oGetModelStub = sandbox.stub().returns(this.oModel);
            this.oGetModelStub.withArgs("i18n").returns(this.oResourceModel);

            this.oGetTextStub = sandbox.stub();

            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub
            });
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the expected aria-labels - error cases", function (assert) {
        var aResults = [
            this.oController.formatRowAriaLabel(),
            this.oController.formatRowAriaLabel("test-row-0"),
            this.oController.formatRowAriaLabel("test-row-0", []),
            this.oController.formatRowAriaLabel("test-row-0", [
                { id: "test-row-1" },
                { id: "test-row-2" },
                { id: "test-row-3" }
            ])
        ];
        assert.deepEqual(aResults, ["", "", "", ""], "The expected results were returned (error case)");
    });

    QUnit.test("Returns the title in the translated string for named rows", function (assert) {
        var sResult = this.oController.formatRowAriaLabel("test-row-0", [{ id: "test-row-1" }], "The row title");
        var sExpectedResult = this.oResourceModel.getResourceBundle().getText("WorkPage.Row.Named.AriaLabel", ["The row title"]);

        assert.strictEqual(
            sResult,
            sExpectedResult,
            "The expected result was returned");
    });

    QUnit.test("Returns the position in the translated string for unnamed rows", function (assert) {
        var sResult = this.oController.formatRowAriaLabel("test-row-4", [
            { id: "test-row-0" },
            { id: "test-row-1" },
            { id: "test-row-2" },
            { id: "test-row-3" },
            { id: "test-row-4" },
            { id: "test-row-5" }
        ]);

        var sExpectedResult = this.oResourceModel.getResourceBundle().getText("WorkPage.Row.Unnamed.AriaLabel", [5]);

        assert.strictEqual(
            sResult,
            sExpectedResult,
            "The expected result was returned");
    });
});


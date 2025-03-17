// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controller.WorkPageBuilder.layout
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.layout",
    "sap/ui/core/ResizeHandler",
    "sap/base/Log",
    "sap/ui/core/theming/Parameters",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/m/library",
    "sap/ushell/Container"
    /* TODO Container required to resolve dependency chain in URL Parsing which requires ushell/utils
    and Container. Both have a cyclic dependency which needs to be resolved in a larger refactoring.*/
], function (
    WorkPageBuilderLayoutHelper,
    ResizeHandler,
    Log,
    ThemingParameters,
    Config,
    EventHub,
    library,
    Container
) {
    "use strict";

    // shortcut for sap.m.TileSizeBehavior
    const TileSizeBehavior = library.TileSizeBehavior;

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("WorkPageBuilderLayoutHelper");
    QUnit.test("creates an initial JSON model", function (assert) {
        // Assert
        assert.deepEqual(WorkPageBuilderLayoutHelper._oLayoutModel.getData(), {currentBreakpoint: {}}, "The model was initialized.");
    });

    QUnit.test("getModel returns the JSON model", function (assert) {
        // Assert
        assert.ok(WorkPageBuilderLayoutHelper.getModel().getData(), {currentBreakpoint: {}}, "The model was returned.");
    });

    QUnit.module("register", {
        beforeEach: function () {
            this.oRegisterStub = sandbox.stub(ResizeHandler, "register");
            this.oConfigOnStub = sandbox.stub(Config, "on").returns({
                do: sandbox.stub()
            });
            this.oEventHubOnStub = sandbox.stub(EventHub, "on").returns({
                do: sandbox.stub()
            });
            sandbox.stub(Log, "warning");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Does not register a new handler if one already exists", function (assert) {
        // Arrange
        WorkPageBuilderLayoutHelper._sResizeHandlerId = "testId";

        // Act
        WorkPageBuilderLayoutHelper.register({});

        // Assert
        assert.ok(this.oRegisterStub.notCalled, "Register was not called");
        assert.ok(this.oConfigOnStub.notCalled, "Config.on was not called");
        assert.ok(this.oEventHubOnStub.notCalled, "EventHub.on was not called");
    });

    QUnit.test("Registers a new handler", function (assert) {
        // Arrange
        WorkPageBuilderLayoutHelper._sResizeHandlerId = undefined;

        // Act
        WorkPageBuilderLayoutHelper.register({
            test: "control"
        });

        // Assert
        assert.ok(this.oRegisterStub.calledOnce, "Register was called");
        assert.ok(this.oConfigOnStub.calledOnce, "Config.on was called");
        assert.ok(this.oEventHubOnStub.calledOnce, "EventHub.on was called");

        assert.deepEqual(this.oRegisterStub.firstCall.args[0], {
            test: "control"
        }, "Register was called with the expected arguments");

        assert.strictEqual(this.oConfigOnStub.firstCall.args[0], "/core/home/sizeBehavior", "Config.on was called with the expected arguments");
        assert.strictEqual(this.oEventHubOnStub.firstCall.args[0], "themeChanged", "EventHub.on was called with the expected arguments");
    });

    QUnit.module("deregister", {
        beforeEach: function () {
            this.oDeregisterStub = sandbox.stub(ResizeHandler, "deregister");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Deregisters the existing handler", function (assert) {
        // Arrange
        WorkPageBuilderLayoutHelper._sResizeHandlerId = "test-id";

        // Act
        WorkPageBuilderLayoutHelper.deregister();

        // Assert
        assert.ok(this.oDeregisterStub.calledOnce, "Deregister was called");
        assert.deepEqual(this.oDeregisterStub.firstCall.args[0], "test-id", "Deregister was called with the expected arguments");
    });

    QUnit.module("onResize", {
        beforeEach: function () {
            this.oGetBreakpointFromWidthStub = sandbox.stub(WorkPageBuilderLayoutHelper, "_getBreakpointSettingsForWidth");
            this.oEvent = {
                size: {
                    width: 1236
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets a new breakpoint to the model", async function (assert) {
        // Arrange
        var oBreakpoint = {
            high: 1387,
            low: 1232,
            sizeBehavior: TileSizeBehavior.Responsive,
            gap: "1rem",
            rowSize: "5rem"
        };

        this.oGetBreakpointFromWidthStub.resolves(oBreakpoint);

        // Act
        await WorkPageBuilderLayoutHelper.onResize(this.oEvent);

        // Assert
        assert.ok(this.oGetBreakpointFromWidthStub.calledOnce, "_getBreakpointSettingsForWidth was called");
        assert.strictEqual(this.oGetBreakpointFromWidthStub.firstCall.args[0], 1236, "_getBreakpointSettingsForWidth was called with the expected arguments");
        assert.deepEqual(WorkPageBuilderLayoutHelper._oLayoutModel.getProperty("/currentBreakpoint"), oBreakpoint, "the model had the expected data");
    });

    QUnit.module("_formatNumericThemeParam", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the numeric theme parameter", function (assert) {
        // Act
        var sResult = WorkPageBuilderLayoutHelper._formatNumericThemeParam(".5rem");

        // Assert
        assert.strictEqual(sResult, "0.5rem", "_formatNumericThemeParam returned the expected result.");
    });

    QUnit.module("_getBreakpointSettingsForWidth", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").returns(TileSizeBehavior.Responsive);
            this.oGetBreakPointSettingsStub = sandbox.stub(WorkPageBuilderLayoutHelper, "_getBreakpointSettings").returns([{
                high: Infinity,
                low: 1700
            }, {
                high: 1699,
                low: 1500
            }, {
                high: 1499,
                low: 1200
            }, {
                high: 1199,
                low: 1000
            }, {
                high: 999,
                low: 500
            }, {
                high: 499,
                low: 360
            }, {
                high: 359,
                low: 0
            }]);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the expected breakpoint settings", async function (assert) {
        // Act
        var aResults = [
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(0),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(359),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(360),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(499),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(550),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(1100),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(1199),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(1498),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(1550),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(1710),
            await WorkPageBuilderLayoutHelper._getBreakpointSettingsForWidth(999999)
        ];

        // Assert
        assert.deepEqual(aResults, [
            {
                high: 359,
                low: 0
            }, {
                high: 359,
                low: 0
            }, {
                high: 499,
                low: 360
            }, {
                high: 499,
                low: 360
            }, {
                high: 999,
                low: 500
            }, {
                high: 1199,
                low: 1000
            }, {
                high: 1199,
                low: 1000
            }, {
                high: 1499,
                low: 1200
            }, {
                high: 1699,
                low: 1500
            }, {
                high: Infinity,
                low: 1700
            }, {
                high: Infinity,
                low: 1700
            }
        ], "The results were as expected.");
    });


    QUnit.module("_getBreakpointSettings", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").returns(TileSizeBehavior.Responsive);
            const themingParametersStub = sandbox.stub(ThemingParameters, "get");
            themingParametersStub.callsFake(({ callback }) => {
                callback({
                    _sap_ushell_Tile_Spacing: "1rem",
                    _sap_ushell_Tile_Width: "5rem",
                    _sap_ushell_Tile_WidthXS: "4.25rem",
                    _sap_ushell_Tile_SpacingXS: "0.5rem"
                });
            });

            this.oGetWorkPageColumnMinFlex = sandbox.stub(WorkPageBuilderLayoutHelper, "_getWorkPageColumnMinFlex");
            this.oGetWorkPageColumnMinFlex.withArgs(416).returns(3);
            this.oGetWorkPageColumnMinFlex.withArgs(400).returns(4);
            this.oGetWorkPageColumnMinFlex.withArgs(352).returns(5);
            this.oGetWorkPageColumnMinFlex.withArgs(336).returns(6);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the expected array of breakpoint settings (Responsive sizeBehavior)", async function (assert) {
        // Act
        var aResults = await WorkPageBuilderLayoutHelper._getBreakpointSettings();

        // Assert
        assert.deepEqual(aResults, [
            {
                high: Infinity,
                low: 1724,
                sizeBehavior: TileSizeBehavior.Responsive,
                gap: "1rem",
                rowSize: "5rem",
                name: "lt-lp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: 3
            },
            {
                high: 1723,
                low: 1660,
                sizeBehavior: TileSizeBehavior.Responsive,
                gap: "1rem",
                rowSize: "5rem",
                name: "lt-sp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: 4
            },
            {
                high: 1659,
                low: 1468,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-lp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: 5
            },
            {
                high: 1467,
                low: 1404,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: 6
            },
            {
                high: 1403,
                low: 1296,
                sizeBehavior: TileSizeBehavior.Responsive,
                gap: "1rem",
                rowSize: "5rem",
                name: "lt-lp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: 3
            },
            {
                high: 1295,
                low: 1248,
                sizeBehavior: TileSizeBehavior.Responsive,
                gap: "1rem",
                rowSize: "5rem",
                name: "lt-sp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: 4
            },
            {
                high: 1247,
                low: 1104,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-lp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: 5
            },
            {
                high: 1103,
                low: 1056,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: 6
            },
            {
                high: 1055,
                low: 880,
                sizeBehavior: TileSizeBehavior.Responsive,
                gap: "1rem",
                rowSize: "5rem",
                name: "lt-lp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: 3
            },
            {
                high: 879,
                low: 848,
                sizeBehavior: TileSizeBehavior.Responsive,
                gap: "1rem",
                rowSize: "5rem",
                name: "lt-sp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: 4
            },
            {
                high: 847,
                low: 752,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-lp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: 5
            },
            {
                high: 751,
                low: 720,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: 6
            },
            {
                high: 719,
                low: 456,
                sizeBehavior: TileSizeBehavior.Responsive,
                gap: "1rem",
                rowSize: "5rem",
                name: "lt-lp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: 3
            },
            {
                high: 455,
                low: 440,
                sizeBehavior: TileSizeBehavior.Responsive,
                gap: "1rem",
                rowSize: "5rem",
                name: "lt-sp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: 4
            },
            {
                high: 439,
                low: 392,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-lp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: 5
            },
            {
                high: 391,
                low: 376,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: 6
            },
            {
                high: 375,
                low: 0,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-0",
                maxColumnsPerRow: 1,
                columnMinFlex: 6
            }
        ], "the expected array was returned.");
    });


    QUnit.test("Returns the expected array of breakpoint settings (Small sizeBehavior)", async function (assert) {
        // Arrange
        this.oConfigLastStub.returns(TileSizeBehavior.Small);
        this.oGetWorkPageColumnMinFlex.withArgs(416).returns(6);
        this.oGetWorkPageColumnMinFlex.withArgs(400).returns(5);
        this.oGetWorkPageColumnMinFlex.withArgs(352).returns(4);
        this.oGetWorkPageColumnMinFlex.withArgs(336).returns(3);

        // Act
        var aResults = await WorkPageBuilderLayoutHelper._getBreakpointSettings();

        // Assert
        assert.deepEqual(aResults, [
            {
                high: Infinity,
                low: 1724,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "lt-lp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: 6
            },
            {
                high: 1723,
                low: 1660,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "lt-sp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: 5
            },
            {
                high: 1659,
                low: 1468,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-lp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: 4
            },
            {
                high: 1467,
                low: 1404,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: 3
            },
            {
                high: 1403,
                low: 1296,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "lt-lp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: 6
            },
            {
                high: 1295,
                low: 1248,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "lt-sp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: 5
            },
            {
                high: 1247,
                low: 1104,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-lp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: 4
            },
            {
                high: 1103,
                low: 1056,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: 3
            },
            {
                high: 1055,
                low: 880,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "lt-lp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: 6
            },
            {
                high: 879,
                low: 848,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "lt-sp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: 5
            },
            {
                high: 847,
                low: 752,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-lp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: 4
            },
            {
                high: 751,
                low: 720,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: 3
            },
            {
                high: 719,
                low: 456,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "lt-lp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: 6
            },
            {
                high: 455,
                low: 440,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "lt-sp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: 5
            },
            {
                high: 439,
                low: 392,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-lp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: 4
            },
            {
                high: 391,
                low: 376,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: 3
            },
            {
                high: 375,
                low: 0,
                sizeBehavior: TileSizeBehavior.Small,
                gap: "0.5rem",
                rowSize: "4.25rem",
                name: "st-sp-0",
                maxColumnsPerRow: 1,
                columnMinFlex: 3
            }
        ], "the expected array was returned.");
    });


    QUnit.module("_onLayoutChange", {
        beforeEach: function () {
            this.oOnResizeStub = sandbox.stub(WorkPageBuilderLayoutHelper, "onResize");
            WorkPageBuilderLayoutHelper._oControl = {
                isA: sandbox.stub().returns(true),
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        width: 111
                    })
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("onResize is called with the expected arguments with a UI5 control", function (assert) {
        // Act
        WorkPageBuilderLayoutHelper._onLayoutChange();

        // Assert
        assert.ok(this.oOnResizeStub.calledOnce, "onResize was called once.");
        assert.deepEqual(this.oOnResizeStub.firstCall.args[0], {
            size: {
                width: 111
            }
        }, "onResize was called with the expected arguments.");
    });

    QUnit.test("onResize is called with the expected arguments with a dom element", function (assert) {
        // Arrange
        WorkPageBuilderLayoutHelper._oControl = window.document.createElement("div");

        // Act
        WorkPageBuilderLayoutHelper._onLayoutChange();

        // Assert
        assert.ok(this.oOnResizeStub.calledOnce, "onResize was called once.");
        assert.deepEqual(this.oOnResizeStub.firstCall.args[0], {
            size: {
                width: 0
            }
        }, "onResize was called with the expected arguments.");
    });

    QUnit.module("_getWorkPageColumnMinFlex", {
        beforeEach: function () {
            this.oQuerySelectorStub = sandbox.stub().returns({
                offsetWidth: 2000
            });

            this.oGetDomRefStub = sandbox.stub().returns({
                querySelector: this.oQuerySelectorStub
            });
            WorkPageBuilderLayoutHelper._oControl = {
                getDomRef: this.oGetDomRefStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns 4 if the domRef is not defined", function (assert) {
        // Arrange
        this.oGetDomRefStub.returns(undefined);

        // Act
        var bResult = WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416);

        // Assert
        assert.strictEqual(bResult, 4, "The result was 4");
    });

    QUnit.test("returns the expected values", function (assert) {
        // Act
        var aResults = [
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336)
        ];

        // Assert
        assert.deepEqual(aResults, [5, 5, 5, 5], "The expected result was returned.");
    });

    QUnit.test("returns the expected values for different screen widths", function (assert) {
        // Arrange
        this.oQuerySelectorStub.onCall(0).returns({ offsetWidth: 2000 });

        this.oQuerySelectorStub.onCall(1).returns({ offsetWidth: 1800 });
        this.oQuerySelectorStub.onCall(2).returns({ offsetWidth: 1800 });
        this.oQuerySelectorStub.onCall(3).returns({ offsetWidth: 1800 });
        this.oQuerySelectorStub.onCall(4).returns({ offsetWidth: 1800 });

        this.oQuerySelectorStub.onCall(5).returns({ offsetWidth: 1600 });
        this.oQuerySelectorStub.onCall(6).returns({ offsetWidth: 1600 });
        this.oQuerySelectorStub.onCall(7).returns({ offsetWidth: 1600 });
        this.oQuerySelectorStub.onCall(8).returns({ offsetWidth: 1600 });

        this.oQuerySelectorStub.onCall(9).returns({ offsetWidth: 1400 });
        this.oQuerySelectorStub.onCall(10).returns({ offsetWidth: 1400 });
        this.oQuerySelectorStub.onCall(11).returns({ offsetWidth: 1400 });
        this.oQuerySelectorStub.onCall(12).returns({ offsetWidth: 1400 });

        this.oQuerySelectorStub.onCall(13).returns({ offsetWidth: 1200 });
        this.oQuerySelectorStub.onCall(14).returns({ offsetWidth: 1200 });
        this.oQuerySelectorStub.onCall(15).returns({ offsetWidth: 1200 });
        this.oQuerySelectorStub.onCall(16).returns({ offsetWidth: 1200 });

        this.oQuerySelectorStub.onCall(17).returns({ offsetWidth: 1000 });
        this.oQuerySelectorStub.onCall(18).returns({ offsetWidth: 1000 });
        this.oQuerySelectorStub.onCall(19).returns({ offsetWidth: 1000 });
        this.oQuerySelectorStub.onCall(20).returns({ offsetWidth: 1000 });

        this.oQuerySelectorStub.onCall(21).returns({ offsetWidth: 800 });
        this.oQuerySelectorStub.onCall(22).returns({ offsetWidth: 800 });
        this.oQuerySelectorStub.onCall(23).returns({ offsetWidth: 800 });
        this.oQuerySelectorStub.onCall(24).returns({ offsetWidth: 800 });

        this.oQuerySelectorStub.onCall(25).returns({ offsetWidth: 600 });
        this.oQuerySelectorStub.onCall(26).returns({ offsetWidth: 600 });
        this.oQuerySelectorStub.onCall(27).returns({ offsetWidth: 600 });
        this.oQuerySelectorStub.onCall(28).returns({ offsetWidth: 600 });

        this.oQuerySelectorStub.onCall(29).returns({ offsetWidth: 400 });
        this.oQuerySelectorStub.onCall(30).returns({ offsetWidth: 400 });
        this.oQuerySelectorStub.onCall(31).returns({ offsetWidth: 400 });
        this.oQuerySelectorStub.onCall(32).returns({ offsetWidth: 400 });

        this.oQuerySelectorStub.onCall(33).returns({ offsetWidth: 200 });
        this.oQuerySelectorStub.onCall(34).returns({ offsetWidth: 200 });
        this.oQuerySelectorStub.onCall(35).returns({ offsetWidth: 200 });
        this.oQuerySelectorStub.onCall(36).returns({ offsetWidth: 200 });

        this.oQuerySelectorStub.onCall(37).returns({ offsetWidth: 0 });
        this.oQuerySelectorStub.onCall(38).returns({ offsetWidth: 0 });
        this.oQuerySelectorStub.onCall(39).returns({ offsetWidth: 0 });
        this.oQuerySelectorStub.onCall(40).returns({ offsetWidth: 0 });

        // Act
        var aResults = [
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336),

            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(416),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(400),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(352),
            WorkPageBuilderLayoutHelper._getWorkPageColumnMinFlex(336)
        ];

        // Assert
        assert.deepEqual(aResults, [
            5,
            6, 6, 5, 5,
            7, 6, 6, 6,
            8, 7, 7, 6,
            9, 8, 8, 7,
            10, 10, 9, 9,
            13, 12, 11, 11,
            17, 16, 15, 14,
            25, 24, 22, 21,
            50, 48, 43, 41,
            4, 4, 4, 4
        ], "The expected results were returned.");
    });
});


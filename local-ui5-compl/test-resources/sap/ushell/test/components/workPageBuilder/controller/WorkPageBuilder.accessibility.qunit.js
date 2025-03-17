// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.controller.WorkPageBuilder.controller
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.accessibility",
    "sap/f/library"
], function (
    WorkPageBuilderAccessibility,
    sapFLibrary
) {
    "use strict";
    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();
    var NavigationDirection = sapFLibrary.NavigationDirection;

    QUnit.module("WorkPageBuilderAccessibility - _handleBorderReached", {
        beforeEach: function () {
            this.oWorkPageBuilderAccessibility = new WorkPageBuilderAccessibility();
            this.oFindSuitableRowInGridStub = sandbox.stub(this.oWorkPageBuilderAccessibility, "_findSuitableRowInGrid");
            this.oGetCurrentFocusElementStub = sandbox.stub(this.oWorkPageBuilderAccessibility, "_getCurrentFocusElement");
            this.oGetParameterStub = sandbox.stub();
            this.oGetAggregationStub = sandbox.stub();
            this.oGetSourceStub = sandbox.stub().returns({
                getAggregation: this.oGetAggregationStub
            });
            this.oMockEvent = {
                getSource: this.oGetSourceStub,
                getParameter: this.oGetParameterStub
            };
            this.oFindNextGridStub = sandbox.stub(this.oWorkPageBuilderAccessibility, "_findNextGrid");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _findNextGrid with the expected arguments", function (assert) {
        // Arrange
        var sDirection = "SomeDirection";
        var oWorkPage = { some: "DummyWorkPage" };
        var oCurrentGrid = { some: "DummyGrid" };
        var oSomeElement = { some: "HTMLElement" };

        this.oGetCurrentFocusElementStub.returns(oSomeElement);
        this.oGetParameterStub.withArgs("direction").returns(sDirection);
        this.oGetAggregationStub.returns(oCurrentGrid);
        this.oFindNextGridStub.returns(null);

        // Act
        this.oWorkPageBuilderAccessibility._handleBorderReached(this.oMockEvent, oWorkPage);

        // Assert
        assert.strictEqual(this.oFindNextGridStub.callCount, 1, "_findNextGrid was called exactly once");
        assert.deepEqual(this.oFindNextGridStub.getCall(0).args, [oSomeElement, oWorkPage, sDirection], "_findNextGrid was called with the expected arguments");
    });

    QUnit.test("Calls the next GridContainers focusItemByDirection method with the expected arguments when a suitable grid was found", function (assert) {
        // Arrange
        var sDirection = "SomeDirection";
        var oWorkPage = { some: "DummyWorkPage" };
        var oCurrentGrid = { some: "DummyGrid" };
        var oFocusItemByDirectionStub = sandbox.stub();
        var oNextGrid = {
            focusItemByDirection: oFocusItemByDirectionStub
        };
        var iRow = 5;
        var iColumn = 3;
        var oSomeElement = { some: "HTMLElement" };

        this.oFindSuitableRowInGridStub.returns(iRow);
        this.oGetCurrentFocusElementStub.returns(oSomeElement);
        this.oFindNextGridStub.returns(oNextGrid);
        this.oGetParameterStub.withArgs("direction").returns(sDirection);
        this.oGetParameterStub.withArgs("row").returns(iRow);
        this.oGetParameterStub.withArgs("column").returns(iColumn);
        this.oGetAggregationStub.returns(oCurrentGrid);

        // Act
        this.oWorkPageBuilderAccessibility._handleBorderReached(this.oMockEvent, oWorkPage);

        // Assert
        assert.strictEqual(this.oFindNextGridStub.callCount, 1, "_findNextGrid was called exactly once");
        assert.strictEqual(oFocusItemByDirectionStub.callCount, 1, "focusItemByDirection was called exactly once");
        assert.deepEqual(oFocusItemByDirectionStub.getCall(0).args, [sDirection, iRow, iColumn], "focusItemByDirection was called with the expected arguments");
    });

    QUnit.test("Remembers the last focused grid and correctly re-focuses it on back navigation even if another one is closer", function (assert) {
        // Arrange
        var oWorkPage = { some: "DummyWorkPage" };
        var oInitialGridFocusItemByDirectionStub = sandbox.stub();
        var oSecondGridFocusItemByDirectionStub = sandbox.stub();
        var oThirdGridFocusItemByDirectionStub = sandbox.stub();
        var oSomeElement = { some: "HTMLElement" };

        var oInitialGrid = {
            focusItemByDirection: oInitialGridFocusItemByDirectionStub,
            isDestroyed: sandbox.stub().returns(false)
        };
        var oSecondGrid = {
            focusItemByDirection: oSecondGridFocusItemByDirectionStub,
            isDestroyed: sandbox.stub().returns(false)
        };
        var oThirdGrid = {
            focusItemByDirection: oThirdGridFocusItemByDirectionStub,
            isDestroyed: sandbox.stub().returns(false)
        };
        this.oGetCurrentFocusElementStub.returns(oSomeElement);
        this.oGetAggregationStub.returns(oInitialGrid);
        this.oGetParameterStub.withArgs("direction").returns("Right");
        this.oFindNextGridStub.returns(oSecondGrid);

        // Act
        this.oWorkPageBuilderAccessibility._handleBorderReached(this.oMockEvent, oWorkPage);

        // Assert
        assert.strictEqual(oInitialGridFocusItemByDirectionStub.callCount, 0, "The focusItemByDirection method of the initial grid was not called");
        assert.strictEqual(oSecondGridFocusItemByDirectionStub.callCount, 1, "The focusItemByDirection method of the second grid was called exactly once");
        assert.strictEqual(oThirdGridFocusItemByDirectionStub.callCount, 0, "The focusItemByDirection method of the third grid was not called");

        // This should re-focus the initial grid even though the oThirdGrid is closer
        // Arrange
        oInitialGridFocusItemByDirectionStub.reset();
        oSecondGridFocusItemByDirectionStub.reset();
        oThirdGridFocusItemByDirectionStub.reset();
        this.oGetAggregationStub.returns(oSecondGrid);
        this.oGetParameterStub.withArgs("direction").returns("Left");
        this.oFindNextGridStub.returns(oThirdGrid);

        // Act
        this.oWorkPageBuilderAccessibility._handleBorderReached(this.oMockEvent, oWorkPage);

        // Assert
        assert.strictEqual(oInitialGridFocusItemByDirectionStub.callCount, 1, "The focusItemByDirection method of the initial grid was exactly once");
        assert.strictEqual(oSecondGridFocusItemByDirectionStub.callCount, 0, "The focusItemByDirection method of the second grid was not called");
        assert.strictEqual(oThirdGridFocusItemByDirectionStub.callCount, 0, "The focusItemByDirection method of the third grid was not called");

    });

    QUnit.test("Does not break when the Grid saved in the history was destroyed in the meantime", function (assert) {
        // Arrange
        var oWorkPage = { some: "DummyWorkPage" };
        var oInitialGridFocusItemByDirectionStub = sandbox.stub();
        var oSecondGridFocusItemByDirectionStub = sandbox.stub();
        var oThirdGridFocusItemByDirectionStub = sandbox.stub();

        var oInitialGrid = {
            focusItemByDirection: oInitialGridFocusItemByDirectionStub,
            isDestroyed: sandbox.stub().returns(false)
        };
        var oSecondGrid = {
            focusItemByDirection: oSecondGridFocusItemByDirectionStub,
            isDestroyed: sandbox.stub().returns(false)
        };
        var oThirdGrid = {
            focusItemByDirection: oThirdGridFocusItemByDirectionStub,
            isDestroyed: sandbox.stub().returns(false)
        };
        this.oGetAggregationStub.returns(oInitialGrid);
        this.oGetParameterStub.withArgs("direction").returns("Right");
        this.oFindNextGridStub.returns(oSecondGrid);

        // Act
        this.oWorkPageBuilderAccessibility._handleBorderReached(this.oMockEvent, oWorkPage);

        // Re-Arrange
        oInitialGridFocusItemByDirectionStub.reset();
        oSecondGridFocusItemByDirectionStub.reset();
        oThirdGridFocusItemByDirectionStub.reset();
        this.oGetAggregationStub.returns(oSecondGrid);
        this.oGetParameterStub.withArgs("direction").returns("Left");
        this.oFindNextGridStub.returns(oThirdGrid);
        oInitialGrid.isDestroyed.returns(true);

        // Act
        this.oWorkPageBuilderAccessibility._handleBorderReached(this.oMockEvent, oWorkPage);

        // Assert
        assert.strictEqual(oInitialGridFocusItemByDirectionStub.callCount, 0, "The focusItemByDirection method of the initial grid was not called");
        assert.strictEqual(oSecondGridFocusItemByDirectionStub.callCount, 0, "The focusItemByDirection method of the second grid was not called");
        assert.strictEqual(oThirdGridFocusItemByDirectionStub.callCount, 1, "The focusItemByDirection method of the third grid was called exactly once");

    });

    QUnit.module("_findNextGrid", {
        beforeEach: function () {
            this.oWorkPageBuilderAccessibility = new WorkPageBuilderAccessibility();
            this.oGetAllGridsStub = sandbox.stub(this.oWorkPageBuilderAccessibility, "_getAllGrids");

            // Sample grids with easy(ish) to track positioning
            var oCurrentGrid = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 100,
                        left: 100,
                        bottom: 100,
                        top: 100
                    })
                })
            };
            var oGridNearRight = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 100,
                        left: 150,
                        bottom: 150,
                        top: 50
                    })
                })
            };
            var oGridFarRight = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 100,
                        left: 200,
                        bottom: 150,
                        top: 50
                    })
                })
            };
            var oGridNearLeft = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 50,
                        left: 100,
                        bottom: 150,
                        top: 50
                    })
                })
            };
            var oGridFarLeft = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 0,
                        left: 100,
                        bottom: 150,
                        top: 50
                    })
                })
            };
            var oGridNearBottom = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 150,
                        left: 50,
                        bottom: 100,
                        top: 150
                    })
                })
            };
            var oGridFarBottom = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 150,
                        left: 50,
                        bottom: 100,
                        top: 200
                    })
                })
            };
            var oGridNearTop = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 150,
                        left: 50,
                        bottom: 50,
                        top: 100
                    })
                })
            };
            var oGridFarTop = {
                getDomRef: sandbox.stub().returns({
                    getBoundingClientRect: sandbox.stub().returns({
                        right: 150,
                        left: 50,
                        bottom: 0,
                        top: 100
                    })
                })
            };
            this.oMockGrids = {
                oCurrentGrid: oCurrentGrid,
                oGridNearRight: oGridNearRight,
                oGridFarRight: oGridFarRight,
                oGridNearLeft: oGridNearLeft,
                oGridFarLeft: oGridFarLeft,
                oGridNearBottom: oGridNearBottom,
                oGridFarBottom: oGridFarBottom,
                oGridNearTop: oGridNearTop,
                oGridFarTop: oGridFarTop
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns null when no grids can be found", function (assert) {
        // Arrange
        var oCurrentGrid = {
            getDomRef: sandbox.stub().returns({
                getBoundingClientRect: sandbox.stub()
            })
        };
        var oWorkPage = { some: "WorkPage" };
        this.oGetAllGridsStub.returns([]);

        // Act
        var result = this.oWorkPageBuilderAccessibility._findNextGrid(oCurrentGrid, oWorkPage);

        // Assert
        assert.strictEqual(result, null, "null was returned");
    });

    QUnit.test("Returns null when the only found grid is the currently focused one", function (assert) {
        // Arrange
        var oCurrentGrid = {
            getDomRef: sandbox.stub().returns({
                getBoundingClientRect: sandbox.stub()
            })
        };
        var oWorkPage = { some: "WorkPage" };
        this.oGetAllGridsStub.returns([oCurrentGrid]);

        // Act
        var result = this.oWorkPageBuilderAccessibility._findNextGrid(oCurrentGrid.getDomRef(), oWorkPage);

        // Assert
        assert.strictEqual(result, null, "null was returned");
    });

    QUnit.test("Returns the correct grid when direction is \"Right\"", function (assert) {
        // Arrange
        var sDirection = NavigationDirection.Right;
        var oWorkPage = { some: "WorkPage" };
        var aMockGrids = Object.values(this.oMockGrids);
        this.oGetAllGridsStub.returns(aMockGrids);

        // Act
        var oResult = this.oWorkPageBuilderAccessibility._findNextGrid(this.oMockGrids.oCurrentGrid.getDomRef(), oWorkPage, sDirection);

        // Assert
        assert.strictEqual(oResult, this.oMockGrids.oGridNearRight, "The Grid to the near right was returned");
    });

    QUnit.test("Returns the correct grid when direction is \"Left\"", function (assert) {
        // Arrange
        var sDirection = NavigationDirection.Left;
        var oWorkPage = { some: "WorkPage" };
        var aMockGrids = Object.values(this.oMockGrids);
        this.oGetAllGridsStub.returns(aMockGrids);

        // Act
        var oResult = this.oWorkPageBuilderAccessibility._findNextGrid(this.oMockGrids.oCurrentGrid.getDomRef(), oWorkPage, sDirection);

        // Assert
        assert.strictEqual(oResult, this.oMockGrids.oGridNearLeft, "The Grid to the near left was returned");
    });

    QUnit.test("Returns the correct grid when direction is \"Down\"", function (assert) {
        // Arrange
        var sDirection = NavigationDirection.Down;
        var oWorkPage = { some: "WorkPage" };
        var aMockGrids = Object.values(this.oMockGrids);
        this.oGetAllGridsStub.returns(aMockGrids);

        // Act
        var oResult = this.oWorkPageBuilderAccessibility._findNextGrid(this.oMockGrids.oCurrentGrid.getDomRef(), oWorkPage, sDirection);

        // Assert
        assert.strictEqual(oResult, this.oMockGrids.oGridNearBottom, "The Grid to the near bottom was returned");
    });

    QUnit.test("Returns the correct grid when direction is \"Up\"", function (assert) {
        // Arrange
        var sDirection = NavigationDirection.Up;
        var oWorkPage = { some: "WorkPage" };
        var aMockGrids = Object.values(this.oMockGrids);
        this.oGetAllGridsStub.returns(aMockGrids);

        // Act
        var oResult = this.oWorkPageBuilderAccessibility._findNextGrid(this.oMockGrids.oCurrentGrid.getDomRef(), oWorkPage, sDirection);

        // Assert
        assert.strictEqual(oResult, this.oMockGrids.oGridNearTop, "The Grid to the near top was returned");
    });

    QUnit.module("_getAllGrids", {
        beforeEach: function () {
            this.oWorkPageBuilderAccessibility = new WorkPageBuilderAccessibility();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the expected GridContainers when there are any", function (assert) {
        // Arrange
        var oGridContainer = { some: "GridContainer" };
        var oCellWithGridContainer = {
            getAggregation: sandbox.stub().withArgs("_gridContainer").returns(oGridContainer),
            getGridContainer: sandbox.stub()
        };
        var oCellWithoutGridContainer = {
            getAggregation: sandbox.stub().withArgs("_gridContainer").returns(null)
        };
        var oColumnWithCells = {
            getCells: sandbox.stub().returns([oCellWithGridContainer, oCellWithoutGridContainer, oCellWithGridContainer])
        };
        var oColumnWithoutCells = {
            getCells: sandbox.stub().returns([])
        };
        var oRow = {
            getColumns: sandbox.stub().returns([oColumnWithCells, oColumnWithoutCells])
        };
        var oWorkPage = {
            getRows: sandbox.stub().returns([oRow])
        };

        // Act
        var aResult = this.oWorkPageBuilderAccessibility._getAllGrids(oWorkPage);

        // Assert
        assert.deepEqual(aResult, [oGridContainer, oGridContainer], "The expected GridContainer was returned and empty cells/columns were handled properly");
        assert.strictEqual(oCellWithGridContainer.getGridContainer.callCount, 0, "The \"getGridContainer\" method of the cell was not called");
    });

    QUnit.module("_isOppositeDirection", {
        beforeEach: function () {
            this.oWorkPageBuilderAccessibility = new WorkPageBuilderAccessibility();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns the expected result when no history is maintained", function (assert) {
        // Arrange
        var sDirection = "Right";

        // Act
        var bResult = this.oWorkPageBuilderAccessibility._isOppositeDirection(sDirection);

        // Assert
        assert.strictEqual(bResult, false, "Return value is 'false'");
    });

    QUnit.test("returns the expected result when history is maintained for direction 'Up'", function (assert) {
        // Arrange
        this.oWorkPageBuilderAccessibility._oFocusHistory.sLastDirection = "Up";
        var aExpectedFalseInputs = ["Left", "Right", "Up"];
        var sExpectedTrueInput = "Down";

        // Act
        var aExpectedFalseResults = [];
        aExpectedFalseInputs.forEach(function (input) {
            aExpectedFalseResults.push(this.oWorkPageBuilderAccessibility._isOppositeDirection(input));
        }.bind(this));
        var bExpectedTrueResult = this.oWorkPageBuilderAccessibility._isOppositeDirection(sExpectedTrueInput);

        // Assert
        assert.deepEqual(aExpectedFalseResults, [false, false, false], "Return values are 'false' for all non-opposite directions of 'Up'");
        assert.strictEqual(bExpectedTrueResult, true, "Return value is 'true' for 'Down'");
    });

    QUnit.test("returns the expected result when history is maintained for direction 'Down'", function (assert) {
        // Arrange
        this.oWorkPageBuilderAccessibility._oFocusHistory.sLastDirection = "Down";
        var aExpectedFalseInputs = ["Left", "Right", "Down"];
        var sExpectedTrueInput = "Up";

        // Act
        var aExpectedFalseResults = [];
        aExpectedFalseInputs.forEach(function (input) {
            aExpectedFalseResults.push(this.oWorkPageBuilderAccessibility._isOppositeDirection(input));
        }.bind(this));
        var bExpectedTrueResult = this.oWorkPageBuilderAccessibility._isOppositeDirection(sExpectedTrueInput);

        // Assert
        assert.deepEqual(aExpectedFalseResults, [false, false, false], "Return values are 'false' for all non-opposite directions of 'Down'");
        assert.strictEqual(bExpectedTrueResult, true, "Return value is 'true' for 'Up'");
    });

    QUnit.test("returns the expected result when history is maintained for direction 'Left'", function (assert) {
        // Arrange
        this.oWorkPageBuilderAccessibility._oFocusHistory.sLastDirection = "Left";
        var aExpectedFalseInputs = ["Left", "Up", "Down"];
        var sExpectedTrueInput = "Right";

        // Act
        var aExpectedFalseResults = [];
        aExpectedFalseInputs.forEach(function (input) {
            aExpectedFalseResults.push(this.oWorkPageBuilderAccessibility._isOppositeDirection(input));
        }.bind(this));
        var bExpectedTrueResult = this.oWorkPageBuilderAccessibility._isOppositeDirection(sExpectedTrueInput);

        // Assert
        assert.deepEqual(aExpectedFalseResults, [false, false, false], "Return values are 'false' for all non-opposite directions of 'Left'");
        assert.strictEqual(bExpectedTrueResult, true, "Return value is 'true' for 'Right'");
    });

    QUnit.test("returns the expected result when history is maintained for direction 'Right'", function (assert) {
        // Arrange
        this.oWorkPageBuilderAccessibility._oFocusHistory.sLastDirection = "Right";
        var aExpectedFalseInputs = ["Up", "Right", "Down"];
        var sExpectedTrueInput = "Left";

        // Act
        var aExpectedFalseResults = [];
        aExpectedFalseInputs.forEach(function (input) {
            aExpectedFalseResults.push(this.oWorkPageBuilderAccessibility._isOppositeDirection(input));
        }.bind(this));
        var bExpectedTrueResult = this.oWorkPageBuilderAccessibility._isOppositeDirection(sExpectedTrueInput);

        // Assert
        assert.deepEqual(aExpectedFalseResults, [false, false, false], "Return values are 'false' for all non-opposite directions of 'Right'");
        assert.strictEqual(bExpectedTrueResult, true, "Return value is 'true' for 'Left'");
    });

    QUnit.module("_findSuitableRowInGrid", {
        beforeEach: function () {
            this.oWorkPageBuilderAccessibility = new WorkPageBuilderAccessibility();
            this.oGetNavigationMatrixStub = sandbox.stub();
            this.oMockTargetGrid = {
                getNavigationMatrix: this.oGetNavigationMatrixStub
            };
            this.oGetDistanceToElementInDirectionStub = sandbox.stub(this.oWorkPageBuilderAccessibility, "_getDistanceToElementInDirection");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("defaults to 0 when the NavigationMatrix of the grid is empty", function (assert) {
        // Arrange
        var iResult;
        this.oGetNavigationMatrixStub.returns([]);

        // Act
        iResult = this.oWorkPageBuilderAccessibility._findSuitableRowInGrid(this.oMockTargetGrid);

        // Assert
        assert.strictEqual(iResult, 0, "0 was returned");
    });

    QUnit.test("finds the correct row in the grid", function (assert) {
        // Arrange
        var oCurrentElement = { the: "CurrentElement" };
        var sDirection = "Right";
        var oWrongElement = { the: "WrongElement" };
        var oOtherWrongElement = { the: "OtherWrongElement" };
        var oCorrectElement = { the: "CorrectElement" };
        var aNavigationMatrix = [
            [oWrongElement, oWrongElement, false, false],
            [false, false, false, false],
            [oOtherWrongElement, oOtherWrongElement, oCorrectElement, oCorrectElement]
        ];
        var iExpectedResult = 2;
        var iResult;

        this.oGetNavigationMatrixStub.returns(aNavigationMatrix, oCurrentElement, sDirection);
        this.oGetDistanceToElementInDirectionStub.withArgs(oCurrentElement, oCorrectElement, sDirection).returns(1);
        this.oGetDistanceToElementInDirectionStub.returns(null);

        // Act
        iResult = this.oWorkPageBuilderAccessibility._findSuitableRowInGrid(this.oMockTargetGrid, oCurrentElement, sDirection);

        // Assert
        assert.strictEqual(iResult, iExpectedResult, "The correct row was returned");
        assert.strictEqual(this.oGetDistanceToElementInDirectionStub.callCount, 3, "_getDistanceToElementInDirection was not called more than necessary");
    });

    QUnit.module("The function focusFirstItem", {
        beforeEach: function () {
            this.oWorkPageBuilderAccessibility = new WorkPageBuilderAccessibility();

            this.oGridWithoutItems = {
                getItems: sandbox.stub().returns([])
            };

            this.oFocusStub = sandbox.stub();

            this.oGridItemDomRef = {
                focus: this.oFocusStub
            };

            this.oItemDomRef = {
                closest: sandbox.stub().returns(this.oGridItemDomRef)
            };

            this.oGridWithItems = {
                getItems: sandbox.stub().returns([{
                    getDomRef: sandbox.stub().returns(this.oItemDomRef)
                }])
            };

            this.aGrids = [
                this.oGridWithoutItems,
                this.oGridWithItems
            ];
            this.oGetAllGridsStub = sandbox.stub(this.oWorkPageBuilderAccessibility, "_getAllGrids").returns(this.aGrids);
            this.oWorkPage = {};

            this.oWorkPageBuilderAccessibility._bInitialItemFocused = false;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("sets the focus on the first item in the WorkPage.", function (assert) {
        // Act
        this.oWorkPageBuilderAccessibility.focusFirstItem(this.oWorkPage);

        // Assert
        assert.strictEqual(this.oGetAllGridsStub.callCount, 1, "The _getAllGrids was called once.");
        assert.ok(this.oGetAllGridsStub.calledWith(this.oWorkPage), "The _getAllGrids was called with the correct parameter.");

        assert.strictEqual(this.oGridWithoutItems.getItems.callCount, 1, "The getItems was called on the first grid.");
        assert.strictEqual(this.oGridWithItems.getItems.callCount, 2, "The getItems was called twice on the second grid.");

        assert.strictEqual(this.oItemDomRef.closest.callCount, 1, "The closest method was called once.");

        assert.strictEqual(this.oFocusStub.callCount, 1, "The focus method was called once.");
        assert.deepEqual(this.oFocusStub.firstCall.args, [{ preventScroll: true }], "The focus method was called with the expected arguments.");

        assert.strictEqual(this.oWorkPageBuilderAccessibility._bInitialItemFocused, true, "The _bInitialItemFocused variable was true.");
    });

    QUnit.test("does not set the focus if initial focus has been set.", function (assert) {
        // Arrange
        this.oWorkPageBuilderAccessibility._bInitialItemFocused = true;

        // Act
        this.oWorkPageBuilderAccessibility.focusFirstItem(this.oWorkPage);

        // Assert
        assert.strictEqual(this.oGetAllGridsStub.callCount, 1, "The _getAllGrids was called once.");
        assert.ok(this.oGetAllGridsStub.calledWith(this.oWorkPage), "The _getAllGrids was called with the correct parameter.");

        assert.strictEqual(this.oGridWithoutItems.getItems.callCount, 1, "The getItems was called on the first grid.");
        assert.strictEqual(this.oGridWithItems.getItems.callCount, 1, "The getItems was called on the second grid.");

        assert.strictEqual(this.oItemDomRef.closest.callCount, 0, "The closest method was not called.");
        assert.strictEqual(this.oFocusStub.callCount, 0, "The focus method was called not called.");

        assert.strictEqual(this.oWorkPageBuilderAccessibility._bInitialItemFocused, true, "The _bInitialItemFocused variable was true.");
    });

    QUnit.test("does not set the focus if no grid has items.", function (assert) {
        // Arrange
        this.oGetAllGridsStub.returns([
            { getItems: sandbox.stub().returns([]) },
            { getItems: sandbox.stub().returns([]) },
            { getItems: sandbox.stub().returns([]) },
            { getItems: sandbox.stub().returns([]) }
        ]);

        // Act
        this.oWorkPageBuilderAccessibility.focusFirstItem(this.oWorkPage);

        // Assert
        assert.strictEqual(this.oGetAllGridsStub.callCount, 1, "The _getAllGrids was called once.");
        assert.ok(this.oGetAllGridsStub.calledWith(this.oWorkPage), "The _getAllGrids was called with the correct parameter.");

        assert.strictEqual(this.oItemDomRef.closest.callCount, 0, "The closest method was not called.");
        assert.strictEqual(this.oFocusStub.callCount, 0, "The focus method was called not called.");
        assert.strictEqual(this.oWorkPageBuilderAccessibility._bInitialItemFocused, false, "The _bInitialItemFocused variable was false.");
    });
});

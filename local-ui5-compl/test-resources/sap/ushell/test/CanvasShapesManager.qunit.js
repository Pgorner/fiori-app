// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/CanvasShapesManager",
    "sap/ui/core/theming/Parameters",
    "sap/ushell/Container"
], function (
    CanvasShapesManager,
    ThemingParameters,
    Container
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    var oCanvasShapesManager = Object.create(CanvasShapesManager);

    QUnit.module("sap.ushell.CanvasShapes", {
        beforeEach: function () {
            sandbox.stub(Container, "getRendererInternal").returns({
                setShellShapes: function (oDomRef) {
                    document.getElementById("qunit-fixture").appendChild(oDomRef);
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Point sanity test", function (assert) {
        var point = oCanvasShapesManager.getPoint(5, 6);
        assert.ok(point.x === 5, "The expected x value is 5");
        assert.ok(point.y === 6, "The expected y value is 6");
    });

    QUnit.test("Point.getDistance test", function (assert) {
        var point = oCanvasShapesManager.getPoint(5, 6),
            distanceToNegativePoint = point.getDistance(oCanvasShapesManager.getPoint(-7, -8)),
            distanceToPositivePoint = point.getDistance(oCanvasShapesManager.getPoint(7, 8)),
            distanceToNegativeFractionPoint = point.getDistance(oCanvasShapesManager.getPoint(-7.5, -8.9)),
            distanceToPositiveFractionPoint = point.getDistance(oCanvasShapesManager.getPoint(7.5, 8.9));

        assert.ok(distanceToNegativePoint === 18, "The expected value is 18");
        assert.ok(distanceToPositivePoint === 2, "The expected value is 2");
        assert.ok(distanceToNegativeFractionPoint === 19, "The expected value is 19");
        assert.ok(distanceToPositiveFractionPoint === 3, "The expected value is The expected value is 3");
    });

    QUnit.test("Point.getSegment test", function (assert) {
        var point = oCanvasShapesManager.getPoint(0, 0),
            firstQuarter = point.getSegment(oCanvasShapesManager.getPoint(1, 1)),
            secondQuarter = point.getSegment(oCanvasShapesManager.getPoint(1, -1)),
            thirdQuarter = point.getSegment(oCanvasShapesManager.getPoint(-1, -1)),
            fourthQuarter = point.getSegment(oCanvasShapesManager.getPoint(-1, 1));

        assert.ok(firstQuarter === 1, "The expected value is 1");
        assert.ok(secondQuarter === 2, "The expected value is 2");
        assert.ok(thirdQuarter === 3, "The expected value is 3");
        assert.ok(fourthQuarter === 4, "The expected value is 4");
    });

    QUnit.test("Point.offset test", function (assert) {
        var point = oCanvasShapesManager.getPoint(0, 0);

        point.offset(-1, -1);
        assert.ok(point.x === -1, "");
        assert.ok(point.y === -1, "");

        point.offset(1, 1);
        assert.ok(point.x === 0, "");
        assert.ok(point.y === 0, "");
    });

    QUnit.test("_generateRandomAmorphousShapeValues test", function (assert) {
        var values = oCanvasShapesManager._generateRandomAmorphousShapeValues();

        assert.ok(values.edge0.xOffSet < 401 && values.edge0.xOffSet > 199, "Actual value " + values.edge0.xOffSet);
        assert.ok(values.edge0.yOffSet < -199 && values.edge0.yOffSet > -401, "Actual value " + values.edge0.yOffSet);
        assert.ok(values.edge1.xOffSet < 401 && values.edge1.xOffSet > 199, "Actual value " + values.edge1.xOffSet);
        assert.ok(values.edge1.yOffSet < -199 && values.edge1.yOffSet > -401, "Actual value " + values.edge1.yOffSet);
    });

    QUnit.test("makeAmorphousShape test", function (assert) {
        var squarePoints = oCanvasShapesManager._getSquarePoints(10, oCanvasShapesManager.getPoint(0, 0)),
            bezierCurves = oCanvasShapesManager._calculatebezierCurves(10, squarePoints),
            shape = { bezierCurves: bezierCurves, centerPoint: "" },
            result = oCanvasShapesManager.makeAmorphousShape(shape, 0, 3, 3, 0, 0);

        assert.ok(result.bezierCurves[0].controlPoint1.x === 13 && result.bezierCurves[0].controlPoint1.y === -2, "result should be (13,-2), result is: ("
            + result.bezierCurves[0].controlPoint1.x + "," + result.bezierCurves[0].controlPoint1.y + ")");
        assert.ok(result.bezierCurves[3].controlPoint2.x === 7 && result.bezierCurves[3].controlPoint2.y === 2, "result should be (7,2), result is: ("
            + result.bezierCurves[3].controlPoint2.x + "," + result.bezierCurves[3].controlPoint2.y + ")");

        squarePoints = oCanvasShapesManager._getSquarePoints(10, oCanvasShapesManager.getPoint(0, 0));
        bezierCurves = oCanvasShapesManager._calculatebezierCurves(10, squarePoints);
        shape = { bezierCurves: bezierCurves, centerPoint: "" };
        result = oCanvasShapesManager.makeAmorphousShape(shape, 1, 3, 3, 0, 0);
        assert.ok(result.bezierCurves[0].controlPoint2.x === 8 && result.bezierCurves[0].controlPoint2.y === -7, "result should be (8,-7), result is: ("
            + result.bezierCurves[0].controlPoint2.x + "," + result.bezierCurves[0].controlPoint2.y + ")");
        assert.ok(result.bezierCurves[1].controlPoint1.x === -8 && result.bezierCurves[1].controlPoint1.y === -13, "result should be (-8,-13), result is: ("
            + result.bezierCurves[1].controlPoint1.x + "," + result.bezierCurves[1].controlPoint1.y + ")");
    });

    QUnit.test("_rotatePoints test", function (assert) {
        var result = oCanvasShapesManager._rotatePoints(5, 5, oCanvasShapesManager.getPoint(0, 0), oCanvasShapesManager.getPoint(0, 0));
        assert.ok(result[0].x === 5 && result[0].y == 5, "result should be (5,5), result is: (" + result[0].x + "," + result[0].y + ")");
        assert.ok(result[1].x === -5 && result[1].y == -5, "result should be (-5,-5), result is: (" + result[0].x + "," + result[0].y + ")");

        result = oCanvasShapesManager._rotatePoints(-5, -5, oCanvasShapesManager.getPoint(0, 0), oCanvasShapesManager.getPoint(0, 0));
        assert.ok(result[0].x === -5 && result[0].y == -5, "result should be (-5,-5), result is: (" + result[0].x + "," + result[0].y + ")");
        assert.ok(result[1].x === 5 && result[1].y == 5, "result should be (5,5), result is: (" + result[0].x + "," + result[0].y + ")");
    });

    QUnit.test("_getSquarePoints test", function (assert) {
        var squarePoints = oCanvasShapesManager._getSquarePoints(10, oCanvasShapesManager.getPoint(0, 0));
        assert.ok(squarePoints[0].x === 10 && squarePoints[0].y === 0, "values should be: (10,0), instead we got(" + squarePoints[0].x + "," + squarePoints[0].y + ")");
        assert.ok(squarePoints[1].x === 0 && squarePoints[1].y === -10, "values should be: (0,-10), instead we got(" + squarePoints[1].x + "," + squarePoints[1].y + ")");
        assert.ok(squarePoints[2].x === -10 && squarePoints[2].y === 0, "values should be: (-10,0), instead we got(" + squarePoints[2].x + "," + squarePoints[2].y + ")");
        assert.ok(squarePoints[3].x === 0 && squarePoints[3].y === 10, "values should be: (0,10), instead we got(" + squarePoints[3].x + "," + squarePoints[3].y + ")");
    });

    QUnit.test("_getRandomInt test", function (assert) {
        var num = oCanvasShapesManager._getRandomInt(0, 1);
        assert.ok(num <= 1 && num >= 0, "num should be in range 0-1, num value is:" + num);

        num = oCanvasShapesManager._getRandomInt(5, 10);
        assert.ok(num <= 10 && num >= 5, "num should be in range 5-10, num value is:" + num);
    });

    QUnit.test("_calculatebezierCurves test", function (assert) {
        var radius = 10;
        var squarePoints = oCanvasShapesManager._getSquarePoints(10, oCanvasShapesManager.getPoint(0, 0));
        var aResult = oCanvasShapesManager._calculatebezierCurves(radius, squarePoints);

        // aResult[0] First bezier curve
        var oExpectedPoint = { x: 10, y: -5 };
        var oResultPoint = { x: aResult[0].controlPoint1.x, y: aResult[0].controlPoint1.y };
        assert.deepEqual(oResultPoint, oExpectedPoint, "Returned the correct ControlPoint1 for the first curve");
        oExpectedPoint = { x: 5, y: -10 };
        oResultPoint = { x: aResult[0].controlPoint2.x, y: aResult[0].controlPoint2.y };
        assert.deepEqual(oResultPoint, oExpectedPoint, "Returned the correct ControlPoint2 for the first curve");
        // aResult[1] Second bezier curve
        oExpectedPoint = { x: -5, y: -10 };
        oResultPoint = { x: aResult[1].controlPoint1.x, y: aResult[1].controlPoint1.y };
        assert.deepEqual(oResultPoint, oExpectedPoint, "Returned the correct ControlPoint1 for the second curve");
        oExpectedPoint = { x: -10, y: -5 };
        oResultPoint = { x: aResult[1].controlPoint2.x, y: aResult[1].controlPoint2.y };
        assert.deepEqual(oResultPoint, oExpectedPoint, "Returned the correct ControlPoint2 for the second curve");
        // aResult[2] Third bezier curve
        oExpectedPoint = { x: -10, y: 5 };
        oResultPoint = { x: aResult[2].controlPoint1.x, y: aResult[2].controlPoint1.y };
        assert.deepEqual(oResultPoint, oExpectedPoint, "Returned the correct ControlPoint1 for the third curve");
        oExpectedPoint = { x: -5, y: 10 };
        oResultPoint = { x: aResult[2].controlPoint2.x, y: aResult[2].controlPoint2.y };
        assert.deepEqual(oResultPoint, oExpectedPoint, "Returned the correct ControlPoint2 for the third curve");
        // aResult[3] Fourth bezier curve
        oExpectedPoint = { x: 5, y: 10 };
        oResultPoint = { x: aResult[3].controlPoint1.x, y: aResult[3].controlPoint1.y };
        assert.deepEqual(oResultPoint, oExpectedPoint, "Returned the correct ControlPoint1 for the fourth curve");
        oExpectedPoint = { x: 10, y: 5 };
        oResultPoint = { x: aResult[3].controlPoint2.x, y: aResult[3].controlPoint2.y };
        assert.deepEqual(oResultPoint, oExpectedPoint, "Returned the correct ControlPoint2 for the fourth curve");
    });

    QUnit.test("Shapes drawn only when a color was supplied", async function (assert) {
        var themingParametersStub;
        var oDrawShapesSpy = sandbox.spy(oCanvasShapesManager, "drawShapes");

        themingParametersStub = sinon.stub(ThemingParameters, "get").returns({
            sapUiShellBackgroundPatternColor: "ffffff"
        });
        await oCanvasShapesManager.onThemeChanged();

        assert.ok(oDrawShapesSpy.called, "Shapes drawn when color supplied");
        themingParametersStub.restore();
        oDrawShapesSpy.reset();

        themingParametersStub = sinon.stub(ThemingParameters, "get").callsFake(({ callback }) => {
            callback({});
        });
        await oCanvasShapesManager.onThemeChanged();
        assert.ok(oDrawShapesSpy.notCalled, "Shapes not drawn when color undefined");
        themingParametersStub.restore();

        themingParametersStub = sinon.stub(ThemingParameters, "get").returns({
            sapUiShellBackgroundPatternColor: "transparent"
        });
        await oCanvasShapesManager.onThemeChanged();

        assert.ok(oDrawShapesSpy.notCalled, "Shapes not drawn when color is transparent");
        themingParametersStub.restore();

        oDrawShapesSpy.restore();
    });

    QUnit.module("drawShapes", {
        beforeEach: function () {
            this.oMockContext = {
                clearRect: sandbox.stub(),
                beginPath: sandbox.stub(),
                moveTo: sandbox.stub(),
                bezierCurveTo: sandbox.stub(),
                closePath: sandbox.stub(),
                fill: sandbox.stub(),
                fillStyle: "rgba(1,1,1,1)"
            };

            var oGetElementByIdStub = sandbox.stub(document, "getElementById");
            oGetElementByIdStub.withArgs("shell-shapes").returns({
                getContext: sandbox.stub().withArgs("2d").returns(this.oMockContext)
            });
            oGetElementByIdStub.callThrough();

            this.sColor = "rgba(0,0,0,0)";
            this.oParametersGetStub = sandbox.stub(ThemingParameters, "get").returns({
                sapUiShellBackgroundPatternColor: this.sColor
            });

            this.oCanvasShapesManager = Object.create(CanvasShapesManager);
            this.oCanvasShapesManager.shapes = [{
                bezierCurves: [
                    {
                        startPoint: {
                            x: 1,
                            y: 2
                        },
                        controlPoint1: {
                            x: 3,
                            y: 4
                        },
                        controlPoint2: {
                            x: 5,
                            y: 6
                        },
                        endPoint: {
                            x: 7,
                            y: 8
                        }
                    }
                ]
            }];
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Clears the canvas and the dirtyState", async function (assert) {
        // Act
        await this.oCanvasShapesManager.drawShapes();
        // Assert
        assert.strictEqual(this.oMockContext.clearRect.callCount, 1, "context.clearRect was called once");
        assert.strictEqual(this.oCanvasShapesManager.bIsDirty, false, "bIsDirty was correctly set");
    });

    QUnit.test("Does not fetch the shapesColor when it is already defined", async function (assert) {
        // Arrange
        this.oCanvasShapesManager.sShapesColor = "transparent";
        // Act
        await this.oCanvasShapesManager.drawShapes();
        // Assert
        assert.strictEqual(this.oParametersGetStub.callCount, 0, "ThemingParameters.get was not called");
        assert.strictEqual(this.oCanvasShapesManager.sShapesColor, "transparent", "The shapesColor was not changed");
    });

    QUnit.test("Fetches the shapesColor when undefined", async function (assert) {
        // Arrange
        this.oCanvasShapesManager.sShapesColor = undefined;
        // Act
        await this.oCanvasShapesManager.drawShapes();
        // Assert
        assert.strictEqual(this.oParametersGetStub.callCount, 1, "ThemingParameters.get was called once");
        assert.strictEqual(this.oCanvasShapesManager.sShapesColor, this.sColor, "The shapesColor was saved");
    });

    QUnit.test("Draws shapes", async function (assert) {
        // Arrange
        this.oCanvasShapesManager.sShapesColor = undefined;
        // Act
        await this.oCanvasShapesManager.drawShapes();
        // Assert
        assert.strictEqual(this.oMockContext.beginPath.callCount, 1, "context.beginPath was called once");
        assert.deepEqual(this.oMockContext.moveTo.getCall(0).args, [1, 2], "context.moveTo was called with correct args");
        assert.deepEqual(this.oMockContext.bezierCurveTo.getCall(0).args, [3, 4, 5, 6, 7, 8], "context.bezierCurveTo was called with correct args");
        assert.strictEqual(this.oMockContext.closePath.callCount, 1, "context.closePath was called once");
        assert.strictEqual(this.oMockContext.fillStyle, this.sColor, "fillStyle was set correctly");
        assert.strictEqual(this.oMockContext.fill.callCount, 1, "context.fill was called once");
    });

    QUnit.test("Doesn't draw when the shapesColor is 'transparent'", async function (assert) {
        // Arrange
        this.oCanvasShapesManager.sShapesColor = undefined;
        this.oParametersGetStub.returns({
            sapUiShellBackgroundPatternColor: "transparent"
        });
        // Act
        await this.oCanvasShapesManager.drawShapes();
        // Assert
        assert.strictEqual(this.oMockContext.beginPath.callCount, 0, "context.beginPath was not called");
        assert.strictEqual(this.oCanvasShapesManager.bIsDirty, false, "bIsDirty was correctly set");
    });
});

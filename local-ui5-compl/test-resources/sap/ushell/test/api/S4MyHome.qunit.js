// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.api.S4MyHome
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ui/core/routing/Router",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/api/S4MyHome",
    "sap/ushell/Container",
    "sap/ushell/utils"
], function (
    EventBus,
    Router,
    hasher,
    S4MyHome,
    Container,
    ushellUtils
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("routeMatched Event", {
        beforeEach: function () {
            this.oRouter = new Router([{
                name: "home",
                pattern: "home"
            }, {
                name: "other",
                pattern: "other"
            }]);
            this.oRouter.initialize();
            this.oRouter.navTo("home"); // initialize to home

            sandbox.stub(Container, "getRendererInternal").withArgs("fiori2").returns({
                getRouter: sandbox.stub().returns(this.oRouter)
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oRouter.destroy();
            S4MyHome.reset();
        }
    });

    QUnit.test("Handler is called with 'isMyHomeRoute=false' for navigation to other.", function (assert) {
        //Arrange
        const oHandler = sandbox.stub();
        const oScope = {};

        //Act
        S4MyHome.attachRouteMatched(oHandler, oScope);
        this.oRouter.navTo("other");

        //Assert
        assert.strictEqual(oHandler.callCount, 1, "The handler was called.");
        assert.strictEqual(oHandler.getCall(0).thisValue, oScope, "The handler was called with the correct scope.");
        const oHandlerArguments = oHandler.getCall(0).args;
        assert.strictEqual(oHandlerArguments[0].getParameter("isMyHomeRoute"), false, "The handler was called with the correct arguments.");
    });

    QUnit.test("Handler is called with 'isMyHomeRoute=true' for navigation to home.", function (assert) {
        //Arrange
        this.oRouter.navTo("other");
        const oHandler = sandbox.stub();
        const oScope = {};

        //Act
        S4MyHome.attachRouteMatched(oHandler, oScope);
        this.oRouter.navTo("home");

        //Assert
        assert.strictEqual(oHandler.callCount, 1, "The handler was called.");
        assert.strictEqual(oHandler.getCall(0).thisValue, oScope, "The handler was called with the correct scope.");
        const oHandlerArguments = oHandler.getCall(0).args;
        assert.strictEqual(oHandlerArguments[0].getParameter("isMyHomeRoute"), true, "The handler was called with the correct arguments.");
    });

    QUnit.test("Handler is not called with 'isMyHomeRoute=true' for navigation to home, when triggered by the EventBus", function (assert) {
        //Arrange
        const oHandler = sandbox.stub();
        const oScope = {};
        const oEventBus = EventBus.getInstance();
        sandbox.stub(hasher, "getHash").returns("Shell-home");

        //Act
        S4MyHome.attachRouteMatched(oHandler, oScope);
        oEventBus.publish("sap.ushell", "navigated");

        //Assert
        assert.strictEqual(oHandler.callCount, 0, "The handler was not  called.");
    });

    QUnit.test("Handler is called with 'isMyHomeRoute=false' for navigation to other, when triggered by the EventBus", function (assert) {
        //Arrange
        const oHandler = sandbox.stub();
        const oScope = {};
        const oEventBus = EventBus.getInstance();
        sandbox.stub(hasher, "getHash").returns("Action-toBookmark");

        //Act
        S4MyHome.attachRouteMatched(oHandler, oScope);
        oEventBus.publish("sap.ushell", "navigated");

        //Assert
        assert.strictEqual(oHandler.callCount, 1, "The handler was called.");
        assert.strictEqual(oHandler.getCall(0).thisValue, oScope, "The handler was called with the correct scope.");
        const oHandlerArguments = oHandler.getCall(0).args;
        assert.strictEqual(oHandlerArguments[0].getParameter("isMyHomeRoute"), false, "The handler was called with the correct arguments.");
    });

    QUnit.test("Handler is not called with 'isMyHomeRoute=false' for navigation to flp managed routes, when triggered by the EventBus", function (assert) {
        //Arrange
        const oHandler = sandbox.stub();
        const oScope = {};
        const oEventBus = EventBus.getInstance();
        sandbox.stub(hasher, "getHash").returns("other");

        //Act
        S4MyHome.attachRouteMatched(oHandler, oScope);
        oEventBus.publish("sap.ushell", "navigated");

        //Assert
        assert.strictEqual(oHandler.callCount, 0, "The handler was not called.");
    });

    QUnit.test("Handler is not called after detaching.", function (assert) {
        //Arrange
        const oHandler = sandbox.stub();
        const oScope = {};

        //Act
        S4MyHome.attachRouteMatched(oHandler, oScope);
        S4MyHome.detachRouteMatched(oHandler, oScope);
        this.oRouter.navTo("other");

        //Assert
        assert.strictEqual(oHandler.callCount, 0, "The handler was not called.");
    });

    QUnit.module("formatDate", {
        beforeEach: async function () {
            sandbox.stub(ushellUtils, "formatDate");
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards call to ushell/utils", async function (assert) {
        // Arrange
        ushellUtils.formatDate.returnsArg(0);
        // Act
        const sResult = S4MyHome.formatDate("2021-01-01T00:00:00Z");
        // Assert
        assert.strictEqual(sResult, "2021-01-01T00:00:00Z", "The call was forwarded.");
        assert.strictEqual(ushellUtils.formatDate.callCount, 1, "The call was forwarded.");
    });
});

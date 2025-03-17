// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.StateManager
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/components/pages/StateManager",
    "sap/ushell/EventHub",
    "sap/base/util/ObjectPath",
    "sap/ui/base/Object",
    "sap/m/NavContainer",
    "sap/m/Page",
    "sap/ushell/Container"
], function (EventBus, StateManager, EventHub, ObjectPath, Object, NavContainer, Page, Container) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function init", {
        beforeEach: function () {
            window.hasher = {
                getHash: sandbox.stub()
            };
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.pagesRuntimeNavContainer = new NavContainer({
                id: "pagesRuntime",
                pages: [
                    new Page({ id: "emptyPage" }),
                    new NavContainer({
                        id: "pages",
                        pages: [
                            new Page({ id: "page1" }),
                            new Page({ id: "page2" })
                        ]
                    })
                ]
            });
            this.pagesNavContainer = this.pagesRuntimeNavContainer.getPages()[1];
            this.pagesRuntimeNavContainer.to("pages");
            sandbox.spy(this.pagesRuntimeNavContainer, "attachNavigate");
            sandbox.spy(this.pagesNavContainer, "attachNavigate");

            this.oEventBusSubscribeStub = sandbox.stub(EventBus.getInstance(), "subscribe");
            this.oAddEventListenerStub = sandbox.stub(document, "addEventListener");

            this.oEventHubDoStub = sandbox.stub();
            this.oEventHubOnceStub = sandbox.stub(EventHub, "once");
            this.oEventHubOnceStub.returns({
                do: this.oEventHubDoStub
            });

            this.oSetPageVisibilityStub = sandbox.stub(StateManager, "_setPageVisibility");
        },
        afterEach: function () {
            sandbox.restore();
            this.pagesRuntimeNavContainer.destroy();
            delete window.hasher;
        }
    });

    QUnit.test("Adds listeners for visibility handling", function (assert) {
        // Act
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        // Assert
        assert.ok(this.oAddEventListenerStub.calledOnce, "The function addEventListener is called once.");
        assert.strictEqual(this.oAddEventListenerStub.getCall(0).args[0], "visibilitychange", "The function addEventListener is called with correct parameters.");
        assert.strictEqual(this.pagesNavContainer.attachNavigate.callCount, 1, "attachNavigate was called");
        assert.strictEqual(this.pagesRuntimeNavContainer.attachNavigate.callCount, 1, "attachNavigate was called");

        assert.strictEqual(this.oEventBusSubscribeStub.withArgs("launchpad", "setConnectionToServer").callCount, 1, "The function subscribe is called with correct parameters.");
        assert.strictEqual(this.oEventBusSubscribeStub.withArgs("sap.ushell", "navigated").callCount, 1, "The function subscribe is called with correct parameters.");
    });

    QUnit.test("Initializes the first page with true", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        var fnHandler = this.oEventHubDoStub.getCall(0).args[0]; //PagesRuntimeRendered EventHub event
        // Act
        fnHandler();
        // Assert
        assert.deepEqual(this.oEventHubOnceStub.getCall(0).args, ["PagesRuntimeRendered"], "StateManager listened to the correct event");
        const oFirstPage = this.pagesNavContainer.getPages()[0];
        assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oFirstPage, true, false).callCount, 1, "First page was set to visible");
    });

    QUnit.test("Initializes the saved visualizations to empty", function (assert) {
        // Act
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        // Assert
        assert.deepEqual(StateManager.aRefreshVisualizations, [], "was initialized as empty");
    });

    QUnit.test("Sets the correct page visibility of the current page when the intent is Shell-home, but pages are not visible", function (assert) {
        // Arrange
        this.pagesRuntimeNavContainer.to("emptyPage");
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Shell-home");

        // Act
        return StateManager._onShellNavigated().then(function () {
            // Assert
            const oCurrentPage = this.pagesNavContainer.getCurrentPage();
            assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oCurrentPage, false, false).callCount, 1, "Current page was set to invisible");
        }.bind(this));
    });

    QUnit.test("Sets the correct page visibility of the current page when the intent is Shell-home", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Shell-home");

        // Act
        return StateManager._onShellNavigated().then(function () {
            // Assert
            const oCurrentPage = this.pagesNavContainer.getCurrentPage();
            assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oCurrentPage, true, false).callCount, 1, "Current page was set to visible");
        }.bind(this));
    });

    QUnit.test("Sets the correct page visibility of the current page when the intent is Launchpad-openFLPPage", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Launchpad-openFLPPage");

        // Act
        return StateManager._onShellNavigated().then(function () {
            // Assert
            const oCurrentPage = this.pagesNavContainer.getCurrentPage();
            assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oCurrentPage, true, false).callCount, 1, "Current page was set to visible");
        }.bind(this));
    });

    QUnit.test("Sets the correct page visibility of the current page when the intent is not Launchpad-openFLPPage or Shell-home", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Shell-appFinder");

        // Act
        return StateManager._onShellNavigated().then(function () {
            // Assert
            const oCurrentPage = this.pagesNavContainer.getCurrentPage();
            assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oCurrentPage, false, false).callCount, 1, "Current page was set to invisible");
        }.bind(this));
    });

    QUnit.test("addVisualizationForRefresh Integration: Refreshes saved Visualizations", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Shell-home");

        var oVisualizationMock1 = {
            setActive: sandbox.stub(),
            getActive: sandbox.stub().returns(true)
        };
        var oVisualizationMock2 = {
            setActive: sandbox.stub(),
            getActive: sandbox.stub().returns(true)
        };
        StateManager.addVisualizationForRefresh(oVisualizationMock1);
        StateManager.addVisualizationForRefresh(oVisualizationMock2);
        // Act
        return StateManager._onShellNavigated().then(function () {
            // Assert
            assert.deepEqual(oVisualizationMock1.setActive.getCall(0).args, [true, true], "Visualization1.setActive was called with correct params");
            assert.deepEqual(oVisualizationMock2.setActive.getCall(0).args, [true, true], "Visualization2.setActive was called with correct params");
        });
    });

    QUnit.test("Does not set the visibility of a page to when the tab is switched and the intent is Shell-home, but pages is not visible", function (assert) {
        // Arrange
        this.pagesRuntimeNavContainer.to("emptyPage");
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Shell-home");

        // Act
        return StateManager._onTabNavigated().then(function () {
            // Assert
            assert.strictEqual(this.oSetPageVisibilityStub.callCount, 0, "No visibility was changed");
        }.bind(this));
    });

    QUnit.test("Sets the visibility of the current page to when the tab is switched and the intent is Shell-home", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Shell-home");

        // Act
        return StateManager._onTabNavigated().then(function () {
            // Assert
            const oCurrentPage = this.pagesNavContainer.getCurrentPage();
            assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oCurrentPage, true, false).callCount, 1, "Current page was set to visible");
        }.bind(this));
    });

    QUnit.test("Sets the visibility of the current page to when the tab is switched and the intent is Launchpad-openFLPPage", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Launchpad-openFLPPage");

        // Act
        return StateManager._onTabNavigated().then(function () {
            // Assert
            const oCurrentPage = this.pagesNavContainer.getCurrentPage();
            assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oCurrentPage, true, false).callCount, 1, "Current page was set to visible");
        }.bind(this));
    });

    QUnit.test("Does not set the visibility of the current page to when the tab is switched and the intent is not Launchpad-openFLPPage or Shell-home", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        window.hasher.getHash.returns("Shell-appFinder");

        // Act
        return StateManager._onTabNavigated().then(function () {
            // Assert
            assert.strictEqual(this.oSetPageVisibilityStub.callCount, 0, "No visibility was changed");
        }.bind(this));
    });

    QUnit.test("Sets the visibility of the current page to true and the previous page to false", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);

        // Act
        this.pagesNavContainer.to("page2");

        // Assert
        const oFirstPage = this.pagesNavContainer.getPages()[0];
        const oSecondPage = this.pagesNavContainer.getPages()[1];
        assert.deepEqual(this.oSetPageVisibilityStub.getCall(0).args, [oFirstPage, false, false], "The function _setPageVisibility is called with correct parameters.");
        assert.deepEqual(this.oSetPageVisibilityStub.getCall(1).args, [oSecondPage, true, false], "The function _setPageVisibility is called with correct parameters.");
    });

    QUnit.test("Sets the current page to invisible when not navigating to the sap.m.NavContainer that holds the current page", function (assert) {
        // Arrange
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);

        // Act
        this.pagesRuntimeNavContainer.to("emptyPage");

        // Assert
        const oCurrentPage = this.pagesNavContainer.getCurrentPage();
        assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oCurrentPage, false, false).callCount, 1, "Current page was set to invisible");
    });

    QUnit.test("Sets the current page to visible when navigating to the sap.m.NavContainer that holds the current page", function (assert) {
        // Arrange
        this.pagesRuntimeNavContainer.to("emptyPage");
        StateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);

        // Act
        this.pagesRuntimeNavContainer.to("pages");

        // Assert
        const oCurrentPage = this.pagesNavContainer.getCurrentPage();
        assert.strictEqual(this.oSetPageVisibilityStub.withArgs(oCurrentPage, true, false).callCount, 1, "Current page was set to visible");
    });

    QUnit.module("The function _onEnableRequests", {
        beforeEach: function () {
            this.oSetCurrentPageVisibilityStub = sandbox.stub(StateManager, "_setCurrentPageVisibility");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _setCurrentPageVisibility with correct parameters when the event data is { active : true }", function (assert) {
        // Act
        StateManager._onEnableRequests("channel", "event", { active: true });

        // Assert
        assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
        assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [true], "The function _setCurrentPageVisibility is called with [true].");
    });

    QUnit.test("Calls _setCurrentPageVisibility with correct parameters when the event data is { active : false }", function (assert) {
        // Act
        StateManager._onEnableRequests("channel", "event", { active: false });

        // Assert
        assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
        assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [false], "The function _setCurrentPageVisibility is called with [false].");
    });

    QUnit.test("Does not call _setCurrentPageVisibility when the event data is invalid", function (assert) {
        // Act
        StateManager._onEnableRequests("channel", "event", {});

        // Assert
        assert.strictEqual(this.oSetCurrentPageVisibilityStub.callCount, 0, "The function _setCurrentPageVisibility is not called.");
    });

    QUnit.module("The function exit", {
        beforeEach: function () {
            this.oEventBusUnsubscribeStub = sandbox.stub();
            StateManager.oEventBus = {
                unsubscribe: this.oEventBusUnsubscribeStub
            };
            this.oRemoveEventListenerStub = sandbox.stub(document, "removeEventListener");
            this.oDetachNavigateStub = sandbox.stub();
            StateManager.oPagesNavContainer = {
                detachNavigate: this.oDetachNavigateStub
            };
            StateManager.oPagesRuntimeNavContainer = {
                detachNavigate: this.oDetachNavigateStub
            };
            this.oEventHubOffStub = sandbox.stub();
            StateManager.oEventHubListener = {
                off: this.oEventHubOffStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Unsubscribes the events sap.ushell.navigated and launchpad/setConnectionToServer", function (assert) {
        // Act
        StateManager.exit();

        // Assert
        assert.strictEqual(this.oEventBusUnsubscribeStub.callCount, 2, "The function 'unsubscribe' was called twice.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[0], "sap.ushell", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[1], "navigated", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(1).args[0], "launchpad", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(1).args[1], "setConnectionToServer", "The function 'unsubscribe' was called with correct parameters.");
    });

    QUnit.test("Removes visibilitychange listener", function (assert) {
        // Act
        StateManager.exit();

        // Assert
        assert.strictEqual(this.oDetachNavigateStub.callCount, 2, "The function 'detachNavigate' was called twice.");
    });

    QUnit.test("Detaches navContainer navigate handler", function (assert) {
        // Act
        StateManager.exit();

        // Assert
        assert.strictEqual(this.oRemoveEventListenerStub.callCount, 1, "The function 'removeEventListener' was called.");
        assert.deepEqual(
            this.oRemoveEventListenerStub.getCall(0).args,
            ["visibilitychange", StateManager._onTabNavigatedBind],
            "The function 'removeEventListener' was called with correct parameters."
        );
    });

    QUnit.test("Removed EventHub listener", function (assert) {
        // Act
        StateManager.exit();

        // Assert
        assert.strictEqual(this.oEventHubOffStub.callCount, 1, "The function 'off' was called.");
        assert.deepEqual(this.oEventHubOffStub.getCall(0).args, [], "The function 'off' was called with correct parameters.");
    });

    QUnit.module("The function _setPageVisibility", {
        beforeEach: function () {
            StateManager.oPagesVisibility = {};
            this.oSetActiveStub = sandbox.stub();
            this.oGetVisualizationsStub = sandbox.stub().returns([{
                setActive: this.oSetActiveStub
            }]);
            this.oGetPathStub = sandbox.stub();
            this.oGetPathStub.returns("/pages/0");
            this.oIsAStub = sandbox.stub(Object, "isObjectA").returns(true);
            this.oPage = {
                getContent: function () {
                    return [{
                        isA: this.oIsAStub,
                        getSections: function () {
                            return [{
                                getVisualizations: this.oGetVisualizationsStub
                            }];
                        }.bind(this)
                    }];
                }.bind(this),
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oGetPathStub
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Does not set the visibility & refresh of an empty page", function (assert) {
        // Act
        StateManager._setPageVisibility();

        // Assert
        assert.strictEqual(this.oSetActiveStub.callCount, 0, "The function setActive is not called.");
    });

    QUnit.test("Does not set the visibility & refresh if the page is not a 'sap.ushell.ui.launchpad.Page' page", function (assert) {
        // Arrange
        this.oIsAStub.returns(false);
        // Act
        StateManager._setPageVisibility(this.oPage);

        // Assert
        assert.strictEqual(this.oSetActiveStub.callCount, 0, "The function setActive is not called.");
    });

    QUnit.test("Sets the visibility & refresh of the current page", function (assert) {
        // Arrange
        var bVisible = true;
        var bRefresh = false;

        // Act
        StateManager._setPageVisibility(this.oPage, bVisible, bRefresh);

        // Assert
        assert.strictEqual(this.oSetActiveStub.callCount, 1, "The function setActive is called once.");
        assert.deepEqual(this.oSetActiveStub.getCall(0).args, [bVisible, bRefresh], "The function setActive is called with correct parameters.");
    });

    QUnit.test("Only sets the visibility & refresh of the current page once", function (assert) {
        // Arrange
        var bVisible = true;
        var bRefresh = false;

        // Act
        StateManager._setPageVisibility(this.oPage, bVisible, bRefresh);
        StateManager._setPageVisibility(this.oPage, bVisible, bRefresh);

        // Assert
        assert.strictEqual(this.oSetActiveStub.callCount, 1, "The function setActive is called once.");
        assert.deepEqual(this.oSetActiveStub.getCall(0).args, [bVisible, bRefresh], "The function setActive is called with correct parameters.");
    });

    QUnit.test("Calls setActive only if the control has access to the function", function (assert) {
        // Arrange
        var bVisible = true;
        var bRefresh = false;
        this.oGetVisualizationsStub.returns([]);

        // Act
        StateManager._setPageVisibility(this.oPage, bVisible, bRefresh);

        // Assert
        assert.strictEqual(this.oSetActiveStub.callCount, 0, "The function setActive is never called.");
    });

    QUnit.test("Saves the page visibility", function (assert) {
        // Arrange
        var bVisible = true;
        var bRefresh = false;
        var oExpectedResult = {
            "/pages/0": true
        };

        // Act
        StateManager._setPageVisibility(this.oPage, bVisible, bRefresh);
        // Assert
        assert.deepEqual(StateManager.oPagesVisibility, oExpectedResult, "Saved the correct pages");
    });

    QUnit.module("The function getPageVisibility", {
        beforeEach: function () {
            StateManager.oPagesVisibility = {};
        },
        afterEach: function () { }
    });

    QUnit.test("Returns the page visibility", function (assert) {
        // Arrange
        StateManager.oPagesVisibility = {
            "/pages/1": true
        };
        // Act
        var bResult = StateManager.getPageVisibility("/pages/1");
        // Assert
        assert.strictEqual(bResult, true, "returned the correct result");
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for UserActionsMenu.controller
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/test/utils",
    "sap/ushell/components/shell/UserActionsMenu/UserActionsMenu.controller",
    "sap/m/MessageBox",
    "sap/m/Popover",
    "sap/ushell/Container",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ui/model/json/JSONModel"
], function (
    Element,
    Config,
    EventHub,
    testUtils,
    UserActionsMenuController,
    MessageBox,
    Popover,
    Container,
    ShellModel,
    StateManager,
    JSONModel
) {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("MeArea.controller functionality", {
        beforeEach: function () {
            this.oShellModel = new JSONModel({
                userActions: {
                    items: []
                }
            });
            sandbox.stub(ShellModel, "getModel").returns(this.oShellModel);

            sandbox.stub(Container, "getUser").returns({
                getFullName: sandbox.stub(),
                getId: sandbox.stub(),
                getEmail: sandbox.stub()
            });

            this.oRendererMock = {
                getShellConfig: sandbox.stub().returns({}),
                showActionButton: sandbox.stub(),
                hideActionButton: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
            sandbox.stub(Container, "getServiceAsync");


            return testUtils.resetConfigChannel().then(() => {
                this.oController = new UserActionsMenuController();
            });
        },
        afterEach: function () {
            this.oController.onExit();
            sandbox.restore();
            Container.reset();
            EventHub._reset();
            Config._resetContract();
        }
    });

    QUnit.test("Create RecentActivitiesButton and FrequentActivitiesButton when enableRecentActivity is true", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ enableRecentActivity: true });
        Config.emit("/core/shell/model/showRecentActivity", true);

        const createRecentActivityStub = sandbox.stub(this.oController, "_createRecentActivitiesButton");
        const createFrequentUsedStub = sandbox.stub(this.oController, "_createFrequentActivitiesButton");

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(createRecentActivityStub.calledOnce, "_createRecentActivitiesButton should be called");
        assert.ok(createFrequentUsedStub.calledOnce, "_createRecentActivitiesButton should be called");
    });

    QUnit.test("Create RecentActivitiesButton and FrequentActivitiesButton when enableRecentActivity is false", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ enableRecentActivity: false });
        Config.emit("/core/shell/model/showRecentActivity", true);

        const createRecentActivityStub = sandbox.stub(this.oController, "_createRecentActivitiesButton");
        const createFrequentUsedStub = sandbox.stub(this.oController, "_createFrequentActivitiesButton");

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(createRecentActivityStub.notCalled, "_createRecentActivitiesButton should not be called");
        assert.ok(createFrequentUsedStub.notCalled, "_createRecentActivitiesButton should not be called");
    });

    QUnit.test("Create RecentActivitiesButton and FrequentActivitiesButton when showRecentActivity is false", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ enableRecentActivity: true });
        Config.emit("/core/shell/model/showRecentActivity", false);

        const createRecentActivityStub = sandbox.stub(this.oController, "_createRecentActivitiesButton");
        const createFrequentUsedStub = sandbox.stub(this.oController, "_createFrequentActivitiesButton");

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(createRecentActivityStub.notCalled, "_createRecentActivitiesButton should not be called");
        assert.ok(createFrequentUsedStub.notCalled, "_createRecentActivitiesButton should not be called");
    });

    QUnit.test("Create logout button is not called when disableSignOut is true", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ disableSignOut: true });

        const createLogoutButtonStub = sandbox.stub(this.oController, "_createLogoutButton");

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(createLogoutButtonStub.notCalled, "_createLogoutButton should not be called");
    });

    QUnit.test("_createRecentActivitiesButton create button and add to the actions when tracking is enabled", function (assert) {
        // Arrange
        sandbox.stub(Config, "on").returns({
            do: sandbox.stub().callsArgWith(0, true)
        });

        // Act
        this.oController._createRecentActivitiesButton();

        // Assert
        assert.ok(Element.getElementById("recentActivitiesBtn"), "recentActivitiesBtn was created");
        assert.ok(this.oRendererMock.showActionButton.calledOnce, "the button should be added to actions in model");
        assert.ok(this.oRendererMock.hideActionButton.notCalled, "the button should be added to actions in model");
        assert.equal(Container.getRendererInternal().showActionButton.getCall(0).args[0], "recentActivitiesBtn", "the id is correct");
    });

    QUnit.test("_createRecentActivitiesButton don't create the button when tracking is disabled", function (assert) {
        // Arrange
        sandbox.stub(Config, "on").returns({
            do: sandbox.stub().callsArgWith(0, false)
        });

        // Act
        this.oController._createRecentActivitiesButton();

        // Assert
        assert.ok(!Element.getElementById("recentActivitiesBtn"), "recentActivitiesBtn should not be created");
        assert.ok(this.oRendererMock.showActionButton.notCalled, "the button should not be added to actions in model");
        assert.ok(this.oRendererMock.hideActionButton.calledOnce, "the button should be removed from model");
    });

    QUnit.test("_createFrequentActivitiesButton create button and add to the actions when tracking is enabled", function (assert) {
        // Arrange
        sandbox.stub(Config, "on").returns({
            do: sandbox.stub().callsArgWith(0, true)
        });

        // Act
        this.oController._createFrequentActivitiesButton();

        // Assert
        assert.ok(Element.getElementById("frequentActivitiesBtn"), "frequentActivitiesBtn was created");
        assert.ok(this.oRendererMock.showActionButton.calledOnce, "the button should be added to actions in model");
        assert.ok(this.oRendererMock.hideActionButton.notCalled, "the button should be added to actions in model");
        assert.equal(Container.getRendererInternal().showActionButton.getCall(0).args[0], "frequentActivitiesBtn", "the id is correct");
    });

    QUnit.test("_createFrequentActivitiesButton don't create the button when tracking is disabled", function (assert) {
        // Arrange
        sandbox.stub(Config, "on").returns({
            do: sandbox.stub().callsArgWith(0, false)
        });

        // Act
        this.oController._createFrequentActivitiesButton();

        // Assert
        assert.ok(!Element.getElementById("frequentActivitiesBtn"), "frequentActivitiesBtn should not be created");
        assert.ok(this.oRendererMock.showActionButton.notCalled, "the button should not be added to actions in model");
        assert.ok(this.oRendererMock.hideActionButton.calledOnce, "the button should be removed from model");
    });

    QUnit.test("_createSupportTicketButton create button and add to the actions when SupportTicket is enable", function (assert) {
        // Arrange
        const sButtonId = "ContactSupportBtn";
        sandbox.stub(Config, "on").returns({
            do: sandbox.stub().callsArgWith(0, true)
        });

        // Act
        this.oController._createSupportTicketButton(true);

        // Assert
        assert.ok(Element.getElementById(sButtonId), `${sButtonId } was created`);
        assert.ok(this.oRendererMock.showActionButton.calledOnce, "the button should be added to actions in model");
        assert.ok(this.oRendererMock.hideActionButton.notCalled, "the button should be added to actions in model");
        assert.equal(Container.getRendererInternal().showActionButton.getCall(0).args[0], sButtonId, "the id is correct");
    });

    QUnit.test("_createSupportTicketButton don't create the button when SupportTicket is disabled", function (assert) {
        // Arrange
        const sButtonId = "ContactSupportBtn";
        sandbox.stub(Config, "on").returns({
            do: sandbox.stub().callsArgWith(0, false)
        });

        // Act
        this.oController._createSupportTicketButton(true);

        // Assert
        assert.ok(!Element.getElementById(sButtonId), `${sButtonId } should not be created`);
        assert.ok(this.oRendererMock.showActionButton.notCalled, "the button should not be added to actions in model");
        assert.ok(this.oRendererMock.hideActionButton.calledOnce, "the button should be removed from model");
    });

    QUnit.test("About button is created when config is enabled", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ enableAbout: true });
        Config.emit("/core/shell/enableAbout", true);
        const oCreateAboutButtonStub = sandbox.stub(this.oController, "_createAboutButton");

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(oCreateAboutButtonStub.calledOnce, "_createAboutButton should be called");
    });

    QUnit.test("About button is not created when config is disabled", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ enableAbout: false });
        Config.emit("/core/shell/enableAbout", false);
        const oCreateAboutButtonStub = sandbox.stub(this.oController, "_createAboutButton");

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(oCreateAboutButtonStub.notCalled, "_createAboutButton should not be called");
    });

    QUnit.test("MessageBox should be open when click on logout button", function (assert) {
        // Arrange
        const fnDone = assert.async();
        const sButtonId = "logoutBtn";

        sandbox.stub(Container, "getGlobalDirty").returns({
            done: function (callback) {
                callback(false);
            }
        });
        const oMessageBoxStub = sandbox.stub(MessageBox, "show");

        // Act
        this.oController.onInit();
        Element.getElementById(sButtonId).firePress();

        // Assert
        setTimeout(function () {
            assert.ok(oMessageBoxStub.calledOnce, "MessageBox should be shown");
            fnDone();
        }, 100);
    });

    QUnit.module("The function _createAppFinderButton", {
        beforeEach: function () {
            sandbox.stub(Container, "getUser").returns({
                getFullName: sandbox.stub(),
                getId: sandbox.stub(),
                getEmail: sandbox.stub()
            });

            this.oRendererMock = {
                getShellConfig: sandbox.stub().returns({}),
                showActionButton: sandbox.stub(),
                hideActionButton: sandbox.stub()
            };

            sandbox.stub(StateManager, "updateAllBaseStates");

            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);

            this.oController = new UserActionsMenuController();

            sandbox.stub(Config, "last");

            this.createAppFinderButtonStub = sandbox.spy(this.oController, "_createAppFinderButton");
        },
        afterEach: function () {
            this.oController.onExit();
            sandbox.restore();
            Container.reset();
            EventHub._reset();
        }
    });

    QUnit.test("When AppFinder is enabled and the flag moveAppFinderActionToShellHeader is true, there should be no AppFinder button in the UserActionsMenu.", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ moveAppFinderActionToShellHeader: true });
        Config.last.withArgs("/core/catalog/enabled").returns(true);
        // Act
        this.oController.onInit();
        // Assert
        assert.strictEqual(this.createAppFinderButtonStub.callCount, 0, "AppFinder button was not created");
        assert.strictEqual(StateManager.updateAllBaseStates.withArgs(
            "userActions.items",
            Operation.Add,
            "openCatalogBtn"
        ).callCount, 0, "The state was not updated");
    });

    QUnit.test("When AppFinder is enabled and the flag moveAppFinderActionToShellHeader is false, there should be AppFinder button in the UserActionsMenu.", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ moveAppFinderActionToShellHeader: false });
        Config.last.withArgs("/core/catalog/enabled").returns(true);
        // Act
        this.oController.onInit();
        // Assert
        assert.strictEqual(this.createAppFinderButtonStub.callCount, 1, "AppFinder button was not created");
        assert.strictEqual(StateManager.updateAllBaseStates.withArgs(
            "userActions.items",
            Operation.Add,
            "openCatalogBtn"
        ).callCount, 1, "The state was updated");
    });

    QUnit.test("When AppFinder is disabled, there should be no AppFinder button in the UserActionsMenu.", function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ moveAppFinderActionToShellHeader: false });
        Config.last.withArgs("/core/catalog/enabled").returns(false);
        // Act
        this.oController.onInit();
        // Assert
        assert.strictEqual(this.createAppFinderButtonStub.callCount, 0, "AppFinder button was not created");
    });

    QUnit.module("filterUserActions", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById");
            this.oController = new UserActionsMenuController();
        },
        afterEach: async function () {
            this.oController.onExit();
            sandbox.restore();
            Container.reset();
            EventHub._reset();
        }
    });

    QUnit.test("Filters non existing actions", function (assert) {
        // Arrange
        Element.getElementById.withArgs("fake1").returns(null);
        // Act
        const bResult = this.oController.filterUserActions("fake1");

        // Assert
        assert.strictEqual(bResult, false, "The action was filtered");
    });

    QUnit.test("Keeps existing actions", function (assert) {
        // Arrange
        Element.getElementById.withArgs("backBtn").returns({ id: "backBtn" });
        // Act
        const bResult = this.oController.filterUserActions("backBtn");

        // Assert
        assert.strictEqual(bResult, true, "The action was not filtered");
    });

    QUnit.module("Settings Button", {
        beforeEach: async function () {
            sandbox.stub(Container, "getUser").returns({
                getFullName: sandbox.stub(),
                getId: sandbox.stub(),
                getEmail: sandbox.stub()
            });

            this.oRendererMock = {
                getShellConfig: sandbox.stub().returns({}),
                showActionButton: sandbox.stub(),
                hideActionButton: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
            this.oController = new UserActionsMenuController();

            sandbox.stub(StateManager, "updateAllBaseStates");
        },
        afterEach: async function () {
            this.oController.onExit();
            sandbox.restore();
            Container.reset();
            EventHub._reset();
        }
    });

    QUnit.test("Creates and adds the UserAction if move is not configured", async function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ moveUserSettingsActionToShellHeader: false });
        // Act
        this.oController.onInit();
        // Assert
        const oSettingsButton = Element.getElementById("userSettingsBtn");
        assert.ok(oSettingsButton, "The UserSettings button was created");
        assert.strictEqual(StateManager.updateAllBaseStates.withArgs(
            "userActions.items",
            Operation.Add,
            "userSettingsBtn"
        ).callCount, 1, "The state was updated");
    });

    QUnit.test("Does not create the UserAction if move is configured", async function (assert) {
        // Arrange
        this.oRendererMock.getShellConfig.returns({ moveUserSettingsActionToShellHeader: true });
        // Act
        this.oController.onInit();
        // Assert
        const oSettingsButton = Element.getElementById("userSettingsBtn");
        assert.notOk(oSettingsButton, "The UserSettings button was created");
        assert.strictEqual(StateManager.updateAllBaseStates.withArgs(
            "userActions.items",
            Operation.Add,
            "userSettingsBtn"
        ).callCount, 0, "The state was not updated");
    });

    QUnit.module("showUserActionsMenu", {
        beforeEach: async function () {
            sandbox.stub(Container, "getUser").returns({
                getFullName: sandbox.stub(),
                getId: sandbox.stub(),
                getEmail: sandbox.stub()
            });

            this.oRendererMock = {
                getShellConfig: sandbox.stub().returns({}),
                showActionButton: sandbox.stub(),
                hideActionButton: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);

            this.oController = new UserActionsMenuController();
        },
        afterEach: async function () {
            this.oController.onExit();
            sandbox.restore();
            Container.reset();
            EventHub._reset();
        }
    });

    QUnit.test("Shows the popover and refresh the actions", async function (assert) {
        // Arrange
        sandbox.stub(Popover.prototype, "openBy");
        sandbox.spy(StateManager, "refreshState");

        sandbox.spy(this.oController, "_toggleUserActionsMenuPopover");
        this.oController.onInit();

        // Act
        EventHub.emit("showUserActionsMenu", true);
        await testUtils.waitForEventHubEvent("showUserActionsMenu");
        await this.oController._toggleUserActionsMenuPopover.returnValues[0];

        // Assert
        assert.strictEqual(StateManager.refreshState.callCount, 1, "The state was refreshed");
        assert.strictEqual(Popover.prototype.openBy.callCount, 1, "The popover was opened");
    });

    QUnit.test("Closes the popover", async function (assert) {
        // Arrange
        sandbox.stub(Popover.prototype, "openBy");
        sandbox.stub(Popover.prototype, "close");

        sandbox.spy(this.oController, "_toggleUserActionsMenuPopover");
        this.oController.onInit();

        // show
        EventHub.emit("showUserActionsMenu", true);
        await testUtils.waitForEventHubEvent("showUserActionsMenu");
        await this.oController._toggleUserActionsMenuPopover.returnValues[0];

        // Act
        EventHub.emit("showUserActionsMenu");
        await testUtils.waitForEventHubEvent("showUserActionsMenu");
        await this.oController._toggleUserActionsMenuPopover.returnValues[0];

        // Assert
        assert.strictEqual(Popover.prototype.close.callCount, 1, "The popover was closed");
    });
});

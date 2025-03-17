// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.shell.ShellAppTitle
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/library",
    "sap/ui/Device",
    "sap/m/Button",
    "sap/ui/core/IconPool",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ui/core/mvc/View",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/ui/shell/ShellNavigationMenu",
    "sap/ui/core/mvc/XMLView",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/ShellModel"
], function (
    Element,
    ushellLib,
    Device,
    Button,
    IconPool,
    Container,
    EventHub,
    Config,
    View,
    JSONModel,
    ShellAppTitle,
    ShellNavigationMenu,
    XMLView,
    StateManager,
    ShellModel
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.AppTitleState
    const AppTitleState = ushellLib.AppTitleState;

    // shortcut for sap.ushell.AllMyAppsState
    const AllMyAppsState = ushellLib.AllMyAppsState;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    const sandbox = sinon.createSandbox();

    QUnit.module("The init function", {
        beforeEach: function () {
            sandbox.stub(StateManager, "getShellMode");
            StateManager.getShellMode.returns(ShellMode.Default);

            sandbox.stub(StateManager, "getLaunchpadState");
            StateManager.getLaunchpadState.returns(LaunchpadState.Home);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the super class's init function", function (assert) {
        // Arrange
        var oButtonInitStub = sandbox.stub(Button.prototype, "init");

        // Act
        var oShellAppTitle = new ShellAppTitle();

        // Assert
        assert.strictEqual(oButtonInitStub.callCount, 1, "The function has been called once.");

        // Cleanup
        oButtonInitStub.restore();
        oShellAppTitle.destroy();
    });

    QUnit.test("Creates an icon instance", function (assert) {
        // Arrange
        var oAddStyleClassStub = sandbox.stub();
        var oIconMock = {
            addStyleClass: oAddStyleClassStub,
            destroy: function () { }
        };
        var oCreateIconStub = sandbox.stub(IconPool, "createControlByURI").returns(oIconMock);

        // Act
        var oShellAppTitle = new ShellAppTitle();

        // Assert
        assert.strictEqual(oCreateIconStub.callCount, 1, "The function createControlByURI has been called once.");
        assert.strictEqual(oCreateIconStub.firstCall.args[0], "sap-icon://slim-arrow-down", "The function has been called with the correct parameter.");
        assert.strictEqual(oAddStyleClassStub.callCount, 1, "The function addStyleClass has been called once.");
        assert.strictEqual(oAddStyleClassStub.firstCall.args[0], "sapUshellAppTitleMenuIcon", "The function has been called with the correct parameter.");
        assert.strictEqual(oShellAppTitle.oIcon, oIconMock, "The property has the correct value.");

        // Cleanup
        oShellAppTitle.destroy();
    });

    QUnit.module("The exit function", {
        beforeEach: function () {
            sandbox.stub(StateManager, "getShellMode");
            StateManager.getShellMode.returns(ShellMode.Default);

            sandbox.stub(StateManager, "getLaunchpadState");
            StateManager.getLaunchpadState.returns(LaunchpadState.Home);

            this.oShellAppTitle = new ShellAppTitle();

            this.oByIdStub = sandbox.stub(Element, "getElementById");
        },
        afterEach: function () {
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("Does not call destroy if no associated navigation menu exists", function (assert) {
        // Arrange
        var oDestroyStub = sandbox.stub(ShellNavigationMenu.prototype, "destroy");

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "The byId function has been called twice.");
        assert.strictEqual(oDestroyStub.callCount, 0, "The destroy function has not been called.");
    });

    QUnit.test("Destroys the associated navigation menu", function (assert) {
        // Arrange
        sandbox.stub(this.oShellAppTitle, "getNavigationMenu").returns("NavMenuId");

        var oDestroyStub = sandbox.stub();
        var oNavMenuMock = {
            destroy: oDestroyStub
        };
        this.oByIdStub.withArgs("NavMenuId").returns(oNavMenuMock);

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "The byId function has been called twice.");
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.test("Does not call destroy if no associated AllMyApps view exists", function (assert) {
        // Arrange
        var oDestroyStub = sandbox.stub(View.prototype, "destroy");

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "The byId function has been called twice.");
        assert.strictEqual(oDestroyStub.callCount, 0, "The destroy function has not been called.");
    });

    QUnit.test("Destroys the associated AllMyApps view", function (assert) {
        // Arrange
        sandbox.stub(this.oShellAppTitle, "getAllMyApps").returns("AllMyAppsViewId");

        var oDestroyStub = sandbox.stub();
        var oViewMock = {
            destroy: oDestroyStub
        };
        this.oByIdStub.withArgs("AllMyAppsViewId").returns(oViewMock);

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "The byId function has been called twice.");
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.test("Destroys the oAllMyAppsPopover", function (assert) {
        // Arrange
        var oDestroyStub = sandbox.stub();
        this.oShellAppTitle.oAllMyAppsPopover = {
            destroy: oDestroyStub
        };

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.test("Destroys the oNavMenuPopover", function (assert) {
        // Arrange
        var oDestroyStub = sandbox.stub();
        this.oShellAppTitle.oNavMenuPopover = {
            destroy: oDestroyStub
        };

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.test("Destroys the oIcon", function (assert) {
        // Arrange
        var oDestroyStub = sandbox.stub();
        this.oShellAppTitle.oIcon = {
            destroy: oDestroyStub
        };

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.module("The getControlVisibilityAndState function", {
        beforeEach: function () {
            sandbox.stub(StateManager, "getShellMode");
            StateManager.getShellMode.returns(ShellMode.Default);

            sandbox.stub(StateManager, "getLaunchpadState");
            StateManager.getLaunchpadState.returns(LaunchpadState.Home);

            sandbox.stub(StateManager, "isLegacyHome");
            StateManager.isLegacyHome.returns(false);

            this.oShellAppTitle = new ShellAppTitle({ text: "text" });
            this.oIsNavMenuEnableStub = sandbox.stub(this.oShellAppTitle, "_isNavMenuEnabled").returns(true);

            this.oLastStub = sandbox.stub(Config, "last");
            this.oLastStub.withArgs("/core/services/allMyApps/enabled").returns(true);
            this.oLastStub.callThrough();

            return Container.init("local");
        },
        afterEach: function () {
            sandbox.restore();
            EventHub._reset();
            Container.resetServices();
        }
    });

    QUnit.test("Returns true if Shell state is home, _isNavMenuEnabled = true, and AllMyAppsEnabled = true", function (assert) {
        // Arrange
        const oConfigModel = ShellModel.getConfigModel();
        // Act
        var bTitleVisible = this.oShellAppTitle._getControlVisibilityAndState();

        // Assert
        assert.strictEqual(bTitleVisible, true, "bTitleVisible is true when: 1.Shell state is home, 2._isNavMenuEnabled = true, 3.AllMyAppsEnabled = true");
        const sShellAppTitleState = oConfigModel.getProperty("/shellAppTitleState");
        assert.strictEqual(sShellAppTitleState, AppTitleState.ShellNavMenu, "Model property ShellAppTitleState was set to SHELL_NAV_MENU");
    });

    QUnit.test("Returns true if Shell state is minimal and _isNavMenuEnabled = true", function (assert) {
        // Arrange
        const oConfigModel = ShellModel.getConfigModel();
        StateManager.getShellMode.returns(ShellMode.Minimal);

        // Act
        var bTitleVisible = this.oShellAppTitle._getControlVisibilityAndState();

        // Assert
        assert.strictEqual(bTitleVisible, true, "bTitleVisible is true when: 1.Shell state is minimal, 2._isNavMenuEnabled = true");
        const sShellAppTitleState = oConfigModel.getProperty("/shellAppTitleState");
        assert.strictEqual(sShellAppTitleState, AppTitleState.ShellNavMenuOnly, "Model property ShellAppTitleState was set to SHELL_NAV_MENU_ONLY");
    });

    QUnit.test("Returns true if Shell state is app, _isNavMenuEnabled = false, and AllMyAppsEnabled = true", function (assert) {
        // Arrange
        const oConfigModel = ShellModel.getConfigModel();
        this.oIsNavMenuEnableStub.returns(false);
        StateManager.getLaunchpadState.returns(LaunchpadState.App);

        // Act
        var bTitleVisible = this.oShellAppTitle._getControlVisibilityAndState();

        // Assert
        assert.strictEqual(bTitleVisible, true, "bTitleVisible is true when: 1.Shell state is app, 2._isNavMenuEnabled = false, 3.AllMyAppsEnabled = true");
        const sShellAppTitleState = oConfigModel.getProperty("/shellAppTitleState");
        assert.strictEqual(sShellAppTitleState, AppTitleState.AllMyAppsOnly, "Model property ShellAppTitleState was set to ALL_MY_APPS_ONLY");
    });

    QUnit.test("Returns false if Shell state is neither app nor home, _isNavMenuEnabled = false, and AllMyAppsEnabled = true", function (assert) {
        // Arrange
        const oConfigModel = ShellModel.getConfigModel();
        this.oIsNavMenuEnableStub.returns(false);
        StateManager.getShellMode.returns(ShellMode.Minimal);

        // Act
        var bTitleVisible = this.oShellAppTitle._getControlVisibilityAndState();

        // Assert
        assert.strictEqual(bTitleVisible, false, "bTitleVisible is false when: 1.Shell state is  not app|home, 2._isNavMenuEnabled = false, 3.AllMyAppsEnabled = true");
        const sShellAppTitleState = oConfigModel.getProperty("/shellAppTitleState");
        assert.strictEqual(sShellAppTitleState, AppTitleState.ShellNavMenuOnly, "Model property ShellAppTitleState was set to SHELL_NAV_MENU_ONLY");
    });

    QUnit.module("Integration test - The function _popoverBackButtonPressHandler", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");

            this.oShellAppTitle = new ShellAppTitle({ text: "text" });

            this.oOrigDeviceSystemPhone = Device.system.phone;

            this.oAllMyAppsPopoverCloseStub = sandbox.stub();
            this.oShellAppTitle.oAllMyAppsPopover = {
                close: this.oAllMyAppsPopoverCloseStub,
                destroy: function () { }
            };

            this.oNavMenuPopoverOpenByStub = sandbox.stub();
            this.oShellAppTitle.oNavMenuPopover = {
                openBy: this.oNavMenuPopoverOpenByStub,
                destroy: function () { }
            };

            this.oGetCurrentStateStub = sandbox.stub().returns(AllMyAppsState.FirstLevel);
            this.oSwitchToInitialStateStub = sandbox.stub();
            this.oHandleSwitchToMasterAreaOnPhoneStub = sandbox.stub();
            this.oUpdateHeaderButtonsStateStub = sandbox.stub();
            sandbox.stub(this.oShellAppTitle, "getAllMyAppsController").returns({
                getCurrentState: this.oGetCurrentStateStub,
                switchToInitialState: this.oSwitchToInitialStateStub,
                handleSwitchToMasterAreaOnPhone: this.oHandleSwitchToMasterAreaOnPhoneStub,
                updateHeaderButtonsState: this.oUpdateHeaderButtonsStateStub
            });
        },
        afterEach: function () {
            this.oShellAppTitle.destroy();
            Device.system.phone = this.oOrigDeviceSystemPhone;
            EventHub._reset();
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Sets the correct AppTitleState and closes all popups if current state is AllMyApps on FirstLevel", function (assert) {
        // Arrange
        const oConfigModel = ShellModel.getConfigModel();
        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        }).then(function (view) {
            this.oShellAppTitle.setAllMyApps(view);
            // Act
            this.oShellAppTitle._popoverBackButtonPressHandler();
            this.oShellAppTitle._afterCloseAllMyAppsPopover();

            // Assert
            const sShellAppTitleState = oConfigModel.getProperty("/shellAppTitleState");
            assert.strictEqual(sShellAppTitleState, AppTitleState.ShellNavMenu, "Back from AllMyApps: Model setProperty called for setting ShellAppTitleStat to SHELL_NAV_MENU");
            assert.strictEqual(this.oAllMyAppsPopoverCloseStub.callCount, 1, "Back from AllMyApps: AllMyApps Popover Close called");
            assert.strictEqual(this.oNavMenuPopoverOpenByStub.callCount, 1, "Back from AllMyApps: NavMenu Popover Open called");
        }.bind(this));
    });

    QUnit.test("Calls switchToInitialState if the current state is SecondLevel", function (assert) {
        // Arrange
        this.oGetCurrentStateStub.returns(AllMyAppsState.SecondLevel);
        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        }).then(function (view) {
            this.oShellAppTitle.setAllMyApps(view);
            // Act
            this.oShellAppTitle._popoverBackButtonPressHandler();
            // Assert
            assert.strictEqual(this.oSwitchToInitialStateStub.callCount, 1, "Back from SecondLevel: SwitchToInitialState called");
        }.bind(this));
    });

    QUnit.test("Calls handleSwitchToMasterAreaOnPhone on a phone device from Details state", function (assert) {
        // Arrange
        this.oGetCurrentStateStub.returns(AllMyAppsState.Details);
        Device.system.phone = true;

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
        }).then(function (view) {
            this.oShellAppTitle.setAllMyApps(view);
            // Act
            this.oShellAppTitle._popoverBackButtonPressHandler();
            // Assert
            assert.strictEqual(
                this.oHandleSwitchToMasterAreaOnPhoneStub.callCount,
                1,
                "Back from Details state on Phone: handleSwitchToMasterAreaOnPhone called"
            );
        }.bind(this));
    });

    QUnit.module("The function _allMyAppsButtonPressHandler", {
        beforeEach: function () {
            sandbox.stub(ShellAppTitle.prototype, "init");
            this.oShellAppTitle = new ShellAppTitle({
                text: "text",
                allMyApps: "all.my.apps.id"
            });

            this.oByIdStub = sandbox.stub(Element, "getElementById");
            this.oByIdStub.withArgs("all.my.apps.id").returns({});

            this.oShellAppTitle.setModel(new JSONModel({}));

            this.oShellAppTitle.oNavMenuPopover = {
                close: sandbox.stub()
            };
            this.oOpenCloseAllMyAppsPopoverStub = sandbox.stub(this.oShellAppTitle, "_openCloseAllMyAppsPopover");
        },
        afterEach: function () {
            sandbox.restore();
            delete this.oShellAppTitle.oNavMenuPopover;
            this.oShellAppTitle.destroy();
        }
    });

    QUnit.test("Closes the Navigation Menu Popover and opens the All My Apps popup", function (assert) {
        //Arrange

        //Act
        this.oShellAppTitle._allMyAppsButtonPressHandler();
        this.oShellAppTitle._afterCloseNavigationMenuPopover();

        //Assert
        assert.strictEqual(this.oShellAppTitle.oNavMenuPopover.close.callCount, 1, "The Navigation Menu popover was closed");
        assert.strictEqual(this.oOpenCloseAllMyAppsPopoverStub.callCount, 1, "The All My Apps popover was opened");

    });

    QUnit.test("Does nothing if the All My Apps popup is not ready", function (assert) {
        //Arrange
        this.oByIdStub.withArgs("all.my.apps.id").returns(undefined);

        //Act
        this.oShellAppTitle._allMyAppsButtonPressHandler();

        //Assert
        assert.strictEqual(this.oShellAppTitle.oNavMenuPopover.close.callCount, 0, "The Navigation Menu popover was not closed");
    });

    QUnit.test("Calls the Config model with the correct parameter", function (assert) {
        // Arrange
        var oValue = {};
        ShellModel.getConfigModel().setProperty("/shellAppTitleState", oValue);


        // Act
        var oResult = ShellAppTitle._getCurrentState();

        // Assert
        assert.strictEqual(oResult, oValue, "The correct value has been returned.");
    });

    QUnit.module("The onclick function", {
        beforeEach: function () {
            this.oCurrentStateStub = sandbox.stub(ShellAppTitle, "_getCurrentState");

            this.oShellAppTitle = new ShellAppTitle();

            this.oEvent = {
                preventDefault: sandbox.stub()
            };

            this.oFirePressStub = sandbox.stub(this.oShellAppTitle, "firePress");
            this.oGetControlVisibilityAndStateStub = sandbox.stub(this.oShellAppTitle, "_getControlVisibilityAndState").returns(true);
            this.oOpenCloseNavMenuPopoverStub = sandbox.stub(this.oShellAppTitle, "_openCloseNavMenuPopover");
            this.oOpenCloseAllMyAppsPopoverStub = sandbox.stub(this.oShellAppTitle, "_openCloseAllMyAppsPopover");
        },
        afterEach: function () {
            this.oShellAppTitle.destroy();
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("Prevents the default behavior of the given event", function (assert) {
        // Arrange
        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oEvent.preventDefault.callCount, 1, "The function has been called once.");
    });

    QUnit.test("Triggers the ShellAppTitle's press event", function (assert) {
        // Arrange
        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oFirePressStub.callCount, 1, "The function has been called once.");
    });

    QUnit.test("Updates the hash if on a phone while not clickable", function (assert) {
        // Arrange
        var oConfigStub = sandbox.stub(Config, "last").returns("SomeHash");
        var oSetHashStub = sandbox.stub(window.hasher, "setHash");
        var bOriginalPhone = Device.system.phone;
        Device.system.phone = true;

        this.oGetControlVisibilityAndStateStub.returns(false);

        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oGetControlVisibilityAndStateStub.callCount, 1, "The function _getControlVisibilityAndState has been called once.");
        assert.strictEqual(oSetHashStub.callCount, 1, "The function setHash has been called once.");
        assert.strictEqual(oSetHashStub.firstCall.args[0], "SomeHash", "The function setHash has been called with the correct parameter.");
        assert.strictEqual(oConfigStub.callCount, 1, "The function Config.last has been called once.");
        assert.strictEqual(oConfigStub.firstCall.args[0], "/core/shellHeader/rootIntent", "The function Config.last has been called with the correct parameter.");

        // Cleanup
        Device.system.phone = bOriginalPhone;
    });

    QUnit.test("Calls _openCloseAllMyAppsPopover if the control is clickable and the current state is ALL_MY_APPS_ONLY", function (assert) {
        // Arrange
        this.oCurrentStateStub.returns(AppTitleState.AllMyAppsOnly);

        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oOpenCloseAllMyAppsPopoverStub.callCount, 1, "The function _openCloseAllMyAppsPopover has been called once.");
    });

    QUnit.test("Calls _openCloseNavMenuPopover if the control is clickable and the current state is not ALL_MY_APPS_ONLY", function (assert) {
        // Arrange
        this.oCurrentStateStub.returns("SomeOtherState");

        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oOpenCloseNavMenuPopoverStub.callCount, 1, "The function _openCloseNavMenuPopover has been called once.");
    });

    QUnit.module("The onkeyup function", {
        beforeEach: function () {
            this.oShellAppTitle = new ShellAppTitle();
            this.oClickStub = sandbox.stub(this.oShellAppTitle, "onclick");
        },
        afterEach: function () {
            this.oShellAppTitle.destroy();
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("calls click if released key is spacebar", function (assert) {
        // Act
        this.oShellAppTitle.onkeyup({ keyCode: 32 });

        // Assert
        assert.ok(this.oClickStub.calledOnce, "The click function was called.");
    });

    QUnit.test("does not call click if released key is not spacebar", function (assert) {
        // Act
        this.oShellAppTitle.onkeyup({ keyCode: 1 });

        // Assert
        assert.ok(this.oClickStub.notCalled, "The click function was not called.");
    });
});

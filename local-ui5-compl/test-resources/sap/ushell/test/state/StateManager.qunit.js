// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StateManager
 */
sap.ui.define([
    "sap/ushell/Config",
    "sap/ushell/state/BaseState",
    "sap/ushell/state/ControlManager",
    "sap/ushell/state/CurrentState",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/StateRules",
    "sap/ushell/utils"
], function (
    Config,
    BaseState,
    ControlManager,
    CurrentState,
    ShellModel,
    StateManager,
    StateRules,
    ushellUtils
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    const sandbox = sinon.createSandbox();

    QUnit.module("constructor", {
        beforeEach: async function () {
            sandbox.stub(ushellUtils, "isFlpHomeIntent");
            sandbox.stub(Config, "last");
            this.oURLSearchParamsHasStub = sandbox.stub(URLSearchParams.prototype, "has");
            this.oURLSearchParamsGetStub = sandbox.stub(URLSearchParams.prototype, "get");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Initial ShellMode is 'Default'", async function (assert) {
        // Act
        const sShellMode = StateManager.getShellMode();
        // Assert
        assert.strictEqual(sShellMode, ShellMode.Default, "ShellMode is correct");
    });

    QUnit.test("ShellMode can be set via 'sap-ushell-config' param", async function (assert) {
        // Arrange
        // priority: sap-ushell-config > Config
        Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Standalone);
        /**
         * priority: sap-ushell-config > appState > Config
         * code shall be automatically removed by tooling
         * @deprecated since 1.120.0
         */
        (() => {
            this.oURLSearchParamsHasStub.withArgs("appState").returns(true);
            this.oURLSearchParamsGetStub.withArgs("appState").returns(ShellMode.Merged);
        })();
        this.oURLSearchParamsHasStub.withArgs("sap-ushell-config").returns(true);
        this.oURLSearchParamsGetStub.withArgs("sap-ushell-config").returns(ShellMode.Headerless);
        StateManager.reset();
        // Act
        const sShellMode = StateManager.getShellMode();
        // Assert
        assert.strictEqual(sShellMode, ShellMode.Headerless, "ShellMode is correct");
    });

    /**
     * code shall be automatically removed by tooling
     * @deprecated since 1.120.0
     */
    QUnit.test("ShellMode can be set via 'appState' param", async function (assert) {
        // Arrange
        // priority: sap-ushell-config > appState > Config
        Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Standalone);
        this.oURLSearchParamsHasStub.withArgs("appState").returns(true);
        this.oURLSearchParamsGetStub.withArgs("appState").returns(ShellMode.Merged);
        StateManager.reset();
        // Act
        const sShellMode = StateManager.getShellMode();
        // Assert
        assert.strictEqual(sShellMode, ShellMode.Merged, "ShellMode is correct");
    });

    QUnit.test("ShellMode can be set via '/core/state/shellMode' config", async function (assert) {
        // Arrange
        // priority: sap-ushell-config > Config
        Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Standalone);
        StateManager.reset();
        // Act
        const sShellMode = StateManager.getShellMode();
        // Assert
        assert.strictEqual(sShellMode, ShellMode.Standalone, "ShellMode is correct");
    });

    QUnit.test("Sanitizes to shellMode to lowercase", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Standalone.toUpperCase());
        StateManager.reset();
        // Act
        const sShellMode = StateManager.getShellMode();
        // Assert
        assert.strictEqual(sShellMode, ShellMode.Standalone, "ShellMode is correct");
    });

    QUnit.test("Fails for invalid ShellMode and defaults to 'Default'", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/state/shellMode").returns("INVALID_SHELL_MODE");
        StateManager.reset();
        // Act
        const sShellMode = StateManager.getShellMode();
        // Assert
        assert.strictEqual(sShellMode, ShellMode.Default, "ShellMode is correct");
    });

    QUnit.test("Initial LaunchpadState is 'Home' for home intent", async function (assert) {
        // Arrange
        ushellUtils.isFlpHomeIntent.returns(true);
        StateManager.reset();
        // Act
        const sLaunchpadState = StateManager.getLaunchpadState();
        // Assert
        assert.strictEqual(sLaunchpadState, LaunchpadState.Home, "LaunchpadState is correct");
    });

    QUnit.test("Initial LaunchpadState is 'App' for non home intent", async function (assert) {
        // Arrange
        ushellUtils.isFlpHomeIntent.returns(false);
        StateManager.reset();
        // Act
        const sLaunchpadState = StateManager.getLaunchpadState();
        // Assert
        assert.strictEqual(sLaunchpadState, LaunchpadState.App, "LaunchpadState is correct");
    });

    QUnit.test("Initializes the base state with the module structure", async function (assert) {
        // Arrange
        const oExpectedBaseState = {
            sidePane: {
                visible: false,
                items: []
            },
            toolArea: {
                visible: false,
                items: []
            },
            rightFloatingContainer: {
                visible: false,
                items: []
            },
            floatingContainer: {
                visible: false,
                state: "floating",
                dragSelector: "",
                items: []
            },
            userActions: {
                items: []
            },
            floatingActions: {
                items: []
            },
            header: {
                visible: true,
                home: {
                    showLogo: false
                },
                secondTitle: "",
                headItems: [],
                centralAreaElement: null,
                headEndItems: []
            },
            subHeader: {
                items: []
            },
            footer: {
                content: ""
            },
            application: {
                title: "",
                icon: "",
                subTitle: "",
                relatedApps: [],
                hierarchy: []
            }
        };
        sandbox.spy(BaseState.prototype, "getStateData");
        // prevent changes by current state and state rules
        sandbox.stub(CurrentState, "applyState");
        sandbox.stub(StateRules, "applyRules");
        // Act
        StateManager.reset();
        // Assert
        assert.deepEqual(BaseState.prototype.getStateData.getCall(0).returnValue, oExpectedBaseState, "BaseState was initialized correctly");
    });

    QUnit.module("init", {
        beforeEach: async function () {
            sandbox.stub(StateRules, "setShellConfig");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Initializes the stateRules module with the provided shell config", async function (assert) {
        // Arrange
        const oShellConfig = {
            config: "config"
        };
        const aExpectedArgs = [oShellConfig];
        // Act
        StateManager.init(oShellConfig);
        // Assert
        assert.deepEqual(StateRules.setShellConfig.getCall(0).args, aExpectedArgs, "isetShellConfigit was called correctly");
    });

    QUnit.test("Initializing twice fails", async function (assert) {
        // Arrange
        const oShellConfig = {
            config: "config"
        };
        StateManager.init(oShellConfig);
        // Act & Assert
        assert.throws(() => {
            StateManager.init(oShellConfig);
        }, "Exception was thrown");
    });

    QUnit.module("switchState", {
        beforeEach: async function () {
            sandbox.stub(ShellModel, "updateModel");
            sandbox.stub(BaseState.prototype, "getStateData").returns({
                baseState: true
            });
            sandbox.stub(CurrentState, "applyState").callsFake((oData) => {
                oData.currentState = true;
            });
            sandbox.stub(StateRules, "applyRules").callsFake((oData) => {
                oData.stateRules = true;
            });
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Updates The LaunchpadState", async function (assert) {
        // Act
        StateManager.switchState(LaunchpadState.App);
        // Assert
        const sCurrentLaunchpadState = StateManager.getLaunchpadState();
        assert.strictEqual(sCurrentLaunchpadState, LaunchpadState.App, "LaunchpadState is correct");
    });

    QUnit.test("Overrides the ShellMode", async function (assert) {
        // Act
        StateManager.switchState(LaunchpadState.App, ShellMode.Headerless);
        // Assert
        const sCurrentShellMode = StateManager.getShellMode();
        assert.strictEqual(sCurrentShellMode, ShellMode.Headerless, "ShellMode is correct");
    });

    QUnit.test("Overridden ShellMode returns to initialized default when called again without a override", async function (assert) {
        // Arrange
        sandbox.stub(Config, "last").withArgs("/core/state/shellMode").returns(ShellMode.Standalone);
        StateManager.reset();
        // Act
        StateManager.switchState(LaunchpadState.App, ShellMode.Headerless);
        StateManager.switchState(LaunchpadState.App);
        // Assert
        const sCurrentShellMode = StateManager.getShellMode();
        assert.strictEqual(sCurrentShellMode, ShellMode.Standalone, "ShellMode is correct");
    });

    QUnit.test("Calculates the state and updates the ShellModel", async function (assert) {
        // Act
        StateManager.switchState(LaunchpadState.App);
        // Assert
        let aExpectedArgs = [ShellMode.Default, LaunchpadState.App];
        assert.deepEqual(BaseState.prototype.getStateData.getCall(0).args, aExpectedArgs, "getStateData was called correctly");
        assert.deepEqual(CurrentState.applyState.callCount, 1, "applyState was called");
        assert.deepEqual(StateRules.applyRules.callCount, 1, "applyRules was called");
        aExpectedArgs = [{
            baseState: true,
            currentState: true,
            stateRules: true
        }];
        assert.deepEqual(ShellModel.updateModel.getCall(0).args, aExpectedArgs, "updateModel was called correctly");

        assert.ok(BaseState.prototype.getStateData.calledBefore(CurrentState.applyState), "getStateData was called before applyState");
        assert.ok(CurrentState.applyState.calledBefore(StateRules.applyRules), "applyState was called before applyRules");
        assert.ok(StateRules.applyRules.calledBefore(ShellModel.updateModel), "applyRules was called before updateModel");
    });

    QUnit.test("Fails for invalid LaunchpadState", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StateManager.switchState("INVALID_LAUNCHPAD_STATE");
        }, "Exception was thrown");
    });

    QUnit.test("Fails for invalid ShellMode", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StateManager.switchState(LaunchpadState.App, "INVALID_SHELL_MODE");
        }, "Exception was thrown");
    });

    QUnit.module("updateBaseStates", {
        beforeEach: async function () {
            this.oUpdateStateStub = sandbox.stub(BaseState.prototype, "updateState");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Updates the BaseState", async function (assert) {
        // Arrange
        const aExpectedArgs1 = [LaunchpadState.App, "header.headerVisible", Operation.Set, false];
        const aExpectedArgs2 = [LaunchpadState.Home, "header.headerVisible", Operation.Set, false];
        // Act
        StateManager.updateBaseStates([LaunchpadState.App, LaunchpadState.Home], "header.headerVisible", Operation.Set, false);
        // Assert
        assert.strictEqual(this.oUpdateStateStub.callCount, 2, "updateState was called twice");
        assert.deepEqual(this.oUpdateStateStub.getCall(0).args, aExpectedArgs1, "updateState was called with correct arguments for call #1");
        assert.deepEqual(this.oUpdateStateStub.getCall(1).args, aExpectedArgs2, "updateState was called with correct arguments for call #2");
    });

    QUnit.test("Fails for a invalid operation", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StateManager.updateBaseStates([LaunchpadState.App, LaunchpadState.Home], "header.headerVisible", "INVALID_OPERATION", false);
        }, "Exception was thrown");
    });

    QUnit.test("Fails for a empty LaunchpadState list", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StateManager.updateBaseStates([], "header.headerVisible", Operation.Set, false);
        }, "Exception was thrown");
    });

    QUnit.test("Fails for a invalid LaunchpadState", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StateManager.updateBaseStates(["INVALID_LAUNCHPAD_STATE"], "header.headerVisible", Operation.Set, false);
        }, "Exception was thrown");
    });

    QUnit.test("Fails for null", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StateManager.updateBaseStates(null, "header.headerVisible", Operation.Set, false);
        }, "Exception was thrown");
    });

    QUnit.test("Fails for undefined", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StateManager.updateBaseStates(undefined, "header.headerVisible", Operation.Set, false);
        }, "Exception was thrown");
    });

    QUnit.module("updateAllBaseStates", {
        beforeEach: async function () {
            sandbox.stub(StateManager, "updateBaseStates");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Updates all BaseStates", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            [LaunchpadState.Home, LaunchpadState.App],
            "header.headerVisible",
            Operation.Set,
            false
        ];
        // Act
        StateManager.updateAllBaseStates("header.headerVisible", Operation.Set, false);
        // Assert
        assert.deepEqual(StateManager.updateBaseStates.getCall(0).args, aExpectedArgs, "updateBaseStates was called with correct arguments");
    });

    QUnit.module("updateCurrentState", {
        beforeEach: async function () {
            this.oUpdateStateStub = sandbox.stub(CurrentState, "updateState");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Updates the CurrentState", async function (assert) {
        // Arrange
        const aExpectedArgs = ["header.headerVisible", Operation.Set, false];
        // Act
        StateManager.updateCurrentState("header.headerVisible", Operation.Set, false);
        // Assert
        assert.deepEqual(this.oUpdateStateStub.getCall(0).args, aExpectedArgs, "updateState was called with correct arguments");
    });

    QUnit.test("Fails for invalid Operations", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StateManager.updateCurrentState("header.headerVisible", "INVALID_OPERATION", false);
        }, "Exception was thrown");
    });

    QUnit.module("addManagedControl", {
        beforeEach: async function () {
            sandbox.stub(ControlManager, "addManagedControl");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Adds a managed Control to the current state by default", async function (assert) {
        // Arrange
        const aExpectedArgs = ["controlId", true, LaunchpadState.Home];
        // Act
        StateManager.addManagedControl("controlId");
        // Assert
        assert.deepEqual(ControlManager.addManagedControl.getCall(0).args, aExpectedArgs, "addManagedControl was called with correct arguments");
    });

    QUnit.test("Adds a managed Control to the base state", async function (assert) {
        // Arrange
        const aExpectedArgs = ["controlId", false, LaunchpadState.Home];
        // Act
        StateManager.addManagedControl("controlId", true);
        // Assert
        assert.deepEqual(ControlManager.addManagedControl.getCall(0).args, aExpectedArgs, "addManagedControl was called with correct arguments");
    });

    QUnit.module("updateManagedControl", {
        beforeEach: async function () {
            sandbox.stub(ControlManager, "updateManagedControl");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Updates a managed Control to the current state by default", async function (assert) {
        // Arrange
        const aExpectedArgs = ["controlId", true];
        // Act
        StateManager.updateManagedControl("controlId");
        // Assert
        assert.deepEqual(ControlManager.updateManagedControl.getCall(0).args, aExpectedArgs, "updateManagedControl was called with correct arguments");
    });

    QUnit.test("Updates a managed Control to the base state", async function (assert) {
        // Arrange
        const aExpectedArgs = ["controlId", false];
        // Act
        StateManager.updateManagedControl("controlId", true);
        // Assert
        assert.deepEqual(ControlManager.updateManagedControl.getCall(0).args, aExpectedArgs, "updateManagedControl was called with correct arguments");
    });

    QUnit.module("removeManagedControl", {
        beforeEach: async function () {
            sandbox.stub(ControlManager, "removeManagedControl");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Removes a managed Control from the ControlManager", async function (assert) {
        // Arrange
        const aExpectedArgs = ["controlId"];
        // Act
        StateManager.removeManagedControl("controlId");
        // Assert
        assert.deepEqual(ControlManager.removeManagedControl.getCall(0).args, aExpectedArgs, "removeManagedControl was called with correct arguments");
    });

    QUnit.module("destroyManagedControls", {
        beforeEach: async function () {
            sandbox.stub(ControlManager, "destroyManagedControls");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Forwards call to ControlManager", async function (assert) {
        // Act
        StateManager.destroyManagedControls();
        // Assert
        assert.strictEqual(ControlManager.destroyManagedControls.callCount, 1, "destroyManagedControls was called");
    });

    QUnit.module("stallChanges", {
        beforeEach: async function () {
            sandbox.stub(ShellModel, "updateModel");
            sandbox.stub(BaseState.prototype, "updateState");
            sandbox.stub(CurrentState, "updateState");
            sandbox.stub(ControlManager, "addManagedControl");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Prevents model updates", async function (assert) {
        // Act
        StateManager.stallChanges();
        StateManager.switchState(LaunchpadState.App);
        // Assert
        assert.strictEqual(ShellModel.updateModel.callCount, 0, "updateModel was not called");
    });

    QUnit.test("Prevents BaseState updates", async function (assert) {
        // Act
        StateManager.stallChanges();
        StateManager.updateBaseStates([LaunchpadState.App], "header.headerVisible", Operation.Set, false);
        // Assert
        assert.strictEqual(BaseState.prototype.updateState.callCount, 0, "updateState was not called");
    });

    QUnit.test("Prevents CurrentState updates", async function (assert) {
        // Act
        StateManager.stallChanges();
        StateManager.updateCurrentState("header.headerVisible", Operation.Set, false);
        // Assert
        assert.strictEqual(CurrentState.updateState.callCount, 0, "updateState was not called");
    });

    QUnit.test("Prevents adding of ManagedControls", async function (assert) {
        // Act
        StateManager.stallChanges();
        StateManager.addManagedControl("controlId");
        // Assert
        assert.strictEqual(ControlManager.addManagedControl.callCount, 0, "addManagedControl was not called");
    });

    QUnit.module("applyStalledChanges", {
        beforeEach: async function () {
            sandbox.stub(ShellModel, "updateModel");
            sandbox.stub(BaseState.prototype, "updateState");
            sandbox.stub(CurrentState, "updateState");
            sandbox.stub(ControlManager, "addManagedControl");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Updates the model with recent data", async function (assert) {
        // Arrange
        const oBaseStateData = {
            baseState: true
        };
        sandbox.stub(BaseState.prototype, "getStateData").withArgs(ShellMode.Headerless, LaunchpadState.App).returns(oBaseStateData);
        // prevent changes by current state and state rules
        sandbox.stub(CurrentState, "applyState");
        sandbox.stub(StateRules, "applyRules");
        StateManager.stallChanges();
        StateManager.switchState(LaunchpadState.App, ShellMode.Headerless);
        // Act
        StateManager.applyStalledChanges();
        // Assert
        assert.deepEqual(ShellModel.updateModel.getCall(0).args, [oBaseStateData], "updateModel was called with correct arguments");
    });

    QUnit.test("Applies pending changes to the BaseState", async function (assert) {
        // Arrange
        const aExpectedArgs = [LaunchpadState.App, "header.headerVisible", Operation.Set, false];
        StateManager.stallChanges();
        StateManager.updateBaseStates([LaunchpadState.App], "header.headerVisible", Operation.Set, false);
        BaseState.prototype.updateState.resetHistory(); // to ensure no call is leaking
        // Act
        StateManager.applyStalledChanges();
        // Assert
        assert.deepEqual(BaseState.prototype.updateState.getCall(0).args, aExpectedArgs, "updateState was called with correct arguments");
    });

    QUnit.test("Applies pending changes to the CurrentState", async function (assert) {
        // Arrange
        const aExpectedArgs = ["header.headerVisible", Operation.Set, false];
        StateManager.stallChanges();
        StateManager.updateCurrentState("header.headerVisible", Operation.Set, false);
        CurrentState.updateState.resetHistory(); // to ensure no call is leaking
        // Act
        StateManager.applyStalledChanges();
        // Assert
        assert.deepEqual(CurrentState.updateState.getCall(0).args, aExpectedArgs, "updateState was called with correct arguments");
    });

    QUnit.test("Applies pending changes to the ControlManager", async function (assert) {
        // Arrange
        const aExpectedArgs = ["controlId", true, LaunchpadState.Home];
        StateManager.stallChanges();
        StateManager.addManagedControl("controlId");
        ControlManager.addManagedControl.resetHistory(); // to ensure no call is leaking
        // Act
        StateManager.applyStalledChanges();
        // Assert
        assert.deepEqual(ControlManager.addManagedControl.getCall(0).args, aExpectedArgs, "addManagedControl was called with correct arguments");
    });

    QUnit.test("Applies multiple pending changes", async function (assert) {
        // Arrange
        StateManager.stallChanges();

        StateManager.addManagedControl("controlId");
        StateManager.updateBaseStates([LaunchpadState.App], "floatingContainer.visible", Operation.Set, true);
        StateManager.updateCurrentState("header.headerVisible", Operation.Set, false);

        StateManager.addManagedControl("controlId2", true);
        StateManager.updateBaseStates([LaunchpadState.Home], "footer.content", Operation.Set, "footer1");
        StateManager.updateCurrentState("header.headEndItems", Operation.Add, "item1");

        // Act
        StateManager.applyStalledChanges();

        // Assert
        const oControlManagerCall1 = ControlManager.addManagedControl.getCall(0);
        let aExpectedArgs = ["controlId", true, LaunchpadState.Home];
        assert.deepEqual(oControlManagerCall1.args, aExpectedArgs, "addManagedControl was called with correct arguments");

        const BaseStateCall1 = BaseState.prototype.updateState.getCall(0);
        aExpectedArgs = [LaunchpadState.App, "floatingContainer.visible", Operation.Set, true];
        assert.deepEqual(BaseStateCall1.args, aExpectedArgs, "updateState was called with correct arguments");

        const CurrentStateCall1 = CurrentState.updateState.getCall(0);
        aExpectedArgs = ["header.headerVisible", Operation.Set, false];
        assert.deepEqual(CurrentStateCall1.args, aExpectedArgs, "updateState was called with correct arguments");

        const oControlManagerCall2 = ControlManager.addManagedControl.getCall(1);
        aExpectedArgs = ["controlId2", false, LaunchpadState.Home];
        assert.deepEqual(oControlManagerCall2.args, aExpectedArgs, "addManagedControl was called with correct arguments");

        const BaseStateCall2 = BaseState.prototype.updateState.getCall(1);
        aExpectedArgs = [LaunchpadState.Home, "footer.content", Operation.Set, "footer1"];
        assert.deepEqual(BaseStateCall2.args, aExpectedArgs, "updateState was called with correct arguments");

        const CurrentStateCall2 = CurrentState.updateState.getCall(1);
        aExpectedArgs = ["header.headEndItems", Operation.Add, "item1"];
        assert.deepEqual(CurrentStateCall2.args, aExpectedArgs, "updateState was called with correct arguments");

        // respects the order of the calls
        assert.ok(oControlManagerCall1.calledBefore(BaseStateCall1), "addManagedControl#1 was called before BaseState#1");
        assert.ok(BaseStateCall1.calledBefore(CurrentStateCall1), "BaseState#1 was called before CurrentState#1");
        assert.ok(CurrentStateCall1.calledBefore(oControlManagerCall2), "CurrentState#1 was called before addManagedControl#2");
        assert.ok(oControlManagerCall2.calledBefore(BaseStateCall2), "addManagedControl#2 was called before BaseState#2");
        assert.ok(BaseStateCall2.calledBefore(CurrentStateCall2), "BaseState#2 was called before CurrentState#2");

        assert.strictEqual(ShellModel.updateModel.callCount, 1, "model was updated only once");
    });

    QUnit.module("discardStalledChanges", {
        beforeEach: async function () {
            sandbox.stub(ShellModel, "updateModel");
            sandbox.stub(BaseState.prototype, "updateState");
            sandbox.stub(CurrentState, "updateState");
            sandbox.stub(ControlManager, "addManagedControl");
            sandbox.stub(ControlManager, "destroyManagedControl");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Does not do a model update", async function (assert) {
        // Arrange
        const oBaseStateData = {
            baseState: true
        };
        sandbox.stub(BaseState.prototype, "getStateData").withArgs(ShellMode.Headerless, LaunchpadState.App).returns(oBaseStateData);
        // prevent changes by current state and state rules
        sandbox.stub(CurrentState, "applyState");
        sandbox.stub(StateRules, "applyRules");
        StateManager.stallChanges();
        StateManager.switchState(LaunchpadState.App, ShellMode.Headerless);
        // Act
        StateManager.discardStalledChanges();
        // Assert
        assert.deepEqual(ShellModel.updateModel.callCount, 0, "updateModel was not called");
    });

    QUnit.test("Ignores pending changes to the BaseState", async function (assert) {
        // Arrange
        StateManager.stallChanges();
        StateManager.updateBaseStates([LaunchpadState.App], "header.headerVisible", Operation.Set, false);
        BaseState.prototype.updateState.resetHistory(); // to ensure no call is leaking
        // Act
        StateManager.discardStalledChanges();
        // Assert
        assert.strictEqual(BaseState.prototype.updateState.callCount, 0, "updateState was not called");
    });

    QUnit.test("Ignores pending changes to the CurrentState", async function (assert) {
        // Arrange
        StateManager.stallChanges();
        StateManager.updateCurrentState("header.headerVisible", Operation.Set, false);
        CurrentState.updateState.resetHistory(); // to ensure no call is leaking
        // Act
        StateManager.discardStalledChanges();
        // Assert
        assert.strictEqual(CurrentState.updateState.callCount, 0, "updateState was not called");
    });

    QUnit.test("Destroys pending controls", async function (assert) {
        // Arrange
        const aExpectedArgs = ["controlId"];
        StateManager.stallChanges();
        StateManager.addManagedControl("controlId");
        ControlManager.addManagedControl.resetHistory(); // to ensure no call is leaking
        // Act
        StateManager.discardStalledChanges();
        // Assert
        assert.strictEqual(ControlManager.addManagedControl.callCount, 0, "addManagedControl was not called");
        assert.deepEqual(ControlManager.destroyManagedControl.getCall(0).args, aExpectedArgs, "destroyManagedControl was called with correct arguments");
    });

    QUnit.test("Handles multiple pending changes correctly", async function (assert) {
        // Arrange
        StateManager.stallChanges();

        StateManager.addManagedControl("controlId");
        StateManager.updateBaseStates([LaunchpadState.App], "floatingContainer.visible", Operation.Set, true);
        StateManager.updateCurrentState("header.headerVisible", Operation.Set, false);

        StateManager.addManagedControl("controlId2", true);
        StateManager.updateBaseStates([LaunchpadState.Home], "footer.content", Operation.Set, "footer1");
        StateManager.updateCurrentState("header.headEndItems", Operation.Add, "item1");

        // Act
        StateManager.discardStalledChanges();

        // Assert
        const oControlManagerCall1 = ControlManager.destroyManagedControl.getCall(0);
        let aExpectedArgs = ["controlId"];
        assert.deepEqual(oControlManagerCall1.args, aExpectedArgs, "destroyManagedControl was called with correct arguments");

        const oControlManagerCall2 = ControlManager.destroyManagedControl.getCall(1);
        aExpectedArgs = ["controlId2"];
        assert.deepEqual(oControlManagerCall2.args, aExpectedArgs, "destroyManagedControl was called with correct arguments");


        // respects the order of the calls
        assert.ok(oControlManagerCall1.calledBefore(oControlManagerCall2), "addManagedControl#1 was called before addManagedControl#2");

        assert.strictEqual(ShellModel.updateModel.callCount, 0, "model was not updated");
    });

    QUnit.module("destroy", {
        beforeEach: async function () {
            sandbox.stub(CurrentState, "detachStateChange");
            sandbox.stub(CurrentState, "destroy");
            sandbox.stub(ShellModel, "destroy");
            sandbox.stub(ControlManager, "destroy");
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Detaches Event handler from CurrentState", async function (assert) {
        // Act
        StateManager.destroy();
        // Assert
        assert.strictEqual(CurrentState.detachStateChange.callCount, 1, "detachStateChange was called");
    });

    QUnit.test("Calls destroy handler on CurrentState", async function (assert) {
        // Act
        StateManager.destroy();
        // Assert
        assert.strictEqual(CurrentState.destroy.callCount, 1, "destroy was called");
    });

    QUnit.test("Calls destroy handler on ShellModel", async function (assert) {
        // Act
        StateManager.destroy();
        // Assert
        assert.strictEqual(ShellModel.destroy.callCount, 1, "destroy was called");
    });

    QUnit.test("Calls destroy handler on ControlManager", async function (assert) {
        // Act
        StateManager.destroy();
        // Assert
        assert.strictEqual(ControlManager.destroy.callCount, 1, "destroy was called");
    });

    QUnit.module("isLegacyHome", {
        beforeEach: async function () {
            sandbox.stub(ushellUtils, "isFlpHomeIntent");
            ushellUtils.isFlpHomeIntent.returns(true);

            sandbox.stub(Config, "last");
            Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Default);

            StateManager.reset();
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
        }
    });

    QUnit.test("Returns 'false' for app", async function (assert) {
        // Arrange
        ushellUtils.isFlpHomeIntent.returns(false);
        StateManager.reset();
        // Act
        const bResult = StateManager.isLegacyHome();
        // Assert
        assert.strictEqual(bResult, false, "Result is correct");
    });

    QUnit.test("Returns 'true' for default", async function (assert) {
        // Act
        const bResult = StateManager.isLegacyHome();
        // Assert
        assert.strictEqual(bResult, true, "Result is correct");
    });

    QUnit.test("Returns 'true' for minimal", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Minimal);
        StateManager.reset();
        // Act
        const bResult = StateManager.isLegacyHome();
        // Assert
        assert.strictEqual(bResult, true, "Result is correct");
    });

    QUnit.test("Returns 'true' for standalone", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Standalone);
        StateManager.reset();
        // Act
        const bResult = StateManager.isLegacyHome();
        // Assert
        assert.strictEqual(bResult, true, "Result is correct");
    });

    QUnit.test("Returns 'true' for lean", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Lean);
        StateManager.reset();
        // Act
        const bResult = StateManager.isLegacyHome();
        // Assert
        assert.strictEqual(bResult, true, "Result is correct");
    });

    QUnit.test("Returns 'false' for merged", async function (assert) {
        // Arrange
        Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Merged);
        StateManager.reset();
        // Act
        const bResult = StateManager.isLegacyHome();
        // Assert
        assert.strictEqual(bResult, false, "Result is correct");
    });

    QUnit.module("refreshState", {
        afterEach: async function () {
            sandbox.restore();
            StateManager.resetAll();
        }
    });

    QUnit.test("when path references an array", function (assert) {
        // Arrange
        const done = assert.async();
        const oBinding = ShellModel.getModel().bindList("/sidePane/items");
        oBinding.attachChange(() => {
            // Assert
            assert.ok(true, "then the change event is fired");
            done();

            // Cleanup
            oBinding.destroy();
        });

        // Act
        StateManager.refreshState("sidePane.items");
    });

    QUnit.test("when path references an object", function (assert) {
        // Arrange
        const done = assert.async();
        const oBinding = ShellModel.getModel().bindProperty("/sidePane");
        oBinding.attachChange(() => {
            // Assert
            assert.ok(true, "then the change event is fired");
            done();

            // Cleanup
            oBinding.destroy();
        });

        // Act
        StateManager.refreshState("sidePane");
    });

    QUnit.test("when path references an object and sub nodes are updated", function (assert) {
        // Arrange
        const done = assert.async();
        const oBinding = ShellModel.getModel().bindProperty("/sidePane/items");
        oBinding.attachChange(() => {
            // Assert
            assert.ok(true, "then the change event is fired");
            done();

            // Cleanup
            oBinding.destroy();
        });

        // Act
        StateManager.refreshState("sidePane");
    });
});



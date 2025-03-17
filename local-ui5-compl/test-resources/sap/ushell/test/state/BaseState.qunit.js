// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.BaseState
 */
sap.ui.define([
    "sap/base/util/deepClone",
    "sap/base/util/ObjectPath",
    "sap/ushell/state/BaseState",
    "sap/ushell/state/StrategyFactory",
    "sap/ushell/state/StateManager"
], function (
    deepClone,
    ObjectPath,
    BaseState,
    StrategyFactory,
    StateManager
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    const sandbox = sinon.createSandbox();

    QUnit.module("constructor", {
        beforeEach: async function () {

        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates the base states", async function (assert) {
        // Arrange
        const oExpectedBaseStateData = {
            sidePane: {
                visible: false,
                items: []
            }
        };
        // Act
        const oBaseState = new BaseState({
            sidePane: {
                visible: false,
                items: []
            }
        });
        const oActualDataHome = oBaseState.getStateData(ShellMode.Default, LaunchpadState.Home);
        const oActualDataApp = oBaseState.getStateData(ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.deepEqual(oActualDataHome, oExpectedBaseStateData, "The home base state was created correctly");
        assert.deepEqual(oActualDataApp, oExpectedBaseStateData, "The home base state was created correctly");
    });

    QUnit.module("updateState", {
        beforeEach: async function () {
            this.oInitialState = {
                sidePane: {
                    visible: false,
                    items: []
                }
            };

            this.oBaseState = new BaseState(deepClone(this.oInitialState));
            sandbox.stub(StrategyFactory, "perform");
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the factory with the arguments", async function (assert) {
        // Arrange
        const aExpectedArgs = [this.oInitialState, "sidePane.visible", Operation.Set, true];
        // Act
        this.oBaseState.updateState(LaunchpadState.Home, "sidePane.visible", Operation.Set, true);
        // Assert
        assert.deepEqual(StrategyFactory.perform.getCall(0).args, aExpectedArgs, "The factory was called with the correct arguments");
    });

    QUnit.test("LaunchpadState shortcut: Calls for all LaunchpadStates", async function (assert) {
        // Arrange
        const aExpectedCount = Object.keys(LaunchpadState).length;
        const aExpectedArgs = [this.oInitialState, "sidePane.visible", Operation.Set, true];
        // Act
        this.oBaseState.updateState(null, "sidePane.visible", Operation.Set, true);
        // Assert
        assert.strictEqual(StrategyFactory.perform.callCount, aExpectedCount, "The factory was called for all LaunchpadStates");
        for (let i = 0; i < aExpectedCount; i++) {
            assert.deepEqual(StrategyFactory.perform.getCall(i).args, aExpectedArgs, "The factory was called with the correct arguments");
        }
    });

    QUnit.test("Uses the Strategies to update the actual state", async function (assert) {
        // Arrange
        const oExpectedBaseStateData = {
            sidePane: {
                visible: true,
                items: []
            }
        };
        StrategyFactory.perform.callsFake((oState, sPath, sOperation, vValue) => {
            ObjectPath.set(sPath, vValue, oState);
        });
        // Act
        this.oBaseState.updateState(LaunchpadState.Home, "sidePane.visible", Operation.Set, true);
        // Assert
        const oActualDataHome = this.oBaseState.getStateData(ShellMode.Default, LaunchpadState.Home);
        const oActualDataApp = this.oBaseState.getStateData(ShellMode.Default, LaunchpadState.App);
        assert.deepEqual(oActualDataHome, oExpectedBaseStateData, "The home base state was updated correctly");
        assert.deepEqual(oActualDataApp, this.oInitialState, "The app base state was not updated");
    });

    QUnit.module("getStateData", {
        beforeEach: async function () {
            this.oBaseState = new BaseState({
                sidePane: {
                    visible: false,
                    items: []
                }
            });
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates deep clones of the state data", async function (assert) {
        // Act
        const oActualData1 = this.oBaseState.getStateData(ShellMode.Default, LaunchpadState.Home);
        const oActualData2 = this.oBaseState.getStateData(ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.deepEqual(oActualData1, oActualData2, "The state data have the same data");
        assert.notStrictEqual(oActualData1, oActualData2, "The state data objects are different");
    });

});

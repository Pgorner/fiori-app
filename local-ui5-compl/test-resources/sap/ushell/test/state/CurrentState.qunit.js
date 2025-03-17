// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.CurrentState
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/state/CurrentState",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/StrategyFactory"
], function (
    ObjectPath,
    CurrentState,
    StateManager,
    StrategyFactory
) {
    "use strict";

    /* global QUnit, sinon */

     // shortcut for sap.ushell.state.StateManager.Operation
     const Operation = StateManager.Operation;

    const sandbox = sinon.createSandbox();

    QUnit.module("stateChange event", {
        afterEach: async function () {
            sandbox.restore();
            CurrentState.reset();
        }
    });

    QUnit.test("Fires the event on flushState", function (assert) {
        // Arrange
        const fnDone = assert.async();
        CurrentState.attachStateChange(function () {
            // Assert
            assert.ok(true, "The event was fired");
            fnDone();
        });
        // Act
        CurrentState.flushState();
    });

    QUnit.test("Fires the event on restoreState", function (assert) {
        // Arrange
        const fnDone = assert.async();
        CurrentState.attachStateChange(function () {
            // Assert
            assert.ok(true, "The event was fired");
            fnDone();
        });
        // Act
        CurrentState.restoreState({});
    });

    QUnit.test("detachStateChange detaches the handler", function (assert) {
        // Arrange
        const fnDone = assert.async();
        function handler () {
            assert.ok(false, "The event was fired");
        }

        CurrentState.attachStateChange(handler);
        // Act
        CurrentState.detachStateChange(handler);
        CurrentState.restoreState({});
        // Assert
        setTimeout(() => {
            assert.ok(true, "The event was not fired");
            fnDone();
        }, 100);
    });

    QUnit.module("updateState", {
        beforeEach: async function () {
            sandbox.stub(StrategyFactory, "perform").callsFake((oState, sPath, sOperation, vValue) => {
                ObjectPath.set(sPath, vValue, oState);
            });

            this.oBaseStateData = {
                footer: {
                    content: ""
                }
            };
        },
        afterEach: async function () {
            sandbox.restore();
            CurrentState.reset();
        }
    });

    QUnit.test("Updates the state once applied", async function (assert) {
        // Arrange
        const oExpectedBaseStateData = {
            footer: {
                content: "item1"
            }
        };
        // Act
        CurrentState.updateState("footer.content", Operation.Set, "item1");
        CurrentState.applyState(this.oBaseStateData);
        // Assert
        assert.deepEqual(this.oBaseStateData, oExpectedBaseStateData, "The state was updated");
    });

    QUnit.test("Updates the state and respects order of changes", async function (assert) {
        // Arrange
        const oExpectedBaseStateData = {
            footer: {
                content: "item2"
            }
        };
        // Act
        CurrentState.updateState("footer.content", Operation.Set, "item1");
        CurrentState.updateState("footer.content", Operation.Set, "item2");
        CurrentState.applyState(this.oBaseStateData);
        // Assert
        assert.deepEqual(this.oBaseStateData, oExpectedBaseStateData, "The state was updated");
    });

    QUnit.module("flushState", {
        beforeEach: async function () {
            sandbox.stub(StrategyFactory, "perform").callsFake((oState, sPath, sOperation, vValue) => {
                ObjectPath.set(sPath, vValue, oState);
            });

            this.oBaseStateData = {
                footer: {
                    content: ""
                }
            };
        },
        afterEach: async function () {
            sandbox.restore();
            CurrentState.reset();
        }
    });

    QUnit.test("Removes all changes to the current state", async function (assert) {
        // Arrange
        const oExpectedBaseStateData = {
            footer: {
                content: ""
            }
        };
        CurrentState.updateState("footer.content", Operation.Set, "item1");
        // Act
        CurrentState.flushState();
        CurrentState.applyState(this.oBaseStateData);
        // Assert
        assert.deepEqual(this.oBaseStateData, oExpectedBaseStateData, "The state was updated");
    });

    QUnit.module("storeState & restoreState", {
        beforeEach: async function () {
            sandbox.stub(StrategyFactory, "perform").callsFake((oState, sPath, sOperation, vValue) => {
                ObjectPath.set(sPath, vValue, oState);
            });

            this.oBaseStateData = {
                footer: {
                    content: ""
                }
            };
        },
        afterEach: async function () {
            sandbox.restore();
            CurrentState.reset();
        }
    });

    QUnit.test("storeState does not remove the data", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        const oExpectedBaseStateData = {
            footer: {
                content: "item1"
            }
        };
        CurrentState.updateState("footer.content", Operation.Set, "item1");
        // Act
        CurrentState.storeState(oStorageEntry);
        CurrentState.applyState(this.oBaseStateData);
        // Assert
        assert.deepEqual(this.oBaseStateData, oExpectedBaseStateData, "The state was updated");
    });

    QUnit.test("storeState adds an entry to storage", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        CurrentState.updateState("footer.content", Operation.Set, "item1");
        // Act
        CurrentState.storeState(oStorageEntry);
        // Assert
        assert.strictEqual(Object.keys(oStorageEntry).length, 1, "The storage entry was added");
    });

    QUnit.test("restoreState restores the changes", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        const oExpectedBaseStateData = {
            footer: {
                content: "item1"
            }
        };
        CurrentState.updateState("footer.content", Operation.Set, "item1");
        CurrentState.storeState(oStorageEntry);
        CurrentState.reset();
        // Act
        CurrentState.restoreState(oStorageEntry);
        CurrentState.applyState(this.oBaseStateData);
        // Assert
        assert.deepEqual(this.oBaseStateData, oExpectedBaseStateData, "The state was updated");
    });

    QUnit.module("destroy", {
        beforeEach: async function () {
        },
        afterEach: async function () {
            sandbox.restore();
            CurrentState.reset();
        }
    });

    QUnit.test("Detaches all handler", function (assert) {
        // Arrange
        const fnDone = assert.async();
        function handler () {
            assert.ok(false, "The event was fired");
        }

        CurrentState.attachStateChange(handler);
        // Act
        CurrentState.destroy();
        CurrentState.restoreState({});
        // Assert
        setTimeout(() => {
            assert.ok(true, "The event was not fired");
            fnDone();
        }, 100);
    });
});

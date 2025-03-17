// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StrategyFactory
 */
sap.ui.define([
    "sap/ushell/state/StateManager",
    "sap/ushell/state/StrategyFactory",
    "sap/ushell/state/StrategyFactory/DefaultStrategy",
    "sap/ushell/state/StrategyFactory/FloatingActionsStrategy",
    "sap/ushell/state/StrategyFactory/FloatingContainerStrategy",
    "sap/ushell/state/StrategyFactory/HeadItemsStrategy",
    "sap/ushell/state/StrategyFactory/HeadEndItemsStrategy",
    "sap/ushell/state/StrategyFactory/SidePaneStrategy",
    "sap/ushell/state/StrategyFactory/SubHeaderStrategy",
    "sap/ushell/state/StrategyFactory/UserActionsStrategy"
], function (
    StateManager,
    StrategyFactory,
    DefaultStrategy,
    FloatingActionsStrategy,
    FloatingContainerStrategy,
    HeadItemsStrategy,
    HeadEndItemsStrategy,
    SidePaneStrategy,
    SubHeaderStrategy,
    UserActionsStrategy
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    const sandbox = sinon.createSandbox();

    QUnit.module("Custom Strategies", {
        beforeEach: async function () {
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Uses the HeadItemsStrategy for 'Add' on 'header.headItems'", async function (assert) {
        // Arrange
        const oStateData = {
            header: {
                headItems: []
            }
        };
        sandbox.stub(HeadItemsStrategy, "add").callsFake((aCurrentValue, sNewItem) => {
            aCurrentValue.push(sNewItem);
        });
        // Act
        StrategyFactory.perform(oStateData, "header.headItems", Operation.Add, "item1");
        // Assert
        assert.strictEqual(HeadItemsStrategy.add.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.header.headItems, ["item1"], "The item was added");
    });

    QUnit.test("Uses the DefaultStrategy for 'Remove' on 'header.headItems'", async function (assert) {
        // Arrange
        const oStateData = {
            header: {
                headItems: ["item1"]
            }
        };
        sandbox.spy(DefaultStrategy, "remove");
        // Act
        StrategyFactory.perform(oStateData, "header.headItems", Operation.Remove, "item1");
        // Assert
        assert.strictEqual(DefaultStrategy.remove.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.header.headItems, [], "The item was removed");
    });

    QUnit.test("Uses the DefaultStrategy for 'Set' on 'header.headItems'", async function (assert) {
        // Arrange
        const oStateData = {
            header: {
                headItems: []
            }
        };
        sandbox.spy(DefaultStrategy, "set");
        // Act
        StrategyFactory.perform(oStateData, "header.headItems", Operation.Set, ["item1"]);
        // Assert
        assert.strictEqual(DefaultStrategy.set.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.header.headItems, ["item1"], "The item was removed");
    });

    QUnit.test("Uses the HeadEndItemsStrategy for 'Add' on 'header.headEndItems'", async function (assert) {
        // Arrange
        const oStateData = {
            header: {
                headEndItems: []
            }
        };
        sandbox.stub(HeadEndItemsStrategy, "add").callsFake((aCurrentValue, sNewItem) => {
            aCurrentValue.push(sNewItem);
        });
        // Act
        StrategyFactory.perform(oStateData, "header.headEndItems", Operation.Add, "item1");
        // Assert
        assert.strictEqual(HeadEndItemsStrategy.add.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.header.headEndItems, ["item1"], "The item was added");
    });

    QUnit.test("Uses the DefaultStrategy for 'Remove' on 'header.headEndItems'", async function (assert) {
        // Arrange
        const oStateData = {
            header: {
                headEndItems: ["item1"]
            }
        };
        sandbox.spy(DefaultStrategy, "remove");
        // Act
        StrategyFactory.perform(oStateData, "header.headEndItems", Operation.Remove, "item1");
        // Assert
        assert.strictEqual(DefaultStrategy.remove.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.header.headEndItems, [], "The item was removed");
    });

    QUnit.test("Uses the DefaultStrategy for 'Set' on 'header.headEndItems'", async function (assert) {
        // Arrange
        const oStateData = {
            header: {
                headEndItems: []
            }
        };
        sandbox.spy(DefaultStrategy, "set");
        // Act
        StrategyFactory.perform(oStateData, "header.headEndItems", Operation.Set, ["item1"]);
        // Assert
        assert.strictEqual(DefaultStrategy.set.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.header.headEndItems, ["item1"], "The item was removed");
    });

    QUnit.test("Uses the HeadEndItemsStrategy for 'Add' on 'userActions.items'", async function (assert) {
        // Arrange
        const oStateData = {
            userActions: {
                items: []
            }
        };
        sandbox.stub(UserActionsStrategy, "add").callsFake((aCurrentValue, sNewItem) => {
            aCurrentValue.push(sNewItem);
        });
        // Act
        StrategyFactory.perform(oStateData, "userActions.items", Operation.Add, "item1");
        // Assert
        assert.strictEqual(UserActionsStrategy.add.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.userActions.items, ["item1"], "The item was added");
    });

    QUnit.test("Uses the DefaultStrategy for 'Remove' on 'userActions.items'", async function (assert) {
        // Arrange
        const oStateData = {
            userActions: {
                items: ["item1"]
            }
        };
        sandbox.spy(DefaultStrategy, "remove");
        // Act
        StrategyFactory.perform(oStateData, "userActions.items", Operation.Remove, "item1");
        // Assert
        assert.strictEqual(DefaultStrategy.remove.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.userActions.items, [], "The item was removed");
    });

    QUnit.test("Uses the DefaultStrategy for 'Set' on 'userActions.items'", async function (assert) {
        // Arrange
        const oStateData = {
            userActions: {
                items: []
            }
        };
        sandbox.spy(DefaultStrategy, "set");
        // Act
        StrategyFactory.perform(oStateData, "userActions.items", Operation.Set, ["item1"]);
        // Assert
        assert.strictEqual(DefaultStrategy.set.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.userActions.items, ["item1"], "The item was removed");
    });

    QUnit.test("Uses the FloatingActionsStrategy for 'Add' on 'floatingActions.items'", async function (assert) {
        // Arrange
        const oStateData = {
            floatingActions: {
                items: []
            }
        };
        sandbox.stub(FloatingActionsStrategy, "add").callsFake((aCurrentValue, sNewItem) => {
            aCurrentValue.push(sNewItem);
        });
        // Act
        StrategyFactory.perform(oStateData, "floatingActions.items", Operation.Add, "item1");
        // Assert
        assert.strictEqual(FloatingActionsStrategy.add.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.floatingActions.items, ["item1"], "The item was added");
    });

    QUnit.test("Uses the DefaultStrategy for 'Remove' on 'floatingActions.items'", async function (assert) {
        // Arrange
        const oStateData = {
            floatingActions: {
                items: ["item1"]
            }
        };
        sandbox.spy(DefaultStrategy, "remove");
        // Act
        StrategyFactory.perform(oStateData, "floatingActions.items", Operation.Remove, "item1");
        // Assert
        assert.strictEqual(DefaultStrategy.remove.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.floatingActions.items, [], "The item was removed");
    });

    QUnit.test("Uses the DefaultStrategy for 'Set' on 'floatingActions.items'", async function (assert) {
        // Arrange
        const oStateData = {
            floatingActions: {
                items: []
            }
        };
        sandbox.spy(DefaultStrategy, "set");
        // Act
        StrategyFactory.perform(oStateData, "floatingActions.items", Operation.Set, ["item1"]);
        // Assert
        assert.strictEqual(DefaultStrategy.set.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.floatingActions.items, ["item1"], "The item was removed");
    });

    QUnit.test("Uses the SubHeaderStrategy for 'Add' on 'subHeader.items'", async function (assert) {
        // Arrange
        const oStateData = {
            subHeader: {
                items: []
            }
        };
        sandbox.stub(SubHeaderStrategy, "add").callsFake((aCurrentValue, sNewItem) => {
            aCurrentValue.push(sNewItem);
        });
        // Act
        StrategyFactory.perform(oStateData, "subHeader.items", Operation.Add, "item1");
        // Assert
        assert.strictEqual(SubHeaderStrategy.add.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.subHeader.items, ["item1"], "The item was added");
    });

    QUnit.test("Uses the DefaultStrategy for 'Remove' on 'subHeader.items'", async function (assert) {
        // Arrange
        const oStateData = {
            subHeader: {
                items: ["item1"]
            }
        };
        sandbox.spy(DefaultStrategy, "remove");
        // Act
        StrategyFactory.perform(oStateData, "subHeader.items", Operation.Remove, "item1");
        // Assert
        assert.strictEqual(DefaultStrategy.remove.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.subHeader.items, [], "The item was removed");
    });

    QUnit.test("Uses the DefaultStrategy for 'Set' on 'subHeader.items'", async function (assert) {
        // Arrange
        const oStateData = {
            subHeader: {
                items: []
            }
        };
        sandbox.spy(DefaultStrategy, "set");
        // Act
        StrategyFactory.perform(oStateData, "subHeader.items", Operation.Set, ["item1"]);
        // Assert
        assert.strictEqual(DefaultStrategy.set.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.subHeader.items, ["item1"], "The item was removed");
    });

    QUnit.test("Uses the SidePaneStrategy for 'Add' on 'sidePane.items'", async function (assert) {
        // Arrange
        const oStateData = {
            sidePane: {
                items: []
            }
        };
        sandbox.stub(SidePaneStrategy, "add").callsFake((aCurrentValue, sNewItem) => {
            aCurrentValue.push(sNewItem);
        });
        // Act
        StrategyFactory.perform(oStateData, "sidePane.items", Operation.Add, "item1");
        // Assert
        assert.strictEqual(SidePaneStrategy.add.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.sidePane.items, ["item1"], "The item was added");
    });

    QUnit.test("Uses the DefaultStrategy for 'Remove' on 'sidePane.items'", async function (assert) {
        // Arrange
        const oStateData = {
            sidePane: {
                items: ["item1"]
            }
        };
        sandbox.spy(DefaultStrategy, "remove");
        // Act
        StrategyFactory.perform(oStateData, "sidePane.items", Operation.Remove, "item1");
        // Assert
        assert.strictEqual(DefaultStrategy.remove.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.sidePane.items, [], "The item was removed");
    });

    QUnit.test("Uses the DefaultStrategy for 'Set' on 'sidePane.items'", async function (assert) {
        // Arrange
        const oStateData = {
            sidePane: {
                items: []
            }
        };
        sandbox.spy(DefaultStrategy, "set");
        // Act
        StrategyFactory.perform(oStateData, "sidePane.items", Operation.Set, ["item1"]);
        // Assert
        assert.strictEqual(DefaultStrategy.set.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.sidePane.items, ["item1"], "The item was removed");
    });

    QUnit.test("Uses the SidePaneStrategy for 'Add' on 'floatingContainer.items'", async function (assert) {
        // Arrange
        const oStateData = {
            floatingContainer: {
                items: []
            }
        };
        sandbox.stub(FloatingContainerStrategy, "add").callsFake((aCurrentValue, sNewItem) => {
            aCurrentValue.push(sNewItem);
        });
        // Act
        StrategyFactory.perform(oStateData, "floatingContainer.items", Operation.Add, "item1");
        // Assert
        assert.strictEqual(FloatingContainerStrategy.add.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.floatingContainer.items, ["item1"], "The item was added");
    });

    QUnit.test("Uses the DefaultStrategy for 'Remove' on 'floatingContainer.items'", async function (assert) {
        // Arrange
        const oStateData = {
            floatingContainer: {
                items: ["item1"]
            }
        };
        sandbox.spy(DefaultStrategy, "remove");
        // Act
        StrategyFactory.perform(oStateData, "floatingContainer.items", Operation.Remove, "item1");
        // Assert
        assert.strictEqual(DefaultStrategy.remove.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.floatingContainer.items, [], "The item was removed");
    });

    QUnit.test("Uses the DefaultStrategy for 'Set' on 'floatingContainer.items'", async function (assert) {
        // Arrange
        const oStateData = {
            floatingContainer: {
                items: []
            }
        };
        sandbox.spy(DefaultStrategy, "set");
        // Act
        StrategyFactory.perform(oStateData, "floatingContainer.items", Operation.Set, ["item1"]);
        // Assert
        assert.strictEqual(DefaultStrategy.set.callCount, 1, "The strategy was called");
        assert.deepEqual(oStateData.floatingContainer.items, ["item1"], "The item was removed");
    });

    QUnit.module("List operations", {
        beforeEach: async function () {
            this.oStateData = {
                toolArea: {
                    visible: false,
                    items: []
                }
            };
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Fails for invalid path", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StrategyFactory.perform(this.oStateData, "toolArea.invalid", Operation.Add, "item1");
        }, "The strategy failed");
    });

    QUnit.test("Fails for values which are not an array", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StrategyFactory.perform(this.oStateData, "toolArea.visible", Operation.Add, "item1");
        }, "The strategy failed");
    });

    QUnit.test("Provides the reference to the actual list for 'Add'", async function (assert) {
        // Arrange
        sandbox.stub(DefaultStrategy, "add");
        const aExpectedList = this.oStateData.toolArea.items;
        // Act
        StrategyFactory.perform(this.oStateData, "toolArea.items", Operation.Add, "item1");
        // Assert
        const oActualList = DefaultStrategy.add.getCall(0).args[0];
        assert.strictEqual(oActualList, aExpectedList, "The actual list was provided");
    });

    QUnit.test("Provides the reference to the actual list for 'Remove'", async function (assert) {
        // Arrange
        sandbox.stub(DefaultStrategy, "remove");
        const aExpectedList = this.oStateData.toolArea.items;
        // Act
        StrategyFactory.perform(this.oStateData, "toolArea.items", Operation.Remove, "item1");
        // Assert
        const oActualList = DefaultStrategy.remove.getCall(0).args[0];
        assert.strictEqual(oActualList, aExpectedList, "The actual list was provided");
    });

    QUnit.module("Property operations", {
        beforeEach: async function () {
            this.oStateData = {
                toolArea: {
                    visible: false,
                    items: []
                }
            };
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Fails for invalid parent node in path", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StrategyFactory.perform(this.oStateData, "invalid.visible", Operation.Set, true);
        }, "The strategy failed");
    });

    QUnit.test("Fails for invalid leaf node in path", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StrategyFactory.perform(this.oStateData, "toolArea.invalid", Operation.Set, true);
        }, "The strategy failed");
    });

    QUnit.test("Fails for invalid root node in path", async function (assert) {
        // Act & Assert
        assert.throws(() => {
            StrategyFactory.perform(this.oStateData, "invalid", Operation.Set, true);
        }, "The strategy failed");
    });

    QUnit.test("Provides the reference to the actual object for a nested path", async function (assert) {
        // Arrange
        sandbox.stub(DefaultStrategy, "set");
        const aExpectedObject = this.oStateData.toolArea;
        // Act
        StrategyFactory.perform(this.oStateData, "toolArea.visible", Operation.Set, true);
        // Assert
        const oActualObject = DefaultStrategy.set.getCall(0).args[0];
        assert.strictEqual(oActualObject, aExpectedObject, "The actual object was provided");
    });

    QUnit.test("Provides the reference to the actual object for a root node", async function (assert) {
        // Arrange
        sandbox.stub(DefaultStrategy, "set");
        const aExpectedObject = this.oStateData;
        // Act
        StrategyFactory.perform(this.oStateData, "toolArea", Operation.Set, true);
        // Assert
        const oActualObject = DefaultStrategy.set.getCall(0).args[0];
        assert.strictEqual(oActualObject, aExpectedObject, "The actual object was provided");
    });
});

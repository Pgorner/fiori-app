// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StrategyFactory.FloatingContainerStrategy
 */
sap.ui.define([
    "sap/ushell/state/StrategyFactory/FloatingContainerStrategy"
], function (
    FloatingContainerStrategy
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("add", {
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds the value to an empty array", async function (assert) {
        // Arrange
        const aList = [];
        const aExpectedList = [
            "item1"
        ];
        // Act
        FloatingContainerStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Replaces all values", async function (assert) {
        // Arrange
        const aList = [
            "item2",
            "item10"
        ];
        const aExpectedList = [
            "item1"
        ];
        // Act
        FloatingContainerStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value replaced the list");
    });
});

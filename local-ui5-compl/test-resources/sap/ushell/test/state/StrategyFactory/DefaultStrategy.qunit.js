// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StrategyFactory.DefaultStrategy
 */
sap.ui.define([
    "sap/ushell/state/StrategyFactory/DefaultStrategy"
], function (
    DefaultStrategy
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
        DefaultStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.test("Does not do any sorting", async function (assert) {
        // Arrange
        const aList = [
            "item2"
        ];
        const aExpectedList = [
            "item2",
            "item1"
        ];
        // Act
        DefaultStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.test("Does not add duplicates", async function (assert) {
        // Arrange
        const aList = [
            "item1"
        ];
        const aExpectedList = [
            "item1"
        ];
        // Act
        DefaultStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.test("Does not add undefined", async function (assert) {
        // Arrange
        const aList = [];
        const aExpectedList = [];
        // Act
        DefaultStrategy.add(aList, undefined);
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.test("Does not add null", async function (assert) {
        // Arrange
        const aList = [];
        const aExpectedList = [];
        // Act
        DefaultStrategy.add(aList, null);
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.test("Adds objects", async function (assert) {
        // Arrange
        const aList = [];
        const aExpectedList = [
            { id: "item1" }
        ];
        // Act
        DefaultStrategy.add(aList, { id: "item1" });
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.module("remove", {
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Removes a item", async function (assert) {
        // Arrange
        const aList = [
            "item1"
        ];
        const aExpectedList = [];
        // Act
        DefaultStrategy.remove(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.test("Removes objects", async function (assert) {
        // Arrange
        const oItem = { id: "item1" };
        const aList = [
            oItem
        ];
        const aExpectedList = [];
        // Act
        DefaultStrategy.remove(aList, oItem);
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.test("Does not remove non-existent items", async function (assert) {
        // Arrange
        const aList = [
            "item1"
        ];
        const aExpectedList = [
            "item1"
        ];
        // Act
        DefaultStrategy.remove(aList, "item2");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The list has the expected values");
    });

    QUnit.module("set", {
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the value", async function (assert) {
        // Arrange
        const oNode = {
            property: "value"
        };
        const aExpectedNode = {
            property: "newValue"
        };
        // Act
        DefaultStrategy.set(oNode, "property", "newValue");
        // Assert
        assert.deepEqual(oNode, aExpectedNode, "The list has the expected values");
    });

    QUnit.test("Sets objects as value", async function (assert) {
        // Arrange
        const oNode = {
            property: "value"
        };
        const aExpectedNode = {
            property: {
                nested: "newValue"
            }
        };
        // Act
        DefaultStrategy.set(oNode, "property", { nested: "newValue" });
        // Assert
        assert.deepEqual(oNode, aExpectedNode, "The list has the expected values");
    });

    QUnit.test("undefined is valid value", async function (assert) {
        // Arrange
        const oNode = {
            property: "value"
        };
        const aExpectedNode = {
            property: undefined
        };
        // Act
        DefaultStrategy.set(oNode, "property", undefined);
        // Assert
        assert.deepEqual(oNode, aExpectedNode, "The list has the expected values");
    });

    QUnit.test("null is valid value", async function (assert) {
        // Arrange
        const oNode = {
            property: "value"
        };
        const aExpectedNode = {
            property: null
        };
        // Act
        DefaultStrategy.set(oNode, "property", null);
        // Assert
        assert.deepEqual(oNode, aExpectedNode, "The list has the expected values");
    });
});

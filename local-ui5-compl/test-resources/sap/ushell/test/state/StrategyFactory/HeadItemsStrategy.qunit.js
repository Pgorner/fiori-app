// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StrategyFactory.HeadItemsStrategy
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/state/StrategyFactory/HeadItemsStrategy"
], function (
    Element,
    HeadItemsStrategy
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("add", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
        },
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
        HeadItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Adds the value to an array and does NOT sort alphabetically", async function (assert) {
        // Arrange
        const aList = [
            "item2",
            "item10"
        ];
        const aExpectedList = [
            "item2",
            "item10",
            "item1"
        ];
        // Act
        HeadItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Adds custom item and applies sorting for specific items", async function (assert) {
        // Arrange
        const aList = [
            "item0",
            "backBtn"
        ];
        const aExpectedList = [
            "backBtn",
            "item0",
            "item1"
        ];
        // Act
        HeadItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does not add duplicate items", async function (assert) {
        // Arrange
        const aList = [
            "item1"
        ];
        const aExpectedList = [
            "item1"
        ];
        // Act
        HeadItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does not add items without control", async function (assert) {
        // Arrange
        Element.getElementById.returns(undefined);
        const aList = [];
        const aExpectedList = [];
        // Act
        HeadItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does not add items if it would exceed the maxLength", async function (assert) {
        // Arrange
        const aList = [
            "item2",
            "item3",
            "item4"
        ];
        const aExpectedList = [
            "item2",
            "item3",
            "item4"
        ];
        // Act
        HeadItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does add the backBtn even when maxLength is reached", async function (assert) {
        // Arrange
        const aList = [
            "item0",
            "item1",
            "item2"
        ];
        const aExpectedList = [
            "backBtn",
            "item0",
            "item1",
            "item2"
        ];
        // Act
        HeadItemsStrategy.add(aList, "backBtn");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StrategyFactory.HeadEndItemsStrategy
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/api/NewExperience",
    "sap/ushell/state/StrategyFactory/HeadEndItemsStrategy"
], function (
    Element,
    NewExperience,
    HeadEndItemsStrategy
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("add", {
        beforeEach: async function () {
            sandbox.stub(NewExperience, "getOverflowItemId").returns("newExperience");
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
        HeadEndItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Adds the value to an array and sorts it by name", async function (assert) {
        // Arrange
        const aList = [
            "item2",
            "item10"
        ];
        const aExpectedList = [
            "item1",
            "item10",
            "item2"
        ];
        // Act
        HeadEndItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Adds custom item and applies sorting for specific items", async function (assert) {
        // Arrange
        const aList = [
            "endItemsOverflowBtn",
            "copilotBtn",
            "NotificationsCountButton",
            "sap.das.webclientplugin.s4.shellitem",
            "sf",
            "productSwitchBtn",
            "sap.das.webclientplugin.workzone.shellitem",
            "userActionsMenuHeaderButton",
            "newExperience"
        ];
        const aExpectedList = [
            "newExperience",
            "sf",
            "sap.das.webclientplugin.s4.shellitem",
            "sap.das.webclientplugin.workzone.shellitem",
            "copilotBtn",
            "item1",
            "NotificationsCountButton",
            "endItemsOverflowBtn",
            "userActionsMenuHeaderButton",
            "productSwitchBtn"
        ];
        // Act
        HeadEndItemsStrategy.add(aList, "item1");
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
        HeadEndItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does not add items without control", async function (assert) {
        // Arrange
        Element.getElementById.returns(undefined);
        const aList = [];
        const aExpectedList = [];
        // Act
        HeadEndItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does not add items if it would exceed the maxLength", async function (assert) {
        // Arrange
        const aList = [
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11"
        ];
        const aExpectedList = [
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11"
        ];
        // Act
        HeadEndItemsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does add the overflowItem even when maxLength is reached", async function (assert) {
        // Arrange
        const aList = [
            "item0",
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9"
        ];
        const aExpectedList = [
            "item0",
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "endItemsOverflowBtn"
        ];
        // Act
        HeadEndItemsStrategy.add(aList, "endItemsOverflowBtn");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });
});

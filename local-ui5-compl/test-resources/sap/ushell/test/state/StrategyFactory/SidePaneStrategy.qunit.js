// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StrategyFactory.SidePaneStrategy
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/state/StrategyFactory/SidePaneStrategy"
], function (
    Element,
    SidePaneStrategy
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
        SidePaneStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Adds the value to an array without sorting", async function (assert) {
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
        SidePaneStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Pushes duplicate items to the end", async function (assert) {
        // Arrange
        const aList = [
            "item1",
            "item2"
        ];
        const aExpectedList = [
            "item2",
            "item1"
        ];
        // Act
        SidePaneStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does not add items without control", async function (assert) {
        // Arrange
        Element.getElementById.returns(undefined);
        const aList = [];
        const aExpectedList = [];
        // Act
        SidePaneStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Does not remove or replace items without control", async function (assert) {
        // Arrange
        Element.getElementById.returns(undefined);
        const aList = [
            "item1",
            "item2"
        ];
        const aExpectedList = [
            "item1",
            "item2"
        ];
        // Act
        SidePaneStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });
});

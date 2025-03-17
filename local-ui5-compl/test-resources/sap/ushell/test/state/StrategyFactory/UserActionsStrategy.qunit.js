// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StrategyFactory.UserActionsStrategy
 */
sap.ui.define([
    "sap/ushell/state/StrategyFactory/UserActionsStrategy"
], function (
    UserActionsStrategy
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
        UserActionsStrategy.add(aList, "item1");
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
        UserActionsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });

    QUnit.test("Adds custom item and applies sorting for specific items", async function (assert) {
        // Arrange
        const aList = [
            "logoutBtn",
            "userSettingsBtn",
            "openCatalogBtn",
            "frequentActivitiesBtn",
            "ActionModeBtn",
            "EditModeBtn",
            "recentActivitiesBtn",
            "ContactSupportBtn"
        ];
        const aExpectedList = [
            "recentActivitiesBtn",
            "frequentActivitiesBtn",
            "openCatalogBtn",
            "userSettingsBtn",
            "ActionModeBtn",
            "EditModeBtn",
            "ContactSupportBtn",
            "item1",
            "logoutBtn"
        ];
        // Act
        UserActionsStrategy.add(aList, "item1");
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
        UserActionsStrategy.add(aList, "item1");
        // Assert
        assert.deepEqual(aList, aExpectedList, "The value was added to the list");
    });
});

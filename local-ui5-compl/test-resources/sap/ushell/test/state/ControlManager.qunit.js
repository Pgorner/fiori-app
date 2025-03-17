// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.ControlManager
 */
sap.ui.define([
    "sap/m/Button",
    "sap/ushell/state/ControlManager",
    "sap/ushell/state/StateManager"
], function (
    Button,
    ControlManager,
    StateManager
) {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("destroyManagedControls", {
        beforeEach: async function () {
            this.oButton1 = new Button();
        },
        afterEach: async function () {
            sandbox.restore();
            this.oButton1.destroy();
            ControlManager.reset();
        }
    });

    QUnit.test("Destroys currentState controls", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        // Act
        ControlManager.destroyManagedControls();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), true, "The control was destroyed");
    });

    QUnit.test("Does not destroy updated currentState controls", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        ControlManager.updateManagedControl(this.oButton1.getId(), false);
        // Act
        ControlManager.destroyManagedControls();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), false, "The control was not destroyed");
    });

    QUnit.test("Does not destroy removed currentState controls", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        ControlManager.removeManagedControl(this.oButton1.getId());
        // Act
        ControlManager.destroyManagedControls();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), false, "The control was not destroyed");
    });

    QUnit.test("Does not destroy currentState controls for home", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), false, LaunchpadState.Home);
        // Act
        ControlManager.destroyManagedControls();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), false, "The control was not destroyed");
    });

    QUnit.test("Does not destroy baseState controls", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), false, LaunchpadState.App);
        // Act
        ControlManager.destroyManagedControls();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), false, "The control was not destroyed");
    });

    QUnit.test("Does not destroys currentState once they are related to a base state", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        ControlManager.addManagedControl(this.oButton1.getId(), false, LaunchpadState.App);
        // Act
        ControlManager.destroyManagedControls();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), false, "The control was not destroyed");
    });

    QUnit.module("flushList", {
        beforeEach: async function () {
            this.oButton1 = new Button();
        },
        afterEach: async function () {
            sandbox.restore();
            this.oButton1.destroy();
            ControlManager.reset();
        }
    });

    QUnit.test("Does not destroy currentState controls", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        // Act
        ControlManager.flushList();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), false, "The control was not destroyed");
    });

    QUnit.module("destroyManagedControl", {
        beforeEach: async function () {
            this.oButton1 = new Button();
        },
        afterEach: async function () {
            sandbox.restore();
            this.oButton1.destroy();
            ControlManager.reset();
        }
    });

    QUnit.test("Destroys a control", async function (assert) {
        // Act
        ControlManager.destroyManagedControl(this.oButton1.getId());
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), true, "The control not destroyed");
    });

    QUnit.test("Can handle non existent controls", async function (assert) {
        // Act
        ControlManager.destroyManagedControl("non-existent-id");
        // Assert
        assert.ok(true, "No error was thrown");
    });

    QUnit.module("storeList & restoreList", {
        beforeEach: async function () {
            this.oButton1 = new Button();
        },
        afterEach: async function () {
            sandbox.restore();
            this.oButton1.destroy();
            ControlManager.reset();
        }
    });

    QUnit.test("storeList adds an entry to storage", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        // Act
        ControlManager.storeList(oStorageEntry);
        // Assert
        assert.strictEqual(Object.keys(oStorageEntry).length, 1, "The storage entry was added");
    });

    QUnit.test("Restores and destroys a button", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        ControlManager.storeList(oStorageEntry);
        ControlManager.flushList();
        // Act
        ControlManager.restoreList(oStorageEntry);
        ControlManager.destroyManagedControls();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), true, "The control was destroyed");
    });

    QUnit.test("Restore does not fail for empty storage entry", async function (assert) {
        // Act
        ControlManager.restoreList();
        // Assert
        assert.ok(true, "No error was thrown");
    });

    QUnit.test("destroyFromStorage", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        ControlManager.storeList(oStorageEntry);
        ControlManager.flushList();
        // Act
        ControlManager.destroyFromStorage(oStorageEntry);
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), true, "The control was destroyed");
    });

    QUnit.test("Destroys stored currentState controls", async function (assert) {
        /*
         * This is an edge case where the control is created for a keepAlive
         * and another app is accessing the same control.
         *
         * Behavior: The control is attached to the lifecycle of the first app which is destroyed.
         */
        // Arrange
        const oStorageEntry = {};
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        ControlManager.storeList(oStorageEntry);
        ControlManager.flushList();
        // Act
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        ControlManager.destroyManagedControls();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), true, "The control was destroyed");
    });

    QUnit.module("destroy", {
        beforeEach: async function () {
            this.oButton1 = new Button();
        },
        afterEach: async function () {
            sandbox.restore();
            this.oButton1.destroy();
            ControlManager.reset();
        }
    });

    QUnit.test("Destroys currentState controls", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), true, LaunchpadState.App);
        // Act
        ControlManager.destroy();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), true, "The control was destroyed");
    });

    QUnit.test("Destroy baseState controls", async function (assert) {
        // Arrange
        ControlManager.addManagedControl(this.oButton1.getId(), false, LaunchpadState.App);
        // Act
        ControlManager.destroy();
        // Assert
        assert.strictEqual(this.oButton1.isDestroyed(), true, "The control was destroyed");
    });
});

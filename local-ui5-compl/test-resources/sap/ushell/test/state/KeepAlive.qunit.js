// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.KeepAlive
 */
sap.ui.define([
    "sap/ushell/state/ControlManager",
    "sap/ushell/state/CurrentState",
    "sap/ushell/state/KeepAlive"
], function (
    ControlManager,
    CurrentState,
    KeepAlive
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("store", {
        beforeEach: async function () {
            sandbox.stub(CurrentState, "storeState");
            sandbox.stub(ControlManager, "storeList");
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards the call to ControlManger", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        // Act
        KeepAlive.store(oStorageEntry);
        // Assert
        assert.strictEqual(ControlManager.storeList.callCount, 1, "storeList was called once");
        assert.strictEqual(ControlManager.storeList.firstCall.args[0], oStorageEntry, "storeList was called with the correct arguments");
    });

    QUnit.test("Forwards the call to CurrentState", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        // Act
        KeepAlive.store(oStorageEntry);
        // Assert
        assert.strictEqual(CurrentState.storeState.callCount, 1, "storeState was called once");
        assert.strictEqual(CurrentState.storeState.firstCall.args[0], oStorageEntry, "storeState     was called with the correct arguments");
    });

    QUnit.module("restore", {
        beforeEach: async function () {
            sandbox.stub(CurrentState, "restoreState");
            sandbox.stub(ControlManager, "restoreList");
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards the call to ControlManger", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        // Act
        KeepAlive.restore(oStorageEntry);
        // Assert
        assert.strictEqual(ControlManager.restoreList.callCount, 1, "restoreList was called once");
        assert.strictEqual(ControlManager.restoreList.firstCall.args[0], oStorageEntry, "restoreList was called with the correct arguments");
    });

    QUnit.test("Forwards the call to CurrentState", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        // Act
        KeepAlive.restore(oStorageEntry);
        // Assert
        assert.strictEqual(CurrentState.restoreState.callCount, 1, "restoreState was called once");
        assert.strictEqual(CurrentState.restoreState.firstCall.args[0], oStorageEntry, "restoreState     was called with the correct arguments");
    });

    QUnit.module("flush", {
        beforeEach: async function () {
            sandbox.stub(CurrentState, "flushState");
            sandbox.stub(ControlManager, "flushList");
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards the call to ControlManger", async function (assert) {
        // Act
        KeepAlive.flush();
        // Assert
        assert.strictEqual(ControlManager.flushList.callCount, 1, "flushList was called once");
    });

    QUnit.test("Forwards the call to CurrentState", async function (assert) {
        // Act
        KeepAlive.flush();
        // Assert
        assert.strictEqual(CurrentState.flushState.callCount, 1, "flushState was called once");
    });

    QUnit.module("destroy", {
        beforeEach: async function () {
            sandbox.stub(ControlManager, "destroyFromStorage");
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards the call to ControlManger", async function (assert) {
        // Arrange
        const oStorageEntry = {};
        // Act
        KeepAlive.destroy(oStorageEntry);
        // Assert
        assert.strictEqual(ControlManager.destroyFromStorage.callCount, 1, "destroyFromStorage was called once");
        assert.strictEqual(ControlManager.destroyFromStorage.firstCall.args[0], oStorageEntry, "destroyFromStorage was called with the correct arguments");
    });
});

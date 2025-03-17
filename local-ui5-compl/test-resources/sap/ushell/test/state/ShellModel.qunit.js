// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.ShellModel
 */
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/state/ShellModel"
], function (
    JSONModel,
    Config,
    ShellModel
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("Constructor", {
        beforeEach: async function () {
            sandbox.stub(Config, "createModel").returns(new JSONModel({
                config: true
            }));

            ShellModel.reset();
        },
        afterEach: async function () {
            sandbox.restore();
            ShellModel.reset();
        }
    });

    QUnit.test("Creates the config model", async function (assert) {
        // Arrange
        const oExpectedData = {
            config: true
        };
        // Act
        const oConfigModel = ShellModel.getConfigModel();
        // Assert
        assert.ok(oConfigModel.isA("sap.ui.model.Model"), "Config model created");

        assert.strictEqual(Config.createModel.callCount, 1, "Used the config for the config model");
        assert.deepEqual(oConfigModel.getData(), oExpectedData, "Config model created with the correct data");
    });

    QUnit.test("Creates the shell model", async function (assert) {
        // Arrange
        const oExpectedData = {};
        // Act
        const oShellModel = ShellModel.getModel();
        // Assert
        assert.ok(oShellModel.isA("sap.ui.model.Model"), "Shell model created");

        assert.deepEqual(oShellModel.getData(), oExpectedData, "Shell model created with the correct data");
        assert.notStrictEqual(oShellModel.refresh, JSONModel.refresh, "The model has a custom refresh method");
    });

    QUnit.test("The shell model is read only", async function (assert) {
        // Arrange
        const oShellModel = ShellModel.getModel();
        // Act & Assert
        assert.throws(() => {
            oShellModel.setData({ test: true });
        }, "setData throws an error");
        assert.throws(() => {
            oShellModel.setProperty("/test", true);
        }, "setProperty throws an error");
    });

    QUnit.test("The shell model cannot be forcefully refreshed", async function (assert) {
        // Arrange
        const oShellModel = ShellModel.getModel();
        // Act & Assert
        assert.throws(() => {
            oShellModel.refresh(true);
        }, "refresh throws an error");
    });

    QUnit.module("getModel", {
        beforeEach: async function () {
            sandbox.stub(Config, "createModel").returns(new JSONModel());
            ShellModel.reset();
        },
        afterEach: async function () {
            sandbox.restore();
            ShellModel.reset();
        }
    });

    QUnit.test("Returns the same model for multiple calls", async function (assert) {
        // Arrange
        const oShellModel = ShellModel.getModel();
        // Act
        const oShellModel2 = ShellModel.getModel();
        // Assert
        assert.strictEqual(oShellModel, oShellModel2, "The same model is returned");
    });

    QUnit.module("getConfigModel", {
        beforeEach: async function () {
            sandbox.stub(Config, "createModel").returns(new JSONModel());
            ShellModel.reset();
        },
        afterEach: async function () {
            sandbox.restore();
            ShellModel.reset();
        }
    });

    QUnit.test("Returns the same model for multiple calls", async function (assert) {
        // Arrange
        const oConfigModel = ShellModel.getConfigModel();
        // Act
        const oConfigModel2 = ShellModel.getConfigModel();
        // Assert
        assert.strictEqual(oConfigModel, oConfigModel2, "The same model is returned");
    });

    QUnit.module("updateModel", {
        beforeEach: async function () {
            sandbox.stub(Config, "createModel").returns(new JSONModel());
            ShellModel.reset();
        },
        afterEach: async function () {
            sandbox.restore();
            ShellModel.reset();
        }
    });

    QUnit.test("Updates the shell model data", async function (assert) {
        // Arrange
        const oExpectedData = {
            test: true
        };
        // Act
        ShellModel.updateModel({
            test: true
        });
        const oShellModel = ShellModel.getModel();
        // Assert
        assert.deepEqual(oShellModel.getData(), oExpectedData, "The shell model was updated correctly");
    });

    QUnit.module("destroy", {
        beforeEach: async function () {
            sandbox.stub(Config, "createModel").returns(new JSONModel());
            ShellModel.reset();
        },
        afterEach: async function () {
            sandbox.restore();
            ShellModel.reset();
        }
    });

    QUnit.test("Destroys the models", async function (assert) {
        // Arrange
        const oShellModel = ShellModel.getModel();
        sandbox.spy(oShellModel, "destroy");
        const oConfigModel = ShellModel.getConfigModel();
        sandbox.spy(oConfigModel, "destroy");
        // Act
        ShellModel.destroy();
        // Assert
        assert.strictEqual(oShellModel.destroy.callCount, 1, "The shell model was destroyed");
        assert.strictEqual(oConfigModel.destroy.callCount, 1, "The config model was destroyed");
    });
});

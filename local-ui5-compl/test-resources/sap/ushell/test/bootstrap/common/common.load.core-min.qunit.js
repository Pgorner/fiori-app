// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.load.core-min.js
 */
sap.ui.define([
    "sap/ushell/bootstrap/common/common.load.core-min",
    "sap/ushell/bootstrap/common/common.debug.mode",
    "sap/ushell/bootstrap/common/common.load.script",
    "sap/ui/core/Core"
], function (oCoreMinLoader, oDebugMode, oScriptLoader, Core) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap/ushell/bootstrap/common/common.load.core-min", {
        beforeEach: function () {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("should throw an error if no preload bundle configuration is provided", function (assert) {

        //Act
        try {
            oCoreMinLoader.load();
            assert.ok(false, "error is not thrown");
        } catch (oError) {
            assert.ok(oError !== undefined, "error is thrown");
            assert.strictEqual(oError.message, "Mandatory preload bundle configuration is not provided",
                "error message is correct"
            );
        }
    });

    QUnit.test("should boot the UI5 core if debug mode is true", function (assert) {
        var fnDone = assert.async();

        //Arrange
        var oIsDebugStub = sandbox.stub(oDebugMode, "isDebug").returns(true);
        var oLoadScriptStub = sandbox.stub(oScriptLoader, "loadScript");
        var oCoreBootStub = sandbox.stub(Core, "boot").callsFake(function () {
            evaluateAssertions();
            fnDone();
        });

        //Act
        oCoreMinLoader.load({});

        //Assert
        function evaluateAssertions () {
            assert.strictEqual(oIsDebugStub.callCount, 1, "isDebug() should be called exactly once");
            assert.strictEqual(oLoadScriptStub.callCount, 0, "common.load.script should not be called");
            assert.strictEqual(oCoreBootStub.callCount, 1, "core.boot() should be called exactly once");
        }
    });

    QUnit.test("should load configured coreResources if enabled and debug mode is false", function (assert) {

        //Arrange
        var oPreloadBundleConfig = {
            enabled: true,
            coreResources: [
                "first/core/bundle.js",
                "second/core/bundle.js"
            ]
        };
        var oIsDebugStub = sandbox.stub(oDebugMode, "isDebug").returns(false);
        var oLoadScriptStub = sandbox.stub(oScriptLoader, "loadScript");
        var oCoreBootStub = sandbox.stub(Core, "boot");
        var oToUrlStub = sandbox.stub(sap.ui.require, "toUrl").callsFake(function (sModule) {
            return "resources/" + sModule;
        });

        //Act
        oCoreMinLoader.load(oPreloadBundleConfig);

        //Assert
        assert.strictEqual(oIsDebugStub.callCount, 1, "isDebug() should be called exactly once");

        assert.strictEqual(oToUrlStub.callCount, 2, "sap.ui.require.toUrl should be called twice");
        assert.strictEqual(sap.ui.require.toUrl.getCall(0).args[0], "first/core/bundle.js",
            "common.load.script should be called with correct argument");
        assert.strictEqual(sap.ui.require.toUrl.getCall(1).args[0], "second/core/bundle.js",
            "common.load.script should be called with correct argument");

        assert.strictEqual(oLoadScriptStub.callCount, 2, "common.load.script should be called twice");
        assert.strictEqual(oLoadScriptStub.getCall(0).args[0], "resources/first/core/bundle.js",
            "common.load.script should be called with correct argument");
        assert.strictEqual(oLoadScriptStub.getCall(1).args[0], "resources/second/core/bundle.js",
            "common.load.script should be called with correct argument");

        assert.strictEqual(oCoreBootStub.callCount, 0, "core.boot() should not be called");
    });

});

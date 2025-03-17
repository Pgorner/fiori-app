// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for Ui5ComponentLoader's Utils
 */
sap.ui.define([
    "sap/ushell/services/Ui5ComponentLoader/utils",
    "sap/base/Log"
], function (
    oUi5ComponentLoaderUtils,
    Log
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("loadBundle", {
        beforeEach: function () {
            this.oLogErrorStub = sandbox.stub(Log, "error");

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Should not get executed when no parameter is provided", function (assert) {
        // Arrange

        // Act
        oUi5ComponentLoaderUtils.loadBundle();

        // Assert
        assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log.error has been called once");
        assert.strictEqual(this.oLogErrorStub.firstCall.args[0], "Ui5ComponentLoader: loadBundle called with invalid arguments", "Log.error was called with the correct argument");
    });

    QUnit.test("Should not get executed when an invalid parameter is provided", function (assert) {
        // Arrange

        // Act
        oUi5ComponentLoaderUtils.loadBundle("Not an array");

        // Assert
        assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log.error has been called once");
        assert.strictEqual(this.oLogErrorStub.firstCall.args[0], "Ui5ComponentLoader: loadBundle called with invalid arguments", "Log.error was called with the correct argument");
    });

    QUnit.test("Should load the correct resources when a valid bundle is provided", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oLoadJsResourceAsyncStub = sandbox.stub(sap.ui.loader._, "loadJSResourceAsync").returns(Promise.resolve());

        // Act
        var oLoadBundlePromise = oUi5ComponentLoaderUtils.loadBundle([
            "ValidResource",
            "AnotherValidResource"
        ]);

        // Assert
        oLoadBundlePromise.then(function () {
            assert.ok(true, "Promise resolved");
            assert.strictEqual(this.oLogErrorStub.callCount, 0, "No error log created");
            assert.strictEqual(oLoadJsResourceAsyncStub.callCount, 2, "loadJSResourceAsync called twice");
            assert.deepEqual(oLoadJsResourceAsyncStub.getCall(0).args, ["ValidResource"],
                "loadJSResourceAsync called with correct arguments in first call");
            assert.deepEqual(oLoadJsResourceAsyncStub.getCall(1).args, ["AnotherValidResource"],
                "loadJSResourceAsync called with correct arguments in second call");
            fnDone();
        }.bind(this));
    });

    QUnit.test("Should fail when at least one resource is invalid", function (assert) {
        // Arrange
        var fnDone = assert.async();
        sandbox.stub(sap.ui.loader._, "loadJSResourceAsync").callsFake(function (sResource) {
            return new Promise(function (resolve, reject) {
                if (sResource === "FailingResource") {
                    reject("Error from loadJSResourceAsync");
                } else {
                    resolve();
                }
            });
        });

        // Act
        var oLoadBundlePromise = oUi5ComponentLoaderUtils.loadBundle([
            "ValidResource",
            "FailingResource"
        ]);

        // Assert
        oLoadBundlePromise.then(function () {
            assert.ok(false, "Promise resolved");
            fnDone();
        }).catch(function (vError) {
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "Error log created");
            assert.deepEqual(this.oLogErrorStub.getCall(0).args,
            ["Ui5ComponentLoader: failed to load bundle resources: [ValidResource, FailingResource]"], "Error message is correct");
            assert.strictEqual(vError, "Error from loadJSResourceAsync", "Error from loadJSResourceAsync is preserved");
            fnDone();
        }.bind(this));
    });

});

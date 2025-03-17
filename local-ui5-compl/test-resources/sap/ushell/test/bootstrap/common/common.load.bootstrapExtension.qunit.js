// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.load.bootstrapExtension.js
 */
sap.ui.define([
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.load.bootstrapExtension"
], function (testUtils, fnLoadBootstrapExtension) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap/ushell/bootstrap/common/common.load.bootstrapExtensio", {
        beforeEach: function () {
            this.oRequireStub = sandbox.stub(sap.ui, "require");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("should not load module if bootstrap is not defined in the config", function (assert) {
        //Arrange
        //Act
        fnLoadBootstrapExtension({});

        //Assert
        assert.equal(this.oRequireStub.callCount, 0, "sap.ui.require should not be called");
    });

    QUnit.test("should not load module if extensionModule is not string", function (assert) {
        //Arrange
        //Act
        fnLoadBootstrapExtension({
            bootstrap: {
                extensionModule: ["module1", "module2"]
            }
        });

        //Assert
        assert.equal(this.oRequireStub.callCount, 0, "sap.ui.require should not be called");
    });

    QUnit.test("load the extensionModule", function (assert) {
        //Arrange
        this.oRequireStub.callsFake(function (aModules, fnCallBack) {
            fnCallBack(null);
        });
        //Act
        fnLoadBootstrapExtension({
            bootstrap: {
                extensionModule: "some.test.module"
            }
        });

        //Assert
        assert.equal(this.oRequireStub.callCount, 1, "sap.ui.require should not be called");
        assert.deepEqual(
            this.oRequireStub.getCall(0).args[0],
            ["some/test/module"],
            "The correct module was loaded"
        );
    });

    QUnit.test("load and execute the extensionModule", function (assert) {
        //Arrange
        var fnFakeModule = sandbox.stub();
        this.oRequireStub.callsFake(function (aModules, fnCallBack) {
            fnCallBack(fnFakeModule);
        });
        //Act
        fnLoadBootstrapExtension({
            bootstrap: {
                extensionModule: "some.test.module"
            }
        });

        //Assert
        assert.equal(this.oRequireStub.callCount, 1, "sap.ui.require should not be called");
        assert.deepEqual(
            this.oRequireStub.getCall(0).args[0],
            ["some/test/module"],
            "The correct module was loaded"
        );
        assert.equal(fnFakeModule.callCount, 1, "The bootstrap module was executed");
    });
});

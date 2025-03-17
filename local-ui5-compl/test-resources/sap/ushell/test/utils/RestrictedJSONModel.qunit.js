// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.RestrictedJSONModel
 */
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/utils/RestrictedJSONModel"
], function (JSONModel, RestrictedJSONModel) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("The constructor", {
        beforeEach: function () {
            this.oStub = sandbox.stub(JSONModel.prototype, "constructor").callsFake(function () {
                this.setDefaultBindingMode = function (sMode) {
                    this.DefaultBindingMode = sMode;
                };
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the super function", function (assert) {
        //Arrange
        var oData = { Test: "Test" };
        //Act
        this.oModel = new RestrictedJSONModel(oData);

        //Assert
        assert.ok(this.oStub.alwaysCalledWithExactly({ Test: "Test" }), "Super function was called with the right parameters");
        assert.strictEqual(this.oModel.DefaultBindingMode, "OneWay", "setBindingDefault was successfully set to OneWay");
        assert.strictEqual(this.oStub.callCount, 1, "Super function was called exactly once");
    });

    QUnit.test("Sets the size limit", function (assert) {
        //Arrange
        var oData = { Test: "Test" };
        //Act
        this.oModel = new RestrictedJSONModel(oData);

        //Assert
        assert.strictEqual(this.oModel.iSizeLimit, 1000, "The size limit was set to 1000");
    });

    QUnit.module("setData function", {
        beforeEach: function () {
            this.oModel = new RestrictedJSONModel();
            this.oStub = sandbox.stub(JSONModel.prototype, "setData");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Is not supported", function (assert) {
        //Act and assert
        assert.throws(
            function () {
                this.oModel.setData({ Test: "Test" });
            }.bind(this),
            "and throws an error"
        );
    });

    QUnit.test("_setData calls the super function", function (assert) {
        //Arrange
        //Act
        this.oModel._setData({ Test: "Test" }, false);

        //Assert
        assert.ok(this.oStub.alwaysCalledWithExactly({ Test: "Test" }, false), "Super function was called with the right parameters");
        assert.strictEqual(this.oStub.callCount, 1, "Super function was called exactly once");
    });

    QUnit.module("setJSON function", {
        beforeEach: function () {
            this.oModel = new RestrictedJSONModel();
            this.oStub = sandbox.stub(JSONModel.prototype, "setJSON");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Is not supported", function (assert) {
        //Act and assert
        assert.throws(
            function () {
                this.oModel.setJSON({ Test: "Test" }, true);
            }.bind(this),
            "and throws an error"
        );
    });

    QUnit.test("_setJSON calls the super function", function (assert) {
        //Arrange
        //Act
        this.oModel._setJSON({ Test: "Test" }, true);

        //Assert
        assert.ok(this.oStub.alwaysCalledWithExactly({ Test: "Test" }, true),
            "Super function was called with the right parameters");
        assert.strictEqual(this.oStub.callCount, 1, "Super function was called exactly once");
    });

    QUnit.module("setProperty function", {
        beforeEach: function () {
            this.oModel = new RestrictedJSONModel();
            this.oStub = sandbox.stub(JSONModel.prototype, "setProperty");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Is not supported", function (assert) {
        //Act and assert
        assert.throws(
            function () {
                this.oModel.setProperty("/Test", true, undefined, true);
            }.bind(this),
            "and throws an error"
        );
    });

    QUnit.test("_setProperty calls the super function", function (assert) {
        //Arrange
        //Act
        this.oModel._setProperty("/Test", true, undefined, true);

        //Assert
        assert.ok(this.oStub.alwaysCalledWithExactly("/Test", true, undefined, true),
            "Super function was called with the right parameters");
        assert.strictEqual(this.oStub.callCount, 1, "Super function was called exactly once");
    });

    QUnit.module("loadData function", {
        beforeEach: function () {
            this.oModel = new RestrictedJSONModel();
            this.oStub = sandbox.stub(JSONModel.prototype, "loadData");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Is not supported", function (assert) {
        //Act and assert
        assert.throws(
            function () {
                this.oModel.loadData("testUrl", {}, false, "testType", false, false, {});
            }.bind(this),
            "and throws an error"
        );
    });
});

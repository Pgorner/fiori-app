// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/XMLView",
    "sap/base/Log",
    "sap/ushell/components/shell/Settings/userAccount/UserAccountEntry",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (
    XMLView,
    Log,
    UserAccountEntry,
    Config,
    resources,
    Container
) {
    "use strict";

    /* global QUnit sinon */
    var sandbox = sinon.sandbox.create();

    QUnit.module("UserAccountEntry", {
        beforeEach: function () {
            this.fnGetShellConfigStub = sandbox.stub();
            this.sFullname = "Firstname Lastname";

            this.fnXMLViewCreate = sandbox.stub(XMLView, "create");
            this.fnLogWarningSpy = sandbox.spy(Log, "warning");
            sandbox.stub(Container, "getRendererInternal").returns({
                getShellConfig: this.fnGetShellConfigStub
            });
            sandbox.stub(Container, "getUser").returns({
                getFullName: sandbox.stub().returns(this.sFullname)
            });
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("Check contract property", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        // Act
        var oContract = UserAccountEntry.getEntry();
        // Assert
        assert.equal(oContract.entryHelpID, "userAccountEntry", "entryHelpID is correct");
        assert.equal(oContract.title, resources.i18n.getText("UserAccountFld"), "title is correct");
        assert.equal(oContract.valueResult, null, "valueResult is null");
        assert.equal(oContract.contentResult, null, "contentResult is null");
        assert.equal(oContract.icon, "sap-icon://account", "icon is correct");
        assert.equal(oContract.provideEmptyWrapper, true, "provideEmptyWrapper is correct");
        assert.equal(oContract.valueArgument, this.sFullname, "valueArgument is correct");
        assert.equal(typeof oContract.contentFunc, "function", "contentFunc is function");
        assert.equal(typeof oContract.onSave, "function", "onSave is function");
        assert.equal(typeof oContract.onCancel, "function", "onCancel is function");
    });

    QUnit.test("contentFunc: create userAccountSetting view", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        this.fnXMLViewCreate.resolves({});
        var oExpectedView = {
            id: "userAccountSetting",
            viewName: "sap.ushell.components.shell.Settings.userAccount.UserAccountSetting"
        };
        // Act
        var oContract = UserAccountEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.deepEqual(oView, {}, "The view was returned");
            assert.ok(this.fnXMLViewCreate.calledOnce, "create xml view was called");
            assert.deepEqual(this.fnXMLViewCreate.getCall(0).args, [oExpectedView], "The userAccountSetting was created");
        }.bind(this));
    });

    QUnit.test("contentFunc: create userAccountSelector view", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: true
        });
        this.fnXMLViewCreate.resolves({});
        var oExpectedView = {
            id: "userAccountSelector",
            viewName: "sap.ushell.components.shell.Settings.userAccount.UserAccountSelector"
        };
        // Act
        var oContract = UserAccountEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.deepEqual(oView, {}, "The view was returned");
            assert.ok(this.fnXMLViewCreate.calledOnce, "create xml view was called");
            assert.deepEqual(this.fnXMLViewCreate.getCall(0).args, [oExpectedView], "The userAccountSetting was created");
        }.bind(this));
    });

    QUnit.test("onSave: resolve promise when view was not created", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        // Act
        var oContract = UserAccountEntry.getEntry();
        return oContract.onSave().then(function () {
            // Assert
            assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved when no view");
        });
    });

    QUnit.test("onSave: call the onSave from controller", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        var oController = {
            onSave: sandbox.stub().resolves()
        };
        this.fnXMLViewCreate.resolves({
            getController: sandbox.stub().returns(oController)
        });
        // Act
        var oContract = UserAccountEntry.getEntry();
        return oContract.contentFunc().then(function () {
            return oContract.onSave();
        }).then(function () {
            // Assert
            assert.ok(oController.onSave.calledOnce, "onSave of the controller was called");
        }, function () {
            assert.ok(false, "The promise should be resolved when no view");
        });
    });

    QUnit.test("onCancel: resolve promise when view was not created", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        // Act
        var oContract = UserAccountEntry.getEntry();
        oContract.onCancel();
        // Assert
        assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
    });

    QUnit.test("onCancel: call the onCancel from controller", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        var oController = {
            onCancel: sandbox.stub().resolves()
        };
        this.fnXMLViewCreate.resolves({
            getController: sandbox.stub().returns(oController)
        });
        // Act
        var oContract = UserAccountEntry.getEntry();
        return oContract.contentFunc().then(function () {
            oContract.onCancel();
            // Assert
            assert.ok(oController.onCancel.calledOnce, "onCancel of the controller was called");
        });
    });
});

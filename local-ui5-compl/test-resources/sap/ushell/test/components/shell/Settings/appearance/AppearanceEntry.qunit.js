// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/XMLView",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/shell/Settings/appearance/AppearanceEntry",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (XMLView, Log, jQuery, AppearanceEntry, resources, Container) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    var THEME_LIST = [
        { id: "test_id", name: "Some theme" },
        { id: "user_theme", name: "User theme name" },
        { id: "sap_belize", name: "SAP Belize" }
    ];

    QUnit.module("AppearanceEntry", {
        beforeEach: function () {
            this.fnXMLViewCreate = sandbox.stub(XMLView, "create");
            this.fnLogWarningSpy = sandbox.spy(Log, "warning");

            this.fngGetThemeList = sandbox.stub();
            this.fnGetUserTheme = sandbox.stub();

            sandbox.stub(Container, "getServiceAsync").resolves({
                getThemeList: this.fngGetThemeList
            });
            sandbox.stub(Container, "getUser").returns({
                getTheme: this.fnGetUserTheme
            });
        },
        afterEach: function () {
            this.fnXMLViewCreate.restore();
            this.fnLogWarningSpy.restore();
            sandbox.restore();
        }
    });

    QUnit.test("Check contract property", function (assert) {
        // Arrange

        // Act
        var oContract = AppearanceEntry.getEntry();

        // Assert
        assert.equal(oContract.id, "themes", "id is correct");
        assert.equal(oContract.entryHelpID, "themes", "entryHelpID is correct");
        assert.equal(oContract.title, resources.i18n.getText("Appearance"), "title is correct");
        assert.equal(oContract.valueResult, null, "valueResult is null");
        assert.equal(oContract.contentResult, null, "contentResult is null");
        assert.equal(oContract.icon, "sap-icon://palette", "icon is correct");
        assert.equal(oContract.provideEmptyWrapper, undefined, "provideEmptyWrapper is correct");
        assert.equal(typeof oContract.valueArgument, "function", "valueArgument is correct");
        assert.equal(typeof oContract.contentFunc, "function", "contentFunc is function");
        assert.equal(typeof oContract.onSave, "function", "onSave is function");
        assert.equal(typeof oContract.onCancel, "function", "onCancel is function");
    });

    QUnit.test("valueArgument: return empty string when getThemeList is rejected", function (assert) {
        // Arrange
        this.fngGetThemeList.returns((new jQuery.Deferred()).reject({}));
        this.fnGetUserTheme.returns("user_theme");
        // Act
        var oContract = AppearanceEntry.getEntry();

        return oContract.valueArgument().then(function (sThemeName) {
            // Assert
            assert.equal(sThemeName, "", "The empty string is reterned");
        });
    });

    QUnit.test("valueArgument: return the name of user theme and cache the theme list", function (assert) {
        // Arrange
        this.fngGetThemeList.returns((new jQuery.Deferred()).resolve({
            options: THEME_LIST
        }));
        this.fnGetUserTheme.returns("user_theme");
        // Act
        var oContract = AppearanceEntry.getEntry();
        return oContract.valueArgument().then(function (sThemeName) {
            // Assert
            assert.equal(sThemeName, "User theme name", "The correct theme name is returned");
            return oContract.valueArgument();
        }).then(function (sThemeName) {
            assert.equal(sThemeName, "User theme name", "The correct theme name is returned");
            assert.ok(this.fngGetThemeList.calledOnce, "getThemeList should be called once");
        }.bind(this));
    });

    QUnit.test("contentFunc: create Appearance view", function (assert) {
        // Arrange
        this.fngGetThemeList.returns((new jQuery.Deferred()).resolve({
            options: THEME_LIST
        }));
        this.fnXMLViewCreate.resolves({});
        var oExpectedView = {
            id: "userPrefThemeSelector",
            viewName: "sap.ushell.components.shell.Settings.appearance.Appearance",
            viewData: {
                themeList: THEME_LIST,
                themeSets: [],
                themeRoot: undefined
            }
        };
        // Act
        var oContract = AppearanceEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.deepEqual(oView, {}, "The view was returned");
            assert.ok(this.fnXMLViewCreate.calledOnce, "create xml view was called");
            assert.deepEqual(this.fnXMLViewCreate.getCall(0).args, [oExpectedView], "The userAccountSetting was created");
        }.bind(this));
    });

    QUnit.test("onSave: resolve promise when view was not created", function (assert) {
        // Arrange
        // Act
        var oContract = AppearanceEntry.getEntry();
        return oContract.onSave().then(function () {
            // Assert
            assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved when no view");
        });
    });

    QUnit.test("onSave: call the onSave from controller", function (assert) {
        // Arrange
        var oController = {
            onSave: sinon.stub().resolves()
        };
        this.fnXMLViewCreate.resolves({
            getController: sinon.stub().returns(oController)
        });
        // Act
        var oContract = AppearanceEntry.getEntry();
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
        // Act
        var oContract = AppearanceEntry.getEntry();
        oContract.onCancel();
        // Assert
        assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
    });

    QUnit.test("onCancel: call the onCancel from controller", function (assert) {
        // Arrange
        var oController = {
            onCancel: sinon.stub().resolves()
        };
        this.fnXMLViewCreate.resolves({
            getController: sinon.stub().returns(oController)
        });
        // Act
        var oContract = AppearanceEntry.getEntry();
        return oContract.contentFunc().then(function () {
            oContract.onCancel();
            // Assert
            assert.ok(oController.onCancel.calledOnce, "onCancel of the controller was called");
        });
    });
});

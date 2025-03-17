// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.controller.MyHome.controller
 */
sap.ui.define([
    "sap/ui/core/mvc/XMLView",
    "sap/m/MessageBox",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (
    XMLView,
    MessageBox,
    resources,
    Container
) {
    "use strict";
    /* global QUnit, sinon */
    var sandbox = sinon.createSandbox({});

    function noop () {
        return null;
    }

    // Mock the UserInfo service:
    var oUser = {
        getImportBookmarksFlag: noop,
        setImportBookmarksFlag: noop,
        resetChangedProperty: noop
    };

    QUnit.module("The MyHomeStart view", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync").resolves({
                updateUserPreferences: noop,
                getUser: function () {
                    return oUser;
                }
            });
            sandbox.stub(resources.i18n, "getText").returnsArg(0);
            this.oOnEditStub = sandbox.stub();
            this.oOnOpenDialogStub = sandbox.stub();

            this.oMessageBoxStub = sandbox.stub(MessageBox, "information");
            sandbox.stub(sap.ui, "require").callsFake(function (aModules, fnCallback) {
                if (aModules.length && aModules.length === 1 && aModules[0] === "sap/m/MessageBox") {
                    fnCallback(MessageBox);
                    return undefined;
                }
                return sap.ui.require.wrappedMethod.apply(this, arguments);
            });

            return XMLView.create({
                viewName: "sap.ushell.components.pages.view.MyHomeStart"
            }).then(function (view) {
                this.oView = view;
                this.oController = view.getController();
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("has the i18n model set", function (assert) {
        // Assert
        assert.ok(this.oView.getModel("i18n"), "The i18n model was set to the view.");
    });

    QUnit.test("onEditPress calls the given onEdit callback", function (assert) {
        // Arrange
        this.oController.connect({
            onEdit: this.oOnEditStub
        });
        // Act
        this.oController.onEditPress();

        // Assert
        assert.strictEqual(this.oOnEditStub.callCount, 1, "The onEdit callback was called.");
    });

    QUnit.test("onImportDialogPress calls the given onEdit callback", function (assert) {
        // Arrange
        this.oController.connect({
            onOpenDialog: this.oOnOpenDialogStub
        });
        // Act
        this.oController.onImportDialogPress();

        // Assert
        assert.strictEqual(this.oOnOpenDialogStub.callCount, 1, "The oOnOpenDialogStub callback was called.");
    });

    QUnit.test("onMessageStripClose opens popup", function (assert) {
        // Act
        this.oController.onMessageStripClose();

        // Assert
        assert.ok(this.oMessageBoxStub.calledOnce, "The oMessageBoxStub callback was called once.");
        assert.strictEqual(
            this.oMessageBoxStub.firstCall.args[0],
            "MyHome.InitialPage.MessageStrip.Popup",
            "The oMessageBoxStub callback was called with the correct i18n key."
        );
    });
});

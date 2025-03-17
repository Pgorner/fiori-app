// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.SendAsEmailButton
 */
sap.ui.define([
    "sap/m/library",
    "sap/ui/thirdparty/jquery",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/SendAsEmailButton",
    "sap/ushell/state/ShellModel"
], function (
    mobileLibrary,
    jQuery,
    JSONModel,
    Container,
    ushellResources,
    SendAsEmailButton,
    ShellModel
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    var URLHelper = mobileLibrary.URLHelper;

    QUnit.module("sap.ushell.ui.footerbar.SendAsEmailButton", {
        beforeEach: function () {
            this.oShellModel = new JSONModel();
            sandbox.stub(ShellModel, "getModel").returns(this.oShellModel);

            this.oSendAsEmailButton = new SendAsEmailButton();
            sandbox.stub(URLHelper, "triggerEmail");
            return Container.init("local")
                .then(function () {
                    sandbox.stub(Container, "getServiceAsync").returns(new jQuery.Deferred().resolve({
                        setAppStateToPublic: sinon.stub().returns(new jQuery.Deferred().resolve("SendAsEmailButton test"))
                    }));
                });
        },
        afterEach: function () {
            this.oSendAsEmailButton.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("fire press event - with no url Config", function (assert) {
        // Arrange
        var aExpectedParameters = [
            [
                null,
                ushellResources.i18n.getText("linkToApplication"),
                "SendAsEmailButton test"
            ]
        ];

        // Act
        this.oSendAsEmailButton.firePress();

        // Assert
        assert.deepEqual(URLHelper.triggerEmail.args, aExpectedParameters, "URL Helper trigger Email was called with the correct parameters.");
    });

    QUnit.test("fire press event - with a changed url in the Config", function (assert) {
        // Arrange
        this.oShellModel.setProperty("/application", { title: "test app" });
        var aExpectedParameters = [
            [
                null,
                ushellResources.i18n.getText("linkTo") + " 'test app'",
                "SendAsEmailButton test"
            ]
        ];

        // Act
        this.oSendAsEmailButton.firePress();

        // Assert
        assert.deepEqual(URLHelper.triggerEmail.args, aExpectedParameters, "URL Helper trigger Email was called with the correct parameters.");
    });

    QUnit.test("fire press event - with no title in the Config", function (assert) {
        // Arrange
        this.oShellModel.setProperty("/application", { });
        var aExpectedParameters = [
            [
                null,
                ushellResources.i18n.getText("linkToApplication"),
                "SendAsEmailButton test"
            ]
        ];

        // Act
        this.oSendAsEmailButton.firePress();

        // Assert
        assert.deepEqual(URLHelper.triggerEmail.args, aExpectedParameters, "URL Helper trigger Email was called with the correct parameters.");
    });

    QUnit.test("fire press event - with beforePressHandler function attached", function (assert) {
        // Arrange
        this.oSendAsEmailButton.setBeforePressHandler(sandbox.stub());

        // Act
        this.oSendAsEmailButton.firePress();

        // Assert
        assert.strictEqual(this.oSendAsEmailButton.getBeforePressHandler().callCount, 1, "beforePressHandler function was called once.");
    });

    QUnit.test("fire press event - with afterPressHandler function attached", function (assert) {
        // Arrange
        this.oSendAsEmailButton.setAfterPressHandler(sandbox.stub());

        // Act
        this.oSendAsEmailButton.firePress();

        // Assert
        assert.strictEqual(this.oSendAsEmailButton.getAfterPressHandler().callCount, 1, "afterPressHandler function was called once.");
    });
});

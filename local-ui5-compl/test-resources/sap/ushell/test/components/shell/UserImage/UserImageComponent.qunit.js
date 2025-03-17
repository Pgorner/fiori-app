// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.userImage.userImage
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/components/shell/UserImage/Component"
], function (
    Container,
    UserImageComponent
) {
    "use strict";

    /* global sinon QUnit */

    const sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.components.shell.userImage", {
        beforeEach: function () {
            this.oRendererMock = {
                _oShellView: {
                    getViewData: sandbox.stub()
                }
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);

            this.oUserMock = {
                getImage: sandbox.stub(),
                getImageConsent: sandbox.stub(),
                attachOnSetImage: sandbox.stub()
            };
            sandbox.stub(Container, "getUser").returns(this.oUserMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("load Component", function (assert) {
        // Act
        const oComponent = new UserImageComponent();

        // Assert
        assert.ok(oComponent, "UserImageComponent loaded");
    });

    QUnit.test("feature is off", function (assert) {
        // Arrange
        this.oRendererMock._oShellView.getViewData.returns({ config: { enableUserImgConsent: false } });
        this.oUserMock.getImageConsent.returns(true);
        const userStateChanged = sinon.stub(UserImageComponent.prototype, "_showUserConsentPopup");

        // Act
        const oComponent = new UserImageComponent();

        // Assert
        assert.ok(oComponent, "UserImageComponent loaded");
        assert.ok(userStateChanged.notCalled, "switch user state is called once");
    });
});

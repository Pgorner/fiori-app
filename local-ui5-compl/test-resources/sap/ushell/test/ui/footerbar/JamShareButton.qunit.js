// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.JamShareButton
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/collaboration/components/fiori/sharing/dialog/Component",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/JamShareButton",
    "sap/m/Text",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/Component",
    "sap/ushell/Container"
], function (
    ObjectPath,
    SharingComponent,
    AppRuntimeService,
    resources,
    JamShareButton,
    Text,
    jQuery,
    CoreComponent,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("sap.ushell.ui.footerbar.JamShareButton", {
        beforeEach: function () {
            sandbox.stub(Container, "getUser");
        },
        afterEach: function () {
            sandbox.restore();
        }
    }
 );

    QUnit.test("Constructor Test", function (assert) {
        var oJamShareButton = new JamShareButton();
        assert.strictEqual(oJamShareButton.getIcon(), "sap-icon://share-2", "Check button icon");
        assert.strictEqual(oJamShareButton.getText(), resources.i18n.getText("shareBtn"), "Check button title");
    });

    QUnit.test("showShareDialog Test", function (assert) {
        sandbox.spy(CoreComponent, "create");
        var oShareDialogOpenStub = sandbox.stub(SharingComponent.prototype, "open");

        this.oJamShareButton = new JamShareButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new Text({ text: "Test title" }),
                    share: "sharing"
                }
            }
        });

        return this.oJamShareButton.showShareDialog()
            .then(function () {
                assert.ok(CoreComponent.create.calledOnce, "the create function of the CoreComponent was called once");
                assert.ok(oShareDialogOpenStub.calledOnce, "the open function of the share dialog component was called once");

                var oUsedArguments = CoreComponent.create.firstCall.args[0];
                assert.strictEqual(oUsedArguments.name, "sap.collaboration.components.fiori.sharing.dialog", "the expected component name was set.");
                assert.strictEqual(oUsedArguments.settings.object.id, window.location.href, "the expected id was set.");
                assert.strictEqual(oUsedArguments.settings.object.display.getText(), "Test title", "the expected text was set.");
                assert.strictEqual(oUsedArguments.settings.object.share, "sharing", "the expected share was set.");
            })
            .catch(function () {
                assert.ok(false, "Promise resolved");
            });
    });

    QUnit.test("showShareDialog in Work Zone, standard edition (fka cFLP) Test", function (assert) {
        var done = assert.async();

        sandbox.spy(CoreComponent, "create");
        sandbox.stub(SharingComponent.prototype, "createContent");

        var oJamShareButton = new JamShareButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new Text({ text: "Test title" }),
                    share: "sharing"
                }
            }
        });

        sandbox.stub(AppRuntimeService, "sendMessageToOuterShell").returns(
            new jQuery.Deferred().resolve("www.flp.com").promise()
        );

        sandbox.stub(Container, "inAppRuntime").returns(true);
        var oGetFLPUrlSpy = sandbox.stub(Container, "getFLPUrl").callsFake(function (bIncludeHash) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Container.getFLPUrl", {
                bIncludeHash: bIncludeHash
            });
        });

        sandbox.stub(SharingComponent.prototype, "open").callsFake(function () {
            assert.ok(AppRuntimeService.sendMessageToOuterShell.calledOnce, "sendMessageToOuterShell should be called only once");
            assert.ok(oGetFLPUrlSpy.calledOnce, "getFLPUrl should be called only once");

            assert.ok(CoreComponent.create.calledOnce, "the create function of the CoreComponent was called once");

            var oUsedArguments = CoreComponent.create.firstCall.args[0];
            assert.strictEqual(oUsedArguments.settings.object.id, "www.flp.com", "the expected id was set.");
            assert.strictEqual(oUsedArguments.settings.object.display.getText(), "Test title", "the expected text was set.");
            assert.strictEqual(oUsedArguments.settings.object.share, "sharing", "the expected share was set.");

            done();
        });

        oJamShareButton.showShareDialog();
    });

    QUnit.test("adjustFLPUrl", function (assert) {
        var done = assert.async();
        var oJamShareButton = new JamShareButton();

        sandbox.stub(AppRuntimeService, "sendMessageToOuterShell").returns(
            new jQuery.Deferred().resolve("www.flp.com").promise()
        );

        var oGetFLPUrlStub = sandbox.stub(Container, "getFLPUrl").callsFake(function (bIncludeHash) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Container.getFLPUrl", {
                bIncludeHash: bIncludeHash
            });
        });

        var oJamData = {
            object: {
                id: window.location.href,
                share: "static text to share in JAM together with the URL"
            }
        };

        oJamShareButton.adjustFLPUrl(oJamData).then(function () {
            assert.ok(AppRuntimeService.sendMessageToOuterShell.calledOnce, "sendMessageToOuterShell should be called only once");
            assert.ok(oGetFLPUrlStub.calledOnce, "getFLPUrl should be called only once");
            assert.strictEqual(oJamData.object.id, "www.flp.com");
            assert.strictEqual(oJamData.object.share, "static text to share in JAM together with the URL");
            done();
        });
    });
});

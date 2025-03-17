// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.MessagingHelper.
 */
sap.ui.define([
    "sap/ushell/components/MessagingHelper",
    "sap/ushell/Container",
    "sap/ushell/resources"
], function (
    oMessagingHelper,
    Container,
    ushellResources
) {
    "use strict";

    /* global QUnit, sinon */

    var oGetTextStub;

    QUnit.module("sap.ushell.components.MessagingHelper", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    oGetTextStub = sinon.stub(ushellResources.i18n, "getText");
                    done();
                });
        },
        afterEach: function () {
            oGetTextStub.restore();
        }
    });

    QUnit.test("i18n.getText should be called when getLocalizedText is called", function (assert) {
        var sMsg = "test_message",
            aParams = ["param1", "param2"];
        oMessagingHelper.getLocalizedText(sMsg, aParams);
        assert.ok(oGetTextStub.calledOnce, "ushellResources.i18n.getText should be called");
        assert.equal(oGetTextStub.getCall(0).args[0], sMsg, "sMsg should be the first argument");
        assert.deepEqual(oGetTextStub.getCall(0).args[1], aParams, "aParams should be the second argument");
    });

    QUnit.test("showLocalizedMessage: call show with default type", function (assert) {
        var fnDone = assert.async();
        var sMsg = "test_message",
            oShowStub;

        Container.getServiceAsync("MessageInternal")
            .then(function (oMessageService) {
                oShowStub = sinon.stub(oMessageService, "show");
                oMessagingHelper.showLocalizedMessage(sMsg);
                return oMessageService;
            })
            .then(function (oMessageService) {
                assert.ok(oShowStub.calledOnce, "show method should called once");
                assert.equal(oShowStub.getCall(0).args[0], oMessageService.Type.INFO, "Message type should be INFO");
                oShowStub.restore();

                fnDone();
            });
    });

    QUnit.test("showLocalizedError: call show with error type", function (assert) {
        var fnDone = assert.async();
        var sMsg = "test_message",
            oShowStub;

        Container.getServiceAsync("MessageInternal")
            .then(function (oMessageService) {
                oShowStub = sinon.stub(oMessageService, "show");
                oMessagingHelper.showLocalizedError(sMsg);
                return oMessageService;
            })
            .then(function (oMessageService) {
                assert.ok(oShowStub.calledOnce, "show method should called once");
                assert.equal(oShowStub.getCall(0).args[0], oMessageService.Type.ERROR, "Message type should be ERROR");
                oShowStub.restore();

                fnDone();
            });
    });

    QUnit.test("showLocalizedErrorHelper should return the wrapper of showLocalizedError", function (assert) {
        var fnDone = assert.async();
        var sMsg = "test_message",
            oShowStub,
            fnWrapper;

        Container.getServiceAsync("MessageInternal")
            .then(function (oMessageService) {
                oShowStub = sinon.stub(oMessageService, "show");
                fnWrapper = oMessagingHelper.showLocalizedErrorHelper(sMsg);
                assert.equal(typeof fnWrapper, "function", "showLocalizedErrorHelper should return closure");
                fnWrapper();
                return oMessageService;
            })
            .then(function (oMessageService) {
                assert.ok(oShowStub.calledOnce, "show method should called once");
                assert.equal(oShowStub.getCall(0).args[0], oMessageService.Type.ERROR, "Message type should be INFO");
                oShowStub.restore();

                fnDone();
            });
    });
});

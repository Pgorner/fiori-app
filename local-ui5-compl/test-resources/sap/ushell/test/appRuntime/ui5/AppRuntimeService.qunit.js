// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.AppRuntimeService
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr"
], function (AppRuntimeService, AppCommunicationMgr) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("sap.ushell.appRuntime.ui5.AppRuntimeService");

    var arrTests = [{
            input: {
                sMessageId: "sap.ushell.services.dummy1",
                oParams: {},
                sRequestId: "1111"
            },
            output: {
                response: {
                    data: '{"type":"response","service":"sap.ushell.services.dummy1","request_id":"1111","status":"success","body":{"result": {"a": 1}}}',
                    origin: "test"
                },
                type: "success"
            }
        }, {
            input: {
                sMessageId: "sap.ushell.services.dummy2",
                oParams: {},
                sRequestId: "2222"
            },
            output: {
                response: {
                    data: '{"type":"response","service":"sap.ushell.services.dummy1","request_id":"2222","status":"fail","body":{"a": "0"}}',
                    origin: "test"
                },
                type: "fail"
            }
        }];

    arrTests.forEach(function (oFixture) {
        QUnit.test("Test sendMessageToOuterShell", function (assert) {
            const done = assert.async();
            var getTargetWindowSinon = sinon.stub(AppCommunicationMgr, "_getTargetWindow").returns({
                postMessage: function () {
                    setTimeout(function () {
                        AppCommunicationMgr._handleMessageEvent(AppCommunicationMgr, oFixture.output.response);
                    }, 200);
                }
            });

            AppRuntimeService.sendMessageToOuterShell(
                oFixture.input.sMessageId,
                oFixture.input.oParams,
                oFixture.input.sRequestId).done(function (response) {
                assert.ok(oFixture.output.type === "success", "request should be success");
                done();
            }).fail(function () {
                assert.ok(oFixture.output.type === "fail", "request should be fail");
                done();
            });

            getTargetWindowSinon.restore();
        });
    });

    arrTests.forEach(function (oFixture) {
        QUnit.test("Test postMessageToFLP", function (assert) {
            const done = assert.async();
            var getTargetWindowSinon = sinon.stub(AppCommunicationMgr, "_getTargetWindow").returns({
                postMessage: function () {
                    setTimeout(function () {
                        AppCommunicationMgr._handleMessageEvent(AppCommunicationMgr, oFixture.output.response);
                    }, 200);
                }
            });

            var oPromise = AppRuntimeService.postMessageToFLP(
                oFixture.input.sMessageId,
                oFixture.input.oParams,
                oFixture.input.sRequestId);

            assert.ok(!oPromise.hasOwnProperty("done"));
            assert.ok(!oPromise.hasOwnProperty("fail"));

            oPromise.then((response) => {
                    assert.ok(oFixture.output.type === "success", "request should be success");
                    done();
                }, () => {
                    assert.ok(oFixture.output.type === "fail", "request should be fail");
                    done();
                });

            getTargetWindowSinon.restore();
        });
    });
});




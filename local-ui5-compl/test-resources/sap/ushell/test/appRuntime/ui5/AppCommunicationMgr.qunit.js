// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.AppCommunicationMgr
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/base/Log",
    "sap/base/util/isEmptyObject",
    "sap/ui/thirdparty/jquery"
], function (
    AppCommunicationMgr,
    Log,
    isEmptyObject,
    jQuery
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.appRuntime.ui5.AppCommunicationMgr", {
        beforeEach: function () {
            // Do not use the parent window as it may not be the same instance in some cases
            sandbox.stub(AppCommunicationMgr, "_getTargetWindow").returns(window);
            sandbox.stub(AppCommunicationMgr, "_isTrustedPostMessageSource").returns(true);
        },
        afterEach: function () {
            AppCommunicationMgr.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("test postMessage", function (assert) {
        var done = assert.async();

        var fnHandleMessageEvent = function (oContainer, oMessage) {
            var oMessageData = JSON.parse(oMessage.data);

            assert.strictEqual(oMessageData.a, 1, "ApplicationContainer.postMessage - Message successfully passed");
            removeEventListener("message", fnHandleMessageEvent);

            done();
        }.bind(null, {});
        addEventListener("message", fnHandleMessageEvent);

        AppCommunicationMgr.postMessage({
            a: 1
        });
    });

    QUnit.test("test sendMessageToOuterShell", async function (assert) {
        var fnHandleMessageEvent = function (oContainer, oMessage) {
            removeEventListener("message", fnHandleMessageEvent);

            var oMessageData = JSON.parse(oMessage.data);

            function calculateReply (oMessageData) {
                return oMessageData.body.x + oMessageData.body.y;
            }
            const oResponse = {
                type: "response",
                service: oMsg.service,
                request_id: oMsg.request_id,
                status: "success",
                body: {
                    result: {
                        result: calculateReply(oMessageData)
                    }
                }
            };
            window.postMessage(JSON.stringify(oResponse), "*");
        }.bind(null, {});
        addEventListener("message", fnHandleMessageEvent);

        const oMsg = {
            service: "test.add",
            body: { x: 1, y: 2 },
            request_id: "1111"
        };

        AppCommunicationMgr.init();

        const oResult = await AppCommunicationMgr.sendMessageToOuterShell(oMsg.service, oMsg.body, oMsg.request_id);
        assert.strictEqual(oResult.result, 3, "ApplicationContainer.postMessage - Result successfully passed to IFrame");
    });

    QUnit.test("test sendMessageToOuterShell with empty body", async function (assert) {
        var fnHandleMessageEvent = function (oContainer, oMessage) {
            removeEventListener("message", fnHandleMessageEvent);

            var oMessageData = JSON.parse(oMessage.data);

            function calculateReply (oMessageData) {
                if (isEmptyObject(oMessageData.body)) {
                    return "ok";
                }
                return "NOT ok";
            }
            const oResponse = {
                type: "response",
                service: oMsg.service,
                request_id: oMsg.request_id,
                status: "success",
                body: {
                    result: {
                        result: calculateReply(oMessageData)
                    }
                }
            };
            window.postMessage(JSON.stringify(oResponse), "*");
        }.bind(null, {});
        addEventListener("message", fnHandleMessageEvent);

        const oMsg = {
            service: "test.noInput",
            body: {},
            request_id: "2222"
        };

        AppCommunicationMgr.init();

        const oResult = await AppCommunicationMgr.sendMessageToOuterShell(oMsg.service, oMsg.body, oMsg.request_id);
        assert.strictEqual(oResult.result, "ok", "ApplicationContainer.postMessage - Result successfully passed to IFrame");
    });

    QUnit.test("test _handleMessageEvent", function (assert) {
        var done = assert.async();

        AppCommunicationMgr.init();

        AppCommunicationMgr.registerCommHandlers({
            "sap.ushell.services.appLifeCycle": {
                oServiceCalls: {
                    subscribe: {
                        executeServiceCallFn: function () {
                            return new jQuery.Deferred().resolve({
                                action: "subscribe"
                            }).promise();
                        }
                    }
                }
            },
            "qunit.test": {
                oServiceCalls: {
                    add: {
                        executeServiceCallFn: function (oServiceParams) {
                            var x = oServiceParams.oMessageData.body.x;
                            var y = oServiceParams.oMessageData.body.y;
                            return new jQuery.Deferred().resolve(x + y).promise();
                        }
                    }
                }
            }
        });

        var fnHandleMessageEvent = function (oContainer, oMessage) {
            var oMessageData = JSON.parse(oMessage.data);
            if (oMessageData && oMessageData.type && oMessageData.type === "request") {
                return;
            }
            if (oMessageData && oMessageData.type && oMessageData.type === "response") {
                if (oMessageData.service === "sap.ushell.services.appLifeCycle.subscribe") {
                    assert.strictEqual(oMessageData.body.result.action, "subscribe", "ApplicationContainer.handleMessageEvent - Result successfully passed to IFrame");
                } else {
                    assert.strictEqual(oMessageData.body.result, 5, "ApplicationContainer.handleMessageEvent - Result successfully passed to IFrame");
                }

                window.removeEventListener("message", fnHandleMessageEvent);
                done();
            }
        }.bind(null, {});

        window.addEventListener("message", fnHandleMessageEvent);

        window.postMessage('{"type":"request","request_id":"1234","service":"qunit.test.add","body":{"x":2, "y":3}}', "*");
    });

    [
        {
            input: {
                oMessage: {
                    source: window,
                    data: '{"type":"request","request_id":"1111","service":"qunit.test.add","body":{"x": 1, "y": 2}}',
                    origin: "*"
                },
                oMessageData: {
                    service: "qunit.test.add",
                    body: { x: 1, y: 2 },
                    request_id: "1111",
                    type: "request"
                }
            },
            output: {
                result: 3,
                status: "success"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("test _handleMessageRequest - valid message", function (assert) {
            var done = assert.async();

            AppCommunicationMgr.init();

            AppCommunicationMgr.registerCommHandlers({
                "qunit.test": {
                    oServiceCalls: {
                        add: {
                            executeServiceCallFn: function (oServiceParams) {
                                var x = oServiceParams.oMessageData.body.x;
                                var y = oServiceParams.oMessageData.body.y;
                                return new jQuery.Deferred().resolve(x + y).promise();
                            }
                        }
                    }
                }
            });

            var fnHandleMessageEvent = function (oContainer, oMessage) {
                var oMessageData = JSON.parse(oMessage.data);
                if (oMessageData && oMessageData.type && oMessageData.type === "request") {
                    return;
                }
                if (oMessageData && oMessageData.type && oMessageData.type === "response") {
                    assert.strictEqual(oFixture.output.status, oMessageData.status, "ApplicationContainer._handleMessageRequest - The request status received as expected");

                    if (oMessageData.status === "success") {
                        assert.strictEqual(oFixture.output.result, oMessageData.body.result, "ApplicationContainer._handleMessageRequest - Result successfully passed to IFrame");
                    } else if (oMessageData.status === "error") {
                        assert.strictEqual(oFixture.output.result, oMessageData.body.message, "ApplicationContainer._handleMessageRequest - Error message successfully passed to IFrame");
                    }

                    done();
                    removeEventListener("message", fnHandleMessageEvent);
                }
            }.bind(null, {});
            addEventListener("message", fnHandleMessageEvent);

            AppCommunicationMgr._handleMessageRequest(AppCommunicationMgr, oFixture.input.oMessage, oFixture.input.oMessageData);
        });
    });

    QUnit.test("test _handleMessageRequest - error message", function (assert) {
        var fnWarning = sinon.spy(Log, "warning");

        AppCommunicationMgr.init();

        AppCommunicationMgr._handleMessageRequest(AppCommunicationMgr, {
            source: window,
            data: '{"type":"request","request_id":"1111","service":"wrong.service","body":{"x": 1, "y": 2}}',
            origin: "*"
        }, {
            service: "wrong.service", //wrong service was sent
            body: { x: 1, y: 2 },
            request_id: "1111",
            type: "request"
        });

        assert.ok(fnWarning.calledOnce, "Log warining called 1 times");
        assert.ok(fnWarning.getCall(0).args[0].indexOf("App Runtime received message with unknown service name (wrong.service)") >= 0, "Log warning text correct");

        fnWarning.restore();
    });
});

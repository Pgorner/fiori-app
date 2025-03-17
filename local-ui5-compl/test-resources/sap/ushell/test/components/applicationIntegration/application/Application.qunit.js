// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.application.Application
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/components/applicationIntegration/application/Application",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ui/base/ManagedObject"
], function (EventBus, Application, PostMessageUtils, ManagedObject) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("sap.ushell.test.components.applicationIntegration.configuration.AppMeta");

    [{
        testDescription: "no parameters is valid",
        input: {
            oTargetResolution: {}
        },
        expected: {
            oTargetResolution: {},
            oTempTarget: {},
            bOK: true
        }
    }, {
        testDescription: "all parameters are valid",
        input: {
            oTargetResolution: {
                visible: true,
                additionalInformation: "1234",
                url: "abcd1234"
            }
        },
        expected: {
            oTargetResolution: {
                visible: true,
                additionalInformation: "1234",
                url: "abcd1234"
            },
            oTempTarget: {},
            bOK: true
        }
    }, {
        testDescription: "one invalid parameter",
        input: {
            oTargetResolution: { aaaa: false }
        },
        expected: {
            oTargetResolution: {},
            oTempTarget: { aaaa: false },
            bOK: true
        }
    }, {
        testDescription: "several invalid parameters",
        input: {
            oTargetResolution: {
                aaaa: false,
                bbbb: true,
                cccc: false
            }
        },
        expected: {
            oTargetResolution: {},
            oTempTarget: {
                aaaa: false,
                bbbb: true,
                cccc: false
            },
            bOK: true
        }
    }, {
        testDescription: "mix of valid and invalid parameters",
        input: {
            oTargetResolution: {
                aaaa: false,
                visible: true,
                bbbb: true,
                additionalInformation: "abcd",
                url: "12345678"
            }
        },
        expected: {
            oTargetResolution: {
                visible: true,
                additionalInformation: "abcd",
                url: "12345678"
            },
            oTempTarget: {
                aaaa: false,
                bbbb: true
            },
            bOK: true
        }
    }].forEach(function (oFixture) {
        QUnit.test("createApplicationContainer without error in log - " + oFixture.testDescription, function (assert) {
            var oAppCont,
                bOK = true,
                consoleStub = sinon.stub(console, "trace").callsFake(function (bVal, sVal) {
                    if (sVal && sVal.includes("ManagedObject.apply: encountered unknown setting")) {
                        bOK = false;
                    }
                }),
                oRestoreTargetResolutionStub = sinon.stub(Application, "_restoreTargetResolution"),
                oApplySettingsStub = sinon.spy(ManagedObject.prototype, "applySettings");

            Application.init({
                addNewBlueBox: function () { }
            });

            oAppCont = Application.createApplicationContainer("a.b.c", oFixture.input.oTargetResolution);
            assert.ok(bOK === oFixture.expected.bOK, "error message written to the console when it should not");
            assert.ok(oApplySettingsStub.calledWith(oFixture.expected.oTargetResolution, undefined), "wrong parameters to application container constructor");
            assert.ok(oRestoreTargetResolutionStub.calledWith(oFixture.input.oTargetResolution, oFixture.expected.oTempTarget), "wrong parameters to _restoreTargetResolution");
            consoleStub.restore();
            oAppCont.destroy();
            oRestoreTargetResolutionStub.restore();
            oApplySettingsStub.restore();
        });
    });
    QUnit.test("check that 'sap.ushell' 'appKeepAliveDeactivate' is called", function (assert) {
        var oApp = {
            app: "application"
        };

        // EventBus
        var oPublishStub = sinon.stub();
        var oGetEventBusStub = sinon.stub(EventBus, "getInstance").returns({
            publish: oPublishStub
        });
        Application.store(oApp);
        assert.strictEqual(oPublishStub.callCount, 1, "One event was published.");
        oGetEventBusStub.restore();
    });
    QUnit.test("check that 'sap.ushell' 'appKeepAliveActivate' is called", function (assert) {
        var oApp = {
            app: "application"
        };

        // EventBus
        var oPublishStub = sinon.stub();
        var oGetEventBusStub = sinon.stub(EventBus, "getInstance").returns({
            publish: oPublishStub
        });
        Application.restore(oApp);
        assert.strictEqual(oPublishStub.callCount, 1, "One event was published.");
        oGetEventBusStub.restore();
    });

    QUnit.test("check that postMessageToIframeApp is called in store", function (assert) {
        var oApp = {
                container: {
                    _getIFrame: function () { return {}; }
                }
            },
            oObj = {};

        var oPostMessageUtils = {
            postMessageToIframeApp: sinon.stub()
        };
        Application.init({}, oPostMessageUtils);

        Application.store(oApp);
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.callCount, 1, "Postmessage was called");
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[0], oApp.container, "param1 was ok");
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[1], "sap.ushell.appRuntime", "param2 was ok");
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[2], "keepAliveAppHide", "param3 was ok");
        assert.deepEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[3], oObj, "param4 was ok");
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[4], false, "param5 was ok");
    });

    QUnit.test("check that postMessageToIframeApp is called in restore", function (assert) {
        var oApp = {
                container: {
                    _getIFrame: function () { return {}; }
                }
            },
            oObj = {};

        var oPostMessageUtils = {
            postMessageToIframeApp: sinon.stub()
        };
        Application.init({}, oPostMessageUtils);

        Application.restore(oApp);
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.callCount, 1, "Postmessage was called");
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[0], oApp.container, "param1 was ok");
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[1], "sap.ushell.appRuntime", "param2 was ok");
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[2], "keepAliveAppShow", "param3 was ok");
        assert.deepEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[3], oObj, "param4 was ok");
        assert.strictEqual(oPostMessageUtils.postMessageToIframeApp.firstCall.args[4], false, "param5 was ok");
    });
});

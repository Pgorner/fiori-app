// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.renderers.fiori2.AccessKeysAgent
 */
sap.ui.define([
    "sap/ui/Device",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/AccessKeysAgent"

], function (
    Device,
    AppRuntimeService,
    AccessKeysAgent
) {
    "use strict";

    /* global sinon, QUnit*/

    // should run only once
    AccessKeysAgent.init();

    QUnit.module("sap.ushell.appRuntime.ui5.renderers.fiori2.AccessKeysAgent", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    [{
        testDesc: "ALT + A",
        input: {
            key: {
                altKey: true,
                ctrlKey: false,
                shiftKey: false,
                keyCode: 65,
                keyChar: "A"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "ALT + F",
        input: {
            key: {
                altKey: true,
                ctrlKey: false,
                shiftKey: false,
                keyCode: 70,
                keyChar: "F"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "ALT + H",
        input: {
            key: {
                altKey: true,
                ctrlKey: false,
                shiftKey: false,
                keyCode: 72,
                keyChar: "H"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "ALT + M",
        input: {
            key: {
                altKey: true,
                ctrlKey: false,
                shiftKey: false,
                keyCode: 77,
                keyChar: "M"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "ALT + N",
        input: {
            key: {
                altKey: true,
                ctrlKey: false,
                shiftKey: false,
                keyCode: 78,
                keyChar: "N"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "ALT + S",
        input: {
            key: {
                altKey: true,
                ctrlKey: false,
                shiftKey: false,
                keyCode: 83,
                keyChar: "S"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "CTRL + COMMA",
        input: {
            key: {
                altKey: false,
                ctrlKey: true,
                shiftKey: false,
                keyCode: 188,
                keyChar: ","
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "CTRL + F1",
        input: {
            key: {
                altKey: false,
                ctrlKey: true,
                shiftKey: false,
                keyCode: 112,
                keyChar: "F1"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "CTRL + S",
        input: {
            key: {
                altKey: false,
                ctrlKey: true,
                shiftKey: false,
                keyCode: 83,
                keyChar: "S"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "CTRL + SHIFT + F",
        input: {
            key: {
                altKey: false,
                ctrlKey: true,
                shiftKey: true,
                keyCode: 70,
                keyChar: "F"
            }
        },
        result: { bDelegated: true }
    }, {
        testDesc: "F",
        input: {
            key: {
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                keyCode: 70,
                keyChar: "F"
            }
        },
        result: { bDelegated: false }
    }].forEach(function (oFixture) {
        QUnit.test("test hotkeys calling postmessage for: " + oFixture.testDesc, function (assert) {
            var done = assert.async();
            if (Device.browser.name === "cr") {
                var oSendMsgStub = sinon.stub(AppRuntimeService, "postMessageToFLP");

                // IE doesn't support creating the KeyboardEvent object with a the "new" constructor, hence if this will fail, it will be created
                // using the document object- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
                // This KeyboardEvent has a constructor, so checking for its ecsitaance will not solve this, hence, only solution found is try-catch
                var oEvent;
                try {
                    oEvent = new KeyboardEvent("keydown", oFixture.input.key);
                } catch (err) {
                    var IEevent = document.createEvent("KeyboardEvent"),
                        sSpecialKeys = "";
                    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/initKeyboardEvent
                    if (oFixture.input.key.altKey) {
                        sSpecialKeys += "Alt ";
                    }
                    if (oFixture.input.key.ctrlKey) {
                        sSpecialKeys += "Control ";
                    }
                    if (oFixture.input.key.shiftKey) {
                        sSpecialKeys += "Shift ";
                    }
                    IEevent.initKeyboardEvent("keydown", false, false, null, oFixture.input.key.keyChar, oFixture.input.key.keyCode, sSpecialKeys, 0, false);
                    oEvent = IEevent;
                }
                document.dispatchEvent(oEvent);

                setTimeout(function () {
                    done();
                    assert.strictEqual(oSendMsgStub.calledOnce, oFixture.result.bDelegated, "key delegated");
                    oSendMsgStub.restore();
                }, 100);
            } else {
                done();
                assert.ok(true, "");
            }
        });
    });
});

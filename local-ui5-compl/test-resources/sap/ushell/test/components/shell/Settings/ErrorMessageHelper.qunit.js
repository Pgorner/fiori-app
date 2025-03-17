// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Messaging"
], function (
    Messaging
) {
    "use strict";

    /* global QUnit sinon*/

    var ErrorMessageHelper;
    var fakeData = {
        messages: [],
        removedMessages: []
    };
    sinon.stub(Messaging, "getMessageModel").returns({
        getData: function () {
            return fakeData.messages;
        }
    });
    sinon.stub(Messaging, "removeMessages").callsFake(function (message) {
        fakeData.removedMessages.push(message);
    });

    QUnit.module("Functions", {
        beforeEach: function (assert) {
            var goOn = assert.async();

            sap.ui.require([
                "sap/ushell/components/shell/Settings/ErrorMessageHelper"
            ], function (
                ErrorMessageHelperModule
            ) {
                ErrorMessageHelper = ErrorMessageHelperModule;
                goOn();
            });
        },

        afterEach: function () {
            fakeData = {
                messages: [],
                removedMessages: []
            };
        }
    });

    QUnit.test("filterMessagesToDisplay - w/ message, w/o target", function (assert) {
        fakeData.messages = [{
            getTargets: function () {
                return undefined;
            }
        }];

        var receivedMessages = ErrorMessageHelper.filterMessagesToDisplay();
        assert.strictEqual(receivedMessages.length, 0, "No message returned");
    });

    QUnit.test("filterMessagesToDisplay - w/ message, w/ target", function (assert) {
        fakeData.messages = [{
            getTargets: function () {
                return "sapUshellSettingsDialog/BlaBlub";
            }
        }];

        var receivedMessages = ErrorMessageHelper.filterMessagesToDisplay();
        assert.strictEqual(receivedMessages.length, 1, "One message returned");
    });

    QUnit.test("filterMessagesToDisplay - w/ messages, w/ different target", function (assert) {
        fakeData.messages = [{
            getTargets: function () {
                return undefined;
            }
        }, {
            getTargets: function () {
                return "sapUshellSettingsDialog/BlaBlub";
            }
        }, {
            getTargets: function () {
                return "somethingElse/Gugelhupf";
            }
        }];

        var receivedMessages = ErrorMessageHelper.filterMessagesToDisplay();
        assert.strictEqual(receivedMessages.length, 1, "One message returned");
    });

    QUnit.test("removeErrorMessages - w/ message, w/o target", function (assert) {
        fakeData.messages = [{
            getTargets: function () {
                return undefined;
            }
        }];

        ErrorMessageHelper.removeErrorMessages();
        assert.strictEqual(fakeData.removedMessages.length, 0, "Nothing removed");
    });

    QUnit.test("removeErrorMessages - w/ message, w/ target", function (assert) {
        fakeData.messages = [{
            getTargets: function () {
                return "sapUshellSettingsDialog/BlaBlub";
            }
        }];

        ErrorMessageHelper.removeErrorMessages();
        assert.strictEqual(fakeData.removedMessages.length, 1, "One message removed");
    });

    QUnit.test("removeErrorMessages - w/o message", function (assert) {
        ErrorMessageHelper.removeErrorMessages();
        assert.strictEqual(fakeData.removedMessages.length, 0, "No message removed");
        assert.ok(Array.isArray(fakeData.removedMessages) === true, "Still an array");
    });

    QUnit.test("removeErrorMessages - w/ messages, different targets", function (assert) {
        fakeData.messages = [{
            getTargets: function () {
                return undefined;
            }
        }, {
            getTargets: function () {
                return "sapUshellSettingsDialog/BlaBlub";
            }
        }, {
            getTargets: function () {
                return "somethingElse/Gugelhupf";
            }
        }];

        ErrorMessageHelper.removeErrorMessages();
        assert.strictEqual(fakeData.removedMessages.length, 1, "One message removed");
    });
});

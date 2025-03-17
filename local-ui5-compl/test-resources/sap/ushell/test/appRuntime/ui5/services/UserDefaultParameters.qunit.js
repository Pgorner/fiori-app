// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.UserInfo
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/services/Container"

], function (AppRuntimeService, Container) {
    "use strict";
    /* global sinon, QUnit */

    var sandbox = sinon.sandbox.create({});

    window["sap-ushell-config"] = {
        services: {
            UserDefaultParameters: {
                module: "sap.ushell.appRuntime.ui5.services.UserDefaultParameters",
                adapter: {
                    module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                }
            }
        }
    };

    QUnit.module("sap.ushell.test.appRuntime.ui5.services.UserDefaultParameters", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve("testValue");

            this.oSendMessageToOuterShellStub = sandbox.stub(AppRuntimeService, "sendMessageToOuterShell").returns(oDeferred.promise());

            Container.init("local").then(function () {
                Container.getServiceAsync("UserDefaultParameters").then(function (UserDefaultParameters) {
                    this.oUserDefaultParameters = UserDefaultParameters;
                    fnDone();
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
        }
    });
    QUnit.test("getValue", function (assert) {
        var fnDone = assert.async();

        this.oUserDefaultParameters.getValue("testParam").then(function (sValue) {
            assert.strictEqual(sValue, "testValue", "The value was returned.");
            assert.strictEqual(this.oSendMessageToOuterShellStub.callCount, 1, "sendMessageToOuterShell was called once.");
            assert.deepEqual(this.oSendMessageToOuterShellStub.firstCall.args, [
                "sap.ushell.services.UserDefaultParameters.getValue",
                { sParameterName: "testParam" }
            ], "sendMessageToOuterShell was called with the expected parameters.");
            fnDone();
        }.bind(this));
    });

});

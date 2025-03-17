// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.ShellUIService
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/appRuntime/ui5/services/Container",
    "sap/ushell/appRuntime/ui5/services/ShellUIService",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/ushell/utils/UrlParsing"
], function (
    EventBus,
    Container,
    ShellUIService,
    AppRuntimeService,
    AppCommunicationMgr,
    AppRuntimeContext,
    UrlParsing
) {
    "use strict";

    /* global sinon, QUnit */
    var sandbox = sinon.createSandbox({});
    var oShellUIServiceInstance = new ShellUIService();


    QUnit.module("sap.ushell.test.appRuntime.ui5.services.ShellUIService", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            Container.init("local").then(fnDone);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("setBackNavigation - registerCommHandlers called once", function (assert) {
        sandbox.stub(AppRuntimeService, "postMessageToFLP");
        sandbox.stub(AppCommunicationMgr, "registerCommHandlers");

        oShellUIServiceInstance.setBackNavigation();
        assert.deepEqual(AppRuntimeService.postMessageToFLP.getCall(0).args, ["sap.ushell.ui5service.ShellUIService.setBackNavigation", {
            callbackMessage: {
                service: "sap.ushell.appRuntime.handleBackNavigation"
            }
        }], "");
        oShellUIServiceInstance.setBackNavigation();
        assert.strictEqual(AppCommunicationMgr.registerCommHandlers.callCount, 1, "registerCommHandlers called 1 time");
        assert.deepEqual(AppRuntimeService.postMessageToFLP.getCall(1).args, ["sap.ushell.ui5service.ShellUIService.setBackNavigation", {
            callbackMessage: {
                service: "sap.ushell.appRuntime.handleBackNavigation"
            }
        }], "");
        oShellUIServiceInstance.setBackNavigation(function () {});
        assert.ok(AppRuntimeService.postMessageToFLP.calledWith("sap.ushell.ui5service.ShellUIService.setBackNavigation", {
            callbackMessage: {
                service: "sap.ushell.appRuntime.handleBackNavigation"
            }
        }), "");
        assert.deepEqual(AppRuntimeService.postMessageToFLP.getCall(2).args, ["sap.ushell.ui5service.ShellUIService.setBackNavigation", {
            callbackMessage: {
                service: "sap.ushell.appRuntime.handleBackNavigation"
            }
        }], "");
    });

    [
        {
            name: "setHierarchy",
            func: oShellUIServiceInstance.setHierarchy
        }, {
            name: "setRelatedApps",
            func: oShellUIServiceInstance.setRelatedApps
        }
    ].forEach(function (oTest) {
        QUnit.test("call " + oTest.name + " - not scube", function (assert) {
            var done = assert.async();

            AppRuntimeContext.setIsScube(false);
            sandbox.spy(AppRuntimeContext, "getIsScube");
            sandbox.stub(AppRuntimeService, "postMessageToFLP");
            sandbox.stub(Container, "getServiceAsync");

            oShellUIServiceInstance.setHierarchy([{}]).then(function () {
                assert.strictEqual(AppRuntimeContext.getIsScube.callCount, 1);
                assert.strictEqual(AppRuntimeService.postMessageToFLP.callCount, 1);
                assert.strictEqual(Container.getServiceAsync.callCount, 0);
                done();
            });
        });
    });

    [{
        name: "setHierarchy",
        func: oShellUIServiceInstance.setHierarchy
    }, {
        name: "setRelatedApps",
        func: oShellUIServiceInstance.setRelatedApps
    }].forEach(function (oTest) {
        QUnit.test("call " + oTest.name + " - scube", function (assert) {
            var done = assert.async();

            AppRuntimeContext.setIsScube(false);
            sandbox.spy(AppRuntimeContext, "getIsScube");
            sandbox.stub(AppRuntimeService, "postMessageToFLP");
            sandbox.stub(Container, "getServiceAsync");

            oTest.func([{}]).then(function () {
                assert.strictEqual(AppRuntimeContext.getIsScube.callCount, 1);
                assert.strictEqual(AppRuntimeService.postMessageToFLP.callCount, 1);
                assert.strictEqual(Container.getServiceAsync.callCount, 0);
                done();
            });
        });
    });

    [{
        name: "setHierarchy",
        func: oShellUIServiceInstance.setHierarchy,
        msg: "sap.ushell.services.ShellUIService.setHierarchy",
        param: {
            aHierarchyLevels: [{
                intent: "#sem1-action1"
            }]
        }
    }, {
        name: "setRelatedApps",
        func: oShellUIServiceInstance.setRelatedApps,
        msg: "sap.ushell.services.ShellUIService.setRelatedApps",
        param: {
            aRelatedApps: [{
                intent: "#sem1-action1"
            }]
        }
    }].forEach(function (oTest) {
        QUnit.test("call " + oTest.name + " - scube", function (assert) {
            var fnDone = assert.async();
            AppRuntimeContext.setIsScube(true);
            sandbox.spy(AppRuntimeContext, "getIsScube");
            sandbox.stub(AppRuntimeService, "postMessageToFLP");
            sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve({
                isNavigationSupported: sandbox.stub().returns(Promise.resolve([{
                    supported: false
                }]))
            }));
            sandbox.stub(UrlParsing, "parseShellHash").returns({
                params: {}
            });
            sandbox.stub(UrlParsing, "constructShellHash").returns("sem1-action1");

            oTest.func([{}]).then(function () {
                assert.strictEqual(AppRuntimeContext.getIsScube.callCount, 1);
                assert.strictEqual(AppRuntimeService.postMessageToFLP.callCount, 1);
                assert.ok(AppRuntimeService.postMessageToFLP.calledWith(
                    oTest.msg,
                    oTest.param
                ));
                assert.strictEqual(Container.getServiceAsync.callCount, 1);
                fnDone();
            });
        });
    });

    QUnit.module("resetTitle", {
        beforeEach: async function () {
            sandbox.stub(AppRuntimeService, "postMessageToFLP");
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resets the title ", async function (assert) {
        // Arrange
        oShellUIServiceInstance.setTitle("testTitle");
        assert.strictEqual(oShellUIServiceInstance.getTitle(), "testTitle", "Correct title was set");
        // Act
        EventBus.getInstance().publish("sap.ushell", "appClosed");
        // Assert
        assert.strictEqual(oShellUIServiceInstance.getTitle(), undefined, "Title was reset");
    });
});

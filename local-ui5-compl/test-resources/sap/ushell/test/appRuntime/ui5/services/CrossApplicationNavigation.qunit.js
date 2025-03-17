// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.CrossApplicationNavigation
 * @deprecated since 1.120.
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/services/CrossApplicationNavigation",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/ushell/Container"
], function (
    CrossApplicationNavigation,
    AppRuntimeService,
    AppRuntimeContext,
    Container
) {
    "use strict";

    /* global sinon, QUnit */
    var sandbox = sinon.createSandbox({});
    var oCrossAppNavService;

    QUnit.module("sap.ushell.test.appRuntime.ui5.services.CrossApplicationNavigation", {
        beforeEach: function (assert) {
            oCrossAppNavService = new CrossApplicationNavigation();
            return Container.init("local");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("call isNavigationSupported", function (assert) {
        AppRuntimeContext.setIsScube(false);
        sandbox.spy(AppRuntimeContext, "getIsScube");
        sandbox.stub(AppRuntimeService, "sendMessageToOuterShell");
        sandbox.stub(Container, "getServiceAsync");

        oCrossAppNavService.isNavigationSupported([], undefined);

        assert.strictEqual(AppRuntimeContext.getIsScube.callCount, 1);
        assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 1);
        assert.strictEqual(Container.getServiceAsync.callCount, 0);
    });

    QUnit.test("call isNavigationSupported for checking only in outer shell", function (assert) {
        AppRuntimeContext.setIsScube(false);
        sandbox.spy(AppRuntimeContext, "getIsScube");
        sandbox.stub(AppRuntimeService, "sendMessageToOuterShell");
        sandbox.stub(Container, "getServiceAsync");

        oCrossAppNavService.isNavigationSupported([], undefined, true);

        assert.strictEqual(AppRuntimeContext.getIsScube.callCount, 0);
        assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 1);
        assert.strictEqual(Container.getServiceAsync.callCount, 0);
    });

    QUnit.test("scube - call isNavigationSupported for checking both in iframe and outer shell", function (assert) {
        var fnDone = assert.async();
        var stub1 = sandbox.stub().returns({
            done: function (fnResolve) {
                fnResolve();
            }
        });
        AppRuntimeContext.setIsScube(true);
        sandbox.spy(AppRuntimeContext, "getIsScube");
        sandbox.stub(AppRuntimeService, "sendMessageToOuterShell");
        sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve({
            isNavigationSupported: stub1
        }));

        oCrossAppNavService.isNavigationSupported([], undefined).then(function () {
            assert.strictEqual(AppRuntimeContext.getIsScube.callCount, 1);
            assert.strictEqual(Container.getServiceAsync.callCount, 1);
            assert.strictEqual(stub1.callCount, 1);
            assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 0);
            fnDone();
        }, function () {
            assert.ok(false);
            fnDone();
        });
    });
});

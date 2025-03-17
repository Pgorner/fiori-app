// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.AppState
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext"
], function (Container, AppRuntimeContext) {
    "use strict";

    /* global sinon, QUnit */
    var sandbox = sinon.createSandbox({});

    window["sap-ushell-config"] = {
        services: {
            AppState: {
                module: "sap.ushell.appRuntime.ui5.services.AppState",
                adapter: {
                    module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter",
                    config: {
                        transient: true
                    }
                },
                config: {
                    transient: true
                }
            }
        }
    };

    QUnit.module("sap.ushell.test.appRuntime.ui5.services.AppState", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            Container.init("local").then(fnDone);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("test lifecycle basic flow", function (assert) {
        var done = assert.async();

        Container.getServiceAsync("AppState").then(function (AppStateService) {
            var oState = AppStateService.createEmptyAppState(undefined);
            assert.strictEqual(oState._bTransient, true, "default should be transient");
            assert.strictEqual(oState._sKey.substring(0, 3), "TAS", "key should start with TAS");
            oState = AppStateService.createEmptyAppState(undefined, false);
            assert.strictEqual(oState._bTransient, false, "default should not be transient");
            assert.strictEqual(oState._sKey.substring(0, 2), "AS", "key should start with AS");
            done();
        });
    });

    QUnit.test("test lifecycle basic flow - scube", function (assert) {
        var done = assert.async();

        AppRuntimeContext.setIsScube(true);
        Container.getServiceAsync("AppState").then(function (AppStateService) {
            var oState = AppStateService.createEmptyAppState(undefined);
            assert.strictEqual(oState._bTransient, false, "default in s/cube should be persistent");
            assert.strictEqual(oState._sKey.substring(0, 2), "AS", "key in s/cube  should start with AS");
            AppRuntimeContext.setIsScube(false);
            done();
        });
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.NavTargetResolutionInternal
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/services/NavTargetResolutionInternal",
    "sap/ushell/Container"
], function (NavTargetResolutionInternal, Container) {
    "use strict";

    /* global sinon, QUnit */
    var sandbox = sinon.createSandbox({});
    var oNavTargetResolutionService;

    QUnit.module("sap.ushell.test.appRuntime.ui5.services.NavTargetResolutionInternal", {
        beforeEach: function () {
            sandbox.stub(Container, "getService");

            oNavTargetResolutionService = new NavTargetResolutionInternal();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("check that special scube apis exists", function (assert) {
        assert.strictEqual(typeof oNavTargetResolutionService.isIntentSupportedLocal, "function");
        assert.strictEqual(typeof oNavTargetResolutionService.isIntentSupported, "function");
        assert.strictEqual(typeof oNavTargetResolutionService._isIntentSupportedLocal, "function");
        assert.strictEqual(typeof oNavTargetResolutionService._isIntentSupported, "function");

        assert.strictEqual(oNavTargetResolutionService._isIntentSupportedLocal, oNavTargetResolutionService.isIntentSupportedLocal);
        assert.strictEqual(oNavTargetResolutionService._isIntentSupported, oNavTargetResolutionService.isIntentSupported);
    });
});

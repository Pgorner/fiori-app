// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.AppLifeCycle
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/services/AppLifeCycle",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/Container"
], function (
    AppLifeCycle,
    AppRuntimeService,
    Container
) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("reloadCurrentApp", {
        beforeEach: async function () {
            // Stub dependencies of original AppLifeCycle service
            sandbox.stub(Container, "getRendererInternal");

            this.AppLifeCycle = new AppLifeCycle();

            sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves();
        },
        afterEach: async function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Calls and awaits the postMessage api", async function (assert) {
        // Arrange
        const aExpectedArgs = [
            "sap.ushell.services.AppLifeCycle.reloadCurrentApp",
            {}
        ];

        // Act
        await this.AppLifeCycle.reloadCurrentApp();

        // Assert
        assert.deepEqual(AppRuntimeService.postMessageToFLP.getCall(0).args, aExpectedArgs, "postMessageToFLP was called");
    });
});

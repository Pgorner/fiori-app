// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.AppConfiguration
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/services/AppConfiguration",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/RendererExtensions",
    "sap/m/Button"
], function (
    AppConfiguration,
    AppRuntimeService,
    RendererExtensions,
    Button
) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    /**
     * @deprecated since 1.120.
     */
    QUnit.module("sap.ushell.test.appRuntime.ui5.services.AppConfiguration", {
        beforeEach: function (assert) {

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("AppConfiguration API - addApplicationSettingsButtons", function (assert) {
        const fnDone = assert.async();
        sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves();
        const oRemoveStub = sandbox.spy(RendererExtensions, "removeOptionsActionSheetButton");
        const oAddStub = sandbox.stub(RendererExtensions, "addOptionsActionSheetButton").callsFake(
            function () {
                assert.strictEqual(oRemoveStub.callCount, 1, "removeOptionsActionSheetButton was called.");
                assert.strictEqual(oAddStub.callCount, 1, "addOptionsActionSheetButton was called.");
                fnDone();
            }
        );

        assert.expect(2);

        const aButtons = [
            new Button({
                text: "Test Button"
            })
        ];

        AppConfiguration.addApplicationSettingsButtons(aButtons);
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.renderers.fiori2.RendererExtensions
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/RendererExtensions",
    "sap/m/Button",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (jQuery, RendererExtensions, Button, AppRuntimeService) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.test.appRuntime.ui5.renderers.fiori2.RendererExtensions", {
        beforeEach: function (assert) {
            this.oRenderer = {
                _addButtonHandler: sandbox.stub()
            };
            RendererExtensions.setRenderer(this.oRenderer);

            sandbox.stub(AppRuntimeService, "postMessageToFLP").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("RendererExtensions API - addOptionsActionSheetButton", function (assert) {
        // Arrange
        const oButton = new Button();

        // Act
        return RendererExtensions.addOptionsActionSheetButton(
            oButton
        ).then(function () {

            // Assert
            assert.ok(true, "The promise was resolved.");
        });
    });

    QUnit.test("RendererExtensions API - removeOptionsActionSheetButton", function (assert) {
        // Arrange
        const oButton = new Button();

        // Act
        return RendererExtensions.removeOptionsActionSheetButton(
            oButton
        ).then(function () {

            // Assert
            assert.ok(true, "The promise was resolved.");
        });
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.renderer.ShellLayout
 */
sap.ui.define([
    "sap/ushell/renderer/ShellLayout"
], function (
    ShellLayout
) {
    "use strict";

    /* global QUnit*/

    QUnit.module("applyLayout");

    QUnit.test("Adds sap-ui-root-content attribute", function (assert) {
        // Arrange
        QUnit.sap.ushell.createTestDomRef();
        // Act
        ShellLayout.applyLayout("qunit-canvas");
        var oShellLayout = document.getElementById("shellLayout");
        // Assert
        assert.ok(oShellLayout.querySelectorAll("[data-sap-ui-root-content=true]").length, "Found some elements");
    });
});

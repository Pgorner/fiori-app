// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.FrameBoundExtension
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/services/FrameBoundExtension"
], function (
    FrameBoundExtension
) {
    "use strict";

    /* global QUnit */

    QUnit.module("constructor");

    QUnit.test("Throws an error", async function (assert) {
        // Act
        assert.throws(() => new FrameBoundExtension(), "The 'FrameBoundExtension' is not supported in the iframe environment.");
    });
});

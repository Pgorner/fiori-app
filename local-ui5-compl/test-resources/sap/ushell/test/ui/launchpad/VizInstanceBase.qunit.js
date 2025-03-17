// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.ui.launchpad.VizInstanceBase"
 */
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ushell/ui/launchpad/VizInstanceBase"
], function (
    Control,
    VizInstanceBase
) {
    "use strict";

    const sandbox = sinon.createSandbox({});

    /* global QUnit, sinon */

    QUnit.module("The constructor", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates an instance of a Control", function (assert) {
        // Act
        var oVizInstance = new VizInstanceBase();

        // Assert
        assert.ok(oVizInstance instanceof Control, "Correctly creates an instance of a Control.");
        assert.strictEqual(oVizInstance.getActive(), false, "The default value for the active property was correctly set.");

        oVizInstance.destroy();
    });
});

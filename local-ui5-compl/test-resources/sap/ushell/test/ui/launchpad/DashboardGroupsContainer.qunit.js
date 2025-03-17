// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileoverview Test DashboardGroupsContainer
 * @deprecated As of version 1.120
 */
sap.ui.define([
    "sap/ushell/ui/launchpad/DashboardGroupsContainer",
    "sap/ui/core/Control",
    "sap/ui/core/ResizeHandler",
    "sap/ushell/Config",
    "sap/ui/Device"
], function (DashboardGroupsContainer, Control, ResizeHandler, Config, Device) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("The exit function", {
        beforeEach: function () {
            this.oInstance = {};
        },
        afterEach: function () {
            this.oInstance = null;
        }
    });

    QUnit.test("Calls the exit function of sap.ui.core.Control", function (assert) {
        // Arrange
        var oExitStub = sinon.stub(Control.prototype, "exit");

        // Act
        DashboardGroupsContainer.prototype.exit.apply(this.oInstance);

        // Assert
        assert.strictEqual(oExitStub.callCount, 1, "The function Control.exit has been called once.");
        assert.strictEqual(oExitStub.firstCall.thisValue, this.oInstance, "The function Control.exit has been called with the correct context.");
    });
});

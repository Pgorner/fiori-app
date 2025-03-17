// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.runtimeSwitcher.Component
 */
 sap.ui.define([
    "sap/ushell/components/runtimeSwitcher/Component"
], function (
    Component
) {
    "use strict";
    /* global QUnit */

    QUnit.module("The RuntimeSwitcher component", {
        beforeEach: function () {
            this.oComponent = new Component();
        }
    });
    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oComponent, "The component was instantiated.");
    });
});

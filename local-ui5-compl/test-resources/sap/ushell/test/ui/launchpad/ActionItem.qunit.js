// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.ActionItem
 */

sap.ui.define([
    "sap/ushell/ui/launchpad/ActionItem"
], function (
    ActionItem
) {
    "use strict";

    /*global QUnit sinon */

    QUnit.module("sap.ushell.ui.launchpad.ActionItem", {
        beforeEach: function () {
            this.oActionItem = new ActionItem({
                text: "action",
                tooltip: "action",
                icon: "sap-icons://person-placeholder"
            });

            this.oTestContainer = window.document.createElement("div");
            this.oTestContainer.setAttribute("id", "testContainer");
            window.document.body.appendChild(this.oTestContainer);

            this.oClock = sinon.useFakeTimers();
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            this.oClock.restore();
            this.oActionItem.destroy();
        }
    });

    QUnit.test("ActionItem default actionType Test", function (assert) {
        this.oActionItem.placeAt("testContainer");
        var sActionType = this.oActionItem.getActionType();
        assert.ok(sActionType === "standard", 'default actionType is "standard"');
    });

    QUnit.test("ActionItem 'action' actionType Test", function (assert) {
        this.oActionItem.setActionType("action");
        this.oActionItem.placeAt("testContainer");
        this.oClock.tick(100);
        var sActionType = this.oActionItem.getActionType();
        assert.ok(sActionType === "action", "action type is saved");
        assert.ok(this.oActionItem.getType() === "Unstyled", 'sap.m.Button.Type is set to "Unstyled"');
    });

    QUnit.test("ActionItem change actionType Test", function (assert) {
        this.oActionItem.setType("Transparent");
        this.oActionItem.setActionType("action");
        this.oActionItem.setActionType("standard");
        this.oActionItem.placeAt("testContainer");
        this.oClock.tick(100);
        var sActionType = this.oActionItem.getActionType();
        assert.ok(sActionType === "standard", "action type is saved");
        assert.ok(this.oActionItem.getType() === "Transparent", 'sap.m.Button.Type is set to "Transparent"');
    });
});

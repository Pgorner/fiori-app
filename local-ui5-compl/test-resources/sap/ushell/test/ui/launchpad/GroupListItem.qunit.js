// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GroupListItem
 */
sap.ui.define([
    "sap/ushell/ui/launchpad/GroupListItem"
], function (GroupListItem) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.ui.launchpad.GroupListItem");

    QUnit.test("Constructor Test", function (assert) {
        var demiItemData = {
            title: "defaultGroup",
            defaultGroup: true,
            groupId: "group1",
            editMode: false,
            numberOfTiles: 5,
            afterRendering: function afterRender () { }
        };

        var item = new GroupListItem(demiItemData);
        assert.ok(item.getTitle() === "defaultGroup", "title Test");
        assert.ok(item.getGroupId() === "group1", "id Test");
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.GroupsHelper.
 */
sap.ui.define([
    "sap/ushell/components/GroupsHelper"
], function (GroupsHelper) {
    "use strict";

    /* global QUnit */

    var aGroups = [
        {
            id: "group_0",
            groupId: "group 0",
            title: "group_0",
            isGroupVisible: true,
            isRendered: false,
            index: 0,
            tiles: [],
            pendingLinks: [],
            links: []
        },
        {
            id: "group_1",
            groupId: "group_1",
            title: "group_1",
            isGroupVisible: true,
            isRendered: false,
            index: 1,
            tiles: [],
            pendingLinks: [],
            links: []
        },
        {
            id: "group_2",
            groupId: "group_2",
            title: "group_2",
            isGroupVisible: true,
            isRendered: false,
            index: 2,
            tiles: [],
            pendingLinks: [],
            links: []
        },
        {
            id: "group_hidden",
            groupId: "group_hidden",
            title: "group_hidden",
            isGroupVisible: false,
            isRendered: false,
            index: 3,
            tiles: [],
            pendingLinks: [],
            links: []
        },
        {
            id: "group_03",
            groupId: "group_03",
            title: "group_03",
            isGroupVisible: true,
            isRendered: false,
            index: 4,
            tiles: [],
            pendingLinks: [],
            links: []
        }
    ];

    QUnit.module("getIndexOfGroup");

    QUnit.test("group was found", function (assert) {
        // Act
        var iGroupIndex = GroupsHelper.getIndexOfGroup(aGroups, "group 0");

        // Assert
        assert.strictEqual(iGroupIndex, 0, "The index was as expected.");
    });

    QUnit.test("group was not found", function (assert) {
        // Act
        var iGroupIndex = GroupsHelper.getIndexOfGroup(aGroups, "group not found");

        // Assert
        assert.strictEqual(iGroupIndex, -1, "-1 was returned as the group was not found.");
    });

    QUnit.module("getModelPathOfGroup");

    QUnit.test("group was found", function (assert) {
        // Act
        var iGroupIndex = GroupsHelper.getModelPathOfGroup(aGroups, "group 0");

        // Assert
        assert.strictEqual(iGroupIndex, "/groups/0", "The path was as expected.");
    });

    QUnit.test("group was not found", function (assert) {
        // Act
        var iGroupIndex = GroupsHelper.getModelPathOfGroup(aGroups, "group not found");

        // Assert
        assert.strictEqual(iGroupIndex, null, "null is returned as the group was not found.");
    });
});

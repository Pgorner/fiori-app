// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.AnchorItem
 * @deprecated As of version 1.120
 */
sap.ui.define([
    "sap/ui/events/KeyCodes",
    "sap/ui/qunit/QUnitUtils",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/ui/launchpad/AnchorItem"
], function (
    KeyCodes,
    QUnitUtils,
    nextUIUpdate,
    AnchorItem
) {
    "use strict";

    /* global QUnit */

    QUnit.module("AnchorItem", {
        beforeEach: function () {
            this.oAnchorItem = new AnchorItem();
            this.oAnchorItem.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oAnchorItem.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        // Assert
        assert.strictEqual(this.oAnchorItem.getTitle(), "", "Default Value of property title is: \"\"");
        assert.strictEqual(this.oAnchorItem.getSelected(), false, "Default Value of property selected is: false");
        assert.strictEqual(this.oAnchorItem.getGroupId(), "", "Default Value of property groupId is: \"\"");
        assert.strictEqual(this.oAnchorItem.getDefaultGroup(), false, "Default Value of property defaultGroup is: false");
        assert.strictEqual(this.oAnchorItem.getHelpId(), "", "Default Value of property helpId is: \"\"");
        assert.strictEqual(this.oAnchorItem.getIndex(), 0, "Default Value of property index is: 0");
        assert.strictEqual(this.oAnchorItem.getIsGroupVisible(), true, "Default Value of property isGroupVisible is: true");
        assert.strictEqual(this.oAnchorItem.getIsGroupRendered(), false, "Default Value of property isGroupRendered is: false");
        assert.strictEqual(this.oAnchorItem.getIsGroupDisabled(), false, "Default Value of property isGroupDisabled is: false");
        assert.strictEqual(this.oAnchorItem.getLocked(), false, "Default Value of property locked is: false");
        assert.strictEqual(this.oAnchorItem.getPosinset(), 0, "Default Value of property posinset is: 0");
        assert.strictEqual(this.oAnchorItem.getSetsize(), 0, "Default Value of property setsize is: 0");
    });

    QUnit.test("onsapspace", function (assert) {
        // Arrange
        this.oAnchorItem.attachPress(function () {
            // Assert
            assert.ok(true, "Press event was fired.");
        });

        // Act
        QUnitUtils.triggerKeydown(this.oAnchorItem.getDomRef(), KeyCodes.SPACE);
    });

    QUnit.test("visibilityChanged event", function (assert) {
        // Arrange
        this.oAnchorItem.attachVisibilityChanged(function () {
            // Assert
            assert.ok(true, "visibilityChanged event was fired.");
        });

        // Act
        this.oAnchorItem.setVisible(false);
    });

    QUnit.module("AnchorItem rendering", {
        beforeEach: function () {
            this.oAnchorItem = new AnchorItem({
                groupId: "id-xxtest"
            });
            this.oAnchorItem.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oAnchorItem.destroy();
        }
    });

    QUnit.test("isGroupVisible = false", async function (assert) {
        // Arrange
        this.oAnchorItem.setIsGroupVisible(false);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$().hasClass("sapUshellShellHidden"), true,
            "The class sapUshellShellHidden is added.");
    });

    QUnit.test("isGroupVisible = true", async function (assert) {
        // Arrange
        this.oAnchorItem.setIsGroupVisible(true);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$().hasClass("sapUshellShellHidden"), false,
            "The class sapUshellShellHidden is not added.");
    });

    QUnit.test("isGroupDisabled = false", async function (assert) {
        // Arrange
        this.oAnchorItem.setIsGroupDisabled(false);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$("inner").hasClass("sapUshellAnchorItemDisabled"), false,
            "The class sapUshellAnchorItemDisabled is not added to the inner div.");
    });

    QUnit.test("isGroupDisabled = true", async function (assert) {
        // Arrange
        this.oAnchorItem.setIsGroupDisabled(true);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$("inner").hasClass("sapUshellAnchorItemDisabled"), true,
            "The class sapUshellAnchorItemDisabled is added to the inner div.");
    });

    QUnit.test("helpId = null and defaultGroup = false", async function (assert) {
        // Arrange
        this.oAnchorItem.setHelpId(null);
        this.oAnchorItem.setDefaultGroup(false);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$().hasClass("help-id-anchorNavigationBarItem"), false,
            "The class help-id-anchorNavigationBarItem is not added.");
        assert.strictEqual(this.oAnchorItem.$().hasClass("help-id-homeAnchorNavigationBarItem"), false,
            "The class help-id-homeAnchorNavigationBarItem is not added.");
        assert.strictEqual(this.oAnchorItem.getDomRef().getAttribute("data-help-id"), null,
            "The attribute data-help-id is not added.");
    });

    QUnit.test("helpId = '/ui2/test' and defaultGroup = false", async function (assert) {
        // Arrange
        this.oAnchorItem.setHelpId("/ui2/test");
        this.oAnchorItem.setDefaultGroup(false);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$().hasClass("help-id-anchorNavigationBarItem"), true,
            "The class help-id-anchorNavigationBarItem is added.");
        assert.strictEqual(this.oAnchorItem.$().hasClass("help-id-homeAnchorNavigationBarItem"), false,
            "The class help-id-homeAnchorNavigationBarItem is not added.");
        assert.strictEqual(this.oAnchorItem.getDomRef().getAttribute("data-help-id"), "/ui2/test",
            "The attribute data-help-id is added with the correct helpId.");
    });

    QUnit.test("helpId = null and defaultGroup = true", async function (assert) {
        // Arrange
        this.oAnchorItem.setHelpId(null);
        this.oAnchorItem.setDefaultGroup(true);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$().hasClass("help-id-anchorNavigationBarItem"), false,
            "The class help-id-anchorNavigationBarItem is not added.");
        assert.strictEqual(this.oAnchorItem.$().hasClass("help-id-homeAnchorNavigationBarItem"), false,
            "The class help-id-homeAnchorNavigationBarItem is not added.");
        assert.strictEqual(this.oAnchorItem.getDomRef().getAttribute("data-help-id"), null,
            "The attribute data-help-id is not added.");
    });

    QUnit.test("helpId = '/ui2/test' and defaultGroup = true", async function (assert) {
        // Arrange
        this.oAnchorItem.setHelpId("/ui2/test");
        this.oAnchorItem.setDefaultGroup(true);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$().hasClass("help-id-anchorNavigationBarItem"), false,
            "The class help-id-anchorNavigationBarItem is not added.");
        assert.strictEqual(this.oAnchorItem.$().hasClass("help-id-homeAnchorNavigationBarItem"), true,
            "The class help-id-homeAnchorNavigationBarItem is added.");
        assert.strictEqual(this.oAnchorItem.getDomRef().getAttribute("data-help-id"), "/ui2/test",
            "The attribute data-help-id is added with the correct groupId.");
    });

    QUnit.test("selected = false", async function (assert) {
        // Arrange
        this.oAnchorItem.setSelected(false);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$().hasClass("sapUshellAnchorItemSelected"), false,
            "The class sapUshellAnchorItemSelected is not added.");
        assert.notEqual(this.oAnchorItem.getDomRef().getAttribute("tabindex"), "0",
            "The attribute tabindex is not added.");
    });

    QUnit.test("selected = true", async function (assert) {
        // Arrange
        this.oAnchorItem.setSelected(true);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.$().hasClass("sapUshellAnchorItemSelected"), true,
            "The class sapUshellAnchorItemSelected is added.");
        assert.strictEqual(this.oAnchorItem.getDomRef().getAttribute("tabindex"), "0",
            "The attribute tabindex is added with value \"0\".");
    });

    QUnit.test("posinset = 2 & setsize = 3", async function (assert) {
        // Arrange
        this.oAnchorItem.setPosinset(2);
        this.oAnchorItem.setSetsize(3);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorItem.getDomRef().getAttribute("aria-posinset"), "2",
            "The attribute aria-posinset is added with value \"2\".");
        assert.strictEqual(this.oAnchorItem.getDomRef().getAttribute("aria-setsize"), "3",
            "The attribute aria-setsize is added with value \"3\".");
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.shell.ShellHeadItem
 */
sap.ui.define([
    "sap/ui/core/IconPool",
    "sap/ui/events/KeyCodes",
    "sap/ui/qunit/QUnitUtils",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/library",
    "sap/ushell/ui/shell/ShellHeadItem"
], function (
    IconPool,
    KeyCodes,
    QUnitUtils,
    nextUIUpdate,
    ushellLibrary,
    ShellHeadItem
) {
    "use strict";

    /* global QUnit */

    // shortcut for sap.ushell.FloatingNumberType
    var FloatingNumberType = ushellLibrary.FloatingNumberType;

    QUnit.module("ShellHeadItem", {
        beforeEach: function () {
            this.oShellHeadItem = new ShellHeadItem().placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oShellHeadItem.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        // Assert
        assert.strictEqual(this.oShellHeadItem.getStartsSection(), false, "Default Value of property startsSection is: false");
        assert.strictEqual(this.oShellHeadItem.getShowSeparator(), false, "Default Value of property showSeparator is: false");
        assert.strictEqual(this.oShellHeadItem.getEnabled(), true, "Default Value of property enabled is: true");
        assert.strictEqual(this.oShellHeadItem.getSelected(), false, "Default Value of property selected is: false");
        assert.strictEqual(this.oShellHeadItem.getShowMarker(), false, "Default Value of property showMarker is: false");
        assert.strictEqual(this.oShellHeadItem.getIcon(), "", "Default Value of property icon is: \"\"");
        assert.strictEqual(this.oShellHeadItem.getTarget(), "", "Default Value of property target is: \"\"");
        assert.strictEqual(this.oShellHeadItem.getAriaLabel(), "", "Default Value of property ariaLabel is: \"\"");
        assert.strictEqual(this.oShellHeadItem.getAriaHidden(), false, "Default Value of property ariaHidden is: false");
        assert.strictEqual(this.oShellHeadItem.getAriaHaspopup(), "", "Default Value of property ariaHaspopup is: \"\"");
        assert.strictEqual(this.oShellHeadItem.getText(), "", "Default Value of property text is: \"\"");
        assert.strictEqual(this.oShellHeadItem.getFloatingNumber(), 0, "Default Value of property floatingNumber is: null");
        assert.strictEqual(this.oShellHeadItem.getFloatingNumberMaxValue(), 999, "Default Value of property floatingNumberMaxValue is: 999");
        assert.strictEqual(this.oShellHeadItem.getFloatingNumberType(), FloatingNumberType.None, "Default Value of property floatingNumberType is: sap.ushell.FloatingNumberType.None");
    });

    QUnit.test("press event", function (assert) {
        // Arrange
        this.oShellHeadItem.attachPress(function () {
            // Assert
            assert.ok(true, "Press event was fired.");
        });

        // Act
        QUnitUtils.triggerMouseEvent(this.oShellHeadItem.getDomRef(), "click");
    });

    QUnit.test("onkeyup SPACE (press event)", function (assert) {
        // Arrange
        this.oShellHeadItem.attachPress(function () {
            // Assert
            assert.ok(true, "Press event was fired.");
        });

        // Act
        QUnitUtils.triggerKeyup(this.oShellHeadItem.getDomRef(), KeyCodes.SPACE);
    });

    QUnit.test("onkeyup ENTER (press event)", function (assert) {
        // Arrange
        this.oShellHeadItem.attachPress(function () {
            // Assert
            assert.ok(true, "Press event was fired.");
        });

        // Act
        QUnitUtils.triggerKeyup(this.oShellHeadItem.getDomRef(), KeyCodes.ENTER);
    });

    QUnit.module("ShellHeadItem rendering", {
        beforeEach: function () {
            this.oShellHeadItem = new ShellHeadItem().placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oShellHeadItem.destroy();
        }
    });

    QUnit.test("default rendering", function (assert) {
        // Assert
        var oDomRef = this.oShellHeadItem.getDomRef();
        var sId = this.oShellHeadItem.getId();
        assert.strictEqual(oDomRef.tagName, "A", "The main dom element is an \"a\" tag.");
        assert.strictEqual(oDomRef.getAttribute("id"), sId,
            "The attribute id is set to \"" + sId + "\" on the main dom element.");
        assert.strictEqual(oDomRef.getAttribute("tabindex"), "0", "The attribute tabindex is set to \"0\".");
        assert.strictEqual(oDomRef.getAttribute("href"), null, "The attribute href is not added.");
        assert.strictEqual(oDomRef.getAttribute("role"), "button", "The attribute role is set to \"button\".");
        assert.strictEqual(oDomRef.getAttribute("aria-label"), null, "The attribute aria-label is not added.");
        assert.strictEqual(oDomRef.getAttribute("aria-hidden"), null, "The attribute aria-hidden is not added.");
        assert.strictEqual(oDomRef.getAttribute("aria-haspopup"), null, "The attribute aria-haspopup is not added.");
        var sInvisibeTextId = this.oShellHeadItem._oAriaDescribedbyText.getId();
        assert.strictEqual(oDomRef.getAttribute("aria-describedby"), sInvisibeTextId,
            "The attribute aria-describedby is set to \"" + sInvisibeTextId + "\".");
        assert.strictEqual(oDomRef.getAttribute("title"), null, "The attribute title is not added.");
        assert.strictEqual(oDomRef.getAttribute("data-counter-content"), null,
            "The attribute data-counter-content is not added.");
        var oClassList = oDomRef.classList;
        assert.strictEqual(oClassList.contains("sapUshellShellHeadItmCounter"), false,
            "The class \"sapUshellShellHeadItmCounter\" is not set.");
        assert.strictEqual(oClassList.contains("sapUshellShellHeadItm"), true,
            "The class \"sapUshellShellHeadItm\" is set.");
        assert.strictEqual(oClassList.contains("sapUshellShellHeadItmDisabled"), false,
            "The class \"sapUshellShellHeadItmDisabled\" is not set.");
        assert.strictEqual(oClassList.contains("sapUshellShellHeadItmSel"), false,
            "The class \"sapUshellShellHeadItmSel\" is not set.");
        assert.strictEqual(oDomRef.children.length, 1, "The main dom element has one child.");
        var oSpanDomRef = oDomRef.children[0];
        assert.strictEqual(oSpanDomRef.tagName, "SPAN", "The inner dom element is a \"span\" tag.");
        assert.strictEqual(oSpanDomRef.classList.contains("sapUshellShellHeadItmCntnt"), true,
            "The span dom element has the class \"sapUshellShellHeadItmCntnt\" set.");
        assert.strictEqual(oSpanDomRef.children.length, 1, "The span dom element has one child.");
        var oImgDomRef = oSpanDomRef.children[0];
        assert.strictEqual(oImgDomRef.tagName, "IMG", "The dom element inside the inner dom element is a \"img\" tag.");
        assert.strictEqual(oImgDomRef.getAttribute("id"), sId + "-img-inner",
            "The attribute id is set to \"" + sId + "-img-inner\" on the inner image element.");
        assert.strictEqual(oImgDomRef.getAttribute("src"), "",
            "The attribute src is set to \"\" on the inner image element.");
        assert.strictEqual(oImgDomRef.children.length, 0, "The img dom element has no children.");
    });

    QUnit.test("target", async function (assert) {
        // Arrange
        var sTarget = "#FLPPage-manage";
        this.oShellHeadItem.setTarget(sTarget);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oShellHeadItem.getDomRef().getAttribute("href"), sTarget,
            "The attribute href is added with value \"" + sTarget + "\".");
        assert.strictEqual(this.oShellHeadItem.getDomRef().getAttribute("role"), "link",
            "The attribute role is set to \"link\".");
    });

    QUnit.test("ariaLabel", async function (assert) {
        // Arrange
        var sAriaLabel = "some aria label";
        this.oShellHeadItem.setAriaLabel(sAriaLabel);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oShellHeadItem.getDomRef().getAttribute("aria-label"), sAriaLabel,
            "The attribute aria-label is added with value \"" + sAriaLabel + "\".");
    });

    QUnit.test("ariaHidden", async function (assert) {
        // Arrange
        this.oShellHeadItem.setAriaHidden(true);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oShellHeadItem.getDomRef().getAttribute("aria-hidden"), "true",
            "The attribute aria-hidden is added.");
    });

    QUnit.test("ariaHaspopup", async function (assert) {
        // Arrange
        var sAriaHaspopup = "dialog";
        this.oShellHeadItem.setAriaHaspopup(sAriaHaspopup);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oShellHeadItem.getDomRef().getAttribute("aria-haspopup"), sAriaHaspopup,
            "The attribute aria-haspopup is added with value \"" + sAriaHaspopup + "\".");
    });

    QUnit.test("tooltip", async function (assert) {
        // Arrange
        var sTooltip = "some tooltip";
        this.oShellHeadItem.setTooltip(sTooltip);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oShellHeadItem.getDomRef().getAttribute("title"), sTooltip,
            "The attribute title is added with value \"" + sTooltip + "\".");
    });

    QUnit.test("text", async function (assert) {
        // Arrange
        var sText = "some text";
        this.oShellHeadItem.setText(sText);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oShellHeadItem.getDomRef().getAttribute("title"), sText,
            "The attribute title is added with value \"" + sText + "\".");
    });

    QUnit.test("text and tooltip", async function (assert) {
        // Arrange
        var sText = "some text";
        var sTooltip = "some tooltip";
        this.oShellHeadItem.setText(sText);
        this.oShellHeadItem.setTooltip(sTooltip);

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oShellHeadItem.getDomRef().getAttribute("title"), sTooltip,
            "The attribute title is added with value \"" + sText + "\".");
    });

    QUnit.test("floatingNumber", async function (assert) {
        // Arrange
        var iFloatingNumber = 4;
        this.oShellHeadItem.setFloatingNumber(iFloatingNumber);

        // Act
        await nextUIUpdate();

        // Assert
        var oDomRef = this.oShellHeadItem.getDomRef();
        var oClassList = oDomRef.classList;
        assert.strictEqual(oDomRef.getAttribute("data-counter-content"), "4",
            "The attribute data-counter-content is added with value \"4\".");
        assert.strictEqual(oClassList.contains("sapUshellShellHeadItmCounter"), true,
            "The class \"sapUshellShellHeadItmCounter\" is set.");
    });

    QUnit.test("enabled", async function (assert) {
        // Arrange
        this.oShellHeadItem.setEnabled(false);

        // Act
        await nextUIUpdate();

        // Assert
        var oClassList = this.oShellHeadItem.getDomRef().classList;
        assert.strictEqual(oClassList.contains("sapUshellShellHeadItmDisabled"), true,
        "The class \"sapUshellShellHeadItmDisabled\" is set.");
    });

    QUnit.test("selected", async function (assert) {
        // Arrange
        this.oShellHeadItem.setSelected(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oClassList = this.oShellHeadItem.getDomRef().classList;
        assert.strictEqual(oClassList.contains("sapUshellShellHeadItmSel"), true,
        "The class \"sapUshellShellHeadItmSel\" is set.");
    });

    QUnit.test("icon", async function (assert) {
        // Arrange
        var sIcon = "sap-icon://home";
        var oIconInfo = IconPool.getIconInfo(sIcon);
        this.oShellHeadItem.setIcon(sIcon);

        // Act
        await nextUIUpdate();

        // Assert
        var oSpanDomRef = this.oShellHeadItem.getDomRef().children[0];
        assert.strictEqual(oSpanDomRef.style.fontFamily, oIconInfo.fontFamily,
            "The font-family style \"" + oIconInfo.fontFamily + "\" is set.");
    });
});

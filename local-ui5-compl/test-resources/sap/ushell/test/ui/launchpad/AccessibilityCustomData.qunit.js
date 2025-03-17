// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.AccessibilityCustomData
 */
sap.ui.define([
    "sap/m/Button",
    "sap/ui/core/ControlBehavior",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ushell/ui/tile/StaticTile"
], function (
    Button,
    ControlBehavior,
    nextUIUpdate,
    AccessibilityCustomData,
    Tile,
    StaticTile
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.ui.launchpad.AccessibilityCustomData", {
        beforeEach: function () {
            this.oGetAccessibilityStub = sandbox.stub(ControlBehavior, "isAccessibilityEnabled");
            this.oGetAccessibilityStub.returns(true);

            this.oAccessibilityCustomData = new AccessibilityCustomData();
            this.oControl = new Button("testControl");
            this.oControl.addCustomData(this.oAccessibilityCustomData);
            this.oControl.placeAt("qunit-fixture");

            this.oContainerDomRef = document.getElementById("qunit-fixture");
        },
        afterEach: function () {
            sandbox.restore();
            this.oAccessibilityCustomData.destroy();
            this.oControl.destroy();
        }
    });

    QUnit.test("Add valid aria-label attribute as Custom Data", async function (assert) {
        // Act
        this.oAccessibilityCustomData.setKey("aria-label");
        this.oAccessibilityCustomData.setValue("meaningless text");
        this.oAccessibilityCustomData.setWriteToDom(true);
        await nextUIUpdate();

        // Assert
        var bAriaLabelAdded = this.oContainerDomRef.querySelectorAll("[aria-label=\"meaningless text\"]").length > 0;
        assert.ok(bAriaLabelAdded, "Area Label added");
    });

    QUnit.test("Add valid Role attribute as Custom Data", async function (assert) {
        // Act
        this.oAccessibilityCustomData.setKey("role");
        this.oAccessibilityCustomData.setValue("button");
        this.oAccessibilityCustomData.setWriteToDom(true);
        await nextUIUpdate();

        // Assert
        var bRoleAttributeAdded = this.oContainerDomRef.querySelectorAll("[role=\"button\"]").length > 0;
        assert.ok(bRoleAttributeAdded, "Role attribute added");
    });

    QUnit.test("Add aria-label attribute as Custom Data with WriteToDom set as false", async function (assert) {
        // Act
        this.oAccessibilityCustomData.setKey("aria-label");
        this.oAccessibilityCustomData.setValue("meaningless text");
        this.oAccessibilityCustomData.setWriteToDom(false);
        await nextUIUpdate();

        // Assert
        var bAriaLabelAdded = this.oContainerDomRef.querySelectorAll("[aria-label]").length > 0;
        assert.ok(!bAriaLabelAdded, "Aria Label added");
    });

    QUnit.test("Add a non aria-label attribute as Accessibility Custom Data", async function (assert) {
        // Act
        this.oAccessibilityCustomData.setKey("test");
        this.oAccessibilityCustomData.setValue("meaningless text");
        this.oAccessibilityCustomData.setWriteToDom(true);
        await nextUIUpdate();

        // Assert
        var bAriaLabelAdded = this.oContainerDomRef.querySelectorAll("[data-test=\"meaningless text\"]").length > 0;
        assert.ok(bAriaLabelAdded, "data-test added");
    });

    QUnit.test("Add aria-label attribute when accessibility state is false", async function (assert) {
        // Arrange
        this.oGetAccessibilityStub.returns(false);

        // Act
        this.oAccessibilityCustomData.setKey("aria-label");
        this.oAccessibilityCustomData.setValue("meaningless text");
        this.oAccessibilityCustomData.setWriteToDom(true);
        await nextUIUpdate();

        // Assert
        var bAriaLabelAdded = this.oContainerDomRef.querySelectorAll("[aria-label]").length > 0;
        assert.ok(!bAriaLabelAdded, "aria label not added");
    });

    QUnit.test("Append DIV element with navigationMode ID to tile, when focusing it", async function (assert) {
        // Arrange
        var done = assert.async();
        var oTile = new Tile({
            navigationMode: "embedded"
        });
        var oStaticTile = new StaticTile();
        oTile.addTileView(oStaticTile);
        oTile.placeAt(this.oContainerDomRef);
        await nextUIUpdate();

        // Act
        oTile.$().focusin();

        // Assert
        setTimeout(function () {
            var oNavigationModeDOM = document.getElementById(oTile.getId() + "-navigationMode");
            assert.strictEqual(oNavigationModeDOM.tagName, "DIV", "Div element with ID that contains -navigationMode");
            assert.ok(oTile.getDomRef().contains(oNavigationModeDOM), "Tile have descendant with known ID");

            // Cleanup
            oStaticTile.destroy();
            oTile.destroy();
            done();
        }, 0);
    });
});

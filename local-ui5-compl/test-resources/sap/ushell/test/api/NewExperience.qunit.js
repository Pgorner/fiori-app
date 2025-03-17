// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.api.NewExperience
 */
sap.ui.define([
    "sap/m/Button",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/api/NewExperience"
], function (
    Button,
    nextUIUpdate,
    NewExperience
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("getModel", {
        afterEach: function () {
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Returns a model", async function (assert) {
        // Act
        const oModel = NewExperience.getModel();
        // Assert
        assert.ok(oModel.isA("sap.ui.model.Model"), "A model was returned");
    });

    QUnit.module("getOverflowItemId", {
        afterEach: function () {
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the Id of the overflowItem", async function (assert) {
        // Arrange
        const oOverflowItem = NewExperience.getOverflowItemControl();
        // Act
        const sId = NewExperience.getOverflowItemId();
        // Assert
        assert.ok(sId, "id is not null");
        assert.strictEqual(sId, oOverflowItem.getId(), "The correct id was returned");
    });

    QUnit.module("isActive", {
        beforeEach: async function () {
            this.oControl = new Button();
        },
        afterEach: async function () {
            this.oControl.destroy();
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Returns false initially", async function (assert) {
        // Act
        const bIsActive = NewExperience.isActive();
        // Assert
        assert.strictEqual(bIsActive, false, "isActive returns false initially");
    });

    QUnit.test("Returns true once a control was registered", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        // Act
        const bIsActive = NewExperience.isActive();
        // Assert
        assert.strictEqual(bIsActive, true, "isActive returns true after registering a control");
    });

    QUnit.module("getShellHeaderControl", {
        beforeEach: async function () {
            this.oControl = new Button();
        },
        afterEach: async function () {
            this.oControl.destroy();
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Returns empty value initially", async function (assert) {
        // Act
        const oControl = NewExperience.getShellHeaderControl();
        // Assert
        assert.strictEqual(!!oControl, false, "getShellHeaderControl returns empty value initially");
    });

    QUnit.test("Returns the registered control", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        // Act
        const oReturnedControl = NewExperience.getShellHeaderControl();
        // Assert
        assert.strictEqual(oReturnedControl, this.oControl, "getShellHeaderControl returns the registered control");
    });

    QUnit.module("getOverflowItemControl", {
        beforeEach: async function () {
            this.oControl = new Button();
        },
        afterEach: async function () {
            this.oControl.destroy();
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Returns a ListItem control", async function (assert) {
        // Act
        const oOverflowItem = NewExperience.getOverflowItemControl();
        // Assert
        assert.ok(oOverflowItem.isA("sap.m.ListItemBase"), "getOverflowItemControl returns a ListItem control");
    });

    QUnit.test("Is initially invisible", async function (assert) {
        // Act
        const oOverflowItem = NewExperience.getOverflowItemControl();
        // Assert
        const bVisible = oOverflowItem.getVisible();
        assert.strictEqual(bVisible, false, "control is invisible");
    });

    QUnit.test("Is initially invisible after control was set", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        // Act
        const oOverflowItem = NewExperience.getOverflowItemControl();
        // Assert
        const bVisible = oOverflowItem.getVisible();
        assert.strictEqual(bVisible, false, "control is invisible");
    });

    QUnit.test("Is visible after showInOverflow", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        NewExperience.showInOverflow();
        // Act
        const oOverflowItem = NewExperience.getOverflowItemControl();
        // Assert
        const bVisible = oOverflowItem.getVisible();
        assert.strictEqual(bVisible, true, "control is visible");
    });

    QUnit.test("Is invisible after showInOverflow and setSwitchVisibility(false)", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        NewExperience.showInOverflow();
        NewExperience.setSwitchVisibility(false);
        // Act
        const oOverflowItem = NewExperience.getOverflowItemControl();
        // Assert
        const bVisible = oOverflowItem.getVisible();
        assert.strictEqual(bVisible, false, "control is invisible");
    });

    QUnit.test("Control renders the shellHeader control", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        NewExperience.showInOverflow();
        // Act
        const oOverflowItem = NewExperience.getOverflowItemControl();
        oOverflowItem.placeAt("qunit-fixture");
        await nextUIUpdate();
        // Assert
        const oControlDomRef = this.oControl.getDomRef();
        assert.ok(oControlDomRef, "Control was rendered");
        const oOverflowItemDomRef = oOverflowItem.getDomRef();
        oOverflowItemDomRef.contains(oControlDomRef);
    });


    QUnit.module("/showInShellHeader", {
        beforeEach: async function () {
            this.oControl = new Button();
        },
        afterEach: async function () {
            this.oControl.destroy();
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Is false initially", async function (assert) {
        // Assert
        const bShowInShellHeader = NewExperience.getModel().getProperty("/showInShellHeader");
        assert.strictEqual(bShowInShellHeader, false, "showInShellHeader is false");
    });

    QUnit.test("Is true initially after control was set", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        // Assert
        const bShowInShellHeader = NewExperience.getModel().getProperty("/showInShellHeader");
        assert.strictEqual(bShowInShellHeader, true, "showInShellHeader is true");
    });

    QUnit.test("Is false with showInOverflow", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        // Act
        NewExperience.showInOverflow();
        // Assert
        const bShowInShellHeader = NewExperience.getModel().getProperty("/showInShellHeader");
        assert.strictEqual(bShowInShellHeader, false, "showInShellHeader is false");
    });

    QUnit.test("Is true with showInShellHeader", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        NewExperience.showInOverflow();
        // Act
        NewExperience.showInShellHeader();
        // Assert
        const bShowInShellHeader = NewExperience.getModel().getProperty("/showInShellHeader");
        assert.strictEqual(bShowInShellHeader, true, "showInShellHeader is true");
    });

    QUnit.module("activeChanged", {
        beforeEach: async function () {
            this.oControl = new Button();
        },
        afterEach: async function () {
            this.oControl.destroy();
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("activeChanged is fired after setSwitchControl was called", async function (assert) {
        // Arrange
        const oHandler = sandbox.stub();
        NewExperience.attachActiveChanged(oHandler);
        // Act
        NewExperience.setSwitchControl(this.oControl);
        // Assert
        assert.strictEqual(oHandler.callCount, 1, "handler was called");
    });

    QUnit.test("detachActiveChanged", async function (assert) {
        // Arrange
        const oHandler = sandbox.stub();
        NewExperience.attachActiveChanged(oHandler);
        // Act
        NewExperience.detachActiveChanged(oHandler);
        NewExperience.setSwitchControl(this.oControl);
        // Assert
        assert.strictEqual(oHandler.callCount, 0, "handler was not called");
    });

    QUnit.module("setSwitchControl", {
        beforeEach: async function () {
            this.oControl = new Button();
        },
        afterEach: async function () {
            this.oControl.destroy();
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Sets NewExperience to active", async function (assert) {
        // Act
        NewExperience.setSwitchControl(this.oControl);
        // Assert
        const bActive = NewExperience.isActive();
        assert.strictEqual(bActive, true, "NewExperience is active");
    });

    QUnit.test("Sets NewExperience to inactive when called with no control", async function (assert) {
        // Act
        NewExperience.setSwitchControl();
        // Assert
        const bActive = NewExperience.isActive();
        assert.strictEqual(bActive, false, "NewExperience is active");
    });

    QUnit.test("Sets ShellHeader control to visible", async function (assert) {
        // Act
        NewExperience.setSwitchControl(this.oControl);
        // Assert
        const bShellHeaderVisible = NewExperience.getShellHeaderControl().getVisible();
        const bOverflowItemVisible = NewExperience.getOverflowItemControl().getVisible();
        assert.strictEqual(bShellHeaderVisible, true, "Shell header control is visible");
        assert.strictEqual(bOverflowItemVisible, false, "Overflow item control is invisible");
    });

    QUnit.test("Sets both control to visible for overflow state", async function (assert) {
        // Arrange
        NewExperience.showInOverflow();
        // Act
        NewExperience.setSwitchControl(this.oControl);
        // Assert
        const bShellHeaderVisible = NewExperience.getShellHeaderControl().getVisible();
        const bOverflowItemVisible = NewExperience.getOverflowItemControl().getVisible();
        assert.strictEqual(bShellHeaderVisible, true, "Shell header control is visible");
        assert.strictEqual(bOverflowItemVisible, true, "Overflow item control is visible");
    });

    QUnit.module("setSwitchVisibility", {
        beforeEach: async function () {
            this.oControl = new Button();
        },
        afterEach: async function () {
            this.oControl.destroy();
            NewExperience.reset();
            sandbox.restore();
        }
    });

    QUnit.test("Hides overflow control is invisible for header state", async function (assert) {
        // Arrange
        NewExperience.setSwitchControl(this.oControl);
        // Act
        NewExperience.setSwitchVisibility(false);
        // Assert
        const bShellHeaderVisible = NewExperience.getShellHeaderControl().getVisible();
        const bOverflowItemVisible = NewExperience.getOverflowItemControl().getVisible();
        assert.strictEqual(bShellHeaderVisible, true, "Shell header control is visible");
        assert.strictEqual(bOverflowItemVisible, false, "Overflow item control is invisible");
    });

    QUnit.test("Hides overflow control is invisible for overflow state", async function (assert) {
        // Arrange
        NewExperience.showInOverflow();
        NewExperience.setSwitchControl(this.oControl);
        // Act
        NewExperience.setSwitchVisibility(false);
        // Assert
        const bShellHeaderVisible = NewExperience.getShellHeaderControl().getVisible();
        const bOverflowItemVisible = NewExperience.getOverflowItemControl().getVisible();
        assert.strictEqual(bShellHeaderVisible, true, "Shell header control is visible");
        assert.strictEqual(bOverflowItemVisible, false, "Overflow item control is invisible");
    });
});

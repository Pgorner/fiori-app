// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.StateRules
 */
sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/core/Element",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/StateRules"
], function (
    deepClone,
    Element,
    StateManager,
    StateRules
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    const sandbox = sinon.createSandbox();

    const oBaseStateData = {
        sidePane: {
            visible: false,
            items: []
        },
        toolArea: {
            visible: false,
            items: []
        },
        rightFloatingContainer: {
            visible: false,
            items: []
        },
        floatingContainer: {
            visible: false,
            items: []
        },
        userActions: {
            items: []
        },
        floatingActions: {
            items: []
        },
        header: {
            visible: true,
            home: {
                showLogo: true
            },
            secondTitle: "",
            headItems: [],
            centralAreaElement: null,
            headEndItems: []
        },
        subHeader: {
            items: []
        },
        footer: {
            content: ""
        },
        application: {
            title: "",
            icon: "",
            subTitle: "",
            relatedApps: [],
            hierarchy: []
        }
    };

    QUnit.module("ShellMode: Header visibility", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
            StateRules.setShellConfig({});

            this.oStateHome = deepClone(oBaseStateData);
            this.oStateApp = deepClone(oBaseStateData);
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("Header on Default", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Default, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Header on Default is not enforced", async function (assert) {
        // Arrange
        this.oStateHome.header.visible = false;
        this.oStateApp.header.visible = false;
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Default, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Header on Standalone", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Standalone, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Standalone, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Header on Embedded", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Embedded, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Embedded, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Header on Merged", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Merged, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Merged, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Header on Headerless is enforced to invisible", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Headerless, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Headerless, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Header on Lean", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Lean, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Lean, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Header on Blank", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Blank, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Blank, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Header on Minimal", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Minimal, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Minimal, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.visible, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.visible, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.module("ShellMode: Logo visibility", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
            StateRules.setShellConfig({});

            this.oStateHome = deepClone(oBaseStateData);
            this.oStateApp = deepClone(oBaseStateData);
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("Logo on Default", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Default, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.home.showLogo, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.home.showLogo, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Logo on Standalone", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Standalone, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Standalone, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.home.showLogo, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.home.showLogo, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Logo on Embedded", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Embedded, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Embedded, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.home.showLogo, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.home.showLogo, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Logo on Merged", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Merged, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Merged, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.home.showLogo, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.home.showLogo, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Logo on Headerless", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Headerless, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Headerless, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.home.showLogo, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.home.showLogo, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Logo on Lean", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Lean, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Lean, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.home.showLogo, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.home.showLogo, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Logo on Blank", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Blank, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Blank, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.home.showLogo, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.home.showLogo, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Logo on Minimal", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Minimal, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Minimal, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.home.showLogo, bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.home.showLogo, bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.module("ShellMode: Back button visibility", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
            StateRules.setShellConfig({});

            this.oStateHome = deepClone(oBaseStateData);
            this.oStateApp = deepClone(oBaseStateData);

            this.oStateHome.header.headItems = ["backBtn"];
            this.oStateApp.header.headItems = ["backBtn"];
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("Back button on Default", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Default, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headItems.includes("backBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headItems.includes("backBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Back button on Standalone", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Standalone, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Standalone, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headItems.includes("backBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headItems.includes("backBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Back button on Embedded", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Embedded, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Embedded, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headItems.includes("backBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headItems.includes("backBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Back button on Merged", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Merged, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Merged, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headItems.includes("backBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headItems.includes("backBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Back button on Headerless", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Headerless, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Headerless, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headItems.includes("backBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headItems.includes("backBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Back button on Lean", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Lean, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Lean, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headItems.includes("backBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headItems.includes("backBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Back button on Blank", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Blank, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Blank, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headItems.includes("backBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headItems.includes("backBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Back button on Minimal", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Minimal, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Minimal, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headItems.includes("backBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headItems.includes("backBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.module("ShellMode: User action menu visibility", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
            StateRules.setShellConfig({});

            this.oStateHome = deepClone(oBaseStateData);
            this.oStateApp = deepClone(oBaseStateData);

            this.oStateHome.header.headEndItems = ["userActionsMenuHeaderButton"];
            this.oStateApp.header.headEndItems = ["userActionsMenuHeaderButton"];
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("User action menu on Default", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Default, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User action menu on Standalone", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Standalone, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Standalone, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User action menu on Embedded", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Embedded, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Embedded, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User action menu on Merged", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Merged, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Merged, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User action menu on Headerless", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Headerless, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Headerless, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User action menu on Lean", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Lean, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Lean, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User action menu on Blank", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Blank, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Blank, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User action menu on Minimal", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Minimal, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Minimal, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("userActionsMenuHeaderButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.module("ShellMode: App finder visibility", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
            StateRules.setShellConfig({});

            this.oStateHome = deepClone(oBaseStateData);
            this.oStateApp = deepClone(oBaseStateData);

            this.oStateHome.userActions.items = ["openCatalogBtn"];
            this.oStateApp.userActions.items = ["openCatalogBtn"];
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("App finder on Default", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Default, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("App finder on Standalone", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Standalone, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Standalone, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("App finder on Embedded", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Embedded, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Embedded, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("App finder on Merged", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Merged, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Merged, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("App finder on Headerless", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Headerless, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Headerless, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("App finder on Lean", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Lean, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Lean, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("App finder on Blank", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Blank, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Blank, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("App finder on Minimal", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Minimal, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Minimal, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("openCatalogBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.module("ShellMode: User settings visibility", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
            StateRules.setShellConfig({});

            this.oStateHome = deepClone(oBaseStateData);
            this.oStateApp = deepClone(oBaseStateData);

            this.oStateHome.userActions.items = ["userSettingsBtn"];
            this.oStateApp.userActions.items = ["userSettingsBtn"];
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("User settings on Default", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Default, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User settings on Standalone", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Standalone, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Standalone, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User settings on Embedded", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Embedded, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Embedded, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User settings on Merged", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Merged, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Merged, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User settings on Headerless", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Headerless, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Headerless, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User settings on Lean", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Lean, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Lean, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User settings on Blank", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Blank, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Blank, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("User settings on Minimal", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Minimal, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Minimal, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.userActions.items.includes("userSettingsBtn"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.module("ShellMode: Notifications visibility", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
            StateRules.setShellConfig({});

            this.oStateHome = deepClone(oBaseStateData);
            this.oStateApp = deepClone(oBaseStateData);

            this.oStateHome.header.headEndItems = ["NotificationsCountButton"];
            this.oStateApp.header.headEndItems = ["NotificationsCountButton"];
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("Notifications on Default", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Default, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Default, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Notifications on Standalone", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Standalone, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Standalone, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Notifications on Embedded", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Embedded, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Embedded, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Notifications on Merged", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Merged, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Merged, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Notifications on Headerless", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Headerless, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Headerless, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Notifications on Lean", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Lean, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Lean, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Notifications on Blank", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = false;
        const bShouldBeVisibleOnApp = false;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Blank, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Blank, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.test("Notifications on Minimal", async function (assert) {
        // Arrange
        const bShouldBeVisibleOnHome = true;
        const bShouldBeVisibleOnApp = true;
        // Act
        StateRules.applyRules(this.oStateHome, ShellMode.Minimal, LaunchpadState.Home);
        StateRules.applyRules(this.oStateApp, ShellMode.Minimal, LaunchpadState.App);
        // Assert
        assert.strictEqual(this.oStateHome.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnHome, "The visibility is correct on home");
        assert.strictEqual(this.oStateApp.header.headEndItems.includes("NotificationsCountButton"), bShouldBeVisibleOnApp, "The visibility is correct on app");
    });

    QUnit.module("UserAction to ShellHeadEndItem", {
        beforeEach: async function () {
            sandbox.stub(Element, "getElementById").returns({ id: "controlId" });
            StateRules.setShellConfig({});

            this.oStateData = deepClone(oBaseStateData);
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("Handles moveAppFinderActionToShellHeader if item is available", async function (assert) {
        // Arrange
        StateRules.setShellConfig({
            moveAppFinderActionToShellHeader: true
        });
        this.oStateData.userActions.items = ["openCatalogBtn"];
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("openCatalogBtn"), true, "The item is moved to headEndItems");
        assert.strictEqual(this.oStateData.userActions.items.includes("openCatalogBtn"), false, "The item is removed from userActions");
    });

    QUnit.test("Ignores moveAppFinderActionToShellHeader if item is not available", async function (assert) {
        // Arrange
        StateRules.setShellConfig({
            moveAppFinderActionToShellHeader: true
        });
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("openCatalogBtn"), false, "The item was not added");
        assert.strictEqual(this.oStateData.userActions.items.includes("openCatalogBtn"), false, "The item was not added");
    });

    QUnit.test("Handles moveUserSettingsActionToShellHeader if item is available", async function (assert) {
        // Arrange
        StateRules.setShellConfig({
            moveUserSettingsActionToShellHeader: true
        });
        this.oStateData.userActions.items = ["userSettingsBtn"];
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("userSettingsBtn"), true, "The item is moved to headEndItems");
        assert.strictEqual(this.oStateData.userActions.items.includes("userSettingsBtn"), false, "The item is removed from userActions");
    });

    QUnit.test("Ignores moveUserSettingsActionToShellHeader if item is not available", async function (assert) {
        // Arrange
        StateRules.setShellConfig({
            moveUserSettingsActionToShellHeader: true
        });
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("userSettingsBtn"), false, "The item was not added");
        assert.strictEqual(this.oStateData.userActions.items.includes("userSettingsBtn"), false, "The item was not added");
    });

    QUnit.test("Handles moveContactSupportActionToShellHeader if item is available", async function (assert) {
        // Arrange
        StateRules.setShellConfig({
            moveContactSupportActionToShellHeader: true
        });
        this.oStateData.userActions.items = ["ContactSupportBtn"];
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("ContactSupportBtn"), true, "The item is moved to headEndItems");
        assert.strictEqual(this.oStateData.userActions.items.includes("ContactSupportBtn"), false, "The item is removed from userActions");
    });

    QUnit.test("Ignores moveContactSupportActionToShellHeader if item is not available", async function (assert) {
        // Arrange
        StateRules.setShellConfig({
            moveContactSupportActionToShellHeader: true
        });
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("ContactSupportBtn"), false, "The item was not added");
        assert.strictEqual(this.oStateData.userActions.items.includes("ContactSupportBtn"), false, "The item was not added");
    });

    QUnit.test("Can handle all move configurations", async function (assert) {
        // Arrange
        StateRules.setShellConfig({
            moveAppFinderActionToShellHeader: true,
            moveUserSettingsActionToShellHeader: true,
            moveContactSupportActionToShellHeader: true
        });
        this.oStateData.userActions.items = [
            "openCatalogBtn",
            "userSettingsBtn",
            "ContactSupportBtn"
        ];
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("openCatalogBtn"), true, "The item is moved to headEndItems");
        assert.strictEqual(this.oStateData.userActions.items.includes("openCatalogBtn"), false, "The item is removed from userActions");

        assert.strictEqual(this.oStateData.header.headEndItems.includes("userSettingsBtn"), true, "The item is moved to headEndItems");
        assert.strictEqual(this.oStateData.userActions.items.includes("userSettingsBtn"), false, "The item is removed from userActions");

        assert.strictEqual(this.oStateData.header.headEndItems.includes("ContactSupportBtn"), true, "The item is moved to headEndItems");
        assert.strictEqual(this.oStateData.userActions.items.includes("ContactSupportBtn"), false, "The item is removed from userActions");
    });

    QUnit.test("Ignores configurations if they weren't initialized", async function (assert) {
        // Arrange
        StateRules.reset();
        this.oStateData.userActions.items = [
            "openCatalogBtn",
            "userSettingsBtn",
            "ContactSupportBtn"
        ];
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("openCatalogBtn"), false, "The item was not moved");
        assert.strictEqual(this.oStateData.userActions.items.includes("openCatalogBtn"), true, "The item is unchanged");

        assert.strictEqual(this.oStateData.header.headEndItems.includes("userSettingsBtn"), false, "The item was not moved");
        assert.strictEqual(this.oStateData.userActions.items.includes("userSettingsBtn"), true, "The item is unchanged");

        assert.strictEqual(this.oStateData.header.headEndItems.includes("ContactSupportBtn"), false, "The item was not moved");
        assert.strictEqual(this.oStateData.userActions.items.includes("ContactSupportBtn"), true, "The item is unchanged");
    });

    QUnit.test("Does not interact with ShellModes removing the entries", async function (assert) {
        // Arrange
        StateRules.setShellConfig({
            moveAppFinderActionToShellHeader: true,
            moveUserSettingsActionToShellHeader: true,
            moveContactSupportActionToShellHeader: true
        });
        this.oStateData.userActions.items = [
            "openCatalogBtn",
            "userSettingsBtn",
            "ContactSupportBtn"
        ];
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Headerless, LaunchpadState.Home);
        // Assert
        assert.strictEqual(this.oStateData.header.headEndItems.includes("openCatalogBtn"), false, "The item was not moved");
        assert.strictEqual(this.oStateData.userActions.items.includes("openCatalogBtn"), false, "The item was removed");

        assert.strictEqual(this.oStateData.header.headEndItems.includes("userSettingsBtn"), false, "The item was not moved");
        assert.strictEqual(this.oStateData.userActions.items.includes("userSettingsBtn"), false, "The item was removed");

        assert.strictEqual(this.oStateData.header.headEndItems.includes("ContactSupportBtn"), true, "The item not moved");
        assert.strictEqual(this.oStateData.userActions.items.includes("ContactSupportBtn"), false, "The item was removed");
    });

    QUnit.module("SubHeader", {
        beforeEach: async function () {
            this.oStateData = deepClone(oBaseStateData);
        },
        afterEach: async function () {
            sandbox.restore();
            StateRules.reset();
        }
    });

    QUnit.test("Removes all items except the last", async function (assert) {
        // Arrange
        this.oStateData.subHeader.items = ["item1", "item2", "item3"];
        const aExpectedSubHeader = ["item3"];
        // Act
        StateRules.applyRules(this.oStateData, ShellMode.Default, LaunchpadState.Home);
        // Assert
        assert.deepEqual(this.oStateData.subHeader.items, aExpectedSubHeader, "The items were removed correctly");
    });
});

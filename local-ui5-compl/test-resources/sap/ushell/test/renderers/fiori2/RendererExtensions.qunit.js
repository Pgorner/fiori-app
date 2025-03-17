// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.RendererExtensions
 *
 * @deprecated since 1.119.0
 */
sap.ui.define([
    "sap/m/Bar",
    "sap/m/Button",
    "sap/ui/core/Core",
    "sap/ui/core/Theming",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/renderers/fiori2/RendererExtensions",
    "sap/ushell/renderer/utils",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/utils",
    "sap/ushell/test/utils",
    "sap/ushell/state/StateManager",
    "sap/ushell/state/ShellModel"
], (
    Bar,
    Button,
    Core,
    Theming,
    nextUIUpdate,
    jQuery,
    AppLifeCycleAI,
    Config,
    Container,
    EventHub,
    RendererExtensions,
    RendererUtils,
    ShellHeadItem,
    ushellUtils,
    testUtils,
    StateManager,
    ShellModel
) => {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.renderers.fiori2.RendererExtensions", {
        beforeEach: async function (assert) {
            QUnit.sap.ushell.createTestDomRef(); // used to place the Renderer

            await Container.init("local");

            this.oRendererControl = await Container.createRendererInternal("fiori2");
            this.oRendererControl.placeAt("qunit-canvas");

            sandbox.stub(Theming, "attachApplied");
            sandbox.stub(window.history, "back");
            this.oRm = Core.createRenderManager();

            await testUtils.waitForEventHubEvent("RendererLoaded");

            Config.emit("/core/shell/enableRecentActivity", false);
        },
        /*
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            const oToolAreaItem = Core.byId("toolareaitemtest");
            if (oToolAreaItem) {
                oToolAreaItem.destroy();
            }
            const oToolArea = Core.byId("shell-toolArea");
            if (oToolArea) {
                oToolArea.destroy();
            }

            return this.oRendererControl.destroy().then(() => {
                this.oRm.destroy();

                sandbox.restore();

                Container.reset();
                EventHub._reset();
                Config._resetContract();
                StateManager.resetAll();
            });
        }
    });

    function checkModelBooleanProperty (assert, sModelPath, bItemExpectedInHomeState, bItemExpectedInAppState) {
        const oShellModel = ShellModel.getModel();

        StateManager.switchState(LaunchpadState.Home);
        const homeProperty = oShellModel.getProperty(sModelPath);

        StateManager.switchState(LaunchpadState.App);
        const appProperty = oShellModel.getProperty(sModelPath);

        StateManager.switchState(LaunchpadState.App, ShellMode.Minimal);
        const minimalAppProperty = oShellModel.getProperty(sModelPath);

        StateManager.switchState(LaunchpadState.App, ShellMode.Standalone);
        const standaloneAppProperty = oShellModel.getProperty(sModelPath);

        StateManager.switchState(LaunchpadState.App, ShellMode.Embedded);
        const embeddedAppProperty = oShellModel.getProperty(sModelPath);

        if (bItemExpectedInHomeState) {
            assert.ok(homeProperty, `the property value is as expected (home-default): ${sModelPath}`);
        } else {
            assert.ok(!homeProperty, `the property value is as expected (home-default): ${sModelPath}`);
        }

        if (bItemExpectedInAppState) {
            assert.ok(appProperty, `the property value is as expected (app-default): ${sModelPath}`);
            assert.ok(minimalAppProperty, `the property value is as expected (app-minimal): ${sModelPath}`);
            assert.ok(standaloneAppProperty, `the property value is as expected (app-standalone): ${sModelPath}`);
            assert.ok(embeddedAppProperty, `the property value is as expected (app-embedded): ${sModelPath}`);
        } else {
            assert.ok(!appProperty, `the property value is as expected (app-default): ${sModelPath}`);
            assert.ok(!minimalAppProperty, `the property value is as expected (app-minimal): ${sModelPath}`);
            assert.ok(!standaloneAppProperty, `the property value is as expected (app-standalone): ${sModelPath}`);
            assert.ok(!embeddedAppProperty, `the property value is as expected (app-embedded): ${sModelPath}`);
        }
    }

    function checkItemModelPropertiesById (assert, oItemId, sModelPath, bItemExpectedInHomeState, bItemExpectedInAppState, bItemsMultiplexed) {
        const oShellModel = ShellModel.getModel();

        StateManager.switchState(LaunchpadState.Home);
        const homePropertyList = oShellModel.getProperty(sModelPath);

        StateManager.switchState(LaunchpadState.App);
        const appPropertyList = oShellModel.getProperty(sModelPath);

        StateManager.switchState(LaunchpadState.App, ShellMode.Minimal);
        const minimalAppPropertyList = oShellModel.getProperty(sModelPath);

        StateManager.switchState(LaunchpadState.App, ShellMode.Standalone);
        const standaloneAppPropertyList = oShellModel.getProperty(sModelPath);

        StateManager.switchState(LaunchpadState.App, ShellMode.Embedded);
        const embeddedAppPropertyList = oShellModel.getProperty(sModelPath);

        if (bItemExpectedInHomeState) {
            assert.ok(homePropertyList.includes(oItemId), `the new item is added to the model (home-default): ${sModelPath}`);
        } else {
            assert.notOk(homePropertyList.includes(oItemId), `the new item is not added to the model (home-default): ${sModelPath}`);
        }

        //in the app state we need to check all the app states
        if (bItemExpectedInAppState) {
            if (bItemsMultiplexed) {
                assert.notOk(appPropertyList.includes(oItemId), `the new item isn't added to the model (app-default): ${sModelPath } due to existence of a 'Reserved' item`);
            } else {
                assert.ok(appPropertyList.includes(oItemId), `the new item is added to the model (app-default): ${sModelPath}`);
            }
            assert.ok(minimalAppPropertyList.includes(oItemId), `the new item is added to the model (app-minimal): ${sModelPath}`);
            assert.ok(standaloneAppPropertyList.includes(oItemId), `the new item is added to the model (app-standalone): ${sModelPath}`);
        } else if (bItemsMultiplexed) {
            assert.ok(minimalAppPropertyList.includes(oItemId), `the new item is not added to the model (app-minimal): ${sModelPath}`);
            assert.ok(standaloneAppPropertyList.includes(oItemId), `the new item is not added to the model (app-standalone): ${sModelPath}`);
            assert.ok(embeddedAppPropertyList.includes(oItemId), `the new item is not added to the model (app-embedded): ${sModelPath}`);
        } else {
            assert.notOk(appPropertyList.includes(oItemId), `the new item is not added to the model (app-default): ${sModelPath}`);
            assert.notOk(minimalAppPropertyList.includes(oItemId), `the new item is not added to the model (app-minimal): ${sModelPath}`);
            assert.notOk(standaloneAppPropertyList.includes(oItemId), `the new item is not added to the model (app-standalone): ${sModelPath}`);
            assert.notOk(embeddedAppPropertyList.includes(oItemId), `the new item is not added to the model (app-embedded): ${sModelPath}`);
        }
    }

    function checkFooterExistInShellPage (assert, oFooter, bBarExpected) {
        const sFooterId = oFooter.getId();
        const oFooterDomNode = document.getElementById(sFooterId);

        if (bBarExpected) {
            assert.ok(oFooterDomNode, "The footer was rendered in the DOM.");
        } else {
            assert.notOk(oFooterDomNode, "The footer was not rendered in the DOM.");
        }
    }

    QUnit.test("test setLeftPaneVisibility", async (assert) => {
        // Arrange
        const oShellModel = ShellModel.getModel();
        AppLifeCycleAI.switchViewState("home");

        let bLeftPaneVisible = oShellModel.getProperty("/sidePane/visible");
        assert.ok(!bLeftPaneVisible, "validate isLeftPaneVisibility false");

        // Act
        RendererExtensions.setLeftPaneVisibility("home", true);

        // Assert
        bLeftPaneVisible = oShellModel.getProperty("/sidePane/visible");
        assert.ok(bLeftPaneVisible, "validate isLeftPaneVisibility true");
    });

    QUnit.test("test add current state", async (assert) => {
        // Arrange
        AppLifeCycleAI.switchViewState("home");

        // Act
        Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
            id: "mshideGroupsBtn"
        }, true, true);

        Container.getRenderer("fiori2").addSubHeader("sap.ushell.ui.launchpad.ActionItem", {
            id: "mshideGroupsBtn2"
        }, true, true);

        Container.getRenderer("fiori2").addFloatingActionButton("sap.ushell.ui.shell.ShellFloatingAction", {
            id: "msfloatingActionBtn",
            icon: "sap-icon://edit"
        }, true, true);

        Container.getRenderer("fiori2").addLeftPaneContent("sap.m.Button", {
            id: "mslefttest"
        }, true, true);

        Container.getRenderer("fiori2").addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {
            id: "msheaditemtest"
        }, true, true);

        Container.getRenderer("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
            id: "msheadenditemtest"
        }, true, true);

        Container.getRenderer("fiori2").addToolAreaItem({ id: "toolareaitemtest" }, true, true);

        // Assert
        assert.ok(Core.byId("mshideGroupsBtn"), "renderer managed object for mshideGroupsBtn");
        assert.ok(Core.byId("mshideGroupsBtn2"), "renderer managed object for mshideGroupsBtn2");
        assert.ok(Core.byId("msfloatingActionBtn"), "renderer managed object for msfloatingActionBtn");
        assert.ok(Core.byId("mslefttest"), "renderer managed object for mslefttest");
        assert.ok(Core.byId("msheaditemtest"), "renderer managed object for msheaditemtest");
        assert.ok(Core.byId("msheadenditemtest"), "renderer managed object for msheadenditemtest");
        assert.ok(Core.byId("toolareaitemtest"), "renderer managed object for toolareaitemtest");

        sandbox.stub(AppLifeCycleAI, "_calculateKeepAliveMode").returns("restricted");

        AppLifeCycleAI.switchViewState("app");
        assert.ok(Core.byId("mshideGroupsBtn"), "renderer managed object for mshideGroupsBtn, still available in home state");
        assert.ok(Core.byId("mshideGroupsBtn2"), "renderer managed object for mshideGroupsBtn2, still available in home state");
        assert.ok(Core.byId("msfloatingActionBtn"), "renderer managed object for msfloatingActionBtn, still available in home state");
        assert.ok(Core.byId("mslefttest"), "renderer managed object for mslefttest, still available in home state");
        assert.ok(Core.byId("msheaditemtest"), "renderer managed object for msheaditemtest, still available in home state");
        assert.ok(Core.byId("msheadenditemtest"), "renderer managed object for msheadenditemtest, still available in home state");
        assert.ok(Core.byId("toolareaitemtest"), "renderer managed object for toolareaitemtest, still available in home state");
    });

    QUnit.test("test all add without states", (assert) => {
        // Act
        Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
            id: "hideGroupsBtn"
        }, true, false);

        Container.getRenderer("fiori2").addSubHeader("sap.ushell.ui.launchpad.ActionItem", {
            id: "hideGroupsBtn2"
        }, true, false);

        Container.getRenderer("fiori2").addFloatingActionButton("sap.ushell.ui.shell.ShellFloatingAction", {
            id: "floatingActionBtn",
            icon: "sap-icon://edit"
        }, true, false);

        Container.getRenderer("fiori2").addLeftPaneContent("sap.m.Button", {
            id: "lefttest"
        }, true, false);

        Container.getRenderer("fiori2").addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {
            id: "headitemtest"
        }, true, false);

        Container.getRenderer("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
            id: "headenditemtest"
        }, true, false);

        // Assert
        checkItemModelPropertiesById(assert, "hideGroupsBtn", "/userActions/items", true, true);
        checkItemModelPropertiesById(assert, "hideGroupsBtn2", "/subHeader/items", true, true);
        checkItemModelPropertiesById(assert, "floatingActionBtn", "/floatingActions/items", true, true);
        checkItemModelPropertiesById(assert, "lefttest", "/sidePane/items", true, true);
        checkItemModelPropertiesById(assert, "headenditemtest", "/header/headEndItems", true, true, false, true);
    });

    QUnit.test("Add tool area item without states", (assert) => {
        // Act
        Container.getRenderer("fiori2").addToolAreaItem({ id: "toolareaitemtest" }, true, false);
        // Assert
        checkItemModelPropertiesById(assert, "toolareaitemtest", "/toolArea/items", true, true);
    });

    QUnit.test("test add Tool Area Item to app state", (assert) => {
        // Act
        Container.getRenderer("fiori2").addToolAreaItem({ id: "toolareaitemtest" }, true, false, ["app"]);
        // Assert
        checkItemModelPropertiesById(assert, "toolareaitemtest", "/toolArea/items", false, true);
    });

    QUnit.test("test add Tool Area Item to home state", (assert) => {
        // Act
        Container.getRenderer("fiori2").addToolAreaItem({ id: "toolareaitemtest" }, true, false, ["home"]);
        // Assert
        checkItemModelPropertiesById(assert, "toolareaitemtest", "/toolArea/items", true, false);
    });

    QUnit.test("test removeToolAreaItem without states", (assert) => {
        // Arrange
        const oRenderer = Container.getRenderer("fiori2");
        oRenderer.addToolAreaItem({ id: "toolareaitemtest" }, true, true);
        // Act
        oRenderer.removeToolAreaItem("toolareaitemtest", true);
        // Assert
        checkItemModelPropertiesById(assert, "toolareaitemtest", "/toolArea/items", false, false);
    });

    [{
        description: "case: added and remove - app state",
        aStatesAdded: ["app"],
        aStatesRemove: ["app"],
        bInHomeState: false,
        bInAppState: false
    }, {
        description: "added and removed - home state",
        aStatesAdded: ["home"],
        aStatesRemove: ["home"],
        bInHomeState: false,
        bInAppState: false
    }, {
        description: "added to app/home state removed from home state only",
        aStatesAdded: ["home", "app"],
        aStatesRemove: ["home"],
        bInHomeState: false,
        bInAppState: true
    }].forEach((oFix) => {
        QUnit.test(`test removeToolAreaItem from different states ${oFix.description}`, (assert) => {
            // Arrange
            const oRenderer = Container.getRenderer("fiori2");
            oRenderer.addToolAreaItem({ id: "toolareaitemtest" }, true, false, oFix.aStatesAdded);
            // Act
            oRenderer.removeToolAreaItem(["toolareaitemtest"], false, oFix.aStatesRemove);
            // Assert
            checkItemModelPropertiesById(assert, "toolareaitemtest", "/toolArea/items", oFix.bInHomeState, oFix.bInAppState);
        });
    });

    QUnit.test("test showToolArea with different states", (assert) => {
        // Arrange
        const oRenderer = Container.getRenderer("fiori2");
        // Act
        oRenderer.showToolArea("home", true);
        // Assert
        checkModelBooleanProperty(assert, "/toolArea/visible", true, false);
        // Act
        oRenderer.showToolArea("home", false);
        // Assert
        checkModelBooleanProperty(assert, "/toolArea/visible", false, false);
    });

    QUnit.test("test addHeaderItem without states", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderItem(headItem1);
        // Assert
        // 3 items can be in the headeritems aggregation
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, true, false, true);
    });

    QUnit.test("test addHeaderItem with 1 state", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderItem(headItem1, RendererExtensions.LaunchpadState.Home);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, false, false, true);
    });

    QUnit.test("test addHeaderItem with 2 states", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderItem(headItem1, RendererExtensions.LaunchpadState.Home, RendererExtensions.LaunchpadState.App);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, true, false, true);
    });

    QUnit.test("test addHeaderItem with 3 states", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderItem(
            headItem1,
            RendererExtensions.LaunchpadState.Home,
            RendererExtensions.LaunchpadState.App,
            RendererExtensions.LaunchpadState.App
        );
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, true, false, true);
    });

    QUnit.test("test addHeaderEndItem without states", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderEndItem(headItem1);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", true, true, false, true);
    });

    QUnit.test("test addHeaderEndItem with 1 state", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderEndItem(headItem1, RendererExtensions.LaunchpadState.Home);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", true, false, false, true);
    });

    QUnit.test("test addHeaderEndItem with 2 states", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderEndItem(headItem1, RendererExtensions.LaunchpadState.Home, RendererExtensions.LaunchpadState.App);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", true, true, false, true);
    });

    QUnit.test("test addHeaderEndItem with 3 states", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderEndItem(
            headItem1,
            RendererExtensions.LaunchpadState.Home,
            RendererExtensions.LaunchpadState.App,
            RendererExtensions.LaunchpadState.App
        );
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", true, true, false, true);
    });

    QUnit.test("test addHeaderItem the second time - with 1 state", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem("firstItem1state");
        const headItem2 = new ShellHeadItem("secondItem1state");
        // Act
        RendererExtensions.addHeaderItem(headItem1);
        RendererExtensions.addHeaderItem(headItem2, RendererExtensions.LaunchpadState.Home);
        // Assert
        checkItemModelPropertiesById(assert, headItem2.getId(), "/header/headItems", true, false, false, true);
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, true, false, true);
    });

    QUnit.test("test addHeaderItem the second time - with all state", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem("firstItemAppstate");
        const headItem2 = new ShellHeadItem("secondItemAppstate");
        // Act
        RendererExtensions.addHeaderItem(headItem1);
        RendererExtensions.addHeaderItem(headItem2);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, true, false, true);
        checkItemModelPropertiesById(assert, headItem2.getId(), "/header/headItems", true, true, false, true);
    });

    QUnit.test("test addHeaderEndItem the second time - with 1 state", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem("firstEndItem1state");
        const headItem2 = new ShellHeadItem("secondEndItem1state");
        // Act
        RendererExtensions.addHeaderEndItem(headItem1);
        RendererExtensions.addHeaderEndItem(headItem2, RendererExtensions.LaunchpadState.Home);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", true, true, false, true);
        checkItemModelPropertiesById(assert, headItem2.getId(), "/header/headEndItems", true, false, false, true);
    });

    QUnit.test("test removeHeaderItem without states", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        RendererExtensions.addHeaderItem(headItem1);
        // Act
        RendererExtensions.removeHeaderItem(headItem1);
        // Assert
        //if we add to app state and nested states of app (minimal, standalone), we need to remove it from nested state as well
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", false, false, false, true);
    });

    QUnit.test("test removeHeaderEndItem without states", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        RendererExtensions.addHeaderEndItem(headItem1);
        // Act
        RendererExtensions.removeHeaderEndItem(headItem1);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", false, false, false, true);
    });

    QUnit.test("test removeHeaderItem with state", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        RendererExtensions.addHeaderItem(headItem1);
        // Act
        RendererExtensions.removeHeaderItem(headItem1, RendererExtensions.LaunchpadState.App);
        // Assert
        //if we add to app state and nested states of app (minimal, standalone), we need to remove it from nested state as well
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, false, false, true);
    });

    QUnit.test("test removeHeaderEndItem with state", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        RendererExtensions.addHeaderEndItem(headItem1);
        // Act
        RendererExtensions.removeHeaderEndItem(headItem1, RendererExtensions.LaunchpadState.App);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", true, false, false, true);
    });

    QUnit.test("test addHeaderItem without states - with UI5 ShellHeadItem control", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderItem(headItem1);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, true, false, true);
    });

    QUnit.test("test addHeaderEndItem without states - with UI5 ShellHeadItem control", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        // Act
        RendererExtensions.addHeaderEndItem(headItem1);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", true, true, false, true);
    });

    QUnit.test("test removeHeaderItem without states - with UI5 ShellHeadItem control", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        RendererExtensions.addHeaderItem(headItem1);
        // Act
        RendererExtensions.removeHeaderItem(headItem1);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", false, false, false, true);
    });

    QUnit.test("test removeHeaderEndItem without states - with UI5 ShellHeadItem control", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        RendererExtensions.addHeaderEndItem(headItem1);
        // Act
        RendererExtensions.removeHeaderEndItem(headItem1);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", false, false, false, true);
    });

    QUnit.test("test exceptions with illegal state", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem();
        const button1 = new Button();
        // Act & Assert
        assert.throws(() => {
            RendererExtensions.addHeaderItem(headItem1, "test");
        }, "addHeaderItem - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addHeaderEndItem(headItem1, "test");
        }, "addHeaderEndItem - exception was thrown");
        assert.throws(() => {
            RendererExtensions.removeHeaderItem(headItem1, "test");
        }, "removeHeaderItem - exception was thrown");
        assert.throws(() => {
            RendererExtensions.removeHeaderEndItem(headItem1, "test");
        }, "removeHeaderEndItem - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addOptionsActionSheetButton(button1, "test");
        }, "addOptionsActionSheetButton- exception was thrown");
        assert.throws(() => {
            RendererExtensions.removeOptionsActionSheetButton(button1, "test");
        }, "removeOptionsActionSheetButton - exception was thrown");
    });

    QUnit.test("test exceptions with illegal item", (assert) => {
        // Arrange
        const item1 = {};
        // Act & Assert
        assert.throws(() => {
            RendererExtensions.addHeaderItem(item1);
        }, "addHeaderItem - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addHeaderEndItem(item1);
        }, "addHeaderEndItem - exception was thrown");
        assert.throws(() => {
            RendererExtensions.removeHeaderItem(item1);
        }, "removeHeaderItem - exception was thrown");
        assert.throws(() => {
            RendererExtensions.removeHeaderEndItem(item1);
        }, "removeHeaderEndItem - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addOptionsActionSheetButton(item1);
        }, "addOptionsActionSheetButton- exception was thrown");
        assert.throws(() => {
            RendererExtensions.removeOptionsActionSheetButton(item1);
        }, "removeOptionsActionSheetButton - exception was thrown");
        assert.throws(() => {
            RendererExtensions.setFooter(item1);
        }, "setFooter - exception was thrown");
    });

    QUnit.test("test removeHeadItem with an item that do not exists", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem("firstItemAdd");
        const headItem2 = new ShellHeadItem("secondItemRemove");
        RendererExtensions.addHeaderItem(headItem1);
        // Act
        RendererExtensions.removeHeaderItem(headItem2);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headItems", true, false, true, true);
        checkItemModelPropertiesById(assert, headItem2.getId(), "/header/headItems", false, false, false, true);
    });

    QUnit.test("test removeEndHeadItem with an item that do not exists", (assert) => {
        // Arrange
        const headItem1 = new ShellHeadItem("firstEndItemAdd");
        const headItem2 = new ShellHeadItem("secondEndItemRemove");
        RendererExtensions.addHeaderEndItem(headItem1);
        // Act
        RendererExtensions.removeHeaderEndItem(headItem2);
        // Assert
        checkItemModelPropertiesById(assert, headItem1.getId(), "/header/headEndItems", true, true, false, true);
        checkItemModelPropertiesById(assert, headItem2.getId(), "/header/headEndItems", false, false, false, true);
    });

    QUnit.test("test publishing public event", (assert) => {
        // Arrange
        const done = assert.async();
        Core.getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "testEvent", () => {
            // Assert
            assert.ok(true, "the event was thrown as expected");
            done();
        });
        // Act
        RendererUtils.publishExternalEvent("testEvent");
    });

    QUnit.test("test addOptionsActionSheetButton without states", (assert) => {
        // Arrange
        const button1 = new Button();
        // Act
        RendererExtensions.addOptionsActionSheetButton(button1);
        // Assert
        checkItemModelPropertiesById(assert, button1.getId(), "/userActions/items", true, true);
    });

    QUnit.test("test addOptionsActionSheetButton with 1 state", (assert) => {
        // Arrange
        const button1 = new Button();
        // Act
        RendererExtensions.addOptionsActionSheetButton(button1, RendererExtensions.LaunchpadState.Home);
        // Assert
        checkItemModelPropertiesById(assert, button1.getId(), "/userActions/items", true, false);
    });

    QUnit.test("test addOptionsActionSheetButton with 2 states", (assert) => {
        // Arrange
        const button1 = new Button();
        // Act
        RendererExtensions.addOptionsActionSheetButton(button1, RendererExtensions.LaunchpadState.Home, RendererExtensions.LaunchpadState.App);
        // Assert
        checkItemModelPropertiesById(assert, button1.getId(), "/userActions/items", true, true);
    });

    QUnit.test("test addOptionsActionSheetButton with 2 buttons", (assert) => {
        // Arrange
        const button1 = new Button();
        const button2 = new Button();
        // Act
        RendererExtensions.addOptionsActionSheetButton(button1);
        // Assert
        checkItemModelPropertiesById(assert, button1.getId(), "/userActions/items", true, true);
        // Act
        RendererExtensions.addOptionsActionSheetButton(button2, RendererExtensions.LaunchpadState.Home);
        // Assert
        checkItemModelPropertiesById(assert, button2.getId(), "/userActions/items", true, false);
    });

    QUnit.test("test removeOptionsActionSheetButton without states", (assert) => {
        // Arrange
        const button1 = new Button();
        RendererExtensions.addOptionsActionSheetButton(button1);
        // Act
        RendererExtensions.removeOptionsActionSheetButton(button1);
        // Assert
        checkItemModelPropertiesById(assert, button1.getId(), "/userActions/items", false, false);
    });

    QUnit.test("test removeOptionsActionSheetButton with states", (assert) => {
        // Arrange
        const button1 = new Button();
        RendererExtensions.addOptionsActionSheetButton(button1);
        // Act
        RendererExtensions.removeOptionsActionSheetButton(
            button1,
            RendererExtensions.LaunchpadState.Home,
            RendererExtensions.LaunchpadState.App,
            RendererExtensions.LaunchpadState.App
        );
        // Assert
        checkItemModelPropertiesById(assert, button1.getId(), "/userActions/items", false, false);
    });

    QUnit.test("test removeOptionsActionSheetButton with 2 states", (assert) => {
        // Arrange
        const button1 = new Button();
        RendererExtensions.addOptionsActionSheetButton(button1);
        // Act
        RendererExtensions.removeOptionsActionSheetButton(button1, RendererExtensions.LaunchpadState.Home, RendererExtensions.LaunchpadState.App);
        // Assert
        checkItemModelPropertiesById(assert, button1.getId(), "/userActions/items", false, false);
    });

    QUnit.test("test setFooter", async function (assert) {
        // Arrange
        const footer = new Bar();
        // Act
        RendererExtensions.setFooter(footer);
        await nextUIUpdate();
        // Assert
        checkFooterExistInShellPage.bind(this)(assert, footer, true);
    });

    QUnit.test("test setFooter the second time", async function (assert) {
        // Arrange
        const footer1 = new Bar("firstFooter");
        const footer2 = new Bar("secondFooter");
        // Act
        RendererExtensions.setFooter(footer1);
        await nextUIUpdate();
        RendererExtensions.setFooter(footer2);
        await nextUIUpdate();
        // Assert
        checkFooterExistInShellPage.bind(this)(assert, footer2, true);
        checkFooterExistInShellPage.bind(this)(assert, footer1, false);
    });

    QUnit.test("test destroyFooter", async function (assert) {
        // Arrange
        const footer = new Bar();
        RendererExtensions.setFooter(footer);
        await nextUIUpdate();
        // Act
        RendererExtensions.removeFooter();
        await nextUIUpdate();
        // Assert
        checkFooterExistInShellPage.bind(this)(assert, footer, false);
    });

    QUnit.test("test addUserPreferencesEntry - input validations", (assert) => {
        // Act & Assert
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry();
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry(null);
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry(undefined);
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry("test");
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ entryHelpID: "testId", value: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ entryHelpID: "testId", title: null, value: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ entryHelpID: "testId", title: undefined, value: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ entryHelpID: "testId", title: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ title: "test", value: null });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ title: "test", value: undefined });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ entryHelpID: "", title: "test", value: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ entryHelpID: 1, title: "test", value: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ entryHelpID: null, title: "test", value: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ title: QUnit.test, value: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ title: "test", value: "test", onSave: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ title: "test", value: "test", content: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesEntry({ title: "test", value: "test", onCancel: "test" });
        }, "addUserPreferencesEntry - exception was thrown");
    });

    QUnit.test("test addUserPreferencesEntry - positive test - add entry with mandatory fields", (assert) => {
        // Arrange
        const fnDone = assert.async();
        const userPrefEntriesArrayDefault = Config.last("/core/userPreferences/entries");
        const userPrefEntriesArrayDefaultLength = userPrefEntriesArrayDefault.length;
        const newEntry = { title: "testTitle", value: "testValue" };
        sandbox.stub(ushellUtils, "_getUid").returns("entryId");
        const newEntryInModel = {
            id: "entryId",
            entryHelpID: undefined,
            title: newEntry.title,
            valueArgument: newEntry.value,
            valueResult: null,
            onSave: undefined,
            onCancel: undefined,
            contentFunc: undefined,
            contentResult: null,
            icon: undefined,
            provideEmptyWrapper: undefined
        };
        // Act
        RendererExtensions.addUserPreferencesEntry(newEntry);
        // Assert
        Config.once("/core/userPreferences").do(() => {
            const userPrefEntriesArrayNew = Config.last("/core/userPreferences/entries");
            assert.deepEqual(userPrefEntriesArrayNew[userPrefEntriesArrayDefaultLength], newEntryInModel, "the new entry is added to the model: /userPreferences/entries");
            fnDone();
        });
    });

    QUnit.test("test addUserPreferencesEntry - positive test - add entry with all fields, check model", (assert) => {
        // Arrange
        const fnDone = assert.async();
        const userPrefEntriesArrayDefault = Config.last("/core/userPreferences/entries");
        const userPrefEntriesArrayDefaultLength = userPrefEntriesArrayDefault.length;
        sandbox.stub(ushellUtils, "_getUid").returns("entryId");
        const newEntry = {
            entryHelpID: "testId",
            title: "testTitle",
            value: function () { return new jQuery.Deferred().resolve("testValue"); },
            onSave: function () { return new jQuery.Deferred().resolve("testOnSave"); },
            onCancel: function () { return new jQuery.Deferred().resolve("testOnCancel"); },
            content: function () { return new jQuery.Deferred().resolve(new Button()); }
        };
        const newEntryInModel = {
            id: "entryId",
            entryHelpID: "testId",
            title: "testTitle",
            valueArgument: function () { return new jQuery.Deferred().resolve("testValue"); },
            valueResult: null,
            onSave: function () { return new jQuery.Deferred().resolve("testOnSave"); },
            onCancel: function () { return new jQuery.Deferred().resolve("testOnCancel"); },
            contentFunc: function () { return new jQuery.Deferred().resolve("testContent"); },
            contentResult: null
        };
        // Act
        RendererExtensions.addUserPreferencesEntry(newEntry);
        // Assert
        Config.once("/core/userPreferences").do(() => {
            const userPrefEntriesArrayNew = Config.last("/core/userPreferences/entries");
            //the new entry is added in the end of the array
            assert.strictEqual(
                JSON.stringify(userPrefEntriesArrayNew[userPrefEntriesArrayDefaultLength]),
                JSON.stringify(newEntryInModel),
                "the new entry is added to the model: /userPreferences/entries"
            );
            fnDone();
        });
    });

    QUnit.test("test addUserPreferencesGroupedEntry - input validations", (assert) => {
        // Act & Assert
        assert.throws(() => {
            RendererExtensions.addUserPreferencesGroupedEntry({
                title: "testTitle",
                value: "test"
            });
        }, "addUserPreferencesGroupedEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesGroupedEntry({
                title: "testTitle",
                value: "test",
                groupingId: 42,
                groupingTabTitle: "testTabTitle",
                groupingTabHelpId: "testTabHelpId"
            });
        }, "addUserPreferencesGroupedEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesGroupedEntry({
                title: "testTitle",
                value: "test",
                groupingId: "testGroup",
                groupingTabTitle: "",
                groupingTabHelpId: "testTabHelpId"
            });
        }, "addUserPreferencesGroupedEntry - exception was thrown");
        assert.throws(() => {
            RendererExtensions.addUserPreferencesGroupedEntry({
                title: "testTitle",
                value: "test",
                groupingId: "testGroup",
                groupingTabTitle: "testTabTitle",
                groupingTabHelpId: ""
            });
        }, "addUserPreferencesGroupedEntry - exception was thrown");
    });

    QUnit.test("test addUserPreferencesGroupedEntry - positive test - add grouped entry with mandatory fields", (assert) => {
        // Arrange
        sandbox.stub(ushellUtils, "_getUid").returns("entryId");
        const oNewEntry = {
            title: "testTitle",
            value: "testValue",
            groupingId: "testGroup",
            groupingTabTitle: "testTabTitle",
            groupingTabHelpId: "testTabHelpId"
        };
        sandbox.stub(Config, "emit");
        const aExpectedArguments = [
            [
                "/core/userPreferences/entries",
                [
                    {
                        id: "entryId",
                        entryHelpID: undefined,
                        title: "testTitle",
                        valueArgument: "testValue",
                        valueResult: null,
                        onSave: undefined,
                        onCancel: undefined,
                        contentFunc: undefined,
                        contentResult: null,
                        icon: undefined,
                        provideEmptyWrapper: undefined,
                        groupingEnablement: true,
                        groupingId: "testGroup",
                        groupingTabTitle: "testTabTitle",
                        groupingTabHelpId: "testTabHelpId"
                    }
                ]
            ]
        ];
        // Act
        RendererExtensions.addUserPreferencesGroupedEntry(oNewEntry);
        // Assert
        assert.deepEqual(Config.emit.args, aExpectedArguments, "the new entry is added to the model: /userPreferences/entries");
    });

    QUnit.test("test setHeaderTitle - positive Test", (assert) => {
        // Arrange
        const oShell = Core.byId("mainShell");
        const done = assert.async();
        // Act
        RendererExtensions.setHeaderTitle("testTitle");
        // Assert
        window.setTimeout(() => {
            assert.strictEqual(oShell.getShellHeader().getTitle(), "testTitle", "the title is added to the model: /title/");
            done();
        }, 50);
    });
});

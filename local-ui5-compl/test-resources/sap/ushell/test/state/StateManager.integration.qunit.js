// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit integration tests for sap.ushell.state.StateManager
 * These tests do not cover the entire functionality, but try to cover each approach and mechanism.
 */
sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/core/Element",
    "sap/ushell/Config",
    "sap/ushell/state/ControlManager",
    "sap/ushell/state/CurrentState",
    "sap/ushell/state/KeepAlive",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/utils"
], function (
    deepClone,
    Element,
    Config,
    ControlManager,
    CurrentState,
    KeepAlive,
    ShellModel,
    StateManager,
    ushellUtils
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

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
            state: "floating",
            dragSelector: "",
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

    QUnit.module("State update", {
        beforeEach: async function () {
            sandbox.stub(Config, "last");
            Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Default);
            sandbox.stub(ushellUtils, "isFlpHomeIntent").returns(true); // ensure LaunchpadState.Home

            // reset to apply changes from above
            StateManager.reset();
            StateManager.init({});

            this.oExpectedData = deepClone(oBaseStateData);

            // no item should be filtered out
            sandbox.stub(Element, "getElementById").returns({});
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
            CurrentState.flushState();
            ControlManager.flushList();
        }
    });

    QUnit.test("State without any changes", async function (assert) {
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Items are added correctly via CurrentState", async function (assert) {
        // Arrange
        this.oExpectedData.sidePane.items = ["sidePaneItem1"];
        this.oExpectedData.toolArea.items = ["toolAreaItem1"];
        this.oExpectedData.rightFloatingContainer.items = ["rightFloatingContainerItem1"];
        this.oExpectedData.floatingContainer.items = ["floatingContainer1"];
        this.oExpectedData.userActions.items = ["userActionsItem1"];
        this.oExpectedData.floatingActions.items = ["floatingActionsItem1"];
        this.oExpectedData.header.headItems = ["headItem1"];
        this.oExpectedData.header.headEndItems = ["headEndItem1"];
        this.oExpectedData.subHeader.items = ["subHeader1"];
        // Act
        StateManager.updateCurrentState("sidePane.items", Operation.Add, "sidePaneItem1");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "toolAreaItem1");
        StateManager.updateCurrentState("rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem1");
        StateManager.updateCurrentState("floatingContainer.items", Operation.Add, "floatingContainer1");
        StateManager.updateCurrentState("userActions.items", Operation.Add, "userActionsItem1");
        StateManager.updateCurrentState("floatingActions.items", Operation.Add, "floatingActionsItem1");
        StateManager.updateCurrentState("header.headItems", Operation.Add, "headItem1");
        StateManager.updateCurrentState("header.headEndItems", Operation.Add, "headEndItem1");
        StateManager.updateCurrentState("subHeader.items", Operation.Add, "subHeader1");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Items are added correctly via BaseState", async function (assert) {
        // Arrange
        this.oExpectedData.sidePane.items = ["sidePaneItem1"];
        this.oExpectedData.toolArea.items = ["toolAreaItem1"];
        this.oExpectedData.rightFloatingContainer.items = ["rightFloatingContainerItem1"];
        this.oExpectedData.floatingContainer.items = ["floatingContainer1"];
        this.oExpectedData.userActions.items = ["userActionsItem1"];
        this.oExpectedData.floatingActions.items = ["floatingActionsItem1"];
        this.oExpectedData.header.headItems = ["headItem1"];
        this.oExpectedData.header.headEndItems = ["headEndItem1"];
        this.oExpectedData.subHeader.items = ["subHeader1"];
        // Act
        StateManager.updateBaseStates([LaunchpadState.Home], "sidePane.items", Operation.Add, "sidePaneItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "toolAreaItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingContainer.items", Operation.Add, "floatingContainer1");
        StateManager.updateBaseStates([LaunchpadState.Home], "userActions.items", Operation.Add, "userActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingActions.items", Operation.Add, "floatingActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headItems", Operation.Add, "headItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headEndItems", Operation.Add, "headEndItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "subHeader.items", Operation.Add, "subHeader1");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Items are added correctly via CurrentState and BaseState", async function (assert) {
        // Arrange
        this.oExpectedData.sidePane.items = ["sidePaneItem2"];
        this.oExpectedData.toolArea.items = ["toolAreaItem1", "toolAreaItem2"];
        this.oExpectedData.rightFloatingContainer.items = ["rightFloatingContainerItem1", "rightFloatingContainerItem2"];
        this.oExpectedData.floatingContainer.items = ["floatingContainer2"];
        this.oExpectedData.userActions.items = ["userActionsItem1", "userActionsItem2"];
        this.oExpectedData.floatingActions.items = ["floatingActionsItem1", "floatingActionsItem2"];
        this.oExpectedData.header.headItems = ["headItem1", "headItem2"];
        this.oExpectedData.header.headEndItems = ["headEndItem1", "headEndItem2"];
        this.oExpectedData.subHeader.items = ["subHeader2"];
        // Act
        StateManager.updateBaseStates([LaunchpadState.Home], "sidePane.items", Operation.Add, "sidePaneItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "toolAreaItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingContainer.items", Operation.Add, "floatingContainer1");
        StateManager.updateBaseStates([LaunchpadState.Home], "userActions.items", Operation.Add, "userActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingActions.items", Operation.Add, "floatingActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headItems", Operation.Add, "headItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headEndItems", Operation.Add, "headEndItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "subHeader.items", Operation.Add, "subHeader1");

        StateManager.updateCurrentState("sidePane.items", Operation.Add, "sidePaneItem2");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "toolAreaItem2");
        StateManager.updateCurrentState("rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem2");
        StateManager.updateCurrentState("floatingContainer.items", Operation.Add, "floatingContainer2");
        StateManager.updateCurrentState("userActions.items", Operation.Add, "userActionsItem2");
        StateManager.updateCurrentState("floatingActions.items", Operation.Add, "floatingActionsItem2");
        StateManager.updateCurrentState("header.headItems", Operation.Add, "headItem2");
        StateManager.updateCurrentState("header.headEndItems", Operation.Add, "headEndItem2");
        StateManager.updateCurrentState("subHeader.items", Operation.Add, "subHeader2");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Identical items added via CurrentState and BaseState appear only once", async function (assert) {
        // Arrange
        this.oExpectedData.sidePane.items = ["sidePaneItem1"];
        this.oExpectedData.toolArea.items = ["toolAreaItem1"];
        this.oExpectedData.rightFloatingContainer.items = ["rightFloatingContainerItem1"];
        this.oExpectedData.floatingContainer.items = ["floatingContainer1"];
        this.oExpectedData.userActions.items = ["userActionsItem1"];
        this.oExpectedData.floatingActions.items = ["floatingActionsItem1"];
        this.oExpectedData.header.headItems = ["headItem1"];
        this.oExpectedData.header.headEndItems = ["headEndItem1"];
        this.oExpectedData.subHeader.items = ["subHeader1"];
        // Act
        StateManager.updateBaseStates([LaunchpadState.Home], "sidePane.items", Operation.Add, "sidePaneItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "toolAreaItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingContainer.items", Operation.Add, "floatingContainer1");
        StateManager.updateBaseStates([LaunchpadState.Home], "userActions.items", Operation.Add, "userActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingActions.items", Operation.Add, "floatingActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headItems", Operation.Add, "headItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headEndItems", Operation.Add, "headEndItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "subHeader.items", Operation.Add, "subHeader1");

        StateManager.updateCurrentState("sidePane.items", Operation.Add, "sidePaneItem1");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "toolAreaItem1");
        StateManager.updateCurrentState("rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem1");
        StateManager.updateCurrentState("floatingContainer.items", Operation.Add, "floatingContainer1");
        StateManager.updateCurrentState("userActions.items", Operation.Add, "userActionsItem1");
        StateManager.updateCurrentState("floatingActions.items", Operation.Add, "floatingActionsItem1");
        StateManager.updateCurrentState("header.headItems", Operation.Add, "headItem1");
        StateManager.updateCurrentState("header.headEndItems", Operation.Add, "headEndItem1");
        StateManager.updateCurrentState("subHeader.items", Operation.Add, "subHeader1");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Items can be removed again via CurrentState", async function (assert) {
        // Arrange
        StateManager.updateCurrentState("sidePane.items", Operation.Add, "sidePaneItem1");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "toolAreaItem1");
        StateManager.updateCurrentState("rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem1");
        StateManager.updateCurrentState("floatingContainer.items", Operation.Add, "floatingContainer1");
        StateManager.updateCurrentState("userActions.items", Operation.Add, "userActionsItem1");
        StateManager.updateCurrentState("floatingActions.items", Operation.Add, "floatingActionsItem1");
        StateManager.updateCurrentState("header.headItems", Operation.Add, "headItem1");
        StateManager.updateCurrentState("header.headEndItems", Operation.Add, "headEndItem1");
        StateManager.updateCurrentState("subHeader.items", Operation.Add, "subHeader1");
        // Act
        StateManager.updateCurrentState("sidePane.items", Operation.Remove, "sidePaneItem1");
        StateManager.updateCurrentState("toolArea.items", Operation.Remove, "toolAreaItem1");
        StateManager.updateCurrentState("rightFloatingContainer.items", Operation.Remove, "rightFloatingContainerItem1");
        StateManager.updateCurrentState("floatingContainer.items", Operation.Remove, "floatingContainer1");
        StateManager.updateCurrentState("userActions.items", Operation.Remove, "userActionsItem1");
        StateManager.updateCurrentState("floatingActions.items", Operation.Remove, "floatingActionsItem1");
        StateManager.updateCurrentState("header.headItems", Operation.Remove, "headItem1");
        StateManager.updateCurrentState("header.headEndItems", Operation.Remove, "headEndItem1");
        StateManager.updateCurrentState("subHeader.items", Operation.Remove, "subHeader1");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Items can be removed again via BaseState", async function (assert) {
        // Arrange
        StateManager.updateBaseStates([LaunchpadState.Home], "sidePane.items", Operation.Add, "sidePaneItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "toolAreaItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingContainer.items", Operation.Add, "floatingContainer1");
        StateManager.updateBaseStates([LaunchpadState.Home], "userActions.items", Operation.Add, "userActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingActions.items", Operation.Add, "floatingActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headItems", Operation.Add, "headItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headEndItems", Operation.Add, "headEndItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "subHeader.items", Operation.Add, "subHeader1");
        // Act
        StateManager.updateBaseStates([LaunchpadState.Home], "sidePane.items", Operation.Remove, "sidePaneItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Remove, "toolAreaItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "rightFloatingContainer.items", Operation.Remove, "rightFloatingContainerItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingContainer.items", Operation.Remove, "floatingContainer1");
        StateManager.updateBaseStates([LaunchpadState.Home], "userActions.items", Operation.Remove, "userActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingActions.items", Operation.Remove, "floatingActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headItems", Operation.Remove, "headItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headEndItems", Operation.Remove, "headEndItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "subHeader.items", Operation.Remove, "subHeader1");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Items added via BaseState can be removed via CurrentState", async function (assert) {
        // Arrange
        StateManager.updateBaseStates([LaunchpadState.Home], "sidePane.items", Operation.Add, "sidePaneItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "toolAreaItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "rightFloatingContainer.items", Operation.Add, "rightFloatingContainerItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingContainer.items", Operation.Add, "floatingContainer1");
        StateManager.updateBaseStates([LaunchpadState.Home], "userActions.items", Operation.Add, "userActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingActions.items", Operation.Add, "floatingActionsItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headItems", Operation.Add, "headItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.headEndItems", Operation.Add, "headEndItem1");
        StateManager.updateBaseStates([LaunchpadState.Home], "subHeader.items", Operation.Add, "subHeader1");
        // Act
        StateManager.updateCurrentState("sidePane.items", Operation.Remove, "sidePaneItem1");
        StateManager.updateCurrentState("toolArea.items", Operation.Remove, "toolAreaItem1");
        StateManager.updateCurrentState("rightFloatingContainer.items", Operation.Remove, "rightFloatingContainerItem1");
        StateManager.updateCurrentState("floatingContainer.items", Operation.Remove, "floatingContainer1");
        StateManager.updateCurrentState("userActions.items", Operation.Remove, "userActionsItem1");
        StateManager.updateCurrentState("floatingActions.items", Operation.Remove, "floatingActionsItem1");
        StateManager.updateCurrentState("header.headItems", Operation.Remove, "headItem1");
        StateManager.updateCurrentState("header.headEndItems", Operation.Remove, "headEndItem1");
        StateManager.updateCurrentState("subHeader.items", Operation.Remove, "subHeader1");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Properties can be set via CurrentState", async function (assert) {
        // Arrange
        this.oExpectedData.sidePane.visible = true;
        this.oExpectedData.toolArea.visible = true;
        this.oExpectedData.rightFloatingContainer.visible = true;
        this.oExpectedData.floatingContainer.visible = true;
        this.oExpectedData.header.centralAreaElement = "centralAreaElement1";
        this.oExpectedData.header.secondTitle = "secondTitle";
        this.oExpectedData.footer.content = "footerContent";
        this.oExpectedData.application = {
            title: "applicationTitle",
            icon: "applicationIcon",
            subTitle: "applicationSubTitle",
            relatedApps: ["relatedApp1"],
            hierarchy: ["hierarchy1"]
        };
        // Act
        StateManager.updateCurrentState("sidePane.visible", Operation.Set, true);
        StateManager.updateCurrentState("toolArea.visible", Operation.Set, true);
        StateManager.updateCurrentState("rightFloatingContainer.visible", Operation.Set, true);
        StateManager.updateCurrentState("floatingContainer.visible", Operation.Set, true);
        StateManager.updateCurrentState("header.centralAreaElement", Operation.Set, "centralAreaElement1");
        StateManager.updateCurrentState("header.secondTitle", Operation.Set, "secondTitle");
        StateManager.updateCurrentState("footer.content", Operation.Set, "footerContent");
        StateManager.updateCurrentState("application.title", Operation.Set, "applicationTitle");
        StateManager.updateCurrentState("application.icon", Operation.Set, "applicationIcon");
        StateManager.updateCurrentState("application.subTitle", Operation.Set, "applicationSubTitle");
        StateManager.updateCurrentState("application.relatedApps", Operation.Set, ["relatedApp1"]);
        StateManager.updateCurrentState("application.hierarchy", Operation.Set, ["hierarchy1"]);
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Properties can be set via BaseState", async function (assert) {
        // Arrange
        this.oExpectedData.sidePane.visible = true;
        this.oExpectedData.toolArea.visible = true;
        this.oExpectedData.rightFloatingContainer.visible = true;
        this.oExpectedData.floatingContainer.visible = true;
        this.oExpectedData.header.centralAreaElement = "centralAreaElement1";
        this.oExpectedData.header.secondTitle = "secondTitle";
        this.oExpectedData.footer.content = "footerContent";
        this.oExpectedData.application = {
            title: "applicationTitle",
            icon: "applicationIcon",
            subTitle: "applicationSubTitle",
            relatedApps: ["relatedApp1"],
            hierarchy: ["hierarchy1"]
        };
        // Act
        StateManager.updateBaseStates([LaunchpadState.Home], "sidePane.visible", Operation.Set, true);
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.visible", Operation.Set, true);
        StateManager.updateBaseStates([LaunchpadState.Home], "rightFloatingContainer.visible", Operation.Set, true);
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingContainer.visible", Operation.Set, true);
        StateManager.updateBaseStates([LaunchpadState.Home], "header.centralAreaElement", Operation.Set, "centralAreaElement1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.secondTitle", Operation.Set, "secondTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "footer.content", Operation.Set, "footerContent");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.title", Operation.Set, "applicationTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.icon", Operation.Set, "applicationIcon");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.subTitle", Operation.Set, "applicationSubTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.relatedApps", Operation.Set, ["relatedApp1"]);
        StateManager.updateBaseStates([LaunchpadState.Home], "application.hierarchy", Operation.Set, ["hierarchy1"]);
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Properties set via CurrentState overwrite BaseState settings", async function (assert) {
        // Arrange
        this.oExpectedData.sidePane.visible = false;
        this.oExpectedData.toolArea.visible = false;
        this.oExpectedData.rightFloatingContainer.visible = false;
        this.oExpectedData.floatingContainer.visible = false;
        this.oExpectedData.header.centralAreaElement = "centralAreaElement2";
        this.oExpectedData.header.secondTitle = "secondTitle2";
        this.oExpectedData.footer.content = "footerContent2";
        this.oExpectedData.application = {
            title: "applicationTitle2",
            icon: "applicationIcon2",
            subTitle: "applicationSubTitle2",
            relatedApps: ["relatedApp2"],
            hierarchy: ["hierarchy2"]
        };

        // Act
        StateManager.updateBaseStates([LaunchpadState.Home], "sidePane.visible", Operation.Set, true);
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.visible", Operation.Set, true);
        StateManager.updateBaseStates([LaunchpadState.Home], "rightFloatingContainer.visible", Operation.Set, true);
        StateManager.updateBaseStates([LaunchpadState.Home], "floatingContainer.visible", Operation.Set, true);
        StateManager.updateBaseStates([LaunchpadState.Home], "header.centralAreaElement", Operation.Set, "centralAreaElement1");
        StateManager.updateBaseStates([LaunchpadState.Home], "header.secondTitle", Operation.Set, "secondTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "footer.content", Operation.Set, "footerContent");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.title", Operation.Set, "applicationTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.icon", Operation.Set, "applicationIcon");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.subTitle", Operation.Set, "applicationSubTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.relatedApps", Operation.Set, ["relatedApp1"]);
        StateManager.updateBaseStates([LaunchpadState.Home], "application.hierarchy", Operation.Set, ["hierarchy1"]);

        StateManager.updateCurrentState("sidePane.visible", Operation.Set, false);
        StateManager.updateCurrentState("toolArea.visible", Operation.Set, false);
        StateManager.updateCurrentState("rightFloatingContainer.visible", Operation.Set, false);
        StateManager.updateCurrentState("floatingContainer.visible", Operation.Set, false);
        StateManager.updateCurrentState("header.centralAreaElement", Operation.Set, "centralAreaElement2");
        StateManager.updateCurrentState("header.secondTitle", Operation.Set, "secondTitle2");
        StateManager.updateCurrentState("footer.content", Operation.Set, "footerContent2");
        StateManager.updateCurrentState("application.title", Operation.Set, "applicationTitle2");
        StateManager.updateCurrentState("application.icon", Operation.Set, "applicationIcon2");
        StateManager.updateCurrentState("application.subTitle", Operation.Set, "applicationSubTitle2");
        StateManager.updateCurrentState("application.relatedApps", Operation.Set, ["relatedApp2"]);
        StateManager.updateCurrentState("application.hierarchy", Operation.Set, ["hierarchy2"]);

        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Nested properties do merge correctly when set individually", async function (assert) {
        // Arrange
        this.oExpectedData.application = {
            title: "applicationTitle2",
            icon: "applicationIcon2",
            subTitle: "applicationSubTitle",
            relatedApps: ["relatedApp1"],
            hierarchy: ["hierarchy2"]
        };

        // Act
        StateManager.updateBaseStates([LaunchpadState.Home], "application.title", Operation.Set, "applicationTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.icon", Operation.Set, "applicationIcon");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.subTitle", Operation.Set, "applicationSubTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.relatedApps", Operation.Set, ["relatedApp1"]);
        StateManager.updateBaseStates([LaunchpadState.Home], "application.hierarchy", Operation.Set, ["hierarchy1"]);

        StateManager.updateCurrentState("application.title", Operation.Set, "applicationTitle2");
        StateManager.updateCurrentState("application.icon", Operation.Set, "applicationIcon2");
        StateManager.updateCurrentState("application.hierarchy", Operation.Set, ["hierarchy2"]);

        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Nested properties do not merge when root node is used", async function (assert) {
        // Arrange
        this.oExpectedData.application = {
            title: "applicationTitle2",
            icon: "applicationIcon2",
            hierarchy: ["hierarchy2"]
        };

        // Act
        StateManager.updateBaseStates([LaunchpadState.Home], "application.title", Operation.Set, "applicationTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.icon", Operation.Set, "applicationIcon");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.subTitle", Operation.Set, "applicationSubTitle");
        StateManager.updateBaseStates([LaunchpadState.Home], "application.relatedApps", Operation.Set, ["relatedApp1"]);
        StateManager.updateBaseStates([LaunchpadState.Home], "application.hierarchy", Operation.Set, ["hierarchy1"]);

        StateManager.updateCurrentState("application", Operation.Set, {
            title: "applicationTitle2",
            icon: "applicationIcon2",
            hierarchy: ["hierarchy2"]
        });

        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.module("StateRules and Strategies", {
        beforeEach: async function () {
            sandbox.stub(Config, "last");
            Config.last.withArgs("/core/state/shellMode");
            Config.last.returns(ShellMode.Default);
            sandbox.stub(ushellUtils, "isFlpHomeIntent").returns(true); // ensure LaunchpadState.Home

            // reset to apply changes from above
            StateManager.reset();
            StateManager.init({});

            this.oExpectedData = deepClone(oBaseStateData);

            // no item should be filtered out
            sandbox.stub(Element, "getElementById").returns({});
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
            CurrentState.flushState();
            ControlManager.flushList();
        }
    });

    QUnit.test("logo visibility is enforced to visible when in Default ShellMode, but header visibility not", async function (assert) {
        // Act
        StateManager.updateCurrentState("header.visible", Operation.Set, false);
        StateManager.updateAllBaseStates("header.visible", Operation.Set, false);
        StateManager.updateCurrentState("header.home.showLogo", Operation.Set, false);
        StateManager.updateAllBaseStates("header.home.showLogo", Operation.Set, false);
        this.oExpectedData.header.visible = false;
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Header and logo visibility is enforced to visible when in Headerless ShellMode", async function (assert) {
        // Arrange
        Config.last.returns(ShellMode.Headerless);
        StateManager.reset();
        StateManager.init({});
        this.oExpectedData.header.visible = false;
        this.oExpectedData.header.home.showLogo = false;
        // Act
        StateManager.updateCurrentState("header.visible", Operation.Set, true);
        StateManager.updateAllBaseStates("header.visible", Operation.Set, true);
        StateManager.updateCurrentState("header.home.showLogo", Operation.Set, true);
        StateManager.updateAllBaseStates("header.home.showLogo", Operation.Set, true);
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Items are moved to the header according to the config", async function (assert) {
        // Arrange
        this.oExpectedData.header.headEndItems = [
            "ContactSupportBtn",
            "openCatalogBtn",
            "userSettingsBtn"
        ];
        StateManager.reset();
        StateManager.init({
            moveAppFinderActionToShellHeader: true,
            moveUserSettingsActionToShellHeader: true,
            moveContactSupportActionToShellHeader: true
        });
        // Act
        StateManager.updateAllBaseStates("userActions.items", Operation.Add, "ContactSupportBtn");
        StateManager.updateAllBaseStates("userActions.items", Operation.Add, "openCatalogBtn");
        StateManager.updateAllBaseStates("userActions.items", Operation.Add, "userSettingsBtn");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("Items are sorted according to the strategies", async function (assert) {
        // Arrange
        this.oExpectedData.userActions.items = [
            "openCatalogBtn",
            "userSettingsBtn",
            "ContactSupportBtn"
        ];
        // Act
        StateManager.updateAllBaseStates("userActions.items", Operation.Add, "ContactSupportBtn");
        StateManager.updateAllBaseStates("userActions.items", Operation.Add, "openCatalogBtn");
        StateManager.updateAllBaseStates("userActions.items", Operation.Add, "userSettingsBtn");
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.module("LaunchpadState switch", {
        beforeEach: async function () {
            sandbox.stub(Config, "last");
            Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Default);
            sandbox.stub(ushellUtils, "isFlpHomeIntent");
            ushellUtils.isFlpHomeIntent.returns(true); // ensure LaunchpadState.Home

            // reset to apply changes from above
            StateManager.reset();
            StateManager.init({});

            this.oExpectedData = deepClone(oBaseStateData);

            // no item should be filtered out
            sandbox.stub(Element, "getElementById").returns({});
        },
        afterEach: async function () {
            sandbox.restore();
            StateManager.reset();
            CurrentState.flushState();
            ControlManager.flushList();
        }
    });

    QUnit.test("From Home to App", async function (assert) {
        // Arrange
        this.oExpectedData.toolArea.items = ["Base_App_Item1"];

        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "Base_Home_Item1");
        StateManager.updateBaseStates([LaunchpadState.App], "toolArea.items", Operation.Add, "Base_App_Item1");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "Current_Item1");
        // Act
        StateManager.switchState(LaunchpadState.App);
        KeepAlive.flush();
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("From App to App", async function (assert) {
        // Arrange
        ushellUtils.isFlpHomeIntent.returns(false);
        StateManager.reset();
        StateManager.init({});

        this.oExpectedData.toolArea.items = ["Base_App_Item1"];

        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "Base_Home_Item1");
        StateManager.updateBaseStates([LaunchpadState.App], "toolArea.items", Operation.Add, "Base_App_Item1");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "Current_Item1");
        // Act
        StateManager.switchState(LaunchpadState.App);
        KeepAlive.flush();
        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("From App to App with stallChanges and apply", async function (assert) {
        // Arrange
        ushellUtils.isFlpHomeIntent.returns(false);
        StateManager.reset();
        StateManager.init({});

        this.oExpectedData.toolArea.items = [
            "Base_App_Item1",
            "Base_App_Item2",
            "Current_Item2"
        ];

        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "Base_Home_Item1");
        StateManager.updateBaseStates([LaunchpadState.App], "toolArea.items", Operation.Add, "Base_App_Item1");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "Current_Item1");
        // Act

        // Target App is going to be started: defer all changes
        StateManager.stallChanges();

        // Target App is doing some changes
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "Base_Home_Item2");
        StateManager.updateBaseStates([LaunchpadState.App], "toolArea.items", Operation.Add, "Base_App_Item2");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "Current_Item2");

        // Target App is done loading: switch state and flush changes from source app
        StateManager.switchState(LaunchpadState.App);
        KeepAlive.flush();

        // finally apply the deferred changes
        StateManager.applyStalledChanges();

        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });

    QUnit.test("From App to App with stallChanges and discard", async function (assert) {
        // Arrange
        ushellUtils.isFlpHomeIntent.returns(false);
        StateManager.reset();
        StateManager.init({});

        this.oExpectedData.toolArea.items = [
            "Base_App_Item1",
            "Current_Item1"
        ];

        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "Base_Home_Item1");
        StateManager.updateBaseStates([LaunchpadState.App], "toolArea.items", Operation.Add, "Base_App_Item1");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "Current_Item1");
        // Act

        // Target App is going to be started: defer all changes
        StateManager.stallChanges();

        // Target App is doing some changes
        StateManager.updateBaseStates([LaunchpadState.Home], "toolArea.items", Operation.Add, "Base_Home_Item2");
        StateManager.updateBaseStates([LaunchpadState.App], "toolArea.items", Operation.Add, "Base_App_Item2");
        StateManager.updateCurrentState("toolArea.items", Operation.Add, "Current_Item2");

        // Target App is done loading: switch state and flush changes from source app
        StateManager.switchState(LaunchpadState.App);
        KeepAlive.flush();

        // discard the deferred changes (e.g. due to runtime error)
        StateManager.discardStalledChanges();

        // Assert
        const oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit integration tests for sap.ushell.state.KeepAlive
 */
sap.ui.define([
    "sap/base/util/deepClone",
    "sap/m/Button",
    "sap/ushell/Config",
    "sap/ushell/state/KeepAlive",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/utils"
], function (
    deepClone,
    Button,
    Config,
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

    QUnit.module("Store & restore flow", {
        beforeEach: async function () {
            sandbox.stub(Config, "last");
            Config.last.withArgs("/core/state/shellMode").returns(ShellMode.Default);
            sandbox.stub(ushellUtils, "isFlpHomeIntent").returns(true); // ensure LaunchpadState.Home

            // reset to apply changes from above
            StateManager.reset();
            StateManager.init({});

            this.oExpectedData = deepClone(oBaseStateData);
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("App1(KeepAlive), to App2(Non-KeepAlive), back", async function (assert) {
        // Arrange
        const oStorageSourceApp = {};
        const oButtonSourceApp = new Button();
        const oButtonTargetApp = new Button();

        // =================== navigation to source app ===================
        StateManager.switchState(LaunchpadState.App);

        // Source App is doing some changes
        StateManager.updateCurrentState("sidePane.items", Operation.Add, oButtonSourceApp.getId());
        StateManager.addManagedControl(oButtonSourceApp.getId());

        // =================== navigation to target app ===================

        // Target App is going to be started: defer all changes
        StateManager.stallChanges();

        // Target App is doing some changes
        StateManager.updateCurrentState("sidePane.items", Operation.Add, oButtonTargetApp.getId());
        StateManager.addManagedControl(oButtonTargetApp.getId());

        // Target App was successfully started: store state of source app
        KeepAlive.store(oStorageSourceApp);

        // switch state and flush changes from source app
        StateManager.switchState(LaunchpadState.App);
        KeepAlive.flush();

        // finally apply the deferred changes
        StateManager.applyStalledChanges();

        // Assert
        this.oExpectedData.sidePane.items = [oButtonTargetApp.getId()];
        let oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
        assert.strictEqual(oButtonSourceApp.isDestroyed(), false, "The source button was not destroyed");
        assert.strictEqual(oButtonTargetApp.isDestroyed(), false, "The target button was not destroyed");

        // =================== back navigation ===================

        // Source App is going to be started (again): defer all changes
        StateManager.stallChanges();

        // Source App was successfully started: clear all controls
        StateManager.destroyManagedControls();

        // switch state and restore changes from source app
        StateManager.switchState(LaunchpadState.App);
        KeepAlive.restore(oStorageSourceApp);

        // finally apply the deferred changes
        StateManager.applyStalledChanges();

        // Assert
        this.oExpectedData.sidePane.items = [oButtonSourceApp.getId()];
        oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
        assert.strictEqual(oButtonSourceApp.isDestroyed(), false, "The source button was not destroyed");
        assert.strictEqual(oButtonTargetApp.isDestroyed(), true, "The target button was destroyed");
    });

    QUnit.test("App1(KeepAlive), to App2(Non-KeepAlive), home", async function (assert) {
        // Arrange
        const oStorageSourceApp = {};
        const oStorageHome = {};
        const oButtonSourceApp = new Button();
        const oButtonTargetApp = new Button();

        // =================== navigation to source app ===================
        StateManager.switchState(LaunchpadState.App);

        // Source App is doing some changes
        StateManager.updateCurrentState("sidePane.items", Operation.Add, oButtonSourceApp.getId());
        StateManager.addManagedControl(oButtonSourceApp.getId());

        // =================== navigation to target app ===================

        // Target App is going to be started: defer all changes
        StateManager.stallChanges();

        // Target App is doing some changes
        StateManager.updateCurrentState("sidePane.items", Operation.Add, oButtonTargetApp.getId());
        StateManager.addManagedControl(oButtonTargetApp.getId());

        // Target App was successfully started: store state of source app
        KeepAlive.store(oStorageSourceApp);

        // switch state and flush changes from source app
        StateManager.switchState(LaunchpadState.App);
        KeepAlive.flush();

        // finally apply the deferred changes
        StateManager.applyStalledChanges();

        // Assert
        this.oExpectedData.sidePane.items = [oButtonTargetApp.getId()];
        let oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
        assert.strictEqual(oButtonSourceApp.isDestroyed(), false, "The source button was not destroyed");
        assert.strictEqual(oButtonTargetApp.isDestroyed(), false, "The target button was not destroyed");

        // =================== home navigation ===================

        // Source App is going to be started (again): defer all changes
        StateManager.stallChanges();

        // Source App was successfully started: clear all controls
        StateManager.destroyManagedControls();

        // switch state and restore changes from source app
        StateManager.switchState(LaunchpadState.Home);
        KeepAlive.restore(oStorageHome);

        // finally apply the deferred changes
        StateManager.applyStalledChanges();

        // cleanup of old keep alive apps
        KeepAlive.destroy(oStorageSourceApp);

        // Assert
        this.oExpectedData.sidePane.items = [];
        oActualStateData = ShellModel.getModel().getData();
        assert.deepEqual(oActualStateData, this.oExpectedData, "The state is as expected");
        assert.strictEqual(oButtonSourceApp.isDestroyed(), true, "The source button was destroyed");
        assert.strictEqual(oButtonTargetApp.isDestroyed(), true, "The target button was destroyed");
    });
});

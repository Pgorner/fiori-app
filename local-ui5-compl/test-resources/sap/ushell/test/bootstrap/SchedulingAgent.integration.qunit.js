// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Integration tests for SchedulingAgent
 */
sap.ui.define([
    "sap/ushell/bootstrap/SchedulingAgent",
    "sap/ushell/bootstrap/SchedulingAgent/state",
    "sap/base/util/LoaderExtensions",
    "sap/ushell/EventHub",
    "sap/ui/core/Component",
    "sap/ushell/Config",
    "sap/ushell/state/StateManager"
], function (
    SchedulingAgent,
    DeepState,
    LoaderExtensions,
    EventHub,
    Component,
    Config,
    StateManager
) {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    /* global sinon, QUnit */

    const sandbox = sinon.createSandbox({});

    var oLoadingConfigurationMock = {
        OrderOfLoadingBlocks: [
            "AfterLoadPluginsCall",
            "FLPPlugins"
        ],
        LoadingBlocks: {
            AfterLoadPluginsCall: {
                LoadingSteps: [
                    { LoadingStep: "StartScheduler", canBeLoadedAsync: false },
                    { LoadingStep: "LoadRendererExtensions", canBeLoadedAsync: false },
                    { LoadingStep: "MessagePopoverInit", canBeLoadedAsync: true }
                ],
                maxWaitInMs: 3000
            },
            FLPPlugins: {
                LoadingSteps: [
                    { LoadingStep: "ConditionalWaitForAppLoading", canBeLoadedAsync: false },
                    { LoadingStep: "Notifications", canBeLoadedAsync: false },
                    { LoadingStep: "UserImage", canBeLoadedAsync: false },
                    { LoadingStep: "Search", canBeLoadedAsync: false },
                    { LoadingStep: "UserActionsMenu", canBeLoadedAsync: false },
                    { LoadingStep: "ShellComplete", canBeLoadedAsync: true }
                ],
                maxWaitInMs: 0
            }
        }
    };

    var oStepConfigurationMock = {
        StartScheduler: {
            loadingMode: "continueOnEvent",
            continueOnEvent: {
                eventName: "startScheduler"
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        LoadRendererExtensions: {
            loadingMode: "byEvent",
            byEvent: {
                eventName: "loadRendererExtensions",
                eventData: ""
            },
            Dependencies: []
        },
        MessagePopoverInit: {
            loadingMode: "byEvent",
            byEvent: {
                eventName: "initMessagePopover",
                eventData: ""
            },
            Dependencies: [
                "LoadRendererExtensions"
            ]
        },
        Notifications: {
            loadingMode: "byComponentCreate",
            excludedShellModeAndLaunchpadStates: [{
                shellMode: ShellMode.Lean
            }],
            byComponentCreate: {
                enabled: true,
                ui5ComponentOptions: {
                    name: "sap.ushell.components.shell.Notifications"
                },
                url: "sap/ushell/components/shell/Notifications"
            },
            configSwitch: {
                path: "/core/shell/model/enableNotifications",
                assertionValue: true
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        UserActionsMenu: {
            loadingMode: "byComponentCreate",
            byComponentCreate: {
                enabled: true,
                ui5ComponentOptions: {
                    name: "sap.ushell.components.shell.UserActionsMenu.fiori3"
                },
                url: "sap/ushell/components/shell/UserActionsMenu/fiori3"
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        UserImage: {
            loadingMode: "byComponentCreate",
            byComponentCreate: {
                enabled: true,
                ui5ComponentOptions: {
                    name: "sap.ushell.components.shell.UserImage"
                },
                url: "sap/ushell/components/shell/UserImage"
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        Search: {
            loadingMode: "byComponentCreate",
            excludedShellModeAndLaunchpadStates: [{
                shellMode: ShellMode.Lean
            }],
            byComponentCreate: {
                enabled: true,
                ui5ComponentOptions: {
                    name: "sap.ushell.components.shell.Search"
                },
                url: "sap/ushell/components/shell/Search"
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        ShellComplete: {
            loadingMode: "byEvent",
            byEvent: {
                eventName: "ShellComplete",
                eventData: ""
            }
        },
        ConditionalWaitForAppLoading: {
            loadingMode: "waitInMs",
            waitInMs: {
                waitingTime: 42
            },
            mandatoryFLPStates: [
                "app"
            ]
        }
    };

    var LOADING_CONFIG_PATH = "sap/ushell/bootstrap/SchedulingAgent/LoadingConfiguration.json";
    var STEP_CONFIG_PATH = "sap/ushell/bootstrap/SchedulingAgent/StepConfiguration.json";

    QUnit.module("Configuration validation", {});

    QUnit.test("Validate step dependencies", function (assert) {
        var done = assert.async();
        var pStepConfig = LoaderExtensions.loadResource(STEP_CONFIG_PATH, { async: true });
        var bDependencyDefined = false;
        var sStep;

        pStepConfig.then(function (oStepConfig) {
            Object.keys(oStepConfig).forEach(function (sKey) {
                if (oStepConfig[sKey].Dependencies) {
                    for (var i = 0; i < oStepConfig[sKey].Dependencies.length; i++) {
                        sStep = oStepConfig[sKey].Dependencies[i];
                        bDependencyDefined = !!oStepConfig[sStep];
                        assert.ok(bDependencyDefined, "Step \"" + sKey + "\"'s dependency " + sStep + " is defined.");
                    }
                } else {
                    assert.ok(true, "Step \"" + sKey + "has nodependency  defined.");
                }
            });
            done();
        });
    });

    QUnit.test("Validate blocks' and steps' definitions", function (assert) {
        var done = assert.async();
        var pStepConfig = LoaderExtensions.loadResource(STEP_CONFIG_PATH, { async: true });
        var pLoadingConfig = LoaderExtensions.loadResource(LOADING_CONFIG_PATH, { async: true });
        var bBlockDefined = false;
        var bStepDefined = false;
        var sStep;

        Promise.all([pStepConfig, pLoadingConfig]).then(function (values) {
            var oStepConfig = values[0];
            var oLoadingConfig = values[1];
            oLoadingConfig.OrderOfLoadingBlocks.forEach(function (sLoadingBlock) {
                bBlockDefined = !!oLoadingConfig.LoadingBlocks[sLoadingBlock];
                assert.ok(bBlockDefined, "Block \"" + sLoadingBlock + "\" is defined.");
                for (var i = 0; i < oLoadingConfig.LoadingBlocks[sLoadingBlock].LoadingSteps.length; i++) {
                    sStep = oLoadingConfig.LoadingBlocks[sLoadingBlock].LoadingSteps[i].LoadingStep;
                    bStepDefined = !!oStepConfig[sStep];
                    assert.ok(bStepDefined, "Block's \"" + sLoadingBlock + "\" step \"" + sStep + "\" is defined.");
                }
            });
            done();
        });
    });

    QUnit.test("Validate step definitions", function (assert) {
        var done = assert.async();
        var pStepConfig = LoaderExtensions.loadResource(STEP_CONFIG_PATH, { async: true });
        var bStepDefined = false;
        var bFieldDefined = false;
        var oStep;

        pStepConfig.then(function (oStepConfig) {
            Object.keys(oStepConfig).forEach(function (sKey) {
                oStep = oStepConfig[sKey];
                switch (oStep.loadingMode) {
                    case "continueOnEvent":
                        bStepDefined = typeof oStep.continueOnEvent.eventName === "string";
                        assert.ok(bStepDefined, "Step \"" + sKey + "\" has an event name.");
                        break;
                    case "byEvent":
                        bStepDefined = typeof oStep.byEvent.eventName === "string";
                        assert.ok(bStepDefined, "Step \"" + sKey + "\" has an event name.");
                        break;
                    case "byComponentCreate":
                        bFieldDefined = typeof oStep.byComponentCreate.enabled === "boolean";
                        assert.ok(bFieldDefined, "Step \"" + sKey + "\" has an enabled field.");
                        bStepDefined = bFieldDefined;
                        bFieldDefined = typeof oStep.byComponentCreate.ui5ComponentOptions.name === "string";
                        assert.ok(bFieldDefined, "Step \"" + sKey + "\" has a component name.");
                        bStepDefined = bStepDefined && bFieldDefined;
                        bFieldDefined = typeof oStep.byComponentCreate.ui5ComponentOptions.manifest === "boolean";
                        assert.ok(bFieldDefined, "Step \"" + sKey + "\" has a manifest flag.");
                        bFieldDefined = typeof oStep.byComponentCreate.url === "string";
                        assert.ok(bFieldDefined, "Step \"" + sKey + "\" has a url.");
                        break;
                    case "byRequire":
                        bStepDefined = typeof oStep.byRequire.path === "string";
                        assert.ok(bStepDefined, "Step \"" + sKey + "\" has a path field.");
                        break;
                    case "waitInMs":
                        bStepDefined = typeof oStep.waitInMs.waitingTime === "number" && oStep.waitInMs.waitingTime >= 0;
                        assert.ok(bStepDefined, "Step \"" + sKey + "\" has a waiting time");
                        break;
                    default:
                        bStepDefined = false;
                }
                assert.ok(bStepDefined, "Step \"" + sKey + "\" configuration is correct");
            });
            done();
        });
    });

    QUnit.module("Integration Test", {
        beforeEach: function () {
            // Config values for the different stubs.
            // Change them in the tests accordingly.
            this.oConfigurationMock = {
                Notifications: {
                    bComponentCreated: true,
                    iLoadingTime: 0,
                    bEnabledByConfig: true
                },
                UserActionsMenu: {
                    bComponentCreated: true,
                    iLoadingTime: 0
                },
                Search: {
                    bComponentCreated: true,
                    iLoadingTime: 0
                },
                UserImage: {
                    bComponentCreated: true,
                    iLoadingTime: 0
                },
                StepsToBeDone: {
                    LoadRendererExtensions: true,
                    MessagePopoverInit: true,
                    WarmupPlugins: true,
                    ShellComplete: true
                }
            };

            this.oTestLoadingConfig = JSON.parse(JSON.stringify(oLoadingConfigurationMock));
            this.oTestStepConfig = JSON.parse(JSON.stringify(oStepConfigurationMock));

            this.oComponentCreateStub = sandbox.stub(Component, "create").callsFake(function (componentPath) {
                var bResolvePromise = false;
                // We want to be able to make the promises to resolve in a different order in some tests
                var iTimeOut = 0;
                return new Promise(function (resolve, reject) {
                    switch (componentPath.name) {
                        case "sap.ushell.components.shell.UserImage":
                            bResolvePromise = this.oConfigurationMock.UserImage.bComponentCreated;
                            iTimeOut = this.oConfigurationMock.UserImage.iLoadingTime;
                            break;
                        case "sap.ushell.components.shell.Search":
                            bResolvePromise = this.oConfigurationMock.Search.bComponentCreated;
                            iTimeOut = this.oConfigurationMock.Search.iLoadingTime;
                            break;
                        case "sap.ushell.components.shell.UserActionsMenu.fiori3":
                            bResolvePromise = this.oConfigurationMock.UserActionsMenu.bComponentCreated;
                            iTimeOut = this.oConfigurationMock.UserActionsMenu.iLoadingTime;
                            break;
                        case "sap.ushell.components.shell.Notifications":
                            bResolvePromise = this.oConfigurationMock.Notifications.bComponentCreated;
                            iTimeOut = this.oConfigurationMock.Notifications.iLoadingTime;
                            break;
                        default:
                            break;
                    }
                    if (bResolvePromise) {
                        setTimeout(resolve, iTimeOut);
                    } else {
                        setTimeout(reject, iTimeOut);
                    }
                }.bind(this));
            }.bind(this));

            this.oConfigStub = sandbox.stub(Config, "last").callsFake(function (path) {
                if (path === "/core/shell/model/enableNotifications") {
                    return this.oConfigurationMock.Notifications.bEnabledByConfig;
                }
                return false;
            }.bind(this));

            sandbox.stub(StateManager, "getShellMode");
            StateManager.getShellMode.returns(ShellMode.Default);

            sandbox.stub(StateManager, "getLaunchpadState");
            StateManager.getLaunchpadState.returns(LaunchpadState.Home);

            this.aDoables = Object.keys(oStepConfigurationMock).reduce(function (aArray, sKey) {
                var oStep = oStepConfigurationMock[sKey];
                if (oStep.loadingMode === "byEvent") {
                    aArray.push(EventHub.once(oStep.byEvent.eventName).do(function () {
                        if (this.oConfigurationMock.StepsToBeDone[sKey]) {
                            EventHub.emit("StepDone", sKey);
                        } else {
                            EventHub.emit("StepFailed", sKey);
                        }
                    }.bind(this)));
                }
                return aArray;
            }.bind(this), []);

            this.oLoadResourceStub = sandbox.stub(LoaderExtensions, "loadResource").callsFake(function (configPath) {
                return new Promise(function (resolve, reject) {
                    if (configPath === "sap/ushell/bootstrap/SchedulingAgent/LoadingConfiguration.json") {
                        resolve(this.oTestLoadingConfig);
                    } else if (configPath === "sap/ushell/bootstrap/SchedulingAgent/StepConfiguration.json") {
                        resolve(this.oTestStepConfig);
                    } else {
                        reject();
                    }
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.aDoables.forEach(function (doable) {
                doable.off();
            });
            EventHub._reset();
        }
    });

    QUnit.test("The agent is successfully loaded", function (assert) {
        var bModuleIsobject = typeof SchedulingAgent === "object";
        assert.ok(bModuleIsobject, "Agent module loaded.");
    });

    QUnit.test("Default loading", function (assert) {
        var done = assert.async();

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_SKIPPED", "Conditional timeout skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_DONE", "Notifications loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_DONE", "Search loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserActionsMenu.status, "STEP_DONE", "UserActionsMenu loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("UserActionsMenu not loaded", function (assert) {
        var done = assert.async();

        this.oConfigurationMock.UserActionsMenu.bComponentCreated = false;

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_SKIPPED", "Conditional timeout skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_DONE", "Notifications loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_DONE", "Search loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserActionsMenu.status, "STEP_SKIPPED", "UserActionsMenu skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("UserActionsMenu & Search not loaded", function (assert) {
        var done = assert.async();

        this.oConfigurationMock.UserActionsMenu.bComponentCreated = false;
        this.oConfigurationMock.Search.bComponentCreated = false;

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_SKIPPED", "Conditional timeout skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_DONE", "Notifications loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_SKIPPED", "Search skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserActionsMenu.status, "STEP_SKIPPED", "UserActionsMenu skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("FLP in lean state", function (assert) {
        var done = assert.async();

        StateManager.getShellMode.returns(ShellMode.Lean);

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_SKIPPED", "Conditional timeout skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_SKIPPED", "Notifications skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_SKIPPED", "Search skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserActionsMenu.status, "STEP_DONE", "UserActionsMenu loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("FLP in app state", function (assert) {
        var done = assert.async();

        StateManager.getLaunchpadState.returns(LaunchpadState.App);

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init started.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_DONE", "Conditional timeout loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_DONE", "Notifications loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_DONE", "Search loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserActionsMenu.status, "STEP_DONE", "UserActionsMenu loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("A step dependency wasn't resolved", function (assert) {
        var done = assert.async();

        this.oConfigurationMock.StepsToBeDone.LoadRendererExtensions = false;

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_ABORTED", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_SKIPPED", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_ABORTED", "Message Popover Init aborted.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins, undefined, "FLPPlugins block not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading, undefined, "Conditional timeout not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications, undefined, "Notifications not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage, undefined, "UserImage not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search, undefined, "Search not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserActionsMenu, undefined, "UserActionsMenu not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete, undefined, "ShellComplete not triggered.");

                // Technical assertions:
                assert.strictEqual(Object.keys(DeepState.oState.ofLoadingStep).length, 3, "Three steps had their state set.");
                assert.strictEqual(Object.keys(DeepState.oState.ofLoadingBlock).length, 1, "Only one block had its state set.");
                done();
            });
        });
    });
});

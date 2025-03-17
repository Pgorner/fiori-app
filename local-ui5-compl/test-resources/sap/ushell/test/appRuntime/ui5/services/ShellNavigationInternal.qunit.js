// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.ShellNavigationInternal
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/services/Container",
    "sap/ushell/appRuntime/ui5/services/ShellNavigationInternal",
    "sap/ushell/services/ShellNavigationInternal"
], function (
    AppRuntimeContext,
    AppRuntimeService,
    AppRuntimeContainer,
    ShellNavigationInternalProxy,
    ShellNavigationInternal
) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    /* global QUnit, sinon */

    QUnit.module("constructor", {
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Extends the original service", async function (assert) {
        // Act
        const oShellNavigationInternalProxy = new ShellNavigationInternalProxy();
        // Assert
        assert.strictEqual(oShellNavigationInternalProxy instanceof ShellNavigationInternal, true, "Extends the original service");
        assert.notStrictEqual(oShellNavigationInternalProxy, ShellNavigationInternal, "Is not exactly the original service");
    });

    QUnit.module("toExternal", {
        beforeEach: function () {
            this.oShellNavigationInternal = new ShellNavigationInternalProxy();

            sandbox.stub(AppRuntimeContext, "checkDataLossAndContinue").returns(true);
            sandbox.stub(AppRuntimeContext, "getIsScube").returns(false);
            sandbox.stub(AppRuntimeService, "sendMessageToOuterShell");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("checks data loss closes silently", async function (assert) {
        // Arrange
        AppRuntimeContext.checkDataLossAndContinue.returns(false);
        const oTarget = {
            target: {
                semanticObject: "SemanticObject",
                action: "Action"
            },
            params: {
                param1: "value1"
            }
        };
        // Act
        await this.oShellNavigationInternal.toExternal(oTarget);
        // Assert
        assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 0, "Nothing was sent to the outer shell");
    });

    QUnit.test("Forwards any call to outer shell", async function (assert) {
        // Arrange
        const oTarget = {
            target: {
                semanticObject: "SemanticObject",
                action: "Action"
            },
            params: {
                param1: "value1"
            }
        };
        const oNavTargetResolution = {
            isIntentSupportedLocal: sandbox.stub().withArgs(["SemanticObject-Action?param1=value1"]).resolves({
                "SemanticObject-Action?param1=value1": { supported: false }
            })
        };
        sandbox.stub(AppRuntimeContainer, "getServiceAsync").withArgs("NavTargetResolutionInternal").resolves(oNavTargetResolution);
        // Act
        await this.oShellNavigationInternal.toExternal(oTarget);
        // Assert
        assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 1, "A message was sent");
        const [sMessageId, oParams] = AppRuntimeService.sendMessageToOuterShell.getCall(0).args;
        assert.strictEqual(sMessageId, "sap.ushell.services.CrossApplicationNavigation.toExternal", "Sent to the correct service");
        const oExpectedParams = {
            oArgs: {
                target: {
                    semanticObject: "SemanticObject",
                    action: "Action"
                },
                params: {
                    param1: "value1"
                }
            }
        };
        assert.deepEqual(oParams, oExpectedParams, "Sent the correct params");
    });

    QUnit.test("S/Cube: Forwards supported intents to outer shell", async function (assert) {
        // Arrange
        AppRuntimeContext.getIsScube.returns(true);
        const oTarget = {
            target: {
                semanticObject: "SemanticObject",
                action: "Action"
            },
            params: {
                param1: "value1"
            }
        };
        const oNavTargetResolution = {
            isIntentSupportedLocal: sandbox.stub().withArgs(["SemanticObject-Action?param1=value1"]).resolves({
                "SemanticObject-Action?param1=value1": { supported: true }
            })
        };
        sandbox.stub(AppRuntimeContainer, "getServiceAsync").withArgs("NavTargetResolutionInternal").resolves(oNavTargetResolution);
        // Act
        await this.oShellNavigationInternal.toExternal(oTarget);
        // Assert
        assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 1, "A message was sent");
        const [sMessageId, oParams] = AppRuntimeService.sendMessageToOuterShell.getCall(0).args;
        assert.strictEqual(sMessageId, "sap.ushell.services.CrossApplicationNavigation.toExternal", "Sent to the correct service");
        const oExpectedParams = {
            oArgs: {
                target: {
                    semanticObject: "Shell",
                    action: "startIntent"
                },
                params: {
                  param1: "value1",
                  "sap-remote-system": "",
                  "sap-shell-action": "Action",
                  "sap-shell-so": "SemanticObject"
                }
            }
        };
        assert.deepEqual(oParams, oExpectedParams, "Sent the correct params");
    });

    QUnit.test("S/Cube: Forwards supported intents provided as shellHash to outer shell", async function (assert) {
        // Arrange
        AppRuntimeContext.getIsScube.returns(true);
        const oTarget = {
            target: {
                shellHash: "SemanticObject-Action?param1=value1"
            }
        };
        const oNavTargetResolution = {
            isIntentSupportedLocal: sandbox.stub().withArgs(["SemanticObject-Action?param1=value1"]).resolves({
                "SemanticObject-Action?param1=value1": { supported: true }
            })
        };
        sandbox.stub(AppRuntimeContainer, "getServiceAsync").withArgs("NavTargetResolutionInternal").resolves(oNavTargetResolution);
        // Act
        await this.oShellNavigationInternal.toExternal(oTarget);
        // Assert
        assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 1, "A message was sent");
        const [sMessageId, oParams] = AppRuntimeService.sendMessageToOuterShell.getCall(0).args;
        assert.strictEqual(sMessageId, "sap.ushell.services.CrossApplicationNavigation.toExternal", "Sent to the correct service");
        const oExpectedParams = {
            oArgs: {
                target: {
                    semanticObject: "Shell",
                    action: "startIntent"
                },
                params: {
                  param1: ["value1"],
                  "sap-remote-system": "",
                  "sap-shell-action": "Action",
                  "sap-shell-so": "SemanticObject"
                },
                appSpecificRoute: undefined,
                contextRaw: undefined
            }
        };
        assert.deepEqual(oParams, oExpectedParams, "Sent the correct params");
    });

    QUnit.test("S/Cube: Forwards unsupported intents to outer shell", async function (assert) {
        // Arrange
        AppRuntimeContext.getIsScube.returns(true);
        const oTarget = {
            target: {
                semanticObject: "SemanticObject",
                action: "Action"
            },
            params: {
                param1: "value1"
            }
        };
        const oNavTargetResolution = {
            isIntentSupportedLocal: sandbox.stub().withArgs(["SemanticObject-Action?param1=value1"]).resolves({
                "SemanticObject-Action?param1=value1": { supported: false }
            })
        };
        sandbox.stub(AppRuntimeContainer, "getServiceAsync").withArgs("NavTargetResolutionInternal").resolves(oNavTargetResolution);
        // Act
        await this.oShellNavigationInternal.toExternal(oTarget);
        // Assert
        assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 1, "A message was sent");
        const [sMessageId, oParams] = AppRuntimeService.sendMessageToOuterShell.getCall(0).args;
        assert.strictEqual(sMessageId, "sap.ushell.services.CrossApplicationNavigation.toExternal", "Sent to the correct service");
        const oExpectedParams = {
            oArgs: {
                target: {
                    semanticObject: "SemanticObject",
                    action: "Action"
                },
                params: {
                    param1: "value1"
                }
            }
        };
        assert.deepEqual(oParams, oExpectedParams, "Sent the correct params");
    });

    QUnit.module("toAppHash", {
        beforeEach: function () {
            this.oShellNavigationInternal = new ShellNavigationInternalProxy();

            sandbox.stub(AppRuntimeService, "sendMessageToOuterShell");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards call to the outer shall", async function (assert) {
        // Arrange
        // Act
        await this.oShellNavigationInternal.toAppHash("#SemanticObject-Action", true);
        // Assert
        assert.strictEqual(AppRuntimeService.sendMessageToOuterShell.callCount, 1, "A message was sent");
        const [sMessageId, oParams] = AppRuntimeService.sendMessageToOuterShell.getCall(0).args;
        assert.strictEqual(sMessageId, "sap.ushell.services.ShellNavigationInternal.toExternal", "Sent to the correct service");
        const oExpectedParams = {
            sAppHash: "#SemanticObject-Action",
            bWriteHistory: true
        };
        assert.deepEqual(oParams, oExpectedParams, "Sent the correct params");
    });
});

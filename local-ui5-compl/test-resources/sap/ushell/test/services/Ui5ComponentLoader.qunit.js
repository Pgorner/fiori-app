// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Ui5ComponentLoader
 */
sap.ui.define([
    "sap/ui/core/Lib",
    "sap/ushell/services/Ui5ComponentLoader",
    "sap/ushell/services/Ui5ComponentLoader/utils",
    "sap/ushell/utils",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/base/Log",
    "sap/ushell/UI5ComponentType",
    "sap/ui/core/Component",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    Lib,
    Ui5ComponentLoader,
    Ui5ComponentLoaderUtils,
    ushellUtils,
    Config,
    EventHub,
    Log,
    UI5ComponentType,
    Component,
    jQuery,
    Container // required because of dependency chain to ushell.utils, requires refactoring
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    var aDefaultCoreExtLightPreloadBundles = [
        "some/module",
        "some/other/module"
    ];

    QUnit.module("Constructor", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("CoreResourcesComplement Loading - Event is listened on", function (assert) {
        // Arrange
        var oDoStub = sandbox.stub();
        var oOnceStub = sandbox.stub(EventHub, "once").returns({ do: oDoStub });
        var sExpectedOnceArg = "loadCoreResourcesComplement";

        // Act
        var oService = new Ui5ComponentLoader();
        var oLoadCoreResourcesComplementStub = sandbox.stub(oService, "loadCoreResourcesComplement");
        oDoStub.callArg(0);

        // Assert
        assert.ok(oService, "The service was created");
        assert.strictEqual(oOnceStub.firstCall.args[0], sExpectedOnceArg, "Subscribed to correct Event");
        assert.strictEqual(oLoadCoreResourcesComplementStub.callCount, 1, "CoreResourcesComplement Loading was triggered after corresponding event was fired");
    });

    QUnit.module("createComponent", {
        beforeEach: function () {
            this.oLogDebugStub = sandbox.stub(Log, "debug");
            this.oLogTraceStub = sandbox.stub(Log, "trace");
            this.oLogInfoStub = sandbox.stub(Log, "info");
            this.oLogWarningStub = sandbox.stub(Log, "warning");
            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oLogFatalStub = sandbox.stub(Log, "fatal");

            this.oComponentMetadataMock = { fakeMetadata: null };
            this.oComponentInstanceMock = {
                getMetadata: sandbox.stub().returns(this.oComponentMetadataMock)
            };

            this.oGetParameterValueBooleanStub = sandbox.stub(ushellUtils, "getParameterValueBoolean");
            this.oGetParameterValueBooleanStub.withArgs("sap-ushell-nocb").returns(false);
            this.oGetParameterValueBooleanStub.throws("getParameterValueBoolean error");

            this.oComponentCreateStub = sandbox.stub(Component, "create");
            this.oComponentCreateStub.resolves(this.oComponentInstanceMock);
            this.Ui5ComponentLoader = new Ui5ComponentLoader({});
            Ui5ComponentLoaderUtils._setDefaultDependencies(["predefined.default.dependency.1", "predefined.default.dependency.2"]);

            this.oDefaultParsedShellHash = {
                semanticObject: "semanticObject",
                action: "action"
            };
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/customPreload/coreResourcesComplement").returns(aDefaultCoreExtLightPreloadBundles);
        },
        afterEach: function () {
            delete window["sap-ui-debug"];
            sandbox.restore();
        }
    });

    QUnit.test("Does not call Component.create when target resolution result is undefined", function (assert) {
        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent()
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                assert.strictEqual(this.oComponentCreateStub.callCount, 0, "component factory was never called");
                assert.strictEqual(oActualAdjustedTargetResolutionResult, undefined, "promise resolved with expected result");
            }.bind(this));
    });

    QUnit.test("Does not call Component.create when application type is NWBC", function (assert) {
        // Arrange
        var oTargetResolutionResult = { applicationType: "NWBC" };
        var oExpectedResult = { applicationType: "NWBC" };
        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                assert.strictEqual(this.oComponentCreateStub.callCount, 0, "component factory was never called");
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedResult, "promise resolved with expected result");
            }.bind(this));
    });

    QUnit.test("Does not call Component.create when application type is URL and no ui5ComponentName set", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            additionalInformation: "not a ui5 component",
            applicationType: "URL"
        };
        var oExpectedResult = {
            additionalInformation: "not a ui5 component",
            applicationType: "URL"
        };
        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                assert.strictEqual(this.oComponentCreateStub.callCount, 0, "component factory was never called");
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedResult, "promise resolved with expected result");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies defined and URL has query parameters", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d"
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            coreResourcesFullyLoaded: true // if customPreload is switched off, we set the flag as we expect a regular UI5 bootstrap
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/with/query",
            componentData: {
                startupParameters: {
                    a: ["b"],
                    c: ["d"]
                }
            },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies and no URL defined", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component"
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies and no URL defined and componentData specified", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            componentData: { fakeData: true }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            coreResourcesFullyLoaded: true,
            componentData: { fakeData: true }
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            componentData: {
                fakeData: true,
                startupParameters: {}
            },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies defined and URL has query parameters", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d"
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/with/query",
            componentData: {
                startupParameters: {
                    a: ["b"],
                    c: ["d"]
                }
            },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when startup parameters both in url and in resolution result", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            componentData: {
                startupParameters: {
                    wrong: ["oftarget"],
                    c: ["OFtarget"]
                }
            }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            // beware, this is the wrong data
            componentData: {
                startupParameters: {
                    wrong: ["oftarget"],
                    c: ["OFtarget"]
                }
            },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/with/query",
            componentData: {
                startupParameters: {
                    a: ["b"],
                    c: ["d"]
                },
                config: {
                    confProp1: "value 1",
                    confProp2: "value2"
                }
            },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when startup parameters only in resolution result", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            componentData: {
                startupParameters: {
                    correct: ["oftarget"],
                    c: ["OFtarget"]
                }
            }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            // beware, this is the wrong data
            componentData: {
                startupParameters: {
                    correct: ["oftarget"],
                    c: ["OFtarget"]
                }
            },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/with/query",
            componentData: {
                startupParameters: {
                    correct: ["oftarget"],
                    c: ["OFtarget"]
                },
                config: {
                    confProp1: "value 1",
                    confProp2: "value2"
                }
            },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies defined and URL has query parameters and applicationConfiguratin defined", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            manifest: false,
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            manifest: false,
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/with/query",
            componentData: {
                startupParameters: {
                    a: ["b"],
                    c: ["d"]
                },
                config: {
                    confProp1: "value 1",
                    confProp2: "value2"
                }
            },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies defined, customPreload is enabled and loadCoreExt set to false", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            loadCoreExt: false
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            manifest: false,
            url: "component/url/"
            // coreResourcesFullyLoaded should NOT be set in this case
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: { libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"] }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies defined and loadCoreExt set to false and customPreload enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            loadCoreExt: false
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
            // coreResourcesFullyLoaded should NOT be set in this case (loadCoreExt explicitly set to false, usually by FLP component)
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: { libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"] }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies defined and loadDefaultDependencies set to false", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            loadDefaultDependencies: false
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {}
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when applicationDependencies without asyncHints and some arbitrary property defined", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: { someProperty: "ui5MayInventInFuture" }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: { someProperty: "ui5MayInventInFuture" },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            someProperty: "ui5MayInventInFuture",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when applicationDependencies with component name different than in app properties and manifestUrl defined (app variant use case)", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.app.variant",
            url: "component/url/",
            applicationDependencies: {
                name: "some.ui5.component",
                manifestUrl: "/path/to/manifest.json"
            }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.app.variant",
            url: "component/url/",
            applicationDependencies: {
                name: "some.ui5.component",
                manifestUrl: "/path/to/manifest.json"
            },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            manifestUrl: "/path/to/manifest.json",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when manifest defined (app variant use case)", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.app.variant",
            url: "component/url/",
            applicationDependencies: {
                name: "some.ui5.component",
                manifest: "/path/to/manifest.json"
            }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.app.variant",
            url: "component/url/",
            applicationDependencies: {
                name: "some.ui5.component",
                manifest: "/path/to/manifest.json"
            },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: "/path/to/manifest.json",
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    [{
        name: "no manifest",
        input: {
            oTargetResolutionResult: {
                applicationType: "URL",
                ui5ComponentName: {
                    flVersionCalls: 0,
                    getFlexVersionVal: undefined
                },
                url: "component/url/",
                applicationDependencies: {
                    ui5ComponentName: "some.app.variant"
                }
            },
            coreLibs: {}
        },
        output: {
            manifest: undefined,
            getFlexVersionCalls: 0,
            allCalls: 0
        }
    }, {
        name: "manifest number",
        input: {
            oTargetResolutionResult: {
                applicationType: "URL",
                ui5ComponentName: {
                    flVersionCalls: 0,
                    getFlexVersionVal: undefined
                },
                url: "component/url/",
                applicationDependencies: {
                    ui5ComponentName: "some.app.variant",
                    manifest: 1234
                }
            },
            coreLibs: {}
        },
        output: {
            manifest: 1234,
            getFlexVersionCalls: 0,
            allCalls: 0
        }
    }, {
        name: "manifest string, sap.ui.fl not loaded",
        input: {
            oTargetResolutionResult: {
                applicationType: "URL",
                ui5ComponentName: {
                    flVersionCalls: 0,
                    getFlexVersionVal: undefined
                },
                url: "component/url/",
                applicationDependencies: {
                    ui5ComponentName: "some.app.variant",
                    manifest: "/path/to/manifest.json"
                }
            },
            coreLibs: {}
        },
        output: {
            manifest: "/path/to/manifest.json",
            getFlexVersionCalls: 0,
            allCalls: 1
        }
    }, {
        name: "manifest string, sap.ui.fl loaded, getFlexVersio returns undefined",
        input: {
            oTargetResolutionResult: {
                applicationType: "URL",
                ui5ComponentName: {
                    flVersionCalls: 0,
                    getFlexVersionVal: undefined
                },
                url: "component/url/",
                applicationDependencies: {
                    ui5ComponentName: "some.app.variant",
                    manifest: "/path/to/manifest.json"
                }
            },
            coreLibs: {
                "sap.ui.fl": true
            }
        },
        output: {
            manifest: "/path/to/manifest.json",
            getFlexVersionCalls: 1,
            allCalls: 1
        }
    }, {
        name: "manifest string, sap.ui.fl loaded, getFlexVersio returns version",
        input: {
            oTargetResolutionResult: {
                applicationType: "URL",
                ui5ComponentName: {
                    flVersionCalls: 0,
                    getFlexVersionVal: "1234"
                },
                url: "component/url/",
                applicationDependencies: {
                    ui5ComponentName: "some.app.variant",
                    manifest: "/path/to/manifest.json"
                }
            },
            coreLibs: {
                "sap.ui.fl": true
            }
        },
        output: {
            manifest: "/path/to/manifest.json?version=1234",
            getFlexVersionCalls: 1,
            allCalls: 1
        }
    }].forEach(function (oFixture) {
        QUnit.test("test Ui5ComponentLoader.createComponent for adapt ui case - " + oFixture.name, function (assert) {
            // Arrange
            const fnDone = assert.async();

            sandbox.stub(this.Ui5ComponentLoader, "instantiateComponent").callsFake(function (oData) {
                return Promise.resolve(oData);
            });
            sandbox.stub(Lib, "all").returns(oFixture.input.coreLibs);
            sap.ui.define("sap/ui/fl/apply/api/FlexRuntimeInfoAPI", [], function () {
                return {
                    getFlexVersion: sandbox.stub().callsFake(function (oReference) {
                        oReference.reference.flVersionCalls++;
                        return oReference.reference.getFlexVersionVal;
                    })
                };
            });

            // Act
            var oCreatePromise = this.Ui5ComponentLoader.createComponent(oFixture.input.oTargetResolutionResult);

            // Assert
            oCreatePromise.then(function (oData) {
                assert.ok(true, "Promise resolved");
                assert.strictEqual(Lib.all.callCount, oFixture.output.allCalls, "allCalls called");
                assert.strictEqual(oData.componentProperties.name.flVersionCalls, oFixture.output.getFlexVersionCalls, "getFlexVersionVal called");

                assert.strictEqual(oData.componentProperties.manifest, oFixture.output.manifest, "manifest value is ok");
                fnDone();
            });
        });
    });

    QUnit.test("Calls Component.create correctly when applicationDependencies with component URL but no URL in app properties", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            applicationDependencies: {
                name: "some.ui5.component",
                url: "component/url/"
            }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            applicationDependencies: {
                name: "some.ui5.component",
                url: "component/url/"
            },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when applicationDependencies with asyncHints defined and customPreload enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    libs: ["some.lib.dependency"],
                    preloadBundles: ["some/preload/bundle.js"]
                }
            }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    libs: ["some.lib.dependency"],
                    preloadBundles: ["some/preload/bundle.js"]
                }
            },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["some.lib.dependency"],
                preloadBundles: ["some/preload/bundle.js"].concat(aDefaultCoreExtLightPreloadBundles)
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when applicationDependencies with asyncHints defined and parsedShellHash specified", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    libs: ["some.lib.dependency"],
                    preloadBundles: ["some/preload/bundle.js"]
                }
            }
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    libs: ["some.lib.dependency"],
                    preloadBundles: ["some/preload/bundle.js"]
                }
            },
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            id: "application-semanticObject-action-component",
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["some.lib.dependency"],
                preloadBundles: ["some/preload/bundle.js"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when applicationDependencies with cachebuster token in asyncHints libraries and sap-ushell-nocb=false", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    libs: [{
                        name: "sap.s4h.cfnd.featuretoggleA",
                        url: "/sap/bc/ui5_ui5/sap/featuretoggles1/~AB81E9A6ED7B1368CD25EC22D~/something"
                    }, {
                        name: "sap.s4h.cfnd.featuretoggleB",
                        url: "/sap/bc/ui5_ui5/sap/featuretoggles1/~498970EAB81E9A6ED7B1368CD25EC22D~5"
                    }],
                    preloadBundles: ["some/preload/bundle.js"]
                }
            }
        };
        var oExpectedComponentProperties = {
            id: "application-semanticObject-action-component",
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: [{
                    name: "sap.s4h.cfnd.featuretoggleA",
                    url: "/sap/bc/ui5_ui5/sap/featuretoggles1/~AB81E9A6ED7B1368CD25EC22D~/something"
                }, {
                    name: "sap.s4h.cfnd.featuretoggleB",
                    url: "/sap/bc/ui5_ui5/sap/featuretoggles1/~498970EAB81E9A6ED7B1368CD25EC22D~5"
                }],
                preloadBundles: ["some/preload/bundle.js"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when applicationDependencies with cachebuster token in asyncHints libraries and sap-ushell-nocb=true", function (assert) {
        // Arrange
        this.oGetParameterValueBooleanStub.withArgs("sap-ushell-nocb").returns(true);
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    libs: [{
                        name: "sap.s4h.cfnd.featuretoggleA",
                        url: "/sap/bc/ui5_ui5/sap/featuretoggles1/~AB81E9A6ED7B1368CD25EC22D~/something"
                    }, {
                        name: "sap.s4h.cfnd.featuretoggleB",
                        url: "/sap/bc/ui5_ui5/sap/featuretoggles1/~498970EAB81E9A6ED7B1368CD25EC22D~5"
                    }],
                    preloadBundles: ["some/preload/bundle.js"]
                }
            }
        };
        var oExpectedComponentProperties = {
            id: "application-semanticObject-action-component",
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: [{
                    name: "sap.s4h.cfnd.featuretoggleA",
                    url: "/sap/bc/ui5_ui5/sap/featuretoggles1/something"
                }, {
                    name: "sap.s4h.cfnd.featuretoggleB",
                    url: "/sap/bc/ui5_ui5/sap/featuretoggles1"
                }],
                preloadBundles: ["some/preload/bundle.js"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when no applicationDependencies defined, parsedShellHash and waitForBeforeInstantiation specified", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        };
        var oWaitForBeforeInstantiation = {
            dummyPromise: ""
        };
        var oExpectedAdjustedTargetResolutionResultWithoutComponentHandle = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            coreResourcesFullyLoaded: true
        };
        var oExpectedComponentProperties = {
            id: "application-semanticObject-action-component",
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"],
                waitFor: { dummyPromise: "" }
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash, oWaitForBeforeInstantiation)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                delete oActualAdjustedTargetResolutionResult.componentHandle;
                assert.deepEqual(oActualAdjustedTargetResolutionResult, oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when sap-ui-fl-max-layer is present the resolution result as a reserved parameter", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            reservedParameters: { "sap-ui-fl-max-layer": "SOMETHING" }
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: {
                startupParameters: {},
                technicalParameters: { "sap-ui-fl-max-layer": "SOMETHING" }
            },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Calls Component.create correctly when pluginExtensions is presented", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            getExtensions: "someFunction"
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            componentData: {
                startupParameters: {},
                getExtensions: "someFunction"
            },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"]
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                var oComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;
                assert.strictEqual(oComponentHandle.getInstance(), this.oComponentInstanceMock, "component instance created from component handle is same as from component factory");
                assert.strictEqual(oComponentHandle.getMetadata(), this.oComponentMetadataMock, "component metadata returned from component handle is same as from component instance");

                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Uses correct bundle for asyncHints when customPreload config is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        };
        var oExpectedComponentProperties = {
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"],
                preloadBundles: aDefaultCoreExtLightPreloadBundles
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                // Assert
                assert.strictEqual(this.oComponentCreateStub.callCount, 1, "Component.create called exactly 1 time");
                assert.deepEqual(this.oComponentCreateStub.getCall(0).args[0], oExpectedComponentProperties, "Component.create called with expected parameters");
            }.bind(this));
    });

    QUnit.test("Logs Errors correctly when Component.create fails with no stacktrace and status", function (assert) {
        // Arrange
        var oExpectedError = {
            // no status
            // no stack
            toString: function () {
                return "a string error message";
            }
        };
        this.oComponentCreateStub.returns(Promise.reject(oExpectedError));
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        };
        var oExpectedComponentProperties = {
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"],
                waitFor: []
            },
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            id: "application-semanticObject-action-component"
        };
        var aExpectedLogArgs = [
            "The issue is most likely caused by application some.ui5.component. Please create a support incident and assign it to the support component of the respective application.",
            "Failed to load UI5 component with properties: 'JSON_STRING'. Error: 'a string error message'",
            "some.ui5.component"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash, [] /* no wait for promise */)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .catch(function (oError) {
                assert.deepEqual(oError, oExpectedError, "error of Component.create reject being passed");

                assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log.error was called one time");

                // capture from json string from parameter and test separately
                // to avoid failure due to property order
                var sArgWithJson = this.oLogErrorStub.getCall(0).args[1];
                var aMatches = sArgWithJson.match(/{[\s\S]+}/);
                var oParsedJson = JSON.parse(aMatches[0]);
                this.oLogErrorStub.getCall(0).args[1] = sArgWithJson.replace(aMatches[0], "JSON_STRING");

                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedLogArgs, "Log.error was called with correct error");
                assert.deepEqual(oParsedJson, oExpectedComponentProperties, "Logged correct properties");
            }.bind(this));
    });

    QUnit.test("Logs Errors correctly when Component.create fails with 'parsererror' status", function (assert) {
        // Arrange
        var oExpectedError = {
            status: "parsererror",
            // no stack
            toString: function () {
                return "a string error message";
            }
        };
        this.oComponentCreateStub.returns(Promise.reject(oExpectedError));
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        };
        var oExpectedComponentProperties = {
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"],
                waitFor: []
            },
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            id: "application-semanticObject-action-component"
        };
        var aExpectedLogArgs = [
            "The issue is most likely caused by application some.ui5.component, as one or more of its resources could not be parsed. "
            + "Please create a support incident and assign it to the support component of the respective application.",
            "Failed to load UI5 component with properties: 'JSON_STRING'. Error: 'a string error message'",
            "some.ui5.component"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash, [] /* no wait for promise */)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .catch(function (oError) {
                assert.deepEqual(oError, oExpectedError, "error of Component.create reject being passed");

                assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log.error was called one time");

                // capture from json string from parameter and test separately
                // to avoid failure due to property order
                var sArgWithJson = this.oLogErrorStub.getCall(0).args[1];
                var aMatches = sArgWithJson.match(/{[\s\S]+}/);
                var oParsedJson = JSON.parse(aMatches[0]);
                this.oLogErrorStub.getCall(0).args[1] = sArgWithJson.replace(aMatches[0], "JSON_STRING");

                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedLogArgs, "Log.error was called with correct error");
                assert.deepEqual(oParsedJson, oExpectedComponentProperties, "Logged correct properties");
            }.bind(this));
    });

    QUnit.test("Logs Errors correctly when Component.create fails with a stack trace and a status", function (assert) {
        // Arrange
        var oExpectedError = {
            status: "parsererror",
            stack: "SomeError: cannot do this and that\nline1\nline2\nline3"
        };
        this.oComponentCreateStub.returns(Promise.reject(oExpectedError));
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        };
        var oExpectedComponentProperties = {
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"],
                waitFor: []
            },
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            id: "application-semanticObject-action-component"
        };
        var aExpectedLogArgs = [
            "The issue is most likely caused by application some.ui5.component, as one or more of its resources could not be parsed. "
            + "Please create a support incident and assign it to the support component of the respective application.",
            "Failed to load UI5 component with properties: 'JSON_STRING'. Error likely caused by:\n"
            + [
                "SomeError: cannot do this and that",
                "line1",
                "line2",
                "line3"
            ].join("\n"),
            "some.ui5.component"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash, [] /* no wait for promise */)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .catch(function (oError) {
                assert.deepEqual(oError, oExpectedError, "error of Component.create reject being passed");

                assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log.error was called one time");

                // capture from json string from parameter and test separately
                // to avoid failure due to property order
                var sArgWithJson = this.oLogErrorStub.getCall(0).args[1];
                var aMatches = sArgWithJson.match(/{[\s\S]+}/);
                var oParsedJson = JSON.parse(aMatches[0]);
                this.oLogErrorStub.getCall(0).args[1] = sArgWithJson.replace(aMatches[0], "JSON_STRING");

                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedLogArgs, "Log.error was called with correct error");
                assert.deepEqual(oParsedJson, oExpectedComponentProperties, "Logged correct properties");
            }.bind(this));
    });

    QUnit.test("Logs Errors correctly when Component.create fails with a stack trace and no status", function (assert) {
        // Arrange
        var oExpectedError = {
            // no status
            stack: "SomeError: cannot do this and that\nline1\nline2\nline3"
        };
        this.oComponentCreateStub.returns(Promise.reject(oExpectedError));
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        };
        var oExpectedComponentProperties = {
            componentData: { startupParameters: {} },
            asyncHints: {
                libs: ["predefined.default.dependency.1", "predefined.default.dependency.2"],
                waitFor: []
            },
            name: "some.ui5.component",
            manifest: false,
            url: "component/url/",
            id: "application-semanticObject-action-component"
        };
        var aExpectedLogArgs = [
            "The issue is most likely caused by application some.ui5.component. Please create a support incident and assign it to the support component of the respective application.",
            "Failed to load UI5 component with properties: 'JSON_STRING'. Error likely caused by:\n"
            + [
                "SomeError: cannot do this and that",
                "line1",
                "line2",
                "line3"
            ].join("\n"),
            "some.ui5.component"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash, [] /* no wait for promise */)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .catch(function (oError) {
                assert.deepEqual(oError, oExpectedError, "error of Component.create reject being passed");

                assert.strictEqual(this.oLogErrorStub.callCount, 1, "Log.error was called one time");

                // capture from json string from parameter and test separately
                // to avoid failure due to property order
                var sArgWithJson = this.oLogErrorStub.getCall(0).args[1];
                var aMatches = sArgWithJson.match(/{[\s\S]+}/);
                var oParsedJson = JSON.parse(aMatches[0]);
                this.oLogErrorStub.getCall(0).args[1] = sArgWithJson.replace(aMatches[0], "JSON_STRING");

                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedLogArgs, "Log.error was called with correct error");
                assert.deepEqual(oParsedJson, oExpectedComponentProperties, "Logged correct properties");
            }.bind(this));
    });

    QUnit.test("Ui5 component type works correctly", function (assert) {
        // Arrange
        var oModifyComponentPropertiesStub = sandbox.stub().callsFake(function (oComponentProperties, sType) {
            return Promise.resolve(oComponentProperties);
        });
        this.Ui5ComponentLoader._oAdapter = {
            modifyComponentProperties: oModifyComponentPropertiesStub
        };
        var oTargetResolutionResult = {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult, this.oDefaultParsedShellHash, [] /* no wait for promise */, UI5ComponentType.Plugin)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .then(function (oActualAdjustedTargetResolutionResult) {
                assert.equal(oModifyComponentPropertiesStub.getCall(0).args[1], "Plugin", "method called with Plugin ");
            });
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'trace'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "trace",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogTraceStub.getCall(0).args, aExpectedLogArgs, "Called Log.trace with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'debug'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "debug",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogDebugStub.getCall(0).args, aExpectedLogArgs, "Called Log.debug with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'info'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "info",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedLogArgs, "Called Log.info with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'warning'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "warning",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogWarningStub.getCall(0).args, aExpectedLogArgs, "Called Log.warning with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'error'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "error",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedLogArgs, "Called Log.error with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'fatal'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "fatal",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogFatalStub.getCall(0).args, aExpectedLogArgs, "Called Log.fatal with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'WARNING'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "WARNING",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogWarningStub.getCall(0).args, aExpectedLogArgs, "Called Log.warning with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'WaRnInG'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "WaRnInG",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogWarningStub.getCall(0).args, aExpectedLogArgs, "Called Log.warning with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity undefined", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: undefined,
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedLogArgs, "Called Log.error with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with severity 'supergau'", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "supergau",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedLogArgs, "Called Log.error with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message without text", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{ severity: "info" }]
            }
        };
        var aExpectedLogArgs = [
            undefined,
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedLogArgs, "Called Log.info with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message without severity or text", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{}]
            }
        };
        var aExpectedLogArgs = [
            undefined,
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedLogArgs, "Called Log.error with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with single message with details defined", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "trace",
                    details: "Foo Details, Bar",
                    text: "Foo log message!"
                }]
            }
        };
        var aExpectedLogArgs = [
            "Foo log message!",
            "Foo Details, Bar",
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogTraceStub.getCall(0).args, aExpectedLogArgs, "Called Log.trace with correct args");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with messages array is empty", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: []
            }
        };

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.strictEqual(this.oLogErrorStub.callCount, 0, "Log.error was not called");
            }.bind(this));
    });

    QUnit.test("Logs error from _resolveSingleMatchingTarget correctly with messages array has two entries", function (assert) {
        // Arrange
        var oTargetResolutionResult = {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [
                    { severity: "trace", text: "Foo log message - number 1" },
                    { text: "Foo log message - number 2" }
                ]
            }
        };
        var aExpectedFirstLogArgs = [
            "Foo log message - number 1",
            undefined,
            "foo.bar.Test"
        ];
        var aExpectedSecondLogArgs = [
            "Foo log message - number 2",
            undefined,
            "foo.bar.Test"
        ];

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.createComponent(oTargetResolutionResult)
                .done(resolve)
                .fail(reject);
        }.bind(this))
            .finally(function () {
                assert.deepEqual(this.oLogTraceStub.getCall(0).args, aExpectedFirstLogArgs, "Called Log.trace with correct args");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, aExpectedSecondLogArgs, "Called Log.error with correct args");
            }.bind(this));
    });

    QUnit.module("loadCoreResourcesComplement", {
        beforeEach: function () {
            this.oEmitStub = sandbox.stub(EventHub, "emit");

            this.Ui5ComponentLoader = new Ui5ComponentLoader({});

            this.oLoadBundleStub = sandbox.stub(Ui5ComponentLoaderUtils, "loadBundle");
            this.oLoadBundleStub.returns(Promise.resolve());

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/customPreload/coreResourcesComplement").returns(aDefaultCoreExtLightPreloadBundles);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Loads the correct bundle resources when customPreload is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(false);

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.loadCoreResourcesComplement()
                .then(resolve)
                .catch(reject);
        }.bind(this))
            .then(function () {
                // Assert
                assert.deepEqual(this.oLoadBundleStub.getCall(0).args[0], [], "loadBundle called with an empty array");
            }.bind(this));
    });

    QUnit.test("Loads the correct bundle resources when customPreload is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);

        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.loadCoreResourcesComplement()
                .then(resolve)
                .catch(reject);
        }.bind(this))
            .then(function () {
                // Assert
                assert.deepEqual(this.oLoadBundleStub.getCall(0).args[0], aDefaultCoreExtLightPreloadBundles, "loadBundle called with configured coreResourcesComplement");
            }.bind(this));
    });

    QUnit.test("Returns a Promise and resolves it when the Bundle is loaded", function (assert) {
        // Arrange
        var aExpectedArgs = [
            "CoreResourcesComplementLoaded",
            { status: "success" }
        ];
        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.loadCoreResourcesComplement()
                .then(resolve)
                .catch(reject);
        }.bind(this))
            .then(function () {
                // Assert
                assert.deepEqual(this.oEmitStub.getCall(0).args, aExpectedArgs, "EventHub.emit was called with correct args");
            }.bind(this));
    });

    QUnit.test("Returns a Promise and rejects it when the Bundle fails to load", function (assert) {
        // Arrange
        this.oLoadBundleStub.returns(new jQuery.Deferred().reject().promise());
        var aExpectedArgs = [
            "CoreResourcesComplementLoaded",
            { status: "failed" }
        ];
        // Act
        return new Promise(function (resolve, reject) {
            this.Ui5ComponentLoader.loadCoreResourcesComplement()
                .then(resolve)
                .catch(reject);
        }.bind(this))
            .catch(function () {
                // Assert
                assert.deepEqual(this.oEmitStub.getCall(0).args, aExpectedArgs, "EventHub.emit was called with correct args");
            }.bind(this));
    });

    QUnit.test("Caches the Promise on success", function (assert) {
        // Arrange
        var done = assert.async();
        var oLoadBundleDeferred = new jQuery.Deferred();
        this.oLoadBundleStub.returns(oLoadBundleDeferred.promise());

        // Act
        var oDeferred = this.Ui5ComponentLoader.loadCoreResourcesComplement();
        oLoadBundleDeferred.resolve();
        var oSecondDeferred = this.Ui5ComponentLoader.loadCoreResourcesComplement();

        // Assert
        assert.strictEqual(oDeferred, oSecondDeferred, "Later calls return the same promise");

        jQuery.when(oDeferred, oSecondDeferred)
            .done(function () {
                assert.ok(true, "Both promises resolved");
                done();
            });
    });


    QUnit.test("Returns a Promise and tries to load the bundles again after a failing first 'round'", function (assert) {
        // Arrange
        var done = assert.async();
        var fnResolve, fnReject;
        var oLoadBundleDeferred = new Promise(function (resolve, reject) { fnReject = reject; });
        this.oLoadBundleStub.returns(oLoadBundleDeferred);

        // Act 1 - First Call
        var oFirstDeferred = this.Ui5ComponentLoader.loadCoreResourcesComplement();
        fnReject();

        // Act 2 - Second Call, after failure of first request round
        oFirstDeferred.catch(function () {
            oLoadBundleDeferred = new Promise(function (resolve, reject) { fnResolve = resolve; });
            this.oLoadBundleStub.returns(oLoadBundleDeferred);
            var oSecondDeferred = this.Ui5ComponentLoader.loadCoreResourcesComplement();
            fnResolve();

            // Assert
            assert.notStrictEqual(oFirstDeferred, oSecondDeferred, "Later calls return another Promise (when first round has finished)");

            Promise.allSettled([oFirstDeferred, oSecondDeferred])
                .then(function (aPromiseResults) {

                    assert.strictEqual(aPromiseResults[0].status, "rejected", "First promise rejected");
                    assert.strictEqual(aPromiseResults[1].status, "fulfilled", "Second promise resolved");
                    done();
                });
        }.bind(this));
    });

    QUnit.module("getCoreResourcesComplementBundle", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/customPreload/coreResourcesComplement").returns(aDefaultCoreExtLightPreloadBundles);

            this.Ui5ComponentLoader = new Ui5ComponentLoader({});
        },
        afterEach: function () {

            sandbox.restore();
        }
    });

    QUnit.test("Returns the configured resources when customPreload is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);

        // Act
        var aResult = this.Ui5ComponentLoader.getCoreResourcesComplementBundle();

        // Assert
        assert.deepEqual(aResult, aDefaultCoreExtLightPreloadBundles, "Returned the correct resources");
    });

    QUnit.test("Returns an empty array when customPreload is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(false);

        // Act
        var aResult = this.Ui5ComponentLoader.getCoreResourcesComplementBundle();

        // Assert
        assert.deepEqual(aResult, [], "Returned the correct resources");
    });
});

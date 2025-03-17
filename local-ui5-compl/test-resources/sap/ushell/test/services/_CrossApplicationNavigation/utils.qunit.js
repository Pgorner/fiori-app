// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's Utils
 * @deprecated since 1.120.0
 */
sap.ui.define([
    "sap/ushell/services/_CrossApplicationNavigation/utils",
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/Container",
    "sap/ushell/TechnicalParameters"
], function (oUtils, testUtils, utils, Container, TechnicalParameters) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("Utils", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    [{
        testDescription: "parameters expressed in conventional format (no array)",
        oGetLinksParams: {
            p1: "v1"
        },
        expectedParameters: [{
            name: "p1",
            value: "v1",
            options: {}
        }]
    }, {
        testDescription: "parameters expressed in conventional format (array)",
        oGetLinksParams: {
            p1: ["v1"]
        },
        expectedParameters: [{
            name: "p1",
            value: ["v1"],
            options: {}
        }]
    }, {
        testDescription: "parameters expressed in extended format (single value)",
        oGetLinksParams: {
            p1: {
                value: "v1"
            }
        },
        expectedParameters: [{
            name: "p1",
            value: "v1",
            options: {}
        }]
    }, {
        testDescription: "parameters expressed in extended format (multiple values, with options)",
        oGetLinksParams: {
            p1: {
                value: "v1"
            },
            p2: {
                value: "v2",
                p2OptionName: "p2OptionValue"
            },
            p3: ["v3"]
        },
        expectedParameters: [{
            name: "p1",
            value: "v1",
            options: {}
        }, {
            name: "p2",
            value: "v2",
            options: {
                p2OptionName: "p2OptionValue"
            }
        }, {
            name: "p3",
            value: ["v3"],
            options: {}
        }]
    }].forEach(function (oFixture) {
        function sortByNameField (oA, oB) {
            if (oA.name === oB.name) {
                return 0;
            }
            return oA.name < oB.name ? -1 : 1;
        }

        QUnit.test("parseGetLinksParameters when " + oFixture.testDescription, function (assert) {
            assert.deepEqual(
                oUtils.parseGetLinksParameters(oFixture.oGetLinksParams).sort(sortByNameField),
                oFixture.expectedParameters.sort(sortByNameField),
                "parses parameters as expected"
            );
        });
    });

    [{
        testDescription: "input is null",
        oGetLinksParams: null,
        expectedDefinition: {}
    }, {
        testDescription: "input is an empty object",
        oGetLinksParams: {},
        expectedDefinition: {}
    }, {
        testDescription: "input in mixed format is given",
        oGetLinksParams: {
            p1: "v1", // single value
            p2: ["v2"], // array-wrapped value
            p3: { // "extended" format
                value: ["v3", "v4"],
                required: true
            }
        },
        expectedDefinition: {
            p1: "v1",
            p2: ["v2"],
            p3: ["v3", "v4"]
        }
    }].forEach(function (oFixture) {
        QUnit.test("extractGetLinksParameterDefinition when " + oFixture.testDescription, function (assert) {
            assert.deepEqual(
                oUtils.extractGetLinksParameterDefinition(oFixture.oGetLinksParams),
                oFixture.expectedDefinition,
                "extracts the expected definition"
            );
        });
    });

    QUnit.module("_injectStickyParameter", {
        beforeEach: function (assert) {
            var done = assert.async();

            this.oGetParametersStub = sandbox.stub(TechnicalParameters, "getParameters");
            this.oGetParameterValueSyncStub = sandbox.stub(TechnicalParameters, "getParameterValueSync");
            this.oInjectParametersStub = sandbox.stub(oUtils, "_injectParameters");

            Container.init("local")
                .then(function () {
                    Promise.all([
                        Container.getServiceAsync("AppLifeCycle")
                    ])
                        .then(function (aServices) {
                            this.AppLifeCycle = aServices[0];
                            done();
                        }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns input parameters if app life cycle is undefined", async function (assert) {
        // Arrange
        sandbox.stub(Container, "getServiceAsync").resolves({});
        var oParams = {
            args: { foo: "bar" }
        };

        // Act
        const vResult = await oUtils.injectStickyParametersAsync(oParams);

        // Assert
        assert.deepEqual(vResult, oParams.args, "Correct parameters are returned");
    });

    QUnit.test("Returns input parameters if current application is undefined", async function (assert) {
        // Arrange
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({});
        const oParams = {
            args: { foo: "bar" }
        };

        // Act
        const vResult = await oUtils.injectStickyParametersAsync(oParams);

        // Assert
        assert.deepEqual(vResult, oParams.args, "Correct parameters are returned");
    });

    QUnit.test("Calls getParameters of TechnicalParameter", async function (assert) {
        // Arrange
        var oAppLifeCycle = {
            getCurrentApplication: function () {
                return { app: "1" };
            }
        };
        var oParams = {
            args: { foo: "bar" },
            appLifeCycle: {
                getCurrentApplication: function () {
                    return { container: "1" };
                }
            },
            technicalParameters: TechnicalParameters
        };
        var oTechParams = [
            {
                name: "sap-navigation-scope",
                injectFrom: "inboundParameter",
                sticky: true,
                stickyName: "sap-navigation-scope-filter"
            }
        ];
        var oParamValue = "green";
        sandbox.stub(Container, "getServiceAsync").resolves(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        await oUtils.injectStickyParametersAsync(oParams);

        // Assert
        assert.equal(this.oGetParametersStub.callCount, 1, "getParameters is called correctly");
    });

    QUnit.test("Fetches application containers for non-UI5 apps", async function (assert) {
        // Arrange
        var oAppLifeCycle = {
            getCurrentApplication: function () {
                return {
                    app: "1",
                    applicationType: "Non-UI5"
                };
            }
        };
        var oParams = {
            args: { foo: "bar" },
            technicalParameters: TechnicalParameters,
            appLifeCycle: {
                getCurrentApplication: function () {
                    return { container: "appContainer" };
                }
            }
        };
        var oTechParams = [
            {
                name: "sap-navigation-scope",
                injectFrom: "inboundParameter",
                sticky: true,
                stickyName: "sap-navigation-scope-filter"
            }
        ];
        var oParamValue = "green";
        sandbox.stub(Container, "getServiceAsync").resolves(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        await oUtils.injectStickyParametersAsync(oParams);

        // Assert
        assert.equal(this.oGetParameterValueSyncStub.callCount, 1, "getParameterValueSync is called correctly");
        assert.strictEqual(this.oGetParameterValueSyncStub.getCall(0).args[2], "appContainer", "Correct application container is used");
    });

    QUnit.test("Application containers is empty for UI5 apps", async function (assert) {
        // Arrange
        var oAppLifeCycle = {
            getCurrentApplication: function () {
                return {
                    app: "1",
                    applicationType: "UI5",
                    container: "container1"
                };
            }
        };
        var oParams = {
            args: { foo: "bar" },
            technicalParameters: TechnicalParameters
        };
        var oTechParams = [
            {
                name: "sap-navigation-scope",
                injectFrom: "inboundParameter",
                sticky: true,
                stickyName: "sap-navigation-scope-filter"
            }
        ];
        var oParamValue = "green";
        sandbox.stub(Container, "getServiceAsync").resolves(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        await oUtils.injectStickyParametersAsync(oParams);

        // Assert
        assert.equal(this.oGetParameterValueSyncStub.callCount, 1, "getParameterValueSync is called correctly");
        assert.deepEqual(this.oGetParameterValueSyncStub.getCall(0).args[2], {}, "Application container is an empty object");
    });

    QUnit.test("Calls _injectParameters", async function (assert) {
        // Arrange
        var oAppLifeCycle = {
            getCurrentApplication: function () {
                return {
                    app: "1",
                    applicationType: "UI5",
                    container: "container1"
                };
            }
        };
        var oParams = {
            args: { foo: "bar" },
            technicalParameters: TechnicalParameters
        };
        var oTechParams = [
            {
                name: "sap-navigation-scope",
                injectFrom: "inboundParameter",
                sticky: true,
                stickyName: "sap-navigation-scope-filter"
            }
        ];
        var oParamValue = "green";
        sandbox.stub(Container, "getServiceAsync").resolves(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        await oUtils.injectStickyParametersAsync(oParams);

        // Assert
        var oArgsEntries = ["type", "inject", "args"];
        assert.equal(this.oInjectParametersStub.callCount, 1, "_injectParameter is called once");
        assert.deepEqual(Object.keys(this.oInjectParametersStub.getCall(0).args[0]), oArgsEntries, "injectParameter is called with correct parameters");
    });

    QUnit.test("Returns the result of _injectParameters", async function (assert) {
        // Arrange
        var oAppLifeCycle = {
            getCurrentApplication: function () {
                return {
                    app: "1",
                    applicationType: "UI5",
                    container: "container1"
                };
            }
        };
        var oParams = {
            args: { foo: "bar" },
            technicalParameters: TechnicalParameters
        };
        var oTechParams = [{
            name: "sap-navigation-scope",
            injectFrom: "inboundParameter",
            sticky: true,
            stickyName: "sap-navigation-scope-filter"
        }];
        var oParamValue = "green";
        sandbox.stub(Container, "getServiceAsync").resolves(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({ foo: "bar" });
        this.oGetParametersStub.returns(oTechParams);

        // Act
        const oResult = await oUtils.injectStickyParametersAsync(oParams);

        // Assert
        assert.equal(this.oInjectParametersStub.callCount, 1, "_injectParameter is called once");
        assert.deepEqual(oResult, { foo: "bar" }, "Correct result is returned");
    });

    QUnit.module("_injectParameters", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns oParams.args when it is undefined", function (assert) {
        // Arrange
        var oParams = {
            inject: {},
            type: {
                isPlainObject: function () {
                    return false;
                }
            },
            args: undefined
        };

        // Action
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.strictEqual(oResult, undefined, "Correct result is returned");
    });

    QUnit.test("Returns the shell hash with parameters injected", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-system": "UR5",
                "sap-app-origin-hint": undefined
            },
            type: {
                isPlainObject: function () {
                    return false;
                }
            },
            args: "#Hash-fragment?with=parameters"
        };
        var oExpectedResult = "#Hash-fragment?with=parameters&sap-system=UR5";

        // Action
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.strictEqual(oResult, oExpectedResult, "Correct result is returned");
    });

    QUnit.test("Self-invoke when oParam.args is like { target: { shellHash : string}}", function (assert) {
        // Arrange
        var oIsPlainObjectStub = sandbox.stub();
        oIsPlainObjectStub.onFirstCall().returns(true);
        oIsPlainObjectStub.onSecondCall().returns(false);

        var oInjectParametersStub = sandbox.stub(oUtils, "_injectParameters");
        var oParamsToInject = {
            "sap-system": "UR5",
            "sap-app-origin-hint": "ABC"
        };
        var oType = {
            isPlainObject: oIsPlainObjectStub
        };
        var oParams = {
            inject: oParamsToInject,
            type: oType,
            args: { target: { shellHash: "#Hash-fragmnent?with=parameters" } }
        };

        oInjectParametersStub.withArgs({
            inject: oParamsToInject,
            injectEmptyString: {},
            type: oType,
            args: "#Hash-fragmnent?with=parameters"
        }).returns("MyHash");
        oInjectParametersStub.callThrough();

        // Action
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.strictEqual(oInjectParametersStub.callCount, 2, "_injectParameters are called twice");
        assert.strictEqual(oResult.target.shellHash, "MyHash", "The function _injectParameters has returned the correct value.");
    });

    QUnit.test("Returns the arguments when oParams.args.target.shellHash is not a string", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-system": "UR5"
            },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: { target: { shellHash: 1 } }
        };

        var oExpectedResult = { target: { shellHash: 1 } };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Correct Parameters are returned");
    });

    QUnit.test("Returns arguments with injected parameters when oParam.args is like {semanticObject: ..., action: ..., params: { ... }} ", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-system": "UR5",
                "sap-app-origin-hint": ""
            },
            injectEmptyString: {
                "sap-app-origin-hint": true
            },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: { params: { param1: 1 } }
        };

        var oExpectedResult = {
            params: {
                param1: 1,
                "sap-app-origin-hint": "",
                "sap-system": "UR5"
            }
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Parameters are correctly injected");
    });

    QUnit.test("Returns arguments with injected parameters when oParam.args is like {semanticObject: ..., action: ..., params: 'A=B&C=D'} ", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-navigation-scope": "green",
                "sap-app-origin-hint": undefined
            },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: { params: "A=B&C=D" }
        };
        var oExpectedResult = {
            params: "A=B&C=D&sap-navigation-scope=green"
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Parameters are correctly injected");
    });

    // eslint-disable-next-line max-len
    QUnit.test("Returns arguments with injected parameters when oParam.args is like {semanticObject: ..., action: ..., params: 'A=B&C=D'} and sap-app-origin-hint is empty string without force inject", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-navigation-scope": "green",
                "sap-app-origin-hint": ""
            },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: { params: "A=B&C=D" }
        };
        var oExpectedResult = {
            params: "A=B&C=D&sap-navigation-scope=green"
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Parameters are correctly injected");
    });

    // eslint-disable-next-line max-len
    QUnit.test("Returns arguments with injected parameters when oParam.args is like {semanticObject: ..., action: ..., params: 'A=B&C=D'} and sap-app-origin-hint is empty string with force inject", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-navigation-scope": "green",
                "sap-app-origin-hint": ""
            },
            injectEmptyString: {
                "sap-app-origin-hint": true
            },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: { params: "A=B&C=D" }
        };
        var oExpectedResult = {
            params: "A=B&C=D&sap-navigation-scope=green&sap-app-origin-hint="
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Parameters are correctly injected");
    });

    // eslint-disable-next-line max-len
    QUnit.test("Returns arguments with injected parameters when oParam.args is like {semanticObject: ..., action: ..., params: 'A=B&C=D'} and sap-app-origin-hint is XYZ with force inject", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-navigation-scope": "green",
                "sap-app-origin-hint": "XYZ"
            },
            injectEmptyString: {
                "sap-app-origin-hint": true
            },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: { params: "A=B&C=D" }
        };
        var oExpectedResult = {
            params: "A=B&C=D&sap-navigation-scope=green&sap-app-origin-hint=XYZ"
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Parameters are correctly injected");
    });

    // eslint-disable-next-line max-len
    QUnit.test("Returns arguments with injected parameters when oParam.args is like {semanticObject: ..., action: ..., params: 'A=B&C=D'} and sap-app-origin-hint is XYZ without force inject", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-navigation-scope": "green",
                "sap-app-origin-hint": "XYZ"
            },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: { params: "A=B&C=D" }
        };
        var oExpectedResult = {
            params: "A=B&C=D&sap-navigation-scope=green&sap-app-origin-hint=XYZ"
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Parameters are correctly injected");
    });

    QUnit.module("createAppStateFromDataAsync", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oSetDataStub = sandbox.stub();
            this.oSaveStub = sandbox.stub();

            this.oGetServiceAsyncStub.withArgs("AppState").resolves({
                createEmptyAppState: sandbox.stub().withArgs(null).returns({
                    setData: this.oSetDataStub,
                    save: this.oSaveStub,
                    getKey: sandbox.stub().returns("AppStateKey")
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates AppState, saves data and resolves the AppState key", function (assert) {
        // Arrange
        var oData = {};
        // Act
        return oUtils.createAppStateFromDataAsync(oData)
            .then(function (sResult) {
                // Assert
                assert.strictEqual(sResult, "AppStateKey", "Resolved the correct AppState key");
                assert.strictEqual(this.oSetDataStub.getCall(0).args[0], oData, "Set the correct data");
                assert.strictEqual(this.oSaveStub.callCount, 1, "called save once on the AppSate");
            }.bind(this));
    });

    QUnit.test("Rejects when the AppState Service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("AppState").rejects();
        // Act
        return oUtils.createAppStateFromDataAsync({})
            .then(function () {
                assert.ok(false, "the promise should have been rejected");
            })
            .catch(function () {
                assert.ok(true, "the promise was rejected");
            });
    });

    QUnit.module("injectStickyParametersAsync", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oAppLifeCycleMock = {};
            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves(this.oAppLifeCycleMock);

            this.oInjectStickyParametersStub = sandbox.stub(oUtils, "_injectStickyParameters").returnsArg(0);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the private method and resolves", function (assert) {
        // Arrange
        var oParams = {};
        // Act
        return oUtils.injectStickyParametersAsync(oParams)
            .then(function (oResult) {
                // Assert
                assert.strictEqual(oResult, oParams, "Resolved the correct value");
                assert.strictEqual(this.oInjectStickyParametersStub.getCall(0).args[0], oParams, "called the private method with correct first param");
                assert.strictEqual(this.oInjectStickyParametersStub.getCall(0).args[1], this.oAppLifeCycleMock, "called the private method with correct second param");
            }.bind(this));
    });

    QUnit.test("Rejects when the AppLifeCycle Service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("AppLifeCycle").rejects();
        // Act
        return oUtils.injectStickyParametersAsync({})
            .then(function () {
                assert.ok(false, "the promise should have been rejected");
            })
            .catch(function () {
                assert.ok(true, "the promise was rejected");
            });
    });

    QUnit.module("addXAppStateFromParameterAsync", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oAppLifeCycleMock = {};
            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves(this.oAppLifeCycleMock);

            this.oCreateAppStateFromDataAsyncStub = sandbox.stub(oUtils, "createAppStateFromDataAsync").resolves("AppStateKey");
            this.oInjectParameterStub = sandbox.stub(oUtils, "injectParameter");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves if there is no x-app-state data", function (assert) {
        // Arrange
        var oIntent = {
            target: { semanticObject: "AnObject", action: "action" },
            params: {}
        };
        // Act
        return oUtils.addXAppStateFromParameterAsync(oIntent, "sap-xapp-state-data")
            .then(function () {
                // Assert
                assert.strictEqual(this.oCreateAppStateFromDataAsyncStub.callCount, 0, "createAppStateFromDataAsync was not called");
            }.bind(this));
    });

    QUnit.test("Resolves if the x-app-state data is no valid json", function (assert) {
        // Arrange
        var oIntent = {
            target: { semanticObject: "AnObject", action: "action" },
            params: { "sap-xapp-state-data": "undefined" }
        };
        // Act
        return oUtils.addXAppStateFromParameterAsync(oIntent, "sap-xapp-state-data")
            .then(function () {
                // Assert
                assert.strictEqual(this.oCreateAppStateFromDataAsyncStub.callCount, 0, "createAppStateFromDataAsync was not called");
            }.bind(this));
    });

    QUnit.test("Resolves and injects parameter", function (assert) {
        // Arrange
        var oAppStateData = {
            key: "value"
        };
        var oIntent = {
            target: { semanticObject: "AnObject", action: "action" },
            params: { "sap-xapp-state-data": JSON.stringify(oAppStateData) }
        };
        // Act
        return oUtils.addXAppStateFromParameterAsync(oIntent, "sap-xapp-state-data")
            .then(function () {
                // Assert
                assert.deepEqual(this.oCreateAppStateFromDataAsyncStub.getCall(0).args, [oAppStateData], "createAppStateFromDataAsync was called with the correct app state data");
                var aExpectedArgs = [
                    {
                        target: { semanticObject: "AnObject", action: "action" },
                        params: {}
                    },
                    "sap-xapp-state",
                    "AppStateKey"
                ];
                assert.deepEqual(this.oInjectParameterStub.getCall(0).args, aExpectedArgs, "injectParameter was called with correct args");
            }.bind(this));
    });
});

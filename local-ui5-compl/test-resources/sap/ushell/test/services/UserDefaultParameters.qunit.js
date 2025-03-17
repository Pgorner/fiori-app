// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserDefaultParameters
 */
sap.ui.define([
    "sap/ui/base/EventProvider",
    "sap/base/Log",
    "sap/ushell/services/UserDefaultParameters",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    EventProvider,
    Log,
    UserDefaultParameters,
    jQuery,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.services.UserDefaultParameters", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oLoadPluginsDeferred = new jQuery.Deferred();
            this.oGetServiceAsyncStub.withArgs("PluginManager").resolves({
                loadPlugins: function () {
                    return this.oLoadPluginsDeferred.promise();
                }.bind(this)
            });

            this.oService = new UserDefaultParameters();
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("constructor", function (assert) {
        assert.ok(this.oService);
    });

    function makeFunctionIf (value, sParameterName) {
        if (value === "reject") {
            return function () {
                return new jQuery.Deferred().reject().promise();
            };
        }

        return function (sName, org) {
            const oDeferred = new jQuery.Deferred();
            setTimeout(() => {
                if (sName === sParameterName) {
                    oDeferred.resolve(value);
                } else {
                    oDeferred.resolve(org);
                }
            }, 0);
            return oDeferred.promise();
        };
    }

    function makePlugin (sId, oPrio) {
        return {
            id: sId,
            getComponentData: function () {
                return {
                    config: {
                        "sap-priority": oPrio
                    }
                };
            }
        };
    }

    [{
        description: "insert0",
        arr: [],
        oInsert: makePlugin("P1"),
        res: ["P1"]
    }, {
        description: "insertend",
        arr: [makePlugin("P1", undefined), makePlugin("P2", undefined)],
        oInsert: makePlugin("P3", undefined),
        res: ["P1", "P2", "P3"]
    }, {
        description: "insertmid",
        arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
        oInsert: makePlugin("P3", 50),
        res: ["P1", "P3", "P2"]
    }, {
        description: "insertfirst",
        arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
        oInsert: makePlugin("P3", -50),
        res: ["P1", "P2", "P3"]
    }, {
        description: "insertlastappend",
        arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
        oInsert: makePlugin("P3", undefined),
        res: ["P1", "P2", "P3"]
    }, {
        description: "insertfirst",
        arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
        oInsert: makePlugin("P3", 200),
        res: ["P3", "P1", "P2"]
    }, {
        description: "insert sameend",
        arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
        oInsert: makePlugin("P3", 100),
        res: ["P1", "P3", "P2"]
    }].forEach((oFixture) => {
        QUnit.test(`insertOrdered${ oFixture.description}`, function (assert) {
            let res = this.oService._insertPluginOrdered(oFixture.arr, oFixture.oInsert);
            res = res.map((oObj) => {
                return oObj.id;
            });
            assert.deepEqual(res, oFixture.res, "result ok");
        });
    });

    QUnit.test("getValue: init time for plug-ins", async function (assert) {
        const done = assert.async();

        const oPlugin = {
            getUserDefault: sandbox.stub().returns(new jQuery.Deferred().resolve({ value: "bar" }).promise())
        };
        sandbox.stub(this.oService, "_getPersistedValue").resolves({});
        sandbox.stub(this.oService, "_isSupportedParameterName").resolves(true);
        sandbox.stub(this.oService, "_storeValue").resolves();

        const oContext = {
            id: "someContextId"
        };

        // call the getValue before registering the plugin
        this.oService.getValue("foo", oContext)
            .then((oValue) => {
                assert.equal(oValue.value, "bar", "The expected value was returned by the service!");
            })
            .catch((oError) => {
                assert.ok(false, "The promise should have been resolved.");
            })
            .finally(done);

        // resolve the promise and only then we register the plugin
        this.oService.registerPlugin(oPlugin);
        this.oLoadPluginsDeferred.resolve();
    });

    QUnit.test("_arrayToObject", function (assert) {
        assert.deepEqual(this.oService._arrayToObject(["a", "b", "c"]), {
            a: {},
            b: {},
            c: {}
        }, "values ok");
    });

    QUnit.test("_arrayToObject, empty", function (assert) {
        assert.deepEqual(this.oService._arrayToObject([]), {}, "values ok");
    });

    QUnit.module("sap.ushell.services.UserDefaultParameters", {
        beforeEach: async function () {
            await Container.init("local");

            this.UserDefaultParameters = await Container.getServiceAsync("UserDefaultParameters");
            this.ClientSideTargetResolution = await Container.getServiceAsync("ClientSideTargetResolution");
            this.UserDefaultParameterPersistence = await Container.getServiceAsync("UserDefaultParameterPersistence");
        },
        // This method is called after each test. Add every restoration code here
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    function transformParameters (aStringArray) {
        const obj = {
            simple: {},
            extended: {}
        };
        if (!(aStringArray[0] && Array.isArray(aStringArray[0]))) {
            aStringArray = [aStringArray, []];
        }
        aStringArray[0].forEach((sParameterName) => {
            obj.simple[sParameterName] = {};
        });
        if (aStringArray[1]) {
            aStringArray[1].forEach((sParameterName) => {
                obj.extended[sParameterName] = {};
            });
        }
        return obj;
    }

    // two sample plugins, getValue on service,
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [{
        description: "[P1 and P2 contribute each one paramter] ",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: {
            P1: { editorMetadata: { displayText: "P1Text" } },
            P2: {}
        },
        P2: { value: 333 },
        P2Edit: {
            P1: {},
            P2: { editorMetadata: { displayText: "P2Text" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                P1: {
                    valueObject: { value: 111 },
                    editorMetadata: { displayText: "P1Text" }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: { displayText: "P2Text" }
                }
            },
            errCalled: false
        }
    }, {
        description: "[P1,P2 supplied, P3 not filled by plugin contribute each one paramter, note that first metadata is taken!] ",
        parameters: ["P1", "P2", "P3"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: {
            P1: { editorMetadata: { displayText: "P1Text" } },
            P2: {}
        },
        P2: { value: 333 },
        P2Edit: {
            P1: {},
            P2: { editorMetadata: { displayText: "P2Text" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                P1: {
                    valueObject: { value: 111 },
                    editorMetadata: { displayText: "P1Text" }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: { displayText: "P2Text" }
                },
                P3: { valueObject: {} }
            }
        }
    }, {
        description: "[P1,P2 colliding metadata from two plugins, note that first metadata is taken!] ",
        parameters: ["P1", "P2", "P3"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: {
            P1: { editorMetadata: { displayText: "P1Text" } },
            P2: {}
        },
        P2: { value: 333 },
        P2Edit: {
            P1: { editorMetadata: { displayText: "P1TextFrom2" } },
            P2: { editorMetadata: { displayText: "P2TextFrom2" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                P1: {
                    valueObject: { value: 111 },
                    editorMetadata: { displayText: "P1Text" }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: { displayText: "P2TextFrom2" }
                },
                P3: { valueObject: {} }
            }
        }
    }, {
        description: "[P1,P2 colliding metadata from two plugins, sort order, first (highest prio) text is taken ] ",
        parameters: ["P1", "P2", "P3"],
        oComponentDataP1: { config: { "sap-priority": 10 } },
        oComponentDataP2: { config: { "sap-priority": 100 } },
        initial: undefined,
        P1: { value: 111 },
        P1Edit: {
            P1: { editorMetadata: { displayText: "P1TextFrom1" } },
            P2: {}
        },
        P2: { value: 333 },
        P2Edit: {
            P1: { editorMetadata: { displayText: "P1TextFrom2" } },
            P2: { editorMetadata: { displayText: "P2TextFrom2" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                P1: {
                    valueObject: { value: 111 },
                    editorMetadata: { displayText: "P1TextFrom2" }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: { displayText: "P2TextFrom2" }
                },
                P3: { valueObject: {} }
            }
        }
    }].forEach((oFixture) => {
        QUnit.test(`editorGetParameters integration test${ oFixture.description}`, async function (assert) {
            const oSystemContext = {
                id: ""
            };

            sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").resolves(transformParameters(oFixture.parameters));
            const oLogErrorSpy = sandbox.spy(Log, "error");
            sandbox.stub(this.UserDefaultParameters, "_getPersistedValue").resolves(oFixture.initial);
            sandbox.stub(this.UserDefaultParameters, "_isSupportedParameterName").resolves(true);
            sandbox.stub(this.UserDefaultParameters, "_storeValue").resolves();

            // two plugins:
            const oPlugin1 = {
                getComponentData: function () {
                    return oFixture.oComponentDataP1;
                }
            };
            oPlugin1.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            oPlugin1.getEditorMetadata = sandbox.stub().returns(new jQuery.Deferred().resolve(oFixture.P1Edit).promise());
            sandbox.spy(oPlugin1, "getUserDefault");

            const oPlugin2 = {
                getComponentData: function () {
                    return oFixture.oComponentDataP2;
                }
            };
            oPlugin2.getUserDefault = makeFunctionIf(oFixture.P2, "P2");
            oPlugin2.getEditorMetadata = sandbox.stub().returns(new jQuery.Deferred().resolve(oFixture.P2Edit).promise());
            sandbox.spy(oPlugin2, "getUserDefault");

            this.UserDefaultParameters.registerPlugin(oPlugin1);
            this.UserDefaultParameters.registerPlugin(oPlugin2);

            const oReturnedParameters = await this.UserDefaultParameters.editorGetParameters(oSystemContext);

            assert.deepEqual(oReturnedParameters, oFixture.expectedResult.result, "correct result");
            // assure it is a deep copy!
            oFixture.P1.value = 777;
            assert.deepEqual(oReturnedParameters, oFixture.expectedResult.result, "correct result");
            if (oFixture.expectedResult.errCalled !== false) {
                assert.ok(oLogErrorSpy.calledWith("The following parameter names have no editor metadata and thus likely no configured plugin:\n\"P3\"."), " error log called");
            }
            oLogErrorSpy.restore();
        });
    });

    [{
        description: "old format, single list",
        aArray: ["P1", "P2"],
        jointArr: ["P1", "P2"],
        extArr: []
    }, {
        description: "e,u",
        aArray: [["P1", "P2"]],
        jointArr: ["P1", "P2"],
        extArr: []
    }, {
        description: "a,superset",
        aArray: [["P1", "P2"], ["P1", "P2", "P3"]],
        jointArr: ["P1", "P2", "P3"],
        extArr: ["P1", "P2", "P3"]
    }, {
        description: "a,sub",
        aArray: [["P1", "P2"], ["P1"]],
        jointArr: ["P1", "P2"],
        extArr: ["P1"]
    }, {
        description: "disjoint",
        aArray: [["P1", "P3"], ["P2", "P4"]],
        jointArr: ["P1", "P2", "P3", "P4"],
        extArr: ["P2", "P4"]
    }, {
        description: "empty, list",
        aArray: [[], ["P1"]],
        jointArr: ["P1"],
        extArr: ["P1"]
    }].forEach((oFixture) => {
        QUnit.test(`editorGetParameters parameter processing: ${ oFixture.description}`, async function (assert) {
            const oSystemContext = {
                id: ""
            };

            sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").resolves(transformParameters(oFixture.aArray));
            sandbox.stub(this.UserDefaultParameters, "_getPersistedValue").resolves(oFixture.initial);
            sandbox.stub(this.UserDefaultParameters, "_isSupportedParameterName").resolves(true);
            sandbox.stub(this.UserDefaultParameters, "_storeValue").resolves();
            const oGetEditorStub = sandbox.stub(this.UserDefaultParameters, "_getEditorDataAndValue").resolves();
            await this.UserDefaultParameters.editorGetParameters(oSystemContext);

            assert.deepEqual(oGetEditorStub.getCall(0).args[0], oFixture.jointArr, "joint array ok");
            assert.deepEqual(oGetEditorStub.getCall(0).args[1], oFixture.extArr, "extended Array ok");
            oGetEditorStub.restore();
        });
    });

    QUnit.test("editorGetParameters integration test noEdit (no P1, but storage on P1!) [P1,P2 colliding metadata from two plugins, sort order, " +
        "first (highest prio) text is taken]", async function (assert) {
            const oSystemContext = {
                id: ""
            };

            const oParameters = transformParameters([["P1", "P3"], ["P2"]]);
            sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").resolves(oParameters);

            const oLogErrorSpy = sandbox.spy(Log, "error");
            const oGetPersistedValueStub = sandbox.stub(this.UserDefaultParameters, "_getPersistedValue");
            oGetPersistedValueStub.withArgs("P1").resolves({
                noEdit: true,
                alwaysAskPlugin: true,
                value: 111
            });
            oGetPersistedValueStub.withArgs("P2").resolves({ value: 333 });
            oGetPersistedValueStub.withArgs("P3").resolves({
                noEdit: true,
                value: "p3value"
            });

            sandbox.stub(this.UserDefaultParameters, "_isSupportedParameterName").resolves(true);
            sandbox.stub(this.UserDefaultParameters, "_storeValue").resolves();

            const oP1Edit = {
                P1: { editorMetadata: { displayText: "P1TextFrom1" } }
            };
            const oPlugin1 = {
                getComponentData: sandbox.stub().returns({ config: { "sap-priority": 10 } }),
                getUserDefault: makeFunctionIf({ value: 112 }, "P1"),
                getEditorMetadata: sandbox.stub().returns(new jQuery.Deferred().resolve(oP1Edit).promise())
            };
            sandbox.spy(oPlugin1, "getUserDefault");

            const oP2Edit = {
                P1: { editorMetadata: { displayText: "P1TextFrom2" } },
                P2: { editorMetadata: { displayText: "P2TextFrom2" } }
            };
            const oPlugin2 = {
                getComponentData: sandbox.stub().returns({ config: { "sap-priority": 100 } }),
                getUserDefault: makeFunctionIf({ value: 333 }, "P2"),
                getEditorMetadata: sandbox.stub().returns(new jQuery.Deferred().resolve(oP2Edit).promise())
            };
            sandbox.spy(oPlugin2, "getUserDefault");

            this.UserDefaultParameters.registerPlugin(oPlugin1);
            this.UserDefaultParameters.registerPlugin(oPlugin2);

            const oReturnedParameters = await this.UserDefaultParameters.editorGetParameters(oSystemContext);

            const oExpectedData = {
                P1: {
                    editorMetadata: { displayText: "P1TextFrom2" },
                    valueObject: { value: 112 }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: {
                        displayText: "P2TextFrom2",
                        extendedUsage: true
                    }
                }
            };

            assert.deepEqual(oReturnedParameters, oExpectedData, "correct result");
            assert.ok(!oLogErrorSpy.called, "error log not called!");
            assert.equal(this.UserDefaultParameters._storeValue.getCall(0).args[0], "P1", "p1 store called");
            assert.deepEqual(this.UserDefaultParameters._storeValue.getCall(0).args[1], { value: 112 }, "p1 store called with args");
            assert.deepEqual(this.UserDefaultParameters._storeValue.getCall(0).args[2], false, "p1 store called with args");
            assert.deepEqual(this.UserDefaultParameters._storeValue.getCall(0).args[3], oSystemContext, "p1 store called with args");

            oLogErrorSpy.restore();
        });

    // two sample plugins, getValue on Service, check failures of plugins
    // verify behaviour: evaluation continues, error log is raised
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [{
        description: "[P1 and P2, first rejects]",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: "reject",
        P2: { value: 222 },
        expectedResult: {
            storeCalled: true,
            result: { value: 222 },
            errorMsg: "invocation of getUserDefault(\"P1\") for plugin 'name of plugin could not be determined' rejected."
        }
    }, {
        description: "[P1 and P2, 2nd rejects]",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: { value: 111 },
        P2: "reject",
        expectedResult: {
            storeCalled: true,
            result: { value: 111 },
            errorMsg: "invocation of getUserDefault(\"P1\") for plugin com.sap.p2 rejected."
        }
    }].forEach((oFixture) => {
        QUnit.test(`getValue tests, plugin failures${ oFixture.description}`, async function (assert) {
            sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").resolves(transformParameters(oFixture.parameters));

            const oContext = {
                id: "someContextId"
            };

            sandbox.spy(Log, "error");
            sandbox.stub(this.UserDefaultParameters, "_getPersistedValue").resolves(oFixture.initial);
            sandbox.stub(this.UserDefaultParameters, "_isSupportedParameterName").resolves(true);
            sandbox.stub(this.UserDefaultParameters, "_storeValue").resolves();

            const oPlugin1 = {
                getComponentData: function () {
                    return oFixture.oComponentDataP1;
                }
            };
            oPlugin1.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            sandbox.spy(oPlugin1, "getUserDefault");

            const oPlugin2 = {
                getComponentData: function () {
                    return oFixture.oComponentDataP2;
                }
            };
            oPlugin2.getUserDefault = makeFunctionIf(oFixture.P2, "P1");
            oPlugin2.getMetadata = function () {
                return {
                    getComponentName: function () {
                        return "com.sap.p2";
                    }
                };
            };
            sandbox.spy(oPlugin2, "getUserDefault");

            this.UserDefaultParameters.registerPlugin(oPlugin1);
            this.UserDefaultParameters.registerPlugin(oPlugin2);

            const oValue = await this.UserDefaultParameters.getValue("P1", oContext);

            assert.deepEqual(oValue, oFixture.expectedResult.result, "correct result");
            assert.ok(Log.error.called, "error was called");
            assert.equal(Log.error.args[0][0],
                oFixture.expectedResult.errorMsg, "error was called with proper args");
            Log.error.restore();
        });
    });

    QUnit.test("editorGetParameters no parameters, do not wait for promise", async function (assert) {
        const oSystemContext = {
            id: ""
        };

        sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").resolves({
            simple: {},
            extended: {}
        });

        const oPlugin1 = {
            getUserDefault: makeFunctionIf(undefined, "P1"),
            getEditorMetadata: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
        };
        sandbox.spy(oPlugin1, "getUserDefault");

        const oPlugin2 = {
            getUserDefault: makeFunctionIf(undefined, "P2"),
            getEditorMetadata: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
        };
        sandbox.spy(oPlugin2, "getUserDefault");
        this.UserDefaultParameters.registerPlugin(oPlugin1);
        this.UserDefaultParameters.registerPlugin(oPlugin2);

        const oReturnedParameters = await this.UserDefaultParameters.editorGetParameters(oSystemContext);

        assert.deepEqual(oReturnedParameters, {}, "correct result");
    });

    QUnit.test("_getComponentNameOfPlugin", function (assert) {
        let oPlugin = {};
        assert.deepEqual(this.UserDefaultParameters._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Empty Object: Expected return value.");
        oPlugin = 5;
        assert.deepEqual(this.UserDefaultParameters._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Numeric value as plugin: Expected return value.");
        oPlugin = {
            getMetadata: function () {
            }
        };
        assert.deepEqual(this.UserDefaultParameters._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Plugin without getComponentName: Expected return value.");
        oPlugin = {
            getMetadata: function () {
                return {
                    getComponentName: function () {
                        return "PluginName";
                    }
                };
            }
        };
        assert.deepEqual(this.UserDefaultParameters._getComponentNameOfPlugin(oPlugin), "PluginName", "Plugin with all relevant methods: Expected return value.");
    });

    [{
        description: "hasRelevantMaintainableParameters resolves without an argument",
        userDefaultParameterNames: {},
        noEdit: {
            present: false,
            mixed: false
        },
        getValueRejects: false,
        expectedResult: false
    }, {
        description: "hasRelevantMaintainableParameters resolves with true ",
        userDefaultParameterNames: {
            aAllParameterNames: ["foo", "bar"],
            aExtendedParameterNames: ["bar"],
            oMetadataObject: {
                foo: {},
                bar: {}
            }
        },
        noEdit: {
            present: false,
            mixed: false
        },
        getValueRejects: false,
        expectedResult: true
    }, {
        description: "hasRelevantMaintainableParameters resolves with false, no editable parameters",
        userDefaultParameterNames: {
            aAllParameterNames: ["foo", "bar"],
            aExtendedParameterNames: ["bar"],
            oMetadataObject: {
                foo: {},
                bar: {}
            }
        },
        noEdit: {
            present: true,
            mixed: false
        },
        getValueRejects: false,
        expectedResult: false
    }, {
        description: "hasRelevantMaintainableParameters resolves with true",
        userDefaultParameterNames: {
            aAllParameterNames: ["foo", "bar"],
            aExtendedParameterNames: ["bar"],
            oMetadataObject: {
                foo: {},
                bar: {}
            }
        },
        noEdit: {
            present: true,
            mixed: true
        },
        getValueRejects: false,
        expectedResult: true
    }, {
        description: "hasRelevantMaintainableParameters resolves without an argument, getValue rejected",
        userDefaultParameterNames: {
            aAllParameterNames: ["foo", "bar"],
            aExtendedParameterNames: ["bar"],
            oMetadataObject: {
                foo: {},
                bar: {}
            }
        },
        noEdit: {
            present: true,
            mixed: true
        },
        getValueRejects: true,
        expectedResult: false
    }].forEach((oFixture) => {
        QUnit.test(`hasRelevantMaintainableParameters: ${ oFixture.description}`, async function (assert) {
            const oSystemContext = {
                id: ""
            };

            sandbox.stub(this.UserDefaultParameters, "_getUserDefaultParameterNames").withArgs(oSystemContext).resolves(oFixture.userDefaultParameterNames);

            sandbox.stub(this.UserDefaultParameters, "getValue").callsFake(async (sParameter) => {
                if (oFixture.getValueRejects) {
                    throw new Error("failed to retrieve value for given parameter");
                } else if (oFixture.noEdit.present) {
                    if (oFixture.noEdit.mixed) {
                        if (sParameter === "foo") {
                            return { noEdit: true };
                        }
                        return {};
                    }
                    return { noEdit: true };
                }
                return {};
            });
            // Act
            const bHasRelevantParameters = await this.UserDefaultParameters.hasRelevantMaintainableParameters(oSystemContext);
            // Assert
            assert.strictEqual(bHasRelevantParameters, oFixture.expectedResult, "hasRelevantMaintainableParameters resolves correctly");
        });
    });

    [{
        testDescription: "overlapping lists",
        oParametersAndExtendedParameters: {
            simple: {
                P1: {},
                P2: {}
            },
            extended: {
                P3: {},
                P2: {}
            }
        },
        expected: {
            simple: ["P1", "P2"],
            extended: ["P2", "P3"],
            allParameters: ["P1", "P2", "P3"]
        }
    }, {
        testDescription: "extended empty",
        oParametersAndExtendedParameters: {
            simple: {
                P1: {},
                P2: {}
            },
            extended: {}
        },
        expected: {
            simple: ["P1", "P2"],
            extended: [],
            allParameters: ["P1", "P2"]
        }
    }, {
        testDescription: "simple empty",
        oParametersAndExtendedParameters: {
            simple: {},
            extended: {
                P1: {},
                P2: {}
            }
        },
        expected: {
            simple: [],
            extended: ["P1", "P2"],
            allParameters: ["P1", "P2"]
        }
    }, {
        testDescription: "simple undefined",
        oParametersAndExtendedParameters: {
            simple: undefined,
            extended: {
                P1: {},
                P2: {}
            }
        },
        expected: {
            simple: [],
            extended: ["P1", "P2"],
            allParameters: ["P1", "P2"]
        }
    }].forEach((oFixture) => {
        QUnit.test(`_extractKeyArrays: result when ${ oFixture.testDescription}`, function (assert) {
            // Act
            const oResult = this.UserDefaultParameters._extractKeyArrays(oFixture.oParametersAndExtendedParameters);
            assert.deepEqual(oResult, oFixture.expected, "result ok");
        });
    });

    [{
        testDescription: "value is deleted from editor",
        sParameterName: "P1",
        oParameterValue: { value: undefined }, // deleted
        expectedParameters: {
            parameterName: "P1",
            parameterValue: {},
            systemContext: {
                id: "systemContextId"
            }
        }
    }, {
        testDescription: "value is entered from editor",
        sParameterName: "P1",
        oParameterValue: { value: "ABCD" },
        expectedParameters: {
            parameterName: "P1",
            parameterValue: {
                _shellData: { storeDate: "<ANY_STRING>" },
                value: "ABCD"
            },
            systemContext: {
                id: "systemContextId"
            }
        }
    }].forEach((oFixture) => {
        QUnit.test(`_storeValue(): Correct event fired when ${ oFixture.testDescription}`, function (assert) {
            const done = assert.async();

            const oSystemContext = {
                id: "systemContextId"
            };

            const oUserDefaultParametersPersistenceService = {
                saveParameterValue: sandbox.stub().resolves()
            };

            const oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            oGetServiceAsyncStub.withArgs("UserDefaultParameterPersistence").resolves(oUserDefaultParametersPersistenceService);
            oGetServiceAsyncStub.callThrough();

            this.UserDefaultParameters.attachValueStored(fnListener);
            this.UserDefaultParameters.editorSetValue(oFixture.sParameterName, oFixture.oParameterValue, oSystemContext)
                .finally(() => {
                    this.UserDefaultParameters.detachValueStored(fnListener);
                });

            function fnListener (oEvent) {
                assert.strictEqual(typeof oEvent, "object", "event listener obtained an object as first argument");
                assert.strictEqual(oEvent.getId(), "valueStored", "event id is 'valueStored'");

                const oParameters = oEvent.getParameters();

                if (oFixture.expectedParameters
                    && oFixture.expectedParameters.parameterValue
                    && oFixture.expectedParameters.parameterValue._shellData
                    && oFixture.expectedParameters.parameterValue._shellData.storeDate === "<ANY_STRING>") {
                    if (!oParameters.parameterValue._shellData) {
                        assert.ok(false, "_shellData was found among event parameters");
                        return;
                    }
                    assert.ok(true, "_shellData was found among event parameters");

                    assert.strictEqual(typeof oParameters.parameterValue._shellData.storeDate, "string", "storeDate is a string");
                    delete oParameters.parameterValue._shellData.storeDate;
                    delete oFixture.expectedParameters.parameterValue._shellData.storeDate;
                }

                assert.deepEqual(oEvent.getParameters(), oFixture.expectedParameters, "event contains the expected parameters");
                done();
            }
        });
    });

    QUnit.test("_storeValue(): ValueStored event registration and fire event", async function (assert) {
        const oEventResult = { callCount: 0 };
        const oValue = { value: "Value1" };
        const oValue2 = { value: "Value2" };

        function fnListener (oEvent) {
            oEventResult.callCount += 1;
            oEventResult.parameters = oEvent.getParameters();
        }

        const oSystemContext = {
            id: "systemContextId"
        };

        // code under test (deregistration)
        this.UserDefaultParameters.attachValueStored(fnListener);
        this.UserDefaultParameters.detachValueStored(fnListener);
        await this.UserDefaultParameters.editorSetValue("Param1", oValue, oSystemContext);

        assert.strictEqual(oEventResult.callCount, 0, "listener not called");
        this.UserDefaultParameters.attachValueStored(fnListener);

        // code under test (registration)
        await this.UserDefaultParameters.editorSetValue("Param1", oValue, oSystemContext);

        assert.strictEqual(oEventResult.callCount, 1, "listener called once");
        assert.deepEqual(oEventResult.parameters.parameterName, "Param1", "Event fired with correct parameter name.");
        assert.deepEqual(oEventResult.parameters.parameterValue, oValue, "Event fired with correct value object.");

        // code under test (listener called twice )
        await this.UserDefaultParameters.editorSetValue("Param2", oValue2, oSystemContext);

        assert.strictEqual(oEventResult.callCount, 2, "listener called twice");
        assert.deepEqual(oEventResult.parameters.parameterName, "Param2", "Event fired with correct parameter name.");
        assert.deepEqual(oEventResult.parameters.parameterValue, oValue2, "Event fired with correct value object.");
    });

    [{
        description: " Simple, no deletion",
        valueObject: { value: "1000" },
        inExtendedUse: false,
        expectDeletion: false
    }, {
        description: " Simple value is initial deletion",
        valueObject: { value: undefined },
        inExtendedUse: false,
        expectDeletion: true
    }, {
        description: " Extended, Extended in Use, no deletion",
        valueObject: {
            value: undefined,
            extendedValue: {}
        },
        inExtendedUse: true,
        expectDeletion: false
    }, {
        description: " Extended, Extended Not in Use, deletion",
        valueObject: {
            value: undefined,
            extendedValue: {}
        },
        inExtendedUse: false,
        expectDeletion: true
    }, {
        description: " Simple Extended, Extended in Use, no deletion",
        valueObject: {
            value: "1000",
            extendedValue: { a: 1 }
        },
        inExtendedUse: true,
        expectDeletion: false,
        expectedSavedValue: {
            value: "1000",
            extendedValue: { a: 1 }
        }
    }, {
        description: " Simple Extended, Extended Not in Use, no deletion",
        valueObject: {
            value: "1000",
            extendedValue: { a: 1 }
        },
        inExtendedUse: false,
        expectDeletion: false,
        expectedSavedValue: { value: "1000" }
    }].forEach((oFixture) => {
        QUnit.test(`_storeValue(): parameter deletion when ${ oFixture.description}`, async function (assert) {
            const oGetUserDefaultParamNamesResult = {
                simple: {},
                extended: {}
            };

            const oSystemContext = {
                id: "systemContextId"
            };

            if (oFixture.inExtendedUse) {
                oGetUserDefaultParamNamesResult.extended.P1 = {};
            }
            oGetUserDefaultParamNamesResult.simple.P1 = {};

            sandbox.stub(this.UserDefaultParameterPersistence, "saveParameterValue").resolves();
            sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").withArgs(oSystemContext).resolves(oGetUserDefaultParamNamesResult);
            // code under test (deregistration)
            await this.UserDefaultParameters._storeValue("P1", oFixture.valueObject, true, oSystemContext);

            assert.equal(this.UserDefaultParameterPersistence.saveParameterValue.args[0][0], "P1", "correct parameter name");
            if (oFixture.expectDeletion) {
                assert.equal(this.UserDefaultParameterPersistence.saveParameterValue.args[0][1], undefined, "value undefined");
            } else {
                assert.ok(this.UserDefaultParameterPersistence.saveParameterValue.args[0][1] !== undefined, "value not undefined");
                if (!oFixture.expectedSavedValue) {
                    oFixture.expectedSavedValue = oFixture.valueObject;
                }
                assert.equal(this.UserDefaultParameterPersistence.saveParameterValue.args[0][1].value,
                    oFixture.expectedSavedValue.value, "correct value persisted");
                assert.deepEqual(this.UserDefaultParameterPersistence.saveParameterValue.args[0][1].extendedValue,
                    oFixture.expectedSavedValue.extendedValue, "correct extended value persisted");
            }
        });
    });

    QUnit.test("UserDefaultService plugin invocation flow", async function (assert) {
        sandbox.stub(this.UserDefaultParameters, "_getStoreDate").returns("11.11.2016");
        sandbox.spy(this.UserDefaultParameters, "_getPersistedValue");
        sandbox.stub(this.UserDefaultParameters, "_isSupportedParameterName").resolves(true);
        sandbox.spy(this.UserDefaultParameters, "_storeValue");

        const oPlugin = {
            getComponentData: function () {
                return {
                    config: {
                        "sap-priority": 10
                    }
                };
            }
        };
        oPlugin.getUserDefault = makeFunctionIf({ value: undefined }, "P1");
        const oPluginCall = sandbox.spy(oPlugin, "getUserDefault");
        this.UserDefaultParameters.registerPlugin(oPlugin);

        const oSystemContext = {
            id: "systemContextId"
        };

        await this.UserDefaultParameterPersistence.deleteParameter("P1", oSystemContext);
        // (1) Call getValue the first time
        const oReturnedParameters = await this.UserDefaultParameters.getValue("P1", oSystemContext);

        assert.ok(true, "promise was resolved after first call to #getValue('P1')");
        assert.equal(oPluginCall.callCount, 1, "Plugin #getUserDefault method invoked");
        assert.equal(oReturnedParameters.value, undefined, "Plugin 1 #getValue returned undefined");
        assert.equal(this.UserDefaultParameters._storeValue.getCall(0).args[0], "P1", "#_storeValue was called with 'P1' as first argument");
        assert.deepEqual(this.UserDefaultParameters._storeValue.getCall(0).args[1], {
            _shellData: { storeDate: "11.11.2016" },
            value: undefined
        }, "#_storeValue was called with the expected second argument");

        // (2) Call getValue the second time
        const oReturnedParameters2 = await this.UserDefaultParameters.getValue("P1", oSystemContext);

        assert.ok(true, "promise was resolved after second call to #getValue('P1')");
        assert.equal(oPluginCall.callCount, 1, "Plugin #getUserDefault was not invoked the second time");
        assert.equal(oReturnedParameters2.value, undefined, "promise was resolved to 'undefined'");
        assert.equal(this.UserDefaultParameters._storeValue.callCount, 1, "#_storeValue was not called");

        await this.UserDefaultParameters.editorSetValue("P1", { value: undefined }, oSystemContext);

        assert.ok(true, "promise was resolved after value 'P1' was set to '{ value: undefined }' via #editorSetValue");
        assert.equal(this.UserDefaultParameters._storeValue.callCount, 2, "#_storeValue was called after parameter was re-set");
        assert.equal(this.UserDefaultParameters._storeValue.getCall(1).args[0], "P1",
            "#_storeValue was called with 'P1' as first argument");
        assert.deepEqual(this.UserDefaultParameters._storeValue.getCall(1).args[1], { value: undefined },
            "#_storeValue was called with '{ value: undefined }' as second argument");
        assert.deepEqual(this.UserDefaultParameters._storeValue.getCall(1).args[2], true,
            "#_storeValue was called with 'true' (bFromEditor) as third argument");

        // (3) Call getValue the third time
        await this.UserDefaultParameters.getValue("P1", oSystemContext);

        assert.ok(true, "promise was resolved after third call to #getValue('P1')");
        assert.equal(oPluginCall.callCount, 2, "Plugin #getUserDefault was invoked the third time");
        assert.equal(this.UserDefaultParameters._storeValue.callCount, 3, "#_storeValue was called");
        assert.equal(this.UserDefaultParameters._storeValue.getCall(2).args[0], "P1", "#_storeValue was called with 'P1' as first argument");
        assert.deepEqual(this.UserDefaultParameters._storeValue.getCall(2).args[1], {
            _shellData: {
                storeDate: "11.11.2016"
            },
            value: undefined
        }, "#_storeValue was called with { _shellData: { storeData: '11.11.2016' }, value: undefined }");
    });

    QUnit.test("_getUserDefaultParameterNames with plain parameters only", async function (assert) {
        const oUserDefaultNames = {
            simple: { P2: {} },
            extended: {
                P1: {},
                P3: {}
            }
        };
        const oSystemContext = {
            id: ""
        };

        sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").resolves(oUserDefaultNames);

        const oResult = await this.UserDefaultParameters._getUserDefaultParameterNames(oSystemContext);

        assert.deepEqual(oResult, {
            aAllParameterNames: [
                "P1",
                "P2",
                "P3"
            ],
            aExtendedParameterNames: [
                "P1",
                "P3"
            ],
            oMetadataObject: {
                P1: {},
                P2: {},
                P3: {}
            }
        }, "correct result");
    });

    QUnit.test("_getUserDefaultParameterNames with empty parameters", async function (assert) {
        const oUserDefaultNames = {
            simple: {},
            extended: {}
        };
        const oSystemContext = {
            id: ""
        };

        sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").resolves(oUserDefaultNames);

        const oResult = await this.UserDefaultParameters._getUserDefaultParameterNames(oSystemContext);

        assert.deepEqual(oResult, {
            aAllParameterNames: [],
            aExtendedParameterNames: [],
            oMetadataObject: {}
        }, "correct result");
    });

    QUnit.test("_getUserDefaultParameterNames with a parameter categorized as simple and extended", async function (assert) {
        const oUserDefaultNames = {
            simple: { P2: {} },
            extended: {
                P2: {},
                P3: {}
            }
        };
        const oSystemContext = {
            id: ""
        };

        sandbox.stub(this.ClientSideTargetResolution, "getUserDefaultParameterNames").resolves(oUserDefaultNames);

        const oResult = await this.UserDefaultParameters._getUserDefaultParameterNames(oSystemContext);

        assert.deepEqual(oResult, {
            aAllParameterNames: ["P2", "P3"],
            aExtendedParameterNames: ["P2", "P3"],
            oMetadataObject: {
                P2: {},
                P3: {}
            }
        }, "correct result");
    });

    QUnit.module("The function _isSupportedParameterName", {
        beforeEach: function () {
            this.oDefaultParameterNames = {
                simple: { P2: {} },
                extended: {
                    P2: {},
                    P3: {}
                }
            };

            this.oSystemContext = {
                id: ""
            };

            this.oGetDefaultParameterNamesStub = sandbox.stub();
            this.oGetDefaultParameterNamesStub.returns(new jQuery.Deferred().resolve(this.oDefaultParameterNames).promise());
            const oCSTRServiceMock = {
                getUserDefaultParameterNames: this.oGetDefaultParameterNamesStub
            };
            sandbox.stub(Container, "getServiceAsync").resolves(oCSTRServiceMock);

            this.oService = new UserDefaultParameters();
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Resolves if the given extended parameter exists in the parameter object", async function (assert) {
        const bSupported = await this.oService._isSupportedParameterName("P3", this.oSystemContext);

        assert.strictEqual(bSupported, true, "the parameter name is supported");
    });

    QUnit.test("Resolves if the given simple parameter exists in the parameter object", async function (assert) {
        this.oDefaultParameterNames.simple = { P1: {} };

        const bSupported = await this.oService._isSupportedParameterName("P1", this.oSystemContext);

        assert.strictEqual(bSupported, true, "the parameter name is supported");
    });

    QUnit.test("Rejects if the given parameter does not exist in the parameter object", async function (assert) {
        const bSupported = await this.oService._isSupportedParameterName("P7", this.oSystemContext);

        assert.strictEqual(bSupported, false, "the parameter name is not supported");
    });

    QUnit.module("Invocation of plugins' getUserDefault function", {
        beforeEach: function () {
            this.oService = new UserDefaultParameters();

            this.oLogErrorStub = sandbox.stub(Log, "error");

            const oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oLoadPluginsStub = sandbox.stub();
            this.oLoadPluginsStub.returns(new jQuery.Deferred().resolve().promise());
            oGetServiceAsyncStub.withArgs("PluginManager").resolves({
                loadPlugins: this.oLoadPluginsStub
            });

            this.oGetPersistedValueStub = sandbox.stub(this.oService, "_getPersistedValue");
            this.oGetPersistedValueStub.rejects();
            this.oIsSupportedParameterNameStub = sandbox.stub(this.oService, "_isSupportedParameterName");
            this.oIsSupportedParameterNameStub.resolves(true);
            sandbox.stub(this.oService, "_storeValue").resolves();

            this.oPlugin1Deferred = new jQuery.Deferred();
            this.oPlugin1GetUserDefaultStub = sandbox.stub().returns(this.oPlugin1Deferred.promise());
            this.oPlugin1 = {
                getUserDefault: this.oPlugin1GetUserDefaultStub
            };

            this.oPlugin2Deferred = new jQuery.Deferred();
            this.oPlugin2GetUserDefaultStub = sandbox.stub().returns(this.oPlugin2Deferred.promise());
            this.oPlugin2 = {
                getUserDefault: this.oPlugin2GetUserDefaultStub
            };

            this.oService.registerPlugin(this.oPlugin1);
            this.oService.registerPlugin(this.oPlugin2);

            this.oSystemContext = { id: "someContextId" };
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Logs an error message if the plugin manager fails to load the plugins", function (assert) {
        // Arrange
        this.oLoadPluginsStub.returns(new jQuery.Deferred().reject().promise());

        // Act
        return this.oService.getValue("MYVALUE", this.oSystemContext)
            .then(() => {
                // Assert
                assert.ok(false, "The promise should have been rejected.");
            })
            .catch((oError) => {
                assert.strictEqual(oError.message, "Initialization of plugins failed", "The correct error message was passed into the handler.");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "The Log.error function has been called once.");
            });
    });

    QUnit.test("No initial value exists, the first plugin rejects, the second plugin resolves with a value", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.resolves();
        this.oPlugin1Deferred.reject();
        this.oPlugin2Deferred.resolve({ value: 333 });

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, { value: 333 }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
        assert.deepEqual(this.oService._storeValue.args[0], [
            "MYVALUE", oValue, false, this.oSystemContext
        ], "The function _storeValue has been called with the correct parameters.");
    });

    QUnit.test("Parameters are not relevant", async function (assert) {
        const oExpectedValue = { value: undefined };

        // Arrange
        this.oIsSupportedParameterNameStub.resolves(false);

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, oExpectedValue, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 0, "The function _storeValue has not been called.");
    });

    QUnit.test("Initial value exists, the first plugin rejects, the second plugin resolves with a value", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            noStore: true
        });
        this.oPlugin1Deferred.reject();
        this.oPlugin2Deferred.resolve({
            value: 333,
            noStore: true
        });

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, {
            value: 333,
            noStore: true
        }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
        assert.deepEqual(this.oService._storeValue.args[0], [
            "MYVALUE", oValue, false, this.oSystemContext
        ], "The function _storeValue has been called with the correct parameters.");
    });

    QUnit.test("Initial value exists, the first plugin resolves with a value, the second plugin resolves with a value", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.resolve({ value: "AAA" });
        this.oPlugin2Deferred.resolve({
            value: 333,
            noStore: true
        });

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, {
            value: 333,
            noStore: true
        }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
        assert.deepEqual(this.oService._storeValue.args[0], [
            "MYVALUE", oValue, false, this.oSystemContext
        ], "The function _storeValue has been called with the correct parameters.");
    });

    QUnit.test("Initial value exists, the first plugin resolves with a value, the second plugin rejects", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.resolve({ value: "AAA" });
        this.oPlugin2Deferred.reject();

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, { value: "AAA" }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
        assert.deepEqual(this.oService._storeValue.args[0], [
            "MYVALUE", oValue, false, this.oSystemContext
        ], "The function _storeValue has been called with the correct parameters.");
    });

    QUnit.test("Initial value exists, the first plugin resolves with a value, the second plugin resolves with undefined", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            noStore: "XXX"
        });
        this.oPlugin1Deferred.resolve({ value: "AAA" });
        this.oPlugin2Deferred.resolve({ value: undefined });

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, { value: undefined }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
        assert.deepEqual(this.oService._storeValue.args[0], [
            "MYVALUE", oValue, false, this.oSystemContext
        ], "The function _storeValue has been called with the correct parameters.");
    });

    QUnit.test("Initial value exists and both plugins provide the same value", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.resolve({ value: "ABC" });
        this.oPlugin2Deferred.resolve({ value: "ABC" });

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, { value: "ABC" }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
        assert.deepEqual(this.oService._storeValue.args[0], [
            "MYVALUE", oValue, false, this.oSystemContext
        ], "The function _storeValue has been called with the correct parameters.");
    });

    QUnit.test("Initial value exists and all values are equal", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            _shellData: "1",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.resolve({
            value: "ABC",
            alwaysAskPlugin: true
        });
        this.oPlugin2Deferred.resolve({
            value: "ABC",
            alwaysAskPlugin: true
        });

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, {
            value: "ABC",
            alwaysAskPlugin: true
        }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 0, "The function _storeValue has not been called.");
    });

    QUnit.test("Initial value exists and both plugins reject", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            _shellData: "1",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.reject();
        this.oPlugin2Deferred.reject();

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, {
            value: "ABC",
            alwaysAskPlugin: true,
            _shellData: "1"
        }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 0, "The function _storeValue has not been called.");
    });

    QUnit.test("No initial value exists and both plugins reject", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.rejects();
        this.oPlugin1Deferred.reject();
        this.oPlugin2Deferred.reject();

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, { value: undefined }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
        assert.deepEqual(this.oService._storeValue.args[0], [
            "MYVALUE", oValue, false, this.oSystemContext
        ], "The function _storeValue has been called with the correct parameters.");
    });

    QUnit.test("Receives the system context parameter", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.rejects();
        this.oPlugin1Deferred.resolve();
        this.oPlugin2Deferred.resolve();

        // Act
        await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(this.oPlugin1GetUserDefaultStub.firstCall.args, [
            "MYVALUE", { value: undefined }, this.oSystemContext
        ], "The getUserDefault function received the correct parameters.");
    });

    QUnit.test("Skips a plugin that does not have a getUserDefault function", async function (assert) {
        // Arrange
        this.oGetPersistedValueStub.rejects();
        this.oPlugin1.getUserDefault = "oh noez";
        this.oPlugin2Deferred.resolve({ value: 333 });

        // Act
        const oValue = await this.oService.getValue("MYVALUE", this.oSystemContext);
        // Assert
        assert.deepEqual(oValue, { value: 333 }, "The correct value has been found.");
        assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
        assert.deepEqual(this.oService._storeValue.args[0], [
            "MYVALUE", oValue, false, this.oSystemContext
        ], "The function _storeValue has been called with the correct parameters.");
    });

    QUnit.module("The _storeValue function", {
        beforeEach: function () {
            this.oUserDefaultParametersService = new UserDefaultParameters();
            this.oSaveParameterValueStub = sandbox.stub(this.oUserDefaultParametersService, "_saveParameterValue");
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").rejects();
            this.oExtractKeyArraysStub = sandbox.stub(this.oUserDefaultParametersService, "_extractKeyArrays");

            this.oContext = { id: "someContextId" };
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Calls _saveParameterValue if not invoked from editor with the correct parameters", function (assert) {
        // Arrange
        const oValue = {};

        // Act
        this.oUserDefaultParametersService._storeValue("P", oValue, false, this.oContext);

        // Assert
        assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "The function _saveParameterValue has been called once.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "P", "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], oValue, "The correct reference was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], false, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], false, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[4], this.oContext, "The correct reference was found.");
    });

    QUnit.test("Returns the result of _saveParameterValue", async function (assert) {
        // Arrange
        const oReturnValue = {};
        this.oSaveParameterValueStub.returns(oReturnValue);

        // Act
        const oResult = await this.oUserDefaultParametersService._storeValue("P", {}, false, this.oContext);

        // Assert
        assert.strictEqual(oResult, oReturnValue, "The function _saveParameterValues has returned the correct reference.");
    });

    QUnit.test("Calls _saveParameterValue if invoked from editor without an extendedValue", async function (assert) {
        // Arrange
        const oValue = {
            extendedValue: {}
        };
        this.oGetServiceAsyncStub.resolves({
            getUserDefaultParameterNames: sandbox.stub().returns(new jQuery.Deferred().resolve())
        });

        const oResult = {};
        this.oSaveParameterValueStub.resolves(oResult);

        this.oExtractKeyArraysStub.returns({
            extended: []
        });

        // Act
        await this.oUserDefaultParametersService._storeValue("P", oValue, true, this.oContext);
        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "The function getServiceAsync has been called once.");
        assert.deepEqual(this.oGetServiceAsyncStub.firstCall.args, ["ClientSideTargetResolution"], "The function getServiceAsync has been with the correct parameters.");

        assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "The function _saveParameterValue has been called once.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "P", "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], oValue, "The correct reference was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], true, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], true, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[4], this.oContext, "The correct reference was found.");
    });

    QUnit.test("Calls _saveParameterValue if invoked from editor with an extendedValue", async function (assert) {
        // Arrange
        const oValue = {
            extendedValue: {}
        };
        this.oGetServiceAsyncStub.resolves({
            getUserDefaultParameterNames: sandbox.stub().returns(new jQuery.Deferred().resolve())
        });

        const oResult = {};
        this.oSaveParameterValueStub.resolves(oResult);

        this.oExtractKeyArraysStub.returns({
            extended: ["P"]
        });

        // Act
        const oResolvedValue = await this.oUserDefaultParametersService._storeValue("P", oValue, true, this.oContext);
        // Assert
        assert.strictEqual(oResolvedValue, oResult, "The correct value has been resolved.");

        assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "The function _saveParameterValue has been called once.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "P", "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], oValue, "The correct reference was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], true, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], false, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[4], this.oContext, "The correct reference was found.");
    });

    QUnit.test("Calls _saveParameterValue if invoked from editor if no user default parameters are found", async function (assert) {
        // Arrange
        const oValue = {
            extendedValue: {}
        };

        this.oGetServiceAsyncStub.resolves({
            getUserDefaultParameterNames: sandbox.stub().returns(new jQuery.Deferred().reject())
        });

        const oResult = {};
        this.oSaveParameterValueStub.resolves(oResult);

        // Act
        const oResolvedValue = await this.oUserDefaultParametersService._storeValue("P", oValue, true, this.oContext);
        // Assert
        assert.strictEqual(oResolvedValue, oResult, "The correct value has been resolved.");

        assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "The function _saveParameterValue has been called once.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "P", "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], oValue, "The correct reference was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], true, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], false, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[4], this.oContext, "The correct reference was found.");
    });

    QUnit.module("The _saveParameterValue function", {
        beforeEach: function () {
            this.oFireEventStub = sandbox.stub(EventProvider.prototype, "fireEvent");

            this.oUserDefaultParametersService = new UserDefaultParameters();
            this.oIsInitialStub = sandbox.stub(this.oUserDefaultParametersService, "_valueIsEmpty");
            this.oGetStoreDateStub = sandbox.stub(this.oUserDefaultParametersService, "_getStoreDate");

            this.oSaveParameterValueStub = sandbox.stub().resolves();
            const oUserDefaultParameterPersistenceService = {
                saveParameterValue: this.oSaveParameterValueStub
            };
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").resolves(oUserDefaultParameterPersistenceService);

            this.oSystemContext = {
                id: "systemContextId"
            };
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Resolves with the property name", async function (assert) {
        // Arrange
        const oValue = {
            _shellData: {}
        };

        // Act
        const sPropertyName = await this.oUserDefaultParametersService._saveParameterValue("P. R. Operty", oValue, undefined, undefined, this.oSystemContext);
        // Assert
        assert.strictEqual(sPropertyName, "P. R. Operty", "The correct value has been resolved.");
    });

    QUnit.test("Resolves if saveParameterValue fails", async function (assert) {
        // Arrange
        const oValue = {
            _shellData: {}
        };
        this.oSaveParameterValueStub.rejects();

        // Act
        const sPropertyName = await this.oUserDefaultParametersService._saveParameterValue("P. R. Operty", oValue, undefined, undefined, this.oSystemContext);
        // Assert
        assert.strictEqual(sPropertyName, "P. R. Operty", "The correct value has been resolved.");
    });

    QUnit.test("Adds the store date to the given _shellData object", async function (assert) {
        // Arrange
        const oValue = {
            _shellData: {}
        };

        this.oGetStoreDateStub.returns("just now");

        // Act
        await this.oUserDefaultParametersService._saveParameterValue("P", oValue, false, false, this.oSystemContext);
        // Assert
        assert.deepEqual(this.oSaveParameterValueStub.firstCall.args, [
            "P", oValue, this.oSystemContext
        ], "The function saveParameterValue has been called with the correct parameters.");
        assert.strictEqual(oValue._shellData.storeDate, "just now", "The correct date value has been added.");
    });

    QUnit.test("Copies the _shellData property to add the store date", async function (assert) {
        // Arrange
        const oShellData = {};
        const oValue = {
            _shellData: oShellData
        };

        // Act
        await this.oUserDefaultParametersService._saveParameterValue("P", oValue, undefined, undefined, this.oSystemContext);
        // Assert
        assert.notStrictEqual(oValue._shellData, oShellData, "A new object reference is used.");
    });

    QUnit.test("Removes the extendedValue property's value", async function (assert) {
        // Arrange
        const oValue = {
            extendedValue: "foo",
            _shellData: {}
        };

        // Act
        await this.oUserDefaultParametersService._saveParameterValue("P", oValue, false, true, this.oSystemContext);
        // Assert
        assert.strictEqual(oValue.extendedValue, undefined, "The extendedValue property is undefined.");
    });

    QUnit.test("Triggers the valueStored event", async function (assert) {
        // Arrange
        const oValue = {
            _shellData: {}
        };

        // Act
        await this.oUserDefaultParametersService._saveParameterValue("P", oValue, undefined, undefined, this.oSystemContext);
        // Assert
        assert.strictEqual(this.oFireEventStub.callCount, 1, "The function fireEvent has been called once.");
        assert.deepEqual(this.oFireEventStub.firstCall.args, [
            "valueStored",
            {
                parameterName: "P",
                parameterValue: {
                    _shellData: {
                        storeDate: undefined
                    }
                },
                systemContext: {
                    id: "systemContextId"
                }
            }
        ], "The function fireEvent has been called with the correct parameters.");
    });

    QUnit.test("Passes undefined as the value if it has an initial state to saveParameterValue", async function (assert) {
        // Arrange
        const oValue = {
            _shellData: {}
        };
        this.oIsInitialStub.returns(true);

        // Act
        await this.oUserDefaultParametersService._saveParameterValue("P", oValue, true, undefined, this.oSystemContext);
        // Assert
        assert.deepEqual(this.oSaveParameterValueStub.firstCall.args, [
            "P", undefined, this.oSystemContext
        ], "The function saveParameterValue has been called with the correct parameters.");
        assert.deepEqual(this.oUserDefaultParametersService._oWasParameterPersisted, { P: false }, "The correct object structure has been found.");
        assert.deepEqual(oValue, { _shellData: {} }, "The correct object structure has been found.");
    });

    QUnit.module("The function _getPersistedValue", {
        beforeEach: function () {
            this.oUserDefaultParametersService = new UserDefaultParameters();

            this.oLoadParameterValueStub = sandbox.stub();
            const oUserDefaultParameterPersistenceService = {
                loadParameterValue: this.oLoadParameterValueStub
            };
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").resolves(oUserDefaultParameterPersistenceService);
        },
        afterEach: function () {
            sandbox.restore();
            Container.resetServices();
        }
    });

    QUnit.test("Passes the parameters through and resolves with the inner call's value", async function (assert) {
        // Arrange
        this.oLoadParameterValueStub.resolves("\\^_^/");
        const oContext = {};

        // Act
        const oResult = await this.oUserDefaultParametersService._getPersistedValue("P", oContext);
        // Assert
        assert.strictEqual(oResult, "\\^_^/", "The correct value was found.");
        assert.deepEqual(this.oLoadParameterValueStub.firstCall.args, [
            "P", oContext
        ], "The function loadParameterValue has been called with the correct parameters.");
        assert.strictEqual(this.oLoadParameterValueStub.firstCall.args[1], oContext, "The function loadParameterValue has been called with the correct reference.");
    });

    QUnit.test("Passes the parameters through and rejects with the inner call's error", function (assert) {
        // Arrange
        this.oLoadParameterValueStub.returns(Promise.reject("ö_ö"));
        const oContext = {};

        // Act
        return this.oUserDefaultParametersService._getPersistedValue("P", oContext)
            .catch((oResult) => {
                // Assert
                assert.strictEqual(oResult, "ö_ö", "The correct value was found.");
                assert.deepEqual(this.oLoadParameterValueStub.firstCall.args, [
                    "P", oContext
                ], "The function loadParameterValue has been called with the correct parameters.");
                assert.strictEqual(this.oLoadParameterValueStub.firstCall.args[1], oContext, "The function loadParameterValue has been called with the correct reference.");
            });
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.services.ClientSideTargetResolution.PrelaunchOperations".
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/fe/navigation/SelectionVariant",
    "sap/ushell/services/ClientSideTargetResolution/PrelaunchOperations",
    "sap/ushell/utils/type",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    Log,
    deepExtend,
    SelectionVariant,
    _PrelaunchOperations,
    ushellType,
    jQuery,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.sandbox.create();

    /*
     * Creates a fake app state service that returns the provided initial app state data.
     * This data can be modified based on what the consumer of the service calls.
     */
    QUnit.module("sap.ushell.services.ClientSideTargetResolution.XAppStateProcessing#executePrelaunchOperations", {
        beforeEach: function () {
            sandbox.stub(Log, "error");
            sandbox.stub(Log, "warning");
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    function createFakeAppStateWithData (oAppStateDataStorage, sKey, oData) {
        oAppStateDataStorage[sKey] = oData;
        var oFakeAppState = {
            getData: function () { return oAppStateDataStorage[sKey]; },
            setData: function (vData) { oAppStateDataStorage[sKey] = vData; },
            save: function () { return new jQuery.Deferred().resolve().promise(); },
            getKey: function () { return sKey; }
        };
        return oFakeAppState;
    }

    function createFakeAppStateServiceWithNoSelectOptions (oAppStateDataStorage) {
        var iCount = 0;
        var oFakeAppStateService = {
            getAppState: function (sKey) {
                return new jQuery.Deferred().resolve().promise();
            },
            createEmptyAppState: sandbox.stub().returns(createFakeAppStateWithData(oAppStateDataStorage, "APPSTATE_KEY_" + (++iCount), null))
        };
        return oFakeAppStateService;
    }

    function createFakeAppStateServiceWithSelectOptions (oAppStateDataStorage, sKey, aSelectOptions, aParameters) {
        var oSelectionVariantData = new SelectionVariant({
            ODataFilterExpression: "",
            SelectionVariantID: "",
            Parameters: aParameters || [],
            SelectOptions: aSelectOptions || []
        }).toJSONObject();
        var oFakeAppState = createFakeAppStateWithData(oAppStateDataStorage, sKey, { selectionVariant: oSelectionVariantData });
        var iCount = 0;
        var oFakeAppStateService = {
            getAppState: function (sKey) {
                return new jQuery.Deferred().resolve(oFakeAppState).promise();
            },
            createEmptyAppState: sandbox.stub().returns(createFakeAppStateWithData(oAppStateDataStorage, sKey + "_" + (++iCount), null))
        };
        return oFakeAppStateService;
    }

    function testSelectionVariant (assert, oAppStateDataStorage, aExpectedSelectOptions, aExpectedAppStateParameters, oMatchingTarget) {
        var bHasExpectedAppStateArg = arguments.length === 5;
        if (!bHasExpectedAppStateArg) {
            oMatchingTarget = arguments[arguments.length - 1];
            aExpectedAppStateParameters = [];
        }

        var sAppStateKey = oMatchingTarget.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"][0];
        var oAppStateData = oAppStateDataStorage[sAppStateKey];
        var oSelectionVariant = oAppStateData.selectionVariant;
        var oExpectedSelectionVariant = {
            SelectionVariantID: "",
            Text: "Selection Variant with ID ",
            Version: {
                Major: "1",
                Minor: "0",
                Patch: "0"
            },
            SelectOptions: aExpectedSelectOptions,
            ODataFilterExpression: "",
            Parameters: aExpectedAppStateParameters
        };

        assert.deepEqual(oSelectionVariant, oExpectedSelectionVariant, "got the expected selection variant");
        return oMatchingTarget;
    }

    function testNoSapXappState (assert, oMatchingTarget) {
        assert.notOk(oMatchingTarget.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"], "no sap-xapp-state is created");
    }

    function testStartupParameters (assert, oExpectedStartupParameters, oMatchingTarget) {
        var oStartupParameters = oMatchingTarget.mappedIntentParamsPlusSimpleDefaults;
        assert.deepEqual(oStartupParameters, oExpectedStartupParameters, "got the expected startup parameters");
        return oMatchingTarget;
    }

    function testDefaultedParameterNames (assert, oExpectedDefaultedParameterNames, oMatchingTarget) {
        var oDefaultedParameterNames = oMatchingTarget.mappedDefaultedParamNames;
        assert.deepEqual(oDefaultedParameterNames, oExpectedDefaultedParameterNames, "got the expected defaulted parameter names");
        return oMatchingTarget;
    }

    function testNoErrorsOnConsole (assert) {
        assert.deepEqual(Log.error.args, [], "Log.error was not called");
    }

    function testNoWarningsOnConsole (assert) {
        assert.deepEqual(Log.warning.args, [], "Log.warning was not called");
    }

    function testThereAreErrorsOnConsole (assert, reError) {
        return testThereAreLogsOnConsole(assert, "error", reError);
    }

    function testThereAreWarningsOnConsole (assert, reWarning) {
        return testThereAreLogsOnConsole(assert, "warning", reWarning);
    }

    function testThereAreLogsOnConsole (assert, sType, re) {
        assert.strictEqual(Log[sType].args.length, 1, "Log with type " + sType + " was called once");
        assert.strictEqual(Log[sType].calledWith(sandbox.match(re)), true,
            "Log with type " + sType + " was called with " + re + " GOT INSTEAD: " + JSON.stringify(Log[sType].args));
    }

    function testNoGetAppStateCall (assert, getAppSateStub) {
        assert.notOk(getAppSateStub.called, "getAppSate is not called when there is no sap-xapp-state");
    }

    function arrangeExecutePrelaunchOperationsTest (oInput) {
        var oAppStateDataStorage = {};
        var sAppStateKey = oInput.startupParameters["sap-xapp-state"];
        this.oAppStateServiceMock = null;
        if (sAppStateKey) {
            if (!ushellType.isArray(sAppStateKey)) {
                throw new Error("Given app state key should be an array of one item");
            }
            sAppStateKey = sAppStateKey[0];
            this.oAppStateServiceMock = createFakeAppStateServiceWithSelectOptions(
                oAppStateDataStorage,
                sAppStateKey,
                oInput.appStateSelectOptions,
                oInput.appStateParameters
            );
        } else {
            this.oAppStateServiceMock = createFakeAppStateServiceWithNoSelectOptions(oAppStateDataStorage);
        }

        this.oGetServiceAsyncStub.withArgs("AppState").resolves(this.oAppStateServiceMock);

        var sPrelaunchOperations = JSON.stringify(oInput.prelaunchOperations);
        var oMatchingTarget = {
            mappedIntentParamsPlusSimpleDefaults: oInput.startupParameters,
            mappedDefaultedParamNames: oInput.defaultedParameterNames || []
        };

        return {
            prelaunchOperations: sPrelaunchOperations,
            matchingTarget: oMatchingTarget,
            appStateDataStorage: oAppStateDataStorage
        };
    }

    QUnit.test("Merge is executed when startup parameters have the same values as in the selection variant", function (assert) {
        var fnDone = assert.async();

        var aInputAppStateSelectOptions = [{
            PropertyName: "P_Startdate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "START_DATE",
                High: null
            }]
        }, {
            PropertyName: "P_Enddate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "END_DATE",
                High: null
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"],
                P_Startdate: ["START_DATE"],
                P_Enddate: ["END_DATE"]
            },
            appStateSelectOptions: aInputAppStateSelectOptions,
            prelaunchOperations: [{
                type: "merge",
                source: ["P_Startdate", "P_Enddate"],
                target: "PostingDate"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY_1"],
                P_Startdate: ["START_DATE"],
                P_Enddate: ["END_DATE"]
            },
            appStateSelectOptions: aInputAppStateSelectOptions.concat({
                PropertyName: "PostingDate",
                Ranges: [{
                    Sign: "I",
                    Option: "BT",
                    Low: "START_DATE",
                    High: "END_DATE"
                }]
            })
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("Merge is executed when there is no app state but only intent parameters", function (assert) {
        var fnDone = assert.async();

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                P1: ["START"],
                P2: ["END"]
            },
            appStateSelectOptions: {},
            prelaunchOperations: [{
                type: "merge",
                source: ["P1", "P2"],
                target: "PMERGED"
            }]
        });

        var oGetAppStateSpy = sandbox.spy(this.oAppStateServiceMock, "getAppState");
        var oExpected = {
            startupParameters: {
                P1: ["START"],
                P2: ["END"],
                "sap-xapp-state": ["APPSTATE_KEY_1"]
            },
            appStateSelectOptions: [{
                PropertyName: "PMERGED",
                Ranges: [{
                    Sign: "I",
                    Option: "BT",
                    Low: "START",
                    High: "END"
                }]
            }]
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoGetAppStateCall.bind(null, assert, oGetAppStateSpy))
            .then(fnDone);
    });

    QUnit.test("Merge is executed when there is only a valid selection variant but no intent parameters", function (assert) {
        var fnDone = assert.async();

        var aInputAppStateSelectOptions = [{
            PropertyName: "P_Startdate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "LOW",
                High: null
            }]
        }, {
            PropertyName: "P_Enddate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "HIGH",
                High: null
            }]
        }];
        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                // nothing here
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputAppStateSelectOptions,
            prelaunchOperations: [{
                type: "merge",
                source: ["P_Startdate", "P_Enddate"],
                target: "PMERGED"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY_1"]
            },
            appStateSelectOptions: aInputAppStateSelectOptions.concat([{
                PropertyName: "PMERGED",
                Ranges: [{
                    Sign: "I",
                    Option: "BT",
                    Low: "LOW",
                    High: "HIGH"
                }]
            }])
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("(Empty) Merge is executed when there are no parameters in a selection variant and no intent parameters", function (assert) {
        var fnDone = assert.async();

        var aInputAppStateSelectOptions = [{
            PropertyName: "OTHER_PARAMETER",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "LOW",
                High: null
            }]
        }];
        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                // nothing here
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputAppStateSelectOptions,
            prelaunchOperations: [{
                type: "merge",
                source: ["P_Startdate", "P_Enddate"],
                target: "PMERGED"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: [{
                PropertyName: "OTHER_PARAMETER",
                Ranges: [{
                    Sign: "I",
                    Option: "EQ",
                    Low: "LOW",
                    High: null
                }]
            }]
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("Merge fails when startup parameters do not match those in the x-app-state", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "P_Startdate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "LOW",
                High: null
            }]
        }, {
            PropertyName: "P_Enddate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "HIGH",
                High: null
            }]
        }];
        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"],
                P_Startdate: ["ABC"],
                P_Enddate: ["DEF"]
            },
            appStateSelectOptions: aInputSelectOptions,
            prelaunchOperations: [{
                type: "merge",
                source: ["P_Startdate", "P_Enddate"],
                target: "PostingDate"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"],
                P_Startdate: ["ABC"],
                P_Enddate: ["DEF"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreWarningsOnConsole.bind(null, assert, /Cannot execute merge/))
            .then(fnDone);
    });

    QUnit.test("Merge fails when target is already in the x-app-state", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "P_Startdate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "LOW",
                High: null
            }]
        }, {
            PropertyName: "P_Enddate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "HIGH",
                High: null
            }]
        }, {
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "AAA",
                High: "BBB"
            }]
        }];
        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions,
            prelaunchOperations: [{
                type: "merge",
                source: ["P_Startdate", "P_Enddate"],
                target: "PostingDate"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreWarningsOnConsole.bind(null, assert, /Cannot execute merge/))
            .then(fnDone);
    });

    QUnit.test("Merge fails when target is already in the startup parameters", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "P_Startdate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "LOW",
                High: null
            }]
        }, {
            PropertyName: "P_Enddate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "HIGH",
                High: null
            }]
        }];
        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"],
                PostingDate: ["ABC"]
            },
            appStateSelectOptions: aInputSelectOptions,
            prelaunchOperations: [{
                type: "merge",
                source: ["P_Startdate", "P_Enddate"],
                target: "PostingDate"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"],
                PostingDate: ["ABC"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreWarningsOnConsole.bind(null, assert, /Cannot execute merge/))
            .then(fnDone);
    });

    QUnit.test("Split is executed also on single valued parameters", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "DATE",
                High: null
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions,
            prelaunchOperations: [{
                type: "split",
                source: "PostingDate",
                target: ["PostingDateFrom", "PostingDateTo"]
            }]
        });

        var oExpected = {
            startupParameters: { // split successful: parameters are split in the startup parameters as well
                PostingDateFrom: ["DATE"],
                PostingDateTo: ["DATE"],
                "sap-xapp-state": ["APPSTATE_KEY_1"] // new app state generated
            },
            appStateSelectOptions: aInputSelectOptions.concat([{ // original select option stays in target app state
                PropertyName: "PostingDateFrom",
                Ranges: [{
                    Sign: "I",
                    Option: "EQ",
                    Low: "DATE",
                    High: null
                }]
            }, {
                PropertyName: "PostingDateTo",
                Ranges: [{
                    Sign: "I",
                    Option: "EQ",
                    Low: "DATE",
                    High: null
                }]
            }])
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoWarningsOnConsole.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(fnDone);
    });

    QUnit.test("Split is not executed when there is no sap-xapp-state", function (assert) {
        var fnDone = assert.async();

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {},
            appStateSelectOptions: {},
            prelaunchOperations: [{
                type: "split",
                source: "PostingDate",
                target: ["PostingDateFrom", "PostingDateTo"]
            }]
        });

        var oGetAppStateSpy = sandbox.spy(this.oAppStateServiceMock, "getAppState");

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testThereAreErrorsOnConsole.bind(null, assert, /Invalid split operation/))
            .then(testThereAreWarningsOnConsole.bind(null, assert, /Cannot execute split/))
            .then(testNoGetAppStateCall.bind(null, assert, oGetAppStateSpy))
            .then(fnDone);
    });

    QUnit.test("Split is executed when only a valid selection variant exists in a sap-xapp-state", function (assert) {
        var fnDone = assert.async();

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: { // application is launched with a "sap-xapp-state" ...
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: [{ // ... "sap-xapp-state" contains a selection variant with selectOptions
                PropertyName: "PostingDate",
                Ranges: [{
                    Sign: "I",
                    Option: "BT",
                    Low: "START_DATE",
                    High: "END_DATE"
                }]
            }],
            prelaunchOperations: [{ // i.e. split posting date into two target parameters
                type: "split",
                source: "PostingDate",
                target: ["P_Startdate", "P_Enddate"]
            }]
        });

        var oExpected = {
            startupParameters: { // split successful: parameters are split in the startup parameters as well
                P_Startdate: ["START_DATE"],
                P_Enddate: ["END_DATE"],
                "sap-xapp-state": ["APPSTATE_KEY_1"] // new app state generated
            },
            appStateSelectOptions: [{ // original select option stays in target app state
                PropertyName: "PostingDate",
                Ranges: [{
                    Sign: "I",
                    Option: "BT",
                    Low: "START_DATE",
                    High: "END_DATE"
                }]
            }, {
                PropertyName: "P_Startdate",
                Ranges: [{
                    Sign: "I",
                    Option: "EQ",
                    Low: "START_DATE",
                    High: null
                }]
            }, {
                PropertyName: "P_Enddate",
                Ranges: [{
                    Sign: "I",
                    Option: "EQ",
                    Low: "END_DATE",
                    High: null
                }]
            }]
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(fnDone);
    });

    QUnit.test("Split fails when one parameter already exists among startup parameters", function (assert) {
        var fnDone = assert.async();

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"],
                TargetA: ["true"]
            },
            appStateSelectOptions: [{
                PropertyName: "PostingDate",
                Ranges: [{
                    Sign: "I",
                    Option: "BT",
                    Low: "START_DATE",
                    High: "END_DATE"
                }]
            }],
            prelaunchOperations: [{
                type: "split",
                source: "PostingDate",
                target: ["TargetA", "TargetB"]
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"],
                TargetA: ["true"]
            },
            appStateSelectOptions: [{
                PropertyName: "PostingDate",
                Ranges: [{
                    Sign: "I",
                    Option: "BT",
                    Low: "START_DATE",
                    High: "END_DATE"
                }]
            }]
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreWarningsOnConsole.bind(null, assert, /Cannot execute split/))
            .then(fnDone);
    });

    QUnit.test("Multiple split operations", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDateA",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowA",
                High: "DataLowA"
            }]
        }, {
            PropertyName: "PostingDateB",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowB",
                High: "DateHighB"
            }]
        }, {
            PropertyName: "PostingDateC",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowC",
                High: "DateHighC"
            }]
        }];
        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"],
                a: ["test"]
            },
            appStateSelectOptions: aInputSelectOptions,
            prelaunchOperations: [{
                type: "split",
                source: "PostingDateA",
                target: ["DateAFrom", "DateATo"]
            }, {
                type: "split",
                source: "PostingDateB",
                target: ["DateBFrom", "DateBTo"]
            }, {
                type: "split",
                source: "PostingDateC",
                target: ["DateCFrom", "DateCTo"]
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY_1"],
                DateAFrom: ["DateLowA"],
                DateATo: ["DataLowA"],
                DateBFrom: ["DateLowB"],
                DateBTo: ["DateHighB"],
                DateCFrom: ["DateLowC"],
                DateCTo: ["DateHighC"],
                a: ["test"]
            },
            appStateSelectOptions: aInputSelectOptions.concat([{
                PropertyName: "DateAFrom",
                Ranges: [{
                    High: null,
                    Low: "DateLowA",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "DateATo",
                Ranges: [{
                    High: null,
                    Low: "DataLowA",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "DateBFrom",
                Ranges: [{
                    High: null,
                    Low: "DateLowB",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "DateBTo",
                Ranges: [{
                    High: null,
                    Low: "DateHighB",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "DateCFrom",
                Ranges: [{
                    High: null,
                    Low: "DateLowC",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "DateCTo",
                Ranges: [{
                    High: null,
                    Low: "DateHighC",
                    Option: "EQ",
                    Sign: "I"
                }]
            }])
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("Multiple merge operations", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDateA",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "DateA",
                High: null
            }]
        }, {
            PropertyName: "PostingDateB",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "DateB",
                High: null
            }]
        }, {
            PropertyName: "PostingDateC",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "DateC",
                High: null
            }]
        }];
        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions,
            prelaunchOperations: [{
                type: "merge",
                source: ["PostingDateA", "PostingDateB"],
                target: "PostingDateAB"
            }, {
                type: "merge",
                source: ["PostingDateB", "PostingDateC"],
                target: "PostingDateBC"
            }, {
                type: "merge",
                source: ["PostingDateA", "PostingDateC"],
                target: "PostingDateAC1"
            }, {
                type: "merge",
                source: ["PostingDateA", "PostingDateC"],
                target: "PostingDateAC2"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY_1"]
            },
            appStateSelectOptions: aInputSelectOptions.concat([{
                PropertyName: "PostingDateAB",
                Ranges: [{
                    Low: "DateA",
                    High: "DateB",
                    Option: "BT",
                    Sign: "I"
                }]
            }, {
                PropertyName: "PostingDateBC",
                Ranges: [{
                    Low: "DateB",
                    High: "DateC",
                    Option: "BT",
                    Sign: "I"
                }]
            }, {
                PropertyName: "PostingDateAC1",
                Ranges: [{
                    Low: "DateA",
                    High: "DateC",
                    Option: "BT",
                    Sign: "I"
                }]
            }, {
                PropertyName: "PostingDateAC2",
                Ranges: [{
                    Low: "DateA",
                    High: "DateC",
                    Option: "BT",
                    Sign: "I"
                }]
            }])
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("Merge is executed with a best effort strategy if failing operation are present in a chain of split operations", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDateA",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowA",
                High: "DateHighA"
            }]
        }, {
            PropertyName: "PostingDateB",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowB",
                High: "DateHighB"
            }]
        }, {
            PropertyName: "PostingDateC",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowC",
                High: "DateHighC"
            }]
        }];
        var oInputStartupParameters = {
            "sap-xapp-state": ["APPSTATE_KEY"],
            a: ["test"]
        };

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: deepExtend({}, oInputStartupParameters),
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: [{
                type: "split",
                source: "PostingDateA",
                target: ["DateAFrom", "DateATo"]
            }, {
                type: "split",
                source: "PostingDateB",
                target: ["DateBFrom", "DateBTo"]
            }, {
                type: "split", // "DateATo" already exists -> this split will be aborted
                source: "PostingDateC",
                target: ["DateCFrom", "DateATo"]
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY_1"],
                a: ["test"],
                DateAFrom: ["DateLowA"],
                DateATo: ["DateHighA"],
                DateBFrom: ["DateLowB"],
                DateBTo: ["DateHighB"]
            },
            appStateSelectOptions: aInputSelectOptions.concat([{
                PropertyName: "DateAFrom",
                Ranges: [{
                    High: null,
                    Low: "DateLowA",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "DateATo",
                Ranges: [{
                    High: null,
                    Low: "DateHighA",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "DateBFrom",
                Ranges: [{
                    High: null,
                    Low: "DateLowB",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "DateBTo",
                Ranges: [{
                    High: null,
                    Low: "DateHighB",
                    Option: "EQ",
                    Sign: "I"
                }]
            }])
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreWarningsOnConsole.bind(null, assert, /Cannot execute split/))
            .then(fnDone);
    });

    QUnit.test("Can mix merge with split operations", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: [{
                type: "split",
                source: "PostingDate",
                target: ["P_Startdate", "P_Enddate"]
            }, {
                type: "merge",
                source: ["P_Startdate", "P_Enddate"],
                target: "PostingDate_new"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY_1"],
                P_Enddate: ["Fri Jun 20 2015 00:00:00 GMT+0800"],
                P_Startdate: ["Fri Jun 20 2014 00:00:00 GMT+0800"]
            },
            appStateSelectOptions: aInputSelectOptions.concat([{
                PropertyName: "P_Startdate",
                Ranges: [{
                    High: null,
                    Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "P_Enddate",
                Ranges: [{
                    High: null,
                    Low: "Fri Jun 20 2015 00:00:00 GMT+0800",
                    Option: "EQ",
                    Sign: "I"
                }]
            }, {
                PropertyName: "PostingDate_new",
                Ranges: [{
                    Sign: "I",
                    Option: "BT",
                    Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                    High: "Fri Jun 20 2015 00:00:00 GMT+0800"
                }]
            }])
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("Errors in case of invalid operation type", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: [{
                type: "some-invalid-operation",
                source: "PostingDate",
                target: ["P_Startdate", "P_Enddate"]
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreErrorsOnConsole.bind(null, assert, /Invalid operation/))
            .then(fnDone);
    });

    QUnit.test("Errors in case of invalid split value (same target)", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: [{
                type: "split",
                source: "PostingDate",
                target: ["SAME_TARGET", "SAME_TARGET"]
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreErrorsOnConsole.bind(null, assert, /Invalid operation/))
            .then(fnDone);
    });

    QUnit.test("Errors in case of invalid operation format (array instead of string)", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: [{
                type: "split",
                source: ["PostingDate"], // should be a string
                target: "Target1,Target2" // should be an array
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreErrorsOnConsole.bind(null, assert, /Invalid operation/))
            .then(fnDone);
    });

    QUnit.test("Errors in case of invalid operation format (three sources)", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "SOURCEA",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }, {
            PropertyName: "SOURCEB",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: [{
                type: "merge",
                source: ["SOURCEA", "SOURCEB", "SOURCEA"], // three -> not allowed
                target: "Target"
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreErrorsOnConsole.bind(null, assert, /Invalid operation/))
            .then(fnDone);
    });

    QUnit.test("Errors in case of invalid operation format (three targets)", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "SOURCE",
            Ranges: [{
                Sign: "I",
                Option: "EQ",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: null
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: [{
                type: "split",
                source: "SOURCE",
                target: ["TARGET", "TARGET2", "TARGET3"]
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreErrorsOnConsole.bind(null, assert, /Invalid operation/))
            .then(fnDone);
    });

    QUnit.test("No prelaunch operations", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: []
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("Empty prelaunch operations parameter", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: []
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, /* empty */ "")
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("Invalid AppState data", function (assert) {
        var fnDone = assert.async();

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: [],
            prelaunchOperations: [{
                type: "merge",
                source: ["some", "some-other"],
                target: "target"
            }]
        });

        // simulate weird app state content
        oInput.appStateDataStorage.APPSTATE_KEY = "STRINGS IN THE DATA!"; // this is not expected; it should be an object

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: []
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testThereAreWarningsOnConsole.bind(null, assert, /Cannot execute merge/))
            .then(fnDone);
    });

    QUnit.test("Invalid JSON in prelaunch operation argument", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: []
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, "[some:invalid:json]")
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreErrorsOnConsole.bind(null, assert, /Cannot parse operation array/))
            .then(fnDone);
    });

    QUnit.test("sap-prelaunch-operations is not an array", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDate",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "Fri Jun 20 2014 00:00:00 GMT+0800",
                High: "Fri Jun 20 2015 00:00:00 GMT+0800"
            }]
        }];

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: {} // NOTE: an object
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testThereAreErrorsOnConsole.bind(null, assert, /Invalid operation array/))
            .then(fnDone);
    });

    QUnit.test("Delete is executed on startup and selection variant", function (assert) {
        var fnDone = assert.async();

        var aInputAppStateParameters = [{
            PropertyName: "AppStateParameter",
            PropertyValue: "Test Value"
        }, {
            PropertyName: "a",
            PropertyValue: "Test Value"
        }];

        var aInputSelectOptions = [{
            PropertyName: "PostingDateA",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowA",
                High: "DateHighA"
            }]
        }, {
            PropertyName: "PostingDateB",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowB",
                High: "DateHighB"
            }]
        }, {
            PropertyName: "PostingDateC",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowC",
                High: "DateHighC"
            }]
        }];
        var oInputStartupParameters = {
            "sap-xapp-state": ["APPSTATE_KEY"],
            a: ["test1"],
            b: ["test2"]
        };

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            defaultedParameterNames: ["a", "b"],
            startupParameters: deepExtend({}, oInputStartupParameters),
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            appStateParameters: deepExtend([], aInputAppStateParameters),
            prelaunchOperations: [{
                type: "delete",
                target: ["a", "PostingDateA", "PostingDateB", "PostingDateC"]
            }]
        });

        var oExpected = {
            startupParameters: {
                "sap-xapp-state": ["APPSTATE_KEY_1"],
                b: ["test2"]
            },
            appStateSelectOptions: [],
            appStateParameters: [{
                PropertyName: "AppStateParameter",
                PropertyValue: "Test Value"
            }],
            defaultedParameterNames: ["b"]
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testDefaultedParameterNames.bind(null, assert, oExpected.defaultedParameterNames))
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions, oExpected.appStateParameters))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(testNoWarningsOnConsole.bind(null, assert))
            .then(fnDone);
    });

    QUnit.test("Delete is executed on startup when there is no sap-xapp-state", function (assert) {
        var fnDone = assert.async();

        var aInputAppStateParameters = [];
        var aInputSelectOptions = [];
        var oInputStartupParameters = {
            a: ["test1"],
            b: ["test2"]
        };

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            defaultedParameterNames: ["a", "b"],
            startupParameters: deepExtend({}, oInputStartupParameters),
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            appStateParameters: deepExtend([], aInputAppStateParameters),
            prelaunchOperations: [{
                type: "delete",
                target: ["a"]
            }]
        });

        var oGetAppStateSpy = sandbox.spy(this.oAppStateServiceMock, "getAppState");
        var oExpected = {
            startupParameters: {
                b: ["test2"]
            },
            defaultedParameterNames: ["b"]
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testDefaultedParameterNames.bind(null, assert, oExpected.defaultedParameterNames))
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testNoSapXappState.bind(null, assert))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(testNoWarningsOnConsole.bind(null, assert))
            .then(testNoGetAppStateCall.bind(null, assert, oGetAppStateSpy))
            .then(fnDone);
    });

    QUnit.test("Delete sap-xapp-state cannot be executed", function (assert) {
        var fnDone = assert.async();

        var aInputSelectOptions = [{
            PropertyName: "PostingDateA",
            Ranges: [{
                Sign: "I",
                Option: "BT",
                Low: "DateLowA",
                High: "DateHighA"
            }]
        }];
        var oInputStartupParameters = {
            a: ["parameter"],
            "sap-xapp-state": ["APPSTATE_KEY"]
        };

        var oInput = arrangeExecutePrelaunchOperationsTest.call(this, {
            startupParameters: deepExtend({}, oInputStartupParameters),
            appStateSelectOptions: deepExtend([], aInputSelectOptions),
            prelaunchOperations: [{
                type: "delete",
                target: ["sap-xapp-state"]
            }]
        });

        var oExpected = {
            startupParameters: {
                a: ["parameter"],
                "sap-xapp-state": ["APPSTATE_KEY"]
            },
            appStateSelectOptions: aInputSelectOptions
        };

        _PrelaunchOperations
            .executePrelaunchOperations(oInput.matchingTarget, oInput.prelaunchOperations)
            .then(testStartupParameters.bind(null, assert, oExpected.startupParameters))
            .then(testSelectionVariant.bind(null, assert, oInput.appStateDataStorage, oExpected.appStateSelectOptions))
            .then(testNoErrorsOnConsole.bind(null, assert))
            .then(testThereAreWarningsOnConsole.bind(null, assert, /Cannot execute delete/))
            .then(fnDone);
    });

    QUnit.module("parseAndValidateOperations");

    QUnit.test("Incorrect quotations do not break the JSON.parse", function (assert) {
        // Arrange
        var sPrelaunchOperations = "[{“type”: “delete”, “target”: [“AllocationCycleNameText”, “CompanyCodeName”]}]";
        var aExpectedPrelaunchOperations = [
            {
                type: "delete",
                target: [
                    "AllocationCycleNameText",
                    "CompanyCodeName"
                ]
            }
        ];

        // Act
        var aPreLaunchOperations = _PrelaunchOperations.parseAndValidateOperations(sPrelaunchOperations);

        // Assert
        assert.deepEqual(aPreLaunchOperations, aExpectedPrelaunchOperations, "prelaunch operations parsed and validated correctly.");
    });
});

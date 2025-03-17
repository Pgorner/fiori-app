// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Bookmark
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepClone",
    "sap/base/util/isPlainObject",
    "sap/base/util/ObjectPath",
    "sap/ui/core/Component",
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/sinon-4",
    "sap/ui/thirdparty/URI",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/services/Navigation",
    "sap/ushell/services/URLParsing",
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (
    Log,
    deepClone,
    isPlainObject,
    ObjectPath,
    Component,
    UIComponent,
    hasher,
    jQuery,
    sinon,
    URI,
    Config,
    Container,
    AppConfiguration,
    Navigation,
    URLParsing,
    testUtils,
    ushellUtils
) {
    "use strict";

    /* global QUnit */

    var sandbox = sinon.createSandbox({});

    var aCoreExtLightPreloadBundles = [
        "sap/fiori/core-ext-light-0.js",
        "sap/fiori/core-ext-light-1.js",
        "sap/fiori/core-ext-light-2.js",
        "sap/fiori/core-ext-light-3.js"
    ];

    // define a root UIComponent which exposes the main view

    // new Component
    UIComponent.extend("sap.ushell.foo.bar.Component", {
        init: function () { }
    });

    var UrlParsing = new URLParsing();

    // TODO this test file is not isolated but calls many ushell services and relies on them
    QUnit.module("sap.ushell.services.Navigation - Part 1", {
        beforeEach: async function (assert) {
            this.oErrorStub = sandbox.stub(Log, "error");

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/customPreload/coreResourcesComplement").returns(aCoreExtLightPreloadBundles);

            await Container.init("local");
            const aServices = await Promise.all([
                Container.getServiceAsync("Navigation"),
                Container.getServiceAsync("ShellNavigationInternal"),
                Container.getServiceAsync("NavTargetResolutionInternal")
            ]);
            this.Navigation = aServices[0];
            this.ShellNavigationInternal = aServices[1];
            this.NavTargetResolutionInternal = aServices[2];
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("getServiceAsync", function (assert) {
        assert.equal(localStorage && localStorage["sap-ushell-enc-test"], undefined, "Beware, please remove sap-ushell-enc local storage setting!");

        // test
        assert.ok(this.Navigation instanceof Navigation);
        assert.strictEqual(typeof this.Navigation.navigate, "function");
        // TODO test parameters
    });

    QUnit.test("with ShellNavigationInternal.hrefForExternal", async function (assert) {
        // Arrange
        var oObject = { 1: 2 };
        var oAbcParam = { target: {} };
        var oHrefForExternalStub = sandbox.stub(this.ShellNavigationInternal, "hrefForExternal").callsFake(function (oArgs) {
            return Promise.resolve(oArgs);
        });
        this.oErrorStub.resetHistory();

        // Act
        const oResult = await this.Navigation.getHref(oAbcParam, oObject);

        // Assert
        assert.deepEqual(oResult, oAbcParam);
        assert.notStrictEqual(oHrefForExternalStub.getCall(0).args[0], oAbcParam, "parameter was cloned");
        assert.deepEqual(oHrefForExternalStub.getCall(0).args[0], oAbcParam, "parameter was cloned successfully");
        assert.deepEqual(oHrefForExternalStub.getCall(0).args[2], oObject, "2nd argument transferred");
    });

    QUnit.test("with ShellNavigationInternal.toExternal", async function (assert) {
        // Arrange
        var oObject = { 1: 2 };
        var oDefParam = { target: {} };
        var oToExternalStub = sandbox.stub(this.ShellNavigationInternal, "toExternal").resolves();

        // Act
        await this.Navigation.navigate(oDefParam, oObject);

        // Assert
        assert.notStrictEqual(oToExternalStub.getCall(0).args[0], oDefParam, "parameter was cloned");
        assert.deepEqual(oToExternalStub.getCall(0).args[0], oDefParam, "parameter was cloned successfully");
        assert.equal(oToExternalStub.getCall(0).args[1], oObject, "Component as 2nd argument transferred");
    });

    QUnit.test("getSemanticObjects", async function (assert) {
        var aFakeResult = ["SemanticObject1", "SemanticObject2"];

        sandbox.stub(this.NavTargetResolutionInternal, "getDistinctSemanticObjects").returns(
            new jQuery.Deferred().resolve(aFakeResult).promise()
        );

        // Act
        const aGotResult = await this.Navigation.getSemanticObjects();

        // Assert
        assert.deepEqual(aGotResult, aFakeResult, "result returned from NavTargetResolutionInternal#getDistinctSemanticObjects was propagated");
    });

    QUnit.test("getLinks", async function (assert) {
        // Arrange
        var mParameters = {
            A: "B",
            C: "e'e e"
        };
        var sAppState = "ANAPSTATE";
        var oObject = {};

        var aLinks = [];

        sandbox.stub(this.NavTargetResolutionInternal, "getLinks").returns(new jQuery.Deferred().resolve(aLinks).promise());

        // Act
        const aResult = await this.Navigation.getLinks([{
            semanticObject: "Action",
            params: mParameters,
            paramsOptions: [],
            ignoreFormFactor: true,
            ui5Component: oObject,
            appStateKey: sAppState
        }]);

        // assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                A: "B",
                C: "e'e e",
                "sap-xapp-state": [
                    "ANAPSTATE"
                ]
            },
            paramsOptions: [],
            ignoreFormFactor: true,
            ui5Component: oObject,
            //appStateKey: sAppState,
            compactIntents: false, // false is the default
            action: undefined
        }, "NavTargetResolutionInternal was called with the expected parameters");

        assert.deepEqual(aResult, [aLinks], "Resolved the expected result");
    });

    QUnit.test("getLinks calls NavTargetResolutionInternal correctly when no parameter is given", async function (assert) {
        // Arrange
        sandbox.stub(this.NavTargetResolutionInternal, "getLinks").returns(new jQuery.Deferred().resolve().promise());

        // Act
        await this.Navigation.getLinks([]);

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: undefined,
            paramsOptions: []
        }, "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("getLinks calls NavTargetResolutionInternal correctly when no parameter is given in object", async function (assert) {
        // Arrange
        sandbox.stub(this.NavTargetResolutionInternal, "getLinks").returns(new jQuery.Deferred().resolve().promise());

        // Act
        await this.Navigation.getLinks([{}]);

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: undefined,
            paramsOptions: []
        }, "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    [{
        testDescription: "paramsOptions provided from public API",
        aLinkFilter: [{
            paramsOptions: [
                { name: "A", options: { required: true } } // note: given from public API
            ],
            params: {
                A: ["vA"],
                B: ["vB"]
            }
        }],
        expectedNTRGetLinksCallArgs: [{
            action: undefined,
            compactIntents: false,
            params: {
                A: ["vA"],
                B: ["vB"]
            },
            paramsOptions: []
        }]
    }, {
        testDescription: "paramsOptions provided from public API is overridden when extended params syntax is used",
        aLinkFilter: [{
            paramsOptions: [
                { name: "B", options: { required: true } } // note: given from public API
            ],
            params: {
                A: { value: ["vA"], required: false },
                B: ["vB"]
            }
        }],
        expectedNTRGetLinksCallArgs: [{
            action: undefined,
            compactIntents: false,
            params: {
                A: ["vA"],
                B: ["vB"]
            },
            paramsOptions: [{
                name: "A", options: { required: false }
            }]
        }]
    }].forEach(function (oFixture) {
        QUnit.test("getLinks calls NavTargetResolutionInternal as expected when " + oFixture.testDescription, async function (assert) {
            // Arrange
            // simulate getSoL returns an uncompacted result
            sandbox.stub(this.NavTargetResolutionInternal, "getLinks").returns(new jQuery.Deferred().resolve().promise());

            // Act
            await this.Navigation.getLinks(oFixture.aLinkFilter);

            // Assert
            assert.deepEqual(this.NavTargetResolutionInternal.getLinks.args[0], oFixture.expectedNTRGetLinksCallArgs, "NavTargetResolutionInternal getLinks was called with the expected parameters");
        });
    });

    QUnit.test("getLinks calls NavTargetResolutionInternal correctly when withAtLeastOneUsedParam parameter is given", async function (assert) {
        // Arrange
        // simulate getSoL returns an uncompacted result
        sandbox.stub(this.NavTargetResolutionInternal, "getLinks").returns(new jQuery.Deferred().resolve().promise());

        // Act
        await this.Navigation.getLinks([{
            withAtLeastOneUsedParam: true,
            params: {
                A: ["vA"],
                B: ["vB"]
            }
        }]);

        // Arrange
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: {
                A: ["vA"],
                B: ["vB"]
            },
            paramsOptions: [],
            withAtLeastOneUsedParam: true
        }, "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("getLinks calls NavTargetResolutionInternal correctly when bCompactIntents parameter is set to true", async function (assert) {
        // Arrange
        var mParameters = {
            param1: "value1",
            param2: "value2",
            param3: "value3",
            param4: "value4"
        };
        var sAppState = "ANAPSTATE";

        // simulate getSoL returns an uncompacted result
        sandbox.stub(this.NavTargetResolutionInternal, "getLinks").returns(new jQuery.Deferred().resolve().promise());

        // Act
        await this.Navigation.getLinks([{
            semanticObject: "Action",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: {},
            appStateKey: sAppState,
            compactIntents: true
        }]);

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                param1: "value1",
                param2: "value2",
                param3: "value3",
                param4: "value4",
                "sap-xapp-state": ["ANAPSTATE"]
            },
            ignoreFormFactor: true,
            ui5Component: {},
            //appStateKey: sAppState,
            compactIntents: true,
            paramsOptions: [],
            action: undefined
        }, "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("getLinks multiple invoke", async function (assert) {
        // Arrange
        var mParameters = {
            A: "B",
            C: "e'e e"
        };
        var sAppState = "ANAPSTATE";
        var aObject = {};
        var cnt = 0;

        var oGetLinksStub = sandbox.stub(this.NavTargetResolutionInternal, "getLinks");
        oGetLinksStub.onCall(0).returns(new jQuery.Deferred().resolve(["A", "B"]).promise());
        oGetLinksStub.onCall(1).returns(new jQuery.Deferred().resolve(["C"]).promise());

        // Act
        const aResult = await this.Navigation.getLinks([{
            semanticObject: "SOx",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: aObject,
            appStateKey: sAppState
        }, {
            semanticObject: "SO"
        }]);

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.args[0], [{
            semanticObject: "SOx",
            params: {
                A: "B",
                C: "e'e e",
                "sap-xapp-state": ["ANAPSTATE"]
            },
            paramsOptions: [],
            ignoreFormFactor: true,
            ui5Component: aObject,
            //appStateKey: sAppState,
            compactIntents: false,
            action: undefined
        }], "parameters are ok (first call)");

        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.args[1], [{
            semanticObject: "SO",
            compactIntents: false,
            paramsOptions: [],
            params: undefined,
            action: undefined
        }], "parameters are ok (second call)");

        assert.deepEqual(aResult, [ // <- we have multiple results
            ["A", "B"], // result of first filter
            ["C"] // result of second filter
        ], "obtained expected result");
        cnt = 1;

        assert.ok(cnt === 1);
    });

    QUnit.test("isNavigationSupported", async function (assert) {
        // Arrange
        var aIntents = [/*content does not matter*/];
        var oSimulatedResult = {};

        sandbox.stub(this.NavTargetResolutionInternal, "isNavigationSupported").returns(new jQuery.Deferred().resolve(oSimulatedResult).promise());

        // Act
        const oResult = await this.Navigation.isNavigationSupported(aIntents);

        // Assert
        assert.ok(this.NavTargetResolutionInternal.isNavigationSupported.calledWithExactly(aIntents));
        assert.strictEqual(oResult, oSimulatedResult);
    });

    QUnit.test("isInitialNavigation: logs an error message and returns true if the shell navigation service is not available", async function (assert) {
        // simulate shell navigation service not available
        // Arrange
        var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
        oGetServiceAsyncStub.callThrough();
        oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves();

        sandbox.stub(Log, "debug");

        // Act
        const bResult = await this.Navigation.isInitialNavigation();

        // Assert
        var iCallCount = Log.debug.getCalls().length;
        assert.strictEqual(iCallCount, 1, "Log.debug was called 1 time");
        assert.deepEqual(Log.debug.getCall(0).args, [
            "ShellNavigationInternal service not available",
            "This will be treated as the initial navigation",
            "sap.ushell.services.Navigation"
        ], "logging function was called as expected");

        assert.strictEqual(bResult, true, "obtained expected result");
    });

    [
        { bResultFromShellNavigationInternal: true, expectedResult: true },
        { bResultFromShellNavigationInternal: false, expectedResult: false },
        { bResultFromShellNavigationInternal: undefined, expectedResult: true }
    ].forEach(function (oFixture) {
        QUnit.test("isInitialNavigation: returns result of ShellNavigationInternal@isInitialNavigation result:" + oFixture.bResultFromShellNavigationInternal, async function (assert) {
            // Arrange
            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            oGetServiceAsyncStub.callThrough();
            oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                isInitialNavigation: function () {
                    return oFixture.bResultFromShellNavigationInternal;
                }
            });

            // Act
            const bResult = await this.Navigation.isInitialNavigation();

            // Assert
            assert.strictEqual(bResult, oFixture.expectedResult, "obtained expected result");
        });
    });

    [{
        testDescription: "called with steps parameter of wrong type",
        stepsCount: "one",
        expectedNumberOfStepsArgument: -1
    }, {
        testDescription: "called with steps parameter of right type",
        stepsCount: 4,
        expectedNumberOfStepsArgument: -4
    }, {
        testDescription: "called without steps parameter",
        stepsCount: undefined,
        expectedNumberOfStepsArgument: -1
    }].forEach(function (oFixture) {
        QUnit.test("historyBack works as expected when " + oFixture.testDescription, function (assert) {
            var iSteps = oFixture.stepsCount;

            sandbox.stub(window.history, "go").returns({/*don't care*/ });

            this.Navigation.historyBack(iSteps);

            assert.strictEqual(
                window.history.go.callCount > 0,
                true,
                "called window.history.go"
            );
            assert.strictEqual(
                window.history.go.getCall(0).args[0],
                oFixture.expectedNumberOfStepsArgument,
                "called window.history.go with expected argument"
            );
        });
    });

    [{
        testDescription: "initial navigation occurred",
        bInitialNavigation: true,
        expectedHistoryBackCalled: false,
        expectedNavigateCalled: true,
        expectedNavigateCalledWith: [{
            target: { shellHash: "#" },
            writeHistory: false
        }]
    }, {
        testDescription: "initial navigation did not occur",
        bInitialNavigation: false,
        expectedHistoryBackCalled: true,
        expectedNavigateCalled: false
    }].forEach(function (oFixture) {
        QUnit.test("backToPreviousApp works as expected when " + oFixture.testDescription, async function (assert) {
            // Arrange
            sandbox.stub(window.history, "go").returns({/*don't care*/ });
            sandbox.stub(this.Navigation, "navigate").resolves();
            sandbox.stub(this.Navigation, "isInitialNavigation").resolves(
                oFixture.bInitialNavigation
            );

            // Act
            await this.Navigation.backToPreviousApp();

            // Assert
            assert.strictEqual(this.Navigation.navigate.called, oFixture.expectedNavigateCalled, "navigate was called");
            if (oFixture.expectedNavigateCalled) {
                assert.deepEqual(this.Navigation.navigate.getCall(0).args, oFixture.expectedNavigateCalledWith, "navigate was called with the expected arguments");
            }

            assert.strictEqual(
                window.history.go.callCount > 0,
                oFixture.expectedHistoryBackCalled,
                "historyBack was called"
            );
        });
    });

    [{
        testDescription: "sap-system is provided via component",
        sProvidedVia: "component"
    }, {
        testDescription: "sap-system is provided via getCurrentApplication in url",
        sProvidedVia: "getCurrentApplication"
    }, {
        testDescription: "sap-system is provided via getCurrentApplication in sap-system member",
        sProvidedVia: "getCurrentApplicationMember"
    }, {
        testDescription: "sap-system is provided via getCurrentApplication and component",
        sProvidedVia: "both"
    }].forEach(function (oFixture) {
        QUnit.test("sap-system added on navigation when " + oFixture.testDescription, async function (assert) {
            var oComponent = new UIComponent();

            sandbox.stub(this.ShellNavigationInternal, "hrefForExternal").returns({/*don't care*/ });
            sandbox.stub(this.ShellNavigationInternal, "toExternal").resolves({/*don't care*/ });
            sandbox.stub(this.NavTargetResolutionInternal, "isNavigationSupported").returns(new jQuery.Deferred().resolve().promise());

            if (oFixture.sProvidedVia === "component" ||
                oFixture.sProvidedVia === "both") {
                sandbox.stub(oComponent, "getComponentData").returns({
                    startupParameters: { "sap-system": ["CURRENT"] }
                });
            }

            if (oFixture.sProvidedVia === "getCurrentApplication" ||
                oFixture.sProvidedVia === "both") {
                sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
                    url: "/~/?sap-system=" + (oFixture.sProvidedVia === "both" ? "NOTRELEVANT" : "CURRENT")
                });
            }

            if (oFixture.sProvidedVia === "getCurrentApplicationMember") {
                sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
                    "sap-system": "CURRENT",
                    url: "/~/?sap-system=" + (oFixture.sProvidedVia === "both" ? "NOTRELEVANT" : "CURRENT")
                });
            }

            if (oFixture.sProvidedVia === "getCurrentApplication" || oFixture.sProvidedVia === "getCurrentApplicationMember") {
                oComponent = undefined;
            }

            const check = async (oArgs, oExpected) => {
                this.ShellNavigationInternal.hrefForExternal.resetHistory();

                await this.Navigation.getHref(deepClone(oArgs), oComponent);

                assert.deepEqual(this.ShellNavigationInternal.hrefForExternal.getCall(0).args[0], oExpected, "hrefForExternal: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));
                this.ShellNavigationInternal.toExternal.resetHistory();

                await this.Navigation.navigate(oArgs, oComponent);

                assert.deepEqual(this.ShellNavigationInternal.toExternal.getCall(0).args[0], oExpected, "toExternal: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));
                this.NavTargetResolutionInternal.isNavigationSupported.resetHistory();


                await this.Navigation.isNavigationSupported([oArgs], oComponent);

                assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], [oExpected],
                    "isNavigationSupported: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));
            };

            //shell navigation uses system of current app, other parameters unchanged
            await check({ target: {}, params: { foo: "bar" } }, { target: {}, params: { foo: "bar", "sap-system": "CURRENT" } });
            //shell navigation uses system of current app, target and no parameters
            await check({ target: {} }, { target: {}, params: { "sap-system": "CURRENT" } });
            //shell navigation uses system of current app, no overwrite of existing sap-system
            await check({ target: {}, params: { "sap-system": "OWNSYSTEM" } }, { target: {}, params: { "sap-system": "OWNSYSTEM" } });
            //oArgs contains shellHash with params
            await check({ target: { shellHash: "SO-36?jumper=postman" } }, { target: { shellHash: "SO-36?jumper=postman&sap-system=CURRENT" } });
            //oArgs contains shellHash without params
            await check({ target: { shellHash: "SO-36" } }, { target: { shellHash: "SO-36?sap-system=CURRENT" } });
            //oArgs contains shellHash with param sap-system
            await check({ target: { shellHash: "SO-36?sap-system=OWNSYSTEM" } }, { target: { shellHash: "SO-36?sap-system=OWNSYSTEM" } });
            await check({ target: { shellHash: "SO-36?asap-system=foo" } }, { target: { shellHash: "SO-36?asap-system=foo&sap-system=CURRENT" } });
            await check({ target: { shellHash: "SO-36?sap-system=" } }, { target: { shellHash: "SO-36?sap-system=" } });
            await check({ target: {}, params: { "sap-system": "" } }, { target: {}, params: { "sap-system": "" } });
            //no change if shell hash is no string, see ShellNavigationInternal.hrefForExternalNoEnc
            await check({ target: { shellHash: 42 } }, { target: { shellHash: 42 } });

            if (oFixture.sProvidedVia === "component" ||
                oFixture.sProvidedVia === "both") {
                oComponent.getComponentData.restore();
            }

            if (oFixture.sProvidedVia === "getCurrentApplication" ||
                oFixture.sProvidedVia === "getCurrentApplicationMember" ||
                oFixture.sProvidedVia === "both") {
                AppConfiguration.getCurrentApplication.restore();
            }

            // no change if current application URL has no sap-system parameter
            sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ url: "/~/" });

            //no change if shell hash is no string, see ShellNavigationInternal.hrefForExternalNoEnc
            await check({ target: { shellHash: "SO-act" } }, { target: { shellHash: "SO-act" } });
        });
    });

    [{
        description: "when internal query matches multiple links tagged with"
            + " [ \"primaryAction\" ], the first link based on "
            + "left-right-lexicographic order should be selected",
        mockGetLinks: {
            firstCallData: [[
                { intent: "#so-ccdd?A=B", tags: ["primaryAction"] },
                { intent: "#so-ccdd?A=B&C=D", tags: ["primaryAction"] },
                { intent: "#so-aa", tags: ["primaryAction"] },
                // !
                { intent: "#so-a0?a=B", tags: ["primaryAction"] },
                { intent: "#so-aa?A=B", tags: ["primaryAction"] },
                // !
                { intent: "#so-a0?A=b", tags: ["primaryAction"] },
                { intent: "#so-ab?A=B&C=e&C=j", tags: ["primaryAction"] }
            ]],
            firstCallExpectedInput: [
                [{
                    semanticObject: "so",
                    tags: ["primaryAction"]
                }]
            ]
        },
        input: {
            semanticObject: "so",
            linkFilter: {}
        },
        expectedSuperiorLink: {
            intent: "#so-a0?A=b",
            tags: ["primaryAction"]
        },
        message: "Link with intent \"#so-a0?A=b\" should be selected."
    }, {
        description: "when first internal query with "
            + "`tags = [ \"primaryAction\" ]` returns an empty list and a "
            + "second call without tags but with `action = \"displayFactSheet\"`"
            + " returns a non-empty list, the first link based on "
            + "left-right-lexicographic order should be selected",
        mockGetLinks: {
            firstCallData: [[]],
            firstCallExpectedInput: [
                [{
                    semanticObject: "so",
                    action: "displayFactSheet"
                }]
            ],
            secondCallData: [[
                { intent: "#so-displayFactSheet?A=aB" },
                { intent: "#so-displayFactSheet?A=a&C=D" },
                { intent: "#so-displayFactSheet?a=g" },
                { intent: "#so-displayFactSheet?a=B" },
                // !
                { intent: "#so-displayFactSheet?A=B" },
                { intent: "#so-displayFactSheet?A=b" },
                { intent: "#so-displayFactSheet?A=B&C=e&C=j" }
            ]],
            secondCallExpectedInput: [
                [{
                    semanticObject: "so",
                    action: "displayFactSheet"
                }]
            ]
        },
        input: {
            semanticObject: "so",
            linkFilter: {}
        },
        expectedSuperiorLink: {
            intent: "#so-displayFactSheet?A=B"
        },
        message: "Link with intent \"#so-displayFactSheet?A=B\" should be selected."
    }, {
        description: "when first and second internal queries for links "
            + "both return an empty list, null should be returned.",
        mockGetLinks: {
            firstCallData: [[]],
            firstCallExpectedInput: [
                [{
                    semanticObject: "so",
                    action: "displayFactSheet"
                }]
            ],
            secondCallData: [[]],
            secondCallExpectedInput: [
                [{
                    semanticObject: "so",
                    action: "displayFactSheet"
                }]
            ]
        },
        input: {
            semanticObject: "so",
            linkFilter: {}
        },
        expectedSuperiorLink: null,
        message: "No link, null is returned."
    }, {
        description: "when the linkFilter contains params.",
        mockGetLinks: {
            firstCallData: [[]],
            firstCallExpectedInput: [
                [{
                    semanticObject: "so",
                    action: "displayFactSheet",
                    params: {
                        A: ["B"]
                    }
                }]
            ],
            secondCallData: [[]],
            secondCallExpectedInput: [
                [{
                    semanticObject: "so",
                    action: "displayFactSheet",
                    params: {
                        A: ["B"]
                    }
                }]
            ]
        },
        input: {
            semanticObject: "so",
            linkFilter: {
                params: {
                    A: ["B"]
                }
            }
        },
        expectedSuperiorLink: null,
        message: "No link, null is returned."
    }].forEach(function (oFixture) {
        QUnit.test("#getPrimaryIntent: " + oFixture.description, async function (assert) {
            // Arrange
            var fnGetLinks = sandbox.stub(this.Navigation, "getLinks");
            fnGetLinks.onCall(0).resolves(oFixture.mockGetLinks.firstCallData);

            if (oFixture.mockGetLinks.secondCallData) {
                fnGetLinks.onCall(1).resolves(oFixture.mockGetLinks.secondCallData);
            }

            // Act
            const oActualSuperiorLink = await this.Navigation.getPrimaryIntent(oFixture.input.semanticObject, oFixture.input.linkFilter);

            // Assert
            assert.deepEqual(
                oActualSuperiorLink,
                oFixture.expectedSuperiorLink,
                oFixture.message
            );

            if (oFixture.mockGetLinks.secondCallData) {
                assert.ok(fnGetLinks.calledTwice, "Navigation#getLinks is called twice");
                assert.deepEqual(fnGetLinks.getCall(0).args, oFixture.mockGetLinks.firstCallExpectedInput, "Navigation#getLinks is called correctly the first time");
                assert.deepEqual(fnGetLinks.getCall(1).args, oFixture.mockGetLinks.secondCallExpectedInput, "Navigation#getLinks is called correctly the second time");
            } else {
                assert.ok(fnGetLinks.calledOnce, "Navigation#getLinks is called once");
                assert.deepEqual(fnGetLinks.getCall(0).args, oFixture.mockGetLinks.firstCallExpectedInput, "Navigation#getLinks is called correctly the first time");
            }
        });
    });

    QUnit.module("sap.ushell.services.Navigation - Part 2", {
        beforeEach: async function (assert) {
            try {
                delete localStorage["sap-ushell-enc-test"];
            } catch (e) { /* nop */ }
            ObjectPath.create("sap-ushell-config.services.Navigation.config")["sap-ushell-enc-test"] = true;

            this.oErrorStub = sandbox.stub(Log, "error");

            await Container.init("local");
            const aServices = await Promise.all([
                Container.getServiceAsync("Navigation"),
                Container.getServiceAsync("ShellNavigationInternal"),
                Container.getServiceAsync("AppLifeCycle")
            ]);
            this.Navigation = aServices[0];
            this.ShellNavigationInternal = aServices[1];
            this.AppLifeCycle = aServices[2];
        },
        afterEach: function () {
            Container.reset();
            delete window["sap-ushell-config"].services.Navigation.config["sap-ushell-enc-test"];
            testUtils.restoreSpies(
                Component.create,
                AppConfiguration.getCurrentApplication
            );
            sandbox.restore();
        }
    });

    QUnit.test("Test that sap-ushell-enc-test is added to URL in URL generating functions getHref, getLinks", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        // Act #1
        const oResult = await this.Navigation.getHref({ target: { shellHash: "#SO-action?a=b" } }, oComponent);
        // Assert #1
        assert.ok(oResult.indexOf("sap-ushell-enc-test=A%2520B%252520C") >= 0, " parameter added");

        // Act #2
        const [aResult2] = await this.Navigation.getLinks([{ semanticObject: "Action", params: {}, ui5Component: oComponent }]);
        // Assert #2
        assert.ok(aResult2.length > 0, "at least one link");
        aResult2.forEach(function (oLink) {
            assert.ok(oLink.intent.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, "parameter added");
        });
    });

    QUnit.test("Test that sap-ushell-enc-test is not added to the url for special shellHash #", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        // Act #1
        const oResult = await this.Navigation.getHref({ target: { shellHash: "#" } }, oComponent);

        // Assert #1
        assert.equal(oResult, "#", "parameter not added!");
        assert.ok(oResult.indexOf("sap-ushell-enc-test=A%2520B%252520C") === -1, " parameter added");

        // Act #2
        const oResult2 = await this.Navigation.getHref({ target: { shellHash: "" } }, oComponent);

        // Assert #2
        assert.equal(oResult2, "#", "parameter not added!");
        assert.ok(oResult2.indexOf("sap-ushell-enc-test=A%2520B%252520C") === -1, " parameter added");
    });

    QUnit.test("Test that sap-ushell-enc-test is added to URL in URL generating functions getHref, getLinks with parameters", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        // Act #1
        const oResult = await this.Navigation.getHref({
            target: { semanticObject: "SO", action: "action" },
            params: { A: ["b"], "sap-ushell-enc-test": "this shall not stand" }
        }, oComponent);

        // Assert #1
        assert.equal(oResult, "#SO-action?A=b&sap-ushell-enc-test=A%2520B%252520C", " parameter added");

        // Act #2
        const [aResult2] = await this.Navigation.getLinks([{ semanticObject: "Action", params: {}, ui5Component: oComponent }]);

        // Assert #2
        assert.ok(aResult2.length > 0, "at least one link");
        aResult2.forEach(function (oLink) {
            assert.ok(oLink.intent.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, "parameter added");
        });
    });

    [{
        testDescription: "string type, params, no inner app route",
        vIntent: "Action-toappnavsample?a=b&c=d",
        expectedResult: {
            intent: "Action-toappnavsample?a=b&c=d",
            innerAppRoute: "" // no inner app route given
        }
    }, {
        testDescription: "object type, params, no inner app route",
        vIntent: {
            semanticObject: "Action",
            action: "toappnavsample",
            params: { a: "b", c: "d" }
        },
        expectedResult: {
            intent: {
                semanticObject: "Action",
                action: "toappnavsample",
                params: { a: "b", c: "d" }
            },
            innerAppRoute: "" // no inner app route given
        }
    }, {
        testDescription: "object type, params, empty inner app route",
        vIntent: {
            semanticObject: "Action",
            action: "toappnavsample",
            params: { a: "b", c: "d" },
            appSpecificRoute: ""
        },
        expectedResult: {
            innerAppRoute: "", // empty given, empty returned
            intent: {
                semanticObject: "Action",
                action: "toappnavsample",
                params: { a: "b", c: "d" }
            }
        }
    }, {
        testDescription: "object type, params, app route starting without &/",
        vIntent: {
            semanticObject: "Action",
            action: "toappnavsample",
            params: { a: "b", c: "d" },
            appSpecificRoute: "inner/app/route"
        },
        expectedResult: {
            innerAppRoute: "&/inner/app/route", // '&/' is added
            intent: {
                semanticObject: "Action",
                action: "toappnavsample",
                params: { a: "b", c: "d" }
            }
        }
    }, {
        testDescription: "object type with no inner app route in shellHash",
        vIntent: {
            target: {
                shellHash: "Action-toappnavsample?a=b&c=d"
            }
        },
        expectedResult: {
            innerAppRoute: "",
            intent: {
                target: { shellHash: "Action-toappnavsample?a=b&c=d" }
            }
        }
    }, {
        testDescription: "object type with no intent parameters and '&/' as inner app route",
        vIntent: {
            target: {
                shellHash: "Action-toappnavsample&/"
            }
        },
        expectedResult: {
            innerAppRoute: "&/", // separator is actually part of inner-app route
            intent: {
                target: { shellHash: "Action-toappnavsample" }
            }
        }
    }, {
        testDescription: "object type with inner app route in shellHash",
        vIntent: {
            target: {
                shellHash: "Action-toappnavsample?a=b&c=d&/Some/inner/app/route"
            }
        },
        expectedResult: {
            innerAppRoute: "&/Some/inner/app/route",
            intent: {
                target: { shellHash: "Action-toappnavsample?a=b&c=d" }
            }
        }
    }, {
        testDescription: "string type with inner app route",
        vIntent: "Action-toappnavsample?a=b&c=d&/Some/inner/app/route",
        expectedResult: {
            innerAppRoute: "&/Some/inner/app/route",
            intent: "Action-toappnavsample?a=b&c=d"
        }
    }, {
        testDescription: "object type, params, with inner app route",
        vIntent: {
            semanticObject: "Action",
            action: "toappnavsample",
            params: { a: "b", c: "d" },
            appSpecificRoute: { any: "input" }
        },
        expectedResult: {
            innerAppRoute: { any: "input" }, // leave value untouched
            intent: {
                semanticObject: "Action",
                action: "toappnavsample",
                params: { a: "b", c: "d" }
            }
        }
    }, {
        testDescription: "strange object as input",
        vIntent: {
            a: { b: "c" }
        },
        expectedResult: {
            innerAppRoute: "", // none could be extracted found
            intent: { // leave untouched
                a: { b: "c" }
            }
        }
    }, {
        testDescription: "inner app route containing multiple separators",
        vIntent: "Action-toappnavsample?a=b&c=d&/Some/inner&/app/route",
        expectedResult: {
            intent: "Action-toappnavsample?a=b&c=d",
            innerAppRoute: "&/Some/inner&/app/route"
        }
    }].forEach(function (oFixture) {
        QUnit.test("_extractInnerAppRoute: removes inner app route from the given target as expected when " + oFixture.testDescription, function (assert) {
            // Act
            var oResult = this.Navigation._extractInnerAppRoute(oFixture.vIntent);

            // Assert
            assert.deepEqual(oResult, oFixture.expectedResult, "method returned the expected result");

            if (isPlainObject(oFixture.vIntent)) {
                assert.strictEqual(oFixture.vIntent, oResult.intent, "the .target member is the same as the one given as input");
            }

            assert.strictEqual(this.oErrorStub.callCount, 0, "Log.error was not called");
        });
    });

    [{
        testDescription: "x-app-state is passed",
        oCallArgs: {
            target: {
                semanticObject: "Object",
                action: "action"
            },
            params: {
                "sap-xapp-state": JSON.stringify({
                    a: "123"
                })
            }
        },
        expectAppStateGenerated: false,
        expectedFirstCallArg: {
            target: {
                semanticObject: "Object",
                action: "action"
            },
            params: {
                "sap-xapp-state": JSON.stringify({
                    a: "123"
                }),
                "sap-ushell-enc-test": ["A B%20C"]
            }
        }
    }, {
        testDescription: "x-app-state-data is passed",
        oCallArgs: {
            target: {
                semanticObject: "Object",
                action: "action"
            },
            params: {
                "sap-xapp-state-data": JSON.stringify({
                    a: "123"
                }),
                "sap-ushell-enc-test": ["A B%20C"]
            }
        },
        expectAppStateGenerated: true,
        expectedFirstCallArg: {
            target: {
                semanticObject: "Object",
                action: "action"
            },
            params: {
                "sap-xapp-state": "APP_STATE_KEY",
                "sap-ushell-enc-test": ["A B%20C"]
            }
        }
    }, {
        testDescription: "x-app-state-data is not passed",
        oCallArgs: {
            target: {
                semanticObject: "Object",
                action: "action"
            },
            params: {
                A: ["1"]
            }
        },
        expectAppStateGenerated: false,
        expectedFirstCallArg: {
            target: {
                semanticObject: "Object",
                action: "action"
            },
            params: {
                A: ["1"],
                "sap-ushell-enc-test": ["A B%20C"]
            }
        }
    }, {
        testDescription: "sap x-app-state-data and sap-xapp-state are both passed",
        oCallArgs: {
            target: {
                semanticObject: "Object",
                action: "action"
            },
            params: {
                A: ["1"],
                "sap-xapp-state": "ABCDE",
                "sap-xapp-state-data": JSON.stringify({ a: "b", c: "d" }),
                "sap-ushell-enc-test": ["A B%20C"]
            }
        },
        expectAppStateGenerated: true,
        expectedFirstCallArg: {
            target: {
                semanticObject: "Object",
                action: "action"
            },
            params: {
                A: ["1"],
                "sap-xapp-state": "APP_STATE_KEY",
                "sap-ushell-enc-test": ["A B%20C"]
            }
        }
    }, {
        testDescription: "sap x-app-state-data passed in a string URL",
        oCallArgs: {
            target: {
                shellHash: UrlParsing.constructShellHash({
                    semanticObject: "A",
                    action: "b",
                    params: { "sap-xapp-state-data": JSON.stringify({ p1: "v1", p2: "v2" }) }
                })
            }
        },
        expectAppStateGenerated: true,
        expectedFirstCallArg: {
            target: {
                shellHash: "A-b?sap-xapp-state=APP_STATE_KEY&sap-ushell-enc-test=A%20B%2520C"
            }
        }
    }, {
        testDescription: "badly encoded sap x-app-state-data passed in a string URL",
        oCallArgs: {
            target: {
                shellHash: UrlParsing.constructShellHash({
                    semanticObject: "A",
                    action: "b",
                    params: { "sap-xapp-state-data": "{p1:v1, p2:v2}" }
                })
            }
        },
        expectAppStateGenerated: false,
        expectedFirstCallArg: {
            target: {
                shellHash: "A-b?sap-ushell-enc-test=A%20B%2520C"
            }
        },
        expectedErrorCall: [
            "Cannot parse the given string to object",
            "{p1:v1, p2:v2}"
        ]
    }].forEach(function (oFixture) {
        QUnit.test("navigate: calls ShellNavigationInternal with the expected arguments when " + oFixture.testDescription, async function (assert) {
            // Arrange
            var oComponent = {
                getComponentData: sandbox.stub().returns({
                    startupParameters: {}
                })
            };

            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            var oFakeAppState = {
                setData: sandbox.stub(),
                save: sandbox.stub(),
                getKey: sandbox.stub().returns("APP_STATE_KEY")
            };

            var oAppStateServiceMock = {
                createEmptyAppState: sandbox.stub().returns(oFakeAppState)
            };
            oGetServiceAsyncStub.withArgs("AppState").resolves(oAppStateServiceMock);

            var oToExternalStub = sandbox.stub().resolves();
            oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                toExternal: oToExternalStub
            });

            oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves(this.AppLifeCycle);

            // Act
            await this.Navigation.navigate(oFixture.oCallArgs, oComponent, false /* bAsync */);

            // Assert
            assert.strictEqual(oToExternalStub.callCount, 1, "toExternal was called once");
            var oToExternalFirstArg = oToExternalStub.getCall(0).args[0];
            assert.deepEqual(oToExternalFirstArg, oFixture.expectedFirstCallArg, "ShellNavigationInternal was called with the expected first argument");

            var iErrorCallCount = oFixture.expectedErrorCall ? 1 : 0;
            assert.strictEqual(this.oErrorStub.callCount, iErrorCallCount, "Log.error was called as expected");
            if (oFixture.expectedErrorCall) {
                assert.deepEqual(this.oErrorStub.getCall(0).args, oFixture.expectedErrorCall, "Log.error was called with the expected arguments");
            }

            var iExpectedCallCount = oFixture.expectAppStateGenerated ? 1 : 0;
            assert.strictEqual(oFakeAppState.save.callCount, iExpectedCallCount, "AppState#save method was called as expected");
        });

        QUnit.test("getHref: calls ShellNavigationInternal with the expected arguments when " + oFixture.testDescription, async function (assert) {
            // Arrange
            var oComponent = {
                getComponentData: sandbox.stub().returns({
                    startupParameters: {}
                })
            };

            var oFakeAppState = {
                setData: sandbox.stub(),
                save: sandbox.stub(),
                getKey: sandbox.stub().returns("APP_STATE_KEY")
            };

            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            var oHrefForExternalStub = sandbox.stub().resolves();
            oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                hrefForExternal: oHrefForExternalStub
            });
            oGetServiceAsyncStub.withArgs("AppState").resolves({
                createEmptyAppState: sandbox.stub().returns(oFakeAppState)
            });
            oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves({
                getCurrentApplication: sandbox.stub()
            });

            // Act
            await this.Navigation.getHref(oFixture.oCallArgs, oComponent);

            // Assert
            assert.strictEqual(oHrefForExternalStub.callCount, 1, "hrefForExternal was called once");
            var oHrefForExternalFirstArg = oHrefForExternalStub.getCall(0).args[0];
            assert.deepEqual(oHrefForExternalFirstArg, oFixture.expectedFirstCallArg, "ShellNavigationInternal was called with the expected first argument");

            var iExpectedCallCount = oFixture.expectAppStateGenerated ? 1 : 0;
            assert.strictEqual(oFakeAppState.save.callCount, iExpectedCallCount, "AppState#save method was called as expected");
        });
    });

    QUnit.test("_extractInnerAppRoute: logs an error when invalid parameter type is given", function (assert) {
        // Act
        var oResult = this.Navigation._extractInnerAppRoute(12345);

        // Assert
        assert.strictEqual(this.oErrorStub.callCount, 1, "Log.error was called 1 time");

        assert.deepEqual(this.oErrorStub.getCall(0).args, [
            "Invalid input parameter",
            "expected string or object",
            "sap.ushell.services.Navigation"
        ], "Log.error was called with the expected parameters");

        assert.deepEqual(oResult, { intent: 12345 }, "method returned the expected result");
    });

    [{
        testDescription: "a string intent is given",
        vIntent: "Object-action",
        sInnerAppRoute: "&/inner/app/route",
        expectedResult: "Object-action&/inner/app/route"
    }, {
        testDescription: "an object intent with target shell hash is given",
        vIntent: { target: { shellHash: "Object-action" } },
        sInnerAppRoute: "&/inner/app/route",
        expectedResult: { target: { shellHash: "Object-action&/inner/app/route" } }
    }, {
        testDescription: "an object intent without target shell hash is given",
        vIntent: { strange: "object" },
        sInnerAppRoute: "&/inner/app/route",
        expectedResult: { strange: "object", appSpecificRoute: "&/inner/app/route" }
    }, {
        testDescription: "null inner app route is given together with an object intent",
        vIntent: { strange: "object" },
        sInnerAppRoute: null,
        expectedResult: { strange: "object" }
    }, {
        testDescription: "undefined inner app route is given together with an object intent",
        vIntent: { strange: "object" },
        sInnerAppRoute: undefined,
        expectedResult: { strange: "object" }
    }, {
        testDescription: "empty inner app route is given together with an object intent",
        vIntent: "Object-action",
        sInnerAppRoute: "",
        expectedResult: "Object-action"
    }, {
        testDescription: "only separator is given as inner app route together with a string intent",
        vIntent: "Object-action",
        sInnerAppRoute: "&/",
        expectedResult: "Object-action&/"
    }, {
        testDescription: "null intent is given with inner app route",
        vIntent: null,
        sInnerAppRoute: "&/inner/app/route",
        expectedResult: null
    }, {
        testDescription: "unsupported input intent parameter is given",
        vIntent: 12345,
        sInnerAppRoute: "&/inner/app/route",
        expectedResult: 12345
    }].forEach(function (oFixture) {
        QUnit.test("_injectInnerAppRoute: injects the given app route when " + oFixture.testDescription, function (assert) {
            // Act
            var vResult = this.Navigation._injectInnerAppRoute(oFixture.vIntent, oFixture.sInnerAppRoute);

            // Assert
            assert.deepEqual(vResult, oFixture.expectedResult, "method returned the expected result");

            if (isPlainObject(oFixture.vIntent)) {
                assert.strictEqual(oFixture.vIntent, vResult, "the returned result is actually the input object");
            }

            assert.strictEqual(this.oErrorStub.callCount, 0, "Log.error was not called");
        });
    });

    [{
        testDescription: "no inner app route given",
        oInputArgs: { target: { shellHash: "Object-action?p1=v1" } },
        expectedHref: "#Object-action?p1=v1&sap-system=XXX&sap-ushell-navmode=thenavmode&sap-app-origin-hint=ABC"
    }, {
        testDescription: "inner app route given",
        oInputArgs: { target: { shellHash: "Object-action?p1=v1&/inner/app/route" } },
        expectedHref: "#Object-action?p1=v1&sap-system=XXX&sap-ushell-navmode=thenavmode&sap-app-origin-hint=ABC&/inner/app/route"
    }].forEach(function (oFixture) {
        QUnit.test("getHref: appends sap-ushell-enc, sap-ushell-navmode and sap-app-origin-hint before inner app route when " + oFixture.testDescription, async function (assert) {
            // Arrange
            sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
                "sap-system": "XXX",
                url: "http://www.example.com?sap-system=YYY",
                "sap-ushell-next-navmode": "thenavmode",
                contentProviderId: "ABC"
            });

            // Act
            const sHref = await this.Navigation.getHref(
                oFixture.oInputArgs,
                null /* oComponent, null: use data from getCurrentApplication */
            );

            // Assert
            assert.strictEqual(sHref, oFixture.expectedHref, "obtained the expected link");
        });
    });

    [{
        testDescription: "no inner app route given",
        oInputArgs: { target: { shellHash: "Object-action?p1=v1" } },
        expectedHref: "#Object-action?p1=v1&sap-system=XXX&sap-ushell-navmode=thenavmode&sap-app-origin-hint="
    }, {
        testDescription: "inner app route given",
        oInputArgs: { target: { shellHash: "Object-action?p1=v1&/inner/app/route" } },
        expectedHref: "#Object-action?p1=v1&sap-system=XXX&sap-ushell-navmode=thenavmode&sap-app-origin-hint=&/inner/app/route"
    }].forEach(function (oFixture) {
        QUnit.test(`getHref: appends sap-ushell-enc, sap-ushell-navmode and sap-app-origin-hint (empty string) before inner app route when ${oFixture.testDescription}`, async function (assert) {
            // Arrange
            sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
                "sap-system": "XXX",
                url: "http://www.example.com?sap-system=YYY",
                "sap-ushell-next-navmode": "thenavmode",
                contentProviderId: ""
            });

            // Act
            const sHref = await this.Navigation.getHref(
                oFixture.oInputArgs,
                null /* oComponent, null: use data from getCurrentApplication */
            );

            // Assert
            assert.strictEqual(sHref, oFixture.expectedHref, "obtained the expected link");
        });
    });

    QUnit.test("navigate: calls ShellNavigationInternal.toExternal as expected when writeHistory argument is passed in", async function (assert) {
        // Arrange
        var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

        var oToExternalStub = sandbox.stub().resolves();
        oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
            toExternal: oToExternalStub
        });
        oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves(this.AppLifeCycle);
        sandbox.stub(AppConfiguration, "getCurrentApplication");

        // Act
        await this.Navigation.navigate({
            target: { shellHash: "#What-ever" },
            writeHistory: true
        });

        // Assert
        assert.strictEqual(oToExternalStub.callCount, 1, "toExternal was called 1 time");
        assert.strictEqual(oToExternalStub.getCall(0).args.length, 3, "toExternal was called with 3 arguments");
        assert.strictEqual(oToExternalStub.getCall(0).args[2], true, "the 3rd argument is as expected");
    });

    QUnit.test("navigate: adds sap-ushell-enc-test to URL", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();
        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");

        // Act
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b" } }, oComponent);

        // Assert
        var oRes = oPrivsetHashStub.args[0][0];
        assert.ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, " parameter added");
        oPrivsetHashStub.restore();
    });

    QUnit.test("navigate: adds sap-ushell-enc-test to URL with inner app route", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();
        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");

        // Act
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b&/inner/app/route" } }, oComponent);

        // Assert
        var sSetHash = oPrivsetHashStub.args[0][0];
        assert.ok(sSetHash.indexOf("a=b") >= 0, "a=b parameter is present in the url");
        assert.ok(sSetHash.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, " parameter added");
        assert.strictEqual(!!sSetHash.match(/&[/]inner[/]app[/]route$/), true, "the url that was set after navigate ends with inner app route");

        oPrivsetHashStub.restore();
    });

    QUnit.test("sap-ushell-enc-test can be disabled via local storage setting", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();
        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");

        // Act #1
        localStorage["sap-ushell-enc-test"] = "false";
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b" } }, oComponent);
        // Assert #1
        let oRes = oPrivsetHashStub.args[0][0];
        assert.ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") === -1, " parameter not added, disabled via localStorage");

        // Act #2
        localStorage["sap-ushell-enc-test"] = "true";
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b" } }, oComponent);
        // Assert #2
        oRes = oPrivsetHashStub.args[1][0];
        assert.ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, " parameter added, enabled via localStorage");

        // Act #3
        if (localStorage) {
            delete localStorage["sap-ushell-enc-test"];
        }
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b" } }, oComponent);

        // Assert #3
        oRes = oPrivsetHashStub.args[2][0];
        assert.ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, " parameter added, enabled via config");
        oPrivsetHashStub.restore();
    });

    QUnit.test("navigate: sets restart flag, if UI5 application is not changed, the app specific route is empty and all the intent parameters remain unchanged", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");
        var oSetReloadApplicationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "setReloadApplication");
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({
            applicationType: "UI5",
            componentInstance: {
                getComponentData: sandbox.stub().returns({})
            },
            getIntent: sandbox.stub().resolves({
                semanticObject: "SO",
                action: "action",
                params: {
                    a: ["b"]
                }
            })
        });

        // Act
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b" } }, oComponent);

        // Assert
        assert.strictEqual(oSetReloadApplicationStub.callCount, 1, "SetReloadApplication called once.");
        assert.strictEqual(oSetReloadApplicationStub.args[0][0], true, "reload application flag set to true.");
        assert.strictEqual(oPrivsetHashStub.callCount, 1, "Navigation was successful.");
    });

    QUnit.test("navigate: does not set restart flag, if UI5 application is not changed, the app specific route is empty and the intent parameters are changed", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");
        var oSetReloadApplicationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "setReloadApplication");
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({
            applicationType: "UI5",
            componentInstance: {
                getComponentData: sandbox.stub().returns({})
            },
            getIntent: sandbox.stub().resolves({
                semanticObject: "SO",
                action: "action",
                params: {
                    a: ["c"]
                }
            })
        });

        // Act
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b" } }, oComponent);

        // Assert
        assert.strictEqual(oSetReloadApplicationStub.callCount, 0, "SetReloadApplication was not called.");
        assert.strictEqual(oPrivsetHashStub.callCount, 1, "Navigation was successful.");
    });

    QUnit.test("navigate: does not set restart flag, if UI5 application is changed", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");
        var oSetReloadApplicationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "setReloadApplication");
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({
            applicationType: "UI5",
            componentInstance: {
                getComponentData: sandbox.stub().returns({})
            },
            getIntent: sandbox.stub().resolves({
                semanticObject: "SO",
                action: "action2",
                params: {
                    a: ["b"]
                }
            })
        });

        // Act
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b" } }, oComponent);

        // Assert
        assert.strictEqual(oSetReloadApplicationStub.callCount, 0, "SetReloadApplication was not called.");
        assert.strictEqual(oPrivsetHashStub.callCount, 1, "Navigation was successful.");
    });

    QUnit.test("navigate: does not set restart flag, if UI5 app is not changed and all the intent parameters remain unchanged, but the app specific route is not empty ", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");
        var oSetReloadApplicationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "setReloadApplication");
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({
            applicationType: "UI5",
            componentInstance: {
                getComponentData: sandbox.stub().returns({})
            },
            getIntent: sandbox.stub().resolves({
                semanticObject: "SO",
                action: "action",
                params: {
                    a: ["b"]
                }
            })
        });

        // Act
        await this.Navigation.navigate({ target: { shellHash: "#SO-action?a=b&/view2" } }, oComponent);

        // Assert
        assert.strictEqual(oSetReloadApplicationStub.callCount, 0, "SetReloadApplication was not called.");
        assert.strictEqual(oPrivsetHashStub.callCount, 1, "Navigation was successful.");
    });

    QUnit.test("navigate: does not set restart flag, if only '#' is provided -> homepage navigation ", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");
        var oSetReloadApplicationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "setReloadApplication");
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({
            applicationType: "UI5",
            componentInstance: {
                getComponentData: sandbox.stub().returns({})
            },
            getIntent: sandbox.stub().resolves({
                semanticObject: "SO",
                action: "action",
                params: {
                    a: ["b"]
                }
            })
        });

        // Act
        await this.Navigation.navigate({ target: { shellHash: "#" } }, oComponent);

        // Assert
        assert.strictEqual(oSetReloadApplicationStub.callCount, 0, "SetReloadApplication was not called.");
        assert.strictEqual(oPrivsetHashStub.callCount, 1, "Navigation was successful.");
    });

    QUnit.test("navigate: sets restart flag, if UI5 application is not changed, the app specific route is empty"
        + " and all the intent parameters remain unchanged, but are given different format", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");
        var oSetReloadApplicationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "setReloadApplication");
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({
            applicationType: "UI5",
            componentInstance: {
                getComponentData: sandbox.stub().returns({})
            },
            getIntent: sandbox.stub().resolves({
                semanticObject: "SO",
                action: "action",
                params: {
                    a: ["2"],
                    b: ["test", "4"]
                }
            })
        });

        // Act
        await this.Navigation.navigate({
            target: {
                semanticObject: "SO",
                action: "action"
            },
            params: {
                a: 2,
                b: ["test", 4]
            }
        }, oComponent);

        // Assert
        assert.strictEqual(oSetReloadApplicationStub.callCount, 1, "SetReloadApplication called once.");
        assert.strictEqual(oSetReloadApplicationStub.args[0][0], true, "reload application flag set to true.");
        assert.strictEqual(oPrivsetHashStub.callCount, 1, "Navigation was successful.");
    });

    QUnit.test("navigate: does not set restart flag, if UI5 application is not changed, the app specific route is empty"
        + " and all the intent parameters remain unchanged, but are given different order", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");
        var oSetReloadApplicationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "setReloadApplication");
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({
            applicationType: "UI5",
            componentInstance: {
                getComponentData: sandbox.stub().returns({})
            },
            getIntent: sandbox.stub().resolves({
                semanticObject: "SO",
                action: "action",
                params: {
                    a: ["A very long string with a few spaces that might cause issues, so this is tested here"],
                    b: ["test", "true"]
                }
            })
        });

        // Act
        await this.Navigation.navigate({
            target: {
                semanticObject: "SO",
                action: "action"
            },
            params: {
                a: "A very long string with a few spaces that might cause issues, so this is tested here",
                b: [true, "test"] // different order!
            }
        }, oComponent).then(function () {
            // Assert
            assert.strictEqual(oSetReloadApplicationStub.callCount, 0, "SetReloadApplication was not called.");
            assert.strictEqual(oPrivsetHashStub.callCount, 1, "Navigation was successful.");
        });
    });

    QUnit.test("navigate: sets restart flag, if UI5 application is not changed, the app specific route is empty"
        + " and no parameters are used", async function (assert) {
        // Arrange
        var oComponent = new UIComponent();

        var oPrivsetHashStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "privsetHash");
        var oSetReloadApplicationStub = sandbox.stub(this.ShellNavigationInternal.hashChanger, "setReloadApplication");
        sandbox.stub(this.AppLifeCycle, "getCurrentApplication").returns({
            applicationType: "UI5",
            componentInstance: {
                getComponentData: sandbox.stub().returns({})
            },
            getIntent: sandbox.stub().resolves({
                semanticObject: "SO",
                action: "action"
            })
        });

        // Act
        await this.Navigation.navigate({
            target: {
                semanticObject: "SO",
                action: "action"
            }
        }, oComponent);

        // Assert
        assert.strictEqual(oSetReloadApplicationStub.callCount, 1, "SetReloadApplication was called.");
        assert.strictEqual(oPrivsetHashStub.callCount, 1, "Navigation was successful.");
    });

    QUnit.test("navigate: logs error if ShellNavigationInternal.toExternal throws", async function (assert) {
        // Arrange
        var oComponent = {
            getComponentData: sandbox.stub().returns({
                startupParameters: {}
            })
        };

        var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
        var oExpectedError = new Error("Failure in ShellNavigationInternal.toExternal");
        var oToExternalStub = sandbox.stub().rejects(oExpectedError);
        oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
            toExternal: oToExternalStub
        });

        oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves(this.AppLifeCycle);

        // Act
        await this.Navigation.navigate({
            target: {
                semanticObject: "SO",
                action: "action"
            }
        }, oComponent);

        // Assert
        assert.strictEqual(this.oErrorStub.callCount, 1, "Log.error was called as expected");
        assert.deepEqual(this.oErrorStub.getCall(0).args, [
            "Navigation.navigate failed",
            oExpectedError,
            "sap.ushell.services.Navigation"
        ], "Log.error was called with the expected arguments");
    });

    // ------------------- App state tests -------------------
    QUnit.module("sap.ushell.services.Navigation - App state", {
        beforeEach: async function (assert) {
            window["sap-ushell-config"] = {
                services: {
                    AppState: {
                        adapter: {
                            module: "sap.ushell.adapters.local.AppStateAdapter" // re-use adapter from local platform
                        }
                    }
                }
            };
            await Container.init("local");
            const aServices = await Promise.all([
                Container.getServiceAsync("Navigation"),
                Container.getServiceAsync("AppState")
            ]);
            this.Navigation = aServices[0];
            this.AppState = aServices[1];
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Execute operations on app state", async function (assert) {
        // Arrange
        const oAppComponent = new UIComponent();
        const oItemValue = {
            one: "one!",
            two: "two?"
        };
        // Act
        const oAppState = await this.Navigation.createEmptyAppState(oAppComponent);
        oAppState.setData(oItemValue);

        // Assert
        assert.deepEqual(oAppState.getData(), oItemValue, "Success: app state can store object values");
        assert.ok(oItemValue !== oAppState.getData(), "not object returned");
    });

    QUnit.test("getStartupAppState", async function (assert) {
        // Arrange
        var oAppComponent = new UIComponent();
        oAppComponent.getComponentData = sandbox.stub().returns({ "sap-xapp-state": ["AKEY"] });
        var oGetContainerSpy = sandbox.spy(this.AppState, "getAppState");

        // Act
        const oAppState = await this.Navigation.getStartupAppState(oAppComponent);

        // Assert
        assert.ok(oAppState, "Success: app state object was returned");
        assert.ok(typeof oAppState.getData === "function", "Success: app state has method getData");
        assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");

        assert.equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        assert.equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
    });

    QUnit.test("getStartupAppState no state present", async function (assert) {
        // Arrange
        var oAppComponent = new UIComponent();
        oAppComponent.getComponentData = sandbox.stub().returns({ "sap-xapp-state": undefined });

        // Act
        const oAppState = await this.Navigation.getStartupAppState(oAppComponent);

        // Assert
        assert.ok(oAppState, "Success: app state object was returned");
        assert.ok(typeof oAppState.getData === "function", "Success: app state has method getData");
        assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
    });

    QUnit.test("getAppState", async function (assert) {
        // Arrange
        var oAppComponent = new UIComponent();
        oAppComponent.getComponentData = sandbox.stub().returns({ "sap-xapp-state": ["AKEY"] });
        var oGetContainerSpy = sandbox.spy(this.AppState, "getAppState");

        // Act
        const oAppState = await this.Navigation.getAppState(oAppComponent, "AKEY");

        // Assert
        assert.ok(oAppState, "Success: app state object was returned");
        assert.ok(typeof oAppState.getData === "function", "Success: app state has method getData");
        assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");

        assert.equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        assert.equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
    });

    [
        { description: "bad key type ", oComponent: "<comp>", sKey: 13, errorlog: true },
        { description: "bad key ", oComponent: "<comp>", sKey: undefined, errorlog: false }
    ].forEach(function (oFixture) {
        QUnit.test("getAppState bad states" + oFixture.description, async function (assert) {
            // Arrange
            var oAppComponent = new UIComponent();
            if (oFixture.oComponent !== "<comp>") {
                oAppComponent = oFixture.oComponent;
            }
            var oGetContainerSpy = sandbox.spy(this.AppState, "getAppState");

            // Act
            const oAppState = await this.Navigation.getAppState(oAppComponent, "AKEY");

            // Assert
            assert.ok(oAppState, "Success: app state object was returned");
            assert.ok(typeof oAppState.getData === "function", "Success: app state has method getData");
            assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");

            assert.equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
            assert.equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        });
    });

    QUnit.test("getAppStateData", async function (assert) {
        // Arrange
        var oGetContainerSpy = sandbox.spy(this.AppState, "getAppState");

        // Act
        const [oAppState] = await this.Navigation.getAppStateData(["AKEY"]);

        // Assert
        assert.equal(oAppState, undefined, "Success: app state object was returned");

        assert.equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        assert.equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
    });

    QUnit.test("getAppStateData spy, no data -> undefined", async function (assert) {
        // Arrange
        var oGetContainerSpy = sandbox.spy(this.AppState, "getAppState");

        // Act
        const [oAppState] = await this.Navigation.getAppStateData(["AKEY"]);

        // Assert
        assert.equal(oAppState, undefined, "Success: app state data is undefined");

        assert.equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        assert.equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
    });

    QUnit.test("getAppStateData with data", async function (assert) {
        // Arrange
        const oAppComponent = new UIComponent();

        const oAppState = await this.Navigation.createEmptyAppState(oAppComponent, "ANewKey");
        oAppState.setData({ here: "isthedata" });
        const sKey = oAppState.getKey();

        // Act
        await ushellUtils.promisify(oAppState.save());
        const [oAppStateData] = await this.Navigation.getAppStateData([sKey]);
        // Assert
        assert.deepEqual(oAppStateData, { here: "isthedata" }, "Success: app state object was returned");
    });

    QUnit.test("getAppStateData multiple invoke with some data and no data -> undefined", async function (assert) {
        // Arrange
        const oAppComponent = new UIComponent();
        const oAppState = await this.Navigation.createEmptyAppState(oAppComponent, "ANewKey");
        oAppState.setData({ here: "isthedata" });
        var sKey = oAppState.getKey();

        // Act
        await ushellUtils.promisify(oAppState.save());
        const aAppStateData = await this.Navigation.getAppStateData([sKey, "BKEY"]);
        // Assert
        assert.deepEqual(aAppStateData, [{ here: "isthedata" }, undefined], "Success: app state data is undefined");
    });

    //Navigable ?
    QUnit.test("isUrlSupported non-Fiori link", function (assert) {
        // Act & Assert
        return this.Navigation.isUrlSupported("https://www.google.de").then(() => {
            assert.ok(true, "should be supported");
        });
    });

    const ourURI = (new URI(window.location.href)).normalize();
    const ourUriFullResource = ourURI.protocol() + "://" + ourURI.host() + ourURI.pathname();
    //Navigable ?
    [
        { sUrl: "https://www.google.de", bResult: true },
        { sUrl: "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss", bResult: true },
        { sUrl: "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss", bResult: false, reject: true },
        { sUrl: "#IllLegalObject-doit?ABCDEF=HJK&def=kl&/xxss", bResult: false },
        { sUrl: ourUriFullResource + "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss", bResult: true },
        { sUrl: "#IllLegalObject-doit?ABCDEF=HJK&def=kl&/xxss", bResult: false },
        { sUrl: "#someotherhash", bResult: true }, // not an intent!
        { sUrl: undefined, bResult: false },
        { sUrl: {}, bResult: false }
    ].forEach(function (oFixture) {
        QUnit.test("isUrlSupported diverse links: " + oFixture.sUrl + "  force reject:" + oFixture.reject, function (assert) {
            sandbox.stub(this.Navigation, "isNavigationSupported").callsFake((aIntent) => {
                let bSupported = false;
                const aRes = [];
                if (aIntent[0].target.shellHash.indexOf("LegalObject-") === 0) {
                    bSupported = true;
                }

                if (oFixture.reject) {
                    return Promise.reject();
                }
                aRes.push({ supported: bSupported });
                return Promise.resolve(aRes);
            });
            // Act
            return this.Navigation.isUrlSupported(oFixture.sUrl)
                .then(() => {
                    assert.ok(oFixture.bResult, "supported url");
                })
                .catch(() => {
                    assert.ok(!oFixture.bResult, "not supported url");
                });
        });
    });

    QUnit.test("correct url is returned after resolving intent #Test-config", async function (assert) {
        // Arrange
        var oExpectedURL = { url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp" };

        // Act
        const oResult = await this.Navigation.resolveIntent("#Test-config");

        // Assert
        assert.deepEqual(oResult, oExpectedURL);
    });

    QUnit.module("The function isInitialNavigation", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oIsInitialNavigationStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves({
                isInitialNavigation: this.oIsInitialNavigationStub
            });

            this.oDebugStub = sandbox.stub(Log, "debug");
            this.oService = new Navigation();
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Resolves with the result of the ShellNavigationInternal service if 'isInitialNavigation=undefined'", async function (assert) {
        // Act
        const bResult = await this.oService.isInitialNavigation();
        // Assert
        assert.strictEqual(bResult, true, "Resolved the correct result");
        assert.strictEqual(this.oIsInitialNavigationStub.callCount, 1, "isInitialNavigation was called once");
    });

    QUnit.test("Resolves with the result of the ShellNavigationInternal service if 'isInitialNavigation=true'", async function (assert) {
        // Arrange
        this.oIsInitialNavigationStub.returns(true);
        // Act
        const bResult = await this.oService.isInitialNavigation();
        // Assert
        assert.strictEqual(bResult, true, "Resolved the correct result");
        assert.strictEqual(this.oIsInitialNavigationStub.callCount, 1, "isInitialNavigation was called once");
    });

    QUnit.test("Resolves with the result of the ShellNavigationInternal service if 'isInitialNavigation=false'", async function (assert) {
        // Arrange
        this.oIsInitialNavigationStub.returns(false);
        // Act
        const bResult = await this.oService.isInitialNavigation();
        // Assert
        assert.strictEqual(bResult, false, "Resolved the correct result");
        assert.strictEqual(this.oIsInitialNavigationStub.callCount, 1, "isInitialNavigation was called once");
    });

    QUnit.test("Resolves correctly if ShellNavigationInternal service is not available", async function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").rejects();
        var aExpectedMessage = [
            "ShellNavigationInternal service not available",
            "This will be treated as the initial navigation",
            "sap.ushell.services.Navigation"
        ];
        // Act
        const bResult = await this.oService.isInitialNavigation();
        // Assert
        assert.strictEqual(bResult, true, "Resolved the correct result");
        assert.deepEqual(this.oDebugStub.getCall(0).args, aExpectedMessage, "Called Log.debug with correct args");
    });

    QUnit.module("The function getSupportedAppStatePersistencyMethods", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.aMethodsMock = [];
            this.oGetSupportedPersistencyMethodsStub = sandbox.stub().returns(this.aMethodsMock);
            this.oGetServiceAsyncStub.withArgs("AppState").resolves({
                getSupportedPersistencyMethods: this.oGetSupportedPersistencyMethodsStub
            });

            this.oService = new Navigation();
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Resolves the persistency methods", async function (assert) {
        // Act
        const aResult = await this.oService.getSupportedAppStatePersistencyMethods();
        // Assert
        assert.strictEqual(aResult, this.aMethodsMock, "Returned the correct result");
    });

    QUnit.test("Rejects if the AppState service is not available", async function (assert) {
        // Arrange
        var sErrorMock = "Service unavailable";
        this.oGetServiceAsyncStub.withArgs("AppState").rejects(sErrorMock);
        try {
            // Act
            await this.oService.getSupportedAppStatePersistencyMethods();

            // Assert
            assert.ok(false, "The promise should have been rejected");
        } catch (sError) {
            assert.strictEqual(sError.toString(), sErrorMock, "Rejected with the correct error");
            assert.strictEqual(this.oGetSupportedPersistencyMethodsStub.callCount, 0, "getSupportedPersistencyMethods was not called");
        }
    });

    QUnit.module("The function createEmptyAppState", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oAppStateMock = {};
            this.oCreateEmptyAppStateStub = sandbox.stub().returns(this.oAppStateMock);
            this.oGetServiceAsyncStub.withArgs("AppState").resolves({
                createEmptyAppState: this.oCreateEmptyAppStateStub
            });

            this.oService = new Navigation();
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Resolves the empty appState container", async function (assert) {
        // Arrange
        var oAppComponent = new UIComponent();
        var bTransient = true;
        var sPersistencyMethod = "PublicState";
        var oPersistencySettings = {};
        // Act
        const oResult = await this.oService.createEmptyAppState(oAppComponent, bTransient, sPersistencyMethod, oPersistencySettings);

        // Assert
        assert.strictEqual(oResult, this.oAppStateMock, "Returned the correct AppState");

        assert.strictEqual(this.oCreateEmptyAppStateStub.getCall(0).args[0], oAppComponent, "Called createEmptyAppState with correct first arg");
        assert.strictEqual(this.oCreateEmptyAppStateStub.getCall(0).args[1], bTransient, "Called createEmptyAppState with correct second arg");
        assert.strictEqual(this.oCreateEmptyAppStateStub.getCall(0).args[2], sPersistencyMethod, "Called createEmptyAppState with correct third arg");
        assert.strictEqual(this.oCreateEmptyAppStateStub.getCall(0).args[3], oPersistencySettings, "Called createEmptyAppState with correct fourth arg");
    });

    QUnit.test("Rejects if the AppComponent is invalid", async function (assert) {
        // Arrange
        var sExpectedError = "The passed oAppComponent must be a UI5 Component.";
        try {
            // Act
            await this.oService.createEmptyAppState({}, true, "PublicState", {});

            // Assert
            assert.ok(false, "The promise should have been rejected");
        } catch (sError) {
            assert.strictEqual(sError, sExpectedError, "Rejected with the correct error");
            assert.strictEqual(this.oCreateEmptyAppStateStub.callCount, 0, "createEmptyAppState was not called");
        }
    });

    QUnit.test("Rejects if the AppState service is not available", async function (assert) {
        // Arrange
        var sErrorMock = "Service unavailable";
        this.oGetServiceAsyncStub.withArgs("AppState").rejects(sErrorMock);
        try {
            // Act
            await this.oService.createEmptyAppState(new UIComponent(), true, "PublicState", {});

            // Assert
            assert.ok(false, "The promise should have been rejected");
        } catch (sError) {
            assert.strictEqual(sError.toString(), sErrorMock, "Rejected with the correct error");
            assert.strictEqual(this.oCreateEmptyAppStateStub.callCount, 0, "createEmptyAppState was not called");
        }
    });

    QUnit.module("The function isNavigationSupported", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.aMockResult = [];
            this.oNavTargetResolutionMock = {
                isNavigationSupported: sandbox.stub().returns(new jQuery.Deferred().resolve(this.aMockResult).promise())
            };
            this.oGetServiceAsyncStub.withArgs("NavTargetResolutionInternal").resolves(this.oNavTargetResolutionMock);

            this.oService = new Navigation();
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Resolves the NavTargetResolutionInternal results", async function (assert) {
        // Act
        const aResult = await this.oService.isNavigationSupported([]);
        // Assert
        assert.strictEqual(aResult, this.aMockResult, "Returned the correct result");
    });

    QUnit.test("Does not alter the inputs", async function (assert) {
        // Arrange
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({
            contentProviderId: ""
        });
        var aIntents = [{
            target: {
                shellHash: "action-toObject?param1=A"
            }
        }];
        var aClonedIntents = deepClone(aIntents);
        // Act
        await this.oService.isNavigationSupported(aIntents);
        // Assert
        assert.deepEqual(aIntents, aClonedIntents, "The original input was not altered");
    });

    QUnit.test("Removes inner app route before isNavigationSupported check", async function (assert) {
        // Arrange
        var aIntents = [{
            target: {
                shellHash: "action-toObject?param1=A&/inner/app/route"
            }
        }];
        var aExpectedIntentClones = [{
            target: {
                shellHash: "action-toObject?param1=A"
            }
        }];
        // Act
        await this.oService.isNavigationSupported(aIntents);
        // Assert
        var aClonedIntents = this.oNavTargetResolutionMock.isNavigationSupported.getCall(0).args[0];
        assert.deepEqual(aClonedIntents, aExpectedIntentClones, "Removed the inner app route");
    });

    QUnit.module("getHref", {
        beforeEach: function () {
            this.Navigation = new Navigation();
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").resolves({});
            this.ShellNavigationInternal = {
                hrefForExternal: sandbox.stub()
            };
            this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves(this.ShellNavigationInternal);
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Defaults to current hash", async function (assert) {
        // Arrange
        sandbox.stub(hasher, "getHash").returns("Action-toappnavsample~someContext?param1=value1&/inner/app/route");
        const sExpectedHref = "#Action-toappnavsample~someContext?param1=value1&/inner/app/route";
        this.ShellNavigationInternal.hrefForExternal.resolves(sExpectedHref);

        const aExpectedArgs = [
            {
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample",
                    contextRaw: "someContext"
                },
                params: {
                    param1: ["value1"]
                },
                appSpecificRoute: "&/inner/app/route"
            },
            undefined, // bVerbose
            undefined // oComponent
        ];

        // Act
        const sHref = await this.Navigation.getHref();

        // Assert
        assert.strictEqual(sHref, sExpectedHref, "Resolved the correct hash");
        assert.deepEqual(this.ShellNavigationInternal.hrefForExternal.getCall(0).args, aExpectedArgs, "Called ShellNavigationInternal with correct args");
    });

    QUnit.module("getLinks", {
        beforeEach: function () {
            this.Navigation = new Navigation();
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Throws an error for single entries (old api input)", async function (assert) {
        // Act
        try {
            await this.Navigation.getLinks({
                target: { semanticObject: "so" }
            });
            assert.ok(false, "Error was thrown");
        } catch (oError) {
            // Assert
            assert.ok(true, "Error was thrown");
            assert.strictEqual(/Unexpected Input/.test(oError), true, "Correct error was thrown");
        }
    });

    QUnit.test("Throws an error for multiple entries (old api input)", async function (assert) {
        // Act
        try {
            await this.Navigation.getLinks([
                [{
                    target: { semanticObject: "so" }
                }]
            ]);
            assert.ok(false, "Error was thrown");
        } catch (oError) {
            // Assert
            assert.ok(true, "Error was thrown");
            assert.strictEqual(/Unexpected Input/.test(oError), true, "Correct error was thrown");
        }
    });

    QUnit.module("getAppStateData", {
        beforeEach: function () {
            this.Navigation = new Navigation();
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Throws an error for single entries (old api input)", async function (assert) {
        // Act
        try {
            await this.Navigation.getAppStateData("appStateKey1");
            assert.ok(false, "Error was thrown");
        } catch (oError) {
            // Assert
            assert.ok(true, "Error was thrown");
            assert.strictEqual(/Unexpected Input/.test(oError), true, "Correct error was thrown");
        }
    });
});

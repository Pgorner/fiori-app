// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for Navigation service compatibility
 */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/services/Navigation",
    "sap/ushell/services/Navigation/compatibility",
    "sap/ushell/Container"
], function (
    UIComponent,
    jQuery,
    AppConfiguration,
    Navigation,
    navigationCompatibility,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("getLinks", {
        beforeEach: async function () {
            this.NavTargetResolutionInternal = {
                getLinks: sandbox.stub()
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves(this.NavTargetResolutionInternal);
            Container.getServiceAsync.withArgs("Navigation").resolves(new Navigation());
            Container.getServiceAsync.withArgs("AppLifeCycle").resolves();
        },
        afterEach: async function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Returns NavTargetResolution Links", async function (assert) {
        // Arrange
        const aLinks = [{
            intent: "#AnObject-Action?A=B&C=e&C=j",
            text: "Perform action"
        }];
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve(aLinks).promise());

        // Act
        const aResult = await navigationCompatibility.getLinks({
            semanticObject: "Action",
            params: {
                A: "B",
                C: "e'e e"
            },
            paramsOptions: [],
            ignoreFormFactor: true,
            ui5Component: { id: "app.component" },
            appStateKey: "ANAPSTATE"
        });

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                A: "B",
                C: "e'e e",
                "sap-xapp-state": [ "ANAPSTATE" ]
            },
            paramsOptions: [],
            ignoreFormFactor: true,
            ui5Component: { id: "app.component" },
            compactIntents: false,
            action: undefined
        }, "NavTargetResolutionInternal was called with the expected parameters");

        assert.strictEqual(aResult, aLinks, "Correct result was returned");
    });

    QUnit.test("Calls NavTargetResolutionInternal correctly when no parameter is given", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve().promise());

        // Act
        await navigationCompatibility.getLinks();

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: undefined,
            paramsOptions: []
        }, "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("Calls NavTargetResolutionInternal correctly when no parameter is given in object", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve().promise());

        // Act
        await navigationCompatibility.getLinks({});

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: undefined,
            paramsOptions: []
        }, "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("Calls NavTargetResolutionInternal as expected when paramsOptions provided from public API", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve().promise());

        // Act
        await navigationCompatibility.getLinks({
            paramsOptions: [
                { name: "A", options: { required: true } } // note: given from public API
            ],
            params: {
                A: ["vA"],
                B: ["vB"]
            }
        });

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.args[0], [{
            action: undefined,
            compactIntents: false,
            params: {
                A: ["vA"],
                B: ["vB"]
            },
            paramsOptions: []
        }], "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("Calls NavTargetResolutionInternal as expected when paramsOptions provided from public API is overridden when extended params syntax is used", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve().promise());

        // Act
        await navigationCompatibility.getLinks({
            paramsOptions: [
                { name: "B", options: { required: true } } // note: given from public API
            ],
            params: {
                A: { value: ["vA"], required: false },
                B: ["vB"]
            }
        });

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.args[0], [{
            action: undefined,
            compactIntents: false,
            params: {
                A: ["vA"],
                B: ["vB"]
            },
            paramsOptions: [{
                name: "A", options: { required: false }
            }]
        }], "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("Calls NavTargetResolutionInternal correctly when withAtLeastOneUsedParam parameter is given", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve().promise());

        // Act
        await navigationCompatibility.getLinks({
            withAtLeastOneUsedParam: true,
            params: {
                A: ["vA"],
                B: ["vB"]
            }
        });

        // Assert
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

    QUnit.test("Calls NavTargetResolutionInternal correctly when bCompactIntents parameter is set to true", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve().promise());

        // Act
        await navigationCompatibility.getLinks({
            semanticObject: "Action",
            params: {
                param1: "value1",
                param2: "value2",
                param3: "value3",
                param4: "value4"
            },
            ignoreFormFactor: true,
            ui5Component: { id: "app.component" },
            appStateKey: "ANAPSTATE",
            compactIntents: true
        });

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
            ui5Component: { id: "app.component" },
            //appStateKey: sAppState,
            compactIntents: true,
            paramsOptions: [],
            action: undefined
        }, "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("Multiple invoke", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.onCall(0).returns(new jQuery.Deferred().resolve(["A", "B"]).promise());
        this.NavTargetResolutionInternal.getLinks.onCall(1).returns(new jQuery.Deferred().resolve(["C"]).promise());

        // Act
        const aResults = await navigationCompatibility.getLinks([
            [{
                semanticObject: "SOx",
                params: {
                    A: "B",
                    C: "e'e e"
                },
                ignoreFormFactor: true,
                ui5Component: { id: "app.component" },
                appStateKey: "ANAPSTATE"
            }],
            [{
                semanticObject: "SO"
            }]
        ]);

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
            ui5Component: { id: "app.component" },
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

        assert.deepEqual(aResults, [
            [ // <- result for the first invocation
                ["A", "B"]
            ],
            [ // <- result for the second invocation
                ["C"]
            ]
        ], "obtained expected result");
    });

    QUnit.test("Test that sap-ushell-enc-test is added to URL in URL generating functions getLinks", async function (assert) {
        // Arrange
        const aLinks = [{
            intent: "#AnObject-Action?A=B&C=e&C=j",
            text: "Perform action"
        }];
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve(aLinks).promise());
        localStorage.setItem("sap-ushell-enc-test", "true");

        // Act
        await navigationCompatibility.getLinks({
            semanticObject: "Action",
            params: {},
            ui5Component: { id: "app.component" }
        });

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                "sap-ushell-enc-test": [
                    "A B%20C"
                ]
            },
            paramsOptions: [],
            ui5Component: { id: "app.component" },
            compactIntents: false,
            action: undefined
        }, "Called NavTargetResolutionInternal with correct parameters");

        // Cleanup
        localStorage.removeItem("sap-ushell-enc-test");
    });

    QUnit.module("getAppStateData", {
        beforeEach: async function () {
            this.AppStateState = {
                getData: sandbox.stub()
            };
            this.AppState = {
                getAppState: sandbox.stub().returns(new jQuery.Deferred().resolve(this.AppStateState).promise())
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("Navigation").resolves(new Navigation());
            Container.getServiceAsync.withArgs("AppState").resolves(this.AppState);
        },
        afterEach: async function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Returns undefined for empty data", async function (assert) {
        // Act
        const oAppStateData = await navigationCompatibility.getAppStateData("AKEY");

        // Assert
        assert.strictEqual(oAppStateData, undefined, "Success: app state data is undefined");
        assert.strictEqual(this.AppState.getAppState.calledOnce, true, "getAppState was called");
        assert.strictEqual(this.AppState.getAppState.getCall(0).args[0], "AKEY", "getAppState was called with correct key");
    });

    QUnit.test("Returns AppState data", async function (assert) {
        // Arrange
        this.AppStateState.getData.returns({ here: "isthedata" });

        // Act
        const oAppStateData = await navigationCompatibility.getAppStateData("AKEY");

        // Assert
        assert.deepEqual(oAppStateData, { here: "isthedata" }, "Success: app state object was returned");
    });

    QUnit.test("Multiple invoke with some data and no data", async function (assert) {
        // Arrange
        this.AppState.getAppState.withArgs("AKEY").returns(new jQuery.Deferred().resolve({
            getData: sandbox.stub().returns({ here: "isthedata" })
        }).promise());

        // Act
        const oAppStateData = await navigationCompatibility.getAppStateData([["AKEY"], ["BKEY"]]);

        // Assert
        assert.deepEqual(oAppStateData, [[{ here: "isthedata" }], [undefined]], "Success: app state data is undefined");
    });

    QUnit.module("getSemanticObjectLinks", {
        beforeEach: async function () {
            this.NavTargetResolutionInternal = {
                getLinks: sandbox.stub()
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves(this.NavTargetResolutionInternal);
            Container.getServiceAsync.withArgs("Navigation").resolves(new Navigation());
            Container.getServiceAsync.withArgs("AppLifeCycle").resolves();
        },
        afterEach: async function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Returns NavTargetResolution Links", async function (assert) {
        // Arrange
        const aLinks = [{
            intent: "#AnObject-Action?A=B&C=e&C=j",
            text: "Perform action"
        }];
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve(aLinks).promise());

        // Act
        const aResult = await navigationCompatibility.getSemanticObjectLinks(
            "Action",
            {
                A: "B",
                C: "e'e e"
            },
            true,
            { id: "app.component" },
            "ANAPSTATE"
        );

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                A: "B",
                C: "e'e e"
            },
            ignoreFormFactor: true,
            ui5Component: { id: "app.component" },
            appStateKey: "ANAPSTATE",
            compactIntents: false
        }, "NavTargetResolutionInternal was called with the expected parameters");

        assert.strictEqual(aResult, aLinks, "Correct result was returned");
    });

    QUnit.test("Calls NavTargetResolutionInternal correctly when bCompactIntents parameter is set to true", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve().promise());

        // Act
        await navigationCompatibility.getSemanticObjectLinks(
            "Action",
            {
                param1: "value1",
                param2: "value2",
                param3: "value3",
                param4: "value4"
            },
            true,
            { id: "app.component" },
            "ANAPSTATE",
            true
        );

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                param1: "value1",
                param2: "value2",
                param3: "value3",
                param4: "value4"
            },
            ignoreFormFactor: true,
            ui5Component: { id: "app.component" },
            appStateKey: "ANAPSTATE",
            compactIntents: true // note
        }, "NavTargetResolutionInternal getLinks was called with the expected parameters");
    });

    QUnit.test("Multiple invoke", async function (assert) {
        // Arrange
        this.NavTargetResolutionInternal.getLinks.onCall(0).returns(new jQuery.Deferred().resolve(["A", "B"]).promise());
        this.NavTargetResolutionInternal.getLinks.onCall(1).returns(new jQuery.Deferred().resolve(["C"]).promise());

        // Act
        const aResult = await navigationCompatibility.getSemanticObjectLinks([[
            "SOx",
            {
                A: "B",
                C: "e'e e"
            },
            true,
            { id: "app.component" },
            "ANAPSTATE"
        ], [
            "SO"
        ]]);

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.args[0], [{
            semanticObject: "SOx",
            params: {
                A: "B",
                C: "e'e e"
            },
            ignoreFormFactor: true,
            ui5Component: { id: "app.component" },
            appStateKey: "ANAPSTATE",
            compactIntents: false
        }], "parameters are ok (first call)");

        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.args[1], [{
            semanticObject: "SO",
            params: undefined,
            ignoreFormFactor: false,
            ui5Component: undefined,
            appStateKey: undefined,
            compactIntents: false
        }], "parameters are ok (second call)");

        assert.deepEqual(aResult, [[["A", "B"]], [["C"]]], "obtained expected result");
    });

    QUnit.test("Test that sap-ushell-enc-test is added to URL in URL generating functions getSemanticObjectLinks", async function (assert) {
        // Arrange
        const aLinks = [{
            intent: "#AnObject-Action?A=B&C=e&C=j",
            text: "Perform action"
        }];
        this.NavTargetResolutionInternal.getLinks.returns(new jQuery.Deferred().resolve(aLinks).promise());
        localStorage.setItem("sap-ushell-enc-test", "true");

        // Act
        await navigationCompatibility.getSemanticObjectLinks(
            "Action",
            {
                A: "B",
                C: "e'e e"
            },
            true,
            { id: "app.component" },
            "ANAPSTATE"
        );

        // Assert
        assert.deepEqual(this.NavTargetResolutionInternal.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                A: "B",
                C: "e'e e",
                "sap-ushell-enc-test": [
                  "A B%20C"
                ]
            },
            ignoreFormFactor: true,
            ui5Component: { id: "app.component" },
            appStateKey: "ANAPSTATE",
            compactIntents: false
        }, "Called NavTargetResolutionInternal with correct parameters");

        // Cleanup
        localStorage.removeItem("sap-ushell-enc-test");
    });

    QUnit.module("isIntentSupported", {
        beforeEach: async function () {
            this.NavTargetResolutionInternal = {
                isNavigationSupported: sandbox.stub()
            };
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("NavTargetResolutionInternal").resolves(this.NavTargetResolutionInternal);
            Container.getServiceAsync.withArgs("Navigation").resolves(new Navigation());

            this.oComponent = new UIComponent();
        },
        afterEach: async function () {
            this.oComponent.destroy();
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Calls NavTargetResolution correctly when empty intents, no component startup params", async function (assert) {
        // Arrange
        const aIntents = [];
        const aExpectedIntents = [];
        const aNavTargetResolutionResponse = [];
        const oExpectedResult = {};

        sandbox.stub(this.oComponent, "getComponentData").returns({ startupParameters: {} });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents, this.oComponent);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });

    QUnit.test("Calls NavTargetResolution correctly when sap system in intent params", async function (assert) {
        // Arrange
        const aIntents = [
            "#SO-act2?sap-system=CC2"
        ];
        const aExpectedIntents = [
            "#SO-act2?sap-system=CC2"
        ];
        const aNavTargetResolutionResponse = [
            { supported: true }
        ];
        const oExpectedResult = {
            "#SO-act2?sap-system=CC2": { supported: true }
        };

        sandbox.stub(this.oComponent, "getComponentData").returns({ startupParameters: { P1: ["v1"] } });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents, this.oComponent);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });

    QUnit.test("Calls NavTargetResolution correctly when sap system in intent params sap system in component", async function (assert) {
        // Arrange
        const aIntents = [
            "#SO-act2?p1=v1"
        ];
        const aExpectedIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aNavTargetResolutionResponse = [
            { supported: true }
        ];
        const oExpectedResult = {
            "#SO-act2?p1=v1": { supported: true }
        };

        sandbox.stub(this.oComponent, "getComponentData").returns({ startupParameters: { "sap-system": ["CC2"] } });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents, this.oComponent);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });

    QUnit.test("Calls NavTargetResolution correctly when different sap-system in component and intent param", async function (assert) {
        // Arrange
        const aIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aExpectedIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aNavTargetResolutionResponse = [
            { supported: true }
        ];
        const oExpectedResult = {
            "#SO-act2?p1=v1&sap-system=CC2": { supported: true }
        };

        sandbox.stub(this.oComponent, "getComponentData").returns({ startupParameters: { "sap-system": ["CC4"] } });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents, this.oComponent);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });

    QUnit.test("Calls NavTargetResolution correctly when sap-ushell-next-navmode present in result but not on component", async function (assert) {
        // Arrange
        const aIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aExpectedIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aNavTargetResolutionResponse = [
            { supported: true }
        ];
        const oExpectedResult = {
            "#SO-act2?p1=v1&sap-system=CC2": { supported: true }
        };

        sandbox.stub(this.oComponent, "getComponentData").returns({ startupParameters: { "sap-system": ["CC4"] } });
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ "sap-ushell-next-navmode": "embedded" });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents, this.oComponent);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });

    QUnit.test("Calls NavTargetResolution correctly when sap-ushell-next-navmode present on component", async function (assert) {
        // Arrange
        const aIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aExpectedIntents = [
            "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded"
        ];
        const aNavTargetResolutionResponse = [
            { supported: true }
        ];
        const oExpectedResult = {
            "#SO-act2?p1=v1&sap-system=CC2": { supported: true }
        };

        sandbox.stub(this.oComponent, "getComponentData").returns({
            startupParameters: {
                "sap-system": ["CC4"],
                "sap-ushell-next-navmode": ["embedded"]
            }
        });
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ "sap-ushell-next-navmode": "newWindow" });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents, this.oComponent);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });

    QUnit.test("Calls NavTargetResolution correctly when sap-ushell-next-navmode present on resolution result, no component", async function (assert) {
        // Arrange
        const aIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aExpectedIntents = [
            "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded"
        ];
        const aNavTargetResolutionResponse = [
            { supported: true }
        ];
        const oExpectedResult = {
            "#SO-act2?p1=v1&sap-system=CC2": { supported: true }
        };

        // sandbox.stub(this.oComponent, "getComponentData").returns({});
        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ "sap-ushell-next-navmode": "embedded" });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });

    QUnit.test("Calls NavTargetResolution correctly when sap-app-origin-hint present on resolution result, no component alone", async function (assert) {
        // Arrange
        const aIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aExpectedIntents = [
            "#SO-act2?p1=v1&sap-system=CC2&sap-app-origin-hint=ABC"
        ];
        const aNavTargetResolutionResponse = [
            { supported: true }
        ];
        const oExpectedResult = {
            "#SO-act2?p1=v1&sap-system=CC2": { supported: true }
        };

        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ contentProviderId: "ABC" });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });

    QUnit.test("Calls NavTargetResolution correctly when sap-app-origin-hint present on resolution result, no component (empty value)", async function (assert) {
        // Arrange
        const aIntents = [
            "#SO-act2?p1=v1&sap-system=CC2"
        ];
        const aExpectedIntents = [
            "#SO-act2?p1=v1&sap-system=CC2&sap-app-origin-hint="
        ];
        const aNavTargetResolutionResponse = [
            { supported: true }
        ];
        const oExpectedResult = {
            "#SO-act2?p1=v1&sap-system=CC2": { supported: true }
        };

        sandbox.stub(AppConfiguration, "getCurrentApplication").returns({ contentProviderId: "" });

        this.NavTargetResolutionInternal.isNavigationSupported.returns(new jQuery.Deferred().resolve(aNavTargetResolutionResponse).promise());

        // Act
        const oResult = await navigationCompatibility.isIntentSupported(aIntents);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned expected result");
        assert.deepEqual(this.NavTargetResolutionInternal.isNavigationSupported.getCall(0).args[0], aExpectedIntents, "correct arg");
    });
});

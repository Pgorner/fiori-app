// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.AppLifeCycle
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/base/EventProvider",
    "sap/ui/core/Element",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/test/utils",
    "sap/ushell/Container",
    "sap/ushell/EventHub"
], function (
    ObjectPath,
    EventProvider,
    Element,
    hasher,
    testUtils,
    Container,
    EventHub
) {
    "use strict";

    /* global QUnit, sinon */
    const sandbox = sinon.createSandbox({});

    let oMockEventProvider;

    QUnit.module("sap.ushell.services.AppLifeCycle", {
        beforeEach: function () {
            return Container.init("local").then(() => {
                const MockEventProvider = EventProvider.extend("sap.ushell.foo_bar.MockEventProvider", {
                    attachAfterNavigate: function (oData, fnHandler) {
                        this.attachEvent("afterNavigate", oData, fnHandler);
                    },
                    attachBeforeNavigate: function (oData, fnHandler) {
                        this.attachEvent("beforeNavigate", oData, fnHandler);
                    },
                    detachAfterNavigate: function (oData, fnHandler) {
                        this.detachEvent("afterNavigate", fnHandler);
                    },
                    fireAfterNavigate: function (oParameters) {
                        this.fireEvent("afterNavigate", oParameters);
                    }
                });
                oMockEventProvider = new MockEventProvider();
            });
        },

        afterEach: function () {
            Container.resetServices();
            sandbox.restore();
        }
    });

    QUnit.test("getService: all normal", function (assert) {
        const oGetElementByIdStub = sandbox.stub(Element, "getElementById");
        oGetElementByIdStub.withArgs("viewPortContainer").returns(oMockEventProvider);
        oGetElementByIdStub.callThrough();
        sandbox.stub(Container, "getRendererInternal").returns({});

        return Container.getServiceAsync("AppLifeCycle").then((AppLifeCycleService) => {
            // check that the service is alive and well-formed
            assert.strictEqual(typeof AppLifeCycleService, "object", "service instance is an object");
            assert.strictEqual(typeof AppLifeCycleService.getCurrentApplication, "function", "function 'getCurrentApplication' is defined");
            assert.strictEqual(typeof AppLifeCycleService.attachAppLoaded, "function", "function 'attachAppLoaded' is defined");
            assert.strictEqual(typeof AppLifeCycleService.detachAppLoaded, "function", "function 'detachAppLoaded' is defined");
        });
    });

    QUnit.test("getService: but no viewPortContainer defined", function () {
        const oLogMock = testUtils.createLogMock();
        oLogMock.error(
            "Error during instantiation of AppLifeCycle service",
            "Could not attach to afterNavigate event",
            "sap.ushell.services.AppLifeCycle"
        );

        return Container.getServiceAsync("AppLifeCycle").then(() => {
            oLogMock.verify();
        });
    });

    QUnit.test("getService: viewPortContainer instance has no afterNavigate event", function () {
        const oGetElementByIdStub = sandbox.stub(Element, "getElementById");
        oGetElementByIdStub.withArgs("viewPortContainer").returns(new EventProvider());
        oGetElementByIdStub.callThrough();
        const oLogMock = testUtils.createLogMock();
        oLogMock.error(
            "Error during instantiation of AppLifeCycle service",
            "Could not attach to afterNavigate event",
            "sap.ushell.services.AppLifeCycle"
        );

        sandbox.stub(Container, "getRendererInternal").returns({});

        return Container.getServiceAsync("AppLifeCycle").then(() => {
            oLogMock.verify();
        });
    });

    [
        {
            testDescription: "no applicationType provided - fallback to UI5",
            sProvidedApplicationType: undefined,
            oComponentInstance: {
                getId: sandbox.stub().returns("application-Foo-bar-component")
            },
            expectedApplicationType: "UI5",
            expectedHomePage: false
        }, {
            testDescription: "applicationType NWBC",
            sProvidedApplicationType: "NWBC",
            expectedApplicationType: "NWBC",
            expectedHomePage: false
        }, {
            testDescription: "applicationType URL - fallback to UI5",
            sProvidedApplicationType: "URL",
            oComponentInstance: {
                getId: sandbox.stub().returns("application-Foo-bar-component")
            },
            expectedApplicationType: "UI5",
            expectedHomePage: false
        }, {
            testDescription: "applicationType URL - no componentInstance",
            sProvidedApplicationType: "URL",
            expectedApplicationType: "URL",
            expectedHomePage: false
        }, {
            testDescription: "applicationType random object - just pass through",
            sProvidedApplicationType: { foo: "Bar" },
            oComponentInstance: {
                getId: sandbox.stub().returns("application-Foo-bar-component")
            },
            expectedApplicationType: { foo: "Bar" },
            expectedHomePage: false
        }, {
            testDescription: "applicationType undefined and no componentInstance defined",
            sProvidedApplicationType: undefined,
            expectedApplicationType: undefined,
            expectedHomePage: false
        }, {
            testDescription: "home app component is recognized as home page",
            sProvidedApplicationType: "UI5",
            oComponentInstance: {
                getId: sandbox.stub().returns("homeApp-component")
            },
            expectedApplicationType: "UI5",
            expectedHomePage: true
        }, {
            testDescription: "applicationType random object - just pass through",
            sProvidedApplicationType: "UI5",
            oComponentInstance: {
                getId: sandbox.stub().returns("application-Shell-home-component")
            },
            expectedApplicationType: "UI5",
            expectedHomePage: true
        }
    ].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            const oGetElementByIdStub = sandbox.stub(Element, "getElementById");
            oGetElementByIdStub.withArgs("viewPortContainer").returns(oMockEventProvider);
            oGetElementByIdStub.callThrough();
            sandbox.stub(Container, "getRendererInternal").returns({});
            return Container.getServiceAsync("AppLifeCycle").then((AppLifeCycleService) => {
                const oEventParameters = {
                    to: {
                        getComponentHandle: sandbox.stub().returns({
                            getInstance: sandbox.stub().returns(oFixture.oComponentInstance)
                        }),
                        getApplicationType: sandbox.stub().returns(oFixture.sProvidedApplicationType)
                    },
                    toId: "application-Foo-bar"
                };
                const oExpectedResult = {
                    applicationType: oFixture.expectedApplicationType,
                    componentInstance: oFixture.oComponentInstance,
                    homePage: oFixture.expectedHomePage
                };
                oMockEventProvider.fireAfterNavigate(oEventParameters);

                const oCurrentApplication = AppLifeCycleService.getCurrentApplication();
                function getTypeAndDeleteAndAssert (sMethod) {
                    const sType = typeof oCurrentApplication[sMethod];
                    assert.strictEqual(sType, "function", sMethod + "is a function");
                    delete oCurrentApplication[sMethod];
                    return sType;
                }

                [
                    "getTechnicalParameter",
                    "getIntent",
                    "getInfo",
                    "getAllAppInfo",
                    "getSystemContext",
                    "disableKeepAliveAppRouterRetrigger"
                ].map(getTypeAndDeleteAndAssert);

                assert.deepEqual(oCurrentApplication, oExpectedResult, "currentApplication object as expected");
            });
        });
    });

    QUnit.test("Attaches handler to the 'rendererCreated' event if renderer is not created yet", function (assert) {
        sandbox.stub(Container, "getRendererInternal").returns(undefined);
        sandbox.spy(EventHub, "once");

        return Container.getServiceAsync("AppLifeCycle").then(() => {
            assert.ok(EventHub.once.calledWith("RendererLoaded"), "The rendererCreated handler was attached to the event.");
        });
    });

    QUnit.test("getIntent rejects the promise when hasher getHash does not return the hash fragment", function (assert) {
        const fnDone = assert.async();
        const oGetElementByIdStub = sandbox.stub(Element, "getElementById");
        oGetElementByIdStub.withArgs("viewPortContainer").returns(oMockEventProvider);
        oGetElementByIdStub.callThrough();
        sandbox.stub(Container, "getRendererInternal").returns({});
        Container.getServiceAsync("AppLifeCycle").then((AppLifeCycleService) => {
            sandbox.stub(hasher, "getHash");

            const oEventParameters = {
                to: {
                    getComponentHandle: sandbox.stub().returns({
                        getInstance: sandbox.stub().returns({
                            getId: sandbox.stub().returns("F0123")
                        })
                    }),
                    getApplicationType: sandbox.stub().returns("SAPUI5")
                },
                toId: "application-Foo-bar"
            };

            oMockEventProvider.fireAfterNavigate(oEventParameters);

            const oCurrentApplication = AppLifeCycleService.getCurrentApplication();

            oCurrentApplication.getIntent()
                .then(() => {
                    assert.ok(false, "Promise was resolved, but should be rejected");
                })
                .catch((sError) => {
                    assert.ok(true, "Promise was rejected");
                    assert.strictEqual(
                        sError,
                        "Could not identify current application hash",
                        "the promise was rejected with the expected error message"
                    );
                })
                .finally(fnDone);
        });
    });

    [
        {
            testDescription: "getIntent - simple intent, bGetRealIntent: undefined",
            bGetRealIntent: undefined,
            sAppUrl: "http://www.test.com",
            sHash: "App1-Test?p1=1&p2=2&/a/b/c",
            sAppType: "UI5",
            sAppFramework: "",
            expectedResult: {
                semanticObject: "App1",
                action: "Test",
                contextRaw: undefined,
                params: {
                    p1: ["1"],
                    p2: ["2"]
                },
                appSpecificRoute: "&/a/b/c"
            }
        },
        {
            testDescription: "getIntent - simple intent, bGetRealIntent: true",
            bGetRealIntent: true,
            sAppUrl: "http://www.test.com",
            sHash: "App1-Test?p1=1&p2=2&/a/b/c",
            sAppType: "UI5",
            sAppFramework: "",
            expectedResult: {
                semanticObject: "App1",
                action: "Test",
                contextRaw: undefined,
                params: {
                    p1: ["1"],
                    p2: ["2"]
                },
                appSpecificRoute: "&/a/b/c"
            }
        },
        {
            testDescription: "getIntent - simple intent, bGetRealIntent: false",
            bGetRealIntent: false,
            sAppUrl: "http://www.test.com",
            sHash: "App1-Test?p1=1&p2=2&/a/b/c",
            sAppType: "UI5",
            sAppFramework: "",
            expectedResult: {
                semanticObject: "App1",
                action: "Test",
                contextRaw: undefined,
                params: {
                    p1: ["1"],
                    p2: ["2"]
                },
                appSpecificRoute: "&/a/b/c"
            }
        },
        {
            testDescription: "getIntent - scube app, no generic intent, bGetRealIntent: true",
            bGetRealIntent: true,
            sAppUrl: "http://www.test.com?sap-theme=test&sap-remote-intent=ScubeApp1-ScubeTest&sap-language=EN#App1-Test?p1=1&p2=2&/a/b/c",
            sHash: "App1-Test?p1=1&p2=2&/a/b/c",
            sAppType: "URL",
            sAppFramework: "UI5",
            expectedResult: {
                semanticObject: "ScubeApp1",
                action: "ScubeTest",
                contextRaw: undefined,
                params: {
                    p1: ["1"],
                    p2: ["2"]
                },
                appSpecificRoute: "&/a/b/c"
            }
        },
        {
            testDescription: "getIntent - scube app, no generic intent, bGetRealIntent: undefined",
            bGetRealIntent: undefined,
            sAppUrl: "http://www.test.com?sap-theme=test&sap-remote-intent=ScubeApp1-ScubeTest&sap-language=EN#App1-Test?p1=1&p2=2&/a/b/c",
            sHash: "App1-Test?p1=1&p2=2&/a/b/c",
            sAppType: "URL",
            sAppFramework: "UI5",
            expectedResult: {
                semanticObject: "App1",
                action: "Test",
                contextRaw: undefined,
                params: {
                    p1: ["1"],
                    p2: ["2"]
                },
                appSpecificRoute: "&/a/b/c"
            }
        },
        {
            testDescription: "getIntent - scube app, with generic intent, bGetRealIntent: true",
            bGetRealIntent: true,
            sAppUrl: "http://www.test.com?sap-theme=test&sap-remote-intent=App100-action100&sap-language=EN" +
                "#Shell-startIntent?p1=1&p2=2&sap-shell-so=App100&sap-shell-action=action100&sap-system=ABC&/a/b/c",
            sHash: "Shell-startIntent?p1=1&p2=2&sap-shell-so=App100&sap-shell-action=action100&sap-system=ABC&/a/b/c",
            sAppType: "URL",
            sAppFramework: "UI5",
            expectedResult: {
                semanticObject: "App100",
                action: "action100",
                contextRaw: undefined,
                params: {
                    p1: ["1"],
                    p2: ["2"],
                    "sap-system": ["ABC"]
                },
                appSpecificRoute: "&/a/b/c"
            }
        },
        {
            testDescription: "getIntent - scube app, with generic intent, bGetRealIntent: undefined",
            bGetRealIntent: undefined,
            sAppUrl: "http://www.test.com?sap-theme=test&sap-remote-intent=App100-action100&sap-language=EN" +
                "#Shell-startIntent?p1=1&p2=2&sap-shell-so=App100&sap-shell-action=action100&sap-system=ABC&/a/b/c",
            sHash: "Shell-startIntent?p1=1&p2=2&sap-shell-so=App100&sap-shell-action=action100&sap-system=ABC&/a/b/c",
            sAppType: "URL",
            sAppFramework: "UI5",
            expectedResult: {
                semanticObject: "Shell",
                action: "startIntent",
                contextRaw: undefined,
                params: {
                    p1: ["1"],
                    p2: ["2"],
                    "sap-system": ["ABC"],
                    "sap-shell-so": ["App100"],
                    "sap-shell-action": ["action100"]
                },
                appSpecificRoute: "&/a/b/c"
            }
        }
    ].forEach((oFixture) => {
        QUnit.test(oFixture.testDescription, function (assert) {
            const fnDone = assert.async();
            const oGetElementByIdStub = sandbox.stub(Element, "getElementById");
            oGetElementByIdStub.withArgs("viewPortContainer").returns(oMockEventProvider);
            oGetElementByIdStub.callThrough();
            sandbox.stub(Container, "getRendererInternal").returns({});
            Container.getServiceAsync("AppLifeCycle").then((AppLifeCycleService) => {
                sandbox.stub(hasher, "getHash").returns(oFixture.sHash);

                const oEventParameters = {
                    to: {
                        getComponentHandle: sandbox.stub().returns({
                            getInstance: sandbox.stub().returns({
                                getId: sandbox.stub().returns("F0123")
                            })
                        }),
                        getApplicationType: sandbox.stub().returns(oFixture.sAppType),
                        getFrameworkId: sandbox.stub().returns(oFixture.sAppFramework),
                        getCurrentAppUrl: sandbox.stub().returns(oFixture.sAppUrl)
                    },
                    toId: "application-Foo-bar"
                };

                oMockEventProvider.fireAfterNavigate(oEventParameters);

                const oCurrentApplication = AppLifeCycleService.getCurrentApplication();

                oCurrentApplication.getIntent(oFixture.bGetRealIntent)
                    .then(function (oIntent) {
                        assert.deepEqual(oIntent, oFixture.expectedResult, "hash returned as extected");
                    })
                    .catch(function (sError) {
                        assert.ok(false, "Promise was rejected but should be resolved");
                    })
                    .finally(fnDone);
            });
        });
    });

    QUnit.test("listening to the appLoaded event", function (assert) {
        const fnDone = assert.async();
        const oGetElementByIdStub = sandbox.stub(Element, "getElementById");
        oGetElementByIdStub.withArgs("viewPortContainer").returns(oMockEventProvider);
        oGetElementByIdStub.callThrough();
        sandbox.stub(Container, "getRendererInternal").returns({});
        Container.getServiceAsync("AppLifeCycle").then((AppLifeCycleService) => {
            const oEventParameters = {
                to: {
                    getComponentHandle: sandbox.stub().returns({
                        getInstance: sandbox.stub().returns({
                            getId: sandbox.stub().returns("application-Foo-bar-component")
                        })
                    }),
                    getApplicationType: sandbox.stub().returns("URL")
                },
                toId: "application-Foo-bar"
            };

            // actual test of expectations here in event handler
            const fnOnAppLoaded = function (oEvent) {
                assert.deepEqual(oEvent.mParameters, this.service.getCurrentApplication(), "event returns expected app");
                fnDone();
            };

            // trigger the event to be tested
            AppLifeCycleService.attachAppLoaded(undefined, fnOnAppLoaded, { service: AppLifeCycleService });
            oMockEventProvider.fireAfterNavigate(oEventParameters);
        });
    });
});

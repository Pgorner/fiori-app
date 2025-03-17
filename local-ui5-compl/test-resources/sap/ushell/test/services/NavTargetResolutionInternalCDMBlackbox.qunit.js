// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/services/AppConfiguration"
], function (
    Container,
    AppConfiguration
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("sap.ushell_abap.adapters.abap.NavTargetResolutionInternal: ", {
        beforeEach: function () {
            window["sap-ushell-config"] = {
                services: {
                    CommonDataModel: {
                        module: "sap.ushell.services.CommonDataModel",
                        adapter: {
                            module: "sap.ushell.adapters.cdm.CommonDataModelAdapter",
                            config: {
                                ignoreSiteDataPersonalization: true,
                                cdmSiteUrl: sap.ui.require.toUrl("sap/ushell/test/services/NavTargetResolutionInternalCDMBlackbox.testData.json")
                            }
                        }
                    },
                    ClientSideTargetResolution: { adapter: { module: "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter" } },
                    Container: { adapter: { config: { language: "EN" } } },
                    LaunchPage: { adapter: { module: "sap.ushell.adapters.cdm.v3.FlpLaunchPageAdapter" } },
                    NavTargetResolutionInternal: {
                        config: {
                            allowTestUrlComponentConfig: true,
                            enableClientSideTargetResolution: true
                        }
                    }
                }
            };
            return Container.init("local");
        },
        afterEach: function () {
            delete window["sap-ushell-config"];
        }
    });
    var aResolveHashFragmentFixture = [
        {
            sHashFragmentToResolve: "#Action-toWDA",
            expectedPromiseResolve: true,
            expectedResolutionResult: {
                applicationType: "WDA",
                contentProviderId: "",
                navigationMode: "newWindowThenEmbedded",
                explicitNavMode: false,
                targetNavigationMode: "explace",
                reservedParameters: {},
                "sap-system": undefined,
                systemAlias: "UI2_WDA",
                text: "WDANavTarget display",
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/"
                    + "?sap-client=111&sap-language=EN&P2=P2DefValue&sap-ushell-defaultedParameterNames=%5B%22P2%22%5D&sap-iframe-hint=NWBC",
                inboundPermanentKey: undefined,
                extendedInfo: {
                    appParams: {
                        P2: [
                            "P2DefValue"
                        ]
                    },
                    system: undefined
                }
            }
        }, {
            sHashFragmentToResolve: "#Action-tosu01",
            expectedPromiseResolve: true,
            expectedResolutionResult: {
                applicationType: "TR",
                contentProviderId: "",
                navigationMode: "newWindowThenEmbedded",
                explicitNavMode: false,
                targetNavigationMode: "explace",
                reservedParameters: {},
                "sap-system": "U1YCLNT111",
                systemAlias: "U1YCLNT111",
                text: "Maintain users",
                url: "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;~service=32?%7etransaction=SU01&%7enosplash=1&sap-client=111&sap-language=EN&sap-iframe-hint=GUI",
                inboundPermanentKey: undefined,
                extendedInfo: {
                    appParams: {
                        "sap-system": [
                            "U1YCLNT111"
                        ]
                    },
                    system: undefined
                }
            }
        }, {
            sHashFragmentToResolve: "#Action-toappnavsample",
            expectedPromiseResolve: true,
            expectedResolutionResult: {
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                applicationDependencies: { url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                applicationType: "URL",
                contentProviderId: "",
                navigationMode: "embedded",
                explicitNavMode: false,
                extendedInfo: {
                    appParams: {},
                    system: undefined
                },
                targetNavigationMode: "inplace",
                "sap-system": undefined,
                text: "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                ui5ComponentName: "sap.ushell.demo.AppNavSample",
                url: "../../../../sap/ushell/demoapps/AppNavSample?A=URL",
                reservedParameters: {},
                inboundPermanentKey: undefined
            }
        }, {
            sHashFragmentToResolve: "#Action-launchURL",
            expectedPromiseResolve: true,
            expectedResolutionResult: {
                applicationType: "URL",
                contentProviderId: "",
                navigationMode: "newWindow",
                explicitNavMode: false,
                targetNavigationMode: "explace",
                reservedParameters: {},
                "sap-system": undefined,
                systemAlias: undefined,
                text: "All the news thats fit to print",
                url: "http://www.nytimes.com",
                inboundPermanentKey: undefined
            }
        }
    ];

    aResolveHashFragmentFixture.forEach(function (oFixture) {
        QUnit.test("resolveHashFragment without sap.ushell.services.AppConfiguration side effects: " + oFixture.sHashFragmentToResolve, function (assert) {
            /*
             * When resolveHashFragment is called, we also call sap.ushell.services.AppConfiguration.setCurrentApplication
             * to store the application that was resolved. This is done with the assumption that the application will be opened.
             *
             * In a successive resolution, when the navigation mode is determined,
             * the sap.ushell.services.AppConfiguration.getCurrentApplication method is called and a certain navigation mode is determined.
             * In this test we stub these two methods away, to avoid obtaining different navigation modes
             * when the tests are run in sequence or in order. Another test that checks this should be made explicitly.
             */
            var fnDone = assert.async();

            sinon.stub(AppConfiguration, "setCurrentApplication");

            Container.getServiceAsync("NavTargetResolutionInternal").then(function (NavigationTargetResolutionService) {
                NavigationTargetResolutionService.resolveHashFragment(oFixture.sHashFragmentToResolve)
                    .done(function (oResolutionResult) {
                        if (oFixture.expectedPromiseResolve) {
                            assert.ok(true, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was resolved");
                            assert.deepEqual(oResolutionResult, oFixture.expectedResolutionResult, oFixture.sHashFragmentToResolve + " has resolved to the expected result");
                        } else {
                            assert.ok(false, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was rejected");
                        }
                    })
                    .fail(function (sMessage) {
                        if (oFixture.expectedPromiseResolve) {
                            assert.ok(false, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was resolved. Error:" + sMessage);
                        } else {
                            assert.ok(true, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was rejected");
                        }
                    })
                    .always(function () {
                        AppConfiguration.setCurrentApplication.restore();
                        fnDone();
                    });
            });
        });
    });

    QUnit.test("resolveHashFragment with sap.ushell.services.AppConfiguration side effects", function (assert) {
        // This is the same test above, but with the non-stubbed AppConfiguration sequence.
        // Note, this is one test!

        var aExpectedNavigationModes = [
            // #Action-toWDA
            { internal: "newWindowThenEmbedded", external: "explace" },
            // #Action-tosu01
            { internal: "newWindowThenEmbedded", external: "explace" },
            // #Action-toappnavsample
            { internal: "embedded", external: "inplace" },
            // #Action-launchURL
            { internal: "newWindow", external: "explace" },
            // #Action-toNewsTile
            { internal: "- does not matter (should not be resolved) -", external: "- does not matter (should not be resolved) -" }
        ];

        function resolveNext (aFixtures) {
            if (aFixtures.length === 0) {
                return;
            }

            var oFixture = aFixtures.shift();
            var oExpectedNavigationMode = aExpectedNavigationModes.shift();

            var fnDone = assert.async();
            Container.getServiceAsync("NavTargetResolutionInternal").then(function (NavigationTargetResolutionService) {
                NavigationTargetResolutionService.resolveHashFragment(oFixture.sHashFragmentToResolve)
                    .done(function (oResolutionResult) {
                        var oExpectedResolutionResult = oFixture.expectedResolutionResult;
                        oExpectedResolutionResult.navigationMode = oExpectedNavigationMode.internal;
                        oExpectedResolutionResult.targetNavigationMode = oExpectedNavigationMode.external;

                        if (oFixture.expectedPromiseResolve) {
                            assert.ok(true, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was resolved");
                            assert.deepEqual(oResolutionResult, oExpectedResolutionResult, oFixture.sHashFragmentToResolve + " has resolved to the expected result");
                        } else {
                            assert.ok(false, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was rejected");
                        }
                    })
                    .fail(function (sMessage) {
                        if (oFixture.expectedPromiseResolve) {
                            assert.ok(false, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was resolved. Error:" + sMessage);
                        } else {
                            assert.ok(true, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was rejected");
                        }
                    })
                    .always(function () {
                        resolveNext(aFixtures);
                        fnDone();
                    });
            });
        }

        resolveNext(aResolveHashFragmentFixture);
    });

    [{
        description: "#Action-toappnavsample with parameters",
        oGetLinksArgs: {
            semanticObject: "Action",
            action: "toappnavsample",
            params: {
                P1: "Value1",
                P2: "Value2"
            }
        },
        expectedResult: "#Action-toappnavsample?P1=Value1&P2=Value2"
    }, {
        description: "#Action-toWDA",
        oGetLinksArgs: {
            semanticObject: "Action",
            action: "toWDA"
        },
        expectedResult: "#Action-toWDA"
    }, {
        description: "#Action-tosu01",
        oGetLinksArgs: {
            semanticObject: "Action",
            action: "tosu01"
        },
        expectedResult: "#Action-tosu01"
    }].forEach(function (oFixture) {
        QUnit.test("getLinks: " + oFixture.description, function (assert) {
            var fnDone = assert.async();
            Container.getServiceAsync("NavTargetResolutionInternal").then(function (NavigationTargetResolutionService) {
                NavigationTargetResolutionService.getLinks(oFixture.oGetLinksArgs)
                    .done(function (oResult) {
                        assert.ok(true, "getLinks promise for " + oFixture.description + " was resolved");
                        assert.deepEqual(oResult[0].intent, oFixture.expectedResult, "getLinks returned the expected result");
                    })
                    .fail(function (sMessage) {
                        assert.ok(false, "getLinks promise for " + oFixture.oGetLinksArgs + " was returned with Error:", sMessage);
                    })
                    .always(fnDone);
            });
        });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("isIntentSupported works as expected when a mix of intents is given", function (assert) {
        var oFixture = {
            testDescription: "a mix of intents is given",
            aIntents: ["#Action-toappnavsample", "#Action-tosu01", "#Action-toWDA", "#foo-bar"],
            expectedSupported: {
                "#Action-toappnavsample": true,
                "#Action-tosu01": true,
                "#Action-toWDA": true,
                "#foo-bar": false
            }
        };
        var fnDone = assert.async();
        Container.getServiceAsync("NavTargetResolutionInternal").then(function (NavigationTargetResolutionService) {
            NavigationTargetResolutionService.isIntentSupported(oFixture.aIntents)
                .done(function (oResult) {
                    assert.ok(true, "isIntentSupported promise was resolved");

                    oFixture.aIntents.forEach(function (sTestIntent) {
                        assert.strictEqual(oResult[sTestIntent].supported, oFixture.expectedSupported[sTestIntent],
                            "got " + oFixture.expectedSupported[sTestIntent] + " for " + sTestIntent);
                    });
                })
                .fail(function (sMessage) {
                    assert.ok(false, "isIntentSupported promise returned with Error:", sMessage);
                })
                .always(fnDone);
        });
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.NavTargetResolutionInternal and customizable
 * extensions
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/adapters/local/NavTargetResolutionInternalAdapter",
    "sap/ushell/navigationMode",
    "sap/ushell/services/appstate/WindowAdapter",
    "sap/ushell/services/NavTargetResolutionInternal",
    "sap/ushell/test/utils",
    "sap/ushell/utils/HttpClient"
], function (
    Log,
    UIComponent,
    jQuery,
    sinon,
    NavTargetResolutionAdapter,
    oNavigationMode,
    WindowAdapter,
    NavTargetResolutionInternal,
    testUtils,
    HttpClient
) {
    "use strict";

    /* global QUnit */

    var I_LONG_HASH_LENGTH = 2048;
    var I_COMPACT_HASH_LENGTH_MAX = 1024;

    var sandbox = sinon.createSandbox();
    var Container = sap.ui.require("sap/ushell/Container");

    QUnit.module("sap.ushell.services.NavTargetResolutionInternal", {
        before: function () {
            if (window.localStorage) {
                window.localStorage.clear();
            }
        },
        beforeEach: function (assert) {
            this.oAdapter = new NavTargetResolutionAdapter();

            this.oAdapterGetSemanticObjectLinksStub = sandbox.stub(this.oAdapter, "getSemanticObjectLinks").returns(new jQuery.Deferred().resolve([]).promise());
            this.oAdapterGetLinksStub = sandbox.stub().returns(new jQuery.Deferred().resolve([]).promise());
            this.oAdapter.getLinks = this.oAdapterGetLinksStub;

            this.oServiceConfig = {
                config: {
                    enableClientSideTargetResolution: false,
                    allowTestUrlComponentConfig: true,
                    usageRecorder: {
                        enabled: false
                    }
                }
            };

            return Container.init("local")
                .then(function () {
                    this.oNavTargetResolutionService = new NavTargetResolutionInternal(this.oAdapter, undefined, undefined, this.oServiceConfig);

                    this.oClientSideGetLinksStub = sandbox.stub().resolves([]);

                    this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
                    this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                        getLinks: this.oClientSideGetLinksStub
                    });

                    this.oHrefForExternalStub = sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise());
                    this.oShellNavigationInternal = {
                        hrefForExternal: this.oHrefForExternalStub
                    };
                    this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves(this.oShellNavigationInternal);
                    this.oGetServiceAsyncStub.callThrough();
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        },
        after: function () {
            if (window.localStorage) {
                window.localStorage.clear();
            }
        }
    });

    [{
        testDescription: "config option is true",
        vConfigOption: true,
        expectedResult: true
    }, {
        testDescription: "config option is false",
        vConfigOption: false,
        expectedResult: false
    }, {
        testDescription: "config option is 'true'",
        vConfigOption: false,
        expectedResult: false // not a string
    }].forEach(function (oFixture) {
        QUnit.test("_isClientSideTargetResolutionEnabled: result is as expected when " + oFixture.testDescription, function (assert) {
            this.oServiceConfig.config.enableClientSideTargetResolution = oFixture.vConfigOption;

            assert.strictEqual(this.oNavTargetResolutionService._isClientSideTargetResolutionEnabled(), oFixture.expectedResult, "expected result returned");
        });
    });

    [{
        testDescription: "simple call with parameter",
        oArgs: {
            target: { semanticObject: "Test", action: "config" },
            params: { A: "B" }
        },
        expectedResponse: {
            url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
            text: undefined,
            externalNavigationMode: false
        }
    }, {
        testDescription: "call with sap-system in sid notation matching the local system",
        testCurrentSystemInformation: { // the system name and client are used to identify the local system instead
            name: "UI3",
            client: "000"
        },
        oArgs: {
            target: { semanticObject: "Test", action: "config" },
            params: {
                "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                "sap-system": "sid(UI3.000)"
                // no sap-system-src provided
            }
        },
        expectedResponse: {
            url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
            text: undefined,
            externalNavigationMode: false
        }
    }].forEach(function (oFixture) {
        QUnit.test("handleServiceMessageEvent resolveTarget: " + oFixture.testDescription, function (assert) {
            return this.oNavTargetResolutionService.resolveTarget(oFixture.oArgs).done(function (oResp) {
                assert.deepEqual(oResp, oFixture.expectedResponse, "expected result returned");
            });
        });
    });

    QUnit.test("resolveTarget explace", function (assert) {
        var obj = {
            url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
            additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
            applicationType: "NWBC",
            navigationMode: "newWindowThenEmbedded",
            targetNavigationMode: "explace"
        };

        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);

        return this.oNavTargetResolutionService.resolveTarget({
            target: { semanticObject: "Test", action: "local1" },
            params: { A: "B" }
        }).done(function (oResp) {
            assert.deepEqual(oResp, {
                url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
                text: undefined,
                externalNavigationMode: true
            }, "expected result returned");
        });
    });

    QUnit.test("Config", function (assert) {
        // Act
        return this.oNavTargetResolutionService.resolveHashFragment("#Test-config").done(function (res) {
            // Assert
            assert.deepEqual(res, {
                additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
                applicationType: "URL",
                navigationMode: "embedded",
                targetNavigationMode: "inplace",
                url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
                ui5ComponentName: "sap.ushell.demoapps.FioriSandboxConfigApp"
            });

        });
    });

    QUnit.test("Local resolution nothing defined", function (assert) {
        var done = assert.async();

        this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
            .done(function () {
                this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                    .done(function () {
                        assert.ok(false, "The promise should have been rejected.");
                        done();
                    })
                    .fail(function (error) {
                        assert.ok(true, "The promise has been rejected.");
                        done();
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Local resolution", function (assert) {
        // There are two parallel async calls to resolveHashFragment
        var done = assert.async(2);

        this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
            .done(function () {
                var obj = {
                    url: "ABC",
                    additionalInformation: "JOJO",
                    navigationMode: "something",
                    targetNavigationMode: null
                };
                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);

                this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                    .done(function (oResult) {
                        assert.deepEqual(oResult, obj);
                        done();
                    })
                    .fail(function (error) {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                        throw error;
                    });

                this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
                    .done(function () {
                        this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                            .done(function () {
                                assert.notOk(true, "The promise should have been rejected.");
                                done();
                            })
                            .fail(function () {
                                assert.ok(true, "The promise has been rejected.");
                                done();
                            });
                    }.bind(this))
                    .fail(function (error) {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                        throw error;
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                done();
                throw error;
            });
    });

    QUnit.test("Local resolution cross domain (good-, cleartest)", function (assert) {
        var done = assert.async(2);

        this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
            .done(function () {
                var sURL = window.location.origin + "/sap/bc/ui5_ui5/";
                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify({
                    url: sURL,
                    additionalInformation: "JOJO"
                });

                this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                    .done(function (oResult) {
                        assert.strictEqual(oResult.url, sURL, "url is filled with same domain url");
                        done();
                    })
                    .fail(function (error) {
                        assert.ok(false, "The promise should have been resolved.");
                        done();
                        throw error;
                    });

                this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
                    .done(function () {
                        this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                            .done(function () {
                                assert.notOk(true, "The promise should have been rejected.");
                                done();
                            })
                            .fail(function () {
                                assert.ok(true, "The promise has been rejected.");
                                done();
                            });
                    }.bind(this))
                    .fail(function (error) {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                        throw error;
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                done();
                throw error;
            });
    });

    QUnit.test("Local resolution undefined URL", function (assert) {
        var done = assert.async(2);

        this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
            .done(function () {
                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify({
                    url: undefined,
                    additionalInformation: "JOJO"
                });

                this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                    .done(function () {
                        assert.ok(false, "The promise should have been rejected.");
                        done();
                    })
                    .fail(function () {
                        assert.ok(true, "The promise has been rejected.");
                        done();
                    });

                this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
                    .done(function () {
                        this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                            .done(function () {
                                assert.notOk(true, "The promise should have been rejected.");
                                done();
                            })
                            .fail(function () {
                                assert.ok(true, "The promise has been rejected.");
                                done();
                            });
                    }.bind(this));
            }.bind(this));
    });

    QUnit.test("URL resolution", function (assert) {
        var done = assert.async();

        sandbox.stub(URLSearchParams.prototype, "get").callsFake(function (s) {
            if (s.indexOf("additionalInformation") >= 0) {
                return "SAPUI5.Component=abc";
            }
            if (s.indexOf("sap-system") >= 0) {
                return null;
            }
            return "/a/b/c";
        });

        this.oNavTargetResolutionService.resolveHashFragment("#Test-url")
            .done(function (oResult) {
                assert.deepEqual(oResult, {
                    additionalInformation: "SAPUI5.Component=abc",
                    applicationType: "URL",
                    url: "/a/b/c",
                    navigationMode: "embedded",
                    targetNavigationMode: "inplace",
                    ui5ComponentName: "abc"
                });

                this.oNavTargetResolutionService.baseResolveHashFragment("#Test-url")
                    .done(function () {
                        assert.ok(false, "The promise should have been rejected.");
                        done();
                    })
                    .fail(function (error) {
                        assert.strictEqual(error, "Could not resolve link 'Test-url'", "correct error message");
                        done();
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("URL resolution - allow all folders", function (assert) {
        var done = assert.async();

        sandbox.stub(URLSearchParams.prototype, "get").callsFake(function (s) {
            if (s.indexOf("additionalInformation") >= 0) {
                return "SAPUI5.Component=abc";
            }
            if (s.indexOf("sap-system") >= 0) {
                return null;
            }
            return "/any/folder/for/wildcard/allowlist";
        });

        this.oNavTargetResolutionService.resolveHashFragment("#Test-url")
            .done(function (oResult) {
                assert.deepEqual(oResult, {
                    additionalInformation: "SAPUI5.Component=abc",
                    applicationType: "URL",
                    url: "/any/folder/for/wildcard/allowlist",
                    navigationMode: "embedded",
                    targetNavigationMode: "inplace",
                    ui5ComponentName: "abc"
                });

                this.oNavTargetResolutionService.baseResolveHashFragment("#Test-url")
                    .done(function () {
                        assert.ok(false, "The promise should have been rejected.");
                        done();
                    })
                    .fail(function (error) {
                        assert.strictEqual(error, "Could not resolve link 'Test-url'", "correct error message");
                        done();
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("postProcess resolutionResults hook modifies response", function (assert) {
        var done = assert.async();

        var oProcessPostResolutionStub = sandbox.stub().returns(new jQuery.Deferred().resolve({
            url: "andnowforsomethingcompletelydifferent",
            applicationType: "SAPUI5",
            navigationMode: "newWindow"
        }).promise());

        this.oAdapter.processPostResolution = oProcessPostResolutionStub;

        this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
            .done(function () {
                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify({
                    url: "ABC",
                    additionalInformation: "JOJO",
                    navigationMode: "something",
                    "sap.ushell.runtime": { appName: "abc" }
                });

                this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                    .done(function (oResult) {
                        assert.ok(oProcessPostResolutionStub.callCount >= 1, "The function postFilter  has been called.");
                        assert.deepEqual(oResult, {
                            applicationType: "URL",
                            navigationMode: "newWindow",
                            targetNavigationMode: "explace",
                            url: "andnowforsomethingcompletelydifferent"
                        }, "expected modified result");
                        done();
                    })
                    .fail(function (error) {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                        throw error;
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("processPostResolution resolutionResults can convert success to failure", function (assert) {
        var done = assert.async();

        var oProcessPostResolutionStub = sandbox.stub().returns(new jQuery.Deferred().reject("Oh No").promise());

        this.oAdapter.processPostResolution = oProcessPostResolutionStub;

        this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
            .done(function () {
                assert.notOk(true, "The promise should have been rejected.");
                done();
            })
            .fail(function () {
                var obj = {
                    url: "ABC",
                    additionalInformation: "JOJO",
                    navigationMode: "something",
                    "sap.ushell.runtime": {
                        appName: "abc"
                    }
                };

                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);

                this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                    .done(function () {
                        assert.ok(false, "The promise should have been rejected.");
                        done();
                    })
                    .fail(function (resolveHashError) {
                        assert.strictEqual(resolveHashError, "Oh No", "correct error message");
                        assert.ok(oProcessPostResolutionStub.called, "postFilter Called");

                        oProcessPostResolutionStub.args[1][1]
                            .done(function (oResult) {
                                assert.deepEqual(oResult, obj, " initial resolution");
                                done();
                            })
                            .fail(function (postFilterError) {
                                assert.notOk(true, "The promise should have been resolved.");
                                done();
                                throw postFilterError;
                            });
                    });
            }.bind(this));
    });

    QUnit.test("processPostResolution resolutionResults can convert failure to success", function (assert) {
        var done = assert.async();

        var oProcessPostResolutionStub = sandbox.stub();

        oProcessPostResolutionStub.onCall(0).returnsArg(1); // The processor just returns the original promise

        // The processor should only be active the second time. Otherwise the processor's promise is never resolved.
        oProcessPostResolutionStub.onCall(1).callsFake(function (a, b) {
            var oDeferred = new jQuery.Deferred();

            b.done(function () {
                assert.ok(false, "The promise should have been rejected.");
                done();
            });

            b.fail(function () {
                oDeferred.resolve({ url: "andnowforsomethingcompletelydifferent", applicationType: "SAPUI5", navigationMode: "newWindow" });
            });

            return oDeferred.promise();
        });

        this.oAdapter.processPostResolution = oProcessPostResolutionStub;

        this.oNavTargetResolutionService.resolveHashFragment("#Test-clear")
            .done(function () {
                // obj.url === undefined leads to the hash fragment not being resolved in the local resolver, which is what we want here
                var obj = {
                    url: undefined,
                    additionalInformation: "JOJO",
                    navigationMode: "something",
                    "sap.ushell.runtime": {
                        appName: "abc"
                    }
                };

                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);

                this.oNavTargetResolutionService.resolveHashFragment("#Test-local1")
                    .done(function (oResult) {
                        assert.ok(oProcessPostResolutionStub.called, "postFilter Called");
                        assert.equal(oProcessPostResolutionStub.args[1][0], "#Test-local1", "first argugment ok");
                        assert.equal(oProcessPostResolutionStub.args[1][1].state(), "rejected", "original promise was rejected");
                        assert.deepEqual(oResult, {
                            applicationType: "URL",
                            navigationMode: "newWindow",
                            targetNavigationMode: "explace",
                            url: "andnowforsomethingcompletelydifferent"
                        }, "expected modified result");
                        done();
                    })
                    .fail(function (error) {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                        throw error;
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Empty hash default", function (assert) {
        var done = assert.async();

        this.oNavTargetResolutionService.resolveHashFragment("")
            .done(function (oResult) {
                assert.strictEqual(oResult, undefined, "The result was undefined.");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Register ok", function (assert) {
        var oResolver = {
            name: "ResolverA",
            resolveHashFragment: sandbox.stub().returns({}),
            isApplicable: sandbox.stub().returns(false)
        };

        var bResult = this.oNavTargetResolutionService.registerCustomResolver(oResolver);

        assert.strictEqual(bResult, true, "The correct value has been returned.");
    });

    QUnit.test("Register no name", function (assert) {
        var oResolver = {
            // name: "ResolverA",
            resolveHashFragment: sandbox.stub().returns({}),
            isApplicable: sandbox.stub().returns(false)
        };

        var bResult = this.oNavTargetResolutionService.registerCustomResolver(oResolver);

        assert.strictEqual(bResult, false, "The correct value has been returned.");
    });

    QUnit.test("Register no isApplicable", function (assert) {
        var oResolver = {
            name: "ResolverA",
            resolveHashFragment: sandbox.stub().returns({})
            // isApplicable: sandbox.stub().returns(false)
        };

        var bResult = this.oNavTargetResolutionService.registerCustomResolver(oResolver);

        assert.strictEqual(bResult, false, "The correct value has been returned.");
    });

    QUnit.test("Register wrong resolveHashFragment", function (assert) {
        var oResolver = {
            name: "ResolverA",
            resolveHashFragment: {},

            isApplicable: function () {
                return false;
            }
        };

        var bResult = this.oNavTargetResolutionService.registerCustomResolver(oResolver);
        assert.strictEqual(bResult, false, "The correct value has been returned.");
    });

    QUnit.test("getCurrentResolution", function (assert) {
        var done = assert.async();
        var oResult = {};
        var oAdapter = {
            resolveHashFragment: sandbox.stub().returns(new jQuery.Deferred().resolve(oResult).promise())
        };

        var oNavTargetResolutionService = new NavTargetResolutionInternal(oAdapter);
        assert.strictEqual(oNavTargetResolutionService.getCurrentResolution(), undefined, "undefined if no resolution performed");

        oNavTargetResolutionService.resolveHashFragment("#foo")
            .done(function () {
                assert.strictEqual(oNavTargetResolutionService.getCurrentResolution(), oResult, "returns result of previous resolve");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.module("sap.ushell.services.NavTargetResolutionInternal.LocalResolver", {
        beforeEach: function (assert) {
            var done = assert.async();

            this.oAdapter = new NavTargetResolutionAdapter();
            this.oAdapterGetSemanticObjectLinksStub = sandbox.stub(this.oAdapter, "getSemanticObjectLinks").returns(new jQuery.Deferred().resolve([]).promise());
            this.oAdapterIsIntentSupportedStub = sandbox.stub(this.oAdapter, "isIntentSupported").returns(new jQuery.Deferred().resolve(true).promise());

            this.oAdapterGetLinksStub = sandbox.stub().returns(new jQuery.Deferred().resolve([]).promise());
            this.oAdapter.getLinks = this.oAdapterGetLinksStub;
            this.oResolveHashFragmentStub = sandbox.stub(this.oAdapter, "resolveHashFragment").returns(new jQuery.Deferred().resolve().promise());

            this.oServiceConfig = {
                config: {
                    resolveLocal: [{
                        linkId: "Rabbit-run",
                        resolveTo: {
                            additionalInformation: "SAPUI5.Component=Rabidrun",
                            applicationType: "URL",
                            url: "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2",
                            navigationMode: "embedded"
                        }
                    }, {
                        linkId: "Snake-bite",
                        resolveTo: {
                            additionalInformation: "SAPUI5.Component=BooAh",
                            applicationType: "URL",
                            url: "../con/stric/tor",
                            navigationMode: "embedded"
                        }
                    }]
                }
            };

            window["sap-ushell-config"] = {
                services: {
                    AppState: {
                        config: {
                            transient: false
                        }
                    }
                }

            };
            Container.init("local")
                .then(function () {
                    this.oNavTargetResolutionService = new NavTargetResolutionInternal(this.oAdapter, undefined, undefined, this.oServiceConfig);

                    Promise.all([
                        Container.getServiceAsync("MessageInternal"),
                        Container.getServiceAsync("AppState")
                    ])
                        .then(function (aServices) {
                            this.oMessageService = aServices[0];
                            this.oAppStateService = aServices[1];

                            this.oGetDistinctSemanticObjectsStub = sandbox.stub().resolves([]);
                            this.oClientSideResolveHashFragmentStub = sandbox.stub().resolves({ applicationType: "SAPUI5" });

                            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
                            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                                getDistinctSemanticObjects: this.oGetDistinctSemanticObjectsStub,
                                resolveHashFragment: this.oClientSideResolveHashFragmentStub
                            });

                            this.oGetServiceAsyncStub.callThrough();

                            done();
                        }.bind(this));
                }.bind(this));
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("localResolve - multiple targets", function (assert) {
        var done = assert.async();

        // Test first call
        this.oNavTargetResolutionService.resolveHashFragment("#Rabbit-run")
            .done(function (oResult) {
                assert.strictEqual(this.oResolveHashFragmentStub.callCount, 0, "The function resolveHashFragment of the adapter has not been called.");
                assert.strictEqual(oResult.additionalInformation, "SAPUI5.Component=Rabidrun", "The correct additionalInformation has been found.");

                // Test second call
                this.oNavTargetResolutionService.resolveHashFragment("#Snake-bite")
                    .done(function (oResult) {
                        assert.strictEqual(this.oResolveHashFragmentStub.callCount, 0, "The function resolveHashFragment of the adapter has not been called.");
                        assert.strictEqual(oResult.additionalInformation, "SAPUI5.Component=BooAh", "The correct additionalInformation has been found.");

                        // Test third call
                        this.oNavTargetResolutionService.resolveHashFragment("#Some-action")
                            .done(function () {
                                done();
                                assert.strictEqual(this.oResolveHashFragmentStub.callCount, 1, "The function resolveHashFragment of the adapter has been called once.");
                                assert.deepEqual(this.oResolveHashFragmentStub.firstCall.args, ["#Some-action"], "The function resolveHashFragment of the adapter has been called.");
                            }.bind(this))
                            .fail(function (error) {
                                assert.notOk(true, "The promise should have been resolved.");
                                done();
                                throw error;
                            });
                    }.bind(this))
                    .fail(function (error) {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                        throw error;
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    [{
        desc: "middle",
        hash: "#Rabbit-run?A=B&sap-ushell-enc-test=A%2520B%2520C&C=D",
        strippedHash: "#Rabbit-run?A=B&C=D",
        url: "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B&C=D"
    }, {
        desc: "single",
        hash: "#Rabbit-run?sap-ushell-enc-test=A%2520B%2520C",
        strippedHash: "#Rabbit-run",
        url: "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2"
    }, {
        desc: "end",
        hash: "#Rabbit-run?A=B&sap-ushell-enc-test=A%2520B%2520C",
        strippedHash: "#Rabbit-run?A=B",
        url: "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B"
    }, {
        desc: "front",
        hash: "#Rabbit-run?sap-ushell-enc-test=A%2520B%2520C&C=D",
        strippedHash: "#Rabbit-run?C=D",
        url: "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&C=D"
    }].forEach(function (oFixture) {
        QUnit.test("Resolution, error message and empty result if sap-ushell-enc-test present and malformed " + oFixture.desc, function (assert) {
            var done = assert.async();
            var oInvokeResolveHashChainSpy = sandbox.spy(this.oNavTargetResolutionService, "_invokeResolveHashChain");
            var oMessageErrorStub = sandbox.stub(this.oMessageService, "error");
            var oExpectedResult = {
                additionalInformation: "SAPUI5.Component=Rabidrun",
                applicationType: "URL",
                url: oFixture.url,
                navigationMode: "embedded",
                targetNavigationMode: "inplace",
                ui5ComponentName: "Rabidrun"
            };

            this.oNavTargetResolutionService.resolveHashFragment(oFixture.hash)
                .done(function (oResult) {
                    assert.strictEqual(oInvokeResolveHashChainSpy.firstCall.args[0], oFixture.strippedHash, "correct stripped hash");
                    assert.deepEqual(oResult, oExpectedResult, "The correct resolution result has been found.");
                    assert.ok(oMessageErrorStub.calledWith("This navigation is flagged as erroneous because" +
                        " (likely the calling procedure) generated a wrong encoded hash." +
                        " Please track down the encoding error and make sure to use the CrossApplicationNavigation service for navigation.",
                        "Navigation encoding wrong"), "Error method was called as expected");

                    done();
                })
                .fail(function (error) {
                    assert.notOk(true, "The promise should have been resolved.");
                    done();
                    throw error;
                });
        });
    });

    QUnit.test("Resolution, correct sap-ushell-enc-test is removed from url parameters and normal processing ensues", function (assert) {
        var done = assert.async();
        var oExpectedResult = {
            additionalInformation: "SAPUI5.Component=Rabidrun",
            applicationType: "URL",
            url: "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B&C=D",
            navigationMode: "embedded",
            targetNavigationMode: "inplace",
            ui5ComponentName: "Rabidrun"
        };

        this.oNavTargetResolutionService.resolveHashFragment("#Rabbit-run?A=B&sap-ushell-enc-test=A%20B%2520C&C=D")
            .done(function (oResult) {
                assert.deepEqual(oResult, oExpectedResult, "correct result");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Resolution with Adapter parameter expansion", function (assert) {
        var done = assert.async();

        this.oResolveHashFragmentStub.callsFake(function (sHash) {
            var oDeferred = new jQuery.Deferred();

            oDeferred.resolve({
                url: sHash,
                additionalInformation: "SAPUI5.Component=FunAtWork",
                text: "A text"
            });

            return oDeferred.promise();
        });

        var oNavTargetResolutionService = new NavTargetResolutionInternal(this.oAdapter);

        oNavTargetResolutionService.resolveHashFragment("#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=Key&FFF=33")
            .done(function (oResult) {
                assert.strictEqual(this.oResolveHashFragmentStub.callCount, 1, "no expansion");
                assert.ok(this.oResolveHashFragmentStub.calledWith("#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=Key&FFF=33"), "no expansion");
                assert.strictEqual(oResult.additionalInformation, "SAPUI5.Component=FunAtWork", "URL Unexpanded");
                assert.strictEqual(oResult.text, "A text", "text ok");

                var oAppState = this.oAppStateService.createEmptyAppState(new UIComponent(), false /* bTransient */);
                var sKey = oAppState.getKey();
                oAppState.setData("xxx=1234&Aaa=444");

                oAppState.save()
                    .done(function () {
                        WindowAdapter.prototype.data._clear(); //remove app state from window object
                        oNavTargetResolutionService.resolveHashFragment("#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=" + sKey + "&FFF=33")
                            .done(function (oSecondResult) {
                                done();
                                assert.ok(this.oResolveHashFragmentStub.calledWith("#Rabbit-run?AAA=33&Aaa=444&FFF=33&ZZZ=44&xxx=1234"), "url expanded");
                                assert.strictEqual(oSecondResult.additionalInformation, "SAPUI5.Component=FunAtWork", "additional info ok");
                            }.bind(this))
                            .fail(function (error) {
                                assert.notOk(true, "The promise should have been resolved.");
                                done();
                                throw error;
                            });
                    }.bind(this))
                    .fail(function (error) {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                        throw error;
                    });
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("getDistinctSemanticObjects: calls methods from the right service if CSTR is enabled", function (assert) {
        var done = assert.async();
        var oAdapterGetDistinctSemanticObjectsStub = sandbox.stub().returns(new jQuery.Deferred().resolve([]).promise());

        this.oAdapter.getDistinctSemanticObjects = oAdapterGetDistinctSemanticObjectsStub;
        this.oServiceConfig.config.enableClientSideTargetResolution = true;

        this.oNavTargetResolutionService.getDistinctSemanticObjects()
            .done(function () {
                assert.strictEqual(this.oGetDistinctSemanticObjectsStub.callCount, 1, "ClientSideTargetResolution#getDistinctSemanticObjects was called once");
                assert.strictEqual(oAdapterGetDistinctSemanticObjectsStub.callCount, 0, "NavTargetResolutionAdapter#getDistinctSemanticObjects was not called");
                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("getDistinctSemanticObjects: calls methods from the right service if CSTR is disabled", function (assert) {
        var done = assert.async();
        var oAdapterGetDistinctSemanticObjectsStub = sandbox.stub().returns(new jQuery.Deferred().resolve([]).promise());

        this.oAdapter.getDistinctSemanticObjects = oAdapterGetDistinctSemanticObjectsStub;
        this.oServiceConfig.config.enableClientSideTargetResolution = false;

        this.oNavTargetResolutionService.getDistinctSemanticObjects()
            .done(function () {
                assert.strictEqual(this.oGetDistinctSemanticObjectsStub.callCount, 0, "ClientSideTargetResolution#getDistinctSemanticObjects was called once");
                assert.strictEqual(oAdapterGetDistinctSemanticObjectsStub.callCount, 1, "NavTargetResolutionAdapter#getDistinctSemanticObjects was not called");
                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("getDistinctSemanticObjects: does not require ClientSideTargetResolution if it is disabled", function (assert) {
        var done = assert.async();

        this.oGetServiceAsyncStub.restore();
        var oGetServiceAsyncSpy = sandbox.spy(Container, "getServiceAsync");

        sandbox.stub(Log, "error"); // do not log to the console during the test

        this.oServiceConfig.config.enableClientSideTargetResolution = false;

        this.oNavTargetResolutionService.getDistinctSemanticObjects()
            .always(function () {
                assert.strictEqual(oGetServiceAsyncSpy.calledWith("ClientSideTargetResolution"), false, "sap.ushell.Container.getServiceAsync('ClientSideTargetResolution') was not called");
                done();
            });
    });

    QUnit.test("getDistinctSemanticObjects: logs an error when client side target resolution is disabled and method from the adapter is not implemented", function (assert) {
        var done = assert.async();
        this.oServiceConfig.config.enableClientSideTargetResolution = false;

        var oLogErrorStub = sandbox.stub(Log, "error");

        this.oNavTargetResolutionService.getDistinctSemanticObjects()
            .done(function () {
                assert.ok(false, "The promise should have been rejected.");
                done();
            })
            .fail(function () {
                assert.strictEqual(oLogErrorStub.callCount, 1, "Log.error was called once");
                assert.deepEqual(oLogErrorStub.firstCall.args, [
                    "Cannot execute getDistinctSemanticObjects method",
                    "ClientSideTargetResolution must be enabled or NavTargetResolutionAdapter must implement getDistinctSemanticObjects method",
                    "sap.ushell.services.NavTargetResolutionInternal"
                ], "Log.error was called with the expected arguments");
                done();
            });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("isIntentSupported: calls the adapter as expected", function (assert) {
        var aIntents = [/*content does not matter*/];
        var oResult;
        var oSimulatedResult = {/*jQuery.Deferred*/ };
        var oNavigationTargetResolution;
        var oNavigationTargetResolutionAdapter = {
            isIntentSupported: sandbox.stub().returns(oSimulatedResult),
            resolveHashFragment: sandbox.stub()
        };

        // prepare test
        oNavigationTargetResolution = new NavTargetResolutionInternal(oNavigationTargetResolutionAdapter);

        // code under test
        oResult = oNavigationTargetResolution.isIntentSupported(aIntents);

        // test
        assert.ok(oNavigationTargetResolutionAdapter.isIntentSupported.calledOnce);
        assert.ok(oNavigationTargetResolutionAdapter.isIntentSupported.calledWithExactly(aIntents));
        assert.strictEqual(oResult, oSimulatedResult);
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("isIntentSupported: uses ClientSideTargetResolution when configuration option is enabled", function (assert) {
        var done = assert.async();

        this.oServiceConfig.config.enableClientSideTargetResolution = true;
        var aIsIntentSupportedArgs = ["#Object1-action1", "#Object2-action2"];
        this.oIsIntentSupportedStub = sandbox.stub().resolves({
            "#Object1-action1": { supported: true },
            "#Object2-action2": { supported: true }
        });
        this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
            isIntentSupported: this.oIsIntentSupportedStub,
            getDistinctSemanticObjects: this.oGetDistinctSemanticObjectsStub,
            resolveHashFragment: this.oClientSideResolveHashFragmentStub
        });
        this.oNavTargetResolutionService.isIntentSupported(aIsIntentSupportedArgs)
            .done(function () {
                assert.strictEqual(this.oIsIntentSupportedStub.callCount, 1, "ClientSideTargetResolution#isIntentSupported was called once");
                assert.deepEqual(this.oIsIntentSupportedStub.firstCall.args[0], aIsIntentSupportedArgs, "ClientSideTargetResolution#isIntentSupported was called with expected arguments");
                assert.strictEqual(this.oAdapterIsIntentSupportedStub.callCount, 0, "NavTargetResolutionAdapter#isIntentSupported was not called");
                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("isIntentSupported does not require ClientSideTargetResolution service when ClientSideTargetResolution is disabled", function (assert) {
        var done = assert.async();

        this.oServiceConfig.enableClientSideTargetResolution = false;
        var oNavigationTargetResolution = new NavTargetResolutionInternal(/* oAdapter */ {
            // no isIntentSupported implemented in adapter
        });

        sandbox.spy(Container, "getService");

        oNavigationTargetResolution.isIntentSupported(["#Action-test"])
            .always(function () {
                assert.strictEqual(Container.getService.calledWith("ClientSideTargetResolution"), false, "sap.ushell.Container.getService was not called with ClientSideTargetResolution");
                done();
            });
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("isIntentSupported: missing in adapter", function (assert) {
        var oNavigationTargetResolution;
        var oNavigationTargetResolutionAdapter = {
            resolveHashFragment: sandbox.stub()
        };

        // prepare test
        oNavigationTargetResolution = new NavTargetResolutionInternal(oNavigationTargetResolutionAdapter);

        // code under test
        oNavigationTargetResolution.isIntentSupported(["#foo", "#bar"])
            .fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                // test
                assert.deepEqual(mSupportedByIntent, {
                    "#foo": { supported: undefined },
                    "#bar": { supported: undefined }
                });
            });
    });

    QUnit.test("isNavigationSupported", function (assert) {
        var aIntents = [/*content does not matter*/];
        var oResult,
            oSimulatedResult,
            oSimulatedResultValue;
        var oNavigationTargetResolutionAdapter = {
            resolveHashFragment: sandbox.stub()
        };
        var cnt = 0;
        var oNavigationTargetResolution;

        // prepare test
        aIntents = [
            { target: { semanticObject: "Obj1", action: "act1" } },
            {},
            { target: { semanticObject: "Obj1", action: "act1" } },
            {},
            { target: { semanticObject: "Obj1", action: "act1" }, params: { A: "V1" } },
            { target: { shellHash: "Obj3-act3&jumper=postman" } },
            "#Obj4-act4",
            "Obj5-act5",
            "#Obj5-act5",
            "notahash",
            "#alsonotahash"
        ];
        oSimulatedResultValue = {
            "#Obj1-act1": { supported: true },
            "#Obj3-act3&jumper=postman": { supported: true },
            "#Obj5-act5": { supported: true },
            "Obj1-act1?A=V1": { supported: false }
        };
        oSimulatedResult = new jQuery.Deferred();
        oNavigationTargetResolution = new NavTargetResolutionInternal(oNavigationTargetResolutionAdapter);
        sandbox.stub(oNavigationTargetResolution, "_isIntentSupported").returns(oSimulatedResult);
        // code under test
        oResult = oNavigationTargetResolution.isNavigationSupported(aIntents);

        // test
        assert.ok(oNavigationTargetResolution._isIntentSupported.calledOnce);
        assert.deepEqual(oNavigationTargetResolution._isIntentSupported.args[0][0], ["#Obj1-act1",
            "#",
            "#Obj1-act1",
            "#",
            "#Obj1-act1?A=V1",
            "#Obj3-act3&jumper=postman",
            "#Obj4-act4",
            "Obj5-act5",
            "#Obj5-act5",
            "notahash",
            "#alsonotahash"], "result passed on ok");
        oSimulatedResult.resolve(oSimulatedResultValue);
        cnt = 0;
        oResult.done(function (aRes) {
            cnt += 1;
            assert.deepEqual(aRes, [
                { supported: true },
                { supported: false },
                { supported: true },
                { supported: false },
                { supported: false },
                { supported: true },
                { supported: false },
                { supported: false },
                { supported: true },
                { supported: false },
                { supported: false }
            ], "expected resolution result");
        }).fail(function () {
            assert.ok(false, "called");
        });
        assert.ok(cnt > 0, "promise done");
    });

    /**
     * @deprecated As of version 1.119
     */
    QUnit.test("isNavigationSupported: failing isIntentSupported", function (assert) {
        var aIntents = [/*content does not matter*/];
        var oResult;
        var oNavigationTargetResolutionAdapter = {
            resolveHashFragment: sandbox.stub()
        };
        var cnt = 0;
        var oSimulatedResult,
            oNavigationTargetResolution;

        // prepare test
        aIntents = [
            { target: { semanticObject: "Obj1", action: "act1" } },
            {},
            { target: { semanticObject: "Obj1", action: "act1" } },
            { target: { semanticObject: "Obj1", action: "act1" }, params: { A: "V1" } }
        ];
        oSimulatedResult = new jQuery.Deferred().reject("not this way", "42", "33")
            .promise();
        oNavigationTargetResolution = new NavTargetResolutionInternal(oNavigationTargetResolutionAdapter);
        sandbox.stub(oNavigationTargetResolution, "_isIntentSupported").returns(oSimulatedResult);
        // code under test
        oResult = oNavigationTargetResolution.isNavigationSupported(aIntents);

        // test
        assert.ok(oNavigationTargetResolution._isIntentSupported.calledOnce);
        assert.deepEqual(oNavigationTargetResolution._isIntentSupported.args[0][0], ["#Obj1-act1", "#", "#Obj1-act1", "#Obj1-act1?A=V1"], "result passed on ok");
        cnt = 0;
        oResult.done(function () {
            assert.ok(false, "should not be called");
        }).fail(function (sMsg, a1, a2) {
            assert.ok(true, "called");
            assert.deepEqual([sMsg, a1, a2], ["not this way", "42", "33"], "args ok");
            assert.equal(sMsg, "not this way", "message transported");
            cnt += 1;
        });
        assert.ok(cnt > 0, "promise rejected");
    });

    [{
        description: "NWBC in URL ( strange)",
        inputHash: "#A-b?sap-system=EFG&AA=BBB",
        inputResolutionResult: {
            applicationType: "NWBC",
            url: "/some/url?AA=BB&sap-system=ABC",
            additionalInformation: "/some/additional/information"
        },
        expectedResult: "ABC"
    }, {
        description: "NWBC, standard",
        inputHash: "#A-b?sap-system=EFG&AA=BBB",
        inputResolutionResult: {
            applicationType: "NWBC",
            url: "/some/url?AA=BB",
            additionalInformation: "/some/additional/information"
        },
        expectedResult: "EFG"
    }, {
        description: "NWBC, no system",
        inputHash: "#A-b?xx-system=EFG&AA=BBB",
        inputResolutionResult: {
            applicationType: "NWBC",
            url: "/some/url?AA=BB",
            additionalInformation: "/some/additional/information"
        },
        expectedResult: undefined
    }, {
        description: "url with system",
        inputHash: "#A-b?sap-system=XX",
        inputResolutionResult: {
            applicationType: "URL",
            url: "/some/url?sap-system=U%20U",
            additionalInformation: "SAPUI5.Component=componentname"
        },
        expectedResult: "U U"
    }, {
        description: "url no system",
        inputHash: "#A-b",
        inputResolutionResult: {
            applicationType: "URL",
            url: "/some/url?no-system=X",
            additionalInformation: "SAPUI5.Component=componentname"
        },
        expectedResult: undefined
    }, {
        description: "url no system in results, hash system not used (!)",
        inputHash: "#A-b?sap-system=AAA",
        inputResolutionResult: {
            applicationType: "URL",
            url: "/some/url?XXX=BBB",
            additionalInformation: "SAPUI5.Component=componentname"
        },
        expectedResult: undefined
    }, {
        description: "SAPUI5",
        inputHash: "#A-b",
        inputResolutionResult: {
            applicationType: "SAPUI5",
            url: "/some/url?XXXX=AAAA",
            additionalInformation: "SAPUI5.Component=componentname"
        },
        expectedResult: undefined
    }].forEach(function (oFixture) {
        QUnit.test("getSapSystem for navigation: " + oFixture.description, function (assert) {
            var oNavigationTargetResolution = new NavTargetResolutionInternal({
                resolveHashFragment: sandbox.stub()
            });
            assert.strictEqual(oNavigationTargetResolution._getSapSystem(oFixture.inputHash, oFixture.inputResolutionResult), oFixture.expectedResult, "result ok  " + oFixture.description);
        });
    });

    [{
        testDescription: "resolution result is undefined",
        oResolutionResultAfterHashChain: undefined,
        expectedUi5ComponentName: undefined
    }, {
        testDescription: "correct component name is already set in property ui5ComponentName",
        oResolutionResultAfterHashChain: {
            ui5ComponentName: "some.ui5.component",
            "sap.platform.runtime": { some: "info" }
        },
        expectedUi5ComponentName: "some.ui5.component"
    }, {
        testDescription: "sap.platform.runtime is stripped",
        oResolutionResultAfterHashChain: {
            ui5ComponentName: "some.ui5.component",
            "sap.platform.runtime": { some: "info" }
        },
        expectedUi5ComponentName: "some.ui5.component"
    }, {
        testDescription: "correct component name is in additionalInformation and applicationType is URL",
        oResolutionResultAfterHashChain: {
            additionalInformation: "SAPUI5.Component=some.ui5.component",
            applicationType: "URL"
        },
        expectedUi5ComponentName: "some.ui5.component"
    }, {
        testDescription: "correct component name is in additionalInformation and applicationType is SAPUI5",
        oResolutionResultAfterHashChain: {
            additionalInformation: "SAPUI5.Component=some.ui5.component",
            applicationType: "SAPUI5"
        },
        expectedUi5ComponentName: "some.ui5.component"
    }].forEach(function (oFixture) {
        QUnit.test("resolveHashFragment extracts the ui5 component name from additionalInformation correctly after invoking the resolve hash chain if " + oFixture.testDescription, function (assert) {
            var done = assert.async();

            // Arrange
            sandbox.stub(this.oNavTargetResolutionService, "expandCompactHash").returns(new jQuery.Deferred().resolve("#Test-hashfragment").promise());
            sandbox.stub(this.oNavTargetResolutionService, "_invokeResolveHashChain").returns(new jQuery.Deferred().resolve(oFixture.oResolutionResultAfterHashChain).promise());
            sandbox.spy(this.oNavTargetResolutionService, "_adjustResolutionResultForUi5Components");

            // Act
            this.oNavTargetResolutionService.resolveHashFragment("#Test-hashfragment")
                .done(function (oResult) {
                    assert.equal((oResult && oResult["sap.platform.runtime"]), undefined, " runtime stripped if present");

                    if (oFixture.expectedUi5ComponentName) {
                        assert.strictEqual(oResult.ui5ComponentName, oFixture.expectedUi5ComponentName, "ui5ComponentName set correctly");
                    } else {
                        assert.strictEqual(oResult, oFixture.oResolutionResultAfterHashChain, "resolution result not modified");
                    }

                    assert.strictEqual(this.oNavTargetResolutionService._adjustResolutionResultForUi5Components.getCalls().length, 1, "_adjustResolutionResultForUi5Components was called once");
                    done();
                }.bind(this))
                .fail(function (error) {
                    assert.notOk(true, "The promise should have been resolved.");
                    done();
                    throw error;
                });
        });
    });

    QUnit.test("resolveHashFragment: fails if the passed hash fragment does not start with a hash", function (assert) {
        this.oServiceConfig.config.enableClientSideTargetResolution = true;

        assert.throws(function () {
            this.oNavTargetResolutionService.baseResolveHashFragment("Object-action");
        }, /Hash fragment expected in _validateHashFragment/);
    });

    QUnit.test("resolveHashFragment after async loading of component dependencies fails in bootstrap if ClientSideTargetResolution is enabled", function (assert) {
        var done = assert.async();
        sandbox.stub(this.oNavTargetResolutionService, "_resolveHashFragmentClientSide").returns(new jQuery.Deferred().resolve({}).promise());

        this.oServiceConfig.config.enableClientSideTargetResolution = true;

        this.oNavTargetResolutionService.baseResolveHashFragment("#Object-action")
            .done(function () {
                assert.ok(true, "even if the asynchronous loading of component dependencies in Boottask fails, resolveHashFragment resolves");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("resolveHashFragment after async loading of component dependencies fails in bootstrap if ClientSideTargetResolution is disabled", function (assert) {
        var done = assert.async();
        sandbox.stub(this.oNavTargetResolutionService, "_resolveHashFragmentClientSide").returns(new jQuery.Deferred().resolve({}).promise());

        this.oServiceConfig.config.enableClientSideTargetResolution = false;

        this.oNavTargetResolutionService.baseResolveHashFragment("#Object-action")
            .done(function () {
                assert.ok(true, "even if the asynchronous loading of component dependencies in Boottask fails, resolveHashFragment resolves");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("_resolveHashFragmentClientSide: returns URL application type when SAPUI5 application type is resolved", function (assert) {
        var done = assert.async();

        this.oNavTargetResolutionService._resolveHashFragmentClientSide("#Doesnt-matter")
            .done(function (oResolutionResult) {
                assert.strictEqual(oResolutionResult.applicationType, "URL", "resolved applicationType is URL");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("resolveHashFragment fixes the applicationType back to URL when SAPUI5 is returned after invoking the resolve hash chain", function (assert) {
        var done = assert.async();

        // Arrange
        sandbox.stub(this.oNavTargetResolutionService, "expandCompactHash").returns(new jQuery.Deferred().resolve("#Test-hashfragment").promise());
        sandbox.stub(this.oNavTargetResolutionService, "_invokeResolveHashChain").returns(new jQuery.Deferred().resolve({
            additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
            applicationType: "SAPUI5", // NOTE: not URL
            url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp"
        }).promise());
        sandbox.stub(oNavigationMode, "getNavigationMode");

        // Act
        this.oNavTargetResolutionService.resolveHashFragment("#Test-hashfragment")
            .done(function (oResult) {
                // Assert
                assert.strictEqual(oResult.applicationType, "URL", "applicationType was corrected to URL");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.module("The function getLinks", {
        beforeEach: function (assert) {
            var done = assert.async();

            this.oAdapterGetSemanticObjectLinksStub = sandbox.stub().returns(new jQuery.Deferred().resolve([]).promise());
            this.oAdapterGetLinksStub = sandbox.stub().returns(new jQuery.Deferred().resolve([]).promise());
            this.oAdapter = {
                getSemanticObjectLinks: this.oAdapterGetSemanticObjectLinksStub,
                getLinks: this.oAdapterGetLinksStub,
                resolveHashFragment: sandbox.stub()
            };

            this.oServiceConfig = {
                config: {
                    enableClientSideTargetResolution: false
                }
            };

            Container.init("local")
                .then(function () {
                    this.oNavTargetResolutionService = new NavTargetResolutionInternal(this.oAdapter, undefined, undefined, this.oServiceConfig);

                    Container.getServiceAsync("MessageInternal")
                        .then(function (MessageService) {
                            this.oMessageService = MessageService;

                            this.oParseShellHashStub = sandbox.stub();
                            this.oParseShellHashStub.returns({
                                params: []
                            });

                            this.oClientSideGetLinksStub = sandbox.stub().resolves([]);

                            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
                            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                                getLinks: this.oClientSideGetLinksStub
                            });

                            this.oHrefForExternalStub = sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise());
                            this.oShellNavigationInternal = {
                                hrefForExternal: this.oHrefForExternalStub
                            };
                            this.oGetServiceAsyncStub.withArgs("ShellNavigationInternal").resolves(this.oShellNavigationInternal);

                            done();
                        }.bind(this));
                }.bind(this));
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Uses ClientSideTargetResolution if enabled by configuration", function (assert) {
        var done = assert.async();

        this.oServiceConfig.config.enableClientSideTargetResolution = true;

        var oGetLinksArgs = {
            semanticObject: "Object",
            params: [],
            ignoreFormFactor: false
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                assert.strictEqual(this.oClientSideGetLinksStub.callCount, 1, "ClientSideTargetResolution#getLinks was called once");
                assert.deepEqual(this.oClientSideGetLinksStub.firstCall.args, [oGetLinksArgs], "ClientSideTargetResolution#getLinks was called with expected arguments");

                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 0, "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");
                assert.strictEqual(this.oAdapterGetLinksStub.callCount, 0, "NavTargetResolutionAdapter#getLinks was not called");
                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Uses adapter getLinks method when ClientSideTargetResolution is disabled by configuration", function (assert) {
        var done = assert.async();

        var oGetLinksArgs = {
            semanticObject: "Object",
            params: [],
            ignoreFormFactor: false
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                assert.ok(true, "promise was resolved");

                assert.strictEqual(this.oClientSideGetLinksStub.callCount, 0, "ClientSideTargetResolution#getLinks was called once");
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 0, "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");
                assert.strictEqual(this.oAdapterGetLinksStub.callCount, 1, "NavTargetResolutionAdapter#getLinks was not called");
                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    [{
        testDescription: "undefined parameter options",
        oParamsOptions: undefined,
        expectedWarningCall: false
    }, {
        testDescription: "parameter options as empty array",
        oParamsOptions: [],
        expectedWarningCall: false
    }, {
        testDescription: "parameter options in array",
        oParamsOptions: [
            { name: "param1", options: { someOption1: true } },
            { name: "param2", options: { someOption2: true } }
        ],
        expectedWarningCall: true
    }].forEach(function (oFixture) {
        QUnit.test("Logs a warning when ClientSideTargetResolution is disabled by configuration and " + oFixture.testDescription + " are specified in getLinks", function (assert) {
            var done = assert.async();

            var oGetLinksArgs = {
                semanticObject: "Object",
                params: [],
                paramsOptions: oFixture.oParamsOptions,
                ignoreFormFactor: false
            };

            var oLogWarningStub = sandbox.stub(Log, "warning");

            this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
                .always(function () {
                    if (oFixture.expectedWarningCall) {
                        assert.strictEqual(oLogWarningStub.callCount, 1, "Log.warning was called one time");

                        assert.strictEqual(oLogWarningStub.getCall(0).args[0],
                            "Parameter options supplied to #getLinks will be ignored because FLP is not configured to use sap.ushell.services.ClientSideTargetResolution for target resolution",
                            "Log.warning was called with the expected first argument");

                        if (oFixture.oParamsOptions) {
                            oFixture.oParamsOptions.forEach(function (oOptions) {
                                Object.keys(oOptions.options).forEach(function (sOptionName) {
                                    assert.ok((new RegExp(sOptionName)).test(oLogWarningStub.getCall(0).args[1]), sOptionName + " option was reported by Log.warning (second argument)");
                                });
                            });
                        }

                        assert.strictEqual(oLogWarningStub.getCall(0).args[2], "sap.ushell.services.NavTargetResolutionInternal", "Log.warning was called with the expected third argument");
                    } else {
                        assert.strictEqual(oLogWarningStub.callCount, 0, "Log.warning was not called");
                    }
                    done();
                });
        });
    });

    QUnit.test("Uses adapter getSemanticObjectLinks method when ClientSideTargetResolution is disabled by configuration and getLinks is not implemented in adapter", function (assert) {
        var done = assert.async();

        delete this.oAdapter.getLinks;

        var oGetLinksArgs = {
            semanticObject: "Object",
            params: [],
            ignoreFormFactor: false
        };

        var oLogWarningStub = sandbox.stub(Log, "warning");

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                assert.strictEqual(this.oClientSideGetLinksStub.callCount, 0, "ClientSideTargetResolution#getLinks was called once");
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 1, "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");
                assert.strictEqual(oLogWarningStub.callCount, 0, "Log.warning was called once");
                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    [
        undefined,
        "actionValue",
        null
    ].forEach(function (sFixture) {
        QUnit.test("Uses adapter getSemanticObjectLinks method and warns (because of action parameter) when ClientSideTargetResolution " +
            "is disabled by configuration, getLinks is not implemented in adapter and action is " + Object.prototype.toString.apply(sFixture), function (assert) {
                var done = assert.async();

                delete this.oAdapter.getLinks;

                var oLogWarningStub = sandbox.stub(Log, "warning");

                var oGetLinksArgs = {
                    semanticObject: "Object",
                    params: [],
                    ignoreFormFactor: false,
                    action: sFixture
                };

                this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
                    .done(function () {
                        assert.ok(true, "promise was resolved");

                        assert.strictEqual(this.oClientSideGetLinksStub.callCount, 0, "ClientSideTargetResolution#getLinks was called once");
                        assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 1, "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");
                        assert.strictEqual(oLogWarningStub.callCount, 1, "Log.warning was called once");

                        assert.deepEqual(oLogWarningStub.getCall(0).args, [
                            "A problem occurred while determining the resolver for getLinks",
                            "the action argument was given, however, NavTargetResolutionAdapter does not implement getLinks method. Action will be ignored.",
                            "sap.ushell.services.NavTargetResolutionInternal"
                        ], "Log.warning was called with the expected arguments");
                        done();
                    }.bind(this))
                    .fail(function (error) {
                        assert.notOk(true, "The promise should have been resolved.");
                        done();
                        throw error;
                    });
            });
    });

    QUnit.test("Throws an error if the semantic object contains parameters", function (assert) {
        assert.throws(function () {
            this.oNavTargetResolutionService.getLinks({
                semanticObject: "Action?foo"
            });
        }.bind(this), /Parameter must not be part of semantic object/);
    });

    QUnit.test("Resolves if parameters are undefined", function (assert) {
        var done = assert.async();

        this.oServiceConfig.config.enableClientSideTargetResolution = false;
        delete this.oAdapter.getLinks;

        var oGetLinksArgs = {
            semanticObject: "Action",
            params: undefined,
            ignoreFormFactor: true
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 1);
                assert.ok(this.oAdapterGetSemanticObjectLinksStub.calledWithExactly("Action", undefined, true));
                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Resolves if parameters are simple object parameters", function (assert) {
        var done = assert.async();

        this.oServiceConfig.config.enableClientSideTargetResolution = false;
        delete this.oAdapter.getLinks;

        var oParams = {
            A: "B",
            C: ["e'e", "j j"]
        };
        var oGetLinksArgs = {
            semanticObject: "Action",
            params: oParams,
            ignoreFormFactor: true
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 1);
                assert.ok(this.oAdapterGetSemanticObjectLinksStub.calledWithExactly("Action", oParams, true));
                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Throws an error if the parameters are part of the semanticObject", function (assert) {
        assert.throws(function () {
            this.oNavTargetResolutionService.getLinks({ semanticObject: "Action?foo" });
        }.bind(this), /Parameter must not be part of semantic object/);
    });

    QUnit.test("App state and undefined parameters", function (assert) {
        var done = assert.async();

        delete this.oAdapter.getLinks;

        var oGetLinksArgs = {
            semanticObject: "Action",
            params: undefined,
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                var oExpectedParams = {
                    "sap-xapp-state": "AKEY"
                };
                // test
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 1);
                assert.ok(this.oAdapterGetSemanticObjectLinksStub.calledWithExactly("Action", oExpectedParams, true));

                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("App state and object parameters", function (assert) {
        var done = assert.async();

        delete this.oAdapter.getLinks;

        var oParams = {
            A: "B",
            C: ["e'e", "j j"]
        };
        var oGetLinksArgs = {
            semanticObject: "Action",
            params: oParams,
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                var oExpectedParams = {
                    A: "B",
                    C: ["e'e", "j j"],
                    "sap-xapp-state": "AKEY"
                };
                // test
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 1);
                assert.ok(this.oAdapterGetSemanticObjectLinksStub.calledWithExactly("Action", oExpectedParams, true));

                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("App state and long url in parameters", function (assert) {
        var done = assert.async();

        // Arrange
        delete this.oAdapter.getLinks;
        this.oGetServiceAsyncStub.reset();
        this.oGetServiceAsyncStub.callThrough();

        var oParams = {
            A: "B",
            C: [
                "e'e",
                "j j",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
                "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894"
            ]
        };

        var oGetLinksArgs = {
            semanticObject: "Action",
            params: oParams,
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        };

        // Act
        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                // Assert
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 1);
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.firstCall.args[0], "Action", "first arg ok");

                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Returns non-compacted intents when bCompactIntents is false", function (assert) {
        var done = assert.async();

        var aVeryLongUrl = [];
        for (var i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        var sVeryLongUrl = aVeryLongUrl.join("&");
        var iVeryLongUrlLength = sVeryLongUrl.length + "#Object-action?".length;

        delete this.oAdapter.getLinks;
        this.oAdapterGetSemanticObjectLinksStub.returns(new jQuery.Deferred().resolve([
            { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
            { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
            { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
        ]).promise());

        var oGetLinksArgs = {
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: false
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function (aLinks) {
                assert.strictEqual(aLinks.length, 3, "getSemanticObjectLinks returned 3 results");
                assert.strictEqual(aLinks[0].intent.length, iVeryLongUrlLength, "intent in result 0 was not compacted");
                assert.strictEqual(aLinks[1].intent.length, iVeryLongUrlLength, "intent in result 1 was not compacted");
                assert.strictEqual(aLinks[2].intent.length, iVeryLongUrlLength, "intent in result 2 was not compacted");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Returns compacted intents when bCompactIntents is true", function (assert) {
        var done = assert.async();

        var aVeryLongUrl = [];
        for (var i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        var sVeryLongUrl = aVeryLongUrl.join("&");

        delete this.oAdapter.getLinks;
        this.oGetServiceAsyncStub.reset();
        this.oGetServiceAsyncStub.callThrough();

        this.oAdapterGetSemanticObjectLinksStub.returns(new jQuery.Deferred().resolve([
            { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
            { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
            { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
        ]).promise());

        var oGetLinksArgs = {
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: true
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function (aLinks) {
                assert.strictEqual(aLinks.length, 3, "getSemanticObjectLinks returned 3 results");

                assert.ok(aLinks[0].intent.length <= I_COMPACT_HASH_LENGTH_MAX, "intent in result 0 is shorter than " + I_COMPACT_HASH_LENGTH_MAX + " characters");
                assert.ok(aLinks[0].intent.indexOf("sap-intent-param") > 0, "sap-intent-param was found in the shortened intent of result 0");
                assert.ok(aLinks[0].intent.match(/^#.+-.+[?].*/), "shortened intent " + aLinks[0].intent + " has valid format");

                assert.ok(aLinks[1].intent.length <= I_COMPACT_HASH_LENGTH_MAX, "intent in result 1 is shorter than " + I_COMPACT_HASH_LENGTH_MAX + " characters");
                assert.ok(aLinks[1].intent.indexOf("sap-intent-param") > 0, "sap-intent-param was found in the shortened intent of result 1");
                assert.ok(aLinks[1].intent.match(/^#.+-.+[?].*/), "shortened intent " + aLinks[1].intent + " has valid format");

                assert.ok(aLinks[2].intent.length <= I_COMPACT_HASH_LENGTH_MAX, "intent in result 2 is shorter than " + I_COMPACT_HASH_LENGTH_MAX + " characters");
                assert.ok(aLinks[2].intent.indexOf("sap-intent-param") > 0, "sap-intent-param was found in the shortened intent of result 2");
                assert.ok(aLinks[2].intent.match(/^#.+-.+[?].*/), "shortened intent " + aLinks[2].intent + " has valid format");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Still resolves the promise if bCompactIntents is true and ShellNavigationInternal#compactParams fails", function (assert) {
        assert.expect(21);
        var done = assert.async();
        var aVeryLongUrl = [];

        var oLogWarningStub = sandbox.stub(Log, "warning");
        var oLogErrorStub = sandbox.stub(Log, "error");

        for (var i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        var sVeryLongUrl = aVeryLongUrl.join("&");
        var iVeryLongUrlLength = sVeryLongUrl.length + "#Object-action?".length;

        delete this.oAdapter.getLinks;
        this.oAdapterGetSemanticObjectLinksStub.returns(new jQuery.Deferred().resolve([
            { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
            { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
            { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
        ]).promise());

        this.oParseShellHashStub.returns({
            semanticObject: "Object",
            action: "action"
        });

        this.oHrefForExternalStub.returns(new jQuery.Deferred().resolve({
            hash: "#Action-dummyAction?sap-xapp-state=AKEY",
            params: undefined,
            skippedParams: undefined
        }).promise());

        this.oShellNavigationInternal.compactParams = sandbox.stub().returns(new jQuery.Deferred().reject("Error occurred").promise()); // NOTE: fails!

        var oGetLinksArgs = {
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: true // NOTE: compaction
        };
        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function (aResults) {
                assert.strictEqual(aResults.length, 3, "getSemanticObjectLinks returned 3 results");
                assert.strictEqual(oLogWarningStub.callCount, 3, "Log.warning was called 3 times");
                assert.strictEqual(oLogErrorStub.callCount, 0, "Log.error was called 0 times");

                var aCallArgs;
                for (var i = 0; i < aResults.length; i++) {
                    assert.strictEqual(aResults[i].intent.length, iVeryLongUrlLength, "intent in result " + i + " is returned unshortened");
                    assert.strictEqual(aResults[i].intent.indexOf("sap-intent-param"), -1, "sap-intent-param was not found in unshortened intent");

                    aCallArgs = oLogWarningStub.getCall(i).args;

                    assert.strictEqual(aCallArgs.length, 3, "The function Log.warning has been called with three parameters.");
                    assert.strictEqual(aCallArgs[0], "Cannot shorten GetSemanticObjectLinks result, using expanded form", "first argument of warning function is as expected for result " + i);
                    assert.ok(aCallArgs[1].match(/^Failure message: Error occurred; intent had title.*and link.*$/), "second argument of warning function is in expected format for result " + i);
                    assert.strictEqual(aCallArgs[2], "sap.ushell.services.NavTargetResolutionInternal", "third argument of warning function is as expected for result " + i);
                }

                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("getLinks with withAtLeastOneParam argument calls ClientSideTargetResolution as expected", function (assert) {
        var done = assert.async();

        this.oServiceConfig.config.enableClientSideTargetResolution = true;

        this.oHrefForExternalStub.returns(new jQuery.Deferred().resolve({
            hash: "#Action-dummyAction?A=B&C=e'e&C=j%2520j&sap-xapp-state=AKEY",
            params: undefined,
            skippedParams: undefined
        }).promise());

        var oGetLinksArgs = {
            semanticObject: "Action",
            params: {
                A: "B",
                C: ["e'e", "j j"]
            },
            withAtLeastOneParam: true,
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        };

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .always(function () {
                assert.strictEqual(this.oClientSideGetLinksStub.callCount, 1, "ClientSideTargetResolution#getLinks was called 1 time");
                assert.deepEqual(this.oClientSideGetLinksStub.firstCall.args, [oGetLinksArgs], "ClientSideTargetResolution#getLinks was called with the expected arguments");

                done();
            }.bind(this));
    });

    QUnit.test("With appState", function (assert) {
        var done = assert.async();

        var oGetLinksArgs = {
            semanticObject: "Action",
            params: {
                A: "B",
                C: ["e'e", "j j"]
            },
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        };

        var oExpectedParams = {
            A: "B",
            C: ["e'e", "j j"],
            "sap-xapp-state": "AKEY"
        };

        delete this.oAdapter.getLinks;

        this.oNavTargetResolutionService.getLinks(oGetLinksArgs)
            .done(function () {
                assert.strictEqual(this.oAdapterGetSemanticObjectLinksStub.callCount, 1);
                assert.ok(this.oAdapterGetSemanticObjectLinksStub.calledWithExactly("Action", oExpectedParams, true));

                done();
            }.bind(this))
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });


    QUnit.module("Usage Recorder enabled", {
        beforeEach: function () {
            this.oServiceConfig = {
                config: {
                    enableClientSideTargetResolution: false,
                    usageRecorder: {
                        enabled: true,
                        serviceUrl: "/navigation/api/v2/record"
                    }
                }
            };
            this.oAdapter = new NavTargetResolutionAdapter();
            this.oNavTargetResolutionService = new NavTargetResolutionInternal(this.oAdapter, undefined, undefined, this.oServiceConfig);
            this.oHttpPostStub = sandbox.stub(HttpClient.prototype, "post");

            return Container.init("local");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("The recorder is called in resolveHashFragment", function (assert) {
        // Act
        return this.oNavTargetResolutionService.resolveHashFragment("#Test-config?A=B").done(function (oResult) {
            // Assert
            assert.ok(this.oHttpPostStub.calledOnce, "The httpClient post method was called once.");
            assert.deepEqual(this.oHttpPostStub.firstCall.args, [
                "/navigation/api/v2/record",
                {
                    headers: {
                        "content-type": "application/json; charset=utf-8"
                    },
                    data: {
                        function: "resolveHashFragment",
                        parameters: "{\"sHashFragment\":\"#Test-config?A=B\"}",
                        result: "{\"applicationType\":\"URL\",\"url\":\"/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp\"," +
                            "\"additionalInformation\":\"SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp\",\"navigationMode\":\"embedded\"," +
                            "\"ui5ComponentName\":\"sap.ushell.demoapps.FioriSandboxConfigApp\"," +
                            "\"targetNavigationMode\":\"inplace\"}"
                    }
                }
            ], "The httpClient post method was called with the expected arguments.");

            assert.deepEqual(oResult, {
                applicationType: "URL",
                url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
                additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
                ui5ComponentName: "sap.ushell.demoapps.FioriSandboxConfigApp",
                navigationMode: "embedded",
                targetNavigationMode: "inplace"
            }, "The result was correctly returned.");
        }.bind(this));
    });

    QUnit.test("The recorder is called in getLinks", function (assert) {
        // Act
        return this.oNavTargetResolutionService.getLinks({
            semanticObject: "Action",
            params: {
                A: "B",
                C: [
                    "e'e",
                    "j j"
                ]
            },
            ignoreFormFactor: true,
            appStateKey: "AKEY"
        }).done(function (aLinks) {
            // Assert
            assert.ok(this.oHttpPostStub.calledOnce, "The httpClient post method was called once.");
            assert.deepEqual(this.oHttpPostStub.firstCall.args, [
                "/navigation/api/v2/record",
                {
                    headers: {
                        "content-type": "application/json; charset=utf-8"
                    },
                    data: {
                        function: "getLinks",
                        parameters: '{"oArgs":{"semanticObject":"Action","params":{"A":"B","C":["e\'e","j j"]},"ignoreFormFactor":true,"appStateKey":"AKEY"}}',
                        result: '[{"applicationType":"SAPUI5","ui5ComponentName":"sap.ushell.renderer.search.searchComponent",' +
                            '"additionalInformation":"SAPUI5.Component=sap.ushell.renderer.search.searchComponent",' +
                            '"url":"resources/sap/ushell/renderer/search/searchComponent","loadCoreExt":true,"loadDefaultDependencies":false,' +
                            '"id":"Action-search","text":"no text","intent":"#Action-search?A=B&C=e\'e&C=j%20j&sap-xapp-state=AKEY"}]'
                    }
                }
            ], "The httpClient post method was called with the expected arguments.");

            assert.deepEqual(aLinks, [
                {
                    applicationType: "SAPUI5",
                    ui5ComponentName: "sap.ushell.renderer.search.searchComponent",
                    additionalInformation: "SAPUI5.Component=sap.ushell.renderer.search.searchComponent",
                    url: "resources/sap/ushell/renderer/search/searchComponent",
                    loadCoreExt: true,
                    loadDefaultDependencies: false,
                    id: "Action-search",
                    text: "no text",
                    intent: "#Action-search?A=B&C=e'e&C=j%20j&sap-xapp-state=AKEY"
                }
            ], "The result was correctly returned.");
        }.bind(this));
    });

    QUnit.test("The recorder is called in getDistinctSemanticObjects", function (assert) {
        // Arrange
        sandbox.stub(Container, "getServiceAsync").withArgs("ClientSideTargetResolution").resolves({
            getDistinctSemanticObjects: sandbox.stub().resolves(["ObjectA", "ObjectB", "ObjectC"])
        });
        this.oServiceConfig.config.enableClientSideTargetResolution = true;

        // Act
        return this.oNavTargetResolutionService.getDistinctSemanticObjects().done(function (aResults) {
            // Assert
            assert.ok(this.oHttpPostStub.calledOnce, "The httpClient post method was called once.");

            assert.deepEqual(this.oHttpPostStub.firstCall.args, [
                "/navigation/api/v2/record",
                {
                    headers: {
                        "content-type": "application/json; charset=utf-8"
                    },
                    data: {
                        function: "getDistinctSemanticObjects",
                        parameters: "{}",
                        result: '["ObjectA","ObjectB","ObjectC"]'
                    }
                }
            ], "The httpClient post method was called with the expected arguments.");

            assert.deepEqual(aResults, ["ObjectA", "ObjectB", "ObjectC"], "The result was correctly returned.");
        }.bind(this));
    });

    QUnit.test("The recorder is called in isNavigationSupported", function (assert) {
        // Arrange
        var oSimulatedResultValue = {
            "#Obj1-act1": { supported: true },
            "#Obj3-act3&jumper=postman": { supported: true },
            "#Obj5-act5": { supported: true },
            "Obj1-act1?A=V1": { supported: false }
        };
        sandbox.stub(this.oNavTargetResolutionService, "_isIntentSupported").returns(new jQuery.Deferred().resolve(oSimulatedResultValue).promise());

        // Act
        return this.oNavTargetResolutionService.isNavigationSupported([
                { target: { semanticObject: "Obj1", action: "act1" } },
                {},
                { target: { semanticObject: "Obj1", action: "act1" } },
                {},
                { target: { semanticObject: "Obj1", action: "act1" }, params: { A: "V1" } },
                { target: { shellHash: "Obj3-act3&jumper=postman" } },
                "#Obj4-act4",
                "Obj5-act5",
                "#Obj5-act5",
                "notahash",
                "#alsonotahash"
            ]).done(function (aResults) {
            // Assert
            assert.ok(this.oHttpPostStub.calledOnce, "The httpClient post method was called once.");

            assert.deepEqual(this.oHttpPostStub.firstCall.args, [
                "/navigation/api/v2/record",
                {
                    headers: {
                        "content-type": "application/json; charset=utf-8"
                    },
                    data: {
                        function: "isNavigationSupported",
                        parameters: '{"aIntents":[{"target":{"semanticObject":"Obj1","action":"act1"}},{"target":{}},' +
                            '{"target":{"semanticObject":"Obj1","action":"act1"}},{"target":{}},' +
                            '{"target":{"semanticObject":"Obj1","action":"act1"},"params":{"A":"V1"}},' +
                            '{"target":{"shellHash":"Obj3-act3&jumper=postman"}},' +
                            '"#Obj4-act4","Obj5-act5","#Obj5-act5","notahash","#alsonotahash"]}',
                        result: '[{"supported":true},{"supported":false},{"supported":true},{"supported":false},' +
                            '{"supported":false},{"supported":true},{"supported":false},{"supported":false},' +
                            '{"supported":true},{"supported":false},{"supported":false}]'
                    }
                }
            ], "The httpClient post method was called with the expected arguments.");

            assert.deepEqual(aResults, [
                {supported: true}, {supported: false}, {supported: true}, {supported: false},
                {supported: false}, {supported: true}, {supported: false}, {supported: false},
                {supported: true}, {supported: false}, {supported: false}
            ], "The result was correctly returned.");
        }.bind(this));
    });
});

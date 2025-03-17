// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.NavTargetResolution and customizable
 * extensions
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/adapters/local/NavTargetResolutionAdapter",
    "sap/ushell/services/NavTargetResolution"
], function (
    jQuery,
    sinon,
    NavTargetResolutionAdapter,
    NavTargetResolution
) {
    "use strict";

    /* global QUnit */

    var sandbox = sinon.createSandbox();
    var Container = sap.ui.require("sap/ushell/Container");

    QUnit.module("sap.ushell.services.NavTargetResolution", {
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
                    this.oNavTargetResolutionService = new NavTargetResolution(this.oAdapter, undefined, undefined, this.oServiceConfig);

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

});

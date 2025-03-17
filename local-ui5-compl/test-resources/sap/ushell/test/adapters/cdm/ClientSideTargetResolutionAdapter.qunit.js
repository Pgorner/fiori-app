// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/adapters/cdm/ClientSideTargetResolutionAdapter",
    "sap/ushell/Container",
    "sap/ushell/test/utils"
], function (
    Log,
    jQuery,
    ClientSideTargetResolutionAdapter,
    Container,
    testUtils
) {
    "use strict";

    /* global QUnit, sinon */

    var O_LOCAL_SYSTEM_ALIAS = {
        http: {
            host: "",
            port: 0,
            pathPrefix: "/sap/bc/"
        },
        https: {
            host: "",
            port: 0,
            pathPrefix: "/sap/bc/"
        },
        rfc: {
            systemId: "",
            host: "",
            service: 0,
            loginGroup: "",
            sncNameR3: "",
            sncQoPR3: ""
        },
        id: "",
        label: "local",
        client: "",
        language: "",
        properties: {
            productName: ""
        }
    };

    var O_SYSTEM_ALIASES = {
        AA2CLNT000: {
            id: "AA2CLNT000",
            client: "000",
            systemId: "AB2",
            language: "EN",
            http: {
                host: "ldcaa2.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcaa2.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "AB2",
                host: "ldcsaa2.xyz.com",
                service: 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        AB2CLNT000: {
            id: "AB2CLNT000",
            client: "000",
            systemId: "AB2",
            language: "EN",
            http: {
                host: "ldcab2.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcab2.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "AB2",
                host: "ldcsab2.xyz.com",
                service: 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        AB1CLNT000: {
            id: "AB1CLNT000",
            client: "000",
            systemId: "AB1",
            language: "EN",
            properties: {
                productName: "AS Server"
            },
            http: {
                host: "ldcab1.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcab1.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "AB1",
                host: "ldcsab1.xyz.com",
                service: 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        XYZCLNT000: {
            id: "XYZCLNT000",
            client: "000",
            systemId: "XYZ",
            language: "EN",
            http: {
                host: "ldcxyz.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcxyz.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "XYZ",
                host: "ldcxyz.xyz.com",
                service: 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        DuplicateToAbove: {
            id: "duplicateToAbove",
            client: "000",
            systemId: "XYZ",
            language: "EN",
            http: {
                host: "ldcxyz.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcxyz.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "XYZ",
                host: "ldcxyz.xyz.com",
                service: 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        "sid(U1Y.120)": {
            id: "sid(U1Y.120)",
            client: "120",
            language: "EN",
            http: {
                host: "ldcu1y.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcu1y.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "U1Y",
                host: "ldcu1y.xyz.com",
                service: 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        },
        U2YCLNT120: {
            id: "U2YCLNT120",
            client: "120",
            language: "EN",
            http: {
                host: "ldcu2y.xyz.com",
                port: 10000,
                pathPrefix: "/abc/def/"
            },
            https: {
                host: "ldcu2y.xyz.com",
                port: 20000,
                pathPrefix: "/abc/def/"
            },
            rfc: {
                systemId: "U2Y",
                host: "ldcu2y.xyz.com",
                service: 3444,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: "8"
            }
        }
    };

    QUnit.module("sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter", {
        beforeEach: function () {
            this.oAdapter = new ClientSideTargetResolutionAdapter(
                undefined, undefined, {
                config: {}
            });
            return Container.init("local");
        },
        afterEach: function () {
            testUtils.restoreSpies(
                Log.error,
                Log.warning
            );
            delete this.oAdapter;
        }
    });

    [{
        testDescription: "site promise is rejected",
        sSystemAlias: "anything",
        bGetSystemAliasesPromiseRejected: true,
        expectedSystemAliasPromiseRejected: true, // test this
        expectedSystemAliasPromiseRejectedArg: undefined,
        expectedSystemAliasPromiseRejectedWarningArgs: undefined,
        oSystemAliases: { any: "thing" }
    }, {
        testDescription: "system alias is the empty string",
        sSystemAlias: "",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: false,
        oSystemAliases: {}, // nothing known
        expectedSystemAliasData: O_LOCAL_SYSTEM_ALIAS
    }, {
        testDescription: "system alias is the empty string without system properties defined",
        sSystemAlias: "",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: false,
        oSystemAliases: { // another local system alias comes from the site
            "": {
                id: "",
                client: "123",
                language: "it",
                http: {},
                https: {},
                rfc: {}
            }
        },
        expectedSystemAliasData: {
            id: "",
            client: "123",
            language: "it",
            http: {},
            https: {},
            rfc: {},
            properties: {
                productName: ""
            }
        }
    }, {
        testDescription: "system alias is the empty string with system properties defined",
        sSystemAlias: "",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: false,
        oSystemAliases: { // another local system alias comes from the site
            "": {
                id: "",
                client: "123",
                language: "it",
                http: {},
                https: {},
                rfc: {},
                properties: {
                    productName: "My product name"
                }
            }
        },
        expectedSystemAliasData: {
            id: "",
            client: "123",
            language: "it",
            http: {},
            https: {},
            rfc: {},
            properties: {
                productName: "My product name"
            }
        }
    }, {
        testDescription: "a non-existing system alias is to be resolved",
        sSystemAlias: "DOES_NOT_EXIST",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: true,
        expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias DOES_NOT_EXIST",
        expectedSystemAliasPromiseRejectedWarningArgs: [
            "Cannot resolve system alias DOES_NOT_EXIST",
            "The system alias cannot be found in the site response",
            "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
        ],
        oSystemAliases: {}
    }, {
        testDescription: "system alias exists",
        sSystemAlias: "AB1CLNT000",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: false,
        oSystemAliases: O_SYSTEM_ALIASES,
        expectedSystemAliasData: O_SYSTEM_ALIASES.AB1CLNT000
    }, {
        testDescription: "SID exists",
        sSystemAlias: "sid(AB1.000)",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: false,
        oSystemAliases: O_SYSTEM_ALIASES,
        expectedSystemAliasData: O_SYSTEM_ALIASES.AB1CLNT000
    }, {
        testDescription: "SID does not exist -- empty alias object",
        sSystemAlias: "sid(AB1.000)",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: true,
        expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias SID(AB1.000)",
        oSystemAliases: {}
    }, {
        testDescription: "SID does not exist",
        sSystemAlias: "sid(ABC.100)",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: true,
        expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias SID(ABC.100)",
        expectedSystemAliasPromiseRejectedWarningArgs: [
            "Cannot resolve system alias SID(ABC.100)",
            "The system alias cannot be found in the site response",
            "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
        ],
        oSystemAliases: O_SYSTEM_ALIASES
    }, {
        testDescription: "SID exist but with mixed case",
        sSystemAlias: "SiD(ab1.000)",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: false,
        oSystemAliases: O_SYSTEM_ALIASES,
        expectedSystemAliasData: O_SYSTEM_ALIASES.AB1CLNT000
    }, {
        testDescription: "resolve directly on SID",
        sSystemAlias: "sid(U1Y.120)",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: false,
        oSystemAliases: O_SYSTEM_ALIASES,
        expectedSystemAliasData: O_SYSTEM_ALIASES["sid(U1Y.120)"]
    }, {
        testDescription: "SID exists with more matching system Aliases",
        sSystemAlias: "sid(AB2.000)",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: false,
        oSystemAliases: O_SYSTEM_ALIASES,
        expectedSystemAliasData: O_SYSTEM_ALIASES.AA2CLNT000 //First alphabetically sorted System Alias is returned
    }, {
        testDescription: "SID exist but no system Id",
        sSystemAlias: "SID(U2Y.120)",
        bGetSystemAliasesPromiseRejected: false,
        expectedSystemAliasPromiseRejected: true,
        expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias SID(U2Y.120)",
        expectedSystemAliasPromiseRejectedWarningArgs: [
            "Cannot resolve system alias SID(U2Y.120)",
            "The system alias cannot be found in the site response",
            "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
        ],
        oSystemAliases: O_SYSTEM_ALIASES
    }].forEach(function (oFixture) {
        QUnit.test("resolveSystemAlias: " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            sinon.stub(Log, "warning");

            var oGetSystemAliasesStub = sinon.stub(this.oAdapter, "_getSystemAliases");
            if (oFixture.bGetSystemAliasesPromiseRejected) {
                oGetSystemAliasesStub.returns(new jQuery.Deferred().reject().promise());
            } else {
                oGetSystemAliasesStub.returns(new jQuery.Deferred().resolve(oFixture.oSystemAliases).promise());
            }

            this.oAdapter.resolveSystemAlias(oFixture.sSystemAlias)
                .done(function (oResolvedSystemAlias) {
                    if (oFixture.expectedSystemAliasPromiseRejected) {
                        assert.ok(false, "promise was rejected");
                    } else {
                        assert.ok(true, "promise was resolved");
                    }

                    if (typeof oFixture.checkReturnedSystemAlias === "function") {
                        oFixture.checkReturnedSystemAlias(oResolvedSystemAlias);
                    } else {
                        assert.deepEqual(oResolvedSystemAlias, oFixture.expectedSystemAliasData, "resolved to the expected system alias");
                    }
                })
                .fail(function (sMessage) {
                    if (oFixture.expectedSystemAliasPromiseRejected) {
                        assert.ok(true, "promise was rejected");

                        if (oFixture.expectedSystemAliasPromiseRejectedWarningArgs) {
                            assert.strictEqual(Log.warning.callCount, 1, "Log.warning was called 1 time");

                            assert.deepEqual(Log.warning.getCall(0).args, oFixture.expectedSystemAliasPromiseRejectedWarningArgs,
                                "Log.warning called as expected");
                        }

                        assert.strictEqual(sMessage, oFixture.expectedSystemAliasPromiseRejectedArg,
                            "promise was rejected with the expected message");
                    } else {
                        assert.ok(false, "promise was resolved");
                    }
                })
                .always(done);
        });
    });

    [{
        testDescription: "site promise resolves with system aliases",
        bSitePromiseRejected: false,
        oSiteSystemAliases: {
            UI2_WDA: {
                http: {
                    host: "",
                    port: 0,
                    pathPrefix: ""
                },
                https: {
                    host: "example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    systemId: "",
                    host: "",
                    service: 32,
                    loginGroup: "",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                client: "111",
                language: ""
            },
            U1YCLNT000: {
                http: {
                    host: "",
                    port: 0,
                    pathPrefix: ""
                },
                https: {
                    host: "example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    systemId: "",
                    host: "",
                    service: 32,
                    loginGroup: "",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                client: "000",
                language: ""
            },
            U1YCLNT111: {
                http: {
                    host: "",
                    port: 0,
                    pathPrefix: ""
                },
                https: {
                    host: "example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    systemId: "",
                    host: "",
                    service: 32,
                    loginGroup: "",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                client: "111",
                language: ""
            }
        },
        expectedSystemAliases: {
            UI2_WDA: {
                http: {
                    host: "",
                    port: 0,
                    pathPrefix: ""
                },
                https: {
                    host: "example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    systemId: "",
                    host: "",
                    service: 32,
                    loginGroup: "",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                id: "UI2_WDA",
                client: "111",
                language: ""
            },
            U1YCLNT000: {
                http: {
                    host: "",
                    port: 0,
                    pathPrefix: ""
                },
                https: {
                    host: "example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    systemId: "",
                    host: "",
                    service: 32,
                    loginGroup: "",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                id: "U1YCLNT000",
                client: "000",
                language: ""
            },
            U1YCLNT111: {
                http: {
                    host: "",
                    port: 0,
                    pathPrefix: ""
                },
                https: {
                    host: "example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    systemId: "",
                    host: "",
                    service: 32,
                    loginGroup: "",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                id: "U1YCLNT111",
                client: "111",
                language: ""
            }
        },
        expectedPromiseReject: false
    }, {
        testDescription: "site promise rejects with an error message",
        bSitePromiseRejected: true,
        sSitePromiseRejectedWith: "deliberate error message",
        expectedPromiseReject: true,
        expectedPromiseRejectWith: "deliberate error message"
    }].forEach(function (oFixture) {
        QUnit.test("_getSystemAliases: returns the expected system aliases when " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var oCDMServiceStub = {
                getSiteWithoutPersonalization: function () {
                    var oSiteResponse = {
                        systemAliases: oFixture.oSiteSystemAliases
                    };

                    if (oFixture.bSitePromiseRejected) {
                        return new jQuery.Deferred().reject(oFixture.sSitePromiseRejectedWith).promise();
                    }

                    return new jQuery.Deferred().resolve(oSiteResponse).promise();
                }
            };
            var oCDMServiceAsyncStub = new jQuery.Deferred().resolve(oCDMServiceStub).promise();

            var fnGetServiceAsyncStub = sinon.stub(Container, "getServiceAsync").returns(oCDMServiceAsyncStub);

            this.oAdapter._getSystemAliases()
                .done(function (oSystemAliases) {
                    if (oFixture.expectedPromiseReject) {
                        assert.ok(false, "promise was rejected");
                    } else {
                        assert.ok(true, "promise was resolved");
                    }

                    assert.deepEqual(oSystemAliases, oFixture.expectedSystemAliases,
                        "got the expected system aliases");
                })
                .fail(function (sErr) {
                    if (oFixture.expectedPromiseReject) {
                        assert.ok(true, "promise was rejected");

                        assert.deepEqual(
                            sErr,
                            oFixture.expectedPromiseRejectWith,
                            "the promise was rejected with the expected arguments"
                        );
                    } else {
                        assert.ok(false, "promise was resolved");
                    }
                })
                .always(function () {
                    fnGetServiceAsyncStub.restore();
                    done();
                });
        });
    });

    [{
        testDescription: "site data is empty",
        oSiteData: {},
        expectedInbounds: []
    }, {
        testDescription: "single application with minimal settings defined",
        oSiteData: {
            _version: "3.0.0",
            applications: {
                AppDescId1234: {
                    "sap.app": {
                        title: "translated title of application",
                        applicationVersion: { version: "1.0.0" },
                        crossNavigation: {
                            inbounds: {
                                start: {
                                    semanticObject: "Display",
                                    action: "Desktop"
                                }
                            }
                        }
                    },
                    "sap.ui": {
                        technology: "WDA",
                        deviceTypes: {
                            desktop: true,
                            tablet: false,
                            phone: false
                        }
                    }
                }
            }
        },
        expectedInbounds: [{
            action: "Desktop",
            contentProviderId: "",
            deviceTypes: {
                desktop: true,
                phone: false,
                tablet: false
            },
            icon: undefined,
            info: undefined,
            keywords: undefined,
            numberUnit: undefined,
            resolutionResult: {
                appId: undefined,
                applicationType: "WDA",
                "sap.wda": undefined,
                systemAlias: undefined,
                systemAliasSemantics: "apply",
                text: "translated title of application",
                "sap.ui": { technology: "WDA" }
            },
            semanticObject: "Display",
            shortTitle: undefined,
            signature: {
                additionalParameters: "allowed",
                parameters: {}
            },
            subTitle: undefined,
            tileResolutionResult: {
                appId: undefined,
                contentProviderId: "",
                dataSources: undefined,
                description: undefined,
                deviceTypes: {
                    desktop: true,
                    phone: false,
                    tablet: false
                },
                icon: undefined,
                indicatorDataSource: undefined,
                info: undefined,
                isCard: false,
                runtimeInformation: undefined,
                size: undefined,
                subTitle: undefined,
                technicalInformation: undefined,
                tileComponentLoadInfo: {},
                title: "translated title of application",
                keywords: undefined,
                numberUnit: undefined
            },
            title: "translated title of application"
        }]
    }].forEach(function (oFixture) {
        QUnit.test("getInbounds returns the correct inbounds when " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var oAdapter,
                oSystem = {};

            // Arrange
            var oCDMServiceStub = {
                getSiteWithoutPersonalization: function () {
                    return new jQuery.Deferred().resolve(oFixture.oSiteData).promise();
                }
            };
            var oCDMServiceAsyncStub = new jQuery.Deferred().resolve(oCDMServiceStub).promise();
            var fnGetServiceAsyncStub = sinon.stub(Container, "getServiceAsync").returns(oCDMServiceAsyncStub);
            // Act
            sap.ui.require([
                "sap/ushell/adapters/cdm/ClientSideTargetResolutionAdapter"
            ], function (
                ClientSideTargetResolutionAdapter
            ) {
                oAdapter = new ClientSideTargetResolutionAdapter(oSystem);
                oAdapter.getInbounds()
                    .fail(function (sMessage) {
                        assert.ok(false, "getInbounds was rejected with message '" + sMessage + "'.");
                    })
                    .done(function (aInbounds) {
                        // Assert
                        assert.ok(Container.getServiceAsync.calledWith("CommonDataModel"));
                        assert.deepEqual(aInbounds, oFixture.expectedInbounds, "ok");
                        fnGetServiceAsyncStub.restore();
                        done();
                    });
            });
        });
    });

    QUnit.test("getInbounds rejects as expected when CDM site promise rejects", function (assert) {
        var done = assert.async();
        // Arrange
        var oCDMServiceStub = {
            getSiteWithoutPersonalization: function () {
                return new jQuery.Deferred().reject("deliberate error").promise();
            }
        };
        var oCDMServiceAsyncStub = new jQuery.Deferred().resolve(oCDMServiceStub).promise();
        var fnGetServiceAsyncStub = sinon.stub(Container, "getServiceAsync").returns(oCDMServiceAsyncStub);

        this.oAdapter.getInbounds()
            .fail(function (sMessage) {
                assert.ok(true, "promise was rejected");

                assert.strictEqual(sMessage, "deliberate error",
                    "promise was rejected with the expected error message");
            })
            .done(function (aInbounds) {
                assert.ok(false, "promise was resolved");
            })
            .always(function () {
                fnGetServiceAsyncStub.restore();
                done();
            });
    });

    QUnit.test("#_createSIDMap does create a proper SID map", function (assert) {
        var oSIDMap = this.oAdapter._createSIDMap(O_SYSTEM_ALIASES);
        var oExpectedSIDMap = {
            "SID(XYZ.000)": "DuplicateToAbove",
            "SID(AB2.000)": "AA2CLNT000",
            "SID(AB1.000)": "AB1CLNT000"
        };
        assert.deepEqual(oSIDMap, oExpectedSIDMap, "returned correct sid map");
    });

    QUnit.test("getContentProviderDataOriginsLookup: return null when contentProviderDataOrigins is not defined in the site", function (assert) {
        var fnDone = assert.async();

        var oCDMServiceStub = {
            getSiteWithoutPersonalization: sinon.stub().returns({})
        };
        var fnGetServiceAsyncStub = sinon.stub(Container, "getServiceAsync").returns(Promise.resolve(oCDMServiceStub));

        this.oAdapter.getContentProviderDataOriginsLookup()
            .then(function (oResult) {
                assert.ok(true, "The promise should be resolved");
                assert.strictEqual(oCDMServiceStub.getSiteWithoutPersonalization.callCount, 1, "getSite was called");
                assert.strictEqual(oResult, null, "Expect null because contentProviderDataOrigins is not defined in the site");
            }, function () {
                assert.ok(false, "The promise should be resolved");
            })
            .then(function () {
                fnGetServiceAsyncStub.restore();
                fnDone();
            });
    });

    QUnit.test("getContentProviderDataOriginsLookup: return lookup object when contentProviderDataOrigins is defined in the site", function (assert) {
        var fnDone = assert.async();

        var oContentProviderDataOrigins = {
            CP1: {
                CP1: true,
                SYS1: true,
                SYS3: true
            },
            CP2: {
                CP2: true
            }
        };
        var oCDMServiceStub = {
            getSiteWithoutPersonalization: sinon.stub().returns(Promise.resolve({
                contentProviderDataOrigins: oContentProviderDataOrigins
            }))
        };
        var fnGetServiceAsyncStub = sinon.stub(Container, "getServiceAsync").returns(Promise.resolve(oCDMServiceStub));

        this.oAdapter.getContentProviderDataOriginsLookup()
            .then(function (oResult) {
                assert.ok(true, "The promise should be resolved");
                assert.strictEqual(oCDMServiceStub.getSiteWithoutPersonalization.callCount, 1, "getSite was called");
                assert.deepEqual(oResult, oContentProviderDataOrigins, "Expect contentProviderDataOrigins from site");
            }, function () {
                assert.ok(false, "The promise should be resolved");
            })
            .then(function () {
                fnGetServiceAsyncStub.restore();
                fnDone();
            });
    });

    QUnit.test("getContentProviderDataOriginsLookup: the contentProviderDataOrigins is cached", function (assert) {
        var fnDone = assert.async();

        var oContentProviderDataOrigins = {
            CP1: {
                CP1: true,
                SYS1: true,
                SYS3: true
            },
            CP2: {
                CP2: true
            }
        };
        var oCDMServiceStub = {
            getSiteWithoutPersonalization: sinon.stub().returns(Promise.resolve({
                contentProviderDataOrigins: oContentProviderDataOrigins
            }))
        };
        var fnGetServiceAsyncStub = sinon.stub(Container, "getServiceAsync").returns(Promise.resolve(oCDMServiceStub));

        this.oAdapter.getContentProviderDataOriginsLookup()
            .then(function (oResult) {
                assert.ok(true, "The promise should be resolved");
                assert.strictEqual(oCDMServiceStub.getSiteWithoutPersonalization.callCount, 1, "getSite was called");
                assert.deepEqual(oResult, oContentProviderDataOrigins, "Expect contentProviderDataOrigins from site");
                return this.oAdapter.getContentProviderDataOriginsLookup();
            }.bind(this), function () {
                assert.ok(false, "The promise should be resolved");
            })
            .then(function (oResult2) {
                assert.ok(true, "The promise should be resolved");
                assert.strictEqual(oCDMServiceStub.getSiteWithoutPersonalization.callCount, 1, "getSite was called");
                assert.deepEqual(oResult2, oContentProviderDataOrigins, "Expect contentProviderDataOrigins from site");
            })
            .then(function () {
                fnGetServiceAsyncStub.restore();
                fnDone();
            });
    });

    QUnit.test("getContentProviderDataOriginsLookup: reject when getSite is rejected", function (assert) {
        var fnDone = assert.async();

        var oCDMServiceStub = {
            getSiteWithoutPersonalization: sinon.stub().returns(Promise.reject())
        };
        var fnGetServiceAsyncStub = sinon.stub(Container, "getServiceAsync").returns(Promise.resolve(oCDMServiceStub));

        this.oAdapter.getContentProviderDataOriginsLookup()
            .then(function () {
                assert.ok(false, "The promise should be resolved");
                fnDone();
            }, function () {
                assert.ok(true, "The promise should be resolved");
                fnGetServiceAsyncStub.restore();
                fnDone();
            });
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.ContainerAdapter
 */
sap.ui.define([
    "sap/ushell/System",
    "sap/ushell/Container",
    "sap/ushell/adapters/cdm/ContainerAdapter",
    "sap/ushell/utils",
    "sap/base/Log",
    "sap/ushell/resources"
], function (
    System,
    Container,
    ContainerAdapter,
    ushellUtils,
    Log,
    resources
) {
    "use strict";
    /*global sinon, QUnit */

    let oXMLHttpRequestStub;
    const sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.adapters.cdm.ContainerAdapter", {
        beforeEach: function () {
            this.initialSystem = new System({
                alias: "initial_Alias",
                platform: "cdm"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("create Adapter", function (assert) {
        var done = assert.async(),
            oPromise,
            oAdapter = new ContainerAdapter(this.initialSystem, undefined, { config: {} });

        assert.expect(5);
        assert.ok(typeof oAdapter.load === "function", "adapter has load() function");
        assert.deepEqual(oAdapter.getSystem(), new System({
            alias: "initial_Alias",
            platform: "cdm",
            system: undefined,
            baseUrl: undefined,
            client: undefined,
            productName: undefined,
            productVersion: undefined,
            systemName: undefined,
            systemRole: undefined,
            tenantRole: undefined
        }), "getSystem()");
        oPromise = oAdapter.load();
        assert.ok(typeof oPromise.done === "function", "load() returned a jQuery promise");
        assert.strictEqual(oPromise.resolve, undefined,
            "load() does not return the jQuery deferred object itself");
        oPromise.done(function () {
            assert.ok(true, "done function is called");
        }).always(done);
    });

    [{
        testDescription: "no userProfile in adapter config",
        input: {
            oConfig: {
            }
        },
        expected: {
            // everything should be undefined
        }
    }, {
        testDescription: "userProfile without personalization and metadata",
        input: {
            oConfig: {
                userProfile: {
                    defaults: {
                        isJamActive: false,
                        email: "john.doe@sap.com",
                        firstName: "John",
                        lastName: "Doe",
                        fullName: "John Doe",
                        id: "DOEJ",
                        language: "EN",
                        languageBcp47: "en",
                        dateFormat: "1",
                        tislcal: [],
                        numberFormat: "",
                        rtl: false,
                        theme: "sap_belize",
                        timeFormat: "0",
                        timeZone: "CET"
                    }
                }
            }
        },
        expected: {
            email: "john.doe@sap.com",
            firstName: "John",
            lastName: "Doe",
            fullName: "John Doe",
            userId: "DOEJ",
            language: "EN",
            languageBcp47: "en",
            contentDensity: undefined,
            theme: "sap_belize"
        }
    }, {
        testDescription: "userProfile with personalization",
        input: {
            oConfig: {
                userProfile: {
                    metadata: {
                    },
                    defaults: {
                        isJamActive: false,
                        email: "john.doe@sap.com",
                        firstName: "John",
                        lastName: "Doe",
                        fullName: "John Doe",
                        id: "DOEJ",
                        language: "EN",
                        languageBcp47: "en",
                        dateFormat: "1",
                        tislcal: [],
                        numberFormat: "",
                        rtl: false,
                        theme: "sap_belize",
                        timeFormat: "0",
                        timeZone: "CET"
                    }
                },
                userProfilePersonalization: {
                    // may come from separate request
                    dateFormat: "1",
                    theme: "sap_belize_plus",
                    timeFormat: "0",
                    timeZone: "CET",
                    contentDensity: "cozy"
                }
            }
        },
        expected: {
            email: "john.doe@sap.com",
            firstName: "John",
            lastName: "Doe",
            fullName: "John Doe",
            userId: "DOEJ",
            language: "EN",
            languageBcp47: "en",
            contentDensity: "cozy",
            theme: "sap_belize_plus"
        }
    }, {
        testDescription: "isJamActive = true",
        input: {
            oConfig: {
                userProfile: {
                    defaults: {
                        isJamActive: true
                    }
                }
            }
        },
        expected: {
            isJamActive: true
            // everything else should be undefined
        }
    }, {
        testDescription: "userProfile with metadata enabling editing of theme",
        input: {
            oConfig: {
                userProfile: {
                    metadata: {
                        editablePropterties: [
                            "theme"
                        ]
                    }
                }
            }
        },
        expected: {
            isSetThemePermitted: true
            // everything else should be undefined
        }
    }, {
        testDescription: "userProfile with metadata enabling editing of accessibility",
        input: {
            oConfig: {
                userProfile: {
                    metadata: {
                        editablePropterties: [
                            "accessibility"
                        ]
                    }
                }
            }
        },
        expected: {
            isSetAccessibilityPermitted: true
            // everything else should be undefined
        }
    }, {
        testDescription: "userProfile with metadata enabling editing of contentDensity",
        input: {
            oConfig: {
                userProfile: {
                    metadata: {
                        editablePropterties: [
                            "contentDensity"
                        ]
                    }
                }
            }
        },
        expected: {
            isSetContentDensityPermitted: true
            // everything else should be undefined
        }
    }, {
        testDescription: "Theme fallback as user's personalized theme is not supported",
        input: {
            oConfig: {
                userProfile: {
                    metadata: {
                        editablePropterties: [
                            "theme"
                        ],
                        ranges: {
                            theme: [{
                                displayName: "SAP Belize",
                                theme: "sap_belize",
                                themeRoot: ""
                            }, {
                                displayName: "SAP Belize Dark",
                                name: "sap_belize_plus",
                                themeRoot: ""
                            }]
                        }
                    },
                    defaults: {
                        // fallback in case of deprecated personalized theme
                        theme: "sap_belize"
                    }
                },
                userProfilePersonalization: {
                    theme: "sap_blue_crystal"
                }
            }
        },
        expected: {
            theme: "sap_blue_crystal",
            isSetThemePermitted: true
            // everything else is undefined
        }
    }].forEach(function (oFixture) {
        QUnit.test("getUser: " + oFixture.testDescription, function (assert) {
            var oUser,
                oAdapter;

            // act
            oAdapter = new ContainerAdapter(this.initialSystem, undefined,
                { config: oFixture.input.oConfig });

            oUser = oAdapter.getUser();

            // assert
            assert.strictEqual(oUser.getEmail(), oFixture.expected.email, "Email");
            assert.strictEqual(oUser.getFirstName(), oFixture.expected.firstName, "First Name");
            assert.strictEqual(oUser.getLastName(), oFixture.expected.lastName, "Last Name");
            assert.strictEqual(oUser.getFullName(), oFixture.expected.fullName, "Full Name");
            assert.strictEqual(oUser.getId(), oFixture.expected.userId, "user id");
            assert.strictEqual(oUser.getLanguage(), oFixture.expected.language, "language");
            assert.strictEqual(oUser.getLanguageBcp47(), oFixture.expected.languageBcp47, "languageBcp47");
            assert.strictEqual(oUser.getContentDensity(), oFixture.expected.contentDensity, "contentDensity");
            assert.strictEqual(oUser.getTheme(),
                oFixture.expected.theme !== undefined ? oFixture.expected.theme : "",
                "theme (if ot set it should be an empty string");
            assert.strictEqual(oUser.isJamActive(), !!oFixture.expected.isJamActive, "isJamActive");

            // assert edit states. If not explicitly set to editable, they should return false
            assert.strictEqual(oUser.isSetAccessibilityPermitted(), !!oFixture.expected.isSetAccessibilityPermitted,
                "isSetAccessibilityPermitted");
            assert.strictEqual(oUser.isSetContentDensityPermitted(), !!oFixture.expected.isSetContentDensityPermitted,
                "isSetContentDensityPermitted");
            assert.strictEqual(oUser.isSetThemePermitted(), !!oFixture.expected.isSetThemePermitted,
                "isSetThemePermitted");
        });
    });

    QUnit.test("getUser: returns always the same instance", function (assert) {
        var oUser1,
            oUser2,
            oAdapter;

        // act
        oAdapter = new ContainerAdapter(this.initialSystem, undefined,
            {
                config: {
                    userProperties: {
                        id: "DOEJ"
                    }
                }
            });
        oUser1 = oAdapter.getUser();
        oUser2 = oAdapter.getUser();

        // assert
        assert.strictEqual(oUser1, oUser2, "same user instance is returned on every getUser call");
        assert.ok(oUser1, "a user object has been returned");
    });

    [{
        testDescription: "Config without systemProperties",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "/base_url" // cannot be overwritten via config!
            },
            oConfig: {}
        },
        expected: {
            alias: "",
            platform: "cdm",
            baseUrl: "/base_url"
            // everything else should be undefined
        }
    }, {
        testDescription: "Config with empty systemProperties",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "/base_url" // cannot be overwritten via config!
            },
            oConfig: {
                systemProperties: {}
            }
        },
        expected: {
            alias: "initial_Alias",
            platform: "cdm",
            baseUrl: "/base_url"
            // everything else should be undefined
        }
    }, {
        testDescription: "SystemProperties config with alias",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "/base_url" // cannot be overwritten via config!
            },
            oConfig: {
                systemProperties: {
                    alias: "SYS_ALIAS"
                }
            }
        },
        expected: {
            alias: "SYS_ALIAS",
            platform: "cdm",
            baseUrl: "/base_url"
            // everything else should be undefined
        }
    }, {
        testDescription: "SystemProperties config with SID",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "/base_url" // cannot be overwritten via config!
            },
            oConfig: {
                systemProperties: {
                    SID: "SYS"
                }
            }
        },
        expected: {
            alias: "initial_Alias",
            platform: "cdm",
            name: "SYS",
            baseUrl: "/base_url"
            // everything else should be undefined
        }
    }, {
        testDescription: "SystemProperties config with client, no baseUrl",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm" // cannot be overwritten via config!
            },
            oConfig: {
                systemProperties: {
                    client: "001",
                    productName: "AS Server",
                    productVersion: "testProductVersion"
                }
            }
        },
        expected: {
            alias: "initial_Alias",
            platform: "cdm",
            client: "001",
            productName: "AS Server",
            productVersion: "testProductVersion"
            // everything else should be undefined
        }
    }, {
        testDescription: "SystemProperties config with product, system and tenant infos",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "testBaseUrl"
            },
            oConfig: {
                clientRole: "clientRole (deprecated)",
                isTrialSystem: true,
                systemProperties: {
                    SID: "systemName (deprecated)",
                    client: "testClient",
                    productName: "testProductName",
                    systemName: "testSystemName",
                    systemRole: "testSystemRole",
                    productVersion: "testProductVersion",
                    tenantRole: "testTenantRole"
                }
            }
        },
        expected: {
            alias: "initial_Alias",
            platform: "cdm",
            productName: "testProductName",
            systemName: "testSystemName",
            systemRole: "testSystemRole",
            productVersion: "testProductVersion",
            tenantRole: "testTenantRole",
            baseUrl: "testBaseUrl",
            client: "testClient",
            clientRole: "clientRole (deprecated)",
            name: "systemName (deprecated)",
            isTrialSystem: true
        }
    }].forEach(function (oFixture) {
        QUnit.test("getSystem: " + oFixture.testDescription, function (assert) {
            var oExpected = oFixture.expected,
                oAdapter,
                oInitialSystem = new System(oFixture.input.oInitialSystemData),
                oActualSystem;

            // act
            oAdapter = new ContainerAdapter(oInitialSystem, undefined, { config: oFixture.input.oConfig });
            oActualSystem = oAdapter.getSystem();

            // assert
            assert.strictEqual(oActualSystem.getAlias(), oExpected.alias, "alias: " + oExpected.alias);
            assert.strictEqual(oActualSystem.getProductName(), oExpected.productName, "ProductName: " + oExpected.productName);
            assert.strictEqual(oActualSystem.getProductVersion(), oExpected.productVersion, "ProductVersion: " + oExpected.productVersion);
            assert.strictEqual(oActualSystem.getSystemName(), oExpected.systemName, "SystemName: " + oExpected.systemName);
            assert.strictEqual(oActualSystem.getSystemRole(), oExpected.systemRole, "SystemRole: " + oExpected.systemRole);
            assert.strictEqual(oActualSystem.getTenantRole(), oExpected.tenantRole, "TenantRole: " + oExpected.tenantRole);
            assert.strictEqual(oActualSystem.getBaseUrl(), oExpected.baseUrl, "baseUrl: " + oExpected.baseUrl);
            assert.strictEqual(oActualSystem.getClient(), oExpected.client, "client: " + oExpected.client);
            assert.strictEqual(oActualSystem.getPlatform(), oExpected.platform, "platform: " + oExpected.platform);
        });

        /**
         * @deprecated since 1.118.
         */
        QUnit.test("DEPRECATED_getSystem: " + oFixture.testDescription, function (assert) {
            var oExpected = oFixture.expected,
                oAdapter,
                oInitialSystem = new System(oFixture.input.oInitialSystemData),
                oActualSystem;

            // act
            oAdapter = new ContainerAdapter(oInitialSystem, undefined, { config: oFixture.input.oConfig });
            oActualSystem = oAdapter.getSystem();

            // assert
            assert.strictEqual(oActualSystem.getName(), oExpected.name, "name: " + oExpected.name);
        });
    });

    QUnit.test("getSystem: returns always the same instance", function (assert) {
        var oSystem1,
            oSystem2,
            oAdapter;

        // act
        oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
            config: {}
        });
        oSystem1 = oAdapter.getSystem();
        oSystem2 = oAdapter.getSystem();

        // assert
        assert.strictEqual(oSystem1, oSystem2, "same system instance is returned on every getSystem call");
        assert.ok(oSystem1, "a system object has been returned");
    });

    [{
        testDescription: "SystemProperties config without logoutUrl -> default logoutUrl",
        input: {
            oConfig: {
                systemProperties: {
                }
            }
        },
        expected: {
            logoutUrl: "/sap/public/bc/icf/logoff"
        }
    }, {
        testDescription: "SystemProperties config with logoutUrl",
        input: {
            oConfig: {
                systemProperties: {
                    logoutUrl: "/a/b/c/d"
                }
            }
        },
        expected: {
            logoutUrl: "/a/b/c/d"
        }
    }].forEach(function (oFixture) {
        QUnit.test("LogoutUrl: " + oFixture.testDescription, function (assert) {
            var oExpected = oFixture.expected,
                oAdapter;

            // act
            oAdapter = new ContainerAdapter(this.initialSystem, undefined,
                { config: oFixture.input.oConfig });

            // _getLogoutUrl may be removed as it is only used for the test
            assert.strictEqual(oAdapter._getLogoutUrl(), oExpected.logoutUrl, "logoutUrl: " + oExpected.logoutUrl);
        });
    });

    [
        {
            testDescription: "browser does not have native logout capability",
            input: {
                bHasNativeLogoutCapability: false,
                sFakeLocationHref:
                    "https://somehost:44355/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=000#Shell-home",
                sLogoffUrl: "/sap/public/bc/icf/logoff",
                sSystemBaseUrl: "/base_url"
            },
            expected: {
                callCounts: {
                    logoutRedirect: 1,
                    _setDocumentLocation: 1,
                    adjustUrl: 1,
                    epcmDoLogOff: 0
                },
                sLogoffRedirectUrl: "/base_url/sap/public/bc/icf/logoff"
            }
        },
        {
            testDescription: "browser has native logout capability",
            input: {
                bHasNativeLogoutCapability: true,
                sFakeLocationHref:
                    "https://somehost:44355/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=000#Shell-home",
                sLogoffUrl: "/sap/public/bc/icf/logoff",
                sSystemBaseUrl: "/base_url"
            },
            expected: {
                callCounts: {
                    logoutRedirect: 0,
                    _setDocumentLocation: 0,
                    adjustUrl: 0,
                    epcmDoLogOff: 1
                },
                sEpcmDoLogOffUrl: "https://somehost:44355/sap/public/bc/icf/logoff"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("logout for Logon System works as expected when " + oFixture.testDescription, function (assert) {
            var oInitialSystem = new System({ baseUrl: oFixture.input.sSystemBaseUrl }),
                oAdapter = new ContainerAdapter(oInitialSystem, undefined, { config: {} }),
                oSystem = oAdapter.getSystem(), // may be a different instance than oInitialSystem
                sConfiguredLogoffUrl = oFixture.input.sLogoffUrl,
                fnDoLogOffStub = sandbox.stub();

            // Arrange
            sandbox.spy(oAdapter, "logoutRedirect");
            sandbox.spy(oSystem, "adjustUrl"); // not stubbed in order to test the real behaviour
            sandbox.stub(ushellUtils, "hasNativeLogoutCapability")
                .returns(oFixture.input.bHasNativeLogoutCapability);
            sandbox.stub(ushellUtils, "getPrivateEpcm")
                .returns({
                    doLogOff: fnDoLogOffStub
                });
            sandbox.stub(oAdapter, "getCurrentUrl")
                .returns(oFixture.input.sFakeLocationHref);
            sandbox.stub(oAdapter, "_getLogoutUrl")
                .returns(sConfiguredLogoffUrl);
            sandbox.stub(oAdapter, "_setDocumentLocation"); // avoid redirecting during test

            // Act
            return oAdapter.logout(true).then(function () {
                // Assert
                // call counts:
                assert.strictEqual(
                    oAdapter.logoutRedirect.callCount,
                    oFixture.expected.callCounts.logoutRedirect,
                    "logoutRedirect method was called " + oFixture.expected.callCounts.logoutRedirect + " times"
                );
                assert.strictEqual(
                    oSystem.adjustUrl.callCount,
                    oFixture.expected.callCounts.adjustUrl,
                    "adjustUrl method was called " + oFixture.expected.callCounts.adjustUrl + " times"
                );
                assert.strictEqual(
                    oAdapter._setDocumentLocation.callCount,
                    oFixture.expected.callCounts._setDocumentLocation,
                    "_setDocumentLocation method was called " + oFixture.expected.callCounts._setDocumentLocation + " times"
                );
                assert.strictEqual(
                    fnDoLogOffStub.callCount,
                    oFixture.expected.callCounts.epcmDoLogOff,
                    "EPCM doLogoff method was called " + oFixture.expected.callCounts.epcmDoLogOff + " times"
                );

                if (oFixture.input.bHasNativeLogoutCapability) {
                    assert.strictEqual(
                        fnDoLogOffStub.firstCall.args[0],
                        oFixture.expected.sEpcmDoLogOffUrl,
                        "EPCM doLogoff called for URL: " + sConfiguredLogoffUrl
                    );
                } else {
                    assert.strictEqual(
                        oSystem.adjustUrl.firstCall.args[0],
                        sConfiguredLogoffUrl,
                        "adjustUrl called for URL: " + sConfiguredLogoffUrl
                    );
                    assert.strictEqual(
                        oAdapter._setDocumentLocation.firstCall.args[0],
                        oFixture.expected.sLogoffRedirectUrl,
                        "Redirect to logoff URL done: " + oFixture.expected.sLogoffRedirectUrl
                    );
                }
            });
        });
    });

    QUnit.test("getCurrentUrl: returns the URL on the address bar", function (assert) {
        var oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
            config: {
                systemProperties: {}
            }
        });


        assert.strictEqual(oAdapter.getCurrentUrl(), window.location.href, "Current URL is current location");
    });

    QUnit.test("load: returns a promise that is always resolved", function (assert) {
        var fnDone = assert.async();
        var oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
            config: {
                systemProperties: {}
            }
        });

        var fnLoaded = sandbox.spy();
        var fnFailedLoading = sandbox.spy();

        var fnCheckOutcome = function () {
            assert.ok(fnLoaded.calledOnce && fnFailedLoading.notCalled);
            fnDone();
        };

        oAdapter.load()
            .then(fnLoaded, fnFailedLoading)
            .then(fnCheckOutcome, fnCheckOutcome);
    });

    [{
        testDescription: "empty configuration",
        input: {
            oConfig: {
            }
        },
        expected: {
            sessionKeepAliveConfig: null
        }
    }, {
        testDescription: "no sessionKeepAlive configuration",
        input: {
            oConfig: {
                systemProperties: {
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: null
        }
    }, {
        testDescription: "sessionKeepAlive configuration without 'url'",
        input: {
            oConfig: {
                systemProperties: {
                    sessionKeepAlive: {
                    }
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: null
        }
    }, {
        testDescription: "sessionKeepAlive configuration with 'url' but without method",
        input: {
            oConfig: {
                systemProperties: {
                    sessionKeepAlive: {
                        url: "/some/ping/service"
                    }
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: {
                method: "HEAD",
                url: "/some/ping/service"
            }
        }
    }, {
        testDescription: "sessionKeepAlive configuration with 'url' and method GET",
        input: {
            oConfig: {
                systemProperties: {
                    sessionKeepAlive: {
                        method: "GET",
                        url: "/some/ping/service"
                    }
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: {
                method: "GET",
                url: "/some/ping/service"
            }
        }
    }, {
        testDescription: "sessionKeepAlive configuration with 'url' and invalid method",
        input: {
            oConfig: {
                systemProperties: {
                    sessionKeepAlive: {
                        method: "DELETE",
                        url: "/some/ping/service"
                    }
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: {
                method: "HEAD",
                url: "/some/ping/service"
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test("Constructor - getSessionKeepAliveConfig: " + oFixture.testDescription, function (assert) {
            var oExpectedSessionKeepAliveConfig = oFixture.expected.sessionKeepAliveConfig,
                oAdapter;

            // act
            oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
                config: oFixture.input.oConfig
            });

            // assert
            assert.deepEqual(oAdapter._getSessionKeepAliveConfig(), oExpectedSessionKeepAliveConfig);
        });
    });

    QUnit.test("sessionKeepAlive: sends XHR request if sessionKeepAlive configured", function (assert) {
        // Arrange
        var oFakeXHRStub = {
            open: sandbox.stub(),
            send: sandbox.stub()
        };
        oXMLHttpRequestStub = sandbox.stub(window, "XMLHttpRequest").returns(oFakeXHRStub);
        var oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
            config: {
                systemProperties: {
                    sessionKeepAlive: {
                        url: "/some/ping/service"
                    }
                }
            }
        });

        // Act
        oAdapter.sessionKeepAlive();

        // Assert
        assert.strictEqual(oXMLHttpRequestStub.callCount, 1, "XMLHttpRequest constructor was called exactly once");
        assert.strictEqual(oFakeXHRStub.open.callCount, 1, "open method of the XHR object was called exactly once");
        assert.deepEqual(oFakeXHRStub.open.getCall(0).args, [
            "HEAD", "/some/ping/service", true
        ], "XHR#open method was called with the expected arguments");
        assert.strictEqual(oFakeXHRStub.send.callCount, 1, "send method of the XHR object was called exactly once");
    });

    QUnit.test("sessionKeepAlive: sends no XHR request if sessionKeepAlive is not configured", function (assert) {
        // Arrange
        oXMLHttpRequestStub = sandbox.stub(window, "XMLHttpRequest");
        var oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
            config: {
            }
        });

        // Act
        oAdapter.sessionKeepAlive();

        // Assert
        assert.strictEqual(oXMLHttpRequestStub.callCount, 0, "XMLHttpRequest constructor was not called");
    });

    QUnit.test("logout for Logon System works as expected with POST request ", function (assert) {
        var oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
            config: {
                systemProperties: {
                    logoutUrl: "/a/b/c/d/logoff",
                    logoutMethod: "POST",
                    csrfTokenUrl: "/a/b/c/d/dummy"
                }
            }
        });

        // Arrange
        var oLogoutRedirectSpy = sandbox.spy(oAdapter, "logoutRedirect");
        var oSetDocumentLocationSpy = sandbox.spy(oAdapter, "_setDocumentLocation");
        var oSetWindowLocationStub = sandbox.stub(oAdapter, "_setWindowLocation").callsFake(function (data) {
            assert.strictEqual(data, "test.a.b.c");
        });
        var oFetchStub = sandbox.stub(window, "fetch");

        // First call to get the csrf token
        oFetchStub.onCall(0).returns(Promise.resolve(
            new window.Response(JSON.stringify({}), {
                status: 200,
                headers: {
                    "X-CSRF-Token": "dummy-csrf-token"
                }
            })
        ));

        // Second call to log off
        oFetchStub.onCall(1).returns(Promise.resolve(
            new window.Response("test.a.b.c", {
                status: 200
            })
        ));

        // Act
        return oAdapter.logout(true).then(function () {
            // Assert
            assert.strictEqual(oLogoutRedirectSpy.callCount, 1, "logoutRedirect method was called once");
            assert.strictEqual(oFetchStub.callCount, 2, "fetch  was called twice");

            // First fetch call to get the csrf token
            assert.strictEqual(oFetchStub.getCall(0).args[0], "/a/b/c/d/dummy", "fetch was called with the correct URL");
            assert.deepEqual(oFetchStub.getCall(0).args[1], { method: "HEAD", headers: {"X-CSRF-Token": "Fetch"}}, "fetch was called with the correct options");

            // Second fetch call to log off
            assert.strictEqual(oFetchStub.getCall(1).args[0], "/a/b/c/d/logoff", "fetch was called with the correct URL");
            assert.deepEqual(oFetchStub.getCall(1).args[1], { method: "POST", headers: {"X-CSRF-Token": "dummy-csrf-token"}}, "fetch was called with the correct options");

            // Redirect to the logoff URL
            assert.strictEqual(oSetWindowLocationStub.callCount, 1, "_setWindowLocation method was called once");
            assert.strictEqual(oSetWindowLocationStub.getCall(0).args[0], "test.a.b.c", "_setWindowLocation method was called with the correct URL");
            assert.strictEqual(oSetDocumentLocationSpy.callCount, 0, "_setDocumentLocation method was not called");
        });
    });

    QUnit.test("logout request for csrf-token responses with status 401 in POST request ", async function (assert) {
        // Arrange
        var oContainerAdapter = new ContainerAdapter(this.initialSystem, undefined, {
            config: {
                systemProperties: {
                    logoutMethod: "POST",
                    csrfTokenUrl: "/a/b/c/d/dummy"
                }
            }}
        );

        var oLogoutRedirectSpy = sandbox.spy(oContainerAdapter, "logoutRedirect");
        var oReloadStub = sandbox.stub(ushellUtils, "reload");
        var oFetchStub = sandbox.stub(window, "fetch");
        oFetchStub.returns(Promise.resolve(
            new window.Response("Unauthorized", {
                status: 401
            })
        ));
        var oLogErrorStub = sandbox.stub(Log, "error");

        // Act
        return oContainerAdapter.logout(true).then(function () {
            // Assert
            assert.strictEqual(oFetchStub.callCount, 1, "fetch was called once");
            assert.strictEqual(oLogoutRedirectSpy.callCount, 1, "logoutRedirect method was called once");
            assert.strictEqual(oLogErrorStub.callCount, 1, "Log.error was called 1 time");
            assert.deepEqual(oLogErrorStub.getCall(0).args, [
                "fetching X-CSRF-Token for logout via POST failed for system: initial_Alias",
                undefined,
                "sap.ushell.adapters.cdm.ContainerAdapter::logoutRedirect"
            ], "Log.error called with the expected arguments");
            assert.strictEqual(oReloadStub.callCount, 1, "reload method was called once");
        });
    });

   QUnit.test("logout request for csrf-token responses with error (status 500) in POST request ", function (assert) {
       // Arrange
       var oContainerAdapter = new ContainerAdapter(this.initialSystem, undefined, {
           config: {
               systemProperties: {
                   logoutMethod: "POST",
                   csrfTokenUrl: "/a/b/c/d/dummy"
               }
           }}
       );

       var oLogoutRedirectSpy = sandbox.spy(oContainerAdapter, "logoutRedirect");
       var oReloadSpy = sandbox.stub(ushellUtils, "reload");
       var oFetchStub = sandbox.stub(window, "fetch");
       oFetchStub.returns(Promise.resolve(
           new window.Response("Internal Server Error", {
               status: 500
           })
       ));
       var oLogErrorStub = sandbox.stub(Log, "error");

       var oMessageServiceShowSpy = sandbox.spy();
       var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve({
           show: oMessageServiceShowSpy,
           Type: { ERROR: "someError"}
       }));

        // Act
        return oContainerAdapter.logout(true).then(function () {
            // Assert
            assert.strictEqual(oLogoutRedirectSpy.callCount, 1, "logoutRedirect method was called once");
            assert.strictEqual(oFetchStub.callCount, 1, "fetch was called once");
            assert.strictEqual(oLogErrorStub.callCount, 1, "Log.error was called 1 time");
            assert.deepEqual(oLogErrorStub.getCall(0).args, [
                "fetching X-CSRF-Token for logout via POST failed for system: initial_Alias",
                undefined,
                "sap.ushell.adapters.cdm.ContainerAdapter::logoutRedirect"
            ], "Log.error called with the expected arguments");
            assert.strictEqual(oReloadSpy.callCount, 0, "reload was not called");
            assert.strictEqual(oGetServiceAsyncStub.callCount, 1, "getServiceAsync was called once");
            assert.strictEqual(oGetServiceAsyncStub.getCall(0).args[0], "MessageInternal", "MessageInternal service was requested");
            assert.strictEqual(oMessageServiceShowSpy.callCount, 1, "MessageInternal.show was called once");
            assert.strictEqual(oMessageServiceShowSpy.getCall(0).args[0], "someError", "MessageInternal.show was called with the correct message type");
            assert.strictEqual(oMessageServiceShowSpy.getCall(0).args[1], resources.i18n.getText("LogoutFailed"), "MessageInternal.show was called with the correct message");
            assert.deepEqual(oMessageServiceShowSpy.getCall(0).args[2], { callback: ushellUtils.reload }, "MessageInternal.show was called with the correct onClose callback");
        });
    });

});

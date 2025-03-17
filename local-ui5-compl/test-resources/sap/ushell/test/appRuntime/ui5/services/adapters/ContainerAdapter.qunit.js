// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.adapters.ContainerAdapter
 */
sap.ui.define([
    "sap/base/i18n/Formatting",
    "sap/ushell/appRuntime/ui5/services/adapters/ContainerAdapter",
    "sap/ui/thirdparty/jquery"
], function (Formatting, ContainerAdapter, jQuery) {
    "use strict";
    /*global sinon, QUnit */

    QUnit.module("sap.ushell.appRuntime.ui5.services.adapters.ContainerAdapter");

    [{
        testDescription: "no userProfile in adapter config",
        input: { oConfig: {} },
        expected: {} // everything should be undefined
    }, {
        testDescription: "userProfile with personalization",
        input: {
            oConfig: {
                userProfile: {
                    metadata: {},
                    defaults: {
                        id: "USERT",
                        email: "test.user@sap.com",
                        firstName: "Test",
                        lastName: "User",
                        fullName: "Test User",
                        sapDateFormat: "2",
                        sapTimeFormat: "0",
                        sapNumberFormat: "",
                        isJamActive: false,
                        sapDateCalendarCustomizing: "",
                        currencyFormats: {
                            BHD: { digits: 3 },
                            BIF: { digits: 0 },
                            BYR: { digits: 0 },
                            CLP: { digits: 0 },
                            COP: { digits: 0 },
                            DEFAULT: { digits: 2 },
                            DJF: { digits: 0 },
                            GNF: { digits: 0 },
                            HUF: { digits: 0 },
                            IDR: { digits: 0 },
                            IQD: { digits: 3 },
                            JOD: { digits: 3 },
                            JPY: { digits: 0 },
                            KMF: { digits: 0 },
                            KRW: { digits: 0 }
                        }
                    }
                }
            }
        },
        expected: {
            id: "USERT",
            email: "test.user@sap.com",
            firstName: "Test",
            lastName: "User",
            fullName: "Test User",
            sapDateFormat: "2",
            sapTimeFormat: "0",
            sapNumberFormat: undefined,
            isJamActive: false,
            sapDateCalendarCustomizing: undefined,
            currencyFormats: {
                BHD: { digits: 3 },
                BIF: { digits: 0 },
                BYR: { digits: 0 },
                CLP: { digits: 0 },
                COP: { digits: 0 },
                DEFAULT: { digits: 2 },
                DJF: { digits: 0 },
                GNF: { digits: 0 },
                HUF: { digits: 0 },
                IDR: { digits: 0 },
                IQD: { digits: 3 },
                JOD: { digits: 3 },
                JPY: { digits: 0 },
                KMF: { digits: 0 },
                KRW: { digits: 0 }
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            // Arrange
            var oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
                config: oFixture.input.oConfig
            });

            // Act
            oAdapter.load();

            // Assert
            assert.strictEqual(Formatting.getABAPDateFormat(), oFixture.expected.sapDateFormat, "sapDateFormat");
            assert.strictEqual(Formatting.getCustomIslamicCalendarData(), oFixture.expected.sapDateCalendarCustomizing, "sapDateCalendarCustomizing");
            assert.strictEqual(Formatting.getABAPNumberFormat(), oFixture.expected.sapNumberFormat, "sapNumberFormat");
            assert.strictEqual(Formatting.getABAPTimeFormat(), oFixture.expected.sapTimeFormat, "sapTimeFormat");
            assert.deepEqual(Formatting.getCustomCurrencies(), oFixture.expected.currencyFormats, "currencyFormats");
        });
    });

    QUnit.test("logout for Logon System works as expected with GET request ", function (assert) {
        var done = assert.async(),
            oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
                config: {
                    systemProperties: {
                        logoutUrl: "/a/b/c/d/logoff"
                    }
                }});

        // Arrange
        oAdapter.load();
        sinon.spy(oAdapter, "logout");
        sinon.spy(oAdapter, "_logoutViaHiddenIFrame");
        sinon.spy(jQuery, "ajax");

        // Act
        oAdapter.logout().done(function () {
            // Assert
            assert.strictEqual(jQuery.ajax.callCount, 0, "ajax method was not called");
            assert.strictEqual(oAdapter.logout.callCount, 1, "logoutRedirect method was called once");
            assert.strictEqual(oAdapter._logoutViaHiddenIFrame.callCount, 1, "_logoutViaHiddenIFrame method was called once");
            jQuery.ajax.restore();
            done();
        });
    });

    QUnit.test("logout for Logon System works as expected with POST request ", function (assert) {
        var done = assert.async(),
            oAdapter = new ContainerAdapter(this.initialSystem, undefined, {
                config: {
                    systemProperties: {
                        logoutUrl: "/a/b/c/d/logoff",
                        logoutMethod: "POST",
                        csrfTokenUrl: "/a/b/c/d/dummy"
                    }
                }}),
            oCsrfStub = sinon.stub().returns("dummy-csrf-token");

        // Arrange
        oAdapter.load();
        sinon.spy(oAdapter, "logout");
        sinon.spy(oAdapter, "_logoutViaHiddenIFrame");
        sinon.stub(oAdapter, "_setWindowLocation").callsFake(function(data) {
            assert.strictEqual(data, "test.a.b.c");
        });
        sinon.stub(jQuery, "ajax").callsFake(function (oParameters) {
            if (oParameters.type === "HEAD") {
                assert.strictEqual(oParameters.url, "/a/b/c/d/dummy");
                oParameters.success(undefined, undefined, {
                    getResponseHeader: oCsrfStub
                });
            } else {
                assert.strictEqual(oParameters.url, "/a/b/c/d/logoff");
                assert.strictEqual(oParameters.type, "POST");
                assert.strictEqual(oParameters.headers["X-CSRF-Token"], "dummy-csrf-token");
                oParameters.success("test.a.b.c");
            }
        });

        // Act
        oAdapter.logout().done(function () {
            // Assert
            assert.strictEqual(jQuery.ajax.callCount, 2, "ajax method was called twice");
            assert.strictEqual(oCsrfStub.callCount, 1, "getResponseHeader method was called once");
            assert.strictEqual(oAdapter.logout.callCount, 1, "logoutRedirect method was called once");
            assert.strictEqual(oAdapter._logoutViaHiddenIFrame.callCount, 0, "_setDocumentLocation method was not called");
            jQuery.ajax.restore();
            done();
        });
    });
});

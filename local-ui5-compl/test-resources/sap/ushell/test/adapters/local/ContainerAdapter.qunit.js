// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.ContainerAdapter
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ushell/adapters/local/ContainerAdapter",
    "sap/ushell/System",
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (
    Localization,
    ContainerAdapter,
    System,
    testUtils,
    utils
) {
    "use strict";

    /*global QUnit, sinon */

    QUnit.module("sap.ushell.adapters.local.ContainerAdapter", {
        beforeEach: function () {
            sinon.stub(utils, "reload");
        },
        afterEach: function () {
            testUtils.restoreSpies(
                utils.reload
            );
        }
    });

    QUnit.test("create Adapter", function (assert) {
        var done = assert.async();
        var oSystem = new System({}),
            oAdapter = new ContainerAdapter(oSystem),
            oPromise;

        assert.expect(5);
        assert.ok(typeof oAdapter.load === "function", "adapter has load() function");
        assert.deepEqual(oAdapter.getSystem(), new System({
            alias: undefined,
            platform: undefined,
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

    QUnit.test("create adapter with config", function (assert) {
        var done = assert.async();
        var oSystem = new System({}),
            sParameter,
            oAdapterConfig,
            oAdapter,
            oUser;

        // Arrange
        assert.expect(7);
        oAdapterConfig = {
            config: {
                id: "TEST_USER",
                firstName: "Tester",
                lastName: "Man",
                fullName: "Tester_Man",
                accessibility: true,
                language: "DE",
                theme: "sap_nocrystal",
                bootTheme: {
                    theme: "sap_greencrystal",
                    root: "root"
                },
                setAccessibilityPermitted: false,
                setThemePermitted: false,
                userProfile: [
                    { id: "THEME", value: "sap_redcrystal" },
                    { id: "TIME_ZONE", value: "GMT", editState: 1 },
                    { id: "LANGUAGE", value: "en", editState: 1 }
                ]
            }
        };
        // Act
        oAdapter = new ContainerAdapter(oSystem, sParameter, oAdapterConfig);
        oAdapter.load().always(function () {
            oUser = oAdapter.getUser();
            assert.equal(typeof oUser, "object", "Success: User object was returned.");
            assert.equal(oUser.getAccessibilityMode(), oAdapterConfig.config.accessibility,
                "Success: Accessibility on (" + oUser.getAccessibilityMode() + ") from adapter config is set correctly.");
            assert.equal(oUser.getFirstName(), oAdapterConfig.config.firstName,
                "Success: First name (" + oUser.getFirstName() + ") from adapter config is set correctly.");
            assert.equal(oUser.getId(), oAdapterConfig.config.id,
                "Success: ID (" + oUser.getId() + ") from adapter config is set correctly.");
            assert.equal(oUser.getLanguage(), oAdapterConfig.config.language,
                "Success: Language (" + oUser.getLanguage() + ") from adapter config is set correctly.");
            assert.equal(oUser.isSetThemePermitted(), oAdapterConfig.config.setThemePermitted,
                "Success: Set theme permitted (" + oUser.isSetThemePermitted() + ") from adapter config is set correctly.");
            assert.equal(oUser.getTheme(), oAdapterConfig.config.bootTheme.theme,
                "Success: Theme (" + oUser.getTheme() + ") from adapter config is set correctly.");
            done();
        });
    });

    QUnit.test("check that system properties are set in the system correctly", function (assert) {
        var done = assert.async();
        var oSystem = new System({ alias: "myAlias", platform: "cdm" }),
            sParameter,
            oAdapterConfig,
            oAdapter;

        // Arrange
        assert.expect(8);
        oAdapterConfig = {
            config: {
                systemProperties: {
                    productName: "myProduct",
                    systemName: "mySystemName",
                    systemRole: "mySystemRole",
                    tenantRole: "myTenantRole",
                    productVersion: "myProductVersion"
                }
            }
        };
        // Act
        oAdapter = new ContainerAdapter(oSystem, sParameter, oAdapterConfig);
        oAdapter.load().always(function () {
            oSystem = oAdapter.getSystem();
            assert.equal(typeof oSystem, "object", "Success: System object was returned.");
            assert.equal(oSystem.getPlatform(), "cdm", "Successfully set platform");
            assert.equal(oSystem.getAlias(), "myAlias", "Successfully set alias");
            assert.equal(oSystem.getProductName(), "myProduct", "Successfully set productName");
            assert.equal(oSystem.getSystemName(), "mySystemName", "Successfully set systemName");
            assert.equal(oSystem.getSystemRole(), "mySystemRole", "Successfully set systemRole");
            assert.equal(oSystem.getTenantRole(), "myTenantRole", "Successfully set tenantRole");
            assert.equal(oSystem.getProductVersion(), "myProductVersion", "Successfully set productVersion");
            done();
        });
    });

    [
        { ui5Lang: undefined, expectedLang: "en" },
        { ui5Lang: "en-US", expectedLang: "en-US" },
        { ui5Lang: "de", expectedLang: "de" }
    ].forEach(function (oFixture) {
        QUnit.test("create adapter with default config; UI5 language " + oFixture.ui5Lang, function (assert) {
            var done = assert.async();
            var oSystem = new System({}),
                sParameter,
                oAdapterConfig,
                oAdapterDefaultConfig,
                oAdapter,
                oUser;

            // fake UI5 language
            var oGetLanguageStub = sinon.stub(Localization, "getLanguage").returns(oFixture.ui5Lang);

            // Arrange
            assert.expect(7);
            oAdapterConfig = {};
            oAdapterDefaultConfig = { // default values copied form the adapter
                id: "DEFAULT_USER",
                firstName: "Default",
                lastName: "User",
                fullName: "Default User",
                accessibility: false,
                isJamActive: false,
                language: "en",
                bootTheme: {
                    theme: "sap_horizon",
                    root: ""
                },
                setAccessibilityPermitted: true,
                setThemePermitted: true
            };
            // Act
            oAdapter = new ContainerAdapter(oSystem, sParameter, oAdapterConfig);
            oAdapter.load().always(function () {
                oUser = oAdapter.getUser();
                assert.equal(typeof oUser, "object", "Success: User object was returned.");
                assert.equal(oUser.getAccessibilityMode(), oAdapterDefaultConfig.accessibility,
                    "Success: Accessibility on (" + oUser.getAccessibilityMode() + ") from adapter config is set correctly.");
                assert.equal(oUser.getFirstName(), oAdapterDefaultConfig.firstName,
                    "Success: First name (" + oUser.getFirstName() + ") from adapter config is set correctly.");
                assert.equal(oUser.getId(), oAdapterDefaultConfig.id,
                    "Success: ID (" + oUser.getId() + ") from adapter config is set correctly.");
                assert.equal(oUser.getLanguage(), oFixture.expectedLang,
                    "Success: Language (" + oUser.getLanguage() + ") from adapter config is set correctly.");
                assert.equal(oUser.isSetThemePermitted(), oAdapterDefaultConfig.setThemePermitted,
                    "Success: Set theme permitted (" + oUser.isSetThemePermitted() + ") from adapter config is set correctly.");
                assert.equal(oUser.getTheme(), oAdapterDefaultConfig.bootTheme.theme,
                    "Success: Theme (" + oUser.getTheme() + ") from adapter config is set correctly.");

                oGetLanguageStub.restore();
                done();
            });
        });
    });

    QUnit.test("setUserCallback with namespace", function (assert) {
        var done = assert.async();
        var oSystem = new System({}),
            sParameter,
            oAdapterConfig,
            oAdapter,
            oUser,
            oUserName;

        // Arrange
        assert.expect(5);
        oAdapterConfig = {
            config: {
                setUserCallback: "sap.mobile.setUser"
            }
        };
        oUserName = {
            id: "DELAYED_USER",
            firstName: "Delayed",
            lastName: "User",
            fullName: "Delayed User"
        };
        // Act
        sap.mobile = sap.mobile || {};
        sap.mobile.setUser = function (oDeferred) {
            setTimeout(function () {
                oDeferred.resolve(oUserName);
            }, 500);
        };
        oAdapter = new ContainerAdapter(oSystem, sParameter, oAdapterConfig);
        oUser = oAdapter.getUser();
        // Assert
        assert.equal(oUser, undefined, "User object is still undefined");
        // Act - set the username
        oAdapter.load().always(function () {
            oUser = oAdapter.getUser();
            assert.equal(oUser.getId(), oUserName.id,
                "Success: User ID (" + oUser.getId() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getFirstName(), oUserName.firstName,
                "Success: First name (" + oUser.getFirstName() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getLastName(), oUserName.lastName,
                "Success: Last name (" + oUser.getLastName() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getFullName(), oUserName.fullName,
                "Success: Full name (" + oUser.getFullName() + ") was set correctly via callback mechanism.");
            done();
        });
    });

    QUnit.test("setUserCallback without namespace", function (assert) {
        var done = assert.async();
        var oSystem = new System({}),
            sParameter,
            oAdapterConfig,
            oAdapter,
            oUser,
            oUserName;

        // Arrange
        assert.expect(5);
        oAdapterConfig = {
            config: {
                setUserCallback: "setUser"
            }
        };
        oUserName = {
            id: "DELAYED_USER",
            firstName: "Delayed",
            lastName: "User",
            fullName: "Delayed User"
        };
        // Act
        window.setUser = function (oDeferred) {
            setTimeout(function () {
                oDeferred.resolve(oUserName);
            }, 500);
        };
        oAdapter = new ContainerAdapter(oSystem, sParameter, oAdapterConfig);
        oUser = oAdapter.getUser();
        // Assert
        assert.equal(oUser, undefined, "User object is still undefined");
        // Act - set the username
        oAdapter.load().always(function () {
            oUser = oAdapter.getUser();
            assert.equal(oUser.getId(), oUserName.id,
                "Success: User ID (" + oUser.getId() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getFirstName(), oUserName.firstName,
                "Success: First name (" + oUser.getFirstName() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getLastName(), oUserName.lastName,
                "Success: Last name (" + oUser.getLastName() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getFullName(), oUserName.fullName,
                "Success: Full name (" + oUser.getFullName() + ") was set correctly via callback mechanism.");
            done();
        });
    });

    QUnit.test("logout()", function (assert) {
        var oSystem = new System({}),
            oSystemAdapter = new ContainerAdapter(oSystem);

        // code under test
        return oSystemAdapter.logout().then(function () {
            assert.ok(utils.reload.calledOnce, "reload called");
        });
    });
});

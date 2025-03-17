// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for bootstrap common.util.js
 */
sap.ui.define([
    "sap/ushell/bootstrap/common/common.util"
], function (oUtil) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("common.util");

    [{
        testDescription: "add trailing slash when no slash at the end",
        input: "some/link",
        expectedResult: "some/link/"
    }, {
        testDescription: "add trailing slash when slash at the end",
        input: "some/new/link/",
        expectedResult: "some/new/link/"
    }, {
        testDescription: "return input when input is not string",
        input: undefined,
        expectedResult: undefined
    }].forEach(function (oFixture) {
        QUnit.test("ensureTrailingSlash: " + oFixture.testDescription, function (assert) {
            var oResult;

            // act
            oResult = oUtil.ensureTrailingSlash(oFixture.input);

            // assert
            assert.equal(oResult, oFixture.expectedResult);
        });
    });

    QUnit.test("set sap-statistics value", function (assert) {
        var fnGetItem = sinon.stub(Storage.prototype, "getItem"),
            aSearchFalse = ["?", "?a=b", "?sap-statistics=false"],
            aSearchTrue = ["?sap-statistics=true", "?sap-statistics=X", "?sap-statistics=x"];

        // if local storage is not set, the query parameter decides
        fnGetItem.returns(undefined);
        aSearchFalse.forEach(function (sSearch) {
            assert.strictEqual(oUtil.isSapStatisticsSet(sSearch), false,
                "no local storage - " + sSearch);
        });
        aSearchTrue.forEach(function (sSearch) {
            assert.strictEqual(oUtil.isSapStatisticsSet(sSearch), true,
                "no local storage - " + sSearch);
        });

        // always true if value is set via local storage
        fnGetItem.returns("X");
        aSearchFalse.forEach(function (sSearch) {
            assert.strictEqual(oUtil.isSapStatisticsSet(sSearch), true,
                "set via local storage - " + sSearch);
        });
        aSearchTrue.forEach(function (sSearch) {
            assert.strictEqual(oUtil.isSapStatisticsSet(sSearch), true,
                "set via local storage - " + sSearch);
        });
    });

    QUnit.module("migrateV2ServiceConfig");

    QUnit.test("Migrates all services if old service is available and the new is not defined", function (assert) {
        // Arrange
        const oConfig = {
            services: {
                Bookmark: { config: "BookmarkConfig" },
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" },
                Notifications: { config: "NotificationsConfig" },
                Personalization: { config: "PersonalizationConfig" }
            }
        };
        const oExpectedConfig = {
            services: {
                Bookmark: { config: "BookmarkConfig" },
                BookmarkV2: { config: "BookmarkConfig" },
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" },
                Navigation: { config: "CrossApplicationNavigationConfig" },
                Notifications: { config: "NotificationsConfig" },
                NotificationsV2: { config: "NotificationsConfig" },
                Personalization: { config: "PersonalizationConfig" },
                PersonalizationV2: { config: "PersonalizationConfig" }
            }
        };
        const oBeforeConfig = JSON.parse(JSON.stringify(oConfig));
        // Act
        oUtil.migrateV2ServiceConfig(oConfig);
        // Assert
        assert.notDeepEqual(oConfig, oBeforeConfig, "Config was updated inplace.");
        assert.deepEqual(oConfig, oExpectedConfig, "Config was updated correctly.");
    });

    QUnit.test("Does not migrates if old service is available, but the new is also defined", function (assert) {
        // Arrange
        const oConfig = {
            services: {
                Bookmark: { config: "BookmarkConfig" },
                BookmarkV2: { config: "BookmarkConfigV2" },
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" },
                Navigation: { config: "NavigationConfig" },
                Notifications: { config: "NotificationsConfig" },
                NotificationsV2: { config: "NotificationsV2Config" },
                Personalization: { config: "PersonalizationConfig" },
                PersonalizationV2: { config: "PersonalizationV2Config" }
            }
        };
        const oExpectedConfig = {
            services: {
                Bookmark: { config: "BookmarkConfig" },
                BookmarkV2: { config: "BookmarkConfigV2" },
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" },
                Navigation: { config: "NavigationConfig" },
                Notifications: { config: "NotificationsConfig" },
                NotificationsV2: { config: "NotificationsV2Config" },
                Personalization: { config: "PersonalizationConfig" },
                PersonalizationV2: { config: "PersonalizationV2Config" }
            }
        };
        // Act
        oUtil.migrateV2ServiceConfig(oConfig);
        // Assert
        assert.deepEqual(oConfig, oExpectedConfig, "Config was updated correctly.");
    });

    QUnit.test("Does a partial migration", function (assert) {
        // Arrange
        const oConfig = {
            services: {
                BookmarkV2: { config: "BookmarkConfigV2" }, // should not be changed
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" } // should be migrated
                // Notifications should not be added
            }
        };
        const oExpectedConfig = {
            services: {
                BookmarkV2: { config: "BookmarkConfigV2" },
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" },
                Navigation: { config: "CrossApplicationNavigationConfig" }
            }
        };
        // Act
        oUtil.migrateV2ServiceConfig(oConfig);
        // Assert
        assert.deepEqual(oConfig, oExpectedConfig, "Config was updated correctly.");
    });

    QUnit.test("Does not copy the default module property", function (assert) {
        // Arrange
        const oConfig = {
            services: {
                NavTargetResolution: { config: "NavTargetResolutionConfig", module: "sap.ushell.services.NavTargetResolution" }
            }
        };
        const oExpectedConfig = {
            services: {
                NavTargetResolution: { config: "NavTargetResolutionConfig", module: "sap.ushell.services.NavTargetResolution" },
                NavTargetResolutionInternal: { config: "NavTargetResolutionConfig" }
            }
        };
        // Act
        oUtil.migrateV2ServiceConfig(oConfig);
        // Assert
        assert.deepEqual(oConfig, oExpectedConfig, "Config was updated correctly.");
    });

    QUnit.module("getV2ServiceMigrationConfig");

    QUnit.test("Migrates all services if old service is available and the new is not defined", function (assert) {
        // Arrange
        const oConfig = {
            services: {
                Bookmark: { config: "BookmarkConfig" },
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" },
                Notifications: { config: "NotificationsConfig" },
                Personalization: { config: "PersonalizationConfig" }
            }
        };
        const oExpectedMigration = {
            services: {
                BookmarkV2: { config: "BookmarkConfig" },
                Navigation: { config: "CrossApplicationNavigationConfig" },
                NotificationsV2: { config: "NotificationsConfig" },
                PersonalizationV2: { config: "PersonalizationConfig" }
            }
        };
        const oBeforeConfig = JSON.parse(JSON.stringify(oConfig));
        // Act
        const oMigration = oUtil.getV2ServiceMigrationConfig(oConfig);
        // Assert
        assert.deepEqual(oConfig, oBeforeConfig, "Original config was not changed.");
        assert.deepEqual(oMigration, oExpectedMigration, "Returned correct migration.");
    });

    QUnit.test("Does not migrate if old service is available, but the new is also defined", function (assert) {
        // Arrange
        const oConfig = {
            services: {
                Bookmark: { config: "BookmarkConfig" },
                BookmarkV2: { config: "BookmarkConfigV2" },
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" },
                Navigation: { config: "NavigationConfig" },
                Notifications: { config: "NotificationsConfig" },
                NotificationsV2: { config: "NotificationsV2Config" },
                Personalization: { config: "PersonalizationConfig" },
                PersonalizationV2: { config: "PersonalizationV2Config" }
            }
        };
        const oExpectedMigration = {};
        const oBeforeConfig = JSON.parse(JSON.stringify(oConfig));
        // Act
        const oMigration = oUtil.getV2ServiceMigrationConfig(oConfig);
        // Assert
        assert.deepEqual(oConfig, oBeforeConfig, "Original config was not changed.");
        assert.deepEqual(oMigration, oExpectedMigration, "Returned correct migration.");
    });

    QUnit.test("Does a partial migration", function (assert) {
        // Arrange
        const oConfig = {
            services: {
                BookmarkV2: { config: "BookmarkConfigV2" }, // should not be changed
                CrossApplicationNavigation: { config: "CrossApplicationNavigationConfig" } // should be migrated
                // Notifications should not be added
            }
        };
        const oExpectedMigration = {
            services: {
                Navigation: { config: "CrossApplicationNavigationConfig" }
            }
        };
        const oBeforeConfig = JSON.parse(JSON.stringify(oConfig));
        // Act
        const oMigration = oUtil.getV2ServiceMigrationConfig(oConfig);
        // Assert
        assert.deepEqual(oConfig, oBeforeConfig, "Original config was not changed.");
        assert.deepEqual(oMigration, oExpectedMigration, "Returned correct migration.");
    });

    QUnit.test("Does not copy the default module property", function (assert) {
        // Arrange
        const oConfig = {
            services: {
                NavTargetResolution: { config: "NavTargetResolutionConfig", module: "sap.ushell.services.NavTargetResolution" }
            }
        };
        const oExpectedMigration = {
            services: {
                NavTargetResolutionInternal: { config: "NavTargetResolutionConfig" }
            }
        };
        const oBeforeConfig = JSON.parse(JSON.stringify(oConfig));
        // Act
        const oMigration = oUtil.getV2ServiceMigrationConfig(oConfig);
        // Assert
        assert.deepEqual(oConfig, oBeforeConfig, "Original config was not changed.");
        assert.deepEqual(oMigration, oExpectedMigration, "Returned correct migration.");
    });
});

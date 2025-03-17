// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserRecents
 */
sap.ui.define([
    "sap/ushell/library",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/services/UserRecents",
    "sap/ushell/services/UserRecents/UserRecentsBase",
    "sap/ushell/resources",
    "sap/ushell/services/PersonalizationV2/WindowAdapter",
    "sap/ushell/utils/AppType",
    "sap/ushell/Container",
    "sap/base/util/ObjectPath",
    "sap/ushell/services/PersonalizationV2/ContextContainer"
], function (
    ushellLibrary,
    sinon,
    UserRecents,
    UserRecentsBase,
    resources,
    WindowAdapter,
    AppTypeUtils,
    Container,
    ObjectPath,
    ContextContainer
) {
    "use strict";

    const AppType = ushellLibrary.AppType;

    /* global QUnit */
    const sandbox = sinon.createSandbox();

    QUnit.config.reorder = false;

    QUnit.module("sap.ushell.services.UserRecents", {
        beforeEach: async function () {
            this.sCachedConfig = JSON.stringify(window["sap-ushell-config"] || {});

            // Set personalization config to use memory instead of local storage
            ObjectPath.set("sap-ushell-config.services.Personalization.adapter.config.storageType", "MEMORY");
            ObjectPath.set("sap-ushell-config.services.Personalization.adapter.config.personalizationData", {});
            ObjectPath.set("sap-ushell-config.services.PersonalizationV2.adapter.config.storageType", "MEMORY");
            ObjectPath.set("sap-ushell-config.services.PersonalizationV2.adapter.config.personalizationData", {});
            // avoid loading default dependencies (scaffolding lib) in unit test
            ObjectPath.set("sap-ushell-config.services.Ui5ComponentLoader", {
                config: {
                    loadDefaultDependencies: false
                }
            });

            await Container.init("local");

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceAsyncStub.withArgs("Navigation").resolves({
                isNavigationSupported: sandbox.stub().callsFake(async (aIntents) => {
                    return aIntents.map(function (oIntent) {
                        return { supported: true };
                    });
                })
            });
            this.oGetServiceAsyncStub.callThrough();
            this.oUserRecentsService = new UserRecents();
            sandbox.spy(ContextContainer.prototype, "save");
        },

        afterEach: function () {
            sandbox.restore();
            Container.reset();
            window["sap-ushell-config"] = JSON.parse(this.sCachedConfig);

            // delete personalization data
            WindowAdapter.prototype.data = {};
            UserRecentsBase.prototype.oContainerPromise = undefined;
        }
    });

    QUnit.test("getServiceUserRecents", function (assert) {
        assert.notStrictEqual(this.oUserRecentsService, undefined, "The UserRecents service was created.");
        assert.strictEqual(typeof this.oUserRecentsService, "object", "The UserRecents service has the correct primitive type.");
    });

    QUnit.test("getRecentsApps", async function (assert) {
        // Act
        const aRecentApps = await this.oUserRecentsService.getRecentApps();

        // Assert
        assert.deepEqual(aRecentApps, [], "Initial Recent Apps are empty");
        assert.strictEqual(aRecentApps.length, 0, "Empty list");
    });

    QUnit.test("getRecentSearches", async function (assert) {
        // Act
        const aRecentSearches = await this.oUserRecentsService.getRecentSearches();

        // Assert
        assert.deepEqual(aRecentSearches, [], "Initial Recent Searches is empty");
        assert.strictEqual(aRecentSearches.length, 0, "Empty list");
    });

    QUnit.test("getAppsUsage", async function (assert) {
        // Act
        const aUserAppsUsage = await this.oUserRecentsService.getAppsUsage();

        // Assert
        assert.strictEqual(typeof aUserAppsUsage, "object", "User Apps Usage return");
    });

    QUnit.test("MultiAppUsageSameDay", async function (assert) {
        // Arrange
        const hash1 = "#Action-toApp1";
        await this.oUserRecentsService.addAppUsage(hash1);
        await this.oUserRecentsService.addAppUsage(hash1);
        await this.oUserRecentsService.addAppUsage(hash1);

        await this.oUserRecentsService.addAppUsage("#Action-toApp2");

        const hash3 = "#Action-toApp3";
        await this.oUserRecentsService.addAppUsage(hash3);
        await this.oUserRecentsService.addAppUsage(hash3);
        await this.oUserRecentsService.addAppUsage(hash3);
        await this.oUserRecentsService.addAppUsage(hash3);
        await this.oUserRecentsService.addAppUsage(hash3);

        // Act
        const aUserAppsUsage = await this.oUserRecentsService.getAppsUsage();

        // Assert
        assert.notStrictEqual(aUserAppsUsage, undefined, "User Apps Usage return");

        assert.strictEqual(aUserAppsUsage.usageMap["Action-toApp1"], 3, "app1 usage = 3");
        assert.strictEqual(aUserAppsUsage.usageMap["Action-toApp2"], 1, "app2 usage = 1");
        assert.strictEqual(aUserAppsUsage.usageMap["Action-toApp3"], 5, "app3 usage = 5");

        //validate min & max values (min = 1, max = 5)
        assert.strictEqual(aUserAppsUsage.minUsage, 1, "Min value of User Apps Usage = 1");
        assert.ok(aUserAppsUsage.maxUsage >= 5, "Max value of User Apps Usage = 5");
    });

    QUnit.test("AppUsageDifferentDays", async function (assert) {
        // Arrange
        const hash4 = "#Action-toApp4";
        const hash5 = "#Action-toApp5";

        sandbox.useFakeTimers({
            now: new Date("2014-04-01T08:00:00"),
            shouldAdvanceTime: true
        });
        await this.oUserRecentsService.addAppUsage(hash4);
        await this.oUserRecentsService.addAppUsage(hash5);
        await this.oUserRecentsService.addAppUsage(hash5);
        sandbox.clock.restore();

        sandbox.useFakeTimers({
            now: new Date("2014-04-02T08:00:00"),
            shouldAdvanceTime: true
        });
        await this.oUserRecentsService.addAppUsage(hash4);
        await this.oUserRecentsService.addAppUsage(hash4);
        sandbox.clock.restore();

        sandbox.useFakeTimers({
            now: new Date("2014-04-03T08:00:00"),
            shouldAdvanceTime: true
        });
        await this.oUserRecentsService.addAppUsage(hash4);
        sandbox.clock.restore();

        sandbox.useFakeTimers({
            now: new Date("2014-04-04T08:00:00"),
            shouldAdvanceTime: true
        });
        await this.oUserRecentsService.addAppUsage(hash4);
        await this.oUserRecentsService.addAppUsage(hash4);
        await this.oUserRecentsService.addAppUsage(hash5);
        sandbox.clock.restore();

        // Act
        const aUserAppsUsage = await this.oUserRecentsService.getAppsUsage();
        // Assert
        assert.strictEqual(aUserAppsUsage.usageMap["Action-toApp4"], 6, "Amount of User Apps Usage = 6");
        assert.strictEqual(aUserAppsUsage.usageMap["Action-toApp5"], 3, "Amount of User Apps Usage = 3");
    });

    QUnit.test("InvalidAppUsageHash", async function (assert) {
        // Act
        const aResults = await Promise.allSettled([
            this.oUserRecentsService.addAppUsage(null),
            this.oUserRecentsService.addAppUsage(""),
            this.oUserRecentsService.addAppUsage(" "),
            this.oUserRecentsService.addAppUsage(undefined),
            this.oUserRecentsService.addAppUsage({ a: "1", b: "2", c: "3" }),
            this.oUserRecentsService.addAppUsage(function () { }),
            this.oUserRecentsService.addAppUsage(1),
            this.oUserRecentsService.addAppUsage(true)
        ]);

        // Assert
        aResults.forEach(function (oResult) {
            assert.strictEqual(oResult.status, "rejected", "Promise was rejected");
        });
        const aUserAppsUsage = await this.oUserRecentsService.getAppsUsage();
        assert.strictEqual(Object.keys(aUserAppsUsage.usageMap).length, 0, "Amount of User Apps Usage Didn't change");
        assert.deepEqual(aUserAppsUsage.usageMap, {}, "Amount of User Apps Usage Didn't change");
    });

    QUnit.test("set / get recent activity", async function (assert) {
        // Arrange
        const oActivity = {
            title: "BO application",
            appType: AppType.FACTSHEET,
            appId: "#Action-toappnavsample",
            url: "#Action-toappnavsample&1837"
        };

        // Act
        await this.oUserRecentsService.addActivity(oActivity);

        // Assert
        const aRecentActivity = await this.oUserRecentsService.getRecentActivity();
        assert.strictEqual(aRecentActivity.length, 1, "we have 1 recent activities in the recent activity list");
        assert.deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
    });

    QUnit.test("save only called once for addActivity with new item", async function (assert) {
        // Arrange
        const oActivity = {
            title: "BO application",
            appType: AppType.FACTSHEET,
            appId: "#Action-toappnavsample",
            url: "#Action-toappnavsample&1837"
        };

        // Act
        await this.oUserRecentsService.addActivity(oActivity);

        // Assert
        assert.strictEqual(ContextContainer.prototype.save.callCount, 1, "saved only once");
    });

    QUnit.test("save only called once for addActivity with existing item", async function (assert) {
        // Arrange
        const oActivity = {
            title: "BO application",
            appType: AppType.FACTSHEET,
            appId: "#Action-toappnavsample",
            url: "#Action-toappnavsample&1837"
        };

        // Act
        await this.oUserRecentsService.addActivity(oActivity);
        ContextContainer.prototype.save.resetHistory();
        await this.oUserRecentsService.addActivity(oActivity);

        // Assert
        assert.strictEqual(ContextContainer.prototype.save.callCount, 1, "saved only once");
    });

    QUnit.test("update activity that is already in the recent activity list", async function (assert) {
        // Arrange
        const oActivity1 = {
            title: "title on desktop 2",
            appType: AppType.APP,
            appId: "#PurchaseOrder-display",
            url: "#PurchaseOrder-display&/View1"
        };

        const oActivity2 = {
            title: "title on desktop 2",
            appType: AppType.FACTSHEET,
            appId: "#Action-toappnavsample",
            url: "#Action-toappnavsample&1837"
        };

        await this.oUserRecentsService.addActivity(oActivity1);
        await this.oUserRecentsService.addActivity(oActivity2);

        let aRecentActivity = await this.oUserRecentsService.getRecentActivity();
        const oLastRecentActivity = aRecentActivity[aRecentActivity.length - 1];
        assert.strictEqual(aRecentActivity.length, 2, "we have 2 recent activities in the recent activity list");
        assert.notStrictEqual(aRecentActivity[0].appId, oActivity1.appId, "most recent activity is not oActivity1");
        assert.deepEqual(oLastRecentActivity, oActivity1, "Least recent activity is oActivity1");

        const oActivity1Update = {
            title: "Updated title",
            appType: AppType.APP,
            appId: "#PurchaseOrder-display",
            url: "#PurchaseOrder-display&/View1"
        };

        // Act
        await this.oUserRecentsService.addActivity(oActivity1Update);

        // Assert
        aRecentActivity = await this.oUserRecentsService.getRecentActivity();
        assert.strictEqual(aRecentActivity.length, 2, "we have 2 recent activities in the recent activity list");
        assert.deepEqual(aRecentActivity[0].appId, oActivity1Update.appId, "Most recent activity is oActivity1");
    });

    QUnit.test("Update existing recent activity of type 'Application' with different type 'OVP'", async function (assert) {
        // Arrange
        const oActivityBefore = {
            title: "title on desktop 2",
            appType: AppType.APP,
            appId: "#PurchaseOrder-display",
            url: "#PurchaseOrder-display&/View1",
            icon: "someIconUri"
        };

        await this.oUserRecentsService.addActivity(oActivityBefore);
        const aRecentActivityBefore = await this.oUserRecentsService.getRecentActivity();
        assert.strictEqual(aRecentActivityBefore.length, 1, "we have 1 recent activities in the recent activity list");

        const oUpdatedActivity = {
            title: "Updated Title",
            appType: AppType.OVP,
            appId: "#PurchaseOrder-display",
            url: "#PurchaseOrder-display&/View1",
            icon: "someIconUri"
        };

        // Act
        await this.oUserRecentsService.addActivity(oUpdatedActivity);

        // Assert
        const aRecentActivity = await this.oUserRecentsService.getRecentActivity();
        assert.strictEqual(aRecentActivity.length, 1, "we have 1 recent activities in the recent activity list");
        const oFirstEntry = aRecentActivity[0];

        // see that the entries are with same appId and Url --> considered as equal
        assert.strictEqual(oFirstEntry.appId, oActivityBefore.appId, "appId should be identical");
        assert.strictEqual(oFirstEntry.url, oActivityBefore.url, "url should be identical");
        assert.notStrictEqual(oFirstEntry.appType, oActivityBefore.appType, "appType should not be the same");

        assert.strictEqual(oFirstEntry.appType, oUpdatedActivity.appType, "appType should be the same");
        assert.strictEqual(oFirstEntry.icon, oUpdatedActivity.icon, "icon property set correctly");
    });

    QUnit.test("Update existing recent activity of type 'OVP' with different type 'Application'", async function (assert) {
        /*
         * the first entry of the existing entries will have the same appId and Url as the entry we are about to add
         * this comes to test the merging behavior of the User Recent.
         * As the entry we are about to add is of type 'Application' we expect the item NOT to be overridden
         */
        // Arrange
        const oActivityBefore = {
            title: "title on desktop 2",
            appType: AppType.OVP,
            appId: "#PurchaseOrder-display",
            url: "#PurchaseOrder-display&/View1",
            icon: "someIconUri"
        };

        await this.oUserRecentsService.addActivity(oActivityBefore);
        const aRecentActivityBefore = await this.oUserRecentsService.getRecentActivity();
        assert.strictEqual(aRecentActivityBefore.length, 1, "we have 1 recent activities in the recent activity list");

        const oUpdatedActivity = {
            title: "Updated Title",
            appType: AppType.APP,
            appId: "#PurchaseOrder-display",
            url: "#PurchaseOrder-display&/View1",
            icon: "someIconUri"
        };

        // Act
        await this.oUserRecentsService.addActivity(oUpdatedActivity);

        // Assert
        const aRecentActivity = await this.oUserRecentsService.getRecentActivity();
        assert.strictEqual(aRecentActivity.length, 1, "we have 1 recent activities in the recent activity list");
        const oFirstEntry = aRecentActivity[0];

        // see that the entries are with same appId and Url --> considered as equal
        assert.strictEqual(oFirstEntry.appId, oActivityBefore.appId, "appId should be identical");
        assert.strictEqual(oFirstEntry.url, oActivityBefore.url, "url should be identical");
        assert.strictEqual(oFirstEntry.appType, oActivityBefore.appType, "appType should not be the same");

        assert.notStrictEqual(oFirstEntry.appType, oUpdatedActivity.appType, "appType should be the same");
        assert.notStrictEqual(oFirstEntry.title, oUpdatedActivity.title, "title was not updated");
    });

    QUnit.test("add an activity that has a url not starting with '#'", async function (assert) {
        // Arrange
        const oActivity = {
            title: "BO application",
            appType: AppType.FACTSHEET,
            appId: "#Action-toappnavsample",
            url: "http://xxx.com?a=1"
        };

        // Act
        await this.oUserRecentsService.addActivity(oActivity);

        // Assert
        const aRecentActivity = await this.oUserRecentsService.getRecentActivity();
        assert.deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
    });

    QUnit.test("set multi recent activities of the same application", async function (assert) {
        // Arrange
        const oActivity = {
            title: "New application",
            appType: "Application",
            appId: "#new-app",
            url: "#new-app"
        };

        // Act
        for (let i = 0; i < 10; i++) {
            await this.oUserRecentsService.addActivity(oActivity);
        }

        // Assert
        const aRecentActivity = await this.oUserRecentsService.getRecentActivity();
        assert.strictEqual(aRecentActivity.length, 1, "we have 2 recent activities in the recent activity list");
        aRecentActivity[0].timestamp = oActivity.timestamp;
        assert.deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
    });

    QUnit.test("set more then 30 recent activities with a different application id", async function (assert) {
        // Arrange
        const oActivity = {
            title: "OVP application",
            appType: "OVP",
            appId: "#Action-todefaultapp",
            url: "#Action-todefaultapp&1899"
        };

        // Act
        for (let i = 0; i < 40; i++) {
            oActivity.url += "x";
            await this.oUserRecentsService.addActivity(oActivity);
        }

        // Assert
        const aRecentActivity = await this.oUserRecentsService.getRecentActivity();
        assert.equal(aRecentActivity.length, 30, "30 datasets");
        aRecentActivity[0].timestamp = oActivity.timestamp;
        assert.deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
    });

    QUnit.test("AppType display name corresponds to type", async function (assert) {
        assert.equal(AppTypeUtils.getDisplayName(AppType.OVP), resources.i18n.getText("Apptype.OVP"), "Translated text for OVP is correct.");
        assert.equal(AppTypeUtils.getDisplayName(AppType.SEARCH), resources.i18n.getText("Apptype.SEARCH"), "Translated text for SEARCH is correct.");
        assert.equal(AppTypeUtils.getDisplayName(AppType.FACTSHEET), resources.i18n.getText("Apptype.FACTSHEET"), "Translated text for FACTSHEET is correct.");
        assert.equal(AppTypeUtils.getDisplayName(AppType.COPILOT), resources.i18n.getText("Apptype.COPILOT"), "Translated text for COPILOT is correct.");
        assert.equal(AppTypeUtils.getDisplayName(AppType.URL), resources.i18n.getText("Apptype.URL"), "Translated text for URL is correct.");
        assert.equal(AppTypeUtils.getDisplayName(AppType.APP), resources.i18n.getText("Apptype.APP"), "Translated text for APP is correct.");
        assert.equal(AppTypeUtils.getDisplayName("None-standard"), resources.i18n.getText("Apptype.APP"), "Translated text for non-standard app type is correct.");
    });

    QUnit.test("Add frequent activity once", async function (assert) {
        // Arrange
        const oActivity = {
            title: "title on desktop 2",
            appType: AppType.FACTSHEET,
            appId: "#Action-toappnavsample",
            url: "#Action-toappnavsample&/View2"
        };

        // Act
        await this.oUserRecentsService.addActivity(oActivity);

        // Assert
        const aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.deepEqual(aFrequentActivity, [], "User Frequent activity return");
        assert.strictEqual(aFrequentActivity.length, 0, "The activity was not added to the Frequently Used list");
    });

    QUnit.test("Add frequent activity twice", async function (assert) {
        // Arrange
        const oActivity = {
            title: "BO application",
            appType: AppType.FACTSHEET,
            appId: "#Action-toappnavsample",
            url: "#Action-toappnavsample&1837"
        };

        // Act
        await this.oUserRecentsService.addActivity(oActivity);
        await this.oUserRecentsService.addActivity(oActivity);

        // Assert
        const aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.strictEqual(aFrequentActivity.length, 1, "The activity was added to the Frequently Used list");
    });

    QUnit.test("Update activity that is already in the frequent activity list", async function (assert) {
        // Arrange
        const oActivityBefore = {
            title: "Search application",
            appType: AppType.SEARCH,
            appId: "#Action-todefaultapp",
            url: "#Action-search&/searchterm=Sample%20App"
        };

        await this.oUserRecentsService.addActivity(oActivityBefore);
        await this.oUserRecentsService.addActivity(oActivityBefore);
        let aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.strictEqual(aFrequentActivity.length, 1, "we have 1 frequent activity in the list");

        const oActivity = {
            title: "Updated title",
            appType: AppType.SEARCH,
            appId: "#Action-todefaultapp",
            url: "#Action-search&/searchterm=Sample%20App"
        };

        // Act
        await this.oUserRecentsService.addActivity(oActivity);

        // Assert
        aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.strictEqual(aFrequentActivity.length, 1, "the number of frequent activities in the list was not changed");
    });

    QUnit.test("Set multi frequent activities of the same application", async function (assert) {
        // Arrange
        const oActivity = {
            title: "New application2",
            appType: AppType.APP,
            appId: "#new-app2",
            url: "#new-app2"
        };

        // Act
        for (let i = 0; i < 12; i++) {
            await this.oUserRecentsService.addActivity(oActivity);
        }

        // Assert
        const aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.strictEqual(aFrequentActivity.length, 1, "Only one activity was added to the frequent activities list");
        assert.strictEqual(aFrequentActivity[0].appId, oActivity.appId, "Most frequent activity is oActivity");
    });

    QUnit.test("Set more than 30 frequent activities with a different application id", async function (assert) {
        // Arrange
        const oActivity = {
            title: "OVP application2",
            appType: AppType.OVP,
            appId: "#Action-todefaultapp2",
            url: "#Action-todefaultapp&18992"
        };

        // Act
        for (let i = 0; i < 40; i++) {
            oActivity.url += "x";
            await this.oUserRecentsService.addActivity(oActivity);
            await this.oUserRecentsService.addActivity(oActivity);
        }

        await this.oUserRecentsService.addActivity(oActivity);

        // Assert
        const aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.equal(aFrequentActivity.length, 30, "30 datasets");
        assert.equal(aFrequentActivity[0].appId, oActivity.appId, "Most frequent activity is oActivity");
    });

    QUnit.test("Test no activity saved before", async function (assert) {
        // Arrange
        const oActivity1 = {
            title: "New application1",
            appType: AppType.APP,
            appId: "#new-app1",
            url: "#new-app1"
        };
        const oActivity2 = {
            title: "New application2",
            appType: AppType.APP,
            appId: "#new-app2",
            url: "#new-app2"
        };

        let aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.deepEqual(aFrequentActivity.length, 0, "No activities");

        // (1) - add activity1 for the first time
        await this.oUserRecentsService.addActivity(oActivity1);
        // (1.1) - see that we have no frequent activities (as activity1 was added only once)
        aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.strictEqual(aFrequentActivity.length, 0, "No activities");

        // (1.2) - add activity1 one more time
        await this.oUserRecentsService.addActivity(oActivity1);
        // (1.3) - see that now we have once frequent activity which is activity1 as it was added twice
        aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.strictEqual(aFrequentActivity.length, 1, "One activity");
        assert.strictEqual(aFrequentActivity[0].appId, oActivity1.appId, "most frequent activity is activity with app " + oActivity1.appId);

        // (2) - add activity2 for the first time
        await this.oUserRecentsService.addActivity(oActivity2);
        // (2.1) - see that we still have only one activity (as activity2 was added only once)
        aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        assert.strictEqual(aFrequentActivity.length, 1, "One activity");
        assert.strictEqual(aFrequentActivity[0].appId, oActivity1.appId, "most frequent activity is activity with app " + oActivity1.appId);

        // (2.2) - add activity2 one more time
        await this.oUserRecentsService.addActivity(oActivity2);
        // (2.3) - see that we have two activities (as activity2 was added twice)
        aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        // (2.4) - see that the order of the returned activities matches the order of usage
        // NOTE that now the order of activities had changed
        assert.strictEqual(aFrequentActivity.length, 2, "Two activity");
        assert.strictEqual(aFrequentActivity[0].appId, oActivity2.appId, "most frequent activity is activity with app " + oActivity2.appId);
        assert.strictEqual(aFrequentActivity[1].appId, oActivity1.appId, "most frequent activity is activity with app " + oActivity1.appId);

        // (3) - add activity2 one more time
        await this.oUserRecentsService.addActivity(oActivity2);
        // (3.1) - see that the order of the returned activities matches the order of usage
        assert.strictEqual(aFrequentActivity.length, 2, "Two activity");
        assert.strictEqual(aFrequentActivity[0].appId, oActivity2.appId, "most frequent activity is activity with app " + oActivity2.appId);
        assert.strictEqual(aFrequentActivity[1].appId, oActivity1.appId, "most frequent activity is activity with app " + oActivity1.appId);

        // (4) - now add activity1 again
        await this.oUserRecentsService.addActivity(oActivity1);
        // (4.1) - see that the order had changed again
        aFrequentActivity = await this.oUserRecentsService.getFrequentActivity();
        // (3.1) - see that the order of the returned activities matches the order of usage
        assert.strictEqual(aFrequentActivity.length, 2, "Two activity");
        assert.strictEqual(aFrequentActivity[0].appId, oActivity1.appId, "most frequent activity is activity with app " + oActivity2.appId);
        assert.strictEqual(aFrequentActivity[1].appId, oActivity2.appId, "most frequent activity is activity with app " + oActivity1.appId);
    });

    QUnit.module("sap.ushell.services.UserRecents - Integration tests", {
        beforeEach: async function () {
            this.sCachedConfig = JSON.stringify(window["sap-ushell-config"] || {});

            // Set personalization config to use memory instead of local storage
            ObjectPath.set("sap-ushell-config.services.Personalization.adapter.config.storageType", "MEMORY");
            ObjectPath.set("sap-ushell-config.services.Personalization.adapter.config.personalizationData", {});
            ObjectPath.set("sap-ushell-config.services.PersonalizationV2.adapter.config.storageType", "MEMORY");
            ObjectPath.set("sap-ushell-config.services.PersonalizationV2.adapter.config.personalizationData", {});
            // avoid loading default dependencies (scaffolding lib) in unit test
            ObjectPath.set("sap-ushell-config.services.Ui5ComponentLoader", {
                config: {
                    loadDefaultDependencies: false
                }
            });

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceAsyncStub.withArgs("Navigation").resolves({
                isNavigationSupported: sandbox.stub().callsFake(async (aIntents) => {
                    return aIntents.map(function (oIntent) {
                        return { supported: true };
                    });
                })
            });
            this.oGetServiceAsyncStub.callThrough();
        },

        afterEach: function () {
            sandbox.restore();
            Container.reset();
            window["sap-ushell-config"] = JSON.parse(this.sCachedConfig);

            // delete personalization data
            WindowAdapter.prototype.data = {};
            UserRecentsBase.prototype.oContainerPromise = undefined;
        }
    });

    QUnit.test("Test activity that was not used for 30 days", async function (assert) {
        // Arrange
        const dToday = new Date();
        const d30DaysAgo = new Date(dToday.setDate(dToday.getDate() - 30));
        ObjectPath.set([
            "sap-ushell-config",
            "services",
            "PersonalizationV2",
            "adapter",
            "config",
            "personalizationData",
            "sap.ushell.personalization#sap.ushell.services.UserRecents",
            "ITEM#RecentActivity"
        ], {
            recentDay: `${d30DaysAgo.getUTCFullYear()}/${d30DaysAgo.getUTCMonth() + 1}/${d30DaysAgo.getUTCDate()}`,
            recentUsageArray: [{
                aUsageArray: [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                desktop: true,
                iCount: 5,
                iTimestamp: Date.now(),
                oItem: {
                    title: "New application3",
                    appType: AppType.APP,
                    appId: "#new-app3",
                    url: "#new-app3",
                    timestamp: Date.now()
                }
            }]
        });
        await Container.init("local");
        const oUserRecentsService = new UserRecents();

        // Act
        const aFrequentActivity = await oUserRecentsService.getFrequentActivity();

        // Assert
        const oActivity = {
            title: "New application3",
            appType: AppType.APP,
            appId: "#new-app3",
            url: "#new-app3"
        };
        const bFound = aFrequentActivity.some(function (oFrequentActivity) {
            return oFrequentActivity.appId === oActivity.appId;
        });
        assert.strictEqual(bFound, false, "The application should not be in the frequently used apps");
    });

    QUnit.test("Test activity that was used every day", async function (assert) {
        // Arrange
        const dToday = new Date();
        ObjectPath.set([
            "sap-ushell-config",
            "services",
            "PersonalizationV2",
            "adapter",
            "config",
            "personalizationData",
            "sap.ushell.personalization#sap.ushell.services.UserRecents",
            "ITEM#RecentActivity"
        ], {
            recentDay: `${dToday.getUTCFullYear()}/${dToday.getUTCMonth() + 1}/${dToday.getUTCDate()}`,
            recentUsageArray: [{
                aUsageArray: [5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                desktop: true,
                iCount: 295,
                iTimestamp: Date.now(),
                oItem: {
                    title: "New application4",
                    appType: AppType.APP,
                    appId: "#new-app4",
                    url: "#new-app4",
                    timestamp: Date.now()
                }
            }, {
                aUsageArray: [0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11],
                desktop: true,
                iCount: 291,
                iTimestamp: Date.now(),
                oItem: {
                    title: "New application5",
                    appType: AppType.APP,
                    appId: "#new-app5",
                    url: "#new-app5",
                    timestamp: Date.now()
                }
            }]
        });
        await Container.init("local");
        const oUserRecentsService = new UserRecents();

        // Act
        const aFrequentActivity = await oUserRecentsService.getFrequentActivity();

        // Assert
        const oActivity = {
            title: "New application4",
            appType: AppType.APP,
            appId: "#new-app4",
            url: "#new-app4"
        };
        assert.strictEqual(aFrequentActivity.length, 2, "the number of frequent activities in the list was not changed");
        assert.strictEqual(aFrequentActivity[0].appId, oActivity.appId, "most frequent activity is oActivity");
    });

    QUnit.test("Test migration of previous data to current data - check backwards compatibility", async function (assert) {
        // Arrange
        // use Mock Data of previous data-structure and check that functionality with previous data is not affected
        ObjectPath.set([
            "sap-ushell-config",
            "services",
            "PersonalizationV2",
            "adapter",
            "config",
            "personalizationData",
            "sap.ushell.personalization#sap.ushell.services.UserRecents",
            "ITEM#RecentActivity"
        ], [
            {
                desktop: undefined,
                tablet: undefined,
                mobile: undefined,
                iCount: 2,
                iTimestamp: Date.now(),
                oItem: {
                    icon: "sap-icon://search",
                    title: "Search application - just to test long text wrapping",
                    appType: AppType.SEARCH,
                    appId: "#Action-todefaultapp",
                    url: "#Action-search&/searchterm=Sample%20App",
                    timestamp: Date.now()
                }
            }, {
                desktop: undefined,
                tablet: undefined,
                mobile: undefined,
                iCount: 1,
                iTimestamp: Date.now(),
                oItem: {
                    title: "title on desktop 2",
                    appType: AppType.APP,
                    appId: "#Action-toappnavsample",
                    url: "#Action-toappnavsample?a=122",
                    timestamp: Date.now()
                }
            }
        ]);
        await Container.init("local");
        const oUserRecentsService = new UserRecents();

        // new activity to add
        const oNewActivity = {
            title: "New application1",
            appType: AppType.App,
            appId: "#new-app1",
            url: "#new-app1"
        };

        // existing activity to add
        const oExistingActivity = {
            title: "title on desktop 2",
            appType: AppType.APP,
            appId: "#Action-toappnavsample",
            url: "#Action-toappnavsample?a=122"
        };

        // Act
        await oUserRecentsService.addActivity(oNewActivity);
        await oUserRecentsService.addActivity(oExistingActivity);

        // see that nothing was affected and API's had worked as expected
        // we expect no results as - when moving to the new data structure, all counts are initialized to 0.
        let aFrequentActivity = await oUserRecentsService.getFrequentActivity();
        // see that we still have 2 activities as the new activity added only once
        // check also that the order of the activities now is updated
        assert.strictEqual(aFrequentActivity.length, 0, "No activities");

        // now add again the new activity
        await oUserRecentsService.addActivity(oNewActivity);
        // see that now we have only one - the new-activity
        aFrequentActivity = await oUserRecentsService.getFrequentActivity();
        assert.strictEqual(aFrequentActivity.length, 1, "one activity");
        assert.strictEqual(aFrequentActivity[0].appId, oNewActivity.appId, "most frequent activity is activity with app " + oNewActivity.appId);
    });
});

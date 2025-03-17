// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Notifications
 * @deprecated As of version 1.120, The Notifications service is deprecated and replaced with NotificationsV2
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/base/util/ObjectPath",
    "sap/ui/core/EventBus",
    "sap/ui/thirdparty/datajs",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/services/Notifications",
    "sap/ushell/services/NotificationsV2",
    "sap/ushell/services/PersonalizationV2",
    "sap/ushell/Container"
], function (
    Localization,
    ObjectPath,
    EventBus,
    OData,
    jQuery,
    Notifications,
    NotificationsV2,
    PersonalizationV2,
    Container
) {
    "use strict";

    const { KeyCategory, WriteFrequency } = PersonalizationV2.prototype;

    /* global QUnit, sinon */

    // Use fake timers to avoid requests being sent after the tests are done.
    sinon.useFakeTimers({
        toFake: ["setTimeout", "setInterval"]
    });

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.services.Notifications", {
        beforeEach: function () {
            this.oNotificationsServiceConfig = {
                config: {
                    enabled: true,
                    serviceUrl: "NOTIFICATIONS_SRV"
                }
            };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("PersonalizationV2").resolves({
                getPersonalizer: sandbox.stub().resolves(),
                KeyCategory,
                WriteFrequency
            });

            this.oNotificationsV2Service = new NotificationsV2(undefined, undefined, this.oNotificationsServiceConfig);
            this.oNotificationsService = new Notifications(undefined, undefined, this.oNotificationsServiceConfig);
            this.oNotificationsService._oNotificationsV2Service = this.oNotificationsV2Service;
            this.oNotificationsService.oNotificationsV2Promise = Promise.resolve(this.oNotificationsV2Service);

            sandbox.stub(this.oNotificationsV2Service, "fireInitialRequest").resolves();

            this.oReturnedWebSocket = {
                attachMessage: function (oMessage, callback) {
                    //fGivenAttachMessageCallback = callback;
                },
                attachClose: sandbox.stub(),
                attachOpen: sandbox.stub(),
                attachError: sandbox.stub(),
                close: sandbox.stub()
            };

            sandbox.stub(this.oNotificationsService, "_getWebSocketObjectObject").returns(this.oReturnedWebSocket);
            sandbox.stub(this.oNotificationsV2Service, "_getWebSocketObjectObject").returns(this.oReturnedWebSocket);


        },
        afterEach: function () {
            // Clean up event subscriptions, as Notifications.destroy() is not called reliably after each test
            EventBus.getInstance().destroy();
            this.oNotificationsService.destroy();
            this.oNotificationsV2Service.destroy();
            sandbox.restore();
        }
    });

    var oBasicNotificationsResult = {
        __count: "4",
        results: [
            { id: "FirstNotification", isRead: false, CreatedAt: "1457892950133" },
            { id: "SecondNotification", isRead: false, CreatedAt: "1457892950123" },
            { id: "ThirdNotification", isRead: false, CreatedAt: "1457892950103" },
            { id: "FourthNotification", isRead: false, CreatedAt: "1457892950100" }
        ]
    };
    var oNotificationsResult = {
        value: [
            { id: "FirstNotification", isRead: false, CreatedAt: "1457892950133" },
            { id: "SecondNotification", isRead: false, CreatedAt: "1457892950123" },
            { id: "ThirdNotification", isRead: false, CreatedAt: "1457892950103" },
            { id: "FourthNotification", isRead: false, CreatedAt: "1457892950100" }
        ]
    };

    QUnit.test("Is enabled if enable flag=true and a valid serviceUrl is provided", function (assert) {
        assert.strictEqual(this.oNotificationsService.isEnabled(), true, "isEnabled configuration flag is read correctly");
    });

    QUnit.test("Is disabled if enable flag=false and a valid serviceUrl is provided", function (assert) {
        this.oNotificationsServiceConfig.config.enabled = false;

        assert.strictEqual(this.oNotificationsService.isEnabled(), false, "isEnabled configuration flag is read correctly");
    });

    QUnit.test("Is disabled if enable flag=true but serviceUrl is an empty string", function (assert) {
        this.oNotificationsServiceConfig.config.serviceUrl = "";

        assert.strictEqual(this.oNotificationsService.isEnabled(), false, "isEnabled returns false when serviceUrl is in the service configuration is an empty string");
    });

    QUnit.test("Is disabled if enable flag=true but no serviceUrl is provided", function (assert) {
        delete this.oNotificationsServiceConfig.config.serviceUrl;

        assert.strictEqual(this.oNotificationsService.isEnabled(), false, "isEnabled returns false when when no serviceUrl was found in the service configuration");
    });

    QUnit.test("Intent based consumption - read data from service configuration", async function (assert) {
        this.oNotificationsServiceConfig.config.intentBasedConsumption = true;
        this.oNotificationsServiceConfig.config.consumedIntents = [
            { intent: "object1-action1" },
            { intent: "object1-action2" },
            { intent: "object2-action1" }
        ];

        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.spy(this.oNotificationsService, "_performFirstRead");

        this.oNotificationsService.init();
        await Promise.resolve();

        assert.strictEqual(this.oNotificationsService._isIntentBasedConsumption(), true, "Intent based consumption configuration flag read");
        assert.strictEqual(this.oNotificationsService._getConsumedIntents(),
            "&NavigationIntent%20eq%20%27object1-action1%27NavigationIntent%20eq%20%27object1-action2%27NavigationIntent%20eq%20%27object2-action1%27", "Correct intents string");
    });

    QUnit.test("Packaged App use-case - read intent data from PackagedApp configuration", async function (assert) {
        var oPush = ObjectPath.create("sap.Push");
        oPush.initPush = sandbox.stub();
        window.fiori_client_appConfig = {
            prepackaged: true,
            applications: [
                { id: "nw.epm.refapps.shop", intent: "EPMProduct-shop" },
                { id: "nw.epm.refapps.products.manage", intent: "EPMProduct-manage" }
            ]
        };

        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.spy(this.oNotificationsService, "_performFirstRead");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization").returns();
        sandbox.stub(this.oNotificationsService, "_setNativeIconBadgeWithDelay");

        this.oNotificationsService.init();
        await Promise.resolve();

        assert.strictEqual(this.oNotificationsService._isIntentBasedConsumption(), true, "Intent based consumption configuration flag read");
        assert.strictEqual(this.oNotificationsService._getConsumedIntents(), "&NavigationIntent%20eq%20%27EPMProduct-shop%27NavigationIntent%20eq%20%27EPMProduct-manage%27", "Correct intents string");

        delete window.fiori_client_appConfig;
    });

    QUnit.test("Packaged App use-case - read intent data from PackagedApp configuration and override service configuration data", async function (assert) {
        this.oNotificationsServiceConfig.config.intentBasedConsumption = true;
        this.oNotificationsServiceConfig.config.consumedIntents = [
            { intent: "object1-action1" },
            { intent: "object1-action2" },
            { intent: "object2-action1" }
        ];

        var oPush = ObjectPath.create("sap.Push");
        oPush.initPush = sandbox.stub();
        window.fiori_client_appConfig = {
            prepackaged: true,
            applications: [
                { id: "nw.epm.refapps.shop", intent: "EPMProduct-shop" },
                { id: "nw.epm.refapps.products.manage", intent: "EPMProduct-manage" }
            ]
        };

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_readSettingsFromServer");
        sandbox.stub(this.oNotificationsService, "_setNativeIconBadgeWithDelay");
        sandbox.spy(this.oNotificationsService, "_performFirstRead");

        this.oNotificationsService.init();
        await Promise.resolve();

        assert.strictEqual(this.oNotificationsService._isIntentBasedConsumption(), true, "Intent based consumption configuration flag read");
        assert.strictEqual(this.oNotificationsService._getConsumedIntents(), "&NavigationIntent%20eq%20%27EPMProduct-shop%27NavigationIntent%20eq%20%27EPMProduct-manage%27", "Correct intents string");

        delete window.fiori_client_appConfig;
    });

    /**
     * Packaged App use-case and intent based consumption when there are no  intents
     */
    QUnit.test("Packaged App use-case and intent based consumption when there are no intents", function (assert) {
        this.oNotificationsServiceConfig.config.intentBasedConsumption = true;
        this.oNotificationsServiceConfig.config.consumedIntents = [];

        var oPush = ObjectPath.create("sap.Push");
        oPush.initPush = sandbox.stub();
        window.fiori_client_appConfig = {
            prepackaged: true
        };

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization").returns();
        this.oNotificationsService._readSettingsFromServer = sandbox.spy();
        sandbox.spy(this.oNotificationsService, "_performFirstRead");
        this.oNotificationsService._setNativeIconBadgeWithDelay = sandbox.spy();

        this.oNotificationsService.init();

        assert.strictEqual(this.oNotificationsService._isIntentBasedConsumption(), false, "Flag isIntentBasedConsumption is false when no intents are provided");
        assert.strictEqual(this.oNotificationsService._getConsumedIntents().length, 0, "No intents read");

        delete window.fiori_client_appConfig;
    });

    QUnit.test("Identify packaged app mode", function (assert) {
        window.fiori_client_appConfig = {
            prepackaged: true
        };

        assert.strictEqual(this.oNotificationsService._isPackagedMode(), true, "_isPackagedApp returns true when window.fiori_client_appConfig.prepackaged is defined");

        delete window.fiori_client_appConfig;
    });

    QUnit.test("Identify Fiori Client mode", function (assert) {
        window.sap.FioriClient = {};

        assert.strictEqual(this.oNotificationsService._isFioriClientMode(), true, "_isFioriClientMode returns true when sap.push is defined");

        delete window.sap.FioriClient;
    });

    QUnit.test("Callback functions called on update", async function (assert) {
        var oUnseenCount = {
            data: { GetBadgeNumber: { Number: 2 } }
        };
        var oNotificationsCallback1 = sandbox.stub();
        var oNotificationsCallback2 = sandbox.stub();
        var oNotificationsCallback3 = sandbox.stub();
        var oNotificationsCountCallback1 = sandbox.stub();
        var oNotificationsCountCallback2 = sandbox.stub();
        var oNotificationsCountCallback3 = sandbox.stub();

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        sandbox.stub(this.oNotificationsV2Service, "readSettings");
        sandbox.stub(this.oNotificationsV2Service, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsV2Service, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsV2Service, "_establishWebSocketConnection").callsFake(function () {
            this.oNotificationsV2Service._activatePollingAfterInterval();
        }.bind(this));

        sandbox.stub(this.oNotificationsV2Service, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsV2Service, "_updateCSRF");
        sandbox.stub(this.oNotificationsV2Service, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsV2Service, "_getDataServiceVersion").returns(true);

        // Register notifications callback functions
        this.oNotificationsService.registerNotificationsUpdateCallback(oNotificationsCallback1);
        this.oNotificationsService.registerNotificationsUpdateCallback(oNotificationsCallback2);
        this.oNotificationsService.registerNotificationsUpdateCallback(oNotificationsCallback3);

        // Register notifications count callback functions
        this.oNotificationsService.registerNotificationCountUpdateCallback(oNotificationsCountCallback1);
        this.oNotificationsService.registerNotificationCountUpdateCallback(oNotificationsCountCallback2);
        this.oNotificationsService.registerNotificationCountUpdateCallback(oNotificationsCountCallback3);

        sandbox.stub(this.oNotificationsV2Service, "_activatePollingAfterInterval").callsFake(function () {
            this.oNotificationsService._readNotificationsData(true);
        }.bind(this));

        this.oNotificationsService.init();

        await this.oNotificationsService._readNotificationsData();
        await Promise.resolve();
        assert.strictEqual(oNotificationsCallback1.callCount, 2, "1st notifications callback called");
        assert.strictEqual(oNotificationsCallback2.callCount, 2, "2nd notifications callback called");
        assert.strictEqual(oNotificationsCallback3.callCount, 2, "3rd notifications callback called");

        assert.strictEqual(oNotificationsCountCallback1.callCount, 2, "1st notifications count callback called");
        assert.strictEqual(oNotificationsCountCallback2.callCount, 2, "2nd notifications count callback called");
        assert.strictEqual(oNotificationsCountCallback3.callCount, 2, "3rd notifications count callback called");
    });

    QUnit.test("Disable calling callback functions after notifications data read", function (assert) {
        var oUnseenCount = {
            data: { GetBadgeNumber: { Number: 2 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        var oUpdateNotificationsConsumersStub = sandbox.stub(this.oNotificationsService, "_updateNotificationsConsumers");
        var oUpdateNotificationsCountConsumersStub = sandbox.stub(this.oNotificationsService, "_updateNotificationsCountConsumers");

        // Call _readNotificationsData with parameter false in oder to disable calling the registered callback functions
        this.oNotificationsService._readNotificationsData(false);
        assert.strictEqual(oUpdateNotificationsConsumersStub.callCount, 0,
            "Service private function _updateNotificationsConsumers was not called because the value 'false' was passed to _readNotificationsData");
        assert.strictEqual(oUpdateNotificationsCountConsumersStub.callCount, 0,
            "Service private function _updateNotificationsCountConsumers was not called because the value 'false' was passed to _readNotificationsData");
    });

    /**
     * getNotifications full flow, including:
     * - Service initialization
     * - Costumer registration oc callback function
     * - First readNotification call
     * - Verify that the registered callback was called with the correct notifications data
     */
    QUnit.test("API: getNotifications integration test", function (assert) {
        var done = assert.async();
        var oUnseenCount = {
            data: { GetBadgeNumber: { Number: 4 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        this.oNotificationsService.registerNotificationsUpdateCallback(function () {
            var oNotificationsPromise = this.oNotificationsService.getNotifications();

            oNotificationsPromise
                .done(function (oNotifications) {
                    assert.strictEqual(oNotifications.length, 4, "Function getNotifications returns the expected number of notifications");
                    assert.strictEqual(oNotifications[0].id, "FirstNotification", "First notification is correct");
                    assert.strictEqual(oNotifications[1].id, "SecondNotification", "Second notification is correct");
                    assert.strictEqual(oNotifications[2].id, "ThirdNotification", "Third notification is correct");
                    assert.strictEqual(oNotifications[3].id, "FourthNotification", "Fourth notification is correct");

                    done();
                })
                .fail(function (error) {
                    assert.notOk(true, "The promise should have been resolved.");
                    done();
                    throw error;
                });
        }.bind(this));

        sandbox.stub(this.oNotificationsV2Service, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsV2Service, "readSettings");
        sandbox.stub(this.oNotificationsV2Service, "_updateCSRF");
        sandbox.stub(this.oNotificationsV2Service, "_fioriClientStep");
        sandbox.stub(this.oNotificationsV2Service, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsV2Service, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsV2Service, "_getDataServiceVersion").returns(true);

        this.oNotificationsService.init();
    });

    QUnit.test("Intent based consumption full flow - verify URL correctness", async function (assert) {
        sandbox.stub(OData, "read");
        sandbox.stub(OData, "request");

        this.oNotificationsServiceConfig.config.intentBasedConsumption = true;
        this.oNotificationsServiceConfig.config.consumedIntents = [
            { intent: "a-b" },
            { intent: "a-c" },
            { intent: "d-a" }
        ];

        sandbox.stub(this.oNotificationsV2Service, "_userSettingInitialization").returns();
        sandbox.stub(this.oNotificationsV2Service, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsV2Service, "readSettings");

        this.oNotificationsService.init();
        await Promise.resolve();
        await Promise.resolve();

        assert.equal(OData.read.callCount, 2, "Two call to OData.read");
        assert.equal(OData.request.callCount, 1, "One call to OData.request");
        assert.strictEqual(OData.read.args[1][0].requestUri, "NOTIFICATIONS_SRV/GetBadgeCountByIntent(a-b,a-c,d-a)", "The 1st call to OData.read for badge number includes the intents");
        assert.strictEqual(OData.read.args[0][0].requestUri, "NOTIFICATIONS_SRV/Notifications/$count", "The 2nd call to OData.read for notification count ");
        assert.strictEqual(OData.request.args[0][0].requestUri, "NOTIFICATIONS_SRV/Notifications" +
            "?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt%20desc&$filter=IsGroupHeader%20eq%20false&" +
            "$skip=0&$top=10&intents%20eq%20&NavigationIntent%2520eq%2520%2527a-b%2527NavigationIntent%2520eq%2520%2527a-c%2527NavigationIntent%2520eq%2520%2527d-a%2527",
            "The 2nd call to OData.read for badge number included the intents");
    });

    QUnit.test("API: getUnseenNotificationsCount full flow", function (assert) {
        var done = assert.async();

        var oUnseenCount = {
            data: { GetBadgeNumber: { Number: 2 } }
        };

        window["sap-ushell-config"] = {
            services: {
                Notifications: {
                    config: {
                        enabled: false,
                        serviceUrl: "NOTIFICATIONS_SRV"
                    }
                }
            }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "isEnabled").returns(true);

        // Stub objects for reaching the requires mode:

        // Indicating that it is not packagedAdd mode
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        // Indicating that it is FioriClient mode
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        // In order to avoid waiting with setTimeout to the end of the required FioriClient delay
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        // For avoiding WebSocket initialization
        sandbox.stub(this.oNotificationsService, "_establishWebSocketConnection");
        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);

        this.oNotificationsService.registerNotificationCountUpdateCallback(function () {
            this.oNotificationsService.getUnseenNotificationsCount()
                .done(function (iCount) {
                    assert.strictEqual(parseInt(iCount, 10), 2, "Function getCount returns the expected number of unseen notifications");
                    done();
                })
                .fail(function (error) {
                    assert.notOk(true, "The promise should have been resolved.");
                    done();
                    throw error;
                });
        }.bind(this));

        sandbox.stub(this.oNotificationsService, "getNotificationsBufferBySortingType").returns(new jQuery.Deferred().resolve({}));
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");

        this.oNotificationsService.init();
    });

    QUnit.test("Verify mark as read", function (assert) {
        var done = assert.async();
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success();
        });

        this.oNotificationsService.markRead("notificationId")
            .done(function () {
                assert.strictEqual(OData.request.args[0][0].method, "POST", "OData.request was called with method POST");
                assert.strictEqual(OData.request.args[0][0].data.NotificationId, "notificationId", "NotificationId should be 'notificationId'");
                assert.strictEqual(OData.request.args[0][0].requestUri.endsWith("/MarkRead"), true, "markRead: OData.request was called with function /MarkRead");

                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Verify dismiss Notification", async function (assert) {
        sandbox.stub(OData, "request");

        this.oNotificationsService.dismissNotification("notificationId"); // due to OData stab, this promise never resolves
        await Promise.resolve();
        await Promise.resolve();

        assert.strictEqual(OData.request.args[0][0].method, "POST", "OData.request was called with method POST");
        assert.strictEqual(OData.request.args[0][0].data.NotificationId, "notificationId", "NotificationId should be 'notificationId'");
        assert.strictEqual(OData.request.args[0][0].requestUri.endsWith("/Dismiss"), true, "Dismiss: OData.request was called with function /Dismiss");
    });

    QUnit.test("Read UserSettings from server", function (assert) {
        var done = assert.async();
        var oDataRequestStub = sandbox.stub(OData, "request").callsFake(function (aArgs, fSuccess) {
            fSuccess({ results: {} });
        });

        this.oNotificationsService.readSettings()
            .done(function () {
                assert.strictEqual(oDataRequestStub.calledOnce, true, "OData.request called once");
                assert.deepEqual(oDataRequestStub.firstCall.args[0].headers, {
                    "Accept-Language": Localization.getLanguageTag().toString(),
                    "X-CSRF-Token": "fetch"
                }, "OData.request called with the expected headers");
                assert.strictEqual(oDataRequestStub.args[0][0].requestUri.endsWith("/NotificationTypePersonalizationSet"), true, "OData.request called with getSettings URL");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Read UserSettings from server - failure", function (assert) {
        var done = assert.async();
        var oDataRequestStub = sandbox.stub(OData, "request").callsFake(function (aArgs, fSuccess, fFailure) {
            fFailure({ response: { statusCode: 404 } });
        });

        this.oNotificationsService.readSettings()
            .done(function () {
                assert.ok(false, "The promise should have been rejected.");
                done();
            })
            .fail(function () {
                assert.strictEqual(oDataRequestStub.callCount, 1, "OData.request called once");
                done();
            });
    });

    QUnit.test("Read UserSettings flags from personalization service - empty result", function (assert) {
        var done = assert.async();
        sandbox.stub(this.oNotificationsV2Service, "_getUserSettingsPersonalizer").resolves({
            getPersData: function () {
                return Promise.resolve();
            },
            setPersData: function () { }
        });

        this.oNotificationsV2Service._readUserSettingsFlagsFromPersonalization();

        this.oNotificationsService.getUserSettingsFlags()
            .done(function (oFlags) {
                assert.strictEqual(oFlags.highPriorityBannerEnabled, true, "highPriorityBannerEnabled flag has the default value (true) after Personalizer returned empty object");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Read UserSettings flags from personalization service", function (assert) {
        var done = assert.async();

        sandbox.stub(this.oNotificationsV2Service, "_getUserSettingsPersonalizer").resolves({
            getPersData: function () {
                return new jQuery.Deferred().resolve({
                    highPriorityBannerEnabled: false
                }).promise();
            }
        });

        this.oNotificationsV2Service._readUserSettingsFlagsFromPersonalization();

        this.oNotificationsService.getUserSettingsFlags()
            .done(function (oFlags) {
                assert.strictEqual(oFlags.highPriorityBannerEnabled, false, "highPriorityBannerEnabled flag has the correct value (false) returned from Personalization service");

                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("Read UserSettings flags from personalization service - failed", function (assert) {
        var done = assert.async();
        sandbox.stub(this.oNotificationsV2Service, "_getUserSettingsPersonalizer").resolves({
            getPersData: function () {
                return Promise.reject();
            },
            setPersData: function () { }
        });

        this.oNotificationsV2Service._readUserSettingsFlagsFromPersonalization();

        this.oNotificationsService.getUserSettingsFlags()
            .done(function (oFlags) {
                assert.strictEqual(oFlags.highPriorityBannerEnabled, true, "highPriorityBannerEnabled flag has the default value (true) after Personalizer returned an error");
                done();
            })
            .fail(function (error) {
                assert.notOk(true, "The promise should have been resolved.");
                done();
                throw error;
            });
    });

    QUnit.test("The event 'launchpad'/'setConnectionToServer' gets subscribed in the init method", async function (assert) {
        // Arrange
        var oEventBusSubscribeSpy = sandbox.spy(EventBus.getInstance(), "subscribe");

        // Act
        this.oNotificationsService.init();
        await Promise.resolve();

        // Assert
        assert.strictEqual(oEventBusSubscribeSpy.withArgs("launchpad", "setConnectionToServer").callCount, 1, "The event was subscribed correctly.");
    });

    QUnit.test("The event subscription for 'launchpad'/'setConnectionToServer' gets deleted in the destroy method", async function (assert) {
        // Arrange
        var oEventBusUnsubscribeSpy = sandbox.spy(EventBus.getInstance(), "unsubscribe");
        this.oNotificationsService.init();
        await Promise.resolve();

        // Act
        this.oNotificationsService.destroy();

        // Assert
        assert.strictEqual(oEventBusUnsubscribeSpy.withArgs("launchpad", "setConnectionToServer").callCount, 1, "The event was unsubscribed correctly.");
    });
});

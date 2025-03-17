// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Notifications
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/base/util/ObjectPath",
    "sap/ui/core/EventBus",
    "sap/ui/thirdparty/datajs",
    "sap/ushell/utils",
    "sap/ushell/services/NotificationsV2",
    "sap/ushell/services/PersonalizationV2",
    "sap/ushell/Container"
], function (
    Localization,
    ObjectPath,
    EventBus,
    OData,
    utils,
    Notifications,
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

    const sandbox = sinon.createSandbox();

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

            this.oNotificationsService = new Notifications(undefined, undefined, this.oNotificationsServiceConfig);

            sandbox.stub(this.oNotificationsService, "fireInitialRequest").resolves();

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
        },
        afterEach: function () {
            // Clean up event subscriptions, as Notifications.destroy() is not called reliably after each test
            EventBus.getInstance().destroy();
            this.oNotificationsService.destroy();
            sandbox.restore();
        }
    });

    const oModesEnum = {
        PACKAGED_APP: 0,
        FIORI_CLIENT: 1,
        WEB_SOCKET: 2,
        POLLING: 3
    };
    const oBasicNotificationsResult = {
        __count: "4",
        results: [
            { id: "FirstNotification", isRead: false, CreatedAt: "1457892950133" },
            { id: "SecondNotification", isRead: false, CreatedAt: "1457892950123" },
            { id: "ThirdNotification", isRead: false, CreatedAt: "1457892950103" },
            { id: "FourthNotification", isRead: false, CreatedAt: "1457892950100" }
        ]
    };
    const oNotificationsResult = {
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

    QUnit.test("_parseJSON returns false for wrong formatted response", function (assert) {
        assert.notOk(this.oNotificationsService._parseJSON("otto"), "_parseJSON returned 'false' correctly.");
    });

    QUnit.test("_parseJSON returns deactivates polling.", function (assert) {
        var oStub = sandbox.stub(this.oNotificationsService, "_deactivatePolling");
        assert.notOk(this.oNotificationsService._parseJSON("otto"), "_parseJSON returned 'false' correctly.");
        assert.ok(oStub.calledOnce);
    });

    QUnit.test("_parseJSON returns parsed object", function (assert) {
        var sJSON = '{"otto":"karl"}';
        var oResult = this.oNotificationsService._parseJSON(sJSON);
        assert.deepEqual(oResult, {
            otto: "karl"
        }, "_parseJSON returned 'object' correctly.");
    });

    QUnit.test("Intent based consumption - read data from service configuration", function (assert) {
        this.oNotificationsServiceConfig.config.intentBasedConsumption = true;
        this.oNotificationsServiceConfig.config.consumedIntents = [
            { intent: "object1-action1" },
            { intent: "object1-action2" },
            { intent: "object2-action1" }
        ];

        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.spy(this.oNotificationsService, "_performFirstRead");
        const oUserSettingInitializationStub = sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves();

        this.oNotificationsService.init();

        assert.strictEqual(this.oNotificationsService._isIntentBasedConsumption(), true, "Intent based consumption configuration flag read");
        assert.strictEqual(this.oNotificationsService._getConsumedIntents(),
            "&NavigationIntent%20eq%20%27object1-action1%27NavigationIntent%20eq%20%27object1-action2%27NavigationIntent%20eq%20%27object2-action1%27", "Correct intents string");
        assert.strictEqual(oUserSettingInitializationStub.calledOnce, true, "_readUserSettingsFlags called");
    });

    QUnit.test("Packaged App use-case - read intent data from PackagedApp configuration", function (assert) {
        const oPush = ObjectPath.create("sap.Push");
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
        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves();
        this.oNotificationsService.init();

        assert.strictEqual(this.oNotificationsService._isIntentBasedConsumption(), true, "Intent based consumption configuration flag read");
        assert.strictEqual(this.oNotificationsService._getConsumedIntents(), "&NavigationIntent%20eq%20%27EPMProduct-shop%27NavigationIntent%20eq%20%27EPMProduct-manage%27", "Correct intents string");

        delete window.fiori_client_appConfig;
    });

    QUnit.test("saveSettingsEntry:", async function (assert) {
        // Arrange
        const oRequestStub = sandbox.stub(OData, "request");
        sandbox.stub(this.oNotificationsService, "_getRequestURI").returns("uri");
        const oEntry = {
            NotificationTypeId: "N12345",
            NotificationTypeDesc: "typeDesc",
            PriorityDefault: "",
            DoNotDeliver: false,
            DoNotDeliverMob: false,
            DoNotDeliverEmail: false,
            IsEmailEnabled: true,
            IsEmailIdMaintained: true
        };
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        // Act
        this.oNotificationsService.saveSettingsEntry(oEntry);

        // Assert
        const sExpectedRequestUri = "uri(NotificationTypeId=" + oEntry.NotificationTypeId + ")";
        const oExpectedData = oEntry;
        const oExpectedHeaders = {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            DataServiceVersion: undefined,
            "X-CSRF-Token": "fetch"
        };
        oExpectedData["@odata.context"] = "$metadata#NotificationTypePersonalizationSet/$entity";

        await Promise.resolve();
        assert.strictEqual(oRequestStub.callCount, 1, "request was made");
        assert.strictEqual(oRequestStub.args[0][0].requestUri, sExpectedRequestUri, "request parameter has the correct requestUri property");
        assert.strictEqual(oRequestStub.args[0][0].method, "PUT", "request parameter has the correct method property");
        assert.deepEqual(oRequestStub.args[0][0].data, oExpectedData, "request parameter has the correct data property");
        assert.deepEqual(oRequestStub.args[0][0].headers, oExpectedHeaders, "request parameter has the correct headers property");
    });

    QUnit.test("Packaged App use-case - read intent data from PackagedApp configuration and override service configuration data", function (assert) {
        this.oNotificationsServiceConfig.config.intentBasedConsumption = true;
        this.oNotificationsServiceConfig.config.consumedIntents = [
            { intent: "object1-action1" },
            { intent: "object1-action2" },
            { intent: "object2-action1" }
        ];

        const oPush = ObjectPath.create("sap.Push");
        oPush.initPush = sandbox.stub();
        window.fiori_client_appConfig = {
            prepackaged: true,
            applications: [
                { id: "nw.epm.refapps.shop", intent: "EPMProduct-shop" },
                { id: "nw.epm.refapps.products.manage", intent: "EPMProduct-manage" }
            ]
        };

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.stub(this.oNotificationsService, "_setNativeIconBadgeWithDelay");
        sandbox.spy(this.oNotificationsService, "_performFirstRead");

        this.oNotificationsService.init();

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

        const oPush = ObjectPath.create("sap.Push");
        oPush.initPush = sandbox.stub();
        window.fiori_client_appConfig = {
            prepackaged: true
        };

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization").returns();
        this.oNotificationsService.readSettings = sandbox.spy();
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

    QUnit.test("Reach Packaged App step", function (assert) {
        window.fiori_client_appConfig = {
            applications: []
        };

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(true);
        sandbox.stub(this.oNotificationsService, "_getIntentsFromConfiguration").returns([]);
        sandbox.stub(this.oNotificationsService, "_registerForPush");
        sandbox.stub(this.oNotificationsService, "_setNativeIconBadgeWithDelay");
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        sandbox.stub(this.oNotificationsService, "_performFirstRead");

        this.oNotificationsService.init();

        assert.strictEqual(this.oNotificationsService._getMode(), oModesEnum.PACKAGED_APP, "_getMode returns oModesEnum.PACKAGED_APP");
        assert.strictEqual(this.oNotificationsService._registerForPush.callCount, 1, "_registerForPush called once");
        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 1, "_readNotificationsData called once");
        assert.strictEqual(this.oNotificationsService._setNativeIconBadgeWithDelay.callCount, 1, "_setNativeIconBadgeWithDelay called once");
        assert.strictEqual(this.oNotificationsService._performFirstRead.callCount, 0, "_performFirstRead not called");

        delete window.fiori_client_appConfig;
    });

    QUnit.test("Reach Fiori Client step", function (assert) {
        sandbox.stub(OData, "read").callsArgWith(1, { results: oBasicNotificationsResult.results }, {
            headers: {
                "x-csrf-token": {},
                DataServiceVersion: {}
            },
            data: { GetBadgeNumber: { Number: 4 } }
        });

        sandbox.stub(OData, "request").callsArgWith(1, oNotificationsResult);

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_getIntentsFromConfiguration").returns([]);
        sandbox.stub(this.oNotificationsService, "_updateCSRF").returns([]);
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(true);
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_webSocketStep");

        this.oNotificationsService.init();
        return this.oNotificationsService._readNotificationsData().then(function () {
            assert.strictEqual(this.oNotificationsService._getMode(), oModesEnum.FIORI_CLIENT, "_getMode returns oModesEnum.FIORI_CLIENT");
            assert.strictEqual(this.oNotificationsService._webSocketStep.callCount, 0, "Next step (WebSocket) not reached");
        }.bind(this));
    });

    QUnit.test("Reach WebSocket step", async function (assert) {
        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success({ results: oBasicNotificationsResult.results }, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: { GetBadgeNumber: { Number: 4 } }
            });
        });

        const oUserSettingInitializationStub = sandbox.stub(this.oNotificationsService, "_userSettingInitialization");

        sandbox.stub(this.oNotificationsService, "readSettings").resolves();
        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves();
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_readUserSettingsFlagsFromPersonalization");
        sandbox.stub(this.oNotificationsService, "_webSocketRecoveryStep");
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");
        sandbox.stub(this.oNotificationsService, "_establishWebSocketConnection");

        this.oNotificationsService.init();
        await Promise.resolve(); // let async stubs to finish first

        assert.strictEqual(this.oNotificationsService._getMode(), oModesEnum.WEB_SOCKET, "_getMode returns oModesEnum.WEB_SOCKET");
        assert.strictEqual(this.oNotificationsService._establishWebSocketConnection.callCount, 1, "_establishWebSocketConnection called once");
        assert.strictEqual(this.oNotificationsService._webSocketRecoveryStep.callCount, 0, "Next step (_webSocketRecoveryStep) not reached");
        assert.strictEqual(this.oNotificationsService._activatePollingAfterInterval.callCount, 0, "Next step (_activatePollingAfterInterval) not reached");
        assert.strictEqual(oUserSettingInitializationStub.callCount, 1, "oUserSettingInitializationStub called");
    });

    QUnit.test("WebSocket activity check , when active", async function (assert) {
        let fGivenOnOpenCallback;

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success({ results: oBasicNotificationsResult.results }, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: { GetBadgeNumber: { Number: 4 } }
            });
        });

        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        this.oReturnedWebSocket.attachOpen = function (oMessage, callback) {
            fGivenOnOpenCallback = callback;
        };
        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves();
        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);

        const oCheckWebSocketActivityStub = sandbox.stub(this.oNotificationsService, "_checkWebSocketActivity").resolves();
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");
        const oWebSocketRecoveryStepSpy = sandbox.spy(this.oNotificationsService, "_webSocketRecoveryStep");

        this.oNotificationsService.init();
        await Promise.resolve();

        // Call WebSocket onOpen in order to verify that validity check occurs
        fGivenOnOpenCallback();

        assert.strictEqual(oCheckWebSocketActivityStub.callCount, 1, "_checkWebSocketActivity called once");
        assert.strictEqual(oWebSocketRecoveryStepSpy.callCount, 0, "oWebSocketRecovery step NOT reached");
        assert.strictEqual(this.oNotificationsService._activatePollingAfterInterval.callCount, 0, "_activatePollingAfterInterval not called");
    });

    QUnit.test("WebSocket activity check , when not active", async function (assert) {
        let fGivenOnOpenCallback;

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success({ results: oBasicNotificationsResult.results }, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: { GetBadgeNumber: { Number: 4 } }
            });
        });

        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        this.oReturnedWebSocket.attachOpen = function (oMessage, callback) {
            fGivenOnOpenCallback = callback;
        };
        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves();
        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");
        const oCheckWebSocketActivityStub = sandbox.stub(this.oNotificationsService, "_checkWebSocketActivity").resolves(false);
        const oWebSocketRecoveryStepSpy = sandbox.spy(this.oNotificationsService, "_webSocketRecoveryStep");

        this.oNotificationsService.init();
        await Promise.resolve();

        // Call WebSocket onOpen in order to verify that validity check occurs
        fGivenOnOpenCallback();
        await Promise.resolve();

        assert.strictEqual(oCheckWebSocketActivityStub.callCount, 1, "_checkWebSocketActivity called once");
        assert.strictEqual(oWebSocketRecoveryStepSpy.callCount, 0, "oWebSocketRecovery step NOT reached");
        assert.strictEqual(this.oReturnedWebSocket.close.callCount, 1, "WebSocket close function called");
        assert.strictEqual(this.oNotificationsService._activatePollingAfterInterval.callCount, 1, "_activatePollingAfterInterval called");
    });

    QUnit.test("Reach WebSocket recovery mode", async function (assert) {
        let fGivenOnCloseCallback;

        sandbox.useFakeTimers();

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success({ results: oBasicNotificationsResult.results }, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: { GetBadgeNumber: { Number: 4 } }
            });
        });
        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        this.oReturnedWebSocket.attachClose = function (oMessage, callback) {
            fGivenOnCloseCallback = callback;
        };
        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves();
        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");
        const oWebSocketRecoveryStepSpy = sandbox.spy(this.oNotificationsService, "_webSocketRecoveryStep");

        this.oNotificationsService.init();
        await Promise.resolve();

        // Call WebSocket onError in order to invoke WebSocketRecovery
        fGivenOnCloseCallback({
            mParameters: {
                code: "",
                reason: ""
            }
        });

        assert.strictEqual(oWebSocketRecoveryStepSpy.callCount, 1, "oWebSocketRecoveryStepSpy called once");
        assert.strictEqual(this.oNotificationsService._activatePollingAfterInterval.callCount, 0, "_activatePollingAfterInterval not called");
    });

    QUnit.test("Reach Polling step", async function (assert) {
        let fGivenOnCloseCallback;
        const oOnErrorEvent = {
            mParameters: {
                code: "",
                reason: ""
            }
        };
        sandbox.useFakeTimers();

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success({ results: oBasicNotificationsResult.results }, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: { GetBadgeNumber: { Number: 4 } }
            });
        });

        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        this.oReturnedWebSocket.attachClose = function (oMessage, callback) {
            fGivenOnCloseCallback = callback;
        };
        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves();
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");

        this.oNotificationsService.init();
        await Promise.resolve();

        // Call WebSocket onError in order to invoke WebSocketRecovery for the first time
        fGivenOnCloseCallback(oOnErrorEvent);

        // The following happens as a result of the call to fGivenOnCloseCallback (previous command):
        // - The function _webSocketRecoveryStep of notifications service is called
        // - setTimeout is called (from _webSocketRecoveryStep) with a period of 5000 second

        // Call WebSocket onError in order to invoke WebSocketRecovery for the second time
        fGivenOnCloseCallback(oOnErrorEvent);
        await Promise.resolve();

        assert.strictEqual(this.oNotificationsService._activatePollingAfterInterval.callCount, 1, "_activatePollingAfterInterval called once");
    });

    QUnit.test("Get request URLs including intent based consumption", function (assert) {
        const oIsIntentBasedConsumptionStub = sandbox.stub(this.oNotificationsService, "_isIntentBasedConsumption").returns(true);
        sandbox.stub(this.oNotificationsService, "_getConsumedIntents").returns(["a-b", "a-c", "c-b"]);

        assert.strictEqual(this.oNotificationsService._getRequestURI(0),
            "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false&intents%20eq%20a-b,a-c,c-b",
            "Intent based consumption - correct getNotifications URL");
        assert.strictEqual(this.oNotificationsService._getRequestURI(1),
            "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=intents%20eq%20a-b,a-c,c-b", "Intent based consumption - correct getNotificationsByType URL");
        assert.strictEqual(this.oNotificationsService._getRequestURI(2), "NOTIFICATIONS_SRV/GetBadgeCountByIntent(a-b,a-c,c-b)", "Intent based consumption - correct GetBadgeNumber URL");
        assert.strictEqual(this.oNotificationsService._getRequestURI(8), "NOTIFICATIONS_SRV/Notifications/$count", "count url");

        oIsIntentBasedConsumptionStub.returns(false);

        assert.strictEqual(this.oNotificationsService._getRequestURI(0),
            "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false", "Not intent based consumption - correct getNotifications URL");
        assert.strictEqual(this.oNotificationsService._getRequestURI(1),
            "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams", "Not intent based consumption - correct getNotificationsByType URL");
        assert.strictEqual(this.oNotificationsService._getRequestURI(2), "NOTIFICATIONS_SRV/GetBadgeNumber()", "Not intent based consumption - correct GetBadgeNumber URL");
    });

    QUnit.test("Init in PackagedApp mode does not activate polling and registers push handlers", function (assert) {
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_setNativeIconBadgeWithDelay");
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        const oRegisterForPushStub = sandbox.stub(this.oNotificationsService, "_registerForPush");

        this.oNotificationsService.init();

        assert.strictEqual(this.oNotificationsService._getMode(), oModesEnum.PACKAGED_APP, "_getMode returns the correct mode");
        assert.strictEqual(oRegisterForPushStub.callCount, 1, "oRegisterForPush is called only once");
        assert.strictEqual(this.oNotificationsService._activatePollingAfterInterval.callCount, 0, "_activatePollingAfterInterval not called");
        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 1, "_readNotificationsData called once");

        delete window.fiori_client_appConfig;
    });

    /**
     * Service initialization in Fiori client use-case:
     * Verify that polling is not activated, and instead - one read operation is executed (call to _readNotificationsData)
     *  also: verify that the handler _handlePushedNotification is registered for the event deviceready
     */
    QUnit.test("Init in Fiori Client mode", async function (assert) {
        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success({ results: oBasicNotificationsResult.results }, {
                headers: {
                    "x-csrf-token": {},
                    DataServiceVersion: {}
                },
                data: { GetBadgeNumber: { Number: 4 } }
            });
        });

        ObjectPath.create("sap.Push.initPush");
        const oAddEventListenerStub = sandbox.stub(document, "addEventListener");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");

        const fHandler = function () { };
        this.oNotificationsService._getPushedNotificationCallback = fHandler;

        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves();

        // Indicating that it is not packagedAdd mode
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        // Indicating that it is FioriClient mode
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(true);
        // For validating that the next step (after FioriClient step) is not called
        sandbox.stub(this.oNotificationsService, "_webSocketStep");
        // In order to avoid waiting with setTimeout to the end of the required FioriClient delay
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);

        this.oNotificationsService.init();
        await Promise.resolve();

        assert.strictEqual(this.oNotificationsService._getMode(), oModesEnum.FIORI_CLIENT, "_getMode returns oModesEnum.FIORI_CLIENT");
        assert.strictEqual(this.oNotificationsService._webSocketStep.callCount, 0, "Fiori Client mode: _activatePollingAfterInterval not called");
        assert.strictEqual(oAddEventListenerStub.callCount, 1, "document.addEventListener called once");
        assert.strictEqual(oAddEventListenerStub.args[0][0], "deviceready", "Callback registered for event deviceready");

        document.removeEventListener("deviceready", fHandler);

        delete window.sap.Push;
    });

    QUnit.test("WebSocket mode correctly handles ping message", function (assert) {
        let fGivenAttachMessageCallback;

        // Define the custom WebSocket object.
        // It includes an attachMessage function that gets the onMessage callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readNotificationsData is called as a result
        this.oReturnedWebSocket.attachMessage = function (oMessage, callback) {
            fGivenAttachMessageCallback = callback;
        };
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");
        // The call to _readNotificationsData is what we would like to test,
        // as a result of the next call to fGivenAttachMessageCallback
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");

        const oWebSocketPingMessage = {
            getParameter: function (sParamName) {
                if (sParamName === "pcpFields") {
                    return { Command: "Notification" };
                }
            }
        };

        // Start the flow
        this.oNotificationsService._webSocketStep();

        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 0, "Before the onMessage callback: _readNotificationsData not called");

        // Call the message callback in order to verify that it calls _readNotificationsData
        fGivenAttachMessageCallback(oWebSocketPingMessage, {});

        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 1, "After the onMessage callback: _readNotificationsData called from the WebSocket on attachMessage event");
        assert.strictEqual(this.oNotificationsService._getMode(), oModesEnum.WEB_SOCKET, "_getMode returns oModesEnum.WEB_SOCKET");
        assert.strictEqual(this.oNotificationsService._activatePollingAfterInterval.callCount, 0, "_activatePollingAfterInterval not called");
    });

    QUnit.test("Verify getNotificationsBufferBySortingType function - invalid CSRF token failure", function (assert) {
        const oCsrfTokenInvalidStub = sandbox.stub(this.oNotificationsService, "_csrfTokenInvalid").returns(true);
        const oInvalidCsrfTokenRecoveryStub = sandbox.stub(this.oNotificationsService, "_invalidCsrfTokenRecovery").callsFake(function (resolve) {
            resolve();
        });
        sandbox.stub(this.oNotificationsService, "_updateCSRF");
        const oRequestStub = sandbox.stub(OData, "request");

        oRequestStub.onCall(0).callsArgWith(2, {
            response: {
                statusCode: 403,
                headers: { "x-csrf-token": "required" }
            }
        });
        oRequestStub.onCall(1).callsArg(1);

        return this.oNotificationsService.getNotificationsBufferBySortingType("notificationsByDateDescending", 1, 1)
            .then(function () {
                assert.strictEqual(oCsrfTokenInvalidStub.callCount, 1, "Invalid CSRF Token problem - _csrfTokenInvalid called once");
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.callCount, 1, "Invalid CSRF Token problem - _invalidCsrfTokenRecovery called once");
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.args[0][2], this.oNotificationsService.getNotificationsBufferBySortingType,
                    "Invalid CSRF Token problem - the original function passed to invalidCsrfTokenRecovery");
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.args[0][3][0], "notificationsByDateDescending",
                    "Invalid CSRF Token problem - the original call parameters passed to invalidCsrfTokenRecovery");
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.args[0][3][1], 1, "Invalid CSRF Token problem - the original call parameters passed to invalidCsrfTokenRecovery");
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.args[0][3][2], 1, "Invalid CSRF Token problem - the original call parameters passed to invalidCsrfTokenRecovery");
            }.bind(this))
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("Verify executeAction function - success", async function (assert) {
        const done = assert.async();
        sandbox.stub(OData, "request");

        this.oNotificationsService.notificationsSeen();
        const oInvalidCsrfTokenRecoveryStub = sandbox.stub(this.oNotificationsService, "_invalidCsrfTokenRecovery");
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        this.oNotificationsService.executeAction("notificationId", "actionId")
            .then(function () {
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.callCount, 0, "No CSRF Token problem - InvalidCsrfTokenRecoveryStub not called");
            })
            .catch(() => assert.notOk(true, "The promise should have been resolved."))
            .finally(done);

        await Promise.resolve();
        OData.request.args[1][1]("true");
    });

    QUnit.test("Verify executeAction function - general failure", async function (assert) {
        const done = assert.async();

        sandbox.stub(OData, "request");
        this.oNotificationsService.notificationsSeen();
        const oInvalidCsrfTokenRecoveryStub = sandbox.stub(this.oNotificationsService, "_invalidCsrfTokenRecovery");
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        this.oNotificationsService.executeAction("notificationId", "actionId")
            .then(function () {
                assert.ok(false, "The promise should have been rejected.");
            })
            .catch(function () {
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.callCount, 0, "No CSRF Token problem - InvalidCsrfTokenRecoveryStub not called");
            })
            .finally(done);

        await Promise.resolve();
        OData.request.args[1][2]("true");
    });

    QUnit.test("Verify executeAction function - invalid CSRF token failure, step 1", function (assert) {
        const oInvalidCsrfTokenRecoveryStub = sandbox.stub(this.oNotificationsService, "_invalidCsrfTokenRecovery").callsFake(function (resolve) {
            resolve();
        });

        sandbox.stub(OData, "request").callsArgWith(2, {
            response: {
                statusCode: 403,
                headers: { "x-csrf-token": "required" }
            }
        });

        return this.oNotificationsService.executeAction("notificationId", "actionId")
            .then(function () {
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.callCount, 1, "Invalid CSRF Token problem - invalidCsrfTokenRecovery called");
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.args[0][2], this.oNotificationsService.executeAction,
                    "Invalid CSRF Token problem - the original function passed to invalidCsrfTokenRecovery");
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.args[0][3][0], "notificationId", "Invalid CSRF Token problem - the original call parameters passed to invalidCsrfTokenRecovery");
                assert.strictEqual(oInvalidCsrfTokenRecoveryStub.args[0][3][1], "actionId", "Invalid CSRF Token problem - the original call parameters passed to invalidCsrfTokenRecovery");
            }.bind(this))
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("test _invalidCsrfTokenRecovery when CSRF token is invalid and the recovery fails (called function is executeAction)", function (assert) {
        const oExecuteActionSpy = sandbox.spy(this.oNotificationsService, "executeAction");
        const oGetNotificationsBufferBySortingTypeStub = sandbox.stub(this.oNotificationsService, "getNotificationsBufferBySortingType").resolves();

        sandbox.stub(OData, "request").callsFake(function (oRequest, fSuccessFn, fFailureFn) {
            fFailureFn({
                response: {
                    statusCode: 403,
                    headers: { "x-csrf-token": "required" }
                }
            });
        });

        return this.oNotificationsService.executeAction("notificationId", "actionId")
            .then(() => assert.ok(false, "The promise should have been rejected."))
            .catch(() => {
                assert.strictEqual(oGetNotificationsBufferBySortingTypeStub.callCount, 1, "Invalid CSRF Token problem - getNotificationsBufferBySortingType called for obtaining updated token");
                assert.strictEqual(oExecuteActionSpy.callCount, 2, "Invalid CSRF Token problem - executeAction called twice");
            });
    });

    QUnit.test("test _invalidCsrfTokenRecovery when CSRF token is invalid and the recovery is successful (called function is executeAction)", function (assert) {
        const oExecuteActionSpy = sandbox.spy(this.oNotificationsService, "executeAction");

        // getNotificationsBufferBySortingType is called by _invalidCsrfTokenRecovery in order to obtain updated/valid CSRF token
        const oGetNotificationsBufferBySortingTypeStub = sandbox.stub(this.oNotificationsService, "getNotificationsBufferBySortingType").resolves();

        const oRequestStub = sandbox.stub(OData, "request");
        oRequestStub.onCall(0).callsArgWith(2, {
            response: {
                statusCode: 403,
                headers: { "x-csrf-token": "required" }
            }
        });
        oRequestStub.onCall(1).callsArg(1);

        return this.oNotificationsService.executeAction("notificationId", "actionId")
            .then(function () {
                assert.strictEqual(oGetNotificationsBufferBySortingTypeStub.callCount, 1, "Invalid CSRF Token problem - getNotificationsBufferBySortingType called for obtaining updated token");
                assert.strictEqual(oExecuteActionSpy.callCount, 2, "Invalid CSRF Token problem - executeAction called twice");
            })
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("Verify executeAction function - failure and some notifications actions success", async function (assert) {
        const done = assert.async();
        sandbox.stub(OData, "request");
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        this.oNotificationsService.notificationsSeen();

        this.oNotificationsService.executeAction("notificationId", "actionId")
            .then(function (oResult) {
                assert.strictEqual(oResult.isSucessfull, true, "oResult status is successful");
                assert.strictEqual(oResult.message, "text", "oResult status is correct");
            })
            .catch(() => assert.notOk(true, "The promise should have been resolved."))
            .finally(done);

        await Promise.resolve();
        OData.request.args[1][2]({
            response: {
                statusCode: 200,
                body: "{\"Success\": true, \"MessageText\": \"text\"}"
            }
        });
    });

    QUnit.test("Verify that the OData calls are sent correctly", async function (assert) {
        sandbox.stub(OData, "request");
        sandbox.stub(OData, "read");
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_updateNotificationsConsumers");
        sandbox.stub(this.oNotificationsService, "_updateNotificationsCountConsumers");
        sandbox.stub(this.oNotificationsService, "_establishWebSocketConnection").returns(false);

        this.oNotificationsService.notificationsSeen();
        await Promise.resolve();
        assert.strictEqual(OData.request.args[0][0].method, "POST", "Call to notificationsSeen: OData.request was called with method POST");
        assert.strictEqual(OData.request.args[0][0].requestUri.endsWith("NOTIFICATIONS_SRV/ResetBadgeNumber"), true,
            "notificationsSeen: OData.request was called with function call ResetBadgeNumber");

        this.oNotificationsService._readUnseenNotificationsCount();
        await Promise.resolve();
        assert.strictEqual(OData.read.args[0][0].requestUri.endsWith("NOTIFICATIONS_SRV/GetBadgeNumber()"), true,
            "_readUnseenNotificationsCount: OData.request was called with function call GetBadgeNumber");
        assert.strictEqual(OData.read.args[0][0].headers["Accept-Language"], Localization.getLanguageTag().toString(), "The user language was set to the 'Accept-Language' header");

        this.oNotificationsService.readNotificationsCount();
        await Promise.resolve();
        assert.strictEqual(OData.read.args[1][0].requestUri.endsWith("NOTIFICATIONS_SRV/Notifications/$count"), true,
            "readNotificationsCount: OData.request was called with function call GetBadgeNumber");
        assert.strictEqual(OData.read.args[1][0].headers["Accept-Language"], Localization.getLanguageTag().toString(),
            "The user language was set to the 'Accept-Language' header");

        this.oNotificationsService._readNotificationsData();
        await Promise.resolve();
        assert.strictEqual(OData.read.args[1][0].requestUri.endsWith("NOTIFICATIONS_SRV/Notifications/$count"), true, "_readNotificationsData 1st call: GetBadgeNumber");
        assert.strictEqual(OData.read.args[1][0].headers["Accept-Language"], Localization.getLanguageTag().toString(),
            "_readNotificationsData 1st call: The user language was set to the 'Accept-Language' header");
        assert.strictEqual(OData.request.args[1][0].requestUri.endsWith("NOTIFICATIONS_SRV/Notifications" +
            "?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt%20desc&$filter=IsGroupHeader%20eq%20false&$skip=0&$top=10"),
            true, "_readNotificationsData 2nd call: Get Notifications");
        assert.strictEqual(OData.request.args[1][0].headers["Accept-Language"], Localization.getLanguageTag().toString(),
            "_readNotificationsData 2nd call: The user language was set to the 'Accept-Language' header");

        this.oNotificationsService.executeAction("notificationId", "actionId");

        await Promise.resolve();
        assert.strictEqual(OData.request.args[2][0].method, "POST", "executeAction: OData.request was called with method POST");
        assert.strictEqual(OData.request.args[2][0].requestUri.endsWith("ExecuteAction"), true, "executeAction: OData.request was called with function ExecuteAction");
        assert.strictEqual(OData.request.args[2][0].data.ActionId, "actionId", "executeAction: ActionId should be 'actionId'");
        assert.strictEqual(OData.request.args[2][0].data.NotificationId, "notificationId", "executeAction: NotificationId should be 'notificationId'");

        this.oNotificationsService.executeBulkAction("notificationGroupId", "actionIdForBulk");
        await Promise.resolve();
        assert.strictEqual(OData.request.args.length, 4, "number of calls to OData request is 6: 3 previous calls, and 1 as a result of the executeBulkAction call");

        assert.strictEqual(OData.request.args[3][0].method, "POST", "executeBulkAction: 1st OData.request was called with method POST");
        assert.strictEqual(OData.request.args[3][0].requestUri.endsWith("BulkActionByHeader"), true, "executeBulkAction: OData.request was called with function BulkActionByHeader");
        assert.strictEqual(OData.request.args[3][0].data.ActionId, "actionIdForBulk", "executeBulkAction: ActionId should be 'actionIdForBulk'");
        assert.strictEqual(OData.request.args[3][0].data.ParentId, "notificationGroupId", "executeBulkAction: ParentId is notificationGroupId");

        this.oNotificationsService.dismissBulkNotifications("notificationId1");
        await Promise.resolve();
        assert.strictEqual(OData.request.args.length, 5, "number of calls to OData request is 5: 4 previous calls, and 1 as a result of the dismissBulkNotifications call");

        assert.strictEqual(OData.request.args[4][0].method, "POST", "dismissBulkNotifications: OData.request was called with method POST");
        assert.strictEqual(OData.request.args[4][0].requestUri.endsWith("DismissAll"), true, "dismissBulkNotifications: OData.request was called with function ExecuteAction");
        assert.strictEqual(OData.request.args[4][0].data.ParentId, "notificationId1", "dismissBulkNotifications: notificationId is notificationId1");

        this.oNotificationsService.getNotificationsByTypeWithGroupHeaders();
        await Promise.resolve();
        assert.strictEqual(OData.request.args[5][0].headers["Accept-Language"], Localization.getLanguageTag().toString(),
            "getNotificationsByTypeWithGroupHeaders: The user language was set to the 'Accept-Language' header");

        this.oNotificationsService.getNotificationsGroupHeaders();
        await Promise.resolve();
        assert.strictEqual(OData.request.args[6][0].headers["Accept-Language"], Localization.getLanguageTag().toString(),
            "getNotificationsGroupHeaders: The user language was set to the 'Accept-Language' header");

        this.oNotificationsService.getNotificationsBufferInGroup();
        await Promise.resolve();
        assert.strictEqual(OData.request.args[7][0].headers["Accept-Language"], Localization.getLanguageTag().toString(),
            "getNotificationsBufferInGroup: The user language was set to the 'Accept-Language' header");

        this.oNotificationsService.getNotificationsBufferBySortingType();
        await Promise.resolve();
        assert.strictEqual(OData.request.args[8][0].headers["Accept-Language"], Localization.getLanguageTag().toString(),
            "getNotificationsBufferBySortingType: The user language was set to the 'Accept-Language' header");
    });

    QUnit.test("Verify that the model is updated correctly with notifications data", function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 1 } }
        };

        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");
        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_updateCSRF");
        sandbox.stub(this.oNotificationsService, "_updateNotificationsConsumers");
        sandbox.stub(this.oNotificationsService, "_updateNotificationsCountConsumers");
        sandbox.stub(this.oNotificationsService, "_establishWebSocketConnection");
        const oSetPropertyStub = sandbox.stub(this.oNotificationsService._getModel(), "setProperty");

        this.oNotificationsService.init();

        return this.oNotificationsService._readNotificationsData().then(function () {
            assert.strictEqual(oSetPropertyStub.callCount, 6, "setProperty of the model was called 6 times");
            assert.strictEqual(oSetPropertyStub.args[0][0], "/UnseenCount", "2nd call to setProperty: setting UnseenCount");
            assert.strictEqual(oSetPropertyStub.args[0][1], 1, "2nd call to setProperty:  putting the value 1");
            assert.strictEqual(oSetPropertyStub.args[2][0], "/NotificationsCount", "1st call to setProperty: setting Notifications data");
            assert.strictEqual(oSetPropertyStub.args[5][0], "/Notifications", "1st call to setProperty: setting Notifications data");
            assert.strictEqual(oSetPropertyStub.args[5][1].length, 4, "1st call to setProperty: putting 4 array of 4 notifications");
        });
    });

    QUnit.test("Callback functions called on update", function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 2 } }
        };
        const oNotificationsCallback1 = sandbox.stub();
        const oNotificationsCallback2 = sandbox.stub();
        const oNotificationsCallback3 = sandbox.stub();
        const oNotificationsCountCallback1 = sandbox.stub();
        const oNotificationsCountCallback2 = sandbox.stub();
        const oNotificationsCountCallback3 = sandbox.stub();

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_establishWebSocketConnection").callsFake(function () {
            this.oNotificationsService._activatePollingAfterInterval();
        }.bind(this));

        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_updateCSRF");
        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);

        // Register notifications callback functions
        this.oNotificationsService.registerNotificationsUpdateCallback(oNotificationsCallback1);
        this.oNotificationsService.registerNotificationsUpdateCallback(oNotificationsCallback2);
        this.oNotificationsService.registerNotificationsUpdateCallback(oNotificationsCallback3);

        // Register notifications count callback functions
        this.oNotificationsService.registerNotificationCountUpdateCallback(oNotificationsCountCallback1);
        this.oNotificationsService.registerNotificationCountUpdateCallback(oNotificationsCountCallback2);
        this.oNotificationsService.registerNotificationCountUpdateCallback(oNotificationsCountCallback3);

        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval").callsFake(function () {
            this.oNotificationsService._readNotificationsData(true);
        }.bind(this));

        this.oNotificationsService.init();

        return this.oNotificationsService._readNotificationsData().then(function () {
            assert.strictEqual(oNotificationsCallback1.callCount, 1, "1st notifications callback called");
            assert.strictEqual(oNotificationsCallback2.callCount, 1, "2nd notifications callback called");
            assert.strictEqual(oNotificationsCallback3.callCount, 1, "3rd notifications callback called");

            assert.strictEqual(oNotificationsCountCallback1.callCount, 1, "1st notifications count callback called");
            assert.strictEqual(oNotificationsCountCallback2.callCount, 1, "2nd notifications count callback called");
            assert.strictEqual(oNotificationsCountCallback3.callCount, 1, "3rd notifications count callback called");
        });
    });

    QUnit.test("Disable calling callback functions after notifications data read", function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 2 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        const oUpdateNotificationsConsumersStub = sandbox.stub(this.oNotificationsService, "_updateNotificationsConsumers");
        const oUpdateNotificationsCountConsumersStub = sandbox.stub(this.oNotificationsService, "_updateNotificationsCountConsumers");

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
        const done = assert.async();
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 4 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        this.oNotificationsService.registerNotificationsUpdateCallback(function () {
            const oNotificationsPromise = this.oNotificationsService.getNotifications();

            oNotificationsPromise
                .then(function (oNotifications) {
                    assert.strictEqual(oNotifications.length, 4, "Function getNotifications returns the expected number of notifications");
                    assert.strictEqual(oNotifications[0].id, "FirstNotification", "First notification is correct");
                    assert.strictEqual(oNotifications[1].id, "SecondNotification", "Second notification is correct");
                    assert.strictEqual(oNotifications[2].id, "ThirdNotification", "Third notification is correct");
                    assert.strictEqual(oNotifications[3].id, "FourthNotification", "Fourth notification is correct");

                    done();
                })
                .catch(function (error) {
                    assert.notOk(true, "The promise should have been resolved.");
                    done();
                    throw error;
                });
        }.bind(this));

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        sandbox.stub(this.oNotificationsService, "readSettings");
        sandbox.stub(this.oNotificationsService, "_updateCSRF");
        sandbox.stub(this.oNotificationsService, "_fioriClientStep");
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);

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

        sandbox.stub(this.oNotificationsService, "_userSettingInitialization").returns();
        sandbox.stub(this.oNotificationsService, "_isPackagedMode").returns(false);
        sandbox.stub(this.oNotificationsService, "readSettings");

        this.oNotificationsService.init();

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
        const done = assert.async();

        const oUnseenCount = {
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
                .then(function (iCount) {
                    assert.strictEqual(parseInt(iCount, 10), 2, "Function getCount returns the expected number of unseen notifications");
                    done();
                })
                .catch(function (error) {
                    assert.notOk(true, "The promise should have been resolved.");
                    done();
                    throw error;
                });
        }.bind(this));

        sandbox.stub(this.oNotificationsService, "getNotificationsBufferBySortingType").resolves({});
        sandbox.stub(this.oNotificationsService, "_activatePollingAfterInterval");

        this.oNotificationsService.init();
    });

    QUnit.test("Data update occurs after each data change", async function (assert) {
        sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
        sandbox.stub(this.oNotificationsService, "_establishWebSocketConnection").returns(false);
        sandbox.stub(this.oNotificationsService, "_getMode").returns(oModesEnum.POLLING);
        const oReadNotificationsDataStub = sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        sandbox.stub(OData, "request");
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        this.oNotificationsService.notificationsSeen();
        await Promise.resolve();
        assert.strictEqual(oReadNotificationsDataStub.callCount, 0, "NotificationsService._readNotificationsData should not be called");
        assert.strictEqual(OData.request.args[0][0].requestUri, "NOTIFICATIONS_SRV/ResetBadgeNumber", "ResetBadgeNumber should trigger ResetBadgeNumber api");

        this.oNotificationsService.executeAction("notificationId", "actionId"); // Ignore Deferred
        await Promise.resolve();
        assert.strictEqual(oReadNotificationsDataStub.callCount, 0, "NotificationsService._readNotificationsData should not be called");
    });

    QUnit.test("Push notification scenario in Fiori Client mode - foreground use-case", function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 1 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        sandbox.stub(this.oNotificationsService, "markRead");

        this.oNotificationsService._handlePushedNotification({
            additionalData: { foreground: true }
        });

        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 1, "Function _readNotificationsData was called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.callCount, 0, "Function MarkRead was not called by _handlePushedNotification in Foreground scenario");
    });

    QUnit.test("Push notification scenario in Fiori Client mode - Empty data object (should be handled the same way as foreground use-case)", function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 1 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_updateCSRF");
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        sandbox.stub(this.oNotificationsService, "markRead");

        this.oNotificationsService._handlePushedNotification({});

        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 1, "Function _readNotificationsData was called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.callCount, 0, "Function MarkRead was not called by _handlePushedNotification in Foreground scenario");
    });

    QUnit.test("Push notification scenario in Fiori Client mode - Undefined data object", function (assert) {
        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        sandbox.stub(this.oNotificationsService, "markRead");

        this.oNotificationsService._handlePushedNotification();

        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 0, "Function _readNotificationsData was not called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.callCount, 0, "Function MarkRead was not called by _handlePushedNotification");
    });

    QUnit.test("Push notification scenario in Fiori Client mode - background use-case", function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 1 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        const oToExternalWithParametersStub = sandbox.stub(utils, "toExternalWithParameters");

        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        sandbox.stub(this.oNotificationsService, "markRead");

        this.oNotificationsService._handlePushedNotification({
            NotificationId: "123",
            NavigationTargetObject: "object1",
            NavigationTargetAction: "action1",
            NavigationTargetParam: "param1",
            additionalData: {
                foreground: false
            }
        });

        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 1, "Function _readNotificationsData was called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.callCount, 1, "Function MarkRead was called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.args[0][0], "123", "Function MarkRead was called with the correct notification ID");
        assert.strictEqual(oToExternalWithParametersStub.callCount, 1, "Function utils.toExternalWithParameters was called once by _handlePushedNotification");
        assert.strictEqual(oToExternalWithParametersStub.args[0][0], "object1", "Function utils.toExternalWithParameters was called with the correct sematic object");
        assert.strictEqual(oToExternalWithParametersStub.args[0][1], "action1", "Function utils.toExternalWithParameters was called with the correct action");
        assert.strictEqual(oToExternalWithParametersStub.args[0][2][0], "param1", "Function utils.toExternalWithParameters was called with the correct parameters");
    });

    QUnit.test("Push notification scenario in Fiori Client mode - background use-case with additionalData", function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 1 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        const oToExternalWithParametersStub = sandbox.stub(utils, "toExternalWithParameters");

        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        sandbox.stub(this.oNotificationsService, "markRead");

        this.oNotificationsService._handlePushedNotification({
            NotificationId: "123",
            additionalData: {
                NavigationTargetObject: "additional_object1",
                NavigationTargetAction: "additional_action1",
                NavigationTargetParam: "additional_param1",
                foreground: false
            }
        });

        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 1, "Function _readNotificationsData was called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.callCount, 1, "Function MarkRead was called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.args[0][0], "123", "Function MarkRead was called with the correct notification ID");
        assert.strictEqual(oToExternalWithParametersStub.callCount, 1, "Function utils.toExternalWithParameters was called once by _handlePushedNotification");
        assert.strictEqual(oToExternalWithParametersStub.args[0][0], "additional_object1", "Function utils.toExternalWithParameters was called with the correct sematic object");
        assert.strictEqual(oToExternalWithParametersStub.args[0][1], "additional_action1", "Function utils.toExternalWithParameters was called with the correct action");
        assert.strictEqual(oToExternalWithParametersStub.args[0][2][0], "additional_param1", "Function utils.toExternalWithParameters was called with the correct parameters");
    });

    QUnit.test("Push notification scenario in Fiori Client mode - background use-case with partial additionalData", function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 1 } }
        };

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        const oToExternalWithParametersStub = sandbox.stub(utils, "toExternalWithParameters");

        sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
        sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        sandbox.stub(this.oNotificationsService, "_readNotificationsData");
        sandbox.stub(this.oNotificationsService, "markRead");

        this.oNotificationsService._handlePushedNotification({
            NotificationId: "123",
            additionalData: {
                NavigationTargetParam: [
                    { Key: "key1", Value: "value1" },
                    { Key: "key2", Value: "value2" }
                ],
                foreground: false
            },
            NavigationTargetObject: "object1",
            NavigationTargetAction: "action1"
        });

        assert.strictEqual(this.oNotificationsService._readNotificationsData.callCount, 1, "Function _readNotificationsData was called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.callCount, 1, "Function MarkRead was called by _handlePushedNotification");
        assert.strictEqual(this.oNotificationsService.markRead.args[0][0], "123", "Function MarkRead was called with the correct notification ID");
        assert.strictEqual(oToExternalWithParametersStub.callCount, 1, "Function utils.toExternalWithParameters was called once by _handlePushedNotification");
        assert.strictEqual(oToExternalWithParametersStub.args[0][0], "object1", "Function utils.toExternalWithParameters was called with the correct sematic object");
        assert.strictEqual(oToExternalWithParametersStub.args[0][1], "action1", "Function utils.toExternalWithParameters was called with the correct action");
        assert.ok(oToExternalWithParametersStub.args[0][2] instanceof Array, "Function utils.toExternalWithParameters was called with an array of parameters");
        assert.strictEqual(oToExternalWithParametersStub.args[0][2].length, 2, "Function utils.toExternalWithParameters was called with an array of 2 parameters");
        assert.strictEqual(oToExternalWithParametersStub.args[0][2][1].Key, "key2", "Function utils.toExternalWithParameters was called with the correct 2nd parameter key");
        assert.strictEqual(oToExternalWithParametersStub.args[0][2][1].Value, "value2", "Function utils.toExternalWithParameters was called with the correct 2nd parameter value");
    });

    QUnit.test("Fiori client: sequential read actions when not in FioriClient Mode", async function (assert) {
        const oUnseenCount = {
            data: { GetBadgeNumber: { Number: 2 } }
        };

        this.oGetServiceAsyncStub.withArgs("CrossApplicationNavigation").resolves({
            toExternal: sandbox.stub()
        });

        sandbox.stub(OData, "read").callsFake(function (request, success) {
            success(oBasicNotificationsResult, oUnseenCount);
        });
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success(oNotificationsResult);
        });

        sandbox.stub(this.oNotificationsService, "_updateCSRF");

        this.oNotificationsService.registerNotificationsUpdateCallback(function () {
            sandbox.stub(this.oNotificationsService, "_getFioriClientRemainingDelay").returns(-1000);
            sandbox.stub(this.oNotificationsService, "_getMode").returns(oModesEnum.POLLING);
            sandbox.stub(this.oNotificationsService, "_getHeaderXcsrfToken").returns(true);
            sandbox.stub(this.oNotificationsService, "_getDataServiceVersion").returns(true);
        }.bind(this));

        sandbox.stub(this.oNotificationsService, "_isFioriClientMode").returns(false);
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        // As a result of the following call, the following happens:
        //  1. A call to _readNotificationsData
        //  2. A call to _updateConsumers (in the success handler of the OData.read)
        //  3. The registered callback is called
        //  4. The callback calls getNotifications
        //  5. getNotifications calls _readNotificationsData, which calls OData.read =>
        //  This test verifies that the 3rd call to OData.read WILL NOT be issued
        this.oNotificationsService._handlePushedNotification({ additionalData: {} });
        await Promise.resolve();
        assert.strictEqual(OData.request.callCount, 2, "third call to OData.read was prevented");
    });

    QUnit.test("Verify mark as read", function (assert) {
        sandbox.stub(OData, "request").callsFake(function (request, success) {
            success();
        });
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        return this.oNotificationsService.markRead("notificationId")
            .then(function () {
                assert.strictEqual(OData.request.args[0][0].method, "POST", "OData.request was called with method POST");
                assert.strictEqual(OData.request.args[0][0].data.NotificationId, "notificationId", "NotificationId should be 'notificationId'");
                assert.strictEqual(OData.request.args[0][0].requestUri.endsWith("/MarkRead"), true, "markRead: OData.request was called with function /MarkRead");
            })
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("Verify dismiss Notification", async function (assert) {
        sandbox.stub(OData, "request");
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        this.oNotificationsService.dismissNotification("notificationId"); // Ignore Deferred

        await Promise.resolve();
        assert.strictEqual(OData.request.args[0][0].method, "POST", "OData.request was called with method POST");
        assert.strictEqual(OData.request.args[0][0].data.NotificationId, "notificationId", "NotificationId should be 'notificationId'");
        assert.strictEqual(OData.request.args[0][0].requestUri.endsWith("/Dismiss"), true, "Dismiss: OData.request was called with function /Dismiss");
    });

    QUnit.test("Check High Prio Messages", function (assert) {
        sandbox.stub(OData, "request");

        this.oNotificationsService.lastNotificationDate = 1;
        const fnValidateHighPrioMessages = function (sChannelId, sEventId, aNewNotifications) {
            assert.strictEqual(aNewNotifications.length, 2, "Received two High Priority notification");
        };
        EventBus.getInstance().subscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);

        this.oNotificationsService._notificationAlert([
            { CreatedAt: 2, Priority: "HIGH", Text: "HEAD1", IsRead: false },
            { CreatedAt: 3, Priority: "HIGH", Text: "HEAD2", IsRead: false },
            { CreatedAt: 4, Priority: "LOW", Text: "HEAD2", IsRead: false }
        ]);

        EventBus.getInstance().unsubscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);
    });

    QUnit.test("Validate No High Prio Messages, When no messages with High priority", function (assert) {
        sandbox.stub(OData, "request");

        this.oNotificationsService.lastNotificationDate = 1;
        const fnValidateHighPrioMessages = function () {
            assert.ok(false, "Should not Received High Priority notification");
        };
        EventBus.getInstance().subscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);

        this.oNotificationsService._notificationAlert([
            { CreatedAt: 2, Priority: "LOW", Text: "HEAD1", IsRead: false },
            { CreatedAt: 3, Priority: "LOW", Text: "HEAD2", IsRead: false },
            { CreatedAt: 4, Priority: "LOW", Text: "HEAD2", IsRead: false }
        ]);

        EventBus.getInstance().unsubscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);
        assert.ok(true, "Done validating High Prio Messages");
    });

    QUnit.test("Read UserSettings from server", function (assert) {
        const oDataRequestStub = sandbox.stub(OData, "request").callsFake(function (aArgs, fSuccess) {
            fSuccess({ results: {} });
        });
        sandbox.stub(this.oNotificationsService, "_setWorkingMode");
        sandbox.stub(this.oNotificationsService, "_userSettingInitialization");
        this.oNotificationsService.init();

        return this.oNotificationsService.readSettings()
            .then(async () => {
                await Promise.resolve();
                assert.strictEqual(oDataRequestStub.calledOnce, true, "OData.request called once");
                assert.deepEqual(oDataRequestStub.firstCall.args[0].headers, {
                    "Accept-Language": Localization.getLanguageTag().toString(),
                    "X-CSRF-Token": "fetch"
                }, "OData.request called with the expected headers");
                assert.strictEqual(oDataRequestStub.args[0][0].requestUri.endsWith("/NotificationTypePersonalizationSet"), true, "OData.request called with getSettings URL");
            })
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("Read UserSettings from server - failure", function (assert) {
        const oDataRequestStub = sandbox.stub(OData, "request").callsFake(function (aArgs, fSuccess, fFailure) {
            fFailure({ response: { statusCode: 404 } });
        });

        return this.oNotificationsService.readSettings()
            .then(() => assert.notOk(true, "The promise should have been rejected."))
            .catch(() => assert.strictEqual(oDataRequestStub.callCount, 1, "OData.request called once"));
    });

    QUnit.test("Read UserSettings flags from personalization service - empty result", function (assert) {
        sandbox.stub(this.oNotificationsService, "_getUserSettingsPersonalizer").resolves({
            getPersData: function () {
                return Promise.resolve();
            },
            setPersData: function () { }
        });

        this.oNotificationsService._readUserSettingsFlagsFromPersonalization();

        return this.oNotificationsService.getUserSettingsFlags()
            .then(function (oFlags) {
                assert.strictEqual(oFlags.highPriorityBannerEnabled, true, "highPriorityBannerEnabled flag has the default value (true) after Personalizer returned empty object");
            })
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("Read UserSettings flags from personalization service", function (assert) {
        sandbox.stub(this.oNotificationsService, "_getUserSettingsPersonalizer").resolves({
            getPersData: function () {
                return Promise.resolve({
                    highPriorityBannerEnabled: false
                });
            }
        });

        this.oNotificationsService._readUserSettingsFlagsFromPersonalization();

        return this.oNotificationsService.getUserSettingsFlags()
            .then(function (oFlags) {
                assert.strictEqual(oFlags.highPriorityBannerEnabled, false, "highPriorityBannerEnabled flag has the correct value (false) returned from Personalization service");
            })
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("Read UserSettings flags from personalization service - failed", function (assert) {
        sandbox.stub(this.oNotificationsService, "_getUserSettingsPersonalizer").resolves({
            getPersData: function () {
                return Promise.reject();
            }
        });

        this.oNotificationsService._readUserSettingsFlagsFromPersonalization();

        return this.oNotificationsService.getUserSettingsFlags()
            .then(function (oFlags) {
                assert.strictEqual(oFlags.highPriorityBannerEnabled, true, "highPriorityBannerEnabled flag has the default value (true) after Personalizer returned an error");
            })
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("UserSettings Initialization with Mobile support - successful request with negative result", function (assert) {
        sandbox.stub(this.oNotificationsService, "readSettings").resolves();
        sandbox.stub(this.oNotificationsService, "_readEmailSettingsFromServer").resolves("{\"IsActive\": true, \"successStatus\": true}");
        sandbox.stub(this.oNotificationsService, "_readMobileSettingsFromServer").resolves("{\"IsActive\": false, \"successStatus\": true}");

        this.oNotificationsService._userSettingInitialization();

        return this.oNotificationsService._getNotificationSettingsAvailability()
            .then(function (oResult) {
                assert.strictEqual(this.oNotificationsService._getNotificationSettingsMobileSupport(), false, "_getNotificationSettingsMobileSupport returns false");
                assert.strictEqual(oResult.settingsAvailable, true, "oResult.settingsAvailable is true");
                assert.strictEqual(oResult.mobileAvailable, false, "oResult.mobileAvailable is false");
                assert.strictEqual(oResult.emailAvailable, true, "oResult.emailAvailable is true");
            }.bind(this))
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("UserSettings Initialization with Mobile support - successful request with positive result", function (assert) {
        sandbox.stub(this.oNotificationsService, "readSettings").resolves();
        sandbox.stub(this.oNotificationsService, "_readEmailSettingsFromServer").resolves("{\"successStatus\": false}");
        sandbox.stub(this.oNotificationsService, "_readMobileSettingsFromServer").resolves("{\"IsActive\": true, \"successStatus\": true}");

        this.oNotificationsService._userSettingInitialization();

        return this.oNotificationsService._getNotificationSettingsAvailability()
            .then(function (oResult) {
                assert.strictEqual(this.oNotificationsService._getNotificationSettingsMobileSupport(), true, "_getNotificationSettingsMobileSupport returns true");
                assert.strictEqual(oResult.settingsAvailable, true, "oResult.settingsAvailable is true");
                assert.strictEqual(oResult.mobileAvailable, true, "oResult.mobileAvailable is true");
                assert.strictEqual(oResult.emailAvailable, false, "oResult.emailAvailable is false");
            }.bind(this))
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("UserSettings Initialization with Mobile support - unsuccessful request", function (assert) {
        sandbox.stub(this.oNotificationsService, "readSettings").resolves();
        sandbox.stub(this.oNotificationsService, "_readEmailSettingsFromServer").resolves("{\"IsActive\": false, \"successStatus\": true}");
        sandbox.stub(this.oNotificationsService, "_readMobileSettingsFromServer").resolves("{\"successStatus\": false}");

        this.oNotificationsService._userSettingInitialization();

        return this.oNotificationsService._getNotificationSettingsAvailability()
            .then(function (oResult) {
                assert.strictEqual(this.oNotificationsService._getNotificationSettingsMobileSupport(), false, "_getNotificationSettingsMobileSupport returns true");
                assert.strictEqual(oResult.settingsAvailable, true, "oResult.settingsAvailable is true");
                assert.strictEqual(oResult.mobileAvailable, false, "oResult.mobileAvailable is false");
                assert.strictEqual(oResult.emailAvailable, false, "oResult.emailAvailable is false");
            }.bind(this))
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("UserSettings Initialization no Mobile support", function (assert) {
        sandbox.stub(this.oNotificationsService, "readSettings").resolves();
        sandbox.stub(this.oNotificationsService, "_readEmailSettingsFromServer").resolves("{\"IsActive\": false, \"successStatus\": true}");
        sandbox.stub(this.oNotificationsService, "_readMobileSettingsFromServer").resolves("{\"IsActive\": false}");

        this.oNotificationsService._userSettingInitialization();

        return this.oNotificationsService._getNotificationSettingsAvailability()
            .then(function (oResult) {
                assert.strictEqual(this.oNotificationsService._getNotificationSettingsMobileSupport(), false, "_getNotificationSettingsMobileSupport returns false");
                assert.strictEqual(oResult.settingsAvailable, true, "oResult.settingsAvailable is true");
                assert.strictEqual(oResult.mobileAvailable, false, "oResult.mobileAvailable is false");
            }.bind(this))
            .catch(() => assert.notOk(true, "The promise should have been resolved."));
    });

    QUnit.test("The event 'launchpad'/'setConnectionToServer' gets subscribed in the init method", function (assert) {
        // Arrange
        const oEventBusSubscribeSpy = sandbox.spy(EventBus.getInstance(), "subscribe");

        // Act
        this.oNotificationsService.init();

        // Assert
        assert.strictEqual(oEventBusSubscribeSpy.withArgs("launchpad", "setConnectionToServer").callCount, 1, "The event was subscribed correctly.");
    });

    QUnit.test("_closeConnection gets triggered via event 'launchpad'/'setConnectionToServer' for { 'active': false }", function (assert) {
        const done = assert.async();

        // Arrange
        const oResumeConnectionStub = sandbox.stub(this.oNotificationsService, "_resumeConnection");
        sandbox.stub(this.oNotificationsService, "_closeConnection").callsFake(function () {
            // Assert
            assert.strictEqual(oResumeConnectionStub.callCount, 0, "_resumeConnectionStub was not called.");
            done();
        });
        this.oNotificationsService.init();

        // Act - Use real eventing here
        EventBus.getInstance().publish("launchpad", "setConnectionToServer", { active: false });
    });

    QUnit.test("_resumeConnection gets triggered via event 'launchpad'/'setConnectionToServer' for { 'active': true }", function (assert) {
        // Arrange
        const done = assert.async();
        const oCloseConnectionStub = sandbox.stub(this.oNotificationsService, "_closeConnection");
        sandbox.stub(this.oNotificationsService, "_resumeConnection").callsFake(function () {
            // Assert
            assert.strictEqual(oCloseConnectionStub.callCount, 0, "_closeConnectionStub was not called.");
            done();
        });
        this.oNotificationsService.init();
        // Act
        EventBus.getInstance().publish("launchpad", "setConnectionToServer", { active: true });
    });

    QUnit.test("The event subscription for 'launchpad'/'setConnectionToServer' gets deleted in the destroy method", async function (assert) {
        // Arrange
        const oEventBusUnsubscribeSpy = sandbox.spy(EventBus.getInstance(), "unsubscribe");
        this.oNotificationsService.init();
        await Promise.resolve();

        // Act
        this.oNotificationsService.destroy();

        // Assert
        assert.strictEqual(oEventBusUnsubscribeSpy.withArgs("launchpad", "setConnectionToServer").callCount, 1, "The event was unsubscribed correctly.");
    });

    QUnit.module("The function _updateCSRF", {
        beforeEach: function () {
            this.oNotificationsService = new Notifications();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Gets the CSRF token from the response from header 'x-csrf-token' if there is no token yet", function (assert) {
        //Arrange
        var oResponseData = {
            headers: {
                "x-csrf-token": "1234567890"
            }
        };

        //Act
        this.oNotificationsService._updateCSRF(oResponseData);

        //Assert
        assert.strictEqual(this.oNotificationsService._getHeaderXcsrfToken(), "1234567890", "The CSRF token was set");
    });

    QUnit.test("Gets the CSRF token from the response from header 'X-CSRF-Token' if there is no token yet", function (assert) {
        //Arrange
        var oResponseData = {
            headers: {
                "X-CSRF-Token": "1234567890"
            }
        };

        //Act
        this.oNotificationsService._updateCSRF(oResponseData);

        //Assert
        assert.strictEqual(this.oNotificationsService._getHeaderXcsrfToken(), "1234567890", "The CSRF token was set");
    });

    QUnit.test("Gets the CSRF token from the response from header 'X-Csrf-Token' if there is no token yet", function (assert) {
        //Arrange
        var oResponseData = {
            headers: {
                "X-Csrf-Token": "1234567890"
            }
        };

        //Act
        this.oNotificationsService._updateCSRF(oResponseData);

        //Assert
        assert.strictEqual(this.oNotificationsService._getHeaderXcsrfToken(), "1234567890", "The CSRF token was set");
    });

    QUnit.test("Does not change the CSRF token if it was already set before", function (assert) {
        //Arrange
        var oResponseData1 = {
            headers: {
                "x-csrf-token": "1234567890"
            }
        };
        var oResponseData2 = {
            headers: {
                "x-csrf-token": "ABCDEFGHIJ"
            }
        };

        //Act
        this.oNotificationsService._updateCSRF(oResponseData1);
        this.oNotificationsService._updateCSRF(oResponseData2);

        //Assert
        assert.strictEqual(this.oNotificationsService._getHeaderXcsrfToken(), "1234567890", "The CSRF token was not changed");
    });

    QUnit.test("Gets the data service version from the request from header 'DataServiceVersion'", function (assert) {
        //Arrange
        var oResponseData = {
            headers: {
                DataServiceVersion: "4.0"
            }
        };

        //Act
        this.oNotificationsService._updateCSRF(oResponseData);

        //Assert
        assert.strictEqual(this.oNotificationsService._getDataServiceVersion(), "4.0", "The data service version was set");
    });

    QUnit.test("Gets the data service version from the request from header 'odata-version'", function (assert) {
        //Arrange
        var oResponseData = {
            headers: {
                "odata-version": "4.0"
            }
        };

        //Act
        this.oNotificationsService._updateCSRF(oResponseData);

        //Assert
        assert.strictEqual(this.oNotificationsService._getDataServiceVersion(), "4.0", "The data service version was set");
    });

    QUnit.test("Does not change the data service version if it was already set", function (assert) {
        //Arrange
        var oResponseData1 = {
            headers: {
                DataServiceVersion: "4.0"
            }
        };
        var oResponseData2 = {
            headers: {
                DataServiceVersion: "2.0"
            }
        };

        //Act
        this.oNotificationsService._updateCSRF(oResponseData1);
        this.oNotificationsService._updateCSRF(oResponseData2);

        //Assert
        assert.strictEqual(this.oNotificationsService._getDataServiceVersion(), "4.0", "The data service version was set");
    });

    QUnit.test("Does nothing if there are no headers in the response", function (assert) {
        //Arrange
        var oResponseData = {};

        //Act
        this.oNotificationsService._updateCSRF(oResponseData);

        //Assert
        assert.strictEqual(this.oNotificationsService._getHeaderXcsrfToken(), "fetch", "The CSRF token was not set");
        assert.strictEqual(this.oNotificationsService._getDataServiceVersion(), undefined, "The data service version was not set");
    });

    QUnit.module("The function _csrfTokenInvalid", {
        beforeEach: function () {
            this.oNotificationsService = new Notifications();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Unauthorized with x-csrf-token required", function (assert) {
        // Arrange
        const oMessage = {
            response: {
                headers: {
                    "x-csrf-token": "required"
                },
                statusCode: 403
            }
        };

        // Act
        const bResult = this.oNotificationsService._csrfTokenInvalid(oMessage);

        // Assert
        assert.strictEqual(bResult, true, "The CSRF token is required.");
    });

    QUnit.test("Unauthorized with x-csrf-token given", function (assert) {
        // Arrange
        const oMessage = {
            response: {
                headers: {
                    "x-csrf-token": "1234567890"
                },
                statusCode: 403
            }
        };

        // Act
        const bResult = this.oNotificationsService._csrfTokenInvalid(oMessage);

        // Assert
        assert.strictEqual(bResult, false, "The CSRF token is not required.");
    });

    QUnit.test("Authorized with x-csrf-token required", function (assert) {
        // Arrange
        const oMessage = {
            response: {
                headers: {
                    "x-csrf-token": "required"
                },
                statusCode: 500
            }
        };

        // Act
        const bResult = this.oNotificationsService._csrfTokenInvalid(oMessage);

        // Assert
        assert.strictEqual(bResult, false, "The error is different.");
    });

    QUnit.test("Authorized with x-csrf-token given", function (assert) {
        // Arrange
        const oMessage = {
            response: {
                headers: {
                    "x-csrf-token": "1234567890"
                },
                statusCode: 500
            }
        };

        // Act
        const bResult = this.oNotificationsService._csrfTokenInvalid(oMessage);

        // Assert
        assert.strictEqual(bResult, false, "The error is different.");
    });

    QUnit.test("Authorized without x-csrf-token", function (assert) {
        // Arrange
        const oMessage = {
            response: {
                headers: {},
                statusCode: 500
            }
        };

        // Act
        const bResult = this.oNotificationsService._csrfTokenInvalid(oMessage);

        // Assert
        assert.strictEqual(bResult, false, "The error is different.");
    });
});

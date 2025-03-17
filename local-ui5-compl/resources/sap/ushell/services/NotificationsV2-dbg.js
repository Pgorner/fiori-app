// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Localization",
    "sap/ui/core/EventBus",
    "sap/ushell/utils/Deferred",
    "sap/ui/core/ws/SapPcpWebSocket",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/datajs",
    "sap/ushell/utils",
    "sap/ushell/Container"
], function (
    Log,
    Localization,
    EventBus,
    Deferred,
    SapPcpWebSocket,
    JSONModel,
    OData,
    ushellUtils,
    Container
) {
    "use strict";

    /*eslint consistent-this: ["error", "oNotificationsService"]*/

    const S_DEFAULT_WEBSOCKET_URL = "/sap/bc/apc/iwngw/notification_push_apc";
    const I_DEFAULT_POLLING_INTERVAL = 60; // Seconds

    /**
     * @alias sap.ushell.services.NotificationsV2
     * @class
     * @classdesc UShell service for fetching user notification data from the Notification center/service<br>
     * and exposing them to the Unified Shell and Fiori applications UI controls.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const NotificationsV2 = await Container.getServiceAsync("NotificationsV2");
     *     // do something with the NotificationsV2 service
     *   });
     * </pre>
     *
     * In order to get user notifications, Unified Shell notification service issues OData requests<br>
     * to the service defined by the configuration property <code>serviceUrl</code>,<br>
     * for example: "/sap/opu/odata4/iwngw/notification/default/iwngw/notification_srv/0001"<br>.
     *
     * Unified Shell Notification service has several working modes, depending on the environment and the available resources:<br>
     *   PackagedApp mode: Fiori launchpad runs in the context of PackagedApp<br>
     *   FioriClient mode: Fiori launchpad runs in the context of FioriLaunchpad<br>
     *   WebSocket mode: Fiori launchpad runs in a browser, and WebSocket connection to the notifications provider is available<br>
     *   Polling mode: Fiori launchpad in runs in a browser, and WebSocket connection to the notifications provider is not available<br>
     *
     * The notification service exposes an API that includes:
     *   - Service enabling and initialization<br>
     *   - Registration of callback functions (by Shell/FLP controls) that will be called for every data update<br>.
     *   - Retrieval of notification data (e.g. notifications, number of unseen notifications)
     *   - Execution of a notification actions
     *   - Marking user notifications as seen
     *
     * @param {object} oContainerInterface The interface provided by the container
     * @param {object} sParameters Not used in this service
     * @param {object} oServiceConfiguration configuration
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.119
     * @public
     */
    function Notifications (oContainerInterface, sParameters, oServiceConfiguration) {

        /**
         * Type for notification target parameters.
         * @typedef {object} sap.ushell.services.NotificationsV2.NotificationTargetParameter
         * @property {string} NotificationId The ID of the notification.
         * @property {string} Key The key of the notification target parameter.
         * @property {string} Value The value of the notification target parameter.
         * @since 1.120.0
         * @public
         */

        /**
         * @alias sap.ushell.services.NotificationsV2.Priority
         * @enum {string}
         * Enumeration for the priority of a notification
         *
         * @since 1.120.0
         * @public
         */
        this.Priority = {
            /**
             * Low priority.
             * @public
             */
            LOW: "LOW",
            /**
             * Medium priority.
             * @public
             */
            MEDIUM: "MEDIUM",
            /**
             * High priority.
             * @public
             */
            HIGH: "HIGH"
        };

        /**
         * @alias sap.ushell.services.NotificationsV2.Nature
         * @enum {string}
         * Enumeration for The nature of the notification
         *
         * @since 1.120.0
         * @public
         */
        this.Nature = {
            /**
             * The Positive nature.
             * @public
             */
            POSITIVE: "POSITIVE",
            /**
             * The Negative nature.
             * @public
             */
            NEGATIVE: "NEGATIVE",
            /**
             * The Neutral nature.
             * @public
             */
            NEUTRAL: "NEUTRAL"
        };

        /**
         * Type for Actor
         * @typedef {object} sap.ushell.services.NotificationsV2.Actor
         * @property {string} Id The ID of the actor
         * @property {string} DisplayText The display text of the actor
         * @property {string} ImageSource The image source of the actor
         * @since 1.120.0
         * @public
         */

        /**
         * Type for Action
         * @typedef {object} sap.ushell.services.NotificationsV2.Action
         * @property {string} ActionId The ID of the action
         * @property {string} ActionText The text of the action
         * @property {string} GroupActionText The group action text
         * @property {sap.ushell.services.NotificationsV2.Nature} Nature The nature of the action
         * @since 1.120.0
         * @public
         */

         /**
         * Type for the notification item
         *
         * @typedef {object} sap.ushell.services.NotificationsV2.NotificationItem
         * @property {string} Id The ID of the notification.
         * @property {string} OriginId The ID of the origin, can be a combination of system and client or the value <code>LOCAL</code>.
         * @property {string} CreatedAt The date and time the notification was created.
         * @property {boolean} IsActionable Indicates whether the notification is actionable.
         * @property {boolean} IsRead Indicates whether the notification has been read.
         * @property {boolean} IsGroupable Indicates whether the notification can be grouped.
         * @property {boolean} IsGroupHeader Indicates whether the notification is a group header.
         * @property {string} NavigationTargetAction The action to be executed when the notification is clicked.
         * @property {string} NavigationTargetObject The object to be navigated to when the notification is clicked.
         * @property {string} NavigationIntent The intent for navigation when the notification is clicked.
         * @property {string} NotificationTypeId The ID for the notification type specified in <code>NotificationTypeKey</code>.
         * @property {string} NotificationTypeKey The key of the notification type.
         * @property {string} ParentId The ID of the parent notification.
         * @property {sap.ushell.services.NotificationsV2.Priority} Priority The priority of the notification.
         * @property {string} SensitiveText The sensitive text of the notification.
         * @property {string} Text The text of the notification.
         * @property {string} GroupHeaderText The header text of the notification group.
         * @property {number} NotificationCount The number of notifications.
         * @property {string} SubTitle The subtitle of the notification.
         * @property {string} NotificationTypeDesc The description of the notification type.
         * @property {sap.ushell.services.NotificationsV2.Actor} Actor The actor of the notification.
         * @property {sap.ushell.services.NotificationsV2.NotificationTargetParameter[]} NavigationTargetParams The navigation target parameters of the notification.
         * @property {sap.ushell.services.NotificationsV2.Action[]}  Actions The actions of the notification.
         * @since 1.120.0
         * @public
         */

        /**
         * Type for executeBulkAction
         * @typedef {object} sap.ushell.services.NotificationsV2.BulkAction
         * @property {boolean} DeleteOnReturn Indicates whether the notification should be deleted after the action is executed
         * @property {boolean} Success Indicates whether the action was executed successfully
         * @property {string} NotificationId The ID of the notification
         * @since 1.120.0
         * @public
         */

        const oModel = new JSONModel();
        const oServiceConfig = oServiceConfiguration && oServiceConfiguration.config;
        const aRequestURIs = {
            getNotifications: {},
            getNotificationsByType: {},
            getNotificationsInGroup: {},
            getBadgeNumber: {},
            resetBadgeNumber: {},
            getNotificationTypesSettings: {},
            getNotificationsGroupHeaders: {},
            getMobileSupportSettings: {},
            getEmailSupportSettings: {},
            getWebSocketValidity: {},
            getNotificationCount: {}
        };
        const aUpdateNotificationsCallbacks = [];
        const aUpdateNotificationsCountCallbacks = [];
        const tWebSocketRecoveryPeriod = 5000;
        const tFioriClientInitializationPeriod = 6000;
        const oOperationEnum = {
            NOTIFICATIONS: 0,
            NOTIFICATIONS_BY_TYPE: 1,
            GET_BADGE_NUMBER: 2,
            RESET_BADGE_NUMBER: 3,
            GET_SETTINGS: 4,
            GET_MOBILE_SUPPORT_SETTINGS: 5,
            NOTIFICATIONS_GROUP_HEADERS: 6,
            NOTIFICATIONS_IN_GROUP: 7,
            GET_NOTIFICATIONS_COUNT: 8,
            VALIDATE_WEBSOCKET_CHANNEL: 9,
            GET_EMAIL_SUPPORT_SETTINGS: 10,
            NOTIFICATIONS_BY_DATE_DESCENDING: "notificationsByDateDescending",
            NOTIFICATIONS_BY_PRIORITY_DESCENDING: "notificationsByPriorityDescending",
            NOTIFICATIONS_BY_TYPE_DESCENDING: "notificationsByTypeDescending"
        };
        const oModesEnum = {
            PACKAGED_APP: 0,
            FIORI_CLIENT: 1,
            WEB_SOCKET: 2,
            POLLING: 3
        };
        const oUserFlagsReadFromPersonalizationDeferred = new Deferred();
        const oNotificationSettingsAvailabilityDeferred = new Deferred();
        const oUserFlagsReadFromPersonalizationPromise = oUserFlagsReadFromPersonalizationDeferred.promise();
        const oDummyItems = {};
        const iInitialBufferSize = 10;

        let tInitializationTimestamp = new Date();
        let oWebSocket;
        let initialReadTimer;
        let webSocketRecoveryTimer;
        let pollingTimer;
        let iPollingInterval;
        let bIntentBasedConsumption = false;
        let aConsumedIntents = [];
        let bInitialized = false;
        let bOnServiceStop = false;
        let bEnabled = true;
        let sHeaderXcsrfToken = "fetch";
        let sDataServiceVersion;
        let bWebSocketRecoveryAttempted = false;
        let oCurrentMode;
        let bFirstDataLoaded = false;
        let bHighPriorityBannerEnabled = true;
        let bNotificationSettingsMobileSupport;
        let bNotificationSettingsEmailSupport;
        let bUseDummyItems = false;
        let bInvalidCsrfTokenRecoveryMode = false;
        let bCsrfDataSet = false;
        let aDismissNotifications = [];
        let oInitialRequestPromise;

        // *************************************************************************************************
        // ************************************* Service API - Begin ***************************************

        /**
         * Indicates whether notification service is enabled.<br>
         * Enabling is based on the <code>enable</code> service configuration flag.<br>
         * The service configuration must also include serviceUrl attribute.<br>
         *
         * @returns {boolean} A boolean value indicating whether the notifications service is enabled
         * @public
         */
        this.isEnabled = function () {
            if (!oServiceConfig.enabled || !oServiceConfig.serviceUrl) {
                bEnabled = false;
                if (oServiceConfig.enabled && !oServiceConfig.serviceUrl) {
                    Log.warning("No serviceUrl was found in the service configuration");
                }
            } else {
                bEnabled = true;
            }
            return bEnabled;
        };

        /**
         * Initializes the notification service
         *
         * Initialization is performed only if the following two conditions are fulfilled:<br>
         *   1. Notification service is enabled<br>
         *   2. Notification service hasn't been initialized yet<br>
         *
         * The main initialization functionality is determining and setting the mode in which notifications are consumed.<br>
         * The possible modes are:<br>
         *   PACKAGED_APP - Notifications are fetched when a callback is called by PackagedApp environment<br>
         *   FIORI_CLIENT - Notifications are fetched when a callback is called by FioriClient environment<br>
         *   WEB_SOCKET - Notifications are fetched on WebSocket "ping"<br>
         *   POLLING - Notifications are fetched using periodic polling mechanism<br>
         *
         * @public
         */
        this.init = function () {
            if (!bInitialized && this.isEnabled()) {
                EventBus.getInstance().subscribe("launchpad", "sessionTimeout", this.destroy, this);
                oInitialRequestPromise = this.fireInitialRequest();
                this.lastNotificationDate = new Date();
                this._setWorkingMode();
                bInitialized = true;
                this.bUpdateDependencyInitiatorExists = false;
                this._userSettingInitialization();
            }

            // Listen for requests to enable or disable the connection to the server
            EventBus.getInstance().subscribe("launchpad", "setConnectionToServer", this._onSetConnectionToServer, this);
        };

        /**
         * Fires an ODataRequest to prevent multiple CSRF tokens getting fetched in parallel.
         * @private
         */
        this.fireInitialRequest = async function () {
            return new Promise((resolve) => {
                const oRequestObject = {
                    requestUri: oServiceConfig.serviceUrl + "/GetBadgeNumber()",
                    headers: {
                        "X-CSRF-Token": sHeaderXcsrfToken
                    }
                };
                OData.request(
                    oRequestObject,
                    (oResult) => {
                        if (oResult.response) {
                            this._updateCSRF(oResult.response);
                        }
                        resolve();
                    },
                    (oResult) => {
                        if (oResult.response) {
                            this._updateCSRF(oResult.response);
                        }
                        resolve();
                    }
                );
            });
        };

        /**
         * Fires an ODataRequest, after making sure that a pervious initial request has been done.
         * This is done to prevent multiple CSRF tokens getting fetched in parallel.
         *
         * @param {object} oRequestObject contains all the read request information.
         * @private
         */
        this.fireODataRequest = async function (oRequestObject) {
            await oInitialRequestPromise;
            if (oRequestObject.headers && oRequestObject.headers["X-CSRF-Token"]) {
                oRequestObject.headers["X-CSRF-Token"] = sHeaderXcsrfToken;
            }
            OData.request.apply(this, arguments);
        };

        /**
         * Fires an ODataRead, after making sure that a pervious initial request has been done.
         * This is done to prevent multiple CSRF tokens getting fetched in parallel.
         *
         * @param {object} oRequestObject contains all the request information.
         * @private
         */
        this.fireODataRead = async function (oRequestObject) {
            await oInitialRequestPromise;
            if (oRequestObject.headers && oRequestObject.headers["X-CSRF-Token"]) {
                oRequestObject.headers["X-CSRF-Token"] = sHeaderXcsrfToken;
            }
            OData.read.apply(this, arguments);
        };

        /**
         * This event handler enables or disables the connection to the server
         *
         * @param {string} channelID Channel ID of the event
         * @param {string} eventID Event ID of the event
         * @param {{active: boolean}} data Indicates if the connection is to be enabled or disabled
         *
         * @private
         */
        this._onSetConnectionToServer = function (channelID, eventID, data) {
            if (data.active) {
                this._resumeConnection();
            } else {
                this._closeConnection();
            }
        };

        /**
         * Returns the number of unseen notifications<br>
         * e.g. Notifications that the user hasn't seen yet.
         *
         * @returns {Promise<int>} Promise resolves with the number of unread notifications of the user
         *
         * @public
         */
        this.getUnseenNotificationsCount = function () {
            return Promise.resolve(oModel.getProperty("/UnseenCount"));
        };

        /**
         * Returns the number of  notifications<br>
         * e.g. Notifications for user.
         *
         * @returns {int} Returns the number of notifications of the user
         *
         * @public
         */
        this.getNotificationsCount = function () {
            return oModel.getProperty("/NotificationsCount") || "0";
        };

        this._createRequest = function (sUri) {
            const oHeader = {
                "Accept-Language": Localization.getLanguageTag().toString(),
                "X-CSRF-Token": this._getHeaderXcsrfToken() || "fetch" // fetch if not token was obtained previously
            };
            return {
                requestUri: sUri,
                headers: oHeader
            };
        };

        /**
         * Returns the notifications of the user sorted by type include the group headers and the notifications
         *
         * @returns {Promise<sap.ushell.services.NotificationsV2.NotificationItem[]>} Promise for all notification items
         * The notifications items have value true for attribute group header if they are group headers.
         * @public
         */
        this.getNotificationsByTypeWithGroupHeaders = function () {
            const oRequest = this._createRequest(this._getRequestURI(oOperationEnum.NOTIFICATIONS_BY_TYPE));

            return new Promise((resolve, reject) => {
                this.fireODataRequest(oRequest, resolve, (oMessage) => {
                    if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                        resolve(oMessage.response.body);
                    } else {
                        Log.error("Notification service - oData executeAction failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                        reject(oMessage);
                    }
                });
            });
        };


        /**
         * Returns the group headers of the user notifications
         *
         * @returns {Promise<sap.ushell.services.NotificationsV2.NotificationItem[]>} Promise for all group headers
         * The notifications items have value true for attribute group header
         *
         * @public
         */
        this.getNotificationsGroupHeaders = function () {
            const oRequest = this._createRequest(this._getRequestURI(oOperationEnum.NOTIFICATIONS_GROUP_HEADERS));

            return new Promise((resolve, reject) => {
                this.fireODataRequest(oRequest, resolve, (oMessage) => {
                    if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                        resolve(oMessage.response.body);
                    } else {
                        Log.error("Notification service - oData executeAction failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                        reject();
                    }
                });
            });
        };

        // Private. The function is used in Notifications.controller.
        this.getNotificationsBufferInGroup = function (sGroup, iSkip, iTop) {
            if (bUseDummyItems === true) {
                const aResponse = oDummyItems[oOperationEnum.NOTIFICATIONS_IN_GROUP].slice(iSkip, iSkip + iTop);
                const oResponse = JSON.stringify({
                    "@odata.context": "$metadata#Notifications",
                    value: aResponse
                });

                return new Promise((resolve) => {
                    window.setTimeout(() => resolve(oResponse), 1000);
                });
            }

            const oNotificationsService = this;
            const oArgs = {
                group: sGroup,
                skip: iSkip,
                top: iTop
            };
            const oRequest = this._createRequest(this._getRequestURI(oOperationEnum.NOTIFICATIONS_IN_GROUP, oArgs));

            return new Promise((resolve, reject) => {
                this.fireODataRequest(oRequest,
                    (oResult) => {
                        oNotificationsService._updateCSRF(oResult.response);
                        resolve(oResult.value);
                    },
                    (oMessage) => {
                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            oNotificationsService._updateCSRF(oMessage.response);
                            resolve(JSON.parse(oMessage.response.body).value);
                        } else {
                            Log.error("Notification service - oData executeAction failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            reject();
                        }
                    });
            });
        };

        // Private. The function is used in Notifications.controller.
        this.getNotificationsBufferBySortingType = function (sSortingType, iSkip, iTop) {
            if (bUseDummyItems === true) {
                const oResponse = JSON.stringify({
                    "@odata.context": "$metadata#Notifications",
                    value: oDummyItems[sSortingType].slice(iSkip, iSkip + iTop)
                });
                return new Promise((resolve) => window.setTimeout(() => resolve(oResponse), 1000));
            }

            const oNotificationsService = this;
            const oArgs = {
                skip: iSkip,
                top: iTop
            };
            const oRequestObject = this._createRequest(this._getRequestURI(sSortingType, oArgs));

            return new Promise((resolve, reject) => {
                this.fireODataRequest(oRequestObject,
                    (oResult) => {
                        oNotificationsService._updateCSRF(oResult.response);
                        resolve(oResult.value);
                    },
                    (oMessage) => {
                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            oNotificationsService._updateCSRF(oMessage.response);
                            var oParse = this._parseJSON(oMessage.response.body);
                            if (oParse) {
                                resolve(oParse.value);
                            } else {
                                Log.error("Notification service - oData executeAction failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                                reject();
                            }
                        } else if (oNotificationsService._csrfTokenInvalid(oMessage) && (bInvalidCsrfTokenRecoveryMode === false)) {
                            oNotificationsService._invalidCsrfTokenRecovery(resolve, reject, oNotificationsService.getNotificationsBufferBySortingType, [sSortingType, iSkip, iTop]);
                        } else {
                            Log.error("Notification service - oData executeAction failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            reject();
                        }
                    });
            });
        };

        /**
         * Returns the 10 most recent notifications of the user
         *
         * @returns {Promise} Promise object that on success - returns the 10 most recent user notification items
         *
         * @private
         */
        this.getNotifications = function () {
            if ((oCurrentMode === oModesEnum.FIORI_CLIENT) || (oCurrentMode === oModesEnum.PACKAGED_APP)) {
                // In Fiori Client mode, notification service fetches notification on initialization,
                // and after that - notification data is updated only by pushed notifications.
                // hence, there's no way that Notification service is updated regarding other changes
                // for example: if the user approved/rejected a notification via other device.
                // In order to solve this - we bring updated data when getNotifications is called from Fiori Client
                return this._readNotificationsData(false).then(() => oModel.getProperty("/Notifications"));
            }
            // In case of offline testing (when OData calls fail):
            // Comment the following line and uncomment the next one
            return Promise.resolve(oModel.getProperty("/Notifications"));
            // return Promise.resolve(this._getDummyJSON());
        };

        /**
         * Launches a notification action oData call.<br>
         * After launching the action, the function gets updated notification data in order to push the updated data to the consumers.
         *
         * @param {string} sNotificationGroupId The ID of the notification header/group whose action is being executed
         * @param {string} sActionId The ID of the action that is being executed
         * @returns {Promise<sap.ushell.services.NotificationsV2.BulkAction[]>} Promise object that on success resolves to undefined or it is rejected with failed notifications
         * @public
         */
        this.executeBulkAction = function (sNotificationGroupId, sActionId) {
            return new Promise((resolve, reject) => {
                this.sendBulkAction(sNotificationGroupId, sActionId).then((res) => {
                    const aSucceededNotifications = [];
                    const aFailedNotifications = [];
                    res.forEach((oNotification) => {
                        const sNotificationId = oNotification.NotificationId;
                        if (oNotification.Success) {
                            aSucceededNotifications.push(sNotificationId);
                        } else {
                            aFailedNotifications.push(sNotificationId);
                        }
                    });
                    const oResult = {
                        succededNotifications: aSucceededNotifications,
                        failedNotifications: aFailedNotifications
                    };
                    if (aFailedNotifications.length) {
                        reject(oResult);
                    } else {
                        resolve(oResult);
                    }
                });
            });
        };

        this.dismissBulkNotifications = function (sNotificationGroupId) {
            return this.sendBulkDismiss(sNotificationGroupId);
        };

        this.executeAction = function (sNotificationId, sActionId) {
            const oNotificationsService = this;
            const sActionUrl = oServiceConfig.serviceUrl + "/ExecuteAction";
            const oRequestBody = { NotificationId: sNotificationId, ActionId: sActionId };
            const oRequestObject = {
                requestUri: sActionUrl,
                method: "POST",
                data: oRequestBody,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    DataServiceVersion: sDataServiceVersion,
                    "X-CSRF-Token": sHeaderXcsrfToken
                }
            };
            return new Promise((resolve, reject) => {
                this.fireODataRequest(
                    oRequestObject,
                    (oResult) => {
                        const responseAck = { isSucessfull: true, message: "" };
                        if (oResult && oResult.response && oResult.response.statusCode === 200 && oResult.response.body) {
                            const responseAckJson = JSON.parse(oResult.response.body);
                            responseAck.isSucessfull = responseAckJson.Success;
                            responseAck.message = responseAckJson.MessageText;
                        }
                        resolve(responseAck);
                    },
                    (oMessage) => {
                        const responseAck = { isSucessfull: false, message: "" };

                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            const responseAckJson = JSON.parse(oMessage.response.body);
                            responseAck.isSucessfull = responseAckJson.Success;
                            responseAck.message = responseAckJson.MessageText;
                            resolve(responseAck);
                        } else if (oNotificationsService._csrfTokenInvalid(oMessage) && (bInvalidCsrfTokenRecoveryMode === false)) {
                            oNotificationsService._invalidCsrfTokenRecovery(resolve, reject, oNotificationsService.executeAction, [sNotificationId, sActionId]);
                        } else {
                            Log.error("Notification service - oData executeAction failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            reject(oMessage);
                        }
                    });
            });
        };

        this.sendBulkAction = function (sParentId, sActionId) {
            const oNotificationsService = this;
            const sActionUrl = oServiceConfig.serviceUrl + "/BulkActionByHeader";
            const oRequestBody = { ParentId: sParentId, ActionId: sActionId };
            const oRequestObject = {
                requestUri: sActionUrl,
                method: "POST",
                data: oRequestBody,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    DataServiceVersion: sDataServiceVersion,
                    "X-CSRF-Token": sHeaderXcsrfToken
                }
            };

            return new Promise((resolve, reject) => {
                this.fireODataRequest(
                    oRequestObject,
                    (oResult) => {
                        let responseAck;
                        if (oResult && oResult.response && oResult.response.statusCode === 200 && oResult.response.body) {
                            let responseAckJson = JSON.parse(oResult.response.body);
                            responseAck = responseAckJson.value;
                        }
                        resolve(responseAck);
                    },
                    (oResult) => {
                        if (oResult.response && oResult.response.statusCode === 200 && oResult.response.body) {
                            let responseAckJson = JSON.parse(oResult.response.body);
                            let responseAck = responseAckJson.value;
                            resolve(responseAck);
                        } else if (oNotificationsService._csrfTokenInvalid(oResult) && (bInvalidCsrfTokenRecoveryMode === false)) {
                            oNotificationsService._invalidCsrfTokenRecovery(resolve, reject, oNotificationsService.sendBulkAction, [sParentId, sActionId]);
                        } else {
                            Log.error("Notification service - oData executeBulkAction failed: ", oResult.message, "sap.ushell.services.NotificationsV2");
                            reject();
                        }
                    });
            });
        };

        this.sendBulkDismiss = function (sParentId) {
            const oNotificationsService = this;
            const sActionUrl = oServiceConfig.serviceUrl + "/DismissAll";
            const oRequestBody = { ParentId: sParentId };
            const oRequestObject = {
                requestUri: sActionUrl,
                method: "POST",
                data: oRequestBody,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    DataServiceVersion: sDataServiceVersion,
                    "X-CSRF-Token": sHeaderXcsrfToken
                }
            };

            return new Promise((resolve, reject) => {
                this.fireODataRequest(oRequestObject, () => resolve(), (oResult) => {
                    if (oResult.response && oResult.response.statusCode === 200) {
                        resolve();
                    } else if (oNotificationsService._csrfTokenInvalid(oResult) && (bInvalidCsrfTokenRecoveryMode === false)) {
                        oNotificationsService._invalidCsrfTokenRecovery(resolve, reject, oNotificationsService.sendBulkDismiss, [sParentId]);
                    } else {
                        const oMessage = oResult ? oResult.message : "";
                        Log.error("Notification service - oData executeBulkAction failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                        reject();
                    }
                });
            });
        };

        /**
         * Launches mark as read notification call.<br>
         * After launching the action, the function gets updated notification data in order to push the updated data to the consumers.
         *
         * @param {string} sNotificationId The ID of the notification whose action is being executed
         * @returns {Promise} Promise object that on success resolves to undefined or it is rejected with a message object
         *
         * @public
         */
        this.markRead = function (sNotificationId) {
            const oNotificationsService = this;
            const sActionUrl = oServiceConfig.serviceUrl + "/MarkRead";
            const oRequestBody = { NotificationId: sNotificationId };
            const oRequestObject = {
                requestUri: sActionUrl,
                method: "POST",
                data: oRequestBody,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    DataServiceVersion: sDataServiceVersion,
                    "X-CSRF-Token": sHeaderXcsrfToken
                }
            };

            return new Promise((resolve, reject) => {
                this.fireODataRequest(oRequestObject, () => resolve(), (oMessage) => {
                    if (oNotificationsService._csrfTokenInvalid(oMessage) && (bInvalidCsrfTokenRecoveryMode === false)) {
                        oNotificationsService._invalidCsrfTokenRecovery(resolve, reject, oNotificationsService.markRead, [sNotificationId]);
                    } else {
                        Log.error("Notification service - oData reset badge number failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                        reject(oMessage);
                    }
                });
            });
        };

        /**
         * Launches dismiss notification call.<br>
         *
         * @param {string} sNotificationId The ID of the notification whose action is being executed
         * @returns {Promise} Promise object that on success resolves to undefined or it is rejected with a message object
         *
         * @public
         */
        this.dismissNotification = function (sNotificationId) {
            const sActionUrl = oServiceConfig.serviceUrl + "/Dismiss";
            const oNotificationsService = this;
            const oRequestBody = { NotificationId: sNotificationId };
            const oRequestObject = {
                requestUri: sActionUrl,
                method: "POST",
                data: oRequestBody,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    DataServiceVersion: sDataServiceVersion,
                    "X-CSRF-Token": sHeaderXcsrfToken
                }
            };

            return new Promise((resolve, reject) => {
                this.fireODataRequest(
                    oRequestObject,
                    () => {
                        oNotificationsService._addDismissNotifications(sNotificationId);
                        resolve();
                    },
                    (oMessage) => {
                        if (oNotificationsService._csrfTokenInvalid(oMessage) && (bInvalidCsrfTokenRecoveryMode === false)) {
                            oNotificationsService._invalidCsrfTokenRecovery(resolve, reject, oNotificationsService.dismissNotification, [sNotificationId]);
                        } else {
                            Log.error("Notification service - oData dismiss notification failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            reject(oMessage);
                        }
                    });
            });
        };

        /**
         * Gets a callback function that will be called when updated notifications data is available.
         *
         * @param {function} callback The callback function that is registered and called on data update.
         *
         * @public
         */
        this.registerNotificationsUpdateCallback = function (callback) {
            aUpdateNotificationsCallbacks.push(callback);
        };

        /**
         * Gets a callback function that will be called when updated unseen notifications count is available.
         *
         * @param {function} callback The callback function that is registered and called on data update.
         *
         * @public
         */
        this.registerNotificationCountUpdateCallback = function (callback) {
            aUpdateNotificationsCountCallbacks.push(callback);
        };

        /**
         * @returns {boolean} boolean value whether first request was already performed and data was returned.<br>
         *
         * @public
         */
        this.isFirstDataLoaded = function () {
            return bFirstDataLoaded;
        };

        /**
         * @returns {Promise<object>} Resolves with the user settings flags
         * @private
         */
        this.getUserSettingsFlags = async function () {
            try {
                await ushellUtils.promisify(oUserFlagsReadFromPersonalizationPromise);
            } catch (oError) {
                // if reading the personalization fails the default is returned
            }

            return { highPriorityBannerEnabled: bHighPriorityBannerEnabled };
        };

        this.setUserSettingsFlags = function (oFlags) {
            bHighPriorityBannerEnabled = oFlags.highPriorityBannerEnabled;
            this._writeUserSettingsFlagsToPersonalization(oFlags);
        };

        /**
         * @returns {boolean} value indicating whether the Push to Mobile capability is supported by the Notification channel
         *
         * @private
         */
        this._getNotificationSettingsMobileSupport = function () {
            return bNotificationSettingsMobileSupport;
        };

        /**
         * @returns {Array<*>} dismissed notifications
         *
         * @private
         */
        this._getDismissNotifications = function () {
            return aDismissNotifications;
        };

        this.filterDismisssedItems = function (aRecentNotificationsArray, aNotifications) {
            return aRecentNotificationsArray.filter((oRecentItem) => {
                return !aNotifications.some((sDismissItem) => sDismissItem === oRecentItem.originalItemId);
            });
        };

        /**
         * adds an item to the array of dismissed notifications
         * @param {string} sId Notification ID.
         *
         * @private
         */
        this._addDismissNotifications = function (sId) {
            if (aDismissNotifications.indexOf(sId) === -1) {
                aDismissNotifications.push(sId);
            }
        };

        /**
         * initialize array of dismissed notifications
         *
         * @private
         */
        this._initializeDismissNotifications = function () {
            aDismissNotifications = [];
        };

        /**
         * @returns {boolean} value indicating whether the Push to Mobile capability is supported by the Notification channel
         *
         * @private
         */
        this._getNotificationSettingsEmailSupport = function () {
            return bNotificationSettingsEmailSupport;
        };

        this.destroy = function () {
            bOnServiceStop = true;

            // Clear timers
            if (initialReadTimer) {
                clearTimeout(initialReadTimer);
            } else if (webSocketRecoveryTimer) {
                clearTimeout(webSocketRecoveryTimer);
            } else if (pollingTimer) {
                clearTimeout(pollingTimer);
            }

            // Close web socket
            if ((oCurrentMode === oModesEnum.WEB_SOCKET) && oWebSocket) {
                oWebSocket.close();
            }

            // Clear event subscriptions
            EventBus.getInstance().unsubscribe("launchpad", "sessionTimeout", this.destroy, this);
            EventBus.getInstance().unsubscribe("launchpad", "setConnectionToServer",
                this._onSetConnectionToServer, this);
        };

        // ************************************** Service API - End ****************************************
        // *************************************************************************************************

        // *************************************************************************************************
        // ********************************* oData functionality - Begin ***********************************

        /**
         * Fetching the number of notifications that the user hasn't seen yet <br>
         * and announcing the relevant consumers by calling all registered callback functions.<br>
         *
         * This function is similar to _readNotificationsData.
         * In the future the two functions will be sent together in a single batch request, when batch is supported.
         *
         * @returns {Promise} Resolves the unseen notifications count.
         *
         * @private
         */
        this._readUnseenNotificationsCount = function () {
            const oNotificationsService = this;
            const oRequestObject = this._createRequest(this._getRequestURI(oOperationEnum.GET_BADGE_NUMBER));

            return new Promise((resolve, reject) => {
                this.fireODataRead(
                    oRequestObject,
                    (oResult, oResponseData) => {
                        oModel.setProperty("/UnseenCount", oResponseData.data.GetBadgeNumber.Number);
                        oNotificationsService._setNativeIconBadge(oResponseData.data.GetBadgeNumber.Number);
                        resolve(oResponseData.data.GetBadgeNumber.Number);
                    },
                    (oMessage) => {
                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            const oReturnedObject = JSON.parse(oMessage.response.body);
                            oModel.setProperty("/UnseenCount", oReturnedObject.value);
                            oNotificationsService._setNativeIconBadge(oReturnedObject.value);
                            resolve(oReturnedObject.value);
                        } else {
                            Log.error("Notification service - oData read unseen notifications count failed: ", oMessage.message, "sap.ushell.services.NotificationsV2");
                            reject(oMessage);
                        }
                    }
                );
            });
        };

        /**
         * Fetching the number of notifications for user<br>
         * @returns {Promise} Resolves with notifications count.
         */
        this.readNotificationsCount = function () {
            const oRequestObject = this._createRequest(this._getRequestURI(oOperationEnum.GET_NOTIFICATIONS_COUNT));
            return new Promise((resolve, reject) => {
                this.fireODataRead(
                    oRequestObject,
                    (oResult, oResponseData) => resolve(oResponseData.data),
                    (oMessage) => {
                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            const oReturnedObject = JSON.parse(oMessage.response.body);
                            resolve(oReturnedObject.value);
                        } else {
                            Log.error("Notification service - oData read notifications count failed: ", oMessage.message, "sap.ushell.services.NotificationsV2");
                            reject(oMessage);
                        }
                    }
                );
            });
        };

        /**
         * @returns {Promise} Returns promise object that is resolved if Notification settings data is available
         *
         * @private
         */
        this._getNotificationSettingsAvailability = function () {
            return oNotificationSettingsAvailabilityDeferred.promise();
        };

        /**
         * Mark all notifications as seen.<br>
         * the main use-case is when the user navigated to the notification center and sees all the pending notifications.
         * @returns {Promise} Promise that resolves when operation is finished
         *
         * @public
         */
        this.notificationsSeen = function () {
            const oNotificationsService = this;
            const oRequestObject = {
                requestUri: this._getRequestURI(oOperationEnum.RESET_BADGE_NUMBER),
                method: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    DataServiceVersion: sDataServiceVersion,
                    "X-CSRF-Token": sHeaderXcsrfToken
                }
            };

            if (this._isFioriClientMode() === true || this._isPackagedMode() === true) {
                this._setNativeIconBadge(0);
            }

            return new Promise((resolve, reject) => {
                this.fireODataRequest(
                    oRequestObject,
                    resolve,
                    function (oMessage) {
                        if (oNotificationsService._csrfTokenInvalid(oMessage)) {
                            oNotificationsService._invalidCsrfTokenRecovery(resolve, reject, oNotificationsService.notificationsSeen);
                        } else {
                            Log.error("Notification service - oData reset badge number failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            reject(oMessage);
                        }
                    }
                );
            });
        };

        /**
         * Basic notifications data read flow, occurs either on service initialization or on web-socket/polling update event.
         * Includes two read operations:
         *   - Read UnseenNotificationsCount and update consumers
         *   - Read several (i.e. iInitialBufferSize) notification items
         *
         * The two returned promise objects are pushed into an array, and after resolved, the following steps are performed:
         *   - Notifications (unseen) count consumers are updated
         *   - Service model is updated with the read notification objects
         *   - Notifications update consumers are updated
         *
         * @param {boolean} bUpdateConsumers value indicating whether the consumers should be updated
         * @returns {Promise} Resolves if both read actions are successful.
         *
         * @private
         */
        this._readNotificationsData = function (bUpdateConsumers) {
            const oNotificationsService = this;

            this.readNotificationsCount().then((oResponseData) => oModel.setProperty("/NotificationsCount", oResponseData));

            const oReadUnseenCountPromise = this._readUnseenNotificationsCount(bUpdateConsumers).then(() => {
                if (bUpdateConsumers === true) {
                    oNotificationsService._updateNotificationsCountConsumers();
                }
            });

            const oReadNotificationsPromise = this.getNotificationsBufferBySortingType(oOperationEnum.NOTIFICATIONS_BY_DATE_DESCENDING, 0, iInitialBufferSize)
                .then((oResponseData) => {
                    // Measure notification
                    oModel.setProperty("/Notifications", oResponseData);
                    oNotificationsService._notificationAlert(oResponseData);
                    if (bUpdateConsumers === true) {
                        oNotificationsService._updateNotificationsConsumers();
                    }
                });

            return Promise.all([oReadUnseenCountPromise, oReadNotificationsPromise]);
        };

        this._getHeaderXcsrfToken = function () {
            return sHeaderXcsrfToken;
        };

        this._getDataServiceVersion = function () {
            return sDataServiceVersion;
        };

        /**
         * Returns the appropriate URI that should be used in an OData request according to the nature of the request and according to filtering that might be required.
         * The object aRequestURIs is filled with the basic and/or byIntents-filter URI, and is used for maintaining the URIs throughout the session.
         *
         * @param {object} oRequiredURI value form the enumeration oOperationEnum, representing the relevant request
         * @param {object} oArgs additional arguments
         * @returns {string} The URI that should be user in the OData.read call
         *
         * @private
         */
        // eslint-disable-next-line complexity
        this._getRequestURI = function (oRequiredURI, oArgs) {
            const sEncodedConsumedIntents = encodeURI(this._getConsumedIntents(oRequiredURI));
            let sReturnedURI;

            switch (oRequiredURI) {
                // Get notifications
                case oOperationEnum.NOTIFICATIONS:
                    if (aRequestURIs.getNotifications.basic === undefined) {
                        aRequestURIs.getNotifications.basic = oServiceConfig.serviceUrl + "/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false";
                    }
                    if (this._isIntentBasedConsumption()) {
                        if (aRequestURIs.getNotifications.byIntents === undefined) {
                            aRequestURIs.getNotifications.byIntents = aRequestURIs.getNotifications.basic.concat("&intents%20eq%20" + sEncodedConsumedIntents);
                        }
                        return aRequestURIs.getNotifications.byIntents;
                    }
                    return aRequestURIs.getNotifications.basic;
                // Get notifications, grouped by type
                case oOperationEnum.NOTIFICATIONS_BY_TYPE:
                    if (aRequestURIs.getNotificationsByType.basic === undefined) {
                        aRequestURIs.getNotificationsByType.basic = oServiceConfig.serviceUrl + "/Notifications?$expand=Actions,NavigationTargetParams";
                    }
                    if (this._isIntentBasedConsumption()) {
                        if (aRequestURIs.getNotificationsByType.byIntents === undefined) {
                            aRequestURIs.getNotificationsByType.byIntents = aRequestURIs.getNotificationsByType.basic.concat("&$filter=intents%20eq%20" + sEncodedConsumedIntents);
                        }
                        return aRequestURIs.getNotificationsByType.byIntents;
                    }
                    return aRequestURIs.getNotificationsByType.basic;

                // Get notifications group Headers
                case oOperationEnum.NOTIFICATIONS_GROUP_HEADERS:
                    if (aRequestURIs.getNotificationsGroupHeaders.basic === undefined) {
                        aRequestURIs.getNotificationsGroupHeaders.basic = oServiceConfig.serviceUrl + "/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20true";
                    }
                    if (this._isIntentBasedConsumption()) {
                        if (aRequestURIs.getNotificationsGroupHeaders.byIntents === undefined) {
                            aRequestURIs.getNotificationsGroupHeaders.byIntents = aRequestURIs.getNotificationsGroupHeaders.basic.concat("&intents%20eq%20" + sEncodedConsumedIntents);
                        }
                        return aRequestURIs.getNotificationsGroupHeaders.byIntents;
                    }
                    return aRequestURIs.getNotificationsGroupHeaders.basic;

                // Get notifications in group
                case oOperationEnum.NOTIFICATIONS_IN_GROUP:
                    sReturnedURI = oServiceConfig.serviceUrl + "/Notifications?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt desc&$filter=IsGroupHeader eq false and ParentId eq "
                        + oArgs.group + "&$skip=" + oArgs.skip + "&$top=" + oArgs.top;

                    if (this._isIntentBasedConsumption() === true) {
                        sReturnedURI = sReturnedURI.concat("&intents%20eq%20" + sEncodedConsumedIntents);
                    }
                    break;

                // Get badge number
                case oOperationEnum.GET_BADGE_NUMBER:
                    if (aRequestURIs.getBadgeNumber.basic === undefined) {
                        aRequestURIs.getBadgeNumber.basic = oServiceConfig.serviceUrl + "/GetBadgeNumber()";
                    }
                    if (this._isIntentBasedConsumption()) {
                        if (aRequestURIs.getBadgeNumber.byIntents === undefined) {
                            aRequestURIs.getBadgeNumber.byIntents = oServiceConfig.serviceUrl + "/GetBadgeCountByIntent(" + sEncodedConsumedIntents + ")";
                        }
                        return aRequestURIs.getBadgeNumber.byIntents;
                    }
                    return aRequestURIs.getBadgeNumber.basic;

                // Get Notification Count
                case oOperationEnum.GET_NOTIFICATIONS_COUNT:
                    if (aRequestURIs.getNotificationCount.basic === undefined) {
                        aRequestURIs.getNotificationCount.basic = oServiceConfig.serviceUrl + "/Notifications/$count";
                    }
                    return aRequestURIs.getNotificationCount.basic;

                // Reset badge number (i.e. mark all notifications as "seen")
                case oOperationEnum.RESET_BADGE_NUMBER:
                    if (aRequestURIs.resetBadgeNumber.basic === undefined) {
                        aRequestURIs.resetBadgeNumber.basic = oServiceConfig.serviceUrl + "/ResetBadgeNumber";
                    }
                    return aRequestURIs.resetBadgeNumber.basic;

                // Get user settings
                case oOperationEnum.GET_SETTINGS:
                    if (aRequestURIs.getNotificationTypesSettings.basic === undefined) {
                        aRequestURIs.getNotificationTypesSettings.basic = oServiceConfig.serviceUrl + "/NotificationTypePersonalizationSet";
                    }
                    return aRequestURIs.getNotificationTypesSettings.basic;

                case oOperationEnum.GET_MOBILE_SUPPORT_SETTINGS:
                    if (aRequestURIs.getMobileSupportSettings.basic === undefined) {
                        aRequestURIs.getMobileSupportSettings.basic = oServiceConfig.serviceUrl + "/Channels(ChannelId='SAP_SMP')";
                    }
                    return aRequestURIs.getMobileSupportSettings.basic;

                case oOperationEnum.GET_EMAIL_SUPPORT_SETTINGS:
                    if (aRequestURIs.getEmailSupportSettings.basic === undefined) {
                        aRequestURIs.getEmailSupportSettings.basic = oServiceConfig.serviceUrl + "/Channels(ChannelId='SAP_EMAIL')";
                    }
                    return aRequestURIs.getEmailSupportSettings.basic;

                case oOperationEnum.VALIDATE_WEBSOCKET_CHANNEL:
                    if (aRequestURIs.getWebSocketValidity.basic === undefined) {
                        aRequestURIs.getWebSocketValidity.basic = oServiceConfig.serviceUrl + "/Channels('SAP_WEBSOCKET')";
                    }
                    return aRequestURIs.getWebSocketValidity.basic;

                // Get a buffer of notifications (using $skip, $top and $orderby options) sorted by date in descending order
                case oOperationEnum.NOTIFICATIONS_BY_DATE_DESCENDING:
                    sReturnedURI = oServiceConfig.serviceUrl + "/Notifications?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt%20desc&$filter=IsGroupHeader%20eq%20false&$skip="
                        + oArgs.skip + "&$top=" + oArgs.top;
                    if (this._isIntentBasedConsumption() === true) {
                        sReturnedURI = sReturnedURI.concat("&intents%20eq%20" + sEncodedConsumedIntents);
                    }
                    break;

                // Get a buffer of notifications (using $skip, $top and $orderby options) sorted by priority in descending order
                case oOperationEnum.NOTIFICATIONS_BY_PRIORITY_DESCENDING:
                    sReturnedURI = oServiceConfig.serviceUrl + "/Notifications?$expand=Actions,NavigationTargetParams&$orderby=Priority%20desc&$filter=IsGroupHeader%20eq%20false&$skip="
                        + oArgs.skip + "&$top=" + oArgs.top;
                    if (this._isIntentBasedConsumption() === true) {
                        sReturnedURI = sReturnedURI.concat("&intents%20eq%20" + sEncodedConsumedIntents);
                    }
                    break;

                default:
                    sReturnedURI = "";
            }
            return sReturnedURI;
        };

        /**
         * @returns {Promise} Promise object that is resolved with the settings from the sever
         *
         * @private
         */
        this.readSettings = function () {
            const oRequestObject = this._createRequest(this._getRequestURI(oOperationEnum.GET_SETTINGS));

            return new Promise((resolve, reject) => {
                this.fireODataRequest(
                    oRequestObject,
                    (oResult) => resolve(oResult.results),
                    (oMessage) => {
                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            resolve(oMessage.response.body);
                        } else {
                            Log.error("Notification service - oData get settings failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            reject(oMessage);
                        }
                    });
            });
        };

        /**
         * Verifying whether the "push notifications to mobile" feature is supported.
         *
         * @returns {Promise} Always resolves even if the request failed.<br>
         *   In case of failure - the response property successStatus gets the value <code>false</code>
         *
         * @private
         */
        this._readMobileSettingsFromServer = function () {
            return this._readChannelSettingsFromServer(oOperationEnum.GET_MOBILE_SUPPORT_SETTINGS);
        };

        /**
         * Verifying whether the "push notifications to mobile" feature is supported.
         *
         * @returns {Promise} Which always resolves if the request failed.<br>
         *   In case of failure - the response property successStatus gets the value <code>false</code>
         *
         * @private
         */
        this._readEmailSettingsFromServer = function () {
            return this._readChannelSettingsFromServer(oOperationEnum.GET_EMAIL_SUPPORT_SETTINGS);
        };

        this._readChannelSettingsFromServer = function (operation) {
            const sRequestUrl = this._getRequestURI(operation);
            const oRequestObject = this._createRequest(sRequestUrl);
            let oResponseObject;
            let sUpdatedResponseString;

            return new Promise((resolve) => {
                this.fireODataRequest(
                    oRequestObject,
                    (oResult) => {
                        if (typeof (oResult.results) === "string") {
                            oResponseObject = JSON.parse(oResult.results);
                            oResponseObject.successStatus = true;
                            sUpdatedResponseString = JSON.stringify(oResponseObject);
                            resolve(sUpdatedResponseString);
                        } else {
                            oResult.results.successStatus = true;
                            resolve(oResult.results);
                        }
                    },
                    (oMessage) => {
                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            oResponseObject = JSON.parse(oMessage.response.body);
                            oResponseObject.successStatus = true;
                            sUpdatedResponseString = JSON.stringify(oResponseObject);
                            resolve(sUpdatedResponseString);
                        } else {
                            Log.error("Notification service - oData get settings failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            resolve(JSON.stringify({ successStatus: false }));
                        }
                    }
                );
            });
        };

        /**
         * Verifying whether the WebSocket is active (while it is already opened)
         *
         * @returns {Promise} Which always resolves even if the request fails.<br>
         *   The actual response is returned as the done function's boolean parameter:<br>
         *   In case of active WebSocket - the value <code>true</code> is returned, and <code>false</code> otherwise.
         *
         * @private
         */
        this._checkWebSocketActivity = function () {
            const oRequestObject = this._createRequest(this._getRequestURI(oOperationEnum.VALIDATE_WEBSOCKET_CHANNEL));
            return new Promise((resolve) => {
                this.fireODataRequest(
                    oRequestObject,
                    (oResult) => {
                        if (typeof (oResult.results) === "string") {
                            const oResponseObject = JSON.parse(oResult.results);
                            resolve(oResponseObject.IsActive);
                        } else {
                            resolve(false);
                        }
                    },
                    (oMessage) => {
                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            const oResponseObject = JSON.parse(oMessage.response.body);
                            resolve(oResponseObject.IsActive);
                        } else {
                            Log.error("Notification service - oData get settings failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            resolve(false);
                        }
                    });
            });
        };

        /**
         * @param {object} oEntry Settings entry to be saved
         * @returns {Promise} Save settings promise
         *
         * @private
         */
        this.saveSettingsEntry = function (oEntry) {
            const oNotificationsService = this;
            const sSetSettingsUrl = this._getRequestURI(oOperationEnum.GET_SETTINGS) + "(NotificationTypeId=" + oEntry.NotificationTypeId + ")";
            const oRequestObject = {
                requestUri: sSetSettingsUrl,
                method: "PUT",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    DataServiceVersion: sDataServiceVersion,
                    "X-CSRF-Token": sHeaderXcsrfToken
                }
            };

            // make sure to always send the entire set of properties to the backend
            oRequestObject.data = JSON.parse(JSON.stringify(oEntry));
            oRequestObject.data["@odata.context"] = "$metadata#NotificationTypePersonalizationSet/$entity";

            return new Promise((resolve, reject) => {
                this.fireODataRequest(
                    oRequestObject,
                    resolve,
                    (oMessage) => {
                        if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                            resolve(oMessage.response.body);
                        } else if (oNotificationsService._csrfTokenInvalid(oMessage) && (bInvalidCsrfTokenRecoveryMode === false)) {
                            oNotificationsService._invalidCsrfTokenRecovery(resolve, reject, oNotificationsService.saveSettingsEntry, [oEntry]);
                        } else {
                            Log.error("Notification service - oData set settings entry failed: ", oMessage, "sap.ushell.services.NotificationsV2");
                            reject(oMessage);
                        }
                    });
            });
        };

        // ********************************** oData functionality - End ************************************
        // *************************************************************************************************

        this._updateNotificationsConsumers = function () {
            aUpdateNotificationsCallbacks.forEach((callback) => callback());
        };

        this._updateNotificationsCountConsumers = function () {
            aUpdateNotificationsCountCallbacks.forEach((callback) => callback());
        };

        this._updateAllConsumers = function () {
            this._updateNotificationsConsumers();
            this._updateNotificationsCountConsumers();
        };

        this._getModel = function () {
            return oModel;
        };

        //*************************************************************************************************
        //***********************  Handle Notifications consumption / modes - Begin ***********************

        this._getMode = function () {
            return oCurrentMode;
        };

        /**
         * There are four possible modes of working of Notification service, defined by oModesEnum.
         * The following functions (i.e. steps) are executes sequentially, from _setWorkingMode (step 1) downwards
         * in order to find what is the relevant working mode for notification service and to activate it.
         */

        /**
         * Starting the process of defining the mode in which notifications service consume notifications data.
         * Step 1. Handle packagedApp mode
         *
         * @private
         */
        this._setWorkingMode = function () {
            let aConsumedIntentsFromConfig;

            // check service configuration for ConsumedIntents enabling flag and data
            if (oServiceConfig.intentBasedConsumption === true) {
                aConsumedIntents = this._getIntentsFromConfiguration(oServiceConfig.consumedIntents);
                if (aConsumedIntents.length > 0) {
                    // First setting of the flag is from service configuration
                    bIntentBasedConsumption = true;
                }
            }

            // Check if this is packagedApp use-case
            if (this._isPackagedMode()) {
                oCurrentMode = oModesEnum.PACKAGED_APP;

                // Consumed intents are read from PackagedApp configuration, if exist
                aConsumedIntentsFromConfig = this._getIntentsFromConfiguration(window.fiori_client_appConfig.applications);
                if (aConsumedIntentsFromConfig.length > 0) {
                    aConsumedIntents = aConsumedIntentsFromConfig;
                }

                if (aConsumedIntents.length > 0) {
                    // Second setting of the flag (to true) is done in case of PackagedApp mode and if any intents were configured
                    bIntentBasedConsumption = true;
                }

                this._registerForPush();
                this._readNotificationsData(true);

                this._setNativeIconBadgeWithDelay();

                return;
            }

            // Call step 2: Perform the first oData read request
            this._performFirstRead();
        };

        /**
         * Step 2. Issue the initial oData call for getting notification data, then wait until it is possible to check if we're in Fiori Client mode:
         * The execution of the _isFioriClientMode check must be delayed by 6000ms for initial loading since it relies on the flag sap.FioriClient that is set by FioriClient
         *
         * @private
         */
        this._performFirstRead = function () {
            const oNotificationsService = this;

            this._readNotificationsData(true).then(() => {
                // Calculate time left until Fiori Client mode can be checked
                const tFioriClientRemainingDelay = oNotificationsService._getFioriClientRemainingDelay();
                if (tFioriClientRemainingDelay <= 0) {
                    oNotificationsService._fioriClientStep();
                } else {
                    initialReadTimer = setTimeout(function () {
                        oNotificationsService._fioriClientStep();
                    }, tFioriClientRemainingDelay);
                }
                bFirstDataLoaded = true;
            }).catch((sMsg) => {
                Log.error("Notifications oData read failed. Error: " + sMsg);
            });
        };

        /**
         * Step 3. waiting the delay necessary for Fiori Client - Check if this is indeed Fiori Client mode
         * If so - initialize Fiori Client mode. If not - go to the nest step (webSocket)
         *
         * @private
         */
        this._fioriClientStep = function () {
            if (this._isFioriClientMode()) {
                oCurrentMode = oModesEnum.FIORI_CLIENT;
                this._addPushNotificationHandler();

                this.getUnseenNotificationsCount()
                    .then(function (iBadgeValue) {
                        this._setNativeIconBadge(iBadgeValue, () => { });
                    }.bind(this))
                    .catch(() => { });
            } else {
                this._webSocketStep();
            }
        };

        /**
         * Step 4. WebSocket step
         *
         * @private
         */
        this._webSocketStep = function () {
            oCurrentMode = oModesEnum.WEB_SOCKET;
            this._establishWebSocketConnection();
        };

        /**
         * Step 5. WebSocket recovery step
         * Called on WebSocket onClose event.
         * In this case there is one additional trial to establish the WebSocket connection.
         * If the additional attempt also fails - move to polling
         *
         * @private
         */
        this._webSocketRecoveryStep = function () {
            if (bWebSocketRecoveryAttempted === false) {
                bWebSocketRecoveryAttempted = true;
                webSocketRecoveryTimer = window.setTimeout(this._webSocketStep.bind(this), tWebSocketRecoveryPeriod);
            } else {
                // Since the first request for notifications data was already issued -
                // the first polling request is delayed by (iPollingInterval * 1000) seconds
                this._activatePollingAfterInterval();
            }
        };

        this._activatePollingAfterInterval = function () {
            iPollingInterval = oServiceConfig.pollingIntervalInSeconds || I_DEFAULT_POLLING_INTERVAL;

            window.clearTimeout(pollingTimer);
            pollingTimer = window.setTimeout(this._activatePolling.bind(this), ushellUtils.sanitizeTimeoutDelay(iPollingInterval * 1000));
        };

        /**
         * Step 6. Polling
         *
         * @private
         */
        this._activatePolling = function () {
            iPollingInterval = oServiceConfig.pollingIntervalInSeconds || I_DEFAULT_POLLING_INTERVAL;

            oCurrentMode = oModesEnum.POLLING;
            this._readNotificationsData(true);
            // Call again after a delay
            window.clearTimeout(pollingTimer);
            iPollingInterval = window.setTimeout(this._activatePolling.bind(this, iPollingInterval, false), ushellUtils.sanitizeTimeoutDelay(iPollingInterval * 1000));
        };

        this._deactivatePolling = function () {
            if (oCurrentMode === oModesEnum.POLLING) {
                window.clearTimeout(iPollingInterval);
            }
        };

        this._formatAsDate = function (sUnformatted) {
            return new Date(sUnformatted);
        };

        this._notificationAlert = function (results) {
            // If alerts/banners for HIGH priority notifications are disabled by the user - then return
            if (bHighPriorityBannerEnabled === false) {
                return;
            }

            const aNewNotifications = [];
            let nextLastNotificationDate = 0;

            for (const oNotification in results) {
                if (this.lastNotificationDate && this._formatAsDate(results[oNotification].CreatedAt) > this.lastNotificationDate) {
                    if (results[oNotification].Priority === "HIGH") {
                        aNewNotifications.push(results[oNotification]);
                    }
                }
                // get the last notification date
                if (nextLastNotificationDate < this._formatAsDate(results[oNotification].CreatedAt)) {
                    nextLastNotificationDate = this._formatAsDate(results[oNotification].CreatedAt);
                }
            }
            if (this.lastNotificationDate && aNewNotifications.length > 0) {
                EventBus.getInstance().publish("sap.ushell.services.Notifications", "onNewNotifications", aNewNotifications);
            }
            this.lastNotificationDate = nextLastNotificationDate;
        };

        /**
         * Returning the time, in milliseconds, left until the end of FioriClient waiting period.
         * The required period is represented by tFioriClientInitializationPeriod, and we reduce the time passed from service initialization until now
         * @returns {int} Remaining delay
         *
         * @private
         */
        this._getFioriClientRemainingDelay = function () {
            return tFioriClientInitializationPeriod - (new Date() - tInitializationTimestamp);
        };

        /**
         * Establishing a WebSocket connection for push updates
         *
         * @private
         */
        this._establishWebSocketConnection = function () {
            const oNotificationsService = this;
            let bDeliberateClose = false;

            try {
                // Init WebSocket connection
                oWebSocket = this._getWebSocketObjectObject(oServiceConfig.webSocketUrl || S_DEFAULT_WEBSOCKET_URL, [SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10]);

                oWebSocket.attachMessage(this, function (oMessage/*, oData*/) {
                    const oPcpFields = oMessage.getParameter("pcpFields");
                    if ((oPcpFields) && (oPcpFields.Command) && (oPcpFields.Command === "Notification")) {
                        // Receive "pings" for Notification EntitySet
                        // Another optional "ping" would be oPcpFields.Command === "Badge" for new Badge Number, but is currently not supported.
                        oNotificationsService._readNotificationsData(true);
                    }
                });

                oWebSocket.attachOpen(this, function () {
                    oNotificationsService._checkWebSocketActivity().then((bIsActive) => {
                        // In case when bIsActive is false, the webSocket is not active although the connection is opened.
                        // in this case we should close the WebSocket connection and switch to polling step.
                        if (!bIsActive) {
                            bDeliberateClose = true;
                            oWebSocket.close();
                            oNotificationsService._activatePollingAfterInterval();
                        }
                    });
                    Log.info("Notifications UShell service WebSocket: webSocket connection opened");
                });

                oWebSocket.attachClose(this, function (oEvent) {
                    Log.warning("Notifications UShell service WebSocket: attachClose called with code: " + oEvent.mParameters.code + " and reason: " + oEvent.mParameters.reason);
                    if ((!bOnServiceStop) && (!bDeliberateClose)) {
                        oNotificationsService._webSocketRecoveryStep();
                    }
                });

                // attachError is not being handled since each attachError is followed by a call to attachClose (...which includes handling)
                oWebSocket.attachError(this, function () {
                    Log.warning("Notifications UShell service WebSocket: attachError called!");
                });
            } catch (e) {
                Log.error("Exception occurred while creating new sap.ui.core.ws.SapPcpWebSocket. Message: " + e.message);
            }
        };

        // *********************** Handle Notifications consumption / modes - End **************************
        // *************************************************************************************************

        // *************************************************************************************************
        // **************** Helper functions for Fiori client and PackagedApp mode - Begin *****************

        this._isFioriClientMode = function () {
            return !(sap.FioriClient === undefined);
        };

        /**
         * Helper function for Packaged App mode
         *
         * @private
         * @returns {boolean} Returns true if the app is running in packaged mode
         */
        this._isPackagedMode = function () {
            return (window.fiori_client_appConfig && window.fiori_client_appConfig.prepackaged === true);
        };

        this._setNativeIconBadge = function (iBadgeValue) {
            if (sap.Push && sap.Push.setBadgeNumber) {
                sap.Push.setBadgeNumber(iBadgeValue, () => { });
            }
        };

        this._setNativeIconBadgeWithDelay = function () {
            setTimeout(function () {
                this.getUnseenNotificationsCount().then(function (iBadgeValue) {
                    this._setNativeIconBadge(iBadgeValue);
                }.bind(this))
                    .catch(() => { });
            }.bind(this), 4000);
        };

        this._getIntentsFromConfiguration = function (aInput) {
            const aTempConsumedIntents = [];
            if (aInput && aInput.length > 0) {
                let sTempIntent;

                for (let index = 0; index < aInput.length; index++) {
                    sTempIntent = aInput[index].intent;
                    aTempConsumedIntents.push(sTempIntent);
                }
            }
            return aTempConsumedIntents;
        };

        this._handlePushedNotification = function (oNotificationData) {
            let sSemanticObject;
            let sAction;
            let oParameters;
            let aParameters = [];

            if (oNotificationData !== undefined) {
                // Either oNotificationData.additionalData is not defined
                // OR oNotificationData.additionalData has the value "true" (foreground use-case)
                if ((oNotificationData.additionalData === undefined) || (oNotificationData.additionalData.foreground === true)) {
                    // The given notification object is ignored, and we relate to this use-case as a "ping",
                    // telling us that notifications data (in the Notification Center) was changed, hence the call to _readNotificationsData
                    this._readNotificationsData(true);

                    // Background use-case (oNotificationData.additionalData is defined and equals "false")
                } else {
                    // Read the semantic object, the action and the navigation parameters from the additionalData part of the notification,
                    // or as a fallback - from the notification item's data

                    if (oNotificationData.additionalData && oNotificationData.additionalData.NavigationTargetObject) {
                        sSemanticObject = oNotificationData.additionalData.NavigationTargetObject;
                    } else {
                        sSemanticObject = oNotificationData.NavigationTargetObject;
                    }

                    if (oNotificationData.additionalData && oNotificationData.additionalData.NavigationTargetAction) {
                        sAction = oNotificationData.additionalData.NavigationTargetAction;
                    } else {
                        sAction = oNotificationData.NavigationTargetAction;
                    }

                    if (oNotificationData.additionalData && oNotificationData.additionalData.NavigationTargetParam) {
                        oParameters = oNotificationData.additionalData.NavigationTargetParam;
                    } else {
                        oParameters = oNotificationData.NavigationTargetParam;
                    }

                    if (oParameters) {
                        if (typeof oParameters === "string" || oParameters instanceof String) {
                            aParameters[0] = oParameters;
                        } else if (Array.isArray(oParameters) === true) {
                            aParameters = oParameters;
                        }
                    }

                    const sNotificationId = oNotificationData.NotificationId;

                    if (sSemanticObject && sAction) {
                        // Perform a navigation action according to the pushed notification's intent
                        ushellUtils.toExternalWithParameters(sSemanticObject, sAction, aParameters);
                    }

                    this.markRead(sNotificationId);

                    this._readNotificationsData(true);
                }
            }
        };

        this._registerForPush = function () {
            if (sap.Push) {
                sap.Push.initPush(this._handlePushedNotification.bind(this));
            }
        };

        /**
         * For Fiori Client use case on mobile platform.
         * This function registers the callback this._handlePushedNotification for the deviceready event
         *
         * @private
         */
        this._addPushNotificationHandler = function () {
            document.addEventListener("deviceready", this._registerForPush.bind(this), false);
        };

        this._isIntentBasedConsumption = function () {
            return bIntentBasedConsumption;
        };

        /**
         * Creates and returns the intents filter string of an OData request
         * @param {string} oRequestURI URI of the OData request
         * For example: &NavigationIntent%20eq%20%27Action-toappstatesample%27%20or%20NavigationIntent%20eq%20%27Action-toappnavsample%27
         * @returns {string} returns the intents filter string
         *
         * @private
         */
        this._getConsumedIntents = function (oRequestURI) {
            let sConsumedIntents = "";

            if (!this._isIntentBasedConsumption()) {
                return sConsumedIntents;
            }

            if (aConsumedIntents.length > 0) {
                // If it is not GetBadgeNumber use-case then the intents filter string should start with "&"
                if (oRequestURI !== oOperationEnum.GET_BADGE_NUMBER) {
                    sConsumedIntents = "&";
                }

                for (let index = 0; index < aConsumedIntents.length; index++) {
                    // If it is GetBadgeNumber use case then the intent are comma separated
                    if (oRequestURI === oOperationEnum.GET_BADGE_NUMBER) {
                        if (index === 0) {
                            sConsumedIntents = aConsumedIntents[index];
                        } else {
                            sConsumedIntents = sConsumedIntents + "," + aConsumedIntents[index];
                        }
                    } else {
                        sConsumedIntents = sConsumedIntents + "NavigationIntent%20eq%20%27" + aConsumedIntents[index] + "%27";
                    }
                }
            }
            return sConsumedIntents;
        };

        this._revalidateCsrfToken = function () {
            sHeaderXcsrfToken = "fetch";
            bCsrfDataSet = false;

            return this.getNotificationsBufferBySortingType(oOperationEnum.NOTIFICATIONS_BY_DATE_DESCENDING, 0, 1);
        };

        this._csrfTokenInvalid = function (oMessage) {
            const oResponse = oMessage.response;
            const bAuthorizationError = oResponse && oResponse.statusCode === 403;
            const sCSRFTokenHeader = oResponse && oResponse.headers["x-csrf-token"] || "";
            // There have been instances of services returning "Required" as well as "required",
            // therefore the method toLowerCase is used.
            const bCSRFTokenRequired = sCSRFTokenHeader.toLowerCase() === "required";
            return bAuthorizationError && bCSRFTokenRequired;
        };

        /**
         * Called in case that the CSRF token becomes invalid during the session.
         *
         * This problem (i.e., invalid CSRF token) is found when a POST oData call fails (e.g, markRead).
         * in such a case this function is called in order to perform the recovery flow.
         *
         * The recovery flow includes two main steps:
         *   1. Obtaining the new/valid CSRF token from the notification channel
         *   2. Calling the function that failed (with the same parameters)
         *   3. resolving/rejecting the deferred object of the first function call (the one that failed because the token became invalid) in order to continue with the original flow
         *
         * This function doesn't return anything, instead it calls the provided resolve or reject callbacks
         *
         * @param {function} resolve The resolve callback of the first function call
         * @param {function} reject The reject callback of the first function call
         * @param {function} fnFailedFunction The function that failed (e.g., markRead)
         * @param {Array} aArgsArray The arguments array of the function that failed
         *
         * @private
         */
        this._invalidCsrfTokenRecovery = function (resolve, reject, fnFailedFunction, aArgsArray) {
            const oNotificationsService = this;

            bInvalidCsrfTokenRecoveryMode = true;

            // Getting the new/valid CSRF token
            this._revalidateCsrfToken().then(() => {
                // Call the failed function (with the same parameters)
                fnFailedFunction.apply(oNotificationsService, aArgsArray)
                    .then(resolve)
                    .catch((e) => {
                        if (e.response && e.response.statusCode === 200 && e.response.body) {
                            resolve(e.response.body);
                        } else {
                            reject(e);
                        }
                    })
                    .finally(() => {
                        bInvalidCsrfTokenRecoveryMode = false;
                    });
            }).catch((e) => {
                bInvalidCsrfTokenRecoveryMode = false;
                Log.error("Notification service - oData markRead failed: ", e.message, "sap.ushell.services.NotificationsV2");
                reject(e);
            });
        };

        // **************** Helper functions for Fiori client and PackagedApp mode - End *****************
        // ***********************************************************************************************

        this._getWebSocketObjectObject = function (sWebSocketUrl, aVersionProtocol) {
            return new SapPcpWebSocket(sWebSocketUrl, aVersionProtocol);
        };

        this.getOperationEnum = function () {
            return oOperationEnum;
        };

        /**
         * Read user settings flags from the personalization and update the variable bHighPriorityBannerEnabled.
         * If the data does not yet exists in the personalization,
         * write the default value of bHighPriorityBannerEnabled to the personalization
         *
         * @private
         */
        this._readUserSettingsFlagsFromPersonalization = function () {
            const oNotificationsService = this;
            this._getUserSettingsPersonalizer()
                .then((oPersonalizer) => {
                    oPersonalizer.getPersData()
                        .then((oFlagsData) => {
                            if (oFlagsData === undefined) {
                                oNotificationsService._writeUserSettingsFlagsToPersonalization({
                                    highPriorityBannerEnabled: bHighPriorityBannerEnabled
                                });
                            } else {
                                bHighPriorityBannerEnabled = oFlagsData.highPriorityBannerEnabled;
                            }
                            oUserFlagsReadFromPersonalizationDeferred.resolve();
                        })
                        .catch(() => {
                            Log.error("Reading User Settings flags from Personalization service failed");
                            oUserFlagsReadFromPersonalizationDeferred.reject();
                        });
                })
                .catch((error) => {
                    Log.error("Personalization service does not work:");
                    Log.error(error.name + ": " + error.message);
                    Log.error("Reading User Settings flags from Personalization service failed");
                });
        };

        /**
         * Write/save user settings flags to the personalization.
         * The saved data consists of the user's show high-priority notifications alerts flag value.
         * @param {object} oFlags The flags to be saved
         * @returns {Promise} Promise object that is resolved when the data is saved
         *
         * @private
         */
        this._writeUserSettingsFlagsToPersonalization = function (oFlags) {
            return this._getUserSettingsPersonalizer()
                .then((oPersonalizer) => oPersonalizer.setPersData(oFlags))
                .catch((error) => {
                    Log.error("Personalization service does not work:");
                    Log.error(error.name + ": " + error.message);
                });
        };

        this._getUserSettingsPersonalizer = function () {
            if (!this.oUserSettingsPersonalizerPromise) {
                this.oUserSettingsPersonalizerPromise = Container.getServiceAsync("PersonalizationV2")
                    .then((PersonalizationService) => {
                        const oScope = {
                            keyCategory: PersonalizationService.KeyCategory.FIXED_KEY,
                            writeFrequency: PersonalizationService.WriteFrequency.LOW,
                            clientStorageAllowed: true
                        };

                        const oPersId = {
                            container: "sap.ushell.services.Notifications",
                            item: "userSettingsData"
                        };

                        return PersonalizationService.getPersonalizer(oPersId, oScope);
                    });
            }

            return this.oUserSettingsPersonalizerPromise;
        };

        this._updateCSRF = function (oResponseData) {
            if ((bCsrfDataSet === true) || (oResponseData.headers === undefined)) {
                return;
            }
            if (this._getHeaderXcsrfToken() === "fetch") {
                sHeaderXcsrfToken = oResponseData.headers["x-csrf-token"] || oResponseData.headers["X-CSRF-Token"] || oResponseData.headers["X-Csrf-Token"] || "fetch";
            }
            if (!this._getDataServiceVersion()) {
                sDataServiceVersion = oResponseData.headers.DataServiceVersion || oResponseData.headers["odata-version"];
            }
            bCsrfDataSet = true;
        };

        /**
         * Handles all the required steps in order to initialize Notification Settings UI
         *
         * Issues two calls to the Notifications channel backend system in order to check whether settings feature and Push to Mobile features are supported
         *
         * @private
         */
        this._userSettingInitialization = function () {
            // Contains three boolean flags:
            //   - settingsAvailable: Is the settings feature supported by the notification channel backend system
            //   - mobileAvailable: Is the "push to mobile" feature supported by the notification channel backend system
            //   - emailAvailable: Is the "send email" feature supported by the notification channel backend system
            const oSettingsStatus = {
                settingsAvailable: false,
                mobileAvailable: false,
                emailAvailable: false
            };

            // Read the part of user settings data that is kept in personalization service
            this._readUserSettingsFlagsFromPersonalization();

            // 1st asynchronous call: Get setting data from the backend, for the purpose of verifying that the feature is supported
            const oSettingsPromise = this.readSettings();
            // 2nd asynchronous call: verify Push To Mobile capability
            const oMobileSettingsPromise = this._readMobileSettingsFromServer();
            const oEmailSettingsPromise = this._readEmailSettingsFromServer();

            const aPromises = [oSettingsPromise, oMobileSettingsPromise, oEmailSettingsPromise];

            oSettingsPromise.then(() => {
                // Notification setting supported
                oSettingsStatus.settingsAvailable = true;
            }).catch(() => {
                Log.warning("User settings for the Notification service are not available.");
                oNotificationSettingsAvailabilityDeferred.promise().catch(() => { });
                oNotificationSettingsAvailabilityDeferred.reject();
            });

            oMobileSettingsPromise.then((oResult) => {
                const oResponseObject = JSON.parse(oResult);
                // Push to Mobile validation returned
                if (oResponseObject.successStatus) {
                    bNotificationSettingsMobileSupport = oResult ? oResponseObject.IsActive : false;
                    oSettingsStatus.mobileAvailable = bNotificationSettingsMobileSupport;
                } else {
                    bNotificationSettingsMobileSupport = false;
                    oSettingsStatus.mobileAvailable = false;
                }
            }).catch(() => {
                Log.warning("Mobile settings for the Notification service are not available.");
                bNotificationSettingsMobileSupport = false;
                oSettingsStatus.mobileAvailable = false;
            });

            oEmailSettingsPromise.then((oResult) => {
                const oResponseObject = JSON.parse(oResult);
                if (oResponseObject.successStatus) {
                    bNotificationSettingsEmailSupport = oResult ? oResponseObject.IsActive : false;
                    oSettingsStatus.emailAvailable = bNotificationSettingsEmailSupport;
                } else {
                    bNotificationSettingsEmailSupport = false;
                    oSettingsStatus.emailAvailable = false;
                }
            }).catch(() => {
                Log.warning("Email settings for the Notification service are not available.");
                bNotificationSettingsEmailSupport = false;
                oSettingsStatus.emailAvailable = false;
            });

            // Resolve the deferred object on which the setting UI depends after the two OData calls returned, no matter if they were successful or not
            Promise.all(aPromises).then(() => {
                // After both calls returned - the deferred object (on which the rendering of Notification Settings UI depends) is resolved
                oNotificationSettingsAvailabilityDeferred.resolve(oSettingsStatus);
            }).catch(() => Log.warning("Settings for the Notification service are not loaded completely."));
        };

        /**
         * Used to close all notification connection. In order to resume connection use _resumeConnection method
         *
         * @private
         */
        this._closeConnection = function () {
            if (!bOnServiceStop) {
                if (oCurrentMode === oModesEnum.WEB_SOCKET && oWebSocket) {
                    oWebSocket.close();
                    bOnServiceStop = true;
                }
                if (oCurrentMode === oModesEnum.POLLING && pollingTimer) {
                    window.clearTimeout(pollingTimer);
                    bOnServiceStop = true;
                }
            }
        };

        /**
         * Used to open closed notification connection. Firstly, try to re-establish the websocket connection.
         * If the websocket connection can not be established, the polling start automatically after failed attempt
         *
         * @private
         */
        this._resumeConnection = function () {
            if (bOnServiceStop) {
                bOnServiceStop = false;
                this._webSocketStep();
            }
        };

        /**
         * @param {object} response HTTP response from the ODATA request
         * @returns {object|false} The parsed response or false in case the response was not parsable
         * @private
         */
        this._parseJSON = function (response) {
            try {
                return JSON.parse(response);
            } catch (error) {
                this._deactivatePolling();
                return false;
            }
        };
    }

    Notifications.hasNoAdapter = true;
    return Notifications;
}, true /* bExport */);

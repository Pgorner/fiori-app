// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/CustomListItem",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/ui/core/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/StaticArea",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/utils"
], function (
    Log,
    CustomListItem,
    mobileLibrary,
    MessageToast,
    Text,
    VBox,
    coreLibrary,
    Controller,
    StaticArea,
    Device,
    JSONModel,
    jQuery,
    Container,
    resources,
    ushellUtils
) {
    "use strict";

    // shortcut for sap.ui.core.Priority
    const Priority = coreLibrary.Priority;

    // shortcut for sap.m.ListType
    const ListType = mobileLibrary.ListType;

    // shortcut for sap.m.FlexAlignItems
    const FlexAlignItems = mobileLibrary.FlexAlignItems;

    async function _errorMessage (sText) {
        const oMessageService = await Container.getServiceAsync("MessageInternal");
        oMessageService.error(sText);
    }

    return Controller.extend("sap.ushell.components.shell.Notifications.Notifications", {
        oPagingConfiguration: {
            MAX_NOTIFICATION_ITEMS_DESKTOP: 400,
            MAX_NOTIFICATION_ITEMS_MOBILE: 100,
            MIN_NOTIFICATION_ITEMS_PER_BUFFER: 15,
            // Approximate height of notification item according to the device
            NOTIFICATION_ITEM_HEIGHT: (Device.system.phone || Device.system.tablet) ? 130 : 100,
            // Approximate height of the area above the notifications list
            TAB_BAR_HEIGHT: 100
        },

        /**
         * Initializing Notifications view/controller with ByDate/descending tab in front
         *
         * Main steps:
         *   1. The model is filled with an entry (all properties are initially empty) for each sorting type
         *   2. Gets first buffer of notification items ByDate/descending
         *   3. Sets the first data buffer to the model
         */
        onInit: function () {
            const oInitialModelStructure = {};

            if (Device.system.desktop) {
                this.iMaxNotificationItemsForDevice = this.oPagingConfiguration.MAX_NOTIFICATION_ITEMS_DESKTOP;
            } else {
                this.iMaxNotificationItemsForDevice = this.oPagingConfiguration.MAX_NOTIFICATION_ITEMS_MOBILE;
            }
            const oView = this.getView();

            // Container.getService use is allowed here. The service is already loaded by the notification component.
            this.oNotificationsService = oView.getViewData().notificationsService;
            this.oSortingType = this.oNotificationsService.getOperationEnum();

            this.oKeyToSortingMap = {
                sapUshellNotificationIconTabByDate: this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING,
                sapUshellNotificationIconTabByType: this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING,
                sapUshellNotificationIconTabByPrio: this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING
            };

            oInitialModelStructure[this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING] = this.getInitialSortingModelStructure();
            oInitialModelStructure[this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING] = this.getInitialSortingModelStructure();
            oInitialModelStructure[this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING] = {};

            this.sCurrentSorting = this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING;
            this.oPreviousTabKey = "sapUshellNotificationIconTabByDate";

            const oModel = new JSONModel(oInitialModelStructure);
            oModel.setSizeLimit(1500);
            // Initializing the model with a branch for each sorting type
            oView.setModel(oModel);

            oView.setModel(resources.i18nModel, "i18n");

            // Get the first buffer of notification items, byDate (descending)
            this.getNextBuffer();
        },

        onAfterRendering: function () {
            this.removeTabIndexFromList(this.sCurrentSorting);

            const oView = this.getView();
            const oTabBarHeader = oView.byId("notificationIconTabBar--header");
            if (oTabBarHeader) {
                oTabBarHeader.getDomRef().classList.remove("sapContrastPlus"); // "sapContrastPlus" class is not removed with "removeStyleClass()" or "toggleStyleClass()"
            }

            oView.$("-sapUshellNotificationIconTabByDate-text")
                .attr("aria-label", resources.i18n.getText("Notifications.ByDateDescending.AriaLabel"));
            oView.$("-sapUshellNotificationIconTabByType-text")
                .attr("aria-label", resources.i18n.getText("Notifications.ByType.AriaLabel"));
            oView.$("-sapUshellNotificationIconTabByPrio-text")
                .attr("aria-label", resources.i18n.getText("Notifications.ByPriority.AriaLabel"));
        },

        // check if the get next buffer should fetch more notifications
        shouldFetchMoreNotifications: function () {
            const oModel = this.getModel();
            const bHasMoreItemsInBackend = oModel.getProperty(`/${this.sCurrentSorting}/hasMoreItemsInBackend`);
            const bListMaxReached = oModel.getProperty(`/${this.sCurrentSorting}/listMaxReached`);
            return bHasMoreItemsInBackend && !bListMaxReached;
        },

        /**
         * Gets a buffer of notification items from notification service, according to the current sorting type
         */
        getNextBuffer: async function () {
            const oModel = this.getModel();
            const aCurrentItems = this.getItemsFromModel(this.sCurrentSorting);
            let iNumberOfItemsInModel;

            if (!this.shouldFetchMoreNotifications()) {
                return;
            }

            const iNumberOfItemsToFetch = this.getNumberOfItemsToFetchOnScroll(this.sCurrentSorting);
            if (iNumberOfItemsToFetch === 0) {
                oModel.setProperty(`/${this.sCurrentSorting}/hasMoreItems`, false);
                return;
            }

            if (aCurrentItems !== undefined) {
                iNumberOfItemsInModel = aCurrentItems.length;
            }

            if (iNumberOfItemsInModel === 0) {
                this.addBusyIndicatorToTabFilter(this.sCurrentSorting);
            }

            oModel.setProperty(`/${this.sCurrentSorting}/inUpdate`, true);

            try {
                // Fetch a buffer of notification items from notification service
                const oResult = await this.oNotificationsService.getNotificationsBufferBySortingType(this.sCurrentSorting, iNumberOfItemsInModel, iNumberOfItemsToFetch);
                const oUserSettingsDataAvailableDeferred = this.oNotificationsService._getNotificationSettingsAvailability();
                if (oUserSettingsDataAvailableDeferred.state() === "pending") {
                    this.oNotificationsService._userSettingInitialization();
                }
                this.addBufferToModel(this.sCurrentSorting, oResult);
            } catch (oResult) {
                if (iNumberOfItemsInModel === 0) {
                    this.removeBusyIndicatorToTabFilter(this.sCurrentSorting);
                    _errorMessage(resources.i18n.getText("errorOccurredMsg"));
                }
            }
        },

        /**
         * Gets a buffer of notification items of a specific notification type, from the notification service
         */
        getNextBufferForType: async function () {
            const oModel = this.getModel();
            const sSortingType = this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING;
            const aGroupHeaders = oModel.getProperty(`/${sSortingType}`);
            const oCurrentlyExpandedGroupHeader = aGroupHeaders.find((oGroupHeader) => {
                return oGroupHeader.Id === this.sCurrentExpandedType;
            });

            // If there are no more notification items (in the backend) for this sorting type - then return
            if (!oCurrentlyExpandedGroupHeader || !oCurrentlyExpandedGroupHeader.hasMoreItems) {
                return;
            }

            await this.updateGroupHeaders(true);
        },

        /**
         * Adds a new buffer of notification items to the model in the correct model path according to the specific sorting type.
         * The hasMoreItems flag indicates whether the number of returned items is smaller than the size of the requested buffer,
         * if so (i.e. oResultObj.value.length < getNumberOfItemsToFetchOnScroll) then there are no more items in the backend for this sorting type.
         *
         * @param {string} sSortingType The sorting type of the notification list to be affected.
         *   See "oOperationEnum" from "sap/ushell/services/Notifications.js".
         * @param {object} oResult The data (notification items) to insert to the model
         */
        addBufferToModel: function (sSortingType, oResult) {
            const oModel = this.getModel();

            if (!oResult) {
                oModel.setProperty(`/${sSortingType}/hasMoreItemsInBackend`, false);
                return;
            }

            const aCurrentItems = this.getItemsFromModel(sSortingType);
            const bHasMoreItems = oResult.length >= this.getNumberOfItemsToFetchOnScroll(sSortingType);

            // If the number of returned items is smaller than the number that was requested -
            // it means that there is no more data (i.e. notification items) in the backend that needs to be fetched for this sorting type

            oModel.setProperty(`/${sSortingType}/hasMoreItemsInBackend`, bHasMoreItems);

            const aMergedArrays = aCurrentItems.concat(oResult);
            oModel.setProperty(`/${sSortingType}/aNotifications`, aMergedArrays);
            oModel.setProperty(`/${sSortingType}/inUpdate`, false);
            if (aMergedArrays.length >= this.iMaxNotificationItemsForDevice) {
                this.handleMaxReached(sSortingType);
            }

            // If this is the first time that items are fetched for this tab\sorting type (no old items) -
            // then the busy indicator was rendered and now needs to be removed
            if (aCurrentItems.length === 0) {
                this.removeBusyIndicatorToTabFilter(sSortingType);
            }
        },

        isMoreCircleExist: function (sSortingType) {
            const oSelectedList = this.getNotificationList(sSortingType);
            const aSelectedItems = oSelectedList.getItems();
            const iItemsLength = aSelectedItems.length;
            const oLastItem = aSelectedItems[iItemsLength - 1];
            return !!iItemsLength && oLastItem.getMetadata().getName() === "sap.m.CustomListItem";
        },

        handleMaxReached: function (sSortingType) {
            const oSelectedList = this.getNotificationList(sSortingType);
            const iNotificationCount = Math.floor(this.oNotificationsService.getNotificationsCount());
            const iMoreNotificationsNumber = iNotificationCount - this.iMaxNotificationItemsForDevice;
            const bIsMoreCircleExist = this.isMoreCircleExist(sSortingType);
            const oModel = this.getModel();

            oModel.setProperty(`/${this.sCurrentSorting}/moreNotificationCount`, iMoreNotificationsNumber);
            oModel.setProperty(`/${this.sCurrentSorting}/listMaxReached`, iMoreNotificationsNumber >= 0);
            if (iMoreNotificationsNumber > 0 && !bIsMoreCircleExist) {
                oSelectedList.addItem(this.getMoreCircle(this.sCurrentSorting));
            } else if (iMoreNotificationsNumber <= 0 && bIsMoreCircleExist) {
                oSelectedList.removeItem(this.oMoreListItem);
            }
        },

        updateGroupHeaders: async function (bGrow) {
            const oModel = this.getModel();
            const sSorting = this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING;

            const aOldGroups = oModel.getProperty(`/${sSorting}`);
            aOldGroups.inUpdate = true;
            let iOldNotificationLength = 0;
            if (this.sCurrentExpandedType) {
                const oOldExpandedGroup = aOldGroups.find((oGroup) => {
                    return oGroup.Id === this.sCurrentExpandedType;
                });
                if (oOldExpandedGroup) {
                    iOldNotificationLength = oOldExpandedGroup.aNotifications.length;
                    if (bGrow) {
                        iOldNotificationLength += this.getBasicBufferSize();
                    }
                    oOldExpandedGroup.Busy = true;
                }
            }
            oModel.setProperty(`/${sSorting}`, aOldGroups);
            this.addBusyIndicatorToTabFilter(sSorting);

            try {
                const sGroupHeaders = await this.oNotificationsService.getNotificationsGroupHeaders();
                const aGroups = JSON.parse(sGroupHeaders).value;
                aGroups.inUpdate = false;

                let iExpandedIndex = -1;

                aGroups.forEach((oItem, iIndex) => {
                    if (oItem.Id && this.sCurrentExpandedType === oItem.Id) {
                        oItem.Collapsed = false;
                        iExpandedIndex = iIndex;
                    } else {
                        oItem.Collapsed = true;
                        oItem.aNotifications = []; // Group headers are always empty at the beginning
                    }
                });


                const sExpandedGroupId = this.sCurrentExpandedType;
                if (sExpandedGroupId) {
                    const oExpandedGroup = aGroups[iExpandedIndex];
                    if (oExpandedGroup) {
                        // Fetch notification items for expanded group
                        oExpandedGroup.aNotifications = (
                            await this.oNotificationsService.getNotificationsBufferInGroup(sExpandedGroupId, 0, this.getNumberOfItemsToFetchOnUpdate(iOldNotificationLength)) || []
                        );

                        // If the number of returned items is smaller than the number that was requested -
                        // it means that there is no more data (i.e. notification items) in the backend that needs to be fetched for this sorting type
                        if (oExpandedGroup.aNotifications.length < this.getBasicBufferSize()) {
                            oExpandedGroup.hasMoreItems = false;
                        } else {
                            oExpandedGroup.hasMoreItems = true;
                        }
                    }
                }
                oModel.setProperty(`/${sSorting}`, aGroups);
            } catch (oError) {
                Log.error("Notifications control - call to getNotificationsGroupHeaders or getNotificationsBufferInGroup failed: ", oError, "sap.ushell.components.shell.Notifications.Notifications");
            } finally {
                this.removeBusyIndicatorToTabFilter(sSorting);
                this._retainFocus();
            }
        },

        updateNotifications: async function () {
            const sSorting = this.sCurrentSorting;
            this.addBusyIndicatorToTabFilter(sSorting);
            const iTop = this.getNumberOfItemsToFetchOnScroll(sSorting);

            try {
                const aNotifications = await this.oNotificationsService.getNotificationsBufferBySortingType(sSorting, 0, iTop);
                const oModel = this.getModel();
                oModel.setProperty(`/${sSorting}/aNotifications`, aNotifications);
            } catch (error) {
                Log.error("Notifications control - call to notificationsService.getNotificationsBufferBySortingType failed: ", error, "sap.ushell.components.shell.Notifications.Notifications");
            } finally {
                this.removeBusyIndicatorToTabFilter(sSorting);
                this._retainFocus();
            }
        },

        markRead: async function (sNotificationId) {
            this.setMarkReadOnModel(sNotificationId, true);
            try {
                await this.oNotificationsService.markRead(sNotificationId);
            } catch (error) {
                _errorMessage(resources.i18n.getText("notificationsFailedMarkRead"));
                this.setMarkReadOnModel(sNotificationId, false);
            }
        },

        onBeforeRendering: function () {
            if (!this._bDependencyCallbackRegistered) { // register once: the service registration is primitive and does not remove duplicates
                this._bDependencyCallbackRegistered = true;
                this.oNotificationsService.registerNotificationsUpdateCallback(this.refreshModel.bind(this), false);
            }
        },

        //*********************************************************************************************************
        //************************************** Notification actions *********************************************

        executeAction: function (sNotificationId, sActionName) {
            return this.oNotificationsService.executeAction(sNotificationId, sActionName);
        },

        executeBulkAction: async function (sActionName, sActionText, oGroup, sPathToNotification) {
            let sMessage;
            const oModel = this.getModel();
            const sNotificationTypeDesc = oModel.getProperty(`${sPathToNotification}/NotificationTypeDesc`) || oModel.getProperty(`${sPathToNotification}/NotificationTypeKey`);

            try {
                await this.oNotificationsService.executeBulkAction(oGroup.Id, sActionName);
                sMessage = resources.i18n.getText("notificationsSuccessExecuteBulkAction", [
                    sActionText,
                    sNotificationTypeDesc
                ]);
                MessageToast.show(sMessage, { duration: 4000 });
                await this.refreshModel();
            } catch (oResult) {
                const iNrOfSucceededNotifications = oResult.succededNotifications && oResult.succededNotifications.length;
                if (iNrOfSucceededNotifications) {
                    const iNrOfFailedNotifications = oResult.failedNotifications.length;
                    sMessage = resources.i18n.getText("notificationsPartialSuccessExecuteBulkAction", [
                        sActionText,
                        iNrOfSucceededNotifications,
                        iNrOfFailedNotifications + iNrOfSucceededNotifications,
                        sNotificationTypeDesc,
                        iNrOfFailedNotifications
                    ]);
                    MessageToast.show(sMessage, { duration: 4000 });
                    await this.refreshModel();
                } else {
                    _errorMessage(resources.i18n.getText("notificationsFailedExecuteBulkAction"));
                }
            } finally {
                oModel.setProperty(`${sPathToNotification}/Busy`, false);
                this._retainFocus();
            }
        },

        dismissNotification: async function (sNotificationId) {
            try {
                await this.oNotificationsService.dismissNotification(sNotificationId);
                await this.refreshModel();
                this._retainFocus();
            } catch (error) {
                _errorMessage(resources.i18n.getText("notificationsFailedDismiss"));
            }
        },

        dismissBulkNotifications: async function (oGroup) {
            try {
                await this.oNotificationsService.dismissBulkNotifications(oGroup.Id);
                await this.refreshModel();
                this._retainFocus();
            } catch (error) {
                _errorMessage(resources.i18n.getText("notificationsFailedExecuteBulkAction"));
            }
        },

        onListItemPress: async function (sNotificationId, sSemanticObject, sAction, aParameters) {
            if (sSemanticObject && sAction) {
                ushellUtils.toExternalWithParameters(sSemanticObject, sAction, aParameters);
            }
            await this.markRead(sNotificationId);
        },

        //*********************************************************************************************************
        //****************************************** Busy Indicator ***********************************************

        addBusyIndicatorToTabFilter: function (sSortingType) {
            const oList = this.getNotificationList(sSortingType);
            oList.setBusy(true);
            // during the loading we don't need to show noData text, because the data is not still loaded
            oList.setShowNoData(false);
        },

        removeBusyIndicatorToTabFilter: function (sSortingType) {
            const oList = this.getNotificationList(sSortingType);
            oList.setBusy(false);
            oList.setShowNoData(true);
        },

        //*********************************************************************************************************
        //***************************************** Model functions ***********************************************

        refreshModel: async function () {
            if (this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING) {
                await this.updateGroupHeaders();
            } else {
                await this.updateNotifications();
            }
        },

        setMarkReadOnModel: function (sNotificationId, bIsRead) {
            const oModel = this.getModel();
            let sPath = `/${this.sCurrentSorting}`;
            let bGroupFound;

            const oData = oModel.getProperty(sPath);
            if (this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING) {
                for (let i = 0; i < oData.length; i++) {
                    if (oData[i].Id === this.sCurrentExpandedType) {
                        sPath = `${sPath}/${i}`;
                        bGroupFound = true;
                        break;
                    }
                }
                if (!bGroupFound) {
                    return;
                }
            }
            sPath = `${sPath}/aNotifications`;

            const aNotifications = oModel.getProperty(sPath);
            aNotifications.some((oNotification) => {
                if (oNotification.Id === sNotificationId) {
                    oNotification.IsRead = bIsRead;
                    return true;
                }
                return false;
            });
            oModel.setProperty(sPath, aNotifications);
        },

        //*********************************************************************************************************
        //**************************************** Handler functions ***********************************************

        onTabSelected: function (oEvent) {
            const sKey = oEvent.getParameter("key");

            if (this.oPreviousTabKey !== sKey) {
                this.sCurrentSorting = this.oKeyToSortingMap[sKey];
                this.oPreviousTabKey = sKey;
                this.refreshModel();
            }
        },

        /**
         * Utility function to shorten the code elsewhere and improve readability.
         *
         * @returns {sap.ui.model.json.JSONModel} the model of the notification view.
         * @private
         */
        getModel: function () {
            const oView = this.getView();
            return oView.getModel();
        },

        onNotificationItemPress: function (oEvent) {
            const oModel = this.getModel();
            const oItem = oEvent.getSource();
            const oBindingContext = oItem.getBindingContext();
            const sPath = oBindingContext.getPath();
            const oModelPart = oModel.getProperty(sPath);
            const sSemanticObject = oModelPart.NavigationTargetObject;
            const sAction = oModelPart.NavigationTargetAction;
            const aParameters = oModelPart.NavigationTargetParams;
            const sNotificationId = oModelPart.Id;
            this.onListItemPress(sNotificationId, sSemanticObject, sAction, aParameters);
        },

        onNotificationItemClose: function (oEvent) {
            const oModel = this.getModel();
            this._retainFocus();

            const oItem = oEvent.getSource();
            const oBindingContext = oItem.getBindingContext();
            const sPath = oBindingContext.getPath();
            const oNotificationModelEntry = oModel.getProperty(sPath);
            const sNotificationId = oNotificationModelEntry.Id;
            this.dismissNotification(sNotificationId);
        },

        onNotificationItemButtonPress: function (oEvent) {
            const oModel = this.getModel();
            const oItem = oEvent.getSource();
            const oBindingContext = oItem.getBindingContext();
            const sPath = oBindingContext.getPath();
            const oNotificationModelPart = oModel.getProperty(sPath);
            const aPathParts = sPath.split("/");
            const bTypeTabSelected = this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING;
            const sPathToNotification = bTypeTabSelected
                ? `/${aPathParts[1]}/${aPathParts[2]}/${aPathParts[3]}/${aPathParts[4]}`
                : `/${aPathParts[1]}/${aPathParts[2]}/${aPathParts[3]}`;
            const oNotificationModelEntry = oModel.getProperty(sPathToNotification);
            const sNotificationId = oNotificationModelEntry.Id;

            oModel.setProperty(`${sPathToNotification}/Busy`, true);

            return this.executeAction(sNotificationId, oNotificationModelPart.ActionId)
                .then((oResponse) => {
                    if (oResponse?.isSucessfull) {
                        if (oResponse.message && oResponse.message.length) {
                            MessageToast.show(oResponse.message, { duration: 4000 });
                        } else {
                            const sActionText = oNotificationModelPart.ActionText;
                            MessageToast.show(resources.i18n.getText("ActionAppliedToNotification", [sActionText]), { duration: 4000 });
                        }

                        // Notification should remain in the UI (after action executed) only if DeleteOnReturn flag exists, and equals false
                        if (oResponse.DeleteOnReturn !== false) {
                            this.refreshModel();
                            this.oNotificationsService._addDismissNotifications(sNotificationId);
                        }
                    } else if (oResponse) {
                        _errorMessage(oResponse.message);
                    } else {
                        _errorMessage(resources.i18n.getText("notificationsFailedExecuteAction"));
                    }
                })
                .catch(() => {
                    _errorMessage(resources.i18n.getText("notificationsFailedExecuteAction"));
                })
                .finally(() => {
                    this._retainFocus();
                    oModel.setProperty(`${sPathToNotification}/Busy`, false);
                });
        },

        onNotificationGroupItemClose: function (oEvent) {
            const oModel = this.getModel();
            const oGroup = oEvent.getSource();
            const oBindingContext = oGroup.getBindingContext();
            const sPath = oBindingContext.getPath();
            const aPathParts = sPath.split("/");
            const oNotificationModelEntry = oModel.getProperty(`/${aPathParts[1]}/${aPathParts[2]}`);

            this.dismissBulkNotifications(oNotificationModelEntry);
        },

        onNotificationGroupItemCollapse: function (oEvent) {
            const oModel = this.getModel();
            const oGroup = oEvent.getSource();
            const oBindingContext = oGroup.getBindingContext();
            const sPath = oBindingContext.getPath();
            if (oGroup.getCollapsed()) {
                delete this.sCurrentExpandedType;
            } else {
                oModel.setProperty(`${sPath}/Busy`, true);
                this.onExpandGroup(oGroup);
            }
        },

        onNotificationGroupItemButtonPress: function (oEvent) {
            const oModel = this.getModel();
            const oGroup = oEvent.getSource();
            const oBindingContext = oGroup.getBindingContext();
            const sPath = oBindingContext.getPath();
            const oNotificationModelPart = oModel.getProperty(sPath);
            const aPathParts = sPath.split("/");
            const sPathToNotification = `/${aPathParts[1]}/${aPathParts[2]}`;
            const oNotificationModelEntry = oModel.getProperty(sPathToNotification);

            this._retainFocus();

            // mark the notification group as busy
            oModel.setProperty(`${sPathToNotification}/Busy`, true);

            this.executeBulkAction(oNotificationModelPart.ActionId, oGroup.getProperty("text"), oNotificationModelEntry, sPathToNotification);
        },

        onListUpdateStarted: function (oEvent) {
            const oModel = this.getModel();
            if (oEvent.getParameter("reason") === "Growing") {
                if (!oModel.getProperty(`/${this.sCurrentSorting}/inUpdate`)) {
                    if (this.sCurrentSorting === this.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING) {
                        this.getNextBufferForType();
                    } else {
                        this.getNextBuffer();
                    }
                }
            }
        },

        //*********************************************************************************************************
        //**************************************** Helper functions ***********************************************

        getNumberOfItemsInScreen: function () {
            const iHeight = jQuery(window).height();
            const iItemsInScreen = (iHeight - this.oPagingConfiguration.TAB_BAR_HEIGHT) / this.oPagingConfiguration.NOTIFICATION_ITEM_HEIGHT;
            return Math.ceil(iItemsInScreen);
        },

        getBasicBufferSize: function () {
            return Math.max(this.getNumberOfItemsInScreen() * 3, this.oPagingConfiguration.MIN_NOTIFICATION_ITEMS_PER_BUFFER);
        },

        /**
         * Calculates and returns the number of items that should be requested from notification service, as part of the paging policy.
         * The function performs the following:
         *   - Calculated the number of required buffer according to the device / screen size
         *   - If the model already holds the  maximum number of item (per this device) - return 0
         *   - If the number of items in the model plus buffer size is bigger that the maximum - return the biggest possible number of items to fetch
         *   - Regular use case - return buffer size
         *
         * @param {string} sSortingType The sorting type of the notification list to be affected.
         *   See "oOperationEnum" from "sap/ushell/services/Notifications.js".
         * @returns {int} Basic buffer size
         */
        getNumberOfItemsToFetchOnScroll: function (sSortingType) {
            const iCurrentNumberOfItems = (this.getItemsFromModel(sSortingType) || []).length;
            const iBasicBufferSize = this.getBasicBufferSize();

            if (iCurrentNumberOfItems >= this.iMaxNotificationItemsForDevice) {
                return 0;
            }
            if (iCurrentNumberOfItems + iBasicBufferSize > this.iMaxNotificationItemsForDevice) {
                return this.iMaxNotificationItemsForDevice - iCurrentNumberOfItems;
            }
            return iBasicBufferSize;
        },

        /**
         * Calculated the number of items that should be required from the backend, according to:
         *   - (parameter) The number of items that are already in the model for the relevant sorting type
         *   - Basic buffer size
         * The number is rounded up to a product of basic buffer size
         * For example: if a basic buffer size is 50 and there are currently 24 items in the model - then 50 items (size of one basic buffer) are required.
         * @param {int} iNumberOfItemsInModel number of items
         * @returns {boolean} The smaller of the two following values:
         *   1. required number of items, which is the number of buffers * buffer size
         *   2. iMaxNotificationItemsForDevice
         */
        getNumberOfItemsToFetchOnUpdate: function (iNumberOfItemsInModel) {
            const iBasicBufferSize = this.getBasicBufferSize();
            const iNumberOfRequiredBasicBuffers = Math.ceil(iNumberOfItemsInModel / iBasicBufferSize);

            // If the number is less then one basic buffer - then one basic buffer is required
            const iReturnedValue = iNumberOfRequiredBasicBuffers > 0 ? iNumberOfRequiredBasicBuffers * iBasicBufferSize : iBasicBufferSize;

            // Return no more then the maximum number of items for this device
            return iReturnedValue > this.iMaxNotificationItemsForDevice ? this.iMaxNotificationItemsForDevice : iReturnedValue;
        },

        getItemsFromModel: function (sSortingType) {
            const oModel = this.getModel();
            return oModel.getProperty(`/${sSortingType || this.sCurrentSorting}/aNotifications`);
        },

        getInitialSortingModelStructure: function () {
            return {
                hasMoreItemsInBackend: true,
                listMaxReached: false,
                aNotifications: [],
                inUpdate: false,
                moreNotificationCount: ""
            };
        },

        onExpandGroup: function (oGroupElement) {
            const oModel = this.getModel();
            const sPath = oGroupElement.getBindingContextPath();
            const oGroup = oModel.getProperty(sPath);
            this.sCurrentExpandedType = oGroup.Id;
            this.refreshModel();
        },

        getNotificationList: function (sSortingType) {
            const oView = this.getView();

            switch (sSortingType) {
                case this.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING:
                    return oView.byId("sapUshellNotificationsListDate");
                case this.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING:
                    return oView.byId("sapUshellNotificationsListPriority");
                default:
                    return oView.byId("sapUshellNotificationsListType");
            }
        },

        /**
         * Helper method that removes the tabindex from the second child of the given object.
         *
         * @param {string} sSortingType The sorting type of the notification list to be affected.
         *   See "oOperationEnum" from "sap/ushell/services/Notifications.js".
         */
        removeTabIndexFromList: function (sSortingType) {
            const oListControl = this.getNotificationList(sSortingType);
            const oListTag = oListControl.$().children().get(1);
            if (oListTag) {
                oListTag.removeAttribute("tabindex");
            }
        },

        getMoreCircle: function (sType) {
            const oModel = this.getModel();
            const oListItem = new CustomListItem({
                type: ListType.Inactive,
                content: new VBox({
                    items: [
                        new VBox({
                            items: [
                                new Text({
                                    text: `{/${sType}/moreNotificationCount}`
                                })
                                    .addStyleClass("sapUshellNotificationsMoreCircleCount")
                                    .setModel(oModel),
                                new Text({
                                    text: resources.i18n.getText("moreNotifications")
                                })
                            ],
                            alignItems: FlexAlignItems.Center
                        }).addStyleClass("sapUshellNotificationsMoreCircle"),
                        new Text({
                            text: resources.i18n.getText("moreNotificationsAvailable_message"),
                            textAlign: "Center"
                        }).addStyleClass("sapUshellNotificationsMoreHelpingText"),
                        new Text({
                            text: resources.i18n.getText("processNotifications_message"),
                            textAlign: "Center"
                        }).addStyleClass("sapUshellNotificationsMoreHelpingText")
                    ]
                }).addStyleClass("sapUshellNotificationsMoreVBox")
            }).addStyleClass("sapUshellNotificationsMoreListItem");

            this.oMoreListItem = oListItem;
            return oListItem;
        },

        // When the notifications view is opened in a popup, keep focus on an active tab to avoid the popup close due to focus loss
        _retainFocus: function () {
            const oActiveElement = document.activeElement;
            if (!oActiveElement || document.body === oActiveElement || !StaticArea.contains(oActiveElement)) {
                const oView = this.getView();
                const oIconTabBar = oView.byId("notificationIconTabBar");
                const sKey = oIconTabBar.getSelectedKey();
                const oFocusableItem = oIconTabBar.getItems().find((oItem) => {
                    return oItem.getKey() === sKey;
                });
                if (oFocusableItem) {
                    oFocusableItem.focus();
                }
            }
        },

        //*********************************************************************************************************
        //**************************************** Formatter functions ********************************************

        priorityFormatter: function (sPriority) {
            if (sPriority) {
                sPriority = sPriority.charAt(0) + sPriority.substr(1).toLowerCase();
                return Priority[sPriority];
            }
        }
    });
});

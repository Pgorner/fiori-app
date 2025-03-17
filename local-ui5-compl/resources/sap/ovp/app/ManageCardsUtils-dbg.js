/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel",
    "sap/ui/fl/write/api/ControlPersonalizationWriteAPI",
    "sap/ui/core/Fragment",
    "sap/ovp/cards/PersonalizationUtils",
    "sap/ovp/cards/CommonUtils"
], function (
    BaseObject,
    JSONModel,
    ControlPersonalizationWriteAPI,
    Fragment,
    PersonalizationUtils,
    CommonUtils
) {
    "use strict";

    return BaseObject.extend("sap.ovp.app.ManageCardsUtils", {
        /**
         * constructor of the class
         * @memberOf sap.ovp.app.ManageCardsUtils
         * @param {sap.ui.core.mvc.Controller} controller
         */

        constructor: function (controller) {
            if (!controller) {
                throw new Error("Main Controller is required to initialize ManageCardsUtil");
            }
        },

        /**
         * Function for one time initialization once view is loaded
         * @memberOf sap.ovp.app.ManageCardsUtils
         */

        onManageCardsMenuButtonPress: function () {
            this.aManageCardsDialogModelState = [];
            var oMainController = CommonUtils.getApp();
            var that = this;
            var oManageCardsFragmentController = {
                onManageCardOkButtonPressed: function (oEvent) {
                    if (oEvent.getParameters().reason === 'Ok') {
                        var aP13nData = oMainController.byId("manageCardsSelectionPanel").getP13nData();
                        var aOrderedCards = oMainController.getUIModel().getProperty("/aOrderedCards");
                        var aVisibilityDeltaChanges = [];
                        var iDataLength = aP13nData.length;
                        for (var i = 0; i < iDataLength; i++) {
                            if (aP13nData[i].visible !== aOrderedCards[i].visible) {
                                aVisibilityDeltaChanges.push({
                                  changeType: "visibility",
                                  content: {
                                    cardId: aP13nData[i].id,
                                    visibility: aP13nData[i].visible
                                  },
                                  isUserDependent: true
                                });
                            }
                            aP13nData[i].visibility = aP13nData[i].visible;
                        }
                        oMainController.createOrDestroyCards.apply(oMainController, [that.aManageCardsDialogModelState, aP13nData, false]);
                        oMainController.getUIModel().setProperty("/aOrderedCards", aP13nData);
                        oMainController.updateDashboardLayoutCards(aP13nData);
                        var oOvpConfig = oMainController.getOwnerComponent().oOvpConfig,
                            bInsightRTEnabled = oOvpConfig && oOvpConfig.bInsightRTEnabled;
                        if (bInsightRTEnabled) {
                            oMainController.updateCardVisibiltyForCM(aP13nData);
                        }
                        oMainController.updateLayoutWithOrderedCards();
                        PersonalizationUtils.savePersonalization(aVisibilityDeltaChanges, oMainController.getView());
                        for (var i = 0; i < aP13nData.length; i++) {
                            var oCard = aP13nData[i];
                            var iCardIndex = oMainController.aErrorCards.indexOf(oCard.id);
                            if (iCardIndex > -1 && oCard.visibility == false) {
                                oMainController.aErrorCards.splice(iCardIndex, 1);
                            }
                        }
                        if (document.querySelector(".sapFAvatar")) {
                            document.querySelector(".sapFAvatar").focus();
                        }
                    }
                    // Destroy dialog instance when dialog is closed
                    var oSelectionPanelContainer = oMainController.byId("manageCardsSelectionPanel");
                    var oDialogContainer = oMainController.byId("manageCardsDialog");
                    if (oSelectionPanelContainer && oDialogContainer) {
                        oSelectionPanelContainer.destroy();
                        oDialogContainer.destroy();
                    }
                },
                onManageCardResetButtonPressed: function () {
                    var sLayoutName = oMainController.getLayout().getMetadata().getName();
                    var oUiModel = oMainController.getUIModel();
                    var aOrderedCards = oUiModel.getProperty("/aOrderedCards");
                    oMainController.createOrDestroyCards.apply(oMainController, [aOrderedCards, oMainController.aManifestOrderedCards, sLayoutName === "sap.ovp.ui.DashboardLayout" ? true : false]);

                    var oAllowedCardsConfiguration = oMainController.getAllowedNumberOfCards();
                    if (oAllowedCardsConfiguration && oAllowedCardsConfiguration.numberOfCards) {
                        var numberOfAllowedCards = oAllowedCardsConfiguration.numberOfCards;
                        for (var index = 0; index < oMainController.aManifestOrderedCards.length; index++) {
                            var card = oMainController.aManifestOrderedCards[index];
                            if (index >= numberOfAllowedCards) {
                                card.visibility = false;
                            }
                        }
                    }
                    oUiModel.setProperty("/aOrderedCards", oMainController.aManifestOrderedCards);
                    oMainController.resetDashboardLayout();
                    oMainController.updateDashboardLayoutCards(oMainController.aManifestOrderedCards);
                    oMainController.updateLayoutWithOrderedCards();
                    that.manageCardsDialog.getModel().setProperty("/cards", oMainController.aManifestOrderedCards);
                    var aCardForDeletion = [];
                    for (var i = 0; i < aOrderedCards.length; i++) {
                        aCardForDeletion.push(oMainController.getView().byId(aOrderedCards[i].id));
                    }
                    var aCards = that.enhanceOrderedCardsForP13NDialog(aOrderedCards);
                    var oSelectionPanel = oMainController.byId("manageCardsSelectionPanel");
                    oSelectionPanel.setP13nData(aCards);
                    if (oAllowedCardsConfiguration) {
                        that.setMsgStripAndOkButton(oSelectionPanel, oMainController);
                    }
                    ControlPersonalizationWriteAPI.reset({
                        selectors: aCardForDeletion
                    }).finally(
                        function () {
                            if (document.querySelector(".sapFAvatar")) {
                                document.querySelector(".sapFAvatar").focus();
                            }
                        }
                    );
                },
                onCardVisibilityChange: function () {
                    var oSelectionPanel = oMainController.byId("manageCardsSelectionPanel");
                    var oAllowedCardsConfiguration = oMainController.getAllowedNumberOfCards();
                    if (oAllowedCardsConfiguration) {
                        that.setMsgStripAndOkButton(oSelectionPanel, oMainController);
                    }
                }
            };

            this.oManageCardsFragment = Fragment.load({
                id: oMainController.getView().getId(),
                name: "sap.ovp.app.ManageCard",
                controller: oManageCardsFragmentController
            }).then(
                function (oControl) {
                    that.manageCardsDialog = oControl;
                    var aOrderedCards = oMainController.getUIModel().getProperty("/aOrderedCards");
                    var oManageCardsDialogModel = Object.assign([], aOrderedCards);
                    that.aManageCardsDialogModelState = that.getManageCardsDialogModelState(aOrderedCards);
                    var oModel = new JSONModel({
                        cards: oManageCardsDialogModel
                    });
                    that.manageCardsDialog.setModel(oModel);
                    oMainController.getView().addDependent(that.manageCardsDialog);
                    that.openManageCardsDialog(aOrderedCards);
                }
            );
        },

        openManageCardsDialog: function (aOrderedCards) {
            var oMainController = CommonUtils.getApp();
            var aCards = this.enhanceOrderedCardsForP13NDialog(aOrderedCards);
            var oPopup = oMainController.byId("manageCardsDialog");
            var oSelectionPanel = oMainController.byId("manageCardsSelectionPanel");
            oSelectionPanel.setP13nData(aCards);
            var iLimit = this.getAllowedNumberOfCardsAndSetMessageStripText(oMainController);
            var aVisibleCards = aOrderedCards.filter(function(card) { return card.visibility === true; });
            var oMsgStrip = oMainController.byId("manageCardsPanelWarningMessage");
            //first condition is added to handle on pageload scenario, second condition is added to handle key user changes if card is hidden
            if (iLimit && (aOrderedCards.length >= iLimit) && (aVisibleCards.length >= iLimit)) {
                oMsgStrip.setVisible(true);
            }
            oPopup.open();
        },

        /**
        * Add visible, name and label property to each card object in aOrderedCards for P13N dialog.
        * 
        * @param {Array} aOrderedCards array of card objects having properties of id, visibility
        * @returns {Array} OrderedCards array enhanced with visible, name and label property.
        */

        enhanceOrderedCardsForP13NDialog: function (aOrderedCards) {
            var aVisibleCardIds = [];
            var oMainController = CommonUtils.getApp();
            aOrderedCards.forEach(function (card) {
                aVisibleCardIds.push(card["id"]);
            });
            var aCardsModel = oMainController._getCardsModel();
            var aVisibleCardsForLayout = [];
            var sLayoutName = oMainController.getLayout().getMetadata().getName();
            if (sLayoutName === "sap.ovp.ui.DashboardLayout") {
                var aCards = oMainController._getCardArrayAsVariantFormatDashboard();
                aCards.forEach(function (card) {
                    var oCard = aCardsModel.find(function (oElement) {
                        return oElement.id === card.id;
                    });
                    var sUpdatedTitle = CommonUtils.getUpdatedTitle(card.id);
                    if (aVisibleCardIds.indexOf(card.id) != -1) {
                        aVisibleCardsForLayout.push({
                            id: card.id,
                            visibility: card.visibility,
                            visible: card.visibility,
                            name: card.id,
                            label: sUpdatedTitle || oCard.settings.title
                        });
                    }
                });
                aOrderedCards = aVisibleCardsForLayout;
            } else if (sLayoutName === "sap.ovp.ui.EasyScanLayout") {
                var aContent = oMainController.getLayout().getContent();
                var aCardsModel = oMainController._getCardsModel();
                aContent.forEach(function (content) {
                    var id = content.getId();
                    var cardId = id.split("--").pop();
                    var oCard = aCardsModel.find(function (oElement) {
                        return oElement.id === cardId;
                    });
                    var sUpdatedTitle = CommonUtils.getUpdatedTitle(cardId);
                    if (aVisibleCardIds.indexOf(cardId) != -1) {
                        aVisibleCardsForLayout.push({
                            id: cardId,
                            visibility: content.getVisible(),
                            visible: content.getVisible(),
                            name: cardId,
                            label: sUpdatedTitle || oCard.settings.title
                        });
                    }
                });
                aOrderedCards = aVisibleCardsForLayout;
            }
            this.aManageCardsDialogModelState = this.getManageCardsDialogModelState(aOrderedCards);
            oMainController.getUIModel().setProperty("/aOrderedCards", aOrderedCards);
            this.manageCardsDialog.getModel().setProperty("/cards", aOrderedCards);
            return aOrderedCards;
        },

        /**
        * Store current state of cards to compare with the new state for createOrDestroyCards method
        * 
        * @param {Array} aCardArray 
        * @returns {Array} Cards array with the new state
        */

        getManageCardsDialogModelState: function (aCardArray) {
            var aCardsArray = [];
            for (var i = 0; i < aCardArray.length; i++) {
                aCardsArray.push({
                    id: aCardArray[i].id,
                    visibility: aCardArray[i].visibility
                });
            }
            return aCardsArray;
        },

        /**
        * Retrieves the limit set for the number of cards allowed and sets message text of the messagestrip, and sets its visibility to false
        * 
        * @param {object} oMainController - The main controller object
        * @returns {number} - The limit for the number of cards allowed to be displayed 
        */

        getAllowedNumberOfCardsAndSetMessageStripText: function (oMainController) {
            var oAllowedCardsConfiguration = oMainController.getAllowedNumberOfCards();
            var iLimit = oAllowedCardsConfiguration && oAllowedCardsConfiguration.numberOfCards;
            var sMessageText = oAllowedCardsConfiguration && oAllowedCardsConfiguration.errorMessage;
            var oMsgStrip = oMainController.byId("manageCardsPanelWarningMessage");
            oMsgStrip.setText(sMessageText);
            oMsgStrip.setVisible(false);
            return iLimit;
        },

        /**
        * Sets the message strip visibility and enables/disables the OK button based on card selection
        * 
        * @param {object} oSelectionPanel The selection panel object
        * @param {object} oMainController The main controller object
        */

        setMsgStripAndOkButton: function (oSelectionPanel, oMainController) {
            var iSelectedCards = oSelectionPanel.getSelectedFields().length;
            var iLimit = this.getAllowedNumberOfCardsAndSetMessageStripText(oMainController);
            var oMsgStrip = oMainController.byId("manageCardsPanelWarningMessage");
            var sManageCardsDialogId = oMainController.byId("manageCardsDialog").sId;
            var oOkBtn = oMainController.byId(sManageCardsDialogId + "-confirmBtn");
            oOkBtn.setEnabled(true);
            if (iLimit && iSelectedCards >= iLimit) {
                oMsgStrip.setVisible(true);
            } 
            if (iLimit && iSelectedCards > iLimit) {
                oOkBtn.setEnabled(false);
            }
        }
    });
});
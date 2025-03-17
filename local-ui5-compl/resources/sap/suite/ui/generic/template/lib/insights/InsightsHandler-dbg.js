sap.ui.define([
    "sap/ui/base/Object",
    "sap/base/util/extend",
    "sap/m/MessageBox",
    "sap/suite/ui/generic/template/lib/insights/InsightsCardHelper",
    "sap/suite/ui/generic/template/lib/cards/DTCardHelper",
    "sap/base/util/merge",
    "sap/base/util/deepClone",
	"sap/suite/ui/generic/template/genericUtilities/FeLogger"
], function(BaseObject, extend, MessageBox, InsightsCardHelper, DTCardHelper, merge, deepClone, FeLogger) {
    'use strict';
    function getMethods(oState, oController, oTemplateUtils) {
        var oLogger = new FeLogger("lib.InsightsHandler").getLogger();
        var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
        var oTemplatePrivateGlobalModel = oTemplateUtils.oComponentUtils.getTemplatePrivateGlobalModel();
        var oInsightsInstance = oTemplatePrivateGlobalModel.getProperty("/generic/insights/oInsightsInstance");
        /**
         * This function can be called by any InsightsHandler instance to add the card that the user wants to share
         * @param {string} sType card type that will be provided by the component (LR/ALP/OP)
         * @param {*} oPresentationControlHandler
         * @returns {Promise<Array<object>>}
         */
        function fnGetCardsToShare(sType, oPresentationControlHandler) {
            var oCardInfo, sCardTitle, sAppTitle,
                sViewId = oController.getView().getId();
            var oComponent = oController.getOwnerComponent();
            var oAppComponent = oComponent.getAppComponent();
            var sAppId = oAppComponent.getManifestEntry("sap.app").id;
            var iViewLevel = oTemplatePrivateModel.getProperty("/generic/viewLevel");
            oPresentationControlHandler = oPresentationControlHandler || oState.oPresentationControlHandler; // In case of LR the oState already has the oPresentationControlHandler
            var oMetaModel = oComponent.getModel().getMetaModel();
            var sEntitySet = oComponent.getEntitySet();

            sAppTitle = oAppComponent.getManifestEntry("sap.app").title;
            if (oPresentationControlHandler) {
                var oHeaderInfo;
                if (oPresentationControlHandler.getEntitySet) { // getEntitySet is empty in case of multiview scenario.
                    sEntitySet = oPresentationControlHandler.getEntitySet();
                }
                var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
                var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                oHeaderInfo  = oEntityType['com.sap.vocabularies.UI.v1.HeaderInfo'];
                sCardTitle = (oHeaderInfo && oHeaderInfo.TypeNamePlural && oHeaderInfo.TypeNamePlural.String);
            }
            // oCardInfo is the initial set of details required for the card consumer to shpw the list of cards
            oCardInfo = {
                id : InsightsCardHelper.getCardId(oAppComponent),
                "descriptorContent" : {
                    "sap.card" : {
                        "header" : {
                            "title" : sCardTitle || sAppTitle,
                            "subTitle": sAppTitle
                        }
                    },
                    "sap.insights" : {
                        "parentAppId" : sAppId
                    }
                }
            };

            // updating the same card to the global model so that the additional details can be used when card detail is requested from a card consumer.
            var oShareCardInfo = deepClone(oCardInfo);
            let oGetCardInfoPromise = Promise.resolve(oCardInfo);
            if (sType === InsightsCardHelper.CardTypes.DT_CARD) {
                oGetCardInfoPromise = fnFetchDTCardManifest();
            }
            return oGetCardInfoPromise.then(function (oCardInfo) {
                const aShareCardInfo = [];
                if (oCardInfo) {
                    oShareCardInfo.cardType = sType;
                    oShareCardInfo.viewId = sViewId;
                    oTemplatePrivateGlobalModel.setProperty("/generic/insights/shareCards/" + iViewLevel, [oShareCardInfo]);
                    aShareCardInfo.push(oShareCardInfo);
                }
                return aShareCardInfo;
            });
        }

        async function fnFetchDTCardManifest() { 
            let oCardManifest;
            try {
                oCardManifest = await oState.oDTCardHelper.getCardManifest(DTCardHelper.CardTypes.INTEGRATION) || null;
            } catch (error) {
                oLogger.error("Error while fetching the DT Card manifest", error);
            } finally {
                return oCardManifest;
            }
        }

        function isCardCreationAllowed(oState) {
            return InsightsCardHelper.isCardCreationAllowed(oState);
        }

        /**
         * This method is relevant for table and list card types
         * @param {*} oEntityType
         * @returns {boolean}
         */
        function fnCheckSimpleTableColumns (oEntityType) {
            var oMetaModel = oState.oPresentationControlHandler.getModel().getMetaModel();
            return oState.oPresentationControlHandler.getVisibleProperties().some(function (oColumn) {
                var oProperty = oMetaModel.getODataProperty(oEntityType, oColumn.data("p13nData").leadingProperty);
                if (oTemplateUtils.oCommonUtils.isSupportedColumn(oColumn, oProperty, oState.oPresentationControlHandler.getControl()) &&
                   (oProperty &&  (oProperty["sap:label"] || oProperty['com.sap.vocabularies.Common.v1.Label']) && oColumn.getVisible())) {
                    return true;
                }
            });
        }

        function fnGetCardCreationFailureMessage(sType, oRb, oEntityType) {
            var sErrorMessage = "";
            if (sType === InsightsCardHelper.CardTypes.ANALYTICAL && !isCardCreationAllowed(oState)) {
                sErrorMessage = oRb.getText("ST_CARD_CREATION_FAILURE_REASON_SEMANTIC_DATE_FILTERS");
            } else if (sType === InsightsCardHelper.CardTypes.TABLE) {
                if (!isCardCreationAllowed(oState) || !fnCheckSimpleTableColumns(oEntityType)) {
                    sErrorMessage = oRb.getText("ST_CARD_CREATION_FAILURE") + "\n" + oRb.getText("ST_CARD_CREATION_FAILURE_INFO") +
                    "\n" + oRb.getText("ST_CARD_FAILURE_REASON_SEMANTIC_DATE_FILTERS") + "\n" + oRb.getText("ST_CARD_FAILURE_TABLE_REASON_UNSUPPORTED_COLUMNS");
                }
                // sErrorMessage = oRb.getText("ST_CARD_CREATION_FAILURE") + "\n" + oRb.getText("ST_CARD_CREATION_FAILURE_INFO");
                // if (!isCardCreationAllowed(oState)) {
                //     sErrorMessage = sErrorMessage +  "\n" + oRb.getText("ST_CARD_FAILURE_REASON_SEMANTIC_DATE_FILTERS");
                // }
                // if (!fnCheckSimpleTableColumns(oEntityType)) {
                //     sErrorMessage = sErrorMessage +  "\n" + oRb.getText("ST_CARD_FAILURE_TABLE_REASON_UNSUPPORTED_COLUMNS");
                // }
            }
            return sErrorMessage.length === 0 ? false : sErrorMessage;
        }

        function fnPrepareAndShowCard(oEvent, oCard, oPresentationControlHandler, mAdditionalProperties) {

            var oComponent = oController.getOwnerComponent();
            if (!oPresentationControlHandler && oCard.cardType === InsightsCardHelper.CardTypes.ANALYTICAL) { // For ALP use the Chart presentationControlHandler
                oPresentationControlHandler = oTemplateUtils.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(oState.oSmartChart);
            } else if (oCard.cardType === InsightsCardHelper.CardTypes.DT_CARD) {
                var sEntitySet = oComponent.getEntitySet();
                var  oClonedCard = deepClone(oCard);
                var oMetaModel = oComponent.getModel().getMetaModel();

                var oInsightsCardProvider = oTemplateUtils.oServices.oInsightsFECardProvider.getCardProviderInsightsInstance();

                // Fetch the DT Card manifest
                fnFetchDTCardManifest()
                    .then(function (oCardManifest) {
                        if (!oCardManifest) {
                            return;
                        }
                        oClonedCard.descriptorContent = merge(
                            oClonedCard.descriptorContent,
                            oCardManifest
                        );
                        oInsightsCardProvider.channel.publishCard(oInsightsCardProvider.id, oClonedCard, mAdditionalProperties.consumerId);
                    });
                return;
            } else {
                oPresentationControlHandler = oPresentationControlHandler || oState.oPresentationControlHandler;
            }

            var oModel = oPresentationControlHandler.getModel();
            var sEntitySet = oPresentationControlHandler.getEntitySet();
            var oMetaModel = oModel.getMetaModel();
            var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
            var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);

            var oRb = oComponent.getModel("i18n").getResourceBundle();
            
            function fnPrepareCardDefinition() {
                var oView = oController.getView();
                var oCardDefinition = {};
                oCardDefinition.currentControlHandler = oPresentationControlHandler;
                oCardDefinition.component = oComponent;
                oCardDefinition.view = oView;
                oCardDefinition.entitySet = oEntitySet;
                oCardDefinition.entityType = oEntityType;
                oCardDefinition.oSmartFilterbar = oState.oSmartFilterbar;
                oCardDefinition.oTemplateUtils = oTemplateUtils;
                var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
                var vDraftState = oTemplatePrivateModel.getProperty("/listReport/vDraftState");
                if (vDraftState && Number(vDraftState)) {
                    oCardDefinition.oFECustomFilterData = {
                        name: "IsActiveEntity",
                        value: vDraftState
                    };
                }
                return oCardDefinition;
            }

            // This is a callback handler for "Send" button (from insights "showCardPreview" dialog) in the Collaboration Manager card sharing scenario
            var fnPublishCardToInsightsChannel = function(oEvent) {
                oCard.descriptorContent = oEvent.getParameter("manifest"); // Updated manifest with user entered card details such as title , columns.
                var oInsightsCardProvider = oTemplateUtils.oServices.oInsightsFECardProvider.getCardProviderInsightsInstance();
                oInsightsCardProvider.channel.publishCard(oInsightsCardProvider.id, oCard, mAdditionalProperties.consumerId);
            };

            var sCardCreationFailureMessage = fnGetCardCreationFailureMessage(oCard.cardType, oRb, oEntityType);
            if (!sCardCreationFailureMessage) {
                var oCardMessageInfo = {};
                var oCardManifest = InsightsCardHelper.createCardForPreview(fnPrepareCardDefinition());
                if (oTemplatePrivateModel.getProperty("/listReport/bSupressCardRowNavigation")) {
                    oCardMessageInfo.text = oRb.getText("ST_CARD_NAVIGATION_FAILURE_INFO");
                }
                 // To act as a card provider the final manifest is shared back via callback which is publish to the card channel
                if (mAdditionalProperties && mAdditionalProperties.sendManifestToCardConsumer) {
                    var sInsightsDialogCustomActionText = oRb.getText("ST_SEND_CARD_TO_CHAT");
                    // If Card Id does not match then the provider will not be notified. So overriding the card ID with old ID which was already published to consumer.
                    oCardManifest['sap.app'].id = oCard.id;
                    oInsightsInstance.showCardPreview(oCardManifest, true, oCardMessageInfo, sInsightsDialogCustomActionText, fnPublishCardToInsightsChannel);
                } else {
                    oInsightsInstance && oInsightsInstance.showCardPreview(oCardManifest, true, oCardMessageInfo);
                }
            } else {
                MessageBox.error(sCardCreationFailureMessage);
            }
        }

        return {
            prepareAndShowCard : fnPrepareAndShowCard,
            getCardsToShare : fnGetCardsToShare
        };
    }

    return BaseObject.extend("sap.suite.ui.generic.template.lib.InsightsCardHandler", {
		constructor: function (oState, oController, oTemplateUtils) {
			extend(this, getMethods(oState, oController, oTemplateUtils));
		}
	});
});
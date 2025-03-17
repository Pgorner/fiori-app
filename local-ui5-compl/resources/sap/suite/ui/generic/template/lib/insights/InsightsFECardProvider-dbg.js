
sap.ui.define([
    "sap/ui/base/Object", "sap/base/util/extend",
    "sap/insights/CardProvider"
], function(BaseObject, extend, CardProvider) {
    'use strict';
    /**
     * This class will act as a Generic Card provider. For each Application instance this class will exist if the Insights service is available.
     * The FE card provider instance has callbacks for the sap.insights.CardProvider and will pass the card details sharing request to the relevant InsightsHandler instance.
     */

    function getMethods(oTemplateContract) {
        var aShareCards = [] , sAppComponentId, oInsightsCardProvider,
            mCardProviders = {};

        function fnOnConsumerConnectedHandler() {
            const iViewLevel = oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/routeLevel");
            // DT Card is available only in Main Object page hence level = 1
            if (iViewLevel === 1) {

                const oCurrentRoutingTree = Object.values(oTemplateContract.mRoutingTree).find(oTreeNode => oTreeNode.level === 1);
                const oController = oTemplateContract.componentRegistry[oCurrentRoutingTree.componentId]?.oController;
                if (!oController) {
                    return;
                }
                const oView = oController.getView();
                const oTemplatePrivateModel = oView.getModel('_templPriv');
                // displayMode => 1 = display;  0 = unknown;
                const iDisplayMode = oTemplatePrivateModel.getProperty("/objectPage/displayMode") || 0;
                const bIsObjectInDraftMode = !(iDisplayMode === 1 || (iDisplayMode === 0 && oView.getBindingContext().getObject().IsActiveEntity));
                if (bIsObjectInDraftMode) {
                    // If the object is in draft mode, then the card sharing is not allowed.
                    return;
                }
                const aExistingShareCards = oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/insights/shareCards/" + oCurrentRoutingTree.level);
                const oInsightsHandler = mCardProviders[oController.getView().getId()];
                let oGetCardsPromise = Promise.resolve(aExistingShareCards);
                // Fetch the manifest only if:
                // 1. It is the main object page to avoid errors when called from the list report.
                // 2. There are no existing entries in the model for the specific view level, indicating it is the first time.
                if (aExistingShareCards === undefined) {
                    oGetCardsPromise = oInsightsHandler.getCardsToShare("DT_CARD");
                }
                oGetCardsPromise.then(function (aShareCards) {
                    oInsightsCardProvider.onViewUpdate(true, aShareCards);
                });
            }
        }
        /**
         * This method creates an instance of the insights card provider and it already takes care of registering this app to the "sap-insights" channel as a card provider.
         */
        function fnRegisterApplicationAsCardProvider() {
            sAppComponentId = oTemplateContract.oAppComponent.getId();
            oInsightsCardProvider = new CardProvider(sAppComponentId, aShareCards);
            oInsightsCardProvider.onCardRequested = onCardDetailsRequested;
            const fnOriginalOnConsumerConnectedHandler = oInsightsCardProvider.onConsumerConnected;
            oInsightsCardProvider.onConsumerConnected = function(sConsumerId) {
                fnOnConsumerConnectedHandler();
                fnOriginalOnConsumerConnectedHandler.call(oInsightsCardProvider, sConsumerId);
            };

        }
        /**
         * Each component can individually register as a card provider within the application (ex : List Report acts as a individual provider).
         * When a card is requested then the related provider is identified and card sharing logic is initiated.
         * @param {*} oInsightsHandler
         * @param {*} sComponentId
         */
        function fnRegisterComponentForProvider(oInsightsHandler, sComponentId) {
            mCardProviders[sComponentId] = oInsightsHandler;
            // Attach a change event to this property and based on the view level, the share cards are updated.
            oTemplateContract.oTemplatePrivateGlobalModel.bindProperty("/generic/routeLevel").attachChange(function (oEvent) {
                var iViewLevel = oEvent.getSource().getValue();
                    var aShareCards = oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/insights/shareCards/" + iViewLevel) || [];
                    oInsightsCardProvider.onViewUpdate(true, aShareCards);
            });
        }
        /**
         * This method overrides the original method of insights card provider so that additional card details can be shared.
         */
        function onCardDetailsRequested(sConsumerId, sCardId) {
            var iViewLevel = oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/routeLevel");
            var aShareCards = oTemplateContract.oTemplatePrivateGlobalModel.getProperty("/generic/insights/shareCards/" + iViewLevel) || [];
            var oCard = aShareCards.find(function(oCard) {
                return oCard.id === sCardId;
            });
            var oInsightsHandler = mCardProviders[oCard.viewId];
            oInsightsHandler.prepareAndShowCard(undefined, oCard, undefined, {
                sendManifestToCardConsumer : true,
                consumerId : sConsumerId
            });
        }
        function fnGetCardProviderInsightsInstance() {
            return oInsightsCardProvider;
        }
        function fnUnRegisterApplicationAsCardProvider() {
            oInsightsCardProvider.onViewUpdate(false);
        }
        return {
            fnRegisterApplicationAsCardProvider : fnRegisterApplicationAsCardProvider,
            fnRegisterComponentForProvider : fnRegisterComponentForProvider,
            getCardProviderInsightsInstance: fnGetCardProviderInsightsInstance,
            unRegisterApplicationAsCardProvider: fnUnRegisterApplicationAsCardProvider
        };
    }
    return BaseObject.extend("sap.suite.ui.generic.template.lib.insights.CardProvider",{
        constructor: function(oTemplateContract) {
			extend(this, getMethods(oTemplateContract));
		}
    });
});

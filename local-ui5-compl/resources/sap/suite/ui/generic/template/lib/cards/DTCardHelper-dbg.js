sap.ui.define([
	"sap/ui/base/Object",
    "sap/base/util/extend",
	"sap/cards/ap/common/services/RetrieveCard"
], function (BaseObject, extend, RetrieveCard) {
	"use strict";
	/**
	 * @class DTCardHelper
	 * @param oController - Controller instance
	 * @classdesc This class is used to get the card manifest for the DesignTime Card.
	 */

	var CardTypes = {
		INTEGRATION: RetrieveCard.CardTypes.INTEGRATION,
		ADAPTIVE: RetrieveCard.CardTypes.ADAPTIVE
	};

	function getMethods(oController) {
		var oComponent = oController.getOwnerComponent();
		var oAppComponent = oComponent.getAppComponent();

		/**
		 * @param {CardTypes} cardType
		 * @returns {Promise} - Returns the card manifest for the DesignTime Card.
		 *
		 * This method is called by the DesignTime Card to get the card manifest from  each Object Page
		 *
		 * @example
		 * oDTCardHelper.getCardManifest(DTCardHelper.CardTypes.INTEGRATION);
		 */
		function getCardManifest(cardType) {
			return RetrieveCard.getObjectPageCardManifestForPreview(oAppComponent, {cardType: cardType});
		}
		return {
			getCardManifest: getCardManifest
		};
	}

	var DTCardHelper =  BaseObject.extend("sap.suite.ui.generic.template.lib.DTCardHelper", {
		constructor: function (oController) {
			extend(this, getMethods(oController));
		}
	});

	DTCardHelper.CardTypes = CardTypes;
	return DTCardHelper;

});

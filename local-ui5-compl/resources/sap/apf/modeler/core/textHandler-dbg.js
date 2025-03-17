/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define([
	"sap/apf/utils/exportToGlobal",
	"sap/ui/model/resource/ResourceModel"
], function(exportToGlobal, ResourceModel) {
	'use strict';
	/**
	 * @private
	 * @class Provides access to message texts and ui texts for the modeler
	 * @alias sap.apf.modeler.core.TextHandler
	 */
	function TextHandler() {
		var oResourceModel;
		/**
		 * @description returns a message text for message handling
		 * @param {string} sRessourceKey - Key of the message in the Ressourcefile
		 * @param {string[]} [aParameters] - Parameter for placeholder replacement in the message bundle
		 * @returns {string}
		 */
		this.getMessageText = function(sRessourceKey, aParameters) {
			return this.getText(sRessourceKey, aParameters);
		};
		/**
		 * @description returns text
		 * @param {string} sRessourceKey - Key of the message in the Ressourcefile
		 * @param {string[]} [aParameters] - Parameter for placeholder replacement in the message bundle
		 * @returns {string}
		 */
		this.getText = function(sRessourceKey, aParameters) {
			return oResourceModel.getResourceBundle().getText(sRessourceKey, aParameters);
		};
		function initBundles() {
			var sUrlModelerSpecificTexts = sap.ui.require.toUrl('sap/apf/modeler/resources/i18n/texts.properties');
			oResourceModel = new ResourceModel({bundleUrl: sUrlModelerSpecificTexts});
			var sUrlApfTexts = sap.ui.require.toUrl('sap/apf/resources/i18n/apfUi.properties');
			oResourceModel.enhance({bundleUrl: sUrlApfTexts});
		}
		initBundles();
	}

	// compatiblity export as the global name and the module name differ
	exportToGlobal("sap.apf.modeler.core.TextHandler", TextHandler);

	return TextHandler;
});

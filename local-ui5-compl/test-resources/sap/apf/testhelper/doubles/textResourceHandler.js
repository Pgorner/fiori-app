sap.ui.define([
	"sap/apf/utils/exportToGlobal"
], function(
	exportToGlobal
) {
	'use strict';

	/**
	 * @alias sap.apf.testhelper.doubles.TextResourceHandler
	 */
	function TextResourceHandler() {
		this.getTextNotHtmlEncoded = function(oLabel, aParameters){
			return oLabel;
		};
		this.getTextHtmlEncoded = function(oLabel, aParameters){
			return oLabel;
		};
		this.getMessageText = function(key){
			return key;
		};
		this.loadTextElements = function(textElements) {
		};
		this.registerTextWithKey = function(key, text) {
		};
	}

	exportToGlobal("sap.apf.testhelper.doubles.TextResourceHandler", TextResourceHandler);

	return TextResourceHandler;
});

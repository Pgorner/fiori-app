sap.ui.define([
	'sap/apf/utils/exportToGlobal',
	'sap/apf/utils/filter'
], function(
	exportToGlobal
) {
	"use strict";
	/**
	 * @alias sap.apf.testhelper.doubles.Step 
	 */
	function Step(messageHandler, oStepConfig, oFactory) {
		this.type = 'step';
		this.update = function() {
		};
		this.title = {
			type : "label", // optional
			kind : "text",
			file : "resources/i18n/test_texts.properties",
			key : "localTextReference2"
		};
		this.longTitle = {
			type : "label", // optional
			kind : "text",
			file : "resources/i18n/test_texts.properties",
			key : "localTextReference3"
		};
		this.thumbnail = {
			type : "thumbnail",
			leftUpper : {
				type : "label", // optional
				kind : "text",
				file : "resources/i18n/test_texts.properties",
				key : "localTextReferenceStepTemplate1LeftUpper"
			},
			leftLower : {
				type : "label", // optional
				kind : "text",
				file : "resources/i18n/test_texts.properties",
				key : "localTextReferenceStepTemplate1LeftLower"
			},
			rightUpper : {
				type : "label", // optional
				kind : "text",
				file : "resources/i18n/test_texts.properties",
				key : "localTextReferenceStepTemplate1RightUpper"
			},
			rightLower : {
				type : "label", // optional
				kind : "text",
				file : "resources/i18n/test_texts.properties",
				key : "localTextReferenceStepTemplate1RightLower"
			}
		};
		this.categories = [ {
			type : "category", // optional
			id : "categoryTemplate1"
		} ];
	}

	exportToGlobal("sap.apf.testhelper.doubles.Step", Step);

	return Step;
});

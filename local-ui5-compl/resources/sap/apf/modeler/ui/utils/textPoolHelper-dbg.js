/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @private
 * @class Text Pool Helper
 * @description Helps UI Controllers in handling Text Pool related operations (AutoFill, setText etc.).
 * @param {sap.apf.modeler.core.TextPool} oTextPool - Text Pool instance used in the controller context.
 * @name sap.apf.modeler.ui.utils.TextPoolHelper
 */
sap.ui.define([
	'sap/apf/modeler/ui/utils/optionsValueModelBuilder',
	'sap/apf/utils/exportToGlobal',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function(optionsValueModelBuilder, exportToGlobal, Filter, FilterOperator) {
	'use strict';
	var module = {
		SuggestionTextHandler : function(oTextPool) {
			this.oTextPool = oTextPool;
		},
		/**
		 * @private
		 * @name sap.apf.modeler.ui.utils.TranslationFormatMap
		 * @description Look up map for Translation Format from Input Type
		 */
		TranslationFormatMap : {
			APPLICATION_TITLE : {
				TextElementType : "XTIT",
				MaximumLength : 250
			},
			CATEGORY_TITLE : {
				TextElementType : "XTIT",
				MaximumLength : 60
			},
			FACETFILTER_LABEL : {
				TextElementType : "XFLD",
				MaximumLength : 50
			},
			STEP_TITLE : {
				TextElementType : "XTIT",
				MaximumLength : 100
			},
			STEP_LONG_TITLE : {
				TextElementType : "XTIT",
				MaximumLength : 200
			},
			STEP_CORNER_TEXT : {
				TextElementType : "XFLD",
				MaximumLength : 25
			},
			REPRESENTATION_LABEL : {
				TextElementType : "XTIT",
				MaximumLength : 80
			},
			REPRESENTATION_CORNER_TEXT : {
				TextElementType : "XFLD",
				MaximumLength : 25
			},
			NAVTARGET_TITLE : {
				TextElementType : "XTIT",
				MaximumLength : 200
			},
			STEPFILTERPROPERTY_LABEL : {
				TextElementType : "XTIT",
				MaximumLength : 80
			}
		}
	};

	module.SuggestionTextHandler.prototype.manageSuggestions = function(oEvent, aSuggestions) {
		var oControl = oEvent.getSource();
		var sValue = oEvent.getParameter("suggestValue");
		var oModelForSuggestions = optionsValueModelBuilder.convert(aSuggestions, aSuggestions.length);
		var upperCaseSearchTerm = sValue.toUpperCase();
		var lowerCaseSearchTerm = sValue.toLowerCase();
		var aFilters = [ new Filter("key", FilterOperator.Contains, upperCaseSearchTerm), new Filter("key", FilterOperator.Contains, lowerCaseSearchTerm) ];
		// create an OR filter.
		var oFilter = new Filter(aFilters, false);
		// destroy all suggestion items
		oControl.setModel(null);
		oControl.removeAllSuggestionItems();
		// create the suggestion items again (to evaluate if there are newly added services)
		oControl.setModel(oModelForSuggestions);
		oControl.getBinding("suggestionItems").filter(oFilter);
	};
	module.SuggestionTextHandler.prototype.manageSuggestionTexts = function(oEvent, oTranslationFormat) {
		var aSuggestions = [];
		var aExistingTexts = this.oTextPool.getTextsByTypeAndLength(oTranslationFormat.TextElementType, oTranslationFormat.MaximumLength);
		if (aExistingTexts.length !== 0) {
			aExistingTexts.forEach(function(oExistingText) {
				aSuggestions.push(oExistingText.TextElementDescription);
			});
			this.manageSuggestions(oEvent, aSuggestions);
		}
	};
	/*BEGIN_COMPATIBILITY*/
	exportToGlobal("sap.apf.modeler.ui.utils.SuggestionTextHandler", module.SuggestionTextHandler);
	exportToGlobal("sap.apf.modeler.ui.utils.TranslationFormatMap", module.TranslationFormatMap);
	/*END_COMPATIBILITY*/
	return module;
}, true /*GLOBAL_EXPORT*/);
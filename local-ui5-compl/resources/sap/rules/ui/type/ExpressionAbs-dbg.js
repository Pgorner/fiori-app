/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.
sap.ui.define(["sap/ui/model/CompositeType", "sap/ui/core/Element"], function(CompositeType, Element) {
	"use strict";
		/**
		 * Constructor for a new sap.rules.ui.type.ExpressionAbs.
		 *
		 * @param {object} ExpressionLanguage
		 *
		 * @class
		 * Abstract class will be extend by all dedicated types (DecisionTableHeaderSetting, DecisionTableHeader etc.)
		 * @extends  sap.ui.model.CompositeType
		 *
		 * @author SAP SE
		 * @version 1.132.0
		 *
		 * @constructor
		 * @private
		 * @alias ssap.rules.ui.type.ExpressionAbs
		 */

	var ExpressionAbs = CompositeType.extend("sap.rules.ui.type.ExpressionAbs", {
		constructor: function(expressionLanguage, expressionLanguageVersion) {
			this.bParseWithValues = true;
			this.expressionLanguage = (expressionLanguage instanceof Object)? expressionLanguage : Element.getElementById(expressionLanguage);
			this.sExpressionLanguageVersion = expressionLanguageVersion;
		},
		validateValue: function() {
			return true;
		},
		setExpressionLanguage: function(expressionLanguage){
			this.expressionLanguage = (expressionLanguage instanceof Object)? expressionLanguage : Element.getElementById(expressionLanguage);
		},
		setExpressionLanguageVersion: function(expressionLanguageVersion){
			this.sExpressionLanguageVersion = expressionLanguageVersion;
		}
	});

	return ExpressionAbs;

}, /* bExport= */ true);

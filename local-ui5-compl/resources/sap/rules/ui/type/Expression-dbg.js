/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides control sap.rules.ui.
sap.ui.define(["sap/rules/ui/type/ExpressionAbs", "sap/rules/ui/library",], function(ExpressionAbs,library) {
	"use strict";

	var ExpressionType = ExpressionAbs.extend(
		"sap.rules.ui.type.Expression", {
			/**
			 * format expression value to display value
			 * @param {string} sValues - expression for conversion
			 * @returns {string} converted expression
			 */
			formatValue: function(sValues) {
				var sExpression = sValues;
				var sExpressionType = library.ExpressionType.All;
				if (!this.expressionLanguage) {
					return sExpression;
				}

				if (sExpression) {
					var result = this.expressionLanguage.convertDecisionTableExpressionToDisplayValue(sExpression, "", "", sExpressionType);
					if (result.output.status === "Success") {
						return result.output.converted.header;
					}
				}
				return sExpression;
			},

			/**
			 * parse expression value to code value
			 * @param {string} sExpression - expression display value
			 * @returns {string} converted expression to model value
			 */
			parseValue: function(sExpression) {
				var sExpressionType = library.ExpressionType.All;

				if (!this.expressionLanguage) {
					return sExpression;
				}

				if (sExpression) {
					var result = this.expressionLanguage.convertDecisionTableExpressionToModelValue(sExpression, "", "", sExpressionType);
					if (result.output.status === "Success") {
						return result.output.converted.header;
					}
				}
				return sExpression;
			}
		});

	return ExpressionType;

}, /* bExport= */ true);

//
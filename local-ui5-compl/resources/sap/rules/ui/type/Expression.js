/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/rules/ui/type/ExpressionAbs","sap/rules/ui/library"],function(e,s){"use strict";var r=e.extend("sap.rules.ui.type.Expression",{formatValue:function(e){var r=e;var u=s.ExpressionType.All;if(!this.expressionLanguage){return r}if(r){var t=this.expressionLanguage.convertDecisionTableExpressionToDisplayValue(r,"","",u);if(t.output.status==="Success"){return t.output.converted.header}}return r},parseValue:function(e){var r=s.ExpressionType.All;if(!this.expressionLanguage){return e}if(e){var u=this.expressionLanguage.convertDecisionTableExpressionToModelValue(e,"","",r);if(u.output.status==="Success"){return u.output.converted.header}}return e}});return r},true);
//# sourceMappingURL=Expression.js.map
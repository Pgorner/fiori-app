/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/rules/ui/type/ExpressionAbs"],function(e){"use strict";var s=e.extend("sap.rules.ui.type.DecisionTableCell",{formatValue:function(e){var s,n;if(e.length===3){s=e[0];n=e[2]}else{s=e[2];n=e[3]}if(!this.expressionLanguage){return s}return n},parseValue:function(e,s,n){var t;var i;var u=n.length===3;if(!this.expressionLanguage||!e){t=e}else if(u){i=this.expressionLanguage.convertDecisionTableExpressionToModelValue(e,"","",n[1],this.sExpressionLanguageVersion);t=i.output.status==="Success"?i.output.converted.header:e}else{i=this.expressionLanguage.convertDecisionTableExpressionToModelValue(n[0],n[1],e,"",this.sExpressionLanguageVersion);t=i.output.status==="Success"?i.output.converted.cell:e}if(u){n[0]=t;n[2]=e}else{n[2]=t;n[3]=e}return n}});return s},true);
//# sourceMappingURL=DecisionTableCell.js.map
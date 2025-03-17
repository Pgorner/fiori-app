/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/model/CompositeType","sap/ui/core/Element"],function(e,s){"use strict";var n=e.extend("sap.rules.ui.type.ExpressionAbs",{constructor:function(e,n){this.bParseWithValues=true;this.expressionLanguage=e instanceof Object?e:s.getElementById(e);this.sExpressionLanguageVersion=n},validateValue:function(){return true},setExpressionLanguage:function(e){this.expressionLanguage=e instanceof Object?e:s.getElementById(e)},setExpressionLanguageVersion:function(e){this.sExpressionLanguageVersion=e}});return n},true);
//# sourceMappingURL=ExpressionAbs.js.map
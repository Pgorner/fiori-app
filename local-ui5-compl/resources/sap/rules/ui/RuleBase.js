/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["./library","sap/ui/core/Control"],function(e,a){"use strict";var s=a.extend("sap.rules.ui.RuleBase",{metadata:{properties:{bindingContextPath:{type:"string",group:"Misc",defaultValue:""},modelName:{type:"string",group:"Misc",defaultValue:""},editable:{type:"boolean",defaultValue:true}},library:"sap.rules.ui",associations:{expressionLanguage:{type:"sap.rules.ui.services.ExpressionLanguage",multiple:false,singularName:"expressionLanguage"},astExpressionLanguage:{type:"sap.rules.ui.services.AstExpressionLanguage",multiple:false,singularName:"astExpressionLanguage"}}}});return s},true);
//# sourceMappingURL=RuleBase.js.map
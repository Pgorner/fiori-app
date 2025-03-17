/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control"],function(e){"use strict";var a=e.extend("sap.rules.ui.ExpressionBase",{metadata:{abstract:true,properties:{value:{type:"string",defaultValue:"",bindable:"bindable"},editable:{type:"boolean",defaultValue:true},validateOnLoad:{type:"boolean",defaultValue:false},valueStateText:{type:"string",defaultValue:null,bindable:"bindable"},valueState:{type:"string",defaultValue:"None",bindable:"bindable"},attributeInfo:{type:"string",defaultValue:null,bindable:"bindable"},headerInfo:{type:"object",defaultValue:"{}"}},associations:{expressionLanguage:{type:"sap.rules.ui.services.ExpressionLanguage",multiple:false,singularName:"expressionLanguage"},astExpressionLanguage:{type:"sap.rules.ui.services.AstExpressionLanguage",multiple:false,singularName:"astExpressionLanguage"}},publicMethods:["validate"]},renderer:null});a.prototype.init=function(){};return a},true);
//# sourceMappingURL=ExpressionBase.js.map
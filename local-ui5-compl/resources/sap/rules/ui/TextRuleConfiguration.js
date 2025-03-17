/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["./library","sap/ui/core/Element"],function(e,t){"use strict";var n=t.extend("sap.rules.ui.TextRuleConfiguration",{metadata:{library:"sap.rules.ui",properties:{enableSettings:{type:"boolean",defaultValue:false},enableSettingResult:{type:"boolean",defaultValue:true},enableElse:{type:"boolean",defaultValue:true},enableElseIf:{type:"boolean",defaultValue:true}},events:{change:{parameters:{name:{},value:{}}}}},_handlePropertySetter:function(e,t){var n=this.setProperty(e,t,true);this.fireChange({name:e,value:t});return n},setEnableSettings:function(e){return this._handlePropertySetter("enableSettings",e)},setEnableSettingResult:function(e){return this._handlePropertySetter("enableSettingResult",e)},setEnableElse:function(e){return this._handlePropertySetter("enableElse",e)},setEnableElseIf:function(e){return this._handlePropertySetter("enableElseIf",e)}});return n},true);
//# sourceMappingURL=TextRuleConfiguration.js.map
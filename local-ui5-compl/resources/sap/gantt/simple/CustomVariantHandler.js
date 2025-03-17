/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"],function(t){"use strict";var e=t.extend("sap.gantt.simple.CustomVariantHandler",{metadata:{properties:{data:{type:"object",multiple:false},dependantControlID:{type:"string[]",multiple:false,defaultValue:[]}}},setData:function(t){this.setProperty("data",t);this.fireEvent("dataSettingComplete")},apply:function(){},revert:function(){}});return e});
//# sourceMappingURL=CustomVariantHandler.js.map
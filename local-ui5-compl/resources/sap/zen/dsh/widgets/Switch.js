/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/m/Switch"],function(jQuery,e,t){"use strict";return t.extend("com.sap.ip.bi.Switch",{metadata:{properties:{mode:{type:"string",defaultValue:"OnOff"}}},initDesignStudio:function(){var e=this;this.attachChange(function(){e.fireDesignStudioPropertiesChangedAndEvent(["state"],"onChange")})},setMode:function(e){var t;var i;var s;if(e==="Blank"){i=" ";s=" ";t=sap.m.SwitchType.Default}else if(e==="AcceptReject"){i="";s="";t=sap.m.SwitchType.AcceptReject}else{i="";s="";t=sap.m.SwitchType.Default}this.setCustomTextOn(i);this.setCustomTextOff(s);this.setType(t);this.setProperty("mode",e)},renderer:{}})});
//# sourceMappingURL=Switch.js.map
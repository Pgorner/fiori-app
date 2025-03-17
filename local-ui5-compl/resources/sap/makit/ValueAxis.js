/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define(["./library","./Axis"],function(t,e){"use strict";var i=e.extend("sap.makit.ValueAxis",{metadata:{deprecated:true,library:"sap.makit",properties:{min:{type:"string",group:"Misc",defaultValue:null},max:{type:"string",group:"Misc",defaultValue:null}}}});i.prototype.init=function(){this.setShowGrid(true);this.setShowPrimaryLine(false)};return i});
//# sourceMappingURL=ValueAxis.js.map
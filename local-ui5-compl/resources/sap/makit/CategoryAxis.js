/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define(["./library","./Axis"],function(e,t){"use strict";var r=e.SortOrder;var a=t.extend("sap.makit.CategoryAxis",{metadata:{deprecated:true,library:"sap.makit",properties:{sortOrder:{type:"sap.makit.SortOrder",group:"Misc",defaultValue:r.None},displayLastLabel:{type:"boolean",group:"Misc",defaultValue:false},displayAll:{type:"boolean",group:"Misc",defaultValue:true}}}});a.prototype.init=function(){this.setShowGrid(false);this.setShowPrimaryLine(true)};return a});
//# sourceMappingURL=CategoryAxis.js.map
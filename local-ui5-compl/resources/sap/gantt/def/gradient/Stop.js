/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["../DefBase"],function(t){"use strict";var e=t.extend("sap.gantt.def.gradient.Stop",{metadata:{library:"sap.gantt",properties:{offSet:{type:"string",defaultValue:"5%"},stopColor:{type:"sap.gantt.ValueSVGPaintServer",defaultValue:"#FFFFFF"},stopOpacity:{type:"float",defaultValue:1}}}});e.prototype.getDefString=function(){return"<stop id='"+this.getId()+"' offset='"+this.getOffSet()+"' stop-color='"+this.getStopColor()+"' stop-opacity='"+this.getStopOpacity()+"' />"};return e},true);
//# sourceMappingURL=Stop.js.map
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log","sap/gantt/shape/Path","sap/gantt/misc/Format"],function(a,e,i){"use strict";var t=e.extend("sap.gantt.shape.ext.ulc.UlcClipingPath",{});t.prototype.getD=function(e,t){var s="";if(this.mShapeConfig.hasShapeProperty("d")){s=this._configFirst("d",e)}else if(e.values){for(var r=0;r<e.values.length;r++){var n=this.getAxisTime();var o=n.timeToView(i.abapTimestampToDate(e.values[r].from));var h=n.timeToView(i.abapTimestampToDate(e.values[r].to));var l=e.values[r].value;if(isNaN(l)){l=0}var p=25;if(this.mShapeConfig.hasShapeProperty("maxVisibleRatio")){p=this._configFirst("maxVisibleRatio",e)}if(l>100+p){l=100+p}var v=t.y+t.rowHeight-t.rowHeight*(l/(100+p));var g=t.y+t.rowHeight;s=s+(e.values[r].firstOne?" M "+o+" "+g:"")+" L "+o+" "+v+" L "+h+" "+v+(e.values[r].lastOne?" L "+h+" "+g:"")}}if(this.isValid(s)){return s}else{a.warning("UlcClipingPath shape generated invalid d: "+s+" from the given data: "+e);return null}};return t},true);
//# sourceMappingURL=UlcClipingPath.js.map
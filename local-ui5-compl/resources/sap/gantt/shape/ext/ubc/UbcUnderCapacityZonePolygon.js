/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/misc/Format","sap/gantt/shape/ext/ubc/UbcPolygon"],function(t,e){"use strict";var i=e.extend("sap.gantt.shape.ext.ubc.UbcUnderCapacityZonePolygon",{});i.prototype.getFill=function(t,e){if(this.mShapeConfig.hasShapeProperty("fill")){return this._configFirst("fill",t)}return"#40d44c"};i.prototype.getPoints=function(e,i){if(this.mShapeConfig.hasShapeProperty("points")){return this._configFirst("points",e)}var a="";var r=this._getMaxY(e,i);var o=this._getMaxTotalRevised(e);var s=i.rowHeight-1;var n=e.drawData?e.drawData:e.period;var p=this.getAxisTime();for(var h=0;h<n.length;h++){var f=n[h];var g,m;g=p.timeToView(t.abapTimestampToDate(f.start_date)).toFixed(1);if(h<n.length-1){m=p.timeToView(t.abapTimestampToDate(n[h+1].start_date)).toFixed(1)}else{m=p.timeToView(t.abapTimestampToDate(n[h].start_date)).toFixed(1)}if(!jQuery.isNumeric(g)){g=p.timeToView(0).toFixed(1)}if(!jQuery.isNumeric(m)){m=p.timeToView(0).toFixed(1)}if(h===0){a+=g+","+r+" "}var u=r-f.supply/o*s;u=u.toFixed(1);a+=g+","+u+" ";a+=m+","+u+" ";if(h===n.length-1){a+=g+","+u+" ";a+=g+","+r+" "}}return a};return i},true);
//# sourceMappingURL=UbcUnderCapacityZonePolygon.js.map
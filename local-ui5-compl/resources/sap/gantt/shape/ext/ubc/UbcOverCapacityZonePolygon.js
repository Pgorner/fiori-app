/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/ext/ubc/UbcPolygon"],function(t){"use strict";var e=t.extend("sap.gantt.shape.ext.ubc.UbcOverCapacityZonePolygon",{});e.prototype.getFill=function(t,e){if(this.mShapeConfig.hasShapeProperty("fill")){return this._configFirst("fill",t)}var r,i;if(this.mShapeConfig.hasShapeProperty("backgroundColor")){r=this._configFirst("backgroundColor",t)}if(this.mShapeConfig.hasShapeProperty("pattern")){i=this._configFirst("pattern",t)}var o;if(r&&i){o="pattern_"+i+"_"+(r.indexOf("#")==0?r.substring(1,r.length):r)}if(o&&sap.ui.getCore().byId(o)){return sap.ui.getCore().byId(o).getRefString()}};e.prototype.getStroke=function(t,e){if(this.mShapeConfig.hasShapeProperty("stroke")){return this._configFirst("stroke",t)}return"#CAC7BA"};e.prototype.getStrokeWidth=function(t,e){if(this.mShapeConfig.hasShapeProperty("strokeWidth")){return this._configFirst("strokeWidth",t)}return.3};e.prototype.getPoints=function(t,e){if(this.mShapeConfig.hasShapeProperty("points")){return this._configFirst("points",t)}var r="";var i=this.getShapeViewBoundary();if(i){r=i[0]+","+e.y+" "+(i[1]-i[0])+","+e.y+" "+(i[1]-i[0])+","+(e.y+e.rowHeight)+" "+i[0]+","+(e.y+e.rowHeight);return r}};return e},true);
//# sourceMappingURL=UbcOverCapacityZonePolygon.js.map
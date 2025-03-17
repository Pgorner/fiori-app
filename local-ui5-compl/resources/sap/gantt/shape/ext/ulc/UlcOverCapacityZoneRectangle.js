/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/ext/ulc/UlcRectangle"],function(t){"use strict";var e=t.extend("sap.gantt.shape.ext.ulc.UlcOverCapacityZoneRectangle",{});e.prototype.getFill=function(t,e){if(this.mShapeConfig.hasShapeProperty("fill")){return this._configFirst("fill",t)}var r,i;if(this.mShapeConfig.hasShapeProperty("backgroundColor")){r=this._configFirst("backgroundColor",t)}if(this.mShapeConfig.hasShapeProperty("pattern")){i=this._configFirst("pattern",t)}var n;if(r&&i){n="pattern_"+i+"_"+(r.indexOf("#")==0?r.substring(1,r.length):r)}if(n&&sap.ui.getCore().byId(n)){return sap.ui.getCore().byId(n).getRefString()}return"#F6F6F6"};e.prototype.getStroke=function(t,e){if(this.mShapeConfig.hasShapeProperty("stroke")){return this._configFirst("stroke",t)}return"#CAC7BA"};e.prototype.getStrokeWidth=function(t,e){if(this.mShapeConfig.hasShapeProperty("strokeWidth")){return this._configFirst("strokeWidth",t)}return 0};return e},true);
//# sourceMappingURL=UlcOverCapacityZoneRectangle.js.map
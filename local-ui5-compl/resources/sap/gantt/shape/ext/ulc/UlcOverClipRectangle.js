/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/ext/ulc/UlcRectangle"],function(t){"use strict";var e=t.extend("sap.gantt.shape.ext.ulc.UlcOverClipRectangle",{});e.prototype.getFill=function(t,e){if(this.mShapeConfig.hasShapeProperty("fill")){return this._configFirst("fill",t)}return"#FF0000"};e.prototype.getClipPath=function(t,e){if(this.mShapeConfig.hasShapeProperty("clipPath")){return this._configFirst("clipPath",t)}var i=e.uid;var r=new RegExp("\\[|\\]|:|\\|","g");var n=i.replace(r,"_");return"url(#"+n+"_"+t.id+"_"+t.dimension+")"};return e},true);
//# sourceMappingURL=UlcOverClipRectangle.js.map
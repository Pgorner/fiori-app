/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Polygon"],function(t){"use strict";var e=t.extend("sap.gantt.shape.ext.ubc.UbcPolygon",{metadata:{abstract:true}});e.prototype.getEnableSelection=function(t,e){if(this.mShapeConfig.hasShapeProperty("enableSelection")){return this._configFirst("enableSelection",t)}return false};e.prototype._getMaxY=function(t,e){var a=e.y;var r=e.rowHeight-1;var n=a+r;return n};e.prototype._getMaxTotal=function(t){var e=Math.max.apply(Math,t.period.map(function(t){return t.supply}));if(e<=0){e=1}return e};e.prototype._getmaxExceedCap=function(t,e){var a;if(e){a=e}else{a=this._getMaxTotal(t)}var r=25;if(this.mShapeConfig.hasShapeProperty("maxExceedCapacity")){r=this._configFirst("maxExceedCapacity",t)}return a*r/100};e.prototype._getMaxTotalRevised=function(t){var e=this._getMaxTotal(t);var a=this._getmaxExceedCap(t,e)+e;return a};return e},true);
//# sourceMappingURL=UbcPolygon.js.map
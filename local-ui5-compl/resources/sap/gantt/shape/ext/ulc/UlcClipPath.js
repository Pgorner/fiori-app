/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/ClipPath"],function(t){"use strict";var e=t.extend("sap.gantt.shape.ext.ulc.UlcClipPath",{});e.prototype.getHtmlClass=function(t,e){if(this.mShapeConfig.hasShapeProperty("htmlClass")){return this._configFirst("htmlClass",t)}var a=e.uid;var s=new RegExp("\\[|\\]|:|\\|","g");var i=a.replace(s,"_");return i+"_"+t.id+"_"+t.dimension};return e},true);
//# sourceMappingURL=UlcClipPath.js.map
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Text","sap/ui/core/IconPool"],function(t,e){"use strict";var n=t.extend("sap.gantt.shape.ext.Iconfont",{metadata:{properties:{name:{type:"string"},collectionName:{type:"string"}}}});n.prototype.getText=function(t,n){if(this.mShapeConfig.hasShapeProperty("text")){return this._configFirst("text",t)}var i=this.getName(t,n),o=this.getCollectionName(t,n);if(o===""){o=undefined}var r=e.getIconInfo(i,o);if(r){return r.content}};n.prototype.getName=function(t){return this._configFirst("name",t)};n.prototype.getCollectionName=function(t){return this._configFirst("collectionName",t)};n.prototype.getFontFamily=function(t,n){if(this.mShapeConfig.hasShapeProperty("fontFamily")){return this._configFirst("fontFamily",t)}var i=this.getName(t,n);var o=this.getCollectionName(t,n);if(o===""){o=undefined}var r=e.getIconInfo(i,o);if(r){return r.fontFamily}};return n},true);
//# sourceMappingURL=Iconfont.js.map
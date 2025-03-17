/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Shape"],function(t){"use strict";var e=t.extend("sap.gantt.shape.Circle",{metadata:{properties:{tag:{type:"string",defaultValue:"circle"},cx:{type:"float"},cy:{type:"float"},r:{type:"float",defaultValue:5}}}});e.prototype.init=function(){t.prototype.init.apply(this,arguments);var e=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",e.getText("ARIA_CIRCLE"))};e.prototype.getCx=function(t,e){if(this.mShapeConfig.hasShapeProperty("cx")){return this._configFirst("cx",t)}return this.getRotationCenter(t,e)[0]};e.prototype.getCy=function(t,e){if(this.mShapeConfig.hasShapeProperty("cy")){return this._configFirst("cy",t)}return this.getRowYCenter(t,e)};e.prototype.getR=function(t){return this._configFirst("r",t,true)};e.prototype.getStyle=function(e,r){var i=t.prototype.getStyle.apply(this,arguments);var a={fill:this.determineValueColor(this.getFill(e,r)),"fill-opacity":this.getFillOpacity(e,r)};var p=Object.assign(i,a);return p};return e},true);
//# sourceMappingURL=Circle.js.map
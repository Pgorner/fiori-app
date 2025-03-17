/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Rectangle"],function(t){"use strict";var e=t.extend("sap.gantt.shape.ext.ulc.UlcRectangle",{metadata:{abstract:true}});e.prototype.getFill=function(){return t.prototype.getFill.apply(this,arguments)||"transparent"};e.prototype.getX=function(t,e){if(this.mShapeConfig.hasShapeProperty("x")){return this._configFirst("x",t)}var i=this.getShapeViewBoundary();if(i){return i[0]}return 0};e.prototype.getY=function(t,e){if(this.mShapeConfig.hasShapeProperty("y")){return this._configFirst("y",t)}return e.y};e.prototype.getWidth=function(t,e){if(this.mShapeConfig.hasShapeProperty("width")){return this._configFirst("width",t)}var i=this.getShapeViewBoundary();if(i){return i[1]-i[0]}return 0};e.prototype.getHeight=function(t,e){if(this.mShapeConfig.hasShapeProperty("height")){return this._configFirst("height",t)}var i=25;if(this.mShapeConfig.hasShapeProperty("maxVisibleRatio")){i=this._configFirst("maxVisibleRatio",t)}return e.rowHeight*i/(100+i)};return e},true);
//# sourceMappingURL=UlcRectangle.js.map
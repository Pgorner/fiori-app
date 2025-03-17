/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","sap/ui/core/Element"],function(e,t){"use strict";var a=t.extend("sap.gantt.config.Shape",{metadata:{library:"sap.gantt",properties:{key:{type:"string",defaultValue:null},shapeClassName:{type:"string",defaultValue:null},shapeDataName:{type:"string",defaultValue:null},modeKeys:{type:"string[]",defaultValue:[]},level:{type:"string",defaultValue:null},shapeProperties:{type:"object",defaultValue:e.config.DEFAULT_EMPTY_OBJECT},groupAggregation:{type:"object[]"},clippathAggregation:{type:"object[]"},selectedClassName:{type:"string",defaultValue:null},switchOfCheckBox:{type:"string",defaultValue:"noShow"},resizeShadowClassName:{type:"string",defaultValue:null},countInBirdEye:{type:"boolean",defaultValue:false}}}});a.prototype.hasShapeProperty=function(e){return this.getShapeProperties().hasOwnProperty(e)};a.prototype.getShapeProperty=function(e){return this.getShapeProperties()[e]};return a},true);
//# sourceMappingURL=Shape.js.map
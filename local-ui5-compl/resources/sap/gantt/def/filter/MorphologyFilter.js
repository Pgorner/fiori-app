/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","../DefBase"],function(e,r){"use strict";var t=r.extend("sap.gantt.def.filter.MorphologyFilter",{metadata:{library:"sap.gantt",properties:{operator:{type:"string",defaultValue:e.def.filter.MorphologyOperator.Dilate},radius:{type:"string",defaultValue:"2,1"},colorMatrix:{type:"string",defaultValue:e.def.filter.ColorMatrixValue.AllToWhite}}}});t.prototype.getDefString=function(){return"<filter id='"+this.getId()+"'>"+"<feMorphology in='SourceAlpha' result='morphed' operator='"+this.getOperator()+"' radius='"+this.getRadius()+"'/>"+"<feColorMatrix in='morphed' result='recolored' type='matrix' values='"+this.getColorMatrix()+"'/>"+"<feMerge>"+"<feMergeNode in='recolored'/>"+"<feMergeNode in='SourceGraphic'/>"+"</feMerge>"+"</filter>"};return t},true);
//# sourceMappingURL=MorphologyFilter.js.map
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseGroup","sap/gantt/simple/LegendShapeGroupOrientation"],function(e,t){"use strict";var a=e.extend("sap.gantt.simple.LegendShapeGroup",{metadata:{library:"sap.gantt",properties:{orientation:{type:"sap.gantt.simple.LegendShapeGroupOrientation",defaultValue:t.Vertical},title:{type:"string"}},aggregations:{shapes:{type:"sap.gantt.simple.BaseShape",multiple:true,singularName:"shape"}}}});return a},true);
//# sourceMappingURL=LegendShapeGroup.js.map
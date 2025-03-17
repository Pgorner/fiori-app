/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/table/Row"],function(e){"use strict";var t={};t.render=function(t,n){t.openStart("div",n);t.class("sapUiGanttTableAction");t.style("height","100%");t.style("width","100%");if(!(n.getParent()instanceof e)){t.style("display","none")}if(!n.getVisible()){t.class("sapUiTableActionHidden")}t.openEnd();var i=n.getAggregation("controlTemplate");t.renderControl(i);t.close("div")};return t},true);
//# sourceMappingURL=GanttRowActionRenderer.js.map
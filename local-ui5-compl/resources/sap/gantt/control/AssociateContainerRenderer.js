/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"],function(e){"use strict";var t={};t.render=function(t,n){if(n.getEnableRootDiv()){t.openStart("div",n);t.class("sapGanttChartLayoutBG");t.style("width","100%");t.style("height","100%");t.style("overflow","hidden");t.openEnd()}t.renderControl(e.getElementById(n.getContent()));if(n.getEnableRootDiv()){t.close("div")}};return t},true);
//# sourceMappingURL=AssociateContainerRenderer.js.map
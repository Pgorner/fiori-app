/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var e={apiVersion:2};e.render=function(e,n){if(!n.getVisible()){return}e.openStart("div",n);e.class("sapRULDecisionTableSCell");e.openEnd();e.renderControl(n.getAggregation("_displayedControl"));e.close("div")};return e},true);
//# sourceMappingURL=DecisionTableCellRenderer.js.map
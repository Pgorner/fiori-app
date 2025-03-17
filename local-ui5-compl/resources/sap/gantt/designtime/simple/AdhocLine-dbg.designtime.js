/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
// Provides the Design Time Metadata for the sap.gantt.simple.AdhocLine class
sap.ui.define([
	"sap/gantt/changeHandlers/simple/AdhocLine",
	"sap/gantt/utils/GanttCustomisationUtils"
],
	function(
		AdhocLine,
		GanttCustomisationUtils) {
	"use strict";
	return {
        domRef : function(oLine){
			return oLine._getMarker() && oLine._getMarker().getDomRef();
        },
        aggregations: {
            _marker : {
				ignore : true
            },
            _line : {
				ignore : true
            },
            _headerLine : {
				ignore : true
			}
        },
		actions: {
            settings: GanttCustomisationUtils.designTimeSettings.bind(null, "TXT_DT_ADHOCLINE", AdhocLine.fnConfigureALSettings)
		}
	};
});
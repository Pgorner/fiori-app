/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
// Provides the Design Time Metadata for the sap.gantt.simple.DeltaLine class
sap.ui.define([
	"sap/gantt/changeHandlers/simple/DeltaLine",
	"sap/gantt/utils/GanttCustomisationUtils"
],
	function(
		DeltaLine,
		GanttCustomisationUtils) {
	"use strict";
	return {
        domRef : function(oLine){
			return oLine._getHeaderDeltaArea().getDomRef();
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
            settings: GanttCustomisationUtils.designTimeSettings.bind(null, "TXT_DT_DELTALINE", DeltaLine.fnConfigureALSettings)
		}
	};
});
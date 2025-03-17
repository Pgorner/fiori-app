/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/gantt/utils/GanttCustomisationUtils"
], function (
    GanttCustomisationUtils
) {
    "use strict";
    /**
     * Change handler for editing a Adhocline of sap.gantt.simple.GanttChartWithTable
     *
     * @constructor
     *
     * @alias sap.gantt.changeHandlers.simple.Adhocline
     *
     * @author SAP SE
     *
     * @version 1.132.0
     *
     * @since 1.90
     */

    var AdhocLine = {
        getDialogBox: function(oAdhocline) {
            return GanttCustomisationUtils.dialogBox(oAdhocline, false);
        }
    };

    AdhocLine.fnConfigureALSettings = function (oSelectedElement) {
        return AdhocLine.getDialogBox(oSelectedElement).then(function (mChangeContent) {
            return [
                {
                    selectorControl: oSelectedElement,
                    changeSpecificData: {
                        changeType: "ganttAdhocLineSettings",
                        content: mChangeContent
                    }
                }
            ];
        });
    };

    return AdhocLine;
},
/* bExport= */true);
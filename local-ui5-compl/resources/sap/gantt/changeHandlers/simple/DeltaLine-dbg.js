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
     * Change handler for editing a Deltaline of sap.gantt.simple.GanttChartWithTable
     *
     * @constructor
     *
     * @alias sap.gantt.changeHandlers.simple.Deltaline
     *
     * @author SAP SE
     *
     * @version 1.132.0
     *
     * @since 1.90
     */

    var DeltaLine = {
        getDialogBox: function(oDeltaline) {
            return GanttCustomisationUtils.dialogBox(oDeltaline, true);
        }
    };

    DeltaLine.fnConfigureALSettings = function (oSelectedElement) {
        return DeltaLine.getDialogBox(oSelectedElement).then(function (mChangeContent) {
            return [
                {
                    selectorControl: oSelectedElement,
                    changeSpecificData: {
                        changeType: "ganttDeltaLineSettings",
                        content: mChangeContent
                    }
                }
            ];
        });
    };

    return DeltaLine;
},
/* bExport= */true);
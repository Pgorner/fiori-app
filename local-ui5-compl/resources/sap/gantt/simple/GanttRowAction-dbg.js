/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides control sap.gantt.simple.GanttRowAction
sap.ui.define([
	"sap/ui/table/RowAction",
	"sap/gantt/library",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function(TableRowAction, library, GanttChartConfigurationUtils) {
	"use strict";

	var GanttRowActionColumnContent = library.simple.yAxisColumnContent;

	/**
	 * Creates and initializes a new GanttRowAction class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables users to define a control aggregation for RowAction
	 *
	 * @extends sap.ui.table.RowAction
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @alias sap.gantt.simple.GanttRowAction
	 */
	var GanttRowAction = TableRowAction.extend("sap.gantt.simple.GanttRowAction", /** @lends sap.gantt.simple.GanttRowAction.prototype */{
		metadata: {
			library: "sap.gantt",
			properties: {
				/*
				* Row ID uniquely identifying the row
				*/
				rowId: {type: "string"},
				/*
				* Column width for the GanttRowAction column
				*/
				columnWidth: {type:"int", defaultValue:192},
				/*
				 * Column content for GanttRowAction Column
				 * @since 1.102
				 */
				columnContent: {type: "sap.gantt.simple.yAxisColumnContent", defaultValue : GanttRowActionColumnContent.ThresholdwithLabelandUOM}

			},
			aggregations: {

				/**
				 * The control aggregation for the GanttRowAction
				 */
				controlTemplate: {type : "sap.ui.core.Control", multiple : false}

			}
		},
        init: function() {
            this._bFixedLayout = true;
            this._aActions = ["", ""];
            this._iLastCloseTime = 0;
        },
        onBeforeRendering: function() {
			var oGantt = this.getRow().getTable().getParent();
			oGantt._oSplitter.detachResize(this.setTableColumnStyle, this);
        },
		onAfterRendering: function() {
			var oGantt = this.getRow().getTable().getParent();
			oGantt._oSplitter.attachResize(this.setTableColumnStyle, this);
			this.setTableColumnStyle();
		},
		setTableColumnStyle: function() {
			var bRTL = GanttChartConfigurationUtils.getRTL();
			//Width
			if (this.getRow()){
				var oTable = this.getRow().getTable(),
					sTableId = oTable && oTable.getId();
				if (sTableId){
					var oRowActionColumnWidth;
					if (this.getColumnContent() === GanttRowActionColumnContent.ThresholdwithLabelandUOM) {
						oRowActionColumnWidth =  (this.mProperties.hasOwnProperty("columnWidth") && this.getColumnWidth() > 192) ? this.getColumnWidth() + "px" : 192 + "px";
					} else if (this.getColumnContent() === GanttRowActionColumnContent.ThresholdwithLabel) {
						oRowActionColumnWidth = (this.mProperties.hasOwnProperty("columnWidth") && this.getColumnWidth() > 124) ? this.getColumnWidth() + "px" : 124 + "px";
					} else if (this.getColumnContent() === GanttRowActionColumnContent.ThresholdwithUOM) {
						oRowActionColumnWidth = (this.mProperties.hasOwnProperty("columnWidth") && this.getColumnWidth() > 128) ? this.getColumnWidth() + "px" : 128 + "px";
					} else if (this.getColumnContent() === GanttRowActionColumnContent.OnlyThreshold) {
						oRowActionColumnWidth = (this.mProperties.hasOwnProperty("columnWidth") && this.getColumnWidth() > 52) ? this.getColumnWidth() + "px" : 52 + "px";
					}

					if (bRTL) {
						document.getElementById(sTableId + "-sapUiTableColHdrScr").style.marginLeft = oRowActionColumnWidth;
						document.getElementById(sTableId + "-sapUiTableCtrlScr").style.marginLeft = oRowActionColumnWidth;
					} else {
						document.getElementById(sTableId + "-sapUiTableColHdrScr").style.marginRight = oRowActionColumnWidth;
						document.getElementById(sTableId + "-sapUiTableCtrlScr").style.marginRight = oRowActionColumnWidth;
					}
					document.getElementById(sTableId + "-rowacthdr").style.width = oRowActionColumnWidth;
					document.getElementById(sTableId + "-sapUiTableRowActionScr").style.width = oRowActionColumnWidth;

					document.getElementById(this.getId()).parentElement.style.width = oRowActionColumnWidth;
				}
			}
		},//Override the TableRowAction.getAccessibilityInfo() in case of GanttRowAtion to remove the unnecessary information getting read out.
		getAccessibilityInfo: function() {
			return {
				focusable: true,
				enabled: true,
				description: ""
			};
		}
	});

	return GanttRowAction;
});

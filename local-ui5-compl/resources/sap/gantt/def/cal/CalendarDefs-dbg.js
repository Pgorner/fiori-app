/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/def/SvgDefs"
], function (SvgDefs) {
	"use strict";

	/**
	 * Specific 'def' elements for the calendar.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Calendar pattern definition. This class generates the 'defs' tag from the 'defs' aggregation.
	 *
	 * <p>
	 * Calendar (for non-working hours) is a widely used graphic element in a Gantt chart. Calendar is considered to be highly reusable between different rows of
	 * resources. A default implementation of patterns is provided. After calendars are rendered from def tags, shape <code>sap.gantt.shape.cal.Calendar</code> can be
	 * used to consume the calendar pattern definition.
	 *
	 * This class is extended to provide a specific logic for generating referencing strings for calendar patterns.
	 * </p>
	 *
	 * @extends sap.gantt.def.SvgDefs
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.def.cal.CalendarDefs
	 */
	var CalendarDefs = SvgDefs.extend("sap.gantt.def.cal.CalendarDefs", /** @lends sap.gantt.def.cal.CalendarDefs */ {
		metadata: {
			library: "sap.gantt",
			aggregations: {

				/**
				 * @since 1.91
				 * Denotes additional aggregations for calendar definitions
				 * These aggregations should be used only for instances of calendarDef aggregation of {@link sap.gantt.simple.GanttChartWithTable}, and not of {@link sap.gantt.GanttChartBase}
				 */
				defs1: {type: "sap.gantt.def.DefBase", multiple: true, visibility: "public", singularName: "def1", bindable: "bindable"},
				/**
				 * @since 1.91
				 * Denotes additional aggregations for calendar definitions
				 * These aggregations should be used only for instances of calendarDef aggregation of {@link sap.gantt.simple.GanttChartWithTable}, and not of {@link sap.gantt.GanttChartBase}
				 */
				defs2: {type: "sap.gantt.def.DefBase", multiple: true, visibility: "public", singularName: "def2", bindable: "bindable"},
				/**
				 * @since 1.91
				 * Denotes additional aggregations for calendar definitions
				 * These aggregations should be used only for instances of calendarDef aggregation of {@link sap.gantt.simple.GanttChartWithTable}, and not of {@link sap.gantt.GanttChartBase}
				 */
				defs3: {type: "sap.gantt.def.DefBase", multiple: true, visibility: "public", singularName: "def3", bindable: "bindable"},
				/**
				 * @since 1.91
				 * Denotes additional aggregations for calendar definitions
				 * These aggregations should be used only for instances of calendarDef aggregation of {@link sap.gantt.simple.GanttChartWithTable}, and not of {@link sap.gantt.GanttChartBase}
				 */
				defs4: {type: "sap.gantt.def.DefBase", multiple: true, visibility: "public", singularName: "def4", bindable: "bindable"},
				/**
				 * @since 1.91
				 * Denotes additional aggregations for calendar definitions
				 * These aggregations should be used only for instances of calendarDef aggregation of {@link sap.gantt.simple.GanttChartWithTable}, and not of {@link sap.gantt.GanttChartBase}
				 */
				defs5: {type: "sap.gantt.def.DefBase", multiple: true, visibility: "public", singularName: "def5", bindable: "bindable"}
			}
		}
	});

	CalendarDefs.prototype.getRefString = function (calendarKey) {
		var sId = "";
		if (this.getParent() && this.getParent().getId()) {
			sId = this.getParent().getId();
		}
		return "url(#" + sId + "_" + calendarKey + ")";
	};

	/**
	 * Definition data of the SVG 'def' tag
	 * @param {object[]} - defs aggregation array
	 * @returns {object} - Definition string to be rendered by caller.
	 * @private
	 */
	CalendarDefs.prototype.getDefNode = function(oCalDef) {
		var oRetVal = {
			"id": this.getId(),
			"defNodes": []
		};

		for (var i = 0; i < oCalDef.length; i++){
			oRetVal.defNodes.push(oCalDef[i].getDefNode());
		}
		return oRetVal;
	};

	return CalendarDefs;
}, true);

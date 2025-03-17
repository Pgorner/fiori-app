/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseRectangle",
	"./RenderUtils",
	"./BaseShape",
	"sap/base/Log",
	"./BaseText",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function (BaseRectangle, RenderUtils, BaseShape, Log, BaseText, GanttChartConfigurationUtils) {
	"use strict";

	/**
	 * Creates a calendar shape that either consumes pattern from calendar in the 'def' package as the "calendarName" property is defined, or, it exists as any other instance of BasShape with defined relevant properties.
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BaseCalendar shape.
	 *
	 * <p>
	 * The Calendar shape can either be used in combination with Calendar def class {@link sap.gantt.def.cal.Calendar} which draws the SVG 'defs' tag, or it can be used as a standalone shape with time and end time defined.
	 * </p>
	 *
	 * @extends sap.gantt.simple.BaseRectangle
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseCalendar
	 */
	var BaseCalendar = BaseRectangle.extend("sap.gantt.simple.BaseCalendar", /** @lends sap.gantt.simple.BaseCalendar.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * Calendar name is used to map the base calendar with its calendar definition pattern.
				 * Do not set this property if you do not want to reuse the calendar definition across rows, and you want row wise different calendars. Instead set the time, endtime and fill the properties for the calendar shape.
				 * Providing values for calendarName, and time or endTime is considered as invalid. In such cases, time or endTime are ignored even if the calendarName is not available in calendar definitions.
				 */
				calendarName: {type: "string"}
			}
		}
	});
	var mAttributes = ["x", "y", "width", "height", "style", "opacity"];
	BaseCalendar.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		mSettings.height = mSettings.height || "inherit";
		BaseRectangle.prototype.applySettings.call(this, mSettings, oScope);
	};

	/**
	 * Gets current value of property <code>x</code>.
	 * If calendarName property is set then return 0 else if the time or endTime (in RTL mode) is present, return the x coordinate of the value correposning to the start time of the Calendar interval.
	 *
	 * @return {number} Value of property <code>x</code>.
	 * @public
	 */
	BaseCalendar.prototype.getX = function () {
		 if (this.getCalendarName()) {
			 //scenario of decoupling calendar and defintion
			 return 0;
		 } else {
			var bRTL = GanttChartConfigurationUtils.getRTL(),
			oTime = bRTL ? this.getEndTime() : this.getTime();
			if (oTime) {
				//combined calendar and definitons
				return BaseRectangle.prototype.getX.apply(this, arguments);
			} else {
				//error scenario
				Log.error("Either the calendarName or the time / endTime (if application is on RTL) is required for calendar to come up");
			}
		 }
	};

	/**
	 * Calendar is not a selectable shape. getSelectable always returns false
	 *
	 * @public
	 * @returns {boolean} false calendar is NOT selectable
	 */
	BaseCalendar.prototype.getSelectable = function () {
		return false;
	};

	/**
	 * Calendar width
	 * If calendarName property is set then return the full width of the gantt chart else if the time and endTime are present, return their difference.
	 *
	 * @public
	 * @returns {float} width of the calendar shape
	 */
	 BaseCalendar.prototype.getWidth = function () {
		if (this.getCalendarName()) {
			//scenario of decoupling calendar and defintion
			return this.getGanttChartBase().iGanttRenderedWidth;
		} else if (this.getTime() && this.getEndTime()) {
				//combined calendar and definitons
				return BaseRectangle.prototype.getWidth.apply(this, arguments);
			} else {
				Log.error("Either the calendarName or the time and endTime is required for calendar to come up");
			}
	};

	/*
	 * Gets current value of property <code>fill</code>.
	 *
	 * If calendarName property is set and a calendar pattern definition exists, return corresponding pattern definition matching the calendar name, else return the fill property.
	 *
	 * @return {string} Value of property <code>fill</code>.
	 * @public
	 */
	BaseCalendar.prototype.getFill = function () {
		var sCalendarName = this.getCalendarName();
		if (sCalendarName) {
			var oPaintServerDef = this.getGanttChartBase().getCalendarDef();
			if (oPaintServerDef) {
				return oPaintServerDef.getRefString(sCalendarName);
			}
		}
		return this.getProperty("fill");
	};

	BaseCalendar.prototype.renderElement = function (oRm, oElement) {
		if (!this._isValid()) {
			return;
		}
		oRm.openStart("rect", this.getId());
		if (this.aCustomStyleClasses) {
			this.aCustomStyleClasses.forEach(function(sClass){
				oRm.class(sClass);
			});
		}
		RenderUtils.renderAttributes(oRm, oElement, mAttributes);
		oRm.openEnd();
		if (!this.getCalendarName()) {
			RenderUtils.renderTooltip(oRm, oElement);
		}
		oRm.close("rect");
		if (!this.getCalendarName() && this.getTitle()) {
			RenderUtils.renderElementTitle(oRm, oElement, function (mTextSettings) {
				return new BaseText(mTextSettings);
			});
		}
		BaseShape.prototype.renderElement.apply(this, arguments);
	};

	BaseCalendar.prototype.isVisible = function() {
		if (this.getCalendarName()) {
			return true;
		}
	};

	return BaseCalendar;
}, true);

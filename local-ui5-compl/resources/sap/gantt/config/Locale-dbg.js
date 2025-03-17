/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/core/Element',
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/base/i18n/Localization"
], function (Element, GanttChartConfigurationUtils, Localization) {
	"use strict";
	/**
	 * Creates and initializes a new Locale
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The locale control is used for converting the UTC date time to your local date time
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.config.Locale
	 */
	var Locale = Element.extend("sap.gantt.config.Locale", /** @lends sap.gantt.config.Locale.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * Custom timezone for Gantt. The localization time zone is considered as the default time zone for the locale, see {@link sap.base.i18n.Localization#getTimezone}
				 */
				timeZone: {type: "string"},

				/**
				 * Gap value to the UTC time in the format hhmmss
				 * @deprecated Since version 1.119, the concept has been discarded.
				 */
				utcdiff: {type: "string", defaultValue: "000000"},

				/**
				 * Sign of the gap to the UTC time. Two valid values: "+" or "-".
				 * @deprecated Since version 1.119, the concept has been discarded.
				 */
				utcsign: {type: "string", defaultValue: "+"},

				/**
				 * Day-light saving time periods. Array of {@link sap.gantt.config.TimeHorizon}
				 * other locale info like langu, dateFormat, timeFormat and numberFormat, please use UI5 standard configuration object.
				 * @deprecated Since version 1.119, the concept has been discarded.
				 */
				dstHorizons: {type: "object[]", defaultValue: []}	// dst: day-light saving
			},
			designtime: "sap/ui/dt/designtime/notAdaptable.designtime"
		}
	});

	/**
	 * @private
	 */
	Locale.prototype.init = function () {
		this._onLocalizationChangedHandler = this._onLocalizationChanged.bind(this);
		Localization.attachChange(this._onLocalizationChangedHandler);
		Element.prototype.init.apply(this, arguments);
		this._triggerTimezoneChange(this.getTimeZone());
	};

	/**
	 * @returns {string} Returns the specified time zone
	 * The localization time zone is considered as the default time zone for the locale, see {@link sap.base.i18n.Localization#getTimezone}..
	 */
	Locale.prototype.getTimeZone = function () {
		var sTimeZone = this.getProperty("timeZone");

		return sTimeZone || GanttChartConfigurationUtils.getTimezone();
	};

	/**
	 * Aggregation to set the timezone to the locale
	 * @description Custom timezone for Gantt. The localization time zone is considered as the default time zone for the locale, see {@link sap.base.i18n.Localization#getTimezone}
	 * @param {string} sTimeZone Timezone to set
	 * @param {boolean} bSuppressInvalidate flag to suppress the invalidation and by default the locale will be invalidate
	 * @public
	 * @returns {sap.gantt.config.Locale} returns the control for chaining
	 */
	Locale.prototype.setTimeZone = function (sTimeZone, bSuppressInvalidate) {
		var sCurrentTimeZone = this.getProperty("timeZone");

		if (sCurrentTimeZone !== sTimeZone) {
			this.setProperty("timeZone", sTimeZone, bSuppressInvalidate);
			this._triggerTimezoneChange(sTimeZone);
		}

		return this;
	};


	/**
	 * @param {sap.ui.core.format.DateFormatWithTimezone} oFormatter formatter for the date input
	 * @param {Date} oDate Date to be formatted
	 * @returns {string} Returns formatted date
	 */
	Locale.prototype.getFormattedDate = function (oFormatter, oDate) {
		return oFormatter.format(oDate, this.getTimeZone());
	};

	/**
	 * @param {module:sap/base/i18n/Localization$ChangeEvent} oChanges event object
	 * @description The change event is fired, when the configuration options are changed.
	 * @private
	 */
	Locale.prototype._onLocalizationChanged = function (oChanges) {
		//console.log(this)
		var sTimezone = this.getProperty("timeZone");

		if (!sTimezone) {
			var sNewTimezone = oChanges.timezone;

			if (sNewTimezone && (sNewTimezone !== this._sCurrentLocalizationTimezone)) {
				this._sCurrentLocalizationTimezone = sNewTimezone;
				this._triggerTimezoneChange(sNewTimezone);
			}
		}
	};

	/**
	 * @private
	 */
	Locale.prototype._triggerTimezoneChange = function () {
		this._handleEvent(new jQuery.Event("TimezoneChanged"));
	};

	/**
	 * @private
	 */
	Locale.prototype.exit = function () {
		Localization.detachChange(this._onLocalizationChangedHandler);
		Element.prototype.exit.apply(this, arguments);
	};

	/**
	 * @returns {object} cloned locale
	 * @private
	 */
	Locale.prototype.clone = function () {
		Localization.detachChange(this._onLocalizationChangedHandler);

		return Element.prototype.clone.apply(this, arguments);
	};

	return Locale;
}, true);

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/base/i18n/Formatting",
    "sap/ui/core/Theming"
], function (
    Localization,
    Formatting,
    Theming
    ) {
    'use strict';

    var GanttChartConfigurationUtils = {
        setRTL: function(bRTL) {
            return Localization.setRTL(bRTL);
        },
        setLanguage: function (sLanguage) {
            return Localization.setLanguage(sLanguage);
        },
        setCalendarWeekNumbering: function (sCalendarWeekNumbering) {
            return Formatting.setCalendarWeekNumbering(sCalendarWeekNumbering);
        },
        setLegacyDateFormat: function (sFormatId) {
            return Formatting.setABAPDateFormat(sFormatId);
        },
        setABAPNumberFormat: function (sFormatId) {
            return Formatting.setABAPNumberFormat(sFormatId);
        },
        setDatePattern: function (sStyle, sPattern) {
            return Formatting.setDatePattern(sStyle, sPattern);
        },
        setTimePattern: function (sStyle, sPattern) {
            return Formatting.setTimePattern(sStyle, sPattern);
        },
        getRTL: function() {
            return Localization.getRTL();
        },
        getDatePattern: function (sStyle) {
            return Formatting.getDatePattern(sStyle);
        },
        getTimePattern: function(sStyle) {
            return Formatting.getTimePattern(sStyle);
        },
        getLegacyTimeFormat: function() {
            return Formatting.getABAPTimeFormat();
        },
        getLanguage: function () {
            return Localization.getLanguage();
        },
        getLanguageTag: function() {
            return Localization.getLanguageTag();
        },
        getTheme: function() {
            return Theming.getTheme();
        },
        getTimezone: function() {
            return Localization.getTimezone();
        },
        getCalendarWeekNumbering: function() {
            return Formatting.getCalendarWeekNumbering();
        },
        getFormatLanguageTag: function() {
            return Formatting.getLanguageTag();
        },
		setTimezone: function(sTimezone) {
            return Localization.setTimezone(sTimezone);
        }
    };

    return GanttChartConfigurationUtils;
}, /* bExport= */true);

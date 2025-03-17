/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * @namespace Provides utitlity functions for OPA tests
 * @name sap.ui.mdc.qunit.p13n.OpaTests.utility.Util
 * @author SAP SE
 * @version 1.132.1
 * @private
 * @since 1.30.0
 */
sap.ui.define([
	'sap/ui/base/Object',
	'sap/ui/core/Lib',
	'sap/ui/Device'
], function(BaseObject, Library, Device) {
	"use strict";

	const Util = BaseObject.extend("sap.ui.mdc.qunit.p13n.test.Util",
	{});

	/**
	 * @param {sap.m.SegmentedButton | sap.m.List} oNavigationControl
	 */
	Util.getNavigationItem = function(oNavigationControl, sPanelName) {
		if (!oNavigationControl || sPanelName === "") {
			return null;
		}
		let oNavigationItem = null;
		if (Device.system.phone) {
			oNavigationControl.getItems().some(function(oNavigationItem_) {
				if (oNavigationItem_.getTitle() === sPanelName) {
					oNavigationItem = oNavigationItem_;
					return true;
				}
			});
		} else {
			oNavigationControl.getButtons().some(function(oNavigationItem_) {
				if (oNavigationItem_.getText() === sPanelName) {
					oNavigationItem = oNavigationItem_;
					return true;
				}
			});
		}
		return oNavigationItem;
	};

	Util.getTextFromResourceBundle = function(sLibraryName, sTextKey, iCount) {
		return Library.getResourceBundleFor(sLibraryName).getText(sTextKey, [iCount]);
	};

	Util.getTextOfChartType = function(sChartType) {
		const oBundle = Library.getResourceBundleFor("sap.chart.messages");
		return oBundle.getText("info/" + sChartType);
	};

	return Util;
});

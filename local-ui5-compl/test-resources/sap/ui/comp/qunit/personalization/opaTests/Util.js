/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

/**
 * @namespace Provides utitlity functions for OPA tests
 * @name sap.ui.comp.qunit.personalization.test.Util
 * @author SAP SE
 * @version 1.132.1
 * @private
 * @since 1.30.0
 */
sap.ui.define([
	'sap/ui/Device',
	'sap/ui/base/Object',
	'sap/m/library',
	'sap/ui/test/Opa5'
], function(
	Device,
	BaseObject,
	MLibrary,
	Opa5
) {
	"use strict";

	var P13nPanelType = MLibrary.P13nPanelType;

	var Util = BaseObject.extend("sap.ui.comp.qunit.personalization.opaTests.Util", /** @lends sap.ui.comp.qunit.personalization.opaTests.Util.prototype */
	{});

	Util.getRemoveButtonTooltipOf = function(sPanelType) {
		switch (sPanelType) {
			case P13nPanelType.sort:
				return Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_REMOVE_SORT_TOOLTIP");
			case P13nPanelType.filter:
				return Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_REMOVE_FILTER_TOOLTIP");
			case P13nPanelType.group:
				return Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_REMOVE_GROUP_TOOLTIP");
			default:
				return "";
		}

	};

	Util.getNavigationItem = function(oNavigationControl, sPanelName) {
		if (!oNavigationControl || sPanelName === "") {
			return null;
		}
		var oNavigationItem = null;
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

	/**
	 * Note: <code>sLibraryName</code> MUST BE a library name. Names like sap.chart.message are not valid!
	 */
	Util.getTextFromResourceBundle = function(sLibraryName, sTextKey) {
		const OpaPluginFromFrame = Opa5.getWindow().sap.ui.require("sap/ui/test/OpaPlugin");
		return OpaPluginFromFrame?.getLibraryResourceBundle(sLibraryName)?.getText(sTextKey);
	};

	Util.getTextOfChartType = function(sChartType) {
		const sTextKey = "info/" + sChartType;
		// TODO2.0 once the manifest for sap.chart exists at dev time, switch back to getLibraryResourceBundle("sap.chart")
		const ResourceBundleFromFrame = Opa5.getWindow().sap.ui.require("sap/base/i18n/ResourceBundle");
		if ( ResourceBundleFromFrame ) {
			const oRB = ResourceBundleFromFrame.create({
				bundleName: "sap.chart.message.messagebundle"
			});
			return oRB.getText(sTextKey);
		}
		return sTextKey;
	};

	return Util;
}, /* bExport= */true);

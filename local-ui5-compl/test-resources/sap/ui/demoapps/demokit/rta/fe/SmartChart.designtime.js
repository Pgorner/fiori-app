/*!
 * SAPUI5

(c) Copyright 2009-2024 SAP SE. All rights reserved
 */

// Instance specific designtime metadata to enable personalization for the smart chart in the demo app
sap.ui.define([
	"sap/ui/comp/designtime/smartchart/SmartChart.designtime"
], function(
	SmartChartDesigntime
) {
	"use strict";
	return Object.assign(
		SmartChartDesigntime,
		{
			actions: {
				compVariant: function(oControl) {
					if (
						oControl.isA("sap.ui.comp.smartchart.SmartChart") &&
						oControl.getUseVariantManagement() && oControl.getPersistencyKey() &&
						oControl.getVariantManagement() &&
						oControl.getVariantManagement().isA("sap.ui.comp.smartvariants.SmartVariantManagement") &&
						oControl.getVariantManagement().isVariantAdaptationEnabled()
					) {

						return {
							name: "VIEWSETTINGS_TITLE",
							changeType: "variantContent",
							handler: function(oControl, mPropertyBag) {
								return new Promise(function (resolve) {
									var fCallBack = function(oData) {
										resolve(oData);
									};
									oControl.openDialogForKeyUser(mPropertyBag.styleClass, fCallBack);
								});
							}
						};
					}
			}
		}
	});
});

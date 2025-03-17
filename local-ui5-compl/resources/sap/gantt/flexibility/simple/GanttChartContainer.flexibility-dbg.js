/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/gantt/utils/GanttFlexibilityUtils",
	"sap/ui/fl/changeHandler/condenser/Classification"
], function (GanttFlexibilityUtils, Classification) {
	"use strict";

	return {
		"hideControl": "default",
		"unhideControl": "default",
		"moveControls": "default",
		"GanttContainerZoomLevel": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeContent = oChange.getContent(),
						sPropertyName = oChangeContent["propertyName"],
						newValue = oChangeContent["newValue"],
						oldValue = oChangeContent["oldValue"];
					oChange.setRevertData(oldValue);
					if (oControl.initialSettings) {
						oControl.initialSettings.zoomLevel = newValue;
					}
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeContent = oChange.getContent(),
						sPropertyName = oChangeContent["propertyName"];
					if (oControl.initialSettings) {
						oControl.initialSettings.zoomLevel = oldValue;
					}
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				 getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: Classification.LastOneWins,
						uniqueKey: "GanttContainerZoomLevel"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableTimeScrollSync": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableTimeScrollSync"),
		"GanttContainerEnableCursorLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableCursorLine"),
		"GanttContainerEnableNowLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableNowLine"),
		"GanttContainerEnableVerticalLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableVerticalLine"),
		"GanttContainerEnableAdhocLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableAdhocLine"),
		"GanttContainerEnableDeltaLine": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableDeltaLine"),
		"GanttContainerEnableNonWorkingTime": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableNonWorkingTime"),
		"GanttContainerDisplayType": GanttFlexibilityUtils.fnChangeHandler("GanttContainerDisplayType"),
		"GanttContainerEnableStatusBar": GanttFlexibilityUtils.fnChangeHandler("GanttContainerEnableStatusBar"),
		"GanttContainerCustom": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					oControl.getVariantHandler().apply(oChange, oControl, mPropertyBag);
					oControl.getToolbar().updateCustomSettingsConfig();
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					oControl.getVariantHandler().revert(oChange, oControl, mPropertyBag);
					oControl.getToolbar().updateCustomSettingsConfig();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					// Add dependent control to apply variant changes after control is initialized
					var aDependentControlList = oSpecificChangeInfo.content.dependentControls;
					if (aDependentControlList.length > 0) {
						aDependentControlList.forEach(function(sID){
							oChange.addDependentControl(sID, sID.toUpperCase(), mPropertyBag);
						});
					}
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: Classification.LastOneWins,
						uniqueKey: "GanttContainerCustom"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"ganttChartContainerSettings": GanttFlexibilityUtils.fnCustomisationChangeHandler("ganttChartContainerSettings"),

		"GanttSVGPrinting": GanttFlexibilityUtils.fnPrintChangeHandler("GanttSVGPrinting"),

		"GanttCanvasPrinting": GanttFlexibilityUtils.fnPrintChangeHandler("GanttCanvasPrinting")
	};
}, /* bExport= */ true);

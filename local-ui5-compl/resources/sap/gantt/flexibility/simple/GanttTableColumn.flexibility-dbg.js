/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/gantt/utils/GanttFlexibilityUtils",
	"sap/ui/fl/changeHandler/condenser/Classification",
	"sap/m/flexibility/EngineFlex"
], function (GanttFlexibilityUtils, Classification, EngineFlex) {
	"use strict";
	return Object.assign(EngineFlex, {
		"hideControl": "default",
		"unhideControl": "default",
        "moveControls": "default",
		"GanttTableColumnOrder": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oView = mPropertyBag.view,
						oAppComponent = mPropertyBag.appComponent,
						oChangeContent = oChange.getContent(),
						sAggregationName = oChangeContent["aggregationName"],
						aNewColumnIds = oChangeContent["newValue"],
						aOldColumnIds = oChangeContent["oldValue"];
					oChange.setRevertData(aOldColumnIds);
					// collect the columns before removing them
					var aNewColumns = [];
					aNewColumnIds.forEach(function (columnId) {
						var oColumn = oModifier.bySelector(columnId, oAppComponent, oView);
						aNewColumns.push(oColumn);
					});
					// move children in `columns` aggregation around
					if (aNewColumns.length > 0) {
						return oModifier.removeAllAggregation(oControl, sAggregationName).then(function() {
							var oPromiseChain = aNewColumns.reduce(function (oPromiseChain, column, index) {
								return oPromiseChain.then(function() {
									return oModifier.insertAggregation(oControl, sAggregationName, column, index, oView);
								});
							}, Promise.resolve());
							return oPromiseChain.then(function() {
								return true;
							});
						});
					}
				},

				revertChange: function (oChange, oControl, mPropertyBag) {
					var oAppComponent = mPropertyBag.appComponent,
						oView = mPropertyBag.view,
						oModifier = mPropertyBag.modifier,
						aOldColumnIds = oChange.getRevertData(),
						oChangecontent = oChange.getContent(),
						sAggregationName = oChangecontent["aggregationName"];
					oChange.resetRevertData();
					// collect the columns before removing them
					var aOldColumns = [];
					aOldColumnIds.forEach(function (columnId) {
						var oColumn = oModifier.bySelector(columnId, oAppComponent, oView);
						aOldColumns.push(oColumn);
					});
					if (aOldColumns.length > 0) {
						return oModifier.removeAllAggregation(oControl, sAggregationName).then(function() {
							var oPromiseChain = aOldColumns.reduce(function (oPromiseChain, column, index) {
								return oPromiseChain.then(function() {
									return oModifier.insertAggregation(oControl, sAggregationName, column, index, oView);
								});
							}, Promise.resolve());
							return oPromiseChain.then(function() {
								return true;
							});
						});
					}
				},

				completeChangeContent: function (oChange, mSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: Classification.LastOneWins,
						uniqueKey: "GanttTableColumnOrder"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"TableColumnSortOrder": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeContent = oChange.getContent(),
						sPropertyName = oChangeContent["propertyName"],
						newValue = oChangeContent["newValue"],
						oldValue = oChangeContent["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					var aDependentControls = oChange.getDependentControl("ADDITIONAL_CONTROLS", mPropertyBag);
					if (aDependentControls && aDependentControls.length > 0) {
						aDependentControls.forEach(function(oDependentControl) {
							if (oDependentControl) {
								oModifier.setPropertyBindingOrProperty(oDependentControl, sPropertyName, "None");
							}
						});
					}
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeContent = oChange.getContent(),
						sPropertyName = oChangeContent["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					// Add dependent control to apply variant changes after control is initialized
					var aDependentControls = oSpecificChangeInfo.content.affectedControls;
					if (aDependentControls && aDependentControls.length > 0) {
						oChange.addDependentControl(aDependentControls, "ADDITIONAL_CONTROLS", mPropertyBag);
					}
					return true;
				},
				getCondenserInfo: function (oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: Classification.LastOneWins,
						uniqueKey: "TableColumnSortOrder"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"TableColumnFilterValue": GanttFlexibilityUtils.fnChangeHandler("TableColumnFilterValue"),
		"TableColumnVisibility": GanttFlexibilityUtils.fnChangeHandler("TableColumnVisibility")
    });
}, /* bExport= */ true);

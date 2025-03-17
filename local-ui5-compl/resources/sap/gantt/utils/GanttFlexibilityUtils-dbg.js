/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification",
"sap/gantt/simple/PrintConfig"
], function(Classification,PrintConfig) {
    'use strict';

    var GanttFlexibilityUtils = {
        fnCustomisationChangeHandler: function (uniqueKey) {
            return {
                "changeHandler": {
                    applyChange: function (oChange, oControl, mPropertyBag) {
                        var oModifier = mPropertyBag.modifier,
                            newValue = oChange.getContent()["newChange"],
                            oldValue = oChange.getContent()["oldChange"];
                        oChange.setRevertData(oldValue);
                        for (var property in newValue) {
                            oModifier.setPropertyBindingOrProperty(oControl, property, newValue[property]);
                        }
                        return true;
                    },
                    revertChange: function (oChange, oControl, mPropertyBag) {
                        var oModifier = mPropertyBag.modifier;
                        var oldValue = oChange.getRevertData();
                        for (var property in oldValue) {
                            oModifier.setPropertyBindingOrProperty(oControl, property, oldValue[property]);
                        }
                        oChange.resetRevertData();
                        return;
                    },
                    completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
                        return;
                    },
                    getCondenserInfo: function (oChange) {
                        return {
                            affectedControl: oChange.getSelector(),
                            classification: Classification.LastOneWins,
                            uniqueKey: uniqueKey
                        };
                    }
                },
                layers: {
                    "CUSTOMER_BASE": true,
                    "CUSTOMER": true
                }
            };
        },
        fnChangeHandler: function (uniqueKey) {
            return {
                "changeHandler": {
                    applyChange: function (oChange, oControl, mPropertyBag) {
                        var oModifier = mPropertyBag.modifier,
                            oChangeContent = oChange.getContent(),
                            sPropertyName = oChangeContent["propertyName"],
                            newValue = oChangeContent["newValue"],
                            oldValue = oChangeContent["oldValue"];
                        oChange.setRevertData(oldValue);
                        oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
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
                        return;
                    },
                    getCondenserInfo: function (oChange) {
                        return {
                            affectedControl: oChange.getSelector(),
                            classification: Classification.LastOneWins,
                            uniqueKey: uniqueKey
                        };
                    }
                },
                layers: {
                    "USER": true // enables personalization which is by default disabled
                }
            };
        },

        fnPrintChangeHandler: function (uniqueKey) {
           return {
            "changeHandler": {
				applyChange: function (oChange, oControl) {
					var oChangeContent = oChange.getContent(),
					newValue = oChangeContent["newValue"];
                    if (oControl.isA("sap.gantt.simple.GanttChartContainer")){
                        if (!oControl._variantData){
                            oControl._variantData = {};
                        }
                        oControl._variantData[oChangeContent.propertyName] = new PrintConfig(newValue);
                    }

					return true;
				},
				revertChange: function (oChange, oControl) {
					delete oControl._variantData[oChange.getContent().propertyName];
					return true;
				},
				completeChangeContent: function () {
                    return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: Classification.LastOneWins,
						uniqueKey: uniqueKey
					};
				}
			},
			layers: {
				"USER": true // enables personalization that is disabled by default.
			}
           };
        }
    };

    return GanttFlexibilityUtils;
}, /* bExport= */true);

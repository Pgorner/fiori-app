sap.ui.define([
    "sap/gantt/simple/CustomVariantHandler",
	"sap/ui/core/Element"
], function(CustomVariantHandler, Element) {
    'use strict';

    var ExtendCustomVariantSettings = CustomVariantHandler.extend("sap.gantt.simple.GanttVariantManagement.webapp.controller.ExtendCustomVariantSettings", {
    });
    ExtendCustomVariantSettings.prototype.apply = function(oChange, oControl, mPropertyBag) {
        var oController = Element.getElementById("ganttVariantManagementContainer-GanttVariantManagement---MainView").getController();
        var oContent = oChange.getContent();
        oController.applyCustomData(oChange, oControl, mPropertyBag);

        var aSettingItems = oControl.getToolbar().getSettingItems();
        aSettingItems.forEach(function(oItem) {
            var sKey = oItem.getKey();
            if (oContent.newData.SettingsData[sKey] !== null && oContent.newData.SettingsData[sKey] !== undefined) {
                oItem.setChecked(oContent.newData.SettingsData[sKey]);
            }
        });
    };
    ExtendCustomVariantSettings.prototype.revert = function(oChange, oControl, mPropertyBag) {
        var oController = Element.getElementById("ganttVariantManagementContainer-GanttVariantManagement---MainView").getController();
        var oContent = oChange.getContent();
        oController.revertCustomData(oChange, oControl, mPropertyBag);

        var aSettingItems = oControl.getToolbar().getSettingItems();
        aSettingItems.forEach(function(oItem) {
            var sKey = oItem.getKey();
            if (oContent.oldData.SettingsData[sKey] !== null && oContent.oldData.SettingsData[sKey] !== undefined) {
                oItem.setChecked(oContent.oldData.SettingsData[sKey]);
            }
        });
    };
    return ExtendCustomVariantSettings;
});
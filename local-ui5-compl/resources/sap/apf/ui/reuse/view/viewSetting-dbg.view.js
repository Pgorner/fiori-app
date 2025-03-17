/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/m/ViewSettingsDialog",
	"sap/m/ViewSettingsItem",
	"sap/ui/core/mvc/View"
], function(
	ViewSettingsDialog,
	ViewSettingsItem,
	View,
) {
	'use strict';

	return View.extend("sap.apf.ui.reuse.view.viewSetting", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.viewSetting";
		},
		createContent : function(oController) {
			var oSelectedRepresentation = this.getViewData().oTableInstance;
			var oTableRepresentation = oSelectedRepresentation.tableControl; // the table with data in the step container. 
			// create the sort items from the sort content/ columns of the table
			var aSortItems = [];
			oTableRepresentation.getColumns().forEach(function(column) {
				var oSortItem = new ViewSettingsItem({
					text : column.getCustomData()[0].getValue().text,
					key : column.getCustomData()[0].getValue().key
				});
				aSortItems.push(oSortItem);
			});
			var viewSettingDialog = new ViewSettingsDialog({// view setting dialog which has the sort items
				sortItems : aSortItems,
				confirm : oController.handleConfirmForSort.bind(oController),
				cancel : oController.handleCancel.bind(oController)
			});
			return viewSettingDialog;
		}
	});
});

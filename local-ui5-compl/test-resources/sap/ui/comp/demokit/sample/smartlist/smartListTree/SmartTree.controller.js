sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlist.smartListTree.SmartTree", {

		onInit: function() {
			// set explored app's demo model on this sample
			this.getView().setModel(new JSONModel("test-resources/sap/m/demokit/sample/Tree/Tree.json"));
		},

		handleSelectChange: function(oEvent) {
			var oTree = this.getView().byId("ItemsST").getList();
			oTree.setMode(oEvent.getParameter("selectedItem").getKey());
		}
	});
});
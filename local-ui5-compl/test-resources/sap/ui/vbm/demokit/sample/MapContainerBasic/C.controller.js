sap.ui.define([
				"sap/ui/model/json/JSONModel",
				"sap/ui/Device",
				"sap/ui/core/mvc/Controller"
               ],function(JSONModel, Device, Controller) {
	"use strict";

	return Controller.extend("sap.ui.vbm.sample.MapContainerBasic.C", {
		
		onInit : function () 
		{
//			var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/ui/vbm/demokit/sample/MapContainerBasic/Data.json");
//			this.getView().setModel(oModel);
		 // set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.getView().setModel(oDeviceModel, "device");
		 }
	});


}, /* bExport= */ true);

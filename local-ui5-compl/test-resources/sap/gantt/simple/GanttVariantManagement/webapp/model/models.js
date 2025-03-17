sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createDataModel: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("gantt/demo/GanttVariantManagement/model/data.json"));
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createUIModel: function () {
			var oModel = new JSONModel({startDate: 20200129000000, endDate: 20211129000000});
		//	oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	};
});
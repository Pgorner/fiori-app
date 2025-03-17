sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel"
], function(Controller, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar.CustomDateRangeType.SmartFilterBar", {

		onInit: function() {
			this._oModel = new ODataModel("/MockDataServiceCustomDateRangeType", true);
			this.getView().setModel(this._oModel);
		},

		onExit: function () {
			this._oModel.destroy();
			this._oModel = null;
		}
	});
});

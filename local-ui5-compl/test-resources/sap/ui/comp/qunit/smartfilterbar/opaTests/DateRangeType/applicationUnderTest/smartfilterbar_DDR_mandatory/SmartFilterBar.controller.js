sap.ui.define([
	'sap/ui/model/odata/ODataUtils', 'sap/ui/model/odata/v2/ODataModel', 'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/ui/comp/state/UIState', 'sap/ui/comp/filterbar/VariantConverterFrom', 'sap/ui/model/Filter'

], function(ODataUtils, ODataModel, Controller, MessageToast, UIState, VariantConverterFrom, Filter) {
	"use strict";

	return Controller.extend("applicationUnderTest.smartfilterbar_DDR_mandatory.SmartFilterBar", {

		onInit: function() {
			var oModel = new ODataModel("/DateRangeType", true);
			this.getView().setModel(oModel);
		}
	});
});

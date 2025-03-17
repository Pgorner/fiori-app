sap.ui.define("STTA_MP.ext.controller.ListReportExtensionModifyStartupExtension", [],
	function () {
		"use strict";
		return {
			onInit: function () {
				var oController = this;
			},
			modifyStartupExtension: function (oStartupObject) {
				oStartupObject.selectionVariant.addParameter("to_Currency.CurrencyISOCode", "EUR");
			},

		};
	});

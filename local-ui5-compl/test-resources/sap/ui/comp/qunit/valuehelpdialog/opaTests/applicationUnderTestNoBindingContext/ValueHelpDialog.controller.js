sap.ui.define(
	["sap/ui/core/mvc/Controller"],
	function (Controller) {
		"use strict";

		return Controller.extend(
			"test.sap.ui.comp.valuehelpdialog.ValueHelpDialog",
			{
				onInit: function () {
					// this.byId("smartForm").bindElement("/Employees('0001')");
				}
			}
		);
	}
);

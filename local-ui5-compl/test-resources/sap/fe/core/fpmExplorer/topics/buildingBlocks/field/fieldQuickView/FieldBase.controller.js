sap.ui.define(
	["sap/fe/core/PageController"],
	function (PageController) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.fieldQuickView.FieldBase", {
			getSemanticObject: function (propertyValue) {
				if (propertyValue === 1) {
					return "SO0";
				}
				return "NoSemanticObject";
			}
		});
	},
	false
);

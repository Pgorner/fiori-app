sap.ui.require([
	"sap/ui/core/ComponentContainer"
], function(
	ComponentContainer
) {
	"use strict";

	new ComponentContainer({
		name: "test.sap.ui.comp.valuehelpdialog",
		settings: {
			id : "valuehelpdialog"
		},
		manifest: true,
		async: true
	}).placeAt("content");

});

sap.ui.require([
	"sap/ui/core/ComponentContainer"
], function(
	ComponentContainer
) {
	"use strict";

	new ComponentContainer("container", {
		name: "test.sap.ui.comp.smarttable",
		settings: {
			id : "application"
		},
		manifest: true
	}).placeAt("body");

});
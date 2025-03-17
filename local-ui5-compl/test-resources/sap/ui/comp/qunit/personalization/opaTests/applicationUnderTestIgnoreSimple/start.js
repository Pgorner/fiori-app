sap.ui.define([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer
) {
	"use strict";

	new ComponentContainer({
		name: 'applicationUnderTestIgnoreSimple',
		manifest: true,
		settings: {
			id: "applicationUnderTestIgnoreSimple"
		},
		async: true
	}).placeAt('content');
});

sap.ui.require([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer
) {
	'use strict';

	new ComponentContainer({
		name: 'appUnderTestResponsiveTableWithVariant',
		manifest: true,
		settings: {
			id: "appUnderTestResponsiveTableWithVariant"
		},
		async: true
	}).placeAt('content');
});

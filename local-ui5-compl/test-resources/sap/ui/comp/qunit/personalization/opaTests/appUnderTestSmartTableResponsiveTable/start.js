sap.ui.require([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer) {
	'use strict';

	new ComponentContainer({
		name: 'appUnderTestSmartTableResponsiveTable',
		manifest: true,
		settings: {
			id: "appUnderTestSmartTableResponsiveTable"
		},
		async: true
	}).placeAt('content');
});

sap.ui.define([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer
) {
	'use strict';

	new ComponentContainer({
		name: 'appUnderTestFilterDDR_useDRT',
		manifest: true,
		height: "100%",
		settings: {
			id: "appUnderTestFilterDDR_useDRT"
		},
		async: true
	}).placeAt('content');
});

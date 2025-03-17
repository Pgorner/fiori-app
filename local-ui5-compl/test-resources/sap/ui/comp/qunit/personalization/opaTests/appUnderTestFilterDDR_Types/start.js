sap.ui.define([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer
) {
	'use strict';

	new ComponentContainer({
		name: 'appUnderTestFilterDDR_Types',
		manifest: true,
		height: "100%",
		settings: {
			id: "appUnderTestFilterDDR_Types"
		},
		async: true
	}).placeAt('content');
});

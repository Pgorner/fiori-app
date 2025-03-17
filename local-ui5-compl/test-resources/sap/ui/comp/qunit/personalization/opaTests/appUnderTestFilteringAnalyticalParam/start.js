sap.ui.define([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer
) {
	'use strict';

	new ComponentContainer({
		name: 'appUnderTestFilteringAnalyticalParam',
		manifest: true,
		height: "100%",
		settings: {
			id: "appUnderTestFilteringAnalyticalParam"
		},
		async: true
	}).placeAt('content');
});

sap.ui.define([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer
) {
	'use strict';

	new ComponentContainer({
		name: 'applicationUnderTestFilteringIsCalendar',
		manifest: true,
		height: "100%",
		settings: {
			id: "applicationUnderTestFilteringIsCalendar"
		},
		async: true
	}).placeAt('content');
});

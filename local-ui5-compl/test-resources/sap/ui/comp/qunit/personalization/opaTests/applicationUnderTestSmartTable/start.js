sap.ui.require([
	'sap/ui/core/ComponentContainer'

], function(
	ComponentContainer) {
	'use strict';

	new ComponentContainer({
		name: 'applicationUnderTestSmartTable',
		manifest: true,
		settings: {
			id: "applicationUnderTestSmartTable"
		},
		async: true
	}).placeAt('content');
});

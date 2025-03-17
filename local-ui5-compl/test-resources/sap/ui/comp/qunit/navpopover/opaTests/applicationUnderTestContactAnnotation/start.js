/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.require([
	'sap/ui/core/ComponentContainer'

], function(
	ComponentContainer
){
	'use strict';

	new ComponentContainer({
		name: 'applicationUnderTestContactAnnotation',
		manifest: true,
		height: "100%"
	}).placeAt('content');
});

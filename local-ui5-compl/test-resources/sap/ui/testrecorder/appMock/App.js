/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/ComponentContainer",
	"sap/m/Shell"
], function (Core, ComponentContainer, Shell) {
	"use strict";

	Core.ready(function () {
		new Shell('Shell', {
			title: 'Mocked Application for testing Test Recorder tool',
			app: new ComponentContainer({
				name: 'sap.ui.testrecorder.appMock'
			})
		}).placeAt('content');
	});
});

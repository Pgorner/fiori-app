/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/mvc/XMLView",
	"sap/m/Page",
	"sap/ui/testrecorder/recorderMock/CommunicationMock"
],	function (Core, XMLView, Page, CommunicationMock) {
	"use strict";

	Core.ready(function () {
		CommunicationMock.setup();

		XMLView.create({
			viewName: "sap.ui.testrecorder.ui.views.Main"
		}).then(function (xmlView) {
			var oPage = new Page("page", {
				showHeader: false,
				backgroundDesign: "Solid",
				content: [
					xmlView
				]
			});

			oPage.placeAt("content");
		});
	});
});

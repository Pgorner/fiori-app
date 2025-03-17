sap.ui.define([
	"sap/m/Page", "sap/ui/core/ComponentContainer"
], function (Page, ComponentContainer) {
	"use strict";

	// initialize the UI component
	new Page({
		showHeader: false,
		content: new ComponentContainer({
			height: "100%",
			name: "sap.ui.documentation.sdk",
			async: true,
			settings: {
				id: "sdk"
			}
		})
	}).placeAt("content");
});
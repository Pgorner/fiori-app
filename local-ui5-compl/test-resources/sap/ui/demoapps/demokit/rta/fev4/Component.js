sap.ui.define([
	"sap/fe/core/AppComponent",
	"./serviceWorkerClient"
], async function (
	AppComponent
) {
	"use strict";

	// Initialize service worker with mockserver
	// In sandbox mode the initialization already happens in appStart.js
	if (!window.fev4DemoAppServiceWorkerStarted) {
		await window.initPage();
	}

	return AppComponent.extend("sap.ui.demoapps.rta.fev4.Component", {
		metadata: { manifest: "json" }
	});
});
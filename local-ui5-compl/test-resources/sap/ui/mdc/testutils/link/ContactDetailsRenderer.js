/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([], function() {
	"use strict";

	const ContactDetailsRenderer = {
		apiVersion: 2
	};

	ContactDetailsRenderer.render = function(oRenderManager, oContactDetails) {
		const oContent = oContactDetails.getAggregation("_content");

		oRenderManager.openStart("div", oContactDetails);
		oRenderManager.openEnd();

		oRenderManager.renderControl(oContent);

		oRenderManager.close("div");
	};

	return ContactDetailsRenderer;

});
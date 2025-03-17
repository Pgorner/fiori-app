/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([

], function () {
	"use strict";

	const SidePanelRenderer = {
		apiVersion: 2
	};

	SidePanelRenderer.render = function (oRm, oControl) {
		const oContent = oControl.getContent();

		if (oControl._bActive && oContent) {
			oRm.openStart("div", oControl);
			oRm.openEnd();
			oRm.renderControl(oControl.getContent());
			oRm.close("div");
		}
	};

	return SidePanelRenderer;
});

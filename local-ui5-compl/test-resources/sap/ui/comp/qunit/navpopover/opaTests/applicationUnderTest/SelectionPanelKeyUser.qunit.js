/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"applicationUnderTest/test/Util"
], function(
	ApplicationUnderTestUtil
) {
	"use strict";

	ApplicationUnderTestUtil.startJourney("applicationUnderTest/test/SelectionPanelKeyUserJourney");

});

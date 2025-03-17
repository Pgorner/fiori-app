/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/suite/ui/commons/demo/tutorial/test/unit/AllTests"
], function () {
	"use strict";
	QUnit.start();
});

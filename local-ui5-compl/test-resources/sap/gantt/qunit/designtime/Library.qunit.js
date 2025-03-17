/*global QUnit*/

/**
 * General consistency checks on designtime metadata of controls in the sap.gantt library
 */
sap.ui.define([
	"sap/ui/dt/enablement/libraryTest"
], function(libraryValidator) {
	"use strict";
	return libraryValidator("sap.gantt", QUnit);
});
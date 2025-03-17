sap.ui.define(function() {
	"use strict";

	return {
		name: "TestSuite for sap.fiori",
		defaults: {
		},
		tests: {
			/**
			 * @deprecated As its only purpose was to test that no sync loading happens
			 */
			"Library": {
				title: "Test Loading of library.js"
			},
			"LocaleData_delta": {
				title: "Test Minified LocaleData",
				qunit: {
					version: 1,
					reorder: false
				},
				sinon: {
					version: 1
				}
			}
		}
	};

});

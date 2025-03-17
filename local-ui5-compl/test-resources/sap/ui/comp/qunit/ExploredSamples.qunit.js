/*global QUnit */

(function() {
	"use strict";

	// prevent QUnit from starting
	QUnit.config.autostart = false;

	sap.ui.loader.config({
		map: {
			// override sinon version for MockServer and others
			"*": {
				"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4",
				"sap/ui/thirdparty/sinon-qunit": "sap/ui/qunit/sinon-qunit-bridge"
			}
		}
	});

	sap.ui.require([
		"sap/ui/qunit/utils/createAndAppendDiv",
		"test-resources/sap/ui/documentation/sdk/qunit/SampleTester"
	], function(createAndAppendDiv, SampleTester) {

		createAndAppendDiv("content");
		new SampleTester(
			'sap.ui.comp',
			[
				"sap.ui.comp.sample.personalization.exampleForTreeTableWithOData", // non-existent sample
				"sap.ui.comp.sample.personalization.exampleForTreeTableWithOData2", // non-existent sample
				"sap.ui.comp.sample.smartmultiinput.withBinding", // on exit leaves dangling requests which then make later samples fail
				"sap.ui.comp.sample.smartformColumn"
			] /*Excludes*/
		).placeAt('content');
	});

})();

/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/base/Log",
	"sap/apf/testhelper/createComponentAsPromise",
], function(
	Log,
	createComponentAsPromise
) {
	"use strict";

	QUnit.module("tTexts -- Original Texts", {
		beforeEach : function(assert) {
			var done = assert.async();
			var sConfigPath = sap.ui.require.toUrl("test-resources/sap/apf/integration/noDeployment/applicationConfiguration.json");
			createComponentAsPromise(this, {stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : sConfigPath}).done(function(){
				done();
			});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});

	QUnit.test("GIVEN application config WHEN path of apfUi.props is set to original ressources THEN property files are resolved and loaded", function(assert) {
		var sText = this.oApi.getTextNotHtmlEncoded("initialText");
		assert.equal(sText, "To start your analysis, add an analysis step or open a saved analysis path", "expected text");
	});
	QUnit.test("GIVEN application config WHEN path of apfUi.props is set to original ressources THEN translated error message text is found in log", function(assert) {

		var oMessageObject = this.oApi.createMessageObject({
			code : "5002",
			aParameters : [ "StepOfNoInterest" ]
		});
		this.oApi.putMessage(oMessageObject);
		var aLogEntries = Log.getLogEntries();
		var sText = aLogEntries[aLogEntries.length - 1].message;
		var bMessageNumberFound = sText.search("5002") > -1;
		assert.equal(bMessageNumberFound, true, "Correct message number in log");
		var bTextFound = sText.search("Error in OData request; update of analysis step StepOfNoInterest failed") > -1;
		assert.equal(bTextFound, true, "Translated text as expected");
	});

	QUnit.start();
});

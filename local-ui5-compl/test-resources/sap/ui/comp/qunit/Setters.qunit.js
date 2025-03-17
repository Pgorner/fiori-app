/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfield/ComboBox",
	"sap/ui/comp/smartfield/Configuration",
	"sap/ui/comp/smartfield/ControlProposal",
	"sap/ui/comp/smartfield/ObjectStatus",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/SmartLabel",
	"sap/ui/comp/smartfield/TextArrangementDelegate"
], 	function(
	ComboBox,
	Configuration,
	ControlProposal,
	ObjectStatus,
	SmartField,
	SmartLabel
) {
	"use strict";

	// Purpose of this test is to ensure no new setters are overriden.
	//
	// Policy:
	// 1) New exceptions for existing classes should never be added!
	// 2) New exceptions can be added only for new classes

	var testClass = function (Class, sURL, aExceptions, assert, fnDone) {
		// Arrange
		var oMetadata = Class.getMetadata(),
			oProperties = oMetadata.getAllProperties(),
			aMutators = [],
			sSimpleName = oMetadata.getName().split(".").pop();

		// Collect all mutators
		Object.keys(oProperties).forEach(function (sProperty) {
			aMutators.push(oMetadata.getProperty(sProperty)._sMutator);
		});

		// Arrange
		// How this test works: Reading the file as a static string and we would search for setters overwritten
		// on the prototype using a string search for pattern: SmartField.prototype.[mutator name] =
		fetch(sap.ui.require.toUrl(sURL))
			.then(function (response) { return response.text(); })
			.then(function (sFile) {
				aMutators.forEach(function (sMutator) {
					// Check if setter is not part of the exception list
					if (!aExceptions.includes(sMutator)) {
						// Assert
						assert.ok(
							// NOTE: space between setter name and equal sign is guaranteed with eslint
							!sFile.includes(sSimpleName + ".prototype." + sMutator + " ="),
							"Mutator '" + sMutator + "' is not defined on the prototype"
						);
					} else {
						// Assert
						assert.ok(true, "Mutator '" + sMutator + "' is part of the exception list");
					}
				});
				fnDone();
			}).catch(function () {
				// It might be the case where test are run against a build containing only library-preload
				// files and no separate resource files. In this case the test fails gracefully.
				assert.ok(true, "No separate resource files found.");
				fnDone();
			});
	};

	QUnit.module("SmartField");

	QUnit.test("ComboBox", function (assert) {
		var fnDone = assert.async(),
			aExceptions = [
				"setValue",
				"setEnteredValue",
				"setRealValue"
			];

		testClass(
			ComboBox,
			"sap/ui/comp/smartfield/ComboBox.js",
			aExceptions,
			assert,
			fnDone
		);
	});

	QUnit.test("Configuration", function (assert) {
		var fnDone = assert.async();

		testClass(
			Configuration,
			"sap/ui/comp/smartfield/Configuration.js",
			[],
			assert,
			fnDone
		);
	});

	QUnit.test("ControlProposal", function (assert) {
		var fnDone = assert.async();

		testClass(
			ControlProposal,
			"sap/ui/comp/smartfield/ControlProposal.js",
			[],
			assert,
			fnDone
		);
	});

	QUnit.test("ObjectStatus", function (assert) {
		var fnDone = assert.async();

		testClass(
			ObjectStatus,
			"sap/ui/comp/smartfield/ObjectStatus.js",
			[],
			assert,
			fnDone
		);
	});

	QUnit.test("SmartField", function (assert) {
		var fnDone = assert.async(),
			aExceptions = [
				"setEntitySet",
				"setValueState",
				"setValueStateText",
				"setShowSuggestion",
				"setShowValueHelp"
			];

		testClass(SmartField, "sap/ui/comp/smartfield/SmartField.js", aExceptions, assert, fnDone);
	});

	QUnit.test("SmartLabel", function (assert) {
		var fnDone = assert.async(),
			aExceptions = [
				"setText"
			];

		testClass(SmartLabel, "sap/ui/comp/smartfield/SmartLabel.js", aExceptions, assert, fnDone);
	});

	// QUnit.module("SmartFilterBar");

	// QUnit.module("FilterBar");

	// QUnit.module("ValueHelpDialog");

	// QUnit.module("Providers");

	// QUnit.module("Personalisation");

	QUnit.start();
});

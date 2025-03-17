sap.ui.define([
	"sap/apf/modeler/ui/utils/displayOptionsValueBuilder",
	"sap/apf/modeler/ui/utils/optionsValueModelBuilder",
	"sap/apf/modeler/ui/utils/textManipulator",
	"sap/apf/testhelper/modelerUIHelper"
], function(DisplayOptionsValueBuilder, optionsValueModelBuilder, oTextManipulator, modelerUIHelper) {
	"use strict";
	var displayOptionsValueBuilder, oTextReader;

	QUnit.module("tests for displayOptionsValueBuilder apis ", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				oTextReader = oModelerInstance.modelerCore.getText;
				displayOptionsValueBuilder = new DisplayOptionsValueBuilder(oTextReader, optionsValueModelBuilder);
				done();
			});
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(displayOptionsValueBuilder, 'then displayOptionsValueBuilder object exists');
	});
	QUnit.test('when testing label option type', function(assert) {
		// act
		var aLabelOptionTypes = displayOptionsValueBuilder.getLabelDisplayOptions();
		var expectedOutput = {
			Objects : [ {
				key : "key",
				name : oTextReader("key")
			}, {
				key : "text",
				name : oTextReader("text")
			}, {
				key : "keyAndText",
				name : oTextReader("keyAndText")
			} ]
		};
		// assert
		assert.deepEqual(aLabelOptionTypes.getData(), expectedOutput, " then model with correct values is returned");
	});
	QUnit.test('when validating label display option type when a text property is removed from step level', function(assert) {
		// act
		var aLabelOptionTypes = displayOptionsValueBuilder.getValidatedLabelDisplayOptions();
		var expectedOutput = {
			Objects : [ {
				key : "key",
				name : oTextReader("key")
			}, {
				key : oTextManipulator.addPrefixText([ "text" ], oTextReader)[0],
				name : oTextManipulator.addPrefixText([ " " + oTextReader("text") ], oTextReader)[0]
			}, {
				key : oTextManipulator.addPrefixText([ "keyAndText" ], oTextReader)[0],
				name : oTextManipulator.addPrefixText([ " " + oTextReader("keyAndText") ], oTextReader)[0]
			} ]
		};
		// assert
		assert.deepEqual(aLabelOptionTypes.getData(), expectedOutput, "then model with correct values is returned");
	});
});

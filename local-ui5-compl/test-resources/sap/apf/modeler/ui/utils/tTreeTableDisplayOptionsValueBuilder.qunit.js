sap.ui.define([
	"sap/apf/modeler/ui/utils/optionsValueModelBuilder",
	"sap/apf/modeler/ui/utils/textManipulator",
	"sap/apf/modeler/ui/utils/treeTableDisplayOptionsValueBuilder",
	"sap/apf/testhelper/modelerUIHelper"
], function (
	optionsValueModelBuilder,
	oTextManipulator,
	TreeTableDisplayOptionsValueBuilder,
	modelerUIHelper
) {
	"use strict";
	var treeTableDisplayOptionsValueBuilder, oTextReader;

	QUnit.module("tests for treeTableDisplayOptionsValueBuilder apis ", {
		beforeEach: function (assert) {
			var done = assert.async(); //Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function (oModelerInstance) {
				oTextReader = oModelerInstance.modelerCore.getText;
				treeTableDisplayOptionsValueBuilder = new TreeTableDisplayOptionsValueBuilder(oTextReader,
					optionsValueModelBuilder);
				done();
			});
		}
	});
	QUnit.test('when initialization', function (assert) {
		assert.ok(treeTableDisplayOptionsValueBuilder, 'then treetableDisplayOptionsValueBuilder object exists');
	});
	QUnit.test('when testing label option type', function (assert) {
		// act
		var aLabelOptionTypes = treeTableDisplayOptionsValueBuilder.getLabelDisplayOptions();
		var expectedOutput = {
			Objects: [{
				key: "key",
				name: oTextReader("key")
			}, {
				key: "text",
				name: oTextReader("text")
			}]
		};
		// assert
		assert.deepEqual(aLabelOptionTypes.getData(), expectedOutput, " then model with correct values is returned");
	});
	QUnit.test('when validating label display option type when a text property is removed from step level', function (assert) {
		// act
		var aLabelOptionTypes = treeTableDisplayOptionsValueBuilder.getValidatedLabelDisplayOptions();
		var expectedOutput = {
			Objects: [{
				key: "key",
				name: oTextReader("key")
			}, {
				key: oTextManipulator.addPrefixText(["text"], oTextReader)[0],
				name: oTextManipulator.addPrefixText([oTextReader("text")], oTextReader)[0]
			}]
		};
		// assert
		assert.deepEqual(aLabelOptionTypes.getData(), expectedOutput, "then model with correct values is returned");
	});
});

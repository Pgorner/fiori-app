/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/staticValuesBuilder",
	"sap/apf/modeler/ui/utils/optionsValueModelBuilder",
	"sap/apf/testhelper/modelerUIHelper"
], function(
	StaticValuesBuilder,
	optionsValueModelBuilder,
	modelerUIHelper
) {
	'use strict';
	var staticValuesBuilder, oTextReader;

	QUnit.module("tests for staticValuesBuilder apis ", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				oTextReader = oModelerInstance.modelerCore.getText;
				staticValuesBuilder = new StaticValuesBuilder(oTextReader, optionsValueModelBuilder);
				done();
			});
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(staticValuesBuilder, 'then staticValuesBuilder object exists');
	});
	QUnit.test('when testing nav target type data', function(assert) {
		// act
		var aNavTargetTypeData = staticValuesBuilder.getNavTargetTypeData();
		var expectedOutput = {
			Objects : [ {
				key : oTextReader("globalNavTargets"),
				name : oTextReader("globalNavTargets")
			}, {
				key : oTextReader("stepSpecific"),
				name : oTextReader("stepSpecific")
			} ]
		};
		// assert
		assert.deepEqual(aNavTargetTypeData.getData(), expectedOutput, " then model with correct values is returned");
	});
	QUnit.test('when testing sort direction data', function(assert) {
		// act
		var aSortDirectionData = staticValuesBuilder.getSortDirections();
		var expectedOutput = {
			Objects : [ {
				key : "true",
				name : oTextReader("ascending")
			}, {
				key : "false",
				name : oTextReader("descending")
			} ]
		};
		// assert
		assert.deepEqual(aSortDirectionData.getData(), expectedOutput, " then model with correct values is returned");
	});
});

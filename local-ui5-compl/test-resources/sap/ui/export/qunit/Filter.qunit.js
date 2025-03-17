/*global QUnit */
sap.ui.define([
	'sap/ui/export/util/Filter',
	'sap/ui/model/type/Float',
	'sap/ui/thirdparty/sinon-qunit'
], function (Filter, Float, SinonQUnit) {
	'use strict';

	var aRawFilters, oFilter, oRawFilter, sPropertyName;

	sPropertyName = 'CompanyCode';

	oRawFilter = {
		operator: '==',
		value: '1010'
	};

	aRawFilters = [
		{
			operator: '==',
			value: '1020'
		},
		{
			operator: 'between',
			value: ['1050', '1100']
		},
		{
			operator: 'endswith',
			value: '10',
			exclude: true
		}
	];

	QUnit.module('Public Interface');

	QUnit.test('constructor', function(assert) {

		oFilter = new Filter(sPropertyName, oRawFilter);
		assert.equal(oFilter.getProperty(), sPropertyName, 'Field name is stored as expected');
		assert.ok(Array.isArray(oFilter.rawValues), 'Raw filter stored as array');
		assert.equal(oFilter.label, undefined, 'No label defined');
		assert.ok(oFilter.isA('sap.ui.export.util.Filter'), 'Class definition is correct');

		oFilter = new Filter(sPropertyName, aRawFilters, 'Some Label');
		assert.equal(oFilter.getProperty(), sPropertyName, 'Field name is stored as expected');
		assert.ok(Array.isArray(oFilter.rawValues), 'Raw filter stored as array');
		assert.equal(typeof oFilter.label, 'string', 'Label is defined');
	});

	QUnit.test('getLabel', function(assert) {
		oFilter = new Filter(sPropertyName, oRawFilter);
		assert.equal(typeof oFilter.getLabel(), 'string', 'Label is of type string');
		assert.equal(oFilter.getLabel(), sPropertyName, 'No dedicated label defined - field name is used');

		oFilter = new Filter(sPropertyName, aRawFilters, 'Some Label');
		assert.notEqual(oFilter.getLabel(), sPropertyName, 'Dedicated label defined');
		assert.equal(oFilter.getLabel(), 'Some Label', 'Label is as expected');
	});

	QUnit.test('getValue', function(assert) {
		var oType;

		oFilter = new Filter(sPropertyName, aRawFilters);
		assert.equal(typeof oFilter.getValue(), 'string', 'Filter value of type string');
		assert.equal(oFilter.getValue(), '=1020; 1050...1100; !*10', 'Filter value is as expected');

		oFilter.setFormat(function(sValue) { return '$' + sValue + '$'; });
		assert.equal(oFilter.getValue(), '=$1020$; $1050$...$1100$; !*$10$', 'Filter value is as expected');

		oType = new Float({
			decimals: 2,
			decimalSeparator: '.',
			groupingSeparator: ','
		});
		assert.equal(oType.formatValue('1000', 'string'), '1,000.00', 'Type format as expected');

		oFilter.setType(oType);
		assert.equal(oFilter.getValue(), '=$1020$; $1050$...$1100$; !*$10$', 'Type will not overwrite format function');

		oFilter.setFormat(null);
		assert.equal(oFilter.getValue(), '=1,020.00; 1,050.00...1,100.00; !*10.00', 'Type formatted filter value');
	});

	QUnit.test('setFormat', function(assert) {
		oFilter = new Filter(sPropertyName, oRawFilter);

		oFilter.setFormat(10);
		assert.notOk(oFilter.format, 'Number ignored');

		oFilter.setFormat('Sample string');
		assert.notOk(oFilter.format, 'String ignored');

		oFilter.setFormat({});
		assert.notOk(oFilter.format, 'Object ignored');

		oFilter.setFormat(true);
		assert.notOk(oFilter.format, 'Boolean ignored');

		oFilter.setFormat(undefined);
		assert.notOk(oFilter.format, 'Undefined ignored');

		oFilter.setFormat(function(sValue) { return sValue; });
		assert.ok(oFilter.format, 'Function accepted');
		assert.equal(typeof oFilter.format, 'function', 'Function accepted');

		oFilter.setFormat(true);
		assert.ok(oFilter.format, 'Invalid type ignored');
		assert.equal(typeof oFilter.format, 'function', 'Function was not overwritten');

		oFilter.setFormat(null);
		assert.notOk(oFilter.format, 'Null accepted');
	});

	QUnit.test('setLabel', function(assert) {
		var sLabel = 'Some label';

		oFilter = new Filter(sPropertyName, oRawFilter);
		assert.equal(oFilter.getLabel(), sPropertyName, 'No dedicated label defined - field name is used');

		oFilter.setLabel(sLabel);
		assert.notEqual(oFilter.getLabel(), sPropertyName, 'Dedicated label defined');
		assert.equal(oFilter.getLabel(), sLabel, 'Label is as expected');
	});

	QUnit.test('setType', function(assert) {
		var oNoType, oFakeType;

		oNoType = { isA: function(sClass) { return false; }};
		oFakeType = { isA: function(sClass) { return sClass === 'sap.ui.model.SimpleType'; }};

		oFilter = new Filter(sPropertyName, oRawFilter);
		assert.notOk(oFilter.type, 'No type assigned');

		oFilter.setType(oNoType);
		assert.notOk(oFilter.type, 'No type assigned');

		oFilter.setType(oFakeType);
		assert.ok(oFilter.type, 'Type is assigned');
	});
});
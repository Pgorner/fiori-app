sap.ui.define([
	"sap/apf/testhelper/config/sampleConfiguration"
], function(
	config
) {
	"use strict";

	QUnit.module('Configuration Double');

	QUnit.test('Get instance', function(assert) {
		assert.ok(config.getSampleConfiguration(), 'Configuration double instance expected');

	});

	QUnit.test('Fresh instance per call', function(assert) {
		var resultFirstCall = config.getSampleConfiguration();
		var resultSecondCall = config.getSampleConfiguration();
		assert.notEqual(resultFirstCall, resultSecondCall, 'Different instances expected');
	});

	QUnit.test('Different instances have same content', function(assert) {
		var resultFirstCall = config.getSampleConfiguration();
		var resultSecondCall = config.getSampleConfiguration();
		assert.deepEqual(resultFirstCall, resultSecondCall, 'Same content per instance expected');
	});

	QUnit.test('Local change in instance', function(assert) {
		var resultFirstCall = config.getSampleConfiguration();
		var resultSecondCall = config.getSampleConfiguration();
		resultSecondCall.steps[0].id = 'testChange';
		assert.notDeepEqual(resultFirstCall, resultSecondCall, 'Different content per instance expected');
	});
});

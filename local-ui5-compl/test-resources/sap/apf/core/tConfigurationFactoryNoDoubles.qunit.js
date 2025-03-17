sap.ui.define([
	'sap/apf/core/configurationFactory',
	'sap/apf/testhelper/config/sampleConfiguration',
	'sap/apf/testhelper/doubles/apfApi',
	'sap/apf/testhelper/doubles/coreApi',
	'sap/apf/testhelper/doubles/messageHandler',
	'sap/apf/testhelper/doubles/Representation',
	'sap/apf/testhelper/doubles/request',
	'sap/apf/core/step',
	'sap/apf/utils/hashtable',
	"sap/apf/ui/representations/lineChart",
	"sap/apf/ui/representations/columnChart",
	"sap/apf/ui/representations/scatterPlotChart",
	"sap/apf/ui/representations/table",
	"sap/apf/ui/representations/stackedColumnChart",
	"sap/apf/ui/representations/pieChart",
	"sap/apf/ui/representations/percentageStackedColumnChart",
	'sap/apf/ui/representations/bubbleChart'
], function(
	ConfigurationFactory,
	sampleConfig,
	ApfApi,
	CoreApiDouble,
	MessageHandlerDouble,
	RepresentationDouble,
	RequestDouble
) {
	'use strict';

	QUnit.module('Factory with real steps and representations', {
		beforeEach : function(assert) {
			this.oMessageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
			this.oCoreApi = new CoreApiDouble({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oApi = new ApfApi({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			}).doubleStandardMethods().doubleCreateRepresentation();
			this.oConfigurationTemplate = sampleConfig.getSampleConfiguration();
			this.oConfigurationFactory = new ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				},
				constructors: {
					Request: RequestDouble
				}
			});
			this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test('Load and get step', function(assert) {
		var oStep = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
		assert.ok(oStep, "Object properly hashed");
		assert.equal(oStep.type, "step", "	Object has type step");
		assert.equal(oStep.id, "stepTemplate1", "Object has correct id");
	});
	QUnit.test('Title vs long title in step', function(assert) {
		var oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		assert.equal(oStep.title.key, "localTextReference2", "Correct title in step");
		assert.equal(oStep.longTitle.key, "longTitleTest", "Correct longTitle in step");
	});
	QUnit.test('Read from sample config file', function(assert) {
		var oRepType = this.oConfigurationFactory.getConfigurationById("representationTypeId1");
		assert.ok(oRepType, "Object properly hashed");
		assert.equal(oRepType.type, "representationType", "Object has correct type");
		assert.equal(oRepType.id, "representationTypeId1", "Object has correct id");
		assert.equal(this.oConfigurationFactory.getConfigurationById("representationTypeId2").id, "representationTypeId2", "Object has correct id - 2");
	});
	QUnit.test('Get representation info from step template', function(assert) {
		var aStepTemplates = this.oConfigurationFactory.getStepTemplates();
		var oStepTemplate1, aRepresentationInfo;
		for(var i = 0; i < aStepTemplates.length; i++) {
			if (aStepTemplates[i].id === "stepTemplate1") {
				oStepTemplate1 = aStepTemplates[i];
			}
		}
		var expectedParameter = {
			"id" : "double1",
			"sRepresentationType" : "RepresentationTestDouble",
			"type" : "parameter"
		};
		aRepresentationInfo = oStepTemplate1.getRepresentationInfo();
		assert.equal(aRepresentationInfo.length, 4, 'Three representation info expected');
		assert.equal(aRepresentationInfo[0].representationId, "representationId1", "Representation id expected");
		assert.equal(aRepresentationInfo[0].picture, "sap-icon://line-chart", "Line chart picture expected");
		assert.deepEqual(aRepresentationInfo[0].parameter, expectedParameter, "Parameter expected");
		assert.equal(aRepresentationInfo[0].hasOwnProperty("type"), false, "Return object has no property type");
		assert.equal(aRepresentationInfo[0].hasOwnProperty("id"), false, "Return object has no property id");
		assert.equal(aRepresentationInfo[0].hasOwnProperty("constructor"), false, "Return object has no property constructor");
		assert.equal(aRepresentationInfo[1].picture, "sap-icon://vertical-bar-chart-2", "Column chart picture expected");
	});
	QUnit.test('Method getRepresentationInfo returns optional property representationLabel', function(assert) {
		var aRepresentationInfo;
		var oStepTemplate1 = this.oConfigurationFactory.getStepTemplates()[0];
		aRepresentationInfo = oStepTemplate1.getRepresentationInfo();
		assert.equal(aRepresentationInfo[0].representationLabel.key, "representationText1", "Representation label expected in first representation info");
		assert.equal(aRepresentationInfo[2].hasOwnProperty("representationLabel"), false, "Last representation info has no representation label");
	});
	QUnit.test('Method getRepresentationInfo uses clone when adding properties', function(assert) {
		var oConfig = sampleConfig.getSampleConfiguration();
		oConfig.steps[0].binding = "bindingTemplateSameRepresentationTypesDifferentRepresentations";
		this.oConfigurationFactory.loadConfig(oConfig);
		var oStepTemplate1 = this.oConfigurationFactory.getStepTemplates()[0];
		var aRepresentationInfo = oStepTemplate1.getRepresentationInfo();
		assert.equal(aRepresentationInfo[0].representationId, "representationId1", "Correct representation id for first representation info object expected");
		assert.equal(aRepresentationInfo[1].representationId, "representationId2", "Correct representation id for second representation info object expected");
	});
});

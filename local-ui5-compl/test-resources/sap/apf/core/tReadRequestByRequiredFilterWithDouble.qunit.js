sap.ui.define([
	"sap/apf/core/configurationFactory",
	"sap/apf/core/readRequestByRequiredFilter",
	"sap/apf/utils/filter",
	"sap/apf/utils/hashtable",
	"sap/apf/utils/utils",
	"sap/apf/testhelper/config/sampleConfiguration",
	"sap/apf/testhelper/doubles/coreApi",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/testhelper/doubles/metadata",
	"sap/apf/testhelper/odata/sampleServiceData",
	"sap/apf/testhelper/interfaces/IfMessageHandler",
	"sap/apf/testhelper/doubles/request",
	"sap/apf/testhelper/doubles/Representation",
	"sap/apf/core/utils/filter",
	"sap/apf/core/utils/filterTerm",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/core/messageObject",
	"sap/apf/core/messageHandler",
	"sap/apf/ui/representations/lineChart",
	"sap/apf/ui/representations/columnChart",
	"sap/apf/ui/representations/scatterPlotChart",
	"sap/apf/ui/representations/table",
	"sap/apf/ui/representations/stackedColumnChart",
	"sap/apf/ui/representations/pieChart",
	"sap/apf/ui/representations/percentageStackedColumnChart",
	"sap/apf/ui/representations/bubbleChart"
], function(
	ConfigurationFactory,
	ReadRequestByRequiredFilter,
	Filter,
	Hashtable,
	utils,
	sampleConfig,
	CoreApiDouble,
	MessageHandlerDouble,
	MetadataDouble,
	SampleServiceData
){
	'use strict';

	QUnit.module('Read request with required filters and parameter entity set key properties', {
		beforeEach : function(assert) {
			// a Request double, used in the context of this QUnit.module only
			this.RequestStub = function(oInject, oConfig) {
				var entityType = oConfig.entityType;
				var oLastFilterUsed;
				this.type = oConfig.type;
				this.sendGetInBatch = function(oFilter, fnCallback) {
					oLastFilterUsed = oFilter;
					oInject.instances.coreApi.getMetadata(oConfig.service).done(function(oMetadata){
						var aTestData = SampleServiceData.getSampleServiceData(entityType).data;
						fnCallback({
							data : aTestData,
							metadata : oMetadata
						}, false);
					});
				};
				this.getLastFilterUsed = function() {
					return oLastFilterUsed;
				};
			};
			this.oMessageHandler = new MessageHandlerDouble().doubleCheckAndMessaging().spyPutMessage();
			this.oInject = {
				instances: {
					messageHandler : this.oMessageHandler,
					coreApi : new CoreApiDouble({
						instances : {
							messageHandler : this.oMessageHandler
						}
					}).doubleCumulativeFilter()
				},
				constructors : {
					Hashtable : Hashtable,
					Request: this.RequestStub
				}
			};
			this.oInject.instances.coreApi.getMetadata = (function(oInject) {
				var oMetadata;
				return function(sService) {
					if (oMetadata) {
						return utils.createPromise(oMetadata);
					}
					oMetadata = new MetadataDouble(oInject, sService);
					oMetadata.addFilterRequiredAnnotations('EntityType1', [ "SAPClient" ]);
					oMetadata.addParameters('EntityType1', [ {
						'name' : 'CompanyCode',
						'nullable' : 'false',
						'dataType' : {
							'type' : 'Edm.String',
							'defaultValue' : null
						},
						'parameter' : 'mandatory'
					} ]);
					return utils.createPromise(oMetadata);
				};
			}(this.oInject));
			this.oConfigurationFactory = new ConfigurationFactory(this.oInject);
			this.oConfigurationFactory.loadConfig(sampleConfig.getSampleConfiguration());
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("Basic send with a not required filter expression in the context", function(assert) {
		assert.expect(2);
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.ok(true, 'Callback was called');
		};
		var oRequestConfiguration = {
			type : "request",
			id : '4711',
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : []
		};
		var oContextFilter = new Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'SAPClient', // Required filter
			operator : "eq",
			value : '777'
		}).addExpression({
			name : 'Customer', // Selection to be removed (not required and no parameter key property) although field of the entity type
			operator : "eq",
			value : '1001'
		});
		var oFilter = new Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'CompanyCode', // parameter key property
			operator : "eq",
			value : "1000"
		});
		this.oInject.instances.coreApi.setCumulativeFilter(oContextFilter.getInternalFilter());
		var oRequest = this.oConfigurationFactory.createRequest(oRequestConfiguration);
		var oReadRequestByRequiredFilter = new ReadRequestByRequiredFilter(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequestByRequiredFilter.send(oFilter, this.assertRequestIsOk);
		assert.deepEqual(oRequest.getLastFilterUsed().getProperties(), [ "CompanyCode", "SAPClient" ], 'The request used only selections for mandatory fields from the context filter object. Irrelevant selections were eliminated');
	});
	QUnit.test("Basic send with a not required filter expression in the request filter", function(assert) {
		assert.expect(2);
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.ok(true, 'Callback was called');
		};
		var oRequestConfiguration = {
			type : "request",
			id : '4711',
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : []
		};
		var oContextFilter = new Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'SAPClient', // Required filter
			operator : "eq",
			value : '777'
		});
		var oFilter = new Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'CompanyCode', // parameter key property
			operator : "eq",
			value : "1000"
		}).addExpression({
			name : 'Customer', // Selection to be executed (although not required and no parameter key property)  
			operator : "eq",
			value : '1001'
		});
		this.oInject.instances.coreApi.setCumulativeFilter(oContextFilter.getInternalFilter());
		var oRequest = this.oConfigurationFactory.createRequest(oRequestConfiguration);
		var oReadRequestByRequiredFilter = new ReadRequestByRequiredFilter(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequestByRequiredFilter.send(oFilter, this.assertRequestIsOk);
		assert.deepEqual(oRequest.getLastFilterUsed().getProperties(), [ "CompanyCode", "Customer", "SAPClient" ], 'The request used alls selections from the request filter object');
	});
	QUnit.test("Basic send without filter", function(assert) {
		assert.expect(2);
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.ok(true, 'Callback was called');
		};
		var oRequestConfiguration = {
			type : "request",
			id : '4711',
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : []
		};
		var oContextFilter = new Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'SAPClient', // Required filter
			operator : "eq",
			value : '777'
		});
		this.oInject.instances.coreApi.setCumulativeFilter(oContextFilter.getInternalFilter());
		var oRequest = this.oConfigurationFactory.createRequest(oRequestConfiguration);
		var oReadRequestByRequiredFilter = new ReadRequestByRequiredFilter(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequestByRequiredFilter.send(undefined, this.assertRequestIsOk);
		assert.deepEqual(oRequest.getLastFilterUsed().getProperties(), ["SAPClient"], 'The request used just the ContextFilter');
	});
	QUnit.test("Basic send without request ID", function(assert) {
		assert.expect(2);
		var oRequestConfiguration = {
			type : "request",
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : []
		};
		var oContextFilter = new Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'SAPClient', // Required filter
			operator : "eq",
			value : '777'
		}).addExpression({
			name : 'Customer', // Selection to be removed (not required and no parameter key property) although field of the entity type
			operator : "eq",
			value : '1001'
		});
		this.oInject.instances.coreApi.setCumulativeFilter(oContextFilter.getInternalFilter());
		var oRequest = this.oConfigurationFactory.createRequest(oRequestConfiguration);
		assert.deepEqual(oRequest, undefined, 'The request is undefined as it does not have a request ID');
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5004", "Error Code 5004 expected");
	});
});

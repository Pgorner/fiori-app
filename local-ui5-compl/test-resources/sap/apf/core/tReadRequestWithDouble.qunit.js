sap.ui.define([
	"sap/apf/core/configurationFactory",
	"sap/apf/core/readRequest",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/utils/filter",
	"sap/apf/utils/hashtable",
	"sap/apf/testhelper/config/sampleConfiguration",
	"sap/apf/testhelper/doubles/coreApi",
	'sap/apf/testhelper/doubles/messageHandler',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/testhelper/doubles/request',
	'sap/apf/testhelper/doubles/Representation',
	'sap/apf/testhelper/odata/sampleServiceData',
	"sap/apf/utils/utils",
	"sap/apf/core/utils/filter",
	"sap/apf/core/utils/filterTerm",
	"sap/apf/core/messageObject",
	"sap/apf/core/messageHandler",
	"sap/apf/ui/representations/lineChart",
	"sap/apf/ui/representations/columnChart",
	"sap/apf/ui/representations/scatterPlotChart",
	"sap/apf/ui/representations/table",
	"sap/apf/ui/representations/stackedColumnChart",
	"sap/apf/ui/representations/pieChart",
	"sap/apf/ui/representations/percentageStackedColumnChart",
	'sap/apf/ui/representations/bubbleChart'
], function(ConfigurationFactory, ReadRequest, uriGenerator, Filter, Hashtable, sampleConfig, CoreApiDouble, MessageHandlerDouble, MetadataDouble, RequestDouble) {
	'use strict';

	QUnit.module('Create Request and send', {
		beforeEach : function(assert) {
			var oResourcePathHandler, oConfigurationFactory;
			var oMessageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
			this.oMessageHandler = oMessageHandler;
			this.oCoreApi = new CoreApiDouble({
				instances : {
					messageHandler : oMessageHandler
				}
			});

			this.oInject = {
				instances : {
					messageHandler : oMessageHandler,
					coreApi : this.oCoreApi
				},
				constructors: {
					Hashtable : Hashtable,
					Request: RequestDouble
				}
			};
			this.oCoreApi.getResourceLocation = function(sId) {
				return oResourcePathHandler.getResourceLocation(sId);
			};
			this.oCoreApi.loadMessageConfiguration = function(aMessages) {
			};
			this.oCoreApi.loadAnalyticalConfiguration = function(oConfig) {
				oConfigurationFactory.loadAnalyticalConfiguration(oConfig);
			};
			this.oCoreApi.getUriGenerator = function() {
				return uriGenerator;
			};
			this.oCoreApi.getMetadataFacade = function(serviceDoc) {
				return {
					serviceDocument : serviceDoc
				};
			};
			this.oFilter = new Filter(oMessageHandler);
			this.oFilter = this.oFilter.getTopAnd().addExpression({
				name : 'SAPClient',
				operator : "eq",
				value : '777'
			});
			this.oConfigurationFactory = new ConfigurationFactory(this.oInject);
			oConfigurationFactory = this.oConfigurationFactory;

			oConfigurationFactory.loadConfig(sampleConfig.getSampleConfiguration());
		},
		afterEach : function(assert) {
		}
	});

	QUnit.test("Basic send", function(assert) {
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.equal(oDataResponse.length, 10, "data as expected");
		};
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		var oRequestConfiguration = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		var oReadRequest = new ReadRequest(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequest.send(this.oFilter, this.assertRequestIsOk);
	});

	QUnit.test("Send without filter", function(assert) {
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.equal(oDataResponse.length, 11, "data as expected");
		};
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		var oRequestConfiguration = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		var oReadRequest = new ReadRequest(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequest.send(undefined, this.assertRequestIsOk);
	});

	QUnit.test("Get metadata by property", function(assert) {
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		var oRequestConfiguration = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		var oReadRequest = new ReadRequest(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		var oDummyMetadataFacade = oReadRequest.getMetadataFacade();
		assert.equal(oDummyMetadataFacade.serviceDocument, "dummy.xsodata", "getMetadataFacade() calls getMetadataFacade on oCoreApi properly");
	});

	QUnit.module('Request options handed over properly', {
		beforeEach : function(assert) {
			this.RequestStub = function(oInject, oConfig) {

				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {

					assert.deepEqual(oRequestOptions, {
						paging : {
							top : 20,
							skip : 10,
							inlineCount : true
						}
					}, "correct request options handed over");
				};
				return this;
			};
			var oResourcePathHandler, oConfigurationFactory;
			var oMessageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
			this.oMessageHandler = oMessageHandler;
			this.oCoreApi = new CoreApiDouble({
				instances : {
					messageHandler : oMessageHandler
				}
			});

			this.oInject = {
				instances : {
					messageHandler : oMessageHandler,
					coreApi : this.oCoreApi
				},
				constructors: {
					Request: this.RequestStub
				}
			};
			this.oCoreApi.getResourceLocation = function(sId) {
				return oResourcePathHandler.getResourceLocation(sId);
			};
			this.oCoreApi.loadMessageConfiguration = function(aMessages) {
			};
			this.oCoreApi.loadAnalyticalConfiguration = function(oConfig) {
				oConfigurationFactory.loadAnalyticalConfiguration(oConfig);
			};
			this.oCoreApi.getUriGenerator = function() {
				return uriGenerator;
			};
			this.oFilter = new Filter(oMessageHandler);
			this.oFilter = this.oFilter.getTopAnd().addExpression({
				name : 'SAPClient',
				operator : "eq",
				value : '777'
			});

			this.oConfigurationFactory = new ConfigurationFactory(this.oInject);
			oConfigurationFactory = this.oConfigurationFactory;

			oConfigurationFactory.loadConfig(sampleConfig.getSampleConfiguration());
		},
		afterEach : function(assert) {
		}
	});

	QUnit.test("Send with request options", function(assert) {
		var oRequestOptions = {
			paging : {
				top : 20,
				skip : 10,
				inlineCount : true
			}
		};
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		var oRequestConfiguration = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		var oReadRequest = new ReadRequest(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequest.send(this.oFilter, function() {
		}, oRequestOptions);
	});
});

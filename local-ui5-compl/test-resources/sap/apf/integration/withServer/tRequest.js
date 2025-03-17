/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 *
 * global OData*/
sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/core/instance",
	"sap/apf/core/messageDefinition",
	"sap/apf/core/messageHandler",
	"sap/apf/core/request",
	"sap/apf/core/utils/filter",
	"sap/apf/utils/startParameter",
	"sap/apf/testhelper/authTestHelper",
	"sap/base/Log"
], function(
	CoreConstants,
	CoreInstance,
	messageDefinition,
	MessageHandler,
	Request,
	ApfFilter,
	StartParameter,
	oAuthTestHelper,
	Log
) {
	'use strict';

	const AuthTestHelper = oAuthTestHelper.constructor;

	function commonSetup(oContext) {
		function defineFilterOperators() {
			Object.assign(oContext, CoreConstants.FilterOperators);
		}
		defineFilterOperators();
		oContext.oMessageHandler = new MessageHandler();
		oContext.oMessageHandler.activateOnErrorHandling(true);
		oContext.oMessageHandler.loadConfig(messageDefinition, true);

		oContext.oCoreApi = new CoreInstance({
			instances: {
				messageHandler : oContext.oMessageHandler,
				startParameter : new StartParameter()
			}
		});
		oContext.oInject = {
				instances : {
					messageHandler : oContext.oMessageHandler,
					coreApi : oContext.oCoreApi
				}
		};
	}

	QUnit.module('Valid server request', {
		beforeEach : function(assert) {
			var done = assert.async();
			commonSetup(this);
			var oInject = this.oInject;
			this.oAuthTestHelper = new AuthTestHelper(done, function() {
				this.oRequest = new Request(oInject, this.requestConfig);
				done();
			}.bind(this));
		},
		requestConfig : {
			type : "request",
			id : "CompanyCodeQuery",
			entityType : "CompanyCodeQuery",
			service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			selectProperties : [ 'SAPClient', 'CompanyCode' ]
		}
	});
	QUnit.test('Correct type', function(assert) {
		assert.equal(this.oRequest.type, 'request', 'Type "request" expected');
	});
	QUnit.test('Send request with filters', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oFilter = new ApfFilter(this.oMessageHandler, 'SAPClient', this.EQ, '777');
		oFilter.addAnd('CompanyCode', this.EQ, '1000');
		var fnCallback = function(oResponse, bStepUpdated) {
			if (oResponse.data !== undefined) {
				assert.equal(oResponse.data.length, 1, 'One entry expected in result');
			} else { // if server is not available
				assert.equal(oResponse.code, "5001", "correct error code on failure of http request");
			}
			done();
		};
		this.oRequest.sendGetInBatch(oFilter, fnCallback);
	});
	QUnit.test('Send request with SelectionValidation', function(assert) {
		assert.expect(2);
		var done = assert.async();
		
		var selectionValidationRequestFilter = new ApfFilter(this.oMessageHandler, 'CompanyCode', this.EQ, '2000');
		selectionValidationRequestFilter.addOr('CompanyCode', this.EQ, '3000');
		var selectionValidationRequest = {
				requiredFilterProperties : ['CompanyCode'], 
				selectionFilter : selectionValidationRequestFilter
		};
		
		
		var filter = new ApfFilter(this.oMessageHandler, 'SAPClient', this.EQ, '777');
		var companyCodeFilter = new ApfFilter(this.oMessageHandler, 'CompanyCode', this.EQ, '1000');
		companyCodeFilter.addOr('CompanyCode', this.EQ, '2000');
		filter.addAnd(companyCodeFilter);
		
		var fnCallback = function(oResponse, bStepUpdated) {
			if (oResponse && oResponse.selectionValidation !== undefined) {
				assert.equal(oResponse.selectionValidation.length, 1, 'One data set in selection validation response contained');
				assert.equal(oResponse.selectionValidation[0].CompanyCode, '2000', 'Correct data set in selection validation response');
			}else{
				assert.ok(false, 'Request failed');
			}
			done();
		};
		this.oRequest.sendGetInBatch(filter, fnCallback, undefined, selectionValidationRequest);
	});
	QUnit.test('Send request with filters so that no data is returned', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oFilter = new ApfFilter(this.oMessageHandler, 'SAPClient', this.EQ, '0000000000');
		var fnCallback = function(oResponse) {
			assert.equal(oResponse.data.length, 0, 'Empty result array expected');
			done();
		};
		this.oRequest.sendGetInBatch(oFilter, fnCallback);
	});
	QUnit.test('Send request with filters and check if metadata is handed over', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var oFilter = new ApfFilter(this.oMessageHandler, 'SAPClient', this.EQ, '0000000000');
		var fnCallback = function(oResponse) {
			assert.equal(oResponse.data.length, 0, 'Empty result array expected');
			assert.ok(oResponse.metadata, 'Metadata object expected');
			done();
		};
		this.oRequest.sendGetInBatch(oFilter, fnCallback);
	});



	QUnit.module('Invalid server request', {
		beforeEach : function(assert) {
			var done = assert.async();
			commonSetup(this);

			this.oAuthTestHelper = new AuthTestHelper(done, function() {
				done();
			});
		},
		afterEach: function() {
		}
	});

	QUnit.test('Send request with missing required filter returns error object', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oRequestConfig = {
				type : "request",
				id : "CurrencyQueryTypeId",
				entityType : "CompanyCodeQuery",
				service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
				selectProperties : [ 'CompanyCode', 'CompanyCodeName' ]
		};
		new Request(this.oInject, oRequestConfig).sendGetInBatch(new ApfFilter(this.oMessageHandler), function() {
			var aLogEntries = Log.getLogEntries();
			var nLastLogEntryPosition = aLogEntries.length - 1;
			var bMessageContained = aLogEntries[nLastLogEntryPosition].message.search("5005") > -1;
			assert.equal(bMessageContained, true, "Expected Code");
			done();
		});
		
		
	});



	QUnit.module('XSRF token handling', {
		beforeEach : function(assert) {
			var done = assert.async();
			commonSetup(this);
			this.oAuthTestHelper = new AuthTestHelper(done, function() {
				done();
			});
			this.oRequest = new Request(this.oInject, this.requestConfig);
			this.originalODataRequest = OData.request;
		},
		afterEach : function() {
			OData.request = this.originalODataRequest;
		},
		requestConfig : {
			type : "request",
			id : "WCAClearedReceivablesQuery_001",
			entityType : "WCAClearedReceivableQuery",
			service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			selectProperties : [ 'Customer', 'CustomerName' ]
		}
	});
	QUnit.test('XSRF Token in request header', function(assert) {
		var done = assert.async();
		assert.expect(2);
		OData.request = function(request, success, error) {
			if (request["headers"]["x-csrf-token"] !== undefined && request["headers"]["x-csrf-token"].length === 32) {
				assert.ok(true, 'xsrf token in request header of Post Request');
			}
			if (request["data"]["__batchRequests"][0]["headers"]["x-csrf-token"] !== undefined && request["data"]["__batchRequests"][0]["headers"]["x-csrf-token"].length === 32) {
				assert.ok(true, 'xsrf token in request header of inner GET Request');
			}

			done();	
		};
		
		this.oRequest.sendGetInBatch(new ApfFilter(this.oMessageHandler));	
	});



	QUnit.module('Language header set correctly', {
		beforeEach : function(assert) {
			var done = assert.async();
			commonSetup(this);
			this.oAuthTestHelper = new AuthTestHelper(done, function() {
				this.oRequest = new Request(this.oInject, this.requestConfig);
				done();
			}.bind(this));
		},
		requestConfig : {
			type : "request",
			id : "WCAClearedReceivables",
			entityType : "WCAClearedReceivableQuery",
			service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			selectProperties : [ 'Customer', 'CustomerName', 'CustomerCountryName' ]
		}
	});
	QUnit.test('Send Post (Batch) and response includes correct CustomerCountryNames and no null values', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var oFilter = new ApfFilter(this.oMessageHandler, 'P_SAPClient', this.EQ, '777');
		oFilter.addAnd('P_FromDate', this.EQ, '20110723');
		oFilter.addAnd('P_ToDate', this.EQ, '20120723');
		oFilter.addAnd("P_DisplayCurrency", this.EQ, "EUR");
		var fnCallback = function(oResponse) {
			assert.equal((oResponse instanceof Error), false, "Successfull Request in send post expected otherwise problem with service");
			if (oResponse.data) {
				assert.notEqual(oResponse.data[0].CustomerCountryName, null, 'Data returned');
			}
			done();
		};
		this.oRequest.sendGetInBatch(oFilter, fnCallback);
	});



	QUnit.module('Request options are executed correctly', {
		beforeEach : function(assert) {
			var done = assert.async();
			commonSetup(this);
			this.oAuthTestHelper = new AuthTestHelper(done, function() {
				this.oRequest = new Request(this.oInject, this.requestConfig);
				done();
			}.bind(this));
		},
		requestConfig : {
			type : "request",
			id : "WCAClearedReceivables",
			entityType : "WCAClearedReceivableQuery",
			service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			selectProperties : [ 'Customer', 'CustomerName', 'CustomerCountryName' ]
		}
	});
	QUnit.test('Send Post (Batch) with request options for inlinecount, skip, and top', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var oFilter = new ApfFilter(this.oMessageHandler, 'P_SAPClient', this.EQ, '777');
		oFilter.addAnd('P_FromDate', this.EQ, '20110723');
		oFilter.addAnd('P_ToDate', this.EQ, '20120723');
		oFilter.addAnd("P_DisplayCurrency", this.EQ, "EUR");
		var oRequestOptions = {
				paging : {
					top : 20,
					skip : 10,
					inlineCount : true
				}
		};
		var fnCallback = function(oResponse) {
			assert.equal((oResponse instanceof Error), false, "Successfull Request in send post expected otherwise problem with service");
			if (oResponse.data) {
				assert.ok(oResponse.count = 999, 'Value of "__count" returned 999');
				assert.ok(oResponse.data.length = 20, 'Number of records returned as expected');
			}
			done();
		};
		this.oRequest.sendGetInBatch(oFilter, fnCallback, oRequestOptions);
	});
});

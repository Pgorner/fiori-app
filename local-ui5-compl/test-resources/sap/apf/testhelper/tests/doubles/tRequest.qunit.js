sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/core/utils/filter",
	"sap/apf/testhelper/config/sampleConfiguration",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/testhelper/doubles/request",
], function(
	CoreConstants,
	ApfFilter,
	config,
	MessageHandlerDouble,
	RequestDouble
) {
	"use strict";

	QUnit.module('Request Test Double', {
		beforeEach : function(assert) {
			var that = this;
			this.aDataFromSendCallback = undefined;
			this.sendCallback = function(oResponse) {
				that.aDataFromSendCallback = oResponse.data;
			};

			this.oMessageHandler = new MessageHandlerDouble().raiseOnCheck();
			/*
			this.saveCore = sap.apf.core.check;
			sap.apf.core.check = function(booleExpr, sMessage, sCode) {
				if (!booleExpr) {
					throw new Error(sMessage);
				}
			};   
			*/
		},
		afterEach : function(assert) {
			//sap.apf.core.check = this.saveCore;
		}
	});
	QUnit.test('Get instance', function(assert) {
		var oRequestConfiguration = config.getSampleConfiguration().requests[0];
		assert.ok(new RequestDouble({}, oRequestConfiguration), 'Configuration double instance expected');
	});

	// test fails as the filterArray method is not properly injected by RequestDouble
	QUnit.skip('Do Request with selection', function(assert) {
		var oRequestConfiguration = config.getSampleConfiguration().requests[0];
		var oRequestTestDouble = new RequestDouble({instances: {messageHandler : this.oMessageHandler}}, oRequestConfiguration);
		// define filter 
		var oFilterAll = new ApfFilter(this.oMessageHandler, "SAPClient", CoreConstants.FilterOperators.EQ, '777');
		oFilterAll.addAnd('CompanyCode', CoreConstants.FilterOperators.EQ, '1000');
		var oFilterCustomer = new ApfFilter(this.oMessageHandler, "Customer", CoreConstants.FilterOperators.EQ, "1001");
		oFilterCustomer.addOr(new ApfFilter(this.oMessageHandler, "Customer", CoreConstants.FilterOperators.EQ, "1002"));
		oFilterCustomer.addOr(new ApfFilter(this.oMessageHandler, "Customer", CoreConstants.FilterOperators.EQ, "1004"));
		oFilterAll.addAnd(oFilterCustomer);
		oRequestTestDouble.sendGetInBatch(oFilterAll, this.sendCallback);
		var aData = this.aDataFromSendCallback;
		var bHasData = aData.length > 0;
		assert.equal(bHasData, true, "received data from request callback double");
		// now test, whether 3 data sets have been received with correct customer numbers;
		assert.equal(aData.length, 3, "three customers have been selected");
	});
});

/**
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */


sap.ui.define([
	"sap/apf/core/instance",
	"sap/apf/core/messageHandler"
], function(
	oCoreInstance,
	MessageHandler
) {
	'use strict';

	const CoreInstance = oCoreInstance.constructor;

	var StartParameter = function() {
		this.getAnalyticalConfigurationId = function() {
			return undefined;
		};
		this.getSapSystem = function() {};
		this.isLrepActive = function() {
			return false;
		}
	};
	QUnit.module("Read CDS View", {
		beforeEach : function(assert) {
			var startParameter = new StartParameter();
			var messageHandler = new MessageHandler();
			this.coreApi = new CoreInstance({
				instances: {
					messageHandler : messageHandler,
					startParameter : startParameter
				}
			});
			this.oFilter = this.coreApi.createFilter();
			this.defineFilterOperators();
		},
		defineFilterOperators : function() {
			Object.assign(this, this.oFilter.getOperators());
		}
	});
	QUnit.test("Read Metadata of CDS View", function(assert) {
		var done = assert.async();
		this.coreApi.getMetadata("/sapgateway/opu/odata/sap/ZJH_4APF_005_SRV").done(function(metadata){
			var attributes = metadata.getAttributes("CZISCARR");
			assert.equal(attributes.text, "CZISCARR_T", "text field recognized");
			done();
		});
		
	});
	QUnit.test("Read Request on CDS View", function(assert) {
		assert.expect(4);
		var done = assert.async();
		var assertRequestIsOk = function(oDataResponse, oMetadata, oMessageObject) {
			assert.ok(oDataResponse);
			assert.equal(oDataResponse.length, 3, "2 Records and 1 totals expected");
			assert.equal((oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata"), true, "Metadata object was returned");
			assert.equal(oMessageObject, undefined, "No message is expected");
			done();
		};
		function handleErrors(oMessageObject) {
			var sCode = oMessageObject.getCode();
			assert.ok(false, "unexpected error during read request with code " + sCode);
		}
		this.coreApi.activateOnErrorHandling(true);
		this.coreApi.setCallbackForMessageHandling(handleErrors);
		var orLevel = this.oFilter.getTopAnd().addOr("orId1").addExpression({
			name : 'CZISCARR',
			operator : this.EQ,
			value : 'AC'
		});
		orLevel.addExpression({
			name : 'CZISCARR',
			operator : this.EQ,
			value : 'AF'
		});
		var oRequest = this.coreApi.createReadRequestByRequiredFilter({
			"type" : "request",
			"service" : "/sapgateway/opu/odata/sap/ZJH_4APF_005_SRV",
			"entityType" : "ZJH_4APF_005Results",
			"selectProperties" : [ "CZISCARR", "CZISCARR_T", "TotaledProperties" ]
		});
		oRequest.send(this.oFilter, assertRequestIsOk.bind(this));
	});
});
/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */
sap.ui.define([
	"sap/apf/testhelper/authTestHelper",
	"sap/apf/testhelper/createComponentAsPromise",
	"sap/apf/testhelper/helper",
	"sap/apf/testhelper/doubles/Representation",
	"sap/apf/internal/server/userData",
	"sap/apf/Component",
], function(
	oAuthTestHelper,
	createComponentAsPromise
) {
	'use strict';

	const AuthTestHelper = oAuthTestHelper.constructor;

	QUnit.module("Basic functions for read request by required filter", {
		beforeEach : function(assert) {
			var done = assert.async();
			var sUrl = sap.ui.require.toUrl("test-resources/sap/apf/integration/withServer/integrationTestingApplicationConfiguration.json");
			createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : sUrl}).done(function(){


						this.oFilter = this.oApi.createFilter();
						this.defineFilterOperators();
						this.oFilter.getTopAnd().addExpression({
							name : 'SAPClient',
							operator : this.EQ,
							value : '777'
						});
						this.oFilter.getTopAnd().addExpression({
							name : 'CompanyCode',
							operator : this.EQ,
							value : '1000'
						});
						this.testHelper = new AuthTestHelper(done, function() {
							done();
						});
					}.bind(this));
		},
		defineFilterOperators : function() {
			Object.assign(this, this.oFilter.getOperators());
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Creating read request", function(assert) {
		assert.expect(3);
		var done = assert.async();
		var assertCompanyCodeDataRequestIsOk = function(oDataResponse, oMetadata, oMessageObject) {
			assert.ok(oDataResponse);
			assert.equal((oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata"), true, "Metadata object was returned");
			assert.equal(oMessageObject, undefined, "No message is expected");
			done();
		};
		function handleErrors(oMessageObject) {
			var sText = oMessageObject.getMessage();
			assert.equal(sText, "");
		}
		var messageHandler = this.oComponent.getProbe().messageHandler;
		messageHandler.setMessageCallback(handleErrors);
		var oRequest = this.oApi.createReadRequestByRequiredFilter({
			"id" : "mandatoryId",
			"type" : "request",
			"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			"entityType" : "CompanyCodeQuery",
			"selectProperties" : [ "SAPClient", "CompanyCode", "Currency", "CurrencyShortName" ]
		});
		oRequest.send(this.oFilter, assertCompanyCodeDataRequestIsOk.bind(this));
	});
});

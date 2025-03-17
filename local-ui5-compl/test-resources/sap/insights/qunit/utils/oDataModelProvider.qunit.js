/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/utils/oDataModelProvider',
	'sap/ui/model/json/JSONModel'
], function(oDataModelProvider, JSONModel) {
	"use strict";
	var oMockedData = null;
	var oJsonModel = new JSONModel();
	var pMockedDataLoaded = oJsonModel.loadData(sap.ui.require.toUrl("test-resources/sap/insights/qunit/__mocks__/oDataModelProvider.json")).then(function(){
		oMockedData = oJsonModel.getData();
	});
	QUnit.module("oDataModelProvider test cases", {
		before: function() {
			// ensure that tests can safely access oMockedData
			return pMockedDataLoaded;
		},
		beforeEach: function () {
			this.oSandbox = sinon.sandbox.create();
            this.oDataModelProvider = oDataModelProvider;
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oDataModelProvider = null;
		}
	});
    QUnit.test("getOdataModel metadata load failure", function(assert) {
        var oCardDataSource = oMockedData.oCardDataSource;
        return this.oDataModelProvider.getOdataModel(oCardDataSource).then(function(data) {
            assert.equal(data.loaded, false, "Unable to load data");
        });
    });
    QUnit.test("getOdataModel metadata load failure", function(assert) {
        var oCardDataSource = oMockedData.oCardDataSource;
        return this.oDataModelProvider.getOdataModel(oCardDataSource).then(function() {
            return this.oDataModelProvider.getOdataModel(oCardDataSource).then(function(data) {
                assert.equal(data.loaded, false, "Unable to load data");
            });
        }.bind(this));
    });
});
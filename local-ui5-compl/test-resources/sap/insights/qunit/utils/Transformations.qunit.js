/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/utils/Transformations',
	'sap/ui/model/json/JSONModel'
], function(Transformations, JSONModel) {
	"use strict";
	var oMockedData = null;
	var oJsonModel = new JSONModel();
  var oJsonModel = new JSONModel();
	var pMockedDataLoaded = oJsonModel.loadData(sap.ui.require.toUrl("test-resources/sap/insights/qunit/__mocks__/Transformations.json")).then(function(){
		oMockedData = oJsonModel.getData();
	});
	QUnit.module("Transformations test cases", {
                before: function() {
			// ensure that tests can safely access oMockedData
			return pMockedDataLoaded;
		},
		beforeEach: function () {
			this.oSandbox = sinon.sandbox.create();
                        this.oTransformations = Transformations;
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oMetadataAnalyser = null;
		}
	});
    QUnit.test("transformAnalyticalManifest, aTargetChartTypes is not empty, single_measure chart type", function(assert) {
        var aPropertyNameArray = this.oTransformations.transformAnalyticalManifest(oMockedData.oManifestData, ["column"]);
        assert.equal(aPropertyNameArray.length, 1, "Length 1 received");
        assert.equal(aPropertyNameArray[0]["sap.card"].content.feeds.length, 2, "Length 2 received");
        assert.equal(aPropertyNameArray[0]["sap.card"].content.chartType, "column", "charttype is column");
    });
    QUnit.test("transformAnalyticalManifest, aTargetChartTypes is not empty give array with nulld, single_measure chart type", function(assert) {
        var aPropertyNameArray = this.oTransformations.transformAnalyticalManifest(oMockedData.oManifestData, ["dot"]);
        assert.equal(aPropertyNameArray.length, 1, "Length 1 received");
    });
    QUnit.test("transformAnalyticalManifest, aTargetChartTypes is empty, single_measure chart type", function(assert) {
        var aPropertyNameArray = this.oTransformations.transformAnalyticalManifest(oMockedData.oManifestData, []);
        assert.equal(aPropertyNameArray.length, 15, "Length 15 received");
        assert.equal(aPropertyNameArray[0]["sap.card"].content.chartType, "bar", "charttype is column");
    });
    QUnit.test("transformAnalyticalManifest, aTargetChartTypes is empty, multi_measure chart type", function(assert) {
        var aPropertyNameArray = this.oTransformations.transformAnalyticalManifest(oMockedData.oManifestMultiData, []);
        assert.equal(aPropertyNameArray.length, 32, "Length 32 received");
        assert.equal(aPropertyNameArray[0]["sap.card"].content.chartType, "bar", "charttype is column");
    });

    QUnit.test("createListOptions", function(assert) {
        var aPropertyNameArray = this.oTransformations.createListOptions(oMockedData.oManifestData);
        assert.equal(aPropertyNameArray.length, 7, "Length 7 received");
        assert.equal(aPropertyNameArray[2], null, "3rd element is null");
    });

    QUnit.test("createListOptions:when title present", function(assert) {
        oMockedData.oManifestData["sap.card"].content.item.title = "testTitle2";
        var aPropertyNameArray = this.oTransformations.createListOptions(oMockedData.oManifestData);
        assert.equal(aPropertyNameArray.length, 7, "Length 7 received");
        assert.equal(aPropertyNameArray[6]["sap.card"].content.row.columns.length, 4, "4 columns present when title matched");
    });
    QUnit.test("createTableOptions", function(assert) {
        var aPropertyNameArray = this.oTransformations.createTableOptions(oMockedData.oManifestData);
        assert.equal(aPropertyNameArray.length, 2, "Length 2 received");
        assert.equal(aPropertyNameArray[1]["sap.card"].type, "List", "type has been updated to List");
    });
    QUnit.test("createChartToListOrTableOptions", function(assert) {
        var aPropertyNameArray = this.oTransformations.createChartToListOrTableOptions(oMockedData.oManifestData);
        assert.equal(aPropertyNameArray.length, 1, "Length 1 received");
        assert.equal(aPropertyNameArray[0]["sap.card"].type, "Table", "type has been updated to Table");
    });
    QUnit.test("createTabletoListHighlight", function(assert) {
        var aPropertyNameArray = this.oTransformations.createTableOptions(oMockedData.oManifestwithHighlight);
        assert.equal(aPropertyNameArray.length, 2, "Length 2 received");
        assert.equal(aPropertyNameArray[1]["sap.card"].type, "List", "type has been updated to List");
        assert.equal(aPropertyNameArray[1]["sap.card"].content.item.highlight, "{statusState}", "List card contains highlight property");
    });
});
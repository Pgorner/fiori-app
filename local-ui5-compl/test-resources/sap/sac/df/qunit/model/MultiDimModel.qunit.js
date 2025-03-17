/*global sap, QUnit*/

sap.ui.define([
  "sap/sac/df/model/MultiDimModel"
], function (MultiDimModel) {
  "use strict";

  QUnit.module("MultiDimModel", {

    beforeEach: function() {
    },

    afterEach: function () {
      this.MultiDimModel = null;
    }
  });

  QUnit.test("Test exists", function (assert) {
    assert.ok(true);
  });

/*  QUnit.test("Create model via constructor", function (assert) {
    this.MultiDimModel = new MultiDimModel({
      "DataProvider": {
        "dataProvider": {
          "dataSourceName": "2CZCFLIGHTAQ",
          "dataSourceType": "query",
          "systemName": "KIW"
        }
      }
    });
    assert.ok(!!this.MultiDimModel.getDataProviders());
    assert.ok(this.MultiDimModel.getDataProvider("dataProvider").Name === "dataProvider");
  });*/

  QUnit.test("Add data provider", function (assert) {
    assert.ok(true);

    Promise.resolve(this.MultiDimModel = new MultiDimModel().addDataProvider("dataProvider", "0BOC_SCENARIO_QUERY")
    ).then(function (oDataProvider){
      assert.ok(oDataProvider.Name === "dataProvider");
      assert.ok(oDataProvider.Name === "dataProvider");
    });
  });
});

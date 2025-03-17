/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/widgets/sap_viz/MeasureValues"
  ],
  function(Log, MeasureValues) {
    "use strict";
    Log.info("Load MeasureValuesGroup");
    var MeasureValuesGroup = function(data) {
      this._measureValues = [];
      this.init(data);
    };
    MeasureValuesGroup.prototype.init = function(data) {
      for (var i = 0; i < data.length; i++) {
        this._measureValues[i] = new MeasureValues(data[i]["name"], data[i]["values"]);
        this._measureValues[i].fake(data[i]["isFake"] ? data[i]["isFake"] : false);
        this._measureValues[i].infos(data[i]["infos"] ? data[i]["infos"] : null);
      }
    };
    MeasureValuesGroup.prototype.getMeasureValues = function() {
      return this._measureValues;
    };
    MeasureValuesGroup.prototype.getType = function() {
      return "measureValuesGroup";
    };
    MeasureValuesGroup.prototype.validate = function(labels) {
      var measures, value, i, j;
      if (!arguments.length) {
        var label = [1, 1];
        measures = this.getMeasureValues();
        for (i = 0; i < measures.length; i++) {
          value = measures[i].getValues();
          if (i === 0) {
            if (value.length !== label[1]) {
              Log.error("MeasureValues error");
            }
            label[0] = value[0].length;
          } else {
            if (value.length !== label[1]) {
              Log.error("MeasureValues error");
            }
            for (j = 0; j < value.length; j++) {
              if (value[j].length !== label[0]) {
                Log.error("MeasureValues error");
              }
            }
          }
        }
        return label;
      } else {
        measures = this.getMeasureValues();
        for (i = 0; i < measures.length; i++) {
          value = measures[i].getValues();
          if (value.length !== labels[1]) {
            Log.error("MeasureValues error");
          }
          for (j = 0; j < value.length; j++) {
            if (value[j].length !== labels[0]) {
              Log.error("MeasureValues error");
            }
          }
        }
      }
      return null;
    };
    MeasureValuesGroup.prototype.hasFakeData = function() {
      var measures = this.getMeasureValues();
      for (var i = 0; i < measures.length; i++) {
        if (measures[i].fake()) {
          return true;
        }
      }
      return false;
    };
    return MeasureValuesGroup;
  }
);

/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/widgets/sap_viz/DimensionLabels",
    "sap/zen/dsh/widgets/sap_viz/funcUtils",
    "sap/zen/dsh/widgets/sap_viz/typeUtils"
  ],
  function(Log, DimensionLabels, FunctionUtils, TypeUtils) {
    "use strict";
    Log.info("Load AnalysisAxis");
    var AnalysisAxis = function(data) {
      this._dimensionLabels = [];
      this.init(data);
    };
    AnalysisAxis.prototype.init = function(data) {
      for (var i = 0; i < data.length; i++) {
        this._dimensionLabels[i] = new DimensionLabels(
          data[i]["name"], data[i]["type"] ? data[i]["type"] : "Dimension",
          data[i]["values"]
        );
        this._dimensionLabels[i].fake(data[i]["isFake"] ? data[i]["isFake"] : false);
        this._dimensionLabels[i].infos(data[i]["infos"] ? data[i]["infos"] : null);
      }
    };
    AnalysisAxis.prototype.getDimensionLabels = function() {
      return this._dimensionLabels;
    };
    AnalysisAxis.prototype.getType = function() {
      return "analysisAxis";
    };
    AnalysisAxis.prototype.validate = function() {
      var labels = 1;
      var dimensions = this.getDimensionLabels();
      if (dimensions.length === 0) {
        FunctionUtils.error(
          "IDS_ERROR_DIMENSION_NOT_ZERO"
        );
      }
      for (var i = 0; i < dimensions.length; i++) {
        if (i === 0) {
          labels = dimensions[i].getValues().length;
          if (TypeUtils.isExist(dimensions[i].infos()) && labels !== dimensions[i].infos().length) {
            FunctionUtils.error("IDS_ERROR_DIMENSION_WRONG_COUNT");
          }
        } else {
          if (labels !== dimensions[i].getValues().length) {
            FunctionUtils.error("IDS_ERROR_DIMENSION_WRONG_LABELS_COUNT");
          }
          if (TypeUtils.isExist(dimensions[i].infos()) && labels !== dimensions[i].infos().length) {
            FunctionUtils.error("IDS_ERROR_DIMENSION_WRONG_COUNT");
          }
        }
      }
      return labels;
    };
    AnalysisAxis.prototype.hasFakeData = function() {
      var dimensions = this.getDimensionLabels();
      for (var i = 0; i < dimensions.length; i++) {
        if (dimensions[i].fake()) {
          return true;
        }
      }
      return false;
    };
    return AnalysisAxis;
  }
);

/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/widgets/sap_viz/typeUtils",
    "sap/zen/dsh/widgets/sap_viz/objectUtils",
    "sap/zen/dsh/widgets/sap_viz/AnalysisAxis",
    "sap/zen/dsh/widgets/sap_viz/MeasureValuesGroup"
  ],
  function(Log, TypeUtils, ObjectUtils, AnalysisAxis, MeasureValuesGroup) {
    "use strict";
    Log.info("Load CrossTableDataSet");
    var ANALYSISAXIS = "analysisAxis";
    var MEASUREVALUESGROUP = "measureValuesGroup";
    /**
     * @name sap.viz.data.CrosstableDataset
     * @constructor
     */
    function crossTableDataSet() {
      this._analysisAxis = [];
      this._measureValuesGroup = [];
      this._dataSet = {};
      this._measures = [];
      this._dimensions = [];
      this._emptyDataset = false;
      this._infos = {};
    }
    /**
     * Get/set data
     * @deprecated since 1.89.0 This function is working in CVOM 4.0, but will not be supported since CVOM 5.0 in the future, please consider to use new version of this API instead. You can use sap.viz.api.data.CrosstableDataset.data  instead.
     * @name sap.viz.data.CrosstableDataset#data
     * @param data
     *        data with metaData and rawData
     * @returns {Object} {@link sap.viz.data.CrosstableDataset}
     */
    // XXX: Not sure this makes a difference to generating bindings
    crossTableDataSet.prototype.data = function(data) {
      if (!arguments.length) {
        var dataRe = ObjectUtils.clone(this._dataSet);
        if (this._emptyDataset) {
          this.cleanDataset(dataRe);
        }
        return dataRe;
      }
      this._analysisAxis = [];
      this._measureValuesGroup = [];
      this._measures = [];
      this._dimensions = [];
      this._dataSet = ObjectUtils.clone(data);
      this.init(this._dataSet);
      this._measures = this.getMetaNames(data, MEASUREVALUESGROUP);
      this._dimensions = this.getMetaNames(data, ANALYSISAXIS);
      this._infos = {};
      return this;
    };
    //@deprecated
    crossTableDataSet.prototype.setData = function(in_data) {
      this.data(in_data);
    };
    /**
     * Get all dimension/ measure names from data
     * @ignore
     * @param data : data with metaData and rawData
     * @param range : ANALYSISAXIS/ MEASUREVALUESGROUP
     * @returns {[Object]}: array of names of all dimesions/ measures
     *            Object : {name:  "<dimension_name>"/  "<measure_name>", index: <number>, location: <number>}
     */
    // XXX: Not sure this makes a difference to generating bindings
    crossTableDataSet.prototype.getMetaNames = function(data, range) {
      if (data == undefined) {
        return;
      }
      var ret = [];
      range = data[range];
      if (range === undefined || !TypeUtils.isArray(range)) {
        return ret;
      }
      for (var i = 0; i < range.length; i++) {
        var rangeData = range[i].data;
        if (rangeData === undefined || !TypeUtils.isArray(rangeData)) {
          continue;
        }
        for (var j = 0; j < rangeData.length; j++) {
          if (rangeData[j].name !== undefined) {
            var obj = {
              name: rangeData[j].name,
              index: i,
              location: j
            };
            ret.push(obj);
          }
        }
      }
      return ret;
    };
    crossTableDataSet.prototype.init = function(data) {
      // removed check for measureValuesGroup for tree map doesn't have it
      if (!data || (!data[ANALYSISAXIS] && !data[MEASUREVALUESGROUP])) {
        //FIX ME Remove when multihandler is available
        return;
      }
      var aaLabels = [1, 1];
      var isEmptyDataset = false;
      replaceNullData(data);
      var axes = data[ANALYSISAXIS];
      var i = 0;
      var mvgs, mvg, mv;
      if (axes) {
        if (axes.length > 2) {
          Log.error("Crosstable error");
        }
        for (; i < axes.length; i++) {
          var axis = axes[i];
          var axisIndex = axis["index"];
          if (axisIndex !== 1 && axisIndex !== 2) {
            Log.error("Crosstable error");
          }
          if (this._analysisAxis[axisIndex - 1]) {
            Log.error("Crosstable error");
          }
          var aa = new AnalysisAxis(axis["data"]);
          aaLabels[axisIndex - 1] = aa.validate();
          this._analysisAxis[axisIndex - 1] = aa;
        }
        //TODO handle if only meta data exist in data set when layout
        if (aaLabels[0] === 0) {
          aaLabels[1] = 0;
          isEmptyDataset = true;
        }
        mvgs = data[MEASUREVALUESGROUP];
        // to handle tree chart without measurevaluegroup, but not know what chart is going to be filled, should we give a warning for the empty measurevaluegroup?
        if (mvgs) {
          for (i = 0; i < mvgs.length; i++) {
            mvg = mvgs[i];
            var mvgIndex = mvg["index"];
            if (this._measureValuesGroup[mvgIndex - 1]) {
              Log.error("Crosstable error");
            }
            mv = new MeasureValuesGroup(mvg["data"]);
            mv.validate(aaLabels);
            this._measureValuesGroup[mvgIndex - 1] = mv;
          }
        }
      } else { // no axes case
        mvgs = data[MEASUREVALUESGROUP];
        for (i = 0; i < mvgs.length; i++) {
          mvg = mvgs[i];
          mv = new MeasureValuesGroup(mvg["data"]);
          if (i === 0) {
            aaLabels = mv.validate();
          } else {
            mv.validate(aaLabels);
          }
          this._measureValuesGroup[mvg["index"] - 1] = mv;
        }
      }
      this._emptyDataset = isEmptyDataset;
    };
    var replaceNullValues = function(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].values == null) {
          data[i].values = [];
        }
      }
    };
    var replaceNullData = function(data) {
      if (data[ANALYSISAXIS]) {
        var aa = data[ANALYSISAXIS];
        for (var i = 0; i < aa.length; i++) {
          replaceNullValues(aa[i].data);
        }
      }
      if (data[MEASUREVALUESGROUP]) {
        var mg = data[MEASUREVALUESGROUP];
        for (i = 0; i < mg.length; i++) {
          replaceNullValues(mg[i].data);
        }
      }
    };
    return crossTableDataSet;
  }
);

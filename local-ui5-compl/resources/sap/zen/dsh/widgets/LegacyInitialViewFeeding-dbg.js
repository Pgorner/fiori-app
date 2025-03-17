/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/sac/df/thirdparty/lodash",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/SDKhtml5chart_util",
    "sap/ui/core/format/DateFormat"
  ],
  function(jQuery, Log, _, BaseHandler, SdkHtml5ChartUtil ) {
    "use strict";
    Log.info("Loaded LegacyInitialViewFeeding");
    function LegacyInitialViewFeeding(TestSdkHtml5ChartUtil) {
      this._SdkHtml5ChartUtil = TestSdkHtml5ChartUtil || SdkHtml5ChartUtil;
    }
    LegacyInitialViewFeeding.prototype.getFeedingData = function(chartType, rawSdkData, dFeedItems) {
      var oldVizType = getOldVizType(chartType);
      var chart = new this._SdkHtml5ChartUtil().createCvomChart("NotUsedId", oldVizType);
      var dataMapper = createDataMapper(chart);
      var cvomData = dataMapper.mapData(chart, rawSdkData);
      var flatTableDs = cvomData.ds;
      var feeding = cvomData.dataFeeding || autoGenerateVizFeeding(oldVizType);
      if(!dFeedItems && isDualAxisChart(chartType)) {
        chart.setData(rawSdkData); // XXX: Is this needed?
        dFeedItems = getDAxisDefaultFeedItem (chart);
      }
      return {
        data: flatTableDs.data(),
        feeding: feeding,
        dFeedItems: dFeedItems
      };
    };

    function createDataMapper(chart) {
      var dataMapper = chart.createDataMapper();
      dataMapper.getMessages = _.constant({
        "chart_mapping_error": "why is this needed?"
      });
      return dataMapper;
    }

    function autoGenerateVizFeeding(chartType) {
      // This should only happen for pie charts
      if (chartType !== "pie") {
        return [];
      }
      // XXX: Is this always the same for a pie chart?
      return [{
        "feedId": "pieSectorColor",
        "binding": [{
          "type": "analysisAxis",
          "index": 1
        }]
      }, {
        "feedId": "pieSectorSize",
        "binding": [{
          "type": "measureValuesGroup",
          "index": 1
        }]
      }];
    }

    function getOldVizType(chartType) {
      return chartType.replace(/((viz)|(info))\//, "");
    }
    function isDualAxisChart(chartType) {
      return chartType && chartType.indexOf("dual") !== -1;
    }
    function getDAxisDefaultFeedItem (chart) {
      var dFeedItems;
      try {
        dFeedItems = chart.getPropertyValues().plotObjectType.dataByInitialView;
      } catch(e) {
        dFeedItems = null;
      }
      return dFeedItems;
    }
    return LegacyInitialViewFeeding;
  }
);

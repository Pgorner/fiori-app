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
    "sap/zen/dsh/widgets/LegacyInitialViewFeeding",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function(jQuery, Log, _,LegacyInitialViewFeeding) {
    "use strict";
    var FEED_ID_MAP = {
      primaryValues: "valueAxis",
      regionColor: "color",
      pieSectorColor: "color",
      pieSectorSize: "size",
      axisLabels: "categoryAxis"
    };
    function LegacyBindingService(cvomDataGetter) {
      this._cvomDataGetter = cvomDataGetter || new LegacyInitialViewFeeding();
    }

    LegacyBindingService.prototype.createBindings = function(chartType, rawSdkData) {
      var cvomData = this._cvomDataGetter.getFeedingData(chartType, rawSdkData);
      var oFeeds = _.chain(cvomData.feeding).map(
        _.partial(vizFeedToInfoChartFeed, cvomData.data, rawSdkData)
      ).filter(_.isObject).value();

      if (isCategoryFeedEmpty(oFeeds, true)) {
        moveMeasureNamesBindingToCategoryAxisFeed(oFeeds);
      }
      return oFeeds;
    };

    /*
      Sample outputs:
      1. {"source":[],"feed":"dataFrame"}
      2. {"source":["education",{"measureNames":["valueAxis"]}],"feed":"categoryAxis"}
      3. {"source":["gender"],"feed":"color"}
      4. {"source":["store_sales","unit_sales","store_cost"],"feed":"valueAxis"}
    */
    function vizFeedToInfoChartFeed(feedData, rawSdkData, feed) {
      var id = FEED_ID_MAP[feed.feedId];

      return id && {
        "feed": id,
        "source": flatMap(feed.binding, _.partial(mapBinding, feedData, rawSdkData))
      };
    }

    function mapBinding(feedData, rawSdkData, binding) {
      var bindingMappingFunctions = {
        "measureValuesGroup": mapMeasureValuesGroupBinding,
        "analysisAxis": mapAnalysisAxisBinding,
        "measureNamesDimension": _.constant({ "measureNames": ["valueAxis"] })
      };

      return bindingMappingFunctions[binding.type] &&
        bindingMappingFunctions[binding.type](feedData, rawSdkData, binding);
    }

    function mapMeasureValuesGroupBinding(feedData, rawSdkData, binding) {
      var oH =_.find(
        feedData.measureValuesGroup, {
          index: binding.index
        }
      );
      if(oH){
        var measureValuesGroup = oH.data;
        return _.map(
          measureValuesGroup,
          function(measure) {
            return measure.key;
          }
        );
      } else {
        Log.error("Could nod find measureValuesGroup with index: " + binding.index);
        return [];
      }
    }
    function mapAnalysisAxisBinding(feedData, rawSdkData, binding) {
      var oH =_.find(
        feedData.analysisAxis,
        {
          index: binding.index
        }
      );
      if(oH){
        var analysisAxis = oH.data;
        return _.chain(analysisAxis)
          .map(
            function(aa) {
              return _.find(
                rawSdkData.dimensions,
                {
                  text: aa.name
                }
              );
            }
          ).reject(
            _.isUndefined
          ).map(
            "key"
          ).value();
      } else{
        Log.error("Could not find analysisAxis with index: " + binding.index);
        return [];
      }
    }
    function flatMap(arr, mapFn) {
      return _.chain(arr)
        .map(mapFn)
        .filter(_.isObject)
        .flatten(true)
        .value();
    }
    function getCategoryFeed(oFeeds) {
      var oCategoryFeed = _.find(oFeeds, { "feed": "categoryAxis"});
      return oCategoryFeed;
    }
    function isCategoryFeedEmpty(oFeeds, bCheckExistance) {
      var oCategoryFeed = getCategoryFeed(oFeeds);
      if (bCheckExistance && !oCategoryFeed) {
        return false;
      }
      return !oCategoryFeed || !oCategoryFeed.source || !oCategoryFeed.source.length;
    }
    function moveMeasureNamesBindingToCategoryAxisFeed(oFeeds) {
      var oCategoryFeed = getCategoryFeed(oFeeds);
      var isMeasureNamesSource = _.partial(_.has, _, "measureNames");
      if (!oCategoryFeed) {
        oCategoryFeed = { "feed": "categoryAxis" };
        oFeeds.push(oCategoryFeed);
      }
      _.forEach(oFeeds, function(oFeed) {
        oFeed.source = _.reject(oFeed.source, isMeasureNamesSource);
      });
      oCategoryFeed.source = [{ "measureNames": ["valueAxis"] }];
    }
    return LegacyBindingService;
  }
);

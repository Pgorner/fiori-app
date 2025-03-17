/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/sac/df/thirdparty/lodash",
    "sap/zen/dsh/widgets/utils/info_chart_exception",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function(jQuery,_, InfoChartException) {
    "use strict";
    var InfoDataMapper = function () {
    };
    InfoDataMapper.prototype.map = function (flatData) {
      if (!flatData || !flatData.data || !flatData.data.length) {
        throw new InfoChartException("mapper.nodata");
      }
      return new sap.viz.api.data.FlatTableDataset(flatData);
    };

    InfoDataMapper.prototype.getMeasuresDimensionKey = function (dimensions, externalDimensions) {
      var allDimensions = dimensions || [];
      allDimensions = allDimensions.concat(externalDimensions);
      var measuresDimension = _.find(allDimensions, {"containsMeasures": true});
      return measuresDimension && measuresDimension.key;
    };
    return InfoDataMapper;
  }
);

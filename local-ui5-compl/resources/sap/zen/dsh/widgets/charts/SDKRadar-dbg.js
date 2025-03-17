/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/charts/SDKBaseChart"
  ],
  function(BaseHandler,SDKBaseChart){
    "use strict";
    SDKBaseChart.extend("sap.zen.SDKRadarChart", {
      initCvomChartType : function(){
        this.cvomType = "viz/radar";
      },
      getDataFeeding : function(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter){
        var chartDataFeedingHelper = this.getChartDataFeedingHelper();
        var bindingColor = chartDataFeedingHelper.getDataRadarFeedingColor(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter);
        var bindingShape = [];
        var bindingAxes = chartDataFeedingHelper.getDataRadarFeedingAxes(keyfigureaxis, colDimensionCounter);
        var dataFeeding = [
          {
            "feedId" : "radarAxesValues",
            "binding" : [
              {
                "type" : "measureValuesGroup",
                "index" : 1
              }
            ]
          },
          {
            "feedId" : "regionColor",
            "binding" : bindingColor
          }, {
            "feedId" : "regionShape",
            "binding" : bindingShape
          }, {
            "feedId" : "radarAxes",
            "binding" : bindingAxes
          }
        ];
        return dataFeeding;
      }
    });
    return sap.zen.SDKRadarChart;
  }
);

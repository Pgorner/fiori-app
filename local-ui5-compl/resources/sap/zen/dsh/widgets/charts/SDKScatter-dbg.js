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
    SDKBaseChart.extend("sap.zen.SDKScatterChart", {
      initCvomChartType : function(){
        this.cvomType = "viz/scatter";
      },
      getDataFeeding : function(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter){
        var chartDataFeedingHelper = this.getChartDataFeedingHelper();
        var bindingColor = chartDataFeedingHelper.getDataScatterFeedingColor(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter);
        var bindingShape = chartDataFeedingHelper.getDataScatterFeedingShape(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter);
        var dataFeeding = [
          {
            "feedId" : "primaryValues",
            "binding" : [
              {
                "type" : "measureValuesGroup",
                "index" : 1
              }
            ]
          },
          {
            "feedId" : "secondaryValues",
            "binding" : [
              {
                "type" : "measureValuesGroup",
                "index" : 2
              }
            ]
          },
          {
            "feedId" : "regionColor",
            "binding" : bindingColor
          },
          {
            "feedId" : "regionShape",
            "binding" : bindingShape
          }
        ];
        return dataFeeding;
      }
    });
    return sap.zen.SDKScatterChart;
  }
);

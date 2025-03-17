/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/charts/SDKBaseChart",
    "sap/zen/dsh/widgets/dataMappers/SDKWaterfallDataMapper"
  ],
  function(BaseHandler,SDKBaseChart, SDKWaterfallDataMapper){
    "use strict";

    SDKBaseChart.extend(
      "sap.zen.SDKHorizontalWaterfallChart",
      {
        initCvomChartType : function(){
          this.cvomType = "viz/horizontal_waterfall";
        },
        getDataMapper : function() {
          return new SDKWaterfallDataMapper();
        },
        getDataFeeding : function(){
          return undefined;
        }
      }
    );
    return sap.zen.SDKHorizontalWaterfallChart;
  }
);

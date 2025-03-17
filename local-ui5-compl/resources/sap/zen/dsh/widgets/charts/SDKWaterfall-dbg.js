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
    SDKBaseChart.extend("sap.zen.SDKWaterfallChart", {
      initCvomChartType : function(){
        this.cvomType = "viz/waterfall";
      },
      getDataMapper : function() {
        return new SDKWaterfallDataMapper();
      },
      getDataFeeding : function(){}
    });
    return sap.zen.SDKWaterfallChart;
  }
);

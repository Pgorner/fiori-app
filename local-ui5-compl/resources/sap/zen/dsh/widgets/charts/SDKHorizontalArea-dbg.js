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
    SDKBaseChart.extend(
      "sap.zen.SDKHorizontalAreaChart",
      {
        initCvomChartType : function(){
          this.cvomType = "viz/horizontal_area";
        }
      }
    );
    return sap.zen.SDKHorizontalAreaChart;
  }
);

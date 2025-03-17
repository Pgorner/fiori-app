/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/charts/SDKBaseChart",
    "sap/zen/dsh/widgets/dataMappers/SDKPieDataMapper"
  ],
  function(BaseHandler, SDKBaseChart, SDKPieDataMapper){
    "use strict";
    SDKBaseChart.extend("sap.zen.SDKPieChart", {
      initCvomChartType : function(){
        this.cvomType = "viz/pie";
      },
      getDataMapper : function() {
        return new SDKPieDataMapper();
      },
      getDataFeeding: function() {}
    });
    return sap.zen.SDKPieChart;
  }
);

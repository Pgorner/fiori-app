/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/charts/SDKBaseChart",
    "sap/zen/dsh/widgets/DualDataSeriesHelper"
  ],
  function(BaseHandler,SDKBaseChart, DualDataSeriesHelper) {
    "use strict";
    SDKBaseChart.extend(
      "sap.zen.SDKColumnCombinationDualAxisChart",
      {
        init : function(){
          SDKBaseChart.prototype.init.apply(this, arguments);
          this.registerHelper("sap.zen.DualDataSeriesHelper");
          DualDataSeriesHelper.apply(this, arguments);
        },
        getPropertyValues : function(){
          return {
            plotObjectType    : this.getPlotObjectType()
          };
        },
        initCvomChartType : function(){
          this.cvomType = "viz/dual_combination";
          // Mapping from cvom errors to message keys
          this.cvomErrorMappings = {
            "50005": "dualcolumn_combination_datamapping_rmd"
          };
        }
      }
    );
    return sap.zen.SDKColumnCombinationDualAxisChart;
  }
);

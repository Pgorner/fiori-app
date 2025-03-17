/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/charts/SDKBaseChart",
    "sap/zen/dsh/widgets/dataMappers/SDKMultiPieDataMapper"
  ],
  function(BaseHandler, SDKBaseChart){
    "use strict";
    SDKBaseChart.extend(
      "sap.zen.SDKMultiPieChart",
      { cvomType: "viz/multi_pie" });
    return sap.zen.SDKMultiPieChart;
  }
);

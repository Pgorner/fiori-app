/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/DataAnalyzerPanelName",
  [],
  function () {
    /**
         * DataAnalyzer Panels
         *
         * @enum {string}
         * @alias sap.sac.df.types.DataAnalyzerPanelName
         * @experimental since version 1.132
         * @public
         */
    var DataAnalyzerPanelName = {
      /**
             * Designer Panel
             * @public
             **/
      Designer: "OlapDesignerDocument",
      /**
             * Styling Panel
             * @public
             **/
      Styling: "StylingPanelDocument"
    };
    return DataAnalyzerPanelName;
  },/* bExport= */ true
);

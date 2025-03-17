/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
/*eslint-disable max-len */
sap.ui.define(
  "sap/sac/df/types/VisualizationType",
  [
    "sap/sac/df/firefly/library"
  ],
  function (FF) {
    "use strict";
    /**
     * Types of visualizations
     *
     * @enum {object}
     * @private
     */
    var VisualizationType = {
      /**
       * Grid
       * @public
       */
      Grid: {
        Name: "Grid",
        VisualizationType: FF.VisualizationType.GRID,
        ProtocolBindingType: FF.ProtocolBindingType.SAC_TABLE_GRID,
        ChartType: FF.ChartType.GRID
      },

      /**
       * UI5 bar chart
       * @public
       */
      Bar: {
        Name: "Bar",
        VisualizationType: FF.VisualizationType.CHART,
        ProtocolBindingType: FF.ProtocolBindingType.VIZ_FRAME_PROTOCOL,
        ChartType: FF.ChartType.BAR
      },

      /**
       * HighChart var chart
       * @public
       */
      HighChartBar: {
        Name: "HighChartBar",
        VisualizationType: FF.VisualizationType.CHART,
        ProtocolBindingType: FF.ProtocolBindingType.HIGH_CHART_PROTOCOL,
        ChartType: FF.ChartType.BAR
      },

      /**
       * HighChart line chart
       * @public
       */
      HighChartLine: {
        Name: "HighChartLine",
        VisualizationType: FF.VisualizationType.CHART,
        ProtocolBindingType: FF.ProtocolBindingType.HIGH_CHART_PROTOCOL,
        ChartType: FF.ChartType.LINE
      },


      /**
       * HighChart column chart
       * @public
       */
      HighChartColumn: {
        Name: "HighChartColumn",
        VisualizationType: FF.VisualizationType.CHART,
        ProtocolBindingType: FF.ProtocolBindingType.HIGH_CHART_PROTOCOL,
        ChartType: FF.ChartType.COLUMN
      }

    };

    return VisualizationType;

  });

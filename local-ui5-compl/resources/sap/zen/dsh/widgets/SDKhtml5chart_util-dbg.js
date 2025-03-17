/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/sac/df/thirdparty/lodash",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/charts/SDKArea",
    "sap/zen/dsh/widgets/charts/SDKBar",
    "sap/zen/dsh/widgets/charts/SDKBarCombination",
    "sap/zen/dsh/widgets/charts/SDKBarDualAxis",
    "sap/zen/dsh/widgets/charts/SDKBubble",
    "sap/zen/dsh/widgets/charts/SDKColumn",
    "sap/zen/dsh/widgets/charts/SDKColumnCombinationDualAxis",
    "sap/zen/dsh/widgets/charts/SDKColumnDualAxis",
    "sap/zen/dsh/widgets/charts/SDKComb",
    "sap/zen/dsh/widgets/charts/SDKGenericViz",
    "sap/zen/dsh/widgets/charts/SDKHorizontalArea",
    "sap/zen/dsh/widgets/charts/SDKHorizontalCombinationDualAxis",
    "sap/zen/dsh/widgets/charts/SDKHorizontalLine",
    "sap/zen/dsh/widgets/charts/SDKHorizontalWaterfall",
    "sap/zen/dsh/widgets/charts/SDKLine",
    "sap/zen/dsh/widgets/charts/SDKLineDualAxis",
    "sap/zen/dsh/widgets/charts/SDKMultiPie",
    "sap/zen/dsh/widgets/charts/SDKMultiRadar",
    "sap/zen/dsh/widgets/charts/SDKPie",
    "sap/zen/dsh/widgets/charts/SDKRadar",
    "sap/zen/dsh/widgets/charts/SDKScatter",
    "sap/zen/dsh/widgets/charts/SDKStacked100Bar",
    "sap/zen/dsh/widgets/charts/SDKStacked100Col",
    "sap/zen/dsh/widgets/charts/SDKStackedBar",
    "sap/zen/dsh/widgets/charts/SDKStackedColumn",
    "sap/zen/dsh/widgets/charts/SDKStackedWaterfall",
    "sap/zen/dsh/widgets/charts/SDKWaterfall",
  ],
  function(
    jQuery, Log, _, BaseHandler,
    SDKAreaChart,
    SDKBarChart,
    SDKBarCombinationChart,
    SDKBarDualAxisChart,
    SDKBubbleChart,
    SDKColumnChart,
    SDKColumnCombinationDualAxisChart,
    SDKColumnDualAxisChart,
    SDKCombinationChart,
    SDKGenericViz,
    SDKHorizontalAreaChart,
    SDKHorizontalCombinationDualAxisChart,
    SDKHorizontalLineChart,
    SDKHorizontalWaterfallChart,
    SDKLineChart,
    SDKLineDualAxisChart,
    SDKMultiPieChart,
    SDKMultiRadarChart,
    SDKPieChart,
    SDKRadarChart,
    SDKScatterChart,
    SDKStacked100BarChart,
    SDKStacked100ColChart,
    SDKStackedBarChart,
    SDKStackedColumnChart,
    SDKStackedWaterfallChart,
    SDKWaterfallChart
  ){
    "use strict";
    Log.info("Loaded SDKhtml5chart_util");
    function SDKHtml5chartUtil() {
      this.createCvomChart = function(chartElementId, chartType){
        var chart;
        var chartControl = sap.ui.getCore().byId(chartElementId);
        if (chartControl) {
          chartControl.destroy();

        }
        chartType = chartType.toLowerCase();
        switch(chartType){
        case "column":
          chart = new SDKColumnChart(chartElementId);
          break;
        case "100_stacked_column":
          chart = new SDKStacked100ColChart(chartElementId);
          break;
        case "100_stacked_bar":
          chart = new SDKStacked100BarChart(chartElementId);
          break;
        case "stacked_bar":
          chart = new SDKStackedBarChart(chartElementId);
          break;
        case "stacked_column":
          chart = new SDKStackedColumnChart(chartElementId);
          break;
        case "stacked_waterfall":
          chart = new SDKStackedWaterfallChart(chartElementId);
          break;
        case "line":
          chart = new SDKLineChart(chartElementId);
          break;
        case "bar":
          chart = new SDKBarChart(chartElementId);
          break;
        case "horizontal_combination":
          chart = new SDKBarCombinationChart(chartElementId);
          break;
        case "combination":
          chart = new SDKCombinationChart(chartElementId);
          break;
        case "horizontal_line":
          chart = new SDKHorizontalLineChart(chartElementId);
          break;
        case "area":
          chart = new SDKAreaChart(chartElementId);
          break;
        case "horizontal_area":
          chart = new SDKHorizontalAreaChart(chartElementId);
          break;
        case "pie":
          chart = new SDKPieChart(chartElementId);
          break;
        case "multi_pie":
          chart = new SDKMultiPieChart(chartElementId);
          break;
        case "scatter":
          chart = new SDKScatterChart(chartElementId);
          break;
        case "bubble":
          chart = new SDKBubbleChart(chartElementId);
          break;
        case "waterfall":
          chart = new SDKWaterfallChart(chartElementId);
          break;
        case "radar":
          chart = new SDKRadarChart(chartElementId);
          break;
        case "horizontal_waterfall":
          chart = new SDKHorizontalWaterfallChart(chartElementId);
          break;
        case "multi_radar":
          chart = new SDKMultiRadarChart(chartElementId);
          break;
        case "dual_bar":
          chart = new SDKBarDualAxisChart(chartElementId);
          break;
        case "dual_combination":
          chart = new SDKColumnCombinationDualAxisChart(chartElementId);
          break;
        case "dual_column":
          chart = new SDKColumnDualAxisChart(chartElementId);
          break;
        case "dual_horizontal_combination":
          chart = new SDKHorizontalCombinationDualAxisChart(chartElementId);
          break;
        case "dual_line":
          chart = new SDKLineDualAxisChart(chartElementId);
          break;
        default:
          chart = new SDKGenericViz(chartElementId);
          chart.setVizId(chartType);
        }
        return chart;
      };
    }
    return SDKHtml5chartUtil;
  }
);

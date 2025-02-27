sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("my.fiori.app.controller.App", {

    onInit: function() {
      // Sample data for the charts and trend
      var oData = {
        cancellationTrend: {
          value: 10,
          indicator: "Up" // or "Down"
        },
        lineChartData: [
          { date: "Feb 20, 2025", cancellations: 10 },
          { date: "Feb 21, 2025", cancellations: 20 },
          { date: "Feb 22, 2025", cancellations: 15 }
        ],
        comparisonChartData: [
          { status: "Successful", value: 80 },
          { status: "Failed", value: 20 }
        ],
        donutChartData: [
          { reason: "Better Offer", value: 40 },
          { reason: "Service Issues", value: 35 },
          { reason: "Not Needed", value: 25 }
        ],
        pendingChartData: [
          { stage: "Initial Review", value: 10 },
          { stage: "Manager Approval", value: 8 },
          { stage: "Finalization", value: 5 }
        ]
      };
      var oModel = new JSONModel(oData);
      this.getView().setModel(oModel);
      console.log("onInit: cancellationTrend =", oModel.getProperty("/cancellationTrend"));
    },

    onAfterRendering: function() {
      var oModel = this.getView().getModel();
      var value = oModel.getProperty("/cancellationTrend/value");
      var indicator = oModel.getProperty("/cancellationTrend/indicator");
      console.log("onAfterRendering: cancellationTrend value =", value, " indicator =", indicator);
    },

    formatter: {
      /**
       * Returns a color based on the trend value and indicator.
       * Also logs the parameters and result.
       */
      getTrendColor: function(value, indicator) {
        console.log("getTrendColor called with value:", value, "and indicator:", indicator);
        var numValue = Number(value);
        if (numValue === 0) {
          console.log("Returning Neutral");
          return "Neutral";
        } else if (indicator === "Up") {
          console.log("Returning Error");
          return "Error"; // Expected to render as red
        } else if (indicator === "Down") {
          console.log("Returning Good");
          return "Good";  // Expected to render as green
        }
        console.log("Returning Neutral (default)");
        return "Neutral";
      },
      /**
       * Returns a custom style class based on the indicator.
       * Returns "myErrorColor" if indicator is Up.
       */
      getTrendStyleClass: function(indicator) {
        console.log("getTrendStyleClass called with indicator:", indicator);
        return indicator === "Up" ? "myErrorColor" : "";
      }
    }
  });
});

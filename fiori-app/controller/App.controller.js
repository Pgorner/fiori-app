sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("my.fiori.app.controller.App", {

    onInit: function() {
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
          { status: "Successful", value: 4123 },
          { status: "Failed", value: 623 }
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

      // Compute summary for Cancellation Status
      var aComparison = oData.comparisonChartData;
      if (aComparison && aComparison.length >= 2) {
        var success = aComparison[0].value;
        var failed = aComparison[1].value;
        var total = success + failed;
        var successPercent = total > 0 ? Math.round((success / total) * 100) : 0;
        oData.cancellationStatusRate = successPercent + "% Success Rate";
        oData.cancellationStatusSuccessful = success + " Successful";
        oData.cancellationStatusFailed = failed + " Failed";
      } else {
        oData.cancellationStatusRate = "";
        oData.cancellationStatusSuccessful = "";
        oData.cancellationStatusFailed = "";
      }

      var oModel = new JSONModel(oData);
      this.getView().setModel(oModel);
      console.log("onInit: cancellationTrend =", oModel.getProperty("/cancellationTrend"));
    },

    onAfterRendering: function() {
      var oModel = this.getView().getModel();
      console.log("onAfterRendering: cancellationTrend value =", oModel.getProperty("/cancellationTrend/value"),
                  "indicator =", oModel.getProperty("/cancellationTrend/indicator"));
    }
  });
});

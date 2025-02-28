sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("my.fiori.app.controller.App", {

    onInit: function() {
      var oData = {
        // Track the active tile
        activeTile: null,
        detailVisible: false,
        detailHeader: "",
        detailData: [],

        // 1) Cancellations Trend
        cancellationTrend: { value: 10, indicator: "Up" },
        trendDetails: [
          { title: "January 2025", description: "180 cancellations" },
          { title: "February 2025", description: "200 cancellations" }
        ],

        // 2) Line Chart
        lineChartData: [
          { date: "Feb 20, 2025", cancellations: 10 },
          { date: "Feb 21, 2025", cancellations: 20 },
          { date: "Feb 22, 2025", cancellations: 15 }
        ],
        lineChartDetails: [
          { title: "Feb 23, 2025", description: "12 cancellations" },
          { title: "Feb 24, 2025", description: "18 cancellations" },
          { title: "Feb 25, 2025", description: "9 cancellations" }
        ],

        // 3) In-Progress
        inProgressCount: 5,
        inProgressDetails: [
          { title: "Request #101", description: "Manager Review" },
          { title: "Request #102", description: "Final Approval" },
          { title: "Request #103", description: "Initial Review" },
          { title: "Request #104", description: "Manager Review" },
          { title: "Request #105", description: "Waiting on Customer" }
        ],

        // 4) Cancellation Status
        comparisonChartData: [
          { status: "Successful", value: 4123 },
          { status: "Failed", value: 623 }
        ],
        cancellationStatusDetails: [
          { title: "Successful", description: "4123 cancellations" },
          { title: "Failed",     description: "623 cancellations" }
        ],
        cancellationStatusRate: "",
        cancellationStatusSuccessful: "",
        cancellationStatusFailed: "",

        // 5) Average Processing Time
        avgProcessingTime: 3,
        processingTimeDetails: [
          { title: "Sales Dept",   description: "2.5 days" },
          { title: "Support Dept", description: "3.8 days" },
          { title: "Billing Dept", description: "2.9 days" }
        ],

        // 6) Donut Chart
        donutChartData: [
          { reason: "Better Offer",  value: 40 },
          { reason: "Service Issues", value: 35 },
          { reason: "Not Needed",    value: 25 }
        ],
        donutDetails: [
          { title: "Better Offer",   description: "40 instances" },
          { title: "Service Issues", description: "35 instances" },
          { title: "Not Needed",     description: "25 instances" }
        ],

        // 7) Pending Approvals
        pendingChartData: [
          { stage: "Initial Review", value: 10 },
          { stage: "Manager Approval", value: 8 },
          { stage: "Finalization", value: 5 }
        ],
        pendingApprovalsDetails: [
          { title: "Initial Review",    description: "10 approvals" },
          { title: "Manager Approval",  description: "8 approvals" },
          { title: "Finalization",      description: "5 approvals" }
        ]
      };

      // Compute text summary for "Cancellation Status"
      var aComparison = oData.comparisonChartData;
      if (aComparison && aComparison.length >= 2) {
        var success = aComparison[0].value;
        var failed = aComparison[1].value;
        var total = success + failed;
        var successPercent = total > 0 ? Math.round((success / total) * 100) : 0;
        oData.cancellationStatusRate = successPercent + "% Success Rate";
        oData.cancellationStatusSuccessful = success + " Successful";
        oData.cancellationStatusFailed = failed + " Failed";
      }

      var oModel = new JSONModel(oData);
      this.getView().setModel(oModel);
    },

    onAfterRendering: function() {
      // Attach double-click handlers for each tile
      this._attachDblClick("cancellationTrendTile");
      this._attachDblClick("cancellationsPerDayTile");
      this._attachDblClick("inProgressTile");
      this._attachDblClick("cancellationStatusTile");
      this._attachDblClick("avgProcessingTimeTile");
      this._attachDblClick("cancellationReasonsTile");
      this._attachDblClick("pendingApprovalsTile");
    },

    /**
     * Helper to attach a native dblclick listener to the tile with ID sTileId
     */
    _attachDblClick: function(sTileId) {
      var oTile = this.byId(sTileId);
      if (oTile) {
        oTile.attachBrowserEvent("dblclick", this._onTileDoubleClick.bind(this, sTileId));
      }
    },

    /**
     * Called when any tile is double-clicked.
     * If it's the same tile, toggle the detail panel; otherwise load new data.
     */
    _onTileDoubleClick: function(sTileId) {
      var oModel = this.getView().getModel();
      var sActiveTile = oModel.getProperty("/activeTile");
      var bCurrentlyVisible = oModel.getProperty("/detailVisible");

      // Toggle off if the same tile is double-clicked
      if (sTileId === sActiveTile) {
        oModel.setProperty("/detailVisible", !bCurrentlyVisible);
        return;
      }

      // Otherwise, show new data for the newly clicked tile
      oModel.setProperty("/activeTile", sTileId);
      oModel.setProperty("/detailVisible", true);

      switch (sTileId) {
        case "cancellationTrendTile":
          oModel.setProperty("/detailHeader", "Trend Details (Last vs Current Month)");
          oModel.setProperty("/detailData", oModel.getProperty("/trendDetails"));
          break;

        case "cancellationsPerDayTile":
          oModel.setProperty("/detailHeader", "Cancellations per Day (Additional)");
          oModel.setProperty("/detailData", oModel.getProperty("/lineChartDetails"));
          break;

        case "inProgressTile":
          oModel.setProperty("/detailHeader", "In-Progress Cancellations");
          oModel.setProperty("/detailData", oModel.getProperty("/inProgressDetails"));
          break;

        case "cancellationStatusTile":
          oModel.setProperty("/detailHeader", "Cancellation Status Details");
          oModel.setProperty("/detailData", oModel.getProperty("/cancellationStatusDetails"));
          break;

        case "avgProcessingTimeTile":
          oModel.setProperty("/detailHeader", "Average Processing Time (By Dept)");
          oModel.setProperty("/detailData", oModel.getProperty("/processingTimeDetails"));
          break;

        case "cancellationReasonsTile":
          oModel.setProperty("/detailHeader", "Top Cancellation Reasons (Detail)");
          oModel.setProperty("/detailData", oModel.getProperty("/donutDetails"));
          break;

        case "pendingApprovalsTile":
          oModel.setProperty("/detailHeader", "Pending Approvals (By Stage)");
          oModel.setProperty("/detailData", oModel.getProperty("/pendingApprovalsDetails"));
          break;

        default:
          oModel.setProperty("/detailHeader", "");
          oModel.setProperty("/detailData", []);
      }
    }
  });
});

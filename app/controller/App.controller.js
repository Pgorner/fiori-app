sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("app.controller.App", {

    onInit: function() {
      var oData = {
        // Track active tile and detail panel
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

        // 2) Line Chart (Cancellations per Day)
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
          { stage: "Initial Review",    value: 10 },
          { stage: "Manager Approval",  value: 8 },
          { stage: "Finalization",      value: 5 }
        ],
        pendingApprovalsDetails: [
          { title: "Initial Review",    description: "10 approvals" },
          { title: "Manager Approval",  description: "8 approvals" },
          { title: "Finalization",      description: "5 approvals" }
        ],

        // Custom tooltip content (for charts other than the line/donut charts)
        tooltipContent: "Custom tooltip details go here."
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
      // Attach double-click handlers for toggling detail panel
      this._attachDblClick("cancellationTrendTile");
      this._attachDblClick("cancellationsPerDayTile");
      this._attachDblClick("inProgressTile");
      this._attachDblClick("cancellationStatusTile");
      this._attachDblClick("avgProcessingTimeTile");
      this._attachDblClick("pendingApprovalsTile");

      // Attach hover events to charts for custom tooltip display
      var oDonutChart = this.byId("cancellationReasonsChart");
      if (oDonutChart) {
        oDonutChart.attachBrowserEvent("mouseover", this.onCustomTooltipMouseOver, this);
        oDonutChart.attachBrowserEvent("mouseout", this.onCustomTooltipMouseOut, this);
      }
      var oLineChart = this.byId("cancellationChart");
      if (oLineChart) {
        oLineChart.attachBrowserEvent("mouseover", this.onCustomTooltipMouseOver, this);
        oLineChart.attachBrowserEvent("mouseout", this.onCustomTooltipMouseOut, this);
      }
      var oPendingChart = this.byId("pendingApprovalsChart");
      if (oPendingChart) {
        oPendingChart.attachBrowserEvent("mouseover", this.onCustomTooltipMouseOver, this);
        oPendingChart.attachBrowserEvent("mouseout", this.onCustomTooltipMouseOut, this);
      }
    },

    _attachDblClick: function(sTileId) {
      var oTile = this.byId(sTileId);
      if (oTile) {
        oTile.attachBrowserEvent("dblclick", this._onTileDoubleClick.bind(this, sTileId));
      }
    },

    _onTileDoubleClick: function(sTileId) {
      var oModel = this.getView().getModel();
      var sActiveTile = oModel.getProperty("/activeTile");
      var bCurrentlyVisible = oModel.getProperty("/detailVisible");

      if (sTileId === sActiveTile) {
        oModel.setProperty("/detailVisible", !bCurrentlyVisible);
        return;
      }

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
        case "pendingApprovalsTile":
          oModel.setProperty("/detailHeader", "Pending Approvals (By Stage)");
          oModel.setProperty("/detailData", oModel.getProperty("/pendingApprovalsDetails"));
          break;
        default:
          oModel.setProperty("/detailHeader", "");
          oModel.setProperty("/detailData", []);
      }
    },

    onCustomTooltipMouseOver: function(oEvent) {
      if (!this._oTooltipPopover) {
        // Create the popover programmatically
        this._oTooltipPopover = new sap.m.Popover({
          placement: "Auto",
          showHeader: false,
          content: new sap.m.Text({ text: "" })
        });
        this.getView().addDependent(this._oTooltipPopover);
      }

      // Use the event's currentTarget id; note that DOM IDs may have additional prefixes/suffixes.
      var sId = oEvent.currentTarget.id;
      // Get control instances using their base IDs.
      var oDonutChart = this.byId("cancellationReasonsChart");
      var oLineChart = this.byId("cancellationChart");
      var oPendingChart = this.byId("pendingApprovalsChart");

      if (sId.indexOf("cancellationReasonsChart") !== -1) {
        // Donut chart logic using angle detection with radial threshold check
        var oVizChart = oDonutChart;
        var oDomRef = oVizChart.getDomRef();
        if (oDomRef) {
          var oRect = oDomRef.getBoundingClientRect();
          var centerX = oRect.left + (oRect.width / 2);
          var centerY = oRect.top + (oRect.height / 2);
          var deltaX = oEvent.clientX - centerX;
          var deltaY = oEvent.clientY - centerY;
          var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          // Define outer and inner radii (innerRadius set to 30% of outerRadius)
          var outerRadius = Math.min(oRect.width, oRect.height) / 2;
          var innerRadius = outerRadius * 0.3;
          // Only show tooltip if pointer is within the donut ring
          if (distance < innerRadius || distance > outerRadius) {
            if (this._oTooltipPopover && this._oTooltipPopover.close) {
              this._oTooltipPopover.close();
            }
            return;
          }
          var angleRad = Math.atan2(deltaY, deltaX);
          var angleDeg = angleRad * (180 / Math.PI);
          if (angleDeg < 0) {
            angleDeg += 360;
          }
          var aData = this.getView().getModel().getProperty("/donutChartData");
          if (aData && aData.length > 0) {
            var totalValue = aData.reduce(function(sum, item) {
              return sum + item.value;
            }, 0);
            var currentAngle = 0;
            var oHoveredSlice = null;
            for (var i = 0; i < aData.length; i++) {
              var sliceAngle = (aData[i].value / totalValue) * 360;
              if (angleDeg >= currentAngle && angleDeg < currentAngle + sliceAngle) {
                oHoveredSlice = aData[i];
                break;
              }
              currentAngle += sliceAngle;
            }
            if (oHoveredSlice) {
              var sNewText = "Reason: " + oHoveredSlice.reason + "\nValue: " + oHoveredSlice.value;
              this._oTooltipPopover.getContent()[0].setText(sNewText);
            }
          }
        }
      } else if (sId.indexOf("cancellationChart") !== -1) {
        // Line chart logic using relative X position
        var oChart = oLineChart;
        var oDomRef = oChart.getDomRef();
        if (oDomRef) {
          var oRect = oDomRef.getBoundingClientRect();
          var fRelativeX = oEvent.clientX - oRect.left;
          var fWidth = oRect.width;
          var aData = this.getView().getModel().getProperty("/lineChartData");
          if (aData && aData.length > 0) {
            var iIndex = Math.floor((fRelativeX / fWidth) * aData.length);
            if (iIndex < 0) { iIndex = 0; }
            if (iIndex >= aData.length) { iIndex = aData.length - 1; }
            var oPoint = aData[iIndex];
            var sNewText = "Date: " + oPoint.date + "\nCancellations: " + oPoint.cancellations;
            this._oTooltipPopover.getContent()[0].setText(sNewText);
          }
        }
      } else if (sId.indexOf("pendingApprovalsChart") !== -1) {
        // Pending Approvals chart logic using relative X position (assuming equally spaced columns)
        var oDomRef = oPendingChart.getDomRef();
        if (oDomRef) {
          var oRect = oDomRef.getBoundingClientRect();
          var fRelativeX = oEvent.clientX - oRect.left;
          var fWidth = oRect.width;
          var aData = this.getView().getModel().getProperty("/pendingChartData");
          if (aData && aData.length > 0) {
            var iIndex = Math.floor((fRelativeX / fWidth) * aData.length);
            if (iIndex < 0) { iIndex = 0; }
            if (iIndex >= aData.length) { iIndex = aData.length - 1; }
            var oPoint = aData[iIndex];
            var sNewText = "Stage: " + oPoint.stage + "\nValue: " + oPoint.value;
            this._oTooltipPopover.getContent()[0].setText(sNewText);
          }
        }
      } else {
        // Default tooltip logic
        var sDefaultText = this.getView().getModel().getProperty("/tooltipContent");
        this._oTooltipPopover.getContent()[0].setText(sDefaultText);
      }

      // Open the tooltip relative to the originating control.
      this._oTooltipPopover.openBy(oEvent.currentTarget);
    },

    onCustomTooltipMouseOut: function(oEvent) {
      if (this._oTooltipPopover && this._oTooltipPopover.close) {
        this._oTooltipPopover.close();
      }
    },

    // Formatter for NumericContent valueColor
    formatValueColor: function(oCancellationTrend) {
      if (!oCancellationTrend) {
        return "Neutral";
      }
      if (oCancellationTrend.value === 0) {
        return "Neutral";
      } else if (oCancellationTrend.indicator === "Up") {
        return "Error";
      } else if (oCancellationTrend.indicator === "Down") {
        return "Good";
      }
      return "Neutral";
    },

    onSearch: function(oEvent) {
      var sQuery = oEvent.getParameter("query");
      var aFilters = [];
      if (sQuery && sQuery.length > 0) {
        aFilters.push(new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, sQuery));
        aFilters.push(new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, sQuery));
      }
      var oGlobalFilter = new sap.ui.model.Filter({
        filters: aFilters,
        and: false
      });
      var oTable = this.byId("globalDetailTable");
      var oBinding = oTable.getBinding("rows");
      oBinding.filter(sQuery ? [oGlobalFilter] : []);
    },

    onPrintPress: function() {
      var oTable = this.byId("globalDetailTable");
      var aSelectedIndices = oTable.getSelectedIndices();
      var oModel = this.getView().getModel();
      var aDataToPrint = [];

      if (aSelectedIndices && aSelectedIndices.length > 0) {
        aSelectedIndices.forEach(function(iIndex) {
          var oContext = oTable.getContextByIndex(iIndex);
          if (oContext) {
            aDataToPrint.push(oContext.getObject());
          }
        });
      } else {
        aDataToPrint = oModel.getProperty("/detailData");
      }

      var sHTML = "<table border='1' style='width:100%; border-collapse:collapse;'>";
      sHTML += "<thead><tr><th>Title</th><th>Description</th></tr></thead>";
      sHTML += "<tbody>";
      if (aDataToPrint && aDataToPrint.length > 0) {
        aDataToPrint.forEach(function(item) {
          sHTML += "<tr><td>" + item.title + "</td><td>" + item.description + "</td></tr>";
        });
      } else {
        sHTML += "<tr><td colspan='2'>No data</td></tr>";
      }
      sHTML += "</tbody></table>";

      var sStyles = "<style>" +
                      "table { width: 100%; border-collapse: collapse; }" +
                      "th, td { border: 1px solid #000; padding: 5px; text-align: left; }" +
                    "</style>";

      var sPrintWindowHTML = "<html><head><title>Print Table</title>" + sStyles + "</head><body>" + sHTML + "</body></html>";

      var oPrintWindow = window.open("", "_blank");
      oPrintWindow.document.open();
      oPrintWindow.document.write(sPrintWindowHTML);
      oPrintWindow.document.close();
      oPrintWindow.focus();
      oPrintWindow.print();
      oPrintWindow.close();
    },

    onExportPress: function(oEvent) {
      var oModel = this.getView().getModel();
      var aData = oModel.getProperty("/detailData");
      if (!aData || !aData.length) {
        sap.m.MessageToast.show("No data available for export.");
        return;
      }
      
      var sCSV = "Title,Description\n";
      aData.forEach(function(item) {
        sCSV += '"' + item.title + '","' + item.description + '"\n';
      });
      
      var oBlob = new Blob([sCSV], { type: 'text/csv;charset=utf-8;' });
      var sURL = URL.createObjectURL(oBlob);
      var oLink = document.createElement("a");
      oLink.href = sURL;
      oLink.download = "DetailData.csv";
      oLink.style.display = "none";
      document.body.appendChild(oLink);
      oLink.click();
      document.body.removeChild(oLink);
    }

  });
});

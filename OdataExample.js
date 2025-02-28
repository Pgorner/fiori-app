sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v2/ODataModel"
], function(Controller, JSONModel, ODataModel) {
  "use strict";

  return Controller.extend("my.fiori.app.controller.App", {

    onInit: function() {
      // 1) Create ODataModel (or get it from manifest)
      this._oODataModel = new ODataModel("/sap/opu/odata/sap/ZCANCELLATION_SRV/", {
        useBatch: false
      });

      // 2) Create local JSON model for tile data
      // Pre-initialize so the view sees empty arrays
      this._oLocalModel = new JSONModel({
        activeTile: null,
        detailVisible: false,
        detailHeader: "",
        detailData: [],

        cancellationTrend: {},
        trendDetails: [],
        donutChartData: [],
        donutDetails: [],
        // ... add placeholders for lineChartData, inProgressDetails, etc.
      });
      this.getView().setModel(this._oLocalModel);

      // 3) Load tile data
      this._loadTileData();
    },

    _loadTileData: function() {
      // Example usage of the template method:

      // A) Donut Reasons
      this._loadDataFromOData(
        "/DonutReasonsSet",
        "/donutChartData",
        function(aResults) {
          // Transform each item to what the donut chart expects
          return aResults.map(function(item) {
            return {
              reason: item.Reason,
              value: item.Value
            };
          });
        },
        "Failed to load donut data."
      );

      // For the detail panel on donut tile
      this._loadDataFromOData(
        "/DonutReasonsSet",
        "/donutDetails",
        function(aResults) {
          return aResults.map(function(item) {
            return {
              title: item.Reason,
              description: item.Value + " instances"
            };
          });
        }
      );

      // B) Cancellation Trend
      this._loadDataFromOData(
        "/CancellationsTrendSet",
        "/trendDetails",
        function(aResults) {
          // Maybe do some custom logic here
          return aResults.map(function(rec) {
            return {
              title: rec.MonthText, 
              description: rec.Count + " cancellations"
            };
          });
        },
        "Failed to load trend data."
      );

      // etc. for inProgress, lineChart, status, etc.
    },

    /**
     * Generic template for reading data from OData & storing in local JSON model
     */
    _loadDataFromOData: function(sEntitySet, sLocalPath, fnTransform, sErrorMsg) {
      var oODataModel = this._oODataModel;
      var oLocalModel = this._oLocalModel;
      var sMsg = sErrorMsg || "Failed to load data from " + sEntitySet;

      oODataModel.read(sEntitySet, {
        success: function(oData) {
          var aResults = oData.results || [];
          if (typeof fnTransform === "function") {
            aResults = fnTransform(aResults);
          }
          oLocalModel.setProperty(sLocalPath, aResults);
        },
        error: function() {
          sap.m.MessageToast.show(sMsg);
        }
      });
    },

    onAfterRendering: function() {
      // attach dblclick for each tile, as usual
      this._attachDblClick("cancellationTrendTile");
      this._attachDblClick("cancellationReasonsTile");
      // ...
    },

    _attachDblClick: function(sTileId) {
      var oTile = this.byId(sTileId);
      if (oTile) {
        oTile.attachBrowserEvent("dblclick", this._onTileDoubleClick.bind(this, sTileId));
      }
    },

    _onTileDoubleClick: function(sTileId) {
      // toggle logic, same as before
      var oModel = this._oLocalModel;
      var sActiveTile = oModel.getProperty("/activeTile");
      var bCurrentlyVisible = oModel.getProperty("/detailVisible");

      if (sTileId === sActiveTile) {
        oModel.setProperty("/detailVisible", !bCurrentlyVisible);
        return;
      }

      oModel.setProperty("/activeTile", sTileId);
      oModel.setProperty("/detailVisible", true);

      // pick which data to show in the bottom panel
      switch (sTileId) {
        case "cancellationReasonsTile":
          oModel.setProperty("/detailHeader", "Top Cancellation Reasons");
          oModel.setProperty("/detailData", oModel.getProperty("/donutDetails"));
          break;
        // ...
        default:
          oModel.setProperty("/detailHeader", "");
          oModel.setProperty("/detailData", []);
      }
    }
  });
});

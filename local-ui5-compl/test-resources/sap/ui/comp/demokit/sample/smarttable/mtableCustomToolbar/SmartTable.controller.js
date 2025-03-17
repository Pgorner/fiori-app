sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/comp/sample/smarttable/mockserver/DemoMockServer',
	'sap/m/MessageToast'
], function (Controller, ODataModel, DemoMockServer, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.mtableCustomToolbar.SmartTable", {
		onInit: function () {
			var oModel, oView;

			this._oMockServer = new DemoMockServer();

			oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});

			oView = this.getView();
			oView.setModel(oModel);
		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

		onSort: function () {
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Sort");
			}
		},

		onFilter: function () {
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Filter");
			}
		},

		onGroup: function () {
			MessageToast.show("Not available as this feature is disabled for this app in the view.xml");
		},

		onColumns: function () {
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Columns");
			}
		},

		_getSmartTable: function () {
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("LineItemSmartTable");
			}
			return this._oSmartTable;
		},

		applyUiState: function () {
			var oSmartTable = this._getSmartTable(),
				oUiState = oSmartTable.getUiState(),
				oPresentationVariant = oUiState.getPresentationVariant();

			// change SortOrder
			oPresentationVariant.SortOrder = [{
				Property: "Dmbtr",
				Descending: false
			}];

			// change my Bukrs column width
			var oColumnWidth = oPresentationVariant.Visualizations.find(function(oVisualization) {
				return oVisualization.Type === "ColumnWidth";
			});
			var oMyBukrsColumnSettings = oColumnWidth.Content.find(function(oContent) {
				return oContent.Value === "Bukrs";
			});
			oMyBukrsColumnSettings.Width = "10rem";

			oUiState.setPresentationVariant(oPresentationVariant);
			oSmartTable.setUiState(oUiState);
		},

		onUiStateChange: function(oEvent) {
			MessageToast.show("UI state changed for SmartTable with id - " + oEvent.getSource().getId());
		},

		onExit: function () {
			this._oSmartTable = null;
			this._oMockServer.destroy(this.getView());
		}
	});
});

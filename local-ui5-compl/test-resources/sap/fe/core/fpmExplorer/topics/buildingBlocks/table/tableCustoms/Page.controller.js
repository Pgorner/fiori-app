sap.ui.define(
	["sap/fe/core/PageController", "sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/Sorter"],
	function (PageController, MessageBox, Filter, FilterOperator, Sorter) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.tableCustoms.Page", {
			onInit: function () {
				PageController.prototype.onInit.apply(this);
				this.getView().getModel("ui").setProperty("/isEditable", true);
				this.getView().getModel("ui").setProperty("/myColumnVisible", true);
			},
			hideMyColumn() {
				var oTable = this.byId("LineItemTablePageCustomColumns");
				// Warning: this API is still experimental
				oTable.hideColumns(["FirstColumnKey"]);
				this.getView().getModel("ui").setProperty("/myColumnVisible", false);
			},
			showMyColumn() {
				var oTable = this.byId("LineItemTablePageCustomColumns");
				// Warning: this API is still experimental
				oTable.showColumns(["FirstColumnKey"]);
				this.getView().getModel("ui").setProperty("/myColumnVisible", true);
			},
			onRowPressed(oEvent) {
				MessageBox.show("You pressed the row, you should navigate");
			},
			onPressAction(oEvent) {
				var oTable = this.byId("LineItemTablePageCustomActions");
				var aSelection = oTable.getSelectedContexts();
				MessageBox.show("You pressed the custom action with " + aSelection.length + " rows selected");
			},
			tableRefreshed(event) {
				var collectionBindingInfoAPI = event.getParameter("collectionBindingInfo");

				//Add a filter
				var filter = new Filter({
					path: "BooleanProperty",
					operator: FilterOperator.EQ,
					value1: false
				});
				collectionBindingInfoAPI.addFilter(filter);

				//Add a sorter
				var sorter = new Sorter("ID", true);
				collectionBindingInfoAPI.addSorter(sorter);

				//Request an additional property to the request
				collectionBindingInfoAPI.addSelect(["TagStatus"]);
			},
			onPressInColumn(oEvent) {
				MessageBox.show("You pressed the custom action in the table");
			},
			onTableSelectionChanged(oEvent) {
				var oTable = this.byId("LineItemTableRowPress");
				MessageBox.show("Selection has changed. " + oTable.getSelectedContexts().length + " rows are selected.");
			},
			onPressMenuAction(oEvent) {
				MessageBox.show("You pressed the custom action: " + oEvent.oSource.mProperties.text);
			}
		});
	}
);

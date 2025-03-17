sap.ui.define(
	["sap/fe/core/PageController", "sap/m/MessageToast", "sap/ui/model/json/JSONModel"],
	function (PageController, MessageToast, JSONModel) {
		"use strict";
		return PageController.extend("sap.fe.core.fpmExplorer.filterBarParameterizedWithTable.FilterBarParameterizedWithTable", {
			onAfterRendering: function (oEvent) {
				var oView = this.getView();
				// showMessageDialog as false initial trigger search will not show the message dialog on empty mandatory fields
				var mFBConditions = new JSONModel({
					allFilters: "",
					showMessageDialog: false,
					filtersTextInfo: oView.byId("FilterBar").getActiveFiltersText()
				});
				oView.setModel(mFBConditions, "fbConditions");
				oView
					.byId("FilterBar")
					.triggerSearch()
					.then(() => {
						//If mandatory fields validation is successful, promise is resolved and search is triggered
						MessageToast.show("Filter Search Triggered");
					})
					.catch(() => {
						//If mandatory fields validation fails, search isn't triggered as promise is rejected
						console.log("promise is rejected, so highlighting missing mandatory fields");
					})
					.finally(() => {
						//showMessageDialog as true to show the message dialog on empty mandatory fields on click of 'Go'
						mFBConditions.setProperty("/showMessageDialog", true);
					});
			},
			handlers: {
				onSearch: function (oEvent) {
					var oView = this.getView();
					var filterBar = oView.byId("FilterBar");
					var allFilters = filterBar.getFilters();
					var oSource = oEvent.getSource();
					var mFBConditions = oSource.getModel("fbConditions");
					mFBConditions.setProperty("/showMessageDialog", true);
				}
			}
		});
	}
);

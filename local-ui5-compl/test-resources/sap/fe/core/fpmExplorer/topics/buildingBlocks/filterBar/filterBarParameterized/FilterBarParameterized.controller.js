sap.ui.define(["sap/fe/core/PageController", "sap/ui/model/json/JSONModel"], function (PageController, JSONModel) {
	"use strict";
	return PageController.extend("sap.fe.core.fpmExplorer.filterBarParameterized.FilterBarParameterized", {
		onAfterRendering: function (oEvent) {
			var oView = this.getView();
			var mFBConditions = new JSONModel({
				allFilters: "",
				expanded: false
			});
			oView.setModel(mFBConditions, "fbConditions");
		},

		handlers: {
			onFiltersChanged: function (oEvent) {
				var oView = this.getView();
				var filterBar = oView.byId("FilterBar");
				var allFilters = filterBar.getFilters();

				var oSource = oEvent.getSource();
				var mFBConditions = oSource.getModel("fbConditions");
				mFBConditions.setProperty("/allFilters", JSON.stringify(allFilters, null, "  "));

				if (Object.keys(allFilters).length > 0) {
					mFBConditions.setProperty("/expanded", true);
				}
				mFBConditions.setProperty("/filtersTextInfo", oSource.getActiveFiltersText());
			}
		}
	});
});

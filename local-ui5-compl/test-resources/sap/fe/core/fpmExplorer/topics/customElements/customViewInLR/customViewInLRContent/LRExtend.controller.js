sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/model/Filter"], function (ControllerExtension, Filter) {
	"use strict";
	return ControllerExtension.extend("sap.fe.core.fpmExplorer.customViewInLRContent.LRExtend", {
		override: {
			onViewNeedsRefresh: function (mParameters) {
				var oFilterInfo = mParameters.filterConditions;
				// Prepare binding info with filter/search parameters
				if (oFilterInfo) {
					var duplicateFilterInfo = Object.assign({}, oFilterInfo);
					var oTable = this.getView().byId(
							"sap.fe.core.fpmExplorer.customViewInLRContent::Default--fe::CustomTab::tab2--customViewWithTable"
						),
						oBinding = oTable.getBinding("items"),
						oConvertedFilter = this.base.getExtensionAPI().createFiltersFromFilterConditions(duplicateFilterInfo);
					oTable.setShowOverlay(false);
					var oFilter = new Filter({ filters: oConvertedFilter.filters, and: true });
					oBinding.filter(oFilter);
					oBinding.changeParameters({ $search: oConvertedFilter.search });
				}
			},
			onPendingFilters: function () {
				var oTable = this.getView().byId(
					"sap.fe.core.fpmExplorer.customViewInLRContent::Default--fe::CustomTab::tab2--customViewWithTable"
				);
				if (oTable) {
					oTable.setShowOverlay(true);
				}
			},
			onAfterClear: function (oEvent) {
				var oFilterBarAPI = oEvent.getSource();
				oFilterBarAPI.setFilterValues("ID", "EQ", 1);
			}
		}
	});
});

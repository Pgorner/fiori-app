sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/IllustratedMessage",
		"sap/m/IllustratedMessageType"
	],
	function (ControllerExtension, Filter, FilterOperator, IllustratedMessage, IllustratedMessageType) {
		"use strict";

		return ControllerExtension.extend("sap.fe.core.fpmExplorer.OPExtend", {
			onTableRefresh: function (event) {
				var collectionBindingInfoAPI = event.getParameter("collectionBindingInfo");

				// Add a combined filter
				var filter = new Filter({
					filters: [
						new Filter({
							path: "ID",
							operator: FilterOperator.EQ,
							value1: 1
						}),
						new Filter({
							path: "ID",
							operator: FilterOperator.EQ,
							value1: 2
						})
					],
					or: true | false
				});
				collectionBindingInfoAPI.addFilter(filter);

				var table = this.getView().byId("fe::table::_Child::LineItem::Table");
				var illustratedMessage = new IllustratedMessage({
					title: "My custom Title",
					description: "My custom Description",
					illustrationType: IllustratedMessageType.NoSearchResults
				});
				table.setAggregation("noData", illustratedMessage);
			},
			tableGetVariantManagement: function () {
				var table = this.getView().byId("fe::table::_Child::LineItem::Table");
				this.getView()
					.byId("fe::CustomSubSection::customSubSection1--getVariantManagementText")
					.setText(table.getCurrentVariantKey());
			},
			tableSetVariantManagement: function () {
				var table = this.getView().byId("fe::table::_Child::LineItem::Table");
				table.setCurrentVariantKey(
					this.getView().byId("fe::CustomSubSection::customSubSection1--setVariantManagementInput").getValue()
				);
			},
			hideChildDescriptionColumn: function (event) {
				var table = this.getView().byId("fe::table::_Child::LineItem::Table");
				// Warning: this API is still experimental
				table.hideColumns(["DataField::ChildDescriptionProperty"]);
				event.getSource().setEnabled(false);
			},
			showChildDescriptionColumn: function (event) {
				var table = this.getView().byId("fe::table::_Child::LineItem::Table");
				// Warning: this API is still experimental
				table.showColumns(["DataField::ChildNameProperty"]);
				table.getModel("ui").setProperty("/myColumnVisible", true);
				event.getSource().setEnabled(false);
			}
		});
	}
);

sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/IllustratedMessage",
		"sap/m/IllustratedMessageType",
		"sap/m/Button",
		"sap/m/MessageToast",
		"sap/m/IllustratedMessageSize"
	],
	function (
		ControllerExtension,
		Filter,
		FilterOperator,
		IllustratedMessage,
		IllustratedMessageType,
		Button,
		MessageToast,
		IllustratedMessageSize
	) {
		"use strict";

		return ControllerExtension.extend("sap.fe.core.fpmExplorer.OPExtend", {
			onTableRefresh: function (event) {
				var collectionBindingInfoAPI = event.getParameter("collectionBindingInfo");
				var table = this.getView().byId("fe::table::_Child::LineItem::Table");
				var illustratedMessage = new IllustratedMessage();
				var showDialogNoData = function () {
					return MessageToast.show("Action when No Data in edit mode");
				};
				var showDialogFilterSearch = function () {
					return MessageToast.show("Action when No Data with filter or search");
				};
				//Filters or Search applied
				if (
					(collectionBindingInfoAPI.getFilters() && collectionBindingInfoAPI.getFilters().aFilters.length > 0) ||
					collectionBindingInfoAPI.collectionBindingInfo.parameters.$search
				) {
					illustratedMessage.setTitle("No Data");
					illustratedMessage.setDescription("Change Search or filter criteria.");
					illustratedMessage.setIllustrationType(IllustratedMessageType.NoSearchResults);
					illustratedMessage.setIllustrationSize(sap.m.IllustratedMessageSize.Dot);
					illustratedMessage.addAdditionalContent(new Button({ text: "My Action", press: showDialogFilterSearch }));
					table.setNoData(illustratedMessage);
				} else {
					//No filter or search and table in edit mode
					illustratedMessage.setTitle("No Item found");
					illustratedMessage.setDescription("Please create some.");
					illustratedMessage.setIllustrationType(IllustratedMessageType.NoSearchResults);
					illustratedMessage.setIllustrationSize(sap.m.IllustratedMessageSize.Dot);
					//Button visibility depends on the edit mode
					illustratedMessage.addAdditionalContent(
						new Button({ text: "Create New Item", visible: "{ui>/isEditable}", press: showDialogNoData })
					);
					table.setNoData(illustratedMessage);
				}
			}
		});
	}
);

/* eslint-disable */
sap.ui.define([
	"sap/m/ColumnListItem",
	"sap/m/ListType",
	"sap/m/Table",
	"sap/m/BackgroundDesign",
	"sap/m/ListSeparators",
	"sap/m/Column",
	"sap/ui/core/TextAlign",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/m/Page",
	"sap/m/ObjectHeader",
	"sap/m/ObjectAttribute",
	"sap/m/Link",
	"sap/m/Text",
	"sap/suite/ui/commons/ThingGroupDesign",
	"sap/ui/layout/Grid",
	"sap/m/VBox",
	"sap/m/Label",
	"sap/ui/layout/GridData",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities"
], function(ColumnListItem, ListType, Table, BackgroundDesign, ListSeparators, Column, TextAlign, JSONModel,
	UnifiedThingGroup, Page, ObjectHeader, ObjectAttribute, Link, Text, ThingGroupDesign, Grid, VBox,
	Label, GridData, FacetOverview, Utilities) {
	'use strict';
	
	var oOrdersData = {
		navigation: [
			{
				name: "23000",
				description: "CeBit Demo",
				orderType: "040 Event",
				systemStatus: "Planned"
			}, {
				name: "23120",
				description: "Order 2",
				orderType: "040 Event",
				systemStatus: "Released"
			}, {
				name: "23230",
				description: "Order 3",
				orderType: "040 Event",
				systemStatus: "Released"
			}, {
				name: "21000",
				description: "Order 4",
				orderType: "040 Event",
				systemStatus: "Released"
			}
		]
	};

	var oTemplateOrdersData = new ColumnListItem({
		type: ListType.Navigation,
		press: function(oEvent) {
			var sId = oEvent.getSource().getCells()[0].getText();
			var sDesc = oEvent.getSource().getCells()[1].getText();
			var sOrderType = oEvent.getSource().getCells()[2].getText();
			var sStatus = oEvent.getSource().getCells()[3].getText();
	
			var oDeliveryData = {
				items: [
					{ label: "Name", text: "SAP Germany" },
					{ label: "Street", text: "Dietmar-Hopp-Allee 16" },
					{ label: "City", text: "69190 Walldorf" },
					{ label: "Country", text: "Germany" }
				]
			};
	
			var oDeliveryTable = new Table({
				backgroundDesign: BackgroundDesign.Transparent,
				showSeparators: ListSeparators.None,
				columns: [
					new Column({
						width: "42%",
						hAlign: TextAlign.End
					}),
					new Column({})
				],
				items: {
					path: "/items",
					factory: fnGeneralTableItemFactory
				}
			});
			oDeliveryTable.setModel(new JSONModel(oDeliveryData));
			oDeliveryTable.addStyleClass("sapSuiteUtiGeneral");
			oDeliveryTable.addStyleClass("sapSuiteUtiGeneralOnPage");
	
			var oDeliveryUtg = new UnifiedThingGroup({
				content: oDeliveryTable,
				description: "Delivery Address"
			});
	
			var oPage = new Page("page-" + sId, {
				title: "Order Detail",
				showNavButton: true,
				content: [
					new ObjectHeader({
						title: sDesc,
						number: sId,
						flagged: true,
						showFlag: true,
						attributes: [
							new ObjectAttribute({ text: sOrderType }),
							new ObjectAttribute({ text: sStatus })
						]
					}).addStyleClass("sapSuiteUtiOrderDetails"),
					oDeliveryUtg
				]
			});
			oUTI.navigateToPage(oPage, true);
		},
		unread: false,
		cells: [
			new Link({ text: "{name}" }),
			new Text({ text: "{description}" }),
			new Text({ text: "{orderType}" }),
			new Text({ text: "{systemStatus}" })
		]
	});
	
	var oListOrdersForm = new Table("internal-orders-list", {
		threshold: 2,
		inset: false,
		showUnread: true,
		scrollToLoad: true,
		columns: [
			new Column({
				hAlign: TextAlign.Begin,
				header: new Text({ text: "Order Number" }),
				width: "25%"
			}), new Column({
				hAlign: TextAlign.Begin,
				header: new Text({ text: "Description" }),
				minScreenWidth: "Tablet",
				width: "25%",
				demandPopin: true
			}), new Column({
				hAlign: TextAlign.Begin,
				width: "25%",
				header: new Text({ text: "Order Type" }),
				demandPopin: true
			}), new Column({
				hAlign: TextAlign.Begin,
				header: new Text({ text: "System Status" }),
				demandPopin: true
			})
		],
		items: {
			path: "/navigation",
			template: oTemplateOrdersData
		}
	});
	
	var oListOrdersFormGroup = new UnifiedThingGroup("orders", {
		title: "Internal Orders",
		description: Utilities.isPhone ? "" : "4711, Marketing",
		content: oListOrdersForm,
		design: ThingGroupDesign.TopIndent
	});
	
	var oModelOrders = new JSONModel();
	oModelOrders.setData(oOrdersData);
	oListOrdersForm.setModel(oModelOrders);
	
	var oOrdersContent = new Grid("form-orders", {
		defaultSpan: "L6 M6 S6",
		content: [
			new VBox({
				items: [
					new Label({ text: "CeBit Demo:" }),
					new Text({ text: "040 Event" })
				]
			}),
			new VBox({
				items: [
					new Label({ text: "Order 2:" }),
					new Text({ text: "040 Event" })
				]
			}),
			new VBox({
				items: [
					new Label({ text: "Order 3:" }),
					new Text({ text: "040 Event" })
				],
				layoutData: new GridData({ visibleOnSmall: false })
			}),
			new VBox({
				items: [
					new Label({ text: "Order 4:" }),
					new Text({ text: "040 Event" })
				],
				layoutData: new GridData({ visibleOnSmall: false })
			})
		]
	}).addStyleClass("sapUtiFacetOverviewContentMargin");
	
	var oOrdersFacet = function(setFacetContent){
		return new FacetOverview("facet-orders", {
			title: "Internal Orders",
			quantity: 3,
			content: oOrdersContent,
			heightType: Utilities.isPhone ? "Auto" : "M",
			press: function() {
				setFacetContent("orders");
			}
		});
	};

	return {
		oListOrdersFormGroup,
		oOrdersFacet,
	};
});
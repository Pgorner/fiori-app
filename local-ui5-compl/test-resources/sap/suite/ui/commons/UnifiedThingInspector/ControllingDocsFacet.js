/* eslint-disable */
sap.ui.define([
	"sap/m/ColumnListItem",
	"sap/m/Text",
	"sap/m/Link",
	"sap/m/Table",
	"sap/m/Column",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/suite/ui/commons/ThingGroupDesign",
	"sap/ui/layout/Grid",
	"sap/m/VBox",
	"sap/m/Label",
	"sap/ui/layout/GridData",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities"
], function(ColumnListItem, Text, Link, Table, Column, JSONModel, UnifiedThingGroup, ThingGroupDesign,
	Grid, VBox, Label, GridData, FacetOverview, Utilities
	){
	'use strict';
	
	var oControllingDocsData = {
		content: [
			{
				date: "20.04.2013",
				document: "47110001",
				header: "Header Text",
				amount: "140 USD",
				amountTC: "110 EUR"
			}, {
				date: "20.04.2013",
				document: "47110020",
				header: "Header Text",
				amount: "140 USD",
				amountTC: "110 EUR"
			}, {
				date: "20.04.2013",
				document: "47112300",
				header: "Header Text",
				amount: "230 USD",
				amountTC: "190 EUR"
			}, {
				date: "20.04.2013",
				document: "47112500",
				header: "Header Text",
				amount: "230 USD",
				amountTC: "190 EUR"
			}, {
				date: "20.04.2013",
				document: "47113000",
				header: "Header Text",
				amount: "140 USD",
				amountTC: "110 EUR"
			}, {
				date: "20.04.2013",
				document: "47113100",
				header: "Header Text",
				amount: "210 USD",
				amountTC: "170 EUR"
			}, {
				date: "20.04.2013",
				document: "47113200",
				header: "Header Text",
				amount: "140 USD",
				amountTC: "110 EUR"
			}
		]
	};

	var oControllingDocsTemplate = new ColumnListItem({
		cells: [
			new Text({ text: "{date}" }),
			new Link({ text: "{document}" }),
			new Text({ text: "{header}" }),
			new Text({ text: "{amount}" }),
			new Text({ text: "{amountTC}" })
		]
	});

	var oControllingDocsList = new Table({
		columns: [
			new Column({
				header: new Text({ text: "Posting Date" })
			}), new Column({
				header: new Text({ text: "Document No" })
			}), new Column({
				header: new Text({ text: "Header Text" })
			})
		],
		items: {
			path: "/content",
			template: oControllingDocsTemplate
		}
	});

	/*If we are not on small screens - add two more columns.
	 Previously this was implemented by sap.m.Column's demandPopin and minScreenWidth.
	 But sap.m.Column's logic does not work well on iOS7 devices and on large Android phones.
	 On that devices these two columns are always shown with demandPopin:true and minScreenWidth: Tablet.
	 But according to documentation they should be hidden.
	 */
	if (!Utilities.isPhone) {
		oControllingDocsList.addColumn(new Column({
			width: "25%",
			header: new Text({ text: "Amount in Controlling Area Currency" }),
			minScreenWidth: "Tablet",
			demandPopin: true
		}));
		oControllingDocsList.addColumn(new Column({
			width: "25%",
			header: new Text({ text: "Amount in Transaction Currency" }),
			minScreenWidth: "Large",
			demandPopin: true
		}));
	}
	
	var oControllingDocsModel = new JSONModel();
	oControllingDocsModel.setData(oControllingDocsData);
	oControllingDocsList.setModel(oControllingDocsModel);
	
	var oListControllingDocsGroup = new UnifiedThingGroup("docs", {
		title: "Controlling Documents",
		description: "4711, Marketing",
		content: oControllingDocsList,
		design: ThingGroupDesign.TopIndent
	});
	
	var oControllingDocsContent = new Grid("form-docs", {
		defaultSpan: "L6 M6 S6",
		content: [
			new VBox({
				items: [
					new Label({ text: "4711000:" }),
					new Text({ text: "240 USD" })
				]
			}),
			new VBox({
				items: [
					new Label({ text: "4711001:" }),
					new Text({ text: "110 USD" })
				]
			}),
			new VBox({
				items: [
					new Label({ text: "4711002:" }),
					new Text({ text: "320 USD" })
				],
				layoutData: new GridData({ visibleOnSmall: false })
			}),
			new VBox({
				items: [
					new Label({ text: "4711003:" }),
					new Text({ text: "2670 USD" })
				],
				layoutData: new GridData({ visibleOnSmall: false })
			})
		]
	}).addStyleClass("sapUtiFacetOverviewContentMargin");
	
	var oControllingDocsFacet = function(setFacetContent) {
		return	new FacetOverview("facet-documents", {
			title: "Controlling Documents 00001 - Walldorf, Germany",
			quantity: 99000,
			content: oControllingDocsContent,
			heightType: Utilities.isPhone ? "Auto" : "M",
			press: function() {
				setFacetContent("controllingDocs");
		}
		});
	}
	return {
		oControllingDocsFacet,
		oListControllingDocsGroup
	};
});
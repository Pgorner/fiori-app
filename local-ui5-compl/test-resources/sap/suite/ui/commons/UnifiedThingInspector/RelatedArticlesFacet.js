/* eslint-disable */
sap.ui.define([
	"sap/m/ColumnListItem",
	"sap/m/Text",
	"sap/m/List",
	"sap/m/Column",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/suite/ui/commons/ThingGroupDesign",
	"sap/m/Link",
	"sap/suite/ui/commons/UnifiedThingInspector",
	"sap/suite/ui/commons/KpiTile",
	"sap/m/Page",
	"sap/m/Label",
	"sap/m/Table",
	"sap/m/BackgroundDesign",
	"sap/m/ListSeparators",
	"sap/ui/core/TextAlign",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities",
	"./ActivityTypesFacet",
	"./GeneralFacet",
	"./InternalOrderFacet"
], function(ColumnListItem, Text, List, Column, JSONModel, UnifiedThingGroup, ThingGroupDesign, Link,
	UnifiedThingInspector, KpiTile, Page, Label, Table, BackgroundDesign, ListSeparators, TextAlign, FacetOverview,
	Utilities, ActivityTypesFacet, GeneralFacet, InternalOrderFacet) {

	'use strict';

	var oRelatedArticlesTemplate = new ColumnListItem({
		cells: [
			new Text({ text: "{country}" }),
			new Text({ text: "{plant}" }),
			new Text({ text: "{location}" }),
			new Text({ text: "{available}" })
		]
	});
	
	var oRelatedArticlesList = new List({
		columns: [
			new Column({
				header: new Text({ text: "Country" })
			}), new Column({
				header: new Text({ text: "Plant" })
			}), new Column({
				width: "40%",
				header: new Text({ text: "Related Articles" }),
				minScreenWidth: "Tablet",
				demandPopin: true
			}), new Column({
				hAlign: "Center",
				width: "15%",
				header: new Text({ text: "Available Stock" }),
				minScreenWidth: "Tablet",
				demandPopin: true
			})
		],
		items: {
			path: "/content",
			template: oRelatedArticlesTemplate
		}
	});
	
	var oRelatedArticlesData = {
		content: [
			{
				country: "Germany",
				plant: "DC Germany South",
				location: "Loc1 Mills Rd",
				available: "200"
			}, {
				country: "Germany",
				plant: "DC Germany South",
				location: "Loc2 Lee Avenue",
				available: "40"
			}, {
				country: "Germany",
				plant: "Store Munich",
				location: "South Castle Peak Rd",
				available: "20"
			}
		]
	};
	
	var oRelatedArticlesModel = new JSONModel();
	oRelatedArticlesModel.setData(oRelatedArticlesData);
	oRelatedArticlesList.setModel(oRelatedArticlesModel);
	
	var oRelatedArticlesContent = new UnifiedThingGroup("related-articles", {
		title: "Related Articles",
		description: "4711, Marketing",
		content: oRelatedArticlesList,
		design: ThingGroupDesign.TopIndent
	});
	
	var oRelatedArticlesFacetData = {
		items: [
			{ type: "link", href: "", label: "Location 001", text: "Fresh Strawberries" }
		]
	};
	
	var oRelatedArticlesTemplate_Link = new ColumnListItem({
		cells: [
			new Link({
				text: {
					path: "text",
					formatter: function(v) {
						var concatString = Utilities.isPhone ? ":" : " -";
						return v ? v + concatString : "";
					}
				},
	
				press: function(oe) {
					oUTI2 = new UnifiedThingInspector({
						id: "unified2",
						icon: "images/strawberries_frozen.jpg",
						title: "Article",
						name: "Fresh Strawberries",
						description: "{/description}",
						actionsVisible: true,
						transactionsVisible: true,
						kpis: [
							new KpiTile({
								value: "28",
								description: "Employees, 8000",
								doubleFontSize: true
							}),
							new KpiTile({
								value: "1200h",
								description: "Production Hours, 0815",
								doubleFontSize: true
							})
						],
						facets: [GeneralFacet.oGeneralFacet().clone(), InternalOrderFacet.oOrdersFacet().clone(), ActivityTypesFacet.oActivityTypesFacet().clone()],
						backAction: function() {
							oUTI2.destroy();
							oUTI._navigateToMaster();
							return false;
						},
						transactions: {
							path: "/transactions",
							template: oLinkTempl
						},
						actions: {
							path: "/actions",
							template: oButtonTempl
						}
					});
					var oUTI2Page = new Page({
						showHeader: false,
						showFooter: false,
						enableScrolling: false,
						content: [oUTI2]
					});
	
					oUTI.navigateToPage(oUTI2Page, true);
					return false;
				}
			}),
			new Label({
				text: {
					path: "label"
				}
			})
		]
	});
	
	var fnArticlesTableItemFactory = function(sId, oContext) {
		var type = oContext.getProperty("type");
		var rowTemplate;
		switch (type) {
			case "custom":
				rowTemplate = oContext.getProperty("row") || oGeneralTableTemplate_Text;
				break;
			case "separator":
				rowTemplate = oGeneralTableTemplate_Separator;
				break;
			case "heading":
				rowTemplate = oGeneralTableTemplate_Heading;
				break;
			case "link":
				rowTemplate = oRelatedArticlesTemplate_Link;
				break;
			default:
				rowTemplate = oGeneralTableTemplate_Text;
		}
		return rowTemplate.clone();
	};
	
	var oRelatedArticlesContentTable = new Table({
		backgroundDesign: BackgroundDesign.Transparent,
		showSeparators: ListSeparators.None,
		columns: [
			new Column({
				width: Utilities.isPhone ? "60%" : "40%",
				hAlign: TextAlign.End
			}),
			new Column({})
		],
		items: {
			path: "/items",
			factory: fnArticlesTableItemFactory
		}
	});
	
	oRelatedArticlesContentTable.setModel(new JSONModel(oRelatedArticlesFacetData));
	
	var oArticlesFacet = function(setFacetContent){
		return new FacetOverview("facet-articles-location", {
			title: "Related Articles View",
			quantity: 1,
			content: oRelatedArticlesContentTable,
			heightType: Utilities.isPhone ? "Auto" : "M",
			press: function() {
				setFacetContent("relatedArticles");
			}
		});
	}

	return {
		oArticlesFacet,
		oRelatedArticlesContent
	};
});
/* eslint-disable */
/**
 * Returns number of rows to be taken from the model to display in General teaser tile,
 * depending on device type and number of segments the tile consists of.
 * @param {number=} [iSegments=1]  Number of segments the tile will take vertically in the grid (optional).
 *                  Currently expected values are 1, 2, 3, however any positive number is supported.
 *                  Default value is 1.
 * @return {number} number of rows shown in General teaser tile.
 */

sap.ui.define([
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/Link",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/VBox",
	"sap/m/LabelDesign",
	"sap/m/Table",
	"sap/m/BackgroundDesign",
	"sap/m/ListSeparators",
	"sap/m/Column",
	"sap/ui/core/TextAlign",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities"
], function(ColumnListItem, Label, Link, MessageToast, Text, VBox, LabelDesign, Table, BackgroundDesign,
	ListSeparators, Column, TextAlign, JSONModel, UnifiedThingGroup, FacetOverview, Utilities
	){
	'use strict';

	var fnGetGeneralTeaserRowThreshold = function(iSegments) {
		iSegments = iSegments || 1;
		if (Utilities.isPhone) {
			return (3 * iSegments - 1);
		} else {
			return (6 * iSegments - 3);
		}
	};
	
	var oGeneralFacetRow_CustomJB = new ColumnListItem({
		cells: [
			new Label({
				text: "Responsible:"
			}),
			new Link({
				text: "John Bradford",
				press: function(oe) {
					MessageToast.show("John Bradford's custom template.");
					return false;
				}
			})
		]
	});
	
	var oGeneralFacetData = {
		items: [
			{ label: "Locked for", text: "Actual Primary Costs" },
			{ text: "Actual Secondary Costs" },
			{ label: "Valid From", text: "01.01.2010" },
			{ type: "separator" },
			{ label: "Valid To", text: "Partially Invoiced" },
			{ label: "Created on", text: "01.01.2010" },
			{ label: "Created by", text: "John Smith", type: "link", href: "http://www.sap.com" },
			{ type: "separator" },
			{
				type: "custom",
				row: oGeneralFacetRow_CustomJB
			},
			{ label: "Profit Center", text: "Sales" },
			{ label: "Company", text: "Consultant AG UK" },
			{ label: "Controlling Area", text: "Consult AG" },
			{ label: "Group In", text: "0010 Marketing" },
			{ label: "Standard Hierarchy" },
			{ type: "separator" },
			{ label: "Sales & Marketing", type: "heading" },
			{ label: "Cost Center Type", text: "Sales & Marketing" },
			{ label: "Cost Center Type", text: "Event Marketing" }
		]
	};
	
	var oGeneralTeaserData = {
		items: oGeneralFacetData.items.slice(0, fnGetGeneralTeaserRowThreshold(Utilities.iSegmentsInGeneralTeaser))
	};
	
	var oGeneralTableTemplate_Separator = new ColumnListItem({
		cells: [new Text(), new Text()]
	});
	
	var oGeneralTableTemplate_Text = new ColumnListItem({
		cells: [
			new Label({
				text: {
					path: "label",
					formatter: function(v) {
						return v ? v + ":" : "";
					}
				}
			}),
	
			new Text({
				text: "{text}"
			})
		]
	});
	
	var oGeneralTableTemplate_Heading = new ColumnListItem({
		cells: [
			new VBox({
				items: [
					new Label({
						text: {
							path: "label",
							formatter: function(v) {
								return v || "";
							}
						},
						design: LabelDesign.Bold
					}).addStyleClass("sapSuiteUtiHeaderLabel")
				]
			}).addStyleClass("sapSuiteUtiTabHeader"),
			new Text()
		]
	});
	
	var oGeneralTableTemplate_Link = new ColumnListItem({
		cells: [
			new Label({
				text: {
					path: "label",
					formatter: function(v) {
						return v ? v + ":" : "";
					}
				}
			}),
			new Link({
				text: "{text}",
				href: "{href}",
				target: "_blank",
				press: function(oe) {
					return false;
				}
			})
		]
	});
	
	var fnGeneralTableItemFactory = function(sId, oContext) {
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
				rowTemplate = oGeneralTableTemplate_Link;
				break;
			default:
				rowTemplate = oGeneralTableTemplate_Text;
		}
		return rowTemplate.clone();
	};
	
	var oGeneralTeaserContent = new Table({
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
	}).addDelegate({
		onAfterRendering: function() {
			jQuery(".sapSuiteUtiHeaderLabel").css("max-width", 100 / 42 * 100 + "%");
			jQuery(".sapSuiteUtiTabHeader").parent().css("overflow", "visible");
		}
	});
	
	oGeneralTeaserContent.setModel(new JSONModel(oGeneralTeaserData));
	oGeneralTeaserContent.addStyleClass("sapSuiteUtiGeneral");
	oGeneralTeaserContent.addStyleClass("sapSuiteUtiGeneralInTeaser");
	
	var oGeneralFacetContent = new Table({
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
	}).addDelegate({
		onAfterRendering: function() {
			jQuery(".sapSuiteUtiHeaderLabel").css("max-width", 100 / 42 * 100 + "%");
			jQuery(".sapSuiteUtiTabHeader").parent().css("overflow", "visible");
		}
	});
	
	oGeneralFacetContent.setModel(new JSONModel(oGeneralFacetData));
	oGeneralFacetContent.addStyleClass("sapSuiteUtiGeneral");
	oGeneralFacetContent.addStyleClass("sapSuiteUtiGeneralOnPage");
	
	var oGeneralFacetGroup = new UnifiedThingGroup("general", {
		title: "General",
		description: "4711, Marketing",
		tooltip: "General facet unified thing group tooltip",
		content: oGeneralFacetContent
	});
	
	var oGeneralFacet = function(setFacetContent) {

		return new FacetOverview("facet-general", {
			title: "General",
			content: oGeneralTeaserContent,
			heightType: Utilities.isPhone ? "Auto" : "XL",
			press: function() {
				setFacetContent("overview");
			}
		});
	}

	return {
		oGeneralFacetGroup,
		oGeneralFacet
	};
});
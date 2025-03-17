/* eslint-disable */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/format/DateFormat",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/ListType",
	"sap/m/Panel",
	"sap/m/Image",
	"sap/m/Text",
	"sap/m/Page",
	"sap/ui/layout/Grid",
	"sap/m/VBox",
	"sap/m/Label",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/suite/ui/commons/ThingGroupDesign",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities",
	"sap/base/i18n/Localization",
	"sap/ui/core/Locale"
],function(Core, DateFormat, List, StandardListItem, ListType, Panel, Image, Text, Page, Grid, VBox, Label,
	UnifiedThingGroup, ThingGroupDesign, FacetOverview, Utilities, Localization, Locale
	){
	'use strict';

	var oLocale = new Locale(Localization.getLanguageTag());
	var oDateFormat = DateFormat.getDateTimeInstance({ style: "short" }, oLocale);
	var oListAttachments = new List({
		items: [
			new StandardListItem({
				title: "grass.jpg, 35KB",
				iconInset: false,
				icon: "sap-icon://attachment-photo",
				info: oDateFormat.format(new Date()),
				type: ListType.Active,
				press: function(oEvent) {
					var panel1 = new Panel({
						headerText: "Ideal",
						content: [
							new Image({
								src: "images/grass.jpg"
							}),
							new Text({
								text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt"
							})
						]
					});
	
					var oPage = new Page({
						title: "Ideal",
						showNavButton: true,
						content: [
							panel1
						]
					});
					oUTI.navigateToPage(oPage, false);
				}
			})
		]
	});
	
	oDateFormat = DateFormat.getDateTimeInstance({ style: "short" }, oLocale);
	oDateFormat.format(new Date());
	
	var oAttachmentContentFacet = new Grid("attachment-grid", {
		defaultSpan: "L6 M6 S12"
	}).addStyleClass("sapUtiFacetOverviewContentMargin");
	
	var genHBox = new VBox({
		items: [
			new Label({ text: "fioriBon.pdf" }),
			new Text({ text: oDateFormat.format(new Date()) })
		]
	});
	oAttachmentContentFacet.addContent(genHBox);
	
	if (Utilities.isPhone) {
		genHBox = new VBox({
			items: [
				new Label({ text: "SalesOrder.xlsx" }),
				new Text({ text: oDateFormat.format(new Date()) })
			]
		});
		oAttachmentContentFacet.addContent(genHBox);
	
		genHBox = new VBox({
			items: [
				new Label({ text: "SalesOrder.docx" }),
				new Text({ text: oDateFormat.format(new Date()) })
			]
		});
		oAttachmentContentFacet.addContent(genHBox);
	
		genHBox = new VBox({
			items: [
				new Label({ text: "grass.jpg" }),
				new Text({ text: oDateFormat.format(new Date()) })
			]
		});
		oAttachmentContentFacet.addContent(genHBox);
	}
	
	var oAttachmentsContent = new UnifiedThingGroup("attacments", {
		title: "Attachments",
		description: "4711, Marketing",
		content: oListAttachments,
		design: ThingGroupDesign.TopIndent
	});
	
	var oAttachmentsFacet = function(setFacetContent) {
		return new FacetOverview("facet-attachments-types", {
			title: "Attachments",
			quantity: 5,
			heightType: Utilities.isPhone ? "Auto" : "M",
			content: oAttachmentContentFacet,
			press: function() {
				setFacetContent("attachments");
			}
		});
	};

	return {
		oAttachmentsContent,
		oAttachmentsFacet
	};
});
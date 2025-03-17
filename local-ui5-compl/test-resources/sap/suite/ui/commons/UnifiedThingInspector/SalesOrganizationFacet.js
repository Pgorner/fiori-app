/* eslint-disable */

sap.ui.define([
	"sap/ui/core/Icon",
	"sap/m/VBox",
	"sap/m/HBox",
	"sap/m/Label",
	"sap/m/Text",
	"sap/m/Link",
	"sap/ui/layout/GridData",
	"sap/ui/core/Core",
	"sap/m/FlexBox",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities",
	"sap/base/i18n/Localization",
], function(Icon, VBox, HBox, Label, Text, Link, GridData, Core, FlexBox, FacetOverview, Utilities, Localization) {

	'use strict';

	var oSalesOrgIcon = new Icon({
		src: "sap-icon://globe",
		size: Utilities.isPhone ? "3rem" : "4rem"
	}).addStyleClass("sapUtiImagePaddingRight");
	
	var oSalesOrgGrid = new VBox("sales-org-grid", {
		items: [
			new HBox({
				items: [
					new Label({ text: "Distribution Channel General Brenenal" }).addStyleClass("sapUtiSalesOrgKeyLabel"),
					new Label({ text: ":" }).addStyleClass("sapUtiSalesOrgDelimiter"),
					new Text({ text: "01 - Electronic Sales" }).addStyleClass("sapUtiSalesOrgValueLabel")
				]
			}),
			new HBox({
				items: [
					new Label({ text: "Division" }).addStyleClass("sapUtiSalesOrgKeyLabel"),
					new Label({ text: ":" }).addStyleClass("sapUtiSalesOrgDelimiter"),
					new Text({ text: "01 - Industry" }).addStyleClass("sapUtiSalesOrgValueLabel")
				]
			}),
			new HBox({
				items: [
					new Label({ text: "Sales Group" }).addStyleClass("sapUtiSalesOrgKeyLabel"),
					new Label({ text: ":" }).addStyleClass("sapUtiSalesOrgDelimiter"),
					new Link({ text: "001 Sales Group 01" }).addStyleClass("sapUtiSalesOrgValueLabel")
				],
				layoutData: new GridData({ visibleOnSmall: false })
			})
		]
	}).addStyleClass("sapUtiSalesOrgFacet");
	
	if (Localization.getRTL()) {
		oSalesOrgIcon.addStyleClass("sapUtiRtl");
		oSalesOrgGrid.addStyleClass("sapUtiRtl");
	}
	
	var oSalesOrgFacetContent = new FlexBox("sales-org-content", {
		items: [
			oSalesOrgIcon,
			oSalesOrgGrid
		]
	});
	
	var oSalesOrgFacet = new FacetOverview("facet-sales-org", {
		title: "Sales Organization 0001 - Walldorf",
		content: oSalesOrgFacetContent,
		heightType: Utilities.isPhone ? "Auto" : "M"
	});

	return {
		oSalesOrgFacet
	};
});
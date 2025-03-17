/* eslint-disable */
sap.ui.define([
	"sap/ui/layout/Grid",
	"sap/m/ObjectHeader",
	"sap/m/ObjectAttribute",
	"sap/m/ObjectStatus",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/suite/ui/commons/ThingGroupDesign",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities"
],function(Grid, ObjectHeader, ObjectAttribute, ObjectStatus, UnifiedThingGroup, ThingGroupDesign, FacetOverview, Utilities) {
	'use strict';

	var oSalesQuotationGrid = new Grid("sales-quotation-grid", {
		defaultSpan: "L6 M12 S12",
		hSpacing: 1,
		vSpacing: 1,
		content: [
			new ObjectHeader({
				title: "40000019",
				titleActive: true,
				number: "70,000.00",
				numberUnit: "EUR",
				attributes: [new ObjectAttribute({ text: "Quantity Contract" })],
				firstStatus: new ObjectStatus({ text: "Being processed" }),
				secondStatus: new ObjectStatus({ text: "01/01/2013 - 05/31/2014" })
			}).addStyleClass("sapSuiteUtiSalesQuotation"),
			new ObjectHeader({
				title: "40000020",
				titleActive: true,
				number: "100,000.00",
				numberUnit: "EUR",
				attributes: [new ObjectAttribute({ text: "Matl.-rel. Value Cont" })],
				firstStatus: new ObjectStatus({ text: "Open" }),
				secondStatus: new ObjectStatus({ text: "01/15/2013 - 02/15/2014" })
			}).addStyleClass("sapSuiteUtiSalesQuotation")
		]
	}).addStyleClass("sapSuiteUtiSalesQuotationGrid");
	
	var oSalesQuotationFormGroup = new UnifiedThingGroup("sales", {
		title: "Sales Quotation",
		description: "27, Standard Order",
		content: oSalesQuotationGrid,
		design: ThingGroupDesign.TopIndent
	});
	
	var oSalesFacet = new FacetOverview("facet-sales-view", {
		title: "Sales View",
		heightType: Utilities.isPhone ? "Auto" : "S"
	});

	return {
		oSalesFacet,
		oSalesQuotationFormGroup
	};
});
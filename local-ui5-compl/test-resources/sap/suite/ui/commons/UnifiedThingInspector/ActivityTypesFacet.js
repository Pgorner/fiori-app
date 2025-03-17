/* eslint-disable */

sap.ui.define([
	"sap/ui/layout/Grid",
	"sap/m/VBox",
	"sap/m/Label",
	"sap/m/Text",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities"
], function(Grid, VBox, Label, Text, FacetOverview, Utilities) {
	'use strict';
	var oActivityTypesContent = new Grid("form-activity-types", {
		defaultSpan: "L6 M6 S6",
		content: [
			new VBox({
				items: [
					new Label({ text: "Type:" }),
					new Text({ text: "588" })
				]
			}),
			new VBox({
				items: [
					new Label({ text: "Type:" }),
					new Text({ text: "046" })
				]
			}),
			new VBox({
				items: [
					new Label({ text: "Type:" }),
					new Text({ text: "644" })
				],
				layoutData: new sap.ui.layout.GridData({ visibleOnSmall: false })
			}),
			new VBox({
				items: [
					new Label({ text: "Type:" }),
					new Text({ text: "048" })
				],
				layoutData: new sap.ui.layout.GridData({ visibleOnSmall: false })
			})
		]
	}).addStyleClass("sapUtiFacetOverviewContentMargin");
	
	var oActivityTypesFacet = function(setFacetContent) {
		new FacetOverview(
		"facet-activity-types", {
			title: "Activity Types",
			quantity: 8,
			content: oActivityTypesContent,
			heightType: Utilities.isPhone ? "Auto" : "M",
			press: function() {
				setFacetContent("quotation");
			}
		});
	}

	return {
		oActivityTypesFacet
	};
});
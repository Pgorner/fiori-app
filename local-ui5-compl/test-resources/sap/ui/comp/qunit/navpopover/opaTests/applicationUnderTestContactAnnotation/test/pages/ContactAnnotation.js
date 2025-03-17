/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationContainsPropertyEqual",
	"sap/ui/test/matchers/Ancestor",
	"test-resources/sap/ui/comp/testutils/opa/smartlink/Actions",
	"test-resources/sap/ui/comp/testutils/opa/smartlink/Assertions"
], function(
	Opa5,
	AggregationContainsPropertyEqual,
	Ancestor,
	SmartLinkActions,
	SmartLinkAssertions
) {
	"use strict";

	Opa5.createPageObjects({
		onTheContactAnnotationPage: {
			viewName: "applicationUnderTestContactAnnotation.view.Main",
			actions: {
				iCloseAllNavigationPopovers: function() {
					return SmartLinkActions.iCloseThePopover.call(this);
				}
			},
			assertions: {
				iShouldSeeTheColumnInATable: function(sColumnName) {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: function(oTable) {
							var aColumns = oTable.getColumns(),
							bExists = aColumns.some(function(oColumn) {
								return new AggregationContainsPropertyEqual({
									aggregationName : "header",
									propertyName : "text",
									propertyValue : sColumnName
								}).isMatching(oColumn);
							});
							return bExists;
						},
						errorMessage: "Column with header text '" + sColumnName + "' not found"
					});
				},
				iShouldSeeAnOpenNavigationPopover: function() {
					return SmartLinkAssertions.iShouldSeeAPopover();
				},
				contactInformationExists: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.ui.mdc.link.Panel",
						success: function(aNavigationContainers) {
							this.waitFor({
								controlType: "sap.ui.layout.form.SimpleForm",
								matchers: new Ancestor(aNavigationContainers[0], false),
								errorMessage: "No ContactInformation found in the Panel"
							});
						},
						errorMessage: "No Panel found"
					});
				}
			}
		}
	});
});

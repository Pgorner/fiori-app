sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'test-resources/sap/ui/comp/testutils/opa/TestLibrary'
], function(
	Opa5,
	opaTest,
	testLibrary
) {
	'use strict';

	// ***********************************************************************************************
	// NOTE: This test serves as example on how to use the SmartTable personalization page objects
	// ***********************************************************************************************

	Opa5.extendConfig({
		autoWait:true,
		assertions: new Opa5({
			//Note: this is just a demo assertion
			iShouldSeeVisibleColumnsInOrder: function(sColumnType, aOrderedColumnNames) {
				return this.waitFor({
					controlType: sColumnType,
					success: function(aFoundColumns) {
						Opa5.assert.equal(aOrderedColumnNames.length, aFoundColumns.length);
						aFoundColumns.forEach(function(oColumn, iIndex) {
							var sLabel = oColumn.getLabel().getText();
							Opa5.assert.equal(sLabel, aOrderedColumnNames[iIndex], "Column '" + aOrderedColumnNames[iIndex] + "' is visible on position " + (iIndex + 1));
						});
					}
				});
			}
		}),
		viewNamespace: "view."
	});

	opaTest("Start the test application", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTest/start.html"));

		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);
	});

	opaTest("Change the column personalization for the SmartTable", function(Given, When, Then) {

		When.onSmartTable.iPersonalizeColumns("applicationUnderTest---IDView--IDSmartTable", [
			"Name", "Category", "Product ID"
		]);

		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category", "Product ID"
		]);

	});

	opaTest("Remove a column via personalization", function(Given, When, Then) {

		When.onSmartTable.iPersonalizeColumns("applicationUnderTest---IDView--IDSmartTable", [
			"Category", "Product ID"
		]);

		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Category", "Product ID"
		]);

	});

	opaTest("Reset the column state via personalization", function(Given, When, Then) {
		When.onSmartTable.iResetThePersonalization("applicationUnderTest---IDView--IDSmartTable");

		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);

	});

	opaTest("Personalize the group state", function(Given, When, Then) {

		When.onSmartTable.iPersonalizeGroup("applicationUnderTest---IDView--IDSmartTable", [
			{
				key: "Date"
			},
			{
				key: "Name",
				showFieldAsColumn: false
			},
			{
				key: "Product ID",
				showFieldAsColumn: true
			}
		]);

	});

	opaTest("Personalize the sort state", function(Given, When, Then) {

		When.onSmartTable.iPersonalizeSort("applicationUnderTest---IDView--IDSmartTable", [
			{
				key: "Date"
			},
			{
				key: "Name",
				descending: false
			},
			{
				key: "Product ID",
				descending: true
			}
		]);

	});

	opaTest("Personalize the filter state", function(Given, When, Then) {

		When.onSmartTable.iPersonalizeFilter("applicationUnderTest---IDView--IDSmartTable", [
			{
				key: "Name",
				values: [
					"test"
				],
				inputControl: "FilterPanel-filterItemControlA_-applicationUnderTest---IDView--IDSmartTable-Name"
			},
			{
				key: "Category",
				values: ["<empty>"],
				inputControl: "FilterPanel-filterItemControlA_-applicationUnderTest---IDView--IDSmartTable-Category"
			},
			{
				key: "Date",
				operator: "between",
				values: [
					"01.01.2021...01.06.2021"
				],
				inputControl: "FilterPanel-filterItemControlA_-applicationUnderTest---IDView--IDSmartTable-Date"
			}
		]);

		Then.iTeardownMyAppFrame();

	});
});

sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'test-resources/sap/ui/comp/testutils/opa/TestLibrary'
], function(
	Opa5,
	opaTest,
	testLibrary
) {
    "use strict";

	// ***********************************************************************************************
	// NOTE: This test serves as example on how to use the SmartChart personalization page objects
	// ***********************************************************************************************

	Opa5.extendConfig({
		autoWait:true,
		assertions: new Opa5({
			//Note: this is just a demo assertion
			iShouldSeeVisibleDimensionsInOrder: function(aOrderedDimensionNames) {
				return this.waitFor({
					controlType: "sap.chart.Chart",
					success: function(aInnerChart) {
						Opa5.assert.equal(aInnerChart.length, 1, "One sap.chart.Chart control found");
						Opa5.assert.equal(aInnerChart[0].getVisibleDimensions().length, aOrderedDimensionNames.length, "Chart contains " + aOrderedDimensionNames.length + " visible dimensions");
						aInnerChart[0].getVisibleDimensions().forEach(function(sDimensionName, iIndex) {
							Opa5.assert.equal(sDimensionName, aOrderedDimensionNames[iIndex], "Dimension '" + sDimensionName + "' is visible on position " + (iIndex + 1));
						});
					}
				});
			},
			//Note: this is just a demo assertion
			iShouldSeeVisibleMeasuresInOrder: function(aOrderedMeasureNames) {
				return this.waitFor({
					controlType: "sap.chart.Chart",
					success: function(aInnerChart) {
						Opa5.assert.equal(aInnerChart.length, 1, "One sap.chart.Chart control found");
						Opa5.assert.equal(aInnerChart[0].getVisibleMeasures().length, aOrderedMeasureNames.length, "Chart contains " + aOrderedMeasureNames.length + " visible measures");
						aInnerChart[0].getVisibleMeasures().forEach(function(sMeasureName, iIndex) {
							Opa5.assert.equal(sMeasureName, aOrderedMeasureNames[iIndex], "Measure '" + sMeasureName + "' is visible on position " + (iIndex + 1));
						});
					}
				});
			}
		}),
		viewNamespace: "view."
	});

    opaTest("Start the SmartChart test application", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestDimeasure/start.html"));

		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
	});

	opaTest("Personalize dimensions and measures", function(Given, When, Then) {
		When.onSmartChart.iPersonalizeChart("applicationUnderTestDimeasure---IDView--IDSmartChart", "Bar Chart", [
			{
				key: "Name",
				role: "Category",
				kind: "Dimension"
			},
			{
				key: "Date",
				role: "Series",
				kind: "Dimension"
			},
			{
				key: "Price",
				role: "Axis 1",
				kind: "Measure"
			}
		]);

	});

	opaTest("Reset the item personalization", function(Given, When, Then) {
		When.onSmartChart.iResetThePersonalization("applicationUnderTestDimeasure---IDView--IDSmartChart");

	});

	opaTest("Personalize the sort state", function(Given, When, Then) {

		When.onSmartChart.iPersonalizeSort("applicationUnderTestDimeasure---IDView--IDSmartChart", [
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

//		When.onTheMDCTable.iPersonalizeFilter(sTableID, [{key : "Language", values: ["DE"], inputControl: "listreport---books--booksTable--filter--language_code"}]);

	opaTest("Personalize the filter state", function(Given, When, Then) {

		When.onSmartChart.iPersonalizeFilter("applicationUnderTestDimeasure---IDView--IDSmartChart", [
			{
				key: "Name",
				values: [
					"*test*", "=test"
				],
				inputControl: "FilterPanel-filterItemControlA_-applicationUnderTestDimeasure---IDView--IDSmartChart-Name"
			},
			{
				key: "Category",
				values: [
					"<empty>"
				],
				inputControl: "FilterPanel-filterItemControlA_-applicationUnderTestDimeasure---IDView--IDSmartChart-Category"
			},
			{
				key: "Date",
				values: [
					"01.01.2021...01.06.2021"
				],
				inputControl: "FilterPanel-filterItemControlA_-applicationUnderTestDimeasure---IDView--IDSmartChart-Date"
			}
		]);

		Then.iTeardownMyAppFrame();

	});
});

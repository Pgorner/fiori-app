sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'test-resources/sap/ui/comp/testutils/opa/TestLibrary'
], function(
	Opa5,
	opaTest
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

	opaTest("Personalize the filter state", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/appUnderTestFilteringAnalyticalParam/start.html"));

		When.onSmartTable.iPersonalizeFilter("appUnderTestFilteringAnalyticalParam---IDView--IDSmartTable", [
			{
				key: "STRING_INOUT",
				values: [
					"1"
				],
				inputControl: "FilterPanel-filterItemControlA_-appUnderTestFilteringAnalyticalParam---IDView--IDSmartTable-STRING_INOUTSTRING_INOUT"
			},
			{
				key: "STRING",
				values: ["=2"],
				inputControl: "FilterPanel-filterItemControlA_-appUnderTestFilteringAnalyticalParam---IDView--IDSmartTable-STRINGSTRING"
			}
		]);

		Then.iTeardownMyAppFrame();

	});
});

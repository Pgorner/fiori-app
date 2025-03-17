/*  Implemented Scenarios :
	 *  Scenario 46 - Analysis Path in Empty State to Open operation by choosing first analysis step 
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"./tViewSettingsIconPO"
], function(
	Opa5,
	opaTest
) {
	Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Sorting of table representation data according to settings in View Settings Dialog", function(Given, When, Then) {
		Given.viewSettingsIconPO.iPrepareForScenario();
		When.viewSettingsIconPO.iOpenAnExistingSavedPath();
		When.viewSettingsIconPO.iClickToolbarMenu("Table Representation");
		Then.viewSettingsIconPO.iShouldSeeTheTableRepresentation();
		When.viewSettingsIconPO.iStoreFirstRecordInTable();
		When.viewSettingsIconPO.iClickToolbarMenu("View Settings Icon");
		Then.viewSettingsIconPO.iShouldSeeViewSettingsDialog();
		When.viewSettingsIconPO.iSelectSortOrderAndDimension('Ascending', 'Customer Name');
		When.viewSettingsIconPO.iClickonOk();
		Then.viewSettingsIconPO.iShouldSeeTheChartDataSorted();
		Then.viewSettingsIconPO.iCleanUpExistingPath();
	});
});

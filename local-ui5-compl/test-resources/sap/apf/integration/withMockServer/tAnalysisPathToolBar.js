/*  Implemented Scenarios :
	 *  Scenario 46 - Analysis Path in Empty State to Open operation by choosing first analysis step and
	 *  Scenario 47 - Analysis Path in Empty State to Open operation by choosing subsequent analysis step
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"./tAnalysisPathToolBarPO"
], function(
	Opa5, opaTest
) {
	Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Opening of different analysis paths from path gallery", function(Given, When, Then) {
		Given.analysisPathToolBarPO.iPrepareForScenario();
		When.analysisPathToolBarPO.iClickonObjectHeader();
		When.analysisPathToolBarPO.iClickOnToolbarItem(1);
		When.analysisPathToolBarPO.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables over Time By Customer");
		When.analysisPathToolBarPO.iSelectAnItemFromSelectDialog("title", "Revenue by Customer");
		Then.analysisPathToolBarPO.iAssertAnalysisPathWithSteps(2);
		Then.analysisPathToolBarPO.iCleanUpExistingPath();
		When.analysisPathToolBarPO.iClickonObjectHeader();
		When.analysisPathToolBarPO.iClickOnToolbarItem(1);
		When.analysisPathToolBarPO.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables  By Customer");
		When.analysisPathToolBarPO.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables By Customer");
		Then.analysisPathToolBarPO.iAssertAnalysisPathWithSteps(3);
		Then.analysisPathToolBarPO.iCleanUpExistingPath();
	});
});

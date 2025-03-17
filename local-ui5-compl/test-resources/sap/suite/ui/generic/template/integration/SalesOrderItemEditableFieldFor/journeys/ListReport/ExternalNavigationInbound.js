sap.ui.define(["sap/ui/test/opaQunit"], function(opaTest) {
	"use strict";

	QUnit.module("EditableFieldFor - LR");

	var sValue = "400000001";

	[{sFilterField: "SalesOrderForEdit", sManifest: "", bExpectedHeaderExpanded: true},
	 {sFilterField: "SalesOrder", sManifest: "manifestOriginalFieldInSFB", bExpectedHeaderExpanded: true},
	 {sFilterField: "SalesOrderForEdit", sManifest: "manifestForEditFieldInSemanticKey", bExpectedHeaderExpanded: true},
	 {sFilterField: "SalesOrder", sManifest: "manifestOrigFieldInSFBandForEditFieldInSemanticKey"}].forEach(function(oAppConfig) {

		["SalesOrderForEdit", "SalesOrder"].forEach(function (sParameter) {
			// Convert to computed property of ES6 feature once we don't support IE11
			var sAppName = "SalesOrderItems-EditableFieldFor#SalesOrderItems-EditableFieldFor?" + sParameter + "=" + sValue;
			opaTest("Manifest: " + oAppConfig.sManifest + "Parameter: " + sParameter, function (Given, When, Then) {

				Given.iStartMyAppInSandbox(sAppName, oAppConfig.sManifest);
				When.onTheGenericListReport
					.iSetTheHeaderExpanded(oAppConfig.bExpectedHeaderExpanded);
				Then.onTheListReportPage
					.theFilterIsFilled(oAppConfig.sFilterField, sValue);

				Then.iTeardownMyApp();

			});
		});
	 });
});

sap.ui.define(["sap/ui/test/opaQunit"], function(opaTest) {
	"use strict";

	QUnit.module("Table Selection Mode");

	[{sManifest: "manifestDFFARequiresContextTrue", sMode: "SingleSelectLeft"},
	 {sManifest: "manifestIBNRequiresContextTrue", sMode: "MultiSelect"},
	 {sManifest: "manifestDeleteRestrictionsDeletableFalse", sMode: "None"},
	 {sManifest: "manifestDeleteRestrictionsDeletableTrue", sMode: "MultiSelect"},
	 {sManifest: "manifestExtActionRequiresSelectionTrue", sMode: "SingleSelectLeft"},
	 {sManifest: "manifestExtActionRequiresSelectionFalse", sMode: "None"},
	 {sManifest: "manifestExtGlobalActionRequiresSelectionTrue", sMode: "MultiSelect"},
	 {sManifest: "manifestExtGlobalActionRequiresSelectionFalse", sMode: "None"}].forEach(function(oAppConfig) {
			opaTest("Manifest: " + oAppConfig.sManifest, function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttaproducts", oAppConfig.sManifest);
				When.onTheListReportPage
					.iLookAtTheScreen();
				Then.onTheListReportPage
					.iWaitForThePageToLoad("ListReport", "STTA_C_MP_Product")
					.and
					.iCheckControlPropertiesByControlType("sap.m.Table", {"mode": oAppConfig.sMode});
				Then.iTeardownMyApp();
			});
	 });
});

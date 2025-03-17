sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Easy Filter and Error Explanation");

		opaTest("Launch the app and check teh Segmented button to switch between the classic and easy filter", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#STTASOWD20-STTASOWD20");
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(20);
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::FilterSwitchButton", { "visible": true, "enabled": true, "selectedKey": "classic" })
				.and
				.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "enabled": true, "icon": "sap-icon://filter-fields" })
				.and
				.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "enabled": true, "icon": "sap-icon://ai" });
		});

		opaTest("Switch to easy filter and check the UI", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheSegmentedButton("easyFilter");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::FilterSwitchButton", { "visible": true, "enabled": true, "selectedKey": "easyFilter" })
				.and
				.iCheckControlPropertiesByControlType("sap.m.Input", { "visible": true, "placeholder": "Enter your query using natural language to filter the list" })
				.and
				.iCheckControlPropertiesByControlType("sap.m.Button", { "visible": true, "enabled": true, "icon": "sap-icon://ai" });
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(20);
		});

		opaTest("Switch to classic filter and check the UI", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheSegmentedButton("classic");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::FilterSwitchButton", { "visible": true, "enabled": true, "selectedKey": "classic" })
				.and
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartfilterbar.SmartFilterBar", { "visible": true, "entitySet": "C_STTA_SalesOrder_WD_20" });
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(20);
		});

		opaTest("Navigate to Draft object page and check the error explanation", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrder", Value: "500000001" });
			When.onTheObjectPage
				.iEnterValueInField("ABCDEF", "com.sap.vocabularies.UI.v1.FieldGroup::Amount::CurrencyCode::Field-input")
				.and
				.iToggleMessagePopoverDialog();
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "enabled": true, "text": "Enter a text with a maximum of 5 characters and spaces" })
				.and
				.iCheckControlPropertiesByControlType("sap.m.Link", { "visible": true, "enabled": true, "icon": "sap-icon://ai", "text": "Generate Explanation" });
			Then.iTeardownMyApp();
		});
	}
);

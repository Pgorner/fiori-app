sap.ui.define([
	"sap/ui/test/opaQunit"],

	function (opaTest) {
		"use strict";

		QUnit.module("OPA for history of recently entered values");

		opaTest("Starting the app and Check the scenarios when there is no historySettings for SmartMultiInput", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("Demo-FilterSettings#Demo-FilterSettings");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			When.onTheListReportPage
				.iEnterValueInField("Gedöns", "listReportFilter-filterItemControl_BASIC-MultiBasicHistauto")
				.and
				.iEnterValueInField("", "listReportFilter-filterItemControl_BASIC-MultiBasicHistauto");
			Then.onTheListReportPage
				.iShouldSeeHistoryPopupWithTitle("listReportFilter-filterItemControl_BASIC-MultiBasicHistauto-popup-table", "Recently Used", true)
				.and
				.iShouldSeeHistoryPopupWithValueInTable("listReportFilter-filterItemControl_BASIC-MultiBasicHistauto-popup-table", "Gedöns");
		});

		opaTest("Check the scenarios when historySettings is true SmartMultiInput", function (Given, When, Then) {
			When.onTheListReportPage
				.iEnterValueInField("Gedöns", "listReportFilter-filterItemControl_BASIC-MultiBasicHisttrue")
				.and
				.iEnterValueInField("", "listReportFilter-filterItemControl_BASIC-MultiBasicHisttrue");
			Then.onTheListReportPage
				.iCheckTheHistoryEnabledPropertyForTheFieldInTheSmartFilterBar("MultiBasicHisttrue", true)
				.and
				.iShouldSeeHistoryPopupWithTitle("listReportFilter-filterItemControl_BASIC-MultiBasicHisttrue-popup-table", "Recently Used", true)
				.and
				.iShouldSeeHistoryPopupWithValueInTable("listReportFilter-filterItemControl_BASIC-MultiBasicHisttrue-popup-table", "Gedöns");
		});

		opaTest("Check the scenarios when historySettings is false for SmartMultiInput", function (Given, When, Then) {
			When.onTheListReportPage
				.iEnterValueInField("Gedöns", "listReportFilter-filterItemControl_BASIC-MultiBasicHistfalse")
				.and
				.iEnterValueInField("", "listReportFilter-filterItemControl_BASIC-MultiBasicHistfalse");
			Then.onTheGenericListReport
				.iShouldNotSeeTheControlWithId("listReportFilter-filterItemControl_BASIC-MultiBasicHistfalse-popup-table");
			Then.onTheListReportPage
				.iCheckTheHistoryEnabledPropertyForTheFieldInTheSmartFilterBar("MultiBasicHistfalse", false);
		});

		opaTest("Check the scenarios when there is no historySettings for MultiComboBox", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheMultiComboBoxArrow("ComboBasicHistauto")
				.and
				.iSelectItemsFromMultiComboBox("ComboBasicHistauto", "Geraffel");
			When.onTheListReportPage
				.iClickTheControlWithId("listReportFilter-filterItemControl_BASIC-ComboBasicHistauto");
			Then.onTheListReportPage	
				.iShouldSeeHistoryPopupWithTitle("listReportFilter-filterItemControl_BASIC-ComboBasicHistauto-popup-list", "Recently Used", false);
		});

		opaTest("Check the scenarios when historySettings is true MultiComboBox", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheMultiComboBoxArrow("ComboBasicHisttrue")
				.and
				.iSelectItemsFromMultiComboBox("ComboBasicHisttrue", "Geraffel");
			When.onTheListReportPage
				.iClickTheControlWithId("listReportFilter-filterItemControl_BASIC-ComboBasicHisttrue");
			Then.onTheListReportPage
				.iCheckTheHistoryEnabledPropertyForTheFieldInTheSmartFilterBar("ComboBasicHisttrue", true)
				.and
				.iShouldSeeHistoryPopupWithTitle("listReportFilter-filterItemControl_BASIC-ComboBasicHisttrue-popup-list", "Recently Used", true)
				.and
				.iShouldSeeHistoryPopupWithValueInList("listReportFilter-filterItemControl_BASIC-ComboBasicHisttrue-popup-list", "Geraffel");
		});

		opaTest("Check the scenarios when historySettings is false for MultiComboBox", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheMultiComboBoxArrow("ComboBasicHistfalse")
				.and
				.iSelectItemsFromMultiComboBox("ComboBasicHistfalse", "Geraffel");
			When.onTheListReportPage
				.iClickTheControlWithId("listReportFilter-filterItemControl_BASIC-ComboBasicHistfalse");
			Then.onTheListReportPage	
				.iShouldSeeHistoryPopupWithTitle("listReportFilter-filterItemControl_BASIC-ComboBasicHistfalse-popup-list", "Recently Used", false);
			Then.onTheListReportPage
				.iCheckTheHistoryEnabledPropertyForTheFieldInTheSmartFilterBar("ComboBasicHistfalse", false);
			Then.iTeardownMyApp();
		});
	}
);
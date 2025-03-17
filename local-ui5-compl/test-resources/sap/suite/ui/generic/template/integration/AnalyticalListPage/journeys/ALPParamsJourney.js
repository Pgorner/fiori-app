/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("AnalyticalListPage - ALPWithParamsJourney");

	opaTest("Check if the Analytical List Page with Params App without setting display currency in url", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("alpWithParams");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "ActualCosts" });
		Then.onTheMainPage.iCheckKpiIndicator(0, "Neutral");
	});

	opaTest("Check overlay is displayed for VF configured for a different entity set, in which the main entity set is having mandatory filters/parameters which is not set", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheFilterBar.iCheckOverlay(true, "REQUIRED_VH_FIELDS_OVERLAY_MESSAGE", 0);
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
	});

	opaTest("Check for Pin Button", function (Given, when, Then) {
		Then.onTheFilterBar.iCheckControlPropertiesByControlType("sap.f.DynamicPageHeader", { "visible": true, "pinnable": true });
	});
	opaTest("Check for Authorization error scenario in kpi tag", function (Given, When, Then) {
		Then.onTheMainPage.iCheckForHiddenKPI("ActualCosts3");
	});

	opaTest("Check for technical error condition in KPI", function (Given, When, Then) {
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "ActualCosts" });
		Then.onTheMainPage.iCheckKpiErrorText("KPI_GENERIC_ERROR_MESSAGE");
		Then.onTheMainPage.iCheckKpiIndicator(0, "Neutral");
		When.onTheMainPage.iCloseTheKPIPopover();
	});

	opaTest("Check for mandatory fields missing info message for KPI entityset different than main entityset with matching fields", function (Given, When, Then) {
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "NetAmount4" });
		Then.onTheMainPage.iCheckKpiErrorText("KPI_INFO_FOR_MISSING_MANDATE_FILTPAR");
		Then.onTheMainPage.iCheckKpiIndicator(4, "Neutral");
		When.onTheMainPage.iCloseTheKPIPopover();
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "_Parameter.P_DisplayCurrency", Value: "USD"});
	});
	opaTest("Check if values are applied in visual filter via onBeforeRebindVisualFilterExtension", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckVFChartSelected("donut", "USD", "$Parameter.P_DisplayCurrency");
		Then.onTheFilterBar.iCheckValuesFromExtensionAreApplied("CustomerCountry", "Donut", 1);
	});
	opaTest("Check if InvisibleText is present on visual filter on the bar", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(0, "visualFilterBarInvisibleTextP_DisplayCurrency", "required", "");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(1, "visualFilterBarInvisibleTextCustomerName", "", "");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(2, "visualFilterBarInvisibleTextCustomer", "", "REQUIRED_VH_FIELDS_OVERLAY_MESSAGE");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(3, "visualFilterBarInvisibleTextCustomerCountry", "", "");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(4, "visualFilterBarInvisibleTextCustomerCountryName", "", "M_VISUAL_FILTERS_MULTIPLE_CURRENCY", "Customer Country Name");
	});
	opaTest("Check if InvisibleText is present on visual filter on the dialog", function (Given, When, Then) {
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCustomerName", "")
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCustomer", "");
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCustomerCountry", "");
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCustomerCountryName", "");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	opaTest("Check if multiple action buttons are rendered in a column", function (Given, When, Then) {
		Then.onTheTable.iSeeMultipleActionsInAColumn();
	});

	opaTest("Check if image control is rendered in a column", function (Given, When, Then) {
		Then.onTheTable.iCheckControlTypeInColumn("sap.m.Avatar");
	});

	opaTest("Check if chart control is rendered in a column", function (Given, When, Then) {
		Then.onTheTable.iCheckControlTypeInColumn("sap.ui.comp.smartmicrochart.SmartMicroChart");
	});

	opaTest("Check for no data condition in KPI", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("BK"); //no data filterable scenario
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "NetAmount2" });
		Then.onTheMainPage.iCheckKpiErrorText("KPI_NO_DATA");
		Then.onTheMainPage.iCheckKpiErrorType(4, "Warning");
		When.onTheMainPage.iCloseTheKPIPopover();
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check default values are applied from annotation", function (Given, When, Then) {
		Then.onTheFilterBar.isParameterApplied("$Parameter.P_DisplayCurrency", "USD");
	});

	opaTest("Check VF from different entity set has mandatory filters/parameters set from SV", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iCheckVFMandatoryFilter("CustomerName", "SalesOrder", "Bar", "500000000", false);
	});

	opaTest("Check VF from different entity set has mandatory filters/parameters passed from IN param", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "SalesOrder", Value: "500000012"});
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iCheckVFMandatoryFilter("CustomerName", "SalesOrder", "Bar", "500000012", false);
	});

	opaTest("Check overlay is displayed for VF having mandatory filters/parameters not set ", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckOverlay(true, "REQUIRED_VH_FIELDS_OVERLAY_MESSAGE", 1);
		Then.onTheMainPage.iCheckVisualFilterVHButtonDisabled(false, "Quantity by Customer");
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheMainPage.iCheckVisualFilterVHButtonDisabled(true, "Quantity by Customer");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check Selection Variant in VF", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "DisplayCurrency", Value: "USD"});
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckVFWithSelectionVariant("Donut", "AR", "CustomerCountry");
		Then.onTheFilterBar.iCheckVFWithSelectionVariant("Bar", "Argentina", "CustomerCountryName");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("BR");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckVFWithSelectionVariant("Donut", "AR", "CustomerCountry");
		Then.onTheFilterBar.iCheckVFWithSelectionVariant("Bar", "Brazil", "CustomerCountryName");
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Customer Country");
		When.onTheFilterBar.iClickTheValueHelp("sap-icon://value-help", "CustomerCountry");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["=BR"]);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check for mandatory fields missing error for KPI entityset different than main entityset with no matching fields", function (Given, When, Then) {
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "NetAmount6" });
		Then.onTheMainPage.iCheckKpiErrorText("REQUIRED_VH_FIELDS_OVERLAY_MESSAGE");
		When.onTheMainPage.iCloseTheKPIPopover();
	});

	opaTest("Check  KPI entityset different than main entityset is showing value with CustomerCountry change", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("BR");
		When.onTheFilterBar.iClickTheButtonOnTheDialog("OK");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTag", { "qualifier": "NetAmount4" });
		Then.onTheMainPage.iCheckKpiValue("NetAmount4", "2.9M");
		Then.onTheMainPage.iCheckKpiScaleFactor("NetAmount2", "M");
		Then.onTheMainPage.iCheckNumberofFractionalDigit("NetAmount2", 1);
	});

	opaTest("Check if the table is Responsive Table", function (Given, When, Then) {
		Then.onTheTable.iCheckControlPropertiesByControlType("sap.m.Table", { "visible": true });
	});

	opaTest("Check if the Analytical List Page With Params App have Interactive Charts", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "DisplayCurrency", Value: "USD"});
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckPresenceOfChart();
	});

	opaTest("Check unit field Text from ValueHelp", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckChartTitleInTheBar("Net Amount by Display Currency | M USD (United States Dollar)");
		Then.onTheFilterBar.iCheckChartTitleInTheBar("Net Amount by Customer Country | K USD (United States Dollar)");
		When.onTheFilterBar.iClickTheFilterButtonInOverflowToolbar();
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Net Amount by Display Currency | M USD (United States Dollar)");
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Net Amount by Customer Country | K USD (United States Dollar)");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
	});

	opaTest("Check for selection column", function (Given, when, Then) {
		Then.onTheMainPage.iCheckTableProperties({ "visible": true, "mode": "MultiSelect", "multiSelectMode": "ClearAll" });
		Then.iTeardownMyApp();
	});

	opaTest("Open the app and apply some filter and save the variant", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("alpWithParams");
		Then.onTheMainPage.iCheckTheSelectedVariantIsModified(false);
		When.onTheGenericAnalyticalListPage.iSetTheFilter({Field: "_Parameter.P_DisplayCurrency", Value: "USD"});
		Then.onTheMainPage.iCheckTheSelectedVariantIsModified(true);
		When.onTheMainPage.iClickOnVariantById("PageVariant-vm");
		When.onTheGenericAnalyticalListPage.iClickTheButtonHavingLabel("Save As");
		When.onTheMainPage.iEnterValueInField("Test", "template::PageVariant-vm-name");
		When.onTheGenericAnalyticalListPage.iClickTheButtonHavingLabel("Save");
		Then.onTheMainPage
			.theCorrectSmartVariantIsSelected("Test", "PageVariant-vm")
			.and
			.iCheckTheSelectedVariantIsModified(false);
	});

	opaTest("Switch between Standard and custom variant and check there is no dirty indicator for the variant", function (Given, When, Then) {
		When.onTheMainPage
			.iClickOnVariantById("PageVariant-vm")
			.and
			.iSelectVariantByName("Standard", "PageVariant-vm");
		Then.onTheMainPage.iCheckTheSelectedVariantIsModified(false);
		When.onTheMainPage
			.iClickOnVariantById("PageVariant-vm")
			.and
			.iSelectVariantByName("Test", "PageVariant-vm");
		Then.onTheMainPage.iCheckTheSelectedVariantIsModified(false);
	});

	opaTest("Smart Variant - Delete created variant", function (Given, When, Then) {
		When.onTheMainPage
			.iClickOnVariantById("PageVariant-vm");
		When.onTheGenericAnalyticalListPage
			.iClickTheButtonHavingLabel("Manage")
			.and
			.iClickTheButtonWithIcon("sap-icon://decline")
			.and
			.iClickTheButtonHavingLabel("Save");
		Then.onTheMainPage
			.theCorrectSmartVariantIsSelected("Standard", "PageVariant-vm");
	});

	opaTest("Check Mandatory Field Overlay message", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("OK");
		Then.onTheFilterBar.iCheckOverlay(true, "M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_SINGLEVF", 6, "Display Currency");
		Then.iTeardownMyApp();
	});

	opaTest("Check pin button state is stored in app state", function (Given, When, Then) {
		Given.iStartMyAppInSandbox("alpwp-display#alpwp-display?DisplayCurrency=USD");
		Then.onTheFilterBar.iCheckControlPropertiesByControlType("sap.f.DynamicPageHeader", { "visible": true, "pinnable": true });
		When.onTheFilterBar.iClickTheButtonWithIcon("sap-icon://pushpin-off");
		Then.onTheFilterBar.iCheckSetPressPinButton(true);
		When.onTheMainPage.iClickShareIcon();
		When.onTheMainPage.iClickMenuItem("Save as Tile");
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheDialogWithTitle("Save as Tile");
		When.onTheMainPage.iEnterValueInField("ALP pinHeader iAppstate Demo", "bookmarkTitleInput");
		When.onTheMainPage.iClickOnPagesMultiInputOnSaveAsTileDialog();
		When.onTheMainPage.iClickOnCheckboxWithText("", "SelectedNodesComboBox-ValueHelpDialog--ContentNodesTree-1-selectMulti");
		When.onTheMainPage.iClickTheButtonOnTheDialog("Apply");
		When.onTheFilterBar.iClickTheButtonOnTheDialog("Save");
		When.onTheGenericAnalyticalListPage.iClickOnItemFromTheShellNavigationMenu("Home");
		When.onTheMainPage.iClickTheControlByControlType("sap.m.GenericTile", { "visible": true, "header": "ALP pinHeader iAppstate Demo" });
		Then.onTheFilterBar.iCheckSetPressPinButton(true);
		Then.iTeardownMyApp();
	});
});

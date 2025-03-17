/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/library",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function(
	Library,
	Opa5,
	opaTest,
	DateFormat,
	coreLibrary
) {
	"use strict";

	var oCoreRB = Library.getResourceBundleFor("sap.ui.core"),
		ValueState = coreLibrary.ValueState,
		sComponent = "__component0---types--",
		sOutputAreaId = sComponent + "outputAreaChangedData";

	var fnGetDateTime = function (iYear, iMonth, iDate, iHour, iMinute, iSecond) {
		var oDate = new Date(iYear, iMonth, iDate, iHour, iMinute, iSecond);
		iMonth = iMonth + 1;
		var sMonth = iMonth < 10 ? "0" + iMonth : "" + iMonth;
		var sDate = oDate.getUTCDate() < 10 ? "0" + oDate.getUTCDate() : "" + oDate.getUTCDate();
		var sHours = oDate.getUTCHours() < 10 ? "0" + oDate.getUTCHours() : "" + oDate.getUTCHours();
		var sMinutes = oDate.getUTCMinutes() < 10 ? "0" + oDate.getUTCMinutes() : "" + oDate.getUTCMinutes();
		var sSeconds = oDate.getUTCSeconds() < 10 ? "0" + oDate.getUTCSeconds() : "" + oDate.getUTCSeconds();
		var sDtOffset = "" + oDate.getUTCFullYear() + "-" + sMonth + "-" + sDate + "T" +
			sHours + ":" + sMinutes + ":" + sSeconds + ".000Z";
		return sDtOffset;
	};

	var fnGetDateInTimeZone = function (iYear, iMonth, iDate) {
		var oDate = new Date(Date.UTC(iYear, (iMonth - 1), iDate, 0, 0, 0));
		var oFormat = DateFormat.getDateInstance({pattern: "yyyyMMdd"});
		return oFormat.format(oDate);
	};

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		timeout: 60,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html#/pages/types"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	], function() {

		opaTest("When SmartFields with date values get enabled/disabled, their values should stay consistent", function (Given, When, Then) {
			//Arrangement
			var sStringDateValue = "Dec 15, 2000",
				sDateTimeValue = "Oct 24, 2014, 2:20:00 PM", // sap.ui.model.odata.type.DateTimeBase.prototype.formatValue(new Date("Oct 24, 2014, 2:20:00 PM"), "string")
				sDateTimeOffsetValue = "Oct 24, 2014, 2:20:00 PM", // sap.ui.model.odata.type.DateTimeOffset.prototype.formatValue(new Date("Oct 24, 2014, 2:20:00 PM"), "string")
				sDateValue = "Oct 24, 2014";

			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "date", sDateValue);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "dateTime", sDateTimeValue);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "dtOffset", sDateTimeOffsetValue);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "stringDate", sStringDateValue);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "date", sDateValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dateTime", sDateTimeValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dtOffset", sDateTimeOffsetValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "stringDate", sStringDateValue);

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "date", sDateValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dateTime", sDateTimeValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "dtOffset", sDateTimeOffsetValue);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "stringDate", sStringDateValue);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I start the 'SmartField_Types' app, the SmartFields should have the right values displayed", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "date", "Oct 24, 2014");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "time", "11:33:55 AM");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndDateTimeValue(sComponent + "dtOffset", new Date(1414149600000).toString());
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "stringDate", "Dec 15, 2000");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "string", "SB");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "stringUpperCase", "aa");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "decimal", "45,301.23");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "double", "127,890.134");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "int16", "35");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "byte", "122");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sComponent + "bool", true);
		});

		opaTest("When I change value of SmartField the data should change", function (Given, When, Then) {
			//for Test create Date string time zone independent:
			var sDtOffset = fnGetDateTime(2019, 4, 22, 7, 1, 30),
			sDateOffset = fnGetDateInTimeZone(2019, 5, 22);

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "date", "May 21, 2019");
			When.onTheSmartField.iDisableSmartFieldTimePickerMask(sComponent + "time");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "time", "101010PM"); // no : because of edit mask
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "dtOffset", "May 22, 2019, 7:01:30 AM");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "stringDate", "May 22, 2019");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "string", "Hi");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "stringUpperCase", "HELLO");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "decimal", "1234.56");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "double", "1234.56");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "int16", "1234");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "byte", "123");
			When.onTheSmartField.iUncheckSmartFieldItem(sComponent + "bool");

			// Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "DATE", "2019-05-21T00:00:00.000Z");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId,"TIME", {ms: 79810000, __edmType: "Edm.Time"});
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "DTOFFSET", sDtOffset);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "STRINGDATE", sDateOffset);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId, "STRING", "Hi");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId,"STRINGUPPERCASE", "HELLO");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId,"DECIMAL", "1234.56");
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId,"DOUBLE", 1234.56);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId,"INT16", 1234);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId,"BYTE", 123);
			Then.onTheSmartFieldTypesPage.iShouldSeeData(sOutputAreaId,"BOOL", false);

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When SmartFields value is not valid should has error state", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "date", "May 32, 2019");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "dtOffset", "May 32, 2019, 7:01:30 AM");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "stringDate", "May May");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "string", "Hello Hello Hello");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "decimal", "1234.56a");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "double", "1234.56a");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "int16", "1234a");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "byte", "123a");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "date", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "dtOffset", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "stringDate", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "string", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "decimal", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "double", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "int16", ValueState.Error);
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sComponent + "byte", ValueState.Error);

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When SmartFields has an empty value and is in a Form, it should be indicated in a meaningful way", function (Given, When, Then) {

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithEmptyIndicator(sComponent + "CurrencyCodeFixedValues");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithEmptyIndicator(sComponent + "Currency");

			//Action
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", true);
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "CurrencyCodeFixedValues", "European Euro");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "Currency", "110");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "Currency-sfEdit", "EUR");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator(sComponent + "CurrencyCodeFixedValues");
			Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator(sComponent + "Currency");

			//Assertion
			When.onTheSmartFieldTypesPage.iToggleFormEditMode(sComponent + "form", false);
			Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator(sComponent + "CurrencyCodeFixedValues");
			Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator(sComponent + "Currency");

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When SmartFields UOM field edit mode has been toggled the CSS should be as expected", function (Given, When, Then) {

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeUomFieldWithShrinkFactorOf(sComponent + "Currency", 1);

			//Action
			When.onTheSmartField.iToggleUomEditMode(sComponent + "Currency", false);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeUomFieldWithShrinkFactorOf(sComponent + "Currency", 0);

			//Action
			When.onTheSmartField.iToggleUomEditMode(sComponent + "Currency", true);

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeUomFieldWithShrinkFactorOf(sComponent + "Currency", 1);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When SmartFields value is not valid should has error text", function (Given, When, Then) {

			var sCurrentYear = new Date().getFullYear();

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "date", "May 32, 2019");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "dtOffset", "May 32, 2019, 7:01:30 AM");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "stringDate", "May May");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "string", "Hello Hello Hello");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "decimal", "1234.56a");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "double", "1234.56a");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "int16", "1234a");
			When.onTheSmartField.iEnterTextInSmartField(sComponent + "byte", "123a");

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "date", oCoreRB.getText("EnterDate", ["Dec 31, " + sCurrentYear]));
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "dtOffset", oCoreRB.getText("EnterDateTime", ["Dec 31, " + sCurrentYear + ", 11:59:58 PM"]));
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "stringDate", " is not a valid date");
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "string", oCoreRB.getText("EnterTextMaxLength", ["2"]));
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "decimal", oCoreRB.getText("EnterNumber"));
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "double", oCoreRB.getText("EnterNumber"));
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "int16", oCoreRB.getText("EnterInt"));
			Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText(sComponent + "byte", oCoreRB.getText("EnterInt"));

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use the ValueHelp dialog with deprecation code annotation in SmartFields it should hide revoked values", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "CurrencyCodeDeprecationCodeValues-input");

			//Assertion
			Then.onTheValueHelpDialog.iCheckValuHelpDialogHasTitle("Currency with DeprecationCode annotation");

			// Action
			When.onTheSmartFieldTypesPage.iExpandVHDFilters();

			// Assertion
			Then.onTheValueHelpDialog.iCheckFilterBarHasFilterWithLabelAndValue("Currency Status", "");
			// Action
			When.onTheSmartFieldTypesPage.iPressTheVHDFilterGoButton();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(2,7);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I use the ValueHelp dialog with deprecation code annotation in SmartFields it should display revoked values on search", function (Given, When, Then) {
			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheValueHelpDialog.iOpenTheValueHelpForInputField(sComponent + "CurrencyCodeDeprecationCodeValues-input");

			//Assertion
			Then.onTheValueHelpDialog.iCheckValuHelpDialogHasTitle("Currency with DeprecationCode annotation");

			// Action
			When.onTheSmartFieldTypesPage.iExpandVHDFilters();

			//Assertion
			Then.onTheValueHelpDialog.iCheckFilterBarHasFilterWithLabelAndValue("Currency Status", "");

			// Action
			When.onTheSmartFieldTypesPage.iEnterTextInControl(sComponent + "CurrencyCodeDeprecationCodeValues-input-valueHelpDialog-smartFilterBar-filterItemControlA_-DeprecationCode", "=E");

			// Action
			When.onTheSmartFieldTypesPage.iPressTheVHDFilterGoButton();

			//Assertion
			Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(2,2);

			// Clean
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("When I change value of SmartField with disabled VHD - Show All Items should not be displayed", function (Given, When, Then) {

			//Arrangement
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			//Action
			When.onTheSmartFieldTypesPage.iOpenSmartFieldSuggestions(sComponent + "string_no_vhd", "JR");

			//Assertion
			Then.onTheSmartFieldTypesPage.iSeeTheSuggestionsPopover(sComponent + "string_no_vhd-input-popup");
			Then.onTheSmartFieldTypesPage.iShouldNotSeeShowAllItems(sComponent + "string_no_vhd-input-popup");

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});

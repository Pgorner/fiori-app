/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/SmartFieldDateTimeOffset/applicationUnderTest/SmartFieldDateTimeOffset.html"
			}
		},
		ui5: {
			language: "de",
			rtl: false
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 60
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldDateTimeOffset/applicationUnderTest/test/pages/Application"
	], function() {


		QUnit.module("Defaults");

		opaTest("Check SmartField formatted values in display format", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert

			//JS configuration with timezone
			Then.onTheApplicationPage.iShouldSeeAValue("timezone", "24.11.2014, 23:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezone", "24.11.14, 23:16 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezone", "24.11.2014, 23:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezone", "24. November 2014, 23:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezone", "Montag, 24. November 2014, 23:16:52 GMT+05:30 Asien, Kalkutta");

			//JS configuration with  showDate=true showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneHide", "24.11.2014, 23:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneHide", "24.11.14, 23:16");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneHide", "24.11.2014, 23:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneHide", "24. November 2014, 23:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneHide", "Montag, 24. November 2014, 23:16:52 GMT+05:30");

			//JS configuration with showDate=false showTime=false showTimezone=true
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneOnly", "Asien, Kalkutta");

			//JS configuration with showDate=false showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneShowTime", "23:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneShowTime", "23:16");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneShowTime", "23:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneShowTime", "23:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneShowTime", "23:16:52 GMT+05:30");

			//XML configuration Timestamp with timezone
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimestamp", "24.11.2014, 23:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimestamp", "24.11.14, 23:16 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimestamp", "24.11.2014, 23:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimestamp", "24. November 2014, 23:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimestamp", "Montag, 24. November 2014, 23:16:52 GMT+05:30 Asien, Kalkutta");

			//XML configuration Timestamp showDate=true showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneHide", "24.11.2014, 23:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneHide", "24.11.14, 23:16");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneHide", "24.11.2014, 23:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneHide", "24. November 2014, 23:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneHide", "Montag, 24. November 2014, 23:16:52 GMT+05:30");

			//XML configuration Timestamp showDate=false showTime=false showTimezone=true
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneOnly", "Asien, Kalkutta");

			//XML configuration with showDate=false showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneShowTime", "23:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneShowTime", "23:16");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneShowTime", "23:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneShowTime", "23:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneShowTime", "23:16:52 GMT+05:30");

			//XML configuration Timestamp showTimezone Empty
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimestampEmpty", "");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimestampEmpty", "");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimestampEmpty", "");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimestampEmpty", "");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimestampEmpty", "");

			// Stop the app at the last config
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Check SmartField formatted values in edit mode", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action

			When.onTheApplicationPage.iToggleEditMode("idView--smartForm");

			// Assert

			//JS configuration with timezone
			Then.onTheApplicationPage.iShouldSeeAValue("timezone", "24.11.2014, 23:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("timezone", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezone", "24.11.14, 23:16 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("shortTimezone", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezone", "24.11.2014, 23:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("mediumTimezone", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezone", "24. November 2014, 23:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("longTimezone", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezone", "Montag, 24. November 2014, 23:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("fullTimezone", "Asia/Kolkata");

			//JS configuration with showDate=true showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneHide", "24.11.2014, 23:16:52");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("timezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneHide", "24.11.14, 23:16");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("shortTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneHide", "24.11.2014, 23:16:52");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("mediumTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneHide", "24. November 2014, 23:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("longTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneHide", "Montag, 24. November 2014, 23:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("fullTimezoneHide", "Asia/Kolkata");

			//JS configuration with showDate=false showTime=false showTimezone=true
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("timezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("shortTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("mediumTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("longTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("fullTimezoneOnly", "Asia/Kolkata");

			//XML configuration Timestamp with timezone
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimestamp", "24.11.2014, 23:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlTimestamp", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimestamp", "24.11.14, 23:16 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlShortTimestamp", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimestamp", "24.11.2014, 23:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlMediumTimestamp", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimestamp", "24. November 2014, 23:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlLongTimestamp", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimestamp", "Montag, 24. November 2014, 23:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlFullTimestamp", "Asia/Kolkata");

			//XML configuration Timestamp showDate=true showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneHide", "24.11.2014, 23:16:52");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneHide", "24.11.14, 23:16");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlShortTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneHide", "24.11.2014, 23:16:52");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlMediumTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneHide", "24. November 2014, 23:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlLongTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneHide", "Montag, 24. November 2014, 23:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlFullTimezoneHide", "Asia/Kolkata");

			//XML configuration Timestamp showDate=false showTime=false showTimezone=true
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlShortTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlMediumTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlLongTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlFullTimezoneOnly", "Asia/Kolkata");

			// Stop the app at the last config
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		opaTest("Check SmartField set correct value", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Action
			When.onTheApplicationPage.iToggleEditMode("idView--smartForm");
			When.onTheApplicationPage.iEnterValue("timezone", "24.11.2014, 21:16:52");

			// Assert

			//JS configuration with timezone
			Then.onTheApplicationPage.iShouldSeeAValue("timezone", "24.11.2014, 21:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("timezone", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezone", "24.11.14, 21:16 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("shortTimezone", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezone", "24.11.2014, 21:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("mediumTimezone", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezone", "24. November 2014, 21:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("longTimezone", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezone", "Montag, 24. November 2014, 21:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("fullTimezone", "Asia/Kolkata");

			//JS configuration with showDate=true showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneHide", "24.11.2014, 21:16:52");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("timezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneHide", "24.11.14, 21:16");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("shortTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneHide", "24.11.2014, 21:16:52");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("mediumTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneHide", "24. November 2014, 21:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("longTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneHide", "Montag, 24. November 2014, 21:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("fullTimezoneHide", "Asia/Kolkata");

			//JS configuration with showDate=false showTime=false showTimezone=true
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("timezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("shortTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("mediumTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("longTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("fullTimezoneOnly", "Asia/Kolkata");

			//XML configuration Timestamp with timezone
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimestamp", "24.11.2014, 21:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlTimestamp", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimestamp", "24.11.14, 21:16 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlShortTimestamp", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimestamp", "24.11.2014, 21:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlMediumTimestamp", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimestamp", "24. November 2014, 21:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlLongTimestamp", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimestamp", "Montag, 24. November 2014, 21:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlFullTimestamp", "Asia/Kolkata");

			//XML configuration Timestamp showDate=true showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneHide", "24.11.2014, 21:16:52");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneHide", "24.11.14, 21:16");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlShortTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneHide", "24.11.2014, 21:16:52");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlMediumTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneHide", "24. November 2014, 21:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlLongTimezoneHide", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneHide", "Montag, 24. November 2014, 21:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlFullTimezoneHide", "Asia/Kolkata");

			//XML configuration Timestamp showDate=false showTime=false showTimezone=true
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlShortTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlMediumTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlLongTimezoneOnly", "Asia/Kolkata");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeABindingValueOfDatePickerTimeZone("xmlFullTimezoneOnly", "Asia/Kolkata");

			// Action
			When.onTheApplicationPage.iToggleEditMode("idView--smartForm");

			// Assert

			//JS configuration with timezone
			Then.onTheApplicationPage.iShouldSeeAValue("timezone", "24.11.2014, 21:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezone", "24.11.14, 21:16 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezone", "24.11.2014, 21:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezone", "24. November 2014, 21:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezone", "Montag, 24. November 2014, 21:16:52 GMT+05:30 Asien, Kalkutta");

			//JS configuration with showDate=true showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneHide", "24.11.2014, 21:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneHide", "24.11.14, 21:16");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneHide", "24.11.2014, 21:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneHide", "24. November 2014, 21:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneHide", "Montag, 24. November 2014, 21:16:52 GMT+05:30");

			//JS configuration with showDate=false showTime=false showTimezone=true
			Then.onTheApplicationPage.iShouldSeeAValue("timezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("shortTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("mediumTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("longTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("fullTimezoneOnly", "Asien, Kalkutta");

			//XML configuration Timestamp with timezone
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimestamp", "24.11.2014, 21:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimestamp", "24.11.14, 21:16 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimestamp", "24.11.2014, 21:16:52 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimestamp", "24. November 2014, 21:16:52 GMT+05:30 Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimestamp", "Montag, 24. November 2014, 21:16:52 GMT+05:30 Asien, Kalkutta");

			//XML configuration Timestamp showDate=true showTime=true showTimezone=false
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneHide", "24.11.2014, 21:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneHide", "24.11.14, 21:16");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneHide", "24.11.2014, 21:16:52");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneHide", "24. November 2014, 21:16:52 GMT+05:30");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneHide", "Montag, 24. November 2014, 21:16:52 GMT+05:30");

			//XML configuration Timestamp showDate=false showTime=false showTimezone=true
			Then.onTheApplicationPage.iShouldSeeAValue("xmlTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlShortTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlMediumTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlLongTimezoneOnly", "Asien, Kalkutta");
			Then.onTheApplicationPage.iShouldSeeAValue("xmlFullTimezoneOnly", "Asien, Kalkutta");

			// Stop the app at the last config
			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();

	});
});

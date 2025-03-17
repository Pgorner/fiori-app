/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/actions/DateRangeActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/assertions/DateRangeAssertions"
], function (
	Opa5,
	opaTest,
	Press,
	EnterText,
	Actions,
	Assertions
) {
	"use strict";

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "applicationUnderTest.smartfilterbar_CalendarWeekNumbering",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/DateRangeType/applicationUnderTest/SmartFilterBar_CalendarWeekNumbering.html"
					));
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			},
			iStopMyApp: function () {
				this._myApplicationIsRunning = false;
				return this.iTeardownMyAppFrame();
			}
		}),
		actions: Actions,
		assertions: Assertions
	});

	QUnit.module("CalendarWeekNumbering");

	opaTest("Check date CalendarWeekNumbering configuration", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();
		var sProperty = "calendarWeekNumbering",
			sConfiguration = "MiddleEastern",
			sControlName = "smartFilterBar-filterItemControlA_-DT_MULTIPLE";

		// Act
		When.iClickShowAll();

		// Assert
		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DTR_SINGLE",sProperty,sConfiguration);
		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DTR_MULTIPLE",sProperty,sConfiguration);
		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DTR_INTERVAL",sProperty,sConfiguration);
		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DTR_AUTO",sProperty,sConfiguration);

		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DT_SINGLE",sProperty,sConfiguration);
		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DT_INTERVAL",sProperty,sConfiguration);

		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DTO_SINGLE",sProperty,sConfiguration);

		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-STRING_SINGLE",sProperty,sConfiguration);
		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-STRING_INTERVAL",sProperty,sConfiguration);

		// Act
		When.iOpenTheVHD(sControlName);

		// Assert

		Then.theControlInDialogShouldContainsConfiguration(sControlName,"sap.m.DatePicker",sProperty,sConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-DT_AUTO";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DatePicker", sProperty,sConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-DTO_MULTIPLE";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DateTimePicker",sProperty,sConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-DTO_INTERVAL";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DateTimePicker",sProperty,sConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-DTO_AUTO";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DateTimePicker",sProperty,sConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-STRING_MULTIPLE";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DatePicker",sProperty,sConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-STRING_AUTO";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DatePicker",sProperty,sConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Cleanup
		Given.iStopMyApp();
	});

	QUnit.module("ShowCurrentDateButton");

	opaTest("Check date ShowCurrentDateButton configuration", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();
		var sProperty = "showCurrentDateButton",
			bConfiguration = true,
			sControlName = "smartFilterBar-filterItemControlA_-DT_MULTIPLE";

		// Act
		When.iClickShowAll();

		// Assert

		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DT_SINGLE", sProperty, bConfiguration);
		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DT_INTERVAL", sProperty, bConfiguration);

		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-DTO_SINGLE", sProperty, bConfiguration);

		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-STRING_SINGLE", sProperty, bConfiguration);
		Then.theControlShouldContainsConfiguration("smartFilterBar-filterItemControlA_-STRING_INTERVAL", sProperty, bConfiguration);

		// Act
		When.iOpenTheVHD(sControlName);

		// Assert

		Then.theControlInDialogShouldContainsConfiguration(sControlName,"sap.m.DatePicker", sProperty, bConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-DT_AUTO";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DatePicker", sProperty, bConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-DTO_MULTIPLE";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DateTimePicker", sProperty, bConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-DTO_INTERVAL";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DateTimePicker", sProperty, bConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-DTO_AUTO";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DateTimePicker", sProperty, bConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-STRING_MULTIPLE";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DatePicker", sProperty, bConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Act
		sControlName = "smartFilterBar-filterItemControlA_-STRING_AUTO";
		When.iOpenTheVHD(sControlName);

		// Assert
		Then.theControlInDialogShouldContainsConfiguration(sControlName, "sap.m.DatePicker", sProperty, bConfiguration);

		//Clean up
		When.iPressTheVHDOK(sControlName);

		// Cleanup
		Given.iStopMyApp();
	});

});

/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/core/library",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/InitialValueIsSignificant/actions/InitialValueIsSignificantActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/InitialValueIsSignificant/assertions/InitialValueIsSignificantAssertions"
], function (
	Opa5,
	opaTest,
	Press,
	EnterText,
	coreLibrary,
	PropertyStrictEquals,
	Actions,
	Assertions
) {
	"use strict";

	Opa5.extendConfig({
		viewName: "",
		viewNamespace: "applicationUnderTest.SmartFilterBar_InitialValueIsSignificant",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function (sHtmlName) {
				var sUrl = "sap/ui/comp/qunit/smartfilterbar/opaTests/InitialValueIsSignificant/applicationUnderTest/" + sHtmlName + ".html";
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(sUrl));
			},
			iEnsureMyAppIsRunning: function (sHtmlName) {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp(sHtmlName);
					this._myApplicationIsRunning = true;
					this._myApplicationName = sHtmlName;
				} else if (this._myApplicationName !== sHtmlName){
					this.iStopMyApp();
					this.iStartMyApp(sHtmlName);
					this._myApplicationIsRunning = true;
					this._myApplicationName = sHtmlName;
				}
			},
			iStopMyApp: function () {
				this._myApplicationIsRunning = false;
				this._myApplicationName = null;
				return this.iTeardownMyAppFrame();
			}
		}),
			actions: Actions,
			assertions: Assertions
	});

	QUnit.module("Combobox InitialValueIsSignificant");

	opaTest("When have annotation InitialValueIsSignificant is true", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_InitialValueIsSignificant");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-STRING_InitialValueIsSignificant",
			sResult;
		// Act
		When.iSelectItemByKey(sId, "1");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "STRING_InitialValueIsSignificant eq '1'";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iSelectItemByKey(sId, "");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "STRING_InitialValueIsSignificant eq ''";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iSelectItemByKey(sId, "3");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "STRING_InitialValueIsSignificant eq '3'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iSelectItemByKey(sId, null);
	});

	opaTest("When have annotation InitialValueIsSignificant is false", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_InitialValueIsSignificant");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-STRING_InitialValueIsSignificantFalse",
			sResult;
		// Act
		When.iSelectItemByKey(sId, "1");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "STRING_InitialValueIsSignificantFalse eq '1'";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iSelectItemByKey(sId, "");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "undefined";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iSelectItemByKey(sId, "3");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "STRING_InitialValueIsSignificantFalse eq '3'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iSelectItemByKey(sId, null);
	});

	opaTest("When have annotation InitialValueIsSignificant not applied", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_InitialValueIsSignificant");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-STRING_AUTO",
			sResult;

		// Act
		When.iSelectItemByKey(sId, "1");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "STRING_AUTO eq '1'";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iSelectItemByKey(sId, "");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "undefined";
		Then.theFiltersShouldMatch(sResult);

		// Act
		When.iSelectItemByKey(sId, "3");
		When.PressTheFilterGoButton();

		// Assert
		sResult = "STRING_AUTO eq '3'";
		Then.theFiltersShouldMatch(sResult);

		// Cleanup
		When.iSelectItemByKey(sId, null);
		Given.iStopMyApp();
	});
});

/* global QUnit */
sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/core/library",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/SearchMatchesPattern/actions/SearchMatchesPatternActions",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/SearchMatchesPattern/assertions/SearchMatchesPatternAssertions"
], function(
	Library,
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

	var oCompResourceBundle = Library.getResourceBundleFor("sap.ui.comp"),
		ValueState = coreLibrary.ValueState,
		sValidationWarningMessage = oCompResourceBundle.getText("SEARCH_FIELD_VALIDATION_WARNING_MESSAGE");
	Opa5.extendConfig({
		viewName: "",
		viewNamespace: "applicationUnderTest.SmartFilterBar_SearchMatchesPattern",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function (sHtmlName) {
				var sUrl = "sap/ui/comp/qunit/smartfilterbar/opaTests/SearchMatchesPattern/applicationUnderTest/" + sHtmlName + ".html";
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

	QUnit.module("Edm.String sap:filter-restriction=auto with Value help");

	opaTest("Check value state and value text when special symbols when entered value", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_SearchMatchesPattern");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-CurrencyCode";

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E*t", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		// Act
		When.iEnterValue(sId, "*E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "E+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "e*t", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);

		// Act
		When.iEnterValue(sId, "E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);
	});

	opaTest("Check value state and value text when special symbols on focus out", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_SearchMatchesPattern");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-CurrencyCode";

		// Act
		When.iEnterValue(sId, "=E", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E*t", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=EU", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*EU", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "EU*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*E*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Value state on focus out
		// Act
		When.iEnterValue(sId, "E+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "=E", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "=E", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "e*t", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "E*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);
	});

	QUnit.module("Edm.String sap:filter-restriction=multi-value with Value help");

	opaTest("Check value state and value text when special symbols when entered value", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_SearchMatchesPattern");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-CurrencyCode2";

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E*t", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "E+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "e*t", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);

		// Act
		When.iEnterValue(sId, "E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);
	});

	opaTest("Check value state and value text when special symbols on focus out", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_SearchMatchesPattern");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-CurrencyCode2";

		// Act
		When.iEnterValue(sId, "=E", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "=E+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "=E", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "=E*t", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "=EU", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "*EU", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "EU*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "*E*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Value state on focus out
		// Act
		When.iEnterValue(sId, "E+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "e*t", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);

		// Act
		When.iEnterValue(sId, "E*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Error);
	});

	QUnit.module("Edm.String sap:filter-restriction=multi-value without Value help");

	opaTest("Check value state and value text when special symbols when entered value", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_SearchMatchesPattern");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-CurrencyCode3";

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E*t", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "E+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "+", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "=E", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "e*t", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.Warning);
		Then.theValueStateTextShouldBe(sId, sValidationWarningMessage);

		// Act
		When.iEnterValue(sId, "E*", true);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);
	});

	opaTest("Check value state and value text when special symbols on focus out", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning("SmartFilterBar_SearchMatchesPattern");
		var sId = "__xmlview0--smartFilterBar-filterItemControlA_-CurrencyCode3";

		// Act
		When.iEnterValue(sId, "=E", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=E*t", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "=EU", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*EU", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "EU*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "*E*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Value state on focus out
		// Act
		When.iEnterValue(sId, "E+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "+", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "e*t", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);

		// Act
		When.iEnterValue(sId, "E*", false);

		// Assert
		Then.theValueStateShouldBe(sId, ValueState.None);
	});
});

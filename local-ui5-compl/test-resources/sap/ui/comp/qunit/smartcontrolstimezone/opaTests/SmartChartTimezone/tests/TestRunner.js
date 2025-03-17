/* global QUnit */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/BaseTestRunner"
], function (
	BaseObject,
	Opa5,
	opaTest,
	BaseTestRunner
) {
	"use strict";

	var SmartChartTimezoneTestRunner = BaseTestRunner.extend("sap.ui.comp.qunit.smartcontrolstimezone.opaTests.SmartChartTimezone.tests.opa.TestRunner", /** @lends sap.ui.comp.qunit.smartcontrolstimezone.opaTests.SmartChartTimezone.tests.opa.TestRunner */ {
	});

	SmartChartTimezoneTestRunner.prototype._arrange = function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(this.appUrl, this.timezone);
		Opa5.assert.ok(true, this.fieldConfigurationString);
		Given.iSelectAFieldForTest(this.fieldName);
	};

	SmartChartTimezoneTestRunner.prototype._executeTests = function (oExpectedOverrides) {
		var oTestRunner = this,
			oSettings = {
				appUrl: this.oConfig.appUrl,
				fieldName: this.oConfig.fieldName,
				fieldConfigurationString: this.oConfig.fieldConfigurationString
			},
			oAssertAndCleanThis = {
				config: this.oConfig,
				expected: Object.assign({}, this.oExpected, oExpectedOverrides)
			};

		opaTest("User Interaction", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			When.iOpenP13nFilterAndShowField(oSettings.fieldName);
			oTestRunner.iEnterValue.call(this, When, oSettings.fieldName);
			When.iPressOKButtonInP13n();
			When.iPressUpdateResultsButton();

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("applyVariant (with Date)", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			When.iPressApplyVariantWithDateButton();

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("applyVariant (with String)", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			When.iPressApplyVariantWithStringButton();

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("applyVariant(fetchVariant)", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			When.iPressApplyVariantWithDateButton();
			When.iPressApplyVariantFetchVariantButton();
			When.iPressUpdateResultsButton();

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("setUiState(getUiState)", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			When.iPressApplyVariantWithDateButton();
			When.iPressSetUiStateGetUiStateButton();
			When.iPressUpdateResultsButton();

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("Close", function(Given) {
			// Arrange
			Given.iEnsureMyAppIsRunning(oSettings.appUrl, this.sTimezone);

			QUnit.assert.ok(true, "app closed");

			// Cleanup
			Given.iStopMyApp();
		});
	};

	SmartChartTimezoneTestRunner.prototype._clean = function (Given, When, Then) {
		// Cleanup
		When.iPressResetButton();
	};

	return SmartChartTimezoneTestRunner;
});

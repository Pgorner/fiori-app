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

	var SmartFilterBarTimezoneTestRunner = BaseTestRunner.extend("sap.ui.comp.qunit.smartcontrolstimezone.opaTests.SmartFilterBarTimezone.tests.opa.TestRunner", /** @lends sap.ui.comp.qunit.smartcontrolstimezone.opaTests.SmartFilterBarTimezone.tests.opa.TestRunner */ {
	});

	SmartFilterBarTimezoneTestRunner.prototype._arrange = function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(this.appUrl, this.timezone);
		Opa5.assert.ok(true, this.fieldConfigurationString);
		Given.iSelectAFieldForTest(this.fieldName);
	};

	SmartFilterBarTimezoneTestRunner.prototype._executeTests = function (oExpectedOverrides) {
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
			oTestRunner.iEnterValue.call(this, When, oSettings.fieldName);
			When.iPressGoButtonOnSmartFilterBar();

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("setFilterData with Date", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			When.iPressSetFilterDataWithDate(); // 1st of February 2023

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("setFilterData with String", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			When.iPressSetFilterDataWithString(); // 1st of February 2023

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("setFilterData(getFilterData())", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			oTestRunner.iEnterValue.call(this, When, oSettings.fieldName);
			When.iPressSetFilterDataGetFilterDataButton();

			// Assert & Clean
			oTestRunner._assert.call(oAssertAndCleanThis, Given, When, Then);
			oTestRunner._clean.call(oAssertAndCleanThis, Given, When, Then);
		});

		opaTest("setUiState(getUiState())", function(Given, When, Then) {
			// Arrange
			var oArrangeThis = Object.assign({}, oSettings, { timezone: this.sTimezone });
			oTestRunner._arrange.call(oArrangeThis, Given, When, Then);

			// Act
			oTestRunner.iEnterValue.call(this, When, oSettings.fieldName);
			When.iPressSetUiStateGetUiStateButton();

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

	SmartFilterBarTimezoneTestRunner.prototype._clean = function (Given, When, Then) {
		// Cleanup
		When.iPressClearButtonOnSmartFilterBar();
		Given.iSelectAFieldForTest("None");
	};

	return SmartFilterBarTimezoneTestRunner;
});

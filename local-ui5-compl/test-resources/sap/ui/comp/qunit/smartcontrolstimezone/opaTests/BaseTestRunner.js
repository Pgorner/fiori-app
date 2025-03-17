/* global QUnit */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/Actions",
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/Arrangements",
	"sap/ui/comp/qunit/smartcontrolstimezone/opaTests/Assertions"
], function (
	BaseObject,
	Opa5,
	opaTest,
	actions,
	arrangements,
	assertions
) {
	"use strict";

	var BaseTestRunner = BaseObject.extend("sap.ui.comp.qunit.smartcontrolstimezone.opaTests.BaseTestRunner", /** @lends sap.ui.comp.qunit.smartcontrolstimezone.opaTests.BaseTestRunner */ {
		constructor: function (oConfig, oExpected) {
			this.oConfig = oConfig;
			this.oExpected = oExpected;

			_validateObjectKeys(oConfig, [
				"appUrl",
				"fieldName",
				"fieldConfigurationString"
			]);
			_validateObjectKeys(oExpected, [
				"filterQuery",
				"variant",
				"uiState",
				"filterModelNoTimezone",
				"filterModelHonolulu",
				"filterModelUTC",
				"filterModelTarawa"
			]);
		}
	});

	BaseTestRunner.prototype.start = function () {
		Opa5.extendConfig({
			autoWait: true,
			enabled: false,
			async: true,
			actions: Object.assign({}, actions, this._getActions()),
			arrangements: Object.assign({}, arrangements, this._getArrangements()),
			assertions: Object.assign({}, assertions, this._getAssertions())
		});

		QUnit.module("No timezone", {
			beforeEach: function () {
				this.sTimezone = "";
			}
		});

		this._executeTests({
			usingUI5Date: this.oExpected.usingUI5Date || "false",
			filterModel: this.oExpected.filterModelNoTimezone
		});

		QUnit.module("Timezone: Pacific/Honolulu -10:00", {
			beforeEach: function () {
				this.sTimezone = "Pacific/Honolulu";
			}
		});

		this._executeTests({
			usingUI5Date: this.oExpected.usingUI5Date || "true",
			filterModel: this.oExpected.filterModelHonolulu
		});

		QUnit.module("Timezone: Etc/UTC +00:00", {
			beforeEach: function () {
				this.sTimezone = "Etc/UTC";
			}
		});

		this._executeTests({
			usingUI5Date: this.oExpected.usingUI5Date || "true",
			filterModel: this.oExpected.filterModelUTC
		});

		QUnit.module("Timezone: Pacific/Tarawa +12:00", {
			beforeEach: function () {
				this.sTimezone = "Pacific/Tarawa";
			}
		});

		this._executeTests({
			usingUI5Date: this.oExpected.usingUI5Date || "true",
			filterModel: this.oExpected.filterModelTarawa
		});
	};

	BaseTestRunner.prototype.iEnterValue = function (When, sFieldName) {
		throw new Error("Test should implement iEnterValue in the test page");
	};

	BaseTestRunner.prototype._getActions = function () {
		return {};
	};

	BaseTestRunner.prototype._getArrangements = function () {
		return {};
	};

	BaseTestRunner.prototype._getAssertions = function () {
		return {};
	};

	BaseTestRunner.prototype._arrange = function (Given, When, Then) {
		throw new Error("Child Runner should implement _arrange");
	};

	BaseTestRunner.prototype._executeTests = function () {
		throw new Error("Child Runner should implement _executeTests");
	};

	BaseTestRunner.prototype._assert = function (Given, When, Then) {
		var oConfig = this.config,
			oExpected = this.expected;

		// Assert
		Then.iSeeFilterQuery(oExpected.filterQuery);
		!oConfig.skipVariant && Then.iSeeVariant(oExpected.variant); // TODO: remove skipVariant option
		Then.iSeeUiState(oExpected.uiState);
		Then.iSeeFilterModel(oExpected.filterModel);
		Then.iSeeUsingUI5Date(oExpected.usingUI5Date);
	};

	BaseTestRunner.prototype._clean = function (Given, When, Then) {
		throw new Error("Child Runner should implement _clean");
	};

	function _validateObjectKeys(oConfig, aRequiredConfigNames) {
		var aMissingKeys = [],
			aConfigKeys = Object.keys(oConfig),
			bResult = aRequiredConfigNames.every(function (sRequiredFieldName) {
				var bExists = aConfigKeys.includes(sRequiredFieldName);

				if (!bExists) {
					aMissingKeys.push(sRequiredFieldName);
				}

				return bExists;
			});

		if (!bResult) {
			throw Error("Not all required keys are provided. Missing: " + aMissingKeys.join());
		}
	}

	return BaseTestRunner;
});

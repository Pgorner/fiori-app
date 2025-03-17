/* global QUnit */
(function () {
	"use strict";
	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/odata/FiscalMetadata"
	], function (FiscalMetadata) {
		QUnit.module("FiscalMetadata", {
			beforeEach: function () {
				this.aAnnotations = [
					"com.sap.vocabularies.Common.v1.IsFiscalYear",
					"com.sap.vocabularies.Common.v1.IsFiscalPeriod",
					"com.sap.vocabularies.Common.v1.IsFiscalYearPeriod",
					"com.sap.vocabularies.Common.v1.IsFiscalQuarter",
					"com.sap.vocabularies.Common.v1.IsFiscalYearQuarter",
					"com.sap.vocabularies.Common.v1.IsFiscalWeek",
					"com.sap.vocabularies.Common.v1.IsFiscalYearWeek",
					"com.sap.vocabularies.Common.v1.IsDayOfFiscalYear"
					//"com.sap.vocabularies.Common.v1.IsFiscalYearVariant"
				];
				this.aFiscalTypes = [
					"IsFiscalYear",
					"IsFiscalPeriod",
					"IsFiscalYearPeriod",
					"IsFiscalQuarter",
					"IsFiscalYearQuarter",
					"IsFiscalWeek",
					"IsFiscalYearWeek",
					"IsDayOfFiscalYear"
				];
			},
			afterEach: function () {
				this.aAnnotations = null;
			}
		});

		QUnit.test("Should check if the value is fiscal annotation type", function (assert) {
			for (var i = 0; i < this.aAnnotations.length; i++) {
				var oStettings = {}, element = this.aAnnotations[i];
				oStettings[element] = {
					Bool: true
				};
				assert.strictEqual(FiscalMetadata.isFiscalValue(oStettings), true);
			}
		});

		QUnit.test("Should get fiscal annotation type", function (assert) {
			for (var i = 0; i < this.aAnnotations.length; i++) {
				var oStettings = {}, element = this.aAnnotations[i];
				oStettings[element] = {
					Bool: true
				};
				assert.strictEqual(FiscalMetadata.getFiscalAnnotationType(oStettings), this.aFiscalTypes[i]);
			}
		});

		QUnit.test("Shall return the proper result based on Fiscal Annotation", function(assert) {
			var oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalSomethingNew": {
					Bool: true
				}
			};
			assert.strictEqual(FiscalMetadata.isFiscalValue(oField), false);

			oField = {
				"foo": {
					Bool: true
				}
			};
			assert.strictEqual(FiscalMetadata.isFiscalValue(oField), false);
		});

		QUnit.test('Should return true if the EDM property is annotated with "IsFiscalYear" annotation', function(assert) {

			var oProperty = {
				"com.sap.vocabularies.Common.v1.IsFiscalYear": {
					"Bool": true
				}
			};

			assert.strictEqual(FiscalMetadata.isFiscalYear(oProperty), true);
		});

		QUnit.test('Should return true if the EDM property is annotated with "IsFiscalYearPeriod" annotation', function(assert) {

			var oProperty = {
				"com.sap.vocabularies.Common.v1.IsFiscalYearPeriod": {
					"Bool": true
				}
			};

			assert.strictEqual(FiscalMetadata.isFiscalYearPeriod(oProperty), true);
		});


		QUnit.start();
	});

})();

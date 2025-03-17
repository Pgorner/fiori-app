/* global QUnit */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/odata/CalendarMetadata"
	], function(CalendarMetadata) {

		QUnit.module("sap.ui.comp.odata.CalendarMetadata");

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(CalendarMetadata);
		});

		QUnit.test("Shall return the proper result based on Calendar Annotation", function(assert) {
			var oField;
			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYear": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarWeek": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarMonth": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarQuarter": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearWeek": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearMonth": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearQuarter": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarSomethingNew": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), false);

			oField = {
				"foo": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), false);
		});

		QUnit.test("Shall return the proper result based on Calendar Annotation", function(assert) {
			var oField;
			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYear": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarWeek": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarMonth": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarQuarter": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearWeek": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearMonth": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearQuarter": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarSomethingNew": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), false);

			oField = {
				"foo": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), false);

			oField = {
				"foo": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), false);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYear": {
					Bool: "false"
				}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), false);
		});

		QUnit.test('it should return true if the EDM property is annotated with "IsCalendarYear" annotation', function(assert) {
			var oProperty = {
				"com.sap.vocabularies.Common.v1.IsCalendarYear": {
					"Bool": true
				}
			};

			assert.strictEqual(CalendarMetadata.isYear(oProperty), true);
		});

		QUnit.test('it should return true if the EDM property is annotated with "IsCalendarYearWeek" annotation', function(assert) {
			var oProperty = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearWeek": {
					"Bool": true
				}
			};

			assert.strictEqual(CalendarMetadata.isYearWeek(oProperty), true);
		});

		QUnit.test('it should return true if the EDM property is annotated with "IsCalendarYearMonth" annotation', function(assert) {
			var oProperty = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearMonth": {
					"Bool": true
				}
			};

			assert.strictEqual(CalendarMetadata.isYearMonth(oProperty), true);
		});

		QUnit.test('it should return true if the EDM property is annotated with "IsCalendarYearQuarter" annotation', function(assert) {
			var oProperty = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearQuarter": {
					"Bool": true
				}
			};

			assert.strictEqual(CalendarMetadata.isYearQuarter(oProperty), true);
		});

		QUnit.start();
	});

})();

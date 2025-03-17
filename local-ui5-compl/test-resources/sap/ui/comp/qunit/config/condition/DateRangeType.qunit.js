/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/smartfilterbar/FilterProvider",
	"sap/ui/comp/config/condition/DateRangeType",
	"sap/ui/comp/config/condition/NullableInteger",
	"sap/ui/comp/config/condition/Type",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/date/UniversalDate",
	"sap/ui/core/date/UniversalDateUtils",
	"sap/ui/model/json/JSONModel",
	"sap/base/util/merge",
	// load all required calendars in advance
	"sap/ui/core/date/Gregorian",
	"sap/ui/core/date/Islamic"

], function (
	FilterProvider,
	DateRangeType,
	NullableInteger,
	Type,
	ODataModel,
	UniversalDate,
	UniversalDateUtils,
	JSONModel,
	merge
) {
	"use strict";

	QUnit.module("Edm.DateTimeOffset with filter-restriction interval", {
		beforeEach: function () {
			this.oFilterProvider = new FilterProvider({ entityType: "foo", model: sinon.createStubInstance(ODataModel) });
		},
		afterEach: function () {
			this.oFilterProvider.destroy();
		}
	});

	QUnit.test("getOperations should return DateTime operations", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", this.oFilterProvider);
		oDateRangeType._bDTOffset  = true;
		var oGetDTOffsetOperationsSpy = this.spy(oDateRangeType, "getDTOffsetOperations");

		// Act
		var aResult = oDateRangeType.getOperations();

		function findItem(sName, oItem) {
			return oItem.key === sName;
		}

		// Assert
		assert.equal(oGetDTOffsetOperationsSpy.callCount, 1, "getDTOffsetOperations should be called once");
		assert.ok(aResult.find(findItem.bind(aResult, "DATETIME")), "DATETIME should be in resulting array");
		assert.ok(aResult.find(findItem.bind(aResult, "DATETIMERANGE")), "DATETIMERANGE should be in resulting array");

		// Cleanup
		oDateRangeType.destroy();
		oGetDTOffsetOperationsSpy.restore();
	});

	QUnit.test("initialize should convert string values to dates for DATETIMERANGE", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", this.oFilterProvider);
		oDateRangeType._bDTOffset  = true;
		var oResultCondition = {};
		var oGetConditionContextObject = this.stub(oDateRangeType, "getConditionContext").returns({
			getObject: this.stub().returns(oResultCondition)
		});

		// Act
		oDateRangeType.initialize({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "DATETIMERANGE",
					"value1": "2022-02-10T20:20:00.000Z",
					"value2": "2022-02-10T20:21:00.000Z",
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			},
			"ranges": [
				{
					"operation": "BT",
					"value1": "2022-02-10T20:20:00.000Z",
					"value2": "2022-02-10T20:21:00.000Z",
					"exclude": false,
					"keyField": "FieldName"
				}
			],
			"items": []
		});

		// Assert
		assert.equal(oResultCondition.operation, "DATETIMERANGE", "operation should be correct");
		assert.ok(oResultCondition.value1 instanceof Date, "value1 should be instance of Date object");
		assert.ok(oResultCondition.value2 instanceof Date, "value2 should be instance of Date object");

		// Cleanup
		oDateRangeType.destroy();
		oGetConditionContextObject.restore();
	});

	QUnit.test("initialize should convert string values to dates for DATETIME", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", this.oFilterProvider);
		oDateRangeType._bDTOffset  = true;
		var oResultCondition = {};
		var oGetConditionContextObject = this.stub(oDateRangeType, "getConditionContext").returns({
			getObject: this.stub().returns(oResultCondition)
		});

		// Act
		oDateRangeType.initialize({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "DATETIME",
					"value1": "2022-02-10T20:20:00.000Z",
					"value2": "2022-02-10T20:21:00.000Z",
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			},
			"ranges": [
				{
					"operation": "BT",
					"value1": "2022-02-10T20:20:00.000Z",
					"value2": "2022-02-10T20:21:00.000Z",
					"exclude": false,
					"keyField": "FieldName"
				}
			],
			"items": []
		});

		// Assert
		assert.equal(oResultCondition.operation, "DATETIME", "operation should be correct");
		assert.ok(oResultCondition.value1 instanceof Date, "value1 should should be instance of Date object");
		assert.ok(oResultCondition.value1 instanceof Date, "value2 should should be instance of Date object");

		// Cleanup
		oDateRangeType.destroy();
		oGetConditionContextObject.restore();
	});

	QUnit.test("getFilterRanges should not reset time for DATETIMERANGE", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", this.oFilterProvider);
		oDateRangeType._bDTOffset  = true;
		var oCondition = {
			"operation": "DATETIMERANGE",
			"value1": new Date("2022-02-10T20:20:00.000Z"),
			"value2": new Date("2022-02-10T20:21:00.000Z"),
			"key": "FieldName"
		};
		var oGetConditionStub = this.stub(oDateRangeType, "getCondition").returns(oCondition);
		var oIsValidConditionStub = this.stub(oDateRangeType, "isValidCondition").returns(true);
		var oSetStartTimeSpy = this.spy(DateRangeType, "setStartTime");
		var oSetEndTimeSpy = this.spy(DateRangeType, "setEndTime");

		// Act
		var aResult = oDateRangeType.getFilterRanges();

		// Assert
		assert.equal(oSetStartTimeSpy.callCount, 0, "setStartTime should not be called to reset the time");
		assert.equal(oSetEndTimeSpy.callCount, 0, "setEndTime should not be called to reset the time");
		assert.equal(aResult[0].operation, "BT", "operation should be set to 'BT'");
		assert.equal(aResult[0].value1.getMinutes(), 20, "minutes for the value1 should be not reset and should be '20'");
		assert.equal(aResult[0].value2.getMinutes(), 21, "minutes for the value2 should be not reset and should be '21'");

		// Cleanup
		oDateRangeType.destroy();
		oGetConditionStub.restore();
		oIsValidConditionStub.restore();
		oSetStartTimeSpy.restore();
		oSetEndTimeSpy.restore();
	});

	QUnit.test("getFilterRanges should not reset time for DATETIME", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", this.oFilterProvider);
		oDateRangeType._bDTOffset  = true;
		var oCondition = {
			"operation": "DATETIME",
			"value1": new Date("2022-02-10T20:20:00.000Z"),
			"value2": new Date("2022-02-10T20:21:00.000Z"),
			"key": "FieldName"
		};
		var oGetConditionStub = this.stub(oDateRangeType, "getCondition").returns(oCondition);
		var oIsValidConditionStub = this.stub(oDateRangeType, "isValidCondition").returns(true);
		var oSetStartTimeSpy = this.spy(DateRangeType, "setStartTime");
		var oSetEndTimeSpy = this.spy(DateRangeType, "setEndTime");

		// Act
		var aResult = oDateRangeType.getFilterRanges();

		// Assert
		assert.equal(oSetStartTimeSpy.callCount, 0, "setStartTime should not be called to reset the time");
		assert.equal(oSetEndTimeSpy.callCount, 0, "setEndTime should not be called to reset the time");
		assert.equal(aResult[0].operation, "BT", "operation should be set to 'BT'");
		assert.equal(aResult[0].value1.getMinutes(), 20, "minutes for the value1 should be not reset and should be '20'");
		assert.equal(aResult[0].value2.getMinutes(), 21, "minutes for the value2 should be not reset and should be '21'");

		// Cleanup
		oDateRangeType.destroy();
		oGetConditionStub.restore();
		oIsValidConditionStub.restore();
		oSetStartTimeSpy.restore();
		oSetEndTimeSpy.restore();
	});

	var oModel = sinon.createStubInstance(ODataModel);
	var oFilterProvider;
	QUnit.module("sap.ui.comp.config.condition.DateRangeType", {
		beforeEach: function () {
			oFilterProvider = new FilterProvider({ entityType: "foo", model: oModel });
			var oEmptyJson = { "SomeCrap": "", "SomeMoreCrap": { "items": [], "value": "" } };
			this.oNonEmptyJson = { "CountryCode": { "value": "dsagfdsg", "items": [{ "key": "GT", "text": "Guatemala" }, { "key": "GQ", "text": "Equatorial Guin" }, { "key": "GH", "text": "Ghana" }, { "key": "GA", "text": "Gabon" }, { "key": "FI", "text": "Finland" }, { "key": "DJ", "text": "Djibouti" }, { "key": "EE", "text": "Estonia" }, { "key": "BH", "text": "Bahrain" }, { "key": "BE", "text": "Belgium" }, { "key": "AX", "text": "" }, { "key": "AS", "text": "Samoa, America" }, { "key": "AQ", "text": "Antarctica" }, { "key": "AI", "text": "Anguilla" }, { "key": "AF", "text": "Afghanistan" }, { "key": "AD", "text": "Andorran" }] }, "RegionCode": { "value": "fds", "items": [{ "key": "CA", "text": "CA" }, { "key": "CL", "text": "[object Object] (CL)" }, { "key": "CH", "text": "[object Object] (CH)" }, { "key": "CO", "text": "[object Object] (CO)" }, { "key": "FR", "text": "[object Object] (FR)" }, { "key": "NL", "text": "[object Object] (NL)" }, { "key": "NO", "text": "[object Object] (NO)" }, { "key": "ID", "text": "[object Object] (ID)" }, { "key": "HU", "text": "[object Object] (HU)" }, { "key": "AR", "text": "[object Object] (AR)" }] } };
			this.oJson = merge({}, this.oNonEmptyJson, oEmptyJson);
			this.sJson = JSON.stringify(this.oJson);
		},
		afterEach: function () {
			oFilterProvider.destroy();
		}
	});

	QUnit.test("Static Methods Test", function (assert) {

		var oUDate = DateRangeType.toUniversalDate();
		assert.strictEqual(oUDate instanceof UniversalDate, true, "toUniversalDate(): returns UniversalDate instance");

		var oDate = new Date();
		oUDate = DateRangeType.toUniversalDate(oDate);
		assert.strictEqual(oUDate instanceof UniversalDate, true, "toUniversalDate(new Date()): returns UniversalDate instance");
		assert.strictEqual(oUDate.oDate.getTime(), oDate.getTime(), "toUniversalDate(new Date()): returns expected Date value");

		oDate = new UniversalDate(oDate);
		oUDate = DateRangeType.toUniversalDate(oDate);
		assert.strictEqual(oUDate instanceof UniversalDate, true, "toUniversalDate(new UniversalDate()): returns UniversalDate instance");
		assert.strictEqual(oUDate.getTime(), oDate.getTime(), "toUniversalDate(new UniversalDate()): returns expected Date value");

		oDate = new Date();
		oUDate = DateRangeType.toUniversalDate(oDate.getTime());
		assert.strictEqual(oUDate instanceof UniversalDate, true, "toUniversalDate(new Date().getTime()): returns UniversalDate instance");
		assert.strictEqual(oUDate.oDate.getTime(), oDate.getTime(), "toUniversalDate(new Date().getTime()): returns expected Date value");


		oUDate = DateRangeType.setStartTime(new UniversalDate());
		assert.strictEqual(oUDate.oDate.getHours() === 0, true, "setStartTime: Start hours set correctly");
		assert.strictEqual(oUDate.oDate.getMinutes() === 0, true, "setStartTime: Start minutes set correctly");
		assert.strictEqual(oUDate.oDate.getSeconds() === 0, true, "setStartTime: Start seconds set correctly");
		assert.strictEqual(oUDate.oDate.getMilliseconds() === 0, true, "setStartTime: Start milliseconds set correctly");

		oUDate = DateRangeType.setStartTime();
		assert.strictEqual(oUDate.oDate.getHours() === 0, true, "setStartTime: Start hours set correctly");
		assert.strictEqual(oUDate.oDate.getMinutes() === 0, true, "setStartTime: Start minutes set correctly");
		assert.strictEqual(oUDate.oDate.getSeconds() === 0, true, "setStartTime: Start seconds set correctly");
		assert.strictEqual(oUDate.oDate.getMilliseconds() === 0, true, "setStartTime: Start milliseconds set correctly");

		oUDate = DateRangeType.setEndTime(new UniversalDate());
		assert.strictEqual(oUDate.oDate.getHours() === 23, true, "setEndTime: End hours set correctly");
		assert.strictEqual(oUDate.oDate.getMinutes() === 59, true, "setEndTime: End minutes set correctly");
		assert.strictEqual(oUDate.oDate.getSeconds() === 59, true, "setEndTime: End seconds set correctly");
		assert.strictEqual(oUDate.oDate.getMilliseconds() === 999, true, "setEndTime: End milliseconds set correctly");

		oUDate = DateRangeType.setEndTime(new UniversalDate());
		assert.strictEqual(oUDate.oDate.getHours() === 23, true, "setEndTime: End hours set correctly");
		assert.strictEqual(oUDate.oDate.getMinutes() === 59, true, "setEndTime: End minutes set correctly");
		assert.strictEqual(oUDate.oDate.getSeconds() === 59, true, "setEndTime: End seconds set correctly");
		assert.strictEqual(oUDate.oDate.getMilliseconds() === 999, true, "setEndTime: End milliseconds set correctly");

		var oDate = new UniversalDate();
		oDate.setDate(1);
		oDate.setMonth(0);
		oDate.setFullYear(2000);

		//DateRange DAY
		var aRange = DateRangeType.getDateRange(1, "DAY", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 1, true, "getDateRange 1 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(2, "DAY", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 2 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 2 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 2 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 2 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 2 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 2 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 2 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  2 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 2 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 2 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 2 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 2, true, "getDateRange 2 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 2 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 2 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(32, "DAY", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 32 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 32 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 32 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 32 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 32 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 32 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 32 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange 32 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 32 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 32 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 32 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 1, true, "getDateRange 32 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 1, true, "getDateRange 32 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 32 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(367, "DAY", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 367 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 367 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 367 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 367 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 367 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 367 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 367 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange 367 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 367 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 367 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 367 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 1, true, "getDateRange 367 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 367 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2001, true, "getDateRange 367 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(-1, "DAY", oDate); // previous day
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 31, true, "getDateRange -1 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 11, true, "getDateRange -1 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange -1 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "DAY", oDate, true, true); // next day
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 DAY in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 DAY in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 DAY in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 DAY in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 2, true, "getDateRange 1 DAY in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 DAY in future:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 DAY in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 DAY in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 DAY in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 DAY in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 DAY in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 2, true, "getDateRange 1 DAY in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 DAY in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 DAY in future:End year set correctly");

		//DateRange WEEK
		aRange = DateRangeType.getDateRange(1, "WEEK", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 7, true, "getDateRange 1 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(2, "WEEK", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 2 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 2 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 2 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 2 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 2 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 2 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 2 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  2 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 2 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 2 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 2 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 14, true, "getDateRange 2 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 2 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 2 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(5, "WEEK", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 5 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 5 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 5 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 5 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 5 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 5 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 5 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  5 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 5 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 5 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 5 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 4, true, "getDateRange 5 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 1, true, "getDateRange 5 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 5 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(53, "WEEK", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 53 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 53 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 53 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 53 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 53 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 53 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 53 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  53 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 53 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 53 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 53 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 5, true, "getDateRange 53 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 53 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2001, true, "getDateRange 53 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(-1, "WEEK", oDate, true); // previous week
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 19, true, "getDateRange -1 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 11, true, "getDateRange -1 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 25, true, "getDateRange -1 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "WEEK", oDate, true, true); // next week
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 WEEK in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 WEEK in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 WEEK in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 WEEK in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 2, true, "getDateRange 1 WEEK in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 WEEK in future:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 WEEK in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 WEEK in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 WEEK in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 WEEK in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 WEEK in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 8, true, "getDateRange 1 WEEK in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 WEEK in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 WEEK in future:End year set correctly");

		//DateRange MONTH
		aRange = DateRangeType.getDateRange(1, "MONTH", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 MONTH: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 MONTH:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 MONTH:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 MONTH:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 MONTH:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 MONTH:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 MONTH:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 MONTH: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 MONTH: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 MONTH: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 MONTH: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 1 MONTH:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 MONTH:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 MONTH:End year set correctly");

		aRange = DateRangeType.getDateRange(2, "MONTH", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 2 MONTH: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 2 MONTH:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 2 MONTH:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 2 MONTH:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 2 MONTH:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 2 MONTH:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 2 MONTH:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  2 MONTH: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 2 MONTH: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 2 MONTH: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 2 MONTH: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 29, true, "getDateRange 2 MONTH:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 1, true, "getDateRange 2 MONTH:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 2 MONTH:End year set correctly");

		aRange = DateRangeType.getDateRange(13, "MONTH", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 13 MONTH: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 13 MONTH:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 13 MONTH:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 13 MONTH:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 13 MONTH:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 13 MONTH:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 13 MONTH:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  13 MONTH: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 13 MONTH: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 13 MONTH: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 13 MONTH: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 13 MONTH:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 13 MONTH:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2001, true, "getDateRange 13 MONTH:End year set correctly");

		var oDate2 = new UniversalDate(); // to test determination of intrval start
		oDate2.setDate(10);
		oDate2.setMonth(0);
		oDate2.setFullYear(2000);

		aRange = DateRangeType.getDateRange(-1, "MONTH", oDate2, true); // previous month
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 MONTH: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 MONTH:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 MONTH:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 MONTH:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange -1 MONTH:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 11, true, "getDateRange -1 MONTH:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 MONTH:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 MONTH: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 MONTH: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 MONTH: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 MONTH: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange -1 MONTH:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 MONTH:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 MONTH:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "MONTH", oDate2, true, true); // next month
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 MONTH in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 MONTH in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 MONTH in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 MONTH in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 MONTH in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 1, true, "getDateRange 1 MONTH in future:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 MONTH in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 MONTH in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 MONTH in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 MONTH in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 MONTH in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 29, true, "getDateRange 1 MONTH in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 1, true, "getDateRange 1 MONTH in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 MONTH in future:End year set correctly");

		//DateRange QUARTER
		aRange = DateRangeType.getDateRange(1, "QUARTER", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 QUARTER: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 QUARTER:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 QUARTER:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 QUARTER:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 QUARTER:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 QUARTER:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 QUARTER:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 QUARTER: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 QUARTER: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 QUARTER: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 QUARTER: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 1 QUARTER:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 2, true, "getDateRange 1 QUARTER:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 QUARTER:End year set correctly");

		aRange = DateRangeType.getDateRange(2, "QUARTER", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 2 QUARTER: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 2 QUARTER:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 2 QUARTER:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 2 QUARTER:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 2 QUARTER:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 2 QUARTER:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 2 QUARTER:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  2 QUARTER: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 2 QUARTER: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 2 QUARTER: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 2 QUARTER: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 30, true, "getDateRange 2 QUARTER:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 5, true, "getDateRange 2 QUARTER:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 2 QUARTER:End year set correctly");

		aRange = DateRangeType.getDateRange(4, "QUARTER", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 4 QUARTER: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 4 QUARTER:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 4 QUARTER:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 4 QUARTER:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 4 QUARTER:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 4 QUARTER:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 4 QUARTER:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  4 QUARTER: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 4 QUARTER: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 4 QUARTER: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 4 QUARTER: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 4 QUARTER:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange 4 QUARTER:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 4 QUARTER:End year set correctly");

		aRange = DateRangeType.getDateRange(-1, "QUARTER", oDate2, true); // previous quarter
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 QUARTER: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 QUARTER:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 QUARTER:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 QUARTER:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange -1 QUARTER:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 9, true, "getDateRange -1 QUARTER:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 QUARTER:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 QUARTER: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 QUARTER: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 QUARTER: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 QUARTER: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange -1 QUARTER:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 QUARTER:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 QUARTER:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "QUARTER", oDate2, true, true);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 QUARTER in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 QUARTER in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 QUARTER in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 QUARTER in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 QUARTER in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 3, true, "getDateRange 1 QUARTER in future:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 QUARTER in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 QUARTER in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 QUARTER in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 QUARTER in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 QUARTER in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 30, true, "getDateRange 1 QUARTER in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 5, true, "getDateRange 1 QUARTER in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 QUARTER in future:End year set correctly");

		//DateRange YEAR
		aRange = DateRangeType.getDateRange(1, "YEAR", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 YEAR: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 YEAR:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 YEAR:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 YEAR:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 YEAR:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 YEAR:Start YEAR set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 YEAR:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 YEAR: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 YEAR: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 YEAR: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 YEAR: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 1 YEAR:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange 1 YEAR:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 YEAR:End year set correctly");

		aRange = DateRangeType.getDateRange(-1, "YEAR", oDate2, true); // previous year
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 YEAR: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 YEAR:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 YEAR:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 YEAR:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange -1 YEAR:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange -1 YEAR:Start YEAR set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 YEAR:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 YEAR: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 YEAR: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 YEAR: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 YEAR: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange -1 YEAR:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 YEAR:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 YEAR:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "YEAR", oDate2, true, true); // next year
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 YEAR in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 YEAR in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 YEAR in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 YEAR in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 YEAR in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 YEAR in future:Start YEAR set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2001, true, "getDateRange 1 YEAR in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 YEAR in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 YEAR in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 YEAR in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 YEAR in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 1 YEAR in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange 1 YEAR in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2001, true, "getDateRange 1 YEAR in future:End year set correctly");

		//ERROR
		try {
			aRange = DateRangeType.getDateRange(1, "XXX", oDate);
		} catch (error) {
			assert.strictEqual(error.message === "invalid unit XXX", true, "No falid unit  given");
		}

	});

	QUnit.test("Checking DefaultValues", function (assert) {
		var fnStubGetCondition;
		var oDate1 = DateRangeType.getWeekStartDate(new UniversalDate());
		var oDate2 = DateRangeType.getWeekStartDate();
		//var iDiff = oDate2.getTime() - oDate1.getTime()
		assert.strictEqual(oDate2.getTime() - oDate1.getTime() >= 0, true, "DateRangeType.getWeekStartDate without date");

		oDate1 = DateRangeType.getMonthStartDate(new UniversalDate());
		oDate2 = DateRangeType.getMonthStartDate();
		//iDiff = oDate2.getTime() - oDate1.getTime()
		assert.strictEqual(oDate2.getTime() - oDate1.getTime() >= 0, true, "DateRangeType.getMonthStartDate without date");

		oDate1 = DateRangeType.getQuarterStartDate(new UniversalDate(2000, 8, 12));
		assert.strictEqual(oDate1.getMonth(), 6, "DateRangeType.getQuarterStartDate returns Month 6");

		oDate1 = DateRangeType.getQuarterStartDate(new UniversalDate());
		oDate2 = DateRangeType.getQuarterStartDate();
		var iDiff = oDate2.getTime() - oDate1.getTime();
		assert.strictEqual(iDiff >= 0 && iDiff <= 10, true, "DateRangeType.getQuarterStartDate  without date");

		var oDateRangeType = new DateRangeType("TestFieldName");
		var aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.DATERANGE);
		assert.strictEqual(aResult[0] === null, true, "DateRangeType.Operations.DATERANGE value1 = null");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.DATERANGE value2 = null");

		fnStubGetCondition = sinon.stub(oDateRangeType, "getCondition").returns({operation: "DATERANGE", value1: 1, value2: 1, key: "DATE_INTERVAL"});
		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.DATERANGE);
		assert.strictEqual(aResult[0] === null, true, "DateRangeType.Operations.DATERANGE value1 = null");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.DATERANGE value2 = null");
		fnStubGetCondition.restore();

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.FROM);
		assert.strictEqual(aResult[0] === null, true, "DateRangeType.Operations.FROM value1 = null");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.FROM value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.TO);
		assert.strictEqual(aResult[0] === null, true, "DateRangeType.Operations.TO value1 = null");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.TO value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTDAYS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTDAYS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTDAYS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTWEEKS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTWEEKS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTWEEKS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTMONTHS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTMONTHS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTMONTHS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTQUARTERS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTQUARTERS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTQUARTERS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTYEARS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTYEARS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTYEARS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.TODAY);
		assert.strictEqual(aResult[0].getTime() === DateRangeType.setStartTime().getTime(), true, "DateRangeType.Operations.TODAY value1 = today");
		assert.strictEqual(aResult[1].getTime() === DateRangeType.getDateRange(1, "DAY", true)[1].getTime(), true, "DateRangeType.Operations.TODAY value2 = today");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.TODAYFROMTO);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.TODAYFROMTO value1 = 1");
		assert.strictEqual(aResult[1] === 1, true, "DateRangeType.Operations.TODAYFROMTO value2 = 1");

	});

	QUnit.test("Serialize, initialize without FilterProvider", function (assert) {
		var oDateRangeType = new DateRangeType("TestFieldName");
		oFilterProvider._mConditionTypeFields["foo"] = { conditionType: oDateRangeType };

		assert.strictEqual(oDateRangeType.getModel() instanceof JSONModel, true, "JSON model available");
		var oData = oDateRangeType.getModel().getData();

		assert.strictEqual(oData.condition !== null && typeof oData.condition === "object", true, "ModelData.condition check: object");
		assert.strictEqual(oData.condition.key === "TestFieldName", true, "ModelData.condition check: fieldname");
		assert.strictEqual(oData.condition.operation === "", true, "ModelData.condition check: operation");
		assert.strictEqual(oData.condition.value1 === null, true, "ModelData.condition check: value1");
		assert.strictEqual(oData.condition.value2 === null, true, "ModelData.condition check: value2");

		var oModel = oDateRangeType.getModel();
		assert.strictEqual(typeof oModel.getProperty("", oDateRangeType.getConditionContext()) === "object", true, "Model.getProperty.condition check: object");
		assert.strictEqual(oModel.getProperty("key", oDateRangeType.getConditionContext()) === "TestFieldName", true, "Model.getProperty.condition check: fieldname");
		assert.strictEqual(oModel.getProperty("operation", oDateRangeType.getConditionContext()) === "", true, "Model.getProperty.condition check: operation");
		assert.strictEqual(oModel.getProperty("value1", oDateRangeType.getConditionContext()) === null, true, "Model.getProperty.condition check: value1");
		assert.strictEqual(oModel.getProperty("value2", oDateRangeType.getConditionContext()) === null, true, "Model.getProperty.condition check: value2");

		var aValues = DateRangeType.getDateRange(2, "WEEK", DateRangeType.getWeekStartDate(new UniversalDate()));
		oDateRangeType.initialize({
			conditionTypeInfo: {
				name: "sap.ui.comp.config.condition.DateRangeType",
				data: {
					key: "TestFieldName",
					operation: "DATERANGE",
					value1: aValues[0].oDate,
					value2: aValues[1].oDate
				}
			}
		});
		assert.strictEqual(oModel.getProperty("key", oDateRangeType.getConditionContext()) === "TestFieldName", true, "Model.getProperty.condition check: fieldname");
		assert.strictEqual(oModel.getProperty("operation", oDateRangeType.getConditionContext()) === "DATERANGE", true, "Model.getProperty.condition check: operation");
		assert.strictEqual(oModel.getProperty("value1", oDateRangeType.getConditionContext()) === aValues[0].oDate, true, "Model.getProperty.condition check: value1");
		assert.strictEqual(oModel.getProperty("value2", oDateRangeType.getConditionContext()) === aValues[1].oDate, true, "Model.getProperty.condition check: value2");

		var aRanges = oDateRangeType.getFilterRanges();
		assert.strictEqual(aRanges[0].exclude === false, true, "getFilterRanges: exclude");
		assert.strictEqual(aRanges[0].keyField === "TestFieldName", true, "getFilterRanges: keyField");
		assert.strictEqual(aRanges[0].operation === "BT", true, "getFilterRanges: operation");
		assert.strictEqual(aRanges[0].value1.toString() === aValues[0].oDate.toString(), true, "getFilterRanges: value1");
		assert.strictEqual(aRanges[0].value2.toString() === aValues[1].oDate.toString(), true, "getFilterRanges: value2");

		/* 			var oSerialized = oDateRangeType.serialize();
					assert.strictEqual(oSerialized.ranges[0].exclude === false, true, "serialize().ranges[0]: exclude");
					assert.strictEqual(oSerialized.ranges[0].keyField === "TestFieldName", true, "serialize().ranges[0]: keyField");
					assert.strictEqual(oSerialized.ranges[0].operation === "BT", true, "serialize().ranges[0]: operation");
					assert.strictEqual(oSerialized.ranges[0].value1 === aValues[0].oDate, true, "serialize().ranges[0]: value1");
					assert.strictEqual(oSerialized.ranges[0].value2 === aValues[1].oDate, true, "serialize().ranges[0]: value1");
					assert.strictEqual(oSerialized.conditionTypeInfo.name === "sap.ui.comp.config.condition.DateRangeType", true, "serialize().conditionTypeInfo: name");
					assert.strictEqual(oSerialized.conditionTypeInfo.data.key === "TestFieldName", true, "serialize().conditionTypeInfo.data: key");
					assert.strictEqual(oSerialized.conditionTypeInfo.data.operation === "DATERANGE", true, "serialize().conditionTypeInfo.data: operation");
					assert.strictEqual(oSerialized.conditionTypeInfo.data.value1 === aValues[0].oDate, true, "serialize().conditionTypeInfo.data: value1");
					assert.strictEqual(oSerialized.conditionTypeInfo.data.value2 === aValues[1].oDate, true, "serialize().conditionTypeInfo.data: value2");
		 */
	});

	QUnit.test("Nullable Integer Type", function (assert) {
		var oType = new NullableInteger();
		assert.strictEqual(oType.parseValue("", "string") === null, true, "Nullable Integer Type, null check");
		assert.strictEqual(oType.parseValue("1", "string") === 1, true, "Nullable Integer Type, 1 check");
		assert.strictEqual(oType.parseValue(1, "int") === 1, true, "Nullable Integer Type, 1 check");
		assert.strictEqual(oType.parseValue("01", "string") === 1, true, "Nullable Integer Type, 01 check");
	});

	QUnit.test("Create Controls", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName");
		oFilterProvider._mConditionTypeFields["foo"] = { conditionType: oDateRangeType };

		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "TODAY", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });

		oDateRangeType.oDateFormat = { UTC: true, style: "short" };
		var oText = DateRangeType.getTextField(oDateRangeType);
		assert.strictEqual(oText.getMetadata().getName() === "sap.m.Text", true, "sap.m.Text created");
		var oBindingInfo = oText.getBindingInfo("text");
		assert.strictEqual(oBindingInfo.type.getMetadata().getName() === "sap.ui.model.type.Date", true, "BindingInfo type sap.ui.model.type.Date");
		assert.strictEqual(oBindingInfo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oBindingInfo.parts[0].path === "value1", true, "BindingInfo path value1");

		//text
		oText = DateRangeType.getTextField(oDateRangeType, true);
		assert.strictEqual(oText.getMetadata().getName() === "sap.m.Text", true, "sap.m.Text created");
		oBindingInfo = oText.getBindingInfo("text");
		assert.strictEqual(oBindingInfo.parts[0].type.sName === "Date", true, "BindingInfo type Date");
		assert.strictEqual(oBindingInfo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oBindingInfo.parts[0].path === "value1", true, "BindingInfo path value1");
		assert.strictEqual(oBindingInfo.parts[1].type.sName === "Date", true, "BindingInfo type Date");
		assert.strictEqual(oBindingInfo.parts[1].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oBindingInfo.parts[1].path === "value2", true, "BindingInfo path value2");

		//int field
		var oIntField = DateRangeType.getIntField(oDateRangeType);
		assert.strictEqual(oIntField.getMetadata().getName() === "sap.m.Input", true, "sap.m.Input created");
		oBindingInfo = oIntField.getBindingInfo("value");
		assert.strictEqual(oBindingInfo.parts[0].type instanceof NullableInteger, true, "BindingInfo type sap.ui.model.type.NullableInteger");
		assert.strictEqual(oBindingInfo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oBindingInfo.parts[0].path === "value1", true, "BindingInfo path value1");

		//[int,int] field
		var aFromToResult = [];
		DateRangeType.getIntFromToField(oDateRangeType, aFromToResult, DateRangeType.Operations.TODAY);
		assert.strictEqual(aFromToResult.length, 4);
		assert.strictEqual(aFromToResult[0].getMetadata().getName() === "sap.m.Label", true, "sap.m.Label created");
		assert.strictEqual(aFromToResult[1].getMetadata().getName() === "sap.m.Input", true, "sap.m.Input created");
		assert.strictEqual(aFromToResult[2].getMetadata().getName() === "sap.m.Label", true, "sap.m.Label created");
		assert.strictEqual(aFromToResult[3].getMetadata().getName() === "sap.m.Input", true, "sap.m.Input created");

		var oFrom = aFromToResult[1].getBindingInfo("value");
		assert.strictEqual(oFrom.parts[0].type instanceof NullableInteger, true, "BindingInfo type sap.ui.model.type.NullableInteger");
		assert.strictEqual(oFrom.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oFrom.parts[0].path === "value1", true, "BindingInfo path value1");

		var oTo = aFromToResult[3].getBindingInfo("value");
		assert.strictEqual(oTo.parts[0].type instanceof NullableInteger, true, "BindingInfo type sap.ui.model.type.NullableInteger");
		assert.strictEqual(oTo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oTo.parts[0].path === "value2", true, "BindingInfo path value2");

		var aResult = [];
		DateRangeType.ControlFactory(oDateRangeType, aResult, DateRangeType.Operations.TODAY);
		assert.strictEqual(aResult[0].getMetadata().getName() === "sap.m.Text", true, "sap.m.Text created");
		aResult = [];
		DateRangeType.ControlFactory(oDateRangeType, aResult, DateRangeType.Operations.LASTDAYS);
		assert.strictEqual(aResult[0].getMetadata().getName() === "sap.m.Input", true, "sap.m.Input created");
	});

	QUnit.test("Test DateRangeType methods", function (assert) {

		var bFired;
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		oFilterProvider._mConditionTypeFields["foo"] = { conditionType: oDateRangeType };

		oFilterProvider._oSmartFilter = {
			fireFilterChange: function () {
				bFired = true;
			},
			getLiveMode: function () {
				return true;
			},
			triggerSearch: function () {

			},
			getId: function () {
				return "filterBarId";
			}
		};
		assert.strictEqual(oDateRangeType.getName() === "sap.ui.comp.config.condition.DateRangeType", true, "getName");
		assert.strictEqual(oDateRangeType.getType() === "Edm.Date", true, "getType");
		assert.strictEqual(oDateRangeType.getTokenText() === "", true, "getTokenText");
		assert.strictEqual(oDateRangeType.getDefaultValues().length === 0, true, "getDefaultValue without operation error");
		assert.strictEqual(oDateRangeType.getControls() === undefined, true, "getDefaultValue without operation error");
		assert.strictEqual(oDateRangeType.getParent() === oFilterProvider._oSmartFilter, true, "getParent");
		assert.strictEqual(oDateRangeType.getDefaultOperation().key === "DATERANGE", true, "getDefaultOperation DATERANGE");

		oDateRangeType.applySettings({ operations: { filter: { path: 'category', contains: 'MONTH', exclude: true } } });
		var aOperations = oDateRangeType.getOperations();
		var bMonthFound = false;
		var i = 0;
		for (i = 0; i < aOperations.length; i++) {
			if (aOperations[i].category.indexOf("MONTH") > -1) {
				bMonthFound = true;
			}
		}
		assert.strictEqual(bMonthFound, false, "applySettings exclude filter category month");
		oDateRangeType.applySettings({ operations: { filter: { path: 'category', contains: 'MONTH', exclude: false } } });
		aOperations = oDateRangeType.getOperations();
		var bNoMonthFound = true;
		for (i = 0; i < aOperations.length; i++) {
			if (aOperations[i].category.indexOf("MONTH") === -1) {
				bNoMonthFound = false;
				break;
			}
		}
		assert.strictEqual(bNoMonthFound, true, "applySettings include filter category month");
		assert.strictEqual(oDateRangeType.getDefaultOperation().key === "LASTMONTHS", true, "getDefaultOperation LASTMONTHS after filter");

		oDateRangeType.applySettings({}); //reset the filter
		assert.strictEqual(Object.keys(DateRangeType.Operations).concat(Object.keys(DateRangeType.NewDynamicDateRangeOperations)).length === oDateRangeType.getOperations().length, true, "applySettings reset and all operations available");
		assert.strictEqual(oDateRangeType.getDefaultOperation().key === "DATERANGE", true, "getDefaultOperation DATERANGE");

		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "TODAY", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "FieldName" }], "items": [] });
		oDateRangeType.initialize({ "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "FieldName" }, { "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "FieldName" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "x", "data": { "operation": "TODAY", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "XX", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.setAsync(true);
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "XX", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		//processes some pendings to get the internal timers cleared once
		oDateRangeType.setPending(true);
		oDateRangeType.setPending(false);
		oDateRangeType.setPending(true); //
		oDateRangeType.setPending(false);
		oDateRangeType.setAsync(false);
		//Islamic month
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "SPECIFICMONTH", "value1": 3, "value2": null, "key": "FieldName", "calendarType": "Islamic" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });

		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "LASTWEEKS", "value1": 3, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "SPECIFICMONTH", "value1": 3, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "FROM", "value1": "", "value2": "2011-01-1T21:59:59.999Z", "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "TO", "value1": "2016-04-28T21:59:59.999Z", "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });

		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "TO", "value1": "2016-04-28T21:59:59.999Z", "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });


		bFired = false;
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "value1": "2016-04-28T21:59:59.999Z", "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oFilterProvider.setPending(false);
		assert.strictEqual(bFired, false, "fireFilterChange should not be called via initialize of DateRangeType");

		var aDefaultValue;
		var oData;
		for (var n in DateRangeType.Operations) {
			aDefaultValue = oDateRangeType.getDefaultValues(DateRangeType.Operations[n]);
			oData = {
				operation: n,
				key: "FieldName",
				value1: aDefaultValue[0],
				value2: aDefaultValue[1]
			};

			oDateRangeType.setCondition(oData);
			if ("value1" in DateRangeType.Operations[n] && oData.value1 === null) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length === 0, true, "No default value1, no range");
			}
			if ("value2" in DateRangeType.Operations[n] && oData.value2 === null) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length === 0, true, "No default value2, no range");
			}
			if ("value1" in DateRangeType.Operations[n] && oData.value1 !== null && !("value2" in DateRangeType.Operations[n])) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "Default value1, leads to range");
			}
			if ("value2" in DateRangeType.Operations[n] && oData.value2 !== null && !("value1" in DateRangeType.Operations[n])) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "Default value2, leads to range");
			}
			if ("value2" in DateRangeType.Operations[n] && oData.value2 !== null && "value1" in DateRangeType.Operations[n] && oData.value1 !== null) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "Default value 1, value2, leads to range");
			}
			if (!("value2" in DateRangeType.Operations[n]) && !("value1" in DateRangeType.Operations[n])) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "No values needed, leads to range");
			}
			if (n === "FROM") {
				oData = {
					operation: n,
					key: "FieldName",
					value1: new UniversalDate(),
					value2: null
				};

				oDateRangeType.setCondition(oData);
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "Default value1, leads to range");
			}
		}

		//translatables
		assert.strictEqual(Type.getTranslatedText({ bundle: "sap.ui.comp", key: "CONDITION_DATERANGETYPE_SINGLE_DAY" }) === oDateRangeType.getTranslatedText("CONDITION_DATERANGETYPE_SINGLE_DAY"), true, "TranslatedText with object bundle");


		assert.strictEqual(Type.getTranslatedText({ bundle: "sap.ui.comp", key: "CONDITION_DATERANGETYPE_SINGLE_DAY" }) === oDateRangeType.getTranslatedText("CONDITION_DATERANGETYPE_SINGLE_DAY"), true, "TranslatedText with object bundle");
		//create an invalid condition
		oData = {
			key: "FieldName",
			value1: aDefaultValue[0],
			value2: aDefaultValue[1]
		};
		oDateRangeType.setCondition(oData);
		assert.strictEqual(oDateRangeType.isValidCondition(), false, "Invalid Condition");
		//
		delete DateRangeType.Operations.LASTWEEKS["value1"];
		DateRangeType.Operations.LASTWEEKS["value2"] = null;
		oData = {
			operation: "LASTWEEKS",
			key: "FieldName",
			value2: 1
		};
		oDateRangeType.setCondition(oData);
		oData = {
			operation: "LASTWEEKS",
			key: "FieldName",
			value2: null
		};
		oDateRangeType.setCondition(oData);
		assert.strictEqual(oDateRangeType.isValidCondition(), false, "Invalid Condition with ony value2");
		DateRangeType.Operations.LASTWEEKS["value1"] = null;
		delete DateRangeType.Operations.LASTWEEKS["value2"];

		// set an valid condition at the end to have consistant state
		oData = {
			operation: "LASTWEEKS",
			key: "FieldName",
			value1: null
		};
		oDateRangeType.setCondition(oData);

	});

	QUnit.test("Test TODAYFROMTO operation with null values", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName", null);
		var getTodayFromToValueFrom = sinon.spy(oDateRangeType, "_getTodayFromToValueFrom");
		var getTodayFromToValueTo = sinon.spy(oDateRangeType, "_getTodayFromToValueTo");
		var defaultValues = oDateRangeType.getDefaultValues(DateRangeType.Operations.TODAYFROMTO);
		oDateRangeType.initialize(
			{
				"ranges": [
					{
						"operation": "TODAYFROMTO",
						"value1": defaultValues[0],
						"value2": defaultValues[1],
						"exclude": false,
						"keyField": "FieldName"
					}
				],
				"items": [

				]
			}
		);
		var oData = {
			operation: "TODAYFROMTO",
			key: "FieldName",
			value1: null,
			value2: null
		};

		oDateRangeType.setCondition(oData);
		oDateRangeType.getFilterRanges();
		assert.equal(getTodayFromToValueFrom.callCount, 0, "getTodayFromToValueFrom should not be called when the value is null");
		assert.equal(getTodayFromToValueTo.callCount, 0, "getTodayFromToValueTo should not be called when the value is null");
	});

	QUnit.test("SPECIFICMONTH operation works correctly when value1 is number", function (assert) {
		// Arrange
		var iMonth = 10;
		var oDateRangeType = new DateRangeType("FieldName", null);
		var oGetConditionStub = this.stub(oDateRangeType, "getCondition").returns({
			key: "FieldName",
			operation: "SPECIFICMONTH",
			value1: iMonth
		});
		var oGetOperationStub = this.stub(oDateRangeType, "getOperation").returns({
			value1: null
		});

		// Act
		var aResult = oDateRangeType.getFilterRanges();

		// Assert
		assert.equal(aResult.length, 1, "Filter Ranges should be calculated");
		assert.equal(aResult[0].value1.getMonth(), iMonth, "start month is correctly set");
		assert.equal(aResult[0].value2.getMonth(), iMonth, "end month is correctly set");

		// Cleanup
		oGetConditionStub.restore();
		oGetOperationStub.restore();
		oDateRangeType.destroy();
	});

	QUnit.test("SPECIFICMONTH operation works correctly when value1 is Date", function (assert) {
		// Arrange
		var iMonth = 10;
		var oDateRangeType = new DateRangeType("FieldName", null);
		var oGetConditionStub = this.stub(oDateRangeType, "getCondition").returns({
			key: "FieldName",
			operation: "SPECIFICMONTH",
			value1: new Date(2021, iMonth, 1),
			value2: new Date(2021, iMonth, 30)
		});
		var oGetOperationStub = this.stub(oDateRangeType, "getOperation").returns({
			value1: null
		});

		// Act
		var aResult = oDateRangeType.getFilterRanges();

		// Assert
		assert.equal(aResult.length, 1, "Filter Ranges should be calculated");
		assert.equal(aResult[0].value1.getMonth(), iMonth, "start month is correctly set");
		assert.equal(aResult[0].value2.getMonth(), iMonth, "end month is correctly set");

		// Cleanup
		oGetConditionStub.restore();
		oGetOperationStub.restore();
		oDateRangeType.destroy();
	});

	QUnit.test("Test Type methods", function (assert) {
		//base type checks
		var oFieldMetadata = { isMandatory: false };
		var oType = new Type("FieldName", oFilterProvider, oFieldMetadata);
		assert.strictEqual(oType.getName() === "sap.ui.comp.config.condition.Type", true, "getName");
		assert.strictEqual(oType.getType() === "Edm", true, "getType");
		assert.strictEqual(oType.getTokenText() === "", true, "getTokenText");
		assert.strictEqual(oType.getControls().length === 0, true, "getControls");
		assert.strictEqual(oType.getOperations().length === 0, true, "getOperations");
		assert.strictEqual(oType.isValidCondition(), false, "No valid condition in base class");
		assert.strictEqual(oType.isValidCondition(), false, "No valid condition in base class");

		var f = function () { };
		oType.attachPendingChange(f);
		assert.strictEqual(oType.hasListeners("PendingChange"), true, "hasListeners for PendingChange");
		oType.detachPendingChange(f);
		assert.strictEqual(oType.hasListeners("PendingChange"), false, "hasListeners no for PendingChange");
		assert.strictEqual(oType.getDefaultOperation() === null, true, "No default operations");
		assert.strictEqual(oType.getFilter() === null, true, "getFilter: No filters");
		assert.strictEqual(oType.getFilterRanges() === null, true, "getFilterRanges: No Ranges");
		assert.strictEqual(oType.validate(false), true, "validate : no force");
		assert.strictEqual(oType.validate(true), true, "validate : force not mandatory");
		oFieldMetadata.isMandatory = true;
		assert.strictEqual(oType.validate(true), false, "validate : force mandatory");
		//push coverage
		oType.updateOperations();
	});

	QUnit.test("Test filterSuggest _fillNumberToText", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName", null);
		var sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", 1, 2);
		assert.strictEqual(sResult, "Test 1 test 2");

		sResult = oDateRangeType._fillNumberToText("Test {0} test", 1, 2);
		assert.strictEqual(sResult, "Test 1 test");

		sResult = oDateRangeType._fillNumberToText("Test {0} test", 1);
		assert.strictEqual(sResult, "Test 1 test");

		sResult = oDateRangeType._fillNumberToText("Test {0} test", 0);
		assert.strictEqual(sResult, "Test 0 test");

		sResult = oDateRangeType._fillNumberToText("Test {0} test", undefined);
		assert.strictEqual(sResult, "Test X test");

		sResult = oDateRangeType._fillNumberToText("Test {0} test", undefined, 2);
		assert.strictEqual(sResult, "Test X test");

		sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", 1, undefined);
		assert.strictEqual(sResult, "Test 1 test Y");

		sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", undefined, undefined);
		assert.strictEqual(sResult, "Test X test Y");

		sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", 1, -1);
		assert.strictEqual(sResult, "Test 1 test (-1)");

		sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", -1, 1);
		assert.strictEqual(sResult, "Test (-1) test 1");

		sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", -1, 0);
		assert.strictEqual(sResult, "Test (-1) test 0");

		sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", 1, 0);
		assert.strictEqual(sResult, "Test 1 test 0");

		sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", 0, -10);
		assert.strictEqual(sResult, "Test 0 test (-10)");

		sResult = oDateRangeType._fillNumberToText("Test {0} test {1}", 0, 10);
		assert.strictEqual(sResult, "Test 0 test 10");
	});

	QUnit.test("Test filterSuggest _createIntFromToControl", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName");
		var oResult = oDateRangeType._createIntFromToControl(oDateRangeType, "suffix", "pathTo");
		var oBiding = oResult.getBindingInfo("value");

		assert.strictEqual(oBiding.parts[0].path, "pathTo");
		assert.strictEqual(oBiding.parts[0].model, "$smartEntityFilter");
		assert.strictEqual(oBiding.parts[0].type.sName, "Integer");
		assert.strictEqual(oResult.getTextAlign(), "End");
		assert.strictEqual(oResult.getWidth(), "100%");
	});

	QUnit.test("Test filterSuggest _setIntControlBinding", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName", null);
		oDateRangeType.updateOperations();
		var oControl = oDateRangeType._createIntFromToControl(oDateRangeType, "suffix", "pathTo");
		oDateRangeType._setIntControlBinding(oControl, oDateRangeType.getOperation("TODAYFROMTO"), "test");
		var oDescription = oControl.getBindingInfo("description");
		assert.strictEqual(oControl.getFieldWidth(), "auto");
		assert.strictEqual(oDescription.parts[0].type.getMetadata().getName(), "sap.ui.model.type.Integer");
		assert.strictEqual(oDescription.parts[0].path, "test");
		assert.strictEqual(oDescription.parts[0].model, "$smartEntityFilter");
	});

	QUnit.test("Test Semantic Dates ", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName", null);
		oDateRangeType.initialize(
			{
				"ranges": [
					{
						"operation": "BT",
						"value1": "2020-06-30T21:00:00.000Z",
						"value2": "2020-07-09T21:00:00.000Z",
						"exclude": false,
						"keyField": "FieldName",
						"semantic": {
							"calendarType": "Gregorian",
							"key": "BUDAT_ST",
							"operation": "DATERANGE",
							"value1": null,
							"value2": null
						}
					}
				],
				"items": [

				]
			}
		);
		var oResult = oDateRangeType.getCondition();
		assert.strictEqual(oResult.value1.toJSON(), new Date("2020-06-30T21:00:00.000Z").toJSON(), "Check null semantic value1");
		assert.strictEqual(oResult.value2.toJSON(), new Date("2020-07-09T21:00:00.000Z").toJSON(), "Check null semantic value2");
		oDateRangeType.initialize(
			{
				"ranges": [
					{
						"operation": "BT",
						"value1": "2020-07-20T21:00:00.000Z",
						"value2": "2020-07-21T20:59:59.999Z",
						"exclude": false,
						"keyField": "FieldName",
						"semantic": {
							"operation": "TODAYFROMTO",
							"value1": 0,
							"value2": 5,
							"key": "BUDAT_ST",
							"calendarType": "Gregorian"
						}
					}
				],
				"items": [

				]
			}
		);
		var oResult = oDateRangeType.getCondition();
		assert.strictEqual(oResult.value1, 0, "Check semantic value1");
		assert.strictEqual(oResult.value2, 5, "Check semantic value2");

		oDateRangeType.initialize(
			{"ranges":[
				  {
					 "operation":"BT",
					 "value1":"2020-07-20T21:00:00.000Z",
					 "value2":"2020-07-21T20:59:59.999Z",
					 "exclude":false,
					 "keyField":"FieldName",
					 "semantic":{
						"operation":"TEST",
						"value1":null,
						"value2":null,
						"key":"BUDAT_ST",
						"calendarType":"Gregorian"
					}
				  }
			   ],
			   "items":[]
			}
		 );

		assert.strictEqual(oDateRangeType.getCondition().operation, "DATERANGE", "Operation is set to DATERANGE when semanticDate operation is not in the list");
		assert.strictEqual(oDateRangeType._customSemanticOperation, "TEST", "Operation is set to TEST when semanticDate operation is not in the list");

		// Cleanup
		oDateRangeType.destroy();
	});

	QUnit.test("Test Custom Semantic Dates ", function (assert) {


		var oDateRangeType = new DateRangeType("FieldName", null);

		oDateRangeType.initialize(
			{"ranges":[
					{
						"operation":"BT",
						"value1":"2020-07-20T21:00:00.000Z",
						"value2":"2020-07-21T20:59:59.999Z",
						"exclude":false,
						"keyField":"FieldName",
						"semantic":{
							"operation":"TEST",
							"value1":null,
							"value2":null,
							"key":"BUDAT_ST",
							"calendarType":"Gregorian"
						}
					}
				],
				"items":[]
			}
		);

		assert.strictEqual(oDateRangeType.getCondition().operation, "DATERANGE", "Operation is set to DATERANGE when semanticDate operation is not in the list");
		assert.strictEqual(oDateRangeType._customSemanticOperation, "TEST", "Operation is set to TEST when semanticDate operation is not in the list");

		var aOperations = oDateRangeType.getOperations();
		var oCustomOperation = DateRangeType.getFixedRangeOperation(
			"TEST",
			{
				key: "TEST_TEXT_KEY",
				bundle: "sap.ui.comp"
			},
			"CATEGORY",
			[]);
		aOperations.push(oCustomOperation);
		var oGetOperations = this.stub(oDateRangeType, "getOperations").returns(aOperations);

		oDateRangeType.updateOperations();
		assert.strictEqual(oDateRangeType.getCondition().operation, "TEST", "Operation is set to TEST when semanticDate operation is not in the list");

		// Cleanup
		oDateRangeType.destroy();
		oGetOperations.restore();
	});

	QUnit.test("Test getDefaultOperation with no config options provided", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);

		// Act
		var oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "DATERANGE", "defaultOperation is DATERANGE");

		// Cleanup
		oDateRangeType.destroy();
	});

	QUnit.test("Test getDefaultOperation with values", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);

		// Act
		var oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "DATERANGE", "defaultOperation is DATERANGE");

		// Cleanup
		oDateRangeType.destroy();
	});

	QUnit.test("Test getDefaultOperation when there are more operations with defaultOperation property set to true", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		var oGetOperations = this.stub(oDateRangeType, "getOperations").returns([{
			key: "op1"
		}, {
			key: "op2",
			defaultOperation: true
		}, {
			key: "op3",
			defaultOperation: true
		}]);

		// Act
		var oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "op2", "defaultOperation is set to the first found with 'defaultOperation' property set");

		// Cleanup
		oDateRangeType.destroy();
		oGetOperations.restore();
	});

	QUnit.test("Test getDefaultOperation when there is no operation with defaultOperation property set to true", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		var oGetOperations = this.stub(oDateRangeType, "getOperations").returns([{
			key: "op1"
		}, {
			key: "op2"
		}, {
			key: "op3"
		}]);

		// Act
		var oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "op1", "defaultOperation is the first one in the list 'op1'");

		// Cleanup
		oDateRangeType.destroy();
		oGetOperations.restore();
	});

	QUnit.test("Test getDefaultOperation when defaultOperation is set in XML view", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		oDateRangeType.applySettings({ defaultOperation: "FROM" });

		// Act
		var oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "FROM", "defaultOperation is the first one in the list 'FROM'");

		// Cleanup
		oDateRangeType.destroy();
	});

	QUnit.test("Test getDefaultOperation when defaultOperation with values is set in XML view", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		oDateRangeType.applySettings({ defaultOperation: 'TODAYFROMTO', values:[7] });

		// Act
		oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "TODAYFROMTO", "defaultOperation is the first one in the list 'TODAYFROMTO'");
		assert.equal(oResult.defaultValues[0], 7, "defaultOperation value1 is 7");
		assert.equal(oResult.defaultValues[1], 1, "defaultOperation value2 is 1");

		// Cleanup
		oDateRangeType.destroy();

		// Arrange
		oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		oDateRangeType.applySettings({ defaultOperation: 'TODAYFROMTO', values:[5, 6] });

		// Act
		var oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "TODAYFROMTO", "defaultOperation is the first one in the list 'TODAYFROMTO'");
		assert.equal(oResult.defaultValues[0], 5, "defaultOperation value1 is 5");
		assert.equal(oResult.defaultValues[1], 6, "defaultOperation value2 is 6");


		// Cleanup
		oDateRangeType.destroy();

		// Arrange
		oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		oDateRangeType.applySettings({ defaultOperation: 'LASTDAYS', values:[8] });

		// Act
		oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "LASTDAYS", "defaultOperation is the first one in the list 'LASTDAYS'");
		assert.equal(oResult.defaultValues[0], 8, "defaultOperation value1 is 8");

		// Cleanup
		oDateRangeType.destroy();

		// Arrange
		oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		oDateRangeType.applySettings({ defaultOperation: 'LASTDAYS', values:[2, 3] });

		// Act
		oResult = oDateRangeType.getDefaultOperation();

		// Assert
		assert.equal(oResult.key, "LASTDAYS", "defaultOperation is the first one in the list 'LASTDAYS'");
		assert.equal(oResult.defaultValues[0], 2, "defaultOperation value1 is 2");

		// Cleanup
		oDateRangeType.destroy();
	});

	QUnit.test("_prepareDDRValues should not convert SPECIFICMONTH option to date", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("field", oFilterProvider);

		var aResult = oDateRangeType._prepareDDRValues({}, { values: [1] }, "SPECIFICMONTH");

		assert.deepEqual(aResult, [1], "Month value should not be modified to Date object");
	});

	QUnit.test("_getInputValueState should return valueState of the inner control", function (assert) {
		// Arrange
		var oDateRangeTypeWithError = new DateRangeType("FieldWithError, oFilterProvider");
		var oDateRangeTypeNoError = new DateRangeType("FieldNoError, oFilterProvider");
		oDateRangeTypeWithError._oInput = { getValueState: this.stub().returns("Error") };
		oDateRangeTypeNoError._oInput = { getValueState: this.stub().returns("None") };

		// Act & Assert
		assert.equal(oDateRangeTypeWithError._getInputValueState(), "Error", "inner input should be in error state");
		assert.equal(oDateRangeTypeNoError._getInputValueState(), "None", "inner input should be in non error state");
	});

	QUnit.test("_updatProvider should not throw exception when Edm.String field is used with no IsCalendarDate annotation", function (assert) {
		// Arrange
		var oFilterProvider = new FilterProvider({ entityType: "foo", model: oModel });
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		var oGetFilterRangesStub = this.stub(oDateRangeType, "getFilterRanges").returns([{
				"operation": "BT",
				"value1": new Date(2023, 1, 1),
				"value2": new Date(2023, 1, 10),
				"exclude": false,
				"keyField": "FieldName"
			}]);

		oDateRangeType.oFieldMetadata = {
			type: "Edm.String",
			ui5Type: oFilterProvider._getType({
				type: "Edm.String",
				filterType: "string",
				isCalendarDate: false
			})
		};

		// Act
		oDateRangeType._updateProvider({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "THISWEEK",
					"value1": null,
					"value2": null,
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			}
		});

		// Assert
		var oResult = oFilterProvider.getFilterData().FieldName.ranges[0];
		assert.ok(true, 0, "no exception thrown");
		assert.equal(oResult.value1, "20230201", "value1 should be 1 of february 2023 in stringdate's format (yyyyMMdd)");
		assert.equal(oResult.value2, "20230210", "value2 should be 10 of february 2023 in stringdate's format (yyyyMMdd)");

		// Cleanup
		oDateRangeType.destroy();
		oGetFilterRangesStub.restore();
	});

	QUnit.test("_updatProvider should not convert int values to dates when Edm.String is used with IsCalendarDate annotation", function (assert) {
		// Arrange
		var oFilterProvider = new FilterProvider({ entityType: "foo", model: oModel });
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		var oGetFilterRangesStub = this.stub(oDateRangeType, "getFilterRanges").returns([{
			"operation": "BT",
			"value1": new Date(2023, 1, 1),
			"value2": new Date(2023, 1, 10),
			"exclude": false,
			"keyField": "FieldName"
		}]);
		oDateRangeType.oModel.setData({
			currentoperation: {
				name: "LASTDAYS",
				type: "int"
			}
		});

		oDateRangeType.oFieldMetadata = {
			type: "Edm.String",
			ui5Type: oFilterProvider._getType({
				type: "Edm.String",
				filterType: "string",
				isCalendarDate: true
			})
		};

		// Act
		oDateRangeType._updateProvider({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "LASTDAYS",
					"value1": 3,
					"value2": null,
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			}
		});

		// Assert
		var oResult = oFilterProvider.getFilterData().FieldName.conditionTypeInfo.data;
		assert.equal(oResult.value1, 3, "value1 should be 3");
		assert.equal(oResult.value2, null, "value2 should be  null");

		// Cleanup
		oDateRangeType.destroy();
		oGetFilterRangesStub.restore();
	});

	QUnit.test("_clearModelInputState should set the Model inputstate to NONE if data is valid on _updateProvider invoke", function (assert) {
		// Arrange
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider),
			sInputState;

		oDateRangeType.getModel().setData({
			currentoperation: {
				category: "FIXED.DATE",
				textValue: "6/4/24"
			},
			inputstate: "ERROR"
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "ERROR", "inputstate is reset to ERROR");

		// Act
		oDateRangeType._updateProvider({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "YESTERDAY",
					"value1": null,
					"value2": null,
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			}
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "NONE", "data is valid and inputstate is NONE");

		// Arrange
		oDateRangeType.getModel().setData({
			currentoperation: {
				category: "DYNAMIC.DATE.INT",
				type: "[int,int]",
				textValue: ""
			},
			inputstate: "ERROR"
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "ERROR", "inputstate is reset to ERROR");

		// Act
		oDateRangeType._updateProvider({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "TODAYFROMTO",
					"value1": 1,
					"value2": 1,
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			}
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "NONE", "data is valid and inputstate is NONE");

		// Arrange
		oDateRangeType.getModel().setData({
			currentoperation: {
				category: "DYNAMIC.MINUTE.INT",
				type: "int",
				textValue: ""
			},
			inputstate: "ERROR"
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "ERROR", "inputstate is reset to ERROR");

		// Act
		oDateRangeType._updateProvider({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "LASTMINUTES",
					"value1": 1,
					"value2": null,
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			}
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "NONE", "data is valid and inputstate is NONE");

		// Arrange
		oDateRangeType.getModel().setData({
			currentoperation: {
				category: "FIXED.YEAR",
				type: "range",
				textValue: "1/1/24 - 6/5/24"
			},
			inputstate: "ERROR"
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "ERROR", "inputstate is reset to ERROR");

		// Act
		oDateRangeType._updateProvider({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "YEARTODATE",
					"value1": null,
					"value2": null,
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			}
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "NONE", "data is valid and inputstate is NONE");

		// Arrange
		oDateRangeType.getModel().setData({
			currentoperation: {
				category: "DYNAMIC.DATERANGE",
				textValue: "1/1/24 - 6/5/24"
			},
			inputstate: "ERROR"
		});
		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "ERROR", "inputstate is reset to ERROR");

		// Act
		oDateRangeType._updateProvider({
			"conditionTypeInfo": {
				"name": "sap.ui.comp.config.condition.DateRangeType",
				"data": {
					"operation": "DATERANGE",
					"value1": "Mon Jun 03 2024 00:00:00 GMT+0300 (Eastern European Summer Time)",
					"value2": "Thu Jun 13 2024 23:59:59 GMT+0300 (Eastern European Summer Time)",
					"key": "FieldName",
					"calendarType": "Gregorian"
				}
			}
		});

		// Assert
		sInputState = oDateRangeType.getModel().getData().inputstate;
		assert.equal(sInputState, "NONE", "data is valid and inputstate is NONE");

		// Cleanup
		oDateRangeType.destroy();
		// oGetFilterRangesStub.restore();
	});

	QUnit.test("THISWEEK should pass 'Default' parameter to UniversalDateUtils currentWeek", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "currentWeek");

		// Act
		DateRangeType.Operations.THISWEEK.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "currentWeek should be called once");
		assert.ok(oSpy.getCall(0).args[0], "Default", "currentWeek should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("LASTWEEK should pass 'Default' parameter to UniversalDateUtils lastWeek", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "lastWeek");

		// Act
		DateRangeType.Operations.LASTWEEK.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "lastWeek should be called once");
		assert.ok(oSpy.getCall(0).args[0], "Default", "lastWeek should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("LAST2WEEKS should pass 'Default' parameter to UniversalDateUtils lastWeeks", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "lastWeeks");

		// Act
		DateRangeType.Operations.LAST2WEEKS.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "lastWeeks should be called once");
		assert.ok(oSpy.getCall(0).args[1], "Default", "lastWeeks should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("LAST3WEEKS should pass 'Default' parameter to UniversalDateUtils lastWeeks", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "lastWeeks");

		// Act
		DateRangeType.Operations.LAST3WEEKS.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "lastWeeks should be called once");
		assert.ok(oSpy.getCall(0).args[1], "Default", "lastWeeks should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("LAST4WEEKS should pass 'Default' parameter to UniversalDateUtils lastWeeks", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "lastWeeks");

		// Act
		DateRangeType.Operations.LAST4WEEKS.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "lastWeeks should be called once");
		assert.ok(oSpy.getCall(0).args[1], "Default", "lastWeeks should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("LAST5WEEKS should pass 'Default' parameter to UniversalDateUtils lastWeeks", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "lastWeeks");

		// Act
		DateRangeType.Operations.LAST5WEEKS.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "lastWeeks should be called once");
		assert.ok(oSpy.getCall(0).args[1], "Default", "lastWeeks should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("NEXTWEEK should pass 'Default' parameter to UniversalDateUtils nextWeek", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "nextWeek");

		// Act
		DateRangeType.Operations.NEXTWEEK.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "nextWeek should be called once");
		assert.ok(oSpy.getCall(0).args[0], "Default", "nextWeek should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("NEXT2WEEKS should pass 'Default' parameter to UniversalDateUtils nextWeeks", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "nextWeeks");

		// Act
		DateRangeType.Operations.NEXT2WEEKS.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "nextWeeks should be called once");
		assert.ok(oSpy.getCall(0).args[1], "Default", "lastWeeks should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("NEXT3WEEKS should pass 'Default' parameter to UniversalDateUtils nextWeeks", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "nextWeeks");

		// Act
		DateRangeType.Operations.NEXT3WEEKS.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "nextWeeks should be called once");
		assert.ok(oSpy.getCall(0).args[1], "Default", "lastWeeks should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("NEXT5WEEKS should pass 'Default' parameter to UniversalDateUtils nextWeeks", function (assert) {
		// Arrange
		var oSpy = this.spy(UniversalDateUtils.ranges, "nextWeeks");

		// Act
		DateRangeType.Operations.NEXT5WEEKS.defaultValues();

		// Assert
		assert.ok(oSpy.callCount, 1, "nextWeeks should be called once");
		assert.ok(oSpy.getCall(0).args[1], "Default", "lastWeeks should be called with 'Default' as parameter");

		// Cleanup
		oSpy.restore();
	});
});

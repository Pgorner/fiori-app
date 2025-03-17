/* global QUnit, sinon */
sap.ui.define([
	'sap/ui/comp/library',
	'sap/ui/comp/personalization/Validator',
	"sap/ui/core/Lib"
], function(compLibrary, Validator, Library) {
	'use strict';

	QUnit.module("sap.ui.comp.personalization.Validator: checkGroupAndColumns", {
		beforeEach: function() {
			this.oGroupControllerStub = sinon.stub();
			this.oColumnsControllerStub = sinon.stub();
			this.oSetting = {
				group: {
					controller: this.oGroupControllerStub
				},
				columns: {
					controller: this.oColumnsControllerStub
				}
			};
			this.oColumnKey2ColumnMap = {
				country: {},
				name: {}
			};
			this.oPersistentDataTotal = {
				columns: {},
				group: {}
			};
		},
		afterEach: function() {
		}
	});

	QUnit.test("with sap.ui.table.Table", function(assert) {
		var done = assert.async();
		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.Table, this.oSetting, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, []);
			done();
		});
	});

	QUnit.test("with sap.ui.table.AnalyticalTable: group and column selected", function(assert) {
		this.oGroupControllerStub.isGroupSelected = sinon.stub().returns(true);
		this.oColumnsControllerStub.isColumnSelected = sinon.stub().returns(true);
		var done = assert.async();

		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.AnalyticalTable, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, []);
			done();
		});
	});

	QUnit.test("with sap.ui.table.AnalyticalTable: group and column not selected", function(assert) {
		this.oGroupControllerStub.isGroupSelected = sinon.stub().returns(false);
		this.oColumnsControllerStub.isColumnSelected = sinon.stub().returns(false);
		var done = assert.async();

		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.AnalyticalTable, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, []);
			done();
		});
	});

	QUnit.test("with sap.ui.table.AnalyticalTable: group not selected and column selected", function(assert) {
		this.oGroupControllerStub.isGroupSelected = sinon.stub().returns(false);
		this.oColumnsControllerStub.isColumnSelected = sinon.stub().returns(true);
		var done = assert.async();

		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.AnalyticalTable, this.oSetting, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, []);
			done();
		});
	});

	QUnit.test("with sap.ui.table.AnalyticalTable: group selected and column not selected", function(assert) {
		this.oGroupControllerStub.isGroupSelected = sinon.stub().returns(true);
		this.oColumnsControllerStub.isColumnSelected = sinon.stub().returns(false);
		var done = assert.async();

		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.AnalyticalTable, this.oSetting, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, [
				{
					columnKey: "country",
					messageText: Library.getResourceBundleFor("sap.ui.comp").getText("PERSODIALOG_MSG_GROUPING_NOT_POSSIBLE_DESCRIPTION"),
					messageType: "Warning",
					panelTypes: [
						"group", "columns"
					]
				}, {
					columnKey: "name",
					messageText: Library.getResourceBundleFor("sap.ui.comp").getText("PERSODIALOG_MSG_GROUPING_NOT_POSSIBLE_DESCRIPTION"),
					messageType: "Warning",
					panelTypes: [
						"group", "columns"
					]
				}
			]);
			done();
		});
	});

	QUnit.test("Test 'visibleItemsThreshold' validation (no threshold provided) --> no warning", function(assert) {

		var oSetting = {};
		var sTableType; //Currently the table type is not relevant
		var oControlDataReduce = {
			columns: {
				columnsItems: [
					{columnKey: "a", visible: true},
					{columnKey: "b", visible: true},
					{columnKey: "c", visible: true},
					{columnKey: "d", visible: true},
					{columnKey: "e", visible: true},
					{columnKey: "f", visible: false},
					{columnKey: "g", visible: false},
					{columnKey: "h", visible: false},
					{columnKey: "i", visible: false}
				]
			}
		};

		var aResult = [];

		return Validator.checkVisibleItemsThreshold(sTableType, oSetting, oControlDataReduce, aResult)
		.then(function(){

			assert.equal(aResult.length, 0, "Validation successfull without warnings");
		});
	});

	QUnit.test("Test 'visibleItemsThreshold' validation (no threshold provided) --> no warning", function(assert) {

		var oSetting = {
			columns: {
				payload: {
					visibleItemsThreshold: 7
				}
			}
		};
		var sTableType; //Currently the table type is not relevant
		var oControlDataReduce = {
			columns: {
				columnsItems: [
					{columnKey: "a", visible: true},
					{columnKey: "b", visible: true},
					{columnKey: "c", visible: true},
					{columnKey: "d", visible: true},
					{columnKey: "e", visible: true},
					{columnKey: "f", visible: false},
					{columnKey: "g", visible: false},
					{columnKey: "h", visible: false},
					{columnKey: "i", visible: false}
				]
			}
		};

		var aResult = [];

		return Validator.checkVisibleItemsThreshold(sTableType, oSetting, oControlDataReduce, aResult)
		.then(function(){

			assert.equal(aResult.length, 0, "Validation successfull without warnings, as the threshold is not yet reached");
		});
	});

	QUnit.test("Test 'visibleItemsThreshold' validation (no threshold provided) --> no warning", function(assert) {

		var oSetting = {
			columns: {
				payload: {
					visibleItemsThreshold: 2
				}
			}
		};
		var sTableType; //Currently the table type is not relevant
		var oControlDataReduce = {
			columns: {
				columnsItems: [
					{columnKey: "a", visible: true},
					{columnKey: "b", visible: true},
					{columnKey: "c", visible: true},
					{columnKey: "d", visible: true},
					{columnKey: "e", visible: true},
					{columnKey: "f", visible: false},
					{columnKey: "g", visible: false},
					{columnKey: "h", visible: false},
					{columnKey: "i", visible: false}
				]
			}
		};

		var aResult = [];

		return Validator.checkVisibleItemsThreshold(sTableType, oSetting, oControlDataReduce, aResult)
		.then(function(){

			assert.equal(aResult.length, 1, "Validation results in warning, as the threshold is reached");
			assert.equal(aResult[0].panelTypes.length, 1, "Only one panel affected");
			assert.equal(aResult[0].panelTypes[0], "columns", "The columns panel is affected");
			assert.equal(aResult[0].messageType, "Warning", "Warning as message type");
			assert.equal(aResult[0].messageText, Library.getResourceBundleFor("sap.ui.comp").getText("SMARTTABLE_P13N_VISIBLE_ITEMS_THRESHOLD_MESSAGE"), "Warning as message type");

		});
	});
});
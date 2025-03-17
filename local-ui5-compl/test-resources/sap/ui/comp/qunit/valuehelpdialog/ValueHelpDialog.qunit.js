/* global QUnit sinon */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/qunit/QUnitUtils",
	'sap/ui/comp/library',
	'sap/ui/comp/valuehelpdialog/ValueHelpDialog',
	'sap/ui/model/json/JSONModel',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/Token',
	'sap/ui/comp/smartfilterbar/SmartFilterBar',
	'sap/ui/Device',
	'sap/m/SearchField',
	'sap/ui/model/type/Date',
	'sap/ui/base/Event',
	'sap/m/P13nFilterPanel',
	'sap/ui/mdc/valuehelp/CollectiveSearchSelect',
	'sap/ui/model/type/String',
	"sap/ui/core/Core",
	"sap/ui/core/theming/Parameters",
	'sap/ui/core/library',
	'sap/m/library',
	"sap/ui/qunit/utils/nextUIUpdate",
	'sap/ui/table/TreeTable',
	'sap/m/Text',
	'sap/m/ToolbarSpacer',
	'sap/m/Button',
	'sap/m/Toolbar',
	'sap/ui/table/Column',
	"sap/ui/core/IconPool"
], function(UI5Element, qutils, library, ValueHelpDialog, JSONModel, ColumnListItem, Label, Token, SmartFilterBar, Device, SearchField, typeDate, Event, P13nFilterPanel, CollectiveSearchSelect, typeString, Core, ThemeParameters, coreLibrary, mLibrary, nextUIUpdate, TreeTable, Text, ToolbarSpacer, Button, Toolbar, Column, IconPool) {
	"use strict";

	// shortcut for sap.ui.core.TitleLevel
	var TitleLevel = coreLibrary.TitleLevel;

	function _InitRows (oValueHelpDialog) {

		var oColModel = new JSONModel();
		oColModel.setData({
			cols: [{
				label: "Company Code",
				template: "CompanyCode"
			}, {
				label: "Company Name",
				template: "CompanyName"
			}, {
				label: "City",
				template: "City"
			}, {
				label: "Currency Code",
				template: "CurrencyCode"
			}, {
				label: "Date",
				template: "Date",
				type: "date",
				oType: new typeDate()
			}, {
				label: "Boolean",
				template: "BoolCode",
				type: "boolean"
			}]
		});
		oValueHelpDialog.setModel(oColModel, "columns");

		var aItems = [{
			CompanyCode: "0001",
			CompanyName: "SAP A.G.",
			City: "Walldorf",
			CurrencyCode: "EUR",
			BoolCode: true
		}, {
			CompanyCode: "0002",
			CompanyName: "SAP Labs India",
			City: "Bangalore",
			CurrencyCode: "INR",
			BoolCode: true
		}, {
			CompanyCode: "0003",
			CompanyName: "SAP China LAB",
			City: "Beijing",
			CurrencyCode: "CNY",
			BoolCode: false
		}, {
			CompanyCode: "0099",
			CompanyName: "SAP0",
			City: "Berlin",
			CurrencyCode: "EUR",
			BoolCode: true
		}, {
			CompanyCode: "0100",
			CompanyName: "SAP1",
			City: "Berlin",
			CurrencyCode: "EUR",
			Date: new Date()
		}, {
			CompanyCode: "0101",
			CompanyName: "SAP2",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0102",
			CompanyName: "SAP3",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0103",
			CompanyName: "SAP4",
			City: "Berlin",
			CurrencyCode: "EUR",
			Date: new Date()
		}, {
			CompanyCode: "0104",
			CompanyName: "SAP5",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0105",
			CompanyName: "SAP6",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0106",
			CompanyName: "SAP7",
			City: "Berlin",
			CurrencyCode: "EUR",
			Date: new Date()
		}, {
			CompanyCode: "0107",
			CompanyName: "SAP8",
			City: "Berlin",
			CurrencyCode: "EUR",
			Date: new Date()
		}, {
			CompanyCode: "0108",
			CompanyName: "SAP9",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0109",
			CompanyName: "SAP10",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0110",
			CompanyName: "SAP11",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0111",
			CompanyName: "SAP12",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0112",
			CompanyName: "SAP13",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0113",
			CompanyName: "SAP14",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0114",
			CompanyName: "SAP15",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0115",
			CompanyName: "SAP16",
			City: "Berlin",
			CurrencyCode: "EUR"
		}];

		var oRowsModel = new JSONModel();
		oRowsModel.setData(aItems);
		oValueHelpDialog.setModel(oRowsModel);

		oValueHelpDialog.getTableAsync().then(function(oTable){
			if (oTable.bindRows) {
				oTable.bindRows("/");
			}
			if (oTable.bindItems) {
				oTable.bindAggregation("items", "/", function (sId, oContext) {
					var aCols = oTable.getModel("columns").getData().cols;

					return new ColumnListItem({
						cells: aCols.map(function (column) {
							var colname = column.template;
							return new Label({
								text: "{" + colname + "}"
							});
						})
					});
				});
			}
		});

	}

	function _InitToken (oValueHelpDialog) {
		var token1 = new Token({
			key: "0001",
			text: "SAP A.G. (0001)"
		});
		var token2 = new Token({
			key: "0002",
			text: "SAP Labs India (0002)"
		});
		var rangeToken1 = new Token({
			key: "i1",
			text: "CompanyCode a..z"
		}).data("range", {
			"exclude": false,
			"operation": library.valuehelpdialog.ValueHelpRangeOperation.BT,
			"keyField": "CompanyCode",
			"value1": "a",
			"value2": "z"
		});
		var rangeToken2 = new Token({
			key: "i2",
			text: "CompanyCode ==foo"
		}).data("range", {
			"exclude": false,
			"operation": library.valuehelpdialog.ValueHelpRangeOperation.EQ,
			"keyField": "CompanyCode",
			"value1": "foo",
			"value2": ""
		});
		var rangeToken3 = new Token({
			key: "e1",
			text: "CompanyCode !(==foo)"
		}).data("range", {
			"exclude": true,
			"operation": library.valuehelpdialog.ValueHelpRangeOperation.EQ,
			"keyField": "CompanyCode",
			"value1": "foo",
			"value2": ""
		});
		var aTokens = [token1, token2, rangeToken1, rangeToken2, rangeToken3];

		oValueHelpDialog.setTokens(aTokens);
	}

	QUnit.module("Testing Public API", {
		beforeEach: function () {
			this.oValueHelpDialog = new ValueHelpDialog("VHD");
		},
		afterEach: function () {
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
		}
	});

	QUnit.test("Test sap.ui.table library is loaded", function (qUnit) {
		qUnit.ok(sap.ui.require("sap/ui/table/library"), "sap.ui.table library is loaded");
	});

	QUnit.test("Test open with supportRangesOnly", function (qUnit) {
		this.oValueHelpDialog.setSupportRangesOnly(true);
		qUnit.equal(this.oValueHelpDialog.getSupportRangesOnly(), true, "SupportRangesOnly should be true");
	});

	QUnit.test("Test open with filterMode", function (qUnit) {
		this.oValueHelpDialog.setFilterMode(true);
		qUnit.equal(this.oValueHelpDialog.getFilterMode(), true, "FilterMode should be true");
	});

	QUnit.test("Check Title", function (qUnit) {
		this.oValueHelpDialog.setTitle("foo");
		qUnit.equal(this.oValueHelpDialog.getTitle(), "foo", "title should be foo");
	});

	QUnit.test("_initializeTable uses column width from model property width", function (assert) {
		// Arrange
		var oColumnModel = new JSONModel({
				cols: [{
					template: "prop",
					label: "Test Column",
					width: "6.61rem"
				}, {
					template: "prop2",
					label: "Test Column Long",
					width: "9.11rem"
				}]
			}),
			done = assert.async();

		this.oValueHelpDialog.setModel(oColumnModel, "columns");
		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			// Assert
			var aColumns = oTable.getColumns();
			assert.equal(aColumns[0].getWidth(), "6.61rem", "Column width should be correctly set from model");
			assert.equal(aColumns[1].getWidth(), "9.11rem", "Column width should be correctly set from model");

			done();
		});
	});

	QUnit.test("Check basicSearchText", function (qUnit) {
		var oFilterbar = new SmartFilterBar({
			advancedMode: true
		});

		// basic search text before the filterbar exist
		this.oValueHelpDialog.setBasicSearchText("bar");
		qUnit.equal(this.oValueHelpDialog.getBasicSearchText(), "bar", "basicSearchText should be bar");

		oFilterbar.setBasicSearch(new SearchField());
		this.oValueHelpDialog.setFilterBar(oFilterbar);

		// update the search text
		this.oValueHelpDialog.setBasicSearchText("foo");
		qUnit.equal(this.oValueHelpDialog.getBasicSearchText(), "foo", "basicSearchText should be foo");
	});

	QUnit.test("Check supportMultiselect", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getSupportMultiselect(), true, "Default for supportMultiselect should be true");
		this.oValueHelpDialog.setSupportMultiselect(false);
		qUnit.equal(this.oValueHelpDialog.getSupportMultiselect(), false, "supportMultiselect should be false");
	});

	QUnit.test("Check when supportMultiselect is true, selection mode of table should be RowSelector", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable) {
			qUnit.strictEqual(oTable.getSelectionBehavior(), 'RowSelector', "Table SelectionBehavior is RowSelector by default");
			fnDone();
		});
	});

	QUnit.test("Check when supportMultiselect is false, selection mode of table should be RowOnly", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.setSupportMultiselect(false);
		this.oValueHelpDialog.getTableAsync().then(function(oTable) {
			qUnit.strictEqual(oTable.getSelectionBehavior(), 'RowOnly', "Table SelectionBehavior is RowOnly");
			fnDone();
		});
	});

	QUnit.test("Check supportRanges", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getSupportRanges(), false, "Default for supportRanges should be false");
		this.oValueHelpDialog.setSupportRanges(true);
		qUnit.equal(this.oValueHelpDialog.getSupportRanges(), true, "supportRanges should be true");
	});

	QUnit.test("Check supportRangesOnly", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getSupportRangesOnly(), false, "Default for supportRangesOnly should be false");
		this.oValueHelpDialog.setSupportRangesOnly(true);
		qUnit.equal(this.oValueHelpDialog.getSupportRangesOnly(), true, "supportRangesOnly should be true");
	});

	QUnit.test("test set/get Key", function (qUnit) {
		this.oValueHelpDialog.setKey("CompanyCode");
		qUnit.equal(this.oValueHelpDialog.getKey(), "CompanyCode", "the key should be CompanyCode");
	});

	QUnit.test("test set/get descriptionKey", function (qUnit) {
		this.oValueHelpDialog.setDescriptionKey("CompanyName");
		qUnit.equal(this.oValueHelpDialog.getDescriptionKey(), "CompanyName", "the descriptionKey should be CompanyName");
	});

	QUnit.test("test set/get Keys", function (qUnit) {
		this.oValueHelpDialog.setKeys(["CompanyCode"]);
		qUnit.equal(this.oValueHelpDialog.getKeys().length, 1, "the keys array should contain one entry");
	});

	QUnit.test("test set/get RangeKeyFields", function (qUnit) {
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		qUnit.equal(this.oValueHelpDialog.getRangeKeyFields().length, 2, "the RangeKeyFields array should contain two entries");
	});

	QUnit.test("test set/IncludeExcludeOperations", function (qUnit) {
		this.oValueHelpDialog.setIncludeRangeOperations([library.valuehelpdialog.ValueHelpRangeOperation.EQ, library.valuehelpdialog.ValueHelpRangeOperation.LT], "string");
		this.oValueHelpDialog.setExcludeRangeOperations([library.valuehelpdialog.ValueHelpRangeOperation.EQ], "date");

		qUnit.equal(this.oValueHelpDialog._aIncludeRangeOperations["string"].length, 2, "the IncludeRangeOperation should contain 2 items");
		qUnit.equal(this.oValueHelpDialog._aExcludeRangeOperations["date"].length, 1, "the ExcludeRangeOperation should contain 1 item");
		qUnit.equal(this.oValueHelpDialog._aExcludeRangeOperations["date"][0], "Not" + library.valuehelpdialog.ValueHelpRangeOperation.EQ, "the ExcludeRangeOperation should should be prefixed with 'Not'");
	});

	QUnit.test("test set/IncludeExcludeOperations must set properties to false and prevent enhancement with Empty", function (qUnit) {// Arrange
		var oRangeFieldsGrid,
			oFilterPanel;

		this.oValueHelpDialog.setIncludeRangeOperations([library.valuehelpdialog.ValueHelpRangeOperation.EQ, library.valuehelpdialog.ValueHelpRangeOperation.LT], "string");
		this.oValueHelpDialog.setExcludeRangeOperations([library.valuehelpdialog.ValueHelpRangeOperation.EQ], "date");

		// Act
		oRangeFieldsGrid = this.oValueHelpDialog._createRanges();
		oFilterPanel = oRangeFieldsGrid.getAggregation("content")[0];

		// Assert
		qUnit.equal(oFilterPanel.bEnhanceExclude, false);
		qUnit.equal(oFilterPanel.bEnhanceInclude, false);

		// Clean
		oRangeFieldsGrid.destroy();
	});


	QUnit.test("test setExcludeRangeOperations must not remove Empty operation from Include operations", function (qUnit) {// Arrange
		var oRangeFieldsGrid,
			oFilterPanel;
		var oField = {
			"key": "Name",
			"text": "Name",
			"maxLength": "",
			"type": "string",
			"typeInstance": null,
			"formatSettings": {
				"UTC": false
			},
			"isDefault": false
		};

		this.oValueHelpDialog.setExcludeRangeOperations([
			library.valuehelpdialog.ValueHelpRangeOperation.EQ,
			library.valuehelpdialog.ValueHelpRangeOperation.Contains
		], "string");

		// Act
		oRangeFieldsGrid = this.oValueHelpDialog._createRanges();
		oFilterPanel = oRangeFieldsGrid.getAggregation("content")[0];
		oFilterPanel._enhanceFieldOperationsWithEmpty(oField);

		// Assert
		qUnit.equal(oField.operations.length, 12, "Field operations should contain 12 items");
		qUnit.equal(oField.operations[9], 'Empty', "Field operations are enhanced with Empty operation");

		// Clean
		oRangeFieldsGrid.destroy();
	});

	QUnit.test("test setExcludeRangeOperations must not remove Empty operation from Include operations", function (qUnit) {
		// Arrange
		var oGrid, oForm, oVH = this.oValueHelpDialog;

		// Act
		oGrid = oVH._createRanges();
		oForm = oVH._oFilterPanel._oPanel;

		// Assert
		qUnit.equal(oForm.isA("sap.ui.layout.form.SimpleForm"), true, "Wrapping control is Form");
		qUnit.equal(oForm.getAriaLabelledBy(), oVH.getId() + "-title", "Form is correctly labelled by the ValueHelp dialog title");

		// Clean
		oGrid.destroy();
	});

	QUnit.test("test set Filterbar", function (qUnit) {
		var oFilterbar = new SmartFilterBar();
		this.oValueHelpDialog.setFilterBar(oFilterbar);
		qUnit.equal(this.oValueHelpDialog.getFilterBar(), oFilterbar, "Should return the added Filterbar");

		// replace it by another filterbar
		oFilterbar = new SmartFilterBar();
		this.oValueHelpDialog.setFilterBar(oFilterbar);
		qUnit.equal(this.oValueHelpDialog.getFilterBar(), oFilterbar, "Should return the added Filterbar");
	});

	QUnit.test("test set/get Tokens", function (qUnit) {
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		qUnit.notOk(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getEnabled(), "remove selected tokens button disabled");

		_InitToken(this.oValueHelpDialog);
		qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 2, "the Tokens array should contain 2 entries");
		var keys = Object.keys(this.oValueHelpDialog._oSelectedRanges);
		qUnit.equal(keys.length, 3, "the Tokens array should contain 3 entries");
		qUnit.ok(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getEnabled(), "remove selected tokens button enabled");
		qUnit.equal(this.oValueHelpDialog._getTokenizer().getTokens().length, 5, "SelectedTokens should be 5");

		// remove all tokens by setting an empty array
		this.oValueHelpDialog.setTokens([]);
		qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 0, "the Tokens array should contain 0 entries");
		keys = Object.keys(this.oValueHelpDialog._oSelectedRanges);
		qUnit.equal(keys.length, 0, "the Tokens array should contain 0 entries");
		qUnit.notOk(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getEnabled(), "remove selected tokens button disabled");
		qUnit.equal(this.oValueHelpDialog._getTokenizer().getTokens().length, 0, "SelectedTokens should be 0");

		// check only value token
		var oToken = new Token({
			key: "0001",
			text: "SAP A.G. (0001)"
		});
		this.oValueHelpDialog.setTokens([oToken]);
		qUnit.ok(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getEnabled(), "remove selected tokens button enabled");
		qUnit.equal(this.oValueHelpDialog._getTokenizer().getTokens().length, 1, "SelectedTokens should be 1");

		this.oValueHelpDialog.setTokens([]);
		oToken.destroy();
	});

	/**
	 * @deprecated As of version 1.60.0, replaced by {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog#getTableAsync} to prevent synchronous calls.
	 */
	QUnit.test("test getTable", function (qUnit) {
		var oTable = this.oValueHelpDialog.getTable();
		qUnit.ok(sap.ui.require("sap/ui/table/library"), "sap.ui.table library loaded");
		qUnit.ok(oTable && oTable.isA("sap.ui.table.Table"), "Table is a sao.ui.table.Table");
	});

	/**
	 * @deprecated As of version 1.121, replaced by {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog#getTableAsync} to prevent synchronous calls.
	 */
	QUnit.test("getTable called after open should not throw exception", function (assert) {
		var done = assert.async(),
			fnAfterOpen = function () {
				this.oValueHelpDialog.detachAfterOpen(fnAfterOpen);
				this.oValueHelpDialog.attachAfterClose(fnAfterClose);

				this.oValueHelpDialog.close();
			}.bind(this),
			fnAfterClose = function () {
				this.oValueHelpDialog.detachAfterClose(fnAfterClose);

				assert.ok(true, "exception not thrown");
				done();
			}.bind(this);
		this.oValueHelpDialog.attachAfterOpen(fnAfterOpen);
		this.oValueHelpDialog.open();
		this.oValueHelpDialog.getTable();
	});

	QUnit.test("test resetTableState", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			this.oValueHelpDialog.resetTableState();
			var sCurrentNoData = oTable.getNoData ? oTable.getNoData() : oTable.getNoDataText();
			qUnit.equal(sCurrentNoData, this.oValueHelpDialog._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"), "checking the NoDataText of Table");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test VHD table MultiSelectionPlugin available", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.setEnabledMultiSelectionPlugin(true);
		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			qUnit.equal(oTable.data("isInternal"), true, "Table in VHD has data attribute isInternal - true");
			qUnit.ok(oTable.getDependents()[0].isA("sap.ui.table.plugins.MultiSelectionPlugin"), "Plugin is a MultiSelectionPlugin");
			qUnit.equal(oTable.getDependents()[0].getLimit(), 200, "MultiSelectionPlugin has limit 200");
			fnDone();
		});
	});

	QUnit.test("test _updateAsync is resetting _bIgnoreSelectionChange", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.setEnabledMultiSelectionPlugin(true);
		this.oValueHelpDialog._bIgnoreSelectionChange = false;
		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			this.oValueHelpDialog._updateAsync();
			// assert directly without waiting the _updateAsync promises to be resolved
			qUnit.equal(this.oValueHelpDialog._bIgnoreSelectionChange, false, "_bIgnoreSelectionChange is false");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test VHD with Responsive Table - multiSelectMode should be sap.m.MultiSelectMode.ClearAll", function (qUnit) {
		var fnDone = qUnit.async();
		sinon.stub(this.oValueHelpDialog, "_isPhone").returns(true);
		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			qUnit.equal(oTable.getMultiSelectMode(), mLibrary.MultiSelectMode.ClearAll, "Responsive Table in VHD is with multiSelectMode:ClearAll");
			fnDone();
		});
	});

	QUnit.test("test VHD table support copy", function (qUnit) {
		var fnDone = qUnit.async(), oTableParent, aTableDependents, oClipboardStub, sClipboardText;
		sinon.spy(this.oValueHelpDialog, "_initializeTableToolbar");

		oClipboardStub = sinon.stub(window, "navigator").value({
			clipboard: {
				writeText: function(sText) {
					sClipboardText = sText;
					return Promise.resolve(sClipboardText);
				}
			}
		});
		this.oValueHelpDialog.data("defaultSFBSmartTableConfig", {
			valueListAnnotation: {
				fields: []
			},
			entitySet: "FakeEntitySet",
			cols: [],
			key: "fakeKey",
			description: "FakeDescription",
			displayBehaviour: "idAndDescription",
			autoSearch: true
		});

		this.oValueHelpDialog.setEnabledMultiSelectionPlugin(true);
		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			qUnit.ok(this.oValueHelpDialog._initializeTableToolbar.calledOnce, "_initializeTableToolbar is called");

			oTableParent = oTable.getParent();
			aTableDependents = oTable.getDependents();

			qUnit.ok(oTableParent.getToolbar().isA("sap.m.OverflowToolbar"), "OverflowToolbar available");

			qUnit.ok(aTableDependents[0].isA("sap.ui.table.plugins.MultiSelectionPlugin"), "MultiSelectionPlugin available as dependent of the table");
			qUnit.ok(aTableDependents[1].isA("sap.m.plugins.CellSelector"), "CellSelector available as dependent of the table");
			qUnit.ok(oTableParent.getCopyProvider().isA("sap.m.plugins.CopyProvider"), "CopyProvider available for SmartTable");
			qUnit.ok(oTableParent.getCopyProvider().getCopyButton().getTooltip(), 'Copy to Clipboard', "Copy button has tooltip");
			qUnit.ok(oTableParent.getCopyProvider().getCopyButton().getIcon(), IconPool.getIconURI("copy"), "Copy button has correct icon");
			qUnit.equal(oTableParent.getHeader(), "Items", "SmartTable has correct header");

			oClipboardStub.restore();

			fnDone();
		}.bind(this));
	});

	QUnit.test("test VHD table - disabled support of copy for single selection mode", function (qUnit) {
		var fnDone = qUnit.async(), oTableParent, aTableDependents, oClipboardStub, sClipboardText;
		sinon.spy(this.oValueHelpDialog, "_initializeTableToolbar");

		oClipboardStub = sinon.stub(window, "navigator").value({
			clipboard: {
				writeText: function(sText) {
					sClipboardText = sText;
					return Promise.resolve(sClipboardText);
				}
			}
		});

		this.oValueHelpDialog.data("defaultSFBSmartTableConfig", {
			valueListAnnotation: {
				fields: []
			},
			entitySet: "FakeEntitySet",
			cols: [],
			key: "fakeKey",
			description: "FakeDescription",
			displayBehaviour: "idAndDescription",
			autoSearch: true
		});

		this.oValueHelpDialog.setSupportMultiselect(false);
		this.oValueHelpDialog.setEnabledMultiSelectionPlugin(true);
		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			qUnit.ok(this.oValueHelpDialog._initializeTableToolbar.calledOnce, "_initializeTableToolbar is called");
			qUnit.equal(oTable.getSelectionBehavior(), "RowOnly", "selection behavior is RowOnly");

			oTableParent = oTable.getParent();
			aTableDependents = oTable.getDependents();

			qUnit.ok(oTableParent.getToolbar().isA("sap.m.OverflowToolbar"), "OverflowToolbar available");
			qUnit.equal(oTableParent.getHeader(), "Items", "Table has header/title");

			qUnit.equal(aTableDependents.length, 1, "Only one dependent available");
			qUnit.ok(aTableDependents[0].isA("sap.ui.table.plugins.MultiSelectionPlugin"), "MultiSelectionPlugin available as dependent of the table");

			oClipboardStub.restore();

			fnDone();
		}.bind(this));
	});

	QUnit.test("test VHD with external table - no plugins", function (qUnit) {

		var oTreeTab, oData, oTreeTableData, fnDone = qUnit.async();

		oData = {
			"catalog": {
				"clothing": {
					"categories": [{
						"name": "Women",
						"id": "women",
						"categories": [{
							"name": "Clothing",
							"id": "women_clothing",
							"categories": [{
								"name": "Dresses",
								"id": "women_clothing_dresses",
								"categories": [{
									"name": "Casual Red Dress",
									"id": "women_clothing_dresses_casual-red-dress",
									"amount": 16.99,
									"currency": "EUR",
									"size": "S"
								}, {
									"name": "Short Black Dress",
									"id": "women_clothing_dresses_short-black-dress",
									"amount": 47.99,
									"currency": "EUR",
									"size": "M"
								}]
							}, {
								"name": "Tops",
								"id": "women_clothing_tops",
								"categories": [{
									"name": "Printed Shirt",
									"id": "women_clothing_tops_printed-shirt",
									"amount": 24.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "Tank Top",
									"id": "women_clothing_tops_tank-top",
									"amount": 14.99,
									"currency": "USD",
									"size": "S"
								}]
							}]
						}]
					}, {
						"name": "Men",
						"id": "men",
						"categories": [{
							"name": "Clothing",
							"id": "men_clothing",
							"categories": [{
								"name": "Shirts",
								"id": "men_clothing_shirts",
								"categories": [{
									"name": "Black T-shirt",
									"id": "men_clothing_shirts_t-shirt",
									"amount": 9.99,
									"currency": "USD",
									"size": "XL"
								}, {
									"name": "Polo T-shirt",
									"id": "men_clothing_shirts_polo-t-shirt",
									"amount": 47.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "White Shirt",
									"id": "men_clothing_shirts_white-shirt",
									"amount": 103.99,
									"currency": "USD",
									"size": "L"
								}]
							}, {
								"name": "Shorts",
								"id": "men_clothing_shorts",
								"categories": [{
									"name": "Trouser Short",
									"id": "men_clothing_shorts_trouser-shorts",
									"amount": 62.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "Slim Short",
									"id": "men_clothing_shorts_slim-shorts",
									"amount": 44.99,
									"currency": "USD",
									"size": "S"
								}]
							}]
						}]
					}]
				}
			}
		};

		oTreeTableData = new JSONModel();
		oTreeTableData.setData(oData);

		oTreeTab = new TreeTable({
			selectionMode: "MultiToggle",
			rows: {
				path: "/catalog/clothing",
				parameters: {
					arrayNames: ["categories"]
				}
			},
			columns: [
				new Column({
					label: new Label({text: "Name"}),
					template: new Text({
						text: "{name}"
					})
				})
			]
		});
		oTreeTab.setModel(oTreeTableData);
		this.oValueHelpDialog.setTable(oTreeTab);

		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			qUnit.equal(!oTable.data("isInternal"), true, "Table in VHD has no data attribute isInternal");
			qUnit.equal(oTable.getPlugins().length, 0, "No plugin available");
			fnDone();
		});
	});

	QUnit.test("test VHD with external table - no plugins", function (qUnit) {

		var oTreeTab, oData, oTreeTableData, fnDone = qUnit.async();

		oData = {
			"catalog": {
				"clothing": {
					"categories": [{
						"name": "Women",
						"id": "women",
						"categories": [{
							"name": "Clothing",
							"id": "women_clothing",
							"categories": [{
								"name": "Dresses",
								"id": "women_clothing_dresses",
								"categories": [{
									"name": "Casual Red Dress",
									"id": "women_clothing_dresses_casual-red-dress",
									"amount": 16.99,
									"currency": "EUR",
									"size": "S"
								}, {
									"name": "Short Black Dress",
									"id": "women_clothing_dresses_short-black-dress",
									"amount": 47.99,
									"currency": "EUR",
									"size": "M"
								}]
							}, {
								"name": "Tops",
								"id": "women_clothing_tops",
								"categories": [{
									"name": "Printed Shirt",
									"id": "women_clothing_tops_printed-shirt",
									"amount": 24.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "Tank Top",
									"id": "women_clothing_tops_tank-top",
									"amount": 14.99,
									"currency": "USD",
									"size": "S"
								}]
							}]
						}]
					}, {
						"name": "Men",
						"id": "men",
						"categories": [{
							"name": "Clothing",
							"id": "men_clothing",
							"categories": [{
								"name": "Shirts",
								"id": "men_clothing_shirts",
								"categories": [{
									"name": "Black T-shirt",
									"id": "men_clothing_shirts_t-shirt",
									"amount": 9.99,
									"currency": "USD",
									"size": "XL"
								}, {
									"name": "Polo T-shirt",
									"id": "men_clothing_shirts_polo-t-shirt",
									"amount": 47.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "White Shirt",
									"id": "men_clothing_shirts_white-shirt",
									"amount": 103.99,
									"currency": "USD",
									"size": "L"
								}]
							}, {
								"name": "Shorts",
								"id": "men_clothing_shorts",
								"categories": [{
									"name": "Trouser Short",
									"id": "men_clothing_shorts_trouser-shorts",
									"amount": 62.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "Slim Short",
									"id": "men_clothing_shorts_slim-shorts",
									"amount": 44.99,
									"currency": "USD",
									"size": "S"
								}]
							}]
						}]
					}]
				}
			}
		};

		oTreeTableData = new JSONModel();
		oTreeTableData.setData(oData);

		oTreeTab = new TreeTable({
			selectionMode: "MultiToggle",
			rows: {
				path: "/catalog/clothing",
				parameters: {
					arrayNames: ["categories"]
				}
			},
			columns: [
				new Column({
					label: new Label({text: "Name"}),
					template: new Text({
						text: "{name}"
					})
				})
			]
		});
		oTreeTab.setModel(oTreeTableData);
		this.oValueHelpDialog.setTable(oTreeTab);

		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			qUnit.equal(!oTable.data("isInternal"), true, "Table in VHD has no data attribute isInternal");
			qUnit.equal(oTable.getPlugins().length, 0, "No plugin available");
			fnDone();
		});
	});

	QUnit.test("test VHD with external table - only one title of the table available", function (qUnit) {

		var oTreeTab, oData, oTreeTableData, oTableTitle, oTableToolbar, iTitleCount = 0, fnDone = qUnit.async();

		oData = {
			"catalog": {
				"clothing": {
					"categories": [{
						"name": "Women",
						"id": "women",
						"categories": [{
							"name": "Clothing",
							"id": "women_clothing",
							"categories": [{
								"name": "Dresses",
								"id": "women_clothing_dresses",
								"categories": [{
									"name": "Casual Red Dress",
									"id": "women_clothing_dresses_casual-red-dress",
									"amount": 16.99,
									"currency": "EUR",
									"size": "S"
								}, {
									"name": "Short Black Dress",
									"id": "women_clothing_dresses_short-black-dress",
									"amount": 47.99,
									"currency": "EUR",
									"size": "M"
								}]
							}, {
								"name": "Tops",
								"id": "women_clothing_tops",
								"categories": [{
									"name": "Printed Shirt",
									"id": "women_clothing_tops_printed-shirt",
									"amount": 24.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "Tank Top",
									"id": "women_clothing_tops_tank-top",
									"amount": 14.99,
									"currency": "USD",
									"size": "S"
								}]
							}]
						}]
					}, {
						"name": "Men",
						"id": "men",
						"categories": [{
							"name": "Clothing",
							"id": "men_clothing",
							"categories": [{
								"name": "Shirts",
								"id": "men_clothing_shirts",
								"categories": [{
									"name": "Black T-shirt",
									"id": "men_clothing_shirts_t-shirt",
									"amount": 9.99,
									"currency": "USD",
									"size": "XL"
								}, {
									"name": "Polo T-shirt",
									"id": "men_clothing_shirts_polo-t-shirt",
									"amount": 47.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "White Shirt",
									"id": "men_clothing_shirts_white-shirt",
									"amount": 103.99,
									"currency": "USD",
									"size": "L"
								}]
							}, {
								"name": "Shorts",
								"id": "men_clothing_shorts",
								"categories": [{
									"name": "Trouser Short",
									"id": "men_clothing_shorts_trouser-shorts",
									"amount": 62.99,
									"currency": "USD",
									"size": "M"
								}, {
									"name": "Slim Short",
									"id": "men_clothing_shorts_slim-shorts",
									"amount": 44.99,
									"currency": "USD",
									"size": "S"
								}]
							}]
						}]
					}]
				}
			}
		};

		oTreeTableData = new JSONModel();
		oTreeTableData.setData(oData);

		oTreeTab = new TreeTable({
			selectionMode: "MultiToggle",
			rows: {
				path: "/catalog/clothing",
				parameters: {
					arrayNames: ["categories"]
				}
			},
			columns: [
				new Column({
					label: new Label({text: "Name"}),
					template: new Text({
						text: "{name}"
					})
				})
			],
			extension:  new Toolbar({
				content: [
					new ToolbarSpacer({}),
					new Button({text: "ha"})
				]
			})
		});
		oTreeTab.setModel(oTreeTableData);
		this.oValueHelpDialog.setTable(oTreeTab);

		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			qUnit.equal(!oTable.data("isInternal"), true, "Table in VHD has no data attribute isInternal");
			qUnit.equal(oTable.getPlugins().length, 0, "No plugin available");

			this.oValueHelpDialog.setTable(oTable);
			this.oValueHelpDialog.getTableAsync().then(function (oOverridenTable) {
				oTableToolbar = this.oValueHelpDialog._oTable.getExtension && this.oValueHelpDialog._oTable.getExtension()[0];
				oTableTitle = oTableToolbar ? oTableToolbar.getContent()[0] : null;
				qUnit.equal(oTableTitle.getText(), "Items", "Table title is correct");

				oTableToolbar.getContent().forEach(function(oContentItem) {
					if (oContentItem.getMetadata().getName() === 'sap.m.Title') {
						iTitleCount++;
					}
				});

				qUnit.equal(iTitleCount, 1, "Only one title of the table available");

				fnDone();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("test TableStateSearchData", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			this.oValueHelpDialog.TableStateSearchData();
			var sCurrentNoData = oTable.getNoData ? oTable.getNoData() : oTable.getNoDataText();
			qUnit.equal(sCurrentNoData, this.oValueHelpDialog._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"), "checking the NoDataText of Table");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test TableStateDataSearching", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			this.oValueHelpDialog.TableStateDataSearching();
			var sCurrentNoData = oTable.getNoData ? oTable.getNoData() : oTable.getNoDataText();
			qUnit.equal(sCurrentNoData, this.oValueHelpDialog._oRb.getText("VALUEHELPDLG_TABLE_SEARCHING"), "checking the NoDataText of Table");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test TableStateDataFilled", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			this.oValueHelpDialog.TableStateDataFilled();
			var sCurrentNoData = oTable.getNoData ? oTable.getNoData() : oTable.getNoDataText();
			qUnit.equal(sCurrentNoData, this.oValueHelpDialog._oRb.getText("VALUEHELPDLG_TABLE_NODATA"), "checking the NoDataText of Table");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test FormatedRangeTokenText", function (qUnit) {
		var result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.BT, "v1", "v2", false, "keyField");
		qUnit.equal(result, "v1...v2", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.EQ, "v1", "", false, "keyField");
		qUnit.equal(result, "=v1", "result must be correct");

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}, {
			key: "date",
			label: "date",
			type: "date"
		}, {
			key: "time",
			label: "time",
			type: "time"
		}, {
			key: "boolean",
			label: "boolean",
			type: "boolean"
		}, {
			key: "numeric",
			label: "numeric",
			type: "numeric",
			scale: 2,
			precision: 10
		}]);
		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.EndsWith, "v1", "", false, "CompanyName");
		qUnit.equal(result, "Name: *v1", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.StartsWith, "v1", "", false, "CompanyName");
		qUnit.equal(result, "Name: v1*", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.Contains, "v1", "", false, "CompanyName");
		qUnit.equal(result, "Name: *v1*", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.LE, "v1", "", true, "CompanyCode");
		qUnit.equal(result, "ID: !(<=v1)", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.LT, "v1", "", true, "CompanyCode");
		qUnit.equal(result, "ID: !(<v1)", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GT, new Date(2000, 0, 1), "", false, "date");
		qUnit.ok(/date: <*/.test(result), "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GE, new Date(2000, 0, 0, 10, 10, 0), "", false, "time");
		qUnit.ok(/time: >=*/.test(result), "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.EQ, true, "", false, "boolean");
		qUnit.ok(/boolean: =*/.test(result), "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.BT, 10.123, 100.123, false, "numeric");
		qUnit.ok(/numeric: (.+)\.\.\.(.+)/.test(result), "result must be correct");
	});

	/**
	 * @deprecated 1.84.1
	 */
	QUnit.test("test set/get maxIncludeRanges", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getMaxIncludeRanges(), "-1", "Table MaxIncludeRanges should be -1");
		this.oValueHelpDialog.setMaxIncludeRanges("1");
		qUnit.equal(this.oValueHelpDialog.getMaxIncludeRanges(), "1", "Table MaxIncludeRanges should be 1");
	});

	/**
	 * @deprecated 1.84.1
	 */
	QUnit.test("test 0 maxIncludeRanges ", function (qUnit) {
		// Arrange
		var oOperation,
			oOperationsModel,
			aOperations,
			bHasOnlyExcludeOperation,
			oRangeFieldsGrid;

		// Act
		this.oValueHelpDialog.setMaxIncludeRanges("0");
		oRangeFieldsGrid = this.oValueHelpDialog._createRanges();
		oOperation = this.oValueHelpDialog._oFilterPanel._oConditionPanel._oConditionsGrid.getContent()[0].operation;
		oOperationsModel = oOperation.getModel();
		aOperations = oOperationsModel.oData.items;
		bHasOnlyExcludeOperation = aOperations.every(function(operation){return operation.key.indexOf("Not") === 0;});

		// Assert
		qUnit.ok(bHasOnlyExcludeOperation, "The include operations are removed");

		// Clean
		oRangeFieldsGrid.destroy();
	});

	/**
	 * @deprecated 1.84.1
	 */
	QUnit.test("test set/get maxExcludeRanges", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getMaxExcludeRanges(), "-1", "Table MaxExcludeRanges should be -1");
		this.oValueHelpDialog.setMaxExcludeRanges("1");
		qUnit.equal(this.oValueHelpDialog.getMaxExcludeRanges(), "1", "Table MaxExcludeRanges should be 1");
	});

	/**
	 * @deprecated 1.84.1
	 */
	QUnit.test("test 0 maxExcludeRanges ", function (qUnit) {
		// Arrange
		var oOperation,
			oOperationsModel,
			aOperations,
			bHasOnlyIncludeOperation,
			oRangeFieldsGrid;

		// Act
		this.oValueHelpDialog.setMaxExcludeRanges("0");
		oRangeFieldsGrid = this.oValueHelpDialog._createRanges();
		oOperation = this.oValueHelpDialog._oFilterPanel._oConditionPanel._oConditionsGrid.getContent()[0].operation;
		oOperationsModel = oOperation.getModel();
		aOperations = oOperationsModel.oData.items;
		bHasOnlyIncludeOperation = aOperations.every(function(operation){return operation.key.indexOf("Not") === -1;});

		// Assert
		qUnit.ok(bHasOnlyIncludeOperation, "The Exclude operations are removed");

		// Clean
		oRangeFieldsGrid.destroy();
	});

	QUnit.test("test set/get maxConditions", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getMaxConditions(), "-1", "Table maxMonditions should be -1");
		this.oValueHelpDialog.setMaxConditions("1");
		qUnit.equal(this.oValueHelpDialog.getMaxConditions(), "1", "Table maxMonditions should be 1");
	});

	QUnit.test("test _getFormatedRangeTokenText", function (qUnit) {
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);

		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.Empty, "", "", false, "CompanyCode"), "ID: <empty>", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GT, "v1", "v2", false, "CompanyCode"), "ID: >v1", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GE, "v1", "v2", false, "CompanyCode"), "ID: >=v1", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GE, "v1", "v2", true, "CompanyCode"), "ID: !(>=v1)", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.LT, "v1", "v2", false, "CompanyCode"), "ID: <v1", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.Contains, "v1", "v2", false, "CompanyCode"), "ID: *v1*", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.StartsWith, "v1", "v2", false, "CompanyCode"), "ID: v1*", "returned value is correct");
	});

	QUnit.test("setTokens does not throw exception if '{' is part of the key of some tokens", function (assert) {
		// Arrange
		var oToken = new Token();
		oToken.setKey("not{escaped{key");
		oToken.setText("not{escaped{text");

		// Act
		this.oValueHelpDialog.setTokens([oToken]);

		// Assert
		assert.ok(true, "no exception is thrown");
	});

	QUnit.test("when filterbar is initialised set the initial focus on basic search field if there is one", function (assert) {

		// Arrange
		var	oFilterbar = new SmartFilterBar(),
			oSearchField = new SearchField();

		oFilterbar.setBasicSearch(oSearchField);
		this.oValueHelpDialog.setFilterBar(oFilterbar);
		sinon.spy(this.oValueHelpDialog, "setInitialFocus");

		// Act
		this.oValueHelpDialog._oFilterBar.fireInitialise();

		// Assert
		assert.ok(this.oValueHelpDialog.setInitialFocus.calledOnce, "setInitialFocus is called after FilterBar is initialised");
		assert.ok(this.oValueHelpDialog.setInitialFocus.calledWith(oSearchField), "setInitialFocus is called on basic search field");

	});

	QUnit.test("when filterbar and conditions are initialised set the initial focus on the first TabBarItem", function (assert) {

		// Arrange
		var	oFilterbar = new SmartFilterBar(),
			oSearchField = new SearchField();

		oFilterbar.setBasicSearch(oSearchField);
		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(false);
		this.oValueHelpDialog.setFilterMode(true);
		this.oValueHelpDialog.setFilterBar(oFilterbar);
		sinon.spy(this.oValueHelpDialog, "setInitialFocus");

		// Act
		this.oValueHelpDialog._oFilterBar.fireInitialise();

		// Assert
		assert.ok(this.oValueHelpDialog.setInitialFocus.calledOnce, "setInitialFocus is called after FilterBar is initialised");
		assert.ok(this.oValueHelpDialog.setInitialFocus.calledWith(this.oValueHelpDialog._oTabBar.getItems()[0]), "setInitialFocus is called on first item of the tabBar");

	});

	QUnit.test("test when VHD with filterMode true - the initial focus goes on the VHD", function (qUnit) {

		var done = qUnit.async(),
			fnClosed = function () {
				this.oValueHelpDialog.detachAfterClose(fnClosed);
				done();
			}.bind(this),
			fnOpened;

		// Arrange
		this.oValueHelpDialog.setFilterMode(true);
		this.oValueHelpDialog.setSupportRangesOnly(false);

		fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			// Assert
			qUnit.equal(UI5Element.closestTo(document.activeElement).getId(), this.oValueHelpDialog.getId(),"initialFocus is set correctly on the VHD");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("The table's header is added as ariaLabelledBy to the table", function (qUnit) {

		var done = qUnit.async(),
			doneGetTableAsync = qUnit.async(),
			fnClosed = function () {
				this.oValueHelpDialog.detachAfterClose(fnClosed);
				done();
			}.bind(this),
			fnOpened = function () {
				this.oValueHelpDialog.detachAfterOpen(fnOpened);

				this.oValueHelpDialog.data("defaultSFBSmartTableConfig", false);
				// Assert
				this.oValueHelpDialog.getTableAsync().then(function(oTable) {
					var oTableToolbar = oTable.getExtension && oTable.getExtension()[0],
						oTableTitle = oTableToolbar ? oTableToolbar.getContent()[0] : null;

					qUnit.equal(oTable.getAriaLabelledBy().length, 1, "Only 1 ariaLabelledBy is added");
					qUnit.equal(oTable.getAriaLabelledBy()[0], oTableTitle.getId(), "Correct ariaLabelledBy is added");
					doneGetTableAsync();
				});

				this.oValueHelpDialog.attachAfterClose(fnClosed);
				this.oValueHelpDialog.close();
			}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.module("Async tests with Dialog Open", {
		beforeEach: function () {
			this.oValueHelpDialog = new ValueHelpDialog("VHD");
			this.oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		},
		afterEach: async function() {
			this.oValueHelpDialog.close();
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
			await nextUIUpdate();
		}
	});

	QUnit.test("BCP: 2380110663 Binding expression is evaluated in table columns", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oVHD = this.oValueHelpDialog,
			oColumnModel = new JSONModel({
				cols: [
					{
						template: "FirstName",
						label: "{myNamedModel>/label}"
					}
				]
			}),
			oMyNamedModel = new JSONModel({
				label: "XYZ"
			});

		oVHD.setModel(oColumnModel, "columns");
		oVHD.setModel(oMyNamedModel, "myNamedModel");

		oVHD.attachAfterOpen(function () {
			oVHD.getTableAsync().then(function (oTable) {
				// Assert
				assert.strictEqual(oTable.getColumns()[0].getLabel().getText(), "XYZ",
					"Nested binding should be evaluated");

				// Cleanup
				oColumnModel.destroy();
				oMyNamedModel.destroy();
				fnDone();
			});
		});

		// Act
		this.oValueHelpDialog.open();
	});

	QUnit.test("test removeAllToken", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		var fnFireTokenRemoveSpy = sinon.spy(this.oValueHelpDialog, "fireTokenRemove");

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			qUnit.ok(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn);
			qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 2, "_oSelectedItems should be 2");
			qUnit.equal(Object.keys(this.oValueHelpDialog._oSelectedRanges).length, 3, "_oSelectedRanges should be 3");

			var oTarget = this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getFocusDomRef();
			qutils.triggerTouchEvent("tap", oTarget, {
				srcControl: null
			});
			await nextUIUpdate();

			qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 0, "_oSelectedItems should be 0");
			qUnit.equal(Object.keys(this.oValueHelpDialog._oSelectedRanges).length, 0, "_oSelectedRanges should be 0");
			qUnit.equal(fnFireTokenRemoveSpy.callCount, 1, "tokenRemove fired");

			var oTokenizerPanel = this.oValueHelpDialog._oTokenizerPanel;
			oTokenizerPanel.fireExpand();

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test when VHD with conditions only - the initial focus goes on the first dropdown - the conditions operator field", function (qUnit) {

		var done = qUnit.async(),
			fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this),
			fnOpened,
			oConditionPanel;

		// Arrange
			this.oValueHelpDialog.setRangeKeyFields([{
			label: "Product",
			key: "ProductId",
			type: "string",
			typeInstance: new typeString({}, {
				maxLength: 7
			})
		}]);

		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		sinon.spy(this.oValueHelpDialog, "setInitialFocus");

		fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (Device.system.phone) {
				this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			}

			oConditionPanel = this.oValueHelpDialog._oFilterPanel.getConditionPanel();

			// Assert
			qUnit.ok(this.oValueHelpDialog.setInitialFocus.calledOnce, "setInitialFocus is called");
			qUnit.ok(this.oValueHelpDialog.setInitialFocus.calledWith(oConditionPanel._oConditionsGrid.getAggregation("content")[0].operation), "setInitialFocus is called on the conditions operator field");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test when VHD with conditions only - the initial focus goes on the condition input field when the conditions operator(dropdown field) is disabled", function (qUnit) {

		var done = qUnit.async(),
			fnClosed = function () {
				this.oValueHelpDialog.detachAfterClose(fnClosed);
				done();
			}.bind(this),
			fnOpened,
			oConditionPanel,
			oConditionGridContent;

		// Arrange
		this.oValueHelpDialog.setRangeKeyFields([{
			label: "Enabled product",
			key: "ProductEnabled",
			type: "boolean"
		}]);

		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		sinon.spy(this.oValueHelpDialog, "setInitialFocus");

		fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (Device.system.phone) {
				this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			}
			oConditionPanel = this.oValueHelpDialog._oFilterPanel.getConditionPanel();
			oConditionGridContent = oConditionPanel._oConditionsGrid.getAggregation("content")[0];
			oConditionGridContent.operation.setEnabled(false);

			// Assert
			qUnit.ok(this.oValueHelpDialog.setInitialFocus.calledOnce, "setInitialFocus is called");
			qUnit.ok(this.oValueHelpDialog.setInitialFocus.calledWith(oConditionGridContent.value1), "setInitialFocus is called on the conditions operator field");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test when VHD not set conditionPanelDefaultOperation - condition panel should select the first condition", function (qUnit) {

		var done = qUnit.async(),
			fnClosed = function () {
				this.oValueHelpDialog.detachAfterClose(fnClosed);
				done();
			}.bind(this),
			fnOpened;

		// Arrange
		this.oValueHelpDialog.setRangeKeyFields([{
			label: "Product",
			key: "ProductId",
			type: "string",
			typeInstance: new typeString({}, {
				maxLength: 7
			})
		}]);
		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);

		fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (Device.system.phone) {
				this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			}
			this.oValueHelpDialog.update();
			await nextUIUpdate();

			var oConditionPanel = this.oValueHelpDialog._oFilterPanel.getConditionPanel();

			// Assert
			qUnit.equal(oConditionPanel.getDefaultOperation(), "", "Condition panel defaultOperation should be empty string");
			qUnit.equal(oConditionPanel._oConditionsGrid.getAggregation("content")[0].operation.getSelectedKey(), library.valuehelpdialog.ValueHelpRangeOperation.Contains, "Condition panel should select the fist condition");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test when VHD set conditionPanelDefaultOperation - condition panel operator should be changed", function (qUnit) {

		var done = qUnit.async(),
			fnClosed = function () {
				this.oValueHelpDialog.detachAfterClose(fnClosed);
				done();
			}.bind(this),
			fnOpened;

		// Arrange
		this.oValueHelpDialog.setRangeKeyFields([{
			label: "Product",
			key: "ProductId",
			type: "string",
			typeInstance: new typeString({}, {
				maxLength: 7
			})
		}]);
		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		this.oValueHelpDialog.setConditionPanelDefaultOperation(library.valuehelpdialog.ValueHelpRangeOperation.LT);

		fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (Device.system.phone) {
				this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			}
			this.oValueHelpDialog.update();
			await nextUIUpdate();

			var oConditionPanel = this.oValueHelpDialog._oFilterPanel.getConditionPanel();

			// Assert
			qUnit.equal(oConditionPanel.getDefaultOperation(), library.valuehelpdialog.ValueHelpRangeOperation.LT, "Condition panel defaultOperation should be the set one not he first one");
			qUnit.equal(oConditionPanel._oConditionsGrid.getAggregation("content")[0].operation.getSelectedKey(), library.valuehelpdialog.ValueHelpRangeOperation.LT, "Condition panel defaultOperation should be the set one not the first one");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test when VHD with FilterBar focus goes on the ok button after no tokens are available", function(qUnit) {
		var done = qUnit.async();

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var oFilterbar = new SmartFilterBar();
		this.oValueHelpDialog.setFilterBar(oFilterbar);

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);

		_InitToken(this.oValueHelpDialog);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);
			var oTokenizer = this.oValueHelpDialog._getTokenizer(),
			oItemToken,
			oItemToken1,
			oItemToken2,
			oItemToken3,
			oItemToken4;

			qUnit.equal(oTokenizer.getTokens().length, 5, "SelectedTokens should be 5");

			oItemToken = oTokenizer.getTokens()[0];
			oItemToken1 = oTokenizer.getTokens()[1];
			oItemToken2 = oTokenizer.getTokens()[2];
			oItemToken3 = oTokenizer.getTokens()[3];
			oItemToken4 = oTokenizer.getTokens()[4];

			oTokenizer.fireTokenDelete({
				tokens: [oItemToken,oItemToken1,oItemToken2,oItemToken3,oItemToken4]
			});
			await nextUIUpdate();

			qUnit.equal(oTokenizer.getTokens().length, 0, "SelectedTokens should be 0");

			this.oValueHelpDialog._manageFocusAfterRemoveTokens();

			qUnit.equal(this.oValueHelpDialog._oButtonOk.getFocusDomRef(), document.activeElement, "Focus is on the right Ok button control");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test focus goes on value field after removing all tokens by remove all button", function(qUnit) {
		var done = qUnit.async();

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);

		_InitToken(this.oValueHelpDialog);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);
			var oTarget,
			oConditionsValueInputControl;

			qUnit.equal(this.oValueHelpDialog._getTokenizer().getTokens().length, 5, "SelectedTokens should be 5");
			oTarget = this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getFocusDomRef();

			qutils.triggerTouchEvent("tap", oTarget, {
				srcControl: null
			});
			await nextUIUpdate();

			qUnit.equal(this.oValueHelpDialog._getTokenizer().getTokens().length, 0, "SelectedTokens should be 0");

			oConditionsValueInputControl = this.oValueHelpDialog._oFilterPanel.getConditionPanel()._oConditionsGrid.getAggregation("content")[0].value1;
			qUnit.equal(oConditionsValueInputControl.getFocusDomRef(), document.activeElement, "Focus is on the right input control");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test remove single tokens", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.attachTokenRemove(function (oEvent) {
			oEvent.getParameters().useDefault = true;
		});

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = async function () {
			this.oValueHelpDialog._bTableCreatedInternal = false;

			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			qUnit.ok(this.oValueHelpDialog._getTokenizer());
			qUnit.equal(this.oValueHelpDialog._getTokenizer().getTokens().length, 5, "SelectedTokens should be 5");

			// remove tokens from the select tokenizer
			var oTokenizer = this.oValueHelpDialog._getTokenizer();
			var oItemToken = oTokenizer.getTokens()[0];
			var oRangeToken = oTokenizer.getTokens()[2];
			oTokenizer.fireTokenDelete({
				tokens: [oItemToken]
			});
			await nextUIUpdate();

			qUnit.equal(this.oValueHelpDialog._getTokenizer().getTokens().length, 4, "SelectedTokens should be 4");

			this.oValueHelpDialog._bTableCreatedInternal = true;
			oTokenizer.fireTokenDelete({
				tokens: [oRangeToken]
			});
			await nextUIUpdate();
			qUnit.equal(Object.keys(this.oValueHelpDialog._oSelectedRanges).length, 2, "SelectedRanges should be 2");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	/**
	 * @deprecated As of version 1.69, replaced by {@link sap.ui.table.Table#getSelectedIndices}
	 */
	QUnit.test("test rowSelectionChanged", function (qUnit) {
		var done = qUnit.async();
		this.oValueHelpDialog.setKey("CompanyCode");
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		function triggerSelectionOnRow(oTable, i, bKeyboard, bCtrlKey, bShiftKey) {
			var oCell = window.document.getElementById(oTable.getId() + "-rowsel" + i);
			oCell = oCell || window.document.getElementById("__item" + (i + 2) + "-selectMulti");
			oCell.focus();
			if (bKeyboard) {
				qutils.triggerKeydown(oCell, "SPACE", !!bShiftKey, false, !!bCtrlKey);
				qutils.triggerKeyup(oCell, "SPACE", !!bShiftKey, false, !!bCtrlKey);
			} else {
				qutils.triggerEvent("tap", oCell, {
					metaKey: !!bCtrlKey,
					ctrlKey: !!bCtrlKey,
					shiftKey: !!bShiftKey
				});
			}
		}

		var fnOpened = async function () {

			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (this.oValueHelpDialog._isPhone()) {
				this.oValueHelpDialog._updateView("PHONE_LIST_VIEW");
			}

			this.oValueHelpDialog.update();
			await nextUIUpdate();

			triggerSelectionOnRow(this.oValueHelpDialog._oTable, 1, this.oValueHelpDialog._isPhone(), false, false);
			triggerSelectionOnRow(this.oValueHelpDialog._oTable, 2, this.oValueHelpDialog._isPhone(), false, false);
			triggerSelectionOnRow(this.oValueHelpDialog._oTable, 3, this.oValueHelpDialog._isPhone(), false, false);

			qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 3, "SelectedItems should be 3");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("test rowSelectionChanged - using updateAsync", function (qUnit) {
		var done = qUnit.async();
		this.oValueHelpDialog.setKey("CompanyCode");
		this.oValueHelpDialog.setEnabledMultiSelectionPlugin(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		function triggerSelectionOnRow(oTable, i, bKeyboard, bCtrlKey, bShiftKey) {
			var oCell = window.document.getElementById(oTable.getId() + "-rowsel" + i);
			oCell = oCell || window.document.getElementById("__item" + (i + 2) + "-selectMulti");
			oCell.focus();
			if (bKeyboard) {
				qutils.triggerKeydown(oCell, "SPACE", !!bShiftKey, false, !!bCtrlKey);
				qutils.triggerKeyup(oCell, "SPACE", !!bShiftKey, false, !!bCtrlKey);
			} else {
				return new Promise(function(resolve) {
					qutils.triggerEvent("tap", oCell, {
						metaKey: !!bCtrlKey,
						ctrlKey: !!bCtrlKey,
						shiftKey: !!bShiftKey
					});
					resolve();
				});
			}
		}

		var fnOpened = function () {

			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (this.oValueHelpDialog._isPhone()) {
				this.oValueHelpDialog._updateView("PHONE_LIST_VIEW");
			}

			this.oValueHelpDialog.update().then(async function() {
				await nextUIUpdate();

				var aTriggerSelectPromises = [];
				aTriggerSelectPromises.push(triggerSelectionOnRow(this.oValueHelpDialog._oTable, 1, this.oValueHelpDialog._isPhone(), false, false));
				aTriggerSelectPromises.push(triggerSelectionOnRow(this.oValueHelpDialog._oTable, 2, this.oValueHelpDialog._isPhone(), false, false));
				aTriggerSelectPromises.push(triggerSelectionOnRow(this.oValueHelpDialog._oTable, 3, this.oValueHelpDialog._isPhone(), false, false));

				Promise.all(aTriggerSelectPromises).then(function() {
					qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 3, "SelectedItems should be 3");

					this.oValueHelpDialog.attachAfterClose(fnClosed);
					this.oValueHelpDialog.close();
				}.bind(this));
			}.bind(this));

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	/**
	 * @deprecated As of version 1.69, replaced by {@link sap.ui.table.Table#getSelectedIndices}
	 */
	QUnit.test("test bind table and update", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setKey("CompanyCode");
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog.update();
			qUnit.ok(this.oValueHelpDialog);

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	/* old	*/
	QUnit.test("test change view between SelectedItems and Conditions", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		this.oValueHelpDialog.setSupportRanges(true);
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog._updateView("DESKTOP_LIST_VIEW");
			await nextUIUpdate();

			qUnit.equal(this.oValueHelpDialog._oRanges, null, "The ranges part should not exist");

			this.oValueHelpDialog._updateView("DESKTOP_CONDITIONS_VIEW");
			await nextUIUpdate();

			qUnit.notEqual(this.oValueHelpDialog._oRanges, null, "The ranges part should exist");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});


	/* old
	QUnit.test("test toggle between Ranges and mainTable", function(qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{key: "CompanyCode", label: "ID"}, {key:"CompanyName", label : "Name"}]);
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function() {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function() {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog.setSupportRanges(true);
			qUnit.equal(this.oValueHelpDialog._oRanges, null, "The oRanges grid should not exist");

			//this.oValueHelpDialog._onRangesPressed()();
			this.oValueHelpDialog._updateView("DESKTOP_CONDITIONS_VIEW");
			sap.ui.getCore().applyChanges();


			qUnit.notEqual(this.oValueHelpDialog._oRanges, null, "The oRanges grid should exist");

			var fnValidateCallback= function() {};
			var fnSpy= sinon.spy(fnValidateCallback);

			this.oValueHelpDialog._validateRanges(fnSpy);

			this.oValueHelpDialog._oBackButton.firePress();
			sap.ui.getCore().applyChanges();


			qUnit.equal(this.oValueHelpDialog.getContent()[0], this.oValueHelpDialog._oMainGrid, "The dialog content should be the MainGrid");
			qUnit.equal(fnSpy.callCount, 1, "validateCallback callback function was called");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});*/

	QUnit.test("test on setTokens, token range is not passed by reference", function (assert) {
		// Arrange
		var oValueHelpDialog = this.oValueHelpDialog,
			oRange = {
				"exclude": false
			},
			oToken = new Token().data("range", oRange),
			aTokens = [oToken],
			fnSpyObjectAssign = sinon.spy(Object, "assign");

		// Act
		oValueHelpDialog.setTokens(aTokens);
		oValueHelpDialog._oSelectedRanges["range_0"].exclude = true;

		// Assert
		assert.equal(oRange.exclude, false, "When changing the selected ranges, the range of the token is not changed");
		assert.ok(fnSpyObjectAssign.called, 'Object.assign is called to remove the reference');
	});

	QUnit.test("test _onCloseAndTakeOverValues", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		this.aTokens = [];
		var that = this;
		var fnc = function (oControlEvent) {
			that.aTokens = oControlEvent.getParameter("tokens");
		};
		this.oValueHelpDialog.attachOk(fnc);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog._onCloseAndTakeOverValues();

			qUnit.equal(that.aTokens.length, 5, "Ok event should return 5 tokens");
			this.oValueHelpDialog.detachOk(fnc);
			delete this.aTokens;

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("Test open with supportRangesOnly and create range token", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyName",
			label: "Name",
			type: "string"
		}]);

		this.aTokens = [];
		var that = this;
		var fnc = function (oControlEvent) {
			that.aTokens = oControlEvent.getParameter("tokens");
		};
		this.oValueHelpDialog.attachOk(fnc);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);


			if (Device.system.phone) {
				this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			}

			// Change item
			var oConditionPanel = this.oValueHelpDialog._oFilterPanel.getConditionPanel();
			var oConditionGrid = oConditionPanel._oConditionsGrid.getContent()[0];
			var sValue1 = "foo";
			oConditionGrid.value1.setValue(sValue1);
			oConditionPanel._changeField(oConditionGrid);


			this.oValueHelpDialog._onCloseAndTakeOverValues();
			await nextUIUpdate();


			qUnit.equal(that.aTokens.length, 1, "Ok event should return 1 token");
			qUnit.equal(that.aTokens[0].getText(), "*foo*", "token text should return '*" + sValue1 + "*'");
			that.oValueHelpDialog.detachOk(fnc);
			delete that.aTokens;

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("Test open with supportRangesOnly and create range token of type date", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyName",
			label: "Name",
			type: "date"
		}]);

		this.aTokens = [];
		var that = this;
		var fnc = function (oControlEvent) {
			that.aTokens = oControlEvent.getParameter("tokens");
		};
		this.oValueHelpDialog.attachOk(fnc);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (Device.system.phone) {
				this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			}

			// Change item
			var oConditionPanel = this.oValueHelpDialog._oFilterPanel.getConditionPanel();
			var oConditionGrid = oConditionPanel._oConditionsGrid.getContent()[0];
			oConditionGrid.value1.setDateValue(new Date());
			var oFakeDateEvent = new Event("fakeDateEvent", this, {
				valid: "true"
			});

			oConditionPanel._changeField(oConditionGrid, oFakeDateEvent);

			this.oValueHelpDialog._onCloseAndTakeOverValues();
			await nextUIUpdate();


			qUnit.equal(that.aTokens.length, 1, "Ok event should return 1 token");
			qUnit.ok(that.aTokens[0].data("range").value1 instanceof Date, "token value should return return Date");
			that.oValueHelpDialog.detachOk(fnc);
			delete that.aTokens;


			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("Test first focusable element", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyName",
			label: "Name",
			type: "date"
		}]);


		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			var oConditionPanel = this.oValueHelpDialog._oFilterPanel.getConditionPanel(),
				oConditionGrid = oConditionPanel._oConditionsGrid.getContent()[0].getContent(),
				oAddButton = oConditionGrid[oConditionGrid.length - 1],
				oRemoveButton = oConditionGrid[oConditionGrid.length - 2],
				oFirstFe = document.getElementById(oConditionPanel.getId() + "-firstfe"),
				fnSpy = sinon.spy(oFirstFe, "focus");

			qUnit.equal(oFirstFe.getAttribute("tabindex"), "-1", "firstfe is not accessible via keyboard");

			oAddButton.firePress();

			qUnit.ok(fnSpy.callCount, 1, "First focusable element is correctly focused when Add button is pressed");

			oRemoveButton.firePress();

			qUnit.ok(fnSpy.callCount, 2, "First focusable element is correctly focused when Remove button is pressed");


			this.oValueHelpDialog._onCloseAndTakeOverValues();
			await nextUIUpdate();

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("test _onCancel", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		var that = this;
		var fnCancelCallback = function () { };
		var fnSpy = sinon.spy(fnCancelCallback);
		this.oValueHelpDialog.attachCancel(fnSpy);


		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog._onCancel();
			await nextUIUpdate();


			qUnit.equal(fnSpy.callCount, 1, "cancel callback function was called");
			that.oValueHelpDialog.detachCancel(fnSpy);

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("stable IDs", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setKey("CompanyCode");
		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyName",
			label: "Name",
			type: "date"
		}]);

		_InitToken(this.oValueHelpDialog);
		var that = this;
		var fnc = function (oControlEvent) {
			that.aTokens = oControlEvent.getParameter("tokens");
		};
		this.oValueHelpDialog.attachOk(fnc);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);
			var sId = this.oValueHelpDialog.getId();
			// only need to test interactive controls for stable IDs
			// do not check the control tree, as this must not be stable - just check if controls exist
			var oNavigationBar = UI5Element.getElementById(sId + "-navigation");
			qUnit.ok(oNavigationBar, "navigation bar found");
			var oFilterTable = UI5Element.getElementById(sId + "-itemstable");
			qUnit.ok(oFilterTable, "navigation item for table found");
			var oFilterRanges = UI5Element.getElementById(sId + "-ranges");
			qUnit.ok(oFilterRanges, "navigation item for ranged found");
			var oButton = UI5Element.getElementById(sId + "-ok");
			qUnit.ok(oButton, "ok button found");
			oButton = UI5Element.getElementById(sId + "-cancel");
			qUnit.ok(oButton, "cancel button found");
			oButton = UI5Element.getElementById(sId + "-removeSelItems");
			qUnit.ok(oButton, "remove selected items button found");
			var oTable = UI5Element.getElementById(sId + "-table");
			qUnit.ok(oTable, "table found");

			this.oValueHelpDialog._updateView("DESKTOP_CONDITIONS_VIEW");
			var oFilterPanel = UI5Element.getElementById(sId + "-filterPanel");
			qUnit.ok(oFilterPanel, "Filter Panel found");

			that.oValueHelpDialog.detachOk(fnc);
			delete that.aTokens;

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("test setContentWidth", function (qUnit) {
		var done = qUnit.async();
		var sContentWidth = "500px";
		this.oValueHelpDialog.setKey("CompanyCode");
		this.oValueHelpDialog.setContentWidth(sContentWidth);


		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			qUnit.equal(this.oValueHelpDialog.getContentWidth(), sContentWidth);

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("test _addInvisibleMessageSearchAndTableCount", function (qUnit) {
		var done = qUnit.async(),
			fnSpy = sinon.spy(this.oValueHelpDialog, "_addInvisibleMessageSearchAndTableCount");

		_InitRows(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);
			this.oValueHelpDialog.update();
			this.oValueHelpDialog._oTable.getBinding("rows").fireEvent("dataReceived");

			qUnit.equal(fnSpy.called, true, "Invisible message is correctly announced");

			fnSpy.restore();
			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.module("Async tests with Phone mode", {
		before: function () {
			this.orgPhone = Device.system.phone;
		},
		after: function () {
			Device.system.phone = this.orgPhone;
		},
		beforeEach: function () {

			Device.system.phone = true;
			this.oValueHelpDialog = new ValueHelpDialog("VHD");
			this.oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		},
		afterEach: async function() {
			this.oValueHelpDialog.close();
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
			await nextUIUpdate();
		}
	});

	QUnit.test("test open in phone mode", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		var oFilterbar = new SmartFilterBar({
			advancedMode: true
		});

		oFilterbar.setBasicSearch(new SearchField());
		this.oValueHelpDialog.setFilterBar(oFilterbar);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = async function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			qUnit.ok(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn);
			qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 2, "_oSelectedItems should be 2");

			this.oValueHelpDialog._updateView("PHONE_LIST_VIEW");
			await nextUIUpdate();

			qUnit.equal(this.oValueHelpDialog._oRanges, null, "The ranges part should not exist");

			this.oValueHelpDialog._updateView("PHONE_SEARCH_VIEW");
			await nextUIUpdate();

			qUnit.equal(this.oValueHelpDialog._oFilterBar.getVisible(), true, "The Filterbar should by visible");

			this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			await nextUIUpdate();

			qUnit.notEqual(this.oValueHelpDialog._oRanges, null, "The ranges part should exist");

			this.oValueHelpDialog._updateView("PHONE_MAIN_VIEW");
			await nextUIUpdate();

			qUnit.equal(this.oValueHelpDialog._oRanges.getVisible(), false, "The ranges part should be not visible");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("open() should set correct boolean for bCollectiveSearchActive", function(qUnit) {
		var done = qUnit.async();



		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		if (this.oValueHelpDialog._oColSearchBox) {
			this.oValueHelpDialog._oColSearchBox.destroy();
			this.oValueHelpDialog._oColSearchBox = null;
		}

		this.oValueHelpDialog._oColSearchBox = new CollectiveSearchSelect({
			visible: true
		});
		var fnOpened = function () {

			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			qUnit.equal(this.oValueHelpDialog._bIsMdcCollectiveSearch, true);
			qUnit.equal(this.oValueHelpDialog.bCollectiveSearchActive, true);

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("open() when defaultSFBSmartTableConfig is provided to the ValueHelpDialog", function(assert) {
		var done = assert.async();
		var oCreateDefaultSFBSmartTableSpy = this.spy(this.oValueHelpDialog, "_createDefaultSFBSmartTable");
		this.oValueHelpDialog.data("defaultSFBSmartTableConfig", {
			smartFilterBar: function () {
				return new SmartFilterBar({
					advancedMode: true
				});
			},
			valueListAnnotation: {},
			entitySet: "FakeEntitySet",
			cols: [],
			key: "fakeKey",
			description: "FakeDescription",
			displayBehaviour: "idAndDescription",
			autoSearch: true
		});

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			oCreateDefaultSFBSmartTableSpy.restore();
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			assert.equal(oCreateDefaultSFBSmartTableSpy.callCount, 1, "_createDefaultSFBSmartTable should be called once");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test set Filterbar", function (qUnit) {
		var oFilterbar = new SmartFilterBar({
			advancedMode: true
		});

		// basic search text before the filterbar exist
		this.oValueHelpDialog.setBasicSearchText("bar");
		qUnit.equal(this.oValueHelpDialog.getBasicSearchText(), "bar", "basicSearchText should be bar");

		oFilterbar.setBasicSearch(new SearchField());
		this.oValueHelpDialog.setFilterBar(oFilterbar);

		// update the search text
		this.oValueHelpDialog.setBasicSearchText("foo");
		qUnit.equal(this.oValueHelpDialog.getBasicSearchText(), "foo", "basicSearchText should be foo");
	});

	QUnit.module("Testing Private API", {
		beforeEach: function () {
			this.oValueHelpDialog = new ValueHelpDialog();
		},
		afterEach: function () {
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
		}
	});

	QUnit.test("_addToken2Tokenizer does not throw exception if '{' is part of the key", function (assert) {
		var oTokenizerStub = {
			addToken: this.stub(),
			getTokens: this.stub().returns([])
		};

		this.oValueHelpDialog._addToken2Tokenizer("not{escaped{key", "not{escaped{text", oTokenizerStub, "keyField");

		assert.ok(true, "no exception is thrown");
	});

	QUnit.test("_createRanges creates P13nFilterProvider with extended exclude operations", function (assert) {
		// Arrange
		var oPanelFunctionSpy = sinon.spy(P13nFilterPanel.prototype, "_enableEnhancedExcludeOperations");
		this.oValueHelpDialog.setProperty("_enhancedExcludeOperations", true);

		// Act
		this.oValueHelpDialog._createRanges();

		// Assert
		assert.strictEqual(oPanelFunctionSpy.callCount, 1, "Method called once during panel creation");

		// Cleanup
		oPanelFunctionSpy.restore();
	});

	QUnit.test("_initializeTable should be able to create combined columns, as well normal columns", function (assert) {
		// Arrange
		var oColumnModel = new JSONModel({
				cols: [{
					template: ["FirstName", "LastName"]
				}, {
					template: "Age"
				}]
			}),
			done = assert.async();
		this.oValueHelpDialog.setModel(oColumnModel, "columns");

		// Act
		this.oValueHelpDialog.getTableAsync().then(function (oTable) {
			var aColumns = oTable.getColumns(),
			oCol1BindingInfo = aColumns[0].getTemplate().getBindingInfo("text"),
			oCol2BindingInfo = aColumns[1].getTemplate().getBindingInfo("text");

			// Assert
			assert.equal(oCol1BindingInfo.parts[0].path, "FirstName", "template of first column should be created by combination of two columns. The first one FirstName");
			assert.equal(oCol1BindingInfo.parts[1].path, "LastName", "template of first column should be created by combination of two columns. The second one LastName");

			assert.equal(oCol2BindingInfo.parts[0].path, "Age", "template of second column should be created by one property. The property Age");

			done();
		});
	});

	QUnit.test("test _addRemoveTokenByKey when the key is not encoded", function(assert) {
		// Arrange
		var sKey = "test % key";

		// Act
		try {
			this.oValueHelpDialog._addRemoveTokenByKey(sKey);
			assert.ok(true, "No exception thrown");
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}
	});

	QUnit.test("Check if count of tokens is added as ariaDescribedBy to the tokenizer", function(assert) {

		var oValueHelpDialog = this.oValueHelpDialog,
			oRange = {
				"exclude": false
			},
			oToken = new Token().data("range", oRange),
			aTokens = [oToken],
			oVHDSelectedTokens = oValueHelpDialog._oSelectedTokens;

		// Act
		oValueHelpDialog.setTokens(aTokens);

		//Assert
		assert.equal(oVHDSelectedTokens.getAriaDescribedBy().length, 1, "Available description");
		assert.equal(oVHDSelectedTokens.getAriaDescribedBy()[0], oVHDSelectedTokens.getAggregation("_tokensInfo").sId, "Correct id is set");
	});

	QUnit.test("_setToolbarSpacerWidth should be called in the onAfterRendering method so the toobar spacer is correctly set on initial load", function(assert) {
		// Arrange
		sinon.spy(this.oValueHelpDialog, "_setToolbarSpacerWidth");
		sinon.stub(this.oValueHelpDialog, "getContentHeight").returns(true);
		sinon.stub(this.oValueHelpDialog._oButtonOk, "setWidth");


		// Act
		this.oValueHelpDialog.onAfterRendering();

		// Assert
		assert.equal(this.oValueHelpDialog._setToolbarSpacerWidth.calledOnce, true, "ToolbarSpacer has correct width on initial load of the Value Help dialog");
	});

	QUnit.test("Cancel button should have same width as OK button when OK button is wider", function(assert) {
		// Arrange
		var iCancelButtonWidth = 10,
			iOKButtonWidth = 20,
			oOKButtonDomRef = {
				getBoundingClientRect: function () { return {width: iOKButtonWidth};}
			},
			oCancelButtonDomRef = {
				getBoundingClientRect: function () { return {width: iCancelButtonWidth};}
			},
			fnStubCancelButtonDomRef = sinon.stub(this.oValueHelpDialog._oButtonCancel, "getDomRef").returns(oCancelButtonDomRef),
			fnStubOkButtonDomRef = sinon.stub(this.oValueHelpDialog._oButtonOk, "getDomRef").returns(oOKButtonDomRef),
			fnStubPhone = sinon.stub(this.oValueHelpDialog, "_isPhone").returns(true);

		// Act
		this.oValueHelpDialog.onAfterRendering();

		// Assert
		assert.equal(this.oValueHelpDialog._oButtonCancel.getWidth(), iOKButtonWidth + "px", "Cancel Button has same width as OK button");

		// Cleanup
		fnStubCancelButtonDomRef.restore();
		fnStubOkButtonDomRef.restore();
		fnStubPhone.restore();
	});

	QUnit.test("Ok button should have same width as Cancel button when Cancel button is wider", function(assert) {
		// Arrange
		var iCancelButtonWidth = 20,
			iOKButtonWidth = 10,
			oOKButtonDomRef = {
				getBoundingClientRect: function () { return {width: iOKButtonWidth};}
			},
			oCancelButtonDomRef = {
				getBoundingClientRect: function () { return {width: iCancelButtonWidth};}
			},
			fnStubCancelButtonDomRef = sinon.stub(this.oValueHelpDialog._oButtonCancel, "getDomRef").returns(oCancelButtonDomRef),
			fnStubOkButtonDomRef = sinon.stub(this.oValueHelpDialog._oButtonOk, "getDomRef").returns(oOKButtonDomRef),
			fnStubPhone = sinon.stub(this.oValueHelpDialog, "_isPhone").returns(true);

		// Act
		this.oValueHelpDialog.onAfterRendering();

		// Assert
		assert.equal(this.oValueHelpDialog._oButtonOk.getWidth(), iCancelButtonWidth + "px", "Cancel Button has same width as OK button");

		// Cleanup
		fnStubCancelButtonDomRef.restore();
		fnStubOkButtonDomRef.restore();
		fnStubPhone.restore();
	});

	QUnit.test("Title level should be H1", function(assert) {
		// Assert
		assert.strictEqual(this.oValueHelpDialog._oTitle.getLevel(), TitleLevel.H1, "Title level should be correct");
	});

	QUnit.test("Title should be aligned accordingly", function(assert) {
		// Assert
		assert.strictEqual(this.oValueHelpDialog.getCustomHeader().getContentMiddle().length, 1, "Title is positioned in the middle content");
	});

	QUnit.test("test ColumnMenu - should not opened if column sortProperty is empty string", function (assert) {
		// Arrange
		var oColumnModel = new JSONModel({
			cols: [{
				template: "Name"
			}, {
				template: "Age"
			}]
		}),
		done = assert.async();
		this.oValueHelpDialog.setModel(oColumnModel, "columns");

		// Act
		this.oValueHelpDialog.getTableAsync().then(function (oTable) {

			var aColumns = oTable.getColumns();
			aColumns.forEach( function (oColumn, iIndex) {
				assert.strictEqual(null, oColumn.getHeaderMenu(), "ColumnMenu is not opened");
			});

			// Assert
			done();
		});
	});

	QUnit.test("_getSmartTableIgnoredColsNames should return columns that are not in aVisibleColumns array", function (assert) {
		// Arrange
		var aVisibleColumns = ["col1", "col2"];
		var aAllColumns = [{ name: "col1", visible: true }, { name: "col2", visible: true }, { name: "col3", visible: true }, { name: "col4", visible: true }];
		var aExpected = ["col3", "col4"];

		// Act
		var aResult = this.oValueHelpDialog._getSmartTableIgnoredColsNames(aVisibleColumns, aAllColumns);

		// Assert
		assert.deepEqual(aResult, aExpected);
	});

	QUnit.test("_getSmartTableIgnoredColsNames should return description columns if the 'key field' has idOnly or descriptionOnly annotation", function (assert) {
		var aVisibleColumns = ["col1", "col2"];
		var aAllColumns = [{ name: "col1", displayBehaviour: "descriptionOnly", description: "col2", visible: true }, { name: "col2", visible: true }, { name: "col3", visible: true }, { name: "col4", visible: true }];
		var aValueListColumns = [{ name: "col1" }, { name: "col2" }];
		var aExpected = ["col2", "col3", "col4"];

		var aResult = this.oValueHelpDialog._getSmartTableIgnoredColsNames(aVisibleColumns, aAllColumns, aValueListColumns);

		// Assert
		assert.deepEqual(aResult, aExpected);
	});

	QUnit.test("_getSmartTableIgnoredColsNames should return description columns if the 'key field' has idOnly or descriptionOnly annotation but only if the field is in valueListFields", function (assert) {
		var aVisibleColumns = ["col1", "col2", "col5", "col6"];
		var aAllColumns = [{ name: "col1", displayBehaviour: "descriptionOnly", description: "col2", visible: true }, { name: "col2", visible: true }, { name: "col3", visible: true }, { name: "col4", visible: true }, { name: "col5", displayBehaviour: "descriptionOnly", description: "col6", visible: true }, { name: "col6", visible: true }];
		var aValueListColumns = [{ name: "col1" }, { name: "col2" }];
		var aExpected = ["col2", "col3", "col4"];

		var aResult = this.oValueHelpDialog._getSmartTableIgnoredColsNames(aVisibleColumns, aAllColumns, aValueListColumns);

		// Assert
		assert.deepEqual(aResult, aExpected);
	});

	QUnit.test("_getSmartTableIgnoredColsNames should return description columns if the 'key field' has idOnly or descriptionOnly annotation but only if the field is visible", function (assert) {
		var aVisibleColumns = ["col1", "col2", "col5", "col6"];
		var aAllColumns = [{ name: "col1", displayBehaviour: "descriptionOnly", description: "col2", visible: false }, { name: "col2", visible: true }, { name: "col3", visible: true }, { name: "col4", visible: true }, { name: "col5", displayBehaviour: "descriptionOnly", description: "col6", visible: true }, { name: "col6", visible: true }];
		var aValueListColumns = [{ name: "col1" }, { name: "col2" }];
		var aExpected = ["col3", "col4"];

		var aResult = this.oValueHelpDialog._getSmartTableIgnoredColsNames(aVisibleColumns, aAllColumns, aValueListColumns);

		// Assert
		assert.deepEqual(aResult, aExpected);
	});
});

/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/smarttable/SmartTable",
	"sap/ui/comp/util/MultiUnitUtil",
	"sap/m/FlexItemData",
	"sap/m/HBox",
	"sap/m/Link",
	"sap/m/Text",
	"sap/ui/core/Control",
	"sap/ui/core/Element",
	"sap/ui/core/Lib",
	"sap/ui/model/analytics/AnalyticalBinding",
	"sap/ui/model/Context",
	"sap/ui/table/AnalyticalColumn",
	"sap/ui/model/Filter",
	"sap/m/table/Util"
], function(SmartTable, MultiUnitUtil, FlexItemData, HBox, Link, Text, Control, Element, Library, AnalyticalBinding, Context, AnalyticalColumn, Filter, Util) {
	"use strict";

	function getMultiUnitParameters(tableId) {
		return {
			additionalParent: true,
			value: "AmountInTransactionCurrency",
			unit: "TransactionCurrency",
			smartTableId: tableId,
			template: new HBox()
		};
	}

	QUnit.module("sap.ui.comp.util.MultiUnitUtil", {
		afterEach: function() {
			const sTableId = "idView--ItemsST";
			const oTable = Element.getElementById(sTableId);
			const oPopover = Element.getElementById(sTableId + "-multiUnitPopover");

			if (oTable) {
				oTable.destroy();
			}

			if (oPopover) {
				oPopover.destroy();
			}
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(MultiUnitUtil);
	});

	QUnit.test("Shall return a boolean value indicating whether multi-unit " * " value is present for unit", function(assert) {
		assert.strictEqual(MultiUnitUtil.isMultiUnit("*"), true);
		assert.strictEqual(MultiUnitUtil.isMultiUnit("EUR"), false);
		assert.strictEqual(MultiUnitUtil.isNotMultiUnit("*"), false);
		assert.strictEqual(MultiUnitUtil.isNotMultiUnit("EUR"), true);
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- No Binding", async function(assert) {
		var oTemplate = new HBox();
		this.stub(oTemplate, "clone").returns(oTemplate); // mock clone method
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		var oAnalyticalTable = oSmartTable.getTable();
		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		oAnalyticalTable.getBinding.returns(undefined);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		await MultiUnitUtil.openMultiUnitPopover(oEvent, getMultiUnitParameters(sSmartTableId));

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");
		assert.ok(oAnalyticalTable.addDependent.notCalled, "Popover instance not added as dependent");
	});

	QUnit.test("Multi unit with template in settings", async function(assert) {
		const sPath = "/Items";
		const oLink = sinon.createStubInstance(Link); // Dummy link --> Event source

		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});

		const sSmartTableId = "idView--ItemsST";
		const oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		const oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");

		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: new Context(),
			grandTotal: true,
			group: false,
			groupTotal: false,
			groupedColumns: [],
			level: 0
		});

		sinon.stub(oAnalyticalTable, "getBinding");
		const oMockBinding = sinon.createStubInstance(AnalyticalBinding);

		oAnalyticalTable.getBinding.returns(oMockBinding);
		oMockBinding.getPath.returns(sPath);

		const fSpy = sinon.spy(Util, "createOrUpdateMultiUnitPopover");


		const oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		const mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);

		const oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");
		assert.ok(fSpy.calledOnce);

		const oItemsBindingInfo = {
			path: oMockBinding.getPath(),
			filters: [],
			parameters: {
				select: "AmountInTransactionCurrency,TransactionCurrency",
				custom: undefined
			}
		};

		const oSetting = {
			control: oAnalyticalTable,
			grandTotal: true,
			itemsBindingInfo: oItemsBindingInfo,
			listItemContentTemplate: mMultiUnitParameters.template
		};
		assert.ok(fSpy.calledWith(oPopover.getId(), oSetting));
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- No value/unit", async function(assert) {
		var sPath = "/Items";
		var oTemplate = new HBox();
		this.stub(oTemplate, "clone").returns(oTemplate); // mock clone method
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		var oAnalyticalTable = oSmartTable.getTable();
		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);
		mMultiUnitParameters.value = undefined;
		mMultiUnitParameters.unit = "";

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");
		assert.ok(oAnalyticalTable.addDependent.notCalled, "Popover instance not added as dependent");
		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- No AnalyticalInfo for row", async function(assert) {
		var sPath = "/Items";
		var oTemplate = new HBox();
		this.stub(oTemplate, "clone").returns(oTemplate); // mock clone method
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns(undefined);

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		await MultiUnitUtil.openMultiUnitPopover(oEvent, getMultiUnitParameters(sSmartTableId));

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");
		assert.ok(oAnalyticalTable.addDependent.notCalled, "Popover instance not added as dependent");
		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- Grand Total", async function(assert) {
		var sPath = "/Items";
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: new Context(),
			grandTotal: true,
			group: false,
			groupTotal: false,
			groupedColumns: [],
			level: 0
		});

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);
		oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");
		assert.strictEqual(oPopover.getTitle(), Library.getResourceBundleFor("sap.m").getText("TABLE_MULTI_TOTAL_TITLE"), "Popover title set");
		assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredTop", "Popover placement set");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "Popover instance added as dependent");
		assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true, "addDependent called with correct parameters");
		oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(oList, "List created");
		var oListBindingInfo = oList.getBindingInfo("items");
		assert.strictEqual(oListBindingInfo.path, sPath, "List binding path set correctly");
		assert.strictEqual(oListBindingInfo.parameters.select, mMultiUnitParameters.value + "," + mMultiUnitParameters.unit, "List binding parameters set correctly");
		assert.strictEqual(oListBindingInfo.filters.length, 0, "List binding filters set correctly");
		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-value based on the context/analytical info -- Group / Group Total", async function(assert) {
		var sPath = "/Items";
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// create a mock grouped column
		var sGroupedColumn = sSmartTableId + "--DummyColumn";
		var oColumn = new AnalyticalColumn(sGroupedColumn, {
			leadingProperty: "Customer"
		});
		oAnalyticalTable.addColumn(oColumn);

		// create mock group context data
		var oContext = sinon.createStubInstance(Context);
		oContext.getProperty.returns("test");

		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: oContext,
			grandTotal: false,
			group: true,
			groupTotal: true,
			groupedColumns: [
				sGroupedColumn
			],
			level: 0
		});

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);
		oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");
		assert.strictEqual(oPopover.getTitle(), Library.getResourceBundleFor("sap.m").getText("TABLE_MULTI_GROUP_TITLE"), "Popover title set correctly");
		assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom", "Popover placement set correctly");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "Popover instance added as dependent");
		assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true, "addDependent called with correct parameters");
		oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(oList, "List created");
		var oListBindingInfo = oList.getBindingInfo("items");
		assert.strictEqual(oListBindingInfo.path, sPath, "List binding path set correctly");
		assert.strictEqual(oListBindingInfo.parameters.select, mMultiUnitParameters.value + "," + mMultiUnitParameters.unit, "List binding parameters set correctly");
		assert.strictEqual(oListBindingInfo.filters.length, 1, "List binding filters correct length");
		assert.strictEqual(oListBindingInfo.filters[0].sPath, "Customer", "List binding filter set correctly");
		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- Group / Group Total - determine dimension", async function(assert) {
		var sPath = "/Items";
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// create a mock grouped column
		var sGroupedColumn = sSmartTableId + "--DummyColumn";
		var oColumn = new AnalyticalColumn(sGroupedColumn, {
			leadingProperty: "CustomerName"
		});
		oAnalyticalTable.addColumn(oColumn);

		// create a mock grouped column
		var sGroupedColumn2 = sSmartTableId + "--DummyColumn2";
		var oColumn2 = new AnalyticalColumn(sGroupedColumn2, {
			leadingProperty: ""
		});
		oAnalyticalTable.addColumn(oColumn2);

		// create mock group context data
		var oContext = sinon.createStubInstance(Context);
		oContext.getProperty.returns("test");

		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: oContext,
			grandTotal: false,
			group: true,
			groupTotal: false,
			groupedColumns: [
				sGroupedColumn, sGroupedColumn2
			],
			level: 0
		});

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);
		// mock dimension determination data
		oBinding.getAnalyticalInfoForColumn.returns({
			dimensionPropertyName: "Customer"
		});

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);
		oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");
		assert.strictEqual(oPopover.getTitle(), Library.getResourceBundleFor("sap.m").getText("TABLE_MULTI_GROUP_TITLE"), "Popover title set correctly");
		assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom", "Popover placement set correctly");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "Popover instance added as dependent");
		assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true, "addDependent called with correct parameters");
		oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(oList, "List created");
		var oListBindingInfo = oList.getBindingInfo("items");
		assert.strictEqual(oListBindingInfo.path, sPath, "List binding path set correctly");
		assert.strictEqual(oListBindingInfo.parameters.select, mMultiUnitParameters.value + "," + mMultiUnitParameters.unit, "List binding parameters set correctly");
		assert.strictEqual(oListBindingInfo.filters.length, 1, "List binding filters correct length");
		assert.strictEqual(oListBindingInfo.filters[0].sPath, "Customer", "List binding filter set correctly");
		assert.strictEqual(oBinding.getAnalyticalInfoForColumn.calledOnce, true, "Dimension determination called");
		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- Cell total", async function(assert) {
		var sPath = "/Items";
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// create a mock grouped column
		var sGroupedColumn = sSmartTableId + "--DummyColumn";
		var oColumn = new AnalyticalColumn(sGroupedColumn, {
			leadingProperty: "Customer"
		});
		oAnalyticalTable.addColumn(oColumn);

		// create mock group context data
		var oContext = sinon.createStubInstance(Context);
		oContext.getProperty.returns("test");

		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: oContext,
			grandTotal: false,
			group: false,
			groupTotal: false,
			groupedColumns: [],
			level: 0
		});

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);
		var mDimensionDetails = {
			"Customer": {
				"name": "Customer",
				"aAttributeName": [],
				"grouped": false,
				"keyPropertyName": "Customer",
				"analyticalInfo": {
					"name": "CustomerName",
					"visible": true,
					"grouped": false,
					"total": false,
					"sorted": false,
					"sortOrder": "Ascending",
					"inResult": false,
					"formatter": null,
					"dimensionPropertyName": "Customer"
				},
				"textPropertyName": "CustomerName"
			},
			"FiscalYear": {
				"name": "FiscalYear",
				"aAttributeName": [],
				"grouped": false,
				"keyPropertyName": "FiscalYear",
				"analyticalInfo": {
					"name": "FiscalYear",
					"visible": true,
					"grouped": false,
					"total": false,
					"sorted": false,
					"sortOrder": "Ascending",
					"inResult": false,
					"formatter": null,
					"dimensionPropertyName": "FiscalYear"
				}
			},
			"CompanyCode": {
				"name": "CompanyCode",
				"aAttributeName": [],
				"grouped": false,
				"keyPropertyName": "CompanyCode",
				"analyticalInfo": {
					"name": "CompanyName",
					"visible": true,
					"grouped": false,
					"total": false,
					"sorted": false,
					"sortOrder": "Ascending",
					"inResult": false,
					"formatter": null,
					"dimensionPropertyName": "CompanyCode"
				},
				"textPropertyName": "CompanyName"
			}
		};
		oBinding.getDimensionDetails.returns(mDimensionDetails);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);
		oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");
		assert.strictEqual(oPopover.getTitle(), Library.getResourceBundleFor("sap.m").getText("TABLE_MULTI_GROUP_TITLE"), "Popover title set correctly");
		assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom", "Popover placement set correctly");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "Popover instance added as dependent");
		assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true, "addDependent called with correct parameters");
		oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(oList, "List created");
		var oListBindingInfo = oList.getBindingInfo("items");
		assert.strictEqual(oListBindingInfo.path, sPath, "List binding path set correctly");
		assert.strictEqual(oListBindingInfo.parameters.select, mMultiUnitParameters.value + "," + mMultiUnitParameters.unit, "List binding parameters set correctly");
		assert.strictEqual(oListBindingInfo.filters.length, 3, "List binding filters correct length");
		assert.strictEqual(oListBindingInfo.filters[0].sPath, "Customer", "List binding filter set correctly");
		assert.strictEqual(oListBindingInfo.filters[1].sPath, "FiscalYear", "List binding filter set correctly");
		assert.strictEqual(oListBindingInfo.filters[2].sPath, "CompanyCode", "List binding filter set correctly");
		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- Popover already exists", async function(assert) {
		var sPath = "/Items";
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// create a mock grouped column
		var sGroupedColumn = sSmartTableId + "--DummyColumn";
		var oColumn = new AnalyticalColumn(sGroupedColumn, {
			leadingProperty: "Customer"
		});
		oAnalyticalTable.addColumn(oColumn);

		// create mock group context data
		var oContext = sinon.createStubInstance(Context);
		oContext.getProperty.returns("test");

		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: oContext,
			grandTotal: false,
			group: true,
			groupTotal: true,
			groupedColumns: [
				sGroupedColumn
			],
			level: 0
		});

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);
		oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");
		assert.strictEqual(oPopover.getTitle(), Library.getResourceBundleFor("sap.m").getText("TABLE_MULTI_GROUP_TITLE"), "Popover title set correctly");
		assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom", "Popover placement set correctly");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "Popover instance added as dependent");
		assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true, "addDependent called with correct parameters");
		oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(oList, "List created");

		sinon.spy(oPopover, "openBy");
		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);

		assert.strictEqual(oAnalyticalTable.addDependent.calledTwice, false, "addDependent not called twice");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "addDependent called once");
		assert.strictEqual(oPopover.openBy.called, true, "Popover opened");

		var oListBindingInfo = oList.getBindingInfo("items");
		assert.strictEqual(oListBindingInfo.path, sPath, "List binding path set correctly");
		assert.strictEqual(oListBindingInfo.parameters.select, mMultiUnitParameters.value + "," + mMultiUnitParameters.unit, "List binding parameters set correctly");
		assert.strictEqual(oListBindingInfo.filters.length, 1, "List binding filters correct length");
		assert.strictEqual(oListBindingInfo.filters[0].sPath, "Customer", "List binding filter set correctly");
		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- filters already exists", async function(assert) {
		var sPath = "/Items";
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// create a mock grouped column
		var sGroupedColumn = sSmartTableId + "--DummyColumn";
		var oColumn = new AnalyticalColumn(sGroupedColumn, {
			leadingProperty: "Customer"
		});
		oAnalyticalTable.addColumn(oColumn);

		// create mock group context data
		var oContext = sinon.createStubInstance(Context);
		oContext.getProperty.returns("test");

		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: oContext,
			grandTotal: false,
			group: true,
			groupTotal: true,
			groupedColumns: [
				sGroupedColumn
			],
			level: 0
		});

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);
		// mock applicaton filter
		oBinding.aApplicationFilter = [
			new Filter("SomeFilterPath", "EQ", "SomeValue")
		];

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);
		oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");
		assert.strictEqual(oPopover.getTitle(), Library.getResourceBundleFor("sap.m").getText("TABLE_MULTI_GROUP_TITLE"), "Popover title set correctly");
		assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom", "Popover placement set correctly");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "Popover instance added as dependent");
		assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true, "addDependent called with correct parameters");
		oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(oList, "List created");

		sinon.spy(oPopover, "openBy");
		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);

		assert.strictEqual(oAnalyticalTable.addDependent.calledTwice, false, "addDependent not called twice");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "addDependent called once");
		assert.strictEqual(oPopover.openBy.called, true, "Popover opened");

		var oListBindingInfo = oList.getBindingInfo("items");
		assert.strictEqual(oListBindingInfo.path, sPath, "List binding path set correctly");
		assert.strictEqual(oListBindingInfo.parameters.select, mMultiUnitParameters.value + "," + mMultiUnitParameters.unit, "List binding parameters set correctly");
		assert.strictEqual(oListBindingInfo.filters.length, 2, "List binding filters correct length");
		assert.strictEqual(oListBindingInfo.filters[0].sPath, "SomeFilterPath", "List binding filter set correctly");
		assert.strictEqual(oListBindingInfo.filters[1].sPath, "Customer", "List binding filter set correctly");

		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-unit based on the context/analytical info -- custom query paramters already exists", async function(assert) {
		var sPath = "/Items";
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// create a mock grouped column
		var sGroupedColumn = sSmartTableId + "--DummyColumn";
		var oColumn = new AnalyticalColumn(sGroupedColumn, {
			leadingProperty: "Customer"
		});
		oAnalyticalTable.addColumn(oColumn);

		// create mock group context data
		var oContext = sinon.createStubInstance(Context);
		oContext.getProperty.returns("test");

		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: oContext,
			grandTotal: false,
			group: true,
			groupTotal: true,
			groupedColumns: [
				sGroupedColumn
			],
			level: 0
		});

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);
		// mock applicaton filter
		oBinding.aApplicationFilter = [
			new Filter("SomeFilterPath", "EQ", "SomeValue")
		];

		// Stub the "row binding info" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBindingInfo");
		// mock binding info and parameters
		var oBindingInfo = {
			parameters: {
				select: "foo,bar",
				custom: {
					search: "searchText",
					"search-focus": "FocusedField4Search"
				}
			}
		};

		oAnalyticalTable.getBindingInfo.returns(oBindingInfo);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);
		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);
		oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");
		assert.strictEqual(oPopover.getTitle(), Library.getResourceBundleFor("sap.m").getText("TABLE_MULTI_GROUP_TITLE"), "Popover title set correctly");
		assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom", "Popover placement set correctly");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "Popover instance added as dependent");
		assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true, "addDependent called with correct parameters");
		oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(oList, "List created");

		sinon.spy(oPopover, "openBy");
		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);

		assert.strictEqual(oAnalyticalTable.addDependent.calledTwice, false, "addDependent not called twice");
		assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true, "addDependent called once");
		assert.strictEqual(oPopover.openBy.called, true, "Popover opened");

		var oListBindingInfo = oList.getBindingInfo("items");
		assert.strictEqual(oListBindingInfo.path, sPath, "List binding path set correctly");
		assert.strictEqual(oListBindingInfo.parameters.select, mMultiUnitParameters.value + "," + mMultiUnitParameters.unit, "List binding parameters set correctly");
		assert.strictEqual(oListBindingInfo.filters.length, 2, "List binding filters correct length");
		assert.strictEqual(oListBindingInfo.filters[0].sPath, "SomeFilterPath", "List binding filter set correctly");
		assert.strictEqual(oListBindingInfo.filters[1].sPath, "Customer", "List binding filter set correctly");
		assert.ok(oListBindingInfo.parameters.custom);
		assert.strictEqual(oListBindingInfo.parameters.custom.search, "searchText", "List binding custom parameter set correctly");
		assert.strictEqual(oListBindingInfo.parameters.custom["search-focus"], "FocusedField4Search", "List binding custom parameter set correctly");

		oAnalyticalTable.getBinding.restore();
	});

	QUnit.test("Shall open a popover for multi-unit with different parameters", async function(assert) {
		var sPath = "/Items";
		var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
		// Stub parent(s) of event source
		oLink.getParent.returns({
			getParent: function() {
				return new Control();
			}
		});
		// create a dummy instance of SmartTable
		var sSmartTableId = "idView--ItemsST";
		var oSmartTable = new SmartTable(sSmartTableId, {
			tableType: "AnalyticalTable"
		});

		// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
		var oAnalyticalTable = oSmartTable.getTable();
		sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
		// create a mock grouped column
		var sGroupedColumn = sSmartTableId + "--DummyColumn";
		var oColumn = new AnalyticalColumn(sGroupedColumn, {
			leadingProperty: "Customer"
		});
		oAnalyticalTable.addColumn(oColumn);

		// create mock group context data
		var oContext = sinon.createStubInstance(Context);
		oContext.getProperty.returns("test");

		// Return AnalyticalInfo for grandTotals
		oAnalyticalTable.getAnalyticalInfoOfRow.returns({
			context: oContext,
			grandTotal: false,
			group: true,
			groupTotal: true,
			groupedColumns: [
				sGroupedColumn
			],
			level: 0
		});

		// Stub the "row binding" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBinding");
		var oBinding = sinon.createStubInstance(AnalyticalBinding);
		oAnalyticalTable.getBinding.returns(oBinding);
		// mock binding data
		oBinding.getPath.returns(sPath);
		// mock applicaton filter
		oBinding.aApplicationFilter = [
			new Filter("SomeFilterPath", "EQ", "SomeValue")
		];

		// Stub the "row binding info" of table to return necessary mock data
		sinon.stub(oAnalyticalTable, "getBindingInfo");
		// mock binding info and parameters
		var oBindingInfo = {
			parameters: {
				select: "foo,bar",
				custom: {
					search: "searchText",
					"search-focus": "FocusedField4Search"
				}
			}
		};

		oAnalyticalTable.getBindingInfo.returns(oBindingInfo);

		// spies
		sinon.spy(oAnalyticalTable, "addDependent");

		// create additional mock parameter data needed for popover
		var mMultiUnitParameters = getMultiUnitParameters(sSmartTableId);

		var oEvent = {
			getSource: function() {
				return oLink;
			},
			mParameters: {
				id: "__link0-__clone1"
			}
		};

		var oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(!oPopover, "Popover not created yet");
		var oList = Element.getElementById(sSmartTableId + "-multiUnitPopover-detailsList");
		assert.ok(!oList, "List not created yet");

		await MultiUnitUtil.openMultiUnitPopover(oEvent, mMultiUnitParameters);
		oPopover = Element.getElementById(sSmartTableId + "-multiUnitPopover");
		assert.ok(oPopover, "Popover created");

		var oDetailsList = oPopover.getContent()[0];
		var oDetailsListItemsBindingInfo = oDetailsList.getBindingInfo("items");

		var oBindingInfoPopover = {
			path: oBinding.getPath(),
			filters: [
				new Filter("SomeFilterPath", "EQ", "SomeValue"),
				new Filter("Customer", "EQ", "test")
			],
			parameters: {
				select: "AmountInTransactionCurrency,TransactionCurrency",
				custom: {
					search: "searchText",
					"search-focus": "FocusedField4Search"
				}
			}
		};

		assert.strictEqual(oDetailsListItemsBindingInfo.filters.length, 2, "List binding filters correct length");
		assert.deepEqual(oDetailsListItemsBindingInfo.filters, oBindingInfoPopover.filters, "List binding filters set correctly");
		assert.equal(oDetailsListItemsBindingInfo.path, oBindingInfoPopover.path, "List binding path set correctly");
		assert.deepEqual(oDetailsListItemsBindingInfo.parameters, oBindingInfoPopover.parameters, "List binding parameters set correctly");
		assert.strictEqual(oDetailsList.aCustomStyleClasses.length, 1, "List custom style classes correct length");
		assert.ok(oDetailsList.hasStyleClass("sapUiContentPadding"), "Correct styleClass detailsList (sapUiContentPadding)");

		oAnalyticalTable.getBinding.restore();
	});
});

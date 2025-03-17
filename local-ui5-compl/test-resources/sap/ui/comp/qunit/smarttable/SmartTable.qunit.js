/* global QUnit, sinon */
sap.ui.define([
	"sap/base/Log",
	"sap/base/util/deepEqual",
	"sap/base/util/Deferred",
	"sap/f/DynamicPage",
	"sap/m/VBox",
	"sap/m/Bar",
	"sap/m/Button",
	"sap/m/Column",
	"sap/m/ColumnListItem",
	"sap/m/Input",
	"sap/m/Label",
	"sap/m/library",
	"sap/m/MessageBox",
	"sap/m/plugins/DataStateIndicator",
	"sap/m/plugins/CellSelector",
	"sap/m/plugins/CopyProvider",
	"sap/m/Table",
	"sap/m/table/Util",
	"sap/m/Text",
	"sap/m/Toolbar",
	"sap/m/ToolbarSeparator",
	"sap/m/ToolbarSpacer",
	"sap/ui/base/DesignTime",
	"sap/ui/base/Event",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/core/Control",
	"sap/ui/core/CustomData",
	"sap/ui/core/Element",
	"sap/ui/core/Lib",
	'sap/ui/core/library',
	"sap/ui/core/message/Message",
	"sap/ui/core/Messaging",
	"sap/ui/core/mvc/View",
	"sap/ui/core/Theming",
	"sap/ui/core/theming/Parameters",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/ui/comp/odata/ODataType",
	"sap/ui/comp/odata/type/FiscalDate",
	"sap/ui/comp/personalization/Controller",
	"sap/ui/comp/providers/TableProvider",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/smarttable/SmartTable",
	"sap/ui/comp/smartvariants/SmartVariantManagement",
	"sap/ui/comp/state/UIState",
	"sap/ui/comp/util/FilterUtil",
	"sap/ui/comp/util/FormatUtil",
	"sap/ui/Device",
	"sap/ui/events/KeyCodes",
	"sap/ui/export/ExportHandler",
	"sap/ui/export/util/Filter",
	"sap/ui/mdc/p13n/P13nBuilder",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataListBinding",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/v2/ODataTreeBinding",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/performance/trace/FESRHelper",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/table/AnalyticalColumn",
	"sap/ui/table/AnalyticalTable",
	"sap/ui/table/Column",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Table",
	"sap/ui/core/date/UI5Date"
], function(Log, deepEqual, Deferred, DynamicPage, VBox, Bar, Button, Column, ColumnListItem, Input, Label, MLibrary, MessageBox, DataStateIndicator, CellSelector, CopyProvider, Table, TableUtil, Text, Toolbar, ToolbarSeparator, ToolbarSpacer, DesignTime, Event, nextUIUpdate, Control, CustomData, Element, Library, coreLibrary, Message, Messaging, View, Theming, ThemeParameters, MetadataAnalyser, ODataType, FiscalDate, PersonalizationController, TableProvider, SmartFilterBar, SmartTable, SmartVariantManagement, UIState, FilterUtil, FormatUtil, Device, KeyCodes, ExportHandler, ExportFilter, P13nBuilder, Filter, JSONModel, ODataListBinding, ODataModel, ODataTreeBinding, ResourceModel, FESRHelper, qutils, AnalyticalColumn, AnalyticalTable, UIColumn, TreeTable, UITable, UI5Date) {
	"use strict";

	const ButtonType = MLibrary.ButtonType;
	const ToolbarDesign = MLibrary.ToolbarDesign;
	const TitleLevel = coreLibrary.TitleLevel;

	function getModelStubInstance(fClass) {
		var oStub = sinon.createStubInstance(fClass);

		if (typeof fClass.prototype.mixinBindingSupport === 'function') {
			oStub.mixinBindingSupport.callsFake(fClass.prototype.mixinBindingSupport);
		}

		return oStub;
	}

	function timeout(iMillis) {
		return new Promise((resolve) => {
			setTimeout(resolve, iMillis);
		});
	}

	sinon.spy(Log, "error");

	QUnit.module("API", {
		beforeEach: function() {
			this.oSmartTable = new SmartTable({
				useVariantManagement: false,
				useTablePersonalisation: false
			});
		},
		afterEach: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("Constructor", function(assert) {
		assert.ok(this.oSmartTable);
	});

	QUnit.test("#exit", function(assert) {
		const aStubs = [];
		const aReferencedInnerControls = [
			"_oSmartFilter",
			"_oTableProvider",
			"_oPersController",
			"_oVariantManagement",
			"_oEditModel",
			"_oNoData",
			"_oShowHideDetailsButton",
			"_oToolbar",
			"_oSeparator",
			"_oExportButton",
			"_oExportHandler",
			"_oTablePersonalisationButton",
			"_oTemplate",
			"_oColumnHeaderPopover"
		];

		const aPrivateProperties = [
			"_oNumberFormatInstance",
			"_aTableViewMetadata",
			"_mFieldMetadataByKey",
			"_mSelectExpandForGroup",
			"_oCurrentVariant",
			"_aExistingColumns",
			"_mLazyColumnMap",
			"_aColumnKeys",
			"_aDeactivatedColumns",
			"_aAlwaysSelect",
			"_oCustomToolbar",
			"_oP13nDialogSettings",
			"_bMissingColumnsCreated",
			"_oInfoToolbar",
			"_oTableReady",
			"_oView",
			"_oTable"
		];

		aReferencedInnerControls.forEach((sProperty) => {
			const oStub = sinon.stub();

			this.oSmartTable[sProperty] = {
				destroy: oStub,
				detachSearch: () => {},
				detachFilterChange: () => {},
				detachSave: () => {},
				detachAfterSave: () => {},
				isPageVariant: () => false
			};

			/** Exceptional handling for SmartFilterBar */
			if (sProperty === "_oSmartFilter") {
				return;
			}

			aStubs.push(oStub);
		});

		aPrivateProperties.forEach((sProperty) => {
			this.oSmartTable[sProperty] = {};
		});

		aReferencedInnerControls.concat(aPrivateProperties).forEach((sProperty) => assert.ok(this.oSmartTable[sProperty], `Property ${sProperty} is defined`));

		this.oSmartTable.exit();

		aReferencedInnerControls.concat(aPrivateProperties).forEach((sProperty) => assert.ok(this.oSmartTable[sProperty] === null, `Property ${sProperty} has been set to null`));
		assert.ok(aStubs.every((oStub) => oStub.calledOnce), `Function #destroy was called for every inner control`);
	});

	QUnit.test("#setEntitySet", function(assert) {
		this.oSmartTable.setEntitySet("foo");
		assert.strictEqual(this.oSmartTable.getEntitySet(), "foo");
	});

	QUnit.test("#setTableType", function(assert) {
		this.oSmartTable.setTableType("ResponsiveTable");
		assert.strictEqual(this.oSmartTable.getTableType(), "ResponsiveTable");
	});

	QUnit.test("#setUseVariantManagement", function(assert) {
		sinon.stub(this.oSmartTable, "_createVariantManagementControl");

		this.oSmartTable.setUseVariantManagement(true);
		assert.ok(this.oSmartTable.getUseVariantManagement());

		this.oSmartTable.setUseVariantManagement(false);
		assert.ok(!this.oSmartTable.getUseVariantManagement());

		this.oSmartTable._createVariantManagementControl.restore();
	});

	QUnit.test("#setEnableExport", function(assert) {
		this.oSmartTable.setEnableExport(true);
		assert.ok(this.oSmartTable.getEnableExport());

		this.oSmartTable.setEnableExport(false);
		assert.notOk(this.oSmartTable.getEnableExport());

		this.oSmartTable.setEnableExport(undefined);
		assert.ok(this.oSmartTable.getEnableExport());
	});

	QUnit.module("sap.ui.comp.smarttable.SmartTable", {
		beforeEach: function() {
			this.oSmartTable = new SmartTable({
				useVariantManagement: false,
				useTablePersonalisation: false
			});
		},
		afterEach: function() {
			this.oSmartTable?.destroy();
		}
	});

	/**
	 * @deprecated As of version 1.100, replaced by <code>enableExport</code> property.
	 */
	QUnit.test("Shall have useExportToExcel property", function(assert) {
		this.oSmartTable.setUseExportToExcel(true);
		assert.ok(this.oSmartTable.getUseExportToExcel());
		assert.ok(this.oSmartTable.getEnableExport());

		this.oSmartTable.setUseExportToExcel(false);
		assert.notOk(this.oSmartTable.getUseExportToExcel());
		assert.notOk(this.oSmartTable.getEnableExport());

		this.oSmartTable.setUseExportToExcel(undefined);
		assert.ok(this.oSmartTable.getEnableExport());
		assert.ok(this.oSmartTable.getUseExportToExcel());
	});

	/**
	 * @deprecated As of version 1.100
	 */
	QUnit.test("Shall have useExportToExcel property", function(assert) {
		this.oSmartTable.setEnableExport(true);
		assert.ok(this.oSmartTable.getUseExportToExcel());

		this.oSmartTable.setEnableExport(false);
		assert.notOk(this.oSmartTable.getUseExportToExcel());

		this.oSmartTable.setEnableExport(undefined);
		assert.ok(this.oSmartTable.getUseExportToExcel());
	});

	/**
	 * @deprecated As of version 1.120
	 */
	QUnit.test("Shall switch export type", function(assert) {
		var sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);

		this.oSmartTable._bTableSupportsExcelExport = true;
		this.oSmartTable.setExportType("GW");

		assert.ok(this.oSmartTable._oExportButton.isA("sap.m.Button"), "Button for GW export");
		assert.ok(this.oSmartTable._oExportButton.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");

		delete this.oSmartTable._bTableSupportsExcelExport; // irrelevant for UI5Client export
		this.oSmartTable.setExportType(); // default to UI5 Client

		assert.ok(this.oSmartTable._oExportButton.isA("sap.m.OverflowToolbarMenuButton"), "MenuButton for UI5Client export");
		assert.ok(this.oSmartTable._oExportButton.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");
	});

	QUnit.test("Shall have showRowCount property", function(assert) {
		this.oSmartTable.setShowRowCount(true);
		assert.ok(this.oSmartTable.getShowRowCount());

		this.oSmartTable.setShowRowCount(false);
		assert.ok(!this.oSmartTable.getShowRowCount());
	});

	QUnit.test("Shall have showFullScreenButton property", function(assert) {
		this.oSmartTable.setShowFullScreenButton(true);
		assert.ok(this.oSmartTable.getShowFullScreenButton());

		this.oSmartTable.setShowFullScreenButton(false);
		assert.ok(!this.oSmartTable.getShowFullScreenButton());
	});

	QUnit.test("Shall have showTablePersonalisation property", function(assert) {
		this.oSmartTable.setUseTablePersonalisation(true);
		this.oSmartTable.setShowTablePersonalisation(true);
		assert.ok(this.oSmartTable.getShowTablePersonalisation());

		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setShowTablePersonalisation(false);
		assert.ok(!this.oSmartTable.getShowTablePersonalisation());
	});

	QUnit.test("Shall have showVariantManagement property", function(assert) {
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.setShowVariantManagement(false);
		assert.ok(!this.oSmartTable.getShowVariantManagement());

		this.oSmartTable.setUseVariantManagement(true);
		this.oSmartTable.setShowVariantManagement(true);
		assert.ok(this.oSmartTable.getShowVariantManagement());
	});

	QUnit.test("Shall switch keyboardMode of ResponsiveTable based on editable state change", function(assert) {
		var oResponsiveTable = null;
		this.oSmartTable.removeAllItems();
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("ResponsiveTable");
		this.oSmartTable._createTable();

		oResponsiveTable = this.oSmartTable.getTable();
		assert.ok(oResponsiveTable instanceof Table, "table has to be created according to table type ResponsiveTable table");

		assert.ok(!this.oSmartTable.getEditable());
		assert.strictEqual(oResponsiveTable.getKeyboardMode(), "Navigation", "ResponsiveTable is in navigation mode when not editable");

		// Set the table to editable
		this.oSmartTable.setEditable(true);
		assert.ok(this.oSmartTable.getEditable());
		assert.strictEqual(oResponsiveTable.getKeyboardMode(), "Edit", "ResponsiveTable is in edit mode when editable");

		// Set to not editable
		this.oSmartTable.setEditable(false);
		assert.ok(!this.oSmartTable.getEditable());
		assert.strictEqual(oResponsiveTable.getKeyboardMode(), "Navigation", "ResponsiveTable is in navigation mode when not editable");
	});

	QUnit.test("Shall have custom toolbar aggregation", function(assert) {
		var oToolbar1 = new Toolbar();
		var oToolbar2 = new Toolbar();
		this.oSmartTable.setCustomToolbar(oToolbar1);
		assert.ok(this.oSmartTable.getCustomToolbar() === oToolbar1, "set toolbar has to be returned by getter");

		this.oSmartTable.setCustomToolbar(oToolbar2);
		assert.ok(this.oSmartTable.getCustomToolbar() !== oToolbar1, "set toolbar has to be returned by getter");
		assert.ok(this.oSmartTable.getCustomToolbar() === oToolbar2, "set toolbar has to be returned by getter");
	});

	QUnit.test("Shall pass the entity set to the TableProvider", function(assert) {
		var sEntitySet = "COMPANYSet";
		this.oSmartTable.setEntitySet(sEntitySet);
		sinon.stub(this.oSmartTable, "getModel").returns(getModelStubInstance(ODataModel));

		this.oSmartTable._createTableProvider();

		assert.ok(this.oSmartTable._oTableProvider);
		assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
		this.oSmartTable.getModel.restore();
	});

	QUnit.test("Shall trigger initialiseMetadata and call _createTableProvider when entitySet and model are both set", function(assert) {
		var sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);

		sinon.spy(this.oSmartTable, "_initialiseMetadata");
		sinon.spy(this.oSmartTable, "_createTableProvider");
		sinon.spy(this.oSmartTable, "_listenToSmartFilter");
		sinon.spy(this.oSmartTable, "fireInitialise");

		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);

		assert.ok(this.oSmartTable._oTableProvider);
		assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
		assert.ok(this.oSmartTable._initialiseMetadata.called);
		assert.ok(this.oSmartTable._createTableProvider.called);
		assert.ok(this.oSmartTable._listenToSmartFilter.calledOnce);
		assert.ok(this.oSmartTable.fireInitialise.calledOnce);
		assert.strictEqual(this.oSmartTable.bIsInitialised, true);
	});

	QUnit.test("Shall attach to events of Smart/FilterBar only when instance matches the expected control", function(assert) {
		var sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);

		sinon.spy(this.oSmartTable, "_listenToSmartFilter");
		sinon.spy(this.oSmartTable, "_findControl");
		sinon.spy(this.oSmartTable, "_getView");
		sinon.stub(this.oSmartTable, "getParent");
		sinon.stub(this.oSmartTable, "_createToolbarContent");
		var oView = sinon.createStubInstance(View);
		// Set View as parent of SmartTable
		this.oSmartTable.getParent.returns(oView);

		var oBar = new Bar("Bar0");
		oView.byId.returns(oBar); // Mock match
		oView.isA.returns(true); // Mock match
		this.oSmartTable.setSmartFilterId("Bar0");
		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);

		// Check - I
		assert.ok(this.oSmartTable._oTableProvider);
		assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
		assert.ok(this.oSmartTable._listenToSmartFilter.calledOnce);
		assert.ok(this.oSmartTable._findControl.calledOnce);
		assert.ok(this.oSmartTable._findControl.calledWithExactly("Bar0", "sap.ui.comp.filterbar.FilterBar"));
		assert.ok(this.oSmartTable._getView.calledOnce);
		assert.strictEqual(this.oSmartTable._oSmartFilter, undefined);
		assert.strictEqual(this.oSmartTable.bIsInitialised, true);

		// Reset state
		this.oSmartTable._oTableProvider.destroy();
		this.oSmartTable.bIsInitialised = false;
		this.oSmartTable._listenToSmartFilter.reset();
		this.oSmartTable._findControl.reset();
		this.oSmartTable._getView.reset();

		// Create SmartFilterBar instance with global ID
		oBar.destroy();
		oBar = new SmartFilterBar("Bar0");
		oView.byId.returns(oBar);

		// mock execution
		this.oSmartTable._onMetadataInitialised();

		// Check - II
		assert.ok(this.oSmartTable._oTableProvider);
		assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
		assert.ok(this.oSmartTable._listenToSmartFilter.calledOnce);
		assert.ok(this.oSmartTable._findControl.calledOnce);
		assert.ok(this.oSmartTable._findControl.calledWithExactly("Bar0", "sap.ui.comp.filterbar.FilterBar"));
		assert.ok(this.oSmartTable._getView.notCalled);
		assert.strictEqual(this.oSmartTable._oSmartFilter, oBar);
		assert.strictEqual(this.oSmartTable.bIsInitialised, true);

		// Reset state
		this.oSmartTable._oTableProvider.destroy();
		this.oSmartTable.bIsInitialised = false;
		this.oSmartTable._listenToSmartFilter.reset();
		this.oSmartTable._findControl.reset();
		this.oSmartTable._getView.reset();

		// Create SmartFilterBar instance within a view (view specific id)
		oBar.destroy();
		oBar = new SmartFilterBar("__xmlView0--Bar0");
		oView.byId.returns(oBar);

		// mock execution
		this.oSmartTable._onMetadataInitialised();

		// Check - III
		assert.ok(this.oSmartTable._oTableProvider);
		assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
		assert.ok(this.oSmartTable._listenToSmartFilter.calledOnce);
		assert.ok(this.oSmartTable._findControl.calledOnce);
		assert.ok(this.oSmartTable._findControl.calledWithExactly("Bar0", "sap.ui.comp.filterbar.FilterBar"));
		assert.ok(this.oSmartTable._getView.calledOnce);
		assert.strictEqual(this.oSmartTable._oSmartFilter, oBar);
		assert.strictEqual(this.oSmartTable.bIsInitialised, true);

		oBar.destroy();
		this.oSmartTable.getParent.restore();
		this.oSmartTable._createToolbarContent.restore();
	});

	QUnit.test("Shall trigger fireToggleFullScreen", function(assert) {
		this.oSmartTable.setShowFullScreenButton(true);
		var sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);

		sinon.spy(this.oSmartTable, "fireFullScreenToggled");

		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);

		this.oSmartTable._oFullScreenButton.firePress();

		assert.ok(this.oSmartTable.fireFullScreenToggled.calledOnce);
	});

	QUnit.test("FullScreenButton should not overflow on phone", function(assert) {
		var bPhone = Device.system.phone;
		Device.system.phone = false;

		this.oSmartTable.setShowFullScreenButton(true);
		var sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);

		assert.ok(!this.oSmartTable._oFullScreenButton.getLayoutData(), "No overflow on desktop/tablet");

		this.oSmartTable._oFullScreenButton.destroy();
		this.oSmartTable._oFullScreenButton = null;
		Device.system.phone = true;
		this.oSmartTable._addFullScreenButton();

		assert.ok(!!this.oSmartTable._oFullScreenButton.getLayoutData() && this.oSmartTable._oFullScreenButton.getLayoutData().getPriority() === "NeverOverflow", "Overflow on phone");

		Device.system.phone = bPhone;
	});

	QUnit.test("Shall pass the initiallyVisibleFields to TableProvider", function(assert) {
		var sInitiallyVisbleFields, sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);

		sInitiallyVisbleFields = "foo,bar,col2";
		this.oSmartTable.setInitiallyVisibleFields(sInitiallyVisbleFields);
		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);

		assert.ok(this.oSmartTable._oTableProvider);
		assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
		assert.strictEqual(this.oSmartTable._oTableProvider._sInitiallyVisibleFields, sInitiallyVisbleFields);
	});

	QUnit.test("_createToolbar and _createToolbarContent shall create toolbars", function(assert) {
		this.oSmartTable._createToolbar();
		this.oSmartTable.setEnableExport(false);
		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._createToolbarContent();
		assert.ok(this.oSmartTable._oToolbar, "toolbar should always be created");

		this.oSmartTable.setHeader("Test Table");
		assert.equal(this.oSmartTable._oToolbar.getContent().length, 2, "toolbar should contain 2 entries");
		assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "something is visible in the toolbar");
	});

	QUnit.test("_createToolbar and _createToolbarContent shall create toolbar - toolbar is never set to invisible even when no visible content exists", function(assert) {
		this.oSmartTable._createToolbar();
		this.oSmartTable.setEnableExport(false);
		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._createToolbarContent();
		assert.ok(this.oSmartTable._oToolbar, "toolbar should always be created");

		assert.equal(this.oSmartTable._oToolbar.getContent().length, 2, "toolbar should contain 2 entries");
		assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "toolbar is visible without any content being visible");
		this.oSmartTable.setHeader("Test Table");
		assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "something is visible in the toolbar");
	});

	QUnit.test("_createToolbar and _createToolbarContent shall create toolbars - custom toolbar", function(assert) {
		var oCustomToolbar = new Toolbar();
		// Destroy the current instance and create the toolbar inline
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			useVariantManagement: false,
			useTablePersonalisation: false,
			enableExport: false,
			customToolbar: oCustomToolbar
		});
		this.oSmartTable.setHeader("Test Table");
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._createToolbarContent();
		assert.ok(this.oSmartTable._oToolbar === this.oSmartTable._oCustomToolbar, "toolbar reuses the custom toolbar");
		assert.equal(oCustomToolbar.getContent().length, 2, "custom toolbar should contain 2 entries");
		assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "something is visible in the toolbar");
		this.oSmartTable.setHeader();
		assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "toolbar is visible without any content being visible");
	});

	QUnit.test("_createToolbar and _createToolbarContent shall create toolbars - custom toolbar with own spacer", function(assert) {
		var oCustomToolbar = new Toolbar();
		var oToolbarSpacer = new ToolbarSpacer();
		oCustomToolbar.addContent(oToolbarSpacer);
		// Destroy the current instance and create the toolbar inline
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			useVariantManagement: false,
			useTablePersonalisation: false,
			enableExport: false,
			customToolbar: oCustomToolbar
		});
		this.oSmartTable.setHeader("Test Table");
		this.oSmartTable.bIsInitialised = true;

		this.oSmartTable._createToolbarContent();
		assert.ok(this.oSmartTable._oToolbar === this.oSmartTable._oCustomToolbar, "toolbar reuses the custom toolbar");
		assert.equal(oCustomToolbar.getContent().length, 2, "custom toolbar should contain 2 entries");
		assert.equal(oCustomToolbar.getContent()[1], oToolbarSpacer, "custom toolbar should contain orginal spacer");
		assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "something is visible in the toolbar");
		this.oSmartTable.setHeader();
		assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "toolbar is visible without any content being visible");
	});

	QUnit.test("Toolbar - PlaceToolbarInTable", function(assert) {
		var oCustomToolbar = new Toolbar();
		// Destroy the current SmartTable instance and create the toolbar inline
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			header: "Test Table",
			useVariantManagement: false,
			useTablePersonalisation: false,
			enableExport: false,
			customToolbar: oCustomToolbar
		});
		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		var oGridTable = this.oSmartTable.getTable();

		assert.ok(this.oSmartTable._oToolbar === this.oSmartTable._oCustomToolbar, "toolbar reuses the custom toolbar");
		assert.ok(this.oSmartTable.getToolbar() === this.oSmartTable._oCustomToolbar, "toolbar reuses the custom toolbar");
		assert.ok(oGridTable.getExtension().length === 0, "Inner GridTable toolbar is empty");

		this.oSmartTable.setPlaceToolbarInTable(true);
		assert.ok(oGridTable.getExtension().length === 1, "Inner GridTable toolbar is filled");
		assert.ok(oGridTable.getExtension()[0] === oCustomToolbar, "Inner GridTable uses the custom toolbar");
		assert.ok(this.oSmartTable.getToolbar() === oCustomToolbar, "SmartTable toolbar reuses the custom toolbar");

		this.oSmartTable.setPlaceToolbarInTable(false);
		assert.ok(oGridTable.getExtension().length === 0, "Inner GridTable toolbar is empty");
		assert.ok(this.oSmartTable.getToolbar() === oCustomToolbar, "SmartTable toolbar reuses the custom toolbar");
	});

	QUnit.test("Toolbar - PlaceToolbarInTable - MTable", function(assert) {
		// Destroy the current SmartTable instance and create the SmartTable inline
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: false,
			enableExport: false
		});
		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		var oMTable = this.oSmartTable.getTable();

		assert.ok(oMTable.getHeaderToolbar() === this.oSmartTable.getToolbar(), "Inner MTable headerToolbar uses the custom toolbar");
		assert.ok(this.oSmartTable.getToolbar() === this.oSmartTable._oToolbar, "SmartTable toolbar uses inner toolbar");

		this.oSmartTable.setPlaceToolbarInTable(false);
		assert.ok(oMTable.getHeaderToolbar() === null, "Inner MTable headerToolbar is empty");
		assert.ok(this.oSmartTable.getToolbar() === this.oSmartTable._oToolbar, "SmartTable toolbar uses inner toolbar");
	});

	QUnit.test("_createToolbar default design and style", function(assert) {
		assert.equal(this.oSmartTable._oToolbar.getDesign(), "Solid", "GridTable: default toolbar design is set");
		assert.equal(this.oSmartTable._oToolbar.getStyle(), "Clear", "GridTable: default toolbar style is set");
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			tableType: "ResponsiveTable"
		});
		assert.equal(this.oSmartTable._oToolbar.getDesign(), "Solid", "ResponsiveTable: default toolbar design is set");
		assert.equal(this.oSmartTable._oToolbar.getStyle(), "Standard", "ResponsiveTable: default toolbar style is set");
	});

	QUnit.test("test header text features", function(assert) {
		var iCount = 5;
		var oRowBinding = {
			getCount: function() {
				return iCount;
			}
		};
		var fnGetRowBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
		fnGetRowBindingStub.returns(oRowBinding);

		this.oSmartTable.setEnableExport(false);
		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._createToolbarContent();

		var sHeaderText = "myTestHeader";
		this.oSmartTable.setHeader(sHeaderText);
		assert.equal(this.oSmartTable.getHeader(), sHeaderText, "header text has to be equal");

		this.oSmartTable.setShowRowCount(true);

		assert.equal(this.oSmartTable.getHeader(), sHeaderText, "header text has to be equal");
		assert.equal(this.oSmartTable._headerText.getText(), sHeaderText + " (5)", "header text has to contain row count");

		iCount = 0;
		this.oSmartTable._refreshHeaderText();
		assert.equal(this.oSmartTable._headerText.getText(), sHeaderText, "header text does not contain row count when it is 0");

		fnGetRowBindingStub.restore();
	});

	QUnit.test("test header updates", function(assert) {
		this.oSmartTable.setEnableExport(false);
		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._createToolbarContent();
		this.oSmartTable._createTable();

		var fRecreateToolbarContentSpy = sinon.spy(this.oSmartTable, "_createToolbarContent");
		var fRefreshTextSpy = sinon.spy(this.oSmartTable, "_refreshHeaderText");

		var sHeaderText = "myTestHeader";
		this.oSmartTable.setHeader(sHeaderText);
		assert.equal(this.oSmartTable.getHeader(), sHeaderText, "header text has to be equal");
		assert.equal(fRecreateToolbarContentSpy.calledOnce, true, "toolbar content has to be updated when text changes from empty to something");
		assert.equal(fRefreshTextSpy.calledOnce, true, "toolbar content update also leads to a refresh internally");
		assert.equal(this.oSmartTable.getTable().getAriaLabelledBy().length, 1, "ariaLabelledBy association set");
		assert.equal(this.oSmartTable.getTable().getAriaLabelledBy()[0], this.oSmartTable._headerText.getId(), "ariaLabelledBy association set");

		// reset spies
		fRecreateToolbarContentSpy.reset();
		fRefreshTextSpy.reset();

		this.oSmartTable.setShowRowCount(true);
		assert.equal(this.oSmartTable.getHeader(), sHeaderText, "header text has to be equal");
		assert.equal(fRecreateToolbarContentSpy.calledOnce, false, "toolbar content should be unchanged when text changes from one value to another");
		assert.equal(fRefreshTextSpy.calledOnce, true, "text change also leads to a refresh");

		// reset spies
		fRecreateToolbarContentSpy.reset();
		fRefreshTextSpy.reset();

		this.oSmartTable.setHeader("foo");
		assert.equal(this.oSmartTable.getHeader(), "foo", "header text has to be equal");
		assert.equal(fRecreateToolbarContentSpy.called, false, "toolbar content should be unchanged when text changes from one value to another");
		assert.equal(fRefreshTextSpy.calledOnce, true, "text change also leads to a refresh");

		// reset spies
		fRecreateToolbarContentSpy.reset();
		fRefreshTextSpy.reset();

		this.oSmartTable.setHeader("");
		assert.equal(this.oSmartTable.getHeader(), "", "header text has to be equal");
		assert.equal(fRecreateToolbarContentSpy.calledOnce, true, "toolbar content has to be updated when text changes from something to empty");
		assert.equal(fRefreshTextSpy.calledOnce, true, "toolbar content update also leads to a refresh internally");
		assert.equal(this.oSmartTable.getTable().getAriaLabelledBy().length, 0, "ariaLabelledBy association removed as no headerText is applied");
	});

	/**
	 * @deprecated useOnlyOneSolidToolbar Since 1.29. This property has no effect
	 */
	QUnit.test("test excel export enabled state", function(assert) {
		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseOnlyOneSolidToolbar(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.setEnableExport(true);
		this.oSmartTable.setExportType("GW");
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._bTableSupportsExcelExport = true;

		var iCount = 0;
		var oRowBinding = {
			getCount: function() {
				return iCount;
			},
			getLength: function() {
				return iCount;
			},
			isA: function(sType) {
				return false;
			}
		};
		var fnGetRowBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
		fnGetRowBindingStub.returns(oRowBinding);

		this.oSmartTable._createToolbar();
		this.oSmartTable._createToolbarContent();

		this.oSmartTable.updateTableHeaderState();
		assert.equal(this.oSmartTable.getExportType(), "GW", "GW export is configured on the SmartTable");
		assert.equal(this.oSmartTable._oExportButton.getEnabled(), false, "Export to Excel has to be disabled");
		iCount = 100;
		this.oSmartTable._oTable = null;
		this.oSmartTable.updateTableHeaderState();
		assert.equal(this.oSmartTable._oExportButton.getEnabled(), true, "Export to Excel has to be enabled");

		iCount = 0;

		this.oSmartTable._isMobileTable = true;
		this.oSmartTable.updateTableHeaderState();
		assert.equal(this.oSmartTable._oExportButton.getEnabled(), false, "Export to Excel has to be disabled");

		iCount = 100;
		this.oSmartTable.updateTableHeaderState();
		assert.equal(this.oSmartTable._oExportButton.getEnabled(), true, "Export to Excel has to be enabled");

		fnGetRowBindingStub.restore();
	});

	/**
	 * @deprecated useOnlyOneSolidToolbar Since 1.29. This property has no effect
	 */
	QUnit.test("test excel export", function(assert) {
		sinon.stub(window, 'open');

		let iCount = 1;
		let sDownloadUrlType;
		let sUrl = "testUrl";
		const oRowBinding = {
			getLength: function() {
				return iCount;
			},
			getCount: function() {
				return iCount;
			},
			isA: function(sType) {
				return false;
			},
			getDownloadUrl: function(sType) {
				sDownloadUrlType = sType;
				return sUrl;
			},
			isResolved: function() {
				return true;
			}
		};
		const fnGetRowBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
		fnGetRowBindingStub.returns(oRowBinding);

		this.oSmartTable._getRelevantColumnPaths = function() {
			return null;
		};

		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseOnlyOneSolidToolbar(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.setEnableExport(true);
		this.oSmartTable.setExportType("GW");
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._bTableSupportsExcelExport = true;
		this.oSmartTable._createToolbar();
		this.oSmartTable._createToolbarContent();

		this.oSmartTable.attachBeforeExport(function(oEvent) {
			var params = oEvent.getParameter("exportSettings");
			assert.ok(params.url === sUrl, "Requires correct url from binding");
		});

		this.oSmartTable._oExportButton.firePress();
		assert.equal(this.oSmartTable.getExportType(), "GW", "GW export is configured on the SmartTable");
		assert.equal(sDownloadUrlType, "xlsx", "DownloadType has to be xlsx");

		sinon.stub(MessageBox, "confirm");
		iCount = 50000;
		sUrl = "testUrl2";
		this.oSmartTable._oExportButton.firePress();
		var oArgs = MessageBox.confirm.getCall(0).args[1];
		assert.equal(oArgs.actions[0], MessageBox.Action.YES, "MessageBox should show YES");
		assert.equal(oArgs.actions[1], MessageBox.Action.NO, "MessageBox should show NO");
		oArgs.onClose(MessageBox.Action.YES);

		fnGetRowBindingStub.restore();
		MessageBox.confirm.restore();
		window.open.restore();
	});

	QUnit.test("_createExportColumnConfiguration - sap.ui.table.Column", function(assert) {
		var aActualOutput, aColumns, aExpectedOutput, fnGetColumns;

		aColumns = [
			new UIColumn({
				label: new Label({text: "Prop A"}),
				width: "10em"
			}).data("p13nData", {
				leadingProperty: "PropA",
				edmType: "Edm.String",
				type: "string"
			}), new AnalyticalColumn({
				leadingProperty: "PropB",
				label: new Label({text: "Prop B"}),
				width: "320px"
			}).data("p13nData", {
				type: "numeric",
				edmType: "Edm.Decimal"
			}), new Column({
				header: new Text({
					text: "Prop C"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropC",
				edmType: "Edm.Decimal",
				additionalProperty: "SomeProp,SomeCurrency",
				unit: "SomeCurrency",
				precision: "10",
				scale: "3",
				type: "numeric",
				isCurrency: true
			}), new Column({
				header: new Text({
					text: "Prop D"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropD",
				edmType: "Edm.DateTime",
				type: undefined
			}), new Column({
				header: new Text({
					text: "Prop E"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropE",
				edmType: "Edm.Decimal",
				additionalProperty: "SomeUoM",
				unit: "SomeUoM",
				precision: "10",
				scale: "2",
				type: "numeric"
			}), new Column({
				header: new Text({
					text: "Prop F"
				})
			}).data("p13nData", {
				leadingProperty: "PropF",
				edmType: "Edm.Boolean",
				type: "boolean"
			}), new UIColumn({
				label: new Label({text: "Prop G"}),
				width: "15em"
			}).data("p13nData", {
				leadingProperty: "PropG",
				description: "DescriptionProp",
				displayBehaviour: "descriptionAndId",
				edmType: "Edm.String",
				type: "string"
			}), new UIColumn({
				label: new Label({text: "Prop H"}),
				width: "5em"
			}).data("p13nData", {
				leadingProperty: "PropH",
				isDigitSequence: true,
				edmType: "Edm.String",
				type: "string"
			}), new UIColumn({
				label: new Label({text: "Prop I"}),
				hAlign: "Right",
				width: "10em"
			}).data("p13nData", {
				leadingProperty: "PropI",
				edmType: "Edm.String",
				type: "stringdate"
			}), new UIColumn({
				label: new Label({text: "Fiscal Date"}),
				hAlign: "Right"
			}).data("p13nData", {
				typeInstance: new FiscalDate(undefined, undefined, {anotationType: "com.sap.vocabularies.Common.v1.IsFiscalYear"}),
				leadingProperty: "PropJ",
				edmType: "Edm.String",
				type: "date"
			}), new UIColumn({
				label: new Label({text: "DateTimeOffset"})
			}).data("p13nData", {
				leadingProperty: "PropK",
				edmType: "Edm.DateTimeOffset",
				type: "DateTimeOffset"
			}), new UIColumn({
				label: new Label({text: "DateTime"})
			}).data("p13nData", {
				leadingProperty: "PropL",
				edmType: "Edm.DateTime",
				type: "DateTime"
			}), new UIColumn({
				label: new Label({text: "Departure Timezone"})
			}).data("p13nData", {
				leadingProperty: "PropM",
				edmType: "Edm.String",
				isTimezone: true,
				type: "string"
			}), new UIColumn({
				label: new Label({text: "Actual Date"}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropN",
				description: "DescriptionProp",
				displayBehaviour: "descriptionOnly",
				type: "stringdate"
			})
		];

		fnGetColumns = sinon.stub(this.oSmartTable._oTable, "getColumns");
		fnGetColumns.returns(aColumns);

		/* Needs to be spied before the export button is created */
		sinon.spy(this.oSmartTable, "_triggerUI5ClientExport");

		this.oSmartTable.data('useUTCDateTime', true);
		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.bIsInitialised = true;

		aExpectedOutput = [
			{
				label: "Prop A",
				property: "PropA",
				textAlign: "Begin",
				type: "String",
				width: "10em"
			}, {
				label: "Prop B",
				property: "PropB",
				textAlign: "Begin",
				type: "Number",
				width: "320px"
			}, {
				label: "Prop C",
				property: "PropC",
				unitProperty: "SomeCurrency",
				displayUnit: true,
				textAlign: "Right",
				type: "Currency",
				precision: "10",
				scale: "3"
			}, {
				label: "Prop D",
				property: "PropD",
				textAlign: "Right",
				type: "DateTime"
			}, {
				label: "Prop E",
				property: "PropE",
				displayUnit: undefined,
				unitProperty: "SomeUoM",
				textAlign: "Right",
				type: "Number",
				precision: "10",
				scale: "2"
			}, {
				label: "Prop F",
				property: "PropF",
				type: "Boolean",
				trueValue: ODataType.getType("Edm.Boolean").formatValue(true, "string"),
				falseValue: ODataType.getType("Edm.Boolean").formatValue(false, "string")
			}, {
				label: "Prop G",
				property: [
					"PropG", "DescriptionProp"
				],
				template: "{1} ({0})",
				textAlign: "Begin",
				type: "String",
				width: "15em"
			}, {
				label: "Prop H",
				property: "PropH",
				textAlign: "Begin",
				type: "Number",
				width: "5em"
			}, {
				label: "Prop I",
				property: "PropI",
				textAlign: "Right",
				type: "Date",
				inputFormat: "YYYYMMDD",
				width: "10em"
			}, {
				label: "Fiscal Date",
				property: "PropJ",
				textAlign: "Right",
				type: "String"
			}, {
				label: "DateTimeOffset",
				property: "PropK",
				type: "DateTime",
				utc: false
			}, {
				label: "DateTime",
				property: "PropL",
				type: "DateTime",
				utc: true
			}, {
				label: "Departure Timezone",
				property: "PropM",
				type: "Timezone"
			},
			{
				label: "Actual Date",
				property: "PropN",
				type: "Date",
				textAlign: "Right",
				autoScale: false,
				inputFormat: "YYYYMMDD"
			}
		];

		aActualOutput = this.oSmartTable._createExportColumnConfiguration({fileName: 'Table header'});
		assert.ok(deepEqual(aExpectedOutput, aActualOutput, true), 'The export configuration was created as expected');
		fnGetColumns.restore();
	});

	QUnit.test("_createExportColumnConfiguration - sap.m.Column", function(assert) {
		var aActualOutput, aColumns, aExpectedOutput, fnGetColumns, oColumn1, oColumn2, oColumn3;

		oColumn1 = new Column({
			header: new Text({
				text: "Prop C"
			}),
			hAlign: "Right"
		}).data("p13nData", {
			leadingProperty: "PropC",
			additionalProperty: "SomeProp,SomeCurrency",
			unit: "SomeCurrency",
			precision: "10",
			scale: "3",
			type: "number",
			isCurrency: true
		});
		oColumn2 = new Column({
			header: new Text({
				text: "Prop A"
			}),
			hAlign: "Begin"
		}).data("p13nData", {
			leadingProperty: "PropA",
			edmType: "Edm.DateTime",
			type: undefined
		});
		oColumn3 = new Column({
			header: new Text({
				text: "Prop B"
			}),
			hAlign: "Right"
		}).data("p13nData", {
			leadingProperty: [
				"PropB"
			],
			edmType: "Edm.DateTimeOffset",
			type: undefined
		});

		// Set Order of mColumns
		oColumn1.setOrder(2);
		oColumn2.setOrder(0);
		oColumn3.setOrder(1);
		aColumns = [
			oColumn1, oColumn2, oColumn3
		].sort(function(a, b) {
			return a.getOrder() - b.getOrder();
		});

		fnGetColumns = sinon.stub(this.oSmartTable._oTable, "getColumns");
		fnGetColumns.returns(aColumns);

		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._isMobileTable = true;

		aExpectedOutput = [
			{
				label: "Prop A",
				property: "PropA",
				textAlign: "Begin",
				type: "DateTime"
			}, {
				label: "Prop B",
				property: "PropB",
				textAlign: "Right",
				type: "DateTime"
			}, {
				label: "Prop C",
				property: "PropC",
				unitProperty: "SomeCurrency",
				displayUnit: true,
				textAlign: "Right",
				type: "Currency",
				precision: "10",
				scale: "3"
			}
		];

		aActualOutput = this.oSmartTable._createExportColumnConfiguration({fileName: 'Table header'});
		assert.ok(deepEqual(aExpectedOutput, aActualOutput, true), 'The export configuration was created as expected');
		fnGetColumns.restore();
	});

	QUnit.test("_getExportColumnConfiguration", function(assert) {
		const aColumns = [
			new Column({
				header: new Text({
					text: "Prop A"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropA",
				additionalProperty: "SomeProp,SomeCurrency",
				type: "string",
				displayBehaviour: "descriptionOnly",
				description: "SomeCurrency"
			}),

			new Column({
				header: new Text({
					text: "Prop B"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropB",
				type: "date",
				edmType: 'Edm.DateTime'
			}),

			new Column({
				header: new Text({
					text: "Prop C"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropC",
				displayBehaviour: "idOnly"
			}),

			new Column({
				header: new Text({
					text: "Prop D"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropD",
				additionalProperty: "SomeProp",
				description: "SomeProp",
				type: "numeric",
				edmType: "Edm.Decimal",
				displayBehaviour: "idOnly",
				precision: "42",
				scale: "0"
			}),

			new Column({
				header: new Text({
					text: "Prop E"
				})
			}).data("p13nData", {
				leadingProperty: "PropE",
				additionalProperty: "SomeProp",
				description: "SomeProp",
				type: "string",
				edmType: "Edm.String",
				displayBehaviour: "idOnly"
			}),

			new Column({
				header: new Text({
					text: "Prop F"
				})
			}).data("p13nData", {
				leadingProperty: "PropF",
				additionalProperty: "SomeProp",
				description: "SomeProp",
				type: "string",
				edmType: "Edm.String",
				displayBehaviour: "descriptionAndId"
			}),

			new Column({
				header: new Text({
					text: "Prop G"
				})
			}).data("p13nData", {
				leadingProperty: "PropG",
				additionalProperty: "SomeProp",
				description: "SomeProp",
				type: "string",
				edmType: "Edm.String",
				displayBehaviour: "idAndDescription"
			})
		];

		const aExpectedOutput = [
			{
				property: "SomeCurrency",
				type: "String",
				label: "Prop A",
				textAlign: "Right",
				template: "{1}",
				autoScale: false
			},
			{
				property: "PropB",
				type: "Date",
				label: "Prop B",
				textAlign: "Right",
				autoScale: false
			},
			{
				property: "PropC",
				type: "String",
				label: "Prop C",
				textAlign: "Right",
				autoScale: false
			},
			{
				property: "PropD",
				type: "Number",
				label: "Prop D",
				autoScale: true
			},
			{
				property: "PropE",
				type: "String",
				label: "Prop E",
				autoScale: false
			},
			{
				property: ["PropF", "SomeProp"],
				template: "{1} ({0})",
				type: "String",
				label: "Prop F",
				autoScale: false
			},
			{
				property: ["PropG", "SomeProp"],
				template: "{0} ({1})",
				type: "String",
				label: "Prop G",
				autoScale: false
			}
		];

		aColumns.forEach((oColumn, iIndex) => {
			const oActualOutput = this.oSmartTable._getExportColumnConfiguration(oColumn);
			assert.ok(deepEqual(aExpectedOutput[iIndex], oActualOutput, true), 'The export configuration was created as expected');
		});
	});

	QUnit.test("test UI5 client excel export - no visible columns", function(assert) {
		var fnGetColumns = sinon.stub(this.oSmartTable._oTable, "getColumns");
		fnGetColumns.returns([]);

		/* Needs to be spied before the export button is created */
		sinon.spy(this.oSmartTable, "_triggerUI5ClientExport");

		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.setEnableExport(true);
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._isMobileTable = true;
		this.oSmartTable._createToolbar();
		this.oSmartTable._createToolbarContent();

		// Stub MessageBox error
		sinon.stub(MessageBox, "error");

		assert.equal(this.oSmartTable.getExportType(), "UI5ClientPDF", "UI5Client export is the default on the SmartTable");

		// Mock user action
		this.oSmartTable._oExportButton.fireDefaultAction();

		assert.ok(this.oSmartTable._triggerUI5ClientExport.calledOnce, "this.oSmartTable._triggerUI5ClientExport has to be called for UI5Client export");

		assert.ok(MessageBox.error.calledOnce, "Error message was shown due to missing columns");

		fnGetColumns.restore();
		MessageBox.error.restore();
		this.oSmartTable._triggerUI5ClientExport.restore();
	});

	QUnit.test('test UI5 client export - Button "Export As..." ', function(assert) {
		sinon.stub(this.oSmartTable, "_triggerUI5ClientExport");

		this.oSmartTable.setUseTablePersonalisation(false);
		this.oSmartTable.setUseVariantManagement(false);
		this.oSmartTable.setEnableExport(true);
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._isMobileTable = true;
		this.oSmartTable._createToolbar();
		this.oSmartTable._createToolbarContent();

		assert.equal(this.oSmartTable.getExportType(), "UI5ClientPDF", "UI5Client export is the default on the SmartTable");
		assert.ok(this.oSmartTable._oExportButton.isA("sap.m.MenuButton"), "Export button is a MenuButton");

		// Mock user action
		this.oSmartTable._oExportButton.getMenu().getItems()[1].firePress();

		assert.ok(this.oSmartTable._triggerUI5ClientExport.calledOnce, "this.oSmartTable._triggerUI5ClientExport has to be called for UI5Client export");
		assert.ok(this.oSmartTable._triggerUI5ClientExport.firstCall.calledWith(true), "this.oSmartTable._triggerUI5ClientExport has been called with bExportAs equals 'true'");

		this.oSmartTable._triggerUI5ClientExport.restore();
	});

	QUnit.test('test UI5 client export - with export library not loaded', function(assert) {
		var aColumns = [
			new UIColumn({
				label: new Label({text: "Prop A"}),
				width: "10em"
			}).data("p13nData", {
				leadingProperty: "PropA",
				edmType: "Edm.String",
				type: "string"
			})
		];

		assert.expect(2);

		var oSmartTable = this.oSmartTable;
		var oPromise = Promise.reject();
		var fnLoadLibrary = sinon.stub(Library, "load");

		fnLoadLibrary.withArgs({ name: "sap.ui.export" }).returns(oPromise);

		sinon.stub(MessageBox, "error");
		sinon.stub(oSmartTable._oTable, "getColumns").returns(aColumns);

		oSmartTable.setEnableExport(true);
		oSmartTable.bIsInitialised = true;
		oSmartTable._isMobileTable = true;
		oSmartTable._createToolbar();
		oSmartTable._createToolbarContent();

		oSmartTable._triggerUI5ClientExport();

		return oPromise.catch(function() {
			assert.ok(MessageBox.error.calledOnce, "Error MessageBox was called");
			assert.ok(MessageBox.error.calledWith(Library.getResourceBundleFor("sap.ui.comp").getText("SMARTTABLE_ERROR_MISSING_EXPORT_LIBRARY")), "Called with proper error message");

			Library.load.restore();
			MessageBox.error.restore();
			oSmartTable._oTable.getColumns.restore();
		});
	});

	QUnit.test("test UI5 client export with Filter settings for non-initialized column", function(assert) {
		let fnEventHandler;

		const done = assert.async();
		const oTable = this.oSmartTable;

		oTable._oTableProvider = { getExportCapabilities: sinon.stub() };

		sinon.stub(oTable, "_getColumnByKey");
		sinon.stub(oTable, "_getColumnFromP13nMap");
		sinon.stub(oTable, "_createExportColumnConfiguration").returns([{ property: "CompanyCode" }]);
		sinon.stub(oTable, "_getColumnLabel");

		const fnAttachBeforeExportStub = sinon.stub(ExportHandler.prototype, "attachBeforeExport").callsFake((fnCallback) => { fnEventHandler = fnCallback; });
		const fnExportAsStub = sinon.stub(ExportHandler.prototype, "exportAs").callsFake(() => {
			assert.ok(oTable._oTableProvider.getExportCapabilities.calledOnce, "Capabilities requested from TableProvider");
			assert.ok(oTable._getColumnByKey.notCalled, "_getColumnByKey not called");
			assert.ok(oTable._getColumnFromP13nMap.notCalled, "_getColumnFromP13nMap not called");

			fnEventHandler(new Event("beforeExport", oTable /* oSource */, {
				exportSettings: {},
				userSettings: {},
				filterSettings: [new ExportFilter("CompanyCode", { operator: "==", value: "1010" }, "Company Code")]
			}));

			assert.ok(oTable._getColumnByKey.called, "_getColumnByKey called");
			assert.ok(oTable._getColumnFromP13nMap.calledOnce, "_getColumnFromP13nMap called once");

			oTable._getColumnByKey.restore();
			oTable._getColumnFromP13nMap.restore();
			oTable._createExportColumnConfiguration.restore();
			oTable._getColumnLabel.restore();
			fnAttachBeforeExportStub.restore();
			fnExportAsStub.restore();
			done();
		});

		oTable._triggerUI5ClientExport(true /* bExportAs */);
	});

	QUnit.test("test UI5 client export with Filter settings for non-initialized column", function(assert) {
		let fnEventHandler;

		const done = assert.async();
		const oTable = this.oSmartTable;

		oTable._oTableProvider = { getExportCapabilities: sinon.stub() };

		sinon.stub(oTable, "_getColumnByKey");
		sinon.stub(oTable, "_getColumnFromP13nMap");
		sinon.stub(oTable, "_createExportColumnConfiguration").returns([{ property: "CompanyCode" }]);
		sinon.stub(oTable, "_getColumnLabel");

		const fnAttachBeforeExportStub = sinon.stub(ExportHandler.prototype, "attachBeforeExport").callsFake((fnCallback) => { fnEventHandler = fnCallback; });
		const fnExportAsStub = sinon.stub(ExportHandler.prototype, "exportAs").callsFake(() => {
			assert.ok(oTable._oTableProvider.getExportCapabilities.calledOnce, "Capabilities requested from TableProvider");
			assert.ok(oTable._getColumnByKey.notCalled, "_getColumnByKey not called");
			assert.ok(oTable._getColumnFromP13nMap.notCalled, "_getColumnFromP13nMap not called");

			fnEventHandler(new Event("beforeExport", oTable /* oSource */, {
				exportSettings: {},
				userSettings: {},
				filterSettings: [new ExportFilter("CompanyCode", { operator: "==", value: "1010" }, "Company Code")]
			}));

			assert.ok(oTable._getColumnByKey.called, "_getColumnByKey called");
			assert.ok(oTable._getColumnFromP13nMap.calledOnce, "_getColumnFromP13nMap called once");

			oTable._getColumnByKey.restore();
			oTable._getColumnFromP13nMap.restore();
			oTable._createExportColumnConfiguration.restore();
			oTable._getColumnLabel.restore();
			fnAttachBeforeExportStub.restore();
			fnExportAsStub.restore();
			done();
		});

		oTable._triggerUI5ClientExport(true /* bExportAs */);
	});

	QUnit.test('test table settings button - open/close behaviour', async function(assert) {
		this.oSmartTable.setUseTablePersonalisation(true);
		this.oSmartTable._addTablePersonalisationToToolbar();
		this.oSmartTable._createPersonalizationController();
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._isMobileTable = true;

		var oDialogSpy = sinon.stub(this.oSmartTable._oPersController, "openDialog");

		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		assert.ok(this.oSmartTable._oTablePersonalisationButton, "Personalisation button exists.");
		assert.equal(FESRHelper.getSemanticStepname(this.oSmartTable._oTablePersonalisationButton, "press"), "sc:tbl:p13n", "Correct FESR StepName");

		this.oSmartTable._oTablePersonalisationButton.firePress();
		assert.ok(oDialogSpy.calledOnce, "Dialog was opened.");
		assert.ok(this.oSmartTable._bPersDialogOpen, "Personalisation Dialog open/close flag is set to true.");

		await nextUIUpdate();

		this.oSmartTable._oTablePersonalisationButton.firePress();
		assert.ok(oDialogSpy.calledOnce, "openDialog() was not called again.");
		assert.ok(this.oSmartTable._bPersDialogOpen, "Personalisation Dialog open/close flag is set to true.");

		this.oSmartTable._oPersController.fireDialogAfterClose();
		assert.notOk(this.oSmartTable._bPersDialogOpen, "Personalisation Dialog open/close flag is set to false.");

		await nextUIUpdate();
		this.oSmartTable._oTablePersonalisationButton.firePress();
		assert.ok(oDialogSpy.calledTwice, "Dialog was openend again.");
		assert.ok(this.oSmartTable._bPersDialogOpen, "Personalisation Dialog open/close flag is set to true.");

		oDialogSpy.restore();
	});

	/**
	 * @deprecated Since 1.56. Use <code>beforeRebindTable</code> event to attach/listen to the binding "events" directly
	 */
	QUnit.test("test dataRequested and dataReceived function", function(assert) {
		Log.error.reset();
		var oBindingParameters = null;
		var mParameters = {
			"data": [],
			"foo": "bar"
		};
		var oEvent = {
			getParameter: function(sParam) {
				return mParameters[sParam];
			},
			getParameters: function() {
				return mParameters;
			}
		};

		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
		var fDataRequestedSpy = sinon.stub(this.oSmartTable, "fireDataRequested");
		var fDataReceivedSpy = sinon.stub(this.oSmartTable, "fireDataReceived");

		this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to enable binding
		this.oSmartTable.rebindTable();
		assert.ok(Log.error.calledOnce, "error is logged, since rebindTable is called before the SmartTable control has been initialized");

		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		this.oSmartTable.rebindTable();

		assert.ok(this.oSmartTable._bIsTableBound, "table has to be bound");
		// busy handling will now be done by the table internally
		assert.ok(fBindStub.calledOnce, "binding triggered on the internal table");

		oBindingParameters = fBindStub.args[0][0];

		assert.ok(oBindingParameters, "binding parameters are set");

		oBindingParameters.events.dataRequested(oEvent);
		assert.ok(fDataRequestedSpy.calledOnce, "dataRequested event was triggered due to binding event");
		assert.ok(fDataRequestedSpy.calledWith(mParameters), "dataRequested event was triggered due to binding event");

		oBindingParameters.events.dataReceived(oEvent);
		assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered due to binding event");

		// Reset spy before simulating muliple binding events
		fDataRequestedSpy.reset();
		fDataReceivedSpy.reset();

		// Simulate 3 binding data request/response calls (e.g. paging)
		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);

		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);

		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);

		// event should be fired accordingly
		assert.equal(fDataRequestedSpy.callCount, 3, "dataRequested event was triggered 4 times due to binding event");
		assert.equal(fDataReceivedSpy.callCount, 3, "dataReceived event was triggered 4 times due to binding event");

		// Reset spy before simulating __simulateAsyncAnalyticalBinding binding events
		fDataRequestedSpy.reset();
		fDataReceivedSpy.reset();

		// Simulate 2 AnalyticalBinding data request/response calls, first one with __simulateAsyncAnalyticalBinding set
		mParameters["__simulateAsyncAnalyticalBinding"] = true;
		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);
		delete mParameters["__simulateAsyncAnalyticalBinding"];
		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);

		assert.ok(fDataRequestedSpy.calledOnce, "dataRequested event was triggered due to binding event");
		assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered just once due to binding event (__simulateAsyncAnalyticalBinding call was ignored)");

		fDataReceivedSpy.restore();
		fDataRequestedSpy.restore();
		fBindStub.restore();
	});

	/**
	 * @deprecated Since 1.56. Use <code>beforeRebindTable</code> event to attach/listen to the binding "events" directly
	 */
	QUnit.test("test dataRequested and dataReceived function - with external events registration", function(assert) {
		var oBindingParameters = null;
		var mParameters = {
			"data": [],
			"foo": "bar"
		};
		var oEvent = {
			getParameter: function(sParam) {
				return mParameters[sParam];
			},
			getParameters: function() {
				return mParameters;
			}
		};

		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
		var fDataRequestedSpy = sinon.stub(this.oSmartTable, "fireDataRequested");
		var fDataReceivedSpy = sinon.stub(this.oSmartTable, "fireDataReceived");
		var fChangeSpy = sinon.spy(this.oSmartTable, "_onBindingChange");
		var fExternalDataRequestedSpy = sinon.stub();
		var fExternalDataReceivedSpy = sinon.stub();

		// Register events parameter - externally!
		this.oSmartTable.attachBeforeRebindTable(function(oEvt) {
			var mBindingParams = oEvt.getParameter("bindingParams");
			mBindingParams.events["dataRequested"] = fExternalDataRequestedSpy;
			mBindingParams.events["dataReceived"] = fExternalDataReceivedSpy;
		});

		this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to enable binding
		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		this.oSmartTable.rebindTable();

		assert.ok(this.oSmartTable._bIsTableBound, "table has to be bound");
		// busy handling will now be done by the table internally
		assert.ok(fBindStub.calledOnce, "binding triggered on the internal table");

		oBindingParameters = fBindStub.args[0][0];

		assert.ok(oBindingParameters, "binding parameters are set");

		oBindingParameters.events.dataRequested(oEvent);
		// internal
		assert.ok(fDataRequestedSpy.calledOnce, "dataRequested event was triggered due to binding event");
		assert.ok(fDataRequestedSpy.calledWith(mParameters), "dataRequested event was triggered due to binding event");
		// external
		assert.ok(fExternalDataRequestedSpy.calledOnce, "external dataRequested event was triggered due to binding event");
		assert.ok(fExternalDataRequestedSpy.calledWith(oEvent), "external dataRequested event was triggered due to binding event");

		oBindingParameters.events.dataReceived(oEvent);
		// internal
		assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered due to binding event");
		// external
		assert.ok(fExternalDataReceivedSpy.calledOnce, "dataReceived event was triggered due to binding event");

		// Reset spy before simulating muliple binding events
		fDataRequestedSpy.reset();
		fDataReceivedSpy.reset();
		fExternalDataRequestedSpy.reset();
		fExternalDataReceivedSpy.reset();

		// Simulate 3 binding data request/response calls (e.g. paging)
		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);

		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);

		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);

		// event should be fired accordingly
		// internal
		assert.equal(fDataRequestedSpy.callCount, 3, "dataRequested event was triggered 3 times due to binding event");
		assert.equal(fDataReceivedSpy.callCount, 3, "dataReceived event was triggered 3 times due to binding event");
		// external
		assert.equal(fExternalDataRequestedSpy.callCount, 3, "external dataRequested event was triggered 3 times due to binding event");
		assert.equal(fExternalDataReceivedSpy.callCount, 3, "external dataReceived event was triggered 3 times due to binding event");

		// Reset spy before simulating __simulateAsyncAnalyticalBinding binding events
		fDataRequestedSpy.reset();
		fDataReceivedSpy.reset();
		fExternalDataRequestedSpy.reset();
		fExternalDataReceivedSpy.reset();

		// Simulate 2 AnalyticalBinding data request/response calls, first one with __simulateAsyncAnalyticalBinding set
		mParameters["__simulateAsyncAnalyticalBinding"] = true;
		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);
		delete mParameters["__simulateAsyncAnalyticalBinding"];
		oBindingParameters.events.dataRequested(oEvent);
		oBindingParameters.events.dataReceived(oEvent);

		// internal
		assert.ok(fDataRequestedSpy.calledOnce, "dataRequested event was triggered due to binding event");
		assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered just once due to binding event (__simulateAsyncAnalyticalBinding call was ignored)");

		// external
		assert.ok(fExternalDataRequestedSpy.calledTwice, "external dataRequested event was triggered as many times as the binding");
		assert.ok(fExternalDataReceivedSpy.calledTwice, "external dataReceived event was triggered twice due to binding event (__simulateAsyncAnalyticalBinding call was NOT ignored)");

		// Binding change event test
		assert.ok(fChangeSpy.notCalled);
		oBindingParameters.events.change(oEvent);
		assert.ok(fChangeSpy.calledOnce);

		fDataReceivedSpy.restore();
		fDataRequestedSpy.restore();
		fBindStub.restore();
	});

	QUnit.test("test _getColumnLeadingProperty", function(assert) {
		var aColumns = [
			new UIColumn({label: new Label({text:  "Prop A"})}).data("p13nData", {columnKey: "A1", leadingProperty: "PropA"}),
			new UIColumn({label: new Label({text:  "Prop A"})}).data("p13nData", {columnKey: "A2"}),
			new AnalyticalColumn({leadingProperty: "PropB", label: new Label({text:  "Prop B"})}).data("p13nData", {columnKey: "B1"}),
			new AnalyticalColumn({label: new Label({text:  "Prop B"})}).data("p13nData", {columnKey: "B2", leadingProperty: "PropB"}),
			new AnalyticalColumn({label: new Label({text:  "Prop B"})}).data("p13nData", {columnKey: "B3"}),
			new Column().data("p13nData", {columnKey: "C1", leadingProperty: "PropC"}),
			new Column().data("p13nData", {columnKey: "C2"})
		];
		var aLeadingProperties = ["PropA", null, "PropB", "PropB", null, "PropC", null];
		for (var i = 0; i < aLeadingProperties.length; i++) {
			if (!aLeadingProperties[i]) {
				assert.ok(!this.oSmartTable._getColumnLeadingProperty(aColumns[i]), "_getColumnLeadingProperty returns expected value for column " + i);
			} else {
				assert.equal(this.oSmartTable._getColumnLeadingProperty(aColumns[i]), aLeadingProperties[i], "_getColumnLeadingProperty returns expected value for column " + i);
			}
		}

		assert.equal(this.oSmartTable._getColumnLeadingProperty(aColumns[2], {columnKey: "D1", leadingProperty: "PropD"}), "PropB", "_getColumnLeadingProperty returns expected value when P13nData is explicitly given");
		assert.equal(this.oSmartTable._getColumnLeadingProperty(aColumns[3], {columnKey: "D1", leadingProperty: "PropD"}), "PropD", "_getColumnLeadingProperty returns expected value when P13nData is explicitly given");

		for (var j = 0; j < aColumns.length; j++) {
			aColumns[j].destroy();
		}
	});

	QUnit.test("test inner tables rowsUpdated event", function(assert) {
		var bFunctionWasCalled = false;
		this.oSmartTable.setTableType("AnalyticalTable");
		this.oSmartTable._createTable();
		this.oSmartTable._setExcelExportEnableState = function() {
			bFunctionWasCalled = true;
		};
		this.oSmartTable._oTable.fireRowsUpdated();
		assert.ok(bFunctionWasCalled, "smartTable _setExcelExportEnableState was called by inner table rowsUpdated event");
	});

	QUnit.test("test _setExcelExportEnableState", function(assert) {
		const oTable = this.oSmartTable;

		oTable.setEnableExport(true);
		oTable._createToolbar();
		oTable._createToolbarContent();

		assert.ok(oTable._oExportButton, "ExportButton is defined");
		assert.notOk(oTable._bDataLoadPending, "Data load flag is not set");
		assert.notOk(oTable._oExportButton.getEnabled(), "Button is disabled");

		sinon.stub(TableUtil, "isExportable").returns(true);
		oTable._setExcelExportEnableState();

		assert.notOk(oTable._bDataLoadPending, "Data load flag is not set");
		assert.ok(oTable._oExportButton.getEnabled(), "Button is enabled");
		assert.ok(TableUtil.isExportable.calledOnce, "Function isExportable was called");

		oTable._bDataLoadPending = true;
		oTable._setExcelExportEnableState();

		assert.ok(oTable._bDataLoadPending, "Data load flag is set");
		assert.notOk(oTable._oExportButton.getEnabled(), "Button is disabled");
		assert.ok(TableUtil.isExportable.calledOnce, "Function isExportable was not called again while _bDataLoadPending flag is pending");

		TableUtil.isExportable.returns(false);
		oTable._bDataLoadPending = false;
		oTable._setExcelExportEnableState();

		assert.notOk(oTable._oExportButton.getEnabled(), "Button is disabled");
		assert.ok(TableUtil.isExportable.calledTwice, "Function isExportable was called again");

		TableUtil.isExportable.restore();
	});

	QUnit.test("test apply and fetch variant", function(assert) {
		var oTestVariant = {};
		this.oSmartTable._oSmartFilter = sinon.createStubInstance(SmartFilterBar);
		this.oSmartTable._oTable = {
			setShowOverlay: function() {
			},
			getColumns: function() {
				return [];
			},
			removeAllColumns: function() {
			}
		};

		var bTableReseted = false;
		this.oSmartTable._oPersController = {
			resetPersonalization: function() {
				bTableReseted = true;
			},
			setPersonalizationData: function() {
				// foo
			},
			getColumnMap: function () {
				return {};
			}
		};

		this.oSmartTable.applyVariant(oTestVariant);
		var oResultVariant = this.oSmartTable.fetchVariant();
		assert.equal(oResultVariant, oTestVariant, "applied variant has to equal fetched variant");

		this.oSmartTable.applyVariant("STANDARD");
		oResultVariant = this.oSmartTable.fetchVariant();
		assert.deepEqual(oResultVariant, {}, "applied STANDARD variant should return empty variant");
		assert.ok(bTableReseted, "applying STANDARD variant should reset table");
	});

	QUnit.test("test apply for application standard", function(assert) {
		var oTestVariant = {
			foo: "bar"
		};
		this.oSmartTable._oSmartFilter = sinon.createStubInstance(SmartFilterBar);
		this.oSmartTable._oTable = {
			setShowOverlay: function() {
			},
			getColumns: function() {
				return [];
			},
			removeAllColumns: function() {
			}
		};

		this.oSmartTable._oPersController = {
			resetPersonalization: function() {
			},
			setPersonalizationData: function() {
				// foo
			},
			getColumnMap: function () {
				return {};
			}
		};

		this.oSmartTable.applyVariant(oTestVariant, "STANDARD");
		var oResultVariant = this.oSmartTable.fetchVariant();
		assert.equal(oResultVariant, oTestVariant, "applied application standard variant has to equal fetched variant");

		this.oSmartTable.applyVariant({});
		oResultVariant = this.oSmartTable.fetchVariant();
		assert.deepEqual(oResultVariant, {}, "applied any variant should return that variant and not merge application variant");
	});

	QUnit.test("test add Spacer", function(assert) {
		this.oSmartTable._createToolbar();
		this.oSmartTable._addSpacerToToolbar();

		assert.equal(this.oSmartTable._oToolbar.getContent().length, 1, "one item has to be added to the toolbar");
		assert.ok(this.oSmartTable._oToolbar.getContent()[0] instanceof ToolbarSpacer, "ToolbarSpacer has to be added to toolbar");
		assert.ok(this.oSmartTable._oToolbar.getContent()[0].hasStyleClass("sapUiCompSmartTableToolbarContent"), "sapUiCompSmartTableToolbarContent added to the toolbar spacer");

		delete this.oSmartTable._oToolbar;
		this.oSmartTable.setCustomToolbar(new Toolbar());
		this.oSmartTable._createToolbar();
		var oSpacer = new ToolbarSpacer();
		this.oSmartTable._oCustomToolbar.addContent(oSpacer);
		this.oSmartTable._addSpacerToToolbar();

		assert.equal(this.oSmartTable._oCustomToolbar.getContent().length, 1, "toolbar has to contain one item");
		assert.equal(this.oSmartTable._oCustomToolbar.getContent()[0], oSpacer, "item has to be original toolbarSpacer");

	});

	QUnit.test("test smartTable setToolbarStyleClass", function(assert) {
		var sTestStyleClass = "DummyStyleClass";

		// Destroy the current instance and create the toolbar inline
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			useVariantManagement: false,
			useTablePersonalisation: false,
			toolbarStyleClass: sTestStyleClass
		});

		assert.equal(this.oSmartTable.getToolbarStyleClass(), sTestStyleClass, "style class has to be present in the table");
		assert.ok(this.oSmartTable._oToolbar.aCustomStyleClasses.indexOf(sTestStyleClass) > -1, "style class has to be set correctly on toolbar");
	});

	QUnit.test("test _getChangeStatus", function(assert) {
		var returnedChangeStatus = this.oSmartTable._getChangeStatus();
		assert.equal(returnedChangeStatus, "ModelChanged", "change status has to be correct");

		returnedChangeStatus = this.oSmartTable._getChangeStatus({
			sort: "Unchanged",
			filter: "Unchanged",
			columns: "Unchanged",
			group: "Unchanged"
		});
		assert.equal(returnedChangeStatus, "Unchanged", "change status has to be correct");

		returnedChangeStatus = this.oSmartTable._getChangeStatus({
			sort: "Unchanged",
			filter: "Unchanged",
			columns: "TableChanged",
			group: "Unchanged"
		});
		assert.equal(returnedChangeStatus, "TableChanged", "change status has to be correct");

		returnedChangeStatus = this.oSmartTable._getChangeStatus({
			sort: "Unchanged",
			filter: "Unchanged",
			columns: "TableChanged",
			group: "ModelChanged"
		});
		assert.equal(returnedChangeStatus, "ModelChanged", "change status has to be correct");

	});

	QUnit.test("test _persistPersonalization", function(assert) {
		var sViewId;
		var oFinalParams;
		this.oSmartTable._oVariantManagement = {
			getCurrentVariantId: function() {
				return null;
			},
			fireSave: function(oParams) {
				oFinalParams = oParams;
			},
			detachInitialise: function() {
			},
			detachAfterSave: function() {
			},
			detachSave: function() {
			},
			isPageVariant: function() {
			},
			getViewIdByName: function(s) {
				return sViewId;
			}
		};

		sinon.spy(this.oSmartTable._oVariantManagement, "getCurrentVariantId");
		sinon.spy(this.oSmartTable._oVariantManagement, "getViewIdByName");

		sViewId = null;
		this.oSmartTable._persistPersonalisation();
		assert.deepEqual(oFinalParams, {
			name: "Personalisation",
			implicit: true,
			global: false,
			overwrite: false,
			key: sViewId,
			def: true
		}, "fire save has to be called with correct parameters");

		assert.ok(this.oSmartTable._oVariantManagement.getCurrentVariantId.calledOnce, "should be called only once");

		sViewId = "123";
		this.oSmartTable._persistPersonalisation();
		assert.deepEqual(oFinalParams, {
			name: "Personalisation",
			implicit: true,
			global: false,
			overwrite: true,
			key: sViewId,
			def: true
		}, "fire save has to be called with correct parameters");

		assert.ok(this.oSmartTable._oVariantManagement.getCurrentVariantId.calledOnce, "should be called only once");

		sViewId = "123";
		this.oSmartTable._persistPersonalisation();
		assert.deepEqual(oFinalParams, {
			name: "Personalisation",
			implicit: true,
			global: false,
			overwrite: true,
			key: sViewId,
			def: true
		}, "fire save has to be called with correct parameters");

		assert.ok(this.oSmartTable._oVariantManagement.getCurrentVariantId.calledOnce, "should be called only once");
		assert.ok(this.oSmartTable._oVariantManagement.getViewIdByName.calledThrice, "should be called each time");
	});

	QUnit.test("variant should not be saved when sap.ui.base.DesignTime.isDesignModeEnabled() === true", function(assert) {
		var sVariantKey;
		var oDesignModeStub = sinon.stub(DesignTime, "isDesignModeEnabled").returns(true);
		this.oSmartTable._oVariantManagement = {
			getCurrentVariantId: function() {
				return sVariantKey;
			},
			fireSave: function() {
			},
			detachInitialise: function() {
			},
			detachAfterSave: function() {
			},
			detachSave: function() {
			},
			isPageVariant: function() {
			},
			getViewIdByName: function(s) {
				return "";
			}
		};

		var fnVariantManagementFireSaveSpy = sinon.spy(this.oSmartTable._oVariantManagement, "fireSave");

		sVariantKey = "123";
		this.oSmartTable._persistPersonalisation();
		assert.ok(fnVariantManagementFireSaveSpy.notCalled, "fireSave not called on SmartVariantManagement");

		oDesignModeStub.restore();
		this.oSmartTable._persistPersonalisation();
		assert.ok(fnVariantManagementFireSaveSpy.called, "fireSave called on SmartVariantManagement, since sap.ui.base.DesignTime.isDesignModeEnabled() === false");
	});

	QUnit.test("test _createVariantManagementControl function without smartVariant association", function(assert) {
		this.oSmartTable.setUseVariantManagement(true);
		this.oSmartTable.setPersistencyKey("foo");

		this.oSmartTable._createVariantManagementControl();

		var oControl = this.oSmartTable._oVariantManagement.getPersonalizableControls()[0].getControl();

		assert.equal(this.oSmartTable._oVariantManagement.getPersonalizableControls()[0].getType(), "table", "PersonalizableInfo.type has to be set correctly");
		assert.equal(this.oSmartTable._oVariantManagement.getPersonalizableControls()[0].getKeyName(), "persistencyKey", "PersonalizableInfo.keyName has to be set correctly");
		assert.ok(oControl === this.oSmartTable.getId(), "PersonalizableInfo Control has to be set to smarttable");

		assert.equal(this.oSmartTable._oVariantManagement.getShowShare(), true, "SmartVariantManagement has to be instantiated correctly - showShare");

		this.oSmartTable._oVariantManagement._initialize({}, this.oSmartTable._oVariantManagement._getControlWrapper(Element.getElementById(oControl)));
		assert.equal(this.oSmartTable._oCurrentVariant, "STANDARD", "current variant has to be initialized");
	});

	QUnit.test("test _createVariantManagementControl function with a smartVariant association having id", function(assert) {
		this.oSmartTable.setUseVariantManagement(true);
		this.oSmartTable.setPersistencyKey("foo");

		this.oSmartTable.setSmartVariant("SmartTableVariant");
		var oVariant = new SmartVariantManagement(this.oSmartTable.getSmartVariant(), {
			showShare: true
		});

		this.oSmartTable._createVariantManagementControl();
		assert.equal(this.oSmartTable._oVariantManagement, oVariant, "Correct SmartVariant control was returned");
	});

	QUnit.test("test _createVariantManagementControl function with a smartVariant association without having id", function(assert) {
		this.oSmartTable.setUseVariantManagement(true);
		this.oSmartTable.setPersistencyKey("foo");

		var oVariant = new SmartVariantManagement({
			showShare: true
		});

		this.oSmartTable.setSmartVariant(oVariant);
		this.oSmartTable._createVariantManagementControl();
		assert.equal(this.oSmartTable._oVariantManagement, oVariant, "Correct SmartVariant control was returned");
	});

	QUnit.test("test _getTablePersonalisationData function", function(assert) {
		this.oSmartTable._getPathFromColumnKeyAndProperty = function(sColumnKey) {
			return sColumnKey;
		};
		this.oSmartTable._getColumnByKey = function(sColumnKey) {
			return {
				getFilterProperty: function() {
					return sColumnKey;
				},
				data: function() {
					return {};
				}
			};
		};

		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: false,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: {
				sortItems: [
					{
						columnKey: "Key1"
					}, {
						columnKey: "Key2",
						operation: "Descending"
					}, {
						columnKey: "Key3"
					}
				]
			},
			filter: {
				filterItems: [
					{
						columnKey: "Key1",
						operation: "BT",
						value1: 10,
						value2: 20
					}, {
						columnKey: "Key2",
						operation: "BT",
						value1: 10,
						value2: 20
					}, {
						columnKey: "Key3",
						operation: "BT",
						value1: 10,
						value2: 20
					}
				]
			}

		};

		var oResult = this.oSmartTable._getTablePersonalisationData();

		assert.equal(oResult.sorters.length, 3, "correct number of sorters");
		assert.equal(oResult.sorters[0].sPath, "Key1", "correct path on sorter 1");
		assert.equal(oResult.sorters[0].bDescending, false, "correct descending flag on sorter 1");
		assert.equal(oResult.sorters[1].sPath, "Key2", "correct path on sorter 2");
		assert.equal(oResult.sorters[1].bDescending, true, "correct descending flag on sorter 2");
		assert.equal(oResult.sorters[2].sPath, "Key3", "correct path on sorter 3");
		assert.equal(oResult.sorters[2].bDescending, false, "correct descending flag on sorter 3");

		var aFilters = oResult.filters;
		assert.equal(aFilters.length, 3, "correct number of filters");
		assert.equal(aFilters[0].sPath, "Key1", "correct key on filter 1");
		assert.equal(aFilters[1].sPath, "Key2", "correct key on filter 2");
		assert.equal(aFilters[2].sPath, "Key3", "correct key on filter 3");

	});

	QUnit.test("test _getTablePersonalisationData filtering exclude operations", function(assert) {
		// Arrange
		var aFilters,
			oTransformMethodSpy = sinon.spy(FilterUtil, "getTransformedExcludeOperation");

		this.oSmartTable._getColumnByKey = function(sColumnKey) {
			return {
				getFilterProperty: function() {
					return sColumnKey;
				},
				data: function() {
					return {};
				}
			};
		};

		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			filter: {
				filterItems: [
					{
						columnKey: "Key1",
						exclude: true,
						operation: "BT",
						value1: 10,
						value2: 20
					}, {
						columnKey: "Key2",
						exclude: true,
						operation: "NB",
						value1: 10,
						value2: 20
					}, {
						columnKey: "Key3",
						operation: "BT",
						value1: 10,
						value2: 20
					}
				]
			}

		};

		// Act
		aFilters = this.oSmartTable._getTablePersonalisationData().excludeFilters.aFilters;

		// Assert
		assert.strictEqual(oTransformMethodSpy.callCount, 2, "Transformation method from FilterUtil called 2 times");
		assert.ok(oTransformMethodSpy.firstCall.calledWithExactly("BT"), "Call with BT as value");
		assert.strictEqual(oTransformMethodSpy.firstCall.returnValue, "NB", "Returned transformed value NB");
		assert.ok(oTransformMethodSpy.secondCall.calledWithExactly("NB"), "Call with NB as value");
		assert.strictEqual(oTransformMethodSpy.secondCall.returnValue, "NB", "Returned not-transformed value");

		assert.strictEqual(aFilters.length, 2, "There should be 2 exclude filters");
		assert.strictEqual(aFilters[0].sOperator, "NB", "Correct operation set for filter 'Key1'");
		assert.strictEqual(aFilters[1].sOperator, "NB", "Correct operation set for filter 'Key2'");

		// Cleanup
		oTransformMethodSpy.restore();
	});

	QUnit.test("test _getTablePersonalisationData empty filter include operator and property is nullable", function(assert) {
		this.oSmartTable._getPathFromColumnKeyAndProperty = function(sColumnKey) {
			return sColumnKey;
		};

		var oFieldMetadata = {
			type: "string",
			nullable: true
		};

		this.oSmartTable._getColumnByKey = function(sColumnKey) {
			return {
				getFilterProperty: function() {
					return sColumnKey;
				},
				data: function() {
					return oFieldMetadata;
				}
			};
		};

		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: false,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			filter: {
				filterItems: [
					{
						columnKey: "Key1",
						operation: "EQ",
						value1: "ABC",
						exclude: false
					},
					{
						columnKey: "Key1",
						operation: "Empty",
						value1: "",
						exclude: false
					},
					{
						columnKey: "Key1",
						operation: "EQ",
						value1: "ABC",
						exclude: true
					},
					{
						columnKey: "Key1",
						operation: "Empty",
						value1: "",
						exclude: true
					}
				]
			}

		};

		var that = this;
		function checkFilters(bExclude) {
			var aPersoFilters = that.oSmartTable._getTablePersonalisationData()[bExclude ? "excludeFilters" : "filters"];
			var sOperator = "EQ";
			var iExpectedLength = 1;
			if (oFieldMetadata.nullable) {
				iExpectedLength++;
			}
			if (oFieldMetadata.type === "string") {
				iExpectedLength++;
			}

			if (bExclude) {
				sOperator = "NE";
				assert.ok(aPersoFilters instanceof Filter, "One Exclude Filter");
				assert.ok(aPersoFilters.bAnd, "Exclude Filter are ANDed");
				assert.strictEqual(aPersoFilters.aFilters.length, iExpectedLength, "Exclude Filter has " + iExpectedLength + " parts");
				aPersoFilters = aPersoFilters.aFilters;
			} else {
				assert.strictEqual(aPersoFilters.length, iExpectedLength, iExpectedLength + " filters are added");
			}

			assert.strictEqual(aPersoFilters[0].sPath, "Key1", "Correct path set");
			assert.strictEqual(aPersoFilters[0].sOperator, sOperator, "Correct operator set");
			assert.strictEqual(aPersoFilters[0].oValue1, "ABC", "Correct value set");

			if (oFieldMetadata.type === "string") {
				assert.strictEqual(aPersoFilters[1].sPath, "Key1", "Correct path set");
				assert.strictEqual(aPersoFilters[1].sOperator, sOperator, "Correct operator set");
				assert.strictEqual(aPersoFilters[1].oValue1, "", "Correct value set");
			}

			if (oFieldMetadata.nullable) {
				assert.strictEqual(aPersoFilters[oFieldMetadata.type === "string" ? 2 : 1].sPath, "Key1", "Correct path set");
				assert.strictEqual(aPersoFilters[oFieldMetadata.type === "string" ? 2 : 1].sOperator, sOperator, "Correct operator set");
				assert.strictEqual(aPersoFilters[oFieldMetadata.type === "string" ? 2 : 1].oValue1, null, "Correct value set");
			}
		}

		checkFilters(false);
		checkFilters(true);

		oFieldMetadata = {
			type: "string",
			nullable: false
		};
		checkFilters(false);
		checkFilters(true);

		oFieldMetadata = {
			type: "number",
			nullable: true
		};
		checkFilters(false);
		checkFilters(true);

		oFieldMetadata = {
			type: "number",
			nullable: false
		};
		checkFilters(false);
		checkFilters(true);
	});

	QUnit.test("test _getTablePersonalisationData empty filter include operator and property is non-nullable", function(assert) {
		this.oSmartTable._getPathFromColumnKeyAndProperty = function(sColumnKey) {
			return sColumnKey;
		};
		this.oSmartTable._getColumnByKey = function(sColumnKey) {
			return {
				getFilterProperty: function() {
					return sColumnKey;
				},
				data: function() {
					return {
						type: "string",
						nullable: false
					};
				}
			};
		};

		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: false,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			filter: {
				filterItems: [
					{
						columnKey: "Key1",
						operation: "Empty",
						value1: "",
						exclude: false
					}
				]
			}

		};

		var aPersoFilters = this.oSmartTable._getTablePersonalisationData().filters;
		assert.notOk(aPersoFilters[0].aFilters, "Multiple filters not created");
		assert.strictEqual(aPersoFilters[0].sPath, "Key1", "Correct path set");
		assert.strictEqual(aPersoFilters[0].sOperator, "EQ", "Correct operator set");
		assert.strictEqual(aPersoFilters[0].oValue1, "", "Correct value set");
	});

	QUnit.test("test _getTablePersonalisationData filter include BT operator and property is DateTimeOffset", function(assert) {
		this.oSmartTable._getPathFromColumnKeyAndProperty = function(sColumnKey) {
			return sColumnKey;
		};

		var oColumnByKeyStub = this.stub(this.oSmartTable, "_getColumnByKey");
		oColumnByKeyStub.withArgs("Key1").returns({
			getFilterProperty: this.stub().returns("Key1"),
			data: this.stub().returns({
				typeInstance: {
					getName: this.stub().returns("sap.ui.model.odata.type.DateTimeOffset")
				}
			})
		});

		const oFieldMetadata = {
			filterRestriction: "interval"
		};

		this.oSmartTable._oTableProvider = {
			getFieldMetadata: this.stub().returns(oFieldMetadata)
		};

		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: false,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			filter: {
				filterItems: [
					{
						columnKey: "Key1",
						operation: "EQ",
						value1:  UI5Date.getInstance(2024, 3, 23)
					},
					{
						columnKey: "Key1",
						operation: "LT",
						value1: UI5Date.getInstance(2024, 3, 24)
					},
					{
						columnKey: "Key1",
						operation: "GT",
						value1: UI5Date.getInstance(2024, 3, 25)
					},
					{
						columnKey: "Key1",
						operation: "LE",
						value1: UI5Date.getInstance(2024, 3, 24)
					}
				]
			}

		};

		var aPersoFilters = this.oSmartTable._getTablePersonalisationData().filters;
		assert.strictEqual(aPersoFilters.length, 4, "There are 4 filters");
		assert.strictEqual(aPersoFilters[0].sOperator, "BT", "Equal operator changed to BT");
		assert.strictEqual(aPersoFilters[0].oValue1.getMilliseconds(), 0, "BT operator value is between value1 and 999 for higher value");
		assert.strictEqual(aPersoFilters[0].oValue2.getMilliseconds(), 999, "BT operator value is between value1 and 999 for higher value");
		assert.strictEqual(aPersoFilters[0].oValue1.getHours(), aPersoFilters[0].oValue2.getHours(), "Both values have same hours");
		assert.strictEqual(aPersoFilters[0].oValue1.getMinutes(), aPersoFilters[0].oValue2.getMinutes(), "Both values have same minutes");
		assert.strictEqual(aPersoFilters[1].oValue1.getMilliseconds(), 0, "LT filter is excluding the current timestamp - milliseconds must not be set");
		assert.strictEqual(aPersoFilters[2].oValue1.getMilliseconds(), 0, "3rd filter is greater than 0");
		assert.strictEqual(aPersoFilters[3].oValue1.getMilliseconds(), 999, "LE filter includes the current timestamp - milliseconds have to be set to 999");
	});

	QUnit.test("test _getTablePersonalisationData with initial sorters for initially non-visible columns", function(assert) {
		// Arrange
		var aResult;
		this.oSmartTable._oCurrentVariant = {};
		this.oSmartTable._aInitialSorters = [{
			columnKey: "Key1",
			operation: "Ascending"
		}, {
			columnKey: "Key2",
			operation: "Descending",
			initiallyNotVisibleColumn: true
		}];
		this.oSmartTable._mFieldMetadataByKey = {
			Key1: {},
			Key2: {}
		};

		// Act
		aResult = this.oSmartTable._getTablePersonalisationData();

		// Assert
		assert.ok(aResult.sorters, "Sorters are added");
		assert.equal(aResult.sorters[0].sPath, "Key2", "The correct Sort property is added");
	});

	QUnit.test("_getTablePersonalisationData should take into account Precision for second date value", function (assert) {
		// Arrange
		var oFieldMetadata = {
			name: "Key1",
			precision: 0
		};
		var oColumnByKeyStub = this.stub(this.oSmartTable, "_getColumnByKey");
		oColumnByKeyStub.withArgs("Key1").returns({
			getFilterProperty: this.stub().returns("Key1"),
			data: this.stub().returns({
				type: "date",
				typeInstance: {
					getName: this.stub().returns("sap.ui.model.odata.type.DateTime")
				}
			})
		});

		this.oSmartTable._oTableProvider = {
			getFieldMetadata: this.stub().returns(oFieldMetadata),
			getIsUTCDateHandlingEnabled: this.stub().returns(true)
		};
		this.oSmartTable._oCurrentVariant = {
			filter: {
				filterItems: [{
					columnKey: "Key1",
					operation: "EQ",
					value1: new Date(2023, 4, 1),
					value2: new Date(2023, 4, 1, 23, 59, 59, 999),
					exclude: false
				}]
			}
		};

		// Act
		var aResult = this.oSmartTable._getTablePersonalisationData();

		// Assert
		assert.equal(aResult.filters[0].oValue2.getMilliseconds(), 0, "milliseconds should be set to 0 if precision is 0");

		// Act
		oFieldMetadata.precision = 1;
		aResult = this.oSmartTable._getTablePersonalisationData();

		// Assert
		assert.equal(aResult.filters[0].oValue2.getMilliseconds(), 900, "milliseconds should be set to 900 if precision is 1");

		// Act
		oFieldMetadata.precision = 2;
		aResult = this.oSmartTable._getTablePersonalisationData();

		// Assert
		assert.equal(aResult.filters[0].oValue2.getMilliseconds(), 990, "milliseconds should be set to 990 if precision is 2");

		// Act
		oFieldMetadata.precision = 3;
		aResult = this.oSmartTable._getTablePersonalisationData();

		// Assert
		assert.equal(aResult.filters[0].oValue2.getMilliseconds(), 999, "milliseconds should be set to 999 if precision is 3");

		// Act
		oFieldMetadata.precision = undefined;
		aResult = this.oSmartTable._getTablePersonalisationData();

		// Assert
		assert.equal(aResult.filters[0].oValue2.getMilliseconds(), 999, "milliseconds should be set to 999 if precision is not defined");

		// Cleanup
		oColumnByKeyStub.restore();

	});

	QUnit.test("test _getColumnSortProperty", function(assert) {
		const oTable = this.oSmartTable;
		const oUIColumn = new UIColumn({
			label: new Label({text: "Prop A"})
		}).data("p13nData", {
			leadingProperty: "PropA",
			sortProperty: "PropA"
		});

		assert.equal(oTable._getColumnSortProperty(oUIColumn), "PropA", "Sort property evaluted for sap.ui.table.Column");

		const oAnalyticalColumn = new AnalyticalColumn({
			leadingProperty: "PropB",
			label: new Label({text: "Prop B"}),
			sortProperty: "PropB"
		}).data("p13nData", {
			leadingProperty: "PropB",
			sortProperty: "PropB"
		});

		assert.equal(oTable._getColumnSortProperty(oAnalyticalColumn), "PropB", "Sort property evaluted for sap.ui.table.AnalyticalColumn");

		const oMColumn = new Column({
			header: new Text({
				text: "Prop C"
			}),
			hAlign: "Right"
		}).data("p13nData", {
			leadingProperty: "PropC",
			sortProperty: "PropC"
		});

		assert.equal(oTable._getColumnSortProperty(oMColumn), "PropC", "Sort property evaluted for sap.m.Column");
	});

	QUnit.test("test _getSortItemsFromVariant function", function(assert) {
		var oColumnByKeyStub = this.stub(this.oSmartTable, "_getColumnByKey");
		var oColumnSortPropertyStub = this.stub(this.oSmartTable, "_getColumnSortProperty");
		oColumnByKeyStub.withArgs("Key1").returns({});
		oColumnByKeyStub.withArgs("Key2").returns(undefined);
		oColumnSortPropertyStub.withArgs({}).returns("Key1");
		oColumnSortPropertyStub.returns(undefined);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "Key1",
						operation: "Ascending"
					},
					{
						columnKey: "Key2",
						operation: "Ascending"
					}
				]
			}
		};

		assert.deepEqual(this.oSmartTable._getSortItemsFromVariant(), [{"operation": "Ascending", "sortProperty": "Key1"}], "returns only the sort items for existing columns ");
		oColumnByKeyStub.restore();
		oColumnSortPropertyStub.restore();
	});

	QUnit.test("test SmartTable for Grouping in ResponsiveTable", function(assert) {
		var done = assert.async();
		sap.ui.require([
			"sap/ui/comp/util/FormatUtil", "sap/ui/model/Context"
		], function(FormatUtil, Context) {
			var fnFormatterSpy = sinon.spy(FormatUtil, "getInlineGroupFormatterFunction");
			FormatUtil.getInlineMeasureUnitFormatter();
			var fnInnerFormatterSpy = sinon.spy(FormatUtil, "_fInlineMeasureFormatter");
			// setup pre-conditions
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("ResponsiveTable");
			this.oSmartTable._createTable();

			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

			// fake metadata
			this.oSmartTable._aTableViewMetadata = [
				{
					name: "Key1",
					inResult: true, // hack to simulate that the column gets created
					isInitiallyVisible: false,
					sortable: true,
					unit: "test/Key5",
					additionalProperty: "test/Key5",
					navigationProperty: "test",
					template: new Text()
				}, {
					name: "Key2",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key3",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key4"
				}, {
					name: "test/Key5"
				}, {
					name: "Key6"
				}
			];

			// fake grouping variant
			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: false,
							columnKey: "Key1"
						}, {
							visible: true,
							columnKey: "Key2"
						}, {
							visible: true,
							columnKey: "Key3"
						}
					]
				},
				sort: undefined,
				filter: undefined,
				group: {
					groupItems: [
						{
							columnKey: "Key1"
						}
					]
				}

			};

			// Simulate init
			this.oSmartTable._createContent();

			assert.ok(fBindStub.notCalled);

			this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
			// simulate grouping
			this.oSmartTable.rebindTable();

			assert.ok(fBindStub.calledOnce);

			var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API

			assert.strictEqual(oResult.sorter.length, 1, "correct number of sorters");
			assert.strictEqual(oResult.sorter[0].sPath, "Key1", "correct path on sorter 1");
			assert.strictEqual(oResult.sorter[0].bDescending, false, "correct descending flag on sorter 1");
			assert.ok(oResult.parameters.select.indexOf("test/Key5") > -1, "additional param is part of $select");
			assert.ok(oResult.parameters.expand.indexOf("test") > -1, "navigationProperty is part of $expand");
			assert.ok(fnFormatterSpy.calledOnce);

			var fnGroupFunction = oResult.sorter[0].getGroupFunction();
			assert.strictEqual(typeof fnGroupFunction, "function", "grouping function exists on sorter 1");

			assert.ok(fnInnerFormatterSpy.notCalled);
			var oContext = sinon.createStubInstance(Context);
			oContext.getProperty.withArgs("Key1").returns(100);
			oContext.getProperty.withArgs("test/Key5").returns("PCS");

			oResult = fnGroupFunction(oContext);

			assert.ok(fnInnerFormatterSpy.calledOnce);

			assert.strictEqual(oResult.key, "100\u2007PCS");

			fBindStub.restore();

			done();
		}.bind(this));
	});

	QUnit.test("test MultiUnit sorters", function(assert) {
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("Table");
		this.oSmartTable._createTable();

		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

		// fake metadata
		this.oSmartTable._aTableViewMetadata = [
			{
				name: "Key1",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				unit: "Key5",
				isCurrencyField: true,
				additionalProperty: "Key5",
				template: new Text()
			}, {
				name: "Key2",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key3",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key4"
			}, {
				name: "Key5",
				sortable: true
			}, {
				name: "Key6"
			}
		];

		// fake sorting variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: {
				sortItems: [
					{
						columnKey: "Key1"
					}
				]
			},
			filter: undefined,
			group: undefined
		};

		// Simulate init
		this.oSmartTable._createContent();

		this.oSmartTable.bIsInitialised = true; // fake table is initialized
		// simulate sorting
		this.oSmartTable.rebindTable();
		var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API
		assert.strictEqual(oResult.sorter.length, 1, "only 1 sorter added as _bMultiUnitBehaviorEnabled = false");
		assert.strictEqual(oResult.sorter[0].sPath, "Key1", "correct path on sorter 1");

		// enable MultiUnitBehavior
		this.oSmartTable._bMultiUnitBehaviorEnabled = true;
		// simulate sorting
		this.oSmartTable.rebindTable(true);
		oResult = fBindStub.args[1][0]; // get binding parameters passed to bindRows/bindItems API
		assert.strictEqual(oResult.sorter.length, 2, "2 sorter added as _bMultiUnitBehaviorEnabled = true");
		assert.strictEqual(oResult.sorter[0].sPath, "Key5", "Unit is added as first sorter");
		assert.strictEqual(oResult.sorter[1].sPath, "Key1", "Amount is added as second sorter");

		// make the unit property not sortable
		this.oSmartTable._aTableViewMetadata[4].sortable = false;
		// simulate sorting
		this.oSmartTable.rebindTable(true);
		oResult = fBindStub.args[2][0]; // get binding parameters passed to bindRows/bindItems API
		assert.strictEqual(oResult.sorter.length, 1, "only 1 sorter added as the unit property is not sortable");
		assert.strictEqual(oResult.sorter[0].sPath, "Key1", "correct path on sorter 1");

		// clean up
		this.oSmartTable._bMultiUnitBehaviorEnabled = false;

		fBindStub.restore();
	});

	QUnit.test("test MultiUnit sort - with grouping", function(assert) {
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("ResponsiveTable");
		this.oSmartTable._createTable();

		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

		this.oSmartTable._aTableViewMetadata = [
			{
				name: "Key1",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				unit: "Key5",
				isCurrencyField: true,
				additionalProperty: "Key5",
				template: new Text()
			}, {
				name: "Key2",
				inResult: true,
				isInitiallyVisible: true,
				sortable: true,
				template: new Text()
			}, {
				name: "Key3",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key4"
			}, {
				name: "Key5",
				sortable: true
			}, {
				name: "Key6"
			}
		];

		// fake sorting variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: {
				sortItems: [
					{
						columnKey: "Key1"
					}
				]
			},
			filter: undefined,
			group: {
				groupItems: [
					{
						columnKey: "Key2"
					}
				]
			}
		};

		// Simulate init
		this.oSmartTable._createContent();
		// enable MultiUnit behavior
		this.oSmartTable._bMultiUnitBehaviorEnabled = true;
		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		// simulate grouping
		this.oSmartTable.rebindTable();
		var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API
		assert.strictEqual(oResult.sorter.length, 3, "3 sorters are added correctly");
		assert.strictEqual(oResult.sorter[0].sPath, "Key2", "1st sorter for grouping");
		assert.strictEqual(oResult.sorter[1].sPath, "Key5", "2nd sorter is currency field");
		assert.strictEqual(oResult.sorter[2].sPath, "Key1", "3rd sorter is amount field");

		fBindStub.restore();
	});

	QUnit.test("test MultiUnit sort - Unit sorter already added", function(assert) {
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("Table");
		this.oSmartTable._createTable();
		this.oSmartTable._bMultiUnitBehaviorEnabled = true;

		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

		// fake metadata
		this.oSmartTable._aTableViewMetadata = [
			{
				name: "Key1",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				unit: "Key5",
				isCurrencyField: true,
				additionalProperty: "Key5",
				template: new Text()
			}, {
				name: "Key2",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key3",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key4"
			}, {
				name: "Key5",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				template: new Text()
			}, {
				name: "Key6"
			}
		];

		// fake sorting variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: {
				sortItems: [
					{
						columnKey: "Key1"
					}, {
						columnKey: "Key5"
					}
				]
			},
			filter: undefined,
			group: undefined
		};

		// Simulate init
		this.oSmartTable._createContent();

		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		// simulate sorting
		this.oSmartTable.rebindTable();
		var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API
		assert.strictEqual(oResult.sorter.length, 2, "2 sorters are added correctly");
		assert.strictEqual(oResult.sorter[0].sPath, "Key1", "Amount is added as first sorter");
		assert.strictEqual(oResult.sorter[1].sPath, "Key5", "Unit is added as second sorter");

		// clean up
		this.oSmartTable._bMultiUnitBehaviorEnabled = false;

		fBindStub.restore();
	});

	QUnit.test("test transitive properties", function(assert) {
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("ResponsiveTable");
		this.oSmartTable._createTable();

		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
		var fGetColumnFromP13nMap = sinon.stub(this.oSmartTable, "_getColumnFromP13nMap");

		this.oSmartTable._aTableViewMetadata = [
			{
				name: "Key1",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				unit: "Key5",
				isCurrencyField: true,
				additionalProperty: "Key5,Key6",
				template: new Text()
			}, {
				name: "Key2",
				inResult: true,
				isInitiallyVisible: true,
				sortable: true,
				template: new Text()
			}, {
				name: "Key3",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key4"
			}, {
				name: "Key5",
				sortable: true
			}, {
				name: "Key6",
				additionalProperty: "Key4"
			}
		];

		fGetColumnFromP13nMap.withArgs("Key6").returns(new Column({
			customData: new CustomData({
				key: "p13nData",
				value: this.oSmartTable._aTableViewMetadata[5]
			})
		}));

		// fake sorting variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: {},
			filter: undefined,
			group: {}
		};

		// Simulate init
		this.oSmartTable._createContent();
		// enable MultiUnit behavior
		this.oSmartTable._bMultiUnitBehaviorEnabled = true;
		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		this.oSmartTable.rebindTable();


		var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API
		var aSelect = oResult.parameters.select.split(",");

		assert.ok(aSelect.indexOf("Key1") >= 0, "select contains 'Key1'");
		assert.ok(aSelect.indexOf("Key2") >= 0, "select contains 'Key2'");
		assert.ok(aSelect.indexOf("Key3") >= 0, "select contains 'Key3'");
		assert.ok(aSelect.indexOf("Key5") >= 0, "select contains 'Key5'");
		assert.ok(aSelect.indexOf("Key6") >= 0, "select contains 'Key6'");
		assert.ok(aSelect.indexOf("Key4") >= 0, "select contains 'Key4'");

		fBindStub.restore();
		fGetColumnFromP13nMap.restore();
	});

	QUnit.test("test transitive properties in AnalyticalTable", function(assert) {
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("AnalyticalTable");
		this.oSmartTable._createTable();

		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
		var fGetColumnFromP13nMap = sinon.stub(this.oSmartTable, "_getColumnFromP13nMap");

		this.oSmartTable._aTableViewMetadata = [
			{
				name: "Key1",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				unit: "Key5",
				isCurrencyField: true,
				additionalProperty: "Key5,Key6",
				template: new Text()
			}, {
				name: "Key2",
				inResult: true,
				isInitiallyVisible: true,
				sortable: true,
				template: new Text()
			}, {
				name: "Key3",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key4"
			}, {
				name: "Key5",
				sortable: true
			}, {
				name: "Key6",
				additionalProperty: "Key4"
			}
		];

		fGetColumnFromP13nMap.withArgs("Key6").returns(new Column({
			customData: new CustomData({
				key: "p13nData",
				value: this.oSmartTable._aTableViewMetadata[5]
			})
		}));

		// fake sorting variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: {},
			filter: undefined,
			group: {}
		};

		// Simulate init
		this.oSmartTable._createContent();
		// enable MultiUnit behavior
		this.oSmartTable._bMultiUnitBehaviorEnabled = true;
		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		this.oSmartTable.rebindTable();


		var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API
		var aSelect = oResult.parameters.select.split(",");

		assert.ok(aSelect.indexOf("Key1") >= 0, "select contains 'Key1'");
		assert.ok(aSelect.indexOf("Key2") >= 0, "select contains 'Key2'");
		assert.ok(aSelect.indexOf("Key3") >= 0, "select contains 'Key3'");
		assert.ok(aSelect.indexOf("Key5") >= 0, "select contains 'Key5'");
		assert.ok(aSelect.indexOf("Key6") >= 0, "select contains 'Key6'");
		assert.ok(aSelect.indexOf("Key4") == -1, "select does not 'Key4'");

		fBindStub.restore();
		fGetColumnFromP13nMap.restore();
	});

	QUnit.test("test info toolbar", function(assert) {
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("ResponsiveTable");
		this.oSmartTable._createTable();

		// fake metadata
		this.oSmartTable._aTableViewMetadata = [
			{
				name: "Key1",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				unit: "Key5",
				isCurrencyField: true,
				additionalProperty: "Key5",
				template: new Text()
			}, {
				name: "Key2",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key3",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key4"
			}, {
				name: "Key5",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				template: new Text()
			}, {
				name: "Key6"
			}
		];

		// fake filter variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: undefined,
			filter: {
				filterItems: [
					{
						columnKey: "Key1",
						operation: "BT",
						value1: 10,
						value2: 20
					}, {
						columnKey: "Key2",
						exclude: false,
						operation: "Contains",
						value1: "JP"
					}, {
						columnKey: "Key1",
						operation: "BT",
						value1: 20,
						value2: 30
					}, {
						columnKey: "Key4",
						exclude: false,
						operation: "Contains",
						value1: "X"
					}
				]
			},
			group: undefined
		};

		this.oSmartTable._getColumnByKey = function(sColumnKey) {
			return {
				getFilterProperty: function() {
					return sColumnKey;
				},
				data: function() {
					return {};
				},
				getHeader: function() {
					return {
						getText: function() {
							return sColumnKey === "Key4" ? null : "Header " + sColumnKey;
						}
					};
				}
			};
		};

		// Simulate init
		this.oSmartTable._createContent();
		this.oSmartTable.rebindTable();
		this.oSmartTable._createInfoToolbar();

		assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "Auto", "Default value set correctly");

		var oTable = this.oSmartTable.getTable();

		assert.ok(oTable.getInfoToolbar(), "Info toolbar created");
		assert.ok(oTable.getInfoToolbar().getVisible(), "Info toolbar is visible");
		assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") !== -1, "ariaLabelledBy association added to the inner table");
		assert.strictEqual(oTable.getInfoToolbar().getContent()[0].getText(), "2 table filters active: Header Key1 and Header Key2", "Filtered columns are shown in the info toolbar");

		this.oSmartTable.setUseInfoToolbar("Off");
		assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "Off", "Value set correctly");
		assert.notOk(oTable.getInfoToolbar().getVisible(), "Info Toolbar hidden");
		assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") === -1, "ariaLabelledBy association removed from the inner table");

		this.oSmartTable.setUseInfoToolbar("On");
		assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "On", "Value set correctly");
		assert.ok(oTable.getInfoToolbar().getVisible(), "Info toolbar is visible");
		assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") !== -1, "ariaLabelledBy association added to the inner table");
		assert.strictEqual(oTable.getInfoToolbar().getContent()[0].getText(), "2 table filters active: Header Key1 and Header Key2", "Filtered columns are shown in the info toolbar");
		assert.strictEqual(oTable.getInfoToolbar().getContent()[0].getText().indexOf("Key4"), -1, "Key4 is not added to the filter text as column label is not available");

		// removing the filters should hide the filter info toolbar
		// fake filter variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: undefined,
			filter: undefined,
			group: undefined
		};

		this.oSmartTable.rebindTable();
		this.oSmartTable._createInfoToolbar();

		assert.notOk(oTable.getInfoToolbar().getVisible(), "Info toolbar is hidden as no filters are applied");
	});

	QUnit.test("test info toolbar in Grid table", function(assert) {
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("Table");
		this.oSmartTable._createTable();

		// fake metadata
		this.oSmartTable._aTableViewMetadata = [
			{
				name: "Key1",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				unit: "Key5",
				isCurrencyField: true,
				additionalProperty: "Key5",
				template: new Text(),
				label: "Header Key1"
			}, {
				name: "Key2",
				isInitiallyVisible: true,
				template: new Text(),
				label: "Header Key2"
			}, {
				name: "Key3",
				isInitiallyVisible: true,
				template: new Text(),
				label: "Header Key3"
			}, {
				name: "Key4",
				isInitiallyVisible: true,
				template: new Text()
			}, {
				name: "Key5",
				inResult: true, // hack to simulate that the column gets created
				isInitiallyVisible: true,
				sortable: true,
				template: new Text(),
				label: "Header Key5"
			}, {
				name: "Key6",
				label: "Header Key6"
			}
		];

		// fake filter variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: undefined,
			filter: {
				filterItems: [
					{
						columnKey: "Key1",
						operation: "BT",
						value1: 10,
						value2: 20
					}, {
						columnKey: "Key2",
						exclude: false,
						operation: "Contains",
						value1: "JP"
					}, {
						columnKey: "Key1",
						operation: "BT",
						value1: 20,
						value2: 30
					}, {
						columnKey: "Key4",
						exclude: false,
						operation: "Contains",
						value1: "X"
					}, {
						columnKey: "NoColumn", // for this filter there is no respective column in the table
						operation: "EQ",
						value: "0"
					}
				]
			},
			group: undefined
		};

		// Simulate init
		this.oSmartTable._createContent();
		this.oSmartTable.rebindTable();
		this.oSmartTable._createInfoToolbar();

		var oTable = this.oSmartTable.getTable();
		assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "Auto", "Default value set correctly");
		assert.notOk(oTable.getExtension().length, "Info toolbar not created");
		assert.ok(oTable.getColumns()[0].getFiltered(), "Filtered property is set to true");

		this.oSmartTable.setUseInfoToolbar("On");
		assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "On", "InfoToolBar is set to value set On");
		assert.ok(oTable.getExtension().length, "Info toolbar created");
		assert.ok(oTable.getExtension()[0].isA("sap.m.OverflowToolbar"), "Extension is a toolbar");
		assert.ok(oTable.getExtension()[0].getVisible(), "Info toolbar is visible");
		assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") !== -1, "ariaLabelledBy association added to the inner table");
		assert.strictEqual(oTable.getExtension()[0].getContent()[0].getText(), "2 table filters active: Header Key1 and Header Key2", "Filtered columns are shown in the info toolbar");

		this.oSmartTable.setUseInfoToolbar("Off");
		assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "Off", "Value set correctly");
		assert.notOk(oTable.getExtension()[0].getVisible(), "Info Toolbar hidden");
		assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") === -1, "ariaLabelledBy association removed from the inner table");

		this.oSmartTable.setUseInfoToolbar("On");
		assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "On", "Value set correctly");
		assert.notOk(oTable.getColumns()[0].getFiltered(), "Filtered property is set to false");
		assert.ok(oTable.getExtension()[0].getVisible(), "Info toolbar is visible");
		assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") !== -1, "ariaLabelledBy association added to the inner table");
		assert.strictEqual(oTable.getExtension()[0].getContent()[0].getText(), "2 table filters active: Header Key1 and Header Key2", "Filtered columns are shown in the info toolbar");
		assert.strictEqual(oTable.getExtension()[0].getContent()[0].getText().indexOf("Key4"), -1, "Key4 is not added to the filter text as column label is not available");

		// removing the filters should hide the filter info toolbar
		// fake filter variant
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "Key1"
					}, {
						visible: true,
						columnKey: "Key2"
					}, {
						visible: true,
						columnKey: "Key3"
					}
				]
			},
			sort: undefined,
			filter: undefined,
			group: undefined
		};

		this.oSmartTable.rebindTable();
		this.oSmartTable._createInfoToolbar();

		assert.notOk(oTable.getExtension()[0].getVisible(), "Info toolbar is hidden as no filters are applied");
	});

	QUnit.test("test _getPathFromColumnKeyAndProperty function integration", function(assert) {
		const oTable = this.oSmartTable;
		const sColumnKey = "SampleColumn";

		sinon.stub(oTable, "_getColumnByKey").withArgs(sColumnKey).returns({
			data: sinon.stub().withArgs("p13nData").returns({
				columnKey: sColumnKey,
				leadingProperty: sColumnKey,
				sortProperty: sColumnKey,
				filterProperty: sColumnKey
			})
		});
		sinon.stub(oTable, "_getColumnFromP13nMap");

		oTable._getPathFromColumnKeyAndProperty(sColumnKey, "sortProperty");
		assert.ok(oTable._getColumnByKey.calledOnce, "Function _getColumnByKey called once");
		assert.ok(oTable._getColumnFromP13nMap.notCalled, "Function _getColumnFromP13nMap was not called yet");

		oTable._getPathFromColumnKeyAndProperty("", "leadingProperty");
		assert.ok(oTable._getColumnByKey.calledTwice, "Function _getColumnByKey was called a second time");
		assert.ok(oTable._getColumnFromP13nMap.calledOnce, "Function _getColumnFromP13nMap was called");

		oTable._getColumnByKey.restore();
		oTable._getColumnFromP13nMap.restore();
	});

	QUnit.test("test _getPathFromColumnKeyAndProperty function", function(assert) {
		var aColumns = [
			{
				data: function() {
					return null;
				}
			}, {
				data: function(sDataKey) {
					if (sDataKey === "p13nData") {
						return {
							columnKey: "TestKey",
							customProperty: "CustomPropertyValue"
						};
					}
					return null;
				},
				getSortProperty: function() {
					return "SortPropertyValue";
				},
				getFilterProperty: function() {
					return "FilterPropertyValue";
				},
				getLeadingProperty: function() {
					return "LeadingPropertyValue";
				}
			}
		];
		this.oSmartTable._oTable = {
			getColumns: function() {
				return aColumns;
			}
		};

		var sValue = this.oSmartTable._getPathFromColumnKeyAndProperty("TestKey", "sortProperty");
		assert.equal(sValue, "SortPropertyValue", "Function has to return correct sort property value");

		sValue = this.oSmartTable._getPathFromColumnKeyAndProperty("TestKey", "filterProperty");
		assert.equal(sValue, "FilterPropertyValue", "Function has to return correct filter property value");

		sValue = this.oSmartTable._getPathFromColumnKeyAndProperty("TestKey", "leadingProperty");
		assert.equal(sValue, "LeadingPropertyValue", "Function has to return correct leading property value");

		sValue = this.oSmartTable._getPathFromColumnKeyAndProperty("TestKey", "customProperty");
		assert.equal(sValue, "CustomPropertyValue", "Function has to return correct custom property value");

	});

	QUnit.test("test setUseVariantManagement function", function(assert) {
		var bResetToInitialTableState = false;
		this.oSmartTable._oPersController = {
			setResetToInitialTableState: function(bAllow) {
				bResetToInitialTableState = bAllow;
			}
		};

		this.oSmartTable.setUseVariantManagement(false);
		assert.equal(this.oSmartTable.getUseVariantManagement(), false, "use Variant Management should be false");
		assert.equal(bResetToInitialTableState, true, "persController allow reset should be true");

		this.oSmartTable.setUseVariantManagement(true);
		assert.equal(this.oSmartTable.getUseVariantManagement(), true, "use Variant Management should be true");
		assert.equal(bResetToInitialTableState, false, "persController allow reset should be false");
	});

	QUnit.test("test getTable function", function(assert) {
		var oDummyTable = {};
		this.oSmartTable._oTable = oDummyTable;

		assert.equal(this.oSmartTable.getTable(), oDummyTable, "getTable should retrieve internal table");
	});

	QUnit.test("test _addSeparatorToToolbar function", function(assert) {
		const oTable = this.oSmartTable;

		oTable.setHeader("Dummy");
		oTable.setUseVariantManagement(true);

		let oInsertedObject = null;
		let iInsertIndex = -1;
		let sExistingHeight, sClass;

		oTable._oToolbar = sinon.createStubInstance(Toolbar);
		oTable._oToolbar.getHeight = () => sExistingHeight;
		oTable._oToolbar.addStyleClass = (sStyleClass) => {
			sClass = sStyleClass;
		};
		oTable._oToolbar.insertContent = (oObject, iIndex) => {
			iInsertIndex = iIndex;
			oInsertedObject = oObject;
		};

		oTable._oVariantManagement = {
			isPageVariant: function() {
				return false;
			}
		};

		oTable._addSeparatorToToolbar();
		assert.ok(oTable._oSeparator, "_oSeparator is available");
		assert.ok(oTable._oSeparator.hasStyleClass("sapUiCompSmartTableToolbarContent"), "sapUiCompSmartTableToolbarContent style class added to the ToolbarSeparator");
		assert.ok(oInsertedObject instanceof ToolbarSeparator, "object instanceof ToolbarSeparator should have been added");
		assert.equal(iInsertIndex, 0, "separator should be inserted at index 0");

		assert.equal(sClass, "sapMTBHeader-CTX", "default height shall be set from 'sapMTBHeader-CTX', if nothing is set");

		oTable._oVariantManagement = null;
	});

	QUnit.test("test _addVariantManagementToToolbar  function", function(assert) {
		const oTable = this.oSmartTable;

		var oDummyVariantManagement = {
			isPageVariant: function() {
				return false;
			},
			detachInitialise: function() {
			},
			detachAfterSave: function() {
			},
			detachSave: function() {
			},
			setVisible: function() {
			},
			addStyleClass: function(sClass) {
				oDummyVariantManagement.styleClass.push(sClass);
			}
		};
		oDummyVariantManagement.styleClass = [];
		var oInsertedObject = null;
		var oRemovedObject = null;
		var iInsertIndex = -1;
		oTable._oVariantManagement = oDummyVariantManagement;

		oTable.setUseVariantManagement(true);
		oTable._oToolbar = sinon.createStubInstance(Toolbar);
		oTable._oToolbar.removeContent = (oObject) => { oRemovedObject = oObject; };
		oTable._oToolbar.insertContent = (oObject, iIndex) => {
			iInsertIndex = iIndex;
			oInsertedObject = oObject;
		};

		oTable._addVariantManagementToToolbar(true);
		assert.equal(oRemovedObject, oDummyVariantManagement, "variant management object should first be removed");
		assert.equal(oInsertedObject, oDummyVariantManagement, "variant management object should have been inserted");
		assert.ok(oInsertedObject.styleClass.indexOf("sapUiCompSmartTableToolbarContent") > -1, "Control marked as table owned toolbar content");
		assert.ok(oInsertedObject.styleClass.indexOf("sapUiCompSmartTableToolbarContentAllowAdaption") > -1, "Control marked as allowed for adaptation");
		assert.equal(iInsertIndex, 0, "variant management should be inserted at index 0");
	});

	QUnit.test("test _addTablePersonalisationToToolbar   function", function(assert) {
		let bDialogOpen = false;
		const oTable = this.oSmartTable;

		oTable._oPersController = {
			openDialog: function() {
				bDialogOpen = true;
			}
		};

		var oAddedToToolbar = null;

		oTable.setUseTablePersonalisation(true);
		oTable._oToolbar = sinon.createStubInstance(Toolbar);
		oTable._oToolbar.addContent = (oObject) => {
			oAddedToToolbar = oObject;
		};

		oTable._addTablePersonalisationToToolbar();
		assert.ok(oAddedToToolbar instanceof Button, "personalisation button should have been added to toolbar");
		assert.ok(oAddedToToolbar.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");

		oAddedToToolbar.firePress();
		assert.ok(bDialogOpen, "persController openDialog should have been called");
	});

	QUnit.test("test keyboard shortcut CTRL + COMMA opens the table personalisation dialog", async function(assert) {
		const oTable = this.oSmartTable;

		var bDialogOpen = false;
		oTable._oToolbar = null;
		oTable._oPersController = {
			openDialog: () => {
				bDialogOpen = true;
			}
		};

		var oAddedToToolbar = null;

		oTable._oToolbar = sinon.createStubInstance(Toolbar);
		oTable._oToolbar.addContent = (oObject) => {
			oAddedToToolbar = oObject;
		};

		assert.notOk(oTable.getUseTablePersonalisation(), "useTablePersonalisation=false");
		// trigger CTRL + COMMA keyboard shortcut
		qutils.triggerKeydown(oTable.getDomRef(), KeyCodes.COMMA, false, false, true);
		assert.equal(bDialogOpen, false, "Table personalisation dialog not opened as useTablePersonalisation=false");

		oTable.setUseTablePersonalisation(true);
		oTable._addTablePersonalisationToToolbar();
		assert.ok(oAddedToToolbar instanceof Button, "personalisation button should have been added to toolbar");

		oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		// trigger CTRL + COMMA keyboard shortcut
		qutils.triggerKeydown(oTable.getDomRef(), KeyCodes.COMMA, false, false, true);
		assert.equal(bDialogOpen, true, "Table personalisation dialog opened");

		bDialogOpen = false;
		oTable.setShowTablePersonalisation(false);
		await nextUIUpdate();

		// trigger CTRL + COMMA keyboard shortcut
		qutils.triggerKeydown(oTable.getDomRef(), KeyCodes.COMMA, false, false, true);
		assert.equal(bDialogOpen, false, "Table personalisation dialog not opened as showTablePersonalisation=false");
	});

	QUnit.test("copyProvider", async function(assert) {
		var sClipboardText;
		var oClipboardStub = sinon.stub(window, "navigator").value({
			clipboard: {
				writeText: function(sText) {
					sClipboardText = sText;
					return Promise.resolve();
				},
				getText: function() {
					return Promise.resolve(sClipboardText);
				}
			}
		});
		var oSecureContextStub = sinon.stub(window, "isSecureContext").value(true);

		var oCopyProvider = new CopyProvider();
		this.oSmartTable.setCopyProvider(oCopyProvider);

		var oCopyButton = Element.getElementById(this.oSmartTable.getId() + "-btnCopy");
		assert.notOk(oCopyButton, "Copy button has not been created yet");

		this.oSmartTable.setEntitySet("foo");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));
		var oTableProviderStub = sinon.stub(TableProvider.prototype, "getTableViewMetadata");
		oTableProviderStub.callsFake(function () {
			return [{name: "PropA"}];
		});
		this.oSmartTable._onMetadataInitialised();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		assert.equal(this.oSmartTable.getCopyProviderPluginOwner(), this.oSmartTable._oTable, "The inner table is set as plugin owner for CopyProvider");
		assert.ok(this.oSmartTable.getColumnClipboardSettings, "getColumnClipboardSettings method is implemented");

		oCopyButton = Element.getElementById(this.oSmartTable.getId() + "-btnCopy");
		assert.ok(oCopyButton, "Copy button is created");
		assert.ok(oCopyButton.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Toolbar item class is set on the copy button");

		var iToolbarSpacerIndex = this.oSmartTable._oToolbar.getContent().findIndex(function(oContent){
			return oContent.isA("sap.m.ToolbarSpacer");
		});
		assert.equal(this.oSmartTable._oToolbar.indexOfContent(oCopyButton), iToolbarSpacerIndex + 1, "Copy button is added to the toolbar after the spacer");

		this.oSmartTable.setCopyProvider();
		assert.equal(this.oSmartTable._oToolbar.indexOfContent(oCopyButton), -1, "Copy button is removed when the CopyProvider is removed");

		this.oSmartTable.setCopyProvider(new CopyProvider());
		oCopyButton = Element.getElementById(this.oSmartTable.getId() + "-btnCopy");
		assert.equal(this.oSmartTable._oToolbar.indexOfContent(oCopyButton), iToolbarSpacerIndex + 1, "Copy button is immediately created after new CopyProvider is set");
		oTableProviderStub.restore();
		oClipboardStub.restore();
		oSecureContextStub.restore();
	});

	QUnit.test("copyProvider in unsecure context", function(assert) {
		var oSecureContextStub = sinon.stub(window, "isSecureContext").value(false);
		var oCopyProvider = new CopyProvider();
		this.oSmartTable.setCopyProvider(oCopyProvider);

		assert.strictEqual(this.oSmartTable.getCopyProvider(), oCopyProvider, "CopyProvider aggregation is set");
		assert.notOk(Element.getElementById(this.oSmartTable.getId() + "-btnCopy"), "Copy button is not created");

		oSecureContextStub.restore();
	});

	QUnit.test("getColumnClipboardSettings", function(assert) {
		var oColumn0 = new Column();
		assert.strictEqual(this.oSmartTable.getColumnClipboardSettings(oColumn0), null, "No p13nData no clipboard info");

		oColumn0.data("p13nData", {});
		assert.strictEqual(this.oSmartTable.getColumnClipboardSettings(oColumn0), null, "No leading property no clipboard info");

		this.oSmartTable.setEntitySet("EntitySet");
		sinon.stub(this.oSmartTable, "getModel").returns(getModelStubInstance(ODataModel));
		this.oSmartTable._createTableProvider();
		var oGetFieldMetadataStub = sinon.stub(this.oSmartTable._oTableProvider, "getFieldMetadata");
		oGetFieldMetadataStub.returns({
			name: "Prop3",
			modelType: ODataType.getType("Edm.DateTime")
		});

		var oColumn1 = new Column({
			header: new Text({
				text: "Prop 1"
			})
		}).data("p13nData", {
			leadingProperty: "Prop1",
			unit: "Unit1",
			typeInstance: ODataType.getType("Edm.Decimal"),
			isCurrency: true
		});

		var fnGetAmountCurrencyFormatterSpy = sinon.spy(FormatUtil, "getAmountCurrencyFormatter");
		assert.ok(deepEqual({
			types: [ undefined ],
			properties: [ "Prop1", "Unit1" ],
			template: "{0} {1}"
		}, this.oSmartTable.getColumnClipboardSettings(oColumn1), true));
		assert.ok(fnGetAmountCurrencyFormatterSpy.calledOnce, "FormatUtil.getAmountCurrencyFormatter is called once");
		fnGetAmountCurrencyFormatterSpy.restore();

		oColumn1.data("p13nData").isCurrency = false;
		var fnGetMeasureUnitFormatterSpy = sinon.spy(FormatUtil, "getMeasureUnitFormatter");
		this.oSmartTable.getColumnClipboardSettings(oColumn1);
		assert.ok(fnGetMeasureUnitFormatterSpy.calledOnce, "FormatUtil.getMeasureUnitFormatter is called once");
		fnGetMeasureUnitFormatterSpy.restore();

		var oColumn2 = new Column({
			header: new Text({
				text: "Prop 2"
			})
		}).data("p13nData", {
			leadingProperty: "Prop2",
			description: "Description",
			displayBehaviour: "descriptionAndId",
			typeInstance: ODataType.getType("Edm.String")
		});
		assert.deepEqual(this.oSmartTable.getColumnClipboardSettings(oColumn2), {
			types: [ ODataType.getType("Edm.String") ],
			properties: [ "Prop2", "Description" ],
			template: "{1} ({0})",
			unitFormatter: undefined
		});

		var oColumn3 = new Column({
			header: new Text({
				text: "Prop 3"
			})
		}).data("p13nData", {
			leadingProperty: "Prop3"
		});
		assert.deepEqual(this.oSmartTable.getColumnClipboardSettings(oColumn3), {
			types: [ ODataType.getType("Edm.DateTime") ],
			properties: [ "Prop3" ],
			template: "{0}",
			unitFormatter: undefined
		});

		var oColumn4 = new Column({
			header: new Text({
				text: "Prop 4"
			})
		}).data("p13nData", {
			leadingProperty: "Prop4",
			description: "Description",
			displayBehaviour: "descriptionOnly",
			typeInstance: ODataType.getType("Edm.String")
		});
		assert.deepEqual(this.oSmartTable.getColumnClipboardSettings(oColumn4), {
			types: [ ODataType.getType("Edm.String") ],
			properties: ["Description" ],
			template: "{0}",
			unitFormatter: undefined
		});

		var oColumn5 = new Column({
			header: new Text({
				text: "Prop 5"
			})
		}).data("p13nData", {
			leadingProperty: "Prop5",
			description: "Description",
			displayBehaviour: "idOnly",
			typeInstance: ODataType.getType("Edm.String")
		});
		assert.deepEqual(this.oSmartTable.getColumnClipboardSettings(oColumn5), {
			types: [ ODataType.getType("Edm.String") ],
			properties: ["Prop5" ],
			template: "{0}",
			unitFormatter: undefined
		});

		oGetFieldMetadataStub.restore();
		this.oSmartTable.getModel.restore();
	});


	QUnit.test("cellSelector", async function(assert) {
		var oCellSelector = new CellSelector();
		this.oSmartTable.addDependent(oCellSelector);
		await nextUIUpdate();

		assert.equal(this.oSmartTable.getCellSelectorPluginOwner(), this.oSmartTable.getTable(), "Plugin owner is the inner table");
		assert.ok(oCellSelector.getEnabled(), "CellSelector is enabled");
		assert.ok(oCellSelector.isActive(), "CellSelector is active");
	});


	QUnit.test("EnableCopy", async function(assert) {

		var _cleanup = () => {
			if (this.oTableProviderStub) {
				this.oTableProviderStub.restore();
				this.oTableProviderStub = null;
			}
			this.oSmartTable.destroy();
			this.oSmartTable = undefined;
		};

		var _reInitialize = (fnApplyBeforInit) => {
			_cleanup();

			this.oSmartTable = new SmartTable({
				useVariantManagement: false,
				useTablePersonalisation: false
			});

			this.oSmartTable.setEntitySet("foo");
			this.oTableProviderStub = sinon.stub(TableProvider.prototype, "getTableViewMetadata");
			this.oTableProviderStub.callsFake(function () {
				return [{name: "PropA"}];
			});

			if (fnApplyBeforInit) {
				fnApplyBeforInit(this.oSmartTable);
			}

			this.oSmartTable.setModel(getModelStubInstance(ODataModel)); // finally calls _onMetadataInitialised();
			this.oSmartTable.placeAt("qunit-fixture");
		};

		// Test property changes before initialisation

		_reInitialize();
		await nextUIUpdate();
		assert.ok(CellSelector.findOn(this.oSmartTable) === this.oSmartTable._oCellSelector, "1) Default CellSelector available on table (enableCopy=true)");
		assert.ok(CopyProvider.findOn(this.oSmartTable) === this.oSmartTable._oCopyProvider, "1) Default CopyProvider available on table (enableCopy=true)");
		assert.ok(this.oSmartTable._oCellSelector.getId() === this.oSmartTable.getId() + "-cs", "Default CellSelector id");
		assert.ok(this.oSmartTable._oCopyProvider.getId() === this.oSmartTable.getId() + "-cp", "Default CopyProvider id");

		_reInitialize((oSmartTable) => {
			oSmartTable.setEnableCopy(false);
		});
		await nextUIUpdate();
		assert.ok(!CellSelector.findOn(this.oSmartTable), "2) Default CellSelector not available on table (enableCopy=false)");
		assert.ok(!CopyProvider.findOn(this.oSmartTable), "2) Default CopyProvider not available on table (enableCopy=false)");

		var oAppSpecificPlugin = new CellSelector();
		_reInitialize((oSmartTable) => {
			oSmartTable.addDependent(oAppSpecificPlugin);
		});
		await nextUIUpdate();
		assert.ok(CellSelector.findOn(this.oSmartTable) === oAppSpecificPlugin, "3) App specific CellSelector not overridden (enableCopy=true)");
		assert.ok(!CopyProvider.findOn(this.oSmartTable), "3) Default CopyProvider not available on table (enableCopy=true)");

		oAppSpecificPlugin = new CopyProvider();
		_reInitialize((oSmartTable) => {
			oSmartTable.setCopyProvider(oAppSpecificPlugin);
		});
		await nextUIUpdate();
		assert.ok(!CellSelector.findOn(this.oSmartTable), "4) Default CellSelector not available on table (enableCopy=true)");
		assert.ok(CopyProvider.findOn(this.oSmartTable) === oAppSpecificPlugin, "4) App specific CopyProvider not overridden (enableCopy=true)");

		oAppSpecificPlugin = new CellSelector();
		_reInitialize((oSmartTable) => {
			oSmartTable.attachInitialise(() => {
				oSmartTable.addDependent(oAppSpecificPlugin);
			});
		});
		await nextUIUpdate();
		assert.ok(CellSelector.findOn(this.oSmartTable) === oAppSpecificPlugin, "5) App specific CellSelector not overridden (enableCopy=true)");
		assert.ok(!CopyProvider.findOn(this.oSmartTable), "5) Default CopyProvider not available on table (enableCopy=true)");

		oAppSpecificPlugin = new CopyProvider();
		_reInitialize((oSmartTable) => {
			oSmartTable.attachInitialise(() => {
				oSmartTable.setCopyProvider(oAppSpecificPlugin);
			});
		});
		await nextUIUpdate();
		assert.ok(!CellSelector.findOn(this.oSmartTable), "6) Default CellSelector not available on table (enableCopy=true)");
		assert.ok(CopyProvider.findOn(this.oSmartTable) === oAppSpecificPlugin, "6) App specific CopyProvider not overridden (enableCopy=true)");

		// Test property changes after initialisation

		_reInitialize();
		await nextUIUpdate();

		assert.ok(CellSelector.findOn(this.oSmartTable) === this.oSmartTable._oCellSelector, "a) Default CellSelector available on table (enableCopy=true)");
		assert.ok(CopyProvider.findOn(this.oSmartTable) === this.oSmartTable._oCopyProvider, "a) Default CopyProvider available on table (enableCopy=true)");

		this.oSmartTable.setEnableCopy(false);
		assert.ok(!CellSelector.findOn(this.oSmartTable), "b) No CellSelector available anymore when enableCopy set to false");
		assert.ok(!CopyProvider.findOn(this.oSmartTable), "b) No CopyProvider available anymore when enableCopy set to false");

		var oAppSpecificPluginAtRuntime = new CellSelector();
		this.oSmartTable.addDependent(oAppSpecificPluginAtRuntime);
		this.oSmartTable.setEnableCopy(true);
		assert.ok(CellSelector.findOn(this.oSmartTable) === oAppSpecificPluginAtRuntime, "c) App specific CellSelector not overridden (enableCopy=true)");
		assert.ok(!CopyProvider.findOn(this.oSmartTable), "c) Default CopyProvider not available on table (enableCopy=true)");

		this.oSmartTable.setEnableCopy(false);
		assert.ok(CellSelector.findOn(this.oSmartTable) === oAppSpecificPluginAtRuntime, "d) App specific CellSelector not overridden (enableCopy=false)");
		assert.ok(!CopyProvider.findOn(this.oSmartTable), "d) Default CopyProvider not available on table (enableCopy=false)");

		oAppSpecificPluginAtRuntime.destroy();
		this.oSmartTable.setEnableCopy(true);
		assert.ok(CellSelector.findOn(this.oSmartTable) === this.oSmartTable._oCellSelector, "e) Default CellSelector available on table (enableCopy=true)");
		assert.ok(CopyProvider.findOn(this.oSmartTable) === this.oSmartTable._oCopyProvider, "e) Default CopyProvider available on table (enableCopy=true)");

		oAppSpecificPluginAtRuntime = new CopyProvider();
		this.oSmartTable.setCopyProvider(oAppSpecificPluginAtRuntime);
		assert.ok(!CellSelector.findOn(this.oSmartTable), "f) Default CellSelector not available on table (enableCopy=true)");
		assert.ok(CopyProvider.findOn(this.oSmartTable) === oAppSpecificPluginAtRuntime, "f) App specific CopyProvider available on table (enableCopy=false)");

		this.oSmartTable.setCopyProvider(null);
		assert.ok(CellSelector.findOn(this.oSmartTable) === this.oSmartTable._oCellSelector, "g) Default CellSelector available on table (enableCopy=true)");
		assert.ok(CopyProvider.findOn(this.oSmartTable) === this.oSmartTable._oCopyProvider, "g) Default CopyProvider available on table (enableCopy=true)");

		oAppSpecificPluginAtRuntime.destroy();
		var oAppSpecificPluginAtRuntime = new CellSelector();
		this.oSmartTable.addDependent(oAppSpecificPluginAtRuntime);
		assert.ok(CellSelector.findOn(this.oSmartTable) === oAppSpecificPluginAtRuntime, "h) App specific CellSelector not overridden (enableCopy=true)");
		assert.ok(!CopyProvider.findOn(this.oSmartTable), "h) Default CopyProvider not available on table (enableCopy=true)");

		_cleanup();
	});


	QUnit.test("showPasteButton", async function(assert) {
		assert.notOk(this.oSmartTable.getShowPasteButton(), "default value of showPasteButton=false");

		// ack
		this.oSmartTable.setEntitySet("foo");
		this.oSmartTable.setEnableCopy(false);
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));
		var oTableProviderStub = sinon.stub(TableProvider.prototype, "getTableViewMetadata");
		oTableProviderStub.callsFake(function () {
			return [{name: "PropA"}];
		});
		this.oSmartTable._onMetadataInitialised();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();


		var oPasteButton1 = Element.getElementById(this.oSmartTable.getId() + "-btnPaste");
		assert.notOk(oPasteButton1, "Paste button is not created initially");

		this.oSmartTable.setShowPasteButton(true);
		await nextUIUpdate();

		var oPasteButton2 = Element.getElementById(this.oSmartTable.getId() + "-btnPaste");
		assert.ok(oPasteButton2.getDomRef(), "Paste button is created and visible");
		assert.ok(oPasteButton2.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Toolbar style class is added to the paste button");
		assert.equal(FESRHelper.getSemanticStepname(oPasteButton2, "press"), "sc:tbl:paste", "Correct FESR StepName");
		var pPromise = new Promise(function(fnResolve) {
			sap.ui.require(["sap/m/plugins/PasteProvider"], function(PasteProvider) {
				fnResolve(PasteProvider);
			});
		});

		return pPromise.then(() => {
			assert.ok(oPasteButton2.getDependents()[0].isA("sap.m.plugins.PasteProvider"), "PasteProvider plugin is added to the paste button");
			assert.equal(oPasteButton2.getDependents()[0].getPasteFor(), this.oSmartTable._oTable.getId(), "pasteFor associtation is set for the plugin");

			this.oSmartTable.setShowPasteButton();
			assert.notOk(oPasteButton2.getParent(), "Paste button is not in the toolbar anylonger");

			var oToolbar = this.oSmartTable._oToolbar;
			this.oSmartTable.setShowPasteButton(true);
			assert.equal(oPasteButton2.getParent(), oToolbar, "Paste button is added to the toolbar again");
			assert.ok(oToolbar.getContent()[oToolbar.indexOfContent(oPasteButton2) - 1].isA("sap.m.ToolbarSpacer"), "there is a spacer before the paste button");

			oTableProviderStub.restore();
		});
	});

	QUnit.test("enablePaste", function(assert) {
		var fnFirePaste = sinon.spy(this.oSmartTable, "firePaste");
		var fPasteHandler = function() {
			assert.ok(fnFirePaste.calledOnce, "firePaste event is called only once");
		};
		var oTable = this.oSmartTable._oTable;
		this.oSmartTable.attachPaste(fPasteHandler);

		this.oSmartTable.setShowPasteButton(true);
		this.oSmartTable.setEntitySet("foo");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));
		this.oSmartTable._onMetadataInitialised();
		this.oSmartTable.placeAt("qunit-fixture");
		return nextUIUpdate().then(() => {
			assert.ok(this.oSmartTable.getShowPasteButton(), "showPasteButton=true");
			assert.ok(this.oSmartTable.getEnablePaste(), "default value of enablePaste=true");

			var oPasteButton = Element.getElementById(this.oSmartTable.getId() + "-btnPaste");
			assert.ok(oPasteButton.getVisible(), "pasteButton is visible");
			assert.ok(oPasteButton.getEnabled(), "pasteButton is enabled");

			oTable.firePaste({
				data: []
			});

			this.oSmartTable.setEnablePaste(false);
			assert.notOk(this.oSmartTable.getEnablePaste(), "enablePaste=false");
			assert.notOk(oPasteButton.getEnabled(), "pasteButton is disabled");

			oTable.firePaste({
				data: []
			});

			this.oSmartTable.setShowPasteButton(false);
			assert.notOk(this.oSmartTable.getShowPasteButton(), "showPasteButton=false");
			assert.notOk(oPasteButton.getParent(), "pasteButton is no longer visible in toolbar");
		});
	});

	QUnit.test("test _getColumnInfoForPaste", function(assert) {

		//Note: The PersoController does not ensure that the visible columns are starting from index 0.
		//Also gaps of invisible columns between visible columns may occur, the paste info by ST should
		//take care to avoid this and normalize the column info by providing an array sorted by visible first,
		//and invisible columns after the visible ones.

		var oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			enableAutoColumnWidth: true
		});
		oSmartTable.placeAt("qunit-fixture");

		//Add basic TableViewMetadata to create some columns
		oSmartTable._aTableViewMetadata = [];

		var iNumberOfColumns = 5;

		for (var i = 0; i < iNumberOfColumns; i++) {
			oSmartTable._aTableViewMetadata.push({
				name: "Prop" + i,
				isInitiallyVisible: true,
				width: "5rem",
				template: new Text()
			});
		}

		oSmartTable.bIsInitialised = true;
		oSmartTable.setModel(getModelStubInstance(ODataModel));
		oSmartTable._createContent();
		oSmartTable._createTableProvider();
		oSmartTable._isMobileTable = true;

		var oDummyType = ODataType.getType("Edm.DateTime");
		sinon.stub(oSmartTable._oTableProvider, "getFieldMetadata").callsFake(function(sField) {
			return {
				name: sField,
				modelType: oDummyType
			};
		});

		var aColumns = oSmartTable.getTable().getColumns();

		//Modify the p13n data to simulate different cases
		aColumns[0].setVisible(false);
		aColumns[1].data("p13nData").type = "string";
		var fnParse = function(sValue) {return sValue.toUpperCase();};
		aColumns[1].data("p13nData").customParseFunction = fnParse;
		aColumns[2].data("p13nData").typeInstance = ODataType.getType("Edm.String");
		aColumns[3].data("p13nData").ignorePaste = true;
		aColumns[4].data("p13nData").type = "numeric";

		var aColumnInfo = oSmartTable._getColumnInfoForPaste();

		// Invisible columns are at the end of the column infos
		aColumns = aColumns.concat(aColumns.splice(0, 1));

		assert.equal(aColumnInfo.length, aColumns.length, "A column info for every column is provided");

		for (var i = 0; i < aColumns.length; i++) {
			var oCol = aColumns[i],
				sId = oCol.getId(),
				bVisible = oCol.getVisible(),
				oP13nData = oCol.data("p13nData"),
				bIgnore = !bVisible || !!oP13nData.ignorePaste,
				fn = oP13nData.customParseFunction;
			assert.equal(aColumnInfo[i].columnId, sId, "ID of column " + sId);
			assert.equal(aColumnInfo[i].property, bVisible ? oP13nData.leadingProperty : null, "Property of column " + sId);
			assert.equal(aColumnInfo[i].customParseFunction, fn, "CustomParseFunction exists for column " + sId);
			assert.equal(aColumnInfo[i].ignore, bIgnore, "Ignore flag of column " + sId);
			assert.equal(!aColumnInfo[i].type, !bVisible, "Type exists for column " + sId);
			if (bVisible) {
				assert.equal(aColumnInfo[i].type, oP13nData.typeInstance || oDummyType, "Type for column " + sId);
			}
		}

		oSmartTable._oTableProvider.getFieldMetadata.restore();
		oSmartTable.destroy();
	});

	QUnit.test("test _addFullScreenButton function", function(assert) {
		const oTable = this.oSmartTable;

		oTable.setShowFullScreenButton(true);
		let oAddToToolbar = null;
		oTable._oToolbar = sinon.createStubInstance(Toolbar);
		oTable._oToolbar.addContent = (oObject) => {
			oAddToToolbar = oObject;
		};

		oTable._addFullScreenButton();
		assert.ok(oAddToToolbar instanceof Button, "Fullscreen button should have been added to toolbar");
		assert.ok(oAddToToolbar.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");

		oAddToToolbar.firePress();
		assert.equal(oAddToToolbar.getIcon(), "sap-icon://exit-full-screen", "SmartTable is in Maximized mode");

		oAddToToolbar.firePress();
		assert.equal(oAddToToolbar.getIcon(), "sap-icon://full-screen", "SmartTable is in Minimized mode");
	});

	QUnit.test("test _addEditTogglableToToolbar function", function(assert) {
		const oTable = this.oSmartTable;

		oTable.setEditTogglable(true);
		let oAddToToolbar = null;
		oTable._oToolbar = sinon.createStubInstance(Toolbar);
		oTable._oToolbar.addContent = (oObject) => {
			oAddToToolbar = oObject;
		};

		oTable._addEditTogglableToToolbar();
		assert.ok(oAddToToolbar instanceof Button, "EditTogglable button should have been added to toolbar");
		assert.ok(oAddToToolbar.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");
		assert.equal(FESRHelper.getSemanticStepname(oAddToToolbar, "press"), "sc:tbl:edit", "Correct FESR StepName");

		oAddToToolbar.firePress();
		assert.equal(oAddToToolbar.getIcon(), "sap-icon://display", "SmartTable should be in Editable mode");

		oAddToToolbar.firePress();
		assert.equal(oAddToToolbar.getIcon(), "sap-icon://edit", "SmartTable should be in Display mode");
	});

	QUnit.test("test _showOverlay function", function(assert) {
		this.oSmartTable._showOverlay(true);
		assert.ok(this.oSmartTable._oTable.getShowOverlay(), "Overlay set on table");

		this.oSmartTable._showOverlay(false);
		assert.ok(!this.oSmartTable._oTable.getShowOverlay(), "Overlay removed on table");
	});

	QUnit.test("test rebindTable function", function(assert) {
		var oBindingParameters = null;
		var bBeforeRebindCalled = false;
		var bPreventBinding;

		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

		var mParameters = {
			"data": [],
			"foo": "bar"
		};
		var oEvent = {
			getParameter: function(sParam) {
				return mParameters[sParam];
			},
			getParameters: function() {
				return mParameters;
			}
		};

		var iCount = 0;
		var oRowBinding = {
			getCount: function() {
				return iCount;
			},
			getLength: function() {
				return iCount;
			},
			isA: function(sType) {
				return false;
			}
		};
		var fnGetRowBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
		fnGetRowBindingStub.returns(oRowBinding);

		this.oSmartTable.attachBeforeRebindTable(function(oParams) {
			bBeforeRebindCalled = true;
			oParams.getParameter("bindingParams").preventTableBind = bPreventBinding;
			oParams.getParameter("bindingParams").parameters["select"] = [
				"foo"
			];
		});

		bPreventBinding = true;
		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		this.oSmartTable.rebindTable();

		assert.ok(bBeforeRebindCalled, "before rebind has to be called");
		assert.ok(!this.oSmartTable._bIsTableBound, "table has to be unbound because of prevent binding");

		bPreventBinding = false;
		this.oSmartTable.rebindTable();

		assert.ok(this.oSmartTable._bIsTableBound, "table has to be bound");
		// busy handling will now be done by the table internally
		assert.ok(fBindStub.calledOnce, "binding triggered on the internal table");

		oBindingParameters = fBindStub.args[0][0];

		assert.ok(oBindingParameters, "binding parameters are set");

		oBindingParameters.events.dataReceived(oEvent);

		assert.ok(this.oSmartTable._bIsTableBound, "table has to be bound");

		fBindStub.restore();
		fnGetRowBindingStub.restore();
	});

	QUnit.test("test _isTableBound function", function(assert) {
		assert.ok(!this.oSmartTable._isTableBound(), "table has not yet been bound");
		// simulate that at least 1 column exists!
		this.oSmartTable.attachBeforeRebindTable(function(oParams) {
			oParams.getParameter("bindingParams").parameters["select"] = [
				"foo"
			];
		});
		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		// bind via SmartTable API
		this.oSmartTable.rebindTable();
		assert.ok(this.oSmartTable._isTableBound(), "table has now been bound");
		// unbind the table
		this.oSmartTable._bIsTableBound = false;
		var oTable = this.oSmartTable.getTable();
		oTable.unbindRows();
		assert.ok(!this.oSmartTable._isTableBound(), "table has not been bound");
		// bind directly to simulate external binding
		oTable.bindRows("/foo");
		assert.ok(this.oSmartTable._isTableBound(), "table has been bound");
	});

	QUnit.test("test CurrentVariantId property", function(assert) {
		// reset error log count to get the correct error log count result
		Log.error.reset();

		this.oSmartTable.setCurrentVariantId("dummy");

		assert.ok(Log.error.calledOnce, "variantManagement not in place, error should have been logged");

		var bGetterCalled = false;
		var bSetterCalled = false;
		var sSetVariantId = null;

		var sVariantId = "MyVariantId";

		this.oSmartTable._oVariantManagement = {
			getCurrentVariantId: function() {
				bGetterCalled = true;
				return sSetVariantId;
			},
			setCurrentVariantId: function(sId) {
				bSetterCalled = true;
				sSetVariantId = sId;
			},
			detachInitialise: function() {
			},
			detachAfterSave: function() {
			},
			detachSave: function() {
			},
			isPageVariant: function() {
			}
		};

		this.oSmartTable.setCurrentVariantId(sVariantId);

		assert.ok(bSetterCalled, "setter has to be called on internal variantmanagement");
		assert.equal(sSetVariantId, sVariantId, "set variant id has to be correct");

		var sReturnedId = this.oSmartTable.getCurrentVariantId();
		assert.ok(bGetterCalled, "Getter has to be called on internal variantmanagement");
		assert.equal(sReturnedId, sVariantId, "get variant id has to be correct");
	});

	QUnit.test("test create column functions", function(assert) {
		var oColumn = this.oSmartTable._createColumn({}, "a");
		assert.ok(oColumn instanceof UIColumn, "has to be table Column");
		oColumn.destroy();
		oColumn = this.oSmartTable._createAnalyticalColumn({}, "a");
		assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
		oColumn.destroy();
		oColumn = this.oSmartTable._createMobileColumn({}, "a");
		assert.ok(oColumn instanceof Column, "has to be Mobile Column");
		assert.equal(oColumn.getHeader().getWrappingType(), "Hyphenated", "Column header text has wrappingType=Hyphenated");
		oColumn.destroy();
		this.oSmartTable.setEnableAutoColumnWidth(true);
		oColumn = this.oSmartTable._createMobileColumn({width: "5cm"});
		assert.equal(oColumn.getWidth(),"5cm", "width annotation is taken into account");
		oColumn.destroy();

		var testHeaderLabelAndTooltip = function(sFactory, sLabel, sQuickInfo, bUseColumnLabelsAsTooltips) {
			this.oSmartTable._bUseColumnLabelsAsTooltips = bUseColumnLabelsAsTooltips;
			var oColumn = this.oSmartTable[sFactory]({label: sLabel, quickInfo: sQuickInfo});
			var sTooltip = null, sText = null;

			if (oColumn.isA("sap.m.Column")) {
				sText = oColumn.getHeader().getText();
				sTooltip = oColumn.getHeader().getTooltip();
			} else {
				sText = oColumn.getLabel().getText();
				sTooltip = oColumn.getTooltip();
			}

			var sMessagePrefix = oColumn.getMetadata().getName() + " - " + sLabel + "/" + sQuickInfo + "/" + bUseColumnLabelsAsTooltips + ": ";

			assert.equal(sText, sLabel, sMessagePrefix + "Header contains correct test value");
			if (!sQuickInfo && !bUseColumnLabelsAsTooltips) {
				assert.ok(!sTooltip, sMessagePrefix + "Tooltip has no default value: " + sTooltip);
			} else if (sQuickInfo) {
				assert.equal(sTooltip, sQuickInfo, "Tooltip contains correct test value (quickinfo): " + sTooltip);
			} else if (bUseColumnLabelsAsTooltips) {
				assert.equal(sTooltip, sText, "Tooltip contains correct test value (header text): " + sTooltip);
			}

			oColumn.destroy();
		}.bind(this);

		testHeaderLabelAndTooltip("_createMobileColumn", "testHeaderText", null, false);
		testHeaderLabelAndTooltip("_createMobileColumn", "testHeaderText", "testTooltip", false);
		testHeaderLabelAndTooltip("_createMobileColumn", "testHeaderText", null, true);
		testHeaderLabelAndTooltip("_createMobileColumn", "testHeaderText", "testTooltip", true);
		testHeaderLabelAndTooltip("_createAnalyticalColumn", "testHeaderText", null, false);
		testHeaderLabelAndTooltip("_createAnalyticalColumn", "testHeaderText", "testTooltip", false);
		testHeaderLabelAndTooltip("_createAnalyticalColumn", "testHeaderText", null, true);
		testHeaderLabelAndTooltip("_createAnalyticalColumn", "testHeaderText", "testTooltip", true);
		testHeaderLabelAndTooltip("_createColumn", "testHeaderText", null, false);
		testHeaderLabelAndTooltip("_createColumn", "testHeaderText", "testTooltip", false);
		testHeaderLabelAndTooltip("_createColumn", "testHeaderText", null, true);
		testHeaderLabelAndTooltip("_createColumn", "testHeaderText", "testTooltip", true);
	});

	QUnit.test("test useColumnLabelsAsTooltips for Custom Columns", async function(assert) {
		function testUseColumnLabelsAsTooltips(bUseColumnLabelsAsTooltips) {
			var oColumn1 = new UIColumn({
				label: new Text({text: "Column1"})
			});
			oColumn1.data("p13nData", {columnKey: "COL1"});
			var oColumn2 = new UIColumn({
				label: new Text({text: "Column2"}),
				tooltip: "CustomTooltip"
			});
			oColumn2.data("p13nData", {columnKey: "COL2"});
			var oColumn3 = new UIColumn({
				label: new Text({text: {
					path: "/abc123"
				}})
			});
			oColumn3.data("p13nData", {columnKey: "COL3"});
			var oTable = new UITable({
				columns: [oColumn1, oColumn2, oColumn3]
			});
			var oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "Table",
				items: oTable,
				useColumnLabelsAsTooltips: bUseColumnLabelsAsTooltips
			});

			oSmartTable.placeAt("qunit-fixture");
			return nextUIUpdate().then(() => {
				sinon.stub(oSmartTable, "getModel").returns(getModelStubInstance(ODataModel));
				oSmartTable._onMetadataInitialised();

				if (bUseColumnLabelsAsTooltips) {
					assert.equal(oColumn1.getTooltip(), "Column1", "Default Tooltip applied");
					assert.equal(oColumn3.getBindingInfo("tooltip").parts[0].path, "/abc123", "Default Tooltip applied via binding");
				} else {
					assert.ok(!oColumn1.getTooltip(), "No default Tooltip applied");
					assert.ok(!oColumn3.getBindingInfo("tooltip"), "No default Tooltip applied via binding");
				}
				assert.equal(oColumn2.getTooltip(), "CustomTooltip", "CustomTooltip Tooltip not overridden");

				oSmartTable.getModel.restore();
				oSmartTable.destroy();
			});
		}

		await testUseColumnLabelsAsTooltips(true);
		await testUseColumnLabelsAsTooltips(false);
	});

	QUnit.test("test Registration, Wrapping and Width for Custom Column", async function(assert) {
		var oColumn = new Column({
			header: new Text()
		});
		oColumn.data("p13nData", {columnKey: "COL1"});
		var oTable = new Table({
			columns: oColumn
		});
		var oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			enableAutoColumnWidth: true,
			items: oTable
		});
		oSmartTable._fColumnPaddingBorder = 0;

		oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		assert.notOk(oColumn.getHeader().getWrapping(), "Wrapping is disabled for custom column (available in table from begin)");

		assert.ok(oSmartTable._aExistingColumns.length == 1, "Number of registered as custom columns");
		assert.ok(oSmartTable._aExistingColumns[0] == "COL1", "Column COL1 is registered as custom column");

		var oColumn2 = new Column({
			header: new Text()
		});
		oColumn2.data("p13nData", {columnKey: "COL2"});
		oTable.addColumn(oColumn2);

		assert.ok(oColumn2.getHeader().getWrapping(), "Wrapping is enabled for custom column (added later before init)");

		oSmartTable._updateInitialColumns();

		assert.ok(oSmartTable._aExistingColumns.length == 2, "Number of registered as custom columns");
		assert.ok(oSmartTable._aExistingColumns[0] == "COL1", "Column COL1 is registered as custom column");
		assert.ok(oSmartTable._aExistingColumns[1] == "COL2", "Column COL2 is registered as custom column");

		assert.notOk(oColumn2.getHeader().getWrapping(), "Wrapping is disabled for custom column (added later before init)");
		assert.notOk(oColumn.getHeader().getWrapping(), "Wrapping is disabled for custom column");

		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.notOk(oColumn.getWidth(), "Width is not updated. There is no custom column");

		// act
		sinon.stub(oSmartTable, "getModel").returns(getModelStubInstance(ODataModel));
		oSmartTable._createTableProvider();
		oSmartTable._oTableProvider._aTableViewMetadata = [{
				name: "PropA"		// expected width 8rem=default column width
			}, {
				name: "PropB",
				type: "Edm.Byte"	// expected width 2rem=min column width
			},{
				name: "PropC",
				additionalProperty: "PropA"
			}
		];

		oColumn.data("p13nData", {autoColumnWidth: false, leadingProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.notOk(oColumn.getWidth(), "Width is not updated p13n.autoColumnWidth=false");

		oColumn.data("p13nData", {autoColumnWidth: true, leadingProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "8rem", "Default column width is set");

		oColumn.data("p13nData", {autoColumnWidth: false, leadingProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "8rem", "Width is not changed, the column has width");

		oColumn.setWidth().data("p13nData", {autoColumnWidth: {gap: 10}, leadingProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "18rem", "Gap value taken into account");

		oColumn.setWidth().data("p13nData", {autoColumnWidth: {max: 5}, leadingProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "5rem", "Max column width is set");

		oColumn.setWidth().data("p13nData", {autoColumnWidth: {min: 10}, leadingProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "10rem", "Min column width is set");

		oColumn.setWidth().data("p13nData", {autoColumnWidth: {visibleProperty: "PropB"}, leadingProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "2rem", "VisibleProperty is taken into account instead of leadingProperty");

		oColumn.setWidth().data("p13nData", {autoColumnWidth: {visibleProperty: "PropB"}, leadingProperty: "PropB", additionalProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "2rem", "VisibleProperty is taken into account instead of leadingProperty+additionalProperty");

		oColumn.setWidth().data("p13nData", {autoColumnWidth: {visibleProperty: "PropA,PropB"}});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "9.4rem", "Multiple VisibleProperty is taken into account, PropA=8rem, PropB=1rem as additional field, 0.4rem is default gap");

		oColumn.setWidth().data("p13nData", {autoColumnWidth: true, leadingProperty: "PropA", additionalProperty: "PropB"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "9.4rem", "leadingProperty+additionalProperty is taken into account, PropA=8rem, PropB=1rem as additional field, 0.4rem is default gap");

		var oMeasureTextStub = sinon.stub(TableUtil, "measureText");
		oMeasureTextStub.returns(20);
		oColumn.setWidth().getHeader().setText("LongHeader".repeat(4));
		oColumn.data("p13nData", {autoColumnWidth: {truncateLabel: false}, leadingProperty: "PropA"});
		oSmartTable._setWidthForCustomColumn(oColumn);
		assert.equal(oColumn.getWidth(), "19rem", "Column header is not truncated, column width is set to the max value");
		oMeasureTextStub.restore();

		var aTestAdditionalProperty = [
			{visibleProperty: undefined, leadingProperty: "PropC", additionalProperty: undefined, expectedProperty: "PropC", expectedAdditionalProperty: "PropA"},
			{visibleProperty: undefined, leadingProperty: "PropC", additionalProperty: "", expectedProperty: "PropC", expectedAdditionalProperty: ""},
			{visibleProperty: undefined, leadingProperty: "PropC", additionalProperty: "PropB", expectedProperty: "PropC", expectedAdditionalProperty: "PropB"},
			{visibleProperty: "PropA", leadingProperty: "PropC", additionalProperty: undefined, expectedProperty: "PropA", expectedAdditionalProperty: ""},
			{visibleProperty: "PropA", leadingProperty: "PropC", additionalProperty: "PropB", expectedProperty: "PropA", expectedAdditionalProperty: ""},
			{visibleProperty: "PropA,PropB", leadingProperty: "PropC", additionalProperty: undefined, expectedProperty: "PropA", expectedAdditionalProperty: "PropB"},
			{visibleProperty: "PropC", leadingProperty: "PropC", additionalProperty: undefined, expectedProperty: "PropC", expectedAdditionalProperty: ""},
			{visibleProperty: "PropC,PropA", leadingProperty: "PropC", additionalProperty: undefined, expectedProperty: "PropC", expectedAdditionalProperty: "PropA"}
		];

		function adjustCalcColumnWidth(id, oExpectedProperty, oExpectedAdditionalProperty) {
			oSmartTable._calcColumnWidth = function(oField) {
				assert.equal(oField.name, oExpectedProperty, id + ": Given Property as expected");
				assert.equal(oField.additionalProperty, oExpectedAdditionalProperty, id + ": Given additionalProperty as expected");
				return 2; //Just to fullfill the function contract
			};
		}

		for (var i = 0; i < aTestAdditionalProperty.length; i++) {
			adjustCalcColumnWidth(i, aTestAdditionalProperty[i].expectedProperty, aTestAdditionalProperty[i].expectedAdditionalProperty);
			oColumn.setWidth().data("p13nData", {autoColumnWidth: {visibleProperty: aTestAdditionalProperty[i].visibleProperty}, leadingProperty: aTestAdditionalProperty[i].leadingProperty, additionalProperty: aTestAdditionalProperty[i].additionalProperty});
			oSmartTable._setWidthForCustomColumn(oColumn);
		}

		oSmartTable.getModel.restore();
		oSmartTable.destroy();
	});

	QUnit.test("test column width calculation", function(assert) {
		var fWidth, mConfig = {
			min: 2,
			max: 19,
			padding: 0,
			epsilon: 0,
			defaultWidth: 8,
			labelSplit: true
		}, check = function(sRefText, fOrigWidth, fRange) {
			var fRefTextWidth = TableUtil.measureText(sRefText);
			return Math.abs(fRefTextWidth - fOrigWidth) <= (fRange || 0.5);
		};

		[{type: "Edm.Byte"}, {type: "Edm.SByte"}, {type: "Edm.Byte"}, {isImageURL: true}].forEach(function(oField) {
			fWidth = this.oSmartTable._calcColumnWidth(oField, false, mConfig);
			assert.equal(fWidth, mConfig.min, "Min column width for " + JSON.stringify(oField));
		}, this);

		[{type: "Edm.String", maxLength: 255}, {type: "Edm.String", maxLength: 200, label: "A".repeat(80)}].forEach(function(oField) {
			oField.modelType = ODataType.getType(oField.type, {}, oField);
			fWidth = this.oSmartTable._calcColumnWidth(oField, false, mConfig);
			assert.equal(fWidth, mConfig.max, "Max column width for " + JSON.stringify(oField));
		}, this);

		[null, undefined].forEach(function(oField) {
			fWidth = this.oSmartTable._calcColumnWidth(oField, false, mConfig);
			assert.equal(fWidth, mConfig.defaultWidth, "Default column width for " + JSON.stringify(oField));
		}, this);

		fWidth = this.oSmartTable._calcColumnWidth({type: "Edm.String", label: "a", modelType: ODataType.getType("Edm.String")}, false, mConfig);
		assert.equal(fWidth, mConfig.max, "If maxLength is not defined then the width should be the max width ");

		fWidth = this.oSmartTable._calcColumnWidth({
			type: "Edm.Boolean",
			modelType: ODataType.getType("Edm.Boolean")
		}, false, mConfig);
		assert.equal(fWidth, mConfig.min, "'Yes' has 3 characters length");

		var aTestData = [
			{type: "Edm.DateTime", reference: "May 26, 2023, 10:47:58 PM"},
			{type: "Edm.Time", reference: "10:47:58 PM"},
			{type: "Edm.Int16", reference: "32,768"},
			{type: "Edm.Int32", reference: "247,483,648"},
			{type: "Edm.Int64", reference: "999,999,999,999"},
			{type: "Edm.Float", reference: "9,999.99"},
			{type: "Edm.Single", reference: "9,999.99"},
			{type: "Edm.Double", reference: "9,999,999,999.999"},
			{type: "Edm.Decimal", reference: "999,999,999,999.999"}
		];

		aTestData.forEach(function(mTest) {
			var fOrigWidth = this.oSmartTable._calcColumnWidth({
				type: mTest.type,
				modelType: ODataType.getType(mTest.type)
			}, false, mConfig);
			assert.ok(check(mTest.reference, fOrigWidth), mTest.type + " field column width calculated correctly");
		}, this);


		this.oSmartTable._isTreeTable = true;
		aTestData.forEach(function(mTest) {
			var fOrigWidth = this.oSmartTable._calcColumnWidth({
				type: mTest.type,
				modelType: ODataType.getType(mTest.type),
				hierarchy: "test",
				index: 0
			}, false, mConfig);
			assert.ok(check(mTest.reference, fOrigWidth, 3.5), mTest.type + " field column width calculated correctly for the TreeTable first column");
		}, this);
		delete this.oSmartTable._isTreeTable;

		// --- additionalProperty --- //

		this.oSmartTable.setEntitySet("EntitySet");
		sinon.stub(this.oSmartTable, "getModel").returns(getModelStubInstance(ODataModel));
		this.oSmartTable._createTableProvider();
		var oGetFieldMetadataStub = sinon.stub(this.oSmartTable._oTableProvider, "getFieldMetadata");

		oGetFieldMetadataStub.returns({
			name: "additional",
			type: "Edm.String",
			maxLength: 5,
			modelType: ODataType.getType("Edm.String", null, {maxLength: 5})
		});
		fWidth = this.oSmartTable._calcColumnWidth({
			name: "leading",
			type: "Edm.String",
			maxLength: 10,
			modelType: ODataType.getType("Edm.String", null, {maxLength: 10}),
			additionalProperty: "additional"
		}, false, mConfig);
		assert.ok(check("A".repeat(10) + " (" + "A".repeat(5) + ")" , fWidth), "Additional field width calculated correctly");

		fWidth = this.oSmartTable._calcColumnWidth({
			name: "leading",
			type: "Edm.String",
			maxLength: 6,
			vertical: true,
			modelType: ODataType.getType("Edm.String", null, {maxLength: 6}),
			additionalProperty: "additional"
		}, false, mConfig);
		assert.ok(check("A".repeat(6), fWidth), "Additional field width calculated correctly for vertical template");

		fWidth = this.oSmartTable._calcColumnWidth({
			name: "leading",
			type: "Edm.String",
			maxLength: 4,
			displayBehaviour: "idOnly",
			modelType: ODataType.getType("Edm.String", null, {maxLength: 4}),
			additionalProperty: "additional"
		}, false, mConfig);
		assert.ok(check("A".repeat(4), fWidth), "Additional field is ignored since displayBehaviour=idOnly");

		oGetFieldMetadataStub.returns({
			name: "additionalShort",
			type: "Edm.String",
			maxLength: 1,
			modelType: ODataType.getType("Edm.String", null, {maxLength: 1})
		});
		fWidth = this.oSmartTable._calcColumnWidth({
			name: "leading",
			type: "Edm.String",
			maxLength: 1,
			displayBehaviour: "idAndDescription",
			modelType: ODataType.getType("Edm.String", null, {maxLength: 1}),
			unit: "additionalShort",
			additionalProperty: "additionalShort"
		}, false, mConfig);
		assert.ok(fWidth >= 4, "Min unit field width is taken into account");

		oGetFieldMetadataStub.restore();
		this.oSmartTable.getModel.restore();
	});

	QUnit.test("test column width calculation should consider autoColumnWidth from customizeConfig", function(assert) {
		this.oSmartTable.destroy();

		this.oSmartTable = new SmartTable({
			entitySet: "EntitySet",
			enableAutoColumnWidth: true,
			customizeConfig: {
				"autoColumnWidth": {
					"PropA": {
						"truncateLabel": false,
						"min": 5,
						"max": 10,
						"gap": 2
					}
				}
			}
		});
		var fCalcColumnWidthSpy = sinon.spy(this.oSmartTable, "_calcColumnWidth");
		this.oSmartTable._createTableProvider();
		this.oSmartTable._aTableViewMetadata = [{
			name: "PropA",
			label: "Property A",
			isInitiallyVisible: true,
			template: new Text()
		}];

		this.oSmartTable._createContent();
		assert.ok(fCalcColumnWidthSpy.calledOnce, "_calcColumnWidth method called");
		assert.deepEqual(fCalcColumnWidthSpy.args[0][2], {
				truncateLabel: false,
				min: 5,
				max: 10,
				gap: 2
		}, "The provided autoColumnWidth customizeConfig was considered for PropA column width calculation");

		fCalcColumnWidthSpy.reset();
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			entitySet: "EntitySet",
			enableAutoColumnWidth: true,
			customizeConfig: {
				"autoColumnWidth": {
					"*": {
						"truncateLabel": false,
						"min": 5,
						"max": 10,
						"gap": 2
					}
				}
			}
		});
		fCalcColumnWidthSpy = sinon.spy(this.oSmartTable, "_calcColumnWidth");
		this.oSmartTable._createTableProvider();
		this.oSmartTable._aTableViewMetadata = [{
			name: "PropA",
			label: "Property A",
			isInitiallyVisible: true,
			template: new Text()
		}];
		this.oSmartTable._createContent();
		assert.ok(fCalcColumnWidthSpy.calledOnce, "_calcColumnWidth method called");
		assert.deepEqual(fCalcColumnWidthSpy.args[0][2], {
				truncateLabel: false,
				min: 5,
				max: 10,
				gap: 2
		}, "The provided autoColumnWidth customizeConfig was considered for '*' column width calculation");

		fCalcColumnWidthSpy.reset();
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			entitySet: "EntitySet",
			enableAutoColumnWidth: true,
			customizeConfig: {
				"autoColumnWidth": {
					"PropA": false
				}
			}
		});
		this.oSmartTable._createTableProvider();
		var oField = {
			name: "PropA",
			label: "Property A",
			isInitiallyVisible: true,
			template: new Text()
		};
		assert.strictEqual(this.oSmartTable._calcColumnWidth(oField, false, this.oSmartTable._fetchAutoColumnWidthConfig(oField)), 8, "defaultWidth return since autoColumnWidth=false for PropA");
	});

	QUnit.test("test _updateColumnWidthForEdit", function(assert) {
		var oColumn = new UIColumn({
			width: "3rem"
		});
		var sPreviousColumnWidth;
		var fInputPadding = parseFloat(ThemeParameters.get({name: "_sap_m_InputBaseWrapper_Sum_Border"}))
							+ parseFloat(ThemeParameters.get({name: "_sap_m_InputBase_InnerPadding"}).split(" ").pop()) * 2
							+ this.oSmartTable._fColumnPaddingBorder;
		var fInputWithIconPadding = fInputPadding
									+ parseFloat(ThemeParameters.get({name: "_sap_m_InputBase_IconWidth"}))
									- 0.25;

		this.oSmartTable.setEnableAutoColumnWidth(true);
		this.oSmartTable.data("useSmartField", true);
		this.oSmartTable.getTable().addColumn(oColumn);

		[	null,
			{},
			{width: "auto"},
			{type: "Edm.Boolean"},
			{semanticObjects: {}},
			{"sap:updatable": "false"},
			{"sap:creatable": "false"}
		].forEach(function(oField) {
			this.oSmartTable._updateColumnWidthForEdit(oColumn, oField);
			assert.equal(oColumn.getWidth(), "3rem", "Column width is not changed for " + JSON.stringify(oField));
		}, this);

		this.oSmartTable._updateColumnWidthForEdit(oColumn, {
			isColumnCreated: true,
			editWidth: "3rem",
			width: "2rem"
		});
		assert.equal(oColumn.getWidth(), "2rem", "Column width is changed to display width ");

		// Ack
		this.oSmartTable.setEditable(true);

		this.oSmartTable._updateColumnWidthForEdit(oColumn, {
			isColumnCreated: true,
			editWidth: "3rem",
			width: "2rem"
		});
		assert.equal(oColumn.getWidth(), "3rem", "Column width is updated to editable case");

		this.oSmartTable._updateColumnWidthForEdit(oColumn, {
			isColumnCreated: true,
			width: "3rem"
		});
		assert.equal(parseFloat(oColumn.getWidth()), Math.max(3/*ColumnWidth*/, fInputPadding + 2), "Min column width is applied for input case");

		[	{isCalendarDate: true},
			{type: "Edm.DateTime"},
			{type: "Edm.DateTimeOffset"},
			{type: "Edm.Time"},
			{hasValueListAnnotation: true}
		].forEach(function(oField) {
			oColumn.setWidth("3rem");
			this.oSmartTable._updateColumnWidthForEdit(oColumn, Object.assign({
				isColumnCreated: true,
				width: "3rem",
				ownWidth: 3
			}, oField));
			assert.equal(parseFloat(oColumn.getWidth()), 3 + fInputWithIconPadding,
				"Min column width is applied for input with icon case: " + JSON.stringify(oField));
		}, this);

		sPreviousColumnWidth = oColumn.getWidth();
		this.oSmartTable._updateColumnWidthForEdit(oColumn, {
			isColumnCreated: true,
			editWidth: "3rem",
			width: "5rem"
		});
		assert.equal(oColumn.getWidth(), sPreviousColumnWidth, "Column width is not changed because column is resized during edit");

		// Ack
		oColumn.data("p13nData", {
			leadingProperty: "PropA"
		});
		oColumn.setWidth("8rem");
		this.oSmartTable.setEntitySet("EntitySet");
		sinon.stub(this.oSmartTable, "getModel").returns(getModelStubInstance(ODataModel));
		this.oSmartTable._createTableProvider();
		sinon.stub(this.oSmartTable._oTableProvider, "getFieldMetadata").returns({
			name: "PropA",
			editWidth: "8rem",
			isColumnCreated: true,
			width: "3rem"
		});

		this.oSmartTable.setEditable(false);
		assert.equal(oColumn.getWidth(), "3rem", "Column width is updated when switched from edit to display");

		// Ack
		this.oSmartTable.setEditable(true);
		oColumn.setWidth("auto");

		this.oSmartTable._updateColumnWidthForEdit(oColumn, {
			isColumnCreated: true,
			displayBehaviour: "idAndDescription",
			additionalWidth: 12,
			hasValueListAnnotation: true,
			hasFixedValues: false,
			labelWidth: 10,
			ownWidth: 7,
			width: "auto"
		});
		assert.equal(
			parseFloat(oColumn.getWidth()),
			Math.max(7/*ownWidth*/ + fInputWithIconPadding, 10/*labelWidth*/ + this.oSmartTable._fColumnPaddingBorder),
			"Column width is shrink during the edit because now editable field need to show only id");

		oColumn.setWidth("3rem");
		this.oSmartTable._updateColumnWidthForEdit(oColumn, {
			isColumnCreated: true,
			displayBehaviour: "idAndDescription",
			hasValueListAnnotation: true,
			hasFixedValues: true,
			ownWidth: 2,
			width: "3rem"
		});
		assert.equal(parseFloat(oColumn.getWidth()), 5/*ownWidth+3*/ + fInputWithIconPadding,
			"Column width is enlarged because editable field need to show id and description");

		oColumn.setWidth("3rem");
		this.oSmartTable._updateColumnWidthForEdit(oColumn, {
			isColumnCreated: true,
			unit: "unitfield",
			ownWidth: 2,
			additionalWidth: 4,
			width: "3rem"
		});
		assert.equal(parseFloat(oColumn.getWidth()), 6/*ownWidth+additionalWidth*/ + fInputWithIconPadding,
			"Column width is enlarged because editable unit field need to show amount + unit");

		this.oSmartTable._oTableProvider.getFieldMetadata.restore();
		this.oSmartTable.getModel.restore();
	});

	QUnit.test("test _createTable function", function(assert) {
		this.oSmartTable.removeAllItems();
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;

		this.oSmartTable.setTableType("AnalyticalTable");
		this.oSmartTable.addItem(new Table());
		this.oSmartTable._createTable();

		assert.ok(this.oSmartTable._isMobileTable, "internal Mobile table has to be used");
		assert.ok(this.oSmartTable._createColumn === this.oSmartTable._createMobileColumn, "create column function has to be adjusted to create mobile columns");

		this.oSmartTable.removeAllItems();
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;

		this.oSmartTable.addItem(new AnalyticalTable());
		this.oSmartTable._createTable();

		assert.ok(this.oSmartTable._isAnalyticalTable, "internal Analytical table has to be used");
		assert.ok(this.oSmartTable._createColumn === this.oSmartTable._createAnalyticalColumn, "create column function has to be adjusted to create analytical columns");

		this.oSmartTable.removeAllItems();
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		delete this.oSmartTable._isAnalyticalTable;

		this.oSmartTable.addItem(new TreeTable());
		this.oSmartTable._createTable();

		assert.ok(this.oSmartTable._isTreeTable, "internal Tree table has to be used");

		this.oSmartTable.removeAllItems();
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;

		this.oSmartTable.setTableType("AnalyticalTable");
		this.oSmartTable._createTable();
		assert.ok(this.oSmartTable.getTable() instanceof AnalyticalTable, "table has to be created according to table type Analytical table");
		assert.ok(this.oSmartTable._isAnalyticalTable, "Analytical table flag has been set");

		this.oSmartTable.removeAllItems();
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		delete this.oSmartTable._isAnalyticalTable;

		this.oSmartTable.setTableType("TreeTable");
		this.oSmartTable._createTable();
		assert.ok(this.oSmartTable.getTable() instanceof TreeTable, "table has to be created according to table type Tree table");

		this.oSmartTable.removeAllItems();
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("ResponsiveTable");
		this.oSmartTable._createTable();
		assert.ok(this.oSmartTable.getTable() instanceof Table, "table has to be created according to table type ResponsiveTable table");

		this.oSmartTable.removeAllItems();
		if (this.oSmartTable._oTable) {
			this.oSmartTable._oTable.destroy();
		}
		this.oSmartTable._oTable = null;
		this.oSmartTable.setTableType("Table");
		this.oSmartTable._createTable();
		assert.ok(this.oSmartTable.getTable() instanceof UITable, "table has to be created according to table type Table table");
	});

	QUnit.test("test grouping in AnalyticalColumn", function(assert) {
		var oField = {}, oColumn;
		oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
		assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
		assert.ok(!oColumn.getGroupHeaderFormatter(), "no group header formatter is set");
		assert.strictEqual(oColumn.getGrouped(), false, "Grouped is not set!");
		assert.strictEqual(oColumn.getShowIfGrouped(), false, "ShowIfGrouped is not set!");
		oColumn.destroy();

		// Field that can have some formatting
		oField = {
			unit: "foo"
		};
		oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
		assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
		assert.ok(oColumn.getGroupHeaderFormatter(), "group header formatter is set");
		assert.strictEqual(typeof oColumn.getGroupHeaderFormatter(), "function", "group header formatter is a function");
		assert.strictEqual(oColumn.getGrouped(), false, "Grouped is not set!");
		assert.strictEqual(oColumn.getShowIfGrouped(), false, "ShowIfGrouped is not set!");
		oColumn.destroy();

		// Grouping enabled via annotations
		oField = {
			grouped: true
		};
		oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
		assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
		assert.strictEqual(oColumn.getGrouped(), true, "Grouped is set!");
		assert.strictEqual(oColumn.getShowIfGrouped(), true, "ShowIfGrouped is set!");
		oColumn.destroy();
	});

	QUnit.test("test special style classes for AnalyticalColumn", function(assert) {
		var sMeasureHidden = "sapUiAnalyticalTableSumCellHidden sapUiAnalyticalTableGroupCellHidden";
		var sCurrencyBold = "sapUiCompCurrencyBold";

		// Mock a meaure field as annotated normally
		var oField = {
			isMeasureField: true,
			unit: "foo",
			aggregationRole: "measure",
			template: new Control()
		}, oColumn;

		oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
		assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
		assert.strictEqual(oColumn.getTemplate().hasStyleClass(sMeasureHidden), false, "sMeasureHidden is not set!");
		assert.strictEqual(oColumn.getTemplate().hasStyleClass(sCurrencyBold), false, "sCurrencyBold is not set!");
		oColumn.destroy();
		assert.strictEqual(oField.template.bIsDestroyed, true, "template also destyoed");

		// set field as Currency
		oField.isCurrencyField = true;
		oField.template = new Control(); // re-create destroyed control

		oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
		assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
		assert.strictEqual(oColumn.getTemplate().hasStyleClass(sMeasureHidden), false, "sMeasureHidden is not set!");
		assert.strictEqual(oColumn.getTemplate().hasStyleClass(sCurrencyBold), true, "sCurrencyBold is not set!");
		oColumn.destroy();
		assert.strictEqual(oField.template.bIsDestroyed, true, "template also destyoed");

		// set field as non-measure (analytical)
		delete oField.aggregationRole;
		oField.template = new Control(); // re-create destroyed control

		oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
		assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
		assert.strictEqual(oColumn.getTemplate().hasStyleClass(sMeasureHidden), true, "sMeasureHidden is not set!");
		assert.strictEqual(oColumn.getTemplate().hasStyleClass(sCurrencyBold), false, "sCurrencyBold is not set!");
		oColumn.destroy();
		assert.strictEqual(oField.template.bIsDestroyed, true, "template destyoed");
	});

	QUnit.test("test _showTableFilterDialog function", function(assert) {
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			useVariantManagement: false,
			useTablePersonalisation: false,
			tableType: "AnalyticalTable"
		});

		var bOpenDialogWasCalled = false;
		this.oSmartTable._oPersController = {
			openDialog: function() {
				bOpenDialogWasCalled = true;
			}
		};
		this.oSmartTable._bIsFilterPanelEnabled = true;
		this.oSmartTable._createTable();

		this.oSmartTable._oTable.fireCustomFilter({
			column: new AnalyticalColumn()
		});

		assert.ok(bOpenDialogWasCalled, "attachCustomFilter has to be registered correctly");
	});

	QUnit.test("test _updateInitialColumns function", function(assert) {
		var oColumn1 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnKey: "LP1"
				}
			})
		});
		var oColumn2 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnKey: "LP2"
				}
			})
		});

		var oColumn3 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnKey: "LP3"
				}
			})
		});

		var aColumns = [
			oColumn1, oColumn2, oColumn3
		];

		this.oSmartTable._isMobileTable = true;
		this.oSmartTable._oTable = {
			getColumns: function() {
				return aColumns;
			}
		};

		this.oSmartTable._aExistingColumns = [];
		this.oSmartTable._updateInitialColumns();

		assert.ok(this.oSmartTable._aExistingColumns.indexOf("LP1") !== -1, "columnKey has to be retrieved from columns correctly (LP1)");
		assert.ok(this.oSmartTable._aExistingColumns.indexOf("LP2") !== -1, "columnKey has to be retrieved from columns correctly (LP2)");
		assert.ok(this.oSmartTable._aExistingColumns.indexOf("LP3") !== -1, "columnKey has to be retrieved from columns correctly (LP3)");
	});

	QUnit.test("test _parseIndexedColumns function", function(assert) {
		var oColumn0 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnIndex: 0
				}
			})
		});
		var oColumn1 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnIndex: 3
				}
			})
		});
		var oColumn2 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnIndex: 5
				}
			})
		});
		var oColumn3 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnIndex: 6
				}
			})
		});
		var oColumn4 = new Column();

		var aColumns = [
			oColumn3, oColumn1, oColumn2, oColumn4, oColumn0
		];

		this.oSmartTable._isMobileTable = true;
		this.oSmartTable._oTable = {
			getColumns: function() {
				return aColumns;
			},
			removeColumn: function() {
			}
		};

		var aIndexedColumns = this.oSmartTable._parseIndexedColumns();

		assert.equal(aIndexedColumns.length, 4, "4 columns are indexed");
		assert.equal(aIndexedColumns[0].column.getId(), oColumn0.getId(), "column 0 has to be first in array");
		assert.equal(aIndexedColumns[0].index, 0, "column 0 has index 0");
		assert.equal(aIndexedColumns[1].column.getId(), oColumn1.getId(), "column 1 has to be second in array");
		assert.equal(aIndexedColumns[1].index, 3, "column 1 has index 3");
		assert.equal(aIndexedColumns[2].column.getId(), oColumn2.getId(), "column 2 has to be third in array");
		assert.equal(aIndexedColumns[2].index, 5, "column 2 has index 5");
		assert.equal(aIndexedColumns[3].column.getId(), oColumn3.getId(), "column 3 has to be fourth in array");
		assert.equal(aIndexedColumns[3].index, 6, "column 3 has index 6");
	});

	QUnit.test("test _parseIndexedColumns && _insertIndexedColumns via _createContent function", function(assert) {
		var oColumn0 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnIndex: 0
				}
			})
		});
		var oColumn1 = new Column();
		var oColumn2 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnIndex: 2
				}
			})
		});
		var oColumn3 = new Column();
		var oColumn4 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnIndex: 5
				}
			})
		});
		var oColumn5 = new Column({
			customData: new CustomData({
				key: "p13nData",
				value: {
					columnIndex: 6
				}
			})
		});

		var oTemplate0 = new Text({
			id: "oTemplate0"
		});
		var oTemplate1 = new Text({
			id: "oTemplate1"
		});
		var oTemplate2 = new Text({
			id: "oTemplate2"
		});
		var oTemplate3 = new Text({
			id: "oTemplate3"
		});
		var oTemplate4 = new Text({
			id: "oTemplate4"
		});
		var oTemplate5 = new Text({
			id: "oTemplate5"
		});

		var aColumns = [
			oColumn1, oColumn2, oColumn4, oColumn3, oColumn0, oColumn5
		];
		var aCells = [
			oTemplate1, oTemplate2, oTemplate4, oTemplate3, oTemplate0, oTemplate5
		];

		this.oSmartTable._oTemplate = new ColumnListItem({
			cells: aCells
		});

		this.oSmartTable._isMobileTable = true;
		this.oSmartTable._oTable = {
			getColumns: function() {
				return aColumns;
			},
			removeColumn: function() {
			},
			insertColumn: function() {
			},
			setFixedLayout: function() {
			},
			setContextualWidth: function() {
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "ResponsiveTable";
					}
				};
			}
		};

		this.oSmartTable._updateColumnsPopinFeature = function() {
		};
		this.oSmartTable._aTableViewMetadata = [];

		this.oSmartTable._createContent();

		aCells = this.oSmartTable._oTemplate.getCells();

		assert.equal(aCells.length, 6, "there have to be 6 templates in the collection");
		assert.equal(aCells[0].getId(), oTemplate0.getId(), "template have to be moved according to column index");
		assert.equal(aCells[1].getId(), oTemplate1.getId(), "template have to be moved according to column index");
		assert.equal(aCells[2].getId(), oTemplate2.getId(), "template have to be moved according to column index");
		assert.equal(aCells[3].getId(), oTemplate3.getId(), "template have to be moved according to column index");
		assert.equal(aCells[4].getId(), oTemplate4.getId(), "template have to be moved according to column index");
		assert.equal(aCells[5].getId(), oTemplate5.getId(), "template have to be moved according to column index");

	});

	QUnit.test("test _setIgnoreFromPersonalisationToSettings function", function(assert) {

		this.oSmartTable.setIgnoreFromPersonalisation("a,b,c,d");

		var oResult = this.oSmartTable._setIgnoreFromPersonalisationToSettings(null);
		var oExpected = {
			filter: {
				ignoreColumnKeys: [
					"a", "b", "c", "d"
				]
			},
			sort: {
				ignoreColumnKeys: [
					"a", "b", "c", "d"
				]
			},
			columns: {
				ignoreColumnKeys: [
					"a", "b", "c", "d"
				]
			},
			group: {
				ignoreColumnKeys: [
					"a", "b", "c", "d"
				]
			}
		};

		assert.deepEqual(oResult, oExpected, "settings have to be correct with empty settings");

		oResult = this.oSmartTable._setIgnoreFromPersonalisationToSettings({
			filter: {
				dummy: "Test"
			}
		});
		oExpected = {
			filter: {
				dummy: "Test",
				ignoreColumnKeys: [
					"a", "b", "c", "d"
				]
			},
			sort: {
				ignoreColumnKeys: [
					"a", "b", "c", "d"
				]
			},
			columns: {
				ignoreColumnKeys: [
					"a", "b", "c", "d"
				]
			},
			group: {
				ignoreColumnKeys: [
					"a", "b", "c", "d"
				]
			}
		};

		assert.deepEqual(oResult, oExpected, "settings have to be correct with prefilled settings");
	});

	QUnit.test("test _removeExpandParameter function", function(assert) {
		var sResult = this.oSmartTable._removeExpandParameter("http://myTest?$expand=a,b,c");
		assert.equal(sResult, "http://myTest");

		sResult = this.oSmartTable._removeExpandParameter("http://myTest?$expand=a,b,c&parameterB=test");
		assert.equal(sResult, "http://myTest?parameterB=test");

		sResult = this.oSmartTable._removeExpandParameter("http://myTest?parameterB=test&$expand=a,b,c");
		assert.equal(sResult, "http://myTest?parameterB=test");

		sResult = this.oSmartTable._removeExpandParameter("http://myTest?parameterB=test&$expand=a,b,c&parameterC=test");
		assert.equal(sResult, "http://myTest?parameterB=test&parameterC=test");

		sResult = this.oSmartTable._removeExpandParameter("/sap/opu/odata/sap/Z_BS_HD_DRAFT_SRV/Zfarvd_Bs_Hd_Bo?$format=xlsx&$orderby=CompanyCode%20desc,HouseBank%20asc&$select=CompanyCode%2cHouseBank%2cHouseBankName%2chousebankaccount%2cbankstatementdate%2cbankstatement%2cbankstatementnumberofitems%2ccurrency%2copeningbalanceamtintranscrcy%2cclosingbalanceamtintranscrcy%2cbankstatementstatus%2cdraftkey%2cbankstatementshortid%2cbankstatementshortid%2cIsActiveEntity%2cHasDraftEntity%2cHasActiveEntity%2cDraftAdministrativeData&$expand=DraftAdministrativeData");
		assert.equal(sResult, "/sap/opu/odata/sap/Z_BS_HD_DRAFT_SRV/Zfarvd_Bs_Hd_Bo?$format=xlsx&$orderby=CompanyCode%20desc,HouseBank%20asc&$select=CompanyCode%2cHouseBank%2cHouseBankName%2chousebankaccount%2cbankstatementdate%2cbankstatement%2cbankstatementnumberofitems%2ccurrency%2copeningbalanceamtintranscrcy%2cclosingbalanceamtintranscrcy%2cbankstatementstatus%2cdraftkey%2cbankstatementshortid%2cbankstatementshortid%2cIsActiveEntity%2cHasDraftEntity%2cHasActiveEntity%2cDraftAdministrativeData");
	});

	QUnit.test("test openPersonalisationDialog function", function(assert) {
		this.oSmartTable._oPersController = {
			openDialog: sinon.stub()
		};

		assert.strictEqual(this.oSmartTable._oPersController.openDialog.notCalled, true, "openPersonalisationDialog not yet called");

		this.oSmartTable.openPersonalisationDialog();
		assert.strictEqual(this.oSmartTable._oPersController.openDialog.notCalled, true, "openPersonalisationDialog still not yet called");

		this.oSmartTable.openPersonalisationDialog("Sort");
		assert.strictEqual(this.oSmartTable._oPersController.openDialog.calledOnce, true, "openPersonalisationDialog is now called");
		assert.strictEqual(this.oSmartTable._oPersController.openDialog.calledWith({
			sort: {
				visible: true
			}
		}), true, "openPersonalisationDialog called with settings to make sort panel visible");
	});

	QUnit.test("test 'createMessageStrip' and keep existing setting config'", function(assert) {
		//set 'usePersonalisation' to allow _createPersonalizationController
		this.oSmartTable._oPersController = undefined;
		this.oSmartTable.setUseTablePersonalisation(true);

		this.oSmartTable._bIsFilterPanelEnabled = false;

		//mock initial 'setting' for Controller
		this.oSmartTable._oP13nDialogSettings = {
			filter: {
				visible: false
			}
		};

		//create p13n Controller --> check if settings are correct
		this.oSmartTable._createPersonalizationController();
		assert.strictEqual(this.oSmartTable._oP13nDialogSettings.filter.visible, false, "Initial setting config for Controler kept");
		assert.ok(!this.oSmartTable._oP13nDialogSettings.filter.createMessageStrip, "Callback 'createMessageStrip' not provided when unnecessary");

		//create p13n Controller, but now with filtering --> check if settings are correct
		this.oSmartTable._oPersController = null;
		this.oSmartTable._bIsFilterPanelEnabled = true;
		this.oSmartTable._createPersonalizationController();
		assert.strictEqual(this.oSmartTable._oP13nDialogSettings.filter.visible, false, "Initial setting config for Controler kept");
		assert.ok(this.oSmartTable._oP13nDialogSettings.filter.createMessageStrip, "Callback 'createMessageStrip' provided when necessary");

	});

	QUnit.test("Initial noData Text - '$FILTERBAR'", function(assert) {
		var sInitialNoDataWithSmartFilter = Library.getResourceBundleFor("sap.ui.comp").getText("SMARTTABLE_NO_DATA");

		var fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");

		// Pre-Check
		assert.ok(fNoDataSpy.notCalled);
		assert.ok(!this.oSmartTable.isInitialised());

		// Initilaise control --> causes initial noData text to be updated
		this.oSmartTable.setEntitySet("COMPANYSet");
		this.oSmartTable.setInitialNoDataText("$FILTERBAR");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));

		// Post-Check
		assert.ok(this.oSmartTable.isInitialised());
		assert.ok(fNoDataSpy.calledOnce);
		assert.ok(fNoDataSpy.calledWith(sInitialNoDataWithSmartFilter));
	});

	QUnit.test("Initial noData Text - '$NO_FILTERBAR' even if a filterbar is associated", function(assert) {
		var sInitialNoDataWithoutSmartFilter = Library.getResourceBundleFor("sap.ui.comp").getText("SMARTTABLE_NO_DATA_WITHOUT_FILTERBAR");

		var fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");

		// Pre-Check
		assert.ok(fNoDataSpy.notCalled);
		assert.ok(!this.oSmartTable.isInitialised());

		// Initilaise control --> causes initial noData text to be updated
		var oSmartFilterBar = new SmartFilterBar();
		this.oSmartTable.setSmartFilterId(oSmartFilterBar.getId());
		this.oSmartTable.setEntitySet("COMPANYSet");
		this.oSmartTable.setInitialNoDataText("$NO_FILTERBAR");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));

		// Post-Check
		assert.ok(this.oSmartTable.isInitialised());
		assert.ok(fNoDataSpy.calledOnce);
		assert.ok(fNoDataSpy.calledWith(sInitialNoDataWithoutSmartFilter));
		oSmartFilterBar.destroy();
	});

	QUnit.test("Initial noData Text - custom text", function(assert) {
		var fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");
		var sCustomInitialNoDataText = "a custom initial no data text";
		// Pre-Check
		assert.ok(fNoDataSpy.notCalled);
		assert.ok(!this.oSmartTable.isInitialised());

		// Initilaise control --> causes initial noData text to be updated
		var oSmartFilterBar = new SmartFilterBar();
		this.oSmartTable.setSmartFilterId(oSmartFilterBar.getId());
		this.oSmartTable.setEntitySet("COMPANYSet");
		this.oSmartTable.setInitialNoDataText(sCustomInitialNoDataText);
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));

		// Post-Check
		assert.ok(this.oSmartTable.isInitialised());
		assert.ok(fNoDataSpy.calledOnce);
		assert.ok(fNoDataSpy.calledWith(sCustomInitialNoDataText));
		oSmartFilterBar.destroy();
	});

	QUnit.test("noData Texts", function(assert) {

		// This text is used initialy if no Filterbar is used or after Data fetch if no filters are set - not in filterbar, not in filter panel
		var sNoDataWithoutFilter = Library.getResourceBundleFor("sap.ui.comp").getText("SMARTTABLE_NO_DATA_WITHOUT_FILTERBAR");
		// Before or after Data fetch if Filterbar is used or filters are set
		var sNoDataWithFilter = Library.getResourceBundleFor("sap.ui.comp").getText("SMARTTABLE_NO_RESULTS");

		var fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");

		// Check without SmartFilterBar

		// Pre-Check
		assert.ok(fNoDataSpy.notCalled);
		assert.ok(!this.oSmartTable.isInitialised());

		// Initilaise control --> causes initial noData text to be updated
		this.oSmartTable.setEntitySet("COMPANYSet");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));

		// Post-Check - 1
		assert.ok(this.oSmartTable.isInitialised());
		assert.ok(fNoDataSpy.calledOnce);
		assert.ok(fNoDataSpy.calledWith(sNoDataWithoutFilter));

		// simulate noData text update (which is done just before binding update)
		this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to force enable binding
		sinon.stub(this.oSmartTable._oTable, "bindRows"); // do not actually create a binding with a fake model
		this.oSmartTable.rebindTable();

		// Post-Check - 2
		assert.ok(fNoDataSpy.calledTwice);
		assert.ok(fNoDataSpy.calledWith(sNoDataWithoutFilter));

		var oFilter = new Filter({path: "foo", operator: "EQ", value1: "test"});
		this.oSmartTable.attachEventOnce("beforeRebindTable", function(oEvent) {
			oEvent.getParameter('bindingParams').filters.push(oFilter);
		});
		this.oSmartTable.rebindTable();
		assert.ok(fNoDataSpy.calledThrice);
		assert.ok(fNoDataSpy.calledWith(sNoDataWithFilter));

		// Reset Conditions for check with SmartFilterBar
		var sInitialNoDataWithSmartFilter = Library.getResourceBundleFor("sap.ui.comp").getText("SMARTTABLE_NO_DATA");
		var oSmartFilterBar = new SmartFilterBar();
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			tableType: "ResponsiveTable",
			smartFilterId: oSmartFilterBar.getId(),
			useVariantManagement: false,
			useTablePersonalisation: false
		});
		fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoDataText");

		// Pre-Check
		assert.ok(fNoDataSpy.notCalled);
		assert.ok(!this.oSmartTable.isInitialised());

		// Initilaise control --> causes initial noData text to be updated
		this.oSmartTable.setEntitySet("COMPANYSet");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));

		// Post-Check - 1
		assert.ok(this.oSmartTable.isInitialised());
		assert.ok(fNoDataSpy.calledOnce);
		assert.ok(fNoDataSpy.calledWith(sInitialNoDataWithSmartFilter));

		// simulate noData text update (which is done just before binding update)
		this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to force enable binding
		sinon.stub(this.oSmartTable._oTable, "bindRows"); // do not actually create a binding with a fake model
		this.oSmartTable.rebindTable();

		// Post-Check - 2
		assert.ok(fNoDataSpy.calledTwice);
		assert.ok(fNoDataSpy.calledWith(sNoDataWithoutFilter));

		this.oSmartTable.setNoData("Custom noData text");
		assert.ok(fNoDataSpy.calledThrice);
		assert.ok(fNoDataSpy.calledWith("Custom noData text"));

		// Without Filter Panel and without FilterBar, but with Filter
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			useVariantManagement: false,
			useTablePersonalisation: false
		});
		fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");
		// Initilaise control --> causes initial noData text to be updated
		this.oSmartTable.setEntitySet("COMPANYSet");
		this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to force enable binding
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));

		oFilter = new Filter({path: "foo", operator: "EQ", value1: "test"});
		this.oSmartTable.attachEventOnce("beforeRebindTable", function(oEvent) {
			oEvent.getParameter('bindingParams').filters.push(oFilter);
		});
		sinon.stub(this.oSmartTable._oTable, "bindRows");
		this.oSmartTable.rebindTable();

		assert.ok(fNoDataSpy.calledWith(sNoDataWithoutFilter));
		this.oSmartTable._oTable.bindRows.restore();
	});

	QUnit.test("noData text set on inner custom table", function(assert) {
		this.oSmartTable.destroy();

		this.oSmartTable = new SmartTable({
			tableType: "ResponsiveTable",
			entitySet: "COMPANYSet",
			useVariantManagement: false,
			useTablePersonalisation: false
		});

		this.oSmartTable._oTable.setNoDataText("Custom no data text");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));

		// simulate noData text update (which is done just before binding update)
		this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to force enable binding
		sinon.stub(this.oSmartTable._oTable, "bindRows"); // do not actually create a binding with a fake model
		this.oSmartTable.rebindTable();

		assert.strictEqual(this.oSmartTable._oTable.getNoDataText(), "Custom no data text", "Custom no data text is not overwritten by SmartTable");
		this.oSmartTable._oTable.bindRows.restore();
	});

	QUnit.test("test get UiState function", function(assert) {
		this.oSmartTable._oPersController = sinon.createStubInstance(PersonalizationController);
		this.oSmartTable._aAlwaysSelect = [];

		assert.ok(this.oSmartTable._oPersController.getDataSuiteFormatSnapshot.notCalled);

		var oUIState = this.oSmartTable.getUiState();

		assert.ok(oUIState instanceof UIState);
		var oPresentationVariant = oUIState.getPresentationVariant();

		assert.ok(this.oSmartTable._oPersController.getDataSuiteFormatSnapshot.calledOnce);
		assert.deepEqual(oPresentationVariant.RequestAtLeast, []);

		// reset spy
		this.oSmartTable._oPersController.getDataSuiteFormatSnapshot.reset();

		this.oSmartTable.setRequestAtLeastFields("a,b,c");
		this.oSmartTable._aAlwaysSelect = [
			"d", "e", "f"
		];

		oUIState = this.oSmartTable.getUiState();
		oPresentationVariant = oUIState.getPresentationVariant();

		assert.ok(this.oSmartTable._oPersController.getDataSuiteFormatSnapshot.calledOnce);
		assert.deepEqual(oPresentationVariant.RequestAtLeast, [
			"a", "b", "c", "d", "e", "f"
		]);
	});

	QUnit.test("test set UiState function", function(assert) {
		this.oSmartTable._oPersController = sinon.createStubInstance(PersonalizationController);
		this.oSmartTable._aAlwaysSelect = [];

		assert.ok(this.oSmartTable._oPersController.setDataSuiteFormatSnapshot.notCalled);

		var oUIState = this.oSmartTable.getUiState();

		assert.ok(oUIState instanceof UIState);

		var oPresentationVariant = oUIState.getPresentationVariant();
		oPresentationVariant.RequestAtLeast = [
			"foo", "bar"
		];
		oUIState.setPresentationVariant(oPresentationVariant);

		this.oSmartTable.setUiState(oUIState);

		assert.ok(this.oSmartTable._oPersController.setDataSuiteFormatSnapshot.calledOnce);
		assert.deepEqual(this.oSmartTable._aAlwaysSelect, [
			"foo", "bar"
		]);

		// Simulate a Visualization of type "LineItem" being present
		this.oSmartTable._oPersController.setDataSuiteFormatSnapshot.reset();
		oPresentationVariant.Visualizations = [
			{
				Type: "LineItem",
				Content: [
					{
						Value: "foo"
					}
				]
			}
		];
		oUIState.setPresentationVariant(oPresentationVariant);

		this.oSmartTable.setUiState(oUIState);

		assert.ok(this.oSmartTable._oPersController.setDataSuiteFormatSnapshot.calledOnce);
		assert.deepEqual(this.oSmartTable._aAlwaysSelect, oPresentationVariant.RequestAtLeast);
	});

	QUnit.test("test set UiStateAsVariant function", function(assert) {
		this.oSmartTable._oPersController = sinon.createStubInstance(PersonalizationController);
		this.oSmartTable._aAlwaysSelect = [];

		assert.ok(this.oSmartTable._oPersController.setPersonalizationDataAsDataSuiteFormat.notCalled);

		var oUIState = this.oSmartTable.getUiState();

		assert.ok(oUIState instanceof UIState);

		var oPresentationVariant = oUIState.getPresentationVariant();
		oPresentationVariant.RequestAtLeast = [
			"foo", "bar"
		];
		oUIState.setPresentationVariant(oPresentationVariant);

		//Test variant context
		var oSpyFireAfterVariantApply = sinon.spy(this.oSmartTable, "fireAfterVariantApply");
		sinon.stub(this.oSmartTable, "getCurrentVariantId").callsFake(function() {
			return "testVariantId";
		});
		this.oSmartTable._oVariantManagement = {
			detachSave: function() {
			},
			detachAfterSave: function() {
			},
			isPageVariant: function() {
			}
		};

		this.oSmartTable.setUiStateAsVariant(oUIState, "STANDARD");

		assert.ok(oSpyFireAfterVariantApply.calledOnce, "Called fireAfterVariantApply correctly once");
		assert.ok(oSpyFireAfterVariantApply.calledWithMatch({currentVariantId: "testVariantId", variantContext: "STANDARD"}), "Called with correct correct variant ID and context");
		assert.ok(this.oSmartTable._oPersController.setPersonalizationDataAsDataSuiteFormat.calledOnce);
		assert.deepEqual(this.oSmartTable._aAlwaysSelect, [
			"foo", "bar"
		]);

		// Simulate a Visualization of type "LineItem" being present
		this.oSmartTable._oPersController.setPersonalizationDataAsDataSuiteFormat.reset();
		oPresentationVariant.Visualizations = [
			{
				Type: "LineItem",
				Content: [
					{
						Value: "foo"
					}
				]
			}
		];
		oUIState.setPresentationVariant(oPresentationVariant);

		this.oSmartTable.setUiStateAsVariant(oUIState, "STANDARD_2");

		assert.ok(oSpyFireAfterVariantApply.calledTwice, "Called fireAfterVariantApply correctly twice");
		assert.ok(oSpyFireAfterVariantApply.calledWithMatch({currentVariantId: "testVariantId", variantContext: "STANDARD_2"}), "Called with correct correct variant ID and context");
		assert.ok(this.oSmartTable._oPersController.setPersonalizationDataAsDataSuiteFormat.calledOnce);
		assert.deepEqual(this.oSmartTable._aAlwaysSelect, oPresentationVariant.RequestAtLeast);
	});

	QUnit.test("Log error for static property change", function(assert) {
		var sInitiallyVisibleFields, sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);

		sInitiallyVisibleFields = "foo,bar,col2";
		this.oSmartTable.setInitiallyVisibleFields(sInitiallyVisibleFields);
		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setUseTablePersonalisation(true);
		this.oSmartTable.setModel(oModel);

		assert.ok(this.oSmartTable.isInitialised(), "SmartTable is initialised");

		// reset error log count to get the correct error log count result
		Log.error.reset();

		var aStaticProperties = [
			"entitySet", "ignoredFields", "initiallyVisibleFields", "ignoreFromPersonalisation", "tableType",
			"useTablePersonalisation", "enableAutoBinding", "persistencyKey", "smartFilterId", "showDetailsButton",
			"enableAutoColumnWidth", "customizeConfig", "useColumnLabelsAsTooltips"
		];

		for (var i = 0; i < aStaticProperties.length; i++) {
			if (aStaticProperties[i] === "enableAutoBinding") {
				this.oSmartTable.setProperty(aStaticProperties[i], true);
				assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), true, "Property changed but error logged");
			} else if (aStaticProperties[i] === "useTablePersonalisation") {
				this.oSmartTable.setProperty(aStaticProperties[i], false);
				assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), false, "Property changed but error logged");
			} else if (aStaticProperties[i] === "tableType") {
				this.oSmartTable.setProperty(aStaticProperties[i], "ResponsiveTable");
				assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), "ResponsiveTable", "Property changed but error logged");
			} else if (aStaticProperties[i] === "showDetailsButton") {
				this.oSmartTable.setProperty(aStaticProperties[i], true);
				assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), true, "Property changed but error logged");
			} else if (aStaticProperties[i] === "enableAutoColumnWidth") {
				this.oSmartTable.setProperty(aStaticProperties[i], true);
				assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), true, "Property changed but error logged");
			} else if (aStaticProperties[i] === "customizeConfig") {
				this.oSmartTable.setProperty(aStaticProperties[i], {}, true);
				assert.deepEqual(this.oSmartTable.getProperty(aStaticProperties[i]), {}, "Property changed but error logged");
			} else if (aStaticProperties[i] === "useColumnLabelsAsTooltips") {
				this.oSmartTable.setProperty(aStaticProperties[i], false, true);
				assert.deepEqual(this.oSmartTable.getProperty(aStaticProperties[i]), false, "Property changed but error logged");
			} else {
				this.oSmartTable.setProperty(aStaticProperties[i], "Test");
				assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), "Test", "Property changed but error logged");
			}
		}

		assert.equal(Log.error.callCount, aStaticProperties.length, "Appropriate errors are logged");
		assert.deepEqual(this.oSmartTable._aStaticProperties, aStaticProperties);
	});

	QUnit.test("test deactivateColumns function", function(assert) {
		// Setup test data, stubs
		// Assume the following test data is present on the SmartTable
		this.oSmartTable._oCurrentVariant = {
			columns: {
				columnsItems: [
					{
						visible: true,
						columnKey: "a"
					}, {
						visible: false,
						columnKey: "d"
					}, {
						visible: true,
						columnKey: "e"
					}
				]
			},
			sort: {
				sortItems: [
					{
						columnKey: "a"
					}, {
						columnKey: "d",
						operation: "Descending"
					}, {
						columnKey: "e"
					}
				]
			},
			filter: {
				filterItems: [
					{
						columnKey: "a",
						operation: "BT",
						value1: 10,
						value2: 20
					}, {
						columnKey: "d",
						operation: "BT",
						value1: 10,
						value2: 20
					}, {
						columnKey: "e",
						operation: "BT",
						value1: 10,
						value2: 20
					}
				]
			},
			group: {
				groupItems: [
					{
						columnKey: "b"
					}
				]
			}
		};
		// Stubs
		this.oSmartTable._getPathFromColumnKeyAndProperty = function(sColumnKey) {
			return sColumnKey;
		};
		this.oSmartTable._getColumnByKey = function(sColumnKey) {
			return {
				getFilterProperty: function() {
					return sColumnKey;
				},
				data: function() {
					return {};
				},
				getHeader: function() {
					return {
						getText: function() {
							return "Header " + sColumnKey;
						}
					};
				}
			};
		};
		// P13n Stub
		this.oSmartTable._oPersController = sinon.createStubInstance(PersonalizationController);
		sinon.spy(this.oSmartTable, "deactivateColumns");
		this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to force enable binding
		this.oSmartTable._isMobileTable = true; // enable grouping handling based on sorting

		// Pre Test
		assert.ok(!this.oSmartTable._aExcludedColumnKeys);
		assert.ok(this.oSmartTable._oPersController.addToSettingIgnoreColumnKeys.notCalled);
		assert.ok(this.oSmartTable.deactivateColumns.notCalled);

		// Execute API
		this.oSmartTable.deactivateColumns([
			"a", "b", "c"
		]);

		// Post Test
		assert.deepEqual(this.oSmartTable._aDeactivatedColumns, [
			"a", "b", "c"
		]);
		assert.deepEqual(this.oSmartTable.getDeactivatedColumns(), [
			"a", "b", "c"
		]);
		assert.ok(this.oSmartTable.deactivateColumns.calledOnce);
		assert.ok(this.oSmartTable._oPersController.addToSettingIgnoreColumnKeys.calledOnce);

		// Part II
		// Test after effects as a result of manual/auto rebindTable call (e.g. due to afterP13nModelDataChange event)!
		// Setup test data, stubs
		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
		sinon.spy(this.oSmartTable, "_getTablePersonalisationData");

		// Pre test
		assert.ok(this.oSmartTable._getTablePersonalisationData.notCalled);

		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		// Execute rebindTable
		this.oSmartTable.rebindTable();

		// Post test
		assert.ok(this.oSmartTable._getTablePersonalisationData.calledOnce);
		var oResult = fBindStub.getCall(0).args[0];
		assert.equal(oResult.sorter.length, 2, "correct number of sorters");
		assert.equal(oResult.sorter[0].sPath, "d", "correct path on sorter 1");
		assert.equal(oResult.sorter[0].bDescending, true, "correct descending flag on sorter 1");
		assert.ok(!oResult.sorter[0].getGroupFunction(), "sorter is not meant for grouping");
		assert.equal(oResult.sorter[1].sPath, "e", "correct path on sorter 2");
		assert.equal(oResult.sorter[1].bDescending, false, "correct descending flag on sorter 2");
		assert.equal(oResult.filters.length, 2, "correct number of filters");
		assert.equal(oResult.filters[0].sPath, "d", "correct key on filter 1");
		assert.equal(oResult.filters[1].sPath, "e", "correct key on filter 2");

		// Part III
		// Test rebind without deactivated columns
		this.oSmartTable.deactivateColumns();
		this.oSmartTable._getTablePersonalisationData.reset();
		// Execute rebindTable
		this.oSmartTable.rebindTable();

		// Test
		assert.deepEqual(this.oSmartTable._aDeactivatedColumns, []);
		assert.ok(this.oSmartTable._getTablePersonalisationData.calledOnce);
		oResult = fBindStub.getCall(1).args[0];
		assert.equal(oResult.sorter.length, 4, "correct number of sorters");
		assert.equal(oResult.sorter[0].sPath, "b", "correct path on sorter 0");
		assert.ok(oResult.sorter[0].getGroupFunction(), "1st sorter is for grouping");
		assert.equal(oResult.sorter[0].bDescending, false, "correct descending flag on sorter 0");
		assert.equal(oResult.sorter[1].sPath, "a", "correct path on sorter 1");
		assert.equal(oResult.sorter[1].bDescending, false, "correct descending flag on sorter 1");
		assert.ok(!oResult.sorter[1].getGroupFunction(), "sorter is not meant for grouping");
		assert.equal(oResult.sorter[2].sPath, "d", "correct path on sorter 2");
		assert.equal(oResult.sorter[2].bDescending, true, "correct descending flag on sorter 2");
		assert.equal(oResult.sorter[3].sPath, "e", "correct path on sorter 3");
		assert.equal(oResult.sorter[3].bDescending, false, "correct descending flag on sorter 3");
		assert.equal(oResult.filters.length, 3, "correct number of filters");
		assert.equal(oResult.filters[0].sPath, "a", "correct key on filter 1");
		assert.equal(oResult.filters[1].sPath, "d", "correct key on filter 2");
		assert.equal(oResult.filters[2].sPath, "e", "correct key on filter 3");

		fBindStub.restore();
	});

	QUnit.test("test bActiveHeaders for ResponsiveTable & creation of the sap.m.ResponsivePopover", async function(assert) {
		// Destroy the current SmartTable instance and create the SmartTable inline
		this.oSmartTable.destroy();

		var oColumn1 = new Column({
			header: new Text({
				text: "Prop A"
			}),
			hAlign: "Begin"
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			sortProperty: "PropA",
			filterProperty: "PropA",
			type: undefined
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: false,
			enableExport: false
		});
		this.oSmartTable._bUseLegacyMenu = true;

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		assert.ok(!this.oSmartTable.getTable().bActiveHeaders, "TablePersonalisation is disabled, hence bActiveHeaders = false");
		this.oSmartTable.setUseTablePersonalisation(true);
		this.oSmartTable._createTable();
		await nextUIUpdate();
		assert.ok(this.oSmartTable.getTable().bActiveHeaders, "Responsive table has active headers");
		this.oSmartTable.getTable().fireEvent("columnPress", {
			column: oColumn1
		});

		assert.ok(this.oSmartTable._oColumnHeaderPopover, "ResponsivePopover created");

		var oRestorePersController = this.oSmartTable._oPersController;
		var bOpenFilterDialog = false;
		this.oSmartTable._oPersController = {
			openDialog: function() {
				bOpenFilterDialog = true;
			}
		};
		sinon.spy(this.oSmartTable, "_onCustomFilter");
		// filter button
		this.oSmartTable._oFilterButton.firePress();
		assert.ok(bOpenFilterDialog, "Filter dialog opened via _oColumnHeaderPopover");
		this.oSmartTable._oPersController = oRestorePersController;

		assert.ok(!this.oSmartTable._oColumnClicked.data("p13nData").sorted, "Column is unsorted");
		assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "None", "No sort indicator applied");
		sinon.spy(this.oSmartTable, "_onCustomSort");
		// sort button
		this.oSmartTable._aSortButton[0].fireAction();
		assert.ok(this.oSmartTable._oColumnClicked.data("p13nData").sorted.ascending, "Sort event of the ResponsiveTable fired and ascending=true");
		// variant for sort ascending
		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropA",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "Ascending", "Ascending sort indicator applied");

		this.oSmartTable._aSortButton[0].fireAction();
		assert.notOk(this.oSmartTable._oColumnClicked.data("p13nData").sorted, "Sort event of the ResponsiveTable fired and ascending=false");
		// variant for sort ascending
		this.oSmartTable._oCurrentVariant = {};
		this.oSmartTable._adaptCustomSort();
		assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "None", "Ascending sort indicator removed");

		this.oSmartTable._aSortButton[1].fireAction();
		assert.ok(!this.oSmartTable._oColumnClicked.data("p13nData").sorted.ascending, "Sort event of the ResponsiveTable fired and column is sorted descending");
		// variant for sort descending
		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropA",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "Descending", "Descending sort indicator applied");
		// variant for all the sorter are removed from the table personalisation sort dialog
		this.oSmartTable._oCurrentVariant = {};
		this.oSmartTable._adaptCustomSort();
		assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "None", "No sort indicator applied");
	});

	QUnit.test("test bActiveHeaders for ResponsiveTable & creation of the sap.m.table.columnmenu.Menu", async function(assert) {
		var oResourceBundle = Library.getResourceBundleFor("sap.ui.comp");

		async function openMenu(oColumnMenu, oOpener) {
			oColumnMenu.openBy(oOpener);

			await new Promise((fnResolve) => {
				oColumnMenu._oPopover.attachEventOnce("afterOpen", fnResolve);
			});
		}

		// Destroy the current SmartTable instance and create the SmartTable inline
		this.oSmartTable.destroy();

		var oColumn1 = new Column({
			header: new Text({
				text: "Prop A"
			})
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			sortProperty: "PropA",
			filterProperty: "PropA",
			description: "PropC"
		});
		var oColumn2 = new Column({
			header: new Text({
				text: "Prop B"
			})
		}).data("p13nData", {
			columnKey: "PropB",
			leadingProperty: "PropB",
			edmType: "Edm.String",
			filterProperty: "PropB"
		});
		var oColumn3 = new Column({
			header: new Text({
				text: "Prop C"
			})
		}).data("p13nData", {
			columnKey: "PropC",
			leadingProperty: "PropC",
			displayBehaviour: "descriptionOnly",
			description: "PropA",
			edmType: "Edm.String",
			filterProperty: "PropC",
			sortProperty: "PropC"
		});
		var oColumn4 = new Column({
			header: new Text({
				text: "Prop D"
			})
		}).data("p13nData", {
			columnKey: "PropD",
			leadingProperty: "PropD",
			unit: "PropA",
			displayBehaviour: "descriptionOnly",
			edmType: "Edm.String",
			filterProperty: "PropD",
			sortProperty: "PropD"
		});
		var oColumn5 = new Column({
			header: new Text({
				text: "Prop E"
			})
		}).data("p13nData", {
			columnKey: "PropE",
			leadingProperty: "PropE",
			description: "PropB",
			edmType: "Edm.String",
			sortProperty: "PropE",
			filterProperty: "PropE"
		});
		var oColumn6 = new Column({
			header: new Text({
				text: "Prop F"
			})
		}).data("p13nData", {
			columnKey: "PropF",
			leadingProperty: "PropF",
			edmType: "Edm.String",
			sortProperty: "PropF",
			filterProperty: "PropF"
		});
		oColumn6.setAssociation("headerMenu", "customMenu");
		var oColumn7 = new Column({
			header: new Text({
				text: "Prop G"
			})
		}).data("p13nData", {
			columnKey: "PropG",
			additionalProperty: "PropF",
			leadingProperty: "PropG",
			displayBehaviour: "descriptionAndId",
			description: "PropF",
			edmType: "Edm.String",
			sortProperty: "PropG",
			filterProperty: "PropG"
		});
		var oColumn8 = new Column({
			header: new Text({
				text: "Prop H"
			})
		}).data("p13nData", {
			columnKey: "PropH",
			leadingProperty: "PropH",
			edmType: "Edm.String",
			sortProperty: "PropH",
			filterProperty: "PropH",
			additionalProperty: "PropF,PropG",
			additionalSortProperty: "PropF,PropG"
		});
		var oColumn9 = new Column({
			header: new Text({
				text: "Prop I"
			})
		}).data("p13nData", {
			columnKey: "PropI",
			leadingProperty: "PropI",
			description: "PropI",
			displayBehaviour: "descriptionOnly",
			edmType: "Edm.String",
			sortProperty: "PropI",
			filterProperty: "PropI"
		});

		var oTable = new Table({
			columns: [
				oColumn1,
				oColumn2,
				oColumn3,
				oColumn4,
				oColumn5,
				oColumn6,
				oColumn7,
				oColumn8,
				oColumn9
			]
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false,
			items: [oTable]
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();

		var oPrepareP13nSpy, aQuickActions, oColumnMenu, aItems, oQuickActionContainer;

		await nextUIUpdate();

		assert.equal(oColumn1.getAssociation("headerMenu"), this.oSmartTable.getId() + "-columnHeaderMenu", "ColumnMenu association has been added");
		assert.equal(oColumn6.getAssociation("headerMenu"), "customMenu", "customMenu association has not been overwritten");

		assert.ok(this.oSmartTable.getTable().bActiveHeaders, "Responsive table has active headers");

		oColumnMenu = this.oSmartTable._oColumnHeaderPopover;
		assert.ok(oColumnMenu, "ColumnMenu created");
		assert.ok(oColumnMenu.isA("sap.m.table.columnmenu.Menu"), "Popover is of type ColumnMenu");

		aQuickActions = oColumnMenu.getAggregation("_quickActions");
		assert.ok(aQuickActions.length === 1 && aQuickActions[0].isA("sap.m.table.columnmenu.QuickActionContainer"), "ColumnMenu has a QuickActionContainer");

		aItems = oColumnMenu.getAggregation("_items");
		assert.ok(aItems.length === 1 && aItems[0].isA("sap.m.table.columnmenu.ItemContainer"), "ColumnMenu has an ItemContainer");

		this.oSmartTable._oPersController.preparePersonalization = function() {
		};
		oPrepareP13nSpy = sinon.spy(this.oSmartTable._oPersController, "preparePersonalization");
		// Check ColumnMenu for Column "Prop A"

		await openMenu(oColumnMenu, oColumn1);

		assert.ok(oPrepareP13nSpy.calledOnce, "preparePersonalization is called once");
		oPrepareP13nSpy.resetHistory();

		oQuickActionContainer = aQuickActions[0];
		assert.ok(oQuickActionContainer.getQuickActions().length === 2 && oQuickActionContainer.getQuickActions()[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickActionContainer has a QuickSort");
		assert.ok(oQuickActionContainer.getQuickActions().length === 2 && oQuickActionContainer.getQuickActions()[1].isA("sap.m.table.columnmenu.QuickGroup"), "QuickActionContainer has a QuickGroup");

		var aItemContainer = aItems[0];
		aItems = aItemContainer.getItems();
		assert.equal(aItems.length, 4, "ItemContainer has four items");
		assert.equal(aItems[0].getLabel(), oResourceBundle.getText("SMARTTABLE_RP_SORT"), "First item is sort");
		assert.equal(aItems[1].getLabel(), oResourceBundle.getText("SMARTTABLE_RP_FILTER"), "Second item is filter");
		assert.equal(aItems[2].getLabel(), oResourceBundle.getText("SMARTTABLE_RP_GROUP"), "Third item is group");
		assert.equal(aItems[3].getLabel(), oResourceBundle.getText("SMARTTABLE_RP_COLUMNS"), "Fourth item is columns");

		var oRestorePersController = this.oSmartTable._oPersController;
		var mP13nSettings;
		this.oSmartTable._oPersController = {
			openDialog: function(mSettings) {
				mP13nSettings = mSettings;
			}
		};

		// filter button
		aItems[1].firePress();

		assert.ok(mP13nSettings.filter.visible, "Filter dialog opened via _oColumnHeaderPopover");
		this.oSmartTable._oPersController = oRestorePersController;

		// general sort item
		this.oSmartTable._oPersController = {
			openDialog: function(mSettings) {
				mP13nSettings = mSettings;
			}
		};
		aItems[0].firePress();

		assert.ok(mP13nSettings.sort.visible, "Sort dialog was opened");
		this.oSmartTable._oPersController = oRestorePersController;

		// general group item
		this.oSmartTable._oPersController = {
			openDialog: function(mSettings) {
				mP13nSettings = mSettings;
			}
		};
		aItems[2].firePress();

		assert.ok(mP13nSettings.group.visible, "Group dialog was opened");
		this.oSmartTable._oPersController = oRestorePersController;

		// general columns item
		this.oSmartTable._oPersController = {
			openDialog: function(mSettings) {
				mP13nSettings = mSettings;
			}
		};
		aItems[3].firePress();

		assert.ok(mP13nSettings.columns.visible, "Columns dialog was opened");
		this.oSmartTable._oPersController = oRestorePersController;

		assert.ok(!this.oSmartTable._oColumnClicked.data("p13nData").sorted, "Column is unsorted");
		sinon.spy(this.oSmartTable, "_onCustomSort");

		// sort button
		var oQuickSort = oQuickActionContainer.getQuickActions()[0];
		let oItem = oQuickSort.getItems()[0];
		oItem.setSortOrder("Ascending");
		oQuickSort.fireChange({item: oItem});
		assert.ok(this.oSmartTable._oColumnClicked.data("p13nData").sorted.ascending, "The column is sorted in ascending order");
		// variant for sort ascending
		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropA",
						operation: "Ascending"
					}
				]
			}
		};

		oItem.setSortOrder("None");
		oQuickSort.fireChange({item: oItem});
		assert.notOk(this.oSmartTable._oColumnClicked.data("p13nData").sorted, "The column is not sorted");

		// variant for all the sorter are removed from the table personalisation sort dialog
		this.oSmartTable._oCurrentVariant = {};

		oItem.setSortOrder("Descending");
		oQuickSort.fireChange({item: oItem});
		assert.notOk(this.oSmartTable._oColumnClicked.data("p13nData").sorted.ascending, "The column is sorted in descending order");

		// variant for sort descending
		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropB",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "None", "Clicked column's sort status not changed");
		assert.equal(oColumn2.getSortIndicator(), "None", "Second column's sort status did not change because no sortProperty is assigned");

		await openMenu(oColumnMenu, oColumn2);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		assert.equal(oColumnMenu.getAggregation("_quickActions")[0].getQuickActions()[0].getItems().length, 0,
			"QuickSort contains no items because the sortProperty is not set");

		await openMenu(oColumnMenu, oColumn3);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 2, "ColumnMenu has two actions");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 1, "Quick Sort has only one item");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropA", "Quick Sort only shows sort option for description property PropA");

		await openMenu(oColumnMenu, oColumn4);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 2, "ColumnMenu has two actions");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 2, "Quick Sort has two items despite descriptionOnly");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropD", "First item is PropD");
		assert.equal(aQuickActions[0].getItems()[1].getKey(), "PropA", "Second item is PropA");

		await openMenu(oColumnMenu, oColumn5);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 2, "ColumnMenu has two actions");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 1, "Quick Sort has only one item although description is given");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropE", "First item is PropE");

		await openMenu(oColumnMenu, oColumn7);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 2, "ColumnMenu has two actions");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 2, "Quick Sort has two items due to a reference via additionalProperty");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropG", "First item is PropG");
		assert.equal(aQuickActions[0].getItems()[1].getKey(), "PropF", "Second item is PropF");

		await openMenu(oColumnMenu, oColumn8);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 2, "ColumnMenu has two actions");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 3, "Quick Sort has 3 items due to additionalSortProperty");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropH", "First item is PropH");
		assert.equal(aQuickActions[0].getItems()[1].getKey(), "PropF", "Second item is PropF");
		assert.equal(aQuickActions[0].getItems()[2].getKey(), "PropG", "Third item is PropG");

		await openMenu(oColumnMenu, oColumn1);

		// QuickGrouping
		// Comparison grouped column vs. non-grouped column
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		oItem = aQuickActions[1].getItems()[0];

		oItem.setGrouped(true);
		aQuickActions[1].fireChange({item: oItem});

		assert.equal(aQuickActions[1].getItems().length, 2, "Columns has two QuickGroup options");
		assert.ok(this.oSmartTable._oColumnClicked.data("p13nData").grouped, "The column is grouped");

		assert.ok(this.oSmartTable._oColumnClicked.data("p13nData").grouped, "Clicked column's group status not changed");
		assert.equal(oColumn2.data("p13nData").grouped, undefined, "Second column's group status did not change");

		await openMenu(oColumnMenu, oColumn9);

		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();

		assert.equal(aQuickActions[1].getItems().length, 1, "Column has one QuickGroup option");
		assert.notOk(this.oSmartTable._oColumnClicked.data("p13nData").grouped, "Column isn't grouped");

		this.oSmartTable._oCurrentVariant = {
			group: {
				groupItems: [
					{
						columnKey: "PropI",
						showIfGrouped: false
					}
				]
			}
		};

		this.oSmartTable._adaptCustomGroup();

		assert.ok(this.oSmartTable._oColumnClicked.data("p13nData").grouped, "Column is grouped");

		await openMenu(oColumnMenu, oColumn1);

		// QuickGrouping
		// Grouping by second QuickGroup property
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		oItem = aQuickActions[1].getItems()[1];

		oItem.setGrouped(true);
		aQuickActions[1].fireChange({item: oItem});

		assert.equal(aQuickActions[1].getItems().length, 2, "Columns has two QuickGroup options");
		assert.notOk(this.oSmartTable._oColumnClicked.data("p13nData").grouped, "The column is grouped");
		assert.ok(oColumn3.data("p13nData").grouped, "Second column's group status changed because of the sorting by the second attribute");

		oPrepareP13nSpy.restore();
	});

	QUnit.test("Sorting on analytical column", async function(assert) {
		this.oSmartTable.destroy();

		var oColumn1 = new AnalyticalColumn({
			header: new Text({
				text: "Prop A"
			}),
			label: new Label({text: "Prop A"})
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			sortProperty: "PropA",
			filterProperty: "PropA",
			description: "PropC"
		});
		var oColumn2 = new AnalyticalColumn({
			header: new Text({
				text: "Prop B"
			}),
			label: new Label({text: "Prop B"})
		}).data("p13nData", {
			columnKey: "PropB",
			leadingProperty: "PropB",
			edmType: "Edm.String",
			filterProperty: "PropB"
		});
		var oColumn3 = new AnalyticalColumn({
			header: new Text({
				text: "Prop C"
			}),
			label: new Label({text: "Prop C"})
		}).data("p13nData", {
			columnKey: "PropC",
			leadingProperty: "PropC",
			displayBehaviour: "descriptionOnly",
			description: "PropA",
			edmType: "Edm.String",
			filterProperty: "PropC",
			sortProperty: "PropC"
		});
		var oColumn4 = new AnalyticalColumn({
			header: new Text({
				text: "Prop D"
			}),
			label: new Label({text: "Prop D"})
		}).data("p13nData", {
			columnKey: "PropD",
			leadingProperty: "PropD",
			unit: "PropE",
			displayBehaviour: "descriptionOnly",
			edmType: "Edm.String",
			filterProperty: "PropD",
			sortProperty: "PropD"
		});
		var oColumn5 = new AnalyticalColumn({
			header: new Text({
				text: "Prop E"
			}),
			label: new Label({text: "Prop E"})
		}).data("p13nData", {
			columnKey: "PropE",
			leadingProperty: "PropE",
			description: "PropB",
			edmType: "Edm.String",
			sortProperty: "PropE",
			filterProperty: "PropE"
		});


		var oTable = new AnalyticalTable({
			columns: [
				oColumn1,
				oColumn2,
				oColumn3,
				oColumn4,
				oColumn5
			]
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "AnalyticalTable",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false,
			items: [oTable]
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();
		await nextUIUpdate();

		var oColumnMenu = this.oSmartTable._oColumnHeaderPopover;
		assert.ok(oColumnMenu, "ColumnMenu created");
		assert.ok(oColumnMenu.isA("sap.m.table.columnmenu.Menu"), "Popover is of type ColumnMenu");

		var aQuickActions = oColumnMenu.getAggregation("_quickActions");
		assert.ok(aQuickActions.length === 1 && aQuickActions[0].isA("sap.m.table.columnmenu.QuickActionContainer"), "ColumnMenu has a QuickActionContainer");

		oColumnMenu.openBy(oColumn1);

		var oQuickActionContainer = aQuickActions[0];
		assert.ok(oQuickActionContainer.getQuickActions()[0].getItems().length === 2, "Both leading property and description is set on the quick sort menu when additional property is visible");

		oColumn3.setVisible(false);
		await nextUIUpdate();
		oColumnMenu.openBy(oColumn1);
		assert.ok(oQuickActionContainer.getQuickActions()[0].getItems().length === 2, "Both leading property and description is set on the quick sort menu when additional property is not visible");

		oColumnMenu.openBy(oColumn4);
		assert.ok(oQuickActionContainer.getQuickActions()[0].getItems().length === 2, "Both leading property and unit is set on the quick sort menu");

		oColumnMenu.openBy(oColumn3);
		assert.ok(oQuickActionContainer.getQuickActions()[0].getItems().length === 1, "Leading property is set on the quick sort menu");
	});

	QUnit.test("ResponsiveTable Sort indicators on column header", async function(assert) {
		// Destroy the current SmartTable instance and create the SmartTable inline
		this.oSmartTable.destroy();

		var oColumn1 = new Column({
			header: new Text({
				text: "Prop A"
			})
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			sortProperty: "PropA"
		});
		var oColumn2 = new Column({
			header: new Text({
				text: "Prop B"
			})
		}).data("p13nData", {
			columnKey: "PropB",
			leadingProperty: "PropB",
			edmType: "Edm.String",
			sortProperty: "PropB"
		});
		var oColumn3 = new Column({
			header: new Text({
				text: "Prop C"
			})
		}).data("p13nData", {
			columnKey: "PropC",
			leadingProperty: "PropB",
			edmType: "Edm.String",
			sortProperty: "PropB"
		});
		var oColumn4 = new Column({
			header: new Text({
				text: "Prop D"
			})
		}).data("p13nData", {
			columnKey: "PropD",
			leadingProperty: "PropD",
			edmType: "Edm.String",
			sortProperty: "PropD"
		});
		var oColumn5 = new Column({
			header: new Text({
				text: "Prop E"
			})
		}).data("p13nData", {
			columnKey: "PropE",
			leadingProperty: "PropE",
			unit: "PropD",
			edmType: "Edm.String",
			sortProperty: "PropE"
		});
		var oColumn6 = new Column({
			header: new Text({
				text: "Prop F"
			})
		}).data("p13nData", {
			columnKey: "PropF",
			leadingProperty: "PropF",
			edmType: "Edm.String",
			sortProperty: "PropF"
		});
		var oColumn7 = new Column({
			header: new Text({
				text: "Prop G"
			})
		}).data("p13nData", {
			columnKey: "PropG",
			leadingProperty: "PropG",
			edmType: "Edm.String",
			sortProperty: "PropG",
			description: "PropF",
			displayBehaviour: "descriptionAndId"
		});
		var oColumn8 = new Column({
			header: new Text({
				text: "Prop H"
			})
		}).data("p13nData", {
			columnKey: "PropH",
			leadingProperty: "PropH",
			edmType: "Edm.String",
			sortProperty: "PropH",
			additionalProperty: "PropJ,PropK",
			additionalSortProperty: "PropJ,PropK"
		});
		var oColumn9 = new Column({
			header: new Text({
				text: "Prop J"
			})
		}).data("p13nData", {
			columnKey: "PropJ",
			leadingProperty: "PropJ",
			edmType: "Edm.String",
			sortProperty: "PropJ"
		});
		var oColumn10 = new Column({
			header: new Text({
				text: "Prop K"
			})
		}).data("p13nData", {
			columnKey: "PropK",
			leadingProperty: "PropK",
			edmType: "Edm.String",
			sortProperty: "PropK"
		});

		var oTable = new Table({
			columns: [
				oColumn1,
				oColumn2,
				oColumn3,
				oColumn4,
				oColumn5,
				oColumn6,
				oColumn7,
				oColumn8,
				oColumn9,
				oColumn10
			]
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false,
			items: [oTable]
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();
		await nextUIUpdate();

		this.oSmartTable._getColumnFromP13nMap = this.oSmartTable._getColumnByKey;

		function assertSortIndicators(aColumns, aIndicators) {
			for (var i = 0; i < aColumns.length; i++) {
				assert.equal(aColumns[i].getSortIndicator(), aIndicators[i]);
			}
		}

		assertSortIndicators(this.oSmartTable._oTable.getColumns(), ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"]);
		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropA",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		var aColumns = this.oSmartTable._oTable.getColumns();
		assertSortIndicators(aColumns, ["Descending", "None", "None", "None", "None", "None", "None", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropB",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "Ascending", "Ascending", "None", "None", "None", "None", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropC",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "Descending", "Descending", "None", "None", "None", "None", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropD",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "Descending", "Descending", "None", "None", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropF",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "None", "None", "Ascending", "Ascending", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropJ",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "None", "None", "None", "None", "Ascending", "Ascending", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropK",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "None", "None", "None", "None", "Descending", "None", "Descending"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropH",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "None", "None", "None", "None", "Ascending", "None", "None"]);
	});

	QUnit.test("GridTable Sort indicators on column header", async function(assert) {
		this.oSmartTable.destroy();

		var oColumn1 = new UIColumn({
			label: new Label({text: "Prop A"})
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			sortProperty: "PropA"
		});
		var oColumn2 = new UIColumn({
			label: new Label({text: "Prop B"})
		}).data("p13nData", {
			columnKey: "PropB",
			leadingProperty: "PropB",
			edmType: "Edm.String",
			sortProperty: "PropB"
		});
		var oColumn3 = new UIColumn({
			label: new Label({text: "Prop C"})
		}).data("p13nData", {
			columnKey: "PropC",
			leadingProperty: "PropB",
			edmType: "Edm.String",
			sortProperty: "PropB"
		});
		var oColumn4 = new UIColumn({
			label: new Label({text: "Prop D"})
		}).data("p13nData", {
			columnKey: "PropD",
			leadingProperty: "PropD",
			edmType: "Edm.String",
			sortProperty: "PropD"
		});
		var oColumn5 = new UIColumn({
			label: new Label({text: "Prop E"})
		}).data("p13nData", {
			columnKey: "PropE",
			leadingProperty: "PropE",
			unit: "PropD",
			edmType: "Edm.String",
			sortProperty: "PropE"
		});
		var oColumn6 = new UIColumn({
			label: new Label({text: "Prop F"})
		}).data("p13nData", {
			columnKey: "PropF",
			leadingProperty: "PropF",
			edmType: "Edm.String",
			sortProperty: "PropF"
		});
		var oColumn7 = new UIColumn({
			label: new Label({text: "Prop G"})
		}).data("p13nData", {
			columnKey: "PropG",
			leadingProperty: "PropG",
			edmType: "Edm.String",
			sortProperty: "PropG",
			description: "PropF",
			displayBehaviour: "descriptionAndId"
		});
		var oColumn8 = new UIColumn({
			label: new Label({text: "Prop H"})
		}).data("p13nData", {
			columnKey: "PropH",
			leadingProperty: "PropH",
			edmType: "Edm.String",
			sortProperty: "PropH",
			additionalProperty: "PropJ,PropK",
			additionalSortProperty: "PropJ,PropK"
		});
		var oColumn9 = new UIColumn({
			label: new Label({text: "Prop J"})
		}).data("p13nData", {
			columnKey: "PropJ",
			leadingProperty: "PropJ",
			edmType: "Edm.String",
			sortProperty: "PropJ"
		});
		var oColumn10 = new UIColumn({
			label: new Label({text: "Prop K"})
		}).data("p13nData", {
			columnKey: "PropK",
			leadingProperty: "PropK",
			edmType: "Edm.String",
			sortProperty: "PropK"
		});

		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "Table",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false
		});
		var oModel = getModelStubInstance(ODataModel);
		var oInnerTable = this.oSmartTable.getTable();
		this.oSmartTable.setModel(oModel);
		[oColumn1, oColumn2, oColumn3, oColumn4, oColumn5, oColumn6, oColumn7, oColumn8, oColumn9, oColumn10].forEach(function(oColumn) {
			oInnerTable.addColumn(oColumn);
		});
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();
		await nextUIUpdate();

		this.oSmartTable._getColumnFromP13nMap = this.oSmartTable._getColumnByKey;

		function assertSortIndicators(aColumns, aIndicators) {
			for (var i = 0; i < aColumns.length; i++) {
				var bSorted = aColumns[i].getSortOrder() !== "None";

				/** @deprecated As of version 1.120 */
				if (!aColumns[i].getSorted()) {
					bSorted = false;
				}

				assert.equal(bSorted, aIndicators[i] !== "None");
				if (bSorted) {
					assert.equal(aColumns[i].getSortOrder(), aIndicators[i]);
				}
			}
		}

		assertSortIndicators(this.oSmartTable._oTable.getColumns(), ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None"]);
		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropA",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		var aColumns = this.oSmartTable._oTable.getColumns();
		assertSortIndicators(aColumns, ["Descending", "None", "None", "None", "None", "None", "None", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropB",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "Ascending", "Ascending", "None", "None", "None", "None", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropC",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "Descending", "Descending", "None", "None", "None", "None", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropD",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "Descending", "Descending", "None", "None", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropF",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "None", "None", "Ascending", "Ascending", "None", "None", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropJ",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "None", "None", "None", "None", "Ascending", "Ascending", "None"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropK",
						operation: "Descending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "None", "None", "None", "None", "Descending", "None", "Descending"]);

		this.oSmartTable._oCurrentVariant = {
			sort: {
				sortItems: [
					{
						columnKey: "PropH",
						operation: "Ascending"
					}
				]
			}
		};
		this.oSmartTable._adaptCustomSort();
		assertSortIndicators(aColumns, ["None", "None", "None", "None", "None", "None", "None", "Ascending", "None", "None"]);
	});

	QUnit.test("GridTable & creation of the sap.m.table.columnmenu.Menu", async function(assert) {
		var oResourceBundle = Library.getResourceBundleFor("sap.ui.comp");

		async function openMenu(oColumnMenu, oOpener) {
			oColumnMenu.close();
			await timeout(100);

			if (oOpener) {
				oColumnMenu.openBy(oOpener);
			}
		}

		// Destroy the current SmartTable instance and create the SmartTable inline
		this.oSmartTable.destroy();

		var oColumn1 = new UIColumn({
			label: new Label({text: "Prop A"}),
			sortProperty: "PropA",
			filterProperty: "PropA"
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			description: "PropC"
		});
		var oColumn2 = new UIColumn({
			label: new Label({text: "Prop B"}),
			filterProperty: "PropB"
		}).data("p13nData", {
			columnKey: "PropB",
			leadingProperty: "PropB",
			edmType: "Edm.String"
		});
		var oColumn3 = new UIColumn({
			label: new Label({text: "Prop C"}),
			sortProperty: "PropC",
			filterProperty: "PropC"
		}).data("p13nData", {
			columnKey: "PropC",
			leadingProperty: "PropC",
			displayBehaviour: "descriptionOnly",
			description: "PropA",
			edmType: "Edm.String"
		});
		var oColumn4 = new UIColumn({
			label: new Label({text: "Prop D"}),
			sortProperty: "PropD",
			filterProperty: "PropD"
		}).data("p13nData", {
			columnKey: "PropD",
			leadingProperty: "PropD",
			unit: "PropA",
			displayBehaviour: "descriptionOnly",
			edmType: "Edm.String"
		});
		var oColumn5 = new UIColumn({
			label: new Label({text: "Prop E"}),
			sortProperty: "PropE",
			filterProperty: "PropE"
		}).data("p13nData", {
			columnKey: "PropE",
			leadingProperty: "PropE",
			description: "PropB",
			edmType: "Edm.String"
		});
		var oColumn6 = new UIColumn({
			label: new Label({text: "Prop F"}),
			showSortMenuEntry: false,
			showFilterMenuEntry: false,
			sortProperty: "PropF",
			filterProperty: "PropF"
		}).data("p13nData", {
			columnKey: "PropF",
			leadingProperty: "PropF",
			edmType: "Edm.String"
		});
		var oColumn7 = new UIColumn({
			label: new Label({text: "Prop G"}),
			sortProperty: "PropG",
			filterProperty: "PropG"
		}).data("p13nData", {
			columnKey: "PropG",
			leadingProperty: "PropG",
			edmType: "Edm.String"
		});
		oColumn7.setAssociation("headerMenu", "customMenu");
		var oColumn8 = new UIColumn({
			label: new Label({text: "Prop H"}),
			sortProperty: "PropH",
			filterProperty: "PropH"
		}).data("p13nData", {
			columnKey: "PropH",
			leadingProperty: "PropH",
			edmType: "Edm.String",
			additionalProperty: "PropF,PropG",
			additionalSortProperty: "PropF,PropG",
			unit: "PropB"
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "Table",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false
		});

		var oModel = getModelStubInstance(ODataModel);
		var oInnerTable = this.oSmartTable.getTable();
		this.oSmartTable.setModel(oModel);
		[oColumn1, oColumn2, oColumn3, oColumn4, oColumn5, oColumn6, oColumn7, oColumn8].forEach(function(oColumn) {
			oInnerTable.addColumn(oColumn);
		});
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable.setUseTablePersonalisation(true);
		this.oSmartTable._createTable();

		var oPrepareP13nSpy, oColumnMenu, aQuickActions, aItems, fnGetColumnFromP13nMapStub, oQuickActionContainer, aItemContainer;

		await nextUIUpdate();

		assert.equal(oColumn1.getAssociation("headerMenu"), this.oSmartTable.getId() + "-columnHeaderMenu", "ColumnMenu association has been added");
		assert.equal(oColumn7.getAssociation("headerMenu"), "customMenu", "customMenu association has not been overwritten");

		oColumnMenu = this.oSmartTable._oColumnHeaderPopover;
		assert.ok(oColumnMenu, "ColumnMenu created");
		assert.ok(oColumnMenu.isA("sap.m.table.columnmenu.Menu"), "Popover is of type ColumnMenu");

		aQuickActions = oColumnMenu.getAggregation("_quickActions");
		assert.ok(aQuickActions.length === 1 && aQuickActions[0].isA("sap.m.table.columnmenu.QuickActionContainer"), "ColumnMenu has a QuickActionContainer");
		assert.equal(FESRHelper.getSemanticStepname(this.oSmartTable._oColumnHeaderPopover, "beforeOpen"), "sc:tbl:p13n:col", "Correct FESR StepName");

		aItems = oColumnMenu.getAggregation("_items");
		assert.ok(aItems.length === 1 && aItems[0].isA("sap.m.table.columnmenu.ItemContainer"), "ColumnMenu has an ItemContainer");

		this.oSmartTable._getColumnFromP13nMap = this.oSmartTable._getColumnByKey;
		this.oSmartTable._oPersController = {
			preparePersonalization: function() {
			},
			getColumnMap: function () {
				return {
					"PropA": oColumn1,
					"PropB": oColumn2,
					"PropC": oColumn3,
					"PropD": oColumn4,
					"PropE": oColumn5,
					"PropF": oColumn6,
					"PropG": oColumn7,
					"PropH": oColumn8
				};
			}
		};
		oPrepareP13nSpy = sinon.spy(this.oSmartTable._oPersController, "preparePersonalization");

		// Check ColumnMenu for Column "Prop A"
		await openMenu(oColumnMenu, oColumn1);

		assert.ok(oPrepareP13nSpy.calledOnce, "preparePersonalization is called once");
		oPrepareP13nSpy.resetHistory();

		oQuickActionContainer = aQuickActions[0];
		assert.ok(oQuickActionContainer.getQuickActions().length === 1 && oQuickActionContainer.getQuickActions()[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickActionContainer has a QuickSort");

		aItemContainer = aItems[0];
		aItems = aItemContainer.getItems();
		assert.equal(aItems.length, 3, "ItemContainer has three items");
		assert.equal(aItems[0].getLabel(), oResourceBundle.getText("SMARTTABLE_RP_SORT"), "First item is sort");
		assert.equal(aItems[1].getLabel(), oResourceBundle.getText("SMARTTABLE_RP_FILTER"), "Second item is filter");
		assert.equal(aItems[2].getLabel(), oResourceBundle.getText("SMARTTABLE_RP_COLUMNS"), "Third item is columns");

		var oRestorePersController = this.oSmartTable._oPersController;
		var mP13nSettings;
		this.oSmartTable._getColumnFromP13nMap = this.oSmartTable._getColumnByKey;
		this.oSmartTable._oPersController = {
			openDialog: function(mSettings) {
				mP13nSettings = mSettings;
			}
		};

		// filter button
		aItems[1].firePress();
		assert.ok(mP13nSettings.filter.visible, "Filter dialog opened via _oColumnHeaderPopover");
		this.oSmartTable._oPersController = oRestorePersController;

		// general sort item
		this.oSmartTable._oPersController = {
			openDialog: function(mSettings) {
				mP13nSettings = mSettings;
			}
		};
		aItems[0].firePress();
		assert.ok(mP13nSettings.sort.visible, "Sort dialog was opened");
		this.oSmartTable._oPersController = oRestorePersController;

		// general columns item
		this.oSmartTable._oPersController = {
			openDialog: function(mSettings) {
				mP13nSettings = mSettings;
			}
		};
		aItems[2].firePress();
		assert.ok(mP13nSettings.columns.visible, "Columns dialog was opened");
		this.oSmartTable._oPersController = oRestorePersController;

		// sort button
		var oQuickSort = oQuickActionContainer.getQuickActions()[0];
		var oItem = oQuickSort.getItems()[0];
		oItem.setSortOrder("Ascending");
		oQuickSort.fireChange({item: oItem});

		assert.ok(this.oSmartTable._oColumnClicked.data("p13nData").sorted.ascending, "The column is sorted in ascending order");

		oItem.setSortOrder("None");
		oQuickSort.fireChange({item: oItem});
		assert.notOk(this.oSmartTable._oColumnClicked.data("p13nData").sorted, "The column is not sorted");

		oItem.setSortOrder("Descending");
		oQuickSort.fireChange({item: oItem});
		assert.notOk(this.oSmartTable._oColumnClicked.data("p13nData").sorted.ascending, "The column is sorted in descending order");

		await openMenu(oColumnMenu, oColumn2);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		assert.equal(oColumnMenu.getAggregation("_quickActions")[0].getQuickActions()[0].getItems().length, 0,
			"QuickSort contains no items because the sortProperty is not set");

		await openMenu(oColumnMenu, oColumn3);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 1, "ColumnMenu has an action");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 1, "Quick Sort has only one item");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropA", "Quick Sort only shows sort option for description property PropA");

		await openMenu(oColumnMenu, oColumn4);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 1, "ColumnMenu has an action");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 2, "Quick Sort has two items despite descriptionOnly");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropD", "First item is PropD");
		assert.equal(aQuickActions[0].getItems()[1].getKey(), "PropA", "Second item is PropA");

		await openMenu(oColumnMenu, oColumn5);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 1, "ColumnMenu has an action");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 1, "Quick Sort has only one item although description is given");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropE", "First item is PropE");

		await openMenu(oColumnMenu, oColumn6);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 0, "ColumnMenu does not have quick actions (showSortMenuEntry is false)");
		aItemContainer = oColumnMenu.getAggregation("_items")[0];
		var aFilterItems = aItemContainer.getItems().filter(function(oItem) {
			return oItem.getIcon() === "sap-icon://filter" || oItem.getIcon() === "sap-icon://sort";
		});
		assert.equal(aFilterItems.length, 0, "ColumnMenu does not have a sort and filter item (showSortMenuEntry is false and showFilterMenuEntry is false)");

		await openMenu(oColumnMenu, oColumn8);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 1, "ColumnMenu has an action");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems().length, 3, "Quick Sort has 4 items due to additionalSortProperty and unit");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropH", "First item is PropH");
		assert.equal(aQuickActions[0].getItems()[1].getKey(), "PropF", "Third item is PropF");
		assert.equal(aQuickActions[0].getItems()[2].getKey(), "PropG", "Fourth item is PropG");

		fnGetColumnFromP13nMapStub = sinon.stub(this.oSmartTable, "_getColumnFromP13nMap");
		fnGetColumnFromP13nMapStub.withArgs("PropH").returns(oColumn8);
		fnGetColumnFromP13nMapStub.withArgs("PropF").returns(oColumn6);
		// Simulate PropG and PropB as hidden columns, as hidden columns are not retrievable in the column P13n map
		fnGetColumnFromP13nMapStub.withArgs("PropG").returns(undefined);
		fnGetColumnFromP13nMapStub.withArgs("PropB").returns(undefined);

		await openMenu(oColumnMenu, oColumn8);

		assert.ok(oPrepareP13nSpy.notCalled, "preparePersonalization is not called");
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		aQuickActions = oQuickActionContainer.getQuickActions();
		assert.equal(aQuickActions.length, 1, "ColumnMenu has an action");
		assert.equal(aQuickActions[0].getItems().length, 2, "Quick Sort has only 2 items due to additionalSortProperty but hidden field PropG and PropB");
		assert.ok(aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort"), "QuickSort is in the ColumnMenu");
		assert.equal(aQuickActions[0].getItems()[0].getKey(), "PropH", "First item is PropH");
		assert.equal(aQuickActions[0].getItems()[1].getKey(), "PropF", "First item is PropF");

		await openMenu(oColumnMenu);

		fnGetColumnFromP13nMapStub.restore();
		oPrepareP13nSpy.restore();
	});

	QUnit.test("ColumnMenu is not created when useTablePersonalisation is false", async function(assert) {
		this.oSmartTable.destroy();

		var oColumn1 = new UIColumn({
			label: new Label({text: "Prop A"})
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			sortProperty: "PropA",
			filterProperty: "PropA",
			description: "PropC",
			type: undefined
		});

		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "Table",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: false,
			enableExport: false
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();
		await nextUIUpdate();

		assert.notOk(this.oSmartTable._oColumnHeaderPopover);
	});

	QUnit.test("ColumnMenu items when no columns are sortable/filterable", async function(assert) {
		var oResourceBundle = Library.getResourceBundleFor("sap.ui.comp");
		this.oSmartTable.destroy();

		var oColumn1 = new UIColumn({
			header: new Text({
				text: "Prop A"
			}),
			hAlign: "Begin"
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			description: "PropC",
			type: undefined
		});

		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "Table",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();
		await nextUIUpdate();

		this.oSmartTable._oPersController = {
			preparePersonalization: function() {
			},
			getColumnMap: function () {
				return {
					"PropA": oColumn1
				};
			}
		};

		var oColumnMenu = this.oSmartTable._oColumnHeaderPopover;
		oColumnMenu.openBy(oColumn1);

		var oItemContainer = oColumnMenu.getAggregation("_items")[0];
		assert.ok(oItemContainer.getItems().length === 1 && oItemContainer.getItems()[0].getLabel() === oResourceBundle.getText("SMARTTABLE_RP_COLUMNS"),
			"The SmartTable creates only the columns item");
		assert.ok(oColumnMenu._oPopover, "Popover is initialized");
	});

	QUnit.test("ColumnMenu is empty", async function(assert) {
		this.oSmartTable.destroy();

		const oColumn1 = new UIColumn({
			header: new Text({
				text: "Prop A"
			}),
			hAlign: "Begin"
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			description: "PropC",
			type: undefined
		});

		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "Table",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false
		});

		sinon.stub(this.oSmartTable, "_getP13nDialogSettings").returns({ columns: {	visible: false } });
		const oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable.placeAt("qunit-fixture");

		this.oSmartTable._createTable();
		await nextUIUpdate();

		const fnAnnounceEmptyColumnMenu = sinon.spy(TableUtil, "announceEmptyColumnMenu");
		const oColumnMenu = this.oSmartTable._oColumnHeaderPopover;
		oColumnMenu.openBy(oColumn1);
		const oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		const oItemContainer = oColumnMenu.getAggregation("_items")[0];
		assert.ok(!oQuickActionContainer.getEffectiveQuickActions().length && !oItemContainer.getEffectiveItems().length, "The ColumnMenu is empty");
		assert.notOk(oColumnMenu._oPopover, "Default is prevented: Popover is not initialized");
		assert.ok(fnAnnounceEmptyColumnMenu.calledOnce, "announceEmptyColumnMenu called once");
		fnAnnounceEmptyColumnMenu.restore();
	});

	QUnit.test("Column header popover should not show the filter & sort button when p13n filter & sort panels are hidden", async function(assert) {
		// Destroy the current SmartTable instance and create the SmartTable inline
		this.oSmartTable.destroy();

		var oColumn1 = new Column({
			header: new Text({
				text: "Prop A"
			}),
			hAlign: "Begin"
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			sortProperty: "PropA",
			filterProperty: "PropA",
			type: undefined
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			placeToolbarInTable: true,
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false
		});
		this.oSmartTable._bUseLegacyMenu = true;

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable._createTable();
		this.oSmartTable._createResponsivePopover();
		var fColumnHeaderPopoverOpenBySpy = sinon.spy(this.oSmartTable._oColumnHeaderPopover, "openBy");
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();


		// simulate p13nFilterPanel is hidden
		this.oSmartTable._bIsFilterPanelEnabled = false;

		this.oSmartTable._oTable.fireEvent("columnPress", {
			column: oColumn1
		});


		assert.strictEqual(this.oSmartTable._oFilterButton.getVisible(), false, "Filter Button is hidden from the Column header popover");
		assert.ok(fColumnHeaderPopoverOpenBySpy.called, "ColumnHeaderPopover openBy() called once");
		assert.ok(fColumnHeaderPopoverOpenBySpy.calledWith(oColumn1), "ColumnHeaderPopover was opened with the correct column instance");
		fColumnHeaderPopoverOpenBySpy.resetHistory();

		// simulate p13nSortPanel is hidden
		this.oSmartTable._bIsSortPanelEnabled = false;
		this.oSmartTable._oTable.fireEvent("columnPress", {
			column: oColumn1
		});

		assert.strictEqual(this.oSmartTable._aSortButton[0].getVisible(), false, "Sort Ascending Button is hidden from the Column header popover");
		assert.strictEqual(this.oSmartTable._aSortButton[1].getVisible(), false, "Sort Descending Button is hidden from the Column header popover");
		assert.ok(fColumnHeaderPopoverOpenBySpy.notCalled, "ColumnHeaderPopover openBy() not called second time since, sort and filter panels both are hidden");
	});

	QUnit.test("paste and beforePaste", function(assert) {
		var done = assert.async();
		var fBeforePasteSpy = sinon.spy(this.oSmartTable, "fireBeforePaste");
		var fPasteSpy = sinon.spy(this.oSmartTable, "firePaste");

		var oTable = this.oSmartTable.getTable();

		sap.ui.require([
			"sap/ui/core/util/PasteHelper"
		], function(PasteHelper) {
			sinon.stub(PasteHelper, "parse");
			PasteHelper.parse.returns(Promise.resolve());

			// fire delayed paste event on inner UI5 table
			Promise.resolve().then(function() {
				oTable.firePaste({
					data: []
				});

				Promise.resolve().then(function() {
					// No listeners
					assert.ok(fBeforePasteSpy.notCalled);
					assert.ok(fPasteSpy.notCalled);

					var fSmartTableBeforePasteSpy = sinon.stub();

					var fSmartTablePasteSpy = function() {
						// Listener(s) attached
						assert.ok(fBeforePasteSpy.calledOnce);
						assert.ok(fPasteSpy.calledOnce);

						assert.ok(fSmartTableBeforePasteSpy.calledOnce);
						assert.ok(PasteHelper.parse.calledOnce);

						PasteHelper.parse.restore();
						// paste was called once --> end of test
						done();
					};

					this.oSmartTable.attachBeforePaste(fSmartTableBeforePasteSpy);
					this.oSmartTable.attachPaste(fSmartTablePasteSpy);

					// fire delayed paste event on inner UI5 table
					Promise.resolve().then(function() {
						// paste on inner UI5 table
						oTable.firePaste({
							data: []
						});
					});
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("paste and beforePaste - columnInfo + parse/validation", function(assert) {
		var done = assert.async();

		var fBeforePasteSpy = sinon.spy(this.oSmartTable, "fireBeforePaste");
		var fPasteSpy = sinon.spy(this.oSmartTable, "firePaste");

		var oTable = this.oSmartTable.getTable();

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);

		var fnGetDateFormatSettings = sinon.stub(this.oSmartTable, "_getDateFormatSettings").returns({
			UTC: true,
			style: 'medium'
		});

		var oSimulatedDateInstance = ODataType.getType("Edm.DateTime");
		// ValueHelp and p13n Dialog changes the UTC=false setting (see ControlProvider._createModelTypeInstance)
		oSimulatedDateInstance.formatValue(new Date(), "string");
		oSimulatedDateInstance.oFormat.oFormatOptions.UTC = false;

		var aColumns = [
			new UIColumn({
				label: new Label({text: "Prop A"}),
				width: "10em"
			}).data("p13nData", {
				leadingProperty: "PropA",
				edmType: "Edm.String",
				type: "string",
				typeInstance: ODataType.getType("Edm.String")
			}), new AnalyticalColumn({
				leadingProperty: "PropB",
				label: new Label({text: "Prop B"}),
				width: "320px"
			}).data("p13nData", {
				type: "numeric",
				edmType: "Edm.Decimal",
				typeInstance: ODataType.getType("Edm.Decimal")
			}), new Column({
				header: new Text({
					text: "Prop C"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropC",
				edmType: "Edm.Decimal",
				additionalProperty: "SomeProp,SomeCurrency",
				unit: "SomeCurrency",
				precision: "10",
				scale: "3",
				type: "numeric",
				isCurrency: true,
				typeInstance: ODataType.getType("Edm.Decimal")
			}), new Column({
				header: new Text({
					text: "Prop D"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropD",
				edmType: "Edm.DateTime",
				type: undefined,
				typeInstance: ODataType.getType("Edm.DateTime")
			}), new Column({
				header: new Text({
					text: "Prop E"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropE",
				edmType: "Edm.Decimal",
				additionalProperty: "SomeUoM",
				unit: "SomeUoM",
				precision: "10",
				scale: "2",
				type: "numeric",
				typeInstance: ODataType.getType("Edm.Decimal")
			}), new Column({
				header: new Text({
					text: "Prop F"
				})
			}).data("p13nData", {
				leadingProperty: "PropF",
				edmType: "Edm.Boolean",
				type: "boolean",
				typeInstance: ODataType.getType("Edm.Boolean")
			}), new UIColumn({
				label: new Label({text: "Prop G"}),
				width: "15em"
			}).data("p13nData", {
				leadingProperty: "PropG",
				description: "DescriptionProp",
				displayBehaviour: "descriptionAndId",
				edmType: "Edm.String",
				type: "string",
				typeInstance: ODataType.getType("Edm.String")
			}), new UIColumn({
				label: new Label({text: "Prop H"}),
				width: "5em"
			}).data("p13nData", {
				leadingProperty: "PropH",
				isDigitSequence: true,
				edmType: "Edm.String",
				type: "string",
				typeInstance: ODataType.getType("Edm.String")
			}), new UIColumn({
				label: new Label({text: "Prop I"}),
				hAlign: "Right",
				width: "10em"
			}).data("p13nData", {
				leadingProperty: "PropI",
				edmType: "Edm.String",
				type: "stringdate",
				typeInstance: ODataType.getType("Edm.String")
			}), new UIColumn({
				label: new Label({text: "Prop J"}),
				width: "10em"
			}).data("p13nData", {
				type: "custom"
			}), new UIColumn({
				label: new Label({text: "Prop K"})
			}).data("p13nData", {
				type: "date",
				typeInstance: oSimulatedDateInstance
			})

		];

		var fnGetColumns = sinon.stub(oTable, "getColumns");
		fnGetColumns.returns(aColumns);

		sap.ui.require([
			"sap/ui/core/util/PasteHelper"
		], function(PasteHelper) {
			sinon.spy(PasteHelper, "parse");
			var testData = [
				"Aa", "100.278", "50.50", "EUR", "05 Mar 2019, 17:04:12", "12", "Kg", "Yes", "Id G", "Desc G", "H", "20190503"
			];
			var fSmartTableBeforePasteSpy = sinon.stub();
			var fSmartTablePasteSpy = function(oEvt) {
				var oResult = oEvt.getParameter("result");

				// Listener(s) attached
				assert.ok(fBeforePasteSpy.calledOnce);
				assert.ok(fBeforePasteSpy.calledWith(sinon.match.has("columnInfos", sinon.match(function(aCols) {
					assert.ok(oSimulatedDateInstance.oFormat !== aCols[aCols.length - 1].type.oFormat, "The passed typeInstance in the column has been changed to respect the provided dateFormatSettings");
					// BeforePaste contains additional columns for desc, uom, currency
					return aCols.length === aColumns.length + 3;
				}))));
				assert.ok(fBeforePasteSpy.calledWith(sinon.match.has("rawData", sinon.match.array.deepEquals(testData))));
				assert.ok(fPasteSpy.calledOnce);

				assert.ok(fSmartTableBeforePasteSpy.calledOnce);
				assert.ok(PasteHelper.parse.calledOnce);
				assert.ok(oResult);

				PasteHelper.parse.restore();

				// restore stub
				fnGetDateFormatSettings.restore();
				fnGetColumns.restore();
				// paste was called once --> end of test
				done();
			};

			this.oSmartTable.attachBeforePaste(fSmartTableBeforePasteSpy);
			this.oSmartTable.attachPaste(fSmartTablePasteSpy);

			// fire delayed paste event on inner UI5 table
			Promise.resolve().then(function() {
				// simulate paste on inner UI5 table
				oTable.firePaste({
					data: testData
				});
			});
		}.bind(this));
	});

	QUnit.test("Destroy for ResponsiveTable without binding", function(assert) {
		var bTableTemplateDestroyed = false;
		this.oSmartTable._oTemplate = {
			destroy: function() {
				bTableTemplateDestroyed = true;
			}
		};

		assert.equal(this.oSmartTable.bIsDestroyed, undefined);
		assert.ok(!bTableTemplateDestroyed, "table template exits");
		this.oSmartTable.destroy();
		assert.equal(this.oSmartTable._oTemplate, null);
		assert.strictEqual(this.oSmartTable.bIsDestroyed, true);
		assert.ok(bTableTemplateDestroyed, "table template has to be destroyed");
	});

	QUnit.test("Destroy", function(assert) {
		var bTableProviderDestroyed = false;
		var bPersControllerDestroyed = false;
		var bVariantManagementDestroyed = false;
		this.oSmartTable._oTableProvider = {
			destroy: function() {
				bTableProviderDestroyed = true;
			}
		};

		this.oSmartTable._oPersController = {
			destroy: function() {
				bPersControllerDestroyed = true;
			}
		};

		this.oSmartTable._oVariantManagement = {
			destroy: function() {
				bVariantManagementDestroyed = true;
			},
			isPageVariant: function() {
				return false;
			},
			detachInitialise: function() {
			},
			detachAfterSave: function() {
			},
			detachSave: function() {
			}
		};

		assert.equal(this.oSmartTable.bIsDestroyed, undefined);
		this.oSmartTable.destroy();
		assert.equal(this.oSmartTable._oTableProvider, null);
		assert.equal(this.oSmartTable._aTableViewMetadata, null);
		assert.strictEqual(this.oSmartTable.bIsDestroyed, true);
		assert.ok(bTableProviderDestroyed, "table provider has to be destroyed");
		assert.ok(bPersControllerDestroyed, "pers controller has to be destroyed");
		assert.ok(bVariantManagementDestroyed, "variant management has to be destroyed");
	});

	QUnit.test("Invisible columns of the sap.m.Table", function(assert) {
		this.oSmartTable.destroy();

		var oColumn1 = new Column().data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA"
		});
		var oColumn2 = new Column({
			visible: false
		}).data("p13nData", {
			columnKey: "PropB",
			leadingProperty: "PropB"
		});
		var oTemplate = new ColumnListItem({
			cells: [
				new Text(), new Text()
			]
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable"
		});
		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable.getTable().addColumn(oColumn2);
		this.oSmartTable._createTable();
		this.oSmartTable._oTemplate = oTemplate;

		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		this.oSmartTable.rebindTable();
		assert.strictEqual(oTemplate.getCells()[1].getBindingContext(), null, "Invisible columns binding context is set to null");

		oColumn2.setVisible(true);
		this.oSmartTable.rebindTable();
		assert.strictEqual(oTemplate.getCells()[1].getBindingContext(), undefined, "Visible columns binding context is set to undefined");

		oColumn1.setVisible(false);
		oTemplate.removeCell(oTemplate.getCells()[0]);
		this.oSmartTable.rebindTable();
		assert.strictEqual(oTemplate.getCells()[0].getBindingContext(), undefined, "Mismatch between columns and cells: The cells binding context is still undefined");

		this.oSmartTable.destroy();
	});

	QUnit.test("test keyboard shortcut CTRL + SHIFT + E opens the export settings dialog", async function(assert) {
		var oColumn1 = new Column({
			header: new Text({
				text: "Prop A"
			}),
			hAlign: "Begin"
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			sortProperty: "PropA",
			filterProperty: "PropA",
			type: undefined
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable"
		});
		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.setEnableExport(true);
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._createToolbar();
		this.oSmartTable._createToolbarContent();

		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable.placeAt("qunit-fixture");

		await nextUIUpdate();

		sinon.stub(this.oSmartTable, "_triggerUI5ClientExport");

		assert.notOk(this.oSmartTable._oExportButton.getEnabled(), "Export button is disabled");

		// trigger CTRL + SHIFT + E keyboard shortcut
		qutils.triggerKeydown(this.oSmartTable.getDomRef(), KeyCodes.E, true, false, true);
		assert.notOk(this.oSmartTable._triggerUI5ClientExport.called, "Export settings dialog not opened as the _oExportButton is disabled");

		this.oSmartTable._oExportButton.setEnabled(true);

		assert.equal(FESRHelper.getSemanticStepname(this.oSmartTable._oExportButton, "defaultAction"), "OI:QE", "Correct FESR StepName");
		assert.equal(FESRHelper.getSemanticStepname(this.oSmartTable._oExportButton.getMenu().getItems()[0], "press"), "OI:QE", "Correct FESR StepName - Menu Item 1");
		assert.equal(FESRHelper.getSemanticStepname(this.oSmartTable._oExportButton.getMenu().getItems()[1], "press"), "OI:EXP:SETTINGS", "Correct FESR StepName - Menu Item 2");

		// trigger CTRL + SHIFT + E keyboard shortcut
		qutils.triggerKeydown(this.oSmartTable.getDomRef(), KeyCodes.E, true, false, true);
		assert.ok(this.oSmartTable._triggerUI5ClientExport.calledOnce, "this.oSmartTable._triggerUI5ClientExport has to be called for UI5Client export");
		assert.ok(this.oSmartTable._triggerUI5ClientExport.firstCall.calledWith(true), "this.oSmartTable._triggerUI5ClientExport has been called with bExportAs equals 'true'");

		this.oSmartTable._triggerUI5ClientExport.restore();
		this.oSmartTable.destroy();
	});

	QUnit.test("test demandPopin and autoPopinMode mapping for ResponsiveTable", async function(assert) {
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			demandPopin: true
		});
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._isMobileTable = true;
		await nextUIUpdate();
		assert.ok(this.oSmartTable.getTable().getAutoPopinMode(), "autoPopinMode=true as demandPopin=true");

		this.oSmartTable.setDemandPopin(false);
		await nextUIUpdate();
		assert.notOk(this.oSmartTable.getTable().getAutoPopinMode(), "autoPopinMode=false as demandPopin=false");
	});

	QUnit.test("test enableAutoColumnWidth for ResponsiveTable", async function(assert) {
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			enableAutoColumnWidth: true
		});
		this.oSmartTable.placeAt("qunit-fixture");

		this.oSmartTable._aTableViewMetadata = [{
			name: "PropA",
			isInitiallyVisible: true,
			width: "5rem",
			template: new Text()
		}];
		this.oSmartTable._bUseLegacyMenu = true;

		this.oSmartTable._createContent();
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable._isMobileTable = true;
		await nextUIUpdate();

		var oColumn = this.oSmartTable.getTable().getColumns()[0];
		var oResizer = this.oSmartTable.getTable().getDependents()[0];

		assert.ok(this.oSmartTable.getDemandPopin(), "ST.demandPopin=true");
		assert.ok(this.oSmartTable.getTable().getAutoPopinMode(), "RT.autoPopinMode=true");
		assert.equal(this.oSmartTable.getTable().getFixedLayout(), "Strict", "RT.fixedLayout=Strict");
		assert.equal(this.oSmartTable.getTable().getContextualWidth(), "auto", "RT.contextualWidth=auto");
		assert.ok(oResizer.isA("sap.m.plugins.ColumnResizer"), "RT.ColumnResizer plugin is added");
		assert.notOk(oColumn.getHeader().getWrapping(), "RT.column.wrapping=false");

		// simulate matchMedia "matches" to return true
		var fnMatchMediaOriginal = window.matchMedia;
		window.matchMedia = sinon.stub();
		window.matchMedia.returns({
			matches: true
		});

		this.oSmartTable.getTable().fireEvent("columnPress", {
			column: oColumn
		});

		var oCHP = this.oSmartTable._oColumnHeaderPopover;
		var oResizeItem = oCHP.getItems().pop();
		var oStartResizingSpy = sinon.spy(oResizer, "startResizing");

		oResizeItem.firePress();
		assert.ok(oStartResizingSpy.calledOnce, "ColumnResizer#startResizing is called");
		assert.ok(oStartResizingSpy.calledWith(oColumn.getDomRef()), "ColumnResizer#startResizing is called with Column Dom");

		// restore original window.matchMedia
		window.matchMedia = fnMatchMediaOriginal;
	});

	QUnit.test("_getColumnLabel", function(assert) {
		this.oSmartTable.destroy();

		this.oSmartTable = new SmartTable({
			entitySet: "foo"
		});

		var oODataModel = getModelStubInstance(ODataModel);
		var oResourceModel = new ResourceModel({bundle: Library.getResourceBundleFor("sap.ui.comp")});
		oResourceModel.getProperty = function(sKey) {
			return sKey == "Property2" ? "Another Property Label" : sKey;
		};

		this.oSmartTable.getModel = function(sName) {
			if (!sName) {
				return oODataModel;
			}
			return Control.prototype.getModel.apply(this, arguments);
		};
		this.oSmartTable._createTableProvider();
		this.oSmartTable._createTable();
		this.oSmartTable._oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
		this.oSmartTable.bIsInitialised = true;

		var aBackendMetadata = [
			{
				name: "property1",
				type: "Edm.String",
				visible: true,
				fieldLabel: "Property Label"
			},
			{
				name: "property2",
				type: "Edm.String",
				visible: true,
				fieldLabel: "{@i18n>Property2}"
			}
		];

		this.oSmartTable._oTableProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);

		var oUIColumn = new UIColumn({
			label: new Label({text: "Column Label"})
		});

		var oMColumn = new Column({
			header: new Text({
				text: "Column Header"
			})
		});

		var oCol = new UIColumn({
			label: new Label({text: "The Label"})
		}).data("p13nData", {
			columnKey: "propertyName"
		});

		this.oSmartTable._oTable.addColumn(oCol);

		assert.strictEqual(this.oSmartTable._getColumnLabel(oUIColumn), "Column Label", "Column Label returned, for sap.ui.table.Column instance");
		assert.strictEqual(this.oSmartTable._getColumnLabel(oMColumn), "Column Header", "Column Header returned, for sap.m.Column instance");
		assert.strictEqual(this.oSmartTable._getColumnLabel("propertyName"), "The Label", "The Label returned");
		assert.strictEqual(this.oSmartTable._getColumnLabel("nonexistingProperty"), null, "null returned");
		assert.strictEqual(this.oSmartTable._getColumnLabel("property1"), "Property Label", "Property Label returned from metadata");

		assert.strictEqual(this.oSmartTable._getColumnLabel("property2"), "{@i18n>Property2}", "Binding Path to ResourceModel returned from metadata - No ResourceModel");
		this.oSmartTable.setModel(oResourceModel, "someothername");
		assert.strictEqual(this.oSmartTable._getColumnLabel("property2"), "{@i18n>Property2}", "Binding Path to ResourceModel returned from metadata - ResourceModel not named @i18n");
		this.oSmartTable.setModel(oResourceModel, "@i18n");
		assert.strictEqual(this.oSmartTable._getColumnLabel("property2"), "Another Property Label", "Binding Path to ResourceModel returned from metadata");
	});

	QUnit.test("setBindingContext(null) when MessageModel has validation error and a column visibility changes to hidden", async function(assert) {
		this.oSmartTable.destroy();

		var oColumn1 = new Column().data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA"
		});
		var oColumn2 = new Column({
			visible: true
		}).data("p13nData", {
			columnKey: "PropB",
			leadingProperty: "PropB"
		});
		var oColumn3 = new Column({
			visible: true
		}).data("p13nData", {
			columnKey: "PropC",
			leadingProperty: "PropC"
		});
		var oTemplate = new ColumnListItem({
			cells: [
				new Input({
					value: "{PropA}"
				}), new Input({
					value: "{PropB}"
				}), new Input({
					value: "{PropC}"
				})
			]
		});
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			tableBindingPath: "/testPath",
			editable: true
		});

		var oModel = new JSONModel();
		oModel.setData({
			testPath: [
				{
					PropA: "PropA",
					PropB: "PropB",
					PropC: "PropC"
				},
				{
					PropA: "PropA",
					PropB: "PropB",
					PropC: "PropC"
				},
				{
					PropA: "PropA",
					PropB: "PropB",
					PropC: "PropC"
				},
				{
					PropA: "PropA",
					PropB: "PropB",
					PropC: "PropC"
				},
				{
					PropA: "PropA",
					PropB: "PropB",
					PropC: "PropC"
				}
			]
		});
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable.getTable().addColumn(oColumn2);
		this.oSmartTable.getTable().addColumn(oColumn3);
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();
		this.oSmartTable._oTemplate = oTemplate;
		this.oSmartTable.bIsInitialised = true; // fake SmartTable is initialized
		this.oSmartTable.rebindTable();
		await nextUIUpdate();

		var oSomeCell = this.oSmartTable._oTable.getItems()[0].getCells()[0];

		var fnStubMessageModelData = sinon.stub(Messaging.getMessageModel(), "getData");
		fnStubMessageModelData.returns([
			{
				type: "Error",
				validation: true,
				getControlId: function() {
					return oSomeCell.getId();
				}
			}
		]);

		var fnSetBindingContextSpy = sinon.spy(Input.prototype, "setBindingContext");
		var oTableChangedEvent = new Event('afterP13nModelDataChange', this.oSmartTable._oPersController, {
			runtimeDeltaDataChangeType : {
				"columns": "TableChanged",
				"sort": "Unchanged",
				"filter": "Unchanged",
				"group": "Unchanged"
			},
			runtimeDeltaData: {
				"columns": {
					"columnsItems": [
						{
							"columnKey": "PropA",
							"visible": false
						},
						{
							"columnKey": "PropB",
							"index": 1
						},
						{
							"columnKey": "PropC",
							"index": 2
						}
					]
				}
			}
		});

		// simulate 1st column is hidden via personalization
		this.oSmartTable._personalisationModelDataChange(oTableChangedEvent);
		await nextUIUpdate();

		assert.ok(fnSetBindingContextSpy.calledWith(null), "Control found and binding context of the control is set to null");
		fnStubMessageModelData.restore();
	});

	/**
	 * @deprecated As of version 1.76 (and earlier). TreeTable properties (rootLevel, collapseRecursive, expandFirstLevel) are deprecated and replaced by binding parameters.
	 */
	QUnit.test("Default binding parameters added by the TreeTable should be also added to the SmartTable's mParameter in the _reBindTable", function(assert) {
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			tableType: "TreeTable",
			initiallyVisibleFields: "PropA,PropB,PropC",
			useTablePersonalisation: false
		});
		var fBindRowsSpy = sinon.spy(this.oSmartTable._oTable, "bindRows"),
			oModel = new JSONModel({});

		this.oSmartTable.setEntitySet("EntitySet");
		this.oSmartTable.setModel(oModel);

		var fGetRequestAtLeastFieldsStub = sinon.stub(this.oSmartTable, "_getRequestAtLeastFields").returns(["PropA", "PropB", "PropC"]);

		this.oSmartTable._createTable();
		assert.ok(this.oSmartTable._isTreeTable, "_isTreeTable boolean set correctly");
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable.attachEventOnce("beforeRebindTable", function(oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			assert.ok(mBindingParams.parameters.hasOwnProperty("numberOfExpandedLevels"), "numberOfExpandedLevels is added to the bindingParams, since its TreeTable type");
			assert.strictEqual(mBindingParams.parameters["numberOfExpandedLevels"], 0, "numberOfExpandedLevels=0 by default by the TreeTable");
			assert.ok(mBindingParams.parameters.hasOwnProperty("rootLevel"), "rootLevel is added to the bindingParams, since its TreeTable type");
			assert.strictEqual(mBindingParams.parameters["rootLevel"], 0, "rootLevel=0 by default by the TreeTable");
			assert.ok(mBindingParams.parameters.hasOwnProperty("collapseRecursive"), "collapseRecursive is added to the bindingParams, since its TreeTable type");
			assert.strictEqual(mBindingParams.parameters["collapseRecursive"], true, "collapseRecursive=true by default by the TreeTable");
		});
		this.oSmartTable.rebindTable();
		assert.strictEqual(fBindRowsSpy.callCount, 1, "bindRows called on the inner table once since the table was not bound");

		this.oSmartTable.attachEventOnce("beforeRebindTable", function(oEvent) {
			// beforeRebindTable event handle for the second rebindTable call
			var mParameters = oEvent.getParameter("bindingParams").parameters,
				mTableBindingParameters = oEvent.getSource()._oTable.getBinding("rows").mParameters;
			assert.deepEqual(mParameters, mTableBindingParameters, "SmartTable's and TreeTable's binding parameters are equal");
		});

		// call the rebindTable second time
		this.oSmartTable.rebindTable();
		assert.strictEqual(fBindRowsSpy.callCount, 1, "bindRows was not called again since binding parameters did not change");

		fGetRequestAtLeastFieldsStub.restore();
	});

	QUnit.test("add hierarchy fields to $select, since ODataTreeBinding also adds it", function(assert) {
		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			tableType: "TreeTable",
			initiallyVisibleFields: "PropA,PropB,PropC",
			useTablePersonalisation: false
		});

		var oModel = getModelStubInstance(ODataModel);
		var oDataTreeBindingStub = sinon.createStubInstance(ODataTreeBinding);
		oDataTreeBindingStub.getTreeAnnotation.withArgs("hierarchy-level-for").returns("HierarchyLevelFor");
		oDataTreeBindingStub.getTreeAnnotation.withArgs("hierarchy-parent-node-for").returns("HierarchyParentNodeFor");
		oDataTreeBindingStub.getTreeAnnotation.withArgs("hierarchy-node-for").returns("HierarchyNodeFor");
		oDataTreeBindingStub.getTreeAnnotation.withArgs("hierarchy-drill-state-for").returns("HierarchyDrillStateFor");

		this.oSmartTable.setEntitySet("EntitySet");
		this.oSmartTable.setModel(oModel);
		var fGetRequestAtLeastFieldsStub = sinon.stub(this.oSmartTable, "_getRequestAtLeastFields").returns(["PropA", "PropB", "PropC"]);
		this.oSmartTable._createTableProvider();
		this.oSmartTable._createTable();
		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
		var fGetRowBinding = sinon.stub(this.oSmartTable._oTable, "getBinding");
		fGetRowBinding.withArgs("rows").returns(oDataTreeBindingStub);
		this.oSmartTable.bIsInitialised = true;

		this.oSmartTable.attachEventOnce("beforeRebindTable", function(oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams").parameters;
			var aSelect = mBindingParams.select.split(",");
			assert.ok(aSelect.indexOf("HierarchyDrillStateFor") > -1, "HierarchyDrillStateFor from the treeAnnotation is added to $select");
			assert.ok(aSelect.indexOf("HierarchyNodeFor") > -1, "HierarchyNodeFor from the treeAnnotation is added to $select");
			assert.ok(aSelect.indexOf("HierarchyParentNodeFor") > -1, "HierarchyParentNodeFor from the treeAnnotation is added to $select");
			assert.ok(aSelect.indexOf("HierarchyLevelFor") > -1, "HierarchyLevelFor from the treeAnnotation is added to $select");
		});
		this.oSmartTable.rebindTable();

		fGetRequestAtLeastFieldsStub.restore();
		fBindStub.restore();
		fGetRowBinding.restore();
	});

	QUnit.test("Binding change event should update header count", function(assert) {
		this.oSmartTable.setEntitySet("Foo");
		var oModel = new JSONModel({});
		this.oSmartTable.setModel(oModel);
		this.oSmartTable._createTable();
		this.oSmartTable.bIsInitialised = true;
		this.oSmartTable.attachEventOnce("beforeRebindTable", function(oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			mBindingParams.parameters.select = "PropA";
		});
		this.oSmartTable.rebindTable();

		var fOnDataLoadCompleteSpy = sinon.spy(this.oSmartTable, "_onDataLoadComplete"),
			oBinding = this.oSmartTable._oTable.getBinding("rows");

		// simulate binding change event with reason = "add"
		oBinding.fireEvent("change", {
			reason: "add"
		});

		assert.ok(fOnDataLoadCompleteSpy.calledOnce, "_onDataLoadComplete function called which updates the count information");

		// simulate binding change event with reason = "add"
		oBinding.fireEvent("change", {
			reason: "remove"
		});

		assert.ok(fOnDataLoadCompleteSpy.calledTwice, "_onDataLoadComplete function called which updates the count information");
	});

	QUnit.test("rebindTable with semanticObjectPath", function(assert) {
		if (this.oSmartTable) {
			this.oSmartTable.destroy();
		}

		this.oSmartTable = new SmartTable({
			entitySet: "CompanySet",
			beforeRebindTable: function(oEvent) {
				var aSelect = oEvent.getParameter("bindingParams").parameters.select.split(",");

				assert.ok(aSelect.includes("SemanticObjectPath"), "SemanticObjectPath for Property1 is added to the $select");
			}
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable._createTableProvider();
		this.oSmartTable._aTableViewMetadata = [
			{
				"name": "Property1",
				"semanticObjectPath": "SemanticObjectPath",
				"isInitiallyVisible": true,
				"template": new Text()
			},
			{
				"name": "SemanticObjectPath"
			}
		];
		this.oSmartTable._oColumnHeaderPopover.destroy();
		this.oSmartTable._createContent();
		this.oSmartTable.bIsInitialised = true;
		var fnGetSemanticObjectBindingPaths = sinon.spy(this.oSmartTable, "_getSemanticObjectBindingPaths");
		sinon.stub(this.oSmartTable._oTable, "bindRows");
		this.oSmartTable.rebindTable();
		assert.ok(fnGetSemanticObjectBindingPaths.calledWith(["Property1"]));
		this.oSmartTable._oTable.bindRows.restore();
	});

	QUnit.test("_storeInitialColumnSettings should store properties for initially non-visible columns when they have SortOrder annotation", function(assert) {
		// Arrange
		this.oSmartTable._aTableViewMetadata = [{
			name: "Bukrs",
			sorted: true,
			sortOrder: "Ascending"
		},{
			name: "Budat",
			sorted: true,
			sortOrder: "Ascending"
		},{
			name: "Gjahr",
			sorted: false
		}];

		// Act
		this.oSmartTable._storeInitialColumnSettings();

		// Assert
		assert.equal(this.oSmartTable._aInitialSorters.length, 2, "Correct number of initial sorters is added");
		assert.equal(this.oSmartTable._aInitialSorters[1].columnKey, "Budat", "Correct item from metadata is added");
		assert.equal(this.oSmartTable._aInitialSorters[1].operation, "Ascending", "Correct item from metadata is added");
		assert.equal(this.oSmartTable._aInitialSorters[1].initiallyNotVisibleColumn, true, "flag for initially visible column is correctly set");
	});

	QUnit.test("_processDateFiltersForVariant should not throw exception when there is no persocontroller and should return the current variant", function (assert) {
		// Arrange
		this.oSmartTable._oPersController = null;

		// Act
		this.oSmartTable._processDateFiltersForVariant({});

		// Arrange
		assert.ok(true, "no exception thrown");
	});

	QUnit.module("customizeConfig", {
		beforeEach: function() {
			this.oSmartTable = new SmartTable();
		},
		afterEach: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("Shall propogate customizeConfig textInEditModeSource property to ControlProvider", function(assert) {
		this.oSmartTable.data("useSmartField", true);
		this.oSmartTable.setCustomizeConfig({textInEditModeSource: {"*": "ValueList"}});
		var sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);

		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);
		assert.equal(this.oSmartTable._oTableProvider._oControlProvider._oCustomizeConfigTextInEditModeSource["*"], "ValueList", "textinEditModeSource property propogated to smartField");

		this.oSmartTable.setCustomizeConfig({textInEditModeSource: {"*": "NavigationProperty"}});
		this.oSmartTable._createTableProvider();
		assert.equal(this.oSmartTable._oTableProvider._oControlProvider._oCustomizeConfigTextInEditModeSource["*"], "NavigationProperty", "textinEditModeSource property propogated to smartField");
	});

	QUnit.test("test _validateCustomizeConfig for 'textInEditModeSource", function(assert) {
		Log.error.reset();
		var oConfig = {textInEditModeSource: "ValueList"};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property textInEditModeSource. Provided configuration has been deleted from the customizeConfig property - " + this.oSmartTable.getId()), "Error logged, since an object is expected as the value");
		assert.notOk(oConfig.hasOwnProperty("textInEditModeSource"), "Invalid config property deleted");

		oConfig = {textInEditModeSource: {"test": {"*": "ValueList"}}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property 'test' for the textInEditModeSource property of the customizeConfig - " + this.oSmartTable.getId()), "Invalid config property");
		assert.notOk(oConfig.textInEditModeSource.hasOwnProperty("test"), "Invalid config property deleted");

		oConfig = {textInEditModeSource: {"*": new Button()}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property textInEditModeSource. Provided configuration has been deleted from the customizeConfig property - " + this.oSmartTable.getId()), "Error logged, since an UI5 control instance is provided as the value");
		assert.notOk(oConfig.textInEditModeSource.hasOwnProperty("*"), "Invalid config property deleted");
	});

	QUnit.test("Shall propagate customizeConfig clientSideMandatoryCheck property to ControlProvider", function(assert) {
		this.oSmartTable.data("useSmartField", true);
		this.oSmartTable.setCustomizeConfig({clientSideMandatoryCheck: {"*": false}});
		var sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);

		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);
		assert.equal(this.oSmartTable._oTableProvider._oControlProvider._oCustomizeConfigClientSideMandatoryCheck["*"], false, "clientSideMandatoryCheck property propogated to smartField");

		this.oSmartTable.setCustomizeConfig({clientSideMandatoryCheck: {"*": true}});
		this.oSmartTable._createTableProvider();
		assert.equal(this.oSmartTable._oTableProvider._oControlProvider._oCustomizeConfigClientSideMandatoryCheck["*"], true, "clientSideMandatoryCheck property propogated to smartField");
	});

	QUnit.test("test _validateCustomizeConfig for 'clientSideMandatoryCheck' property", function(assert) {
		Log.error.reset();
		var oConfig = {"clientSideMandatoryCheck": false};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property clientSideMandatoryCheck. Provided configuration has been deleted from the customizeConfig property - " + this.oSmartTable.getId()), "Error logged, since an object is expected as the value");
		assert.notOk(oConfig.hasOwnProperty("insertIgnoreRestrictions"), "Invalid config property deleted");

		oConfig = {"clientSideMandatoryCheck": {"*": "false"}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property '*' for the clientSideMandatoryCheck property of the customizeConfig - " + this.oSmartTable.getId()), "Error logged since the passed value is not boolean");
		assert.notOk(oConfig.clientSideMandatoryCheck.hasOwnProperty("*"), "Invalid config property deleted");

		oConfig = {"clientSideMandatoryCheck": {"*": false, "foo": "test"}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property 'foo' for the clientSideMandatoryCheck property of the customizeConfig - " + this.oSmartTable.getId()), "Error logged since the passed value is not boolean");
		assert.notOk(oConfig.clientSideMandatoryCheck.hasOwnProperty("foo"), "'foo' has been deleted from the config object since it was an invalid config");

		oConfig = {"clientSideMandatoryCheck": {"*": new Button()}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property '*' for the clientSideMandatoryCheck property of the customizeConfig - " + this.oSmartTable.getId()), "Error logged since the passed value is not boolean");

		Log.error.reset();
		oConfig = {"clientSideMandatoryCheck": {"*": false}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.notCalled, "Valid config passed, hence error not logged");
	});

	QUnit.test("test _validateCustomizeConfig for 'insertIgnoreRestrictions' property", function(assert) {
		Log.error.reset();
		var oConfig = {"ignoreInsertRestrictions": false};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property ignoreInsertRestrictions. Provided configuration has been deleted from the customizeConfig property - " + this.oSmartTable.getId()), "Error logged, since an object is expected as the value");
		assert.notOk(oConfig.hasOwnProperty("insertIgnoreRestrictions"), "Invalid config property deleted");

		oConfig = {"ignoreInsertRestrictions": {"*": "false"}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property '*' for the ignoreInsertRestrictions property of the customizeConfig - " + this.oSmartTable.getId()), "Error logged since the passed value is not boolean");
		assert.notOk(oConfig.ignoreInsertRestrictions.hasOwnProperty("*"), "Invalid config property deleted");

		oConfig = {"ignoreInsertRestrictions": {"*": false, "foo": "test"}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property 'foo' for the ignoreInsertRestrictions property of the customizeConfig - " + this.oSmartTable.getId()), "Error logged since the passed value is not boolean");
		assert.notOk(oConfig.ignoreInsertRestrictions.hasOwnProperty("foo"), "'foo' has been deleted from the config object since it was an invalid config");

		oConfig = {"ignoreInsertRestrictions": {"*": new Button()}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property '*' for the ignoreInsertRestrictions property of the customizeConfig - " + this.oSmartTable.getId()), "Error logged since the passed value is not boolean");

		Log.error.reset();
		oConfig = {"ignoreInsertRestrictions": {"*": false}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.notCalled, "Valid config passed, hence error not logged");
	});

	QUnit.test("test _validateCustomizeConfig for 'autoColumnWidth' property", function(assert) {
		Log.error.reset();
		assert.notOk(this.oSmartTable.getEnableAutoColumnWidth(), "enableAutoColumnWidth=false");
		var oConfig = {"autoColumnWidth": {}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("The autoColumnWidth property is deleted from the customizeConfig, since enableAutoColumnWidth=false on the SmartTable - " + this.oSmartTable.getId()), "Error logged, since enableAutoColumnWidth=false");
		assert.notOk(oConfig.hasOwnProperty("autoColumnWidth"), "autoColumnWidth deleted since enableAutoColumnWidth=false");

		this.oSmartTable.setEnableAutoColumnWidth(true);
		oConfig = {"autoColumnWidth": false};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property autoColumnWidth. Provided configuration has been deleted from the customizeConfig property - " + this.oSmartTable.getId()), "Error logged, since an object is expected as the value");
		assert.notOk(oConfig.hasOwnProperty("autoColumnWidth"), "Invalid config property deleted");

		oConfig = {"autoColumnWidth": {"*": "false"}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Expected 'object' or 'boolean', instead string was passed for '*' autoColumnWidth customizeConfig property - " + this.oSmartTable.getId()), "Error logged, since the passed value is not boolean/object");
		assert.notOk(oConfig.autoColumnWidth.hasOwnProperty("*"), "Invalid config property deleted");

		oConfig = {"autoColumnWidth": {"*": true, "foo": "test"}};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Expected 'object' or 'boolean', instead string was passed for 'foo' autoColumnWidth customizeConfig property - " + this.oSmartTable.getId()), "Error logged, since the passed value is not boolean/object");
		assert.notOk(oConfig.autoColumnWidth.hasOwnProperty("foo"), "'foo' has been deleted from the config object since it was an invalid config");

		oConfig = {
			"autoColumnWidth": {
				"*": false,
				"foo": {
					truncateLabel: "true"
				}
			}
		};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("The truncateLabel property must be of type boolean, instead string was passed - " + this.oSmartTable.getId()), "Error logged, since truncateLabel is a string");
		assert.notOk(oConfig.autoColumnWidth.foo.hasOwnProperty("truncateLabel"), "Invalid config deleted");

		oConfig = {
			"autoColumnWidth": {
				"*": false,
				"foo": {
					truncateLabel: true,
					gap: "1"
				}
			}
		};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("The gap property must be of type number, instead string was passed - " + this.oSmartTable.getId()), "Error logged, since gap is a string");
		assert.notOk(oConfig.autoColumnWidth.foo.hasOwnProperty("gap"), "Invalid config deleted");

		oConfig = {
			"autoColumnWidth": {
				"*": false,
				"foo": {
					truncateLabel: true,
					gap: 1,
					min: false
				}
			}
		};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("The min property must be of type number, instead boolean was passed - " + this.oSmartTable.getId()), "Error logged, since min is a boolean");
		assert.notOk(oConfig.autoColumnWidth.foo.hasOwnProperty("min"), "Invalid config deleted");

		oConfig = {
			"autoColumnWidth": {
				"*": false,
				"foo": {
					truncateLabel: true,
					gap: 1,
					min: 1,
					max: "test"
				}
			}
		};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("The max property must be of type number, instead string was passed - " + this.oSmartTable.getId()), "Error logged, since max is a string");
		assert.notOk(oConfig.autoColumnWidth.foo.hasOwnProperty("max"), "Invalid config deleted");

		oConfig = {
			"autoColumnWidth": {
				"*": false,
				"foo": {
					truncateLabel: true,
					gap: 1,
					min: 1,
					max: 1,
					someProp: "test"
				}
			}
		};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.calledWith("Invalid config property 'someProp' for the autoColumnWidth property of the customizeConfig - " + this.oSmartTable.getId()), "Error logged, since someProp is not supported");
		assert.notOk(oConfig.autoColumnWidth.foo.hasOwnProperty("someProp"), "Invalid config deleted");

		Log.error.reset();
		oConfig = {
			"autoColumnWidth": {
				"*": false,
				"foo": {
					truncateLabel: true,
					gap: 1,
					min: 1,
					max: 1
				}
			}
		};
		this.oSmartTable._validateCustomizeConfig(oConfig);
		assert.ok(Log.error.notCalled, "No errors logged since the provided autoColumnWidth config is valid");
	});

	QUnit.test("test customizeConfig for autoColumnWidth", function(assert) {
		this.oSmartTable.destroy();

		this.oSmartTable = new SmartTable({
			entitySet: "EntitySet",
			customizeConfig: {
				"autoColumnWidth": {
					"PropA": {
						"truncateLabel": false,
						"min": 5,
						"max": 10,
						"gap": 2
					},
					"PropB": {
						"truncateLabel": true,
						"gap": 5
					}
				}
			}
		});

		var oExpectedResult = {
			"autoColumnWidth": {
				"PropA": {
					"truncateLabel": false,
					"min": 5,
					"max": 10,
					"gap": 2
				},
				"PropB": {
					"truncateLabel": true,
					"gap": 5
				}
			}
		};
		this.oSmartTable._createTableProvider();

		assert.deepEqual(this.oSmartTable.getCustomizeConfig(), oExpectedResult, "expected result found for customizeConfig");
		assert.deepEqual(this.oSmartTable._oCustomizeConfigAutoColumnWidth, oExpectedResult.autoColumnWidth, "autoColumnWidth validated and set as expected");
	});

	QUnit.test("Propagate customizeCofig.ignoreInsertRestrictions to ControlProvider", function(assert) {
		this.oSmartTable.data("useSmartField", true);
		this.oSmartTable.setCustomizeConfig({
			textInEditModeSource: {
				"*": "ValueList"
			},
			ignoreInsertRestrictions: {
				"*": false,
				"foo": true
			}
		});
		var sEntitySet = "COMPANYSet", oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setEntitySet(sEntitySet);
		this.oSmartTable.setModel(oModel);

		assert.deepEqual(this.oSmartTable._oTableProvider._oCustomizeConfigIgnoreInsertRestrictions, this.oSmartTable.getCustomizeConfig().ignoreInsertRestrictions, "Correct value propagated to TableProvider");
		assert.deepEqual(this.oSmartTable._oTableProvider._oControlProvider._oCustomizeConfigIgnoreInsertRestrictions, this.oSmartTable.getCustomizeConfig().ignoreInsertRestrictions, "Correct value propagated to TableProvider");
	});

	QUnit.module("SmartTable - DataStateIndicator", {
		beforeEach: function() {
			if (this.oSmartTable) {
				this.oSmartTable.destroy();
			}

			this.oDataStateIndicator = new DataStateIndicator({
				enableFiltering: true
			});

			this.fnShowTableFilterDialogStub = sinon.stub(SmartTable.prototype, "_showTableFilterDialog");

			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				beforeRebindTable: [function(oEvent) {
					this._bMessageFilterActive = oEvent.getParameter("messageFilterActive");
				}, this],
				dataStateIndicator: this.oDataStateIndicator
			});

			this.oSmartTable._aTableViewMetadata = [];
			this.oModel = getModelStubInstance(ODataModel);
			this.oSmartTable.setModel(this.oModel);
		},
		afterEach: function() {
			this.oSmartTable.destroy();
			this.fnShowTableFilterDialogStub.restore();
		}
	});

	QUnit.test("test DataStateIndicator, InfoToolbar and p13nMessageStrip", function(assert) {
		var done = assert.async(),
			oTable = new Table({
				columns: [
					new Column({
						header: new Text({
							text: "Column A"
						}),
						hAlign: "Begin",
						importance: "High"
					}).data("p13nData", {
						columnKey: "ColumnA",
						leadingProperty: "ColumnA",
						edmType: "Edm.String",
						type: "string"
					})
				]
			});

		this.oSmartTable._oColumnHeaderPopover.destroy();
		this.oSmartTable.addItem(oTable);
		this.oSmartTable._createTable();
		var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
		this.oSmartTable._createContent();
		this.oSmartTable.rebindTable();

		var aMessages = [
			new Message({
				message: "A message",
				fullTarget: "/apath/somesubpath",
				target: "/apath/somesubpath",
				type: "Error"
			})
		];
		var oDataState = {
			getChanges: function(){
				return {messages: aMessages};
			},
			getMessages: function(){
				return aMessages;
			}
		};

		var oListBinding = sinon.createStubInstance(ODataListBinding);
		oListBinding.getPath = function() {return "/apath";};
		oListBinding.getDataState = function() {return oDataState;};

		var oBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
		oBindingStub.returns(oListBinding);
		var oInnerBindingStub = sinon.stub(this.oSmartTable._oTable, "getBinding");
		oInnerBindingStub.returns(oListBinding);

		var oErrorMessage = new Filter("Key1", "EQ", "11");
		var pFilterMessageResolve = Promise.resolve(oErrorMessage);
		oListBinding.requestFilterForMessages.returns(pFilterMessageResolve);

		// simulate error message
		this.oDataStateIndicator._processDataState(oDataState);

		setTimeout(function() {
			assert.equal(this.oDataStateIndicator._oLink.getText(), "Filter Items", "Messagestrip Link created and visible");
			assert.notOk(this.oSmartTable._getP13nFilterMessageStrip(), "P13nMessageStrip not exists");
			assert.notOk(this.oSmartTable._oMessageFilter, "Message filter is not active");
			this.oDataStateIndicator._oLink.firePress();

			setTimeout(function() {
				assert.ok(this._bMessageFilterActive, "MessageFilterActive parameter was true");
				assert.equal(this.oSmartTable._oMessageFilter, oErrorMessage, "Expected MessageFilter set");
				assert.ok(this.oSmartTable.getTable().getInfoToolbar().getActive(), "InfoToolbar is active");

				this.oSmartTable.getTable().getInfoToolbar().firePress();
				assert.ok(this.fnShowTableFilterDialogStub.called, "Personalization filter dialog opened");

				this.oDataStateIndicator._oLink.firePress();
				assert.notOk(this.oSmartTable._oMessageFilter, "MessageFilter not set");
				assert.notOk(this._bMessageFilterActive, "MessageFilterActive parameter was false");
				assert.notOk(this.oSmartTable._getP13nFilterMessageStrip(), "P13nMessageStrip not created");

				this.oSmartTable.setDataStateIndicator(null);
				assert.notOk(this.oSmartTable.getTable().getInfoToolbar(), "InfoToolbar is removed");

				fBindStub.restore();
				oBindingStub.restore();
				oInnerBindingStub.restore();

				done();
			}.bind(this), 0);
		}.bind(this), 300);
	});

	QUnit.test("Header Level Property added", function(assert) {
		assert.strictEqual(this.oSmartTable.getHeaderLevel(), "Auto", "Header level set to the header");
		this.oSmartTable.setHeaderLevel("H2");
		this.oSmartTable.setHeader("Test Table");
		assert.strictEqual(this.oSmartTable.getToolbar().getContent()[0].getLevel(), "H2", "Header level changed");
		var oToolbar = new Toolbar();
		this.oSmartTable.setCustomToolbar(oToolbar);
		this.oSmartTable.setHeader("Custom ToolBar");
		this.oSmartTable.setHeaderLevel("H3");
		assert.strictEqual(this.oSmartTable.getToolbar().getContent()[0].getLevel(), "H3", "Header level set to the Custom Toolbar");
	});

	QUnit.test("Header Style Property added", function(assert) {
		assert.strictEqual(this.oSmartTable.getToolbar().getContent()[0].getTitleStyle(), "H5", "Header style set to the header");
		this.oSmartTable.setHeaderStyle("H2");
		this.oSmartTable.setHeader("Test Table");
		assert.strictEqual(this.oSmartTable.getToolbar().getContent()[0].getTitleStyle(), "H2", "Header style changed");
		var oToolbar = new Toolbar();
		this.oSmartTable.setCustomToolbar(oToolbar);
		this.oSmartTable.setHeader("Custom ToolBar");
		this.oSmartTable.setHeaderStyle("H3");
		assert.strictEqual(this.oSmartTable.getToolbar().getContent()[0].getTitleStyle(), "H3", "Header style set to the Custom Toolbar");
		this.oSmartTable.setHeaderStyle(null);
		assert.strictEqual(this.oSmartTable.getToolbar().getContent()[0].getTitleStyle(), "H5", "Header style set to the header");
	});

	QUnit.test("Header Style & Level synced with VariantManagement", async function(assert) {
		const fnCheck = (sHeaderLevel, sHeaderStyle) => {
			assert.ok(this.oSmartTable._headerText, "Title exists");
			assert.equal(this.oSmartTable._headerText.getLevel(), sHeaderLevel, "Header Level is synced to header");
			assert.equal(this.oSmartTable._headerText.getTitleStyle(), sHeaderStyle, "Header Style is synced to header");

			assert.ok(this.oSmartTable._oVariantManagement, "Variant Management exists");
			assert.equal(this.oSmartTable._oVariantManagement.getHeaderLevel(), sHeaderLevel, "Header Level is synced to VM");
			assert.equal(this.oSmartTable._oVariantManagement.getTitleStyle(), sHeaderStyle, "Header Style is synced to VM");
		};

		this.oSmartTable = new SmartTable({
			persistencyKey: "Table_Key",
			useVariantManagement: true,
			useTablePersonalisation: true,
			header: "My Header",
			headerStyle: "H2",
			headerLevel: "H3"
		});
		this.oSmartTable.setEntitySet("foo");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));
		var oTableProviderStub = sinon.stub(TableProvider.prototype, "getTableViewMetadata");
		oTableProviderStub.callsFake(function () {
			return [{name: "PropA"}];
		});
		this.oSmartTable._onMetadataInitialised();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		fnCheck("H3", "H2");

		this.oSmartTable.setHeaderStyle("H1");
		this.oSmartTable.setHeaderLevel("H4");

		fnCheck("H4", "H1");

		this.oSmartTable.setHeaderStyle();
		this.oSmartTable.setHeaderLevel();

		fnCheck("Auto", TitleLevel[ThemeParameters.get({name: "_sap_ui_comp_SmartTable_HeaderStyle"})]);

		oTableProviderStub.restore();
	});

	QUnit.test("VM is shown correctly if no header", async function(assert) {
		this.oSmartTable = new SmartTable({
			persistencyKey: "Table_Key",
			useVariantManagement: true,
			useTablePersonalisation: true,
			headerStyle: "H2",
			headerLevel: "H3"
		});
		this.oSmartTable.setEntitySet("foo");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));
		var oTableProviderStub = sinon.stub(TableProvider.prototype, "getTableViewMetadata");
		oTableProviderStub.callsFake(function () {
			return [{name: "PropA"}];
		});
		this.oSmartTable._onMetadataInitialised();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		assert.ok(this.oSmartTable._oVariantManagement, "Variant Management exists");
		assert.equal(this.oSmartTable._oVariantManagement.getHeaderLevel(), "H3", "Header Level is synced to VM");
		assert.equal(this.oSmartTable._oVariantManagement.getTitleStyle(), "H2", "Header Style is synced to VM");
		assert.notOk(this.oSmartTable._oVariantManagement.getShowAsText(), "VM is not shown as text");

		this.oSmartTable.setHeader("My Header");
		assert.ok(this.oSmartTable._oVariantManagement.getShowAsText(), "VM is shown as text");

		oTableProviderStub.restore();
	});

	QUnit.test("Header Style & Level is not synced if custom VM is set", async function(assert) {
		const oVariantManagement = new SmartVariantManagement({
			id: "myVariant",
			persistencyKey: "VM_Key",
			headerLevel: "H1",
			titleStyle: "H1"
		});

		this.oSmartTable = new SmartTable({
			useVariantManagement: true,
			useTablePersonalisation: true,
			persistencyKey: "Table_Key",
			header: "My Header",
			headerStyle: "H2",
			headerLevel: "H3",
			smartVariant: oVariantManagement.getId()
		});

		this.oSmartTable.setEntitySet("foo");
		this.oSmartTable.setModel(getModelStubInstance(ODataModel));
		var oTableProviderStub = sinon.stub(TableProvider.prototype, "getTableViewMetadata");
		oTableProviderStub.callsFake(function () {
			return [{name: "PropA"}];
		});
		this.oSmartTable._onMetadataInitialised();

		const oPage = new DynamicPage({
			content: new VBox({
				items: [oVariantManagement, this.oSmartTable]
			}),
			fitContent: true
		});
		oPage.placeAt("qunit-fixture");

		await nextUIUpdate();


		assert.ok(this.oSmartTable.getVariantManagement(), "Variant Management exists");
		assert.equal(this.oSmartTable._oVariantManagement.getHeaderLevel(), "H1", "Header Level is not synced to VM");
		assert.equal(this.oSmartTable._oVariantManagement.getTitleStyle(), "H1", "Header Style is not synced to VM");
		assert.notOk(this.oSmartTable._oVariantManagement.getShowAsText(), "VM is not shown as text");

		oTableProviderStub.restore();

		oVariantManagement.destroy();
		oPage.destroy();
	});

	QUnit.module("SmartTable - Accessibility");

	QUnit.test("ACC Announcement of table after a FilterBar search", async function(assert) {
		var oSmartFilterBar = new SmartFilterBar();

		var oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			demandPopin: true,
			showDetailsButton: true,
			tableBindingPath: "/testPath",
			smartFilterId: oSmartFilterBar.getId()
		});

		oSmartTable._oTable.addColumn(new Column({
			header: new Text({
				text: "Name"
			}),
			hAlign: "Begin",
			importance: "High"
		}).data("p13nData", {
			columnKey: "name",
			leadingProperty: "name",
			edmType: "Edm.String",
			type: "string"
		}));

		var oModel = new JSONModel();
		oModel.setData({
			testPath: [
				{"name": "A"},
				{"name": "B"},
				{"name": "C"},
				{"name": "D"},
				{"name": "A"}
			]
		});

		var fnUpdateTableAnnouncement = sinon.spy(TableUtil, "announceTableUpdate");
		oSmartTable.setModel(oModel);
		oSmartTable._createTable();
		oSmartTable._createToolbarContent();
		oSmartTable._oTemplate = new ColumnListItem({
			cells: [
				new Text({
					text: "{name}"
				})
			]
		});
		oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		oSmartFilterBar.search();
		await timeout(10);

		assert.ok(fnUpdateTableAnnouncement.calledOnce, "Search triggered. Function announceTableUpdate is called once.");
		oSmartTable.destroy();
	});

	QUnit.module("SmartTable - UI Adaptation", {
		beforeEach: function() {
			this.oSmartTable = new SmartTable({
				persistencyKey: "Table_Key",
				useVariantManagement: true,
				useTablePersonalisation: true
			});
		},
		afterEach: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("UI Adaptation - call Settings dialog", function(assert) {

		var done = assert.async();

		var oFakeData = {filter: {}};

		var fDialogOpen = null;
		var oDialogOpenPromise = new Promise(function(resolve) {
			fDialogOpen = resolve;
		});

		var fCallBackExecuted = null;
		var oCallbackPromise = new Promise(function(resolve) {
			fCallBackExecuted = resolve;
		});

		var fCallback = function(aChanges) {

			assert.ok(aChanges);
			assert.ok(aChanges.length === 1);

			assert.ok(aChanges[0].changeSpecificData);

			assert.ok(aChanges[0].changeSpecificData.content);
			assert.equal(aChanges[0].changeSpecificData.content.persistencyKey, this.oSmartTable.getPersistencyKey());

			assert.ok(aChanges[0].changeSpecificData.content.content);
			assert.deepEqual(aChanges[0].changeSpecificData.content.content, oFakeData);

			fCallBackExecuted();

		}.bind(this);

		//create variant management control
		assert.ok(!this.oSmartTable._oVariantManagement);
		this.oSmartTable._createVariantManagementControl();
		assert.ok(this.oSmartTable._oVariantManagement);

		//create the perso controller
		//mock initial 'setting' for Controller
		this.oSmartTable._oP13nDialogSettings = {
			filter: {
				visible: false
			}
		};
		assert.ok(!this.oSmartTable._oPersController);
		this.oSmartTable._createPersonalizationController();
		assert.ok(this.oSmartTable._oPersController);

		this.oSmartTable._oPersController.openDialog = function() {
			return Promise.resolve({
				getParent: function() { return {}; },
				getCustomHeader: function() { return {}; }
			});
		};

		this.oSmartTable._oPersController.attachDialogAfterOpen(function() {
			fDialogOpen();
		});

		var oTable = this.oSmartTable.getTable();
		this.oSmartTable._oPersController.getTable = function () {
			return oTable;
		};

		//overwrite the perso's inner method
		this.oSmartTable._oPersController._fireChangeEvent = function() {

			var oObj = {
				persistentData : oFakeData,
				runtimeDeltaDataChangeType: {}
			};

			this.fireAfterP13nModelDataChange(oObj);
		};

		var fnAddRtaButtonSpy = sinon.spy(P13nBuilder, "addRTACustomFieldButton");
		//open dialog
		assert.ok(!this.oSmartTable._oPersController._oDialog);
		this.oSmartTable.openDialogForKeyUser("STYLECLASS", fCallback).then(function () {
			assert.equal(fnAddRtaButtonSpy.callCount, 1, "addRTACustomFieldButton method called");
			done();
		});


		// wait till settings dialog open method is called
		oDialogOpenPromise.then(function() {
			//once dialog is opened, simulate trigger 'press OK'
			this.oSmartTable._oPersController._handleDialogOk();

			return oCallbackPromise;
		}.bind(this));

	});

	QUnit.module("p13nDialogSettings", {
		beforeEach: function() {
			this.oSmartTable = new SmartTable({
				entitySet: "COMPANYSet",
				initiallyVisibleFields: "foo,bar"
			});
		},
		afterEach: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("allow changes if personalization controller is not created", function(assert) {
		var done = assert.async();
		assert.notOk(this.oSmartTable.isInitialised(), "SmartTable is not initialized");
		assert.ok(this.oSmartTable._bIsFilterPanelEnabled, "p13n Filter panel enabled");
		assert.ok(this.oSmartTable._bIsSortPanelEnabled, "p13n Sort panel enabled");

		this.oSmartTable.data("p13nDialogSettings", {filter:{visible:false}});

		this.oSmartTable.attachEventOnce("initialise", function(oEvent) {
			var oSmartTable = oEvent.getSource();
			assert.notOk(oSmartTable._bIsFilterPanelEnabled, "p13n Filter panel disabled");

			done();
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
	});

	QUnit.test("check customFilter event registration", function(assert) {
		var done = assert.async();

		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "AnalyticalTable"
		});

		assert.ok(Object.keys(this.oSmartTable._oTable.mEventRegistry).indexOf("customFilter") > -1, "customFilter event is attached, since p13nFilterPanel is enabled");

		this.oSmartTable.data("p13nDialogSettings", {filter:{visible:false}});

		this.oSmartTable.attachEventOnce("initialise", function(oEvent) {
			var oSmartTable = oEvent.getSource();
			assert.strictEqual(Object.keys(oSmartTable._oTable.mEventRegistry).indexOf("customFilter"), -1, "customFilter event is detached, since p13n Filter panel disabled");

			done();
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
	});

	QUnit.test("quick actions", async function(assert) {
		this.oSmartTable.destroy();

		var oColumn1 = new Column({
			header: new Text({
				text: "Prop A"
			}),
			hAlign: "Begin"
		}).data("p13nData", {
			columnKey: "PropA",
			leadingProperty: "PropA",
			edmType: "Edm.String",
			description: "PropC",
			type: undefined
		});

		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			useVariantManagement: false,
			useTablePersonalisation: true,
			enableExport: false
		});

		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable.getTable().addColumn(oColumn1);
		this.oSmartTable.placeAt("qunit-fixture");
		this.oSmartTable._createTable();
		await nextUIUpdate();

		this.oSmartTable._oPersController = {
			preparePersonalization: function() {
			},
			getColumnMap: function () {
				return {
					"PropA": oColumn1
				};
			}
		};

		var oColumnMenu = this.oSmartTable._oColumnHeaderPopover;
		oColumnMenu.openBy(oColumn1);
		var oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		var aQuickActions = oQuickActionContainer.getQuickActions();
		assert.ok(aQuickActions.length === 2 && aQuickActions[0].isA("sap.m.table.columnmenu.QuickSort") && aQuickActions[1].isA("sap.m.table.columnmenu.QuickGroup"),
				"The ColumnMenu contains quick sort and quick group");
		oColumnMenu.close();

		this.oSmartTable.data("p13nDialogSettings", {sort:{visible:false},group:{visible:false}});
		this.oSmartTable._updateP13nDialogSettings();

		await timeout(500);
		oColumnMenu.openBy(oColumn1);
		oQuickActionContainer = oColumnMenu.getAggregation("_quickActions")[0];
		assert.ok(oQuickActionContainer.getQuickActions().length === 0, "The ColumnMenu does not contain quick actions");
	});

	QUnit.module("customData");

	QUnit.test("preserveDecimals", function(assert) {
		// SmartTable without preserveDecimals custom data
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar"
		});
		oSmartTable._createTableProvider();
		assert.strictEqual(oSmartTable.data("preserveDecimals"), null, "preserveDecimals not defined");
		assert.ok(oSmartTable._bPreserveDecimals, "defualt value is 'true' if not defined");
		oSmartTable.destroy();

		// SmartTable with preserveDecimals=true as boolean
		var oSmartTable2 = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			customData: new CustomData({
				key: "preserveDecimals",
				value: true
			})
		});
		oSmartTable2._createTableProvider();
		assert.strictEqual(oSmartTable2.data("preserveDecimals"), true, "preserveDecimals defined as 'true'");
		assert.ok(oSmartTable2._bPreserveDecimals, "'true' is set, as expected");
		oSmartTable2.destroy();

		// SmartTable with preserveDecimals=false as boolean
		var oSmartTable3 = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			customData: new CustomData({
				key: "preserveDecimals",
				value: false
			})
		});
		oSmartTable3._createTableProvider();
		assert.strictEqual(oSmartTable3.data("preserveDecimals"), false, "preserveDecimals defined as 'false'");
		assert.notOk(oSmartTable3._bPreserveDecimals, "'false' is set, as expected");
		oSmartTable3.destroy();

		// SmartTable with preserveDecimals="true" as string
		var oSmartTable4 = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			customData: new CustomData({
				key: "preserveDecimals",
				value: "true"
			})
		});
		oSmartTable4._createTableProvider();
		assert.strictEqual(oSmartTable4.data("preserveDecimals"), "true", "preserveDecimals defined as 'true' as string");
		assert.ok(oSmartTable4._bPreserveDecimals, "'true' (boolean) is set, as expected");
		oSmartTable4.destroy();

		// SmartTable with preserveDecimals="false" as string
		var oSmartTable5 = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			customData: new CustomData({
				key: "preserveDecimals",
				value: "false"
			})
		});
		oSmartTable5._createTableProvider();
		assert.strictEqual(oSmartTable5.data("preserveDecimals"), "false", "preserveDecimals defined as 'false' as string");
		assert.notOk(oSmartTable5._bPreserveDecimals, "'false' (boolean) is set, as expected");
		oSmartTable5.destroy();

		// SmartTable with preserveDecimals="foo" as string
		var oSmartTable6 = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			customData: new CustomData({
				key: "preserveDecimals",
				value: "foo"
			})
		});
		oSmartTable6._createTableProvider();
		assert.strictEqual(oSmartTable6.data("preserveDecimals"), "foo", "preserveDecimals defined as 'foo' as string");
		assert.ok(oSmartTable6._bPreserveDecimals, "'true' (boolean) is set, as expected");
		oSmartTable6.destroy();
	});

	QUnit.module("uiStateChange event", {
		beforeEach: function() {
			if (this.oSmartTable) {
				this.oSmartTable.destroy();
			}

			var oModel = getModelStubInstance(ODataModel),
				oColumn = new Column({
				header: new Text({
						text: "Prop A"
					}),
					hAlign: "Begin"
				}).data("p13nData", {
					columnKey: "PropA",
					leadingProperty: "PropA",
					edmType: "Edm.DateTime",
					type: undefined
				}),
				oTable = new Table({
					columns: [
						oColumn
					]
				});

			this.oSmartTable = new SmartTable({
				entitySet: "COMPANYSet",
				initiallyVisibleFields: "foo,bar",
				items: [oTable]
			});
			this.fnFireUiStateChangeSpy = sinon.spy(this.oSmartTable, "fireUiStateChange");
			this.oSmartTable.setModel(oModel);
		},
		afterEach: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("Changes via Table Personalization", function(assert) {
		assert.ok(this.oSmartTable._oPersController, "Perso Controller found");
		this.oSmartTable._oPersController.addToSettingIgnoreColumnKeys(["PropA"]);
		assert.ok(this.fnFireUiStateChangeSpy.calledOnce, "uiStateChange event called once");
	});

	QUnit.test("Changes via setUiState method", function(assert) {
		var oUiState = this.oSmartTable.getUiState(),
			oPresentationVariant = oUiState.getPresentationVariant();

		oPresentationVariant.SortOrder = [{
			Property: "bar",
			Descending: false
		}];

		oUiState.setPresentationVariant(oPresentationVariant);
		this.oSmartTable.setUiState(oUiState);

		assert.strictEqual(this.fnFireUiStateChangeSpy.callCount, 1, "uiStateChange event called once");
	});

	QUnit.module("Event");

	QUnit.test('beforeExport - Support prevent default', function(assert) {
		const done = assert.async();
		const oTable = new SmartTable({
			useVariantManagement: false,
			useTablePersonalisation: false
		});

		oTable._oTableProvider = { getExportCapabilities: sinon.stub() };

		sinon.stub(oTable, "_getColumnByKey");
		sinon.stub(oTable, "_getColumnFromP13nMap");
		sinon.stub(oTable, "_createExportColumnConfiguration").returns([{ property: "CompanyCode" }]);
		sinon.stub(oTable, "_getColumnLabel");

		oTable.attachBeforeExport((oEvent) => {
			oEvent.preventDefault();
		});

		const fnExportStub = sinon.stub(ExportHandler.prototype, "export").callsFake(() => {
			/*
			 * Fire event from ExportHandler to check whether the SmartTable handles
			 * this event and forwards the preventDefault from its own event to the
			 * ExportHandler event.
			 */
			const bExecuteDefaultAction = oTable._oExportHandler.fireEvent("beforeExport", {
				exportSettings: {},
				filterSettings: [],
				userSettings: {}
			}, true, false);

			assert.equal(typeof bExecuteDefaultAction, "boolean", "Event should return a boolean whether to execute the default action");
			assert.notOk(bExecuteDefaultAction, "Default action should be prevented");

			oTable._getColumnByKey.restore();
			oTable._getColumnFromP13nMap.restore();
			oTable._createExportColumnConfiguration.restore();
			oTable._getColumnLabel.restore();
			fnExportStub.restore();
			oTable.destroy();
			done();
		});

		oTable._triggerUI5ClientExport(false /* bExportAs */);
	});

	QUnit.test("beforeInitialise - No firing event and no validation if no event listener attached", function(assert) {
		var oModel = getModelStubInstance(ODataModel);
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "Table"
		});

		var fnValidateControlConfig = sinon.spy(oSmartTable, "_validateControlConfig");
		oSmartTable.setModel(oModel);
		assert.notOk(oSmartTable.hasListeners("beforeInitialise"), "No event listener attached");
		assert.notOk(fnValidateControlConfig.called, "_validateControlConfig not called");
	});

	QUnit.test("beforeInitialise - Event fired and validation executed", function(assert) {
		var done = assert.async();
		var oModel = getModelStubInstance(ODataModel);
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "Table"
		});

		var fnValidateControlConfig = sinon.spy(oSmartTable, "_validateControlConfig");
		var iBeforeInitialiseCounter = 0;
		var onBeforeInitialise = function() {
			iBeforeInitialiseCounter++;
			assert.strictEqual(iBeforeInitialiseCounter, 1, "beforeInitialise event fired as expected");
			done();
		};
		oSmartTable.attachEvent("beforeInitialise", onBeforeInitialise);
		oSmartTable.setModel(oModel);
		assert.ok(fnValidateControlConfig.calledOnce, "_validateControlConfig not called");
	});

	QUnit.test("beforeInitialise - SmartTable items are altered", function(assert) {
		var oModel = getModelStubInstance(ODataModel);
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "Table"
		});
		var onBeforeInitialise = function(oEvent) {
			var oControl = oEvent.getSource();
			oControl.removeAllItems();
		};
		oSmartTable.attachEvent("beforeInitialise", onBeforeInitialise);
		assert.throws(function() {oSmartTable.setModel(oModel);}, /Internals of the SmartTable control changed via beforeInitialise event/, "error thrown for removal of internal items");
	});

	QUnit.test("beforeInitialise - Inner table removed", function(assert) {
		var oModel = getModelStubInstance(ODataModel);
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "Table"
		});
		// add some item to SmartTable
		oSmartTable.addItem(new Toolbar());
		var onBeforeInitialise = function(oEvent) {
			var oControl = oEvent.getSource();
			oControl.removeItem(oControl._oTable);
		};
		oSmartTable.attachEvent("beforeInitialise", onBeforeInitialise);
		assert.throws(function() {oSmartTable.setModel(oModel);}, /Inner Table removed via beforeInitialise event/, "error thrown for removal of inner table");
	});

	QUnit.test("beforeInitialise - Inner table was changed", function(assert) {
		var oModel = getModelStubInstance(ODataModel);
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "Table"
		});
		var onBeforeInitialise = function(oEvent) {
			var oControl = oEvent.getSource();
			oControl._oTable = new UITable();
			assert.ok(oControl._bInitialising, "_bInitialising=true");
		};
		oSmartTable.attachEvent("beforeInitialise", onBeforeInitialise);
		assert.throws(function() {oSmartTable.setModel(oModel);}, /Inner table changed via beforeInitialise event for SmartTable/, "error thrown for removal of inner table");
	});

	QUnit.test("beforeInitialise - Change entitySet", function(assert) {
		var oModel = getModelStubInstance(ODataModel);
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "ResponsiveTable"
		});
		var onBeforeInitialise = function(oEvent) {
			var oControl = oEvent.getSource();
			oControl.setEntitySet("Test");
		};
		oSmartTable.attachEventOnce("beforeInitialise", onBeforeInitialise);
		assert.throws(function() {oSmartTable.setModel(oModel);}, /entitySet changed while SmartTable control was initializing/, "error thrown for changing the entitySet");
	});

	QUnit.test("beforeInitialise - Change tableType", function(assert) {
		var oModel = getModelStubInstance(ODataModel);
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "ResponsiveTable"
		});
		var onBeforeInitialise = function(oEvent) {
			var oControl = oEvent.getSource();
			oControl.setTableType("Table");
		};
		oSmartTable.attachEventOnce("beforeInitialise", onBeforeInitialise);
		assert.throws(function() {oSmartTable.setModel(oModel);}, /tableType changed while SmartTable control was initializing/, "error thrown for removal of inner table");
	});

	QUnit.test("beforeInitialise - Change p13nData columnIndex for custom column", function(assert) {
		var done = assert.async();
		var oModel = getModelStubInstance(ODataModel);
		var oTestColumn = new Column({
			header: new Text({text: "Test"})
		}).data("p13nData", {
			columnKey: "test",
			leadingProperty: "text",
			columnIndex: "5"
		});
		var oColumn = new Column({
			header: new Text({text: "Test 2"})
		}).data("p13nData", {
			columnKey: "test2",
			leadingProperty: "text2",
			columnIndex: "1"
		});
		var oTable = new Table({
			columns: [oColumn, oTestColumn]
		});
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "ResponsiveTable",
			items: oTable
		});
		var onInitialise = function(oEvent) {
			var oControl = oEvent.getSource();
			var oColumnToTest = oControl._getColumnByKey("test");
			assert.strictEqual(oColumnToTest.data("p13nData").columnIndex, "0", "columnIndex updated");
			assert.strictEqual(oControl.getTable().indexOfColumn(oColumnToTest), 0, "Inner table contains the column at the updated index");
			done();
		};
		var onBeforeInitialise = function(oEvent) {
			var oControl = oEvent.getSource();
			var oColumnToTest = oControl._getColumnByKey("test");
			// make it the first column
			oColumnToTest.data("p13nData").columnIndex = "0";
			oControl.attachEventOnce("initialise", onInitialise);
		};
		oSmartTable.attachEventOnce("beforeInitialise", onBeforeInitialise);
		oSmartTable.setModel(oModel);
	});

	QUnit.test("afterRendering - ResizeObserver", async function(assert) {
		var done = assert.async();
		var oModel = getModelStubInstance(ODataModel);
		var oSmartTable = new SmartTable({
			entitySet: "COMPANYSet",
			initiallyVisibleFields: "foo,bar",
			tableType: "Table"
		});
		oSmartTable.setModel(oModel);
		var oPage = new DynamicPage({
			content: oSmartTable,
			fitContent: true
		});
		oPage.placeAt("qunit-fixture");
		await nextUIUpdate();

		assert.equal(oSmartTable.getDomRef().style.overflow, "hidden", "overflow is hidden");

		const observer = new MutationObserver(function(mutationList, observer) {
			for (const mutation of mutationList) {
				if (mutation.type === "attributes" && mutation.attributeName === "style") {
					assert.equal(oSmartTable.getDomRef().style.overflow, "", "overflow is empty");
					observer.disconnect();
					oPage.destroy();
					done();
				}
			}
		});
		observer.observe(oSmartTable.getDomRef(), {attributes: true});
		oPage.getDomRef().style.height = "200px";
	});

	QUnit.module("Editable", {
		beforeEach: function() {
			this.oSmartTable = new SmartTable({
				entitySet: "Foo",
				useTablePersonalisation: false,
				useVariantManagement: false
			});
		},
		afterEach: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("Shall have editTogglable property", function(assert) {
		this.oSmartTable.setEditTogglable(false);
		assert.ok(!this.oSmartTable.getEditTogglable());

		this.oSmartTable.setEditTogglable(true);
		assert.ok(this.oSmartTable.getEditTogglable());
	});

	QUnit.test("Shall propogate editable state change to internal model", function(assert) {
		this.oSmartTable._oEditModel = getModelStubInstance(JSONModel);
		assert.ok(!this.oSmartTable.getEditable());

		this.oSmartTable.setEditable(true);
		assert.ok(this.oSmartTable.getEditable());
		assert.ok(this.oSmartTable._oEditModel.setProperty.calledWithExactly("/editable", true));

		this.oSmartTable.setEditable(false);
		assert.ok(!this.oSmartTable.getEditable());
		assert.ok(this.oSmartTable._oEditModel.setProperty.calledWithExactly("/editable", false));
	});

	QUnit.test("Shall propagate editable property binding to internal model", function(assert) {
		var oExternalEditModel = new JSONModel({
			editable: false
		});
		this.oSmartTable._oEditModel = getModelStubInstance(JSONModel);
		// bind editable property of table
		this.oSmartTable.bindProperty("editable", "externalModel>/editable");
		this.oSmartTable.setModel(oExternalEditModel, "externalModel");

		assert.ok(!this.oSmartTable.getEditable());

		oExternalEditModel.setProperty("/editable", true);
		assert.ok(this.oSmartTable.getEditable());
		assert.ok(this.oSmartTable._oEditModel.setProperty.calledWithExactly("/editable", true));

		oExternalEditModel.setProperty("/editable", false);
		assert.ok(!this.oSmartTable.getEditable());
		assert.ok(this.oSmartTable._oEditModel.setProperty.calledWithExactly("/editable", false));

		oExternalEditModel.destroy();
	});

	QUnit.module("Show/Hide details", {
		beforeEach: function() {
			var aColumns = [
				new Column({
					header: new Text({
						text: "Column A"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnA",
					leadingProperty: "ColumnA",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column B"
					}),
					hAlign: "Begin",
					importance: "None"
				}).data("p13nData", {
					columnKey: "ColumnB",
					leadingProperty: "ColumnB",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column C"
					}),
					hAlign: "Begin",
					importance: "Medium"
				}).data("p13nData", {
					columnKey: "ColumnC",
					leadingProperty: "ColumnC",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column D"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnD",
					leadingProperty: "ColumnD",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column E"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnE",
					leadingProperty: "ColumnE",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column F"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnF",
					leadingProperty: "ColumnF",
					edmType: "Edm.String",
					type: "string"
				})
			];

			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				demandPopin: true,
				showDetailsButton: true,
				tableBindingPath: "/testPath",
				beforeRebindTable: function(oEvent) {
					var mBindingParams = oEvent.getParameter("bindingParams");
					mBindingParams.parameters.select = "Foo";
				}
			});

			var oModel = new JSONModel();
			oModel.setData({
				testPath: [
					{test: "Test1"}, {test: "Test2"}, {test: "Test3"}, {test: "Test4"}, {test: "Test5"}
				]
			});
			this.oSmartTable.setModel(oModel);

			aColumns.forEach(function(oColumn) {
				this.oSmartTable._oTable.addColumn(oColumn);
			}.bind(this));

			this.oSmartTable._oTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					})
				]
			});
		},
		afterEach: function() {
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("test showDetailsButton mapping for ResponsiveTable", async function(assert) {
		this.oSmartTable._createTable();
		this.oSmartTable._createToolbarContent();
		this.oSmartTable.rebindTable();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();
		var oResourceBundle = Library.getResourceBundleFor("sap.ui.comp");

		assert.ok(this.oSmartTable.getShowDetailsButton(), "showDetailsButton=true");
		assert.notOk(this.oSmartTable._oShowHideDetailsButton.getVisible(), "All columns are visible. Button 'Show / Hide Details' is hidden");

		this.oSmartTable._oTable.setContextualWidth("Phone");
		await nextUIUpdate();
		assert.ok(this.oSmartTable._oShowHideDetailsButton.getVisible(), "Button 'Show / Hide Details' is visible");
		assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getItems()[0].getIcon(), "sap-icon://detail-more", "Button Icon='sap-icon://detail-more'");
		assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getItems()[0].getTooltip(), oResourceBundle.getText("TABLE_SHOWDETAILS_TEXT"), "Correct tooltip");

		assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getItems()[1].getIcon(), "sap-icon://detail-less", "Button Icon='sap-icon://detail-less'");
		assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getItems()[1].getTooltip(), oResourceBundle.getText("TABLE_HIDEDETAILS_TEXT"), "Correct tooltip");
		assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getSelectedKey(), "hideDetails", "hideDetails button selected");
		assert.strictEqual(this.oSmartTable._oTable.getHiddenInPopin()[0], "Low", "ResponsiveTable property hiddenInPopin=['Low']");

		this.oSmartTable._oShowHideDetailsButton.getItems()[0].firePress();
		await nextUIUpdate();
		assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getSelectedKey(), "showDetails", "showDetails button selected");
		assert.strictEqual(this.oSmartTable._oTable.getHiddenInPopin().length,0, "ResponsiveTable property hiddenInPopin=[]");

		this.oSmartTable._oShowHideDetailsButton.getItems()[1].firePress();
		await nextUIUpdate();
		assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getSelectedKey(), "hideDetails", "hideDetails button selected");
		assert.strictEqual(this.oSmartTable._oTable.getHiddenInPopin()[0], "Low", "ResponsiveTable property hiddenInPopin=['Low']");

		this.oSmartTable._oShowHideDetailsButton.getItems()[0].firePress();
		await nextUIUpdate();
		assert.strictEqual(this.oSmartTable.getShowDetails(), true, "showDetails=true");
		assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getSelectedKey(), "showDetails", "showDetails button selected");
		assert.strictEqual(this.oSmartTable._oTable.getHiddenInPopin().length,0, "ResponsiveTable property hiddenInPopin=[]");

		this.oSmartTable._createToolbarContent();
		await nextUIUpdate();
		assert.strictEqual(this.oSmartTable.getShowDetails(), true, "showDetails=true, existing value used when toolbar content is recreated");
		assert.strictEqual(this.oSmartTable._oTable.getHiddenInPopin().length,0, "ResponsiveTable property hiddenInPopin=[]");

		this.oSmartTable.destroy();
		assert.notOk(this.oSmartTable._oShowHideDetailsButton, "_oShowHideDetailsButton destroyed after exit");
	});

	QUnit.test("test showDetailsButton visibility when no data", function(assert) {
		var done = assert.async();

		const oTable = this.oSmartTable;

		assert.expect(3);
		this.oSmartTable._createTable();
		this.oSmartTable._createToolbarContent();
		this.oSmartTable.rebindTable();
		this.oSmartTable.placeAt("qunit-fixture");

		nextUIUpdate().then(() => {
			const clock = sinon.useFakeTimers();
			const oInnerTable = oTable.getTable();

			oInnerTable.attachEventOnce("popinChanged", function() {
				assert.ok(oTable._oShowHideDetailsButton.getVisible(), "button is visible since table has popins");

				oInnerTable.attachEventOnce("popinChanged", function() {
					assert.notOk(oTable._oShowHideDetailsButton.getVisible(), "button is hidden since there are no visible items");

					oInnerTable.attachEventOnce("popinChanged", function() {
						assert.ok(oTable._oShowHideDetailsButton.getVisible(), "button is visible since items are visible and popins are available");
						clock.restore();
						done();
					}, this);

					oTable._getRowBinding().filter();
					clock.tick(1);
				}, this);

				oTable._getRowBinding().filter(new Filter("test", "EQ", "Foo"));
				clock.tick(1);
			}, this);

			oInnerTable.setContextualWidth("Phone");
			clock.tick(1);
		});
	});

	QUnit.test("test showDetailsButton mapping for ResponsiveTable on phone", async function(assert) {
		// save original state
		var bDesktop = Device.system.desktop;
		var bTablet = Device.system.tablet;
		var bPhone = Device.system.phone;

		function _applyDeviceSystemInfo(desktop, tablet, phone) {
			Device.system.desktop = desktop;
			Device.system.tablet = tablet;
			Device.system.phone = phone;
		}

		// overwrite for our test case
		_applyDeviceSystemInfo(false, false, true);

		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			demandPopin: true,
			showDetailsButton: true
		});
		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);
		this.oSmartTable._createTable();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		var aImportance = this.oSmartTable._oTable.getHiddenInPopin();
		assert.strictEqual(aImportance.length, 2, "ResponsiveTable property hiddenInPopin.length = 2");
		assert.strictEqual(aImportance[0], "Low", "ResponsiveTable property hiddenInPopin[0] = 'Low'");
		assert.strictEqual(aImportance[1], "Medium", "ResponsiveTable property hiddenInPopin[1] = 'Medium'");

		// reset original state
		_applyDeviceSystemInfo(bDesktop, bTablet, bPhone);
	});

	QUnit.test("test detailsButtonSetting - overwrite default configuration of showDetailsButton", async function(assert) {
		// save original state
		var bDesktop = Device.system.desktop;
		var bTablet = Device.system.tablet;
		var bPhone = Device.system.phone;

		function _applyDeviceSystemInfo(desktop, tablet, phone) {
			Device.system.desktop = desktop;
			Device.system.tablet = tablet;
			Device.system.phone = phone;
		}

		// overwrite for our test case
		_applyDeviceSystemInfo(false, false, true);

		this.oSmartTable.destroy();
		this.oSmartTable = new SmartTable({
			entitySet: "foo",
			tableType: "ResponsiveTable",
			demandPopin: true,
			showDetailsButton: true,
			detailsButtonSetting: ["Medium","High"]
		});
		var oModel = getModelStubInstance(ODataModel);
		this.oSmartTable.setModel(oModel);

		this.oSmartTable._createTable();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		var aImportance = this.oSmartTable._oTable.getHiddenInPopin();
		assert.strictEqual(aImportance.length, 2, "ResponsiveTable property hiddenInPopin.length = 2");
		assert.notEqual(aImportance[0], "Low", "Default importance 'Low' is overwritten");
		assert.notEqual(aImportance[1], "Medium", "Default importance 'Medium' is overwritten");
		assert.strictEqual(aImportance[0], "Medium", "ResponsiveTable property hiddenInPopin[0] = 'Medium'");
		assert.strictEqual(aImportance[1], "High", "ResponsiveTable property hiddenInPopin[1] = 'High'");

		// reset original state
		_applyDeviceSystemInfo(bDesktop, bTablet, bPhone);
	});

	QUnit.test("Show hide details button should be hidden when hidden columns are removed from the table", async function(assert) {
		this.oSmartTable._createTable();
		this.oSmartTable._createToolbarContent();
		this.oSmartTable.rebindTable();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		this.oSmartTable._oTable.setContextualWidth("300px");

		await timeout(10);

		assert.strictEqual(this.oSmartTable._getImportanceToHide().length, 1);
		assert.ok(this.oSmartTable._getImportanceToHide().indexOf("Low") > -1, "Correct importance to hide returned");
		assert.ok(this.oSmartTable._oShowHideDetailsButton.getVisible(), "Show/Hide details button is visible");
		this.oSmartTable._oShowHideDetailsButton.getItems()[0].firePress();
		await nextUIUpdate();

		assert.ok(this.oSmartTable.getShowDetails(), "Hide Details setting are applied");

		var aColumns = this.oSmartTable.getTable().getColumns();
		var aLowImpCols = aColumns.filter(function(oCol) {
			return oCol.getImportance() == "Low";
		});

		aLowImpCols.forEach(function(oCol) {
			oCol.setVisible(false);
		});
		await nextUIUpdate();

		assert.notOk(this.oSmartTable._oShowHideDetailsButton.getVisible(), "Show/Hide details button is hidden, since the potential hidden in popin columns are not visible in the table");

		aLowImpCols.forEach(function(oCol) {
			oCol.setVisible(true);
		});
		await nextUIUpdate();

		assert.ok(this.oSmartTable._oShowHideDetailsButton.getVisible(), "Show/Hide details button is visible, since the potential hidden in popin columns are visible in the table");
	});

	QUnit.test("ShowDetails changes its state when new columns are added", async function(assert) {
		var done = assert.async(),
			clock = sinon.useFakeTimers();

		assert.expect(3);
		this.oSmartTable._createTable();
		this.oSmartTable._createToolbarContent();
		this.oSmartTable.rebindTable();
		this.oSmartTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		this.oSmartTable._oTable.attachEventOnce("popinChanged", function() {
			assert.ok(this.oSmartTable._oShowHideDetailsButton.getVisible(), "button is visible since table has popins");
			var oTableChangedEvent = new Event('afterP13nModelDataChange', this.oSmartTable._oPersController, {
				runtimeDeltaDataChangeType : {
					"columns": "ModelChanged",
					"sort": "Unchanged",
					"filter": "Unchanged",
					"group": "Unchanged"
				},
				runtimeDeltaData: {
					"columns": {
						"columnsItems": [
							{
								"columnKey": "ColumnA",
								"visible": true
							},
							{
								"columnKey": "ColumnB",
								"index": 2
							},
							{
								"columnKey": "ColumnC",
								"index": 3
							},
							{
								"columnKey": "ColumnD",
								"index": 4
							},
							{
								"columnKey": "ColumnE",
								"index": 6
							},
							{
								"columnKey": "ColumnF",
								"index": 5
							}
						]
					}
				}
			});
			this.oSmartTable._personalisationModelDataChange(oTableChangedEvent);
			assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getSelectedKey(), "hideDetails", "The showDetails button is in compact state when columns with high importance are added");

			oTableChangedEvent = new Event('afterP13nModelDataChange', this.oSmartTable._oPersController, {
				runtimeDeltaDataChangeType : {
					"columns": "ModelChanged",
					"sort": "Unchanged",
					"filter": "Unchanged",
					"group": "Unchanged"
				},
				runtimeDeltaData: {
					"columns": {
						"columnsItems": [
							{
								"columnKey": "ColumnA",
								"index": 1
							},
							{
								"columnKey": "ColumnB",
								"index": 2
							},
							{
								"columnKey": "ColumnC",
								"index": 3
							},
							{
								"columnKey": "ColumnD",
								"index": 4
							},
							{
								"columnKey": "ColumnE",
								"visible": true
							},
							{
								"columnKey": "ColumnF",
								"index": 5
							}
						]
					}
				}
			});
			this.oSmartTable._personalisationModelDataChange(oTableChangedEvent);
			assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getSelectedKey(), "showDetails", "The showDetails button is in expanded state when new columns are added");
			clock.restore();
			done();
		}, this);

		this.oSmartTable._oTable.setContextualWidth("Phone");
		clock.tick(1);
	});

	QUnit.module("Theming", {
		before: function() {
			this.sDefaultTheme = Theming.getTheme();
		},
		beforeEach: function() {
			this.oSmartTable = new SmartTable({
				useVariantManagement: false,
				useTablePersonalisation: false
			});
			this.oSmartTable._createToolbarContent();
		},
		afterEach: function() {
			this.oSmartTable.destroy();
		},
		after: async function() {
			await this.applyTheme(this.sDefaultTheme);
		},
		applyTheme: async function(sTheme) {
			const oThemeApplied = new Deferred();
			const fnThemeApplied = function() {
				Theming.detachApplied(fnThemeApplied);
				oThemeApplied.resolve();
			};

			Theming.setTheme(sTheme);
			Theming.attachApplied(fnThemeApplied);

			await oThemeApplied.promise;
		}
	});

	for (const sTheme of [
		"sap_horizon",
		"sap_horizon_dark",
		"sap_horizon_hcb",
		"sap_horizon_hcw",
		"sap_fiori_3",
		/** @deprecated As of version 1.120 */
		"sap_belize"
	]) {
		QUnit.test(sTheme + "; Export button", async function(assert) {
			let sExpectedButtontype;

			switch (sTheme) {
				case "sap_horizon":
				case "sap_horizon_dark":
				case "sap_horizon_hcw":
				case "sap_horizon_hcb":
					sExpectedButtontype = ButtonType.Transparent;
					break;
				default:
					sExpectedButtontype = ButtonType.Ghost;
			}

			await this.applyTheme(sTheme);
			assert.deepEqual(this.oSmartTable._oExportButton.getType(), sExpectedButtontype, "buttonType property");
		});

		QUnit.test(sTheme + "; Toolbar", async function(assert) {
			let sExpectedDesigntype;

			switch (sTheme) {
				case "sap_horizon":
				case "sap_horizon_dark":
				case "sap_horizon_hcw":
				case "sap_horizon_hcb":
					sExpectedDesigntype = ToolbarDesign.Solid;
					break;
				default:
					sExpectedDesigntype = ToolbarDesign.Transparent;
			}

			await this.applyTheme(sTheme);
			assert.deepEqual(this.oSmartTable._oToolbar.getDesign(), sExpectedDesigntype, "design property");
		});

		QUnit.test(sTheme + "; Title", async function(assert) {
			let sExpectedTitleLevel;

			switch (sTheme) {
				case "sap_horizon":
				case "sap_horizon_dark":
				case "sap_horizon_hcw":
				case "sap_horizon_hcb":
					sExpectedTitleLevel = "H5";
					break;
				default:
					sExpectedTitleLevel = "H4";
			}
			await this.applyTheme(sTheme);
			assert.deepEqual(this.oSmartTable._headerText.getTitleStyle(), sExpectedTitleLevel, "titleStyle property");
		});
	}
});

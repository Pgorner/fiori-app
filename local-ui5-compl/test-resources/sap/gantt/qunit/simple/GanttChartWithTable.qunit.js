/*global QUnit,sinon */

sap.ui.define([
	"sap/gantt/library",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/axistime/AxisTimeStrategyBase",
	"sap/gantt/axistime/FullScreenStrategy",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/misc/Format",
	"sap/ui/table/library",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Table",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/shapes/Task",
	"sap/m/OverflowToolbar",
	"sap/m/OverflowToolbarLayoutData",
	"sap/m/OverflowToolbarButton",
	'sap/ui/export/ExportUtils',
	'sap/base/util/deepEqual',
	"sap/ui/Device",
	"sap/ui/table/Column",
	"sap/m/Panel",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/TimeInterval",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/misc/Utility",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseConditionalShape",
	"sap/gantt/simple/BaseDiamond",
	"sap/gantt/simple/BaseTriangle",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/AggregationUtils",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/base/Event",
	"sap/gantt/misc/AxisTime",
	"sap/gantt/simple/UtilizationBarChart",
	"sap/gantt/config/Locale",
	"sap/ui/core/theming/Parameters",
	"sap/gantt/simple/GanttRowAction",
	"sap/m/Label",
	"sap/gantt/def/SvgDefs",
	"sap/gantt/simple/FindAndSelectUtils",
	"sap/gantt/simple/DeltaLine",
	"sap/gantt/simple/RenderUtils",
	"sap/gantt/utils/GanttChartConfigurationUtils",
	"sap/ui/table/rowmodes/Fixed",
	"sap/ui/table/rowmodes/Auto",
	"sap/gantt/simple/AdhocLine",
	"sap/ui/core/Element",
	"sap/ui/core/Lib",
	"sap/ui/core/RenderManager",
	"sap/gantt/simple/test/nextUIUpdate",
	"sap/ui/model/ChangeReason",
	"sap/base/util/values"
],  function (
	library,
	GanttChartContainer,
	ContainerToolbar,
	AxisTimeStrategyBase,
	FullScreenStrategy,
	ProportionZoomStrategy,
	StepwiseZoomStrategy,
	TimeHorizon,
	Format,
	tableLibrary,
	TreeTable,
	Table,
	GanttChartWithTable,
	BaseCalendar,
	BaseRectangle,
	BaseText,
	GanttUtils,
	GanttQUnitUtils,
	Task,
	OverflowToolbar,
	OverflowToolbarLayoutData,
	OverflowToolbarButton,
	ExportUtils,
	deepEqual,
	Device,
	Column,
	Panel,
	JSONModel,
	BaseChevron,
	CalendarDefs,
	Calendar,
	TimeInterval,
	GanttRowSettings,
	Utility,
	BaseGroup,
	BaseConditionalShape,
	BaseDiamond,
	BaseTriangle,
	Relationship,
	AggregationUtils,
	qutils,
	Event,
	AxisTime,
	UtilizationBarChart,
	Locale,
	Parameters,
	GanttRowAction,
	Label,
	SvgDefs,
	FindAndSelectUtils,
	DeltaLine,
	RenderUtils,
	GanttChartConfigurationUtils,
	FixedRowMode,
	AutoRowMode,
	AdhocLine,
	Element,
	Lib,
	RenderManager,
	nextUIUpdate,
	ChangeReason,
	baseUtilValue
) {
	"use strict";

	var AdhocLineLayer = library.AdhocLineLayer,
		DragOrientation = library.DragOrientation,
		GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType,
		GhostAlignment = library.dragdrop.GhostAlignment,
		SelectionMode = library.SelectionMode,
		TableSelectionMode = tableLibrary.SelectionMode,
		VisibleHorizonUpdateType = library.simple.VisibleHorizonUpdateType,
		VisibleHorizonUpdateSubType = library.simple.VisibleHorizonUpdateSubType;

		var oTextResources = Lib.getResourceBundleFor("sap.gantt");

	QUnit.module("basic", {
		beforeEach: function() {
			this.sut = new GanttChartWithTable();
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("default properties", function(assert){
		assert.strictEqual(this.sut.getWidth(), "100%", "default width");
		assert.strictEqual(this.sut.getHeight(), "100%", "default height");
		assert.strictEqual(this.sut.getDisplayType(), GanttChartWithTableDisplayType.Both, "default displayType");
		assert.strictEqual(this.sut.getSelectionPanelSize(), "30%", "default selectionPanelSize");
		assert.strictEqual(this.sut.getShapeSelectionMode(), SelectionMode.MultiWithKeyboard, "default shapeSelectionMode");
		assert.strictEqual(this.sut.getShapeSelectionSettings(), null, "default selection settings");
		assert.strictEqual(this.sut.getDatePattern(), library.config.DEFAULT_DATE_PATTERN, "default date pattern");
		assert.strictEqual(this.sut.getTimePattern(), library.config.DEFAULT_TIME_PATTERN, "default time pattern");

		["getEnableCursorLine", "getEnableNowLine", "getEnableVerticalLine", "getEnableAdhocLine", "getEnableExpandedRowBorders", "getEnableExpandedRowBackground", "getEnableNonWorkingTime"].forEach(function(sName){
			assert.ok(this[sName](), "default " + sName);
		}.bind(this.sut));

		assert.strictEqual(this.sut.getAdhocLineLayer(), AdhocLineLayer.Top, "default adhocLineLayer");
		assert.strictEqual(this.sut.getDragOrientation(), DragOrientation.Free, "default dragOrientation");
		assert.strictEqual(this.sut.getGhostAlignment(), GhostAlignment.None, "default ghostAlignment");
		assert.strictEqual(this.sut.getPrintingBatchSize(), 100, "default batch threshold");
		assert.strictEqual(this.sut.getSelectOnlyGraphicalShape(), false, "default for graphical selection only is false");
		assert.strictEqual(this.sut.getIsConnectorDetailsVisible(), false, "By default connector details property is set to false");
		assert.strictEqual(this.sut.getEnablePseudoShapes(), false, "By default PseudoShape is set to false");
		assert.strictEqual(this.sut.getEnableMultipleGhosts(), true, "By default enableMultipleGhosts is set to true");
		assert.strictEqual(new sap.gantt.simple.BasePseudoShape().getTypeOfOverlapIndicator(), "Gradient", "By default connector details property is set to false");
		assert.notOk(this.sut.getDisableShapeDoubleClickEvent(), "default disableShapeDoubleClickEvent");
		assert.ok(this.sut.getNowLineInUTC(), "default nowLineInUTC");
		assert.notOk(this.sut.getShowShapeTimeOnDrag(), "default showShapeTimeOnDrag");
	});

	QUnit.test("non-default properties", function (assert) {
		this.sut.destroy();
		this.sut = new GanttChartWithTable({
			adhocLineLayer: AdhocLineLayer.Bottom,
			disableShapeDoubleClickEvent: true,
			displayType: GanttChartWithTableDisplayType.Chart,
			dragOrientation: DragOrientation.Horizontal,
			datePattern: "dd.MM.yyyy",
			timePattern: "hh:mm a",
			enableCursorLine: false,
			enableNowLine: false,
			enableVerticalLine: false,
			enableAdhocLine: false,
			enableDeltaLine: false,
			enableNonWorkingTime: false,
			enableExpandedRowBorders: false,
			enableExpandedRowBackground: false,
			enableChartOverflowToolbar: false,
			expandedRowHeight: 50,
			ghostAlignment: GhostAlignment.End,
			height: "auto",
			nowLineInUTC: false,
			selectionPanelSize: "40%",
			shapeSelectionMode: SelectionMode.Single,
			shapeSelectionSettings: {
				color: "#808080",
				strokeWidth: 2,
				strokeDasharray: "5,1"
			},
			showShapeTimeOnDrag: true,
			showTextOnGhost: false,
			width: "auto",
			printingBatchSize: -1,
			enableMultipleGhosts: false
		});

		assert.strictEqual(this.sut.getWidth(), "auto", "width should be set correctly");
		assert.strictEqual(this.sut.getHeight(), "auto", "height should be set correctly");
		assert.strictEqual(this.sut.getDisplayType(), GanttChartWithTableDisplayType.Chart, "displayType should be set correctly");
		assert.strictEqual(this.sut.getSelectionPanelSize(), "40%", "selectionPanelSize should be set correctly");
		assert.strictEqual(this.sut.getShapeSelectionMode(), SelectionMode.Single, "shapeSelectionMode should be set correctly");
		assert.strictEqual(this.sut.getExpandedRowHeight(), 50, "rowHeight should be set correctly");
		assert.strictEqual(this.sut.getDatePattern(), "dd.MM.yyyy", "datePattern should be set correctly");
		assert.strictEqual(this.sut.getTimePattern(), "hh:mm a", "timePattern should be set correctly");
		assert.deepEqual(this.sut.getShapeSelectionSettings(), {
			color: "#808080",
			strokeWidth: 2,
			strokeDasharray: "5,1"
		}, "selection settings should be set correctly");

		["getEnableCursorLine", "getEnableNowLine", "getEnableVerticalLine", "getEnableAdhocLine", "getEnableExpandedRowBorders", "getEnableExpandedRowBackground", "getEnableNonWorkingTime"].forEach(function(sName){
			assert.notOk(this[sName](), "default " + sName);
		}.bind(this.sut));

		assert.strictEqual(this.sut.getAdhocLineLayer(), AdhocLineLayer.Bottom, "adhocLineLayer should be set correctly");
		assert.strictEqual(this.sut.getDragOrientation(), DragOrientation.Horizontal, "dragOrientation should be set correctly");
		assert.strictEqual(this.sut.getGhostAlignment(), GhostAlignment.End, "ghostAlignment should be set correctly");
		assert.strictEqual(this.sut.getPrintingBatchSize(), -1, "batch threshold should be set correctly");

		assert.ok(this.sut.getDisableShapeDoubleClickEvent(), "disableShapeDoubleClickEvent should be set correctly");
		assert.notOk(this.sut.getNowLineInUTC(), "nowLineInUTC should be set correctly");
		assert.ok(this.sut.getShowShapeTimeOnDrag(), "showShapeTimeOnDrag should be set correctly");
		assert.strictEqual(this.sut.getEnableChartOverflowToolbar(), false, "enableChartOverflowToolbar should be set correctly");
		assert.strictEqual(this.sut.getEnableChartSelectionState(), true, "enableChartSelectionState set correctly");
		assert.strictEqual(this.sut.getEnableChartHoverState(), true, "enableChartHoverState set correctly");
		assert.strictEqual(this.sut.getShowTextOnGhost(), false, "showTextOnGhost set correctly");
		assert.strictEqual(this.sut.getEnableMultipleGhosts(), false, "enableMultipleGhosts set correctly");
	});

	/**
	 * @deprecated since 1.84
	 */
	QUnit.test("default aggregation with Gant 1.0", function(assert){
		assert.strictEqual(this.sut.getAdhocLines().length, 0, "default adhocLines");
	});

	/**
	 * @deprecated since 1.63
	 */
	QUnit.test("default aggregation with Gant 1.0 with Locale", function(assert){
		var oLocale = this.sut.getLocale();
		assert.ok(oLocale != null, "locale has default value");
		assert.ok(oLocale.isA("sap.gantt.config.Locale"), "isA config.Locale");
		assert.strictEqual(oLocale.getTimeZone(), GanttChartConfigurationUtils.getTimezone(), "timezone cloned");
		assert.strictEqual(oLocale.getUtcdiff(), "000000", "utcdiff cloned");
		assert.strictEqual(oLocale.getUtcsign(), "+", "utcsign cloned");
		assert.ok(true, "locale is cloned from sap.gantt.config.DEFAULT_LOCALE_CET");
	});

	QUnit.test("default aggregation", function(assert){
		assert.strictEqual(this.sut.getTable(), null, "default table");
		assert.strictEqual(this.sut.getSimpleAdhocLines().length, 0, "default simple adhocLines");
		assert.strictEqual(this.sut.getSvgDefs(), null, "default svgDefs");
		assert.strictEqual(this.sut.getCalendarDef(), null, "default calendarDef");

		// a primary shape scheme is provided
		var aSchemes = this.sut.getShapeSchemes();
		assert.strictEqual(aSchemes.length, 1, "1 default shape schemes");
		assert.ok(aSchemes[0].getPrimary(), "default scheme is primary");

		var oAxisStrategy = this.sut.getAxisTimeStrategy();
		assert.ok(oAxisStrategy != null, "axis zoom strategy has default values");
		assert.ok(oAxisStrategy.isA("sap.gantt.axistime.ProportionZoomStrategy"), "is a ProportionZoomStrategy");
	});

	QUnit.test("internal methods/properties availability", function(assert){

		assert.ok(this.sut.getPrimaryShapeScheme() != null, "has primary scheme");
		assert.ok(this.sut.getInnerGantt() != null, "has inner gantt");
		var oSyncedControl = this.sut.getSyncedControl();
		assert.ok(oSyncedControl != null, "has synced control");
		assert.ok(oSyncedControl.isA("sap.gantt.simple.GanttSyncedControl"), "isA oSyncedControl");

		assert.ok(this.sut.getAxisTime() != null, "getAxisTime is available");

		assert.ok(this.sut.getSelection() != null, "getSelection is available");
	});

	QUnit.test("GanttExtension", function(assert){
		assert.ok(this.sut._bExtensionsInitialized === false, "Gantt Extension is not initialized");
		assert.strictEqual(this.sut._aExtensions, undefined, "no extension is initialized");
	});

	QUnit.module("functions", {
		beforeEach: async function () {
			this.sut = GanttQUnitUtils.createGantt(true);
			this.sut.setEnableAdhocLine(true);
			this.sut.addSimpleAdhocLine(new AdhocLine());
			this.sut.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		assertSelectionState: function (assert, aExpectedSelectedShapeUids) {
			var aAllNonExpandedShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
				"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
				"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
				"PATH:3|SCHEME:default[3]|DATA:/tree/rows/3[3]",
				"PATH:4|SCHEME:default[4]|DATA:/tree/rows/4[4]",
				"PATH:5|SCHEME:default[5]|DATA:/tree/rows/5[5]",
				"PATH:6|SCHEME:default[6]|DATA:/tree/rows/6[6]",
				"PATH:7|SCHEME:default[7]|DATA:/tree/rows/7[7]"
			];
			var aShapeIDRowId = [];
			aExpectedSelectedShapeUids.forEach(function (sShapeUid) {
				var oPart = Utility.parseUid(sShapeUid);
				aShapeIDRowId.push(oPart.shapeId + "_" + oPart.rowId);
			});
			GanttUtils.getShapesWithUid(this.sut.getId(), aAllNonExpandedShapeUids).forEach(function (oShape) {
				var sShapeUid = oShape.getShapeUid();
				var oPart = Utility.parseUid(sShapeUid);
				var sShapeIDRowId = oPart.shapeId + "_" + oPart.rowId;
				assert.ok(
					aShapeIDRowId.indexOf(sShapeIDRowId) > -1 ? oShape.getSelected() : !oShape.getSelected(),
					"Shape should have correct selection state. Shape UID is " + oShape.getShapeUid()
				);
			});
			assert.deepEqual(this.sut.getSelection().allUid(), aExpectedSelectedShapeUids, "SelectionModel's state should be correctly updated.");
		}
	});

	QUnit.test("Check Aria-Label", function (assert) {
		var fnDone = assert.async();
		GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var oGanttHeader = this.sut.getDomRef().getElementsByClassName("sapGanttChartHeaderSvg")[0];
			var oGanttChartArea = this.sut.getDomRef().getElementsByClassName("sapGanttChartSvg")[0];
			var oGanttInnerHeader = document.getElementById("inner-header-svg");
			var oGanttChartCalendars = this.sut.getDomRef().getElementsByClassName("sapGanttChartSvgDefs")[0];
			assert.equal(oGanttHeader.getAttribute("aria-label"), oTextResources.getText("ARIA_GANTT_HEADER"), "Aria Label is set correctly on the Header svg.");
			assert.equal(oGanttChartArea.getAttribute("aria-label"), oTextResources.getText("ARIA_GANTT_CHART"), "Aria Label is set correctly on the Chart svg");
			assert.equal(oGanttInnerHeader.getAttribute("aria-label"), oTextResources.getText("ARIA_GANTT_INNER_HEADER"), "Aria Label is set correctly on the Inner Header svg.");
			assert.equal(oGanttChartCalendars.getAttribute("aria-label"), oTextResources.getText("ARIA_GANTT_CALENDARS"), "Aria Label is set correctly on the Calendars svg");
			fnDone();
		}.bind(this));
	});

	QUnit.test("getTable", function(assert){
		assert.ok(this.sut.getTable()._bVariableRowHeightEnabled, "enable variable row heights");

		var oSplitter = this.sut._oSplitter,
			oFirstCA = oSplitter.getContentAreas()[0],
			oSecondCA = oSplitter.getContentAreas()[1];
		assert.ok(oFirstCA != null, "first content is not null");
		assert.ok(oFirstCA.isA("sap.gantt.control.AssociateContainer"), "first content is AssociateContainer");
		assert.ok(oFirstCA.getEnableRootDiv(), "table is enabled enableRootDiv");

		assert.ok(oSecondCA != null, "second content is not null");
		assert.ok(oSecondCA.isA("sap.gantt.simple.GanttSyncedControl"), "second content is also GanttSyncedControl");
	});

	QUnit.test("setTable", function(assert){
		var setTableSpy = sinon.spy(this.sut, "setTable");
		var oSyncedControl = this.sut.getSyncedControl();
		var syncWithSpy = sinon.spy(oSyncedControl, "syncWith");

		var oNewTable = new Table();
		this.sut.destroyTable();
		this.sut.setTable(oNewTable);
		assert.ok(setTableSpy.calledOnce, "setTable is called once");

		assert.ok(syncWithSpy.calledOnce, "syncWith called only once");
		assert.ok(syncWithSpy.calledOn(oSyncedControl), "called on oSyncedControl");
		assert.ok(syncWithSpy.calledWithExactly(oNewTable), "called on oSyncedControl");

		setTableSpy.restore();
		syncWithSpy.restore();
	});

	QUnit.test("setAxisTimeStrategy", function (assert) {
		// Create dates for the new AxisTimeStrategy
		var done = assert.async();
		var oAxisTimeStrategy = this.sut.getAxisTimeStrategy();
		var dNewVisibleStart = Format.abapTimestampToDate(oAxisTimeStrategy.getVisibleHorizon().getStartTime());
		var dNewVisibleEnd = Format.abapTimestampToDate(oAxisTimeStrategy.getVisibleHorizon().getEndTime());
		var dNewTotalStart = Format.abapTimestampToDate(oAxisTimeStrategy.getTotalHorizon().getStartTime());
		var dNewTotalEnd = Format.abapTimestampToDate(oAxisTimeStrategy.getTotalHorizon().getEndTime());
		dNewVisibleStart.setDate(dNewVisibleStart.getDate() + 7);
		dNewVisibleEnd.setDate(-7);
		dNewTotalStart.setDate(dNewTotalStart.getDate() + 14);
		dNewTotalEnd.setDate(-14);

		// Set the new AxisTimeStrategy
		var oNewAxisTimeStrategy = this.sut.getAxisTimeStrategy().clone();
		oNewAxisTimeStrategy.getVisibleHorizon().setStartTime(dNewVisibleStart);
		oNewAxisTimeStrategy.getVisibleHorizon().setEndTime(dNewVisibleEnd);
		oNewAxisTimeStrategy.getTotalHorizon().setStartTime(dNewTotalStart);
		oNewAxisTimeStrategy.getTotalHorizon().setEndTime(dNewTotalEnd);
		this.sut.destroyAxisTimeStrategy();
		this.sut.setAxisTimeStrategy(oNewAxisTimeStrategy);

		this.sut.getInnerGantt().attachEventOnce("ganttReady",function(){
			assert.notStrictEqual(this.sut._getScrollExtension()._getGanttHsbScrollLeft(), 0, "After setting new wider AxisTimeStrategy, the horizontal scrollbar should NOT reset to 0.");
			done();
		}.bind(this));
	});

	QUnit.test("selectShapes", function (assert) {
		var fnDone = assert.async();
		var aShapeUids = [
			"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
			"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
			"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
			"PATH:7|SCHEME:default[3]|DATA:/tree/rows/7[7]"
		];

		GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.selectShapes(aShapeUids); // exclusive parameter is not specified
			this.assertSelectionState(assert, aShapeUids);

			aShapeUids.pop(); // remove last shape Uid
			this.sut.selectShapes(aShapeUids, true); // do exclusive selection now
			this.assertSelectionState(assert, aShapeUids);

			this.sut.selectShapes([], false); // not exclusive
			this.assertSelectionState(assert, aShapeUids);
			aShapeUids = []; // remove all selections

			this.sut.selectShapes(aShapeUids, true); // do exclusive selection now
			this.assertSelectionState(assert, aShapeUids);
			fnDone();
		}.bind(this));
	});

	QUnit.test("Shape slection retains after sort", function (assert) {
		var fnDone = assert.async();
		var aShapeUids = [
			"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
			"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
			"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
			"PATH:7|SCHEME:default[3]|DATA:/tree/rows/7[7]"
		];

		GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.getTable().sort(this.sut.getTable().getColumns()[0], sap.ui.core.SortOrder.Descending);
			GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				this.sut.selectShapes(aShapeUids); // exclusive parameter is not specified
				this.assertSelectionState(assert, aShapeUids);

				aShapeUids.pop(); // remove last shape Uid
				this.sut.selectShapes(aShapeUids, true); // do exclusive selection now
				this.assertSelectionState(assert, aShapeUids);

				this.sut.selectShapes([], false); // not exclusive
				this.assertSelectionState(assert, aShapeUids);
				aShapeUids = []; // remove all selections

				this.sut.selectShapes(aShapeUids, true); // do exclusive selection now
				this.assertSelectionState(assert, aShapeUids);
				fnDone();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("deselectShapes", function (assert) {
		var fnDone = assert.async();
		var aShapeUids = [
			"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
			"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
			"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
			"PATH:7|SCHEME:default[3]|DATA:/tree/rows/7[7]"
		];

		GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.selectShapes(aShapeUids); // exclusive parameter is not specified
			this.sut.deselectShapes();
			this.assertSelectionState(assert, aShapeUids);

			this.sut.deselectShapes([aShapeUids[0], aShapeUids[3]]);
			aShapeUids.shift(); // removes first
			aShapeUids.pop(); // removes last
			this.assertSelectionState(assert, aShapeUids);

			this.sut.deselectShapes(aShapeUids);
			this.assertSelectionState(assert, []);
			fnDone();
		}.bind(this));
	});

	QUnit.test("deselectShapes with setSelected", function (assert) {
		var fnDone = assert.async();
		var aShapeUids = [
			"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
			"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
			"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
			"PATH:7|SCHEME:default[3]|DATA:/tree/rows/7[7]"
		];

		GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.setSelectedShapeUid(aShapeUids);
			this.sut.deselectShapes();
			this.assertSelectionState(assert, aShapeUids);

			this.sut.setSelectedShapeUid([aShapeUids[1], aShapeUids[2]]);
			aShapeUids.shift(); // removes first
			aShapeUids.pop(); // removes last

			this.assertSelectionState(assert, aShapeUids);
			this.sut.setSelectedShapeUid();

			this.assertSelectionState(assert, []);
			fnDone();
		}.bind(this));
	});

	QUnit.test("jumpToPosition", function (assert) {
		var oVisibleHorizon = this.sut.getAxisTimeStrategy().getVisibleHorizon();
		var oTotalHorizon = this.sut.getAxisTimeStrategy().getTotalHorizon();
		var dVisibleHorizonStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
		var dVisibleHorizonEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
		dVisibleHorizonStartTime.setDate(dVisibleHorizonStartTime.getDate() + 14);
		this.sut.jumpToPosition(dVisibleHorizonStartTime);

		assert.strictEqual(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(dVisibleHorizonStartTime), "Visible horizon's startTime should be updated.");
		dVisibleHorizonStartTime.setDate(-7);
		this.sut.jumpToPosition(Format.dateToAbapTimestamp(dVisibleHorizonStartTime));

		assert.strictEqual(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(dVisibleHorizonStartTime), "Visible horizon's startTime should be updated.");
		dVisibleHorizonStartTime.setDate(-7);
		dVisibleHorizonEndTime.setDate(-14);
		this.sut.jumpToPosition([dVisibleHorizonStartTime, dVisibleHorizonEndTime]);

		assert.strictEqual(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(dVisibleHorizonStartTime), "Visible horizon's startTime should be updated.");
		assert.strictEqual(oVisibleHorizon.getEndTime(), Format.dateToAbapTimestamp(dVisibleHorizonEndTime), "Visible horizon's endTime should be updated.");
		dVisibleHorizonStartTime.setDate(dVisibleHorizonStartTime.getDate() + 1);
		dVisibleHorizonEndTime.setDate(dVisibleHorizonEndTime.getDate() + 7);
		this.sut.jumpToPosition([Format.dateToAbapTimestamp(dVisibleHorizonStartTime), Format.dateToAbapTimestamp(dVisibleHorizonEndTime)]);

		assert.strictEqual(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(dVisibleHorizonStartTime), "Visible horizon's startTime should be updated.");
		assert.strictEqual(oVisibleHorizon.getEndTime(), Format.dateToAbapTimestamp(dVisibleHorizonEndTime), "Visible horizon's endTime should be updated.");
		this.sut.jumpToPosition();

		assert.ok(oVisibleHorizon.equals(oTotalHorizon), "Calling the function with no parameters should change the visible horizon to the total horizon.");
	});

	QUnit.test("selectionMode", function(assert){
		var fnDone = assert.async();
		GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var oSelection = this.sut.getSelection();
			assert.equal(this.sut.getShapeSelectionMode(), oSelection.getSelectionMode(), "initial value is correct");
			var innerGanttInvalidateSpy = sinon.spy(this.sut.getInnerGantt().getRenderer(), "render");
			this.sut.setShapeSelectionMode("Single");
			assert.equal(oSelection.getSelectionMode(), "Single", "oSelection mode also updated");
			// wait for 100ms to check if rendering is getting called or not.
			setTimeout(function() {
				assert.ok(innerGanttInvalidateSpy.notCalled, "Rendering doesn't happened when selection mode is set");
				innerGanttInvalidateSpy.restore();
				fnDone();
			}, 100);
		}.bind(this));
	});

	QUnit.test("handleShapePress", function(assert){
		assert.expect(6);
		var oNow = new Date(),
			oEnd = new Date(oNow.getTime() + 24 * 3600000),
			oRect = new BaseRectangle({
				selected: false,
				selectable: true,
				draggable: false,
				time: oNow,
				endTime: oEnd
			}),
			sFakeShapeUid = "PATH:0|abcde|SCHEME:ac_main[0]";
		var oRectGetShapeUidStub = sinon.stub(oRect, "getShapeUid").returns(sFakeShapeUid);
		var mParam = {
			shape: oRect,
			ctrlOrMeta: false
		};

		var oSelection = this.sut.getSelection();
		this.sut.attachEventOnce("shapeSelectionChange", function (oEvent) {
			assert.deepEqual(oEvent.getParameter("shapeUids"), [sFakeShapeUid], "The selectionChange event should contain all selected shapes.");
			assert.deepEqual(oSelection.allUid(), [sFakeShapeUid], "The allUid function should return only one selected shape.");
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).draggable, false);
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).time.toString(), oNow.toString());
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).endTime.toString(), oEnd.toString());
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).shapeUid, sFakeShapeUid);
			oRectGetShapeUidStub.restore();
		});

		this.sut.handleShapePress(mParam);
	});

	QUnit.test("handleShapePress - BaseGroups", function(assert){
		assert.expect(6);
		var oStartRect = new Date(),
			oEndRect = new Date(oStartRect.getTime() + 24 * 3600000),
			oStartChev = new Date(new Date().getTime() + 24 * 3600000),
			oEndChev = new Date(new Date().getTime() + 48 * 3600000),
			oGroupShape = new BaseGroup({
				selected: false,
				selectable: true,
				draggable: true,
				shapes: [
					new BaseRectangle({
						time: oStartRect,
						endTime: oEndRect
					}),
					new BaseChevron({
						time: oStartChev,
						endTime: oEndChev
					})
				]
			}),
			sFakeShapeUid = "PATH:0|abcde|SCHEME:ac_main[0]";
		var oGroupShapeUid = sinon.stub(oGroupShape, "getShapeUid").returns(sFakeShapeUid);
		var mParam = {
			shape: oGroupShape,
			ctrlOrMeta: false
		};

		var oSelection = this.sut.getSelection();
		this.sut.attachEventOnce("shapeSelectionChange", function (oEvent) {
			assert.deepEqual(oEvent.getParameter("shapeUids"), [sFakeShapeUid], "The selectionChange event should contain all selected shapes.");
			assert.deepEqual(oSelection.allUid(), [sFakeShapeUid], "The allUid function should return only one selected shape.");
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).draggable, true);
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).time.toString(), oStartRect.toString());
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).endTime.toString(), oEndChev.toString());
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).shapeUid, sFakeShapeUid);
			oGroupShapeUid.restore();
		});

		this.sut.handleShapePress(mParam);
	});

	QUnit.test("handleShapePress - BaseConditionalShape", async function(assert){
		assert.expect(4);
		var oStartTime = new Date();
		var oShape = new BaseConditionalShape({
			draggable: true,
			selectable: true,
			shapes: [
				new BaseRectangle({
					id: "r1",
					shapeId: "r1",
					time: oStartTime,
					endTime: new Date(oStartTime.getTime() + 24 * 3600000),
					draggable: true,
					selectable: true
				}),
				new BaseRectangle({
					id: "r2",
					shapeId: "r2",
					time: new Date(oStartTime.getTime() + 24 * 3600000),
					endTime: new Date(oStartTime.getTime() + 48 * 3600000),
					draggable: true,
					selectable: true
				}),
				new BaseGroup({
					draggable: true,
					selectable: true,
					shapes: [
						new BaseRectangle({
							id: "r3",
							shapeId: "r3",
							time: new Date(oStartTime.getTime() + 24 * 3600000),
							endTime: new Date(oStartTime.getTime() + 48 * 3600000)
						}),
						new BaseText({
							id: "t1",
							shapeId: "t2",
							time: new Date(oStartTime.getTime() + 48 * 3600000),
							endTime: new Date(oStartTime.getTime() + 72 * 3600000)
						})
					]
				})
			]
		}),
		sFakeShapeUid = "PATH:0|abcde|SCHEME:ac_main[0]";
		oShape.setActiveShape(0);
		await nextUIUpdate();
		var oShapeUid = sinon.stub(oShape._getActiveShapeElement(), "getShapeUid").returns(sFakeShapeUid);
		var mParam = {
			shape: oShape._getActiveShapeElement(),
			ctrlOrMeta: false
		};

		var oSelection = this.sut.getSelection();
		this.sut.attachEventOnce("shapeSelectionChange", function (oEvent) {
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).draggable, true);
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).time.toString(), oStartTime.toString());
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).endTime.toString(), new Date(oStartTime.getTime() + 24 * 3600000).toString());
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid).shapeUid, sFakeShapeUid);
			oShapeUid.restore();
		});
		this.sut.handleShapePress(mParam);
	});

	QUnit.test("setRowsHeight", function(assert){
		var fnDone = assert.async();

		GanttQUnitUtils.waitForGanttRendered(this.sut).then(async function () {
			var aRows = this.sut.getTable().getRows();
			var iDefaultRowHeight = this.sut.getTable()._getDefaultRowHeight();

			assert.equal(Math.ceil(aRows[1].getDomRef().style.height.replace('px',''), 10), iDefaultRowHeight, "1st row height is same as set on the table");
			assert.equal(Math.ceil(aRows[7].getDomRef().style.height.replace('px',''), 10), iDefaultRowHeight, "7th row height is same as set on the table");

			var oRowsCustomHeight = {};
			oRowsCustomHeight[aRows[1].getAggregation("_settings").getRowId()] = 50;
			oRowsCustomHeight[aRows[7].getAggregation("_settings").getRowId()] = 70;
			this.sut.setRowsHeight(oRowsCustomHeight);
			await nextUIUpdate();

			assert.equal(aRows[1].getDomRef().style.height, 50 + "px", "1st row height is set to the given height.");
			assert.equal(aRows[7].getDomRef().style.height, 70 + "px", "7th row height is set to the given height.");
			fnDone();
		}.bind(this));
	});

	QUnit.test("_draw - When sReasonCode is initialRender", function(assert){
		var sReasonCode = "initialRender";
		this.sut.setParent(new GanttChartContainer({}));
		this.sut.getAxisTimeStrategy().initialSettings = {
			firstDayOfWeek: 0,
			totalHorizon: this.sut.getAxisTimeStrategy().getTotalHorizon(),
			visibleHorizon: this.sut.getAxisTimeStrategy().getVisibleHorizon(),
			zoomLevel: 1
		};
		this.sut._draw(sReasonCode);
		assert.equal(this.sut.getParent().isZoomLevelUpdated, true, "isZoomLevelUpdated property is set to true when sReasonCode is intialRender");
	});

	QUnit.test("_draw - When sReasonCode is zoomLevelChange", function(assert){
		var sReasonCode = "zoomLevelChange";
		this.sut.setParent(new GanttChartContainer({}));
		this.sut.getAxisTimeStrategy().initialSettings = {
			firstDayOfWeek: 0,
			totalHorizon: this.sut.getAxisTimeStrategy().getTotalHorizon(),
			visibleHorizon: this.sut.getAxisTimeStrategy().getVisibleHorizon(),
			zoomLevel: 1
		};
		this.sut._draw(sReasonCode);
		assert.equal(this.sut.getParent().isZoomLevelUpdated, undefined, "isZoomLevelUpdated property is set to undefined when sReasonCode is zoomLevelChange");
	});

	QUnit.test("_draw - When displayType is table", function(assert){
		var sReasonCode = "initialRender";
		this.sut.setParent(new GanttChartContainer({
			displayType: 'Table',
			toolbar: new ContainerToolbar({
				showDisplayTypeButton: true
			})
		}));
		this.sut.setDisplayType('Table');
		this.sut.getAxisTimeStrategy().initialSettings = {
			firstDayOfWeek: 0,
			totalHorizon: this.sut.getAxisTimeStrategy().getTotalHorizon(),
			visibleHorizon: this.sut.getAxisTimeStrategy().getVisibleHorizon(),
			zoomLevel: 1
		};
		this.sut._draw(sReasonCode);
		assert.equal(this.sut.getParent().getToolbar().getZoomLevel(), this.sut.getAxisTimeStrategy().getZoomLevel(), "Updates zoom level in toolbar.");
	});

	QUnit.test("_invalidateRowActionTemplate", function(assert){
		var oRowActionTemplate = sinon.stub(this.sut.getTable(), "getRowActionTemplate").returns(new GanttRowAction({
			controlTemplate : new sap.ui.core.Control()
		}));
		var oRowActionTemplateInvalidate = sinon.stub(this.sut.getTable().getRowActionTemplate(), "invalidate");

		assert.equal(this.sut._bRowActionInitialRender, false, "Default value RowActionInitialRender is false");

		this.sut._invalidateRowActionTemplate(this.sut.getTable(), "Render");
		assert.ok(oRowActionTemplateInvalidate.calledOnce, "RowActionTemplate Invalidate Called.");

		assert.equal(this.sut._bRowActionInitialRender, true, "Initial render completed");

		this.sut._invalidateRowActionTemplate(this.sut.getTable(), "Render");
		assert.ok(oRowActionTemplateInvalidate.calledOnce, "RowActionTemplate Invalidate not Triggered again.");

		this.sut._invalidateRowActionTemplate(this.sut.getTable(), "Unbind");

		assert.equal(this.sut._bRowActionInitialRender, false, "RowActionInitialRender value set to false after unbind");

		assert.ok(oRowActionTemplateInvalidate.calledOnce, "RowActionTemplate Invalidate Called again after Unbind.");

		this.sut._invalidateRowActionTemplate(this.sut.getTable(), "change");
		assert.equal(oRowActionTemplateInvalidate.callCount, 2, "RowActionTemplate Invalidate Called.");

		this.sut._invalidateRowActionTemplate(this.sut.getTable(), "VerticalScroll");
		assert.equal(oRowActionTemplateInvalidate.callCount, 3, "RowActionTemplate Invalidate Called.");

		this.sut.getTable().fireEvent("settingsChange");

		assert.equal(this.sut._bRowActionInitialRender, false, "RowActionInitialRender value set to false after settingsChange event is fired.");

		this.sut._invalidateRowActionTemplate(this.sut.getTable(), "Render");

		assert.equal(oRowActionTemplateInvalidate.callCount, 4, "RowActionTemplate Invalidate Called again after settingsChange event is fired.");

		oRowActionTemplateInvalidate.restore();
		oRowActionTemplate.restore();
	});

	QUnit.module("Test Horizontal Scroll Position", {
		before: function() {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: async function() {
			this.gantt = GanttQUnitUtils.createGantt(true);
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});

	QUnit.test("Testing initial scroll position on ganttchart load", function (assert) {
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			assert.ok(this.gantt.getDomRef().getElementsByClassName("sapGanttChartContentBody")[0].scrollLeft !== 0);
			fnDone();
		}.bind(this));
	});

	// QUnit.test("Testing scroll position after adding/removing deltaLine", function (assert) {
	// 	var fnDone = assert.async();
	// 	var oDeltaLine = new DeltaLine({
	// 		stroke: "#DC143C",
	// 		strokeDasharray: "5,5",
	// 		strokeOpacity: 0.5,
	// 		timeStamp: "20170315000000",
	// 		endTimeStamp: "20170330000000",
	// 		description: "DeltaLine Creation"
	// 	});
	// 	return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
	// 		var nIntialScrollLeft = this.gantt._getScrollExtension().getGanttHsb().scrollLeft;
	// 		this.gantt.addDeltaLine(oDeltaLine);
	// 		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
	// 			var aChartDeltaLines = this.gantt.getDeltaLines();
	// 			if (aChartDeltaLines.length > 1) {
	// 				for (var i = 0; i < aChartDeltaLines.length; i++) {
	// 					this.gantt.removeDeltaLine(aChartDeltaLines[i]);
	// 				}
	// 			}
	// 			GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
	// 				assert.equal(parseInt(nIntialScrollLeft), parseInt(this.gantt._getScrollExtension().getGanttHsb().scrollLeft), "horizonatal scroll is in same position after removing delta line");
	// 				fnDone();
	// 			}.bind(this));
	// 		}.bind(this));
	// 	}.bind(this));
	// });

	QUnit.module("functions oData Model", {
		beforeEach: async function() {
			this.sut = GanttQUnitUtils.createGanttWithOData();
			this.sut.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("findAndSelect", function (assert) {
		var fnDone = assert.async();
		var fireShapeSelectionChangeSpy = sinon.spy(this.sut, "fireShapeSelectionChange");
		assert.ok(this.sut.oSelection.getSelectedShapeIDS().length === 0, "Default selected shape objectIds are empty.");
		assert.ok(this.sut.oSelection.getDeSelectedShapeIDS().length === 0, "Default deselection model is empty.");

		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(async function () {
			this.sut.findAndSelect("TTO", "Obj");
			await nextUIUpdate();
			assert.ok(fireShapeSelectionChangeSpy.notCalled, "shapeSelectionChange event is not trigerred");
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length > 0, "selection model should have all selected objectId");
			//Overwritting existing Model
			this.sut.findAndSelect("3", "id", true);
			assert.strictEqual(this.sut.oSelection.getSelectedShapeIDS()[0], "3", "Add Shape objectId 3.");
			//only sending Value
			this.sut.findAndSelect("Concept Phase", "Explanation");
			assert.strictEqual(this.sut.oSelection.getSelectedShapeIDS()[0], "1", "Add Shape objectId 1.");
			this.sut.findAndSelect("");
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length > 0, "selection model should have all selected objectId.");
			this.sut.findAndDeselect("");
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length === 0, "All the selection should be removed.");
			assert.ok(this.sut.oSelection.getDeSelectedShapeIDS().length !== 0, "Shape deselection model should not be empty on findAndDeselect.");
			this.sut.findAndSelect("TTO", "Obj");
			var selectionObjlength = this.sut.oSelection.getSelectedShapeIDS().length;
			this.sut.findAndDeselect("49", "id");
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length !== selectionObjlength, "Found ObjId removed from selection Modal");
			this.sut.findAndSelect("");
			this.sut.oSelection.updateSelectedShapes([], true);
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length === 0, "Selection Model is cleared.");
			assert.ok(this.sut.oSelection.getDeSelectedShapeIDS().length !== 0, "Deselection model should have the ids to remove selection");
			assert.ok(this.sut.oSelection.allUid().length === 0, "uid selection model is cleared.");
			//Act row selection
			this.sut.findAndSelect("3","id",false, true);
			this.sut.findAndSelect("49", "id", false, true);

			//Assert
			assert.ok(this.sut.oSelection.getSelectedRowIDS().length !== 0, "Row selection model will contain all the matched rows");
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length !== 0, "shape selection model will have the shapeIds of shapes in the rows after they are selected");
			assert.ok(this.sut.oSelection.getDeSelectedRowIDS().length === 0, "Row deslection model should be empty on findAndSelect");
			assert.ok(this.sut.oSelection.getDeSelectedShapeIDS().length === 0, "Shape deselection model should be empty on findAndSelect.");

			//Act row deselection
			this.sut.findAndDeselect("3","id", true);

			//Assert
			assert.ok(this.sut.oSelection.getDeSelectedRowIDS().length !== 0, "Row deselection model should contain the matched rows.");
			assert.ok(this.sut.oSelection.getDeSelectedShapeIDS().length !== 0, "Shape deselection model should contain the shapeIDs of the shapes in the rows after deselection.");

			this.sut.findAndSelect("", "", true, true);
			assert.equal(this.sut.oSelection.getSelectedShapeIDS().length, this.sut.getSelection().allUid().length, "All the shapes in chart are selected");
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length !== 0, "Selected shapeIds count should not be equal to 0");
			assert.ok(this.sut.oSelection.getSelectedRowIDS().length !== 0, "Row selection model will contain all the matched rows");
			this.sut.oSelection.attachEventOnce("selectionChanged", function (oEvent) {
				assert.equal(oEvent.getParameter("deselectedUid").length, this.sut.oSelection.getDeSelectedShapeIDS().length, "All shapes in chart are deselected");
				assert.ok(oEvent.getParameter("deselectedUid").length !== 0, "ShapeIds count that are selected for deselection should not be equal to 0");
			}.bind(this));
			this.sut.findAndDeselect("");

			assert.ok(this.sut.oSelection.getSelectedRowIDS().length === 0, "Row selection model will be empty");
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length === 0, "shape selection model will be empty");
			assert.ok(this.sut.oSelection.getDeSelectedRowIDS().length !== 0, "Row deslection model should not be empty on findAndDeselect");
			assert.ok(this.sut.oSelection.getDeSelectedShapeIDS().length !== 0, "Shape deselection model should not be empty on findAndDeselect.");

			this.sut.findAndSelect("", "", true, true);
			assert.equal(this.sut.oSelection.getSelectedShapeIDS().length, this.sut.getSelection().allUid().length, "All the shapes in chart are selected");
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length !== 0, "Selected shapeIds count should not be equal to 0");
			var selectedShapeUidLength = this.sut.getSelectedShapeUid().length;
			this.sut.oSelection.attachEventOnce("selectionChanged", function (oEvent) {
				assert.equal(oEvent.getParameter("deselectedUid").length, this.sut.oSelection.getDeSelectedShapeIDS().length, "Perticular shape is deselected");
				assert.ok(oEvent.getParameter("deselectedUid").length !== 0, "ShapeId count that is selected for deselection is not equal to 0");
				assert.equal(this.sut.getSelectedShapeUid().length,selectedShapeUidLength - 1 , "shapeUid is removed from list");
				assert.equal(this.sut.oSelection.getSelectedShapeIDS().indexOf("49"), -1, "shapeId removed from list");
				assert.ok(this.sut.oSelection.getSelectedRowIDS().indexOf("49") !== -1, "rowId should not be removed from list");
				assert.equal(this.sut.oSelection.getDeSelectedShapeIDS()[0], 49, "shapeId added to deselectshapeId list");
			}.bind(this));
			this.sut.findAndDeselect("49", "id");
			this.sut.findAndSelect("", "", true, true);
			this.sut.oSelection.attachEventOnce("selectionChanged", function (oEvent) {
				assert.equal(this.sut.getSelectedShapeUid().length,selectedShapeUidLength - 1 , "shapeUid is removed from list");
				assert.equal(this.sut.oSelection.getSelectedShapeIDS().indexOf("49"), -1, "shapeId removed from list");
				assert.equal(this.sut.oSelection.getSelectedRowIDS().indexOf("49"), -1, "rowId removed from list");
				assert.equal(this.sut.oSelection.getDeSelectedShapeIDS()[0], 49, "shapeId added to deselectshapeId list");
				assert.equal(this.sut.oSelection.getDeSelectedRowIDS()[0], 49, "rowId added to deselectrowId list");
			}.bind(this));
			this.sut.findAndDeselect("49", "id", true);
			this.sut.findAndSelect("", "", true, true);
			this.sut.attachEventOnce("shapeSelectionChange", function (oEvent) {
				assert.equal(this.sut.getSelectedShapeUid().length,selectedShapeUidLength - 1 , "shapeUid is removed from list after ctrl selection");
				assert.equal(this.sut.oSelection.getSelectedShapeIDS().indexOf("49"), -1, "shapeId removed from list after ctrl selection");
				assert.ok(this.sut.oSelection.getSelectedRowIDS().indexOf("49") !== -1, "rowId should not be removed from list after ctrl selection");
				assert.equal(this.sut.oSelection.getDeSelectedShapeIDS()[0], 49, "shapeId added to deselectshapeId list after ctrl selection");
			}.bind(this));

			var oShape = GanttUtils.getShapeByShapeId(this.sut.getId(),["49"])[0];
			this.sut.handleShapePress({
					shape: oShape,
					ctrlOrMeta: true
			});
			fireShapeSelectionChangeSpy.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("Test Selection by UID after findAndDeselect", function (assert) {
		var fnDone = assert.async();
		var fireShapeSelectionChangeSpy = sinon.spy(this.sut, "fireShapeSelectionChange");
		assert.ok(this.sut.getSelection().getSelectedShapeIDS().length === 0, "Default selected shape objectIds are empty.");
		assert.ok(this.sut.getSelection().getDeSelectedShapeIDS().length === 0, "Default deselection model is empty.");

		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.findAndSelect("DPO", "Obj");
			assert.ok(fireShapeSelectionChangeSpy.notCalled, "shapeSelectionChange event is not trigerred");
			assert.ok(this.sut.getSelection().getSelectedShapeIDS().length > 0, "selection model should have all selected objectId");
			var oSelectedUIDs = this.sut.getSelection().allUid();
			assert.ok(oSelectedUIDs.length > 0, "selection model should have all selected UIDs");
			//Act -Deselect All
			this.sut.findAndDeselect("");
			//Assert
			assert.ok(this.sut.getSelection().getSelectedShapeIDS().length === 0, "All the selection should be removed.");
			assert.ok(this.sut.getSelection().allUid().length === 0, "All the UID selection should be removed.");
			assert.ok(this.sut.getSelection().getDeSelectedShapeIDS().length !== 0, "Deselection model should have the ids to remove selection");
			//Act - Selection by UID
			this.sut.selectShapes(oSelectedUIDs);
			//Assert
			assert.ok(this.sut.getSelection().allUid().length !== 0, "UID selection model should not be empty.");
			//AcT
			this.sut.findAndSelect(""); // Select ALL
			oSelectedUIDs = this.sut.getSelection().allUid();
			//Assert
			// assert.ok(this.sut.getSelection().getSelectedShapeIDS().length !== 0, "ShapeID Selection Model Should not be empty");
			assert.ok(this.sut.getSelection().allUid().length !== 0, "UID selection should not be Empty.");
			assert.ok(this.sut.getSelection().getDeSelectedShapeIDS().length === 0, "Deselection model should be Empty");
			//Act
			this.sut.findAndDeselect("");
			this.sut.selectShapes(oSelectedUIDs);
			assert.ok(this.sut.getSelection().allUid().length !== 0, "UID selection model should not be empty.");
			var hsb = document.getElementById(this.sut.getId() + "-hsb");
			hsb.scrollTo(hsb.scrollLeft + 1000, 0);
			this.sut.findAndDeselect("");
			// assert.ok(fireShapeSelectionChangeSpy.calledOnce, "shapeSelectionChange is called");
			assert.ok(this.sut.getSelection().allUid().length === 0, "UID selection model should be empty.");
			fnDone();
		}.bind(this));
	});

	QUnit.test("Test getSelectedShapeId method", function (assert) {
		this.sut.placeAt("qunit-fixture");
		var oGantt = this.sut;
		var oTable =  oGantt.getTable();
		assert.equal(oGantt.getSelectedShapeId().length, 0, "Default selected shape IDs are empty.");
		assert.equal(oGantt.getSelectedShapeUid().length, 0, "Default selected shape UIDs are empty.");
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.findAndSelect("", "", true, false);
			var oSelectedShapeIds = oGantt.getSelectedShapeId().length;
			var oSelectedShapeUids = oGantt.getSelectedShapeUid().length;
			assert.equal(oSelectedShapeIds, oTable.getBinding().getNodes(0).length, "Selected shape IDs contain all the shape's IDs");
			assert.equal(oSelectedShapeUids,  oTable.getRows().length, "Selected shape UIDs contain only visible shape's UIDs");
		});
	});

	QUnit.module("Odata Model with Calendar defs", {
		beforeEach: async function() {
			this.sut = GanttQUnitUtils.createGanttWithODataModelForCalendar();
			this.sut.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("Check helpers defs and SvgDefs are added to the common defs", function (assert) {
		var fnDone = assert.async();
		var oSvgDefs = new SvgDefs();
		this.sut.setSvgDefs(oSvgDefs);

		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var oGanttDomRef = this.sut.getDomRef();
			var oGanttSVGDefsRef = oGanttDomRef.querySelector("#" + this.sut.getId() + "-svgDefs");

			assert.ok(oGanttSVGDefsRef, "SVG element for defs exists");
			assert.ok(oGanttSVGDefsRef.querySelector("#" + this.sut.getId() + "-helperDef-linePattern"), "Line pattern defs exists in commin defs svg element");
			assert.ok(oGanttSVGDefsRef.querySelector("#" + oSvgDefs.getId()), "SvgDefs exists in the common defs svg element");
			fnDone();
		}.bind(this));
	});

	QUnit.test("Check SVG calendar are defs are added to the common defs", function (assert) {
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				var oGanttDomRef = this.sut.getDomRef();
				var oGanttSVGDefsRef = oGanttDomRef.querySelector("#" + this.sut.getId() + "-svgDefs");

				assert.ok(oGanttSVGDefsRef, "SVG element for defs exists");

				var oPatternDef = this.sut.getCalendarDef();
				var aCalendarAggs = Object.keys(AggregationUtils.getAllNonLazyAggregations(oPatternDef)).filter(function(sName) {
					if (sName.indexOf("defs") === 0) {
						var aDefs = oPatternDef.getAggregation(sName);

						return Array.isArray(aDefs);
					}

					return false;
				}, []);

				aCalendarAggs.forEach(function (_calDef, index) {
					var oDefDomRef = oGanttSVGDefsRef.querySelector("#" + this.sut.getId() + "-calendardefs-" + index);

					assert.ok(oDefDomRef, "The calendardefs with unique ID exists inside defs element");
				}.bind(this));

				fnDone();
		}.bind(this));
	});

	QUnit.test("Check multiple calendar defs with dynamic data binding", function (assert) {
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				var oGanttDomRef = this.sut.getDomRef();
				var aGanttCalendarElement = oGanttDomRef.querySelector(".sapGanttChartCalendar").childNodes;
				assert.ok(aGanttCalendarElement && aGanttCalendarElement.length > 0, "Calendars are present");
				var oPatternDef = this.sut.getCalendarDef(),
				aCalendarDefs = Object.keys(AggregationUtils.getAllNonLazyAggregations(oPatternDef)).filter(function(sName) {
					return (sName.indexOf("defs") === 0);
				}).map(function(sName){ // eslint-disable-line
					return oPatternDef.getAggregation(sName) || [];
				});
				aCalendarDefs.forEach(function (calDef, index) {
					if (calDef.length > 0) {
						var oDefDomRef = oGanttDomRef.querySelector("#" + this.sut.getId() + "-calendardefs-" + index);
						assert.ok(oDefDomRef, "The calendardefs with unique ID exists");
						assert.ok(calDef.length === 14, "CalendarDefs Patterns are present for all rows");
						calDef.forEach(function (defInst){
							switch (defInst.sParentAggregationName) {
								case "defs":
									assert.equal(defInst.getKey(), "NonWorkingTime", "Calendar Key matches the definition for defs aggregation");
									break;
								case "defs1":
									assert.equal(defInst.getKey(), "DownTime", "Calendar Key matches the definition defs1 aggregation");
									break;
								default:
									return;
							}
						});
					}
				}.bind(this));
				fnDone();
		}.bind(this));
	});

	QUnit.module("Odata Model with Calendar defs - dynamic binding for BaseCalendar", {
		beforeEach: async function() {
			this.sut = GanttQUnitUtils.createGanttWithODataModelForMultipleBaseCalendar();
			this.sut.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("Check multiple calendar defs with dynamic data binding", function (assert) {
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aGanttCalendarElement = this.sut.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
			assert.ok(aGanttCalendarElement && aGanttCalendarElement.length > 0, "Calendars are present");
			var oPatternDef = this.sut.getCalendarDef(),
			aCalendarDefs = Object.keys(AggregationUtils.getAllNonLazyAggregations(oPatternDef)).map(function(sName){ // eslint-disable-line
					return oPatternDef.getAggregation(sName) || [];
			});
			aCalendarDefs.forEach(function (calDef) {
				if (calDef.length > 0) {
					assert.ok(calDef.length === 28, "CalendarDefs are present for all rows");
				}
			});
			var aVisibleRows = this.sut.getTable().getRows();
			aVisibleRows.forEach(function(oVisibleRow) {
				var oRowSetting = oVisibleRow.getAggregation("_settings"),
				aBaseCalendarsInRow = Object.keys(AggregationUtils.getAllNonLazyAggregations(oRowSetting)).filter(function(sName){
					// skip calendars due to special rendering order
					return (sName.indexOf("shapes") === -1) && sName !== "relationships";
				}).map(function(sName){ // eslint-disable-line
					// get all binding aggregation instances and default to empty array
					return oRowSetting.getAggregation(sName) || [];
				});
				aBaseCalendarsInRow.forEach(function (oCalendar) {
					if (oCalendar.length > 0) {
						assert.ok(oCalendar.length === 28, "BaseCalendars are present for all rows");
					}
				});
			});
			fnDone();
		}.bind(this));
	});

	QUnit.module("FindAndSelect - Gantt chart with multiple calendar defs", {
		beforeEach: async function() {
			this.sut = GanttQUnitUtils.createGanttWithODataModelForMultipleBaseCalendar(new GanttRowSettings({
				rowId: "{data>id}",
				calendars: {
					templateShareable: false,
					path: "data>/NonWorkingTime",
					template: new BaseCalendar({
						calendarName: "{data>CalendarName}"
					})
				},
				calendars1: {
					templateShareable: false,
					path: "data>/DownTime",
					template: new BaseCalendar({
						calendarName: "{data>CalendarName}"
					})
				},
				shapes1: [
					new BaseRectangle({
						shapeId: "{data>id}",
						time: "{data>StartDate}",
						endTime: "{data>EndDate}",
						title: "{data>ObjectName}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
			this.sut.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("FindAndSelect for gantt chart with multiple calendar defs", function (assert) {
		assert.ok(this.sut.oSelection.getSelectedShapeIDS().length === 0, "Default selected shape objectIds are empty");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(async function () {
			this.sut.findAndSelect("");
			assert.equal(this.sut.pathList.ProjectElmSet["/DownTime"], null, "Calendar path should not be stored");
			assert.equal(this.sut.pathList.ProjectElmSet["shapeIDPath"].length, 1, "Shape path should be stored");
			await nextUIUpdate();
			assert.ok(this.sut.oSelection.getSelectedShapeIDS().length > 0, "Selection model should have all selected objectId");
		}.bind(this));
	});

	QUnit.test("FindAndSelect for gantt with formatter", function (assert) {
		function Formatter(iStartConstraint){
			assert.equal(typeof (iStartConstraint), "number", "iStartConstraint should be an integer");
		}
		var oFormat = [{formatter:Formatter, parts:[{path: 'StartConstraint', mode: 'OneWay'}]}];
		this.sut._aAllShapesFormatters = oFormat;
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.findAndSelect("");
		}.bind(this));
	});

	QUnit.module("axisTimeStrategy binding", {
		beforeEach: async function () {
			this.gantt = GanttQUnitUtils.createGantt(true);
			var oVisibleHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon();
			var oTotalHorizon = this.gantt.getAxisTimeStrategy().getTotalHorizon();
			this.sOriginalVisibleHorizonStartTime = oVisibleHorizon.getStartTime();
			this.sOriginalVisibleHorizonEndTime = oVisibleHorizon.getEndTime();
			this.sOriginalTotalHorizonStartTime = oTotalHorizon.getStartTime();
			this.sOriginalTotalHorizonEndTime = oTotalHorizon.getEndTime();

			// calculate new visible horizon dates
			var dNewVisibleStart = Format.abapTimestampToDate(this.sOriginalVisibleHorizonStartTime);
			var dNewVisibleEnd = Format.abapTimestampToDate(this.sOriginalVisibleHorizonEndTime);
			dNewVisibleStart.setDate(dNewVisibleStart.getDate() + 14);
			dNewVisibleEnd.setDate(-12);

			// add data to the model
			var oModel = this.gantt.getModel();
			oModel.setProperty("/totalHorizonStartTime", this.sOriginalTotalHorizonStartTime);
			oModel.setProperty("/totalHorizonEndTime", this.sOriginalTotalHorizonEndTime);
			oModel.setProperty("/visibleHorizonStartTime", Format.dateToAbapTimestamp(dNewVisibleStart));
			oModel.setProperty("/visibleHorizonEndTime", Format.dateToAbapTimestamp(dNewVisibleEnd));
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		fnAssert: function (assert, bHorizontalScrollbarShouldEndUpLeftAtZero) {
			assert.ok(2);
			GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				if (bHorizontalScrollbarShouldEndUpLeftAtZero) {
					assert.strictEqual(this.gantt._getScrollExtension()._getGanttHsbScrollLeft(), 0, "1st render should end up with horizontal scrollbar left at 0.");
				} else {
					assert.notStrictEqual(this.gantt._getScrollExtension()._getGanttHsbScrollLeft(), 0, "1st render should end up with horizontal scrollbar NOT left at 0.");
				}
				var oModel = this.gantt.getModel();
				oModel.setProperty("/totalHorizonStartTime", this.sOriginalTotalHorizonStartTime);
				oModel.setProperty("/totalHorizonEndTime", this.sOriginalTotalHorizonEndTime);
				oModel.setProperty("/visibleHorizonStartTime", this.sOriginalVisibleHorizonStartTime);
				oModel.setProperty("/visibleHorizonEndTime", this.sOriginalVisibleHorizonEndTime);
				if (bHorizontalScrollbarShouldEndUpLeftAtZero) {
					assert.strictEqual(this.gantt._getScrollExtension()._getGanttHsbScrollLeft(), 0, "2nd render should end up with horizontal scrollbar left at 0.");
				} else {
					assert.notStrictEqual(this.gantt._getScrollExtension()._getGanttHsbScrollLeft(), 0, "2nd render should end up with horizontal scrollbar NOT left at 0.");
				}
			}.bind(this));
		}
	});

	QUnit.test("FullScreenStrategy", async function (assert) {
		this.gantt.setAxisTimeStrategy(new FullScreenStrategy({
			totalHorizon: new TimeHorizon({ // same as visible horizon
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));
		await nextUIUpdate();
		return this.fnAssert(assert, true);
	});

	QUnit.test("ProportionZoomStrategy", async function (assert) {
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));
		await nextUIUpdate();
		return this.fnAssert(assert, false);
	});

	QUnit.test("StepwiseZoomStrategy", async function (assert) {
		this.gantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));
		await nextUIUpdate();
		return this.fnAssert(assert, false);
	});

	QUnit.test("Test Zoom Level for ProportionZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			}),
			zoomLevel: 3
		}));
		nextUIUpdate();
		assert.equal(this.gantt.getAxisTimeStrategy().getProperty("zoomLevel"), 3, "setZoomLevel property is correct.");
		this.gantt.getAxisTimeStrategy().setZoomLevel(5);
		nextUIUpdate();
		assert.equal(this.gantt.getAxisTimeStrategy().getProperty("zoomLevel"), 5, "setZoomLevel property is updated.");
	});

	QUnit.test("Test Zoom Level for StepwiseZoomStrategy", async function (assert) {
		this.gantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			}),
			zoomLevel: 3
		}));
		await nextUIUpdate();
		assert.equal(this.gantt.getAxisTimeStrategy().getProperty("zoomLevel"), 3, "setZoomLevel property is correct.");
		this.gantt.getAxisTimeStrategy().setZoomLevel(5);
		await nextUIUpdate();
		assert.equal(this.gantt.getAxisTimeStrategy().getProperty("zoomLevel"), 5, "setZoomLevel property is updated.");
	});

	QUnit.test("Test visible horizon for StepwiseZoomStrategy after initial render", function (assert) {
		var oModel = this.gantt.getModel();
		var fnDone = assert.async();
		oModel.setProperty("/totalHorizonStartTime", this.sOriginalTotalHorizonStartTime);
		oModel.setProperty("/totalHorizonEndTime", this.sOriginalTotalHorizonEndTime);
		oModel.setProperty("/visibleHorizonStartTime", this.sOriginalVisibleHorizonStartTime);
		oModel.setProperty("/visibleHorizonEndTime", this.sOriginalVisibleHorizonEndTime);
		this.gantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var oAxisTimeStrategy = this.gantt.getAxisTimeStrategy();
			var oHorizon = oAxisTimeStrategy._completeTimeHorizon(new TimeHorizon({startTime: this.sOriginalVisibleHorizonStartTime}));
			assert.strictEqual(oAxisTimeStrategy.getVisibleHorizon().getStartTime(), this.sOriginalVisibleHorizonStartTime, "Visible Horizon start time should be same as initial value");
			assert.notEqual(oAxisTimeStrategy.getVisibleHorizon().getEndTime(), this.sOriginalVisibleHorizonEndTime, "Visible Horizon end time should not be same as initial value");
			assert.strictEqual(oAxisTimeStrategy.getVisibleHorizon().getStartTime(), oHorizon.getStartTime(), "Visible Horizon start time should be same as calculated horizon start time");
			assert.strictEqual(oAxisTimeStrategy.getVisibleHorizon().getEndTime(), oHorizon.getEndTime(), "Visible Horizon end time should be same as calculated horizon end time");
			fnDone();
		}.bind(this));
	});

	QUnit.module("Gantt Header", {
		beforeEach: async function() {
			this.gantt = GanttQUnitUtils.createGantt(true);
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Gantt header Visibility", async function (assert) {
		var oGantt = this.gantt;
		var fnDone = assert.async();
		oGantt.setShowGanttHeader(false);
		await nextUIUpdate();

		assert.strictEqual(document.getElementById(oGantt.getTable().getId() + "-header").offsetHeight, 0, "Gantt header is not visible");
		oGantt.setShowGanttHeader(true);
		await nextUIUpdate();

		var bGanttHeader = document.getElementById(oGantt.getTable().getId() + "-header").offsetHeight > 0 ? true : false;
		assert.strictEqual(bGanttHeader, true, "Gantt header is visible");
		fnDone();
	});

	QUnit.module("Horizontal Scrollbar Visibility", {
		before: function() {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: async function() {
			this.gantt = GanttQUnitUtils.createGantt(true);
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});

	QUnit.test("HSb hidden when entire gantt chart is visible", function (assert) {
		var fnDone = assert.async();
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20160601000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20160601000000"
			})
		}));
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var $hsb = document.getElementById(this.gantt.getId() + "-hsb");
			var $hsbContent = document.getElementById(this.gantt.getId() + "-hsb-content");
			assert.strictEqual($hsbContent.clientWidth <= $hsb.clientWidth, true, "Horizontal Scrollbar is not visible");
			fnDone();
		}.bind(this));
	});

	QUnit.test("HSb appears when entire gantt chart is not visible", function (assert) {
		var fnDone = assert.async();
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20180501000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20160601000000"
			})
		}));
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var $hsb = document.getElementById(this.gantt.getId() + "-hsb");
			var $hsbContent = document.getElementById(this.gantt.getId() + "-hsb-content");
			assert.strictEqual($hsbContent.clientWidth > $hsb.clientWidth, true, "Horizontal Scrollbar is visible");
			fnDone();
		}.bind(this));
	});

	QUnit.test("HSb container hidden for fullscreen strategy", function (assert) {
		var fnDone = assert.async();
		this.gantt.setAxisTimeStrategy(new FullScreenStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20180501000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20180501000000"
			})
		}));
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var oHSbContainer = document.querySelector('.sapGanttHSBContainer');
			assert.strictEqual(getComputedStyle(oHSbContainer).visibility, "hidden", "Horizontal Scrollbar container is not visible");
			fnDone();
		});
	});

	QUnit.module("Zoom base calculation during initial render", {
		beforeEach: async function() {
			this.gantt = GanttQUnitUtils.createGantt(true);
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Zoom base calculation for StepwiseZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20160601000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20160601000000"
			})
		}));
		var oAxisTimeStrategyCalZoomBaseSpy = sinon.spy(AxisTimeStrategyBase.prototype, "calZoomBase");
		var oVisibleHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon();
		var iWidth = this.gantt.getVisibleWidth();
		this.gantt._updateVisibleHorizon(oVisibleHorizon, "initialRender", iWidth);
		assert.ok(oAxisTimeStrategyCalZoomBaseSpy.notCalled, "Zoom base should not be recalculated for StepwiseZoomStrategy");
		oAxisTimeStrategyCalZoomBaseSpy.restore();
	});

	QUnit.test("Zoom base calculation for ProportionZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20160601000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20160601000000"
			})
		}));
		var oAxisTimeStrategyCalZoomBaseSpy = sinon.spy(AxisTimeStrategyBase.prototype, "calZoomBase");
		var oVisibleHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon();
		var iWidth = this.gantt.getVisibleWidth();
		this.gantt._updateVisibleHorizon(oVisibleHorizon, "initialRender", iWidth);
		assert.ok(oAxisTimeStrategyCalZoomBaseSpy.calledOnce, "Zoom base should be recalculated for ProportionZoomStrategy");
		oAxisTimeStrategyCalZoomBaseSpy.restore();
	});

	QUnit.module("selectionPanelSize", {
		before: function() {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: async function() {
			// set fixed width to prevent different Gantt rendering on different window sizes
			this.oGanttChartContainer = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showDisplayTypeButton: true
				}),
				ganttCharts: [
					GanttQUnitUtils.createGantt(true)
				],
				height: "900px"
			});
			var sWidth = "1920px";
			document.getElementById("qunit-fixture").style.width = sWidth;
			document.getElementById("qunit-fixture").style.height = "900px";
			this.oPanel = new Panel({
				width: sWidth,
				content: [this.oGanttChartContainer]
			});
			this.oPanel.placeAt("qunit-fixture");
			this.gantt = this.oGanttChartContainer.getGanttCharts()[0];
			await nextUIUpdate();
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
			this.oPanel.destroy();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});

	QUnit.test("Splitter resize changes selectionPanelSize", function (assert) {
		var iExpectedTableWidth = this.gantt.$().width() * 0.3;
		var iTableWidth = this.gantt.$().find("#table").width();
		assert.ok(
				(iTableWidth > (iExpectedTableWidth - 10)) && (iTableWidth < (iExpectedTableWidth + 10)),
				"Table on load should have " + iExpectedTableWidth + "px (+-10px) because selection panel size is set to 30% and Gantt width is " + this.gantt.$().width() + "px."
		);
		this.gantt._oSplitter.getContentAreas()[0].getLayoutData().setSize("50px");
		this.gantt._oSplitter.triggerResize(true);
		assert.equal(this.gantt.getSelectionPanelSize(), "50px", "selectionPanelSize should be unchanged.");
	});

	QUnit.test("Test resize of gantt doesn't change selectionPanelSize", function (assert) {
		return new Promise(function (resolve) {
			function onResize() {
				assert.equal(this.gantt.getSelectionPanelSize(), "30%", "selectionPanelSize should be unchanged.");
				resolve();
			}
			var iExpectedTableWidth = this.gantt.$().width() * 0.3;
			var iTableWidth = this.gantt.$().find("#table").width();
			assert.ok(
					(iTableWidth > (iExpectedTableWidth - 10)) && (iTableWidth < (iExpectedTableWidth + 10)),
					"Table on load should have " + iExpectedTableWidth + "px (+-10px) because selection panel size is set to 30% and Gantt width is " + this.gantt.$().width() + "px."
			);
			this.gantt._oSplitter.attachEventOnce("resize", onResize.bind(this));
			this.gantt.$().width(100);
		}.bind(this));
	});

	QUnit.test("Test resize of gantt when Table size is updated", function (assert) {
		var fnDone = assert.async();
		this.gantt.setSelectionPanelSize("40%");
		var aSplitterContentAreas = this.gantt._oSplitter.getContentAreas(),
		oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
		oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData();
		assert.strictEqual(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
		assert.strictEqual(oTableAreaLayoutData.getSize(), "40%", "Default table size is 40%");
		assert.strictEqual(oChartAreaLayoutData.getSize(), "auto", "Default chart layout size is auto");
		this.gantt.setSelectionPanelSize("0%");//set Table width to 0px so the _onResize updates the default width of the table to 60px
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			//parameter passed to _onResize will be true if the method is called from onSplitterResize()
			//In this case do not set the value from SelectionPanelSize
			this.gantt._onResize(true);
			assert.strictEqual(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
			var oGanttFullWidth = this.gantt.getDomRef().offsetWidth,
				oTableWidth = 0.3 * oGanttFullWidth;
			assert.strictEqual(oTableAreaLayoutData.getSize(), oTableWidth + "px", "Table size is set to 30% of total width when table width is set to to 0px");
			assert.strictEqual(oChartAreaLayoutData.getSize(), "auto", "Cchart layout size is auto");
			this.gantt.setSelectionPanelSize("0%");
			this.gantt.setSelectionPanelSize("40%");
			//Event object will be sent to _onResize when the event is trigerred from ResizeHandler.
			//In this case set the value form SelectionPanelSize
			this.gantt._onResize(false);
			assert.strictEqual(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
			assert.strictEqual(oTableAreaLayoutData.getSize(), "40%", "Table size is updated to 40% based on SelectionPanelSize");
			assert.strictEqual(oChartAreaLayoutData.getSize(), "auto", "Chart layout size is auto");
			fnDone();
		}.bind(this));
	});

	QUnit.test("Test displayTypes", async function (assert) {
		var aSplitterContentAreas = this.gantt._oSplitter.getContentAreas(),
			oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
			oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData();

		assert.strictEqual(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
		assert.strictEqual(oTableAreaLayoutData.getSize(), "30%", "Default table size is 30%");
		assert.strictEqual(oChartAreaLayoutData.getSize(), "auto", "Default chart layout size is auto");
		assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "inline-flex", "Default display of splitter bar is inline flex");

		// Set displayType to Chart
		this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
		assert.strictEqual(oTableAreaLayoutData.getSize(), "0px");
		assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");
		await nextUIUpdate();

		assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "none", "Display of splitter bar is none in chart only mode");

		// Set displayType to Table
		this.gantt.setDisplayType(GanttChartWithTableDisplayType.Table);
		await nextUIUpdate();
		var oTargetHorizon = this.gantt.getAxisTimeStrategy().getTotalHorizon();
		var oTimeHorizon = Utility.calculateHorizonByWidth(oTargetHorizon, 0, 0);
		assert.strictEqual(oTimeHorizon.getStartTime() === oTargetHorizon.getStartTime() && oTimeHorizon.getEndTime() === oTargetHorizon.getEndTime(), true);
		oTimeHorizon = Utility.calculateHorizonByWidth(this.gantt.getAxisTimeStrategy().getTotalHorizon(), 875, 612);
		assert.strictEqual(oTimeHorizon.getStartTime() === oTargetHorizon.getStartTime() && oTimeHorizon.getEndTime() !== oTargetHorizon.getEndTime(), true);
		assert.strictEqual(oTableAreaLayoutData.getSize(), "auto");
		assert.strictEqual(oChartAreaLayoutData.getSize(), "0px");

		assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "none", "Display of splitter bar is none in table only mode");

		// Test if Gantt remembers the last table width from the last Both displayMode
		this.gantt.setDisplayType(GanttChartWithTableDisplayType.Both);
		assert.strictEqual(oTableAreaLayoutData.getSize(), "30%"); // Splitter-calculated value from 30%
		assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");
		await nextUIUpdate();

		assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "inline-flex", "Default display of splitter bar is inline flex");

		// Test selectionPanelSize change (splitter left area resize)
		this.gantt.setSelectionPanelSize("200px");

		assert.strictEqual(oTableAreaLayoutData.getSize(), "200px");
		assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");

		// Test change to Chart and back to Both, table and chart should have same size as before change displayType
		this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
		assert.strictEqual(oTableAreaLayoutData.getSize(), "0px");
		assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");

		var iZoomLevel = this.gantt.getAxisTimeStrategy().getZoomLevel();
		this.gantt.setDisplayType(GanttChartWithTableDisplayType.Both);
		assert.strictEqual(oTableAreaLayoutData.getSize(), "200px");
		assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");
		assert.strictEqual(this.gantt.getAxisTimeStrategy().getZoomLevel(), iZoomLevel);
	});
	QUnit.test("Test LayoutData when displayType is Table", async function (assert) {
		var aSplitterContentAreas = this.gantt._oSplitter.getContentAreas(),
			oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
			oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData();

		// Set displayType to Table
		this.gantt.setDisplayType(GanttChartWithTableDisplayType.Table);
		await nextUIUpdate();
		assert.strictEqual(oTableAreaLayoutData.getSize(), "auto");
		assert.strictEqual(oChartAreaLayoutData.getSize(), "0px");

		assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "none", "Display of splitter bar is none in table only mode");
	});
	QUnit.test("Change the default settings property getEnableVerticalLine with chart displayTypes and check for gantt chart header height in compact mode", function (assert) {
		assert.equal(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
		var sGanttId = this.gantt.getId(),
		$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]"),
		//get the initial height of the header
		nGanttHeaderHeight = $GanttHeader.height();
		//change to chart only mode
		this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
		$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
		assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
		//disable vertical line
		this.gantt.setEnableVerticalLine(false);
		$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
		assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
		//enable vertical line
		this.gantt.setEnableVerticalLine(true);
		$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
		assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
	});

	QUnit.test("Change the default settings property getEnableVerticalLine with chart displayTypes and check for gantt chart header height in cozy mode", function (assert) {
		document.querySelector('.sapUiBody').classList.remove("sapUiSizeCompact");
		document.querySelector('.sapUiBody').classList.add("sapUiSizeCozy");
		assert.equal(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
		var sGanttId = this.gantt.getId(),
		$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]"),
		///get the initial height of the header
		nGanttHeaderHeight = $GanttHeader.height();
		//change to chart only
		this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);

		$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
		assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
		//disable vertical line
		this.gantt.setEnableVerticalLine(false);

		$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
		assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
		//enable vertical line
		this.gantt.setEnableVerticalLine(true);

		$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
		assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
		document.querySelector('.sapUiBody').classList.remove("sapUiSizeCozy");
		document.querySelector('.sapUiBody').classList.add("sapUiSizeCompact");
	});

	QUnit.test("Test isShapeVisible", function(assert){
		var oGanttChartWithTable = this.gantt,
			oShape0 = new BaseRectangle(),
			oShape1 = new BaseText(),
			oShapeCalendar = new BaseCalendar({
				calendarName: "nonWorkingCal"
			});
		sinon.stub(oShapeCalendar, "getGanttChartBase").returns(oGanttChartWithTable);

		assert.expect(7);

		assert.ok(oGanttChartWithTable.isShapeVisible(oShape0));
		oShape0.setVisible(false);
		assert.notOk(oGanttChartWithTable.isShapeVisible(oShape0));

		assert.ok(oGanttChartWithTable.isShapeVisible(oShape1));
		oShape1.setVisible(false);
		assert.notOk(oGanttChartWithTable.isShapeVisible(oShape1));

		assert.ok(oGanttChartWithTable.isShapeVisible(oShapeCalendar));
		oShapeCalendar.setVisible(false);
		assert.ok(oGanttChartWithTable.isShapeVisible(oShapeCalendar));
		oShapeCalendar.setCalendarName();
		assert.notOk(oGanttChartWithTable.isShapeVisible(oShapeCalendar));
	});

	QUnit.test("Test isCalendarTimeIntervalVisible" , function(assert){
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var aTimeRange = this.gantt.getRenderedTimeRange();
			//Interval within timerange
			var oTestTimeInterval1 = new TimeInterval({
				startTime: Format.dateToAbapTimestamp(new Date(aTimeRange[0].getTime())),
				endTime: Format.dateToAbapTimestamp(new Date(aTimeRange[1].getTime()))
			});
			//Start time within time range
			var oTestTimeInterval2 = new TimeInterval({
				startTime: Format.dateToAbapTimestamp(new Date(aTimeRange[0].getTime())),
				endTime: Format.dateToAbapTimestamp(new Date(aTimeRange[1].getTime() + 5 * 60 * 1000))
			});
			//EndTime within time range
			var oTestTimeInterval3 = new TimeInterval({
				startTime: Format.dateToAbapTimestamp(new Date(aTimeRange[0].getTime() - 5 * 60 * 1000)),
				endTime: Format.dateToAbapTimestamp(new Date(aTimeRange[1].getTime()))
			});
			//Start time less than and end time greater than time range
			var oTestTimeInterval4 = new TimeInterval({
				startTime: Format.dateToAbapTimestamp(new Date(aTimeRange[0].getTime() - 5 * 60 * 1000)),
				endTime: Format.dateToAbapTimestamp(new Date(aTimeRange[1].getTime() + 5 * 60 * 1000))
			});
			// Time interval not within time range
			var oTestTimeInterval5 = new TimeInterval({
				startTime: Format.dateToAbapTimestamp(new Date(aTimeRange[0].getTime() - 10 * 60 * 1000)),
				endTime: Format.dateToAbapTimestamp(new Date(aTimeRange[0].getTime() - 5 * 60 * 1000))
			});
			assert.ok(this.gantt.isCalendarTimeIntervalVisible(oTestTimeInterval1), "Time interval is within the range");
			assert.ok(this.gantt.isCalendarTimeIntervalVisible(oTestTimeInterval2), "Time interval is within the range");
			assert.ok(this.gantt.isCalendarTimeIntervalVisible(oTestTimeInterval3), "Time interval is within the range");
			assert.ok(this.gantt.isCalendarTimeIntervalVisible(oTestTimeInterval4), "Time interval is within the range");
			assert.notOk(this.gantt.isCalendarTimeIntervalVisible(oTestTimeInterval5), "Time interval is not within the range");
			done();
		}.bind(this));
	});

	QUnit.test("Test selectionPanelSize of gantt when gantt chart becomes invisible", function (assert) {
		var sSelectionPanelSize = "75%";
		this.gantt.setSelectionPanelSize(sSelectionPanelSize);
		var aSplitterContentAreas = this.gantt._oSplitter.getContentAreas(),
			sTableSize = aSplitterContentAreas[0].getLayoutData().getSize(),
			sChartSize = aSplitterContentAreas[1].getLayoutData().getSize();
		var oGanttDom = this.gantt.getDomRef();
		oGanttDom.style.display = "none";
		this.gantt._onResize(false);	// Simulate _onResize trigerred from ResizeHandler
		assert.strictEqual(this.gantt.getSelectionPanelSize(), sSelectionPanelSize, "SelectionPanelSize remains constant after navigating out of gantt");
		oGanttDom.style.display = "";
		this.gantt._onResize(false);	// Simulate _onResize trigerred from ResizeHandler
		assert.strictEqual(this.gantt.getSelectionPanelSize(), sSelectionPanelSize, "SelectionPanelSize remains constant after navigating back to gantt");
		assert.strictEqual(this.gantt._oSplitter.getContentAreas()[0].getLayoutData().getSize(), sTableSize, "Table size remains same after navigating back to gantt");
		assert.strictEqual(this.gantt._oSplitter.getContentAreas()[1].getLayoutData().getSize(), sChartSize, "Chart size remains same after navigating back to gantt");
	});


	QUnit.test("Inner gantt rendering after _addBackTasksToRows", function (assert) {
		var done = assert.async();
		var oToolbar = this.oGanttChartContainer.getToolbar();
		this.gantt.setEnablePseudoShapes(true);
		oToolbar.setShowSearchButton(true);
		oToolbar.setFindMode("SidePanel");
		oToolbar.attachGanttSidePanel(function(oEvent) {
			oEvent.getParameters().updateSidePanelState.enable();
		});
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var addBackTasksToRowsSpy = sinon.spy(this.gantt, "_addBackTasksToRows");
			var innerGanttInvalidateSpy = sinon.spy(this.gantt.getInnerGantt().getRenderer(), "render");
			this.gantt.attachEventOnce("renderingComplete", function () {
				assert.ok(addBackTasksToRowsSpy.calledOnce, "_addBackTasksToRows called once");
				assert.ok(innerGanttInvalidateSpy.calledOnce, "inner gantt render called once");
				assert.ok(innerGanttInvalidateSpy.calledAfter(addBackTasksToRowsSpy), "Inner gantt rendered after _addBackTasksToRows");
				addBackTasksToRowsSpy.restore();
				innerGanttInvalidateSpy.restore();
				done();
			}, this);
			oToolbar._oSearchButton.firePress();
		}.bind(this));
	});

	QUnit.test("Inner gantt rendering after rowSettingsTemplate rerendered", function (assert) {
		var done = assert.async();
		this.gantt.setEnablePseudoShapes(true);
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var addBackTasksToRowsSpy = sinon.spy(this.gantt, "_addBackTasksToRows");
			var innerGanttInvalidateSpy = sinon.spy(this.gantt.getInnerGantt().getRenderer(), "render");
			this.gantt.attachEventOnce("renderingComplete", function () {
				assert.ok(addBackTasksToRowsSpy.calledOnce, "_addBackTasksToRows called once");
				assert.ok(innerGanttInvalidateSpy.calledOnce, "inner gantt render called once");
				assert.ok(innerGanttInvalidateSpy.calledAfter(addBackTasksToRowsSpy), "Inner gantt rendered after _addBackTasksToRows");
				addBackTasksToRowsSpy.restore();
				innerGanttInvalidateSpy.restore();
				done();
			}, this);
			this.gantt.rerender();
		}.bind(this));
	});

	QUnit.module("onSplitterResize", {
		before: function() {
			// set fixed width to prevent different Gantt rendering on different window sizes
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: function() {
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.gantt = GanttQUnitUtils.createGantt();
			this.oEvent = {};
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
			this.oEvent.destroy();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});

	QUnit.test("Splitter resize - test drawing scenario when both content area size changes", function (assert) {
		//Old and new size changed for both content areas of Spltiter
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
		var mParams = {
			id: this.gantt._oSplitter,
			oldSizes: [100, 400],
			newSizes: [200, 300]
		};
		sinon.stub(this.gantt, "_draw");
		this.oEvent = new Event("resize", this.gantt._oSplitter, mParams);
		//on SplitterResize
		this.gantt.onSplitterResize(this.oEvent);
		assert.ok(this.gantt._draw.calledOnce);
		}.bind(this));
	});

	QUnit.test("Splitter resize - test drawing scenario when only one content area size changes - Gantt", function (assert) {
		//Old and new size changed for both content areas of Spltiter
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
		var mParams = {
			id: this.gantt._oSplitter,
			oldSizes: [100, 400],
			newSizes: [100, 300]
		};
		sinon.stub(this.gantt, "_draw");
		this.oEvent = new Event("resize", this.gantt._oSplitter, mParams);
		//on SplitterResize
		this.gantt.onSplitterResize(this.oEvent);
		assert.ok(this.gantt._draw.calledOnce);
		}.bind(this));
	});

	QUnit.test("Splitter resize - test drawing scenario when only one content area size changes - Table", function (assert) {
		//Old and new size changed for both content areas of Spltiter
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
		var mParams = {
			id: this.gantt._oSplitter,
			oldSizes: [100, 400],
			newSizes: [200, 400]
		};
		sinon.stub(this.gantt, "_draw");
		this.oEvent = new Event("resize", this.gantt._oSplitter, mParams);
		//on SplitterResize
		this.gantt.onSplitterResize(this.oEvent);
		assert.ok(this.gantt._draw.calledOnce);
		}.bind(this));
	});

	QUnit.test("Splitter resize - test drawing scenario when no content area size changes", function (assert) {
		//Old and new size changed for both content areas of Spltiter
		var mParams = {
			id: this.gantt._oSplitter,
			oldSizes: [100, 400],
			newSizes: [100, 400]
		};
		sinon.stub(this.gantt, "_draw");
		this.oEvent = new Event("resize", this.gantt._oSplitter, mParams);
		//on SplitterResize
		this.gantt.onSplitterResize(this.oEvent);
		assert.ok(this.gantt._draw.notCalled);
	});

	QUnit.module("visibleHorizonUpdate event", {
        beforeEach: function () {
            var oShape = [
                new BaseRectangle({
                    shapeId: "0",
                    time: Format.abapTimestampToDate("20181002000000"),
                    endTime: Format.abapTimestampToDate("20181022000000"),
                    height: 20
                })];
            this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20131001000000", "20251129000000");
            this.gantt.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.gantt.destroy();
            this.gantt = null;
        }
    });

    QUnit.test("HorizontalScroll fired", function (assert) {
        var fnDone = assert.async();
        var oOriginalHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone();
        GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.attachEventOnce("visibleHorizonUpdate", function (oEvent) {
				assert.equal(oEvent.getParameter("type"), VisibleHorizonUpdateType.HorizontalScroll, "HorizontalScroll event should have happened.");
				assert.ok(oOriginalHorizon.equals(oEvent.getParameter("lastVisibleHorizon")), "HorizontalScroll event should have happened.");
				assert.ok(this.gantt.getAxisTimeStrategy().getVisibleHorizon().equals(oEvent.getParameter("currentVisibleHorizon")), "Current VisibleHorizon should be correct.");
				assert.notOk(oEvent.getParameter("lastVisibleHorizon").equals(oEvent.getParameter("currentVisibleHorizon")), "Visible horizon should have changed.");
				fnDone();
			}, this);
			this.gantt.$("hsb").scrollLeft(1000);
        }.bind(this));
    });

	QUnit.test("InitialRender fired", function (assert) {
		var fnDone = assert.async();
		var oOriginalHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone();
		this.gantt.attachVisibleHorizonUpdate(function (oEvent) {
			assert.equal(oEvent.getParameter("type"), VisibleHorizonUpdateType.InitialRender, "InitialRender event should have happened.");
			assert.ok(oOriginalHorizon.equals(oEvent.getParameter("lastVisibleHorizon")), "HorizontalScroll event should have happened.");
			assert.ok(oEvent.getParameter("lastVisibleHorizon").equals(oEvent.getParameter("currentVisibleHorizon")), "Visible horizon should have changed.");
			fnDone();
		});
	});

	QUnit.test("TotalHorizonUpdated fired", function (assert) {
		var fnDone = assert.async();
		var oOriginalHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone();
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.attachVisibleHorizonUpdate(function (oEvent) {
				if (oEvent.getParameter("type") === VisibleHorizonUpdateType.TotalHorizonUpdated) {
					assert.ok(true, "Correct event should get fired");
					fnDone();
				}
			});
			this.gantt.getAxisTimeStrategy().setTotalHorizon(oOriginalHorizon);
		}.bind(this));
	});

	QUnit.module("visibleHorizonUpdate event for zoom", {
		beforeEach: async function () {
			this.gantt = GanttQUnitUtils.createGantt();
			await nextUIUpdate();
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Zoomlevel changed subReason as ZoomIn", function (assert) {
		var fnDone = assert.async();
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.attachVisibleHorizonUpdate(function (oEvent) {
				if (oEvent.getParameter("type") === VisibleHorizonUpdateType.ZoomLevelChanged) {
					assert.equal(oEvent.getParameter("subType"), VisibleHorizonUpdateSubType.ZoomIn, "Correct subType is set");
					fnDone();
				}
			});
			var iZoomLevel = this.gantt.getAxisTimeStrategy().getZoomLevel();
			this.gantt.getAxisTimeStrategy().setZoomLevel(iZoomLevel + 1);
		}.bind(this));
	});

	QUnit.test("Zoomlevel changed subReason as ZoomOut", function (assert) {
		var fnDone = assert.async();
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.attachVisibleHorizonUpdate(function (oEvent) {
				if (oEvent.getParameter("type") === VisibleHorizonUpdateType.ZoomLevelChanged) {
					assert.equal(oEvent.getParameter("subType"), VisibleHorizonUpdateSubType.ZoomOut, "Correct subType is set");
				fnDone();
				}
			});
			var iZoomLevel = this.gantt.getAxisTimeStrategy().getZoomLevel();
			this.gantt.getAxisTimeStrategy().setZoomLevel(iZoomLevel - 1);
		}.bind(this));
	});


	QUnit.module("VH Update on zoom level Zero", {
		before: function(){
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: async function () {
			this.gantt = GanttQUnitUtils.createGantt();
			this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20220101000000",
					endTime: "20221231000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20220501000000",
					endTime: "20221101000000"
				})
			}));
			this.gantt.placeAt("qunit-fixture");
			document.getElementById("qunit-fixture").style.width = "1920px";
			await nextUIUpdate();
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		after: function(){
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});

	QUnit.test("VH Update on zoom level Zero", function (assert) {
		var fnDone = assert.async();
		var currentTotalStartTime = this.gantt.getAxisTimeStrategy().getTotalHorizon().getStartTime();
		var currentTotalEndTime = this.gantt.getAxisTimeStrategy().getTotalHorizon().getEndTime();
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.getAxisTimeStrategy().setZoomLevel(0);
			GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var visibleHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon(), totalHorizon = this.gantt.getAxisTimeStrategy().getTotalHorizon();
				assert.equal(visibleHorizon.getStartTime(),currentTotalStartTime, "VH start time is set properly");
				assert.equal(visibleHorizon.getEndTime(),currentTotalEndTime,  "VH end time is set properly");
				assert.equal(totalHorizon.getStartTime(),currentTotalStartTime,  "TH start time is set properly");
				assert.equal(totalHorizon.getEndTime(),currentTotalEndTime,  "TH end time is set properly");
				fnDone();
			}.bind(this));
		}.bind(this));
	});

	//qunits for testing align shapes value
    QUnit.module("GanttChart Tasks", {
        beforeEach: function() {
        },
        afterEach: function() {
			this.gantt.destroy();
        }
    });

    //qunit for alignShape as default
    QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be set as default which would be on middle", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "SummaryExpanded",
                height: 20
			}),
			new Task({
                shapeId: "1",
                time: Format.abapTimestampToDate("20181102000000"),
                endTime: Format.abapTimestampToDate("20181122000000"),
                type: "SummaryCollapsed",
                height: 20
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
		var fnDone = assert.async();

        var oGantt = this.gantt;
		var aAllNonExpandedShapeUids = [
			"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
			"PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
		];
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var iIndex = 0;
				var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
				assert.equal(currentText, true, "Default Shapes should be Aligned to the Middle");
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXStart is set correctly");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXEnd is set correctly");
			});
			fnDone(); // need to wait because Table updates its rows async
		});
    });

    //qunit for alignShape as botttom
    QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the bottom", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "SummaryExpanded",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Bottom
            }),
			new Task({
                shapeId: "1",
				time: Format.abapTimestampToDate("20181102000000"),
                endTime: Format.abapTimestampToDate("20181122000000"),
                type: "SummaryCollapsed",
				height: 20,
				alignShape : sap.gantt.simple.shapes.ShapeAlignment.Bottom
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var iIndex = 0;
				var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) + (oShape._iBaseRowHeight / 2) - ((oShape.getPixelHeight() - oShape.getRowPadding()) / 2));
				assert.equal(currentText,true,"Shape Aligned to the Bottom");
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXStart is set correctly");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXEnd is set correctly");
			});
			fnDone(); // need to wait because Table updates its rows async
        });
    });

	//qunit for alignShape as top
    QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the top", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "SummaryExpanded",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Top
            }),
			new Task({
                shapeId: "1",
				time: Format.abapTimestampToDate("20181102000000"),
                endTime: Format.abapTimestampToDate("20181122000000"),
                type: "SummaryCollapsed",
				height: 20,
				alignShape : sap.gantt.simple.shapes.ShapeAlignment.Top
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var iIndex = 0;
				var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) - (oShape._iBaseRowHeight / 2) + ((oShape.getPixelHeight() - oShape.getRowPadding()) / 2));
				assert.equal(currentText,true,"Shape Aligned to the Top");
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXStart is set correctly");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXEnd is set correctly");
			});
			fnDone();
        });
    });

	//qunit for alignShape as center
    QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the Middle", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "SummaryExpanded",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Middle
            }),
			new Task({
                shapeId: "1",
                time: Format.abapTimestampToDate("20181102000000"),
                endTime: Format.abapTimestampToDate("20181122000000"),
                type: "SummaryCollapsed",
				height: 20,
				alignShape : sap.gantt.simple.shapes.ShapeAlignment.Middle
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var iIndex = 0;
				var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
				assert.equal(currentText,true,"Shape Aligned to the Middle");
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXStart is set correctly");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXEnd is set correctly");
			});
			fnDone();
        });
    });

    //qunit for type normal. It should always be middle aligned
    QUnit.test("Gantt Chart Tasks for type normal with Bottom Alignment", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "Normal",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Bottom
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var iIndex = 0;
				var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
				assert.equal(currentText,true,"Shape Aligned to the Middle");
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXStart is set correctly");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXEnd is set correctly");
			});
			fnDone();
        });
    });

    //qunit for task for type error. It should always be middle aligned.
    QUnit.test("Gantt Chart Tasks for type error with Top Alignment", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "Error",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Top
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var iIndex = 0;
				var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
				assert.equal(currentText,true,"Shape Aligned to the Middle");
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXStart is set correctly");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXEnd is set correctly");
			});
			fnDone();
        });
    });

	//qunit with default align shape with type as error. It should be middle aligned
    QUnit.test("Gantt Chart Tasks for type error", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "Error",
                height: 20
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var aAllNonExpandedShapeUids = [
				"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
			];
			GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var iIndex = 0;
				var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
				assert.equal(currentText,true,"Shape Aligned to the Middle");
				assert.equal(oShape.getXStart(), oShape.getAxisTime().timeToView(oShape.getTime()), "Shape getXStart is set correctly");
				assert.equal(oShape.getXEnd(), oShape.getAxisTime().timeToView(oShape.getEndTime()), "Shape getXEnd is set correctly");
				});
			fnDone();
        });
	});

	QUnit.module("GanttChart shapes visibility check", {
        beforeEach: function() {
				this.gantt = new GanttChartWithTable({
					id: "gantt",
					table: new Table({
						id: "table",
						columns: new Column({
							width: "250px",
							label: new Label({ text: "Text" }),
							template: new Label({
								text: "{text}"
							})
						}),
						rows: {
							path: "/children"
						},
						rowSettingsTemplate: new GanttRowSettings({
							rowId: "{id}",
							shapes1: new BaseRectangle({
								shapeId: "{task/id}",
								time: "{task/startTime}",
								endTime: "{task/endTime}",
								type: "{task/type}"
							})
						})
					}),
					axisTimeStrategy: new ProportionZoomStrategy({
						totalHorizon: new TimeHorizon({
							startTime: 20181001000000,
							endTime: 20181129000000
						}),
						visibleHorizon: new TimeHorizon({
							startTime: 20181001000000,
							endTime: 20181129000000
						})
					})
				});
				this.gantt.setModel(new JSONModel({
					id: "root",
					children: [
							{
								id: "line1",
								text: "Normal Task",
								task:{
										id: "0",
										startTime: Format.abapTimestampToDate("20181101090000"),
										endTime: Format.abapTimestampToDate("20181127090000"),
										type: "SummaryExpanded"
									},
									relationship: {
										RelationID: "rls-0",
										PredecTaskID: "0",
										SuccTaskID: "1",
										RelationType: "StartToFinish"
									}
							},
							{
								id: "line2",
								text: "Error Task",
								task: {
										id: "1",
										startTime: Format.abapTimestampToDate("20181101090000"),
										endTime: Format.abapTimestampToDate("20181127090000"),
										type: "SummaryExpanded"
									}
							}
					],
					relationship: {
						RelationID: "rls-0",
						PredecTaskID: "0",
						SuccTaskID: "1",
						RelationType: "StartToFinish"
					}
				}));
			this.gantt.placeAt("qunit-fixture");
        },
        afterEach: function() {
			this.gantt.destroy();
        }
    });

	QUnit.test("Testing shapes visibility on setRowSettingsTemplate", function (assert) {
		var oGantt = this.gantt;
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(async function () {
			assert.ok(oGantt.getTable().getRows()[0].getAggregation("_settings").getRelationships().length === 0);
			var oResRowSettings = oGantt.getTable().getRowSettingsTemplate();
			oResRowSettings.bindAggregation("relationships", {
				path: "/relationship",
				template: new Relationship({
					type: "{/RelationType}",
					predecessor: "{/PredecTaskID}",
					successor: "{/SuccTaskID}",
					shapeId:"{/RelationID}"
				}),
				templateShareable: false
			});
			oGantt.setRowSettingsTempWithInvalid(oResRowSettings);
			await nextUIUpdate();

			assert.ok(oGantt.getTable().getRows()[0].getAggregation("_settings").getRelationships().length !== 0);
			assert.ok(document.getElementsByClassName("sapGanttChartShapes")[0].childElementCount > 0, "Shapes should not disapper after setting RowSettingsTemplate");
		});
    });

	/**
	 * @deprecated since 1.119
	 */
	QUnit.test("Testing VisibleRowCountMode update in absence of rowMode aggregation ", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(async function () {
			this.gantt.getTable().setVisibleRowCountMode("Interactive");
			this.gantt.getTable().setRowHeight(170);
			this.gantt.getTable().setMinAutoRowCount(12);
			this.gantt.setHeight("300px");
			await nextUIUpdate();
			assert.ok(this.gantt.getTable().getVisibleRowCountMode() == "Auto", "VisibleRowCountMode is set to Auto");
			assert.ok(this.gantt.getTable().getRowHeight() == 170, "rowHeight is retained");
			assert.ok(this.gantt.getTable().getMinAutoRowCount() == 1, "MinAutoRowCount is reset to 1");
		}.bind(this));
    });

	QUnit.module("GanttChart with fixed height", {
		beforeEach: async function () {
			var oShape = [
				        new Task({
				            shapeId: "0",
				            time: Format.abapTimestampToDate("20181002000000"),
				            endTime: Format.abapTimestampToDate("20181022000000"),
				            type: "Error",
				            height: 20
				        })];
			this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181229000000");
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("GanttChart with fixed GanttChartWithTable height and visibleRowCountMode Auto", async function (assert) {
		this.gantt.getAxisTimeStrategy().setVisibleHorizon(new TimeHorizon({
			startTime: "20181001000000",
			endTime: "20181129000000"
		}));

		assert.ok("VisibleHorizon of the GanttChart is updated");
		this.gantt.getTable().setRowMode(new FixedRowMode({rowContentHeight : 110, minRowCount : 12}));
		this.gantt.setHeight("200px");
		await nextUIUpdate();

		var splitterHeight = parseInt(this.gantt.getAggregation("_splitter").getDomRef().querySelector(".sapUiLoSplitterBar").style.height);
		var ganttDom = this.gantt.getSyncedControl().getDomRefs();
		var GanttContainerHeight = parseInt(window.getComputedStyle(ganttDom.header).height) + parseInt(window.getComputedStyle(ganttDom.content).height) + parseInt(window.getComputedStyle(ganttDom.hsbContainer).height);
		var scrollDisplayed = splitterHeight > GanttContainerHeight ? true : false;
		assert.equal(this.gantt.getHeight(), "200px", "Height of the Gantt is set to 200px");
		assert.ok(this.gantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Auto"), "RowMode is set to Auto");
		assert.ok(this.gantt.getTable().getRowMode().getRowContentHeight() == 110, "rowContentHeight is retained");
		assert.ok(this.gantt.getTable().getRowMode().getMinRowCount() == 1, "minRowCount is reset to 1");
		assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
		this.gantt.getTable().setRowMode(new FixedRowMode());
		this.gantt.setHeight("300px");
		await nextUIUpdate();

		assert.equal(this.gantt.getHeight(), "300px", "Height of the Gantt is set to 300px");
		assert.ok(this.gantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Auto"), "VisibleRowCountMode is set to Auto");
		assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
		this.gantt.getTable().setRowMode(new FixedRowMode());
		this.gantt.setHeight("370px");
		await nextUIUpdate();

		assert.equal(this.gantt.getHeight(), "370px", "Height of the Gantt is set to 370px");
		assert.ok(this.gantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Auto"), "VisibleRowCountMode is set to Auto");
		assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
		this.gantt.getTable().setRowMode(new FixedRowMode());
		this.gantt.setHeight("400px");
		await nextUIUpdate();

		assert.equal(this.gantt.getHeight(), "400px", "Height of the Gantt is set to 400px");
		assert.ok(this.gantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Auto"), "VisibleRowCountMode is set to Auto");
		assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
		this.gantt.getTable().setRowMode(new FixedRowMode());
		this.gantt.setHeight("500px");
		await nextUIUpdate();

		assert.equal(this.gantt.getHeight(), "500px", "Height of the Gantt is set to 500px");
		assert.ok(this.gantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Auto"), "VisibleRowCountMode is set to Auto");
		assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
		this.gantt.getTable().setRowMode(new AutoRowMode({
			minRowCount: 15
		}));
		this.gantt.setHeight("200px");
		await nextUIUpdate();

		assert.equal(this.gantt.getHeight(), "200px", "Height of the Gantt is set to 500px");
		assert.ok(this.gantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Auto"), "VisibleRowCountMode is set to Auto");
		assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");

		this.gantt.getTable().setRowMode(new AutoRowMode({rowContentHeight : 110, minRowCount : 12}));
		this.gantt.setHeight("500px");
		await nextUIUpdate();
		assert.ok(this.gantt.getTable().getRowMode().isA("sap.ui.table.rowmodes.Auto"), "rowMode is set to Auto");
		assert.ok(this.gantt.getTable().getRowMode().getRowContentHeight() == 110, "rowContentHeight is retained");
		assert.ok(this.gantt.getTable().getRowMode().getMinRowCount() == 1, "minRowCount is reset to 1");
	});

	QUnit.module("GanttChart Export Table to Excel - Export Popup, Export Button Positioning", {
		beforeEach: async function () {
			this.gantt = GanttQUnitUtils.createGanttWithOData();
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("Validate scenarios for Export Button Positioning", async function (assert) {
		assert.equal(this.gantt.getShowExportTableToExcel(), false, "ShowExportTableToExcel is false by default.");
		assert.equal(this.gantt.getTable().getExtension().length, 0, "Table doesnot have any extension. No export Button displayed.");
		this.dummyDownloadButton = new OverflowToolbarButton(this.gantt.getId() + "-dummyButton", {
			icon: "sap-icon://download",
			text: "DummyButton",
			tooltip: "DummyButton"
		});
		var oOverFlowToolBar = new OverflowToolbar();
		oOverFlowToolBar.addContent(this.dummyDownloadButton);
		this.gantt.getTable().addExtension(oOverFlowToolBar);
		assert.equal(this.gantt.getShowExportTableToExcel(), false, "ShowExportTableToExcel is false by default.");
		assert.equal(this.gantt.getTable().getExtension().length, 1, "Table has extension created.");
		assert.equal(this.gantt.getTable().getExtension()[0].getContent()[0].getText(), "DummyButton", "Table Dummy Download Button is created.");

		this.gantt.setShowExportTableToExcel(true);
		await nextUIUpdate();

		assert.equal(this.gantt.getShowExportTableToExcel(), true, "ShowExportTableToExcel is changed to true.");
		assert.equal(this.gantt.getTable().getExtension()[0].getContent().length, 2, "Table has 2 extension.");
		assert.equal(this.gantt.getTable().getExtension()[0].getContent()[0].getText(), "DummyButton", "Table Dummy Download Button is created.");
		assert.equal(this.gantt.getTable().getExtension()[0].getContent()[1].getTooltip(), "Export Table To Excel", "Table Export Button is created.");
		assert.equal(this.gantt.oExportTableToExcelButton.getMenu().getItems()[0].getText(), "Export", "Table Export Menu Button is created.");
		assert.equal(this.gantt.oExportTableToExcelButton.getMenu().getItems()[1].getText(), "Export As...", "Table Export Menu Button is created.");

		this.gantt.getTable().getExtension()[0].removeContent(0);

		assert.equal(this.gantt.getShowExportTableToExcel(), true, "ShowExportTableToExcel is changed to true.");
		assert.equal(this.gantt.getTable().getExtension().length, 1, "Table has 1 extension.");
		assert.equal(this.gantt.getTable().getExtension()[0].getContent()[0].getTooltip(), "Export Table To Excel", "Table Export Button is present.");
		assert.equal(this.gantt.oExportTableToExcelButton.getMenu().getItems()[0].getText(), "Export", "Table Export Menu Button is created.");
		assert.equal(this.gantt.oExportTableToExcelButton.getMenu().getItems()[1].getText(), "Export As...", "Table Export Menu Button is created.");

		this.gantt.setShowExportTableToExcel(false);
		await nextUIUpdate();

		assert.equal(this.gantt.getShowExportTableToExcel(), false, "ShowExportTableToExcel is changed to false.");
		assert.equal(this.gantt.getTable().getExtension().length, 0, "Table doesnot have any extension.");
	});

	QUnit.test('Validate Export Dialog Box for default Settings', function(assert) {
		var done = assert.async();

		this.gantt._getExportSettingsViaDialog( function(oExportSettingsDialog) {
			assert.ok(oExportSettingsDialog.isOpen(), 'Export Settings Dialog is open');
			var oExportButton = oExportSettingsDialog.getBeginButton();
			oExportButton.firePress();
			assert.ok(oExportSettingsDialog._bSuccess, 'Export triggered');
			var oEndButton = oExportSettingsDialog.getEndButton();
			oEndButton.firePress();
		}).then(function(oUserConfig) {
			assert.equal(oUserConfig.fileName, "GanttTableExport", 'Promise returned with default filename Standard');
			assert.equal(oUserConfig.fileType[0].key, "xlsx", 'Promise returned with default fileType xlsx');
			done();
		});
	});

	QUnit.test("Validate Export Dialog Box for Custom filename Settings", function(assert) {
		var done = assert.async();

		this.gantt._getExportSettingsViaDialog(function(oExportSettingsDialog) {
			var sLongFileName = 'TestFile';
			var oInput = Element.getElementById(oExportSettingsDialog.getId() + '-fileName');
			oInput.setValue(sLongFileName);
			oInput.fireLiveChange({value: sLongFileName});
			assert.ok(oExportSettingsDialog.isOpen(), 'Export Settings Dialog is open');
			var oExportButton = oExportSettingsDialog.getBeginButton();
			oExportButton.firePress();
			assert.ok(oExportSettingsDialog._bSuccess, 'Export triggered');
		}).then(function(oUserConfig) {
			assert.equal(oUserConfig.fileName, "TestFile", 'Promise returned with filename Standard');
			assert.equal(oUserConfig.fileType[0].key, "xlsx", 'Promise returned with fileType xlsx');
			done();
		});
	});

	QUnit.module("GanttChart Export Table to Excel - JSON Model", {
		beforeEach: async function () {
			this.gantt = GanttQUnitUtils.createGantt();
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("Validate Table Export Button click", async function (assert) {
		this.gantt.setShowExportTableToExcel(true);
		await nextUIUpdate();
		var exportTableButtonSpy = sinon.stub(this.gantt.oExportTableToExcelButton, "fireDefaultAction");
		var exportTableMenuButton1Spy = sinon.stub(this.gantt.oExportTableToExcelButton.getMenu().getItems()[0], "firePress");
		var exportTableMenuButton2Spy = sinon.stub(this.gantt.oExportTableToExcelButton.getMenu().getItems()[1], "firePress");
		this.gantt.oExportTableToExcelButton.getAggregation('_button').firePress();
		this.gantt.oExportTableToExcelButton.getMenu().getItems()[0].firePress();
		this.gantt.oExportTableToExcelButton.getMenu().getItems()[1].firePress();
		assert.ok(exportTableButtonSpy.calledOnce, "Export button Press is called once.");
		assert.equal(this.gantt.oExportTableToExcelButton.getAggregation('_button').getMetadata().getName() === 'sap.m.SplitButton', true, 'Split button.');
		assert.ok(this.gantt.oExportTableToExcelButton.getDomRef().classList.contains('sapMMenuBtnSplit'), 'Split button rendered.');
		assert.ok(exportTableMenuButton1Spy.calledOnce, "Export button Menu1 Press is called once.");
		assert.ok(exportTableMenuButton2Spy.calledOnce, "Export button Menu2 Press is called once.");
		exportTableButtonSpy.restore();
	});

	QUnit.test("Validate column configuration created for Table Export", function (assert) {
		this.gantt.setShowExportTableToExcel(true);
		var customDataCol1 = {key:"exportTableColumnConfig",value:{"columnKey": "Name", "leadingProperty":"Name", "dataType": "string", "wrap": true}};
		var customDataCol2 = {key:"exportTableColumnConfig",value:{"columnKey": "StartDate", "leadingProperty":"StartDate", "dataType": "date", "wrap": true, "displayFormat": "mmm dd, yyyy"}};
		this.gantt.getTable().getColumns()[0].addCustomData(new sap.ui.core.CustomData(customDataCol1));
		this.gantt.getTable().getColumns()[1].addCustomData(new sap.ui.core.CustomData(customDataCol2));
		var oColumns = this.gantt._createColumnConfig();
		for (var i = 0; i < oColumns.length; i++) {
			assert.equal(oColumns[i].label, this.gantt.getTable().getColumns()[i].getLabel().getText(),'Label has been set correctly for column ' + oColumns[i].label );
			assert.equal(oColumns[i].property, this.gantt.getTable().getColumns()[i].data("exportTableColumnConfig").leadingProperty,'Binding Property has been set correctly.');
			assert.ok(oColumns[i].type,'Type has been set correctly.');

			if (oColumns[i].type === "DateTime" || oColumns[i].type === "Date") {
				assert.ok(oColumns[i].format,'Date Format has been set correctly.');
			}
			if (oColumns[i].type === "Boolean") {
				assert.equal(oColumns[i].trueValue, "true",'Value has been set as true.');
				assert.equal(oColumns[i].falseValue, "false",'Value has been set as false.');
			}
			if (oColumns[i].type === "Currency") {
				assert.ok(oColumns[i].unitProperty,'Currency property has been set.');
				assert.equal(oColumns[i].displayUnit, true,'Display currency unit is true.');
			}
		}
	});

	QUnit.module("GanttChart Export Table to Excel - ODATA Model", {
		beforeEach: async function () {
			this.gantt = GanttQUnitUtils.createGanttWithOData();
			this.gantt.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("Validate Table Export Button click", async function (assert) {
		this.gantt.setShowExportTableToExcel(true);
		await nextUIUpdate();
		var exportTableButtonSpy = sinon.stub(this.gantt.oExportTableToExcelButton, "fireDefaultAction");
		var exportTableMenuButton1Spy = sinon.stub(this.gantt.oExportTableToExcelButton.getMenu().getItems()[0], "firePress");
		var exportTableMenuButton2Spy = sinon.stub(this.gantt.oExportTableToExcelButton.getMenu().getItems()[1], "firePress");
		this.gantt.oExportTableToExcelButton.getAggregation('_button').firePress();
		this.gantt.oExportTableToExcelButton.getMenu().getItems()[0].firePress();
		this.gantt.oExportTableToExcelButton.getMenu().getItems()[1].firePress();
		assert.ok(exportTableButtonSpy.calledOnce, "Export button Press is called once.");
		assert.equal(this.gantt.oExportTableToExcelButton.getAggregation('_button').getMetadata().getName() === 'sap.m.SplitButton', true, 'Split button.');
		assert.ok(this.gantt.oExportTableToExcelButton.getDomRef().classList.contains('sapMMenuBtnSplit'), 'Split button rendered.');
		assert.ok(exportTableMenuButton1Spy.calledOnce, "Export button Menu1 Press is called once.");
		assert.ok(exportTableMenuButton2Spy.calledOnce, "Export button Menu2 Press is called once.");
		exportTableButtonSpy.restore();
	});

	QUnit.test("Validate column configuration created for Table Export", function (assert) {
		this.gantt.setShowExportTableToExcel(true);
		var oColumns = this.gantt._createColumnConfig();
		for (var i = 0; i < oColumns.length; i++) {
			assert.equal(oColumns[i].label, this.gantt.getTable().getColumns()[i].getLabel().getText(),'Label has been set correctly for column ' + oColumns[i].label );
			assert.equal(oColumns[i].property, this.gantt.getTable().getColumns()[i].data("exportTableColumnConfig").leadingProperty,'Binding Property has been set correctly.');
			assert.ok(oColumns[i].type,'Type has been set correctly.');

			if (oColumns[i].type === "DateTime" || oColumns[i].type === "Date") {
				assert.ok(oColumns[i].format,'Date Format has been set correctly.');
			}
			if (oColumns[i].type === "Boolean") {
				assert.equal(oColumns[i].trueValue, "true",'Value has been set as true.');
				assert.equal(oColumns[i].falseValue, "false",'Value has been set as false.');
			}
			if (oColumns[i].type === "Currency") {
				assert.ok(oColumns[i].unitProperty,'Currency property has been set.');
				assert.equal(oColumns[i].displayUnit, true,'Display currency unit is true.');
			}
		}
	});

	var fnCreateShapeBindingSettings = function (calendarName, isVisible) {
		return new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					selectable: true,
					connectable: true
				})
			],
			calendars: [
				new BaseCalendar({
					shapeId: "{Id}",
					calendarName: calendarName,
					visible: isVisible != null ? isVisible : true
				})
			]
		});
	};

	QUnit.module("GanttChart Validate CalendarDef", {
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("Check for CalendarDefs in key attribute", function (assert) {
		this.calendarName = "CalendarTest";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.setCalendarDef(new CalendarDefs({
				defs: [
					new Calendar({
						key: this.calendarName,
						color: "grey",
						timeIntervals: new TimeInterval({
							startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
							endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
						})
					})
				]
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
				assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
				for (var i = 0; i < aGanttCalendarElement.length; i++) {
					for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
						if (aGanttCalendarElement[i].style[j] === "fill") {
							assert.equal(aGanttCalendarElement[i].style.fill,
								"url(\"#" + this.gantt.sId + "_" + this.calendarName + "\")", "Calendar Name is set correctly.");
						}
					}
				}
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Check for CalendarDefs in key attribute with space at the beginning.", function (assert) {
		this.calendarName = " CalendarTest";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.setCalendarDef(new CalendarDefs({
				defs: [
					new Calendar({
						key: this.calendarName,
						color: "grey",
						timeIntervals: new TimeInterval({
							startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
							endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
						})
					})
				]
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
				assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
				for (var i = 0; i < aGanttCalendarElement.length; i++) {
					for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
						if (aGanttCalendarElement[i].style[j] === "fill") {
							assert.equal(aGanttCalendarElement[i].style.fill,
								"url(\"#" + this.gantt.sId + "_%20" + this.calendarName.trim() + "\")", "Calendar Name is set correctly.");
						}
					}
				}
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Check for CalendarDefs in key attribute with space in between.", function (assert) {
		this.calendarName = "Calendar Test";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.setCalendarDef(new CalendarDefs({
				defs: [
					new Calendar({
						key: this.calendarName,
						color: "grey",
						timeIntervals: new TimeInterval({
							startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
							endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
						})
					})
				]
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
				assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
				for (var i = 0; i < aGanttCalendarElement.length; i++) {
					for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
						if (aGanttCalendarElement[i].style[j] === "fill") {
							var acalendarName = this.calendarName.split(" ");
							assert.equal(aGanttCalendarElement[i].style.fill,
								"url(\"#" + this.gantt.sId + "_" + acalendarName[0] + "%20" + acalendarName[1] + "\")", "Calendar Name is set correctly.");
						}
					}
				}
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Check for CalendarDefs in key attribute with space in the end.", function (assert) {
		this.calendarName = "CalendarTest ";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.setCalendarDef(new CalendarDefs({
				defs: [
					new Calendar({
						key: this.calendarName,
						color: "grey",
						timeIntervals: new TimeInterval({
							startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
							endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
						})
					})
				]
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
				assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
				for (var i = 0; i < aGanttCalendarElement.length; i++) {
					for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
						if (aGanttCalendarElement[i].style[j] === "fill") {
							assert.equal(aGanttCalendarElement[i].style.fill,
								"url(\"#" + this.gantt.sId + "_" + this.calendarName.trim() + "%20\")", "Calendar Name is set correctly.");
						}
					}
				}
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Check for CalendarDefs in key attribute with space in multiple places.", function (assert) {
		this.calendarName = " Calendar Test ";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.setCalendarDef(new CalendarDefs({
				defs: [
					new Calendar({
						key: this.calendarName,
						color: "grey",
						timeIntervals: new TimeInterval({
							startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
							endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
						})
					})
				]
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
				assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
				for (var i = 0; i < aGanttCalendarElement.length; i++) {
					for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
						if (aGanttCalendarElement[i].style[j] === "fill") {
							var acalendarName = this.calendarName.split(" ");
							assert.equal(aGanttCalendarElement[i].style.fill,
								"url(\"#" + this.gantt.sId + "_%20" + acalendarName[1] + "%20" + acalendarName[2] + "%20\")", "Calendar Name is set correctly.");
						}
					}
				}
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Check for visibility property of BaseCalendar", function (assert) {
		this.calendarName = "CalendarTest";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.setCalendarDef(new CalendarDefs({
				defs: [
					new Calendar({
						key: this.calendarName,
						color: "grey",
						timeIntervals: new TimeInterval({
							startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
							endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
						})
					})
				]
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
				assert.ok(aGanttCalendarElement != null, "Base Calendar are visible.");
				for (var i = 0; i < aGanttCalendarElement.length; i++) {
					for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
						if (aGanttCalendarElement[i].style[j] === "fill") {
							assert.equal(aGanttCalendarElement[i].style.fill,
								"url(\"#" + this.gantt.sId + "_" + this.calendarName + "\")", "Calendar Name is set correctly.");
						}
					}
				}
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Check for visibility property of BaseCalendar", function (assert) {
		this.calendarName = "CalendarTest";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName, false));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			this.gantt.setCalendarDef(new CalendarDefs({
				defs: [
					new Calendar({
						key: this.calendarName,
						color: "grey",
						timeIntervals: new TimeInterval({
							startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
							endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
						})
					})
				]
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var aGanttCalendarElementLength = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes.length;
				assert.equal(aGanttCalendarElementLength, 0, "Base Calendar are not visible.");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Interaction - BaseShape", {
		beforeEach: function () {
			this.sut = GanttQUnitUtils.createGantt(true);
			this.sut.placeAt("qunit-fixture");
			return GanttQUnitUtils.waitForGanttRendered(this.sut);
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		getFirstShape: function () {
			var oFirstShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			return oFirstShape;
		}
	});

	QUnit.test("handleShapeMouseEnter", function (assert) {
		assert.expect(2);
		var oRect = this.getFirstShape();
		var mParam = {
			shape: oRect,
			ctrlOrMeta: false
		};

		this.sut.handleShapeMouseEnter(mParam);
		assert.strictEqual(oRect.getSelected(), false, "Shape is not selected and is hovered");

		oRect.setDraggable(true);
		this.sut.handleShapeMouseEnter(mParam);
		assert.strictEqual(document.body.style.cursor, "move", "Shape is draggable and is hovered. The cursor style is set to 'move'");
	});
	QUnit.test("handleShapeMouseLeave", function (assert) {
		assert.expect(2);
		var oRect = this.getFirstShape();
		var mParam = {
			shape: oRect,
			ctrlOrMeta: false
		};
		oRect.setDraggable(true);
		this.sut.handleShapeMouseEnter(mParam);
		assert.strictEqual(document.body.style.cursor, "move", "Shape is draggable and is hovered. The cursor style is set to 'move'");

		this.sut.handleShapeMouseLeave(mParam);
		assert.strictEqual(document.body.style.cursor, "default", "Cursor is moved out of the shape. The cursor style is set to 'default'");
	});

	QUnit.module("Vertical Scrollbar Container Visibility for multiple gantt charts", {
		before: function () {
			this.iTestContainerHeight = document.getElementById("qunit-fixture").style.height;
		},
		beforeEach: function () {
			this.oGanttChartContainer = new GanttChartContainer({
				ganttCharts: [
					new GanttChartWithTable({
						table: new TreeTable({
							columns: [
								new Column({
									label: new Label({
										text: "Name"
									}),
									template: new Label({
										text: "{name}"
									})
								}),
								new Column({
									label: new Label({
										text: "Description"
									}),
									template: new Label({
										text: "{description}"
									})
								})
							],
							selectionMode: TableSelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape1ID}",
								shapes1: new BaseChevron({
									shapeId: "{Chevron1ID}",
									time: "{Chevron1StartDate}",
									endTime: "{Chevron1EndDate}",
									title: "{Chevron1Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								}),
								shapes2: new BaseRectangle({
									shapeId: "{Rectangle1ID}",
									time: "{Rectangle1StartDate}",
									endTime: "{Rectangle1EndDate}",
									title: "{Rectangle1Desc}",
									fill: "#0092D1",
									countInBirdEye: false
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20170101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150301000000",
								endTime: "20150901000000"
							})
						})
					}),
					new GanttChartWithTable({
						table: new TreeTable({
							columns: [
								new Column({
									label: new Label({
										text: "Name"
									}),
									template: new Label({
										text: "{name}"
									})
								}),
								new Column({
									label: new Label({
										text: "Description"
									}),
									template: new Label({
										text: "{description}"
									})
								})
							],
							selectionMode: TableSelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape2ID}",
								shapes1: new BaseChevron({
									shapeId: "{Chevron2ID}",
									time: "{Chevron2StartDate}",
									endTime: "{Chevron2EndDate}",
									title: "{Chevron2Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20170101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150301000000",
								endTime: "20150901000000"
							})
						})
					})
				]
			});
			var sHeight = "100%";
			document.getElementById("qunit-fixture").style.height = sHeight;


			var oData = {
				root: {
					name: "root",
					description: "root description",
					0: {
						name: "item1",
						description: "item1 description",
						Shape1ID: "0",
						Chevron1ID: "0-0",
						Chevron1StartDate: new Date(2015, 4, 20),
						Chevron1EndDate: new Date(2015, 5, 21),
						Chevron1Desc: "Test Chevron 1",
						Rectangle1ID: "0-1",
						Rectangle1StartDate: new Date(2015, 2, 20),
						Rectangle1EndDate: new Date(2015, 3, 21),
						Rectangle1Desc: "Test Rectangle 1",
						Shape2ID: "1",
						Chevron2ID: "1-0",
						Chevron2StartDate: new Date(2015, 6, 20),
						Chevron2EndDate: new Date(2015, 7, 21),
						Chevron2Desc: "Test Chevron 2"
					}
				}
			};

			var oModel = new JSONModel();
			oModel.setData(oData);
			this.oGanttChartContainer.setModel(oModel);
			this.oGanttChartContainer.placeAt("qunit-fixture");
			return GanttQUnitUtils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0], true);
		},
		afterEach: function () {
			this.oGanttChartContainer.destroy();
		},
		after: function () {
			document.getElementById("qunit-fixture").style.height = this.iTestContainerHeight;
		}
	});

	QUnit.test("No vertical scrollbar for both the gantt charts", function (assert) {
		var done = assert.async();
		var oGantt1 = this.oGanttChartContainer.getGanttCharts()[0];
		var oGantt2 = this.oGanttChartContainer.getGanttCharts()[1];
		var oVScrollBarForGantt1 = oGantt1.getTable()._getScrollExtension().getVerticalScrollbar(),
			oVScrollBarForGantt2 = oGantt2.getTable()._getScrollExtension().getVerticalScrollbar(),
			aVSBContainerClassListForGantt1 = oVScrollBarForGantt1.parentElement.classList,
			aVSBClassListForGantt1 = oVScrollBarForGantt1.classList,
			aVSBContainerClassListForGantt2 = oVScrollBarForGantt2.parentElement.classList,
			aVSBClassListForGantt2 = oVScrollBarForGantt2.classList;
		assert.strictEqual(aVSBContainerClassListForGantt1.contains("sapUiTableHidden") && !aVSBContainerClassListForGantt1.contains("sapGanttTableVerticalScrollBarContainer") && !aVSBClassListForGantt1.contains("sapGanttTableVerticalScrollBar"), true, "Vertical scrollbar is not visible for 1st gantt chart");
		assert.strictEqual(aVSBContainerClassListForGantt2.contains("sapUiTableHidden") && !aVSBContainerClassListForGantt2.contains("sapGanttTableVerticalScrollBarContainer") && !aVSBClassListForGantt2.contains("sapGanttTableVerticalScrollBar"), true, "Vertical scrollbar is not visible for 1st gantt chart");
		done();
	});

	QUnit.test("Vertical scrollbar for 1st gantt chart and only vsb container for 2nd gantt chart", function (assert) {
		var done = assert.async();
		var oGantt1 = this.oGanttChartContainer.getGanttCharts()[0];
		var oGantt2 = this.oGanttChartContainer.getGanttCharts()[1];
		oGantt1.setHeight("10%");
		oGantt1.getTable().expandToLevel(1);
		return GanttQUnitUtils.waitForGanttRendered(oGantt1).then(function () {
			var oVScrollBarForGantt1 = oGantt1.getTable()._getScrollExtension().getVerticalScrollbar(),
				oVScrollBarForGantt2 = oGantt2.getTable()._getScrollExtension().getVerticalScrollbar(),
				aVSBContainerClassListForGantt1 = oVScrollBarForGantt1.parentElement.classList,
				aVSBClassListForGantt1 = oVScrollBarForGantt1.classList,
				aVSBContainerClassListForGantt2 = oVScrollBarForGantt2.parentElement.classList,
				aVSBClassListForGantt2 = oVScrollBarForGantt2.classList;
			assert.strictEqual(!aVSBContainerClassListForGantt1.contains("sapUiTableHidden") && !aVSBContainerClassListForGantt1.contains("sapGanttTableVerticalScrollBarContainer") && !aVSBClassListForGantt1.contains("sapGanttTableVerticalScrollBar"), true, "Vertical scrollbar is visible for 1st gantt chart");
			assert.strictEqual(aVSBContainerClassListForGantt2.contains("sapUiTableHidden") && aVSBContainerClassListForGantt2.contains("sapGanttTableVerticalScrollBarContainer") && aVSBClassListForGantt2.contains("sapGanttTableVerticalScrollBar"), true, "Only vertical scrollbar container is visible for 2nd gantt chart");
			done();
		});
	});

	QUnit.test("Testing Ganttcharts container's sync", function (assert) {
		var done = assert.async();
		this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		document.getElementById("qunit-fixture").style.width = "1427px";
		document.getElementById("qunit-fixture").style.width = "1727px";
		assert.ok(this.oGanttChartContainer.getGanttCharts()[0].getAggregation("_splitter").getContentAreas()[0].getLayoutData().getSize() ===
			this.oGanttChartContainer.getGanttCharts()[1].getAggregation("_splitter").getContentAreas()[0].getLayoutData().getSize());
		document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		done();
	});

	QUnit.module("Zoom level of container toolbar", {
		before: function () {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: function () {
			this.oGanttChartContainer = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showDisplayTypeButton: true
				}),
				ganttCharts: [
					GanttQUnitUtils.createGantt(true)
				]
			});
			var sWidth = "1600px";
			document.getElementById("qunit-fixture").style.width = sWidth;
			this.oPanel = new Panel({
				width: sWidth,
				content: [this.oGanttChartContainer]
			});
			this.oPanel.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oGanttChartContainer.destroy();
			this.oPanel.destroy();
		},
		after: function () {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});

	QUnit.test("Test initial zoom level and timeline option for different display types", function (assert) {
		var oGantt = this.oGanttChartContainer.getGanttCharts()[0];
		oGantt.getAxisTimeStrategy().getTotalHorizon().setStartTime("20171001000000");
		oGantt.getAxisTimeStrategy().getTotalHorizon().setEndTime("20191129000000");
		oGantt.getAxisTimeStrategy().getVisibleHorizon().setStartTime("20181001000000");
		oGantt.getAxisTimeStrategy().getVisibleHorizon().setEndTime("20181129000000");
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var iZoomLevel = this.oGanttChartContainer.getToolbar().getZoomLevel();
			assert.equal(iZoomLevel, 2, "Zoom level is correct on container toolbar for display type Both");
			var oTimeLineOption = oGantt.getAxisTimeStrategy().getTimeLineOption();
			oGantt.setDisplayType("Table");
			iZoomLevel = this.oGanttChartContainer.getToolbar().getZoomLevel();
			assert.equal(iZoomLevel, 2, "Zoom level is correct on container toolbar for display type Table");
			assert.equal(oGantt.getAxisTimeStrategy().getTimeLineOption(), oTimeLineOption, "Timeline option is correct after changing display type to Table");
			oGantt.setDisplayType("Chart");
			iZoomLevel = this.oGanttChartContainer.getToolbar().getZoomLevel();
			assert.equal(iZoomLevel, 2, "Zoom level is correct on container toolbar for display type Chart");
			assert.equal(oGantt.getAxisTimeStrategy().getTimeLineOption(), oTimeLineOption, "Timeline option is correct after changing display type to Chart");
		}.bind(this));
	});

	QUnit.module("Fullscreen behavior of multiple gantt charts", {
		before: function () {
			this.iTestContainerHeight = document.getElementById("qunit-fixture").style.height;
		},
		beforeEach: function () {
			this.oGanttChartContainer = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					content: [
						new sap.m.Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [
					new GanttChartWithTable({
						table: new TreeTable({
							columns: [
								new Column({
									label: new Label({
										text: "Name"
									}),
									template: new Label({
										text: "{name}"
									})
								}),
								new Column({
									label: new Label({
										text: "Description"
									}),
									template: new Label({
										text: "{description}"
									})
								})
							],
							selectionMode: TableSelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape1ID}",
								shapes1: new BaseChevron({
									shapeId: "{Chevron1ID}",
									time: "{Chevron1StartDate}",
									endTime: "{Chevron1EndDate}",
									title: "{Chevron1Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								}),
								shapes2: new BaseRectangle({
									shapeId: "{Rectangle1ID}",
									time: "{Rectangle1StartDate}",
									endTime: "{Rectangle1EndDate}",
									title: "{Rectangle1Desc}",
									fill: "#0092D1",
									countInBirdEye: false
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20170101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150301000000",
								endTime: "20150901000000"
							})
						})
					}),
					new GanttChartWithTable({
						table: new TreeTable({
							columns: [
								new Column({
									label: new Label({
										text: "Name"
									}),
									template: new Label({
										text: "{name}"
									})
								}),
								new Column({
									label: new Label({
										text: "Description"
									}),
									template: new Label({
										text: "{description}"
									})
								})
							],
							selectionMode: TableSelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape2ID}",
								shapes1: new BaseChevron({
									shapeId: "{Chevron2ID}",
									time: "{Chevron2StartDate}",
									endTime: "{Chevron2EndDate}",
									title: "{Chevron2Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20170101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150301000000",
								endTime: "20150901000000"
							})
						})
					})
				]
			});
			var sHeight = "700px";
			document.getElementById("qunit-fixture").style.height = sHeight;
			this.oPanel = new Panel({
				height: sHeight,
				content: [this.oGanttChartContainer]
			});
			var oData = {
				root: {
					name: "root",
					description: "root description",
					0: {
						name: "item1",
						description: "item1 description",
						Shape1ID: "0",
						Chevron1ID: "0-0",
						Chevron1StartDate: new Date(2015, 4, 20),
						Chevron1EndDate: new Date(2015, 5, 21),
						Chevron1Desc: "Test Chevron 1",
						Rectangle1ID: "0-1",
						Rectangle1StartDate: new Date(2015, 2, 20),
						Rectangle1EndDate: new Date(2015, 3, 21),
						Rectangle1Desc: "Test Rectangle 1",
						Shape2ID: "1",
						Chevron2ID: "1-0",
						Chevron2StartDate: new Date(2015, 6, 20),
						Chevron2EndDate: new Date(2015, 7, 21),
						Chevron2Desc: "Test Chevron 2"
					}
				}
			};
			var oModel = new JSONModel();
			oModel.setData(oData);
			this.oPanel.setModel(oModel);
			this.oPanel.placeAt("qunit-fixture");
			return GanttQUnitUtils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0], true);
		},
		afterEach: function () {
			this.oGanttChartContainer.destroy();
			this.oPanel.destroy();
		},
		after: function () {
			document.getElementById("qunit-fixture").style.height = this.iTestContainerHeight;
		}
	});

	QUnit.test("FullScreen mode without toolbar", function (assert) {
		var done = assert.async();

		var oGantt1 = this.oGanttChartContainer.getGanttCharts()[0];

		return GanttQUnitUtils.waitForGanttRendered(oGantt1).then(function () {
			oGantt1.toggleFullScreen();

			assert.strictEqual(oGantt1.fullScreenMode(), true, "Gantt chart is in fullscreen mode");
			assert.strictEqual(this.oGanttChartContainer._bHideToolbar, true, "Gantt chart container toolbar is not visible");
			var oFullScreenDialog = oGantt1.getParent()._oFullScreenDialog.getDomRef();
			assert.strictEqual(oFullScreenDialog.offsetHeight, window.innerHeight, "Fullscreen gantt chart covers the entire screen vertically");
			assert.strictEqual(oFullScreenDialog.offsetWidth, window.innerWidth, "Fullscreen gantt chart covers the entire screen horizontally");

			assert.strictEqual(this.oGanttChartContainer.getGanttCharts().length, 1, "Only 1 gantt chart is visible in fullscreen mode");
			oGantt1.getAxisTimeStrategy().getVisibleHorizon().setStartTime("20150601000000");
			oGantt1.getAxisTimeStrategy().getVisibleHorizon().setEndTime("20151201000000");
			var oStartTime = oGantt1.getAxisTimeStrategy().getVisibleHorizon().getStartTime();
			var oEndTime = oGantt1.getAxisTimeStrategy().getVisibleHorizon().getEndTime();
			oGantt1.toggleFullScreen();


			var oGanttCharts = this.oGanttChartContainer.getGanttCharts();
			assert.strictEqual(oGantt1.fullScreenMode(), false, "Gantt chart is not in fullscreen mode");
			assert.strictEqual(this.oGanttChartContainer._bHideToolbar, false, "GanttChart container toolbar is visible");
			assert.strictEqual(oGanttCharts.length, 2, "Both gantt charts are visible after exiting fullscreen mode");
			var bVisibleHorizonCheck = false;
			oGanttCharts.forEach(function (oGantt) {
				if ((oGantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime() !== oStartTime) || (oGantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime() !== oEndTime)) {
					bVisibleHorizonCheck = true;
				}
			});
			assert.strictEqual(bVisibleHorizonCheck, false, "Both gantt charts have the new visible horizon after exiting fullscreen mode");
			done();

		}.bind(this));
	});

	QUnit.test("FullScreen mode with container toolbar", function (assert) {
		var done = assert.async();
		var oGantt2 = this.oGanttChartContainer.getGanttCharts()[1];
		this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().setSize("25%");
		return GanttQUnitUtils.waitForGanttRendered(oGantt2).then(function () {
			oGantt2.toggleFullScreen(true);
			return GanttQUnitUtils.waitForGanttRendered(oGantt2).then(function () {
				var oToolbar = this.oGanttChartContainer.getToolbar();
				assert.strictEqual(oGantt2.fullScreenMode(), true, "Gantt chart is in fullscreen mode");
				assert.strictEqual(oToolbar.getDomRef().classList.contains("sapToolbarContentHidden"), false, "GanttChart container toolbar is visible");
				this.oGanttChartContainer.setEnableVerticalLine(false);
				oGantt2.toggleFullScreen();
				assert.strictEqual(oGantt2.fullScreenMode(), false, "Gantt chart is not in fullscreen mode");
				assert.strictEqual(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize(), "25%", "Gantt charts have correct height after exiting fullscreen mode");
				assert.strictEqual(this.oGanttChartContainer.getEnableVerticalLine(), false, "Divider lines are disabled after exiting fullscreen mode");
				done();
			}.bind(this));
		}.bind(this));

	});

	QUnit.test("Shape selection in fullscreen mode", function (assert) {
		var oGantt = this.oGanttChartContainer.getGanttCharts()[0];
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oSelection = oGantt.getSelection();
			var oShape1 = oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var oShape2 = oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes2()[0];
			var clearShapesSpy = sinon.spy(FindAndSelectUtils, "updateShapeSelectionANDHighlight");
			oShape1.setSelected(true);
			oGantt.toggleFullScreen(true);
			assert.equal(oSelection.allUid().length, 1, "Shape remains selected on entering fullscreen mode");
			assert.equal(clearShapesSpy.notCalled, true, "Shape selection not cleared");
			oGantt.setSelectedShapeUid([oShape1.getShapeUid(), oShape2.getShapeUid()]);
			oGantt.toggleFullScreen(true);
			assert.equal(oSelection.allUid().length, 2, "Shape remains selected on exiting fullscreen mode");
			assert.equal(clearShapesSpy.notCalled, true, "Shape selection not cleared");
		});

	});

	QUnit.module("GanttChart Shape Selection", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseTriangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						connectable: true,
						height: 20,
						width: "auto"
					})
				]
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt);
		},
		afterEach: function () {
			this.gantt.destroy();
		},
		assertSelectionState: function (assert, aExpectedSelectedShapeUids) {
			var fnDone = assert.async();
			var aAllNonExpandedShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
				"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
				"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
				"PATH:3|SCHEME:default[3]|DATA:/tree/rows/3[3]",
				"PATH:4|SCHEME:default[4]|DATA:/tree/rows/4[4]",
				"PATH:5|SCHEME:default[5]|DATA:/tree/rows/5[5]",
				"PATH:6|SCHEME:default[6]|DATA:/tree/rows/6[6]",
				"PATH:7|SCHEME:default[7]|DATA:/tree/rows/7[7]"
			];
			var aShapeIDRowId = [];
			aExpectedSelectedShapeUids.forEach(function (sShapeUid) {
				var oPart = Utility.parseUid(sShapeUid);
				aShapeIDRowId.push(oPart.shapeId + "_" + oPart.rowId);
			});
			GanttUtils.getShapesWithUid(this.gantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape) {
				var oPart = Utility.parseUid(oShape.getShapeUid());
				var sShapeIDRowId = oPart.shapeId + "_" + oPart.rowId;
				assert.ok(
					aShapeIDRowId.indexOf(sShapeIDRowId) > -1 ? oShape.getSelected() : !oShape.getSelected(),
					"Shape should have correct selection state. Shape UID is " + oShape.getShapeUid()
				);
			});
			assert.deepEqual(this.gantt.getSelection().allUid(), aExpectedSelectedShapeUids, "SelectionModel's state should be correctly updated.");
			fnDone();
		}
	});

	QUnit.test("ShapeSelection with enableChainSelection: false and enableSelectAndDrag: false", function (assert) {
		var aShapeUids = [
			"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]"
		];
		this.gantt.setProperty("enableSelectAndDrag", false, true);
		this.gantt.selectShapes(aShapeUids);
		this.assertSelectionState(assert, aShapeUids);
	});

	QUnit.test("ShapeSelection with enableChainSelection: false and enableSelectAndDrag: true", function (assert) {
			var aShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]"
			];
			this.gantt.setProperty("enableSelectAndDrag", true, true);
			this.gantt.selectShapes(aShapeUids);
			this.assertSelectionState(assert, aShapeUids);
	});

	QUnit.test("ShapeSelection with enableChainSelection: true and enableSelectAndDrag: true", function (assert) {
			var aShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]"
			];
			this.gantt.setProperty("enableSelectAndDrag", true, true);
			this.gantt.selectShapes(aShapeUids);
			this.assertSelectionState(assert, aShapeUids);
	});

	QUnit.test("ShapeSelection with enableChainSelection: true and enableSelectAndDrag: false", function (assert) {
			var aShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]"
			];
			this.gantt.setProperty("enableSelectAndDrag", false, true);
			this.gantt.selectShapes(aShapeUids);
			this.assertSelectionState(assert, aShapeUids);
	});

	QUnit.test("ShapeSelection for BaseTriangle", function (assert) {
		var fnDone = assert.async();
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var aShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
				"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
				"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
				"PATH:7|SCHEME:default[3]|DATA:/tree/rows/7[7]"
			];
			this.gantt.selectShapes(aShapeUids); // exclusive parameter is not specified
			this.assertSelectionState(assert, aShapeUids);
			aShapeUids.pop(); // remove last shape Uid
			this.gantt.selectShapes(aShapeUids, true); // do exclusive selection now
			this.assertSelectionState(assert, aShapeUids);
			this.gantt.selectShapes([], false); // not exclusive
			this.assertSelectionState(assert, aShapeUids);
			aShapeUids = []; // remove all selections
			this.gantt.selectShapes(aShapeUids, true); // do exclusive selection now
			this.assertSelectionState(assert, aShapeUids);
			fnDone();
		}.bind(this));
	});

	QUnit.module("function - getShapeUids", {
		beforeEach: function () {
			this.sut = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new BaseGroup({
						shapeId: "group01",
						selectable: true,
						shapes: [
							new BaseGroup({
								shapeId: "group02",
								selectable: true,
								x: 0,
								shapes: [
									new BaseDiamond({
										shapeId: "diamond01",
										selectable: true,
										x: 0
									})
								]
							})
						]
					}),
					new BaseRectangle({
						shapeId: "rectangle01",
						selectable: true,
						title: "Market Research"
					})
				],
				shapes2: [
					new sap.gantt.simple.MultiActivityGroup({
						task: [new BaseRectangle({
							shapeId: "task01",
							selectable: true,
							title: "Main Task"
						})],
						indicators: [new BaseRectangle({
							shapeId: "indicator01",
							selectable: true
						}), new BaseRectangle({
							shapeId: "indicator02",
							selectable: true
						})],
						subTasks: [new BaseRectangle({
							shapeId: "subtask01",
							selectable: true,
							title: "SubTask_1"
						}), new BaseRectangle({
							shapeId: "subtask02",
							selectable: true,
							title: "SubTask_2"
						})]
					})
				]
			}), true);
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("getShapeUids - select shapes based on given property", function (assert) {
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aShapeUids = this.sut.getShapeUids({
				title: "Market Research"
			});
			this.sut.setSelectedShapeUid(aShapeUids);
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {

				assert.deepEqual(this.sut.getSelectedShapeUid(), aShapeUids, "shapes are selected");
				fnDone();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("getShapeUids - select basegroups based on given shape property", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aShapeUids = this.sut.getShapeUids({
				shapeId: "diamond01"
			});
			this.sut.setSelectedShapeUid(aShapeUids);
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				assert.deepEqual(this.sut.getSelectedShapeUid(), aShapeUids, "base group shapes are selected");
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("getShapeUids - select multiactivitygroup based on given shape property", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aShapeUids = this.sut.getShapeUids({
				shapeId: "task01"
			});
			this.sut.setSelectedShapeUid(aShapeUids);
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				assert.deepEqual(this.sut.getSelectedShapeUid(), aShapeUids, "base group shapes are selected");
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("AlignShape for BaseGroups", {
		beforeEach: function () {
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						alignShape: "Top",
						selected: true,
						shapes: [
							new BaseDiamond({
								shapeId: "diamond01",
								selectable: true,
								rowYCenter: 10,
								time: "{StartDate}",
								endTime: "{EndDate}",
								title: "{Name}",
								fill: "#008FD3"
							}),
							new BaseRectangle({
								shapeId: "rectangle01",
								selectable: true,
								rowYCenter: 10,
								time: "{StartDate}",
								endTime: "{EndDate}",
								title: "{Name}",
								fill: "#008FD3"
							})
						]
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
			this.aAllNonExpandedShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
				"PATH:1|SCHEME:default[1]|DATA:/tree/rows/1[1]",
				"PATH:2|SCHEME:default[2]|DATA:/tree/rows/2[2]",
				"PATH:3|SCHEME:default[3]|DATA:/tree/rows/3[3]",
				"PATH:4|SCHEME:default[4]|DATA:/tree/rows/4[4]",
				"PATH:5|SCHEME:default[5]|DATA:/tree/rows/5[5]",
				"PATH:6|SCHEME:default[6]|DATA:/tree/rows/6[6]",
				"PATH:7|SCHEME:default[7]|DATA:/tree/rows/7[7]"
			];
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		assertAlignShape: function (assert, oRelationshipAnchors) {
			var iSuccessorShapeCord, iPredecessorShapeCord;
			GanttUtils.getShapesWithUid(this.oGantt.getId(), this.aAllNonExpandedShapeUids).forEach(function (oShape, index) {
				var sTransform = window.getComputedStyle(oShape.getDomRef()).transform;
				var bIsTramsformApplied = sTransform == "none" ? false : true;
				var iShapeYCord = oShape.getDomRef().getBBox().y;
				var iResizeCoverYCord = document.getElementsByClassName("sapGanttChartSelection")[0].children[index].getBBox().y;
				var iDiffYCord = iShapeYCord - iResizeCoverYCord;
				var sShapeAlignment = oShape.getAlignShape();
				var iTransformedValue = 0;
				var iTransformedValueWithoutSpace = 0;

				if (sShapeAlignment != "Middle") {
					if (sShapeAlignment == "Top") {
						iPredecessorShapeCord = parseInt(oShape.getDomRef().getBBox().height / 2);
						iSuccessorShapeCord = parseInt(oShape.getDomRef().getBBox().height / 2) + parseInt(oShape._iBaseRowHeight) + 1;
					} else if (sShapeAlignment == "Bottom") {
						iPredecessorShapeCord = parseInt(oShape._iBaseRowHeight) - parseInt(oShape.getDomRef().getBBox().height / 2);
						iSuccessorShapeCord = parseInt(oShape._iBaseRowHeight) * 2 - parseInt(oShape.getDomRef().getBBox().height / 2);
					}

					iTransformedValue = window.getComputedStyle(oShape.getDomRef()).transform.match(/matrix.*\((.+)\)/)[1].split(',')[5];
					iTransformedValueWithoutSpace = sTransform.replace(/\s/g, '').match(/matrix.*\((.+)\)/)[1].split(',')[5];
					assert.ok(bIsTramsformApplied, "Group is placed at the " + sShapeAlignment + " transformed by " + iTransformedValue);
					assert.equal(parseFloat(iTransformedValue), parseFloat(iTransformedValueWithoutSpace), "Transform is applied correctly" + iTransformedValue);
				} else {
					iPredecessorShapeCord = parseInt(oShape.getRowYCenter());
					iSuccessorShapeCord = parseInt(oShape.getRowYCenter()) + parseInt(oShape._iBaseRowHeight);
					assert.ok(!bIsTramsformApplied, "Group is places at the Middle by Default");
				}
				assert.ok(iDiffYCord + Number(iTransformedValue) < 2, "Resize Cover is placed correctly.");
				var iDiffPredecessorShapeCord = Math.abs(oRelationshipAnchors.predecessor.y - iPredecessorShapeCord);
				var iDiffSuccessorShapeCord = Math.abs(oRelationshipAnchors.successor.y - iSuccessorShapeCord);
				if (index == 0) {
					assert.ok(iDiffPredecessorShapeCord < 2, "Predecessor Relationship moves to the " + sShapeAlignment);
					assert.ok(iDiffSuccessorShapeCord < 2, "Successor Relationship moves to the " + sShapeAlignment);
				}
			});
		},
		createRelationship: function () {
			var oRls = new Relationship({
				shapeId: "rel-1",
				predecessor: "0",
				successor: "1"
			});
			var oShapes = oRls.getRelatedInRowShapes(this.oGantt.getId()),
				oRelationshipAnchors;
			oRls.setProperty("type", "FinishToFinish");
			oRelationshipAnchors = oRls.getRlsAnchors(0, oShapes);
			return oRelationshipAnchors;
		}
	});

	QUnit.test("Test AlignShape Top", function (assert) {
		var done = assert.async();
		var oRelationshipAnchors;
		this.oGantt.getTable().getRows().forEach(function (oRow) {
			oRow.getAggregation("_settings").getShapes1().forEach(function (oShape) {
				oShape.setProperty("connectable", true, true);
				oShape.setProperty("resizable", true, true);
			});
		});
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			this.oGantt.setSelectedShapeUid(this.aAllNonExpandedShapeUids); // exclusive parameter is not specified
			oRelationshipAnchors = this.createRelationship();
			this.assertAlignShape(assert, oRelationshipAnchors);
			done();
		}.bind(this));
	});

	QUnit.test("Test AlignShape Middle", function (assert) {
		var done = assert.async();
		var oRelationshipAnchors;
		this.oGantt.getTable().getRows().forEach(function (oRow) {
			oRow.getAggregation("_settings").getShapes1().forEach(function (oShape) {
				oShape.setProperty("connectable", true, true);
				oShape.setProperty("resizable", true, true);
				oShape.setProperty("alignShape", "Middle");
			});
		});
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			this.oGantt.setSelectedShapeUid(this.aAllNonExpandedShapeUids); // exclusive parameter is not specified
			oRelationshipAnchors = this.createRelationship();
			this.assertAlignShape(assert, oRelationshipAnchors);
			done();
		}.bind(this));
	});

	QUnit.test("Test AlignShape Bottom", function (assert) {
		var done = assert.async();
		var oRelationshipAnchors;
		this.oGantt.getTable().getRows().forEach(function (oRow) {
			oRow.getAggregation("_settings").getShapes1().forEach(function (oShape) {
				oShape.setProperty("connectable", true, true);
				oShape.setProperty("resizable", true, true);
				oShape.setProperty("alignShape", "Bottom");
			});
		});
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			this.oGantt.setSelectedShapeUid(this.aAllNonExpandedShapeUids); // exclusive parameter is not specified
			oRelationshipAnchors = this.createRelationship();
			this.assertAlignShape(assert, oRelationshipAnchors);
			done();
		}.bind(this));
	});

	QUnit.module("Test enableChartOverflowToolbar - flag to show and hide the overflow toolbar", {
		beforeEach: function () {
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseGroup({
						shapeId: "{Id}",
						shapes: [
							new BaseRectangle({
								shapeId: "rectangle01",
								rowYCenter: 10,
								time: "{StartDate}",
								endTime: "{EndDate}"
							})
						]
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("enableChartOverflowToolbar - Test Gantt Overflow Toolbar visibility", function (assert) {
		var oGantt = this.oGantt;
		var fnDone = assert.async();
		oGantt.placeAt("qunit-fixture");
		oGantt.setEnableChartOverflowToolbar(true);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oGanttDom = oGantt.getDomRef();
			assert.notEqual(oGanttDom.querySelector('[id$="-ganttHeaderOverflowToolbar"]'), null, "Gantt Overflow toolbar is visible");
			oGantt.setShowGanttHeader(false);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {

				assert.strictEqual(oGanttDom.querySelector('[id$="-ganttHeaderOverflowToolbar"]'), null, "Gantt Overflow toolbar is not visible");
				fnDone();

			});
		});
	});

	QUnit.test("enableChartOverflowToolbar - Test Gantt Overflow Toolbar API", function (assert) {
		var oGantt = this.oGantt;
		var fnDone = assert.async();
		oGantt.placeAt("qunit-fixture");
		oGantt.setEnableChartOverflowToolbar(true);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oOverflowToolbar = oGantt.getChartOverflowToolbar();
			var bOverflowToolbarId = oOverflowToolbar.getId().includes("ganttHeaderOverflowToolbar");
			assert.strictEqual(bOverflowToolbarId, true, "Gantt Overflow toolbar is present");
			fnDone();

		});
	});

	QUnit.test("enableChartOverflowToolbar - Test Gantt and Table Overflow Toolbar height in sync", function (assert) {
		var oGantt = this.oGantt;
		var fnDone = assert.async();
		oGantt.placeAt("qunit-fixture");
		oGantt.setEnableChartOverflowToolbar(true);
		oGantt.setShowExportTableToExcel(true);
		var oTableOverflowToolbarExtension;
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.getTable().getExtension().forEach(function(oExtension){
				if (oExtension.isA("sap.m.OverflowToolbar")){
					oTableOverflowToolbarExtension = oExtension;
				}
			});
			var oGanttDom = oGantt.getDomRef(),
				oGanttOverflowToolbarDom = oGanttDom.querySelector('[id$="-ganttHeaderOverflowToolbar"]'),
				oTableOverflowToolbarDom = oTableOverflowToolbarExtension.getDomRef();
			assert.strictEqual(oGanttOverflowToolbarDom.offsetHeight, oTableOverflowToolbarDom.offsetHeight, "Gantt chart and table overflow toolbar heights are in sync");
			fnDone();
		});

	});

	QUnit.test("enableChartOverflowToolbar - Test overflow toolbar's width", function (assert) {
		var fnDone = assert.async();
		var oGantt = this.oGantt;
		oGantt.placeAt("qunit-fixture");
		oGantt.setEnableChartOverflowToolbar(true);
		oGantt.setShowExportTableToExcel(true);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {

			var oGanttDom = oGantt.getDomRef(),
				oGanttOverflowToolbarDom = oGanttDom.querySelector('[id$="-ganttHeaderOverflowToolbar"]');
			assert.strictEqual(oGanttOverflowToolbarDom.offsetWidth, oGanttOverflowToolbarDom.parentElement.offsetWidth, "Gantt chart header and chart overflow toolbar width are in sync");
			oGantt.setDisplayType("Chart");
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				var oGanttDom = oGantt.getDomRef(),
					oGanttOverflowToolbarDom = oGanttDom.querySelector('[id$="-ganttHeaderOverflowToolbar"]');
				assert.strictEqual(oGanttOverflowToolbarDom.offsetWidth, oGanttOverflowToolbarDom.parentElement.offsetWidth, "Gantt chart header and chart overflow toolbar width are in sync when display type is Chart");
				fnDone();

			});
		});
	});

	QUnit.test("enableChartOverflowToolbar - Test header axis-time bar top offset", function (assert) {
		var fnDone = assert.async();
		var oGantt = this.oGantt;
		oGantt.placeAt("qunit-fixture");
		oGantt.setEnableChartOverflowToolbar(true);
		oGantt.setShowExportTableToExcel(true);

		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oGanttDom = oGantt.getDomRef(),
				oGanttHeaderAxisSVGDom = oGanttDom.querySelector('[id$="-header-svg"]'),
				oGanttOverflowToolbarDom = oGanttDom.querySelector('[id$="-ganttHeaderOverflowToolbar"]');
			var iTransformedValue = window.getComputedStyle(oGanttHeaderAxisSVGDom).transform.match(/matrix.*\((.+)\)/)[1].replace(/\s/g, '').split(',')[5];
			assert.strictEqual(parseFloat(iTransformedValue), oGanttOverflowToolbarDom.clientHeight, "Toolbar offset matched");
			fnDone();
		});
	});

	QUnit.test("Test Gantt height when overflowtoolbar is enabled and display type is chart", function (assert) {
		var oGantt = this.oGantt;
		var fnDone = assert.async();
		oGantt.placeAt("qunit-fixture");
		oGantt.setEnableChartOverflowToolbar(true);
		oGantt.setShowExportTableToExcel(true);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oGanttDom = oGantt.getDomRef(),
				oGanttHeaderDom = oGanttDom.querySelector('[id$="-ganttHeader"]'),
				oGanttBackgroundDom = oGanttDom.querySelector('[id$="-sapGanttBackgroundTableContent"]');
			var iInitialHeaderHeight = oGanttHeaderDom.offsetHeight,
				iInitialBackgroundHeight = oGanttBackgroundDom.offsetHeight;
			oGantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				assert.strictEqual(oGanttHeaderDom.offsetHeight, iInitialHeaderHeight, "Gantt chart header height is not changed");
				assert.strictEqual(oGanttBackgroundDom.offsetHeight, iInitialBackgroundHeight, "Gantt chart background height is not changed");
				fnDone();
			});
		});

	});

	QUnit.module("Test chart row selection and hover state", {
		beforeEach: function () {
			this.sut = GanttQUnitUtils.createGantt(true);
			this.sut.placeAt("qunit-fixture");
			return GanttQUnitUtils.waitForGanttRendered(this.sut);
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("enableChartSelectionState - test property to enable chart row selection", function (assert) {
		var oTable = this.sut.getTable();
		var fnDone = assert.async();
			oTable.getRows()[0]._setSelected(true);
				var $svg = document.getElementById(this.sut.getId() + "-svg"),
					$bgRects = $svg.getElementsByClassName("sapGanttBackgroundSVGRow");
				var bGanttRowSelected = $bgRects[0].classList.contains("sapGanttBackgroundSVGRowSelected");
				var bChartSelectState = this.sut.getEnableChartSelectionState();
				assert.equal(bGanttRowSelected, bChartSelectState, "Selection for gantt chart row is set to " + bGanttRowSelected);
				fnDone();
	});

	QUnit.test("enableChartSelectionState - test property to disable chart row selection", function (assert) {
		var oTable = this.sut.getTable();
		var fnDone = assert.async();
		this.sut.setEnableChartSelectionState(false);
			oTable.getRows()[0]._setSelected(true);
				var $svg = document.getElementById(this.sut.getId() + "-svg"),
					$bgRects = $svg.getElementsByClassName("sapGanttBackgroundSVGRow");
				var bGanttRowSelected = $bgRects[0].classList.contains("sapGanttBackgroundSVGRowSelected");
				var bChartSelectState = this.sut.getEnableChartSelectionState();
				assert.equal(bGanttRowSelected, bChartSelectState, "Selection for gantt chart row is set to " + bGanttRowSelected);
				fnDone();
	});

	QUnit.test("enableChartHoverState - test property to enable chart row's hovering", function (assert) {
		var fnDone = assert.async();
			var oTable = this.sut.getTable();
			var oTableRowDom = oTable.getRows()[0].getDomRef();
			jQuery(oTableRowDom).on("mouseenter", function () {
				var $svg = jQuery(document.getElementById(this.sut.getId() + "-svg")),
					$bgRects = $svg.find("rect.sapGanttBackgroundSVGRow");
				var bRowHovered = $bgRects.eq(0).hasClass("sapGanttBackgroundSVGRowHovered");
				var bChartRowHoverState = this.sut.getEnableChartHoverState();
				assert.equal(bRowHovered, bChartRowHoverState, "Gantt chart row hover state is set to " + bRowHovered);
				fnDone();
			}.bind(this));
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = oTableRowDom.offsetLeft + 5;
			oEventParams.pageY = oTableRowDom.offsetTop + 5;
			qutils.triggerEvent("mouseenter", oTableRowDom, oEventParams);
	});

	QUnit.test("enableChartHoverState - test property to disable chart row's hovering", function (assert) {
		var fnDone = assert.async();
		this.sut.setEnableChartHoverState(false);
			var oTable = this.sut.getTable();
			var oTableRowDom = oTable.getRows()[0].getDomRef();
			jQuery(oTableRowDom).on("mousemove", function () {
				var $svg = jQuery(document.getElementById(this.sut.getId() + "-svg")),
					$bgRects = $svg.find("rect.sapGanttBackgroundSVGRow");
				var bRowHovered = $bgRects.eq(0).hasClass("sapGanttBackgroundSVGRowHovered");
				var bChartRowHoverState = this.sut.getEnableChartHoverState();
				assert.equal(bRowHovered, bChartRowHoverState, "Gantt chart row hover state is set to " + bRowHovered);
				fnDone();
			}.bind(this));
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = oTableRowDom.offsetLeft + 5;
			oEventParams.pageY = oTableRowDom.offsetTop + 5;
			qutils.triggerEvent("mousemove", oTableRowDom, oEventParams);
	});

	var placeAt = function (oElement) {
		var target = document.getElementById("qunit-fixture");
		var oRm = new RenderManager();
		oRm.openStart("svg", "svg-container");
		oRm.attr("xmlns", "http://www.w3.org/2000/svg");
		oRm.attr("width", "500");
		oRm.attr("height", "100");
		oRm.attr("viewBox", "0 0 500 100");
		oRm.attr("version", "1.1");
		oRm.openEnd();
		oElement.renderElement(oRm, oElement);
		oRm.close('svg');
		oRm.flush(target);
		oRm.destroy();
	};

	QUnit.module("UtilizationBarChart Basic", {
		beforeEach: function () {
			this.aTimeRange = [Format.abapTimestampToDate("20180101000000"), Format.abapTimestampToDate("20180331235959")];
			this.sut = new UtilizationBarChart({
				time: this.aTimeRange[0],
				endTime: this.aTimeRange[1]
			});
			sinon.stub(this.sut, "getGanttChartBase").returns({
				getRenderedTimeRange: function () {
					return this.aTimeRange;
				}.bind(this)
			});
		},
		afterEach: function () {
			this.sut.destroy();
			this.sut = null;
			d3.select("#svg-container").remove();
		}
	});

	QUnit.test("UtilizationBarChart Rendering", function (assert) {
		this.sut.setRowYCenter(50);
		this.sut._iBaseRowHeight = 100;
		this.sut.mAxisTime = new AxisTime(this.aTimeRange, [0, 500]);
		placeAt(this.sut);
		assert.ok(this.sut.getDomRef() != null, "UBC has DOM rendered");

		var $dom = jQuery(document.getElementById(this.sut.getId()));
		assert.ok($dom.hasClass("sapGanttUtilizationBar"), "DOM has correct class name");
		assert.equal($dom.attr("id"), this.sut.getId(), "id attribute is set");
		assert.equal($dom.attr("data-sap-ui"), this.sut.getId(), "eusure the element can be found by Core");

		assert.ok(this.sut.getDomRef("defaultBgPattern"), "UBC has DOM with defaultBgPattern as suffix");

		var oUbcBg = this.sut.getDomRef("ubcBg");
		assert.ok(oUbcBg != null, "UBC has a rectangle as background");
		assert.equal(oUbcBg.getAttribute("height"), "100", "UBC background take the entire row height");
		assert.equal(oUbcBg.getAttribute("width"), "500", "UBC background has same width of time range");
		assert.equal(oUbcBg.getAttribute("fill"), "url(#" + this.sut.getId() + "-defaultBgPattern)", "ubc bg use default bg pattern");
	});

	QUnit.module("Test Locale property", {
		beforeEach: function () {
			this.oStartDate = new Date();
			this.oEndDate = new Date();
			this.oEndDate.setDate(this.oStartDate.getDate() + 10);
			this.oGantt = GanttQUnitUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new BaseRectangle({
						time: this.oStartDate,
						endTime: this.oEndDate
					})
				]
			}), true);
			this.oConfig = new Locale({
				timeZone: "UTC",
				utcdiff: "053000",
				utcsign: "+"
			});
			this.oGantt.setLocale(this.oConfig);
			this.oGantt.setEnableNowLine(true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.oGantt.destroy();
		}
	});
	QUnit.test("Test UTC data converted to local time while rendering", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oBaseRectangle = oRowSettings.getShapes1()[0];
			assert.strictEqual(oBaseRectangle.getTime().getTime(), this.oStartDate.getTime(), "Start date exists in UTC format");
			assert.strictEqual(oBaseRectangle.getEndTime().getTime(), this.oEndDate.getTime(), "End date exists in UTC format");
			done();
		}.bind(this));
	});

	QUnit.test("Test time labels converted to local time from UTC", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {

			this.oAxisTime = this.oGantt.getAxisTime();
			this.oAxisTimeStrategy = this.oGantt.getAxisTimeStrategy();
			this.oAxisTimeStrategy.setZoomLevel(8);
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oBaseRectangle = oRowSettings.getShapes1()[0];
			var oShapeDom = oBaseRectangle.getDomRef().getBoundingClientRect();
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = oShapeDom.x;
			oEventParams.pageY = oShapeDom.y;
			qutils.triggerEvent("mousemove", oBaseRectangle.getDomRef(), oEventParams);
			var sCursorTimeLabel = jQuery('.sapGanttChartHeaderSvg').find('.sapGanttCursorLineLabel')[0].textContent;
			var sShapeTime = Format.abapTimestampToDate(oBaseRectangle.getTime());
			var sShapeTimeLabel = this.oGantt.getAxisTimeStrategy().getLowerRowFormatter().format(sShapeTime, this.oConfig.getTimeZone());
			assert.strictEqual(sCursorTimeLabel, sShapeTimeLabel, "Shape and Cursor time label are in sync");

			done();
		}.bind(this));
	});

	QUnit.module("GanttChartWithTable having BaseRectangle", {
		beforeEach: function () {
			this.oGantt = GanttQUnitUtils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						connectable: true,
						horizontalTextAlignment: "Start",
						enableChainSelection: true
					})
				]
			}));
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Shape with different Value Colors", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var oBaseRectangle = oRowSettings.getShapes1()[0];
			assert.equal(oBaseRectangle.getFill(), "#008FD3", "Fill is correct");
			oBaseRectangle.setFill("red");
			assert.equal(oBaseRectangle.getFill(), "red", "Fill is correct");
			oBaseRectangle.setFill("Good");
			assert.equal(oBaseRectangle.getFill(), Parameters.get("sapUiChartGood"), "Fill is correct");
			oBaseRectangle.setFill("Error");
			assert.equal(oBaseRectangle.getFill(), Parameters.get("sapUiChartBad"), "Fill is correct");
			oBaseRectangle.setFill("Critical");
			assert.equal(oBaseRectangle.getFill(), Parameters.get("sapUiChartCritical"), "Fill is correct");
			oBaseRectangle.setFill("Neutral");
			assert.equal(oBaseRectangle.getFill(), Parameters.get("sapUiChartNeutral"), "Fill is correct");
			oBaseRectangle.setFill("sapUiNegativeText");
			assert.equal(oBaseRectangle.getFill(), Parameters.get("sapUiNegativeText"), "Fill is correct");
			done();
		}.bind(this));
	});

	QUnit.test("TableRowHeight with floating values", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {

			var oTable = this.oGantt.getTable();
			var oRowHeightStub1 = sinon.stub(oTable.getRowMode(), "getRowContentHeight").returns(23.5);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), Math.ceil(23.5), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());
			oRowHeightStub1.restore();

			var oRowHeightStub2 = sinon.stub(oTable.getRowMode(), "getRowContentHeight").returns(23.6);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), Math.ceil(23.6), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());
			oRowHeightStub2.restore();

			var oRowHeightStub3 = sinon.stub(oTable.getRowMode(), "getRowContentHeight").returns(23.3);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), Math.ceil(23.3), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());
			oRowHeightStub3.restore();

			var oRowHeightStub4 = sinon.stub(oTable.getRowMode(), "getRowContentHeight").returns(23);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), Math.ceil(23), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());
			oRowHeightStub4.restore();

			var oRowHeightStub5 = sinon.stub(oTable.getRowMode(), "getRowContentHeight").returns(0);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), oTable._getDefaultRowHeight(), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());

			var oDefaultRowHeightStub1 = sinon.stub(oTable, "_getDefaultRowHeight").returns(23.5);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), Math.ceil(23.5), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());
			oDefaultRowHeightStub1.restore();

			var oDefaultRowHeightStub2 = sinon.stub(oTable, "_getDefaultRowHeight").returns(23.6);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), Math.ceil(23.6), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());
			oDefaultRowHeightStub2.restore();

			var oDefaultRowHeightStub3 = sinon.stub(oTable, "_getDefaultRowHeight").returns(23.3);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), Math.ceil(23.3), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());
			oDefaultRowHeightStub3.restore();

			var oDefaultRowHeightStub4 = sinon.stub(oTable, "_getDefaultRowHeight").returns(23);
			this.oGantt._updateRowHeightInExpandModel(oTable);
			assert.equal(this.oGantt._oExpandModel.getBaseRowHeight(), Math.ceil(23), "Correct RowHeight is set." + this.oGantt._oExpandModel.getBaseRowHeight());
			oDefaultRowHeightStub4.restore();

			oRowHeightStub5.restore();
			done();
		}.bind(this));
	});

	QUnit.module("Test selection model state", {
		beforeEach: function () {
			this.sut = GanttQUnitUtils.createGanttWithOData();
		},
		createEventParam: function (x, y, button) {
			var oEventParams = {};
			oEventParams.button = button ? button : 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},
		mouseclick: function (oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("click", oShape, oEventParams);
		},
		getDoms: function () {
			var oShapeDom = jQuery(".baseShapeSelection").get(5);
			var oShape = jQuery(oShapeDom).control(0, true);
			var oRowArea = jQuery(".sapGanttBackgroundSVGRow").get(0);
			return {
				shapeDom: oShapeDom,
				shape: oShape,
				rowArea: oRowArea
			};
		},
		afterEach: function () {
			this.sut.destroy();
		}
	});

	QUnit.test("Test click on empty gantt area resets the selection model state", function (assert) {
		var done = assert.async();
		this.sut.placeAt("qunit-fixture");
		assert.ok(this.sut.oSelection.getSelectedShapeIDS().length === 0, "Default selected shape objectIds are empty.");
		assert.ok(this.sut.oSelection.getDeSelectedShapeIDS().length === 0, "Default deselection model is empty.");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.getDoms().shape.setProperty("selectable", false);
			this.sut.setShapeSelectionMode("Multiple");
			this.sut.attachEventOnce("shapeSelectionChange", function (oEvent) {
				assert.ok(true);
				assert.strictEqual(oEvent.getParameter("shapeUids").length, 0, "ShapeSelectionChange event fired and shapes got deselected");
			});
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {

				this.sut.findAndSelect("", "", false, true);
				return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {

					var oRowArea = this.getDoms().rowArea;
					var oShapeDom = this.getDoms().shapeDom;
					var coordinateShapedom = oShapeDom.getBoundingClientRect();
					this.mouseclick(oRowArea, coordinateShapedom.x - 30, coordinateShapedom.y);
					return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
						assert.strictEqual(this.sut.getSelectedShapeUid().length, 0, "Shapes are deselected");
						done();
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Test multiple selection mode without ctrl", function (assert) {
		var done = assert.async();
		var oGantt = this.sut;
		oGantt.placeAt("qunit-fixture");
		oGantt.setShapeSelectionMode("Multiple");
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			assert.ok(oGantt.getSelectedShapeUid().length === 0, "Default no shapes are selected");
			var oShape1 = oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var oShape2 = oGantt.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
			var oShapeDom = oShape1.getDomRef();
			var coordinateShapedom = oShapeDom.getBoundingClientRect();
			oGantt.attachEventOnce("shapeSelectionChange", function () {
				assert.strictEqual(oGantt.getSelectedShapeUid().length, 1, "1 shape should be selected");
				oGantt.attachEventOnce("shapeSelectionChange", function () {
					assert.strictEqual(oGantt.getSelectedShapeUid().length, 2, "2 shapes should be selected");
					done();
				});
				oShapeDom = oShape2.getDomRef();
				coordinateShapedom = oShapeDom.getBoundingClientRect();
				this.mouseclick(oShapeDom, coordinateShapedom.x, coordinateShapedom.y);
			}.bind(this));
			this.mouseclick(oShapeDom, coordinateShapedom.x, coordinateShapedom.y);
		}.bind(this));
	});

	QUnit.module("Horizontal scroll and Zoom change", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGantt();
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Horizontal scroll flag should reset and Zoom level should be retained", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var totalHorizonStartTime, totalHorizonEndTime, currentZomLevel, zoomLevelAfterSetHorizon;
			totalHorizonStartTime = this.gantt.getAxisTimeStrategy().getTotalHorizon().getStartTime();
			totalHorizonEndTime = this.gantt.getAxisTimeStrategy().getTotalHorizon().getEndTime();
			currentZomLevel = this.gantt.getAxisTimeStrategy().getZoomLevel();
			var hsb = document.getElementById(this.gantt.getId() + "-hsb");
			hsb.scrollTo(hsb.scrollLeft + 50, 0);
			this.gantt.getAxisTimeStrategy().setTotalHorizon(new sap.gantt.config.TimeHorizon({
				startTime: totalHorizonStartTime,
				endTime: totalHorizonEndTime
			}));
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				zoomLevelAfterSetHorizon = this.gantt.getAxisTimeStrategy().getZoomLevel();
				assert.equal(currentZomLevel, zoomLevelAfterSetHorizon, "zoom level is retained");
				done();
			}.bind(this));

		}.bind(this));
	});


	QUnit.module("Horizontal lazy load", {
		beforeEach: function () {
            var oShape = [
                new BaseRectangle({
                    shapeId: "0",
                    time: Format.abapTimestampToDate("20181002000000"),
                    endTime: Format.abapTimestampToDate("20181022000000"),
                    height: 20
                })];
            this.gantt = GanttQUnitUtils.createSimpleGantt(oShape, "20131001000000", "20251129000000");
			this.gantt.setHorizontalLazyLoadingEnabled(true);
            this.gantt.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.gantt.destroy();
            this.gantt = null;
        }
	});

	QUnit.test("Redraw is not called on scroll", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var redrawSpy = sinon.spy(this.gantt,"redraw");
			this.gantt.attachEventOnce("visibleHorizonUpdate", function (oEvent) {
				assert.equal(redrawSpy.callCount,0,"redraw is not called");
				done();
			}, this);
			this.gantt.$("hsb").scrollLeft(1000);
		}.bind(this));
	});

	QUnit.test("Redraw is called on scroll after promise is resolved", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var redrawSpy = sinon.spy(this.gantt,"redraw");
			this.gantt._isAllDataLoadedPromiseResolved = true;
			this.gantt.attachEventOnce("visibleHorizonUpdate", function (oEvent) {
				assert.equal(redrawSpy.callCount,1,"redraw is called");
				done();
			}, this);
			this.gantt.$("hsb").scrollLeft(1000);
		}.bind(this));
	});

	QUnit.test("Buffer width is not removed after promise resolved", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var iGanttRenderedWidthLazyLoad = RenderUtils.getGanttRenderWidth(this.gantt);
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				this.gantt._isAllDataLoadedPromiseResolved = true;
				var iGanttRenderedWidthNormal = RenderUtils.getGanttRenderWidth(this.gantt);
				assert.notEqual(iGanttRenderedWidthLazyLoad,iGanttRenderedWidthNormal);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Buffer width is removed", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var iGanttRenderedWidthLazyLoad = RenderUtils.getGanttRenderWidth(this.gantt);
			this.gantt.setHorizontalLazyLoadingEnabled(false);
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var iGanttRenderedWidthNormal = RenderUtils.getGanttRenderWidth(this.gantt);
				assert.notEqual(iGanttRenderedWidthLazyLoad,iGanttRenderedWidthNormal);
				assert.equal(iGanttRenderedWidthLazyLoad * (1 + 2 * RenderUtils.RENDER_EXTEND_FACTOR),iGanttRenderedWidthNormal,"lazy loading gantt width is without buffer");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Scroll on Gantt chart", {
		before: function() {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
		},
		beforeEach: function () {
			this.oGantt = GanttQUnitUtils.createGantt(true, null, true);
			this.oGantt.setEnableChartOverflowToolbar(true);
			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(dNewTotalStartTime.getDate() - 15);
			dNewTotalEndTime.setDate(dNewTotalEndTime.getDate() + 15);
			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);
			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
		}
	});
	QUnit.test("Mouse wheel event", function (assert) {
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var hsbDocElement = this.oGantt.getDomRef("hsb");
			var scrollLeft = hsbDocElement.scrollLeft;
			var oEvent = new MouseEvent("wheel", {
				bubbles: true,
				shiftKey: true,
				"cancelable": true,
				detail: 0
			});
			oEvent = Object.assign(oEvent, {
				deltaX: -0,
				deltaY: 150,
				deltaMode: 0,
				wheelDeltaY: -180,
				wheelDelta: -180
			});
			document.getElementsByClassName("sapGanttChartSvg")[0].dispatchEvent(oEvent);
			assert.ok(scrollLeft !== hsbDocElement.scrollLeft);
			fnDone();
		}.bind(this));
	});
	QUnit.test("Scroll on setFirstVisibleRow", function (assert) {
		var fnDone = assert.async();
		this.oGantt.getTable().setFirstVisibleRow(this.oGantt.getTable().getRows().length);
		return GanttQUnitUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oGanttSyncedControl = this.oGantt.getSyncedControl();
			assert.equal(oGanttSyncedControl.getDomRefs().content.scrollTop, oGanttSyncedControl.state.innerVerticalScrollPosition, "Scroll Top changed");
			fnDone();
		}.bind(this));
	});

	QUnit.module("Shape render order", {
		beforeEach: async function () {
			this.sut = GanttQUnitUtils.createGanttWithODataModelForMultipleBaseCalendar(new GanttRowSettings({
				shapes1: [
					new BaseRectangle({
						shapeId: "{data>id}",
						time: "{data>StartDate}",
						endTime: "{data>EndDate}",
						title: "Shape 1",
						fill: "pink",
						selectable: true,
						showTitle: true
					})
				],
				shapes2: [
					new BaseRectangle({
						shapeId: "{data>id}",
						time: "{data>StartDate}",
						endTime: "{data>EndDate}",
						title: "Shape 2",
						fill: "green",
						selectable: true,
						yBias: 10,
						xBias: 30,
						showTitle: true
					})
				],
				shapes3: [
					new BaseRectangle({
						shapeId: "{data>id}",
						time: "{data>StartDate}",
						endTime: "{data>EndDate}",
						title: "Shape 3",
						fill: "yellow",
						selectable: true,
						yBias: 16,
						xBias: -30,
						showTitle: true
					})
				]
			}));
			this.sut.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.sut.destroy();
		}
	});

	QUnit.test("Test shape rendering order", function (assert) {
		var fnDone = assert.async();
		var aShapeRenderOrder = ["shapes3","shapes2","shapes1"];
		this.sut.setShapeRenderOrder(aShapeRenderOrder, false);
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aShapesDom = this.sut.getTable().getRows()[0].getAggregation("_settings").getDomRef().firstChild.children;
			assert.equal(aShapesDom[1].textContent, "Shape 3", "Shape 3 rendered first, i.e, at bottom");
			assert.equal(aShapesDom[3].textContent, "Shape 2", "Shape 2 rendered in middle");
			assert.equal(aShapesDom[5].textContent, "Shape 1", "Shape 1 rendered last, i.e, at top");
			aShapeRenderOrder = ["shapes2","shapes1","shapes3"];
			this.sut.setShapeRenderOrder(aShapeRenderOrder, false);
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				aShapesDom = this.sut.getTable().getRows()[0].getAggregation("_settings").getDomRef().firstChild.children;
				assert.equal(aShapesDom[1].textContent, "Shape 2", "Shape 2 rendered first, i.e, at bottom");
				assert.equal(aShapesDom[3].textContent, "Shape 1", "Shape 1 rendered in middle");
				assert.equal(aShapesDom[5].textContent, "Shape 3", "Shape 3 rendered last, i.e, at top");
				aShapeRenderOrder = ["shapes2"];
				this.sut.setShapeRenderOrder(aShapeRenderOrder, false);
				return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
					aShapesDom = this.sut.getTable().getRows()[0].getAggregation("_settings").getDomRef().firstChild.children;
					assert.equal(aShapesDom[1].textContent, "Shape 1", "Shape 1 rendered first, i.e, at bottom");
					assert.equal(aShapesDom[3].textContent, "Shape 3", "Shape 3 rendered in middle");
					assert.equal(aShapesDom[5].textContent, "Shape 2", "Shape 2 rendered last, i.e, at top");
					fnDone();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Gantt On Table Row Updates", {
		beforeEach: async function () {
			this.sut = GanttQUnitUtils.createGantt(true);
			this.sut.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Validate promise created during table render should be resolved", async function (assert) {
		var aModelChangeReason = baseUtilValue(ChangeReason).slice();
		var aInvalidateReasons = aModelChangeReason.concat(["Render", "FirstVisibleRowChange", "Resize", "Unknown", "Unknown", "SomeUnknownReason" ,"Unknown"]);

		await GanttQUnitUtils.waitForGanttRendered(this.sut);

		const run = async () => {
			let resolvedCount = 0;

			for await (const reason of aInvalidateReasons) {
				try {
					this.sut._onTableRowsUpdated({
						getParameter: function (key) {
							if (key === "reason") {
								return reason;
							}

							return undefined;
						},
						getSource: () => this.sut.getTable()
					});

					await this.sut._oInnerGanttRenderPromise;
					resolvedCount++;
				} catch (error) {
					//
				}
			}

			return resolvedCount;
		};

		assert.equal(await run(), aInvalidateReasons.length, "Inner gantt promise resolved for all table updates");

		this.sut.setEnablePseudoShapes(true);

		await GanttQUnitUtils.waitForGanttRendered(this.sut);

		assert.equal(await run(), aInvalidateReasons.length, "Inner gantt promise resolved for all table updates with pseudo shapes enabled");
	});

	QUnit.module("Check for jQuery deprecation message logs", {
		beforeEach: async function () {
			this.sut = GanttQUnitUtils.createGanttWithOData();
			this.sut.placeAt("qunit-fixture");
			this.jQueryWarningLength = jQuery.migrateWarnings.length;
			await nextUIUpdate();
		},
		afterEach: function () {
			this.sut.destroy();
		}
	});

	/**
	 * @deprecated
	 */
	QUnit.test("should not generate any deprecated message logs", async function (assert) {
		await GanttQUnitUtils.waitForGanttRendered(this.sut);

		assert.equal(jQuery.migrateWarnings.length, this.jQueryWarningLength, "Migration warnings not generated on initial rendering");

		var iZoomLevel = this.sut.getAxisTimeStrategy().getZoomLevel();
		this.sut.getAxisTimeStrategy().setZoomLevel(iZoomLevel + 1);

		await GanttQUnitUtils.waitForGanttRendered(this.sut);

		assert.equal(jQuery.migrateWarnings.length, this.jQueryWarningLength, "Migration warnings not generated after zoom in");
	});
});

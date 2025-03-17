/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/axistime/FullScreenStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/simple/BaseRectangle",
	"sap/ui/layout/SplitterLayoutData",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/Panel",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format",
	"sap/gantt/config/SettingItem",
	"sap/ui/core/Core",
	"sap/ui/fl/apply/api/ControlVariantApplyAPI",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/table/rowmodes/Auto",
	"sap/ui/core/Element",
	"sap/ui/core/library",
	"sap/gantt/simple/test/nextUIUpdate"
], function (
	ContainerToolbar,
	GanttChartWithTable,
	GanttChartContainer,
	GanttRowSettings,
	ProportionZoomStrategy,
	StepwiseZoomStrategy,
	FullScreenStrategy,
	TimeHorizon,
	BaseChevron,
	BaseRectangle,
	SplitterLayoutData,
	GanttUtils,
	TreeTable,
	Column,
	Label,
	Panel,
	JSONModel,
	Format,
	SettingItem,
	Core,
	ControlVariantApplyAPI,
	qutils,
	AutoRowMode,
	Element,
	coreLibrary,
	nextUIUpdate
) {
	"use strict";

	QUnit.module("Test Zoom Sync.", {
		before: function() {
			this.iTestContainerWidth = document.getElementById("qunit-fixture").style.width;
			this.iTestContainerHeight = document.getElementById("qunit-fixture").style.height;
		},
		beforeEach: function () {
			this.assertGanttChartsVisibleHorizon = function (assert) {
				var oAxisTimeStrategy1 = this.oGantt1.getAxisTimeStrategy();
				var oAxisTimeStrategy2 = this.oGantt2.getAxisTimeStrategy();

				var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();
				var oVisibleHorizon2 = oAxisTimeStrategy2.getVisibleHorizon();
				this.assertVisibleHorizon(assert, oVisibleHorizon1, oVisibleHorizon2);
			};

			this.assertVisibleHorizon = function (assert, oVisibleHorizon1, oVisibleHorizon2) {
				assert.strictEqual(oVisibleHorizon1.getStartTime(), oVisibleHorizon2.getStartTime(), "Expect: " + oVisibleHorizon2.getStartTime() + "; Result:" + oVisibleHorizon1.getStartTime());
				assert.strictEqual(oVisibleHorizon1.getEndTime(), oVisibleHorizon2.getEndTime(), "Expect: " + oVisibleHorizon2.getEndTime() + "; Result:" + oVisibleHorizon1.getEndTime());
			};

			return this.fnCreateGanttContainer();
		},
		getSvgOffset: function() {
			var popoverExt = this.oGanttChartContainer.getGanttCharts()[0]._getPopoverExtension(),
				$svgCtn = popoverExt.getDomRefs().gantt,
				$vsb = this.oGanttChartContainer.getGanttCharts()[0].getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar),
				svgOffset = $svgCtn.getBoundingClientRect(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width - $vsb.clientWidth;

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
		},
		getDoms: function() {

			return {
				sourceRow: document.querySelector("rect[data-sap-ui-index=0]"),
				droppedRow: document.querySelector("rect[data-sap-ui-index=4]"),
				draggedShape: document.querySelector("g[data-sap-gantt-shape-id='0']"),
				header:document.querySelector(".sapGanttChartHeader"),
				ghost: document.getElementById("sapGanttDragGhostWrapper")
			};
		},
		createEventParam: function(x, y, button) {
			var oEventParams = {};
			oEventParams.button = button ? button : 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},
		mousedown: function(oShape, x, y, button) {
			var oEventParams = this.createEventParam(x, y, button);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		},
		afterEach: function () {
			this.oGanttChartContainer.destroy();
			this.oGanttChartContainer = undefined;
			this.oToolbar = undefined;
			this.aGanttCharts =  undefined;
			this.oGantt1 = undefined;
			this.oGantt2 =  undefined;
		},
		after: function() {
			document.getElementById("qunit-fixture").style.width = this.iTestContainerWidth;
			document.getElementById("qunit-fixture").style.height = this.iTestContainerHeight;
		},
		fnCreateGanttContainer: function () {
			this.oGanttChartContainer = new GanttChartContainer("container", {
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
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
							selectionMode: sap.ui.table.SelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowMode: new AutoRowMode({
								minRowCount: 3
							}),
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
								startTime: "20150101000000",
								endTime: "20150315000000"
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
							selectionMode: sap.ui.table.SelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowMode: new AutoRowMode({
								minRowCount: 3
							}),
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
								startTime: "20150101000000",
								endTime: "20150315000000"
							})
						})
					})
				],
				enableStatusBar: true
			});

			this.oToolbar = this.oGanttChartContainer.getToolbar();
			this.oStatusBar = this.oGanttChartContainer.getStatusBar();
			this.oGanttChartContainer.setProperty("statusMessage","Testing Message property");
			this.aGanttCharts = this.oGanttChartContainer.getGanttCharts();
			this.oGantt1 = this.aGanttCharts[0];
			this.oGantt2 = this.aGanttCharts[1];
			this.oToolbar.insertSettingItem(new SettingItem("settings1", {
				key: "setting1",
				displayText: "Custom Setting1",
				checked: false
			}), 7);

			var sHeight = "500px";
			document.getElementById("qunit-fixture").style.height = sHeight;
			document.getElementById("qunit-fixture").style.width = "1920px";
			var oPanel = new Panel({
				height: sHeight,
				content: [this.oGanttChartContainer]
			});

			var oData = {
				root : {
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
			oPanel.setModel(oModel);

			oPanel.placeAt("qunit-fixture");

			return GanttUtils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0], true);
		}
	});
	QUnit.test("Test horizontal scroll position after drag & drop" , async function (assert) {
		var oSvgOffset = this.getSvgOffset();
		var iSvgLeft = oSvgOffset.left;
		var iSvgTop = oSvgOffset.top;
		var iPageY = iSvgTop + 10;

		var nIntialScrollLeft = this.oGanttChartContainer.getGanttCharts()[0]._getScrollExtension().getGanttHsb().scrollLeft;
		var oShape1 = document.querySelector("rect[data-sap-gantt-shape-id='0-1']");
		Element.getElementById(oShape1.id).setSelected(true);
		this.mousedown(oShape1, iSvgLeft + 75, iPageY);
		this.mousemove(oShape1, iSvgLeft + 250, iPageY);
		this.mousemove(oShape1, iSvgLeft + 350, iPageY);
		this.mouseup(oShape1, iSvgLeft + 350, iPageY);
		await nextUIUpdate();
		assert.equal(nIntialScrollLeft, this.oGanttChartContainer.getGanttCharts()[0]._getScrollExtension().getGanttHsb().scrollLeft,"horizonatal scroll is in same position when drag&drop in the same visible horizon");
	});

	QUnit.test("Test statusMessage property on StatusBar - while enabled and disabled" , function (assert) {
		var fnInvalidateStatusBar = sinon.spy(this.oGanttChartContainer.getStatusBar(), "invalidate");
		this.oGanttChartContainer.setStatusMessage("Testing Message property1");
		assert.strictEqual(this.oGanttChartContainer.getStatusMessage(),this.oStatusBar.getItems()[0].getText(),"Message property is set");
		assert.equal(fnInvalidateStatusBar.callCount, 1, "Called Once");
		this.oGanttChartContainer.setEnableStatusBar(false);
		this.oGanttChartContainer.setStatusMessage("Testing Message property1");
		assert.equal(fnInvalidateStatusBar.callCount, 1, "Not Called");
		fnInvalidateStatusBar.restore();
	 });

	 QUnit.test("Test statusMessage property on StatusBar" , async function (assert) {
		var fnOnAfterRendering = sinon.spy(this.oGanttChartContainer, "onAfterRendering");
		var fnOnAfterRenderingStatusBar = sinon.spy(this.oGanttChartContainer.getStatusBar(), "onAfterRendering");
		this.oGanttChartContainer.setStatusMessage("Testing Message property1");
		await nextUIUpdate();
		assert.strictEqual(this.oGanttChartContainer.getStatusMessage(),this.oStatusBar.getItems()[0].getText(),"Message property is set");
		assert.equal(fnOnAfterRendering.callCount, 0, "Not Called");
		assert.equal(fnOnAfterRenderingStatusBar.callCount, 1, "Status Bar Rendered");
		this.oGanttChartContainer.setStatusMessage("Testing Message property2");
		await nextUIUpdate();
		assert.strictEqual(this.oGanttChartContainer.getStatusMessage(),this.oStatusBar.getItems()[0].getText(),"Message property is set");
		assert.equal(fnOnAfterRendering.callCount, 0, "Not Called");
		assert.equal(fnOnAfterRenderingStatusBar.callCount, 2, "Status Bar Rendered");
		this.oGanttChartContainer.setStatusMessage("Testing Message property3");
		await nextUIUpdate();
		assert.strictEqual(this.oGanttChartContainer.getStatusMessage(),this.oStatusBar.getItems()[0].getText(),"Message property is set");
		assert.equal(fnOnAfterRendering.callCount, 0, "Not Called");
		assert.equal(fnOnAfterRenderingStatusBar.callCount, 3, "Status Bar Rendered");

		fnOnAfterRendering.restore();
		fnOnAfterRenderingStatusBar.restore();
	 });

	QUnit.test("Test StableID" , function (assert) {
		//OuterContainer
		assert.ok(this.oGanttChartContainer.getDomRef("ganttContainerContent"), "ContainerContent has StableID");
		assert.ok(this.oGanttChartContainer.getDomRef("ganttContainerSplitter"), "ContainerSplitter has StableID");
		//Toolbar
		assert.ok(this.oToolbar.getDomRef("toolbarSpacer"), "ToolBarSpacer has StableID");
		assert.ok(this.oToolbar.getDomRef("timeZoomFlexBox"), "Zoom FlexBox has StableID");
		assert.ok(this.oToolbar.getDomRef("zoomInButton"), "Zoom in button has StableID");
		assert.ok(this.oToolbar.getDomRef("zoomOutButton"), "Zoom out button has StableID");
		assert.ok(this.oToolbar.getDomRef("zoomSlider"), "Zoom slider has StableID");
		assert.ok(this.oToolbar.getDomRef("settingsButton"), "Settings button has StableID");
		assert.ok(this.oToolbar.getDomRef("birdEyeButton"), "birds eye button has StableID");
		assert.ok(this.oToolbar.getDomRef("displayTypeSegmentedButton"), "display type segmented button has StableID");
		var aSettingsItemsId = ["enableNowLineSettingItem", "enableCurserLineSettingItem", "enableVerticalLineSettingItem","enableAdhocLineSettingItem", "enableDeltaLineSettingItem", "enableNonWorkingTimeSettingItem", "enableTimeScrollSyncSettingItem","settings1","enableStatusBar"];
		var aSettingItemObj = this.oToolbar.getSettingItems();
		for (var i = 0; i < aSettingItemObj.length; i++) {
			assert.ok(aSettingItemObj[i].getId().indexOf(aSettingsItemsId[i]) > -1, "SettingsItems have Stable ID");
		}
		//GanttChartWithTable - 1
		assert.ok(this.oGantt1.getDomRef("ganttChartSplitter"), "GanttChartWithTable splitter has StableID");
		assert.ok(this.oGantt1.getDomRef("ganttBGFlexContainer"), "GanttChart FlexContainer has StableID");
		assert.ok(this.oGantt1.getDomRef("ganttBGContainerWithScrollBar"), "Gantt chart background container has StableID");
		assert.ok(this.oGantt1.getDomRef("ganttSyncedControlTable"), "Gantt chart synced control table area has StableID");
		assert.ok(this.oGantt1.getDomRef("ganttHeader"), "Gantt header has StableID");
		assert.ok(this.oGantt1.getDomRef("header-svg"), "Header SVG has StableID");
		assert.ok(this.oGantt1.getDomRef("sapGanttBackgroundTableContent"), "Gantt Chart Table background content has StableID");
		assert.ok(this.oGantt1.getDomRef("gantt"), "Background gantt has StableID");
		assert.ok(this.oGantt1.getDomRef("cnt"), "Background content has StableID");
		assert.ok(this.oGantt1.getDomRef("svg"), "Background content svg has StableID");
		assert.ok(this.oGantt1.getDomRef("helperDef-linePattern"), "Helper defs have StableID");
		assert.ok(this.oGantt1.getDomRef("bg"), "Gantt Chart background row has StableID");
		assert.ok(this.oGantt1.getDomRef("ganttRowBorder"), "Gantt Chart background row border has StableID");
		assert.ok(this.oGantt1.getDomRef("rowBackgrounds"), "Gantt Chart background row has StableID");
		assert.ok(this.oGantt1.getDomRef("rowBorders"), "Gantt Chart background row border has StableID");
		assert.ok(this.oGantt1.getDomRef("shapes"), "Gantt Chart shapes have StableID");
		assert.ok(this.oGantt1.getDomRef("horizontalScrollContainer"), "Gantt Chart horizontal scroll have StableID");
		assert.ok(this.oGantt1.getDomRef("sapGanttVerticalScrollBarContainer"), "Gantt Chart vertical scroll have StableID");
		//GanttChartWithTable - 2
		assert.ok(this.oGantt2.getDomRef("ganttChartSplitter"), "GanttChartWithTable splitter has StableID");
		assert.ok(this.oGantt2.getDomRef("ganttBGFlexContainer"), "GanttChart FlexContainer has StableID");
		assert.ok(this.oGantt2.getDomRef("ganttBGContainerWithScrollBar"), "Gantt chart background container has StableID");
		assert.ok(this.oGantt2.getDomRef("ganttSyncedControlTable"), "Gantt chart synced control table area has StableID");
		assert.ok(this.oGantt2.getDomRef("ganttHeader"), "Gantt header has StableID");
		assert.ok(this.oGantt2.getDomRef("header-svg"), "Header SVG has StableID");
		assert.ok(this.oGantt2.getDomRef("sapGanttBackgroundTableContent"), "Gantt Chart Table background content has StableID");
		assert.ok(this.oGantt2.getDomRef("gantt"), "Background gantt has StableID");
		assert.ok(this.oGantt2.getDomRef("cnt"), "Background content has StableID");
		assert.ok(this.oGantt2.getDomRef("svg"), "Background content svg has StableID");
		assert.ok(this.oGantt2.getDomRef("helperDef-linePattern"), "Helper defs have StableID");
		assert.ok(this.oGantt2.getDomRef("bg"), "Gantt Chart background row/border has StableID");
		assert.ok(this.oGantt2.getDomRef("rowBackgrounds"), "Gantt Chart background row has StableID");
		assert.ok(this.oGantt2.getDomRef("rowBorders"), "Gantt Chart background row border has StableID");
		assert.ok(this.oGantt2.getDomRef("shapes"), "Gantt Chart shapes have StableID");
		assert.ok(this.oGantt2.getDomRef("horizontalScrollContainer"), "Gantt Chart horizontal scroll have StableID");
		assert.ok(this.oGantt2.getDomRef("sapGanttVerticalScrollBarContainer"), "Gantt Chart vertical scroll have StableID");
	});
	QUnit.test("Test initial visibleHorizonSync." , function (assert) {
		this.assertGanttChartsVisibleHorizon(assert);
	});

	QUnit.test("Test time scroll sync." , function (assert) {
		var oHSB1 = this.oGantt1._getScrollExtension().getGanttHsb();
		oHSB1.scrollLeft = 1000;
		this.assertGanttChartsVisibleHorizon(assert);
	});

	QUnit.test("Test bird eye." , function (assert) {
		this.oToolbar._oBirdEyeButton.firePress();
		return GanttUtils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0]).then(function () {
			var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();
			var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();

			assert.strictEqual(oVisibleHorizon1.getStartTime().substr(0,8), "20150519");
			assert.strictEqual(oVisibleHorizon1.getEndTime().substr(0,8), "20150821");
			assert.strictEqual(oAxisTimeStrategy1.bBirdEyeTriggered === undefined, true, "bBirdEyeTriggered should not defined in propotion zoom strategy");
			this.assertGanttChartsVisibleHorizon(assert);
		}.bind(this));
	});

	QUnit.test("Test kept visible horizon when resize container" , function (assert) {

		var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();

		var oOldVisibleHorizon = oAxisTimeStrategy1.getVisibleHorizon();

		this.oGanttChartContainer.getParent().setHeight("800px");
		var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();

		this.assertVisibleHorizon(assert, oVisibleHorizon1, oOldVisibleHorizon);
		this.assertGanttChartsVisibleHorizon(assert);
	});

	QUnit.test("Test kept zoom rate when resize column" , function (assert) {

		var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();
		var oAxisTimeStrategy2 =  this.oGantt2.getAxisTimeStrategy();

		var oOldVisibleHorizon = oAxisTimeStrategy1.getVisibleHorizon();
		var fOldZoomRate = oAxisTimeStrategy1.getAxisTime().getZoomRate();

		this.oGantt1.getTable().getColumns()[1].setWidth("150px");
		this.oGantt2.getTable().getColumns()[1].setWidth("150px");

		var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();
		var oVisibleHorizon2 = oAxisTimeStrategy2.getVisibleHorizon();
		var fCurrentZoomRate = oAxisTimeStrategy1.getAxisTime().getZoomRate();

		assert.strictEqual(fOldZoomRate, fCurrentZoomRate);
		assert.strictEqual(oVisibleHorizon1.getStartTime(), oOldVisibleHorizon.getStartTime());
		assert.strictEqual(oVisibleHorizon2.getStartTime(), oOldVisibleHorizon.getStartTime());
	});

	QUnit.test("Test zoom control sync." , function (assert) {
		var oZoomOutButton = this.oToolbar._oZoomOutButton;
		var oZoomSlider = this.oToolbar._oZoomSlider;
		var oZoomInButton = this.oToolbar._oZoomInButton;

		oZoomInButton.firePress();
		this.assertGanttChartsVisibleHorizon(assert);

		oZoomSlider.setValue(3);
		this.assertGanttChartsVisibleHorizon(assert);

		oZoomOutButton.firePress();
		this.assertGanttChartsVisibleHorizon(assert);
	});

	QUnit.test("Test enableNowLine." , function (assert) {
		this.oGanttChartContainer.setEnableNowLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[0];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableNowLine(), false);
		assert.strictEqual(this.oGantt2.getEnableNowLine(), false);
	});

	QUnit.test("Test enableCursorLine." , function (assert) {
		this.oGanttChartContainer.setEnableCursorLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[1];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableCursorLine(), false);
		assert.strictEqual(this.oGantt2.getEnableCursorLine(), false);
	});

	QUnit.test("Test enableVerticalLine." , function (assert) {
		this.oGanttChartContainer.setEnableVerticalLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[2];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableVerticalLine(), false);
		assert.strictEqual(this.oGantt2.getEnableVerticalLine(), false);
	});

	QUnit.test("Test enableAdhocLine." , function (assert) {
		this.oGanttChartContainer.setEnableAdhocLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[3];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableAdhocLine(), false);
		assert.strictEqual(this.oGantt2.getEnableAdhocLine(), false);
	});

	QUnit.test("Test enableDeltaLine." , function (assert) {
		this.oGanttChartContainer.setEnableDeltaLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[4];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableDeltaLine(), false);
		assert.strictEqual(this.oGantt2.getEnableDeltaLine(), false);
	});

	QUnit.test("Test enableTimeScrollSync property" , function (assert) {
		this.oGanttChartContainer.setEnableTimeScrollSync(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[6];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);
	});

	QUnit.test("Test default enableAutoFocusOnZoom property" , function (assert) {
		assert.strictEqual(this.oGanttChartContainer.getEnableAutoFocusOnZoom(), false, "enableAutoFocusOnZoom property should be false by default");
		var oToolBar = this.oGanttChartContainer.getToolbar();
		var fnCalculateSelectedShapeMinTime = sinon.spy(sap.gantt.simple.GanttUtils, "_calculateSelectedShapeMinTime");
		oToolBar._focusOnZoom(0,1);
		assert.strictEqual(fnCalculateSelectedShapeMinTime.callCount, 0, "_calculateSelectedShapeMinTime should not be called");
		fnCalculateSelectedShapeMinTime.restore();
	});

	QUnit.test("Test enableAutoFocusOnZoom property set to true" , function (assert) {
		this.oGanttChartContainer.setEnableAutoFocusOnZoom(true);
		var oToolBar = this.oGanttChartContainer.getToolbar();
		var fnCalculateSelectedShapeMinTime = sinon.spy(sap.gantt.simple.GanttUtils, "_calculateSelectedShapeMinTime");
		oToolBar._focusOnZoom(0,1);
		assert.equal(fnCalculateSelectedShapeMinTime.calledOnce, true, "_calculateSelectedShapeMinTime should be called");
		fnCalculateSelectedShapeMinTime.restore();
	});

	QUnit.test("Test enableNonWorkingTime." , function (assert) {
		this.oGanttChartContainer.setEnableNonWorkingTime(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableNonWorkingTime = aSettingItems[5];
		assert.strictEqual(oEnableNonWorkingTime.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableNonWorkingTime(), false);
		assert.strictEqual(this.oGantt2.getEnableNonWorkingTime(), false);
	});

	QUnit.test("Test hideSettingsItem." , function (assert) {
		var oToolbar = this.oToolbar,aSettingItems;
		this.oGanttChartContainer.setHideSettingsItem(['enableNowLine','enableDeltaLine']);
		this.oGanttChartContainer.observePropertiesChanges();
		var hiddenItems = this.oGanttChartContainer.getHideSettingsItem();
		var assertCheck  = function(){
			aSettingItems = oToolbar._oSettingsBox.getItems();
			aSettingItems.forEach(function(oCheckBox,index){
				var item = oCheckBox.getName().split("_")[1] ?  oCheckBox.getName().split("_")[1] :  oCheckBox.getName().split("_")[0];
				if (hiddenItems.indexOf(item) > -1){
					assert.strictEqual(oCheckBox.getVisible(),false,"visibility of " + item + " set to false");
				} else {
					assert.strictEqual(oCheckBox.getVisible(),true,"visibility of " + item + " set to true");
				}
			});
		};
		assertCheck();
		this.oGanttChartContainer.setHideSettingsItem([]);
		this.oGanttChartContainer.observePropertiesChanges();
		hiddenItems = this.oGanttChartContainer.getHideSettingsItem();
		assertCheck();
		oToolbar._oSettingsBox.getItems()[7].setVisible(false);
		this.oGanttChartContainer.observePropertiesChanges();
		assert.strictEqual(aSettingItems[7].getVisible(),false,"visibility of custom settings is set to false");
		oToolbar._oSettingsBox.getItems()[7].setVisible(true);
		this.oGanttChartContainer.setHideSettingsItem(['enableNowLine','settings1']);
		this.oGanttChartContainer.observePropertiesChanges();
		assert.strictEqual(aSettingItems[0].getVisible(),false,"visibility of now Line is set to false");
		assert.strictEqual(aSettingItems[7].getVisible(),true,"visibility of custom settings is set to true");
	});

	QUnit.test("Test resetSettingsItem" , function (assert) {
		this.oToolbar._oSettingsButton.firePress();
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		aSettingItems[0].setSelected(false);
		var sSettingDialogID = this.oToolbar._oSettingsDialog.getId();
		Element.getElementById(sSettingDialogID + "-acceptbutton").firePress();
		this.oToolbar._oSettingsButton.firePress();
		Element.getElementById(sSettingDialogID + "-resetbutton").firePress();
		assert.equal(aSettingItems[0].getSelected(), true, "Same");
	});

	QUnit.test("Test custom setting item." , function (assert) {
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oCustomSettingItem = aSettingItems[7];
		assert.strictEqual(oCustomSettingItem.getSelected(), false);
		assert.strictEqual(this.oToolbar.mSettingsConfig.setting1, false);

		var done = assert.async();

		this.oToolbar.attachEvent("_settingsChange",function(){
			assert.equal(this.oToolbar.mSettingsConfig.setting1, true);
			done();
		}.bind(this));

		this.oToolbar._oSettingsButton.firePress();

		assert.ok(this.oToolbar._oSettingsDialog.getDomRef() !== null);

		var oSettingItems = this.oToolbar._oSettingsBox.getItems();
		assert.equal(oSettingItems.length, 9);
		assert.equal(Object.keys(this.oToolbar.mSettingsConfig).length, 10);
		oSettingItems[7].setSelected(true);
		var sSettingDialogID = this.oToolbar._oSettingsDialog.getId();
		Element.getElementById(sSettingDialogID + "-acceptbutton").firePress();

		assert.equal(Object.keys(this.oToolbar.mSettingsConfig).length, 10);
		assert.equal(oSettingItems[7].getSelected(), true);
	});

	QUnit.test("Test enableStatusBar." , function (assert) {
		this.oGanttChartContainer.setEnableStatusBar(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableStatusBar = aSettingItems[8];
		assert.strictEqual(oEnableStatusBar.getSelected(), false);
	});

	QUnit.test("Test addGanttChart function of gantt container", function (assert) {
		var done = assert.async();
		var oGantt1 = this.oGanttChartContainer.getGanttCharts()[0];
		var oShape = [
			new BaseRectangle({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				height: 20
			})];
		var oAdditionalGantt = GanttUtils.createSimpleGantt(oShape, "20131001000000", "20251129000000");
		oGantt1.toggleFullScreen();
		var fnInsertGantt = sinon.spy(this.oGanttChartContainer, "_insertGanttChart");
		this.oGanttChartContainer.addGanttChart(oAdditionalGantt);
		assert.strictEqual(oGantt1.fullScreenMode(), true, "Gantt chart is in fullscreen mode");
		assert.strictEqual(fnInsertGantt.callCount, 0, "_insertGanttChart should not be called");
		assert.strictEqual(this.oGanttChartContainer.getGanttCharts().length, 1, "Only 1 chart should be there in the container in fullscreen mode");
		fnInsertGantt.restore();
		oGantt1.toggleFullScreen();
		fnInsertGantt = sinon.spy(this.oGanttChartContainer, "_insertGanttChart");
		this.oGanttChartContainer.addGanttChart(oAdditionalGantt);
		assert.strictEqual(oGantt1.fullScreenMode(), false, "Gantt chart is not in fullscreen mode");
		assert.equal(fnInsertGantt.calledOnce, true, "_insertGanttChart should be called");
		assert.strictEqual(this.oGanttChartContainer.getGanttCharts().length, 3, "3 gantt charts should be there in the container");
		done();
	});

	QUnit.test("Test insertGanttChart function of gantt container", function (assert) {
		var done = assert.async();
		var oGantt1 = this.oGanttChartContainer.getGanttCharts()[0];
		var oShape = [
			new BaseRectangle({
				shapeId: "0",
				time: Format.abapTimestampToDate("20181002000000"),
				endTime: Format.abapTimestampToDate("20181022000000"),
				height: 20
			})];
		var oAdditionalGantt = GanttUtils.createSimpleGantt(oShape, "20131001000000", "20251129000000");
		oGantt1.toggleFullScreen();
		var fnInsertGantt = sinon.spy(this.oGanttChartContainer, "_insertGanttChart");
		this.oGanttChartContainer.insertGanttChart(oAdditionalGantt, 1);
		assert.strictEqual(oGantt1.fullScreenMode(), true, "Gantt chart is in fullscreen mode");
		assert.strictEqual(fnInsertGantt.callCount, 0, "_insertGanttChart should not be called");
		assert.strictEqual(this.oGanttChartContainer.getGanttCharts().length, 1, "Only 1 chart should be there in the container in fullscreen mode");
		fnInsertGantt.restore();
		oGantt1.toggleFullScreen();
		fnInsertGantt = sinon.spy(this.oGanttChartContainer, "_insertGanttChart");
		this.oGanttChartContainer.addGanttChart(oAdditionalGantt);
		assert.strictEqual(oGantt1.fullScreenMode(), false, "Gantt chart is not in fullscreen mode");
		assert.equal(fnInsertGantt.calledOnce, true, "_insertGanttChart should be called");
		assert.strictEqual(this.oGanttChartContainer.getGanttCharts().length, 3, "3 gantt charts should be there in the container");
		done();
	});

	QUnit.module("Validating GanttContainer's height on settings update", {
		before: function() {
			this.iTestContainerHeight = document.getElementById("qunit-fixture").style.height;
		},
		beforeEach: function() {
			this.oGanttChartContainer = new GanttChartContainer({
                toolbar: new ContainerToolbar({
                    content: [
                        new sap.m.Text({
                            text: "This is gantt toolbar--"
                        })
                    ]
                }),
                ganttCharts: [GanttUtils.createGanttWithOData(), GanttUtils.createGanttWithOData("table2")]
            });
			document.getElementById("qunit-fixture").style.height = "500px";
            this.oGanttChartContainer.placeAt("qunit-fixture");

		},
		afterEach: function(){
			this.oGanttChartContainer.destroy();
		},
		after: function() {
			document.getElementById("qunit-fixture").style.height = this.iTestContainerHeight;
		}
	});



	QUnit.test("Gantt height is set auto on default" , function (assert) {
		this.gantt = this.oGanttChartContainer.getGanttCharts()[0];
		return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
			var done = assert.async();
			var oToolbar = this.oGanttChartContainer.getToolbar();
			oToolbar.getParent()._oSplitter.attachEvent("resize",function(){
				assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize(),"50%","height of gantt1 set to 50%");
				assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().getSize(),"50%","height of gantt2 set to 50%");
				done();
			}.bind(this));
			assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize(),"auto","default height of gantt1 set to auto");
			assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().getSize(),"auto","default height of gantt2 set to auto");
			oToolbar._oSettingsButton.firePress();
			assert.ok(oToolbar._oSettingsDialog.getDomRef() !== null);
			var oSettingItems = oToolbar._oSettingsBox.getItems();
			oSettingItems[7].setSelected(true);
			var sSettingDialogID = oToolbar._oSettingsDialog.getId();
			Element.getElementById(sSettingDialogID + "-acceptbutton").firePress();
			assert.equal(oSettingItems[7].getSelected(), true);
		}.bind(this));
		});

		QUnit.test("Gantt height is set in % on default" , function (assert) {
			this.gantt = this.oGanttChartContainer.getGanttCharts()[0];
			this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().setSize("30%");
			this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().setSize("70%");
			return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
				var done = assert.async();
				var oToolbar = this.oGanttChartContainer.getToolbar();
				oToolbar.getParent()._oSplitter.attachEvent("resize", function () {
					assert.notEqual(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize(), "50%", "height of gantt1 set to 30%");
					assert.notEqual(this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().getSize(), "50%", "height of gantt2 set to 70%");
					done();
				}.bind(this));
					assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize(), "30%", "default height of gantt1 set to 30%");
					assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().getSize(), "70%", "default height of gantt2 set to 70%");
					oToolbar._oSettingsButton.firePress();
					assert.ok(oToolbar._oSettingsDialog.getDomRef() !== null);
					var oSettingItems = oToolbar._oSettingsBox.getItems();
					oSettingItems[7].setSelected(true);
					var sSettingDialogID = oToolbar._oSettingsDialog.getId();
					Element.getElementById(sSettingDialogID + "-acceptbutton").firePress();
					assert.equal(oSettingItems[7].getSelected(), true);
			}.bind(this));
		});

		QUnit.test("Gantt height is set px on default" , function (assert) {
			this.gantt = this.oGanttChartContainer.getGanttCharts()[0];
			this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().setSize("200px");
			this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().setSize("600px");
			return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
				var done = assert.async();
				var oToolbar = this.oGanttChartContainer.getToolbar();
				oToolbar.getParent()._oSplitter.attachEvent("resize", function () {
					assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize(), "25%", "height of gantt1 set to 25%");
					assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().getSize(), "75%", "height of gantt2 set to 75%");
					done();
				}.bind(this));
					assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize(), "200px", "default height of gantt1 set to 200px");
					assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().getSize(), "600px", "default height of gantt2 set to 600px");
					oToolbar._oSettingsButton.firePress();
					assert.ok(oToolbar._oSettingsDialog.getDomRef() !== null);
					var oSettingItems = oToolbar._oSettingsBox.getItems();
					oSettingItems[7].setSelected(true);
					var sSettingDialogID = oToolbar._oSettingsDialog.getId();
					Element.getElementById(sSettingDialogID + "-acceptbutton").firePress();
					assert.equal(oSettingItems[7].getSelected(), true);


			}.bind(this));
		});

		QUnit.test("Gantt height is set auto  and px on default" , function (assert) {
			this.gantt = this.oGanttChartContainer.getGanttCharts()[0];
			this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().setSize("auto");
			this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().setSize("250px");
			return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
				var done = assert.async();
				var oToolbar = this.oGanttChartContainer.getToolbar();
				oToolbar.getParent()._oSplitter.attachEvent("resize", function () {
					assert.ok(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize().endsWith("%"), "height of gantt1 set in %");
					assert.ok(this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().getSize().endsWith("%"), "height of gantt2 set in %");
					done();
				}.bind(this));
					assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[0].getLayoutData().getSize(), "auto", "default height of gantt1 set to auto");
					assert.equal(this.oGanttChartContainer._oSplitter.getContentAreas()[1].getLayoutData().getSize(), "250px", "default height of gantt2 set to 250px");
					oToolbar._oSettingsButton.firePress();
					assert.ok(oToolbar._oSettingsDialog.getDomRef() !== null);
					var oSettingItems = oToolbar._oSettingsBox.getItems();
					oSettingItems[7].setSelected(true);
					var sSettingDialogID = oToolbar._oSettingsDialog.getId();
					Element.getElementById(sSettingDialogID + "-acceptbutton").firePress();
					assert.equal(oSettingItems[7].getSelected(), true);

			}.bind(this));
		});

	QUnit.test("Validate gantt chart height on browser resize" , function (assert) {
		this.gantt = this.oGanttChartContainer.getGanttCharts()[0];
		return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
			var done = assert.async();
			var aContentArea = this.oGanttChartContainer._oSplitter.getContentAreas();
			var oLayoutData0 = aContentArea[0].getLayoutData();
			var oLayoutData1 = aContentArea[1].getLayoutData();
			this.oGanttChartContainer._oSplitter.attachEventOnce("resize",function(){
				assert.equal(oLayoutData0.getSize(),"25%","height of gantt1 set to 25%");
				assert.equal(oLayoutData1.getSize(),"75%","height of gantt2 set to 75%");
				document.body.style.zoom = "100%"; // reset browser zoom
				done();
			});
			assert.equal(oLayoutData0.getSize(), "auto", "default height of gantt1 set to auto");
			assert.equal(oLayoutData1.getSize(), "auto", "default height of gantt2 set to auto");
			oLayoutData0.setSize("200px");
			oLayoutData1.setSize("600px");
			document.body.style.zoom = "80%"; // change browser zoom
		}.bind(this));
	});

	QUnit.module("Shared Properties Sync", {
		beforeEach: function() {
			this.oContainer = new GanttChartContainer({
				ganttCharts: [
					new GanttChartWithTable("gantt1", {
						table: new sap.ui.table.Table({
							rowSettingsTemplate: new sap.gantt.simple.GanttRowSettings()
						})
					}),
					new GanttChartWithTable("gantt2",{
						table: new sap.ui.table.Table({
							rowSettingsTemplate: new sap.gantt.simple.GanttRowSettings()
						})
					})
				]
			});
		},
		afterEach: function(){
			this.oContainer.destroy();
		},

		assertGanttPropertyEquals: function(assert, sProperty, bValue) {
			this.oContainer.getGanttCharts().forEach(function(oGantt) {
				var sMsg = "property: " + sProperty + "is set correctly on Gantt: " + oGantt.getId();
				assert.strictEqual(oGantt.getProperty(sProperty), bValue, sMsg);
			});
		}
	});

	QUnit.test("Test shared property values is set on child Gantt Chart", function(assert) {
		var fnTestCase = function(sProperty, bValue) {
			this.oContainer["set" + jQuery.sap.charToUpperCase(sProperty)](bValue);
			this.assertGanttPropertyEquals(assert, sProperty, bValue);
		}.bind(this);

		var sProperty = "enableCursorLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableNowLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableAdhocLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableDeltaLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableVerticalLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableNonWorkingTime";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);
	});

	QUnit.test("Gantt chart shared property dominated by container", function(assert) {
		var oLastRemovedGantt = this.oContainer.removeGanttChart(1);

		assert.ok(oLastRemovedGantt.getEnableCursorLine(), "the enableCursorLine is true by default");
		this.oContainer.setEnableCursorLine(false);
		var fnInvalidateGantt = sinon.spy(oLastRemovedGantt, "invalidate");
		this.oContainer.addGanttChart(oLastRemovedGantt);
		assert.ok(fnInvalidateGantt.notCalled, "Invalidate Gantt not called");
		assert.notOk(oLastRemovedGantt.getEnableCursorLine(), "now enableCursorLine is false because property value on container changed");
	});

	QUnit.test("Test values of dependents aggregation", function(assert){
		assert.strictEqual(this.oContainer.getGanttCharts().length, 2, "Container should have two gantt charts initially.");
		assert.strictEqual(this.oContainer.getDependents().length, 0, "Default length of dependent aggregation is Zero");

		var oLastRemovedGantt = this.oContainer.removeGanttChart(1);
		assert.strictEqual(this.oContainer.indexOfDependent(oLastRemovedGantt), 0, "Removed ganttChart is added to Dependents aggregation");
		this.oContainer.addGanttChart(oLastRemovedGantt);
		assert.strictEqual(this.oContainer.getDependents().length, 0, "length of dependent aggregation should be Zero after adding back the removed ganttchart.");

		this.oContainer.removeAllGanttCharts();
		assert.strictEqual(this.oContainer.getGanttCharts().length, 0, "ganttChart aggregation should be Empty.");
		assert.strictEqual(this.oContainer.getDependents().length, 2, "Dependents aggregation should have both the removed ganttcharts.");
	});

	QUnit.test("Check dependents aggregattion after Destroy and recreate of container", function(assert){
		assert.strictEqual(this.oContainer.getGanttCharts().length, 2, "Container should have two gantt charts initially.");
		assert.strictEqual(this.oContainer.getDependents().length, 0, "Default length of dependent aggregation is Zero");
	});
	QUnit.module("gantt chart layout on empty Container", {
		beforeEach: function(){
			this.sut = new GanttChartContainer({
				layoutOrientation: "Vertical"
			});
		},
		afterEach: function(){
			this.sut.destroy();
		}
	});
	QUnit.test("The container has correct default value on property", function(assert){
		var sOrientation = this.sut.getLayoutOrientation();
		assert.strictEqual(sOrientation, coreLibrary.Orientation.Vertical, "Default splitter orientation is Vertical");
		assert.strictEqual(sOrientation, this.sut._oSplitter.getOrientation(), "Inner splitter has the same value");
	});

	QUnit.test("layoutOrientation value synced between splitter", function(assert){
		this.sut.setLayoutOrientation("Horizontal");
		assert.strictEqual(this.sut.getLayoutOrientation(), "Horizontal", "property value changed");
		assert.strictEqual(this.sut._oSplitter.getOrientation(), "Horizontal", "splitter property value changed");
	});

	QUnit.module("gantt chart layout data", {
		beforeEach: function(){
			this.sut = new GanttChartContainer({
				ganttCharts: [
					new GanttChartWithTable({
						layoutData: new SplitterLayoutData({size: "60%", minSize: 500})
					}),
					new GanttChartWithTable()
				]
			});
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("layoutData cloned to splitter content", function(assert){
		var aContents = this.sut._oSplitter.getContentAreas();

		assert.ok(aContents.length === this.sut.getGanttCharts().length, "contents length equals");
		assert.ok(aContents[0].isA("sap.gantt.control.AssociateContainer"), "contentArea aggregation has AssociateContainer type");

		// first gantt chart layout data cloned to splitter first content
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "60%", "size propogated to splitter content");
		assert.strictEqual(aContents[0].getLayoutData().getMinSize(), 500, "size propogated to splitter content");

		assert.strictEqual(aContents[1].getLayoutData().getSize(), "auto", "a default LayoutData is initialized by default");

		assert.ok(this.sut.getGanttCharts()[0].isA("sap.gantt.simple.GanttChartWithTable"), "ganttCharts aggregation stay still");
	});

	QUnit.test("layoutData changed on GanttChartWithTable", function(assert){
		var aContents = this.sut._oSplitter.getContentAreas();

		// Action: update size only
		this.sut.getGanttCharts()[0].getLayoutData().setSize("800px");
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "60%", "update the size won't propogated to container");

		// replace the layoutData
		this.sut.getGanttCharts()[0].setLayoutData(new SplitterLayoutData({size: "800px"}));
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "800px", "size updated on splitter as well");
	});

	QUnit.module("GanttChartContainer splitter layout size on insert and remove gantt", {
		beforeEach: function() {
			this.sut = new GanttChartContainer({
				ganttCharts: [GanttUtils.createGanttWithOData(), GanttUtils.createGanttWithOData("table2")]
			});
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("layoutData changed on insertGanttChart and removeGanttChart", function(assert){
		var done = assert.async();
		this.sut.getGanttCharts()[0].setLayoutData(new SplitterLayoutData({size: "60%"}));
		var aContents = this.sut._oSplitter.getContentAreas();
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "60%", "Correct initial splitter layout size");
		assert.strictEqual(aContents[1].getLayoutData().getSize(), "auto", "Correct default splitter layout size");
		var oGantt = this.sut.getGanttCharts()[1].clone();
		aContents[0].getLayoutData().setSize("30%");
		aContents[1].getLayoutData().setSize("70%");
		this.sut.insertGanttChart(oGantt, 1);
		return GanttUtils.waitForGanttRendered(oGantt).then(function () {
			aContents = this.sut._oSplitter.getContentAreas();
			assert.strictEqual(aContents[0].getLayoutData().getSize(), "30%", "Correct splitter layout size");
			assert.strictEqual(aContents[1].getLayoutData().getSize(), "auto", "Splitter layout size set to auto after insertGanttChart");
			assert.strictEqual(aContents[2].getLayoutData().getSize(), "auto", "Splitter layout size set to auto after insertGanttChart");
			aContents[0].getLayoutData().setSize("25%");
			aContents[1].getLayoutData().setSize("35%");
			aContents[2].getLayoutData().setSize("40%");
			this.sut.removeGanttChart(oGantt);
			return GanttUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
				aContents = this.sut._oSplitter.getContentAreas();
				assert.strictEqual(aContents[0].getLayoutData().getSize(), "25%", "Correct splitter layout size");
				assert.strictEqual(aContents[1].getLayoutData().getSize(), "auto", "Splitter layout size set to auto after removeGanttChart");
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Single gantt");

	QUnit.test("selectionPanelSize should work in chart container as well", function (assert) {
		var oGantt = GanttUtils.createGantt(true);
		oGantt.setSelectionPanelSize("77px"); // 60px is minimum so we have to set more
		var oContainer = new GanttChartContainer({
			ganttCharts: [oGantt]
		});
		oContainer.placeAt("qunit-fixture");
		assert.strictEqual(oGantt.getSelectionPanelSize(), "77px", "Selection panel size should be 77px.");
		oContainer.destroy();
	});

	QUnit.module("Status bar in different modes", {
		beforeEach: function(){
			this.oGantt = GanttUtils.createGantt(true);
			this.oContainer = new GanttChartContainer({
				ganttCharts: [this.oGantt]
			});
			this.oContainer.setEnableStatusBar(true);
			this.oContainer.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Status bar in cozy mode", async function (assert) {
		document.querySelector('.sapUiBody').classList.remove("sapUiSizeCompact");
		document.querySelector('.sapUiBody').classList.add("sapUiSizeCozy");
		await nextUIUpdate();
		assert.strictEqual(Math.round(parseFloat(window.getComputedStyle(document.getElementsByClassName("sapGanttContainerStatusBar")[0]).height)) + "px", "32px", "Status bar height should be 32px in cozy mode");
	});

	QUnit.test("Status bar in condensed mode", async function (assert) {
		document.querySelector('.sapUiBody').classList.remove("sapUiSizeCozy");
		document.querySelector('.sapUiBody').classList.add("sapUiSizeCondensed");
		await nextUIUpdate();
		assert.strictEqual(Math.round(parseFloat(window.getComputedStyle(document.getElementsByClassName("sapGanttContainerStatusBar")[0]).height)) + "px", "32px", "Status bar height should be 32px in condensed mode");
	});

	QUnit.test("Status bar in compact mode", async function (assert) {
		document.querySelector('.sapUiBody').classList.remove("sapUiSizeCondensed");
		document.querySelector('.sapUiBody').classList.add("sapUiSizeCompact");
		await nextUIUpdate();
		assert.strictEqual(Math.round(parseFloat(window.getComputedStyle(document.getElementsByClassName("sapGanttContainerStatusBar")[0]).height)) + "px", "32px", "Status bar height should be 32px in compact mode");
	});

	QUnit.module("Zoom buttons Enable/Disable", {
		beforeEach: function(){
			this.oGantt = GanttUtils.createGantt(true);
			this.oContainer = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					content: [
						new sap.m.Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [this.oGantt]
			});
			this.oContainer.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Test focus shifts to zoom out on reaching max zoom level ", function(assert){
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oGanttContainer = this.oGantt.getParent();
			this.oToolbar = oGanttContainer.getToolbar();
			this.oZoomOutButton = this.oToolbar._oZoomOutButton;
			this.oZoomSlider = this.oToolbar._oZoomSlider;
			this.oZoomInButton = this.oToolbar._oZoomInButton;
			this.oZoomSlider.setValue(8);
			var fnDone = assert.async();
			this.oToolbar.attachEvent("zoomStopChange", function () {
				assert.strictEqual(this.oZoomInButton.getEnabled(), false, "Zoom in disabled");
				this.oZoomOutButton.applyFocusInfo();
				assert.strictEqual(document.activeElement, this.oZoomOutButton.getDomRef(), "Zoom out button is in focused state");
				fnDone();
			}.bind(this));
			this.oZoomInButton.firePress();
		}.bind(this));
	});

	QUnit.test("Test focus shifts to zoom in on reaching min zoom level ", function(assert){
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oGanttContainer = this.oGantt.getParent();
			this.oToolbar = oGanttContainer.getToolbar();
			this.oZoomOutButton = this.oToolbar._oZoomOutButton;
			this.oZoomSlider = this.oToolbar._oZoomSlider;
			this.oZoomInButton = this.oToolbar._oZoomInButton;
			this.oZoomSlider.setValue(1);
			var fnDone = assert.async();
			this.oToolbar.attachEvent("zoomStopChange", function () {
				assert.strictEqual(this.oZoomOutButton.getEnabled(), false, "Zoom out disabled");
				this.oZoomInButton.applyFocusInfo();
				assert.strictEqual(document.activeElement, this.oZoomInButton.getDomRef(), "Zoom in button is in focused state");
				fnDone();
			}.bind(this));
			this.oZoomOutButton.firePress();
		}.bind(this));
	});

	QUnit.test("Zoom out disable for proportion strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oToolBar = this.oContainer.getToolbar();
			var oZoomOutButton = oToolBar._oZoomOutButton;
			assert.strictEqual(oZoomOutButton.getEnabled(), false, "Zoom out button is disabled");
		}.bind(this));
	});

	QUnit.test("Zoom in disable for proportion strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function() {
			this.oGantt.getAxisTimeStrategy().setZoomLevel(9);
			var oToolBar = this.oContainer.getToolbar();
			var oZoomInButton = oToolBar._oZoomInButton;
			assert.strictEqual(oZoomInButton.getEnabled(), false, "Zoom in button is disabled");
		}.bind(this));
	});

	QUnit.test("Zoom out disable for stepwise strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			this.oGantt.getAxisTimeStrategy().setZoomLevel(0);
			var oToolBar = this.oContainer.getToolbar();
			var oZoomOutButton = oToolBar._oZoomOutButton;
			assert.strictEqual(oZoomOutButton.getEnabled(), false, "Zoom out button is disabled");
		}.bind(this));
	});

	QUnit.test("Zoom in disable for stepwise strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			this.oGantt.getAxisTimeStrategy().setZoomLevel(9);
			var oToolBar = this.oContainer.getToolbar();
			var oZoomInButton = oToolBar._oZoomInButton;
			assert.strictEqual(oZoomInButton.getEnabled(), false, "Zoom in button is disabled");
		}.bind(this));
	});

	QUnit.test("Zoom out disable for fullscreen strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new FullScreenStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oToolBar = this.oContainer.getToolbar();
			var oZoomOutButton = oToolBar._oZoomOutButton;
			assert.strictEqual(oZoomOutButton.getEnabled(), false, "Zoom out button is disabled");
		}.bind(this));
	});

	QUnit.test("Zoom in disable for fullscreen strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new FullScreenStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			zoomLevel: 9
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oToolBar = this.oContainer.getToolbar();
			var oZoomInButton = oToolBar._oZoomInButton;
			assert.strictEqual(oZoomInButton.getEnabled(), false, "Zoom in button is disabled");
		}.bind(this));
	});

	QUnit.test("Test header render and scroll when setting items changed." , async function (assert) {
		this.oContainer.placeAt("content");
		var done = assert.async();
		var oInnerGanttRenderImmediatelySpy = sinon.spy(this.oGantt.getInnerGantt().getRenderer(), "renderImmediately");

		this.oGantt.getInnerGantt().attachEvent("ganttReady", function (oEvent) {
			if (oEvent.getParameter("supressEvent")){
				assert.ok(oInnerGanttRenderImmediatelySpy.calledOnce, "Gantt renderImmediately method is triggered once");
				assert.strictEqual(this.oContainer._bToolbarSettingsItemChanged, false);
				done();
			}
		}.bind(this));

		this.oContainer.setEnableVerticalLine(false);
		var aSettingItems = this.oContainer.getToolbar()._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[2];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);
		assert.strictEqual(this.oGantt.getEnableVerticalLine(), false);

		this.oGantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		this.oGantt.getAxisTimeStrategy().setZoomLevel(9);
		await nextUIUpdate();
		var oToolBar = this.oContainer.getToolbar();
		oToolBar._oSettingsButton.firePress();

		await nextUIUpdate();

		assert.ok(this.oContainer.getToolbar()._oSettingsDialog.getDomRef() !== null);

		var oSettingItems = oToolBar._oSettingsBox.getItems();
		oSettingItems[2].setSelected(true);
		var sSettingDialogID = oToolBar._oSettingsDialog.getId();
		Element.getElementById(sSettingDialogID + "-acceptbutton").firePress();
		assert.strictEqual(oSettingItems[2].getSelected(), true);
	});

	QUnit.test("Test gantt ready event of inner Gantt when triggered by renderImmediately", function (assert) {
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function() {
			this.oGantt.getInnerGantt().attachEventOnce("ganttReady", function (oEvent) {
				assert.ok(oEvent.getParameter("supressEvent"), "Gantt ready event triggered by horizon change");
				done();
			});
			this.oGantt.getAxisTimeStrategy().setZoomLevel(9);
		}.bind(this));
	});

	QUnit.test("Test gantt ready event of inner Gantt when triggered by onAfterRendering", function (assert) {
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function() {
			this.oGantt.getInnerGantt().attachEventOnce("ganttReady", function (oEvent) {
				assert.notOk(oEvent.getParameter("supressEvent"), "Gantt ready event triggered by vertical scroll");
				done();
			});
			this.oGantt.setDisplayType("Chart");
		}.bind(this));
	});

	QUnit.test("Horizontal scrollbar size for stepwise zoom strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20170101000000",
				endTime: "20170301000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oAxisTimeStrategy = this.oGantt.getAxisTimeStrategy();
			var iLastZoom = oAxisTimeStrategy.getZoomLevel();
			var oNewTotalHorizon = oAxisTimeStrategy.getTotalHorizon().clone();
			oNewTotalHorizon.setStartTime("20161201000000");
			oNewTotalHorizon.setEndTime("20170601000000");
			this.oGantt.getAxisTimeStrategy().setTotalHorizon(oNewTotalHorizon);
			assert.strictEqual(oAxisTimeStrategy.getZoomLevel(), iLastZoom, "Zoom level should not change");
			assert.strictEqual(oAxisTimeStrategy.oLastTotalHorizonStartTime, "20161201000000", "Correct total horizon start time");
			assert.strictEqual(oAxisTimeStrategy.oLastTotalHorizonEndTime, "20170601000000", "Correct total horizon end time");
		}.bind(this));
	});

	QUnit.module("Test Bird Eye", {
		beforeEach: function () {
			return this.fnCreateGanttContainer();
		},
		afterEach: function () {
			this.oGanttStepWiseContainer.destroy();
			this.oGanttStepWiseContainer = undefined;
			this.oGantt = undefined;
		},
		fnCreateGanttContainer: function () {
			this.oGanttStepWiseContainer = new GanttChartContainer("containerStepwise", {
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
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
							selectionMode: sap.ui.table.SelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							rowMode: new AutoRowMode({
								minRowCount: 3
							}),
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape1ID}",
								shapes1: new BaseRectangle({
									shapeId: "{Rectangle1ID}",
									time: "{Rectangle1StartDate}",
									endTime: "{Rectangle1EndDate}",
									title: "{Rectangle1Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new StepwiseZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20160501000000",
								endTime: "20170901000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20160501000000",
								endTime: "20170901000000"
							})
						})
					})
				]
			});

			this.oGantt = this.oGanttStepWiseContainer.getGanttCharts()[0];

			var sHeight = "500px";
			document.getElementById("qunit-fixture").style.height = sHeight;
			var oPanel = new Panel({
				height: sHeight,
				content: [this.oGanttStepWiseContainer]
			});

			var oData = {
				root : {
					name: "root",
					description: "root description",
					0: {
						name: "item1",
						description: "item1 description",
						Shape1ID: "0",
						Rectangle1ID: "0-1",
						Rectangle1StartDate: new Date(2016, 2, 20),
						Rectangle1EndDate: new Date(2017, 9, 21),
						Rectangle1Desc: "Test Rectangle 1"
					}
				}
			};

			var oModel = new JSONModel();
			oModel.setData(oData);
			oPanel.setModel(oModel);

			oPanel.placeAt("qunit-fixture");

			return GanttUtils.waitForGanttRendered(this.oGanttStepWiseContainer.getGanttCharts()[0], true);
		}
	});

	QUnit.test("Test bird eye with stepwise zoom strategy." , function (assert) {
		var oAxisTimeStrategy = this.oGantt.getAxisTimeStrategy();
		oAxisTimeStrategy.setZoomLevel(0);
		var oToolBar = this.oGanttStepWiseContainer.getToolbar();
		var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
		var oRectangleShape = oRowSettings.getShapes1()[0];
		var oVisibleHorizon = oAxisTimeStrategy.getVisibleHorizon();
		assert.strictEqual(Format.dateToAbapTimestamp(oRectangleShape.getTime()).substr(0,8) >= oVisibleHorizon.getStartTime().substr(0,8), true, "Visible horizon start time should be less than shape start time");
		assert.strictEqual(Format.dateToAbapTimestamp(oRectangleShape.getEndTime()).substr(0,8) <= oVisibleHorizon.getEndTime().substr(0,8), true, "Visible horizon end time should be greater than shape end time");
		assert.strictEqual(oToolBar.getZoomLevel() === 0, true, "Zoom level should be zero");
		assert.strictEqual(oAxisTimeStrategy.bBirdEyeTriggered === undefined, true, "bBirdEyeTriggered should be undefined before bird eye triggered");
		oToolBar._oBirdEyeButton.firePress();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			assert.strictEqual(oAxisTimeStrategy.bBirdEyeTriggered === false, true, "bBirdEyeTriggered should be false");
			assert.strictEqual(Format.dateToAbapTimestamp(oRectangleShape.getTime()).substr(0,8) >= oVisibleHorizon.getStartTime().substr(0,8), true, "Shape start time should be greater than Visible horizon start time");
			assert.strictEqual(Format.dateToAbapTimestamp(oRectangleShape.getEndTime()).substr(0,8) <= oVisibleHorizon.getEndTime().substr(0,8), true, "Shape end time should be less than Visible horizon end time");
			assert.strictEqual(oToolBar.getZoomLevel() != 0, true, "Zoom level has been changed.");
		});
	});
	QUnit.module("Test Enable Variant Management");
	QUnit.test("Test enableVariantManagement - GanttContainer enableVM false" , async function (assert) {
		var oGanttContainer = new GanttChartContainer({
			toolbar: new ContainerToolbar()
		});
		var oToolbar = oGanttContainer.getToolbar();

		var genToolbarZoomStub = sinon.stub(oToolbar, "_genTimeZoomFlexBox");

		oGanttContainer.placeAt("content");
		await nextUIUpdate();

		var aToolBarVariantManagement = oToolbar.getContent().filter( function(oContent){
			return oContent.isA("sap.ui.fl.variants.VariantManagement");
		});
		assert.ok(aToolBarVariantManagement.length === 0, "Variant Management control is added to Toolbar");

		genToolbarZoomStub.restore();
	});

	QUnit.test("Test enableVariantManagement - GanttContainer enableVM true" , async function (assert) {
		var oGanttContainer = new GanttChartContainer({
			enableVariantManagement : true,
			toolbar: new ContainerToolbar()
		});
		var oToolbar = oGanttContainer.getToolbar();

		var genToolbarZoomStub = sinon.stub(oToolbar, "_genTimeZoomFlexBox"),
		attachVarAppliedStub = sinon.stub(ControlVariantApplyAPI, "attachVariantApplied");

		oGanttContainer.placeAt("content");
		await nextUIUpdate();

		var aToolBarVariantManagement = oToolbar.getContent().filter( function(oContent){
			return oContent.isA("sap.ui.fl.variants.VariantManagement");
		});
		assert.ok(aToolBarVariantManagement.length === 1, "Variant Management control is added to Toolbar");

		genToolbarZoomStub.restore();
		attachVarAppliedStub.restore();
	});
});

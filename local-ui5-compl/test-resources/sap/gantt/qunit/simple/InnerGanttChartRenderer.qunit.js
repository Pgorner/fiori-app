/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/InnerGanttChartRenderer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/MultiActivityRowSettings",
	"sap/gantt/test/simple/SteppedTask",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseDiamond",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/ui/core/RenderManager",
	"sap/gantt/misc/Utility",
	"sap/gantt/simple/GanttUtils"
], function(InnerGanttChartRenderer, GanttRowSettings, MultiActivityRowSettings, SteppedTask, BaseRectangle, utils, BaseGroup, BaseDiamond, Relationship, BaseCalendar, ProportionZoomStrategy, TimeHorizon,
	RenderManager, Utility, GanttUtils) {
	"use strict";

	QUnit.module("InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions");

	QUnit.test("Generated array is in format accepted by RenderUtils.createOrderedListOfRenderFunctionsFromTemplate", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Bottom";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Bottom";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var bContainsAtLeastOneUnshiftProperty = false,
			bAllItemsContainFnCallbackProperty = true;

		aTemplate.forEach(function(oItem) {
			if (oItem.hasOwnProperty("bUnshift")) {
				bContainsAtLeastOneUnshiftProperty = true;
			}
			if (!oItem.hasOwnProperty("fnCallback")) {
				bAllItemsContainFnCallbackProperty = false;
			}
		});

		assert.ok(bContainsAtLeastOneUnshiftProperty, "Array contains item with at least one bUnshift property");
		assert.ok(bAllItemsContainFnCallbackProperty, "Array contains item with at least one fnCallback property");
	});

	QUnit.test("Generated array contains all rendering functions when getEnableAdhocLine  and getEnableDeltaLine is true", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Bottom";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Bottom";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate1 = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);

		var aExpectedTemplate1 = [
			{
				"fnCallback": InnerGanttChartRenderer.renderAllShapesInRows
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderRlsContainer
			},
			{
				"fnCallback": InnerGanttChartRenderer.renderAssistedContainer
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderAdhocLines
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderDeltaLines
			}
		];

		assert.deepEqual(aTemplate1, aExpectedTemplate1, "Rendered template contains all expected rendering functions");
	});

	QUnit.test("Generated array contains all rendering functions except renderAdhocLines when getEnableAdhocLine is false", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Bottom";
			},
			getEnableAdhocLine: function() {
				return false;
			},
			getDeltaLineLayer: function() {
				return "Bottom";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var aExpectedTemplate = [
			{
				"fnCallback": InnerGanttChartRenderer.renderAllShapesInRows
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderRlsContainer
			},
			{
				"fnCallback": InnerGanttChartRenderer.renderAssistedContainer
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderDeltaLines
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions except renderAdhocLines ");
	});

	QUnit.test("Generated array contains all rendering functions except renderDeltaLines when getEnableDeltaLine is false", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Bottom";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Bottom";
			},
			getEnableDeltaLine: function() {
				return false;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var aExpectedTemplate = [
			{
				"fnCallback": InnerGanttChartRenderer.renderAllShapesInRows
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderRlsContainer
			},
			{
				"fnCallback": InnerGanttChartRenderer.renderAssistedContainer
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderAdhocLines
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions except renderDeltaLines");
	});

	QUnit.test("Generated array contains all rendering functions", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Bottom";
			},
			getEnableAdhocLine: function() {
				return false;
			},
			getDeltaLineLayer: function() {
				return "Bottom";
			},
			getEnableDeltaLine: function() {
				return false;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var aExpectedTemplate = [
			{
				"fnCallback": InnerGanttChartRenderer.renderAllShapesInRows
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderRlsContainer
			},
			{
				"fnCallback": InnerGanttChartRenderer.renderAssistedContainer
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions");
	});

	QUnit.test("Unshift for renderAdhocLines and renderDeltaLines callback is true when getAdhocLineLayer and getDeltaLineLayer is Top", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Top";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Top";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var aExpectedTemplate = [
			{
				"fnCallback": InnerGanttChartRenderer.renderAllShapesInRows
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderRlsContainer
			},
			{
				"fnCallback": InnerGanttChartRenderer.renderAssistedContainer
			},
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderAdhocLines
			},
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderDeltaLines
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions");
	});

	QUnit.test("Unshift for renderRlsContainer callback is false when getShapeOverRelationship is false", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return false;
			},
			getAdhocLineLayer: function() {
				return "Bottom";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Bottom";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var aExpectedTemplate = [
			{
				"fnCallback": InnerGanttChartRenderer.renderAllShapesInRows
			},
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderRlsContainer
			},
			{
				"fnCallback": InnerGanttChartRenderer.renderAssistedContainer
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderAdhocLines
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderDeltaLines
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions");
	});

	QUnit.module("interactive expand chart", {
		beforeEach: function() {
			this.sut = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new SteppedTask({
						shapeId: "{Id}",
						expandable: true,
						task: new BaseRectangle({
							time: "{StartDate}",
							endTime: "{EndDate}",
							fill: "#008FD3",
							height: 20
						}),
						breaks: {
							path: "breaks",
							template: new BaseRectangle({
								scheme: "break",
								time: "{StartDate}",
								endTime: "{EndDate}",
								fill: "red",
								height: 20
							}),
							templateShareable: true
						}
					})
				]
			}), true/**bCreate expand data */);

			this.sut.addShapeScheme(new sap.gantt.simple.ShapeScheme({
				key: "break",
				rowSpan: 1
			}));

			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getMainShape: function(iIndex) {
			var oRowSettings = this.sut.getTable().getRows()[iIndex].getAggregation("_settings");
			return oRowSettings.getShapes1()[0];
		}
	});
	QUnit.test("Expand or collapse single rows by enabling the row border and disabling the row background color", function (assert) {
		var iExpandIndex = 0;
		this.sut.setEnableExpandedRowBackground(false);
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.expand("break", iExpandIndex);
			return new Promise(function (resolve1) {
				setTimeout(function () {
					var oMainShape = this.getMainShape(iExpandIndex);
					assert.ok(oMainShape != null, "the main shape can be found");
					assert.ok(oMainShape.getBreaks().length > 1, "there has lazy and expandable shapes");
					oMainShape.getBreaks().forEach(function (oBreak) {
						assert.notEqual(oBreak.getDomRef(), null, "each expand shape has DOM ref");
					});
					var mExpanded = this.sut._oExpandModel.mExpanded;
					assert.notEqual(mExpanded, null, "mExpanded has values");
					assert.equal(Object.keys(mExpanded).length, 1, "only 1 key exists");
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolveFinal) {
					this.sut.collapse("break", iExpandIndex);

					setTimeout(function () {
						this.getMainShape(iExpandIndex).getBreaks().forEach(function (oBreak) {
							assert.equal(oBreak.getDomRef(), null, "expand shape DOM refs are removed");
						});
						resolveFinal();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Expand or collapse single row by disabling the row border and enabling the row background color", function (assert) {
		var iExpandIndex = 0;
		this.sut.setEnableExpandedRowBorders(false);
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.expand("break", iExpandIndex);
			return new Promise(function (resolve1) {
				setTimeout(function () {
					var oMainShape = this.getMainShape(iExpandIndex);
					assert.ok(oMainShape != null, "the main shape can be found");
					assert.ok(oMainShape.getBreaks().length > 1, "there has lazy and expandable shapes");
					oMainShape.getBreaks().forEach(function (oBreak) {
						assert.notEqual(oBreak.getDomRef(), null, "each expand shape has DOM ref");
					});
					var mExpanded = this.sut._oExpandModel.mExpanded;
					assert.notEqual(mExpanded, null, "mExpanded has values");
					assert.equal(Object.keys(mExpanded).length, 1, "only 1 key exists");
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolveFinal) {
					this.sut.collapse("break", iExpandIndex);

					setTimeout(function () {
						this.getMainShape(iExpandIndex).getBreaks().forEach(function (oBreak) {
							assert.equal(oBreak.getDomRef(), null, "expand shape DOM refs are removed");
						});
						resolveFinal();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.module("InnerGanttChartRenderer.renderCalendarShapes - GanttRowSettings", {
		beforeEach: function() {
			this.oGantt = utils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new BaseGroup({
						shapeId: "group01",
						selectable: true,
						shapes: [
							new BaseGroup({
								shapeId: "group02",
								selectable: true,
								x:0,
								shapes: [
									new BaseDiamond({
										shapeId: "diamond01",
										selectable: true,
										x:0
									})
								]
							})
						]
					})
				],
				shapes2:[
					new BaseRectangle({
						shapeId: "rectangle01",
						selectable: true,
						title: "Market Research",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					})
				],
				relationships: [
					new Relationship({
						type: "FinishToStart",
						shapeId: "relationship01",
						predecessor: "group01",
						successor: "rectangle01"
					})
				],
				calendars: [
					new BaseCalendar({
						calendarName: "calendar01"
					})
				],
				calendars1: [
					new BaseCalendar({
						calendarName: "calendar02"
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getFirstRowSettingAggregation: function(iIndex) {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			return {
				"oBaseGroup" : oRowSettings.getShapes1()[0],
				"oBaseRectangle": oRowSettings.getShapes2()[0],
				"oRelationship": oRowSettings.getRelationships()[0],
				"oCalendars": oRowSettings.getCalendars()[0],
				"oCalendars1": oRowSettings.getCalendars1()[0]
			};
		}
	});
	QUnit.test("Check if only Calendars are rendered", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var oFirstRowSetting = this.getFirstRowSettingAggregation();
			//create stubs of each renderers
			sinon.stub(oFirstRowSetting.oBaseGroup, "renderElement");
			sinon.stub(oFirstRowSetting.oBaseRectangle, "renderElement");
			sinon.stub(oFirstRowSetting.oRelationship, "renderElement");
			sinon.stub(oFirstRowSetting.oCalendars, "renderElement");
			sinon.stub(oFirstRowSetting.oCalendars1, "renderElement");

			var oRm = new RenderManager();
			InnerGanttChartRenderer.renderCalendarShapes(oRm, this.oGantt);

			assert.ok(oFirstRowSetting.oBaseGroup.renderElement.notCalled);
			assert.ok(oFirstRowSetting.oBaseRectangle.renderElement.notCalled);
			assert.ok(oFirstRowSetting.oRelationship.renderElement.notCalled);
			assert.ok(oFirstRowSetting.oCalendars.renderElement.calledOnce);
			assert.ok(oFirstRowSetting.oCalendars1.renderElement.calledOnce);
		}.bind(this));
	});
	QUnit.module("InnerGanttChartRenderer.renderCalendarShapes - MultiActivityRowSettings", {
		beforeEach: function() {
			this.oGantt = utils.createGantt(true, new MultiActivityRowSettings({
				rowId: "row01",
				tasks: [
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
				],
				calendars: [
					new BaseCalendar({
						calendarName: "calendar01"
					})
				],
				calendars1: [
					new BaseCalendar({
						calendarName: "calendar02"
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getFirstRowSettingAggregation: function(iIndex) {
			var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			return {
				"oMultiActivityGroup": oRowSettings.getTasks()[0],
				"oCalendars": oRowSettings.getCalendars()[0],
				"oCalendars1": oRowSettings.getCalendars1()[0]
			};
		}
	});
	QUnit.test("Check if only Calendars are rendered", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var oFirstRowSetting = this.getFirstRowSettingAggregation();
			//create stubs of each renderers
			sinon.stub(oFirstRowSetting.oMultiActivityGroup, "renderElement");
			sinon.stub(oFirstRowSetting.oCalendars, "renderElement");
			sinon.stub(oFirstRowSetting.oCalendars1, "renderElement");

			var oRm = new RenderManager();
			InnerGanttChartRenderer.renderCalendarShapes(oRm, this.oGantt);

			assert.ok(oFirstRowSetting.oMultiActivityGroup.renderElement.notCalled);
			assert.ok(oFirstRowSetting.oCalendars.renderElement.calledOnce);
			assert.ok(oFirstRowSetting.oCalendars1.renderElement.calledOnce);
		}.bind(this));
	});


	QUnit.module("Rendering content div of Gantt ", {
		beforeEach: function() {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new  BaseGroup({
						shapeId: "{Id}",
						selectable: true,
						shapes: [new BaseRectangle({shapeId: "rect01", selectable: true,time:"{StartDate}",endTime:"{EndDate}"})
					]})
				]
			}));
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		}
	});

	QUnit.test("Content div should present only once", function (assert) {
		var fnDone = assert.async();
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
		return utils.waitForGanttRendered(this.oGantt).then(function() {
			setTimeout(function () {
				this.oGantt.getAxisTimeStrategy().setZoomLevel(9);
				return utils.waitForGanttRendered(this.oGantt).then(function() {
					setTimeout(function () {
						var cntNum = window.document.querySelectorAll('.sapGanttChartCnt');
						assert.strictEqual(cntNum.length, 1, "Content Div should present only once");
						fnDone();
					}, 500);
				});
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("data-sap-ui-related field should be present in row settings and row backgrounds", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function() {
			var aRows = this.oGantt.getTable().getRows();
			var aRowBackgrounds = document.getElementsByClassName("sapGanttBackgroundSVGRow");
			assert.strictEqual(aRows.length, aRowBackgrounds.length, "equal number of table rows and gantt row backgrounds");
			aRows.forEach(function(oRow, iIndex) {
				var sRowId = oRow.getId();
				assert.strictEqual(sRowId, aRowBackgrounds[iIndex].getAttribute("data-sap-ui-related"), "data-sap-ui-related field available on row background");
				var oRowSettingDom = oRow.getAggregation("_settings").getDomRef();
				assert.strictEqual(sRowId, oRowSettingDom.getAttribute("data-sap-ui-related"), "data-sap-ui-related field available on row setting");
			});
		}.bind(this));
	});

	QUnit.module("Rendering vertical line of Gantt chart", {
		beforeEach: function() {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({shapeId: "rect01", selectable: true,time:"{StartDate}",endTime:"{EndDate}"})
				]
			}));
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		}
	});

	QUnit.test("Vertical lines should match the Chart height", function (assert) {
		var fnDone = assert.async();

		return utils.waitForGanttRendered(this.oGantt).then(function() {
			var oChart = jQuery(document.getElementById(this.oGantt.getId()));

			var oSvgChart = oChart.find(".sapGanttChartSvg");
			var oVerticalLinePath = oSvgChart.find(".sapGanttChartVerticalLine").attr("d");

			var oVerticalCommandRegex = /(?:v ?)+(?<height>[0-9]+)/gm;
			var iVerticalLineMatches = oVerticalCommandRegex.exec(oVerticalLinePath);

			assert.strictEqual(oSvgChart.height(), parseInt(iVerticalLineMatches.groups.height), "Vertical line matches chart height");

			fnDone();
		}.bind(this));
	});

	QUnit.test("unused connectors are destroyed correctly when the relationship does not exist", function (assert) {
		var fnDone = assert.async();

		var oFakeInstance = {
			setModel: function() {},
			bindObject: function() {},
			destroy: function() {}
		};

		var oBindingInfo = {
			factory: function() {
				return oFakeInstance;
			},
			path: "path",
			template: {
				getBindingInfo: function () {
					return {
						parts: [{
							path: ""
						}]
					};
				}
			}
		};
		var UtilityStub = sinon.stub(Utility, "safeCall").returns(oBindingInfo);
		var GanttUtilsStub = sinon.stub(GanttUtils, "relationexist").returns(false);
		var oInstanceSpy = sinon.spy(oFakeInstance, "destroy");

		var oGantt = {
			getId: function() {},
			getTable: function () {
				return {
					getModel: function () {
						return {
							isA: function (value) {
								return value === "sap.ui.model.odata.v2.ODataModel";
							},
							getProperty: function() {
								return {
									"path" : {
										getProperty: function() {
											return {};
										}
									}
								};
							}
						};
					}
				};
			}
		};

		InnerGanttChartRenderer._renderNonVisibleRowRelationships(null, oGantt, {});

		assert.ok(oInstanceSpy.calledOnce, "Fake relationship is destroyed");

		UtilityStub.restore();
		GanttUtilsStub.restore();
		oInstanceSpy.restore();
		fnDone();
	});
});

/*global QUnit,sinon */

sap.ui.define([
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/ContainerToolbarPlaceholder",
	"sap/gantt/library",
	"sap/gantt/config/SettingItem",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/library",
	"sap/m/OverflowToolbar",
	"sap/m/Text",
	"sap/ui/fl/apply/api/ControlVariantApplyAPI",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/FindAndSelectUtils",
	"sap/gantt/misc/Format",
	"sap/gantt/simple/MultiActivityRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/MultiActivityGroup",
	"sap/gantt/simple/ShapeScheme",
	"sap/gantt/drawer/CursorLine",
	"sap/gantt/config/Locale",
	"sap/ui/core/Element",
	"sap/ui/core/Lib",
	"sap/gantt/simple/test/nextUIUpdate"
],  function (ContainerToolbar, GanttChartContainer, ContainerToolbarPlaceholder, library, SettingItem, JSONModel, Button, mobileLibrary, OverflowToolbar, Text, ControlVariantApplyAPI, GanttQUnitUtils, FindAndSelectUtils, Format, MultiActivityRowSettings, BaseRectangle, MultiActivityGroup,
	ShapeScheme, CursorLine,Locale, Element, Lib,
	nextUIUpdate) {
	"use strict";

	var GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType;
	var ContainerToolbarPlaceholderType = library.simple.ContainerToolbarPlaceholderType;
	var ButtonType = mobileLibrary.ButtonType;
	var ZoomControlType = library.config.ZoomControlType;

	var fnCheckOrder = function (assert, oToolbar, aIdOrder) {
		var aContent = oToolbar.$().children();
		for (var i = 0; i < aIdOrder.length; i++) {
			assert.equal(aContent[i].id, aIdOrder[i]);
		}
	};

	var fnCreateContainerToolbar = function () {
		var oToolbar = new ContainerToolbar("toolbar", {
			showDisplayTypeButton: true,
			showBirdEyeButton: true,
			showLegendButton: true,
			showSearchButton: true,
			content: [
				new Text({
					text: "This is gantt toolbar--"
				}),
				new Button({
					text: "Test"
				})
			],
			settingItems: [
				new SettingItem({
					key: "firstItem",
					displayText: "I am setting Item",
					checked: true
				}),
				new SettingItem({
					key: "secondItem",
					displayText: "{settings>/text}",
					checked: "{settings>/checked}"
				})
			]
		});

		var oSettingItem1 = new SettingItem({
			key: "addedItem",
			displayText: "Added by add method in code",
			checked: true
		});

		var oSettingItem2 = new SettingItem({
			key: "insertedItem",
			displayText: "Added by insert method in code",
			checked: true
		});

		var oSettingItem3 = new SettingItem({
			key: "customItem",
			displayText: "Added by custom settings",
			checked: false
		});

		oToolbar.addSettingItem(oSettingItem1);
		oToolbar.insertSettingItem(oSettingItem2, 0);
		oToolbar.insertSettingItem(oSettingItem3, 4);

		oToolbar.setModel(new JSONModel({
			"text": "Settings checkbox text",
			"checked": true
		}), "settings");

		return oToolbar;
	};

	var oToolbar = fnCreateContainerToolbar();
	oToolbar.placeAt("content");
	nextUIUpdate();

	QUnit.module("Find and Select operation", {
		beforeEach: function() {
			this.sut = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					showSearchButton: true,
					content: [
						new Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [GanttQUnitUtils.createGanttWithOData()]
			});
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("Test Find and Select's flexbox functionality" ,  function (assert) {
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		oToolbar.getParent().getGanttCharts()[0].setFindBy(["Explanation"]);

		var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");
		setTimeout(function() {
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("A");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
			setTimeout(function() {
				assert.equal(oToolbar.getParent().getGanttCharts()[0]._bTimeContinuousShapes, false, "Gantt chart doesn't have time continuous shapes");
				assert.equal(oToolbar._searchFlexBox.getItems()[1].getEnabled(), false, "Previous Navigation button is disabled");
				assert.equal(oToolbar._searchFlexBox.getItems()[3].getEnabled(), true, "Next Navigation button is enabled");
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/13)", "Results indexes are set correctly");
				assert.equal(oToolbar._searchFlexBox.getItems()[0].getValue(), "A", "Textfield value is set correctly");

				oToolbar._searchFlexBox.getItems()[0].setValue("");
				oToolbar._searchFlexBox.getItems()[0].fireSearch();
				assert.equal(oToolbar._searchFlexBox.getItems()[1].getEnabled(), false, "Previous Navigation button is disabled");
				assert.equal(oToolbar._searchFlexBox.getItems()[3].getEnabled(), false, "Next Navigation button is disabled");
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), oResourceBundle.getText("GNT_EMPTY_RESULT_INFO_TOOLBAR"), "No search results for empty string");

				oToolbar._searchFlexBox.getItems()[0].setValue("ABCD");
				oToolbar._searchFlexBox.getItems()[0].fireSearch();
				assert.equal(oToolbar._searchFlexBox.getItems()[1].getEnabled(), false, "Previous Navigation button is disabled");
				assert.equal(oToolbar._searchFlexBox.getItems()[3].getEnabled(), false, "Next Navigation button is disabled");
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), oResourceBundle.getText("GNT_EMPTY_RESULT_INFO_TOOLBAR"), "No results found");
				done();
			}, 500);
		}, 500);
	});

	QUnit.test("Test clear search api when toolbar searchbox is open",function (assert){
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			var oToolbar = this.sut.getToolbar();
			oToolbar.getParent().getGanttCharts()[0].setFindBy(["Explanation"]);
			var oGantt = this.sut.getGanttCharts()[0];
			var oContainer = this.sut;
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				oToolbar._oSearchButton.firePress();
				oToolbar._searchFlexBox.getItems()[0].setValue("A");
				oToolbar._searchFlexBox.getItems()[0].fireSearch();
				setTimeout(function() {
					assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/13)", "Results indexes are set correctly");
					assert.equal(oToolbar._searchFlexBox.getItems()[0].getValue(), "A", "Textfield value is set correctly");
					assert.equal(FindAndSelectUtils._ganttSearchResults.length > 0,true,"Correct Result found");
					oContainer.updateSearch(true);
					assert.equal(FindAndSelectUtils._ganttSearchResults.length ,0,"Search results cleared");
					assert.equal(oToolbar._searchFlexBox.getItems()[0].getValue(), "", "Search field is cleared after updateSearch is called");
					assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(0/0)", "Results indexes are reset after clearing");
					done();
				}, 500);
			});
		}.bind(this));

	});
	QUnit.test("Test clear search api when toolbar searchbox is closed",function (assert){
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			var oToolbar = this.sut.getToolbar();
			oToolbar.getParent().getGanttCharts()[0].setFindBy(["Explanation"]);
			var oGantt = this.sut.getGanttCharts()[0];
			var oContainer = this.sut;
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				oToolbar._oSearchButton.firePress();
				oToolbar._searchFlexBox.getItems()[0].setValue("A");
				oToolbar._searchFlexBox.getItems()[0].fireSearch();
				setTimeout(function() {
					assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/13)", "Results indexes are set correctly");
					assert.equal(oToolbar._searchFlexBox.getItems()[0].getValue(), "A", "Textfield value is set correctly");
					oToolbar._searchFlexBox.getItems()[5].firePress();
					assert.equal(FindAndSelectUtils._ganttSearchResults.length > 0,true,"Correct Result found");
					oContainer.updateSearch(true);
					assert.equal(FindAndSelectUtils._ganttSearchResults.length ,0,"Search results cleared");
					assert.equal(oToolbar._searchFlexBox.getItems()[0].getValue(), "", "Search field is cleared after updateSearch is called");
					assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(0/0)", "Results indexes are reset after clearing");
					done();
				}, 500);
			});
		}.bind(this));

	});
	QUnit.test("Test clear search api when sidepanel is open",function (assert){
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		var oToolBar = this.sut.getToolbar();
		var oContainer = this.sut;
		oToolBar.setFindMode("SidePanel");
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.setFindBy(["Explanation"]);
			oToolBar.attachGanttSidePanel(function(oEvent) {
				oEvent.getParameters().updateSidePanelState.enable();
			});
			oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				var aItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
				aItems[1].getContent()[0].setValue("A");
				aItems[1].getContent()[0].fireSearch();
				setTimeout(function() {
					assert.equal(aItems[2].getContent()[0].getItems()[0].getText(), "Results(13)", "Results indexes are set correctly");
					assert.equal(aItems[1].getContent()[0].getValue(), "A", "Textfield value is set correctly");
					assert.equal(FindAndSelectUtils._ganttSearchResults.length > 0,true,"Correct Result found");
					oContainer.updateSearch(true);
					assert.equal(FindAndSelectUtils._ganttSearchResults.length ,0,"Search results cleared");
					assert.equal(aItems[1].getContent()[0].getValue(), "", "Search field is cleared after updateSearch is called");
					assert.equal(aItems[2].getContent()[0].getItems()[0].getText(), "Results(0)", "Results indexes are reset after clearing");
					done();
				}, 500);
			});
		});

	});


	QUnit.test("Test Find and Select's Navigation buttons functionality" , function (assert) {
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		var fireSearchSelectionChangedSpy = sinon.spy(this.sut, "fireSearchSelectionChanged");

		oToolbar.getParent().getGanttCharts()[0].setFindBy(["Explanation"]);
		setTimeout(function() {
			assert.ok(fireSearchSelectionChangedSpy.notCalled, "searchSelectionChanged event is not trigerred");

			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("A");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();

			var assertSearchSelectionChangedSpyArgs = function (message) {
				assert.ok(fireSearchSelectionChangedSpy.calledOnce, message);

				var args = fireSearchSelectionChangedSpy.args[0][0];

				assert.equal(args.shape, FindAndSelectUtils._oFoundShape);
				assert.equal(args.rowIndex, FindAndSelectUtils.shapeInRowIndex);

				fireSearchSelectionChangedSpy.reset();
			};

			setTimeout(function() {
				assertSearchSelectionChangedSpyArgs("searchSelectionChanged event is trigerred for search action");

				oToolbar._searchFlexBox.getItems()[3].firePress();
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(2/13)", "Results indexes are set correctly by Next button");

				assertSearchSelectionChangedSpyArgs("searchSelectionChanged event is trigerred for select action");

				oToolbar._searchFlexBox.getItems()[1].firePress();
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/13)", "Results indexes are set correctly by Previous button");

				assertSearchSelectionChangedSpyArgs("searchSelectionChanged event is trigerred for select action");

				fireSearchSelectionChangedSpy.restore();
				done();
			}, 500);
		}, 500);
	});


	QUnit.test("Test Find and Select's Close button functionality" , function (assert) {
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		oToolbar.getParent().getGanttCharts()[0].setFindBy(["Explanation"]);
		setTimeout(function() {
			if (oToolbar.getShowSearchButton()) {
				oToolbar._oSearchButton.firePress();
				oToolbar._searchFlexBox.getItems()[5].firePress();
				assert.equal(oToolbar._oSearchButton.getDomRef() !== null, true, "Flexbox is closed correctly");
				done();
			} else {
				assert.equal(true, true, "Find and Select search button is not enabled by the user");
				done();
			}
		}, 500);
	});

	QUnit.test("Test Find and Select's flexbox contents." ,  function (assert) {
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		oToolbar.getParent().getGanttCharts()[0].setFindBy(["Explanation"]);

		var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");
		setTimeout(function() {
			oToolbar._oSearchButton.firePress();
			assert.equal(oToolbar._searchFlexBox.getItems()[0].isA("sap.m.SearchField"), true, "SearchField in flexbox is placed correctly");
			assert.equal(oToolbar._searchFlexBox.getItems()[1].getTooltip(), "Previous", "Previous button in flexbox is placed correctly");
			assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), oResourceBundle.getText("GNT_EMPTY_RESULT_INFO_TOOLBAR"), "Result text in flexbox is placed correctly");
			assert.equal(oToolbar._searchFlexBox.getItems()[3].getTooltip(), "Next", "Next button in flexbox is placed correctly");
			assert.equal(oToolbar._searchFlexBox.getItems()[4].getTooltip(), "Side Panel", "Side panel button in flexbox is placed correctly");
			assert.equal(oToolbar._searchFlexBox.getItems()[5].getTooltip(), "Close", "Close button in flexbox is placed correctly");
			done();
		}, 500);
	});

	QUnit.test("Test Find and Select auto scroll functionality" , function (assert) {
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.setFindBy(["Explanation"]);
		setTimeout(function() {
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("A");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
			setTimeout(function() {
				var iIndex = oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("shapes1")[0].getSelected() ? 0 : 1;
				var oRow1Shape = oGantt.getTable().getRows()[iIndex].getAggregation("_settings").getAggregation("shapes1")[0];
				var oRow2Shape = oGantt.getTable().getRows()[iIndex + 1].getAggregation("_settings").getAggregation("shapes1")[0];
				var oRow3Shape = oGantt.getTable().getRows()[iIndex + 2].getAggregation("_settings").getAggregation("shapes1")[0];
				var oVisibleHorizon = oGantt.getAxisTimeStrategy().getVisibleHorizon();
				assert.equal(oGantt.getSelectedShapeUid(), oRow1Shape.getShapeUid(), "Correct shape found");
				assert.equal(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(oRow1Shape.getTime()), "Gantt chart auto scrolled to the start of the found shape");
				oToolbar._searchFlexBox.getItems()[3].firePress();
				assert.equal(oGantt.getSelectedShapeUid(), oRow2Shape.getShapeUid(), "Correct shape found");
				assert.equal(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(oRow2Shape.getTime()), "Gantt chart auto scrolled to the start of the found shape");
				oToolbar._searchFlexBox.getItems()[3].firePress();
				assert.equal(oGantt.getSelectedShapeUid(), oRow3Shape.getShapeUid(), "Correct shape found");
				assert.equal(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(oRow3Shape.getTime()), "Gantt chart auto scrolled to the start of the found shape");
				oToolbar._searchFlexBox.getItems()[1].firePress();
				assert.equal(oGantt.getSelectedShapeUid(), oRow2Shape.getShapeUid(), "Correct shape found");
				assert.equal(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(oRow2Shape.getTime()), "Gantt chart auto scrolled to the start of the found shape");
				done();
			}, 500);
		}, 500);
	});

	QUnit.test("Focus handling", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			var oGantt = this.sut.getGanttCharts()[0];
			oGantt.setFindBy(["Explanation"]);
			var oToolBar = oGantt.getParent().getToolbar();
			oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function(){
					assert.equal(document.activeElement, oToolBar._searchFlexBox.getItems()[0].getDomRef().getElementsByTagName("input")[0], "Search input should be focussed on clicking find button");
					oToolBar._searchFlexBox.getItems()[0].setValue("A");
					oToolBar._searchFlexBox.getItems()[0].fireSearch();
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
						setTimeout(function() {
							assert.equal(document.activeElement, oToolBar._searchFlexBox.getItems()[3].getDomRef(), "Navigate forward button should be focussed");
							oToolBar._searchFlexBox.getItems()[5].firePress();
							return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
								setTimeout(function() {
									assert.equal(document.activeElement, oToolBar._oSearchButton.getDomRef(), "Find button should be focussed on pressing close button");
									done();
								}, 500);
							});
						}, 500);
					});
				}, 500);
			});
		}.bind(this));
	});

	QUnit.test("Test Find and Select vertical auto scroll functionality" , function (assert) {
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		var oGantt = this.sut.getGanttCharts()[0];
		var oTable = oGantt.getTable();
		oGantt.setFindBy(["Explanation"]);
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			setTimeout(function() {
				oToolbar._oSearchButton.firePress();
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
					setTimeout(function() {
						oToolbar._searchFlexBox.getItems()[0].setValue("D");
						oToolbar._searchFlexBox.getItems()[0].fireSearch();
						setTimeout(function() {
							assert.equal(oTable.getFirstVisibleRow(), 0, "Gantt chart auto scrolled to the correct row");
							oToolbar._searchFlexBox.getItems()[3].firePress();
							return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
								setTimeout(function() {
									assert.equal(oTable.getFirstVisibleRow(), 2, "Gantt chart auto scrolled to the correct row");
									oToolbar._searchFlexBox.getItems()[1].firePress();
									return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
										setTimeout(function() {
											assert.equal(oTable.getFirstVisibleRow(), 0, "Gantt chart auto scrolled to the correct row");
											done();
										}, 500);
									});
								}, 500);
							});
						}, 500);
					}, 500);
				});
			}, 500);
		});
	});

	QUnit.test("Test findMode: Toolbar", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		var oToolBar = this.sut.getToolbar();
		oToolBar.setFindMode("Toolbar");
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.setFindBy(["Explanation"]);
			oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function(){
					assert.equal(document.activeElement, oToolBar._searchFlexBox.getItems()[0].getDomRef().getElementsByTagName("input")[0], "Search input should be focussed on clicking find button");
					assert.equal(oToolBar._searchFlexBox.getItems()[4].getVisible(), false, "Open side panel button should be hidden");
					done();
				}, 500);
			});
		});
	});

	QUnit.test("Test findMode: SidePanel", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		var oToolBar = this.sut.getToolbar();
		oToolBar.setFindMode("SidePanel");
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.setFindBy(["Explanation"]);
			oToolBar.attachGanttSidePanel(function(oEvent) {
				oEvent.getParameters().updateSidePanelState.enable();
			});
			oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function(){
					var aSidePanelItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
					assert.equal(document.activeElement, aSidePanelItems[1].getContent()[0].getDomRef().getElementsByTagName("input")[0], "Side panel search input should be focussed on clicking find button");
					assert.equal(aSidePanelItems[0].getContent()[0].getItems()[1].getVisible(), false, "Find popup button should be hidden");
					done();
				}, 500);
			});
		});
	});

	QUnit.test("Test findMode: Both", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		var oToolBar = this.sut.getToolbar();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			assert.equal(oToolBar.getFindMode(), "Both", "Default findMode should be Both");
			oGantt.setFindBy(["Explanation"]);
			oToolBar.attachGanttSidePanel(function(oEvent) {
				oEvent.getParameters().updateSidePanelState.enable();
			});
			oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function(){
					assert.equal(oToolBar._searchFlexBox.getItems()[4].getVisible(), true, "Open side panel button should be visible");
					oToolBar._searchFlexBox.getItems()[4].firePress();
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
						setTimeout(function() {
							var aSidePanelItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
							assert.equal(aSidePanelItems[0].getContent()[0].getItems()[1].getVisible(), true, "Find popup button should be visible");
							done();
						}, 500);
					});
				}, 500);
			});
		});
	});

	QUnit.test("Test find and select in lazy loading scenario", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		var oToolbar = this.sut.getToolbar();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oRowShape = oGantt.getTable().getRows()[2].getAggregation("_settings").getAggregation("shapes1")[0];
			var oBinding = oGantt.getTable().getBinding();
			var oGanttNodes = oBinding.getNodes(0,20,0);
			oGanttNodes[1].nodeState = null;
			oGantt.setFindBy(["Explanation"]);
			oToolbar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function(){
					oToolbar._searchFlexBox.getItems()[0].setValue("A");
					sinon.stub(oBinding, "getNodes").returns(oGanttNodes);
					oToolbar._searchFlexBox.getItems()[0].fireSearch();
					setTimeout(function() {
						assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/12)", "Search worked correctly");
						assert.equal(oRowShape.getSelected(), true, "Correct shape selected");
						done();
					}, 500);
				}, 500);
			});
		});
	});

	QUnit.test("Test Find and Select busy indicator" , function (assert) {
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		var oGantt = this.sut.getGanttCharts()[0];
		var oContainer = this.sut;
		oGantt.setFindBy(["Explanation"]);
		setTimeout(function() {
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("A");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
			assert.equal(oContainer.getBusy(), true, "Busy indicator should be visible");
			assert.equal(oContainer.getBusyIndicatorDelay(), 0, "Busy indicator delay should be 0");
			setTimeout(function() {
				assert.equal(oContainer.getBusy(), false, "Busy indicator should not be visible anymore");
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/13)", "Search worked correctly");
				done();
			}, oContainer.getBusyIndicatorDelay());
		}, 500);
	});

	QUnit.test("Test Find and Select property mapping" , function (assert) {
		var done = assert.async();
		var oToolbar = this.sut.getToolbar();
		var oGantt = this.sut.getGanttCharts()[0];
		var fireSearchSelectionChangedSpy = sinon.spy(this.sut, "fireSearchSelectionChanged");

		oGantt.setFindBy(["Explanation", "DrillDownState"]);
		setTimeout(function() {
			assert.ok(fireSearchSelectionChangedSpy.notCalled, "searchSelectionChanged event is not trigerred");

			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("A");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
			setTimeout(function() {
				assert.equal(FindAndSelectUtils._ganttSearchResults[0].sMatchedValue, "expanded ", "Correct result found");
				assert.equal(FindAndSelectUtils._ganttSearchResults[0].oMatchedValue.DrillDownState, "expanded", "Correct property mapped");
				assert.equal(FindAndSelectUtils._ganttSearchResults[0].oMatchedValue.Explanation, null, "Correct property mapped");
				assert.equal(FindAndSelectUtils._ganttSearchResults[1].sMatchedValue, "Concept Phase expanded ", "Correct result found");
				assert.equal(FindAndSelectUtils._ganttSearchResults[1].oMatchedValue.DrillDownState,  "expanded", "Correct property mapped");
				assert.equal(FindAndSelectUtils._ganttSearchResults[1].oMatchedValue.Explanation, "Concept Phase", "Correct property mapped");

				assert.ok(fireSearchSelectionChangedSpy.calledOnce, "searchSelectionChanged event is trigerred");

				fireSearchSelectionChangedSpy.restore();
				done();
			}, 500);
		}, 500);
	});

	QUnit.test("Filter search results", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			var oContainer = this.sut;
			var oGantt = this.sut.getGanttCharts()[0];
			oContainer.getToolbar().attachGanttSidePanel(function(oEvent) {
				oEvent.getParameters().updateSidePanelState.enable();
			});
			oContainer.attachCustomGanttSearchResult(function(oEvent) {
				var aSearchResults = oEvent.getParameters().searchResults;
				var aCustomSearchResults = [];
				aSearchResults.forEach(function(oResult){
					if (oResult.data["id"] != "1") {
						aCustomSearchResults.push(oResult);
					}
				});
				oContainer.setProperty("customSearchResults", aCustomSearchResults, true);
			});
			var aList = oGantt.findAll("A", ["Explanation"]);
			assert.equal(aList.length, 13, "Correct search results count before filtering");
			oContainer.fireCustomGanttSearchResult({
				searchResults: aList
			});
			assert.equal(oContainer.getCustomSearchResults().length, 12, "Correct search results count after filtering");
			assert.equal(oContainer.getCustomSearchResults()[1].sMatchedValue, "Design Phase ", "Correct search result");
		}.bind(this));
	});

	QUnit.test("Test Find and Select when enableAutoSelectOnFind set to false" , function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
		var oContainer = this.sut;
		var oIndicatorSub = sinon.stub(oContainer, "setBusy");
		var oToolbar = oContainer.getToolbar();
		var oGantt = oContainer.getGanttCharts()[0];
		oGantt.setFindBy(["Explanation"]);
		oContainer.setEnableAutoSelectOnFind(false);
		var oRow1Shape = oGantt.getTable().getRows()[1].getAggregation("_settings").getAggregation("shapes1")[0];
		var oRow2Shape = oGantt.getTable().getRows()[2].getAggregation("_settings").getAggregation("shapes1")[0];
		var oVisibleHorizon = oGantt.getAxisTimeStrategy().getVisibleHorizon();
		oContainer.getToolbar().attachGanttSidePanel(function(oEvent) {
			oEvent.getParameters().updateSidePanelState.enable();
		});
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("A");
			var oStartTime = oVisibleHorizon.getStartTime();
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
			setTimeout(function() {
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/13)", "Search worked correctly");
				assert.equal(oVisibleHorizon.getStartTime(), oStartTime, "Gantt chart didn't auto scroll to the start of the found shape");
				assert.strictEqual(oGantt.getSelectedShapeUid().length, 0, "Found shape did not get selected");
				oToolbar._searchFlexBox.getItems()[3].firePress();	// navigate to next search result
				assert.equal(FindAndSelectUtils._oFoundShape, oRow2Shape, "Correct shape found");
				assert.equal(oRow2Shape.getSelected(), true, "Found shape selected");
				assert.equal(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(oRow2Shape.getTime()), "Gantt chart auto scrolled to the start of the found shape");
				oGantt.setSelectedShapeUid([]);
				oGantt.getInnerGantt().attachEventOnce("ganttReady", function () {
					var aItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
					oStartTime = oVisibleHorizon.getStartTime();
					aItems[1].getContent()[0].fireSearch();
					setTimeout(function() {
						assert.equal(oVisibleHorizon.getStartTime(), oStartTime, "Gantt chart didn't auto scroll to the start of the found shape");
						assert.strictEqual(oGantt.getSelectedShapeUid().length, 0, "Found shape did not get selected");
						assert.equal(document.activeElement, aItems[2].getContent()[0].getItems()[1].getItems()[1].getDomRef(), "Side panel navigate forward button should be focussed instead of list item");
						aItems[2].getContent()[0].getItems()[1].getItems()[1].firePress();	// navigate to next search result
						assert.equal(FindAndSelectUtils._oFoundShape, oRow1Shape, "Correct shape found");
						assert.equal(oRow1Shape.getSelected(), true, "Found shape selected");
						assert.equal(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(oRow1Shape.getTime()), "Gantt chart auto scrolled to the start of the found shape");
						oIndicatorSub.restore();
						done();
					}, 500);
				});
				oToolbar._searchFlexBox.getItems()[4].firePress();
			}, 500);
		});
	}.bind(this));
	});

	QUnit.test("Validate search side panel height", function (assert) {
		var done = assert.async();
		var oGanttChartContainer = this.sut;
		var oGantt = oGanttChartContainer.getGanttCharts()[0];
		var oSidePanelDom, oGanttContentDom;
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.setFindBy(["Explanation"]);
			var oToolBar = oGanttChartContainer.getToolbar();
			oToolBar._oSearchButton.firePress();
			oGanttChartContainer.getToolbar().attachGanttSidePanel(function(oEvent) {
				oEvent.getParameters().updateSidePanelState.enable();
			});
			oToolBar._searchFlexBox.getItems()[0].setValue("A");
			oToolBar._searchFlexBox.getItems()[0].fireSearch();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function() {
					oGantt.getInnerGantt().attachEventOnce("ganttReady", function () {
						oSidePanelDom = document.getElementsByClassName("sapUiGanttSearchSidePanel")[0];
						oGanttContentDom = document.getElementsByClassName("sapGanttContainerCntWithSidePanel")[0];
						assert.strictEqual(oSidePanelDom.clientHeight, oGanttContentDom.clientHeight, "Side panel height should be same as container content height when status bar disabled");
						oGanttChartContainer.setEnableStatusBar(true);
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
							assert.strictEqual(oSidePanelDom.clientHeight, oGanttContentDom.clientHeight, "Side panel height should be same as container content height when status bar enabled");
							done();
						});
					});
					oToolBar._searchFlexBox.getItems()[4].firePress();
				}, 500);
			});
		});
	});

	QUnit.module("Find and select for multiActivity groups", {
		beforeEach: function() {
			this.sut = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					showSearchButton: true,
					content: [
						new Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [GanttQUnitUtils.createGanttWithOData(null, new MultiActivityRowSettings({
					rowId: "{data>id}",
					tasks: [
						new MultiActivityGroup({
							expandable: true,
							selectable: true,
							shapeId: "{data>id}",
							task: [
								new BaseRectangle({
									shapeId: "{data>id}",
									time: "{data>StartDate}",
									endTime: "{data>EndDate}",
									title: "{data>ObjectName}",
									fill: "#008FD3",
									selectable: true
								})
							],
							indicators: [
								new BaseRectangle({
									scheme: "subtasks",
									shapeId: "{data>id}",
									time: "{data>StartDate}",
									endTime: "{data>EndDate}",
									title: "{data>ObjectName}",
									fill: "#D30000",
									selectable: true
								})
							]
						})
					]})
				)]
			});
			this.sut.placeAt("qunit-fixture");
		},

		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("Find and select for gantt chart with multiActivity groups", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
		var oToolbar = this.sut.getToolbar();
		var oGantt = this.sut.getGanttCharts()[0];
		oGantt.addShapeScheme(new ShapeScheme({
			key: "subtasks",
			rowSpan: 1
		}));
		oGantt.setShowParentRowOnExpand(false);
		oGantt.setFindBy(["Explanation"]);
		var oRow1Shape = oGantt.getTable().getRows()[0].getAggregation("_settings").getAggregation("tasks")[0];
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("Demo");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
			setTimeout(function(){
				assert.equal(oRow1Shape.getSelected(), true, "Shape selected when row is collapsed");
				oGantt.expand("subtasks", 0);
				oToolbar._searchFlexBox.getItems()[0].setValue("");
				oToolbar._searchFlexBox.getItems()[0].fireSearch();
				assert.equal(oRow1Shape.getSelected(), false, "Shape selection removed");
				oToolbar._searchFlexBox.getItems()[0].setValue("Demo");
				oToolbar._searchFlexBox.getItems()[0].fireSearch();
				setTimeout(function(){
					assert.equal(oRow1Shape.getSelected(), true, "Shape selected when row is expanded");
					done();
				}, 500);
			}, 500);
		});
	}.bind(this));
	});

	QUnit.module("ContainerToolbar");

	QUnit.test("Test Find in Gantt button." , function (assert) {
		assert.equal(oToolbar._oSearchButton.getAriaDescribedBy()[0], oToolbar._oSearchButton.getId(), "Aria described by find button");
	});

	QUnit.test("Test content number." , function (assert) {
		assert.strictEqual(oToolbar.getContent().length, 9);
	});

	QUnit.test("Test content control." , function (assert) {
		var aContentControl = oToolbar.getContent();
		assert.strictEqual(aContentControl[0].getText(), "This is gantt toolbar--");

		var done = assert.async();
		aContentControl[1].attachPress(function(oEvent){
			assert.strictEqual(oEvent.getSource().getText(), "Test");
			done();
		});
		aContentControl[1].firePress();
	});

	QUnit.test("Test bird eye button." , function (assert) {
		var done = assert.async();
		oToolbar.attachEventOnce("birdEyeButtonPress", function(oEvent){
			assert.ok(true);
			done();
		});
		oToolbar._oBirdEyeButton.firePress();
		// assert.equal(oToolbar._oBirdEyeButton.getTooltip(), "Bird's eye (Visible rows ): Change zoom level to fit shapes on visible rows into width of current view", "Tooltip message should match");
	});

	QUnit.test("Test zoom in button." , function (assert) {
		var done = assert.async();
		oToolbar.attachEventOnce("zoomStopChange", function(oEvent){
			assert.strictEqual(oEvent.getParameter("index"), 1);
			assert.equal(oToolbar._oZoomInButton.getAriaDescribedBy()[0], oToolbar._oZoomLevelInvisibleText.getId(), "Aria described by for Zoom in button");
			done();
		});
		oToolbar._oZoomInButton.firePress();
	});

	QUnit.test("Test zoom out button." , function (assert) {
		var done = assert.async();
		oToolbar.attachEventOnce("zoomStopChange", function(oEvent){
			assert.strictEqual(oEvent.getParameter("index"), 0);
			assert.equal(oToolbar._oZoomOutButton.getAriaDescribedBy()[0], oToolbar._oZoomLevelInvisibleText.getId(), "Aria described by for Zoom out button");
			done();
		});
		oToolbar._oZoomOutButton.firePress();
	});

	QUnit.test("Test setting items." , function (assert) {
		var done = assert.async();

		oToolbar._oSettingsButton.firePress();

		setTimeout(function(){
			var oToolbar = Element.getElementById("toolbar");
			assert.ok(oToolbar._oSettingsDialog.getDomRef() !== null);

			var aReferenceKey = ["insertedItem", "firstItem", "secondItem", "addedItem", "customItem"];

			var oSettingItems = oToolbar._oSettingsBox.getItems();
			assert.equal(oSettingItems.length, 5);

			for (var i = 0; i < oSettingItems.length; i++) {
				var oCheckBox = oSettingItems[i];
				assert.equal(oCheckBox.getName(), aReferenceKey[i]);
				assert.equal(oCheckBox.isStandard, false);
			}

			oToolbar._oSettingsDialog._getDialog().close();
			done();
		}, 500);
	});

	QUnit.test("Test custom setting items." , function (assert) {
		var done = assert.async();
		oToolbar._oSettingsButton.firePress();
		setTimeout(function(){
			var oToolbar = Element.getElementById("toolbar");
			assert.ok(oToolbar._oSettingsDialog.getDomRef() !== null);
			var aReferenceKey = ["insertedItem", "firstItem", "secondItem", "addedItem", "customItem"];
			var oSettingItems = oToolbar._oSettingsBox.getItems();
			assert.equal(oSettingItems.length, 5);
			var oSettingItem = oSettingItems.filter(function(item){
				return item.getName() === aReferenceKey[4];
			})[0];
			assert.equal(oSettingItem.getName(), "customItem");
			assert.equal(oSettingItem.isStandard, false);
			oToolbar._oSettingsDialog._getDialog().close();
			done();
		}, 500);
	});

	QUnit.test("Test mSettingsConfig" , function (assert) {
		var done = assert.async();

		oToolbar._oSettingsButton.firePress();

		setTimeout(function(){
			var oToolbar = Element.getElementById("toolbar");
			assert.ok(oToolbar._oSettingsDialog.getDomRef() !== null);

			var oSettingItems = oToolbar._oSettingsBox.getItems();
			assert.equal(oSettingItems.length, 5);
			assert.equal(Object.keys(oToolbar.mSettingsConfig).length, 0);
			oSettingItems[0].setSelected(false);
			var sSettingDialogID = oToolbar._oSettingsDialog.getId();
			Element.getElementById(sSettingDialogID + "-acceptbutton").firePress();
			setTimeout(function(){
				assert.equal(Object.keys(oToolbar.mSettingsConfig).length, 5);
				assert.equal(oSettingItems[0].getSelected(), false);
				assert.equal(oToolbar.mSettingsConfig.insertedItem, false);
				oToolbar._oSettingsDialog._getDialog().close();
				done();
			},500);
		}, 500);
	});

	QUnit.test("Test showSettingButton." , async function (assert) {
		oToolbar.setShowSettingButton(false);
		await nextUIUpdate();
		assert.strictEqual(oToolbar.getShowSettingButton(), false);
		assert.strictEqual(oToolbar.getContent().length, 8);
	});

	QUnit.test("Test displayTypeButton." , function (assert) {
		var done = assert.async(),
			aButtonItems = oToolbar._oDisplayTypeSegmentedButton.getItems();

		assert.expect(4);

		assert.equal(aButtonItems[0].getKey(), GanttChartWithTableDisplayType.Both);
		assert.equal(aButtonItems[1].getKey(), GanttChartWithTableDisplayType.Chart);
		assert.equal(aButtonItems[2].getKey(), GanttChartWithTableDisplayType.Table);

		oToolbar.attachEventOnce("displayTypeChange", function(oEvent){
			assert.strictEqual(oEvent.getParameter("displayType"), GanttChartWithTableDisplayType.Chart);
			done();
		});
		oToolbar._oDisplayTypeSegmentedButton.fireSelectionChange({
			item: oToolbar._oDisplayTypeSegmentedButton.getItems()[1]
		});
	});

	QUnit.test("Toolbar content alignment", async function (assert) {
		var sButtonId = "testButton1",
			oToolbar = new ContainerToolbar({
				content: [
					new Button(sButtonId, {
						text: "Test"
					})
				]
			}),
			sSpacerId = oToolbar.oToolbarSpacer.getId(),
			sSettingButtonId = oToolbar._genSettings().getId(),
			sTimeZoomFlexId = oToolbar._genTimeZoomFlexBox().getId(),
			aIdOrder;

		assert.expect(18);

		oToolbar.placeAt("content");
		await nextUIUpdate();

		assert.notOk(oToolbar.getAlignCustomContentToRight(), "By default the custom content is aligned to left");

		aIdOrder = [sButtonId, sSpacerId, sTimeZoomFlexId, sSettingButtonId];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.setAlignCustomContentToRight(true);
		await nextUIUpdate();
		assert.ok(oToolbar.getAlignCustomContentToRight(), "The custom content is aligned to right");

		aIdOrder = [sSpacerId, sButtonId, sTimeZoomFlexId, sSettingButtonId];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.setAlignCustomContentToRight(false);
		oToolbar.insertContent(new ContainerToolbarPlaceholder({type: ContainerToolbarPlaceholderType.Spacer}), 0);
		await nextUIUpdate();
		aIdOrder = [sSpacerId, sButtonId, sTimeZoomFlexId, sSettingButtonId];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.setAlignCustomContentToRight(true);
		await nextUIUpdate();
		aIdOrder = [sSpacerId, sButtonId, sTimeZoomFlexId, sSettingButtonId];
		fnCheckOrder(assert, oToolbar, aIdOrder);
	});

	QUnit.test("Test Legend Button", function (assert) {
		assert.equal(oToolbar._oLegendButton.getTooltip(),"Show Legend","Tooltip is show legend");
		oToolbar._oLegendButton.firePress();
		assert.equal(oToolbar._oLegendButton.getTooltip(),"Hide Legend","Tooltip is hide legend");
	});

	QUnit.test("Test buttons type", function (assert) {
		assert.expect(5);

		assert.equal(oToolbar._oBirdEyeButton.getType(), ButtonType.Transparent);
		assert.equal(oToolbar._oZoomInButton.getType(), ButtonType.Transparent);
		assert.equal(oToolbar._oZoomOutButton.getType(), ButtonType.Transparent);
		assert.equal(oToolbar._oSettingsButton.getType(), ButtonType.Transparent);
		assert.equal(oToolbar._oLegendButton.getType(), ButtonType.Transparent);
	});

	QUnit.test("Test buttons placeholder", async function (assert) {
		var oToolbar = new ContainerToolbar({
				showDisplayTypeButton: true,
				showBirdEyeButton: true,
				showLegendButton: true
			}),
			oSomeButton = new Button({text: "Button"}),
			sSomeButton = oSomeButton.getId(),
			sSpacer = oToolbar.oToolbarSpacer.getId(),
			sBirdEyeButton = oToolbar._genBirdEyeButton().getId(),
			sLegendButton = oToolbar._genLegend().getId(),
			sSettingButton = oToolbar._genSettings().getId(),
			sTimeZoomFlex = oToolbar._genTimeZoomFlexBox().getId(),
			sDisplayTypeButton = oToolbar._genDisplayTypeButton().getId(),
			sLegendButtonPlaceholder = "legendButtonPlaceholder",
			sTimeZoomPlaceholder = "timeZoomPlaceholder",
			sPlaceholderId = "testingPlaceholder",
			oPlaceholder, aIdOrder;

		oToolbar.placeAt("content");
		await nextUIUpdate();

		oToolbar.insertContent(oSomeButton, 0);
		await nextUIUpdate();
		aIdOrder = [sSomeButton, sSpacer, sBirdEyeButton, sTimeZoomFlex, sLegendButton, sSettingButton, sDisplayTypeButton];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.insertContent(new ContainerToolbarPlaceholder(sLegendButtonPlaceholder, {type: ContainerToolbarPlaceholderType.LegendButton}), 0);
		await nextUIUpdate();
		aIdOrder = [sLegendButtonPlaceholder, sSomeButton, sSpacer, sBirdEyeButton, sTimeZoomFlex, sSettingButton, sDisplayTypeButton];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.addContent(new ContainerToolbarPlaceholder(sTimeZoomPlaceholder, {type: ContainerToolbarPlaceholderType.TimeZoomControl}));
		await nextUIUpdate();
		aIdOrder = [sLegendButtonPlaceholder, sSomeButton, sSpacer, sBirdEyeButton, sSettingButton, sDisplayTypeButton, sTimeZoomPlaceholder];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.setZoomControlType(ZoomControlType.Select);
		await nextUIUpdate();
		aIdOrder = [sLegendButtonPlaceholder, sSomeButton, sSpacer, sBirdEyeButton, sSettingButton, sDisplayTypeButton, sTimeZoomPlaceholder];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.insertContent(new ContainerToolbarPlaceholder({type: ContainerToolbarPlaceholderType.Spacer}), 0);
		await nextUIUpdate();
		aIdOrder = [sSpacer, sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton, sSettingButton, sDisplayTypeButton, sTimeZoomPlaceholder];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		// Only one placeholder for type is rendered
		oPlaceholder = new ContainerToolbarPlaceholder(sPlaceholderId, {type: ContainerToolbarPlaceholderType.Spacer});
		oToolbar.addContent(oPlaceholder);
		await nextUIUpdate();
		aIdOrder = [sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton, sSettingButton, sDisplayTypeButton, sTimeZoomPlaceholder, sSpacer];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		// Test change placeholder type
		oToolbar.removeContent(oPlaceholder);
		oToolbar.insertContent(oPlaceholder, 0);
		oPlaceholder.setType(ContainerToolbarPlaceholderType.DisplayTypeButton);
		await nextUIUpdate();
		aIdOrder = [sPlaceholderId, sSpacer, sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton,  sSettingButton, sTimeZoomPlaceholder];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oPlaceholder.setType(ContainerToolbarPlaceholderType.SettingButton);
		await nextUIUpdate();
		aIdOrder = [sPlaceholderId, sSpacer, sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton, sTimeZoomPlaceholder, sDisplayTypeButton];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		// Test hiding button
		oToolbar.setShowSettingButton(false);
		await nextUIUpdate();
		aIdOrder = [sSpacer, sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton, sTimeZoomPlaceholder, sDisplayTypeButton];
		fnCheckOrder(assert, oToolbar, aIdOrder);
	});

	QUnit.test("Exit destroys all available toolbar controls", async function (assert) {
		var oToolbar = new ContainerToolbar({
			showDisplayTypeButton: true,
			showBirdEyeButton: true,
			showLegendButton: true
		});
		//Arrange
		var oGanttContainer = new GanttChartContainer({
			enableVariantManagement : true,
			toolbar: oToolbar
		});
		sinon.stub(ControlVariantApplyAPI, "attachVariantApplied");
		oGanttContainer.placeAt("content");
		await nextUIUpdate();

		var oDisplayTypeSegButtonDestroy = sinon.spy(oToolbar._oDisplayTypeSegmentedButton, "destroy"),
			oBirdEyeButtonDestroy = sinon.spy(oToolbar._oBirdEyeButton, "destroy"),
			oTimeZoneFlexBoxDestroy = sinon.spy(oToolbar._oTimeZoomFlexBox, "destroy"),
			oSettingsButtonDestroy = sinon.spy(oToolbar._oSettingsButton, "destroy"),
			oLegendsButtonDestroy = sinon.spy(oToolbar._oLegendButton, "destroy"),
			oVariantManagementDestroy = sinon.spy(oToolbar._oVariantManagement, "destroy"),
			oToolbarSpacer = sinon.spy(oToolbar.oToolbarSpacer, "destroy");
		//Action
		oToolbar.exit();
		//Assert
		assert.ok(oDisplayTypeSegButtonDestroy.calledOnce);
		assert.ok(oBirdEyeButtonDestroy.calledOnce);
		assert.ok(oTimeZoneFlexBoxDestroy.calledOnce);
		assert.ok(oSettingsButtonDestroy.calledOnce);
		assert.ok(oLegendsButtonDestroy.calledOnce);
		assert.ok(oVariantManagementDestroy.calledOnce);
		assert.ok(oToolbarSpacer.calledOnce);
	});

	QUnit.test("Destroy and reinitialize", function (assert) {
		var oParentExitSpy = sinon.spy(OverflowToolbar.prototype, "exit");

		oToolbar.destroy();

		assert.ok(oParentExitSpy.called, "OverflowToolbar (parent) exit method should be called during destroy.");

		var oSecondToolbar = fnCreateContainerToolbar();

		assert.ok(typeof oSecondToolbar !== "undefined", "Reinitialization should work without errors.");

		oParentExitSpy.restore();
	});

	QUnit.module("Find and Select operation incase of multiple ganttcharts", {
		beforeEach: function() {
			this.sut = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					showSearchButton: true,
					content: [
						new Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [GanttQUnitUtils.createGanttWithOData(), GanttQUnitUtils.createGanttWithOData("table2")]
			});
			this.sut.placeAt("qunit-fixture");
			this.sut.getGanttCharts()[1].addShapeScheme(new sap.gantt.simple.ShapeScheme({
				key: "main_row_shape",
				primary: true
			}));
			this.sut.getGanttCharts()[1].getShapeSchemes()[0].setPrimary(false);
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});
	QUnit.test("findAndDeselect the shape with same ids in different Gantt charts in same container" , function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			this.sut.getGanttCharts()[1].findAndSelect("0","id");
			this.sut.getGanttCharts()[1].oSelection.attachEventOnce("selectionChanged", function (oEvent) {
				assert.ok(oEvent.mParameters.deselectedUid[0] === oEvent.mParameters.shapeUid[0], "Correct shape is deselected");
			});
			this.sut.getGanttCharts()[1].findAndDeselect("0","id");
		}.bind(this));
	});
	QUnit.test("Cursorline header lable in case of multiple gantts" , function (assert) {
		this.sut.getGanttCharts()[0].setHorizontalLazyLoadingEnabled(true);
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			this.sut.getGanttCharts()[0].getAxisTimeStrategy().setZoomLevel(6);
			var aSvgBodyNode = d3.selectAll(".sapGanttChartSvg");
			var aSvgHeaderNode = d3.selectAll(".sapGanttChartHeaderSvg"),
			ganttId = document.getElementsByClassName('sapGanttChartSvg')[0].id,
			oLocale = new Locale({
				timeZone: "CET",
				utcdiff: "010000",
				utcsign: "+"
			}),
			oSvgPoint = {
				svgHeight: 500,
				svgId: ganttId,
				x: 1000,
				y: 20
			};
			var oCursorLine = new CursorLine();
				oCursorLine.drawSvg(aSvgBodyNode, aSvgHeaderNode, oLocale, oSvgPoint);
			var text1 = document.getElementsByClassName('sapGanttCursorLineLabel')[0].textContent,
			text2 = document.getElementsByClassName('sapGanttCursorLineLabel')[1].textContent;
			assert.equal(text1, text2, "CurorLine label value is same for both charts");
		}.bind(this));
	});
	QUnit.test("Test for container scroll" , function (assert) {
		var done = assert.async();
		var oToolbar = 	this.sut.getToolbar();
		this.sut.getGanttCharts()[0].setFindBy(["Explanation"]);
		this.sut.getGanttCharts()[1].setFindBy(["Explanation"]);
		setTimeout(function() {
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[0].setValue("emo");
			oToolbar._searchFlexBox.getItems()[0].fireSearch();
			setTimeout(function() {
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/2)", "Shape highlighted in 1st ganttchart");
				var toolBar = document.getElementsByClassName("sapGanttContainerTbl") && document.getElementsByClassName("sapGanttContainerTbl")[0];
				var positionOfToolBar = toolBar && toolBar.getBoundingClientRect().top;

				oToolbar._searchFlexBox.getItems()[3].firePress();
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(2/2)", "Shape highlighted in 2nd ganttchart");
				assert.equal(toolBar && document.getElementsByClassName("sapGanttContainerTbl")[0].getBoundingClientRect().top, positionOfToolBar, "Containertoolbar should not scroll when shape's highlight shifts from 1st chart to 2nd chart");

				oToolbar._searchFlexBox.getItems()[1].firePress();
				assert.equal(oToolbar._searchFlexBox.getItems()[2].getText(), "(1/2)", "Shape highlighted again in 1st ganttchart");
				assert.equal(toolBar && document.getElementsByClassName("sapGanttContainerTbl")[0].getBoundingClientRect().top, positionOfToolBar, "Containertoolbar should not scroll when shape's highlight shifts from 2nd chart to 1st chart");
				done();
			}, 500);
		}, 500);
	});

	QUnit.test("Test manual search trigger method" , function (assert) {
		var oContainer = this.sut;
		var sSearchValue = "A", aList = [];
		var aPropertyNames = ["Explanation"];
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			oContainer.getGanttCharts().forEach(function(oGantt) {
				aList.push(oGantt.findAll(sSearchValue, aPropertyNames));
			});
			assert.equal(aList.flat().length, 26, "Correct search results count initially");
			oContainer.removeGanttChart(0);
			aList = [];
			oContainer.getGanttCharts().forEach(function(oGantt) {
				aList.push(oGantt.findAll(sSearchValue, aPropertyNames));
			});
			assert.equal(aList.flat().length, 13, "Correct search results count after layout change");
		});
	});

	QUnit.test("Test closeSearchSidePanel method", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0], oToolbar = this.sut.getToolbar();
		oToolbar.setFindMode("SidePanel");
		oToolbar.attachGanttSidePanel(function(oEVent) {
			oEVent.getParameters().updateSidePanelState.enable();
		});
		oToolbar.attachEventOnce("closeSidePanelButtonPress", function(oEvent){
			assert.ok(true, "Close side panel button press event is fired");
		});
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			oToolbar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function() {
					oGantt.getParent().closeSearchSidePanel();
					done();
				}, 500);
			});
		});
	});

	QUnit.test("Test zoom button and slider destroy method", function (assert) {

		var oToolbar = new ContainerToolbar();

		var oZoomSliderDestroy = sinon.spy(oToolbar._oZoomSlider, "destroy");
		var oZoomInButtonDestroy = sinon.spy(oToolbar._oZoomInButton, "destroy");
		var oZoomOutButtonDestroy = sinon.spy(oToolbar._oZoomOutButton, "destroy");
		//Action
		oToolbar.exit();
		//Assert
		assert.ok(oZoomSliderDestroy.calledOnce);
		assert.ok(oZoomInButtonDestroy.calledOnce);
		assert.ok(oZoomOutButtonDestroy.calledOnce);
		//restore
		oZoomSliderDestroy.restore();
		oZoomInButtonDestroy.restore();
		oZoomOutButtonDestroy.restore();
	});


	QUnit.module("visibleHorizonUpdate depending on shape time", {
		beforeEach: function() {
			var oShape = [
				new BaseRectangle({
					shapeId: "0",
					time: Format.abapTimestampToDate("20140330000000"),
					endTime: Format.abapTimestampToDate("20141130000000"),
					height: 20,
					countInBirdEye: true
				})];
			this.sut = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					showSearchButton: true,
					content: [
						new Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [GanttQUnitUtils.createSimpleGantt(oShape, "20130101000000", "20131130000000")]
			});
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("shape start is outside TH" , function (assert) {
		var done = assert.async(),
		oGantt = this.sut.getGanttCharts()[0],
		oConatinerToolbar  = this.sut.getToolbar();
		GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oShape = oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			oShape.setTime(Format.abapTimestampToDate("20120101000000"));
			oShape.setEndTime(Format.abapTimestampToDate("20130330000000"));
			var nVisibleWidth = oGantt.getVisibleWidth();
			var timeRangePerPixel = (oShape.getEndTime().getTime() - oShape.getTime().getTime()) / nVisibleWidth;
			oGantt.attachEventOnce("visibleHorizonUpdate", function(oEvent){
				var oVisibleHorizon = oGantt.getAxisTimeStrategy().getVisibleHorizon();
				var oTotalHorizon = oGantt.getAxisTimeStrategy().getTotalHorizon();
				assert.equal(oVisibleHorizon.getStartTime(),oTotalHorizon.getStartTime(), "start time is correct");
				assert.equal(oVisibleHorizon.getEndTime(),Format.dateToAbapTimestamp(new Date(oShape.getEndTime().getTime() + timeRangePerPixel * 5)),"end time is correct");
				done();
			});
			oConatinerToolbar._oBirdEyeButton.firePress();
		});
	});

	QUnit.test("shape end is outside TH" , function (assert) {
		var done = assert.async(),
		oGantt = this.sut.getGanttCharts()[0],
		oConatinerToolbar  = this.sut.getToolbar();
		GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var oShape = oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			oShape.setTime(Format.abapTimestampToDate("20130303000000"));
			oShape.setEndTime(Format.abapTimestampToDate("20141130000000"));
			var nVisibleWidth = oGantt.getVisibleWidth();
			var timeRangePerPixel = (oShape.getEndTime().getTime() - oShape.getTime().getTime()) / nVisibleWidth;
			oGantt.attachEventOnce("visibleHorizonUpdate", function(oEvent){
				var oVisibleHorizon = oGantt.getAxisTimeStrategy().getVisibleHorizon();
				var oTotalHorizon = oGantt.getAxisTimeStrategy().getTotalHorizon();
				assert.equal(oVisibleHorizon.getStartTime(),Format.dateToAbapTimestamp(new Date(oShape.getTime().getTime() - timeRangePerPixel * 5)), "start time is correct");
				assert.equal(oVisibleHorizon.getEndTime(),oTotalHorizon.getEndTime(),"end time is correct");
				done();
			});
			oConatinerToolbar._oBirdEyeButton.firePress();
		});
	});
});

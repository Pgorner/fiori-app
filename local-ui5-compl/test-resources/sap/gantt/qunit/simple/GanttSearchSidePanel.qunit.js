/*global QUnit, sinon*/

sap.ui.define([
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/ContainerToolbar",
	"sap/tnt/NavigationListItem",
	"sap/tnt/NavigationList",
	"sap/ui/core/Lib"
], function (
	GanttChartContainer,
	GanttQUnitUtils,
	ContainerToolbar, NavigationListItem, NavigationList, Lib
) {
	"use strict";

	QUnit.module("Gantt Search side panel", {
		beforeEach: function() {
            this.sut = new GanttChartContainer({
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
                ganttCharts: [GanttQUnitUtils.createGanttWithOData()]
            });
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("Check side panel rendered", function (assert) {
		var done = assert.async();
		assert.ok(this.sut.getGanttCharts()[0].oSelection.getSelectedShapeIDS().length === 0, "Default selected shape objectIds are empty.");
		assert.ok(this.sut.getGanttCharts()[0].oSelection.getDeSelectedShapeIDS().length === 0, "Default deselection model is empty.");
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
            var oGantt = this.sut.getGanttCharts()[0],
				oContainer = oGantt.getParent();
            oGantt.getParent().getToolbar()._oSearchButton.firePress();
				oGantt.getTable().getBinding().getModel().oData["ProjectElmSet('50')"]["50"] = "orderDetail";
				oGantt.getTable().getRowSettingsTemplate().getAggregation("shapes1")[0].mBindingInfos["shapeId"].parts[0].path = "50";
				oGantt.findAndSelect("TTO", "Obj");
				assert.ok(oGantt.oSelection.getSelectedShapeIDS().length > 0, "Selection model should have all selected objectId");
                assert.ok(oGantt.oSelection.getSelectedShapeIDS().indexOf("50") > -1, "Correct shape is pushed to search result list when searched with single property");
				oGantt.findAndSelect("TTO");
				assert.ok(oGantt.oSelection.getSelectedShapeIDS().indexOf("50") > -1, "Correct shape is pushed to search result list when searched with no property specified");

				oGantt.findAndSelect("TTO", ["Obj"]);
				assert.ok(oGantt.oSelection.getSelectedShapeIDS().indexOf("50") > -1, "Correct shape is pushed to search result list when searched with array of properties");
				oContainer.getToolbar().attachGanttSidePanel(function(oEVent) {
                    oEVent.getParameters().updateSidePanelState.enable();
                });
                oContainer.getToolbar()._searchFlexBox.getItems()[5].firePress();
                assert.ok(oContainer.getShowSearchSidePanel() === false, "No side panel exists");
                assert.ok(oContainer.getSearchSidePanel() === null, "Gantt search side panel not rendered");
				oContainer.getToolbar()._searchFlexBox.getItems()[4].firePress();
                return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
                    assert.ok(oContainer.getShowSearchSidePanel() === true, "Side panel exists");
                    assert.ok(oContainer.getSearchSidePanel().isA("sap.gantt.simple.GanttSearchSidePanel") === true, "Type of side is Gantt search side panel");
					setTimeout(function(){
						assert.strictEqual(oContainer.getSearchSidePanel()._oSearchSidePanel.getParent(), oContainer.getSearchSidePanel(), "_oSearchSidePanel should be a child of search side panel");
						assert.ok(oContainer.getSearchSidePanel()._oSearchSidePanel.getItems()[1].getContent()[0].getValue() === "", "Search value is empty");
						assert.ok(oContainer.getSearchSidePanel()._oSearchSidePanel.getItems()[3].getContent()[0].getItems()[0].getText() === 'Enter text in the "Find" field to see results.');
						done();
					}, 500);
                });
		}.bind(this));
	});

	QUnit.test("List should populate", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then( function () {
            var oGantt = this.sut.getGanttCharts()[0];

			var oRb = Lib.getResourceBundleFor("sap.gantt");
			oGantt.setFindBy(["Explanation"]);
            oGantt.getParent().getToolbar()._oSearchButton.firePress();
                oGantt.getParent().getToolbar().attachGanttSidePanel(function(oEVent) {
                    oEVent.getParameters().updateSidePanelState.enable();
                });
                oGantt.getParent().getToolbar()._searchFlexBox.getItems()[4].firePress();
                return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
						var aItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
						aItems[1].getContent()[0].setValue("A");
						aItems[1].getContent()[0].fireSearch();
						setTimeout(function() {
							assert.ok(aItems[3].getContent()[0].getItems().length > 0);
							aItems[1].getContent()[0].setValue("");
							aItems[1].getContent()[0].fireSearch();
							setTimeout(function() {
								assert.equal(aItems[2].getContent()[0].getItems()[1].getItems()[0].getEnabled(), false, "Up Navigation button is disabled");
								assert.equal(aItems[2].getContent()[0].getItems()[1].getItems()[1].getEnabled(), false, "Down Navigation button is disabled");
								assert.equal(aItems[2].getContent()[0].getItems()[0].getText(), oRb.getText("GNT_EMPTY_RESULT_INFO_SIDE_PANEL"), "0 search results");
								assert.equal(aItems[3].getContent()[0].getItems()[0].getText(), oRb.getText("GNT_EMPTY_LIST_FIELD_INFO"), "Empty search message");

								aItems[1].getContent()[0].setValue("ABCD");
								aItems[1].getContent()[0].fireSearch();
								setTimeout(function() {
									assert.equal(aItems[2].getContent()[0].getItems()[1].getItems()[0].getEnabled(), false, "Up Navigation button is disabled");
									assert.equal(aItems[2].getContent()[0].getItems()[1].getItems()[1].getEnabled(), false, "Down Navigation button is disabled");
									assert.equal(aItems[2].getContent()[0].getItems()[0].getText(), oRb.getText("GNT_EMPTY_RESULT_INFO_SIDE_PANEL"), "0 search results");
									assert.equal(aItems[3].getContent()[0].getItems()[0].getText(), oRb.getText("GNT_EMPTY_LIST_INFO"), "No results found message");
									done();
								}, 500);
							}, 500);
						}, 500);
            });
		}.bind(this));
	});

	QUnit.test("Should not open the side panel", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
            var oGantt = this.sut.getGanttCharts()[0];
            oGantt.getParent().getToolbar()._oSearchButton.firePress();
                oGantt.getParent().getToolbar().attachGanttSidePanel(function(oEVent) {
                    oEVent.getParameters().updateSidePanelState.disable();
                });
                oGantt.getParent().getToolbar()._searchFlexBox.getItems()[5].firePress();
					assert.ok(oGantt.getParent().getShowSearchSidePanel() === false, "Side panel should not open");
					done();
		}.bind(this));
	});

	QUnit.test("Should close the side panel", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
            var oGantt = this.sut.getGanttCharts()[0];

            oGantt.getParent().getToolbar()._oSearchButton.firePress();
                oGantt.getParent().getToolbar().attachGanttSidePanel(function(oEVent) {
                    oEVent.getParameters().updateSidePanelState.enable();
                });
                oGantt.getParent().getToolbar()._searchFlexBox.getItems()[5].firePress();
					assert.ok(oGantt.getParent().getSearchSidePanel() === null, "Side Panel is closed");
					done();
		}.bind(this));
	});

	QUnit.test("Focus handling", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
            var oGantt = this.sut.getGanttCharts()[0];
			oGantt.setFindBy(["Explanation"]);
			var oToolBar = oGantt.getParent().getToolbar();
            oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
					oGantt.getParent().getToolbar().attachGanttSidePanel(function(oEVent) {
						oEVent.getParameters().updateSidePanelState.enable();
					});
					oToolBar._searchFlexBox.getItems()[0].setValue("A");
					oToolBar._searchFlexBox.getItems()[0].fireSearch();
					setTimeout(function() {
						oToolBar._searchFlexBox.getItems()[4].firePress();
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
							setTimeout(function() {
								var aSidePanelItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
								assert.equal(document.activeElement, aSidePanelItems[3].getContent()[0].getSelectedItem().getDomRef().children[0].children[0], "List item should be focussed");
								aSidePanelItems[2].getContent()[0].getItems()[1].getItems()[1].firePress();
								assert.equal(document.activeElement, aSidePanelItems[3].getContent()[0].getSelectedItem().getDomRef().children[0].children[0], "List item should be focussed");
								oToolBar._oSearchButton.firePress();
								assert.equal(document.activeElement, aSidePanelItems[1].getContent()[0].getDomRef().children[0].children[1], "Side panel search input should be focussed on clicking find button");
								aSidePanelItems[0].getContent()[0].getItems()[1].firePress();
								return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
									setTimeout(function() {
										assert.equal(document.activeElement, oToolBar._searchFlexBox.getItems()[3].getDomRef(), "Toolbar navigate forward button should be focussed on clicking find popup button");
										done();
									}, 500);
								});
							}, 500);
						});
					}, 500);
			});
		}.bind(this));
	});

	QUnit.test("Custom text on side panel list", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			var oGantt = this.sut.getGanttCharts()[0];
			oGantt.setFindBy(["Explanation"]);
			var oToolBar = oGantt.getParent().getToolbar();
			oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
					oGantt.getParent().getToolbar().attachGanttSidePanel(function(oEvent) {
						oEvent.getParameters().updateSidePanelState.enable();
					});
					oGantt.getParent().attachGanttSearchSidePanelList(function(oEvent) {
						var aSearchResults = oEvent.getParameters().searchResults;
						var aSearchResultsListItems = aSearchResults.map(function (oResult, index) {
							var listItem = new NavigationListItem({
								text: oResult.data["Explanation"] + ", Type: " + oResult.data["type"],
								id: "listItem" + index
							});
							return listItem;
						});
						var aSearchResultsList = new NavigationList({
							items: [aSearchResultsListItems]
						});
						oGantt.getParent().setSearchSidePanelList(aSearchResultsList);
					});
					oToolBar._searchFlexBox.getItems()[0].setValue("A");
					oToolBar._searchFlexBox.getItems()[0].fireSearch();
					setTimeout(function() {
						oToolBar._searchFlexBox.getItems()[4].firePress();
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
							setTimeout(function() {
								var aSidePanelItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
								assert.equal(aSidePanelItems[3].getContent()[0].getItems()[0].getText(), "Concept Phase, Type: TYPE_01", "List item should have custom text");
								assert.equal(aSidePanelItems[3].getContent()[0].getItems()[1].getText(), "Design Phase, Type: TYPE_01", "List item should have custom text");
								aSidePanelItems[1].getContent()[0].setValue("task");
								aSidePanelItems[1].getContent()[0].fireSearch();
								setTimeout(function() {
									assert.equal(aSidePanelItems[3].getContent()[0].getItems()[0].getText(), "task 1 , Type: TYPE_01", "List item should have custom text");
									assert.equal(aSidePanelItems[3].getContent()[0].getItems()[1].getText(), "task 2 , Type: TYPE_01", "List item should have custom text");
									done();
								}, 500);
							}, 500);
						});
					}, 500);
			});
		}.bind(this));
	});

	QUnit.test("Test side panel when navigating back to gantt", function (assert) {
		var done = assert.async();
		var oContainer = this.sut;
		var oGantt = oContainer.getGanttCharts()[0];
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.setFindBy(["Explanation"]);
			var oToolBar = oContainer.getToolbar();
			oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
					oContainer.getToolbar().attachGanttSidePanel(function(oEvent) {
						oEvent.getParameters().updateSidePanelState.enable();
					});
					oContainer.attachGanttSearchSidePanelList(function(oEvent) {
						var aSearchResults = oEvent.getParameters().searchResults;
						var aSearchResultsListItems = aSearchResults.map(function (oResult, index) {
							var listItem = new NavigationListItem({
								text: oResult.data["Explanation"] + ", Type: " + oResult.data["type"],
								id: "listItem" + index
							});
							return listItem;
						});
						var aSearchResultsList = new NavigationList({
							items: [aSearchResultsListItems]
						});
						oContainer.setSearchSidePanelList(aSearchResultsList);
					});
					oToolBar._searchFlexBox.getItems()[0].setValue("A");
					oToolBar._searchFlexBox.getItems()[0].fireSearch();
					oToolBar._searchFlexBox.getItems()[4].firePress();
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
							oContainer.setVisible(false);
							setTimeout(function() {
								oContainer.setVisible(true);
								setTimeout(function() {
									var aSidePanelItems = oContainer.getSearchSidePanel()._oSearchSidePanel.getItems();
									var oContainerCntDom = document.getElementById(oContainer.getId() + "-ganttContainerContent");
									assert.equal(oContainer.getDomRef().classList.contains("sapGanttContainerWithSidePanel"), true, "Gantt container should have correct class");
									assert.equal(oContainerCntDom.classList.contains("sapGanttContainerCntWithSidePanel"), true, "Gantt container content should have correct class");
									assert.equal(aSidePanelItems[3].getContent()[0].getItems()[0].getText(), "Concept Phase, Type: TYPE_01", "List item should have custom text");
									assert.equal(aSidePanelItems[3].getContent()[0].getItems()[1].getText(), "Design Phase, Type: TYPE_01", "List item should have custom text");
									done();
								}, 500);
							}, 500);
					});
			});
		});
	});

	QUnit.test("Open side panel when status bar is enabled", function (assert) {
		var done = assert.async();
		this.sut.setEnableStatusBar(true);
		this.sut.setStatusMessage("Status bar message");
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			var oGanttChartContainer = this.sut;
			var oGantt = this.sut.getGanttCharts()[0];
			oGantt.setFindBy(["Explanation"]);
			var oToolBar = oGantt.getParent().getToolbar();
			oToolBar._oSearchButton.firePress();
			oGantt.getParent().getToolbar().attachGanttSidePanel(function(oEvent) {
				oEvent.getParameters().updateSidePanelState.enable();
			});
			oToolBar._searchFlexBox.getItems()[0].setValue("A");
			oToolBar._searchFlexBox.getItems()[0].fireSearch();
			oToolBar._searchFlexBox.getItems()[4].firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function() {
					var oContainerDomChildren = oGanttChartContainer.getDomRef().children;
					assert.equal(oContainerDomChildren[2].children[0], oGanttChartContainer.getSearchSidePanel().getDomRef(), "Side panel should come before status bar");
					assert.equal(oContainerDomChildren[3].children[0], oGanttChartContainer.getStatusBar().getDomRef(), "Status bar should come after side panel");
					assert.equal(oGanttChartContainer.getDomRef().offsetWidth, oGanttChartContainer.getStatusBar().getDomRef().offsetWidth, "Status bar width should be same as gantt container");
					done();
				}, 500);
			});
		}.bind(this));
	});

	QUnit.test("Test Find and Select container toolbar events" , function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			var oGantt = this.sut.getGanttCharts()[0];
			var oToolbar = oGantt.getParent().getToolbar();
			oToolbar.attachEventOnce("findButtonPress", function(oEvent){
				assert.ok(true, "Find button press event is fired");
			});
			oGantt.getParent().getToolbar().attachGanttSidePanel(function(oEvent) {
				oEvent.getParameters().updateSidePanelState.enable();
				assert.ok(true, "Open side panel button press event is fired");
			});
			oToolbar.attachEventOnce("findPopupButtonPress", function(oEvent){
				assert.ok(true, "Find popup button press event is fired");
			});
			oToolbar.attachEventOnce("closeSidePanelButtonPress", function(oEvent){
				assert.ok(true, "Close side panel button press event is fired");
			});
			oToolbar.attachEventOnce("closeFindButtonPress", function(oEvent){
				assert.ok(true, "Close find button press event is fired");
			});
			oToolbar._oSearchButton.firePress();
			oToolbar._searchFlexBox.getItems()[4].firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
				setTimeout(function() {
					var aSidePanelItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
					aSidePanelItems[0].getContent()[0].getItems()[1].firePress();
					oToolbar._searchFlexBox.getItems()[4].firePress();
					return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
						setTimeout(function() {
							var aSidePanelItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
							aSidePanelItems[0].getContent()[0].getItems()[2].firePress();
							oToolbar._searchFlexBox.getItems()[5].firePress();
							done();
						}, 500);
					});
				}, 500);
			});
		}.bind(this));
	});

	QUnit.test("Find and select when row is collapsed", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.sut.getGanttCharts()[0]).then(function () {
			var oGantt = this.sut.getGanttCharts()[0];
			oGantt.setFindBy(["Explanation"]);
			oGantt.getParent().getToolbar()._oSearchButton.firePress();
				oGantt.getParent().getToolbar().attachGanttSidePanel(function(oEVent) {
					oEVent.getParameters().updateSidePanelState.enable();
				});
				oGantt.getParent().getToolbar()._searchFlexBox.getItems()[4].firePress();
				var oRowBinding = oGantt.getTable().getBinding("rows");
				oRowBinding.collapse(0);
				return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
						var oSearchSidePanel = oGantt.getParent().getSearchSidePanel();
						var aItems = oSearchSidePanel._oSearchSidePanel.getItems();
						var fnSetEmptyListInfo = sinon.spy(oGantt.getParent().getSearchSidePanel(), "setEmptyListInfo");
						aItems[1].getContent()[0].setValue("RE");
						aItems[1].getContent()[0].fireSearch();
						setTimeout(function() {
							assert.equal(oSearchSidePanel.aSidePanelSearchResults.length, aItems[3].getContent()[0].getItems().length, "List should have correct number of search results");
							assert.equal(fnSetEmptyListInfo.callCount, 0, "Empty list info should not be set");
							done();
						}, 500);
				});
		}.bind(this));
	});

	QUnit.module("Gantt search side panel - Multiple gantt charts", {
		beforeEach: function() {
			this.sut = new GanttChartContainer({
				toolbar: new ContainerToolbar({
					findMode: "SidePanel",
					showSearchButton: true,
					content: [
						new sap.m.Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
				ganttCharts: [GanttQUnitUtils.createGanttWithOData(), GanttQUnitUtils.createGanttWithOData("table2")]
			});
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("Test search side panel when gantt is in fullScreen mode", function (assert) {
		var done = assert.async();
		var oGantt = this.sut.getGanttCharts()[0];
		var oGantt2 = this.sut.getGanttCharts()[1];
		var oToolBar = this.sut.getToolbar();
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.setFindBy(["Explanation"]);
			oToolBar.attachGanttSidePanel(function(oEvent) {
				oEvent.getParameters().updateSidePanelState.enable();
			});
			oToolBar._oSearchButton.firePress();
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
					var aSidePanelItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
					aSidePanelItems[1].getContent()[0].setValue("Concept");
					aSidePanelItems[1].getContent()[0].fireSearch();
					setTimeout(function() {
						assert.equal(aSidePanelItems[3].getContent()[0].getItems().length, 2, "One search result from each gantt");
						assert.equal(aSidePanelItems[3].getContent()[0].getItems()[0].getText(), "Gantt 1, Concept Phase ", "Correct search result");
						assert.equal(aSidePanelItems[3].getContent()[0].getItems()[1].getText(), "Gantt 2, Concept Phase", "Correct search result");
						aSidePanelItems[0].getContent()[0].getItems()[2].firePress();
						return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function() {
								oGantt2.toggleFullScreen();
								setTimeout(function() {
									oToolBar._oSearchButton.firePress();
									return GanttQUnitUtils.waitForGanttRendered(oGantt2).then(function() {
										setTimeout(function(){
											aSidePanelItems = oGantt2.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
											assert.equal(aSidePanelItems[3].getContent()[0].getItems().length, 1, "Only one search result from full screen gantt");
											assert.equal(aSidePanelItems[3].getContent()[0].getItems()[0].getText(), "Gantt 1, Concept Phase", "Correct search result");
											oGantt2.toggleFullScreen();
											setTimeout(function() {
												aSidePanelItems = oGantt.getParent().getSearchSidePanel()._oSearchSidePanel.getItems();
												assert.equal(aSidePanelItems[3].getContent()[0].getItems().length, 2, "One search result from each gantt");
												assert.equal(aSidePanelItems[3].getContent()[0].getItems()[0].getText(), "Gantt 1, Concept Phase ", "Correct search result");
												assert.equal(aSidePanelItems[3].getContent()[0].getItems()[1].getText(), "Gantt 2, Concept Phase", "Correct search result");
												done();
											}, 500);
										}, 500);
									});
								}, 500);
						});
					}, 500);
			});
		});
	});
});
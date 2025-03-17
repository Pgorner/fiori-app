sap.ui.define([
	"sap/m/App",
	"sap/m/Button",
	"sap/m/ColumnListItem",
	"sap/m/ComboBox",
	"sap/m/Label",
	"sap/m/ListType",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/OverflowToolbar",
	"sap/m/Page",
	"sap/m/Select",
	"sap/m/Table",
	"sap/m/Text",
	"sap/m/ToggleButton",
	"sap/m/Toolbar",
	"sap/m/ToolbarSpacer",
	"sap/m/VBox",
	"sap/suite/ui/commons/ChartContainer",
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/suite/ui/commons/ChartContainerToolbarPlaceholder",
	"sap/ui/core/Icon",
	"sap/ui/core/Item",
	"sap/ui/layout/Splitter",
	"sap/ui/layout/SplitterLayoutData",
	"sap/ui/layout/VerticalLayout",
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/controls/common/feeds/AnalysisObject",
	"sap/viz/ui5/data/FlattenedDataset",
	"./ChartContainerConstants",
	"./ChartContainerHelpers",
	"./ChartContainerData",
	"./ChartContainerAnalyticMap",
], function(App, Button, ColumnListItem, ComboBox, Label, ListType, MessageBox, MessageToast,
	OverflowToolbar, Page, Select, Table, Text, ToggleButton, Toolbar, ToolbarSpacer, VBox,
	ChartContainer, ChartContainerContent, ChartContainerToolbarPlaceholder, Icon, Item, Splitter,
	SplitterLayoutData, VerticalLayout, VizFrame, AnalysisObject, FlattenedDataset, oChartContainerConstants,
	oChartContainerHelpers, oChartContainerData, oChartContainerAnalyticMap
	) {
	"use strict";

	var oChartContainerMain = {
		/* ============================================================ */
		/* Initialization                                               */
		/* ============================================================ */
		/**
		 * Initializes the page.
		 *
		 * @public
		 */
		init : function() {
			var oChartContainer = new ChartContainer({
				customIcons : this._createChartContainerIcons(oChartContainerConstants.chartContainer.icons),
				content : this._createChartContainerContent(),
				toolbar : new OverflowToolbar({ // To use custom toolbar instead of embedded toolbar
					content : [
						new ToolbarSpacer(), // optional
						new ToggleButton({
							text : "Wrap Selection Details Labels",
							type : "Transparent",
							press: function () {
								oChartContainer.setWrapLabels(this.getPressed());
							}
						}),
						/*new ToolbarSpacer(),
						new Button({
							text : "CustomAction",
							type : "Transparent"
						}),*/
						new ChartContainerToolbarPlaceholder()
					]
				})
			});
			oChartContainer.setShowFullScreen(true);
			oChartContainer.setShowPersonalization(true);
			oChartContainer.setAutoAdjustHeight(true);
	
			oChartContainer.setShowSelectionDetails(true);
			var oSelectionDetails = oChartContainer.getContent()[0].getSelectionDetails();
			if (oSelectionDetails) {
				oSelectionDetails.attachBeforeOpen(this._onSelectionDetailsBeforeOpen.bind(this));
				oSelectionDetails.attachNavigate(this._onSelectionDetailsNavigate.bind(this));
				oSelectionDetails.attachActionPress(this._onSelectionDetailsActionPress.bind(this));
			}
	
			oChartContainer.attachPersonalizationPress(this._onItemPress.bind(this, oChartContainerConstants.chartContainer.personalizationPressMessage, null));
			oChartContainer.attachContentChange(this._onItemPress.bind(this, oChartContainerConstants.chartContainer.contentChangeMessage, "selectedItemId"));
	
			var oDimensionSelectors = oChartContainerConstants.chartContainer.dimensionSelectors;
			this._addChartContainerSelects(oChartContainer, oDimensionSelectors.selects);
			this._addChartContainerComboBoxes(oChartContainer, oDimensionSelectors.comboBoxes);
	
			var oApp = new App();
			var oPage = this._createPage(oChartContainer);
			oApp.addPage(oPage);
			oApp.placeAt("content");
		},
		/* ============================================================ */
		/* Event Handling                                               */
		/* ============================================================ */
		/**
		 * Item press event handler.
		 *
		 * Calls MessageToas show method to display a message.
		 *
		 * @private
		 * @param {String} message Message to display
		 * @param {String} [paramName] Name of the parameter to get from the event
		 * @param {sap.ui.base.Event} oEvent The fired event
		 */
		_onItemPress : function (message, paramName, oEvent) {
			var oMessage = paramName ? message + oEvent.getParameter(paramName) : message;
			MessageToast.show(oMessage);
		},
		/**
		 * Selection changed event handler.
		 *
		 * Alerts the passed message.
		 *
		 * @private
		 * @param {String} message Message to display
		 */
		_onSelectionChanged : function(message) {
			MessageBox.show(message);
		},
	
		/**
		 * SelectionDetails beforeOpen event handler.
		 *
		 * Adds some actions before the popover opens.
		 *
		 * @private
		 * @param {sap.ui.base.Event} oEvent The SAPUI5 event object.
		 */
		_onSelectionDetailsBeforeOpen: function(oEvent) {
			oEvent.getSource().removeAllActions();
			oEvent.getSource().removeAllActionGroups();
	
			//Add actions on Item level
			var aItems = oEvent.getSource().getItems();
			for (var i = 0; i < aItems.length; i++) {
				aItems[i].setEnableNav(true);
				aItems[i].addAction(new Item({
					key: i,
					text: "Item Action " + i
				}));
			}
	
			//Add actions on Group Action level
			var oActionGroup1 = new Item({
				key: "1",
				text: "Action Group 1"
			});
			var oActionGroup2 = new Item({
				key: "2",
				text: "Action Group 2"
			});
			oEvent.getSource().addActionGroup(oActionGroup1);
			oEvent.getSource().addActionGroup(oActionGroup2);
	
			//Add actions on Popover level
			var oAction1 = new Item({
				key: "action1",
				text: "Action 1"
			});
			var oAction2 = new Item({
				key: "close",
				text: "Close"
			});
			oEvent.getSource().addAction(oAction1);
			oEvent.getSource().addAction(oAction2);
		},
	
		/**
		 * SelectionDetails navigate event handler.
		 *
		 * Navigates to the next page.
		 *
		 * @private
		 * @param {sap.ui.base.Event} oEvent The SAPUI5 event object.
		 */
		_onSelectionDetailsNavigate: function(oEvent) {
			if (oEvent.getParameter("direction") === "back") {
				return;
			}
			MessageToast.show("Event 'navigate' triggered");
			var oSelectionDetails = oEvent.getSource();
			var oText = new Text({
				text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." +
						"At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua." +
						"At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
			});
			var oButton = new Button({
				text: "Go to next Page",
				press: function() {
					oSelectionDetails.navTo("Second level of navigation",
						new Label({
							text: "Some more text"
						})
					);
				}
			});
			var oVBox = new VerticalLayout({content: [oText, oButton]});
			oSelectionDetails.navTo("First level of navigation", oVBox);
		},
	
		/**
		 * SelectionDetails actionPress event handler.
		 *
		 * Handles action press.
		 *
		 * @private
		 * @param {sap.ui.base.Event} oEvent The SAPUI5 event object.
		 */
		_onSelectionDetailsActionPress: function(oEvent) {
			switch (oEvent.getParameter("level")) {
				case "Item":
					MessageToast.show("Item " + oEvent.getParameter("action").getKey());
					break;
				case "List":
					MessageToast.show("List " + oEvent.getParameter("action").getKey());
					switch (oEvent.getParameter("action").getKey()) {
						case "action1":
							//Do something
							break;
						case "close":
							oEvent.getSource().close();
							break;
						default:
					}
					break;
				case "Group":
					MessageToast.show("Group " + oEvent.getParameter("action").getKey());
					break;
				default:
			}
		},
		/* ============================================================ */
		/* Helper Methods                                               */
		/* ============================================================ */
		/**
		 * Creates a page for the test suite.
		 *
		 * @returns {sap.m.Page} The new created page
		 * @private
		 * @param {sap.suite.ui.commons.ChartContainer} chartContainer ChartContainer
		 */
		_createPage : function(chartContainer) {
			var oVBox = new VBox({
				layoutData : new SplitterLayoutData({
					resizable : false,
					size : "200px"
				}),
				items : [new Text({
					text : oChartContainerConstants.chartContainer.verticalBox.text
				})]
			});
	
			var oSplitter = new Splitter({
				width : "100%",
				height : "100%",
				contentAreas : [oVBox, chartContainer]
			});
	
			var oText = oChartContainerConstants.chartContainer.visibilityButton.text;
			var oVisibilityButton = new Button({
				text : oText.main,
				press : function () {
					var i;
					if (this.getText() === oText.main) {
						chartContainer.getSelectedContent().setVisible(false);
						var oContent = chartContainer.getContent();
						for (i = 0; i < oContent.length; i++) {
							if (oContent[i].getVisible()) {
								chartContainer.switchChart(oContent[i]);
								break;
							}
						}
						chartContainer.updateChartContainer();
						this.setText(oText.reset);
					} else {
						var oChartContainerContent = chartContainer.getContent();
						for (i = 0; i < oChartContainerContent.length; i++) {
							oChartContainerContent[i].setVisible(true);
						}
						chartContainer.updateChartContainer();
						this.setText(oText.main);
					}
				}
			});
	
			var oPageToolbar =  new Toolbar({
				content : oVisibilityButton
			});
	
			return new Page({
				title : oChartContainerConstants.chartContainer.page.title,
				enableScrolling : false,
				content : oSplitter,
				subHeader : oPageToolbar
			});
		},
		/**
		 * Creates Chart Container content.
		 * @returns {sap.suite.ui.commons.ChartContainer[]} Array of content
		 * @private
		 */
		_createChartContainerContent : function() {
			var aParams = this._createChartContainerParams();
			var aContents = [];
	
			for (var i = 0; i < aParams.length; i++) {
				aContents.push(new ChartContainerContent(aParams[i]));
			}
	
			return aContents;
		},
		/**
		 * Creates Chart Container parameters used for the content.
		 *
		 * @private
		 * @returns {Object[]} Chart Container parameters
		 */
		_createChartContainerParams : function() {
			// add analysis object to the first viz frame's feed items
			var oAnalysisObject = new AnalysisObject(oChartContainerConstants.vizFrames.bar.analysisObject);
			oChartContainerConstants.vizFrames.bar.feedItems[1].values.push(oAnalysisObject);
	
			var oVizFrameBar = this._createVizFrame(oChartContainerConstants.vizFrames.bar, oChartContainerData.vizFrame);
			var oVizFrameLine = oVizFrameBar.clone(); //copy data from bar chart to line chart
			oVizFrameLine.setVizType("line");
			var oVizFrameBubble = this._createVizFrame(oChartContainerConstants.vizFrames.bubble, oChartContainerData.vizFrame3);
			var oVizFrameColumn = oVizFrameBar.clone(); //copies data from bar chart to column chart
			oVizFrameColumn.setVizType("column");
			var oVizFrameStackedBar = this._createVizFrame(oChartContainerConstants.vizFrames.stackedBar, oChartContainerData.vizFrame5);
			var oVizFrameStackedColumn = oVizFrameStackedBar.clone(); //clones data from stacked bar to stacked column chart
			oVizFrameStackedColumn.setVizType("stacked_column");
			var oVizFrameBullet = this._createVizFrame(oChartContainerConstants.vizFrames.bullet, oChartContainerData.vizFrame8);
			var oVizFrameCombination = oVizFrameBullet.clone(); //clones data from bullet chart to combination chart
			oVizFrameCombination.setVizType("combination");
			var oTable = this._createTable(oVizFrameBubble.getModel());
	
			return [{
				icon : "sap-icon://horizontal-bar-chart",
				title : "vizFrame Bar Chart Sample",
				content: oVizFrameBar
			}, {
				icon : "sap-icon://line-chart",
				title : "vizFrame Line Chart Sample",
				content: oVizFrameLine
			}, {
				icon : "sap-icon://bubble-chart",
				title : "vizFrame Bubble Chart Sample",
				content: oVizFrameBubble
			}, {
				icon : "sap-icon://vertical-bar-chart",
				title : "vizFrame Column Chart Sample",
				content: oVizFrameColumn
			}, {
				icon : "sap-icon://horizontal-stacked-chart",
				title : "vizFrame Stacked Bar Chart Sample",
				content: oVizFrameStackedBar
			}, {
				icon : "sap-icon://vertical-stacked-chart",
				title : "vizFrame Stacked Column Chart Sample",
				content: oVizFrameStackedColumn
			}, {
				icon : "sap-icon://business-objects-experience",
				title : "vizFrame Combination Chart Sample",
				content: oVizFrameCombination
			}, {
				icon : "sap-icon://horizontal-bar-chart-2",
				title : "vizFrame Bullet Chart Sample",
				content: oVizFrameBullet
			}, {
				icon : "sap-icon://table-chart",
				title : "Table Sample",
				content: oTable
			}, {
				icon : "sap-icon://map",
				title : "AnalyticMap Sample",
				content: oChartContainerAnalyticMap()
			}];
		},
		/**
		 * Creates a Viz Frame with the passed constants and data.
		 *
		 * @private
		 * @param {Object} constants Constants
		 * @param {Object} data Data
		 * @returns {sap.viz.ui5.controls.VizFrame} Viz Frame
		 */
		_createVizFrame: function(constants, data) {
			var oVizFrame = new VizFrame(constants.vizFrameConfig);
	
			var oDataset = new FlattenedDataset(constants.dataset);
			var oModel = oChartContainerHelpers.getVizFrameModel(data.modelData);
	
			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel);
			if (constants.vizProperties) {
				oVizFrame.setVizProperties(constants.vizProperties);
			}
	
			oChartContainerHelpers.addFeedItems(oVizFrame, constants.feedItems);
	
			return oVizFrame;
		},
		/**
		 * Creates table used in the chart container content.
		 *
		 * @private
		 * @param {sap.ui.model.Model} model Model to use for the table
		 * @returns {sap.m.Table} The created table
		 */
		_createTable : function(model) {
			var oTable = new Table({ //table chart
				width : "100%",
				fixedLayout : true,
				columns : oChartContainerHelpers.createTableColumns(oChartContainerConstants.table.columnLabelTexts)
			});
	
			var oTableTemplate = new ColumnListItem({
				type : ListType.Active,
				cells : oChartContainerHelpers.createLabels(oChartContainerConstants.table.templateCellLabelTexts)
			});
	
			oTable.bindItems(oChartContainerConstants.table.itemBindingPath, oTableTemplate);
			oTable.setModel(model);
	
			return oTable;
		},
		/**
		 * Creates Chart Container parameters used for the content.
		 *
		 * @private
		 * @param {Object[]} icons Icons configuration used to create sap.ui.core.Icon
		 * @returns {sap.ui.core.Icon[]} Array of sap.ui.core.Icons
		 */
		_createChartContainerIcons : function(icons) {
			var aIcons = [];
	
			for (var i = 0; i < icons.length; i++) {
				aIcons.push(
					new Icon({
						src : icons[i].src,
						tooltip : icons[i].tooltip,
						width : icons[i].width,
						press : this._onItemPress.bind(this, icons[i].pressMessage, "id")
					})
				);
			}
	
			return aIcons;
		},
		/**
		 * Adds all Chart Container selects as dimension selectors.
		 *
		 * @private
		 * @param {sap.suite.ui.commons.ChartContainer} chartContainer Chart container
		 * @param {Object[]} selects Array of selects
		 */
		_addChartContainerSelects : function(chartContainer, selects) {
			var oSelectProps = {};
			for (var i = 0; i < selects.length; i++) {
				if (selects[i].name) {
					oSelectProps.name = selects[i].name;
				}
	
				oSelectProps.items = oChartContainerHelpers.getCoreItems(selects[i].items);
	
				chartContainer.addDimensionSelector(new Select(oSelectProps));
			}
		},
		/**
		 * Adds all Chart Container combo boxes as dimension selectors.
		 *
		 * @private
		 * @param {sap.suite.ui.commons.ChartContainer} chartContainer Chart container
		 * @param {Object[]} comboBoxes Array of combo boxes
		 */
		_addChartContainerComboBoxes : function(chartContainer, comboBoxes) {
			var oComboBox;
			for (var i = 0; i < comboBoxes.length; i++) {
				oComboBox = new ComboBox({
					selectedKey: comboBoxes[i].selectedKey,
					items: comboBoxes[i].items,
					selectionChange: this._onSelectionChanged.bind(this, comboBoxes[i].selectionChangeMessage)
				});
				oComboBox.setWidth('10rem');
	
				chartContainer.addDimensionSelector(oComboBox);
			}
		}
	};

	oChartContainerMain.init();
	return oChartContainerMain;
});
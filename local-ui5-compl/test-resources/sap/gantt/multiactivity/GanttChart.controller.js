sap.ui.define([
	"sap/base/util/uid",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/gantt/simple/AdhocLine",
	"sap/gantt/misc/Format",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/ListLegend",
	"sap/gantt/simple/ListLegendItem",
	"sap/gantt/simple/DimensionLegend",
	"sap/gantt/simple/LegendColumnConfig",
	"sap/gantt/simple/LegendRowConfig",
	"sap/gantt/simple/GanttPrinting",
	"sap/tnt/NavigationListItem",
	"sap/tnt/NavigationList",
	"sap/gantt/misc/Utility",
	"sap/ui/core/Fragment",
	"sap/gantt/simple/Relationship",
	"sap/ui/core/Element"
], function(uid, Controller, JSONModel, MockServer, ODataModel, AdhocLine, Format, BaseRectangle, ListLegend, ListLegendItem, DimensionLegend, LegendColumnConfig, LegendRowConfig, GanttPrinting, NavigationListItem, NavigationList, Utility, Fragment, Relationship, Element) {
	"use strict";
	var oContextMenu = new sap.m.Menu({
		items: [
			new sap.m.MenuItem({
				text: "Delete",
				icon: ""
			}),
			new sap.m.MenuItem({
				text: "Edit Relationship Type",
				items: [
					new sap.m.MenuItem({
						text: "FinishToFinish"
					}),
					new sap.m.MenuItem({
						text: "FinishToStart"
					}),
					new sap.m.MenuItem({
						text: "StartToFinish"
					}),
					new sap.m.MenuItem({
						text: "StartToStart"
					})
				]
			})
		],
		itemSelected: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var oParent = oItem.getParent();
			var clearIcon = function (oParent) {
				oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
			};
			clearIcon(oParent);

			var oShape = oContextMenu.selectedShape;
			var sShapeId = oShape.getShapeId();
			var oDataModel = oShape.getModel("data");
			if (oItem.getText() === "Delete") {
				oDataModel.remove("/Relationships('" + sShapeId + "')", {
					refreshAfterChange: false
				});

			} else {
				var sType = sap.gantt.simple.RelationshipType[oItem.getText()];
				oDataModel.setProperty("/Relationships('" + sShapeId + "')/RelationType", sType, true);
							}
			oContextMenu.close();
		},
		closed: function(oEvent) {
			var clearIcon = function (oParent) {
				oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
			};

			clearIcon(oContextMenu.getItems()[1]);
		}
	});
	return Controller.extend("sap.gantt.multiactivity.test.Controller", {

		onInit : function() {
			var sServiceUrl = "http://my.test.service.com/";
			var oMockServer = new MockServer({
				rootUri : sServiceUrl
			});

			oMockServer.simulate("odata/metadata.xml", {
				sMockdataBaseUrl : "odata/",
				bGenerateMissingMockData : false
			});

			oMockServer.start();
			var oDataModel = new ODataModel(sServiceUrl, {
				useBatch: true,
				refreshAfterChange: false
			});

			oDataModel.setDefaultBindingMode("TwoWay");
			this.getView().setModel(oDataModel, "data");

			var oLegendModel = new JSONModel();
			oLegendModel.loadData("json/Legend.json");
			this.getView().setModel(oLegendModel, "legend");

			this.oGanttChartRef = null;

			var oGantt1 = this.getView().byId("gantt1");
			var oGantt3 = this.getView().byId("gantt3");
			var oFullScreenButton1 =  new sap.m.Button({
				icon: "sap-icon://full-screen",
				type: "Transparent",
				press: function () {
					this.onToggleFullScreen(oGantt1, true, oFullScreenButton1);
				}.bind(this)
			});
			var oFullScreenButton3 =  new sap.m.Button({
				icon: "sap-icon://full-screen",
				type: "Transparent",
				press: function () {
					this.onToggleFullScreen(oGantt3, true, oFullScreenButton3);
				}.bind(this)
			});
			var oExportButton =  new sap.m.Button({
				text: "Export to PDF",
				press: function () {
					this.onExportToPDF();
				}.bind(this)
			});
			var oAddAlertCheckbox = new sap.m.CheckBox('dynamicAlert', {
				text: 'AddAlert',
				enabled: true,
				select: this.onAddAlertCheckboxClicked.bind(this)
			});
			var oPseudoShapeCheckbox = new sap.m.CheckBox('pseudoShapesVisibility', {
				text: 'PseudoShape',
				enabled: true,
				select: this.onPseudoShapeCheckboxClicked.bind(this)
			});
			var oOnlyChartCheckbox = new sap.m.CheckBox('StockChartVisibility', {
				text: 'Chart',
				enabled: true,
				select: this.onOnlyChartCheckboxClick.bind(this)
			});
			var oTasksWithChartCheckbox = new sap.m.CheckBox('ChartWithTasksVisibility', {
				text: 'TasksWithChart',
				enabled: true,
				select: this.onTasksWithChartCheckboxClick.bind(this)
			});
			var oTasksWithoutChartCheckbox = new sap.m.CheckBox('TasksWithoutChartVisibility', {
				text: 'TasksWithoutChart',
				enabled: true,
				select: this.onTasksWithoutChartCheckboxClick.bind(this)
			});
			var oExportButton3 =  new sap.m.Button({
				text: "Export to PDF",
				press: function () {
					this.onExportToPDF3();
				}.bind(this)
			});
			var oPseudoShapeCheckbox3 = new sap.m.CheckBox('pseudoShapesVisibility3', {
				text: 'PseudoShape',
				enabled: true,
				select: this.onPseudoShapeCheckboxClicked3.bind(this)
			});
			var oOnlyChartCheckbox3 = new sap.m.CheckBox('StockChartVisibility3', {
				text: 'Chart',
				enabled: true,
				select: this.onOnlyChartCheckboxClick3.bind(this)
			});
			var oTasksWithChartCheckbox3 = new sap.m.CheckBox('ChartWithTasksVisibility3', {
				text: 'TasksWithChart',
				enabled: true,
				select: this.onTasksWithChartCheckboxClick3.bind(this)
			});
			var oTasksWithoutChartCheckbox3 = new sap.m.CheckBox('TasksWithoutChartVisibility3', {
				text: 'TasksWithoutChart',
				enabled: true,
				select: this.onTasksWithoutChartCheckboxClick3.bind(this)
			});
			oGantt1.addEventDelegate({onAfterRendering: function() {
				var oGanttOverflowToolbar = oGantt1.getChartOverflowToolbar();
				if (oGanttOverflowToolbar) {
					oGanttOverflowToolbar.addContent(oExportButton);
					oGanttOverflowToolbar.addContent(oFullScreenButton1);
					oGanttOverflowToolbar.addContent(oAddAlertCheckbox);
					oGanttOverflowToolbar.addContent(oPseudoShapeCheckbox);
					oGanttOverflowToolbar.addContent(oOnlyChartCheckbox);
					oGanttOverflowToolbar.addContent(oTasksWithChartCheckbox);
					oGanttOverflowToolbar.addContent(oTasksWithoutChartCheckbox);
				}
				var oRelationParams = {
					lShapeForTypeFS: false,
					lShapeForTypeSF: false,
					relationshipOverDivider:true,
					shapeId:"{data>ObjectID}",
					predecessor:"{data>PredecTaskID}",
					successor:"{data>SuccTaskID}",
					type:"{data>RelationType}",
					tooltip:"{data>RelationType}",
					selectable:true
				};
				var oResRowSettings = oGantt1.getTable().getRowSettingsTemplate();
				if (!oResRowSettings.isBound("relationships")) {
					oResRowSettings.bindAggregation("relationships", {
						path: "data>Relationships",
						template: new sap.gantt.simple.Relationship(oRelationParams),
						templateShareable: false
					});
				}
			}});
			oGantt3.addEventDelegate({onAfterRendering: function() {
				var oGanttOverflowToolbar = oGantt3.getChartOverflowToolbar();
				if (oGanttOverflowToolbar) {
					oGanttOverflowToolbar.addContent(oExportButton3);
					oGanttOverflowToolbar.addContent(oFullScreenButton3);
					oGanttOverflowToolbar.addContent(oPseudoShapeCheckbox3);
					oGanttOverflowToolbar.addContent(oOnlyChartCheckbox3);
					oGanttOverflowToolbar.addContent(oTasksWithChartCheckbox3);
					oGanttOverflowToolbar.addContent(oTasksWithoutChartCheckbox3);
				}
				var oRelationParams = {
					lShapeForTypeFS: false,
					lShapeForTypeSF: false,
					relationshipOverDivider:true,
					shapeId:"{data>ObjectID}",
					predecessor:"{data>PredecTaskID}",
					successor:"{data>SuccTaskID}",
					type:"{data>RelationType}",
					tooltip:"{data>RelationType}",
					selectable:true
				};
				var oResRowSettings = oGantt3.getTable().getRowSettingsTemplate();
				if (!oResRowSettings.isBound("relationships")) {
					oResRowSettings.bindAggregation("relationships", {
						path: "data>Relationships",
						template: new sap.gantt.simple.Relationship(oRelationParams),
						templateShareable: false
					});
				}
			}});

			var oGantt2 = this.getView().byId("gantt2");
			var oFullScreenButton2 =  new sap.m.Button({
				icon: "sap-icon://full-screen",
				type: "Transparent",
				press: function () {
					this.onToggleFullScreen(oGantt2, true, oFullScreenButton2);
				}.bind(this)
			});
			oGantt2.addEventDelegate({onAfterRendering: function() {
				var oGanttOverflowToolbar = oGantt2.getChartOverflowToolbar();
				if (oGanttOverflowToolbar) {
					oGanttOverflowToolbar.addContent(oFullScreenButton2);
				}
			}});
			this.aSchemeKeys = ["main_row_shape","scheme_for_shape1","scheme_for_shape2","scheme_for_overlay1","scheme_for_overlay2", "scheme_for_overlay3", "scheme_for_overlay4", "scheme_for_overlay5", "scheme_for_chartShape"];

			const oContainer = this.getView().byId("container");
			const oSidePanel = oContainer.getSidePanel();
			const oSidePanelBtn = this.getView().byId("sidePanelBtn");

			if (oSidePanel) {
				oSidePanel.addEventDelegate({
					onActivated: () => {
						oSidePanelBtn.setText("Hide Side Panel");
					},
					onDeactivated: () => {
						oSidePanelBtn.setText("Show Side Panel");
					}
				});
			}
			const oOverlayModel = new JSONModel({
				overlays: {
					staticOverlays: [
					],
					expandedOverlays: [
					]
				}
			});

			this.getView().setModel(oOverlayModel, "overlayData");
		},
		onShapeConnect: function(oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var sFromShapeUid = oEvent.getParameter("fromShapeUid");
			var sToShapeUid = oEvent.getParameter("toShapeUid");
			var iType = oEvent.getParameter("type");

			var fnParseUid = Utility.parseUid;
			var oDataModel = oTableGantt.getModel("data");

			var oParsedUid = fnParseUid(sFromShapeUid);
			var sShapeId = oParsedUid.shapeId;
			var sRowId = fnParseUid(oParsedUid.rowUid).rowId;
			var mParameters = {
				context: oDataModel.getContext("/ProjectElems('" + sRowId + "')"),
				success: function (oData) {
					oDataModel.read("/ProjectElems('" + sRowId + "')", {
						urlParameters: {
							"$expand": "Relationships"
						}
					});
				},
				refreshAfterChange: false
			};
			var sucShapeId = fnParseUid(sToShapeUid).shapeId;
			var sRelationshipID = sShapeId + "-" + sucShapeId + "-" + iType;
			var oNewRelationship = {
				"ObjectID": sRelationshipID,
				"RelationID": sRelationshipID,
				"ParentObjectID": sRowId,
				"PredecTaskID": sShapeId,
				"SuccTaskID": sucShapeId,
				"RelationType": iType
			};
			oDataModel.create('/Relationships', oNewRelationship, mParameters);
		},
		formatDateToUTCTime: function (sformatDate) {
			if (sformatDate === null) {
				return null;
			} else {
				var oTempDate = new Date(sformatDate);
				oTempDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (10));
				return oTempDate;
			}
		},
		formatDateToUTCEndTime: function (sformatDate) {
			if (sformatDate === null) {
				return null;
			} else {
				var oTempDate = new Date(sformatDate);
				oTempDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (20));
				return oTempDate;
			}
		},
		onAddAlertCheckboxClicked: function () {
            var bStatus = Element.getElementById("dynamicAlert").getSelected();
			if (bStatus){
				const oOverlayModel = new JSONModel({
					overlays: {
						staticOverlays: [
							{
								OverlayRowID: "overlay1_row_0",
								StartDate: new Date(2015, 0, 1, 0, 0, 0),
								EndDate: new Date(2015, 0, 1, 0, 0, 0),
								overlayLevel: 21,
								Tooltip: "Tooltip for 0_task_1",
								Src: "sap-icon://alert",
								scheme: "scheme_for_overlay1"
							}
						],
						expandedOverlays: [
							{
								OverlayRowID: "overlay1_row_0",
								StartDate: new Date(2015, 0, 1, 0, 0, 0),
								EndDate: new Date(2015, 0, 1, 0, 0, 0),
								overlayLevel: 21,
								Tooltip: "Tooltip for 0_task_1",
								Src: "sap-icon://alert",
								scheme: "scheme_for_overlay1"
							}
						]
					}
				});
				this.getView().setModel(oOverlayModel, "overlayData");
			} else {
				const oOverlayModel = new JSONModel({
					overlays: {
						staticOverlays: [
						],
						expandedOverlays: [
						]
					}
				});
				this.getView().setModel(oOverlayModel, "overlayData");
			}
        },
		onPseudoShapeCheckboxClicked: function () {
            var bStatus = Element.getElementById("pseudoShapesVisibility").getSelected();
            var oGantt = this.getView().byId("gantt1");
			oGantt.setProperty("enablePseudoShapes", bStatus);
        },
		onPseudoShapeCheckboxClicked3: function () {
            var bStatus = Element.getElementById("pseudoShapesVisibility3").getSelected();
            var oGantt = this.getView().byId("gantt3");
			oGantt.setProperty("enablePseudoShapes", bStatus);
        },
		onOnlyChartCheckboxClick: function () {
            var bStatus = Element.getElementById("StockChartVisibility").getSelected();
			// var oGantt = this.getView().byId("gantt1");
			if (bStatus){
				Element.getElementById("ChartWithTasksVisibility").setEnabled(false);
				Element.getElementById("TasksWithoutChartVisibility").setEnabled(false);
				this.aSchemeKeys = ["scheme_for_overlay4", "scheme_for_overlay5", "scheme_for_chartShape"];
				// oGantt.getTable().getRowSettingsTemplate().mBindingInfos.overlays4.template._oLocaleBindingInfo.expandedOverlay.template.getBindingInfo("overlayLevel").parts[0].value = 1;
				// oGantt.setProperty("useParentShapeOnExpand", false, false);
			} else {
				Element.getElementById("ChartWithTasksVisibility").setEnabled(true);
				Element.getElementById("TasksWithoutChartVisibility").setEnabled(true);
				// oGantt.setProperty("useParentShapeOnExpand", true, false);
				// oGantt.getTable().getRowSettingsTemplate().mBindingInfos.overlays4.template._oLocaleBindingInfo.expandedOverlay.template.getBindingInfo("overlayLevel").parts[0].value = 5;
			}
        },
		onTasksWithChartCheckboxClick: function () {
			var bStatus = Element.getElementById("ChartWithTasksVisibility").getSelected();
			if (bStatus){
				Element.getElementById("StockChartVisibility").setEnabled(false);
				Element.getElementById("TasksWithoutChartVisibility").setEnabled(false);
				this.aSchemeKeys = ["main_row_shape","scheme_for_shape1","scheme_for_shape2","scheme_for_overlay1","scheme_for_overlay2", "scheme_for_overlay3", "scheme_for_overlay4", "scheme_for_overlay5", "scheme_for_chartShape"];
			} else {
				Element.getElementById("StockChartVisibility").setEnabled(true);
				Element.getElementById("TasksWithoutChartVisibility").setEnabled(true);
			}
        },
		onTasksWithoutChartCheckboxClick: function () {
			var bStatus = Element.getElementById("TasksWithoutChartVisibility").getSelected();
			if (bStatus){
				Element.getElementById("StockChartVisibility").setEnabled(false);
				Element.getElementById("ChartWithTasksVisibility").setEnabled(false);
				this.aSchemeKeys = ["main_row_shape","scheme_for_shape1","scheme_for_shape2","scheme_for_overlay1","scheme_for_overlay2", "scheme_for_overlay3"];
			} else {
				Element.getElementById("StockChartVisibility").setEnabled(true);
				Element.getElementById("ChartWithTasksVisibility").setEnabled(true);
			}
        },
		onOnlyChartCheckboxClick3: function () {
            var bStatus = Element.getElementById("StockChartVisibility3").getSelected();
			if (bStatus){
				Element.getElementById("ChartWithTasksVisibility3").setEnabled(false);
				Element.getElementById("TasksWithoutChartVisibility3").setEnabled(false);
				this.aSchemeKeys = ["scheme_for_overlay4", "scheme_for_overlay5", "scheme_for_chartShape"];
				// oGantt.getTable().getRowSettingsTemplate().mBindingInfos.overlays4.template._oLocaleBindingInfo.expandedOverlay.template.getBindingInfo("overlayLevel").parts[0].value = 1;
				// oGantt.setProperty("useParentShapeOnExpand", false, false);
			} else {
				Element.getElementById("ChartWithTasksVisibility3").setEnabled(true);
				Element.getElementById("TasksWithoutChartVisibility3").setEnabled(true);
				// oGantt.setProperty("useParentShapeOnExpand", true, false);
				// oGantt.getTable().getRowSettingsTemplate().mBindingInfos.overlays4.template._oLocaleBindingInfo.expandedOverlay.template.getBindingInfo("overlayLevel").parts[0].value = 5;
			}
        },
		onTasksWithChartCheckboxClick3: function () {
			var bStatus = Element.getElementById("ChartWithTasksVisibility3").getSelected();
			if (bStatus){
				Element.getElementById("StockChartVisibility").setEnabled(false);
				Element.getElementById("TasksWithoutChartVisibility3").setEnabled(false);
				this.aSchemeKeys = ["main_row_shape","scheme_for_shape1","scheme_for_shape2","scheme_for_overlay1","scheme_for_overlay2", "scheme_for_overlay3", "scheme_for_overlay4", "scheme_for_overlay5", "scheme_for_chartShape"];
			} else {
				Element.getElementById("StockChartVisibility3").setEnabled(true);
				Element.getElementById("TasksWithoutChartVisibility3").setEnabled(true);
			}
        },
		onTasksWithoutChartCheckboxClick3: function () {
			var bStatus = Element.getElementById("TasksWithoutChartVisibility3").getSelected();
			if (bStatus){
				Element.getElementById("StockChartVisibility3").setEnabled(false);
				Element.getElementById("ChartWithTasksVisibility3").setEnabled(false);
				this.aSchemeKeys = ["main_row_shape","scheme_for_shape1","scheme_for_shape2","scheme_for_overlay1","scheme_for_overlay2", "scheme_for_overlay3"];
			} else {
				Element.getElementById("StockChartVisibility3").setEnabled(true);
				Element.getElementById("ChartWithTasksVisibility3").setEnabled(true);
			}
        },
		onToggleFullScreen: function(oGantt, bShowToolbar, oButton) {
			oGantt.toggleFullScreen(bShowToolbar, oButton);
			if (oGantt.fullScreenMode()) {
				oButton.setIcon("sap-icon://exit-full-screen");
				this.getView().byId("removeGantt").setVisible(false);
				this.getView().byId("resizeVertical").setVisible(false);
			} else {
				oButton.setIcon("sap-icon://full-screen");
				this.getView().byId("removeGantt").setVisible(true);
				this.getView().byId("resizeVertical").setVisible(true);
			}
		},
		onToggleFullScreenGantt3: function(oGantt, bShowToolbar, oButton) {
			oGantt.toggleFullScreen(bShowToolbar, oButton);
			if (oGantt.fullScreenMode()) {
				oButton.setIcon("sap-icon://exit-full-screen");
				this.getView().byId("removeGantt").setVisible(false);
				this.getView().byId("resizeVertical").setVisible(false);
			} else {
				oButton.setIcon("sap-icon://full-screen");
				this.getView().byId("removeGantt").setVisible(true);
				this.getView().byId("resizeVertical").setVisible(true);
			}
		},

		onGanttSettingsChanged: function(oEvent) {
			var oContainer = this.getView().byId("container");
			var oSelectedItem = oEvent.getParameter("item"),
				sPropertyName = oSelectedItem.getParent().getKey(),
				sPropertyValue = oSelectedItem.getText();

			if (sPropertyValue === "MultipleWithLasso" || sPropertyValue === "MultiWithKeyboardAndLasso") {
				this.getView().byId("invertLasso").setEnabled(true);
			} else if (sPropertyName === "shapeSelectionMode") {
				this.getView().byId("invertLasso").setEnabled(false);
			}

			oContainer.getGanttCharts().forEach(function(oGanttWithTable) {
				if (sPropertyName === "rowSelectionBehavior") {
					oGanttWithTable.getTable().setSelectionBehavior(sPropertyValue);
				} else if (sPropertyName === "shapeSelectionMode") {
					oGanttWithTable.setShapeSelectionMode(sPropertyValue);
				} else {
					oGanttWithTable.setProperty(sPropertyName, sPropertyValue);
				}
			});
		},

		onInvertClicked: function () {
			var oContainer = this.getView().byId("container");
			var bInvert = this.getView().byId("invertLasso").getSelected();
			oContainer.getGanttCharts().forEach(function(oGanttWithTable) {
				if (bInvert) {
					oGanttWithTable.setEnableLassoInvert(true);
				} else {
					oGanttWithTable.setEnableLassoInvert(false);
				}
			});
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		},
		toggleExpandChartOnRow: function(oEvent) {
			var oItem = oEvent.getParameter("item"),
				oRow = oEvent.getParameter("row"),
				oGantt = this.getView().byId("gantt1");

			var bExpand = oItem.data("expand") === "true";
			if (bExpand) {
				oGantt.expand(this.aSchemeKeys, oRow.getIndex());//task_to_step
			} else {
				oGantt.collapse(this.aSchemeKeys, oRow.getIndex());//main_row_shape
			}
		},
		toggleExpandChartOnCustomRow: function(oEvent) {
			var oItem = oEvent.getParameter("item"),
				oRow = oEvent.getParameter("row"),
				oGantt = this.getView().byId("gantt3");

			var bExpand = oItem.data("expand") === "true";
			if (bExpand) {
				oGantt.expand(this.aSchemeKeys, oRow.getIndex());//task_to_step
			} else {
				oGantt.collapse(this.aSchemeKeys, oRow.getIndex());//main_row_shape
			}
		},
		fnPrefixImg: function (sSrc) {
			return  "./view/" + sSrc;
		},

		handleExpandShape: function(oEvent) {
			var oSourceButton = oEvent.getSource();
			if (oSourceButton.getId().endsWith("ulcExpandBtn")) {
				var oGantt2 = this.getView().byId("gantt2");
				oGantt2.expand("project_to_ulc", oGantt2.getTable().getSelectedIndices()[0]);
			} else {
				var oGantt1 = this.getView().byId("gantt1");
				oGantt1.expand(["main_row_shape","scheme_for_shape1","scheme_for_shape2","scheme_for_overlay1","scheme_for_overlay2", "scheme_for_overlay3","scheme_for_overlay4", "scheme_for_overlay5", "scheme_for_chartShape"], oGantt1.getTable().getSelectedIndices()[0]);
			}
		},

		handleCollapseShape: function(oEvent) {
			var oSourceButton = oEvent.getSource();

			if (oSourceButton.getId().endsWith("ulcCollapseBtn")) {
				var oGantt2 = this.getView().byId("gantt2");
				oGantt2.collapse("project_to_ulc", oGantt2.getTable().getSelectedIndices()[0]);
			} else {
				var oGantt1 = this.getView().byId("gantt1");
				oGantt1.collapse(["main_row_shape","scheme_for_shape1","scheme_for_shape2","scheme_for_overlay1","scheme_for_overlay2", "scheme_for_overlay3","scheme_for_overlay4", "scheme_for_overlay5","scheme_for_chartShape"], oGantt1.getTable().getSelectedIndices()[0]);
			}
		},

		handleAdhocLineTimeChange: function(oEvent) {
			var oGantt = this.getView().byId("gantt2");
			oGantt.addSimpleAdhocLine(new AdhocLine({
				stroke: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
				strokeDasharray: "5, 1",
				timeStamp: oEvent.getParameter("value"),
				description: "Adhoc line description"
			}));
		},

		handleTableReorderDrop: function(oEvent) {
			var oDraggedRow = oEvent.getParameter("draggedControl"),
				iDraggedRowIndex = oDraggedRow.getIndex();

			var oTable = oEvent.getSource().getParent(),
				oBinding = oTable.getBinding();

			var oRemovedContext = oBinding.removeContext(oTable.getContextByIndex(iDraggedRowIndex));

			var oNewContext = oTable.getContextByIndex(0);
			oBinding.addContexts(oNewContext, oRemovedContext);
		},

		onShapeMouseEnter: function(oEvent) {
			this.handleMouseEnterLeave(oEvent, true);
		},
		onShapeMouseLeave: function(oEvent) {
			this.handleMouseEnterLeave(oEvent, false);
		},

		handleMouseEnterLeave: function(oEvent, bEnter) {
			var oPlaceHolder = new sap.m.Label();
			var oPopup = new sap.ui.core.Popup(oPlaceHolder, false, true, false);

			var afterPopup = function() {
				if (bEnter) {
					var oShape = oEvent.getParameter("shape"),
						mData = {
							id: oShape.getId(),
							startTime: oShape.getTime(),
							endTime: oShape.getEndTime()
						};
					this.oPopover.getModel().setData(mData);
					var eDock = sap.ui.core.Popup.Dock;
					var iPageX = oEvent.getParameter("pageX"),
						iPageY = oEvent.getParameter("pageY");
					var sOffset = (parseInt(iPageX) + 1) + " " + (parseInt(iPageY) + 1);
					var oControl = this.getView().byId("gantt2").fullScreenMode() ? this.getView().byId("gantt2").getParent() : null;
					oPopup.open(0, eDock.BeginTop, eDock.LeftTop, oControl , sOffset);
					this.oPopover.openBy(oPlaceHolder);
				} else if (oPopup !== undefined){
					this.oPopover.close();
					oPopup.close(0);
				}
			}.bind(this);

			if (!this.oPopover) {
				Fragment.load({
					name: "sap.gantt.multiactivity.test.view.QuickViewPopover",
					controller: this
				}).then(function (oDialog) {
					this.oPopover = oDialog;
					var oQuickViewModel = new JSONModel();
					this.oPopover.setModel(oQuickViewModel);
					this.getView().addDependent(this.oPopover);
					afterPopup();
				}.bind(this));
			} else {
				afterPopup();
			}
		},

		onShapeContextMenu: function(oEvent) {
			var oController = this; // eslint-disable-line consistent-this
			var oShape = oEvent.getParameter("shape"),
				oRow   = oEvent.getParameter("rowSettings"),
				iPageX = oEvent.getParameter("pageX"),
				iPageY = oEvent.getParameter("pageY");
			var eDock = sap.ui.core.Popup.Dock;
			var sOffset = (iPageX + 1) + " " + (iPageY + 1);

			var oMenu;
			if (oShape instanceof Relationship) {
				var sType = oShape.getType();
				oContextMenu.getItems()[1].getItems().filter(function (item) { return item.getText() == sType; })[0].setIcon("sap-icon://accept");

				oContextMenu.selectedShape = oShape;
				var oPlaceHolder = new sap.m.Label();
				var oPopup = new sap.ui.core.Popup(oPlaceHolder, false, true, false);
				var eDock = sap.ui.core.Popup.Dock;
				var sOffset = (iPageX + 1) + " " + (iPageY + 1);
				oPopup.open(0, eDock.BeginTop, eDock.LeftTop, null , sOffset);
				oContextMenu.openBy(oPlaceHolder);
			} else {
				var oControl = this.getView().byId("gantt1").fullScreenMode() ? this.getView().byId("gantt1").getParent() : null;
				if (oShape) {
					oMenu = new sap.ui.unified.Menu({
						items:[
							new sap.ui.unified.MenuItem({
								text: "Delete",
								icon: "sap-icon://delete"
							}),
							new sap.ui.unified.MenuItem({
								text: "View",
								icon: "sap-icon://checklist"
							})
						],
						itemSelect: function(oEvent2) {
							var oItem = oEvent2.getParameter("item");
							if (oItem.getText() === "Delete") {
								var oRowBindingContext = oRow.getBindingContext("data");
								if (oShape.getScheme() === "task_to_step") {
									oController.removeStepFromModel(oShape.getShapeId());
								} else {
									oController.removeTaskFromModel(oRowBindingContext, oRow.getRowId(), oShape.getShapeId());
								}
							}
						}
					});
					oMenu.open(true, Element.getElementById(oShape.getId()), eDock.BeginTop, eDock.LeftTop, oControl, sOffset);
				} else if (oEvent.getParameter("row")){
					oMenu = new sap.ui.unified.Menu({
						items:[
							new sap.ui.unified.MenuItem({
								text: "Show Document",
								icon: "sap-icon://detail-view"
							})
						],
						itemSelect: function(oEvent2) {
							sap.m.MessageToast.show("Context Menu on Row: " + oRow.getId());
						}
					});
					oMenu.open(true, Element.getElementById(oRow.getId()), eDock.BeginTop, eDock.LeftTop, oControl, sOffset);
				} else {
					sap.m.MessageToast.show("Context Menu on Empty Row");
				}
			}
		},
		// handleBindUnbindRelationships: function(bChecked, sLegendName, renderRequired){
		// 	var oGantt1 = this.getView().byId("gantt1"),
		// 	oResRowSettings = oGantt1.getTable().getRowSettingsTemplate();
		// 	var aMainShapeLegendItems = oGantt1.getParent().getToolbar().getLegendContainer().getLegends()[0].getItems();
		// 	var pseudoshapeDisplay = aMainShapeLegendItems.find(function(obj){return obj.getLegendName() == "pseudoshape";}).getSelected(),
		// 	taskDisplay = aMainShapeLegendItems.find(function(obj){return obj.getLegendName() == "task";}).getSelected();
		// 	if (((pseudoshapeDisplay && sLegendName == "task") || (taskDisplay && sLegendName == "pseudoshape")) && renderRequired){
		// 		this.fullScreenModeUpdated = false;
		// 		if (bChecked ) {
		// 			var oRelationParams = {
		// 				lShapeForTypeFS: false,
		// 				lShapeForTypeSF: false,
		// 				relationshipOverDivider:true,
		// 				shapeId:"{data>ObjectID}",
		// 				predecessor:"{data>PredecTaskID}",
		// 				successor:"{data>SuccTaskID}",
		// 				type:"{data>RelationType}",
		// 				tooltip:"{data>RelationType}",
		// 				selectable:true
		// 			};
		// 			if (!oResRowSettings.isBound("relationships")) {
		// 				oResRowSettings.bindAggregation("relationships", {
		// 					path: "data>Relationships",
		// 					template: new sap.gantt.simple.Relationship(oRelationParams),
		// 					templateShareable: false
		// 				});
		// 			}
		// 		} else {
		// 					if (oResRowSettings.isBound("relationships")) {
		// 						oResRowSettings.unbindAggregation("relationships");
		// 					}
		// 		}
		// 		oGantt1.setRowSettingsTempWithInvalid(oResRowSettings);
		// 	}
		// },
		removeTaskFromModel: function(oRowContext, sRowId, sTaskId) {
			var oController = this; // eslint-disable-line consistent-this
			var oDataModel = this.getView().getModel("data");
			var mParameters = {
				context: oRowContext,
				success: function(oData) {
					sap.m.MessageToast.show("Task is deleted");
					oController.reloadRowContext(sRowId);
				}
			};
			oDataModel.remove("/Tasks('" + sTaskId + "')", mParameters);
		},

		removeStepFromModel: function(sStepId) {
			var oDataModel = this.getView().getModel("data");
			var mParameters = {
				success: function(oData) {
					sap.m.MessageToast.show("Step is deleted");
				}
			};
			oDataModel.remove("/Steps('" + sStepId + "')", mParameters);
		},

		reloadRowContext: function(sRowId) {
			var oDataModel = this.getView().getModel("data");
			// sound like a workaround to prevent UI flicker
			oDataModel.read("/ProjectElems('" + sRowId + "')", {
				urlParameters: {
					"$expand": "ProjectTasks"
				}
			});
		},

		handleShapeDrop: function(oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var oDataModel = oTableGantt.getModel("data");
			var oNewDateTime = oEvent.getParameter("newDateTime");
			var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
			var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");
			var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
			var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
			var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
			if (oTableGantt.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
				iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
			}

			var getBindingContextPath = function (sShapeUid) {
				var oParsedUid = Utility.parseUid(sShapeUid);
				return oParsedUid.shapeDataName;
			};

			Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
				var sPath = getBindingContextPath(sShapeUid);
				var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
				var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
				var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
				var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
				oDataModel.setProperty(sPath + "/StartDate", oNewDateTime, true);
				oDataModel.setProperty(sPath + "/EndDate", oNewEndDateTime, true);
			});
		},
		handleShapeDoubleClick: function(oEvent) {
			var oShape = oEvent.getParameter("shape"),
				oRow =  oEvent.getParameter("row");
			if (oShape) {
				sap.m.MessageToast.show("double click on shape: " + oShape.getShapeId());
			} else if (oRow) {
				sap.m.MessageToast.show("double click on Row: " + oRow.getIndex());
			}
		},

		onShapeResize: function(oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var oDataModel = oTableGantt.getModel("data");
			var aNewTime = oEvent.getParameter("newTime"),
				oShape = oEvent.getParameter("shape");
			var getBindingContextPath = function (sShapeUid) {
				var oParsedUid = Utility.parseUid(sShapeUid);
				return oParsedUid.shapeDataName;
			};
			var sPath = getBindingContextPath(oShape.getShapeUid());
			oDataModel.setProperty(sPath + "/StartDate", aNewTime[0], true);
				oDataModel.setProperty(sPath + "/EndDate", aNewTime[1], true);
		},

		toggleTableVisibility: function(oEvent) {
			this.getView().byId("container").getGanttCharts().forEach(function(oGantt) {
				oGantt.setSelectionPanelSize(oGantt.getSelectionPanelSize() === "0px" ? "30%" : "0px");
			});
		},

		toggleGanttVisibility: function(oEvent) {
			var oContainer = this.getView().byId("container");
			var bPressed = oEvent.getParameter("pressed");
			var iContainerWidth = jQuery(oContainer.getDomRef()).width();
			var sSize = bPressed ? (iContainerWidth - 16) + "px" : "30%";
			oContainer.getGanttCharts().forEach(function(oGantt) {
				oGantt.setSelectionPanelSize(sSize);
			});
		},

		toggleResizeOrientation: function(oEvent) {
			var Orientation = sap.ui.core.Orientation;
			var oContainer = this.getView().byId("container");
			var sNewOrientation = oContainer.getLayoutOrientation() === Orientation.Horizontal ? Orientation.Vertical : Orientation.Horizontal;
			var sIcon = "sap-icon://resize-" + sNewOrientation.toLowerCase();
			oEvent.getSource().setIcon(sIcon);

			oContainer.setLayoutOrientation(sNewOrientation);
		},

		toggleDensity: function(oEvent) {
			// close all expand chart before toogle density, only for testing purpose
			jQuery("a.sapGanttExpandClose").trigger("click");
			jQuery("#content")
				.removeClass(oEvent.getSource().getItems().map(function(oItem){ return oItem.getKey(); }).join(" "))
				.addClass(oEvent.getParameter("item").getKey());
			this.getView().byId("container").invalidate();
		},

		toggleSetting: function(oEvent) {
			var oButton = oEvent.getSource();
			var oToolbar = oButton.getParent();

			var bEnableSetting = oToolbar.getEnableSetting();
			oToolbar.setEnableSetting(!bEnableSetting);
			oButton.setText(bEnableSetting ? "Show Setting" : "Hide Setting");
		},

		switchRowSettings: function(oEvent) {
			var oTable = oEvent.getSource().getParent().getParent();
			Fragment.load({
				name: "sap.gantt.multiactivity.test.view." + oEvent.getParameter("item").getKey(),
				controller: this
			}).then(function (oRowSettings) {
				oTable.setRowSettingsTemplate(oRowSettings);
			});
		},

		onGanttsChange: function(oEvent) {
			var sAddButtonText = "Add Gantt",
				sRemoveButtonText = "Remove Gantt";
			var oContainer = this.getView().byId("container");
			var bShallAdd = oEvent.getSource().getText() === sAddButtonText;

			if (bShallAdd && this.oGanttChartRef) {
				oContainer.insertGanttChart(this.oGanttChartRef, 1);
				this.oGanttChartRef = null;
				oEvent.getSource().setText(sRemoveButtonText);
			} else {
				this.oGanttChartRef = oContainer.removeGanttChart(1);
				oEvent.getSource().setText(sAddButtonText);
			}
		},

		onExportToPDF: function(oEvent){
            var oGantt = this.getView().byId("gantt1");
            var oGanttPrinting = new GanttPrinting({
                ganttChart: oGantt
            });

            oGanttPrinting.open();
		},
		onExportToPDF3: function(oEvent){
            var oGantt = this.getView().byId("gantt3");
            var oGanttPrinting = new GanttPrinting({
                ganttChart: oGantt
            });

            oGanttPrinting.open();
		},

		onTableRowSelectionChange: function(oEvent) {
			var bHasSelection = oEvent.getSource().getSelectedIndices().length > 0;
			var oView = this.getView();
			oView.byId("expandBtn").setEnabled(bHasSelection);
			oView.byId("collapseBtn").setEnabled(bHasSelection);
			oView.byId("addTaskBtn").setEnabled(bHasSelection);
		},

		onTableRowSelectionChange2: function(oEvent) {
			var bHasSelection = oEvent.getSource().getSelectedIndices().length > 0;
			var oView = this.getView();
			oView.byId("ulcExpandBtn").setEnabled(bHasSelection);
			oView.byId("ulcCollapseBtn").setEnabled(bHasSelection);
		},

		onPressAddTask: function(oEvent) {
			var oaddTask = function(){
				this.oAddTaskPopover.getModel("time").setData({
					StartDate: null,
					EndDate: null,
					TaskDesc: "Task Description Placeholder",
					VisibleStartDate: Format.abapTimestampToDate(oHorizon.getStartTime()),
					VisibleEndDate: Format.abapTimestampToDate(oHorizon.getEndTime())
				});
				this.oAddTaskPopover.openBy(oEvent.getSource());
			}.bind(this);
			var oGantt = this.getView().byId("gantt1"),
				oHorizon =  oGantt.getAxisTimeStrategy().getVisibleHorizon();
			if (!this.oAddTaskPopover) {
				Fragment.load({
					name: "sap.gantt.multiactivity.test.view.AddTask",
					controller: this
				}).then(function (oDialog) {
					this.oAddTaskPopover = oDialog;
					var oModel = new JSONModel();
					this.oAddTaskPopover.setModel(oModel, "time");
					// this.oAddTaskPopover.bindElement("/ProductCollection/0");
					this.getView().addDependent(this._oPopover);
					oaddTask();
				}.bind(this));
			} else {
				oaddTask();
			}
		},

		addTask: function(oEvent) {
			var oController = this; // eslint-disable-line consistent-this
			var oDataModel = this.getView().getModel("data");
			var oTaskData = this.oAddTaskPopover.getModel("time").getData();
			var oGantt = this.getView().byId("gantt1"),
				oTable = oGantt.getTable(),
				sSelectedRowId = oTable.getRows()[oTable.getSelectedIndices()[0]].getAggregation("_settings").getRowId();

			var mParameters = {
				context: oTable.getContextByIndex(oTable.getSelectedIndices()[0]),
				success: function(oData) {
					sap.m.MessageToast.show("Task is created");
					oController.reloadRowContext(sSelectedRowId);
				},
				error: function(oError) {
					sap.m.MessageToast.show("Fail to create task");
				},
				refreshAfterChange: false
			};

			oDataModel.create("ProjectTasks", {
				TaskID: uid(),
				ProjectElemID: sSelectedRowId,
				StartDate: oTaskData.StartDate,
				EndDate: oTaskData.EndDate,
				TaskDesc: oTaskData.TaskDesc
			}, mParameters);

			oDataModel.submitChanges();
		},

		markShapeAsSelected: function(oEvent) {
			var oRow = oEvent.getParameter("row").getAggregation("_settings");
			var oEalierStart = null;
			oRow.getProjects().forEach(function(oShape) {
				oEalierStart = oShape.getChevron().getTime();
				oShape.setSelected(true, true);
			});
			this.getView().byId("gantt2").getAxisTimeStrategy().setVisibleHorizon(new sap.gantt.config.TimeHorizon({
				startTime: new Date(oEalierStart.getTime() - 24 * 60 * 60 * 1000) // minus one day to leave some spaces
			}));
		},

		onListLegendItemInteractiveChange: function(oEvent) {
			var oGantt1 = this.getView().byId("gantt1"),
				aRowSettings = oGantt1.getTable().getRows().map(function(oRow){ return oRow.getAggregation("_settings"); });
			var bChecked = oEvent.getParameter("value"),
				sLegendName = oEvent.getParameter("legendName");

			var fnToggleGroupShape = function(oRowSettings, bChecked) {
				oRowSettings.getTasks().forEach(function(oBaseShape){
					if (bChecked) {
						oBaseShape.setOpacity(1);
						oBaseShape.setSelectable(true);
					} else {
						oBaseShape.setOpacity(0);
						oBaseShape.setSelectable(false);
					}
				});
			};

			var fnToggleCalendar = function(oRowSettings, bChecked) {
				oRowSettings.getCalendars().forEach(function(oBaseShape){
					if (bChecked) {
						oBaseShape.setOpacity(1);
					} else {
						oBaseShape.setOpacity(0);
					}
				});
			};

			aRowSettings.forEach(function(oRowSettings) {
				if (sLegendName === "calendar") {
					fnToggleCalendar(oRowSettings, bChecked);
				} else {
					fnToggleGroupShape(oRowSettings, bChecked);
				}
			});
		},

		stepShapeColorFormatter: function(sStatus) {
			return sStatus === "finished" ? '#99D101' : (sStatus === "blocked" ? '#FF0000' : '#CAC7BA');// eslint-disable-line no-nested-ternary
		},

		legendFactory: function(sId, oContext) {
			var oScheme = oContext.getProperty();
			switch (oScheme.type) {
				case "list":
					var aItems = oScheme.legendItems.map(function(currentValue,index,arr){
						return new ListLegendItem({
							legendName: currentValue.LegendName,
							interactive: currentValue.Checked,
							shape: new BaseRectangle({
								title: currentValue.LegendName,
								fill: currentValue.Fill,
								showTitle: false
							}),
							interactiveChange: this.onListLegendItemInteractiveChange.bind(this) // bind the context to Controller
						});
					}, this);
					return new ListLegend({
						title: oScheme.SectionName,
						items: aItems
					});
				case "dimension":
					var that = this;
					var aLegendRowConfigs = oScheme.LegendRowConfigs.map(function(c){
						return new LegendRowConfig(c);
					});

					return new DimensionLegend({
						title: oScheme.SectionName,
						columnConfigs: [
							new LegendColumnConfig({
								text: "Planned",
								fill: "white"
							}),
							new LegendColumnConfig({
								text: "In Execution",
								fillFactory: function (sShapeId){
									switch (sShapeId) {
										case "conceptShape":
											return that.getView().byId("pattern_slash_orange").getRefString();
										case "designShape":
											return that.getView().byId("pattern_slash_blue").getRefString();
										case "validationShape":
											return that.getView().byId("pattern_slash_green").getRefString();
										default:
											return "";
									}
								}
							}),
							new LegendColumnConfig({
								text: "Executed",
								fillFactory: function(sShapeId) {
									switch (sShapeId) {
										case "conceptShape":
											return "@sapUiChart2";
										case "designShape":
											return "@sapUiChart1";
										case "validationShape":
											return "@sapUiChart3";
										default:
											return "";
									}
								}
							})],
						rowConfigs: aLegendRowConfigs
					});
				default:
					return null;
			}
		},

		onGanttSidePanel: function(oEvent) {
			oEvent.getParameters().updateSidePanelState.enable();
		},

		onGanttSearchSidePanelList: function(oEvent) {
			var aSearchResults = oEvent.getParameters().searchResults;
			var aSearchResultsListItems = aSearchResults.map(function (oResult, index) {
				var sId = oResult.data["StepID"] || oResult.data["TaskID"] || oResult.data["ProjectElemID"];
				var sDescription = oResult.data["StepDesc"] || oResult.data["TaskDesc"] || oResult.data["ProjectElemDesc"];
				var sIcon = oResult.ganttID === 0 ? "sap-icon://chevron-phase-2" : "sap-icon://color-fill";
				var listItem = new NavigationListItem({
					text: ("Gantt " + (oResult.ganttID + 1) + ", ID: " + sId + ", Description: " + sDescription).substring(0, 200),
					id: "listItem" + index,
					icon: sIcon
				});
				return listItem;
			});
			var oSearchResultsList = new NavigationList({
				items: [aSearchResultsListItems]
			});
			this.getView().byId("container").setSearchSidePanelList(oSearchResultsList);
		},
		toggleSidePanel: function () {
			const oContainer = this.getView().byId("container");
			const oSidePanel = oContainer.getSidePanel();

			if (oSidePanel) {
				oSidePanel.setVisible(!oSidePanel.getVisible());
			}
		}
	});
});

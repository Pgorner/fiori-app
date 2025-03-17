sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/gantt/misc/Format",
	"sap/gantt/config/SettingItem",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/table/library",
	"sap/ui/core/Fragment",
	"sap/ui/core/Element",
	'sap/m/p13n/Engine',
	'sap/m/p13n/SelectionController',
	'sap/m/p13n/SortController',
	'sap/m/p13n/GroupController',
	'sap/m/p13n/FilterController',
	'sap/m/p13n/MetadataHelper',
	'sap/m/table/ColumnWidthController',
	'sap/ui/core/library',
	'sap/m/MessageToast',
	"sap/gantt/simple/GanttPrinting",
	"sap/gantt/simple/PrintConfig"
], function (Controller, Format, SettingItem, JSONModel, Filter, FilterOperator, Sorter, library, Fragment, Element, Engine, SelectionController, SortController, GroupController, FilterController, MetadataHelper, ColumnWidthController, CoreLibrary, MessageToast,
	GanttPrinting,PrintConfig
) {
	"use strict";

	return Controller.extend("gantt.blog.GanttBlog.controller.MainView", {
		onInit: function () {
			this.isShapeVisible = true;
			this.isDescriptionVisible = true;
			var oViewModel = new JSONModel({
				isShapeVisible: this.isShapeVisible,
				isDescriptionVisible: this.isDescriptionVisible
			});
            this.getView().setModel(oViewModel,"view");
			var oSettingItem1 = new SettingItem("settings1", {
				key: "setting1",
				displayText: "Custom Setting1",
				checked: false
			});
			var oSettingItem2 = new SettingItem("settings2",{
				key: "setting2",
				displayText: "Custom Setting2",
				checked: false
			});
			var oToolbar = Element.getElementById("ganttVariantManagementContainer-GanttVariantManagement---MainView--ganttContainerToolbar");
			oToolbar.insertSettingItem(oSettingItem1, 6);
			oToolbar.insertSettingItem(oSettingItem2, 7);
			if (!this.customData) {
                this.createCustomData();
            }
			this.getView().byId('variantId').setDependantControlID(["settings1", "settings2"]);
			this._registerForP13n();
		},

		_registerForP13n: function() {
			const oTable = this.byId("ganttTreeTableAdhoc");
			const oTable1 = this.byId("ganttTreeTableDelta");

			this.oMetadataHelper = new MetadataHelper([{
					key: "Column0",
					label: "ID",
					path: "ProjectElemID"
				},
				{
					key: "Column1",
					label: "Object Name",
					path: "ObjectName"
				},
				{
					key: "Column2",
					label: "Percentage",
					path: "Percentage"
				},
				{
					key: "Column3",
					label: "Description",
					path: "Description"
				},
				{
					key: "Column4",
					label: "Text",
					path: "text"
				}
			]);
			this.oMetadataHelper1 = new MetadataHelper([{
				key: "Column01",
				label: "ID",
				path: "ProjectElemID"
			},
			{
				key: "Column11",
				label: "Object Name",
				path: "ObjectName"
			},
			{
				key: "Column21",
				label: "Percentage",
				path: "Percentage"
			},
			{
				key: "Column31",
				label: "Description",
				path: "Description"
			}
		]);

			this._mIntialWidth = {
				"Column0": "5rem",
				"Column1": "5rem",
				"Column2": "5rem",
				"Column3": "5rem",
				"column4": "5rem"
			};

			Engine.getInstance().register(oTable, {
				helper: this.oMetadataHelper,
				controller: {
					Columns: new SelectionController({
						targetAggregation: "columns",
						control: oTable
					}),
					Filter: new FilterController({
						control: oTable
					}),
					Sorter: new SortController({
						control: oTable
					}),
					Groups: new GroupController({
						control: oTable
					}),
					ColumnWidth: new ColumnWidthController({
						control: oTable
					})
				}
			});

			Engine.getInstance().register(oTable1, {
				helper: this.oMetadataHelper1,
				controller: {
					Columns: new SelectionController({
						targetAggregation: "columns",
						control: oTable1
					}),
					Sorter: new SortController({
						control: oTable1
					}),
					ColumnWidth: new ColumnWidthController({
						control: oTable1
					})
				}
			});

			Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
		},

		openPersoDialog: function(oEvt) {
			const oTable = this.byId("ganttTreeTableAdhoc");

			Engine.getInstance().show(oTable, ["Columns", "Sorter", "Filter"], {
				contentHeight: "35rem",
				contentWidth: "32rem",
				source: oEvt.getSource()
			});
		},
		openPersoDialog1: function(oEvt) {
			const oTable = this.byId("ganttTreeTableDelta");

			Engine.getInstance().show(oTable, ["Columns", "Sorter"], {
				contentHeight: "35rem",
				contentWidth: "32rem",
				source: oEvt.getSource()
			});
		},

		onColumnHeaderItemPress: function(oEvt) {
			const oTable = this.byId("ganttTreeTableAdhoc");
			const sPanel = oEvt.getSource().getIcon().indexOf("sort") >= 0 ? "Sorter" : "Columns";

			Engine.getInstance().show(oTable, [sPanel], {
				contentHeight: "35rem",
				contentWidth: "32rem",
				source: oTable
			});
		},

		onCustomColumnPress: function(oEvt) {
			MessageToast.show(`Custom Column Pressed for ${oEvt.getSource().getText()}`);
		},

		onSort: function(oEvt) {
			const oTable = oEvt.getSource();//this.byId("ganttTreeTableAdhoc");
			const sAffectedProperty = this._getKey(oEvt.getParameter("column"));
			const sSortOrder = oEvt.getParameter("sortOrder");

			//Apply the state programatically on sorting through the column menu
			//1) Retrieve the current personalization state
			Engine.getInstance().retrieveState(oTable).then(function(oState) {

				//2) Modify the existing personalization state --> clear all sorters before
				oState.Sorter.forEach(function(oSorter) {
					oSorter.sorted = false;
				});
				oState.Sorter.push({
					key: sAffectedProperty,
					descending: sSortOrder === CoreLibrary.SortOrder.Descending
				});

				//3) Apply the modified personalization state to persist it in the VariantManagement
				Engine.getInstance().applyState(oTable, oState);
			});
		},

		onColumnMove: function(oEvt) {
			const oTable = oEvt.getSource();//this.byId("ganttTreeTableAdhoc");
			const oAffectedColumn = oEvt.getParameter("column");
			const iNewPos = oEvt.getParameter("newPos");
			const sKey = this._getKey(oAffectedColumn);
			oEvt.preventDefault();

			Engine.getInstance().retrieveState(oTable).then(function(oState) {

				const oCol = oState.Columns.find(function(oColumn) {
					return oColumn.key === sKey;
				}) || {
					key: sKey
				};
				oCol.position = iNewPos;

				Engine.getInstance().applyState(oTable, {
					Columns: [oCol]
				});
			});
		},

		onColumnResize: function(oEvt) {
			const oColumn = oEvt.getParameter("column");
			const sWidth = oEvt.getParameter("width");
			const oTable = oEvt.getSource();

			const oColumnState = {};
			oColumnState[this._getKey(oColumn)] = sWidth;

			Engine.getInstance().applyState(oTable, {
				ColumnWidth: oColumnState
			});
		},

		handleStateChange: function(oEvt) {
			const oTable = oEvt.getParameter("control");
			const oState = oEvt.getParameter("state");

			if (!oState) {
				return;
			}

			oTable.getColumns().forEach(function(oColumn) {

				const sKey = this._getKey(oColumn);
				const sColumnWidth = oState.ColumnWidth[sKey];

				oColumn.setWidth(sColumnWidth || this._mIntialWidth[sKey]);

				oColumn.setVisible(false);
				oColumn.setSortOrder(CoreLibrary.SortOrder.None);
			}.bind(this));

			oState.Columns.forEach(function(oProp, iIndex) {
				const oCol = this.byId(oProp.key);
				oCol.setVisible(true);

				oTable.removeColumn(oCol);
				oTable.insertColumn(oCol, iIndex);
			}.bind(this));

			const aSorter = [];
			oState.Sorter.forEach(function(oSorter) {
				const oColumn = this.byId(oSorter.key);
				oColumn.setSortOrder(oSorter.descending ? CoreLibrary.SortOrder.Descending : CoreLibrary.SortOrder.Ascending);
				oColumn.setSorted(true);
				aSorter.push(new Sorter(Engine.getInstance()._getRegistryEntry(oTable).helper.getProperty(oSorter.key).path, oSorter.descending));
			}.bind(this));
			oTable.getBinding("rows").sort(aSorter);
			var aFilters = [];
			Object.keys(oState.Filter).forEach(function(sKey) {
				aFilters.push(new Filter(this.oMetadataHelper.getProperty(sKey).path, oState.Filter[sKey][0].operator, oState.Filter[sKey][0].values[0]));
				// oTable.getBinding("rows").filter(new Filter(sKey, oState.Filter[sKey][0].operator, oState.Filter[sKey][0].values));
			}.bind(this));
			if (aFilters.length > 0) {
				oTable.getBinding("rows").filter(aFilters, "Application");
			}
		},

		createCustomData: function () {
			this.customData = {
				newData: {
					SettingsData: {
						setting1: false,
						setting2: false,
						created: 'not_clicked',
						type: "AdhocAndDelta",
						isShapeVisible: true,
						isDescriptionVisible: true,
						collapseRows: false
					}
				},
				oldData: {
					SettingsData: {
						setting1: false,
						setting2: false,
						created: 'not_clicked',
						type: "AdhocAndDelta",
						isShapeVisible: true,
						isDescriptionVisible: true,
						collapseRows: false
					}
				}
			};
		},
		_getKey: function(oControl) {
			return this.getView().getLocalId(oControl.getId());
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		},

		fnYYYYMMDDHHMMSSConverter: function (date) {
			function pad2(n) {
				return n < 10 ? '0' + n : n;
			}
			return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) +
				pad2(date.getSeconds());
		},
		handleSprintDurationChange: function (oEvent) {
			this.getView().getModel("ui").setProperty('/startDate', this.fnYYYYMMDDHHMMSSConverter(oEvent.getParameter("from")));
			this.getView().getModel("ui").setProperty('/endDate', this.fnYYYYMMDDHHMMSSConverter(oEvent.getParameter("to")));
			this.getView().inValidate();
			// this.getView().byId("ganttContainer1").getAggregation("ganttCharts").forEach(function(oControl){
			// 	oControl.invalidate();
			// });
		},

		onVariantApplied : function(oEvent){
			var aGanttCharts = oEvent.getSource().getGanttCharts();
			aGanttCharts.forEach(function(oItem) {
				var aColumns = oItem.getTable().getColumns();
				var oRowBindings = oItem.getTable().getBinding("rows");
				var aFilters = [];
				var oSorter;
				aColumns.forEach(function(oColumn) {
					if (oColumn.getFilterValue() && isNaN(oColumn.getFilterValue())) {
						aFilters.push(new Filter(oColumn.getFilterProperty(), FilterOperator.Contains, oColumn.getFilterValue()));
					} else if (oColumn.getFilterValue() && !isNaN(oColumn.getFilterValue())) {
						aFilters.push(new Filter(oColumn.getFilterProperty(), FilterOperator.EQ, oColumn.getFilterValue()));
					}
					if (oColumn.getSortOrder() === library.SortOrder.Descending) {
						oSorter = new Sorter(oColumn.getSortProperty(), oColumn.getSortOrder() === library.SortOrder.Descending);
					}
				});

				oRowBindings.sort(oSorter);

				if (aFilters.length > 0) {
					oRowBindings.filter(aFilters, "Application");
				} else {
					oRowBindings.filter(null);
				}
			});
		},

		updateOnSettingsChange: function (oEvent) {
			if (!this.customData) {
				this.createCustomData();
			}
			oEvent.getParameters().forEach(function (item) {
				this.customData.newData.SettingsData[item.name] = item.value;
			}.bind(this));
			this.getView().byId('variantId').setData(this.customData);
		},

		// Custom button change
		onCreate: function (oEvent) {
			this.customData.newData.SettingsData['created'] = 'clicked';
			this.getView().byId('variantId').setData(this.customData);
		},

		applyCustomData: function (oChange, oControl, mPropertyBag) {
			var oContent = oChange.getContent();
			this.updateVariantData(oContent.newData.SettingsData, oControl, mPropertyBag);
			this.customData = JSON.parse(JSON.stringify(oContent));
			if (!this.customData) {
                this.createCustomData();
            }
		},

		revertCustomData: function (oChange, oControl, mPropertyBag) {
			var oContent = oChange.getContent();
			this.updateVariantData(oContent.oldData.SettingsData, oControl, mPropertyBag);
			this.customData = null;
		},

		onLayoutChange: function(oEvent){
			var sKey = oEvent.getParameter("selectedItem").getKey();
			this.updateGanttChart(sKey);
			this.customData.newData.SettingsData.type = sKey;
			this.getView().byId('variantId').setData(this.customData);
		},

		updateGanttChart: function(sKey) {
			var oGanttChartContainer = this.byId("ganttContainer");
			oGanttChartContainer.removeAllGanttCharts();

			switch (sKey) {
				case "AdhocAndDelta":
					var oOrderAndUnitGantt = this.getGanttInstance("ganttChartAdhoc");
					oGanttChartContainer.addGanttChart(oOrderAndUnitGantt);
					oGanttChartContainer.addGanttChart(this.getGanttInstance("ganttChartDelta"));
					break;
				case "Delta":
					oGanttChartContainer.addGanttChart(this.getGanttInstance("ganttChartDelta"));
					break;
				case "Adhoc":
					var oRequirementGantt = this.getGanttInstance("ganttChartAdhoc");
					oGanttChartContainer.addGanttChart(oRequirementGantt);
					break;
				default:
					return;
			}
		},

		onShow: function(oEvent) {
			var oModel = this.getView().getModel("view");
			this.isShapeVisible = !oModel.getData().isShapeVisible;
			this.updateShapeText();
			oModel.setData({isShapeVisible: this.isShapeVisible}, true);
			this.customData.newData.SettingsData.isShapeVisible = this.isShapeVisible;
			this.getView().byId('variantId').setData(this.customData);
		},

		updateShapeText: function() {
			var sText = this.isShapeVisible ? "Hide Shape" : "Show Shape";
			this.getView().byId("showHideBtn").setText(sText);
		},

		handleExpandShape: function (oEvent) {
			var oTableGantt = this.getView().byId("ganttChartDelta");
			var oTable = oTableGantt.getTable();
			oTable.expandToLevel(1);
            this.customData.newData.SettingsData.collapseRows = true;
			this.getView().byId('variantId').setData(this.customData);
		},

		handleCollapseShape: function (oEvent) {
			var oTableGantt = this.getView().byId("ganttChartDelta");
			var oTable = oTableGantt.getTable();
			oTable.collapseAll();
			this.customData.newData.SettingsData.collapseRows = false;
			this.getView().byId('variantId').setData(this.customData);
		},

		getGanttInstance: function(sId){
			var oView = this.getView();
			var oGantt = oView.byId(sId);
			if (!oGantt) {
				Fragment.load({
					name: "gantt.demo.GanttVariantManagement.fragment." + sId,
					controller: this
				}).then(function (oDialog) {
					oGantt = oDialog;
					return oGantt;
				});
			} else {
				return oGantt;
			}
		},

		onChange: function(oEvent) {
			var oModel = this.getView().getModel("view");
			this.isDescriptionVisible = !oModel.getData().isDescriptionVisible;
			oModel.setData({isDescriptionVisible: this.isDescriptionVisible}, true);
			this.customData.newData.SettingsData.isDescriptionVisible = this.isDescriptionVisible;
			this.getView().byId('variantId').setData(this.customData);
		},

		updateRows: function(bCollapseRows) {
			var oTableGantt = this.getView().byId("ganttChartDelta");
			var oTable = oTableGantt.getTable();
			if (bCollapseRows) {
				oTable.expandToLevel(1);
			} else {
				oTable.expandToLevel(0);
			}
		},

		updateVariantData: function(oChanges, oControl, mPropertyBag) {
			if (oChanges.created === 'not_clicked') {
				oControl.getToolbar().setShowDisplayTypeButton(true);
			}
			var sKey = oChanges.type;
			this.getView().byId("layoutSelect").setSelectedKey(sKey);
			this.updateGanttChart(sKey);
			this.isShapeVisible = oChanges.isShapeVisible;
			this.updateShapeText();
			this.isDescriptionVisible = oChanges.isDescriptionVisible;
			this.getView().getModel("view").setData({
				isShapeVisible: this.isShapeVisible,
				isDescriptionVisible: this.isDescriptionVisible
			}, true);
			var bCollapseRows = oChanges.collapseRows;
			this.updateRows(bCollapseRows);
		},

		onExportPDF: function () {
			var oGantt = this.getView().byId("ganttChartAdhoc");
			this.oGanttPrinting = new GanttPrinting({
				ganttChart: oGantt
			});
			this.oGanttPrinting.setPrintData(new PrintConfig({
				pageConfig: {
					paperHeight: 11,
					paperWidth: 8,
					paperSize: "A3",
					unit: "mm",
					portrait: true,
					showPageNumber: true
				},
				textConfig: {
					showHeaderText: true,
					showFooterText: true,
					headerText: "You can enter header text here.",
					footerText: "You can enter footer text here."
				}
			}));
			this.oGanttPrinting.open();
		},

		onExportSinglePage: function () {
			var oGantt = this.getView().byId("ganttChartAdhoc");
			this.oGanttPrintingSinglePage = new GanttPrinting({
				ganttChart: oGantt
			});
			this.oGanttPrintingSinglePage.setPrintData(new PrintConfig({
				pageConfig: {
					paperHeight: 11,
					paperWidth: 8,
					paperSize: "A2",
					unit: "mm",
					portrait: true,
					showPageNumber: true
				},
				textConfig: {
					showHeaderText: true,
					showFooterText: true,
					headerText: "You can enter header text here.",
					footerText: "You can enter footer text here."
				}
			}));
			this.oGanttPrintingSinglePage.openPdfPreview();
		}
	});
});
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
	"sap/ui/comp/smartvariants/PersonalizableInfo",
	"gantt/demo/GanttCustomVariantManagement/GanttVariantControl",
	"sap/gantt/simple/GanttPrinting",
	"sap/gantt/simple/PrintDialogTemplate",
	"sap/m/Button",
	"sap/gantt/simple/PrintConfig"
], function (Controller, Format, SettingItem, JSONModel, Filter, FilterOperator, Sorter, library, Fragment, Element,
	PersonalizableInfo,GanttVariantControl,GanttPrinting,PrintDialogTemplate,Button,PrintConfig) {
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
			var oToolbar = Element.getElementById("ganttCustomVariantManagementContainer-GanttCustomVariantManagement---MainView--ganttContainerToolbar");
			oToolbar.insertSettingItem(oSettingItem1, 6);
			oToolbar.insertSettingItem(oSettingItem2, 7);
			if (!this.customData) {
                this.createCustomData();
            }
			this.getView().byId('variantId').setDependantControlID(["settings1", "settings2"]);
			this.oCustomVariantData = {};
			this.oSmartVariant = this.getView().byId("__SVM01");
			this.oGanttContainer = oToolbar.getParent();
			this.oGanttVariant = new GanttVariantControl();
			this.oGanttVariant.fnAddPersonalizableControl(this);
		},
		onExportPDF: function () {
			var oGantt = this.getView().byId("ganttChartAdhoc");
			this.oGanttPrinting = new GanttPrinting({
				ganttChart: oGantt
			});
			this._bSinglePage = false;
			this.footerButtons = new PrintDialogTemplate({
				footerButtons: [
					new Button({
						text: "Save",
						press: this.fnOnPrintPress.bind(this)
					})
				]
			});
			if (this.oCustomVariantData.printConfig) {
				var durationConfig = this.oCustomVariantData.printConfig.durationConfig;
				durationConfig.startDate = durationConfig.startDate instanceof Date ? durationConfig.startDate : new Date(durationConfig.startDate);
				durationConfig.endDate = durationConfig.endDate instanceof Date ? durationConfig.endDate : new Date(durationConfig.endDate);
				this.oGanttPrinting.setPrintData(new PrintConfig({
					pageConfig: this.oCustomVariantData.printConfig.pageConfig,
					textConfig: this.oCustomVariantData.printConfig.textConfig,
					marginConfig: this.oCustomVariantData.printConfig.marginConfig,
					durationConfig: durationConfig,
					exportConfig: this.oCustomVariantData.printConfig.exportConfig
				}));
			}
			this.oGanttPrinting.open(null, this.footerButtons);
		},
		onExportSinglePage: function () {
			var oGantt = this.getView().byId("ganttChartAdhoc");
			this.oGanttPrintingSinglePage = new GanttPrinting({
				ganttChart: oGantt
			});
			this._bSinglePage = true;
			this.footerButtons = new PrintDialogTemplate({
				footerButtons: [
					new Button({
						text: "Save",
						press: this.fnOnPrintPress.bind(this)
					})
				]
			});
			if (this.oCustomVariantData.printConfigSinglePage) {
				var durationConfig = this.oCustomVariantData.printConfigSinglePage.durationConfig;
				durationConfig.startDate = durationConfig.startDate instanceof Date ? durationConfig.startDate : new Date(durationConfig.startDate);
				durationConfig.endDate = durationConfig.endDate instanceof Date ? durationConfig.endDate : new Date(durationConfig.endDate);

				this.oGanttPrintingSinglePage.setPrintData(new PrintConfig({
					pageConfig: this.oCustomVariantData.printConfigSinglePage.pageConfig,
					textConfig: this.oCustomVariantData.printConfigSinglePage.textConfig,
					marginConfig: this.oCustomVariantData.printConfigSinglePage.marginConfig,
					durationConfig: durationConfig,
					exportConfig: this.oCustomVariantData.printConfigSinglePage.exportConfig
				}));
			}
			this.oGanttPrintingSinglePage.openPdfPreview(null,this.footerButtons);
		},
		fnOnPrintPress: function (oEvent) {
			this.oSmartVariant.currentVariantSetModified(true); //Print Settings change is part of SVM
			if (!this._bSinglePage){
				this.printConfig = this.oGanttPrinting.getPrintData();
				this.oCustomVariantData.printConfig = {
					pageConfig: this.printConfig.pageConfig,
					textConfig: this.printConfig.textConfig,
					marginConfig: this.printConfig.marginConfig,
					durationConfig: this.printConfig.durationConfig,
					exportConfig: this.printConfig.exportConfig
				};
			} else {
				this.printConfigSinglePage = this.oGanttPrintingSinglePage.getPrintData();
				this.oCustomVariantData.printConfigSinglePage = {
					pageConfig: this.printConfigSinglePage.pageConfig,
					textConfig: this.printConfigSinglePage.textConfig,
					marginConfig: this.printConfigSinglePage.marginConfig,
					durationConfig: this.printConfigSinglePage.durationConfig,
					exportConfig: this.printConfigSinglePage.exportConfig
				};
			}
		},
		createCustomData: function () {
			this.customData = {
				newData: {
					setting1: false,
					setting2: false,
					created: 'not_clicked',
					type: "AdhocAndDelta",
					isShapeVisible: true,
					isDescriptionVisible: true,
					collapseRows: false
				},
				oldData: {
					setting1: false,
					setting2: false,
					created: 'not_clicked',
					type: "AdhocAndDelta",
					isShapeVisible: true,
					isDescriptionVisible: true,
					collapseRows: false
				}
			};
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
			oEvent.getParameters().forEach(function (item) {
				this.customData.newData[item.name] = item.value;
			}.bind(this));
			this.getView().byId('variantId').setData(this.customData);
		},

		// Custom button change
		onCreate: function (oEvent) {
			this.customData.newData['created'] = 'clicked';
			this.getView().byId('variantId').setData(this.customData);
		},

		applyCustomData: function (oChange, oControl, mPropertyBag) {
			var oContent = oChange.getContent();
			this.updateVariantData(oContent.newData, oControl, mPropertyBag);
			if (!this.customData) {
                this.createCustomData();
            }
			for (var sItem in oContent.newData) {
                this.customData.newData[sItem] =  oContent.newData[sItem];
            }
		},

		revertCustomData: function (oChange, oControl, mPropertyBag) {
			var oContent = oChange.getContent();
			this.updateVariantData(oContent.oldData, oControl, mPropertyBag);
			if (!this.customData) {
                this.createCustomData();
            }
			for (var sItem in oContent.oldData) {
                this.customData.oldData[sItem] =  oContent.oldData[sItem];
            }
		},

		onLayoutChange: function(oEvent){
			var sKey = oEvent.getParameter("selectedItem").getKey();
			this.updateGanttChart(sKey);
			this.customData.newData.type = sKey;
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
			this.customData.newData.isShapeVisible = this.isShapeVisible;
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
            this.customData.newData.collapseRows = true;
			this.getView().byId('variantId').setData(this.customData);
		},

		handleCollapseShape: function (oEvent) {
			var oTableGantt = this.getView().byId("ganttChartDelta");
			var oTable = oTableGantt.getTable();
			oTable.collapseAll();
			this.customData.newData.collapseRows = false;
			this.getView().byId('variantId').setData(this.customData);
		},

		getGanttInstance: function(sId){
			var oView = this.getView();
			var oGantt = oView.byId(sId);
			if (!oGantt) {
				Fragment.load({
					name: "gantt.demo.GanttCustomVariantManagement.fragment." + sId,
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
			this.updateDescText();
			oModel.setData({isDescriptionVisible: this.isDescriptionVisible}, true);
			this.customData.newData.isDescriptionVisible = this.isDescriptionVisible;
			this.getView().byId('variantId').setData(this.customData);
		},

		updateDescText: function() {
			var sText = this.isDescriptionVisible ? "Hide Description" : "Show Description";
			this.getView().byId("descBtn").setText(sText);
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
			this.updateDescText();
			this.getView().getModel("view").setData({
				isShapeVisible: this.isShapeVisible,
				isDescriptionVisible: this.isDescriptionVisible
			}, true);
			var bCollapseRows = oChanges.collapseRows;
			this.updateRows(bCollapseRows);
		}
	});
});
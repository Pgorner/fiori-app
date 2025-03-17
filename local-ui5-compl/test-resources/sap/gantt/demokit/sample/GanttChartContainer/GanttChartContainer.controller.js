sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/sample/GanttChartContainer/localService/mockserver",
	"sap/gantt/sample/GanttChartContainer/model/formatter",
	"sap/gantt/misc/Utility",
	"sap/ui/core/Fragment"
], function(Controller, JSONModel, mockserver, formatter, Utility, Fragment) {
	"use strict";


	return Controller.extend("sap.gantt.sample.GanttChartContainer.GanttChartContainer", {

		formatter: formatter,

		onInit: function(){

			var oDataModel = this.getView().getModel("data");
			var aDeferredGroups = oDataModel.getDeferredGroups();
			aDeferredGroups = aDeferredGroups.concat(["deferred"]);
			oDataModel.setDeferredGroups(aDeferredGroups);

			this.iNewFOCount = 0;
			var oGantt1 = this.getView().byId("FreightOrderAndFreightUnit");
			var oFullScreenButton1 =  new sap.m.Button({
				icon: "sap-icon://full-screen",
				type: "Transparent",
				press: function () {
					this.onToggleFullScreen(oGantt1, false, oFullScreenButton1);
				}.bind(this)
			});
			oGantt1.addEventDelegate({onAfterRendering: function() {
				var oGanttOverflowToolbar = oGantt1.getChartOverflowToolbar();
				if (oGanttOverflowToolbar) {
					oGanttOverflowToolbar.addContent(oFullScreenButton1);
				}
			}});

			var oGantt2 = this.getView().byId("Truck");
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
		},

		onToggleFullScreen: function(oGantt, bShowToolbar, oButton) {
			oGantt.toggleFullScreen(bShowToolbar, oButton);
			if (oGantt.fullScreenMode()) {
				oButton.setIcon("sap-icon://exit-full-screen");
				this.getView().byId("layoutSelect").setVisible(false);
			} else {
				oButton.setIcon("sap-icon://full-screen");
				this.getView().byId("layoutSelect").setVisible(true);
			}
		},

		onShapeDrop: function(oEvent) {
			var oSourceGantt = oEvent.getSource();
			var oNewDateTime = oEvent.getParameter("newDateTime");
			var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
			var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");

			var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
			var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
			var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
			if (oSourceGantt.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
				iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
			}

			var getBindingContextPath = function (sShapeUid) {
				var oParsedUid = Utility.parseUid(sShapeUid);
				return oParsedUid.shapeDataName;
			};

			var oTargetRow = oEvent.getParameter("targetRow");
			var oTargetObject = oTargetRow.getBindingContext("data").getObject();
			var sTargetObjectType = oTargetObject.Type;

			var oDataModel = oSourceGantt.getModel("data");
			var that = this;

			Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
				var sPath = getBindingContextPath(sShapeUid);
				var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
				var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
				var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
				var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);

				var oData = oDataModel.getObject(sPath);

				var sType = oDataModel.getProperty(sPath + "/Type");

				if (sTargetObjectType == "Truck"){
					if (sType == "FO") {
						that.handleMoveFreightOrderToTruck(oNewDateTime, oNewEndDateTime, oTargetObject, sPath, oDataModel, iMoveWidthInMs);
					} else if (sType == "FU") {
						if (oData.PlanStatus == "unplanned"){
							that.handleMoveFreightUnitToTruck(oNewDateTime, oNewEndDateTime, oTargetObject, sPath, oDataModel);
						}
					}
				}
			});
		},

		handleMoveFreightUnitToTruck: function(oTime, oEndTime, oTargetObject, sPath, oModel){
			var oData = oModel.getObject(sPath);

			var sTargetResourceId = oTargetObject.ResourceID;
			this.iNewFOCount++;
			var sNewFOId = "$" + this.iNewFOCount;

			oData.ParentRequirementID = sNewFOId;
			oData.ResourceID = sTargetResourceId;
			oData.StartTime = oTime;
			oData.EndTime = oEndTime;
			oData.HierarchyLevel = 1;
			oData.PlanStatus = "planned";

			var oFreightOrderData = {
				"RequirementID"       : sNewFOId,
				"ResourceID"          : sTargetResourceId,
				"Type"                : "FO",
				"PlanStatus"          : "planned",
				"StartTime"           : oTime,
				"EndTime"             : oEndTime,
				"SourceLocation"      : oData.SourceLocation,
				"DestinationLocation" : oData.DestinationLocation,
				"ParentResourceID"    : sTargetResourceId,
				"ParentRequirementID" : null,
				"HierarchyLevel"      : 0,
				"DrillState"          : "expanded"
			};

			oModel.create("/Requirements", oFreightOrderData);

			var mParameters = {
				success: function(oData) {
					mockserver.refreshResource(oModel, sTargetResourceId);
				},
				refreshAfterChange : false
			};
			oModel.update(sPath, oData, mParameters);
		},

		handleMoveFreightOrderToTruck: function(oTime, oEndTime, oTargetObject, sPath, oModel, iMoveWidthInMs){
			var oData = oModel.getObject(sPath);
			var sCurrentResourceID = oData.ResourceID;
			var sTargetResourceID = oTargetObject.ResourceID;

			if (sCurrentResourceID !== sTargetResourceID){
				oData.StartTime = oTime;
				oData.EndTime = oEndTime;
				oData.PlanStatus = "planned";
				oData.ResourceID = sTargetResourceID;
				oData.ParentResourceID = sTargetResourceID;

				var mParameters = {
					success: function(oData) {
						oModel.read("/Resources('" + sTargetResourceID + "')", {
							urlParameters: {
								"$expand": "ResourceToRequirements"
							}
						});
					},
					refreshAfterChange : false
				};
				oModel.update(sPath, oData, mParameters);
			} else {
				oModel.setProperty(sPath + "/StartTime", oTime, true);
				oModel.setProperty(sPath + "/EndTime", oEndTime, true);
			}

			oModel.read('/Requirements', {
				success: function(oData){
					var aResult = oData.results;
					aResult.forEach(function(oNode){
						var sUnitPath = "/Requirements('" + oNode.RequirementID + "')";
						oModel.setProperty(sUnitPath + "/StartTime", oTime, true);
						oModel.setProperty(sUnitPath + "/EndTime", oEndTime, true);
					});

				},
				error: function(){

				},
				urlParameters: {
					"$filter": "ParentRequirementID eq " + oData.RequirementID
				}
			});


			oModel.read('/UtilizationItems', {
				success: function(oItemData){
					var aResult = oItemData.results;
					aResult.forEach(function(oItem){
						var sUnitPath = "/UtilizationItems('" + oItem.UtilItemID + "')";
						var oOldStartDateTime = oItem.StartTime;
						var oOldEndDateTime = oItem.EndTime;
						var oNewStartTime = new Date(oOldStartDateTime.getTime() + iMoveWidthInMs);
						var oNewEndTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
						var oData = {
							StartTime: oNewStartTime,
							EndTime: oNewEndTime
						};

						oModel.update(sUnitPath, oData);
					});

				},
				error: function(){

				},
				urlParameters: {
					"$filter": "RootRequirementID eq " + oData.RequirementID
				}
			});

		},

		onLayoutChange: function(oEvent){
			var oGanttChartContainer = this.byId("container");
			oGanttChartContainer.removeAllGanttCharts();
			var legendContainer = oGanttChartContainer.getToolbar().getLegendContainer();
			var sKey = oEvent.getParameter("selectedItem").getKey();
			switch (sKey) {
				case "ReqAndRes":
					legendContainer.getLegends()[0].setProperty("visible", true, true);
					legendContainer.getLegends()[0].getItems()[1].setProperty("visible", true, true);
					legendContainer.getLegends()[1].setProperty("visible", true, true);
					this.getGanttInstance("FreightOrderAndFreightUnit", "ReqAndRes", oGanttChartContainer);
					break;
				case "Resource":
					legendContainer.getLegends()[0].getItems()[1].setProperty("visible", false, true);
					legendContainer.getLegends()[1].setProperty("visible", true, true);
					this.getGanttInstance("Truck", "Resource", oGanttChartContainer);
					break;
				case "Requirement":
					legendContainer.getLegends()[0].setProperty("visible", true, true);
					legendContainer.getLegends()[0].getItems()[1].setProperty("visible", true, true);
					legendContainer.getLegends()[1].setProperty("visible", false, true);
					this.getGanttInstance("FreightOrderAndFreightUnit","Requirement", oGanttChartContainer);
					break;
				default:
					return;
			}
		},

		onHierarchyChange: function(oEvent){
			var oGanttChartContainer = this.byId("container");
			oGanttChartContainer.removeGanttChart(0);

			var sKey = oEvent.getParameter("selectedItem").getKey();

			switch (sKey) {
				case "FOFU":
					this.getGanttInstance("FreightOrderAndFreightUnit", "HeirarchyChange", oGanttChartContainer);
					break;
				case "FO":
					this.getGanttInstance("FreightOrder", "HeirarchyChange", oGanttChartContainer);
					break;
				case "FU":
					this.getGanttInstance("FreightUnit", "HeirarchyChange" ,oGanttChartContainer);
					break;
				default:
					return;
			}
		},

		getGanttInstance: function(sId, sKey, oGanttChartContainer){
			var oView = this.getView();
			var oGantt = oView.byId(sId);
			if (!oGantt) {
				if (sId == "FreightOrderAndFreightUnit" && this.oFofuGantt) {
					oGanttChartContainer.insertGanttChart(this.oFofuGantt, 0);
				} else if (sId == "FreightOrder" && this.oFoGantt){
					oGanttChartContainer.insertGanttChart(this.oFoGantt, 0);
				} else if (sId == "FreightUnit" && this.oFuGantt){
					oGanttChartContainer.insertGanttChart(this.oFuGantt, 0);
				}
				Fragment.load({
					name: "sap.gantt.sample.GanttChartContainer.view." + sId,
					type: "XML",
					controller: this
				}).then(function(oGantt){
					this._loadGanttChart(sKey, sId, true, oGanttChartContainer, oGantt);
				}.bind(this));
			} else {
				 this._loadGanttChart(sKey, sId, false, oGanttChartContainer, oGantt);
			}
		},

		_loadGanttChart: function (sKey, sId, bisLoad, oGanttChartContainer, oGantt) {
			switch (sKey) {
				case "HeirarchyChange":
					if (bisLoad) {
						if (sId == "FreightOrderAndFreightUnit"){
							this.oFofuGantt = oGantt;
						} else if (sId == "FreightOrder") {
							this.oFoGantt = oGantt;
						} else if (sId == "FreightUnit"){
							this.oFuGantt = oGantt;
						}
					}
					oGanttChartContainer.insertGanttChart(oGantt, 0);
					break;
				case "ReqAndRes":
					oGanttChartContainer.addGanttChart(oGantt);
					this.getGanttInstance("Truck", "Resource", oGanttChartContainer);
					break;
				case "Resource":
					oGanttChartContainer.addGanttChart(oGantt);
					break;
				case "Requirement":
					oGanttChartContainer.addGanttChart(oGantt);
					break;
				default:
					return oGantt;
			}
		},
		_getOrderCreationDialog: function(bisOpen) {
			if (!this._oDialog) {
				Fragment.load({
					name: "sap.gantt.sample.GanttChartContainer.view.OrderCreate",
					type: "XML",
					controller: this
				}).then(function(_oDialog){
					this._oDialog = _oDialog;
					_oDialog.setModel(new JSONModel(), "order");
					this.getView().addDependent(_oDialog);
					_oDialog.open();
				}.bind(this));
			} else if (bisOpen) {
					this._oDialog.open();
				} else {
					this._oDialog.close();
				}
		},

		_getDetailPopover: function(oShape, oEvent) {
			this.iPopoverOffsetX = oEvent.getParameter("popoverOffsetX");
			if (!this._oPopover) {
				Fragment.load({
					name: "sap.gantt.sample.GanttChartContainer.view.DetailPopover",
					type: "XML"
				}).then(function(oPopover){
					this._oPopover = oPopover;
					this._oPopover.setModel(new JSONModel(), "popover");
					this.getView().addDependent(this._oPopover);
					this._oPopover.getModel("popover").setData({
						RequirementID       : oShape.getShapeId(),
						SourceLocation      : "Beijing",
						DestinationLocation : "Shanghai",
						DepartureDate       : oShape.getTime(),
						ArrivalDate         : oShape.getEndTime()
					});
					this._oPopover.setOffsetX(this.iPopoverOffsetX).openBy(oShape);
				}.bind(this));

			} else {
				this._oPopover.setOffsetX(this.iPopoverOffsetX).openBy(oShape);
			}
		},

		onCreate: function(oEvent){
			this._getOrderCreationDialog(true);
		},

		onConfirmCreateFreightOrder: function(oEvent){
			var oDataModel = this.getView().getModel("data");
			this.iNewFOCount++;
			var sNewFOId = "$" + this.iNewFOCount;
			var oOrderData = this._oDialog.getModel("order").getData();

			var oFreightOrderData = {
				"RequirementID"       : sNewFOId,
				"ResourceID"          : oOrderData.Truck,
				"Type"                : "FO",
				"PlanStatus"          : "planned",
				"StartTime"           : oOrderData.DepartureDate,
				"EndTime"             : oOrderData.ArriveDate ,
				"SourceLocation"      : oOrderData.SourceLocation,
				"DestinationLocation" : oOrderData.DestinationLocation,
				"ParentResourceID"    : oOrderData.Truck,
				"ParentRequirementID" : null,
				"HierarchyLevel"      : 0,
				"DrillState"          : "leaf"
			};

			var oController = this;
			var mParameters = {
				success: function(oData) {
					mockserver.refreshResource(oDataModel, oOrderData.Truck, function(){
						sap.m.MessageToast.show("Freight Order is created successfully");
						oController._getOrderCreationDialog(false);
					});
				},
				error: function(oData) {
					sap.m.MessageToast.show("Error when creating frieght order");
				},
				refreshAfterChange : false
			};
			oDataModel.create("/Requirements", oFreightOrderData, mParameters);
		},

		onDialogClose: function(){
			this._getOrderCreationDialog(false);
		},

		onDelete: function(oEvent){
			var oControl = oEvent.getSource();
			while (!(oControl instanceof sap.gantt.simple.GanttChartWithTable)){
				oControl = oControl.getParent();
			}
			var oDataModel = oControl.getModel("data");
			var aUid = oControl.getSelectedShapeUid();
			aUid.forEach(function(sShapeUid){
				var o = Utility.parseUid(sShapeUid);
				var sPath  = o.shapeDataName;
				var mParameters = {
					success: function() {
						sap.m.MessageToast.show("Freight Order is deleted");
					}
				};
				oDataModel.remove(sPath, mParameters);
			});
		},

		onOrderRescheduled: function(oEvent) {

			var oTableGantt = oEvent.getSource(),
				oDataModel = oTableGantt.getModel("data");

			var oShape = oEvent.getParameter("shape"),
				aNewTime = oEvent.getParameter("newTime"),
				sBindingPath = oShape.getBindingContext("data").getPath();

			oDataModel.setProperty(sBindingPath + "/StartTime", aNewTime[0], true);
			oDataModel.setProperty(sBindingPath + "/EndTime", aNewTime[1], true);
		},

		onShapeDoubleClick: function(oEvent) {
			var oShape = oEvent.getParameter("shape");

			if (oShape) {
				this._getDetailPopover(oShape, oEvent);
			}
		},

		onViewDocument: function(oEvent) {
			sap.m.MessageToast.show("Opening Document ...");
		},

		showUtilization: function(){
			var oGanttChartContainer = this.byId("container");
			var aGantts = oGanttChartContainer.getGanttCharts();
			aGantts.forEach(function(oGantt) {
				if (oGantt.getId().endsWith("Truck")) {
					oGantt.expand("truck_to_ulc", oGantt.getTable().getSelectedIndices()[0]);
				}
			});
		},

		hideUtilization: function(){
			var oGanttChartContainer = this.byId("container");
			var aGantts = oGanttChartContainer.getGanttCharts();
			aGantts.forEach(function(oGantt) {
				if (oGantt.getId().endsWith("Truck")) {
					oGantt.collapse("truck_to_ulc", oGantt.getTable().getSelectedIndices()[0]);
				}
			});
		},
		onLegendItemInteractiveChange: function(oEvent){
			sap.m.MessageToast.show("Legend Item interactive value changed on shape: " + oEvent.getParameter("legendName"));
		},
		onGanttSidePanel: function(oEvent) {
			oEvent.getParameters().updateSidePanelState.enable();
		}
	});
});

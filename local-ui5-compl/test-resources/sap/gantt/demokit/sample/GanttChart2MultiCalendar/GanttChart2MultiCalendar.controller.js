sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/AdhocLine",
	"sap/gantt/misc/Utility"
], function (Controller, MockServer, ODataModel, Relationship, AdhocLine, Utility) {
	"use strict";

	return Controller.extend("sap.gantt.sample.GanttChart2MultiCalendar.GanttChart2MultiCalendar", {
		onInit: function() {
			var oViewModel = new sap.ui.model.json.JSONModel({
				alert: false
			});
			this.getView().setModel(oViewModel, "oViewModel");
		},

		onShapeDrop: function(oEvent) {
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

		onShapeResize: function(oEvent) {
				var oShape = oEvent.getParameter("shape");
				var aNewTime = oEvent.getParameter("newTime");
				var sBindingPath = oShape.getBindingContext("data").getPath();
				var oTableGantt = this.getView().byId("gantt1");
				var oDataModel = oTableGantt.getModel("data");
				oDataModel.setProperty(sBindingPath + "/StartDate", aNewTime[0], true);
				oDataModel.setProperty(sBindingPath + "/EndDate", aNewTime[1], true);
		},

		onShapePress: function(oEvent){
			var oShape = oEvent.getParameter('shape');
			var oGantt = this.getView().byId("gantt1");
			var oContainer = oGantt.getParent();
			if (oShape){
				oContainer.setProperty("statusMessage",oShape.getTitle());
			} else {
				oContainer.setProperty("statusMessage","");
			}
		},

		handleExpandShape: function (oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var oTable = oTableGantt.getTable();
			var aSelectedRows = oTable.getSelectedIndices();
			oTable.expand(aSelectedRows);
		},

		handleCollapseShape: function (oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var oTable = oTableGantt.getTable();
			var aSelectedRows = oTable.getSelectedIndices();
			oTable.collapse(aSelectedRows);
		},

		handleAdhocLineTimeChange: function(oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			oTableGantt.addSimpleAdhocLine(new AdhocLine({
				stroke: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
				strokeDasharray: "5, 1",
				timeStamp: oEvent.getParameter("value"),
				description: "Adhoc line description"
			}));
		}
	});
});

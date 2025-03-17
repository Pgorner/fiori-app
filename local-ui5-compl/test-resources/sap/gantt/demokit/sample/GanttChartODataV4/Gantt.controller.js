sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/gantt/misc/Utility",
	"sap/gantt/simple/Relationship",
	"sap/ui/core/Element"
], function (Controller,Utility,Relationship, Element) {
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
			var sType = sap.gantt.simple.RelationshipType[oItem.getText()];
			var sBindingPath = oShape.getBindingContext().getPath();
			if (oItem.getText() === "Delete") {
				oShape.getBindingContext().setProperty(sBindingPath + "/SuccTaskID", null);
				oShape.getBindingContext().setProperty(sBindingPath + "/PredTaskID", null);

			} else {
				oShape.getBindingContext().setProperty(sBindingPath + "/RelationType", sType);
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

	return Controller.extend("sap.gantt.sample.GanttChartODataV4.Gantt", {

		onShapeDrop: function(oEvent) {
			var oTableGantt = this.getView().byId("gantt1");
			var oNewDateTime = oEvent.getParameter("newDateTime");
			var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");
			var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
			var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
			var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
			var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
			if (oTableGantt.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
				iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
			}
			Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
				var fnParseUid = Utility.parseUid;
				var sShapeId = fnParseUid(sShapeUid).shapeId;
				var oShape = Element.getElementById(document.querySelectorAll('[data-sap-gantt-shape-id=' + '"' + sShapeId + '"' + ']')[0].id);
				var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
				var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
				var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
				var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
				var sBindingPath = oShape.getBindingContext().getPath();
				oShape.getBindingContext().setProperty(sBindingPath + "/StartDate", oNewDateTime.toISOString().split('.')[0]);
				oShape.getBindingContext().setProperty(sBindingPath + "/EndDate", oNewEndDateTime.toISOString().split('.')[0]);
			});
		},
		onShapeResize: function(oEvent) {
			var oShape = oEvent.getParameter("shape");
			var aNewTime = oEvent.getParameter("newTime");
			var sBindingPath = oShape.getBindingContext().getPath();
			oShape.getBindingContext().setProperty(sBindingPath + "/StartDate", aNewTime[0].toISOString().split('.')[0]);
			oShape.getBindingContext().setProperty(sBindingPath + "/EndDate", aNewTime[1].toISOString().split('.')[0]);
		},
		onShapeContextMenu: function(oEvent) {
			var oShape = oEvent.getParameter("shape");
			var iPageX = oEvent.getParameter("pageX");
			var iPageY = oEvent.getParameter("pageY");

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
			}
		},
		onShapeConnect: function(oEvent) {
			var sFromShapeUid = oEvent.getParameter("fromShapeUid");
			var sToShapeUid = oEvent.getParameter("toShapeUid");
			var fnParseUid = Utility.parseUid;
			var sShapeFromId = fnParseUid(sFromShapeUid).shapeId;
			var sShapeToId = fnParseUid(sToShapeUid).shapeId;
			var iType = oEvent.getParameter("type");
			var sFromShape = Element.getElementById(document.querySelectorAll('[data-sap-gantt-shape-id=' + '"' + sShapeFromId + '"' + ']')[0].id);
			var sToShape = Element.getElementById(document.querySelectorAll('[data-sap-gantt-shape-id=' + '"' + sShapeToId + '"' + ']')[0].id);
			var sBindingPath = sFromShape.getBindingContext().getPath();
			sFromShape.getBindingContext().setProperty(sBindingPath + "/RelationType", iType);
			sFromShape.getBindingContext().setProperty(sBindingPath + "/PredTaskID", sShapeFromId);
			sToShape.getBindingContext().setProperty(sBindingPath + "/SuccTaskID", sShapeToId);

		}
	});
});

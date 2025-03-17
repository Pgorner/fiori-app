sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/gantt/simple/Relationship",
	"sap/gantt/misc/Utility",
	"sap/ui/core/Core",
	"sap/gantt/library",
	"sap/gantt/misc/Format",
	"sap/ui/core/library"
], function (Controller, Relationship, Utility, Core, GanttLibrary, Format, CoreLibrary) {
	"use strict";

	var TimeUnit = GanttLibrary.config.TimeUnit;
	var ValueState = CoreLibrary.ValueState;
	var oTimeLineOptions = {
		"OneHour": {
			innerInterval: {
				unit: TimeUnit.hour,
				span: 1,
				range: 45
			},
			largeInterval: {
				unit: TimeUnit.day,
				span: 1,
				pattern: "E, dd.MM.YYYY"
			},
			smallInterval: {
				unit: TimeUnit.hour,
				span: 1,
				pattern: "HH:mm"
			}
		},
		"TwelveHours": {
			innerInterval: {
				unit: TimeUnit.hour,
				span: 12,
				range: 64
			},
			largeInterval: {
				unit: TimeUnit.day,
				span: 1,
				pattern: "E, dd.MM.YYYY"
			},
			smallInterval: {
				unit: TimeUnit.hour,
				span: 12,
				pattern: "HH:mm"
			}
		},
		"OneDay": {
			innerInterval: {
				unit: TimeUnit.day,
				span: 1,
				range: 60
			},
			largeInterval: {
				unit: TimeUnit.month,
				span: 1,
				pattern: "LLLL YYYY"
			},
			smallInterval: {
				unit: TimeUnit.day,
				span: 1,
				pattern: "E, dd"
			}
		},
		"WeekOfYear": {
			innerInterval: {
				unit: TimeUnit.week,
				span: 1,
				range: 32
			},
			largeInterval: {
				unit: TimeUnit.month,
				span: 1,
				pattern: "LLL yyyy "
			},
			smallInterval: {
				unit: TimeUnit.week,
				span: 1,
				pattern: "ww "
			}
		},
		"OneMonth": {
			innerInterval: {
				unit: TimeUnit.month,
				span: 1,
				range: 60
			},
			largeInterval: {
				unit: TimeUnit.year,
				span: 1,
				format: "YYYY"
			},
			smallInterval: {
				unit: TimeUnit.month,
				span: 1,
				pattern: "LLL"
			}
		}
	};

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
				oDataModel.remove("/Relationships('" + sShapeId + "-1')", {
					refreshAfterChange: false
				});

			} else {
				var sType = sap.gantt.simple.RelationshipType[oItem.getText()];
				oDataModel.setProperty("/Relationships('" + sShapeId + "-1')/RelationType", sType, true);
			}
			oContextMenu.close();
		},
		closed: function (oEvent) {
			var clearIcon = function (oParent) {
				oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
			};

			clearIcon(oContextMenu.getItems()[1]);
		}
	});

	var oConnectorsList = new sap.m.Menu({
		items: [],
		itemSelected: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var oShapeUid = oItem.getKey();
			var oGantt = oEvent.getSource().oGanttChartWithTable;
			oGantt.setSelectedShapeUid([oShapeUid]);
			oContextMenu.close();
		}
	});

	const intervals = [{
		start: "201609140000000",
		end: "201609160000000",
		state: ValueState.Information
	}, {
		start: "201609210000000",
		end: "201609230000000",
		state: ValueState.Information
	}, {
		start: "201609280000000",
		end: "201609291200000",
		state: ValueState.Information
	}, {
		start: "201610020000000",
		end: "201610170000000",
		state: ValueState.Information
	}];

	return Controller.extend("sap.gantt.sample.GanttChart2Relationship.GanttChart2Relationship", {
		onInit: function () {
			this.oModel = new sap.ui.model.json.JSONModel();
			this.oModel.setData({
				intervals: intervals.map((value) => {
					return {
						startDate: Format.abapTimestampToDate(value.start),
						endDate: Format.abapTimestampToDate(value.end),
						valueState: value.state
					};
				}),
				patterns: intervals.filter((value) => value.start && value.end).map((value) => {
					return {
						startDate: Format.abapTimestampToDate(value.start),
						endDate: Format.abapTimestampToDate(value.end)
					};
				}),
				enabled: true,
				tHorizonStart: Format.abapTimestampToDate("20160501000000"),
				tHorizonEnd: Format.abapTimestampToDate("20170901000000")
			});
			this.getView().setModel(this.oModel);
			var oViewModel = new sap.ui.model.json.JSONModel({
				alert: false
			});
			this.getView().setModel(oViewModel, "oViewModel");
			var oZoomStrategy = this.getView().byId("zoomStrategy");
			oZoomStrategy.setTimeLineOptions(oTimeLineOptions);
			oZoomStrategy.setTimeLineOption(oTimeLineOptions["OneDay"]);
		},
		handleChange: function (oEvent) {
			var sFrom = oEvent.getParameter("from"),
				sTo = oEvent.getParameter("to"),
				bValid = oEvent.getParameter("valid"),
				oEventSource = oEvent.getSource();
			if (bValid) {
				oEventSource.setValueState(ValueState.None);
				if (sFrom && sTo) {
					oEventSource.setValueState(ValueState.Information);
				}
			} else {
				oEventSource.setValueState(ValueState.Error);
			}
			var aIntervals = this.oModel.getProperty("/intervals").filter((value) => value.startDate && value.endDate);
			this.oModel.setProperty("/patterns", aIntervals);
		},
		dateToAbapTimestamp: function (oTime) {
			return Format.dateToAbapTimestamp(oTime);
		},
		resetTime: function (oTime) {
			if (oTime) {
				oTime.setHours(0, 0, 0, 0);
			}
			return oTime;
		},
		calendarVisible: function (bHideEnabled) {
			return !bHideEnabled;
		},
		onShapeConnectorList: function (oEvent) {
			oConnectorsList.destroyItems();
			var iPageX = oEvent.getParameter("pageX"),
				iPageY = oEvent.getParameter("pageY"),
				relList = oEvent.getParameter("connectorList");
			oConnectorsList.oGanttChartWithTable = oEvent.getSource();
			oConnectorsList.oGanttChartWithTable.getSelection().clear(true);
			if (relList.length > 1) {
				var predecessorTitle, successorTitle, i, relText;
				var oPlaceHolder = new sap.m.Label(),
					oPopup = new sap.ui.core.Popup(oPlaceHolder, false, true, false),
					eDock = sap.ui.core.Popup.Dock,
					sOffset = (iPageX + 1) + " " + (iPageY + 1);
				for (i = 0; i < relList.length; i++) {
					predecessorTitle = Core.byId(document.querySelectorAll("[data-sap-gantt-shape-id=" + relList[i].getPredecessor() + "]")[0].id).getTitle();
					successorTitle = Core.byId(document.querySelectorAll("[data-sap-gantt-shape-id=" + relList[i].getSuccessor() + "]")[0].id).getTitle();
					relText = predecessorTitle + " -> " + successorTitle;
					oConnectorsList.insertItem(new sap.m.MenuItem({ text: relText, key: relList[i].getShapeUid(), tooltip: relText }), i);
				}
				oPopup.open(0, eDock.BeginTop, eDock.LeftTop, null, sOffset);
				oConnectorsList.openBy(oPlaceHolder);
			} else {
				var oShapeUid = relList[0].getShapeUid();
				oConnectorsList.oGanttChartWithTable.setSelectedShapeUid([oShapeUid]);
			}
		},

		onShapeDrop: function (oEvent) {
			var oTableGantt = this.getView().byId("gantt");
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

		onShapeResize: function (oEvent) {
			var oShape = oEvent.getParameter("shape");
			var aNewTime = oEvent.getParameter("newTime");
			var sBindingPath = oShape.getBindingContext("data").getPath();
			var oTableGantt = this.getView().byId("gantt");
			var oDataModel = oTableGantt.getModel("data");
			oDataModel.setProperty(sBindingPath + "/StartDate", aNewTime[0], true);
			oDataModel.setProperty(sBindingPath + "/EndDate", aNewTime[1], true);
		},

		onDeltaResize: function (oEvent) {
			var oDeltaline = oEvent.getSource();
			var newStartTime = oEvent.getParameter("newTimeStamp");
			var newEndTime = oEvent.getParameter("newEndTimeStamp");
			oDeltaline.setTimeStamp(newStartTime);
			oDeltaline.setEndTimeStamp(newEndTime);
		},

		onShapeContextMenu: function (oEvent) {
			var oShape = oEvent.getParameter("shape");
			var iPageX = oEvent.getParameter("pageX");
			var iPageY = oEvent.getParameter("pageY");

			if (oShape instanceof Relationship) {
				var sType = oShape.getType();
				oContextMenu.getItems()[1].getItems().filter(function (item) { return item.getText() == sType; })[0].setIcon("sap-icon://accept");
				// oContextMenu.getItems()[1].getItems()[iType].setIcon("sap-icon://accept");
				oContextMenu.selectedShape = oShape;
				var oPlaceHolder = new sap.m.Label();
				var oPopup = new sap.ui.core.Popup(oPlaceHolder, false, true, false);
				var eDock = sap.ui.core.Popup.Dock;
				var sOffset = (iPageX + 1) + " " + (iPageY + 1);
				oPopup.open(0, eDock.BeginTop, eDock.LeftTop, null, sOffset);
				oContextMenu.openBy(oPlaceHolder);
			}
		},
		onShapePress: function (oEvent) {
			var oShape = oEvent.getParameter('shape');
			var oGantt = this.getView().byId("gantt");
			var oContainer = oGantt.getParent();
			if (oShape) {
				oContainer.setStatusMessage(oShape.getTitle());
			} else {
				oContainer.setStatusMessage("");
			}
		},

		onShapeConnect: function (oEvent) {
			var oTableGantt = this.getView().byId("gantt");
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

			var sRelationshipID = "rls-temp-" + new Date().getTime();
			var oNewRelationship = {
				"ObjectID": sRelationshipID + "-1",
				"RelationID": sRelationshipID,
				"ParentObjectID": sRowId,
				"PredecTaskID": sShapeId,
				"SuccTaskID": fnParseUid(sToShapeUid).shapeId,
				"RelationType": iType
			};
			oDataModel.create('/Relationships', oNewRelationship, mParameters);
			// oDataModel.submitChanges();
		}
	});
});

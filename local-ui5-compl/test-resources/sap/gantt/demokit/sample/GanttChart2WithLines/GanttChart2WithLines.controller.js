sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/gantt/simple/Relationship",
    "sap/gantt/simple/AdhocLine",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/library",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/Text",
    "sap/m/CheckBox",
    "sap/ui/core/Popup",
    "sap/ui/core/theming/Parameters",
    "sap/m/Popover",
    "sap/gantt/misc/Utility",
    "sap/ui/core/Element"
    ], function (Controller, JSONModel, Relationship, AdhocLine, MessageToast, Dialog, Button, Label, mobileLibrary, Menu, MenuItem, Text, CheckBox, Popup, Parameters, Popover, Utility, Element) {
    "use strict";

    var ButtonType = mobileLibrary.ButtonType,
        DialogType = mobileLibrary.DialogType;

    var oContextMenu = new Menu({
        items: [
            new MenuItem({
                text: "Delete",
                icon: ""
            }),
            new MenuItem({
                text: "Edit Relationship Type",
                items: [
                    new MenuItem({
                        text: "FinishToFinish"
                    }),
                    new MenuItem({
                        text: "FinishToStart"
                    }),
                    new MenuItem({
                        text: "StartToFinish"
                    }),
                    new MenuItem({
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
                oDataModel.remove("/Relationships('" + sShapeId + "-2')", {
                    refreshAfterChange: false
                });

            } else {
                var sType = sap.gantt.simple.RelationshipType[oItem.getText()];
                oDataModel.setProperty("/Relationships('" + sShapeId + "-1')/RelationType", sType, true);
                oDataModel.setProperty("/Relationships('" + sShapeId + "-2')/RelationType", sType, true);
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

    return Controller.extend("sap.gantt.sample.GanttChart2WithLines.GanttChart2WithLines", {
        onInit: function() {
			var oViewModel = new JSONModel({
				alert: false
			});
			this.getView().setModel(oViewModel, "oViewModel");
		},

        onAfterRendering: function () {
            var oTableGantt = this.getView().byId("gantt1");
            this.oAlertCheckbox = new CheckBox('alert', {
                text: 'Alert',
                enabled: true,
                select: this.onAlertClicked.bind(this)
            });
            this.oDeltaCheckbox = new CheckBox('deltaLinesVisibility', {
                text: 'DeltaLinesVisible',
                enabled: true,
                select: this.onDeltaCheckBoxClicked.bind(this)
            });
            oTableGantt.addEventDelegate({onAfterRendering: function() {
                var oGanttOverflowToolbar = oTableGantt.getChartOverflowToolbar();
                if (oGanttOverflowToolbar) {
                    oGanttOverflowToolbar.addContent(this.oAlertCheckbox);
                    oGanttOverflowToolbar.addContent(this.oDeltaCheckbox);
                }
            }.bind(this)});
            this.onDeltaCheckBoxClicked();
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

        onAdhoclineDrop: function(oEvent) {
            var oAdhocLine = oEvent.getSource();
            var newTimeStamp = oEvent.getParameter("newTimeStamp");
            oAdhocLine.setTimeStamp(newTimeStamp);

        },

        onDeltalineDrop: function(oEvent) {
            var oDeltaline = oEvent.getSource();
            var newStartTime = oEvent.getParameter("newStartTime");
            var newEndTime = oEvent.getParameter("newEndTime");
            oDeltaline.setTimeStamp(newStartTime);
            oDeltaline.setEndTimeStamp(newEndTime);

        },

        onDeltaResize: function(oEvent) {
            var oDeltaline = oEvent.getSource();
            var newStartTime = oEvent.getParameter("newTimeStamp");
            var newEndTime = oEvent.getParameter("newEndTimeStamp");
            oDeltaline.setTimeStamp(newStartTime);
            oDeltaline.setEndTimeStamp(newEndTime);
        },

        viewSettingsConfirm: function(oEvent){

            // handle confirm for Adhoc Lines
            var adhocLineItems = Element.getElementById("containerToolbar-settingsDialog-flexbox-2").getAggregation("items");
            var aAdhocLines = Element.getElementById(this.sId.substring(0, this.sId.indexOf('-settingsDialog'))).getParent().getAggregation('ganttCharts')[0].getSimpleAdhocLines();
            adhocLineItems.forEach(function(oSettingItem, index){
                aAdhocLines[index].setVisible(oSettingItem.getSelected());
            });

            // handle confirm for Delta Lines
            var aDeltaLineItems = Element.getElementById("containerToolbar-settingsDialog-flexbox-3").getAggregation("items");
            var aDeltaLines = Element.getElementById(this.sId.substring(0, this.sId.indexOf('-settingsDialog'))).getParent().getAggregation('ganttCharts')[0].getDeltaLines();
            aDeltaLineItems.forEach(function(oSettingItem, index){
                aDeltaLines[index].setVisible(oSettingItem.getSelected());
            });
        },
        viewSettingsCancel: function(oEvent){
            // handle cancel for Adhoc Lines
            var adhocLineItems = Element.getElementById("containerToolbar-settingsDialog-flexbox-2").getAggregation("items");
            var aAdhocLines = Element.getElementById(this.sId.substring(0, this.sId.indexOf('-settingsDialog'))).getParent().getAggregation('ganttCharts')[0].getSimpleAdhocLines();
            aAdhocLines.forEach(function(oAdhocLine, index){
                adhocLineItems[index].setSelected(oAdhocLine.getVisible());
            });

            // handle cancel for Delta Lines
            var deltaLineItems = Element.getElementById("containerToolbar-settingsDialog-flexbox-3").getAggregation("items");
            var aDeltaLines = Element.getElementById(this.sId.substring(0, this.sId.indexOf('-settingsDialog'))).getParent().getAggregation('ganttCharts')[0].getDeltaLines();
            aDeltaLines.forEach(function(oDeltaLine, index){
                deltaLineItems[index].setSelected(oDeltaLine.getVisible());
            });
        },
        viewSettingsReset: function(){
            // handle confirm for Adhoc Lines
            var adhocLineItems = Element.getElementById("containerToolbar-settingsDialog-flexbox-2").getAggregation("items");
            adhocLineItems.forEach(function(oSettingItem, index){
                oSettingItem.setSelected(true);
            });

            // handle confirm for Delta Lines
            var aDeltaLineItems = Element.getElementById("containerToolbar-settingsDialog-flexbox-3").getAggregation("items");
            aDeltaLineItems.forEach(function(oSettingItem, index){
                oSettingItem.setSelected(true);
            });
        },
        getAdhocLineItems: function(){
            var oTableGantt = this.getView().byId("gantt1");
            var aAdhocLines = oTableGantt.getSimpleAdhocLines();
            return aAdhocLines.map(function(oAdhocLine, index){
                return new CheckBox({
                    name: oAdhocLine.getDescription() || "Adhoc Line " + (index + 1),
                    text: oAdhocLine.getDescription() || "Adhoc Line " + (index + 1),
                    tooltip: oAdhocLine.getDescription() || "Adhoc Line " + (index + 1),
                    selected: oAdhocLine.getVisible()
                });
            });
        },
        getDeltaLineItems: function () {
            var oTableGantt = this.getView().byId("gantt1");
            var aDeltaLines = oTableGantt.getDeltaLines();
            return aDeltaLines.map(function(oDeltaLine, index){
                return new CheckBox({
                    name: oDeltaLine.getDescription() || "Delta Line " + (index + 1),
                    text: oDeltaLine.getDescription() || "Delta Line " + (index + 1),
                    tooltip: oDeltaLine.getDescription() || "Delta Line " + (index + 1),
                    selected: oDeltaLine.getVisible()
                });
            });
        },

        onShapeContextMenu: function(oEvent) {
            var oShape = oEvent.getParameter("shape");
            var iPageX = oEvent.getParameter("pageX");
            var iPageY = oEvent.getParameter("pageY");

            if (oShape instanceof Relationship) {
                var sType = oShape.getType();
                oContextMenu.getItems()[1].getItems().filter(function (item) { return item.getText() == sType; })[0].setIcon("sap-icon://accept");
                // oContextMenu.getItems()[1].getItems()[iType].setIcon("sap-icon://accept");
                oContextMenu.selectedShape = oShape;
                var oPlaceHolder = new Label();
                var oPopup = new Popup(oPlaceHolder, false, true, false);
                var eDock = Popup.Dock;
                var sOffset = (iPageX + 1) + " " + (iPageY + 1);
                oPopup.open(0, eDock.BeginTop, eDock.LeftTop, null , sOffset);
                oContextMenu.openBy(oPlaceHolder);
            }
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
            oNewRelationship = {
                "ObjectID": sRelationshipID + "-2",
                "RelationID": sRelationshipID,
                "ParentObjectID": sRowId,
                "PredecTaskID": sShapeId,
                "SuccTaskID": fnParseUid(sToShapeUid).shapeId,
                "RelationType": iType
            };
            oDataModel.create('/Relationships', oNewRelationship, mParameters);
            // oDataModel.submitChanges();
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
        },

        fnHandleMarker1Press: function(oEvent){
            var msg = "This is a custom implementation for press event on red adhoc line marker";
            MessageToast.show(msg);
        },

        fnHandleMarker2Press: function(oEvent){
            if (!this.oDefaultMessageDialog) {
                this.oDefaultMessageDialog = new Dialog({
                    type: DialogType.Message,
                    title: "Default Message",
                    content: new Text({ text: "This is a custom implementation for press event on adhoc line marker" }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "OK",
                        press: function () {
                            this.oDefaultMessageDialog.close();
                        }.bind(this)
                    })
                });
            }

            this.oDefaultMessageDialog.open();
        },

        fnHandleMarker3Press: function (oEvent) {
            var oMarker = oEvent.getParameters().getSource();
            var oPopover = new Popover({
                title: "Custom Adhoc Popover",
                content: [new Text({ text: "This is a custom implementation for a press event on adhoc line marker" })]
            });
            oPopover.openBy(oMarker);
        },

        fnHandleMarkerMouseEnter: function(oEvent){
            var msg = "This is a custom implementation for mouse enter event on red adhoc line marker";
            MessageToast.show(msg);
        },

        fnHandleMarkerMouseLeave: function(oEvent){
            var msg = "This is a custom implementation for mouse leave event on green adhoc line marker";
            MessageToast.show(msg);
        },

        fnHandleMarker2MouseEnter: function(oEvent){
            var msg = "This is a custom implementation for mouse enter event on green adhoc line marker";
            MessageToast.show(msg);
        },
        onHandlePress: function(oEvent){
            MessageToast.show("This is a custom implementation for press event on Delta Line header");
        },
        onHandleMouseEnter: function(oEvent){
            MessageToast.show("This is a custom implementation for Mouse Enter event on Delta Line header");
        },
        onHandleMouseLeave: function(oEvent){
            MessageToast.show("This is a custom implementation for Mouse Leave event on Delta Line header");
        },
        onAlertClicked: function () {
            var bAnimate = Element.getElementById("alert").getSelected();
            this.getView().getModel("oViewModel").setProperty("/alert", bAnimate);
        },
        onDeltaCheckBoxClicked: function () {
            var bStatus = Element.getElementById("deltaLinesVisibility").getSelected();
            var aDeltaLineItems = this.getView().byId("gantt1").getDeltaLines();
            aDeltaLineItems.forEach(function(oItem){
                oItem.setVisibleDeltaStartEndLines(bStatus);
            });
        },
        fnLessValueConvert: function (sCalendarName) {
            var sColor = "";
			switch (sCalendarName) {
                case "workingDays" : sColor = Parameters.get("sapUiChartPaletteSequentialHue2Light3"); break;
                case "shiftedWorkingDays" : sColor = Parameters.get("sapUiChartPaletteNoSemDiv1Light3"); break;
                case "nonWorkingDay":
                default: sColor = "@sapUiChartPaletteSequentialHue9Light3"; break;
            }
            return sColor;
		}
    });
});

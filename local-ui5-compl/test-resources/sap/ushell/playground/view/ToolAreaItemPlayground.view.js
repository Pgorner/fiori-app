// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/Page",
    "sap/m/Panel",
    "sap/m/Select",
    "sap/m/Switch",
    "sap/m/MessageToast",
    "sap/ui/core/Item",
    "sap/ui/core/mvc/View",
    "sap/ui/layout/Grid",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/shell/ToolAreaItem",
    "sap/m/library"
], function (
    Input,
    Label,
    Page,
    Panel,
    Select,
    Switch,
    MessageToast,
    Item,
    View,
    Grid,
    SimpleForm,
    JSONModel,
    ToolAreaItem,
    mLibrary
) {
    "use strict";

    // shortcut for sap.m.InputType
    var InputType = mLibrary.InputType;

    return View.extend("sap.ushell.playground.view.ToolAreaItemPlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                icon: "sap-icon://world",
                selected: false,
                text: "Tool Area Item",
                visible: false,
                expandable: false
            };

            var oModel = new JSONModel(oData);

            var oToolAreaItem = new ToolAreaItem({
                icon: "{/icon}",
                selected: "{/selected}",
                text: "{/text}",
                visible: "{/visible}",
                expandable: "{/expandable}"
            });

            var oGrid = new Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oToolAreaItem]
            });

            var oIconLabel = new Label({
                text: "Icon",
                labelFor: oIconSelect
            });

            var oIconSelect = new Select("tool-area-item-icon-select", {
                items: [
                    new Item({
                        key: "sap-icon://world",
                        text: "world"
                    }),
                    new Item({
                        key: "",
                        text: "none"
                    }),
                    new Item("deleteItem", {
                        key: "sap-icon://delete",
                        text: "delete"
                    }),
                    new Item({
                        key: "sap-icon://refresh",
                        text: "refresh"
                    })
                ],
                change: function (oEvt) {
                    oData.icon = oEvt.getParameter("selectedItem").getKey();
                    oModel.checkUpdate();
                }
            });

            var oTextLabel = new Label({
                text: "Tool Area item Title",
                labelFor: oTextInput
            });

            var oTextInput = new Input({
                type: InputType.Text,
                placeholder: "Enter a Tool Area Item text ..."
            });
            oTextInput.bindValue("/text");

            var oExpandableLabel = new Label({
                text: "Expandable",
                labelFor: oExpandableSwitch
            });

            var oExpandableSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    oData.expandable = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oSelectLabel = new Label({
                text: "Selected",
                labelFor: oSelectSwitch
            });

            var oSelectSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    oData.selected = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oVisibleLabel = new Label({
                text: "Visible",
                labelFor: oVisibleSwitch
            });

            var oVisibleSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    oData.visible = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oPressLabel = new Label({
                text: "Press Action",
                labelFor: "press-action"
            });

            var oPressSwitch = new Switch({
                id: "press-action",
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oToolAreaItem.attachPress(fnPress);
                    } else {
                        oToolAreaItem.detachPress(fnPress);
                    }
                }
            });

            var oExpandLabel = new Label({
                text: "Expand Action",
                labelFor: "press-action"
            });

            var oExpandSwitch = new Switch({
                id: "expand-action",
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oToolAreaItem.attachExpand(fnExpand);
                    } else {
                        oToolAreaItem.detachExpand(fnExpand);
                    }
                }
            });

            var fnPress = function (oEvent) {
                MessageToast.show("Tool area item is pressed");
            };

            var fnExpand = function (oEvent) {
                MessageToast.show("Expand tool area item");
            };

            var oForm = new SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Tool Area Item",
                editable: true,
                content: [
                    oIconLabel,
                    oIconSelect,
                    oTextLabel,
                    oTextInput,
                    oExpandableLabel,
                    oExpandableSwitch,
                    oSelectLabel,
                    oSelectSwitch,
                    oVisibleLabel,
                    oVisibleSwitch,
                    oPressLabel,
                    oPressSwitch,
                    oExpandLabel,
                    oExpandSwitch
                ]
            });

            var oControlPanel = new Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new Page("toolAreaItemPage", {
                title: "Tool Area Item Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/m/Label",
    "sap/m/Page",
    "sap/m/Panel",
    "sap/m/Input",
    "sap/m/Switch",
    "sap/m/Button",
    "sap/m/Select",
    "sap/ui/core/Element",
    "sap/ui/core/Item",
    "sap/ui/layout/Grid",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/core/mvc/View",
    "sap/ushell/ui/shell/ToolArea",
    "sap/ushell/ui/shell/ToolAreaItem",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (
    mobileLibrary,
    Label,
    Page,
    Panel,
    Input,
    Switch,
    Button,
    Select,
    Element,
    Item,
    Grid,
    SimpleForm,
    View,
    ToolArea,
    ToolAreaItem,
    MessageToast,
    JSONModel
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.InputType
    var InputType = mobileLibrary.InputType;

    return View.extend("sap.ushell.playground.view.ToolAreaPlayground", {
        createContent: function () {
            var oModel = new JSONModel({
                icon: "sap-icon://world",
                text: "Tool Area Item",
                expandable: false
            });

            return new Page("toolAreaPage", {
                title: "Tool Area Demo",
                content: [
                    new Panel({
                        backgroundDesign: "Solid",
                        content: [
                            new Grid({
                                defaultSpan: "XL4 L4 M6 S12",
                                content: [
                                    new ToolArea("toolArea")
                                ]
                            })
                        ],
                        height: "400px"
                    }),
                    new SimpleForm({
                        layout: "ColumnLayout",
                        title: "Modify Tool Area Item",
                        editable: true,
                        content: [
                            new Label({
                                text: "Icon",
                                labelFor: "toolAreaItemIconSelect"
                            }),
                            new Select({
                                id: "toolAreaItemIconSelect",
                                selectedKey: "{/icon}",
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
                                ]
                            }),
                            new Label({
                                text: "Text",
                                labelFor: "toolAreaItemText"
                            }),
                            new Input({
                                id: "toolAreaItemText",
                                type: InputType.Text,
                                value: "{/text}"
                            }),
                            new Label({
                                text: "Expandable",
                                labelFor: "expandableSwitch"
                            }),
                            new Switch({
                                state: "{/expandable}"
                            }),
                            new Label({
                                text: "Tool Area Item",
                                labelFor: "itemAddButton"
                            }),
                            new Button({
                                id: "itemAddButton",
                                text: "Add",
                                press: function () {
                                    var oToolArea = Element.getElementById("toolArea");
                                    var oData = oModel.getProperty("/");
                                    oToolArea.addToolAreaItem(new ToolAreaItem({
                                        icon: oData.icon,
                                        text: oData.text,
                                        expandable: oData.expandable,
                                        press: function () {
                                            MessageToast.show("Tool area item was pressed");
                                        },
                                        expand: function () {
                                            MessageToast.show("Expand tool area item");
                                        }
                                    }));
                                    oToolArea.invalidate();
                                }
                            }),
                            new Button("toolAreaItemRemove", {
                                text: "Remove",
                                type: ButtonType.Reject,
                                press: function () {
                                    var oToolArea = Element.getElementById("toolArea");
                                    var iNoOfItems = oToolArea.getToolAreaItems().length;
                                    oToolArea.removeToolAreaItem(iNoOfItems - 1);
                                }
                            })
                        ]
                    })
                ]
            }).setModel(oModel);
        }
    });
});

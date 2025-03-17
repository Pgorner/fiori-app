// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/m/Page",
    "sap/m/Panel",
    "sap/m/Select",
    "sap/m/Switch",
    "sap/ui/core/Item",
    "sap/ui/core/mvc/View",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/ShellHeader",
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/m/library"
], function (
    Button,
    Input,
    Label,
    MessageToast,
    Page,
    Panel,
    Select,
    Switch,
    Item,
    View,
    SimpleForm,
    JSONModel,
    ShellHeader,
    ShellAppTitle,
    ShellHeadItem,
    mLibrary
) {
    "use strict";

    // shortcut for sap.m.InputType
    var InputType = mLibrary.InputType;

    // shortcut for sap.m.ButtonType
    var ButtonType = mLibrary.ButtonType;

    return View.extend("sap.ushell.playground.view.ShellHeaderPlayground", {
        getControllerName: function () {
            return "sap.ushell.playground.controller.ShellHeaderPlayground";
        },

        createContent: function () {
            var oPage = this._createPage();
            return oPage;
        },
        _createPage: function () {
            var sSapLogo = "../../../../resources/sap/ushell/themes/base/img/SAPLogo.svg";

            var oData = {
                currentState: "",
                visible: true,
                logo: sSapLogo,
                showLogo: true,
                title: "foo"
            };

            var oModel = new JSONModel(oData);

            var oShellHeader = new ShellHeader({
                visible: "{/visible}",
                logo: "{/logo}",
                showLogo: "{/showLogo}",
                title: "{/title}"
            });

            var oShellHeaderSwitch = new Switch({
                state: true,
                change: function (oEvent) {
                    oData.visible = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oShellHeaderVsbLabel = new Label({
                text: "Header visible",
                labelFor: oShellHeaderSwitch
            });

            var oLogoSwitch = new Switch({
                state: true,
                change: function (oEvent) {
                    oShellHeader.setShowLogo(this.getState());
                }
            });

            var oLogoLabel = new Label({
                text: "Logo",
                labelFor: oLogoSwitch
            });

            var oLogoSelect = new Select("shell-header-icon-select", {
                change: function (oEvent) {
                    oData.logo = oEvent.getParameter("selectedItem").getKey();
                    oModel.checkUpdate();
                },
                items: [
                    new Item("Logo-0-SH", {
                        key: "",
                        text: "No Logo"
                    }),
                    new Item("Logo-1-SH", {
                        key: sSapLogo,
                        text: "SAP"
                    })
                ],
                selectedItem: "Logo-1-SH"
            });

            var oHeadItemAddBtn = new Button({
                text: "Add",
                press: function () {
                    var oShellHeadItem = new ShellHeadItem({
                        tooltip: "Shell Head Item",
                        icon: "sap-icon://activity-items",
                        press: function () {
                            MessageToast.show("Shell Head Item");
                        }
                    });

                    oShellHeader.addHeadItem(oShellHeadItem);
                }
            });

            var oHeadItemLabel = new Label({
                text: "Head Item",
                labelFor: oHeadItemAddBtn
            });

            var oHeadItemRemoveBtn = new Button("HI-RM-BTN", {
                text: "Remove",
                type: ButtonType.Reject,
                press: function () {
                    oShellHeader.removeHeadItem(oShellHeader.getHeadItems().length - 1);
                }
            });

            var oHeadEndItemAddBtn = new Button({
                text: "Add",
                press: function () {
                    var oShellEndHeadItem = new ShellHeadItem({
                        tooltip: "Shell Head End Item",
                        icon: "sap-icon://activity-items",
                        press: function () {
                            MessageToast.show("Shell Head End Item");
                        }
                    });
                    oShellHeader.addHeadEndItem(oShellEndHeadItem);
                }
            });

            var oHeadEndItemLabel = new Label({
                text: "Head End Item",
                labelFor: oHeadEndItemAddBtn
            });

            var oHeadEndItemRemoveBtn = new Button("HEI-RM-BTN", {
                text: "Remove",
                type: ButtonType.Reject,
                press: function () {
                    oShellHeader.removeHeadEndItem(oShellHeader.getHeadEndItems().length - 1);
                }
            });

            var oTitleText = new Input({
                type: InputType.Text,
                placeholder: "Enter a shell title ...",
                change: function (oEvent) {
                    oShellHeader.setTitle(oTitleText.getValue());
                }
            });
            oTitleText.bindValue("/title");

            var oTitleLabel = new Label({
                text: "Title",
                labelFor: oTitleText
            });

            var oShellAppTitle = new ShellAppTitle({
                text: "{/shellAppTitle}",
                tooltip: "shell app title",
                press: function () {
                    MessageToast.show("Shell App Title");
                }
            });

            var oShellAppTitleText = new Input({
                type: InputType.Text,
                placeholder: "Enter a shell app title ...",
                change: function (oEvent) {
                    if (!oShellAppTitleText.getValue() === "") {
                        oShellHeader.setAggregation("appTitle");
                        oShellHeader.setAppTitle(oShellAppTitle);
                    } else {
                        oShellHeader.setAggregation("appTitle");
                    }
                }
            });
            oShellAppTitleText.bindValue("/shellAppTitle");

            var oShellAppTitleLabel = new Label({
                text: "Shell App Title",
                labelFor: oShellAppTitleText
            });

            var oEditableSimpleForm = new SimpleForm({
                layout: "ColumnLayout",
                editable: true,
                title: "Modify Shell Header",
                content: [
                    oShellHeaderVsbLabel,
                    oShellHeaderSwitch,
                    oLogoLabel,
                    oLogoSwitch,
                    oLogoSelect,
                    oHeadItemLabel,
                    oHeadItemAddBtn,
                    oHeadItemRemoveBtn,
                    oHeadEndItemLabel,
                    oHeadEndItemAddBtn,
                    oHeadEndItemRemoveBtn,
                    oTitleLabel,
                    oTitleText,
                    oShellAppTitleLabel,
                    oShellAppTitleText
                ]
            });

            var oControlPanel = new Panel({
                backgroundDesign: "Solid",
                content: oShellHeader,
                height: "400px"
            });

            var oPage = new Page("shellHeaderPage", {
                title: "Shell Header Demo",
                backgroundDesign: "Solid",
                content: [oControlPanel, oEditableSimpleForm]
            });

            oPage.setModel(oModel);

            oShellHeader.addEventDelegate({
                onAfterRendering: function () {
                    // The Shell Header hides itself because of internal checks
                    var oDomRef = oShellHeader.getDomRef();
                    if (oDomRef) {
                        oDomRef.style.visibility = "visible";
                    }
                }
            }, oShellHeader);
            return oPage;
        }
    });
});

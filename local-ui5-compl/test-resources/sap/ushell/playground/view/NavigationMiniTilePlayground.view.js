// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/m/Page",
    "sap/m/Panel",
    "sap/m/Select",
    "sap/ui/core/Item",
    "sap/ui/core/mvc/View",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/layout/Grid",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/type/String",
    "sap/ushell/ui/shell/NavigationMiniTile"
], function (
    Input,
    Label,
    MessageToast,
    Page,
    Panel,
    Select,
    Item,
    View,
    SimpleForm,
    Grid,
    JSONModel,
    StringModelType,
    NavigationMiniTile
) {
    "use strict";

    return View.extend("sap.ushell.playground.view.NavigationMiniTilePlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                title: "Related App 1",
                subtitle: "Application view number 2",
                icon: "sap-icon://documents",
                intent: ""
            };

            var oModel = new JSONModel(oData);

            function addNavigationMiniTileControls (oForm) {
                oForm.addContent(new Label({
                    text: "Title"
                }));

                oForm.addContent(new Input({
                    width: "16rem",
                    placeholder: "Enter title ...",
                    value: {
                        path: "/title",
                        type: new StringModelType()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Subtitle"
                }));

                oForm.addContent(new Input({
                    width: "16rem",
                    placeholder: "Enter subtitle ...",
                    value: {
                        path: "/subtitle",
                        type: new StringModelType()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Icon"
                }));

                oForm.addContent(new Select("mini-tile-icon-select", {
                    items: [
                        new Item({
                            key: "",
                            text: "none"
                        }),
                        new Item({
                            key: "sap-icon://world",
                            text: "world"
                        }),
                        new Item({
                            key: "sap-icon://customer-financial-fact-sheet",
                            text: "customer-financial-fact-sheet"
                        }),
                        new Item({
                            key: "sap-icon://delete",
                            text: "delete"
                        }),
                        new Item({
                            key: "sap-icon://refresh",
                            text: "refresh"
                        }),
                        new Item({
                            key: "sap-icon://email",
                            text: "email"
                        }),
                        new Item({
                            key: "sap-icon://hide",
                            text: "hide"
                        }),
                        new Item({
                            key: "sap-icon://home",
                            text: "home"
                        }),
                        new Item("NMT-std-icon", {
                            key: "sap-icon://documents",
                            text: "documents"
                        }),
                        new Item({
                            key: "sap-icon://copy",
                            text: "copy"
                        })
                    ],
                    selectedItem: "NMT-std-icon",
                    change: function (oEvt) {
                        oData.icon = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Intent"
                }));

                oForm.addContent(new Input({
                    placeholder: "Enter intent ...",
                    value: {
                        path: "/intent",
                        type: new StringModelType()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));
            }

            var oNavigationMiniTile = new NavigationMiniTile({
                title: "{/title}",
                subtitle: "{/subtitle}",
                icon: "{/icon}",
                intent: "{/intent}",
                visible: true,
                press: function () {
                    MessageToast.show("Intent: " + oData.intent);
                }
            });

            var oNavigationMiniTile2 = new NavigationMiniTile({
                title: "{/title}",
                subtitle: "{/subtitle}",
                icon: "",
                intent: "{/intent}",
                visible: true,
                press: function () {
                    MessageToast.show("Intent: " + oData.intent);
                }
            });

            var oGrid = new Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oNavigationMiniTile, oNavigationMiniTile2]
            });

            var oForm = new SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Navigation Mini Tile",
                editable: true
            });

            addNavigationMiniTileControls(oForm);

            var oControlPanel = new Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new Page("navigationMiniTitlePage", {
                title: "Navigation Mini Tile Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});

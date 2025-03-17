// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/m/Page",
    "sap/m/Panel",
    "sap/m/Select",
    "sap/m/Switch",
    "sap/ui/core/Item",
    "sap/ui/core/mvc/View",
    "sap/ui/core/Title",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/layout/Grid",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/launchpad/Tile"
], function (
    Button,
    Label,
    MessageToast,
    Page,
    Panel,
    Select,
    Switch,
    Item,
    View,
    Title,
    SimpleForm,
    Grid,
    JSONModel,
    Tile
) {
    "use strict";

    return View.extend("sap.ushell.playground.view.TilePlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                visible: false,
                long: false,
                tileActionModeActive: false,
                target: "PlaygroundHomepage.html"
            };

            var oModel = new JSONModel(oData);

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

            var oLongLabel = new Label({
                text: "Long",
                labelFor: oLongSwitch
            });

            var oLongSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    oData.long = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oTargetLabel = new Label({
                text: "Target",
                labelFor: oTargetSelect
            });

            var oTargetSelect = new Select("target-select", {
                items: [
                    new Item("pl-item", {
                        key: "playgroundHomepage",
                        text: "PlaygroundHomepage.html"
                    })
                ],
                selectedItem: "playgroundHomepage",
                change: function (oEvt) {
                    oData.target = oEvt.getParameter("selectedItem").getKey();
                    oModel.checkUpdate();
                }
            });

            var oTileActionModeActiveLabel = new Label({
                text: "Tile Action Mode Active",
                labelFor: oTileActionModeActiveSwitch
            });

            var oTileActionModeActiveSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    oData.tileActionModeActive = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oPinButton = new Button({
                text: "Pin Button",
                press: function () {
                    MessageToast.show("Pin button is pressed");
                }
            });

            var oPinButtonLabel = new Label({
                text: "Show Pin Button",
                labelFor: oPinButtonSwitch
            });

            var oPinButtonSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    if (this.getState()) {
                        oTile.addPinButton(oPinButton);
                    } else {
                        oTile.removePinButton(0);
                    }
                }
            });

            var oTileView = new Text({
                text: "Tile View"
            });

            var oTileViewLabel = new Label({
                text: "Show Tile View",
                labelFor: oTileViewSwitch
            });

            var oTileViewSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    if (this.getState()) {
                        oTile.addTileView(oTileView);
                    } else {
                        oTile.removeTileView(0);
                    }
                }
            });

            var fnPress = function (oEvent) {
                MessageToast.show("Tile is pressed");
            };

            var oPressLabel = new Label({
                text: "Press Action",
                labelFor: oPressSwitch
            });

            var oPressSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oTile.attachPress(fnPress);
                    } else {
                        oTile.detachPress(fnPress);
                    }
                }
            });

            var fnDeletePress = function (oEvent) {
                MessageToast.show("Delete is pressed");
            };

            var oDeletePressLabel = new Label({
                text: "Delete Action",
                labelFor: oDeletePressSwitch
            });

            var oDeletePressSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oTile.attachDeletePress(fnDeletePress);
                    } else {
                        oTile.detachDeletePress(fnDeletePress);
                    }
                }
            });

            var fnAfterRendering = function (oEvent) {
                MessageToast.show("Tile has been rendered");
            };

            var oTile = new Tile({
                visible: "{/visible}",
                tileActionModeActive: "{/tileActionModeActive}",
                long: "{/long}",
                target: "{/target}",
                afterRendering: fnAfterRendering
            });

            oTile.addEventDelegate({
                onAfterRendering: function () {
                    this.setRgba("rgba(153, 204, 255, 0.3)");
                }.bind(oTile)
            });

            var oGrid = new Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oTile]
            });

            var oForm = new SimpleForm({
                title: "Modify Tile",
                editable: true,
                layout: "ColumnLayout",
                content: [
                    new Title({ text: "Modify Tile" }),
                    oVisibleLabel,
                    oVisibleSwitch,
                    oLongLabel,
                    oLongSwitch,
                    oTargetLabel,
                    oTargetSelect,
                    oTileActionModeActiveLabel,
                    oTileActionModeActiveSwitch,
                    oTileViewLabel,
                    oTileViewSwitch,
                    oPinButtonLabel,
                    oPinButtonSwitch,
                    oPressLabel,
                    oPressSwitch,
                    oDeletePressLabel,
                    oDeletePressSwitch
                ]
            });

            var oControlPanel = new Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new Page("tilePage", {
                title: "Tile Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});

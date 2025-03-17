// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/m/Select",
    "sap/m/Switch",
    "sap/ui/core/mvc/View",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/tile/TileBase",
    "sap/ui/core/Item",
    "sap/m/library",
    "sap/ui/layout/Grid",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/Panel",
    "sap/m/Page"
], function (
    Input,
    Label,
    MessageToast,
    Select,
    Switch,
    View,
    JSONModel,
    TileBase,
    Item,
    mobileLibrary,
    Grid,
    SimpleForm,
    Panel,
    Page
) {
    "use strict";

    // shortcut for sap.m.InputType
    var InputType = mobileLibrary.InputType;

    return View.extend("sap.ushell.playground.view.TileBasePlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                title: "title",
                subtitle: "subtitle",
                icon: "sap-icon://world",
                info: "Tile Base Info",
                highlightTerms: "highlightTerms"
            };

            var oModel = new JSONModel(oData);

            var oTileBase = new TileBase({
                title: "{/title}",
                subtitle: "{/subtitle}",
                icon: "{/icon}",
                info: "{/info}",
                highlightTerms: "{/highlightTerms}"
            });

            var oPressLabel = new Label({
                text: "Press Action",
                labelFor: oPressSwitch
            });

            var oPressSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oTileBase.attachPress(fnPress);
                    } else {
                        oTileBase.detachPress(fnPress);
                    }
                }
            });

            var fnPress = function (oEvent) {
                MessageToast.show("Tile Base is pressed");
            };

            var oIconLabel = new Label({
                text: "Icon",
                labelFor: oIconSelect
            });

            var oIconSelect = new Select("tile-base-icon-select", {
                items: [
                    new Item("world-item", {
                        key: "sap-icon://world",
                        text: "world"
                    }),
                    new Item({
                        key: "",
                        text: "none"
                    }),
                    new Item({
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

            var oTitleLabel = new Label({
                text: "Tile Base Title",
                labelFor: oTitleInput
            });

            var oTitleInput = new Input({
                type: InputType.Text,
                placeholder: "Enter tile base title ..."
            });
            oTitleInput.bindValue("/title");

            var oSubtitleLabel = new Label({
                text: "Tile Base Subitle",
                labelFor: oSubtitleInput
            });

            var oSubtitleInput = new Input({
                type: InputType.Text,
                placeholder: "Enter tile base subtitle ..."
            });
            oSubtitleInput.bindValue("/subtitle");

            var oInfoLabel = new Label({
                text: "Tile Base Info",
                labelFor: oInfoInput
            });

            var oInfoInput = new Input({
                type: InputType.Text,
                placeholder: "Enter tile base info ..."
            });
            oInfoInput.bindValue("/info");

            var oHighlightTermsLabel = new Label({
                text: "Tile Highlight Terms",
                labelFor: oHighlightTermsInput
            });

            var oHighlightTermsInput = new Input({
                type: InputType.Text,
                placeholder: "Enter highlight terms ..."
            });
            oHighlightTermsInput.bindValue("/highlightTerms");

            var oGrid = new Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oTileBase]
            });

            var oForm = new SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Tile Base",
                editable: true,
                content: [
                    oIconLabel,
                    oIconSelect,
                    oTitleLabel,
                    oTitleInput,
                    oSubtitleLabel,
                    oSubtitleInput,
                    oInfoLabel,
                    oInfoInput,
                    oPressLabel,
                    oPressSwitch,
                    oHighlightTermsLabel,
                    oHighlightTermsInput
                ]
            });

            var oControlPanel = new Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new Page("tileBasePage", {
                title: "Tile Base Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});

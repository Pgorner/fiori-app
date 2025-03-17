// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MenuButton",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/GenericTile",
    "sap/m/ImageContent",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/m/TileContent",
    "sap/f/GridContainerItemLayoutData",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/playground/controller/BaseController"
], function (
    MenuButton,
    Menu,
    MenuItem,
    GenericTile,
    ImageContent,
    mobileLibrary,
    MessageToast,
    TileContent,
    GridContainerItemLayoutData,
    JSONModel,
    ushellLibrary,
    resources,
    BaseController
) {
    "use strict";

    var FrameType = mobileLibrary.FrameType;

    // shortcut for sap.m.TileSizeBehavior
    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    var oModel,
        oSection,
        iCounter = 1,
        iFlatCounter = 1,
        iLinkCounter = 1;

    return BaseController.extend("sap.ushell.playground.controller.Section", {
        onInit: function () {
            oModel = new JSONModel({
                editable: false,
                enableAddButton: true,
                enableDeleteButton: true,
                enableGridBreakpoints: false,
                enableResetButton: true,
                enableShowHideButton: true,
                enableVisualizationReordering: false,
                noVisualizationsText: resources.i18n.getText("Section.NoVisualizationsText"),
                title: "",
                showNoVisualizationsText: false,
                showSection: true,
                visible: true,
                sizeBehavior: TileSizeBehavior.Small,
                visualizations: []
            });

            oSection = this.getView().byId("playgroundSection");

            // Add the Add.. button
            var oMenu = new Menu({
                items: [
                    new MenuItem({ text: "Link" }),
                    new MenuItem({ text: "Flat Tile" }),
                    new MenuItem({ text: "Wide Tile" })
                ],
                itemSelected: this.addLinkOrTile
            });
            var oAddButton = new MenuButton({
                text: "Add",
                menu: oMenu
            });
            oSection.getAggregation("_header").insertContent(oAddButton, 4);

            this.getView().setModel(oModel);
        },

        addVisualization: function () {
            MessageToast.show("Add Visualization Button pressed");
            var aVisualizations = oModel.getProperty("/visualizations");

            aVisualizations.push({
                header: "Sales Fulfillment " + iCounter,
                subheader: "abc",
                info: "some text",
                mode: "ContentMode",
                frameType: FrameType.OneByOne,
                icon: "sap-icon://activities",
                displayFormatHint: "standard"
            });

            iCounter++;

            oModel.setProperty("/visualizations", aVisualizations);
        },

        addLinkOrTile: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var itemIndex = oEvent.getSource().indexOfItem(oItem);
            var oViz;

            switch (itemIndex) {
                case 0:
                    oViz = {
                        header: "Compact Visualization " + iLinkCounter,
                        subheader: "link",
                        info: "some text",
                        mode: "LineMode",
                        frameType: FrameType.OneByOne,
                        icon: "sap-icon://activities",
                        displayFormatHint: DisplayFormat.Compact
                    };
                    iLinkCounter++;
                    break;
                case 1:
                    oViz = {
                        header: "Flat Visualization " + iFlatCounter,
                        subheader: "flat tile",
                        info: "some text",
                        mode: "ContentMode",
                        frameType: FrameType.OneByHalf,
                        rows: 1,
                        columns: 2,
                        icon: "sap-icon://activities",
                        displayFormatHint: DisplayFormat.Flat
                    };
                    iFlatCounter++;
                    break;
                case 2:
                    oViz = {
                        header: "Wide Flat Visualization " + iFlatCounter,
                        subheader: "wide flat tile",
                        info: "some text",
                        mode: "ContentMode",
                        frameType: FrameType.TwoByHalf,
                        rows: 1,
                        columns: 4,
                        icon: "sap-icon://activities",
                        displayFormatHint: DisplayFormat.FlatWide
                    };
                    iFlatCounter++;
                    break;
                default:
                    break;
            }

            MessageToast.show("Add Button pressed");
            var aVisualizations = oModel.getProperty("/visualizations");
            aVisualizations.push(oViz);
            oModel.setProperty("/visualizations", aVisualizations);
        },

        resetVisualizations: function () {
            MessageToast.show("Reset Button pressed");
            iCounter = 1;
            oModel.setProperty("/visualizations", []);
        },

        titleChange: function () {
            MessageToast.show("Title was changed");
        },

        _generateVisualizations: function (sId, oContext) {
            var oTileData = oContext.getObject();
            var oTile = new GenericTile({
                mode: "{mode}",
                header: "{header}",
                subheader: "{subheader}",
                frameType: "{frameType}",
                scope: "{= ${/editable} ? 'Actions' : 'Display'}",
                tileContent: [new TileContent({
                    footer: "{info}",
                    content: [new ImageContent({ // Static Tile
                        src: "{icon}"
                    })]
                })],
                sizeBehavior: "{/sizeBehavior}",
                press: function (oEvent) {
                    if (oEvent.getParameter("action") === "Remove") {
                        var aVisualizations = oModel.getProperty("/visualizations");
                        var oViz = oEvent.getSource();
                        var index = oSection.indexOfVisualization(oViz);
                        var oPosition = oSection.getItemPosition(oViz);
                        aVisualizations.splice(index, 1);

                        oModel.setProperty("/visualizations", aVisualizations);
                        oSection.focusVisualization(oPosition);
                    }
                }
            });
            if (oTileData.rows) {
                oTile.setLayoutData(new GridContainerItemLayoutData({ rows: oTileData.rows, columns: oTileData.columns }));
            }
            return oTile;
        },

        setSizeBehavior: function (oEvent) {
            var sSetting = oEvent.getParameter("selectedItem").getText();
            oModel.setProperty("/sizeBehavior", TileSizeBehavior[sSetting]);
        },

        deleteSection: function () {
            MessageToast.show("Delete Button pressed");
        },

        reorderVisualizations: function (oEvent) {
            var oDragged = oEvent.getParameter("draggedControl"),
                oDropped = oEvent.getParameter("droppedControl"),
                sInsertPosition = oEvent.getParameter("dropPosition"),
                iDragPosition = oSection.indexOfVisualization(oDragged),
                iDropPosition = oSection.indexOfVisualization(oDropped),
                oDragPosition = oSection.getItemPosition(oDragged),
                oDropPosition = oSection.getItemPosition(oDropped);

            // TBD: DnD inside of the compact area
            if (oDragPosition.area !== oDropPosition.area) {
                return; // No DnD between areas currently
            }

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                    oDropPosition.index++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
                oDropPosition.index--;
            }

            var aVisualizations = oModel.getProperty("/visualizations"),
                oVisualizationModelEntity = aVisualizations.splice(iDragPosition, 1)[0];

            aVisualizations.splice(iDropPosition, 0, oVisualizationModelEntity);
            oModel.setProperty("/visualizations", aVisualizations);
            oSection.focusVisualization(oDropPosition);
        }
    });
});

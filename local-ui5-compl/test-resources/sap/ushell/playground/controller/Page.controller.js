// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/ImageContent",
    "sap/m/TileContent",
    "sap/f/GridContainerItemLayoutData",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources",
    "sap/ushell/playground/controller/BaseController"
], function (
    GenericTile,
    ImageContent,
    TileContent,
    GridContainerItemLayoutData,
    mobileLibrary,
    JSONModel,
    resources,
    BaseController
) {
    "use strict";

    var oUshellPage,
        oModel,
        iCounter = 0;

    var FrameType = mobileLibrary.FrameType;

    return BaseController.extend("sap.ushell.playground.controller.Page", {
        onInit: function () {
            this.getView().setModel(resources.i18nModel, "i18n");

            oUshellPage = this.getView().byId("playgroundUshellPage");

            oModel = new JSONModel({
                sections: [],
                edit: true,
                enableSectionReordering: true,
                noSectionsText: "",
                showNoSectionsText: true,
                showTitle: true,
                title: "Page Title"
            });
            this.getView().setModel(oModel);
        },

        _visualizationsFactory: function (sId, oContext) {
            var oTileData = oContext.getObject();
            var oTile = new GenericTile({
                mode: "{mode}",
                header: "{header}",
                subheader: "{subheader}",
                frameType: "{frameType}",
                scope: "{= ${/edit} ? 'Actions' : 'Display'}",
                tileContent: [new TileContent({
                    footer: "{info}",
                    content: [new ImageContent({ // Static Tile
                        src: "{icon}"
                    })]
                })],
                sizeBehavior: "Responsive",
                press: function (oEvent) {
                    if (oEvent.getParameter("action") === "Remove") {
                        var oViz = oEvent.getSource();
                        var aParts = oViz.getBindingContext().getPath().split("/");
                        var iSectionIndex = aParts[2];
                        var iVizIndex = aParts[4];
                        var sPath = "/sections/" + iSectionIndex + "/visualizations";
                        var aViz = oModel.getProperty(sPath);
                        var oSection = oUshellPage.getSections()[iSectionIndex];
                        var oPosition = oSection.getItemPosition(oViz);

                        aViz.splice(iVizIndex, 1);
                        oModel.setProperty(sPath, aViz);
                        oSection.focusVisualization(oPosition);
                    }
                }
            });
            if (oTileData.rows) {
                oTile.setLayoutData(new GridContainerItemLayoutData({ rows: oTileData.rows, columns: oTileData.columns }));
            }
            return oTile;
        },

        genericTilePress: function (oEvent) {
            if (oEvent.getParameter("action") === "Remove") {
                oEvent.getSource().destroy();
            }
        },

        addVisualization: function (oEvent) {
            var oSection = oEvent.getSource(),
                sPath = oSection.getBindingContext().getPath() + "/visualizations",
                aViz = oModel.getProperty(sPath),
                oTileData = this.createTileData();
            aViz.push(oTileData);
            oModel.setProperty(sPath, aViz);
        },

        createTileData: function () {
            iCounter++;
            return {
                header: "Sales Fulfillment " + iCounter,
                subheader: "abc",
                info: "some text",
                mode: "ContentMode",
                frameType: FrameType.OneByOne,
                icon: "sap-icon://activities",
                displayFormatHint: "standard"
            };
        },

        addSection: function (oEvent) {
            var aSections = oModel.getProperty("/sections"),
                iSectionIndex = oEvent.getParameter("index"),
                oSectionData = {
                    visualizations: [this.createTileData(), this.createTileData()]
                };
            aSections.splice(iSectionIndex, 0, oSectionData);
            oModel.setProperty("/sections", aSections);
        },

        resetSection: function (oEvent) {
            var oSection = oEvent.getSource(),
                sPath = oSection.getBindingContext().getPath(),
                oSectionData = {
                    visualizations: [this.createTileData(), this.createTileData()]
                };
            oModel.setProperty(sPath, oSectionData);
        },

        onSectionDrop: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                iDragPosition = oUshellPage.indexOfSection(oDragged),
                iDropPosition = oUshellPage.indexOfSection(oDropped);

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
            }

            var aSections = oModel.getProperty("/sections"),
                oSectionToBeMoved = aSections.splice(iDragPosition, 1)[0];

            aSections.splice(iDropPosition, 0, oSectionToBeMoved);
            oModel.setProperty("/sections", aSections);
        },

        onVisualizationDrop: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                oOldSection = oDragged.getParent().getParent().getParent(),
                oNewSection = oDropped.getParent().getParent().getParent(),
                iDragPosition = oOldSection.indexOfVisualization(oDragged),
                iDropPosition = oNewSection.indexOfVisualization(oDropped),
                iDragSectionPosition = oUshellPage.indexOfSection(oOldSection),
                iDropSectionPosition = oUshellPage.indexOfSection(oNewSection),
                aSectionData = oModel.getProperty("/sections"),
                oTileData = oDragged.getBindingContext().getObject();

            if (iDragSectionPosition === iDropSectionPosition) {
                if (iDragPosition < iDropPosition && sInsertPosition === "Before") {
                    iDropPosition--;
                }
            } else if (sInsertPosition === "After") {
                iDropPosition++;
            }

            aSectionData[iDragSectionPosition].visualizations.splice(iDragPosition, 1);
            aSectionData[iDropSectionPosition].visualizations.splice(iDropPosition, 0, oTileData);
            oModel.setProperty("/sections", aSectionData);
        },

        deleteSection: function (oEvent) {
            var oSection = oEvent.getSource(),
                iSectionIndex = oUshellPage.indexOfSection(oSection);

            var aSections = oModel.getProperty("/sections");
            aSections.splice(iSectionIndex, 1);
            oModel.setProperty("/sections", aSections);
        }
    });
});

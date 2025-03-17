// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/GenericTile",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/playground/controller/BaseController",
    "sap/ushell/library",
    "sap/m/library"
], function (
    GenericTile,
    JSONModel,
    BaseController,
    ushellLibrary,
    mLibrary
) {
    "use strict";

    var GenericTileMode = mLibrary.GenericTileMode;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    return BaseController.extend("sap.ushell.playground.controller.ExtendedChangeDetection", {
        onInit: function () {
            this.oModel = new JSONModel({
                visualizations: [{
                    id: "tile1",
                    title: "Tile No. 1",
                    subtitle: "sub1sub",
                    displayFormatHint: DisplayFormat.Standard
                }, {
                    id: "tile2",
                    title: "Tile No. 2",
                    subtitle: "sub2sub",
                    displayFormatHint: DisplayFormat.Standard
                }, {
                    id: "tile3",
                    title: "Tile No. 3",
                    subtitle: "sub3sub",
                    displayFormatHint: DisplayFormat.Compact
                }, {
                    id: "tile4",
                    title: "Tile No. 4",
                    subtitle: "sub4sub",
                    displayFormatHint: DisplayFormat.Compact
                }, {
                    id: "tile5",
                    title: "Tile No. 5",
                    subtitle: "sub5sub",
                    displayFormatHint: DisplayFormat.Standard
                }]
            });

            this.oModel.setDefaultBindingMode("OneWay");

            this.oSection = this.getView().byId("playgroundSection");
            this.getView().setModel(this.oModel);
        },

        _visualizationsFactory: function (sId, oContext) {
            return new GenericTile({
                header: "{title}",
                subheader: {
                    parts: ["title", "subtitle", "displayFormat"],
                    formatter: function () {
                        return this.getId();
                    }
                },
                mode: "{= ${displayFormatHint} === '" + DisplayFormat.Standard + "' ? '" + GenericTileMode.ContentMode + "' : '" + GenericTileMode.LineMode + "'}"
            });
        },

        reorderVisualizations: function (oEvent) {
            var oDragged = oEvent.getParameter("draggedControl");
            var oDropped = oEvent.getParameter("droppedControl");
            var sInsertPosition = oEvent.getParameter("dropPosition");
            var iDragPosition = this.oSection.indexOfVisualization(oDragged);
            var iDropPosition = this.oSection.indexOfVisualization(oDropped);
            var oDropPosition = this.oSection.getItemPosition(oDropped);

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                    oDropPosition.index++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
                oDropPosition.index--;
            }

            var aVisualizations = this.oModel.getProperty("/visualizations");
            var oVisualization = aVisualizations.splice(iDragPosition, 1)[0];

            aVisualizations.splice(iDropPosition, 0, oVisualization);
            this.oModel.setProperty("/visualizations", aVisualizations);
        }
    });
});

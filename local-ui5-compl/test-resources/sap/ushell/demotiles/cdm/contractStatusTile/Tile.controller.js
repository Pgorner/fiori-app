// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/datajs",
    "sap/ushell/library",
    "sap/ushell/components/tiles/utils",
    "sap/ui/core/IconPool",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/Container"
], function (
    Controller,
    JSONModel,
    datajs,
    ushellLibrary,
    utils,
    IconPool,
    WindowUtils,
    Container
) {
    "use strict";

    /* global hasher */

    return Controller.extend("sap.ushell.demotiles.cdm.contractStatusTile.Tile", {
        onInit: function () {
            var oComponentDataProperties = this.getOwnerComponent().getComponentData().properties || {};
            var oView = this.getView();
            var oModel = new JSONModel({
                tileTitle: oComponentDataProperties.title || "Contract Status",
                tileSubtitle: "invisible", // set dynamically
                refreshCount: 0,
                backgroundImage: sap.ui.require.toUrl("sap/ushell/demotiles/cdm/contractStatusTile/contract_status_visible.png"),
                navigationTargetUrl: oComponentDataProperties.targetURL || "",
                search: {}
            });
            oView.setModel(oModel);

            //adopt tileSize behavior and updates
            Container.getServiceAsync("Configuration").then(function (oService) {
                oService.attachSizeBehaviorUpdate(function (sSizeBehavior) {
                    oModel.setProperty("/sizeBehavior", sSizeBehavior);
                });
            });
        },

        refreshHandler: function (oTileController) {
            var oModel = this.getView().getModel();
            var nRefreshCount = oModel.getProperty("/refreshCount");

            // increase counter
            oModel.setProperty("/refreshCount", nRefreshCount + 1);

            // indicate the value just changed:
            oModel.setProperty("/stateArrow", "Up");
            oModel.setProperty("/numberState", "Good");

            window.setTimeout(function () {
                oModel.setProperty("/stateArrow", "None");
                oModel.setProperty("/numberState", "Neutral");
            }, 10000);
        },

        visibleHandler: function (isVisible) {
            var oModel = this.getView().getModel();
            if (isVisible) {
                oModel.setProperty("/icon", "sap-icon://show");
                oModel.setProperty("/tileSubtitle", "visible");
            } else {
                oModel.setProperty("/icon", "sap-icon://hide");
                oModel.setProperty("/tileSubtitle", "invisible");
            }
        },

        setVisualPropertiesHandler: function (oNewProperties) {
            if (oNewProperties.title) {
                this.getView().getModel().setProperty("/tileTitle", oNewProperties.title);
            }
        },

        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function () {
            var oModel = this.getView().getModel(),
                sTargetUrl = oModel.getProperty("/navigationTargetUrl");

            if (sTargetUrl) {
                if (sTargetUrl[0] === "#") {
                    hasher.setHash(sTargetUrl);
                } else {
                    WindowUtils.openURL(sTargetUrl, "_blank");
                }
            }
        },

        formatters: {
            urlToExternal: function (sUrl) {
                // Any subsequent FLP tab/window should be opened with the appState=lean URL parameter.
                // append appState only in the case when URL starts with "#".
                if ((sUrl || "").charAt(0) !== "#") {
                    return sUrl;
                }

                var sQuery = window.location.search;
                if (!sQuery) {
                    sQuery = "?appState=lean";
                } else if (sQuery.indexOf("appState=") >= -1) { // avoid duplicates: lean FLP opens a link again
                    sQuery += "&appState=lean";
                }
                return window.location.origin + window.location.pathname + sQuery + sUrl;
            }
        }
    });
});

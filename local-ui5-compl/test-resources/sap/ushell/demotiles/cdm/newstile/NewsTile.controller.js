// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/ushell/demotiles/cdm/newstile/NewsTileUtils",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    Element,
    Controller,
    NewsTileUtils,
    JSONModel,
    Container
) {
    "use strict";

    // ===========================================================================================
    //       This demo tile is only used for test content and shall not be used productively!
    // ===========================================================================================
    // The demo version does only support a limited set of features in comparison to the original news tile

    return Controller.extend("sap.ushell.demotiles.cdm.newstile.NewsTile", {
        onInit: function () {
            this._oConfig = this.getOwnerComponent().getManifestEntry("/sap.ui5/config");

            this.oModel = new JSONModel({
                items: []
            });
            this.getView().setModel(this.oModel);

            this.refreshFeeds();
        },

        select: function (evt) {
            // Determine current news feed item
            var itemId = evt.getParameter("id"); // <- "itemId"
            var feedItem = Element.getElementById(itemId);
            this.getView().selectedItem = feedItem;

            // Navigate to navigation sample app
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossAppNavigator) {
                oCrossAppNavigator.toExternal({
                    target: {
                        semanticObject: "Action",
                        action: "toappnavsample"
                    },
                    params: {
                        newsViewId: this.getView().getId()
                    }
                });
            }.bind(this));
        },

        getDefaultImages: function () {
            var vDefaultImages = [];
            var oTileProperties = this.getOwnerComponent().getComponentData().properties;

            var oDefaultImage = NewsTileUtils.getDefaultImageConfig(this._oConfig, oTileProperties);

            if (!oDefaultImage) {
                vDefaultImages = NewsTileUtils.getFinalDefaultImages(this._oConfig, oTileProperties);
            } else {
                vDefaultImages.push(oDefaultImage);
            }
            return vDefaultImages;
        },

        refreshFeeds: function () {
            var oTileProperties = this.getOwnerComponent().getComponentData().properties;
            var aFeedLinks = NewsTileUtils.getFeedConfiguration(this._oConfig, oTileProperties);

            return NewsTileUtils.fetchRssFeeds(aFeedLinks)
                .then(function (aFeedItems) {
                    if (!aFeedItems.length) {
                        aFeedItems = this.getPreviewData();
                    }

                    aFeedItems.sort(function (oItem1, oItem2) {
                        return oItem2.pubDate - oItem1.pubDate;
                    });

                    if (!NewsTileUtils.getUseDefaultImageConfig(this._oConfig, oTileProperties)) {
                        var vDefaultImages = this.getDefaultImages();
                        aFeedItems.forEach(function (oItem, iIndex) {
                            oItem.image = NewsTileUtils.getDefaultImage(vDefaultImages, iIndex);
                        });
                    }

                    this.oModel.setProperty("/items", aFeedItems);
                }.bind(this));
        },

        getPreviewData: function () {
            return [{
                title: "No articles to display",
                source: ""
            }];
        }
    });
});

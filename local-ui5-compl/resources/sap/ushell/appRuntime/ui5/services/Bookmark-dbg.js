// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.Bookmark}.
 *
 * @version 1.132.1
 * @deprecated since 1.120. Use {@link sap.ushell.services.BookmarkV2} instead.
 */
sap.ui.define([
    "sap/ushell/services/Bookmark",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext"
], function (
    Bookmark,
    AppRuntimeService,
    AppRuntimeContext
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.Bookmark
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.Bookmark}.
     *
     * @hideconstructor
     *
     * @private
     * @deprecated since 1.120. Use {@link sap.ushell.services.BookmarkV2} instead.
     */
    function BookmarkProxy (oContainerInterface, sParameters, oServiceConfiguration) {
        Bookmark.call(this, oContainerInterface, sParameters, oServiceConfiguration);

        //addBookmark(oParameters, vContainer?) : object - jQuery.Deferred promise
        //Adds a bookmark tile to one of the user's classic homepage groups or to multiple provided content nodes.
        this.addBookmark = function (oParameters, vContainer) {
            var oDeferred = new jQuery.Deferred();
            var fnAddBookmark = function () {
                return AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.Bookmark.addBookmarkUI5", {
                        oParameters: oParameters,
                        vContainer: vContainer
                    });
            };

            if (oParameters.url.startsWith("#")) {
                AppRuntimeContext.checkIntentsConversionForScube([{ intent: oParameters.url }]).then(function (aIntentResult) {
                    oParameters.url = aIntentResult[0].intent;
                    fnAddBookmark().then(oDeferred.resolve, oDeferred.reject);
                });
            } else {
                fnAddBookmark().then(oDeferred.resolve, oDeferred.reject);
            }

            return oDeferred.promise();
        };

        this.getShellGroupIDs = function () {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.getShellGroupIDs");
        };

        this.addBookmarkByGroupId = function (oParameters, groupId) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.addBookmark",
                {
                    oParameters: oParameters,
                    groupId: groupId
                }
            );
        };

        //addCatalogTileToGroup(sCatalogTileId, sGroupId?, oCatalogData?) : object - jQuery.Deferred object's promise
        //Adds the catalog tile with the given ID to given group.
        this.addCatalogTileToGroup = function (sCatalogTileId, sGroupId, oCatalogData) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.addCatalogTileToGroup", {
                sCatalogTileId: sCatalogTileId,
                sGroupId: sGroupId,
                oCatalogData: oCatalogData
            });
        };

        //countBookmarks(sUrl) : object - jQuery.Deferred object's promise
        //Counts all bookmarks pointing to the given URL from all of the user's pages
        this.countBookmarks = function (sUrl) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.countBookmarks", {
                sUrl: sUrl
            });
        };

        //deleteBookmarks(sUrl) : object - jQuery.Deferred object's promise
        //Deletes all bookmarks pointing to the given URL from all of the user's pages.
        this.deleteBookmarks = function (sUrl) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.deleteBookmarks", {
                sUrl: sUrl
            });
        };

        //updateBookmarks(sUrl, oParameters) : object - jQuery.Deferred object's promise
        //Updates all bookmarks pointing to the given URL on all of the user's pages with the given new parameters.
        this.updateBookmarks = function (sUrl, oParameters) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.updateBookmarks", {
                sUrl: sUrl,
                oParameters: oParameters
            });
        };

        //getContentNodes() : object - jQuery.Deferred promise
        //Returns available content nodes based on the current launchpad context. (Classic homepage, spaces mode)
        this.getContentNodes = function () {
            return AppRuntimeService.postMessageToFLP("sap.ushell.services.Bookmark.getContentNodes");
        };

        //addCustomBookmark(sVizType, oConfig, vContentNodes) : object - jQuery.Deferred promise
        //Adds a custom bookmark visualization to one or multiple provided content nodes.
        this.addCustomBookmark = function (sVizType, oConfig, vContentNodes) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Bookmark.addCustomBookmark", {
                    sVizType: sVizType,
                    oConfig: oConfig,
                    vContentNodes: vContentNodes
                }
            );
        };

        //countCustomBookmarks(oIdentifier) : The count of bookmarks matching the identifier. Promise
        //Counts all custom bookmarks matching exactly the identification data.
        //Can be used to check if a bookmark already exists (e.g. before updating).
        this.countCustomBookmarks = function (oIdentifier) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Bookmark.countCustomBookmarks", {
                    oIdentifier: oIdentifier
                }
            );
        };

        //updateCustomBookmarks(oIdentifier, oConfig) : The count of bookmarks which were updated. Promise
        //Updates all custom bookmarks matching exactly the identification data.
        //Only given properties are updated.
        this.updateCustomBookmarks = function (oIdentifier, oConfig) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Bookmark.updateCustomBookmarks", {
                    oIdentifier: oIdentifier,
                    oConfig: oConfig
                }
            );
        };

        //deleteCustomBookmarks(oIdentifier) : The count of bookmarks which were deleted. Promise
        //Deletes all custom bookmarks matching exactly the identification data.
        this.deleteCustomBookmarks = function (oIdentifier) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Bookmark.deleteCustomBookmarks", {
                    oIdentifier: oIdentifier
                }
            );
        };

        this.addBookmarkToPage = function (oParameters, sPageId) {
            return AppRuntimeService.postMessageToFLP("sap.ushell.services.Bookmark.addBookmarkToPage", {
                oParameters: oParameters,
                sPageId: sPageId
            });
        };
    }

    BookmarkProxy.prototype = Bookmark.prototype;
    BookmarkProxy.hasNoAdapter = Bookmark.hasNoAdapter;

    return BookmarkProxy;
}, true);

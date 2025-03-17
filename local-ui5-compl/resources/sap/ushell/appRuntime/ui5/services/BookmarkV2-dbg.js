// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.BookmarkV2}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/BookmarkV2",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext"
], function (
    BookmarkV2,
    AppRuntimeService,
    AppRuntimeContext
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.BookmarkV2
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.BookmarkV2}.
     *
     * @hideconstructor
     *
     * @private
     */
    function BookmarkV2Proxy (oContainerInterface, sParameters, oServiceConfiguration) {
        BookmarkV2.call(this, oContainerInterface, sParameters, oServiceConfiguration);

        //addBookmark(oParameters, vContainer?) : object - jQuery.Deferred promise
        //Adds a bookmark tile to one of the user's classic homepage groups or to multiple provided content nodes.
        this.addBookmark = function (oParameters, vContainer) {
            var fnAddBookmark = function () {
                return AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.BookmarkV2.addBookmarkUI5", {
                        oParameters: oParameters,
                        vContainer: vContainer
                    });
            };

            return new Promise((fnResolve, fnReject) => {
                if (oParameters.url.startsWith("#")) {
                    AppRuntimeContext.checkIntentsConversionForScube([{intent: oParameters.url}]).then(function (aIntentResult) {
                        oParameters.url = aIntentResult[0].intent;
                        fnAddBookmark().then(fnResolve).catch(fnReject);
                    }).catch(fnReject);
                } else {
                    fnAddBookmark().then(fnResolve).catch(fnReject);
                }
            });
        };

        /**
         * Returns the list of group ids and their titles.
         *
         * @param {boolean} bGetAll If set to `true`, all groups, including locked groups, are returned.
         * @returns {Promise} A promise that resolves to the list of groups. In launchpad spaces mode the promise gets rejected.
         *
         * @private
         * @deprecated As of version 1.120. Use {@link sap.ushell.services.BookmarkV2.getContentNodes} instead.
         */
        this.getShellGroupIDs = function () {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.getShellGroupIDs");
        };

        /**
         * Adds a bookmark tile to one of the user's home page groups by group id.
         *
         * @param {object} oParameters The bookmark parameters
         * @param {string} [groupId] ID of the group the bookmark tile should be added to.
         * @returns {Promise} Resolves on success.
         *
         * @private
         * @deprecated As of version 1.120. Use {@link sap.ushell.services.BookmarkV2.addBookmark} instead.
         */
        this.addBookmarkByGroupId = function (oParameters, groupId) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.addBookmark",
                {
                    oParameters: oParameters,
                    groupId: groupId
                }
            );
        };

        //countBookmarks(sUrl) : object - jQuery.Deferred object's promise
        //Counts all bookmarks pointing to the given URL from all of the user's pages
        this.countBookmarks = function (sUrl) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.countBookmarks", {
                sUrl: sUrl
            });
        };

        //deleteBookmarks(sUrl) : object - jQuery.Deferred object's promise
        //Deletes all bookmarks pointing to the given URL from all of the user's pages.
        this.deleteBookmarks = function (sUrl) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.deleteBookmarks", {
                sUrl: sUrl
            });
        };

        //updateBookmarks(sUrl, oParameters) : object - jQuery.Deferred object's promise
        //Updates all bookmarks pointing to the given URL on all of the user's pages with the given new parameters.
        this.updateBookmarks = function (sUrl, oParameters) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.updateBookmarks", {
                sUrl: sUrl,
                oParameters: oParameters
            });
        };

        //getContentNodes() : object - jQuery.Deferred promise
        //Returns available content nodes based on the current launchpad context. (Classic homepage, spaces mode)
        this.getContentNodes = function () {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.getContentNodes");
        };

        //addCustomBookmark(sVizType, oConfig, vContentNodes) : object - jQuery.Deferred promise
        //Adds a custom bookmark visualization to one or multiple provided content nodes.
        this.addCustomBookmark = function (sVizType, oConfig, vContentNodes) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.addCustomBookmark",
                {
                    sVizType: sVizType,
                    oConfig: oConfig,
                    vContentNodes: vContentNodes
                });
        };

        //countCustomBookmarks(oIdentifier) : The count of bookmarks matching the identifier. Promise
        //Counts all custom bookmarks matching exactly the identification data.
        //Can be used to check if a bookmark already exists (e.g. before updating).
        this.countCustomBookmarks = function (oIdentifier) {
           return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.countCustomBookmarks",
                {
                    oIdentifier: oIdentifier
                });
        };

        //updateCustomBookmarks(oIdentifier, oConfig) : The count of bookmarks which were updated. Promise
        //Updates all custom bookmarks matching exactly the identification data.
        //Only given properties are updated.
        this.updateCustomBookmarks = function (oIdentifier, oConfig) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.updateCustomBookmarks",
                {
                    oIdentifier: oIdentifier,
                    oConfig: oConfig
                });
        };

        //deleteCustomBookmarks(oIdentifier) : The count of bookmarks which were deleted. Promise
        //Deletes all custom bookmarks matching exactly the identification data.
        this.deleteCustomBookmarks = function (oIdentifier) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.BookmarkV2.deleteCustomBookmarks",
                {
                    oIdentifier: oIdentifier
                });
        };

        this.addBookmarkToPage = function (oParameters, sPageId) {
            return AppRuntimeService.postMessageToFLP("sap.ushell.services.BookmarkV2.addBookmarkToPage", {
                    oParameters: oParameters,
                    sPageId: sPageId
            });
        };
    }

    BookmarkV2Proxy.prototype = BookmarkV2.prototype;
    BookmarkV2Proxy.hasNoAdapter = BookmarkV2.hasNoAdapter;

    return BookmarkV2Proxy;
}, true);

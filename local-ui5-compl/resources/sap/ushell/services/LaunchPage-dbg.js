// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview The Unified Shell's page builder service providing the data for the Fiori launchpad's classic Homepage.
 * @version 1.132.1
 * @deprecated since 1.120
 */
sap.ui.define([
    "sap/ushell/services/FlpLaunchPage"
], function (
    FlpLaunchPage
) {
    "use strict";

    /**
     * @name sap.ushell.services.LaunchPage
     * @class
     * @classdesc A service for handling groups, tiles and catalogs.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const LaunchPage = await Container.getServiceAsync("LaunchPage");
     *     // do something with the LaunchPage service
     *   });
     * </pre>
     *
     * The functions that return the main objects are getGroups, getGroupTitle, getCatalogs and getCatalogTiles.
     * Since the implementation (i.e. adapter) is platform specific, do not call or access properties and functions of returned objects.
     * Instead, use other functions of the LaunchPage service with the relevant object as the input parameter.
     *
     * When using the content extension factory, any extended content needs to refer to the correct adapter with the field "contentProvider".
     *
     * @param {object} oAdapter the page builder adapter for the logon system
     * @param {object} oContainerInterface the interface provided by the container
     * @see sap.ushell.Container#getServiceAsync
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.15.0
     * @public
     * @deprecated since 1.99. This service has been deprecated as it only works for the classic homepage.
     */

    /**
     * Returns the groups of the user.
     * The order of the array is the order in which the groups will be displayed to the user.
     *
     * @name getGroups
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @returns {jQuery.Promise<object>} A promise that resolves to the list of groups
     * @public
     * @deprecated since 1.99. Alternative for use with {@link sap.ushell.services.Bookmark} is {@link sap.ushell.services.Bookmark#getContentNodes}
     */

    /**
     * Returns the default group of the user.
     *
     * @name getDefaultGroup
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @returns {jQuery.Promise} Resolves the default group.
     * @public
     */

    /**
     * Returns the title of the given group.
     *
     * @name getGroupTitle
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group whose title is returned
     * @returns {string} group title
     * @public
     */

    /**
     * Returns the unique identifier of the given group
     *
     * @name getGroupId
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group whose id is returned
     * @returns {string} Group id
     * @public
     */

    /**
     * Returns an array of 'anonymous' tiles of a group.
     * The order of the array is the order of tiles that will be displayed to the user.
     *
     * @name getGroupTiles
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group whose tiles are returned
     * @returns {object[]} The group tiles array
     * @public
     */

    /**
     * Returns an array of link tiles for a group.
     * The order of the array is the order in which the links will be displayed to the user.
     *
     * @name getLinkTiles
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group whose link tiles are returned
     * @returns {object[]} The array of link tiles
     * @public
     */

    /**
     * Adds a new group at a specific location.
     *
     * Intention: the page builder adds this group to the specific location on the home screen.
     *
     * In case of error it gets the consistent (i.e. persisted) backend state of all groups.
     *
     * @name addGroupAt
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {string} sTitle The title of the new group
     * @param {int} iIndex the location of the new group
     * @returns {jQuery.Promise} Resolves the group.
     * @public
     */

    /**
     * Adds a new group.
     *
     * Intention: the page builder adds this group to the end of the home screen.
     *
     * In case of failure it gets the consistent (i.e. persisted) backend state of all groups.
     *
     * @name addGroup
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {string} sTitle The title of the new group
     * @returns {jQuery.Promise} Resolves once the group was added.
     * @public
     */

    /**
     * Removes a group.
     *
     * Intention: the page builder already removed the page (or hid it from the user) and if successful - nothing needs to be done.
     *
     * In case of failure it gets the consistent (i.e. persisted) backend state of all groups.
     *
     * @name removeGroup
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group to be removed
     * @param {int} iIndex The index of the group to be removed
     * @returns {jQuery.Promise} Resolves once the group was removed.
     * @public
     */

    /**
     * Resets a group.
     *
     * The reset action is relevant for a group that was assigned to the user by an administrator.
     * The reset action means that the group is set back to the state defined by the administrator,
     * and changes made by the end user (e.g. adding tiles) are removed.
     * A group can be reset multiple times.
     *
     * In case of failure, or when the given group was created by the user (i.e. can't be reset)- it gets,
     * the consistent (i.e. persisted) backend state of all groups.
     * The returned group object is the same as the one returned by @see sap.ushell.services.LaunchPage.getGroups
     *
     * @name resetGroup
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group to be reset
     * @param {int} iIndex The index of the group to be reset
     * @returns {jQuery.Promise} Resolves once the group was reset.
     * @public
     */

    /**
     * Checks if a group can be removed.
     *
     * Returns <code>true</code> if the group can be removed (i.e. if the given group was created by the user)
     * and <code>false</code> if the group can only be reset.
     *
     * @name isGroupRemovable
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group to be checked
     * @returns {boolean} <code>true</code> if removable; <code>false</code> if resettable
     * @public
     */

    /**
     * Checks if a group was marked as locked (meaning the group and its tiles will lack several capabilities such as Rename, Drag&Drop...).
     *
     * Returns <code>true</code> if the group is locked and <code>false</code> if not.
     *
     * @name isGroupLocked
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group to be checked
     * @returns {boolean} <code>true</code> if locked; <code>false</code> if not (or as default in case the function was not implemented in the proper adapter).
     * @public
     */

    /**
     * Checks if a group was marked as featured (meaning the group is a Fiori 3 featured group).
     *
     * Returns <code>true</code> if the group is featured and <code>false</code> if not.
     *
     * @name isGroupFeatured
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group to be checked
     * @returns {boolean} <code>true</code> if featured; <code>false</code> if not (or as default in case the function was not implemented in the proper adapter).
     * @public
     */

    /**
     * Moves a group to a new index (i.e. location).
     *
     * Intention: the page builder already moved the page (visible to the user) and if successful - nothing needs to be done.
     * In case of failure it gets the consistent (i.e. persisted) backend state of all groups.
     *
     * @name moveGroup
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group to be moved
     * @param {int} iNewIndex The new index for the group
     * @returns {jQuery.Promise} Resolves once the group was moved.
     * @public
     */

    /**
     * Sets the title of an existing group.
     *
     * Intention: the page builder knows the new title, and if successful nothing needs to be done, as the title is already visible to the user.
     * In case of failure it gets the consistent (i.e. persisted) backend state of the group title,
     *   in most cases the old title.
     *
     * @name setGroupTitle
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group whose title is set
     * @param {string} sTitle The new title of the group
     * @returns {jQuery.Promise} Resolves once the group title was set.
     * @public
     */

    /**
     * Adds a tile to a group.
     *
     * If no group is provided then the tile is added to the default group.
     *
     * Intention: the page builder by default puts this tile at the end of the default group.
     * In case of failure it gets the consistent (i.e. persisted) backend state of the default group.
     *
     * @name addTile
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile An 'anonymous' tile from the tile catalog
     * @param {object} [oGroup] The target group
     * @returns {jQuery.Promise} Resolves once the tile was added.
     * @public
     */

    /**
     * Removes a tile from a group.
     *
     * Intention: the page builder has already 'hidden' (or removed) the tile.
     *
     * In case of failure it gets the consistent (i.e. persisted) backend state of the group.
     *
     * @name removeTile
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oGroup The group from which to remove the tile instance
     * @param {object} oTile The tile instance to remove
     * @param {int} iIndex The tile index
     * @returns {jQuery.Promise} Resolves once the tile was removed.
     * @public
     */

    /**
     * Moves a tile within a group or between different groups.
     *
     * Intention: the page builder already moved the tile.
     *
     * In case of failure it gets the consistent (i.e. persisted) backend state of the source group and the target group.
     * The result is in the following format {source:[{},{}], target:[{},{}]}.
     *
     * The source and the target groups tiles are in the form of the @see sap.ushell.services.LaunchPage.getGroupTiles
     *
     * @name moveTile
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile a tile instance to be moved. The same object type as the one returned by
     *   <code>sap.ushell.services.LaunchPage.getGroupTiles</code>
     * @param {int} iSourceIndex the index in the source group
     * @param {int} iTargetIndex the target group index, in case this parameter is not supplied we assume the move tile is
     *   within the source group using iSourceIndex
     * @param {object} oSourceGroup the source group the tile came from
     * @param {object} [oTargetGroup] The same object type as the one returned by <code>sap.ushell.services.LaunchPage.getGroups</code>
     *   the target group the tile will be placed in, in case this parameter is not supplied we assume the move tile is within the source group
     * @param {string} [sNewTileType] (added with 1.46) The new type of the tile
     * @returns {jQuery.Promise} Resolves once the tile was moved.
     * @public
     */

    /**
     * Returns the tile's unique identifier
     *
     * @name getTileId
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile
     * @returns {string} Tile id
     * @public
     */

    /**
     * Returns the tile's title.
     *
     * @name getTileTitle
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile
     * @returns {string} The title
     * @public
     */

    /**
     * Returns the tile's type.
     *
     * @name getTileType
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile
     * @returns {string} The type
     * @public
     */

    /**
     * Returns UI5 view or control of the tile.
     *
     * @name getTileView
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile
     * @returns {jQuery.Promise} Resolves the UI5 view or control of the tile.
     * @public
     */

    /**
     * Returns the press handler for clicking on a tile.
     *
     * @name getAppBoxPressHandler
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile
     * @returns {function} handler for clicking on the tile.
     * @public
     */

    /**
     * Returns the tile size in the format of 1x1 or 1x2 string
     *
     * @name getTileSize
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile
     * @returns {string} tile size in units in 1x1 format
     * @public
     */

    /**
     * Returns the tile's navigation target.
     *
     * The navigation target string is used (when assigned to <code>location.hash</code>) for performing a navigation action
     *   that eventually opens the application represented by the tile.
     *
     * @name getTileTarget
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile the tile
     * @returns {string} the tile target
     * @public
     */

    /**
     * Triggers a refresh action of a tile.
     * Typically this action is related to the value presented in dynamic tiles
     *
     * @name refreshTile
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile
     * @public
     */

    /**
     * Sets the tile's visibility state and notifies the tile about the change.
     *
     * @name setTileVisible
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile
     * @param {boolean} bNewVisible The tile's required visibility state.
     * @public
     */

    /**
     * Register an external tile actions provider callback function.
     *
     * The callback has to return an array of actions of the given tile.
     * The callback is triggered when @see sap.ushell.services.LaunchPage.getTileActions is called.
     *
     * Tile actions are additional operations that can be executed on a tile, and can be provided by external providers.
     *
     * A tile action is an object with the following properties: text, icon and targetURL or a press handler.
     *
     * Tile actions should be returned immediately without any additional server access in order to avoid delays in rendering the action list in the browser.
     *
     * @example of a tile actions provider callback:
     * <pre>
     *     function (oTile){
     *       return [
     *         {
     *           text: "Some Action",
     *           icon: "sap-icon://action",
     *           targetURL: "#SemanticObject-Action"
     *         },
     *         {
     *           text: "Settings",
     *           icon: "sap-icon://action-settings",
     *           press: function () {
     *             //Open settings UI
     *           }
     *         }
     *       ];
     *     }
     * </pre>
     *
     * Use <code>Function.prototype.bind()</code> to determine the callback's <code>this</code> or some of its arguments.
     *
     * @name registerTileActionsProvider
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} fnProvider A callback which returns an array of action objects.
     * @public
     * @deprecated since 1.99. This feature has been deprecated with the classic homepage. There is no alternative with spaces and pages.
     */

    /**
     * Returns the catalogs of the user.
     * <p>
     * Only severe failures make the overall operation fail. If loading of a remote catalog fails,
     * this is handled gracefully by providing a "dummy" empty catalog (with ID instead of title).
     * Use {@link getCatalogError} to check if a (remote) catalog could not be loaded from the backend.
     * <p>
     * Progress notifications are sent for each single catalog, i.e. attaching a <code>progress</code> handler gives you the same
     * possibilities as attaching a <code>done</code> handler, but with the advantage of improved responsiveness.
     *
     * @example
     *   sap.ushell.Container.getServiceAsync("LaunchPage")
     *     .then(function (LaunchPage) {
     *       LaunchPage.getCatalogs()
     *       .fail(function (sErrorMessage) { // string
     *         // handle error situation
     *       })
     *       .progress(function (oCatalog) { // object
     *         // do s.th. with single catalog
     *       })
     *       .done(function (aCatalogs) { // object[]
     *         aCatalogs.forEach(function (oCatalog) {
     *           // do s.th. with single catalog
     *         });
     *       });
     *     });
     *
     * @name getCatalogs
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @returns {jQuery.Promise} Resolves an array of black-box catalog objects is provided (which might be empty).
     *   In case of failure, an error message is passed.
     *   Progress notifications are sent for each single catalog, providing a single black-box catalog object each time.
     * @public
     */

    /**
     * Returns whether the catalogs collection previously returned by <code>getCatalogs()</code> is still valid.
     *
     * Initially the result is <code>false</code> until <code>getCatalogs()</code> has been called.
     * Later, the result might be <code>false</code> again in case one of the catalogs has been invalidated,
     * e.g. due to adding a tile to a catalog ("Add to catalog" scenario).
     *
     * @name isCatalogsValid
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @returns {boolean} <code>true</code> in case the catalogs are still valid; <code>false</code> if not
     * @since 1.16.4
     * @see #getCatalogs
     * @public
     */

    /**
     * Returns catalog's technical data.
     *
     * @name getCatalogData
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalog the catalog
     * @returns {object} An object that includes the following properties (the list may include additional properties):
     *   <ul>
     *     <li><code>id</code>: the catalog ID
     *     <li><code>systemId</code>: [remote catalogs] the ID of the remote system
     *     <li><code>remoteId</code>: [remote catalogs] the ID of the catalog in the remote system
     *     <li><code>baseUrl</code>: [remote catalogs] the base URL of the catalog in the remote system
     *   </ul>
     * @since 1.21.2
     * @public
     */

    /**
     * Returns the catalog's technical error message in case it could not be loaded from the backend.
     * <p>
     * <b>Beware:</b> The technical error message is not translated!
     *
     * @name getCatalogError
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalog the catalog
     * @returns {string} The technical error message or <code>undefined</code> if the catalog was loaded properly
     * @since 1.17.1
     * @public
     */

    /**
     * Returns the catalog's unique identifier
     *
     * @name getCatalogId
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalog The catalog
     * @returns {string} Catalog id
     * @public
     */

    /**
     * Returns the catalog's title
     *
     * @name getCatalogTitle
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalog The catalog
     * @returns {string} Catalog title
     * @public
     */

    /**
     * Returns the tiles of a catalog.
     *
     * @name getCatalogTiles
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalog The catalog
     * @returns {jQuery.Promise} Resolve the catalog tiles.
     * @public
     */

    /**
     * Returns catalog tile's unique identifier.
     * This function may be called for a catalog tile or (since 1.21.0) for a group tile.
     * In the latter case, the function returns the unique identifier of the catalog tile on which the group tile is based.
     *
     * @name getCatalogTileId
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oTile The tile or the catalog tile
     * @returns {string} Tile id
     * @public
     */

    /**
     * Returns the catalog tile's title
     *
     * @name getCatalogTileTitle
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string} Tile title
     * @public
     */

    /**
     * Returns the size of a catalog tile as a string. For example: "1x1", "1x2"
     *
     * @name getCatalogTileSize
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string} Tile size in units in 1x1 or 1x2 format
     * @public
     */

    /**
     * Returns the UI5 view or control  of a catalog tile
     *
     * @name getCatalogTileViewControl
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @param {boolean} [bPreview] SAP-internal: Whether the tile should be displayed in preview mode
     * @returns {jQuery.Promise} Resolves the Catalog Tile View
     * @public
     */

    /**
     * Returns the UI5 view or control  of a catalog tile
     *
     * @name getCatalogTileView
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @param {boolean} [bPreview] SAP-internal: Whether the tile should be displayed in preview mode
     * @returns {object} UI5 view or control
     * @public
     * @deprecated since 1.48. Please use {@link #getCatalogTileViewControl} instead.
     */

    /**
     * Returns the navigation target URL of a catalog tile.
     *
     * @name getCatalogTileTargetURL
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string} The target URL for the catalog tile's underlying application as provided via the "preview" contract
     * @public
     */

    /**
     * Returns the tags associated with a catalog tile which can be used to find the catalog tile in a tag filter.
     *
     * @name getCatalogTileTags
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string[]} The tags associated with this catalog tile
     * @public
     */

    /**
     * Returns the keywords associated with a catalog tile which can be used to find the catalog tile in a search.
     * Note: getCatalogTileViewControl <b>must</b> be called <b>before</b> this method. Otherwise the keywords may be incomplete.
     *
     * @name getCatalogTileKeywords
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string[]} The keywords associated with this catalog tile
     * @public
     */

    /**
     * Returns the technical attributes associated with a catalog tile which can be used define additional tags for apps.
     * Note: getCatalogTileViewControl <b>must</b> be called <b>before</b> this method. Otherwise the technical attributes may be incomplete.
     *
     * @name getCatalogTileTechnicalAttributes
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string[]} The technical attributes associated with this catalog tile if this is supported by the adapter implementation
     * @public
     */

    /**
     * Returns preview title for a catalog tile.
     *
     * @name getCatalogTilePreviewTitle
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string} Preview title for the catalog tile's underlying application as provided via the "preview" contract
     * @since 1.16.3
     * @public
     */

    /**
     * Returns the catalog tile info
     *
     * @name getCatalogTilePreviewInfo
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string} The catalog tile info
     * @since 1.67.0
     * @public
     */

    /**
     * Returns preview subtitle for a catalog tile.
     *
     * @name getCatalogTilePreviewSubtitle
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string} Preview subtitle for the catalog tile's underlying application as provided via the "preview" contract
     * @since 1.40
     * @public
     */

    /**
     * Returns preview icon for a catalog tile.
     *
     * @name getCatalogTilePreviewIcon
     * @function
     * @memberof sap.ushell.services.LaunchPage#
     * @param {object} oCatalogTile The catalog tile
     * @returns {string} Preview icon as URL/URI for the catalog tile's underlying application as provided via the "preview" contract
     * @since 1.16.3
     * @public
     */

    // return private API implementation
    return FlpLaunchPage;
}, true /* bExport */);

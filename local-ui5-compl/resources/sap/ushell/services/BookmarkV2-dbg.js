// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's bookmark service. Allows creating shortcuts on the user's home page.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/base/util/deepClone",
    "sap/base/util/deepExtend",
    "sap/base/Log",
    "sap/ushell/utils",
    "sap/ushell/Container"
], (
    EventBus,
    Config,
    ushellLibrary,
    deepClone,
    deepExtend,
    Log,
    ushellUtils,
    Container
) => {
    "use strict";

    const sModuleName = "sap.ushell.services.BookmarkV2";

    // shortcut for sap.ushell.ContentNodeType
    const ContentNodeType = ushellLibrary.ContentNodeType;

    /**
     * @alias sap.ushell.services.BookmarkV2
     * @class
     * @classdesc The Unified Shell's bookmark service.
     * Allows creating shortcuts on the user's home page.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const BookmarkV2 = await Container.getServiceAsync("BookmarkV2");
     *     // do something with the BookmarkV2 service
     *   });
     * </pre>
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.119.0
     * @public
     */
    function BookmarkV2 () {
        /**
         * Classical home page service
         * @returns {Promise} LaunchPage service promise
         * @private
         * @deprecated As of version 1.120
         */
        this._getLaunchPageService = function () {
            if (!this._oLaunchPageServicePromise) {
                this._oLaunchPageServicePromise = Container.getServiceAsync("FlpLaunchPage");
            }
            return this._oLaunchPageServicePromise;
        };

        // Pages service for spaces mode
        this._getPagesService = function () {
            if (!this._oPagesServicePromise) {
                this._oPagesServicePromise = Container.getServiceAsync("Pages");
            }
            return this._oPagesServicePromise;
        };


        /**
         * Type for data source object.
         *   Metadata for parameter serviceUrl. Mandatory to specify if parameter serviceURL contains semantic date ranges.
         *   This does not influence the data source of the app itself.
         *
         *   Specify the data source as follows:
         *   <pre>
         *   {
         *       type: "OData",
         *       settings: {
         *           odataVersion: "4.0"
         *       }
         *   }
         *   </pre>
         *
         *   <ul>
         *     <li>type: The type of the serviceURL's service. Only "OData" is supported.
         *     <li>odataVersion: The OData version of parameter serviceURL. Valid values are "2.0" and "4.0".
         *   </ul>
         * @typedef {object} sap.ushell.services.BookmarkV2.DataSource
         * @property {string} type The type of the serviceURL's service. Only "OData" is supported.
         * @property {{odataVersion:object}} settings The settings for the data source.
         * @since 1.121.0
         * @public

        /**
         * Types for bookmark parameter object.
         *
         * In addition to title and URL, a bookmark might allow further
         * settings, such as an icon or a subtitle. Which settings are supported depends
         * on the environment in which the application is running. Unsupported parameters will be
         * ignored.
         * @typedef {object} sap.ushell.services.BookmarkV2.BookmarkParameters
         * @property {string} title The title of the bookmark.
         * @property {sap.ushell.services.navigation.TargetIntent|sap.ui.core.URI} url The URL of the bookmark.
         *   The target intent or URL of the bookmark. If the target app runs in the current shell, the URL has
         *   to be a valid intent, i.e. in the format <code>"#SO-Action?P1=a&P2=x&/route?RPV=1"</code>.
         * @property {string} [icon] The optional icon URL of the bookmark (e.g. <code>"sap-icon://home"</code>).
         * @property {string} [info] The optional information text of the bookmark.
         * @property {string} [subtitle] The optional subtitle of the bookmark.
         * @property {sap.ui.core.URI} [serviceUrl] The URL to a REST or OData service that provides some dynamic information for the bookmark.
         *  The URL to a REST or OData service that provides some dynamic information for the
         *   bookmark.
         *
         *   <b>Semantic Date Ranges:</b>
         *
         *   You can use placeholders for dynamic dates in the query parameters of the service URL.
         *   This can be used to create KPI tiles based on user entries in control {@link sap.m.DynamicDateRange},
         *   where it is possible to specify dynamic dates like YESTERDAY or THISYEAR.
         *
         *   The placeholder format looks like this: {Edm.&lt;type&gt;%%DynamicDate.&lt;operator&gt;.&lt;value1&gt;.&lt;value2&gt;.&lt;position&gt;%%}
         *
         *   <ul>
         *     <li>&lt;type&gt;: The Edm Type of the parameter. Supported types are String, DateTime and DateTimeOffset for OData V2
         *         and Date and DateTimeOffset for OData V4.</li>
         *     <li>&lt;operator&gt;, &lt;value1&gt;, &lt;value2&gt;: Possible values are the ones that can be used in {@link sap.m.DynamicDateRange#toDates} to create a date range.</li>
         *     <li>&lt;position&gt;: Possible values are 'start' and 'end' which mark the start or end of the interval specified by the operator.</li>
         *   </ul>
         *
         *   Examples:
         *   <ul>
         *     <li>/a/url/$count?$filter=(testDate ge {Edm.DateTimeOffset%DynamicDate.YESTERDAY.start%} and testDate le {Edm.DateTimeOffset%DynamicDate.YESTERDAY.end%})</li>
         *     <li>/a/url/$count?$filter=(testDate ge {Edm.DateTime%DynamicDate.THISYEAR.start%} and testDate le {Edm.DateTime%DynamicDate.THISYEAR.end%})</li>
         *     <li>/a/url/$count?$filter=(testDate ge {Edm.Date%DynamicDate.TODAYFROMTO.1.5.start%} and testDate le {Edm.Date%DynamicDate.TODAYFROMTO.1.5.end%})</li>
         *   </ul>
         *
         *   Hint:
         *   Check the debug log when displaying the resulting KPI tiles to get more information about the resolution of the placeholders.
         *
         * @property {sap.ushell.services.BookmarkV2.DataSource} [dataSource] Metadata for parameter serviceUrl.
         * Mandatory to specify if parameter serviceURL contains semantic date ranges.
         * @property {string} [serviceRefreshInterval] The refresh interval for the <code>serviceUrl</code> in seconds.
         * @property {string} [numberUnit] The unit for the number retrieved from <code>serviceUrl</code>.
         * @since 1.121.0
         * @public
         */

        /**
         * Adds bookmarks with the provided bookmark data to the specified content nodes.
         *
         * @param {sap.ushell.services.BookmarkV2.BookmarkParameters} oBookmarkParams Parameters which are necessary to create a bookmark
         * @param {sap.ushell.services.BookmarkV2.ContentNode[]} aContentNodes An array of content nodes to which the bookmark should be added
         * @param {boolean} [bCustom] Whether the bookmark is custom or standard
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         *
         * @returns {Promise<(undefined|string)>}
         *  The promise is resolved if the bookmark could be added to all content nodes.
         *  The promise is rejected with an error message if the bookmark couldn't be saved.
         *
         * @see sap.ushell.services.BookmarkV2#addBookmark
         * @since 1.119.0
         * @private
         */
        this._addBookmarkToContentNodes = async function (oBookmarkParams, aContentNodes, bCustom, sContentProviderId) {
            const aPromises = aContentNodes.map(async (oContentNode) => {
                if (oContentNode && oContentNode.hasOwnProperty("type") && oContentNode.isContainer) {
                    if (oContentNode.type === ContentNodeType.Page) {
                        return this.addBookmarkToPage(oBookmarkParams, oContentNode.id, sContentProviderId);
                    }
                    // deprecated As of version 1.120
                    if (oContentNode.type === ContentNodeType.HomepageGroup) {
                        const LaunchPage = await this._getLaunchPageService();
                        const oGroup = await ushellUtils.promisify(LaunchPage.getGroupById(oContentNode.id));

                        return this.addBookmarkToHomepageGroup(oBookmarkParams, oGroup, bCustom, sContentProviderId);
                    }
                    throw new Error(`Bookmark Service: The API needs to be called with a valid content node type. '${ oContentNode.type }' is not supported.`);
                }
                throw new Error("Bookmark Service: Not a valid content node.");
            });

            return Promise.all(aPromises);
        };


        /**
         * Adds a bookmark tile to the provided content nodes.
         *
         * @param {sap.ushell.services.BookmarkV2.BookmarkParameters} oParameters
         *   Bookmark parameters. In addition to title and URL, a bookmark might allow further
         *   settings, such as an icon or a subtitle. Which settings are supported depends
         *   on the environment in which the application is running. Unsupported parameters will be
         *   ignored.
         *
         *
         * @param {sap.ushell.services.BookmarkV2.ContentNode|sap.ushell.services.BookmarkV2.ContentNode[]} [vContainer]
         *   Either a content node or an array of content nodes (see {@link #getContentNodes}).
         *   If not provided, the bookmark will be added to the default page.
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         * @returns {Promise} A promise which resolves on success
         * @throws {Error} rejects
         *   with a reason-message on failure to add the bookmark to the specified or implied content node.
         *   The promise gets resolved if personalization is disabled.
         *
         * @see sap.ushell.services.URLParsing#getShellHash
         * @since 1.119.0
         * @public
         */
        this.addBookmark = async function (oParameters, vContainer, sContentProviderId) {
            const bEnablePersonalization = Config.last("/core/shell/enablePersonalization");
            const bEnableSpace = Config.last("/core/spaces/enabled");
            const bEnableMyHome = Config.last("/core/spaces/myHome/enabled");

            // Ignore call and do not complain if personalization is disabled
            if (!bEnablePersonalization && (!bEnableSpace || !bEnableMyHome)) {
                return;
            }

            try {
                await this._checkBookmarkParameters(oParameters);

                const oBookmarkConfig = deepClone(oParameters, 20);
                oBookmarkConfig.url = await this._changeUrlStatesToPersistent(oBookmarkConfig.url);

                // Check if no container was provided and we are in spaces mode.
                if (typeof vContainer === "undefined" && bEnableSpace) {
                    const Menu = await Container.getServiceAsync("Menu");
                    const oDefaultSpace = await Menu.getDefaultSpace();
                    const oDefaultPage = oDefaultSpace && oDefaultSpace.children && oDefaultSpace.children[0];
                    return this._addBookmarkToContentNodes(oBookmarkConfig, [oDefaultPage], false, sContentProviderId);
                }

                /**
                 * Check if an old Launchpad Group object was provided instead of a content node
                 * @deprecated As of version 1.120
                 */
                if ((typeof vContainer === "undefined" || !vContainer.hasOwnProperty("type")) && !Array.isArray(vContainer)) {
                    return this.addBookmarkToHomepageGroup(oBookmarkConfig, vContainer, false, sContentProviderId);
                }

                // Make sure we always use an array of content nodes
                const aContentNodes = [].concat(vContainer);

                return this._addBookmarkToContentNodes(oBookmarkConfig, aContentNodes, false, sContentProviderId);
            } catch (vError) {
                Log.error("Error during Bookmark creation: ", vError, sModuleName);
                throw vError;
            }
        };

        /**
         * Adds a custom bookmark visualization to one or multiple provided content nodes.
         *
         * @param {string} sVizType
         *   Specifies what tile should be created, for example
         *   "ssuite.smartbusiness.abap.tiles.contribution"
         *
         * @param {object} oConfig
         *   Viz type specific configuration including all parameters the visualization needs.
         * @param {string} oConfig.title
         *   Title of the visualization.
         * @param {string} oConfig.url
         *   The URL of the bookmark. If the target application shall run in the Shell, the URL has
         *   to be in the format <code>"#SemanticObject-Action?P1=a&P2=x&/route?RPV=1"</code>.
         * @param {string} [oConfig.subtitle]
         *   Subtitle of the visualization.
         * @param {string} [oConfig.icon]
         *   Icon of the visualization.
         * @param {string} [oConfig.info]
         *   Icon of the visualization.
         * @param {object} oConfig.vizConfig
         *   Can include any app descriptor (manifest.json) namespace the visualization
         *   needs. For example sap.app/datasources.
         * @param {boolean} [oConfig.loadManifest=false]
         *   false: viz config (merged with viz type) represents the full manifest which is injected into UI5 and replaces the manifest of the viz type's component. The latter is not loaded at all.
         *   true: (experimental) Manifest of viz type's component is loaded, oConfig.vizConfig is NOT merged with the component. In future both may be merged!
         *
         * @param {object} [oConfig.chipConfig]
         *   Simplified UI2 CHIP (runtime) model allowing for creation for tiles
         *   based on the ABAP stack. This can be considered as a compatibility feature.
         *   Will end-up in vizConfig/sap.flp/chipConfig.
         * @param {string} [oConfig.chipConfig.chipId]
         *   Specifies what chip is going to be instantiated on the ABAP stack.
         *   The chipId is mandatory when used in a FLP running on ABAP.
         * @param {object} [oConfig.chipConfig.bags]
         *   Simplified model of UI2 bags
         * @param {object} [oConfig.chipConfig.configuration]
         *   UI2 configuration parameters
         *
         * @param {(sap.ushell.services.BookmarkV2.ContentNode|sap.ushell.services.BookmarkV2.ContentNode[])} vContentNodes
         *   Either an array of ContentNodes or a single ContentNode in which the Bookmark will be placed.
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         *
         * @returns {Promise<(undefined|string)>}
         *   A promise which resolves on success, but rejects
         *   with a reason-message if the bookmark couldn't be created.
         *
         * @since 1.119.0
         * @private
         * @ui5-restricted ssuite.smartbusiness
         */
        this.addCustomBookmark = async function (sVizType, oConfig, vContentNodes, sContentProviderId) {
            const oClonedConfig = deepClone(oConfig);
            const oBookmarkConfig = deepExtend(oClonedConfig, {
                vizType: sVizType,
                vizConfig: {
                    "sap.flp": {
                        chipConfig: oClonedConfig.chipConfig
                    },
                    "sap.platform.runtime": {
                        includeManifest: !oClonedConfig.loadManifest
                    }
                }
            });

            delete oBookmarkConfig.chipConfig;
            delete oBookmarkConfig.loadManifest;

            oBookmarkConfig.url = await this._changeUrlStatesToPersistent(oBookmarkConfig.url);

            // Make sure we always use an array of content nodes
            const aContentNodes = [].concat(vContentNodes);

            return this._addBookmarkToContentNodes(oBookmarkConfig, aContentNodes, true, sContentProviderId);
        };

        /**
         * Adds a bookmark tile to one of the user's home page groups in the classic home page mode.
         *
         * @param {object} oParameters
         *   bookmark parameters. In addition to title and URL, a bookmark might allow additional
         *   settings, such as an icon or a subtitle. Which settings are supported depends
         *   on the environment in which the application is running. Unsupported parameters will be
         *   ignored.
         *
         * @param {string} oParameters.title
         *   The title of the bookmark.
         * @param {sap.ui.core.URI|sap.ushell.services.Navigation.TargetIntent} oParameters.url
         *   The URL of the bookmark. If the target application shall run in the Shell the URL has
         *   to be in the format <code>"#SO-Action~Context?P1=a&P2=x&/route?RPV=1"</code>.
         * @param {string} [oParameters.icon]
         *   The optional icon URL of the bookmark (e.g. <code>"sap-icon://home"</code>).
         * @param {string} [oParameters.info]
         *   The optional information text of the bookmark. This property is not relevant in the CDM
         *   context.
         * @param {string} [oParameters.subtitle]
         *   The optional subtitle of the bookmark.
         * @param {sap.ui.core.URI} [oParameters.serviceUrl]
         *   The URL to a REST or OData service that provides some dynamic information for the
         *   bookmark.
         * @param {string} [oParameters.serviceRefreshInterval]
         *   The refresh interval for the <code>serviceUrl</code> in seconds.
         * @param {string} [oParameters.numberUnit]
         *   The unit for the number retrieved from <code>serviceUrl</code>.
         *   This property is not relevant in the CDM context.
         * @param {object} [oGroup]
         *  Optional reference to the group the bookmark tile should be added to.
         *  If not given, the default group is used.
         * @param {boolean} [bCustom] Whether the bookmark is custom or standard
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         *
         * @returns {Promise}
         *   A promise which resolves on success, but rejects
         *   with a reason-message on failure to add the bookmark to the specified home page group.
         *
         * @see sap.ushell.services.URLParsing#getShellHash
         * @since 1.119.0
         * @deprecated As of version 1.120
         * @private
         */
        this.addBookmarkToHomepageGroup = async function (oParameters, oGroup, bCustom, sContentProviderId) {
            // Reject if in launchpad spaces mode
            if (Config.last("/core/spaces/enabled")) {
                throw new Error("Bookmark Service: The API is not available in spaces mode.");
            }

            // Delegate to launchpage service and publish event
            const oService = await this._getLaunchPageService();
            let oTile;
            if (bCustom) {
                oTile = await ushellUtils.promisify(oService.addCustomBookmark(oParameters, oGroup, sContentProviderId));
            } else {
                oTile = await ushellUtils.promisify(oService.addBookmark(oParameters, oGroup, sContentProviderId));
            }
            const oData = {
                tile: oTile,
                group: oGroup
            };
            EventBus.getInstance().publish("sap.ushell.services.Bookmark", "bookmarkTileAdded", oData);
        };

        /**
         * Adds a bookmark tile to one of the user's pages in spaces mode.
         *
         * @param {sap.ushell.services.BookmarkV2.BookmarkParameters} oParameters
         *   bookmark parameters. In addition to title and URL, a bookmark might allow additional
         *   settings, such as an icon or a subtitle. Which settings are supported depends
         *   on the environment in which the application is running. Unsupported parameters will be
         *   ignored.
         *
         * @param {string} sPageId The ID of the page to which the bookmark should be added.
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         *
         * @returns {Promise}
         *   A promise which resolves on success, but rejects
         *   with a reason-message on failure to add the bookmark to the specified page.
         *
         * @see sap.ushell.services.URLParsing#getShellHash
         * @since 1.119.0
         * @private
         */
        this.addBookmarkToPage = async function (oParameters, sPageId, sContentProviderId) {
            // Reject of in launchpad home page mode
            if (!Config.last("/core/spaces/enabled")) {
                throw new Error("Bookmark Service: 'addBookmarkToPage' is not valid in launchpad home page mode, use 'addBookmark' instead.");
            }

            // Reject if personalization is disabled
            const bEnablePersonalization = Config.last("/core/shell/enablePersonalization");
            const bEnableMyHome = Config.last("/core/spaces/myHome/enabled");
            const sMyHomePageId = Config.last("/core/spaces/myHome/myHomePageId");
            if (!bEnablePersonalization && (!bEnableMyHome || (bEnableMyHome && sPageId !== sMyHomePageId))) {
                throw new Error("Bookmark Service: Add bookmark is not allowed as the personalization functionality is not enabled.");
            }

            if (oParameters && (typeof oParameters.title !== "string" || typeof oParameters.url !== "string")) {
                throw new Error("Bookmark Service - Invalid bookmark data.");
            }

            // Delegate to pages service
            const Pages = await this._getPagesService();
            return Pages.addBookmarkToPage(sPageId, oParameters, undefined, sContentProviderId);
        };

        /**
         * Adds a bookmark tile to one of the user's home page groups by group id.
         *
         * @param {object} oParameters
         *   bookmark parameters. In addition to title and URL, a bookmark might allow additional
         *   settings, such as an icon or a subtitle. Which settings are supported depends
         *   on the environment in which the application is running. Unsupported parameters will be
         *   ignored.
         *   For list of parameters see the description for the addBookmark function
         * @param {string} [groupId]
         *   ID of the group the bookmark tile should be added to.
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         *   The Content Provider ID.
         *
         * @returns {Promise}
         *   A <code>Promise</code> which resolves on success, but rejects
         *   (with a reason-message) on failure to add the bookmark to the specified or implied group.
         *    In launchpad spaces mode the promise gets rejected.
         *
         * @see sap.ushell.services.URLParsing#getShellHash
         * @since 1.119.0
         * @deprecated As of version 1.120. Use {@link sap.ushell.services.BookmarkV2.addBookmark} instead.
         * @private
         */
        this.addBookmarkByGroupId = async function (oParameters, groupId, sContentProviderId) {
            // Reject if in launchpad spaces mode
            if (Config.last("/core/spaces/enabled")) {
                const sError = "Bookmark Service: The API 'addBookmarkByGroupId' is not supported in launchpad spaces mode.";
                throw new Error(sError);
            }

            const LaunchPage = await this._getLaunchPageService();
            const aGroups = await ushellUtils.promisify(LaunchPage.getGroups());
            const oGroup = aGroups.find((entry) => entry.id === groupId) || null;

            return this.addBookmark(oParameters, oGroup, sContentProviderId);
        };

        /**
         * Returns the list of group ids and their titles of the user together with filtering out all groups that can not
         * be selected when adding a bookmark.
         * The order of the array is the order in which the groups will be displayed to the user.
         * the API is used from "AddBookmarkButton" by not native UI5 applications
         *
         * @param {boolean} bGetAll If set to `true`, all groups, including locked groups, are returned.
         * @returns {Promise} A promise that resolves to the list of groups. In launchpad spaces mode the promise gets rejected.
         *
         * @since 1.119.0
         * @deprecated As of version 1.120. Use {@link sap.ushell.services.BookmarkV2.getContentNodes} instead.
         * @private
         */
        this.getShellGroupIDs = async function (bGetAll) {
            // Reject if in launchpad spaces mode
            if (Config.last("/core/spaces/enabled")) {
                const sError = "Bookmark Service: The API 'getShellGroupIDs' is not supported in launchpad spaces mode.";
                throw new Error(sError);
            }

            const LaunchPage = await this._getLaunchPageService();
            let aGroups = await ushellUtils.promisify(LaunchPage.getGroupsForBookmarks(bGetAll));
            aGroups = aGroups.map((group) => {
                return {
                    id: LaunchPage.getGroupId(group.object),
                    title: group.title
                };
            });
            return aGroups;
        };

        /**
         * Check if the bookmark parameters are valid.
         *
         * @param {object} oParameters The bookmark parameters
         * @returns {Promise<undefined>} Rejects with an error message if invalid bookmark data is found.
         *
         * @since 1.119.0
         * @private
         */
        this._checkBookmarkParameters = async function (oParameters) {
            if (!oParameters) {
                throw new Error("Invalid Bookmark Data: No bookmark parameters passed.");
            }
            const oDataSource = oParameters.dataSource;
            let sODataVersion;
            if (oDataSource) {
                if (oDataSource.type !== "OData") {
                    throw new Error(`Invalid Bookmark Data: Unknown data source type: ${oDataSource.type}`);
                }

                sODataVersion = oDataSource.settings && oDataSource.settings.odataVersion;
                const aValidODataVersions = ["2.0", "4.0"];
                if (!aValidODataVersions.includes(sODataVersion)) {
                    throw new Error(`Invalid Bookmark Data: Unknown OData version in the data source: ${sODataVersion}`);
                }
            }

            if (oParameters.serviceUrl) {
                const ReferenceResolver = await Container.getServiceAsync("ReferenceResolver");
                if (ReferenceResolver.hasSemanticDateRanges(oParameters.serviceUrl) && !oDataSource) {
                    throw new Error("Invalid Bookmark Data: Provide a data source to use semantic date ranges.");
                }
            }
        };

        /**
         * Counts <b>all</b> bookmarks pointing to the given URL from all of the user's pages. You
         * can use this method to check if a bookmark already exists.
         * <p>
         * This is a potentially asynchronous operation in case the user's pages have not yet been
         * loaded completely!
         *
         * @param {sap.ushell.services.navigation.TargetIntent|sap.ui.core.URI} sUrl
         *   The URL of the bookmarks to be counted, exactly as specified to {@link #addBookmark}.
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         *   The Content Provider ID.
         *
         * @returns {Promise<int>}
         *   A <code>Promise</code> which informs about success or failure
         *   of this asynchronous operation. In case of success, the count of existing bookmarks
         *   is provided (which might be zero). In case of failure, an error message is passed.
         *
         * @see #addBookmark
         * @since 1.119.0
         * @public
         */
        this.countBookmarks = async function (sUrl, sContentProviderId) {
            /**
             * @deprecated As of version 1.120
             */
            if (!Config.last("/core/spaces/enabled")) {
                const LaunchPage = await this._getLaunchPageService();
                return ushellUtils.promisify(LaunchPage.countBookmarks(sUrl, sContentProviderId));
            }

            const Pages = await this._getPagesService();
            return Pages.countBookmarks({ url: sUrl, contentProviderId: sContentProviderId });
        };

        /**
         * Counts <b>all</b> custom bookmarks matching exactly the identification data.
         * Can be used to check if a bookmark already exists (e.g. before updating).
         *
         * @param {object} oIdentifier
         *   An object which is used to find the bookmarks by matching the provided properties.
         * @param {string} oIdentifier.url
         *   The URL which was used to create the bookmark using {@link #addCustomBookmark}.
         * @param {string} oIdentifier.vizType
         *   The visualization type (viz type) which was used to create the bookmark using {@link #addCustomBookmark}.
         *   The viz type is only used by the FLP running on CDM.
         * @param {string} [oIdentifier.chipId]
         *   The chipId which was used to create the bookmark using {@link #addCustomBookmark}.
         *   The chipId is mandatory when used in a FLP running on ABAP.
         *
         * @returns {Promise<int>} The count of bookmarks matching the identifier.
         *
         * @see #addCustomBookmark
         * @since 1.119.0
         * @private
         * @ui5-restricted ssuite.smartbusiness
         */
        this.countCustomBookmarks = async function (oIdentifier) {
            if (!oIdentifier || !oIdentifier.url || !oIdentifier.vizType) {
                throw new Error("countCustomBookmarks: required parameters are missing.");
            }

            /**
             * @deprecated As of version 1.120
             */
            if (!Config.last("/core/spaces/enabled")) {
                const LaunchPage = await this._getLaunchPageService();
                return LaunchPage.countCustomBookmarks(oIdentifier);
            }

            const Pages = await this._getPagesService();
            return Pages.countBookmarks(oIdentifier);
        };

        /**
         * Deletes <b>all</b> bookmarks pointing to the given URL from all of the user's pages.
         *
         * @param {sap.ushell.services.navigation.TargetIntent|sap.ui.core.URI} sUrl
         *   The URL of the bookmarks to be deleted, exactly as specified to {@link #addBookmark}.
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         *
         * @returns {Promise<int>}
         *   A <code>Promise</code> which informs about success or
         *   failure of this asynchronous operation. In case of success, the number of deleted
         *   bookmarks is provided (which might be zero). In case of failure, an error message is
         *   passed.
         *
         * @see #addBookmark
         * @see #countBookmarks
         * @since 1.119.0
         * @public
         */
        this.deleteBookmarks = async function (sUrl, sContentProviderId) {
            /**
             * @deprecated As of version 1.120
             */
            if (!Config.last("/core/spaces/enabled")) {
                const LaunchPage = await this._getLaunchPageService();
                const oResult = await ushellUtils.promisify(LaunchPage.deleteBookmarks(sUrl, sContentProviderId));
                EventBus.getInstance().publish("sap.ushell.services.Bookmark", "bookmarkTileDeleted", sUrl);

                return oResult;
            }

            const Pages = await this._getPagesService();
            return Pages.deleteBookmarks({ url: sUrl, contentProviderId: sContentProviderId });
        };

        /**
         * Deletes <b>all</b> custom bookmarks matching exactly the identification data.
         * {@link #countCustomBookmarks} can be used to check upfront how many bookmarks are going to be affected.
         *
         * @param {object} oIdentifier
         *   An object which is used to find the bookmarks by matching the provided properties.
         * @param {string} oIdentifier.url
         *   The URL which was used to create the bookmark using {@link #addCustomBookmark}.
         * @param {string} oIdentifier.vizType
         *   The visualization type (viz type) which was used to create the bookmark using {@link #addCustomBookmark}.
         * @param {string} [oIdentifier.chipId]
         *   The chipId which was used to create the bookmark using {@link #addCustomBookmark}.
         *   The chipId is mandatory when used in a FLP running on ABAP.
         *
         * @returns {Promise<int>} The count of bookmarks which were deleted.
         *
         * @see #addCustomBookmark
         * @see #countCustomBookmarks
         * @since 1.119.0
         * @private
         * @ui5-restricted ssuite.smartbusiness
         */
        this.deleteCustomBookmarks = async function (oIdentifier) {
            if (!oIdentifier || !oIdentifier.url || !oIdentifier.vizType) {
                throw new Error("deleteCustomBookmarks: Some required parameters are missing.");
            }

            /**
             * @deprecated As of version 1.120
             */
            if (!Config.last("/core/spaces/enabled")) {
                const LaunchPage = await this._getLaunchPageService();
                await LaunchPage.deleteCustomBookmarks(oIdentifier);

                EventBus.getInstance().publish("sap.ushell.services.Bookmark", "bookmarkTileDeleted", oIdentifier.url);
                return;
            }

            const Pages = await this._getPagesService();
            return Pages.deleteBookmarks(oIdentifier);
        };

        /**
         * Updates <b>all</b> bookmarks pointing to the given URL on all of the user's pages
         * with the given new parameters. Parameters which are omitted are not changed in the
         * existing bookmarks.
         *
         * @param {string} sUrl
         *   The URL of the bookmarks to be updated, exactly as specified to {@link #addBookmark}.
         *   In case you need to update the URL itself, pass the old one here and the new one as
         *   <code>oParameters.url</code>!
         * @param {sap.ushell.services.BookmarkV2.BookmarkParameters} oParameters
         *   Bookmark parameters. In addition to title and URL, a bookmark might allow additional
         *   settings, such as an icon or a subtitle. Which settings are supported depends
         *   on the environment in which the application is running. Unsupported parameters will be
         *   ignored.
         * @param {string} [sContentProviderId] <b>SAP internal usage only</b> The contentProviderId or undefined outside the cFLP.
         *
         * @returns {Promise<int>}
         *   A <code>Promise</code> which informs about success or
         *   failure of this asynchronous operation. In case of success, the number of updated
         *   bookmarks is provided (which might be zero). In case of failure, an error message is
         *   passed.
         *
         * @see #addBookmark
         * @see #countBookmarks
         * @see #deleteBookmarks
         * @since 1.119.0
         * @public
         */
        this.updateBookmarks = async function (sUrl, oParameters, sContentProviderId) {
            const oBookmarkConfig = deepClone(oParameters, 20);
            oBookmarkConfig.url = await this._changeUrlStatesToPersistent(oBookmarkConfig.url);

            /**
             * @deprecated As of version 1.120
             */
            if (!Config.last("/core/spaces/enabled")) {
                const LaunchPage = await this._getLaunchPageService();
                return ushellUtils.promisify(LaunchPage.updateBookmarks(sUrl, oBookmarkConfig, sContentProviderId));
            }

            const Pages = await this._getPagesService();
            return Pages.updateBookmarks({ url: sUrl, contentProviderId: sContentProviderId }, oBookmarkConfig);
        };

        /**
         * Updates <b>all</b> custom bookmarks matching exactly the identification data.
         * Only given properties are updated.
         * {@link #countCustomBookmarks} can be used to check upfront how many bookmarks are going to be affected.
         * The vizType as well as the chipId of the bookmarks <b>cannot be changed!</b>
         *
         * @param {object} oIdentifier
         *   An object which is used to find the bookmarks by matching the provided properties.
         * @param {string} oIdentifier.url
         *   The URL which was used to create the bookmark using {@link #addCustomBookmark}.
         * @param {string} oIdentifier.vizType
         *   The visualization type (viz type) which was used to create the bookmark using {@link #addCustomBookmark}.
         * @param {string} [oIdentifier.chipId]
         *   The chipId which was used to create the bookmark using {@link #addCustomBookmark}.
         *   The chipId is mandatory when used in a FLP running on ABAP.
         *
         *  @param {object} oConfig
         *   Viz type specific configuration including all parameters the visualization needs.
         * @param {string} oConfig.title
         *   Title of the visualization.
         * @param {string} oConfig.url
         *   The URL of the bookmark. If the target application shall run in the Shell, the URL has
         *   to be in the format <code>"#SemanticObject-Action?P1=a&P2=x&/route?RPV=1"</code>.
         * @param {string} [oConfig.subtitle]
         *   Subtitle of the visualization.
         * @param {string} [oConfig.icon]
         *   Icon of the visualization.
         * @param {string} [oConfig.info]
         *   Icon of the visualization.
         * @param {object} oConfig.vizConfig
         *   Can include any app descriptor (manifest.json) namespace the visualization
         *   needs. For example sap.app/datasources.
         * @param {boolean} [oConfig.loadManifest=false]
         *   false: viz config (merged with viz type) represents the full manifest which is injected into UI5 and replaces the manifest of the viz type's component. The latter is not loaded at all.
         *   true: (experimental) Manifest of viz type's component is loaded, oConfig.vizConfig is NOT merged with the component. In future both may be merged!
         *
         * @param {object} [oConfig.chipConfig]
         *   Simplified UI2 CHIP (runtime) model allowing for creation for tiles based on the ABAP stack.
         *   This can be considered as a compatibility feature. Will end-up in vizConfig/sap.flp/chipConfig.
         *   In case of errors during the update there are no rollbacks happening. This might lead to corrupt bookmarks.
         * @param {object} [oConfig.chipConfig.bags]
         *   Simplified model of UI2 bags
         * @param {object} [oConfig.chipConfig.configuration]
         *   UI2 configuration parameters
         *
         *
         * @returns {Promise<int>} The count of bookmarks which were updated.
         *
         * @see #addCustomBookmark
         * @see #countCustomBookmarks
         * @since 1.119.0
         * @private
         * @ui5-restricted ssuite.smartbusiness
         */
        this.updateCustomBookmarks = async function (oIdentifier, oConfig) {
            if (!oIdentifier || !oIdentifier.url || !oIdentifier.vizType) {
                throw new Error("deleteCustomBookmarks: Some required parameters are missing.");
            }

            const oBookmarkConfig = deepExtend({}, oConfig, {
                vizConfig: {
                    "sap.flp": {
                        chipConfig: oConfig.chipConfig
                    },
                    "sap.platform.runtime": {
                        includeManifest: !oConfig.loadManifest
                    }
                }
            });

            delete oBookmarkConfig.chipConfig;
            delete oBookmarkConfig.loadManifest;

            oBookmarkConfig.url = await this._changeUrlStatesToPersistent(oBookmarkConfig.url);

            /**
             * @deprecated As of version 1.120
             */
            if (!Config.last("/core/spaces/enabled")) {
                const LaunchPage = await this._getLaunchPageService();
                return LaunchPage.updateCustomBookmarks(oIdentifier, oBookmarkConfig);
            }

            const Pages = await this._getPagesService();
            return Pages.updateBookmarks(oIdentifier, oBookmarkConfig);
        };

        /**
         * @typedef {object} sap.ushell.services.BookmarkV2.ContentNode
         * A tree of content nodes.
         * @property {string} id ID of the content node
         * @property {string} label Human-readable representation of a content node which can be displayed in a control
         * @property {sap.ushell.ContentNodeType} type Specifies the content node type. E.g: space, page, etc.
         * @property {boolean} isContainer Specifies if a bookmark can be added
         * @property {sap.ushell.services.BookmarkV2.ContentNode[]} [children] Specifies sub-nodes
         * @since 1.121.0
         * @public
         */

        /**
         * Returns available content nodes.
         *
         * @returns {Promise<sap.ushell.services.BookmarkV2.ContentNode[]>} Promise resolving the currently available content nodes.
         *
         * @public
         * @since 1.119.0
         */
        this.getContentNodes = async function () {
            /**
             * @deprecated As of version 1.120
             */
            if (!Config.last("/core/spaces/enabled")) {
                // Classic home page
                const LaunchPage = await this._getLaunchPageService();
                const aHomepageGroups = await ushellUtils.promisify(LaunchPage.getGroupsForBookmarks());

                const aResults = aHomepageGroups.map((oBookmarkGroup) => {
                    return {
                        id: LaunchPage.getGroupId(oBookmarkGroup.object),
                        label: oBookmarkGroup.title,
                        type: ContentNodeType.HomepageGroup,
                        isContainer: true
                    };
                });
                return aResults;
            }

            // Spaces mode
            const Menu = await Container.getServiceAsync("Menu");
            return Menu.getContentNodes();
        };

        /**
         * If the bookmark created contains state keys, change their state
         * to be persistent (originally, a cFLP requirement).
         * In case of an error, the function reports it but it will not stop
         * the creation of the bookmark.
         *
         * @param {string} sUrl The URL of the bookmark.
         * @returns {Promise<string>} The URL with the changed states
         * @since 1.133
         * @private
         */
        this._changeUrlStatesToPersistent = async function (sUrl) {
            const AppState = await Container.getServiceAsync("AppState");

            const bAppStateConfigPersistent = AppState.getPersistentWhenShared();
            // gate keeper - if the platform did not implement yet the new persistency mechanism
            // with different persistency method types, no action should be taken
            if (AppState.getSupportedPersistencyMethods().length === 0 && bAppStateConfigPersistent !== true) {
                return sUrl;
            }

            if (!sUrl || typeof sUrl !== "string") {
                return sUrl;
            }

            return ushellUtils.promisify(AppState.setAppStateToPublic(sUrl));
        };
    }


    BookmarkV2.hasNoAdapter = true;
    return BookmarkV2;
}, true /* bExport */);

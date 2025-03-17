// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview MenuAdapter for the CEP platform
 *
 * Provides the API functions:
 * - MenuAdapter.prototype.isMenuEnabled
 * - MenuAdapter.prototype.getMenuEntries
 * - MenuAdapter.prototype.getContentNodes
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Localization",
    "sap/ushell/components/tiles/utils",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/utils/HttpClient",
    "sap/ushell/utils/workpage/WorkPageService"
], function (
    Log,
    Localization,
    utils,
    Config,
    ushellLibrary,
    HttpClient,
    WorkPageService
) {
    "use strict";

    // shortcut for sap.ushell.ContentNodeType
    var oContentNodeTypes = ushellLibrary.ContentNodeType;

    var sCEPMenuAdapterComponent = "sap.ushell.adapters.cep.MenuAdapter";

    /**
     * @typedef {object} MenuData - The menu fetched from the site data.
     * @property {string} id - The id of the menu entry.
     * @property {string} type - The type of the menu entry.
     * @property {string} title - The title of the menu entry.
     * @property {MenuData} subMenu - The sub menu entries.
     */

    /**
     * @enum {string} SubMenuType - The type of the sub menu entry provided by the content api.
     * @private
     */
    const SubMenuType = {
        Workpage: "workpage",
        Visualization: "visualization"
    };

    /**
     * @enum {string} SubMenuPageType - The pageType of the sub menu entry provided by the content api.
     * @private
     */
    const SubMenuPageType = {
        workpage: "workpage",
        page: "page"
    };

    /**
     * @enum {string} SpaceEntity - The type of the space entity which is used for the log message.
     * @private
     */
    const SpaceEntity = {
        Menu: "FLP menu",
        ContentNodes: "content nodes"
    };

    /**
     * Constructs a new instance of the CEP Menu Adapter.
     *
     * @param {object} oUnused Parameter is not used.
     * @param {string} sUnused Parameter is not used.
     * @param {object} oAdapterConfiguration The adapter specific configuration
     * @param {string} oAdapterConfiguration.serviceUrl The url to the CEP content API, that is a GraphQL service
     * @param {boolean} oAdapterConfiguration.siteId The relevant site-id
     * @class
     * @see {@link sap.ushell.adapters.cep.MenuAdapter}
     * @since 1.106.0
     */
    var MenuAdapter = function (oUnused, sUnused, oAdapterConfiguration) {
        if (oAdapterConfiguration
            && oAdapterConfiguration.config
            && oAdapterConfiguration.config.serviceUrl
            && oAdapterConfiguration.config.siteId
        ) {
            this.httpClient = new HttpClient();
            this.serviceUrl = oAdapterConfiguration.config.serviceUrl;
            this.siteId = oAdapterConfiguration.config.siteId;
            this.oWorkPageService = new WorkPageService();
            this.oSiteDataPromise = this._doRequest(this.serviceUrl, this.siteId);
            this.oVizDataPromise = this._loadVisualizations();
        } else {
            Log.error("Invalid configuration provided.", "", sCEPMenuAdapterComponent);
        }
    };

    /**
     * Loads the visualizations from the WorkPageService.
     * @returns {Promise<object[]>} The visualizations
     * @since 1.132.0
     * @private
    */
    MenuAdapter.prototype._loadVisualizations = async function () {
        // Workaround until the new menu query is available.
        if (Config.last("/core/menuQueryAvailable")) {
            const aVisualizationIds = await this._getVisualizationIds();

            if (aVisualizationIds.length > 0) {
                const oFilterParams = {
                    filter: [{
                        id: {
                            in: aVisualizationIds
                        }
                    }]
                };
                return this.oWorkPageService.loadVisualizations(oFilterParams, true);
            }
        }

        return [];
    };

    /**
     * Returns whether the menu is enabled.
     * The menu is enabled if there's at least one menu entry and the menu position is "Top".
     *
     * @returns {Promise<boolean>} True if the menu is enabled.
     * @since 1.106.0
     * @private
     */
    MenuAdapter.prototype.isMenuEnabled = function () {
        if (!Config.last("/core/menu/enabled") || Config.last("/core/menu/position") !== "Top") {
            return Promise.resolve(false);
        }

        return this.getMenuEntries().then(function (aMenuEntries) {
            return aMenuEntries.length > 0;
        });
    };


    /**
     * Returns whether the side navigation is enabled.
     * The side navigation is enabled if there's at least one menu entry and the menu position is "Side".
     *
     * @returns {Promise<boolean>} True if the side navigation is enabled.
     * @since 1.132.0
     * @private
     */
    MenuAdapter.prototype.isSideNavigationEnabled = async function () {
        if (!Config.last("/core/menu/enabled") || Config.last("/core/menu/position") !== "Side") {
            return false;
        }

        const aMenuEntries = await this.getMenuEntries();
        return aMenuEntries.length > 0;
    };

    /**
     * Returns a promise that resolves with the menu entries for the pages.
     *
     * @returns {Promise<MenuEntry[]>} Resolves with the menu entries, @see sap.ushell.services.menu#MenuEntry.
     * @since 1.106.0
     * @private
     */
    MenuAdapter.prototype.getMenuEntries = async function () {
        const [aMenu, aVisualizations] = await Promise.all([
            this._getMenu(),
            this._getVisualizations()
        ]);
        return this._buildMenuEntries(aMenu, aVisualizations);
    };

    /**
     * Gets the content nodes for the menu.
     *
     * @returns {ContentNode[]} The content nodes, @see sap.ushell.services.menu#ContentNode
     * @since 1.106.0
     * @private
     */
    MenuAdapter.prototype.getContentNodes = async function () {
        const aMenu = await this._getMenu();
        return this._buildContentNodes(aMenu);
    };

    /**
     * Gets the visualization ids of the menu.
     * @returns {Promise<sVisualizationIds[]>} The visualization ids
     * @since 1.132.0
     * @private
     */
    MenuAdapter.prototype._getVisualizationIds = async function () {
        const sVisualizationIds = new Set();
        const aMenu = await this._getMenu();

        aMenu.forEach((oMenuEntry) => {
            if (!Array.isArray(oMenuEntry?.subMenu)) {
                Log.warning(`Menu entry ${oMenuEntry.id} does not contain a sub menu array for site-id: ${this.siteId}, ${sCEPMenuAdapterComponent}`);
                return;
            }

            oMenuEntry.subMenu.forEach((oSubMenuEntry) => {
                if (oSubMenuEntry.type === SubMenuType.Visualization && oSubMenuEntry.id) {
                    sVisualizationIds.add(oSubMenuEntry.id);
                }
            });
        });

        return [...sVisualizationIds];
    };

    /**
     * Builds a menu which is accepted by the menu service.
     *
     * @param {MenuData[]} aMenu The menu fetched from the site data.
     * @param {object[]} aVisualizations The Visualizations.
     * @returns {MenuEntry[]} The menu structure required by the menu service, @see sap.ushell.services.menu#MenuEntry
     * @since 1.106.0
     * @private
     */
    MenuAdapter.prototype._buildMenuEntries = function (aMenu, aVisualizations) {
        // Create a 1st level menu entry for each space
        // having 2nd level sub menu entries for its pages and visualizations inside if needed.

        return aMenu
            .filter(this._isSpaceNotEmpty.bind(null, SpaceEntity.Menu))
            .map((oMenu) => {
                const oTopMenuEntry = this._buildMenuEntry(oMenu, aVisualizations);
                const aSubMenuEntries = [];

                oMenu.subMenu.forEach((oSubMenuNode) => {
                    oSubMenuNode.spaceid = oMenu.id;
                    const oSubMenuEntry = this._buildMenuEntry(oSubMenuNode, aVisualizations);
                    aSubMenuEntries.push(oSubMenuEntry);
                });

                if (aSubMenuEntries.length > 1) {
                    oTopMenuEntry.menuEntries = aSubMenuEntries;
                }

                return oTopMenuEntry;
            });
    };

    /**
     * Builds the menu structure for a single menu entry.
     *
     * @param {MenuData} oMenuEntry The menu object fetched from the site data.
     * @param {object[]} aVisualizations The Visualizations.
     * @returns {MenuEntry[]} The menu structure required by the menu service, @see sap.ushell.services.menu#MenuEntry
     * @since 1.132.0
     * @private
     */
    MenuAdapter.prototype._buildMenuEntry = function (oMenuEntry, aVisualizations) {
        // By default we expect that the menu entry is a page.
        let oSubMenuNode = oMenuEntry;
        let sTitle = oMenuEntry.title;
        let sIcon = oMenuEntry.icon;
        let sHelpId = "Page-";
        let sSemanticObject = "Launchpad";
        let sAction = "openFLPPage";
        let sName = "pageId";
        let sValue = oMenuEntry.id;

        // When the menu entry has a sub menu, we know that it is a space/top menu entry.
        if (Array.isArray(oMenuEntry?.subMenu) && oMenuEntry.subMenu.length > 0) {
            oSubMenuNode = oMenuEntry.subMenu[0];
            sHelpId = "Space-";
            sValue = oSubMenuNode.id;

            // In case there is only one sub menu entry, we use that for the top menu entry title.
            if (oMenuEntry.subMenu.length === 1 && oSubMenuNode.type === SubMenuType.Visualization) {
                sTitle = oSubMenuNode.title;
                sIcon = oSubMenuNode.icon;
            }
        }
        // If the node is a visualization the target action should be the visualization target action.
        const oViz = aVisualizations.find((obj) => obj.id === oSubMenuNode?.id);

        if (oViz && oViz !== undefined) {
            sHelpId = "App-";
            sName = "sap-ui-app-id-hint";

            if (oViz.targetAppIntent) {
                sValue = oViz.targetAppIntent.businessAppId;
                sSemanticObject = oViz.targetAppIntent.semanticObject;
                sAction = oViz.targetAppIntent.action;
            } else {
                Log.warning(`Visualization ${oViz.id} does not contain a targetAppIntent for site-id: ${this.siteId}, ${sCEPMenuAdapterComponent}`);
            }
        }

        if (!utils.isIconURIValid(sIcon)) {
            sIcon = undefined;
        }

        return {
            title: sTitle,
            "help-id": sHelpId + oMenuEntry.id,
            description: "",
            icon: sIcon,
            type: "IBN",
            target: {
                semanticObject: sSemanticObject,
                action: sAction,
                parameters: [
                    {
                        name: "spaceId",
                        value: oMenuEntry.spaceid || oMenuEntry.id
                    },
                    {
                        name: sName,
                        value: sValue
                    }
                ],
                innerAppRoute: undefined
            },
            menuEntries: []
        };
    };

    /**
     * Builds content nodes based on the spaces. The property "isContainer" is set to true for pages (which have pageType 'page').
     *
     * @param {MenuData[]} aMenu The menu fetched from the site data.
     * @returns {ContentNode[]} The content nodes required by the menu service, @see sap.ushell.services.menu#ContentNode
     * @private
     * @since 1.106.0
     */
    MenuAdapter.prototype._buildContentNodes = function (aMenu) {
        return aMenu
            .filter(this._isSpaceNotEmpty.bind(null, SpaceEntity.ContentNodes))
            .map(function (oSpace) {
                return {
                    id: oSpace.id,
                    label: oSpace.title || oSpace.id,
                    type: oContentNodeTypes.Space,
                    isContainer: false,
                    children: oSpace.subMenu.map(function (oSubMenuNode) {
                        const bIsWorkpage = oSubMenuNode.type === SubMenuType.Workpage;
                        return {
                            id: oSubMenuNode.id,
                            label: oSubMenuNode.title || oSubMenuNode.id,
                            type: bIsWorkpage ? oContentNodeTypes.Page : oContentNodeTypes.Visualization,
                            isContainer: oSubMenuNode?.pageType === SubMenuPageType.page,
                            children: []
                        };
                    })
                };
            });
    };

    /**
     * Resolves to true if the page with the given sPageId is a WorkPage.
     * This is the case if the type property in the subMenuNode is "workpage" and the pageType is "workpage".
     *
     * @param {string} sPageId The pageId to check.
     * @returns {Promise<boolean>} A promise resolving to true if the pageId is a WorkPage or false if not.
     * @private
     * @since 1.107.0
     */
    MenuAdapter.prototype.isWorkPage = async function (sPageId) {
        const aMenu = await this._getMenu();

        const oFoundMenu = aMenu
            .flatMap((oSpace) => oSpace.subMenu || [])
            .filter((oSubMenuNode) => oSubMenuNode.pageType === SubMenuPageType.workpage && oSubMenuNode.type === SubMenuType.Workpage)
            .find((oPage) => oPage.id === sPageId);

        return !!oFoundMenu;
    };

    /**
     * Returns a Promise that sends the request to the GraphQL service to fetch menu data.
     *
     * Example response:
     * <pre>
        {
            "data": {
                "menu": [
                    {
                        "id": "781f3d65-69f2-4a97-b92f-bc2cedf2f8a9",
                        "type": "space",
                        "title": "Test Space",
                        "subMenu": [
                            {
                                "id": "1fac2d11-e9d3-4f23-8ef5-57475030c5c3#Default-VizId",
                                "type": "visualization",
                                "title": "Test App(visualization) 1st-level"
                            }
                        ]
                    },
                    {
                        "id": "38095617-8298-4f1b-853d-30e0f8b0d58a",
                        "type": "space",
                        "title": "Second Test Space",
                        "subMenu": [
                            {
                                "id": "2f9c360a-6552-4484-8b63-65d8968dbfd0",
                                "type": "workpage",
                                "title": "Test Page"
                            },
                            {
                                "id": "1fac2d11-e9d3-4f23-8ef5-57475030c5c3#Default-VizId",
                                "type": "visualization",
                                "title": "Test App(visualization) 2nd-level"
                            }
                        ]
                    }
                ]
            }
        }
     * </pre>
     *
     * @param {string} sServiceUrl The GraphQL service URL that represents the CEP content API
     * @param {string} sSiteId The relevant site-id
     * @returns {Promise<object>} Resolves with the response from the GraphQL service exposing menu data.
     * @since 1.106.0
     * @private
     */
    MenuAdapter.prototype._doRequest = function (sServiceUrl, sSiteId) {
        // This query is still subject to change, as the GraphQL service is not yet finalized.
        let sQuery = "";
        // Workaround until the new menu query is available.
        // Until then we support both queries.
        if (Config.last("/core/menuQueryAvailable")) {
            sQuery = `{
            menu(siteId: "${sSiteId}")
        }`;
        } else {
            sQuery = `{
                spaces(siteId: "${sSiteId}") {
                    nodes {
                        id,
                        descriptor {
                            value(select: ["/title"])
                        },
                        workPages {
                            nodes {
                                id,
                                contents(queryInput: {selectProperties: ["/descriptor"], selectDescriptorValueProperties: ["/title", "/pageType"]})
                            }
                        }
                    }
                }
            }`;
        }


        return this.httpClient.get(sServiceUrl + "?query=" + sQuery, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Accept-Language": Localization.getLanguageTag().toString()
            }
        }).then(function (oResponse) {
            if (oResponse.status < 200 || oResponse.status >= 300) {
                Log.error(oResponse.responseText, "", sCEPMenuAdapterComponent);
                return Promise.reject(`HTTP request to GraphQL service failed with status: ${oResponse.status} - ${oResponse.statusText}`);
            }
            return JSON.parse(oResponse.responseText || "{}");
        }).then(function (oData) {
            // Structure the data to match the expected format of the new menu query.
            // Workaround until the spaces query is deprecated and the new menu query is used.
            if (!Config.last("/core/menuQueryAvailable")) {
                oData.data.menu = oData.data.spaces.nodes.map(function (oSpace) {
                    return {
                        id: oSpace.id,
                        type: "space",
                        title: oSpace?.descriptor?.value?.title,
                        subMenu: oSpace?.workPages?.nodes?.map(function (oPage) {
                            return {
                                id: oPage.id,
                                type: "workpage",
                                title: oPage?.contents?.descriptor?.value?.title,
                                pageType: oPage.contents.descriptor?.value?.pageType ? "page" : "workpage"
                            };
                        })
                    };
                });
            }

            // Temporary workaround for QESAPSHELL-108
            try {
                oData.data.menu = oData.data.menu.filter(function (node) {
                    return node.id !== "default_space";
                });
            } catch (e) {
                // No error handling required
            }
            return oData;
        });
    };

    /**
    * Retrieves the menu from the GraphQL responded JSON object.
    *
    * @param {object} oSiteData The GraphQL response as JSON object
    * @returns {Promise<aMenu[]>} The menu as an array
    * @private
    */
    MenuAdapter.prototype._getMenu = async function () {
        const oSiteData = await this.oSiteDataPromise;
        if (Array.isArray(oSiteData?.data?.menu) && oSiteData.data.menu.length > 0
        ) {
            return oSiteData.data.menu;
        }

        Log.warning("No menu found for site-id: " + this.siteId, "", sCEPMenuAdapterComponent);
        return [];
    };

    /**
    * Retrieves the visualizations from the GraphQL responded JSON object.
    *
    * @param {object} oVisualizationData The GraphQL response as JSON object
    * @returns {Promise<aVisualizations[]>} The visualizations as an array
    * @private
    */
    MenuAdapter.prototype._getVisualizations = async function () {
        const oVisualizationData = await this.oVizDataPromise;
        if (Array.isArray(oVisualizationData?.visualizations?.nodes) && oVisualizationData.visualizations.nodes.length > 0
        ) {
            return oVisualizationData.visualizations.nodes;
        }

        Log.info("No visualizations found for site-id: " + this.siteId, "", sCEPMenuAdapterComponent);
        return [];
    };

    /**
     * Filter function that checks if a space is empty to filter it out.
     * If the space is empty, a warning message is logged.
     *
     * @param {string} sEntityName Name of the entity where the space is filtered out for the warning message
     * @param {object} oSpace The space to be filtered
     * @returns {boolean} true = keep, false = remove
     * @private
     * @since 1.106.0
     */
    MenuAdapter.prototype._isSpaceNotEmpty = function (sEntityName, oSpace) {

        if (!(Array.isArray(oSpace?.subMenu) && oSpace.subMenu.length > 0) ||
            !oSpace.subMenu?.some((subMenu) => Object.keys(subMenu).length > 0)) {
            Log.warning(`FLP space ${oSpace.id} without sub menu content omitted in ${sEntityName}.`, "", sCEPMenuAdapterComponent);
            return false;
        }
        return true;
    };

    return MenuAdapter;
});

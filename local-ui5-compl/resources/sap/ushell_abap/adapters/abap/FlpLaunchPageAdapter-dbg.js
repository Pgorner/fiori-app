// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview The Unified Shell's page building adapter for the ABAP platform. Private copy. Classical home page functions are deprecated.
 * @since 1.121
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/ushell/components/cards/ManifestPropertyHelper",
    "sap/ui/thirdparty/jquery",
    "sap/base/util/ObjectPath",
    "sap/base/util/isEmptyObject",
    "sap/m/GenericTile",
    "sap/ushell/Config",
    "sap/base/util/deepExtend",
    "sap/ushell/utils/chipsUtils",
    "sap/ushell_abap/pbServices/ui2/Utils",
    "sap/ushell_abap/pbServices/ui2/Page",
    "sap/base/Log",
    "sap/m/library",
    "sap/ushell/ui/tile/StaticTile",
    "sap/ushell/utils",
    "sap/ushell_abap/pbServices/ui2/contracts/preview",
    "sap/ushell/Container"
], function(
    URI,
    ManifestPropertyHelper,
    jQuery,
    ObjectPath,
    isEmptyObject,
    GenericTile,
    Config,
    deepExtend,
    chipsUtils,
    Utils,
    Page,
    Log,
    mobileLibrary,
    StaticTile,
    ushellUtils,
    Preview,
    Container
) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    var sCOMPONENT = "sap.ushell_abap.adapters.abap.LaunchPageAdapter";
    var sDEFAULT_PAGE_ID = "/UI2/Fiori2LaunchpadHome";
    var sDEFAULT_CATALOG_ID = "/UI2/FLPD_CATALOG";
    var sDYNAMIC_BASE_CHIP_ID = "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER";
    var sSTATIC_BASE_CHIP_ID = "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER";
    var S_CARD_BASE_CHIP_ID = "X-SAP-UI2-CHIP:/UI2/CARD";
    var O_ERROR_TYPES = {
        catalogTileNotFound: "catalogTileNotFound",
        referenceTileNotFound: "referenceTileNotFound",
        noTargetMapping: "noTargetMapping",
        emptyConfiguration: "emptyConfiguration",
        tileIntentSupportException: "tileIntentSupportException"
    };

    // used to load allCatalogs without target mapping chips
    var PAGE_ID_WITHOUT_TM = "/UI2/FLPNoActionChip";

    /**
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the launch page adapter for the ABAP platform.
     *
     * @param {object} oUnused Not used anymore
     * @param {string} sParameter Not used anymore
     * @param {object} oAdapterConfiguration configuration for the adapter.
     *   Enables configuration of OData service URLs and cache buster tokens, for example.
     *
     * @class
     * @see sap.ushell.services.LaunchPage
     * @since 1.121.0
     * @private
     */
    var LaunchPageAdapter = function (oUnused, sParameter, oAdapterConfiguration) {
        var bCatalogsValid; // undefined = not yet valid
        var oGetGroupsDeferred; // used to synchronize parallel getGroups-requests
        var oGetCatalogsDeferred; // used to synchronize parallel getCatalog-requests

        // Stores a boolean that indicates whether a target mapping is supported on the current device.
        // One should use makeTargetMappingSupportKey to store and retrieve values to/from this map.
        var oTargetMappingSupport = new Utils.Map();


        var oAdapterConfig = (oAdapterConfiguration && oAdapterConfiguration.config) || {};
        var oLaunchPageServiceConfig = oAdapterConfig.services && oAdapterConfig.services.launchPage;
        var mEarlyTileVisibilities = {};
        var that = this;

        this._oCurrentPageSet = null;
        this._bPageSetFullyLoaded = false;
        this._aOtherChipsPromises = [];

        Preview.setEnvironmentType("runtime");

        /**
         * Robust call to <code>sap.ushell_abap.pbServices.ui2.ChipInstance#getImplementationAsSapui5()</code>.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile Title object
         * @param {string} sTitle Title string
         * @param {string} sMessage Message string
         * @returns {sap.ui.core.Control} Implementation
         * @deprecated As of version 1.120
         */
        function getImplementationAsSapui5 (oTile, sTitle, sMessage) {
            try {
                return oTile.getImplementationAsSapui5();
            } catch (ex) {
                // log errors, but do not fail
                Log.error(sMessage + ": " + (ex.message || ex), ex.stack, sCOMPONENT);
                return new StaticTile({
                    icon: "sap-icon://error",
                    info: "",
                    infoState: "Critical",
                    subtitle: ex.message || ex,
                    title: sTitle
                }).addStyleClass("sapUshellTileError");
            }
        }

        /**
         * Checks if oChip has a bag with ID sBagId and if that bag contains a text with the name.
         * If so, the value for that text is returned. If not, undefined is returned.
         * The bag will not be created, in case it does not exist (calling getBag directly would do)!
         *
         * @param {object} oChip CHIP potentially containing the bag
         * @param {string} sBagId Bag ID to check for
         * @param {string} sTextName Text name to check for
         * @returns {string} Value for sTextName, or undefined if not found
         * @private
         * @see sap.ushell_abap.pbServices.ui2.ChipInstance#getBag
         * @see sap.ushell_abap.pbServices.ui2.ChipInstance#getBagIds
         * @see sap.ushell_abap.pbServices.ui2.Bag#getText
         * @see sap.ushell_abap.pbServices.ui2.Bag#getTextNames
         */
        LaunchPageAdapter.prototype._getBagText = function (oChip, sBagId, sTextName) {
            // calling getBag directly, will create the bag if it does not exist yet!
            if (oChip.getBagIds().indexOf(sBagId) > -1 &&
                oChip.getBag(sBagId).getTextNames().indexOf(sTextName) > -1) {
                return oChip.getBag(sBagId).getText(sTextName);
            }
            return undefined;
        };

        /**
         * Checks if oChip has a configuration parameter with ID sConfigParameterId. Its value must be a stringified
         * JSON object. If that object contains a property named sPropertyName, it's value will be returned.
         * This method is save: In case the value cannot be read due to any reason undefined is returned.
         *
         * @param {object} oChip CHIP potentially containing the the configuration parameter and property and property name
         * @param {string} sConfigParameterId Configuration parameter ID to check for.
         *   The value must be a stringified JSON otherwise the method will return undefined
         * @param {string} sPropertyName Name of the property which is expected on the parsed object value from sConfigParameterId
         * @returns {string} Value for sPropertyName, or undefined if not found or an error occurred (e.g. due to failed parsing)
         * @private
         * @see sap.ushell_abap.pbServices.ui2.ChipInstance#getConfigurationParameter
         */
        LaunchPageAdapter.prototype._getConfigurationProperty = function (oChip, sConfigParameterId, sPropertyName) {
            var sTileConfig;
            var oTileConfig;

            try {
                sTileConfig = oChip.getConfigurationParameter(sConfigParameterId);
                oTileConfig = JSON.parse(sTileConfig);
            } catch (e) {
                // most likely this is not a static or dynamic applauncher
                return undefined;
            }

            if (oTileConfig[sPropertyName] !== undefined) { // also consider falsy values
                return oTileConfig[sPropertyName];
            }

            return undefined;
        };

        /**
         * this method takes a configuration object and an array of elements (each must have a getId() method)
         * and returns a new array containing the ordered elements as defined in the configuration.order
         *
         * Note1: elements not occurring in the string are appended to the end (as it was in aElements)
         * Note2: in case of double ids in configuration only the first one will take into account the following are ignored
         *
         * @param {object} [oConfiguration] object containing an order array, example: {order: ["id1", "id2", "id3"]}
         * @param {object[]} aElements array of objects. Each object must provide a getId method
         * @private
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        LaunchPageAdapter.prototype._orderBasedOnConfiguration = function (oConfiguration, aElements) {
            var aOrder = (oConfiguration && Utils.isArray(oConfiguration.order) ? oConfiguration.order : []);
            var mElementsById = {};
            var aOrderedElements = [];
            var oElement;
            var i;
            var n;

            // append link tiles as they are exposed together with tiles via getGroupTiles
            aOrder = aOrder.concat(oConfiguration && Utils.isArray(oConfiguration.linkOrder) ? oConfiguration.linkOrder : []);

            // create a map of instances by ID
            for (i = 0, n = aElements.length; i < n; i += 1) {
                oElement = aElements[i];
                mElementsById[oElement.getId()] = oElement;
            }
            // iterate over the order and move all found instances from the map to the result list
            for (i = 0, n = aOrder.length; i < n; i += 1) {
                var sId = aOrder[i];
                if (Object.prototype.hasOwnProperty.call(mElementsById, sId)) {
                    aOrderedElements.push(mElementsById[sId]);
                    delete mElementsById[sId];
                }
            }
            // iterate again over the unordered list and add those that are still in the map
            for (i = 0, n = aElements.length; i < n; i += 1) {
                oElement = aElements[i];
                if (Object.prototype.hasOwnProperty.call(mElementsById, oElement.getId())) {
                    aOrderedElements.push(oElement);
                }
            }
            return aOrderedElements;
        };

        /**
         * Removes the given tile from the given Page layout, according to it's current type.
         *
         * @param {object} oLayout Layout of the page. Looks like this:
         * <pre>
         *   {
         *     order: ["tileId1", "tileId2"],
         *     linkOrder: ["linkTileId1", "linkTileId2"]
         *   }
         * </pre>
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile The tile to be removed
         * @param {string} sCurrentTileType "link" or "tile"
         * @returns {int} the index of the oTile if found. Otherwise -1 is returned
         * @private
         * @deprecated As of version 1.120
         */
        function removeFromLayout (oLayout, oTile, sCurrentTileType) {
            if (sCurrentTileType === "link") {
                return removeFromArray(oLayout.linkOrder, oTile.getId());
            }
            return removeFromArray(oLayout.order, oTile.getId());
        }

        /**
         * Removes vValue from the given array.
         *
         * @param {Array<*>} aArray The array from which the value should be removed from.
         * @param {any} vValue The value to be removed.
         * @returns {int} The index of the vValue in the array or -1 if it was not found.
         * @private
         * @deprecated As of version 1.120
         */
        function removeFromArray (aArray, vValue) {
            var iSourceIndex = aArray.indexOf(vValue);
            if (iSourceIndex < 0) {
                return iSourceIndex;
            }
            aArray.splice(iSourceIndex, 1);
            return iSourceIndex;
        }

        /**
         * Adds the given tile ID to the given Page layout in the specified index and according to it's current type.
         *
         * @param {object} oLayout Layout of the page. Looks like this:
         * <pre>
         *   {
         *     order: ["tileId1", "tileId2"],
         *     linkOrder: ["linkTileId1", "linkTileId2"]
         *   }
         * </pre>
         * @param {string} sTileId The ID of the tile to be added
         * @param {int} iIndex The index of the tile or link to be added
         * @param {string} sNewTileType "link" or "tile"; specifies if the tile is added to the order or linkOrder.
         * @private
         * @deprecated As of version 1.120
         */
        function addToLayout (oLayout, sTileId, iIndex, sNewTileType) {
            if (sNewTileType === "link") {
                // iIndex specifies index in oLayout.order.concat(oLayout.linkOrder)
                // as Links are returned by getGroupTiles as well (at the end of the array).
                // Because of this the index must be adapted accordingly for links.
                iIndex = iIndex - oLayout.order.length;
                oLayout.linkOrder.splice(iIndex, 0, sTileId);
            } else {
                oLayout.order.splice(iIndex, 0, sTileId);
            }
        }

        /**
         * Calculates the layout object for the given Page. The layout
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oPage The Page the layout is calculated for.
         * @param {sap.ushell_abap.adapters.abap.LaunchPageAdapter} oAdapter The instance of the LaunchPageAdapter (this).
         * @returns {object} The calculated Page layout
         * <pre>
         *   {
         *     order: ["tileId1", "tileId2"],
         *     linkOrder: ["linkTileId1", "linkTileId2"]
         *   }
         * </pre>
         * @private
         * @deprecated As of version 1.120
         */
        function calculateCurrentLayout (oPage, oAdapter) {
            var aTiles = oAdapter.getGroupTiles(oPage);
            var oLayout = {
                order: [],
                linkOrder: []
            };

            aTiles.forEach(function (oTile) {
                var sType = oAdapter.getTileType(oTile);
                if (sType === "link") {
                    oLayout.linkOrder.push(oTile.getId());
                } else {
                    oLayout.order.push(oTile.getId());
                }
            });

            return oLayout;
        }

        /**
         * Orders the pages of _oCurrentPageSet based on the configuration maintained in _oCurrentPageSet and returns the result.
         *
         * @returns {sap.ushell_abap.pbServices.ui2.Page[]}
         * @private
         * @deprecated As of version 1.120
         */
        function getOrderedPages () {
            var oConfiguration;
            // always insert the default group ID at the first position, this moves the default group to the beginning;
            // it doesn't matter that the ID might be contained twice, the order routine can handle this
            try {
                oConfiguration = JSON.parse(that._oCurrentPageSet.getConfiguration());
                oConfiguration.order.splice(0, 0, that._oCurrentPageSet.getDefaultPage().getId());
            } catch (e) {
                oConfiguration = { order: [that._oCurrentPageSet.getDefaultPage().getId()] };
            }
            return LaunchPageAdapter.prototype._orderBasedOnConfiguration(oConfiguration, that._oCurrentPageSet.getPages());
        }

        /**
         * Stores the hidden groups under the existing configuration property of the pageSet object
         * (by overriding the existing value or creating it if not yet exist).
         * A new property is added in order not to damage the existing groups order functionality (i.e. configuration.order).
         *
         * @param {string[]} aHiddenGroupsIDs The input parameter must be of type array, containing the IDs of the
         *   groups that should be set hidden. In case an empty array is provided all groups should be changed to visible.
         * @returns {jQuery.Promise} Resolves once the group is hidden.
         * @private
         * @deprecated As of version 1.120
         */
        this.hideGroups = function (aHiddenGroupsIDs) {
            var oDeferred = new jQuery.Deferred();

            if (!aHiddenGroupsIDs || !(aHiddenGroupsIDs instanceof Array)) {
                oDeferred.reject("Input parameter must be of type Array.");
            } else {
                var oConf = JSON.parse(that._oCurrentPageSet.getConfiguration() || "{}");

                // Replace the hidden groups array on the current configuration with the new hidden groups array
                oConf.hiddenGroups = aHiddenGroupsIDs;
                that._oCurrentPageSet.setConfiguration(JSON.stringify(oConf),
                /*fnSuccess*/oDeferred.resolve.bind(oDeferred),
                /*fnFailure*/oDeferred.reject.bind(oDeferred));
            }
            return oDeferred.promise();
        };

        /**
         * Checks if the provided group should be visible or hidden.
         * It is decided according the group ID (oGroup should have a getId function).
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oGroup The group to be checked.
         * @returns {boolean} true\false accordingly.
         * @private
         * @deprecated As of version 1.120
         */
        this.isGroupVisible = function (oGroup) {
            var sConf = that._oCurrentPageSet.getConfiguration();

            if (!sConf) {
                return true;
            }

            var oConf = JSON.parse(sConf);
            if (!oConf || !oConf.hiddenGroups) {
                return true;
            }

            // Go through the hidden groups array to check if we find the current group
            var aHiddenGroups = oConf.hiddenGroups;
            for (var i = 0; i < aHiddenGroups.length; i += 1) {
                if (aHiddenGroups[i] === oGroup.getId()) {
                    // If we found the group, it should not be visible
                    return false;
                }
            }
            // If the group is not in the hidden groups array then it should be visible
            return true;
        };

        /**
         * Triggers loading of a CHIP instance and adds the temporary property $loadingPromise to it
         * as it does not wait for the loading success or failure.
         * As soon as it is completely loaded (or loading failed) the $loadingPromise property is removed again.
         * @deprecated As of version 1.120
         */
        LaunchPageAdapter.prototype._triggerChipInstanceLoad = function (oChipInstance) {
            function fnSuccess () {
                if (oChipInstance._loadingDeferred) {
                    oChipInstance._loadingDeferred.resolve();
                }
                delete oChipInstance._loadingDeferred;
                delete oChipInstance.$loadingPromise; // was temporarily needed only
            }

            function fnFailure (sMessage) {
                // log errors, but do not fail
                Log.error("Failed to load tile: " + sMessage, oChipInstance.toString(), sCOMPONENT);
                if (oChipInstance._loadingDeferred) {
                    oChipInstance._loadingDeferred.reject();
                }
                delete oChipInstance._loadingDeferred;
                delete oChipInstance.$loadingPromise; // was temporarily needed only
            }

            oChipInstance.load(fnSuccess, fnFailure);
        };

        /**
         * Triggers loading of all ChipInstances of the given pages and calls fnLocalChipsLoaded
         * when all local CHIP instances are completely loaded.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page[]} aPages the pages
         * @param {function} fnLocalChipsLoaded Success handler which is called as soon as all LOCAL CHIPs are completely loaded.
         * @private
         * @deprecated As of version 1.120
         */
        this._loadApplaunchersAndDelayLoadingOfOtherChips = function (aPages, fnLocalChipsLoaded) {
            var iPendingRequests = 0; // counter used for loading app launchers only
            var aLocalCustomTiles = [];
            var aRemoteTiles = [];

            // if all pending requests are done the function triggers ordering of the array and calls resolve afterwards
            function finalize () {
                if (iPendingRequests <= 0) {
                    fnLocalChipsLoaded();
                }
            }

            /**
             * Loads dependent libraries (core-ext-light for custom tiles and custom remote tiles)
             * and triggers the loading of the chip instances.
             */
            function loadDependenciesAndTriggerChipInstanceLoad (oChipInstance) {
                // append the promise for loading to the instance, but only as long as loading is
                // pending. Note: will be used by getTileView
                oChipInstance._loadingDeferred = new jQuery.Deferred(); // used for KPI tiles and custom tiles
                oChipInstance.$loadingPromise = oChipInstance._loadingDeferred.promise();
                that._aOtherChipsPromises.push(new Promise(function (resolve, reject) {
                    oChipInstance.$loadingPromise
                        .done(resolve)
                        .fail(reject);
                }));

                if (window["sap-ui-debug"] === true) {
                    LaunchPageAdapter.prototype._triggerChipInstanceLoad(oChipInstance);
                } else {
                    // we don't distinguish KPI tiles from other custom tiles, because the static preload optimization
                    // (sap/fiori/indicator-tiles.js bundle) was only valid for a certain set of old KPI tiles;
                    // for newer KPI tiles used in S4 the bundle did not contain all dependencies and therefore the optimization led to
                    // even more round trips; in practice, chances are high that the homepage will contain some non-KPI custom tiles,
                    // so core-ext-light will probably be loaded in most cases
                    // see internal BCP 1770271005
                    sap.ui.require(["sap/ushell/EventHub"], function (oEventHub) {
                        var oCoreResourcesComplementEvent = oEventHub.on("CoreResourcesComplementLoaded");

                        oCoreResourcesComplementEvent.do(function (oEvent) {
                            if (oEvent.status === "success") {
                                LaunchPageAdapter.prototype._triggerChipInstanceLoad(oChipInstance);
                                oCoreResourcesComplementEvent.off();
                            } else {
                                Log.error("Did not load custom tile as core resources where not loaded", null, sCOMPONENT);
                            }
                        });
                    });
                }
            }

            /**
             * loads a CHIP instance and triggers finalize() or reject afterwards
             */
            function loadChipInstance (oChipInstance) {
                function onLoad () {
                    iPendingRequests -= 1;
                    finalize();
                }

                iPendingRequests += 1;
                oChipInstance.load(onLoad, function (sMessage) {
                    // log errors, but do not fail
                    Log.error("Failed to load tile: " + sMessage, oChipInstance.toString(), sCOMPONENT);
                    onLoad();
                });
            }

            aPages.forEach(function (oPage) {
                oPage.getChipInstances().forEach(function (oChipInstance) {
                    if (isRemoteChipInstance(oChipInstance)) {
                        aRemoteTiles.push(oChipInstance);
                    } else if (isBrokenChip(oChipInstance)) {
                        // This chip was not included in the expanded PageSets request so it does not exist.
                        // As it cannot be loaded, do not even try it again; this also avoids unnecessary 404 CHIP requests at start-up
                        // BCP: 1880105843
                    } else if (isAppLauncher(oChipInstance) || isCard(oChipInstance)) {
                        // load local CHIP instances completely (also wait for them)
                        loadChipInstance(oChipInstance);
                    } else {
                        aLocalCustomTiles.push(oChipInstance);
                    }
                });
            });

            // after loading of app launchers is done we load the local custom tiles
            aLocalCustomTiles.forEach(function (oChipInstance) {
                loadDependenciesAndTriggerChipInstanceLoad(oChipInstance);
            });

            // after loading local tiles we load the remote tiles
            aRemoteTiles.forEach(function (oChipInstance) {
                loadDependenciesAndTriggerChipInstanceLoad(oChipInstance);
            });
            finalize(); // if no CHIP instances exist
        };

        /**
         * This method reads all target mappings for the current user via
         *   a) a compactTM promise if present in config
         *   b) xor a start_up service call with tm_compact=true
         * @returns {jQuery.Promise} Resolves to an array
         * <pre>
         *   [
         *     {
         *       semanticObject : "SO",
         *       semanticAction : "action",
         *       formFactors : { desktop : true , ...}
         *     },
         *     ...
         *   ]
         * </pre>
         */
        LaunchPageAdapter.prototype._readTargetMappings = function () {
            var oDeferred = new jQuery.Deferred();

            function formatResult (oStartupData) {
                var aRes = [];
                var oTargetMappings = oStartupData.targetMappings || oStartupData || {};
                Object.keys(oTargetMappings).forEach(function (sKey) {
                    var oIntent = {};
                    ["semanticObject", "semanticAction", "formFactors"].forEach(function (sMember) {
                        oIntent[sMember] = oTargetMappings[sKey][sMember];
                    });
                    aRes.push(oIntent);
                });
                return aRes;
            }

            if (ObjectPath.get("compactTMPromise", oAdapterConfig)) {
                oAdapterConfig.compactTMPromise.then(function (oResult) {
                    var aRes = formatResult(oResult || {});
                    oDeferred.resolve({ results: aRes });
                }, function (sFail) {
                    oDeferred.reject(sFail);
                });
                return oDeferred.promise();
            }
            var oTargetMappingsConfig = ObjectPath.create("services.targetMappings", oAdapterConfig);
            var sCacheId = oTargetMappingsConfig.cacheId || "";
            var sUrl = "/sap/bc/ui2/start_up?so=%2A&action=%2A&tm-compact=true&shellType=" + ushellUtils.getShellType() + "&depth=0";

            if (sCacheId) {
                sUrl += (sUrl.indexOf("?") < 0 ? "?" : "&") + "sap-cache-id=" + sCacheId;
            }
            var sUI2CacheDisable = oTargetMappingsConfig.sUI2CacheDisable;
            if (sUI2CacheDisable) {
                sUrl += (sUrl.indexOf("?") < 0 ? "?" : "&") + "sap-ui2-cache-disable=" + sUI2CacheDisable;
            }

            Utils.get(
                sUrl,
                false, /*xml=*/
                function (sDirectStartResult) {
                    var oDirectStartResult = JSON.parse(sDirectStartResult);
                    var oDirectStartTargetMappings = oDirectStartResult.targetMappings || {};
                    var aRes = formatResult(oDirectStartTargetMappings);
                    oDeferred.resolve({ results: aRes });
                },
                function (sMessage) {
                    oDeferred.reject(sMessage);
                }
            );
            return oDeferred.promise();
        };

        /**
         * Returns the key to access the TargetMappingSupport map.
         *
         * @param {string} sSemanticObject the semantic object
         * @param {string} sSemanticAction the action
         * @returns {string} a key that can be used to access oTargetMappingsConfig
         * @private
         */
        LaunchPageAdapter.prototype._makeTargetMappingSupportKey = function (sSemanticObject, sSemanticAction) {
            return sSemanticObject + "-" + sSemanticAction;
        };

        /**
         * Tells whether the given tile is a CHIP instance wrapper only, i.e. does not contain added value compared to the wrapped CHIP.
         * This is the case for the results of {@link #addTile}, but not for {@link #addBookmark}.
         * Such wrappers must be unwrapped by {@link #moveTile} or else the title becomes "hard coded" in the newly created CHIP instance.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile
         * @returns {boolean}
         * @deprecated As of version 1.120
         */
        LaunchPageAdapter.prototype._isWrapperOnly = function (oTile) {
            // Note:
            //   getLayoutData() not relevant for LaunchPage service
            //   getTitle() relevant, but difficult and always together with getConfiguration()
            //   getBagIds() difficult due to CHIP bags, but not needed for our goal
            return !oTile.getConfiguration();
        };

        /**
         * Wraps the given CHIPs as CHIP instances, filtering out action CHIPs.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Factory} oFactory The factory to create new chip instances.
         * @param {sap.ushell_abap.pbServices.ui2.Chip[]} aChips A list of chips.
         * @returns {sap.ushell_abap.pbServices.ui2.ChipInstance[]} A list of chip instances.
         */
        function wrapAsChipInstances (oFactory, aChips) {
            var aChipInstances = [];

            aChips.forEach(function (oChip) {
                var oRemoteCatalog = oChip.getRemoteCatalog();
                // Action CHIP filtered out in catalog; can thus also not be added to any group
                if (oChip.getBaseChipId() === "X-SAP-UI2-CHIP:/UI2/ACTION") {
                    return;
                }
                var oChipInstance = oFactory.createChipInstance({
                    chipId: oChip.getId(),
                    remoteCatalogId: oRemoteCatalog && oRemoteCatalog.getId()
                });
                aChipInstances.push(oChipInstance);
            });

            return aChipInstances;
        }

        /**
         * Wraps the current <code>allCatalogs</code> collection into black box objects.
         *
         * @returns {object[]} A list of catalog objects.
         * @param {sap.ushell_abap.pbServices.ui2.Factory} oFactory The factory to create new chip instances.
         * TODO cache result?!
         */
        function wrapCatalogs (oFactory) {
            var oAllCatalogs = that._oCurrentPageSet.getDefaultPage().getAllCatalogs();
            var aCatalogs = oAllCatalogs.getCatalogs();
            var aWrappedCatalogs = [];

            for (var i = 0; i < aCatalogs.length; i += 1) {
                var oCatalog = aCatalogs[i];
                // handle catalog stubs gracefully
                aWrappedCatalogs.push({
                    data: {}, // TODO find out what shall be inside this property?
                    errorMessage: undefined,
                    id: oCatalog.getId(),
                    title: oCatalog.isStub()
                        ? oCatalog.getId() // title not available, use ID instead
                        : oCatalog.getTitle(),
                    tiles: oCatalog.isStub()
                        ? []
                        : wrapAsChipInstances(oFactory, oCatalog.getChips()),
                    ui2catalog: oCatalog // for convenience
                });
            }

            return aWrappedCatalogs;
        }

        /**
         * Tells whether the given CHIP instance is a static or dynamic app launcher
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance
         * @returns {boolean}
         */
        function isAppLauncher (oChipInstance) {
            var sBaseChipId = oChipInstance.getChip().getBaseChipId();
            return sBaseChipId === sDYNAMIC_BASE_CHIP_ID || sBaseChipId === sSTATIC_BASE_CHIP_ID;
        }

        /**
         * Tells whether the given CHIP instance is a card
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance
         * @returns {boolean}
         */
        function isCard (oChipInstance) {
            var sBaseChipId = oChipInstance.getChip().getBaseChipId();
            return S_CARD_BASE_CHIP_ID === sBaseChipId;
        }

        /**
         * Tells whether the given CHIP instance is remote
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance
         * @returns {boolean}
         */
        function isRemoteChipInstance (oChipInstance) {
            return !!oChipInstance.getChip().getRemoteCatalog();
        }

        /**
         * Tells whether the given CHIP instance is not loadable.
         * This means it's data from the OData Service could not be loaded.
         *
         * Note: If this method returns false does not mean that the later loading will not fail
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance
         * @returns {boolean}
         */
        function isBrokenChip (oChipInstance) {
            // alternative: !oChipInstance.getChip().isInitiallyDefined();
            return !isRemoteChipInstance(oChipInstance) && oChipInstance.getChip().getBaseChipId() === undefined;
        }

        /**
         * Returns the tile configuration of the given (app launcher) CHIP instance.
         * It logs an error message if the tile configuration cannot be parsed.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance must not be a stub anymore. Also it's CHIP must not be a stub anymore.
         * @returns {object} the tile configuration
         */
        function getAppLauncherTileConfiguration (oChipInstance) {
            var oParsedTileConfiguration;
            var sConfigParam = oChipInstance.getConfigurationParameter("tileConfiguration");
            try {
                oParsedTileConfiguration = JSON.parse(sConfigParam || "{}");
            } catch (oEx) {
                Log.error("Tile with ID '" + oChipInstance.getId() +
                    "' has a corrupt configuration containing a 'tileConfiguration' value '" + sConfigParam +
                    "' which could not be parsed. If present, a (stringified) JSON is expected as value.",
                    oEx.message,
                    "sap.ushell_abap.adapters.abap.LaunchPageAdapter"
                );
                return {}; // the FLP must react robust on broken single tiles
            }
            return oParsedTileConfiguration;
        }

        /**
         * Returns the tile configuration of the given (Smart Business) CHIP instance.
         * It logs an error message if the tile configuration cannot be parsed.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance must not be a stub anymore. Also it's CHIP must not be a stub anymore.
         * @returns {object} the tile configuration in style of an applauncher
         */
        function getSmartBusinessTileConfiguration (oChipInstance) {
            var oAppLauncherStyleConfig = {};
            var oParsedConfiguration;
            var oParsedTileConfiguration;
            var oParsedTileProperties;

            try {
                // Try to read the configuration string in smart business format from the CHIP.
                // _getChipRawConfigurationString is used to avoid that the getChip().load() must be called which will load the CHIP
                // definition XML, which would end up in additional requests in case this method is called during critical FLP start-up time.
                // Drawback: Configuration defaults (which are usually not used in Fiori) from CHIP definition XML are ignored here.
                oParsedConfiguration = JSON.parse(oChipInstance.getChip()._getChipRawConfigurationString());
                oParsedTileConfiguration = JSON.parse(oParsedConfiguration && oParsedConfiguration.tileConfiguration || "{}");
                oParsedTileProperties = JSON.parse(oParsedTileConfiguration && oParsedTileConfiguration.TILE_PROPERTIES || "{}");
                if (oParsedTileProperties.semanticObject && oParsedTileProperties.semanticAction) {
                    // use app launcher style configuration in order to simplify the handling
                    oAppLauncherStyleConfig.navigation_use_semantic_object = true;
                    oAppLauncherStyleConfig.navigation_semantic_object = oParsedTileProperties.semanticObject;
                    oAppLauncherStyleConfig.navigation_semantic_action = oParsedTileProperties.semanticAction;
                }
            } catch (oEx) {
                // it is fine if a tile is not sticking to the expected configuration structure
                return {};
            }

            return oAppLauncherStyleConfig;
        }

        /**
         * Returns the tile configuration of the given custom CHIP instance, but only if it uses the same configuration structure
         * as the standard static and dynamic app launcher or if it uses the Smart Business tiles' configuration structure.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance It's CHIP may still be a stub.
         * @returns {object} the tile configuration or an empty object
         */
        function getCustomTileConfiguration (oChipInstance) {
            var oParsedTileConfiguration;

            if (oChipInstance.getChip().getBaseChipId() === "X-SAP-UI2-CHIP:/UI2/AR_SRVC_NEWS") {
                // The news tile has a hard coded intent which cannot be read from configuration as
                // described in SAP note 2769481.
                // The code here is executed even before the CHIP definition XMLs are loaded, so
                // there is no chance to read it from the meta data. Therefore, it is hard-coded
                // here as well.
                // BCP: 0020751294 0000160290 2020
                return {
                    navigation_use_semantic_object: true,
                    navigation_semantic_object: "NewsFeed",
                    navigation_semantic_action: "displayNewsList",
                    navigation_semantic_parameters: "",
                    navigation_target_url: "#NewsFeed-displayNewsList"
                };
            }

            // try Smart Business tile format first, as it should be more likely that those are present
            // than that a custom launcher tile is present.
            // it is avoided to detect if oChipInstance is a Smart Business tile as
            //   1) it is hard to detect as there are many different types and versions of those
            //   2) a custom tile may also be based on a Smart Business tile
            var oSmartBusinessConfiguration = getSmartBusinessTileConfiguration(oChipInstance);
            if (oSmartBusinessConfiguration.navigation_use_semantic_object) {
                return oSmartBusinessConfiguration;
            }

            try {
                // Try to read the configuration string from the CHIP, if the CHIP sticks to the same configuration
                // structure as the SAP app launcher tiles, it may benefit from special treatment.
                // _getChipRawConfigurationString is used to avoid that the getChip().load() must be called which will load the CHIP
                // definition XML, which would end up in additional requests in case this method is called during critical FLP start-up time.
                // Drawback: Configuration defaults (which are usually not used in Fiori) from CHIP definition XML are ignored here.
                var oConfigParam = JSON.parse(oChipInstance.getChip()._getChipRawConfigurationString());
                oParsedTileConfiguration = JSON.parse(oConfigParam && oConfigParam.tileConfiguration || "{}");
            } catch (oEx) {
                // Custom tiles may or may not stick to the app launcher's configuration format
                return {};
            }

            return oParsedTileConfiguration;
        }

        /**
         * Identifies the parts of a full chip id.
         *
         * @param {string} sFullId A chip id, a string like:
         *   <ul>
         *     <li>X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D</li>
         *     <li>X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D</li>
         *     <li>X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER</li>
         *   </ul>
         * @returns {object} The parts that make up the full chip id. An object like:
         *   <pre>
         *   {
         *     id: "00O2TR99M0M42Q9E2AF196A2D",
         *     catalog: "X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI",
         *     prefix: "X-SAP-UI2-PAGE" // or null
         *   }
         *   </pre>
         */
        this._parseFullChipId = function (sFullId) {
            var aSplit = sFullId.split(":");
            var sId = aSplit.pop();
            var sPrefix = null;

            if (aSplit.length > 2) {
                sPrefix = aSplit.shift();
            }

            return {
                id: sId,
                prefix: sPrefix,
                catalog: aSplit.join(":")
            };
        };

        /**
         * @returns {sap.ushell_abap.pbServices.ui2.Map} all supported target mappings
         */
        this.getTargetMappingSupport = function () {
            return oTargetMappingSupport;
        };

        /**
         * Extracts catalog id and chip is from a text.
         *
         * This method logs a warning if the input text is not as expected.
         *
         * @param {string} sReferenceLost A text indicating that a certain reference is lost.
         *   The text is assumed to be a string in the format:
         *   'Reference lost: Note <NUMBER> Page <CATALOG_ID> , Instance ID <CHIP_ID>'
         * @returns {object} The catalog id and the chip id, in an object like:
         *   <pre>
         *   {
         *     id: <CHIP_ID>,
         *     catalog: <CATALOG_ID>
         *   }
         *   </pre>
         *   or as follows in case <code>sReferenceLost</code> is not in the expected format:
         *   <pre>
         *   {
         *     id: "Unknown",
         *     catalog: "Unknown"
         *   }
         *   </pre>
         * @private
         */
        this._parseReferenceLost = function (sReferenceLost) {
            var sReferenceLostSafe = sReferenceLost || Object.prototype.toString.apply(sReferenceLostSafe);

            if (!sReferenceLostSafe.match(/^Reference lost: Note \d+ Page.+\s,\sInstance ID.+$/)) {
                Log.warning(
                    "The string that describes a lost reference is in an unexpected format",
                    "This is expected to be a string exactly like 'Reference lost: Note <#> Page <CATALOG_ID> , Instance ID <CHIP_ID>' instead of the given '" + sReferenceLost + "'",
                    "sap.ushell_abap.adapters.abap.LaunchPageAdapter"
                );

                return {
                    id: "Unknown",
                    catalog: "Unknown"
                };
            }

            var aCatalogAndChipId = sReferenceLostSafe.split(" , ").map(function (sPart) {
                return sPart.split(" ").pop();
            });

            return {
                id: aCatalogAndChipId[1],
                catalog: aCatalogAndChipId[0]
            };
        };

        /**
         * Flattens an array of items (deeply nested at any level).
         *
         * @param {Array<*>} aItems An array of items to flatten
         * @returns {Array<*>} The flattened array of items
         */
        this._flattenArray = function (aItems) {
            var that = this;

            if (Object.prototype.toString.apply(aItems) !== "[object Array]") {
                return aItems;
            }

            return aItems.reduce(function (aFlattened, vItem) {
                return aFlattened.concat(that._flattenArray(vItem));
            }, [] /* oResult */);
        };

        /**
         * Finds and reports possible tile errors in a given PageSet object.
         *
         * <p>
         * It logs at most two messages (one warning and one error), grouping errors by groups and error type.
         * </p>
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page[]} aPages an array of all the pages.
         * @param {sap.ushell_abap.pbServices.ui2.Map} oTargetMappingSupport a map containing whether an intent is supported taking into
         *   account its form factor.
         * @private
         * @deprecated As of version 1.120
         */
        this._findAndReportTileErrors = function (aPages, oTargetMappingSupport) {
            var aGroupTileErrors = this._getPossibleTileErrors(aPages, oTargetMappingSupport);
            if (aGroupTileErrors.length > 0) {
                this._reportTileErrors(aGroupTileErrors);
            }
        };

        /**
         * Finds errors on tiles in all Groups.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page[]} aPages an array of <code>sap.ushell_abap.pbServices.ui2.Page</code> objects representing groups of tiles.
         * @param {sap.ushell_abap.pbServices.ui2.Map} oTargetMappingSupport a map containing whether an intent is supported taking into
         *   account its form factor.
         * @returns {object[]} An array describing each error found.
         * @private
         * @deprecated As of version 1.120
         */
        this._getPossibleTileErrors = function (aPages, oTargetMappingSupport) {
            var that = this;

            return aPages.map(function (oPage) {
                return {
                    group: { id: oPage.getId(), title: oPage.getTitle() },
                    errors: that._getPossibleTileErrorsFromOnePage(oPage, oTargetMappingSupport)
                };
            });
        };

        /**
         * Finds possible errors on tiles in a given Group.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oPage an <code>sap.ushell_abap.pbServices.ui2.Page</code> object representing a group of tiles.
         * @param {sap.ushell_abap.pbServices.ui2.Map} oTargetMappingSupport a map containing whether an intent is supported taking into
         *   account its form factor.
         * @returns {object[]} An array describing each error found
         * @private
         * @deprecated As of version 1.120
         */
        this._getPossibleTileErrorsFromOnePage = function (oPage, oTargetMappingSupport) {
            var that = this;

            var aErrors = oPage.getChipInstances().reduce(function (aResult, oChipInstance) {
                var oTileSupport;
                var oTileConfiguration;
                var oChip = oChipInstance.getChip();
                var oChipId = that._parseFullChipId(oChip.getId());

                // The PageSets request uses $expand on Chips which means Chip data should be included in the response.
                if (!oChip.isInitiallyDefined()) {
                    // i.e., chip === null
                    aResult.push({
                        type: O_ERROR_TYPES.catalogTileNotFound,
                        chipInstanceId: oChipInstance.getId(),
                        chipId: oChipId.id,
                        chipCatalogId: oChipId.catalog
                    });
                } else if (oChip.isReference() && oChip.isBrokenReference()) {
                    // title is guaranteed to be a string like:
                    //   Reference lost: Page <PREFIX>:<CATALOG_ID> , Instance ID <CHIP_ID>
                    var oLostReference = that._parseReferenceLost(oChip.getTitle());

                    aResult.push({
                        type: O_ERROR_TYPES.referenceTileNotFound,
                        chipInstanceId: oChipInstance.getId(),
                        referenceChipId: oChipId.id,
                        referenceChipCatalogId: oChipId.catalog,
                        missingReferredChipId: oLostReference.id,
                        missingReferredCatalogId: oLostReference.catalog
                    });
                } else {
                    try {
                        oTileSupport = that._checkTileIntentSupport(oChipInstance, oTargetMappingSupport);
                    } catch (oError) {
                        oTileSupport = {
                            isSupported: false,
                            reason: O_ERROR_TYPES.tileIntentSupportException,
                            exception: oError
                        };
                    }

                    if (!oTileSupport.isSupported) {
                        var sTitle = that._getBagText(oChipInstance, "tileProperties", "display_title_text");
                        var sSubTitle = that._getBagText(oChipInstance, "tileProperties", "display_subtitle_text");
                        switch (oTileSupport.reason) {
                            case O_ERROR_TYPES.noTargetMapping:
                                if (isAppLauncher(oChipInstance)) {
                                    oTileConfiguration = getAppLauncherTileConfiguration(oChipInstance);
                                } else {
                                    oTileConfiguration = getCustomTileConfiguration(oChipInstance);
                                }
                                aResult.push({
                                    type: O_ERROR_TYPES.noTargetMapping,
                                    chipInstanceId: oChipInstance.getId(),
                                    chipInstanceTitle: sTitle || oTileConfiguration.display_title_text || oChipInstance.getTitle(),
                                    chipInstanceSubtitle: sSubTitle || oTileConfiguration.display_subtitle_text,
                                    tileURL: oTileConfiguration.navigation_target_url ||
                                        "#" + oTileConfiguration.navigation_semantic_object +
                                        "-" + oTileConfiguration.navigation_semantic_action +
                                        (oTileConfiguration.navigation_semantic_parameters ? "?" + oTileConfiguration.navigation_semantic_parameters : "")
                                });
                                break;
                            case O_ERROR_TYPES.emptyConfiguration:
                                var sRawTileConfiguration = oChipInstance.getConfigurationParameter("tileConfiguration");
                                aResult.push({
                                    type: O_ERROR_TYPES.emptyConfiguration,
                                    chipInstanceId: oChipInstance.getId(),
                                    chipInstanceTitle: sTitle || oChipInstance.getTitle(),
                                    chipInstanceSubtitle: sSubTitle || null,
                                    tileConfiguration: sRawTileConfiguration
                                });
                                break;
                            case O_ERROR_TYPES.tileIntentSupportException:
                                aResult.push({
                                    type: O_ERROR_TYPES.tileIntentSupportException,
                                    exception: oTileSupport.exception,
                                    chipInstanceId: oChipInstance.getId()
                                });
                                break;
                            case O_ERROR_TYPES.referenceTileNotFound:
                                // ignored because it's already handled above (for all tiles - not just AppLaunchers).
                                break;
                            default:
                            // nop
                        }
                    }
                }

                return aResult;
            }, [] /* aResult */);

            return aErrors;
        };

        /**
         * Formats information about one error into a string.
         *
         * @param {object} oTileError An object representing tile errors
         */
        this._formatTileError = function (oTileError) {
            switch (oTileError.type) {
                case O_ERROR_TYPES.catalogTileNotFound:
                    return "comes from catalog tile with ID '" + oTileError.chipId +
                        "' but this cannot be found in catalog '" + oTileError.chipCatalogId + "' (CATALOG TILE NOT FOUND).";
                case O_ERROR_TYPES.referenceTileNotFound:
                    return "comes from reference tile '" + oTileError.referenceChipId + "'" +
                        " in catalog '" + oTileError.referenceChipCatalogId + "'" +
                        " which in turn refers to the tile '" + oTileError.missingReferredChipId + "'" +
                        " from catalog '" + oTileError.missingReferredCatalogId + "', but this is missing (REFERENCED TILE NOT FOUND).";
                case O_ERROR_TYPES.noTargetMapping:
                    return "was hidden because a target mapping for the tile URL '" + oTileError.tileURL + "' was not found (TARGET MAPPING NOT FOUND).";
                case O_ERROR_TYPES.emptyConfiguration:
                    return "the tile configuration '" + oTileError.tileConfiguration + "' is empty or invalid (BAD CONFIGURATION).";
                case O_ERROR_TYPES.tileIntentSupportException:
                    return "exception occurred while checking tile intent support: " + oTileError.exception + " (EXCEPTION RAISED).";
                default:
                    return "unknown error type '" + oTileError.type + "' (UNKNOWN ERROR). Error data: " + JSON.stringify(oTileError, null, 3);
            }
        };

        /**
         * Logs a warning or an error message about possible tile errors.
         *
         * @param {object[]} aErrorsByGroup an array containing information about errors within one group
         * @private
         * @deprecated As of version 1.120
         */
        this._reportTileErrors = function (aErrorsByGroup) {
            var that = this;
            var aWarningMessage = [];
            var aErrorMessage = [];

            // constructs a string like "Title (Subtitle)"
            function constructTileTitle (sTitle, sSubtitle) {
                var sCombined = [sTitle, sSubtitle]
                    .map(function (s, i) {
                        return i === 1 && s ? "(" + s + ")" : s;
                    })
                    .filter(function (s) {
                        return typeof s === "string" && s.length > 0;
                    })
                    .join(" ");

                return (sCombined.length > 0)
                    ? "'" + sCombined + "'"
                    : "";
            }

            aErrorsByGroup.forEach(function (oErrorByGroup) {
                var sGroupInformation = "  in Group '" + oErrorByGroup.group.title + "' with Group ID '" + oErrorByGroup.group.id + "'";
                var aGroupErrorMessage = [];
                var aGroupWarningMessage = [];

                oErrorByGroup.errors.forEach(function (oError) {
                    var sTileIdentifier = [
                        "  - tile instance",
                        constructTileTitle(oError.chipInstanceTitle, oError.chipInstanceSubtitle),
                        "with ID '" + oError.chipInstanceId + "'"
                    ]
                        .filter(function (s) {
                            return s.length > 0;
                        })
                        .join(" ");

                    if (oError.type === O_ERROR_TYPES.noTargetMapping) {
                        aGroupWarningMessage.push([
                            sTileIdentifier,
                            "    " + that._formatTileError(oError)
                        ].join("\n"));
                    } else {
                        aGroupErrorMessage.push([
                            sTileIdentifier,
                            "    " + that._formatTileError(oError)
                        ].join("\n"));
                    }
                });

                if (aGroupErrorMessage.length > 0) {
                    aErrorMessage.push([
                        sGroupInformation,
                        aGroupErrorMessage.join("\n")
                    ].join("\n"));
                }
                if (aGroupWarningMessage.length > 0) {
                    aWarningMessage.push([
                        sGroupInformation,
                        aGroupWarningMessage.join("\n")
                    ].join("\n"));
                }
            });

            if (aErrorMessage.length > 0) {
                aErrorMessage.unshift("Tile error(s) were detected:");
                Log.error(aErrorMessage.join("\n"), null, "sap.ushell_abap.adapters.abap.LaunchPageAdapter");
            }

            if (aWarningMessage.length > 0) {
                aWarningMessage.unshift("Tile warning(s) were detected:");
                Log.warning(aWarningMessage.join("\n"), null, "sap.ushell_abap.adapters.abap.LaunchPageAdapter");
            }
        };

        /**
         * Returns the groups of the user.
         * These page objects can be passed in to all functions expecting a group.
         *
         * The first group in this list is considered the default group.
         *
         * @returns {jQuery.Promise<sap.ushell_abap.pbServices.ui2.Page[]>} Resolves the list of group.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getGroups = function () {
            if (this._bPageSetFullyLoaded) {
                // return the already known page set (the order is recomputed because the page set might have changed it since last call)
                return new jQuery.Deferred().resolve(getOrderedPages()).promise();
            }
            if (!oGetGroupsDeferred) {
                // start a new request and remember it in oGetGroupsDeferred, so that parallel calls don't start another one
                oGetGroupsDeferred = new jQuery.Deferred();
                var oDeferred = new jQuery.Deferred();

                Container.getServiceAsync("PageBuilding")
                    .then(function (PageBuildingService) {
                        var fnReadPageSet = PageBuildingService.getFactory().getPageBuildingService().readPageSet;

                        if (oLaunchPageServiceConfig && oLaunchPageServiceConfig.cacheId) {
                            // add PageSet cache buster token if configured
                            fnReadPageSet.cacheBusterTokens
                                .put(sDEFAULT_PAGE_ID, oLaunchPageServiceConfig.cacheId);
                        }
                        if (oLaunchPageServiceConfig && oLaunchPageServiceConfig["sap-ui2-cache-disable"] && fnReadPageSet) {
                            var oAppendedParameters = fnReadPageSet.appendedParameters || {};
                            oAppendedParameters["sap-ui2-cache-disable"] = oLaunchPageServiceConfig["sap-ui2-cache-disable"];
                            fnReadPageSet.appendedParameters = oAppendedParameters;
                        }

                        // The target mappings are used in the classic homepage and in spaces mode.
                        var oMappingPromise = this._loadTargetMappings();

                        /*
                         * In spaces mode we will create an empty page inside an empty pageSet.
                         * This is needed because the appfinder and search integration request the classic homepage content which is not available in spaces mode.
                         * For consistency reasons it should then also not be available from the search results.
                         * The empty pageSet has all needed functions the real pageSet has.
                         * Functions which should not be used in spaces mode throw an error
                         */
                        if (Config.last("/core/spaces/enabled")) {
                            var oFactory = PageBuildingService.getFactory();

                            var oFakeDefaultPage = new Page(oFactory, {
                                id: PAGE_ID_WITHOUT_TM
                            });

                            that._oCurrentPageSet = {
                                getDefaultPage: function () {
                                    return oFakeDefaultPage;
                                },
                                getPages: function () {
                                    return [oFakeDefaultPage];
                                },
                                appendPage: function () {
                                    throw new Error("Not implemented in Pages Runtime");
                                },
                                isPageRemovable: function () {
                                    return false;
                                },
                                removePage: function () {
                                    throw new Error("Not implemented in Pages Runtime");
                                },
                                isPageResettable: function () {
                                    return true;
                                },
                                resetPage: function () {
                                },
                                getConfiguration: function () {
                                    return "{}";
                                },
                                setConfiguration: function () {
                                },
                                filter: function () {
                                }
                            };

                            oGetGroupsDeferred.resolve([]);
                        } else {
                            var oPageSetsPromise = PageBuildingService.getPageSet(sDEFAULT_PAGE_ID);

                            oPageSetsPromise
                                .fail(oDeferred.reject.bind(oDeferred))
                                .done(function (oPageSet) {
                                    this._oCurrentPageSet = oPageSet;
                                    // remove unsupported pages before loading their chip instances
                                    this._oCurrentPageSet.filter([sDEFAULT_PAGE_ID], [sDEFAULT_CATALOG_ID]);
                                    // Trigger load of all CHIP instances, but wait for the locals only
                                    this._loadApplaunchersAndDelayLoadingOfOtherChips(oPageSet.getPages(), oDeferred.resolve.bind(oDeferred, oPageSet));
                                }.bind(this));

                            jQuery.when(oMappingPromise, oDeferred)
                                .done(function (oTargetMappings, oPageSet) {
                                    this._bPageSetFullyLoaded = true;

                                    if (Log.getLevel() >= Log.Level.DEBUG) { // sap-ui-debug = true
                                        this._findAndReportTileErrors(oPageSet.getPages(), oTargetMappingSupport);
                                    }

                                    oGetGroupsDeferred.resolve(getOrderedPages());
                                }.bind(this))
                                .fail(oGetGroupsDeferred.reject.bind(oGetGroupsDeferred));
                        }
                    }.bind(this));
            }

            return oGetGroupsDeferred.promise();
        };

        /**
         * Reads the target mappings from the start_up request and stores them in the "oTargetMappingSupport"
         * variable.
         *
         * @returns {Promise} A promise resolving when all target mappings have been stored.
         * @private
         */
        this._loadTargetMappings = function () {
            if (this._oTargetMappingPromise) {
                return this._oTargetMappingPromise;
            }
            this._oTargetMappingPromise = this._readTargetMappings()
                .done(function (oTargetMappings) {
                    var sFormFactor = Utils.getFormFactor();

                    oTargetMappings.results.forEach(function (oTargetMapping) {
                        var sKey = LaunchPageAdapter.prototype._makeTargetMappingSupportKey(
                            oTargetMapping.semanticObject,
                            oTargetMapping.semanticAction
                        );

                        oTargetMappingSupport.put(sKey,
                            // make sure it's boolean
                            oTargetMappingSupport.get(sKey)
                            || !!(oTargetMapping.formFactors && oTargetMapping.formFactors[sFormFactor]));
                    });
                }.bind(this));

            return this._oTargetMappingPromise;
        };

        /**
         * Calls getGroups and waits also for custom and remote tiles to be loaded
         * @returns {Promise<object[]>} Resolves the result of the getGroups call
         *
         * @private
         * @since 1.105.0
         * @deprecated As of version 1.120
         */
        this.getGroupsAndWaitForAllChips = function () {
            return new Promise(function (resolve, reject) {
                that.getGroups()
                    .done(resolve)
                    .fail(reject);
            }).then(function (aGroups) {
                return Promise.allSettled(that._aOtherChipsPromises)
                    .then(function () {
                        return aGroups;
                    });
            });
        };

        /**
         * Returns the default group.
         *
         * @returns {jQuery.Promise<sap.ushell_abap.pbServices.ui2.Page>} Resolves the default group.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getDefaultGroup = function () {
            var oDeferred = new jQuery.Deferred();

            this.getGroups().done(function () {
                // TODO test if getGroups()[0] is faster than getDefaultPage
                oDeferred.resolve(that._oCurrentPageSet.getDefaultPage());
            }).fail(oDeferred.reject.bind(oDeferred));

            return oDeferred.promise();
        };

        /**
         * Returns the title of the given group.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oGroup the group (as received via #getGroups())
         * @returns {string} the group title
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getGroupTitle = function (oGroup) {
            return oGroup.getTitle();
        };

        /**
         * Returns the unique identifier of the given group.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oGroup the group (as received via #getGroups())
         * @returns {string} the group id
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getGroupId = function (oGroup) {
            return oGroup.getId();
        };

        /**
         * Returns the tiles of the given group.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oGroup the group
         * @returns {sap.ushell_abap.pbServices.ui2.ChipInstance[]} the tiles in the order to be displayed.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getGroupTiles = function (oGroup) {
            var oLayout;

            try {
                oLayout = JSON.parse(oGroup.getLayout());
            } catch (e) {
                Log.warning("Group " + oGroup.getId() + ": invalid layout: " + oGroup.getLayout(), null, sCOMPONENT);
                // no valid layout
            }
            return this._orderBasedOnConfiguration(oLayout, oGroup.getChipInstances());
        };

        /**
         * Fetches the group tiles and clones them. The failing group tiles are filtered out
         * @param {sap.ushell_abap.pbServices.ui2.Page} oGroup The group
         * @returns {Promise<sap.ushell_abap.pbServices.ui2.ChipInstance[]>} The array of group tiles
         *
         * @private
         * @since 1.113.0
         * @deprecated As of version 1.120
         */
        this.getGroupTileClones = function (oGroup) {
            var aGroupTiles = this.getGroupTiles(oGroup);
            var aGroupTilePromises = aGroupTiles.map(function (oChipInstance) {
                return oChipInstance.clone();
            });

            return Promise.allSettled(aGroupTilePromises).then(function (aTiles) {
                return aTiles.map(function (oTile) {
                    if (!oTile.value) {
                        Log.warning("Group tile was filtered out: ", oTile.reason);
                    }
                    return oTile.value;
                })
                    .filter(function (oChipInstance) {
                        return oChipInstance;
                    });

            });
        };

        /**
         * Adds a new group.
         *
         * Intention: the page builder adds this group to the end of the home screen.
         *
         * In case of error it gets the consistent backend state of all groups as array of <code>sap.ushell_abap.pbServices.ui2.Page</code>.
         *
         * @param {string} sTitle the title of the new group
         * @returns {jQuery.Promise<sap.ushell_abap.pbServices.ui2.Page>} Resolves once the group was added.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.addGroup = function (sTitle) {
            var oDeferred = new jQuery.Deferred();

            that._oCurrentPageSet.appendPage(sTitle, sDEFAULT_CATALOG_ID,
                oDeferred.resolve.bind(oDeferred),
                oDeferred.reject.bind(oDeferred, getOrderedPages()));

            return oDeferred.promise();
        };

        /**
         * Removes a group.
         *
         * In case of error it gets the consistent backend state of all groups as array of <code>sap.ushell_abap.pbServices.ui2.Page</code>.
         *
         * @param {object} oGroup the group to be removed
         * @returns {jQuery.Promise} Resolves once the group was removed.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.removeGroup = function (oGroup) {
            var oDeferred = new jQuery.Deferred();

            if (that._oCurrentPageSet.isPageRemovable(oGroup)) {
                that._oCurrentPageSet.removePage(oGroup, oDeferred.resolve.bind(oDeferred),
                    oDeferred.reject.bind(oDeferred, getOrderedPages()));
            } else {
                oDeferred.reject(getOrderedPages());
            }
            return oDeferred.promise();
        };

        /**
         * Resets a group. Only groups can be reset for which <code>isGroupRemovable</code> returns false.
         * For others the fail handler is called.
         *
         * In case of error it gets the consistent backend state of all groups as array of <code>sap.ushell_abap.pbServices.ui2.Page</code>.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oGroup the group to be reset
         * @returns {jQuery.Promise} Resolves once the group was reset.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.resetGroup = function (oGroup) {
            var oDeferred = new jQuery.Deferred();
            var that = this;

            if (that._oCurrentPageSet.isPageRemovable(oGroup)) {
                // pages which are removable should be removed and cannot be reset
                oDeferred.reject(getOrderedPages());
            } else if (that._oCurrentPageSet.isPageResettable(oGroup)) {
                // pages which are resettable should be reset
                that._oCurrentPageSet.resetPage(oGroup, function () {
                    that._loadApplaunchersAndDelayLoadingOfOtherChips([oGroup], oDeferred.resolve.bind(oDeferred, oGroup));
                }, oDeferred.reject.bind(oDeferred, getOrderedPages()));
            } else {
                // on all other pages an reset has simply no effect
                oDeferred.resolve(oGroup);
            }

            return oDeferred.promise();
        };

        /**
         * Checks if a group can be removed. Returns a boolean indicating if the group is removable.
         *
         * @param {object} oGroup the group to be checked
         * @returns {boolean} true if removable; false if only resettable
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.isGroupRemovable = function (oGroup) {
            return that._oCurrentPageSet.isPageRemovable(oGroup);
        };

        /**
         * Checks if a group is locked (which means that the group is not changeable). Returns a boolean indicating this issue.
         *
         * @param {object} oGroup the group to be checked
         * @returns {boolean} true if locked; false if not locked
         * @since 1.25.0
         * @deprecated As of version 1.120
         */
        this.isGroupLocked = function (oGroup) {
            return oGroup.isPersonalizationLocked();
        };

        /**
         * Checks if link personalization is supported on a platform or chip instance level.
         *
         * @param {object} [oChipInstance] ChipInstance to check for personalization support
         * @returns {boolean} If no chip instance was provided and link personalization is supported in general, the return value is true.
         *  If a chip was provided, the return value is true for chips supporting the link type or false for chips that don't.
         * @deprecated As of version 1.120
         */
        this.isLinkPersonalizationSupported = function (oChipInstance) {
            if (!oChipInstance) {
                return true;
            }

            if (!oChipInstance.isStub()) {
                var oTypeContracts = oChipInstance.getContract && oChipInstance.getContract("types");
                var aTileTypes = oTypeContracts && oTypeContracts.getAvailableTypes() || [];

                return aTileTypes.indexOf("link") !== -1;
            }

            return false;
        };

        /**
         * Returns <code>true</code> if the tile's target intent is supported taking into account the form factor of the current device.
         *
         * "Supported" means that the tile is not a broken reference and that navigation to the intent is possible.
         *
         * <p>This function may be called both for group tiles and for catalog tiles.
         *
         * <p>This function will log a warning if a falsy value is returned.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the group tile or catalog tile
         * @returns {boolean} <code>true</code> if the tile's target intent is supported
         * @since 1.21.0
         */
        this.isTileIntentSupported = function (oTile) {
            if (!this._oTargetMappingPromise || this._oTargetMappingPromise.state() !== "resolved") {
                Log.error("isTileIntentSupported might return wrong results as data loading hasn't finished yet!", "sap.ushell_abap.adapters.abap.LaunchPageAdapter");
            }

            var oTileConfiguration;
            var oSupport = this._checkTileIntentSupport(oTile, oTargetMappingSupport);

            if (!oSupport.isSupported && oSupport.reason === O_ERROR_TYPES.noTargetMapping) {
                if (isAppLauncher(oTile)) {
                    oTileConfiguration = getAppLauncherTileConfiguration(oTile);
                } else {
                    oTileConfiguration = getCustomTileConfiguration(oTile);
                }
                var sTitle = this._getBagText(oTile, "tileProperties", "display_title_text") || oTileConfiguration.display_title_text;
                var sSubTitle = this._getBagText(oTile, "tileProperties", "display_subtitle_text") || oTileConfiguration.display_subtitle_text;
                var sIntent = oTileConfiguration.navigation_target_url;

                // This error is already logged in an aggregated log message by _reportTileErrors, but we keep it because
                // tiles may be added to the FLP home at a later point of time within the session (not covered by the other log).
                Log.warning("Group tile with ID '" + oTile.getId() + "' is filtered out as the current user has no target mapping assigned for the intent '" +
                    sIntent + "'",
                    "\nGroup Tile ID: '" + oTile.getId() + "'\n" +
                    "Title: '" + sTitle + "'\n" +
                    "Subtitle: '" + sSubTitle + "'\n" +
                    "Intent: '" + sIntent + "' - ",
                    "sap.ushell_abap.adapters.abap.LaunchPageAdapter");
            }

            return oSupport.isSupported;
        };

        /**
         * Returns <code>true</code> if the tile's target intent is supported taking into account the form factor of the current device.
         *
         * "Supported" means that the tile is not a broken reference and that navigation to the intent is possible.
         *
         * <p>This function may be called both for group tiles and for catalog tiles.
         *
         * <p>This function will log a warning if a falsy value is returned.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the group tile or catalog tile
         * @returns {Promise} A Promise that returns to <code>true</code> if the tile's target intent is supported
         * @since 1.21.0
         */
        this.isTileIntentSupportedAsync = function (oTile) {
            return this._loadTargetMappings().then(function () {
                return this.isTileIntentSupported(oTile);
            }.bind(this));
        };

        /**
         * Implements the functionality described in the public <code>#isTileIntentSupported</code> without logging.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the group tile or catalog tile
         * @param {sap.ushell_abap.pbServices.ui2.Map} oTargetMappingSupport the tile target mapping support
         * @returns {object} An object reporting the support of the tile intent that
         *   looks like the following objects based on whether the tile intent is supported:
         *   <pre>
         *   {
         *     isSupported: true
         *   }
         *   </pre>
         *   or
         *   <pre>
         *   {
         *     isSupported: false,
         *     reason: "<REASON>"
         *   }
         *   </pre>
         *   Where "<REASON>" is one of the following strings:
         *   <ul>
         *     <li>"brokenReference": the group tile references to a catalog reference tile that refers to a non-existing tile</li>
         *     <li>"emptyConfiguration": the tile configuration was found to be empty</li>
         *     <li>"noTargetMapping": no matching target mapping corresponds to the given group tile</li>
         *   </ul>
         * @private
         * @see sap.ushell.services.LaunchPage#isTileIntentSupported
         */
        this._checkTileIntentSupport = function (oTile, oTargetMappingSupport) {
            var oTileConfiguration;
            var bIsTileIntentSupported;
            var fnMkKey = LaunchPageAdapter.prototype._makeTargetMappingSupportKey;

            if (!isAppLauncher(oTile)) {
                // Try to read the configuration string from the CHIP, if the CHIP sticks to the same configuration
                // structure as the SAP app launcher tiles, it may be filtered in case it launches a intent which is not assigned.
                oTileConfiguration = getCustomTileConfiguration(oTile);
                if (!oTileConfiguration.navigation_use_semantic_object || !oTileConfiguration.navigation_semantic_object ||
                    !oTileConfiguration.navigation_semantic_action) {
                    // This tile does not launch an intent, so it will never be filtered
                    return {
                        isSupported: true
                    };
                }

                bIsTileIntentSupported = oTargetMappingSupport.get(fnMkKey(
                    oTileConfiguration.navigation_semantic_object,
                    oTileConfiguration.navigation_semantic_action
                ));

                // Generic Smart Business target mappings must also be supported. Generic target mappings are indicated via a leading
                // asterisk like *-analyzeSBKPIDetailsS4HANA and means that all semantic objects match, and only the semantic action counts.
                // See BCP 1980297194.
                if (!bIsTileIntentSupported) {
                    bIsTileIntentSupported = oTargetMappingSupport.get(fnMkKey("*", oTileConfiguration.navigation_semantic_action));
                }

                if (!bIsTileIntentSupported) {
                    return {
                        isSupported: false,
                        reason: O_ERROR_TYPES.noTargetMapping
                    };
                }

                // Only for app launchers we are able to detect if they launch a "valid" intent.
                // For other tiles we do not even know if and what will be launched, as it is a tile internal information.
                return { isSupported: true };
            }
            if (oTile.isStub()) {
                // the assumption is that currently launcher tiles are always local CHIPs and for those getGroups is waiting.
                // Thus this Error should newer be reached.
                // If stub launchers shall be supported, it must found a way how to decided if they are supported.
                Log.error(
                    "Applauncher Tile not loaded completely! This might be caused by a RemoteCatalog content. Standard Tiles are not supported as part of RemoteCatalogs",
                    new Error("Applauncher Tile is still a stub"),
                    "sap.ushell_abap.adapters.abap.LaunchPageAdapter"
                );
                // we don't want to fail the launchpad for a single faulty tile, therefore we treat them the same as custom tiles
                return { isSupported: true };
            }

            if (oTile.getChip() && typeof oTile.getChip().isBrokenReference === "function" && oTile.getChip().isBrokenReference()) {
                return {
                    isSupported: false,
                    reason: O_ERROR_TYPES.referenceTileNotFound
                };
            }

            oTileConfiguration = getAppLauncherTileConfiguration(oTile);

            if (isEmptyObject(oTileConfiguration)) {
                // seems as if there was an error in getAppLauncherTileConfiguration the app launcher has no valid configuration, so hide it
                return {
                    isSupported: false,
                    reason: O_ERROR_TYPES.emptyConfiguration
                };
            }

            if (!oTileConfiguration.navigation_use_semantic_object) {
                // the tile launches an arbitrary URL which is always supported
                return { isSupported: true };
            }

            bIsTileIntentSupported = oTargetMappingSupport.get(fnMkKey(
                oTileConfiguration.navigation_semantic_object,
                oTileConfiguration.navigation_semantic_action
            ));

            if (bIsTileIntentSupported) {
                return { isSupported: true };
            }

            return {
                isSupported: false,
                reason: O_ERROR_TYPES.noTargetMapping
            };
        };

        /**
         * Moves a group to a new index.
         * In case of error it gets the consistent backend state of all groups as array of <code>sap.ushell_abap.pbServices.ui2.Page</code>.
         *
         * @param {object} oGroup the group to be moved
         * @param {int} iNewIndex the new index for the group
         * @returns {jQuery.Promise} Resolves once the group was moved.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.moveGroup = function (oGroup, iNewIndex) {
            // see wiki UICEI/PageSets+and+Groups#PageSetsandGroups-Rearrangegroupsonthehomepage
            var oDeferred = new jQuery.Deferred();

            function updateConfiguration (aPages) {
                var aIds = [];

                aPages.forEach(function (oPage) {
                    aIds.push(oPage.getId());
                });

                // save new order without overwriting other parts of the configuration
                var oConf = JSON.parse(that._oCurrentPageSet.getConfiguration() || "{}");
                oConf.order = aIds;
                that._oCurrentPageSet.setConfiguration(JSON.stringify(oConf),
                    oDeferred.resolve.bind(oDeferred),
                    oDeferred.reject.bind(oDeferred, getOrderedPages()));
            }

            this.getGroups().done(function (aPages) {
                var iIndex = aPages.indexOf(oGroup);

                aPages.splice(iIndex, 1);
                aPages.splice(iNewIndex, 0, oGroup);
                updateConfiguration(aPages);
            });

            return oDeferred.promise();
        };

        /**
         * Sets a new title to an existing group.
         * In case of error it gets the old title.
         *
         * @param {object} oGroup the group we need to set the title
         * @param {string} sNewTitle the new title of the group
         * @returns {jQuery.Promise} Resolves once the group title was set.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.setGroupTitle = function (oGroup, sNewTitle) {
            var oDeferred = new jQuery.Deferred();

            oGroup.setTitle(sNewTitle,
                oDeferred.resolve.bind(oDeferred),
                function () {
                    oDeferred.reject(oGroup.getTitle());
                });

            return oDeferred.promise();
        };

        /**
         * Adds a tile to the end of a group. The group is optional. If no group is given, use the default group.
         * In case of error it gets the consistent backend state of all groups as array of <code>sap.ushell_abap.pbServices.ui2.Page</code>.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oCatalogTile an 'anonymous' catalog tile from the catalog browser
         * @param {sap.ushell_abap.pbServices.ui2.Page} [oGroup] the group
         * @returns {jQuery.Promise<sap.ushell_abap.pbServices.ui2.ChipInstance>} Resolves once the tile was added.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.addTile = function (oCatalogTile, oGroup) {
            var oDeferred = new jQuery.Deferred();
            var oChip = oCatalogTile.getChip(); // unwrap (see wrapAsChipInstances)

            if (oCatalogTile.isStub()) {
                // this is a "Cannot load tile" tile, this should not be added to the group
                // BCP 1670300106
                oDeferred.reject(getOrderedPages(), new Error("Tile was not added to the group as the tile failed loading"));
            } else {
                if (!oGroup) {
                    oGroup = that._oCurrentPageSet.getDefaultPage();
                }

                oGroup.addChipInstance(oChip,
                    oDeferred.resolve.bind(oDeferred),
                    oDeferred.reject.bind(oDeferred, getOrderedPages()));
            }

            return oDeferred.promise();
        };

        /**
         * Removes the given tile from the given group.
         * In case of error it gets the consistent backend state of all groups as array of <code>sap.ushell_abap.pbServices.ui2.Page</code>.
         *
         * @param {sap.ushell_abap.pbServices.ui2.Page} oGroup the group containing the tile
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the tile
         * @returns {jQuery.Promise} Resolves once the tile was removed.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.removeTile = function (oGroup, oTile) {
            var oDeferred = new jQuery.Deferred();

            oGroup.removeChipInstance(oTile,
                oDeferred.resolve.bind(oDeferred),
                oDeferred.reject.bind(oDeferred, getOrderedPages()));
            return oDeferred.promise();
        };

        /**
         * Moves a tile to another location in the same or a different group.
         * In case of error it gets the consistent backend state of all groups as array of <code>sap.ushell_abap.pbServices.ui2.Page</code>.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the tile to be moved
         * @param {int} iSourceIndex the index in the source group
         * @param {int} iTargetIndex the index in the target group, in case this parameter is not supplied we assume the
         *   move tile is within the source group using iSourceIndex
         * @param {sap.ushell_abap.pbServices.ui2.Page} oSourceGroup the tile's group
         * @param {sap.ushell_abap.pbServices.ui2.Page} [oTargetGroup] the group the tile will be placed in or tile's group if not supplied
         * @param {string} [sNewTileType] (added with 1.60) The new type of the tile
         * @returns {jQuery.Promise} Resolves once the tile was moved.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.moveTile = function (oTile, iSourceIndex, iTargetIndex, oSourceGroup, oTargetGroup, sNewTileType) {
            var oDeferred = new jQuery.Deferred();
            var bIsWrapperOnly = this._isWrapperOnly(oTile);
            var oBagsContents = new Utils.Map();
            var oCreatedChipInstance;
            var fnFailure = oDeferred.reject.bind(oDeferred, getOrderedPages());
            var iCalls = 2;

            function resolveMoveBetweenGroups (oNewChipInstance) {
                iCalls -= 1;

                // In case addChipInstance is faster then removeChipInstance,
                // oNewChipInstance needs to be cached for the removeChipInstance call
                oCreatedChipInstance = oCreatedChipInstance || oNewChipInstance;
                if (iCalls <= 0) {
                    oDeferred.resolve(oCreatedChipInstance);
                }
            }

            if (!oTargetGroup) {
                oTargetGroup = oSourceGroup;
            }

            var oSourceLayout = calculateCurrentLayout(oSourceGroup, this);
            var oTargetLayout = calculateCurrentLayout(oTargetGroup, this);
            var sOldTileType = this.getTileType(oTile);

            iSourceIndex = removeFromLayout(oSourceLayout, oTile, sOldTileType);
            if (iSourceIndex < 0) {
                Log.error("moveTile: tile not found in source group", null, sCOMPONENT);
                fnFailure();
                return oDeferred.promise();
            }

            if (oSourceGroup === oTargetGroup) {
                addToLayout(oSourceLayout, oTile.getId(), iTargetIndex, sNewTileType);
                oSourceGroup.setLayout(JSON.stringify(oSourceLayout), oDeferred.resolve.bind(oDeferred, oTile), fnFailure);
            } else {
                Container.getServiceAsync("PageBuilding")
                    .then(function (PageBuildingService) {
                        var oActualPageBuildingService = PageBuildingService.getFactory().getPageBuildingService();

                        // store bag contents for later storing them in the new CHIP instances
                        var aBagIds = oTile.getBagIds();
                        aBagIds.forEach(function (sBagId) {
                            var oBagContent = {
                                texts: [],
                                properties: []
                            };
                            var oBag = oTile.getBag(sBagId);
                            // ignore contents of CHIP bags
                            oBag.getOwnTextNames().forEach(function (sName) {
                                oBagContent.texts.push({ name: sName, value: oBag.getText(sName) });
                            });
                            oBag.getOwnPropertyNames().forEach(function (sName) {
                                oBagContent.properties.push({ name: sName, value: oBag.getProperty(sName) });
                            });
                            if (oBagContent.texts.length > 0 || oBagContent.properties.length > 0) {
                                oBagsContents.put(sBagId, oBagContent);
                            }
                        });

                        // one $batch to add tile to target group, remove old tile, update layout of source group
                        oActualPageBuildingService.openBatchQueue();

                        var aTargetChipInstances = this.getGroupTiles(oTargetGroup);

                        oTargetGroup.addChipInstance(bIsWrapperOnly ? oTile.getChip() : oTile, function (oNewChipInstance) {
                            var oCurrentBag;
                            aTargetChipInstances.splice(iTargetIndex, 0, oNewChipInstance);
                            // Note: additional requests after the $batch required, because new ID was previously unknown.
                            // So this requests could not be batched together

                            // Add bags to CHIP instance in target group
                            aBagIds.forEach(function (sBagId) {
                                var oBagContent = oBagsContents.get(sBagId);
                                if (oBagContent) {
                                    oCurrentBag = oNewChipInstance.getBag(sBagId);
                                    oBagContent.texts.forEach(function (oText) {
                                        oCurrentBag.setText(oText.name, oText.value);
                                    });
                                    oBagContent.properties.forEach(function (oProperty) {
                                        oCurrentBag.setProperty(oProperty.name, oProperty.value);
                                    });
                                    oCurrentBag.save(function () {
                                        // don't wait for the save operation for performance reasons
                                    }, function () {
                                        Log.error("Bag " + sBagId + ": could not be saved", null, sCOMPONENT);
                                    });
                                }
                            });
                            // update order of tiles which is stored in the layout property
                            addToLayout(oTargetLayout, oNewChipInstance.getId(), iTargetIndex, sNewTileType);
                            oTargetGroup.setLayout(JSON.stringify(oTargetLayout), resolveMoveBetweenGroups.bind(this, oNewChipInstance), fnFailure);
                        }, fnFailure, oTile.isStub()); // do not load the tile if first load failed

                        oSourceGroup.removeChipInstance(oTile, resolveMoveBetweenGroups, fnFailure);
                        oSourceGroup.setLayout(JSON.stringify(oSourceLayout), /*fnSuccess*/undefined, fnFailure);

                        oActualPageBuildingService.submitBatchQueue(undefined, fnFailure);
                    }.bind(this));
            }

            return oDeferred.promise();
        };

        /**
         * Returns the tile's unique identifier
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the tile
         * @returns {string} the id
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getTileId = function (oTile) {
            return oTile.getId();
        };

        /**
         * Returns the CHIP's type. This is even possible if the tile is not fully loaded so far.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance the CHIP instance
         * @returns {string} the type. either <code>"tile"</code> or <code>"link"</code> or <code>"card"</code>.
         * @since 1.32.0
         * @deprecated As of version 1.120
         */
        this.getTileType = function (oChipInstance) {
            var oGroup = oChipInstance.getPage();

            try {
                var oLayout = JSON.parse(oGroup.getLayout());
                // oLayout.order -> contains ordered chip instance IDs to be displayed as a tile
                // oLayout.linkOrder -> contains ordered chip instance IDs to be displayed as a link
                if (oLayout.linkOrder && oLayout.linkOrder.indexOf(oChipInstance.getId()) > -1) {
                    // Note: no verification if oTile.getChip().getAvailableTypes() contains "link" -> fail early in this case
                    return "link";
                }
            } catch (e) {
                Log.warning("Group " + oGroup.getId() + ": invalid layout: " + oGroup.getLayout(), null, sCOMPONENT);
            }

            // Cards can never be a stub at this point
            if (oChipInstance.isStub() === false) {
                var oTypesContract = oChipInstance.getContract("types");
                if (oTypesContract && oTypesContract.getAvailableTypes().indexOf("card") > -1) {
                    return "card";
                }
            }

            return "tile";
        };

        /**
         * Returns a promise for the card's manifest. The promise is resolved synchronously.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} card the CHIP instance
         * @returns {object} The card's manifest
         * @private
         * @deprecated As of version 1.120
         */
        this.getCardManifest = function (card) {
            try {
                var sManifest = card.getConfigurationParameter("cardManifest");
                var oManifest = JSON.parse(sManifest);
                var oCardData = ManifestPropertyHelper.getCardData(card);
                oManifest = ManifestPropertyHelper.mergeCardData(oManifest, oCardData);

                return oManifest;
            } catch (error) {
                Log.error("Manifest of card with id '" + card.getId() + "' could not be read. " + error.message);
            }
        };

        /**
         * Returns the tile's title.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the tile
         * @returns {string} the title, might be <code>undefined</code> if tile has not finished loading (see {@link #getTileView}).
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getTileTitle = function (oTile) {
            return oTile.getTitle();
        };

        /**
         * Returns the tile's SAPUI5 representation.
         * <br>
         * Note: this function became async since 1.23.0.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile The tile's chip data
         * @returns {jQuery.Promise<sap.ui.core.Control>} Resolves an instance of sap.m.GenericTile.
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getTileView = function (oTile) {
            var that = this;
            var oDeferred = new jQuery.Deferred();

            function doResolve () {
                var sTileType;

                // if needed, notify the tile in which way it shall display itself
                var oTypesContract = oTile.getContract("types");
                if (oTypesContract) {
                    // set the tile type before getting the view
                    // note: the contract caches the new type until the handler is attached
                    sTileType = that.getTileType(oTile);
                    oTypesContract.setType(sTileType);
                }

                oTile.getImplementationAsSapui5Async()
                    .then(function (oView) {
                        if (sTileType === "link") {
                            if (!oView.hasModel()) {
                                oView = oView.getComponentInstance().getRootControl();
                            }
                            var oViewModel = oView.getModel();
                            var oViewController = oView.getController();

                            var sUrl = oViewModel && oViewModel.getProperty ? oViewModel.getProperty("/nav/navigation_target_url") : undefined;
                            var oLinkTile = new GenericTile({
                                mode: "{view>/mode}",
                                header: "{view>/config/display_title_text}",
                                subheader: "{view>/config/display_subtitle_text}",
                                sizeBehavior: "{view>/sizeBehavior}",
                                size: "Auto",
                                url: oViewController.formatters && oViewController.formatters.leanURL(sUrl),
                                press: [oViewController.onPress, oViewController]
                            });

                            oLinkTile.setModel(oViewModel, "view");
                            oDeferred.resolve(oLinkTile);
                            return;
                        }

                        oDeferred.resolve(oView);
                    })
                    .catch(doReject);
            }

            function doReject (sMessage) {
                oDeferred.reject("Tile not successfully loaded" + (sMessage ? (": " + sMessage) : ""));
            }

            if (!oTile.$loadingPromise) { // loading resolved or failed
                if (!oTile.isStub()) { // success
                    // call getImplementationAsSapui5Async async for non-AppLaunchers and resolves.
                    // For AppLaunchers, there is an optimization (requested by RT) to call it sync
                    // as the resources are already bundled and loaded at startup.
                    // Although they are called sync the view creation is still async
                    Utils.callHandler(doResolve, doReject, /*async*/!isAppLauncher(oTile));
                } else { // failed
                    doReject();
                }
            } else { // loading pending
                oTile.$loadingPromise
                    .fail(doReject)
                    .done(function () {
                        try {
                            doResolve();
                        } catch (ex) {
                            doReject((ex.message || ex));
                        }
                    });
            }

            return oDeferred.promise();
        };

        /**
         * Returns the tile size in the format <code>1x1</code> or <code>1x2</code>.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the tile
         * @returns {string} the tile size
         * @since 1.11.0
         */
        this.getTileSize = function (oTile) {
            var row = (!oTile.isStub() && oTile.getConfigurationParameter("row")) || "1";
            var col = (!oTile.isStub() && oTile.getConfigurationParameter("col")) || "1";
            return row + "x" + col;
        };

        /**
         * Refresh a tile with its latest data.
         * Only dynamic data should be updated, not the tile configuration itself.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oTile the tile
         * @deprecated As of version 1.120
         */
        this.refreshTile = function (oTile) {
            oTile.refresh();
        };

        /**
         * Notifies the given tile that the tile's visibility had been changed.
         *
         * @param {object} oTile the tile
         * @param {boolean} bNewVisible the CHIP visibility
         */
        this.setTileVisible = function (oTile, bNewVisible) {
            var oVisibleContract = !oTile.isStub() && oTile.getContract("visible");

            if (oVisibleContract) {
                // tile has been successfully loaded already
                oVisibleContract.setVisible(bNewVisible);
                return;
            }

            if (oTile.isStub() && oTile.$loadingPromise) {
                // the tile is currently loaded
                var sTileId = this.getTileId(oTile);
                var bOldVisibility = mEarlyTileVisibilities[sTileId];
                // update cached visibility also if handler was already attached
                mEarlyTileVisibilities[sTileId] = bNewVisible;

                if (bOldVisibility === undefined) {
                    // attach handler, but only once.
                    oTile.$loadingPromise.done(function () {
                        var oVisibleContract = oTile.getContract("visible");
                        if (oVisibleContract) {
                            // tile uses visibility contract and sets the latest visibility
                            // NOTE: mEarlyTileVisibilities[sTileId] may be changed after handler was attached
                            oVisibleContract.setVisible(mEarlyTileVisibilities[sTileId]);
                        }
                    });
                }
                return;
            }

            // oTile.isStub() && ! oTile.$loadingPromise means that tile failed loading ("cannot load tile").
            // In this case nothing needs to be done!
        };

        this.getTileActions = function (oTile) {
            var oActionsContract = !oTile.isStub() && oTile.getContract("actions");
            if (oActionsContract) {
                return oActionsContract.getActions();
            }
            return [];
        };

        /**
         * A function which returns the tile's navigation target.
         * Assigning this to <code>location.hash</code> will open the app.
         *
         * @param {object} oTile the tile
         * @returns {string} the tile target
         * @deprecated As of version 1.120
         */
        this.getTileTarget = function (/*oTile*/) {
            // TODO method obsolete for now - TBD (don't implement)
            return null;
        };

        /**
         * A function which returns the technical information about the tile.
         * <p>
         * The ABAP adapter returns details about the chip instance corresponding to the tile.
         *
         * @param {object} oTile the tile
         * @returns {string} debug information for the tile
         * @deprecated As of version 1.120
         */
        this.getTileDebugInfo = function (oTile) {
            var oChip = oTile.getChip();
            var oCatalog = oChip.getCatalog();
            var oDebugInfo = {
                chipId: oChip.getId(),
                chipInstanceId: oTile.getId(),
                chipTitle: oChip.getTitle(),
                chipDescription: oChip.getDescription(),
                completelyLoaded: !oTile.isStub()
            };

            if (oCatalog) {
                oDebugInfo.catalogId = oCatalog.getId();
            }
            var sDebugInfo = JSON.stringify(oDebugInfo);
            return sDebugInfo;
        };

        /**
         * Returns the user's catalogs. This operation provides graceful degradation and improved responsiveness.
         * <p>
         * Only severe failures make the overall operation fail. If loading of a remote catalog fails,
         * this is handled gracefully by providing a "dummy" empty catalog (with ID instead of title).
         * Use {@link getCatalogError} to check if a (remote) catalog could not be loaded from the backend.
         * <p>
         * Care has been taken to make sure that progress notifications are sent reliably for each single catalog,
         * i.e. attaching a <code>progress</code> handler gives you the same possibilities as attaching a <code>done</code> handler,
         * but with the advantage of improved responsiveness.
         *
         * @example
         * sap.ushell.Container.getServiceAsync("LaunchPage")
         *     .then(function (LaunchPageService) {
         *         LaunchPageService.getCatalogs()
         *             .fail(function (sErrorMessage) { // string
         *                 // handle error situation
         *             })
         *             .progress(function (oCatalog) { // object
         *                 // do s.th. with single catalog
         *             })
         *             .done(function (aCatalogs) { // object[]
         *                 aCatalogs.forEach(function (oCatalog) {
         *                     // do s.th. with single catalog
         *                 });
         *             });
         *     });
         *
         * @returns {jQuery.Promise} Resolves an array of black-box catalog objects is provided (which might be empty).
         *   In case of failure, an error message is passed. Progress notifications are sent for each single catalog,
         *   providing a single black-box catalog object each time.
         * @since 1.11.0
         */
        this.getCatalogs = function () {
            var oDeferred;
            var oOldGetCatalogsDeferred = oGetCatalogsDeferred;
            var bRefreshRequired = bCatalogsValid === false;

            // Note: bCatalogsValid can be undefined, false, true
            if (oOldGetCatalogsDeferred && !oOldGetCatalogsDeferred.$notified && !bRefreshRequired) {
                // re-use existing Deferred object; we cannot miss any notifications!
                oDeferred = oOldGetCatalogsDeferred;
            } else {
                oGetCatalogsDeferred = new jQuery.Deferred();
                oDeferred = oGetCatalogsDeferred;
                oDeferred
                    .done(function () {
                        if (oDeferred === oGetCatalogsDeferred) {
                            // only the last call is allowed to change "global" variables
                            bCatalogsValid = true;
                        }
                    })
                    .always(function () {
                        if (oDeferred === oGetCatalogsDeferred) {
                            // only the last call is allowed to change "global" variables
                            oGetCatalogsDeferred = null;
                        }
                    });

                if (oOldGetCatalogsDeferred) {
                    if (bRefreshRequired) {
                        bCatalogsValid = undefined; // not yet valid, refresh is in progress...
                    }
                    // if we cannot reuse the old Deferred object, wait until it is done;
                    // after invalidation, wait until old operations are complete and then start a new roundtrip
                    oOldGetCatalogsDeferred
                        .always(function () {
                            this._startLoading(oDeferred, bRefreshRequired);
                        }.bind(this));
                } else {
                    this._startLoading(oDeferred, bRefreshRequired);
                }
            }

            return oDeferred.promise();
        };

        /**
         * Resolves the promise to return the user's catalogs by refreshing the first remote catalog found, failing gracefully.
         *
         * @param {jQuery.Deferred} oDeferred A jQuery.Deferred to be resolved, rejected or notified.
         * @returns {Promise<sap.ushell.services.PageBuilding>} A promise that is resolved once the PageBuilding service is retrieved.
         * @private
         */
        this._refreshRemoteCatalogs = function (oDeferred) {
            return Container.getServiceAsync("PageBuilding")
                .then(function (PageBuildingService) {
                    var iPendingRequests = 0;
                    var oFactory = PageBuildingService.getFactory();
                    var aWrappedCatalogs = wrapCatalogs(oFactory);

                    aWrappedCatalogs.forEach(function (oWrappedCatalog) {
                        var oCatalog = oWrappedCatalog.ui2catalog;
                        // TODO Improve performance: One invalid remote catalog causes refresh of all
                        if (oCatalog.isStub() || oCatalog.getType() === "H" || oCatalog.getType() === "REMOTE") {
                            iPendingRequests += 1;

                            oCatalog.refresh(function () {
                                oWrappedCatalog.title = oCatalog.getTitle();
                                oWrappedCatalog.tiles = wrapAsChipInstances(oFactory, oCatalog.getChips());
                                // TODO oRemoteCatalogWrapper.errorMessage once wrappers are cached

                                oDeferred.notify(oWrappedCatalog);

                                iPendingRequests -= 1;
                                if (iPendingRequests <= 0) {
                                    oDeferred.resolve(aWrappedCatalogs);
                                }
                            }, function (sMessage) {
                                // log errors, but do not fail
                                Log.error("Failed to load catalog: " + sMessage, oCatalog.toString(), sCOMPONENT);
                                oWrappedCatalog.errorMessage = sMessage || "Error"; // not undefined!

                                oDeferred.notify(oWrappedCatalog);

                                iPendingRequests -= 1;
                                if (iPendingRequests <= 0) {
                                    oDeferred.resolve(aWrappedCatalogs);
                                }
                            });
                        } else {
                            oDeferred.notify(oWrappedCatalog);
                            oDeferred.$notified = true; // notifications have already been sent
                        }
                    });

                    if (iPendingRequests <= 0) {
                        oDeferred.resolve(aWrappedCatalogs);
                    }
                });
        };

        /**
         * Resolves the promise to return the user's catalogs...by just knowing them already.
         *
         * @param {jQuery.Deferred} oDeferred A jQuery.Deferred to be resolved, rejected or notified.
         * @returns {Promise<sap.ushell.services.PageBuilding>} A promise that is resolved once the PageBuilding service is retrieved.
         * @private
         */
        this._useKnownCatalogs = function (oDeferred) {
            return Container.getServiceAsync("PageBuilding")
                .then(function (PageBuildingService) {
                    var aWrappedCatalogs = wrapCatalogs(PageBuildingService.getFactory());

                    aWrappedCatalogs.forEach(function (oWrappedCatalog) {
                        oDeferred.notify(oWrappedCatalog);
                    });

                    oDeferred.resolve(aWrappedCatalogs);
                });
        };

        /**
         * Resolves the promise to return the user's catalogs either by loading them, refreshing them, or just knowing them already.
         *
         * @param {jQuery.Deferred} oDeferred A jQuery.Deferred to be resolved, rejected or notified.
         * @param {boolean} bRefreshRequired Whether or not the catalogs should be loaded again.
         * @private
         */
        this._doGetCatalogs = function (oDeferred, bRefreshRequired) {
            var oAllCatalogs = this._oCurrentPageSet.getDefaultPage().getAllCatalogs();
            if (oAllCatalogs.isStub()) {
                oAllCatalogs.load(function () {
                    this._refreshRemoteCatalogs(oDeferred);
                }.bind(this), oDeferred.reject, "type eq 'CATALOG_PAGE' or type eq 'H' or type eq 'SM_CATALOG' or type eq 'REMOTE'", true, "title", true);
            } else if (bRefreshRequired) {
                this._refreshRemoteCatalogs(oDeferred);
            } else {
                this._useKnownCatalogs(oDeferred);
            }
        };

        /**
         * Starts loading of catalogs, after parallel calls and invalidation have been taken care of.
         *
         * @param {jQuery.Deferred} oDeferred A jQuery.Deferred to be resolved, rejected or notified.
         * @param {boolean} bRefreshRequired Whether or not the catalogs should be loaded again.
         * @private
         */
        this._startLoading = function (oDeferred, bRefreshRequired) {
            var oPromise;

            if (oLaunchPageServiceConfig && oLaunchPageServiceConfig.cacheId) {
                // add cache buster token for the allCatalogs request
                // use the same token as for the classic homepage (for service /UI2/PAGE_BUILDER_PERS),
                // this is invalidated for all kind of changes of a catalog (title, tiles, target mappings)
                oPromise = Container.getServiceAsync("PageBuilding")
                    .then(function (PageBuildingService) {
                        var oCacheTokens = PageBuildingService.getFactory().getPageBuildingService().readAllCatalogs.cacheBusterTokens;

                        oCacheTokens.put(sDEFAULT_PAGE_ID, oLaunchPageServiceConfig.cacheId);

                        if (Config.last("/core/spaces/enabled")) {
                            oCacheTokens.put(PAGE_ID_WITHOUT_TM, oLaunchPageServiceConfig.cacheId);
                        }
                    })
                    .catch(oDeferred.reject);
            } else {
                oPromise = Promise.resolve();
            }

            oPromise
                .then(function () {
                    if (that._bPageSetFullyLoaded) {
                        this._doGetCatalogs(oDeferred, bRefreshRequired);
                    } else {
                        this.getGroups()
                            .done(function () {
                                this._doGetCatalogs(oDeferred, bRefreshRequired);
                            }.bind(this))
                            .fail(oDeferred.reject);
                    }
                }.bind(this))
                .catch(oDeferred.reject);
        };

        /**
         * Returns whether the catalogs collection previously returned by <code>getCatalogs()</code> is still valid.
         * Initially, this is <code>false</code> until <code>getCatalogs()</code> has been called. Later,
         * it might become <code>false</code> again in case one of the catalogs has been invalidated,
         * e.g. due to the addition of a tile ("Add to catalog" scenario).
         *
         * @returns {boolean}
         * @since 1.16.4
         * @deprecated As of version 1.120
         * @see #getCatalogs
         */
        this.isCatalogsValid = function () {
            return !!bCatalogsValid; // converts undefined to false
        };

        /**
         * Returns the catalog's technical data.
         *
         * @param {object} oConfigCatalog the catalog
         * @returns {object} an object with the following properties (the list may be incomplete):
         *   <ul>
         *     <li><code>id</code>: the catalog ID
         *     <li><code>systemId</code>: [remote catalogs] the ID of the remote system
         *     <li><code>remoteId</code>: [remote catalogs] the ID of the catalog in the remote system
         *     <li><code>baseUrl</code>: [remote catalogs] the base URL of the catalog in the remote system
         *   </ul>
         * @since 1.21.2
         */
        this.getCatalogData = function (oConfigCatalog) {
            return oConfigCatalog.ui2catalog.getCatalogData();
        };

        /**
         * Returns the catalog's technical error message in case it could not be loaded from the backend.
         * <p>
         * <b>Beware:</b> The technical error message is not translated!
         *
         * @param {object} oConfigCatalog the catalog
         * @returns {string} the technical error message or <code>undefined</code> if the catalog was loaded properly
         * @since 1.17.1
         */
        this.getCatalogError = function (oConfigCatalog) {
            return oConfigCatalog.errorMessage;
        };

        /**
         * Returns the catalog's unique identifier
         *
         * @param {object} oConfigCatalog the catalog as received via #getCatalogs()
         * @returns {string} the id
         * @since 1.11.0
         */
        this.getCatalogId = function (oConfigCatalog) {
            return oConfigCatalog.id;
        };

        /**
         * Returns the catalog's title
         *
         * @param {object} oConfigCatalog the catalog
         * @returns {string} the title
         * @since 1.11.0
         */
        this.getCatalogTitle = function (oConfigCatalog) {
            return oConfigCatalog.title;
        };

        /**
         * Returns the catalog's tiles.
         *
         * @param {object} oConfigCatalog the catalog
         * @returns {jQuery.Promise<sap.ushell_abap.pbServices.ui2.Chip[]>} Resolves the catalog tiles.
         * @since 1.11.0
         */
        this.getCatalogTiles = function (oConfigCatalog) {
            var oDeferred = new jQuery.Deferred();
            var iAsyncCount = 0;

            function onLoaded () {
                iAsyncCount -= 1;

                if (iAsyncCount === 0) {
                    oDeferred.resolve(oConfigCatalog.tiles);
                }
            }

            function onFailure (oCatalogTile, sMessage) {
                // log errors, but do not fail
                Log.error("Failed to load catalog tile: " + sMessage, oCatalogTile.toString(), sCOMPONENT);
                onLoaded();
            }

            for (var i = 0; i < oConfigCatalog.tiles.length; i += 1) {
                var oChipInstance = oConfigCatalog.tiles[i];
                if (oChipInstance.isStub()) {
                    iAsyncCount += 1;
                    oChipInstance.load(onLoaded, onFailure.bind(null, oChipInstance));
                }
            }

            if (iAsyncCount === 0) {
                oDeferred.resolve(oConfigCatalog.tiles);
            }

            return oDeferred.promise();
        };

        /**
         * Get numberUnit for a catalog tile.
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @returns {string} the numberUnit for the catalog tile provided via the tileConfiguration
         * @since 1.84.0
         */
        this.getCatalogTileNumberUnit = chipsUtils.getCatalogTileNumberUnit;

        /**
         * Returns the unique identifier of the catalog tile. May be called for a catalog tile or (since 1.21.0) for a group tile.
         * In the latter case it returns the unique identifier of the catalog tile on which the group tile is based.
         *
         * @param {sap.ui2.ChipInstance} oTile the tile or the catalog tile
         * @returns {string} the id
         * @since 1.11.0
         */
        this.getCatalogTileId = function (oTile) {
            var oChip = oTile.getChip();
            var sId = oChip.getId();

            if (oChip.getCatalog() &&
                oChip.getCatalog().getCatalogData() &&
                oChip.getCatalog().getCatalogData().systemAlias) {
                // Add system alias to the ID so the runtime distinguishes tiles with different aliases.
                // This is needed for the app finder (=tile catalog)
                sId += "_" + oChip.getCatalog().getCatalogData().systemAlias;
            }

            return sId;
        };

        /**
         * Returns the stable id of the catalog tile.
         * Note: If no stable id can be retrieved (For example for technical catalog tiles) or the reference is broken
         * a fallback to the normal id is in place.
         *
         * @param {sap.ui2.ChipInstance} oTile the tile or the catalog tile
         * @returns {string} the stable id
         * @private
         * @since 1.98.0
         */
        this.getStableCatalogTileId = function (oTile) {
            var oChip = oTile.getChip();
            var sStableId = oChip.getReferenceChipId();

            if (sStableId === "O") {
                // The reference is broken. We do not want to return the value indicating that
                sStableId = null;
            }
            if (!sStableId) {
                sStableId = this.getCatalogTileId(oTile);
            }

            return sStableId;
        };

        /**
         * Returns the catalog tile's title. May be called for a catalog tile or (since 1.32.0) for a group tile.
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @returns {string} the title
         * @since 1.11.0
         */
        this.getCatalogTileTitle = function (oCatalogTile) {
            // if we rely on the fallback inside oCatalogTile.getTitle() (which calls chip.getTitle() if it has no own title),
            // this method may not be cannot be called with group tiles. -> this is used by Usage analysis reporting
            return oCatalogTile.getChip().getTitle();
        };

        /**
         * Returns the catalog tile's size in the format <code>1x1</code> or <code>1x2</code>.
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @returns {string} the size
         * @since 1.11.0
         */
        this.getCatalogTileSize = chipsUtils.getCatalogTileSize;

        /**
         * A function which returns UI5 view / control of the catalog tile
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @param {boolean} bPreview return the tile in preview mode, default is true
         * @returns {sap.ui.core.Control} the UI5 representation
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.getCatalogTileView = function (oCatalogTile, bPreview) {
            bPreview = typeof bPreview !== "undefined" ? bPreview : true;

            var sTitle = this.getCatalogTileTitle(oCatalogTile);

            if (oCatalogTile.isStub()) {
                Log.warning("CHIP (instance) is just a stub!", oCatalogTile.toString(true), sCOMPONENT);
                return new StaticTile({ // TODO remove as soon as RT has a own // TODO: pending dependency migration
                    icon: "sap-icon://hide",
                    info: "",
                    infoState: "Critical",
                    subtitle: "",
                    title: sTitle
                }).addStyleClass("sapUshellTileError");
            }

            if (bPreview) {
                var oPreviewContract = oCatalogTile.getContract("preview");
                if (oPreviewContract) {
                    oPreviewContract.setEnabled(true);
                } else {
                    return new StaticTile({ // TODO remove as soon as RT has a own // TODO: pending dependency migration
                        title: sTitle,
                        subtitle: "",
                        info: "",
                        infoState: "Neutral",
                        icon: "sap-icon://folder-full"
                    });
                }
            }

            return getImplementationAsSapui5(oCatalogTile, sTitle, "Cannot get catalog tile view as SAPUI5");
        };

        /**
         * A function which returns UI5 view / control of the catalog tile
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @param {boolean} bPreview return the tile in preview mode, default is true
         * @returns {jQuery.Promise<sap.ui.core.Control>} the UI5 representation of the catalog tile
         * @since 1.97.0
         * @private
         */
        this.getCatalogTileViewControl = function (oCatalogTile, bPreview) {
            var oDeferred = new jQuery.Deferred();
            bPreview = typeof bPreview !== "undefined" ? bPreview : true;
            var sTitle = this.getCatalogTileTitle(oCatalogTile);

            if (oCatalogTile.isStub()) {
                Log.warning("CHIP (instance) is just a stub!", oCatalogTile.toString(true), sCOMPONENT);
                oDeferred.resolve(this._createErrorTile(sTitle, "CHIP was just a stub!"));
                return oDeferred.promise();
            }

            if (bPreview) {
                var oPreviewContract = oCatalogTile.getContract("preview");
                if (oPreviewContract) {
                    oPreviewContract.setEnabled(true);
                } else {
                    oDeferred.resolve(this._createPreviewTile(sTitle));
                    return oDeferred.promise();
                }
            }

            oCatalogTile.getImplementationAsSapui5Async()
                .catch(function (oError) {
                    Log.error("Cannot get catalog tile view as SAPUI5: " + (oError.message || oError), oError.stack, sCOMPONENT);
                    return this._createErrorTile(sTitle, (oError.message || oError));
                }.bind(this))
                .then(oDeferred.resolve);

            return oDeferred.promise();
        };

        /**
         * Returns an error tile
         * @param {string} sTitle The tile title
         * @param {string} [sMessage] A message which gets added to the tile as subtitle
         * @returns {sap.m.GenericTile} The error tile
         *
         * @private
         * @since 1.97.0
         */
        this._createErrorTile = function (sTitle, sMessage) {
            var oErrorTile = new GenericTile({
                state: LoadState.Failed,
                header: sTitle,
                subheader: sMessage || ""
            }).addStyleClass("sapUshellTileError");
            return oErrorTile;
        };

        /**
         * Returns a Tile for preview purposes
         * @param {string} sTitle The title
         * @returns {sap.ushell.ui.tile.StaticTile} a Preview Tile
         *
         * @private
         * @since 1.97.0
         */
        this._createPreviewTile = function (sTitle) {
            // TODO remove as soon as RT has an own // TODO: pending dependency migration
            return new StaticTile({
                title: sTitle,
                subtitle: "",
                info: "",
                infoState: "Neutral",
                icon: "sap-icon://folder-full"
            });
        };

        /**
         * Get navigation target URL for a catalog tile.
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @returns {string} the target URL for the catalog tile's underlying application as provided via the "preview" contract
         * @since 1.11.0
         */
        this.getCatalogTileTargetURL = chipsUtils.getCatalogTileTargetURL;

        /**
         * Get preview subtitle for a catalog tile.
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @returns {string} the preview subtitle for the catalog tile's underlying application as provided via the "preview" contract
         * @since 1.40.0
         */
        this.getCatalogTilePreviewSubtitle = chipsUtils.getCatalogTilePreviewSubtitle;

        /**
         * Get preview title for a catalog tile.
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @returns {string} the preview title for the catalog tile's underlying application as provided via the "preview" contract
         * @since 1.16.3
         */
        this.getCatalogTilePreviewTitle = chipsUtils.getCatalogTilePreviewTitle;

        /**
         * Returns the catalog tile info
         *
         * @param {object} oCatalogTile The catalog tile
         * @returns {string} The catalog tile info
         * @since 1.67.0
         */
        this.getCatalogTilePreviewInfo = chipsUtils.getCatalogTilePreviewInfo;

        /**
         * Returns the indicator data source url
         *
         * @param {object} oCatalogTile The catalog tile
         * @returns {object} The catalog tile indicator data source
         * @since 1.70.0
         */
        this.getCatalogTilePreviewIndicatorDataSource = chipsUtils.getCatalogTilePreviewIndicatorDataSource;

        /**
         * Get preview icon for a catalog tile.
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile the catalog tile
         * @returns {string} the preview icon as URL/URI for the catalog tile's underlying application
         *   as provided via the "preview" contract
         * @since 1.16.3
         */
        this.getCatalogTilePreviewIcon = chipsUtils.getCatalogTilePreviewIcon;

        /**
         * Returns the keywords associated with a catalog tile which can be used to find the catalog tile in a search.
         * Note: getCatalogTileView <b>must</b> be called <b>before</b> this method. Otherwise the keywords may be incomplete.
         *
         * @param {sap.ui2.ChipInstance} oCatalogTile The catalog tile
         * @returns {string[]} The keywords associated with this catalog tile
         * @since 1.11.0
         */
        this.getCatalogTileKeywords = function (oCatalogTile) {
            var oKeywordsSet = {};
            var sCatalogTitle = oCatalogTile.getTitle();
            var sCatalogSubtitle = this.getCatalogTilePreviewSubtitle(oCatalogTile);
            var sCatalogDescription = oCatalogTile.getChip().getDescription();

            function addKeywords (oKeywordsSet, aKeywordsList) {
                if (Utils.isArray(aKeywordsList)) {
                    aKeywordsList.forEach(function (sKeyword) {
                        if (oKeywordsSet.hasOwnProperty(sKeyword)) {
                            return;
                        }

                        oKeywordsSet[sKeyword] = null; // property names are used in order to avoid duplicates
                    });
                }
            }

            function getKeywordsDefinedInCatalogTileData (oCatalogTile) {
                var sKeywordsText = LaunchPageAdapter.prototype._getBagText(oCatalogTile, "tileProperties", "display_search_keywords");

                if (!Utils.isString(sKeywordsText) || sKeywordsText === "") {
                    return [];
                }

                return sKeywordsText.trim().split(/\s*,\s*/g);
            }

            function getInfoDefinedInCatalogTileData (oCatalogTile) {
                var sInfoText = LaunchPageAdapter.prototype._getBagText(oCatalogTile, "tileProperties", "display_info_text");

                if (sInfoText) {
                    return [sInfoText];
                }

                return [];
            }

            function getNumberUnitDefinedInCatalogTileData (oCatalogTile) {
                var sNumberUnit = LaunchPageAdapter.prototype._getConfigurationProperty(oCatalogTile, "tileConfiguration", "display_number_unit");

                if (sNumberUnit) {
                    return [sNumberUnit];
                }

                return [];
            }

            // Apply the 'search' contract when available
            function getKeywordsFromSearchContract (oCatalogTile) {
                var oSearchContract;

                if (oCatalogTile.isStub()) {
                    return [];
                }

                oSearchContract = oCatalogTile.getContract("search");
                if (oSearchContract) {
                    return oSearchContract.getKeywords();
                }

                return [];
            }

            // Relevant for app launcher tiles which are not instantiated in the app finder. It directly fetches keywords from catalogs data
            addKeywords(
                oKeywordsSet,
                getKeywordsDefinedInCatalogTileData(oCatalogTile)
            );
            addKeywords(
                oKeywordsSet,
                getInfoDefinedInCatalogTileData(oCatalogTile)
            );
            addKeywords(
                oKeywordsSet,
                getNumberUnitDefinedInCatalogTileData(oCatalogTile)
            );

            // Relevant for tiles which are instantiated in the app finder.
            addKeywords(
                oKeywordsSet,
                getKeywordsFromSearchContract(oCatalogTile)
            );

            if (sCatalogTitle) {
                addKeywords(oKeywordsSet, [sCatalogTitle]);
            }
            if (sCatalogSubtitle) {
                addKeywords(oKeywordsSet, [sCatalogSubtitle]);
            }
            if (sCatalogDescription) {
                addKeywords(oKeywordsSet, [sCatalogDescription]);
            }

            return Object.keys(oKeywordsSet); // property names are used in order to avoid duplicates
        };

        /**
         * Adds a bookmark to the user's home page.
         *
         * @param {object} oParameters bookmark parameters. In addition to title and URL, a bookmark might allow additional settings,
         *   such as an icon or a subtitle. Which settings are supported depends on the environment in which the application is running.
         *   Unsupported parameters will be ignored.
         * @param {string} oParameters.title The title of the bookmark.
         * @param {string} oParameters.url The URL of the bookmark. If the target application shall run in
         *   the Shell the URL has to be in the format <code>"#SO-Action~Context?P1=a&P2=x&/route?RPV=1"</code>
         * @param {string} [oParameters.icon] The icon URL of the bookmark (e.g. <code>"sap-icon://home"</code>).
         * @param {string} [oParameters.info] The information text of the bookmark.
         * @param {string} [oParameters.subtitle] The subtitle of the bookmark.
         * @param {string} [oParameters.serviceUrl] The URL to a REST or OData service
         *   that provides some dynamic information for the bookmark.
         * @param {string} [oParameters.serviceRefreshInterval] The refresh interval for the <code>serviceUrl</code> in seconds.
         * @param {string} [oParameters.numberUnit] The unit for the number retrieved from <code>serviceUrl</code>.
         * @param {object} [oGroup=DefaultGroup] Group to which the bookmark will be added to.
         *   If not given the default group {@link #getDefaultGroup} is used.
         * @returns {jQuery.Promise} Resolves once the bookmark was added.
         * @see sap.ushell.services.URLParsing#getShellHash
         * @since 1.11.0
         * @deprecated As of version 1.120
         */
        this.addBookmark = function (oParameters, oGroup) {
            var sChipId = sSTATIC_BASE_CHIP_ID;
            var oConfiguration = {
                display_icon_url: oParameters.icon || "",
                display_info_text: oParameters.info || "",
                display_subtitle_text: oParameters.subtitle || "",
                display_title_text: oParameters.title
            };
            var oDeferred = new jQuery.Deferred();

            var oBags = {
                tileProperties: {
                    texts: {
                        display_title_text: oConfiguration.display_title_text,
                        display_subtitle_text: oConfiguration.display_subtitle_text,
                        display_info_text: oConfiguration.display_info_text
                    }
                }
            };

            if (oParameters.serviceUrl) {
                sChipId = sDYNAMIC_BASE_CHIP_ID;
                oConfiguration.display_number_unit = oParameters.numberUnit;
                oConfiguration.service_refresh_interval = oParameters.serviceRefreshInterval || 0;
                oConfiguration.service_url = oParameters.serviceUrl;

                if (oParameters.dataSource) {
                    oConfiguration.data_source = {
                        type: oParameters.dataSource.type,
                        settings: {
                            odataVersion: ObjectPath.get(["dataSource", "settings", "odataVersion"], oParameters)
                        }
                    };
                }
            }

            if (oGroup && !(oGroup instanceof Page)) {
                // same behavior like addCatalogTileToGroup of the Bookmark service:
                // if the group is unknown don't use the default group but reject.
                oDeferred.reject("The given object is not a group");
                return oDeferred.promise();
            }

            oConfiguration = {
                tileConfiguration: JSON.stringify(oConfiguration)
            };

            this._createBookmarkTile(sChipId, oParameters.url, oConfiguration, oBags, oParameters.title, oGroup)
                .then(function () {
                    oDeferred.resolve();
                })
                .catch(function (vError) {
                    oDeferred.reject(vError.toString());
                });
            return oDeferred.promise();
        };

        /**
         * Adds a custom bookmark to the user's home page.
         * The bookmark is added to the given group.
         *
         * @param {object} oBookmarkConfig
         *      The configuration of the bookmark. See below for the structure.
         *      For creating the bookmark only the chipConfig is taken into consideration.
         * <pre>
         *     {
         *         vizType: "sap.ushell.demotiles.cdm.newstile",
         *         vizConfig: {
         *             "sap.flp": {
         *                 chipConfig: {
         *                     chipId: "X-SAP-UI2-CHIP:/UI2/AR_SRVC_NEWS",
         *                     bags: {},
         *                     configuration: {}
         *                 }
         *             },
         *             "sap.platform.runtime": {
         *                 includeManifest: true
         *             }
         *         },
         *         url: "#NewsFeed-displayNewsList",
         *         title: "My Title",
         *         icon: "sap-icon://world",
         *         subtitle: "My Subtitle",
         *         info: "My Info"
         *     }
         * </pre>
         * @param {object} oGroup The group where the bookmark should be added
         *
         * @returns {jQuery.Promise} Resolves with the resulting tile or rejects in case of an error
         *
         * @private
         * @since 1.83.0
         * @deprecated As of version 1.120
         */
        this.addCustomBookmark = function (oBookmarkConfig, oGroup) {
            var oChipConfig = oBookmarkConfig.vizConfig["sap.flp"].chipConfig;
            var oDeferred = new jQuery.Deferred();

            if (oGroup && !(oGroup instanceof Page)) {
                // same behavior like addCatalogTileToGroup of the Bookmark service:
                // if the group is unknown don't use the default group but reject.
                oDeferred.reject("The given object is not a group");
                return oDeferred.promise();
            }

            this._createBookmarkTile(oChipConfig.chipId, oBookmarkConfig.url, oChipConfig.configuration, oChipConfig.bags, oBookmarkConfig.title, oGroup)
                .then(function () {
                    oDeferred.resolve();
                })
                .catch(function (vError) {
                    oDeferred.reject(vError.toString());
                });
            return oDeferred.promise();
        };

        /**
         * Generates the navigation configuration which should end in the configuration parameter
         * tileConfiguration
         * @param {string} sUrl The url the bookmark is pointing to
         *
         * @returns {Promise<object>} Resolves with the navigation configuration
         *
         * @private
         * @since 1.83.0
         * @deprecated As of version 1.120
         */
        this._getTileTargetConfiguration = function (sUrl) {
            return Container.getServiceAsync("URLParsing").then(function (oUrlParsing) {
                var oConfiguration = {
                    navigation_target_url: sUrl,
                    navigation_use_semantic_object: false
                };

                var oLocationUri = new URI();
                var oBookmarkUri = new URI(sUrl); // http://medialize.github.io/URI.js/about-uris.html
                // try to figure out if SO navigation is used to enable form factor filtering but only if bookmark URL points
                // to the same domain. Foreign domains are not expected to use intent based navigation.
                var bSameDomain = oBookmarkUri.host() + oBookmarkUri.path() === oLocationUri.host() + oLocationUri.path();
                var fnMkKey = LaunchPageAdapter.prototype._makeTargetMappingSupportKey;

                // check and process sUrl
                if (sUrl[0] === "#" || bSameDomain) {
                    var oHash = oUrlParsing.parseShellHash(oUrlParsing.getShellHash(sUrl));
                    if (oHash && oTargetMappingSupport.get(fnMkKey(oHash.semanticObject, oHash.action)) !== undefined) {
                        // User has a target mapping matching the URL, so add this information to the bookmark for form factor based filtering
                        oConfiguration.navigation_use_semantic_object = true;
                        oConfiguration.navigation_semantic_object = oHash.semanticObject;
                        oConfiguration.navigation_semantic_action = oHash.action;
                        oConfiguration.navigation_semantic_parameters = oUrlParsing.paramsToString(oHash.params);
                    }
                }
                return oConfiguration;
            });
        };

        /**
         * Updates the bags of a chipInstance with the provided values and saves them.
         * @param {object} oChipInstance The ChipInstance
         * @param {object} [oBags] An object containing different bags with texts and properties
         *
         * @returns {Promise<string[]>} Resolves with an array of the bag ids which where saved
         *
         * @since 1.83.0
         * @deprecated As of version 1.120
         * @private
         */
        this._updateBags = function (oChipInstance, oBags) {
            var aPromises = [];
            var aUpdatedBags = [];
            if (!oBags) {
                oBags = {};
                aPromises.push(Promise.resolve([]));
            }

            Object.keys(oBags).forEach(function (sBagId) {
                var sPropertyId;
                var bBagUpdated = false;
                var oBagData = oBags[sBagId];
                var oBag = oChipInstance.getBag(sBagId);
                try {
                    for (sPropertyId in oBagData.properties) {
                        oBag.setProperty(sPropertyId, oBagData.properties[sPropertyId]);
                        bBagUpdated = true;
                    }
                    for (sPropertyId in oBagData.texts) {
                        oBag.setText(sPropertyId, oBagData.texts[sPropertyId]);
                        bBagUpdated = true;
                    }
                    aPromises.push(new Promise(function (resolve, reject) {
                        if (bBagUpdated) {
                            aUpdatedBags.push(sBagId);
                            oBag.save(resolve, reject);
                        } else {
                            resolve();
                        }
                    }));
                } catch (oError) {
                    aPromises.push(Promise.reject(oError));
                }
            });

            return Promise.all(aPromises)
                .then(function () {
                    return aUpdatedBags;
                });
        };

        /**
         * Checks the chip by initializing it
         * @param {object} oChipInstance The chipInstance
         *
         * @returns {Promise<undefined>} Resolves in case the chip initializes correctly.
         *
         * @since 1.83.0
         * @deprecated As of version 1.120
         * @private
         */
        this._checkBookmarkConfiguration = function (oChipInstance) {
            return new Promise(function (resolve, reject) {
                try {
                    // This check ensures that the configuration contains a target url
                    var oTileConfiguration = getAppLauncherTileConfiguration(oChipInstance);
                    if (!oTileConfiguration.navigation_target_url) {
                        throw new Error("tileConfiguration.navigation_target_url was not set");
                    }
                    // This check initializes the chip and its configuration
                    // This check fails in case the configuration is broken
                    this.getTileSize(oChipInstance);
                    resolve();
                } catch (oError) {
                    var sMessage = "Chip configuration check failed: " + oError.toString();
                    Log.error(sMessage, oChipInstance.getId(), sCOMPONENT);
                    reject(sMessage);
                }
            }.bind(this));
        };

        /**
         * Creates a bookmark chip instance and adds the given bags to it
         * @param {string} sChipId The id of the created chip
         * @param {string} sUrl The url the bookmark is pointing to
         * @param {object} oConfiguration The configuration of the created chip
         * @param {object} oBags The bags which should be added to the created chip
         * @param {string} sTitle The title of the bookmark
         * @param {object} oGroup The group to which the created chip should be added
         *
         * @returns {Promise<undefined>} A promise which resolves after the chip was created
         *
         * @private
         * @since 1.83.0
         * @deprecated As of version 1.120
         */
        this._createBookmarkTile = function (sChipId, sUrl, oConfiguration, oBags, sTitle, oGroup) {
            return Promise.all([
                Container.getServiceAsync("PageBuilding"),
                this._getTileTargetConfiguration(sUrl)
            ]).then(function (aResult) {
                var oPageBuildingService = aResult[0];
                var oNavigationConfiguration = aResult[1];

                // merge navigation properties on top of the provided configuration
                if (!oConfiguration.tileConfiguration) {
                    oConfiguration.tileConfiguration = JSON.stringify(oNavigationConfiguration);
                } else {
                    var oTileConfiguration = JSON.parse(oConfiguration.tileConfiguration);
                    oTileConfiguration = deepExtend({}, oTileConfiguration, oNavigationConfiguration);
                    oConfiguration.tileConfiguration = JSON.stringify(oTileConfiguration);
                }

                var oFactory = oPageBuildingService.getFactory();
                var oPbs = oFactory.getPageBuildingService();

                return new Promise(function (resolve, reject) {
                    if (this._bPageSetFullyLoaded) {
                        // use the default group if no group is specified
                        oGroup = oGroup || this._oCurrentPageSet.getDefaultPage();
                        var oChipInstance = oFactory.createChipInstance({
                            chipId: sChipId,
                            pageId: oGroup.getId(),
                            title: sTitle, // the title is used for e.g. the message toast after deleting a bookmark
                            configuration: JSON.stringify(oConfiguration),
                            layoutData: ""
                            // note: no deep insert, do not set the subtitle as bag property here, set later on the created chip!
                            // the create service does not support deep insert
                            // Chip ChipBags -> Chip
                        });
                        oGroup.addChipInstance(oChipInstance, resolve, reject, undefined);
                    } else {
                        // This can happen in the app cold-start use case, when the app creates a bookmark
                        // createPageChipInstanceFromRawData might throw Errors
                        try {
                            oPbs.createPageChipInstanceFromRawData({
                                chipId: sChipId,
                                configuration: JSON.stringify(oConfiguration),
                                pageId: "/UI2/Fiori2LaunchpadHome", // Default Page
                                title: sTitle // the title is used for e.g. the message toast after deleting a bookmark
                            }, function (oRawChipInstance) {
                                oFactory.createChipInstance(oRawChipInstance, resolve, reject, /*oPage*/undefined);
                            }, reject);
                        } catch (vError) {
                            reject(vError);
                        }
                    }
                }.bind(this));
            }.bind(this))
                .then(function (oChipInstance) {
                    return this._updateBags(oChipInstance, oBags)
                        .then(function () {
                            return this._checkBookmarkConfiguration(oChipInstance);
                        }.bind(this))
                        .catch(function (vError) {
                            return new Promise(function (resolve, reject) {
                                oChipInstance.remove(reject.bind(undefined, vError), reject.bind(undefined, vError));
                            });
                        });
                }.bind(this));
        };

        /**
         * Tells whether the given CHIP instance represents a bookmark matching the given identifier.
         *
         * @param {sap.ushell_abap.pbServices.ui2.ChipInstance} oChipInstance
         * @param {string | object} vIdentifier the url as string or an identifier object
         * @returns {boolean}
         * @see #addBookmark
         * @since 1.17.1
         * @deprecated As of version 1.120
         */
        LaunchPageAdapter.prototype._isBookmarkFor = function (oChipInstance, vIdentifier) {
            var sChipId = oChipInstance.getChip().getBaseChipId();

            if (sChipId !== undefined) {
                var sChipUrl = getAppLauncherTileConfiguration(oChipInstance).navigation_target_url;
                if (typeof vIdentifier === "string") {
                    return isAppLauncher(oChipInstance) && sChipUrl === vIdentifier;
                }
                return vIdentifier.chipId === sChipId && vIdentifier.url === sChipUrl;
            }
            return false;
        };

        /**
         * Visits <b>all</b> bookmarks pointing to the given URL from all of the user's groups
         * and calls the given visitor function on each such bookmark.
         * <p>
         * This is a potentially asynchronous operation in case the user's groups have not yet been loaded completely!
         *
         * @param {string} sUrl The URL of the bookmarks to be visited, exactly as specified to {@link #addBookmark}.
         * @param {function(sap.ushell_abap.pbServices.ui2.ChipInstance)} [fnVisitor] The asynchronous visitor function returning a
         *   <code>jQuery.Deferred</code> object's promise.
         *   In case of success, no details are expected. In case of failure, an error message is passed.
         * @returns {jQuery.Promise} Resolves the count of visited bookmarks is provided (which might be zero).
         *   In case of failure, an error message is passed.
         * @see #addBookmark
         * @since 1.17.1
         * @deprecated As of version 1.120
         */
        LaunchPageAdapter.prototype._visitBookmarks = function (sUrl, fnVisitor) {
            var aDeferreds = [];
            var oDeferred = new jQuery.Deferred();

            that.getGroupsAndWaitForAllChips()
                .then(function (aGroups) {
                    var iCount = 0;
                    aGroups.forEach(function (oGroup) {
                        oGroup.getChipInstances().forEach(function (oChipInstance) {
                            if (that._isBookmarkFor(oChipInstance, sUrl)) {
                                iCount += 1;
                                if (fnVisitor) {
                                    aDeferreds.push(fnVisitor(oChipInstance));
                                }
                            }
                        });
                    });
                    if (aDeferreds.length === 0) {
                        oDeferred.resolve(iCount);
                    } else {
                        jQuery.when.apply(jQuery, aDeferreds)
                            .fail(function (sMessage) {
                                oDeferred.reject(sMessage);
                            })
                            .done(function () {
                                oDeferred.resolve(iCount);
                            });
                    }
                })
                .catch(function (vError) {
                    oDeferred.reject(vError.message || vError);
                });
            return oDeferred.promise();
        };

        /**
         * Visits <b>all</b> bookmarks matching to the given identifier from all of the user's groups
         * and calls the given visitor function on each such bookmark.
         * @param {object} oIdentifier
         *   All bookmarks are matched which exactly match all the properties.
         * @param {string} oIdentifier.url
         *   The URL the bookmark is launching, exactly as specified to {@link #addCustomBookmark}.
         * @param {string} oIdentifier.chipId
         *   The chipId to be counted, exactly as specified to {@link #addCustomBookmark}.
         *
         * @param {function} fnVisitor
         *   A function which might resolve a native promise and gets the tile as parameter
         *
         * @returns {Promise<int>} Resolves after all visitors resolved
         *
         * @private
         * @since 1.83.0
         * @deprecated As of version 1.120
         */
        this._visitCustomBookmarks = function (oIdentifier, fnVisitor) {
            if (!oIdentifier.chipId) {
                return Promise.reject("_visitCustomBookmarks: Required parameter is missing: oIdentifier.chipId");
            }
            return new Promise(function (resolve, reject) {
                this.getGroups()
                    .fail(reject)
                    .done(function (aGroups) {
                        var aPromises = [];
                        var iCount = 0;

                        aGroups.forEach(function (oGroup) {
                            oGroup.getChipInstances().forEach(function (oChipInstance) {
                                if (LaunchPageAdapter.prototype._isBookmarkFor(oChipInstance, oIdentifier)) {
                                    iCount += 1;
                                    if (fnVisitor) {
                                        aPromises.push(fnVisitor(oChipInstance));
                                    }
                                }
                            });
                        });
                        Promise.all(aPromises)
                            .then(function () {
                                resolve(iCount);
                            })
                            .catch(reject);
                    });
            }.bind(this));
        };

        /**
         * Counts <b>all</b> bookmarks pointing to the given URL from all of the user's pages.
         * You can use this method to check if a bookmark already exists.
         * <p>
         * This is a potentially asynchronous operation in case the user's pages have not yet been loaded completely!
         *
         * @param {string} sUrl The URL of the bookmarks to be counted, exactly as specified to {@link #addBookmark}.
         * @returns {jQuery.Promise} Resolves the count of existing bookmarks is provided (which might be zero).
         *   In case of failure, an error message is passed.
         * @see #addBookmark
         * @since 1.17.1
         * @deprecated As of version 1.120
         */
        this.countBookmarks = function (sUrl) {
            return LaunchPageAdapter.prototype._visitBookmarks(sUrl);
        };

        /**
         * Counts <b>all</b> custom bookmarks matching exactly the identification data.
         * Can be used to check if a bookmark already exists (e.g. before updating).
         *
         * @param {object} oIdentifier
         *   An object which is used to find the bookmarks by matching the provided properties.
         * @param {string} oIdentifier.url
         *   The URL which was used to create the bookmark using {@link #addCustomBookmark}.
         * @param {string} oIdentifier.chipId
         *   The chipId which was used to create the bookmark using {@link #addCustomBookmark}.
         *
         * @returns {Promise<int>} The count of bookmarks matching the identifier.
         *
         * @see #addCustomBookmark
         * @since 1.83.0
         * @deprecated As of version 1.120
         *
         * @private
         */
        this.countCustomBookmarks = function (oIdentifier) {
            return this._visitCustomBookmarks(oIdentifier);
        };

        /**
         * Deletes <b>all</b> bookmarks pointing to the given URL from all of the user's pages.
         *
         * @param {string} sUrl The URL of the bookmarks to be deleted, exactly as specified to {@link #addBookmark}.
         * @returns {jQuery.Promise} Resolves the number of deleted bookmarks is provided (which might be zero).
         *   In case of failure, an error message is passed.
         * @see #addBookmark
         * @see #countBookmarks
         * @since 1.17.1
         * @deprecated As of version 1.120
         */
        this.deleteBookmarks = function (sUrl) {
            return LaunchPageAdapter.prototype._visitBookmarks(sUrl, function (oChipInstance) {
                var oDeferred = new jQuery.Deferred();
                oChipInstance.remove(oDeferred.resolve.bind(oDeferred),
                    oDeferred.reject.bind(oDeferred));
                return oDeferred.promise();
            });
        };

        /**
         * Deletes <b>all</b> custom bookmarks matching exactly the identification data.
         * {@link #countCustomBookmarks} can be used to check upfront how many bookmarks are going to be affected.
         *
         * @param {object} oIdentifier
         *   An object which is used to find the bookmarks by matching the provided properties.
         * @param {string} oIdentifier.url
         *   The URL which was used to create the bookmark using {@link #addCustomBookmark}.
         * @param {string} oIdentifier.chipId
         *   The chipId which was used to create the bookmark using {@link #addCustomBookmark}.
         *
         * @returns {Promise<int>} The count of bookmarks which were deleted.
         *
         * @see #addCustomBookmark
         * @see #countCustomBookmarks
         * @since 1.83.0
         * @deprecated As of version 1.120
         *
         * @private
         */
        this.deleteCustomBookmarks = function (oIdentifier) {
            return this._visitCustomBookmarks(oIdentifier, function (oChipInstance) {
                return new Promise(function (resolve, reject) {
                    oChipInstance.remove(resolve, reject);
                });
            });
        };

        /**
         * Updates <b>all</b> bookmarks pointing to the given URL in all of the user's groups with the given new parameters.
         * Parameters which are omitted are not changed in the existing bookmarks.
         *
         * @param {string} sUrl The URL of the bookmarks to be updated, exactly as specified to {@link #addBookmark}.
         *   In case you need to update the URL itself, pass the old one here and the new one as <code>oParameters.url</code>!
         * @param {object} oParameters The bookmark parameters as documented in {@link #addBookmark}.
         * @returns {jQuery.Promise} Resolves the number of updated bookmarks is provided (which might be zero).
         *   In case of failure, an error message is passed.
         * @see #addBookmark
         * @see #countBookmarks
         * @see #deleteBookmarks
         * @since 1.17.1
         * @deprecated As of version 1.120
         */
        this.updateBookmarks = function (sUrl, oParameters) {
            return LaunchPageAdapter.prototype._visitBookmarks(sUrl, function (oChipInstance) {
                var oTileConfiguration = getAppLauncherTileConfiguration(oChipInstance);
                var oDeferred = new jQuery.Deferred();

                // do only the update for properties which changed
                var oBags = {
                    tileProperties: {
                        texts: {}
                    }
                };

                // title is required to be unequal empty string
                if (oParameters.title) {
                    oBags.tileProperties.texts.display_title_text = oParameters.title;
                }
                if (typeof oParameters.subtitle === "string") {
                    oBags.tileProperties.texts.display_subtitle_text = oParameters.subtitle;
                }
                if (typeof oParameters.info === "string") {
                    oBags.tileProperties.texts.display_info_text = oParameters.info;
                }

                // configuration needs to be complete because it gets replaced completely
                var oNewTileConfiguration = {
                    display_icon_url: typeof oParameters.icon === "string" ? oParameters.icon : oTileConfiguration.display_icon_url,
                    display_info_text: typeof oParameters.info === "string" ? oParameters.info : oTileConfiguration.display_info_text,
                    display_subtitle_text: typeof oParameters.subtitle === "string" ? oParameters.subtitle : oTileConfiguration.display_subtitle_text,
                    display_title_text: oParameters.title || oTileConfiguration.display_title_text,
                    display_number_unit: typeof oParameters.numberUnit === "string" ? oParameters.numberUnit : oTileConfiguration.display_number_unit,
                    service_refresh_interval: oParameters.serviceRefreshInterval || oTileConfiguration.service_refresh_interval,
                    service_url: oParameters.serviceUrl || oTileConfiguration.service_url
                };

                var oConfiguration = {};

                this._getTileTargetConfiguration(oParameters.url || oTileConfiguration.navigation_target_url)
                    .then(function (oNavigationConfiguration) {
                        // merge navigation properties on top of the provided configuration
                        oNewTileConfiguration = deepExtend({}, oNewTileConfiguration, oNavigationConfiguration);
                        oConfiguration.tileConfiguration = JSON.stringify(oNewTileConfiguration);
                    })
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            oChipInstance.updateConfiguration(oConfiguration, resolve, reject);
                        });
                    })
                    .then(function () {
                        oChipInstance.getContract("configuration").fireConfigurationUpdated(Object.keys(oConfiguration));
                        return this._updateBags(oChipInstance, oBags);
                    }.bind(this))
                    .then(function (aUpdatedBags) {
                        if (aUpdatedBags.length) {
                            oChipInstance.getContract("bag").fireBagsUpdated(aUpdatedBags);
                        }
                        oDeferred.resolve();
                    })
                    .catch(function (oError) {
                        oDeferred.reject(oError.toString());
                    });

                return oDeferred.promise();
            }.bind(this));
        };

        /**
         * Updates <b>all</b> custom bookmarks matching exactly the identification data.
         * Only given properties are updated.
         * {@link #countCustomBookmarks} can be used to check upfront how many bookmarks are going to be affected.
         * The chipId of the bookmarks <b>cannot be changed!</b>
         *
         * @param {object} oIdentifier
         *   An object which is used to find the bookmarks by matching the provided properties.
         * @param {string} oIdentifier.url
         *   The URL which was used to create the bookmark using {@link #addCustomBookmark}.
         * @param {string} oIdentifier.chipId
         *   The chipId which was used to create the bookmark using {@link #addCustomBookmark}.
         *
         * @param {object} oBookmarkConfig
         *   The new bookmark configuration which is used to update the matched bookmarks.
         *   Only given properties are updated. See below for the structure.
         * <pre>
         *     {
         *         vizConfig: {
         *             "sap.flp": {
         *                 chipConfig: {
         *                     bags: {},
         *                     configuration: {}
         *                 }
         *             },
         *             "sap.platform.runtime": {
         *                 includeManifest: true
         *             }
         *         },
         *         url: "#Action-toBookmark?a=b",
         *         title: "My Title",
         *         icon: "sap-icon://world",
         *         subtitle: "My Subtitle",
         *         info: "My Info"
         *     }
         * </pre>
         *
         * @returns {Promise<int>} The count of bookmarks which were updated.
         *
         * @see #addCustomBookmark
         * @see #countCustomBookmarks
         * @since 1.83.0
         * @deprecated As of version 1.120
         *
         * @private
         */
        this.updateCustomBookmarks = function (oIdentifier, oBookmarkConfig) {
            var oChipConfig = ObjectPath.get(["vizConfig", "sap.flp", "chipConfig"], oBookmarkConfig) || {};
            var oConfiguration = oChipConfig.configuration || {};
            var oBags = oChipConfig.bags || {};
            var sUrl = oBookmarkConfig.url;

            return this._visitCustomBookmarks(oIdentifier, function (oChipInstance) {
                return this._getTileTargetConfiguration(sUrl)
                    .then(function (oNavigationConfiguration) {
                        var oTileConfiguration;
                        // merge navigation properties on top of the provided configuration
                        if (!oConfiguration.tileConfiguration) {
                            // no tileConfiguration was provided, therefore lookup the old one
                            oTileConfiguration = getAppLauncherTileConfiguration(oChipInstance);
                            oTileConfiguration = deepExtend({}, oTileConfiguration, oNavigationConfiguration);
                            oConfiguration.tileConfiguration = JSON.stringify(oTileConfiguration);
                        } else {
                            oTileConfiguration = JSON.parse(oConfiguration.tileConfiguration);
                            oTileConfiguration = deepExtend({}, oTileConfiguration, oNavigationConfiguration);
                            oConfiguration.tileConfiguration = JSON.stringify(oTileConfiguration);
                        }

                        return new Promise(function (resolve, reject) {
                            // chip might throw an error because of missing writeConfiguration contract
                            try {
                                oChipInstance.updateConfiguration(oConfiguration, resolve, reject);
                            } catch (oError) {
                                reject(oError);
                            }
                        });
                    })
                    .then(function () {
                        oChipInstance.getContract("configuration").fireConfigurationUpdated(Object.keys(oConfiguration));
                        return this._checkBookmarkConfiguration(oChipInstance);
                    }.bind(this))
                    .then(function () {
                        return this._updateBags(oChipInstance, oBags);
                    }.bind(this))
                    .then(function (aUpdatedBags) {
                        if (aUpdatedBags.length) {
                            oChipInstance.getContract("bag").fireBagsUpdated(aUpdatedBags);
                        }
                        return new Promise(function (resolve, reject) {
                            if (oBookmarkConfig.title) {
                                oChipInstance.setTitle(oBookmarkConfig.title, true, resolve, reject);
                            } else {
                                resolve();
                            }
                        });
                    });
            }.bind(this));
        };

        /**
         * This method is called to notify that the given tile has been added to some remote catalog which is not specified further.
         *
         * @param {string} sTileId the ID of the tile that has been added to the catalog (as returned by that OData POST operation)
         * @private
         * @since 1.16.4
         * @deprecated As of version 1.120
         */
        this.onCatalogTileAdded = function (/*sTileId*/) {
            bCatalogsValid = false;
        };

        /**
         * Returns whether a tile is a custom tile
         *
         * @param {sap.ui2.ChipInstance} tile The tile
         * @returns {boolean} True if it is a custom tile, false if it is a static or dynamic tile
         * @private
         * @since 1.69
         */
        this.isCustomTile = function (tile) {
            return !isAppLauncher(tile);
        };
    };

    /**
     * Returns raw catalog tile data that can be used to instantiate the tile
     *
     * @returns {Promise<object>} The catalog tile index
     *
     * @since 1.78.0
     * @private
     */
    LaunchPageAdapter.prototype._getCatalogTileIndex = function () {
        this._oCatalogTileIndexPromise = Container.getServiceAsync("PageBuilding")
            .then(function (oPageBuildingService) {
                var oUI2PageBuildingService = oPageBuildingService.getFactory().getPageBuildingService();
                return new Promise(function (resolve, reject) {
                    // There is no good way to access the raw data as it is normalized and well hidden in closures in sap.ushell_abap.pbServices.ui2
                    // Therefore we trigger the allCatalogs request again which reads from the cache of the OData wrapper
                    oUI2PageBuildingService.readAllCatalogs(PAGE_ID_WITHOUT_TM, resolve, reject,
                        "type eq 'CATALOG_PAGE' or type eq 'H' or type eq 'SM_CATALOG' or type eq 'REMOTE'", "title", true);
                });
            })
            .then(function (oResponse) {
                // create an index of catalog tile raw data
                var oCatalogTileIndex = {};

                oResponse.results.forEach(function (oCatalog) {
                    oCatalog.Chips.results.forEach(function (oChip) {
                        var sChipId;

                        if (oChip.referenceChipId) {
                            sChipId = oChip.referenceChipId;
                        } else {
                            sChipId = oChip.id;
                        }

                        if (!oCatalogTileIndex[sChipId]) {
                            oCatalogTileIndex[sChipId] = oChip;
                        }
                    });
                });

                return oCatalogTileIndex;
            })
            .catch(function () {
                // The PageBuilding service is only available on the ABAP platform. On CDM the tile index is not needed
                // If the service call fails the tile can still fall back to the basic data.
                return {};
            });

        return this._oCatalogTileIndexPromise;
    };

    return LaunchPageAdapter;
});

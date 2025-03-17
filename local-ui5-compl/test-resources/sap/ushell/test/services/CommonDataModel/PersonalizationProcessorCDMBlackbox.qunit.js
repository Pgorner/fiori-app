// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @deprecated since 1.120.0
 */

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/ushell/test/utils",
    "sap/ushell/services/CommonDataModel/PersonalizationProcessor",
    "sap/ushell/navigationMode",
    "sap/ushell/adapters/cdm/v3/LaunchPageAdapter",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    Log,
    deepExtend,
    testUtils,
    PersonalizationProcessor,
    navigationMode,
    LaunchPageAdapter,
    jQuery,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    var S_TEST_SITE_NAME_DEFAULT = sap.ui.require.toUrl("sap/ushell/cdmSiteData/3.0/CDMData4BlackboxTests.json");
    var S_TEST_SITE_NAME_HCP = sap.ui.require.toUrl("sap/ushell/cdmSiteData/3.0/sampleHCPSitejson.json");

    // with the default max depth (5) deepEquals do not show diffs in addedGroup deltas as it is too deep
    QUnit.dump.maxDepth = 10;

    /**
     * Stubs the CommonDataModel and the ClientSideTargetResolution services
     *
     * @param {object} oSite The site Object to be returned by the getSite method
     */
    function stubUsedServices (oSite) {
        var oCommonDataModelService = {
            getSite: function () {
                var oGetSiteDeferred = new jQuery.Deferred();

                oGetSiteDeferred.resolve(oSite);
                return oGetSiteDeferred.promise();
            },
            save: function () { // avoid making a real PersContainers network request
                var oDeferred = new jQuery.Deferred();

                oDeferred.resolve();
                return oDeferred.promise();
            }
        };

        var oClientSideTargetResolutionService = {
            resolveTileIntent: async function (sHash) {
                return "[Resolution Result of " + sHash + "]";
            },
            isInPlaceConfiguredFor: function () { }
        };

        sandbox.stub(navigationMode, "computeNavigationModeForHomepageTiles").returns("embedded");

        var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

        oGetServiceAsyncStub.callThrough();

        oGetServiceAsyncStub.withArgs("CommonDataModel").callsFake(function () {
            return Promise.resolve(oCommonDataModelService);
        });

        oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").callsFake(function () {
            return Promise.resolve(oClientSideTargetResolutionService);
        });
    }

    /**
     * Returns the tiles only from a given group (no links!).
     *
     * @param {object} oGroup The group to get the tiles from
     * @param {object} oLPAInstance The LaunchPageAdapter instance
     * @returns {array} An array of tiles without links
     */
    function getTilesWithoutLinks (oGroup, oLPAInstance) {
        var aTiles = oLPAInstance.getGroupTiles(oGroup);
        var iNumberOfLinks = oLPAInstance.getLinkTiles(oGroup).length;
        return aTiles.slice( // links are appended to aTiles
            0, aTiles.length - iNumberOfLinks
        );
    }

    /**
     * Finds the index of a site item with an identification section (e.g., catalog, group) in a given collection.
     *
     * @param {array} aCollection A collection of objects, each with an identification.id member or an id member at top-level.
     * @param {string} sSearchId The id of the item to search in the collection.
     * @returns {int} The index of the item in the collection array searched by id.
     *   The .id field at top-level is checked if an identification section is not available in the collection item.
     */
    function getIndexOfCollectionItem (aCollection, sSearchId) {
        var oItemFound;

        ["id", "title"].forEach(function (sSearchField) {
            if (oItemFound) {
                return;
            }

            oItemFound = aCollection.map(function (oItem, iIdx) {
                return {
                    idx: iIdx,
                    id: oItem.hasOwnProperty("identification") ? oItem.identification[sSearchField] : oItem[sSearchField]
                };
            }).filter(function (oItemInfo) {
                return oItemInfo.id === sSearchId;
            })[0];
        });

        if (!oItemFound) {
            throw new Error("No item with search id " + sSearchId + " was found in the collection");
        }

        return oItemFound.idx;
    }

    /**
     * Transforms a negative index into a positive index by interpreting the index as starting from the last item of an array.
     *
     * @param {string} iMaybeNegativeIndex A possibly negative index
     * @param {array} aCollection A collection of items.
     * @returns {int} The positive index that can be used to pick out the item from the array.
     */
    function getPositiveIndex (iMaybeNegativeIndex, aCollection) {
        if (iMaybeNegativeIndex >= 0) {
            return iMaybeNegativeIndex;
        }

        var iTileIndex = aCollection.length + iMaybeNegativeIndex;
        if (iTileIndex < 0) {
            throw new Error("wrong negative tile index");
        }
        return iTileIndex;
    }

    /**
     * Bundles the request logic for fetching test data
     *
     * @param {string} sPath File name of the test data file which should be requested
     * @returns {object} promise, the jQuery promise's done handler returns the parsed test data object.
     *   In case an error occurred, the promise's fail handler returns an error message.
     */
    function requestData (sPath) {
        var oDataRequestDeferred = new jQuery.Deferred();

        jQuery.ajax({
            type: "GET",
            dataType: "json",
            url: sPath
        }).done(function (oResponseData) {
            oDataRequestDeferred.resolve(oResponseData);
        }).fail(function (oError) {
            Log.error(oError.responseText);
            oDataRequestDeferred.reject("Data was requested but could not be loaded.");
        });

        return oDataRequestDeferred.promise();
    }

    // Personalization Actions
    var oExecuteActionFunctions = {
        appendGroup: function (oArgs) {
            var sTitle = oArgs.groupTitle;
            var oThisActionDeferred = new jQuery.Deferred();
            var that = this;

            that.oLPA.addGroup(sTitle)
                .done(function (/*oGroups*/) {
                    oThisActionDeferred.resolve();
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //addGroup failure handling

            return oThisActionDeferred.promise();
        },

        /**
         * Moves a group within the site object before or after a given existing group.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *     source: "My Source Group",   // or a numeric index
         *     beforeGroup: "My Target Group"  // the index of the group to move the source group before or
         *                                     // the name of the group to move the source group before
         *   }
         *   or
         *   {
         *     source: "My Source Group",   // or a numeric index
         *     afterGroup: "My Target Group"  // the index of the group to move the source group after or
         *                                    // the name of the group to move the source group after
         *   }
         *   </pre>
         *   Note: indices can also be negative to indicate elements from the end, for example:
         *     -1: last element, -2: element before the last element.
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        moveGroup: function (oArgs) {
            var oThisActionDeferred = new jQuery.Deferred();
            var iSourceIndex = oArgs.source;
            var iTargetIndex = oArgs.beforeGroup;
            var that = this;

            this.oLPA.getGroups()
                .done(function (aGroups) {
                    if (typeof oArgs.source === "string") {
                        iSourceIndex = getIndexOfCollectionItem(aGroups, oArgs.source);
                    }
                    iSourceIndex = getPositiveIndex(iSourceIndex, aGroups);

                    if (oArgs.beforeGroup && typeof oArgs.beforeGroup === "string") {
                        iTargetIndex = getIndexOfCollectionItem(aGroups, oArgs.beforeGroup);
                        if (iTargetIndex > iSourceIndex) {
                            iTargetIndex -= 1;
                        }
                    } else if (oArgs.afterGroup && typeof oArgs.afterGroup === "string") {
                        iTargetIndex = getIndexOfCollectionItem(aGroups, oArgs.afterGroup);
                        if (iTargetIndex < iSourceIndex) {
                            iTargetIndex += 1;
                        }
                    }
                    iTargetIndex = getPositiveIndex(iTargetIndex, aGroups);

                    var oGroup = aGroups[iSourceIndex];
                    that.oLPA.moveGroup(oGroup, iTargetIndex)
                        .done(function () {
                            oThisActionDeferred.resolve();
                        })
                        .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); // moveGroup failure handling
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); // getGroups failure handling

            return oThisActionDeferred.promise();
        },

        /**
         * Removes a group within the site object.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *      group: "My Source Group"   // or a numeric index
         *   }
         *   </pre>
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        removeGroup: function (oArgs) {
            var iTargetGroupIndex = oArgs.group;
            var oThisActionDeferred = new jQuery.Deferred();
            var that = this;

            this.oLPA.getGroups()
                .done(function (aGroups) {
                    if (typeof oArgs.group === "string") {
                        iTargetGroupIndex = getIndexOfCollectionItem(aGroups, oArgs.group);
                    }
                    var oGroup = aGroups[iTargetGroupIndex];
                    that.oLPA.removeGroup(oGroup)
                        .done(function (/*oOutput*/) {
                            oThisActionDeferred.resolve();
                        })
                        .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //removeGroup failure handling
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getGroups failure handling

            return oThisActionDeferred.promise();
        },

        /**
         * Hides a group from the site object.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *      group: "My Source Group"   // or a numeric index
         *   }
         *   If the group has a string value, the value can refer to a group id or title.
         *   Title is used to search for the group when no group with id equal to the given string can be found.
         *   </pre>
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        hideGroups: function (oArgs) {
            var aHideGroups = oArgs.groups;
            var oThisActionDeferred = new jQuery.Deferred();
            var that = this;

            that.oLPA.getGroups()
                .done(function (aGroups) {
                    var aSetGroupsHidden = [];
                    aHideGroups.forEach(function (sGroupTitle) {
                        aGroups.forEach(function (oGroup) {
                            if (sGroupTitle === oGroup.identification.title) {
                                aSetGroupsHidden.push(oGroup.identification.id);
                            }
                        });
                    });
                    that.oLPA.hideGroups(aSetGroupsHidden)
                        .done(function (oOutput) {
                            oThisActionDeferred.resolve();
                        })
                        .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //hideGroups failure handling
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getGroups failure handling

            return oThisActionDeferred.promise();
        },

        /**
         * Shows a given hidden group from the site object.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *      group: "My Source Group"   // or a numeric index
         *   }
         *   </pre>
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        showGroup: function (oArgs) {
            var iTargetGroupIndex = oArgs.group;
            var oThisActionDeferred = new jQuery.Deferred();
            var that = this;

            that.oLPA.getGroups()
                .done(function (aGroups) {
                    var sTargetGroupId;
                    if (typeof oArgs.group === "string") {
                        iTargetGroupIndex = getIndexOfCollectionItem(aGroups, oArgs.group);
                    }
                    sTargetGroupId = aGroups[iTargetGroupIndex].identification.id;

                    var aHiddenGroupsMinusTarget = aGroups.filter(function (oGroup) {
                        return oGroup.identification.isVisible === false
                            && oGroup.identification.id !== sTargetGroupId;
                    });
                    var aHiddenGroupsMinusTargetIds = aHiddenGroupsMinusTarget.map(function (value) {
                        return value.identification.id;
                    });
                    that.oLPA.hideGroups(aHiddenGroupsMinusTargetIds)
                        .done(function (/*oOutput*/) {
                            oThisActionDeferred.resolve();
                        })
                        .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //hideGroups failure handling
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getGroups failure handling

            return oThisActionDeferred.promise();
        },

        /**
         * Adds a tile coming from the given catalog to the given group.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *     sourceCatalog: "catalog_id",   // or a numeric index
         *     tile: "tile_id",         // or a numeric index
         *     targetGroup: "group_id"  // or a numeric index
         *   }
         *   </pre>
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        addTile: function (oArgs) {
            var oThisActionDeferred = new jQuery.Deferred();
            var iSourceCatalogIndex = oArgs.sourceCatalog;
            var iSourceTileIndex = oArgs.tile;
            var iTargetGroupIndex = oArgs.targetGroup;
            var that = this;

            this.oLPA.getCatalogs().done(function (aCatalogs) {
                if (typeof oArgs.sourceCatalog === "string") {
                    iSourceCatalogIndex = getIndexOfCollectionItem(aCatalogs, oArgs.sourceCatalog);
                }

                that.oLPA.getCatalogTiles(aCatalogs[iSourceCatalogIndex])
                    .done(function (aCatalogTiles) {
                        if (typeof oArgs.tile === "string") {
                            iSourceTileIndex = getIndexOfCollectionItem(aCatalogTiles, oArgs.tile);
                        }
                        var oCatalogTile = aCatalogTiles[iSourceTileIndex];
                        that.oLPA.getGroups()
                            .done(function (aGroups) {
                                if (typeof oArgs.targetGroup === "string") {
                                    iTargetGroupIndex = getIndexOfCollectionItem(aGroups, oArgs.targetGroup);
                                }
                                var oGroup = aGroups[iTargetGroupIndex];
                                that.oLPA.addTile(oCatalogTile, oGroup)
                                    .done(function (/*oOutput*/) {
                                        oThisActionDeferred.resolve();
                                    })
                                    .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //addTile failure handling
                            }).fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getGroups failure handling
                    }).fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getCatalogTiles failure handling
            }).fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getCatalogs failure handling

            return oThisActionDeferred.promise();
        },

        /**
         * Renames a group.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *     group: "group_id",   // or a numeric index e.g., -1
         *     title: "New Group title"
         *   }
         *   </pre>
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        renameGroup: function (oArgs) {
            var sNewGroupTitle = oArgs.title;
            var iGroupIndex = oArgs.group;
            var oThisActionDeferred = new jQuery.Deferred();
            var that = this;

            this.oLPA.getGroups()
                .done(function (aGroups) {
                    var oGroup;

                    if (typeof oArgs.group === "string") {
                        iGroupIndex = getIndexOfCollectionItem(aGroups, oArgs.group);
                    }
                    iGroupIndex = getPositiveIndex(iGroupIndex, aGroups);
                    oGroup = aGroups[iGroupIndex];

                    that.oLPA.setGroupTitle(oGroup, sNewGroupTitle)
                        .done(function (/*oOutput*/) {
                            oThisActionDeferred.resolve();
                        })
                        .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //setGroupTitle failure handling
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getGroups failure handling
            return oThisActionDeferred.promise();
        },

        /**
         * Removes a tile from a group.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *     group: "group_id",   // or a numeric index
         *     tile: "Tile to be removed"  // or a numeric index
         *   }
         *   </pre>
         *   NOTE: negative numeric indices are also ok
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        removeTile: function (oArgs) {
            var iTileIndex = oArgs.tile;
            var iGroupIndex = oArgs.group;
            var oThisActionDeferred = new jQuery.Deferred();
            var that = this;

            this.oLPA.getGroups()
                .done(function (aGroups) {
                    if (typeof oArgs.group === "string") {
                        iGroupIndex = getIndexOfCollectionItem(aGroups, oArgs.group);
                    }
                    iGroupIndex = getPositiveIndex(iGroupIndex, aGroups);

                    var oGroup = aGroups[iGroupIndex];
                    var aTilesNoLinks = getTilesWithoutLinks(oGroup, that.oLPA);

                    if (typeof oArgs.tile === "string") {
                        iTileIndex = getIndexOfCollectionItem(aTilesNoLinks, oArgs.tile);
                    }
                    iTileIndex = getPositiveIndex(iTileIndex, aTilesNoLinks);
                    var oTile = aTilesNoLinks[iTileIndex];

                    that.oLPA.removeTile(oGroup, oTile)
                        .done(function (/*oOutput*/) {
                            oThisActionDeferred.resolve();
                        })
                        .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //removeTile failure handling
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getGroups failure handling
            return oThisActionDeferred.promise();
        },

        /**
         * Moves a tile from a group to another.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *     sourceGroup: "group_id",  // or a numeric index
         *     sourceTile: "tile_title", // or a numeric index
         *     targetGroup: "group_id",  // or a numeric index
         *     beforeTile: "tile_id"  // the index of the tile to move the source tile before or
         *                            // the id of the tile to move the source tile before
         *   }
         *   </pre>
         *   Note: negative indices are also ok. They denote indices starting from the end of the array.
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        moveTile: function (oArgs) {
            var iSourceGroupIndex = oArgs.sourceGroup;
            var iSourceTileIndex = oArgs.sourceTile;
            var iTargetGroupIndex = oArgs.targetGroup;
            var iTargetTileIndex = oArgs.beforeTile;
            var oThisActionDeferred = new jQuery.Deferred();
            var that = this;

            this.oLPA.getGroups()
                .done(function (aGroups) {
                    if (typeof oArgs.sourceGroup === "string") {
                        iSourceGroupIndex = getIndexOfCollectionItem(aGroups, oArgs.sourceGroup);
                    }
                    iSourceGroupIndex = getPositiveIndex(iSourceGroupIndex, aGroups);
                    if (typeof oArgs.targetGroup === "string") {
                        iTargetGroupIndex = getIndexOfCollectionItem(aGroups, oArgs.targetGroup);
                    }
                    iTargetGroupIndex = getPositiveIndex(iTargetGroupIndex, aGroups);

                    var oSourceGroup = aGroups[iSourceGroupIndex];
                    var oTargetGroup = aGroups[iTargetGroupIndex];
                    var aTiles = getTilesWithoutLinks(oSourceGroup, that.oLPA);

                    if (oArgs.beforeTile && typeof oArgs.beforeTile === "string") {
                        iTargetTileIndex = getIndexOfCollectionItem(aTiles, oArgs.beforeTile);
                    } else if (oArgs.afterTile && typeof oArgs.afterTile === "string") {
                        iTargetTileIndex = getIndexOfCollectionItem(aGroups, oArgs.afterTile) + 1;
                    } else if (oArgs.afterTile /* number */) {
                        iTargetTileIndex = oArgs.afterTile + 1;
                    }
                    iTargetTileIndex = getPositiveIndex(iTargetTileIndex, aTiles);

                    if (typeof oArgs.sourceTile === "string") {
                        iSourceTileIndex = getIndexOfCollectionItem(aTiles, oArgs.sourceTile);
                    }
                    iSourceTileIndex = getPositiveIndex(iSourceTileIndex, aTiles);

                    var oTile = aTiles[iSourceTileIndex];

                    that.oLPA.moveTile(oTile, iSourceTileIndex, iTargetTileIndex, oSourceGroup, oTargetGroup)
                        .done(function (/*oOutput*/) {
                            oThisActionDeferred.resolve();
                        })
                        .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //moveTile failure handling
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); //getGroups failure handling
            return oThisActionDeferred.promise();
        },

        /**
         * Changes the properties of a tile in a given catalog.
         *
         * @param {object} oArgs An object like:
         *   <pre>
         *   {
         *     group: "group_id",   // or a numeric index
         *     tile: "Tile to be removed"  // or a numeric index
         *   }
         *   </pre>
         *   NOTE: negative numeric indices are also ok
         * @returns {jQuery.Deferred.promise} A promise that resolves when the operation is completed or rejects with undefined otherwise.
         */
        changeTileProperties: function (oArgs) {
            var iTileIndex = oArgs.tile;
            var iGroupIndex = oArgs.group;
            var oThisActionDeferred = new jQuery.Deferred();
            var sNewTitle = oArgs.properties.title;
            var sNewSubTitle = oArgs.properties.subtitle;
            var sNewInfo = oArgs.properties.info;
            var that = this;

            this.oLPA.getGroups()
                .done(function (aGroups) {
                    if (typeof oArgs.group === "string") {
                        iGroupIndex = getIndexOfCollectionItem(aGroups, oArgs.group);
                    }
                    iGroupIndex = getPositiveIndex(iGroupIndex, aGroups);

                    var oGroup = aGroups[iGroupIndex];
                    var aTilesNoLinks = getTilesWithoutLinks(oGroup, that.oLPA);

                    if (typeof oArgs.tile === "string") {
                        iTileIndex = getIndexOfCollectionItem(aTilesNoLinks, oArgs.tile);
                    }
                    iTileIndex = getPositiveIndex(iTileIndex, aTilesNoLinks);
                    var oTile = aTilesNoLinks[iTileIndex];
                    var oFakeSettingsView = {
                        oTitleInput: {
                            getValue: function () { return sNewTitle; }
                        },
                        oSubTitleInput: {
                            getValue: function () { return sNewSubTitle; }
                        },
                        oInfoInput: {
                            getValue: function () { return sNewInfo; }
                        }
                    };

                    // must add the tileComponent field before proceeding, because the test doesn't set it
                    that.oLPA._mResolvedTiles[oTile.id].tileComponent = {
                        tileSetVisualProperties: function () { }
                    };

                    that.oLPA._onTileSettingsSave(oTile, oFakeSettingsView)
                        .done(function () {
                            oThisActionDeferred.resolve();
                        })
                        .fail(oThisActionDeferred.reject.bind(oThisActionDeferred));
                })
                .fail(oThisActionDeferred.reject.bind(oThisActionDeferred)); // getCatalogs failure handling
            return oThisActionDeferred.promise();
        }
    };

    QUnit.module("sap.ushell.services.CommonDataModel.PersonalizationProcessor", {
        beforeEach: function () {
            this.oPersonalizedSite = {}; // This is the truth for the LPA

            window["sap-ushell-config"] = {
                services: {
                    CommonDataModel: {
                        module: "sap.ushell.services.CommonDataModel",
                        adapter: {
                            module: "sap.ushell.adapters.cdm.CommonDataModelAdapter",
                            config: {
                                ignoreSiteDataPersonalization: true,
                                cdmSiteUrl: sap.ui.require.toUrl("sap/ushell/cdmSiteData/CDMData4BlackboxTests.json")
                                // will be replaced in the tests
                            }
                        }
                    },
                    ClientSideTargetResolution: { adapter: { module: "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter" } },
                    Container: { adapter: { config: { language: "EN" } } },
                    LaunchPage: { adapter: { module: "sap.ushell.adapters.cdm.v3.FlpLaunchPageAdapter" } }
                }
            };
            return Container.init("local");
        },
        afterEach: function () {
            delete this.oLPA;
            sandbox.restore();
        }
    });

    function hasDefaultGroup (oSite) {
        return Object.keys(oSite.groups).map(function (sGroupId) {
            return oSite.groups[sGroupId];
        }).some(function (oGroup) {
            return oGroup.payload.isDefaultGroup === true;
        });
    }

    function deleteDefaultAttributesFromSite (oSite) {
        Object.keys(oSite.groups).forEach(function (sGroupId) {
            var oGroup = oSite.groups[sGroupId];
            delete oGroup.payload.isPreset;
        });
    }

    function deleteDefaultAttributesFromPostActionSite (oOriginalSite, oPersonalizedSite) {
        var bOriginalSiteWithDefaultGroup = hasDefaultGroup(oOriginalSite);

        Object.keys(oPersonalizedSite.groups).forEach(function (sGroupId) {
            var oGroup = oPersonalizedSite.groups[sGroupId];

            if (oGroup
                && !bOriginalSiteWithDefaultGroup
                && oGroup.payload.isDefaultGroup
                && oGroup.payload.tiles.length === 0
                && oGroup.payload.links.length === 0) {
                delete oPersonalizedSite.groups[sGroupId];

                oPersonalizedSite.site.payload.groupsOrder =
                    oPersonalizedSite.site.payload.groupsOrder.filter(function (sPersonalizedGroupId) {
                        return sGroupId !== sPersonalizedGroupId;
                    });
            }
        });

        // cleanup catalogs from get* function side effects
        Object.keys(oPersonalizedSite.catalogs).forEach(function (sCatalogId) {
            delete oPersonalizedSite.catalogs[sCatalogId].id;
        });
    }

    // Fixture defaults
    var oFixtureDefaults = {
        sOriginalSiteFileName: S_TEST_SITE_NAME_DEFAULT,
        expectedActionSequenceChangesTheSite: true
    };
    // default options for ACTIONS
    var oFixtureActionDefaults = { expectedSiteChange: true };

    // Tests with S_TEST_SITE_NAME_DEFAULT
    [{
        testDescription: "Append group - move group",
        aActionSequence: [
            { appendGroup: { groupTitle: "MyNewGroup" } }, // will be the last group
            { moveGroup: { source: "MyNewGroup", beforeGroup: 2 } }
        ]
    }, {
        testDescription: "Append group - add tile to group - append another group - move other group in front of existing group - move tile to other group",
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { addTile: { sourceCatalog: 3, tile: 1, targetGroup: "Group1" } },
            { appendGroup: { groupTitle: "Group2" } },
            { moveGroup: { source: "Group2", beforeGroup: "Group1" /* will be moved before group 1 */ } },
            { moveTile: { sourceGroup: "Group1", sourceTile: 0, targetGroup: "Group2", beforeTile: 0 } }
        ],
        expectedDelta:
        {
            _version: "3.0.0",
            movedTiles: {
                "id-1484915114454-3": {
                    fromGroup: null,
                    toGroup: "id-1484915114474-4",
                    item: {
                        id: "id-1484915114454-3",
                        vizId: "sap.ushell.demo.LauncherValue"
                    }
                }
            },
            addedGroups: {
                "id-1484915114434-2": {
                    identification: {
                        id: "id-1484915114434-2",
                        namespace: "",
                        title: "Group1"
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                },
                "id-1484915114474-4": {
                    identification: {
                        id: "id-1484915114474-4",
                        namespace: "",
                        title: "Group2"
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                }
            },
            groupOrder: [
                "ONE",
                "SAP_UI2_TEST",
                "/UI2/FLP_DEMO_WDA_GUI",
                "group1",
                "BOOKMARKS",
                "EXTERNAL_URLS",
                "ZTEST",
                "LOCKED",
                "HiddenGroup",
                "id-1484915114474-4",
                "id-1484915114434-2"],
            groups: { "id-1484915114474-4": { payload: { tileOrder: ["id-1484915114454-3"] } } }
        }
    }, {
        testDescription: "Append group - add tile to group - append another group - move first group below existing group - move tile to other group",
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { addTile: { sourceCatalog: 3, tile: 1, targetGroup: "Group1" } },
            { appendGroup: { groupTitle: "Group2" } },
            { moveGroup: { source: "Group1", afterGroup: "Group2" } },
            { moveTile: { sourceGroup: "Group1", sourceTile: 0, targetGroup: "Group2", beforeTile: 0 } }
        ],
        expectedDelta: {
            _version: "3.0.0",
            movedTiles: {
                "id-1485157034708-7": {
                    fromGroup: null,
                    toGroup: "id-1485157034722-8",
                    item: {
                        id: "id-1485157034708-7",
                        vizId: "sap.ushell.demo.LauncherValue"
                    }
                }
            },
            addedGroups: {
                "id-1485157034691-6": {
                    identification: {
                        id: "id-1485157034691-6",
                        namespace: "",
                        title: "Group1"
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                },
                "id-1485157034722-8": {
                    identification: {
                        id: "id-1485157034722-8",
                        namespace: "",
                        title: "Group2"
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                }
            },
            groupOrder: [
                "ONE",
                "SAP_UI2_TEST",
                "/UI2/FLP_DEMO_WDA_GUI",
                "group1",
                "BOOKMARKS",
                "EXTERNAL_URLS",
                "ZTEST",
                "LOCKED",
                "HiddenGroup",
                "id-1485157034722-8",
                "id-1485157034691-6"
            ],
            groups: { "id-1485157034722-8": { payload: { tileOrder: ["id-1485157034708-7"] } } }
        }
    }, {
        testDescription: "move first group into middle of groups (afterGroup)",
        aActionSequence: [
            { moveGroup: { source: "Group number one", afterGroup: "Substituted group title" } }
        ],
        expectedDelta: {
            _version: "3.0.0",
            groupOrder: [
                "SAP_UI2_TEST",
                "/UI2/FLP_DEMO_WDA_GUI",
                "group1",
                "BOOKMARKS",
                "EXTERNAL_URLS",
                "ZTEST",
                "ONE",
                "LOCKED",
                "HiddenGroup"
            ]
        }
    }, {
        testDescription: "move first group into middle of groups (beforeGroup)",
        aActionSequence: [{ moveGroup: { source: "Group number one", beforeGroup: "Substituted group title" } }],
        expectedDelta: {
            _version: "3.0.0",
            groupOrder: [
                "SAP_UI2_TEST",
                "/UI2/FLP_DEMO_WDA_GUI",
                "group1",
                "BOOKMARKS",
                "EXTERNAL_URLS",
                "ONE",
                "ZTEST",
                "LOCKED",
                "HiddenGroup"
            ]
        }
    }, {
        testDescription: "Append group - append another group - remove both groups",
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { appendGroup: { groupTitle: "Group2" } },
            { removeGroup: { group: "Group1" } },
            { removeGroup: { group: "Group2" } }
        ],
        expectedActionSequenceChangesTheSite: false // site not modified after actions
    }, {
        testDescription: "Append group - append another group - rename first group - rename second group - remove both groups",
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { appendGroup: { groupTitle: "Group2" } },
            { renameGroup: { group: "Group1", title: "RenamedGroup1" } },
            { renameGroup: { group: "Group2", title: "RenamedGroup2" } },
            { removeGroup: { group: "RenamedGroup1" } },
            { removeGroup: { group: "RenamedGroup2" } }
        ],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Append group - hide group",
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } }, // new group is added as the last group
            { hideGroups: { groups: ["Hidden Group", "Group1"] } } // hide the last group and group2
        ],
        expectedDelta: {
            _version: "3.0.0",
            addedGroups: {
                "id-1485168471721-2": {
                    identification: {
                        id: "id-1485168471721-2",
                        namespace: "",
                        title: "Group1",
                        isVisible: false
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                }
            },
            groupOrder: [
                "ONE",
                "SAP_UI2_TEST",
                "/UI2/FLP_DEMO_WDA_GUI",
                "group1",
                "BOOKMARKS",
                "EXTERNAL_URLS",
                "ZTEST",
                "LOCKED",
                "HiddenGroup",
                "id-1485168471721-2"
            ]
        }
    }, {
        testDescription: "Add tile - remove tile",
        expectedActionSequenceChangesTheSite: false, // TODO why is the site not saved correctly while it is done in the next test?
        aActionSequence: [
            { addTile: { sourceCatalog: 2, tile: 1, targetGroup: 2 } },
            { removeTile: { group: 2, tile: -1 /* the last tile */ } }
        ]
    }, {
        testDescription: "Add tile - rename tile - remove tile",
        aActionSequence: [
            { addTile: { sourceCatalog: 2, tile: 1, targetGroup: 2 } },
            { changeTileProperties: { group: 2, tile: -1, properties: { title: "Title Renamed", subtitle: "Subtitle Renamed" } } },
            { removeTile: { group: 2, tile: -1 } }
        ],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Add tile - add tile - rename tile - remove tile",
        aActionSequence: [
            { addTile: { sourceCatalog: 3, tile: 1, targetGroup: 2 } },
            { addTile: { sourceCatalog: 2, tile: 1, targetGroup: 2 } },
            { changeTileProperties: { group: 2, tile: -1, properties: { title: "Title Renamed", subtitle: "Subtitle Renamed" } } },
            { removeTile: { group: 2, tile: -1 } }
        ],
        expectedDelta: {
            _version: "3.0.0",
            movedTiles: {
                "id-1485174907211-2": {
                    fromGroup: null,
                    toGroup: "SAP_UI2_TEST",
                    item: {
                        id: "id-1485174907211-2",
                        vizId: "sap.ushell.demo.LauncherValue"
                    }
                }
            },
            groups: {
                SAP_UI2_TEST: {
                    payload: {
                        tileOrder: [
                            "00O2TR803AME62FR3GM7E",
                            "00OESFM7P",
                            "00OESFM7XP",
                            "00O2TR8035SI4EAR3GM7P",
                            "00O2TR8035SJUP6AW43TU86L0",
                            "00O2TR8035SJUP6AW43TAFL0",
                            "00O2TR8035SJUP6AW43TUPRL0",
                            "id-1485174907211-2"
                        ]
                    }
                }
            }
        }
    }, {
        testDescription: "Add tile - add tile - rename tile - rename tile",
        aActionSequence: [
            { addTile: { sourceCatalog: 3, tile: 1, targetGroup: 2 } },
            { addTile: { sourceCatalog: 2, tile: 1, targetGroup: 2 } },
            { changeTileProperties: { group: 2, tile: -1, properties: { title: "Title Renamed", subtitle: "Subtitle Renamed" } } },
            { changeTileProperties: { group: 2, tile: 0, properties: { title: "Title Renamed", subtitle: "Subtitle Renamed" } } }
        ],
        expectedDelta: {
            _version: "3.0.0",
            movedTiles: {
                "id-1485174907211-2": {
                    fromGroup: null,
                    toGroup: "SAP_UI2_TEST",
                    item: {
                        id: "id-1485174907211-2",
                        vizId: "sap.ushell.demo.LauncherValue"
                    }
                },
                "id-1485174907211-3": {
                    fromGroup: null,
                    toGroup: "SAP_UI2_TEST",
                    item: {
                        id: "id-1485174907211-2",
                        title: "Title Renamed",
                        subTitle: "Subtitle Renamed",
                        vizId: "AppStateSampleIcon"
                    }
                }
            },
            groups: {
                SAP_UI2_TEST: {
                    payload: {
                        tileOrder: [
                            "00O2TR803AME62FR3GM7E",
                            "00OESFM7P",
                            "00OESFM7XP",
                            "00O2TR8035SI4EAR3GM7P",
                            "00O2TR8035SJUP6AW43TU86L0",
                            "00O2TR8035SJUP6AW43TAFL0",
                            "00O2TR8035SJUP6AW43TUPRL0",
                            "id-1485174907211-2",
                            "id-1485174907211-3"
                        ]
                    }
                }
            },
            modifiedTiles: {
                "00O2TR803AME62FR3GM7E": {
                    id: "00O2TR803AME62FR3GM7E",
                    title: "Title Renamed",
                    subTitle: "Subtitle Renamed"
                }
            }
        }
    }, {
        testDescription: "Move existing non-home group - rename moved group - delete renamed group",
        aActionSequence: [
            { moveGroup: { source: 1, beforeGroup: -1 } },
            { renameGroup: { group: -2, title: "Renamed New Group" } },
            { removeGroup: { group: "Renamed New Group" } }
        ],
        expectedDelta: {
            _version: "3.0.0",
            removedGroups: ["HiddenGroup"],
            groupOrder: [
                "SAP_UI2_TEST",
                "/UI2/FLP_DEMO_WDA_GUI",
                "group1",
                "BOOKMARKS",
                "EXTERNAL_URLS",
                "ZTEST",
                "LOCKED",
                "ONE"
            ]
        }
    }, {
        testDescription: "Move home group",
        aActionSequence: [{
            moveGroup: { source: 0 /* home group */, beforeGroup: -1 },
            expectedSiteChange: false /* because of home group */
        }],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Add group - add tile - hide group - add another group - add tile to second group - " +
            "rename second group - show hidden group - move second group before first group - delete group 1 - delete group 2",
        aActionSequence: [
            { appendGroup: { groupTitle: "New Group 1" } },
            { addTile: { sourceCatalog: 0, tile: 1, targetGroup: "New Group 1" } },
            { hideGroups: { groups: ["New Group 1", "Hidden Group"] } },
            { appendGroup: { groupTitle: "New Group 2" } },
            { addTile: { sourceCatalog: 0, tile: 0, targetGroup: "New Group 2" } },
            { renameGroup: { group: "New Group 2", title: "New Group 2 - renamed" } },
            { showGroup: { group: "New Group 1" } },
            { moveGroup: { source: "New Group 2 - renamed", beforeGroup: "New Group 1" } },
            { removeGroup: { group: "New Group 1" } },
            { removeGroup: { group: "New Group 2 - renamed" } }
        ],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Move tiles within a group",
        aActionSequence: [
            { moveTile: { sourceGroup: "EXTERNAL_URLS", sourceTile: -1, targetGroup: "EXTERNAL_URLS", beforeTile: 0 } },
            { moveTile: { sourceGroup: "EXTERNAL_URLS", sourceTile: -1, targetGroup: "EXTERNAL_URLS", afterTile: 0 } }
        ]
    }, {
        testDescription: "Move all tiles into another group",
        aActionSequence: [
            { moveTile: { sourceGroup: "EXTERNAL_URLS", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } },
            { moveTile: { sourceGroup: "EXTERNAL_URLS", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } },
            { moveTile: { sourceGroup: "EXTERNAL_URLS", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } }
        ]
    }, {
        testDescription: "Move a tile across multiple groups",
        aActionSequence: [
            { moveTile: { sourceGroup: 1, sourceTile: 0, targetGroup: 2, beforeTile: 0 } },
            { moveTile: { sourceGroup: 2, sourceTile: 0, targetGroup: 3, beforeTile: 0 } },
            { moveTile: { sourceGroup: 3, sourceTile: 0, targetGroup: 4, beforeTile: 0 } }
        ]
    },
    // Tests with S_TEST_SITE_NAME_HCP
    {
        testDescription: "Append group - move group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { appendGroup: { groupTitle: "MyNewGroup" } }, // will be the last group
            { moveGroup: { source: "MyNewGroup", beforeGroup: 2 } }
        ]
    }, {
        testDescription: "Append group - add tile to group - append another group - move other group in front of existing group - move tile to other group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { addTile: { sourceCatalog: 0, tile: 0, targetGroup: "Group1" } },
            { appendGroup: { groupTitle: "Group2" } },
            { moveGroup: { source: "Group2", beforeGroup: "Group1" /* will be moved before group 1 */ } },
            { moveTile: { sourceGroup: "Group1", sourceTile: 0, targetGroup: "Group2", beforeTile: 0 } }
        ],
        expectedDelta: {
            _version: "3.0.0",
            movedTiles: {
                "id-1485158660428-11": {
                    fromGroup: null,
                    toGroup: "id-1485158660445-12",
                    item: {
                        id: "id-1485158660428-11",
                        vizId: "X-SAP-UI2-CATALOGPAGE:SAP_SFIN_BC_FACT_ACC_DOC:00O2TPKTQNBL2OKN7TAL0P266_COPY"
                    }
                }
            },
            addedGroups: {
                "id-1485158660384-10": {
                    identification: {
                        id: "id-1485158660384-10",
                        namespace: "",
                        title: "Group1"
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                },
                "id-1485158660445-12": {
                    identification: {
                        id: "id-1485158660445-12",
                        namespace: "",
                        title: "Group2"
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                }
            },
            groupOrder: [
                "35dd6341-fc28-4efb-8233-ffdb77e67b5e",
                "SAP_SFIN_BCG_AP_CUST_ACC",
                "SAP_SFIN_BCG_AR_DAILY",
                "SAP_SFIN_BCG_APAR_CORR",
                "SAP_SFIN_BCG_APAR_PAYMENTS",
                "SAP_SFIN_BCG_AP_CHECK",
                "SAP_SFIN_BCG_AR_CUST_ACC",
                "ZTEST",
                "SAP_SFIN_BCG_BANK_OPERATION",
                "SAP_SFIN_BCG_AP_CHECK_CN",
                "SAP_SFIN_BCG_AR_DISPUTES",
                "SAP_SFIN_BCG_AR_PAYM_ADV",
                "2d2e86a9-ca8f-434c-8d2e-d08ea99206ea-1474534098180",
                "f4f46514-2396-4f1c-9d4c-5b63306ffc6e",
                "1a35f0bf-e4cf-4f59-8153-d2e0862b7510-1477549862086",
                "id-1485158660445-12",
                "id-1485158660384-10"
            ],
            groups: { "id-1485158660445-12": { payload: { tileOrder: ["id-1485158660428-11"] } } }
        }
    }, {
        testDescription: "Append group - add tile to group - append another group - move first group below existing group - move tile to other group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { addTile: { sourceCatalog: 0, tile: 0, targetGroup: "Group1" } },
            { appendGroup: { groupTitle: "Group2" } },
            { moveGroup: { source: "Group1", afterGroup: "Group2" } },
            { moveTile: { sourceGroup: "Group1", sourceTile: 0, targetGroup: "Group2", beforeTile: 0 } }
        ],
        expectedDelta: {
            _version: "3.0.0",
            movedTiles: {
                "id-1485160273514-15": {
                    fromGroup: null,
                    toGroup: "id-1485160273527-16",
                    item: {
                        id: "id-1485160273514-15",
                        vizId: "X-SAP-UI2-CATALOGPAGE:SAP_SFIN_BC_FACT_ACC_DOC:00O2TPKTQNBL2OKN7TAL0P266_COPY"
                    }
                }
            },
            addedGroups: {
                "id-1485160273493-14": {
                    identification: {
                        id: "id-1485160273493-14",
                        namespace: "",
                        title: "Group1"
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                },
                "id-1485160273527-16": {
                    identification: {
                        id: "id-1485160273527-16",
                        namespace: "",
                        title: "Group2"
                    },
                    payload: {
                        locked: false,
                        tiles: [],
                        links: [],
                        groups: []
                    }
                }
            },
            groupOrder: [
                "35dd6341-fc28-4efb-8233-ffdb77e67b5e",
                "SAP_SFIN_BCG_AP_CUST_ACC",
                "SAP_SFIN_BCG_AR_DAILY",
                "SAP_SFIN_BCG_APAR_CORR",
                "SAP_SFIN_BCG_APAR_PAYMENTS",
                "SAP_SFIN_BCG_AP_CHECK",
                "SAP_SFIN_BCG_AR_CUST_ACC",
                "ZTEST",
                "SAP_SFIN_BCG_BANK_OPERATION",
                "SAP_SFIN_BCG_AP_CHECK_CN",
                "SAP_SFIN_BCG_AR_DISPUTES",
                "SAP_SFIN_BCG_AR_PAYM_ADV",
                "2d2e86a9-ca8f-434c-8d2e-d08ea99206ea-1474534098180",
                "f4f46514-2396-4f1c-9d4c-5b63306ffc6e",
                "1a35f0bf-e4cf-4f59-8153-d2e0862b7510-1477549862086",
                "id-1485160273527-16",
                "id-1485160273493-14"
            ],
            groups: { "id-1485160273527-16": { payload: { tileOrder: ["id-1485160273514-15"] } } }
        }
    }, {
        testDescription: "Append group - append another group - remove both groups",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { appendGroup: { groupTitle: "Group2" } },
            { removeGroup: { group: "Group1" } },
            { removeGroup: { group: "Group2" } }
        ],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Append group - append another group - rename first group - rename second group - remove both groups",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { appendGroup: { groupTitle: "Group2" } },
            { renameGroup: { group: "Group1", title: "RenamedGroup1" } },
            { renameGroup: { group: "Group2", title: "RenamedGroup2" } },
            { removeGroup: { group: "RenamedGroup1" } },
            { removeGroup: { group: "RenamedGroup2" } }
        ],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Append group - hide group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { appendGroup: { groupTitle: "Group1" } },
            { hideGroups: { groups: ["Group1"] } }
        ]
    }, {
        testDescription: "Add tile - remove tile",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        expectedActionSequenceChangesTheSite: false, // TODO why is the site not saved correctly while it is done in the next test?
        aActionSequence: [
            { addTile: { sourceCatalog: 0, tile: 1, targetGroup: 2 } },
            { removeTile: { group: 2, tile: -1 /* the last tile */ } }
        ]
    }, {
        testDescription: "Add tile - rename tile - remove tile",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { addTile: { sourceCatalog: 0, tile: 1, targetGroup: 2 } },
            { changeTileProperties: { group: 2, tile: -1, properties: { title: "Title Renamed", subtitle: "Subtitle Renamed" } } },
            { removeTile: { group: 2, tile: -1 } }
        ],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Move existing non-home group - rename moved group - delete renamed group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { moveGroup: { source: 1, beforeGroup: -1 } },
            { renameGroup: { group: -2, title: "Renamed New Group" } },
            { removeGroup: { group: "Renamed New Group" } }
        ]
    }, {
        testDescription: "Move home group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [{
            moveGroup: { source: 0 /* home group */, beforeGroup: -1 },
            expectedSiteChange: false /* because of home group */
        }],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Move existing group - rename moved group - delete renamed group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { moveGroup: { source: 1, beforeGroup: -1 } },
            { renameGroup: { group: -2, title: "Renamed New Group" } },
            { removeGroup: { group: "Renamed New Group" } }
        ]
    }, {
        testDescription: "Add group - add tile - hide group - add another group - add tile to second group - rename second group - " +
            "show hidden group - move second group before first group - delete group 1 - delete group 2",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { appendGroup: { groupTitle: "New Group 1" } },
            { addTile: { sourceCatalog: 0, tile: 0, targetGroup: "New Group 1" } },
            { hideGroups: { groups: ["New Group 1"] } },
            { appendGroup: { groupTitle: "New Group 2" } },
            { addTile: { sourceCatalog: 0, tile: 0, targetGroup: "New Group 2" } },
            { renameGroup: { group: "New Group 2", title: "New Group 2 - renamed" } },
            { showGroup: { group: "New Group 1" } },
            { moveGroup: { source: "New Group 2 - renamed", beforeGroup: "New Group 1" } },
            { removeGroup: { group: "New Group 1" } },
            { removeGroup: { group: "New Group 2 - renamed" } }
        ],
        expectedActionSequenceChangesTheSite: false
    }, {
        testDescription: "Move tiles within a group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: -1, targetGroup: "SAP_SFIN_BCG_AR_CUST_ACC", beforeTile: 0 } },
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: -1, targetGroup: "SAP_SFIN_BCG_AR_CUST_ACC", afterTile: 0 } }
        ]
    }, {
        testDescription: "Move all tiles into another group",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } },
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } },
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } },
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } },
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } },
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } },
            { moveTile: { sourceGroup: "SAP_SFIN_BCG_AR_CUST_ACC", sourceTile: 0, targetGroup: "ZTEST", beforeTile: 0 } }
        ]
    }, {
        testDescription: "Move a tile across multiple groups",
        sOriginalSiteFileName: S_TEST_SITE_NAME_HCP,
        aActionSequence: [
            { moveTile: { sourceGroup: 1, sourceTile: 0, targetGroup: 2, beforeTile: 0 } },
            { moveTile: { sourceGroup: 2, sourceTile: 0, targetGroup: 3, beforeTile: 0 } },
            { moveTile: { sourceGroup: 3, sourceTile: 0, targetGroup: 4, beforeTile: 0 } }
        ]
    }].forEach(function (oFixture) {
        // Apply defaults to current fixture
        Object.keys(oFixtureDefaults).forEach(function (sDefault) {
            if (!oFixture.hasOwnProperty(sDefault)) {
                oFixture[sDefault] = oFixtureDefaults[sDefault];
            }
        });
        oFixture.aActionSequence.forEach(function (oAction) {
            Object.keys(oFixtureActionDefaults).forEach(function (sActionDefault) {
                if (!oAction.hasOwnProperty(sActionDefault)) {
                    oAction[sActionDefault] = oFixtureActionDefaults[sActionDefault];
                }
            });
        });

        QUnit.test("CDM Black Box Test on '" + oFixture.sOriginalSiteFileName.split("/").pop() +
            "' returns the correct result when the Action Sequence is: " + oFixture.testDescription,
            function (assert) {
                var done = assert.async();
                var that = this;

                // Arrange
                var oPersonalizationProcessor = new PersonalizationProcessor();
                var oOriginalSiteDataPromise = requestData(oFixture.sOriginalSiteFileName);
                oOriginalSiteDataPromise.done(function (oOriginalSite) {
                    var oPreviousSite = deepExtend({}, oOriginalSite);

                    that.oPersonalizedSite = deepExtend({}, oOriginalSite);
                    stubUsedServices(that.oPersonalizedSite);

                    var fApplyActionsTiming;
                    var fTotalActionTime = 0;

                    that.oLPA = new LaunchPageAdapter(undefined, undefined, { config: {} });

                    Container.getServiceAsync("CommonDataModel").then(function (oCdm) {
                        oFixture.aActionSequence
                            // apply all the actions
                            .reduce(function (previousPromise, oCurrentAction) {
                                var oActionAppliedAndCheckedDeferred = new jQuery.Deferred();
                                previousPromise.then(function () {
                                    // setTimeout to reset getGroups promise
                                    window.setTimeout(function () {
                                        var aActionNames = Object.keys(oCurrentAction).filter(function (sActionNameOrParameter) {
                                            return !oFixtureActionDefaults[sActionNameOrParameter];
                                        });
                                        if (aActionNames.length > 1) {
                                            throw new Error("Fixture contains an invalid parameter. Should be one of: "
                                                + Object.keys(oFixtureActionDefaults).join(", "));
                                        }
                                        var sAction = aActionNames[0];
                                        var oActionParams = oCurrentAction[sAction];

                                        fApplyActionsTiming = window.performance.now();
                                        oExecuteActionFunctions[sAction].call(that, oActionParams).done(function () {
                                            fTotalActionTime += window.performance.now() - fApplyActionsTiming;

                                            // check if its really done
                                            oCdm.getSite().done(function (oSiteAfterAction) {
                                                deleteDefaultAttributesFromPostActionSite(oPreviousSite, oSiteAfterAction);
                                                var bSiteChanged = JSON.stringify(oPreviousSite) !== JSON.stringify(oSiteAfterAction);

                                                assert.ok((bSiteChanged && oCurrentAction.expectedSiteChange)
                                                    || (!bSiteChanged && !oCurrentAction.expectedSiteChange), "Action " + sAction + " was executed successfully");

                                                oPreviousSite = deepExtend({}, oSiteAfterAction);
                                                oActionAppliedAndCheckedDeferred.resolve();
                                            });
                                        });
                                    }, 50);
                                });
                                return oActionAppliedAndCheckedDeferred.promise();
                            }, jQuery.when(null))
                            .then(
                                function () {
                                    oCdm.getSite().done(function (oPersonalizedSite1 /* after actions applied */) {
                                        // Some attributes are added to the mixed in site and the personalized site after actions have occurred.
                                        // Therefore we must delete the same attributes from sites before comparing them.
                                        deleteDefaultAttributesFromPostActionSite(oOriginalSite, oPersonalizedSite1);
                                        deleteDefaultAttributesFromSite(oPersonalizedSite1);

                                        // preserve original site (it's used in the getSite stub)
                                        var oOriginalSiteCopy = deepExtend({}, oOriginalSite);
                                        deleteDefaultAttributesFromSite(oOriginalSiteCopy);

                                        if (oFixture.expectedActionSequenceChangesTheSite) {
                                            assert.notDeepEqual(oPersonalizedSite1, oOriginalSiteCopy, "original site was modified");
                                        } else {
                                            assert.deepEqual(oPersonalizedSite1, oOriginalSiteCopy, "original site was not modified");
                                        }

                                        var fExtractionTiming = window.performance.now();

                                        // Act
                                        oPersonalizationProcessor
                                            .extractPersonalization(oPersonalizedSite1, oOriginalSite)
                                            .done(function (oPersonalizationDelta) {
                                                fExtractionTiming = window.performance.now() - fExtractionTiming;
                                                var fMixinTiming = window.performance.now();
                                                var rId = /id-[0-9]+-[0-9]+/g;
                                                var nReplacementCount;
                                                var fMaskId = function () {
                                                    nReplacementCount = nReplacementCount || 0;
                                                    return "ID" + nReplacementCount++;
                                                };

                                                oPersonalizationProcessor
                                                    .mixinPersonalization(oOriginalSite, oPersonalizationDelta)
                                                    .done(function (oPersonalizedSite2) {
                                                        fMixinTiming = window.performance.now() - fMixinTiming;

                                                        deleteDefaultAttributesFromSite(oPersonalizedSite2);

                                                        // Assert
                                                        testUtils.prettyCdmSiteDeepEqual(assert, oPersonalizedSite2, oPersonalizedSite1,
                                                            "personalization was correctly extracted and mixed in");

                                                        assert.ok(true, [
                                                            oFixture.aActionSequence.length, "actions",
                                                            "applied in", fTotalActionTime.toFixed(4) + "ms",
                                                            "Extraction completed in", fExtractionTiming.toFixed(4) + "ms",
                                                            "Mixin completed in", fMixinTiming.toFixed(4) + "ms",
                                                            "on '", oOriginalSite.site.identification.description, "' site with",
                                                            Object.keys(oOriginalSite.groups).length, "groups",
                                                            Object.keys(oOriginalSite.catalogs).length, "catalogs",
                                                            Object.keys(oOriginalSite.applications).length, "applications"
                                                        ].join(" "));

                                                        // asserts that deltas are equal but identifiers are only checked with regexp
                                                        // identification is not known to fixture
                                                        if (oPersonalizationDelta && oFixture.expectedDelta) {
                                                            var oMaskedDelta = JSON.parse(JSON.stringify(oPersonalizationDelta).replace(rId, fMaskId));
                                                            nReplacementCount = 0;
                                                            var oMaskedFixDelta = JSON.parse(JSON.stringify(oFixture.expectedDelta).replace(rId, fMaskId));
                                                            assert.deepEqual(oMaskedDelta, oMaskedFixDelta,
                                                                "compare of Deltas with masked Ids , Delta of fixture and Delta of LPA ");
                                                        } else {
                                                            assert.ok(true, "no delta comparison executed");
                                                        }
                                                    }).fail(function () {
                                                        assert.ok(false, "should never happen");
                                                    }); // Mixin failure handling
                                            }).fail(function () {
                                                assert.ok(false, "should never happen");
                                            }); // Extract failure handling
                                    }).always(done);
                                },
                                function (oError) {
                                    assert.ok(false, "All actions were applied successfully. ERROR: " + oError);
                                    done();
                                }
                            );
                    });
                });
            });
    });
});

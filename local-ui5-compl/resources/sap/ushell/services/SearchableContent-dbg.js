// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview This module exposes the searchable content.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readPages",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/base/util/values",
    "sap/ushell/library",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/base/Log",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/utils"
], function (
    Config,
    Container,
    readApplications,
    readPages,
    readUtils,
    utilsCdm,
    objectValues,
    ushellLibrary,
    readVisualizations,
    Log,
    urlParsing,
    ushellUtils
) {
    "use strict";

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /**
     * @alias sap.ushell.services.SearchableContent
     * @class
     * @classdesc The Unified Shell's SearchableContent service.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const SearchableContent = await Container.getServiceAsync("SearchableContent");
     *     // do something with the SearchableContent service
     *   });
     * </pre>
     *
     * @hideconstructor
     *
     * @since 1.77.0
     * @private
     * @ui5-restricted sap.esh.search.ui
     */
    var SearchableContent = function () { };
    SearchableContent.COMPONENT_NAME = "sap/ushell/services/SearchableContent";

    /**
     * @typedef sap.ushell.services.SearchableContent.AppData
     * @type {object}
     * @property {string} id
     * @property {string} title
     * @property {string} subtitle
     * @property {string} icon
     * @property {string} info
     * @property {string[]} keywords
     *    Search key words
     * @property {string[]} technicalAttributes
     *    Technical attributes in "sap.app" section of the app descriptor
     * @property {object} target
     *    Same format as in CDM RT schema in visualization/vizConfig/sap.flp/target.
     * @property {sap.ushell.services.SearchableContent.VizData[]} visualizations
     *    List of tiles etc.
     * @property {string} [targetURL] the target URL for navigation
     *
     * @private
     * @ui5-restricted sap.esh.search.ui
     */

    /**
     * @typedef sap.ushell.services.SearchableContent.VizData
     * @type {object}
     * @property {string} id
     * @property {string} vizId
     * @property {string} vizType
     * @property {string} title
     * @property {string} subtitle
     * @property {string} icon
     * @property {string} info
     * @property {string[]} keywords
     *    Search key words
     * @property {object} target
     *    Same format as in CDM RT schema in visualization/vizConfig/sap.flp/target.
     * @property {object} _instantiationData
     *    Platform-specific data for instantiation
     * @property {string} [targetURL] the target URL for navigation
     *
     * @private
     * @ui5-restricted sap.esh.search.ui
     */

    /**
     * Collects and returns all apps
     *
     * @param {object} [oParameters] the parameters for the search.
     * @param {boolean} [oParameters.includeAppsWithoutVisualizations=false]
     *      if set to <code>true</code>, apps without visualizations are also
     *      included in the result (default is <code>false</code>); this option
     *      is only supported when spaces and pages are used
     * @param {boolean} [oParameters.enableVisualizationPreview=true]
     *      if set to <code>true</code>, will be put into preview mode. This
     *      might include a conversion of the tile type.
     *
     * @returns {Promise<sap.ushell.services.SearchableContent.AppData[]>} A list of appData.
     *
     * @since 1.77.0
     * @private
     * @ui5-restricted sap.esh.search.ui
     */
    SearchableContent.prototype.getApps = function (oParameters = {}) {
        const oDefaults = {
            includeAppsWithoutVisualizations: false,
            enableVisualizationPreview: true
        };
        const oOptions = {
            includeAppsWithoutVisualizations: oParameters.includeAppsWithoutVisualizations ?? oDefaults.includeAppsWithoutVisualizations,
            enableVisualizationPreview: oParameters.enableVisualizationPreview ?? oDefaults.enableVisualizationPreview
        };

        /**
         * Classic homepage was removed
         * @deprecated since 1.120
         */
        if (!Config.last("/core/spaces/enabled")) {
            return this._getLaunchPageAppData(oOptions)
                .then(function (aAppData) {
                    return this._filterGetApps(aAppData, oOptions);
                }.bind(this))
                .then(function (aApps) {
                    Log.debug("SearchableContent@getApps in classic mode found " + aApps.length + " apps");
                    return aApps;
                })
                .catch(function (oError) {
                    Log.error("SearchableContent@getApps in classic mode failed", oError);
                    return Promise.reject(oError);
                });
        }

        return this._getPagesAppData(oOptions)
            .then(function (aAppData) {
                return this._filterGetApps(aAppData, oOptions);
            }.bind(this));
    };

    /**
     * Filters duplicates and appData with empty vizData
     * @param {sap.ushell.services.SearchableContent.AppData[]} aAppData An array of appData
     * @param {object} oGetAppsOptions Options set from consumer
     * @see #getApps
     * @returns {sap.ushell.services.SearchableContent.AppData[]} The filtered array of appData
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._filterGetApps = function (aAppData, oGetAppsOptions) {
        var aResult = aAppData;
        aResult.forEach(function (oAppData) {
            // remove duplicates
            var aVisualizations = oAppData.visualizations;
            var aUniqueProperties = [];
            oAppData.visualizations = [];
            aVisualizations.forEach(function (oViz) {
                var sUniqueProperties = JSON.stringify({
                    title: oViz.title,
                    subtitle: oViz.subtitle,
                    icon: oViz.icon,
                    vizType: oViz.vizType
                });
                if (aUniqueProperties.indexOf(sUniqueProperties) === -1) {
                    oAppData.visualizations.push(oViz);
                    aUniqueProperties.push(sUniqueProperties);
                }
            });
        });

        if (!oGetAppsOptions.includeAppsWithoutVisualizations) {
            aResult = aResult.filter(function (oAppData) {
                // remove apps without visualization
                return oAppData.visualizations.length > 0;
            });
        }
        ushellUtils.setPerformanceMark("FLP-Search-FilterApps", { bUseUniqueMark: true });
        return aResult;
    };

    /**
     * Collects all appData occurrences within the classic homepage scenario
     * @param {object} oGetAppsOptions Options set from consumer
     * @see #getApps
     * @returns {Promise<sap.ushell.services.SearchableContent.AppData[]>} An array of appData
     *
     * @since 1.77.0
     * @private
     * @deprecated since 1.120
     */
    SearchableContent.prototype._getLaunchPageAppData = function (oGetAppsOptions) {
        return Container.getServiceAsync("FlpLaunchPage")
            .then(function (oLaunchPageService) {
                this._oLaunchPageService = oLaunchPageService;
                return this._collectLaunchPageTiles();
            }.bind(this))
            .then(function (aResults) {
                var aCatalogTiles = aResults[0];
                var aGroupTiles = aResults[1];
                var aTiles = aCatalogTiles.concat(aGroupTiles);
                return Promise.all(aTiles.map(function (oTile) {
                    var bIsCatalogTile = aCatalogTiles.includes(oTile);
                    var oTileData = {
                        tileId: null,
                        tile: oTile
                    };
                    var sPreviewTitle;

                    try {
                        if (bIsCatalogTile) {
                            oTileData.tileId = this._oLaunchPageService.getCatalogTileId(oTile);
                        } else {
                            oTileData.tileId = this._oLaunchPageService.getTileId(oTile);
                        }
                        sPreviewTitle = this._oLaunchPageService.getCatalogTilePreviewTitle(oTile); // should work for catalogTiles and groupTiles
                    } catch (oError) {
                        Log.error("Could not get search data from tile " + oTileData.tileId, oError);
                    }

                    // Some tiles (e.g. SSB) need to have their view instantiated to return any tile properties
                    if (!sPreviewTitle) {
                        return new Promise(function (resolve, reject) {
                            if (bIsCatalogTile) {
                                this._oLaunchPageService.getCatalogTileViewControl(oTile)
                                    .done(resolve)
                                    .fail(reject);
                            } else {
                                this._oLaunchPageService.getTileView(oTile)
                                    .done(resolve)
                                    .fail(reject);
                            }
                        }.bind(this))
                            .then(function (oTileView) {
                                oTileData.view = oTileView;
                                return oTileData;
                            })
                            .catch(function (oError) {
                                Log.error("Could not get search data from tile " + oTileData.tileId, oError);
                                return oTileData;
                            });
                    }

                    return Promise.resolve(oTileData);
                }.bind(this)));
            }.bind(this))
            .then(function (aTileData) {
                var oAppData = {};
                var aVizData = aTileData
                    .map(function (oTileData) {
                        try {
                            return this._buildVizDataFromLaunchPageTile(oTileData.tile, oGetAppsOptions);
                        } catch (oError) {
                            Log.error("Could not get search data from tile " + oTileData.tileId, oError);
                            return null;
                        }
                    }.bind(this))
                    .filter(function (oVizData) {
                        return oVizData;
                    });

                // we need to delete the tile views after we are done with extracting the data
                aTileData.forEach(function (oTileData) {
                    var oTileView = oTileData.view;
                    if (oTileView) {
                        if (!oTileView.destroy) {
                            Log.error("The tile with id '" + oTileData.tileId + "' does not implement mandatory function destroy");
                        } else {
                            oTileView.destroy();
                        }
                    }
                });

                aVizData.forEach(function (oVizData) {
                    var sTarget = oVizData.targetURL;
                    if (sTarget) {
                        if (oAppData[sTarget]) {
                            oAppData[sTarget].visualizations.push(oVizData);
                        } else {
                            oAppData[sTarget] = this._buildAppDataFromViz(oVizData);
                        }
                    }
                }.bind(this));
                return objectValues(oAppData);
            }.bind(this));
    };

    /**
     * Collects catalog and group tiles from the LaunchPage service
     * @returns {Promise<object[]>} Resolves an array of LaunchPage tiles
     *
     * @since 1.77.0
     * @private
     * @deprecated since 1.120
     */
    SearchableContent.prototype._collectLaunchPageTiles = function () {
        var oGroupTilesPromise = this._oLaunchPageService.getGroups().then(function (aGroups) {
            return aGroups.reduce(function (oTilesPromise, oGroup) {
                return Promise.all([
                    oTilesPromise,
                    this._oLaunchPageService.getGroupTilesForSearch(oGroup)
                ]).then(function (aTileResults) {
                    var aTiles = aTileResults[0];
                    var aGroupTiles = aTileResults[1];
                    return aTiles.concat(aGroupTiles);
                });
            }.bind(this), Promise.resolve([]));
        }.bind(this));

        var oCatalogTilesPromise = this._oLaunchPageService.getCatalogs().then(function (aCatalogs) {
            return aCatalogs.reduce(function (oTilesPromise, oCatalog) {
                return Promise.all([
                    oTilesPromise,
                    this._oLaunchPageService.getCatalogTiles(oCatalog)
                ]).then(function (aTileResults) {
                    var aTiles = aTileResults[0];
                    var aCatalogTiles = aTileResults[1];
                    return aTiles.concat(aCatalogTiles);
                });
            }.bind(this), Promise.resolve([]));
        }.bind(this));

        return Promise.all([
            oCatalogTilesPromise,
            oGroupTilesPromise
        ]);
    };

    /**
     * Collects all appData occurrences within the pages scenario
     *
     * @param {object} oGetAppsOptions Options set from consumer
     * @see #getApps
     * @returns {Promise<sap.ushell.services.SearchableContent.AppData[]>} An array of appData
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._getPagesAppData = async function (oGetAppsOptions) {
        const oCdmService = await Container.getServiceAsync("CommonDataModel");
        const [
            aPages,
            oApplications,
            oVisualizations,
            oVizTypes,
            oCSTRService
        ] = await Promise.all([
            oCdmService.getAllPages({ personalizedPages: true }),
            oCdmService.getApplications(),
            oCdmService.getVisualizations(),
            oCdmService.getVizTypes(),
            Container.getServiceAsync("ClientSideTargetResolution")
        ]);

        const oSite = {
            applications: oApplications,
            visualizations: oVisualizations,
            vizTypes: oVizTypes
        };
        const oAppData = {};

        await this._applyCdmVisualizations(oSite, oAppData, oGetAppsOptions);
        await this._applyCdmPages(oSite, aPages, oAppData, oGetAppsOptions);
        await this._filterAppDataByIntent(oAppData, oCSTRService);
        this._applyCdmApplications(oSite, oAppData, oGetAppsOptions);

        return objectValues(oAppData);
    };

    /**
     * Manipulates the map of appData by filtering the entries out which don't have a valid intent
     * or aren't urls
     * @param {object} oAppData The map of appData
     * @param {object} oCSTRService The ClientSideTargetResolution service
     * @returns {Promise<undefined>} Promise which resolves after the filtering is done
     *
     * @since 1.78.0
     * @private
     */
    SearchableContent.prototype._filterAppDataByIntent = function (oAppData, oCSTRService) {
        var aIntentTargetPromises = Object.keys(oAppData).map(function (sIntent) {
            return urlParsing.isIntentUrlAsync(sIntent)
                .then(function (bIsIntent) {
                    return bIsIntent ? sIntent : null;
                });
        });
        return Promise.all(aIntentTargetPromises)
            .then(function (aAllIntents) {
                var aIntentTargets = aAllIntents.filter(function (vIntent) {
                    return !!vIntent;
                });
                if (aIntentTargets.length === 0) {
                    return;
                }

                // a large amount of intents can cause a stack overflow in the client side target resolution
                // therefore isIntentSupported is called in smaller packages
                var iPackageSize = 500;
                var iPackageStart = 0;
                var iPackageEnd = iPackageSize;
                var aIntentTargetPackages = [];
                while (iPackageStart < aIntentTargets.length) {
                    aIntentTargetPackages.push(aIntentTargets.slice(iPackageStart, iPackageEnd));
                    iPackageStart = iPackageStart + iPackageSize;
                    iPackageEnd = iPackageEnd + iPackageSize;
                }

                // process the packages sequentially
                return aIntentTargetPackages.reduce(function (oPromiseChain, aIntentTargetPackage) {
                    return oPromiseChain
                        .then(function (aIntents) {
                            ushellUtils.setPerformanceMark("FLP-Search-IntentPackageStart");
                            return oCSTRService.isIntentSupported(aIntents);
                        }.bind(null, aIntentTargetPackage))
                        .then(function (oSupported) {
                            Object.keys(oSupported).forEach(function (sTarget) {
                                if (!oSupported[sTarget].supported && oAppData[sTarget]) {
                                    delete oAppData[sTarget];
                                }
                            });
                        })
                        .catch(function () {
                            // if a package had an error just continue with the next one
                        });
                }, Promise.resolve());
            });
    };

    /**
     * Manipulates the map of appData by adding all applications
     * @param {object} oSite The cdm site containing at least applications and visualizations
     * @param {object} oAppData The map of appData
     * @param {object} oGetAppsOptions Options set from consumer
     * @see #getApps
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._applyCdmApplications = function (oSite, oAppData, oGetAppsOptions) {
        var oAppsByAppId = {};
        Object.keys(oAppData).forEach(function (sKey) {
            try {
                var aVisualizations = oAppData[sKey].visualizations;

                var oVisualization = aVisualizations.find(function (oVizData) {
                    return oVizData.target.appId && oVizData.target.inboundId;
                });

                if (oVisualization) {
                    var oApp = oSite.applications[oVisualization.target.appId];
                    var oInbound = readApplications.getInbound(oApp, oVisualization.target.inboundId);
                    oAppData[sKey] = this._buildAppDataFromAppAndInbound(oApp, oInbound);
                    oAppData[sKey].visualizations = aVisualizations;
                    oAppData[sKey].target = aVisualizations[0].target;
                } else {
                    oAppData[sKey] = this._buildAppDataFromViz(aVisualizations[0]);
                    oAppData[sKey].visualizations = aVisualizations;
                    oAppData[sKey].target = aVisualizations[0].target;
                }
            } catch (oError) {
                Log.error("Could not get search data from application " + sKey, oError);
            }
        }.bind(this));

        if (oGetAppsOptions.includeAppsWithoutVisualizations) {
            // oAppData uses intents as keys - need to remap to object with appIds
            objectValues(oAppData).forEach(function (oApp) {
                oAppsByAppId[oApp.id] = oApp;
            });
            objectValues(oSite.applications).forEach(function (oSiteApp) {
                var sAppId = readApplications.getId(oSiteApp);
                var aInbounds = objectValues(readApplications.getInbounds(oSiteApp));
                var oInbound = aInbounds.length > 0 ? aInbounds[0] : undefined;
                if (!oAppsByAppId.hasOwnProperty(sAppId)) {
                    oAppData[sAppId] = this._buildAppDataFromAppAndInbound(oSiteApp, oInbound, true /* bAddTargetURL */);
                }
            }.bind(this));
        }
    };

    /**
     * Manipulates the map of appData by adding visualizations from the cdm site
     * @param {object} oSite The cdm site containing at least applications and visualizations
     * @param {object} oAppData The map of appData
     * @param {object} oGetAppsOptions Options set from consumer
     * @returns {Promise<undefined>} Resolves with undefined.
     * @see #getApps
     *
     * @since 1.78.0
     * @private
     */
    SearchableContent.prototype._applyCdmVisualizations = async function (oSite, oAppData, oGetAppsOptions) {
        for (const sKey in oSite.visualizations) {
            try {
                const oVizReference = {
                    vizId: sKey,
                    // the search should display only standard tiles if possible, never flat tiles or links
                    // some tiles might only support standardWide and not standard. this is handled by getVizData
                    displayFormatHint: DisplayFormat.Standard
                };
                const oVizData = await readUtils.getVizData(oSite, oVizReference /*, oSystemContext*/);
                const sTarget = oVizData.targetURL;

                if (oGetAppsOptions.enableVisualizationPreview) {
                    this._changeVizType(oVizData);
                    oVizData.preview = true;
                }

                if (sTarget) {
                    if (oAppData[sTarget]) {
                        oAppData[sTarget].visualizations.push(oVizData);
                    } else {
                        oAppData[sTarget] = {
                            visualizations: [
                                oVizData
                            ]
                        };
                    }
                }
            } catch (oError) {
                Log.error("Could not get search data from visualization " + sKey, oError);
            }
        }
    };

    /**
     * Manipulates the map of appData by adding all visualizations from the pages
     * @param {object} oSite The cdm site containing at least applications and visualizations
     * @param {object[]} aPages The list of pages
     * @param {object} oAppData The map of appData
     * @param {object} oGetAppsOptions Options set from consumer
     *
     * @returns {Promise<undefined>} Promise which resolves after the pages were applied.
     * @see #getApps
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._applyCdmPages = async function (oSite, aPages, oAppData, oGetAppsOptions) {
        for (const oPage of aPages) {
            const aVizReferences = readPages.getVisualizationReferences(oPage);
            for (let oVizReference of aVizReferences) {
                try {
                    // the search should display only standard tiles if possible, never flat tiles or links
                    // some tiles might only support standardWide and not standard. this is handled by getVizData
                    if (oVizReference.displayFormatHint && oVizReference.displayFormatHint !== DisplayFormat.Standard) {
                        // this service processes the original personalized CDM data. without the clone, changing the
                        // display format would affect the tiles on the pages. A shallow copy is sufficient here.
                        oVizReference = Object.assign({}, oVizReference);
                        oVizReference.displayFormatHint = DisplayFormat.Standard;
                    }
                    const oVizData = await readUtils.getVizData(oSite, oVizReference /*, oSystemContext*/);
                    const sTarget = oVizData.targetURL;

                    if (oGetAppsOptions.enableVisualizationPreview) {
                        this._changeVizType(oVizData);
                        oVizData.preview = true;
                    }

                    if (sTarget) {
                        if (oAppData[sTarget]) {
                            oAppData[sTarget].visualizations.push(oVizData);
                        } else {
                            oAppData[sTarget] = {
                                visualizations: [
                                    oVizData
                                ]
                            };
                        }
                    }
                } catch (oError) {
                    Log.error("Could not get search data from vizReference " + oVizReference.id, oError);
                }
            }
        }
    };

    /**
     * There is no preview mode for custom tiles on CDM. To prevent those tiles from
     * loading dynamic content, the tiles are transformed into static tiles.
     * @param {object} oVizData A tile's data
     *
     * @since 1.93.0
     * @private
     */
    SearchableContent.prototype._changeVizType = function (oVizData) {
        if (oVizData._instantiationData.platform === "CDM" && !readVisualizations.isStandardVizType(oVizData.vizType)) {
            oVizData.vizType = "sap.ushell.StaticAppLauncher";
            oVizData._instantiationData.vizType = {
                "sap.ui5": {
                    componentName: "sap.ushell.components.tiles.cdm.applauncher"
                }
            };
        }
    };

    /**
     * Constructs an appData object based on an application and inbound
     * @param {object} oApp An application
     * @param {object} [oInb] An inbound
     * @param {boolean} [bAddTargetURL] if <code>true</code>, the targetURL
     *  is derived from the inbound and set in the result
     * @returns {sap.ushell.services.SearchableContent.AppData} The appData object
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._buildAppDataFromAppAndInbound = function (oApp, oInb, bAddTargetURL) {
        oInb = oInb || {};
        var sAppId = readApplications.getId(oApp);
        var oResult = {
            id: sAppId,
            title: oInb.title || readApplications.getTitle(oApp),
            subtitle: oInb.subTitle || readApplications.getSubTitle(oApp),
            icon: oInb.icon || readApplications.getIcon(oApp),
            info: oInb.info || readApplications.getInfo(oApp),
            keywords: oInb.keywords || readApplications.getKeywords(oApp),
            technicalAttributes: readApplications.getTechnicalAttributes(oApp),
            visualizations: []
        };
        var sHashFromInbound;

        if (bAddTargetURL) {
            sHashFromInbound = utilsCdm.toHashFromInbound(oInb, sAppId);
            if (sHashFromInbound) {
                oResult.targetURL = "#" + sHashFromInbound;
            }
        }
        return oResult;
    };

    /**
     * Constructs an appData object based on vizData
     * @param {sap.ushell.services.SearchableContent.VizData} oVizData The vizData object
     * @returns {sap.ushell.services.SearchableContent.AppData} The appData object
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._buildAppDataFromViz = function (oVizData) {
        return {
            id: oVizData.vizId,
            title: oVizData.title,
            subtitle: oVizData.subtitle,
            icon: oVizData.icon,
            info: oVizData.info,
            keywords: oVizData.keywords,
            technicalAttributes: oVizData.technicalAttributes,
            target: oVizData.target,
            visualizations: [
                oVizData
            ]
        };
    };

    /**
     * Constructs an vizData object based on a LaunchPage tile
     * @param {object} oLaunchPageTile A LaunchPage tile
     * @param {object} oGetAppsOptions Options set from consumer
     * @see #getApps
     * @returns {sap.ushell.services.SearchableContent.VizData} The vizData object
     *
     * @since 1.77.0
     * @private
     * @deprecated since 1.120
     */
    SearchableContent.prototype._buildVizDataFromLaunchPageTile = function (oLaunchPageTile, oGetAppsOptions) {
        var oVizData;
        // Filter all tiles that cannot be launched due to a missing target
        if (this._oLaunchPageService.getCatalogTileTargetURL(oLaunchPageTile) &&
            this._oLaunchPageService.isTileIntentSupported(oLaunchPageTile)) {
            oVizData = {
                id: this._oLaunchPageService.getTileId(oLaunchPageTile)
                    || this._oLaunchPageService.getCatalogTileId(oLaunchPageTile),
                vizId: this._oLaunchPageService.getCatalogTileId(oLaunchPageTile)
                    || this._oLaunchPageService.getTileId(oLaunchPageTile)
                    || "",
                vizType: "",
                title: this._oLaunchPageService.getCatalogTilePreviewTitle(oLaunchPageTile)
                    || this._oLaunchPageService.getCatalogTileTitle(oLaunchPageTile)
                    || this._oLaunchPageService.getTileTitle(oLaunchPageTile)
                    || "",
                subtitle: this._oLaunchPageService.getCatalogTilePreviewSubtitle(oLaunchPageTile)
                    || "",
                icon: this._oLaunchPageService.getCatalogTilePreviewIcon(oLaunchPageTile)
                    || "sap-icon://business-objects-experience",
                info: this._oLaunchPageService.getCatalogTilePreviewInfo(oLaunchPageTile)
                    || "",
                keywords: this._oLaunchPageService.getCatalogTileKeywords(oLaunchPageTile)
                    || [],
                technicalAttributes: this._oLaunchPageService.getCatalogTileTechnicalAttributes(oLaunchPageTile)
                    || [],
                target: {
                    type: "URL",
                    url: this._oLaunchPageService.getCatalogTileTargetURL(oLaunchPageTile)
                },
                targetURL: this._oLaunchPageService.getCatalogTileTargetURL(oLaunchPageTile)
            };

            oVizData._instantiationData = {
                platform: "LAUNCHPAGE",
                launchPageTile: oLaunchPageTile
            };

            if (oLaunchPageTile.getContract) {
                oLaunchPageTile.getContract("preview").setEnabled(oGetAppsOptions.enableVisualizationPreview);
            }

            if (oGetAppsOptions.enableVisualizationPreview) {
                // This is basically a test if this is an ABAP LaunchPage tile, which is not very clean.
                // On ABAP the tiles and especially custom tiles can be displayed properly in the search
                // as they offer a preview mode.
                if (!oLaunchPageTile.getChip) {
                    // On CDM there is no preview mode for tiles, therefore the search only displays static tiles
                    oVizData._instantiationData = {
                        platform: "CDM",
                        vizType: {
                            "sap.ui5": {
                                componentName: "sap.ushell.components.tiles.cdm.applauncher"
                            }
                        }
                    };
                }
            }
        }

        return oVizData;
    };

    SearchableContent.hasNoAdapter = true;
    return SearchableContent;
}, /*export=*/ true);

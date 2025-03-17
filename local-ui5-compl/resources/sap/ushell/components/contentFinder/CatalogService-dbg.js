// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview This module communicates with the content API graphql service to retrieve catalogs and visualization data for catalogs.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ushell/utils/HttpClient",
    "sap/ushell/Config"
], function (
    Localization,
    HttpClient,
    Config
) {
    "use strict";
    /**
     * @alias sap.ushell.components.contentFinder.CatalogService
     * @class
     * @classdesc Service for loading Catalogs.
     *
     * @since 1.121.0
     * @private
     */
    const Catalog = function () {
        this.httpClient = new HttpClient();
        this._sBaseUrl = Config.last("/core/workPages/contentApiUrl");

        const oUrlParams = new URLSearchParams(window.location.search);
        this._sSiteId = oUrlParams.get("siteId") || Config.last("/core/site/siteId");
    };

    /**
     *
     * @returns {Promise<Array<object>>} List of Catalogs
     */
    Catalog.prototype.getCatalogs = function () {
        /**
         * The backend implements a maximum page size. Since all catalogs shall be requested, we
         * query the first page incl. the total count. With the result length and the total count
         * we can calculate the other pages and request them all in parallel but only after the first
         * page was returned.
         */
        const pFirstRequest = this._getCatalogs();
        const aRequests = [pFirstRequest];
        let fnResolve, fnReject;

        const pReturn = new Promise((resolve, reject) => {
            fnResolve = resolve;
            fnReject = reject;
        });

        pFirstRequest.then((oData) => {
            let iSkip = oData.catalogs.length;
            const iPageSize = iSkip;
            const iLength = oData.totalCount;

            while (iSkip < iLength) {
                aRequests.push(this._getCatalogs(iSkip, iPageSize));
                iSkip += iPageSize;
            }

            Promise.all(aRequests).then((aResponses) => {
                const aCatalogs = aResponses.reduce((aAccumulator, oItem) => {
                    return aAccumulator.concat(oItem.catalogs);
                }, []);
                fnResolve({ catalogs: aCatalogs, totalCount: aResponses[0].totalCount });

            });
        }).catch((sError) => {
            fnReject(sError);
        });

        return pReturn;
    };

    Catalog.prototype._getCatalogs = function (iSkip, iTop, mParameters) {
        let sQuery = `
        getCatalogs ($siteId: String, $queryInput: QueryCatalogsInput!){
            catalogs(siteId: $siteId, queryInput: $queryInput) {
                totalCount,
                nodes {
                    id,
                    descriptor { value }
                    provider {
                        id
                    },
                    systemLabel,
                },
            }
        }`;
        // Replace line breaks and spaces
        sQuery = sQuery
            .replace(/\n/g, "")
            .replace(/ /g, "");

        sQuery = `query ${sQuery}`;

        const oParameters = { ...mParameters };
        oParameters.skip = iSkip || 0;
        if (iTop) {
            oParameters.top = iTop;
        }

        const oVariables = {
            siteId: this._sSiteId,
            queryInput: oParameters
        };
        return this._doRequest(sQuery, JSON.stringify(oVariables)).then((oCatalogData) => {
            const aCatalogs = [];
            if (oCatalogData.data.catalogs) {
                oCatalogData.data.catalogs.nodes.forEach((item, index) => {
                    if (item.descriptor.value) {
                        let catalog = {
                            id: item.id,
                            title: item.descriptor.value.title
                        };

                        if (item.provider?.id && item.provider.id !== "SUB_ACCOUNT") {
                            catalog = {
                                ...catalog,
                                contentProviderId: item.provider.id
                            };
                        }
                        if (item.systemLabel) {
                            catalog = {
                                ...catalog,
                                contentProviderLabel: item.systemLabel
                            };
                        }

                        aCatalogs.push(catalog);
                    }
                });
            }
            return {
                catalogs: aCatalogs,
                totalCount: oCatalogData.data.catalogs.totalCount || 0
            };
        });
    };

    Catalog.prototype.loadVisualizations = function (sCatalogId, mParameters) {
        if (!sCatalogId) {
            return Promise.reject("Catalog ID is mandatory");
        }
        let sQuery = `
        getCatalog($siteId: String, $filterQuery: QueryCatalogVisualizationsInput) {
            catalog(siteId: $siteId, catalogId: "${sCatalogId}") {
                id,
                descriptor { value },
                visualizations(queryInput: $filterQuery) {
                    totalCount,
                    nodes{
                        id,
                        type,
                        descriptor {
                            value,
                            schemaVersion
                        },
                        descriptorResources {
                            baseUrl,
                            descriptorPath
                        },
                        indicatorDataSource {
                            url,
                            refreshInterval
                        },
                        targetAppIntent {
                            semanticObject,
                            action,
                            businessAppId
                        },
                        systemLabel
                    }
                }
            }
        }`;

        // Replace line breaks and spaces
        sQuery = sQuery
            .replace(/\n/g, "")
            .replace(/ /g, "");

        sQuery = `query ${sQuery}`;

        const oVariables = {
            siteId: this._sSiteId,
            filterQuery: mParameters
        };
        return this._doRequest(sQuery, JSON.stringify(oVariables)).then((oVizData) => {
            return {
                visualizations: oVizData.data?.catalog.visualizations || [],
                totalCount: oVizData.data?.catalog.visualizations.totalCount || 0
            };
        });
    };

    Catalog.prototype._doRequest = function (sQuery, sVariables) {
        let sUrl = `${this._sBaseUrl}?query=${sQuery}`;
        if (sVariables) { sUrl += `&variables=${sVariables}`; }
        return this.httpClient.get(sUrl, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Accept-Language": Localization.getLanguageTag().toString()
            }
        }).then(function (oResponse) {
            if (oResponse.status < 200 || oResponse.status >= 300) {
                return Promise.reject(`HTTP request failed with status: ${oResponse.status} - ${oResponse.statusText}`);
            }
            return JSON.parse(oResponse.responseText || "{}");
        });
    };

    return Catalog;
}, /*export=*/ true);

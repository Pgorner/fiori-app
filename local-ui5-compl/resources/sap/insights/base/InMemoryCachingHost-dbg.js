/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 * This extension is for OVP Analytical cards delivered in 2208.
 */
sap.ui.define(
    [
        "sap/ui/integration/Host",
        "sap/insights/base/CacheData"
    ],
    function (Host, CacheData) {
        "use strict";
        var InMemoryCacheInstance = CacheData.getInstance();
        var refreshTime = "refreshTime";

        return Host.extend("sap.insights.InMemoryCachingHost", {

            _fetchData: function (sResource, mOptions, mRequestSettings, oCard) {
                var sCardId = oCard.getManifestEntry("sap.app").id;
                return Host.prototype.fetch.call(this, sResource, mOptions, mRequestSettings)
                    .then(function (oResponse) {
                        InMemoryCacheInstance.setCacheResponse(sCardId, sResource, oResponse);
                        InMemoryCacheInstance.setCacheResponse(sCardId, refreshTime, new Date());
                        var oCacheResponse  = InMemoryCacheInstance.getCacheResponse(sCardId);
                        const manifestChanges = {"/sap.card/header/dataTimestamp": oCacheResponse[refreshTime]};
                        if (oCard.getManifestEntry('sap.card').type === "List") {
                            manifestChanges["/sap.card/content/item/actionsStrip"] = oCard.getManifestEntry('sap.card').content.item.actionsStrip || [];
                        }
                        oCard.setManifestChanges([manifestChanges]);
                        return oCacheResponse[sResource];
                    })
                    .catch(function (oError) {
                        var oResponseBody = {
                            error: oError.toString()
                        };
                        var oResponse = new Response(
                            JSON.stringify(oResponseBody),
                            {
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }
                        );
                        InMemoryCacheInstance.setCacheResponse(sCardId, sResource, oResponse);
                        InMemoryCacheInstance.setCacheResponse(sCardId, refreshTime, new Date());
                        var oCacheResponse = InMemoryCacheInstance.getCacheResponse(sCardId);
                        return oCacheResponse[sResource];
                    });
            },

            _isCSRFFetchCall: function (mRequestSettings) {
                return mRequestSettings.method === "HEAD";
            },

            fetch: function (sResource, mOptions, mRequestSettings, oCard) {
                var sCardId = oCard.getManifestEntry("sap.app").id;
                var oCacheResponse = InMemoryCacheInstance.getCacheResponse(sCardId);
                var oTempPromise = InMemoryCacheInstance.getTempPromise(sCardId);
                if (!oCacheResponse) {
                    oCacheResponse = InMemoryCacheInstance.setCacheResponse(sCardId, null, {});
                }
                if (!oTempPromise) {
                    oTempPromise = InMemoryCacheInstance.setTempPromise(sCardId, null, {});
                }
                if (this._isCSRFFetchCall(mRequestSettings)) {
                    return Host.prototype.fetch.call(this, sResource, mOptions, mRequestSettings);
                } else if (!oCacheResponse[sResource] && !oTempPromise[sResource]) {
                    oTempPromise = InMemoryCacheInstance.setTempPromise(sCardId, sResource, this._fetchData(sResource, mOptions, mRequestSettings, oCard));
                    return oTempPromise[sResource];
                } else if (!oCacheResponse[sResource] && oTempPromise[sResource]) {
                    return oTempPromise[sResource];
                } else {
                    return new Promise(function (resolve) {
                        if (oCard.getManifestChanges() && !oCard.getManifestChanges().length) {
                            const manifestChanges = {"/sap.card/header/dataTimestamp": oCacheResponse["refreshTime"]};
                            if (oCard.getManifestEntry('sap.card').type === "List") {
                                manifestChanges["/sap.card/content/item/actionsStrip"] = oCard.getManifestEntry('sap.card').content.item.actionsStrip || [];
                            }
                            oCard.setManifestChanges([manifestChanges]);
                        }
                        resolve(oCacheResponse[sResource]);
                    });
                }
            }
        });
    });
// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
//TODO should be replaced by sap/ushell/utils
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell_abap/pbServices/ui2/Utils"
], function (
    ObjectPath,
    Utils
) {
    "use strict";

    const OBJECT_PROTOTYPE_KEYS = Object.getOwnPropertyNames(Object.prototype);

    var utils = {};

    /**
     * Returns the [first] parameter value or undefined
     * @param {string} sValue the value to retrieve
     * @param {object} mMap optional, a parameter map
     * @returns {string}
     *     the first parameter value, if present
     *
     * @private
     */
    utils.getUrlParameterValue = function (sValue, mMap) {
        var mParameterMap = mMap || Utils.getParameterMap();
        return mParameterMap[sValue] && mParameterMap[sValue][0];
    };

    /**
     * Creates and opens a new XMLHttpRequest object.
     *
     * @param {string} sUrl
     *  The URL the XHR object should request from.
     * @param {object} oStartupParameters
     *   The start_up parameters. This object must
     *   contain at least the following fields:
     * <pre>
     * {
     *     "client": "<client>",
     *     "language": "<language>"
     * }
     * </pre>
     *
     * @param {string} [sHttpMethod]
     *  The Http method name with default value "GET".
     * @returns {object}
     *   The oXHR object.
     */
    utils.createAndOpenXHR = function (sUrl, oStartupParameters, sHttpMethod) {
        sHttpMethod = sHttpMethod || "GET";
        var oXHR = new XMLHttpRequest();
        oXHR.open(sHttpMethod, sUrl, /*async=*/true);
        if (oStartupParameters) {
            utils.addCommonHeadersToXHR(oXHR, oStartupParameters);
        }
        return oXHR;
    };

    /**
     * Adds common headers to the given XHR object. This method is ideal to be used whenever the request should be made with certain headers.
     *
     * @param {object} oXHR Instance of XMLHttpRequest object
     *
     * @param {object} oStartupResultLikeObject
     *   An object that looks like the start_up result. This object must
     *   contain at least the following fields:
     * <pre>
     * {
     *     "client": "<client>",
     *     "language": "<language>"
     * }
     * </pre>
     *
     * @returns {object}
     *   The input oXHR object amended with headers.
     */
    utils.addCommonHeadersToXHR = function (oXHR, oStartupResultLikeObject) {
        oXHR.setRequestHeader("Accept", "application/json");
        if (oStartupResultLikeObject.client) {
            oXHR.setRequestHeader("sap-client", oStartupResultLikeObject.client);
        }
        if (oStartupResultLikeObject.language) {
            oXHR.setRequestHeader("sap-language", oStartupResultLikeObject.language);
        }
        return oXHR;
    };

    /**
     * Get cacheId from startup config and return it as query parameter like "&sap-cache-id=xxxx"
     * If cacheId not found in config, return empty string
     * @param {object} oStartupConfig startup config
     * @returns {string} "&sap-cache-id=xxxx" if found, otherwise ""
     */
    utils.getCacheIdAsQueryParameter = function (oStartupConfig) {
        var sCacheId = ObjectPath.get("services.targetMappings.cacheId", oStartupConfig);
        if (typeof sCacheId === "string") {
            return "&sap-cache-id=" + sCacheId;
        }
        return "";
    };

    /**
     * Merge the object oConfigToMerge into oMutatedConfig according to
     * sap-ushell-config merge rules Note that the JSON serialized content of
     * oConfigToMerge is used, thus JSON serialization restrictions apply (e.g.
     * Infinity -> null ) Note that it is thus not possible to remove a
     * property definition or overriding with  {"propname" : undefined}, one
     * has to override with null or 0 etc.
     *
     * Note: Do not use this method for general merging of other objects, as
     * the rules may be enhanced/altered
     *
     * @param {object} oMutatedBaseConfig
     *     the configuration to merge into, modified in place
     * @param {object} oConfigToMerge
     *     the configuration to be merged with oMutatedBaseConfig
     * @param {boolean} bCloneConfigToMerge
     *     whether the oConfigToMerge must be cloned prior the merge
     * @private
     */
    utils.mergeConfig = function (oMutatedBaseConfig, oConfigToMerge, bCloneConfigToMerge) {
        var oActualConfigToMerge = bCloneConfigToMerge
            ? JSON.parse(JSON.stringify(oConfigToMerge))
            : oConfigToMerge;

        if (typeof oConfigToMerge !== "object") {
            return;
        }

        Object.keys(oActualConfigToMerge).forEach(function (sKey) {
            // Prevent overriding of object prototype properties to avoid prototype pollution attacks
            if (OBJECT_PROTOTYPE_KEYS.includes(sKey)) {
                return;
            }

            if (Object.prototype.toString.apply(oMutatedBaseConfig[sKey]) === "[object Object]" &&
                Object.prototype.toString.apply(oActualConfigToMerge[sKey]) === "[object Object]") {

                utils.mergeConfig(oMutatedBaseConfig[sKey], oActualConfigToMerge[sKey], false);
                return;
            }
            oMutatedBaseConfig[sKey] = oActualConfigToMerge[sKey];
        });
    };

    /**
     * Returns the location origin.
     *
     * @returns {string}
     *     the location origin
     *
     * @private
     */
    utils.getLocationOrigin = function () {
        // location.origin might not be supported by all browsers
        return location.protocol + "//" + location.host;
    };

    /**
     * Returns the location href.
     *
     * @returns {string}
     *     the location href
     *
     * @private
     */
    utils.getLocationHref = function () {
        return location.href;
    };

    return utils;
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview This file contains miscellaneous utility functions for the window object.
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/util/isCrossOriginURL",
    "sap/ushell/utils"
], function (
    Log,
    isCrossOriginURL,
    ushellUtils
) {
    "use strict";

    var WindowUtils = {};

    /**
     * Checks a given URL for non-http(s) protocols.
     *
     * @param {string} URL The URL to be checked
     * @returns {boolean} result - true if protocol is http(s), false if not
     *
     * @private
     * @since 1.73.0
     */
    WindowUtils.hasInvalidProtocol = function (URL) {
        // IE 11 does not support URL objects (new URL(URLString)). To achieve a similar result we make use of the browsers built in parser
        var oURL = document.createElement("a");
        oURL.setAttribute("href", URL);
        if (oURL.protocol === "javascript:") { // eslint-disable-line no-script-url
            return true;
        }
        return false;
    };

    /**
     * Checks if the given urls origin is different from our own.
     *
     * Note that this is just a wrapper function around a UI5 internal util to make it easily testable
     *
     * @param {string} url The URL to be checked
     * @returns {boolean} result - true if cross origin was detected
     *
     * @private
     * @since 1.85.0
     */
    WindowUtils.isCrossOriginUrl = function (url) {
        return isCrossOriginURL(url);
    };

    /**
     * Opens the provided URL. If "safeMode" parameter is true (default) the URL will be validated beforehand to avoid using non-http(s) protocols
     * See https://developer.mozilla.org/en-US/docs/Web/API/Window/open for detailed parameter descriptions
     *
     * To avoid vulnerabilities the opener is removed for cross-origin navigation
     * Note that window.open does not return a reference to the new window object in case of a cross-origin scenario.
     * Due to this we return a boolean in this case so the caller is aware there was no error.
     *
     * @param {string} URL The URL to be opened
     * @param {string} [windowName] The name of the browsing content of the new window
     * @param {string} [windowFeatures] List of window features. Separated by a comma with NO whitespace. e.g.: "noopener,noreferrer"
     * @param {boolean} [safeMode=true] Determines if only the http(s) protocol is allowed
     * @returns {Window|boolean} The window object of the new tab or a boolean which is set to true if the operation was successful in case of a cross-origin scenario
     *
     * @private
     * @since 1.73.0
     */
    WindowUtils.openURL = function (URL, windowName, windowFeatures, safeMode) {
        var bSafeMode = (safeMode === undefined) ? true : safeMode;
        var bIsCrossOriginUrl = this.isCrossOriginUrl(URL);

        windowFeatures = windowFeatures || "";

        if (bSafeMode && this.hasInvalidProtocol(URL)) {
            Log.fatal("Tried to open a URL with an invalid protocol", null, "sap/ushell/utils/WindowUtils");
            throw new Error("Tried to open a URL with an invalid protocol");
        }

        if (bIsCrossOriginUrl) {
            if (windowFeatures.toLowerCase().indexOf("noopener") === -1) {
                if (windowFeatures !== "") {
                    windowFeatures += ",";
                }
                windowFeatures += "noopener";
            }
            if (windowFeatures.toLowerCase().indexOf("noreferrer") === -1) {
                windowFeatures += ",noreferrer";
            }

            window.open(URL, windowName, windowFeatures);
            return true;
        }

        return window.open(URL, windowName, windowFeatures);
    };

    /**
     * Constructs a lean URL for use with the tiles <a> links in the right-click scenario
     *
     * @param {string} targetURL The target URL
     * @param {string} navigationURL The navigation URL
     * @returns {string} The lean URL
     *
     * @private
     * @since 1.80.0
     */
    WindowUtils.getLeanURL = function (targetURL, navigationURL) {
        var sUrl = targetURL || navigationURL;
        if (this.hasInvalidProtocol(sUrl)) {
            Log.fatal("Tried to construct a lean URL for input containing an invalid protocol", null, "sap/ushell/utils/WindowUtils");
            return "";
        }

        // append appState only in the case when targetURL starts with "#"
        if ((sUrl || "").charAt(0) !== "#") {
            return sUrl;
        }

        var sQuery = window.location.search;
        if (!sQuery) {
            sQuery = "?sap-ushell-config=lean";
        } else if (sQuery.indexOf("sap-ushell-config=") >= -1) { // avoid duplicates: lean FLP opens a link again
            sQuery += "&sap-ushell-config=lean";
        }
        return window.location.origin + window.location.pathname + sQuery + sUrl;
    };

    /**
     * Prepare the new query string which contains the parameter from url and also
     * parameters from aUrlParams
     *
     * For example,
     * current query string in browser: sap-client=010&sap-language=DE
     * aUrlParam = [{sap-language: "EN"}, {sap-theme: "sap_horizon"}]
     *
     * Result: sap-client=010&sap-language=EN&sap-theme=sap_horizon
     *
     * @param {string} sCurrentUrlSearch The current URL's search string
     * @param {string[]} aAdditionalUrlParams Array of objects with url parameters and their value which should be added to the url
     * @param {string[]} aObsoleteUrlParams Array with url parameters (strings) which should be removed from the url
     *
     * @returns {string} new query string. Either with leading "?" or empty string.
     * @private
     * @since 1.86.0
     */
    WindowUtils._adjustQueryString = function (sCurrentUrlSearch, aAdditionalUrlParams, aObsoleteUrlParams) {
        if ((!aAdditionalUrlParams || aAdditionalUrlParams.length === 0) && (!aObsoleteUrlParams || aObsoleteUrlParams.length === 0)) {
            // No change required
            return sCurrentUrlSearch;
        }

        var oOriginUriParameters = new URLSearchParams(sCurrentUrlSearch);
        // Take all existing params and remove the ones listed in "additional params" - they are added again in a moment with new value
        var oNewUrlParameter = Array.from(oOriginUriParameters.keys()).reduce(function (oResult, sParam) {
            oResult[sParam] = oOriginUriParameters.getAll(sParam);
            return oResult;
        }, {});

        // Add additional URL params
        if (aAdditionalUrlParams && aAdditionalUrlParams.length > 0) {
            aAdditionalUrlParams.forEach(function (oParam) {
                var sParamName = Object.keys(oParam)[0];
                if (sParamName) {
                    oNewUrlParameter[sParamName] = oParam[sParamName];
                }
            });
        }

        // Remove obsolete URL params
        if (aObsoleteUrlParams && aObsoleteUrlParams.length > 0) {
            aObsoleteUrlParams.forEach(function (sParam) {
                delete oNewUrlParameter[sParam];
            });
        }
        const sParamString = ushellUtils.urlParametersToString(oNewUrlParameter);
        return sParamString !== "" ? "?" + sParamString : "";
    };

    /**
     * Triggers a refresh to the current intent
     *
     * @param {string[]} aAdditionalUrlParams url parameters which should be added to the url
     * @param {string[]} aObsoleteUrlParams url parameters which should be removed from the url
     *
     * @private
     * @since 1.86.0
     */
    WindowUtils.refreshBrowser = function (aAdditionalUrlParams, aObsoleteUrlParams) {
        var sHref = ushellUtils.getLocationHref();
        var sLocationSearch = ushellUtils.getLocationSearch();
        var sNewLocationSearch = WindowUtils._adjustQueryString(sLocationSearch, aAdditionalUrlParams, aObsoleteUrlParams);

        if (sLocationSearch === sNewLocationSearch) {
            ushellUtils.windowLocationReload();
        } else {
            const sNewHref = sHref.replace(sLocationSearch, sNewLocationSearch);
            ushellUtils.windowLocationAssign(sNewHref);
        }
    };

    /**
    * Clears the `sap-usercontext` cookie set by the SAP NetWeaver ABAP front-end server
    *
    * - The `sap-usercontext` cookie is on path `/`.
    * - It's used by the ICF system login on the SAP NetWeaver ABAP front-end
    *   server to cache the current ABAP language and the current client.
    * - When an FLP user changes their language and the FLP is restarted, then
    *   this cache is to be invalidated. This triggers the reevaluation of the
    *   language context with the next login as needed.
    *
    * @private
    * @since 1.126.0
    */
    WindowUtils.clearSapUserContextCookie = function () {
        window.document.cookie = "sap-usercontext=;Path=/;Max-Age=-1";
    };

    return WindowUtils;
});

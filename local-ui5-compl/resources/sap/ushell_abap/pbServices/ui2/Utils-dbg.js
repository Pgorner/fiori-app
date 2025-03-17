// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* eslint-disable no-console */

/**
 * @fileOverview This file contains miscellaneous utility functions.
 */


sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/base/Log",
    "sap/ushell_abap/pbServices/ui2/Error",
    "sap/ui/Device"
], function (
    URI,
    Log,
    SrvcError,
    Device
) {
    "use strict";



    var Utils = function () { };

    // ensure that Function.prototype.bind is available, even with iOS 5
    // utils.js is used with startup service, shell API and page building services
    if (!Function.prototype.bind) {
        /**
         * Replacement for ECMAScript 5 feature which might still be missing.
         *
         * @param {object} oThis
         *  The value to be passed as the <code>this</code> parameter to the target
         *  function when the bound function is called. The value is ignored if the
         *  bound function is constructed using the <code>new</code> operator.
         * @param {...object} aVarArgs
         *  Arguments to prepend to arguments provided to the bound function when
         *  invoking the target function.
         * @returns {function}
         *  A function with the bound arguments aVarArgs
         *
         * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind">bind in ECMAScript 5</a>
         */
        Function.prototype.bind = function (oThis) {
            /* eslint-enable no-extend-native */
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                that = this,
                NOP = function () { /* no-op c'tor */ },
                fBound = function () {
                    return that.apply(
                        // passing "window" as "this" has been removed (cf. "use strict";)
                        this instanceof NOP ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments))
                    );
                };
            NOP.prototype = this.prototype;
            fBound.prototype = new NOP();
            return fBound;
        };
    }

    // cache for GET requests
    var oCache;

    // "private static" methods **************************************************

    /**
     * Makes the given relative URL absolute. URLs containing host and/or protocol
     * and URLs with an absolute path remain unchanged. The URL is in no way
     * normalized; the function simply cuts off the file name from the base and
     * appends the relative URL.
     *
     * @param {string} sUrl
     *   the (possibly server-relative) URL
     * @param {string} [sBase=location.href]
     *   the base URL; it <b>must</b> at least be server-absolute
     * @returns {string}
     *   the absolute URL
     * @since 1.2.0
     */
    Utils.absoluteUrl = function (sUrl, sBase) {
        /*jslint regexp: true */

        // default base is the page location
        sBase = sBase || location.href;
        // base must be absolute
        if (sBase.indexOf("://") < 0 && sBase.charAt(0) !== "/") {
            throw new SrvcError("Illegal base URL: " + sBase);
        }
        // do not change empty or absolute URL
        if (!sUrl || sUrl.indexOf("://") >= 0 || sUrl.charAt(0) === "/") {
            return Utils.addCacheBusterTokenUsingUshellConfig(sUrl);
        }
        if (sBase.search(/^([^:]*:)?\/\/[^/]+$/) < 0) {
            // not a pure server URL -> cut off the file name
            sBase = sBase.replace(/\/[^/]*$/, "");
        }
        // append the relative path
        return Utils.addCacheBusterTokenUsingUshellConfig(sBase + "/" + sUrl);
    };

    /**
     * Calls the given success handler (a)synchronously. Errors thrown in the success handler are
     * caught and the error message is reported to the error handler; if an error stack is
     * available, it is logged.
     *
     * @param {function} fnSuccess
     *   no-args success handler
     * @param {function(string)} [fnFailure]
     *   error handler, taking an error message; MUST NOT throw any error itself!
     * @param {boolean} [bAsync=false]
     *   whether the call shall be asynchronously
     * @since 1.2.0
     */
    Utils.callHandler = function (fnSuccess, fnFailure, bAsync) {
        // see also redundant declaration in sap.ushell.utils.call which has to be in sync
        var sMessage;

        if (bAsync) {
            setTimeout(function () {
                Utils.callHandler(fnSuccess, fnFailure, false);
            }, 0);
            return;
        }

        try {
            fnSuccess();
        } catch (e) {
            sMessage = e.message || e.toString();
            Log.error("Call to success handler failed: " + sMessage,
                e.stack);
            if (fnFailure) {
                fnFailure(sMessage);
            }
        }
    };

    /**
     * GETs the given URL (as XML if indicated) and hands it to the given
     * success handler. As this is a root cause for asynchronous behaviour,
     * special precautions are taken: errors thrown in the success handler are
     * caught and reported to the error handler!
     *
     * @param {string} sUrl
     *   URL for GET request
     * @param {boolean} bXml
     *   whether the handler expects XML instead of plain text
     * @param {function(*)} fnSuccess
     *   success handler, taking a DOM document or text string
     * @param {function(string, string)} fnFailure
     *   error handler, taking an error message and (if http status is not OK) the GET response as
     *   text; MUST NOT throw any error itself!
     * @param {object} [oXHR]
     *   the XMLHttpRequest object which may be predefined (e.g. by setting request headers). If
     *   <code>undefined</code>, a new XMLHttpRequest object is created.
     * @param {boolean} [bCache]
     *   whether the response is cached for further calls (since 1.8.1). XML responses cannot be
     *   cached. An Error is thrown if both <code>bXml</code> and
     *   <code>bCache</code> are set to <code>true</code>.
     * @since 1.2.0
     */
    Utils.get = function (sUrl, bXml, fnSuccess, fnFailure, oXHR, bCache) {
        if (typeof fnSuccess !== "function") {
            throw new SrvcError("Missing success handler");
        }
        if (typeof fnFailure !== "function") {
            throw new SrvcError("Missing error handler");
        }
        if (bXml && bCache) {
            throw new SrvcError("Caching of XML responses not supported");
        }
        if (typeof Utils.addCacheBusterTokenUsingUshellConfig === "function") {
            sUrl = Utils.addCacheBusterTokenUsingUshellConfig(sUrl);
        }
        oXHR = oXHR || new XMLHttpRequest();

        /**
         * @private
         */
        oXHR.onreadystatechange = function () {
            var oResult, oXml;
            // Note: "this" refers to oXHR according to W3C
            if (this.readyState !== /*DONE*/4) {
                return; // not yet DONE
            }
            if (this.status !== /*OK*/200) {
                // HTTP status not OK
                Log.error("Error " + this.status + " in response for URL " + sUrl,
                    null);
                fnFailure(sUrl + ": " + this.status + " " + this.statusText, this.responseText);
                return;
            }

            Log.debug("Received response for URL " + sUrl, null);
            if (bXml) {
                oXml = this.responseXML;
                if (oXml === null || !oXml.documentElement) {
                    // in FF it is null, in IE it is a document with only an error message
                    fnFailure(sUrl + ": no valid XML");
                    return;
                }
                oResult = oXml;
            } else {
                oResult = this.responseText;
                if (bCache) {
                    oCache.put(sUrl, oResult);
                }
            }
            Utils.callHandler(fnSuccess.bind(null, oResult), fnFailure);
        };

        if (!bXml && oCache.containsKey(sUrl)) {
            Log.debug("Return cached response for URL " + sUrl, null);
            Utils.callHandler(fnSuccess.bind(null, oCache.get(sUrl)), fnFailure);
        } else {
            try {
                // Given that the XHR request could be provided as a parameter, we must
                // check that this was not already opened before calling open. One
                // reason this could happen is header settings. Only after opening the
                // request headers can be set. Calling open again will cause the
                // previous request to be aborted (i.e., headers loss).
                if (oXHR.readyState < XMLHttpRequest.OPENED) { // keep working on the opened request
                    oXHR.open("GET", sUrl, /*asynchronously*/true);
                } else {
                    Log.debug("XHR Request was already opened for " + sUrl, null);
                }
                oXHR.send();
                Log.debug("Sent request to URL " + sUrl, null);
            } catch (e) {
                Log.error("Error '" + (e.message || e) + "' in request to URL " + sUrl,
                    null);
                throw e;
            }
        }
    };

    /**
     * Gets an URL and adds the given cache buster token to it if no other token is already
     * contained. In case the URL is no valid URL the token is not added.
     *
     * @param {string} sUrl
     *  e.g. "/sap/bc/ui5_ui5/application/path"
     *  URL to be changed
     * @param {RegExp} oPattern
     *  e.g /^\/sap\/bc\/ui5_ui5\//
     *  RegExp to determine if sUrl matches and needs to be extended by the cache buster token
     *  sToken
     * @param {string} sReplacement
     *  e.g. "/sap/bc/ui5_ui5/[CacheBusterToken]/"
     *  The part of sUrl matched by oPattern will be exchanged by this. Before that is done sToken
     *  is inserted in sReplacement at the position indicated by [CacheBusterToken]
     *  The replacement may refer to capture groups of oPattern
     * @param {string} sToken
     *  e.g. "~201412132350000~"
     *  token to be inserted in sUrl. It will be inserted as indicated in the final constructed URL!
     * @returns {string}
     *  - if sUrl did not matched oPattern: unchanged sUrl
     *  - if sUrl matched oPattern: sUrl enhanced with sToken,
     *         e.g. "/sap/bc/ui5_ui5/~201412132350000~/application/path"
     *
     * @private
     */
    Utils.addCacheBusterToken = function (sUrl, oPattern, sReplacement, sToken) {
        if (oPattern.test(sUrl)) { //url matches the pattern
            sUrl = sUrl.replace(oPattern, sReplacement);
            //replace the token placeholder globally in the final url (!)
            // (also allow the token to be added elsewhere)
            sUrl = sUrl.replace(/\[CacheBusterToken\]/g, sToken);
        }
        return sUrl;
    };

    /**
     * Removes a cache buster token (if available) of an Url and normalizes the url afterwards
     * @param {string} sUrl
     *  the URL to be normalized
     * @returns {string}
     *   normalized url (without a cache buster token)
     * @since 1.28.1
     *
     * @private
     */
    Utils.removeCBAndNormalizeUrl = function (sUrl) {
        var aMatches,
            sUrlPrefix,
            sCacheBusterSegment,
            sUrlPostfix;

        if (typeof sUrl !== "string" || sUrl === "" || isUriWithRelativeOrEmptyPath(sUrl)) {
            return sUrl;
        }

        function isUriWithRelativeOrEmptyPath (sUrl0) {
            var oUri = new URI(sUrl0),
                sPath = oUri.path();

            if (oUri.is("absolute")) {
                return false;
            }

            if (sPath && sPath.charAt(0) === "/") {
                return false;
            }

            return true;
        }

        // split up the URL into 3 parts: prefix, cache-buster segment, postfix
        // leading slashes are always part of the segment, the postfix might have a trailing slash
        aMatches = sUrl.match(/(.*)(\/~[\w-]+~[A-Z0-9]?)(.*)/);
        if (aMatches) {
            sUrlPrefix = aMatches[1];
            sCacheBusterSegment = aMatches[2];
            sUrlPostfix = aMatches[3];
        }

        function normalizePath (sUrl0) {
            return new URI(sUrl0).normalizePathname().toString();
        }

        function isRelativePathWithDotSegmentsThatGoOutside (sPath) {
            var aSegments = new URI(sPath).segment(),
                i,
                iPos = 0;

            for (i = 0; i < aSegments.length && iPos >= 0; i += 1) {
                if (aSegments[i] === "..") {
                    iPos = iPos - 1;
                } else {
                    iPos = iPos + 1;
                }
            }

            return iPos < 0;
        }

        // check if URL contains a cache-buster token
        if (sCacheBusterSegment) {
            // check if removal of cache-buster token is required
            if (sUrlPostfix && isRelativePathWithDotSegmentsThatGoOutside(sUrlPostfix)) {
                // remove the cache-buster token
                sUrl = sUrlPrefix + sUrlPostfix;
            }
        }

        // always normalize the URL path
        return normalizePath(sUrl);
    };

    /**
     * Gets an URL and adds the given cache buster token to it if no other token is already
     * contained. The rules to be applied are coming from the ushell configuration:
     *  sap-ushell-config.cacheBusting.patterns
     * The rules are applied by there order property (lowest first) and the modified URL is returned
     * as soon as the first rule matched.
     * <p>
     * If the query parameter <code>sap-ushell-nocb</code> is set to <code>true</code> or <code>X</code>,
     * no cache buster tokens are added and existing cache buster tokens are removed from the specified URL.
     *
     * @param {string} sUrl
     *  e.g. "/sap/bc/ui5_ui5/application/path"
     *  URL to be changed
     * @returns {string}
     *  - if sUrl already contained a cache buster token (e.g. ~00000~): unchanged sUrl
     *  - if sUrl did not match any pattern: unchanged sUrl
     *  - if sUrl matched pattern: sUrl enhanced with sToken,
     *         e.g. "/sap/bc/ui5_ui5/~201412132350000~/application/path"
     *  - if the modified sUrl (normalized and cache buster token was removed)
     *    is found as an attribute of the config
     *    (window["sap-ushell-config"].cacheBusting.urls),
     *    the cache buster token which is defined as the value of this attribute
     *    is going to be returned.
     *
     * @private
     */
    Utils.addCacheBusterTokenUsingUshellConfig = function (sUrl) {
        //TODO move to sap.ushell.utils
        var oCacheBusting = window["sap-ushell-config"] &&
            window["sap-ushell-config"].cacheBusting,
            oPatterns = oCacheBusting && oCacheBusting.patterns,
            sCacheBusterUrl = sUrl,
            aParameterMap = [],
            sSapUshellNoCb,
            aRules = [];

        aParameterMap = Utils.getParameterMap();
        sSapUshellNoCb = aParameterMap["sap-ushell-nocb"] && aParameterMap["sap-ushell-nocb"][0];

        // When URL disables Cache Busting return URL without cache busting token
        // It can happen that we get a URL which already has a cache-buster token included (from the ABAP server), so we also remove
        // an existing token here (this implementation is simpler than passing the URL parameter to the resolveLink service and evaluate it there)
        if ((sSapUshellNoCb === "true" || sSapUshellNoCb === "X") && typeof sUrl === "string") {
            sUrl = sUrl.replace(/\/~[\w-]+~[A-Z0-9]?/, "");
            return sUrl;
        }

        // don't continue if the string is empty or a token is already present,
        // either as path segment (e.g.: /~0123_-Abc~/) or as query parameter
        // /e.g. ?cb=~xxxxxx~
        // also consider URLs with query parameters and fragments
        // this case happens during navigation, because this method is both called from
        // NavTargetResolutionInternal service as well as from the stubbed jQuery.sap.registerModulePath method
        //
        // syntax for application cache-buster contains now an additional scope qualifier that can be
        // either empty, "R" for resource, "5" for UI5 app, "W" for web app and "C"  for custom
        // see ABAP class /UI5/CL_UI5_APP_HTTP_HANDLER for details
        if (!oCacheBusting
            || typeof sUrl !== "string"
            || sUrl === ""
            || /[/=]~[\w-]+~[A-Z0-9]?[/#?&]/.test(sUrl) // matches intermediate segment with cb-token; consider URLs with query string or fragment
            || /[/=]~[\w-]+~[A-Z0-9]?$/.test(sUrl)) { // matches last segment with cb-token (no trailing slash or further parameters)
            return sUrl;
        }

        if (oCacheBusting && oCacheBusting.urls) {
            // Removing the last slash of the input url
            if (sUrl.charAt(sUrl.length - 1) === "/") {
                sUrl = sUrl.substr(0, sUrl.length - 1);
            }
            // Config contains the modified url (without a slash at the end)
            if (oCacheBusting.urls.hasOwnProperty(sUrl)) {
                return sUrl + "/" + oCacheBusting.urls[sUrl].cacheBusterToken;
            }
            // Config contains the modified url (having a slash at the end)
            if (oCacheBusting.urls.hasOwnProperty(sUrl + "/")) {
                return sUrl + "/" + oCacheBusting.urls[sUrl + "/"].cacheBusterToken;
            }
        }

        if (!oPatterns) {
            return sUrl;
        }

        // put rules in aRules and sort them by oRule.order
        Object.keys(oPatterns).forEach(function (sPattern) {
            if (oPatterns.hasOwnProperty(sPattern)) {
                var oRule = oPatterns[sPattern];
                // the property name is the pattern to be used, copy it to the object itself for later
                oRule.pattern = new RegExp(sPattern);
                aRules.push(oRule);
            }
        });
        aRules.sort(function (oRule1, oRule2) { return oRule1.order - oRule2.order; });

        // apply rules
        aRules.every(function (oRule) { // use every to be able to break
            if (oRule.pattern.test(sUrl)) {
                if (!oRule.cacheBusterToken) {
                    oRule.cacheBusterToken = oCacheBusting.cacheBusterToken;
                }

                //url matches the pattern, note that this is not redundant
                //one can define patterns without a replacement to match and end the matching process!
                sCacheBusterUrl = Utils.addCacheBusterToken(sUrl, oRule.pattern, oRule.replacement,
                    oRule.cacheBusterToken);
                // break as soon as first rule matches (irrespective of alteration)
                return false;
            }
            return true;
        });

        return sCacheBusterUrl;
    };

    /**
     * Clear cache for GET requests.
     *
     * @since 1.8.1
     */
    Utils.clearCache = function () {
        oCache = new Utils.Map();
    };

    /**
     * Gets the device's form factor. Based on <code>sap.ui.Device.system</code> from SAPUI5.
     * @returns {string}
     *   the device's form factor ("desktop", "tablet" or "phone")
     * @since 1.19.1
     */
    Utils.getFormFactor = function () {
        // see also redundant declaration in sap.ushell.utils.getFormFactor which has to be in sync

        if (Device.system.desktop) {
            return Device.system.SYSTEMTYPE.DESKTOP;
        }
        if (Device.system.tablet) {
            return Device.system.SYSTEMTYPE.TABLET;
        }
        if (Device.system.phone) {
            return Device.system.SYSTEMTYPE.PHONE;
        }
    };

    /**
     * Returns a map of all search parameters present in the given search string
     * or this window's current URL. To be precise, <code>location.search</code>
     * is used as a default and any given search string must use the same syntax
     * (start with a "?" and not include a "#").
     *
     * @param {string} [sSearchString=location.search]
     *   search string starting with a "?" (unless empty) and not including a "#"
     * @returns {object}
     *   a <code>map&lt;string, string[]></code> from key to array of values
     * @since 1.2.0
     *
     * @see <a href="http://java.sun.com/javaee/5/docs/api/javax/servlet/ServletRequest.html#getParameterMap()">
     * javax.servlet.ServletRequest#getParameterMap()</a>
     */
    Utils.getParameterMap = function (sSearchString) {
        var i;
        var n;
        var mResult = {};
        var sKey;
        var sValue;
        var iIndexOfEquals;
        var aKeyValuePairs;
        var aKeyValuePairsLength;
            // Note: location.search starts with "?" if not empty
        var sSearch = arguments.length > 0 ? sSearchString : location.search;

        if (sSearch && sSearch.charAt(0) !== "?") {
            throw new SrvcError("Illegal search string " + sSearch);
        }
        if (!sSearch || sSearch === "?") {
            return {}; // Note: split("") would return [""]
        }

        // Note: W3C recommends that servers support ";" as well as "&"
        //       (http://www.w3.org/TR/1999/REC-html401-19991224/appendix/notes.html#h-B.2.2)
        // http://unixpapa.com/js/querystring.html advocates this on the client-side also!
        aKeyValuePairs = sSearch.substring(1).replace(/\+/g, " ").split(/[&;]/);
        aKeyValuePairsLength = aKeyValuePairs.length < 500 ? aKeyValuePairs.length : 500;

        for (i = 0, n = aKeyValuePairsLength; i < n; i += 1) {
            // decode key/value pair at first "=" character
            sKey = aKeyValuePairs[i];
            sValue = ""; // Note: empty value may be omitted altogether
            iIndexOfEquals = sKey.indexOf("=");
            if (iIndexOfEquals >= 0) {
                sValue = sKey.slice(iIndexOfEquals + 1);
                sValue = decodeURIComponent(sValue);
                sKey = sKey.slice(0, iIndexOfEquals);
            }
            sKey = decodeURIComponent(sKey);

            // map key to value(s)
            // Note: beware of inherited functions!
            if (!Object.prototype.hasOwnProperty.call(mResult, sKey)) {
                mResult[sKey] = [];
            }
            mResult[sKey].push(sValue);
        }

        return mResult;
    };

    /**
     * Returns the value of the given URL's GET parameter with the given name, properly decoded.
     * Returns "" if no such parameter can be found.
     *
     * @param {string} sUrl
     *   any URL
     * @param {string} sName
     *   the name of the GET parameter we are looking for
     * @returns {string}
     *   the parameter value, properly decoded
     *
     * @private
     * @since 1.17.0
     */
    Utils.getParameterValue = function (sUrl, sName) {
        var oParameterMap, iQueryIndex;

        if (typeof sName !== "string") {
            // avoid surprises when sName would later be converted into a string
            throw new SrvcError("Missing parameter name");
        }

        sUrl = sUrl.split("#")[0];
        iQueryIndex = sUrl.indexOf("?");
        if (iQueryIndex >= 0) {
            oParameterMap = Utils.getParameterMap(sUrl.slice(iQueryIndex));
            if (oParameterMap[sName]) {
                return oParameterMap[sName][0];
            }
        }
        return "";
    };

    /**
     * Tells whether the given value is an array.
     *
     * @param {object} o
     *   any value
     * @returns {boolean}
     *   <code>true</code> if and only if the given value is an array
     * @since 1.2.0
     */
    Utils.isArray = function (o) {
        // see Crockford page 61
        return Object.prototype.toString.apply(o) === "[object Array]";
    };
    /**
     * Tells whether the given value is a string.
     *
     * @param {object} o
     *   any value
     * @returns {boolean}
     *   <code>true</code> if and only if the given value is a string
     * @since 1.50.1
     */
    Utils.isString = function name (o) {
        return /String/.test(Object.prototype.toString.call(o));
    };

    /**
     * Parses the given XML string and returns it as a document.
     *
     * @param {string} sXml
     *   the XML
     * @returns {DOMDocument}
     *   a DOM document, or <code>null</code> in case of missing or empty XML string
     * @throws {Error}
     *   in case of invalid XML string
     * @since 1.2.0
     */
    Utils.parseXml = function (sXml) {
        var oXml;
        if (!sXml || typeof sXml !== "string") {
            return null;
        }
        oXml = new DOMParser().parseFromString(sXml, "text/xml");
        if (oXml.getElementsByTagName("parsererror").length) { // Chrome, Firefox
            throw new SrvcError("Invalid XML: " + sXml);
        }
        return oXml;
    };

    /**
     * Serves as a marker for functions that are to be exposed in QUnit tests. Calls to this function
     * are expected to be placed directly before the named function declaration (even <b>after</b>
     * the JSDoc). The function itself does nothing.
     *
     * @param {object} o
     *   the object to which this function will be attached in tests; must not be <code>this</code>
     *   (use <code>that</code> instead)
     * @since 1.3.0
     */

    // "public classes" **********************************************************

    /**
     * Creates an empty map. It is used for mapping from arbitrary string(!) keys (including "get" or
     * "hasOwnProperty") to values of any type.
     * @class
     * @since 1.5.0
     */
    Utils.Map = function () {
        this.entries = {};
    };

    /**
     * Associates the specified value with the specified key in this map. If the map previously
     * contained a mapping for the key, the old value is replaced by the specified value. Returns
     * the old value. Note: It might be a good idea to assert that the old value is
     * <code>undefined</code> in case you expect your keys to be unique.
     *
     * @param {string} sKey
     *   key with which the specified value is to be associated
     * @param {any} vValue
     *   value to be associated with the specified key
     * @returns {any}
     *   the old value
     * @since 1.5.0
     */
    Utils.Map.prototype.put = function (sKey, vValue) {
        var vOldValue = this.get(sKey);
        this.entries[sKey] = vValue;
        return vOldValue;
    };

    /**
     * Returns <tt>true</tt> if this map contains a mapping for the specified key.
     *
     * @param {string} sKey
     *   key whose presence in this map is to be tested
     * @returns {boolean}
     *   <tt>true</tt> if this map contains a mapping for the specified key
     * @since 1.5.0
     */
    Utils.Map.prototype.containsKey = function (sKey) {
        if (typeof sKey !== "string") {
            throw new SrvcError("Not a string key: " + sKey);
        }
        return Object.prototype.hasOwnProperty.call(this.entries, sKey);
    };

    /**
     * Returns the value to which the specified key is mapped, or <code>undefined</code> if this map
     * contains no mapping for the key.
     * @param {string} sKey
     *   the key whose associated value is to be returned
     * @returns {any}
     *   the value to which the specified key is mapped, or <code>undefined</code> if this map
     *   contains no mapping for the key
     * @since 1.5.0
     */
    Utils.Map.prototype.get = function (sKey) {
        if (this.containsKey(sKey)) {
            return this.entries[sKey];
        }
        return undefined;
    };

    /**
     * Returns an array of this map's keys. This array is a snapshot of the map; concurrent
     * modifications of the map while iterating do not influence the sequence.
     * @returns {string[]}
     *   this map's keys
     * @since 1.5.0
     */
    Utils.Map.prototype.keys = function () {
        return Object.keys(this.entries);
    };

    /**
     * Removes a key together with its value from the map.
     * @param {string} sKey
     *  the map's key to be removed
     * @since 1.11.0
     */
    Utils.Map.prototype.remove = function (sKey) {
        delete this.entries[sKey];
    };

    /**
     * Returns this map's string representation.
     *
     * @returns {string}
     *   this map's string representation
     * @since 1.5.0
     */
    Utils.Map.prototype.toString = function () {
        var aResult = ["Map("];
        aResult.push(JSON.stringify(this.entries));
        aResult.push(")");
        return aResult.join("");
    };

    // initialize the cache for GET
    Utils.clearCache();

    return Utils;
});

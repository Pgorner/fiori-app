// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview URL Parsing shell services
 *
 * URL Parsing services for shell compliant hashes
 *
 * [ SO-Action~[Context]]
 * [ ? [A=B(&C=D)+]
 * &/
 *
 * The parsing functions are deliberately restrictive and fragile, only shell compliant hashes are parsed correctly,
 * invalid or completely empty results ( not silently ignored parts) are returned if the hash is not deemed parsable
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/base/Object",
    "sap/ushell/utils",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/Container"
], function (
    Log,
    BaseObject,
    utils,
    UrlParsingUtil,
    Container
) {
    "use strict";

    // usage : sap.ushell.Container.getServiceAsync("URLParsing").then(function (URLParsing) {
    //             URLParsing.parseShellHash();
    //         });
    //         etc.

    /**
     * @alias sap.ushell.services.URLParsing
     * @class
     * @classdesc The Unified Shell's internal URL parsing service (platform independent).
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const URLParsing = await Container.getServiceAsync("URLParsing");
     *     // do something with the URLParsing service
     *   });
     * </pre>
     *
     * Methods in this class allow to break down a shell compliant hash into it's respective parts
     * (SemanticObject,Action,Context, Parameters, appSpecificHash) or (ShellPart,appSpecificHash) respectively
     * or construct a hash from its constituents.
     *
     * All methods deal with the *internal* shellHash format.
     *
     * Most of the parse methods are robust w.r.t. a leading "#".
     *
     * Note: The functions were designed with a "truthy" behavior for not present values,
     * Thus a client should not rely on the difference between null, "undefined", "" when testing for the result of a parse action.
     *
     * The parsing functions are deliberately restrictive and fragile, only shell compliant hashes are parsed correctly,
     * behavior for non-compliant hashes is undefined and subject to change,
     * notably we do not aim do "degrade" nicely or support partial parsing of corrupted urls.
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.15.0
     * @public
     */
    function URLParsing () {
        /**
         * Extract the Shell hash# part from an URL
         * The application specific route part is removed
         * See {@link #getHash} for a function which retains the app specific route.
         *
         * Shell services shall use this service to extract relevant parts of an URL from an actual URL string
         * (which should be treated as opaque)
         * <p>
         * The URL has to comply with the Fiori-Wave 2 agreed upon format
         * <p>
         * This service shall be used to extract a hash part from an url.
         * The result can be further broken up by parseShellHash
         *
         * Examples<p>
         * http://a.b.c?defhij#SemanticObject-Action~Context?PV1=A&PV2=B&/appspecific
         * <br/>
         * returns : "#SemanticObject-Action~Context?PV1=A&PV2=B&/appspecific"
         *
         * Note: the results when passing an illegal (non-compliant) url are undefined and subject to change w.o. notice.
         * Notably further checks may added.
         * The design is deliberately restrictive and non-robust.
         *
         * @param {sap.ui.core.URI} sShellHashString a valid (Shell) url, e.g. <br/>
         *   <code>http://xx.b.c#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH</code>
         * @returns {sap.ushell.services.Navigation.TargetIntent} the parsed result
         *
         * @since 1.16.0
         * @public
         */
        this.getShellHash = function (sShellHashString) {
            return UrlParsingUtil.getShellHash(sShellHashString);
        };

        /**
         * Extract a hash part from an URL, including an app-specific part
         *
         * @param {string} sURL any value
         * @returns {string} <code>extracted string</code> if and only if a hash is present, undefined otherwise
         *
         * @since 1.16.0
         * @public
         */
        this.getHash = function (sURL) {
            return UrlParsingUtil.getHash(sURL);
        };

        /**
         * Check if a URL has an intent based navigation part which can be parsed into a semantic object and action part.
         * Accepts only a relative URL (must contain #) or fully qualified Urls for which
         * origin and filename must correspond to the running launchpad.
         *
         * Given actual url
         * <code>http://www.mycorp.com/sap/fiori/FioriLaunchpad.html?sap-language=DE#SO-action?P1=value1</code>, the following parts
         * <code>http://www.mycorp.com/sap/fiori/FioriLaunchpad.html</code> must match.
         *
         * The actual test is synchronous and *only* tests whether the hash part can be parsed and contains a semantic object and action.
         * It does not test whether the intent or its parameters are valid for a given user
         *
         * @param {string} sUrl the URL to test. Note: this url must be in internal format.
         * @returns {boolean} true if the conditions are fulfilled.
         *
         * @since 1.30.0
         * @public
         * @deprecated since 1.96. Please use {@link #isIntentUrlAsync} instead.
         */
        this.isIntentUrl = function (sUrl) {
            Log.error("Deprecated API call of 'sap.ushell.URLParsing.isIntentUrl'. Please use 'isIntentUrlAsync' instead",
                null,
                "sap.ushell.services.URLParsing"
            );

            return UrlParsingUtil.isIntentUrl(sUrl);
        };

        /**
         * Check if a URL has an intent based navigation part which can be parsed into a semantic object and action part.
         * Accepts only a relative URL (must contain #) or fully qualified Urls for which
         * origin and filename must correspond to the running launchpad.
         *
         * Given actual url
         * <code>http://www.mycorp.com/sap/fiori/FioriLaunchpad.html?sap-language=DE#SO-action?P1=value1</code>, the following parts
         * <code>http://www.mycorp.com/sap/fiori/FioriLaunchpad.html</code> must match.
         *
         * This function *only* tests whether the hash part can be parsed and contains a semantic object and action.
         * It does not test whether the intent or its parameters are valid for a given user
         *
         * @param {string} sUrl the URL to test. Note: this url must be in internal format.
         * @returns {Promise<boolean>} true if the conditions are fulfilled.
         *
         * @since 1.96.0
         * @public
         */
        this.isIntentUrlAsync = function (sUrl) {
            return UrlParsingUtil.isIntentUrlAsync(sUrl);
        };

        /**
         * @typedef {string|int} sap.ushell.services.URLParsing.URLValue
         * Type for Url value
         * @since 1.120.0
         * @public
         */

        /**
         * This method parses parameters from a URI query string (starting with ?)
         *  and puts the result into a parameter object.
         *
         * @param {sap.ui.core.URI} sParams Parameter string, e.g. <code>?ABC=1&ABC=1%202&DEF=4</code>
         * @returns {Object<string, sap.ushell.services.URLParsing.URLValue[]>} The parsed parameters, e.g. { ABC : ["1", "1 2"], DEF : ["4"]}.
         *
         * @since 1.20.0
         * @public
         */
        this.parseParameters = function (sParams) {
            return UrlParsingUtil.parseParameters(sParams);
        };

        /**
         *
         * combine members of a javascript object into a parameter string,
         * note that parameters are ordered in an arbitrary manner which is subject to change
         *
         * @param {Object<string, sap.ushell.services.URLParsing.URLValue[]>} oParams The parameters to combine into the parameter String, e.g. <code>{ ABC : [1,"1 2"], DEF : ["4"]}</code>
         * @returns {sap.ui.core.URI} * @returns {sap.ui.core.URI} The parameter string, e.g. <code>ABC=1&ABC=1%202&DEF=4</code>.
         *   Note that the result is *not* prefixed with a "?", parameter values are encodeURIComponent encoded.
         *
         * @since 1.20.0
         * @public
         */
        this.paramsToString = function (oParams) {
            return UrlParsingUtil.paramsToString(oParams);
        };

        /**
         * Removes parameters with empty values from it.
         *
         * Parameters with "no" value are expressed as an array with empty string, e.g. {sap-system: [""]}.
         * This is used to express that a parameter is present, but has no value.
         * This function removes such parameters from the object. Thus the object is modified in place.
         * Note that this is used in the URLTemplateProcessor that expects parameters with "no" value to be expressed as undefined.
         * Combined values, e.g an empty value and a normal value are not changed.

         * @since 1.127.0
         * @param {Object<string, sap.ushell.services.URLParsing.URLValue[]>} oParams The parameter object, e.g. <code>{ ABC : [1,"1 2"], DEF : ["4"]}</code>
         * @param {string[]} aParams The parameter names to remove if they have an empty value
         */
        this.removeParametersWithEmptyValue = function (oParams, aParams) {
            UrlParsingUtil.removeParametersWithEmptyValue(oParams, aParams);
        };

        /**
         * Internal function
         *
         * @param {object} oParams parameter object
         * @param {string} sDelimiter string to use as parameter delimiter (e.g., "&")
         * @param {string} sAssign string to use for parameter assignment (e.g., "=")
         * @returns {string} the result parameters
         *
         * @since 1.34.0
         * @private
         */
        this.privparamsToString = function (oParams, sDelimiter, sAssign) {
            return UrlParsingUtil.privparamsToString(oParams, sDelimiter, sAssign);
        };

        /**
         * @typedef {object} sap.ushell.services.URLParsing.DecomposedHash
         * Type for DecomposedHash
         * @property {string} semanticObject the semantic object
         * @property {string} action the action
         * @property {string} contextRaw the raw context string
         * @property {Object<string, string[]>} params the parameters
         * @property {string} [appStateKey] the app state key
         * @property {string} [appSpecificRoute] the app specific route
         *
         * @since 1.120.0
         * @public
         */

        /**
         * @typedef {object} sap.ushell.services.URLParsing.SimpleDecomposedHash
         * Simple Type for DecomposedHash with shell hash as part of the target property.
         * Use this type for edge cases only. Use {@link sap.ushell.services.URLParsing.DecomposedHash} instead.
         * @property {object} target The target object
         * @property {sap.ushell.services.Navigation.TargetIntent} target.shallHash The shell hash
         *
         * @since 1.124.0
         * @public
         */

        /**
         * Decompose a shell hash into the respective parts
         *
         * @param {sap.ushell.services.Navigation.TargetIntent} sHash Hash part of a shell compliant URL
         *   <code>#SO-Action~Context?P1=a&P2=x&/route?RPV=1</code> the hash part of an URL, <br/>
         *   e.g. <code>"#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH</code>
         * @returns {sap.ushell.services.URLParsing.DecomposedHash} <code>undefined</code> if not a parsable hash<br/>
         *   Note that params always has an Array for each parameter value!
         *
         * @since 1.16.0
         * @public
         */
        this.parseShellHash = function (sHash) {
            return UrlParsingUtil.parseShellHash(sHash);
        };

        /**
         * Internal function
         *
         * @param {string} sHash Shell hash
         * @returns {string} the string without a leading #
         *
         * @since 1.16.0
         * @private
         */
        this.privstripLeadingHash = function (sHash) {
            return UrlParsingUtil.privstripLeadingHash(sHash);
        };

        /**
         * @typedef {object} sap.ushell.services.URLParsing.SplitHash
         * Type for SplitHash
         * @property {sap.ui.core.URI} shellPart the shell part of the hash
         * @property {sap.ui.core.URI} appSpecificRoute the app specific route part of the hash
         * @since 1.120.0
         * @public
         */

        /**
         * split a Unified Shell compliant hash into an Object containing a shell specific part and an app specific parts</br>
         * for non compliant hash strings, the empty object {} is returned.
         * an optional leading # is stripped
         *
         * @param {sap.ushell.services.Navigation.TargetIntent} sHash The hash part of a shell conformant URL.
         *  It has to have the following format:
         *  <code>#SO-Action~Context?P1=a&P2=x&/route?RPV=1<code>
         *  Here is an example for the hash part of an URL:
         *  <code>"#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH<code>
         * @returns {sap.ushell.services.URLParsing.SplitHash}
         *   <code>{}</code>(empty object) if not a parsable hash
         * <pre>
         *   {
         *     shellPart : "Object-name~AFE2==?PV1=PV2&PV4=V5",
         *     appSpecificRoute : "display/detail/7?UU=HH"
         *   }
         * </pre> otherwise
         *   Note that params always has an Array for each parameter value!
         *
         * @since 1.16.0
         * @public
         */
        this.splitHash = function (sHash) {
            return UrlParsingUtil.splitHash(sHash);
        };

        /**
         * compose a shell Hash from it's respective parts
         * Note that it also may append an app specific route!
         *
         * @param {sap.ushell.services.URLParsing.SimpleDecomposedHash|sap.ushell.services.URLParsing.DecomposedHash} [oShellHash] The parts of a shell hash.
         * Its action must be a valid action,
         * It may not contain "?" or directly a parameter string.
         * Note: In general it is preferred to add an appStateKey directly to the params object.
         *
         * @returns {sap.ushell.services.Navigation.TargetIntentStrict} the hash part of an URL, e.g. <code>"Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH</code>
         * Returns an empty string in case no shell hash was provided.
         *
         * @since 1.16.0
         * @public
         */
        this.constructShellHash = function (oShellHash) {
            return UrlParsingUtil.constructShellHash(oShellHash);
        };

        /**
         * Note: deprecated, please use <code>sap.ui.model.odata.ODataUtils.setOrigin(sServiceUrl, { alias : sSystem });</code>
         * Makes the given server-relative SAP OData service URL point to the system given
         * explicitly as parameter <code>vComponentOrSystem</code>.
         * If this parameter is not provided, it makes the server-relative URL point to the system of the current application.
         * <em>Server-relative URL</em> means a URL starting with exactly one &quot;/&quot; (also known as absolute-path URL).
         * The <em>system of the current application</em> is taken from the parameter &quot;sap-system&quot;
         * of the last navigation target resolution result.
         * <p>
         * If either a multiple-origin parameter <code>;mo/</code> or an origin parameter with qualified system
         * (<code>;o=sid(SYS.123)</code> or <code>o=SYSALIAS</code>) is already present, the <code>sServiceUrl</code> is returned unchanged.
         * <p>
         * The framework invokes this function for SAPUI5 applications that have been built using declarative model
         * instantiation with the application descriptor (data source) mechanism or using an sap.ca framework.
         * For these applications, you do not need to invoke this function explicitly in the application code.
         * If the application does not use any of these mechanisms, but explicitly constructs additional OData models or
         * performs OData requests, the application code shall invoke this function.
         * It shall pass its root component instance as <code>vComponentOrSystem</code> -
         * the function will then determine the system from the navigation start-up parameter &quot;sap-system&quot;
         * (<code>getComponentData().startupParameters[&quot;sap-system&quot;][0])</code>.
         * Applications may call this API with parameter <code>vComponentOrSystem</code> and a non-empty string value
         * if application-specific logic is used to determine the target system for service calls.
         * <p>
         * With service URLs converted using this API, administrators can redirect service calls to servers other than the
         * default SAP Gateway and back-end server either via reverse proxy (e.g. SAP Web Dispatcher) configuration or using
         * the system alias functionality of the SAP Gateway server.
         * <p>
         * The system is added to the last URL segment of the service URL with the segment parameter <code>;o=</code>.
         * You can also make this function put the system to a different URL path segment of the service URL by specifying
         * the empty segment parameter <code>;o=</code>, e.g. <code>/sap/opu/odata/MyService;o=/MyEntities/$count?p1=v1</code>.
         * If both <code>vComponentOrSystem</code> is empty and the current application has no system, no system is added
         * and the empty segment parameter <code>;o</code> is removed.<br/>
         *
         * <b>Example 1:</b> <code>/sap/opu/odata/MyService/?p1=v1</code> is converted to
         * <code>/sap/opu/odata/MyService;o=SYS/?p1=v1</code> if the target system is &quot;SYS&quot;.
         * However it remains unchanged if both the current application's system <em>and</em>
         * the parameter <code>vComponentOrSystem</code> are empty.<br/>
         *
         * <b>Example 2:</b> <code>/sap/opu/odata/MyService;o=/MyEntities/$count?p1=v1</code> is converted to
         * <code>/sap/opu/odata/MyService;o=sid(SYS.123)/MyEntities/$count?p1=v1</code> if
         * parameter <code>vComponentOrSystem</code> is set to &quot;sid(SYS.123)&quot;</code>.
         * <p>
         * The URL is in no way normalized.
         *
         * @param {string} sServiceUrl a server-relative URL without system alias information
         * @param {string|sap.ui.core.Component} [vComponentOrSystem] the root component of the FLP application (
         *   <code>getComponentData().startupParameters[&quot;sap-system&quot;][0]</code> is used as system alias if present)
         *   or a string valued system specification like &quot;SYS&quot; or &quot;sid(SYS.123)&quot;
         *   if undefined or falsy the system of the current application is used
         * @returns {string} the service URL pointing to the system specified in parameter <code>vComponentOrSystem</code> or
         *   to the system of the current application
         * @throws Error if the URL is not server-relative (e.g. <code>./something</code>, <code>http://foo.bar/something</code>, ...)
         *
         * @since 1.19.1 (passing an SAPUI5 component instance as second parameter is supported since version 1.32.0)
         * @public
         * @deprecated since 1.31. Please use {@link sap.ui.model.odata.ODataUtils#setOrigin} instead.
         */
        this.addSystemToServiceUrl = function (sServiceUrl, vComponentOrSystem) {
            var sSystem = vComponentOrSystem;

            if (!sServiceUrl || sServiceUrl.indexOf("/") !== 0 || sServiceUrl.indexOf("//") === 0) {
                throw new utils.Error("Invalid URL: " + sServiceUrl,
                    "sap.ushell.services.URLParsing");
            }
            if (BaseObject.isA(vComponentOrSystem, "sap.ui.core.Component")) {
                var oComponentData = (typeof vComponentOrSystem.getComponentData === "function") && vComponentOrSystem.getComponentData();
                sSystem = oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["sap-system"]
                    && oComponentData.startupParameters["sap-system"][0];
            }

            // Container.getService is OK here. The NavTargetResolutionInternal service should be present already and the function is deprecated.
            var oResolution = Container.getService("NavTargetResolutionInternal").getCurrentResolution(); // LEGACY API (deprecated)
            // note: if component is specified but lacks sap-system, we do not do a fallback!
            if (!sSystem && !vComponentOrSystem && oResolution && oResolution.url) {
                sSystem = new URL(oResolution.url, window.location.href).searchParams.get("sap-system");
            }
            if (/^[^?]*(;mo([/;?]|$))/.test(sServiceUrl)) {
                // do nothing, mo present
            } else if (/^[^?]*(;o=([/;?]|$))/.test(sServiceUrl)) {
                // URL with ";o=" *not* followed by system: insert system
                sServiceUrl = sServiceUrl.replace(/;o=([/;?]|$)/, (sSystem ? ";o=" + sSystem : "") + "$1");
            } else if (!/^[^?]*;o=/.test(sServiceUrl) && sSystem) {
                // URL without ";o=": append system
                sServiceUrl = sServiceUrl.replace(/(\/[^?]*?)(\/$|$|(\/?\?.*))/, "$1;o=" + sSystem + "$2");
            }

            Container.addRemoteSystemForServiceUrl(sServiceUrl);
            return sServiceUrl;
        };
    }

    URLParsing.hasNoAdapter = true;
    return URLParsing;
}, true /* bExport */);

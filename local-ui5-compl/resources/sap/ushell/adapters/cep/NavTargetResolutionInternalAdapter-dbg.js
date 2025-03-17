// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview The NavTargetResolutionInternal adapter for SAP MyHome
 * @version 1.132.1
 * @since 1.120
 */

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/base/util/ObjectPath",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container",
    "sap/ushell/services/ClientSideTargetResolution/VirtualInbounds",
    "sap/ushell/utils/HttpClient",
    "sap/ushell/Config"
], function (
    Localization,
    ObjectPath,
    jQuery,
    Container,
    oVirtualInbounds,
    HttpClient,
    Config
) {
    ("use strict");
    /** Constructs a new instance of  The NavTargetResolutionInternal adapter for SAP MyHome.
     * It calls the backend service to retrieve navigation data.
     * @class
     * @param {object} oUnused unused
     * @param {string} sParameter parameters
     * @param {object} oAdapterConfiguration configuration, holds endpoint for service
     * @since 1.101.0
     * @private
     */
    var NavTargetResolutionInternalAdapter = function (
        oUnused,
        sParameter,
        oAdapterConfiguration
    ) {
        this.oAdapterConfiguration = oAdapterConfiguration;
        this._addVirtualInboundsToApplications();
        this._initializeHttpClient();
    };

    /**
     * Adds virtual inbounds to applications
     * @since 1.101.0
     * @private
     */
    NavTargetResolutionInternalAdapter.prototype._addVirtualInboundsToApplications = function () {
        var oApplications = ObjectPath.create(
            "config.applications",
            this.oAdapterConfiguration
        );
        var aVirtualInbounds = oVirtualInbounds.getInbounds();
        aVirtualInbounds.forEach(function (oInbound) {
            var sIntent = oInbound.semanticObject + "-" + oInbound.action;
            oApplications[sIntent] = oInbound.resolutionResult;
        });
    };

    /**
     * Gets the intent object that can be passed to the resolve service
     * used to call the backend service.
     * It uses the default launchStrategy which is launch type 'standalone'
     * and matching strategy 'first'.
     * The site id is taken from the window object.
     * @param {string} sHashFragment Fragment with semantic object and action and intent parameters,
     * @returns {Promise} Promise that resolves with an intent object
     * @private
     * @since 1.101.0
     */
    NavTargetResolutionInternalAdapter.prototype._getIntentForService = function (sHashFragment) {
        return Container.getServiceAsync("URLParsing").then(
            function (URLParsing) {
                var oHashFragment = URLParsing.parseShellHash(sHashFragment);

                return {
                    semanticObject: oHashFragment.semanticObject,
                    semanticObjectAction: oHashFragment.action,
                    intentParameters: oHashFragment.params,
                    queryParameters: {
                        siteId: Config.last("/core/site/siteId") || ""
                    }
                };
            }
        );
    };

    /**
     * Initialize the HttpClient
     * @private
     * @since 1.110.0
     */
    NavTargetResolutionInternalAdapter.prototype._initializeHttpClient = function () {
        var oHeaders = {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
            "Accept-Language": Localization.getLanguageTag().toString() || ""
        };

        var sBasePath = this.oAdapterConfiguration.config.navServiceUrl + "/";
        this.oHttpClient = new HttpClient(sBasePath, { headers: oHeaders });
    };

    /**
     * wrapper function to convert ES6 promise into jQuery promise
     * @param {function} fn function to wrap
     * @returns {fn} wrapped function
     */
    NavTargetResolutionInternalAdapter.prototype.toPromise = function (fn) {
        var that = this;
        return function (mArg) {
            var oDeferred = new jQuery.Deferred();
            fn.call(that, mArg)
                .then(oDeferred.resolve)
                .catch(oDeferred.reject)
                .finally(oDeferred.always);

            return oDeferred.promise();
        };
    };

    /**
     * Resolves hash fragment by calling backend service
     * @param {*} sHashFragment hash fragment
     * @returns {jQuery.Promise} a promise that resolves with a resolution result
     * @since 1.101.0
     */
    NavTargetResolutionInternalAdapter.prototype.resolveHashFragment =
        function (sHashFragment) {
            return this.toPromise(
                this._resolveHashFragment
            ).call(this, sHashFragment);
        };

    /**
     * Resolves hash fragment by calling backend service
     * @param {*} sHashFragment hash fragment
     * @returns {Promise} a promise that resolves with a resolution result
     * @since 1.101.0
     */

    NavTargetResolutionInternalAdapter.prototype._resolveHashFragment = function (
        sHashFragment
    ) {
        return this._getIntentForService(sHashFragment)
            .then(function (oIntentForService) {
                var sResolvePath = this.oAdapterConfiguration.config.navServiceUrl + "/resolve";
                return this.oHttpClient.post(sResolvePath, { data: JSON.stringify(oIntentForService) })
                    .then(function (oResponse) {
                        if (oResponse.status < 200 || oResponse.status >= 300) {
                            return Promise.reject("HTTP request to navigation service failed with status: " + oResponse.status + " - " + oResponse.statusText);
                        }
                        return JSON.parse(oResponse.responseText);
                    })
                    .then(function (oResponseData) {
                        var oData = oResponseData.value || oResponseData;
                        var sUrl = Array.isArray(oData) ? oData[0].url : oData.url;
                        return {
                            additionalInformation: "",
                            url: sUrl,
                            applicationType: "URL",
                            navigationMode: "newWindow"
                        };
                    });
            }.bind(this));
    };

    /**
     * Forwards the given intents and converts them from an array to a combined object.
     *
     * @param {string[]} aIntents The intents (such as <code>"#AnObject-Action?A=B&C=e&C=j"</code>) to be forwarded.
     * @returns {object} A <code>jQuery.Deferred</code> promise containing the intents in an object
     * with their intents as keys with a single property <code>supported</code> of type <code>boolean</code>.
     *   Example:
     *   <pre>
     *   {
     *     "#AnObject-Action?A=B&C=e&C=j": { supported: false },
     *     "#AnotherObject-Action2": { supported: true }
     *   }
     *   </pre>
     * @private
     * @since 1.121.0
     */
    NavTargetResolutionInternalAdapter.prototype.isIntentSupported = function (aIntents) {
        var oIntents = {};
        aIntents.forEach((elem, i) => {
            oIntents[elem] = { supported: true };
        });
        var oDeferred = new jQuery.Deferred();
        oDeferred.resolve(oIntents);
        return oDeferred.promise();
    };

    return NavTargetResolutionInternalAdapter;
}, /* bExport= */ false);

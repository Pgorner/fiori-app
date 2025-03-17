// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The NavTargetResolution service.
 * @deprecated since 1.120. Use {@link sap.ushell.services.Navigation} for Navigation instead.
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ushell/Container",
    "sap/ushell/services/NavTargetResolutionInternal"
], function (
    jQuery,
    Log,
    Container
    /* NavTargetResolutionInternal - here to async preload the module */
) {
    "use strict";

    /**
     * @alias sap.ushell.services.NavTargetResolution
     * @class
     * @classdesc The Unified Shell's internal navigation target resolution service.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const NavTargetResolution = await Container.getServiceAsync("NavTargetResolution");
     *     // do something with the NavTargetResolution service
     *   });
     * </pre>
     *
     * Methods in this class deal with *internal* representations of the shell hash.
     *
     * configurations:
     *   <code>config : { allowTestUrlComponentConfig  : true }</code>
     *   allow to redefine the Test-url, Test-local1, Test-local2 applications via url parameters
     *   (sap-ushell-test-local1-url=  / sap-ushell-test-local1-additionalInformation=  ... )
     *
     * @param {object} oAdapter Adapter
     * @param {object} oContainerInterface not used
     * @param {string} sParameters not used
     * @param {object} oServiceConfiguration oServiceConfiguration
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.15.0
     * @public
     * @deprecated since 1.120. Use {@link sap.ushell.services.Navigation} for Navigation instead.
     */
    function NavTargetResolution (oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        Log.error("NavTargetResolution service has been called, which is deprecated. Remove all dependencies!", null, "sap.ushell.services.NavTargetResolution");
        // The internal variant service and this one might be used in parallel.
        // This might lead to issues due to mismatching internal states. Therefore we proxy
        // the public/protected calls to the internal service.

        this._oNavTargetResolutionInternal = Container.getService("NavTargetResolutionInternal");

        /**
         * expands a URL hash fragment
         *
         * This function gets the hash part of the URL and expands a sap-intent-param if present and retrievable
         *
         * This is an asynchronous operation.
         *
         * @param {string} sHashFragment The formatted URL hash fragment in internal format
         *   (as obtained by the SAPUI5 hasher service, not as given in <code>location.hash</code>)
         * @returns {jQuery.Promise} Resolves expanded shell hash (in internal format).
         *
         * @public
         */
        this.expandCompactHash = function (sHashFragment) {
            return this._oNavTargetResolutionInternal.expandCompactHash(sHashFragment);
        };

        /**
         * Resolves a navigation target taking into account the sap-system
         *
         * This function should be used by the NWBC browser in order to get a resolved target corresponding to a certain configuration object describing the target.
         * Do not use this function for developing Fiori applications.
         *
         * @param {object} oArgs
         * <pre>
         *   {
         *     target : {
         *       semanticObject : "semantic object",
         *       action : "action",
         *     },
         *     params :  {
         *       "sap-system-src": "e.g. sid(UR5.120)",
         *       "sap-system": {
         *         ... data related to the sap-system
         *       }
         *     }
         *   }
         * </pre>
         * @returns {jQuery.Promise} Resolves an object. Typically it contains the following information:
         *   <pre>
         *   {
         *     "url": "/sap/bc/",
         *     "text": "My targetmapping description",
         *     "externalNavigationMode": boolean
         *   }
         *   </pre>
         *
         * @protected
         */
        this.resolveTarget = function (oArgs) {
            return this._oNavTargetResolutionInternal.resolveTarget(oArgs);
        };

        /**
         * Resolves the URL hash fragment.
         *
         * This function should be used by a custom renderer in order to implement custom navigation. Do not use this function for developing Fiori applications.
         *
         * This function gets the hash part of the URL and returns data of the target application.
         *
         * Example of the returned data:
         *   <pre>
         *   {
         *     "additionalInformation": "SAPUI5.Component=sap.ushell.renderer.search.container",
         *     "applicationType": "URL",
         *     "url": "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/renderer/search/container",
         *     "navigationMode": "embedded"
         *   }
         *   </pre>
         *
         * This is an asynchronous operation.
         *
         * @param {string} sHashFragment The formatted URL hash fragment in internal format (as obtained by the SAPUI5 hasher service) not as given in <code>location.hash</code>)!
         *   Example: <code>#SemanticObject-action?P1=V1&P2=A%20B%20C</code>
         * @returns {jQuery.Promise} Resolves an object that you can use to create a {@link sap.ushell.components.container.ApplicationContainer}
         *   or <code>undefined</code> in case the hash fragment was empty. Typically it contains the following information:
         *   <pre>
         *   {
         *     "applicationType": "URL",
         *     "url": "/sap/bc/",
         *     "additionalInformation": "SAPUI5.Component=com.sap.AComponent",
         *     "text": "My targetmapping description",
         *     "navigationMode": "embedded"
         *   }
         *   </pre>
         *   <p>
         *   The <code>navigationMode</code> indicates how the target application should be navigated.
         *   It is added to the result using the logic in {@link navigationMode#getNavigationMode} if none of the resolvers in the chain added it.
         *   </p>
         *   <p>No navigation should occur when the promise is resolved to <code>undefined</code>.</p>
         *
         * @public
         */
        this.resolveHashFragment = function (sHashFragment) {
            return this._oNavTargetResolutionInternal.resolveHashFragment(sHashFragment);
        };

        /**
         * Tells whether the given intent(s) are supported, taking into account the form factor of the current device.
         * "Supported" means that navigation to the intent is possible.
         *
         * @param {string[]} aIntents the intents (such as <code>"#AnObject-action?A=B&C=e&C=j"</code>) to be checked.
         *   The intents must be in internal format and expanded.
         * @returns {jQuery.Promise} Resolves with a map containing the intents from <code>aIntents</code> as keys.
         *   The map values are objects with a property <code>supported</code> of type <code>boolean</code>.<br/>
         *   Example:
         *   <pre>
         *   {
         *     "#AnObject-action?A=B&C=e&C=j": { supported: false },
         *     "#AnotherObject-action2": { supported: true }
         *   }
         *   </pre>
         * @deprecated since 1.31. Please use {@link #isNavigationSupported} instead. Note that this has a slightly different response!
         *
         */
        this.isIntentSupported = function (aIntents) {
            return this._oNavTargetResolutionInternal.isIntentSupported(aIntents);
        };

        /**
         * Register a custom resolver for semantic objects
         *
         * The resolver must be JavaScript object with a string property name, and two functions
         * resolveHashFragment(sHashFragment,nextResolver) returning a promise and isApplicable(sHashFragment) returning a boolean
         *
         * @param {object} oResolver the custom resolver
         * @returns {boolean} true if resolver was registered, false otherwise
         *
         * @private
         * @ui5-restricted cp.portal
         */
                this.registerCustomResolver = function (oResolver) {
                    return this._oNavTargetResolutionInternal.registerCustomResolver(oResolver);
        };

        /**
         * Tells whether the given navigation intent(s) are supported for the given parameters
         * Supported" means that a valid navigation target is configured for the user for the given device form factor.
         *
         * This is effectively a test function for {@link toExternal}/ {@link hrefForExternal}.
         * It function accepts the same input as {@link toExternal}/ {@link hrefForExternal}.
         *
         * @param {object[]} aIntents the intents (such as <code>["#AnObject-action?A=B&c=e"]</code>) to be checked
         *   with object being instances the oArgs object of toExternal, hrefForExternal etc.
         *   e.g.
         * <pre>
         *   {
         *     target : { semanticObject : "AnObject", action: "action" },
         *     params : { A : "B" }
         *   }
         * </pre>
         *   or e.g.
         * <pre>
         *   {
         *     target : { semanticObject : "AnObject", action: "action" },
         *     params : { A : "B", c : "e" }
         *   }
         * </pre>
         *   or
         *   <code>{ target : { shellHash : "AnObject-action?A=B&c=e" } }</code>
         * @returns {jQuery.Promise} Resolves an array of objects representing whether the intent is supported or not objects with a property <code>supported</code> of type <code>boolean</code>.<br/>
         *   Example:
         *
         *   aIntents:
         *     an array of parameterized (parsed) Intent objects, in the corresponding structure to arguments to
         *     {@link sap.ushell.services.CrossApplicationNavigation.toExternal}, {@link sap.ushell.services.CrossApplicationNavigation.hrefForExternal}
         *     <pre>
         *     [
         *       {
         *         target : {
         *           semanticObject : "AnObject",
         *           action: "action"
         *         },
         *         params : { P1 : "B", P2 : [ "V2a", "V2b"] }
         *       },
         *       {
         *         target : {
         *           semanticObject : "SalesOrder",
         *           action: "display"
         *         },
         *         params : { P3 : "B", SalesOrderIds : [ "4711", "472"] }
         *       }
         *     ]
         *     </pre>
         *
         * The following formats are also supported as input to ease migration of existing code:
         *   <code>[ "#AnObject-action?P1=B&SalesOrderIds=4711&SalesOrderIds=472" ]</code>
         *
         * response:
         *   <pre>
         *   [
         *     { supported: false },
         *     { supported: true }
         *   ]
         *   </pre>
         *
         * Example usage:
         * <pre>
         *   this.oCrossAppNav.isNavigationSupported([ ])
         *   .done(function(aResponses) {
         *     if (oResponse[0].supported===true){
         *       // enable link
         *     }
         *     else {
         *       // disable link
         *     }
         *   })
         *   .fail(function() {
         *     // disable link
         *     // request failed or other fatal error
         *   });
         * </pre>
         *
         * @since 1.32
         * @public
         */
        this.isNavigationSupported = function (aIntents) {
            return this._oNavTargetResolutionInternal.isNavigationSupported(aIntents);
        };

    }

    // Note: we set it to true to allow platforms that did not yet switch to ClientSideTargetResolution to keep using the adapter.
    NavTargetResolution.hasNoAdapter = false;

    return NavTargetResolution;
}, true /* bExport */);

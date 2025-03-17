// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview Helper functions for <code>sap.ushell.services.Ui5ComponentLoader
 *  This is a shell-internal service and no public or application facing API!
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/ushell/utils/UriParameters",
    "sap/ui/core/Component",
    "sap/ui/core/util/AsyncHintsHelper",
    "sap/ui/thirdparty/jquery"
], function (
    Log,
    deepExtend,
    UriParameters,
    Component,
    oAsyncHintsHelper,
    jQuery
) {
    "use strict";

    /**
     * Those libraries are added as asyncHints in case the manifest does not provide any asyncHints
     */
    let aDefaultDependencies = ["sap.ui.unified"];

    /**
     * The libraries are deprecated and shall not be added in 2.x
     * @deprecated since 1.120.0
     */
    aDefaultDependencies = ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"];

    /**
     * Type for component data
     * sap.ushell.services.Ui5ComponentLoader.ComponentData
     * @typedef {object} sap.ushell.services.Ui5ComponentLoader.ComponentData
     * @property {object} [config] Application configuration, or technical parameter if not present
     * @property {object} [startupParameters] Application startup parameters

     * @property {sap.ui.core.URI} url URL of the component
     * @property {object} applicationDependencies  Application dependencies
     * @property {string} ui5ComponentName  Name of the UI5 component
     * @since 1.120.0
     * @private
     * @ui5-restricted unified inbox
     */

    /**
     * Creates a UI5 component instance asynchronously.
     *
     * @param {{manifest:object}} oComponentProperties
     *  the Ui5 component properties
     * @param {sap.ushell.services.Ui5ComponentLoader.ComponentData} oComponentData
     *  the Ui5 component data
     * @returns {jQuery.Promise<sap.ui.component>} Resolves with an instance of
     *  <code>sap.ui.component</code> containing the instantiated
     *  Ui5 component.
     *
     * @private
     */
    function createUi5Component (oComponentProperties, oComponentData) {
        var oDeferred = new jQuery.Deferred();

        oComponentProperties.componentData = oComponentData;
        if (oComponentProperties.manifest === undefined) {
            oComponentProperties.manifest = false;
        }

        Component.create(oComponentProperties).then(function (oComponent) {
            oDeferred.resolve(oComponent);
        }, function (vError) {
            oDeferred.reject(vError);
        });

        return oDeferred.promise();
    }

    function shouldLoadCoreExt (oAppProperties) {
        var bLoadCoreExt = true; /* default */
        if (oAppProperties.hasOwnProperty("loadCoreExt")) {
            bLoadCoreExt = oAppProperties.loadCoreExt;
        }
        return bLoadCoreExt;
    }

    function shouldLoadDefaultDependencies (oAppProperties, oServiceConfig) {
        // default dependencies loading can be skipped explicitly (homepage component use case)
        var bLoadDefaultDependencies = true;
        if (oAppProperties.hasOwnProperty("loadDefaultDependencies")) {
            bLoadDefaultDependencies = oAppProperties.loadDefaultDependencies;
        }

        // or via service configuration (needed for unit tests)
        if (oServiceConfig && oServiceConfig.hasOwnProperty("loadDefaultDependencies")) {
            bLoadDefaultDependencies = bLoadDefaultDependencies && oServiceConfig.loadDefaultDependencies;
        }

        return bLoadDefaultDependencies;
    }

    // todo: [FLPCOREANDUX-10024] Get rid of this calculation
    function constructAppComponentId (oParsedShellHash) {
        var sSemanticObject = oParsedShellHash.semanticObject || null;
        var sAction = oParsedShellHash.action || null;

        if (!sSemanticObject || !sAction) {
            return null;
        }

        return "application-" + sSemanticObject + "-" + sAction + "-component";
    }

    function urlHasParameters (sUrl) {
        return sUrl && sUrl.indexOf("?") >= 0;
    }

    /**
     * Removes the cachebuster token from the given URL if any is present.
     *
     * @param {string} sUrl
     *    The URL to remove the change buster token from
     *
     * @returns {string}
     *    The URL without the cachebuster token. The same URL is returned if no cachebuster token was present in the original URL.
     */
    function removeCacheBusterTokenFromUrl (sUrl) {
        var rCacheBusterToken = new RegExp("[/]~[\\w-]+~[A-Z0-9]?");
        return sUrl.replace(rCacheBusterToken, "");
    }

    function removeParametersFromUrl (sUrl) {
        if (!sUrl) { return sUrl; }

        var iIndex = sUrl.indexOf("?");
        if (iIndex >= 0) {
            return sUrl.slice(0, iIndex);
        }
        return sUrl;
    }

    function logInstantiateComponentError (sApplicationName, sErrorMessage, sErrorStatus, sErrorStackTrace, sComponentProperties) {
        var sErrorReason = "The issue is most likely caused by application " + sApplicationName,
            sAppPropertiesErrorMsg = "Failed to load UI5 component with properties: '" + sComponentProperties + "'.";

        if (sErrorStackTrace) {
            sAppPropertiesErrorMsg += " Error likely caused by:\n" + sErrorStackTrace;
        } else {
            // Error usually appears in the stack trace if the app
            // threw with new Error... but if it didn't we add it here:
            sAppPropertiesErrorMsg += " Error: '" + sErrorMessage + "'";
        }

        if (sErrorStatus === "parsererror") {
            sErrorReason += ", as one or more of its resources could not be parsed";
        }
        sErrorReason += ". Please create a support incident and assign it to the support component of the respective application.";

        Log.error(sErrorReason, sAppPropertiesErrorMsg, sApplicationName);
    }

    /**
     * Returns a map of all search parameters present in the search string of the given URL.
     *
     * @param {string} sUrl
     *   the URL
     * @returns {object}
     *   in member <code>startupParameters</code> <code>map&lt;string, string[]}></code> from key to array of values,
     *   in members <code>sap-xapp-state</code> an array of Cross application Navigation state keys, if present
     *   Note that this key is removed from startupParameters!
     * @private
     */
    function getParameterMap (sUrl) {
        var mParams = UriParameters.fromURL(sUrl || window.location.href).mParams,
            xAppState = mParams["sap-xapp-state"],
            xAppStateData = mParams["sap-xapp-state-data"],
            oResult;
        delete mParams["sap-xapp-state"];
        delete mParams["sap-xapp-state-data"];
        oResult = {
            startupParameters: mParams
        };
        if (xAppStateData) {
            oResult["sap-xapp-state"] = xAppStateData;
        }
        if (xAppState) { // sap-xapp-state has priority over sap-xapp-state-data
            oResult["sap-xapp-state"] = xAppState;
        }
        return oResult;
    }

    function logAnyApplicationDependenciesMessages (sApplicationDependenciesName, aMessages) {
        if (!Array.isArray(aMessages)) {
            return;
        }

        aMessages.forEach(function (oMessage) {
            var sSeverity = String.prototype.toLowerCase.call(oMessage.severity || "");
            sSeverity = ["trace", "debug", "info", "warning", "error", "fatal"].indexOf(sSeverity) !== -1 ? sSeverity : "error";
            Log[sSeverity](oMessage.text, oMessage.details, sApplicationDependenciesName);
        });
    }

    /**
     * Loads the specified bundle resources asynchronously.
     *
     * @param {string[]} aBundleResources - the resources to be loaded;
     *  must follow the UI5 module definition spec (i.e. w/o .js extension)
     *
     * @returns {Promise} Promise that resolves as soon as all bundle resources are loaded.
     *
     * @private
     */
    function loadBundle (aBundleResources) {
        if (!Array.isArray(aBundleResources)) {
            Log.error("Ui5ComponentLoader: loadBundle called with invalid arguments");
            return null;
        }

        return Promise.all(aBundleResources.map(function (sResource) {
            // since 1.46, multiple calls of sap.ui.loader._.loadJSResourceAsync
            // for the same module will return the same promise,
            // i.e. there is no need to check if the module has been loaded before
            // TODO: sap.ui.loader._.loadJSResourceAsync is private.
            return sap.ui.loader._.loadJSResourceAsync(sResource);
        })).catch(function (vError) {
            Log.error("Ui5ComponentLoader: failed to load bundle resources: [" + aBundleResources.join(", ") + "]");
            return Promise.reject(vError);
        });
    }

    /**
     * Creates a componentProperties object that can be used to instantiate
     * a ui5 component.
     * @param {boolean} bAddCoreExtPreloadBundle Whether to add the core-ext-light-preload bundle to the component properties.
     * @param {boolean} bLoadDefaultDependencies Whether to load default dependencies.
     * @param {boolean} bNoCachebusterTokens Whether to remove cachebuster tokens from the URLs in the component properties.
     * @param {string[]} aWaitForBeforeInstantiation The list of components to wait for before instantiating the component.
     * @param {object} oApplicationDependencies The application dependencies.
     * @param {string} sUi5ComponentName The name of the UI5 component.
     * @param {string} sComponentUrl The URL of the component.
     * @param {string} sAppComponentId The ID of the app component.
     * @param {string[]} aCoreResourcesComplement The list of core resources to complement the component properties with.
     *
     * @returns {object}
     *    The component properties that can be used to instantiate the UI5
     *    component.
     */
    function createComponentProperties (
        bAddCoreExtPreloadBundle,
        bLoadDefaultDependencies,
        bNoCachebusterTokens,
        aWaitForBeforeInstantiation,
        oApplicationDependencies,
        sUi5ComponentName,
        sComponentUrl,
        sAppComponentId,
        aCoreResourcesComplement
    ) {
        // take over all properties of applicationDependencies to enable extensions in server w/o
        // necessary changes in client
        var oComponentProperties = deepExtend({}, oApplicationDependencies);

        // set default library dependencies if no asyncHints defined (apps without manifest)
        // TODO: move fallback logic to server implementation
        if (!oComponentProperties.asyncHints) {
            oComponentProperties.asyncHints = bLoadDefaultDependencies ? { libs: aDefaultDependencies } : {};
        }

        if (bAddCoreExtPreloadBundle) {
            oComponentProperties.asyncHints.preloadBundles =
                oComponentProperties.asyncHints.preloadBundles || [];

            oComponentProperties.asyncHints.preloadBundles =
                oComponentProperties.asyncHints.preloadBundles.concat(aCoreResourcesComplement);
        }

        if (aWaitForBeforeInstantiation) {
            oComponentProperties.asyncHints.waitFor = aWaitForBeforeInstantiation;
        }

        // Use component name from app properties (target mapping) only if no name
        // was provided in the component properties (applicationDependencies)
        // for supporting application variants, we have to differentiate between app ID
        // and component name
        if (!oComponentProperties.name) {
            oComponentProperties.name = sUi5ComponentName;
        }

        if (sComponentUrl) {
            oComponentProperties.url = removeParametersFromUrl(sComponentUrl);
        }

        if (sAppComponentId) {
            oComponentProperties.id = sAppComponentId;
        }

        if (bNoCachebusterTokens && oComponentProperties.asyncHints) {
            oAsyncHintsHelper.modifyUrls(oComponentProperties.asyncHints, removeCacheBusterTokenFromUrl);
        }

        return oComponentProperties;
    }

    /**
     * Creates a componentData object that can be used to instantiate a ui5
     * component.
     * @param {object} oBaseComponentData The base component data.
     * @param {string} sComponentUrl The URL of the component.
     * @param {object} oApplicationConfiguration The application configuration.
     * @param {object} oTechnicalParameters The technical parameters.
     * @returns {sap.ushell.services.Ui5ComponentLoader.ComponentData}
}
     */
    function createComponentData (oBaseComponentData, sComponentUrl, oApplicationConfiguration, oTechnicalParameters) {
        var oComponentData = deepExtend({
            startupParameters: {}
        }, oBaseComponentData);

        if (oApplicationConfiguration) {
            oComponentData.config = oApplicationConfiguration;
        }
        if (oTechnicalParameters) {
            oComponentData.technicalParameters = oTechnicalParameters;
        }

        if (urlHasParameters(sComponentUrl)) {
            var oUrlData = getParameterMap(sComponentUrl);

            // pass GET parameters of URL via component data as member
            // startupParameters and as xAppState (to allow blending with
            // other oComponentData usage, e.g. extensibility use case)
            oComponentData.startupParameters = oUrlData.startupParameters;
            if (oUrlData["sap-xapp-state-data"]) {
                oComponentData["sap-xapp-state"] = oUrlData["sap-xapp-state-data"];
            }
            if (oUrlData["sap-xapp-state"]) { // sap-xapp-state has priority over sap-xapp-state-data
                oComponentData["sap-xapp-state"] = oUrlData["sap-xapp-state"];
            }
        }

        return oComponentData;
    }

    /**
     * Overwrites the default dependencies used for components which don't define asyncHints
     * @param {string[]} aNewDefaultDependencies List of dependencies
     *
     * @since 1.120.0
     * @private
     */
    function _setDefaultDependencies (aNewDefaultDependencies) {
        aDefaultDependencies = aNewDefaultDependencies;
    }

    return {
        constructAppComponentId: constructAppComponentId,
        getParameterMap: getParameterMap,
        logAnyApplicationDependenciesMessages: logAnyApplicationDependenciesMessages,
        logInstantiateComponentError: logInstantiateComponentError,
        shouldLoadCoreExt: shouldLoadCoreExt,
        shouldLoadDefaultDependencies: shouldLoadDefaultDependencies,
        urlHasParameters: urlHasParameters,
        removeParametersFromUrl: removeParametersFromUrl,
        createUi5Component: createUi5Component,
        loadBundle: loadBundle,
        createComponentProperties: createComponentProperties,
        createComponentData: createComponentData,
        // only used for testing
        _setDefaultDependencies: _setDefaultDependencies
    };

}, false /* bExport */);

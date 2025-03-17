// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file
 *
 * This module performs client side navigation target resolution.
 *
 * This Module focuses on the core algorithm of matching an intent against a list of Inbounds (aka AppDescriptor signature objects),
 * which in addition have a property resolutionResult representing an "opaque" resolutionResult.
 *
 * getLinks should be called with already expanded hash fragment.
 * The output of getLinks should then be postprocessed for compaction, outside this service.
 *
 * Missing:
 * <ul>
 *   <li>Scope mechanism</li>
 *   <li>Parameter expansion with dynamic parameters</li>
 * </ul>
 *
 * NOTE: Currently the ABAP adapter also delegates isIntentSupported <b>only</b> (=erroneously)
 * to the resolveHashFragment adapter implementation, missing intents injected via custom resolver plug-ins.
 * The custom resolver hook functionality is currently outside of this method (only affecting resolveHashFragment), as before.
 * The future architecture should handle this consistently.
 *
 * NOTE: Old implementations also gave inconsistent results.
 * For example the ABAP adapter on isIntentSupported did call directly the adapter, not the service,
 * thus missing additional targets added only via a custom resolver.
 *
 * In the future, the custom resolver mechanism should be probably moved towards modifying (or only adding to the list of Inbounds),
 * this way a single data source has to be altered to support consistently getLinks, isIntentSupported.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/isPlainObject",
    "sap/base/util/ObjectPath",
    "sap/base/util/extend",
    "sap/ushell/ApplicationType",
    "sap/ushell/navigationMode",
    "sap/ushell/services/ClientSideTargetResolution/Formatter",
    "sap/ushell/services/ClientSideTargetResolution/InboundIndex",
    "sap/ushell/services/ClientSideTargetResolution/InboundProvider",
    "sap/ushell/services/ClientSideTargetResolution/ParameterMapping",
    "sap/ushell/services/ClientSideTargetResolution/PrelaunchOperations",
    "sap/ushell/services/ClientSideTargetResolution/Search",
    "sap/ushell/services/ClientSideTargetResolution/StagedLogger",
    "sap/ushell/services/ClientSideTargetResolution/SystemContext",
    "sap/ushell/services/ClientSideTargetResolution/Utils",
    "sap/ushell/services/ClientSideTargetResolution/VirtualInbounds",
    "sap/ushell/services/ClientSideTargetResolution/XAppStateProcessing",
    "sap/ushell/TechnicalParameters",
    "sap/ushell/utils",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/Container"
], function (
    Log,
    fnIsPlainObject,
    ObjectPath,
    fnExtend,
    ApplicationType,
    NavigationMode,
    _Formatter,
    _InboundIndex,
    _InboundProvider,
    _ParameterMapping,
    _PrelaunchOperations,
    _Search,
    _StagedLogger,
    _SystemContext,
    _Utils,
    _VirtualInbounds,
    _XAppStateProcessing,
    TechnicalParameters,
    ushellUtils,
    UrlParsing,
    Container
) {
    "use strict";

    /**
     * @alias sap.ushell.services.ClientSideTargetResolution
     * @class
     * @classdesc A module to perform client side target resolution where possible, based on a complete list of Inbounds.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const ClientSideTargetResolution = await Container.getServiceAsync("ClientSideTargetResolution");
     *     // do something with the ClientSideTargetResolution service
     *   });
     * </pre>
     *
     * This list defines a common strategy for selecting <b>one</b> appropriate target (even in case of conflicts) across all platforms.
     *
     * The interface assumes a <b>complete</b> list of inbounds has been passed, including parameter signatures.
     * The array of inbounds is to be injected by the <code>oAdapter.getInbounds()</code> function.
     *
     * Note that the resolution results (e.g. targets and descriptions) may <b>not</b> be present on the client.
     *
     * All interfaces shall still be asynchronous interfaces regarding client invocation.
     *
     * The following request can be served from the client:
     * <ol>
     *   <li>isIntentSupported</li>
     *   <li>getLinks</li>
     * </ol>
     *
     * This module does <b>not</b> perform hash expansion or compaction.
     * This is performed by respective preprocessing of the hash
     * (see {@link sap.ushell.services.NavTargetResolutionInternal#resolveHashFragment}) and:
     * <ul>
     *   <li>resolveHashFragment (expansion, NavTargetResolutionInternal.isIntentSupported)</li>
     *   <li>isIntentSupported
     *   <li>getLinks (post processing, Service)</li>
     * </ul>
     *
     * The Parameter sap-ui-tech-hint can be used to attempt to give one Ui technology preference over another,
     * legal values are: UI5, WDA, GUI.
     *
     * Usage:
     * <pre>
     * sap.ui.require(["sap/ushell/Container"], function(Container) {
     *  Container.getServiceAsync("ClientSideTargetResolution").then(function (oService) {
     *      oService.isIntentSupported("#SemanticObject-action");
     *  });
     * });
     * </pre>
     *
     * @param {object} oAdapter Adapter, provides an array of Inbounds.
     * @param {object} oContainerInterface Not in use.
     * @param {string} sParameters Parameter string, not in use.
     * @param {object} oServiceConfiguration The service configuration not in use.
     *
     * @hideconstructor
     *
     * @since 1.32.0
     * @private
     */
    function ClientSideTargetResolution (oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        this._init.apply(this, arguments);
    }

    ClientSideTargetResolution.prototype._init = function (oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        // A unique (sequential) id used during logging.
        this._iLogId = 0;

        if (!this._implementsServiceInterface(oAdapter)) {
            Log.error(
                "Cannot get Inbounds",
                "ClientSideTargetResolutionAdapter should implement getInbounds method",
                "sap.ushell.services.ClientSideTargetResolution"
            );
            return;
        }

        this._oInboundProvider = new _InboundProvider(oAdapter.getInbounds.bind(oAdapter));

        // Deferred objects resolved once the easy access systems are obtained
        this._oHaveEasyAccessSystemsDeferreds = {
            userMenu: null,
            sapMenu: null
        };

        this._oServiceConfiguration = oServiceConfiguration;

        this._oAdapter = oAdapter;
    };

    /**
     * Checks whether the platform adapter has a compatible service interface.
     *
     * @param {object} oAdapter An instance of ClientSideTargetResolution Adapter for the platform at hand.
     * @returns {boolean} Whether the adapter implements the ClientSideTargetResolution required interface.
     */
    ClientSideTargetResolution.prototype._implementsServiceInterface = function (oAdapter) {
        if (typeof oAdapter.getInbounds === "function") {
            return true;
        }
        return false;
    };

    /**
     * Expand inbound filter object for the CSTR Adapter if enabled via configuration.
     *
     * @param {variant} vObject An input structure to extract the filter from. Currently we support a string representing a hash fragment.
     * @returns {undefined|object[]} <code>undefined</code>, or an array of Segments (tuples semanticObject, action) in the form:
     *   <pre>
     *   [
     *     {
     *       semanticObject: "So1",
     *       action: "action1"
     *     },
     *     ...
     *   ]
     *   </pre>
     */
    ClientSideTargetResolution.prototype._extractInboundFilter = function (vObject) {
        if (!this._oAdapter.hasSegmentedAccess) {
            return undefined;
        }
        if (typeof vObject !== "string") {
            return undefined;
        }

        var sFixedHashFragment = vObject.indexOf("#") === 0 ? vObject : "#" + vObject;
        var oShellHash = UrlParsing.parseShellHash(sFixedHashFragment);

        if (!oShellHash || !oShellHash.semanticObject || !oShellHash.action) {
            return undefined;
        }

        return [{
            semanticObject: oShellHash.semanticObject,
            action: oShellHash.action
        }];
    };

    /**
     * Resolves the URL hash fragment asynchronously.
     * The form factor of the current device is used to filter the navigation targets returned.
     *
     * @param {string} sHashFragment The URL hash fragment in internal format
     *   (as obtained by the hasher service from SAPUI5, not as given in <code>location.hash</code>)
     * @returns {Promise<object>} Resolves an object that you can use to create a
     *   {@link sap.ushell.components.container.ApplicationContainer} or <code>undefined</code> in case the hash fragment was empty.
     * @private
     * @since 1.34.0
     */
    ClientSideTargetResolution.prototype.resolveHashFragment = async function (sHashFragment) {
        // NOTE: adapter may not implement fallback function
        var aSegments = this._extractInboundFilter(sHashFragment);

        const oInboundIndex = await this._oInboundProvider.getInbounds(aSegments);
        const oResolvedHashFragment = await this._resolveHashFragment(sHashFragment, oInboundIndex);

        return oResolvedHashFragment;
    };

    /**
     * Resolves the given hash fragment with the fallback provided by the adapter.
     * A fallback function used by this method to resolve the given hash fragment.
     * It is called with the following positional parameters:
     * <ol>
     *   <li>hash fragment string</li>
     *   <li>inbound that matched the hash fragment</li>
     *   <li>oEffectiveParameters, the parameters to be added to the resolved url</li>
     * </ol>
     * This function must return a promise that is resolved with an object like:
     * <pre>
     * {
     *   applicationType: ...,
     *   additionalInformation: ...,
     *   url: ...,
     *   applicationDependencies: ...,
     *   text: ...
     * }
     * </pre>
     * Missing properties will be excluded from the resolution result.
     * @param {string} sHashFragment The hash fragment to be resolved.
     * @param {object} oInbound The inbound that matched the hash fragment.
     * @param {object} oEffectiveParameters The parameters to be added to the resolved URL.
     * @returns {Promise<object>} Resolves with an object containing the necessary information to render a tile,
     *
     * @private
     * @since 1.130.0
     */
    ClientSideTargetResolution.prototype._resolveHashFragmentWithFallback = async function (sHashFragment, oInbound, oEffectiveParameters) {
        if (typeof this._oAdapter.resolveHashFragmentFallback !== "function") {
            // no fallback logic available
            Log.error(
                "Cannot resolve hash fragment",
                sHashFragment + " has matched an inbound that cannot be resolved client side and no resolveHashFragmentFallback method was implemented in ClientSideTargetResolutionAdapter",
                "sap.ushell.services.ClientSideTargetResolution"
            );

            throw new Error("No fallback provided");
        }

        const oResult = await ushellUtils.promisify(this._oAdapter.resolveHashFragmentFallback(sHashFragment, oInbound, oEffectiveParameters));
        return oResult;
    };

    /**
     * Resolves a given intent to information that can be used to render a tile.
     *
     * @param {string} sHashFragment The intent to be resolved (including the "#" sign).
     * @returns {Promise<object>} Resolves with an object containing the necessary information to render a tile,
     *   or rejects with an error message or <code>undefined</code>.
     * @private
     * @since 1.38.0
     */
    ClientSideTargetResolution.prototype.resolveTileIntent = async function (sHashFragment) {

        // NOTE: adapter may not implement fallback function
        var aSegments = this._extractInboundFilter(sHashFragment);

        const oInboundIndex = await this._oInboundProvider.getInbounds(aSegments);
        const oResolvedIntent = await this._resolveTileIntent(sHashFragment, oInboundIndex);

        return oResolvedIntent;
    };

    /**
     * Resolves the given tile intent in the context of the given inbounds.
     *
     * @param {object[]} aInbounds The Inbounds.
     * @param {string} sHashFragment The intent to be resolved.
     * @returns {Promise<object>} Resolves the tile intent.
     * @private
     */
    ClientSideTargetResolution.prototype.resolveTileIntentInContext = async function (aInbounds, sHashFragment) {
        // create Inbound Index for aInbounds
        var oInboundIndex = _InboundIndex.createIndex(
            aInbounds.concat(_VirtualInbounds.getInbounds())
        );

        const oResolvedTileIntent = await this._resolveTileIntent(sHashFragment, oInboundIndex);

        return oResolvedTileIntent;
    };

    ClientSideTargetResolution.prototype._resolveHashFragment = async function (sHashFragment, oInboundIndex) {
        var sFixedHashFragment = sHashFragment.indexOf("#") === 0 ? sHashFragment : "#" + sHashFragment;
        var oShellHash = UrlParsing.parseShellHash(sFixedHashFragment);

        if (oShellHash === undefined) {
            Log.error("Could not parse shell hash '" + sHashFragment + "'",
                "please specify a valid shell hash",
                "sap.ushell.services.ClientSideTargetResolution");
            throw new Error(`Could not parse shell hash '${sHashFragment}'please specify a valid shell hash`);
        }

        oShellHash.formFactor = ushellUtils.getFormFactor();

        let aMatchingTargets = await this._getMatchingInbounds(oShellHash, oInboundIndex, { bExcludeTileInbounds: true });

        if (aMatchingTargets.length === 0) {
            Log.warning(
                "Could not resolve " + sHashFragment,
                "rejecting promise",
                "sap.ushell.services.ClientSideTargetResolution"
            );
            throw new Error(`Could not resolve ${sHashFragment}`);
        }

        aMatchingTargets = this._applySapNavigationScopeFilter(aMatchingTargets, oShellHash);

        const oMatchingTarget = aMatchingTargets[0];

        if (Log.getLevel() >= Log.Level.DEBUG) {
            // replacer for JSON.stringify to show undefined values
            var fnUndefinedReplacer = function (sKey, vVal) {
                return (this[sKey] === undefined) ? "<undefined>" : vVal;
            };
            var fnReplacer = function (key, value) {
                return (key === "_original") ? undefined : fnUndefinedReplacer.call(this, key, value);
            };
            var sMatchedTarget = JSON.stringify(oMatchingTarget, fnReplacer, "   ");

            Log.debug(
                "The following target will now be resolved",
                sMatchedTarget,
                "sap.ushell.services.ClientSideTargetResolution"
            );
        }

        return this._resolveSingleMatchingTarget(oMatchingTarget, sFixedHashFragment);
    };

    /**
     * Takes the sap-navigation-scope-filter from the shell hash and finds matching inbounds by using the sap-navigation-scope parameter.
     *
     * @param {object[]} aMatchResults The set of already matched inbounds.
     * @param {object} oShellHash The shell hash object.
     * @returns {object[]} The matched inbounds that are filtered by sap-navigation-scope.
     *   If no inbound matches the sap-navigation-scope-filter, then the original aMatchResults is returned.
     * @private
     */
    ClientSideTargetResolution.prototype._applySapNavigationScopeFilter = function (aMatchResults, oShellHash) {
        var oSapNavigationScopeFilter = oShellHash && oShellHash.params && oShellHash.params["sap-navigation-scope-filter"];
        if (!oSapNavigationScopeFilter) {
            return aMatchResults;
        }

        var aFilteredResults = aMatchResults.filter(function (oMatchResult) {
            var oMatchResultParams = ObjectPath.get("inbound.signature.parameters", oMatchResult);
            var oSapNavigationScope = oMatchResultParams && oMatchResultParams["sap-navigation-scope"];
            if (oSapNavigationScope) {
                return oSapNavigationScopeFilter[0] === oSapNavigationScope.defaultValue.value;
            }
            return undefined;
        });

        return aFilteredResults.length > 0 ? aFilteredResults : aMatchResults;
    };

    ClientSideTargetResolution.prototype._resolveSingleMatchingTarget = async function (oMatchingTarget, sFixedHashFragment) {
        var oIntent = UrlParsing.parseShellHash(sFixedHashFragment);
        var sIntent = [oIntent.semanticObject, oIntent.action].join("-");
        var sApplicationType = (oMatchingTarget.inbound.resolutionResult || {}).applicationType;

        var fnExternalSystemAliasResolver;
        if (this._oAdapter.resolveSystemAlias) {
            fnExternalSystemAliasResolver = this._oAdapter.resolveSystemAlias.bind(this._oAdapter);
        }

        var bHasUrlTemplate = !!oMatchingTarget.inbound.templateContext;
        var fnEasyAccessMenuResolver = ApplicationType.getEasyAccessMenuResolver(sIntent, sApplicationType);
        if (fnEasyAccessMenuResolver && !bHasUrlTemplate) {
            const oResolutionResult = await fnEasyAccessMenuResolver(oIntent, oMatchingTarget, fnExternalSystemAliasResolver, ApplicationType.WDA.enableWdaCompatibilityMode);

            const oNavModeProperties = NavigationMode.getNavigationMode(
                oResolutionResult,
                (oMatchingTarget.intentParamsPlusAllDefaults["sap-ushell-navmode"] || [])[0],
                (oMatchingTarget.intentParamsPlusAllDefaults["sap-ushell-next-navmode"] || [])[0]
            );
            ushellUtils.shallowMergeObject(oResolutionResult, oNavModeProperties);
            oResolutionResult.inboundPermanentKey = oMatchingTarget.inbound.permanentKey || oMatchingTarget.inbound.id;

            return oResolutionResult;
        }

        var oReservedParameters = this._getReservedParameters(oMatchingTarget);

        // rename Parameters
        _ParameterMapping.mapParameterNamesAndRemoveObjects(oMatchingTarget);

        const AppState = await Container.getServiceAsync("AppState");
        oMatchingTarget = await _XAppStateProcessing.mixAppStateIntoResolutionResultAndRename(oMatchingTarget, AppState);

        // remove parameters that should not make it to the URL (in any case!)
        delete oMatchingTarget.intentParamsPlusAllDefaults["sap-tag"];
        delete oMatchingTarget.mappedIntentParamsPlusSimpleDefaults["sap-tag"];
        oMatchingTarget.mappedDefaultedParamNames = oMatchingTarget.mappedDefaultedParamNames.filter(function (sParameterName) {
            return sParameterName !== "sap-tag";
        });

        var sBaseUrl = ObjectPath.get("inbound.resolutionResult.url", oMatchingTarget);

        await _PrelaunchOperations.executePrelaunchOperations(oMatchingTarget, oReservedParameters["sap-prelaunch-operations"]);

        try {
            let fnResultProcessor;
            if (ApplicationType[sApplicationType]) {
                fnResultProcessor = ApplicationType[sApplicationType].generateResolutionResult;
            } else {
                fnResultProcessor = () => {
                    return this._constructFallbackResolutionResult(oMatchingTarget, sFixedHashFragment);
                };
            }
            const oResolutionResult = await fnResultProcessor(oMatchingTarget, sBaseUrl, fnExternalSystemAliasResolver);

            const oNavModeProperties = NavigationMode.getNavigationMode(
                oResolutionResult,
                (oMatchingTarget.intentParamsPlusAllDefaults["sap-ushell-navmode"] || [])[0],
                (oMatchingTarget.intentParamsPlusAllDefaults["sap-ushell-next-navmode"] || [])[0]
            );
            ushellUtils.shallowMergeObject(oResolutionResult, oNavModeProperties);

            oResolutionResult.reservedParameters = oReservedParameters;
            oResolutionResult.inboundPermanentKey = oMatchingTarget.inbound.permanentKey || oMatchingTarget.inbound.id;

            Log.debug(
                "Intent was resolved to the following target",
                JSON.stringify(oResolutionResult, null, 3),
                "sap.ushell.services.ClientSideTargetResolution"
            );
            ushellUtils.shallowMergeObject(oMatchingTarget.resolutionResult, oResolutionResult);

            return oMatchingTarget.resolutionResult;
        } catch (vMessage) {
            if (typeof vMessage === "string" && vMessage.indexOf("fallback:") >= 0) {
                const oResolutionResult = await this._constructFallbackResolutionResult(oMatchingTarget, sFixedHashFragment);
                ushellUtils.shallowMergeObject(oMatchingTarget.resolutionResult, oResolutionResult);

                return oMatchingTarget.resolutionResult;
            }

            throw vMessage;
        }
    };

    /**‚
     * Takes the parameters from startup parameters and inbound parameters.
     * For startup parameters, an array of parameter names is returned.
     * For inbound parameters, it is taken from inbound signature.
     *
     * If the inbound parameters are contained in the oMatchTarget, they are removed from the oMatchTarget function parameter.
     *
     * @param {object} oMatchingTarget The target that matches the given intent.
     * @returns {object} The reserved parameters.
     * @private
     */
    ClientSideTargetResolution.prototype._getReservedParameters = function (oMatchingTarget) {
        var aReservedStartupParameterNames = TechnicalParameters.getParameters({
            injectFrom: "startupParameter"
        }).map(function (oParam) {
            return oParam.name;
        });
        var oReservedParameters = _Utils.extractParameters(aReservedStartupParameterNames, oMatchingTarget.intentParamsPlusAllDefaults);
        // Parameter for the next navigation is always taken from the default value of the target mapping.
        // Even if the navigation was made with an intent parameter.
        TechnicalParameters.getParameters({
            injectFrom: "inboundParameter"
        }).forEach(function (oParameterToForward) {
            var sParameterToForwardName = oParameterToForward.name;
            var oSignatureParameters = oMatchingTarget.inbound && oMatchingTarget.inbound.signature && oMatchingTarget.inbound.signature.parameters;
            if (oSignatureParameters && Object.keys(oSignatureParameters).length > 0) {
                var oParameterToForwardName = oSignatureParameters[sParameterToForwardName];
                var bIsDefaultParameter = oParameterToForwardName && oParameterToForwardName.defaultValue && oParameterToForwardName.defaultValue.hasOwnProperty("value");
                var bIsFilterParameter = oParameterToForwardName && oParameterToForwardName.filter && oParameterToForwardName.filter.hasOwnProperty("value");
                if (oParameterToForwardName && (bIsFilterParameter || bIsDefaultParameter)) {
                    if (bIsDefaultParameter) {
                        oReservedParameters[sParameterToForwardName] = oParameterToForwardName.defaultValue.value;
                    } else {
                        oReservedParameters[sParameterToForwardName] = oParameterToForwardName.filter.value;
                    }
                } else {
                    delete oReservedParameters[sParameterToForwardName];
                }

                // no technical parameters should be passed to the application
                delete oMatchingTarget.intentParamsPlusAllDefaults[sParameterToForwardName];
                var iIdx = oMatchingTarget.defaultedParamNames.indexOf(sParameterToForwardName);
                if (iIdx >= 0) {
                    oMatchingTarget.defaultedParamNames.splice(iIdx, 1);
                }
            }
        });

        return oReservedParameters;
    };

    ClientSideTargetResolution.prototype._resolveTileIntent = async function (sHashFragment, oInboundIndex) {
        var sFixedHashFragment = sHashFragment.indexOf("#") === 0 ? sHashFragment : "#" + sHashFragment;
        var oShellHash = UrlParsing.parseShellHash(sFixedHashFragment);

        if (oShellHash === undefined) {
            Log.error(
                "Could not parse shell hash '" + sHashFragment + "'",
                "please specify a valid shell hash",
                "sap.ushell.services.ClientSideTargetResolution"
            );
            throw new Error("Cannot parse shell hash");
        }

        oShellHash.formFactor = ushellUtils.getFormFactor();

        const aMatchingTargets = await this._getMatchingInbounds(oShellHash, oInboundIndex, { bExcludeTileInbounds: false });

        if (aMatchingTargets.length === 0) {
            Log.warning(
                "Could not resolve " + sHashFragment,
                "no matching targets were found",
                "sap.ushell.services.ClientSideTargetResolution"
            );
            throw new Error("No matching targets found");
        }

        const oMatchingTarget = aMatchingTargets[0];
        return this._resolveSingleMatchingTileIntent(oMatchingTarget, sFixedHashFragment);
    };

    ClientSideTargetResolution.prototype._resolveSingleMatchingTileIntent = async function (oMatchingTarget, sFixedHashFragment) {
        var sApplicationType = (oMatchingTarget.inbound.resolutionResult || {}).applicationType;

        var fnExternalSystemAliasResolver;
        if (this._oAdapter.resolveSystemAlias) {
            fnExternalSystemAliasResolver = this._oAdapter.resolveSystemAlias.bind(this._oAdapter);
        }

        // rename Parameters
        _ParameterMapping.mapParameterNamesAndRemoveObjects(oMatchingTarget);

        const AppState = await Container.getServiceAsync("AppState");
        oMatchingTarget = await _XAppStateProcessing.mixAppStateIntoResolutionResultAndRename(oMatchingTarget, AppState);

        // remove parameters that should not make it to the URL (in any case!)
        delete oMatchingTarget.intentParamsPlusAllDefaults["sap-tag"];
        delete oMatchingTarget.mappedIntentParamsPlusSimpleDefaults["sap-tag"];
        oMatchingTarget.mappedDefaultedParamNames = oMatchingTarget.mappedDefaultedParamNames.filter(function (sParameterName) {
            return sParameterName !== "sap-tag";
        });

        var sBaseUrl = ObjectPath.get("inbound.resolutionResult.url", oMatchingTarget);

        let fnResultProcessor;

        if (ApplicationType[sApplicationType]) {
            fnResultProcessor = ApplicationType[sApplicationType].generateResolutionResult;
        } else {
            fnResultProcessor = () => {
                return this._constructFallbackResolutionResult(oMatchingTarget, sFixedHashFragment);
            };
        }

        const oResolutionResult = await fnResultProcessor(oMatchingTarget, sBaseUrl, fnExternalSystemAliasResolver);

        ushellUtils.shallowMergeObject(oMatchingTarget.resolutionResult, oResolutionResult);

        // beware, shallow copy of central object! only modify root properties!
        var oTileResolutionResult = fnExtend({}, oMatchingTarget.inbound.tileResolutionResult);

        oTileResolutionResult.startupParameters = oMatchingTarget.effectiveParameters;

        var oNavModeProperties = NavigationMode.getNavigationMode(
            oResolutionResult,
            (oMatchingTarget.intentParamsPlusAllDefaults["sap-ushell-navmode"] || [])[0],
            (oMatchingTarget.intentParamsPlusAllDefaults["sap-ushell-next-navmode"] || [])[0]
        );
        ushellUtils.shallowMergeObject(oTileResolutionResult, oNavModeProperties);

        Log.debug(
            "Tile Intent was resolved to the following target",
            JSON.stringify(oTileResolutionResult, null, 3),
            "sap.ushell.services.ClientSideTargetResolution"
        );
        return oTileResolutionResult;
    };

    /**
     * The following table compares the capabilities and behavior of the different technologies:
     *                                                       SAPUI5  URL  WDA  WebGui  WebGuiWrapped  WCF
     * server/port/client etc altered                           N     Y    Y      Y          Y         Y
     * sap-system part of URL                                   Y     Y    N      N          N         N
     * sap-ushell-defaultedParametersNames part of URL          Y     Y    Y      N          N         Y
     * parameters compacted                                     Y     N    Y      N          N         Y
     */

    /**
     * Construct the resolution result of the given matching delegating the
     * actual construction of the resolution result to a given fallback function.
     *
     * @param {object} oMatchingTarget The matching target to amend with the resolution result.
     * @param {string} sFixedHashFragment The hash fragment to be resolved with a guaranteed "#" prefix.
     * @returns {Promise} Resolves with the ResolutionResult or rejects with an error message if the fallback fails.
     * @private
     */
    ClientSideTargetResolution.prototype._constructFallbackResolutionResult = async function (oMatchingTarget, sFixedHashFragment) {
        // The current flow is to resolve the result with all *uncompressed* default substituted parameters and alters
        // appState compress the url afterwards if needed (the fallback function takes care of this).
        var oEffectiveParameters = {};

        Object.keys(oMatchingTarget.intentParamsPlusAllDefaults).forEach(function (sParamName) {
            if (Array.isArray(oMatchingTarget.intentParamsPlusAllDefaults[sParamName])) {
                oEffectiveParameters[sParamName] = oMatchingTarget.intentParamsPlusAllDefaults[sParamName];
            }
        });
        var aDefaultedParamNames = oMatchingTarget.mappedDefaultedParamNames || oMatchingTarget.defaultedParamNames;
        if (aDefaultedParamNames.length > 0) {
            oEffectiveParameters["sap-ushell-defaultedParameterNames"] = [JSON.stringify(aDefaultedParamNames)];
        }

        // fallback
        Log.warning(
            "Cannot resolve hash fragment client side",
            sFixedHashFragment + " has matched an inbound that cannot be resolved client side. Using fallback logic",
            "sap.ushell.services.ClientSideTargetResolution"
        );

        // NOTE: the callback function will be invoked with the effective *unmapped* parameter names! as 3rd argument
        const oFallbackResolutionResult = await this._resolveHashFragmentWithFallback(
            sFixedHashFragment,
            fnExtend({}, oMatchingTarget.inbound), // don't let adapters to change the inbound member
            oEffectiveParameters
        );

        var oResolutionResult = {};
        // propagate properties from the resolution result returned by the fallback function
        ["applicationType", "additionalInformation", "url", "applicationDependencies", "text"].forEach(function (sPropName) {
            if (oFallbackResolutionResult.hasOwnProperty(sPropName)) {
                oResolutionResult[sPropName] = oFallbackResolutionResult[sPropName];
            }
        });

        return oResolutionResult;
    };

    /**
     * Returns a list of unique semantic objects assigned to the current user.
     * The semantic objects coming from an inbound with hideIntentLink set to <code>true</code>
     * are not returned since these inbounds are not returned by getLinks.
     *
     * @returns {Promise<object[]>} Resolves with an array of strings representing
     *   the User's semantic objects or rejects with an error message.
     *   NOTE: semantic objects are returned in lexicographical order in the result array.
     * @private
     * @since 1.38.0
     */
    ClientSideTargetResolution.prototype.getDistinctSemanticObjects = async function () {
        var oSemanticObjects = {};
        const oInboundIndex = await this._oInboundProvider.getInbounds();

        oInboundIndex.getAllInbounds().forEach(function (oInbound) {
            if (typeof oInbound.semanticObject === "string" && oInbound.semanticObject !== "*" &&
                !oInbound.hideIntentLink && oInbound.semanticObject.length > 0) {
                oSemanticObjects[oInbound.semanticObject] = true;
            }
        });

        return Object.keys(oSemanticObjects).sort();
    };

    /**
     * Resolves a semantic object/action and business parameters to a list of links,
     * taking into account the form factor of the current device.
     *
     * @param {object} oArgs An object containing nominal arguments for the method, having the following structure:
     *   {
     *      semanticObject: "Object", // optional (matches all semantic objects)
     *      action: "action",         // optional (matches all actions)
     *      params: {                 // optional business parameters
     *         A: "B",
     *         C: ["e", "j"]
     *      },
     *      paramsOptions: [          // optional
     *         { name: "A", required: true }
     *      ],
     *      ignoreFormFactor: true,    // (optional) defaults to false
     *      treatTechHintAsFilter : true, // (optional) default false
     *
     *      // List of tags under which the returned links may belong to.
     *      tags: [ "tag-A", "tag-B" ] // (optional) defaults to undefined
     *   }
     *   Note: positional arguments supported prior to version 1.38.0 are now deprecated.
     *   The caller should always specify nominal parameters, using an object.
     *   Also, wildcards for semanticObject and action parameters are now expressed via <code>undefined</code>,
     *   or by just omitting the parameter in the object.
     *   Note: treatTechHintAsFilter does a plain filtering on technology if supplied it does *not* do conflict resolution.
     *   Example: "UI5" ?P1=1 "(UI5)"
     *            "WDA" ?P1=1 "(WDA)"
     *            "GUI"       "(GUI)"
     *   Calling getLinks with P1=1&sap-ui-tech-hint=GUI will return "A-b?P1=1&sap-ui-tech-hint=GUI" and the text "(GUI)".
     *   Resolving "A-b?P1=1&sap-ui-tech-hint=GUI" will always invoke UI5 (!).
     * @returns {Promise<object[]>} Resolves with an array of links objects containing (at least) the following properties:
     *   <pre>
     *   {
     *      intent: "#AnObject-Action?A=B&C=e&C=j",
     *      text: "Perform action",
     *      icon: "sap-icon://Fiori2/F0018", // optional
     *      subTitle: "Action"               // optional
     *      shortTitle: "Perform"            // optional
     *   }
     *   </pre>
     * @private
     * @since 1.38.0
     */
    ClientSideTargetResolution.prototype.getLinks = async function (oArgs) {
        var oCallArgs;

        if (arguments.length === 1 && fnIsPlainObject(arguments[0])) {
            var oNominalArgs = arguments[0];
            oCallArgs = fnExtend({}, oNominalArgs);
            // assure action: undefined in transported, as there is a check on this below !?!
            ["action", "semanticObject"].forEach(function (sArg) {
                if (oNominalArgs.hasOwnProperty(sArg)) {
                    oCallArgs[sArg] = oNominalArgs[sArg];
                }
            });
            if (oCallArgs.appStateKey) {
                oCallArgs.params = oCallArgs.params || {};
                oCallArgs.params["sap-xapp-state"] = [oCallArgs.appStateKey];
                delete oCallArgs.appStateKey;
            }

            // note, may be a 1.38+ call or a pre 1.38 call if without action.
        } else if (arguments.length <= 3) {
            // 3 parameters: pre-1.38.0 behavior, parameters are sSemanticObject, mParameters, bIgnoreFormFactor
            // NOTE: in 1.38.0 only the first argument is mandatory!
            // NOTE: in theory there should be no public caller of this method (it's private) apart from some sample apps.
            Log.warning(
                "Passing positional arguments to getLinks is deprecated",
                "Please use nominal arguments instead",
                "sap.ushell.services.ClientSideTargetResolution"
            );

            // old 3-arguments tuple
            var sSemanticObject = arguments[0];
            var mParameters = arguments[1];
            var bIgnoreFormFactor = arguments[2];

            oCallArgs = { // NOTE: no action passed here
                semanticObject: sSemanticObject,
                params: mParameters,
                ignoreFormFactor: bIgnoreFormFactor
            };
        } else {
            throw new Error("Invalid arguments for getLinks");
        }

        const oInboundIndex = await this._oInboundProvider.getInbounds();
        const aLinks = await this._getLinks(oCallArgs, oInboundIndex);

        return aLinks;
    };

    /**
     * Validate input arguments for <code>_getLinks</code> and log the first input validation error.
     *
     * @param {object} oArgs An object of nominal parameters.
     * @returns {string} An error message if validation was not successful or undefined in case of successful validation.
     * @private
     */
    ClientSideTargetResolution.prototype._validateGetSemanticObjectLinksArgs = function (oArgs) {
        var sSemanticObject = oArgs.semanticObject;
        var sAction = oArgs.action;
        var bIsPre138Call = !oArgs.hasOwnProperty("action"); // action always passed in ushell-lib 1.38.0+

        if (typeof sSemanticObject !== "undefined" || bIsPre138Call) {
            if (typeof sSemanticObject !== "string") {
                Log.error("invalid input for _getLinks",
                    "the semantic object must be a string, got " + Object.prototype.toString.call(sSemanticObject) + " instead",
                    "sap.ushell.services.ClientSideTargetResolution");
                return "invalid semantic object";
            }
            if (bIsPre138Call && sSemanticObject.match(/^\s+$/)) {
                Log.error("invalid input for _getLinks",
                    "the semantic object must be a non-empty string, got '" + sSemanticObject + "' instead",
                    "sap.ushell.services.ClientSideTargetResolution");
                return "invalid semantic object";
            }
            if (!bIsPre138Call && sSemanticObject.length === 0) {
                Log.error("invalid input for _getLinks",
                    "the semantic object must not be an empty string, got '" + sSemanticObject + "' instead",
                    "sap.ushell.services.ClientSideTargetResolution");
                return "invalid semantic object";
            }
        }
        if (typeof sAction !== "undefined") {
            if (typeof sAction !== "string") {
                Log.error("invalid input for _getLinks",
                    "the action must be a string, got " + Object.prototype.toString.call(sAction) + " instead",
                    "sap.ushell.services.ClientSideTargetResolution");
                return "invalid action";
            }
            if (sAction.length === 0) {
                Log.error("invalid input for _getLinks",
                    "the action must not be an empty string, got '" + sAction + "' instead",
                    "sap.ushell.services.ClientSideTargetResolution");
                return "invalid action";
            }
        }

        return undefined;
    };

    /**
     * Internal implementation of getLinks.
     *
     * @param {object} oArgs An object containing nominal parameters for getLinks like:
     *   <pre>
     *   {
     *     semanticObject: "...",       // optional
     *     action: "...",               // optional
     *     params: { ... },             // optional, note this is always passed in compact format, compatibly with URLParsing.paramsToString
     *                                  // See sap.ushell.services.Navigation.LinkFilter for information on extended format.
     *     paramsOptions: [             // optional
     *        { name: "A", required: true }
     *     ],
     *     appStateKey : string         // optional, better put into params!
     *     withAtLeastOneUsedParam: true, // allows to obtain only those links that, when resolved, would result in at least one
     *                                    // of the parameters from 'params' to be used in the target URL.
     *                                    // Note that by construction this parameter is effective when inbounds specify additionalParameters:
     *                                    // "ignored". In fact if additional parameters are allowed, these would be still be processed
     *                                    // (therefore used) when the navigation occurs.
     *     ignoreFormFactor: true|false // optional, defaults to true
     *   }
     *   </pre>
     * @param {object} oInboundIndex An inbound index to retrieve the get semantic object links from.
     * @returns {Promise<object[]>} An array of link objects containing (at least) the following properties:
     *   <pre>
     *   {
     *     intent: "#AnObject-Action?A=B&C=e&C=j",
     *     text: "Perform action",
     *     icon: "sap-icon://Fiori2/F0018", // optional
     *     subTitle: "Action"               // optional
     *     shortTitle: "Perform"            // optional
     *   }
     *   </pre>
     * @private
     */
    ClientSideTargetResolution.prototype._getLinks = async function (oArgs, oInboundIndex) {
        var sSemanticObject = oArgs.semanticObject;
        var sAction = oArgs.action;
        var mParameters = oArgs.params;
        var bWithAtLeastOneUsedParam = !!oArgs.withAtLeastOneUsedParam;
        var bTreatTechHintAsFilter = !!oArgs.treatTechHintAsFilter;
        var bIgnoreFormFactor = oArgs.ignoreFormFactor;
        var sSortProperty = oArgs.hasOwnProperty("sortResultsBy")
            ? oArgs.sortResultsBy
            : "intent";

        if (oArgs.hasOwnProperty("sortResultOnTexts")) {
            Log.warning(
                "the parameter 'sortResultOnTexts' was experimental and is no longer supported",
                "getLinks results will be sorted by '" + sSortProperty + "'",
                "sap.ushell.services.ClientSideTargetResolution"
            );
        }

        var oInboundsConstraints = { bExcludeTileInbounds: true };

        var sErrorMessage = this._validateGetSemanticObjectLinksArgs(oArgs);

        if (oArgs.tags) {
            oInboundsConstraints.tags = oArgs.tags;
        }

        if (sErrorMessage) {
            throw new Error(sErrorMessage);
        }

        if (sSemanticObject === "*") {
            // shortcut: skip matching inbounds and return directly; it can only match "*" and we don't return it anyway
            return [];
        }

        /**
         * Returns ?-prefixed business parameters
         */
        function fnConstructBusinessParamsString (mParams) {
            var sBusinessParams = UrlParsing.paramsToString(mParams);
            return sBusinessParams ? "?" + sBusinessParams : "";
        }

        var sFormFactor = ushellUtils.getFormFactor();
        var oAllIntentParams = UrlParsing.parseParameters(fnConstructBusinessParamsString(mParameters));
        var oShellHash = {
            semanticObject: (sSemanticObject === "" ? undefined : sSemanticObject),
            action: sAction, // undefined: match all actions
            formFactor: (bIgnoreFormFactor ? undefined : sFormFactor), // undefined: match any form factor
            params: oAllIntentParams
        };
        if (bTreatTechHintAsFilter) {
            oShellHash.treatTechHintAsFilter = true;
        }

        const aMatchingTargets = await this._getMatchingInbounds(oShellHash, oInboundIndex, oInboundsConstraints);

        var oUniqueIntents = {};
        var aResults = aMatchingTargets
            .map(function (oMatchResult) {
                var sAdjustedSemanticObject = sSemanticObject || oMatchResult.inbound.semanticObject;
                var sIntent = "#" + sAdjustedSemanticObject + "-" + oMatchResult.inbound.action;
                var oNeededParameters;

                // we never return "*" semantic objects from getLinks as they are not parsable links
                if (sAdjustedSemanticObject === "*") {
                    return undefined;
                }

                // we never want to return "*" actions from getLinks as they are non parsable links
                if (oMatchResult.inbound.action === "*") {
                    return undefined;
                }

                if (oMatchResult.inbound && oMatchResult.inbound.hasOwnProperty("hideIntentLink") && oMatchResult.inbound.hideIntentLink === true) {
                    return undefined;
                }

                if (!oUniqueIntents.hasOwnProperty(sIntent)) {
                    oUniqueIntents[sIntent] = {
                        matchingInbound: oMatchResult.inbound,
                        count: 1
                    };

                    if (oMatchResult.inbound.signature.additionalParameters === "ignored") {
                        // in the result do not show all intent parameters, but only those mentioned by the inbound
                        oNeededParameters = _Utils.filterObjectKeys(oAllIntentParams, function (sIntentParam) {
                            return (sIntentParam.indexOf("sap-") === 0) || oMatchResult.inbound.signature.parameters.hasOwnProperty(sIntentParam);
                        }, false);
                    } else {
                        oNeededParameters = oAllIntentParams;
                    }

                    // --- begin of post-match reject reasons

                    if (bWithAtLeastOneUsedParam) {
                        var bAtLeastOneNonSapParam = Object.keys(oNeededParameters).some(function (sNeededParamName) {
                            return sNeededParamName.indexOf("sap-") !== 0;
                        });
                        if (!bAtLeastOneNonSapParam) {
                            oUniqueIntents[sIntent].hideReason = "getLinks called with 'withAtLeastOneUsedParam = true', but the inbound had no business parameters defined.";
                            return undefined;
                        }
                    }

                    var bSignatureMeetsParameterOptions = _Utils.inboundSignatureMeetsParameterOptions(
                        oMatchResult.inbound.signature.parameters,
                        oArgs.paramsOptions || []
                    );
                    if (!bSignatureMeetsParameterOptions) {
                        oUniqueIntents[sIntent].hideReason = "inbound signature does not meet the requested parameter filter options";
                        return undefined;
                    }

                    // --- end of post-match reject reasons

                    var oResult = {
                        intent: sIntent + fnConstructBusinessParamsString(oNeededParameters),
                        text: oMatchResult.inbound.title
                    };

                    if (oMatchResult.inbound.icon) {
                        oResult.icon = oMatchResult.inbound.icon;
                    }
                    if (oMatchResult.inbound.subTitle) {
                        oResult.subTitle = oMatchResult.inbound.subTitle;
                    }
                    if (oMatchResult.inbound.shortTitle) {
                        oResult.shortTitle = oMatchResult.inbound.shortTitle;
                    }

                    var sInboundTag = ObjectPath.get("inbound.signature.parameters.sap-tag.defaultValue.value", oMatchResult);
                    if (sInboundTag) {
                        oResult.tags = [sInboundTag];
                    }

                    return oResult;
                }
                // for debugging purposes
                oUniqueIntents[sIntent].count++;

                return undefined;
            })
            .filter(function (oSemanticObjectLink) {
                return typeof oSemanticObjectLink === "object";
            });

        if (sSortProperty !== "priority") {
            aResults.sort(function (oGetSoLinksResult1, oGetSoLinksResult2) {
                return oGetSoLinksResult1[sSortProperty] < oGetSoLinksResult2[sSortProperty] ? -1 : 1;
            });
        }

        if (aResults.length === 0) {
            Log.debug("_getLinks returned no results");
        } else if (Log.getLevel() >= Log.Level.DEBUG) {
            if (Log.getLevel() >= Log.Level.TRACE) {
                var aResultLines = [];
                var aHiddenResultLines = [];

                aResults.forEach(function (oResult) {
                    var sIntent = oResult.intent.split("?")[0];

                    if (oUniqueIntents[sIntent].hideReason) {
                        aHiddenResultLines.push([
                            "-", sIntent + "(" + oUniqueIntents[sIntent].hideReason + ")\n",
                            " text:", oResult.text + "\n",
                            " full intent:", oResult.intent
                        ].join(" "));
                    } else {
                        aResultLines.push([
                            "-", sIntent,
                            oUniqueIntents[sIntent].count > 1
                                ? "(" + (oUniqueIntents[sIntent].count - 1) + " others matched)\n"
                                : "\n",
                            "text:", oResult.text + "\n",
                            "full intent:", oResult.intent
                        ].join(" "));
                    }
                });

                Log.debug(
                    "_getLinks filtered to the following unique intents:",
                    "\n" + aResultLines.join("\n"),
                    "sap.ushell.services.ClientSideTargetResolution"
                );

                Log.debug(
                    "_getLinks would have also returned the following unique intents, but something prevented this:",
                    aHiddenResultLines.join("\n"),
                    "sap.ushell.services.ClientSideTargetResolution"
                );
            } else {
                Log.debug(
                    "_getLinks filtered to unique intents.",
                    "Reporting histogram: \n - " + Object.keys(oUniqueIntents).join("\n - "),
                    "sap.ushell.services.ClientSideTargetResolution"
                );
            }
        }
        return aResults;
    };

    /**
     * Matches the given resolved shell hash against all the inbounds.
     *
     * @param {object} oShellHash The resolved hash fragment. This is an object like:
     *   <pre>
     *   {
     *     semanticObject: "SomeSO" // or undefined
     *     action: "someAction"     // or undefined
     *     formFactor: "desktop"    // or tablet, phone, or undefined
     *     params: {
     *       name: ["value"],
     *       ...
     *     }
     *   }
     *   </pre>
     *   where <code>undefined</code> value represent wildcards.
     * @param {object} oInboundIndex An inbound index to match the intent against.
     * @param {object} [oConstraints] Constraints object.
     * @param {boolean} [oConstraints.bExcludeTileInbounds] Whether the tile inbounds should be filtered out during matching.
     *   Defaults to <code>false</code>. Tile inbounds can be distinguished by other inbounds because they specify the following:
     *   <pre>
     *   {
     *     ...
     *     tileResolutionResult: { isCustomTile: true }
     *     ...
     *   }
     *   </pre>
     * @param {string[]} [oConstraints.tags] Tags to which the queried inbounds should belong to.
     * @returns {Promise<object[]>} A sorted array of matching targets.
     *   A target is a matching result that in addition has a specific priority with respect to other matching targets.
     * @private
     * @since 1.32.0
     */
    ClientSideTargetResolution.prototype._getMatchingInbounds = async function (oShellHash, oInboundIndex, oConstraints) {
        var that = this;
        var aTags;
        var iLogId;
        var bExcludeTileInbounds;
        var aPreFilteredInbounds;

        if (oConstraints) {
            aTags = oConstraints.tags;
            bExcludeTileInbounds = oConstraints.bExcludeTileInbounds;
        }

        if (Log.getLevel() >= Log.Level.DEBUG) {
            iLogId = ++that._iLogId;
        }

        _StagedLogger.begin(function () {
            // This function exists because wildcards (represented with undefined) break URLParsing#constructShellHash.
            // URLParsing wants a valid semantic object/action to produce correct output.
            function constructShellHashForLogging (oMaybeWildcardedHash) {
                var sActionExplicit = oMaybeWildcardedHash.action || (
                    typeof oMaybeWildcardedHash.action === "undefined"
                        ? "<any>"
                        : "<invalid-value>"
                );

                var sSemanticObjectExplicit = oMaybeWildcardedHash.semanticObject || (
                    typeof oMaybeWildcardedHash.semanticObject === "undefined"
                        ? "<any>"
                        : "<invalid-value>"
                );

                return UrlParsing.constructShellHash({
                    semanticObject: sSemanticObjectExplicit,
                    action: sActionExplicit,
                    params: oMaybeWildcardedHash.params
                });
            }

            var sIntent = constructShellHashForLogging(oShellHash);

            return {
                logId: iLogId,
                title: "Matching Intent '" + sIntent + "' to inbounds (form factor: " + (oShellHash.formFactor || "<any>") + ")",
                moduleName: "sap.ushell.services.ClientSideTargetResolution",
                stages: [
                    "STAGE1: Find matching inbounds",
                    "STAGE2: Resolve references",
                    "STAGE3: Rematch with references",
                    "STAGE4: Sort matched targets"
                ]
            };
        });

        // output logs before returning
        function endLogger () {
            _StagedLogger.end(() => {
                return { logId: iLogId };
            });
        }

        var sSemanticObject = oShellHash.semanticObject;
        var sAction = oShellHash.action;
        this._oShellHash = oShellHash;

        // oInboundIndex.getSegment called with second argument 'sAction' although it accepts only one.
        // The test on the method in question does not test calls with 2 arguments. Does this call indicate a desirable we should implement?
        var aInbounds = aTags ? oInboundIndex.getSegmentByTags(aTags) : oInboundIndex.getSegment(sSemanticObject, sAction);

        // logic that filters independently on the target to be matched goes here
        if (bExcludeTileInbounds) {
            aPreFilteredInbounds = aInbounds.filter(function (oInbound) {
                // keep all non custom tiles
                return !oInbound.tileResolutionResult || !oInbound.tileResolutionResult.isCustomTile;
            });
        } else {
            aPreFilteredInbounds = aInbounds;
        }

        var fnGetContentProviderLookup = null;
        if (this._oAdapter.getContentProviderDataOriginsLookup) {
            fnGetContentProviderLookup = this._oAdapter.getContentProviderDataOriginsLookup.bind(this._oAdapter);
        }

        // initial match
        const oInitialMatchResult = await _Search.match(oShellHash, aPreFilteredInbounds, {} /* known default */, fnGetContentProviderLookup, Log.getLevel() >= Log.Level.DEBUG);

        // ========================= Stage 1 ================================
        // resolve References
        _StagedLogger.log(function () {
            return {
                logId: iLogId,
                stage: 1,
                prefix: "\u2718", // heavy black X
                lines: Object.keys(oInitialMatchResult.noMatchReasons || {}).map(function (sInbound) {
                    return sInbound + " " + oInitialMatchResult.noMatchReasons[sInbound];
                })
            };
        });

        _StagedLogger.log(function () {
            var aLines = oInitialMatchResult.matchResults.map(function (oMatchResult) {
                return _Formatter.formatInbound(oMatchResult.inbound);
            });
            return {
                logId: iLogId,
                stage: 1,
                prefix: aLines.length > 0
                    ? "\u2705" // green checkmark
                    : "\u2718", // heavy black X
                lines: aLines.length > 0
                    ? aLines
                    : ["No inbound was matched"]
            };
        });

        var oMissingReferences = {};
        var bNeedToResolve = false;
        var aContentProviders = Object.keys(oInitialMatchResult.missingReferences);
        aContentProviders.forEach(function (sContentProviderId) {
            var aReferences = Object.keys(oInitialMatchResult.missingReferences[sContentProviderId]);
            bNeedToResolve = bNeedToResolve || aReferences.length > 0;
            oMissingReferences[sContentProviderId] = aReferences;
        });

        aContentProviders = aContentProviders.filter(function (sContentProviderId) {
            if (oMissingReferences[sContentProviderId].length > 0) {
                return true;
            }
            delete oMissingReferences[sContentProviderId];
            return false;
        });


        // ========================= Stage 2 ================================
        // resolve references
        let oInitialMatchWithReferencesResult;
        if (bNeedToResolve) {
            try {
                aContentProviders.forEach(function (sContentProviderId) {
                    _StagedLogger.log(function () {
                        return {
                            logId: iLogId,
                            stage: 2,
                            line: "@ Must resolve the following references with contentProviderId = \"" + sContentProviderId + "\":",
                            prefix: "\u2022", // bullet point
                            lines: oMissingReferences[sContentProviderId]
                        };
                    });
                });

                const ReferenceResolver = await Container.getServiceAsync("ReferenceResolver");

                const aSystemContexts = await Promise.all(aContentProviders.map((sContentProviderId) => {
                    return this.getSystemContext(sContentProviderId);
                }));
                const aResolvedRefs = await Promise.all(aContentProviders.map(function (sContentProviderId, iIndex) {
                    return ReferenceResolver.resolveReferences(oMissingReferences[sContentProviderId], aSystemContexts[iIndex]);
                }));

                var oResult = {
                    matchResults: oInitialMatchResult.matchResults,
                    referencesToInclude: {}
                };
                aContentProviders.forEach(function (sContentProviderId, iIndex) {
                    var oResolvedRefs = aResolvedRefs[iIndex];
                    oResult.referencesToInclude[sContentProviderId] = oResolvedRefs;
                    if (Object.keys(oResolvedRefs).length > 0) {
                        _StagedLogger.log(function () {
                            return {
                                logId: iLogId,
                                stage: 2,
                                line: "\u2705 resolved references with contentProviderId = \"" + sContentProviderId + "\" to the following values:",
                                prefix: "\u2022", // bullet point
                                lines: Object.keys(oResolvedRefs).map(function (sRefName) {
                                    return sRefName + ": '" + oResolvedRefs[sRefName] + "'";
                                })
                            };
                        });
                    }
                });
                oInitialMatchWithReferencesResult = oResult;
            } catch (sError) {
                _StagedLogger.log(function () {
                    return {
                        logId: iLogId,
                        stage: 2,
                        prefix: "\u274c", // red X
                        line: "Failed to resolve references: " + sError
                    };
                });

                // don't continue processing, just exit with an empty result set
                endLogger();
                return [];
            }
        } else { // no references to resolve
            _StagedLogger.log(function () {
                return {
                    logId: iLogId,
                    stage: 2,
                    prefix: "\u2705", // green checkmark
                    line: "No need to resolve references"
                };
            });

            oInitialMatchWithReferencesResult = {
                matchResults: oInitialMatchResult.matchResults,
                referencesToInclude: null
            };
        }

        // ========================= Stage 3 ================================
        // re-match with resolved references
        let oFinalMatchResult;
        if (oInitialMatchWithReferencesResult.referencesToInclude) {
            // rematch using the set of the already matched inbounds
            var aMatchResults = oInitialMatchWithReferencesResult.matchResults;
            var aMatchingInbounds = aMatchResults.map(function (oMatchResult) {
                return oMatchResult.inbound;
            });

            oFinalMatchResult = await _Search.match(oShellHash, aMatchingInbounds, oInitialMatchWithReferencesResult.referencesToInclude, fnGetContentProviderLookup, 0 /* iDebugLevel */);
            _StagedLogger.log(function () {
                var aMatchResults = oFinalMatchResult.matchResults || [];
                if (aMatchResults.length >= 1) {
                    return {
                        logId: iLogId,
                        stage: 3,
                        line: "The following inbounds re-matched:",
                        lines: aMatchResults.map(function (oMatchResult) {
                            return _Formatter.formatInbound(oMatchResult.inbound);
                        }),
                        prefix: "\u2705" // green checkmark
                    };
                }

                return {
                    logId: iLogId,
                    stage: 3,
                    line: "No inbounds re-matched",
                    prefix: "-"
                };
            });
        } else { // no references, skip re-match
            _StagedLogger.log(function () {
                return {
                    logId: iLogId,
                    stage: 3,
                    line: "rematch was skipped (no references to resolve)",
                    prefix: "\u2705" // green checkmark
                };
            });
            oFinalMatchResult = oInitialMatchWithReferencesResult;
        }

        // ========================= Stage 4 ================================
        // sorting
        var aMatchResultsToSort = oFinalMatchResult.matchResults || [];
        if (aMatchResultsToSort.length <= 1) {
            _StagedLogger.log(function () {
                return {
                    logId: iLogId,
                    stage: 4,
                    line: "Nothing to sort"
                };
            });

            endLogger();
            return aMatchResultsToSort;
        }

        var aSortedMatchResults = _Search.sortMatchingResultsDeterministic(oFinalMatchResult.matchResults || []);

        _StagedLogger.log(function () {
            var aLines = aSortedMatchResults.map(function (oMatchResult) {
                return _Formatter.formatInbound(oMatchResult.inbound || {}) +
                    (oMatchResult.matchesVirtualInbound ? " (virtual)" : "")
                    + "\n[ Sort Criteria ] "
                    + "\n * 1 * sap-priority: '" + oMatchResult["sap-priority"] + "'"
                    + "\n * 2 * Sort string: '" + oMatchResult.priorityString
                    + "\n * 3 * Deterministic blob: '" + _Search.serializeMatchingResult(oMatchResult) + "'";
            });

            return {
                logId: iLogId,
                stage: 4,
                line: "Sorted inbounds as follows:",
                lines: aLines,
                prefix: ".",
                number: true
            };
        });


        endLogger();
        return aSortedMatchResults;
    };

    /**
     * Determines whether a single intent matches one or more navigation targets.
     *
     * @param {string} sIntent The intent to be matched.
     * @param {object} oInboundIndex The index of the inbounds to be matched.
     * @returns {Promise<boolean>} Resolves with a boolean if the intent is supported and rejected if not.
     *   The promise resolves to true if only one target matches the intent, and false if multiple targets match the intent.
     * @private
     * @since 1.32.0
     */
    ClientSideTargetResolution.prototype._isIntentSupportedOne = async function (sIntent, oInboundIndex) {
        var oShellHash = UrlParsing.parseShellHash(sIntent);
        // navigation to '#' is always considered possible
        if (sIntent === "#") {
            return true;
        }
        if (oShellHash === undefined) {
            throw new Error(`Could not parse shell hash '${sIntent}'`);
        }

        oShellHash.formFactor = ushellUtils.getFormFactor();

        const aTargets = await this._getMatchingInbounds(oShellHash, oInboundIndex, { bExcludeTileInbounds: true });

        return aTargets.length > 0;
    };

    /**
     * Tells whether the given intent(s) are supported, taking into account the form factor of the current device.
     * "Supported" means that navigation to the intent is possible.
     *
     * @param {string[]} aIntents The intents (such as <code>"#AnObject-Action?A=B&C=e&C=j"</code>) to be checked.
     * @returns {Promise<object>} Resolves a map containing the intents from
     *   <code>aIntents</code> as keys. The map values are objects with a property <code>supported</code> of type <code>boolean</code>.
     *   Example:
     *   <pre>
     *   {
     *     "#AnObject-Action?A=B&C=e&C=j": { supported: false },
     *     "#AnotherObject-Action2": { supported: true }
     *   }
     *   </pre>
     * @private
     * @since 1.32.0
     */
    ClientSideTargetResolution.prototype.isIntentSupported = async function (aIntents) {
        const oInboundIndex = await this._oInboundProvider.getInbounds();
        const oSupportedByIntent = await this._isIntentSupported(aIntents, oInboundIndex);

        return oSupportedByIntent;
    };

    ClientSideTargetResolution.prototype._isIntentSupported = async function (aIntents, oInboundIndex) {
        var oSupportedByIntent = {};

        await Promise.all(aIntents.map(async (sIntent) => {
            try {
                const bSupported = await this._isIntentSupportedOne(sIntent, oInboundIndex);
                oSupportedByIntent[sIntent] = {
                    supported: bSupported
                };
            } catch (oError) {
                throw new Error(`One or more input intents contain errors: ${oError}`);
            }
        }));

        return oSupportedByIntent;
    };

    /**
     * Finds and returns all unique user default parameter names referenced in inbounds.
     *
     * @param {object} oSystemContext The systemContext for which the user default parameter names should be returned.
     * @returns {Promise<object>} Resolves to an object with the following structure
     * <pre>
     *   {
     *     simple: {
     *       parameternamextractUserDefaultReferenceName1: {},
     *       parametername2: {}
     *     }
     *     extended: {
     *       parametername3: {},
     *       parametername4: {}
     *     }
     *   }
     * </pre>
     *   The name of a user default parameter referenced in an inbound.
     *   NOTE: the parameter names do not include surrounding special syntax. Only the inner part is returned.
     *   For example: "UserDefault.ParameterName" is returned as "ParameterName"
     * @private
     * @since 1.32.0
     */
    ClientSideTargetResolution.prototype.getUserDefaultParameterNames = async function (oSystemContext) {
        // the empty objects may in future bear information like sap-system relevance

        const oInboundIndex = await this._oInboundProvider.getInbounds();
        const oRefs = await this._getUserDefaultParameterNames(oInboundIndex.getAllInbounds(), oSystemContext);

        return oRefs;
    };

    ClientSideTargetResolution.prototype._getUserDefaultParameterNames = function (aInbounds, oSystemContext) {
        var oRefs = {
            simple: {},
            extended: {}
        };

        aInbounds = aInbounds.filter(function (oInb) {
            if (oInb.contentProviderId === undefined && oSystemContext.id === "") {
                return true;
            }
            return oInb.contentProviderId === oSystemContext.id;
        });
        return Container.getServiceAsync("ReferenceResolver").then(function (oRefResolverService) {
            aInbounds.forEach(function (oTm) {
                var oSignatureParams = oTm.signature && oTm.signature.parameters || [];

                Object.keys(oSignatureParams).forEach(function (sParamName) {
                    var oParam = oSignatureParams[sParamName];
                    var sReferenceParamName;

                    if (oParam) {
                        // first try to get the user default value from the filter

                        if (oParam.filter && oParam.filter.format === "reference") {
                            sReferenceParamName = oParam.filter.value;
                        } else if (oParam.defaultValue && oParam.defaultValue.format === "reference") {
                            sReferenceParamName = oParam.defaultValue.value;
                        }

                        if (typeof sReferenceParamName === "string") {
                            // only extract user defaults
                            var sRefName = oRefResolverService.extractUserDefaultReferenceName(sReferenceParamName);
                            if (typeof sRefName === "string") {
                                oRefs.simple[sRefName] = {};
                            }
                            var sExtendedRefName = oRefResolverService.extractExtendedUserDefaultReferenceName(sReferenceParamName);
                            if (typeof sExtendedRefName === "string") {
                                oRefs.extended[sExtendedRefName] = {};
                            }
                        }
                    }
                });
            });
            return oRefs;
        });
    };

    /**
     * Returns the list of easy access systems provided via specific inbounds.
     *
     * The admin can define one or more of <code>Shell-start*</code> inbounds.
     * In case multiple <code>Shell-start*</code> inbounds are defined with the same system alias,
     * the title will be chosen from the inbound with the most priority, which is as follows:
     * <ol>
     *   <li>Shell-startGUI</li>
     *   <li>Shell-startWDA</li>
     *   <li>Shell-startURL</li>
     * </ol>
     *
     * @param {string} [sMenuType=sapMenu] The type of menu to return the entries for. This can be one of "userMenu" or "sapMenu".
     *   If this parameter is not specified, just the entries for the sap menu will be returned for the sap menu are returned.
     * @returns {Promise<object>} Resolves with an object containing the systems:
     *   <pre>
     *   {
     *     <system alias {string}>: { text: <text to be displayed in the system list {string}> }
     *   }
     *   </pre>
     *   Example:
     *   <pre>
     *   {
     *     AB1CLNT000: {
     *       text: "CRM Europe",
     *       appType: {
     *         WDA: true,
     *         GUI: true,
     *         URL: true
     *       }
     *     }
     *   }
     *   </pre>
     * @private
     * @since 1.38.0
     */
    ClientSideTargetResolution.prototype.getEasyAccessSystems = function (sMenuType) {
        // default
        sMenuType = sMenuType || "sapMenu";

        if (!this._oHaveEasyAccessSystemsDeferreds[sMenuType]) {
            this._oHaveEasyAccessSystemsDeferreds[sMenuType] = this._getEasyAccessSystems(sMenuType);
        }

        return this._oHaveEasyAccessSystemsDeferreds[sMenuType];
    };

    /**
     * Helper function for {@link #getEasyAccessSystems}.
     *
     * @param {string} sMenuType The type of menu to return the entries for. This can be one of "userMenu" or "sapMenu".
     * @returns {Promise<object>} Resolves with an object containing the systems:
     * @private
     * @since 1.130.0
     */
    ClientSideTargetResolution.prototype._getEasyAccessSystems = async function (sMenuType) {
        var oResultEasyAccessSystemSet = {}; // see @returns example in JSDOC

        var oActionDefinitions = ApplicationType.getEasyAccessMenuDefinitions().reduce(function (oReducibleActionDefs, oEasyAccessMenuDefinition) {
            var sEasyAccessMenuAction = oEasyAccessMenuDefinition.easyAccessMenu.intent.split("-")[1];
            oReducibleActionDefs[sEasyAccessMenuAction] = {
                appType: oEasyAccessMenuDefinition.type,
                priority: oEasyAccessMenuDefinition.easyAccessMenu.systemSelectionPriority
            };

            return oReducibleActionDefs;
        }, {});

        let oValidIntents;

        switch (sMenuType) {
            case "userMenu":
                oValidIntents = ApplicationType.getEasyAccessMenuDefinitions().reduce(function (oUserMenuEntries, oEasyAccessMenuDefinition) {
                    var sEasyAccessMenuIntent = oEasyAccessMenuDefinition.easyAccessMenu.intent;
                    oUserMenuEntries[sEasyAccessMenuIntent] = oEasyAccessMenuDefinition.easyAccessMenu.showSystemSelectionInUserMenu;

                    return oUserMenuEntries;
                }, {});
                break;
            case "sapMenu":
                oValidIntents = ApplicationType.getEasyAccessMenuDefinitions().reduce(function (oSapMenuEntries, oEasyAccessMenuDefinition) {
                    var sEasyAccessMenuIntent = oEasyAccessMenuDefinition.easyAccessMenu.intent;
                    oSapMenuEntries[sEasyAccessMenuIntent] = oEasyAccessMenuDefinition.easyAccessMenu.showSystemSelectionInSapMenu;

                    return oSapMenuEntries;
                }, {});
                break;
            default:
                throw new Error(`Invalid menu type: '${sMenuType}'`);
        }

        const oInboundIndex = await this._oInboundProvider.getInbounds(); // all inbounds, no segments
        var oLastPriorityPerSystem = {};
        const sCurrentFormFactor = ushellUtils.getFormFactor();

        oInboundIndex.getAllInbounds()
            .filter(function isValidEasyAccessMenuInbound (oInbound) {
                if (!oInbound) {
                    return false;
                }
                var sIntent = [oInbound.semanticObject, oInbound.action].join("-");

                return oValidIntents[sIntent] && oInbound.deviceTypes && sCurrentFormFactor !== undefined && oInbound.deviceTypes[sCurrentFormFactor];
            })
            .forEach(function (oEasyAccessInbound) {
                // extract the data for the easy access system list
                var sSystemAliasName;
                if (fnIsPlainObject(oEasyAccessInbound.signature.parameters["sap-system"]) &&
                    oEasyAccessInbound.signature.parameters["sap-system"].hasOwnProperty("filter")) {
                    sSystemAliasName = ObjectPath.get("signature.parameters.sap-system.filter.value", oEasyAccessInbound);
                }

                if (typeof sSystemAliasName === "string") {
                    /*
                    * Code below builds the set of easy access system that should be displayed in the sapMenu/userMenu.
                    * In case multiple inbounds exist with a certain system,
                    * the app type with the highest priority is used to choose the title (see oActionDefinitions above).
                    * Note that other app types should still appear in the result set (see 'appType' in the example result from jsdoc).
                    */
                    var iCurrentActionPriority = oActionDefinitions[oEasyAccessInbound.action].priority;
                    var sCurrentActionAppType = oActionDefinitions[oEasyAccessInbound.action].appType;

                    if (!oResultEasyAccessSystemSet[sSystemAliasName]) {
                        // provide base structure...
                        oLastPriorityPerSystem[sSystemAliasName] = -1;
                        oResultEasyAccessSystemSet[sSystemAliasName] = {
                            appType: {}
                        };
                    }

                    if (oLastPriorityPerSystem[sSystemAliasName] < iCurrentActionPriority) {
                        // ...then populate in case
                        oResultEasyAccessSystemSet[sSystemAliasName].text = oEasyAccessInbound.title;
                        oLastPriorityPerSystem[sSystemAliasName] = iCurrentActionPriority;
                    }

                    // keep track of all the app types
                    oResultEasyAccessSystemSet[sSystemAliasName].appType[sCurrentActionAppType] = true;
                } else {
                    Log.warning(
                        "Cannot extract sap-system from easy access menu inbound: " + _Formatter.formatInbound(oEasyAccessInbound),
                        "This parameter is supposed to be a string. Got '" + sSystemAliasName + "' instead.",
                        "sap.ushell.services.ClientSideTargetResolution"
                    );
                }
            });

        return oResultEasyAccessSystemSet;
    };

    /**
     * @typedef {object} SystemContext An object representing the context of a system.
     * @property {function} getFullyQualifiedXhrUrl A function that returns a URL to issue XHR requests to a service endpoint
     *   (existing on a specific system) starting from the path to a service endpoint (existing on all systems).
     *   The given path should not be fully qualified. Any fully qualified path will be returned unchanged
     *   to support cases where the caller does not control the path (e.g. path argument coming from external data),
     *   or a request should be issued to a specific system in the context of the current system.
     */

    /**
     * Returns the systemContext of a given contentProvider.
     *
     * @param {string} [systemId] The id of the contentProvider of which the system context should be returned.
     * @returns {Promise<SystemContext>} Resolves to the systemContext of the given systemId.
     * @private
     * @since 1.78.0
     */
    ClientSideTargetResolution.prototype.getSystemContext = async function (systemId) {
        var sSystemId = systemId === undefined ? "" : systemId;

        const oResolvedSystemAlias = await ushellUtils.promisify(this._oAdapter.resolveSystemAlias(sSystemId));

        const oSystemContext = _SystemContext.createSystemContextFromSystemAlias(oResolvedSystemAlias);

        return oSystemContext;
    };

    ClientSideTargetResolution.hasNoAdapter = false;
    return ClientSideTargetResolution;
}, true /* bExport */);

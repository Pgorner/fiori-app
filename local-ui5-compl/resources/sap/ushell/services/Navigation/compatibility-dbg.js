// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview This module helps to transform the parameters and responses to be
 * compatible with the CrossApplicationNavigation service.
 * This shall only be used for the AppRuntime to enable 1.x inner shell running in 2.x host.
 *
 * @version 1.132.1
 */

sap.ui.define([
    "sap/base/util/isPlainObject",
    "sap/ushell/Container",
    "sap/ushell/services/Navigation/utils",
    "sap/ushell/TechnicalParameters",
    "sap/ushell/utils",
    "sap/ushell/utils/type"
], function (
    isPlainObject,
    Container,
    navigationUtils,
    TechnicalParameters,
    ushellUtils,
    typeUtils
) {
    "use strict";

    const compatibility = {};

    /**
     * Original Method: {@link sap.ushell.services.CrossApplicationNavigation#getLinks}
     *  - public
     *  - since 1.38
     *  - deprecated since 1.120
     *  - successor: {@link sap.ushell.services.Navigation#getLinks}
     *  - return value was a {@link jQuery.Promise}.
     *
     * @param {object|Array<Array<object>>} [vArgs] Either a single object or an array of arrays containing the parameters for the getLinks method.
     *
     * @returns {Promise<Array<object>|Array<Array<Array<object>>>} The links for the provided parameters.
     *
     * @since 1.124.0
     * @private
     */
    compatibility.getLinks = async function (vArgs = {}) {
        const Navigation = await Container.getServiceAsync("Navigation");

        // single object case
        // {arg1} => [{link1-1}, {link1-2}, ...]
        if (isPlainObject(vArgs)) {
            const [aLinks] = await Navigation.getLinks([vArgs]);
            return aLinks;
        }

        // array case
        // [[{arg1}], [{arg2}], ...] => [[[{link1-1}, {link1-2}, ...]], [[{link2-1}, {link2-2}, ...]], ...]
        // first we transform the args to the flat format
        const aFlatArgs = vArgs.reduce((aFlatArgs, [oArg]) => {
            aFlatArgs.push(oArg);
            return aFlatArgs;
        }, []);

        const aResults = await Navigation.getLinks(aFlatArgs);

        // now we have to transform the results to the extended format
        const aExpandedResults = aResults.reduce((aExpandedResults, aLinks) => {
            aExpandedResults.push([aLinks]);
            return aExpandedResults;
        }, []);

        return aExpandedResults;
    };

    /**
     * Original Method: {@link sap.ushell.services.CrossApplicationNavigation#getAppStateData}
     *  - ui5-restricted: SAP Internal usage / WebDynpro
     *  - since 1.32
     *  - deprecated since 1.120
     *  - successor: {@link sap.ushell.services.Navigation#getAppStateData}
     *  - return value was a {@link jQuery.Promise}.
     *
     * @param {string|Array<Array<any>>} vAppStateKey Either a single app state key or an array of arrays containing the parameters for the getAppStateData method.
     *
     * @returns {Promise<object|Array<Array<object>>>} The app state data for the provided keys.
     *
     * @since 1.124.0
     * @private
     */
    compatibility.getAppStateData = async function (vAppStateKey) {
        const Navigation = await Container.getServiceAsync("Navigation");

        // single object case
        // key1 => {data1}
        if (typeof vAppStateKey === "string") {
            const [oAppStateData] = await Navigation.getAppStateData([vAppStateKey]);
            return oAppStateData;
        }

        // array case
        // [[key1], [key2], ...] => [[{data1}], [{data2}], ...]
        // first we transform the args to the flat format
        const aFlatArgs = vAppStateKey.reduce((aFlatArgs, [sKey]) => {
            aFlatArgs.push(sKey);
            return aFlatArgs;
        }, []);

        const aResults = await Navigation.getAppStateData(aFlatArgs);

        // now we have to transform the the extended format
        const aExpandedResults = aResults.reduce((aExpandedResults, oAppStateData) => {
            aExpandedResults.push([oAppStateData]);
            return aExpandedResults;
        }, []);

        return aExpandedResults;
    };

    /**
     * Original Method: {@link sap.ushell.services.CrossApplicationNavigation#getSemanticObjectLinks}
     *  - public
     *  - since 1.19.0
     *  - deprecated since 1.38
     *  - successor: {@link sap.ushell.services.CrossApplicationNavigation#getLinks}
     *  - return value was a {@link jQuery.Promise}.
     *
     * @param {string|Array<Array<any>>} vSemanticObjectOrMultipleArgs Either a single semantic object or an array of arrays containing the parameters for the getLinks method.
     * @param {object} [oParameters] The Map of parameters.
     * @param {boolean} [bIgnoreFormFactor=false] Whether the form factor should be ignored.
     * @param {sap.ui.core.Component} [oComponent] The root component of the application.
     * @param {string} [sAppStateKey] The application state key.
     * @param {boolean} [bCompactIntents] Whether the returned intents should be compacted.
     *
     * @returns {Promise<Array<object>|Array<Array<Array<string>>>>} The links for the provided semantic objects.
     *
     * @since 1.124.0
     * @private
     */
    compatibility.getSemanticObjectLinks = async function (vSemanticObjectOrMultipleArgs, oParameters, bIgnoreFormFactor, oComponent, sAppStateKey, bCompactIntents) {
        const Navigation = await Container.getServiceAsync("Navigation");
        // require lazy to avoid circular dependency
        const [ AppLifeCycleAI ] = await ushellUtils.requireAsync(["sap/ushell/components/applicationIntegration/AppLifeCycle"]);

        let oParametersPlusSapSystem = await navigationUtils.injectStickyParameters({
            args: { params: oParameters },
            appLifeCycle: AppLifeCycleAI,
            technicalParameters: TechnicalParameters,
            type: typeUtils
        });
        oParametersPlusSapSystem = Navigation.getTargetWithCurrentSystem(oParametersPlusSapSystem, oComponent).params;
        oParametersPlusSapSystem = Navigation.amendTargetWithSapUshellEncTestParameter({ params: oParametersPlusSapSystem }).params;

        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

        // single string case
        // rest of the parameters are provided directly
        // arg1, arg2, ... => [link1, link2, ...]
        if (!Array.isArray(vSemanticObjectOrMultipleArgs)) {
            const oDeferred = NavTargetResolutionInternal.getLinks({
                semanticObject: vSemanticObjectOrMultipleArgs,
                params: oParametersPlusSapSystem,
                ignoreFormFactor: bIgnoreFormFactor,
                ui5Component: oComponent,
                appStateKey: sAppStateKey,
                compactIntents: !!bCompactIntents
            });
            return ushellUtils.promisify(oDeferred);
        }

        // array case
        // [[arg1-1, arg1-2, ...], [arg2-1, arg2-2, ...]] => [[[link1-1, link1-2, ...]], [[link2-1, link2-2, ...]]]
        return Promise.all(vSemanticObjectOrMultipleArgs.map(async (aArgs) => {
            const [ semanticObject, params, ignoreFormFactor, ui5Component, appStateKey, compactIntents ] = aArgs;
            const oDeferred = NavTargetResolutionInternal.getLinks({
                ignoreFormFactor: !!ignoreFormFactor,
                compactIntents: !!compactIntents,
                semanticObject,
                params,
                ui5Component,
                appStateKey
            });
            const aLinks = await ushellUtils.promisify(oDeferred);
            return [aLinks];

        }));
    };

    /**
     * Original Method: {@link sap.ushell.services.CrossApplicationNavigation#isIntentSupported}
     *  - public
     *  - since 1.19.1
     *  - deprecated since 1.31
     *  - successor: {@link sap.ushell.services.CrossApplicationNavigation#isNavigationSupported}
     *  - return value was a {@link jQuery.Promise}.
     *
     * @param {string[]} aIntents The intents to check.
     * @param {sap.ui.core.Component} [oComponent] The root component of the application.
     *
     * @returns {Promise<Object<string, { supported: boolean }>>} A map of intents to their supported status.
     *
     * @since 1.124.0
     * @private
     */
    compatibility.isIntentSupported = async function (aIntents, oComponent) {
        const Navigation = await Container.getServiceAsync("Navigation");

        // Add sap-system to intents
        const oIntentMap = {};
        const aIntentsWithSapSystem = aIntents.map((sOriginalIntent) => {
            const sIntentWithSystem = Navigation.getTargetWithCurrentSystem(sOriginalIntent, oComponent);
            oIntentMap[sIntentWithSystem] = sOriginalIntent;
            return sIntentWithSystem;
        });

        const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");

        const oDeferred = NavTargetResolutionInternal.isNavigationSupported(aIntentsWithSapSystem);
        const aResults = await ushellUtils.promisify(oDeferred);

        // Map result back to original intents
        return aResults.reduce((oResult, oIntentSupported, iIndex) => {
            const sIntentWithSystem = aIntentsWithSapSystem[iIndex];
            const sOriginalIntent = oIntentMap[sIntentWithSystem];
            oResult[sOriginalIntent] = oIntentSupported;
            return oResult;
        }, {});
    };


    return compatibility;
});

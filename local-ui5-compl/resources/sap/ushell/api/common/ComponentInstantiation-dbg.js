// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file Utility functions for component instantiation used in multiple APIs.
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/Container",
    "sap/ushell/UI5ComponentType",
    "sap/ushell/utils/UrlParsing",
    "sap/base/util/deepExtend",
    "sap/ushell/ApplicationType",
    "sap/ushell/utils"
], function (
    Log,
    Container,
    UI5ComponentType,
    UrlParsing,
    deepExtend,
    ApplicationType,
    ushellUtils
) {
    "use strict";

    /**
     * @alias sap.ushell.api.common.ComponentInstantiation
     * @namespace
     * @description Some apps or plugins need to instantiate components based on intents
     *   for which this API provides utility functions.
     *
     * @since 1.129.0
     * @private
     */
    class ComponentInstantiation {

        /**
         * Resolves a given navigation intent (if valid) and returns the respective component instance for further processing.
         *
         * @param {string} sIntent Semantic object and action as a string with a "#" as prefix
         * @param {object} [oComponentData={}] The componentData relevant for this component.
         *   <b>Note:</b> Please don't pass <code>startupParameters</code>, <code>config</code>
         *   and <code>["sap-xapp-state"]</code>
         * @param {sap.ui.core.Component} [oOwnerComponent] If specified, the created component will be called within the context of the oOwnerComponent
         *    (via oOwnerComponent.runAsOwner(fn))
         * @returns {Promise<sap.ui.core.Component>} A promise resolving the component instance.
         *
         * @since 1.129.0
         * @private
         */
        async createComponentInstance (sIntent, oComponentData, oOwnerComponent) {
            const Ui5ComponentLoader = await Container.getServiceAsync("Ui5ComponentLoader");

            let oModifiedComponentData = await this.createComponentInstantiationData(sIntent, oComponentData);
            oModifiedComponentData = await Ui5ComponentLoader.modifyComponentProperties(oModifiedComponentData, UI5ComponentType.Application);
            oModifiedComponentData.loadDefaultDependencies = false;

            if (oOwnerComponent) {
                return new Promise((resolve, reject) => {
                    oOwnerComponent.runAsOwner(() => {
                        this.#createComponent(oModifiedComponentData, Ui5ComponentLoader)
                            .then(resolve)
                            .catch(reject);
                    });
                });
            }

            return this.#createComponent(oModifiedComponentData, Ui5ComponentLoader);
        }

        /**
         * Creates a UI5 component instance based on the given component properties.
         *
         * @param {object} oComponentProperties The properties of the component to create.
         * @param {sap.ushell.services.Ui5ComponentLoader} Ui5ComponentLoader The UI5 component loader service.
         * @returns {Promise<sap.ui.core.Component>} A promise resolving the component instance.
         *
         * @since 1.129.0
         * @private
         */
        async #createComponent (oComponentProperties, Ui5ComponentLoader) {
            try {
                const oComponentPropertiesWithComponentHandle = await Ui5ComponentLoader.instantiateComponent(oComponentProperties);
                return oComponentPropertiesWithComponentHandle.componentHandle.getInstance();
            } catch (oError) {
                Log.error(`Cannot create UI5 component: ${oError.toString()}`, oError.stack, "sap.ushell.api.common.ComponentInstantiation");
                return Promise.reject(oError);
            }
        }

        /**
         * Resolves a given navigation intent (if valid) and returns the respective component data only for further processing.
         *
         * @param {string} sIntent Semantic object and action as a string with a "#" as prefix
         * @param {sap.ushell.services.Ui5ComponentLoader.ComponentData} [oComponentData] The componentData relevant for this component.
         *   <b>Note:</b> Please don't pass <code>startupParameters</code>, <code>config</code>
         *   and <code>["sap-xapp-state"]</code>
         * @returns {Promise<sap.ushell.services.Ui5ComponentLoader.ComponentData>} A promise resolving the instantiation data for the component.
         *
         * @since 1.129.0
         * @private
         */
        async createComponentInstantiationData (sIntent, oComponentData) {
            const oComponentConfig = {
                componentData: oComponentData
            };

            if (oComponentConfig.componentData) {
                // cleanup componentData
                delete oComponentConfig.componentData.startupParameters;
                delete oComponentConfig.componentData.config;
                delete oComponentConfig.componentData["sap-xapp-state"];
            }

            const sCanonicalIntent = UrlParsing.constructShellHash(UrlParsing.parseShellHash(sIntent));
            if (!sCanonicalIntent) {
                return Promise.reject("Navigation intent invalid!");
            }

            const NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");
            const oResolvedHashFragment = await NavTargetResolutionInternal.resolveHashFragment("#" + sCanonicalIntent);

            // If the app is running in cFLP inside an iframe, we have to call the app index
            // to get the app info, so that the component can be created and embedded inside the app.
            if (oResolvedHashFragment.applicationType === ApplicationType.URL.type &&
                oResolvedHashFragment.appCapabilities &&
                oResolvedHashFragment.appCapabilities.appFrameworkId === "UI5" &&
                Container.inAppRuntime()) {

                // This module is only required in this case to avoid adding dependencies for non-cFLP scenarios.
                const [AppLifeCycleAgent] = await ushellUtils.requireAsync(["sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent"]);

                let sAppId;
                // We try to fetch the app id from the URL. As this also considers app variants and not just standard apps.
                try {
                    const sUrl = new URL(oResolvedHashFragment.url);
                    const oURLParameters = new URLSearchParams(sUrl.search);
                    sAppId = oURLParameters.get("sap-ui-app-id");
                } catch (oError) {
                    // If the URL is not a complete URL but only a URIComponent, we do a regex to find the required parameter value.
                    sAppId = oResolvedHashFragment.url.match(/[?&]sap-ui-app-id=([^&]+)/)[1];
                }

                let oAppInfo = await AppLifeCycleAgent.getAppInfo(sAppId);
                if (oAppInfo.hasOwnProperty("oResolvedHashFragment")) {
                    oAppInfo = oAppInfo.oResolvedHashFragment;
                }
                oAppInfo = this.#finalizeComponentData(oAppInfo, oComponentConfig);
                if (oAppInfo.url && sIntent.indexOf("?") > 0) {
                    oAppInfo.url += "?" + sIntent.split("?")[1];
                }

                return this.#createComponentData({
                    ui5ComponentName: sAppId,
                    applicationDependencies: oAppInfo,
                    url: oAppInfo.url
                },
                oComponentConfig);
            } else if (oResolvedHashFragment.applicationType !== ApplicationType.URL.type && !(/^SAPUI5\.Component=/.test(oResolvedHashFragment.additionalInformation))) {
                // For applications that are not of type 'URL', the additionalInformation has to provide a UI5 component.
                return Promise.reject("The resolved target mapping is not of type UI5 component.");
            }

            return this.#createComponentData(oResolvedHashFragment, oComponentConfig);
        }

        /**
         * Creates the component data
         *
         * @param {object} oResolvedHashFragment The resolved hash fragment
         * @param {object} oComponentConfig The component configuration
         * @returns {Promise<object>} The component data
         *
         * @since 1.129.0
         * @private
        */
        async #createComponentData (oResolvedHashFragment, oComponentConfig) {
            try {
                oResolvedHashFragment = this.#finalizeComponentData(oResolvedHashFragment, oComponentConfig);
                oResolvedHashFragment.loadDefaultDependencies = false;
                const Ui5ComponentLoader = await Container.getServiceAsync("Ui5ComponentLoader");
                return Ui5ComponentLoader.createComponentData(oResolvedHashFragment);
            } catch (oError) {
                Log.error("Cannot get UI5 component data: " + oError, oError.stack, "sap.ushell.api.common.ComponentInstantiation");
                return Promise.reject(oError);
            }
        }

        /**
         * Finalizes the component data
         *
         * @param {object} oResolvedHashFragment The resolved hash fragment
         * @param {object} oComponentConfig The component configuration
         * @returns {object} The finalized component data
         *
         * @since 1.129.0
         * @private
         */
        #finalizeComponentData (oResolvedHashFragment, oComponentConfig) {
            oResolvedHashFragment = deepExtend({}, oResolvedHashFragment, oComponentConfig);

            if (!oResolvedHashFragment.ui5ComponentName) {
                if (oResolvedHashFragment.additionalInformation) {
                    oResolvedHashFragment.ui5ComponentName = oResolvedHashFragment.additionalInformation.replace(/^SAPUI5\.Component=/, "");
                } else if (oResolvedHashFragment.name) {
                    oResolvedHashFragment.ui5ComponentName = oResolvedHashFragment.name;
                }
            }

            return oResolvedHashFragment;
        }

    }

    return new ComponentInstantiation();
});

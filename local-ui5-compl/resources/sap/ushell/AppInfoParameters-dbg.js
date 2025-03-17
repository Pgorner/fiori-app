// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/services/AppConfiguration",
    "sap/base/util/deepClone",
    "sap/base/util/isPlainObject",
    "sap/base/util/restricted/_curry",
    "sap/base/util/restricted/_zipObject",
    "sap/ui/VersionInfo",
    "sap/ushell/Container"
], (
    Log,
    AppConfiguration,
    deepClone,
    isPlainObject,
    _curry,
    _zipObject,
    VersionInfo,
    Container
) => {
    "use strict";

    const LAUNCHPAD = "LAUNCHPAD";

    // Those parameters are restricted and shall only be set by FLP.
    const aRestrictedParameters = [
        "productName",
        "theme",
        "appIntent"
    ];

    // Those parameters are supported by the AppInfoParameters any
    // other parameter should be part of customProperties.
    const aSupportedParameters = [
        "productName",
        "theme",
        "languageTag",
        "appIntent",
        "technicalAppComponentId",
        "appId",
        "appVersion",
        "appSupportInfo",
        "appFrameworkVersion",
        "appFrameworkId",
        "title",
        "applicationParams",
        "shellFrameworkVersion"
    ];

    /**
     * @alias sap.ushell.AppInfoParameters
     * @class
     * @classdesc AppInfoParameters component responsible to direct the recovery of each app info parameter value
     *
     * @private
     */
    class AppInfoParameters {
        // map of application info parameters to provider functions
        #oDefaultHandlers = {
            theme: this.#getUserEnv.bind(this, "User.env.sap-theme-NWBC"),
            languageTag: this.#getUserEnv.bind(this, "User.env.sap-languagebcp47"),
            appIntent: this.#getAppIntent.bind(this),
            appFrameworkId: this.#getAppFrameworkId.bind(this),
            appFrameworkVersion: this.#getFrameworkVersion.bind(this),
            appSupportInfo: this.#getSupportInfo.bind(this),
            technicalAppComponentId: this.#getTechnicalAppComponentId.bind(this),
            appId: this.#getAppId.bind(this),
            appVersion: this.#getAppVersion.bind(this),
            productName: _curry(this.#getSystemContextProperty.bind(this))("productName"),
            applicationParams: this.#getStartupParams.bind(this)
        };

        // overrides by the application for the standard app info parameters
        #oAppParameters = {};

        // Custom app info parameters
        #oCustomAppParameters = {};

        /**
         * Retrieves the application type
         * It looks up application type
         * @param {object} oCurrentApplication current application
         * @returns {string} the application type
         */
        #getApplicationType (oCurrentApplication) {
            let sApplicationType = oCurrentApplication.applicationType;
            if (sApplicationType === "TR") {
                sApplicationType = "GUI";
            }
            return sApplicationType;
        }

        #getCurrentAppCapabilities () {
            return AppConfiguration.getCurrentApplication()?.appCapabilities || {};
        }

        async #getFrameworkVersion (oCurrentApplication) {
            const sApplicationType = this.#getApplicationType(oCurrentApplication);

            if (sApplicationType === "UI5") {
                try {
                    const oVersionInfo = await VersionInfo.load();

                    return `${oVersionInfo.version || "" } (${ oVersionInfo.buildTimestamp || "" })` || "";

                } catch (oError) {
                    Log.error("VersionInfo could not be loaded", oError);
                }
            }
        }

        async #getAppVersion (oCurrentApplication) {
            const oComponentInstance = oCurrentApplication.componentInstance;
            if (oComponentInstance) {
                const sAppVersion = oComponentInstance.getManifestEntry("/sap.app/applicationVersion/version");
                return sAppVersion;
            }
        }

        /**
         * Provider for support info
         * It looks up using the sequence
         *   1. technical parameter sap-ach, that is SAP application component hierarchy
         *   2. appSupportInfo parameter in capability section of the URL template
         * @param {object} oCurrentApplication Current Application
         * @returns {Promise<string>} function that resolves to a promise with the support info
         */
        async #getSupportInfo (oCurrentApplication) {
            // 1. sap-ach
            const [ sAch ] = await oCurrentApplication.getTechnicalParameter("sap-ach") || [];
            if (sAch) {
                return sAch;
            }
            // 2. app capabilities
            return this.#getCurrentAppCapabilities().appSupportInfo;
        }

        /**
         * Provider for technical application component
         * It looks up depending on the technology
         * if UI5: take it from the manifest
         * if GUI or WDA: parse the application name from the launch URL
         * if WCF:  parse the wcf-target-id parameter
         * if URL-template: looks up technicalAppComponentId in capabilities section
         * @param {object} oCurrentApplication Current Application
         * @returns {Promise<string>} function that resolves to a promise with the technical application component
         */
        async #getTechnicalAppComponentId (oCurrentApplication) {
            const sApplicationType = this.#getApplicationType(oCurrentApplication);
            const oMetadata = AppConfiguration.getMetadata();

            if (sApplicationType === "UI5") {
                const oComponentInstance = oCurrentApplication.componentInstance;
                if (oComponentInstance) {
                    let sComponentName = oComponentInstance.getManifestEntry("/sap.ui5/componentName");
                    if (!sComponentName) {
                        sComponentName = oComponentInstance.getMetadata().getComponentName();
                    }

                    return sComponentName;
                }

                return oMetadata.technicalName;
            }

            if (sApplicationType === "URL") {
                const oCurrentApp = AppConfiguration.getCurrentApplication();
                if (oCurrentApp.appCapabilities.technicalAppComponentId) {
                    return oCurrentApp.appCapabilities.technicalAppComponentId;
                }
            }

            if (sApplicationType === "GUI") {
                return (oMetadata.technicalName || "")
                    .replace(/ .*/, "") // remove all characters after the first space if any
                    .replace(/^\*/, ""); // remove asterisk at the beginning if any
            }

            if (sApplicationType === "WDA" || sApplicationType === "NWBC") {
                return oMetadata.technicalName;
            }
        }

        /**
         * Provider for application
         * It looks up using the sequence
         *  1. if on homepage, appfinder use constant LAUNCHPAD or LAUNCHPAD(FXXX) if fiori ID is provided
         *  2. technical parameter sap-fiori-id
         *  3. looks up parameter appId in capabilities section
         *  4. inbound permanent key
         * @param {object} oCurrentApplication current application
         * @returns {Promise<string>} function that resolves to a promise with application id.
         */
        async #getAppId (oCurrentApplication) {
            const [ sFioriId ] = await oCurrentApplication.getTechnicalParameter("sap-fiori-id") || [];

            // case home page
            if (oCurrentApplication.homePage) {
                // case fiori ID is a string
                if (sFioriId) {
                    // case fiori ID is not empty
                    // home app
                    if (sFioriId !== "") {
                        return `${LAUNCHPAD} (${sFioriId})`;
                    // case fiori id is empty
                    // This is relevant for app home error page
                    }
                    return LAUNCHPAD;
                }
                // no Fiori ID is provided
                // This is shell home, no custom home app or appfinder
                return LAUNCHPAD;
            // case app
            } else if (sFioriId) {
                // case fiori ID is a string
                return sFioriId;
            }
            return this.#getCurrentAppCapabilities().appId || oCurrentApplication.inboundPermanentKey;
        }

        /**
         * Provider for user environment
         * It looks up using reference resolver
         * @param {string} sUserEnv Parameter name of the user environment
         * @returns {Promise<string>} The promise resolves the user parameter
         */
        async #getUserEnv (sUserEnv) {
            const ReferenceResolver = await Container.getServiceAsync("ReferenceResolver");
            const oResolvedReferences = await ReferenceResolver.resolveReferences([sUserEnv]);

            return oResolvedReferences[sUserEnv];
        }

        /**
         * Provider for framework id
         * It looks up framework id in capabilities section if it is a URL template
         * else it looks up the application type
         * @param {*} oCurrentApplication current application
         * @returns {Promise<string>} Function that resolves to a promise with the framework id
         */
        async #getAppFrameworkId (oCurrentApplication) {
            const oCurrentApp = AppConfiguration.getCurrentApplication();
            let sApplicationType = this.#getApplicationType(oCurrentApplication);

            if (sApplicationType === "URL") {
                sApplicationType = oCurrentApp.appCapabilities && oCurrentApp.appCapabilities.appFrameworkId;
            }

            const oAppTypeToFrameworkId = {
                NWBC: "WDA",
                TR: "GUI"
            };

            return oAppTypeToFrameworkId[sApplicationType] || sApplicationType;
        }

        /**
         * Retrieves the value of a given property in the system context
         * @param {string} sProperty A property in the system context
         * @param {object} oCurrentApplication The current application
         * @returns {Promise<object>} Function that resolves to a promise with the property
         */
        async #getSystemContextProperty (sProperty, oCurrentApplication) {
            const oSystemContext = await oCurrentApplication.getSystemContext();

            return oSystemContext.getProperty(sProperty);
        }

        /**
         * Retrieves the app intent
         * @returns {Promise<string>} Function that resolves to a promise with app intent
         */
        async #getAppIntent () {
            const sHash = window.hasher && window.hasher.getHash();
            if (!sHash) {
                throw new Error("Could not identify current application hash");
            }
            return sHash;
        }


        async #getStartupParams (oCurrentApplication, oApplicationContainer) {
            let oStartupParams = {};
            if (oApplicationContainer?.getCurrentAppTargetResolution?.().extendedInfo) {
                oStartupParams = oApplicationContainer.getCurrentAppTargetResolution().extendedInfo.appParams;
            }

            return oStartupParams;
        }

        async getAllAppInfo (bValues, oCurrentApplication, oComponentInstance, oApplicationContainer) {
            const oAllAppInfo = {};
            const aParametersWithDefaults = Object.keys(this.#oDefaultHandlers);
            const aAppDefinedParameters = Object.keys(this.#oAppParameters);
            const sStandardParameters = Array.from(new Set([...aParametersWithDefaults, ...aAppDefinedParameters]));

            //first, we add all standard attributes
            try {
                // the app overrides are already included the #getInfo call
                const oResult = await this.#getInfo(sStandardParameters, oCurrentApplication, oApplicationContainer);

                for (const sParameter in oResult) {
                    if (bValues) {
                        oAllAppInfo[sParameter] = oResult[sParameter];
                    } else {
                        oAllAppInfo[sParameter] = {
                            value: oResult[sParameter]
                        };
                    }
                }
            } catch {
                // fail silently
            }

            const aCustomParameters = Object.keys(this.#oCustomAppParameters);

            // second we add all custom properties
            try {
                const oResult = await this.#getInfo(aCustomParameters, oCurrentApplication, oApplicationContainer);

                for (const sCustomerAttribute in oResult) {
                    if (bValues) {
                        oAllAppInfo[sCustomerAttribute] = oResult[sCustomerAttribute].value;
                    } else {
                        oAllAppInfo[sCustomerAttribute] = oResult[sCustomerAttribute];
                    }
                }
            } catch {
                // fail silently
            }

            return oAllAppInfo;
        }

        /**
         * A function to collect the values of the given parameters
         * @param {string[]} aParameters Array of requested parameters
         * @param {object} oCurrentApplication The current application
         * @param {object} oApplicationContainer The application container
         * @returns {Promise} Promise that resolves to an object
         *    keeping the application info parameters with values
         */
        async getInfo (aParameters, oCurrentApplication, oApplicationContainer) {
            if (!oCurrentApplication) {
                throw new Error("Parameter application missing");
            }
            return this.#getInfo(["appFrameworkId"], oCurrentApplication, oApplicationContainer).then(() => {
                return this.#getInfo(aParameters, oCurrentApplication, oApplicationContainer);
            });
        }

        /**
         * Internal central function to collect the values of the given parameters
         * @param {string[]} aParameters Array of requested parameters
         * @param {object} oCurrentApplication The current application
         * @param {object} oApplicationContainer The application container
         * @returns {Promise<Object<string, object>>} Promise that resolves to an object
         *    keeping the application info parameters with values
         */
        async #getInfo (aParameters, oCurrentApplication, oApplicationContainer) {
            const aPromises = aParameters.map(async (sParameter) => {
                if (aSupportedParameters.includes(sParameter)) {
                    // first we use the parameters defined by app
                    if (Object.hasOwn(this.#oAppParameters, sParameter)) {
                        return this.#oAppParameters[sParameter];
                    }
                    // second we use the parameters defined by FLP
                    if (Object.hasOwn(this.#oDefaultHandlers, sParameter)) {
                        return this.#oDefaultHandlers[sParameter](oCurrentApplication, oApplicationContainer);
                    }
                    Log.error(`value for parameter '${sParameter}' is not set.`);
                    return;
                }

                // first we use the parameters defined by app
                if (Object.hasOwn(this.#oCustomAppParameters, sParameter)) {
                    /**
                     * Automated migration to customProperties will be removed in future.
                     * @deprecated since 1.120.0
                     */
                    // eslint-disable-next-line no-constant-condition
                    if (true) {
                        const oCustomValue = this.#oCustomAppParameters[sParameter];
                        if (oCustomValue.migrated) {
                            return oCustomValue.value;
                        }
                    }

                    return this.#oCustomAppParameters[sParameter];
                }
                // second we use fallback from system context for custom properties
                if (sParameter.includes(".")) {
                    return this.#getSystemContextProperty(sParameter, oCurrentApplication, oApplicationContainer);
                }

                Log.error(`'${sParameter}' is not a valid app info parameter`);
            });

            return Promise.allSettled(aPromises).then((aValues) => {
                for (let i = 0; i < aValues.length; i++) {
                    if (aValues[i].status === "fulfilled") {
                        aValues[i] = aValues[i].value;
                    } else {
                        aValues[i] = undefined;
                    }
                }

                return _zipObject(aParameters, aValues);
            });
        }

        setCustomAttributes (oAppInfo) {
            if (oAppInfo === undefined || Object.keys(oAppInfo).length === 0) {
                this.flush();
                return;
            }
            let oAppInfoClone = deepClone(oAppInfo);

            /**
             * Old interface
             * @deprecated since 1.120.0
             */
            if (oAppInfoClone.info && Object.keys(oAppInfoClone).length === 1) {
                Log.error("The old interface for setting custom attributes is deprecated and will be removed in future.");
                oAppInfoClone = oAppInfoClone.info;
            }

            /**
             * Automated migration to customProperties will be removed in future.
             * @deprecated since 1.120.0
             */
            const oFallbackForCustomProperties = {};
            for (const sParameter in oAppInfoClone) {
                if (sParameter === "customProperties") {
                    // custom properties are handled below
                    continue;
                }

                if (aRestrictedParameters.includes(sParameter)) {
                    Log.error(`Attribute '${sParameter}' is restricted and will be ignored.`);
                    continue;
                }

                if (!aSupportedParameters.includes(sParameter)) {

                    /**
                     * Automated migration to customProperties will be removed in future.
                     * @deprecated since 1.120.0
                     */
                    // eslint-disable-next-line no-constant-condition
                    if (true) {
                        Log.error(`Attribute '${sParameter}' is not supported and will be moved to customProperties instead. This migration will be removed in future.`);
                        oFallbackForCustomProperties[sParameter] = {
                            value: oAppInfoClone[sParameter],
                            showInAbout: false,
                            migrated: true
                        };
                        continue;
                    }

                    Log.error(`Attribute '${sParameter}' is not supported and will be ignored. It should be moved to the customProperties instead.`);
                    continue;
                }

                const sValue = oAppInfoClone[sParameter];

                if (typeof sValue !== "string") {
                    Log.error(`Attribute value for '${sParameter}' is not a string and will be ignored.`);
                    continue;
                }

                this.#oAppParameters[sParameter] = sValue;
            }

            const oCustomProperties = {
                /**
                 * Automated migration to customProperties will be removed in future.
                 * @deprecated since 1.120.0
                 */
                ...oFallbackForCustomProperties,
                ...oAppInfoClone.customProperties
            };

            for (const sCustomProperty in oCustomProperties) {
                let oValue = oCustomProperties[sCustomProperty];

                /**
                 * Automated migration to proper format will be removed in future.
                 * @deprecated since 1.120.0
                 */
                if (!isPlainObject(oValue)) {
                    Log.error(`Custom attribute '${sCustomProperty}' does not have the correct format. This property will be ignored in future.`);
                    oValue = {
                        value: oValue,
                        showInAbout: false,
                        migrated: true
                    };
                }

                if (!this.#validateCustomAttribute(sCustomProperty, oValue)) {
                    continue;
                }

                this.#oCustomAppParameters[sCustomProperty] = oValue;
            }
        }

        #validateCustomAttribute (sParameterName, oValue) {
            if (!isPlainObject(oValue)) {
                Log.error(`Custom attribute '${sParameterName}' does not have the correct format and will be ignored.`);
                return false;
            }

            if (oValue.showInAbout === false) {
                // no further validation for attributes that are not shown in the about dialog
                return true;
            }

            // if not provided, set default value for showInAbout
            oValue.showInAbout = true;

            if (!oValue.label) {
                Log.error(`Custom attribute '${sParameterName}' has no label and will be ignored.`);
                return false;
            }

            return true;
        }

        /**
         * Stores the custom app info parameters into the given storage entry.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.130.0
         * @private
         */
        store (oStorageEntry = {}) {
            oStorageEntry.appInfoParameters = {
                appParameters: deepClone(this.#oAppParameters),
                customAppParameters: deepClone(this.#oCustomAppParameters)
            };
        }

        /**
         * Restores the custom app info parameters from the given storage entry.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.130.0
         * @private
         */
        restore (oStorageEntry = {}) {
            const { appParameters, customAppParameters } = oStorageEntry.appInfoParameters || {};

            this.#oAppParameters = appParameters ? deepClone(appParameters) : {};
            this.#oCustomAppParameters = customAppParameters ? deepClone(customAppParameters) : {};
        }

        /**
         * Flushes the custom app info parameters.
         *
         * @since 1.130.0
         * @private
         */
        flush () {
            this.#oAppParameters = {};
            this.#oCustomAppParameters = {};
        }
    }

    return new AppInfoParameters();

}, false /* bExport= */);

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's UserDefaultParameters service provides
 *               read and write access to the User Default Parameter values.
 *               This is *not* an application facing service, but for Shell
 *               Internal usage.
 *               This service should be accessed by the application
 *               via the CrossApplicationNavigation service.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepClone",
    "sap/base/util/deepEqual",
    "sap/base/util/deepExtend",
    "sap/base/util/isEmptyObject",
    "sap/ui/base/EventProvider",
    "sap/ushell/utils",
    "sap/ushell/Container"
], function (
    Log,
    deepClone,
    deepEqual,
    deepExtend,
    isEmptyObject,
    EventProvider,
    ushellUtils,
    Container
) {
    "use strict";

    const sEventNameValueStored = "valueStored";
    const aStoreMembers = ["value", "noEdit", "noStore", "extendedValue", "alwaysAskPlugin"];
    /**
     * @alias sap.ushell.services.UserDefaultParameters
     * @class
     * @classdesc The Unified Shell's UserDefaultParameters service.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const UserDefaultParameters = await Container.getServiceAsync("UserDefaultParameters");
     *     // do something with the UserDefaultParameters service
     *   });
     * </pre>
     *
     * @param {object} oAdapter
     *   The service adapter for the UserDefaultParameters service,
     *   as already provided by the container
     * @param {object} oContainerInterface interface
     * @param {string} sParameter Service instantiation
     * @param {object} oConfig service configuration (not in use)
     *
     * @hideconstructor
     *
     * @since 1.32.0
     * @private
     * @ui5-restricted ssuite.smartbusiness
     */
    function UserDefaultParameters (oAdapter, oContainerInterface, sParameter, oConfig) {
        this._aPlugins = []; // list of registered plugins, in order
        this._oUserDefaultParametersNames = {};

        // Indicates whether a parameter was already persisted or scheduled for
        // persistence.
        this._oWasParameterPersisted = {};

        const oStoreValueEventProvider = new EventProvider();

        /**
         * Obtain an integer representing the priority of the plugin
         *
         * @param {object} oPlugin a plug-in
         *
         * @returns {int} an integer value (default 0) representing the priority of the plug-in
         *
         * @private
         */
        function getPrio (oPlugin) {
            const val = (typeof oPlugin.getComponentData === "function" && oPlugin.getComponentData() && oPlugin.getComponentData().config && oPlugin.getComponentData().config["sap-priority"]) || 0;
            if (typeof val !== "number" || isNaN(val)) {
                return 0;
            }
            return val;
        }

        /**
         * Plugins with higher priority are moved to *lower* places in the queue
         *
         * @param {object[]} aPlugins list of present plugins, modified!
         * @param {object} oPlugin the plugin to insert
         *
         * @returns {object[]} amended list of plugins
         *
         * @since 1.32.0
         * @private
         */
        this._insertPluginOrdered = function (aPlugins, oPlugin) {
            const prioPlugin = getPrio(oPlugin);
            for (let i = 0; (i < aPlugins.length) && oPlugin; ++i) {
                const prioNth = getPrio(aPlugins[i]);
                if (oPlugin && (prioPlugin > prioNth)) {
                    aPlugins.splice(i, 0, oPlugin); // insert at index i;
                    oPlugin = undefined;
                }
            }
            if (oPlugin) {
                aPlugins.push(oPlugin);
            }
            return aPlugins;
        };

        // PLUGIN Registration IFFacingPlugin
        /**
         * @param {object} oPlugin the Plugin to register with the service
         *
         * @private
         * @ui5-restricted FIN UserDefaults Plugin
         */
        this.registerPlugin = function (oPlugin) {
            this._aPlugins = this._insertPluginOrdered(this._aPlugins, oPlugin);
        };

        /**
         * Tries to get a given user default value from a given plugin.
         * This is a helper function for _iterateOverPluginsToGetDefaultValue below.
         * In case of error or if the given plugin can't return a default value,
         * the original value passed to the function is returned.
         *
         * @param {object} oPlugin Plugin that will be called.
         * @param {string} sParameterName Name of the parameter (search criteria)
         * @param {object} oSystemContext The system context object
         * @param {object} oValue The current value (if any) to which to default if nothing is returned.
         *
         * @returns {Promise<object>} A promise that resolves to either
         *          the value returned by the plugin or the original oValue
         *
         * @private
         */
        this._getUserDefaultValueFromPlugin = async function (oPlugin, sParameterName, oSystemContext, oValue) {
            if (typeof oPlugin.getUserDefault === "function") {
                try {
                    const oResult = await ushellUtils.promisify(oPlugin.getUserDefault(sParameterName, oValue, oSystemContext));
                    const oResolveValue = oResult || oValue;

                    const sPluginName = this._getComponentNameOfPlugin(oPlugin);
                    Log.debug(`[UserDefaults] Fetched "${sParameterName}" for SystemContext="${oSystemContext.id}" from Plugin="${sPluginName}"`, JSON.stringify(oResolveValue, null, 2));

                    return oResolveValue;
                } catch {
                    Log.error(`invocation of getUserDefault("${ sParameterName }") for plugin ${ this._getComponentNameOfPlugin(oPlugin) } rejected.`, null,
                                "sap.ushell.services.UserDefaultParameters");
                }
            }

            return oValue;
        };

        /**
         * Iterates the plugins and searches for a parameter that is
         * handled by the plugin to deliver a value
         * Plugins are called sequentially in the order given by the _aPlugins array,
         * in order to allow us to pass the value returned by a plugin to the next one
         * and enable the plugins to react to previous values (generally keeping the
         * existing one instead of overriding it).
         *
         * @param {string} sParameterName Name of the parameter (search criteria)
         * @param {object} oStartValue Value which will be returned if it is handled by any plugin
         * @param {object} oSystemContext The system context object
         * @param {sap.ushell.services.PluginManager} oPluginManagerService The instance of the PluginManager service
         * @returns {Promise<object>} A promise that resolves to either
         *          the value returned by the plugins or the start value if the plugins do not
         *          return a value.
         *
         * @see sap.ushell.Container#getServiceAsync
         * @since 1.32.0
         * @private
         */
        this._iterateOverPluginsToGetDefaultValue = async function (sParameterName, oStartValue, oSystemContext) {
            // Main promise chain construction: a plugin will only be called once the previous one's promise has resolved
            // so that we have access to the value returned by that promise.
            await this._loadPlugins();

            return this._aPlugins.reduce(async (oPromise, oPlugin) => {
                const oPreviousValue = await oPromise;
                return this._getUserDefaultValueFromPlugin(oPlugin, sParameterName, oSystemContext, oPreviousValue);
            }, Promise.resolve(oStartValue));
        };

        this._getStoreDate = function () {
            return new Date().toString();
        };

        /**
         * Stores the value & persists it.
         * Note, if oValueObject.value is undefined, the value is deleted!
         *
         * @param {string} sParameterName Name of the parameter for the value which has to be saved
         * @param {object} oValueObject Value which has to be saved
         * @param {boolean} bFromEditor true if invoked from editor, in this case an undefined value is interpreted as a "delete value operation"
         * @param {object} oSystemContext The system context object
         * @returns {Promise<string>} A promise that is resolved to the parameter name if saving its value succeeds
         *
         * @since 1.32.0
         * @private
         */
        this._storeValue = async function (sParameterName, oValueObject, bFromEditor, oSystemContext) {
            if (bFromEditor && oValueObject.extendedValue) {
                try {
                    const ClientSideTargetResolution = await Container.getServiceAsync("ClientSideTargetResolution");
                    const oParametersAndExtendedParameters = await ClientSideTargetResolution.getUserDefaultParameterNames(oSystemContext);

                    const oExtractedArrays = this._extractKeyArrays(oParametersAndExtendedParameters);
                    const bRemoveExtendedValue = oExtractedArrays.extended.indexOf(sParameterName) < 0;

                    return this._saveParameterValue(sParameterName, oValueObject, bFromEditor, bRemoveExtendedValue, oSystemContext);
                } catch {
                    Log.error(`Cannot save value for ${ sParameterName }. One or more plugins could not be loaded.`);
                }
            }

            return this._saveParameterValue(sParameterName, oValueObject, bFromEditor, false, oSystemContext);
        };

        /**
         * Persists the given parameter's value.
         * Note: If oValueObject is undefined, the value is deleted.
         *
         * @param {string} sParameterName Name of the parameter for the value which has to be saved
         * @param {object} oValueObject Value which has to be saved
         * @param {boolean} bFromEditor true if invoked from editor, in this case an undefined value is interpreted as a "delete value operation"
         * @param {boolean} bRemoveExtendedValue Whether or not to remove the extended value from the object before saving
         * @param {object} oSystemContext The system context object
         * @returns {Promise<string>} A promises that is resolved with the parameter name that has been saved.
         *
         * @since 1.79.0
         * @private
         */
        this._saveParameterValue = async function (sParameterName, oValueObject, bFromEditor, bRemoveExtendedValue, oSystemContext) {
            if (bRemoveExtendedValue) {
                oValueObject.extendedValue = undefined;
            }
            if (bFromEditor && this._valueIsEmpty(oValueObject)) {
                oValueObject = undefined; // indicates removal
                this._oWasParameterPersisted[sParameterName] = false;
            } else {
                oValueObject._shellData = deepExtend({
                    storeDate: this._getStoreDate()
                }, oValueObject._shellData);
            }

            try {
                const UserDefaultParameterPersistence = await Container.getServiceAsync("UserDefaultParameterPersistence");
                await UserDefaultParameterPersistence.saveParameterValue(sParameterName, oValueObject, oSystemContext);
            } catch { /* always resolve */ }

            const oStoreValue = {
                parameterName: sParameterName,
                parameterValue: deepClone(oValueObject || {}),
                systemContext: oSystemContext
            };

            oStoreValueEventProvider.fireEvent(sEventNameValueStored, oStoreValue);

            return sParameterName;
        };

        /**
         * Obtain a present value from the internal store, may return an
         * *empty* <code>{value : undefined}</code> object if not present.
         *
         * @param {string} sParameterName Name of the parameter for the value which has to be received
         * @param {object} oSystemContext The system context object
         *
         * @returns {Promise<object>} Resolves with an object representing the
         *      persisted value for the parameter or rejects in case the
         *      parameter was not found in the persistence.
         *
         * @see sap.ushell.Container#getServiceAsync
         * @since 1.32.0
         * @private
         */
        this._getPersistedValue = async function (sParameterName, oSystemContext) {
            const UserDefaultParameterPersistence = await Container.getServiceAsync("UserDefaultParameterPersistence");
            return UserDefaultParameterPersistence.loadParameterValue(sParameterName, oSystemContext);
        };

        /**
         * Determine whether the value is completely empty
         * @param {object} oValue value object
         * @returns {boolean} boolean indicating whether oValue represents a Never set Value
         *
         * @private
         */
        this._valueIsEmpty = function (oValue) {
            return !oValue || (!oValue.value && !oValue.extendedValue);
        };

        /**
         * Checks whether two objects have the same value for a given set of
         * members.
         *
         * @param {object} oObject1
         *   The first object to compare
         * @param {object} oObject2
         *   The second object to compare
         * @param {string[]} aMembersToCheck
         *   An array of members to check
         *
         * @returns {boolean}
         *   true if each member in <code>aMembersToCheck</code> has the same
         *   value in both the objects. false in case at least one member
         *   differs.
         *
         * @private
         */
        this._haveSameMembersValue = function (oObject1, oObject2, aMembersToCheck) {
            return aMembersToCheck.every((sRelevantMember) => {
                return oObject1[sRelevantMember] === oObject2[sRelevantMember]
                    || deepEqual(oObject1[sRelevantMember], oObject2[sRelevantMember]);
            });
        };

        /**
         * Obtains a list of user default parameter names which are available for the respective end user.
         *
         * @param {object} systemContext the systemContext for which the parameter names should be obtained
         *
         * @returns {Promise<object>}
         *      A promise, which resolves to a rich parameter object containing the following structure:
         *
         * <pre>
         *      {
         *          aAllParameterNames: [],
         *          aExtendedParameterNames: [],
         *          oMetadataObject: {}
         *      }
         * </pre>.
         *
         *      The promise will typically always be resolved.
         *      In case there are no user default parameter names found, an empty object will be received.
         *
         *      Note: oMetadataObject is the object representation of aAllParameterNames, which is an array.
         *
         * @private
         */
        this._getUserDefaultParameterNames = function (systemContext) {
            if (!this._oUserDefaultParametersNames[systemContext.id]) {
                this._oUserDefaultParametersNames[systemContext.id] = new Promise(async (resolve) => {
                    const ClientSideTargetResolution = await Container.getServiceAsync("ClientSideTargetResolution");

                    const oParametersAndExtendedParameters = await ClientSideTargetResolution.getUserDefaultParameterNames(systemContext);

                    const oExtractedArrays = this._extractKeyArrays(oParametersAndExtendedParameters);
                    const aExtendedParameterNames = oExtractedArrays.extended;
                    const aAllParameterNames = oExtractedArrays.allParameters;
                    const oMetadataObject = this._arrayToObject(aAllParameterNames);

                    resolve({
                        aAllParameterNames: aAllParameterNames,
                        aExtendedParameterNames: aExtendedParameterNames,
                        oMetadataObject: oMetadataObject
                    });
                });
            }

            return this._oUserDefaultParametersNames[systemContext.id];
        };

        /**
         * @param {string} sParamName The parameter name
         * @param {object} oSystemContext The system context object
         * @returns {boolean} true if the parameter name is supported, false otherwise
         *
         * @private
         */
        this._isSupportedParameterName = async function (sParamName, oSystemContext) {
            const oResult = await this._getUserDefaultParameterNames(oSystemContext);

            if (!oResult.aAllParameterNames || oResult.aAllParameterNames.indexOf(sParamName) === -1) {
                Log.error(`The given parameter "${ sParamName }" is not part of the list of parameters for the given system context.`);
                return false;
            }
            return true;
        };

        /**
         * Attempt to determine whether there are user default parameters
         * maintainable for the end user or not.
         *
         * @param {object} systemContext The system context object.
         * @returns {Promise<boolean>}
         *      A promise that is resolved with a boolean value
         *      which has the value <code>true</code> if user default parameters are
         *      maintainable, and <code>false</code> if not.
         *      The promise will always be resolved.
         *      Note: In case an error occurs, the promise is resolved with <code>undefined</code>.
         *
         * @private
         */
        this.hasRelevantMaintainableParameters = async function (systemContext) {
            try {
                const oParameterNames = await this._getUserDefaultParameterNames(systemContext);

                if (!isEmptyObject(oParameterNames) && oParameterNames.aAllParameterNames) {
                    const aHasRelevantParameters = await Promise.all(oParameterNames.aAllParameterNames.map(async (sParameterName) => {
                        try {
                            const oValue = await this.getValue(sParameterName, systemContext);

                            if (oValue && !oValue.hasOwnProperty("noEdit")) {
                                return true;
                            }
                        } catch { /* always provide a value */ }

                        return false;
                    }));

                    return aHasRelevantParameters.some((bHasRelevantParameters) => bHasRelevantParameters);
                }
            } catch { /* always resolve */ }


            return false;
        };

        /**
         * Attempt to determine a value for the parameter name
         * <code>sParameterName</code>.
         *
         * @param {string} sParameterName The parameter name
         * @param {object} oSystemContext The system context object
         * @returns {Promise<object>} Resolves a rich parameter
         *      object containing a value, e.g. <code>{ value : "value" }</code>.
         *      The promise will typically always be resolved.
         *      Note: It will always return an object, the value property may be
         *      <code>undefined</code> if no value could be retrieved.
         *
         * @private
         * @ui5-restricted ssuite.smartbusiness
         */
        this.getValue = async function (sParameterName, oSystemContext) {
            // Strategy is as follows
            // a) get value from persistence,
            // b) if required ask all plugins in order whether they want to alter value
            // c) return value
            // c2) if value was altered, including set to undefined,
            //    [not on critical path] update value in remote persistence
            //    (potentially deleting value if set to undefined!)

            const bSupportedParameterName = await this._isSupportedParameterName(sParameterName, oSystemContext);

            if (!bSupportedParameterName) {
                return { value: undefined };
            }

            const oPersistedValue = await this._getPersistedValue(sParameterName, oSystemContext)
                .then((oValue) => {
                    this._oWasParameterPersisted[sParameterName] = true;
                    return oValue || { };
                })
                .catch(() => {
                    // If the server call fails, this ensures that the plugins get called.
                    return { value: undefined };
                });

            const oValueClone = deepClone(oPersistedValue);

            const bAskValueToPlugins =
                (!oValueClone._shellData && this._valueIsEmpty(oValueClone)) // _shellData is added by the shell when the parameter is stored
                || oValueClone.noStore // i.e., don't use the stored value
                || oValueClone.alwaysAskPlugin;

            if (!bAskValueToPlugins) {
                return oValueClone;
            }

            const oNewValue = await this._iterateOverPluginsToGetDefaultValue(sParameterName, oPersistedValue, oSystemContext);

            if (!this._oWasParameterPersisted[sParameterName] || !this._haveSameMembersValue(oValueClone, oNewValue, aStoreMembers)) {
                // avoid multiple calls result in storing a parameter, as we fire and forget via _storeValue below.
                this._oWasParameterPersisted[sParameterName] = true;

                await this._storeValue(sParameterName, oNewValue, false, oSystemContext)
                    .catch((err) => {
                        Log.error(err.message);
                    });
            }

            return oNewValue;
        };

        /**
         * Adds each of the parameter names from the given list to the given parameters object as key-value pairs.
         *
         * @param {object} oParameters The map the new parameters are to be added to
         * @param {string[]} aParameterNames A list containing the new parameter names
         * @param {object} oSystemContext The system context object
         * @returns {Promise<object>} Resolves the amended parameter map.
         *
         * @private
         */
        this._addParameterValuesToParameters = async function (oParameters, aParameterNames, oSystemContext) {
            await Promise.all(aParameterNames.map(async (sParameterName) => {
                const oValueObject = await this.getValue(sParameterName, oSystemContext);

                oParameters[sParameterName].valueObject = oValueObject;
            }));

            return oParameters;
        };

        /**
         * Converts an array of parameter names to an object with the parameter names as keys.
         * @param {string[]} aParameterNames
         * @returns {Object<string, object>}
         *
         * @private
         */
        this._arrayToObject = function (aParameterNames) {
            const oRes = {};
            aParameterNames.forEach((sParameterName) => {
                oRes[sParameterName] = {};
            });
            return oRes;
        };

        /**
         * @param {object} oPlugin a plugin.
         * @returns {string} The name of the plugin.
         *
         * @private
         */
        this._getComponentNameOfPlugin = function (oPlugin) {
            try {
                return oPlugin.getMetadata().getComponentName() || "";
            } catch (error) {
                return "'name of plugin could not be determined'";
            }
        };

        /**
         * @param {string[]} aAllParameterNames all assigned parameter names as array of strings
         * @param {string[]} aExtendedParameterNames the parameter names as array of strings
         * @param {object} oMetadataObject a raw metadata object, not yet amended by plugin data
         * @param {object} oSystemContext The system context object
         *
         * @private
         */
        this._getEditorDataAndValue = async function (aAllParameterNames, aExtendedParameterNames, oMetadataObject, oSystemContext) {
            const aPluginMetadata = await Promise.all(this._aPlugins.map(async (oPlugin) => {
                if (typeof oPlugin.getEditorMetadata === "function") {
                    try {
                        const oDeferred = oPlugin.getEditorMetadata(oMetadataObject, oSystemContext);
                        const oResultMetadata = await ushellUtils.promisify(oDeferred);

                        return oResultMetadata;
                    } catch (error) {
                        Log.error(`Error invoking getEditorMetaData on plugin: ${ error }${error.stack}`, null,
                        "sap.ushell.services.UserDefaultParameters");
                        return;
                    }
                }
            }));

            // all metadata present
            const aParameterNamesWithoutMetadata = [];
            // apply metadata results on top of the metadata object (start with last plugin result)
            const oParametersWithMetadata = aPluginMetadata.reverse().reduce((oPreviousValue, oPluginMetadata) => {
                aAllParameterNames.forEach((sParameterName) => {
                    if (oPluginMetadata?.[sParameterName]?.editorMetadata) {
                        oPreviousValue[sParameterName].editorMetadata = oPluginMetadata[sParameterName].editorMetadata;
                    }
                });
                return oPreviousValue;
            }, oMetadataObject);
            aAllParameterNames.forEach((sParameterName) => {
                if (!(oParametersWithMetadata[sParameterName] && oParametersWithMetadata[sParameterName].editorMetadata)) {
                    aParameterNamesWithoutMetadata.push(sParameterName);
                }
            });

            // blend in parameters
            const oBlendedParameters = await this._addParameterValuesToParameters(oParametersWithMetadata, aAllParameterNames, oSystemContext);
            // create a deep copy
            const oParametersDeepCopy = deepExtend({}, oBlendedParameters);
            // mark extended parameters!
            aExtendedParameterNames.forEach((sParameterName) => {
                if (oParametersDeepCopy[sParameterName]) {
                    oParametersDeepCopy[sParameterName].editorMetadata = oParametersDeepCopy[sParameterName].editorMetadata || {};
                    oParametersDeepCopy[sParameterName].editorMetadata.extendedUsage = true;
                }
            });
            // remove all noEdit parameters
            const aKeys = Object.keys(oParametersDeepCopy).splice(0);
            aKeys.forEach((sParameterName) => {
                let idx;
                if (oParametersDeepCopy[sParameterName].valueObject &&
                    oParametersDeepCopy[sParameterName].valueObject.noEdit === true) {
                    delete oParametersDeepCopy[sParameterName];
                    // also from the error log list (noEdit parameters w.o. editorMetadata are no cause of concern)
                    idx = aParameterNamesWithoutMetadata.indexOf(sParameterName);
                    if (idx >= 0) {
                        aParameterNamesWithoutMetadata.splice(idx, 1);
                    }
                }
            });
            if (aParameterNamesWithoutMetadata.length > 0) {
                Log.error(`The following parameter names have no editor metadata and thus likely no configured plugin:\n"${ aParameterNamesWithoutMetadata.join("\",\n\"") }".`);
            }
            return oParametersDeepCopy;
        };

        /**
         * Obtain the set or parameters, including values and metadata
         * for the UserDefaultParameterEditor
         *
         * This set is defined by all parameter values relevant for a given user
         * as determined by all values contained in Target mappings currently assigned to
         * the user
         *
         * @param {object} oSystemContext The system context object
         *
         * @returns {Promise<object>} Resolves an object with parameter names as members
         *
         * The order of parameters is suitable order for parameter display.
         *
         *  <pre>{
         *      CostCenter: {
         *          valueObject: {
         *              "value": "1000",
         *              "noEdit": false, // filtered out
         *              "noStore": true // not relevant for editor
         *          },
         *          "editorMetadata":{
         *              "displayText": "Company code",
         *              "description": "This is the company code",
         *              "groupId": "EXAMPLE-FIN-GRP1",
         *              "groupTitle": "FIN User Defaults (UShell examples)",
         *              "parameterIndex": 2,
         *              "editorInfo": {
         *                 "odataURL": "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
         *                 "entityName": "Defaultparameter",
         *                 "propertyName": "CompanyCode",
         *                 "bindingPath": "/Defaultparameters('FIN')"
         *              }
         *          }
         *      },
         *      Plant: {
         *          valueObject: {
         *              "value": "4711",
         *              "extendedValue": {
         *                  "Ranges": [
         *                      {
         *                          "Sign": "I",
         *                          "Option": "EQ",
         *                          "Low": "4800",
         *                          "High": null
         *                      }, {
         *                          "Sign": "I",
         *                          "Option": "BT",
         *                          "Low": "6000",
         *                          "High": "8500"
         *                    }
         *                 ]
         *              },
         *              "noEdit": false, // filtered out
         *              "noStore": true // not relevant for editor
         *          },
         *          "editorMetadata":{
         *              "displayText": "Company code",
         *              "description": "This is the company code",
         *              "groupId": "EXAMPLE-FIN-GRP1",
         *              "groupTitle": "FIN User Defaults (UShell examples)",
         *              "parameterIndex": 2,
         *              "extendedUsage" : true,
         *              "editorInfo": {
         *                 "odataURL": "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
         *                 "entityName": "Defaultparameter",
         *                 "propertyName": "CompanyCode",
         *                 "bindingPath": "/Defaultparameters('FIN')"
         *              }
         *          }
         *      }
         *  }</pre>
         * the list will not contain values which have noEdit set
         *
         * Note: whether maintenance of extended User Default values is to be enabled is
         * indicated by the boolean <code>extendedUsage</code> property(!), not
         * by the presence of an extendedValue.
         * When editing a simple user default ( extendedUsage : undefined ) the extendedValue
         * property is to be ignored
         *
         * The promise will typically always be resolved.
         * The first argument of the resolved response is
         * a list value object:
         * <code>{ value : sValueOrUndefined }</code>
         * Note: It will always return an object, the value property may be
         * undefined if no value could be retrieved.
         *
         * @private
         */
        this.editorGetParameters = async function (oSystemContext) {
            const oParametersAndExtendedParameters = await this._getUserDefaultParameterNames(oSystemContext);
            const { aAllParameterNames, aExtendedParameterNames, oMetadataObject } = oParametersAndExtendedParameters;

            if (oMetadataObject.length === 0) {
                // if array is empty, nothing to display in editor
                return {};
            }

            await this._loadPlugins();

            return this._getEditorDataAndValue(aAllParameterNames, aExtendedParameterNames, oMetadataObject, oSystemContext);
        };

        /**
         * Extracts and sorts the parameter names from the given object and ensures non-undefined values.
         *
         * @param {object} oParameters A object containing parameter names and values
         * @returns {object} An object containing simple, extended, and all parameters as lists
         *
         * @private
         */
        this._extractKeyArrays = function (oParameters) {
            const oResult = {
                simple: oParameters && oParameters.simple && Object.keys(oParameters.simple).sort() || [],
                extended: oParameters && oParameters.extended && Object.keys(oParameters.extended).sort() || []
            };

            const aOnlyExtendedParameters = oResult.extended.filter((sExtendedParameter) => {
                return oResult.simple.indexOf(sExtendedParameter) < 0;
            });

            oResult.allParameters = oResult.simple.concat(aOnlyExtendedParameters).sort();

            return oResult;
        };

        /**
         * Stores the value & persists it.
         * Note, if oValueObject.value is undefined, the value is deleted!
         *
         * @param {string} sParameterName Name of the parameter for the value which has to be saved
         * @param {object} oValueObject Value which has to be saved
         * @param {object} oSystemContext The system context object
         * @returns {Promise} Resolves once the value is stored.
         *
         * @see sap.ushell.Container#getServiceAsync
         * @since 1.32.0
         * @private
         */
        this.editorSetValue = async function (sParameterName, oValueObject, oSystemContext) {
            await this._storeValue(sParameterName, oValueObject, true, oSystemContext);
        };

        /**
         * Attaches a listener to the valueStored event.
         *
         * @param {function} fnFunction
         *     Event handler to be attached.
         *
         * @since 1.34.0
         * @private
         * @ui5-restricted FIN UserDefaults Plugin
         */
        this.attachValueStored = function (fnFunction) {
            oStoreValueEventProvider.attachEvent(sEventNameValueStored, fnFunction);
        };

        /**
         * Detaches a listener from the valueStored event.
         *
         * @param {function} fnFunction
         *     Event handler to be detached.
         *
         * @since 1.34.0
         * @private
         * @ui5-restricted FIN UserDefaults Plugin
         */
        this.detachValueStored = function (fnFunction) {
            oStoreValueEventProvider.detachEvent(sEventNameValueStored, fnFunction);
        };

        /**
         * Load the plugins for the UserDefaultParameters service.
         *
         * @since 1.128.0
         * @private
         */
        this._loadPlugins = async function () {
            const PluginManager = await Container.getServiceAsync("PluginManager");

            try {
                await ushellUtils.promisify(PluginManager.loadPlugins("UserDefaults"));
            } catch {
                Log.error("One or more plugins could not be loaded");
                throw new Error("Initialization of plugins failed");
            }
        };
    }

    UserDefaultParameters.hasNoAdapter = true;
    return UserDefaultParameters;
}, true /* bExport */);

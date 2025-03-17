// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview
 * The Unified Shell's UserDefaultParameterPersistence service provides read and write access
 * to a per-user storage of per-user persisted values.
 *
 * Note:
 * Values may be read-only once per launchpad and storage may be more coarse-grained than on parameter level.
 * Thus inconsistencies with concurrent editing in separate clients might arise.
 *
 * Note: [security, performance]
 * Values are cached client-side (Browser HTTP Cache), if the appropriate cache-busting is used.
 *
 * This is *not* an application facing service, but for Shell Internal usage.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/base/util/ObjectPath",
    "sap/ushell/Container",
    "sap/ushell/utils"
], function (
    Log,
    deepExtend,
    ObjectPath,
    Container,
    ushellUtils
) {
    "use strict";

    const aValidProperties = [
        "value", // the single value
        "extendedValue", // the extended value
        "noEdit", // boolean, indicates the property should be hidden from editor
        "alwaysAskPlugin", // boolean, indicates when obtaining a parameterValue the plugins will be queried
        "_shellData", // an opaque member which the shell uses to store information (e.g. timestamps etc)
        "pluginData" // an opaque member which plugins can use to store information on it (e.g. timestamps etc)
    ];

    /**
     * @alias sap.ushell.services.UserDefaultParameterPersistence
     * @class
     * @classdesc The Unified Shell's UserDefaultParameterPersistence service.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const UserDefaultParameterPersistence = await Container.getServiceAsync("UserDefaultParameterPersistence");
     *     // do something with the UserDefaultParameterPersistence service
     *   });
     * </pre>
     *
     * @param {object} oAdapter The service adapter for the UserDefaultParameterPersistence service, as already provided by the container
     * @param {object} oContainerInterface interface
     * @param {string} sParameter Service instantiation
     * @param {object} oConfig Service configuration (not in use)
     *
     * @hideconstructor
     *
     * @since 1.32.0
     * @private
     */
    function UserDefaultParameterPersistence (oAdapter/*, oContainerInterface, sParameter, oConfig*/) {
        this._oAdapter = oAdapter;
        this._oData = {};
    }

    UserDefaultParameterPersistence.prototype._cleanseValue = function (oValue) {
        const oResult = deepExtend({}, oValue);

        for (const a in oResult) {
            if (oResult.hasOwnProperty(a) && aValidProperties.indexOf(a) < 0) {
                delete oResult[a];
            }
        }

        return oResult;
    };

    /**
     * Returns a systemContext and defaults to the default systemContext
     * @returns {Promise<object>} A promise resolving to a systemContext
     *
     * @since 1.81.0
     * @private
     */
    UserDefaultParameterPersistence.prototype._getSystemContextFallback = async function () {
        Log.warning("UserDefaultParameterPersistence: The systemContext was not provided, using defaultSystemContext as fallback");

        const ClientSideTargetResolution = await Container.getServiceAsync("ClientSideTargetResolution");

        return ClientSideTargetResolution.getSystemContext();
    };

    /**
     * Loads a specific ParameterValue from persistence.
     * The first request will typically trigger loading of all parameters from the backend.
     *
     * @param {string} sParameterName parameter name to be loaded
     * @param {object} [oSystemContext] the used system context
     * @returns {Promise<object>} Resolves a rich parameter object containing a value,
     *   e.g. <code>{ value : "value" }</code>. Its fail handler receives a message string as first argument.
     *
     * @since 1.32.0
     * @private
     */
    UserDefaultParameterPersistence.prototype.loadParameterValue = async function (sParameterName, oSystemContext) {
        if (!oSystemContext) {
            oSystemContext = await this._getSystemContextFallback();
        }

        const sValue = ObjectPath.get([oSystemContext.id, sParameterName], this._oData);

        if (sValue !== undefined) {
            return sValue;
        }

        const oValue = await ushellUtils.promisify(this._oAdapter.loadParameterValue(sParameterName, oSystemContext));
        const oCleansedValue = this._cleanseValue(oValue);

        ObjectPath.set([oSystemContext.id, sParameterName], oCleansedValue, this._oData);

        Log.debug(`[UserDefaults] Fetched "${ sParameterName }" for SystemContext=${ oSystemContext.id } from Persistence`, JSON.stringify(oCleansedValue, null, 2));

        return oCleansedValue;
    };

    /**
     * Method to save the parameter value to persistence,
     * note that adapters may choose to save the value delayed and return early with a succeeded promise
     *
     * @param {string} sParameterName Parameter name
     * @param {object} oValueObject Parameter value object, contains at least <code>{ value :... }</code>
     * @param {object} [oSystemContext] The used system context
     * @returns {Promise} Resolves once the parameter was saved or rejects with an error message.
     *
     * @since 1.32.0
     * @public
     */
    UserDefaultParameterPersistence.prototype.saveParameterValue = async function (sParameterName, oValueObject, oSystemContext) {
        if (!oSystemContext) {
            oSystemContext = await this._getSystemContextFallback();
        }

        if (!oValueObject) {
            return ushellUtils.promisify(this.deleteParameter(sParameterName, oSystemContext));
        }

        const oCleansedValueObject = this._cleanseValue(oValueObject);

        if (oValueObject && oValueObject.noStore === true) {
            Log.debug(`[UserDefaults] Skipped Save "${ sParameterName }" for SystemContext=${ oSystemContext.id}`, "noStore=true");

            return;
        }

        Log.debug(`[UserDefaults] Saving "${ sParameterName }" for SystemContext=${ oSystemContext.id } to Persistence`, JSON.stringify(oCleansedValueObject, null, 2));

        ObjectPath.set([oSystemContext.id, sParameterName], oCleansedValueObject, this._oData);
        return ushellUtils.promisify(this._oAdapter.saveParameterValue(sParameterName, oCleansedValueObject, oSystemContext));
    };

    /**
     * Method to delete a parameter value from persistence
     * note that adapters may choose to save the value delayed and return early with a succeeded promise
     *
     * @param {string} sParameterName Parameter name to be deleted
     * @param {object} [oSystemContext] The system context to be used
     * @returns {Promise} Resolves once the parameter was deleted or rejects with an error message.
     *
     * @since 1.32.0
     * @public
     */
    UserDefaultParameterPersistence.prototype.deleteParameter = async function (sParameterName, oSystemContext) {
        if (!oSystemContext) {
            oSystemContext = await this._getSystemContextFallback();
        }

        if (this._oData[oSystemContext.id]) {
            Log.debug(`[UserDefaults] Deleting "${ sParameterName }" for SystemContext=${ oSystemContext.id } from Persistence`);

            delete this._oData[oSystemContext.id][sParameterName];
        }
        return ushellUtils.promisify(this._oAdapter.deleteParameter(sParameterName, oSystemContext));
    };

    /**
     * Method to obtain an array of string containing all Stored parameter names
     *
     * @param {object} oSystemContext the system context to be used
     * @returns {Promise<string[]>} Resolves an array of sorted strings.
     *
     * @since 1.32.0
     * @private
     */
    UserDefaultParameterPersistence.prototype.getStoredParameterNames = async function (oSystemContext) {
        if (!oSystemContext) {
            oSystemContext = await this._getSystemContextFallback();
        }

        const aResult = await ushellUtils.promisify(this._oAdapter.getStoredParameterNames(oSystemContext));
        return aResult.sort();
    };

    UserDefaultParameterPersistence.hasNoAdapter = false;
    return UserDefaultParameterPersistence;
}, true /* bExport */);

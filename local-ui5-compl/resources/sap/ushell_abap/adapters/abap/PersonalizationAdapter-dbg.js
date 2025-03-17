// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's personalization adapter for the ABAP
 *               platform.
 *               The internal data structure of the AdapterContainer corresponds to the
 *               ABAP EDM.
 *               Container header properties transported via pseudo-items are mapped to the
 *               respective header properties in setItem/getItem/delItem
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell_abap/adapters/abap/AdapterContainer",
    "sap/ushell_abap/pbServices/ui2/ODataWrapper",
    "sap/ushell_abap/pbServices/ui2/ODataService",
    "sap/ushell_abap/pbServices/ui2/Error",
    "sap/base/util/ObjectPath",
    "sap/base/Log",
    "sap/ushell/Container"
], function(
    AdapterContainer,
    ODataWrapper,
    ODataService,
    SrvcError,
    ObjectPath,
    Log,
    Container
) {
    "use strict";

    // --- Adapter ---

    /**
     * This method MUST be called by the Unified Shell's personalization service only.
     * Constructs a new instance of the personalization adapter for the ABAP
     * platform.
     *
     * @param {object} oSystem not used
     * @param {string} sParameters not used
     * @param {object} oConfig Config object
     * @classdesc The Unified Shell's personalization adapter for the ABAP platform.
     *
     * @class
     * @since 1.11.0
     * @private
     */
    var PersonalizationAdapter = function (oSystem, sParameters, oConfig) {
        Log.debug("[000] PersonalizationAdapter: constructor", "PersonalizationAdapter");
        this._oConfig = oConfig && oConfig.config;
        var sPersonalizationServiceURL = (ObjectPath.get("config.services.personalization.baseUrl", oConfig) || "/sap/opu/odata/UI2/INTEROP") + "/";
        var oODataWrapperSettings = {
            baseUrl: sPersonalizationServiceURL,
            "sap-language": Container.getUser().getLanguage(),
            "sap-client": Container.getLogonSystem().getClient()
        };
        this._oWrapper = ODataWrapper.createODataWrapper(oODataWrapperSettings);
        function fnDefaultFailure (oMessage) {
            throw new SrvcError(oMessage, "sap.ushell_abap.adapters.abap.PersonalizationAdapter");
        }
        ODataService.call(this, this._oWrapper, fnDefaultFailure);
    };

    // historically, the service always called  getAdapterContainer and then load
    // thus an implementation was not required to initialize a fully implemented container on getAdapterContainer
    // if the following property is set to true, it indicates getAdapterContainer is sufficient and a load is not
    // required if an initial contain is requested.
    PersonalizationAdapter.prototype.supportsGetWithoutSubsequentLoad = true;

    PersonalizationAdapter.prototype.getAdapterContainer = function (sContainerKey, oScope, sAppName) {
        return new AdapterContainer(sContainerKey, this, oScope, sAppName);
    };

    PersonalizationAdapter.prototype.delAdapterContainer = function (sContainerKey, oScope) {
        return this.getAdapterContainer(sContainerKey, oScope).del();
    };

    return PersonalizationAdapter;
});

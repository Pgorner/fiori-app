// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.CommonDataModel}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/CommonDataModel",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (
    CommonDataModel,
    AppRuntimeService
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.CommonDataModel
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.CommonDataModel}.
     *
     * @hideconstructor
     *
     * @private
     */
    function CommonDataModelProxy (oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        CommonDataModel.call(this, oAdapter, oContainerInterface, sParameters, oServiceConfiguration);

        this.getAllPages = function () {
            return AppRuntimeService.postMessageToFLP("sap.ushell.services.CommonDataModel.getAllPages");
        };
    }

    CommonDataModelProxy.prototype = CommonDataModel.prototype;
    CommonDataModelProxy.hasNoAdapter = CommonDataModel.hasNoAdapter;

    return CommonDataModelProxy;
});

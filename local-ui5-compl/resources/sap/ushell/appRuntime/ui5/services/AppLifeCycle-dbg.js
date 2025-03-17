// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.AppLifeCycle}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/services/AppLifeCycle"
], function (
    Log,
    AppRuntimeService,
    AppLifeCycle
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.AppLifeCycle
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.AppLifeCycle}.
     *
     * @hideconstructor
     *
     * @since 1.127.0
     * @private
     */
    function AppLifeCycleProxy (oContainerInterface, sParameters, oServiceConfiguration) {
        AppLifeCycle.call(this, oContainerInterface, sParameters, oServiceConfiguration);

        /**
         * Reloads the currently displayed app (used by RTA plugin).
         *
         * @since 1.127.0
         * @private
         */
        this.reloadCurrentApp = async function () {
            try {
                await AppRuntimeService.postMessageToFLP("sap.ushell.services.AppLifeCycle.reloadCurrentApp", {});
            } catch (err) {
                Log.error("reloadCurrentApp failed: ", err);
            }
        };
    }

    AppLifeCycleProxy.prototype = AppLifeCycle.prototype;
    AppLifeCycleProxy.hasNoAdapter = AppLifeCycle.hasNoAdapter;

    return AppLifeCycleProxy;
});

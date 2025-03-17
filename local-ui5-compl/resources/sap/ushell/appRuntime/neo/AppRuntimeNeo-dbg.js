// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview The NEO implementation of the app runtime.
 * @deprecated since 1.120
 */
sap.ui.define([], function () {
    "use strict";

    /**
     * Application runtime for UI5 applications running in iframe when the content provider is NEO
     * This is a temporatu development made for SAP IT to improve performance. Once
     * SAP IT will migrate all its Fiori applications to CF, this code should be removed.
     *
     * @private
     */
    sap.ui.require([
        "sap/ushell/appRuntime/neo/ProxyAppUtils",
        "sap/ushell/appRuntime/neo/AppInfoService"
    ], function (ProxyAppUtils) {
        ProxyAppUtils.initRequestInterceptionFramework().then(() => {
            sap.ui.require(["sap/ushell/appRuntime/ui5/AppRuntime"], Function.prototype);
        });
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.LaunchPage}.
 *
 * @version 1.132.1
 * @deprecated since 1.120. This service has been deprecated as it only works for the classic homepage.
 */
sap.ui.define([
    "sap/ushell/services/LaunchPage",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (
    LaunchPage,
    AppRuntimeService
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.LaunchPage
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.LaunchPage}.
     *
     * @hideconstructor
     *
     * @private
     * @deprecated since 1.120. This service has been deprecated as it only works for the classic homepage.
     */
    function LaunchPageProxy (oContainerInterface, sParameters, oServiceConfiguration) {
        LaunchPage.call(this, oContainerInterface, sParameters, oServiceConfiguration);

        this.getGroupsForBookmarks = function () {
            return AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.LaunchPage.getGroupsForBookmarks");
        };
    }

    LaunchPageProxy.prototype = LaunchPage.prototype;
    LaunchPageProxy.hasNoAdapter = LaunchPage.hasNoAdapter;

    return LaunchPageProxy;
});

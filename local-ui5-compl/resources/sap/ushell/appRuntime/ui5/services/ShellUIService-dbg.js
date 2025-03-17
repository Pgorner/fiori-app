// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.ui5service.ShellUIService}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/core/service/ServiceFactory",
    "sap/ushell/ui5service/ShellUIService",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/ui/thirdparty/jquery"
], function (
    EventBus,
    ServiceFactoryRegistry,
    ServiceFactory,
    ShellUIService,
    AppCommunicationMgr,
    AppRuntimeService,
    AppRuntimeContext,
    jQuery
) {
    "use strict";

    var sLastSetTitle,
    bRegistered = false,
    fnBackNavigationCallback;

    /**
     * @alias sap.ushell.appRuntime.ui5.services.ShellUIService
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.ui5service.ShellUIService}.
     *
     * @hideconstructor
     *
     * @private
     */
    var ShellUIServiceProxy = ShellUIService.extend("sap.ushell.appRuntime.services.ShellUIService", {

        setTitle: function (sTitle) {
            if (!sTitle) {
                return;
            }
            sLastSetTitle = sTitle;
            AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.ShellUIService.setTitle", {
                    sTitle: sTitle
                });
        },

        getTitle: function () {
            return sLastSetTitle;
        },

        setHierarchy: function (aHierarchyLevels) {
            return AppRuntimeContext.checkIntentsConversionForScube(aHierarchyLevels).then(function (aNewHierarchyLevels) {
                return AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.ShellUIService.setHierarchy", {
                        aHierarchyLevels: aNewHierarchyLevels
                    });
            });
        },

        setRelatedApps: function (aRelatedApps) {
            return AppRuntimeContext.checkIntentsConversionForScube(aRelatedApps).then(function (aNewRelatedApps) {
                return AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.ShellUIService.setRelatedApps", {
                        aRelatedApps: aNewRelatedApps
                    });
            });
        },

        setBackNavigation: function (fnCallback) {
            if (!bRegistered) {
                bRegistered = true;
                AppCommunicationMgr.registerCommHandlers({
                    "sap.ushell.appRuntime": {
                        oServiceCalls: {
                            handleBackNavigation: {
                                executeServiceCallFn: function (oServiceParams) {
                                    if (fnBackNavigationCallback) {
                                        fnBackNavigationCallback();
                                    } else if (AppRuntimeContext.checkDataLossAndContinue()) {
                                        window.history.back();
                                    }
                                    return new jQuery.Deferred().resolve().promise();
                                }
                            }
                        }
                    }
                });
            }

            fnBackNavigationCallback = fnCallback;
            AppRuntimeService.postMessageToFLP(
                "sap.ushell.ui5service.ShellUIService.setBackNavigation", {
                    callbackMessage: {
                        service: "sap.ushell.appRuntime.handleBackNavigation"
                    }
                });
        },

        _getBackNavigationCallback: function () {
            return fnBackNavigationCallback;
        },

        _resetBackNavigationCallback: function () {
            this.setBackNavigation();
        }
    });

    /**
     * Resets the local title variable to undefined.
     */
    ShellUIServiceProxy._resetTitle = function () {
        sLastSetTitle = undefined;
    };

    // reset last title locally to undefined after an app was closed
    EventBus.getInstance().subscribe("sap.ushell", "appClosed", ShellUIServiceProxy._resetTitle);

    // Register this service with the generic factory
    ServiceFactoryRegistry.register(
        "sap.ushell.ui5service.ShellUIService",
        new ServiceFactory(ShellUIServiceProxy)
    );

    return ShellUIServiceProxy;
});

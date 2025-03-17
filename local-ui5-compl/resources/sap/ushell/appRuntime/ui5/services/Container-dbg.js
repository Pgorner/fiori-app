// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.Container}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/base/assert"
], function (
    Container,
    AppRuntimeService,
    assert
) {
    "use strict";

    var oAdapter,
        oSessionHandlerAgent,
        oRenderer,
        isDirty = false,
        aRegisteredDirtyMethods = [],
        aAsyncLogoutEventFunctions = [],
        aSyncLogoutEventFunctions = [],
        bRegistered = false;

    //get indication if we are in App Runtime
    Container.inAppRuntime = function () {
        return true;
    };
    //for backward computability
    Container.runningInIframe = this.inAppRuntime;

    Container.getFLPUrl = function (bIncludeHash) {
        return AppRuntimeService.sendMessageToOuterShell(
            "sap.ushell.services.Container.getFLPUrl", {
                bIncludeHash: bIncludeHash
            });
    };

    Container.getFLPUrlAsync = function (bIncludeHash) {
        return this.getFLPUrl(bIncludeHash);
    };

    /**
     * Gets a renderer instance for the given renderer name.
     * @returns {sap.ui.core.Control|sap.ui.core.Component} The renderer instance.
     *
     * @private
     * @deprecated since 1.120.0. Use {@link sap.ushell.services.Extension} for shell extensions instead.
     */
    Container.getRenderer = function () {
        // For compatibility with previous implementations and tests.
        // Please use getRendererInternal instead.
        return oRenderer;
    };

    // Use getRendererInternal to avoid confusion with deprecated public API
    // and for consistency with sap/ushell/Container internal API.
    Container.getRendererInternal = function () {
        return oRenderer;
    };

    Container.logout = function () {
        return oAdapter.logout();
    };

    Container.getFLPPlatform = function () {
        return AppRuntimeService.sendMessageToOuterShell(
            "sap.ushell.services.Container.getFLPPlatform"
        );
    };

    Container.extendSession = function () {
        oSessionHandlerAgent?.userActivityHandler();
    };

    Container.setDirtyFlag = function (bIsDirty) {
        isDirty = bIsDirty;
    };

    /**
     * Overwrites the Container's getDirtyFlag API with an app runtime specific implementation.
     *
     * @returns {boolean} The value of the dirty flag or the determined dirty state returned by the dirty state providers.
     *
     * @private
     * @deprecated since 1.120
     */
    Container.getDirtyFlag = function () {
        return isDirty || this.handleDirtyStateProvider();
    };

    Container.registerDirtyStateProvider = function (fnDirty) {
        if (typeof fnDirty !== "function") {
            throw new Error("fnDirty must be a function");
        }
        aRegisteredDirtyMethods.push(fnDirty);
    };

    /**
     * Gets the dirty state from the registered dirty state providers.
     *
     * @param {object} [oExternalNavigationContext] The navigation context provided by the outer shell
     * @returns {boolean} The dirty state
     *
     * @private
     */
    Container.handleDirtyStateProvider = function (oExternalNavigationContext) {
        var bDirty = false;
        if (aRegisteredDirtyMethods.length > 0) {
            const oNavigationContext = oExternalNavigationContext || this._oShellNavigationInternal.getNavigationContext();
            for (var i = 0; i < aRegisteredDirtyMethods.length && bDirty === false; i++) {
                bDirty = bDirty || (aRegisteredDirtyMethods[i](oNavigationContext) || false);
            }
        }
        return bDirty;
    };

    Container.deregisterDirtyStateProvider = function (fnDirty) {
        if (typeof fnDirty !== "function") {
            throw new Error("fnDirty must be a function");
        }

        var nIndex = -1;
        for (var i = aRegisteredDirtyMethods.length - 1; i >= 0; i--) {
            if (aRegisteredDirtyMethods[i] === fnDirty) {
                nIndex = i;
                break;
            }
        }

        if (nIndex >= 0) {
            aRegisteredDirtyMethods.splice(nIndex, 1);
        }
    };

    Container.cleanDirtyStateProviderArray = function () {
        aRegisteredDirtyMethods = [];
        isDirty = false;
    };

    this.setAsyncDirtyStateProvider = function () {
        //overide the orig function in order to do nothing in AppRuntime
    };

    // This is used ONLY when a keep-alive application is stored
    Container.getAsyncDirtyStateProviders = function () {
        return aRegisteredDirtyMethods;
    };

    // This is used ONLY when a keep-alive application is restored
    // Dirty state providers that was registered before are re-registered
    Container.setAsyncDirtyStateProviders = function (aDirtyStateProviders) {
        aRegisteredDirtyMethods = aDirtyStateProviders;
    };

    function _insertFunction (aFunctionsArray, fnFunction) {
        var bFound = false;

        for (var i = 0; i < aFunctionsArray.length; i++) {
            if (aFunctionsArray[i] === fnFunction) {
                bFound = true;
                break;
            }
        }
        if (!bFound) {
            aFunctionsArray.push(fnFunction);
        }
    }

    // Attaches a listener to the logout event.
    // The fnFunction must return a promise. FLP will wait for the promise
    // to be resolved before doing the actual logout.
    Container.attachLogoutEvent = function (fnFunction, bAsyncFunction) {
        assert(typeof (fnFunction) === "function", "Container.attachLogoutEvent: fnFunction must be a function");

        if (bAsyncFunction === true) {
            _insertFunction(aAsyncLogoutEventFunctions, fnFunction);
        } else {
            _insertFunction(aSyncLogoutEventFunctions, fnFunction);
        }

        if (!bRegistered) {
            bRegistered = true;
            AppRuntimeService.postMessageToFLP("sap.ushell.services.Container.attachLogoutEvent", {});
        }
    };

    Container._getAsyncFunctionsArray = function () {
        return aAsyncLogoutEventFunctions;
    };

    Container._getSyncFunctionsArray = function () {
        return aAsyncLogoutEventFunctions;
    };

    Container.executeAsyncAndSyncLogoutFunctions = function () {
        return new Promise(function (fnResolve, fnReject) {
            var arrAsyncLogoutEventsPromises = [];

            if (aSyncLogoutEventFunctions.length > 0) {
                for (var i = 0; i < aSyncLogoutEventFunctions.length; i++) {
                    aSyncLogoutEventFunctions[i]();
                }
            }

            if (aAsyncLogoutEventFunctions.length > 0) {
                for (var j = 0; j < aAsyncLogoutEventFunctions.length; j++) {
                    arrAsyncLogoutEventsPromises.push(aAsyncLogoutEventFunctions[j]());
                }
            }

            Promise.all(arrAsyncLogoutEventsPromises).then(fnResolve);
        });
    };

    function _detachFunction (aFunctionArray, fnFunction) {
        for (var i = 0; i < aFunctionArray.length; i++) {
            if (aFunctionArray[i] === fnFunction) {
                aFunctionArray.splice(i, 1);
                break;
            }
        }
    }

    Container.detachLogoutEvent = function (fnFunction) {
        _detachFunction(aSyncLogoutEventFunctions, fnFunction);
        _detachFunction(aAsyncLogoutEventFunctions, fnFunction);
    };

    Container._getAsyncFunctionsArray = function () {
        return aAsyncLogoutEventFunctions;
    };

    Container._getSyncFunctionsArray = function () {
        return aSyncLogoutEventFunctions;
    };

    Container._clearAsyncFunctionsArray = function () {
        aAsyncLogoutEventFunctions = [];
    };

    Container._clearSyncFunctionsArray = function () {
        aSyncLogoutEventFunctions = [];
    };

    const _originalInit = Container.init.bind(Container);
    Container.init = function (sPlatform, mAdapterPackagesByPlatform) {
        return new Promise(function (fnResolve) {
            sap.ui.require([
                "sap/ushell/appRuntime/ui5/SessionHandlerAgent",
                "sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer",
                "sap/ushell/appRuntime/ui5/ui/UIProxy"
            ], function (SessionHandlerAgent, Renderer) {
                oSessionHandlerAgent = SessionHandlerAgent;
                oRenderer = Renderer;
                _originalInit(sPlatform, mAdapterPackagesByPlatform)
                    .then(() => {
                        oAdapter = Container._getAdapter();
                        return Container.getServiceAsync("ShellNavigationInternal");
                    })
                    .then(function (oShellNavigationInternal) {
                        // This is already set by the original init function of the Container
                        // We set it again here so that we don't rely on this dependency
                        Container._oShellNavigationInternal = oShellNavigationInternal;
                        fnResolve();
                    });
            });
        });
    };

    return Container;
}, false);

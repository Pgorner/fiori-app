// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.Navigation}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/Navigation",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/services/appstate/AppState",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/base/util/deepClone",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/appRuntime/ui5/services/Container"
], function (
    Navigation,
    AppRuntimeService,
    AppStateAppState,
    AppRuntimeContext,
    deepClone,
    UrlParsing,
    Container
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.Navigation
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.Navigation}.
     *
     * @hideconstructor
     *
     * @private
     */
    function NavigationProxy (oContainerInterface, sParameters, oServiceConf) {
        Navigation.call(this, oContainerInterface, sParameters, oServiceConf);

        this.getHref = function (oTarget) {
            //not ready for scube
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Navigation.getHref", {
                    oTarget: oTarget
                });
        };

        this.backToPreviousApp = function () {
            //ready also for scube
            if (AppRuntimeContext.checkDataLossAndContinue()) {
                return AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.Navigation.backToPreviousApp"
                );
            }

            return Promise.resolve();
        };

        this.historyBack = function (iSteps) {
            //ready for scube
            if (AppRuntimeContext.checkDataLossAndContinue()) {
                AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.Navigation.historyBack", {
                        iSteps: iSteps
                    }
                );
            }
        };

        this.isInitialNavigation = function () {
            //ready for scube
            return AppRuntimeService.postMessageToFLP("sap.ushell.services.Navigation.isInitialNavigation", {});
        };

        this.navigate = function (oTarget, oComponent) {
            //ready also for scube
            if (AppRuntimeContext.getIsScube()) {
                if (oTarget.target && oTarget.target.shellHash) {
                    var oTmpArgs = UrlParsing.parseShellHash(oTarget.target.shellHash);
                    if (oTmpArgs.params) {
                        delete oTmpArgs.params["sap-app-origin"];
                        oTarget.target.shellHash = UrlParsing.constructShellHash(oTmpArgs);
                    }
                } else if (oTarget.params) {
                    delete oTarget.params["sap-app-origin"];
                }
                return Container.getServiceAsync("ShellNavigationInternal").then(function (oShellNavigationInternal) {
                    return oShellNavigationInternal.toExternal(oTarget, oComponent);
                });
            } else if (AppRuntimeContext.checkDataLossAndContinue()) {
                return AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.Navigation.navigate", {
                        oTarget: oTarget
                    });
            }

            return Promise.resolve();
        };

        this.getPrimaryIntent = async function (sSemanticObject, oLinkFilter) {
            //not ready for scube
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Navigation.getPrimaryIntent", {
                    sSemanticObject: sSemanticObject,
                    oLinkFilter: oLinkFilter
                }
            );
        };

        this.getLinksLocal = this.getLinks;
        this.getLinks = function (aLinkFilter = []) {
            //ready also for scube
            function removeComponent (oArgsParam) {
                oArgsParam.forEach(function (element) {
                    if (element) {
                        delete element.ui5Component;
                    }
                });
            }

            if (!Array.isArray(aLinkFilter)) {
                throw new Error("Unexpected Input: aLinkFilter has to be an array with plain objects!");
            }

            if (AppRuntimeContext.getIsScube()) {
                this.getLinksLocal(aLinkFilter).then(function (arrResult1) {
                    removeComponent(aLinkFilter);
                    return AppRuntimeService.postMessageToFLP(
                        "sap.ushell.services.Navigation.getLinks", aLinkFilter).then(function (arrResult2) {
                        if (arrResult1.length !== 0) {
                            arrResult2 = arrResult2.concat(arrResult1);
                        }
                        return arrResult2;
                    });
                });
            } else {
                removeComponent(aLinkFilter);
                return AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.Navigation.getLinks", aLinkFilter);
            }
        };

        this.getSemanticObjectsLocal = this.getSemanticObjects;
        this.getSemanticObjects = function () {
            //ready for scube
            if (AppRuntimeContext.getIsScube()) {
                return this.getSemanticObjectsLocal();
            }

            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Navigation.getSemanticObjects"
            );
        };

        this.isNavigationSupported = function (aTargets, oComponent, bCheckInOuterShellOnly) {
            var fnCheckInShell = function (aTargetsTmp) {
                return AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.Navigation.isNavigationSupported", {
                        aTargets: aTargetsTmp
                    }
                );
            };

            if (bCheckInOuterShellOnly === true) {
                return fnCheckInShell(aTargets);
            }

            if (AppRuntimeContext.getIsScube()) {
                var aFilteredIntents;
                aFilteredIntents = aTargets.map(function (oArg) {
                    if (typeof oArg === "object") {
                        var oNewArg = oArg;
                        if (oArg.params && oArg.params.hasOwnProperty("sap-app-origin")) {
                            oNewArg = deepClone(oArg);
                            delete oNewArg.params["sap-app-origin"];
                        }
                        return oNewArg;
                    }
                    return oArg;
                });
                return Container.getServiceAsync("NavTargetResolutionInternal").then(function (NavTargetResolutionInternal) {
                    return NavTargetResolutionInternal.isNavigationSupported(aFilteredIntents, oComponent);
                });
            }

            return fnCheckInShell(aTargets);
        };

        this.getAppState = function (oAppComponent, sAppStateKey) {
            //ready also for scube
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Navigation.getAppState", {
                    sAppStateKey: sAppStateKey
                }).then(function (oState) {
                return Container.getServiceAsync("AppState").then(function (AppStateService) {
                    var oAppStateAppState = new AppStateAppState(
                        AppStateService,
                        oState._sKey,
                        oState._bModifiable,
                        oState._sData,
                        oState._sAppName,
                        oState._sACHComponent,
                        oState._bTransient);

                    return oAppStateAppState;
                });
            });
        };

        this.resolveIntentLocal = this.resolveIntent;
        this.resolveIntent = function (sHashFragment) {
            //ready for scube
            if (AppRuntimeContext.getIsScube()) {
                return this.resolveIntentLocal(sHashFragment);
            }

            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Navigation.resolveIntent", {
                    sHashFragment: sHashFragment
                });
        };

        this.isUrlSupported = function (sUrl) {
            return AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.Navigation.isUrlSupported", {
                    sUrl: sUrl
                }
            );
        };
    }

    NavigationProxy.prototype = Navigation.prototype;
    NavigationProxy.hasNoAdapter = Navigation.hasNoAdapter;

    return NavigationProxy;
}, true);

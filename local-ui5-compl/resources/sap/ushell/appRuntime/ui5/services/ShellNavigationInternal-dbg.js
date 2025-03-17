// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.ShellNavigationInternal}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/ShellNavigationInternal",
    "sap/ushell/appRuntime/ui5/services/Container",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/ushell/utils/UrlParsing"
], function (
    ShellNavigationInternal,
    Container,
    AppRuntimeService,
    AppRuntimeContext,
    UrlParsing
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.ShellNavigationInternal
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.ShellNavigationInternal}.
     *
     * @hideconstructor
     *
     * @private
     */
    function ShellNavigationInternalProxy (oContainerInterface, sParameters, oServiceConfiguration) {
        ShellNavigationInternal.call(this, oContainerInterface, sParameters, oServiceConfiguration);

        this.toExternal = async function (oArgs, oComponent, bWriteHistory) {
            if (!AppRuntimeContext.checkDataLossAndContinue()) {
                return;
            }
            if (AppRuntimeContext.getIsScube()) {
                return Container.getServiceAsync("NavTargetResolutionInternal").then(function (oNavTargetResolution) {
                    var sTargetHash = UrlParsing.constructShellHash(oArgs);
                    return oNavTargetResolution.isIntentSupportedLocal([sTargetHash]).then(function (oSupported) {
                        if (oSupported[sTargetHash].supported === true) {
                            if (oArgs.target.shellHash) {
                                oArgs = UrlParsing.parseShellHash(oArgs.target.shellHash);
                                oArgs.target = {
                                    semanticObject: oArgs.semanticObject,
                                    action: oArgs.action
                                };
                                delete oArgs.semanticObject;
                                delete oArgs.action;
                            }
                            oArgs.params["sap-shell-so"] = oArgs.target.semanticObject;
                            oArgs.params["sap-shell-action"] = oArgs.target.action;
                            oArgs.params["sap-remote-system"] = AppRuntimeContext.getRemoteSystemId();
                            oArgs.target.semanticObject = "Shell";
                            oArgs.target.action = "startIntent";
                        }

                        AppRuntimeService.sendMessageToOuterShell(
                            "sap.ushell.services.CrossApplicationNavigation.toExternal", {
                                oArgs: oArgs
                            });
                    });
                });

            }
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.toExternal", {
                    oArgs: oArgs
                });
        };

        this.toAppHash = function (sAppHash, bWriteHistory) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellNavigationInternal.toExternal", {
                sAppHash: sAppHash,
                bWriteHistory: bWriteHistory
            });
        };
    }

    ShellNavigationInternalProxy.prototype = ShellNavigationInternal.prototype;
    ShellNavigationInternalProxy.hasNoAdapter = ShellNavigationInternal.hasNoAdapter;

    return ShellNavigationInternalProxy;
}, true);

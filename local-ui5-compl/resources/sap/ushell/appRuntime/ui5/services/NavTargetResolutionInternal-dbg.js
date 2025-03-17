// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.NavTargetResolutionInternal}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/NavTargetResolutionInternal",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/AppRuntimeContext",
    "sap/ui/thirdparty/jquery"
], function (
    NavTargetResolutionInternal,
    AppRuntimeService,
    AppRuntimeContext,
    jQuery
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.NavTargetResolutionInternal
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.NavTargetResolutionInternal}.
     *
     * @hideconstructor
     *
     * @private
     */
    function NavTargetResolutionInternalProxy (oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        NavTargetResolutionInternal.call(this, oAdapter, oContainerInterface, sParameters, oServiceConfiguration);

        this.getDistinctSemanticObjectsLocal = this.getDistinctSemanticObjects;
        this.getDistinctSemanticObjects = function () {
            var oDeferred = new jQuery.Deferred(),
                aPromises = [],
                arrResult;

            aPromises.push(AppRuntimeContext.getIsScube() ? this.getDistinctSemanticObjectsLocal() : Promise.resolve([]));
            aPromises.push(AppRuntimeService.postMessageToFLP(
                    "sap.ushell.services.NavTargetResolutionInternal.getDistinctSemanticObjects"
                ));
            Promise.allSettled(aPromises).then(function (aResults) {
                arrResult = aResults[0].status === "fulfilled" ? aResults[0].value : [];
                arrResult = arrResult.concat(aResults[1].status === "fulfilled" ? aResults[1].value : []);
                arrResult = arrResult.filter(function (item, pos, self) {
                    return self.indexOf(item) === pos;
                }).sort();
                oDeferred.resolve(arrResult);
            });

            return oDeferred.promise();
        };

        this.expandCompactHash = function (sHashFragment) {
            if (sHashFragment && sHashFragment.indexOf("sap-intent-param") > 0) {
                return AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.NavTargetResolutionInternal.expandCompactHash", {
                        sHashFragment: sHashFragment
                    });
            }
            return new jQuery.Deferred().resolve(sHashFragment).promise();
        };

        this.resolveHashFragmentLocal = this.resolveHashFragment;
        this.resolveHashFragment = function (sHashFragment) {
            if (AppRuntimeContext.getIsScube()) {
                var oDeferred = new jQuery.Deferred();

                this.resolveHashFragmentLocal(sHashFragment)
                    .done(oDeferred.resolve)
                    .fail(function () {
                        return AppRuntimeService.postMessageToFLP(
                            "sap.ushell.services.NavTargetResolutionInternal.resolveHashFragment", {
                                sHashFragment: sHashFragment
                            }).then(oDeferred.resolve, oDeferred.reject);
                    });
                return oDeferred.promise();
            }
                return AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.NavTargetResolutionInternal.resolveHashFragment", {
                        sHashFragment: sHashFragment
                    });

        };

        this.isIntentSupportedLocal = this.isIntentSupported;
        this.isIntentSupported = function (aIntents) {
            var oDeferred = new jQuery.Deferred(),
                aPromises = [],
                oResult1,
                oResult2;

            aPromises.push(AppRuntimeContext.getIsScube() ? this.isIntentSupportedLocal(aIntents) : Promise.resolve(undefined));
            aPromises.push(AppRuntimeService.postMessageToFLP(
                "sap.ushell.services.NavTargetResolutionInternal.isIntentSupported", {
                    aIntents: aIntents
                }));
            Promise.allSettled(aPromises).then(function (aResults) {
                oResult1 = aResults[0].status === "fulfilled" ? aResults[0].value : undefined;
                oResult2 = aResults[1].status === "fulfilled" ? aResults[1].value : undefined;
                if (oResult1 && oResult2) {
                    Object.keys(oResult1).forEach(function (sIntent) {
                        oResult1[sIntent].supported = oResult1[sIntent].supported || oResult2[sIntent].supported;
                    });
                } else if (oResult1 || oResult2) {
                    oResult1 = oResult1 || oResult2;
                } else {
                    oResult1 = {};
                    aIntents.forEach(function (sIntent) {
                        oResult1[sIntent] = { supported: undefined };
                    });
                }
                oDeferred.resolve(oResult1);
            });

            return oDeferred.promise();
        };
        this._isIntentSupportedLocal = this.isIntentSupportedLocal;
        this._isIntentSupported = this.isIntentSupported;
    }

    NavTargetResolutionInternalProxy.prototype = NavTargetResolutionInternal.prototype;
    NavTargetResolutionInternalProxy.hasNoAdapter = NavTargetResolutionInternal.hasNoAdapter;

    return NavTargetResolutionInternalProxy;
}, true);

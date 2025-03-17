// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/Deferred",
    "sap/ui/core/EventBus",
    "sap/ushell/components/applicationIntegration/application/BlueBoxesCache",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/utils",
    "sap/ushell/Container"
], function (
    Deferred,
    EventBus,
    BlueBoxesCache,
    PostMessageUtils,
    hasher,
    utils,
    Container
) {
    "use strict";

    function BlueBoxHandler () {
        const aBasicStatefulCapabilities = [{
            service: "sap.ushell.services.AppLifeCycle",
            action: "create"
        }, {
            service: "sap.ushell.services.AppLifeCycle",
            action: "destroy"
        }];

        this.STATEFUL_TYPES = {
            FLP_V2_KEEP_ALIVE: -2,
            GUI_V1_KEEP_ALIVE: -1,
            NOT_SUPPORTED: 0,
            GUI_V1: 1,
            FLP_V2: 2
        };

        this.init = function () {
            // contains applicationContainers and manages the state of usage based on iframe properties
            BlueBoxesCache.init();
        };

        this.addNewBlueBox = function (oApplicationContainer, oResolvedHashFragment) {
            if (!oApplicationContainer || !oResolvedHashFragment) {
                return;
            }

            BlueBoxesCache.add(oResolvedHashFragment.url, oApplicationContainer);
            oApplicationContainer.setProperty("blueBoxCapabilities", {}, true);
        };

        this.deleteBlueBoxByUrl = function (sUrl) {
            BlueBoxesCache.remove(sUrl);
        };

        this.deleteBlueBoxByContainer = function (oApplicationContainer) {
            BlueBoxesCache.removeByContainer(oApplicationContainer);
        };

        this.getBlueBoxesCount = function () {
            return BlueBoxesCache.getLength() + BlueBoxesCache.getPoolLength();
        };

        this.getBlueBoxByUrl = function (sUrl) {
            return BlueBoxesCache.get(sUrl);
        };

        this.getBlueBoxById = function (sId) {
            return BlueBoxesCache.getByApplicationContainerId(sId);
        };

        // the second param is only called for the retrieval of regular frames for future keepAlive use
        this.removeCapabilities = function (oApplicationContainer, oCapabilities) {
            if (!oApplicationContainer || !BlueBoxesCache.isApplicationContainerActive(oApplicationContainer)) {
                return;
            }

            oApplicationContainer.removeBlueBoxCapabilities(oCapabilities);
            if (this.isStatefulContainer(oApplicationContainer)) {
                // todo [FLPCOREANDUX-10024] remove side effect setProperty
                oApplicationContainer.setProperty("statefulType", this.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE, true);
            }
        };

        this.statefulCreateApp = async function (oApplicationContainer, sUrl, sStorageKey, oResolvedHashFragment, bNavigationInSameStatefulContainer) {
            let oFLPParams;

            oApplicationContainer.setProperty("reservedParameters", oResolvedHashFragment.reservedParameters, true);
            oApplicationContainer.setProperty("currentAppUrl", sUrl, true);
            oApplicationContainer.setProperty("currentAppId", sStorageKey, true);
            oApplicationContainer.setProperty("currentAppTargetResolution", oResolvedHashFragment, true);

            if (oApplicationContainer._checkNwbcUrlAdjustment) {
                sUrl = oApplicationContainer._checkNwbcUrlAdjustment(oApplicationContainer, oResolvedHashFragment.applicationType, sUrl);
            }

            const oPostParams = {
                sCacheId: sStorageKey,
                sUrl: sUrl,
                sHash: hasher.getHash()
            };

            if (sUrl.indexOf("sap-iframe-hint=GUI") > 0 || sUrl.indexOf("sap-iframe-hint=WDA") > 0 || sUrl.indexOf("sap-iframe-hint=WCF") > 0) {
                var oAppStatesInfo = utils.getParamKeys(sUrl);

                if (oAppStatesInfo.aAppStateNamesArray.length > 0) {
                    try {
                        const Navigation = await Container.getServiceAsync("Navigation");
                        const aDataArray = await Navigation.getAppStateData(oAppStatesInfo.aAppStateKeysArray);
                        oFLPParams = {};
                        oAppStatesInfo.aAppStateNamesArray.forEach((item, index) => {
                            if (aDataArray[index]) {
                                oFLPParams[item] = aDataArray[index];
                            }
                        });
                    } catch {
                        // fail silently
                    }
                } else {
                    oFLPParams = {};
                }
            }

            if (oFLPParams) {
                oFLPParams["sap-flp-url"] = Container.getFLPUrl(true);
                oFLPParams["system-alias"] = oApplicationContainer.getSystemAlias();
                oPostParams["sap-flp-params"] = oFLPParams;
            }

            EventBus.getInstance().publish("launchpad", "appOpening", oResolvedHashFragment);

            // If the iframe is hidden, calls of setTimeout and setInterval are throttled within the iframe for certain browsers
            // (currently Chrome and Edge) if the iframe content comes from a third-party domain.
            // This can lead to a delayed app start as the following post message to create the app within the iFrame waits until the app is created.
            // Currently this is only relevant for the UI5 app runtime when its UI5 bootstrap is not switched to async.
            // In this case UI5 uses many setTimeouts with a delay of 0 during component creation to simulate async behavior.
            const bIsHidden = oApplicationContainer.hasStyleClass("hidden");
            if (bIsHidden) {
                // With this approach the new app is not visible yet but the iframe is not throttled.
                oApplicationContainer.addStyleClass("sapUShellApplicationContainerIframeHiddenButActive");
                oApplicationContainer.removeStyleClass("hidden");
            }

            const oResult = await PostMessageUtils.postMessageToIframeApp(oApplicationContainer, "sap.ushell.services.appLifeCycle", "create", oPostParams, true);

            if (bIsHidden) {
                // Add the hidden class again as the AppContainer relies on its existence to navigate between its content.
                oApplicationContainer.addStyleClass("hidden");
                oApplicationContainer.removeStyleClass("sapUShellApplicationContainerIframeHiddenButActive");
            }

            const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");
            if (bNavigationInSameStatefulContainer === true) {
                AppLifeCycle.prepareCurrentAppObject("URL", undefined, false, oApplicationContainer);
            }
            EventBus.getInstance().publish("sap.ushell", "appOpened", oResolvedHashFragment);

            return oResult?.body?.result;
        };

        this.statefulDestroyApp = async function (oApplicationContainer, sStorageKey) {
            const oAppTarget = oApplicationContainer.getCurrentAppTargetResolution();
            oApplicationContainer.setProperty("currentAppUrl", "", true);
            oApplicationContainer.setProperty("currentAppId", "", true);
            oApplicationContainer.setProperty("currentAppTargetResolution", undefined, true);
            Container.setAsyncDirtyStateProvider(undefined);

            await PostMessageUtils.postMessageToIframeApp(oApplicationContainer, "sap.ushell.services.appLifeCycle", "destroy", {
                sCacheId: sStorageKey
            }, true);

            EventBus.getInstance().publish("sap.ushell", "appClosed", oAppTarget);
        };

        this.statefulStoreKeepAliveApp = async function (oApplicationContainer, sStorageKey) {
            const oAppTarget = oApplicationContainer.getCurrentAppTargetResolution();

            oApplicationContainer.setProperty("currentAppUrl", "", true);
            oApplicationContainer.setProperty("currentAppId", "", true);
            oApplicationContainer.setProperty("currentAppTargetResolution", undefined, true);
            Container.setAsyncDirtyStateProvider(undefined);

            await PostMessageUtils.postMessageToIframeApp(oApplicationContainer, "sap.ushell.services.appLifeCycle", "store", {
                sCacheId: sStorageKey
            }, true);

            EventBus.getInstance().publish("sap.ushell", "appClosed", oAppTarget);
        };

        this.statefulRestoreKeepAliveApp = async function (oApplicationContainer, sUrl, sStorageKey, oResolvedHashFragment, bNavigationInSameStatefulContainer) {
            oApplicationContainer.setProperty("currentAppUrl", sUrl, true);
            oApplicationContainer.setProperty("currentAppId", sStorageKey, true);
            oApplicationContainer.setProperty("currentAppTargetResolution", oResolvedHashFragment, true);

            EventBus.getInstance().publish("launchpad", "appOpening", oResolvedHashFragment);

            await PostMessageUtils.postMessageToIframeApp(oApplicationContainer, "sap.ushell.services.appLifeCycle", "restore", {
                sCacheId: sStorageKey,
                sUrl: oResolvedHashFragment.url,
                sHash: hasher.getHash()
            }, true);

            if (bNavigationInSameStatefulContainer) {
                const AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");
                AppLifeCycle.prepareCurrentAppObject("URL", undefined, false, oApplicationContainer);
            }

            EventBus.getInstance().publish("sap.ushell", "appOpened", oResolvedHashFragment);
        };

        this.isCapabilitySupported = function (oApplicationContainer, sServiceName, sInterface) {
            if (!oApplicationContainer) {
                return false;
            }

            return oApplicationContainer.supportsBlueBoxCapabilities([
                { service: sServiceName, action: sInterface }
            ]);
        };

        this.isReusableContainer = function (oApplicationContainer) {
            if (!oApplicationContainer) {
                return false;
            }

            // todo: [FLPCOREANDUX-10024] when removing the keepAlive enum types this check should be adjusted
            return oApplicationContainer.getStatefulType() !== this.STATEFUL_TYPES.NOT_SUPPORTED;
        };

        this.isStatefulContainer = function (oApplicationContainer) {
            if (!oApplicationContainer) {
                return false;
            }

            return oApplicationContainer.supportsBlueBoxCapabilities([
                { service: "sap.ushell.services.AppLifeCycle", action: "create" },
                { service: "sap.ushell.services.appLifeCycle", action: "destroy" }
            ]);
        };

        this.isStatefulContainerSupportingKeepAlive = function (oApplicationContainer) {
            if (!oApplicationContainer) {
                return false;
            }

            return oApplicationContainer.supportsBlueBoxCapabilities([
                // stateful capabilities
                { service: "sap.ushell.services.AppLifeCycle", action: "create" },
                { service: "sap.ushell.services.appLifeCycle", action: "destroy" },
                // keep alive capabilities
                { service: "sap.ushell.services.appLifeCycle", action: "store" },
                { service: "sap.ushell.services.appLifeCycle", action: "restore" }
            ]);
        };

        this.isIframeIsValidSupported = function (oApplicationContainer) {
            return oApplicationContainer.supportsBlueBoxCapabilities([
                { service: "sap.ushell.services.appRuntime", action: "iframeIsValid" }
            ]);
        };

        this.isStatefulContainerInKeepAlivePool = function (oApplicationContainer) {
            // todo: [FLPCOREANDUX-10024] this is only a marker for the keepAlive application not for pool
            // maybe this references the scenario: stateful -> reuse for keepAlive
            return !!(oApplicationContainer && oApplicationContainer.getStatefulType() < this.STATEFUL_TYPES.NOT_SUPPORTED);
        };

        this.findFreeContainerForNewKeepAliveApp = function (oResolvedHashFragment) {
            if (!oResolvedHashFragment) {
                return;
            }
            // todo: [FLPCOREANDUX-10024] this check should come from capabilities
            if (!utils.isSAPLegacyApplicationType(oResolvedHashFragment.applicationType, oResolvedHashFragment.appCapabilities?.appFrameworkId)) {
                // do not handle appruntime
                return;
            }

            // first from KeepAlive pool
            let oFreeApplicationContainer = BlueBoxesCache.getFromPool(oResolvedHashFragment.url);
            if (!oFreeApplicationContainer) {
                // second from stateful container, but change it to keep alive
                oFreeApplicationContainer = BlueBoxesCache.get(oResolvedHashFragment.url, true);

                if (oFreeApplicationContainer && oFreeApplicationContainer.getStatefulType() > this.STATEFUL_TYPES.NOT_SUPPORTED) {
                    // only take stateful container and ignore the regular iframes
                    BlueBoxesCache.removeByContainer(oFreeApplicationContainer);

                    // contract v2 stateful container
                    if (oFreeApplicationContainer.getStatefulType() === this.STATEFUL_TYPES.FLP_V2) {
                        oFreeApplicationContainer.removeBlueBoxCapabilities(aBasicStatefulCapabilities);
                        oFreeApplicationContainer.setProperty("statefulType", this.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE, true);
                        // now the container is not stateful anymore based on its capabilities
                    } else {
                        // v1 stateful container
                        oFreeApplicationContainer.setProperty("statefulType", this.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE, true);
                    }
                }
            }

            if (oFreeApplicationContainer) {
                BlueBoxesCache.add(oResolvedHashFragment.url, oFreeApplicationContainer);
                oFreeApplicationContainer.setProperty("currentAppUrl", "", true);
                oFreeApplicationContainer.setProperty("isFetchedFromCache", true, true);
                oFreeApplicationContainer.setProperty("isKeepAlive", true, true);
            }

            return oFreeApplicationContainer;
        };

        this.returnUnusedKeepAliveContainer = function (oApplicationContainer) {
            if (!oApplicationContainer) {
                return;
            }

            // todo: [FLPCOREANDUX-10024] this check should come from capabilities
            if (this.isStatefulContainerSupportingKeepAlive(oApplicationContainer)) {
                // do not handle appruntime or iframes which are capable of keepAlive
                return;
            }

            // keep alive iframe
            if (oApplicationContainer.getStatefulType() < this.STATEFUL_TYPES.NOT_SUPPORTED) {
                const bWasMovedToPool = BlueBoxesCache.moveKeepAliveToPool(oApplicationContainer);

                if (!bWasMovedToPool) { // is now stateful container
                    oApplicationContainer.setProperty("isKeepAlive", false, true);

                    if (oApplicationContainer.getStatefulType() === this.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE) {
                        oApplicationContainer.addBlueBoxCapabilities(aBasicStatefulCapabilities);
                        oApplicationContainer.setProperty("statefulType", this.STATEFUL_TYPES.FLP_V2, true);

                    } else {
                        oApplicationContainer.setProperty("statefulType", this.STATEFUL_TYPES.GUI_V1, true);
                    }
                }
                oApplicationContainer.setProperty("currentAppUrl", "", true);
                oApplicationContainer.setProperty("isFetchedFromCache", false, true);
            }
        };

        this.getStatefulContainerType = function (sUrl, bIgnoreKeepAlive) {
            var oApplicationContainer = BlueBoxesCache.get(sUrl, bIgnoreKeepAlive);
            if (oApplicationContainer) {
                return oApplicationContainer.getStatefulType();
            }
            return this.STATEFUL_TYPES.NOT_SUPPORTED;
        };

        this.forEach = function (callback) {
            BlueBoxesCache.forEach(callback);
        };

        // todo: [FLPCOREANDUX-10024] the post messages below are async
        this.destroyApp = function (sAppId) {
            PostMessageUtils.postMessageToMultipleIframes("sap.ushell.services.appLifeCycle", "destroy", {
                appId: sAppId
            });
        };

        this.storeApp = function (sAppId) {
            PostMessageUtils.postMessageToMultipleIframes("sap.ushell.services.appLifeCycle", "store", {
                appId: sAppId,
                sHash: hasher.getHash()
            });
        };

        this.restoreApp = function (sAppId) {
            PostMessageUtils.postMessageToMultipleIframes("sap.ushell.services.appLifeCycle", "restore", {
                appId: sAppId,
                sHash: hasher.getHash()
            });
        };

        this._getStorageForDebug = function () {
            return {
                oBlueBoxesCache: BlueBoxesCache._getStorageForDebug()
            };
        };

        /**
         * For testing purposes only.
         * Destroys all the application containers.
         *
         * @since 1.130.0
         * @private
         */
        this._destroyAllApplicationContainer = function () {
            this.forEach((oApplicationContainer) => {
                this.deleteBlueBoxByContainer(oApplicationContainer);
                oApplicationContainer.destroy();
            });
        };
    }

    return new BlueBoxHandler();
}, /* bExport= */ true);

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @file This file contains miscellaneous utility functions for WebGui stateful container V1
 */
sap.ui.define([
    "sap/ushell/utils",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ushell/Container"
], function (
    ushellUtils,
    PostMessageUtils,
    Container
) {
    "use strict";

    var WebGUIStatefulHandler = {};

    WebGUIStatefulHandler.guiStatefulCreateApp = async function (oAppLifeCycle, oContainer, oTarget) {
        if (oContainer.setCurrentAppUrl) {
            oContainer.setProperty("currentAppUrl", oTarget.url, true);
        }
        if (oContainer.setCurrentAppTargetResolution) {
            oContainer.setProperty("currentAppTargetResolution", oTarget, true);
        }
        oContainer.setProperty("iframeReusedForApp", true, true);

        await PostMessageUtils.postMessageToIframeApp(oContainer, "sap.gui", "triggerCloseSessionImmediately", {}, true);

        await createGuiApp(oContainer, oTarget);

        // todo: [FLPCOREANDUX-10024] Move styles into control? or at least out of here
        if (oContainer.hasStyleClass("sapUShellApplicationContainerShiftedIframe")) {
            oContainer.toggleStyleClass("sapUShellApplicationContainerIframeHidden", false);
        } else {
            oContainer.toggleStyleClass("hidden", false);
        }
    };

    WebGUIStatefulHandler.guiStatefulCloseCurrentApp = async function (oContainer) {
        return PostMessageUtils.postMessageToIframeApp(oContainer, "sap.gui", "triggerCloseSession", {}, false);
    };

    async function createGuiApp (oContainer, oTarget) {
        let sUrl = oTarget.url;

        sUrl = await ushellUtils.appendSapShellParam(sUrl);
        sUrl = ushellUtils.filterOutParamsFromLegacyAppURL(sUrl);

        let oFLPParams;
        const oPostParams = {
            url: sUrl
        };
        if (oContainer.getIframeWithPost && oContainer.getIframeWithPost() === true) {
            var oAppStatesInfo = ushellUtils.getParamKeys(sUrl);

            if (oAppStatesInfo.aAppStateNamesArray.length > 0) {
                const Navigation = await Container.getServiceAsync("Navigation");
                try {
                    const aDataArray = await Navigation.getAppStateData(oAppStatesInfo.aAppStateKeysArray);
                    oFLPParams = {};
                    oAppStatesInfo.aAppStateNamesArray.forEach(function (item, index) {
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
            oFLPParams["system-alias"] = oContainer.getSystemAlias();
            oPostParams["sap-flp-params"] = oFLPParams;
        }

        return PostMessageUtils.postMessageToIframeApp(oContainer, "sap.its", "startService", oPostParams, true);
    }

    return WebGUIStatefulHandler;
}, /* bExport= */ false);

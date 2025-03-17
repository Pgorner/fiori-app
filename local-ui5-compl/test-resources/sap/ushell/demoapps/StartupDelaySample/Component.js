// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/base/Log",
    "sap/m/Text"
], function (UIComponent, Log, Text) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.StartupDelaySample.Component", {
        metadata: {
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        createContent: async function () {

            const iStartTime = performance.now();
            await (new Promise((resolve) => {
                let i = 0;
                const intervalHandle = setInterval(function () {
                    Log.info(`Interval ${i++} - ${performance.now()}`, null, "sap.ushell.demo.StartupDelaySample");
                    if (i >= 10) {
                        clearInterval(intervalHandle);
                        resolve();
                    }
                }, 0);
            }));
            const iEndTime = performance.now();

            return new Text({
                text: `If this app is started in the UI5 app runtime in a hidden iframe, calls of setTimeout and setInterval are throttled
                       within the iframe for certain browsers (currently Chrome and Edge) if the app runtime is served from a third-party domain.
                       Therefore, the iframe containing the appruntime has to be visible when an app is started within the appruntime to prevent a delay.

                       This app executes 10 intervals with a delay of 0ms. If this takes several seconds the iframe is throttled.

                       Executing 10 intervals took ${iEndTime - iStartTime}ms`
            });
        }

    });
});

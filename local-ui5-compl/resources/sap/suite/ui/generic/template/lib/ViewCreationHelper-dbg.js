sap.ui.define([
    "sap/suite/ui/generic/template/support/lib/CommonMethods"
], function(CommonMethods) {
    "use strict";

    // This class contain methods which plays role in view creation of Template Component.
    return {
        initializeViewCreation: function(oComponentRegistryEntry) {
            // Set the creation view started flag to false, to indicate that the view creation has not started yet.
            oComponentRegistryEntry.createViewStarted = false;

            // Create a promise for the view registration. This promise will be resolved when the view is registered.
            oComponentRegistryEntry.viewRegistered = new Promise(function(fnResolve, fnReject) {
                // Note: oError is faulty in regular situations
                oComponentRegistryEntry.fnViewRegisteredResolve = function(oError){
                    if (oError){
                        oComponentRegistryEntry.fnViewRegisteredResolve = Function.prototype;
                        fnReject(oError);
                    } else {
                        delete oComponentRegistryEntry.fnViewRegisteredResolve;
                        fnResolve();
                    }
                };
            });

            // Create a promise for the view rendering. This promise will be resolved when the view is rendered.
            oComponentRegistryEntry.oViewRenderedPromise = new Promise(function(fnResolve) {
                oComponentRegistryEntry.fnViewRenderdResolve = fnResolve;
                // Application status needs to be handled here to support use cases where Diagnostics Tool gets loaded after the app itself.
                CommonMethods.setApplicationStatus(CommonMethods.mApplicationStatus.RENDERED);
                // When view rendering has finished, publish global event "GetData" at channel "elements".
                CommonMethods.publishEvent("elements", "ViewRendered", {});
            });

            // Returns view registered promise as the view creation is completed and process can continue.
            return oComponentRegistryEntry.viewRegistered;
        }
    };
});
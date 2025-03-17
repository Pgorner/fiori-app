// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    ObjectPath,
    MessageToast,
    Controller,
    JSONModel,
    Container
) {
    "use strict";

    var oApplications = null;

    return Controller.extend("sap.ushell.demo.FioriSandboxDefaultApp.App", {
        onInit: function () {
            var oView = this.getView();

            Container.getServiceAsync("CrossApplicationNavigation").then(function (crossAppNavService) {
                var aApps = [];
                var href;

                oApplications = ObjectPath.get("sap-ushell-config.services.NavTargetResolutionInternal.adapter.config.applications");

                for (var sAppName in oApplications) {
                    if (oApplications.hasOwnProperty(sAppName) && sAppName != "" && sAppName != "_comment") {
                        // use cross-application navigation service to construct link targets with proper encoding
                        href = crossAppNavService.hrefForExternal({ target: { shellHash: sAppName } });

                        aApps.push({
                            href: href,
                            appDescription: oApplications[sAppName].description || sAppName
                        });
                    }
                }
                var oModel = new JSONModel({ apps: aApps });
                oView.setModel(oModel);
            });
        },

        onSelectFromList: function () {
            var oButton = this.getView().byId("configAsLocal1");
            oButton.setEnabled(true);
        },

        onConfigureAsAppLocal1: function (oEvent) {
            // Determine selected app.
            var oList = this.getView().byId("applist");
            var oListItem = oList.getSelectedItem();
            var aListItemContents = oListItem.getContent();
            var oLink = aListItemContents[0];
            var sHref = oLink.getHref();
            var sAppName = sHref.substring(1); // sHref.split("#")[1];
            var oApp = oApplications[sAppName];

            var sAppConfigO = JSON.stringify(oApp);

            var oAppClone = JSON.parse(sAppConfigO);

            // patch for relative sample applications:
            var sRelStart = "../../../../../test-resources/sap/ushell/demoapps";
            var iLen = sRelStart.length;
            if (oAppClone.url.length > iLen && oAppClone.url.substr(0, iLen) === sRelStart) {
                oAppClone.url = "/ushell/test-resources/sap/ushell/demoapps" + oAppClone.url.substr(iLen);
            }
            var sAppConfig = JSON.stringify(oAppClone);

            // Store details of selected app for hash "#Test-local1".
            window.localStorage["sap.ushell.#Test-local1"] = sAppConfig;

            MessageToast.show("App " + sAppName + " is now available as #Test-local1 in the Fiori Launchpad.");
        }
    });
});

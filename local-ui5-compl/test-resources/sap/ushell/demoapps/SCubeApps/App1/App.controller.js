// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/Container"
], function (Controller, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.SCubeApps.App1.App", {
        onCrossNavigate1: function () {
            var oView = this.getView();

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal({
                    target: {
                        semanticObject: oView.byId("txtSemantic").getValue(),
                        action: oView.byId("txtAction").getValue()
                    },
                    params: {
                    }
                });
            });
        },
        onCrossNavigate2: function () {
            var oView = this.getView();

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal({
                    target: {
                        shellHash: oView.byId("txtFullHash").getValue()
                    }
                });
            });
        }
    });
});

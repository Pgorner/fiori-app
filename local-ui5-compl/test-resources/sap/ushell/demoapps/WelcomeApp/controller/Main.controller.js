// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/Container"
], function (Controller, oAppConfiguration, Container) {
    "use strict";
    return Controller.extend("sap.ushell.demoapps.WelcomeApp.controller.Main", {
        onInit: function () {
            oAppConfiguration.setApplicationFullWidthInternal(true);
        },

        onHomePress: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal({ target: { shellHash: "#" } });
            });
        },
        onFinderPress: function () {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal({ target: { shellHash: "#Shell-appfinder" } });
            });
        },

        onInputSubmit: function (oEvt) {
        },
        onSpacePress: function (oEvt) {
            var oIntent = oEvt.getSource().getCustomData()[0].getValue();
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                var oParams = {};
                oIntent.parameters.forEach(function (oParameter) {
                    if (oParameter.name && oParameter.value) {
                        oParams[oParameter.name] = [oParameter.value];
                    }
                });

                oCANService.toExternal({
                    target: {
                        semanticObject: oIntent.semanticObject,
                        action: oIntent.action
                    },
                    params: oParams
                });
            });
        },

        onItemPress: function (oEvt) {
            var sIntent = oEvt.getSource().getCustomData()[0].getValue();

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal({ target: { shellHash: sIntent } });
            });
        },

        onSuggestionSelect: function (oEvt) {
            var sIntent = oEvt.getParameter("selectedItem").getKey();

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal({ target: { shellHash: sIntent } });
            });
        }
    });
});

// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/Container"
], function (Controller, Container) {
    "use strict";

    var oMessageBrokerService;

    return Controller.extend("sap.ushell.demo.MessageBrokerSample.App", {
        onInit: function () {
            Container.getServiceAsync("MessageBroker").then(function (oService) {
                oMessageBrokerService = oService;
                oMessageBrokerService.addAcceptedOrigin(window.location.origin);
            });
        }
    });
});

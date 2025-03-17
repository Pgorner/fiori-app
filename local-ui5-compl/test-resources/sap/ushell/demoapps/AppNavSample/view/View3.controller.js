// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ui/core/mvc/Controller"
], function (EventBus, Controller) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppNavSample.view.View3", {
        oApplication: null,

        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberof view.Detail
        */
        onInit: function () {
            this.generateLinks();
        },

        handleRefresh: function () {
            EventBus.getInstance().publish("sap.ui.core.UnrecoverableClientStateCorruption", "RequestReload", {});
        },
        generateLinks: function () {
            this.getOwnerComponent().getRootControl().getController().generateLinks();
        }
    });
});


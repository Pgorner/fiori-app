// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Component",
    "sap/base/Log"
], function (Controller, Component, Log) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppNavSample.view.UserDefaultView", {
        oApplication: null,

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberof view.Detail
         */
        onExit: function () {
            Log.info("sap.ushell.demo.AppNavSample: onExit of UserDefaultView");
        }
    });
});

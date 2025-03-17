// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/demo/AppShellUIRouter/controller/BaseController",
    "sap/base/Log",
    "sap/ui/core/Item",
    "sap/ui/core/routing/History",
    "sap/ui/core/routing/HashChanger"
], function (
    BaseController,
    Log,
    Item,
    History,
    HashChanger
) {
    "use strict";

    return BaseController.extend("sap.ushell.demo.AppShellUIRouter.controller.App", {
        onInit: function () {
            // This is ONLY for being used within the tutorial.
            // The default log level of the current running environment may be higher than INFO,
            // in order to see the debug info in the console, the log level needs to be explicitly
            // set to INFO here.
            // But for application development, the log level doesn't need to be set again in the code.
            Log.setLevel(Log.Level.INFO);
        }
    });
});

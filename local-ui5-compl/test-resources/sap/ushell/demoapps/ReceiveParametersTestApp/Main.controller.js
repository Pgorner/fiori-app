// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/Log"
], function (
    Controller,
    Log
) {
    "use strict";

    return Controller.extend("sap.ushell.demoapps.ReceiveParametersTestApp.Main", {

        onInit: function () { },

        navigate: function (/*sEvent, sNavTarget*/) { },

        isLegalViewName: function (sViewNameUnderTest) {
            return (typeof sViewNameUnderTest === "string") && (["Detail", "View1", "View2", "View3", "View4"].indexOf(sViewNameUnderTest) >= 0);
        },

        doNavigate: function (/*sEvent, sNavTarget*/) { },

        onExit: function () {
            Log.info("sap.ushell.demoapps.ReceiveParametersTestApp: On Exit of Main.XML.controller called : this.getView().getId():" + this.getView().getId());
            this.mViewNamesToViews = {};
            if (this.oInnerAppRouter) {
                this.oInnerAppRouter.destroy();
            }
        }
    });
});

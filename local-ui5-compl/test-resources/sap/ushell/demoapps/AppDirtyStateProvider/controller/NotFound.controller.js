// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/demo/AppDirtyStateProvider/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.ushell.demo.AppDirtyStateProvider.controller.NotFound", {
        onInit: function () {
            var oRouter = this.getRouter();
            var oTarget = oRouter.getTarget("notFound");

            oTarget.attachDisplay(function (oEvent) {
                this._oData = oEvent.getParameter("data");
            }, this);
        },

        onNavBack: function (oEvent) {
            // When the back button is pressed we display the target which was shown before
            if (this._oData && this._oData.fromTarget) {
                this.getRouter().getTargets().display(this._oData.fromTarget);
                delete this._oData.fromTarget;
                return;
            }
            BaseController.prototype.onNavBack.apply(this, arguments);
        }
    });
});

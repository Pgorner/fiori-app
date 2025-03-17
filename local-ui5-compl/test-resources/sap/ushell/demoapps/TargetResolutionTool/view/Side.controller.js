// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function (Component, oMessageToast, oController) {
    "use strict";

    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.Side", {
        onInit: function () { },
        onItemPressed: function (oEvent) {
            var sSelectedItemTitle = oEvent.getSource().getTitle();
            if (sSelectedItemTitle === "Intent Resolution") {
                this.oApplication.navigate("toView", "IntentResolution");
                return;
            }
            if (sSelectedItemTitle === "Settings") {
                this.oApplication.navigate("toView", "Settings");
                return;
            }
            if (sSelectedItemTitle === "Inbounds Browser") {
                this.oApplication.navigate("toView", "InboundsBrowser");
                return;
            }
            if (sSelectedItemTitle === "Get Easy Access Systems") {
                this.oApplication.navigate("toView", "GetEasyAccessSystems");
                return;
            }

            oMessageToast.show("Invalid Selection");
        },
        getMyComponent: function () {
            var sComponentId = Component.getOwnerIdFor(this.getView());
            return Component.getComponentById(sComponentId);
        },
        onExit: function () {
            // dialogs and popovers are not part of the UI composition tree and must
            // therefore be
            // destroyed explicitly in the exit handler
            if (this.oDialog) {
                this.oDialog.destroy();
            }
            if (this.oPopover) {
                this.oPopover.destroy();
            }
            if (this.oActionSheet) {
                this.oActionSheet.destroy();
            }
            if (this.oActionsButton) {
                this.oActionsButton.destroy();
            }
        }
    });
});

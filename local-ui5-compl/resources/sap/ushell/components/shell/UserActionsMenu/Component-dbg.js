// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/EventBus",
    "sap/ui/core/UIComponent",
    "sap/ushell/components/shell/UserActionsMenu/UserActionsMenu.controller"
], function (
    EventBus,
    UIComponent,
    UserActionsMenuController
) {
    "use strict";

    // UserActionsMenu Component
    return UIComponent.extend("sap.ushell.components.shell.UserActionsMenu.Component", {

        metadata: {
            version: "1.132.1",
            library: "sap.ushell",
            dependencies: {
                libs: ["sap.m"]
            }
        },

        createContent: function () {
            this._bIsUserActionsMenuCreated = false;

            this.oUserActionsMenuController = new UserActionsMenuController();
            this.oUserActionsMenuController.onInit();

            EventBus.getInstance().publish("shell", "userActionsMenuCompLoaded", { delay: 0 });
        },

        exit: function () {
            this.oUserActionsMenuController.onExit();
        }
    });

});

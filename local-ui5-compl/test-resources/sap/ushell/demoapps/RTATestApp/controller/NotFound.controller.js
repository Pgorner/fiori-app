// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.ushell.demo.worklist.controller.NotFound", {
        /**
         * Navigates to the worklist when the link is pressed
         * @public
         */
        onLinkPressed: function () {
            this.getRouter().navTo("worklist");
        }
    });
});

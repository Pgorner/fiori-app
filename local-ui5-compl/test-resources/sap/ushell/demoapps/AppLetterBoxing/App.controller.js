// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/services/AppConfiguration"
], function (Controller, AppConfiguration) {
    "use strict";

    return Controller.extend("sap.ushell.demo.letterBoxing.App", {

        onInit: function () {
            this.fullWidth = this.getOwnerComponent().getManifestEntry("/sap.ui/fullWidth");
        },

        onChangeLetterBoxing: function () {
            AppConfiguration.setApplicationFullWidthInternal(!this.fullWidth);
            this.fullWidth = !this.fullWidth;
        }
    });
});

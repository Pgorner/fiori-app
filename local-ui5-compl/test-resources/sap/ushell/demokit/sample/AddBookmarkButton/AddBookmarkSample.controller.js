// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (
    Controller,
    MessageToast
) {
    "use strict";

    return Controller.extend("sap.ushell.sample.AddBookmarkButton.AddBookmarkSample", {
        onSaveAsTileOpen: function () {
            MessageToast.show("SaveAsTile Dialog was opened", { duration: 3000 });
        },
        onSaveAsTileClose: function () {
            MessageToast.show("SaveAsTile Dialog was closed", { duration: 3000 });
        }
    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("sap.apf.cloudFoundry.ui.utils.controller.Test", {
        onInit: function() {
            this.getView().setModel(new JSONModel(), "setByController");
            if (this.getView().getViewData().bDestroyYourself) {
                this.getView().destroy();
                this.destroy();
            }
        }
    });
});

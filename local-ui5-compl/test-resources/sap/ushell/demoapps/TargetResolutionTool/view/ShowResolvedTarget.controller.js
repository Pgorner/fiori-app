// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (oController) {
    "use strict";

    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.ShowResolvedTarget", {
        onInit: function () {
            this.oInboundModel = this.getView().getViewData();
            this.getView().setModel(this.oInboundModel);
            this.oInboundModel.bindTree("/").attachChange(this._onModelChanged);
        },
        onBackClicked: function () {
            this.oApplication.navigate("toView", "IntentResolution");
        },
        _onModelChanged: function () { }
    });
});

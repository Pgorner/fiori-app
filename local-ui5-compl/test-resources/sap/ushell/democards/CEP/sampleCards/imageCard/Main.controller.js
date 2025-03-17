// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ushell/Container"
], function (DateFormat, Controller, JSONModel, ResourceModel, Container) {
    "use strict";

    return Controller.extend("sap.ushell.samplecards.imageCard.Main", {
        onInit: function () {
            var oView = this.getView();
            var oModel = new JSONModel();
            var i18nModel = new ResourceModel({
                bundleName: "sap.ushell.samplecards.imageCard.i18n.i18n"
            });

            oView.byId("img").setSrc(sap.ui.require.toUrl("sap/ushell/samplecards/imageCard/Image2.png"));
            oView.setModel(oModel);
            oView.setModel(i18nModel, "i18n");

            Container.getServiceAsync("UserInfo").then(function (UserInfo) {
                var sFirstName = UserInfo.getFirstName();

                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "EEE, MMM d"
                });

                oModel.setData({
                    firstName: sFirstName,
                    date: oDateFormat.format(new Date())
                });

            });

        }

    });

});

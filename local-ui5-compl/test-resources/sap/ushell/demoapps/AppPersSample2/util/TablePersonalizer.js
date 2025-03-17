// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([],
    function () {
        "use strict";
        /**
         * Glues the table and the button to the respective table personalization control
         * and attaches that one to the personalization storage.
         *
         * @param {sap.m.Table} oTableControl Table to attach the TablePersoController to.
         * @param {sap.m.Button} oStartPersonalizationButton Attach the press event to open the personalization dialog to this button.
         * @param {object} oPersId Personalization Id.
         * @param {object} oScope Personalization scope.
         * @param {sap.ushell.demo.AppPersSample2.Component} oComponent Component of this app.
         * @param {sap.ushell.services.Personalization} oService Service to be used for personalization.
         */
        return function (oTableControl, oStartPersonalizationButton, oPersId, oScope, oComponent, oService) {
            var oPersonalizer;
            var oTablePersoController;

            oPersonalizer = oService.getPersonalizer(oPersId, oScope, oComponent);
            sap.ui.require(["sap/m/TablePersoController"], function (TablePersoController) {
                oTablePersoController = new TablePersoController({
                    table: oTableControl,
                    persoService: oPersonalizer
                });
                oTablePersoController.activate();
                oStartPersonalizationButton.attachPress(function () {
                    oTablePersoController.openDialog();
                });
            });
        };
    });

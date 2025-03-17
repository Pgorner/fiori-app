// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Component",
    "./util/TablePersonalizer",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (Controller, Component, TablePersonalizer, JSONModel, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppPersSample2.App", {
        onInit: function () {

            var oDummyData,
                oPersId,
                oConstants,
                oScope,
                oComponent,
                oMobileTable,
                oStartPersButton,
                oTablePersonalizer;

            // Dummy model with test data
            oDummyData = {
                rows: [{
                    cell1: "Cell 1",
                    cell2: "Cell 2",
                    cell3: "Cell 3"
                }, {
                    cell1: "Cell 4",
                    cell2: "Cell 5",
                    cell3: "Cell 6"
                }, {
                    cell1: "Cell 7",
                    cell2: "Cell 8",
                    cell3: "Cell 9"
                }]
            };
            oPersId = {
                container: "sap.ushell.demo.AppPersSample2",
                item: "mobiletable"
            };
            this.getView().setModel(new JSONModel(oDummyData));
            // Apply existing personalization for mobile table.
            oMobileTable = this.getView().byId("SampleTableMobile");
            oStartPersButton = this.getView().byId("personalize");

            Container.getServiceAsync("Personalization").then(function (oService) {
                oConstants = oService.constants;
                oScope = {
                    validity: 2,
                    // Store the data for 2 minutes. In real table personalization
                    // scenarios a validity Infinity may be more appropriate.
                    keyCategory: oConstants.keyCategory.FIXED_KEY, // See oPersId.container.
                    writeFrequency: oConstants.writeFrequency.LOW,
                    // We expect that the user changes his table settings rarely
                    clientStorageAllowed: true
                    // This table personalization data does not contain any sensitive data
                };
                oComponent = Component.getOwnerComponentFor(this.getView());
                oTablePersonalizer = new TablePersonalizer(oMobileTable,
                    oStartPersButton, oPersId, oScope, oComponent, oService);
                return oTablePersonalizer;
            }.bind(this));
        }
    });
});

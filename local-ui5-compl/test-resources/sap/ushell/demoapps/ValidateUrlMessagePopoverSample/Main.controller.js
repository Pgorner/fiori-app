// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem"
], function (
    Controller,
    JSONModel,
    MessagePopover,
    MessagePopoverItem
) {
    "use strict";

    var oMessageTemplate = new MessagePopoverItem({
        type: "{type}",
        title: "{title}",
        description: "{description}",
        markupDescription: "{markupDescription}"
    });

    var oMessagePopover1 = new MessagePopover({
        items: {
            path: "/",
            template: oMessageTemplate
        }
    });

    var oMessagePopover2 = new MessagePopover({
        items: {
            path: "/",
            template: oMessageTemplate
        }
    });

    var oMessagePopover3 = new MessagePopover({
        items: {
            path: "/",
            template: oMessageTemplate
        },
        initiallyExpanded: false
    });

    return Controller.extend("sap.ushell.demo.ValidateUrlMessagePopoverSample.Main", {
        onInit: function () {
            var aMockMessages = [{
                type: "Information",
                title: "Visiting an external web site",
                description: "You can find cool search results at <a href='http://www.google.de'>Google</a>.",
                markupDescription: true
            }, {
                type: "Error",
                title: "Reading books is not yet introduced",
                description: "You are not allowed to read interesting books at <a href='#Buecher-lesen'>#Buecher-lesen</a>.",
                markupDescription: true
            }, {
                type: "Information",
                title: "Going to another SAP application",
                description: "Let's navigate to another sample application: <a href='#Action-toappstatesample'>Appstate Sample Application</a>.",
                markupDescription: true
            }];

            var oModel = new JSONModel();
            oModel.setData(aMockMessages);

            var viewModel = new JSONModel();
            viewModel.setData({
                messagesLength: aMockMessages.length + ""
            });

            this.getView().setModel(viewModel);

            oMessagePopover1.setModel(oModel);
            oMessagePopover2.setModel(oModel);
            oMessagePopover3.setModel(oModel);
        },

        handleMessagePopoverPress1: function (oEvent) {
            oMessagePopover1.openBy(oEvent.getSource());
        },

        handleMessagePopoverPress2: function (oEvent) {
            oMessagePopover2.openBy(oEvent.getSource());
        },

        handleMessagePopoverPress3: function (oEvent) {
            oMessagePopover3.openBy(oEvent.getSource());
        }
    });
});

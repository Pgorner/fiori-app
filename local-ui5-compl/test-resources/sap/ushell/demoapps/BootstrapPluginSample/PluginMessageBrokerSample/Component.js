// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Text",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (Component, ComponentContainer, Dialog, Button, mobileLibrary, Text, jQuery, Container) {
    "use strict";

    var oRenderer = Container.getRendererInternal("fiori2"),
        ID_DIALOG = "idMessageBrokerPluginPopup",
        oDraggableDialog,
        oText;

    return Component.extend("sap.ushell.demo.BootstrapPluginSample.PluginMessageBrokerSample.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.BootstrapPluginSample.PluginMessageBrokerSample"
        },

        init: function () {
            var that = this;

            that.createLogScreen();
            oRenderer.addHeaderEndItem(
                "sap.ushell.ui.shell.ShellHeadItem", {
                    icon: "sap-icon://flight",
                    id: "idMessageBrokerPluginIcon",
                    press: function () {
                        oDraggableDialog.$().toggleClass("hidden");
                    }
                },
                true,
                false);
        },

        createLogScreen: function () {
            if (!oDraggableDialog) {
                oText = new Text();
                oDraggableDialog = new Dialog({
                    id: ID_DIALOG,
                    title: "Message Broker Shell Plugin",
                    contentWidth: "100%",
                    contentHeight: "100%",
                    draggable: true,
                    resizable: true,
                    content: oText,
                    endButton: new Button({
                        text: "Close",
                        press: function () {
                            oDraggableDialog.$().toggleClass("hidden");
                        }.bind(this)
                    })
                });

                oDraggableDialog.onAfterRendering = function () {
                    Dialog.prototype.onAfterRendering();
                    jQuery("<iframe src='../../demoapps/MessageBrokerSample/brokerClient.html?type=plugin' style='width:100%;height:100%'></iframe>").appendTo(oText.$().parent());
                    oText.$().remove();
                    oText = undefined;
                };
                oDraggableDialog.oPopup.setModal(false);
                oDraggableDialog.open();
                oDraggableDialog.$().toggleClass("hidden");
            }
        },

        exit: function () { }
    });
});

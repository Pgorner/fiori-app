// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// Create logon dialog with iFrame window as contents for SAML2 scenarios
sap.ui.define([
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/ui/core/Element",
    "sap/ui/core/HTML",
    "sap/ushell/ui/footerbar/ContactSupportButton",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (
    Button,
    Dialog,
    Element,
    HTML,
    ContactSupportButton,
    Config,
    resources,
    Container
) {
    "use strict";
    function createIFrameDialog () {
        // A new dialog wrapper with a new inner iframe will be created each time.
        destroyIFrameDialog();

        // create new iframe and add it to the Dialog HTML control
        var oDialog = new Dialog({
            id: "SAMLDialog",
            title: resources.i18n.getText("samlDialogTitle"),
            contentWidth: "50%",
            contentHeight: "50%",
            content: new HTML("SAMLDialogFrame", {content: "<iframe id=SAMLDialogFrame src=\"\"></iframe>"}),
            endButton: new Button({
                    text: resources.i18n.getText("samlCloseBtn"),
                    press: Container.cancelLogon.bind(Container) // Note: it calls back destroyIFrameDialog()
                })
        }).addStyleClass("sapUshellIframeDialog sapContrastPlus sapUshellSamlDialogHidden");

        if (Config.last("/core/extension/SupportTicket")) { // Contact Support button
            var oContactSupportBtn = new ContactSupportButton();
            oContactSupportBtn.setWidth("150px");
            oContactSupportBtn.setIcon("");
            oDialog.setBeginButton(oContactSupportBtn);
        }
        oDialog.open();

        // Make sure to manipulate css properties after the dialog is rendered.
        toggleBlockLayerCSS(true);

        return document.getElementById("SAMLDialogFrame"); // returns the iframe element so that the logonManager can set src
    }

    function toggleBlockLayerCSS (bHidden) {
        var oBlockLayer = document.getElementById("sap-ui-blocklayer-popup");
        if (oBlockLayer) {
            if (bHidden) {
                oBlockLayer.classList.add("sapUshellSamlDialogHidden");
            } else {
                oBlockLayer.classList.remove("sapUshellSamlDialogHidden");
            }
        }
    }

    function destroyIFrameDialog () {
        var oDialog = Element.getElementById("SAMLDialog");
        if (oDialog) {
            oDialog.destroy();
        }
    }

    function showIFrameDialog () {
        // remove css class of dialog
        var oDialog = Element.getElementById("SAMLDialog");
        if (oDialog) {
            oDialog.removeStyleClass("sapUshellSamlDialogHidden");
            toggleBlockLayerCSS(true);
        }
    }

    const LogonFrameProvider = {
        create: createIFrameDialog,
        show: showIFrameDialog,
        destroy: destroyIFrameDialog
    };

    return LogonFrameProvider;

});

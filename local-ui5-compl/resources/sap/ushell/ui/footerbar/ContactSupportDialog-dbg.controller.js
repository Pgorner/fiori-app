// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/UserActivityLog",
    "sap/ushell/resources",
    "sap/ushell/Container",
    "sap/ushell/state/StateManager"
], function (
    Controller,
    Fragment,
    JSONModel,
    UserActivityLog,
    resources,
    Container,
    StateManager
) {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    const _sFragmentId = "contactSupportDialogFragment";

    return Controller.extend("sap.ushell.ui.footerbar.ContactSupportDialog.controller", {

        onBeforeOpen: function () {
            this._setupModel();
        },

        onAfterClose: function () {
            this._getDialog().destroy();
            const oFocusedElement = window.document.activeElement;
            const oUserMenuButton = window.document.getElementById("userActionsMenuHeaderButton");
            if (oFocusedElement && oFocusedElement.tagName === "BODY" && oUserMenuButton) {
                oUserMenuButton.focus();
            }
            delete this.oSupportDialog;
        },

        _getDialog: function () {
            if (!this.oSupportDialog) {
                this.oSupportDialog = Fragment.byId(_sFragmentId, "ContactSupportDialog");
            }
            return this.oSupportDialog;
        },

        _setupModel: function () {
            const oClientContext = UserActivityLog.getMessageInfo();
            const oUserDetails = oClientContext.userDetails;
            const oModelData = {
                showTechInfo: false,
                showAppData: StateManager.getLaunchpadState() === LaunchpadState.App,
                subject: "",
                description: "",
                userName: oUserDetails.fullName || "",
                host: window.location.host,
                email: oUserDetails.eMail || "",
                language: oUserDetails.Language || "",
                navigationHash: oClientContext.navigationData.navigationHash || "",
                applicationType: "",
                url: "",
                additionalInformation: ""
            };

            if (oClientContext.navigationData.applicationInformation) {
                oModelData.applicationType = oClientContext.navigationData.applicationInformation.applicationType;
                oModelData.url = oClientContext.navigationData.applicationInformation.url;
                oModelData.additionalInformation = oClientContext.navigationData.applicationInformation.additionalInformation;
            }

            const oSupportDialog = this._getDialog();
            const oModel = new JSONModel(oModelData);
            oSupportDialog.setModel(resources.getTranslationModel(), "i18n");
            oSupportDialog.setModel(oModel);
            this.oClientContext = oClientContext;
        },

        showTechnicalData: function () {
            this._getDialog().getModel().setProperty("/showTechInfo", true); // Hide the link and show technical info fields.
            Fragment.byId(_sFragmentId, "subjectInput").focus(); // As the link disappears, set focus on the first interactive element.
        },

        _checkErrorState: function (oInputControl) {
            if (!oInputControl.getValue()) {
                oInputControl.setValueState("Error");
            } else {
                oInputControl.setValueState("None");
            }
        },

        onInputChange: function (oEvent) {
            this._checkErrorState(oEvent.getSource());
        },

        closeDialog: function () {
            this._getDialog().close();
        },

        onSend: async function () {
            const oSubjectInput = Fragment.byId(_sFragmentId, "subjectInput");
            const oTextArea = Fragment.byId(_sFragmentId, "textArea");
            const sSubject = oSubjectInput.getValue();
            const sText = oTextArea.getValue();

            this._checkErrorState(oSubjectInput);
            this._checkErrorState(oTextArea);

            if (sSubject && sText) {
                const oSupportTicketService = await Container.getServiceAsync("SupportTicket");
                const oMessageService = await Container.getServiceAsync("MessageInternal");
                try {
                    await oSupportTicketService.createTicket({ subject: sSubject, text: sText, clientContext: this.oClientContext });
                    oMessageService.info(resources.i18n.getText("supportTicketCreationSuccess"));
                } catch (error) {
                    oMessageService.error(resources.i18n.getText("supportTicketCreationFailed"));
                }
                this.closeDialog();
            }
        }
    });
});

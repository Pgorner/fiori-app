// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.ContactSupportButton
 */
sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ushell/ui/footerbar/ContactSupportButton",
    "sap/ushell/UserActivityLog",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (Fragment, ContactSupportButton, UserActivityLog, Resources, Container) {
    "use strict";

    /* global QUnit, sinon */

    function _getControl (sId) {
        return Fragment.byId("contactSupportDialogFragment", sId);
    }

    function _getDomId (sId) {
        const oControl = _getControl(sId);
        return oControl ? oControl.getId() : "";
    }

    QUnit.module("sap.ushell.ui.footerbar.ContactSupportButton", {
        beforeEach: async function () {
            // configure the user of the container adapter
            window["sap-ushell-config"] = {
                services: {
                    Container: {
                        adapter: {
                            config: {
                                id: "DEMO_USER",
                                firstName: "Demo",
                                lastName: "User",
                                fullName: "Demo User",
                                email: "demo.user@sap.com",
                                accessibility: false,
                                theme: "theme1",
                                bootTheme: {
                                    theme: "sap_fiori_3",
                                    root: ""
                                },
                                language: "EN",
                                setAccessibilityPermitted: true,
                                setThemePermitted: true,
                                userProfile: [{ id: "THEME", value: "sap_fiori_3" }]
                            }
                        }
                    }
                }
            };
            await Container.init("local");
        }
    });

    QUnit.test("Constructor Test", function (assert) {
        var ContactSupportDialog = new ContactSupportButton();
        assert.ok(ContactSupportDialog.getIcon() === "sap-icon://email", "Check dialog icon");
        assert.ok(ContactSupportDialog.getText("text") === Resources.i18n.getText("contactSupportBtn"), "Check dialog title");
    });

    QUnit.test("showContactSupportDialog Test", async function (assert) {
        const contactSupportDialog = new ContactSupportButton();
        //Show the dialog
        await contactSupportDialog.showContactSupportDialog();

        // Get the contact support dialog content form
        const dialogForm = _getControl("ContactSupportDialog"),
            dialogFormContent = dialogForm.getContent(),
            translationBundle = Resources.i18n;

        // check buttons
        assert.ok(dialogForm.getBeginButton().getId() === _getDomId("contactSupportSendBtn"), "Check send button");
        assert.ok(dialogForm.getEndButton().getId() === _getDomId("contactSupportCancelBtn"), "Check cancel button");

        // check content
        assert.ok(dialogFormContent[0].getMetadata().getName() === "sap.ui.layout.form.SimpleForm", "Check top simple form");
        assert.ok(dialogFormContent[0].getId() === _getDomId("topForm"), "Check top simple form id");
        assert.ok(dialogFormContent[0].getEditable() === false, "Check top simple form is editable");
        // check top content
        const simpleFormTopContent = dialogFormContent[0].getContent();
        assert.ok(simpleFormTopContent !== undefined, "Check top simple form content");

        assert.ok(simpleFormTopContent[0].getMetadata().getName() === "sap.m.Label", "Check top simple form content - SubjectLabel");
        assert.ok(simpleFormTopContent[0].getId() === _getDomId("subjectLabel"), "Check top simple form content - SubjectLabel id");
        assert.ok(simpleFormTopContent[0].getText() === translationBundle.getText("subjectLabel"), "Check top simple form content - SubjectLabel text");
        assert.ok(simpleFormTopContent[0].getRequired() === true, "Check top simple form content - SubjectLabel required");

        assert.ok(simpleFormTopContent[1].getMetadata().getName() === "sap.m.Input", "Check top simple form content - SubjectInput");
        assert.ok(simpleFormTopContent[1].getId() === _getDomId("subjectInput"), "Check top simple form content - SubjectInput id");
        assert.ok(simpleFormTopContent[1].getPlaceholder() === translationBundle.getText("subjectPlaceHolderHeader"), "Check top simple form content - Subject Input placeholder");

        assert.ok(simpleFormTopContent[2].getMetadata().getName() === "sap.m.Label", "Check top simple form content - TextAreaLabel");
        assert.ok(simpleFormTopContent[2].getId() === _getDomId("textAreaLabel"), "Check top simple form content - TextAreaLabel id");
        assert.ok(simpleFormTopContent[2].getText() === translationBundle.getText("txtAreaLabel"), "Check top simple form content - TextAreaLabel text");
        assert.ok(simpleFormTopContent[2].getRequired() === true, "Check top simple form content - TextAreaLabel required");

        assert.ok(simpleFormTopContent[3].getMetadata().getName() === "sap.m.TextArea", "Check top simple form content - TextArea");
        assert.ok(simpleFormTopContent[3].getId() === _getDomId("textArea"), "Check top simple form content - TextArea id");
        assert.ok(simpleFormTopContent[3].getPlaceholder() === translationBundle.getText("txtAreaPlaceHolderHeader"), "Check top simple form content - TextArea placeholder");

        assert.ok(dialogFormContent[1].getMetadata().getName() === "sap.ui.layout.form.SimpleForm", "Check bottom simple form");
        assert.ok(dialogFormContent[1].getId() === _getDomId("bottomForm"), "Check bottom simple form id");
        assert.ok(dialogFormContent[1].getEditable() === false, "Check bottom simple form is editable");
        // check bottom content
        const simpleFormBottomContent = dialogFormContent[1].getContent();
        assert.ok(simpleFormBottomContent !== undefined, "Check bottom simple form content");
        assert.ok(simpleFormBottomContent[0].getMetadata().getName() === "sap.m.Link", "Check bottom simple form content - link");
        assert.ok(simpleFormBottomContent[0].getText() === translationBundle.getText("technicalDataLink"), "Check bottom simple form content - link text");

        dialogForm.destroy();
    });

    QUnit.test("check bottom form content", async function (assert) {
        const contactSupportDialog = new ContactSupportButton(),
            translationBundle = Resources.i18n;

        //Show the dialog
        await contactSupportDialog.showContactSupportDialog();
        const oDialog = _getControl("ContactSupportDialog");

        // click on the link to open bottom form
        _getControl("technicalDataLink").firePress();
        await Promise.resolve();

        const dialogFormContent = oDialog.getContent();
        const oClientContext = UserActivityLog.getMessageInfo();

        // get bottom content
        assert.ok(dialogFormContent[2].getMetadata().getName() === "sap.ui.layout.form.SimpleForm", "Check bottom simple form with technical info");
        assert.ok(dialogFormContent[2].getId() === _getDomId("technicalInfoBox"), "Check bottom simple form id");
        assert.ok(dialogFormContent[2].getEditable() === false, "Check bottom simple form is editable");

        const simpleFormBottomContent = dialogFormContent[2].getContent();
        assert.ok(simpleFormBottomContent[0].getMetadata().getName() === "sap.m.Text", "Check form field loginDetails");
        assert.ok(simpleFormBottomContent[0].getText() === translationBundle.getText("loginDetails"), "Check form field value loginDetails");
        assert.ok(simpleFormBottomContent[1].getMetadata().getName() === "sap.m.Label", "Check form field userFld");
        assert.ok(simpleFormBottomContent[1].getText() === translationBundle.getText("userFld"), "Check form field value userFld");
        assert.ok(simpleFormBottomContent[2].getMetadata().getName() === "sap.m.Text", "Check form field userDetails.fullName");
        assert.ok(simpleFormBottomContent[2].getText() === (oClientContext.userDetails.fullName || ""), "Check form field value userDetails.fullName");
        assert.ok(simpleFormBottomContent[3].getMetadata().getName() === "sap.m.Label", "Check form field serverFld");
        assert.ok(simpleFormBottomContent[3].getText() === translationBundle.getText("serverFld"), "Check form field value serverFld");
        assert.ok(simpleFormBottomContent[4].getMetadata().getName() === "sap.m.Text", "Check form field server");
        assert.ok(simpleFormBottomContent[4].getText() === window.location.host, "Check form field value server");
        assert.ok(simpleFormBottomContent[5].getMetadata().getName() === "sap.m.Label", "Check form field eMailFld");
        assert.ok(simpleFormBottomContent[5].getText() === translationBundle.getText("eMailFld"), "Check form field value eMailFld");
        assert.ok(simpleFormBottomContent[6].getMetadata().getName() === "sap.m.Text", "Check form field eMailFld");
        assert.ok(simpleFormBottomContent[6].getText() === (oClientContext.userDetails.eMail || ""), "Check form field value userDetails.eMail");
        assert.ok(simpleFormBottomContent[7].getMetadata().getName() === "sap.m.Label", "Check form field languageFld");
        assert.ok(simpleFormBottomContent[7].getText() === translationBundle.getText("languageFld"), "Check form field value languageFld");
        assert.ok(simpleFormBottomContent[8].getMetadata().getName() === "sap.m.Text", "Check form field Language");
        assert.ok(simpleFormBottomContent[8].getText() === (oClientContext.userDetails.Language || ""), "Check form field value Language");

        oDialog.destroy();
    });

    QUnit.test("Check bottom form content with email", async function (assert) {
        const translationBundle = Resources.i18n,
            oClientContext = UserActivityLog.getMessageInfo(),
            messageInfoStub = sinon.stub(UserActivityLog, "getMessageInfo"),
            contactSupportDialog = new ContactSupportButton();

        messageInfoStub.callsFake(function () {
            oClientContext.userDetails.eMail = "aaa@bbb.com";
            return oClientContext;
        });
        //Show the dialog
        await contactSupportDialog.showContactSupportDialog();

        const oDialog = _getControl("ContactSupportDialog");
        const dialogFormContent = oDialog.getContent();
        const simpleFormBottomContent = dialogFormContent[2].getContent();
        assert.ok(simpleFormBottomContent[5].getMetadata().getName() === "sap.m.Label", "Check form field eMailFld");
        assert.ok(simpleFormBottomContent[5].getText() === translationBundle.getText("eMailFld"), "Check form field value eMailFld");
        assert.ok(simpleFormBottomContent[6].getMetadata().getName() === "sap.m.Text", "Check form field mail");
        assert.ok(simpleFormBottomContent[6].getText() === (oClientContext.userDetails.eMail), "Check form field value mail");
        messageInfoStub.restore();

        oDialog.destroy();
    });

    QUnit.test("Mark subject/description empty input fields as an error when Send button is pressed", async function (assert) {
        const oContactSupportDialog = new ContactSupportButton();
        const oTranslationBundle = Resources.i18n;

        //Show the dialog
        await oContactSupportDialog.showContactSupportDialog();

        const oDialogForm = _getControl("ContactSupportDialog");
        const oSubjectInput = _getControl("subjectInput");
        const oTextArea = _getControl("textArea");
        const oSendButton = _getControl("contactSupportSendBtn");

        assert.strictEqual(oSubjectInput.getValue(), "", "Check the subject input is empty.");
        assert.strictEqual(oSubjectInput.getValueState(), "None", "Check the value status of subject input is None.");
        assert.strictEqual(oTextArea.getValue(), "", "Check the subject input is empty.");
        assert.strictEqual(oTextArea.getValueState(), "None", "Check the value status of subject input is None.");

        oSendButton.firePress();

        assert.strictEqual(oSubjectInput.getValueState(), "Error", "Check the value status of subject input is Error.");
        assert.strictEqual(oSubjectInput.getValueStateText(), oTranslationBundle.getText("subjectEmptyErrorMessage"), "Check the error msg of subject input.");
        assert.strictEqual(oTextArea.getValueState(), "Error", "Check the value status of text area is Error.");
        assert.strictEqual(oTextArea.getValueStateText(), oTranslationBundle.getText("txtAreaEmptyErrorMessage"), "Check the error msg of text area.");

        oDialogForm.destroy();
    });

    QUnit.test("Mark empty description text area as an error when subject is filled and send button is pressed", async function (assert) {
        const oContactSupportDialog = new ContactSupportButton();
        const oTranslationBundle = Resources.i18n;

        //Show the dialog
        await oContactSupportDialog.showContactSupportDialog();

        const oDialogForm = _getControl("ContactSupportDialog");
        const oSubjectInput = _getControl("subjectInput");
        const oTextArea = _getControl("textArea");
        const oSendButton = _getControl("contactSupportSendBtn");


        assert.strictEqual(oSubjectInput.getValue(), "", "Check the subject input is empty.");
        assert.strictEqual(oSubjectInput.getValueState(), "None", "Check the value status of subject input is None.");
        assert.strictEqual(oTextArea.getValue(), "", "Check the subject input is empty.");
        assert.strictEqual(oTextArea.getValueState(), "None", "Check the value status of subject input is None.");

        oSubjectInput.setValue("This is a dummy subject");
        oSendButton.firePress();

        assert.strictEqual(oSubjectInput.getValueState(), "None", "Check the value status of subject input is None.");
        assert.strictEqual(oTextArea.getValueState(), "Error", "Check the value status of text area is Error.");
        assert.strictEqual(oTextArea.getValueStateText(), oTranslationBundle.getText("txtAreaEmptyErrorMessage"), "Check the error msg of text area.");

        oDialogForm.destroy();
    });

    QUnit.test("Mark empty subject input as an error when description is filled and send button is pressed", async function (assert) {
        const oContactSupportDialog = new ContactSupportButton();
        const oTranslationBundle = Resources.i18n;

        //Show the dialog
        await oContactSupportDialog.showContactSupportDialog();

        const oDialogForm = _getControl("ContactSupportDialog");
        const oSubjectInput = _getControl("subjectInput");
        const oTextArea = _getControl("textArea");
        const oSendButton = _getControl("contactSupportSendBtn");

        assert.strictEqual(oSubjectInput.getValue(), "", "Check the subject input is empty.");
        assert.strictEqual(oSubjectInput.getValueState(), "None", "Check the value status of subject input is None.");
        assert.strictEqual(oTextArea.getValue(), "", "Check the subject input is empty.");
        assert.strictEqual(oTextArea.getValueState(), "None", "Check the value status of subject input is None.");

        oTextArea.setValue("This is a dummy description");
        oSendButton.firePress();

        assert.strictEqual(oSubjectInput.getValueState(), "Error", "Check the value status of subject input is Error.");
        assert.strictEqual(oSubjectInput.getValueStateText(), oTranslationBundle.getText("subjectEmptyErrorMessage"), "Check the error msg of subject input.");
        assert.strictEqual(oTextArea.getValueState(), "None", "Check the value status of text area is None.");

        oDialogForm.destroy();
    });
});

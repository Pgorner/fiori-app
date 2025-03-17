/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
sap.ui.define([
	"sap/ui/core/Fragment",
	"sap/ui/core/library",
	"sap/ui/core/mvc/Controller",
	"sap/apf/modeler/ui/utils/nullObjectChecker"
], function(Fragment, coreLibrary, Controller, nullObjectChecker) {
	"use strict";
	var ValueState = coreLibrary.ValueState;

	return Controller.extend("sap.apf.modeler.ui.controller.overwriteExistingConfiguration", {
		setOverwriteConfirmationDialogText : function(oTextReader) {
			Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfirmationDialog").setTitle(oTextReader("configAlreadyExists"));
			Fragment.byId("idOverwriteConfirmationFragment", "idConfirmationMessage").setText(oTextReader("overwriteDialogMsg"));
			Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfig").setText(oTextReader("overwriteConfig"));
			Fragment.byId("idOverwriteConfirmationFragment", "idDoNotOverwriteConfig").setText(oTextReader("doNotOverwriteConfig"));
			Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleLabel").setText(oTextReader("newConfigTitle"));
			Fragment.byId("idOverwriteConfirmationFragment", "idOkButton").setText(oTextReader("ok"));
			Fragment.byId("idOverwriteConfirmationFragment", "idCancelButton").setText(oTextReader("cancel"));
		},
		handleOkButtonPress : function() {
			var bSelectedButton, oNewConfigTitleInput, oOverwriteDialog, callbackOverwrite, callbackCreateNew;
			oOverwriteDialog = Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfirmationDialog");
			callbackOverwrite = oOverwriteDialog.getCustomData()[0].getValue().callbackOverwrite;
			callbackCreateNew = oOverwriteDialog.getCustomData()[0].getValue().callbackCreateNew;
			bSelectedButton = Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfigRadioGroup").getSelectedButton();
			oNewConfigTitleInput = Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput");
			if (bSelectedButton === Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfig")) {
				callbackOverwrite();
			} else {
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oNewConfigTitleInput.getValue().trim())) {
					oNewConfigTitleInput.setValueState(ValueState.None);
					callbackCreateNew(oNewConfigTitleInput.getValue());
				} else {
					oNewConfigTitleInput.setValueState(ValueState.Error);
				}
			}
		},
		handleCancelOfOverwriteDialog : function() {
			Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfirmationDialog").destroy();
		},
		handleChangeForOverwriteConfigOptions : function() {
			var bSelectedButton;
			bSelectedButton = Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfigRadioGroup").getSelectedButton();
			if (bSelectedButton === Fragment.byId("idOverwriteConfirmationFragment", "idDoNotOverwriteConfig")) {
				Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleLayout").setVisible(true);
				Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").setEnabled(true);
			} else {// If title for new config is not blank & we change the radio button option to overwrite the input fiels should be disabled and not hidden
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").getValue().trim())) {
					Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").setEnabled(false);
					Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").setValueState(ValueState.None);
				} else {//In case input for new config title is left blank and we switch then both label and input for new title should be hidden
					Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleLayout").setVisible(false);
				}
			}
		}
	});
});
/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogActions", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function (DialogActions, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructs a new DialogCreateActions instance.
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
	 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
	 * @returns {sap.fe.test.api.DialogCreateActions} The new instance
	 * @extends sap.fe.test.api.DialogActions
	 * @alias sap.fe.test.api.DialogCreateActions
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var DialogCreateActions = function (oDialogBuilder, vDialogDescription) {
		return DialogActions.call(this, oDialogBuilder, vDialogDescription, 0);
	};
	DialogCreateActions.prototype = Object.create(DialogActions.prototype);
	DialogCreateActions.prototype.constructor = DialogCreateActions;
	DialogCreateActions.prototype.isAction = true;

	/**
	 * Executes the <code>Create</code> action on the create dialog.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogCreateActions.prototype.iExecuteCreate = function () {
		return this.prepareResult(
			this.getBuilder()
				.doPressFooterButton(
					OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON_CONTINUE")
				)
				.description(Utils.formatMessage("Pressing create button on dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	return DialogCreateActions;
});

/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function (DialogAPI, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructs a new DialogActions instance.
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
	 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
	 * @param {number} [iConfirmButtonIndex] Index of the 'confirm' button in the button aggregation; the default setting is 0 (first button from the left)
	 * @returns {sap.fe.test.api.DialogActions} The new DialogActions instance
	 * @alias sap.fe.test.api.DialogActions
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var DialogActions = function (oDialogBuilder, vDialogDescription, iConfirmButtonIndex) {
		return DialogAPI.call(this, oDialogBuilder, vDialogDescription, iConfirmButtonIndex);
	};
	DialogActions.prototype = Object.create(DialogAPI.prototype);
	DialogActions.prototype.constructor = DialogActions;
	DialogActions.prototype.isAction = true;

	/**
	 * Confirms the dialog by clicking the corresponding button (for example, 'OK').
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogActions.prototype.iConfirm = function () {
		return this.prepareResult(
			this.getBuilder()
				.doPressFooterButton(this._getConfirmButtonMatcher())
				.description(Utils.formatMessage("Confirming dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	/**
	 * Cancels the dialog by clicking the corresponding button (for example, 'Cancel').
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogActions.prototype.iCancel = function () {
		return this.prepareResult(
			this.getBuilder()
				.doPressFooterButton(this._getCancelButtonMatcher())
				.description(Utils.formatMessage("Cancelling dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	/**
	 * Closes the dialog by pressing the 'Escape' key.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogActions.prototype.iClose = function () {
		return this.prepareResult(
			this.getBuilder()
				.doPressKeyboardShortcut("Escape")
				.description(Utils.formatMessage("Closing dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	/**
	 * Changes the content of a field in a dialog.
	 * @param {sap.fe.test.api.DialogFieldIdentifier} vFieldIdentifier The identifier of the field
	 * @param {string} [vValue] The new target value.
	 * @param {boolean} [bClearFirst] Set to <code>true</code> to clear previously set filters, otherwise all previously set values will be kept
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
	 * @public
	 */
	DialogActions.prototype.iChangeDialogField = function (vFieldIdentifier, vValue, bClearFirst) {
		var aArguments = Utils.parseArguments([Object, String, Boolean], arguments);
		return this.prepareResult(
			this._createFieldBuilder(vFieldIdentifier, this.getIdentifier())
				.doChangeValue(aArguments[1], aArguments[2])
				.description(
					Utils.formatMessage(
						"Changing the field '{1}' of dialog '{0}' by adding '{2}' (was cleared first: {3})",
						this.getIdentifier(),
						aArguments[0],
						aArguments[1],
						!!aArguments[2]
					)
				)
				.execute()
		);
	};

	/**
	 * Changes the content of a field in an action parameter dialog.
	 *
	 * Deprecated: Please use dialog action iChangeDialogField.
	 * @param {sap.fe.test.api.ActionDialogFieldIdentifier} vFieldIdentifier The identifier of the field
	 * @param {string} [vValue] The new target value.
	 * @param {boolean} [bClearFirst] Set to <code>true</code> to clear previously set filters, otherwise all previously set values will be kept
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
	 * @ui5-restricted
	 */
	DialogActions.prototype.iChangeActionParameterDialogField = function (vFieldIdentifier, vValue, bClearFirst) {
		return this.iChangeDialogField(vFieldIdentifier, vValue, bClearFirst);
	};

	/**
	 * Executes a keyboard shortcut on dialog.
	 * @param {string} sShortcut The shortcut pattern
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @ui5-restricted
	 */
	DialogActions.prototype.iExecuteKeyboardShortcut = function (sShortcut) {
		return this.prepareResult(
			this.getBuilder()
				.doPressKeyboardShortcut(sShortcut)
				.description(Utils.formatMessage("Execute keyboard shortcut " + sShortcut + " on dialog"))
				.execute()
		);
	};

	return DialogActions;
});

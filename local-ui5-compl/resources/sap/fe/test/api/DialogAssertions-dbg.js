/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./DialogAPI", "sap/fe/test/Utils"], function (DialogAPI, Utils) {
	"use strict";

	/**
	 * Constructs a new DialogAssertions instance.
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
	 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
	 * @param {number} [iConfirmButtonIndex] Index of the 'confirm' button in the button aggregation; the default setting is 0 (first button from the left)
	 * @returns {sap.fe.test.api.DialogAssertions} The new instance
	 * @alias sap.fe.test.api.DialogAssertions
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var DialogAssertions = function (oDialogBuilder, vDialogDescription, iConfirmButtonIndex) {
		return DialogAPI.call(this, oDialogBuilder, vDialogDescription, iConfirmButtonIndex);
	};
	DialogAssertions.prototype = Object.create(DialogAPI.prototype);
	DialogAssertions.prototype.constructor = DialogAssertions;
	DialogAssertions.prototype.isAction = false;

	/**
	 * Checks the dialog.
	 * @param {object} [mDialogState] Defines the expected state of the dialog
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogAssertions.prototype.iCheckState = function (mDialogState) {
		return this.prepareResult(
			this.getBuilder()
				.hasState(mDialogState)
				.description(Utils.formatMessage("Checking dialog '{0}' in state '{1}'", this.getIdentifier(), mDialogState))
				.execute()
		);
	};

	/**
	 * Checks the confirmation button of the dialog.
	 * @param {object} [mButtonState] Defines the expected state of the button
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogAssertions.prototype.iCheckConfirm = function (mButtonState) {
		return this.prepareResult(
			this.getBuilder()
				.hasFooterButton(this._getConfirmButtonMatcher(), mButtonState)
				.description(
					Utils.formatMessage(
						"Checking dialog '{0}' having confirmation button with state '{1}'",
						this.getIdentifier(),
						mButtonState
					)
				)
				.execute()
		);
	};

	/**
	 * Checks the cancellation button of the dialog.
	 * @param {object} [mButtonState] Defines the expected state of the button
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogAssertions.prototype.iCheckCancel = function (mButtonState) {
		return this.prepareResult(
			this.getBuilder()
				.hasFooterButton(this._getCancelButtonMatcher(), mButtonState)
				.description(
					Utils.formatMessage(
						"Checking dialog '{0}' having cancellation button with state '{1}'",
						this.getIdentifier(),
						mButtonState
					)
				)
				.execute()
		);
	};

	/**
	 * Checks the content and state of a field in a dialog.
	 * @param {sap.fe.test.api.DialogFieldIdentifier} vFieldIdentifier The identifier of the field
	 * @param {string | Array | object} [vValue] Expected value(s) of the field.
	 * if passed as an object, the following pattern will be considered:
	 * <code><pre>
	 * {
	 *     value: <string>, 		// optional
	 * }
	 * </pre></code>
	 * @param {object} [mState] Defines the expected state of the field
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogAssertions.prototype.iCheckDialogField = function (vFieldIdentifier, vValue, mState) {
		var aArguments = Utils.parseArguments([Object, [String, Array, Object], Object], arguments);
		return this.prepareResult(
			this._createFieldBuilder(vFieldIdentifier, this.getIdentifier())
				.hasValue(aArguments[1])
				.hasState(aArguments[2])
				.description(
					Utils.formatMessage(
						"Checking field '{1}' of dialog '{0}' with content '{2}' and state '{3}'",
						this.getIdentifier(),
						aArguments[0],
						aArguments[1],
						aArguments[2]
					)
				)
				.execute()
		);
	};

	/**
	 * Checks the content and state of a field in an action parameter dialog.
	 * @param {sap.fe.test.api.ActionDialogFieldIdentifier} vFieldIdentifier The identifier of the field
	 * @param {string | Array | object} [vValue] Expected value(s) of the field.
	 * if passed as an object, the following pattern will be considered:
	 * <code><pre>
	 * {
	 *     value: <string>, 		// optional
	 * }
	 * </pre></code>
	 * @param {object} [mState] Defines the expected state of the field
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogAssertions.prototype.iCheckActionParameterDialogField = function (vFieldIdentifier, vValue, mState) {
		return this.iCheckDialogField(vFieldIdentifier, vValue, mState);
	};

	return DialogAssertions;
});

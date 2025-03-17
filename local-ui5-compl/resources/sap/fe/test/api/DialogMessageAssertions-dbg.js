/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./DialogAssertions", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "sap/fe/test/Utils"],
	function (DialogAssertions, OpaBuilder, FEBuilder, Utils) {
		"use strict";

		/**
		 * Constructs a new DialogMessageActions instance.
		 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
		 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
		 * @returns {sap.fe.test.api.DialogMessageAssertions} The new instance
		 * @extends sap.fe.test.api.DialogAssertions
		 * @alias sap.fe.test.api.DialogMessageAssertions
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var DialogMessageAssertions = function (oDialogBuilder, vDialogDescription) {
			return DialogAssertions.call(this, oDialogBuilder, vDialogDescription, 0);
		};
		DialogMessageAssertions.prototype = Object.create(DialogAssertions.prototype);
		DialogMessageAssertions.prototype.constructor = DialogMessageAssertions;
		DialogMessageAssertions.prototype.isAction = false;

		/**
		 * Checks the <code>Back</code> action on the message dialog.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		DialogMessageAssertions.prototype.iCheckBack = function (mState) {
			return this.prepareResult(
				this.getBuilder()
					.hasHeaderButton(OpaBuilder.Matchers.properties({ icon: "sap-icon://nav-back" }), mState)
					.description(
						Utils.formatMessage("Checking that dialog '{0}' has a back button with state '{1}'", this.getIdentifier(), mState)
					)
					.execute()
			);
		};

		/**
		 * Checks the <code>Refresh</code> action on the dialog.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		DialogMessageAssertions.prototype.iCheckRefresh = function (mState) {
			return this.prepareResult(
				this.getBuilder()
					.hasFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "C_COMMON_SAPFE_REFRESH"), mState)
					.description(
						Utils.formatMessage(
							"Checking that dialog '{0}' has a refresh button with state '{1}'",
							this.getIdentifier(),
							mState
						)
					)
					.execute()
			);
		};

		/**
		 * Checks whether a certain message is shown in the dialog.
		 * @param {object} [oMessage] Defines the expected state of the message, e.g. <code>{ title: "My message" }</code>
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		DialogMessageAssertions.prototype.iCheckMessage = function (oMessage) {
			return this.prepareResult(
				this.getBuilder()
					.hasContent(FEBuilder.Matchers.states({ controlType: "sap.m.MessageView" }), true)
					.hasAggregation("items", OpaBuilder.Matchers.properties(oMessage))
					.description(Utils.formatMessage("Checking dialog '{0}' having a message '{1}' ", this.getIdentifier(), oMessage))
					.execute()
			);
		};

		return DialogMessageAssertions;
	}
);

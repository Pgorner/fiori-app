/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FooterActionsBase", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function (FooterActionsBase, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructs a new FooterActionsOP instance.
	 * @param {sap.fe.test.builder.OverflowToolbarBuilder} oOverflowToolbarBuilder The {@link sap.fe.test.builder.OverflowToolbarBuilder} instance used to interact with the UI
	 * @param {string} [vFooterDescription] Description (optional) of the footer bar to be used for logging messages
	 * @returns {sap.fe.test.api.FooterActionsOP} The new instance
	 * @alias sap.fe.test.api.FooterActionsOP
	 * @class
	 * @extends sap.fe.test.api.FooterActionsBase
	 * @hideconstructor
	 * @public
	 */
	var FooterActionsOP = function (oOverflowToolbarBuilder, vFooterDescription) {
		return FooterActionsBase.call(this, oOverflowToolbarBuilder, vFooterDescription);
	};
	FooterActionsOP.prototype = Object.create(FooterActionsBase.prototype);
	FooterActionsOP.prototype.constructor = FooterActionsOP;
	FooterActionsOP.prototype.isAction = true;

	/**
	 * Executes the Save or Create action in the footer bar of the object page.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterActionsOP.prototype.iExecuteSave = function () {
		return this.iExecuteAction({ service: "StandardAction", action: "Save", unbound: true });
	};

	/**
	 * Executes the Apply action in the footer bar of a sub-object page.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterActionsOP.prototype.iExecuteApply = function () {
		return this.iExecuteAction({ service: "StandardAction", action: "Apply", unbound: true });
	};

	/**
	 * Executes the Cancel action in the footer bar of the object page.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterActionsOP.prototype.iExecuteCancel = function () {
		return this.iExecuteAction({ service: "StandardAction", action: "Cancel", unbound: true });
	};

	/**
	 * Confirms the Cancel action when user clicks <code>Cancel</code> in draft mode.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterActionsOP.prototype.iConfirmCancel = function () {
		return this.prepareResult(
			OpaBuilder.create(this)
				.hasType("sap.m.Popover")
				.isDialogElement()
				.doOnChildren(
					OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "C_TRANSACTION_HELPER_DRAFT_DISCARD_BUTTON"),
					OpaBuilder.Actions.press()
				)
				.description("Confirming discard changes")
				.execute()
		);
	};

	return FooterActionsOP;
});

/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FooterAssertionsBase", "sap/fe/test/Utils", "sap/m/library"], function (FooterAssertionsBase, Utils, mLibrary) {
	"use strict";

	/**
	 * Constructs a new FooterAssertionsOP instance.
	 * @param {sap.fe.test.builder.OverflowToolbarBuilder} oOverflowToolbarBuilder The {@link sap.fe.test.builder.OverflowToolbarBuilder} instance used to interact with the UI
	 * @param {string} [vFooterDescription] Description (optional) of the footer bar to be used for logging messages
	 * @returns {sap.fe.test.api.FooterAssertionsOP} The new instance
	 * @alias sap.fe.test.api.FooterAssertionsOP
	 * @class
	 * @extends sap.fe.test.api.FooterAssertionsBase
	 * @hideconstructor
	 * @public
	 */
	var FooterAssertionsOP = function (oOverflowToolbarBuilder, vFooterDescription) {
		return FooterAssertionsBase.call(this, oOverflowToolbarBuilder, vFooterDescription);
	};
	FooterAssertionsOP.prototype = Object.create(FooterAssertionsBase.prototype);
	FooterAssertionsOP.prototype.constructor = FooterAssertionsOP;
	FooterAssertionsOP.prototype.isAction = false;

	var DraftIndicatorState = mLibrary.DraftIndicatorState;

	function _checkDraftState(oOverflowToolbarBuilder, sState) {
		return oOverflowToolbarBuilder
			.hasContent(function (oObject) {
				return oObject.getMetadata().getName() === "sap.m.DraftIndicator" && oObject.getState() === sState;
			})
			.description("Draft Indicator on footer bar is in " + sState + " state")
			.execute();
	}

	/**
	 * Checks the state of the Save or Create action in the footer bar.
	 * @param {object} [mState] Defines the expected state of the button
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterAssertionsOP.prototype.iCheckSave = function (mState) {
		return this.iCheckAction({ service: "StandardAction", action: "Save", unbound: true }, mState);
	};

	/**
	 * Checks the state of the Apply action in the footer bar.
	 * @param {object} [mState] Defines the expected state of the button
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterAssertionsOP.prototype.iCheckApply = function (mState) {
		return this.iCheckAction({ service: "StandardAction", action: "Apply", unbound: true }, mState);
	};

	/**
	 * Checks the state of the Cancel action in the footer bar.
	 * @param {object} [mState] Defines the expected state of the button
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterAssertionsOP.prototype.iCheckCancel = function (mState) {
		return this.iCheckAction({ service: "StandardAction", action: "Cancel", unbound: true }, mState);
	};

	/**
	 * Checks for draft state 'Clear' in the footer bar.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterAssertionsOP.prototype.iCheckDraftStateClear = function () {
		return this.prepareResult(_checkDraftState(this.getBuilder(), DraftIndicatorState.Clear));
	};

	/**
	 * Checks for draft state 'Saved' in the footer bar.
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterAssertionsOP.prototype.iCheckDraftStateSaved = function () {
		return this.prepareResult(_checkDraftState(this.getBuilder(), DraftIndicatorState.Saved));
	};

	return FooterAssertionsOP;
});

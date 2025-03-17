/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FooterAPI", "sap/fe/test/Utils"], function (FooterAPI, Utils) {
	"use strict";

	/**
	 * Constructs a new FooterAssertionsBase instance.
	 * @param {sap.fe.test.builder.OverflowToolbarBuilder} oOverflowToolbarBuilder The {@link sap.fe.test.builder.OverflowToolbarBuilder} instance used to interact with the UI
	 * @param {string} [vFooterDescription] Description (optional) of the footer bar to be used for logging messages
	 * @returns {sap.fe.test.api.FooterAssertionsBase} The new instance
	 * @alias sap.fe.test.api.FooterAssertionsBase
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var FooterAssertionsBase = function (oOverflowToolbarBuilder, vFooterDescription) {
		return FooterAPI.call(this, oOverflowToolbarBuilder, vFooterDescription);
	};
	FooterAssertionsBase.prototype = Object.create(FooterAPI.prototype);
	FooterAssertionsBase.prototype.constructor = FooterAssertionsBase;
	FooterAssertionsBase.prototype.isAction = false;

	/**
	 * Checks the state of an action in the footer bar.
	 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier The identifier of an action
	 * @param {object} [mState] Defines the expected state of the button
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterAssertionsBase.prototype.iCheckAction = function (vActionIdentifier, mState) {
		var oOverflowToolbarBuilder = this.getBuilder();

		return this.prepareResult(
			oOverflowToolbarBuilder
				.hasContent(this.createActionMatcher(vActionIdentifier), mState)
				.description(Utils.formatMessage("Checking footer action '{0}' with state='{1}'", vActionIdentifier, mState))
				.execute()
		);
	};

	/**
	 * Checks the state of the footer bar.
	 * @param {object} [mState] Defines the expected state of the footer bar
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterAssertionsBase.prototype.iCheckState = function (mState) {
		var oOverflowToolbarBuilder = this.getBuilder();
		return this.prepareResult(
			oOverflowToolbarBuilder.hasState(mState).description(Utils.formatMessage("Checking footer with state='{0}'", mState)).execute()
		);
	};

	return FooterAssertionsBase;
});

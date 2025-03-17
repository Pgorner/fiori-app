/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./FooterAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function (FooterAPI, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructs a new FooterActionsBase instance.
	 * @param {sap.fe.test.builder.OverflowToolbarBuilder} oOverflowToolbarBuilder The {@link sap.fe.test.builder.OverflowToolbarBuilder} instance used to interact with the UI
	 * @param {string} [vFooterDescription] Description (optional) of the footer bar to be used for logging messages
	 * @returns {sap.fe.test.api.FooterActionsBase} The new instance
	 * @alias sap.fe.test.api.FooterActionsBase
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var FooterActionsBase = function (oOverflowToolbarBuilder, vFooterDescription) {
		return FooterAPI.call(this, oOverflowToolbarBuilder, vFooterDescription);
	};
	FooterActionsBase.prototype = Object.create(FooterAPI.prototype);
	FooterActionsBase.prototype.constructor = FooterActionsBase;
	FooterActionsBase.prototype.isAction = true;

	/**
	 * Executes a footer action.
	 * @param {string | sap.fe.test.api.ActionIdentifier} [vActionIdentifier] The identifier of the action or its label
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	FooterActionsBase.prototype.iExecuteAction = function (vActionIdentifier) {
		var oOverflowToolbarBuilder = this.getBuilder();

		return this.prepareResult(
			oOverflowToolbarBuilder
				.doOnContent(this.createActionMatcher(vActionIdentifier), OpaBuilder.Actions.press())
				.description(Utils.formatMessage("Executing footer action '{0}'", vActionIdentifier))
				.execute()
		);
	};

	return FooterActionsBase;
});

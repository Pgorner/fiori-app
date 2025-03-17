/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./HeaderLR", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "./APIHelper"],
	function (HeaderLR, Utils, OpaBuilder, FEBuilder, APIHelper) {
		"use strict";

		/**
		 * Constructs a new HeaderActionsLR instance.
		 * @param {sap.fe.test.builder.FEBuilder} oHeaderBuilder The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vHeaderDescription] Description (optional) of the header to be used for logging messages
		 * @returns {sap.fe.test.api.HeaderActionsLR} The new instance
		 * @alias sap.fe.test.api.HeaderActionsLR
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var HeaderActionsLR = function (oHeaderBuilder, vHeaderDescription) {
			return HeaderLR.call(this, oHeaderBuilder, vHeaderDescription);
		};
		HeaderActionsLR.prototype = Object.create(HeaderLR.prototype);
		HeaderActionsLR.prototype.constructor = HeaderActionsLR;
		HeaderActionsLR.prototype.isAction = true;

		/**
		 * Executes an action in the header toolbar of a list report.
		 * @param {string | sap.fe.test.api.ActionIdentifier} [vActionIdentifier] The identifier of the action
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActionsLR.prototype.iExecuteAction = function (vActionIdentifier) {
			var aArguments = Utils.parseArguments([[Object, String]], arguments),
				oOverflowToolbarBuilder = this.createOverflowToolbarBuilder(this._sPageId);
			return this.prepareResult(
				oOverflowToolbarBuilder
					.doOnContent(this.createActionMatcher(vActionIdentifier), OpaBuilder.Actions.press())
					.description(Utils.formatMessage("Executing custom header action '{0}'", aArguments[0]))
					.execute()
			);
		};

		/**
		 * Executes the <code>Save as Tile</code> action.
		 * @param {string} sBookmarkTitle The title of the new tile
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderActionsLR.prototype.iExecuteSaveAsTile = function (sBookmarkTitle) {
			var oShareButtonProperties = {
				icon: "sap-icon://action"
			};
			var oShareBuilder = FEBuilder.create(this.getOpaInstance());

			return this.prepareResult(
				oShareBuilder
					.hasProperties(oShareButtonProperties)
					.do(OpaBuilder.Actions.press())
					.description(Utils.formatMessage("Open share menu"))
					.success(APIHelper.createSaveAsTileExecutorBuilder(sBookmarkTitle))
					.execute()
			);
		};

		/**
		 * Executes the <code>Send E-Mail</code> action.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderActionsLR.prototype.iExecuteSendEmail = function () {
			var oShareProperties = {
					icon: "sap-icon://action"
				},
				oShareBuilder = FEBuilder.create(this.getOpaInstance());

			return this.prepareResult(
				oShareBuilder
					.hasProperties(oShareProperties)
					.do(OpaBuilder.Actions.press())
					.description(Utils.formatMessage("Pressing header '{0}' Share button", this.getIdentifier()))
					.success(APIHelper.createSendEmailExecutorBuilder())
					.execute()
			);
		};

		return HeaderActionsLR;
	}
);

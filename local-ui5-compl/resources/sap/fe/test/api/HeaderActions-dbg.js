/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./HeaderAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "./APIHelper"],
	function (HeaderAPI, Utils, OpaBuilder, FEBuilder, APIHelper) {
		"use strict";

		/**
		 * Constructs a new HeaderActions instance.
		 * @param {sap.fe.test.builder.FEBuilder} oHeaderBuilder The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vHeaderDescription] Description (optional) of the header to be used for logging messages
		 * @returns {sap.fe.test.api.HeaderActions} The new instance
		 * @alias sap.fe.test.api.HeaderActions
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var HeaderActions = function (oHeaderBuilder, vHeaderDescription) {
			this._sObjectPageLayoutId = vHeaderDescription.id;
			this._sHeaderContentId = vHeaderDescription.headerContentId;
			this._sHeaderContentContainerId = vHeaderDescription.headerContentContainerId;
			this._sViewId = vHeaderDescription.viewId;
			this._sPaginatorId = vHeaderDescription.paginatorId;
			this._sBreadCrumbId = vHeaderDescription.breadCrumbId;
			return HeaderAPI.call(this, oHeaderBuilder, vHeaderDescription);
		};
		HeaderActions.prototype = Object.create(HeaderAPI.prototype);
		HeaderActions.prototype.constructor = HeaderActions;
		HeaderActions.prototype.isAction = true;

		/**
		 * Executes an action in the header toolbar of an object page.
		 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier The identifier of the action
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecuteAction = function (vActionIdentifier) {
			var oOverflowToolbarBuilder = this.createOverflowToolbarBuilder(this._sObjectPageLayoutId);
			return this.prepareResult(
				oOverflowToolbarBuilder
					.doOnContent(this.createActionMatcher(vActionIdentifier), OpaBuilder.Actions.press())
					.description(Utils.formatMessage("Executing header action '{0}'", vActionIdentifier))
					.execute()
			);
		};

		/**
		 * Executes the Edit action in the header toolbar of an object page.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecuteEdit = function () {
			return this.iExecuteAction({ service: "StandardAction", action: "Edit", unbound: true });
		};

		/**
		 * Executes the Draft/Saved Version action in the header toolbar of an object page.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecuteDraftAndSavedVersionSwitch = function () {
			return this.iExecuteAction({ service: "StandardAction", action: "SwitchDraftAndActiveObject", unbound: true });
		};

		/**
		 * Executes the Delete action in the header toolbar of an object page.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecuteDelete = function () {
			return this.iExecuteAction({ service: "StandardAction", action: "Delete", unbound: true });
		};

		/**
		 * Executes the Related Apps action in the header toolbar of an object page.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecuteRelatedApps = function () {
			return this.iExecuteAction({ service: "fe", action: "RelatedApps", unbound: true });
		};

		/**
		 * Executes an action in the drop-down menu that is currently open.
		 * @param {string | object} vAction The label of the action or its state
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecuteMenuAction = function (vAction) {
			return this.prepareResult(APIHelper.createMenuActionExecutorBuilder(vAction).execute());
		};

		/**
		 * Executes an action in the selection list that is currently open.
		 * @param {string | object} vAction The label of the action or its state
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecuteSelectListAction = function (vAction) {
			return this.prepareResult(APIHelper.createSelectListActionExecutorBuilder(vAction).execute());
		};

		/**
		 * Navigates to the next sub-object page.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecutePaginatorDown = function () {
			return this.prepareResult(
				this.createPaginatorBuilder(
					OpaBuilder.Matchers.properties({ icon: "sap-icon://navigation-down-arrow" }),
					this._sViewId + "--" + this._sPaginatorId,
					{ visible: true, enabled: true }
				)
					.doPress()
					.description("Paginator button Down pressed")
					.execute()
			);
		};

		/**
		 * Navigates to the previous sub-object page.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderActions.prototype.iExecutePaginatorUp = function () {
			return this.prepareResult(
				this.createPaginatorBuilder(
					OpaBuilder.Matchers.properties({ icon: "sap-icon://navigation-up-arrow" }),
					this._sViewId + "--" + this._sPaginatorId,
					{ visible: true, enabled: true }
				)
					.doPress()
					.description("Paginator button Up pressed")
					.execute()
			);
		};

		/**
		 * Navigates by using a breadcrumb link on an object page.
		 * @param {string} sLink The label of the link to be navigated to
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 * @ui5-restricted
		 */
		HeaderActions.prototype.iNavigateByBreadcrumb = function (sLink) {
			return this.prepareResult(
				OpaBuilder.create(this)
					.hasId(this._sBreadCrumbId)
					.doOnAggregation("links", OpaBuilder.Matchers.properties({ text: sLink }), OpaBuilder.Actions.press())
					.description(Utils.formatMessage("Navigating by breadcrumb link '{0}'", sLink))
					.execute()
			);
		};

		/**
		 * Executes the <code>Save as Tile</code> action.
		 * @param {string} sBookmarkTitle The title of the new tile
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 * @ui5-restricted
		 */
		HeaderActions.prototype.iExecuteSaveAsTile = function (sBookmarkTitle) {
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
		 * @public
		 * @ui5-restricted
		 */
		HeaderActions.prototype.iExecuteSendEmail = function () {
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

		/**
		 * Clicks a link within the object page header.
		 *
		 * TODO this function will not made public as it is, it needs some refactoring to behave similar to the FormActions#iClickLink function.
		 * @param {string} vLinkIdentifier The label of the link to be clicked (TODO it actually must be the link text with the current implementation)
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderActions.prototype.iClickLink = function (vLinkIdentifier) {
			// TODO this function needs to aligned with onForm().iClickLink - for now vLinkIdentifier must be the link text!
			var oHeaderContentBuilder = this.getObjectPageHeaderContentContainerBuilder(this._sHeaderContentContainerId);
			return this.prepareResult(
				oHeaderContentBuilder
					.has(OpaBuilder.Matchers.children(FEBuilder.create().hasType("sap.m.Link").hasProperties({ text: vLinkIdentifier })))
					.doPress()
					.description(Utils.formatMessage("Pressing link '{0}'", vLinkIdentifier))
					.execute()
			);
		};

		return HeaderActions;
	}
);

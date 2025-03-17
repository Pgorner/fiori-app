/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder"], function (Utils, OpaBuilder, FEBuilder) {
	"use strict";

	var APIHelper = {
		createSaveAsTileCheckBuilder: function (mState) {
			return APIHelper.createMenuActionCheckBuilder({ icon: "sap-icon://add-favorite" })
				.hasState(mState)
				.description(Utils.formatMessage("Checking 'Save as Tile' action in state '{0}'", mState));
		},

		createSaveAsTileExecutorBuilder: function (sBookmarkTitle) {
			return APIHelper.createMenuActionExecutorBuilder({ icon: "sap-icon://add-favorite" }).success(
				FEBuilder.create()
					.isDialogElement()
					.hasType("sap.m.Input")
					.hasProperties({ id: "__xmlview1--bookmarkTitleInput" })
					.doEnterText(sBookmarkTitle)
					.description(Utils.formatMessage("Enter '{0}' as Bookmark title", sBookmarkTitle))

					.success(
						FEBuilder.create()
							.isDialogElement()
							.hasType("sap.m.Button")
							.hasProperties({ id: "bookmarkCancelBtn" })
							.doPress()
							.description("Cancel 'Save as Tile' dialog")
					)
			);
		},

		createSendEmailCheckBuilder: function (mState) {
			return APIHelper.createMenuActionCheckBuilder({ icon: "sap-icon://email" })
				.hasState(mState)
				.description(Utils.formatMessage("Checking 'Send Email' action in state '{0}'", mState));
		},

		createSendEmailExecutorBuilder: function () {
			return APIHelper.createMenuActionExecutorBuilder({ icon: "sap-icon://email" }).description("Executing 'Send Email' action");
		},

		createMenuAndListActionMatcher: function (vAction, bReturnAction) {
			var vActionMatcher;
			if (Utils.isOfType(vAction, String)) {
				vAction = { text: vAction };
			}
			if (Utils.isOfType(vAction, Object)) {
				if (vAction.visible === false) {
					var mStatesWOVisible = Object.assign(vAction);
					delete mStatesWOVisible.visible;
					vActionMatcher = OpaBuilder.Matchers.some(
						// either button is visible=false ...
						OpaBuilder.Matchers.aggregationMatcher("items", FEBuilder.Matchers.states(vAction)),
						// ... or it wasn't rendered at all (no match in the aggregation)
						OpaBuilder.Matchers.not(
							OpaBuilder.Matchers.aggregationMatcher("items", FEBuilder.Matchers.states(mStatesWOVisible))
						)
					);
				} else {
					vActionMatcher = bReturnAction
						? [OpaBuilder.Matchers.aggregation("items", FEBuilder.Matchers.states(vAction)), FEBuilder.Matchers.atIndex(0)]
						: OpaBuilder.Matchers.aggregationMatcher("items", FEBuilder.Matchers.states(vAction));
				}
			} else {
				throw new Error("vAction parameter must be a string or object");
			}
			return vActionMatcher;
		},

		createMenuActionExecutorBuilder: function (vAction) {
			if (!vAction) {
				throw new Error("vAction parameter missing");
			}

			return FEBuilder.create()
				.hasType("sap.ui.unified.Menu")
				.isDialogElement(true)
				.has(APIHelper.createMenuAndListActionMatcher(vAction, true))
				.doPress()
				.description(Utils.formatMessage("Executing action '{0}' from currently open action menu", vAction));
		},

		createMenuActionCheckBuilder: function (vAction) {
			if (!vAction) {
				throw new Error("vAction parameter missing");
			}

			return FEBuilder.create()
				.hasType("sap.ui.unified.Menu")
				.isDialogElement(true)
				.has(APIHelper.createMenuAndListActionMatcher(vAction))
				.description(Utils.formatMessage("Checking currently open action menu having action '{0}'", vAction));
		},

		createSelectListActionExecutorBuilder: function (vAction) {
			if (!vAction) {
				throw new Error("vAction parameter missing");
			}

			return FEBuilder.create()
				.hasType("sap.m.SelectList")
				.isDialogElement(true)
				.has(APIHelper.createMenuAndListActionMatcher(vAction, true))
				.doPress()
				.description(Utils.formatMessage("Executing action '{0}' from currently open selection list", vAction));
		}
	};

	return APIHelper;
});

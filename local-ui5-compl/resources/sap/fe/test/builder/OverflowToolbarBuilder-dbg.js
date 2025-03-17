/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["sap/ui/test/OpaBuilder", "./FEBuilder", "sap/fe/test/Utils", "sap/ui/test/matchers/Interactable"],
	function (OpaBuilder, FEBuilder, Utils, Interactable) {
		"use strict";

		var OverflowToolbarBuilder = function () {
			return FEBuilder.apply(this, arguments);
		};

		OverflowToolbarBuilder.create = function (oOpaInstance) {
			return new OverflowToolbarBuilder(oOpaInstance);
		};

		OverflowToolbarBuilder.prototype = Object.create(FEBuilder.prototype);
		OverflowToolbarBuilder.prototype.constructor = OverflowToolbarBuilder;

		OverflowToolbarBuilder._toggleOverflow = function (oBuilder, bOpen, sToolbarSuffix) {
			var sOverflowButtonId = "overflowButton";
			if (sToolbarSuffix) {
				sOverflowButtonId = sToolbarSuffix + "-" + sOverflowButtonId;
			}
			return oBuilder.doConditional(
				OpaBuilder.Matchers.childrenMatcher(
					OpaBuilder.create()
						.has(FEBuilder.Matchers.id(new RegExp(sOverflowButtonId + "$")))
						.hasProperties({ pressed: !bOpen })
						.has(new Interactable())
						.mustBeEnabled()
						.mustBeVisible()
				),
				OpaBuilder.Actions.press(sOverflowButtonId)
			);
		};

		OverflowToolbarBuilder.openOverflow = function (oBuilder, sToolbarSuffix) {
			return OverflowToolbarBuilder._toggleOverflow(oBuilder, true, sToolbarSuffix);
		};

		OverflowToolbarBuilder.closeOverflow = function (oBuilder, sToolbarSuffix) {
			return OverflowToolbarBuilder._toggleOverflow(oBuilder, false, sToolbarSuffix);
		};

		OverflowToolbarBuilder.prototype.doOpenOverflow = function () {
			return OverflowToolbarBuilder.openOverflow(this);
		};

		OverflowToolbarBuilder.prototype.doCloseOverflow = function () {
			return OverflowToolbarBuilder.closeOverflow(this);
		};

		OverflowToolbarBuilder.prototype.doOnContent = function (vContentMatcher, vContentAction) {
			var oOverflowToolbarBuilder = new FEBuilder(this.getOpaInstance(), this.build()).hasType("sap.m.OverflowToolbar"),
				fnMatcherIsTextButton = function (oControl) {
					if (oControl.isA("sap.fe.macros.ShareAPI") || oControl.isA("sap.fe.macros.DraftToggle")) {
						// ShareAPI and DraftToggle don't have a text property
						// text property is on the MenuButton which is inside the shareAPI, and on the Button inside DraftToggle BB
						// so we get the control's content
						return !!oControl.getContent().getText;
					} else {
						return !!oControl.getText;
					}
				},
				fnDeepAggregation = FEBuilder.Matchers.deepAggregation("content", [
					new Interactable(),
					fnMatcherIsTextButton,
					vContentMatcher
				]),
				fnGetDefaultActionButton = function (oMenuButton) {
					/* This helper function returns the default action button of a menu button (if it exists, otherwise returns null);
					 * Remark: Currently there is no official API to retrieve this button; an alternative way to achieve the same
					 * result might be to check oMenuButton.getButtonMode() === "Split" && oMenuButton.getUseDefaultActionOnly()
					 * first, and then call oMenuButton.fireDefaultAction(), but the interface parameter vContentAction expects
					 * a sap.m.button nonetheless. Hence, we currently use the internal aggregation names as a workaround.
					 */
					return oMenuButton.getAggregation("_button")
						? oMenuButton.getAggregation("_button").getAggregation("_textButton")
						: null;
				},
				oSuccessHandler = function () {
					oOverflowToolbarBuilder
						.has(function (oOverflowToolbar) {
							return fnDeepAggregation(oOverflowToolbar).length === 1;
						})
						.do(function (oOverflowToolbar) {
							var oToolbarButton = fnDeepAggregation(oOverflowToolbar)[0];
							if (oToolbarButton.isA("sap.fe.macros.ShareAPI") || oToolbarButton.isA("sap.fe.macros.DraftToggle")) {
								// MenuButton is inside the shareAPI and Button is inside DraftToggle BB so we do getContent
								oToolbarButton = oToolbarButton.getContent();
							}
							var oButtonForAction =
								oToolbarButton.getMetadata().getName() === "sap.m.MenuButton"
									? fnGetDefaultActionButton(oToolbarButton) || oToolbarButton
									: oToolbarButton;
							OpaBuilder.Actions.executor(vContentAction || OpaBuilder.Actions.press())(oButtonForAction);
						})
						.execute();
				};
			return this.doOpenOverflow().success(oSuccessHandler);
		};

		OverflowToolbarBuilder.prototype.hasContent = function (vContentMatcher, mState) {
			var oOverflowToolbarBuilder = new OverflowToolbarBuilder(this.getOpaInstance(), this.build()),
				aMatchers = [vContentMatcher, FEBuilder.Matchers.states(mState)];
			if (mState && mState.visible === false) {
				mState = Object.assign(mState);
				delete mState.visible;
				oOverflowToolbarBuilder.hasSome(
					// either button is visible=false ...
					OpaBuilder.Matchers.aggregationMatcher("content", aMatchers),
					// ... or it wasn't rendered at all (no match in the aggregation)
					OpaBuilder.Matchers.not(
						OpaBuilder.Matchers.aggregationMatcher("content", [vContentMatcher, FEBuilder.Matchers.states(mState)])
					),
					// for shareAPI and draftToggle look into the child (menuButton or Button)
					OpaBuilder.Matchers.children(OpaBuilder.Matchers.match([vContentMatcher, FEBuilder.Matchers.states(mState)]))
				);
			} else {
				oOverflowToolbarBuilder.hasSome(
					OpaBuilder.Matchers.aggregationMatcher("content", aMatchers),
					// for DraftToggle look into child button
					OpaBuilder.Matchers.children(OpaBuilder.Matchers.match([vContentMatcher, FEBuilder.Matchers.states(mState)]))
				);
			}
			return this.doOpenOverflow().success(oOverflowToolbarBuilder);
		};

		return OverflowToolbarBuilder;
	}
);

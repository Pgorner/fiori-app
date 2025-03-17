/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["./FEBuilder", "./OverflowToolbarBuilder", "sap/ui/test/OpaBuilder", "sap/fe/test/Utils"],
	function (FEBuilder, OverflowToolbarBuilder, OpaBuilder, Utils) {
		"use strict";

		// additionally, picking the dialog with the highest z-index (which is increased by UI5 internally) in success function
		function getMostUpperDialog(aDialogs) {
			return (
				Array.isArray(aDialogs) &&
				aDialogs
					.sort(function (oDialogA, oDialogB) {
						return Number.parseInt(oDialogA.$().css("z-index"), 10) - Number.parseInt(oDialogB.$().css("z-index"), 10);
					})
					.pop()
			);
		}

		var DialogBuilder = function () {
			var oDialogFinder = FEBuilder.create().isDialogElement().hasType("sap.m.Dialog");
			return FEBuilder.apply(this, arguments)
				.options(oDialogFinder.build())
				.has(function (oDialog) {
					return getMostUpperDialog(FEBuilder.getControls(oDialogFinder)) === oDialog;
				});
		};

		DialogBuilder.create = function (oOpaInstance, oOptions) {
			return new DialogBuilder(oOpaInstance, oOptions);
		};

		DialogBuilder.prototype = Object.create(FEBuilder.prototype);
		DialogBuilder.prototype.constructor = DialogBuilder;

		DialogBuilder.prototype.hasContent = function (vContentMatcher, bReturnContent) {
			this.has(
				bReturnContent
					? OpaBuilder.Matchers.aggregation("content", vContentMatcher)
					: OpaBuilder.Matchers.aggregationMatcher("content", vContentMatcher)
			);
			if (bReturnContent) {
				return this.has(FEBuilder.Matchers.atIndex(0));
			}
			return this;
		};

		DialogBuilder.prototype.hasHeaderButton = function (vButtonMatcher, mState) {
			return this.has(OpaBuilder.Matchers.aggregation("customHeader"))
				.has(FEBuilder.Matchers.atIndex(0))
				.hasSome(
					OpaBuilder.Matchers.aggregation("contentLeft", vButtonMatcher),
					OpaBuilder.Matchers.aggregation("contentMiddle", vButtonMatcher),
					OpaBuilder.Matchers.aggregation("contentRight", vButtonMatcher)
				)
				.has(FEBuilder.Matchers.atIndex(0))
				.hasState(mState);
		};

		DialogBuilder.prototype.hasFooterButton = function (vButtonMatcher, mState) {
			return this.doOpenFooterOverflow().success(function (vDialog) {
				if (Array.isArray(vDialog)) {
					if (vDialog.length !== 1) {
						throw new Error(Utils.formatMessage("no single dialog found: {0}", vDialog));
					}
					vDialog = vDialog[0];
				}
				return FEBuilder.create()
					.hasId(vDialog.getId())
					.has(OpaBuilder.Matchers.aggregation("buttons", vButtonMatcher))
					.has(FEBuilder.Matchers.atIndex(0))
					.hasState(mState)
					.execute();
			});
		};

		DialogBuilder.prototype.doPressHeaderButton = function (vButtonMatcher) {
			return this.has(OpaBuilder.Matchers.aggregation("customHeader"))
				.has(FEBuilder.Matchers.atIndex(0))
				.hasSome(
					OpaBuilder.Matchers.aggregation("contentLeft", vButtonMatcher),
					OpaBuilder.Matchers.aggregation("contentMiddle", vButtonMatcher),
					OpaBuilder.Matchers.aggregation("contentRight", vButtonMatcher)
				)
				.has(FEBuilder.Matchers.atIndex(0))
				.doPress();
		};

		DialogBuilder.prototype.doOpenFooterOverflow = function () {
			return OverflowToolbarBuilder.openOverflow(this, "footer");
		};

		DialogBuilder.prototype.doPressFooterButton = function (vButtonMatcher) {
			return this.doOpenFooterOverflow().success(function (vDialog) {
				if (Array.isArray(vDialog)) {
					if (vDialog.length !== 1) {
						throw new Error(Utils.formatMessage("no single dialog found: {0}", vDialog));
					}
					vDialog = vDialog[0];
				}
				return OpaBuilder.create()
					.hasId(vDialog.getId())
					.has(OpaBuilder.Matchers.aggregation("buttons", vButtonMatcher))
					.doPress()
					.execute();
			});
		};

		return DialogBuilder;
	}
);

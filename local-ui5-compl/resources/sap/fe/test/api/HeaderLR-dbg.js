/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./BaseAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/OverflowToolbarBuilder",
		"sap/fe/core/helpers/StableIdHelper"
	],
	function (BaseAPI, Utils, OpaBuilder, FEBuilder, OverflowToolbarBuilder, StableIdHelper) {
		"use strict";

		/**
		 * Constructs a new HeaderLR instance.
		 * @param {sap.fe.test.builder.FEBuilder} oHeaderBuilder The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vHeaderDescription] Description (optional) of the header to be used for logging messages
		 * @returns {sap.fe.test.api.HeaderLR} The new instance
		 * @alias sap.fe.test.api.HeaderLR
		 * @class
		 * @hideconstructor
		 * @private
		 */
		var HeaderLR = function (oHeaderBuilder, vHeaderDescription) {
			if (!Utils.isOfType(oHeaderBuilder, FEBuilder)) {
				throw new Error("oHeaderBuilder parameter must be a FEBuilder instance");
			}
			this._sPageId = vHeaderDescription.id;
			return BaseAPI.call(this, oHeaderBuilder, vHeaderDescription);
		};
		HeaderLR.prototype = Object.create(BaseAPI.prototype);
		HeaderLR.prototype.constructor = HeaderLR;

		/**
		 * Helper method to for creating an OverflowToolbarBuilder for the actions of the header title.
		 * Since there´s no stable id for the OverflowToolbar, it´s identified by checking the parent controls and
		 * the Page Id.
		 * @param {string} sPageId The id of page control.
		 * @returns {object} OverflowToolbarBuilder object
		 * @ui5-restricted
		 */
		HeaderLR.prototype.createOverflowToolbarBuilder = function (sPageId) {
			return OverflowToolbarBuilder.create(this.getOpaInstance())
				.hasType("sap.m.OverflowToolbar")
				.has(function (oOverflowToolbar) {
					return (
						oOverflowToolbar.getParent().getMetadata().getName() === "sap.f.DynamicPageTitle" &&
						oOverflowToolbar.getParent().getParent().getMetadata().getName() === "sap.f.DynamicPage" &&
						oOverflowToolbar.getParent().getParent().getId().endsWith(sPageId)
					);
				});
		};

		return HeaderLR;
	}
);

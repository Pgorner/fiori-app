/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./BaseAPI",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/OverflowToolbarBuilder",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder"
	],
	function (BaseAPI, Utils, OverflowToolbarBuilder, OpaBuilder, FEBuilder) {
		"use strict";

		/**
		 * Constructs a new FooterAPI instance.
		 * @param {sap.fe.test.builder.OverflowToolbarBuilder} oOverflowToolbarBuilder The {@link sap.fe.test.builder.OverflowToolbarBuilder} instance used to interact with the UI
		 * @param {string} [vFooterDescription] Description (optional) of the footer bar to be used for logging messages
		 * @returns {sap.fe.test.api.FooterAPI} The new instance
		 * @class
		 * @private
		 */
		var FooterAPI = function (oOverflowToolbarBuilder, vFooterDescription) {
			if (!Utils.isOfType(oOverflowToolbarBuilder, OverflowToolbarBuilder)) {
				throw new Error("oOverflowToolbarBuilder parameter must be a OverflowToolbarBuilder instance");
			}
			return BaseAPI.call(this, oOverflowToolbarBuilder, vFooterDescription);
		};
		FooterAPI.prototype = Object.create(BaseAPI.prototype);
		FooterAPI.prototype.constructor = FooterAPI;

		return FooterAPI;
	}
);

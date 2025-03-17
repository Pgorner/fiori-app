/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseAPI", "sap/fe/test/Utils", "sap/fe/test/builder/KPIBuilder"], function (BaseAPI, Utils, KPIBuilder) {
	"use strict";

	/**
	 * Constructs a new KPICardAPI instance.
	 * @param {sap.fe.test.builder.KPIBuilder} oKPIBuilder The builder instance used to interact with the UI
	 * @returns {sap.fe.test.api.KPICardAPI} The new instance
	 * @alias sap.fe.test.api.TableAPI
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var KPICardAPI = function (oKPIBuilder) {
		if (!Utils.isOfType(oKPIBuilder, KPIBuilder)) {
			throw new Error("oKPIBuilder parameter must be an KPIBuilder instance");
		}
		return BaseAPI.call(this, oKPIBuilder);
	};
	KPICardAPI.prototype = Object.create(BaseAPI.prototype);
	KPICardAPI.prototype.constructor = KPICardAPI;

	return KPICardAPI;
});

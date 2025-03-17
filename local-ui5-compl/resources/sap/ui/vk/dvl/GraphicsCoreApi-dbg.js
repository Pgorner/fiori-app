/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.dvl.GraphicsCoreApi.
sap.ui.define([
	"sap/ui/base/DataType"
], function(
	DataType
) {
	"use strict";

	/**
	 * The types of APIs supported by the {@link sap.ui.vk.dvl.GraphicsCore} class.
	 *
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.dvl.GraphicsCoreApi
	 * @public
	 * @deprecated Since version 1.72.0. DVL namespace will be removed in future. This object does not have replacement.
	 */
	var GraphicsCoreApi = {
		/**
		 * The legacy DVL API implemented in the com.sap.ve.dvl library (dvl.js).
		 * @public
		 */
		LegacyDvl: "LegacyDvl"
	};

	DataType.registerEnum("sap.ui.vk.dvl.GraphicsCoreApi", GraphicsCoreApi);

	return GraphicsCoreApi;

}, /* bExport= */ true);

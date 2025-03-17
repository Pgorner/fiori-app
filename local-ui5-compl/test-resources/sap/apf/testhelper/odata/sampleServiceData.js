/*/
 * Copyright(c) 2018 SAP SE
 */
/*global sap */

sap.ui.define([
	"sap/apf/testhelper/odata/injectDatajs",
	"sap/apf/utils/exportToGlobal"
], function(Module, exportToGlobal) {
	'use strict';

	exportToGlobal("sap.apf.testhelper.odata.getSampleServiceData", Module.getSampleServiceData);

	return {
		getSampleServiceData: Module.getSampleServiceData
	};
});

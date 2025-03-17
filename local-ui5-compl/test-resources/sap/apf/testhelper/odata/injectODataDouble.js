/*/
 * Created on 29.12.2018.
 * Copyright(c) 2018 SAP SE
 */
/*global sap */

sap.ui.define([
	'sap/apf/testhelper/odata/injectDatajs',
	'sap/apf/utils/exportToGlobal'
], function(Module, exportToGlobal) {
	'use strict';

	exportToGlobal("sap.apf.testhelper.odata.injectODataDouble", Module.injectODataDouble);

	return {
		injectODataDouble: Module.injectODataDouble
	};
});

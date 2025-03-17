/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/apf/testhelper/interfaces/IfUiInstance',
	'sap/apf/utils/utils',
	'sap/base/Log'
], function(IfUiInstance, utils, Log){
	'use strict';

	/**
	 * @description Constructor. Creates as less as possible. The App may be an empty object when sap.m.App is undefined.
	 * @param oInject injected module references
	 */
	var UiInstance = function(oInject) {
		this.createApplicationLayout = function() {
			return new Promise(function(resolve) {
				sap.ui.require([
					"sap/m/App"
				], function(App) {
					resolve(new App());
				}, function() {
					Log.info("sap.m.App could not be loaded, using dummy app");
					resolve({});
				});
			});
		};

		this.handleStartup = function() {
			return utils.createPromise();
		};
	};

	UiInstance.prototype = new IfUiInstance();
	UiInstance.prototype.constructor = UiInstance;

	UiInstance.prototype.selectionChanged = function() {};

	return UiInstance;
}, true /* global_export*/);

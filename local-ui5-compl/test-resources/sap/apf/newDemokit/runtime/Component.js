/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap */

sap.ui.define('sap.apf.newDemokit.runtime.Component', [
		'sap/apf/demokit/mockserver',
		'sap/apf/base/Component',
		'sap/apf/demokit/configuration/demokit',
		'sap/apf/demokit/configuration/demokitHierarchy',
		'sap/apf/demokit/configuration/demokitSFB',
		'sap/ui/thirdparty/jquery'
	],
	function(MockServer, BaseComponent, StandardConfig, SFBConfig, HierarchyConfig, jQuery) {
		'use strict';

		var _mockServer = new MockServer(sap.ui.require.toUrl("sap/apf/demokit/"));

		BaseComponent.extend("sap.apf.newDemokit.runtime.Component", {
			oApi: null,
			metadata: {
				"manifest": "json"
			},
			/**
			 * Initialize the application
			 */
			init: function() {
				// TODO use a different place for this flag, jQuery.sap is deprecated
				jQuery.sap.log.apfTrace = new URLSearchParams(window.location.search).get("sap-apf-trace") || undefined; // enable for demokit only
				_mockServer.mockRuntimeService([StandardConfig, SFBConfig, HierarchyConfig]);
				_mockServer.mockDemokitService();
				_mockServer.mockHierarchyService();
				BaseComponent.prototype.init.apply(this, arguments);
			},
			/**
			 * Creates the application layout and returns the outer layout of APF
			 * @returns
			 */
			createContent: function() {
				return BaseComponent.prototype.createContent.apply(this, arguments);
			},
			destroy: function() {
				BaseComponent.prototype.destroy.apply(this, arguments);
			}
		});
	});

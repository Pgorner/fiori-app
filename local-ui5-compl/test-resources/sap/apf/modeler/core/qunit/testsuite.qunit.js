sap.ui.define(function() {
	"use strict";

	return {
		name: "apf.modeler TestSuite",
		defaults: {
			loader: {
				paths: {
					"sap/apf/integration": "test-resources/sap/apf/integration/",
					"sap/apf/testhelper": "test-resources/sap/apf/testhelper/"
				}
			},
			qunit: {
				version: 2
			},
			sinon: {
				version: 1,
				qunitBridge: true,
				useFakeTimer: false
			},
			bootCore: true,
			module: "test-resources/sap/apf/modeler/{name}.qunit",
			page: "test-resources/sap/apf/modeler/{name}.qunit.html"
		},
		tests: {
			"tComponent": {
				ui5: {
					libs: "sap.m,sap.ui.comp,sap.viz,sap.ui.layout"
				}
			},
			"core/tApplicationHandler": {
				title: "Application Handler"
			},
			"core/tConfigurationEditor": {
				title: "Configuration Editor"
			},
			"core/tConfigurationHandler": {
				title: "Configuration Handler"
			},
			"core/tConfigurationObjects": {
				title: "Configuration objects"
			},
			"core/tFacetFilter": {
				title: "Facet Filter"
			},
			"core/tHierarchicalStep": {
				title: "Hierarchical Step"
			},
			"core/tInstance": {
				title: "Modeler Core Instance"
			},
			"core/tLazyLoader": {
				title: "Lazy Loader"
			},
			"core/tNavigationTarget": {
				title: "Navigation Target"
			},
			"core/tRepresentation": {
				title: "Representation"
			},
			"core/tSmartFilterBar": {
				title: "SmartFilterBar"
			},
			"core/tStep": {
				title: "Step"
			},
			"core/tTextHandler": {
				title: "Handling of modeler internal texts"
			},
			"core/tTextPool": {
				title: "TextPool"
			}
		}
	};
});

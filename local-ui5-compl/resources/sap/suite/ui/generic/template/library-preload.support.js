//@ui5-bundle sap/suite/ui/generic/template/library-preload.support.js
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
/**
 * Adds support rules to the core - right now commented out, to activate it you need to remove the underscore
 */
sap.ui.predefine("sap/suite/ui/generic/template/library.support", [	"./support/SupportAssistant/Config.support",
				"./support/SupportAssistant/Runtime.support"],
	function(ConfigSupport, RuntimeSupport) {
	"use strict";


	return {

		name: "sap.suite.ui.generic.template",
		niceName: "Fiori Element Library",
		ruleset: [
			ConfigSupport,
			RuntimeSupport
		]
	};

}, true);
//# sourceMappingURL=library-preload.support.js.map

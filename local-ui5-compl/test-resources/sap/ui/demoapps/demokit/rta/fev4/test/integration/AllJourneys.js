sap.ui.define([
	"sap/ui/test/Opa5",
	"./pages/Common",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Action",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Assertion",
	"sap/ui/demoapps/rta/test/integration/pages/Shared",
	"sap/ui/demoapps/rta/test/integration/pages/IFrame",
	"sap/ui/rta/test/integration/pages/Adaptation",
	"test-resources/sap/ui/fl/testutils/opa/TestLibrary",
	"test-resources/sap/ui/mdc/testutils/opa/TestLibrary"
], function(Opa5, Common, Action, Assertion) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "sap.ui.demoapps.rta.fev4.ext.view.",
		autoWait: true,
		asyncPolling: true,
		timeout: 180,
		disableHistoryOverride: true // Required to prevent double history entries
	});
});

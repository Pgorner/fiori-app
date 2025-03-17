sap.ui.define([
	"sap/ui/test/Opa5",
	"./pages/Common",
	"sap/ui/demoapps/rta/test/integration/pages/Shared",
	"sap/ui/demoapps/rta/test/integration/pages/IFrame",
	"sap/ui/rta/test/integration/pages/Adaptation"
], function(Opa5, Common) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.demoapps.rta.fe.ext.view.",
		autoWait: true,
		asyncPolling: true,
		timeout: 30,
		disableHistoryOverride: true // Required to prevent double history entries
	});
});

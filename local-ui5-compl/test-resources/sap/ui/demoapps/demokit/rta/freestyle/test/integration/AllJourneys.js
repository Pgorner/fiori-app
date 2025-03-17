sap.ui.define([
	"sap/ui/test/Opa5",
	"./pages/Common",
	"./pages/Browser",
	"./pages/Master",
	"./pages/NotFound",
	"./pages/ProductMaster",
	"./pages/ProductDisplay",
	"./journeys/ProductMasterJourney",
	"./journeys/NotFoundJourney",
	"./journeys/ChangeVisualizationJourney",
	"./journeys/IFrameJourney",
	"./journeys/RTAJourney",
	"sap/ui/demoapps/rta/test/integration/pages/IFrame",
	"sap/ui/demoapps/rta/test/integration/pages/Shared"
], function(Opa5, Common) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.demoapps.rta.freestyle.view.",
		autoWait: true,
		asyncPolling: true,
		timeout: 90,
		disableHistoryOverride: true // Required to prevent double history entries
	});
});

sap.ui.define([
	"sap/ui/test/Opa5",
	"./../pages/Common",
	"./../pages/NotFound",
	"./../pages/ProductDisplay",
	"./../pages/Master",
	"./../pages/Browser",
	"./NotFoundJourney"
], function(Opa5, Common) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.demoapps.rta.freestyle.view.",
		autoWait: true,
		asyncPolling: true,
		timeout: 90
	});
});

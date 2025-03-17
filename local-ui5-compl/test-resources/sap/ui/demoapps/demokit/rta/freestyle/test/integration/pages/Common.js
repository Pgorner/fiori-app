sap.ui.define([
	"sap/ui/demoapps/rta/test/integration/pages/Common",
	"sap/ui/demoapps/rta/test/integration/pages/Shared",
	"sap/ui/rta/test/integration/pages/Adaptation"
], function(
	Common
) {
	"use strict";

	return Common.extend("sap.ui.demoapps.rta.freestyle.test.integration.pages.Common", {
		constructor: function () {
			this.sUrl = "sap/ui/demoapps/rta/freestyle/test/flpSandbox";
			this.sUrlHashPrefix = "#masterDetail-display";
			this.sMockserverPath = "sap/ui/demoapps/rta/freestyle/localService/mockserver";
			Common.apply(this, arguments);
		}
	});
});

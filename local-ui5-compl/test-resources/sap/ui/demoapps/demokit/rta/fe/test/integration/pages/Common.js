sap.ui.define([
	"sap/ui/demoapps/rta/test/integration/pages/Common"
], function(
	Common
) {
	"use strict";

	return Common.extend("sap.ui.demoapps.rta.fe.test.integration.pages.Common", {

		constructor: function () {
			this.sUrl = "sap/ui/demoapps/rta/fe/test/index";
			this.sUrlHashPrefix = "#masterDetail-display";
			this.sMockserverPath = "sap/ui/demoapps/rta/fe/localService/mockserver";
			Common.apply(this, arguments);
		}
	});
});
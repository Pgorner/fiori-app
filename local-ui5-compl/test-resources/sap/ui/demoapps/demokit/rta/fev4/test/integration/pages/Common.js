sap.ui.define([
	"sap/ui/demoapps/rta/test/integration/pages/Common"
], function(
	Common
) {
	"use strict";

	return Common.extend("sap.ui.demoapps.rta.fev4.test.integration.pages.Common", {

		constructor: function () {
			this.sUrl = "sap/ui/demoapps/rta/fev4/test/index";
			this.sUrlHashPrefix = "#product-display";
			Common.apply(this, arguments);
		}
	});
});
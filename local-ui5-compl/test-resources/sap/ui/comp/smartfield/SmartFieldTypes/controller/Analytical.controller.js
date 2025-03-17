sap.ui.define([
	'test/sap/ui/comp/smartfield/SmartFieldTypes/controller/BaseController'
], function(BaseController) {
	"use strict";

	return BaseController.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.controller.Analytical", {
		onInit: function() {
			this.oDetail = this.byId("detail");
			this.oRequests = this.byId("requests");

			this.setModelAndBindings("Analytical");
			this.registerRequestsLogging(this.oRequests, this.oEvents);
		}
	});
});
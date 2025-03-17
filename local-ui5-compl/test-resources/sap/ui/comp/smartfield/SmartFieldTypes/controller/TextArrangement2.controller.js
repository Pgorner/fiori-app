sap.ui.define([
	'test/sap/ui/comp/smartfield/SmartFieldTypes/controller/BaseController'
], function(BaseController) {
	"use strict";

	return BaseController.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.controller.TextArrangement2", {
		onInit: function() {
			this.oDetail = this.byId("detail");

			this.setModelAndBindings("TextArrangement2");
		}
	});
});
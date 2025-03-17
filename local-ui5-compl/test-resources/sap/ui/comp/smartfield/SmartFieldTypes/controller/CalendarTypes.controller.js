sap.ui.define([
	'test/sap/ui/comp/smartfield/SmartFieldTypes/controller/BaseController'
], function(BaseController) {
	"use strict";

	return BaseController.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.controller.CalendarTypes", {
		onInit: function() {
			this.oDetail = this.byId("detail");
			this.setModelAndBindings("CalendarTypes");
		}
	});
});
sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageToast"], function (ControllerExtension, MessageToast) {
	"use strict";
	return ControllerExtension.extend("sap.fe.core.fpmExplorer.customSectionContent.extendOP", {
		// this section allows to extend lifecycle hooks or override public methods of the base controller
		override: {
			routing: {
				onAfterBinding: function (oBindingContext, mParameters) {
					MessageToast.show("Context bound !!!");
				}
			}
		}
	});
});

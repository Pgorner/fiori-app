sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	
	// Controller of the EmptyPage view
	return Controller.extend("sap.suite.ui.generic.template.fragments.MessagePage", {
		onInit: function() {
			this.oView = this.getView();
		},
		onBeforeRendering: function () {
			// Note: The additional content array may contain any control like Button, Text etc.
			// That can't be handled dynamically in the template file (MessagePage.view.xml) as we don't know the control type.
			// Hence, kept the logic of adding additional controls in the controller file.
			var oIllustratedMessage = this.oView.byId("messagePage");
			var aAdditionalContent = this.oView.getModel("_templPrivGlobal").getProperty("/generic/messagePage/additionalContent");
			// If additional content found on the model, add them to the illustrated message (message page)
			if (aAdditionalContent && Array.isArray(aAdditionalContent)) {
				aAdditionalContent.forEach(function (oControl) {
					oIllustratedMessage.addAdditionalContent(oControl);
				});
			}
		},
		navButtonPress: function() {
			window.history.back();
		}
	});
});
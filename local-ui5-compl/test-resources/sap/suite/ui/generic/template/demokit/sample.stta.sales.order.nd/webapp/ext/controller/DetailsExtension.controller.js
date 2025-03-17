sap.ui.define("STTA_SO_ND.ext.controller.DetailsExtension", [
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (MessageToast, MessageBox) {
	"use strict";

	return {
		beforeDeleteExtension: function () {
			//simple way to change the delete dialog text
			var sContext = this.getView().getBindingContext().getPath();
			var oMessageText = {
				text: "My Text",
				title: "My Title (Breakout)"
			};
			return (oMessageText);
		},
		onInit: function () {
			if (this.extensionAPI && this.extensionAPI.attachPageDataLoaded) {
				this.extensionAPI.attachPageDataLoaded(this.onPageDataLoadedExtension);
			}
		},
		onPageDataLoadedExtension: function (oEvent) {
			// This extension is called in case of create and when navigating to Object Page
			// We need a better example here
			MessageToast.show("attachPageDataLoaded extension example");
		},
		fnOPEditExtButton: function() {
			MessageBox.success("Custom Edit Action triggered", {});
		},
		fnOPDeleteExtButton: function() {
			MessageBox.success("Custom Delete Action triggered", {});
		},
		fnOPSaveExtButton: function() {
			MessageBox.success("Custom Save Action triggered", {});
		},
		fnOPTblDeleteExtButton: function() {
			MessageBox.success("Custom Delete Table Action triggered", {});
		},
		fnOPTblCreateExtButton: function() {
			MessageBox.success("Custom Create Table Action triggered", {});
		}

	};
});

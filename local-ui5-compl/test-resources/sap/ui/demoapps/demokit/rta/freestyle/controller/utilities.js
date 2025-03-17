sap.ui.define([
	"sap/m/library",
	"sap/m/MessageBox",
	"../util/controls"
], function(mobileLibrary, MessageBox, controls) {
	"use strict";

	// class providing static utility methods.

	var sNullUUID = "00000000-0000-0000-0000-000000000000";

	return {
		// To create a new product it is necessary to supply a null UUID
		getNullUUID: function() {
			return sNullUUID;
		},

		isDraftClean: function(oAdminData) {
			return oAdminData.CreationDateTime.getTime() === oAdminData.LastChangeDateTime.getTime();
		},

		sendEmailForProduct: function(oResourceBundle, sProductName, sProductId, sProductDescription, sSupplierName) {
			var sSubject = oResourceBundle.getText("xtit.emailSubject", [sProductName || sProductId]),
				sContent = sProductDescription ? oResourceBundle.getText("xtit.emailContent", [sProductId, sProductDescription, sSupplierName]) : "";
			mobileLibrary.URLHelper.triggerEmail(null, sSubject, sContent);
		},

		showDeleteMessage: function(oResourceBundle, sUser, sProductName, fnOnclose, bUnsavedChanges) {

			var sTitle = bUnsavedChanges ? oResourceBundle.getText("ymsg.deleteUnsavedText", sUser) : oResourceBundle.getText("ymsg.deleteText", [
				sProductName
			]);
			MessageBox.warning(
				sTitle, {
					icon: MessageBox.Icon.WARNING,
					title: oResourceBundle.getText("xtit.delete"),
					styleClass: controls.getContentDensityClass(),
					actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
					onClose: fnOnclose
				}
			);
		},

		showEditUnchangedMessage: function(oResourceBundle, sUser, fnOnclose) {

			var sTitle = oResourceBundle.getText("ymsg.takeoverUnsavedChanges", sUser);
			MessageBox.warning(
				sTitle, {
					icon: MessageBox.Icon.WARNING,
					title: oResourceBundle.getText("xtit.warning"),
					styleClass: controls.getContentDensityClass(),
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: fnOnclose
				}
			);
		}

	};
});

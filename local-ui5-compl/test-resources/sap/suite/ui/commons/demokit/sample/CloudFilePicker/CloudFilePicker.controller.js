sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/suite/ui/commons/CloudFilePicker",
	"sap/suite/ui/commons/mockserver/mockServer",
    "sap/ui/core/Element"
], function (Controller, MessageToast, CloudFilePicker, MockServer, Element) {
	"use strict";

	var sServiceUrl = "/sap/opu/odata4/sap/ui_cmis_myfiles_04/srvd/sap/cmis_myfiles/0001/?sap-client=325";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.CloudFilePicker.CloudFilePicker", {
		onInit: function () {
			var oMockServer = new MockServer();
			oMockServer.init();
		},
		onPress: function (oEvent) {
			// Open the Popup Dialogue of Cloud Picker Instance
			var oResultTextArea = Element.getElementById("__xmlview0--resultTextArea");
			oResultTextArea.setValue("");
			var oCloudFilePicker = new CloudFilePicker({
				id: "sample-demokit-cloudfilepicker",
				serviceUrl: sServiceUrl,
				confirmButtonText: "Export",
				filePickerMode: "All",
				suggestedFileName: "SalesOrder.xlsx",
				enableNewFolderCreation: false,
				select: function (oEvent) {
					var fileName = oEvent.getParameters().selectedFileName;
					MessageToast.show(fileName + " Exported");
				},
				cancel: function (oEvent) {
					MessageToast.show("Cancel invoked");
				}
			});
			// Only For Demo Purpose setting earlyRequests as false
			var oModel = new sap.ui.model.odata.v4.ODataModel({
				serviceUrl: oCloudFilePicker.getContent()[0].getModel().sServiceUrl,
				earlyRequests: false
			});
			oCloudFilePicker.setModel(oModel);
			var oTableControl = oCloudFilePicker.getContent()[0].getFlexContent().getContent()[0];
			oTableControl.attachEvent('itemPress', function (oEvent) {
				sap.ui.getCore().byId("sample-demokit-cloudfilepicker").getContent()[0].getFixContent()[1].getLinks().forEach(function(oLink) {
					oLink.setEnabled(false);
				});
			});
			oCloudFilePicker.open();
		},
		_getMessage: function(mParameters) {
            var oSelectedFolder = mParameters.selectedFolder;

            var sMessage = "SELECTED FOLDER: \n\n";
            sMessage += this._toString(oSelectedFolder);
            sMessage += "\n*************************************************************************************************\n\n";

            sMessage += "Selected File Name: " + mParameters.selectedFileName + "\n";
            sMessage += "Replace Existing File: " + mParameters.replaceExistingFile + "\n";
            sMessage += "\n*************************************************************************************************\n\n";

            sMessage += "SELECTED FILES: \n";
            mParameters.selectedFiles.forEach(function(oSelectedFile) {
                sMessage += this._toString(oSelectedFile) + "\n";
            }.bind(this));

            return sMessage;
        },

        _toString: function(oSelectedItem) {
            var sMessage = "File Share Name: " + oSelectedItem.getFileShareItemName() + "\n";
            sMessage += "File Share Id: " + oSelectedItem.getFileShareId() + "\n";
            sMessage += "File Share ItemId: " + oSelectedItem.getFileShareItemId() + "\n";
            sMessage += "Parent File Share ItemId: " + oSelectedItem.getParentFileShareItemId() + "\n";
            sMessage += "Is Folder: " + oSelectedItem.getIsFolder() + "\n";
            sMessage += "Created By User: " + oSelectedItem.getCreatedByUser() + "\n";
            sMessage += "Creation Date Time: " + oSelectedItem.getCreationDateTime() + "\n";
            sMessage += "LastChanged By User: " + oSelectedItem.getLastChangedByUser() + "\n";
            sMessage += "LastChange Date Time: " + oSelectedItem.getLastChangeDateTime() + "\n";
            sMessage += "File Share Item Content: " + oSelectedItem.getFileShareItemContent() + "\n";
            sMessage += "File Share Item Content Type: " + oSelectedItem.getFileShareItemContentType() + "\n";
            sMessage += "File Share Item Content Size: " + oSelectedItem.getFileShareItemContentSize() + "\n";
            sMessage += "File Share Item Content Link: " + oSelectedItem.getFileShareItemContentLink() + "\n";

            return sMessage;
        }



	});

	return oPageController;
});

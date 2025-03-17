sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/comp/sample/smarttable/mockserver/DemoMockServer',
	'sap/ui/core/IconPool',
	'sap/ui/model/json/JSONModel',
	'sap/m/Bar',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Link',
	'sap/m/MessageItem',
	'sap/m/MessageView',
	'sap/m/Title'
], function (Controller, ODataModel, DemoMockServer, IconPool, JSONModel, Bar, Button, Dialog, Link, MessageItem, MessageView, Title) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.tablePasteEvent.SmartTable", {
		onInit: function () {
			var oModel, oView;

			this._oMockServer = new DemoMockServer();

			oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});

			oView = this.getView();
			oView.setModel(oModel);
		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");
			// GW export
			if (mExcelSettings.url) {
				return;
			}
			// For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

			// Disable Worker as Mockserver is used in Demokit sample --> Do not use this for real applications!
			mExcelSettings.worker = false;
		},

		onPaste: function(oEvent) {
			var oResult = oEvent.getParameter("result");
			var oModel = new JSONModel();
			var oMessageTemplate;

			if (oResult.errors) {
				oMessageTemplate = new MessageItem({
					type: 'Error',
					title: 'row: {row}, column: {column}',
					subtitle: 'Property: {property}',
					description: '{message}'
				});
				oModel.setData(oResult.errors);
			} else {
				var sDescription = "";
				Object.keys(oResult.parsedData[0]).forEach(function(key) {
					sDescription += key + ": {" + key + "}\r\n";
				});
				oMessageTemplate = new MessageItem({
					type: 'Information',
					title: 'Pasted Row',
					description: sDescription
				});
				oModel.setData(oResult.parsedData);
			}

			var oBackButton;
			var oMessageView = new MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "/",
					template: oMessageTemplate
				}
			});
			oMessageView.setModel(oModel);

			oBackButton = new Button({
				icon: IconPool.getIconURI("nav-back"),
				visible: false,
				press: function () {
					oMessageView.navigateBack();
					this.setVisible(false);
				}
			});

			this.oDialog = new Dialog({
				resizable: true,
				content: oMessageView,
				state: oResult.errors ? 'Error' : 'Success',
				beginButton: new Button({
					press: function () {
						this.getParent().close();
					},
					text: "Close"
				}),
				customHeader: new Bar({
					contentLeft: [oBackButton],
					contentMiddle: [
						new Title({
							text: oResult.errors ? "Parsing Errors" : "Data pasted successfully",
							level: "H1"
						})
					]
				}),
				contentHeight: "50%",
				contentWidth: "50%",
				verticalScrolling: false,
				afterClose: function () {
					this.destroy();
				}
			});

			oMessageView.navigateBack();
			this.oDialog.open();
		},

		onExit: function () {
			this._oMockServer.destroy(this.getView());
			if (this.oDialog) {
				this.oDialog.destroy();
			}
		}
	});
});

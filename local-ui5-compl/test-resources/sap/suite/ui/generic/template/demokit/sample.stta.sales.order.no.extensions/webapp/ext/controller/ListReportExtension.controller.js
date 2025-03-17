sap.ui.define("SOwoExt.ext.controller.ListReportExtension", ["sap/base/Log", "sap/m/Dialog", "sap/m/Text", "sap/m/Button", "sap/m/MessageBox"
], function (Log, Dialog, Text, Button, MessageBox) {
	"use strict";
	var oListReportResourceBundle;
	return {
		showSingleMessage: function (oEvent) {
			var sPrefix = "showSingleMessage-";
			var oTable = oEvent.getSource().getParent().getParent().getParent().getTable();
			var oExtensionAPI = this.extensionAPI;
			var aContext = oExtensionAPI.getSelectedContexts(oTable);
			var oContext = aContext[0];
			var oObject = oContext.getObject();
			var mParameters = {
				"SalesOrder": oObject.SalesOrder,
				"DraftUUID": oObject.DraftUUID,
				"IsActiveEntity": oObject.IsActiveEntity
			};
			var oParameterDialog = new Dialog({
				title: "Show the difference...",
				content: [
					new Text({
						text: "...between 2 methods. Check the console and filter for '" + sPrefix + "'. \n\n 'Invoke action' does not show a busy indicator or messages returned from backend. \n\n"
					}),
					new Button({
						text: "invoke Action",
						press: function () {
							//invoke action example - base for secured execution - the returned message is NOT shown on the UI
							var oPromise = oExtensionAPI.invokeActions("STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Showsinglemsg", [], mParameters);
							oPromise.then(function (aResponse) {
								// "Stuff worked!" - resolve case
								var sMessage = aResponse["0"].response.response.headers["sap-message"];
								var oMessage = JSON.parse(sMessage);
								Log.error(sPrefix + "resolve: " + oMessage.message);
							}, function (aResponse) {
								Log.error(sPrefix + "reject"); // Error: "It broke" - reject case
							});
							oParameterDialog.close();
						}
					}),
					new Button({
						text: "secured Execution",
						press: function () {
							//same action method via secured execution - the returned message is NOW shown on the UI
							var fnFunction = function () {
								return oExtensionAPI.invokeActions("STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Showsinglemsg", [], mParameters);
							};
							var mParametersForSecuredExecution = {
								"sActionLabel": "Your App specific title"
								/*"busy" : true*/
								//see here the possible parameters: ListReport.extensionAPI.ExtensionAPI/methods/securedExecution
							};
							var oPromise = oExtensionAPI.securedExecution(fnFunction, mParametersForSecuredExecution);
							oPromise.then(function (aResponse) { // "Stuff worked!" - resolve case
								Log.error(sPrefix + "resolve");
							}, function (aResponse) {
								Log.error(sPrefix + "reject"); // Error: "It broke" - reject case
							});
							oParameterDialog.close();
						}
					})
				],
				endButton: new Button({
					text: "Cancel",
					press: function () {
						oParameterDialog.close();
					}
				}),
				afterClose: function () {
					oParameterDialog.destroy();
				}
			});
			oParameterDialog.open();
		},
		beforeSmartLinkPopoverOpensExtension: function (oParams) {
			var oSourceInfo = oParams.getSourceInfo(),
				oColumn = oSourceInfo.column,
				sColumnKey = oColumn && oColumn.data("p13nData") && oColumn.data("p13nData").columnKey;
			
			if (sColumnKey === "BusinessPartnerID_ext") {
				return true;
			}	
			return false;
		},
		getTextFromResourceBundle: function (sKey) {
			if (!oListReportResourceBundle) {
				oListReportResourceBundle = this.getView().getModel("i18n|sap.suite.ui.generic.template.ListReport|C_STTA_SalesOrder_WD_20").getResourceBundle();
			}
			return oListReportResourceBundle.getText(sKey);
		},
		onBusinessPartnerExtLinkPress: function (oEvent) {
			var sConfirmationTitle = this.getTextFromResourceBundle("BUSINESS_PARTNER_NAV_CONFIRM_TITLE"),
				sConfirmationMessage = this.getTextFromResourceBundle("BUSINESS_PARTNER_NAV_CONFIRM_MESSAGE"),
				oSmartLink = oEvent.getSource();
			
			MessageBox.show(sConfirmationMessage, {
				title: sConfirmationTitle,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this.navigateToBusinessPartnerFactSheet(oSmartLink);
					}
				}.bind(this)
			});
		},
		navigateToBusinessPartnerFactSheet: function (oSmartLink) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oBindingContext = oSmartLink.getBindingContext();
			var oObject = oBindingContext.getObject();

			oNavigationController.navigateExternal("BusinessPartnerNavigation", {
				BusinessPartnerID: oObject.BusinessPartnerID
			});
		}
	};
});

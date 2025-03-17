sap.ui.define("ManageSalesOrderWithTableTabs.ext.controller.ListReportExtension", [
	"sap/m/ComboBox",
	"sap/ui/model/Filter",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/core/message/MessageType"
], function(ComboBox, Filter, SmartFilterBar, MessageType) {
	"use strict";

	return {
		modifyStartupExtension: function(oStartupObject) {
			oStartupObject.selectedQuickVariantSelectionKey = "1";
			oStartupObject.selectionVariant.addSelectOption("GrossAmount","I","LT","15000");
		},	
		onBeforeRebindTableExtension: function(oEvent) {
		//debugger;
		// usually the value of the custom field should have an
		// effect on the selected data in the table. So this is
		// the place to add a binding parameter depending on the
		// value in the custom field.
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.parameters = oBindingParams.parameters || {};
			
			var oSmartFilterBar = this.byId("listReportFilter");
			if (oSmartFilterBar instanceof SmartFilterBar) {
				var oCustomControl = this.byId("CustomFilter-Price-combobox");
				if (oCustomControl instanceof ComboBox) {
					var vCategory = oCustomControl.getSelectedKey();
					switch (vCategory) {
						case "0" :
							oBindingParams.filters.push(new Filter("GrossAmount", "LT", "10000"));
							break;
						case "1" :
							oBindingParams.filters.push(new Filter("GrossAmount", "GE", "10000"));
							break;
						default :
							break;
					}
				}
			}
			var oMsg = {
				message: "custom message above list report tab 1",
				type: MessageType.Information
			}
			this.extensionAPI.setCustomMessage(oMsg, "1");

			var oMsg1 = {
				message: "custom message above list report tab 2",
				type: MessageType.Error
			}
			this.extensionAPI.setCustomMessage(oMsg1, "2");

			var oMsg2 = {
				message: "custom message above list report tab 3",
				type: MessageType.Success
			}
			this.extensionAPI.setCustomMessage(oMsg2, "3");
		}

	};
});

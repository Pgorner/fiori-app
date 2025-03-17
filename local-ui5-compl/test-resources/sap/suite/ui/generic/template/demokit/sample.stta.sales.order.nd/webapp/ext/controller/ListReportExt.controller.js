sap.ui.define("STTA_SO_ND.ext.controller.ListReportExt", [
	"sap/m/MessageBox",
	"sap/ui/core/message/MessageType",
	"sap/ui/core/Element"
], function (
	MessageBox,
	MessageType,
	Element
) {
	"use strict";
	 function getRandomNumber() {
		 var arr = new Uint32Array( 1 ), limit = Math.pow( 2, 32 );
		 var crypto = window.crypto || window.msCrypto;
		 return crypto.getRandomValues( arr )[ 0 ] / limit;
	};

	return {
		onClickActionNavigationButton: function (oEvent) {
			var UShellContainer = sap.ui.require("sap/ushell/Container");	
			var oNavigationPromise = UShellContainer
				&& UShellContainer.getServiceAsync("Navigation");
			
			oNavigationPromise.then(function(oNavigation) {
				oNavigation.navigate({
					target: {
						semanticObject: "SalesOrder",
						action: "MultiViews"
					},
					params: {
						mode: 'create'
					}
				});
			});
		},
		fnLRCreateExtButton: function () {
			MessageBox.success("Custom Create Action triggered", {});
		},
		fnLRDeleteExtButton: function() {
			MessageBox.success("Custom Delete Action triggered", {});
		},
		onRandomOppID: function (oEvent) {
			var oModel,
				aSelectedContexts = this.extensionAPI.getSelectedContexts();
			for (var i = 0; i < aSelectedContexts.length; i++) {
				oModel = aSelectedContexts[i].getModel();
				oModel.setProperty(aSelectedContexts[i].sPath + "/OpportunityID", (Math.floor(getRandomNumber() * 10000)).toString());
			}
			this.extensionAPI.refreshTable();
		},
		beforeMultiEditSaveExtension: function (aContextsToBeUpdated) {
			var fnResolve, fnReject;
			var oInputField = Element.getElementById("STTA_SO_ND::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_SO_SalesOrder_ND--CustomInput");
			var sVal = oInputField.getValue();
			var oPromise = new Promise(function (resolve, reject) {
				fnResolve = resolve;
				fnReject = reject;
			});
			this.oDialog = new sap.m.Dialog({
				title: "BeforeMultiEditSaveExtension",
				content: new sap.m.Text({
					text: "The value from custom input field is:" + sVal
				}),
				beginButton: new sap.m.Button({
					text: "Close",
					press: function () {
						fnResolve();
						this.oDialog.close();
					}.bind(this)
				}),
			});
			this.getView().addDependent(this.oDialog);
			this.oDialog.open();
			return oPromise;
		},

		getPredefinedValuesForCreateExtension: function (oSmartFilterBar) {
            var oRet = {};
            var oSelectionVariant = oSmartFilterBar.getUiState().getSelectionVariant();
            var aSelectOptions = oSelectionVariant.SelectOptions;
            var fnTransfer = function (sFieldname) {
                for (var i = 0; i < aSelectOptions.length; i++) {
                    var oSelectOption = aSelectOptions[i];
                    if (oSelectOption.PropertyName === sFieldname) {
                        if (oSelectOption.Ranges.length === 1) {
                            var oFilter = oSelectOption.Ranges[0];
                            if (oFilter.Sign === "I" && oFilter.Option === "EQ") {
                                oRet[sFieldname] = oFilter.Low;
                            }
                        }
                        break;
                    }
                }
            };
            fnTransfer("BusinessPartnerID");
			fnTransfer("SalesOrderID");

            return oRet;
        },

		onBeforeRebindTableExtension: function () {
			var oMsg = {
				message: "custom message above list report",
				type: MessageType.Information
			}
			this.extensionAPI.setCustomMessage(oMsg);
		}
	};
});

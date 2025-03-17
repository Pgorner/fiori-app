sap.ui.define("ManageSalesOrderWithSegButtons.ext.controller.DetailsExtension", [
	"sap/m/MessageBox"	
], function (MessageBox) {
	"use strict";

	return {
		onToggleSection: function() {
			var sSectionName = "ManageSalesOrderWithSegButtons::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--ManageSalesOrderWithSegButtons.reuseComponents.tableTest::tableTest::ComponentSection";
			var oSectionObject = sap.ui.getCore().getElementById(sSectionName);
			if(oSectionObject.getVisible()) {
				oSectionObject.setVisible(false);
				MessageBox.success("Product Table Reuse section set hidden", {});
			} else {
				oSectionObject.setVisible(true);
				MessageBox.success("Product Table Reuse section set visible", {});
			}
		},
		onToggleIconTabBar: function() {
			var sObjectLayout = "ManageSalesOrderWithSegButtons::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--objectPage";
			var oLayoutObject = sap.ui.getCore().getElementById(sObjectLayout);
			if (oLayoutObject.getUseIconTabBar()) {
				oLayoutObject.setUseIconTabBar(false);
				MessageBox.success("Icon Tab Bar Mode set to False", {});
			} else {
				oLayoutObject.setUseIconTabBar(true);
				MessageBox.success("Icon Tab Bar Mode set to True", {});
			}
		},
		onSalesOrderInfo: function(){
			var oApi = this.extensionAPI;
			var oNavigationController = oApi.getNavigationController();
			oNavigationController.navigateInternal("", { 
				routeName: "SalesOrderInfo"
			});
		},
		adaptNavigationParameterExtension: function(oSelectionVariant, oObjectInfo) {
			if (oObjectInfo.semanticObject === "SalesOrder" && oObjectInfo.action === "MultiViews")  {
				oSelectionVariant.addParameter("SalesOrderType", "Detail");
			}
		},
		beforeSaveExtension: function () {
			var fnResolve, fnReject;
			var oPromise = new Promise(function (resolve, reject){
				fnResolve = resolve;
				fnReject = reject;
			});
			this.oDialog = new sap.m.Dialog({
				title: "BeforeSaveExtension",
				content: new sap.m.Text({
					text: "This is an exmpale to check the beforeSaveExtension"
				}),
				beginButton: new sap.m.Button({
					text: "Continue to Save",
					press: function () {
						fnResolve();
						this.oDialog.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: "Cancel Save",
					press: function () {
						fnReject();
						this.oDialog.close();
					}.bind(this)
				})
			});
			this.getView().addDependent(this.oDialog);
			this.oDialog.open();
			return oPromise;
		}
	};
});

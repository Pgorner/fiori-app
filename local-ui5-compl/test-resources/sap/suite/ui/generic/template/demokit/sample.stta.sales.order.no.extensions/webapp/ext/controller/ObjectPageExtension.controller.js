sap.ui.define("SOwoExt.ext.controller.ObjectPageExtension", ["sap/m/MessageBox"], function (MessageBox) {
	"use strict";
	var oObjectPageResourceBundle, CustomFieldGroupChangeRegister;
	return {
		beforeSmartLinkPopoverOpensExtension: function (oParams) {
			var oSourceInfo = oParams.getSourceInfo(),
				oColumn = oSourceInfo.column,
				sColumnKey = oColumn && oColumn.data("p13nData") && oColumn.data("p13nData").columnKey;
			
			if (sColumnKey === "ProductId_ext") {
				return true;
			}	
			return false;
		},
		getTextFromResourceBundle: function (sKey) {
			if (!oObjectPageResourceBundle) {
				oObjectPageResourceBundle = this.getView().getModel("i18n|sap.suite.ui.generic.template.ObjectPage|C_STTA_SalesOrder_WD_20").getResourceBundle();
			}
			return oObjectPageResourceBundle.getText(sKey);
		},
		onProductIdExtLinkPress: function (oEvent) {
			var sConfirmationTitle = this.getTextFromResourceBundle("PRODUCT_NAV_CONFIRM_TITLE"),
				sConfirmationMessage = this.getTextFromResourceBundle("PRODUCT_NAV_CONFIRM_MESSAGE"),
				oSmartLink = oEvent.getSource();
			
			MessageBox.show(sConfirmationMessage, {
				title: sConfirmationTitle,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this.navigateToManageProductFactSheet(oSmartLink);
					}
				}.bind(this)
			});
		},
		navigateToManageProductFactSheet: function (oSmartLink) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oBindingContext = oSmartLink.getBindingContext();
			var oObject = oBindingContext.getObject();

			oNavigationController.navigateExternal("ManageProductNavigation", {
				Product: oObject.Product
			});
		},
		focusOnEditExtension: function (sSelectedSection) {
			var oControl = sap.ui.getCore().getControl("SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField");
			return oControl;
		},
		onSelectNotesCheckBox: function(oEvent) {
			var oView = this.getView();
			var model = oView.getModel();
			var context = oView.getBindingContext();
			var sFields = "SrcgProjNotesAreForbidden";
			var data = oEvent.getParameter("selected");
			model.setProperty(context.getPath() + "/" + sFields, data);
			CustomFieldGroupChangeRegister(sFields);
		},
		onAfterRendering: function(event) {
			var oView = this.getView();
			var sEntitySet = "C_STTA_SalesOrder_WD_20";
			var sProperty = "SrcgProjNotesAreForbidden";
			var oControl = sap.ui.getCore().getElementById("SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--srcgProjNotesAreForbiddenCheckBox");
			CustomFieldGroupChangeRegister = this.extensionAPI.registerCustomFieldForSideEffect(oControl, sProperty, sEntitySet);
		}
	};
});

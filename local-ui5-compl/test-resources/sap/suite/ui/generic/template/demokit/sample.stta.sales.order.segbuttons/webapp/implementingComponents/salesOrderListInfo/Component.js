sap.ui.define(["sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"],
	function (UIComponent, ReuseComponentSupport) {
		"use strict";

		/* Definition of the reuse component */
		return UIComponent.extend("ManageSalesOrderWithSegButtons.implementingComponents.salesOrderListInfo.Component", {
			metadata: {
				manifest: "json",
				library: "ManageSalesOrderWithSegButtons.implementingComponents.salesOrderListInfo",
				properties: {
				},
				interfaces: [
					"sap.ui.core.IAsyncContentCreation"
				]
			},

			// Standard life time event of a component. Used to transform this component into a reuse component for smart templates and do some initialization
			init: function () {
				ReuseComponentSupport.mixInto(this, "component");
				// Defensive call of init of the super class:
				(UIComponent.prototype.init || jQuery.noop).apply(this, arguments);
			},

			setSalesOrderIds: function (oExtensionAPI) {
				var oNavigationController = oExtensionAPI.getNavigationController();
				var aKeys = oNavigationController.getCurrentKeys();
				var sSalesOrderIds = aKeys[aKeys.length - 1];
				var oComponentModel = this.getComponentModel();
				oComponentModel.setProperty("/SalesOrderIds", sSalesOrderIds);
				var aSalesOrderIds = sSalesOrderIds.split(",");
				oComponentModel.setProperty("/SalesOrderIdArray", aSalesOrderIds);
			},

			/* Implementation of lifetime events specific for smart template components */
			/* Note that these methods are called because this component has been transformed into a reuse component */
			/* Check jsdoc of sap.suite.ui.generic.template.extensionAPI.ReuseComponentSupport for details */
			stStart: function (oModel, oBindingContext, oExtensionAPI) {
				var oComponentModel = this.getComponentModel();
				oComponentModel.setProperty("/extensionAPI", oExtensionAPI);
				var oCanvasview = oComponentModel.getProperty("/View");
				var oPage = oCanvasview.byId("group");
				var oFCLActionButtons = oExtensionAPI.getFlexibleColumnLayoutActionButtons();
				oPage.addHeaderContent(oFCLActionButtons);
				this.setSalesOrderIds(oExtensionAPI);
			},

			stRefresh: function (oModel, oBindingContext, oExtensionAPI) {
				this.setSalesOrderIds(oExtensionAPI);
			}
			/* End of implementation of lifetime events specific for smart template components */
		});
	});
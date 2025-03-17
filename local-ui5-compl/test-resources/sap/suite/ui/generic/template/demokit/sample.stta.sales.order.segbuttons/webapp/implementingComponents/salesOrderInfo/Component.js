sap.ui.define([	"sap/ui/core/UIComponent",	
				"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"], 
function(UIComponent, ReuseComponentSupport) { "use strict";

	/* Definition of the reuse component */
	return UIComponent.extend("ManageSalesOrderWithSegButtons.implementingComponents.salesOrderInfo.Component", {
		metadata: {
			manifest: "json",
			library: "ManageSalesOrderWithSegButtons.implementingComponents.salesOrderInfo",
			properties: {
				/* Standard properties for reuse components */

				/* UI mode accross fiori applications so the component knows in what mode the application is running 
				 * Defined in sap/suite/ui/generic/template/extensionAPI/UIMode
				 */
				uiMode: {
					type: "string",
					group: "standard"
				}
			},
			interfaces: [
				"sap.ui.core.IAsyncContentCreation"
			]
		},

		// Standard life time event of a component. Used to transform this component into a reuse component for smart templates and do some initialization
		init: function() {
			ReuseComponentSupport.mixInto(this, "component");
			// Defensive call of init of the super class:
			(UIComponent.prototype.init || jQuery.noop).apply(this, arguments);
		},

		/* Implementation of lifetime events specific for smart template components */
		/* Note that these methods are called because this component has been transformed into a reuse component */
		/* Check jsdoc of sap.suite.ui.generic.template.extensionAPI.ReuseComponentSupport for details */
		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/extensionAPI", oExtensionAPI);
			var oCanvasview = oComponentModel.getProperty("/View");
			var oPage = oCanvasview.byId("reuseComponent-salesOrderInfo-group");
		
			var oFCLActionButtons = oExtensionAPI.getFlexibleColumnLayoutActionButtons();
			oPage.addHeaderContent(oFCLActionButtons);
		}
		
		/* End of implementation of lifetime events specific for smart template components */
	});	
});
sap.ui.define([
	'test/sap/ui/comp/smartfield/SmartFieldTypes/controller/BaseController',
	'sap/ui/model/json/JSONModel'
], function(
	BaseController,
	JSONModel
	){
	"use strict";

	return BaseController.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.controller.PageList", {
		onListItemPressed : function(oEvent){
			var oItem = oEvent.getSource(),
				 oBindingContext = oItem.getBindingContext();

			this.getRouter().navTo("pageListItem",{
				pageId : oBindingContext.getProperty("ID")
			});
		},

		onInit: function () {
			//JSON Model is only being used for edit mode
			var oViewModel = new JSONModel({});
			oViewModel.setData({
				listItems: [
					{
						"ID": "types",
						"Name": "1. Misc. types & FieldControl annotation & editable property (String, DateTime, Currency, Decimal, Double, etc.)"
					},
					{
						"ID": "calendarTypes",
						"Name": "2. Calendar types"
					},
					{
						"ID": "inOut",
						"Name": "3. InOut parameters"
					},
					{
						"ID": "textArrangement",
						"Name": "4. TextArrangement with fixed and standard value list"
					},
					{
						"ID": "textArrangement2",
						"Name": "5. TextArrangement with local and SmartForm configuration, Guid, TextOnly"
					},
					{
						"ID": "emptyConstant",
						"Name": "6. ValueList with constant parameters and empty value for keys"
					},
					{
						"ID": "emptyKey",
						"Name": "7. Empty value for keys and Error messages when textInEditModeSource"
					},
					{
						"ID": "importance",
						"Name": "8. SmartForm's importance property"
					},
					{
						"ID": "whitespace",
						"Name": "9. Values with whitespaces for keys"
					},
					{
						"ID": "manyFilters",
						"Name": "10. ValueHelpDialog with many filters"
					},
					{
						"ID": "analytical",
						"Name": "11. Analytical parameters"
					},
					{
						"ID": "nullable",
						"Name": "12. Mandatory fields & Nullable annotation"
					},
					{
						"ID": "fiscalTypes",
						"Name": "13. Fiscal types -  no opa tests"
					},
					{
						"ID": "sortOrder",
						"Name": "14. PresentationVariant annotation - no opa tests"
					},
					{
						"ID": "noSmartContainer",
						"Name": "15. SmartField and SmartLabel used as a standalone without smart container (SmartForm or SmartTable)"
					}
				]
			});
			this.byId("pagesList").setModel(oViewModel);
		}
	});
});
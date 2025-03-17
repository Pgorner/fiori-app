sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/CustomData",
	"sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/common/formatter/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Element",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter"
], function(
	Log,
	Controller,
	CustomData,
	formatter,
	Filter,
	FilterOperator,
	Element,
	Fragment,
	Sorter
) {
	"use strict";

	return Controller.extend("sap.ui.demoapps.rta.fe.lib.reuse.storagebintable.common.view.Default", {
		formatter: formatter,

		onInit: function() {
			this._mDialogs = {};
			this.aMessageFilters = [];
			this.oSBTable = this.oView.byId("storagebintable");
			this.first = true;
		},

		onInputChange: function(oEvt) {
			//delegate the input handling to the component - in case the using app has registered an
			// input handler on the component
			if (typeof this.getOwnerComponent().inputChangeHandler === "function") {
				this.getOwnerComponent().inputChangeHandler(oEvt);
			}
		},

		onAfterRendering: function() {
			// Instance specific designtime metadata to enable personalization for the smart chart in the demo app
			var oSmartChart = Element.getElementById("sap.ui.demoapps.rta.fe::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--ProductSmartChartFacetID::Chart");
			var oCustomData = new CustomData({key:"sap-ui-custom-settings", value: {"sap.ui.dt": {designtime: "sap/ui/demoapps/rta/fe/SmartChart.designtime"}}});
			oSmartChart.addCustomData(oCustomData);
		},

		onSearch: function(oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter({
					filters: [
						new Filter("Bin", FilterOperator.Contains, sQuery),
						new Filter("to_OrganizationalUnit/OrganizationalUnitName", FilterOperator.Contains, sQuery)
					],
					and: false
				});
				aFilters.push(filter);
			}

			// update list binding
			var binding = this.oSBTable.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		onOpenSortDialog: function() {
			var sFullFragmentName = "sap.ui.demoapps.rta.fe.lib.reuse.storagebintable.common.view.SortDialog",
				oDialog = this._mDialogs[sFullFragmentName];
			if (!oDialog) {
				Fragment.load({
					id: this.oView.getId(),
					name: sFullFragmentName,
					controller: this
				}).then(function(oDialogFragment) {
					this._mDialogs[sFullFragmentName] = oDialog = oDialogFragment;
					this.oView.addDependent(oDialog);
					oDialog.setSelectedSortItem("to_OrganizationalUnit/OrganizationalUnitName");
					oDialog.open();
				}.bind(this));
			} else {
				oDialog.open();
			}
		},

		onSortDialogConfirmed: function(oEvent) {
			var mParams = oEvent.getParameters(),
				sSortPath = mParams.sortItem.getKey(),
				oTableBinding = this.byId("storagebintable").getBinding("items");
			if (oTableBinding) {
				oTableBinding.sort(new Sorter(sSortPath, mParams.sortDescending));
			}
		},

		getMessageFilter: function() {
			//The message filters are used by the message model to find the messages that refere to the currently shown entities.
			//Therefore the new binding context has to be known in order to build the correct filters.
			//When getMessageFilter is called the new binding context might not yet be known -> A promise is returned which is
			//resolved when the context ist set (that is when the "change" event of the binding of aggregation "items" is triggered)
			//Please note:
			//1. One filter is added for each entry of the storage bin table. This is necessary because the filter only works with
			//	absolute bindig paths for each entity - relative paths like "/Product("ABC")/to_storageBin" are not allowed.
			//2. Mapping messages to table entries is problematic when e.g. a growing list does not show all items -> not all filters#
			//   can be created or when items of the list can be added or deleted.
			//   In this example such cases can not occur so it is save to provide message filter functionallity
			Log.error("getMessageFilter called");
			return new Promise(function(resolve) {
				var aMsgFilter = [],
					aItems = null;
				var fnOnChange = function() {
					// is called when the binding context changes
					// builds the filters for message filtering as soon as the new context is available
					this.aMessageFilters.length = 0;
					aItems = this.oSBTable.getAggregation("items");
					if (aItems) {
						aItems.forEach(
							function(oListItem) {
								aMsgFilter.push(new Filter({
									path: "target",
									operator: FilterOperator.StartsWith,
									value1: oListItem.getBindingContextPath()
								}));
							});
					}
					resolve(aMsgFilter);
				};
				var oItmBinding = this.oSBTable.getBinding("items");
				oItmBinding.attachEventOnce("change", fnOnChange, this);
			}.bind(this));
		},

		setExtensionAPI: function(oExtensionAPI) {
			this.oExtensionAPI = oExtensionAPI;
		},

		forwardBindingContext: function(oBindingContext) {
			this.oBindingContext = oBindingContext;
		},

		forwardResolveFunction: function(fnResolve){
			this.fnResolve = fnResolve;
		},

		forwardRejectFunction: function(fnReject){
			this.fnReject = fnReject;
		},

		onCheckAvailability:function() {
			var oContext = this.oBindingContext;
			var oExtensionAPI = this.oExtensionAPI;

			var oPreconditionPromise = oExtensionAPI.securedExecution(function(){
				var oInvokePromise = oExtensionAPI.invokeActions("SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductShortage_list", oContext);
				return oInvokePromise;
			});

			oPreconditionPromise.then(this.fnResolve, this.fnReject); //6
		}
	});
});
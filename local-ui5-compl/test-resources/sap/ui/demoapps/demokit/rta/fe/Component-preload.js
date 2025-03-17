//@ui5-bundle sap/ui/demoapps/rta/fe/Component-preload.js
sap.ui.predefine("sap/ui/demoapps/rta/fe/Component", [
	"sap/base/Log",
	"sap/ui/generic/app/AppComponent",
	"sap/ui/demoapps/rta/fe/localService/mockserver",
	"sap/ui/fl/apply/_internal/flexObjects/FlexObjectFactory",
	"sap/ui/fl/write/_internal/Storage",
	"sap/ui/fl/write/api/PersistenceWriteAPI",
	"sap/ui/fl/write/api/VersionsAPI"
], function(
	Log,
	UIComponent,
	mockserver,
	FlexObjectFactory,
	Storage,
	PersistenceWriteAPI,
	VersionsAPI
) {
	"use strict";

	async function setupTestEnvironment(oAppComponent) {
		var oUrl = new URL(window.location.href);
		if (oUrl.searchParams.get("fl--testSetup")) {
			const sLayer = "CUSTOMER";

			// reset needs to have a reload afterwards
			await PersistenceWriteAPI.reset({
				selector: oAppComponent,
				layer: sLayer
			});

			const oVersionsModel = await VersionsAPI.initialize({
				control: oAppComponent,
				layer: sLayer
			});

			const oResponse = await fetch(`${sap.ui.require.toUrl("sap/ui/demoapps/rta/fe")}/userTestSetup.json`);
			const oJson = await oResponse.json();

			// first Version should be two months old, second 1 month and third 1 week
			for (let i = 0; i < oJson.versions.length; i++) {
				const oVersion = oJson.versions[i];
				const oDate = new Date();
				if (i === 0) {
					// 2628288000 = 1 month in milliseconds
					oDate.setTime(oDate.getTime() - 2628288000 * 2);
					oVersion.changes.forEach((oChange) => {
						oChange.creation = oDate.toISOString();
						oDate.setTime(oDate.getTime() + 1);
					});
				} else if (i === 1) {
					oDate.setTime(oDate.getTime() - 2628288000);
					oVersion.changes.forEach((oChange) => {
						oChange.creation = oDate.toISOString();
						oDate.setTime(oDate.getTime() + 1);
					});
				} else if (i === 2) {
					// 604800000 = 1 week in milliseconds
					oDate.setTime(oDate.getTime() - 604800000);
					oVersion.changes.forEach((oChange) => {
						oChange.creation = oDate.toISOString();
						oDate.setTime(oDate.getTime() + 1);
					});
				}

				await PersistenceWriteAPI.add({
					selector: oAppComponent,
					layer: sLayer,
					flexObjects: oVersion.changes.map((c) => FlexObjectFactory.createFromFileContent(c))
				});

				await PersistenceWriteAPI.save({
					selector: oAppComponent,
					layer: sLayer,
					draft: true,
					version: "0"
				});

				await VersionsAPI.activate({
					displayedVersion: "0",
					title: oVersion.title,
					control: oAppComponent,
					layer: sLayer
				});

				// adjust the activation date of the versions to match the changes
				// the private Storage class is used here to avoid creating a new API
				try {
					const oNewVersion = oVersionsModel.getData().versions[0];
					oNewVersion.activatedAt = oDate.toISOString();
					oNewVersion.activatedBy = "Default User";
					// the ObjectStorageConnector uses the fileName to create the key for new objects
					oNewVersion.fileName = oNewVersion.id;
					await Storage.update({
						flexObject: oVersionsModel.getData().versions[0],
						layer: sLayer
					});
				} catch (oError) {
					Log.error("error updating version with activation date", oError);
				}
			}

			oUrl.searchParams.delete("fl--testSetup");
			window.history.replaceState(window.history.state, '', oUrl.href);
			window.location.reload();
		}
	}

	return UIComponent.extend("sap.ui.demoapps.rta.fe.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * Initialize MockServer & FakeLrep in constructor before model is loaded from the manifest.json
		 * @public
		 * @override
		 */
		constructor: function () {
			this._startMockServer();

			UIComponent.prototype.constructor.apply(this, arguments);

			setupTestEnvironment(this);
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function and start the application
			UIComponent.prototype.init.apply(this, arguments);
		},

		/**
		 * Start the MockServer
		 * @private
		 */
		_startMockServer: function () {
			mockserver.init();
		}
	});
});
/*!
 * SAPUI5

(c) Copyright 2009-2024 SAP SE. All rights reserved
 */

// Instance specific designtime metadata to enable personalization for the smart chart in the demo app
sap.ui.predefine("sap/ui/demoapps/rta/fe/SmartChart.designtime", [
	"sap/ui/comp/designtime/smartchart/SmartChart.designtime"
], function(
	SmartChartDesigntime
) {
	"use strict";
	return Object.assign(
		SmartChartDesigntime,
		{
			actions: {
				compVariant: function(oControl) {
					if (
						oControl.isA("sap.ui.comp.smartchart.SmartChart") &&
						oControl.getUseVariantManagement() && oControl.getPersistencyKey() &&
						oControl.getVariantManagement() &&
						oControl.getVariantManagement().isA("sap.ui.comp.smartvariants.SmartVariantManagement") &&
						oControl.getVariantManagement().isVariantAdaptationEnabled()
					) {

						return {
							name: "VIEWSETTINGS_TITLE",
							changeType: "variantContent",
							handler: function(oControl, mPropertyBag) {
								return new Promise(function (resolve) {
									var fCallBack = function(oData) {
										resolve(oData);
									};
									oControl.openDialogForKeyUser(mPropertyBag.styleClass, fCallBack);
								});
							}
						};
					}
			}
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/fe/ext/controller/CustomFilter.controller", [
	"sap/m/Token",
	"sap/m/RatingIndicator",
	"sap/m/MultiInput",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment"
], function(
	Token,
	RatingIndicator,
	MultiInput,
	SmartFilterBar,
	Filter,
	FilterOperator,
	Fragment
) {
	"use strict";

	// This class is the controller of view nw.epm.refapps.products.manage.view.Root, the view hosting the whole app.
	return {

		onInitSmartFilterBarExtension: function(oEvent) {
			// the custom field in the filter bar might have to be bound to a custom data model
			// if a value change in the field shall trigger a follow up action, this method is the place to define and bind an event handler to the field

			this.fnAddTokensFromMultiInput = function() {
				//List of suppliers loaded to the tableSelectDialog
				var oSupplier = this.byId("selectedSuppliers").getItems();
				var oSupplierKey;

				var oFilterSuppliers = this.byId("listReportFilter").getControlByKey("Supplier").getTokens();
				// Remove all selections
				for (var i = 0; i < oSupplier.length; i++) {
					oSupplier[i].setSelected(false);
				}

				if (oFilterSuppliers.length > 0) {
					// Get the keys of the Suppliers in the input field
					for (i = 0; i < oFilterSuppliers.length; i++) {
						oSupplierKey = oFilterSuppliers[i].getProperty("key");
						// Now check find and select the entries in the tableSelectDialog
						for (var j = 0; j < oSupplier.length; j++) {
							if (oSupplierKey === oSupplier[j].getBindingContext().getProperty("Supplier")) {
								oSupplier[j].setSelected(true);
								break;
							}
						}
					}
				}
			};
		},

		// We do not want the export to excel button to be shown
		onInit: function () {
			this.getView().byId("listReport").setEnableExport(false);
		},

		onBeforeRebindTableExtension: function(oEvent) {
			// usually the value of the custom field should have an effect on the selected data in the table.
			// So this is the place to add a binding parameter depending on the value in the custom field.
			var oBindingParams = oEvent.getParameter("bindingParams");
			var oFilter, aFilter = [];
			oBindingParams.parameters = oBindingParams.parameters || {};
			var oSmartTable = oEvent.getSource();
			var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());

			if (oSmartFilterBar instanceof SmartFilterBar) {
				//Custom Supplier filter
				var oCustomControl = oSmartFilterBar.getControlByKey("Supplier");
				if (oCustomControl instanceof MultiInput) {
					aFilter = this._getTokens(oCustomControl, "Supplier");
					if (aFilter.length > 0) {
						oBindingParams.filters.push.apply(oBindingParams.filters, aFilter);
					}
				}
				//Custom rating filter
				oCustomControl = oSmartFilterBar.getControlByKey("to_CollaborativeReview/AverageRatingValue");
				if (oCustomControl instanceof RatingIndicator) {
					oFilter = this._getRatingFilter(oCustomControl);
					if (oFilter) {
						oBindingParams.filters.push(oFilter);
					}
				}
			}
		},

		onCustomSupplierDialogOpen: function() {
			Promise.resolve().then(function() {
				if (!this._oSupplierDialog) {
					return Fragment.load({
						id: this.getView().getId(),
						name: "sap.ui.demoapps.rta.fe.ext.fragment.CustomSupplierFilterSelectDialog",
						controller: this
					});
				} else {
					return this._oSupplierDialog;
				}
			}.bind(this)).then(function(oSupplierDialog) {
				this._oSupplierDialog = oSupplierDialog;
				this._oSupplierDialog.isPopupAdaptationAllowed = function() {
					return false;
				};
				this.getView().addDependent(this._oSupplierDialog);
				this._oSupplierDialog.open();
				this.byId("selectedSuppliers").getBinding("items").attachDataReceived(this.fnAddTokensFromMultiInput, this);
				//Force rebinding to ensure that if tokens are removed from input directly, they will not appear as selected in the
				//tableSelectDialog
				this.byId("selectedSuppliers").getBinding("items").refresh();
			}.bind(this));
		},

		onHandleCustomSupplierDialogSearch: function(oEvent) {
			this.byId("selectedSuppliers").getBinding("items").detachDataReceived(this.fnAddTokensFromMultiInput, this);
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("CompanyName", FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onHandleCustomSupplierTableSelectDialogClose: function(oEvent) {
			// Don't execute event when dataReceived as this is for new loading of suppliers only
			this.byId("selectedSuppliers").getBinding("items").detachDataReceived(this.fnAddTokensFromMultiInput, this);
			var aSelectedContext = oEvent.getParameter("selectedContexts");
			if (aSelectedContext) {
				var oMultiInput = this.getView().byId("Supplier-multiinput");
				var aTokens = [];
				if (aSelectedContext.length) {
					for (var i = 0; i < aSelectedContext.length; i++) {
						var oToken = new Token({
							key: aSelectedContext[i].getObject().Supplier,
							text: aSelectedContext[i].getObject().CompanyName
						});
						aTokens.push(oToken);
					}
				}
				// If no Suppliers have been selected, clear the input field because aTokens is empty
				oMultiInput.setTokens(aTokens);
				oMultiInput.fireChange();
			}
			this.getView().updateBindings();
		},

		getCustomAppStateDataExtension: function(oCustomData) {
			//the content of the custom field shall be stored in the app state, so that it can be restored later again e.g. after a back navigation.
			//The developer has to ensure, that the content of the field is stored in the object that is returned by this method.
			//Example:
			if (oCustomData) {
				var aKeyValues = [],
					oSmartFilterBar = this.byId("listReportFilter");
				if (oSmartFilterBar instanceof SmartFilterBar) {
					var oCustomControl = oSmartFilterBar.getControlByKey("to_CollaborativeReview/AverageRatingValue");
					if (oCustomControl instanceof RatingIndicator) {
						oCustomData.AverageRatingValue = oCustomControl.getValue();
					}
					oCustomControl = oSmartFilterBar.getControlByKey("Supplier");
					if (oCustomControl instanceof MultiInput) {
						// If no supplier has been given, set empty to ensure that any values set by the last
						// variant are removed
						aKeyValues = this._getKeyValuePairs(oCustomControl);
						oCustomData.Supplier = aKeyValues;
					}
				}
			}
		},

		restoreCustomAppStateDataExtension: function(oCustomData) {
			//in order to to restore the content of the custom field in the filter bar e.g. after a back navigation,
			//an object with the content is handed over to this method and the developer has to ensure, that the content of the custom field is set accordingly
			//also, empty properties have to be set
			//Example:
			var oSmartFilterBar = this.byId("listReportFilter"),
				aTokens;

			if (oSmartFilterBar instanceof SmartFilterBar) {
				if (oCustomData.AverageRatingValue !== undefined) {
					var oCustomControl = oSmartFilterBar.getControlByKey("to_CollaborativeReview/AverageRatingValue");
					if (oCustomControl instanceof RatingIndicator) {
						oCustomControl.setValue(oCustomData.AverageRatingValue);
					}
				}
				if (oCustomData.Supplier !== undefined) {
					oCustomControl = oSmartFilterBar.getControlByKey("Supplier");
					if (oCustomControl instanceof MultiInput) {
						aTokens = this._createTokens(oCustomData.Supplier);
						// Set empty values too, to ensure that values are cleared if nothing is specified in the next variant
						oCustomControl.setTokens(aTokens);
					}
				}
			}
		},

		_getRatingFilter: function(oRatingSelect) {
			var sRating = oRatingSelect.getValue(),
				oFilter;
			if (sRating > 0) {
				//Apply lower and upper range for Average Rating filter
				var sRatingLower = sRating - 0.5;
				var sRatingUpper = sRating + 0.5;
				oFilter = new Filter("to_CollaborativeReview/AverageRatingValue", FilterOperator.BT,
					sRatingLower, sRatingUpper);
			}
			return oFilter;
		},

		_getTokens: function(oControl, sName) {
			var aToken, aFilters = [];
			aToken = oControl.getTokens();
			if (aToken) {
				for (var i = 0; i < aToken.length; i++) {
					aFilters.push(new Filter(sName, "EQ", aToken[i].getProperty("key")));
				}
			}
			return aFilters;
		},

		_getKeyValuePairs: function(oCustomControl) {
			var aKeyValue = [],
				oToken = oCustomControl.getTokens();
			if (oToken) {
				for (var i = 0; i < oToken.length; i++) {
					aKeyValue.push([oToken[i].getProperty("key"), oToken[i].getProperty("text")]);
				}
			}
			return aKeyValue;
		},

		_createTokens: function(oCustomField) {
			var aTokens = [];
			for (var i = 0; i < oCustomField.length; i++) {
				aTokens.push(new Token({
					key: oCustomField[i][0],
					text: oCustomField[i][1]
				}));
			}
			return aTokens;
		},

		// If a user deletes a token in the supplier multiinput field, set dirty state
		onTokenUpdate: function(oEvent) {
			this.byId("listReportFilter").fireFilterChange();
		}

	};
});
/*!
 * Copyright (C) 2009-2024 SAP SE or an SAP affiliate company. All rights reserved.
 */

/**
 * Initialization Code and shared classes of library sap.ui.demoapps.rta.fe.lib.reuse.
 */
sap.ui.predefine("sap/ui/demoapps/rta/fe/lib/reuse/library", [
	"sap/ui/core/Lib",
	"sap/ui/core/library" // library dependency
], function(Lib) {

	"use strict";

	/**
	 * Fiori Reference App Reuse Lib based on Fiori Elements
	 *
	 * @namespace
	 * @alias sap.ui.demoapps.rta.fe.lib.reuse
	 * @author SAP SE
	 * @version 1.0.1
	 * @public
	 */
	var thisLib = Lib.init({
		name: "sap.ui.demoapps.rta.fe.lib.reuse",
		version: "1.0.1",
		dependencies: ["sap.ui.core"],
		types: [],
		interfaces: [],
		controls: [],
		elements: []
	});

	return thisLib;

});
sap.ui.predefine("sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/common/formatter/formatter", [], function() {
	"use strict";

	return {
		floatParser: function(sValue) {
			return parseFloat(sValue);
		}
	};
});
sap.ui.predefine("sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/common/view/Default.controller", [
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
/*
 * ! Copyright (C) 2009-2024 SAP SE or an SAP affiliate company. All rights reserved.
 * Simple (reuse) Component
 * This component shows how a reuse component should be written. It must offer all mandatory properties
 *		uiMode type enum (display, edit)
 *		semanticObject type string
 * It may offer more properties. All properties must be bindable and allow that the values change during the lifetime
 * of the component instance.
 */

sap.ui.predefine("sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/forFioriElements/Component", [
	"sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"
], function(UIComponent, ReuseComponentSupport) {
	"use strict";

	return UIComponent.extend("sap.ui.demoapps.rta.fe.lib.reuse.storagebintable.forFioriElements.Component", {
		metadata: {
			manifest: "json",
			properties: {
				stIsAreaVisible: {
					type: "boolean",
					group: "standard"
				}
			}
		},
		getView: function() {
			/* Convenience function to get the view from the component. It could also be stored in an instance variable this._oView instead */
			return this.getAggregation("rootControl");
		},
		init: function() {
			/* Transforms this component into a reuse component for smart templates */
			ReuseComponentSupport.mixInto(this, "component");
			/* In this simple example we create a view that is later bound to a model
			 * It is important to understand that the component has no property values yet
			 * so the view and in particular its controller code must allow to get the values after it has been created
			 */
			//Defensive call of init of the super class
			(UIComponent.prototype.init || function() {}).apply(this, arguments);

		},

		setStIsAreaVisible: function(value){
			this.getView().setBindingContext(value ? undefined : null);
			this.setProperty("stIsAreaVisible",value);
		},

		/* Smart Template Reuse Component specific functions that can will be called if defined
		 * after ReuseComponentSupport.mixInto has been called
		 */
		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			this.getView().getController().setExtensionAPI(oExtensionAPI);
			this.getView().getController().forwardBindingContext(oBindingContext);
		},

		stRefresh: function(oModel, oBindingContext, oExtensionAPI) {
			this.getView().getController().forwardBindingContext(oBindingContext);
		}
	});
}, /* bExport= */ true);
sap.ui.predefine("sap/ui/demoapps/rta/fe/localService/mockserver", [
	"sap/base/Log",
	"sap/ui/core/util/MockServer",
	"sap/ui/util/XMLHelper"
], function(
	Log,
	MockServer,
	XMLHelper
) {
	/**
	 * ATTENTION: The Mockserver is currently not able to handle navigation properties without Referential Constraints! If the data being displayed
	 * is always the first entry from the mockdata file, try adding Referential Constraint to the Metadata.xml for the corresponding relationships.
	 */

	"use strict";
	var _sAppModulePath = "sap/ui/demoapps/rta/fe/";
	var oUriParameters = new URLSearchParams(window.location.search);

	// This is to ensure that the path is correctly set in every platform (e.g. also on ABAP systems)
	var getAbsolutePath = (function() {
		var a = null;
		return function(url) {
			a = a || document.createElement('a');
			a.href = url;
			return a.href.replace(/^.*\/\/[^\/]+/, '');
		};
	})();

	function getImagePath(sFileName){
		return sFileName
			? getAbsolutePath(sap.ui.require.toUrl(_sAppModulePath) + 'localService/img/' + sFileName)
			: sFileName;
	}

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function() {
			var sManifestUrl = sap.ui.require.toUrl(_sAppModulePath + "manifest.json");
			var oXhr = new XMLHttpRequest();
			oXhr.open("GET", sManifestUrl, false);
			oXhr.send();
			var oManifest = JSON.parse(oXhr.response);

			this.createMockServer(oManifest, oUriParameters);
		},

		createMockServer: function(oManifest, oUriParameters) {

			var iAutoRespond = (oUriParameters.get("serverDelay") || 1000),
				oMockServer, dataSource, sMockServerPath, sMetadataUrl,
				oDataSources = oManifest["sap.app"]["dataSources"];

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: iAutoRespond
			});

			for (var property in oDataSources) {
				if (Object.hasOwn(oDataSources, property)) {
					dataSource = oDataSources[property];

					//do we have a mock url in the app descriptor
					if (dataSource.settings && dataSource.settings.localUri) {
						if (typeof dataSource.type === "undefined" || dataSource.type === "OData") {
							oMockServer = new MockServer({
								rootUri: dataSource.uri
							});
							sMetadataUrl = sap.ui.require.toUrl(_sAppModulePath + dataSource.settings.localUri);
							sMockServerPath = sMetadataUrl.slice(0, sMetadataUrl.lastIndexOf("/") + 1);
							oMockServer.simulate(sMetadataUrl , {
								sMockdataBaseUrl: sMockServerPath,
								bGenerateMissingMockData: true
							});
							if (property === "mainService"){
								oMockServer.attachAfter(MockServer.HTTPMETHOD.GET, function (oEvent) {
									var oParameters = oEvent.getParameters();

									if (oParameters.oFilteredData && Array.isArray(oParameters.oFilteredData.results)){
										oParameters.oFilteredData.results.forEach(function (oProduct) {
											oProduct.ProductPictureURL = getImagePath(oProduct.ProductPictureURL);
										});
									} else if (oParameters.oEntry && typeof oParameters.oEntry.ProductPictureURL === "string") {
										oParameters.oEntry.ProductPictureURL = getImagePath(oParameters.oEntry.ProductPictureURL);
									}
								}, "SEPMRA_C_PD_Product");
							}
						} else {
							if (oUriParameters.get("sap-client")) {
								dataSource.uri = dataSource.uri.concat("&sap-client=" + oUriParameters.get("sap-client"));
							}
							var rRegEx = dataSource.uri;
							if (dataSource.type !== "MockRegEx") {
								rRegEx = new RegExp(MockServer.prototype._escapeStringForRegExp(dataSource.uri) + "([?#].*)?");
							}
							sMetadataUrl =  sap.ui.require.toUrl(_sAppModulePath + dataSource.settings.localUri);

							oMockServer = new MockServer({
								requests: [{
									method: "GET",
									path: rRegEx,
									response: function(sMetadataUrl, oXhr) {
										var oAnnotationsXhr = new XMLHttpRequest();
										oAnnotationsXhr.open("GET", sMetadataUrl, false);
										oAnnotationsXhr.send();
										var oAnnotations = oAnnotationsXhr.responseXML;
										oXhr.respondXML(200, {}, XMLHelper.serialize(oAnnotations));
										return true;
									}.bind(null, sMetadataUrl)
								}]
							});
						}
						oMockServer.start();
						Log.info("Running the app with mock data for " + property);
					}
				}
			}
		}
	};

});
sap.ui.require.preload({
	"sap/ui/demoapps/rta/fe/ext/fragment/CustomFilter.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:smartfilterbar="sap.ui.comp.smartfilterbar" xmlns:core="sap.ui.core"><smartfilterbar:ControlConfiguration groupId="_BASIC" index="6" key="Supplier" label="{/#SEPMRA_C_PD_ProductType/Supplier/@sap:label}"\n\t\tvisibleInAdvancedArea="true"><smartfilterbar:customControl><MultiInput enableMultiLineMode="true" id="Supplier-multiinput" valueHelpRequest="onCustomSupplierDialogOpen" tokenUpdate="onTokenUpdate"/></smartfilterbar:customControl></smartfilterbar:ControlConfiguration><smartfilterbar:ControlConfiguration key="to_CollaborativeReview/AverageRatingValue" index="7"\n\t\tlabel="{/#SEPMRA_C_PD_ReviewType/AverageRatingValue/@sap:label}" visibleInAdvancedArea="true" groupId="_BASIC"><smartfilterbar:customControl><RatingIndicator value="0" enabled="true"></RatingIndicator></smartfilterbar:customControl></smartfilterbar:ControlConfiguration></core:FragmentDefinition>',
	"sap/ui/demoapps/rta/fe/ext/fragment/CustomSupplierFilterSelectDialog.fragment.xml":'<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><TableSelectDialog title="{i18n|sap.suite.ui.generic.template.ListReport|SEPMRA_C_PD_Product>xtit.SelectSupplier}" multiSelect="true"\n\t\trememberSelections="false"\n\t\tconfirm="onHandleCustomSupplierTableSelectDialogClose"\n\t\tsearch="onHandleCustomSupplierDialogSearch" id="selectedSuppliers"\n\t\titems="{ path : \'/SEPMRA_C_PD_Supplier\', sorter : { path : \'CompanyName\', descending : false, group: false } }"\n\t\tnoDataText="{i18n|sap.suite.ui.generic.template.ListReport|SEPMRA_C_PD_Product>ymsg.NoSupplierFound}"><ColumnListItem id="name"><cells><ObjectIdentifier text="{CompanyName}"/></cells></ColumnListItem><columns><Column id="supplier"></Column></columns></TableSelectDialog></core:FragmentDefinition>',
	"sap/ui/demoapps/rta/fe/i18n/ListReport/SEPMRA_C_PD_Product/i18n.properties":'# Manage Products - List Report\n# __ldi.translation.uuid=1e8d37b0-2097-11e5-867f-0800200c9a66\n\n#specific keys+text combination that overwrite template keys+text\n#scan the original i18n of the template component for the keys\n#you can find it by starting the application in the WebIDE with a run configuration that has unchecked \'open with frame\'\n#and modify the URL in the browser to /resources/sap/suite/ui/generic/template/<template component name>/i18n/i18n.properties\n#<EXISTING_KEY>=<new text for the key>\n\n#YMSG: No Category found\nymsg.NoSupplierFound= No Supplier found\n#XTIT:Supplier Name\nxtit.SelectSupplier=Select Supplier\n\n# XTIT,30: title of the page in ListReport.view.xml, this may be replaced by the application\nPAGEHEADER=Manage Products\n# XBUT,32: shown as tooltip on plus or create sign; ; "object" to be redefined. example: Create New Product\nCREATE_NEW_OBJECT=Create New Product\n\n#YMSG, 100: Unsaved Changes check box text. "object" to be redefined.\nST_GENERIC_UNSAVED_CHANGES_CHECKBOX=Also delete products with unsaved changes\n#YMSG, 100: Delete selected item text. "object" to be redefined.\nST_GENERIC_DELETE_SELECTED=Delete product?\n#YMSG, 100: Delete selected items text. "objects" to be redefined.\nST_GENERIC_DELETE_SELECTED_PLURAL=Delete the selected products?\n#YMSG, 150: Delete unsaved changes items text. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DELETE_UNSAVED_CHANGES=Another user edited this product without saving the changes: \\n{1} \\n\\nDelete anyway?\n#YMSG, 150: Delete unsaved changes items text. "objects" to be redefined.\nST_GENERIC_DELETE_UNSAVED_CHANGES_PLURAL=Other users have edited the selected products without saving the changes. \\n\\nDelete them anyway?\n#YMSG, 150: Delete locked item text. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DELETE_LOCKED=This product cannot be deleted. It is currently locked by {1}.\n#YMSG, 150: Delete locked items text. "objects" to be redefined.\nST_GENERIC_DELETE_LOCKED_PLURAL=The selected products are currently locked by other users and cannot be deleted.\n#YMSG, 150: Currently locked items text. Parameter: {0}= items count. "objects" to be redefined.\nST_GENERIC_CURRENTLY_LOCKED=1 of {0} products is currently locked.\n#YMSG, 150: Currently locked items text. Parameters: {0}= locked items count, {1}= items count."objects" to be redefined.\nST_GENERIC_CURRENTLY_LOCKED_PLURAL={0} of {1} products are currently locked by other users and cannot be deleted.\n#YMSG, 150: Delete the remaining item text. "object" to be redefined.\nST_GENERIC_DELETE_REMAINING=Do you still want to delete the remaining products?\n#YMSG, 150: Delete the remaining items text. "objects" to be redefined.\nST_GENERIC_DELETE_REMAINING_PLURAL=Do you still want to delete the remaining {0} products?\n#YMSG, 150: Delete the remaining item with unsaved changes text. "object" to be redefined.\nST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES=The remaining product has unsaved changes. \\n\\nDo you still want to delete it?\n#YMSG, 150: Delete the remaining items with unsaved changes text. "objects" to be redefined.\nST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES_PLURAL=The remaining products have unsaved changes by other users. \\n\\nDo you still want to delete them?\n#YMSG, 100: Delete success message. "objects" to be redefined.\nST_GENERIC_DELETE_SUCCESS_PLURAL=The selected products have been deleted.\n#YMSG, 100: Delete error message. "objects" to be redefined. \nST_GENERIC_DELETE_ERROR=The selected product cannot be deleted.\n#YMSG, 100: Delete error message. "objects" to be redefined. \nST_GENERIC_DELETE_ERROR_PLURAL=The selected products cannot be deleted.\n#YMSG, 100: Delete success message. Parameter: {0}= deleted item as count (1). "objects" to be redefined. \nST_GENERIC_DELETE_SUCCESS_WITH_COUNT={0} product has been deleted. \n#YMSG, 100: Delete success message. Parameter: {0}= deleted items count. "objects" to be redefined. \nST_GENERIC_DELETE_SUCCESS_PLURAL_WITH_COUNT={0} products have been deleted.\n#YMSG, 100: Delete error message. Parameter: {0}= non-deleted item as count (1)."object" to be redefined.\nST_GENERIC_DELETE_ERROR_WITH_COUNT={0} product cannot be deleted.\n#YMSG, 100: Delete error message. Parameter: {0}= non-deleted items as count."objects" to be redefined. \nST_GENERIC_DELETE_ERROR_PLURAL_WITH_COUNT={0} products cannot be deleted.\n\n#XMSG: Message box text for draft discarded. "object" to be redefined.\nST_GENERIC_OBJECT_DELETED=The product has been deleted.\n\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT=This product is being edited by {0}.\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_UNSAVED_OBJECT_POPOVER_TEXT=This product has unsaved changes by {0}.',
	"sap/ui/demoapps/rta/fe/i18n/ListReport/SEPMRA_C_PD_Product/i18n_en.properties":'\n#specific keys+text combination that overwrite template keys+text\n#scan the original i18n of the template component for the keys\n#you can find it by starting the application in the WebIDE with a run configuration that has unchecked \'open with frame\'\n#and modify the URL in the browser to /resources/sap/suite/ui/generic/template/<template component name>/i18n/i18n.properties\n#<EXISTING_KEY>=<new text for the key>\n\n#YMSG: No Category found\nymsg.NoSupplierFound=No supplier found\n#XTIT:Supplier Name\nxtit.SelectSupplier=Select Supplier\n\n# XTIT,30: title of the page in ListReport.view.xml, this may be replaced by the application\nPAGEHEADER=Manage Products\n# XBUT,32: shown as tooltip on plus or create sign; ; "object" to be redefined. example: Create New Product\nCREATE_NEW_OBJECT=Create New Product\n\n#YMSG, 100: Unsaved Changes check box text. "object" to be redefined.\nST_GENERIC_UNSAVED_CHANGES_CHECKBOX=Also delete products with unsaved changes\n#YMSG, 100: Delete selected item text. "object" to be redefined.\nST_GENERIC_DELETE_SELECTED=Delete product?\n#YMSG, 100: Delete selected items text. "objects" to be redefined.\nST_GENERIC_DELETE_SELECTED_PLURAL=Delete the selected products?\n#YMSG, 150: Delete unsaved changes items text. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DELETE_UNSAVED_CHANGES=Another user edited this product without saving the changes\\: \\n{1} \\n\\nDelete anyway?\n#YMSG, 150: Delete unsaved changes items text. "objects" to be redefined.\nST_GENERIC_DELETE_UNSAVED_CHANGES_PLURAL=Other users have edited the selected products without saving the changes. \\n\\nDelete them anyway?\n#YMSG, 150: Delete locked item text. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DELETE_LOCKED=This product cannot be deleted. It is currently locked by {1}.\n#YMSG, 150: Delete locked items text. "objects" to be redefined.\nST_GENERIC_DELETE_LOCKED_PLURAL=The selected products are currently locked by other users and cannot be deleted.\n#YMSG, 150: Currently locked items text. Parameter: {0}= items count. "objects" to be redefined.\nST_GENERIC_CURRENTLY_LOCKED=1 of {0} products is currently locked.\n#YMSG, 150: Currently locked items text. Parameters: {0}= locked items count, {1}= items count."objects" to be redefined.\nST_GENERIC_CURRENTLY_LOCKED_PLURAL={0} of {1} products are currently locked by other users and cannot be deleted.\n#YMSG, 150: Delete the remaining item text. "object" to be redefined.\nST_GENERIC_DELETE_REMAINING=Do you still want to delete the remaining products?\n#YMSG, 150: Delete the remaining items text. "objects" to be redefined.\nST_GENERIC_DELETE_REMAINING_PLURAL=Do you still want to delete the remaining {0} products?\n#YMSG, 150: Delete the remaining item with unsaved changes text. "object" to be redefined.\nST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES=The remaining product has unsaved changes. \\n\\nDo you still want to delete it?\n#YMSG, 150: Delete the remaining items with unsaved changes text. "objects" to be redefined.\nST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES_PLURAL=The remaining products have unsaved changes by other users. \\n\\nDo you still want to delete them?\n#YMSG, 100: Delete success message. "objects" to be redefined.\nST_GENERIC_DELETE_SUCCESS_PLURAL=The selected products have been deleted.\n#YMSG, 100: Delete error message. "objects" to be redefined. \nST_GENERIC_DELETE_ERROR=The selected product cannot be deleted.\n#YMSG, 100: Delete error message. "objects" to be redefined. \nST_GENERIC_DELETE_ERROR_PLURAL=The selected products cannot be deleted.\n#YMSG, 100: Delete success message. Parameter: {0}= deleted item as count (1). "objects" to be redefined. \nST_GENERIC_DELETE_SUCCESS_WITH_COUNT={0} product has been deleted. \n#YMSG, 100: Delete success message. Parameter: {0}= deleted items count. "objects" to be redefined. \nST_GENERIC_DELETE_SUCCESS_PLURAL_WITH_COUNT={0} products have been deleted.\n#YMSG, 100: Delete error message. Parameter: {0}= non-deleted item as count (1)."object" to be redefined.\nST_GENERIC_DELETE_ERROR_WITH_COUNT={0} product cannot be deleted.\n#YMSG, 100: Delete error message. Parameter: {0}= non-deleted items as count."objects" to be redefined. \nST_GENERIC_DELETE_ERROR_PLURAL_WITH_COUNT={0} products cannot be deleted.\n\n#XMSG: Message box text for draft discarded. "object" to be redefined.\nST_GENERIC_OBJECT_DELETED=The product has been deleted.\n\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT=This product is being edited by {0}.\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_UNSAVED_OBJECT_POPOVER_TEXT=This product has unsaved changes by {0}.\n',
	"sap/ui/demoapps/rta/fe/i18n/ListReport/SEPMRA_C_PD_Product/i18n_en_US_sappsd.properties":'\n#specific keys+text combination that overwrite template keys+text\n#scan the original i18n of the template component for the keys\n#you can find it by starting the application in the WebIDE with a run configuration that has unchecked \'open with frame\'\n#and modify the URL in the browser to /resources/sap/suite/ui/generic/template/<template component name>/i18n/i18n.properties\n#<EXISTING_KEY>=<new text for the key>\n\n#YMSG: No Category found\nymsg.NoSupplierFound=[[[\\u0143\\u014F \\u015C\\u0171\\u03C1\\u03C1\\u013A\\u012F\\u0113\\u0157 \\u0192\\u014F\\u0171\\u014B\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT:Supplier Name\nxtit.SelectSupplier=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u015C\\u0171\\u03C1\\u03C1\\u013A\\u012F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT,30: title of the page in ListReport.view.xml, this may be replaced by the application\nPAGEHEADER=[[[\\u039C\\u0105\\u014B\\u0105\\u011F\\u0113 \\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n# XBUT,32: shown as tooltip on plus or create sign; ; "object" to be redefined. example: Create New Product\nCREATE_NEW_OBJECT=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0143\\u0113\\u0175 \\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG, 100: Unsaved Changes check box text. "object" to be redefined.\nST_GENERIC_UNSAVED_CHANGES_CHECKBOX=[[[\\u0100\\u013A\\u015F\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u0175\\u012F\\u0163\\u0125 \\u0171\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 100: Delete selected item text. "object" to be redefined.\nST_GENERIC_DELETE_SELECTED=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163?\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 100: Delete selected items text. "objects" to be redefined.\nST_GENERIC_DELETE_SELECTED_PLURAL=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 150: Delete unsaved changes items text. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DELETE_UNSAVED_CHANGES=[[[\\u0100\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157 \\u0113\\u018C\\u012F\\u0163\\u0113\\u018C \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0175\\u012F\\u0163\\u0125\\u014F\\u0171\\u0163 \\u015F\\u0105\\u028B\\u012F\\u014B\\u011F \\u0163\\u0125\\u0113 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F\\: \\n{1} \\n\\n\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0105\\u014B\\u0177\\u0175\\u0105\\u0177?]]]\n#YMSG, 150: Delete unsaved changes items text. "objects" to be redefined.\nST_GENERIC_DELETE_UNSAVED_CHANGES_PLURAL=[[[\\u014E\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0113\\u018C\\u012F\\u0163\\u0113\\u018C \\u0163\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u0175\\u012F\\u0163\\u0125\\u014F\\u0171\\u0163 \\u015F\\u0105\\u028B\\u012F\\u014B\\u011F \\u0163\\u0125\\u0113 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F. \\n\\n\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113\\u0271 \\u0105\\u014B\\u0177\\u0175\\u0105\\u0177?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 150: Delete locked item text. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DELETE_LOCKED=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C. \\u012C\\u0163 \\u012F\\u015F \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u013A\\u014F\\u010B\\u0137\\u0113\\u018C \\u0183\\u0177 {1}.]]]\n#YMSG, 150: Delete locked items text. "objects" to be redefined.\nST_GENERIC_DELETE_LOCKED_PLURAL=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u013A\\u014F\\u010B\\u0137\\u0113\\u018C \\u0183\\u0177 \\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157\\u015F \\u0105\\u014B\\u018C \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 150: Currently locked items text. Parameter: {0}= items count. "objects" to be redefined.\nST_GENERIC_CURRENTLY_LOCKED=[[[1 \\u014F\\u0192 {0} \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u012F\\u015F \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u013A\\u014F\\u010B\\u0137\\u0113\\u018C.]]]\n#YMSG, 150: Currently locked items text. Parameters: {0}= locked items count, {1}= items count."objects" to be redefined.\nST_GENERIC_CURRENTLY_LOCKED_PLURAL=[[[{0} \\u014F\\u0192 {1} \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u013A\\u014F\\u010B\\u0137\\u0113\\u018C \\u0183\\u0177 \\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157\\u015F \\u0105\\u014B\\u018C \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.]]]\n#YMSG, 150: Delete the remaining item text. "object" to be redefined.\nST_GENERIC_DELETE_REMAINING=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u015F\\u0163\\u012F\\u013A\\u013A \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u0157\\u0113\\u0271\\u0105\\u012F\\u014B\\u012F\\u014B\\u011F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 150: Delete the remaining items text. "objects" to be redefined.\nST_GENERIC_DELETE_REMAINING_PLURAL=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u015F\\u0163\\u012F\\u013A\\u013A \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u0157\\u0113\\u0271\\u0105\\u012F\\u014B\\u012F\\u014B\\u011F {0} \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F?]]]\n#YMSG, 150: Delete the remaining item with unsaved changes text. "object" to be redefined.\nST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES=[[[\\u0162\\u0125\\u0113 \\u0157\\u0113\\u0271\\u0105\\u012F\\u014B\\u012F\\u014B\\u011F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0125\\u0105\\u015F \\u0171\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F. \\n\\n\\u010E\\u014F \\u0177\\u014F\\u0171 \\u015F\\u0163\\u012F\\u013A\\u013A \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u012F\\u0163?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 150: Delete the remaining items with unsaved changes text. "objects" to be redefined.\nST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES_PLURAL=[[[\\u0162\\u0125\\u0113 \\u0157\\u0113\\u0271\\u0105\\u012F\\u014B\\u012F\\u014B\\u011F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0171\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0183\\u0177 \\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157\\u015F. \\n\\n\\u010E\\u014F \\u0177\\u014F\\u0171 \\u015F\\u0163\\u012F\\u013A\\u013A \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113\\u0271?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 100: Delete success message. "objects" to be redefined.\nST_GENERIC_DELETE_SUCCESS_PLURAL=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 100: Delete error message. "objects" to be redefined. \nST_GENERIC_DELETE_ERROR=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 100: Delete error message. "objects" to be redefined. \nST_GENERIC_DELETE_ERROR_PLURAL=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG, 100: Delete success message. Parameter: {0}= deleted item as count (1). "objects" to be redefined. \nST_GENERIC_DELETE_SUCCESS_WITH_COUNT=[[[{0} \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C. ]]]\n#YMSG, 100: Delete success message. Parameter: {0}= deleted items count. "objects" to be redefined. \nST_GENERIC_DELETE_SUCCESS_PLURAL_WITH_COUNT=[[[{0} \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.]]]\n#YMSG, 100: Delete error message. Parameter: {0}= non-deleted item as count (1)."object" to be redefined.\nST_GENERIC_DELETE_ERROR_WITH_COUNT=[[[{0} \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.]]]\n#YMSG, 100: Delete error message. Parameter: {0}= non-deleted items as count."objects" to be redefined. \nST_GENERIC_DELETE_ERROR_PLURAL_WITH_COUNT=[[[{0} \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.]]]\n\n#XMSG: Message box text for draft discarded. "object" to be redefined.\nST_GENERIC_OBJECT_DELETED=[[[\\u0162\\u0125\\u0113 \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u012F\\u015F \\u0183\\u0113\\u012F\\u014B\\u011F \\u0113\\u018C\\u012F\\u0163\\u0113\\u018C \\u0183\\u0177 {0}.]]]\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_UNSAVED_OBJECT_POPOVER_TEXT=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0125\\u0105\\u015F \\u0171\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0183\\u0177 {0}.]]]\n',
	"sap/ui/demoapps/rta/fe/i18n/ListReport/SEPMRA_C_PD_Product/i18n_en_US_saptrc.properties":'\n#specific keys+text combination that overwrite template keys+text\n#scan the original i18n of the template component for the keys\n#you can find it by starting the application in the WebIDE with a run configuration that has unchecked \'open with frame\'\n#and modify the URL in the browser to /resources/sap/suite/ui/generic/template/<template component name>/i18n/i18n.properties\n#<EXISTING_KEY>=<new text for the key>\n\n#YMSG: No Category found\nymsg.NoSupplierFound=Plt7iO63LUe4zaTi8V/GkA_No Supplier found\n#XTIT:Supplier Name\nxtit.SelectSupplier=ugC+qijht+jIB5xfzDokCQ_Select Supplier\n\n# XTIT,30: title of the page in ListReport.view.xml, this may be replaced by the application\nPAGEHEADER=ToQLlAz7jPCDTpDccNFKYg_Manage Products\n# XBUT,32: shown as tooltip on plus or create sign; ; "object" to be redefined. example: Create New Product\nCREATE_NEW_OBJECT=2iK/HfAABKRRzIkm5ohKtg_Create New Product\n\n#YMSG, 100: Unsaved Changes check box text. "object" to be redefined.\nST_GENERIC_UNSAVED_CHANGES_CHECKBOX=4GgXgnSXB2HIvSgLCimVIg_Also delete products with unsaved changes\n#YMSG, 100: Delete selected item text. "object" to be redefined.\nST_GENERIC_DELETE_SELECTED=cUJDzNythzIOb3Z9jAO9hQ_Delete product?\n#YMSG, 100: Delete selected items text. "objects" to be redefined.\nST_GENERIC_DELETE_SELECTED_PLURAL=HiPkJy29KX77wJZtFLLAfw_Delete the selected products?\n#YMSG, 150: Delete unsaved changes items text. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DELETE_UNSAVED_CHANGES=dByg629p5sncbWbYyIgSTg_Another user edited this product without saving the changes\\: \\n{1} \\n\\nDelete anyway?\n#YMSG, 150: Delete unsaved changes items text. "objects" to be redefined.\nST_GENERIC_DELETE_UNSAVED_CHANGES_PLURAL=3ka9STCrtTzEtphCaiEUjw_Other users have edited the selected products without saving the changes. \\n\\nDelete them anyway?\n#YMSG, 150: Delete locked item text. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DELETE_LOCKED=fYtqSweLr5hhE3M2BlHk3A_This product cannot be deleted. It is currently locked by {1}.\n#YMSG, 150: Delete locked items text. "objects" to be redefined.\nST_GENERIC_DELETE_LOCKED_PLURAL=5cGbaww+FPOPQXxJiexeYw_The selected products are currently locked by other users and cannot be deleted.\n#YMSG, 150: Currently locked items text. Parameter: {0}= items count. "objects" to be redefined.\nST_GENERIC_CURRENTLY_LOCKED=1bmQwueE3ajC0Gd5/WM/nA_1 of {0} products is currently locked.\n#YMSG, 150: Currently locked items text. Parameters: {0}= locked items count, {1}= items count."objects" to be redefined.\nST_GENERIC_CURRENTLY_LOCKED_PLURAL=eks+eYbW3FhVcepFH1NuVw_{0} of {1} products are currently locked by other users and cannot be deleted.\n#YMSG, 150: Delete the remaining item text. "object" to be redefined.\nST_GENERIC_DELETE_REMAINING=wmC+cX01pwploOnIo97jkA_Do you still want to delete the remaining products?\n#YMSG, 150: Delete the remaining items text. "objects" to be redefined.\nST_GENERIC_DELETE_REMAINING_PLURAL=OnhuM41YGyzrpLkUR7Ruww_Do you still want to delete the remaining {0} products?\n#YMSG, 150: Delete the remaining item with unsaved changes text. "object" to be redefined.\nST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES=PUkuENnxdBDViEGVwFslfg_The remaining product has unsaved changes. \\n\\nDo you still want to delete it?\n#YMSG, 150: Delete the remaining items with unsaved changes text. "objects" to be redefined.\nST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES_PLURAL=TtnZGApsAUDkbvmWPlVrLw_The remaining products have unsaved changes by other users. \\n\\nDo you still want to delete them?\n#YMSG, 100: Delete success message. "objects" to be redefined.\nST_GENERIC_DELETE_SUCCESS_PLURAL=iMaKkUQPAW1oEWiXbNTRNQ_The selected products have been deleted.\n#YMSG, 100: Delete error message. "objects" to be redefined. \nST_GENERIC_DELETE_ERROR=A0/pLq6JDkVMdF1bFG3sNQ_The selected product cannot be deleted.\n#YMSG, 100: Delete error message. "objects" to be redefined. \nST_GENERIC_DELETE_ERROR_PLURAL=48y60gGpLBPMbQECBvZrMQ_The selected products cannot be deleted.\n#YMSG, 100: Delete success message. Parameter: {0}= deleted item as count (1). "objects" to be redefined. \nST_GENERIC_DELETE_SUCCESS_WITH_COUNT=kaFiW2tizCe7+qxk1afqYw_{0} product has been deleted. \n#YMSG, 100: Delete success message. Parameter: {0}= deleted items count. "objects" to be redefined. \nST_GENERIC_DELETE_SUCCESS_PLURAL_WITH_COUNT=N5bBKaj+QytAD8ckTnVZDA_{0} products have been deleted.\n#YMSG, 100: Delete error message. Parameter: {0}= non-deleted item as count (1)."object" to be redefined.\nST_GENERIC_DELETE_ERROR_WITH_COUNT=i2jQR4BsLDUQPpY4clMvSg_{0} product cannot be deleted.\n#YMSG, 100: Delete error message. Parameter: {0}= non-deleted items as count."objects" to be redefined. \nST_GENERIC_DELETE_ERROR_PLURAL_WITH_COUNT=2TV2DWHzodhL51WAmSvaLA_{0} products cannot be deleted.\n\n#XMSG: Message box text for draft discarded. "object" to be redefined.\nST_GENERIC_OBJECT_DELETED=byCF754k11kVA8BSv0dL/Q_The product has been deleted.\n\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT=y02XQ4PilZJEBtbnb9rhcQ_This product is being edited by {0}.\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_UNSAVED_OBJECT_POPOVER_TEXT=Hx/+x0nwvcxogOsKL6wJ/A_This product has unsaved changes by {0}.\n',
	"sap/ui/demoapps/rta/fe/i18n/ObjectPage/SEPMRA_C_PD_Product/i18n.properties":'# Manage Products - Object Page\n# __ldi.translation.uuid=edaa6aa0-2096-11e5-867f-0800200c9a66\n\n#specific keys+text combination that overwrite template keys+text\n#scan the original i18n of the template component for the keys\n#you can find it by starting the application in the WebIDE with a run configuration that has unchecked \'open with frame\'\n#and modify the URL in the browser to /resources/sap/suite/ui/generic/template/<template component name>/i18n/i18n.properties\n#<EXISTING_KEY>=<new text for the key>\n\n# XTIT,30: title of the page in ListReport.view.xml, this may be replaced by the application\nPAGEHEADER=Manage Products\n\n#XMSG,200: used in expired lock dialog (pop-up). Parameter: {0}= user name. "object" to be redefined.\nDRAFT_LOCK_EXPIRED=Another user edited this product without saving the changes:\\n\\n {0} \\n\\n If you take over, any changes will be lost.\n#XMSG,200: used in a dialog pop-up; there is a draft document but the user navigates to the active document. Parameters: {1}= object Key {2}= changed at (date/time). "object" to be redefined.\nDRAFT_FOUND_RESUME=We saved a draft of your changes to product {1} on {2}.\\n\\nDo you want to resume editing or discard the changes?\n#XFLD,30: used in message toast after saving. "object" to be redefined.\nOBJECT_SAVED=Product saved\n#XFLD,30: used in message toast after object creation. "object" to be redefined.\nOBJECT_CREATED=Product created\n\n#XBUT,50: used in a message box after pressing the delete button. Parameter: {1}= object title, {2}= object subtitle. "object" to be redefined.\nDELETE_WITH_OBJECTINFO=Delete product {1},  {2}?\n#XTIT, 50: used as page title for a new object. "object" to be redefined.\nNEW_OBJECT=New product\n\n#YMSG, 200: Message box text for draft locked by other user. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DRAFT_LOCKED_BY_USER=Another user edited this product without saving the changes: \\n{1} \\nIf you take over, any changes will be lost.\n\n#XMSG: Message box text for draft discarded. "object" to be redefined.\nST_GENERIC_OBJECT_DELETED=The product has been deleted.\n\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT=This product is being edited by {0}.\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_UNSAVED_OBJECT_POPOVER_TEXT=This product has unsaved changes by {0}.',
	"sap/ui/demoapps/rta/fe/i18n/ObjectPage/SEPMRA_C_PD_Product/i18n_en.properties":'\n#specific keys+text combination that overwrite template keys+text\n#scan the original i18n of the template component for the keys\n#you can find it by starting the application in the WebIDE with a run configuration that has unchecked \'open with frame\'\n#and modify the URL in the browser to /resources/sap/suite/ui/generic/template/<template component name>/i18n/i18n.properties\n#<EXISTING_KEY>=<new text for the key>\n\n# XTIT,30: title of the page in ListReport.view.xml, this may be replaced by the application\nPAGEHEADER=Manage Products\n\n#XMSG,200: used in expired lock dialog (pop-up). Parameter: {0}= user name. "object" to be redefined.\nDRAFT_LOCK_EXPIRED=Another user edited this product without saving the changes\\:\\n\\n {0} \\n\\n If you take over, any changes will be lost.\n#XMSG,200: used in a dialog pop-up; there is a draft document but the user navigates to the active document. Parameters: {1}= object Key {2}= changed at (date/time). "object" to be redefined.\nDRAFT_FOUND_RESUME=We saved a draft of your changes to product {1} on {2}.\\n\\nDo you want to resume editing or discard your changes?\n#XFLD,30: used in message toast after saving. "object" to be redefined.\nOBJECT_SAVED=Product saved\n#XFLD,30: used in message toast after object creation. "object" to be redefined.\nOBJECT_CREATED=Product created\n\n#XBUT,50: used in a message box after pressing the delete button. Parameter: {1}= object title, {2}= object subtitle. "object" to be redefined.\nDELETE_WITH_OBJECTINFO=Delete product {1},  {2}?\n#XTIT, 50: used as page title for a new object. "object" to be redefined.\nNEW_OBJECT=New Product\n\n#YMSG, 200: Message box text for draft locked by other user. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DRAFT_LOCKED_BY_USER=Another user edited this product without saving the changes\\: \\n{1} \\nIf you take over, any changes will be lost.\n\n#XMSG: Message box text for draft discarded. "object" to be redefined.\nST_GENERIC_OBJECT_DELETED=The product has been deleted.\n\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT=This product is being edited by {0}.\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_UNSAVED_OBJECT_POPOVER_TEXT=This product has unsaved changes by {0}.\n',
	"sap/ui/demoapps/rta/fe/i18n/ObjectPage/SEPMRA_C_PD_Product/i18n_en_US_sappsd.properties":'\n#specific keys+text combination that overwrite template keys+text\n#scan the original i18n of the template component for the keys\n#you can find it by starting the application in the WebIDE with a run configuration that has unchecked \'open with frame\'\n#and modify the URL in the browser to /resources/sap/suite/ui/generic/template/<template component name>/i18n/i18n.properties\n#<EXISTING_KEY>=<new text for the key>\n\n# XTIT,30: title of the page in ListReport.view.xml, this may be replaced by the application\nPAGEHEADER=[[[\\u039C\\u0105\\u014B\\u0105\\u011F\\u0113 \\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XMSG,200: used in expired lock dialog (pop-up). Parameter: {0}= user name. "object" to be redefined.\nDRAFT_LOCK_EXPIRED=[[[\\u0100\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157 \\u0113\\u018C\\u012F\\u0163\\u0113\\u018C \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0175\\u012F\\u0163\\u0125\\u014F\\u0171\\u0163 \\u015F\\u0105\\u028B\\u012F\\u014B\\u011F \\u0163\\u0125\\u0113 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F\\:\\n\\n {0} \\n\\n \\u012C\\u0192 \\u0177\\u014F\\u0171 \\u0163\\u0105\\u0137\\u0113 \\u014F\\u028B\\u0113\\u0157, \\u0105\\u014B\\u0177 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u013A\\u014F\\u015F\\u0163.]]]\n#XMSG,200: used in a dialog pop-up; there is a draft document but the user navigates to the active document. Parameters: {1}= object Key {2}= changed at (date/time). "object" to be redefined.\nDRAFT_FOUND_RESUME=[[[\\u0174\\u0113 \\u015F\\u0105\\u028B\\u0113\\u018C \\u0105 \\u018C\\u0157\\u0105\\u0192\\u0163 \\u014F\\u0192 \\u0177\\u014F\\u0171\\u0157 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0163\\u014F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 {1} \\u014F\\u014B {2}.\\n\\n\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u0157\\u0113\\u015F\\u0171\\u0271\\u0113 \\u0113\\u018C\\u012F\\u0163\\u012F\\u014B\\u011F \\u014F\\u0157 \\u018C\\u012F\\u015F\\u010B\\u0105\\u0157\\u018C \\u0163\\u0125\\u0113 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F?]]]\n#XFLD,30: used in message toast after saving. "object" to be redefined.\nOBJECT_SAVED=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u015F\\u0105\\u028B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD,30: used in message toast after object creation. "object" to be redefined.\nOBJECT_CREATED=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT,50: used in a message box after pressing the delete button. Parameter: {1}= object title, {2}= object subtitle. "object" to be redefined.\nDELETE_WITH_OBJECTINFO=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 {1},  {2}?]]]\n#XTIT, 50: used as page title for a new object. "object" to be redefined.\nNEW_OBJECT=[[[\\u0143\\u0113\\u0175 \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG, 200: Message box text for draft locked by other user. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DRAFT_LOCKED_BY_USER=[[[\\u0100\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157 \\u0113\\u018C\\u012F\\u0163\\u0113\\u018C \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0175\\u012F\\u0163\\u0125\\u014F\\u0171\\u0163 \\u015F\\u0105\\u028B\\u012F\\u014B\\u011F \\u0163\\u0125\\u0113 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F\\: \\n{1} \\n\\u012C\\u0192 \\u0177\\u014F\\u0171 \\u0163\\u0105\\u0137\\u0113 \\u014F\\u028B\\u0113\\u0157, \\u0105\\u014B\\u0177 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u013A\\u014F\\u015F\\u0163.]]]\n\n#XMSG: Message box text for draft discarded. "object" to be redefined.\nST_GENERIC_OBJECT_DELETED=[[[\\u0162\\u0125\\u0113 \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u012F\\u015F \\u0183\\u0113\\u012F\\u014B\\u011F \\u0113\\u018C\\u012F\\u0163\\u0113\\u018C \\u0183\\u0177 {0}.]]]\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_UNSAVED_OBJECT_POPOVER_TEXT=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0125\\u0105\\u015F \\u0171\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0183\\u0177 {0}.]]]\n',
	"sap/ui/demoapps/rta/fe/i18n/ObjectPage/SEPMRA_C_PD_Product/i18n_en_US_saptrc.properties":'\n#specific keys+text combination that overwrite template keys+text\n#scan the original i18n of the template component for the keys\n#you can find it by starting the application in the WebIDE with a run configuration that has unchecked \'open with frame\'\n#and modify the URL in the browser to /resources/sap/suite/ui/generic/template/<template component name>/i18n/i18n.properties\n#<EXISTING_KEY>=<new text for the key>\n\n# XTIT,30: title of the page in ListReport.view.xml, this may be replaced by the application\nPAGEHEADER=iYvi0xLgmPzE0k+rg3WoOA_Manage Products\n\n#XMSG,200: used in expired lock dialog (pop-up). Parameter: {0}= user name. "object" to be redefined.\nDRAFT_LOCK_EXPIRED=a0+AYJrVJwPc/blZO39f+g_Another user edited this product without saving the changes\\:\\n\\n {0} \\n\\n If you take over, any changes will be lost.\n#XMSG,200: used in a dialog pop-up; there is a draft document but the user navigates to the active document. Parameters: {1}= object Key {2}= changed at (date/time). "object" to be redefined.\nDRAFT_FOUND_RESUME=v1tQFEr6+tiuLHzpzwHMPg_We saved a draft of your changes to product {1} on {2}.\\n\\nDo you want to resume editing or discard the changes?\n#XFLD,30: used in message toast after saving. "object" to be redefined.\nOBJECT_SAVED=sZKqcWEC1LogcqXswqubIw_Product saved\n#XFLD,30: used in message toast after object creation. "object" to be redefined.\nOBJECT_CREATED=i8UN2npoHRD8u/LBfVgn3A_Product created\n\n#XBUT,50: used in a message box after pressing the delete button. Parameter: {1}= object title, {2}= object subtitle. "object" to be redefined.\nDELETE_WITH_OBJECTINFO=8eBUtr0UllhLjH323YGMeA_Delete product {1},  {2}?\n#XTIT, 50: used as page title for a new object. "object" to be redefined.\nNEW_OBJECT=fE/CCy6gvT/7WebaogR9ag_New product\n\n#YMSG, 200: Message box text for draft locked by other user. Parameter: {1}= user name. "object" to be redefined.\nST_GENERIC_DRAFT_LOCKED_BY_USER=rV5a4yPS9MYRJyUG1xPFFg_Another user edited this product without saving the changes\\: \\n{1} \\nIf you take over, any changes will be lost.\n\n#XMSG: Message box text for draft discarded. "object" to be redefined.\nST_GENERIC_OBJECT_DELETED=xRvuNPhGOIXsu+B/Q35U0g_The product has been deleted.\n\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT=AhT8X8c2vsZQPLeNXMrv8Q_This product is being edited by {0}.\n#YMSG,70: used in pop-over showing draft admin data. Parameter: {0}= user name. "object" to be redefined.\nST_GENERIC_UNSAVED_OBJECT_POPOVER_TEXT=1pjI0IoaNbEgLWIZoKo5Rw_This product has unsaved changes by {0}.\n',
	"sap/ui/demoapps/rta/fe/i18n/i18n.properties":'# Manage Products - general \n# __ldi.translation.uuid=dae33f10-2095-11e5-867f-0800200c9a66\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Manage Products\n#YDES: Application description\nappDescription=SAP Fiori Ref. App\n#XTIT: Storage Bin reuse component title\nstorageBinTitle=Inventory Information\n#XTIT: Notes reuse component title\nnotesTitle=Notes',
	"sap/ui/demoapps/rta/fe/i18n/i18n_en.properties":'\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Manage Products\n#YDES: Application description\nappDescription=SAP Fiori Ref. App\n#XTIT: Storage Bin reuse component title\nstorageBinTitle=Inventory Information\n#XTIT: Notes reuse component title\nnotesTitle=Notes\n',
	"sap/ui/demoapps/rta/fe/i18n/i18n_en_US_sappsd.properties":'\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=[[[\\u039C\\u0105\\u014B\\u0105\\u011F\\u0113 \\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n#YDES: Application description\nappDescription=[[[\\u015C\\u0100\\u01A4 \\u0191\\u012F\\u014F\\u0157\\u012F \\u0158\\u0113\\u0192. \\u0100\\u03C1\\u03C1\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT: Storage Bin reuse component title\nstorageBinTitle=[[[\\u012C\\u014B\\u028B\\u0113\\u014B\\u0163\\u014F\\u0157\\u0177 \\u012C\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT: Notes reuse component title\nnotesTitle=[[[\\u0143\\u014F\\u0163\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"sap/ui/demoapps/rta/fe/i18n/i18n_en_US_saptrc.properties":'\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=1yIhjm4zPmErLJTgsnHhZA_Manage Products\n#YDES: Application description\nappDescription=nkO0Lz0HtrU3qDBYUGi9ZA_SAP Fiori Ref. App\n#XTIT: Storage Bin reuse component title\nstorageBinTitle=yGRrxClm1DREkfnYJxgzmw_Inventory Information\n#XTIT: Notes reuse component title\nnotesTitle=UHcvtceoNa44t6N2Cl7QRw_Notes\n',
	"sap/ui/demoapps/rta/fe/lib/reuse/manifest.json":'{"_version":"1.3.0","sap.app":{"_version":"1.1.0","id":"sap.ui.demoapps.rta.fe.lib.reuse","type":"library","i18n":"messagebundle.properties","applicationVersion":{"version":"1.0.1"},"title":"{{TITLE}}","description":"{{DESCRIPTION}}","ach":"BC-SRV-NWD-FRA","resources":"resources.json","offline":false},"sap.ui":{"_version":"1.1.0","technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_belize"]},"sap.ui5":{"_version":"1.1.0","dependencies":{"minUI5Version":"1.30.0","libs":{"sap.ui.core":{},"sap.ui.commons":{}}},"contentDensities":{"compact":true,"cozy":false}},"sap.platform.abap":{"_version":"1.1.0","uri":"/sap/bc/ui5_ui5/sap/nw_epm_rastreus"},"sap.platform.hcp":{"_version":"1.1.0","uri":""},"sap.fiori":{"_version":"1.1.0","registrationIds":["F2470"],"archeType":"reusecomponent"}}',
	"sap/ui/demoapps/rta/fe/lib/reuse/messagebundle.properties":'# Translation file of library sap.ui.demoapps.rta.fe.lib.reuse.\n# __ldi.translation.uuid=6a1e8710-b0ba-11e6-9598-0800200c9a66\n\n#XTIT: Application name\nTITLE=Fiori Reference App Reuse Lib\n\n#YDES: Application description\nDESCRIPTION=Fiori Reference App Reuse Lib based on Fiori Elements\n\n#XTIT: Title of General Information area\nxtit.storageBinOverview=Stock Data\n#XTIT: Column title - reordered quantity per or. unit\nxtit.reorderedQunatity=Ordered Quantity\nxtit.miniChartTitle=Stock\nxtit.checkAvailability=Check availability',
	"sap/ui/demoapps/rta/fe/lib/reuse/messagebundle_en.properties":'\n#XTIT: Application name\nTITLE=Fiori Reference App Reuse Library\n\n#YDES: Application description\nDESCRIPTION=Fiori Reference App Reuse Library based on SAP Fiori Elements\n\n#XTIT: Title of General Information area\nxtit.storageBinOverview=Stock Data\n#XTIT: Column title - reordered quantity per or. unit\nxtit.reorderedQunatity=Ordered Quantity\nxtit.miniChartTitle=Stock\nxtit.checkAvailability=Check Availability\n',
	"sap/ui/demoapps/rta/fe/lib/reuse/messagebundle_en_US_sappsd.properties":'\n#XTIT: Application name\nTITLE=[[[\\u0191\\u012F\\u014F\\u0157\\u012F \\u0158\\u0113\\u0192\\u0113\\u0157\\u0113\\u014B\\u010B\\u0113 \\u0100\\u03C1\\u03C1 \\u0158\\u0113\\u0171\\u015F\\u0113 \\u013B\\u012F\\u0183\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YDES: Application description\nDESCRIPTION=[[[\\u0191\\u012F\\u014F\\u0157\\u012F \\u0158\\u0113\\u0192\\u0113\\u0157\\u0113\\u014B\\u010B\\u0113 \\u0100\\u03C1\\u03C1 \\u0158\\u0113\\u0171\\u015F\\u0113 \\u013B\\u012F\\u0183 \\u0183\\u0105\\u015F\\u0113\\u018C \\u014F\\u014B \\u0191\\u012F\\u014F\\u0157\\u012F \\u0114\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title of General Information area\nxtit.storageBinOverview=[[[\\u015C\\u0163\\u014F\\u010B\\u0137 \\u010E\\u0105\\u0163\\u0105\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT: Column title - reordered quantity per or. unit\nxtit.reorderedQunatity=[[[\\u014E\\u0157\\u018C\\u0113\\u0157\\u0113\\u018C \\u01EC\\u0171\\u0105\\u014B\\u0163\\u012F\\u0163\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nxtit.miniChartTitle=[[[\\u015C\\u0163\\u014F\\u010B\\u0137\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nxtit.checkAvailability=[[[\\u0108\\u0125\\u0113\\u010B\\u0137 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u012F\\u013A\\u012F\\u0163\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"sap/ui/demoapps/rta/fe/lib/reuse/messagebundle_en_US_saptrc.properties":'\n#XTIT: Application name\nTITLE=CcKpeuWu1SOf0pYQJ1hSBA_Fiori Reference App Reuse Lib\n\n#YDES: Application description\nDESCRIPTION=ytGdEkoE+q28j/BQ5YKaJQ_Fiori Reference App Reuse Lib based on Fiori Elements\n\n#XTIT: Title of General Information area\nxtit.storageBinOverview=xHt4DqBFcsffe5L6EADzMA_Stock Data\n#XTIT: Column title - reordered quantity per or. unit\nxtit.reorderedQunatity=E2Agm1V9KRvtKPM5aJ/5Rw_Ordered Quantity\nxtit.miniChartTitle=CWqvl052z8dEwQoQ3raP0g_Stock\nxtit.checkAvailability=6Lqqm25Ix7724fQ81jwggg_Check availability\n',
	"sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/common/view/Default.view.xml":'<core:View controllerName="sap.ui.demoapps.rta.fe.lib.reuse.storagebintable.common.view.Default" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"\n\txmlns:core="sap.ui.core" xmlns:smartField="sap.ui.comp.smartfield" xmlns:microchart="sap.ui.comp.smartmicrochart"><Table id="storagebintable" class="sapUiResponsiveMargin" width="auto" growing="true" growingScrollToLoad="true" noDataText="No Data Text"\n\t\titems="{path: \'to_StorageBin\', parameters: { expand: \'to_OrganizationalUnit\' }}"><headerToolbar><OverflowToolbar id="tableHeaderBar"><Title text="{i18n>xtit.storageBinOverview}"/><ToolbarSpacer/><SearchField search="onSearch" width="30%"/><Button\n\t\t\t\t\ttext="{i18n>xtit.checkAvailability}"\n\t\t\t\t\ttooltip="{i18n>xtit.checkAvailability}"\n\t\t\t\t\tpress="onCheckAvailability"/><Button\n\t\t\t\t\ticon="sap-icon://sort"\n\t\t\t\t\ttooltip="Sort Categories"\n\t\t\t\t\tpress="onOpenSortDialog"/></OverflowToolbar></headerToolbar><columns><Column id="inventoryInformation--column1"><header><Label text="{/#SEPMRA_C_PD_StorageBinTPType/Bin/@sap:label}"/></header></Column><Column demandPopin="true" minScreenWidth="tablet" id="inventoryInformation--column2"><header><Label text="{/#SEPMRA_I_OrganizationalUnitType/OrganizationalUnitName/@sap:label}"/></header></Column><Column width=\'164px\' id="inventoryInformation--column3"><header><Label text="{i18n>xtit.miniChartTitle}"/></header></Column><Column demandPopin="true" minScreenWidth="tablet" id="inventoryInformation--column4"><header><Label text="{/#SEPMRA_C_PD_StorageBinTPType/LotSizeQuantity/@sap:label}"/></header></Column><Column demandPopin="true" minScreenWidth="tablet" id="inventoryInformation--column5"><header><Label text="{i18n>xtit.reorderedQunatity}"/></header></Column></columns><ColumnListItem ><cells ><ObjectIdentifier title="{Bin}"/><Text text="{to_OrganizationalUnit/OrganizationalUnitName}"/><FlexBox ><microchart:SmartBulletMicroChart entitySet=\'SEPMRA_C_PD_StorageBinTP\'  /></FlexBox><smartField:SmartField change="onInputChange" value="{parts: [ {path: \'LotSizeQuantity\'}],\n                                formatOptions: {\n                                    parseAsString: true,\n                                    showMeasure: false }\n                            }" wrapping="true" enabled="{ui>/editable}"/><smartField:SmartField value="{PoItmQuantity}" wrapping="true" enabled="false"></smartField:SmartField></cells></ColumnListItem></Table></core:View>',
	"sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/common/view/SortDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><ViewSettingsDialog id="sortSettingsDialog" confirm="onSortDialogConfirmed"><sortItems><ViewSettingsItem text="{/#SEPMRA_I_OrganizationalUnitType/OrganizationalUnitName/@sap:label}" key="to_OrganizationalUnit/OrganizationalUnitName" /><ViewSettingsItem text="{/#SEPMRA_C_PD_StorageBinTPType/Bin/@sap:label}" key="Bin" /></sortItems></ViewSettingsDialog></core:FragmentDefinition>',
	"sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/forFioriElements/manifest.json":'{"_version":"1.1.0","sap.app":{"_version":"1.1.0","id":"sap.ui.demoapps.rta.fe.lib.reuse.storagebintable.forFioriElements","type":"component","i18n":"../../messagebundle.properties","embeddedBy":"../../../../","title":"{{TITLE}}","description":"{{DESCRIPTION}}","ach":"CA-UI5-ST","offline":false,"resources":"resources.json"},"sap.ui":{"_version":"1.1.0","technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal","sap_belize"]},"sap.ui5":{"_version":"1.1.0","rootView":{"viewName":"sap.ui.demoapps.rta.fe.lib.reuse.storagebintable.common.view.Default","async":true,"type":"XML","id":"View"},"autoPrefixId":true,"dependencies":{"libs":{"sap.ui.core":{"minVersion":"1.30.1"},"sap.m":{"minVersion":"1.30.1"},"sap.ui.comp":{"minVersion":"1.30.1"},"sap.ui.table":{"minVersion":"1.30.1"},"sap.uxap":{"minVersion":"1.30.1"},"sap.suite.ui.generic.template":{"minVersion":"1.40.1"},"sap.ui.demoapps.rta.fe.lib.reuse":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"../../messagebundle.properties"}},"contentDensities":{"compact":true,"cozy":true}}}',
	"sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/i18n/i18n.properties":'# \\ Reference reuse component\n# This file is supposed to contain texts that are used by the app that consumes the reuse lib\n# Texts that are used by the reuse lib itself go into messagebundle.properties\n# __ldi.translation.uuid=7bd8af50-b243-11e6-9598-0800200c9a66',
	"sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/i18n/i18n_en_US_sappsd.properties":'# \\ Reference reuse component\n# This file is supposed to contain texts that are used by the app that consumes the reuse lib\n',
	"sap/ui/demoapps/rta/fe/lib/reuse/storagebintable/i18n/i18n_en_US_saptrc.properties":'# \\ Reference reuse component\n# This file is supposed to contain texts that are used by the app that consumes the reuse lib\n',
	"sap/ui/demoapps/rta/fe/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ui.demoapps.rta.fe","type":"application","i18n":"i18n/i18n.properties","embeds":["lib/reuse","lib/reuse/storagebintable/forFioriElements"],"applicationVersion":{"version":"1.8.19-SNAPSHOT"},"title":"{{appTitle}}","description":"{{appDescription}}","tags":{"keywords":[]},"ach":"CA-UI5-FL-RTA","dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/SEPMRA_PROD_MAN/","type":"OData","settings":{"annotations":["SEPMRA_PROD_MAN_ANNO_MDL"],"localUri":"localService/mockdata/metadata.xml"}},"SEPMRA_PROD_MAN_ANNO_MDL":{"uri":"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName=\'SEPMRA_PROD_MAN_ANNO_MDL\',Version=\'0001\')/$value/?sap-language=EN","type":"ODataAnnotation","settings":{"localUri":"localService/SEPMRA_PROD_MAN_ANNO_MDL.xml"}}},"offline":false,"resources":"resources.json","sourceTemplate":{"id":"ui5template.smarttemplate","version":"1.0.0"}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori6/F0865","favIcon":"icon/F0865_Manage_Products.ico","phone":"icon/launchicon/57_iPhone_Desktop_Launch.png","phone@2":"icon/launchicon/114_iPhone-Retina_Web_Clip.png","tablet":"icon/launchicon/72_iPad_Desktop_Launch.png","tablet@2":"icon/launchicon/144_iPad_Retina_Web_Clip.png"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal","sap_belize"]},"sap.ui5":{"flexEnabled":true,"resources":{"js":[],"css":[]},"componentUsages":{"storagebintable":{"name":"sap.ui.demoapps.rta.fe.lib.reuse.storagebintable.forFioriElements"}},"dependencies":{"minUI5Version":"1.62.0","libs":{"sap.ui.core":{"lazy":false},"sap.ui.generic.app":{"lazy":false},"sap.m":{"lazy":false},"sap.suite.ui.generic.template":{"lazy":false},"sap.ui.comp":{"lazy":false},"sap.ui.rta":{"lazy":false}},"components":{}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"},"i18n|sap.suite.ui.generic.template.ListReport|SEPMRA_C_PD_Product":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/ListReport/SEPMRA_C_PD_Product/i18n.properties"},"i18n|sap.suite.ui.generic.template.ObjectPage|SEPMRA_C_PD_Product":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/ObjectPage/SEPMRA_C_PD_Product/i18n.properties"},"":{"dataSource":"mainService","settings":{"defaultBindingMode":"TwoWay","refreshAfterChange":false,"defaultCountMode":"Inline","metadataUrlParams":{"sap-value-list":"none"}}}},"extends":{"extensions":{"sap.ui.controllerExtensions":{"sap.suite.ui.generic.template.ListReport.view.ListReport":{"controllerName":"sap.ui.demoapps.rta.fe.ext.controller.CustomFilter","sap.ui.generic.app":{}}},"sap.ui.viewExtensions":{"sap.suite.ui.generic.template.ListReport.view.ListReport":{"SmartFilterBarControlConfigurationExtension|SEPMRA_C_PD_Product":{"className":"sap.ui.core.Fragment","fragmentName":"sap.ui.demoapps.rta.fe.ext.fragment.CustomFilter","type":"XML"}}}}},"contentDensities":{"compact":true,"cozy":true}},"sap.ui.generic.app":{"pages":[{"entitySet":"SEPMRA_C_PD_Product","component":{"name":"sap.suite.ui.generic.template.ListReport","list":true,"settings":{"gridTable":false,"multiSelect":true,"smartVariantManagement":true,"tableSettings":{"addCardToInsightsHidden":false},"dataLoadSettings":{"loadDataOnAppLaunch":"always"}}},"pages":[{"entitySet":"SEPMRA_C_PD_Product","component":{"name":"sap.suite.ui.generic.template.ObjectPage","settings":{"editableHeaderContent":false}},"pages":[{"navigationProperty":"to_CollaborativeReviewPost","entitySet":"SEPMRA_C_PD_ReviewPost","component":{"name":"sap.suite.ui.generic.template.ObjectPage"}}],"embeddedComponents":{"storageBinOverview":{"id":"storageBinOverview","componentUsage":"storagebintable","title":"{{storageBinTitle}}","settings":{}}}}]}]},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/NW_EPM_RASTPROD"},"sap.fiori":{"registrationIds":["F7943"],"archeType":"transactional"}}'
});
//# sourceMappingURL=Component-preload.js.map

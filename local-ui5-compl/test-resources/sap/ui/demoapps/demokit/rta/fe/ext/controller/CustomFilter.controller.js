sap.ui.define([
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
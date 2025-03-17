//@ui5-bundle sap/ui/demo/cart/Component-preload.js
sap.ui.predefine("sap/ui/demo/cart/Component", [
	"sap/ui/core/UIComponent",
	"./model/LocalStorageModel",
	"./model/models",
	"sap/ui/Device"
], function(UIComponent, LocalStorageModel, models, Device) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.cart.Component", {

		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function () {
			//create and set cart model
			var oCartModel = new LocalStorageModel("SHOPPING_CART", {
				cartEntries: {},
				savedForLaterEntries: {}
			});
			this.setModel(oCartModel, "cartProducts");

			//create and set comparison model
			var oComparisonModel = new LocalStorageModel("PRODUCT_COMPARISON", {
				category: "",
				item1: "",
				item2: ""
			});
			this.setModel(oComparisonModel, "comparison");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the router
			this.getRouter().initialize();

			// update browser title
			this.getRouter().attachTitleChanged(function(oEvent) {
				var sTitle = oEvent.getParameter("title");
				document.addEventListener('DOMContentLoaded', function(){
					document.title = sTitle;
				});
			});
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				// eslint-disable-next-line sap-no-proprietary-browser-api
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/App.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.App", {

		onInit : function () {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : true,
				delay : 0,
				layout : "TwoColumnsMidExpanded",
				smallScreenMode : true
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			// since then() has no "reject"-path attach to the MetadataFailed-Event to disable the busy indicator in case of an error
			this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
			this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}

	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/BaseController", [
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"../model/cart"
], function(Controller, MessageToast, UIComponent, History, cart) {
	"use strict";

	return Controller.extend("sap.ui.demo.cart.controller.BaseController", {
		cart: cart,
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Handler for the Avatar button press event
		 * @public
		 */
		onAvatarPress: function () {
			var sMessage = this.getResourceBundle().getText("avatarButtonMessageToastText");
			MessageToast.show(sMessage);
		},

		/**
		 * React to FlexibleColumnLayout resize events
		 * Hides navigation buttons and switches the layout as needed
		 * @param {sap.ui.base.Event} oEvent the change event
		 */
		onStateChange: function (oEvent) {
			var sLayout = oEvent.getParameter("layout"),
				iColumns = oEvent.getParameter("maxColumnsCount");

			if (iColumns === 1) {
				this.getModel("appView").setProperty("/smallScreenMode", true);
			} else {
				this.getModel("appView").setProperty("/smallScreenMode", false);
				// swich back to two column mode when device orientation is changed
				if (sLayout === "OneColumn") {
					this._setLayout("Two");
				}
			}
		},

		/**
		 * Sets the flexible column layout to one, two, or three columns for the different scenarios across the app
		 * @param {string} sColumns the target amount of columns
		 * @private
		 */
		_setLayout: function (sColumns) {
			if (sColumns) {
				this.getModel("appView").setProperty("/layout", sColumns + "Column" + (sColumns === "One" ? "" : "sMidExpanded"));
			}
		},

		/**
		 * Navigates back in browser history or to the home screen
		 */
		onBack: function () {
			var oHistory = History.getInstance();
			var oPrevHash = oHistory.getPreviousHash();
			if (oPrevHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("home");
			}
		},

		/**
		 * Called, when the add button of a product is pressed.
		 * Saves the product, the i18n bundle, and the cart model and hands them to the <code>addToCart</code> function
		 * @public
		 */
		onAddToCart : function () {
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oEntry =  arguments[0].getSource().getBindingContext().getObject();
			var oCartModel = this.getView().getModel("cartProducts");
			cart.addToCart(oResourceBundle, oEntry, oCartModel);
		},
		/**
		 * Clear comparison model
		 * @protected
		 */
		_clearComparison: function (){
			var oModel = this.getOwnerComponent().getModel("comparison");
			oModel.setData({
				category: "",
				item1: "",
				item2: ""
			});
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/Cart.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(
	BaseController,
	JSONModel,
	Device,
	formatter,
	MessageBox,
	MessageToast
) {
	"use strict";

	var sCartModelName = "cartProducts";
	var sSavedForLaterEntries = "savedForLaterEntries";
	var sCartEntries = "cartEntries";

	return BaseController.extend("sap.ui.demo.cart.controller.Cart", {
		formatter: formatter,

		onInit: function () {
			this._oRouter = this.getRouter();
			this._oRouter.getRoute("cart").attachPatternMatched(this._routePatternMatched, this);
			this._oRouter.getRoute("productCart").attachPatternMatched(this._routePatternMatched, this);
			this._oRouter.getRoute("comparisonCart").attachPatternMatched(this._routePatternMatched, this);
			// set initial ui configuration model
			var oCfgModel = new JSONModel({});
			this.getView().setModel(oCfgModel, "cfg");
			this._toggleCfgModel();

			var oEditButton = this.byId("editButton");
			oEditButton.addEventDelegate({
				onAfterRendering : function () {
					oEditButton.focus();
				}
			});
		},

		onExit: function () {
			if (this._orderDialog) {
				this._orderDialog.destroy();
			}
			if (this._orderBusyDialog) {
				this._orderBusyDialog.destroy();
			}
		},

		_routePatternMatched: function () {
			this._setLayout("Three");
			var oCartModel = this.getModel("cartProducts");
			var oCartEntries = oCartModel.getProperty("/cartEntries");
			//enables the proceed and edit buttons if the cart has entries
			if (Object.keys(oCartEntries).length > 0) {
				oCartModel.setProperty("/showProceedButton", true);
				oCartModel.setProperty("/showEditButton", true);
			}
			//set selection of list back
			var oEntryList = this.byId("entryList");
			oEntryList.removeSelections();
		},

		onEditOrDoneButtonPress: function () {
			this._toggleCfgModel();
		},

		_toggleCfgModel: function () {
			var oCfgModel = this.getView().getModel("cfg");
			var oData = oCfgModel.getData();
			var oBundle = this.getResourceBundle();
			var bDataNoSetYet = !oData.hasOwnProperty("inDelete");
			var bInDelete = (bDataNoSetYet ? true : oData.inDelete);
			var sPhoneMode = (Device.system.phone ? "None" : "SingleSelectMaster");
			var sPhoneType = (Device.system.phone ? "Active" : "Inactive");

			oCfgModel.setData({
				inDelete: !bInDelete,
				notInDelete: bInDelete,
				listMode: (bInDelete ? sPhoneMode : "Delete"),
				listItemType: (bInDelete ? sPhoneType : "Inactive"),
				pageTitle: (bInDelete ? oBundle.getText("appTitle") : oBundle.getText("cartTitleEdit"))
			});
		},

		onEntryListPress: function (oEvent) {
			this._showProduct(oEvent.getSource());
		},

		onEntryListSelect: function (oEvent) {
			this._showProduct(oEvent.getParameter("listItem"));
		},

		/**
		 * Called when the "save for later" link of a product in the cart is pressed.
		 * @public
		 * @param {sap.ui.base.Event} oEvent Event object
		 */
		onSaveForLater: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext(sCartModelName);
			this._changeList(sSavedForLaterEntries, sCartEntries, oBindingContext);
		},

		/**
		 * Called when the "Add back to basket" link of a product in the saved for later list is pressed.
		 * @public
		 * @param {sap.ui.base.Event} oEvent Event object
		 */
		onAddBackToBasket: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext(sCartModelName);

			this._changeList(sCartEntries, sSavedForLaterEntries, oBindingContext);
		},

		/**
		 * Moves a product from one list to another.
		 * @private
		 * @param {string} sListToAddItem Name of list, where item should be moved to
		 * @param {string} sListToDeleteItem Name of list, where item should be removed from
		 * @param {Object} oBindingContext Binding context of product
		 */
		_changeList: function (sListToAddItem, sListToDeleteItem, oBindingContext) {
			var oCartModel = oBindingContext.getModel();
			var oProduct = oBindingContext.getObject();
			var oModelData = oCartModel.getData();
			// why are the items cloned? - the JSON model checks if the values in the object are changed.
			// if we do our modifications on the same reference, there will be no change detected.
			// so we modify after the clone.
			var oListToAddItem = Object.assign({}, oModelData[sListToAddItem]);
			var oListToDeleteItem = Object.assign({}, oModelData[sListToDeleteItem]);
			var sProductId = oProduct.ProductId;

			// find existing entry for product
			if (oListToAddItem[sProductId] === undefined) {
				// copy new entry
				oListToAddItem[sProductId] = Object.assign({}, oProduct);
			}

			//Delete the saved Product from cart
			delete oListToDeleteItem[sProductId];
			oCartModel.setProperty("/" + sListToAddItem, oListToAddItem);
			oCartModel.setProperty("/" + sListToDeleteItem, oListToDeleteItem);
		},

		_showProduct: function (oItem) {
			var oEntry = oItem.getBindingContext(sCartModelName).getObject();

			// close cart when showing a product on phone
			var bCartVisible = false;
			if (!Device.system.phone) {
				bCartVisible = this.getModel("appView").getProperty("/layout").startsWith("Three");
			} else {
				bCartVisible = false;
				this._setLayout("Two");
			}
			this._oRouter.navTo(bCartVisible ? "productCart" : "product", {
				id: oEntry.Category,
				productId: oEntry.ProductId
			}, !Device.system.phone);
		},

		onCartEntriesDelete: function (oEvent) {
			this._deleteProduct(sCartEntries, oEvent);
		},

		onSaveForLaterDelete: function (oEvent) {
			this._deleteProduct(sSavedForLaterEntries, oEvent);
		},

		/**
		 * Helper function for the deletion of items from <code>cart</code> or <code>savedForLater</code> list.
		 * If the delete button is pressed, a message dialog will open.
		 * @private
		 * @param {string} sCollection the collection name
		 * @param {sap.ui.base.Event} oEvent Event object
		 */
		_deleteProduct: function (sCollection, oEvent) {
			var oBindingContext = oEvent.getParameter("listItem").getBindingContext(sCartModelName),
				oBundle = this.getResourceBundle(),
				sEntryId = oBindingContext.getProperty("ProductId"),
				sEntryName = oBindingContext.getProperty("Name");

			// show confirmation dialog
			MessageBox.show(oBundle.getText("cartDeleteDialogMsg"), {
				title: oBundle.getText("cartDeleteDialogTitle"),
				actions: [
					MessageBox.Action.DELETE,
					MessageBox.Action.CANCEL
				],
				onClose: function (oAction) {
					if (oAction !== MessageBox.Action.DELETE) {
						return;
					}
					var oCartModel = oBindingContext.getModel();
					var oCollectionEntries = Object.assign({}, oCartModel.getData()[sCollection]);

					delete oCollectionEntries[sEntryId];

					// update model
					oCartModel.setProperty("/" + sCollection, Object.assign({}, oCollectionEntries));

					MessageToast.show(oBundle.getText("cartDeleteDialogConfirmDeleteMsg",
						[sEntryName]));
				}
			});
		},

		/**
		 * Called when the proceed button in the cart is pressed.
		 * Navigates to the checkout wizard
		 * @public
		 */
		onProceedButtonPress: function () {
			this.getRouter().navTo("checkout");
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/Category.controller", [
	"./BaseController",
	"../model/formatter",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (
	BaseController,
	formatter,
	Device,
	Filter,
	FilterOperator,
	JSONModel,
	Fragment) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.Category", {
		formatter : formatter,
		// Define filterPreviousValues as global variables because they need to be accessed from different functions
		_iLowFilterPreviousValue: 0,
		_iHighFilterPreviousValue: 5000,

		onInit: function () {
			var oViewModel = new JSONModel({
				Suppliers: []
			});
			this.getView().setModel(oViewModel, "view");
			var oComponent = this.getOwnerComponent();
			this._oRouter = oComponent.getRouter();
			this._oRouter.getRoute("category").attachMatched(this._loadCategories, this);
			this._oRouter.getRoute("productCart").attachMatched(this._loadCategories, this);
			this._oRouter.getRoute("product").attachMatched(this._loadCategories, this);
			this._oRouter.getRoute("comparison").attachMatched(this._loadCategories, this);
			this._oRouter.getRoute("comparisonCart").attachMatched(this._loadCategories, this);
		},

		_loadCategories: function(oEvent) {
			var bSmallScreen = this.getModel("appView").getProperty("/smallScreenMode"),
				sRouteName = oEvent.getParameter("name");

			// switch to first column in full screen mode for category route on small devices
			if (sRouteName === "category") {
				this._setLayout(bSmallScreen ? "One" : "Two");
			}

			var oModel = this.getModel();
			this._loadSuppliers();
			var oProductList = this.byId("productList");
			var oBinding = oProductList.getBinding("items");
			oBinding.attachDataReceived(this.fnDataReceived, this);
			var sId = oEvent.getParameter("arguments").id;
			this._sProductId = oEvent.getParameter("arguments").productId;
			// the binding should be done after insuring that the metadata is loaded successfully
			oModel.metadataLoaded().then(function () {
				var oView = this.getView(),
					sPath = "/" + this.getModel().createKey("ProductCategories", {
					Category: sId
				});
				oView.bindElement({
					path : sPath,
					parameters: {
						expand: "Products"
					},
					events: {
						dataRequested: function () {
							oView.setBusy(true);
						},
						dataReceived: function () {
							oView.setBusy(false);
						}
					}
				});
			}.bind(this));
		},

		/**
		 * Create a unique array of suppliers to be used in the supplier flter option
		 * @private
		 */
		_loadSuppliers: function () {
			var oModel = this.getModel();
			oModel.read("/Products", {
				success: function (oData) {
					var aProducts = oData.results,
						aSuppliers = [];

					aProducts.forEach(function (oProduct) {
						aSuppliers.push(oProduct.SupplierName);
					});
					// remove duplications from the suppliers array and sort it
					var aUniqueSuppliers = aSuppliers.filter(function (sName, iIndex, aUniqueSuppliers) {
						return aUniqueSuppliers.indexOf(sName) === iIndex;
					}).sort();

					// create the unique suppliers array as array of of objects
					aUniqueSuppliers.map(function (sSupplierName, iIndex, aUniqueSuppliers) {
						aUniqueSuppliers[iIndex] = {SupplierName: sSupplierName};
					});
					this.getModel("view").setProperty("/Suppliers", aUniqueSuppliers);
				}.bind(this)
			});

			this._clearComparison();
		},

		fnDataReceived: function() {
			var oList = this.byId("productList");
			var aListItems = oList.getItems();
			aListItems.some(function(oItem) {
				if (oItem.getBindingContext().getPath() === "/Products('" + this._sProductId + "')") {
					oList.setSelectedItem(oItem);
					return true;
				}
			}.bind(this));
		},

		/**
		 * Event handler to determine which list item is selected
		 * @param {sap.ui.base.Event} oEvent the list select event
		 */
		onProductListSelect : function (oEvent) {
			this._showProduct(oEvent);
		},

		/**
		 * Event handler to determine which sap.m.ObjectListItem is pressed
		 * @param {sap.ui.base.Event} oEvent the sap.m.ObjectListItem press event
		 */


		onProductDetails: function (oEvent) {
			var oBindContext;
			if (Device.system.phone) {
				oBindContext = oEvent.getSource().getBindingContext();
			} else {
				oBindContext = oEvent.getSource().getSelectedItem().getBindingContext();
			}
			var oModel = oBindContext.getModel();
			var sCategoryId = oModel.getProperty(oBindContext.getPath()).Category;
			var sProductId = oModel.getProperty(oBindContext.getPath()).ProductId;

			// keep the cart context when showing a product
			var bCartVisible = this.getModel("appView").getProperty("/layout").startsWith("Three");
			this._setLayout("Two");
			this._oRouter.navTo(bCartVisible ? "productCart" : "product", {
				id: sCategoryId,
				productId: sProductId
			}, !Device.system.phone);
		},

		/** Apply selected filters to the category list and update text and visibility of the info toolbar
		 * @param {sap.ui.base.Event} oEvent the press event of the sap.m.Button
		 * @private
		 */
		_applyFilter : function (oEvent) {
			var oList = this.byId("productList"),
				oBinding = oList.getBinding("items"),
				aSelectedFilterItems = oEvent.getParameter("filterItems"),
				oCustomFilter =  this.byId("categoryFilterDialog").getFilterItems()[1],
				oFilter,
				oCustomKeys = {},
				aFilters = [],
				aAvailableFilters = [],
				aPriceFilters = [],
				aSupplierFilters = [];

			// Add the slider custom filter if the user selects some values
			if (oCustomFilter.getCustomControl().getAggregation("content")[0].getValue() !== oCustomFilter.getCustomControl().getAggregation("content")[0].getMin() ||
				oCustomFilter.getCustomControl().getAggregation("content")[0].getValue2() !== oCustomFilter.getCustomControl().getAggregation("content")[0].getMax()) {
				aSelectedFilterItems.push(oCustomFilter);
			}
			aSelectedFilterItems.forEach(function (oItem) {
				var sFilterKey = oItem.getProperty("key"),
					iValueLow,
					iValueHigh;
				switch (sFilterKey) {
					case "Available":
						oFilter = new Filter("Status", FilterOperator.EQ, "A");
						aAvailableFilters.push(oFilter);
						break;

					case "OutOfStock":
						oFilter = new Filter("Status", FilterOperator.EQ, "O");
						aAvailableFilters.push(oFilter);
						break;

					case "Discontinued":
						oFilter = new Filter("Status", FilterOperator.EQ, "D");
						aAvailableFilters.push(oFilter);
						break;

					case "Price":
						iValueLow = oItem.getCustomControl().getAggregation("content")[0].getValue();
						iValueHigh = oItem.getCustomControl().getAggregation("content")[0].getValue2();
						oFilter = new Filter("Price", FilterOperator.BT, iValueLow, iValueHigh);
						aPriceFilters.push(oFilter);
						oCustomKeys["priceKey"] = {Price: true};
						break;

					default:
						oFilter = new Filter("SupplierName", FilterOperator.EQ, sFilterKey);
						aSupplierFilters.push(oFilter);

				}
			});
			if (aAvailableFilters.length > 0) {
				aFilters.push(new Filter({filters: aAvailableFilters}));
			}
			if (aPriceFilters.length > 0) {
				aFilters.push(new Filter({filters: aPriceFilters}));
			}
			if (aSupplierFilters.length > 0) {
				aFilters.push(new Filter({filters: aSupplierFilters}));
			}
			oFilter = new Filter({filters: aFilters, and: true});
			if (aFilters.length > 0) {
				oBinding.filter(oFilter);
				this.byId("categoryInfoToolbar").setVisible(true);
				var sText = this.getResourceBundle().getText("filterByText") + " ";
				var sSeparator = "";
				var oFilterKey = oEvent.getParameter("filterCompoundKeys");
				var oKeys = Object.assign(oFilterKey, oCustomKeys);
				for (var key in oKeys) {
					if (oKeys.hasOwnProperty(key)) {
						sText = sText + sSeparator  + this.getResourceBundle().getText(key, [this._iLowFilterPreviousValue, this._iHighFilterPreviousValue]);
						sSeparator = ", ";
					}
				}
				this.byId("categoryInfoToolbarTitle").setText(sText);
			} else {
				oBinding.filter(null);
				this.byId("categoryInfoToolbar").setVisible(false);
				this.byId("categoryInfoToolbarTitle").setText("");
			}
		},

		/**
		 * Open the filter dialog
		 */
		onFilter: function () {
			// load asynchronous XML fragment
			if (!this._pCategoryFilterDialog) {
				this._pCategoryFilterDialog = Fragment.load({
					id: this.getView().getId(),
					name: "sap.ui.demo.cart.view.CategoryFilterDialog",
					controller: this
				}).then(function(oDialog){
					// connect dialog to the root view of this component (models, lifecycle)
					this.getView().addDependent(oDialog);
					oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					return oDialog;
				}.bind(this));
			}
			this._pCategoryFilterDialog.then(function(oDialog) {
				oDialog.open();
			});
		},

		/**
		 * Updates the previous slider values
		 * @param {sap.ui.base.Event} oEvent the press event of the sap.m.Button
		 */
		handleConfirm: function (oEvent) {
			var oCustomFilter = this.byId("categoryFilterDialog").getFilterItems()[1];
			var oSlider = oCustomFilter.getCustomControl().getAggregation("content")[0];
			this._iLowFilterPreviousValue = oSlider.getValue();
			this._iHighFilterPreviousValue = oSlider.getValue2();
			this._applyFilter(oEvent);
		},

		/**
		 * Sets the slider values to the previous ones
		 * Updates the filter count
		 */
		handleCancel: function () {
			var oCustomFilter = this.byId("categoryFilterDialog").getFilterItems()[1];
			var oSlider = oCustomFilter.getCustomControl().getAggregation("content")[0];
			oSlider.setValue(this._iLowFilterPreviousValue).setValue2(this._iHighFilterPreviousValue);
			if (this._iLowFilterPreviousValue > oSlider.getMin() || this._iHighFilterPreviousValue !== oSlider.getMax()) {
				oCustomFilter.setFilterCount(1);
			} else {
				oCustomFilter.setFilterCount(0);
			}
		},

		/**
		 * Updates filter count if there is a change in one of the slider values
		 * @param {sap.ui.base.Event} oEvent the change event of the sap.m.RangeSlider
		 */
		handleChange: function (oEvent) {
			var oCustomFilter = this.byId("categoryFilterDialog").getFilterItems()[1];
			var oSlider = oCustomFilter.getCustomControl().getAggregation("content")[0];
			var iLowValue = oEvent.getParameter("range")[0];
			var iHighValue = oEvent.getParameter("range")[1];
			if (iLowValue !== oSlider.getMin() || iHighValue !== oSlider.getMax()) {
				oCustomFilter.setFilterCount(1);
			} else {
				oCustomFilter.setFilterCount(0);
			}
		},

		/**
		 * Reset the price custom filter
		 */
		handleResetFilters: function () {
			var oCustomFilter = this.byId("categoryFilterDialog").getFilterItems()[1];
			var oSlider = oCustomFilter.getCustomControl().getAggregation("content")[0];
			oSlider.setValue(oSlider.getMin());
			oSlider.setValue2(oSlider.getMax());
			oCustomFilter.setFilterCount(0);
		},

		/**
		 * Navigation to comparison view
		 * @param {sap.ui.base.Event} oEvent the press event of the link text in sap.m.ObjectListItem
		 */
		compareProducts: function (oEvent) {
			var oProduct = oEvent.getSource().getBindingContext().getObject();
			var sItem1Id = this.getModel("comparison").getProperty("/item1");
			var sItem2Id = this.getModel("comparison").getProperty("/item2");
			this._oRouter.navTo("comparison", {
				id : oProduct.Category,
				item1Id : (sItem1Id ? sItem1Id : oProduct.ProductId),
				item2Id : (sItem1Id && sItem1Id != oProduct.ProductId ? oProduct.ProductId : sItem2Id)
			}, true);
		},
		/**
		 * Always navigates back to category overview
		 * @override
		 */
		onBack: function () {
			this.getRouter().navTo("categories");
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/Checkout.controller", [
	"./BaseController",
	"../model/EmailType",
	"../model/formatter",
	"sap/m/Link",
	"sap/m/MessageBox",
	"sap/m/MessageItem",
	"sap/m/MessagePopover",
	"sap/ui/core/Messaging",
	"sap/ui/model/json/JSONModel"
], function (
	BaseController,
	EmailType,
	formatter,
	Link,
	MessageBox,
	MessageItem,
	MessagePopover,
	Messaging,
	JSONModel
) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.Checkout", {

		types : {
			email: new EmailType()
		},

		formatter: formatter,

		onInit: function () {
			var oModel = new JSONModel(
				{
					SelectedPayment: "Credit Card",
					SelectedDeliveryMethod: "Standard Delivery",
					DifferentDeliveryAddress: false,
					CashOnDelivery: {
						FirstName: "",
						LastName: "",
						PhoneNumber: "",
						Email: ""
					},
					InvoiceAddress: {
						Address: "",
						City: "",
						ZipCode: "",
						Country: "",
						Note: ""
					},
					DeliveryAddress: {
						Address: "",
						Country: "",
						City: "",
						ZipCode: "",
						Note: ""
					},
					CreditCard: {
						Name: "",
						CardNumber: "",
						SecurityCode: "",
						Expire: ""
					}
				}),
				oReturnToShopButton = this.byId("returnToShopButton");

			this.setModel(oModel);

			// previously selected entries in wizard
			this._oHistory = {
				prevPaymentSelect: null,
				prevDiffDeliverySelect: null
			};

			// Assign the model object to the SAPUI5 core
			this.setModel(Messaging.getMessageModel(), "message");

			// switch to single column view for checout process
			this.getRouter().getRoute("checkout").attachMatched(function () {
				this._setLayout("One");
			}.bind(this));

			// set focus to the "Return to Shop" button each time the view is shown to avoid losing
			// the focus after changing the layout to one column
			this.getView().addEventDelegate({
				onAfterShow : function () {
					oReturnToShopButton.focus();
				}
			});
		},

		/**
		 * Only validation on client side, does not involve a back-end server.
		 * @param {sap.ui.base.Event} oEvent Press event of the button to display the MessagePopover
		 */
		onShowMessagePopoverPress: function (oEvent) {
			var oButton = oEvent.getSource(),
				oMessagePopover;

			var oLink = new Link({
				text: "Show more information",
				href: "http://sap.com",
				target: "_blank"
			});

			/**
			 * Gather information that will be visible on the MessagePopover
			 */
			var oMessageTemplate = new MessageItem({
				type: '{message>type}',
				title: '{message>message}',
				subtitle: '{message>additionalText}',
				link: oLink
			});

			if (!this.byId("errorMessagePopover")) {
				oMessagePopover = new MessagePopover(this.createId("messagePopover"), {
					items: {
						path: 'message>/',
						template: oMessageTemplate
					},
					afterClose: function () {
						oMessagePopover.destroy();
					}
				});
				this._addDependent(oMessagePopover);
			}

			oMessagePopover.openBy(oButton);
		},

		//To be able to stub the addDependent function in unit test, we added it in a separate function
		_addDependent: function (oMessagePopover) {
			this.getView().addDependent(oMessagePopover);
		},

		/**
		 * Shows next WizardStep according to user selection
		 */
		goToPaymentStep: function () {
			var selectedKey = this.getModel().getProperty("/SelectedPayment");
			var oElement = this.byId("paymentTypeStep");
			switch (selectedKey) {
				case "Bank Transfer":
					oElement.setNextStep(this.byId("bankAccountStep"));
					break;
				case "Cash on Delivery":
					oElement.setNextStep(this.byId("cashOnDeliveryStep"));
					break;
				case "Credit Card":
				default:
					oElement.setNextStep(this.byId("creditCardStep"));
					break;
			}
		},

		/**
		 * Shows warning message if user changes previously selected payment method
		 */
		setPaymentMethod: function () {
			this._setDiscardableProperty({
				message: this.getResourceBundle().getText("checkoutControllerChangePayment"),
				discardStep: this.byId("paymentTypeStep"),
				modelPath: "/SelectedPayment",
				historyPath: "prevPaymentSelect"
			});
		},

		/**
		 * Shows warning message if user changes previously selected delivery address
		 */
		setDifferentDeliveryAddress: function () {
			this._setDiscardableProperty({
				message: this.getResourceBundle().getText("checkoutControllerChangeDelivery"),
				discardStep: this.byId("invoiceStep"),
				modelPath: "/DifferentDeliveryAddress",
				historyPath: "prevDiffDeliverySelect"
			});
		},

		/**
		 * Called from WizardStep "invoiceStep"
		 * shows next WizardStep "DeliveryAddressStep" or "DeliveryTypeStep" according to user selection
		 */
		invoiceAddressComplete: function () {
			var sNextStepId = (this.getModel().getProperty("/DifferentDeliveryAddress"))
				? "deliveryAddressStep"
				: "deliveryTypeStep";
			this.byId("invoiceStep").setNextStep(this.byId(sNextStepId));

		},

		/**
		 * Called from <code>ordersummary</code>
		 * shows warning message and cancels order if confirmed
		 */
		handleWizardCancel: function () {
			var sText = this.getResourceBundle().getText("checkoutControllerAreYouSureCancel");
			this._handleSubmitOrCancel(sText, "warning", "home");
		},

		/**
		 * Called from <code>ordersummary</code>
		 * shows warning message and submits order if confirmed
		 */
		handleWizardSubmit: function () {
			var sText = this.getResourceBundle().getText("checkoutControllerAreYouSureSubmit");
			this._handleSubmitOrCancel(sText, "confirm", "ordercompleted");
		},

		/**
		 * Called from <code>_handleSubmitOrCancel</code>
		 * resets Wizard after submitting or canceling order
		 */
		backToWizardContent: function () {
			this.byId("wizardNavContainer").backToPage(this.byId("wizardContentPage").getId());
		},

		/**
		 * Removes validation error messages from the previous step
		 */
		_clearMessages: function () {
			Messaging.removeAllMessages();
		},

		/**
		 * Checks the corresponding step after activation to decide whether the user can proceed or needs
		 * to correct the input
		 * @param {sap.ui.base.Event} oEvent Event object
		 */
		onCheckStepActivation: function(oEvent) {
			this._clearMessages();
			var sWizardStepId = oEvent.getSource().getId();
			switch (sWizardStepId) {
			case this.createId("creditCardStep"):
				this.checkCreditCardStep();
				break;
			case this.createId("cashOnDeliveryStep"):
				this.checkCashOnDeliveryStep();
				break;
			case this.createId("invoiceStep"):
				this.checkInvoiceStep();
				break;
			case this.createId("deliveryAddressStep"):
				this.checkDeliveryAddressStep();
				break;
			}
		},

		/**
		 * Validates the credit card step initially and after each input
		 */
		checkCreditCardStep: function () {
			this._checkStep("creditCardStep", ["creditCardHolderName", "creditCardNumber", "creditCardSecurityNumber", "creditCardExpirationDate"]);
		},

		/**
		 * Validates the cash on delivery step initially and after each input
		 */
		checkCashOnDeliveryStep: function () {
			this._checkStep("cashOnDeliveryStep", ["cashOnDeliveryName", "cashOnDeliveryLastName", "cashOnDeliveryPhoneNumber", "cashOnDeliveryEmail"]);
		},

		/**
		 * Validates the invoice step initially and after each input
		*/
		checkInvoiceStep: function () {
			this._checkStep("invoiceStep", ["invoiceAddressAddress", "invoiceAddressCity", "invoiceAddressZip", "invoiceAddressCountry"]);
		},

		/**
		 * Validates the delivery address step initially and after each input
		 */
		checkDeliveryAddressStep: function () {
			this._checkStep("deliveryAddressStep", ["deliveryAddressAddress", "deliveryAddressCity", "deliveryAddressZip", "deliveryAddressCountry"]);
		},

		/**
		 * Checks if one or more of the inputs are empty
		 * @param {array} aInputIds - Input ids to be checked
		 * @returns {boolean} Whether at least one input field contains invalid data
		 * @private
		 */
		_checkInputFields : function (aInputIds) {
			var oView = this.getView();

			return aInputIds.some(function (sInputId) {
				var oInput = oView.byId(sInputId);
				var oBinding = oInput.getBinding("value");
				try {
					oBinding.getType().validateValue(oInput.getValue());
				} catch (oException) {
					return true;
				}
				return false;
			});
		},

		/**
		 * Hides button to proceed to next WizardStep if validation conditions are not fulfilled
		 * @param {string} sStepName - the ID of the step to be checked
		 * @param {array} aInputIds - Input IDs to be checked
		 * @private
		 */
		_checkStep: function (sStepName, aInputIds) {
			var oWizard = this.byId("shoppingCartWizard"),
				oStep = this.byId(sStepName),
				bEmptyInputs = this._checkInputFields(aInputIds),
				bValidationError = !!Messaging.getMessageModel().getData().length;

			if (!bValidationError && !bEmptyInputs) {
				oWizard.validateStep(oStep);
			} else {
				oWizard.invalidateStep(oStep);
			}
		},

		/**
		 * Called from  Wizard on <code>complete</code>
		 * Navigates to the summary page in case there are no errors
		 */
		checkCompleted: function () {
			if (Messaging.getMessageModel().getData().length > 0) {
				MessageBox.error(this.getResourceBundle().getText("popOverMessageText"));
			} else {
				this.byId("wizardNavContainer").to(this.byId("summaryPage"));
			}
		},

		/**
		 * navigates to "home" for further shopping
		 */
		onReturnToShopButtonPress: function () {
			this._setLayout("Two");
			this.getRouter().navTo("home");
		},

		// *** the following functions are private "helper" functions ***

		/**
		 * Called from both <code>setPaymentMethod</code> and <code>setDifferentDeliveryAddress</code> functions.
		 * Shows warning message if user changes previously selected choice
		 * @private
		 * @param {Object} oParams Object containing message text, model path and WizardSteps
		 */
		_setDiscardableProperty: function (oParams) {
			var oWizard = this.byId("shoppingCartWizard");
			if (oWizard.getProgressStep() !== oParams.discardStep) {
				MessageBox.warning(oParams.message, {
					actions: [MessageBox.Action.YES,
						MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {
							oWizard.discardProgress(oParams.discardStep);
							this._oHistory[oParams.historyPath] = this.getModel().getProperty(oParams.modelPath);
						} else {
							this.getModel().setProperty(oParams.modelPath, this._oHistory[oParams.historyPath]);
						}
					}.bind(this)
				});
			} else {
				this._oHistory[oParams.historyPath] = this.getModel().getProperty(oParams.modelPath);
			}
		},

		/**
		 * Called from <code>handleWizardCancel</code> and <code>handleWizardSubmit</code> functions.
		 * Shows warning message, resets shopping cart and wizard if confirmed and navigates to given route
		 * @private
		 * @param {string} sMessage message text
		 * @param {string} sMessageBoxType message box type (e.g. warning)
		 * @param {string} sRoute route to navigate to
		 */
		_handleSubmitOrCancel: function (sMessage, sMessageBoxType, sRoute) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES,
					MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						// resets Wizard
						var oWizard = this.byId("shoppingCartWizard");
						var oModel = this.getModel();
						var oCartModel = this.getOwnerComponent().getModel("cartProducts");
						this._navToWizardStep(this.byId("contentsStep"));
						oWizard.discardProgress(oWizard.getSteps()[0]);
						var oModelData = oModel.getData();
						oModelData.SelectedPayment = "Credit Card";
						oModelData.SelectedDeliveryMethod = "Standard Delivery";
						oModelData.DifferentDeliveryAddress = false;
						oModelData.CashOnDelivery = {};
						oModelData.InvoiceAddress = {};
						oModelData.DeliveryAddress = {};
						oModelData.CreditCard = {};
						oModel.setData(oModelData);
						//all relevant cart properties are set back to default. Content is deleted.
						var oCartModelData = oCartModel.getData();
						oCartModelData.cartEntries = {};
						oCartModelData.totalPrice = 0;
						oCartModel.setData(oCartModelData);
						this.getRouter().navTo(sRoute);
					}
				}.bind(this)
			});
		},

		/**
		 * gets customData from ButtonEvent
		 * and navigates to WizardStep
		 * @private
		 * @param {sap.ui.base.Event} oEvent the press event of the button
		 */
		_navBackToStep: function (oEvent) {
			var sStep = oEvent.getSource().data("navBackTo");
			var oStep = this.byId(sStep);
			this._navToWizardStep(oStep);
		},

		/**
		 * navigates to WizardStep
		 * @private
		 * @param {Object} oStep WizardStep DOM element
		 */
		_navToWizardStep: function (oStep) {
			var oNavContainer = this.byId("wizardNavContainer");
			var _fnAfterNavigate = function () {
				this.byId("shoppingCartWizard").goToStep(oStep);
				// detaches itself after navigaton
				oNavContainer.detachAfterNavigate(_fnAfterNavigate);
			}.bind(this);

			oNavContainer.attachAfterNavigate(_fnAfterNavigate);
			oNavContainer.to(this.byId("wizardContentPage"));
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/Comparison.controller", [
	'./BaseController',
	'../model/formatter'
], function (
	BaseController,
	formatter) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.Comparison", {
		formatter: formatter,
		onInit: function () {
			this._oRouter = this.getRouter();
			this._oRouter.getRoute("comparison").attachPatternMatched(this._onRoutePatternMatched, this);
			this._oRouter.getRoute("comparisonCart").attachPatternMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			var oContainer = this.byId("comparisonContainer");
			var oParameters = oEvent.getParameter("arguments");
			var oPlaceholder = this.byId("placeholder");

			// save category and current products
			this.getModel("comparison").setProperty("/category", oParameters.id);
			this.getModel("comparison").setProperty("/item1", oParameters.item1Id);
			this.getModel("comparison").setProperty("/item2", oParameters.item2Id);

			// update the comparison panels
			oPlaceholder.setVisible(false);
			updatePanel(0, oParameters.item1Id);
			updatePanel(1, oParameters.item2Id);

			// helper function to update the panel binding
			function updatePanel (iWhich, sId) {
				var oPanel = oContainer.getItems()[iWhich];
				if (sId){
					var sPath = "/Products('" + sId + "')";
					oPanel.bindElement({
						path: sPath
					});
					oPanel.setVisible(true);
				} else {
					oPanel.unbindElement();
					oPanel.setVisible(false);
					oPlaceholder.setVisible(true);
				}
			}
		},

		onRemoveComparison: function (oEvent){
			var oBinding = oEvent.getSource().getBindingContext();
			var sItem1Id = this.getModel("comparison").getProperty("/item1");
			var bRemoveFirst = sItem1Id === oBinding.getObject().ProductId;
			var sRemainingItemId = this.getModel("comparison").getProperty("/item" + (bRemoveFirst ? 2 : 1));
			var sCategory = this.getModel("comparison").getProperty("/category");

			// navigate to comparison view without the removed product
			this.getRouter().navTo("comparison", {
				id : sCategory,
				item1Id : sRemainingItemId
			}, true);
		},

		/**
		 * Navigate to the generic cart view
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		onToggleCart: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			var sItem1Id = this.getView().getModel("comparison").getProperty("/item1");
			var sItem2Id = this.getView().getModel("comparison").getProperty("/item2");
			var sCategory = this.getView().getModel("comparison").getProperty("/category");

			this._setLayout(bPressed ? "Three" : "Two");
			this.getRouter().navTo(bPressed ? "comparisonCart" : "comparison", {
				id: sCategory,
				item1Id: sItem1Id,
				item2Id: sItem2Id
			});
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/Home.controller", [
	"./BaseController",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device"
], function (
	BaseController,
	formatter,
	Filter,
	FilterOperator,
	Device) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.Home", {
		formatter : formatter,

		onInit: function () {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._router.getRoute("categories").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function() {
			var bSmallScreen = this.getModel("appView").getProperty("/smallScreenMode");
			if (bSmallScreen) {
				this._setLayout("One");
			}
		},

		onSearch: function () {
			this._search();
		},

		onRefresh: function () {
			// trigger search again and hide pullToRefresh when data ready
			var oProductList = this.byId("productList");
			var oBinding = oProductList.getBinding("items");
			var fnHandler = function () {
				this.byId("pullToRefresh").hide();
				oBinding.detachDataReceived(fnHandler);
			}.bind(this);
			oBinding.attachDataReceived(fnHandler);
			this._search();
		},

		_search: function () {
			var oView = this.getView();
			var oProductList = oView.byId("productList");
			var oCategoryList = oView.byId("categoryList");
			var oSearchField = oView.byId("searchField");

			// switch visibility of lists
			var bShowSearchResults = oSearchField.getValue().length !== 0;
			oProductList.setVisible(bShowSearchResults);
			oCategoryList.setVisible(!bShowSearchResults);

			// filter product list
			var oBinding = oProductList.getBinding("items");
			if (oBinding) {
				if (bShowSearchResults) {
					var oFilter = new Filter("Name", FilterOperator.Contains, oSearchField.getValue());
					oBinding.filter([oFilter]);
				} else {
					oBinding.filter([]);
				}
			}
		},

		onCategoryListItemPress: function (oEvent) {
			var oBindContext = oEvent.getSource().getBindingContext();
			var oModel = oBindContext.getModel();
			var sCategoryId = oModel.getProperty(oBindContext.getPath()).Category;

			this._router.navTo("category", {id: sCategoryId});
		},

		onProductListSelect: function (oEvent) {
			var oItem = oEvent.getParameter("listItem");
			this._showProduct(oItem);
		},

		onProductListItemPress: function (oEvent) {
			var oItem = oEvent.getSource();
			this._showProduct(oItem);
		},

		_showProduct: function (oItem) {
			var oEntry = oItem.getBindingContext().getObject();

			this._router.navTo("product", {
				id: oEntry.Category,
				productId: oEntry.ProductId
			}, !Device.system.phone);
		},

		/**
		 * Always navigates back to home
		 * @override
		 */
		onBack: function () {
			this.getRouter().navTo("home");
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/NotFound.controller", [
	"./BaseController",
	"sap/ui/core/UIComponent"
], function(BaseController, UIComponent) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.NotFound", {
		onInit: function () {
			this._router = UIComponent.getRouterFor(this);
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/OrderCompleted.controller", [
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.OrderCompleted", {

		onInit: function () {
			this._oRouter = this.getRouter();
		},

		onReturnToShopButtonPress: function () {
			//navigates back to home screen
			this._setLayout("Two");
			this._oRouter.navTo("home");
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/Product.controller", [
	"./BaseController",
	"../model/formatter"
], function(
	BaseController,
	formatter) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.Product", {
		formatter : formatter,

		onInit : function () {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._router.getRoute("product").attachPatternMatched(this._routePatternMatched, this);

			this._router.getTarget("product").attachDisplay(function (oEvent) {
				this.fnUpdateProduct(oEvent.getParameter("data").productId);// update the binding based on products cart selection
			}, this);
		},

		_routePatternMatched: function(oEvent) {
			var sId = oEvent.getParameter("arguments").productId,
				oView = this.getView(),
				oModel = oView.getModel();
			// the binding should be done after insuring that the metadata is loaded successfully
			oModel.metadataLoaded().then(function () {
				var sPath = "/" + this.getModel().createKey("Products", {
						ProductId: sId
					});
				oView.bindElement({
					path : sPath,
					events: {
						dataRequested: function () {
							oView.setBusy(true);
						},
						dataReceived: function () {
							oView.setBusy(false);
						}
					}
				});
				var oData = oModel.getProperty(sPath);
				//if there is no data the model has to request new data
				if (!oData) {
					oView.setBusyIndicatorDelay(0);
					oView.getElementBinding().attachEventOnce("dataReceived", function() {
						// reset to default
						oView.setBusyIndicatorDelay(null);
						this._checkIfProductAvailable(sPath);
					}.bind(this));
				}
			}.bind(this));
		},

		fnUpdateProduct: function(productId) {
			var sPath = "/Products('" + productId + "')",
				fnCheck = function () {
					this._checkIfProductAvailable(sPath);
				};

			this.getView().bindElement({
				path: sPath,
				events: {
					change: fnCheck.bind(this)
				}
			});
		},

		_checkIfProductAvailable: function(sPath) {
			var oModel = this.getModel();
			var oData = oModel.getProperty(sPath);

			// show not found page
			if (!oData) {
				this._router.getTargets().display("notFound");
			}
		},

		/**
		 * Navigate to the generic cart view
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		onToggleCart: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			var oEntry = this.getView().getBindingContext().getObject();

			this._setLayout(bPressed ? "Three" : "Two");
			this.getRouter().navTo(bPressed ? "productCart" : "product", {
				id: oEntry.Category,
				productId: oEntry.ProductId
			});
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/controller/Welcome.controller", [
	"./BaseController",
	"../model/cart",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/formatter"
], function (BaseController, cart, JSONModel, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.Welcome", {

		_iCarouselTimeout: 0, // a pointer to the current timeout
		_iCarouselLoopTime: 8000, // loop to next picture after 8 seconds

		formatter: formatter,

		_mFilters: {
			Promoted: [new Filter("Type", FilterOperator.EQ, "Promoted")],
			Viewed: [new Filter("Type", FilterOperator.EQ, "Viewed")],
			Favorite: [new Filter("Type", FilterOperator.EQ, "Favorite")]
		},

		onInit: function () {
			var oViewModel = new JSONModel({
				welcomeCarouselShipping: 'sap/ui/demo/cart/img/Shipping_273087.jpg',
				welcomeCarouselInviteFriend: 'sap/ui/demo/cart/img/InviteFriend_276352.jpg',
				welcomeCarouselTablet: 'sap/ui/demo/cart/img/Tablet_275777.jpg',
				welcomeCarouselCreditCard: 'sap/ui/demo/cart/img/CreditCard_277268.jpg',
				Promoted: [],
				Viewed: [],
				Favorite: [],
				Currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
			this.getRouter().attachRouteMatched(this._onRouteMatched, this);

			// select random carousel page at start
			var oWelcomeCarousel = this.byId("welcomeCarousel");
			var iRandomIndex = Math.floor(Math.abs(Math.random()) * oWelcomeCarousel.getPages().length);
			oWelcomeCarousel.setActivePage(oWelcomeCarousel.getPages()[iRandomIndex]);
		},

		/**
		 * lifecycle hook that will initialize the welcome carousel
		 */
		onAfterRendering: function () {
			this.onCarouselPageChanged();
		},

		_onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");

			// always display two columns for home screen
			if (sRouteName === "home") {
				this._setLayout("Two");
			}
			// we do not need to call this function if the url hash refers to product or cart product
			if (sRouteName !== "product" && sRouteName !== "cartProduct") {
				var aPromotedData = this.getView().getModel("view").getProperty("/Promoted");
				if (!aPromotedData.length) {
					var oModel = this.getModel();
					Object.keys(this._mFilters).forEach(function (sFilterKey) {
						oModel.read("/FeaturedProducts", {
							urlParameters: {
								"$expand": "Product"
							},
							filters: this._mFilters[sFilterKey],
							success: function (oData) {
								this.getModel("view").setProperty("/" + sFilterKey, oData.results);
								if (sFilterKey === "Promoted") {
									this._selectPromotedItems();
								}
							}.bind(this)
						});
					}.bind(this));
				}
			}
		},

		/**
		 * clear previous animation and initialize the loop animation of the welcome carousel
		 */
		onCarouselPageChanged: function () {
			clearTimeout(this._iCarouselTimeout);
			this._iCarouselTimeout = setTimeout(function () {
				var oWelcomeCarousel = this.byId("welcomeCarousel");
				if (oWelcomeCarousel) {
					oWelcomeCarousel.next();
					this.onCarouselPageChanged();
				}
			}.bind(this), this._iCarouselLoopTime);
		},

		/**
		 * Event handler to determine which link the user has clicked
		 * @param {sap.ui.base.Event} oEvent the press event of the link
		 */
		onSelectProduct: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext("view");
			var sCategoryId = oContext.getProperty("Product/Category");
			var sProductId = oContext.getProperty("Product/ProductId");
			this.getRouter().navTo("product", {
				id: sCategoryId,
				productId: sProductId
			});
		},

		/**
		 * Navigates to the category overview on phones
		 */
		onShowCategories: function () {
			this.getRouter().navTo("categories");
		},

		/**
		 * Event handler to determine which button was clicked
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		onAddToCart: function (oEvent) {
			var oResourceBundle = this.getModel("i18n").getResourceBundle();
			var oProduct = oEvent.getSource().getBindingContext("view").getObject();
			var oCartModel = this.getModel("cartProducts");
			cart.addToCart(oResourceBundle, oProduct, oCartModel);
		},

		/**
		 * Navigate to the generic cart view
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		onToggleCart: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");

			this._setLayout(bPressed ? "Three" : "Two");
			this.getRouter().navTo(bPressed ? "cart" : "home");
		},

		/**
		 * Select two random elements from the promoted products array
		 * @private
		 */
		_selectPromotedItems: function () {
			var aPromotedItems = this.getView().getModel("view").getProperty("/Promoted");
			var iRandom1, iRandom2 = Math.floor(Math.random() * aPromotedItems.length);
			do {
				iRandom1 = Math.floor(Math.random() * aPromotedItems.length);
			} while (iRandom1 === iRandom2);
			this.getModel("view").setProperty("/Promoted", [aPromotedItems[iRandom1], aPromotedItems[iRandom2]]);
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/initMockServer", [
	"sap/ui/demo/cart/localService/mockserver"
], function (mockserver) {
	"use strict";

	// initialize the mock server
	mockserver.init().catch(function (oError) {
		// load MessageBox only when needed as it otherwise bypasses the preload of sap.m
		sap.ui.require(["sap/m/MessageBox"], function(MessageBox) {
			MessageBox.error(oError.message);
		});
	}).finally(function () {
		// initialize the embedded component on the HTML page
		sap.ui.require(["sap/ui/core/ComponentSupport"]);
	});

});
sap.ui.predefine("sap/ui/demo/cart/localService/mockserver", [
	"sap/ui/core/util/MockServer",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function (
	MockServer,
	JSONModel,
	Log) {
	"use strict";

	var oMockServer,
		_sAppPath = "sap/ui/demo/cart/",
		_sJsonFilesPath = _sAppPath + "localService/mockdata";

	var oMockServerInterface = {

		/**
		 * Initializes the mock server asynchronously.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @protected
		 * @param {object} [oOptionsParameter] init parameters for the mockserver
		 * @returns{Promise} a promise that is resolved when the mock server has been started
		 */
		init : function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			return new Promise(function(fnResolve, fnReject) {
				var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
					oManifestModel = new JSONModel(sManifestUrl);

				oManifestModel.attachRequestCompleted(function ()  {
					var oUriParameters = new URLSearchParams(window.location.search),
						// parse manifest for local metadata URI
						sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath),
						oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/mainService"),
						sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri),
						// ensure there is a trailing slash
						sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";

					// create a mock server instance or stop the existing one to reinitialize
					if (!oMockServer) {
						oMockServer = new MockServer({
							rootUri: sMockServerUrl
						});
					} else {
						oMockServer.stop();
					}

					// configure mock server with the given options or a default delay of 0.5s
					MockServer.config({
						autoRespond : true,
						autoRespondAfter : (oOptions.delay || oUriParameters.get("serverDelay") || 500)
					});

					// simulate all requests using mock data
					oMockServer.simulate(sMetadataUrl, {
						sMockdataBaseUrl : sJsonFilesUrl,
						bGenerateMissingMockData : true
					});

					var aRequests = oMockServer.getRequests();

					// compose an error response for requesti
					var fnResponse = function (iErrCode, sMessage, aRequest) {
						aRequest.response = function(oXhr){
							oXhr.respond(iErrCode, {"Content-Type": "text/plain;charset=utf-8"}, sMessage);
						};
					};

					// simulate metadata errors
					if (oOptions.metadataError || oUriParameters.get("metadataError")) {
						aRequests.forEach(function (aEntry) {
							if (aEntry.path.toString().indexOf("$metadata") > -1) {
								fnResponse(500, "metadata Error", aEntry);
							}
						});
					}

					// simulate request errors
					var sErrorParam = oOptions.errorType || oUriParameters.get("errorType"),
						iErrorCode = sErrorParam === "badRequest" ? 400 : 500;
					if (sErrorParam) {
						aRequests.forEach(function (aEntry) {
							fnResponse(iErrorCode, sErrorParam, aEntry);
						});
					}

					// custom mock behaviour may be added here

					// set requests and start the server
					oMockServer.setRequests(aRequests);
					oMockServer.start();

					Log.info("Running the app with mock data");
					fnResolve();
				});

				oManifestModel.attachRequestFailed(function () {
					var sError = "Failed to load application manifest";

					Log.error(sError);
					fnReject(new Error(sError));
				});
			});
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer : function () {
			return oMockServer;
		}
	};

	return oMockServerInterface;
});
sap.ui.predefine("sap/ui/demo/cart/model/EmailType", [
	"sap/ui/model/type/String",
	"sap/ui/model/ValidateException",
	"sap/ui/model/resource/ResourceModel"
], function (String, ValidateException, ResourceModel) {
	"use strict";

	var oResourceModel = new ResourceModel({
		bundleName: "sap.ui.demo.cart.i18n.i18n"
	});

	return String.extend("sap.ui.demo.cart.model.EmailType", {

		/**
		 * Validates the value to be parsed
		 *
		 * @public
		 * Since there is only true and false, no client side validation is required
		 * @returns {string}
		 */
		validateValue: function (oValue) {
			// The following Regex is NOT covering all cases of RFC 5322 and only used for demonstration purposes.
			var rEMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

			if (!oValue.match(rEMail)) {
				throw new ValidateException(oResourceModel.getResourceBundle().getText("checkoutCodEmailValueTypeMismatch", [oValue]));
			}
		}

	});
});
sap.ui.predefine("sap/ui/demo/cart/model/LocalStorageModel", [
	"sap/ui/model/json/JSONModel",
	"sap/ui/util/Storage"
], function(JSONModel, Storage) {
	"use strict";

	return JSONModel.extend("sap.ui.demo.cart.model.CartModel", {

		_STORAGE_KEY : "LOCALSTORAGE_MODEL",
		_storage : new Storage(Storage.Type.local),

		/**
		 * Fetches the favorites from local storage and sets up the JSON model
		 * By default the string "LOCALSTORAGE_MODEL" is used but it is recommended to set a custom key
		 * to avoid name clashes with other apps or other instances of this model class

		 * @param {string} sStorageKey storage key that will be used as an id for the local storage data
		 * @param {Object} oSettings settings objec that is passed to the JSON model constructor
		 * @return {sap.ui.demo.cart.model.LocalStorageModel} the local storage model instance
		 */
		constructor : function(sStorageKey, oSettings) {
			// call super constructor with everything from the second argument
			JSONModel.apply(this, [].slice.call(arguments, 1));
			this.setSizeLimit(1000000);

			// override default storage key
			if (sStorageKey) {
				this._STORAGE_KEY = sStorageKey;
			}

			// load data from local storage
			this._loadData();

			return this;
		},

		/**
		 * Loads the current state of the model from local storage
		 */
		_loadData : function() {
			var sJSON = this._storage.get(this._STORAGE_KEY);

			if (sJSON) {
				this.setData(JSON.parse(sJSON));
			}
			this._bDataLoaded = true;
		},

		/**
		 * Saves the current state of the model to local storage
		 */
		_storeData : function() {
			var oData = this.getData();

			// update local storage with current data
			var sJSON = JSON.stringify(oData);
			this._storage.put(this._STORAGE_KEY, sJSON);
		},

		/**
		 * Sets a property for the JSON model
		 * @override
		 */
		setProperty : function () {
			JSONModel.prototype.setProperty.apply(this, arguments);
			this._storeData();
		},

		/**
		 * Sets the data for the JSON model
		 * @override
		 */
		setData : function () {
			JSONModel.prototype.setData.apply(this, arguments);
			// called from constructor: only store data after first load
			if (this._bDataLoaded) {
				this._storeData();
			}
		},

		/**
		 * Refreshes the model with the current data
		 * @override
		 */
		refresh : function () {
			JSONModel.prototype.refresh.apply(this, arguments);
			this._storeData();
		}
	});
});
sap.ui.predefine("sap/ui/demo/cart/model/cart", [
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (
	MessageBox,
	MessageToast) {
	"use strict";

	return {

		/**
		 * Checks for the status of the product that is added to the cart.
		 * If the product is not available, a message dialog will open.
		 * @public
		 * @param {Object} oBundle i18n bundle
		 * @param {Object} oProduct Product that is added to the cart
		 * @param {Object} oCartModel Cart model
		 */
		addToCart: function (oBundle, oProduct, oCartModel) {
			// Items to be added from the welcome view have it's content inside product object
			if (oProduct.Product !== undefined) {
				oProduct = oProduct.Product;
			}
			switch (oProduct.Status) {
				case "D":
					//show message dialog
					MessageBox.show(
						oBundle.getText("productStatusDiscontinuedMsg"), {
							icon: MessageBox.Icon.ERROR,
							titles: oBundle.getText("productStatusDiscontinuedTitle"),
							actions: [MessageBox.Action.CLOSE]
						});
					break;
				case "O":
					// show message dialog
					MessageBox.show(
						oBundle.getText("productStatusOutOfStockMsg"), {
							icon: MessageBox.Icon.QUESTION,
							title: oBundle.getText("productStatusOutOfStockTitle"),
							actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
							onClose: function (oAction) {
								// order
								if (MessageBox.Action.OK === oAction) {
									this._updateCartItem(oBundle, oProduct, oCartModel);
								}
							}.bind(this)
						});
					break;
				case "A":
				default:
					this._updateCartItem(oBundle, oProduct, oCartModel);
					break;
			}
		},

		/**
		 * Function that updates the cart model when a product is added to the cart.
		 * If the product is already in the cart the quantity is increased.
		 * If not, the product is added to the cart with quantity 1.
		 * @private
		 * @param {Object} oBundle i18n bundle
		 * @param {Object} oProductToBeAdded Product that is added to the cart
		 * @param {Object} oCartModel Cart model
		 */
		_updateCartItem: function (oBundle, oProductToBeAdded, oCartModel) {
			// find existing entry for product
			var oCollectionEntries = Object.assign({}, oCartModel.getData()["cartEntries"]);
			var oCartEntry =  oCollectionEntries[oProductToBeAdded.ProductId];

			if (oCartEntry === undefined) {
				// create new entry
				oCartEntry = Object.assign({}, oProductToBeAdded);
				oCartEntry.Quantity = 1;
				oCollectionEntries[oProductToBeAdded.ProductId] = oCartEntry;
			} else {
				// update existing entry
				oCartEntry.Quantity += 1;
			}
			//update the cart model
			oCartModel.setProperty("/cartEntries", Object.assign({}, oCollectionEntries));
			oCartModel.refresh(true);
			MessageToast.show(oBundle.getText("productMsgAddedToCart", [oProductToBeAdded.Name] ));
		}
	};
});
sap.ui.predefine("sap/ui/demo/cart/model/formatter", [
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";

	var mStatusState = {
		"A": "Success",
		"O": "Warning",
		"D": "Error"
	};

	var formatter = {
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
		price: function (sValue) {
			var numberFormat = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			return numberFormat.format(sValue);
		},

		/**
		 * Sums up the price for all products in the cart
		 * @param {object} oCartEntries current cart entries
		 * @return {string} string with the total value
		 */
		totalPrice: function (oCartEntries) {
			var oBundle = this.getResourceBundle(),
				fTotalPrice = 0;

			Object.keys(oCartEntries).forEach(function (sProductId) {
				var oProduct = oCartEntries[sProductId];
				fTotalPrice += parseFloat(oProduct.Price) * oProduct.Quantity;
			});

			return oBundle.getText("cartTotalPrice", [formatter.price(fTotalPrice)]);
		},

		/**
		 * Returns the status text based on the product status
		 * @param {string} sStatus product status
		 * @return {string} the corresponding text if found or the original value
		 */
		statusText: function (sStatus) {
			var oBundle = this.getResourceBundle();

			var mStatusText = {
				"A": oBundle.getText("statusA"),
				"O": oBundle.getText("statusO"),
				"D": oBundle.getText("statusD")
			};

			return mStatusText[sStatus] || sStatus;
		},

		/**
		 * Returns the product state based on the status
		 * @param {string} sStatus product status
		 * @return {string} the state text
		 */
		statusState: function (sStatus) {
			return mStatusState[sStatus] || "None";
		},

		/**
		 * Returns the relative URL to a product picture
		 * @param {string} sUrl image URL
		 * @return {string} relative image URL
		 */
		pictureUrl: function (sUrl) {
			if (sUrl){
				return  sap.ui.require.toUrl(sUrl);
			} else {
				return undefined;
			}
		},

		/**
		 * Checks if one of the collections contains items.
		 * @param {object} oCollection1 First array or object to check
		 * @param {object} oCollection2 Second array or object to check
		 * @return {boolean} true if one of the collections is not empty, otherwise - false.
		 */
		hasItems: function (oCollection1, oCollection2) {
			var bCollection1Filled = !!(oCollection1 && Object.keys(oCollection1).length),
				bCollection2Filled = !!(oCollection2 && Object.keys(oCollection2).length);

			return bCollection1Filled || bCollection2Filled;
		}
	};

	return formatter;
});
sap.ui.predefine("sap/ui/demo/cart/model/models", [
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {
		createDeviceModel : function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}
	};

});
sap.ui.require.preload({
	"sap/ui/demo/cart/i18n/i18n.properties":'# This is the resource bundle for the shopping cart demo app\n\n#XTIT: Application name\nappTitle=Shopping Cart\n\n#YDES: Application description\nappDescription=The classic business process of finding and ordering products\n\n#~~~ Common ~~~~~~~~~~~~~~~~~~~~~~~~~~\n#XTIT\ntabTitle=Shopping Cart -\n\n#XTIT\ntableTitleCart= Your Cart\n\n#XTIT: Title for the favorite items\nfavoriteTitle=Favorites\n\n#XTIT: Title for App\nshellTitle=My Shopping Cart\n\n#XBUT: Button text for Cancel Button\ndialogCancelAction=Cancel\n\n#XTOL: Tooltip for add To cart button\ntoCartButtonTooltip=Show Shopping Cart\n\n#XFLD: Label for Status Available\nstatusA=Available\n\n#XFLD: Label for Status Out of Stock\nstatusO=Out of Stock\n\n#XFLD: Label for Status Discontinued\nstatusD=Discontinued\n\n#XTIT: Title for the Home View\nhomeTitle=Product Catalog\n\n#XMSG: Message for the Search Placeholder\nhomeSearchPlaceholder=Search\n\n#XMSG: MessageToast for Avatar Button\navatarButtonMessageToastText=You are now successfully logged in\n\n#XTOL: Tooltip for Avatar Button\navatarButtonTooltip=Login\n\n#XTOL: Tooltip for Search Field\nhomeSearchTooltip=Search\n\n#XMSG: Message for empty search\nhomeNoData=No products found\n\n#XTIT: Title for the Categories\nhomeCategoryListHeader=Categories\n\n#XTOL: Tooltip for the Categories\nopenCategoryProducts=Open category\n\n#XFLD: Label for ARIA Region root\nHome_rootLabel=Search and Navigation\n\n#XFLD: Label for ARIA Region subHeader\nHome_subHeaderLabel=Products\n\n#XFLD: Label for ARIA Region content\nHome_contentLabel=List Of Categories\n\n#XFLD: Label for ARIA Region root\nCategory_rootLabel=Category\n\n#XFLD: Label for ARIA Region content\nCategory_contentLabel=Items of Category\n\n#XFLD: Label for ARIA Region footer\nCategory_footerLabel=Filter\n\n#XFLD: Label for ARIA Region header\nCategory_headerLabel=Category Header\n\n#XFLD: Label for ARIA Region header\nHome_headerLabel=Home Header\n\n#XFLD: Label for ARIA Region header\nWelcome_headerLabel=Welcome Header\n\n#XFLD: Label for ARIA Region header\nCart_headerLabel=Shopping Cart Header\n\n#XMSG: Message for empty categories\ncategoryNoData=No products found\n\n#XTIT: Text for the info toolbar string\nfilterByText=Filtered by\n\n#XTIT: Text for availability\navailabilityKey=Availability\n\n#XTIT: Text for price\npriceKey=Price ({0} - {1} EUR)\n\n#XTIT: Text for supplier\nsupplierKey=Supplier\n\n#XFLD: Label for ARIA Region root\nNotFound_rootLabel=Not Found\n\n#XFLD: Label for ARIA Region content\nNotFound_contentLabel=Not Found - Nothing here\n\n#XFLD: Label for ARIA Region header\nNotFound_headerLabel=Not Found Header\n\n#~~~ Welcome Page ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Title of the welcome page\nwelcomeHeadline=Welcome to Our Shop\n\n#YMSG: Welcome page title tooltip\nwelcomeDescription=This demo application shows you how to use the sap.m library along the classical shopping cart use case. You can browse and search a catalog of products, add the chosen products into your shopping cart and once happy with your selection order the cart contents. SHOP TILL YOU DROP!\n\n#XTIT: Title of the carousel page with the shipping advertisement\nwelcomeCarouselShipping=Enjoy free shipping\\r\\nfor orders over 50 Euro\n\n#XTIT: Title of the carousel page with the referrer advertisement\nwelcomeCarouselInviteFriend=Refer a Friend\\r\\n Get 20 Euro credit!\n\n#XTIT: Title of the carousel page with the tablet advertisement\nwelcomeCarouselTablet=Deal of the Day\\r\\n10% on all tablets!\n\n#XTIT: Title of the carousel page with the credit card advertisement\nwelcomeCarouselCreditCard=Pay fast and safely\\r\\nwith Credit Card\n\n#XFLD: Label for ARIA Region root\nWelcome_rootLabel=Welcome Page\n\n#XFLD: Label for ARIA Region content\nWelcome_contentLabel=Selected Products\n\n#XMSG: Message for Welome\nwelcomeHeadline=Welcome to the Shopping Cart\n\n#YMSG: Message for Welcome Description\nwelcomeDescription=This demo app shows you how to use the sap.m library for a classical shopping cart. You can browse and search a catalog of products, add the chosen products to your shopping cart and, once happy with your selection order the cart contents.\n\n#XTIT: Title for the promoted items\npromotedTitle=Promoted Items\n\n#XTOL: Tooltip for the product links\nopenProductDetails=Open details for\n\n#XTIT: Title for the viewed items\nviewedTitle=Recently Viewed Items\n\n#XBUT: Button text for add To cart buttton\naddToCart=Add to Shopping Cart\n\n#XBUT: Button text (short) for add To cart buttton\naddToCartShort=Add to Cart\n\n#~~~ Product Details ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XBUT: Button text for add to cart button\nproductAddButtonText=Add to Cart\n\n#XTOL: Tooltip for add to cart button\nproductAddButtonTooltip=Add the product to your shopping cart\n\n#XMSG: Message for add to cart\nproductMsgAddedToCart=Product "{0}" added to your shopping cart\n\n#XTIT: Title for discontinued product\nproductStatusDiscontinuedTitle=Information\n\n#XMSG: Message for discontinued product\nproductStatusDiscontinuedMsg=This product has been discontinued and cannot be ordered anymore\n\n#XTIT: Title for Out Of Stock dialog\nproductStatusOutOfStockTitle=Confirmation\n\n#XMSG: Message for out of stock product\nproductStatusOutOfStockMsg=This product is currently out of stock, but you can order it. It will be shipped as soon as it\'s available again\n\n#XFLD: Label for Supplier\nproductSupplierAttributeText=Supplier\n\n#XFLD: Label for Product description\nproductDescriptionAttributeText=Description\n\n#XFLD: Label for product weight\nproductWeightAttributeText=Weight\n\n#XFLD: Label for product measures\nproductMeasuresAttributeText=Measures\n\n#XFLD: Label for ARIA Region root\nProduct_rootLabel=Product Details\n\n#XFLD: Label for ARIA Region content\nProduct_contentLabel=Product Description\n\n#XFLD: Label for ARIA Region header\nProduct_headerLabel=Product Header\n\n#XFLD: Label for ARIA Region footer\nProduct_footerLabel=Product Footer\n\n#XTIT: Alternative text for images\nalternativeImageText=This image shows\n\n#~~~ Cart ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Title for Edit Cart View\ncartTitleEdit=Edit Cart\n\n#XMSG: Message for empty cart\ncartNoData=Your cart is empty\n\n#XMSG: Message for empty saved for later\ncartNoItemsSavedForLater=No items saved for later\n\n#XMSG: Message for Total Price\ncartTotalPrice=Total: {0}\n\n#XBUT: Button text for proceed button\ncartProceedButtonText=Proceed\n\n#XBUT: Button text for done button\ncartDoneButtonText=Save Changes\n\n#XTOL: Tooltip for edit cart button\ncartEditButtonTooltip=Edit your cart\n\n#XTOL: Tooltip for close cart button\ncartCloseButtonTooltip=Close cart\n\n#XTIT: Title for Delete dialog\ncartDeleteDialogTitle=Confirmation\n\n#XMSG: Message for delete dialog\ncartDeleteDialogMsg=Do you want to remove this entry from your cart?\n\n#XMSG: Message for delete confirm\ncartDeleteDialogConfirmDeleteMsg=Product "{0}" removed from cart\n\n#XBUT: Button text for save for later button\ncartSaveForLaterLinkText=Save for Later\n\n#XBUT: Button text for add to cart button\ncartAddToCartLinkText=Add to Shopping Cart\n\n#XFLD: Label for ARIA Region root\nCart_rootLabel=Shopping Cart\n\n#XFLD: Label for ARIA Region content\nCart_contentLabel=Items in Shopping Cart\n\n#XTIT: Title for saved for later\ncartItemsSavedForLater=Items saved for later\n\n#XFLD: Label for ARIA Region footer\nCart_footerLabel=Shopping Cart Footer\n\n#~~~ Checkout Process ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XFLD: Label for ARIA Region root\nCheckout_rootLabel=Checkout\n\n#XFLD: Label for ARIA Region content\nCheckout_contentLabel=Checkout Wizard\n\n#XFLD: Label for ARIA Region content\nCheckout_summaryContentLabel=Checkout Summary\n\n#XFLD: Label for ARIA Region footer\nCheckout_footerLabel=Checkout Footer\n\n#XTXT: Placeholder text for first name\nfirstNameText: Enter your first name\n\n#XTXT: Placeholder text for last name\nlastNameText: Enter your last name\n\n#XTXT: Placeholder text for phone number\nphoneNumberText: Enter your phone number\n\n#XTXT: Placeholder text for e-mail address\nemailAddressText: Enter your email address\n\n#XTXT: Placeholder text for credit card holder name\ncreditCardHolderText: Enter card holder name\n\n#XTXT: Placeholder text for credit card number\ncreditCardNumberText: Enter card number\n\n#XTXT: Placeholder text for credit card security number\ncreditCardSecurityNumberText: Enter the 3-digits security number\n\n#XTXT: Placeholder text for address\naddressText: Enter your street name and house number\n\n#XTXT: Placeholder text for city name\ncityText: Enter your city\n\n#XTXT: Placeholder text for zip code\nzipCodeText: Enter your zip code\n\n#XTXT: Placeholder text for country name\ncountryText: Enter your country\n\n#XTXT: note text\nnoteText: Additional comments (max 500 characters)\n\n#XTXT: Beneficiary Name text\nbeneficiaryNameText=Singapore Hardware e-Commerce LTD\n\n#XTXT: Bank name text\nbankNameText=CITY BANK, SINGAPORE BRANCH\n\n#XTXT: Account number text\naccountNumberText=06110702027218\n\n#XTIT: Title for Checkout view\ncheckoutTitle=Checkout\n\n#XBUT: Button text for Wizard Finished Button\ncheckoutWizardReviewbtn=Order Summary\n\n#TOL: Button tooltip for back to wizard button\nbackToWizard=Back to Wizard\n\n#XTIT: Title for Wizard Contents Step\ncheckoutContentsTitle=Items\n\n#XTIT: Title for Wizard Payment Type Step\ncheckoutPaymentTitle=Payment Type\n\n#YMSG: Message for Payment Type\ncheckoutPaymentText=We accept all major credit cards with no additional charging. Bank transfer and cash on delivery are only possible for inland deliveries. For those, we will charge additional 2.99 EUR. Orders payed with bank transfer, will be shipped direcly after the payment is received.\n\n#XBUT: Button text for credit card button\ncheckoutPaymentCreditCard=Credit Card\n\n#XBUT: Button text for Bank Transfer button\ncheckoutPaymentBankTransfer=Bank Transfer\n\n#XBUT: Button text for COD button\ncheckoutPaymentCod=Cash on Delivery\n\n#XFLD: Label for Credit Card info\ncheckoutCreditCardCreditCardInfo=Credit Card Details\n\n#XFLD: Label for Credit Card name\ncheckoutCreditCardName=Cardholder\'s Name\n\n#XFLD: Label for Credit Card number\ncheckoutCreditCardCardNo=Card Number\n\n#XFLD: Label for Credit Card Security code\ncheckoutCreditCardCode=Security Code\n\n#XFLD: Label for Credit Card expiration date\ncheckoutCreditCardExpiration=Expiration Date (MM/YYYY)\n\n#XTIT: Title for Bankaccount Step\ncheckoutBankAccountTitle=Bank Account Details\n\n#XFLD: Label for Bankaccount Name\ncheckoutBankAccountName=Beneficiary Name\n\n#XFLD: Label for Bank account Bank\ncheckoutBankAccountBank=Bank\n\n#XFLD: Label for Bank Account Number\ncheckoutBankAccountNumber=Account Number\n\n#XTIT: Title for COD Step\ncheckoutCodTitle=Details for Cash on Delivery\n\n#XFLD: Label for COD First Name\ncheckoutCodFirstName=First Name\n\n#XFLD: Label for Last Name\ncheckoutCodLastName=Last Name\n\n#XFLD: Label for COD Phone\ncheckoutCodPhone=Phone Number\n\n#XFLD: Label for COD Email\ncheckoutCodEmail=E-mail Address\n\n#YMSG: Message for COD Email value does not fit to type\ncheckoutCodEmailValueTypeMismatch="{0}" is not a valid email address\n\n#XTIT: Title for invoice Address Step\ncheckoutInvoiceAddressTitle=Invoice Address\n\n#XFLD: Label for different Delivery address\ncheckoutInvoiceAddressDifferentDeliveryAddress=Use Different Address for Delivery\n\n#XFLD: Label for invoice Address\ncheckoutInvoiceAddress=Address\n\n#XFLD: Label for invoice Address city\ncheckoutInvoiceAddressCity=City\n\n#XFLD: Label for invoice Address Zip\ncheckoutInvoiceAddressZip=Zip Code\n\n#XFLD: Label for Country\ncheckoutInvoiceAddressCountry=Country\n\n#XFLD: Label for Note\ncheckoutInvoiceAddressNote=Note\n\n#XTIT: Title for Delivery Address Step\ncheckoutDeliveryAddressTitle=Shipping Address\n\n#XFLD: Label for Delivery Address\ncheckoutDeliveryAddressAddress=Address\n\n#XFLD: Label for Delivery Address City\ncheckoutDeliveryAddressCity=City\n\n#XFLD: Label for Delivery Address Zip\ncheckoutDeliveryAddressZip=Zip Code\n\n#XFLD: Label for Delivery Address Country\ncheckoutDeliveryAddressCountry=Country\n\n#XFLD: Label for Delivery Address Note\ncheckoutDeliveryAddressNote=Note\n\n#XTIT: Title for Delivery Type Step\ncheckoutDeliveryTypeTitle=Delivery Type\n\n#YMSG: Message for Delivery Type\ncheckoutDeliveryTypeText=Standard delivery time is 5 workdays. During high-season sales, please allow one additional day. Express delivery is delivered within 36 hours. For express delivery on workdays, we charge a service fee of 5.49 EUR, for a express delivery on holidays, the service fee is 8,00 EUR. Express delivery is only available for inland deliveries. For deliveries abroud, please check the specific conditions.\n\n#XBUT: Button text for standard button\ncheckoutDeliveryTypeStandard=Standard\n\n#XBUT: Button text for express button\ncheckoutDeliveryTypeExpress=Express\n\n#XTIT: Title for Checkout Summary List of Products\ncheckoutSummaryTitle1=Items\n\n#XTIT: Title for Checkout Summary Payment Type\ncheckoutSummaryTitle2=Payment Type\n\n#XFLD: Label for Checkout Summary Payment Header\ncheckoutSummaryPaymentHeader=Selected Payment Type\n\n#XTIT: Title for Checkout Summary Credit Card Payment\ncheckoutSummaryTitle3cc=Credit Card Payment\n\n#XTIT: Title for Checkout Summary Bank Transfer\ncheckoutSummaryTitle3bt=Bank Transfer\n\n#XTIT: Title for Checkout Summary COD\ncheckoutSummaryTitle3cod=Cash on Delivery\n\n#XTIT: Title for Checkout Summary invoice Address\ncheckoutSummaryTitle4=Invoice Address\n\n#XTIT: Title for Checkout Summary Delivery Type\ncheckoutSummaryTitle5=Delivery Type\n\n#XTIT: Title for Chosen delivery type\ncheckoutSummaryDeliveryHeader=Selected Delivery Type\n\n#XFLD: Label for different Delivery Address\ncheckoutSummarySameAsInvoice=Same as invoice address\n\n#XBUT: Button text for submit button\ncheckoutSummarySubmit=Submit\n\n#XBUT: Button text for cancel button\ncheckoutSummaryCancel=Cancel\n\n#XMSG: Message for Change Payment\ncheckoutControllerChangePayment=Are you sure you want to change the payment type? This will discard your progress.\n\n#XMSG: Message for Change Delivery\ncheckoutControllerChangeDelivery=Are you sure you want to change the shipping address? This will discard your progress\n\n#XMSG: Message for submit dialog\ncheckoutControllerAreYouSureSubmit=Are you sure you want to submit your order?\n\n#XMSG: Message for cancel dialog\ncheckoutControllerAreYouSureCancel=Are you sure you want to cancel your order?\n\n#XFLD: Label for ARIA Region root\nOrderCompleted_rootLabel=Order Completed\n\n#XFLD: Label for ARIA Region content\nOrderCompleted_contentLabel=Order Completed Message\n\n#XFLD: Label for ARIA Region header\nOrderCompleted_headerLabel=Order Completed Title\n\n#XFLD: Label for ARIA Region footer\nOrderCompleted_footerLabel=Order Completed Footer\n\n#XTIT: Title for Order Completed View\norderCompletedTitle=Order Completed\n\n#YMSG: Message for order completed\norderCompletedText=<h3>Thank you for your order!</h3><p><strong>Your order number: 20171941</strong></p><p>You will receive an e-mail confirmation shortly.</p><p>When the shipment is ready, you will also get an e-mail notification.</p><p>Want to stay informed?</p><p>Please subscribe to our monthly newsletter. Send a mail to <em><a href="mailto:newsletter@openui5isgreat.corp">newsletter@openui5isgreat.corp</a></em>.</p>\n\n#XBUT: Button text for return to shop button\nreturnToShopButtonText=Return to Shop\n\n#YMSG: Text for the popover text message\npopOverMessageText=One or more fields contain invalid information\n\n#~~~ Master list filter dialog ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XBUT: Title text for filter availability\navailabilityFilterTitle=Availability\n\n#XBUT: Title text for filter price\npriceFilterTitle=Price\n\n#XBUT: Title text for filter available\navailableFilterTitle=Available\n\n#XBUT: Title text for filter out of stock\noutOfStockFilterTitle=Out of Stock\n\n#XBUT: Title text for filter discontinued\ndiscontinuedFilterTitle=Discontinued\n\n#XBUT: Title text for filter supplier\nsupplierFilterTitle=Supplier\n\n#~~~ Compare Products ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Comparison page title\ncomparisonTitle=Product Comparison\n\n#XTOL: Tooltip for remove product from comparison button\nremoveFromComparisonTooltip=Remove Product from Comparison\n\n#XTIT: Alternative text for images in comparison\ncomparisonAlternativeImageText=Enlarge picture of product\n\n#XLNK: Link text for compare with link\nCompareWith=Compare\n\n#XTXT: Add item to compare text\naddToCompareText=Add a product to compare\n\n#XTIT: How to use compare Title\nHowToTitle=How to Compare Products\n\n#XTXT: How to select items label\nHowTo1Label=Add\n\n#XTXT: How to select items label\nHowTo1Text=Choose \'Compare\' for each product you want to add to the comparison.\n\n#XTXT: How to change items label\nHowTo2Label=Compare\n\n#XTXT: How to change items text\nHowTo2Text=As soon as you have selected two products, you can compare the specifications.\n\n#XTXT: How to remove items\nHowTo3Label=Remove\n\n#XTXT: How to remove items text\nHowTo3Text=Choose \'x\' for a product to remove it from the selection.',
	"sap/ui/demo/cart/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ui.demo.cart","type":"application","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""],"fallbackLocale":""},"title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"resources":"resources.json","dataSources":{"mainService":{"uri":"/sap/opu/odata/IWBEP/EPM_DEVELOPER_SCENARIO_SRV/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://cart","favIcon":"img/favicon.ico"}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.cart.view.App","type":"XML","id":"app"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.f":{},"sap.m":{},"sap.ui.core":{},"sap.ui.layout":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.cart.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}},"":{"dataSource":"mainService","preload":true}},"handleValidation":true,"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.f.routing.Router","type":"View","viewType":"XML","path":"sap.ui.demo.cart.view","controlId":"layout","controlAggregation":"midColumnPages","bypassed":{"target":["home","notFound"]}},"routes":[{"pattern":"","name":"home","target":["home","welcome"]},{"pattern":"categories","name":"categories","target":["home","welcome"]},{"pattern":"category/{id}","name":"category","target":["welcome","category"],"titleTarget":"category"},{"pattern":"category/{id}/product/{productId}","name":"product","target":["category","product"],"titleTarget":"product"},{"pattern":"category/{id}/compare/:item1Id:/:item2Id:","name":"comparison","target":["category","comparison"],"titleTarget":"comparison"},{"pattern":"category/{id}/compare/:item1Id:/:item2Id:/cart","name":"comparisonCart","target":["category","comparison","cart"],"titleTarget":"comparison"},{"pattern":"category/{id}/product/{productId}/cart","name":"productCart","target":["category","product","cart"],"titleTarget":"product"},{"pattern":"cart","name":"cart","target":["home","welcome","cart"]},{"pattern":"checkout","name":"checkout","target":"checkout"},{"pattern":"ordercompleted","name":"ordercompleted","target":"ordercompleted"}],"targets":{"product":{"name":"Product","level":3,"id":"product","controlAggregation":"midColumnPages","title":"{Name}"},"comparison":{"name":"Comparison","level":3,"id":"comparison","controlAggregation":"midColumnPages","title":"{Name}"},"category":{"name":"Category","level":2,"controlAggregation":"beginColumnPages","id":"category","title":{"parts":["i18n>tabTitle","CategoryName"]}},"notFound":{"name":"NotFound","level":3,"controlAggregation":"midColumnPages","id":"notFoundView","title":"{i18n>categoryNoData}"},"welcome":{"name":"Welcome","level":0,"id":"welcomeView","controlAggregation":"midColumnPages"},"home":{"name":"Home","level":1,"controlAggregation":"beginColumnPages","id":"homeView","title":"{i18n>appTitle}"},"cart":{"name":"Cart","controlAggregation":"endColumnPages","id":"cartView","title":{"parts":["i18n>tabTitle","i18n>tableTitleCart"]}},"checkout":{"name":"Checkout","controlAggregation":"beginColumnPages","level":1,"title":"{i18n>checkoutTitle}","id":"checkoutView"},"ordercompleted":{"name":"OrderCompleted","controlAggregation":"beginColumnPages","level":2,"id":"orderCompletedView","title":"{i18n>orderCompletedTitle}"}}}}}',
	"sap/ui/demo/cart/view/App.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.App"\n\tdisplayBlock="true"\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:mvc="sap.ui.core.mvc"><App\n\t\tid="app"\n\t\tclass="sapUiDemoCart"><f:FlexibleColumnLayout\n\t\t\tid="layout"\n\t\t\tbusy="{appView>/busy}"\n\t\t\tbusyIndicatorDelay="{appView>/delay}"\n\t\t\tlayout="{appView>/layout}"\n\t\t\tbackgroundDesign="Translucent"\n\t\t\tclass="sapUiDemoCart"\n\t\t\tstateChange=".onStateChange"></f:FlexibleColumnLayout></App></mvc:View>',
	"sap/ui/demo/cart/view/Cart.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.Cart"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><Page\n\t\tid="page"\n\t\ttitle="{cfg>/pageTitle}"\n\t\tbackgroundDesign="Solid"\n\t\tshowNavButton="{appView>/smallScreenMode}"\n\t\tnavButtonPress=".onBack"\n\t\tshowFooter="true"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\trootRole="Region"\n\t\t\t\trootLabel="{i18n>Cart_rootLabel}"\n\t\t\t\tcontentRole="Main"\n\t\t\t\tcontentLabel="{i18n>Cart_contentLabel}"\n\t\t\t\tfooterRole="Region"\n\t\t\t\tfooterLabel="{i18n>Cart_footerLabel}"\n\t\t\t\theaderRole="Region"\n\t\t\t\theaderLabel="{i18n>Cart_headerLabel}"/></landmarkInfo><headerContent><Button\n\t\t\t\tid="editButton"\n\t\t\t\ticon="sap-icon://edit"\n\t\t\t\tenabled="{parts: [\n\t\t\t\t\t{path: \'cartProducts>/cartEntries\'},\n\t\t\t\t\t{path: \'cartProducts>/savedForLaterEntries\'}\n\t\t\t\t ], formatter : \'.formatter.hasItems\'}"\n\t\t\t\tvisible="{cfg>/notInDelete}"\n\t\t\t\tpress=".onEditOrDoneButtonPress"\n\t\t\t\ttooltip="{i18n>cartEditButtonTooltip}"/></headerContent><footer><Toolbar><Text\n\t\t\t\t\tid="totalPriceText"\n\t\t\t\t\ttext="{\n\t\t\t\t\t\tpath : \'cartProducts>/cartEntries\',\n\t\t\t\t\t\tformatter : \'.formatter.totalPrice\'\n\t\t\t\t\t} EUR"\n\t\t\t\t\tclass="sapUiTinyMarginBegin"/><ToolbarSpacer/><Button\n\t\t\t\t\tid="proceedButton"\n\t\t\t\t\ttype="Accept"\n\t\t\t\t\ttext="{i18n>cartProceedButtonText}"\n\t\t\t\t\tenabled="{\n\t\t\t\t\t\tpath: \'cartProducts>/cartEntries\',\n\t\t\t\t\t\tformatter: \'.formatter.hasItems\'\n\t\t\t\t\t}"\n\t\t\t\t\tvisible="{cfg>/notInDelete}"\n\t\t\t\t\tpress=".onProceedButtonPress"/><Button\n\t\t\t\t\tid="doneButton"\n\t\t\t\t\ttext="{i18n>cartDoneButtonText}"\n\t\t\t\t\tenabled="true"\n\t\t\t\t\tvisible="{cfg>/inDelete}"\n\t\t\t\t\tpress=".onEditOrDoneButtonPress"/></Toolbar></footer><content><List\n\t\t\t\tdelete=".onCartEntriesDelete"\n\t\t\t\tid="entryList"\n\t\t\t\titems="{\n\t\t\t\t\tpath : \'cartProducts>/cartEntries\',\n\t\t\t\t\tsorter : {\n\t\t\t\t\t\tpath : \'Name\',\n\t\t\t\t\t\tdescending : false\n\t\t\t\t\t}\n\t\t\t\t}"\n\t\t\t\tmode="{cfg>/listMode}"\n\t\t\t\tnoDataText="{i18n>cartNoData}"\n\t\t\t\tselectionChange=".onEntryListSelect"><headerToolbar><Toolbar><Title\n\t\t\t\t\t\t\tlevel="H6"\n\t\t\t\t\t\t\ttext="{i18n>Cart_contentLabel}"\n\t\t\t\t\t\t\ttitleStyle="H6"/></Toolbar></headerToolbar><items><ObjectListItem\n\t\t\t\t\t\tintro="{cartProducts>Quantity} x"\n\t\t\t\t\t\ttype="{cfg>/listItemType}"\n\t\t\t\t\t\ticon="{\n\t\t\t\t\t\t\tpath : \'cartProducts>PictureUrl\',\n\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\ttitle="{cartProducts>Name}"\n\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\tpath : \'cartProducts>Price\',\n\t\t\t\t\t\t\tformatter : \'.formatter.price\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tnumberUnit="EUR"\n\t\t\t\t\t\tpress=".onEntryListPress"\n\t\t\t\t\t\ticonDensityAware="false"><attributes><ObjectAttribute\n\t\t\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\t\t\tpress=".onSaveForLater"\n\t\t\t\t\t\t\t\ttext="{i18n>cartSaveForLaterLinkText}"/></attributes><firstStatus><ObjectStatus\n\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Status\',\n\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Status\',\n\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'\n\t\t\t\t\t\t\t\t}"/></firstStatus></ObjectListItem></items></List><List\n\t\t\t\tdelete=".onSaveForLaterDelete"\n\t\t\t\tid="saveForLaterList"\n\t\t\t\titems="{\n\t\t\t\t\tpath : \'cartProducts>/savedForLaterEntries\',\n\t\t\t\t\tsorter : {\n\t\t\t\t\t\tpath : \'Name\',\n\t\t\t\t\t\tdescending : false\n\t\t\t\t\t}\n\t\t\t\t}"\n\t\t\t\tmode="{cfg>/listMode}"\n\t\t\t\tnoDataText="{i18n>cartNoItemsSavedForLater}"\n\t\t\t\tselectionChange=".onEntryListSelect"><headerToolbar><Toolbar><Title\n\t\t\t\t\t\t\tlevel="H6"\n\t\t\t\t\t\t\ttext="{i18n>cartItemsSavedForLater}"\n\t\t\t\t\t\t\ttitleStyle="H6"/></Toolbar></headerToolbar><items><ObjectListItem\n\t\t\t\t\t\tintro="{cartProducts>Quantity} x"\n\t\t\t\t\t\ttype="{cfg>/listItemType}"\n\t\t\t\t\t\ticon="{\n\t\t\t\t\t\t\tpath : \'cartProducts>PictureUrl\',\n\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\ttitle="{cartProducts>Name}"\n\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\tpath : \'cartProducts>Price\',\n\t\t\t\t\t\t\tformatter : \'.formatter.price\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tnumberUnit="EUR"\n\t\t\t\t\t\tpress=".onEntryListPress"\n\t\t\t\t\t\ticonDensityAware="false"><attributes><ObjectAttribute\n\t\t\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\t\t\tpress=".onAddBackToBasket"\n\t\t\t\t\t\t\t\ttext="{i18n>cartAddToCartLinkText}"/></attributes><firstStatus><ObjectStatus\n\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Status\',\n\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Status\',\n\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'\n\t\t\t\t\t\t\t\t}"/></firstStatus></ObjectListItem></items></List></content></Page></mvc:View>\n',
	"sap/ui/demo/cart/view/Category.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.Category"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><Page\n\t\tid="page"\n\t\ttitle="{CategoryName}"\n\t\tbackgroundDesign="Solid"\n\t\tshowNavButton="true"\n\t\tnavButtonPress=".onBack"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\trootRole="Region"\n\t\t\t\trootLabel="{i18n>Category_rootLabel}"\n\t\t\t\tcontentRole="Main"\n\t\t\t\tcontentLabel="{CategoryName} {i18n>Category_contentLabel}"\n\t\t\t\tfooterRole="Region"\n\t\t\t\tfooterLabel="{i18n>Category_footerLabel}"\n\t\t\t\theaderRole="Region"\n\t\t\t\theaderLabel="{i18n>Category_headerLabel}"/></landmarkInfo><headerContent><Button\n\t\t\t\tid="masterListFilterButton"\n\t\t\t\ticon="sap-icon://filter"\n\t\t\t\tpress=".onFilter"/></headerContent><content><List\n\t\t\t\tid="productList"\n\t\t\t\tmode="{= ${device>/system/phone} ? \'None\' : \'SingleSelectMaster\'}"\n\t\t\t\tselectionChange=".onProductDetails"\n\t\t\t\tnoDataText="{i18n>categoryNoData}"\n\t\t\t\tbusyIndicatorDelay="0"\n\t\t\t\titems="{\n\t\t\t\t\tpath : \'Products\',\n\t\t\t\t\tsorter : {\n\t\t\t\t\t\tpath : \'Name\',\n\t\t\t\t\t\tdescending : false\n\t\t\t\t\t}\n\t\t\t\t}"><infoToolbar><Toolbar\n\t\t\t\t\t\tid="categoryInfoToolbar"\n\t\t\t\t\t\tvisible="false"><content><Title id="categoryInfoToolbarTitle"/></content></Toolbar></infoToolbar><items><ObjectListItem\n\t\t\t\t\t\ttype="{= ${device>/system/phone} ? \'Active\' : \'Inactive\'}"\n\t\t\t\t\t\ticon="{\n\t\t\t\t\t\t\tpath : \'PictureUrl\',\n\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\ttitle="{Name}"\n\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\tpath : \'Price\',\n\t\t\t\t\t\t\tformatter : \'.formatter.price\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tnumberUnit="{CurrencyCode}"\n\t\t\t\t\t\tpress=".onProductDetails"\n\t\t\t\t\t\ticonDensityAware="false"\n\t\t\t\t\t\ttooltip="{i18n>openProductDetails} {Name}"><attributes><ObjectAttribute visible="true"\n\t\t\t\t\t\t\t\t\t\t\t text="{SupplierName}"/><ObjectAttribute visible="{device>/system/desktop}"\n\t\t\t\t\t\t\t\t\t\t\t active="true"\n\t\t\t\t\t\t\t\t\t\t\t text="{i18n>CompareWith}"\n\t\t\t\t\t\t\t\t\t\t\t press=".compareProducts"/></attributes><firstStatus><ObjectStatus\n\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\tpath : \'Status\',\n\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\tpath : \'Status\',\n\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'\n\t\t\t\t\t\t\t\t}"/></firstStatus></ObjectListItem></items></List></content></Page></mvc:View>\n',
	"sap/ui/demo/cart/view/CategoryFilterDialog.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"\n\txmlns:l="sap.ui.layout"><ViewSettingsDialog\n\t\tid="categoryFilterDialog"\n\t\tconfirm=".handleConfirm"\n\t\tcancel=".handleCancel"\n\t\tresetFilters=".handleResetFilters"><filterItems><ViewSettingsFilterItem\n\t\t\t\ttext="{i18n>availabilityFilterTitle}"\n\t\t\t\tkey="availabilityKey"><items><ViewSettingsItem text="{i18n>availableFilterTitle}" key="Available"/><ViewSettingsItem text="{i18n>outOfStockFilterTitle}" key="OutOfStock"/><ViewSettingsItem text="{i18n>discontinuedFilterTitle}" key="Discontinued"/></items></ViewSettingsFilterItem><ViewSettingsCustomItem\n\t\t\t\ttext="{i18n>priceFilterTitle}"\n\t\t\t\tkey="Price"><customControl><l:VerticalLayout\n\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\tclass="sapUiContentPadding"><RangeSlider\n\t\t\t\t\t\t\tid="rangeSlider"\n\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\tvalue2="5000"\n\t\t\t\t\t\t\tclass="sapUiSmallMarginTop"\n\t\t\t\t\t\t\tmax="5000"\n\t\t\t\t\t\t\tstep="10"\n\t\t\t\t\t\t\tchange=".handleChange"/></l:VerticalLayout></customControl></ViewSettingsCustomItem><ViewSettingsFilterItem\n\t\t\t\t\ttext="{i18n>supplierFilterTitle}"\n\t\t\t\t\tkey="supplierKey"\n\t\t\t\t\titems="{view>/Suppliers}"><items><ViewSettingsItem text="{view>SupplierName}" key="{view>SupplierName}"/></items></ViewSettingsFilterItem></filterItems></ViewSettingsDialog></core:FragmentDefinition>',
	"sap/ui/demo/cart/view/Checkout.view.xml":'<mvc:View\n\theight="100%"\n\tcontrollerName="sap.ui.demo.cart.controller.Checkout"\n\txmlns:layout="sap.ui.layout"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><NavContainer id="wizardNavContainer"><pages><Page\n\t\t\t\tid="wizardContentPage"\n\t\t\t\ttitle="{i18n>checkoutTitle}"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\t\t\trootRole="Region"\n\t\t\t\t\t\trootLabel="{i18n>Checkout_rootLabel}"\n\t\t\t\t\t\tcontentRole="Main"\n\t\t\t\t\t\tcontentLabel="{i18n>Checkout_contentLabel}"\n\t\t\t\t\t\tfooterRole="Region"\n\t\t\t\t\t\tfooterLabel="{i18n>Checkout_footerLabel}"/></landmarkInfo><headerContent><Button\n\t\t\t\t\t\tid="returnToShopButton"\n\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\ttext="{i18n>returnToShopButtonText}"\n\t\t\t\t\t\tpress=".onReturnToShopButtonPress"/></headerContent><content><Wizard\n\t\t\t\t\t\tid="shoppingCartWizard"\n\t\t\t\t\t\tcomplete="checkCompleted"\n\t\t\t\t\t\tenableBranching="true"\n\t\t\t\t\t\tfinishButtonText="{i18n>checkoutWizardReviewbtn}"><steps><WizardStep\n\t\t\t\t\t\t\t\tid="contentsStep"\n\t\t\t\t\t\t\t\tnextStep="paymentTypeStep"\n\t\t\t\t\t\t\t\ttitle="{i18n>checkoutContentsTitle}"\n\t\t\t\t\t\t\t\ticon="sap-icon://cart"><List\n\t\t\t\t\t\t\t\t\tid="entryList"\n\t\t\t\t\t\t\t\t\tnoDataText="{i18n>cartNoData}"\n\t\t\t\t\t\t\t\t\titems="{\n\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>/cartEntries\',\n\t\t\t\t\t\t\t\t\t\tsorter : {\n\t\t\t\t\t\t\t\t\t\t\tpath : \'Name\',\n\t\t\t\t\t\t\t\t\t\t\tdescending : false\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}"><items><ObjectListItem\n\t\t\t\t\t\t\t\t\t\t\tintro="{cartProducts>Quantity} x"\n\t\t\t\t\t\t\t\t\t\t\ticon="{\n\t\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>PictureUrl\',\n\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\ttitle="{cartProducts>Name}"\n\t\t\t\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Price\',\n\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.price\'\n\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\tnumberUnit="EUR"\n\t\t\t\t\t\t\t\t\t\t\ticonDensityAware="false"><firstStatus><ObjectStatus\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'\n\t\t\t\t\t\t\t\t\t\t\t\t\t}"/></firstStatus></ObjectListItem></items></List><Bar><contentRight><Text\n\t\t\t\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>/cartEntries\',\n\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.totalPrice\'\n\t\t\t\t\t\t\t\t\t\t\t} EUR"/></contentRight></Bar></WizardStep><WizardStep\n\t\t\t\t\t\t\t\tid="paymentTypeStep"\n\t\t\t\t\t\t\t\ttitle="{i18n>checkoutPaymentTitle}"\n\t\t\t\t\t\t\t\tsubsequentSteps="creditCardStep, bankAccountStep, cashOnDeliveryStep"\n\t\t\t\t\t\t\t\tcomplete="goToPaymentStep"\n\t\t\t\t\t\t\t\ticon="sap-icon://money-bills"><Text\n\t\t\t\t\t\t\t\t\tclass="sapUiSmallMarginBottom"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutPaymentText}"/><HBox\n\t\t\t\t\t\t\t\trenderType="Bare"\n\t\t\t\t\t\t\t\talignItems="Center"\n\t\t\t\t\t\t\t\tjustifyContent="Center"\n\t\t\t\t\t\t\t\twidth="100%"><SegmentedButton\n\t\t\t\t\t\t\t\t\t\tselectionChange="setPaymentMethod"\n\t\t\t\t\t\t\t\t\t\tid="paymentMethodSelection"\n\t\t\t\t\t\t\t\t\t\tselectedKey="{/SelectedPayment}"><items><SegmentedButtonItem\n\t\t\t\t\t\t\t\t\t\t\t\tid="payViaCC"\n\t\t\t\t\t\t\t\t\t\t\t\tkey="Credit Card"\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutPaymentCreditCard}"/><SegmentedButtonItem\n\t\t\t\t\t\t\t\t\t\t\t\tid="payViaBank"\n\t\t\t\t\t\t\t\t\t\t\t\tkey="Bank Transfer"\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutPaymentBankTransfer}"/><SegmentedButtonItem\n\t\t\t\t\t\t\t\t\t\t\t\tid="payViaCOD"\n\t\t\t\t\t\t\t\t\t\t\t\tkey="Cash on Delivery"\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutPaymentCod}"/></items></SegmentedButton></HBox></WizardStep><WizardStep\n\t\t\t\t\t\t\t\tid="creditCardStep"\n\t\t\t\t\t\t\t\ttitle="{i18n>checkoutCreditCardCreditCardInfo}"\n\t\t\t\t\t\t\t\tnextStep="invoiceStep"\n\t\t\t\t\t\t\t\tactivate=".onCheckStepActivation"\n\t\t\t\t\t\t\t\ticon="sap-icon://credit-card"\n\t\t\t\t\t\t\t\tvalidated="false"><form:SimpleForm\n\t\t\t\t\t\t\t\teditable="true"\n\t\t\t\t\t\t\t\tlayout="ResponsiveGridLayout"><Label\n\t\t\t\t\t\t\t\t\tlabelFor="creditCardHolderName"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutCreditCardName}"\n\t\t\t\t\t\t\t\t\trequired="true"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="creditCardHolderName"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>creditCardHolderText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/CreditCard/Name\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 3,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[a-zA-Z]+[\\\\s]?[a-zA-Z]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkCreditCardStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutCreditCardCardNo}"\n\t\t\t\t\t\t\t\t\tlabelFor="creditCardNumber"\n\t\t\t\t\t\t\t\t\trequired="true"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><MaskInput\n\t\t\t\t\t\t\t\t\tid="creditCardNumber"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>creditCardNumberText}"\n\t\t\t\t\t\t\t\t\tmask = "CCCC-CCCC-CCCC-CCCC"\n\t\t\t\t\t\t\t\t\tplaceholderSymbol = "_"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/CreditCard/CardNumber\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[0-9-]+$\',\n\t\t\t\t\t\t\t\t\t\t\tminLength: 16\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkCreditCardStep"><rules><MaskInputRule\n\t\t\t\t\t\t\t\t\t\t\tmaskFormatSymbol="C"\n\t\t\t\t\t\t\t\t\t\t\tregex="[0-9]"/></rules><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></MaskInput><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutCreditCardCode}"\n\t\t\t\t\t\t\t\t\tlabelFor="creditCardSecurityNumber"\n\t\t\t\t\t\t\t\t\trequired="true"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><MaskInput\n\t\t\t\t\t\t\t\t\tid="creditCardSecurityNumber"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>creditCardSecurityNumberText}"\n\t\t\t\t\t\t\t\t\tmask = "CCC"\n\t\t\t\t\t\t\t\t\tplaceholderSymbol = "_"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/CreditCard/SecurityCode\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 3,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[0-9]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkCreditCardStep"><rules><MaskInputRule\n\t\t\t\t\t\t\t\t\t\t\tmaskFormatSymbol ="C"\n\t\t\t\t\t\t\t\t\t\t\tregex = "[0-9]"/></rules><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></MaskInput><Label text="{i18n>checkoutCreditCardExpiration}"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><DatePicker\n\t\t\t\t\t\t\t\t\tid="creditCardExpirationDate"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/CreditCard/Expire\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 7,\n\t\t\t\t\t\t\t\t\t\t\tmaxLength: 7\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tvalueFormat="MM/YYYY"\n\t\t\t\t\t\t\t\t\tdisplayFormat="MM/YYYY"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tchange="checkCreditCardStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></DatePicker></form:SimpleForm></WizardStep><WizardStep\n\t\t\t\t\t\t\tid="bankAccountStep"\n\t\t\t\t\t\t\ttitle="{i18n>checkoutBankAccountTitle}"\n\t\t\t\t\t\t\tnextStep="invoiceStep"\n\t\t\t\t\t\t\ticon="sap-icon://official-service"><Panel><layout:Grid\n\t\t\t\t\t\t\t\t\tdefaultSpan="L6 M6 S10"\n\t\t\t\t\t\t\t\t\thSpacing="2"><Label\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutBankAccountName}"\n\t\t\t\t\t\t\t\t\t\tdesign="Bold"/><Label text="{i18n>beneficiaryNameText}"/><Label\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutBankAccountBank}"\n\t\t\t\t\t\t\t\t\t\tdesign="Bold"/><Label text="{i18n>bankNameText}"/><Label\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutBankAccountNumber}"\n\t\t\t\t\t\t\t\t\t\tdesign="Bold"/><Label text="{i18n>accountNumberText}"/></layout:Grid></Panel></WizardStep><WizardStep\n\t\t\t\t\t\t\tid="cashOnDeliveryStep"\n\t\t\t\t\t\t\ttitle="{i18n>checkoutCodTitle}"\n\t\t\t\t\t\t\tnextStep="invoiceStep"\n\t\t\t\t\t\t\tactivate=".onCheckStepActivation"\n\t\t\t\t\t\t\ticon="sap-icon://money-bills"\n\t\t\t\t\t\t\tvalidated="false"><form:SimpleForm\n\t\t\t\t\t\t\t\teditable="true"\n\t\t\t\t\t\t\t\tlayout="ResponsiveGridLayout"><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutCodFirstName}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="cashOnDeliveryName"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="cashOnDeliveryName"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>firstNameText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/CashOnDelivery/FirstName\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 2\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkCashOnDeliveryStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutCodLastName}"\n\t\t\t\t\t\t\t\t\tlabelFor="cashOnDeliveryLastName"\n\t\t\t\t\t\t\t\t\trequired="true"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="cashOnDeliveryLastName"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>lastNameText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/CashOnDelivery/LastName\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 2\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkCashOnDeliveryStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutCodPhone}"\n\t\t\t\t\t\t\t\t\tlabelFor="cashOnDeliveryPhoneNumber"\n\t\t\t\t\t\t\t\t\trequired="true"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="cashOnDeliveryPhoneNumber"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>phoneNumberText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/CashOnDelivery/PhoneNumber\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[(0-9+]+[)\\\\s]?[0-9\\\\/\\\\s]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkCashOnDeliveryStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutCodEmail}"\n\t\t\t\t\t\t\t\t\tlabelFor="cashOnDeliveryEmail"\n\t\t\t\t\t\t\t\t\trequired="true"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="cashOnDeliveryEmail"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>emailAddressText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/CashOnDelivery/Email\',\n\t\t\t\t\t\t\t\t\t\ttype: \'.types.email\'\n\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkCashOnDeliveryStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input></form:SimpleForm></WizardStep><WizardStep\n\t\t\t\t\t\t\tid="invoiceStep"\n\t\t\t\t\t\t\ttitle="{i18n>checkoutInvoiceAddressTitle}"\n\t\t\t\t\t\t\tsubsequentSteps="deliveryAddressStep, deliveryTypeStep"\n\t\t\t\t\t\t\tactivate=".onCheckStepActivation"\n\t\t\t\t\t\t\tcomplete="invoiceAddressComplete"\n\t\t\t\t\t\t\ticon="sap-icon://sales-quote"\n\t\t\t\t\t\t\tvalidated="false"><form:SimpleForm\n\t\t\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\t\t\teditable="true"><Label text="{i18n>checkoutInvoiceAddressDifferentDeliveryAddress}"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><CheckBox\n\t\t\t\t\t\t\t\t\tid="differentDeliveryAddress"\n\t\t\t\t\t\t\t\t\tselected="{/DifferentDeliveryAddress}"\n\t\t\t\t\t\t\t\t\tselect="setDifferentDeliveryAddress"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></CheckBox><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutInvoiceAddress}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="invoiceAddressAddress"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="invoiceAddressAddress"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>addressText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/InvoiceAddress/Address\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 4,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[a-zA-Z-]+\\\\.?\\\\s?[0-9a-zA-Z\\\\s]*$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkInvoiceStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutInvoiceAddressCity}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="invoiceAddressCity"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="invoiceAddressCity"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>cityText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/InvoiceAddress/City\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 3,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[a-zA-Z\\\\s]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkInvoiceStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutInvoiceAddressZip}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="invoiceAddressZip"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="invoiceAddressZip"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>zipCodeText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/InvoiceAddress/ZipCode\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 3,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[0-9]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkInvoiceStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutInvoiceAddressCountry}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="invoiceAddressCountry"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="invoiceAddressCountry"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>countryText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/InvoiceAddress/Country\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 2,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[a-zA-Z]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkInvoiceStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutInvoiceAddressNote}"\n\t\t\t\t\t\t\t\t\trequired="false"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><TextArea\n\t\t\t\t\t\t\t\t\trows="8"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>noteText}"\n\t\t\t\t\t\t\t\t\tvalue="{/InvoiceAddress/Note}"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></TextArea></form:SimpleForm></WizardStep><WizardStep\n\t\t\t\t\t\t\t\tid="deliveryAddressStep"\n\t\t\t\t\t\t\t\tactivate=".onCheckStepActivation"\n\t\t\t\t\t\t\t\tvalidated="false"\n\t\t\t\t\t\t\t\ttitle="{i18n>checkoutDeliveryAddressTitle}"\n\t\t\t\t\t\t\t\tnextStep="deliveryTypeStep"\n\t\t\t\t\t\t\t\ticon="sap-icon://sales-quote"><form:SimpleForm\n\t\t\t\t\t\t\t\teditable="true"\n\t\t\t\t\t\t\t\tlayout="ResponsiveGridLayout"><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryAddressAddress}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="deliveryAddressAddress"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="deliveryAddressAddress"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>addressText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/DeliveryAddress/Address\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 4,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[a-zA-Z-]+\\\\.?\\\\s?[0-9a-zA-Z\\\\s]*$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkDeliveryAddressStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryAddressCity}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="deliveryAddressCity"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="deliveryAddressCity"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>cityText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/DeliveryAddress/City\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 3,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[a-zA-Z\\\\s]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkDeliveryAddressStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryAddressZip}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="deliveryAddressZip"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="deliveryAddressZip"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>zipCodeText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/DeliveryAddress/ZipCode\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 3,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[0-9]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkDeliveryAddressStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryAddressCountry}"\n\t\t\t\t\t\t\t\t\trequired="true"\n\t\t\t\t\t\t\t\t\tlabelFor="deliveryAddressCountry"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><Input\n\t\t\t\t\t\t\t\t\tid="deliveryAddressCountry"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>countryText}"\n\t\t\t\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/DeliveryAddress/Country\',\n\t\t\t\t\t\t\t\t\t\ttype: \'sap.ui.model.type.String\',\n\t\t\t\t\t\t\t\t\t\tconstraints: {\n\t\t\t\t\t\t\t\t\t\t\tminLength: 2,\n\t\t\t\t\t\t\t\t\t\t\tsearch: \'^[a-zA-Z]+$\'\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tchange="checkDeliveryAddressStep"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></Input><Label text="{i18n>checkoutDeliveryAddressNote}"><layoutData><layout:GridData span="XL4 L4 M4 S12"/></layoutData></Label><TextArea\n\t\t\t\t\t\t\t\t\trows="8"\n\t\t\t\t\t\t\t\t\tplaceholder="{i18n>noteText}"\n\t\t\t\t\t\t\t\t\tvalue="{/DeliveryAddress/Note}"><layoutData><layout:GridData span="XL8 L8 M8 S12"/></layoutData></TextArea></form:SimpleForm></WizardStep><WizardStep\n\t\t\t\t\t\t\t\tid="deliveryTypeStep"\n\t\t\t\t\t\t\t\ttitle="{i18n>checkoutDeliveryTypeTitle}"\n\t\t\t\t\t\t\t\ticon="sap-icon://insurance-car"><Text\n\t\t\t\t\t\t\t\t\tclass="sapUiSmallMarginBottom"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryTypeText}"/><HBox\n\t\t\t\t\t\t\t\trenderType="Bare"\n\t\t\t\t\t\t\t\talignItems="Center"\n\t\t\t\t\t\t\t\tjustifyContent="Center"\n\t\t\t\t\t\t\t\twidth="100%"><SegmentedButton\n\t\t\t\t\t\t\t\t\t\tid="deliveryType"\n\t\t\t\t\t\t\t\t\t\tselectedKey="{/SelectedDeliveryMethod}"><items><SegmentedButtonItem\n\t\t\t\t\t\t\t\t\t\t\t\tkey="Standard Delivery"\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryTypeStandard}"/><SegmentedButtonItem\n\t\t\t\t\t\t\t\t\t\t\t\tid="expressDelivery"\n\t\t\t\t\t\t\t\t\t\t\t\tkey="Express Delivery"\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryTypeExpress}"/></items></SegmentedButton></HBox></WizardStep></steps></Wizard></content><footer><Bar id="wizardFooterBar" visible="{= ${message>/}.length === 0 ? false : true}"><contentLeft><Button\n\t\t\t\t\t\t\t\tid="showPopoverButton"\n\t\t\t\t\t\t\t\ticon="sap-icon://message-popup"\n\t\t\t\t\t\t\t\ttext="{= ${message>/}.length }"\n\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\tpress=".onShowMessagePopoverPress"/></contentLeft></Bar></footer></Page><Page\n\t\t\t\tid="summaryPage"\n\t\t\t\tbackgroundDesign="Solid"\n\t\t\t\tshowHeader="false"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\t\t\t\trootRole="Region" rootLabel="{i18n>Checkout_rootLabel}"\n\t\t\t\t\t\t\tcontentRole="Main" contentLabel="{i18n>Checkout_summaryContentLabel}"\n\t\t\t\t\t\t\tfooterRole="Banner" footerLabel="{i18n>Checkout_footerLabel}"/></landmarkInfo><content><Panel><headerToolbar><Toolbar id="toolbarProductList"><Title\n\t\t\t\t\t\t\t\t\tid="checkoutItems"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutSummaryTitle1}"\n\t\t\t\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"/><ToolbarSpacer/><Button\n\t\t\t\t\t\t\t\t\tid="backtoList"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://edit"\n\t\t\t\t\t\t\t\t\ttooltip="{i18n>backToWizard}"\n\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\tpress="._navBackToStep"><customData><core:CustomData key="navBackTo" value="contentsStep"/></customData></Button></Toolbar></headerToolbar><content><List\n\t\t\t\t\t\t\t\tid="summaryEntryList"\n\t\t\t\t\t\t\t\tnoDataText="{i18n>cartNoData}"\n\t\t\t\t\t\t\t\titems="{\n\t\t\t\t\t\t\t\t\tpath : \'cartProducts>/cartEntries\',\n\t\t\t\t\t\t\t\t\tsorter : {\n\t\t\t\t\t\t\t\t\t\tpath : \'Name\',\n\t\t\t\t\t\t\t\t\t\tdescending : false\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t \t}"><items><ObjectListItem\n\t\t\t\t\t\t\t\t\t\tintro="{cartProducts>Quantity} x"\n\t\t\t\t\t\t\t\t\t\ticon="{\n\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>PictureUrl\',\n\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\ttitle="{cartProducts>Name}"\n\t\t\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Price\',\n\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.price\'\n\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\tnumberUnit="EUR"\n\t\t\t\t\t\t\t\t\t\ticonDensityAware="false"><firstStatus><ObjectStatus\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'\n\t\t\t\t\t\t\t\t\t\t\t\t}"/></firstStatus></ObjectListItem></items></List></content></Panel><form:SimpleForm\n\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\tariaLabelledBy="totalPriceTitle"><form:toolbar><Toolbar id="toolbarTotalPrice"><ToolbarSpacer/><Title\n\t\t\t\t\t\t\t\t\tid="totalPriceTitle"\n\t\t\t\t\t\t\t\t\tlevel="H3"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"\n\t\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\t\tpath : \'cartProducts>/cartEntries\',\n\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.totalPrice\'\n\t\t\t\t\t\t\t\t\t}"/></Toolbar></form:toolbar></form:SimpleForm><form:SimpleForm\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\tariaLabelledBy="toolbarPaymentTitle"><form:toolbar><Toolbar id="toolbarPayment"><Title\n\t\t\t\t\t\t\t\t\tid="toolbarPaymentTitle"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutSummaryTitle2}"\n\t\t\t\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"/><ToolbarSpacer/><Button\n\t\t\t\t\t\t\t\t\tid="backToPaymentType"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://edit"\n\t\t\t\t\t\t\t\t\ttooltip="{i18n>backToWizard}"\n\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\tpress="._navBackToStep"><customData><core:CustomData key="navBackTo" value="paymentTypeStep"/></customData></Button></Toolbar></form:toolbar><form:content><Label text="{i18n>checkoutSummaryPaymentHeader}"/><Text text="{/SelectedPayment}"/></form:content></form:SimpleForm><form:SimpleForm\n\t\t\t\t\t\t\tvisible="{= ${/SelectedPayment}===\'Credit Card\' ? true : false}"\n\t\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\t\tariaLabelledBy="creditCardPaymentTitle"><form:toolbar><Toolbar id="toolbarCreditCard"><Title\n\t\t\t\t\t\t\t\t\tid="creditCardPaymentTitle"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutSummaryTitle3cc}"\n\t\t\t\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"/><ToolbarSpacer/><Button\n\t\t\t\t\t\t\t\t\tid="backToCreditCard"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://edit"\n\t\t\t\t\t\t\t\t\ttooltip="{i18n>backToWizard}"\n\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\tpress="._navBackToStep"><customData><core:CustomData key="navBackTo" value="creditCardStep"/></customData></Button></Toolbar></form:toolbar><form:content><Label text="{i18n>checkoutCreditCardName}"/><Text text="{/CreditCard/Name}"/><Label text="{i18n>checkoutCreditCardCardNo}"/><Text text="{/CreditCard/CardNumber}"/><Label text="{i18n>checkoutCreditCardCode}"/><Text text="{/CreditCard/SecurityCode}"/><Label text="{i18n>checkoutCreditCardExpiration}"/><Text text="{/CreditCard/Expire}"/></form:content></form:SimpleForm><form:SimpleForm\n\t\t\t\t\t\tvisible="{= ${/SelectedPayment}===\'Bank Transfer\' ? true : false}"\n\t\t\t\t\t\ttitle="{i18n>checkoutSummaryTitle3bt}"\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\tlayout="ResponsiveGridLayout"><form:content><Label\n\t\t\t\t\t\t\t\ttext="{i18n>checkoutBankAccountName}"\n\t\t\t\t\t\t\t\tdesign="Bold"/><Text text="{i18n>beneficiaryNameText}"/><Label\n\t\t\t\t\t\t\t\ttext="{i18n>checkoutBankAccountBank}"\n\t\t\t\t\t\t\t\tdesign="Bold"/><Text text="{i18n>bankNameText}"/><Label\n\t\t\t\t\t\t\t\ttext="{i18n>checkoutBankAccountNumber}"\n\t\t\t\t\t\t\t\tdesign="Bold"/><Text text="{i18n>accountNumberText}"/></form:content></form:SimpleForm><form:SimpleForm\n\t\t\t\t\t\tvisible="{= ${/SelectedPayment}===\'Cash on Delivery\' ? true : false}"\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\tariaLabelledBy="cashOnDeliveryTitle"><form:toolbar><Toolbar id="toolbarCOD"><Title\n\t\t\t\t\t\t\t\t\tid="cashOnDeliveryTitle"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutSummaryTitle3cod}"\n\t\t\t\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"/><ToolbarSpacer/><Button\n\t\t\t\t\t\t\t\t\tid="backToCashOnDelivery"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://edit"\n\t\t\t\t\t\t\t\t\ttooltip="{i18n>backToWizard}"\n\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\tpress="._navBackToStep"><customData><core:CustomData key="navBackTo" value="cashOnDeliveryStep"/></customData></Button></Toolbar></form:toolbar><form:content><Label text="{i18n>checkoutCodFirstName}"/><Text text="{/CashOnDelivery/FirstName}"/><Label text="{i18n>checkoutCodLastName}"/><Text text="{/CashOnDelivery/LastName}"/><Label text="{i18n>checkoutCodPhone}"/><Text text="{/CashOnDelivery/PhoneNumber}"/><Label text="{i18n>checkoutCodEmail}"/><Text text="{/CashOnDelivery/Email}"/></form:content></form:SimpleForm><form:SimpleForm\n\t\t\t\t\t\t\ttitle=""\n\t\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\t\tariaLabelledBy="invoiceAddressTitle"><form:toolbar><Toolbar id="toolbarInvoice"><Title\n\t\t\t\t\t\t\t\t\tid="invoiceAddressTitle"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutSummaryTitle4}"\n\t\t\t\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"/><ToolbarSpacer/><Button\n\t\t\t\t\t\t\t\t\tid="backToInvoiceAddress"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://edit"\n\t\t\t\t\t\t\t\t\ttooltip="{i18n>backToWizard}"\n\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\tpress="._navBackToStep"><customData><core:CustomData key="navBackTo" value="invoiceStep"/></customData></Button></Toolbar></form:toolbar><form:content><Label text="{i18n>checkoutInvoiceAddress}"/><Text text="{/InvoiceAddress/Address}"/><Label text="{i18n>checkoutInvoiceAddressCity}"/><Text text="{/InvoiceAddress/City}"/><Label text="{i18n>checkoutInvoiceAddressZip}"/><Text text="{/InvoiceAddress/ZipCode}"/><Label text="{i18n>checkoutInvoiceAddressCountry}"/><Text text="{/InvoiceAddress/Country}"/><Label text="{i18n>checkoutInvoiceAddressNote}"/><Text text="{/InvoiceAddress/Note}"/></form:content></form:SimpleForm><form:SimpleForm\n\t\t\t\t\t\t\ttitle=""\n\t\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\t\tariaLabelledBy="deliveryTypeTitle"><form:toolbar><Toolbar id="toolbarShippping"><Title\n\t\t\t\t\t\t\t\t\tid="deliveryTypeTitle"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutSummaryTitle5}"\n\t\t\t\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"/><ToolbarSpacer/><Button\n\t\t\t\t\t\t\t\t\tid="backToDeliveryType"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://edit"\n\t\t\t\t\t\t\t\t\ttooltip="{i18n>backToWizard}"\n\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\tpress="._navBackToStep"><customData><core:CustomData key="navBackTo" value="deliveryTypeStep"/></customData></Button></Toolbar></form:toolbar><form:content><Label text="{i18n>checkoutSummaryDeliveryHeader}"/><Text id="selectedDeliveryMethod" text="{/SelectedDeliveryMethod}"/></form:content></form:SimpleForm><form:SimpleForm\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\tvisible="{= ${/DifferentDeliveryAddress}}"\n\t\t\t\t\t\tariaLabelledBy="shippingAddressTitle1"><form:toolbar><Toolbar id="toolbar5ShippingAddress"><Title\n\t\t\t\t\t\t\t\t\tid="shippingAddressTitle1"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryAddressTitle}"\n\t\t\t\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"/><ToolbarSpacer/><Button\n\t\t\t\t\t\t\t\t\tid="backToDeliveryAddress"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://edit"\n\t\t\t\t\t\t\t\t\ttooltip="{i18n>backToWizard}"\n\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\tpress="._navBackToStep"><customData><core:CustomData key="navBackTo" value="deliveryAddressStep"/></customData></Button></Toolbar></form:toolbar><form:content><Label text="{i18n>checkoutDeliveryAddressAddress}"/><Text text="{/DeliveryAddress/Address}"/><Label text="{i18n>checkoutDeliveryAddressCity}"/><Text text="{/DeliveryAddress/City}"/><Label text="{i18n>checkoutDeliveryAddressZip}"/><Text text="{/DeliveryAddress/ZipCode}"/><Label text="{i18n>checkoutDeliveryAddressCountry}"/><Text text="{/DeliveryAddress/Country}"/><Label text="{i18n>checkoutDeliveryAddressNote}"/><Text text="{/DeliveryAddress/Note}"/></form:content></form:SimpleForm><form:SimpleForm\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\tlayout="ResponsiveGridLayout"\n\t\t\t\t\t\tvisible="{= !${/DifferentDeliveryAddress}}"\n\t\t\t\t\t\tariaLabelledBy="shippingAddressTitle2"><form:toolbar><Toolbar id="toolbar5SameAsInvoice"><Title\n\t\t\t\t\t\t\t\t\tid="shippingAddressTitle2"\n\t\t\t\t\t\t\t\t\ttext="{i18n>checkoutDeliveryAddressTitle}"\n\t\t\t\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\t\t\t\ttitleStyle="H4"/><ToolbarSpacer/><Button\n\t\t\t\t\t\t\t\t\tid="backToDifferentDeliveryAddress"\n\t\t\t\t\t\t\t\t\ticon="sap-icon://edit"\n\t\t\t\t\t\t\t\t\ttooltip="{i18n>backToWizard}"\n\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\tpress="._navBackToStep"><customData><core:CustomData key="navBackTo" value="invoiceStep"/></customData></Button></Toolbar></form:toolbar><form:content><Text text="{i18n>checkoutSummarySameAsInvoice}"/></form:content></form:SimpleForm></content><footer><Bar id="summaryFooterBar"><contentRight><Button\n\t\t\t\t\t\t\t\tid="submitOrder"\n\t\t\t\t\t\t\t\ttype="Accept"\n\t\t\t\t\t\t\t\ttext="{i18n>checkoutSummarySubmit}"\n\t\t\t\t\t\t\t\tpress=".handleWizardSubmit"></Button><Button\n\t\t\t\t\t\t\t\tid="cancelOrder"\n\t\t\t\t\t\t\t\ttype="Reject"\n\t\t\t\t\t\t\t\ttext="{i18n>checkoutSummaryCancel}"\n\t\t\t\t\t\t\t\tpress=".handleWizardCancel"></Button></contentRight></Bar></footer></Page></pages></NavContainer></mvc:View>\n',
	"sap/ui/demo/cart/view/Comparison.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.Comparison"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:core="sap.ui.core"\n\txmlns:form="sap.ui.layout.form"\n\tdisplayBlock="true"><Page\n\t\tid="page"\n\t\tbackgroundDesign="Solid"><customHeader><Bar><contentMiddle><Title\n\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\ttext="{i18n>comparisonTitle}"/></contentMiddle><contentRight><Button\n\t\t\t\t\t\ticon="sap-icon://customer"\n\t\t\t\t\t\tpress=".onAvatarPress"\n\t\t\t\t\t\ttooltip="{i18n>avatarButtonTooltip}"/><ToggleButton\n\t\t\t\t\t\ticon="sap-icon://cart"\n\t\t\t\t\t\tpressed="{= ${appView>/layout}.startsWith(\'ThreeColumns\') }"\n\t\t\t\t\t\ttooltip="{i18n>toCartButtonTooltip}"\n\t\t\t\t\t\tpress=".onToggleCart"></ToggleButton></contentRight></Bar></customHeader><content><ScrollContainer\n\t\t\t\theight="100%"\n\t\t\t\twidth="100%"\n\t\t\t\thorizontal="false"\n\t\t\t\tvertical="true"\n\t\t\t\tfocusable="false"><HBox\n\t\t\t\t\tclass="comparebox"\n\t\t\t\t\tid="comparisonContainer"><core:Fragment\n\t\t\t\t\t\tfragmentName="sap.ui.demo.cart.view.ComparisonItem"\n\t\t\t\t\t\ttype="XML"/><core:Fragment\n\t\t\t\t\t\tfragmentName="sap.ui.demo.cart.view.ComparisonItem"\n\t\t\t\t\t\ttype="XML"/><Panel id="placeholder" visible="false"><headerToolbar><Toolbar><Text text="{i18n>HowToTitle}"/></Toolbar></headerToolbar><form:Form editable="false"><form:layout><form:ResponsiveGridLayout\n\t\t\t\t\t\t\t\t\t\tlabelSpanXL="12"\n\t\t\t\t\t\t\t\t\t\tlabelSpanL="12"\n\t\t\t\t\t\t\t\t\t\tlabelSpanM="12"\n\t\t\t\t\t\t\t\t\t\tlabelSpanS="12"\n\t\t\t\t\t\t\t\t\t\tadjustLabelSpan="false"\n\t\t\t\t\t\t\t\t\t\temptySpanXL="4"\n\t\t\t\t\t\t\t\t\t\temptySpanL="4"\n\t\t\t\t\t\t\t\t\t\temptySpanM="4"\n\t\t\t\t\t\t\t\t\t\temptySpanS="0"\n\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize="false"/></form:layout><form:formContainers><form:FormContainer><form:FormElement label="{i18n>HowTo1Label}"><form:fields><Text text="{i18n>HowTo1Text}"/></form:fields></form:FormElement><form:FormElement label="{i18n>HowTo2Label}"><form:fields><Text text="{i18n>HowTo2Text}"/></form:fields></form:FormElement><form:FormElement label="{i18n>HowTo3Label}"><form:fields><Text text="{i18n>HowTo3Text}"/></form:fields></form:FormElement></form:FormContainer></form:formContainers></form:Form></Panel></HBox></ScrollContainer></content></Page></mvc:View>',
	"sap/ui/demo/cart/view/ComparisonItem.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"\n\txmlns:form="sap.ui.layout.form"><Panel height="100%"><headerToolbar><Toolbar><Text\n\t\t\t\t\ttext="{Name} - {ProductId}"/><ToolbarSpacer/><Button\n\t\t\t\t\ticon="sap-icon://sys-cancel"\n\t\t\t\t\tpress=".onRemoveComparison"\n\t\t\t\t\ttooltip="{i18n>removeFromComparisonTooltip}"/></Toolbar></headerToolbar><HBox class="comparebox"><VBox><Image\n\t\t\t\t\tsrc="{\n\t\t\t\t\t\tpath : \'PictureUrl\',\n\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t}"\n\t\t\t\t\talt="{i18n>comparisonAlternativeImageText}"\n\t\t\t\t\tdensityAware="false"\n\t\t\t\t\tclass="sapUiSmallMarginTop"\n\t\t\t\t\twidth="100%"\n\t\t\t\t\theight="100%"><detailBox><LightBox><imageContent><LightBoxItem\n\t\t\t\t\t\t\t\t\timageSrc="{\n\t\t\t\t\t\t\t\t\t\tpath : \'PictureUrl\',\n\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\ttitle="{Name}"/></imageContent></LightBox></detailBox></Image></VBox><VBox alignItems="End"><ObjectListItem\n\t\t\t\t\tclass="productPrice welcomePrice"\n\t\t\t\t\tnumber="{\n\t\t\t\t\t\tpath : \'Price\',\n\t\t\t\t\t\tformatter : \'.formatter.price\'\n\t\t\t\t\t}"\n\t\t\t\t\tnumberUnit="EUR"></ObjectListItem><ObjectStatus\n\t\t\t\t\tclass="sapUiSmallMarginBottom"\n\t\t\t\t\ttext="{\n\t\t\t\t\t\tpath : \'Status\',\n\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t}"\n\t\t\t\t\tstate="{\n\t\t\t\t\t\tpath : \'Status\',\n\t\t\t\t\t\tformatter : \'.formatter.statusState\'\n\t\t\t\t\t}"/><Button\n\t\t\t\t\ttext="{i18n>addToCartShort}"\n\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\tpress=".onAddToCart"/></VBox></HBox><form:Form editable="false"><form:layout><form:ResponsiveGridLayout\n\t\t\t\t\tlabelSpanXL="12"\n\t\t\t\t\tlabelSpanL="12"\n\t\t\t\t\tlabelSpanM="12"\n\t\t\t\t\tlabelSpanS="12"\n\t\t\t\t\tadjustLabelSpan="false"\n\t\t\t\t\temptySpanXL="4"\n\t\t\t\t\temptySpanL="4"\n\t\t\t\t\temptySpanM="4"\n\t\t\t\t\temptySpanS="0"\n\t\t\t\t\tsingleContainerFullSize="false"/></form:layout><form:formContainers><form:FormContainer><form:FormElement label="{i18n>productSupplierAttributeText}"><form:fields><Text text="{SupplierName}"/></form:fields></form:FormElement><form:FormElement label="{i18n>productDescriptionAttributeText}"><form:fields><Text text="{ShortDescription}"/></form:fields></form:FormElement><form:FormElement label="{i18n>productWeightAttributeText}"><form:fields><Text text="{Weight} {WeightUnit}"/></form:fields></form:FormElement><form:FormElement label="{i18n>productMeasuresAttributeText}"><form:fields><Text text="{DimensionWidth} {Unit}, {DimensionDepth} {Unit}, {DimensionHeight} {Unit}"/></form:fields></form:FormElement></form:FormContainer></form:formContainers></form:Form></Panel></core:FragmentDefinition>',
	"sap/ui/demo/cart/view/Home.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.Home"\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"\n\txmlns:mvc="sap.ui.core.mvc"><Page\n\t\tid="page"\n\t\ttitle="{i18n>homeTitle}"\n\t\tbackgroundDesign="Solid"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\trootRole="Region"\n\t\t\t\trootLabel="{i18n>homeTitle} {i18n>Home_rootLabel}"\n\t\t\t\tsubHeaderRole="Search"\n\t\t\t\tsubHeaderLabel="{i18n>Home_subHeaderLabel}"\n\t\t\t\tcontentRole="Navigation"\n\t\t\t\tcontentLabel="{i18n>Home_contentLabel}"\n\t\t\t\theaderRole="Region" headerLabel="{i18n>Home_headerLabel}"/></landmarkInfo><headerContent><Button\n\t\t\t\ticon="sap-icon://home"\n\t\t\t\tpress=".onBack"\n\t\t\t\tvisible="{appView>/smallScreenMode}"/></headerContent><subHeader><Toolbar id="searchBar33343"><SearchField\n\t\t\t\t\tid="searchField"\n\t\t\t\t\tliveChange=".onSearch"\n\t\t\t\t\tplaceholder="{i18n>homeSearchPlaceholder}"\n\t\t\t\t\ttooltip="{i18n>homeSearchTooltip}"\n\t\t\t\t\twidth="100%"></SearchField></Toolbar></subHeader><content><PullToRefresh\n\t\t\t\tid="pullToRefresh"\n\t\t\t\tvisible="{device>/support/touch}"\n\t\t\t\trefresh=".onRefresh"/><List\n\t\t\t\tvisible="false"\n\t\t\t\tid="productList"\n\t\t\t\tmode="{= ${device>/system/phone} ? \'None\' : \'SingleSelectMaster\'}"\n\t\t\t\tselectionChange=".onProductListSelect"\n\t\t\t\tnoDataText="{i18n>homeNoData}"\n\t\t\t\tbusyIndicatorDelay="0"\n\t\t\t\titems="{\n\t\t\t\t\tpath : \'/Products\',\n\t\t\t\t\tsorter : {\n\t\t\t\t\t\tpath : \'Name\',\n\t\t\t\t\t\tdescending : false\n\t\t\t\t\t}\n\t\t\t\t}"><items><ObjectListItem\n\t\t\t\t\t\ttype="{= ${device>/system/phone} ? \'Active\' : \'Inactive\'}"\n\t\t\t\t\t\ticon="{\n\t\t\t\t\t\t\tpath : \'PictureUrl\',\n\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\ttitle="{Name}"\n\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\tpath : \'Price\',\n\t\t\t\t\t\t\tformatter : \'.formatter.price\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tnumberUnit="EUR"\n\t\t\t\t\t\tpress=".onProductListItemPress"\n\t\t\t\t\t\ticonDensityAware="false"><attributes><ObjectAttribute text="{SupplierName}"/></attributes><firstStatus><ObjectStatus\n\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\tpath : \'Status\',\n\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\tpath : \'Status\',\n\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'\n\t\t\t\t\t\t\t\t}"/></firstStatus></ObjectListItem></items></List><List\n\t\t\t\tid="categoryList"\n\t\t\t\theaderText="{i18n>homeCategoryListHeader}"\n\t\t\t\tmode="None"\n\t\t\t\tbusyIndicatorDelay="0"\n\t\t\t\titems="{\n\t\t\t\t\tpath : \'/ProductCategories\',\n\t\t\t\t\tsorter : {\n\t\t\t\t\t\tpath : \'CategoryName\',\n\t\t\t\t\t\tdescending: false\n\t\t\t\t\t}\n\t\t\t\t}"><items><StandardListItem\n\t\t\t\t\t\ttitle="{CategoryName}"\n\t\t\t\t\t\ttype="Active"\n\t\t\t\t\t\tcounter="{NumberOfProducts}"\n\t\t\t\t\t\tpress=".onCategoryListItemPress"\n\t\t\t\t\t\ttooltip="{i18n>openCategoryProducts} {CategoryName}"><customData><core:CustomData\n\t\t\t\t\t\t\t\tkey="id"\n\t\t\t\t\t\t\t\tvalue="{Category}"/></customData></StandardListItem></items></List></content></Page></mvc:View>\n',
	"sap/ui/demo/cart/view/NotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.NotFound"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"><Page\n\t\tid="page"\n\t\ttitle="{i18n>categoryNoData}"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\trootRole="Region"\n\t\t\t\trootLabel="{i18n>NotFound_rootLabel}"\n\t\t\t\tcontentRole="Main"\n\t\t\t\tcontentLabel="{i18n>NotFound_contentLabel}"\n\t\t\t\theaderRole="Region"\n\t\t\t\theaderLabel="{i18n>NotFound_headerLabel}"/></landmarkInfo><content><MessagePage\n\t\t\t\tshowHeader="false"\n\t\t\t\ttext="{i18n>categoryNoData}"\n\t\t\t\tdescription=""/></content></Page></mvc:View>\n',
	"sap/ui/demo/cart/view/OrderCompleted.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.OrderCompleted"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m"><Page\n\t\tid="orderCompletedPage"\n\t\ttitle="{i18n>orderCompletedTitle}"\n\t\tbackgroundDesign="Solid"\n\t\tclass="sapUiContentPadding"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\trootRole="Region"\n\t\t\t\trootLabel="{i18n>OrderCompleted_rootLabel}"\n\t\t\t\tcontentRole="Main"\n\t\t\t\tcontentLabel="{i18n>OrderCompleted_contentLabel}"\n\t\t\t\theaderRole="Region"\n\t\t\t\theaderLabel="{i18n>OrderCompleted_headerLabel}"\n\t\t\t\tfooterRole="Region"\n\t\t\t\tfooterLabel="{i18n>OrderCompleted_footerLabel}"/></landmarkInfo><content><FormattedText htmlText="{i18n>orderCompletedText}"/></content><footer><Bar><contentRight><Button\n\t\t\t\t\t\tid="returnToShopButton"\n\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\ttext="{i18n>returnToShopButtonText}"\n\t\t\t\t\t\tpress=".onReturnToShopButtonPress"/></contentRight></Bar></footer></Page></mvc:View>\n',
	"sap/ui/demo/cart/view/Product.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.Product"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><Page\n\t\tid="page"\n\t\tbackgroundDesign="Solid"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\trootRole="Region"\n\t\t\t\trootLabel="{i18n>Product_rootLabel}"\n\t\t\t\tcontentRole="Main"\n\t\t\t\tcontentLabel="{i18n>Product_contentLabel}"\n\t\t\t\theaderRole="Region"\n\t\t\t\theaderLabel="{i18n>Product_headerLabel}"\n\t\t\t\tfooterRole="Region"\n\t\t\t\tfooterLabel="{i18n>Product_footerLabel}"/></landmarkInfo><customHeader><Bar><contentLeft><Button\n\t\t\t\t\t\ttype="Back"\n\t\t\t\t\t\tvisible="{appView>/smallScreenMode}"\n\t\t\t\t\t\tpress=".onBack"/></contentLeft><contentMiddle><Title\n\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\ttext="{Name}"/></contentMiddle><contentRight><Button\n\t\t\t\t\t\ticon="sap-icon://customer"\n\t\t\t\t\t\tpress=".onAvatarPress"\n\t\t\t\t\t\ttooltip="{i18n>avatarButtonTooltip}"/><ToggleButton\n\t\t\t\t\t\ticon="sap-icon://cart"\n\t\t\t\t\t\tpressed="{= ${appView>/layout}.startsWith(\'ThreeColumns\') }"\n\t\t\t\t\t\ttooltip="{i18n>toCartButtonTooltip}"\n\t\t\t\t\t\tpress=".onToggleCart"></ToggleButton></contentRight></Bar></customHeader><footer><Toolbar><ToolbarSpacer/><Button\n\t\t\t\t\ttext="{i18n>addToCartShort}"\n\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\tpress=".onAddToCart" /></Toolbar></footer><content><ObjectHeader\n\t\t\t\ttitle="{Name}"\n\t\t\t\ttitleLevel="H3"\n\t\t\t\tnumber="{\n\t\t\t\t\tpath : \'Price\',\n\t\t\t\t\tformatter : \'.formatter.price\'\n\t\t\t\t}"\n\t\t\t\tnumberUnit="EUR"><attributes><ObjectAttribute\n\t\t\t\t\t\ttitle="{i18n>productSupplierAttributeText}"\n\t\t\t\t\t\ttext="{SupplierName}"/><ObjectAttribute\n\t\t\t\t\t\ttitle="{i18n>productDescriptionAttributeText}"\n\t\t\t\t\t\ttext="{ShortDescription}"/><ObjectAttribute\n\t\t\t\t\t\ttitle="{i18n>productWeightAttributeText}"\n\t\t\t\t\t\ttext="{Weight} {WeightUnit}"/><ObjectAttribute\n\t\t\t\t\t\ttitle="{i18n>productMeasuresAttributeText}"\n\t\t\t\t\t\ttext="{DimensionWidth} {Unit}, {DimensionDepth} {Unit}, {DimensionHeight} {Unit}"/></attributes><statuses><ObjectStatus\n\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\tpath : \'Status\',\n\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\tpath : \'Status\',\n\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'\n\t\t\t\t\t\t}"/></statuses></ObjectHeader><VBox\n\t\t\t\talignItems="Center"\n\t\t\t\trenderType="Div"><Image\n\t\t\t\t\tid="productImage"\n\t\t\t\t\tsrc="{path : \'PictureUrl\', formatter : \'.formatter.pictureUrl\'}"\n\t\t\t\t\tdecorative="true"\n\t\t\t\t\tdensityAware="false"\n\t\t\t\t\tclass="sapUiSmallMargin"\n\t\t\t\t\twidth="100%"\n\t\t\t\t\theight="100%"><detailBox><LightBox id="lightBox"><imageContent><LightBoxItem\n\t\t\t\t\t\t\t\t\timageSrc="{path : \'PictureUrl\', formatter : \'.formatter.pictureUrl\'}"\n\t\t\t\t\t\t\t\t\ttitle="{Name}"/></imageContent></LightBox></detailBox></Image></VBox></content></Page></mvc:View>\n',
	"sap/ui/demo/cart/view/Welcome.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.cart.controller.Welcome"\n\txmlns="sap.m"\n\txmlns:l="sap.ui.layout"\n\txmlns:mvc="sap.ui.core.mvc"><Page\n\t\tid="page"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\trootRole="Region"\n\t\t\t\trootLabel="{i18n>Welcome_rootLabel}"\n\t\t\t\tcontentRole="Main"\n\t\t\t\tcontentLabel="{i18n>Welcome_contentLabel}"\n\t\t\t\theaderRole="Region"\n\t\t\t\theaderLabel="{i18n>Welcome_headerLabel}"/></landmarkInfo><customHeader><Bar><contentLeft><Button\n\t\t\t\t\t\ticon="sap-icon://menu2"\n\t\t\t\t\t\tpress=".onShowCategories"\n\t\t\t\t\t\tvisible="{appView>/smallScreenMode}"/></contentLeft><contentMiddle><Title\n\t\t\t\t\t\tlevel="H2"\n\t\t\t\t\t\ttooltip="{i18n>welcomeDescription}"\n\t\t\t\t\t\ttext="{i18n>welcomeHeadline}"/></contentMiddle><contentRight><Button\n\t\t\t\t\t\ticon="sap-icon://customer"\n\t\t\t\t\t\tpress=".onAvatarPress"\n\t\t\t\t\t\ttooltip="{i18n>avatarButtonTooltip}"/><ToggleButton\n\t\t\t\t\t\ticon="sap-icon://cart"\n\t\t\t\t\t\tpressed="{= ${appView>/layout}.startsWith(\'ThreeColumns\') }"\n\t\t\t\t\t\ttooltip="{i18n>toCartButtonTooltip}"\n\t\t\t\t\t\tpress=".onToggleCart"></ToggleButton></contentRight></Bar></customHeader><content><l:BlockLayout background="Light"><l:BlockLayoutRow><l:BlockLayoutCell class="sapUiNoContentPadding"><Carousel\n\t\t\t\t\t\t\tid="welcomeCarousel"\n\t\t\t\t\t\t\tshowPageIndicator="false"\n\t\t\t\t\t\t\tloop="true"\n\t\t\t\t\t\t\tpageChanged=".onCarouselPageChanged"\n\t\t\t\t\t\t\tvisible="{=!${device>/system/phone}}"\n\t\t\t\t\t\t\ttooltip="{i18n>welcomeDescription}"><pages><VBox renderType="Bare"><Image\n\t\t\t\t\t\t\t\t\t\tsrc="{\n\t\t\t\t\t\t\t\t\t\t\tpath: \'view>/welcomeCarouselShipping\',\n\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\theight="100%"/><Text\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>welcomeCarouselShipping}"\n\t\t\t\t\t\t\t\t\t\tclass="welcomeCarouselText"/></VBox><VBox renderType="Bare"><Image\n\t\t\t\t\t\t\t\t\t\tsrc="{\n\t\t\t\t\t\t\t\t\t\t\tpath: \'view>/welcomeCarouselInviteFriend\',\n\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\theight="100%"/><Text\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>welcomeCarouselInviteFriend}"\n\t\t\t\t\t\t\t\t\t\tclass="welcomeCarouselText"/></VBox><VBox renderType="Bare"><Image\n\t\t\t\t\t\t\t\t\t\tsrc="{\n\t\t\t\t\t\t\t\t\t\t\tpath: \'view>/welcomeCarouselTablet\',\n\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\theight="100%"/><Text\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>welcomeCarouselTablet}"\n\t\t\t\t\t\t\t\t\t\tclass="welcomeCarouselText"/></VBox><VBox renderType="Bare"><Image\n\t\t\t\t\t\t\t\t\t\tsrc="{\n\t\t\t\t\t\t\t\t\t\t\tpath: \'view>/welcomeCarouselCreditCard\',\n\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\theight="100%"/><Text\n\t\t\t\t\t\t\t\t\t\ttext="{i18n>welcomeCarouselCreditCard}"\n\t\t\t\t\t\t\t\t\t\tclass="welcomeCarouselText"/></VBox></pages></Carousel></l:BlockLayoutCell></l:BlockLayoutRow></l:BlockLayout><Panel\n\t\t\t\tid="panelPromoted"\n\t\t\t\taccessibleRole="Region"\n\t\t\t\tbackgroundDesign="Transparent"\n\t\t\t\tclass="sapUiNoContentPadding"><headerToolbar><Toolbar><Title\n\t\t\t\t\t\t\ttext="{i18n>promotedTitle}"\n\t\t\t\t\t\t\tlevel="H3"\n\t\t\t\t\t\t\ttitleStyle="H2"\n\t\t\t\t\t\t\tclass="sapUiMediumMarginTopBottom"/></Toolbar></headerToolbar><l:BlockLayout background="Dashboard"><l:BlockLayoutRow\n\t\t\t\t\t\tid="promotedRow"\n\t\t\t\t\t\tcontent="{view>/Promoted}"><l:content><l:BlockLayoutCell><l:Grid\n\t\t\t\t\t\t\t\t\tdefaultSpan="XL12 L12 M12 S12"\n\t\t\t\t\t\t\t\t\tvSpacing="0"\n\t\t\t\t\t\t\t\t\thSpacing="0"><FlexBox\n\t\t\t\t\t\t\t\t\t\theight="3.5rem"\n\t\t\t\t\t\t\t\t\t\trenderType="Bare"><l:VerticalLayout><ObjectIdentifier\n\t\t\t\t\t\t\t\t\t\t\t\ttitle="{view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\t\ttitleActive="true"\n\t\t\t\t\t\t\t\t\t\t\t\ttitlePress=".onSelectProduct"\n\t\t\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>openProductDetails} {view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="sapUiTinyMarginBottom"/><ObjectStatus\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'view>Product/Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'view>Product/Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'}"/></l:VerticalLayout></FlexBox><FlexBox\n\t\t\t\t\t\t\t\t\t\trenderType="Bare"\n\t\t\t\t\t\t\t\t\t\tjustifyContent="Center"><Image\n\t\t\t\t\t\t\t\t\t\t\tsrc="{\n\t\t\t\t\t\t\t\t\t\t\t\tpath: \'view>Product/PictureUrl\',\n\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\tdensityAware="false"\n\t\t\t\t\t\t\t\t\t\t\twidth="50%"\n\t\t\t\t\t\t\t\t\t\t\theight="50%"\n\t\t\t\t\t\t\t\t\t\t\tpress=".onSelectProduct"\n\t\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>openProductDetails} {view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\talt="{i18n>alternativeImageText} {view>Product/Name}"/></FlexBox><Button\n\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>addToCart}"\n\t\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\t\tpress=".onAddToCart"\n\t\t\t\t\t\t\t\t\t\ticon="sap-icon://cart-3"><layoutData><l:GridData span="XL4 L4 M4 S4"/></layoutData></Button><ObjectListItem\n\t\t\t\t\t\t\t\t\t\tclass="welcomePrice"\n\t\t\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\t\t\tparts:[\n\t\t\t\t\t\t\t\t\t\t\t\t{path:\'view>Product/Price\'},\n\t\t\t\t\t\t\t\t\t\t\t\t{path:\'view>/Currency\'}\n\t\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\t\ttype:\'sap.ui.model.type.Currency\',\n\t\t\t\t\t\t\t\t\t\t\tformatOptions:{showMeasure: false}\n\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\tnumberUnit="{view>/Currency}"><layoutData><l:GridData span="XL8 L8 M8 S8"/></layoutData></ObjectListItem></l:Grid></l:BlockLayoutCell></l:content></l:BlockLayoutRow></l:BlockLayout></Panel><Panel\n\t\t\t\tid="panelViewed"\n\t\t\t\taccessibleRole="Region"\n\t\t\t\tbackgroundDesign="Transparent"\n\t\t\t\tclass="sapUiNoContentPadding"><headerToolbar><Toolbar><Title\n\t\t\t\t\t\t\ttext="{i18n>viewedTitle}"\n\t\t\t\t\t\t\tlevel="H3"\n\t\t\t\t\t\t\ttitleStyle="H2"\n\t\t\t\t\t\t\tclass="sapUiMediumMarginTopBottom"/></Toolbar></headerToolbar><l:BlockLayout background="Dashboard"><l:BlockLayoutRow\n\t\t\t\t\t\tid="viewedRow"\n\t\t\t\t\t\tcontent="{view>/Viewed}"><l:content><l:BlockLayoutCell class="sapUiContentPadding"><l:Grid\n\t\t\t\t\t\t\t\t\tdefaultSpan="XL12 L12 M12 S12"\n\t\t\t\t\t\t\t\t\tvSpacing="0"\n\t\t\t\t\t\t\t\t\thSpacing="0"><FlexBox\n\t\t\t\t\t\t\t\t\t\theight="3.5rem"\n\t\t\t\t\t\t\t\t\t\trenderType="Bare"><l:VerticalLayout><ObjectIdentifier\n\t\t\t\t\t\t\t\t\t\t\t\ttitle="{view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>openProductDetails} {view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\t\ttitleActive="true"\n\t\t\t\t\t\t\t\t\t\t\t\ttitlePress=".onSelectProduct"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="sapUiTinyMarginBottom"/><ObjectStatus\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'view>Product/Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'view>Product/Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'}"/></l:VerticalLayout></FlexBox><FlexBox\n\t\t\t\t\t\t\t\t\t\trenderType="Bare"\n\t\t\t\t\t\t\t\t\t\tjustifyContent="Center"><Image\n\t\t\t\t\t\t\t\t\t\t\tsrc="{\n\t\t\t\t\t\t\t\t\t\t\t\tpath: \'view>Product/PictureUrl\',\n\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\t\theight="100%"\n\t\t\t\t\t\t\t\t\t\t\tpress=".onSelectProduct"\n\t\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>openProductDetails} {view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\talt="{i18n>alternativeImageText} {view>Product/Name}"/></FlexBox><Button\n\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>addToCart}"\n\t\t\t\t\t\t\t\t\t\tpress=".onAddToCart"\n\t\t\t\t\t\t\t\t\t\ticon="sap-icon://cart-3"\n\t\t\t\t\t\t\t\t\t\ttype="Emphasized"><layoutData><l:GridData span="XL4 L4 M4 S4"/></layoutData></Button><ObjectListItem\n\t\t\t\t\t\t\t\t\t\tclass="welcomePrice"\n\t\t\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\t\t\tparts:[\n\t\t\t\t\t\t\t\t\t\t\t\t{path:\'view>Product/Price\'},\n\t\t\t\t\t\t\t\t\t\t\t\t{path:\'view>/Currency\'}\n\t\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\t\ttype:\'sap.ui.model.type.Currency\',\n\t\t\t\t\t\t\t\t\t\t\tformatOptions:{showMeasure: false}\n\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\tnumberUnit="{view>/Currency}"><layoutData><l:GridData span="XL8 L8 M8 S8"/></layoutData></ObjectListItem></l:Grid></l:BlockLayoutCell></l:content></l:BlockLayoutRow></l:BlockLayout></Panel><Panel\n\t\t\t\tid="panelFavorite"\n\t\t\t\taccessibleRole="Region"\n\t\t\t\tbackgroundDesign="Transparent"\n\t\t\t\tclass="sapUiNoContentPadding"><headerToolbar><Toolbar><Title\n\t\t\t\t\t\t\ttext="{i18n>favoriteTitle}"\n\t\t\t\t\t\t\tlevel="H3"\n\t\t\t\t\t\t\ttitleStyle="H2"\n\t\t\t\t\t\t\tclass="sapUiMediumMarginTopBottom"/></Toolbar></headerToolbar><l:BlockLayout background="Dashboard"><l:BlockLayoutRow\n\t\t\t\t\t\tid="favoriteRow"\n\t\t\t\t\t\tcontent="{view>/Favorite}"><l:content><l:BlockLayoutCell class="sapUiContentPadding"><l:Grid\n\t\t\t\t\t\t\t\t\tdefaultSpan="XL12 L12 M12 S12"\n\t\t\t\t\t\t\t\t\tvSpacing="0"\n\t\t\t\t\t\t\t\t\thSpacing="0"><FlexBox\n\t\t\t\t\t\t\t\t\t\theight="3.5rem"\n\t\t\t\t\t\t\t\t\t\trenderType="Bare"><l:VerticalLayout><ObjectIdentifier\n\t\t\t\t\t\t\t\t\t\t\t\ttitle="{view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>openProductDetails} {view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\t\ttitleActive="true"\n\t\t\t\t\t\t\t\t\t\t\t\ttitlePress=".onSelectProduct"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="sapUiTinyMarginBottom"/><ObjectStatus\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'view>Product/Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusText\'\n\t\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath : \'view>Product/Status\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.statusState\'}"/></l:VerticalLayout></FlexBox><FlexBox\n\t\t\t\t\t\t\t\t\t\trenderType="Bare"\n\t\t\t\t\t\t\t\t\t\tjustifyContent="Center"><Image\n\t\t\t\t\t\t\t\t\t\t\tsrc="{\n\t\t\t\t\t\t\t\t\t\t\t\tpath: \'view>Product/PictureUrl\',\n\t\t\t\t\t\t\t\t\t\t\t\tformatter : \'.formatter.pictureUrl\'\n\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\t\theight="100%"\n\t\t\t\t\t\t\t\t\t\t\tpress=".onSelectProduct"\n\t\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>openProductDetails} {view>Product/Name}"\n\t\t\t\t\t\t\t\t\t\t\talt="{i18n>alternativeImageText} {view>Product/Name}"/></FlexBox><Button\n\t\t\t\t\t\t\t\t\t\ttooltip="{i18n>addToCart}"\n\t\t\t\t\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\t\t\t\t\tpress=".onAddToCart"\n\t\t\t\t\t\t\t\t\t\ticon="sap-icon://cart-3"><layoutData><l:GridData span="XL4 L4 M4 S4"/></layoutData></Button><ObjectListItem\n\t\t\t\t\t\t\t\t\t\tclass="welcomePrice"\n\t\t\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\t\t\tparts:[\n\t\t\t\t\t\t\t\t\t\t\t\t{path:\'view>Product/Price\'},\n\t\t\t\t\t\t\t\t\t\t\t\t{path:\'view>/Currency\'}\n\t\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\t\ttype:\'sap.ui.model.type.Currency\',\n\t\t\t\t\t\t\t\t\t\t\tformatOptions:{showMeasure: false}\n\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\tnumberUnit="{view>/Currency}"><layoutData><l:GridData span="XL8 L8 M8 S8"/></layoutData></ObjectListItem></l:Grid></l:BlockLayoutCell></l:content></l:BlockLayoutRow></l:BlockLayout></Panel></content></Page></mvc:View>\n'
});
//# sourceMappingURL=Component-preload.js.map

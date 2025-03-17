//@ui5-bundle sap/ui/demo/orderbrowser/Component-preload.js
sap.ui.predefine("sap/ui/demo/orderbrowser/Component", [
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"./controller/ListSelector",
	"./controller/ErrorHandler"
], function (UIComponent, Device, models, ListSelector, ErrorHandler) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.orderbrowser.Component", {

		metadata : {
			manifest : "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this method, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init : function () {
			this.oListSelector = new ListSelector();
			this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ListSelector and ErrorHandler are destroyed.
		 * @public
		 * @override
		 */
		destroy : function () {
			this.oListSelector.destroy();
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
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
sap.ui.predefine("sap/ui/demo/orderbrowser/controller/App.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.orderbrowser.controller.App", {

		onInit : function () {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : true,
				delay : 0,
				layout : "OneColumn",
				previousLayout : "",
				actionButtonsInfo : {
					midColumn : {
						fullScreen : false
					}
				}
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
sap.ui.predefine("sap/ui/demo/orderbrowser/controller/BaseController", [
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("sap.ui.demo.orderbrowser.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}

	});
});
sap.ui.predefine("sap/ui/demo/orderbrowser/controller/Detail.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/library"
], function(BaseController, JSONModel, formatter, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	function _calculateOrderTotal (fPreviousTotal, oCurrentContext) {
		var fItemTotal = oCurrentContext.getObject().Quantity * oCurrentContext.getObject().UnitPrice;
		return fPreviousTotal + fItemTotal;
	}
	return BaseController.extend("sap.ui.demo.orderbrowser.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			this._aValidKeys = ["shipping", "processor"];
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0,
				lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading"),
				// Set fixed currency on view model (as the OData service does not provide a currency).
				currency : "EUR",
				// the sum of all items of this order
				totalOrderAmount: 0,
				selectedTab: ""
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress : function () {
			var oViewModel = this.getModel("detailView");

			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},


		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished : function (oEvent) {
			var sTitle,
				fOrderTotal = 0,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView"),
				oItemsBinding = oEvent.getSource().getBinding("items"),
				aItemsContext;

			// only update the counter if the length is final
			if (oItemsBinding.isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);

				aItemsContext = oItemsBinding.getContexts();
				fOrderTotal = aItemsContext.reduce(_calculateOrderTotal, 0);
				oViewModel.setProperty("/totalOrderAmount", fOrderTotal);
			}

		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			this._sObjectId = oArguments.objectId;
			// Don't show two columns when in full screen mode
			if (this.getModel("appView").getProperty("/layout") !== "MidColumnFullScreen") {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			}
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("Orders", {
					OrderID :  this._sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
			var oQuery = oArguments["?query"];
			if (oQuery && this._aValidKeys.indexOf(oQuery.tab) >= 0){
				this.getView().getModel("detailView").setProperty("/selectedTab", oQuery.tab);
				this.getRouter().getTargets().display(oQuery.tab);
			} else {
				this.getRouter().navTo("object", {
					objectId: this._sObjectId,
					query: {
						tab: "shipping"
					}
				}, true);
			}
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView : function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path : sObjectPath,
				parameters: {
					expand: "Customer,Order_Details/Product,Employee"
				},
				events: {
					change : this._onBindingChange.bind(this),
					dataRequested : function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.OrderID,
				sObjectName = oObject.OrderID,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href, oObject.ShipName, oObject.EmployeeID, oObject.CustomerID]));
		},

		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView"),
				oLineItemTable = this.byId("lineItemsList"),
				iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			oLineItemTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		onTabSelect : function(oEvent){
			var sSelectedTab = oEvent.getParameter("selectedKey");
			this.getRouter().navTo("object", {
				objectId: this._sObjectId,
				query: {
					tab: sSelectedTab
				}
			}, true);// true without history

		},

		_onHandleTelephonePress : function (oEvent){
			var sNumber = oEvent.getSource().getText();
			URLHelper.triggerTel(sNumber);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}

		}

	});
});
sap.ui.predefine("sap/ui/demo/orderbrowser/controller/DetailObjectNotFound.controller", [
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.orderbrowser.controller.DetailObjectNotFound", {});
});
sap.ui.predefine("sap/ui/demo/orderbrowser/controller/ErrorHandler", [
	"sap/ui/base/Object",
	"sap/m/MessageBox"
], function (UI5Object, MessageBox) {
	"use strict";

	return UI5Object.extend("sap.ui.demo.orderbrowser.controller.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias sap.ui.demo.orderbrowser.controller.ErrorHandler
		 */
		constructor : function (oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");

			this._oModel.attachMetadataFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				this._showServiceError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showServiceError : function (sDetails) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox.error(
				this._sErrorText,
				{
					id : "serviceErrorMessageBox",
					details : sDetails,
					styleClass : this._oComponent.getContentDensityClass(),
					actions : [MessageBox.Action.CLOSE],
					onClose : function () {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);
		}

	});

});
sap.ui.predefine("sap/ui/demo/orderbrowser/controller/ListSelector", [
	"sap/ui/base/Object",
	"sap/base/Log"
], function (BaseObject, Log) {
	"use strict";

	return BaseObject.extend("sap.ui.demo.orderbrowser.controller.ListSelector", {

		/**
		 * Provides a convenience API for selecting list items. All the functions will wait until the initial load of the a List passed to the instance by the setBoundMasterList
		 * function.
		 * @class
		 * @public
		 * @alias sap.ui.demo.orderbrowser.controller.ListSelector
		 */

		constructor: function () {
			this._oWhenListHasBeenSet = new Promise(function (fnResolveListHasBeenSet) {
				this._fnResolveListHasBeenSet = fnResolveListHasBeenSet;
			}.bind(this));
			// This promise needs to be created in the constructor, since it is allowed to
			// invoke selectItem functions before calling setBoundMasterList
			this.oWhenListLoadingIsDone = new Promise(function (fnResolve, fnReject) {
				// Used to wait until the setBound masterList function is invoked
				this._oWhenListHasBeenSet
					.then(function (oList) {
						oList.getBinding("items").attachEventOnce("dataReceived",
							function () {
								if (this._oList.getItems().length) {
									fnResolve({
										list: oList
									});
								} else {
									// No items in the list
									fnReject({
										list: oList
									});
								}
							}.bind(this)
						);
					}.bind(this));
			}.bind(this));
		},

		/**
		 * A bound list should be passed in here. Should be done, before the list has received its initial data from the server.
		 * May only be invoked once per ListSelector instance.
		 * @param {sap.m.List} oList The list all the select functions will be invoked on.
		 * @public
		 */
		setBoundMasterList: function (oList) {
			this._oList = oList;
			this._fnResolveListHasBeenSet(oList);
		},

		/**
		 * Tries to select and scroll to a list item with a matching binding context. If there are no items matching the binding context or the ListMode is none,
		 * no selection/scrolling will happen
		 * @param {string} sBindingPath the binding path matching the binding path of a list item
		 * @public
		 */
		selectAListItem: function (sBindingPath) {

			this.oWhenListLoadingIsDone.then(
				function () {
					var oList = this._oList,
						oSelectedItem;

					if (oList.getMode() === "None") {
						return;
					}

					oSelectedItem = oList.getSelectedItem();

					// skip update if the current selection is already matching the object path
					if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sBindingPath) {
						return;
					}

					oList.getItems().some(function (oItem) {
						if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === sBindingPath) {
							oList.setSelectedItem(oItem);
							return true;
						}
					});
				}.bind(this),
				function () {
					Log.warning("Could not select the list item with the path" + sBindingPath + " because the list encountered an error or had no items");
				}
			);
		},

		/**
		 * Removes all selections from master list.
		 * Does not trigger 'selectionChange' event on master list, though.
		 * @public
		 */
		clearMasterListSelection: function () {
			//use promise to make sure that 'this._oList' is available
			this._oWhenListHasBeenSet.then(function () {
				this._oList.removeSelections(true);
			}.bind(this));
		}
	});
});
sap.ui.predefine("sap/ui/demo/orderbrowser/controller/Master.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"sap/ui/core/format/DateFormat"
], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, GroupHeaderListItem, Device, Fragment, formatter, DateFormat) {
	"use strict";

	return BaseController.extend("sap.ui.demo.orderbrowser.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit : function () {
			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oGroupFunctions = {
				CompanyName: function (oContext) {
					var sCompanyName = oContext.getProperty("Customer/CompanyName");
					return {
						key: sCompanyName,
						text: sCompanyName
					};
				},

				OrderDate: function (oContext) {
					var oDate = oContext.getProperty("OrderDate"),
						iYear = oDate.getFullYear(),
						iMonth = oDate.getMonth() + 1,
						sMonthName = this._oMonthNameFormat.format(oDate);

					return {
						key: iYear + "-" + iMonth,
						text: this.getResourceBundle().getText("masterGroupTitleOrderedInPeriod", [sMonthName, iYear])
					};
				}.bind(this),

				ShippedDate: function (oContext) {
					var oDate = oContext.getProperty("ShippedDate");
					// Special handling needed because shipping date may be empty (=> not yet shipped).
					if (oDate != null) {
						var iYear = oDate.getFullYear(),
							iMonth = oDate.getMonth() + 1,
							sMonthName = this._oMonthNameFormat.format(oDate);

						return {
							key: iYear + "-" + iMonth,
							text: this.getResourceBundle().getText("masterGroupTitleShippedInPeriod", [sMonthName, iYear])
						};
					} else {
						return {
							key: 0,
							text: this.getResourceBundle().getText("masterGroupTitleNotShippedYet")
						};
					}
				}.bind(this)
			};
			this._oMonthNameFormat = DateFormat.getInstance({ pattern: "MMMM"});

			this._oList = oList;

			// keeps the filter and search state
			this._oListFilterState = {
				aFilter : [],
				aSearch : []
			};

			this.setModel(oViewModel, "masterView");
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oList.attachEventOnce("updateFinished", function(){
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished : function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("CustomerName", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh : function () {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the filter, sort and group buttons to open the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onOpenViewSettings : function (oEvent) {
			var sDialogTab = "filter";
			if (oEvent.getSource().isA("sap.m.Button")) {
				var sButtonId = oEvent.getSource().getId();
				if (sButtonId.match("sort")) {
					sDialogTab = "sort";
				} else if (sButtonId.match("group")) {
					sDialogTab = "group";
				}
			}
			// load asynchronous XML fragment
			if (!this._pViewSettingsDialog) {
				this._pViewSettingsDialog = Fragment.load({
					id: this.getView().getId(),
					name: "sap.ui.demo.orderbrowser.view.ViewSettingsDialog",
					controller: this
				}).then(function(oDialog){
					// connect dialog to the root view of this component (models, lifecycle)
					this.getView().addDependent(oDialog);
					oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					return oDialog;
				}.bind(this));
			}
			this._pViewSettingsDialog.then(function(oDialog) {
				oDialog.open(sDialogTab);
			});
		},

		/**
		 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
		 * has been closed with 'OK'. In the case, the currently chosen filters or groupers
		 * are applied to the master list, which can also mean that they
		 * are removed from the master list, in case they are
		 * removed in the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @public
		 */
		onConfirmViewSettingsDialog : function (oEvent) {
			var aFilterItems = oEvent.getParameter("filterItems"),
				aFilters = [],
				aCaptions = [];
			aFilterItems.forEach(function (oItem) {
				switch (oItem.getKey()) {
					case "Shipped":
						aFilters.push(new Filter("ShippedDate", FilterOperator.NE, null));
						break;
					case "NotShipped":
						aFilters.push(new Filter("ShippedDate", FilterOperator.EQ, null));
						break;
					default:
					break;
				}
				aCaptions.push(oItem.getText());
			});
			this._oListFilterState.aFilter = aFilters;
			this._updateFilterBar(aCaptions.join(", "));
			this._applyFilterSearch();
			this._applyGrouper(oEvent);
		},

		/**
		 * Apply the chosen grouper to the master list
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @private
		 */
		_applyGrouper: function (oEvent) {
			var mParams = oEvent.getParameters(),
				sPath,
				bDescending,
				aSorters = [];
			// apply sorter to binding
			if (mParams.groupItem) {
				mParams.groupItem.getKey() === "CompanyName" ?
					sPath = "Customer/" + mParams.groupItem.getKey() : sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				var vGroup = this._oGroupFunctions[mParams.groupItem.getKey()];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			this._oList.getBinding("items").sort(aSorters);
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange : function (oEvent) {
			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed : function () {
			this._oList.removeSelections(true);
		},

		/**
		 * Used to create GroupHeaders with non-capitalized caption.
		 * These headers are inserted into the master list to
		 * group the master list's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
		createGroupHeader : function (oGroup) {
			return new GroupHeaderListItem({
				title : oGroup.text
			});
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */


		_createViewModel : function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				titleCount: 0,
				noDataText: this.getResourceBundle().getText("masterListNoDataText")
			});
		},

		_onMasterMatched :  function() {
			//Set the layout property of the FCL control to 'OneColumn'
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail : function (oItem) {
			var bReplace = !Device.system.phone;
			// set the layout property of FCL control to show two columns
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				objectId : oItem.getBindingContext().getProperty("OrderID")
			}, bReplace);
		},

		/**
		 * Sets the item count on the master list header
		 * @param {int} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount : function (iTotalItems) {
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				this.getModel("masterView").setProperty("/titleCount", iTotalItems);
			}
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch : function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar : function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		}

	});
});
sap.ui.predefine("sap/ui/demo/orderbrowser/controller/NotFound.controller", [
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.orderbrowser.controller.NotFound", {

		onInit: function () {
			this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
		},

		_onNotFoundDisplayed : function () {
			this.getModel("appView").setProperty("/layout", "OneColumn");
		}
	});
});
sap.ui.predefine("sap/ui/demo/orderbrowser/localService/mockserver", [
	"sap/ui/core/util/MockServer",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function (MockServer, JSONModel, Log) {
	"use strict";

	var oMockServer,
		_sAppPath = "sap/ui/demo/orderbrowser/",
		_sJsonFilesPath = _sAppPath + "localService/mockdata";

	var oMockServerInterface = {

		/**
		 * Initializes the mock server asynchronously.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @protected
		 * @returns{Promise} a promise that is resolved when the mock server has been started
		 */
		init : function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			return new Promise(function(fnResolve) {
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
					Log.error("Failed to load application manifest");
					fnResolve();
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
sap.ui.predefine("sap/ui/demo/orderbrowser/model/formatter", [
	"sap/ui/model/type/Currency"
], function (Currency) {
	"use strict";

	return {

		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {number} iQuantity product quantity
		 * @param {number} fPrice product price
		 * @param {string} sCurrencyCode currency code for the price
		 * @returns {string} formatted currency value with 2 digits
		 */
		calculateItemTotal: function (iQuantity, fPrice, sCurrencyCode) {
			var oCurrency = new Currency({showMeasure: false});
			var fTotal = iQuantity * fPrice;
			return oCurrency.formatValue([fTotal.toFixed(2), sCurrencyCode], "string");
		},

		/**
		 * Converts a binary string into an image format suitable for the src attribute
		 *
		 * @public
		 * @param {string} vData a binary string representing the image data
		 * @returns {string} formatted string with image metadata based on the input or a default image when the input is empty
		 */
		handleBinaryContent: function(vData){
			if (vData) {
				var sMetaData1 = 'data:image/jpeg;base64,';
				var sMetaData2 = vData.substr(104); // stripping the first 104 bytes from the binary data when using base64 encoding.
				return sMetaData1 + sMetaData2;
			} else {
				return "../images/Employee.png";
			}
		},

		/**
		 * Provides a text to indicate the delivery status based on shipped and required dates
		 *
		 * @public
		 * @param {object} oRequiredDate required date of the order
		 * @param {object} oShippedDate shipped date of the order
		 * @returns {string} delivery status text from the resource bundle
		 */
		deliveryText: function (oRequiredDate, oShippedDate) {
			var oResourceBundle = this.getModel("i18n").getResourceBundle();

			if (oShippedDate === null) {
				return "None";
			}

			// delivery is urgent (takes more than 7 days)
			if (oRequiredDate - oShippedDate > 0 && oRequiredDate - oShippedDate <= 432000000) {
				return oResourceBundle.getText("formatterDeliveryUrgent");
			} else if (oRequiredDate < oShippedDate) { //d elivery is too late
				return oResourceBundle.getText("formatterDeliveryTooLate");
			} else { // delivery is in time
				return oResourceBundle.getText("formatterDeliveryInTime");
			}
		},

		/**
		 * Provides a semantic state to indicate the delivery status based on shipped and required dates
		 *
		 * @public
		 * @param {object} oRequiredDate required date of the order
		 * @param {object} oShippedDate shipped date of the order
		 * @returns {string} semantic state of the order
		 */
		deliveryState: function (oRequiredDate, oShippedDate) {
			if (oShippedDate === null) {
				return "None";
			}

			// delivery is urgent (takes more than 7 days)
			if (oRequiredDate - oShippedDate > 0 && oRequiredDate - oShippedDate <= 432000000) {
				return "Warning";
			} else if (oRequiredDate < oShippedDate) { // delivery is too late
				return "Error";
			} else { // delivery is in time
				return "Success";
			}
		}
	};
});
sap.ui.predefine("sap/ui/demo/orderbrowser/model/models", [
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

	}
);
sap.ui.require.preload({
	"sap/ui/demo/orderbrowser/i18n/i18n.properties":'# This is the resource bundle for Browse Orders\n# __ldi.translation.uuid=750eee8c-73f4-4e64-b4a5-bd756e0aab4d\n\n#XTIT: Application name\nappTitle=Browse Orders\n\n#YDES: Application description\nappDescription=Master-Detail demo application for displaying orders\n\n#~~~ Master AND Detail Views ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: View title with placeholder for the number of items\ncommonItemTitle=Order {0}\n\n#XFLD: Title for customer name attribute in view headers\ncommonCustomerName=Customer\n\n#XFLD: Title for shipping date attribute in view headers\ncommonItemShipped=Shipped\n\n#XFLD: Explanation that an order has not been shipped yet\ncommonItemNotYetShipped=Not shipped yet\n\n#~~~ Master View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Master view title with placeholder for the number of items\nmasterTitleCount=Orders ({0})\n\n#XTOL: Tooltip for the search field\nmasterSearchTooltip=Enter an order name or a part of it.\n\n#XBLI: text for a list with no data\nmasterListNoDataText=No orders are currently available\n\n#XBLI: text for a list with no data with filter or search\nmasterListNoDataWithFilterOrSearchText=No matching order found\n\n#XMIT: Group option for master table: Disable grouping\nmasterGroupNoGrouping=None\n\n#XMIT: Group option for master table: by customer name\nmasterGroupCustomer=Group by Customer\n\n#XMIT: Group option for master table: by order period\nmasterGroupOrderPeriod=Group by Order Period\n\n#XGRP: Group title in grouped table for orders ordered in a period of time, consisting on month (parameter 0) and year (parameter 1)\nmasterGroupTitleOrderedInPeriod=Ordered in {0} {1}\n\n#XMIT: Group option for master table: by shipped period\nmasterGroupShippedPeriod=Group by Shipped Period\n\n#XGRP: Group title in grouped table for orders shipped in a period of time, consisting on month (parameter 0) and year (parameter 1)\nmasterGroupTitleShippedInPeriod=Shipped in {0} {1}\n\n#XGRP: Special group title in grouped table for orders shipped in a period of time, for orders with pending shipment\nmasterGroupTitleNotShippedYet=Not Shipped Yet\n\n#XGRP: Filter option for master table: Only orders with shipments\nmasterFilterShipped=Only Shipped Orders\n\n#XGRP: Filter option for master table: Only orders with pending shipments\nmasterFilterNotShipped=Only Orders without Shipment\n\n#XTXT: Text for the view settings filter item\nfilterName=Orders\n\n#YMSG: Filter text that is displayed above the master list\nmasterFilterBarText=Filtered by {0}\n\n#~~~ Detail View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XFLD: Title for order date attribute in header of detail view\ndetailOrderDate=Ordered\n\n#XTOL: Icon Tab Bar Info\ndetailIconTabBarItems=Items\n\n#XTOL: Icon Tab Bar Attachments\ndetailIconTabBarShipping=Shipping Info\n\n#XTOL: Icon Tab Bar Attachments\ndetailIconTabBarAttachments=Attachments\n\n#XTOL: Icon Tab Bar Processor\ndetailIconTabBarProcessor=Processor\n\n#XTIT: Form Title on the Tab Shipping Address Info\ndetailShippingAddressTitle=Shipping Address\n\n#XTIT: Form Title on the Tab Processor Info\ndetailProcessorTitle=Processor Information\n\n#XTIT: Details Title on the Tab Processor\ndetailsProcessorTitle=Details\n\n#XTIT: Photo Title  on the Tab Processor\nphotoProcessorTitle=Picture\n\n#XFLD: Label for Address\ndetailName=Name\n\n#XFLD: Label for Address\ndetailShippingStreet=Street\n\n#XFLD: Label for Address\ndetailShippingZIPCodeCity=ZIP Code / City\n\n#XFLD: Label for Address\ndetailShippingRegion=Region\n\n#XFLD: Label for Address\ndetailShippingCountry=Country\n\n#XFLD: Label for Employee ID\ndetailProcessorEmployeeID=Employee ID\n\n#XFLD: Label for Job Title\ndetailProcessorJobTitle=Job Title\n\n#XFLD: Label for Phone\ndetailProcessorPhone=Phone\n\n#XBLI: Text for the Order_Details table with no data\ndetailLineItemTableNoDataText=No line items\n\n#XTIT: Title of the Order_Details table\ndetailLineItemTableHeading=Line Items\n\n#XTIT: Title of the Order_Details table\ndetailLineItemTableHeadingCount=Line Items ({0})\n\n#XGRP: Title for the ProductID column in the Order_Details table\ndetailLineItemTableIDColumn=Product\n\n#XGRP: Title for the Quantity column in the Order_Details table\ndetailLineItemTableUnitQuantityColumn=Quantity\n\n#XGRP: Title for the Price column in the Order_Details table\ndetailLineItemTableUnitPriceColumn=Unit Price\n\n#XGRP: Title for the Total column in the Order_Details table\ndetailLineItemTableTotalColumn=Total\n\n#XTIT: Send E-Mail subject\nshareSendEmailObjectSubject=Order {0}\n\n#YMSG: Send E-Mail message\nshareSendEmailObjectMessage=Please take a look at order {0} (id: {1})\\r\\n{2} \\n\\nMore Information on this order:\\n- Customer Name: {3}\\n- Customer ID: {5}\\n- Processor ID: {4}\n\n#XTIT: Label text for price\npriceText=Price\n\n#XTIT: Title for the Order Details\ndetailTitle=Order Details\n\n#~~~ Not Found View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Not found view title\nnotFoundTitle=Not Found\n\n#YMSG: The Orders not found text is displayed when there is no Orders with this id\nnoObjectFoundText=This order is not available\n\n#YMSG: The not found text is displayed when there was an error loading the resource (404 error)\nnotFoundText=The requested resource was not found\n\n#~~~ Not Available View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Master view title\nnotAvailableViewTitle=Orders\n\n#~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~\n\n#YMSG: Error dialog description\nerrorText=Sorry, a technical error occurred! Please try again later.\n\n#~~~  Data Binding Content ~~~~~~~~~~~~~~~~~~~~~~~\nformatterDeliveryTooLate=Too late\nformatterDeliveryInTime=In time\nformatterDeliveryUrgent=Urgent\n',
	"sap/ui/demo/orderbrowser/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ui.demo.orderbrowser","type":"application","resources":"resources.json","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""],"fallbackLocale":""},"title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"dataSources":{"mainService":{"uri":"/here/goes/your/serviceUrl/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://detail-view","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.orderbrowser.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.f":{},"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.orderbrowser.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}},"":{"dataSource":"mainService","preload":true}},"routing":{"config":{"routerClass":"sap.f.routing.Router","type":"View","viewType":"XML","path":"sap.ui.demo.orderbrowser.view","controlId":"layout","controlAggregation":"beginColumnPages","bypassed":{"target":"notFound"},"async":true},"routes":[{"pattern":"","name":"master","target":"master"},{"pattern":"Orders/{objectId}/:?query:","name":"object","target":["master","object"]}],"targets":{"master":{"name":"Master","level":1,"id":"master"},"object":{"name":"Detail","id":"detail","level":1,"controlAggregation":"midColumnPages"},"detailObjectNotFound":{"name":"DetailObjectNotFound","id":"detailObjectNotFound","controlAggregation":"midColumnPages"},"notFound":{"name":"NotFound","id":"notFound"},"shipping":{"name":"Shipping","parent":"object","controlId":"iconTabFilterShipping","controlAggregation":"content"},"processor":{"name":"Processor","parent":"object","controlId":"iconTabFilterProcessor","controlAggregation":"content"}}}}}',
	"sap/ui/demo/orderbrowser/view/App.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.orderbrowser.controller.App"\n\tdisplayBlock="true"\n\theight="100%"\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:mvc="sap.ui.core.mvc"><App\n\t\tid="app"\n\t\tbusy="{appView>/busy}"\n\t\tbusyIndicatorDelay="{appView>/delay}"><f:FlexibleColumnLayout\n\t\t\tid="layout"\n\t\t\tlayout="{appView>/layout}"\n\t\t\tbackgroundDesign="Translucent"></f:FlexibleColumnLayout></App></mvc:View>',
	"sap/ui/demo/orderbrowser/view/Detail.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.orderbrowser.controller.Detail"\n\txmlns="sap.m"\n\txmlns:semantic="sap.f.semantic"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:core="sap.ui.core"\n\txmlns:l="sap.ui.layout"><semantic:SemanticPage\n\t\tid="page"\n\t\tbusy="{detailView>/busy}"\n\t\tbusyIndicatorDelay="{detailView>/delay}"\n\t\tcore:require="{\n\t\t\tformatMessage: \'sap/base/strings/formatMessage\',\n\t\t\tDateType: \'sap/ui/model/type/Date\'\n\t\t}"><semantic:titleHeading><Title\n\t\t\t\ttext="{\n\t\t\t\t\tparts: [\n\t\t\t\t\t\t\'i18n>commonItemTitle\',\n\t\t\t\t\t\t\'OrderID\'\n\t\t\t\t\t],\n\t\t\t\t\tformatter: \'formatMessage\'\n\t\t\t\t}"/></semantic:titleHeading><semantic:headerContent><l:HorizontalLayout><l:VerticalLayout class="sapUiMediumMarginEnd"><ObjectAttribute\n\t\t\t\t\t\ttitle="{i18n>commonCustomerName}"\n\t\t\t\t\t\ttext="{Customer/CompanyName}"/><ObjectAttribute\n\t\t\t\t\t\ttitle="{i18n>detailOrderDate}"\n\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\tpath: \'OrderDate\',\n\t\t\t\t\t\t\ttype: \'DateType\',\n\t\t\t\t\t\t\tformatOptions: { style: \'medium\' }\n\t\t\t\t\t\t}"/><ObjectAttribute\n\t\t\t\t\t\ttitle="{i18n>commonItemShipped}"\n\t\t\t\t\t\ttext="{= ${ShippedDate} ?\n\t\t\t\t\t\t\t\t${\n\t\t\t\t\t\t\t\t\tpath: \'ShippedDate\',\n\t\t\t\t\t\t\t\t\ttype: \'DateType\',\n\t\t\t\t\t\t\t\t\tformatOptions: { style: \'medium\' }\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t:${i18n>commonItemNotYetShipped} }"/></l:VerticalLayout><l:VerticalLayout><Label text="{i18n>priceText}"/><ObjectNumber\n\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\tparts: [\n\t\t\t\t\t\t\t\t{path:\'detailView>/totalOrderAmount\'},\n\t\t\t\t\t\t\t\t{path:\'detailView>/currency\'}\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\ttype: \'sap.ui.model.type.Currency\',\n\t\t\t\t\t\t\tformatOptions: {\n\t\t\t\t\t\t\t\tshowMeasure: false\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tunit="{detailView>/currency}"/></l:VerticalLayout></l:HorizontalLayout></semantic:headerContent><semantic:content><l:VerticalLayout><IconTabBar\n\t\t\t\t\tid="iconTabBar"\n\t\t\t\t\theaderBackgroundDesign="Transparent"\n\t\t\t\t\tselect=".onTabSelect"\n\t\t\t\t\tselectedKey="{detailView>/selectedTab}"><items><IconTabFilter\n\t\t\t\t\t\t\tid="iconTabFilterShipping"\n\t\t\t\t\t\t\ticon="sap-icon://shipping-status"\n\t\t\t\t\t\t\ttooltip="{i18n>detailIconTabBarShipping}"\n\t\t\t\t\t\t\tkey="shipping"></IconTabFilter><IconTabFilter\n\t\t\t\t\t\t\tid="iconTabFilterProcessor"\n\t\t\t\t\t\t\ticon="sap-icon://employee"\n\t\t\t\t\t\t\ttooltip="{i18n>detailIconTabBarProcessor}"\n\t\t\t\t\t\t\tkey="processor"></IconTabFilter></items></IconTabBar><Table\n\t\t\t\t\tid="lineItemsList"\n\t\t\t\t\tclass="sapUiSmallMarginTop"\n\t\t\t\t\twidth="auto"\n\t\t\t\t\titems="{Order_Details}"\n\t\t\t\t\tupdateFinished=".onListUpdateFinished"\n\t\t\t\t\tnoDataText="{i18n>detailLineItemTableNoDataText}"\n\t\t\t\t\tbusyIndicatorDelay="{detailView>/lineItemTableDelay}"><headerToolbar><Toolbar id="lineItemsToolbar"><Title\n\t\t\t\t\t\t\t\tid="lineItemsHeader"\n\t\t\t\t\t\t\t\ttext="{detailView>/lineItemListTitle}"/></Toolbar></headerToolbar><columns><Column><Text text="{i18n>detailLineItemTableIDColumn}"/></Column><Column\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\thAlign="End"><Text text="{i18n>detailLineItemTableUnitPriceColumn}"/></Column><Column\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\thAlign="End"><Text text="{i18n>detailLineItemTableUnitQuantityColumn}"/></Column><Column\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\thAlign="End"><Text text="{i18n>detailLineItemTableTotalColumn}"/></Column></columns><items><ColumnListItem><cells><ObjectIdentifier\n\t\t\t\t\t\t\t\t\ttitle="{Product/ProductName}"\n\t\t\t\t\t\t\t\t\ttext="{ProductID}"/><ObjectNumber\n\t\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\t\tpath: \'UnitPrice\',\n\t\t\t\t\t\t\t\t\t\tformatter: \'.formatter.currencyValue\'\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tunit="{detailView>/currency}"/><ObjectAttribute\n\t\t\t\t\t\t\t\t\ttext="{Quantity}"/><ObjectNumber\n\t\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\t\tparts:[\n\t\t\t\t\t\t\t\t\t\t\t{path:\'Quantity\'},\n\t\t\t\t\t\t\t\t\t\t\t{path:\'UnitPrice\'},\n\t\t\t\t\t\t\t\t\t\t\t{path:\'detailView>/currency\'}\n\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\tformatter: \'.formatter.calculateItemTotal\'\n\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\tunit="{detailView>/currency}"/></cells></ColumnListItem></items></Table></l:VerticalLayout></semantic:content><semantic:sendEmailAction><semantic:SendEmailAction\n\t\t\t\tid="shareEmail"\n\t\t\t\tpress=".onSendEmailPress"/></semantic:sendEmailAction><semantic:closeAction><semantic:CloseAction\n\t\t\t\tid="closeColumn"\n\t\t\t\tpress=".onCloseDetailPress"/></semantic:closeAction><semantic:fullScreenAction><semantic:FullScreenAction\n\t\t\t\tid="enterFullScreen"\n\t\t\t\tvisible="{= !${device>/system/phone} &amp;&amp; !${appView>/actionButtonsInfo/midColumn/fullScreen}}"\n\t\t\t\tpress="toggleFullScreen"/></semantic:fullScreenAction><semantic:exitFullScreenAction><semantic:ExitFullScreenAction\n\t\t\t\tid="exitFullScreen"\n\t\t\t\tvisible="{= !${device>/system/phone} &amp;&amp; ${appView>/actionButtonsInfo/midColumn/fullScreen}}"\n\t\t\t\tpress="toggleFullScreen"/></semantic:exitFullScreenAction></semantic:SemanticPage></mvc:View>',
	"sap/ui/demo/orderbrowser/view/DetailObjectNotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.orderbrowser.controller.DetailObjectNotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><Page\n\t\tid="page"\n\t\ttitle="{i18n>detailTitle}"\n\t\tshowNavButton="{=\n\t\t\t${device>/system/phone} ||\n\t\t\t${device>/system/tablet} &amp;&amp;\n\t\t\t${device>/orientation/portrait}\n\t\t}"\n\t\tnavButtonPress=".onNavBack"><IllustratedMessage\n\t\t\ttitle="{i18n>noObjectFoundText}"\n\t\t\tillustrationType="sapIllus-SearchEarth"\n\t\t\tenableDefaultTitleAndDescription="false"/></Page></mvc:View>',
	"sap/ui/demo/orderbrowser/view/Master.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.orderbrowser.controller.Master"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:core="sap.ui.core"\n\txmlns:semantic="sap.f.semantic"><semantic:SemanticPage id="page"\n\t\tcore:require="{\n\t\t\tformatMessage: \'sap/base/strings/formatMessage\',\n\t\t\tDateType: \'sap/ui/model/type/Date\'\n\t\t}"><semantic:titleHeading><Title\n\t\t\t\tid="masterHeaderTitle"\n\t\t\t\ttext="{\n\t\t\t\t\tparts: [\n\t\t\t\t\t\t\'i18n>masterTitleCount\',\n\t\t\t\t\t\t\'masterView>/titleCount\'\n\t\t\t\t\t],\n\t\t\t\t\tformatter: \'formatMessage\'\n\t\t\t}"/></semantic:titleHeading><semantic:content><List\n\t\t\t\tid="list"\n\t\t\t\twidth="auto"\n\t\t\t\tclass="sapFDynamicPageAlignContent"\n\t\t\t\titems="{\n\t\t\t\t\tpath: \'/Orders\',\n\t\t\t\t\tparameters: {expand: \'Customer\'},\n\t\t\t\t\tsorter: {\n\t\t\t\t\t\tpath: \'OrderID\',\n\t\t\t\t\t\tdescending: true\n\t\t\t\t\t},\n\t\t\t\t\tgroupHeaderFactory: \'.createGroupHeader\'\n\t\t\t\t}"\n\t\t\t\tbusyIndicatorDelay="{masterView>/delay}"\n\t\t\t\tmode="{= ${device>/system/phone} ? \'None\' : \'SingleSelectMaster\'}"\n\t\t\t\tgrowing="true"\n\t\t\t\tgrowingScrollToLoad="true"\n\t\t\t\tupdateFinished=".onUpdateFinished"\n\t\t\t\tselectionChange=".onSelectionChange"><noData><IllustratedMessage\n\t\t\t\t\t\ttitle="{masterView>/noDataText}"\n\t\t\t\t\t\tillustrationType="sapIllus-NoFilterResults"\n\t\t\t\t\t\tenableDefaultTitleAndDescription="false"/></noData><infoToolbar><Toolbar\n\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\tid="filterBar"\n\t\t\t\t\t\tvisible="{masterView>/isFilterBarVisible}"\n\t\t\t\t\t\tpress=".onOpenViewSettings"><Title\n\t\t\t\t\t\t\tid="filterBarLabel"\n\t\t\t\t\t\t\ttext="{masterView>/filterBarLabel}" /></Toolbar></infoToolbar><headerToolbar><OverflowToolbar><SearchField\n\t\t\t\t\t\t\tid="searchField"\n\t\t\t\t\t\t\tshowRefreshButton="true"\n\t\t\t\t\t\t\ttooltip="{i18n>masterSearchTooltip}"\n\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\tsearch=".onSearch"><layoutData><OverflowToolbarLayoutData\n\t\t\t\t\t\t\t\t\tminWidth="150px"\n\t\t\t\t\t\t\t\t\tmaxWidth="240px"\n\t\t\t\t\t\t\t\t\tshrinkable="true"\n\t\t\t\t\t\t\t\t\tpriority="NeverOverflow"/></layoutData></SearchField><ToolbarSpacer/><Button\n\t\t\t\t\t\t\tid="filterButton"\n\t\t\t\t\t\t\tpress=".onOpenViewSettings"\n\t\t\t\t\t\t\ticon="sap-icon://filter"\n\t\t\t\t\t\t\ttype="Transparent"/><Button\n\t\t\t\t\t\t\tid="groupButton"\n\t\t\t\t\t\t\tpress=".onOpenViewSettings"\n\t\t\t\t\t\t\ticon="sap-icon://group-2"\n\t\t\t\t\t\t\ttype="Transparent"/></OverflowToolbar></headerToolbar><items><ObjectListItem\n\t\t\t\t\t\ttype="{= ${device>/system/phone} ? \'Active\' : \'Inactive\'}"\n\t\t\t\t\t\tpress=".onSelectionChange"\n\t\t\t\t\t\ttitle="{\n\t\t\t\t\t\t\tparts: [\n\t\t\t\t\t\t\t\t\'i18n>commonItemTitle\',\n\t\t\t\t\t\t\t\t\'OrderID\'\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\tformatter: \'formatMessage\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\tpath: \'OrderDate\',\n\t\t\t\t\t\t\ttype: \'DateType\',\n\t\t\t\t\t\t\tformatOptions: { style: \'short\' }\n\t\t\t\t\t\t}"><firstStatus><ObjectStatus\n\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\tparts: [\n\t\t\t\t\t\t\t\t\t\t{path: \'RequiredDate\'},\n\t\t\t\t\t\t\t\t\t\t{path: \'ShippedDate\'},\n\t\t\t\t\t\t\t\t\t\t{path: \'OrderID\'}\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\tformatter:\'.formatter.deliveryState\'\n\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\ttext="{\n\t\t\t\t\t\t\t\t\tparts: [\n\t\t\t\t\t\t\t\t\t\t{path: \'RequiredDate\'},\n\t\t\t\t\t\t\t\t\t\t{path: \'ShippedDate\'},\n\t\t\t\t\t\t\t\t\t\t{path: \'OrderID\'}\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\tformatter:\'.formatter.deliveryText\'\n\t\t\t\t\t\t\t\t}"/></firstStatus><attributes><ObjectAttribute id="companyName" text="{Customer/CompanyName}" /><ObjectAttribute title="{i18n>commonItemShipped}"\n\t\t\t\t\t\t\t\ttext="{= ${ShippedDate}\n\t\t\t\t\t\t\t\t\t? ${ path: \'ShippedDate\',\n\t\t\t\t\t\t\t\t\t\t type: \'DateType\',\n\t\t\t\t\t\t\t\t\t\t formatOptions: { style: \'medium\' } }\n\t\t\t\t\t\t\t\t\t: ${i18n>commonItemNotYetShipped} }" /></attributes></ObjectListItem></items></List></semantic:content></semantic:SemanticPage></mvc:View>',
	"sap/ui/demo/orderbrowser/view/NotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.orderbrowser.controller.NotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><Page\n\t\tid="page"\n\t\ttitle="{i18n>notFoundTitle}"\n\t\tshowNavButton="true"\n\t\tnavButtonPress=".onNavBack"><IllustratedMessage\n\t\t\ttitle="{i18n>notFoundText}"\n\t\t\tillustrationType="sapIllus-PageNotFound"\n\t\t\tenableDefaultTitleAndDescription="false"/></Page></mvc:View>',
	"sap/ui/demo/orderbrowser/view/Processor.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.orderbrowser.controller.Detail"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:core="sap.ui.core"><VBox><f:SimpleForm id="SimpleFormProcessorInfo"\n\t\t\teditable="false"\n\t\t\tlayout="ResponsiveGridLayout"\n\t\t\ttitle="{i18n>detailProcessorTitle}"\n\t\t\tlabelSpanL="3"\n\t\t\tlabelSpanM="3"\n\t\t\temptySpanL="4"\n\t\t\temptySpanM="4"\n\t\t\tcolumnsL="2"\n\t\t\tcolumnsM="2"><f:content><core:Title text="{i18n>detailsProcessorTitle}"/><Label text="{i18n>detailName}" /><Text text="{Employee/FirstName} {Employee/LastName}" /><Label text="{i18n>detailProcessorEmployeeID}" /><Text text="{Employee/EmployeeID}" /><Label text="{i18n>detailProcessorJobTitle}" /><Text text="{Employee/Title}" /><Label text="{i18n>detailProcessorPhone}" /><Link text="{Employee/HomePhone}" press="_onHandleTelephonePress" /><core:Title text="{i18n>photoProcessorTitle}" /><Image src="{path:\'Employee/Photo\', formatter: \'.formatter.handleBinaryContent\'}" width="50%" height="50%" /></f:content></f:SimpleForm></VBox></mvc:View>',
	"sap/ui/demo/orderbrowser/view/Shipping.view.xml":'<mvc:View\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:f="sap.ui.layout.form"><VBox><f:SimpleForm id="SimpleFormShipAddress"\n\t\t\teditable="false"\n\t\t\tlayout="ResponsiveGridLayout"\n\t\t\ttitle="{i18n>detailShippingAddressTitle}"\n\t\t\tlabelSpanL="3"\n\t\t\tlabelSpanM="3"\n\t\t\temptySpanL="4"\n\t\t\temptySpanM="4"\n\t\t\tcolumnsL="1"\n\t\t\tcolumnsM="1" ><f:content><Label text="{i18n>detailName}" /><Text text="{ShipName}" /><Label text="{i18n>detailShippingStreet}" /><Text text="{ShipAddress}" /><Label text="{i18n>detailShippingZIPCodeCity}" /><Text text="{ShipPostalCode} {ShipCity}" /><Label text="{i18n>detailShippingRegion}" /><Text text="{ShipRegion}" /><Label text="{i18n>detailShippingCountry}" /><Text text="{ShipCountry}" /></f:content></f:SimpleForm></VBox></mvc:View>',
	"sap/ui/demo/orderbrowser/view/ViewSettingsDialog.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><ViewSettingsDialog\n\t\tid="viewSettingsDialog"\n\t\tconfirm=".onConfirmViewSettingsDialog"><filterItems><ViewSettingsFilterItem\n\t\t\t\tid="filterItems"\n\t\t\t\ttext="{i18n>filterName}"\n\t\t\t\tkey="Orders"\n\t\t\t\tmultiSelect="false"><items><ViewSettingsItem\n\t\t\t\t\t\tid="viewFilter1"\n\t\t\t\t\t\ttext="{i18n>masterFilterShipped}"\n\t\t\t\t\t\tkey="Shipped"/><ViewSettingsItem\n\t\t\t\t\t\tid="viewFilter2"\n\t\t\t\t\t\ttext="{i18n>masterFilterNotShipped}"\n\t\t\t\t\t\tkey="NotShipped"/></items></ViewSettingsFilterItem></filterItems><groupItems><ViewSettingsItem\n\t\t\t\ttext="{i18n>masterGroupCustomer}"\n\t\t\t\tkey="CompanyName"/><ViewSettingsItem\n\t\t\t\ttext="{i18n>masterGroupOrderPeriod}"\n\t\t\t\tkey="OrderDate"/><ViewSettingsItem\n\t\t\t\ttext="{i18n>masterGroupShippedPeriod}"\n\t\t\t\tkey="ShippedDate"/></groupItems></ViewSettingsDialog></core:FragmentDefinition>'
});
//# sourceMappingURL=Component-preload.js.map

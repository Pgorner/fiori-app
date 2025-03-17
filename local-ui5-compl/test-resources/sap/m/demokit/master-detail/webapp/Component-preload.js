//@ui5-bundle sap/ui/demo/masterdetail/Component-preload.js
sap.ui.predefine("sap/ui/demo/masterdetail/Component", [
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"./controller/ListSelector",
	"./controller/ErrorHandler"
], function (UIComponent, Device, models, ListSelector, ErrorHandler) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.masterdetail.Component", {

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
sap.ui.predefine("sap/ui/demo/masterdetail/controller/App.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.masterdetail.controller.App", {

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
sap.ui.predefine("sap/ui/demo/masterdetail/controller/BaseController", [
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("sap.ui.demo.masterdetail.controller.BaseController", {
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
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}

	});

});
sap.ui.predefine("sap/ui/demo/masterdetail/controller/Detail.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/library"
], function (BaseController, JSONModel, formatter, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("sap.ui.demo.masterdetail.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0,
				lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
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
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
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
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("Objects", {
					ObjectID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
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
				sObjectId = oObject.ObjectID,
				sObjectName = oObject.Name,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
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
sap.ui.predefine("sap/ui/demo/masterdetail/controller/DetailObjectNotFound.controller", [
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.masterdetail.controller.DetailObjectNotFound", {});
});
sap.ui.predefine("sap/ui/demo/masterdetail/controller/ErrorHandler", [
	"sap/ui/base/Object",
	"sap/m/MessageBox"
], function (UI5Object, MessageBox) {
	"use strict";

	return UI5Object.extend("sap.ui.demo.masterdetail.controller.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias sap.ui.demo.masterdetail.controller.ErrorHandler
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
sap.ui.predefine("sap/ui/demo/masterdetail/controller/ListSelector", [
	"sap/ui/base/Object",
	"sap/base/Log"
], function (BaseObject, Log) {
	"use strict";

	return BaseObject.extend("sap.ui.demo.masterdetail.controller.ListSelector", {

		/**
		 * Provides a convenience API for selecting list items. All the functions will wait until the initial load of the a List passed to the instance by the setBoundMasterList
		 * function.
		 * @class
		 * @public
		 * @alias sap.ui.demo.masterdetail.controller.ListSelector
		 */

		constructor : function () {
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
										list : oList
									});
								} else {
									// No items in the list
									fnReject({
										list : oList
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
		setBoundMasterList : function (oList) {
			this._oList = oList;
			this._fnResolveListHasBeenSet(oList);
		},

		/**
		 * Tries to select and scroll to a list item with a matching binding context. If there are no items matching the binding context or the ListMode is none,
		 * no selection/scrolling will happen
		 * @param {string} sBindingPath the binding path matching the binding path of a list item
		 * @public
		 */
		selectAListItem : function (sBindingPath) {

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
		clearMasterListSelection : function () {
			//use promise to make sure that 'this._oList' is available
			this._oWhenListHasBeenSet.then(function () {
				this._oList.removeSelections(true);
			}.bind(this));
		}
	});
});
sap.ui.predefine("sap/ui/demo/masterdetail/controller/Master.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"../model/formatter"
], function (BaseController, JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, formatter) {
	"use strict";

	return BaseController.extend("sap.ui.demo.masterdetail.controller.Master", {

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
				UnitNumber : function(oContext) {
					var iNumber = oContext.getProperty('UnitNumber'),
						key, text;
					if (iNumber <= 20) {
						key = "LE20";
						text = this.getResourceBundle().getText("masterGroup1Header1");
					} else {
						key = "GT20";
						text = this.getResourceBundle().getText("masterGroup1Header2");
					}
					return {
						key: key,
						text: text
					};
				}.bind(this)
			};

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
				this._oListFilterState.aSearch = [new Filter("Name", FilterOperator.Contains, sQuery)];
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
					name: "sap.ui.demo.masterdetail.view.ViewSettingsDialog",
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
		 * has been closed with 'OK'. In the case, the currently chosen filters, sorters or groupers
		 * are applied to the master list, which can also mean that they
		 * are removed from the master list, in case they are
		 * removed in the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @public
		 */
		onConfirmViewSettingsDialog : function (oEvent) {
			var aFilterItems = oEvent.getParameters().filterItems,
				aFilters = [],
				aCaptions = [];

			// update filter state:
			// combine the filter array and the filter string
			aFilterItems.forEach(function (oItem) {
				switch (oItem.getKey()) {
					case "Filter1" :
						aFilters.push(new Filter("UnitNumber", FilterOperator.LE, 100));
						break;
					case "Filter2" :
						aFilters.push(new Filter("UnitNumber", FilterOperator.GT, 100));
						break;
					default :
						break;
				}
				aCaptions.push(oItem.getText());
			});

			this._oListFilterState.aFilter = aFilters;
			this._updateFilterBar(aCaptions.join(", "));
			this._applyFilterSearch();
			this._applySortGroup(oEvent);
		},

		/**
		 * Apply the chosen sorter and grouper to the master list
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @private
		 */
		_applySortGroup: function (oEvent) {
			var mParams = oEvent.getParameters(),
				sPath,
				bDescending,
				aSorters = [];
			// apply sorter to binding
			// (grouping comes before sorting)
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				var vGroup = this._oGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
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

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack : function() {
			// eslint-disable-next-line sap-no-history-manipulation
			history.go(-1);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */


		_createViewModel : function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Name",
				groupBy: "None"
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
				objectId : oItem.getBindingContext().getProperty("ObjectID")
			}, bReplace);
		},

		/**
		 * Sets the item count on the master list header
		 * @param {int} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount : function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
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
sap.ui.predefine("sap/ui/demo/masterdetail/controller/NotFound.controller", [
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.masterdetail.controller.NotFound", {

		onInit: function () {
			this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
		},

		_onNotFoundDisplayed : function () {
			this.getModel("appView").setProperty("/layout", "OneColumn");
		}
	});
});
sap.ui.predefine("sap/ui/demo/masterdetail/localService/mockserver", [
	"sap/ui/core/util/MockServer",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function (MockServer, JSONModel, Log) {
	"use strict";

	var oMockServer,
		_sAppPath = "sap/ui/demo/masterdetail/",
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

					// compose an error response for each request
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
sap.ui.predefine("sap/ui/demo/masterdetail/model/formatter", [], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue : function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		}
	};
});
sap.ui.predefine("sap/ui/demo/masterdetail/model/models", [
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
	"sap/ui/demo/masterdetail/i18n/i18n.properties":'# This is the resource bundle for Master-Detail\n\n#XTIT: Application name\nappTitle=Master-Detail\n\n#YDES: Application description\nappDescription=Best-practice starting point for a master-detail app (standalone)\n\n#~~~ Master View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Master view title with placeholder for the number of items\nmasterTitleCount=<Objects> ({0})\n\n#XTOL: Tooltip for the search field\nmasterSearchTooltip=Enter an <Objects> name or a part of it.\n\n#XBLI: text for a list with no data\nmasterListNoDataText=No <ObjectsPlural> are currently available\n\n#XBLI: text for a list with no data with filter or search\nmasterListNoDataWithFilterOrSearchText=No matching <ObjectsPlural> found\n\n#XSEL: Option to sort the master list by Name\nmasterSort1=Sort By <Name>\n\n#XSEL: Option to sort the master list by UnitNumber\nmasterSort2=Sort By <UnitNumber>\n\n#XSEL: Option to filter the master list by UnitNumber\nmasterFilterName=<UnitNumber>\n\n#XSEL: Option to not filter the master list\nmasterFilterNone=none\n\n\n#XSEL: Option to filter the master list by UnitOfMeasure if the value is less than 100\nmasterFilter1=<100 <UnitOfMeasure>\n\n#XSEL: Option to filter the master list by UnitOfMeasure if the value is greater than 100\nmasterFilter2=>100 <UnitOfMeasure>\n\n#YMSG: Filter text that is displayed above the master list\nmasterFilterBarText=Filtered by {0}\n\n#XSEL: Option to not group the master list\nmasterGroupNone=(Not grouped)\n\n#XSEL: Option to group the master list by UnitNumber\nmasterGroup1=<UnitNumber> Group\n\n#XGRP: Group header UnitNumber\nmasterGroup1Header1=<UnitNumber> 20 or less\n\n#XGRP: Group header UnitNumber\nmasterGroup1Header2=<UnitNumber> higher than 20\n\n#~~~ Detail View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTOL: Icon Tab Bar Info\ndetailIconTabBarInfo=Info\n\n#XTOL: Icon Tab Bar Attachments\ndetailIconTabBarAttachments=Attachments\n\n#XTOL: Tooltip text for close column button\ncloseColumn=Close\n\n#XBLI: Text for the LineItems table with no data\ndetailLineItemTableNoDataText=No <LineItemsPlural>\n\n#XTIT: Title of the LineItems table\ndetailLineItemTableHeading=<LineItemsPlural>\n\n#XTIT: Title of the LineItems table\ndetailLineItemTableHeadingCount=<LineItemsPlural> ({0})\n\n#XGRP: Title for the Name column in the LineItems table\ndetailLineItemTableIDColumn=<FirstColumnName>\n\n#XGRP: Title for the UnitNumber column in the LineItems table\ndetailLineItemTableUnitNumberColumn=<LastColumnName>\n\n#XTIT: Send E-Mail subject\nshareSendEmailObjectSubject=<Email subject including object identifier PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0}\n\n#YMSG: Send E-Mail message\nshareSendEmailObjectMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0} (id: {1})\\r\\n{2}\n\n#XBUT: Text for the send e-mail button\nsendEmail=Send E-Mail\n\n#XTIT: Title text for the price\npriceTitle=Price\n\n#~~~ Not Found View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Not found view title\nnotFoundTitle=Not Found\n\n#YMSG: The Objects not found text is displayed when there is no Objects with this id\nnoObjectFoundText=This <Objects> is not available\n\n#YMSG: The not found text is displayed when there was an error loading the resource (404 error)\nnotFoundText=The requested resource was not found\n\n#~~~ Not Available View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Master view title\nnotAvailableViewTitle=<Objects>\n\n#~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~\n\n#YMSG: Error dialog description\nerrorText=Sorry, a technical error occurred! Please try again later.',
	"sap/ui/demo/masterdetail/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ui.demo.masterdetail","type":"application","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""],"fallbackLocale":""},"title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"resources":"resources.json","dataSources":{"mainService":{"uri":"/here/goes/your/serviceUrl/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://detail-view","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.masterdetail.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.f":{},"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.masterdetail.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}},"":{"dataSource":"mainService","preload":true}},"routing":{"config":{"routerClass":"sap.f.routing.Router","type":"View","viewType":"XML","path":"sap.ui.demo.masterdetail.view","controlId":"layout","controlAggregation":"beginColumnPages","bypassed":{"target":"notFound"},"async":true},"routes":[{"pattern":"","name":"master","target":"master"},{"pattern":"Objects/{objectId}","name":"object","target":["master","object"]}],"targets":{"master":{"name":"Master","level":1,"id":"master"},"object":{"name":"Detail","id":"detail","level":1,"controlAggregation":"midColumnPages"},"detailObjectNotFound":{"name":"DetailObjectNotFound","id":"detailObjectNotFound","controlAggregation":"midColumnPages"},"notFound":{"name":"NotFound","id":"notFound"}}}}}',
	"sap/ui/demo/masterdetail/view/App.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.masterdetail.controller.App"\n\tdisplayBlock="true"\n\theight="100%"\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:mvc="sap.ui.core.mvc"><App\n\t\tid="app"\n\t\tbusy="{appView>/busy}"\n\t\tbusyIndicatorDelay="{appView>/delay}"><f:FlexibleColumnLayout\n\t\t\tid="layout"\n\t\t\tlayout="{appView>/layout}"\n\t\t\tbackgroundDesign="Translucent"></f:FlexibleColumnLayout></App></mvc:View>',
	"sap/ui/demo/masterdetail/view/Detail.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.masterdetail.controller.Detail"\n\txmlns="sap.m"\n\txmlns:semantic="sap.f.semantic"\n\txmlns:mvc="sap.ui.core.mvc"><semantic:SemanticPage\n\t\tid="detailPage"\n\t\tbusy="{detailView>/busy}"\n\t\tbusyIndicatorDelay="{detailView>/delay}"><semantic:titleHeading><Title\n\t\t\t\ttext="{Name}"\n\t\t\t\tlevel="H2"/></semantic:titleHeading><semantic:headerContent><ObjectAttribute title="{i18n>priceTitle}"/><ObjectNumber\n\t\t\t\tid="objectHeaderNumber"\n\t\t\t\tnumber="{\n\t\t\t\t\tpath: \'UnitNumber\',\n\t\t\t\t\tformatter: \'.formatter.currencyValue\'\n\t\t\t\t}"\n\t\t\t\tunit="{UnitOfMeasure}"\n\t\t\t/></semantic:headerContent><semantic:content><Table\n\t\t\t\tid="lineItemsList"\n\t\t\t\twidth="auto"\n\t\t\t\titems="{LineItems}"\n\t\t\t\tupdateFinished=".onListUpdateFinished"\n\t\t\t\tnoDataText="{i18n>detailLineItemTableNoDataText}"\n\t\t\t\tbusyIndicatorDelay="{detailView>/lineItemTableDelay}"><headerToolbar><Toolbar><Title\n\t\t\t\t\t\t\tid="lineItemsTitle"\n\t\t\t\t\t\t\ttext="{detailView>/lineItemListTitle}"\n\t\t\t\t\t\t\ttitleStyle="H3"\n\t\t\t\t\t\t\tlevel="H3"/></Toolbar></headerToolbar><columns><Column><Text text="{i18n>detailLineItemTableIDColumn}"/></Column><Column\n\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\thAlign="End"><Text text="{i18n>detailLineItemTableUnitNumberColumn}"/></Column></columns><items><ColumnListItem><cells><ObjectIdentifier\n\t\t\t\t\t\t\t\ttitle="{Name}"\n\t\t\t\t\t\t\t\ttext="{LineItemID}"/><ObjectNumber\n\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\tpath: \'UnitNumber\',\n\t\t\t\t\t\t\t\t\tformatter: \'.formatter.currencyValue\'\n\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\tunit="{UnitOfMeasure}"/></cells></ColumnListItem></items></Table></semantic:content><semantic:sendEmailAction><semantic:SendEmailAction\n\t\t\t\tid="shareEmail"\n\t\t\t\tpress=".onSendEmailPress"/></semantic:sendEmailAction><semantic:closeAction><semantic:CloseAction\n\t\t\t\t\tid="closeColumn"\n\t\t\t\t\tpress=".onCloseDetailPress"/></semantic:closeAction><semantic:fullScreenAction><semantic:FullScreenAction\n\t\t\t\t\tid="enterFullScreen"\n\t\t\t\t\tvisible="{= !${device>/system/phone} &amp;&amp; !${appView>/actionButtonsInfo/midColumn/fullScreen}}"\n\t\t\t\t\tpress=".toggleFullScreen"/></semantic:fullScreenAction><semantic:exitFullScreenAction><semantic:ExitFullScreenAction\n\t\t\t\t\tid="exitFullScreen"\n\t\t\t\t\tvisible="{= !${device>/system/phone} &amp;&amp; ${appView>/actionButtonsInfo/midColumn/fullScreen}}"\n\t\t\t\t\tpress=".toggleFullScreen"/></semantic:exitFullScreenAction></semantic:SemanticPage></mvc:View>',
	"sap/ui/demo/masterdetail/view/DetailObjectNotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.masterdetail.controller.DetailObjectNotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><IllustratedMessage\n\t\tid="page"\n\t\ttitle="{i18n>detailTitle}"\n\t\tdescription="{i18n>noObjectFoundText}"\n\t\tillustrationType="sapIllus-PageNotFound"><additionalContent><Button text="Not Found Action" press=".onNavBack" /></additionalContent></IllustratedMessage></mvc:View>',
	"sap/ui/demo/masterdetail/view/Master.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.masterdetail.controller.Master"\n\txmlns="sap.m"\n\txmlns:semantic="sap.f.semantic"\n\txmlns:mvc="sap.ui.core.mvc"><semantic:SemanticPage\n\t\tid="masterPage"\n\t\tpreserveHeaderStateOnScroll="true"\n\t\ttoggleHeaderOnTitleClick="false"><semantic:titleHeading><Title\n\t\t\t\tid="masterPageTitle"\n\t\t\t\ttext="{masterView>/title}"\n\t\t\t\tlevel="H2"/></semantic:titleHeading><semantic:content><List\n\t\t\t\tid="list"\n\t\t\t\twidth="auto"\n\t\t\t\tclass="sapFDynamicPageAlignContent"\n\t\t\t\titems="{\n\t\t\t\t\tpath: \'/Objects\',\n\t\t\t\t\tsorter: {\n\t\t\t\t\t\tpath: \'Name\',\n\t\t\t\t\t\tdescending: false\n\t\t\t\t\t},\n\t\t\t\t\tgroupHeaderFactory: \'.createGroupHeader\'\n\t\t\t\t}"\n\t\t\t\tbusyIndicatorDelay="{masterView>/delay}"\n\t\t\t\tnoDataText="{masterView>/noDataText}"\n\t\t\t\tmode="{= ${device>/system/phone} ? \'None\' : \'SingleSelectMaster\'}"\n\t\t\t\tgrowing="true"\n\t\t\t\tgrowingScrollToLoad="true"\n\t\t\t\tupdateFinished=".onUpdateFinished"\n\t\t\t\tselectionChange=".onSelectionChange"><infoToolbar><Toolbar\n\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\tid="filterBar"\n\t\t\t\t\t\tvisible="{masterView>/isFilterBarVisible}"\n\t\t\t\t\t\tpress=".onOpenViewSettings"><Title\n\t\t\t\t\t\t\tid="filterBarLabel"\n\t\t\t\t\t\t\ttext="{masterView>/filterBarLabel}"\n\t\t\t\t\t\t\tlevel="H3"/></Toolbar></infoToolbar><headerToolbar><OverflowToolbar><SearchField\n\t\t\t\t\t\t\tid="searchField"\n\t\t\t\t\t\t\tshowRefreshButton="true"\n\t\t\t\t\t\t\ttooltip="{i18n>masterSearchTooltip}"\n\t\t\t\t\t\t\tsearch=".onSearch"\n\t\t\t\t\t\t\twidth="auto"><layoutData><OverflowToolbarLayoutData\n\t\t\t\t\t\t\t\t\tminWidth="150px"\n\t\t\t\t\t\t\t\t\tmaxWidth="240px"\n\t\t\t\t\t\t\t\t\tshrinkable="true"\n\t\t\t\t\t\t\t\t\tpriority="NeverOverflow"/></layoutData></SearchField><ToolbarSpacer/><Button\n\t\t\t\t\t\t\tid="sortButton"\n\t\t\t\t\t\t\tpress=".onOpenViewSettings"\n\t\t\t\t\t\t\ticon="sap-icon://sort"\n\t\t\t\t\t\t\ttype="Transparent"/><Button\n\t\t\t\t\t\t\tid="filterButton"\n\t\t\t\t\t\t\tpress=".onOpenViewSettings"\n\t\t\t\t\t\t\ticon="sap-icon://filter"\n\t\t\t\t\t\t\ttype="Transparent"/><Button\n\t\t\t\t\t\t\tid="groupButton"\n\t\t\t\t\t\t\tpress=".onOpenViewSettings"\n\t\t\t\t\t\t\ticon="sap-icon://group-2"\n\t\t\t\t\t\t\ttype="Transparent"/></OverflowToolbar></headerToolbar><items><ObjectListItem\n\t\t\t\t\t\ttype="Navigation"\n\t\t\t\t\t\tpress=".onSelectionChange"\n\t\t\t\t\t\ttitle="{Name}"\n\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\tpath: \'UnitNumber\',\n\t\t\t\t\t\t\tformatter: \'.formatter.currencyValue\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tnumberUnit="{UnitOfMeasure}"></ObjectListItem></items></List></semantic:content></semantic:SemanticPage></mvc:View>',
	"sap/ui/demo/masterdetail/view/NotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.masterdetail.controller.NotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><IllustratedMessage\n\t\tid="page"\n\t\ttitle="{i18n>notFoundTitle}"\n\t\tdescription="{i18n>notFoundText}"\n\t\tillustrationType="sapIllus-PageNotFound"><additionalContent><Button text="Not Found Action" press=".onNavBack" /></additionalContent></IllustratedMessage></mvc:View>',
	"sap/ui/demo/masterdetail/view/ViewSettingsDialog.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><ViewSettingsDialog\n\t\tid="viewSettingsDialog"\n\t\tconfirm=".onConfirmViewSettingsDialog"><sortItems><ViewSettingsItem\n\t\t\t\ttext="{i18n>masterSort1}"\n\t\t\t\tkey="Name"\n\t\t\t\tselected="true"/><ViewSettingsItem\n\t\t\t\ttext="{i18n>masterSort2}"\n\t\t\t\tkey="UnitNumber"/></sortItems><filterItems><ViewSettingsFilterItem\n\t\t\t\tid="filterItems"\n\t\t\t\ttext="{i18n>masterFilterName}"\n\t\t\t\tmultiSelect="false"><items><ViewSettingsItem\n\t\t\t\t\t\tid="viewFilter1"\n\t\t\t\t\t\ttext="{i18n>masterFilter1}"\n\t\t\t\t\t\tkey="Filter1"/><ViewSettingsItem\n\t\t\t\t\t\tid="viewFilter2"\n\t\t\t\t\t\ttext="{i18n>masterFilter2}"\n\t\t\t\t\t\tkey="Filter2"/></items></ViewSettingsFilterItem></filterItems><groupItems><ViewSettingsItem\n\t\t\t\ttext="{i18n>masterGroup1}"\n\t\t\t\tkey="UnitNumber"/></groupItems></ViewSettingsDialog></core:FragmentDefinition>'
});
//# sourceMappingURL=Component-preload.js.map

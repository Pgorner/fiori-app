//@ui5-bundle sap/ui/demoapps/rta/freestyle/Component-preload.js
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/Component", [
	"sap/ui/core/UIComponent",
	"./controller/Application",
	"sap/ui/model/odata/v2/ODataModel",
	"./localService/mockserver",
	"sap/ui/model/json/JSONModel",
	"./util/SmartLink",
	'sap/ui/fl/Utils'
], function(
	UIComponent,
	Application,
	ODataModel,
	mockserver,
	JSONModel,
	SmartLink,
	Utils
) {
	"use strict";

	return UIComponent.extend("sap.ui.demoapps.rta.freestyle.Component", {

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
			SmartLink.mockUShellServices();
			UIComponent.prototype.constructor.apply(this, arguments);
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			this._assignMainService();
			this._createODataModel();
			// add custom "Adapt UI" button if application is running as a standalone app
			this._adaptButtonConfiguration();

			// call the base component's init function and start the application
			UIComponent.prototype.init.apply(this, arguments);

			this.oApplicationController = new Application();
			this.oApplicationController.init(this);
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ApplicationControlled is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this.oApplicationController.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * Start the MockServer
		 * @private
		 */
		_startMockServer: function () {
			mockserver.init(this.getManifest());
		},

		/**
		 * Adapt the visibility of the "Adapt UI" button
		 * @private
		 */
		_adaptButtonConfiguration: function () {
			this.setModel(new JSONModel({
				showAdaptButton: !Utils.getUshellContainer()
			}), "app");
		},

		/**
		 * Read the mainService configuration from the app descriptor
		 * @private
		 */
		_assignMainService: function () {
			const oAppEntry = this.getManifest()["sap.app"];

			if (oAppEntry.dataSources.mainService) {
				this._oMainService = oAppEntry.dataSources.mainService;
			} else {
				this._oMainService = undefined;
			}
		},

		/**
		 * Create the ODataModel for the app
		 * @private
		 */
		_createODataModel: function () {
			if (this._oMainService.uri) {
				var oModel = new ODataModel(this._oMainService.uri, {
					"settings": {
						"metadataUrlParams": {
							"sap-documentation": "heading"
						}
					}
				});
				oModel.setDefaultBindingMode("TwoWay");
				this.setModel(oModel);
			}
		}
	});
});
// Provides control nw.epm.refapps.lib.reuse.control.RatingAndCount
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/control/RatingAndCount", [
	"sap/m/Label",
	"sap/m/Link",
	"sap/m/RatingIndicator",
	"sap/ui/core/Control",
	"./RatingAndCountRenderer"
], function(Label, Link, RatingIndicator, Control, RatingAndCountRenderer) {
	"use strict";

	/**
	 * Constructor for a new RatingAndCount control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Some class description goes here.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.132.1
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.demoapps.rta.freestyle.control.RatingAndCount
	 */
	var RatingAndCount = Control.extend("sap.ui.demoapps.rta.freestyle.control.RatingAndCount", {
		metadata: {
			interfaces: ["sap.ui.core.IFormContent"],
			properties: {
				/**
				 * maxRatingValue
				 */
				maxRatingValue: {
					type: "int",
					group: "Data",
					defaultValue: 5
				},

				/**
				 * value
				 */
				value: {
					type: "float",
					group: "Data",
					defaultValue: 0
				},

				/**
				 * enabled
				 */
				enabled: {
					type: "boolean",
					group: "Behavior",
					defaultValue: true
				},

				/**
				 * iconSize
				 */
				iconSize: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: "auto"
				},

				/**
				 * ratingCount
				 */
				ratingCount: {
					type: "float",
					group: "Data",
					defaultValue: 0
				},

				/**
				 * verticalAlignContent
				 */
				verticalAlignContent: {
					type: "boolean",
					group: "Behavior",
					defaultValue: false
				},

				/**
				 * verticalAdjustment
				 */
				verticalAdjustment: {
					type: "int",
					group: "Behavior",
					defaultValue: 0
				}

			},
			events: {
				/**
				 * Event is fired when the user clicks on the control.
				 */
				press: {}
			},
			aggregations: {
				/**
				 * Shows the number of ratings. This control is only used if a handler is assigned to the press event
				 */
				_ratingCountLink: {
					type: "sap.m.Link",
					multiple: false,
					visibility: "hidden"
				},
				/**
				 * Shows the number of ratings. This control is only used if on handler is assigned to the press event
				 */
				_ratingCountLabel: {
					type: "sap.m.Label",
					multiple: false,
					visibility: "hidden"
				},
				/**
				 * The rating indicator shows the average valuee of the existing ratings
				 */
				_ratingIndicator: {
					type: "sap.m.RatingIndicator",
					multiple: false,
					visibility: "hidden"
				}
			}
		},
		renderer: RatingAndCountRenderer
	});

	RatingAndCount.prototype.init = function() {
		// [km]
		// Make sure the CSS file is included for all themes

		// TODO: check if styles are loaded properly
		// if (sap.ui.getCore().getConfiguration().getTheme() !== "sap_belize") {
		// 	// Get RTL mode flag
		// 	var bRTL = sap.ui.getCore().getConfiguration().getRTL();
		// 	// Get resource name for library / reuse component CSS
		//  var sResourceName = "nw/epm/refapps/lib/reuse/themes/base/library" + (bRTL ? "RTL" : "") + ".css";
		// 	// Get library.css / libraryRTL.css URL
		// 	var sUrl = sap.ui.require.toUrl(sResourceName);
		// 	// Include stylesheet in HEAD of document, using URL and ID
		// 	includeStyleSheet(sUrl, "sap-ui-theme-" + "nw.epm.refapps.lib.reuse");
		// }

		this._oRating = new RatingIndicator(this.getId() + "-rating");
		this._oRating.setEnabled(false);
		this.setAggregation("_ratingIndicator", this._oRating, true);
		// The decision on whether the rating count is an sap.m.Link or an sap.m.Label
		// can only be made once we know if a press handler is provided
		this._oRatingCountLink = new Link(this.getId() + "-ratingCountLink");
		this.setAggregation("_ratingCountLink", this._oRatingCountLink, true);
		this._oRatingCountLabel = new Label(this.getId() + "-ratingCountLabel").addStyleClass('sapUiTinyMarginBegin');
		this._oRatingCountLabel.addStyleClass("noColonLabelInForm");
		this.setAggregation("_ratingCountLabel", this._oRatingCountLabel, true);
	};

	RatingAndCount.prototype.onclick = function() {
		if (this.getEnabled() === true) {
			this.firePress({
				source: this._oRatingCountLink
			});
		}
	};

	// Overwriting the setter method is done in order to hand down the values to the
	// inner control in this. The setter method is used by the binding to update the
	// controls value.
	RatingAndCount.prototype.setValue = function(fValue) {
		if (fValue === undefined || fValue === null) {
			fValue = "0";
		}
		fValue = parseFloat(fValue);
		this._oRating.setValue(fValue);
		return this.setProperty("value", fValue, true);
	};

	// Overwriting the setter method is done in order to hand down the values to the
	// inner control in this. The setter method is used by the binding to update the
	// controls value.
	RatingAndCount.prototype.setMaxRatingValue = function(sMaxRatingValue) {
		this._oRating.setMaxValue(sMaxRatingValue);
		return this.setProperty("maxRatingValue", sMaxRatingValue);
	};

	// Overwriting the setter method is done in order to hand down the values to the
	// inner control in this. The setter method is used by the binding to update the
	// controls value.
	RatingAndCount.prototype.setIconSize = function(sIconSize) {
		this._oRating.setIconSize(sIconSize);
		return this.setProperty("iconSize", sIconSize, true);
	};

	// Overwriting the setter method is done in order to hand down the values to the
	// inner control. The setter method is used by the binding to update the
	// controls value.
	// Note that in this case potentially two controls may be affected.
	RatingAndCount.prototype.setRatingCount = function(sRatingCount) {
		if (sRatingCount === null) {
			sRatingCount = 0;
		}

		this._oRatingCountLabel.setText("(" + sRatingCount + ")");
		this._oRatingCountLink.setText("(" + sRatingCount + ")");
		return this.setProperty("ratingCount", sRatingCount);
	};

	return RatingAndCount;
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/control/RatingAndCountRenderer", [],
	function() {
		"use strict";

		/**
		 * RatingAndCount renderer.
		 * @namespace
		 */
		var RatingAndCountRenderer = {
			apiVersion: 2
		};

		/**
		 * Renders the HTML for the given control, using the provided
		 * {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager}
		 *            oRm the RenderManager that can be used for writing to the render
		 *            output buffer
		 * @param {sap.ui.demoapps.rta.freestyle.control.RatingAndCount}
		 *            oControl an object representation of the control that should be
		 *            rendered
		 */
		RatingAndCountRenderer.render = function(oRm, oControl) {
			var oRatingCount = oControl.hasListeners("press")
				? oControl.getAggregation("_ratingCountLink")
				: oControl.getAggregation("_ratingCountLabel");

			// if (oControl.getVerticalAdjustment() && oControl.getVerticalAdjustment() !== 0) {
			//   oRm.style("-ms-transform", "translateY(" + oControl.getVerticalAdjustment() + "%)");
			//   oRm.style("-webkit-transform", "translateY(" + oControl.getVerticalAdjustment() + "%)");
			//   oRm.style("transform", "translateY(" + oControl.getVerticalAdjustment() + "%)");
			// }
			// if (oControl.getVerticalAlignContent()) {
			//   oRm.style("line-height", oControl.getIconSize());
			//   oRatingCount.addStyleClass("sapUiRtaTestDemoappControlRatingAndCountVAlign");
			// }

			oRm.openStart("div", oControl); // provides control ID and enables event handling
			oRm.class('sapUiDemoappsDemokitRtaFreestyleRatingAndCount');
			oRm.openEnd();
			oRm.renderControl(oControl.getAggregation("_ratingIndicator"));
			oRm.renderControl(oRatingCount);
			oRm.close("div");
		};
		return RatingAndCountRenderer;
	}
);
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/Application", [
	"sap/ui/base/Object",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"./NavigationManager",
	"./ODataMetadataLoader",
	"../model/Products"
], function(BaseObject, Device, JSONModel, NavigationManager, ODataMetadataLoader, Products) {
	"use strict";

	// This class serves as controller for the whole App. It is a singleton object which is initialized by the Component.
	// Since the Component exposes a reference to this singleton object all controllers have access to it and can use its
	// public methods. Note that this class possesses two helper classes: NavigationManager and ODataMetadataLoader. The
	// first one deals with all navigation topics. Therefore, all methods of this class dealing with navigation are
	// forwarded to that class. The second one is responsible for the process of metadata loading during startup of the app.

	// There is a third helper class sap.ui.demoapps.rta.freestyle.model.Products providing methods for explicit
	// OData calls. Access to this class is provided by method getODataHelper.

	// The controllers of the S2 and the S3 views register at this singelton as soon as they are initialized, such that this
	// class can call public methods of these controllers as necessary.
	// This class creates a json model which is attached to the component as named model appProperties. It is used to store
	// global app state. Note that the model can be accessed declaratively and programmatically by all views and classes
	// used by this App.
	return BaseObject.extend("sap.ui.demoapps.rta.freestyle.controller.Application", {

		// The properties of this class are initialized during startup and never changed afterwards:
		// _oMainView: the view hosting this App
		// _oApplicationProperties: the json model with name appProperties (see above)
		// _oNavigationManager, _oODataMetadaLoader, _oODataHelper: instances of the helper classes as described above
		// _oMasterController: the controller of the S2 view

		// --- Application startup

		init: function(oComponent) {
			this._oMainView = oComponent.getAggregation("rootControl");

			// Make device information available for declarative definitions
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			oComponent.setModel(oDeviceModel, "device");

			// Initialize the global model
			this._oApplicationProperties = new JSONModel({
				metaDataLoadState: 0, // 0 = App is loading metadata (of OData model),
				// 1 = metadata has been loaded successfully, -1 = loading of metadata has failed.
				// metaDataLoadState of 1 indicates that the oData service is available and therefore the app
				// can continue to be started.
				// The display of the master list (in method onDataReceived) and display of the selected item (in method
				// adaptToDetailSelection) use the metaDataLoadState via appProperties model.
				// metaDataLoadState determines when the footer buttons in S2_ProductMaster.xml are active.
				// When metaData can't be loaded, the user is prompted to retry and the metaDate read again (see
				// ODataMetadataLoader.js).
				isAppBusy: true, // busy state of the whole app
				isMultiSelect: false, // multi-select mode of the master list
				isListLoading: false, // is the app currently loading the master list
				listNoDataText: " ", // no data text of the master list (only relevant when list is empty)
				applicationController: this, // provide access of the application controller to every class that can
				// access the component
				productId: null, // id of the product currently displayed/edited product
				draftId: null, // id of the draft currently being edited
				preferredIds: [], // an array of ids that are prioritized to be displayed when the list has loaded again
				masterImmediateBusy: true, // should the master view set busy immediately or with usual delay
				detailImmediateBusy: true, // should the detail view set busy immediately or with usual delay
				detailInHistory: false, // is navigation to detail page put into the history (for phone only)
				isChartDisplay: false // have the Sales Data in the display been selected for display?
			});
			oComponent.setModel(this._oApplicationProperties, "appProperties");

			// Allow binding of master list to be changed with updates. During editing, this is stopped.
			var fnSetAutomaticUpdate = function(bSetAutomaticUpdate) {
				this._oMasterController.setAutomaticUpdate(true);
			};
			// Create OData helper for changes into backend
			this._oODataHelper = new Products(oComponent, this._oMainView, fnSetAutomaticUpdate.bind(this, true), fnSetAutomaticUpdate.bind(
				this, false));

			// Create and initialize navigation manager
			var oRouter = oComponent.getRouter();

			this._oNavigationManager = new NavigationManager(oRouter, this._oApplicationProperties, oComponent.getModel(
				"i18n").getResourceBundle());
			this._oNavigationManager.init(oComponent.getComponentData(), this._oMainView);

			// Create and initialize metadata loader
			this._oODataMetadataLoader = new ODataMetadataLoader(oComponent);
			this._oODataMetadataLoader.init(this._oNavigationManager);
		},

		// ---Registration of S2 and S3 controllers

		registerMaster: function(oMasterController) {
			// This method is called in onInit() of the S2-view
			this._oMasterController = oMasterController;
			this._oNavigationManager.registerMaster(oMasterController);
		},

		registerDisplay: function(oDisplayController) {
			// This method is called in onInit() of the S3_ProductDisplay view
			this._oNavigationManager.registerDisplay(oDisplayController);
		},

		registerEdit: function(oEditController) {
			// This method is called in onInit() of the S3_ProductEdit view
			this._oNavigationManager.registerEdit(oEditController);
		},

		registerDetailInfo: function(oDetailInfoController) {
			// Keep a reference to the controller where the Supplier Card is created
			this._oNavigationManager.registerDetailInfo(oDetailInfoController);
		},

		registerDetailChart: function(oDetailChartController) {
			// Keep a reference to the controller where the Chart Data is created
			this._oNavigationManager.registerDetailChart(oDetailChartController);
		},

		//--- Navigation methods

		displayProduct: function(sProductId, bFromList) {
			// display the product specified by sProductId
			// bFromList is true if this has been triggered by actively selecting this product in the master list
			this._oNavigationManager.displayProduct(sProductId, bFromList);
		},

		editProductDraft: function(sProductId, sDraftId, bFromList) {
			// edit the product draft specified by sProductId and sDraftId
			// bFromList is true if this has been triggered by actively selecting this product in the master list
			this._oNavigationManager.editProductDraft(sProductId, sDraftId, bFromList);
		},

		navToEmptyPage: function(sText, bResetUrl) {
			// This method navigates to the empty page in detail area.
			// sText is the text to be shown on the empty page
			// If bResetUrl is true, the url is reset to the root url of the app
			this._oNavigationManager.navToEmptyPage(sText, bResetUrl);
		},

		navToMaster: function(sId, aPreferredReplace) {
			// Navigate to master.
			// In the non-phone case sId and aPreferredReplace can be used to define an array of ids that preferably shown
			// next in the detail area. More precisely: The first of those items which is actually in the list will be shown
			// in the detail area. See method getPreferredSuccessors of S2_ProductMaster.controller to find out, how this
			// array is derived from sId and aPreferredReplace.
			this._oNavigationManager.navToMaster(sId, aPreferredReplace);
		},

		navBack: function(bPreferHistory, bFromDetailScreen) {
			// Perform a back navigation.
			// bPreferHistory indicates whether the back navigation should be done by a browser back, in case it is possible
			// bFromDetailScreen indicates whether the back navigation was triggered by the back button on the detail area
			this._oNavigationManager.navBack(bPreferHistory, bFromDetailScreen);
		},

		//--- Additional public methods

		whenMetadataLoaded: function(fnMetadataLoaded, fnNoMetadata) {
			// This method can be called when another action depends on the fact that the metadata have been loaded
			// successfully. More precisely the contract of this method is as follows:
			// - when the metadata have already been loaded successfully fnMetadataLoaded is executed immediately.
			// - In case the metadata have not yet been loaded successfully, it is once more tried to load the metadata.
			//   fnMetadataLoaded will be called when the metadata have been loaded succesfully, whereas fnNoMetadata will
			//   be called when the metadata loading has failed.
			// - When the method is called while the metadata are still loading, fnMetaDataLoaded and fnNoMetadata will override
			//   functions which have been provided by previous calls.
			this._oODataMetadataLoader.whenMetadataLoaded(fnMetadataLoaded, fnNoMetadata);
		},

		hideMasterInPortrait: function() {
			// This method is only needed in portrait mode on a tablet. In this case, it hides the master list.
			this._oMainView.getController().hideMaster();
		},

		getODataHelper: function() {
			// Returns the (singleton) helper for handling oData operations in this application
			return this._oODataHelper;
		},

		prepareForDelete: function(sProductId) {
			// Adjust the preferred Ids when an item has been selected for delete
			this._oMasterController.prepareResetOfList(sProductId, true);
		},

		destroySupplierCard: function() {
			// On change of selected item, destroy the Supplier Card if created for this prodcut.  We prevent
			// Supplier information for other products from always being read on selection. It should only be
			// read when requested by the user, so to improve performance
			this._oNavigationManager.destroySupplierCard();
		},

		destroyDetailChart: function() {
			// When a user has selected Sales Data for the product as a chart, the view that
			// was created will be destroyed and deleted when a new product is selected by the user.
			// This prevents automatic reads of the sales data, when it is expected that the user only
			// rarely will request this data.  This will improve performance in the app.
			this._oNavigationManager.destroyDetailChart();
		},

		setAppBusy: function() {
			// Set Busy Indicator at Root View
			this._oApplicationProperties.setProperty("/isAppBusy", true);
			this._oApplicationProperties.setProperty("/detailImmediateBusy", true);
		},

		resetAppBusy: function() {
			// Remove BusyIndicator from Root View
			this._oApplicationProperties.setProperty("/isAppBusy", false);
		}

	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/BaseController", [
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function(Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demoapps.rta.freestyle.controller.BaseController", {
		formatter: formatter, // make formatters available

		/**
		 * Convenience method for getting the view model by name (must not be called in onInit)
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {sap.ui.model.Model} the global Propery model
		 */
		getApplicationProperties: function() {
			return this.getOwnerComponent().getModel("appProperties");
		},

		/**
		 * Convenience method to get the controller of the whole app
		 * @returns {sap.ui.demoapps.rta.freestyle.controller.Application} the application controller
		 */
		getApplication: function() {
			return this.getApplicationProperties().getProperty("/applicationController");
		}
	});

});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/EmptyPage.controller", [
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	// Controller of the EmptyPage view
	return Controller.extend("sap.ui.demoapps.rta.freestyle.controller.EmptyPage", {
		onNavBack: function() {
			// Handler for the nav button of the page. It is attached declaratively. Note that it is only available on phone.
			var oApplicationProperties = this.getView().getModel("appProperties"),
				oApplicationController = oApplicationProperties.getProperty("/applicationController");
			oApplicationController.navBack(true);
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/NavigationManager", [
	"sap/ui/base/Object",
	"sap/ui/Device",
	"sap/ui/core/routing/History"
], function(BaseObject, Device, History) {
	"use strict";

	// 'Constants' for the route names used in this app
	var sDisplayRoute = "display",
		sEditRoute = "edit",
		sCreateRoute = "create",
		sMasterRoute = "master";

	// The main task of this method is initializing the router. However, it is first checked, whether the component data contain
	// information about cross-app navigation. If so, the startup parameters are translated into a route. This route
	// is set programmatically. Initialization of the router is postponed until this has been executed.
	function fnExtractStartupParametersAndInitializeRouter(oComponentData, oRouter) {
		if (oComponentData && oComponentData.startupParameters && Array.isArray(oComponentData.startupParameters.Product) &&
			oComponentData.startupParameters.Product.length > 0) {
			var sUrl = oRouter.getURL(sDisplayRoute, {
				productId: oComponentData.startupParameters.Product[0]
			});
			if (sUrl) {
				sap.ui.require(["sap/ui/core/routing/HashChanger"], function(HashChanger) {
					var oHashChanger = HashChanger.getInstance();
					oHashChanger.replaceHash(sUrl);
					oRouter.initialize();
				});
				return; // router is initialized (possibly asynchronously) via the function defined above
			}
		}
		oRouter.initialize();
	}

	// Helper class for class Application. It handles all navigation related issues in the app.
	// In particular, this class is the only one that interacts with the router.
	// This class has references to the controllers of S2 and S3 views and calls methods from them.
	// More precisely, on S2 methods adaptToDetailSelection, setAutomaticUpdate, getPreferredSuccessors, and findItem are used
	// On S3 controllers (display and edit) method productChanged is used in order to inform the view that it should adapt its
	// binding to the currently selected entity. Method unbind is used to inform the view that it is no longer in display.
	// Note that productChanged is preferably called before the navigation takes place whereas unbind is called after
	// navigation has finished. This is done in order to hide the data exchange from the user.
	// However, there are two exceptions from this:
	// - When the user enters a url manually, the navigation is done automatically via routing. Therefore, the controllers
	// can only be informed in the route handler
	// - During startup the S3 view is initialized with the first route matching it. Therefore, it cannot be updated before
	// the route is triggered.
	return BaseObject.extend("sap.ui.demoapps.rta.freestyle.controller.NavigationManager", {
		// The following properties of this class are set during initialization and not changed afterwards:
		// _oRouter: The router of this app
		// _oApplicationProperties: global state model of the app
		// _oResourceBundle: The resource bundle used by this app
		// _oMasterController, _oDisplayController, _oEditController: Controllers of S2 and S3 views.
		//    they are registered in the corresponding onInit-methods.
		// _bRouteMatched: Set to true on the first match of a route

		// The following attributes will change during the lifetime of this class:
		// _bProgrammaticNavigation: This attribute is used to distinguish between hash changes performed
		//    programmatically (via method _executeNavigation) and hash changes performed by the user (via browser interaction).
		// _bSubControllersMustBeAdapted: This attribute indicates whether the S3 controller must be updated in the route handler
		//  (see explanation above).
		// _oUnhandledRoute: If this object is truthy it describes a route that has matched and still needs to be handled. In
		// this case it contains:
		//    properties 'route' (the name of the route) and 'arguments' (the arguments from the route).
		//    Exception: For illegal routes the object is just empty.
		//    Note that this attribute is used to defer handling of routes manually entered by the user while the app is busy.

		// --- Startup

		constructor: function(oRouter, oApplicationProperties, oResourceBundle) {
			this._oRouter = oRouter;
			this._oApplicationProperties = oApplicationProperties;
			this._oResourceBundle = oResourceBundle;
		},

		init: function(oComponentData, oMainView) {
			//Allow root view to be sync and async in demos
			Promise.resolve().then(function(){
				var oController = oMainView.getController();
				if (!oController) {
					return oMainView.loaded().then(function(){
						return oMainView.getController();
					});
				} else {
					return oController;
				}
			}).then(function(oController){
				oController.attachAfterNavigate(this.afterNavigate, this);
			}.bind(this));



			this._bSubControllersMustBeAdapted = true;
			this._oRouter.getTargetHandler().setCloseDialogs(false);
			this._oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
			this._oRouter.attachBypassed(this.onBypassed, this);
			// Router is initialized at the end, since this triggers the instantiation of the views.
			// In onInit of the views we want to rely on the component being correctly initialized.
			fnExtractStartupParametersAndInitializeRouter(oComponentData, this._oRouter);
		},

		registerMaster: function(oMasterController) {
			// This method is called in onInit() of the S2-view
			this._oMasterController = oMasterController;
		},

		registerDisplay: function(oDisplayController) {
			// This method is called in onInit() of the S3Display-view
			this._oDisplayController = oDisplayController;
		},

		registerEdit: function(oEditController) {
			// This method is called in onInit() of the S3Edit-view
			this._oEditController = oEditController;
		},

		registerDetailInfo: function(oDetailInfoController) {
			// This method is used by onSelectionChange() of S2_ProductMaster controller
			this._oDetailInfoController = oDetailInfoController;
		},

		registerDetailChart: function(oDetailChartController) {
			// This method is used by onSelectionChange() of S2_ProductMaster controller
			this._oDetailChartController = oDetailChartController;
		},

		// - Navigation methods

		afterNavigate: function() {
			// This method is called after each navigation. It unbinds the S3-views which are currently not visible, so that they
			// do not load any data. Note that both S3 views may be invisible (on phone).
			var sDraftId = this._oApplicationProperties.getProperty("/draftId");
			if (!sDraftId && this._oEditController) {
				this._oEditController.unbind();
			}
			var sProductId = this._oApplicationProperties.getProperty("/productId");
			if ((sDraftId || !sProductId || sProductId === " ") && this._oDisplayController) {
				this._oDisplayController.unbind();
			}
		},

		onRoutePatternMatched: function(oEvent) {
			// This method is registered at the router. It will be called whenever the url-hash changes. Note that there may be
			// two reasons for this. The hash may be set by the browser (e.g. if the user follows a link leading to this App) or
			// by the router itself. The second case applies when the App calls a navigation method of the router itself.
			this._routeMatched({
				route: oEvent.getParameter("name"),
				arguments: oEvent.getParameter("arguments")
			});
		},

		_routeMatched: function(oUnhandledRoute) {
			this._bRouteMatched = true;
			this._oUnhandledRoute = oUnhandledRoute;
			this._routeHandler();
		},

		_routeHandler: function() {
			// This method checks whether there is an unhandled route which can currently be handled. If this is the case the
			// route is handled.
			if (!this._oUnhandledRoute) {
				return;
			}
			var iMetaDataLoadState = this._oApplicationProperties.getProperty("/metaDataLoadState");
			if (iMetaDataLoadState === -1) {
				// If metadata loading has failed, the route must have been entered manually. We cannot handle this here but
				// we can trigger a new attempt to read the metadata.
				this._oApplicationProperties.getProperty("/applicationController").whenMetadataLoaded();
				return;
			} else if (iMetaDataLoadState === 1) {
				var sRoute = this._oUnhandledRoute.route,
					oArguments = this._oUnhandledRoute.arguments,
					bEditRoute = sRoute === sEditRoute,
					bDraftRoute = bEditRoute || sRoute === sCreateRoute,
					sProductId = (sRoute === sDisplayRoute || bEditRoute) ? decodeURIComponent(oArguments.productId) : "",
					sDraftId = bDraftRoute ? oArguments.DraftUUID : "";
				this._oApplicationProperties.setProperty("/productId", sProductId);
				this._oApplicationProperties.setProperty("/draftId", sDraftId);
				this._oUnhandledRoute = null;
				if (!sRoute) {
					this._onBypassed();
					return;
				}
				if (sProductId || bDraftRoute) {
					var oCurrentController = bDraftRoute ? this._oEditController : this._oDisplayController;
					if (this._bSubControllersMustBeAdapted && oCurrentController) {
						oCurrentController.productChanged();
					}
					this._oMasterController.adaptToDetailSelection(!this._bProgrammaticNavigation);
				}
				if (!this._bProgrammaticNavigation) {
					this._oApplicationProperties.setProperty("/preferredIds", []);
				}
				this._oApplicationProperties.setProperty("/detailInHistory", Device.system.phone);
				this._bSubControllersMustBeAdapted = true;
				this._bProgrammaticNavigation = false;
			}
		},

		// Called for invalid url-hashes
		onBypassed: function() {
			this._routeMatched({});
		},

		_onBypassed: function() {
			this._oApplicationProperties.setProperty("/emptyText", this._oResourceBundle.getText("ymsg.pageNotFound"));
			this._oApplicationProperties.setProperty("/productId", " ");
			this._oApplicationProperties.setProperty("/draftId", null);
			this._oMasterController.adaptToDetailSelection(false);
			this._oApplicationProperties.setProperty("/preferredIds", []);
		},

		// --- Implementation of the public navigation methods exposed by the Application class

		navToEmptyPage: function(sText, bResetUrl) {
			// This method navigates to the empty page in detail area. Prerequisites for
			// calling this method are as for showProductDetailPage.
			// sText is the text to be shown on the empty page
			// bResetUrl defines whether the route should be set back to the master route
			this._oApplicationProperties.setProperty("/emptyText", sText);
			this._oApplicationProperties.setProperty("/draftId", null);
			this._oMasterController.setAutomaticUpdate(true);
			if (bResetUrl) {
				// Set back the route to the generic one
				this._executeNavigation(sMasterRoute, null, true);
			}
			this._oRouter.getTargets().display("empty");
			this._oApplicationProperties.setProperty("/preferredIds", []);
		},

		displayProduct: function(sProductId, bFromList) {
			// This method navigates to the display page for the specified product id.
			this._oApplicationProperties.setProperty("/productId", sProductId);
			this._oApplicationProperties.setProperty("/draftId", "");

			this._oMasterController.adaptToDetailSelection();
			this._oMasterController.setAutomaticUpdate(true);
			if (this._oDisplayController) {
				this._oDisplayController.productChanged();
			}
			this._executeNavigation(sDisplayRoute, {
				productId: encodeURIComponent(sProductId)
			}, !(bFromList && Device.system.phone)); // true: hash should not be stored in the history
		},

		editProductDraft: function(sProductId, sDraftId, bFromList) {
			this._oApplicationProperties.setProperty("/productId", sProductId);
			this._oApplicationProperties.setProperty("/draftId", sDraftId);
			this._oMasterController.adaptToDetailSelection();
			this._oMasterController.setAutomaticUpdate(false);
			var bAddToHistory = bFromList && Device.system.phone;
			this._oApplicationProperties.setProperty("/detailInHistory", bAddToHistory);
			if (this._oEditController) {
				this._oEditController.productChanged();
			}
			var oParams = {
				DraftUUID: sDraftId
			};
			if (sProductId) {
				oParams.productId = encodeURIComponent(sProductId);
			}
			// true: hash should not be stored in the history
			this._executeNavigation(sProductId ? sEditRoute : sCreateRoute, oParams, !bAddToHistory);
		},

		navToMaster: function(sId, aPreferredReplace) {
			// This method navigates to the master route. sPreferredId is an optional parameter that may contain the id of a
			// product that (on non-phone devices) is preferably shown (provided it is in the master list). Prerequisites for
			// calling this method are as for showProductDetailPage.
			this._executeNavigation(sMasterRoute, {}, true);
			this._oApplicationProperties.setProperty("/productId", null);
			this._oApplicationProperties.setProperty("/draftId", null);
			if (sId) {
				this._oApplicationProperties.setProperty("/preferredIds", this._oMasterController.getPreferredSuccessors(sId, aPreferredReplace));
			}
			this._oMasterController.setAutomaticUpdate(true);

		},

		// Handling of back functionality.
		// bPreferHistory: Information whether back should be realized via browser-history if browser history is available.
		//                 This should be true with the exception of those views which do not have an own url (like the
		//                 summary page in our example)
		// bFromDetailScreen: Information whether back is called from master or from detail screen. This is used to decide
		//                 where to go when history
		// cannot be used. When coming from a detail screen (only possible on phone) go to master, when coming from master,
		// go back to shell.
		navBack: async function(bPreferHistory, bFromDetailScreen) {
			this._oApplicationProperties.setProperty("/productId", null);
			this._oApplicationProperties.setProperty("/draftId", null);
			this._oApplicationProperties.setProperty("/preferredIds", []);
			var oCrossAppNavigator = await sap.ui.require("sap/ushell/Container").getServiceAsync("CrossApplicationNavigation");
			if (bPreferHistory) {
				var oHistory = History.getInstance(),
					sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
					return;
				}
			}
			if (bFromDetailScreen) {
				this._oRootView.getController().backMaster();
				this._oRouter.navTo("main", {}, true);
				return;
			}
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: "#"
				}
			});
		},

		metadataFailed: function(sErrorText) {
			this._oApplicationProperties.setProperty("/emptyText", sErrorText);
			if (!Device.system.phone || this._oApplicationProperties.getProperty("/productId") || this._oApplicationProperties.getProperty(
					"/draftId")) {
				this._oRouter.getTargets().display("empty");
			}
		},

		metadataSuccess: function() {
			this._routeHandler();
		},

		_executeNavigation: function(sRoute, oParameters, bReplace) {
			// This method wraps the navTo-method of the router. It is called for navigation performed programmatically.
			// Thus, we expect that the subcontrollers have already been informed. So _bSubControllersMustBeAdapted is
			// set to false which is evaluated in onRoutePatternMatched.
			// However, there is one exception: If the detail controller was not registered at this point in time, adapting
			// it had to be postponed.
			this._bProgrammaticNavigation = true;
			this._bSubControllersMustBeAdapted = !(sRoute === sDisplayRoute ? this._oDisplayController : this._oEditController);
			this._oRouter.navTo(sRoute, oParameters, bReplace);
		},

		destroySupplierCard: function() {
			// When a new item is selected, the supplier card is destroyed to prevent the supplier information
			// being read by default every time a new item is selected.
			if (this._oDetailInfoController) {
				this._oDetailInfoController.destroySupplierCard();
			}
		},

		destroyDetailChart: function() {
			// When a user has selected sales data for a product, but then switches back to the product display, it
			// is assumed that the user will usually not want to display the sales data for a different product.
			// Therefore the controller for the chart view is destroyed to prevent the unnecessary reading of this data.
			// Of course, if a user requests the sales data for a different product, it will be read but it is assumed
			// that it is more efficient only to read the sales data when the user requests to do so.
			// Exception: if the display detail is in sales display when a new product is selected, the controller is
			// not destroyed and the sales data for the different product is read and displayed immediately.
			if (this._oDetailChartController) {
				this._oDetailChartController.destroy();
				delete this._oDetailChartController;
			}
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/ODataMetadataLoader", [
	"sap/ui/base/Object",
	"sap/m/MessageBox",
	"../util/controls",
	"../util/messages"
], function(BaseObject, MessageBox, controls, messages) {
	"use strict";

	return BaseObject.extend("sap.ui.demoapps.rta.freestyle.controller.ODataMetadataLoader", {
		// The purpose of this class is to check that the app can connect to the oData Backend service.
		// When the metadata of an oData service has been loaded, the app startup can continue, assuming that
		// the backend connection is available.  If the connection is not available, the user can re request the
		// loading from the error message provided.
		// The search and refresh in the master list also make use of this class.

		constructor: function(oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oODataModel = oComponent.getModel();
			this._oApplicationProperties = oComponent.getModel("appProperties");
			this._oOnMetaData = {};
		},

		init: function(oNavigationManager) {
			this._oNavigationManager = oNavigationManager;
			this._oODataModel.attachMetadataLoaded(this.onMetadataLoaded, this);
			this._oODataModel.attachMetadataFailed(this.onMetadataFailed, this);
		},

		onMetadataLoaded: function() {
			// In normal scenarios this method is called at the end of the startup process. However, when the initial loading of
			// metadata fails, this method may be called later. It is registered in init().
			this._oApplicationProperties.setProperty("/metaDataLoadState", 1);
			this._oApplicationProperties.setProperty("/isListLoading", true);
			if (this._oOnMetaData.onSuccess) {
				this._oOnMetaData.onSuccess();
			}
			this._oNavigationManager.metadataSuccess();
			this._oOnMetaData = null;
		},

		// User gets an error message, with the details.  The user can rerequest the start
		// and a refresh of the load of the metadata is triggered.
		onMetadataFailed: function(oError) {
			this._oApplicationProperties.setProperty("/metaDataLoadState", -1);
			if (this._oOnMetaData.onFailure) {
				this._oOnMetaData.onFailure();
			}
			this._oOnMetaData = {};
			var sError = messages.getErrorContent(oError);
			this._oApplicationProperties.setProperty("/listNoDataText", sError);
			this._oNavigationManager.metadataFailed(sError);
			this._bMessageOpen = true;
			MessageBox.error(sError, {
				title: this._oResourceBundle.getText("xtit.error"),
				details: messages.getErrorDetails(oError),
				actions: [MessageBox.Action.RETRY, MessageBox.Action.CLOSE],
				onClose: function(sAction) {
					this._bMessageOpen = false;
					if (sAction === MessageBox.Action.RETRY) {
						this.whenMetadataLoaded();
					}
				}.bind(this),
				styleClass: controls.getContentDensityClass()
			});
		},

		whenMetadataLoaded: function(fnMetadataLoaded, fnNoMetadata) {
			if (this._bMessageOpen) {
				return;
			}
			// The metadata does not need to be loaded again. Execute the function immediately.
			if (this._oApplicationProperties.getProperty("/metaDataLoadState") === 1) {
				if (fnMetadataLoaded) {
					fnMetadataLoaded();
				}
				// The metadata has not been loaded. Refresh the oData and add the success/failure handlers to the
				// metadata events.
			} else {
				this._oOnMetaData.onSuccess = fnMetadataLoaded;
				this._oOnMetaData.onFailure = fnNoMetadata;
				this._oApplicationProperties.setProperty("/metaDataLoadState", 0);
				this._oODataModel.refreshMetadata();
			}
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/ProductDetail.controller", [
	"../util/controls",
	"../util/messages",
	"./BaseController",
	"./utilities",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/rta/api/startKeyUserAdaptation"
], function(
	controls,
	messages,
	BaseController,
	utilities,
	MessageToast,
	JSONModel,
	Fragment,
	startKeyUserAdaptation
) {
	"use strict";

	return BaseController.extend("sap.ui.demoapps.rta.freestyle.controller.ProductDetail", {
		onInit: function() {
			this.getApplication().registerDisplay(this);
			this._oViewModel = new JSONModel({
				dataLoaded: false,
				originalBusyDelay: this.getView().getBusyIndicatorDelay(),
				showsMessage: false
			});
			this.setModel(this._oViewModel, "displayView");
		},

		productChanged: function() {
			var sProductId = this.getApplicationProperties().getProperty("/productId"),
				sContextPath = this.getApplication().getODataHelper().getPathForDraft(sProductId, utilities.getNullUUID(), true);
			if (sContextPath !== this._sContextPath) {
				this._sContextPath = sContextPath;
				this._oBindingContext = null;
				this._bindView(sContextPath);
			} else {
				this.getApplication().resetAppBusy();
			}
		},

		// Bind the header and the items to the context path
		_bindView: function(sContextPath) {
			this._oViewModel.setProperty("/dataLoaded", false);
			var oView = this.getView(),
				fnOnElementBindingCompleted  = function(oEvent){
					this._oViewModel.setProperty("/dataLoaded", true);
				}.bind(this),
				fnOnElementBindingRequested = function(oEvent) {
					if (sContextPath !== this._sContextPath) {
						return;
					}
					var oApplicationProperties = this.getApplicationProperties();
					this.getApplication().resetAppBusy();
					//oApplicationProperties.setProperty("/isBusySaving", false);
					oApplicationProperties.setProperty("/detailImmediateBusy", false); // this property is only true for one turnaround
					this._oBindingContext = oEvent.getSource().getBoundContext();
					if (this._oBindingContext) {
						var oProduct = this._getProduct(),
							oAdminData = this._getAdminData();
						if (oAdminData && oAdminData.DraftIsCreatedByMe && this.getApplication().getODataHelper().isDraftIdValid(oAdminData
								.DraftUUID)) { // there exists a draft for that object
							var sDraftResumePath = this.getApplication().getODataHelper().getPathForDraft(oProduct.ProductForEdit,
								oAdminData.DraftUUID, false);
							if (utilities.isDraftClean(oAdminData)) {
								this._deleteDraftFromResume(sDraftResumePath, oAdminData.DraftUUID);
								return;
							}
							var oProductTextInOriginalLang = this._getTextData();
							this._oViewModel.setProperty("/resumeDraftQuestion", this.getResourceBundle().getText("ymsg.editDraft", [
								oProductTextInOriginalLang.Name,
								oAdminData.LastChangeDateTime
							]));
							if (!this._oResumeDraftDialog) {
								var fnResume = function() {
										var oApplication = this.getApplication();
										oApplication.editProductDraft(oProduct.ProductForEdit, oAdminData.DraftUUID);
										this._oResumeDraftDialog.close();
									}.bind(this),
									fnDiscard = function() {
										this._oResumeDraftDialog.close();
										this._deleteDraftFromResume(sDraftResumePath, oAdminData.DraftUUID, true);
									}.bind(this);
								Fragment.load({
									name: "sap.ui.demoapps.rta.freestyle.view.ResumeDraftDialog",
									controller : {
										onResume: fnResume,
										onDiscard: fnDiscard
									}
								}).then(function(oResumeDraftDialog) {
									this._oResumeDraftDialog = oResumeDraftDialog;
									controls.attachControlToView(oView, this._oResumeDraftDialog);
									this._oResumeDraftDialog.open();
								}.bind(this));
							} else {
								this._oResumeDraftDialog.open();
							}
						}
					} else {
						this.getApplication().navToEmptyPage(this.getResourceBundle().getText("ymsg.productNotAvailable"));
					}
				}.bind(this);
			oView.bindElement({
				path: sContextPath,
				events: {
					change: fnOnElementBindingCompleted,
					dataReceived: fnOnElementBindingRequested
				},
				parameters: this.getApplication().getODataHelper().getParametersForRead()
			});
		},

		_deleteDraftFromResume: function(sPath, sDraftUUID, bDirty) {
			this.getApplication().getODataHelper().deleteDraftFromResume(sPath, sDraftUUID, bDirty);
		},

		unbind: function() {
			this._sContextPath = null;
			this._oBindingContext = null;
			this.getView().unbindElement();
		},

		onImagePressed: function() {
			if (!this._oLargeImage) {
				Fragment.load({
					name: "sap.ui.demoapps.rta.freestyle.view.dialog.ProductImage",
					controller: {
						onImageOKPressed: function() {
							this._oLargeImage.close();
						}.bind(this),
						formatImageUrl: this.formatter.formatImageUrl
					}
				}).then(function(oLargeImage) {
					this._oLargeImage = oLargeImage;
					controls.attachControlToView(this.getView(), this._oLargeImage);
					this._oLargeImage.open();
				}.bind(this));
			} else {
				this._oLargeImage.open();
			}
		},

		onEdit: function() {
			MessageToast.show('Edit action');
		},

		onCopy: function() {
			MessageToast.show('Copy action');
		},

		onNavBack: function() {
			this.getApplication().navBack(true, false);
		},

		onDelete: function() {
			MessageToast.show('Delete action');
		},

		sendEmail: function() {
			var sProductId = this.getApplicationProperties().getProperty("/productId"),
				oProduct = this._getProduct(),
				oProductTextOriginalLanguage = oProduct ? this._oBindingContext.getObject("to_ProductTextInOriginalLang") : null,
				sProductName = oProductTextOriginalLanguage ? oProductTextOriginalLanguage.Name : sProductId,
				sProductDescription = oProductTextOriginalLanguage ? oProductTextOriginalLanguage.Description : "",
				oSupplier = this._oBindingContext.getObject("to_Supplier"),
				sSupplierName = oSupplier ? oSupplier.CompanyName : "";
			utilities.sendEmailForProduct(this.getResourceBundle(), sProductName, sProductId, sProductDescription, sSupplierName);
		},

		_getProduct: function() {
			return this._oBindingContext && this._oBindingContext.getObject();
		},

		_getAdminData: function() {
			return this._oBindingContext && this._oBindingContext.getObject("DraftAdministrativeData");
		},

		_getTextData: function() {
			return this._oBindingContext && this._oBindingContext.getObject("to_ProductTextInOriginalLang");
		},

		switchToAdaptionMode: function() {
			startKeyUserAdaptation({
				rootControl: this.getOwnerComponent()
			});
		},

		modifyFailed: function(aArgs) {
			this._oViewModel.setProperty("/showsMessage", true);
			messages.showErrorMessage(aArgs[0].response, this._oViewModel.setProperty.bind(this._oViewModel, "/showsMessage", false));
			this.getView().getElementBinding().refresh(true);
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/ProductEdit.controller", [
	"sap/base/Log",
	"./BaseController",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/ui/model/json/JSONModel",
	"../util/controls",
	"./utilities",
	"sap/m/MessageToast",
	"sap/ui/core/syncStyleClass",
	"sap/ui/core/Messaging",
	"sap/ui/thirdparty/jquery",
	"sap/m/library"
], function(
	Log,
	BaseController,
	MessagePopover,
	MessagePopoverItem,
	JSONModel,
	controls,
	utilities,
	MessageToast,
	syncStyleClass,
	Messaging,
	jQuery,
	library
) {
	"use strict";

	var DraftIndicatorState = library.DraftIndicatorState;

	return BaseController.extend("sap.ui.demoapps.rta.freestyle.controller.ProductEdit", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			var oApplication = this.getApplication();
			oApplication.registerEdit(this);
			this._oODataHelper = oApplication.getODataHelper();
			this._oViewModel = new JSONModel({
				dataLoaded: false,
				openItemsRequest: 0,
				subCategoriesAvailable: false
			});
			this.setModel(this._oViewModel, "editView");
			this._oSubCategory = this.byId("subcategory");
			this._oSubcategoryItemTemplate = this._oSubCategory && this.byId("subcategoryItem").clone();

			// Create Message Popover for Error Handling
			MessagePopover.setDefaultHandlers({
				asyncDescriptionHandler: function(oConfig) {
					jQuery.ajax({
						url: oConfig.item.getLongtextUrl()
					}).done(function(data) {
						oConfig.item.setDescription(data);
						oConfig.promise.resolve();
					});
				}
			});

			this._oMessagePopover = new MessagePopover({
				items: {
					path: "message>/",
					template: new MessagePopoverItem({
						longtextUrl: "{message>descriptionUrl}",
						type: "{message>type}",
						title: "{message>message}"
					})
				}
			});
			controls.attachControlToView(this.getView(), this._oMessagePopover);
			this.setModel(Messaging.getMessageModel(), "message");
		},

		productChanged: function() {

			var oApplicationProperties = this.getApplicationProperties(),
				sDraftId = oApplicationProperties.getProperty("/draftId");
			// if (sDraftId === utilities.getNullUUID()) {
			// 	this._notAvailable();
			// 	return;
			// }
			oApplicationProperties.setProperty("/draftIndicatorState", DraftIndicatorState.Clear);
			this._bIsInHistory = oApplicationProperties.getProperty("/detailInHistory");
			this._sProductId = oApplicationProperties.getProperty("/productId");
			this._sDraftId = sDraftId;
			// var sContextPath = this._oODataHelper.getPathForDraft(this._sProductId, this._sDraftId, false),
			// this._bindView(sContextPath);
			this._oViewModel.setProperty("/dataLoaded", true);
			var sTitleKey = this._sProductId ? "xtit.productEdit" : "xtit.productNew";
			this._oViewModel.setProperty("/title", this.getResourceBundle().getText(sTitleKey));
		},

		// Bind the header and the items to the context path
		_bindView: function(sContextPath) {
			// this._oViewModel.setProperty("/dataLoaded", false);
			var oView = this.getView();
			if (this._sContextPath !== sContextPath) {
				this._sContextPath = sContextPath;
				this._oBindingContext = null;
				oView.bindElement({
					path: sContextPath,
					events: {
						dataReceived: this.onDataLoaded.bind(this, sContextPath)
					},
					parameters: {
						expand: "DraftAdministrativeData,to_ProductCategory,to_Supplier,to_ProductTextInOriginalLang"
					}
				});
			}
		},

		onSave: function() {
			MessageToast.show('Save action');
		},

		onCancel: function(oEvent) {
			if (this._isInvalid()) {
				return;
			}
			if (this._bIsDraftDirty) {
				if (!this._oCancelPopover) {
					this._oCancelPopover = this.byId("cancelPopover");
					syncStyleClass(controls.getContentDensityClass(), this.getView(), this._oCancelPopover);
				}
				this._oCancelPopover.openBy(oEvent.getSource());
			} else {
				this._onDiscard();
			}
		},

		onDiscard: function() {
			this._oCancelPopover.close();
			this._onDiscard();
		},

		_onDiscard: function() {
			if (this._bIsInHistory) {
				this.onNavBack();
			}
			var oApplicationProperties = this.getApplicationProperties();
			var sProductId = oApplicationProperties.getProperty("/productId");
			this.getApplication().prepareForDelete(sProductId);
			this.getApplication().displayProduct('HT-1000');
			// this._oODataHelper.deleteDraftEntity(this._oBindingContext, this._bIsDraftDirty);
		},

		onMessageIndicator: function(oEvent) {
			this._oMessagePopover.toggle(oEvent.getSource());
		},

		onDataLoaded: function(sContextPath, oEvent) {
			if (sContextPath !== this._sContextPath || this._isInvalid()) {
				return;
			}
			//var oApplicationProperties = this.getApplicationProperties(),
			var iOpenRequest = this._oViewModel.getProperty("/openItemsRequest");
			if (iOpenRequest === 0) {
				this.getApplication().resetAppBusy();
			}
			this._oBindingContext = oEvent.getSource().getBoundContext();
			if (this._oBindingContext) {
				if (!this._oViewModel.getProperty("/dataLoaded")) {
					this._oViewModel.setProperty("/dataLoaded", true);
					var oAdminData = this._oBindingContext.getObject("DraftAdministrativeData");
					//Information that the user has changed something in the draft ("Dirty") is that the ChangedAt
					// timestamp is later than the CreatedAt timestamp.  Note that these are set to be the same timestamp
					// when created in the backend, so they really are identical and not just a few ms difference.
					this._bIsDraftDirty = !utilities.isDraftClean(oAdminData);
					// Sets Main Category as a filter on subcategory so that only relevant subcategories are shown
					// in ComboBox
					this._setCategoryFilter(this._oBindingContext.getProperty("to_ProductCategory/MainProductCategory") || "");
				}
			}
			// else {
			// 	this._notAvailable();
			// }
		},

		onItemsRequested: function() {
			var iOpenRequest = this._oViewModel.getProperty("/openItemsRequest") + 1;
			this._oViewModel.setProperty("/openItemsRequest", iOpenRequest);
		},

		onItemsReceived: function() {
			var iOpenRequest = this._oViewModel.getProperty("/openItemsRequest") - 1;
			this._oViewModel.setProperty("/openItemsRequest", iOpenRequest);
			if (iOpenRequest === 0 && this._oViewModel.getProperty("/dataLoaded")) {
				this.getApplication().resetAppBusy();
			}
		},

		_notAvailable: function() {
			this.getApplication().navToEmptyPage(this.getResourceBundle().getText("ymsg.draftNotAvailable"));
		},

		unbind: function() {
			this._sContextPath = null;
			this._oBindingContext = null;
			this.getView().unbindElement();
			this._oViewModel.setProperty("/openItemsRequest", 0);
		},

		onInputChange: function() {
			this._fieldChange();
		},

		onNumberChange: function(oEvent) {
			// If a number field is empty, an error occurs in the backend.
			// So this sets a missing number to "0".
			var oField = oEvent.getSource(),
				sNumber = oField.getValue();
			if (sNumber === "") {
				oField.setValue("0");
			}
			this._fieldChange();
		},

		onCategoryChange: function(oEvent) {
			// Category is not save with the Product.  It is unique accroding to the sub category and
			// can be found in the navigation property.
			var oCategory = oEvent.getSource();
			if (this._oSubCategory) {
				this._oSubCategory.setSelectedKey();
				this._setCategoryFilter(oCategory.getValue());
			}
		},

		onSubCategoryChange: function() {
			var oCategory = this.byId("category");
			if (oCategory && oCategory.getValue().trim() === "") {
				// Sub Category was selected from all the possible entries, so add appropriate main category
				var sMainCategory = this.getView().getBindingContext().getProperty("to_ProductCategory/MainProductCategory");
				// Add only via value because the category field is one way binding
				oCategory.setValue(sMainCategory);
			}
			this._fieldChange();
		},

		_fieldChange: function() {
			if (this._isInvalid()) {
				return;
			}
			this._bIsDraftDirty = true;
			Log.info("Event triggered for Field Change ", null, "nw.epm.refapps.products.manage.view.S3_ProductEdit.controller");
			this._oODataHelper.saveProductDraft();
		},

		_setCategoryFilter: function(sMainCatgId) {
			if (this._oSubCategory) {
				var sPath = sMainCatgId.trim() ? "/SEPMRA_I_ProductMainCategory('" + encodeURIComponent(sMainCatgId) + "')/to_Category" :
					"/SEPMRA_I_ProductCategory",
					oBindingInfo = {
						path: sPath,
						events: {
							dataRequested: this._oViewModel.setProperty.bind(this._oViewModel, "/subCategoriesAvailable", false),
							dataReceived: this._oViewModel.setProperty.bind(this._oViewModel, "/subCategoriesAvailable", true)
						},
						template: this._oSubcategoryItemTemplate
					};
				this._oSubCategory.bindItems(oBindingInfo);
			}
		},

		_isInvalid: function() {
			return !this._oODataHelper.isDraftIdValid(this._sDraftId);
		},

		onNavBack: function() {
			this.getApplication().navBack(true, false);
		},

		sendEmail: function() {
			var sProductId = this._oBindingContext.getProperty("ProductForEdit"),
				oProductNameInput = this.byId("productNameInput"),
				sProductName = oProductNameInput && oProductNameInput.getValue();
			utilities.sendEmailForProduct(this.getResourceBundle(), sProductName, sProductId);
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/ProductGeneralForm.controller", [
	"sap/m/Popover",
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	"sap/ui/core/Element",
	"sap/ui/core/Fragment",
	"../util/controls"
], function(
	Popover,
	JSONModel,
	BaseController,
	Element,
	Fragment,
	controls
) {
	"use strict";

	return BaseController.extend("sap.ui.demoapps.rta.freestyle.controller.ProductGeneralForm", {
		// User wants to open the business card of the product supplier
		onSupplierPressed: function(oEvent) {
			if (!this._oPopover || !Element.getElementById(this._oPopover.getId())) {
				this._initializeSupplierCard();
			}
			this._oPopover.openBy(oEvent.getSource());
		},

		_initializeSupplierCard: function() {
			var oCardModel = new JSONModel({
				open: true,
				delay:1000,
				loading: false
			});
			var oComponent = this.getOwnerComponent();
			oComponent.runAsOwner(function() {
				Fragment.load({
					id: this.getView().createId("companyQuickView"),
					name: "sap.ui.demoapps.rta.freestyle.view.SupplierCard",
					controller: {
						dataRequested: oCardModel.setProperty.bind(oCardModel, "/loading", true),
						change: oCardModel.setProperty.bind(oCardModel, "/loading", false)
					}
				}).then(function(oSupplierCard) {
					this._oSupplierCard = oSupplierCard;
					this._oPopover = new Popover({
						id: this.getView().createId("FormPopover"),
						showHeader: false,
						contentMinWidth: "250px",
						contentWidth: "20%",
						content: this._oSupplierCard,
						placement: "HorizontalPreferredRight",
						afterOpen: oCardModel.setProperty.bind(oCardModel, "/open", true),
						afterClose: function () {
							oCardModel.setProperty.bind(oCardModel, "/open", false);
						}
					});

					this._oPopover.removeStyleClass("sapUiPopupWithPadding");
					this._oPopover.addStyleClass("sapUiSizeCompact");
					this._oPopover.setModel(oCardModel, "supplierCard");
					controls.attachControlToView(this.getView(), this._oPopover);
				}.bind(this));
			}.bind(this));
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/ProductMaster.controller", [
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"../util/TableOperations",
	"./utilities",
	"./SubControllerForFGS",
	"../util/controls",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, Sorter, GroupHeaderListItem, Device, TableOperations, utilities,
	SubControllerForFGS, controls, MessageToast) {
	"use strict";

	var sInitialSort = "to_ProductTextInOriginalLang/Name";

	function fnGetRelevantIdFromContext(oContext) {
		return oContext.getProperty("Product") || oContext.getProperty("DraftUUID");
	}
	// updateMode is used in Edit to stop the master list being refreshed whenever a property that is in the master list
	// is changed in the edit screen.  Suspended is used when the list is still loading and edit has started.  Once the list
	// has been refreshed, further refreshes are prevented whilst the editing is taking place.
	return BaseController.extend("sap.ui.demoapps.rta.freestyle.controller.ProductMaster", {

		updateMode: {
			AUTO: 0,
			PREPARESUSPEND: 1,
			SUSPENDED: 2
		},
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function() {
			// Control state model
			this._oList = this.byId("list");
			this._oSearchField = this.byId("searchField");
			this._oApplicationProperties = this.getApplicationProperties();
			this._iAutomaticUpdateMode = this.updateMode.AUTO;
			this._oViewProperties = new JSONModel({
				itemCount: -1,
				isFilterBarVisible: false,
				filterBarLabel: "",
				markExists: false,
				swipeEnabled: false,
				originalBusyDelayList: this._oList.getBusyIndicatorDelay()
			});
			this.setModel(this._oViewProperties, "masterView");
			// Put down master list's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the master list is
			// taken care of by the master list itself.

			var oDefaultSorter = new Sorter(sInitialSort);

			this._oTableOperations = new TableOperations(this._oList, ["to_ProductTextInOriginalLang/Name", "ProductForEdit"], oDefaultSorter);
			var fnApplyTableOperations = this.applyTableOperations.bind(this);
			this.getApplication().registerMaster(this);
			this._oSubControllerForFGS = new SubControllerForFGS(this.getView(), this._oTableOperations, fnApplyTableOperations);
			this._iAdaptAfterUpdateMode = 0;

			// The default filter required to provide the correct products to show each user is defined and added to Table Operations
			// in the constructor of SubControllerForFGS.  To save an extra request to backend, this default filter is obtained from
			// table operations and added here to the list binding here.  In this context, the filters are applied as FilterType
			// Application, hence subsequent filtering in Table Operations needs to filter as Application Filter.
			var oFilter = this._oTableOperations.getFilterTable();
			this._oListItemTemplate = this.byId("objectListItem").clone();
			this._oList.bindAggregation("items", {
				path: "/SEPMRA_C_PD_Product",
				filters: oFilter,
				template: this._oListItemTemplate,
				suspended: false,
				groupHeaderFactory: this.createGroupHeader,
				parameters: {
					countMode: "Inline",
					expand: "to_ProductTextInOriginalLang,to_ProductCategory,DraftAdministrativeData,to_ProductStock,to_ProductStock/to_StockAvailability,to_Supplier",
					select: "Product,DraftUUID,Price,Currency,ProductCategory,Product,to_ProductTextInOriginalLang/Name,to_ProductCategory/ProductCategory,DraftAdministrativeData/InProcessByUser,DraftAdministrativeData/DraftIsCreatedByMe,DraftAdministrativeData/InProcessByUserDescription,DraftAdministrativeData/LastChangedByUser,DraftAdministrativeData/DraftUUID,DraftAdministrativeData/CreationDateTime,DraftAdministrativeData/LastChangeDateTime,ProductBaseUnit,IsActiveEntity,HasDraftEntity,to_ProductCategory/MainProductCategory,ProductPictureURL,to_ProductStock/Quantity,to_ProductStock/to_StockAvailability/StockAvailability_Text,to_Supplier/EmailAddress"
				},

				events: {
					dataRequested: this.onDataRequested.bind(this),
					dataReceived: this.onDataReceived.bind(this)
				}

			});

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onDataRequested: function() {
			// Event handler called when retrieving data for the the master list starts. It is attached declaratively.
			// Resets the displayed content of the search field to the search term that is actually used.
			// There may be a difference, as the user might have changed the content but not triggered the search.
			this._oSearchField.setValue(this._sCurrentSearchTerm);
			this._oApplicationProperties.setProperty("/isListLoading", true);
		},

		onDataReceived: function(oEvent) {
			if (this._oApplicationProperties.getProperty("/metaDataLoadState") < 1) {
				return;
			}
			if (this._iAutomaticUpdateMode === this.updateMode.PREPARESUSPEND) {
				this._getListBinding().suspend();
				this._iAutomaticUpdateMode = this.updateMode.SUSPENDED;
			}
			this._oApplicationProperties.setProperty("/isListLoading", false);
			this._oApplicationProperties.setProperty("/masterImmediateBusy", false);
			var iCount = this._getListBinding().getLength();

			this._oViewProperties.setProperty("/itemCount", iCount);
			if (iCount === 0) {
				var sNoDataId = ((this._oTableOperations.getSearchTerm() || this._oTableOperations.getFilterTable()) ? "ymsg.noDataAfterSearch" :
					"ymsg.noData");
				this._oApplicationProperties.setProperty("/listNoDataText", this.getResourceBundle().getText(sNoDataId));
			}
			if (this._isListInMultiSelectMode()) {
				this._iMarkedCount = this._oList.getSelectedContexts(true).length;
				this._oViewProperties.setProperty("/markExists", this._iMarkedCount > 0);
			}
			// If not on the phone, make sure that a PO is selected (if possible)
			this.findItem();
			if (this._iAdaptAfterUpdateMode) {
				this._selectCurrentItem();
			}
		},

		findItem: function() {
			// This method has four tasks:
			// - Check whether it is necessary to identify a new list item to be displayed in the detail area (if not return immediately)
			// - Determine the required list item
			// - Execute the navigation that displays the identified list item (or execute the navigation to the EmptyPage if no list item could be identified)
			// - Reset state
			if (Device.system.phone || this._relevantId()) { // Task 1
				this._selectCurrentItem();
				this.getApplication().resetAppBusy();
				return;
			}
			// Task 2
			var aItems = this._oList.getItems();
			if (aItems.length > 0) {
				var oItemToSelect = null,
					aPreferredIds = this._oApplicationProperties.getProperty("/preferredIds"),
					oODataHelper = this.getApplication().getODataHelper();
				for (var i = 0; !oItemToSelect && i < aPreferredIds.length; i++) {
					var sId = aPreferredIds[i];
					oItemToSelect = oODataHelper.isDraftIdValid(sId) && this._getListItemForId(sId);
				}
				oItemToSelect = oItemToSelect || this._getFirstRealItem();
				this._navToListItem(oItemToSelect); // Task 3
			} else {
				this.getApplication().navToEmptyPage(this._oApplicationProperties.getProperty("/listNoDataText"), true); // Task 3
			}
		},

		adaptToDetailSelection: function(bScrollTo) {
			// adapt the state of the master list to the object displayed in the detail area
			// This contains two aspects:
			// - set the corresponding list item as selected
			// - scroll to the corresponding list item (only if bScrollTo is true)
			this._iAdaptAfterUpdateMode = bScrollTo ? 1 : 2;
			if (this._oApplicationProperties.getProperty("/metaDataLoadState") === 1 && !this._oApplicationProperties.getProperty(
					"/isListLoading")) {
				this._selectCurrentItem();
			}
		},

		_selectCurrentItem: function() {
			// this method has the same specification as adaptToDetailSelection. However, it must not be called
			// while the list is still loading.
			var bScrollTo = this._iAdaptAfterUpdateMode === 1;
			this._iAdaptAfterUpdateMode = 0;
			if (Device.system.phone || this._isListInMultiSelectMode()) {
				return;
			}
			var sId = this._relevantId(),
				oItemToSelect = sId && this._getListItemForId(sId);
			this._setItemSelected(oItemToSelect);
			if (bScrollTo && oItemToSelect) {
				this._scrollToListItem(oItemToSelect);
			}
		},

		_getListBinding: function() {
			return this._oList.getBinding("items");
		},

		_isListInMultiSelectMode: function() {
			// helper method to check if the current list is currently in the MultiSelect mode
			return this._oApplicationProperties.getProperty("/isMultiSelect");
		},

		applyTableOperations: function(fnAfterUpdate) {
			// This method is called when a new backend search has to be triggered, due to changed 'search settings'.
			// More precisely the method is called:
			// - when the user presses Sort, Filter, or Group button (therefore, it is passed as callback to SubControllerForFGS)
			// - when the user triggers a search after having changed the entry in the search field
			// The method uses attribute _oTableOperations to perform the data retrieval
			this._oTableOperations.applyTableOperations(true);
			if (fnAfterUpdate) {
				this._oList.attachEventOnce("updateFinished", fnAfterUpdate);
			}
		},

		// --- Methods dealing with new data retrieval triggered by the user. All event handlers are attached declaratively.

		onSearch: function(oEvent) {
			// Event handler for the search field in the master list.
			// Note that this handler listens to the search button and to the refresh button in the search field
			var oSearchField = oEvent.getSource(),
				sCurrentSearchFieldContent = oSearchField.getValue(),
				// If the user has pressed 'Refresh' the last search should be repeated
				sNewSearchContent = oEvent.getParameter("refreshButtonPressed") ? this._sCurrentSearchTerm : sCurrentSearchFieldContent;
			this._explicitRefresh(sNewSearchContent);
		},

		_explicitRefresh: function(sNewSearchContent, fnNoMetadata) {
			// This method is called when the user refreshes the list either via the search field or via the pull-to-refresh element
			// sNewSearchContent is the content of the search field to be applied.
			// Note: In case metadata could not be loaded yet or lost draft information could not be determined yet, it is first triggered
			// to retry this. If loading of the metadata fails (optional) fnNoMetadata will be executed.
			var fnMetadataLoaded = function() {
				if (sNewSearchContent === this._sCurrentSearchTerm) {
					this.listRefresh();
				} else {
					this._sCurrentSearchTerm = sNewSearchContent;
					this._oTableOperations.setSearchTerm(sNewSearchContent);
					this.applyTableOperations();
				}
			}.bind(this);
			this.getApplication().whenMetadataLoaded(fnMetadataLoaded, fnNoMetadata);
		},

		listRefresh: function() {
			var oBinding = this._getListBinding();
			if (this._iAutomaticUpdateMode === this.updateMode.SUSPENDED) {
				this._iAutomaticUpdateMode = this.updateMode.PREPARESUSPEND;
				oBinding.resume();
			}
			oBinding.refresh();
		},

		setAutomaticUpdate: function(bAutomaticUpdate) {
			if (bAutomaticUpdate === (this._iAutomaticUpdateMode === this.updateMode.AUTO)) { // nothing to do
				return;
			}
			var oBinding = this._getListBinding();
			if (bAutomaticUpdate) {
				if (this._iAutomaticUpdateMode === this.updateMode.SUSPENDED) {
					oBinding.resume();
				}
				this._iAutomaticUpdateMode = this.updateMode.AUTO;
			} else if (oBinding && !this._oApplicationProperties.getProperty("/isListLoading")) {
				oBinding.suspend();
				this._iAutomaticUpdateMode = this.updateMode.SUSPENDED;
			} else {
				this._iAutomaticUpdateMode = this.updateMode.PREPARESUSPEND;
			}
		},

		onRefresh: function(oEvent) {
			// Event handler for the pullToRefresh-element of the list.
			var oPullToRefresh = oEvent.getSource(),
				fnHidePullToRefresh = oPullToRefresh.hide.bind(oPullToRefresh);
			// Hide the pull to refresh when data has been loaded
			this._oList.attachEventOnce("updateFinished", fnHidePullToRefresh);
			// Refresh list from backend
			this._explicitRefresh(this._sCurrentSearchTerm, fnHidePullToRefresh);
		},

		onSort: function() {
			this._oSubControllerForFGS.openDialog("Sort", sInitialSort);
		},

		onFilter: function() {
			this._oSubControllerForFGS.openDialog("Filter");
		},

		onGroup: function() {
			this._oSubControllerForFGS.openDialog("Grouping");
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function(oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			var aSelectedItems, oBindingContext, oProduct, oDraftAdministrativeData, bLockedOnly = true;
			var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();

			var bMultiSelect = this._isListInMultiSelectMode();
			// If creaeted, destroy the supplier card fragment so that the supplier information is not always
			// read. Only when the user request the supplier card is it necessary to read it.
			this.getApplication().destroySupplierCard();
			if (!this._oApplicationProperties.getProperty("/isChartDisplay")) {
				// The chart was displayed for the previously selected product, but was not currently
				// shown in the details, so destroy this chart to prevent it being filled for the
				// newly selected product.  If the product display did show the chart, we leave
				// the chart and it will be filled (and shown) for the newly selected product.
				this.getApplication().destroyDetailChart();

			}
			if (bMultiSelect) { // in multi-select mode select mode selecting the list item inverts the current selection state
				if (oEvent.getParameter("selected")) { // the item turns into selected
					this._iMarkedCount++;
					if (!Device.system.phone) { // in this case the newly selected item should be displayed in the detail area,
						this._navToListItem(oListItem);
					}
				} else { // the item turns into unselected
					this._iMarkedCount--;
				}
				//In case only locked items have been selected, don't activate delete button
				aSelectedItems = this._oList.getSelectedItems();

				for (var i = 0; i < aSelectedItems.length; i++) {
					oBindingContext = aSelectedItems[i].getBindingContext();
					oProduct = oBindingContext.getObject();
					oDraftAdministrativeData = oBindingContext.getObject("DraftAdministrativeData");
					if (!oProduct.HasDraftEntity || oDraftAdministrativeData.InProcessByUser === "") {
						bLockedOnly = false;
						break;
					}

				}
				// At least one of the selected items is not locked, and at lease one item has been selected
				this._oViewProperties.setProperty("/markExists", (!bLockedOnly && this._iMarkedCount > 0));

			} else { // in single-select mode the user wants to navigate to the selected item
				this._navToListItem(oListItem);
				this.getApplication().hideMasterInPortrait();
			}
		},

		onMultiSelect: function() {
			if (this._isListInMultiSelectMode()) {
				this._iMarkedCount = 0;
				this._oViewProperties.setProperty("/markExists", false);
				this._setItemSelected();
			} else {
				this.adaptToDetailSelection();
			}
		},

		onAdd: function() {
			var oApplication = this.getApplication(),
				oODataHelper = oApplication.getODataHelper(),
				// sPreferredId = this._relevantId(),
				fnProductDraftCreated = function(oProductDraftData) {
					oApplication.editProductDraft("", oProductDraftData.DraftUUID, false);
					// this._oApplicationProperties.setProperty("/preferredIds", sPreferredId ? [sPreferredId] : []);
				};
			oODataHelper.createProductDraft(fnProductDraftCreated);
		},

		onSwipe: function(oEvent) {
			// Event handler for swipe in the list.
			// Its purpose is to deactivate swipe in case of multi select and in edit mode.
			if (this._isListInMultiSelectMode()) {
				oEvent.preventDefault();
			}
			var oListItem = oEvent.getParameter("listItem"),
				oBindingContext = oListItem.getBindingContext(),
				oApplication = this.getApplication(),
				oODataHelper = oApplication.getODataHelper(),
				sProductId = oBindingContext.getProperty("Product"),
				bDisabled = false;
			if (sProductId) {
				if (!oBindingContext.getProperty("IsActiveEntity")) {
					bDisabled = true;
				}
			} else {
				var sDraftId = oBindingContext.getProperty("DraftUUID");
				if (oODataHelper.isDraftIdValid(sDraftId)) {
					oEvent.preventDefault();
				}
			}
			this._oViewProperties.setProperty("/swipeEnabled", !bDisabled);
		},

		onSwipeDeleteItem: function() {
			// user has confirmed the deletion via swipe
			var oBindingContext = this._oList.getSwipedItem().getBindingContext(),
				oApplication = this.getApplication();
			var sProductId = this._oApplicationProperties.getProperty("/productId");
			this.prepareResetOfList(sProductId);
			oApplication.getODataHelper().deleteProduct(oBindingContext);
			this._oList.swipeOut();
		},

		onDelete: function() {
			MessageToast.show('Delete action');

			// //From the master list user has changed to multi select mode, selected items, then pressed delete
			// var oProduct, oBindingContext, oDraftAdministrativeData, oProductTextInOriginalLang,
			// 	aItemsLocked = [],
			// 	aSelectedItems = this._oList.getSelectedItems();
			//
			// this.aItemsToDelete = [];
			// this.aItemsUnsaved = [];
			//
			// if (aSelectedItems === undefined || aSelectedItems.length === 0) {
			// 	return;
			// } else {
			//
			// 	var oSorted = this._getDeletedRequested(aSelectedItems);
			// 	aItemsLocked = oSorted.locked;
			// 	this.aItemsUnsaved = oSorted.unsaved;
			// 	this.aItemsToDelete = oSorted.toDelete;
			//
			// 	// Determine the text of the short text message for the warning dialog
			// 	var iCanBeDeleted = this.aItemsToDelete.length,
			// 		iLocked = aItemsLocked.length,
			// 		iUnsaved = this.aItemsUnsaved.length;
			//
			// 	// For exactly one product to delete, reuse the messages from display controller.  If unsaved or locked are also
			// 	// selected, use the multi delete dialog so that this information may be made available to the user
			// 	if (iUnsaved === 1 && iCanBeDeleted === 0 && iLocked === 0 || iUnsaved === 0 && iCanBeDeleted === 1 && iLocked === 0) {
			//
			// 		oBindingContext = aSelectedItems[0].getBindingContext();
			// 		oProduct = oBindingContext.getObject();
			// 		oDraftAdministrativeData = oBindingContext.getObject("DraftAdministrativeData");
			// 		oProductTextInOriginalLang = oBindingContext.getObject("to_ProductTextInOriginalLang");
			// 		var sProductName = oProductTextInOriginalLang.Name;
			//
			// 		var bUnsavedChanges = oProduct.HasDraftEntity && oDraftAdministrativeData.InProcessByUser === "" && !oDraftAdministrativeData.DraftIsCreatedByMe;
			// 		var sUser = (bUnsavedChanges ? oDraftAdministrativeData.LastChangedByUser : "");
			// 		var fnAfterOpen = function(sAction) {
			// 			if (sAction === sap.m.MessageBox.Action.DELETE) {
			// 				this.getApplication().prepareForDelete(oProduct.ProductForEdit);
			// 				this.getApplication().getODataHelper().deleteProduct(oBindingContext);
			// 			}
			// 		}.bind(this);
			// 		utilities.showDeleteMessage(this.getResourceBundle(), sUser, sProductName, fnAfterOpen, bUnsavedChanges);
			// 	} else {
			// 		// More than one item has been selected to be deleted
			// 		var oDialogContent = this._determineDialogContent(aItemsLocked, this.aItemsUnsaved);
			// 		if (!this._oMultiDeleteDialog) {
			// 			this._oDialogProperties = new JSONModel({});
			// 			this._oMultiDeleteDialog = sap.ui.xmlfragment("sap.ui.demoapps.rta.freestyle.view.ProductMultiDeleteDialog", this);
			// 			controls.attachControlToView(this.getView(), this._oMultiDeleteDialog);
			// 		}
			//
			// 		this._iUnsaved = oDialogContent.unsaved;
			// 		this._oSingleList = new JSONModel(oDialogContent.singleList);
			//
			// 		// Lists of Items that are locked and/or have saved changes
			// 		this._oMultiDeleteDialog.setModel(this._oSingleList, "singleItems");
			//
			// 		this._oMultiDeleteDialog.setModel(this._oDialogProperties, "deleteDialog");
			// 		this._oDialogProperties.setProperty("/lockedText", oDialogContent.lockedText);
			// 		this._oDialogProperties.setProperty("/bLockedText", !(oDialogContent.lockedText === undefined));
			// 		this._oDialogProperties.setProperty("/deleteText", oDialogContent.deleteText);
			// 		this._oDialogProperties.setProperty("/bDeleteText", !(oDialogContent.deleteText === undefined));
			//
			// 		this._oDialogProperties.setProperty("/unsavedNumber", oDialogContent.unsavedNumber);
			// 		this._oDialogProperties.setProperty("/bUnsavedNumber", !(oDialogContent.unsavedNumber === undefined));
			//
			// 		this._oDialogProperties.setProperty("/unsavedText", oDialogContent.unsavedText);
			// 		this._oDialogProperties.setProperty("/bUnsavedText", !(oDialogContent.unsavedText === undefined));
			// 		this._oDialogProperties.setProperty("/deleteAnywayText", oDialogContent.deleteAnywayText);
			// 		this._oDialogProperties.setProperty("/bDeleteAnywayText", !(oDialogContent.deleteAnywayText === undefined));
			//
			// 		this._oDialogProperties.setProperty("/showCheckbox", oDialogContent.showCheckbox);
			// 		if (oDialogContent.showCheckbox) {
			// 			this._oDialogProperties.setProperty("/checkboxText", oDialogContent.checkboxText);
			// 		}
			// 		this._oDialogProperties.setProperty("/numberToDelete", oDialogContent.numberToDelete);
			// 		this._oDialogProperties.setProperty("/showDetails", false);
			//
			// 		this._oDialogProperties.setProperty("/details", oDialogContent.details);
			// 		this._oDialogProperties.setProperty("/deleteUnsavedChanges", oDialogContent.defaultUnsaved);
			//
			// 		this._oMultiDeleteDialog.open();
			// 	}
			// }
		},

		// User decides to delete items as determined by the ProductMultiDeleteDialog.
		onDeleteConfirm: function() {

			var bDeleteUnsavedChanges = this._oDialogProperties.getProperty("/deleteUnsavedChanges");
			var oODataHelper = this.getApplication().getODataHelper();
			if (this.aItemsToDelete.length > 0) {
				oODataHelper.deleteEntities(this.aItemsToDelete);
			}
			if (bDeleteUnsavedChanges && this.aItemsUnsaved.length > 0) {
				oODataHelper.deleteEntities(this.aItemsUnsaved);
			}

			this._oMultiDeleteDialog.close();
		},

		// Show details in the multi delete dialog, according to use case
		onShowDetails: function() {
			this._oDialogProperties.setProperty("/showDetails", true);
		},

		// User makes no action from the multi delete dialog
		onCancel: function() {
			this._oMultiDeleteDialog.close();
		},

		onNavBack: function() {
			this.getApplication().navBack(true, false);
		},

		onSelect: function(oEvent) {

		},

		_navToListItem: function(oListItem) {
			// This method triggers the navigation to the detail page with the specified list item oListItem
			var oCtx = oListItem.getBindingContext(),
				sProductId = oCtx.getProperty("Product"),
				bIsDisplay = oCtx.getProperty("IsActiveEntity"),
				oApplication = this.getApplication();
			if (bIsDisplay) {
				oApplication.displayProduct(sProductId, true);
			} else {
				var sDraftId = oCtx.getProperty("DraftUUID"),
					oODataHelper = oApplication.getODataHelper();
				if (oODataHelper.isDraftIdValid(sDraftId)) {
					oApplication.editProductDraft(sProductId, sDraftId, true);
				} else if (sProductId) {
					oODataHelper.whenProductIsClean(oApplication.displayProduct.bind(oApplication, sProductId, true));
				}
			}
		},

		_scrollToListItem: function(oListItem) {
			// Scroll the list to the given list item.
			var oTarget = (oListItem !== this._getFirstRealItem() && oListItem) || this._oList,
				oDomRef = oTarget.getDomRef();
			if (oDomRef) {
				oDomRef.scrollIntoView();
			}
		},

		_getFirstRealItem: function() {
			// Returns the first item of the list which is not a grouping item. Returns a faulty value if list is empty.
			var aItems = this._oList.getItems();
			for (var i = 0; i < aItems.length; i++) {
				if (!(aItems[i] instanceof GroupHeaderListItem)) {
					return aItems[i];
				}
			}
		},

		_setItemSelected: function(oItemToSelect) {
			// Set the specified list item to be selected, resp. remove all selections if the specififed item is faulty
			this._oList.removeSelections(true);
			if (oItemToSelect) {
				this._oList.setSelectedItem(oItemToSelect);
			}
		},

		_getListItemForId: function(sId) {
			// Return the list item for the specified product id or a faulty value if the list does not contain the product
			if (!sId || sId === "-") {
				return null;
			}
			var aItems = this._oList.getItems();
			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				if (!(oItem instanceof GroupHeaderListItem)) {
					var oContext = oItem.getBindingContext();
					if (oContext && fnGetRelevantIdFromContext(oContext) === sId) {
						return oItem;
					}
				}
			}
		},

		_relevantId: function() {
			return this._oApplicationProperties.getProperty("/productId") || this._oApplicationProperties.getProperty("/draftId");
		},

		getPreferredSuccessors: function(sId, aPreferredReplace) {
			var aPreferredIds = aPreferredReplace || [sId],
				bFound = false,
				aListItems = this._oList.getItems(),
				aTail = [];
			for (var i = 0; i < aListItems.length; i++) {
				var oItem = aListItems[i];
				if (!(oItem instanceof GroupHeaderListItem)) {
					var oCtx = oItem.getBindingContext(),
						sCurrentId = fnGetRelevantIdFromContext(oCtx);
					if (sId === sCurrentId) {
						bFound = true;
					} else {
						(bFound ? aPreferredIds : aTail).push(sCurrentId);
					}
				}
			}
			if (bFound) {
				aTail.reverse();
				aPreferredIds = aPreferredIds.concat(aTail);
			}
			return aPreferredIds;
		},

		// Prepare for the removal of some items from the list (due to deletion).
		// This is done by setting the IDs currently in the list to preferredIds. Thereby we
		// start with the item currently displayed. Then the IDs following this element are added
		// in their current order. Finally, we add those items listed in front of the current item in reverse
		// order.
		prepareResetOfList: function(sCurrentProductId) {
			var aListItems = this._oList.getItems(),
				bFound = false,
				aTail = [],
				aPreferredIds = [];
			for (var i = 0; i < aListItems.length; i++) {
				var oItem = aListItems[i],
					oCtx = oItem.getBindingContext(),
					sProductId = oCtx.getProperty("Product");
				bFound = bFound || sProductId === sCurrentProductId;
				(bFound ? aPreferredIds : aTail).push(sProductId);
			}
			aTail.reverse();
			aPreferredIds = aPreferredIds.concat(aTail);
			this._oApplicationProperties.setProperty("/preferredIds", aPreferredIds);
			this._oApplicationProperties.setProperty("/productId", null); // Reset the current ID (we only have preferences now)
		},

		/**
		 * Used to create GroupHeaders with non - capitalized caption.*These headers are inserted into the master list to * group the master list 's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
		createGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		// Order the list of selected products for delete into those that can be deleted (active products and users own drafts), those that user has
		// to confirm (unsaved changes) and those that cannot be deleted (locked by other users)
		_getDeletedRequested: function(aItemsForDelete) {
			var oBindingContext, oProduct, oDraftAdministrativeData, oProductTextInOriginalLang,
				aItemsLocked = [],
				aItemsUnsaved = [],
				aItemsToDelete = [],
				aLockedLongText = [],
				aUnsavedLongText = [];

			for (var i = 0; i < aItemsForDelete.length; i++) {
				oBindingContext = aItemsForDelete[i].getBindingContext();
				oProduct = oBindingContext.getObject();
				oDraftAdministrativeData = oBindingContext.getObject("DraftAdministrativeData");
				oProductTextInOriginalLang = oBindingContext.getObject("to_ProductTextInOriginalLang");

				if (oProduct.HasDraftEntity && oDraftAdministrativeData.InProcessByUser !== "") {
					//Product is locked by another user and cannot be deleted.
					aItemsLocked.push({
						//Status: "Locked",
						Status: this.getResourceBundle().getText("xgrp.lockedProducts"),
						Product: oProduct.ProductForEdit,
						Name: oProductTextInOriginalLang.Name,
						User: oDraftAdministrativeData.InProcessByUser
					});
					aLockedLongText.push([oProduct.ProductForEdit]);
				} else if (oProduct.HasDraftEntity && oDraftAdministrativeData.InProcessByUser === "" && !oDraftAdministrativeData.DraftIsCreatedByMe) {
					//Another user created a draft, but the lock has been removed.  If the user created the draft, it can be deleted
					aItemsUnsaved.push({
						//Status "Unsaved changes"
						Status: this.getResourceBundle().getText("xgrp.unsavedProducts"),
						BindingContext: oBindingContext,
						Product: oProduct.ProductForEdit,
						Name: oProductTextInOriginalLang.Name,
						User: oDraftAdministrativeData.LastChangedByUser,
						DraftUUID: oDraftAdministrativeData.DraftUUID
					});
					aUnsavedLongText.push(oProduct.ProductForEdit);
				} else {
					// Items can be deleted. These are neither locked nor have unsaved changes.  User's own drafts are added to this
					// list and will be deleted if the user confirms the delete.
					aItemsToDelete.push({
						BindingContext: oBindingContext,
						Product: oProduct.ProductForEdit,
						Name: oProductTextInOriginalLang.Name,
						DraftUUID: oProduct.DraftUUID
					});
				}
			}
			return {
				locked: aItemsLocked,
				lockedTexts: aLockedLongText,
				unsaved: aItemsUnsaved,
				unsavedTexts: aUnsavedLongText,
				toDelete: aItemsToDelete
			};
		},

		// Depending on the whether the set of items selected to be deleted contains locked items, unsaved changes or
		// active items/drafts, determine the texts for the dialogue and the list of items for the details.   This dialogue is specified in the Fiori
		// UX Guidelines in the document "Draft Handling". Note that UPDATES are not currently supported by the Application Infrastructure.
		_determineDialogContent: function(aItemsLocked) {

			var iCanBeDeleted = this.aItemsToDelete.length,
				iLocked = aItemsLocked.length,
				iUnsaved = this.aItemsUnsaved.length,
				//If more than one locked item or more than one item with unsaved changes selelcted, show all of these items
				// in a grouped list in the detail part of the message dialog.
				aSingleList = [],
				bDetails = true, //Flag set if there are details to be shown (list of locked items, list of items with unsaved changes)
				bShowCheckbox = false, //If there are unsaved items and active items, offer user a checkbox to request deletion of unsaved items too
				bDefaultUnsaved = true,
				sLockedText, sDeleteText, sUnsavedText, sDeleteAnywayText, sCheckboxText, sUnsavedNumber;

			// LOCKED ITEMS
			// For the selected locked items, there are only two possibilities to show this.  For one selected locked item, we display
			// the name of this product and show no details. For more than one selected, we show how many locked items were selected.
			// The list of all locked selected items and users who are locking these items is shown in the details.
			if (iLocked > 1) {
				sLockedText = this.getResourceBundle().getText("ymsg.deletedSomeLocked", [iLocked, iLocked + iCanBeDeleted + iUnsaved]);
			} else if (iLocked === 1) {
				sLockedText = this.getResourceBundle().getText("ymsg.lockedForDelete", [
					aItemsLocked[0].Name, aItemsLocked[0].User
				]);
			}

			// ACTIVE ITEMS
			// For active items (including the user's drafts), there are no details shown.  If one such item has been selected,
			// the name of this item appears in the message.  If more than one item has been shown, the user is asked whether he wants
			// to delete all these items.
			// The message text varies if more than one active item has been selected.
			if (iCanBeDeleted > 1) {
				// More than one active/draft product has been selected. Text when there are no unsaved changes or locked
				// also selected
				if (iLocked > 0) {
					// When there are also locked item selected, message contains text numner of items to be deleted.
					sDeleteText = this.getResourceBundle().getText("ymsg.deleteRemaing", iCanBeDeleted);
				} else {
					// If there are no locked items selected, no number of items is speficied and the user is asked whether
					// he wants to delete the selected items (i.e. active items).  Note that unsaved items are considered
					// additionally in the message text.
					sDeleteText = this.getResourceBundle().getText("ymsg.deleteSelected");
				}
			} else if (iCanBeDeleted === 1) {
				// Just one active/draft product has been selected.  Text to delete the named product.
				sDeleteText = this.getResourceBundle().getText("ymsg.deleteText", [this.aItemsToDelete[0].Name]);
			}

			// UNSAVED ITEMS
			// The messages when unsaved items have been selected are more detailled. It is assumed that the deletion of active
			// items excludes locked items by definition. The action button to Delete is based on these items.
			// Now the unsaved items are added to the deletion if the checkbox is left selected. So it is an action added to
			// the delete of the active items.  If there are only unsaved items selected, the action Delete can only apply to the
			// unsaved items, so the checkbox is not shown.
			if (iUnsaved > 0) {

				// In case locked items have also been selected, state how many unsaved items were selected.
				if (iUnsaved > 1 && iLocked > 0) {
					sUnsavedNumber = this.getResourceBundle().getText("ymsg.unsavedNumber", iUnsaved);
				}
				if (iCanBeDeleted > 0) {
					// Items that can be deleted and unsaved changes have been selected.
					// A checkbox to request deletion of unsaved items is needed.  The items that can be deleted
					// will be deleted when the user presses "Delete", but he needs to decide whether to delete those
					// items with unsaved changes too.
					bShowCheckbox = true;
					if (iUnsaved === 1) {
						// Name the specific product with unsaved changes that the user can request to delete
						sCheckboxText = this.getResourceBundle().getText("ymsg.deleteUnsavedText", [
							this.aItemsUnsaved[0].Name
						]);
					} else {
						// For more than one item with unsaved changes, the user can only choose to delete all or none of these
						sCheckboxText = this.getResourceBundle().getText("ymsg.deleteUnsaved");
					}
				} else {
					// No active or draft items have been selected to delete
					if (iUnsaved === 1) {
						// Message for one product with unsaved changes
						sUnsavedText = this.getResourceBundle().getText("ymsg.deleteUnsavedText", [this.aItemsUnsaved[0].Name]);
					} else if (iLocked === 0) {
							// Only unsaved items have been selected, so the messages contain only references to unsaved items
							bDefaultUnsaved = true;
							sDeleteAnywayText = this.getResourceBundle().getText("ymsg.deleteUnsavedConfirm");
							sUnsavedText = this.getResourceBundle().getText("ymsg.deleteUnsavedOnly");
						} else {
							sUnsavedText = this.getResourceBundle().getText("ymsg.deletedSomeConfirm");
						}
				}
			}

			// Decide on Lists to show
			if (iLocked > 1 && iUnsaved <= 1) {
				aSingleList = aItemsLocked;
			} else if (iUnsaved > 1 && iLocked > 1) {
				aSingleList = aItemsLocked.concat(this.aItemsUnsaved);
			} else if (iUnsaved > 1) {
				aSingleList = this.aItemsUnsaved;
			}

			if (aSingleList.length < 1) {
				bDetails = false;
			}

			return {
				lockedText: sLockedText,
				deleteText: sDeleteText,
				unsavedText: sUnsavedText,
				deleteAnywayText: sDeleteAnywayText,
				details: bDetails,
				showCheckbox: bShowCheckbox,
				checkboxText: sCheckboxText,
				defaultUnsaved: bDefaultUnsaved,
				numberToDelete: iCanBeDeleted + iUnsaved + iLocked,
				singleList: aSingleList,
				unsaved: iUnsaved,
				unsavedNumber: sUnsavedNumber

			};
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/ProductSupplierForm.controller", [
	"./BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demoapps.rta.freestyle.controller.ProductSupplierForm", {
		onInit: function() {
			this.byId("supplierForm").bindElement({path:"to_Supplier"});
			//HACK to support demo without stable IDs
			var oContactGroupControl = this.byId("SupplierFormPersonGroup") || this.byId("supplierForm").getGroups()[1];
			oContactGroupControl.bindElement({path:"to_PrimaryContactPersonType"});
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/ProductTechnicalForm.controller", [
	"./BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demoapps.rta.freestyle.controller.ProductTechnicalForm", {

	});
});
// Controller for the view hosting the (Split-)App.
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/Root.controller", [
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"../util/controls"
], function(Device, Controller, controls) {
	"use strict";

	// This class is the controller of view sap.ui.demoapps.rta.freestyle.view.Root, the view hosting the whole app.
	return Controller.extend("sap.ui.demoapps.rta.freestyle.controller.Root", {
		// This class possesses one instance variable, namely _oAppControl. It provides access to the instance of sap.m.SplitApp hosting the app.
		// The variable is initialized in onInit and not changed afterwards.
		onInit: function() {
			this.getView().addStyleClass(controls.getContentDensityClass());
			this._oAppControl = this.byId("idAppControl");
		},

		//--- Public methods used by class Application (or its helper classes)

		hideMaster: function() {
			// Hide master list in portrait mode on tablet
			this._oAppControl.hideMaster();
		},

		attachAfterNavigate: function(fnAfterDetailNavigate, oListener) {
			// attach a function that is called after each navigation step
			if (Device.system.phone) {
				this._oAppControl.attachAfterMasterNavigate(fnAfterDetailNavigate, oListener);
			} else {
				this._oAppControl.attachAfterDetailNavigate(fnAfterDetailNavigate, oListener);
			}
		}
	});
});
// Creates a sub-controller to be used by the master controller to handle specifically filtering, grouping, and sorting
// dialogs
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/SubControllerForFGS", [
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment",
	"../util/controls"
], function(
	BaseObject,
	Filter,
	FilterOperator,
	Sorter,
	Fragment,
	controls
) {
	"use strict";

	// Reads the SAP attribute label from the list-item context
	function fnGetSAPLabel(oListItemContext, sAttributeName) {
		return oListItemContext.getProperty("/#SEPMRA_C_PD_ProductType/" + sAttributeName + "/@sap:label");
	}

	return BaseObject.extend("sap.ui.demoapps.rta.freestyle.controller.SubControllerForFGS", {

		mFilters: {
			Availibility: {
				filters: {},
				missingFilter: function(sKey) {
					return new Filter("to_ProductStock/StockAvailability", FilterOperator.EQ, sKey);
				},
				keyForLabel: "xfld.availability"
			},
			Price: {
				filters: {
					"LE100": new Filter("Price", FilterOperator.LE, "100"),
					"BT100-500": new Filter("Price", FilterOperator.BT, "100", "500"),
					"BT500-1000": new Filter("Price", FilterOperator.BT, "500", "1000"),
					"GT1000": new Filter("Price", FilterOperator.GE, "1000")
				},
				keyForLabel: "xfld.price"
			}
		},
		aFilterByKeys: [null, "xtit.filterBy", "xtit.filterBy2", "xtit.filterBy3"],

		constructor: function(oParentView, oTableOperations, fnApplyTableOperations) {
			this._oParentView = oParentView;
			this._oResourceBundle = oParentView.getController().getResourceBundle();
			this._oTableOperations = oTableOperations;
			this._fnApplyTableOperations = fnApplyTableOperations;
			this._mDialogs = {};

			var sTextBelow100 = this._getText("xfld.groupPriceBetween", ["0-100"]),
				sTextBelow500 = this._getText("xfld.groupPriceBetween", ["100-500"]),
				sTextBelow1000 = this._getText("xfld.groupPriceBetween", ["500-1000"]),
				sTextAbove1000 = this._getText("xfld.groupPrice", ["1000"]);

			// Sets the pre-defined price ranges for use in grouping. The texts can only be defined once i18n bundle is
			// available because the text "price between" is defined only once.
			this._oPriceGroups = {
				"LE100": sTextBelow100,
				"BT100-500": sTextBelow500,
				"BT500-1000": sTextBelow1000,
				"GT1000": sTextAbove1000,
				"unknownPrice": "?"
			};
			var oViewPropertiesModel = oParentView.getModel("masterView");
			oViewPropertiesModel.setProperty("/LE100", sTextBelow100);
			oViewPropertiesModel.setProperty("/BT100-500", sTextBelow500);
			oViewPropertiesModel.setProperty("/BT500-1000", sTextBelow1000);
			oViewPropertiesModel.setProperty("/GT1000", sTextAbove1000);
			this._addDefaultFilters({});
		},

		// Where the user has selected no filter for a ViewSettingsFilterItem, add the default filter if this
		// has been defined in mFilters.
		_addDefaultFilters: function(oFilterFlags) {
			for (var sKey in this.mFilters) {
				if (!oFilterFlags[sKey]) {
					var oDefaultFilter = this.mFilters[sKey].defaultFilter;
					if (oDefaultFilter) {
						this._oTableOperations.addFilter(oDefaultFilter, sKey);
					}
				}
			}
		},

		// Opens the requested filter, grouping, and sorting dialogs
		openDialog: function(sDialogFragmentName, sInitialSelection) {
			var sFullFragmentName = "sap.ui.demoapps.rta.freestyle.view.dialog." + sDialogFragmentName,
				oDialog = this._mDialogs[sFullFragmentName];
			if (!oDialog) {
				return Fragment.load({
					name: sFullFragmentName,
					controller: this
				}).then(function(oFragment) {
					this._mDialogs[sFullFragmentName] = oDialog = oFragment;
					controls.attachControlToView(this._oParentView, oDialog);
					if (sInitialSelection) {
						oDialog.setSelectedSortItem(sInitialSelection);
					}
					return oDialog.open();
				}.bind(this));
			}
			return oDialog.open();
		},

		// Handler for the filter criteria, which is set by the user
		onFilterDialogConfirm: function(oEvent) {
			var params = oEvent.getParameters(),
				oFilterFlags = {},
				i = 0;

			var aFilterItems = params.filterItems; // Array of type ViewSettingsItem
			// Rebuilds filters every time. Makes it easier if the user has removed filter selections
			this._oTableOperations.resetFilters();

			// Determines which filters the user selected according to the predefined price and stock filters
			for (i = 0; i < aFilterItems.length; i++) {
				var oViewSettingsItem = aFilterItems[i],
					sViewSettingsItemKey = oViewSettingsItem.getKey(),
					sViewSettingsFilterItemKey = oViewSettingsItem.getParent().getKey(),
					oFilterHandler = this.mFilters[sViewSettingsFilterItemKey],
					oSelectedFilterExpression = oFilterHandler.filters[sViewSettingsItemKey];

				if (!oSelectedFilterExpression) {
					oSelectedFilterExpression = oFilterHandler.filters[sViewSettingsItemKey] = oFilterHandler.missingFilter(sViewSettingsItemKey);
				}
				this._oTableOperations.addFilter(oSelectedFilterExpression, sViewSettingsFilterItemKey);
				oFilterFlags[sViewSettingsFilterItemKey] = true;
			}
			// For all of the filter attributes that have a default filter, add this default where no filter was
			// selected by the user.  Currently only IsActiveEntity has a default filter.  This must be set to ensure that
			// the correct set of products is shown to the user.  Note that the filter selection conditions for the editing
			// status requires that the default filter is thrown away and specific filters for the requested editing status set.
			// In other words, it is not possible to have the default set of user products and apply additional status filtering
			// to this "logical set" because the backend only allows ONE filter to use the parameter IsActiveEntity.
			this._addDefaultFilters(oFilterFlags);
			// Updates table operation settings and updates list binding accordingly
			this._fnApplyTableOperations(this._setFilterToolbar.bind(this, oFilterFlags));
		},

		// In the case of a filter of Editing Status, filter is based on Product Flags
		_setEditingFilter: function(oSelectedFilterExpression, sKey) {
			switch (sKey) {
				case "editingDraft":
					this._oTableOperations.addFilter(oSelectedFilterExpression, "false", "IsActiveEntity");
					break;
				case "editingLocked":
					this._oTableOperations.addFilter(oSelectedFilterExpression, "false", "IsLocked");
					break;
				case "editingActive":
					this._oTableOperations.addFilter(oSelectedFilterExpression, "false", "IsActiveEntity");
					break;
			}
		},

		_setFilterToolbar: function(oFilterFlags) {
			// Shows/hides infoToolbar in the list

			var aFilterTexts = [];
			for (var sKey in this.mFilters) {
				if (oFilterFlags[sKey]) {
					aFilterTexts.push(this._getText(this.mFilters[sKey].keyForLabel));
				}
			}
			var sFilterByKey = this.aFilterByKeys[aFilterTexts.length],
				sFilterBarLabel = sFilterByKey && this._getText(sFilterByKey, aFilterTexts),
				oViewPropertiesModel = this._oParentView.getModel("masterView");
			oViewPropertiesModel.setProperty("/isFilterBarVisible", !!sFilterByKey);
			oViewPropertiesModel.setProperty("/filterBarLabel", sFilterBarLabel);
		},

		// Defines the Draft filter settings available
		_oEditingFilters: {
			"editingDraft": new Filter("IsActiveEntity", FilterOperator.EQ, "false"),
			"editingLocked": new Filter("HasDraftEntity", FilterOperator.EQ, "true"),
			"editingActive": new Filter("IsActiveEntity", FilterOperator.EQ, "true")

		},

		// Handler for the Confirm button on the sort dialog. Depending on the selections made on the sort
		// dialog, the respective sorters are created and stored in the _oTableOperations object.
		// The actual setting of the sorters on the binding is done in function setSorters
		onSortDialogConfirmed: function(oEvent) {
			var mParams = oEvent.getParameters(),
				sSortPath = mParams.sortItem.getKey();
			this._oTableOperations.addSorter(new Sorter(sSortPath, mParams.sortDescending));
			this._fnApplyTableOperations();
		},

		// Handler for the grouping criteria, which are set by the user
		onGroupingDialogConfirmed: function(oEvent) {
			var mParams = oEvent.getParameters(),
				sortPath;
			if (mParams.groupItem) {
				sortPath = mParams.groupItem.getKey();
			}
			if (sortPath && sortPath !== "") {
				this._oTableOperations.setGrouping(new Sorter(sortPath, mParams.groupDescending,
					this._oGroupFunctions[sortPath].bind(this)));
			} else {
				// Not defined: reset Grouping
				this._oTableOperations.removeGrouping();
			}
			//}
			this._fnApplyTableOperations();
		},

		_oGroupFunctions: {

			// Assumption is that all prices contain the currency code and that the currency conversion has to be done in
			// the backend system of the app
			Price: function(oListItemContext) {
				var sKey, iPrice = Number(oListItemContext.getProperty("Price"));
				if (iPrice <= 100) {
					sKey = "LE100";
				} else if (iPrice <= 500) {
					sKey = "BT100-500";
				} else if (iPrice <= 1000) {
					sKey = "BT500-1000";
				} else if (iPrice > 1000) {
					sKey = "GT1000";
				} else {
					sKey = "unknownPrice";
				}

				return {
					key: sKey,
					text: this._oPriceGroups[sKey]
				};
			},

			"to_ProductStock/Quantity": function(oListItemContext) {
				var sText = oListItemContext.getProperty("to_ProductStock/to_StockAvailability/StockAvailability_Text") || this._getText(
					"xfld.undefinedAvail");
				return {
					key: sText,
					text: sText
				};
			},

			"to_ProductCategory/MainProductCategory": function(oListItemContext) {
				return this._getCategoryName(oListItemContext, "to_ProductCategory/MainProductCategory");
			},

			ProductCategory: function(oListItemContext) {
				return this._getCategoryName(oListItemContext, "ProductCategory");
			}
		},

		// Reads the corresponding category name based on the list-item context
		_getCategoryName: function(oListItemContext, sCategoryType) {
			var sKey = oListItemContext.getProperty(sCategoryType);
			return {
				key: sKey,
				text: this._getText("xfld.groupingLabel", [fnGetSAPLabel(oListItemContext, sCategoryType), sKey])
			};
		},

		// Shortcut to get i18n text
		_getText: function() {
			return this._oResourceBundle.getText.apply(this._oResourceBundle, arguments);
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/controller/utilities", [
	"sap/m/library",
	"sap/m/MessageBox",
	"../util/controls"
], function(mobileLibrary, MessageBox, controls) {
	"use strict";

	// class providing static utility methods.

	var sNullUUID = "00000000-0000-0000-0000-000000000000";

	return {
		// To create a new product it is necessary to supply a null UUID
		getNullUUID: function() {
			return sNullUUID;
		},

		isDraftClean: function(oAdminData) {
			return oAdminData.CreationDateTime.getTime() === oAdminData.LastChangeDateTime.getTime();
		},

		sendEmailForProduct: function(oResourceBundle, sProductName, sProductId, sProductDescription, sSupplierName) {
			var sSubject = oResourceBundle.getText("xtit.emailSubject", [sProductName || sProductId]),
				sContent = sProductDescription ? oResourceBundle.getText("xtit.emailContent", [sProductId, sProductDescription, sSupplierName]) : "";
			mobileLibrary.URLHelper.triggerEmail(null, sSubject, sContent);
		},

		showDeleteMessage: function(oResourceBundle, sUser, sProductName, fnOnclose, bUnsavedChanges) {

			var sTitle = bUnsavedChanges ? oResourceBundle.getText("ymsg.deleteUnsavedText", sUser) : oResourceBundle.getText("ymsg.deleteText", [
				sProductName
			]);
			MessageBox.warning(
				sTitle, {
					icon: MessageBox.Icon.WARNING,
					title: oResourceBundle.getText("xtit.delete"),
					styleClass: controls.getContentDensityClass(),
					actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
					onClose: fnOnclose
				}
			);
		},

		showEditUnchangedMessage: function(oResourceBundle, sUser, fnOnclose) {

			var sTitle = oResourceBundle.getText("ymsg.takeoverUnsavedChanges", sUser);
			MessageBox.warning(
				sTitle, {
					icon: MessageBox.Icon.WARNING,
					title: oResourceBundle.getText("xtit.warning"),
					styleClass: controls.getContentDensityClass(),
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: fnOnclose
				}
			);
		}

	};
});
// In mock mode, the mock server intercepts HTTP calls and provides fake output to the
// client without involving a backend system. But special backend logic, such as that
// performed by function imports, is not automatically known to the mock server. To handle
// such cases, the app needs to simulate this backend logic by using standard HTTP requests
// (that are again interpreted by the mock server) as shown below.
// There are two ways to do this:
//  a)  If the mock server does not provide a handler function for a request the app can define
//      its own handler function and add it to the mock server's handler functions. This is the
//      case for function import requests. In this example a list of the app specific handler
//      functions is returned by function Request.getRequests and added to the mock server
//      handlers in Service.init
//  b)  If additional tasks have to be performed before or after a standard mock request
//      handler has run the app can attach call back functions to the respective request. The
//      app can define if the call back is to be performed before or after the mock server's
//      request handler
// Please note:
// The usage of synchronous calls is only allowed in this context because the requests are
// handled by a latency-free client-side mock server. In production coding, asynchronous
// calls are mandatory.
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/localService/MockRequests", [
	"sap/base/util/extend",
	"sap/ui/base/Object",
	"sap/ui/core/util/MockServer"
], function(extend, Object, MockServer) {
	"use strict";

	return Object.extend("sap.ui.demoapps.rta.freestyle.test.service.Request", {

		constructor: function(oMockServer) {
			this._sTestUser = "TestUser";
			this._srvUrl = "/sap/opu/odata/sap/SEPMRA_PROD_MAN/"; //service url
			this._iLastId = 0;
			this._oMockServer = oMockServer;
			this._initRequestCallbacks();
		},

		_initRequestCallbacks: function() {
			this._oMockServer.attachAfter(MockServer.HTTPMETHOD.POST, this.onAddProduct.bind(this), "SEPMRA_C_PD_Product");
			this._oMockServer.attachAfter(MockServer.HTTPMETHOD.DELETE, this.onDeleteProduct.bind(this), "SEPMRA_C_PD_Product");
		},

		getRequests: function() {
			// This method is called by the webIDE if the app is started in mock mode with the
			// option "AddCusom Mock Requests". It returns the list of app specific mock requests.
			// The list is added to the mock server's own list of requests
			return [
				this._mockActivateProduct(),
				this._mockEditProduct(),
				this._mockCopyProduct()
			];
		},

		onDeleteProduct: function(oEvt) {

		},

		onAddProduct: function(oEvt) {
			// This mock request is called when a new Product is created created by clicking 'Add' and when a product is edited.
			// Newly created products do not contain all necessary data. The missing data is added by this function
			var sNewProductId = "EPM-" + this._getNewId();
			extend(oEvt.getParameter("oEntity"), {
				"Weight": "0.000",
				"WeightUnit": "KGM",
				"OriginalLanguage": "EN",
				"IsActiveEntity": false,
				"HasActiveEntity": false,
				"HasDraftEntity": false,
				//"ProductDraftUUID": "00505691-2EC5-1ED5-B19F-504E2115A825",
				"ActiveProduct": "",
				"ActiveProduct_Text": "",
				"Product": sNewProductId, //"EPM-000260"
				"ProductCategory": "",
				"Price": "0.00",
				"Currency": "USD", //"EUR",
				"Height": "0.00",
				"Width": "0.00",
				"Depth": "0.00",
				"DimensionUnit": "M",
				"ProductPictureURL": "",
				"Supplier": "",
				"ProductBaseUnit": "EA"
			});
			//Fix the bug
			this._fixRemoveActiveProductValue(oEvt.getParameter("oEntity"));
			//
			this._createDraftAdminData(oEvt.getParameter("oEntity").ProductDraftUUID);
			this._createProductStock(sNewProductId);
			this._createProductText(oEvt.getParameter("oEntity").ProductDraftUUID);
		},

		_fixRemoveActiveProductValue: function(oNewProduct) {
			//fix the issue: remove the ActiveProduct value for the new Product (oNewProduct is reference to the caller object)
			oNewProduct.__metadata.id = oNewProduct.__metadata.id.replace(/ActiveProduct='(.*)'/, "ActiveProduct=''");
			oNewProduct.__metadata.uri = oNewProduct.__metadata.uri.replace(/ActiveProduct='(.*)'/, "ActiveProduct=''");
			for (var prop in oNewProduct) {
				if (oNewProduct[prop] && oNewProduct[prop].__deferred && oNewProduct[prop].__deferred.uri) {
					oNewProduct[prop].__deferred.uri = oNewProduct[prop].__deferred.uri.replace(/ActiveProduct='(.*)'/, "ActiveProduct=''");
				}
			}
		},

		_mockEditProduct: function() {
			return {
				// This mock request simulates the function import "EditProduct", which is triggered when the user chooses the
				// "Edit" button.
				method: "POST",
				path: new RegExp("SEPMRA_C_PD_ProductEdit\\?ProductDraftUUID=guid'(.*)'&ActiveProduct='(.*)'"),
				response: function(oXhr, sDraftUUID, sActiveProduct) {
					//this._createDraft(oXhr,	this._getProdIdFromUrlParam(sActiveProduct), false);
				}
			};
		},

		_mockCopyProduct: function() {
			return {
				// This mock request simulates the function import "CopyProduct", which is triggered when the user chooses the
				// "Copy" button.
				method: "POST",
				path: new RegExp("SEPMRA_C_PD_ProductCopy\\?ProductDraftUUID=guid'(.*)'&ActiveProduct='(.*)'"),
				response: function(oXhr, sDraftID, sActiveProduct) {
					this._createDraft(oXhr, this._getProdIdFromUrlParam(
						sActiveProduct), true);
				}.bind(this)
			};
		},

		_mockActivateProduct: function() {
			return {
				// This mock request simulates the function import "ActivateProduct", which is triggered when the user chooses
				// the "Save" button.
				// Here the draft's data is used to update an existing product (if the draft was created by editing a product)
				// or the draft is used to created a new product (if the draft was created by copying a product)
				method: "POST",
				path: new RegExp("SEPMRA_C_PD_ProductActivation\\?ProductUUID=(.*)"),
				response: function(oXhr, sUrlParams) {
					var sDraftUUID = this._getProdIdFromUrlParam(sUrlParams),
						oProduct = null;

					sDraftUUID = sDraftUUID.substring(5, sDraftUUID.length - 1);
					oProduct = this._buildProductFromDraft(sDraftUUID);

					oXhr.respondJSON(200, {}, JSON.stringify({
						d: oProduct
					}));

					return true;
				}.bind(this)

			};
		},

		_buildProductFromDraft: function(sDraftUUID) {
			// create a product object based on a draft
			// In case the draft was created to add a new product the existing draft object is converted to a product by setting
			// the appropriate attribute values. If the draft was created to edit an existing product then the drafts values are
			// copied to the existing product and the draft is deleted
		},

		_getProdIdFromUrlParam: function(sUrlParams) {
			// Extracts product ID from the URL parameters
			var sParams = decodeURIComponent(sUrlParams);
			//return sParams.substring(1, sParams.length - 1);
			return sParams;
		},

		_getNewId: function() {
			this._iLastId++;
			return this._iLastId.toString();
		},

		_getNewUUID: function() {
			return "aaaaaaaa-bbbb-cccc-dddd-" + this._getNewId();
		},

		_copyProductText: function(sProductUUID, sProductDraftUUID, bNewProduct, sActiveProduct) {
			var
				aDraftProductTexts = this._oMockServer.getEntitySetData("SEPMRA_C_PD_ProductText"),
				// Get product details - the data is used to pre-fill the draft fields
				oOriginalProductText = this._findFirst("ActiveProduct", sProductUUID, aDraftProductTexts),
				oDraftProductText = {},
				sDraftPath, sOriginalPath;

			extend(oDraftProductText, oOriginalProductText);
			oDraftProductText.ProductTextDraftUUID = this._getNewUUID();
			oDraftProductText.ProductDraftUUID = sProductDraftUUID;
			oDraftProductText.IsActiveEntity = false;
			oDraftProductText.HasDraftEntity = false;

			if (bNewProduct) {
				oDraftProductText.ActiveProduct = "";
				oDraftProductText.HasActiveEntity = false;
				oDraftProductText.SiblingEntity = {};
			} else {
				// the product text is being edited -
				oDraftProductText.HasActiveEntity = true;
				//set the HasDraftEntity property of the original product to true
				oOriginalProductText.HasDraftEntity = true;
				//TODO
				oDraftProductText.SiblingEntity = {};
			}
			sDraftPath = this._srvUrl + "SEPMRA_C_PD_ProductText(ProductTextDraftUUID=guid'" + oDraftProductText.ProductTextDraftUUID +
				"',ActiveProduct='" + sActiveProduct + "',ActiveLanguage='EN')";
			//updates the draft association paths
			sOriginalPath = oOriginalProductText.__metadata.uri;
			oDraftProductText.__metadata = {
				"id": sDraftPath,
				"type": "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductTextType",
				"uri": sDraftPath
			};
			for (var prop in oDraftProductText) {
				if (oDraftProductText[prop] && oDraftProductText[prop].__deferred && oDraftProductText[prop].__deferred.uri) {
					oDraftProductText[prop].__deferred.uri = oDraftProductText[prop].__deferred.uri.replace(sOriginalPath, sDraftPath);
				}
			}
			aDraftProductTexts.push(oDraftProductText);
			this._oMockServer.setEntitySetData("SEPMRA_C_PD_ProductText", aDraftProductTexts);

			//create new entry into the DraftAdministrativeData
			this._createDraftAdminData(oDraftProductText.ProductTextDraftUUID);
		},

		_createDraftAdminData: function(oDraftUUID) {
			var aDraftAdminData = this._oMockServer.getEntitySetData("I_DraftAdministrativeData");
			var iNow = (new Date()).getTime();
			//creates entry in I_DraftAdministrativeData
			aDraftAdminData.push({
				DraftUUID: oDraftUUID,
				DraftEntityType: "SEPMRA_I_PRODUCTWITHDRAFT",
				CreationDateTime: "\/Date(" + iNow + "+0000)\/",
				CreatedByUser: this._sTestUser,
				LastChangeDateTime: "\/Date(" + iNow + "+0000)\/",
				LastChangedByUser: this._sTestUser,
				DraftAccessType: "",
				ProcessingStartDateTime: "\/Date(" + iNow + "+0000)\/",
				InProcessByUser: "", //this._sTestUser,
				DraftIsKeptByUser: false,
				EnqueueStartDateTime: "0.0000000",
				DraftIsCreatedByMe: true,
				DraftIsLastChangedByMe: true,
				DraftIsProcessedByMe: false,
				CreatedByUserDescription: "",
				LastChangedByUserDescription: "",
				InProcessByUserDescription: "",
				__metadata: {
					"id": "/sap/opu/odata/sap/SEPMRA_PROD_MAN/I_DraftAdministrativeData(guid'" + oDraftUUID + "')",
					"type": "SEPMRA_PROD_MAN.I_DraftAdministrativeDataType",
					"uri": "/sap/opu/odata/sap/SEPMRA_PROD_MAN/I_DraftAdministrativeData(guid'" + oDraftUUID + "')"
				}
			});
			this._oMockServer.setEntitySetData("I_DraftAdministrativeData", aDraftAdminData);
		},

		_createProductStock: function(oProductId) {
			var aProductStocks = this._oMockServer.getEntitySetData("SEPMRA_C_PD_ProductStock");
			aProductStocks.push({
				Product: oProductId,
				Quantity: "0",
				QuantityUnit: "EA",
				StockAvailability: 1,
				__metadata: {
					"id": "/sap/opu/odata/sap/SEPMRA_PROD_MAN/SEPMRA_C_PD_ProductStock('" + oProductId + "')",
					"type": "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductStockType",
					"uri": "/sap/opu/odata/sap/SEPMRA_PROD_MAN/SEPMRA_C_PD_ProductStock('" + oProductId + "')"
				},
				to_StockAvailability: {
					"__deferred": {
						"uri": "/sap/opu/odata/sap/SEPMRA_PROD_MAN/SEPMRA_C_PD_ProductStock('" + oProductId + "')/to_StockAvailability"
					}
				}
			});
			this._oMockServer.setEntitySetData("SEPMRA_C_PD_ProductStock", aProductStocks);
		},

		_createProductText: function(oDraftUUID) {
			var aProductTexts = this._oMockServer.getEntitySetData("SEPMRA_C_PD_ProductText");
			aProductTexts.push({
				ProductTextDraftUUID: oDraftUUID,
				ActiveProduct: "",
				ActiveLanguage: "",
				Language: "EN",
				Name: "",
				Description: "",
				IsActiveEntity: false,
				HasActiveEntity: false,
				HasDraftEntity: false,
				__metadata: {
					"id": "/sap/opu/odata/sap/SEPMRA_PROD_MAN/SEPMRA_C_PD_ProductText(ProductTextDraftUUID=guid'" + oDraftUUID +
						"',ActiveProduct='',ActiveLanguage='')",
					"type": "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductTextType",
					"uri": "/sap/opu/odata/sap/SEPMRA_PROD_MAN/SEPMRA_C_PD_ProductText(ProductTextDraftUUID=guid'" + oDraftUUID +
						"',ActiveProduct='',ActiveLanguage='')"
				}
			});
			this._oMockServer.setEntitySetData("SEPMRA_C_PD_ProductText", aProductTexts);
		},

		_createDraft: function(oXhr, sProductUUID, bNewProduct) {
			var
				aProducts = this._oMockServer.getEntitySetData("SEPMRA_C_PD_Product"),
				// Get product details - the data is used to pre-fill the draft fields
				oOriginalProduct = this._findFirst("ActiveProduct", sProductUUID, aProducts),
				oDraft = {},
				sDraftPath, sOriginalPath;

			// Writes the product data to the draft
			// Most of the values for the draft can be copied from the product
			extend(oDraft, oOriginalProduct);
			oDraft.CreatedByUser = this._sTestUser;
			oDraft.ProductDraftUUID = this._getNewUUID();
			oDraft.IsActiveEntity = false;
			oDraft.HasDraftEntity = false;

			if (bNewProduct) {
				// A new product is created as a copy of an existing one
				oDraft.Product = "EPM-" + this._getNewId();
				oDraft.ActiveProduct = "";
				oDraft.HasActiveEntity = false;
				//updates the metadata
				sDraftPath = this._srvUrl + "SEPMRA_C_PD_Product(ProductDraftUUID=guid'" + oDraft.ProductDraftUUID + "',ActiveProduct='')";
				//to check:

				oDraft.SiblingEntity = {};
			} else {
				// A product is edited -
				oDraft.HasActiveEntity = true;
				sDraftPath = this._srvUrl + "SEPMRA_C_PD_Product(ProductDraftUUID=guid'" + oDraft.ProductDraftUUID + "',ActiveProduct='" + oDraft.ActiveProduct +
					"')";
				//set the HasDraftEntity property of the original product to true
				oOriginalProduct.HasDraftEntity = true;
				//to check:
				oDraft.SiblingEntity = {};
			}

			//updates the draft association paths
			sOriginalPath = oOriginalProduct.__metadata.uri;
			oDraft.__metadata = {
				"id": sDraftPath,
				"type": "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType",
				"uri": sDraftPath
			};
			for (var prop in oDraft) {
				if (oDraft[prop] && oDraft[prop].__deferred && oDraft[prop].__deferred.uri) {
					oDraft[prop].__deferred.uri = oDraft[prop].__deferred.uri.replace(sOriginalPath, sDraftPath);
				}
			}

			aProducts.push(oDraft);
			this._oMockServer.setEntitySetData("SEPMRA_C_PD_Product", aProducts);

			//create new entry in the product text collection, copy content from the original one
			this._copyProductText(sProductUUID, oDraft.ProductDraftUUID, bNewProduct, oDraft.ActiveProduct);
			//create new entry into the DraftAdministrativeData
			this._createDraftAdminData(oDraft.ProductDraftUUID);

			oXhr.respondJSON(200, {}, JSON.stringify({
				d: oDraft
			}));
			return true;
		},

		_findFirst: function(sAttribute, searchValue, aSearchList) {
			// Searches in an array of objects for a given attribute value and returns the first match.
			var aMatches = this._find(sAttribute, searchValue, aSearchList, true);
			if (aMatches.length > 0) {
				return aMatches[0];
			}
			return null;
		},

		_find: function(sAttribute, searchValue, aSearchList, bLeaveEarly) {
			// Searches in an array of objects for a given attribute value and returns all matching objecsts in an array.
			// If bLeaveEarly is set to true only the first match will be returned
			var aResult = [];
			for (var i = 0; i < aSearchList.length; i++) {
				if (aSearchList[i][sAttribute] === searchValue) {
					aResult.push(aSearchList[i]);
				}
				if (aResult.length === 1 && bLeaveEarly) {
					break;
				}
			}
			return aResult;
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/localService/mockserver", [
	"sap/base/Log",
	"sap/ui/core/util/MockServer",
	"./MockRequests"
], function(Log, MockServer, MockRequests) {
	"use strict";

	var oMockServer,
		_sAppModulePath = "sap/ui/demoapps/rta/freestyle/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

	return {
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function(oManifest) {
			var oUriParameters = new URLSearchParams(window.location.search),
				sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesModulePath),
				sEntity = "SEPMRA_C_PD_Product",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				oMainDataSource =  oManifest["sap.app"].dataSources.mainService,
				sMetadataUrl = sap.ui.require.toUrl(_sAppModulePath + oMainDataSource.settings.localUri),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";

			var oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});
			var oRequests = new MockRequests(oMockServer);
			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 50)
			});

			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			var aRequests = oMockServer.getRequests(),
				fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

			// handling the metadata error test
			if (oUriParameters.get("metadataError")) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (sErrorParam) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}
			//add the app-specific mock implementation to the standard one
			oMockServer.setRequests(aRequests.concat(oRequests.getRequests()));

			MockServer.startAll();

			Log.info("Running the app with mock data");
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer: function() {
			return oMockServer;
		}
	};

});
// Helper class for centrally handling oData CRUD and function import services. The interface provides the business
// meanings for the application and can be reused in different places where the UI-specific actions after the call
// could still be different and will be handled in the corresponding controller of the view.
// Every (main) view of this app has an instance of this class as an attribute so that it can forward all explicit
// backend calls to it.
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/model/Products", [
	"sap/ui/base/Object",
	"sap/ui/Device",
	"sap/ui/generic/app/transaction/TransactionController",
	"../util/messages",
	"../controller/utilities",
	"sap/m/library"
], function(
	BaseObject,
	Device,
	TransactionController,
	messages,
	utilities,
	library
) {
	"use strict";

	var DraftIndicatorState = library.DraftIndicatorState;

	var oResolvedPromise = Promise.resolve(),
		mParametersForRead = Object.freeze({
			expand: "DraftAdministrativeData,to_ProductTextInOriginalLang,to_Supplier,to_ProductStock,to_ProductStock/to_StockAvailability" +
				",to_ProductCategory,to_CollaborativeReview,to_ProductBaseUnit,to_DimensionUnit,to_WeightUnit,to_Supplier,to_Supplier/to_PrimaryContactPersonType",
			select: "Currency,Depth,DraftUUID,HasDraftEntity,Height,IsActiveEntity,Price,Product,ProductBaseUnit,ProductCategory,ProductForEdit,ProductPictureURL,Weight,Width,DraftAdministrativeData/InProcessByUser,DraftAdministrativeData/DraftUUID,DraftAdministrativeData/CreationDateTime,DraftAdministrativeData/LastChangeDateTime,DraftAdministrativeData/DraftIsCreatedByMe,to_ProductTextInOriginalLang/Name,to_ProductTextInOriginalLang/Description,to_Supplier/PhoneNumber, to_Supplier/FaxNumber,to_Supplier/URL,to_Supplier/CompanyName,to_Supplier/EmailAddress,to_ProductStock/StockAvailability,to_ProductStock/to_StockAvailability/StockAvailability_Text,to_ProductCategory/MainProductCategory,to_ProductCategory/ProductCategory,to_CollaborativeReview/AverageRatingValue,to_CollaborativeReview/NumberOfReviewPosts,to_ProductBaseUnit/UnitOfMeasure_Text,to_DimensionUnit/UnitOfMeasure_Text,to_WeightUnit/UnitOfMeasure_Text,to_Supplier/to_PrimaryContactPersonType/EmailAddress,to_Supplier/to_PrimaryContactPersonType/FirstName,to_Supplier/to_PrimaryContactPersonType/LastName,to_Supplier/to_PrimaryContactPersonType/PhoneNumber,to_Supplier/to_PrimaryContactPersonType/FormattedContactName,to_Supplier/to_PrimaryContactPersonType/MobilePhoneNumber"
		});

	return BaseObject.extend("sap.ui.demoapps.rta.freestyle.model.Products", {
		// Attributes of this class:
		// _oResourceBundle, _oODataModel, _oApplicationProperties, _oApplication, _oMainView
		// are the global objects used throughout this app
		constructor: function(oComponent, oMainView, fnBeforeActivation, fnOnActivationFailed) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oODataModel = oComponent.getModel();
			this._oApplicationProperties = oComponent.getModel("appProperties");
			this._oApplication = this._oApplicationProperties.getProperty("/applicationController");
			this._oMainView = oMainView;
			this._fnBeforeActivation = fnBeforeActivation;
			this._fnOnActivationFailed = fnOnActivationFailed;
			this._oChangesSubmitted = oResolvedPromise;
			this._fnChangeSubmitResolve = null;
			this._mDeletedProducts = {};
			this._mDeletedDrafts = {};
			this._oTransactionController = new TransactionController(this._oODataModel);
		},

		getPathForDraft: function(sProductId, sDraftId, bIsActive) {
			return this._oODataModel.createKey("/SEPMRA_C_PD_Product", {
				Product: sProductId,
				DraftUUID: sDraftId,
				IsActiveEntity: bIsActive
			});
		},

		getParametersForRead: function() {
			return mParametersForRead;
		},

		// Additional methods for working with products

		// Creates a product draft for a new product.
		createProductDraft: function(fnProductDraftCreated) {
			this._oApplication.setAppBusy();
			var oDraftController = this._oTransactionController.getDraftController(),
				oCreatePromise = oDraftController.createNewDraftEntity("SEPMRA_C_PD_Product", "/SEPMRA_C_PD_Product"),
				fnCreatedHandler = function(oResponse) {
					fnProductDraftCreated(oResponse.data);
				};
			oCreatePromise.then(fnCreatedHandler, this._oApplication.resetAppBusy());
		},

		// Creates product draft from a specified product ID for CopyProduct
		copyProductToDraft: function(sProductId, fnNavToDraft) {
			var fnSuccess = function(oResponseContent) {
				fnNavToDraft("", oResponseContent.DraftUUID);
			};
			this._oApplication.setAppBusy();
			this._callFunctionImport("/SEPMRA_C_PD_ProductCopy", {
					Product: sProductId,
					DraftUUID: utilities.getNullUUID(),
					IsActiveEntity: true
				},
				fnSuccess
			);
		},

		// Gets product draft from a specified product ID for EditProduct
		getProductDraftFromProductId: function(oContext, fnNavToDraft, fnNoDraft) {
			this._oApplication.setAppBusy();
			var sProductId = this._oApplicationProperties.getProperty("/productId"),
				oDraftController = this._oTransactionController.getDraftController(),
				fnCreatedHandler = function(oResponse) {
					fnNavToDraft(oResponse.data.Product, oResponse.data.DraftUUID);
				},
				fnFailedHandler = function() {
					this._oApplication.setAppBusy();
					fnNoDraft();
				},
				oProductHasNoDraft = this.whenProductIsClean(sProductId);
			oProductHasNoDraft.then(oDraftController.createEditDraftEntity.bind(oDraftController, oContext)).then(fnCreatedHandler).catch(
				fnFailedHandler);
		},

		// Convenience method for calling function imports. Provides error handling and the busy indicator.
		_callFunctionImport: function(sFunctionName, oURLParameters, fnAfterFunctionExecuted, sProcessingProperty) {
			this._oODataModel.callFunction(sFunctionName, {
				method: "POST",
				urlParameters: oURLParameters,
				success: fnAfterFunctionExecuted,
				error: this._getResetPropertyFunction(sProcessingProperty)
			});
		},

		// Turns ProductDraft into Product and deletes ProductDraft
		activateProduct: function(oContext, fnAfterActivation) {
			this._fnBeforeActivation();
			//this._oApplicationProperties.setProperty("/isBusySaving", true);
			this._oApplication.setAppBusy();
			this._submitChanges().then(
				this._activateProduct.bind(this, oContext, fnAfterActivation, this._fnOnActivationFailed));
		},

		_activateProduct: function(oContext, fnAfterActivation, fnActivationFailed) {
			var oDraftController = this._oTransactionController.getDraftController(),
				oActivatePromise = oDraftController.activateDraftEntity(oContext),
				sProductId = oContext.getObject().ProductForEdit,
				fnActivatedHandler = function() {
					fnAfterActivation(sProductId);
					// Product {0} was saved successfully
					var sSuccessMessage = this._oResourceBundle.getText("ymsg.saveSuccess", [sProductId]);
					sap.ui.require(["sap/m/MessageToast"], function(MessageToast) {
						MessageToast.show(sSuccessMessage);
					});
				}.bind(this);
			oActivatePromise.then(this._invalidateFrontendCache.bind(this, sProductId, fnActivatedHandler), this._getResetPropertyFunction(
				"isBusySaving", fnActivationFailed));
		},

		// Saves ProductDraft each time a user edits a field
		saveProductDraft: function() {
			if (this._oODataModel.hasPendingChanges()) {
				this._oApplicationProperties.setProperty("/draftIndicatorState", DraftIndicatorState.Saving);
				this._submitChanges();
			}
		},

		_submitChanges: function() {
			if (this._fnChangeSubmitResolve || !this._oODataModel.hasPendingChanges()) {
				return this._oChangesSubmitted;
			}
			this._oChangesSubmitted = new Promise(function(fnResolve) {
				this._fnChangeSubmitResolve = function() {
					this._fnChangeSubmitResolve = null;
					fnResolve();
					if (this._oApplicationProperties.getProperty("/draftIndicatorState") === DraftIndicatorState.Saving) {
						this._oApplicationProperties.setProperty("/draftIndicatorState", DraftIndicatorState.Saved);
					}
				}.bind(this);
				this._sMessage = null;
				var oParameters = {};
				oParameters.success = function(oResponseData) {
					var bHasChanges = this._oODataModel.hasPendingChanges();
					if (!bHasChanges || !this._sMessage) {
						var i;
						for (i = 0; i < oResponseData.__batchResponses.length && !this._sMessage; i++) {
							var oEntry = oResponseData.__batchResponses[i];
							if (oEntry.response) {
								this._sMessage = messages.extractErrorMessageFromDetails(oEntry.response.body);
							}
						}
					}
					if (this._sMessage || !bHasChanges) {
						this._fnChangeSubmitResolve();
					} else {
						this._oODataModel.submitChanges(oParameters);
					}
				}.bind(this);
				oParameters.error = this._fnChangeSubmitResolve;
				this._oODataModel.submitChanges(oParameters);

			}.bind(this));
			return this._oChangesSubmitted;
		},

		_getResetPropertyFunction: function(sProperty, fnAfterwards) {
			return function() {
				this._oApplicationProperties.setProperty("/" + sProperty, false);
				if (fnAfterwards) {
					fnAfterwards(arguments);
				}
			}.bind(this);
		},

		deleteDraftFromResume: function(sPath, sDraftId, bDirty) {

			if (this._mDeletedDrafts[sDraftId]) { // product is already deleted (or in the process of being deleted)
				return;
			}
			this._mDeletedDrafts[sDraftId] = true;
			var fnSuccess = function() {
				var sSuccessMessage;
				this._oApplication.resetAppBusy();
				if (bDirty) {
					sSuccessMessage = this._oResourceBundle.getText("ymsg.draftEditDiscarded");
					sap.ui.require(["sap/m/MessageToast"], function(MessageToast) {
						MessageToast.show(sSuccessMessage);
					});
				}
			}.bind(this);
			var fnFailed = function() {
				this._oApplication.resetAppBusy();
				delete this._mDeletedDrafts[sDraftId];
			};

			this._oApplication.setAppBusy();
			this._oTransactionController.deleteEntity(sPath).then(
				fnSuccess,
				fnFailed
			);
		},

		deleteDraftEntity: function(oContext, bIsDraftDirty) {
			var sProductId = oContext.getObject().Product;
			var sDraftId = oContext.getObject().DraftUUID;
			this.bHasActiveEntity = oContext.getObject().HasActiveEntity;
			if (this._mDeletedDrafts[sDraftId]) { // product is already deleted (or in the process of being deleted)
				return;
			}
			this._mDeletedDrafts[sDraftId] = true;
			if (sProductId) {
				if (this.bHasActiveEntity) {
					// Just display the active product
					this._oApplication.displayProduct(sProductId);
				} else {
					// Draft Entitiy is a create entity, so need to use preferredIds
					this._oApplication.navToMaster(null, null);
				}
			} else if (this._oApplicationProperties.getProperty("/draftId") === sDraftId) {
				this._oApplicationProperties.setProperty("/draftId", "");
				this._oApplication.navToMaster(sDraftId, this._oApplicationProperties.getProperty("/preferredIds"));
			}
			var fnSuccess = function() {
				var sSuccessMessage;
				this._oApplication.resetAppBusy();
				if (bIsDraftDirty) {
					if (this.bHasActiveEntity) {
						sSuccessMessage = this._oResourceBundle.getText("ymsg.draftEditDiscarded");
					} else {
						sSuccessMessage = this._oResourceBundle.getText("ymsg.draftCreateDiscarded");
					}
					sap.ui.require(["sap/m/MessageToast"], function(MessageToast) {
						MessageToast.show(sSuccessMessage);
					});
				}

			}.bind(this);
			var fnFailed = function() {
				delete this._mDeletedDrafts[sDraftId];
			};

			this._oApplication.setAppBusy();
			this._oTransactionController.deleteEntity(oContext).then(
				fnSuccess(oContext, bIsDraftDirty),
				fnFailed
			);

		},

		deleteProduct: function(oContext) {
			var sProductId = oContext.getObject().ProductForEdit;
			if (this._mDeletedProducts[sProductId]) { // product is already deleted (or in the process of being deleted)
				return;
			}
			this._mDeletedProducts[sProductId] = true;
			var fnSuccess = function() {
					if (Device.system.phone) {
						this._oApplication.navToMaster(null, null);
						this._invalidateFrontendCache(sProductId);
					}
					var sSuccessMessage = this._oResourceBundle.getText("ymsg.deleteProduct", [sProductId]);
					sap.ui.require(["sap/m/MessageToast"], function(MessageToast) {
						MessageToast.show(sSuccessMessage);
					});
				}.bind(this),
				fnFailed = function() {
					delete this._mDeletedProducts[sProductId];
				};

			this._oApplication.setAppBusy();
			this._oTransactionController.deleteEntity(oContext).then(
				fnSuccess,
				fnFailed);
		},

		deleteEntities: function(aItemsToDelete) {
			// Delete an array of Products by using a list of binding contexts with the transaction controller
			// The binding contexts were added to the array of items to be deleted when selected by the user
			// in the multiselect delete dialog.
			var aItems = [],
				sDraftId, sProductId;
			for (var i = 0; i < aItemsToDelete.length; i++) {
				sDraftId = aItemsToDelete[i].DraftUUID;
				sProductId = aItemsToDelete[i].Product;
				// An Active Product is being deleted
				if (sDraftId === utilities.getNullUUID()) {
					if (this._mDeletedProducts[sProductId]) { // product is already deleted (or in the process of being deleted)
						break;
					}
					this._mDeletedProducts[sProductId] = true;
				} else { // A draft is being deleted
					if (this._mDeletedDrafts[sDraftId]) {
						break;
					} else {
						this._mDeletedDrafts[sDraftId] = true;
					}
				}
				aItems.push(aItemsToDelete[i].BindingContext);
			}
			// After deletion of more than one item, we don't want master list to select
			// the previously selected item
			this._oApplicationProperties.setProperty("/productId", null);
			this._oApplicationProperties.setProperty("/draftId", null);

			this._oTransactionController.deleteEntities(aItems).then(
				this._onDeletionsSuccess).catch(
				// Error handling has currently a bug and does not work
				this._onDeletionsFailure);
		},

		_onDeletionsSuccess: function(oResponse) {
			//assume that all items have been deleted
		},

		_onDeletionsFailure: function(oResponse) {
			// remove those items that could not be deleted
		},

		_invalidateFrontendCache: function(sProductId, fnAfterInvalidation) {
			if (sProductId) {
				var sActivePath = this.getPathForDraft(sProductId, utilities.getNullUUID(), true);
				this._oODataModel.createBindingContext(sActivePath, null, mParametersForRead, fnAfterInvalidation || function() {}, true);
			}
		},

		isDraftIdValid: function(sDraftId) {
			return !this._mDeletedDrafts[sDraftId];
		},

		whenProductIsClean: function(sProductId) {
			return oResolvedPromise;
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/model/formatter", [
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/library"
], function(
	jQuery,
	library
) {
	"use strict";

	var ValueState = library.ValueState;

	var bDemokitAvailable;

	function getDemokitPath(sFileName) {
		if (bDemokitAvailable === false) {
			return bDemokitAvailable;
		}

		var sFilePath = sap.ui.require.toUrl('sap/ui/documentation').replace('resources', 'test-resources') + '/sdk/images/' + sFileName;

		if (typeof bDemokitAvailable !== "boolean") {
			bDemokitAvailable = [200, 301, 302, 304].indexOf(jQuery.ajax({
				async: false,
				url: sFilePath
			}).status) !== -1;
		}

		return bDemokitAvailable && sFilePath;
	}

	return {
		/**
		 * Formatter for the title of the master list. iCount is the number of entries. It is negative when the number has not yet been determined.
		 *
		 * @param {Integer} iCount
		 * @returns {String}
		 */
		listTitle: function(iCount) {
			var oBundle = this.getResourceBundle();
			return (iCount < 0) ? oBundle.getText("xtit.products") : oBundle.getText("xtit.productMasterProducts", [iCount]);
		},

		/**
		 * Formatter for retrieving corresponding status codes for availability statuses.
		 * @param {Integer} iAvailabilityCode
		 * @returns {String}
		 */
		formatAvailabilityStatusFromCode: function(iAvailabilityCode) {
			switch (iAvailabilityCode) {
				case 1:
					return ValueState.Error;
				case 2:
					return ValueState.Warning;
				case 3:
					return ValueState.Success;
				default:
					return ValueState.None;
			}
		},

		/**
		 * Formatter for retrieving custom availability text.
		 *
		 * @param {String} sAvailabilityText - default availability text for the model
		 * @param {Integer} iAvailabilityCode - availability code (1 - out of stock, 2 - less than 10, 3 - in stock)
		 * @param {Integer} iAvailability - amount of items left in stock
		 * @returns {string}
		 */
		formatAvailabilityTextFromCode: function(sAvailabilityText, iAvailabilityCode, iAvailability) {
			if (iAvailabilityCode == 2 && iAvailability > 0) {
				return this.getResourceBundle().getText("xfld.inStockLeft", [iAvailability]);
			}
			return sAvailabilityText || "";
		},

		/**
		 * Formatter for images uri - return absolute uri related to the current entry point directory path.
		 *
		 * @param {String} sFileName
		 * @returns {string}
		 */
		formatImageUrl: function (sFileName) {
			return sFileName
				? getDemokitPath(sFileName) || sap.ui.require.toUrl("sap/ui/demoapps/rta/freestyle/localService/img") + '/' + sFileName
				: null;
		},

		/**
		 * Formatter for Measures - Returns concatenated string with Measure and Unit
		 *
		 * @param {float}
		 *            fMeasure A measure
		 * @param {string}
		 *            sUnit A unit
		 * @returns {string} A combined textual representation of measure and unit
		 * @public
		 */
		formatMeasure: function(fMeasure, sUnit) {
			if (!fMeasure || !sUnit) {
				return "";
			}
			return this.getResourceBundle().getText("xfld.formatMeasure", [fMeasure, sUnit]);
		}
	};
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/util/SmartLink", [
	"sap/ui/base/Object",
	"sap/ui/comp/navpopover/Factory"
], function(BaseObject, Factory) {
	"use strict";

	var Util = BaseObject.extend("sap.ui.demoapps.rta.freestyle.util.SmartLink",  {});

	Util.getServiceReal = Factory.getService.bind(Factory);

	var mSetting = {
		semanticObjectSupplierId: {
			links: [
				{
					action: "action_addtofavorites",
					intent: "#1",
					text: "Add to Favorites"
				}, {
					action: "action_gotoproducts",
					intent: "#2",
					text: "See other supplier products"
				}, {
					action: "action_gotoreviews",
					intent: "#3",
					text: "Check supplier reviews"
				}
			]
		}
	};

	function getURLParsingService() {
		return {
			parseShellHash(sIntent) {
				var sAction;
				for (var sSemanticObject in mSetting) {
					mSetting[sSemanticObject].links.some(function(oLink) { // eslint-disable-line no-loop-func
						if (oLink.intent === sIntent) {
							sAction = oLink.action;
							return true;
						}
					});
					if (sAction) {
						return {
							semanticObject: sSemanticObject,
							action: sAction
						};
					}
				}
				return {
					semanticObject: null,
					action: null
				};
			}
		};
	}

	function getNavigationService() {
		return {
			getHref(oTarget) {
				if (!oTarget || !oTarget.target || !oTarget.target.shellHash) {
					return Promise.resolve(null);
				}
				return Promise.resolve(oTarget.target.shellHash);
			},
			getSemanticObjects() {
				var aSemanticObjects = [];
				for (var sSemanticObject in mSetting) {
					aSemanticObjects.push(sSemanticObject);
				}
				return Promise.resolve(aSemanticObjects);
			},
			getLinks(aParams) {
				var aLinks = [];
				if (!Array.isArray(aParams)) {
					if (mSetting[aParams.semanticObject]) {
						aLinks = mSetting[aParams.semanticObject].links;
					} else {
						aLinks = [];
					}
				} else {
					aParams.forEach(function(aParams_) {
						var oParam = Array.isArray(aParams_) ? aParams_[0] : aParams_;

						if (mSetting[oParam.semanticObject]) {
							aLinks.push(mSetting[oParam.semanticObject].links);
						} else {
							aLinks.push([]);
						}
					});
				}
				return Promise.resolve(aLinks);
			},
			getPrimaryIntent: function(sSemanticObject) {
				let oLink = null;
				const aSemanticObjectLinks = mSetting[sSemanticObject]?.links;
				if (aSemanticObjectLinks === undefined) {
					return Promise.resolve(oLink);
				}

				let aLinks = aSemanticObjectLinks.filter((oSemanticObjectLink) => {
					return oSemanticObjectLink.tags?.includes("primaryAction");
				});

				if (aLinks.length === 0) {
					aLinks = aSemanticObjectLinks.filter((oSemanticObjectLink) => {
						return oSemanticObjectLink.action === "displayFactSheet";
					});
				}

				if (aLinks.length === 0) {
					return Promise.resolve(oLink);
				}

				oLink = aLinks.sort((oLink, oOtherLink) => {
					if (oLink.intent === oOtherLink.intent) {
						return 0;
					}

					return oLink.intent < oOtherLink.intent ? -1 : 1;
				})[0];

				return Promise.resolve(oLink);
			}
		};
	}

	Util.mockUShellServices = function() {
		Factory.getService = function(sServiceName, bAsync) {
			switch (sServiceName) {
				case "Navigation":
					return bAsync ? Promise.resolve(getNavigationService()) : getNavigationService();
				case "URLParsing":
					return bAsync ? Promise.resolve(getURLParsingService()) : getURLParsingService();
				default:
					return Util.getServiceReal(sServiceName, bAsync);
			}
		};
	};

	Util.unMockUShellServices = function() {
		Factory.getService = Util.getServiceReal;
	};

	return Util;
}, /* bExport= */true);
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/util/TableOperations", [
	"sap/ui/base/Object",
	"./TableOperationsImpl"
], function(Object, TableOpImp) {
	"use strict";

	return Object.extend("sap.ui.demoapps.rta.freestyle.util.TableOperations", {
		// This object provides functions to facilitate sorting, filtering, grouping and searching of tables.
		// The following features are provided:
		// - usage of SmartFilterBar filters (multi filter) together with simple sap.ui.model.Filter
		// - a fixed filter can be provided which (if present) is applied to all bindings.
		// - Sorting : It is ensured that setting a new sorter with "sort list" does not break a sorting
		//   that was previously set by "grouping". When the list is sorted or grouped the list of sorters that
		//   is applied to the binding is built by concatenating this.oGrouper and aSortList of this object
		//   into one array. Sorting and grouping is done with the following rules:
		//   1. selecting a sorter on the table adds the new sorter as the main sorter to all existing sorters
		//   2. if grouping and sorting are both set for the same attribute then the direction
		//   (ascending/descending) is aligned
		// - searching is done using filters (one filter per searchable column)
		// - all changes to the filtering and sorting of a table are collected and applied together when
		//  function applyTableOperations is called
		// The implementation of most functions is delegates to class TableOperationsImpl. The documentation of these
		// functions can be found in TableOperationsImpl.
		// TableOperationsImpl provides grouping, filtering and sorting functionality. It is not meant to be consumed
		// directly by apps. Instead interface classes like TableOperations are provided for consumption in apps..

		constructor: function(oTable, aSearchableFields, oDefaultSorter, oFixedFilter) {
			// Storage of the active grouping and sorting is private because
			// of their interdependency
			var oTableOpImp = new TableOpImp({
				oTable: oTable,
				aSearchableFields: aSearchableFields,
				oDefaultSorter: oDefaultSorter,
				oFixedFilter: oFixedFilter
			});

			this.addSorter = function(oSorter) {
				oTableOpImp.addSorter(oSorter);
			};

			this.setGrouping = function(oNewGrouper) {
				oTableOpImp.setGrouping(oNewGrouper);
			};

			this.removeGrouping = function() {
				oTableOpImp.removeGrouping();
			};

			this.getGrouping = function() {
				return oTableOpImp.getGrouping();
			};

			this.getSorter = function() {
				return oTableOpImp.getSorters();
			};

			this.addFilter = function(oFilter, sFilterAttribute) {
				oTableOpImp.addFilter(oFilter, sFilterAttribute);
			};

			this.getFilterTable = function() {
				return oTableOpImp.getFilterTable();
			};

			this.resetFilters = function() {
				oTableOpImp.resetFilters();
			};

			this.setSearchTerm = function(sNewSearchTerm) {
				oTableOpImp.setSearchTerm(sNewSearchTerm);
			};

			this.getSearchTerm = function() {
				return oTableOpImp.getSearchTerm();
			};

			this.addSFBFilters = function(oSFBFilters) {
				oTableOpImp.addSFBFilters(oSFBFilters);
			};

			this.applyTableOperations = function(bUseApplicationFilters) {
				oTableOpImp.applyTableOperations(bUseApplicationFilters);
			};
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/util/TableOperationsImpl", [
	"sap/ui/base/Object",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
], function(Object, Sorter, Filter, FilterOperator, FilterType) {
	"use strict";

	return Object.extend("sap.ui.demoapps.rta.freestyle.util.TableOperationsImpl", {
		// This object provides functions to facilitate sorting, filtering, grouping and searching of tables.
		// The following features are provided:
		// - usage of SmartFilterBar filters (multi filter) together with simple sap.ui.model.Filter
		// - Sorting : It is ensured that setting a new sorter with "sort list" does not break a sorting
		//   that was previously set by "grouping". When the list is sorted or grouped the list of sorters that
		//   is applied to the binding is built by concatenating this.oGrouper and aSortList of this object
		//   into one array. Sorting and grouping is done with the following rules:
		//   1. selecting a sorter on the table adds the new sorter as the main sorter to all existing sorters
		//   2. if grouping and sorting are both set for the same attribute then the direction
		//   (ascending/descending) is aligned
		// - searching is done using filters (one filter per searchable column)
		// - all changes to the filtering and sorting of a table are collected and applied together when
		//  function applyTableOperations is called
		// Please note that TableOperationsImpl is not meant to be consumed directly by apps.
		// Instead interface classes like TableOperationsV2 are provided for consumption in apps.

		constructor: function(oSettings) {
			// currently the following properties of oSettings are evaluated:
			// oTable - this is the table on which the operations are performed
			// aSearchableFields - array of column names in which searches are performed
			// oDefaultSorter - The default sorter (type sap.ui.model.Sorter). That is used for the initial sorting of the table
			this.sSearchTerm = ""; // contains the search term of the currently active search
			this.oGrouper = null; // currently active grouper of type  "sap.ui.model.Sorter",
			this.aSearchFilter = []; // contains the filters for the current search. There is one filter per searchable column
			this.aFilterList = []; // list of active filters (except for search filter)
			this.oFixedFilter = oSettings.oFixedFilter;
			this.bGroupingChanged = false; //indicator grouping changed since the last binding update
			this.bSearchChanged = false; //indicator search changed since the last binding update
			this.bFilterChanged = !!this.oFixedFilter; //indicator filter changed since the last binding update
			this.bSortChanged = true; //indicator sort changed since the last binding update
			this.aSortList = [oSettings.oDefaultSorter || new Sorter("Name", false)];
			// List of active sorters (excluding the grouping sorter). A default sorter can be provided
			// in the
			this.oTable = oSettings.oTable; //the table that is to be sorted, filtered, etc. taken from the import parameter
			this.oFilterDict = {}; // dictionary object containing one attribute for each column having at least one filter.
			// EachAttribute consists of two lists. One for the excluding filters (NE) and one for the
			// including filters (EQ, BT,...)
			this.aSearchableFields = oSettings.aSearchableFields || []; //List of searchable
			// columns - taken from the import parameter
		},

		addFilter: function(oFilter, sFilterAttribute) {
			// This function creates one list containing the filters for all attributes. In this list there is
			// one multiFilter for each attribute. The multiFilters contain two separate lists for including
			// and excluding filters. The including filters for one attribute are connect by the "or"
			// operator and the excluding filters are connect by the "and" operator. The two lists are connected
			// by the "and operator"
			if (oFilter && sFilterAttribute) {
				if (this.oFilterDict[sFilterAttribute]) {
					// there is already at least one filter for this attribute -> add the new filter to the
					// appropriate list depending on its filter operator
					// currently "not equal" is the only possible excluding filter operator
					if (oFilter.sOperator === FilterOperator.NE) {
						this.oFilterDict[sFilterAttribute].excludingFilters.push(oFilter);
					} else {
						this.oFilterDict[sFilterAttribute].includingFilters.push(oFilter);
					}
				} else {
					// there is no filter for this attribute yet -> add the new filter attribute to the dictionary
					this.oFilterDict[sFilterAttribute] = {
						includingFilters: [],
						excludingFilters: []
					};
					// currently "not equal" is the only possible excluding filter operator
					if (oFilter.sOperator === FilterOperator.NE) {
						this.oFilterDict[sFilterAttribute].excludingFilters = [oFilter];
					} else {
						this.oFilterDict[sFilterAttribute].includingFilters = [oFilter];
					}
				}
				// now merge the filters for all attributes into one list
				this.aFilterList.length = 0;
				for (var prop in this.oFilterDict) {
					if (this.oFilterDict.hasOwnProperty(prop)) {
						var aFilterListForProp = [];
						if (this.oFilterDict[prop].includingFilters.length > 0) {
							aFilterListForProp.push(new Filter(this.oFilterDict[prop].includingFilters, false));
						}
						if (this.oFilterDict[prop].excludingFilters.length > 0) {
							aFilterListForProp.push(new Filter(this.oFilterDict[prop].excludingFilters, true));
						}
						this.aFilterList.push(new Filter(aFilterListForProp, true));
					}
				}
				this.bFilterChanged = true;
			}
		},

		addSorter: function(oSorter) {
			// adds the new sorter as the new main sorter to the list of active sorters.
			// Delete any existing sorter for the path specified
			var i = this._getSortListIndexByPath(oSorter.sPath);
			if (i !== -1) {
				this.aSortList.splice(i, 1);
			}
			// The latest sorter is always the "main" sorter -> add it to the
			// beginning of the array
			this.aSortList.unshift(oSorter);
			// Copy the sort order of the new sorter to the grouper if they
			// refer to the same path
			if (this.oGrouper && this.oGrouper.sPath === oSorter.sPath) {
				this.oGrouper.bDescending = oSorter.bDescending;
			}
			this.bSortChanged = true;
		},

		addSFBFilters: function(oSFBFilters) {
			// This method evaluates the filter description of the smart filter bar and creates filter objects according to the description.
			// By calling function addFilter the smartFilterBar filters are added to the filter dictionary and to list of active filters.
			var sFilterOperation = "";
			for (var prop in oSFBFilters) {
				//make sure that only the public own properties ae used here
				if (!oSFBFilters.hasOwnProperty(prop) || prop.startsWith("_")) {
					continue;
				}
				//create the filter an add it to the active filters by calling addFilter
				if (oSFBFilters[prop].ranges) {
					for (var i = 0; i < oSFBFilters[prop].ranges.length; i++) {
						sFilterOperation = oSFBFilters[prop].ranges[i].operation;
						//when single values are excluded the operator needs to be switched to "not equal"
						sFilterOperation = (sFilterOperation === FilterOperator.EQ && oSFBFilters[prop].ranges[i].exclude) ? FilterOperator.NE :
							sFilterOperation;
						this.addFilter(new Filter(oSFBFilters[prop].ranges[i].keyField, sFilterOperation, oSFBFilters[prop].ranges[
								i].value1, oSFBFilters[prop].ranges[i].value2),
							oSFBFilters[prop].ranges[i].keyField);
					}
				}
				if (oSFBFilters[prop].items) {
					for (var j = 0; j < oSFBFilters[prop].items.length; j++) {
						this.addFilter(new Filter(prop, FilterOperator.EQ, oSFBFilters[prop].items[j].key),
							prop);
					}
				}
			}
		},

		applyTableOperations: function(bUseApplicationFilters) {
			// Here the binding of the table items is updated with the currently active sorters and filters.
			// It is assumed that all changes done by the user are immediately reflected in the table.
			// That means there is always just one change at a time.
			var aActiveSorters = [],
				aActiveFilters = this.oFixedFilter ? [this.oFixedFilter] : [],
				oTableBinding = this.oTable.getBinding("items"),
				sFilterType = bUseApplicationFilters ? FilterType.Application : FilterType.Control;

			if (oTableBinding) {
				if (this.bGroupingChanged || this.bSortChanged) {
					// The grouping or sorting of the table has changed. The sorting on the binding needs to be updated.
					// Note that the sorter of the grouping has to be the first one in the list of sorters that is added
					// to the binding
					if (this.oGrouper) {
						aActiveSorters.push(this.oGrouper);
					}
					if (this.aSortList.length > 0) {
						aActiveSorters = aActiveSorters.concat(this.aSortList);
					}
					oTableBinding.sort(aActiveSorters);
				}
				if (this.bSearchChanged || this.bFilterChanged) {
					//the filters that origin from entries in a sarch field and the ones that are set e.g. by a
					// filter bar need to be applied together.
					// Note that if the search is done in more than one column then the corresponding filters have
					// to be connected using "or". All other filters are connected using "and" logic.

					if (this.aSearchFilter.length > 0) {
						aActiveFilters.push(new Filter(this.aSearchFilter, false));
					}
					if (this.aFilterList.length > 0) {
						aActiveFilters.push(new Filter(this.aFilterList, true));
					}

					if (aActiveFilters.length > 0) {
						oTableBinding.filter(new Filter(aActiveFilters, true), sFilterType);
					} else {
						oTableBinding.filter([], sFilterType);
					}
				}
				this._resetChangeIndicators();
			}
		},

		getSearchFilters: function() {
			// Searching is done using filters. This function returns the list of filters which are used to perform a
			// search. During a search the list contains one filter per searchable column (the search filters are
			// created in function setSearchTerm)
			return this.aSearchFilter;
		},

		getSearchTerm: function() {
			// returns the currently active search term
			return this.sSearchTerm;
		},

		_getSortListIndexByPath: function(sPath) {
			// searches the list of active sorters for a sorter with the given path and returns the sorter's position
			// in the list (there can be only one) or -1 if no matching sorter was found
			var i;
			for (i = 0; i < this.aSortList.length; i++) {
				if (this.aSortList[i].sPath === sPath) {
					return i;
				}
			}
			return -1;
		},

		getGrouping: function() {
			// returns the the currently active grouping sorter
			return this.oGrouper;
		},

		getSorters: function() {
			// returns the list of currently active sorters (sorters for searches and for grouping are not part of this list)
			return this.aSortList;
		},

		getFilterTable: function() {
			// returns the list of currently active filters
			return (this.aFilterList && this.aFilterList.length > 0) ? this.aFilterList : null;
		},

		resetFilters: function() {
			// removes all active filters
			this.aFilterList.length = 0;
			this.oFilterDict = {};
			this.bFilterChanged = true;
		},

		removeGrouping: function() {
			// removes the active grouping sorter
			this.oGrouper = null;
			this.bGroupingChanged = true;
		},

		setGrouping: function(oNewGrouper) {
			// If there is already a sorter for the path specified, the sorting order
			// must be the same as in the new grouper
			var i = this._getSortListIndexByPath(oNewGrouper.sPath);
			if (i !== -1) {
				this.aSortList[i].bDescending = oNewGrouper.bDescending;
			}
			this.oGrouper = oNewGrouper;
			this.bGroupingChanged = true;
		},

		setSearchTerm: function(sNewSearchTerm) {
			// Searching may be done in more than one column - therefore a filter for
			// each of the searchable columns has to be created
			this.aSearchFilter.length = 0;
			if (sNewSearchTerm && sNewSearchTerm.length > 0) {
				this.sSearchTerm = sNewSearchTerm;
				for (var i = 0; i < this.aSearchableFields.length; i++) {
					this.aSearchFilter.push(new Filter(this.aSearchableFields[i], FilterOperator.Contains, sNewSearchTerm));
				}
			} else {
				//the search term is empty -> remove the search
				this.sSearchTerm = "";
				this.aSearchFilter.length = 0;
			}
			this.bSearchChanged = true;
		},

		_resetChangeIndicators: function() {
			// after all pending changes are executed the change indicators need to be reset.
			// this is done here
			this.bGroupingChanged = false;
			this.bSearchChanged = false;
			this.bFilterChanged = false;
			this.bSortChanged = false;
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/util/controls", [
	"sap/ui/Device",
	"sap/ui/core/syncStyleClass"
], function(Device, syncStyleClass) {
	"use strict";

	// class providing static utility methods for dealing with controls.

	// the density class that should be set according to the environment (may be "")
	var sContentDensityClass = (function() {
		var sCozyClass = "sapUiSizeCozy",
			sCompactClass = "sapUiSizeCompact";
		if (document.body.classList.contains(sCozyClass) || document.body.classList.contains(sCompactClass)) { // density class is already set by the FLP
			return "";
		} else {
			return Device.support.touch ? sCozyClass : sCompactClass;
		}
	}());

	return {
		// provide the density class that should be used according to the environment (may be "")
		getContentDensityClass: function() {
			return sContentDensityClass;
		},

		// defines a dependency from oControl to oView
		attachControlToView: function(oView, oControl) {
			syncStyleClass(sContentDensityClass, oView, oControl);
			oView.addDependent(oControl);
		}
	};
});
sap.ui.predefine("sap/ui/demoapps/rta/freestyle/util/messages", [
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"./controls"
], function(MessageBox, JSONModel, controls) {
	"use strict";

	function extractErrorMessageFromDetails(sDetails) {
		if (sDetails && sDetails.startsWith("{\"error\":")) {
			var oErrModel = new JSONModel();
			oErrModel.setJSON(sDetails);
			return oErrModel.getProperty("/error/message/value") || "Error";
		}
	}

	function parseError(oParameter) {
		var oParameters = null,
			oResponse = null,
			oError = {};

		// "getParameters": for the case of catching oDataModel "requestFailed" event
		oParameters = oParameter.getParameters ? oParameter.getParameters() : null;
		// "oParameters.response": V2 interface, response object is under the getParameters()
		// "oParameters": V1 interface, response is directly in the getParameters()
		// "oParameter" for the case of catching request "onError" event
		oResponse = oParameters ? (oParameters.response || oParameters) : oParameter;
		oError.sDetails = oResponse.responseText || oResponse.body || (oResponse.response && oResponse.response.body) || ""; //"onError" Event: V1 uses response and response.body
		oError.sMessage = extractErrorMessageFromDetails(oError.sDetails) || oResponse.message || (oParameters && oParameters.message);
		return oError;
	}

	return {
		// Show an error dialog with information from the oData response object.
		// oParameter - The object containing error information
		showErrorMessage: function(oParameter, fnOnClose) {
			var oErrorDetails = parseError(oParameter);

			//TODO: get correct text from i18n
				// oBundle = sap.ui.getCore().getLibraryResourceBundle("nw.epm.refapps.lib.reuse");
			MessageBox.show(oErrorDetails.sMessage, {
				icon: MessageBox.Icon.ERROR,
				title: '%Placeholder%',//oBundle.getText("xtit.error"),
				details: oErrorDetails.sDetails,
				actions: MessageBox.Action.CLOSE,
				onClose: fnOnClose,
				styleClass: controls.getContentDensityClass()
			});
		},

		getErrorContent: function(oParameter) {
			return parseError(oParameter).sMessage;
		},

		getErrorDetails: function(oParameter) {
			return parseError(oParameter).sDetails;
		},

		extractErrorMessageFromDetails: function(sDetails) {
			return extractErrorMessageFromDetails(sDetails);
		}
	};
});
sap.ui.require.preload({
	"sap/ui/demoapps/rta/freestyle/i18n/i18n_en.properties":'\ncustomFieldLabel=Deals With\ncustomFieldValue=IT Equipment (Generic Field)\n\n#XTIT\nshellTitle=Manage Products\n#XTIT: Shell subtitle\nshellSubTitle=SAP Fiori Reference App\n\n#XTIT: Title of the Product Details screen\nxtit.product=Product\n#XTIT: Product Discription\nxtit.productdiscription=Product Discription\n#XTIT: Title of the Edit Product screen\nxtit.productEdit=Edit Product\n#XTIT: Title for a New Product if not yet maintained\nxtit.productNew=New Product\n#XTIT: Title for a Draft Product if not yet maintained\nxtit.unnamedProduct=Unnamed Product\n#XBUT: Cancel button\nxbut.cancel=Cancel\n#XBUT: Delete button\nxbut.delete=Delete\n#XBUT: Copy button\nxbut.copy=Copy\n#XTIT: Title of Product Overview pane\nxtit.productMasterProducts=Products ({0})\n#XTIT: Title of Product Overview pane\nxtit.products=Products\n#XTIT: Title of product information tab (Upper Case!)\nxtit.prodInfoTab=PRODUCT INFORMATION\n#XTIT: Title of product chart tab (Upper Case!)\nxtit.prodChartTab=SALES DATA\n#XTIT: Title of General Information area\nxtit.generalInfo=General Information\n#XTIT: Title of Technical Data area\nxtit.techData=Technical Data\n#XTIT: Title of info toolbar for filters with one criteria\nxtit.filterBy=Filtered by {0}\n#XTIT: Title of info toolbar for filters with two criteria\nxtit.filterBy2=Filtered by {0} and {1}\n#XTIT: Title of info toolbar for filters with three criteria\nxtit.filterBy3=Filtered by: {0}, {1} and {2}\n#XFLD: Label for reviews\nxfld.reviews=Reviews\n#XFLD: Label for in-stock availability\nxfld.instock=In Stock\n#XFLD: Label for out-of-stock availability\nxfld.outstock=Out of Stock\n#XFLD: Label for limited stock availability\nxfld.restricted10=Less than 10 Left\n#XFLD: Sort, group, and filter by price option\nxfld.price=Price\n#XFLD: Sort, group, and filter by availability option\nxfld.availability=Availability\n#XFLD: Filter by Edit Stats\nxfld.editingStatus=Editing Status\n#XFLD: Filter by Drafts\nxfld.editingDraft=Own Draft\n#XFLD: Filter by Locked\nxfld.editingLocked=Locked by Another User\n#XFLD: Filter by unsaved changes\nxfld.editingUnsavedChanges=Unsaved Changes by Another User\n#XFLD: Filter by neither Draft nor Locked, Only Active\nxfld.editingActive=Unchanged\n#XFLD: Text for grouping by category\nxfld.groupingLabel={0}\\: {1}\n#XFLD: Date dimension selector text for half year\nxfld.dateHalfYear=6 Months\n#XFLD: Date dimension selector text for one year\nxfld.dateOneYear=1 Year\n#XFLD: Date axis\nxfld.dateAxis=Month\n#XFLD: Amount axis\nxfld.amountAxis=Revenue\n#XTIT: Chart title\nxtit.chartTitle=Revenue History (in {0})\n#XTIT: Bar Chart\nxtit.barChart=Bar Chart\n#XTIT: Line Chart\nxtit.lineChart=Line Chart\n#XFLD: Text for Locked Items in Detail\nxfld.locked=Locked by {0}\n#XFLD: Formatter for price, showing amount and curency\nxfld.amount={0} {1}\n#XLFD: Concatenate value and unit\nxfld.textConcat={0} / {1}\n#XFLD: Undefined Availibility for new draft\nxfld.undefinedAvail=Availibility: Not Defined\n#XTIT: Title of confirmation dialog\nxtit.unsavedChanges=Unsaved Changes\n#YMSG: Ask if the user wants to continue editing the product\nymsg.editDraft=We saved a draft for your changes to product "{0}" on {1}.\\n\\nDo you want to resume editing or discard your changes?\n#YMSG: Ask if the user wants to continue editing a new product\nymsg.editNewDraft=We saved a draft of your new product on {0}.\\n\\nDo you want to resume editing or discard your changes?\n#XBUT: Resume button\nxbut.resume=Resume\n#XBUT: Discard button\nxbut.discard=Discard\n#YMSG: Message Toast on Edit Draft Deletion\nymsg.draftEditDiscarded=Changes discarded\n#YMSG: Message Toast on Edit Draft Deletion\nymsg.draftCreateDiscarded=Draft discarded\n#YMSG: Message Toast on Product Deletion\nymsg.deleteProduct=The product "{0}" has been deleted.\n#XBUT: Adapt the UI with Runtime Adaptation\nxbut.adaptui=Adapt UI\n\n#XTIT: Title of confirmation dialog\nxtit.delete=Delete\n#XBUT: User needs to react (positively) to confirm deletion\nxbut.ok=OK\n#YMSG: Message text for deletion of one product\nymsg.deleteText=Delete product {0}?\n#YMSG: Message text for deletion of one productm with unsaved changes\nymsg.deleteUnsavedText=Another user edited this product without saving the changes\\: {0}. Delete anyway?\n#YMSG: Message text for active items to be deleted, but no unsaved chnanges or locked seleted\nymsg.deleteRemaing=Do you still want to delete the remaing {0} products?\n#YMSG: Error message for unsuccessful deletion of more than one product\nymsg.deleteNProductsFailed={0} products cannot be deleted.\n#XTIT: Title of the Warning message box\nxtit.warning=Warning\n#XTIT: Title of the Error message box\nxtit.error=Error\n#YMSG: Confirmation of saving of product item\nymsg.saveText=Your changes to \\u0022{0}\\u0022 have been saved.\n#YMSG: Saving of product item was unsuccessful\nymsg.saveError=Your changes to \\u0022{0}\\u0022 have not been saved.\n#XFLD: Text for Grouping: Price between\nxfld.groupPriceBetween=Price\\: {0}\n#XFLD: Text for Grouping: Price greater\nxfld.groupPrice=Price\\: Over {0}\n#XTOL: Tooltip for the search field\nxtol.masterSearchTooltip=Search\n#XTOL: Tooltip for the clear button in search field\nxtol.refreshButtonTooltip=Clear\n\n\n#XTIT: Title of the Supplier Card\nxtit.supplier=Supplier\n#XTIT: Title of the Supplier Company Information\nxtit.supplierCompanyInformation=Company Information\n#XTIT: Title of the Supplier Contact Person\nxtit.supplierContactPerson=Contact Person\n#XTIT: Subject field of email\nxtit.emailSubject=Product: {0}\n#XTIT: Content field of email\nxtit.emailContent=Product ID: {0}\\nDescription: {1}\\nSupplier: {2}\n\n#YMSG: Item is not available\nymsg.productNotAvailable=This product is no longer available.\n\n#YMSG: Draft is not available\nymsg.draftNotAvailable=This draft is no longer available or belongs to another user.\n\n#YMSG: Explanation of why locked products could not be deleted\nymsg.lockedProducts={0} products cannot be deleted. They are currenty locked by other users.\n#YMSG: Message text for one locked product (delete case)\nymsg.lockedForDelete=Product {0} cannot be deleted. It is currently locked by {1}.\n\n#YMSG: No products are available\nymsg.noData=No products are currently available.\n#YMSG: No products are available after search\nymsg.noDataAfterSearch=No matching products found\n\n#YMSG: Message for "Page not found" screen\nymsg.pageNotFound=Please check your URL and try again\n\n#YMSG: Text for Cancel Popover in EDIT screen\nymsg.cancelEdit=Cancel editing and discard all changes?\n#YMSG: Text for Cancel Popover in Create EDIT screen\nymsg.cancelCreate=Cancel editing and discard this draft?\n#YMSG: Confirmation that a user want to takeover editing a product\nymsg.takeoverUnsavedChanges=Another user edited this product without saving the changes: {0}. If you take over, those changes will be lost.\n\n#YMSG: Success message after activation\nymsg.saveSuccess=Product {0} was saved successfully\n\n#XSEL: Status Draft in Product List\nxsel.draft=Draft\n#XSEL: Status for Unsaved Changes (i.e. Draft where the lock has expired)\nxsel.unsavedChanges=Unsaved Changes\n\n#XFLD: Keyword for FLP tile configuration\nxfld.keyWord1=Manage Products\n#XFLD: Keyword for FLP tile configuration\nxfld.keyWord2=Products\n#XFLD: Keyword for FLP tile configuration\nxfld.keyWord3=Draft\n\n#XFLD Label for Screen Reader only (Aria)\nxfld.length=Length Unit\n#XFLD Label for Screen Reader only (Aria)\nxfld.width=Width Unit\n#XFLD Label for Screen Reader only (Aria)\nxfld.height=Height Unit\n#XFLD Label for Screen Reader only (Aria)\nxfld.timeRange=Time Range\n\n#XTOL tooltip for product image\nxtol.productImage=Product Image\n\n\n# Supplier card\n#XTIT\nxtit.contactDetails=Contact Details\n#XTIT\nxtit.mainContact=Main Contact\n\n\n#XFLD: Label for In Stock availability\nxfld.inStock=In Stock\n#XFLD: Label for Out of Stock availability\nxfld.outOfStock=Out of Stock\n#XFLD: Label for restricted Stock availability\nxfld.inStockLeft=In Stock ({0} Left)\n\n\n#XFLD: Formatter for Value{0} and Unit {1}\nxfld.formatMeasure={0} {1}\n\n#XTIT: Title of the Library\nxtit.lib=SAP Fiori Library for Reference Apps\n#YDES: Description of the Library\nydes.lib=The "SAP Fiori Library for Reference Apps" contains functions that are used across different reference applications, and shows best practices for SAP Fiori libraries.\n\n',
	"sap/ui/demoapps/rta/freestyle/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ui.demoapps.rta.freestyle","type":"application","resources":"resources.json","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":["en"],"fallbackLocale":"en"},"title":"{{shellTitle}}","subTitle":"{{shellSubTitle}}","applicationVersion":{"version":"1.132.1"},"ach":"CA-UI5-FL-RTA","dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/SEPMRA_PROD_MAN/","type":"OData","settings":{"annotations":["mainAnnotations"],"odataVersion":"2.0","localUri":"localService/metadata.xml"}},"mainAnnotations":{"uri":"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName=\'SEPMRA_PROD_MAN_ANNO_MDL\',Version=\'0001\')/$value/","type":"ODataAnnotation","settings":{"localUri":"localService/annotations.xml"}}},"sourceTemplate":{"id":"sap.ui.ui5-template-plugin.2masterdetail","version":"1.32.0"},"crossNavigation":{"inbounds":{"productsManage":{"semanticObject":"EPMProduct","action":"manage","title":"{{shellTitle}}","subTitle":"{{shellSubTitle}}","icon":"sap-icon://Fiori6/F0865","indicatorDataSource":{"dataSource":"mainService","path":"SEPMRA_C_PD_Product/$count","refresh":450},"signature":{"parameters":{"Product":{"required":false}},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori6/F0865","favIcon":"icon/F0865_Manage_Products.ico","phone":"icon/launchicon/57_iPhone_Desktop_Launch.png","phone@2":"icon/launchicon/114_iPhone-Retina_Web_Clip.png","tablet":"icon/launchicon/72_iPad_Desktop_Launch.png","tablet@2":"icon/launchicon/144_iPad_Retina_Web_Clip.png"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal","sap_belize"]},"sap.ui5":{"_version":"1.2.0","flexEnabled":true,"rootView":{"viewName":"sap.ui.demoapps.rta.freestyle.view.Root","type":"XML","async":true,"id":"app"},"handleValidation":true,"dependencies":{"minUI5Version":"1.97.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.uxap":{},"sap.ui.rta":{}}},"resources":{"css":[{"uri":"./control/RatingAndCount.css"}]},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties","async":true,"settings":{"supportedLocales":["en"],"fallbackLocale":"en"}}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"sap.ui.demoapps.rta.freestyle.view","controlId":"idAppControl","controlAggregation":"detailPages","bypassed":{"target":["master","empty"]}},"routes":[{"pattern":"","name":"master","target":["master","detail"]},{"pattern":"product/{productId}","name":"display","target":["master","detail"]},{"pattern":"editProduct/{productId}/{DraftUUID}","name":"edit","target":["master","edit"]},{"pattern":"editProduct/{DraftUUID}","name":"create","target":["master","edit"]}],"targets":{"master":{"viewName":"ProductMaster","viewId":"ProductMaster","viewLevel":1,"controlAggregation":"masterPages","title":"{i18n>xtit.productEdit}"},"detail":{"viewName":"ProductDetail","viewId":"ProductDetail","viewLevel":2,"title":"{i18n>xtit.product}"},"edit":{"viewName":"ProductEdit","viewId":"ProductEdit","viewLevel":2,"title":"{i18n>xtit.productEdit}"},"empty":{"viewName":"EmptyPage","viewId":"EmptyPage","title":"{i18n>xtit.product}"}}}},"sap.platform.abap":{"_version":"1.2.0","uri":"/sap/bc/ui5_ui5/sap/EPM_REF_PRODMAN"},"sap.platform.hcp":{"_version":"1.1.0","uri":""},"sap.fiori":{"_version":"1.1.0","registrationIds":["F8285"],"archeType":"transactional"}}',
	"sap/ui/demoapps/rta/freestyle/view/EmptyPage.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" height="100%" controllerName="sap.ui.demoapps.rta.freestyle.controller.EmptyPage"><MessagePage\n\t\tid="messagePage"\n\t\tshowNavButton="{device>/system/phone}"\n\t\tnavButtonPress="onNavBack"\n\t\ttext="{appProperties>/emptyText}"\n\t\tdescription=""/></mvc:View>\n',
	"sap/ui/demoapps/rta/freestyle/view/ProductDetail.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demoapps.rta.freestyle.controller.ProductDetail"\n\txmlns:m="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:semantic="sap.m.semantic"\n\txmlns:layout="sap.ui.layout"\n\txmlns:sap.ui.dt="sap.ui.dt"\n\txmlns="sap.uxap"><semantic:DetailPage\n\t\tid="page"\n\t\tnavButtonPress="onNavBack"\n\t\tshowNavButton="{device>/system/phone}"\n\t\ttitle="{i18n>xtit.product}"\n\t\tbusy="{= !(${displayView>/dataLoaded} || ${displayView>/showsMessage}) }"\n\t\tbusyIndicatorDelay="{= ${appProperties>/detailImmediateBusy} ? 0 : ${displayView>/originalBusyDelay} }"><semantic:customHeaderContent><m:Button id="adaptationMode" text="{i18n>xbut.adaptui}" visible="{app>/showAdaptButton}" press="switchToAdaptionMode" sap.ui.dt:designtime="not-adaptable" /></semantic:customHeaderContent><semantic:content><ObjectPageLayout id="ProductDetailLayout" flexEnabled="true"><headerTitle><ObjectPageHeader\n\t\t\t\t\t\tid="DetailHeader"\n\t\t\t\t\t\tobjectTitle="{to_ProductTextInOriginalLang/Name}"\n\t\t\t\t\t\tobjectSubtitle="{Product}"></ObjectPageHeader></headerTitle><headerContent><layout:VerticalLayout\n\t\t\t\t\t\tid="DetailHeaderContent"\n\t\t\t\t\t\twidth="calc(100% - 2rem)"><m:FlexBox\n\t\t\t\t\t\t\tid="headerLine"\n\t\t\t\t\t\t\tfitContainer="true"\n\t\t\t\t\t\t\trenderType="Bare"\n\t\t\t\t\t\t\twrap="Wrap"><m:items><layout:VerticalLayout id="headerImage" class="sapUiSmallMarginEnd sapUiSmallMarginBottom"><layout:layoutData><m:FlexItemData growFactor="1" minWidth="116px"/></layout:layoutData><m:Image\n\t\t\t\t\t\t\t\t\t\tsrc="{path: \'ProductPictureURL\', formatter: \'.formatter.formatImageUrl\'}"\n\t\t\t\t\t\t\t\t\t\tid="productImage"\n\t\t\t\t\t\t\t\t\t\tdensityAware="false"\n\t\t\t\t\t\t\t\t\t\twidth="6rem"\n\t\t\t\t\t\t\t\t\t\tpress="onImagePressed"></m:Image></layout:VerticalLayout><layout:VerticalLayout id="headerCategoryBlock" class="sapUiSmallMarginEnd sapUiSmallMarginBottom"><layout:layoutData><m:FlexItemData growFactor="10" minWidth="250px"/></layout:layoutData><m:ObjectStatus id="headerMainCategory" title="{/#SEPMRA_I_ProductMainCategoryType/MainProductCategory/@sap:label}" text="{to_ProductCategory/MainProductCategory}"/><m:ObjectStatus id="headerProductCategory" title="{/#SEPMRA_C_PD_ProductType/ProductCategory/@sap:label}" text="{to_ProductCategory/ProductCategory}"/><m:ObjectStatus id="headerSupplierName" title="{/#SEPMRA_C_PD_Supplier/CompanyName/@sap:label}" text="{to_Supplier/CompanyName}"/></layout:VerticalLayout><layout:VerticalLayout id="headerPriceBlock" class="sapUiSmallMarginEnd"><layout:layoutData><m:FlexItemData minWidth="150px" maxWidth="150px"/></layout:layoutData><m:ObjectNumber id="headerPrice" number="{parts: [ {path: \'Price\'}, {path: \'Currency\'}], type : \'sap.ui.model.type.Currency\', formatOptions: { showMeasure: false } }" unit="{Currency}" class="sapUiSmallMarginBottom" /><m:ObjectStatus\n\t\t\t\t\t\t\t\t\t\tid="headerAvailability"\n\t\t\t\t\t\t\t\t\t\ttext="{parts: [\n\t\t\t\t\t\t\t\t\t\t\t\t{path: \'to_ProductStock/to_StockAvailability/StockAvailability_Text\'},\n\t\t\t\t\t\t\t\t\t\t\t\t{path: \'to_ProductStock/StockAvailability\'},\n\t\t\t\t\t\t\t\t\t\t\t\t{path: \'to_ProductStock/Quantity\', type: \'sap.ui.model.odata.type.Decimal\', formatOptions: {style: \'short\'} }\n\t\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\t\tformatter: \'.formatter.formatAvailabilityTextFromCode\'}"\n\t\t\t\t\t\t\t\t\t\tstate="{path: \'to_ProductStock/StockAvailability\', formatter: \'.formatter.formatAvailabilityStatusFromCode\'}"/></layout:VerticalLayout></m:items></m:FlexBox></layout:VerticalLayout></headerContent><sections><ObjectPageSection id="ObjectSectionGeneral" title="{i18n>xtit.generalInfo}"><subSections><ObjectPageSubSection id="SubSectionGeneral" title="{i18n>xtit.generalInfo}" mode="Expanded"><blocks><mvc:XMLView async="true" id="GeneralForm" viewName="sap.ui.demoapps.rta.freestyle.view.form.ProductGeneral"/></blocks></ObjectPageSubSection></subSections></ObjectPageSection><ObjectPageSection id="ObjectSectionTechnical" title="{i18n>xtit.techData}" visible="false"><subSections><ObjectPageSubSection id="SubSectionTechnical" title="{i18n>xtit.techData}" mode="Expanded"><blocks><mvc:XMLView async="true" id="TechnicalForm" viewName="sap.ui.demoapps.rta.freestyle.view.form.ProductTechnical"/></blocks></ObjectPageSubSection></subSections></ObjectPageSection><ObjectPageSection id="ObjectSectionSupplier" title="{i18n>xtit.supplier}"><subSections><ObjectPageSubSection id="SubSectionSupplier" mode="Expanded" title="{i18n>xtit.supplier}"><blocks><mvc:XMLView async="true" id="SupplierForm" viewName="sap.ui.demoapps.rta.freestyle.view.form.ProductSupplier"/></blocks></ObjectPageSubSection></subSections></ObjectPageSection></sections></ObjectPageLayout></semantic:content><semantic:editAction><semantic:EditAction id="edit" press="onEdit"/></semantic:editAction><semantic:deleteAction><semantic:DeleteAction id="delete" press="onDelete"/></semantic:deleteAction><semantic:customFooterContent><m:Button id="copyButton" text="{i18n>xbut.copy}" press="onCopy"/></semantic:customFooterContent><semantic:sendEmailAction><semantic:SendEmailAction id="shareEmail" press="sendEmail"/></semantic:sendEmailAction></semantic:DetailPage></mvc:View>\n',
	"sap/ui/demoapps/rta/freestyle/view/ProductEdit.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demoapps.rta.freestyle.controller.ProductEdit"\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:semantic="sap.m.semantic"\n\txmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:smart="sap.ui.comp.smartfield"\n\txmlns:footerbar="sap.ushell.ui.footerbar"><semantic:DetailPage id="page" navButtonPress="onNavBack" showNavButton="{device>/system/phone}"\n\t\ttitle="{= ${appProperties>/productId} ? ${i18n>xtit.productEdit} : ${i18n>xtit.productNew} }"><semantic:content><f:SimpleForm class="sapUiForceWidthAuto sapUiResponsiveMargin" maxContainerCols="2" editable="true"\n\t\t\t\tlayout="ResponsiveGridLayout" labelSpanL="4" labelSpanM="4" emptySpanL="1" emptySpanM="1" columnsL="7" columnsM="7" id="simp1"\n\t\t\t\ttitle="{i18n>xtit.generalInfo}"><f:content><Label id="productTextLabel" text="{/#SEPMRA_C_PD_ProductType/to_ProductTextInOriginalLang/Name/@sap:label}" required="true"\n\t\t\t\t\t\tlabelFor="productNameInput"/><Input id="productNameInput" type="Text" editable="{editView>/dataLoaded}" change="onInputChange"\n\t\t\t\t\t\tmaxLength="{path: \'/#SEPMRA_C_PD_ProductType/to_ProductTextInOriginalLang/Name/@maxLength\', formatter: \'Number\'}"\n\t\t\t\t\t\tvalue="{to_ProductTextInOriginalLang/Name}"/><Label id="priceLabel"\n\t\t\t\t\t\ttext="{parts:[{path: \'i18n>xfld.textConcat\'}, {path: \'/#SEPMRA_C_PD_ProductType/Price/@sap:label\'}, {path: \'/#I_CurrencyType/Currency/@sap:label\'}], formatter: \'jQuery.sap.formatMessage\'}"\n\t\t\t\t\t\trequired="true" labelFor="price"/><Input id="price" editable="{editView>/dataLoaded}" change="onNumberChange"\n\t\t\t\t\t\tvalue="{parts: [ {path: \'Price\'}, {path: \'Currency\'}], type : \'sap.ui.model.type.Currency\', formatOptions: { parseAsString: true, showMeasure: false } }"\n\t\t\t\t\t\ttype="Text" textAlign="Right"/><ComboBox id="currency" ariaLabelledBy="currencyLabel" selectedKey="{Currency}"\n\t\t\t\t\t\teditable="{= ${editView>/dataLoaded} &amp;&amp; ${editView>/openItemsRequest} === 0 }" change="onInputChange"\n\t\t\t\t\t\titems="{path: \'/I_Currency\', length: \'300\', events: { dataRequested: \'.onItemsRequested\', dataReceived: \'.onItemsReceived\' } }"><core:Item id="currencyItem" key="{Currency}" text="{Currency}"/></ComboBox><Label id="mainCategoryLabel" text="{/#SEPMRA_I_ProductMainCategoryType/MainProductCategory/@sap:label}" required="true" labelFor="category"/><ComboBox id="category" editable="{= ${editView>/dataLoaded} &amp;&amp; ${editView>/openItemsRequest} === 0 }"\n\t\t\t\t\t\tselectionChange="onCategoryChange" selectedKey="{path: \'to_ProductCategory/MainProductCategory\', mode: \'OneWay\'}"\n\t\t\t\t\t\titems="{path: \'/SEPMRA_I_ProductMainCategory\', events: { dataRequested: \'.onItemsRequested\', dataReceived: \'.onItemsReceived\' } }"><core:Item id="maincategoryItem" key="{MainProductCategory}" text="{MainProductCategory}"/></ComboBox><Label id="productIdLabel" text="{/#SEPMRA_C_PD_ProductType/ProductForEdit/@sap:label}" labelFor="productId"/><Input id="productId" editable="false" value="{ProductForEdit}"/><Label id="descriptionIdLabel" text="{/#SEPMRA_C_PD_ProductTextType/Description/@sap:label}" required="true" labelFor="description"/><TextArea id="description" maxLength="{path: \'/#SEPMRA_C_PD_ProductTextType/Description/@maxLength\', formatter: \'Number\'}"\n\t\t\t\t\t\teditable="{editView>/dataLoaded}" change="onInputChange" value="{to_ProductTextInOriginalLang/Description}"/></f:content></f:SimpleForm><f:SimpleForm class="sapUiForceWidthAuto sapUiResponsiveMargin" maxContainerCols="2" editable="true"\n\t\t\t\tlayout="ResponsiveGridLayout" id="simp2" labelSpanL="4" labelSpanM="4" emptySpanL="1" emptySpanM="1" columnsL="7" columnsM="7"\n\t\t\t\ttitle="{i18n>xtit.techData}"><f:content><Label id="baseUnitLabel" text="{/#SEPMRA_C_PD_ProductType/ProductBaseUnit/@sap:label}" required="true" labelFor="unitOfMeasure"/><ComboBox id="unitOfMeasure" selectedKey="{ProductBaseUnit}"\n\t\t\t\t\t\teditable="{= ${editView>/dataLoaded} &amp;&amp; ${editView>/openItemsRequest} === 0 }" change="onInputChange"\n\t\t\t\t\t\titems="{path: \'/SEPMRA_I_QuantityUnit\', sorter: {path: \'UnitOfMeasure_Text\', descending: false}, events: { dataRequested: \'.onItemsRequested\', dataReceived: \'.onItemsReceived\' } }"><core:Item id="baseUnitItem" key="{UnitOfMeasure}" text="{UnitOfMeasure_Text}"/></ComboBox><Label id="heightLabel"\n\t\t\t\t\t\ttext="{parts:[{path: \'i18n>xfld.textConcat\'}, {path: \'/#SEPMRA_C_PD_ProductType/Height/@sap:label\'}, {path: \'/#SEPMRA_C_PD_ProductType/DimensionUnit/@sap:label\'}], formatter: \'jQuery.sap.formatMessage\'}"\n\t\t\t\t\t\tlabelFor="height"/><Input id="height" type="Text" editable="{editView>/dataLoaded}" change="onNumberChange" textAlign="Right"\n\t\t\t\t\t\tvalue="{path : \'Height\', type : \'sap.ui.model.type.Float\', constraints : { minimum: 0, maximum: 9999999999 }, formatOptions: { parseAsString: true, maxIntegerDigits: 10, maxFractionDigits: 3 } }"/><Select id="height_uom" ariaLabelledBy="ariaHeightLabel" selectedKey="{DimensionUnit}"\n\t\t\t\t\t\tenabled="{= ${editView>/dataLoaded} &amp;&amp; ${editView>/openItemsRequest} === 0 }" change="onInputChange"\n\t\t\t\t\t\titems="{path: \'/SEPMRA_I_DimensionUnit\', sorter: {path: \'UnitOfMeasure_Text\', descending: false}, events: { dataRequested: \'.onItemsRequested\', dataReceived: \'.onItemsReceived\' } }"><core:Item id="heightnitItem" key="{UnitOfMeasure}" text="{UnitOfMeasure_Text}"/></Select><Label id="widthLabel"\n\t\t\t\t\t\ttext="{parts:[{path: \'i18n>xfld.textConcat\'}, {path: \'/#SEPMRA_C_PD_ProductType/Width/@sap:label\'}, {path: \'/#SEPMRA_C_PD_ProductType/DimensionUnit/@sap:label\'}], formatter: \'jQuery.sap.formatMessage\'}"\n\t\t\t\t\t\tlabelFor="width"/><Input id="width" type="Text" editable="{editView>/dataLoaded}" change="onNumberChange" textAlign="Right"\n\t\t\t\t\t\tvalue="{path : \'Width\', type : \'sap.ui.model.type.Float\', constraints : { minimum: 0, maximum: 9999999999 }, formatOptions: { parseAsString: true, maxIntegerDigits: 10, maxFractionDigits: 3 } }"/><Select id="width_uom" ariaLabelledBy="ariaWidthLabel" selectedKey="{DimensionUnit}"\n\t\t\t\t\t\tenabled="{= ${editView>/dataLoaded} &amp;&amp; ${editView>/openItemsRequest} === 0 }" change="onInputChange"\n\t\t\t\t\t\titems="{path: \'/SEPMRA_I_DimensionUnit\', sorter: {path: \'UnitOfMeasure_Text\', descending: false}, events: { dataRequested: \'.onItemsRequested\', dataReceived: \'.onItemsReceived\' } }"><core:Item id="widthUnitItem" key="{UnitOfMeasure}" text="{UnitOfMeasure_Text}"/></Select><Label id="lengthLabel"\n\t\t\t\t\t\ttext="{parts:[{path: \'i18n>xfld.textConcat\'}, {path: \'/#SEPMRA_C_PD_ProductType/Depth/@sap:label\'}, {path: \'/#SEPMRA_C_PD_ProductType/DimensionUnit/@sap:label\'}], formatter: \'jQuery.sap.formatMessage\'}"\n\t\t\t\t\t\tlabelFor="length"/><Input id="length" type="Text" editable="{editView>/dataLoaded}" change="onNumberChange" textAlign="Right"\n\t\t\t\t\t\tvalue="{path : \'Depth\', type : \'sap.ui.model.type.Float\', constraints : { minimum: 0, maximum: 9999999999 }, formatOptions: { parseAsString: true, maxIntegerDigits: 10, maxFractionDigits: 3 } }"/><Select id="length_uom" ariaLabelledBy="ariaLengthLabel" selectedKey="{DimensionUnit}"\n\t\t\t\t\t\tenabled="{= ${editView>/dataLoaded} &amp;&amp; ${editView>/openItemsRequest} === 0 }" change="onInputChange"\n\t\t\t\t\t\titems="{path: \'/SEPMRA_I_DimensionUnit\', sorter: {path: \'UnitOfMeasure_Text\', descending: false}, events: { dataRequested: \'.onItemsRequested\', dataReceived: \'.onItemsReceived\' } }"><core:Item id="lengthUnitItem" key="{UnitOfMeasure}" text="{UnitOfMeasure_Text}"/></Select><Label id="weightLabel"\n\t\t\t\t\t\ttext="{parts:[{path: \'i18n>xfld.textConcat\'}, {path: \'/#SEPMRA_C_PD_ProductType/Weight/@sap:label\'}, {path: \'/#SEPMRA_C_PD_ProductType/WeightUnit/@sap:label\'}], formatter: \'jQuery.sap.formatMessage\'}"\n\t\t\t\t\t\tlabelFor="weight"/><Input id="weight" textAlign="Right" editable="{editView>/dataLoaded}" change="onNumberChange" type="Text"\n\t\t\t\t\t\tvalue="{path : \'Weight\', type : \'sap.ui.model.type.Float\', constraints : { minimum: 0, maximum: 9999999999 }, formatOptions: { parseAsString: true, maxIntegerDigits: 10, maxFractionDigits: 3 } }"/><Select id="weight_uom" ariaLabelledBy="ariaWeightLabel" selectedKey="{WeightUnit}"\n\t\t\t\t\t\tenabled="{= ${editView>/dataLoaded} &amp;&amp; ${editView>/openItemsRequest} === 0 }" change="onInputChange"\n\t\t\t\t\t\titems="{path: \'/SEPMRA_I_WeightUnit\', sorter: {path: \'UnitOfMeasure_Text\', descending: false}, events: { dataRequested: \'.onItemsRequested\', dataReceived: \'.onItemsReceived\' } }"><core:Item id="weightUnitItem" key="{UnitOfMeasure}" text="{UnitOfMeasure_Text}"/></Select></f:content></f:SimpleForm><core:ExtensionPoint name="extensionBottomOfEditScreen"/><core:InvisibleText id="currencyLabel" text="{/#SEPMRA_C_PD_ProductType/Currency/@sap:label}"/><core:InvisibleText id="ariaLengthLabel" text="{i18n>xfld.length}"/><core:InvisibleText id="ariaWidthLabel" text="{i18n>xfld.width}"/><core:InvisibleText id="ariaHeightLabel" text="{i18n>xfld.height}"/><core:InvisibleText id="ariaWeightLabel" text="{/#SEPMRA_C_PD_ProductType/WeightUnit/@sap:label}"/></semantic:content><semantic:messagesIndicator><semantic:MessagesIndicator id="messagesIndicator" press="onMessageIndicator"/></semantic:messagesIndicator><semantic:draftIndicator><DraftIndicator id="draftIndicator" state="{appProperties>/draftIndicatorState}"/></semantic:draftIndicator><semantic:saveAction><semantic:SaveAction id="save" press="onSave"/></semantic:saveAction><semantic:cancelAction><semantic:CancelAction id="cancel" enabled="{= !${appProperties>/isMultiSelect} }" press="onCancel"><semantic:dependents><Popover id="cancelPopover" placement="Top" showHeader="false"><l:VerticalLayout id="cancelLayout" class="sapUiContentPadding" width="100%"><l:content><Text id="cancelText" text="{= ${HasActiveEntity} ? ${i18n>ymsg.cancelEdit} : ${i18n>ymsg.cancelCreate} }"/><Button id="cancelButton" text="{i18n>xbut.discard}" press="onDiscard" width="100%"/></l:content></l:VerticalLayout></Popover></semantic:dependents></semantic:CancelAction></semantic:cancelAction><semantic:sendEmailAction><semantic:SendEmailAction id="shareEmail" press="sendEmail"/></semantic:sendEmailAction><semantic:saveAsTileAction><footerbar:AddBookmarkButton id="shareTile" title="{path: \'ProductForEdit\', formatter:\'.formatter.tileTitleDisplay\'}"/></semantic:saveAsTileAction></semantic:DetailPage></mvc:View>',
	"sap/ui/demoapps/rta/freestyle/view/ProductMaster.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demoapps.rta.freestyle.controller.ProductMaster"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m"\n\txmlns:semantic="sap.m.semantic"><semantic:MasterPage\n\t\tid="page"\n\t\ttitle="{path:\'masterView>/itemCount\', formatter: \'.formatter.listTitle\' }"><semantic:subHeader><Bar id="headerBar"><contentMiddle><SearchField\n\t\t\t\t\t\tid="searchField"\n\t\t\t\t\t\tshowRefreshButton="{= !${device>/support/touch} }"\n\t\t\t\t\t\trefreshButtonTooltip="{i18n>xtol.masterSearchTooltip}"\n\t\t\t\t\t\ttooltip="{i18n>xtol.refreshButtonTooltip}"\n\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\tsearch="onSearch"/></contentMiddle></Bar></semantic:subHeader><semantic:content><PullToRefresh\n\t\t\t\tid="pullToRefresh"\n\t\t\t\tvisible="{device>/support/touch}"\n\t\t\t\trefresh="onRefresh"/><List\n\t\t\t\tid="list"\n\t\t\t\tbusyIndicatorDelay="{= ${appProperties>/masterImmediateBusy} ? 0 : ${masterView>/originalBusyDelayList} }"\n\t\t\t\tnoDataText="{appProperties>/listNoDataText}"\n\t\t\t\tmode="{= ${appProperties>/isMultiSelect} ? \'MultiSelect\' : (${device>/system/phone} ? \'None\' : \'SingleSelectMaster\') }"\n\t\t\t\tgrowing="true"\n\t\t\t\tgrowingScrollToLoad="true"\n\t\t\t\tmodeAnimationOn="false"\n\t\t\t\tselectionChange="onSelectionChange"\n\t\t\t\tswipe="onSwipe"><infoToolbar><Toolbar\n\t\t\t\t\t\tactive="true"\n\t\t\t\t\t\tid="filterBar"\n\t\t\t\t\t\tvisible="{masterView>/isFilterBarVisible}"\n\t\t\t\t\t\tpress="onFilter"><Title id="filterBarLabel" text="{masterView>/filterBarLabel}"/></Toolbar></infoToolbar><swipeContent><Button\n\t\t\t\t\t\tid="swipeButton"\n\t\t\t\t\t\ttext="{i18n>xbut.delete}"\n\t\t\t\t\t\tenabled="{masterView>/swipeEnabled}"\n\t\t\t\t\t\ttype="Reject"\n\t\t\t\t\t\tpress="onSwipeDeleteItem"/></swipeContent><ObjectListItem\n\t\t\t\t\tid="objectListItem"\n\t\t\t\t\ttype="{= ${device>/system/phone} ? \'Active\' : \'Inactive\'}"\n\t\t\t\t\tpress="onSelectionChange"\n\t\t\t\t\ticon="{path: \'ProductPictureURL\', formatter: \'.formatter.formatImageUrl\'}"\n\t\t\t\t\ticonDensityAware="false"\n\t\t\t\t\ttitle="{= ${to_ProductTextInOriginalLang/Name} === \'\' ? (${HasActiveEntity} ? ${i18n>xtit.unnamedProduct} : ${i18n>xtit.productNew}) : ${to_ProductTextInOriginalLang/Name} }"\n\t\t\t\t\tnumberUnit="{Currency}"\n\t\t\t\t\tnumber="{parts: [ {path: \'Price\'}, {path: \'Currency\'}], type : \'sap.ui.model.type.Currency\', formatOptions: { showMeasure: false } }"><markers><ObjectMarker id="LockedMarker" type="Locked" visible="{= ${HasDraftEntity} &amp;&amp; ${DraftAdministrativeData/InProcessByUser} !== \'\' }" visibility="IconOnly"/><ObjectMarker id="DraftMarker" type="Draft" visible="{= !${IsActiveEntity} }" visibility="TextOnly"/><ObjectMarker id="UnsavedMarker" type="Unsaved" visible="{= ${IsActiveEntity} &amp;&amp; ${HasDraftEntity} &amp;&amp; ${DraftAdministrativeData/InProcessByUser} === \'\' }"  visibility="IconAndText"/></markers><attributes><ObjectAttribute id="mainCategoryAttribute" text="{to_ProductCategory/MainProductCategory}"/><ObjectAttribute id="categoryAttribute" text="{ProductCategory}"/></attributes></ObjectListItem></List></semantic:content><semantic:multiSelectAction><semantic:MultiSelectAction\n\t\t\t\tid="multiSelectButton"\n\t\t\t\tpressed="{appProperties>/isMultiSelect}"\n\t\t\t\tenabled="{= (${appProperties>/isMultiSelect} || ${masterView>/itemCount} > 0) &amp;&amp; ${appProperties>/metaDataLoadState} > 0 &amp;&amp; !${appProperties>/isSwipeRunning} }"\n\t\t\t\tpress="onMultiSelect"/></semantic:multiSelectAction><semantic:addAction><semantic:AddAction id="addButton" enabled="{= ${appProperties>/metaDataLoadState} > 0 }" press="onAdd"/></semantic:addAction><semantic:sort><semantic:SortAction id="sort" enabled="{= ${appProperties>/metaDataLoadState} > 0 }" press="onSort"/></semantic:sort><semantic:filter><semantic:FilterAction id="filter" enabled="{= ${appProperties>/metaDataLoadState} > 0 }" press="onFilter"/></semantic:filter><semantic:group><semantic:GroupAction id="group" enabled="{= ${appProperties>/metaDataLoadState} > 0 }" press="onGroup"/></semantic:group><semantic:customFooterContent><Button\n\t\t\t\tid="deleteButton"\n\t\t\t\tenabled="{masterView>/markExists}"\n\t\t\t\ttext="{i18n>xbut.delete}"\n\t\t\t\tvisible="{appProperties>/isMultiSelect}"\n\t\t\t\tpress="onDelete"/></semantic:customFooterContent></semantic:MasterPage></mvc:View>\n',
	"sap/ui/demoapps/rta/freestyle/view/Root.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demoapps.rta.freestyle.controller.Root"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\tdisplayBlock="true"\n\tbusy="{appProperties>/isAppBusy}"\n\tbusyIndicatorDelay="0"><SplitApp id="idAppControl"/></mvc:View>\n',
	"sap/ui/demoapps/rta/freestyle/view/SupplierCard.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:smartForm="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield" xmlns:layout="sap.ui.layout" xmlns:commons="sap.ui.commons"><l:HorizontalLayout id="HeaderLayout"><core:Icon id="HeaderIcon" src="sap-icon://account" size="2rem" class="sapUiSmallMargin"/><l:VerticalLayout id="HeaderInfo" class="sapUiSmallMargin"><Title id="HeaderTitle" text="{to_Supplier/CompanyName}" /><Text id="HeaderDesc" text="{to_Supplier/to_PrimaryContactPersonType/FormattedContactName}" /></l:VerticalLayout></l:HorizontalLayout><smartForm:SmartForm id="MainForm" title=" " editable="true" entityType="Header" binding="{path:\'to_Supplier\'}"><smartForm:groups><smartForm:Group id="ContactDetails" title="{i18n>xtit.contactDetails}"><smartForm:GroupElement id="ContactDetails.Phone"><smartField:SmartField value="{PhoneNumber}" id="ContactDetails.Phone.Field"/></smartForm:GroupElement><smartForm:GroupElement id="ContactDetails.Email" ><smartField:SmartField value="{EmailAddress}" id="ContactDetails.Email.Field"/></smartForm:GroupElement></smartForm:Group><smartForm:Group id="MainContact" title="{i18n>xtit.mainContact}"  binding="{path:\'to_PrimaryContactPersonType\'}"><smartForm:GroupElement id="MainContact.Name"><smartField:SmartField value="{FormattedContactName}" id="MainContact.Name.Field"/></smartForm:GroupElement><smartForm:GroupElement id="MainContact.Mobile" ><smartField:SmartField value="{MobilePhoneNumber}" id="MainContact.Mobile.Field"/></smartForm:GroupElement><smartForm:GroupElement id="MainContact.Language" ><smartField:SmartField value="{PreferredLanguage}" id="MainContact.Language.Field"/></smartForm:GroupElement></smartForm:Group></smartForm:groups><smartForm:layout><smartForm:Layout gridDataSpan = "L12 M12 S12"/></smartForm:layout></smartForm:SmartForm></core:FragmentDefinition>\n',
	"sap/ui/demoapps/rta/freestyle/view/dialog/Filter.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><ViewSettingsDialog id="filterSettingsDialog" confirm="onFilterDialogConfirm"><filterItems><ViewSettingsFilterItem id="availibilityFilterItem" text="{i18n>xfld.availability}" key="Availibility"\n\t\t\t\titems="{path: \'/SEPMRA_I_StockAvailability\', sorter: {path: \'StockAvailability\', descending: false} }"><items><ViewSettingsItem id="availabilityItem" text="{StockAvailability_Text}" key="{StockAvailability}"/></items></ViewSettingsFilterItem><ViewSettingsFilterItem id="priceFilterItem" text="{/#SEPMRA_C_PD_ProductType/Price/@sap:label}" key="Price"><items><ViewSettingsItem id="le100Item" text="{masterView>/LE100}" key="LE100"/><ViewSettingsItem id="bt100-500Item" text="{masterView>/BT100-500}" key="BT100-500"/><ViewSettingsItem id="bt500-1000Item" text="{masterView>/BT500-1000}" key="BT500-1000"/><ViewSettingsItem id="gt1000Item" text="{masterView>/GT1000}" key="GT1000"/></items></ViewSettingsFilterItem><ViewSettingsFilterItem id="statusFilterItem" text="{i18n>xfld.editingStatus}" key="IsActiveEntity" multiSelect="false"><items><ViewSettingsItem text="{i18n>xfld.editingActive}" key="editingActive"/><ViewSettingsItem text="{i18n>xfld.editingDraft}" key="editingDraft"/><ViewSettingsItem text="{i18n>xfld.editingLocked}" key="editingLocked"/><ViewSettingsItem text="{i18n>xfld.editingUnsavedChanges}" key="editingUnsavedChanges"/></items></ViewSettingsFilterItem></filterItems></ViewSettingsDialog></core:FragmentDefinition>',
	"sap/ui/demoapps/rta/freestyle/view/dialog/Grouping.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><ViewSettingsDialog id="groupingSettingsDialog" confirm="onGroupingDialogConfirmed"><groupItems><ViewSettingsItem text="{/#SEPMRA_I_ProductMainCategoryType/MainProductCategory/@sap:label}" key="to_ProductCategory/MainProductCategory"/><ViewSettingsItem text="{/#SEPMRA_C_PD_ProductType/ProductCategory/@sap:label}" key="ProductCategory"/><ViewSettingsItem text="{i18n>xfld.availability}" key="to_ProductStock/Quantity"/><ViewSettingsItem text="{/#SEPMRA_C_PD_ProductType/Price/@sap:label}" key="Price"/></groupItems></ViewSettingsDialog></core:FragmentDefinition>',
	"sap/ui/demoapps/rta/freestyle/view/dialog/ProductImage.fragment.xml":'<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="imageDialog" title="{to_ProductTextInOriginalLang/Name}"><content><Image\n\t\t\t\talt="{i18n>xtol.productImage}"\n\t\t\t\tdecorative="false"\n\t\t\t\theight="25rem"\n\t\t\t\tid="carouselImage"\n\t\t\t\tsrc="{path: \'ProductPictureURL\', formatter: \'.formatImageUrl\'}"\n\t\t\t\tpress="onImageOKPressed"/></content><beginButton><Button id="btnCloseDialog" press="onImageOKPressed" text="{i18n>xbut.ok}"/></beginButton></Dialog></core:FragmentDefinition>\n',
	"sap/ui/demoapps/rta/freestyle/view/dialog/Sort.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><ViewSettingsDialog id="sortSettingsDialog" confirm="onSortDialogConfirmed"><sortItems><ViewSettingsItem text="{/#SEPMRA_C_PD_ProductTextType/Name/@sap:label}" key="to_ProductTextInOriginalLang/Name"/><ViewSettingsItem text="{/#SEPMRA_C_PD_ProductType/ProductForEdit/@sap:label}" key="Product"/><ViewSettingsItem text="{/#SEPMRA_C_PD_ProductType/Price/@sap:label}" key="Price"/><ViewSettingsItem text="{/#SEPMRA_I_ProductMainCategoryType/MainProductCategory/@sap:label}" key="to_ProductCategory/MainProductCategory"/><ViewSettingsItem text="{/#SEPMRA_C_PD_ProductType/ProductCategory/@sap:label}" key="ProductCategory"/><ViewSettingsItem text="{i18n>xfld.availability}" key="to_ProductStock/Quantity"/></sortItems></ViewSettingsDialog></core:FragmentDefinition>',
	"sap/ui/demoapps/rta/freestyle/view/form/ProductGeneral.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demoapps.rta.freestyle.controller.ProductGeneralForm"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:control="sap.ui.demoapps.rta.freestyle.control"><f:SimpleForm id="generalForm"\n\t\tclass="sapUiForceWidthAuto sapUiResponsiveMargin"\n\t\teditable="false"\n\t\tlayout="ResponsiveGridLayout"\n\t\tsingleContainerFullSize="false"><f:content><Label id="productLabel" text="{ProductForEdit/#@sap:label}"/><Text id="productText" text="{ProductForEdit}"/><Label id="descriptionLabel" text="{/#SEPMRA_C_PD_ProductTextType/Description/@sap:label}"/><Text id="descriptionText" text="{to_ProductTextInOriginalLang/Description}"/><Label id="supplierLabel" text="{Supplier/#@sap:label}"/><Link id="supplierText" text="{to_Supplier/CompanyName}" press="onSupplierPressed" class="sapUiForceWidthAuto"/><Label id="ratingLabel" text="{/#SEPMRA_C_PD_ReviewType/AverageRatingValue/@sap:label}"/><control:RatingAndCount\n\t\t\t\tid="ratingText"\n\t\t\t\tmaxRatingValue="5"\n\t\t\t\tvalue="{to_CollaborativeReview/AverageRatingValue}"\n\t\t\t\tenabled="false"\n\t\t\t\tratingCount="{to_CollaborativeReview/NumberOfReviewPosts}"/></f:content></f:SimpleForm></mvc:View>\n',
	"sap/ui/demoapps/rta/freestyle/view/form/ProductSupplier.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demoapps.rta.freestyle.controller.ProductSupplierForm"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:smartField="sap.ui.comp.smartfield"\n\txmlns:smartLink="sap.ui.comp.navpopover"\n\txmlns:smartForm="sap.ui.comp.smartform"><smartForm:SmartForm\n\t\tid="supplierForm"\n\t\teditable="false"\n\t\tignoredFields="TransactionCode"><smartForm:Group id="SupplierFormGeneralGroup" title="{i18n>xtit.supplierCompanyInformation}"><smartForm:GroupElement id="SupplierFormGeneral.CompanyName" label="{CompanyName/#@sap:label}"><smartLink:SmartLink\n\t\t\t\t\tid="SupplierFormGeneral.CompanyName.Link"\n\t\t\t\t\ttext="{CompanyName}"\n\t\t\t\t\tfieldName="SupplierId"\n\t\t\t\t\tsemanticObject="semanticObjectSupplierId" /></smartForm:GroupElement><smartForm:GroupElement id="SupplierFormGeneral.PhoneNumber"><smartField:SmartField value="{PhoneNumber}" id="SupplierFormGeneral.PhoneNumber.Field"/></smartForm:GroupElement><smartForm:GroupElement id="SupplierFormGeneral.FaxNumber"><smartField:SmartField value="{FaxNumber}" id="SupplierFormGeneral.FaxNumber.Field"/></smartForm:GroupElement><smartForm:GroupElement id="SupplierFormGeneral.URL"><smartField:SmartField value="{URL}" id="SupplierFormGeneral.URL.Field"/></smartForm:GroupElement><smartForm:GroupElement id="SupplierFormGeneral.CustomField" label="{i18n>customFieldLabel}"><Text text="{i18n>customFieldValue}" id="SupplierFormGeneral.CustomField.Field"/></smartForm:GroupElement></smartForm:Group><smartForm:Group id="SupplierFormPersonGroup" title="{i18n>xtit.supplierContactPerson}"><smartForm:GroupElement id="SupplierFormPerson.FirstName"><smartField:SmartField value="{FirstName}" id="SupplierFormPerson.FirstName.Field"/></smartForm:GroupElement><smartForm:GroupElement id="SupplierFormPerson.LastName"><smartField:SmartField value="{LastName}" id="SupplierFormPerson.LastName.Field"/></smartForm:GroupElement><smartForm:GroupElement id="SupplierFormPerson.PhoneNumber"><smartField:SmartField value="{PhoneNumber}" id="SupplierFormPerson.PhoneNumber.Field"/></smartForm:GroupElement><smartForm:GroupElement id="SupplierFormPerson.EmailAddress"><smartField:SmartField value="{EmailAddress}" id="SupplierFormPerson.EmailAddress.Field"/></smartForm:GroupElement></smartForm:Group></smartForm:SmartForm></mvc:View>\n',
	"sap/ui/demoapps/rta/freestyle/view/form/ProductTechnical.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demoapps.rta.freestyle.controller.ProductTechnicalForm"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:f="sap.ui.layout.form"><f:SimpleForm\n\t\tid="technicalForm"\n\t\tclass="sapUiForceWidthAuto sapUiResponsiveMargin"\n\t\teditable="false"\n\t\tlayout="ResponsiveGridLayout"><f:content><Label id="baseUnitLabel" text="{/#SEPMRA_C_PD_ProductType/ProductBaseUnit/@sap:label}"/><Text id="baseUnitText" text="{to_ProductBaseUnit/UnitOfMeasure_Text}"/><Label id="heightLabel" text="{/#SEPMRA_C_PD_ProductType/Height/@sap:label}"/><Text id="heightText"\n\t\t\t      text="{parts:[{path : \'Height\', type : \'sap.ui.model.type.Float\', constraints : { minimum: 0, maximum: 9999999999 }, formatOptions: { parseAsString: true, maxIntegerDigits: 10, maxFractionDigits: 3 } }, {path: \'to_DimensionUnit/UnitOfMeasure_Text\'}], formatter: \'.formatter.formatMeasure\' }"/><Label id="widthLabel" text="{/#SEPMRA_C_PD_ProductType/Width/@sap:label}"/><Text id="widthText"\n\t\t\t      text="{parts:[{path: \'Width\', type : \'sap.ui.model.type.Float\', constraints : { minimum: 0, maximum: 9999999999 }, formatOptions: { parseAsString: true, maxIntegerDigits: 10, maxFractionDigits: 3 } }, {path: \'to_DimensionUnit/UnitOfMeasure_Text\'}], formatter: \'.formatter.formatMeasure\' }"/><Label id="depthLabel" text="{/#SEPMRA_C_PD_ProductType/Depth/@sap:label}"/><Text id="depthText"\n\t\t\t      text="{parts:[{path: \'Depth\', type : \'sap.ui.model.type.Float\', constraints : { minimum: 0, maximum: 9999999999 }, formatOptions: { parseAsString: true, maxIntegerDigits: 10, maxFractionDigits: 3 } }, {path: \'to_DimensionUnit/UnitOfMeasure_Text\'}], formatter: \'.formatter.formatMeasure\' }"/><Label id="weightLabel" text="{/#SEPMRA_C_PD_ProductType/Weight/@sap:label}"/><Text id="weightText"\n\t\t\t      text="{parts:[{path: \'Weight\', type : \'sap.ui.model.type.Float\', constraints : { minimum: 0, maximum: 9999999999 }, formatOptions: { parseAsString: true, maxIntegerDigits: 10, maxFractionDigits: 3 } }, {path: \'to_WeightUnit/UnitOfMeasure_Text\'}], formatter: \'.formatter.formatMeasure\' }"/></f:content></f:SimpleForm></mvc:View>\n'
});
//# sourceMappingURL=Component-preload.js.map

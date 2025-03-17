//@ui5-bundle sap/ui/demo/iconexplorer/Component-preload.js
sap.ui.predefine("sap/ui/demo/iconexplorer/Component", [
	"sap/ui/core/IconPool",
	"sap/ui/core/Theming",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/demo/iconexplorer/model/models",
	"sap/ui/demo/iconexplorer/model/IconModel",
	"sap/ui/demo/iconexplorer/model/FavoriteModel",
	"sap/ui/demo/iconexplorer/controller/ErrorHandler",
	"sap/ui/documentation/sdk/controller/util/ConfigUtil",
	"sap/ui/documentation/sdk/controller/util/CookiesConsentManager",
	"sap/ui/model/json/JSONModel",
	"sap/ui/VersionInfo"
], function(
	IconPool,
	Theming,
	UIComponent,
	Device,
	models,
	IconModel,
	FavoriteModel,
	ErrorHandler,
	ConfigUtil,
	CookiesConsentManager,
	JSONModel,
	VersionInfo
) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.iconexplorer.Component", {

		metadata : {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init : function () {

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set up a helper model to manage OpenUI5/SAPUI5
			VersionInfo.load().then(function (oVersionInfo) {
				var oVersionModel = new JSONModel({
					isOpenUI5: !!(oVersionInfo && oVersionInfo.gav && /openui5/i.test(oVersionInfo.gav))
				});
				this.setModel(oVersionModel, "versionData");

				// set up a helper model to manage favorite icons
				var oFavoriteModel = new FavoriteModel();
				this.setModel(oFavoriteModel, "fav");

				// set up an icon model that loads icons from the icon font
				var oIconModel = new IconModel(this._oIconsLoadedPromise);
				this.setModel(oIconModel);

				// set the device model
				this.setModel(models.createDeviceModel(), "device");

				// set the current year model
				var oModel = models.createSharedParamsModel();
				this.setModel(oModel, "sharedParams");

				var aFontsLoaded = [];
				var sLocalFontFolder = sap.ui.require.toUrl("sap/ui/demo/iconexplorer/fonts/base/");

				var oFontConfigs = {};
				oFontConfigs["SAP-icons"] = {
					fontFamily: "SAP-icons",
					fontURI: sap.ui.require.toUrl("sap/ui/core/themes/base/fonts/"),
					downloadURI: sLocalFontFolder,
					downloadURIForHorizon: sap.ui.require.toUrl("sap/ui/demo/iconexplorer/fonts/sap_horizon/")
				};

				var oTNTConfig = {
					fontFamily: "SAP-icons-TNT",
					fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/"),
					downloadURI: sLocalFontFolder,
					downloadURIForHorizon: sap.ui.require.toUrl("sap/ui/demo/iconexplorer/fonts/sap_horizon/")
				};

				// register TNT icon font
				IconPool.registerFont(oTNTConfig);
				aFontsLoaded.push(IconPool.fontLoaded("SAP-icons-TNT"));
				oFontConfigs["SAP-icons-TNT"] = oTNTConfig;

				// load SAPUI5 fonts on demand
				if (!oVersionModel.getProperty("/isOpenUI5")) {
					var oBusinessSuiteConfig = {
						fontFamily: "BusinessSuiteInAppSymbols",
						fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
					};

					// register BusinessSuiteInAppSymbols icon font
					IconPool.registerFont(oBusinessSuiteConfig);
					aFontsLoaded.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
					oFontConfigs["BusinessSuiteInAppSymbols"] = oBusinessSuiteConfig;
				}

				// create wrapper promise so controllers can register to it
				this.iconsLoaded();

				// init icon model when all promises have finished
				Promise.all(aFontsLoaded).then(function () {
					oIconModel.init(Object.keys(oFontConfigs));
					// We resolve the helper promise on component level when the promise in the icon model is resolved.
					// The app controller is instantiated before the component's init method, so it cannot directly
					// register to the icon model.
					oIconModel.iconsLoaded().then(function () {
						this._fnIconsLoadedResolve();
					}.bind(this));
				}.bind(this));
				this._oFontConfigs = oFontConfigs;

				// initialize the error handler with the component
				this._oErrorHandler = new ErrorHandler(this);

				// create the views based on the url/hash
				this.getRouter().initialize();
			}.bind(this));
		},

		/**
		 * Wrapper for the iconModel promise as the controller is instantiated earlier than the model
		 * @return {Promise|*} the icons loaded promise
		 */
		iconsLoaded: function () {
			if (!this._oIconsLoadedPromise) {
				this._oIconsLoadedPromise = new Promise(function (fnResolve, fnReject) {
					this._fnIconsLoadedResolve = fnResolve;
					this._fnIconsLoadedReject = fnReject;
				}.bind(this));
			}
			return this._oIconsLoadedPromise;
		},

		getConfigUtil: function() {
			if (!this._oConfigUtil) {
				this._oConfigUtil = new ConfigUtil(this);
			}
			return this._oConfigUtil;
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy : function () {
			this._oErrorHandler.destroy();

			this._pCookiesComponent && this._pCookiesComponent.then(function(oCookiesMgmtComponent) {
				oCookiesMgmtComponent.destroy();
			});
			this._oConfigUtil.destroy();
			this._oConfigUtil = null;

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
		},

		getCookiesConsentManager: function() {
			if (!this._oCookiesConsentManager) {
				const oConfig = {
					defaultConsentDialogComponentId: "sap.ui.documentation.sdk.cookieSettingsDialog"
				};
				this._oCookiesConsentManager = CookiesConsentManager.create(this, oConfig);
			}
			return this._oCookiesConsentManager;
		}
	});

});
sap.ui.predefine("sap/ui/demo/iconexplorer/controller/App.controller", [
		"sap/ui/demo/iconexplorer/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/base/Log",
		"sap/ui/documentation/sdk/controller/util/ThemePicker",
		"sap/ui/thirdparty/URI"
	], function (BaseController, JSONModel, Log, ThemePicker, URI) {
		"use strict";

		return BaseController.extend("sap.ui.demo.iconexplorer.controller.App", {

			/**
			 * Called when the app is started.
			 */
			onInit : function () {
				var oViewModel,
					fnSetAppNotBusy,
					iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
				this.setModel(oViewModel, "view");

				// reduce the log level to speed up the app performance
				Log.setLevel(Log.Level.WARNING);

				fnSetAppNotBusy = function() {
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				};

				// ensure that the app is busy until the icon meta data is loaded
				this.getOwnerComponent().iconsLoaded().then(fnSetAppNotBusy);

				// apply content density mode to root view
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

				this._initThemePicker();
			},

			_initThemePicker : function() {
				ThemePicker.init(this);
			}
		});

	}
);
sap.ui.predefine("sap/ui/demo/iconexplorer/controller/BaseController", ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"], function(Controller, UIComponent) {
		"use strict";

		return Controller.extend("sap.ui.demo.iconexplorer.controller.BaseController", {
			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Navigates to the icons info sub-page
			 * @public
			 */
			onNavToInfo: function () {
				this.getRouter().navTo("info");
			},

			/**
			 * Navigates to the library sub-page
			 * @public
			 */
			onNavToLibrary: function () {
				this.getRouter().navTo("overview");
			},

			/**
			 * Navigates to home page
			 * @public
			 */
			onBackButtonPress : function () {
				this.getRouter().navTo("home");
			}

		});

	}
);
sap.ui.predefine("sap/ui/demo/iconexplorer/controller/ErrorHandler", [
		"sap/ui/base/Object",
		"sap/m/MessageBox"
	], function (UI5Object, MessageBox) {
		"use strict";

		return UI5Object.extend("sap.ui.demo.iconexplorer.controller.ErrorHandler", {

			/**
			 * Handles application errors by automatically attaching to the model events
			 * and displaying errors when needed.
			 * @class
			 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
			 * @public
			 * @alias sap.ui.demo.iconexplorer.controller.ErrorHandler
			 */
			constructor : function (oComponent) {
				this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
				this._oComponent = oComponent;
				this._oModel = oComponent.getModel();
				this._bMessageOpen = false;
				this._sErrorText = this._oResourceBundle.getText("errorText");

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
			 * Only the first error message will be displayed.
			 * @param {*} vDetails a technical error to be displayed on request
			 * @private
			 */
			_showServiceError : function (vDetails) {
				if (this._bMessageOpen) {
					return;
				}
				this._bMessageOpen = true;
				MessageBox.error(
					this._sErrorText,
					{
						id : "serviceErrorMessageBox",
						details: vDetails,
						styleClass: this._oComponent.getContentDensityClass(),
						actions: [MessageBox.Action.CLOSE],
						onClose: function () {
							this._bMessageOpen = false;
						}.bind(this)
					}
				);
			}
		});
	}
);
sap.ui.predefine("sap/ui/demo/iconexplorer/controller/Home.controller", [
	"sap/ui/demo/iconexplorer/model/formatter",
	"sap/ui/demo/iconexplorer/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/VersionInfo"
], function(formatter, BaseController, Filter, FilterOperator, VersionInfo) {
	"use strict";

	return BaseController.extend("sap.ui.demo.iconexplorer.controller.Home", {

		formatter:formatter,

		onInit: function () {
			// search in tags and icon string for the global search
			this._oSearchField = this.byId("search");
			this._oSearchField.setFilterFunction(function (sValue, oControl) {
				var oContext = oControl.getBindingContext().getObject();

				return !!(oContext.name.indexOf(sValue) >= 0 || oContext.tagString.indexOf(sValue) >= 0);
			});

			this._oSearchField.setValueHelpIconSrc("sap-icon://search");
			this._oSearchField.addEventDelegate({
				// re-open suggestions when pressing inside the search field again
				ontap: function (oEvent) {
					// open the suggestion popup when search value is valid
					if (this.getValue().length >= this.getStartSuggestion()) {
						this._oSuggestionPopup.open();
					}
				}.bind(this._oSearchField),
				oninput: function () {
					this.applyFilters();
				}.bind(this)
			});

			this.getRouter().attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		},

		onBeforeRouteMatched : function () {
			this._bNavigatedFromTag = false;
		},

		/**
		 * Navigate to the selected icon font and preselect the icon
		 * @param {sap.ui.base.Event} oEvent the suggestionItemSelected event
		 * @public
		 */
		onSuggestionSelect: function(oEvent){
			var sSearch = oEvent.getSource().getValue(),
				oBindingContext = oEvent.getParameter("selectedRow").getBindingContext().getObject();

			if (this._bNavigatedFromTag) {
				return;
			}

			this.getRouter().navTo("overview",{
				fontName : oBindingContext.font,
				query: {
					search: sSearch,
					icon: oBindingContext.name
				}
			});
		},

		onTokenPress: function (oEvent) {
			var oTarget = oEvent.getSource(),
				oRow = oTarget.getParent().getParent(),
				oBindingContext = oRow.getBindingContext().getObject(),
				sSearch = this._oSearchField.getValue(),
				sTag = oTarget.getText();

			this.getRouter().navTo("overview",{
				fontName : oBindingContext.font,
				query: {
					search: sSearch,
					tag: sTag
				}
			});

			this._bNavigatedFromTag = true;
		},

		/**
		 * Navigate to the selected icon font and preselect the icon when pressing enter
		 * @param {sap.ui.base.Event} oEvent the enter event
		 * @public
		 */
		onEnter: function(oEvent){
			var oInput = oEvent.getSource(),
				sSearch = oEvent.getSource().getValue(),
				aVisibleSuggestions = oEvent.getSource().getSuggestionRows().filter(function (oRow) {
					return oRow.getVisible();
				}),
				oBindingContext;

			if (oInput.getValue().length >= oInput.getStartSuggestion() && aVisibleSuggestions.length) {
				oBindingContext = aVisibleSuggestions[0].getBindingContext().getObject();
				this.getRouter().navTo("overview",{
					fontName : oBindingContext.font,
					query: {
						search: sSearch,
						icon: oBindingContext.name
					}
				});
			}
		},

		/**
         * Triggered on each checkbox de/selection.
         */
		onCheckBoxSelect: function () {
			this.applyFilters();
		},

		/**
         * Applies filters depending on the selected checkboxes.
         */
		applyFilters: function () {
			var oView = this.getView(),
				inputFilters = [],
				oSuggestionInput = oView.byId("search"),
				oSuggestionRowBinding = oSuggestionInput.getBinding("suggestionRows"),
				sSearchValue = oSuggestionInput.getValue(),
				aAllFilters = [];

			// Check each checkbox's state and add corresponding filters
			if (oView.byId("cbSAPIcons").getSelected()) {
				aAllFilters.push(new Filter("font", FilterOperator.EQ, "SAP-icons"));
			}

			if (oView.byId("cbSAPIconsTNT").getSelected()) {
				aAllFilters.push(new Filter("font", FilterOperator.EQ, "SAP-icons-TNT"));
			}

			if (oView.byId("cbInfoSAPBusinessSuite").getSelected()) {
				aAllFilters.push(new Filter("font", FilterOperator.EQ, "BusinessSuiteInAppSymbols"));
			}

			if (aAllFilters.length > 0 && sSearchValue.length > 0) {
				// Filter icons, where 'name' or 'tag' contains the provided input value
				inputFilters = (new Filter({
					filters: [
						new Filter("tagString", FilterOperator.Contains, sSearchValue),
						new Filter("name", FilterOperator.Contains, sSearchValue)
					],
					or: true
				}));
			}
			aAllFilters.push(inputFilters);

			oSuggestionRowBinding.filter(aAllFilters);

			return null;
		}
	});
});
sap.ui.predefine("sap/ui/demo/iconexplorer/controller/Info.controller", [
	"sap/ui/demo/iconexplorer/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/library",
	"sap/ui/core/Core"
], function (BaseController, JSONModel, mobileLibrary, Core) {
	"use strict";

	var SUPPORTED_FONTS = {
		business: "BusinessSuiteInAppSymbols",
		tnt: "SAP-icons-TNT",
		sap: "SAP-icons"
	};

	var BTP_EXPERIENCE_ICONOGRAPHY_LINK = "https://btpx.frontify.com/document/223120#/design-language/iconography-p7615";

	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("sap.ui.demo.iconexplorer.controller.Info", {
		onInit : function () {
			var svgCard = sap.ui.require.toUrl("sap/m/demokit/iconExplorer/webapp/images/UI5PhoenixCardSVG.svg").replace("resources/", "test-resources/"),
				oInfoModel = new JSONModel({
					svgCard : svgCard
				});

			this.setModel(oInfoModel, "info");
		},

		/**
		 * Navigates to the overview when the link is pressed
		 * @public
		 */
		onIconExplorerLinkPressed : function () {
			this.getRouter().navTo("overview");
		},

		onInfoBTPIconographyPress: function() {
			URLHelper.redirect(BTP_EXPERIENCE_ICONOGRAPHY_LINK, false);
		},

		onDownloadBusinessSuiteIcons: function () {
			this._onDownload(SUPPORTED_FONTS.business);
		},

		onDownloadSAPIcons: function () {
			this._onDownload(SUPPORTED_FONTS.sap);
		},

		onDownloadTNTIcons: function () {
			this._onDownload(SUPPORTED_FONTS.tnt);
		},

		/**
		 * Downloads the icon font relatively from the respective button pressed
		 * @public
		 * @param {string} sFontName the original font name
		 */
		_onDownload: function (sFontName) {
			var oConfigs = this.getOwnerComponent()._oFontConfigs;
			var sDownloadURI = oConfigs[sFontName].downloadURI || oConfigs[sFontName].fontURI;

			if (Core.getConfiguration().getTheme().startsWith("sap_horizon")) {
				sDownloadURI = oConfigs[sFontName].downloadURIForHorizon || sDownloadURI;
			}

			mobileLibrary.URLHelper.redirect(sDownloadURI + sFontName + ".ttf");
		}

	});

}
);
sap.ui.predefine("sap/ui/demo/iconexplorer/controller/NotFound.controller", [
		"sap/ui/demo/iconexplorer/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("sap.ui.demo.iconexplorer.controller.NotFound", {

			/**
			 * Navigates to the worklist when the button is pressed
			 * @public
			 */
			onButtonPressed : function () {
				this.getRouter().navTo("overview");
			}

		});

	}
);
sap.ui.predefine("sap/ui/demo/iconexplorer/controller/Overview.controller", [
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Token",
	"sap/ui/Device",
	"sap/ui/core/Core",
	"sap/ui/core/Element",
	"sap/ui/core/Fragment",
	"sap/ui/core/IconPool",
	"sap/ui/core/Theming",
	"sap/ui/core/theming/Parameters",
	"sap/ui/demo/iconexplorer/controller/BaseController",
	"sap/ui/demo/iconexplorer/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/documentation/sdk/controller/util/ThemePicker"
], function(
	Label,
	MessageToast,
	Token,
	Device,
	Core,
	Element,
	Fragment,
	IconPool,
	Theming,
	Parameters,
	BaseController,
	formatter,
	Filter,
	FilterOperator,
	JSONModel,
	ThemePicker
	) {
	"use strict";

	var TYPING_DELAY = 200; // ms

	return BaseController.extend("sap.ui.demo.iconexplorer.controller.Overview", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the overview controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oViewModel,
				oTagModel,
				sThemeKey = ThemePicker._oConfigUtil.getCookieValue("appearance") || "light";

				this._oPreviousQueryContext = {};
			this._oCurrentQueryContext = null;

			// model used to manipulate control states
			oViewModel = new JSONModel({
				growingThreshold : 200,
				iconFilterCount: this.getResourceBundle().getText("overviewTabAllInitial"),
				allIconsCount: 99,
				overviewNoDataText : this.getResourceBundle().getText("overviewNoDataText"),
				SelectedCopyMode: "uri",
				SelectedTheme: sThemeKey,
				CopyModeCollection: [
					{
						"CopyModeId": "uri",
						"Name": "URI"
					},
					{
						"CopyModeId": "sym",
						"Name": "Symbol"
					},
					{
						"CopyModeId": "uni",
						"Name": "Unicode"
					}
				],
				fontName: "",
				iconPath : "",
				busy : true,
				iconsFound: true
			});
			this.setModel(oViewModel, "view");

			// helper model for managing the tag selection
			oTagModel = new JSONModel();
			this.setModel(oTagModel, "tags");

			// register to both new and legacy pattern to not break bookmarked URLs
			this.getRouter().getRoute("legacy").attachPatternMatched(this._updateUI, this);
			this.getRouter().getRoute("overview").attachPatternMatched(this._updateUI, this);
		},

		/**
		 * Focus search field after rendering for immediate searchability
		 */
		onAfterRendering: function () {
			setTimeout(function () {
				this.byId("searchField").focus();
			}.bind(this),0);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser history
		 * @public
		 */
		onNavBack : function() {
			this.getRouter().navTo("home");
		},

		/**
		 * Event handler for the navigation button, opens a Popover with all fonts
		 * @public
		 * @param oEvent
		 */
		onSelectFont : function(oEvent) {
			var sFontName = this.getModel("view").getProperty("/fontName"),
				aListItems = this.byId("selectFontList").getItems(),
				oSelectedItem = aListItems.filter(function (oListItem) {
					return oListItem.getCustomData()[0].getValue() === sFontName;
				}).pop();

			this.byId("selectFont").openBy(oEvent.getSource());
			this.byId("selectFontList").setSelectedItem(oSelectedItem);
		},

		/**
		 * Event handler for pressing a list item in the navigation popover
		 * @public
		 * @param oEvent
		 */
		onChangeFont : function(oEvent) {
			var oListItem = oEvent.getParameter("selectedItem"),
				sSelectedFont = oListItem.getKey();

			this.getModel("view").setProperty("/busy", true, null, true);
			this.getRouter().navTo("overview", {
				query: {
					tab: this._oCurrentQueryContext.tab
				},
				fontName: sSelectedFont
			});
		},

		handleThemeSelection: function (oEvent) {
			var sTargetText = oEvent.getParameter("selectedItem").getKey();
			if (ThemePicker._getTheme()[sTargetText]) {
				ThemePicker._updateAppearance(sTargetText);
			}
		},

		handleCopyToClipboardClick: function (oEvent) {
			var oParent = oEvent.getSource().getParent(),
				// Depending where we press the copy button (from the Grid or Detail fragment), the
				// drill-down for the icon src is different
				sIconURI = oParent.getParent().getItems()[0].getSrc ? // Grid fragment
				oParent.getParent().getItems()[0].getSrc() : // Grid fragment
				oParent.getCells()[0].getSrc(), // Detail fragment
				sSelectedCopyMode = this.getModel("view").getProperty("/SelectedCopyMode");

			if (sSelectedCopyMode === "uri") {
				this._onCopyCodeToClipboard(sIconURI);
			} else if (sSelectedCopyMode === "sym") {
				this._onCopyIconToClipboard(sIconURI);
			} else if (sSelectedCopyMode === "uni") {
				this._onCopyUnicodeToClipboard(sIconURI.substr(sIconURI.lastIndexOf("/") + 1, sIconURI.length - 1));
			}
		},

		/**
		 * Triggered by the table's 'updateFinished' event and by the other tabs change: after new table
		 * data is available, this handler method updates the icon counter.
		 * @public
		 */
		onUpdateFinished : function () {
			var oResultItemsBinding = this.byId("results").getBinding(this._sAggregationName),
				iFilteredIcons = oResultItemsBinding.getLength(),
				iAllIcons = oResultItemsBinding.oList.length;

			function getRootControl(oEvent) {
				return Core.byId(oEvent.currentTarget.id);
			}
			// show total count of items
			this.getModel("view").setProperty("/iconFilterCount", iFilteredIcons, null, true);
			this.getModel("view").setProperty("/allIconsCount", iAllIcons, null, true);
			this.getModel("view").setProperty("/iconsFound", iFilteredIcons > 0, null, true);

			// register press callback for grid
			if (this._oCurrentQueryContext.tab === "grid") {
				if (!this._oPressLayoutCellDelegate) {
					this._oPressLayoutCellDelegate = {
						// tap: set selected and hoverable class
						ontap: function (oEvent) {
							var oBindingContext = oEvent.srcControl.getBindingContext();
							var oRoot = getRootControl(oEvent);

							// prevent setting styles on the favorite button
							if (oRoot.getMetadata().getName().search("ToggleButton") >= 0 || oEvent.srcControl.getMetadata().getName().search("ToggleButton") >= 0) {
								return;
							}

							// select the icon
							this._updateHash("icon", oBindingContext.getProperty("name"));
						}.bind(this),
						// touchstart: set item active and remove hoverable class, invert icon color
						ontouchstart: function (oEvent) {
							var oRoot = getRootControl(oEvent);

							oRoot.addStyleClass("sapMLIBActive");
							oRoot.removeStyleClass("sapMLIBHoverable");
							if (!this._sNormalIconColor) {
								this._sNormalIconColor = Element.closestTo(oRoot.$().find(".sapUiIcon")[0]).getColor();
							}
							oRoot.$().find(".sapMFlexItem > .sapUiIcon").get().forEach(function (oDomRef) {
								const oIcon = Element.closestTo(oDomRef);
								oIcon?.setColor(Parameters.get("sapUiTextInverted"));
							});
						}.bind(this),
						// touchend: remove active class, reset icon color
						ontouchend: function (oEvent) {
							var oRoot = getRootControl(oEvent);

							oRoot.removeStyleClass("sapMLIBActive");
							oRoot.$().find(".sapMFlexItem > .sapUiIcon").get().forEach(function (oDomRef) {
								const oIcon = Element.closestTo(oDomRef);
								oIcon?.setColor(this._sNormalIconColor);
							}.bind(this));
						}.bind(this)
					};
					// enter + space key: same as tab
					this._oPressLayoutCellDelegate.onsapenter = this._oPressLayoutCellDelegate.ontap;
				}

				// there is no addEventDelegateOnce so we remove and add it for all items
				var aItems = this.byId("results").getAggregation(this._sAggregationName);
				if (aItems) {
					aItems.forEach(function (oItem) {
						oItem.removeEventDelegate(this._oPressLayoutCellDelegate);
						oItem.addEventDelegate(this._oPressLayoutCellDelegate);
					}.bind(this));
				}
			}
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onSelectionChange : function (oEvent) {
			var sModelName = (this._oCurrentQueryContext.tab === "favorites" ? "fav" : undefined),
				oItem = oEvent.getParameter("listItem");

			this._updateHash("icon", oItem.getBindingContext(sModelName).getProperty("name"));
		},

		/**
		 * Event handler for changing the icon browse mode.
		 * We update the hash in case a new tab is selected.
		 * @param {sap.ui.base.Event} oEvent the selectionChange event of the SegmentedButton
		 */
		onSegmentSelected : function (oEvent){
			if (oEvent.getParameter("item").getKey() === "all") {
				this._updateHash("reset", "all");
			} else {
				this._updateHash("tab", oEvent.getParameter("item").getKey());
			}
		},

		formatToolbarTitleText : function (iconFilterCount) {
			if (this._oCurrentQueryContext?.tab === "favorites") {
				return this.getResourceBundle().getText("previewFavoritesResults") + " (" + iconFilterCount + ")";
			} else {
				return this.getResourceBundle().getText("previewSearchResults") + " (" + iconFilterCount + ")";
			}
		},

		/**
		 * Searches the icons and filters the bindings accordingly
		 * @param {sap.ui.base.Event} oEvent the liveChange event of the SearchField
		 * @public
		 */
		onSearch: function (oEvent) {
			this._updateHash("search", oEvent.getParameter("newValue"));
		},

		/**
		 * Event handler for the category selection
		 * @param {sap.ui.base.Event} oEvent the selectionChange event
		 */
		onSelectCategory : function (oEvent) {
			this._updateHash("cat", (oEvent.getParameter("selectedItem") ? oEvent.getParameter("selectedItem").getKey() : undefined));
		},

		/**
		 * Searches the icons for a single tag only and filters the bindings accordingly
		 * @param {sap.ui.base.Event} oEvent the liveChange event of the SearchField
		 * @public
		 */
		onTagSelect: function (oEvent) {
			this._updateHash("tag", oEvent.getParameter("selected") === false ? "" : oEvent.getSource().getText());
		},

		/**
		 * Toggles the favorite state of an icon when the user presses on the favorite button
		 * @param {sap.ui.base.Event} oEvent the press event of the ToggleButton
		 * @public
		 */
		onToggleFavorite: function (oEvent) {
			var sModelName = (this._oCurrentQueryContext.tab === "favorites" ? "fav" : undefined),
				oBindingContext = oEvent.getSource().getBindingContext(sModelName),
				sName = oBindingContext.getProperty("name"),
				oResourceBundle = this.getResourceBundle(),
				bFavorite = this.getModel("fav").toggleFavorite(oBindingContext);

			if (bFavorite) {
				MessageToast.show(oResourceBundle.getText("overviewFavoriteAdd", [sName]));
			} else {
				MessageToast.show(oResourceBundle.getText("overviewFavoriteRemove", [sName]));
			}
		},

		/**
		 * Switches between code and icon copy mode
		 * @param {sap.ui.base.Event} oEvent the select event of the RadioButtonGroup
		 */
		onCopySelect: function (oEvent) {
			var iIndex = oEvent.getParameter("selectedIndex");

			if (iIndex === 0) {
				this.byId("previewCopy").getContent()[0].setVisible(true);
				this.byId("previewCopy").getContent()[1].setVisible(false);
			} else {
				this.byId("previewCopy").getContent()[1].setVisible(true);
				this.byId("previewCopy").getContent()[0].setVisible(false);
			}
		},

		/**
		 * Copies the value of the code input field to the clipboard and displays a message
		 * @public
		 */
		onCopyCodeToClipboard: function () {
			var sIconSrc = this.byId("previewCopyCode").getValue();

			this._onCopyCodeToClipboard(sIconSrc);
		},

		/**
		 * Copies the unicode part from the input field to the clipboard and displays a message
		 * @public
		 */
		onCopyUnicodeToClipboard: function () {
			var sIconName = this.byId("preview").getBindingContext().getObject().name;

			this._onCopyUnicodeToClipboard(sIconName);
		},

		/**
		 * Copies the icon to the clipboard and displays a message
		 * @public
		 */
		onCopyIconToClipboard: function () {
			var sIconSrc = this.byId("previewCopyCode").getValue();

			this._onCopyIconToClipboard(sIconSrc);
		},

		/* =========================================================== */
		/* internal method                                             */
		/* =========================================================== */

		/**
		 * Copies the icon to the clipboard and displays a message
		 * @param {string} iconSrc the icon source string that has to be copied to the clipboard
		 * @private
		 */
		_onCopyIconToClipboard: function (iconSrc) {
			var	oResourceBundle = this.getResourceBundle(),
				sSuccessText, sExceptionText,
				sIcon = this.getModel().getUnicode(iconSrc);

			sSuccessText = oResourceBundle.getText("previewCopyToClipboardSuccess", [iconSrc]);
			sExceptionText = oResourceBundle.getText("previewCopyToClipboardFail", [iconSrc]);
			this._copyStringToClipboard(sIcon, sSuccessText, sExceptionText);
		},

		/**
		 * Copies the unicode part from the input field to the clipboard and displays a message
		 * @param {string} iconName the icon name string that has to be copied to the clipboard
		 * @private
		 */
		_onCopyUnicodeToClipboard: function (iconName) {
			var oResourceBundle = this.getResourceBundle(),
				sSuccessText, sExceptionText,
				sString = this.getModel().getUnicodeHTML(iconName);
			sString = sString.substring(2, sString.length - 1);
			sSuccessText = oResourceBundle.getText("previewCopyUnicodeToClipboardSuccess", [sString]);
			sExceptionText = oResourceBundle.getText("previewCopyUnicodeToClipboardFail", [sString]);
			this._copyStringToClipboard(sString, sSuccessText, sExceptionText);
		},

		/**
		 * Copies the value of the code input field to the clipboard and displays a message
		 * @param {string} iconSrc the icon source string that has to be copied to the clipboard
		 * @private
		 */
		_onCopyCodeToClipboard: function (iconSrc) {
			var oResourceBundle = this.getResourceBundle(),
				sSuccessText, sExceptionText;

			sSuccessText = oResourceBundle.getText("previewCopyToClipboardSuccess", [iconSrc]);
			sExceptionText = oResourceBundle.getText("previewCopyToClipboardFail", [iconSrc]);
			this._copyStringToClipboard(iconSrc, sSuccessText, sExceptionText);
		},

		/**
		 * Copies the string to the clipboard and displays a message
		 * @param {string} copyText the text string that has to be copied to the clipboard
		 * @private
		 */
		_copyStringToClipboard: function (copyText, successText, exceptionText) {
			var oTemp = document.createElement("input");

			try {
				document.body.append(oTemp);
				oTemp.value = copyText;
				oTemp.select();
				document.execCommand("copy");
				oTemp.remove();

				MessageToast.show(successText);
			} catch (oException) {
				MessageToast.show(exceptionText);
			}
		},

		/**
		 * Shows the selected item on the object page
		 * On phones an additional history entry is created
		 * @param {string} sIcon the icon name to be previewed
		 * @private
		 */
		_previewIcon : function (sIcon) {
			this.getModel().iconsLoaded().then(function () {
				var sPath = this.getModel().getIconPath(sIcon);

				if (sPath) {
					// bind the preview to the item path
					this.byId("preview").bindElement({
						path: sPath
					});

					// update the group information with a timeout as this task takes some time to calculate
					setTimeout(function () {
						var aGroups = this.getModel().getIconGroups(sIcon);
						this.byId("categoryInfo").setText(aGroups.join(", "));
					}.bind(this), 0);

					// update unicode info
					this.byId("unicodeInfo").setText(this.getModel().getUnicodeHTML(sIcon));
				}
			}.bind(this));
		},

		/**
		 * Updates the UI according to the hash
		 * @param {sap.ui.base.Event} oEvent the routing event
		 * @private
		 */
		_updateUI: function (oEvent) {
			var oArguments = oEvent.getParameter("arguments"),
				sFontName = oArguments.fontName || "SAP-icons",
				oQuery = oArguments["?query"],
				bInitial = false,
				oViewModel = this.getModel("view");

			// set a default query object in case no hash is defined
			if (!oQuery) {
				oQuery = {
					tab: "grid"
				};
			}

			// keep the previous item if all tab (remove filters) has been pressed
			if (oQuery.tab === "all") {
				oQuery.tab = this._oPreviousQueryContext.tab;
			}

			if (oQuery.icon) {
				this.expandSidePanel();
			}

			// check tab value against an allowlist
			var aValidKeys = ["details", "grid", "favorites"];
			if (aValidKeys.indexOf(oQuery.tab) < 0) {
				oQuery.tab = "grid";
			}

			// store current context
			if (!this._oCurrentQueryContext) {
				bInitial = true;
			}
			this._oCurrentQueryContext = oQuery;

			// helper variables for updating the UI pieces
			var bFontChanged = sFontName !== oViewModel.getProperty("/fontName");
			var bTabChanged = this._oPreviousQueryContext.tab !== oQuery.tab;
			var bCategoryChanged = this._oPreviousQueryContext.cat !== oQuery.cat;
			var bSearchChanged = this._oPreviousQueryContext.search !== oQuery.search;
			var bTagChanged = this._oPreviousQueryContext.tag !== oQuery.tag;
			var bIconChanged = this._oPreviousQueryContext.icon !== oQuery.icon;

			this._sAggregationName = "items";

			this.getOwnerComponent().iconsLoaded().then(function () {
				// bind the view if the displayed icon font changes or is not set yet
				if (bFontChanged) {
					// avoid refresh of preview area when setting new properties since we hide it anyway
					this.byId("preview") && this.byId("preview").unbindElement();

					// store the current font name in the view model and set the path to the new font (async)
					oViewModel.setProperty("/fontName", sFontName, null, true);
					oViewModel.setProperty("/iconPath", (sFontName === "SAP-icons" ? "" : sFontName + "/"), null, true);

					// update the view to the new path
					this.getView().bindElement({
						path: "/" + sFontName,
						suspend: true
					});

					// set the font on the icon model
					this.getModel().setFont(sFontName);
					oViewModel.setProperty("/busy", false, null, true);
				}
				this.byId("layoutSelectionSB").setSelectedKey(oQuery.tab);
				if (bTabChanged) {
					var oResultContainer = this.byId("resultContainer");

					// uppercase first letter
					var sFragmentName = formatter.uppercaseFirstLetter(oQuery.tab);

					// first destroy old content, then add new content to the end of result container
					this._resultsLoaded = Promise.resolve(this._resultsLoaded)
						.catch(function() {})
						.then(function() {
							oResultContainer.getContent()[2] && oResultContainer.getContent()[2].destroy();
							// load the fragment only now
							return Fragment.load({
								id: this.getView().getId(),
								name: "sap.ui.demo.iconexplorer.view.browse." + sFragmentName,
								controller: this
							});
						}.bind(this))
						.then(function(oFragmentContent){
							oResultContainer.addContent(oFragmentContent);
						});

					var bCategoriesVisible = !(Device.system.phone || oQuery.tab == "favorites");
					this.byId("categorySelectionContainer").setVisible(bCategoriesVisible);
				}

				this._resultsLoaded.then(function() {
					// icon
					if (oQuery.icon && bIconChanged) {
						this._previewIcon(oQuery.icon);
						this.byId("preview").setVisible(true);
					} else if (!oQuery.icon) {
						if (bInitial) {
							this._previewIcon("sap-ui5");
						}
						this.byId("preview").setVisible(false);
					}

					// category
					this.byId("categorySelection").setSelectedKey(oQuery.cat || "all");
					if ((oQuery.cat || bCategoryChanged || bFontChanged) && oQuery.tab !== "favorites") {
						if (bInitial || bFontChanged || bTabChanged) {
							this._selectCategory(oQuery);
						} else {
							clearTimeout(this._iCategorySelectionTimeout);
							this._iCategorySelectionTimeout = setTimeout(function () {
								this._selectCategory(oQuery);
							}.bind(this), TYPING_DELAY);
						}
					}

					// search & tags
					this.byId("searchField").setValue(oQuery.search);
					if (bInitial || bFontChanged || bSearchChanged || bTagChanged || bTabChanged) {
						// search
						if (bInitial || bFontChanged || bTabChanged) {
							this._searchIcons(oQuery.search, oQuery.tag);
						} else {
							clearTimeout(this._iSearchTimeout);
							this._iSearchTimeout = setTimeout(function () {
								this._searchIcons(oQuery.search, oQuery.tag);
							}.bind(this), TYPING_DELAY);
						}

						// tags
						if (bInitial || bFontChanged || bTabChanged) {
							if (oQuery.tab === "favorites") {
								this._aCategoryTags = undefined;
							}
							this._updateTags(oQuery);
						} else {
							clearTimeout(this._iTagTimeout);
							this._iTagTimeout = setTimeout(function () {
								this._updateTags(oQuery);
							}.bind(this), TYPING_DELAY);
						}
					}
				}.bind(this));

			}.bind(this));
		},

		/**
		 * Updates the hash with the current UI state
		 * @param {string} [sKey] the key of the query to be updated
		 * @param {string} [sValue] the value of the query to be updated
		 * @private
		 */
		_updateHash: function (sKey, sValue) {
			var oQuery = {};

			// deep copy of the context
			if (this._oCurrentQueryContext.tab) {
				oQuery.tab = this._oCurrentQueryContext.tab;
			}
			if (this._oCurrentQueryContext.icon) {
				oQuery.icon = this._oCurrentQueryContext.icon;
			}
			if (this._oCurrentQueryContext.search) {
				oQuery.search = this._oCurrentQueryContext.search;
			}
			if (this._oCurrentQueryContext.cat) {
				oQuery.cat = this._oCurrentQueryContext.cat;
			}
			if (this._oCurrentQueryContext.tag) {
				oQuery.tag = this._oCurrentQueryContext.tag;
			}

			// explicit reset for tags and search when the all item was pressed
			if (sKey === "reset") {
				delete oQuery.tag;
				delete oQuery.search;
				delete oQuery.cat;
			} else {
				// override the key value pair passed in as parameters
				if (sKey && sValue) {
					oQuery[sKey] = sValue;
				}

				// reset tags under the following conditions
				// - navigating from or to favorite tab
				// - category was changed
				// - emtpy tag value
				if (this._oCurrentQueryContext.tab !== oQuery.tab  && (this._oCurrentQueryContext.tab === "favorites" || oQuery.tab === "favorites") ||
					this._oCurrentQueryContext.cat !== oQuery.cat ||
					sKey === "tag" && !sValue) {
					delete oQuery.tag;
				}

				// reset search if no value has been passed
				if (sKey === "search" && !sValue) {
					delete oQuery.search;
				}

				// reset icon if no value has been passed
				if (sKey === "icon" && !sValue) {
					delete oQuery.icon;
				}
			}

			// call route with query parameter
			this.getRouter().navTo("overview", {
				fontName: this.getModel("view").getProperty("/fontName"),
				query: oQuery
			});

			// store previous context
			this._oPreviousQueryContext = this._oCurrentQueryContext;
			// store the new context
			this._oCurrentQueryContext = oQuery;
		},

		/**
		 * Does the real search after a short delay to improve the perceived performance of the app
		 * The following search modes can apply depending on the parameter values
		 * - search, no tag: reset the filters
		 * - search, no tag: search for the string in the name OR the tags of the icons
		 * - no search, tag: search for the tag in the tags of the icons
		 * - search, tag: search for the tag in the tags of the icons AND search for the string in the name OR the tags of the icons
		 * @param {string} sSearchValue the search string
		 * @param {string} sTagValue the tag string
		 * @private
		 */
		_searchIcons : function (sSearchValue, sTagValue) {
			if (sSearchValue || sTagValue) {
				// only initialize the filters if needed to save some time
				var aFilters = [],
					oFilterTags = (sTagValue ? new Filter("tagString", FilterOperator.Contains, sTagValue) : undefined),
					oFilterSearchName = (sSearchValue ? new Filter("name", FilterOperator.Contains, sSearchValue) : undefined),
					fnUnicodeCustomFilter = (sSearchValue ? this._unicodeFilterFactory(sSearchValue) : undefined),
					oFilterSearchUnicode = (sSearchValue ? new Filter("name", fnUnicodeCustomFilter) : undefined),
					oFilterSearchTags = (sSearchValue ? new Filter("tagString", FilterOperator.Contains, sSearchValue) : undefined),
					oFilterSearchNameTags = (sSearchValue ? new Filter({
						filters: [oFilterSearchTags, oFilterSearchName, oFilterSearchUnicode],
						and: false
					}) : undefined);

				// search for name
				if (sSearchValue) {
					aFilters.push(oFilterSearchNameTags);
				}
				// search for tags
				if (sTagValue) {
					aFilters.push(oFilterTags);
				}
				if (aFilters.length <= 1) {
					// search or tag: just take the filter
					this._vFilterSearch = aFilters;
				} else {
					// search and tag: tags contain the tag value and search for name or tags
					this._vFilterSearch = [new Filter({
						filters: aFilters,
						and: true
					})];
				}
			} else {
				// reset search
				this._vFilterSearch = [];
			}

			// filter icon list
			this._resultsLoaded.then(function () {
				var oResultBinding = this.byId("results").getBinding(this._sAggregationName);
				if (oResultBinding !== undefined) {
					oResultBinding.filter(this._vFilterSearch);
					this.getModel("view").setProperty("/overviewNoDataText", this.getResourceBundle().getText("overviewNoDataWithSearchText"), null, true);
				}
			}.bind(this));
		},

		/**
		 * Factory that produces the custom filter for the given unicode query
		 * @param {string} query the query text that has been entered in the search field and contains the unicode character
		 * @return {function} the custom filter function that takes the name of the icon and returns true if the icon's unicode contains the query string
		 * @private
		 */
		_unicodeFilterFactory: function(query) {
			return function (name) {
				var sUnicode = this.getModel().getUnicodeHTML(name.toLowerCase());
				return sUnicode.indexOf(query) !== -1;
			}.bind(this);
		},

		/**
		 * Event handler for the category selection
		 * @param {object} oQuery the query object from the routing event
		 * @private
		 */
		_selectCategory: function (oQuery) {
			var sGroupPath = this.getModel().getGroupPath(oQuery.cat);

			// rebind the result set to the current group
			this.byId("results").bindAggregation(this._sAggregationName, {
				path: sGroupPath + "/icons",
				length: this.getModel("view").getProperty("/growingThreshold"),
				template: this.byId("results").getBindingInfo(this._sAggregationName).template.clone(),
				templateShareable: true,
				events: {
					change: this.onUpdateFinished.bind(this)
				},
				suspended: true
			});
			// apply filters
			this._resultsLoaded.then(function () {
				this.byId("results").getBinding(this._sAggregationName).filter(this._vFilterSearch);
			}.bind(this));

			// update tags
			this._aCategoryTags = this.getModel().getProperty(sGroupPath + "/tags");
			// update tag bar directly with all tags of this category when no search or tag is selected
			if (!oQuery.tag && !oQuery.search) {
				this._updateTagSelectionBar(this._aCategoryTags);
			}
		},

		/**
		 * updates the tags to the currently available binding contexts
		 * @param {Object} oQuery the current query state
		 * @private
		 */
		_updateTags: function (oQuery) {
			// caution: it is really important to use getCurrentContexts and not getContexts here as the later modifies the binding
			this._resultsLoaded.then(function () {
				var aContexts = this.byId("results").getBinding(this._sAggregationName).getCurrentContexts(),
					aAllTags = [],
					aCurrentTags = [],
					bTagVisible = false,
					sFontName = this.getModel("view").getProperty("/fontName"),
					i;

				// collect all current tags from the result list
				for (i = 0; i < aContexts.length; i++) {
					aAllTags = aAllTags.concat(aContexts[i].getProperty("tags").map(function(oItem) { return oItem.name; }));
				}

				// no category selected yet: use all tags
				if (!this._aCategoryTags) {
					this._aCategoryTags = this.getModel().getProperty("/" + sFontName + "/groups/0/tags");
				}

				// filter tags to the currently visible
				for (i = 0; i < this._aCategoryTags.length; i++) {
					if (aAllTags.indexOf(this._aCategoryTags[i].name) >= 0) {
						this._aCategoryTags[i].selected = (this._aCategoryTags[i].name === oQuery.tag);
						if (this._aCategoryTags[i].selected) {
							bTagVisible = true;
						}
						aCurrentTags.push(this._aCategoryTags[i]);
					}
				}

				// add current tag if it is not visible yet (tag bar only contains the top [x] tags)
				if (oQuery.tag && !bTagVisible) {
					aCurrentTags.push({
						selected : true,
						name : oQuery.tag
					});
				}

				// update model data and bind the tags
				this._updateTagSelectionBar(aCurrentTags);
			}.bind(this));
		},

		/**
		 * Binds tags to the tag selection bar and appends a label
		 * @param {object[]} aTags the tags to be bound
		 * @private
		 */
		_updateTagSelectionBar: function (aTags) {
			this.getModel("tags").setData(aTags);
			this.byId("tagSelection").bindAggregation("tokens", {
				path: "tags>/",
				length: 51,
				factory: this._tagSelectionFactory.bind(this)
			});
		},

		/**
		 * Factory function for filling the tag bar.
		 * First item is a label, then the tags are listed
		 * @param {string} sId the id for the control to be created
		 * @param {sap.ui.model.Context} oContext the binding context for the control to be created
		 * @return {sap.m.Label|sap.m.Token} the control for the toolbar
		 * @private
		 */
        _tagSelectionFactory: function (sId, oContext) {
			return new Token(sId, {
				text: "{tags>name}",
				press: [this.onTagSelect, this],
				selected: "{tags>selected}",
				ariaLabelledBy: this.byId("labelTags"),
				editable: false
			});
        },

		/**
		 * Expands the details view when icon is clicked.
		 */

		expandSidePanel: function() {
			var oSidePanelExpanded = this.byId("mySidePanel").getProperty("actionBarExpanded");

			if (!oSidePanelExpanded) {
				this.byId("mySidePanel").setProperty("actionBarExpanded", true);
			}

		}

	});
});
/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/demo/iconexplorer/controls/TitleLink", [
	'sap/ui/core/library',
	"sap/ui/core/Renderer",
	'sap/ui/Device',
	'sap/m/Toolbar',
	'sap/m/Title'
], function(coreLibrary, Renderer, Device, Toolbar, Title) {
	"use strict";

	// shortcut for sap.ui.core.TitleLevel
	var TitleLevel = coreLibrary.TitleLevel;

	/**
	 * @class
	 * Adds link functionality and wrapping to the existing title control for display in the demo kit application
	 * @extends sap.m.Title
	 */
	var TitleLink = Title.extend("sap.ui.demo.iconexplorer.controls.TitleLink", {
		metadata: {
			properties: {
				/**
				 * Options are the standard values for window.open() supported by browsers: _self, _top, _blank, _parent, _search. Alternatively, a frame name can be entered. This property is only used when the href property is set.
				 */
				target : {type : "string", group : "Behavior", defaultValue : null},

				/**
				 * The link target URI. Supports standard hyperlink behavior. If a JavaScript action should be triggered, this should not be set, but instead an event handler for the "press" event should be registered.
				 */
				href : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

				/**
				 * Stores a text that can be different to the text property for filtering purposes
				 */
				filter : {type : "string", group : "Data", defaultValue : ""},

				/**
				 * If set to true, the text will wrap to multiple lines, if not it will truncate on a single line
				 */
				wrap : {type : "boolean", group : "Behavior", defaultValue : true}
			},
			events: {
				/**
				 * Event is fired when the user triggers the link control.
				 */
				press : {allowPreventDefault : true}
			}
		},

		init: function () {
			if (Device.support.touch) {
				this.ontap = this._handlePress;
			} else {
				this.onclick = this._handlePress;
			}

			/**
			 * Handles the touch event on mobile devices.
			 *
			 * @param {jQuery.Event} oEvent
			 */
			this.ontouchstart = function(oEvent) {
				if (this.getHref()) {
					// for controls which need to know whether they should handle events bubbling from here
					oEvent.setMarked();
				}
			};
		},

		/**
		 * Triggers link activation when space key is pressed on the focused control.
		 *
		 * @param {jQuery.Event} oEvent
		 */
		onsapspace : function(oEvent) {
			this._handlePress(oEvent); // this calls any JS event handlers
			// _handlePress() checks the return value of the event handler and prevents default if required or of the Link is disabled
			if (this.getHref() && !oEvent.isDefaultPrevented()) {
				// Normal browser link, the browser does the job. According to the keyboard spec, Space should do the same as Enter/Click.
				// To make the browser REALLY do the same (history, referrer, frames, target,...), create a new "click" event and let the browser "do the needful".

				// first disarm the Space key event
				oEvent.preventDefault(); // prevent any scrolling which the browser might do because from its perspective the Link does not handle the "space" key
				oEvent.setMarked();

				// then create the click event
				var oClickEvent = document.createEvent('MouseEvents');
				oClickEvent.initEvent('click' /* event type */, false, true); // non-bubbling, cancelable
				this.getDomRef().dispatchEvent(oClickEvent);
			}
		},

		/**
		 * Handler for the "press" event of the link.
		 *
		 * @param {jQuery.Event} oEvent
		 * @private
		 */
		_handlePress : function(oEvent) {
			oEvent.setMarked();

			if (!this.firePress() || !this.getHref()) { // fire event and check return value whether default action should be prevented
				oEvent.preventDefault();
			}
		},

		setHref : function(sUri){
			this.setProperty("href", sUri, true);
			sUri = this.getProperty("href");
			this.$().attr("href", sUri);
			return this;
		},

		setTarget : function(sTarget){
			this.setProperty("target", sTarget, true);
			if (!sTarget) {
				this.$().removeAttr("target");
			} else {
				this.$().attr("target", sTarget);
			}
			return this;
		},

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
		 * @param {sap.ui.core.Control} oTitle an object representation of the control that should be rendered
		 */
		renderer: {
			apiVersion: 2,
			render: function (oRm, oTitle) {
				var oAssoTitle = oTitle._getTitle(),
					sLevel = (oAssoTitle ? oAssoTitle.getLevel() : oTitle.getLevel()) || coreLibrary.TitleLevel.Auto,
					bAutoLevel = sLevel == TitleLevel.Auto,
					sTag = bAutoLevel ? "div" : sLevel.toLowerCase(),
					sTextAlign = Renderer.getTextAlign(oTitle.getTextAlign());

				oRm.openStart(sTag, oTitle)
					.class("sapUiDocTitleLink")
					.class("sapMTitle")
					.class("sapMTitleStyle" + (oTitle.getTitleStyle() || coreLibrary.TitleLevel.Auto))
					.class("sapUiSelectable");

				// adding wrap functionality begin
				if (oTitle.getWrap()) {
					oRm.class("wrap");
				} else {
					oRm.class("sapMTitleNoWrap");
				}
				// adding wrap functionality end

				var sWidth = oTitle.getWidth();
				if (!sWidth) {
					oRm.class("sapMTitleMaxWidth");
				} else {
					oRm.style("width", sWidth);
				}

				if (sTextAlign) {
					oRm.style("text-align", sTextAlign);
				}

				if (oTitle.getParent() instanceof Toolbar) {
					oRm.class("sapMTitleTB");
				}

				var sTooltip = oAssoTitle ? oAssoTitle.getTooltip_AsString() : oTitle.getTooltip_AsString();
				if (sTooltip) {
					oRm.attr("title", sTooltip);
				}

				if (bAutoLevel) {
					oRm.attr("role", "heading");
				}

				oRm.openEnd();

					// adding link functionality begin
					oRm.openStart("a")
						.class("sapMLnk")
						.attr("tabindex", oTitle.getText() ? "0" : "-1")
						.attr("href", oTitle.getHref());

					if (oTitle.getTarget()) {
						oRm.attr("target", oTitle.getTarget());
					}
					oRm.openEnd();
					// adding link functionality end

						oRm.openStart("span", oTitle.getId() + "-inner")
							.openEnd()
							.text(oAssoTitle ? oAssoTitle.getText() : oTitle.getText())
							.close("span");

					oRm.close("a");
				oRm.close(sTag);
			}
		}
	});

	return TitleLink;
});
sap.ui.predefine("sap/ui/demo/iconexplorer/localService/mockserver", [
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/base/Log"
], function (JSONModel, sinon, Log) {
	"use strict";

	var iAutoRespondAfterDefault = 10;

	return {
		/**
		 * Initializes the mock server.
		 * @public
		 */
		init: function () {
			var oUriParameters = new URLSearchParams(window.location.search);
			this._oMockModels = {

			};

			// load the mock fonts before initializing the mock server
			this._mockFont("SAP-icons");
			this._mockFont("SAP-icons-TNT");

			// create a fake server with configurable delay
			this.oServer = sinon.fakeServer.create();
			this.oServer.autoRespond = true;
			this.oServer.autoRespondAfter = parseInt(oUriParameters.get("serverDelay") || iAutoRespondAfterDefault);

			// set up the filters for the mocked URLs
			sinon.fakeServer.xhr.useFilters = true;
			this.oServer.xhr.addFilter(function (method, url) {
				var bMockUrl = Object.keys(this._oMockModels).some(function (sMockUrl) {
					return url.match(sMockUrl);
				});
				return !bMockUrl;
			}.bind(this));

			// set up the responses for the mocked URLs
			Object.keys(this._oMockModels).forEach(function (sName) {
				this.oServer.respondWith("GET", sName,
					[200, {"Content-Type": "application/json"}, this._oMockModels[sName].getJSON()]
				);
			}.bind(this));

			Log.info("Running the app with mock data");
		},

		getMockServer: function () {
			return this;
		},

		/**
		 * Sets the path and loads the mock data models for the current icon font
		 * @param {string} sName the font name to be mocked
		 * @private
		 */
		_mockFont: function (sName) {
			var sGroupsUrl = sap.ui.require.toUrl("sap/ui/demo/iconexplorer/model/" + sName + "/groups.json");
			var sTagsUrl = sap.ui.require.toUrl("sap/ui/demo/iconexplorer/model/" + sName + "/tags.json");

			var sGroupsMockUrl = sap.ui.require.toUrl("sap/ui/demo/iconexplorer/localService/mockdata/" + sName + "/groups.json");
			var sTagsMockUrl = sap.ui.require.toUrl("sap/ui/demo/iconexplorer/localService/mockdata/" + sName + "/tags.json");

			// we need to load the models before configuring the fake server
			// faking the real call and load the real models (we just want to use a timer for opa tests)
			// at the same time is just impossible
			var oGroupsModel = this._loadModelFromDisk(sGroupsMockUrl);
			var oTagsModel = this._loadModelFromDisk(sTagsMockUrl);

			this._oMockModels[sGroupsUrl] = oGroupsModel;
			this._oMockModels[sTagsUrl] = oTagsModel;
		},

		/**
		 * Loads the mock data models from the given path
		 * @param {string} sPath path to the mock data
		 * @returns {sap.ui.model.json.JSONModel} JSONModel containing the mock data
		 * @private
		 */
		_loadModelFromDisk: function (sPath) {
			var aNoParams = [];
			var oModel = new JSONModel();
			var bLoadSync = false;

			oModel.loadData(sPath, aNoParams, bLoadSync);

			return oModel;
		}
	};

});
sap.ui.predefine("sap/ui/demo/iconexplorer/model/FavoriteModel", [
	"sap/ui/demo/iconexplorer/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/util/Storage",
	"sap/base/Log"
], function(Sorter, JSONModel, Storage, Log) {
	"use strict";

	return JSONModel.extend("sap.ui.demo.iconexplorer.model.FavoriteModel", {

		_STORAGE_KEY : "ICON_EXPLORER_FAVORITES",
		_storage : new Storage(Storage.Type.local),

		/**
		 * Fetches the favorites from local storage and sets up the JSON model
		 * @param {Object} oSettings a settings object passed to the JSON model
		 * @return {sap.ui.demo.iconexplorer.model.FavoriteModel} the new model instance
		 */
		constructor : function(oSettings) {
			// call super constructor
			JSONModel.apply(this, arguments);

			this.setSizeLimit(1000000);

			// load data from local storage
			var sJSON = this._storage.get(this._STORAGE_KEY);
			var oData;

			try {
				oData = JSON.parse(sJSON);
			} catch (oException) {
				Log.warning("FavoriteModel: Could not parse the data read from local storage");
			}

			// default data if storage is empty
			if (!oData) {
				oData = {
					count : 0,
					icons : []
				};
			}

			// set data
			this.setData(oData);

			return this;
		},

		/**
		 * Checks if a given icon is a favorite
		 * @param {string} sName the icon name
		 * @return {boolean} the favorite state of the icon
		 */
		isFavorite : function(sName) {
			var oData = this.getData();

			return oData.icons.some(function(oItem) {
				return oItem.name === sName;
			});
		},

		/**
		 * Toogles the favorite state of a given icon
		 * @param {sap.ui.model.Context} oBindingContext the binding context of the icon to be toggled
		 * @return {boolean} the new favorite state of the icon
		 */
		toggleFavorite : function(oBindingContext) {
			var sName = oBindingContext.getProperty("name"),
				bFavorite = this.isFavorite(sName),
				oData = this.getData();

			if (bFavorite) {
				oData.icons = oData.icons.filter(function(oIcon){
					return oIcon.name !== sName;
				});
			} else {
				oData.icons.push(oBindingContext.getObject());
			}
			oData.count = oData.icons.length;

			// sort icons by name
			oData.icons.sort(Sorter.sortByName);

			// update model
			this.setData(oData);

			// update local storage
			var sJSON = JSON.stringify(oData);
			this._storage.put(this._STORAGE_KEY, sJSON);

			return !bFavorite;
		}
	});
});
sap.ui.predefine("sap/ui/demo/iconexplorer/model/IconModel", [
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/IconPool",
	"sap/ui/demo/iconexplorer/model/Sorter",
	"sap/base/Log"
], function (JSONModel, IconPool, Sorter, Log) {
	"use strict";

	return JSONModel.extend("sap.ui.demo.iconexplorer.model.IconModel", {

		/**
		 * Constructor for the IconModel
		 * It contains icons from all loaded fonts, sorted into groups with the following structure
		 * /AllFonts: flat list of all loaded fonts with the technical property "name" for each entry
		 * /AllIcons: flat list of icons from all fonts that can be used for a global search
		 * /FontName: for each loaded font an entry is created containing
		 *   - [groups]: array of groups of the font as specified in the metadata and the generated "all" group
		 *             containing all icons of the font that can be used for a font-specific search
		 *     - name: group name
		 *     - count: number of icons in this group
		 *     - [icons]: array of icons consisting of the following properties
		 *         - name: technical name of the icon
		 *         - iconPath: path to the icon (used mostly for managing favorites)
		 *         - font: name of the font the icon is part of (for more binding convenience)
		 *         - delivery: SAPUI5, OpenUI5, or Other depending on the delivery channel of the font
		 *         - tags: array of tags for the icon
		 *           - name: the name of the tag
		 *         - tagString: all tags concatenated for a more efficient search
		 * @class
		 * @public
		 * @alias sap.ui.demo.iconexplorer.model.IconModel
		 */
		constructor : function () {

			// call base class constructor
			JSONModel.apply(this, arguments);

			// reset default size limit
			this.setSizeLimit(Infinity);
			return this;
		},

		/**
		 * Initializes and fills the model with groups and tags information for all icon fonts
		 * @param {Array} aIconFonts contains all fonts names we want to load
		 */
		init: function (aIconFonts) {
			// set up the JSON model data in a timeout to not block the UI while loading the app
			this._iStartTime = new Date().getTime();

			// initialize icon array for global search
			this.setProperty("/AllIcons", []);
			this.setProperty("/AllFonts", []);
			// add new array to model to check whether fonts are loaded or not
			this.setProperty("/AllFontsLoaded", []);

			var aPromises = [];
			for (var i = 0; i < aIconFonts.length; i++){
				aPromises.push(this._loadIcons(aIconFonts[i]));
			}
			this._pIconsLoaded = Promise.all(aPromises);

			// add the BusinessSuiteInAppSymbols font to the AllFontsLoaded array
			// to avoid problems with visibility because the json file is in OpenUI5 not requested
			var aAllFontsLoaded = this.getProperty("/AllFontsLoaded");
			aAllFontsLoaded["BusinessSuiteInAppSymbols"] = false;
		},

		/**
		 * Register to this promise to get notified when the icon model is initialized
		 * @returns {Promise} resolved when all icon font metadata is loaded
		 */
		iconsLoaded: function () {
			return this._pIconsLoaded;
		},

		/**
		 * Set the currently displayed main font to fetch icon and group paths correctly
		 * @param {string} sFontName a valid font name
		 */
		setFont : function (sFontName) {
			this._sFontName = sFontName;
		},

		/**
		 * Returns the binding path of an icon for a given icon name
		 * @param {string} sName the icon name
		 * @param {string} [sGroupPath] the path to the group to search in
		 * @return {string} the icon path
		 */
		getIconPath: function (sName, sGroupPath) {
			var sIconPath = sGroupPath || "/groups/0";
			sIconPath =  "/" + this._sFontName + sIconPath + "/icons";

			var aIcons = this.getProperty(sIconPath),
				iIconIndex;

			for (var i = 0; i < aIcons.length; i++) {
				if (aIcons[i].name === sName) {
					iIconIndex = i;
					break;
				}
			}

			if (iIconIndex >= 0) {
				return sIconPath + "/" + iIconIndex;
			} else if (sName !== "error") {
				return this.getIconPath("error", sGroupPath);
			}
		},

		/**
		 * Returns the binding path for a given group name
		 * @param {string} sGroupName the name of the group
		 * @return {string} the binding path for the group
		 */
		getGroupPath: function (sGroupName) {
			var sGroupPath = "/" + this._sFontName + "/groups",
				aGroups = this.getProperty(sGroupPath),
				iIndex = 0;

			for (var i = 0; i < aGroups.length; i++) {
				if (aGroups[i].name === sGroupName) {
					iIndex = i;
					break;
				}
			}
			return sGroupPath + "/" + iIndex;
		},

		/**
		 * Returns the groups the icon is assigned to
		 * @param {string} sIconName the icon name
		 * @return {Array} the groups the icon is assigned to
		 */
		getIconGroups: function (sIconName) {
			var sGroupPath = "/" + this._sFontName + "/groups",
				aGroups = this.getProperty(sGroupPath),
				aIconGroups = [];

			if (aGroups) {
				aGroups = aGroups.slice(1);

				aIconGroups = aGroups.filter(function (oGroup) {
					return oGroup.icons.some(function (oItem) {
						return oItem.name == sIconName;
					});
				});
			}
			return 	aIconGroups.map(function(oGroup) {
				return oGroup.text;
			});
		},

		/**
		 * Returns the unicode symbol for an icon
		 * @param {string} sName the icon name
		 * @return {string} the unicode representation of the icon
		 */
		getUnicode: function (sName) {
			var sFontName = (this._sFontName === "SAP-icons" ? undefined : this._sFontName),
				oInfo = IconPool.getIconInfo(sName, sFontName);

			return (oInfo ? oInfo.content : "?");
		},

		/**
		 * Returns the unicode symbol in HTML syntax for an icon
		 * @param {string} sName the icon name
		 * @return {string} the unicode HTML representation of the icon
		 */
		getUnicodeHTML: function (sName) {
			var sFontName = (this._sFontName === "SAP-icons" ? undefined : this._sFontName),
				oInfo = IconPool.getIconInfo(sName, sFontName);

			return (oInfo && oInfo.content ? "&#x" + oInfo.content.charCodeAt(0).toString(16) + ";" : "?");
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Load and process groups and tags of icon fonts from the metadata
		 * @param {string} sFontName name of currently selected font to be loaded
		 * @private
		 */
		_loadIcons: function (sFontName) {
			var aPromises = [];

			["groups.json", "tags.json"].forEach(function (sName) {
				aPromises.push(new Promise(function (fnResolve, fnReject) {
					// load font metadata asynchronously
					var oJSONModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/iconexplorer/model/" + sFontName + "/" + sName));
					oJSONModel.attachRequestCompleted(function ()  {
						fnResolve(this.getData());
					});
					oJSONModel.attachRequestFailed(function (oError) {
						fnReject(oError);
					});
				}));
			} );

			//process data when groups and tags are loaded
			return Promise.all(aPromises).then(function (aData) {
				this._onMetadataLoaded(sFontName, aData[0], aData[1]);
			}.bind(this), function (oError) {
				this._onError(oError);
			}.bind(this));
		},

		/**
		 * Post process all data for display in the icon explorer
		 * @param {string} sFontName name of currently selected font to be loaded
		 * @private
		 */
		_onMetadataLoaded : function(sFontName, oGroups, oTags)  {
			var aAllFontsLoaded = this.getProperty("/AllFontsLoaded");
			// store in model which fonts are loaded (IconPool.fontLoaded returns promise if font was loaded, undefined otherwise)
			if (sFontName === "SAP-icons" || IconPool.fontLoaded(sFontName)) {
				aAllFontsLoaded[sFontName] = true;
			} else {
				aAllFontsLoaded[sFontName] = false;
			}

			this.setProperty("/AllFontsLoaded", aAllFontsLoaded);


			// process groups and tags
			this._processGroups(oGroups);
			this._processTags(sFontName, oTags, oGroups);

			var aAllFonts = this.getProperty("/AllFonts");
			aAllFonts.push({name: sFontName});

			this.setProperty("/AllFonts", aAllFonts);

			// trace elapsed time
			Log.info("IconModel: Loaded and sorted all icons of " + sFontName + " in " + (new Date().getTime() - this._iStartTime) + " ms");

			// set the model data
			this.setProperty("/" + sFontName, oGroups);
		},

		/**
		 * Fires a request failed event in case the metadata for the icons could not be read
		 * @param {object} oResponse the response object from the ajax request
		 * @private
		 */
		_onError: function (oResponse) {
			oResponse.error = "Failed to load the icon metadata, check for parse errors";
			this.fireRequestFailed({response: oResponse});
		},

		/**
		 * Processes all groups: sort groups by name and enrich the model data
		 * Sorting is done in the model once for faster processing in the views
		 * @param {array} oGroups name of currently selected font to be loaded
		 * @private
		 */
		_processGroups : function(oGroups) {
			oGroups.groups.sort(Sorter.sortByName);
			oGroups.groups.forEach(function (oInnerGroup) {
				if (oInnerGroup.icons) {
					oInnerGroup.count = oInnerGroup.icons.length;
					oInnerGroup.icons.sort(Sorter.sortByName);
				}
			});
		},

		/**
		 * Processes all tags.
		 * Create an "all" group for every font under index 0.
		 * Also, create an AllIcons path in the model, that contains icons from all loaded fonts
		 * Relate tags to icons in all groups.
		 * @param {string} sFontName the Name of font we currently want to relate icon tags
		 * @param {Object} oTags raw tag data
		 * @param {Object} oGroups raw group data
		 * @private
		 */
		_processTags : function (sFontName, oTags, oGroups) {
			var	aIconNames = IconPool.getIconNames(sFontName === "SAP-icons" ? undefined : sFontName),
				sIconPath = (sFontName === "SAP-icons" ? "" : sFontName + "/"),
				sDelivery = (["SAP-icons", "SAP-icons-TNT"].indexOf(sFontName) >= 0 ? "OpenUI5" : "SAPUI5");

			// Remove icons starting with capitol character from the "SAP-icons-TNT" font, because they are deprecated.
			if (sFontName === "SAP-icons-TNT") {
				aIconNames = aIconNames.filter(function (sIconName) {
					return sIconName[0] !== sIconName[0].toUpperCase();
				});
			}

			// add all icons from icon pool and append tag info
			var aIcons = aIconNames.map(function (sIconName) {
				var oIconMetadata = oTags[sIconName],
					aTags = [];

				if (oIconMetadata) {
					aTags = oIconMetadata.tags.map(function (sTag) {
						return {name: sTag};
					});
				}

				return {
					name : sIconName,
					iconPath : sIconPath,
					font : sFontName,
					delivery : sDelivery,
					tags : aTags,
					tagString : (oIconMetadata ? oIconMetadata.tags.join(" ") : "")
				};
			});
			// Sort the Icons
			aIcons.sort(Sorter.sortByName);

			// add the all group for this font at index 0
			oGroups.groups.splice(0, 0, {
				name : "all",
				text : "All",
				icons : aIcons,
				count : aIcons.length
			});

			this.setProperty("/AllIcons", this.getProperty("/AllIcons").concat(aIcons));

			// calculate top tag and relate tags to other groups than "all"
			this._calculateTagsPerGroup(oGroups, sFontName);
		},

		/**
		 * Calculates the top tag and relates the tags from the "all" group to each group
		 * @param {array} oGroups name of currently selected font to be loaded
		 * @private
		 */
		_calculateTagsPerGroup: function (oGroups) {
			for (var i = 0; i < oGroups.groups.length; i++) {
				var oTagOccurrence = {};

				// Loop over all icons in the current group
				for (var j = 0; j < oGroups.groups[i].icons.length; j++) {
					var oTags = {};
					var aIcon = this._getIconMetadata(oGroups.groups[0], oGroups.groups[i].icons[j]);

					// Copy over tags from all sections
					if (aIcon) {
						oGroups.groups[i].icons[j].tags = aIcon.tags;
						oGroups.groups[i].icons[j].tagString = aIcon.tagString;
						oTags = aIcon.tags;
					} else {
						Log.info("IconModel: Failed to load tags for " + oGroups.groups[i].icons[j].name);
					}

					// Count tag occurrence for every tag in group
					if (oTags) {
						for (var k = 0; k < oTags.length; k++) {
							if (!oTagOccurrence[oTags[k].name]) {
								oTagOccurrence[oTags[k].name] = 1;
							} else {
								oTagOccurrence[oTags[k].name]++;
							}
						}
					}
				}
				// Sort tags by their occurrence
				var aSortedGroupTags = this._sortGroupTags(oTagOccurrence);

				// Create new tags property for groups and add sorted group tags
				oGroups.groups[i].tags = [];
				for (var x = 0; x < aSortedGroupTags.length; x++) {
					oGroups.groups[i].tags.push({ "name" : aSortedGroupTags[x]});
				}
			}
		},

		/**
		 * Sort tags by their occurrence descending
		 * @param {Object} oTagOccurrence map of tags with their occurance
		 * @returns {string[]} A list of tags sorted by their occurance
		 * @private
		 */
		_sortGroupTags : function (oTagOccurrence) {
			return Object.keys(oTagOccurrence).sort(function (sKey1, sKey2) {
				if (oTagOccurrence[sKey1] === oTagOccurrence[sKey2]) {
					return 0;
				} else if (oTagOccurrence[sKey1] < oTagOccurrence[sKey2]) {
					return 1;
				} else {
					return -1;
				}
			});
		},

		/**
		 * Finds icon metadata in the all group
		 * @param {Object} oAllGroup a map of all icons for the current font
		 * @param {Object} oCurrentIcon the item to look up
		 * @returns {Object} the icon metadata requested
		 * @private
		 */
		_getIconMetadata : function (oAllGroup, oCurrentIcon) {
			var aIcons = oAllGroup.icons;
			for ( var i = 0; i < aIcons.length; i++ ) {
				if (aIcons[i].name === oCurrentIcon.name) {
					return aIcons[i];
				}
			}
		}
	});
});
sap.ui.predefine("sap/ui/demo/iconexplorer/model/Sorter", [], function() {
	"use strict";

	return {
		/**
		 * Sorts icons by icon name
		 * @param {Object} oContext1 The first context
		 * @param {Object} oContext2 The second context
		 * @return {number} the sorting result (-1, 0, 1)
		 */
		sortByName : function(oContext1, oContext2) {
			if (!oContext1 || !oContext1.name) {
				return -1;
			} else if (!oContext2 || !oContext2.name) {
				return 1;
			} else {
				var sContext1Name = oContext1.name.toLowerCase();
				var sContext2Name = oContext2.name.toLowerCase();

				if (sContext1Name < sContext2Name) {
					return -1;
				} else {
					return (sContext1Name > sContext2Name) ? 1 : 0;
				}
			}
		}
	};
});
sap.ui.predefine("sap/ui/demo/iconexplorer/model/formatter", [
	"sap/ui/core/library"
] , function(coreLibrary) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	return {

		/**
		 * Workaround for having to set an explicit height on the fixFlex surrounding container
		 * @public
		 * @param {string} sDummy does not matter
		 * @returns {string} sValue 4rem in compact mode, 5rem on cozy mode
		 */
		previewPanelHeight : function (sDummy) {
			if (document.body.classList.contains("sapUiSizeCompact") || document.getElementsByClassName("sapUiSizeCompact").length) {
				return "6.0625rem";
			} else {
				return "8rem";
			}
		},

		/**
		 * Returns the speaking name for the technical name of the icon font
		 * @public
		 * @param sName
		 * @returns {string}
		 */
		fontName: function (sName) {
			if (!sName) {
				return;
			}

			var resourceBundle = this.getResourceBundle();

			// remove special chars and camel case from the name to make legit i18n keys
			sName = sName.split("-").map(function(sPart) {
				return sPart.charAt(0).toUpperCase() + sPart.slice(1);
			}).join("");

			return resourceBundle.getText("fontName_" + sName);
		},

		/**
		 * Checks if an icon is in the favorite model
		 * @public
		 * @param {string} sName the name of the icon
		 * @return {boolean} true if the icon is a favorite
		 */
		isFavorite: function (sName) {
			return this.getModel("fav").isFavorite(sName);
		},

		/**
		 * Returns the approriate rating based on the favorite state
		 * @public
		 * @param {string} sName the name of the icon
		 * @return {int} 1 if favorite, 0 otherwise
		 */
		favoriteRating: function (sName) {
			return (this.getModel("fav").isFavorite(sName) ? 1 : 0);
		},

		/**
		 * Retrieves formatted text containing the unicode of the icon identified by the icon's name. Used as a formatter in the view.
		 * @param {string} name the icon's name
		 * @return {strng} the formattet text taht contains unicode of the queried icon
		 * @public
		 */
		getUnicodeTextByName: function (name) {
			name = name || "";
			var sUnicode = this.getModel().getUnicodeHTML(name.toLowerCase()),
				sFormattedText;
			sUnicode = sUnicode.substring(2, sUnicode.length - 1);
			sFormattedText = this.getResourceBundle().getText("previewInfoUnicodeWithParams", [sUnicode]);
			return sFormattedText;
		},

		/**
		 * Makes the first letter of a string uppercase
		 * @public
		 * @param {string} sValue the value to be formatted
		 * @return {string} the expected result
		 */
		uppercaseFirstLetter: function (sValue) {
			return sValue.charAt(0).toUpperCase() + sValue.slice(1);
		},

		/**
		 * Indicates the availability of the icon font
		 * @public
		 * @param {string} sDelivery the delivery channel of the icon
		 * @return {string} the expected result
		 */
		deliveryState: function (sDelivery) {
			if (sDelivery === "OpenUI5") {
				return ValueState.Success;
			} else {
				return ValueState.Error;
			}
		},

		/**
			* Returns the relative URL to a product picture
		 	* @public
			* @param {string} sUrl image URL
			* @return {string} relative image URL
			*/
			pictureUrl: function(sUrl) {
				return sap.ui.require.toUrl("sap/ui/demo/iconexplorer/") + sUrl;
			}

	};
});
sap.ui.predefine("sap/ui/demo/iconexplorer/model/models", [
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel : function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createSharedParamsModel: function () {
			var currentYear = new Date().getFullYear();
			var oModel = new JSONModel({
				currentYear: currentYear
			});
			return oModel;
		}
	};
});
sap.ui.require.preload({
	"sap/ui/demo/iconexplorer/i18n/i18n.properties":'# This is the resource bundle for the icon explorer\n\n#XTIT: Application name\nappTitle=Icon Explorer\n\n#YDES: Application description\nappDescription=App to explore all icons of the SAPUI5 icon fonts\n\n#~~~ font names ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Title for the "SAP Icons" font\nfontName_SAPIcons= SAP Icons\n\n#XTIT: Title for the "Technology Apps" font\nfontName_SAPIconsTNT=SAP Fiori Tools\n\n#XTIT: Title for the "SAP Business Suite" font\nfontName_BusinessSuiteInAppSymbols=SAP Business Suite\n\n#XTIT: Title for the "SAP S/4HANA and IoT" font\nfontName_S4AndIotAppIcons=SAP S/4HANA and IoT\n\n#XTIT: Description for the icon namespace label\niconNamespace= Namespace:\n\n#...TODO...\n\n#XTIT: Title for the "SAP Fiori" font\nfioriAppIcons=SAP Fiori Tools\n\n#XTIT: Title for the "SAP Fiori Launchpad" font\nfioriLaunchIcons=SAP Fiori Launchpad\n\n#XTIT: Title for the "SAP Business Application Studio" font\nsapWebIdeIcons=SAP Business Application Studio\n\n#XTIT: Title for the "SAP GUI" font\nsapGuiIcons=SAP GUI\n\n\n#~~~ Home View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XFLD: Label for ARIA Region content\nHome_contentLabel=Icon Fonts\n\n#XTIT: Title for the home view\niconExplorerTitle = Icon Explorer\n\n#XTIT: Title for the development documentation\ndevelopmentDocumentation= Documentation\n\n#XTIT: Description for the "SAP-icons" blocklayout\nsapIconsDescription=Icons for UI5 Controls\n\n#XTIT: Description for the "s4 and iot App Icons" blocklayout\ns4AndIotAppIconsDescription=Icons for SAP S/4HANA and IoT apps\n\n#XTIT: Description for the "Fiori App Icons" blocklayout\nfioriAppIconsDescription=Generic icons for SAP Fiori apps\n\n#XTIT: Description for the "Fiori Launch Icons" blocklayout\nfioriLaunchIconsDescription=Launch icons for the SAP Fiori launchpad\n\n#XTIT: Description for the "TechnologyApp Icons" blocklayout\ntechnologyAppIconsDescription=Icons for more technical apps\n\n#XTIT: Description for the "SAP Business Application Studio Icons" blocklayout\nsapWebIdeIconsDescription=Icons used in SAP Business Application Studio\n\n#XTIT: Description for the "SAP GUI Icons" blocklayout\nsapGuiIconsDescription=Icons for SAP GUI applications\n\n#XTIT: Title for the SAP Fiori Design Guidelines\nSAPFioriDesignGuidelines=SAP Fiori Design Guidelines\n\n#XTIT: Title for the "Icon Guidelines" blocklayout\nsapIconGuidelines=Read More\n\n#XTIT: Description for the "Icon Guidelines" blocklayout\nsapIconGuidelinesDescription=Read more about icon design and how to integrate icons into applications.\n\n#XTEX: Placeholder for the search field on the home view\nsearchPlaceholder=Search for icon\n\n#XTIT:Suggestion Column icon\nSuggestionIconColumn= Icon\n\n#XTIT: Suggestion Column Name\nSuggestionNameColumn= Name\n\n#XTIT: Suggestion Column resource\nSuggestionResourceColumn= Resource\n\n#XTIT: Suggestion Column availability\nSuggestionAvailabilityColumn= Availability\n\n#~~~ Overview View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XFLD: Label for ARIA Region root\nOverview_rootLabel=Icons Overview\n\n#XFLD: Label for ARIA Region header\nOverview_headerLabel=Header\n\n#XFLD: Label for ARIA Region content\nOverview_contentLabel=Icons\n\n#XTIT: Initial count for the "all" tab\noverviewTabAllInitial=All\n\n#XTIT: Title for the "all" tab\noverviewTabAllText=Icons\n\n#XTIT: Title for the "details" tab\noverviewTabDetailsText=Details\n\n#XTIT: Title for the "grid" tab\noverviewTabGridText=Grid\n\n#XTIT: Title for the "favorites" tab\noverviewTabFavoritesText=Favorites\n\n#XTOL: Tooltip for the "all" tab\noverviewTabAllTooltip=Return to the full set of all icons for the selected category, discarding all selected filters and tags\n\n#XTOL: Tooltip for the "details" tab\noverviewTabDetailsTooltip=List the icons in a table, showing tags and additional details\n\n#XTOL: Tooltip for the "grid" tab\noverviewTabGridTooltip=Preview all icons in a compact grid\n\n#XTOL: Tooltip for the "favorites" tab\noverviewTabFavoritesTooltip=List the icons you marked as favorites\n\n#XTIT: Table view title\noverviewViewTitle=Icon Explorer\n\n#XTOL: Tooltip for the random icon button\noverviewRandomIconButtonTooltip=Show a random icon in the preview pane\n\n#XTOOL: Tooltip for the random icon button\noverviewDownloadButtonTooltip=Download icon font with all shown icons\n\n#XTOL: Tooltip for the search field\noverviewSearchTooltip=Enter an icon name or a keyword\n\n#XTOL: Tooltip for the category selection\noverviewSelectCategoryTooltip=Select a category\n\n#XTIT: Label for the tag selection bar\noverviewTagSelectionLabel=Suggested Tags:\n\n#XBLI: text for a table with no data with filter or search\noverviewNoDataWithSearchText=No matching icons found\n\n#XTIT: The title of the column containing the Icon\ntableIconColumnTitle=Icon\n\n#XTIT: The title of the column containing the Name\ntableNameColumnTitle=Name\n\n#XTIT: The title of the column containing the Library\ntableNameLibrary=Library\n\n#XTIT: The title of the column containing the Code\ntableCodeColumnTitle=Code\n\n#XTIT: The title of the column containing the Tags\ntableTagsColumnTitle=Tags\n\n#XBLI: text for a table with no data\noverviewNoDataText=No icons are currently available\n\n#XBLI: text for icon symbol\noverviewSymbolText=(Symbol)\n\n#XBUT: text for the code radio button\npreviewCopyCode=Code\n\n#XBUT: text for the icon radio button\npreviewCopyIcon=Icon\n\n#XTIT: title of the preview icon section\npreviewIconTitle=Preview\n\n#XTIT: title of the preview code section\ninfoIconsTileTitle=About Icons\n\n#XTXT: Text for the first paragraph of the info tile\ninfoIconsTileFirstParagraph=Icons at SAP are tailored for direct user interaction, utilizing easy-to-understand metaphors. They are available in several themes, including styles for both Horizon and Quartz. Each icon is handcrafted and provided in several formats that are used by applications built with SAP technologies. By default, all icons are delivered as vector graphics within the icon fonts, which means that they can be resized easily without compromising their quality.\n\n#XTXT: Text for the second paragraph of the info tile\ninfoIconsTileSecondParagraph=Three sets of icons are available:\n\n#XBLI: List item text for \'SAP Icons\'\ninfoIconsTileFirstBullet=SAP Icons: The default icon set, designed for use across all SAP products.\n\n#XBLI: List item text for \'SAP TNT Icons\'\ninfoIconsTileSecondBullet=SAP TNT Icons: Icons that are created for SAP BTP applications, but are also available for use in any SAP-built applications.\n\n#XBLI: List item text for \'SAP Business Suite Icons\'\ninfoIconsTileThirdBullet=SAP Business Suite Icons: Icons that are tailored to SAP S/4 HANA scenarios, but are available for use in any SAP-built applications.\n\ninfoMoreTileTitle=Find out more about icons\n\ninfoBTPExperience=BTP Experience Toolkit: Iconography\n\ninfoBTPVD=BTP Visual Design: Iconography and Fiori Tools Icons/TNT-Icons Updates\n\ninfoVisualCore=Visual Core: SAP-Icons Updates\n\ninfoVisualCoreOld=Old: Visual Core Iconography\n\ninfoFioriWDHorizon=SAP Fiori for Web Design Guidelines: Iconography - Horizon\n\ninfoFioriWDQuartz=SAP Fiori for Web Design Guidelines: Iconography - Quartz\n\ninfoPSIconography=Product Standard UX Consistency: Iconography (UXC-013)\n\ninfoPSSemantics=Product Standard UX Consistency: Icon Semantics (UXC-019)\n\ninfoIconAndIconPool=UI5 Demo Kit - Documentation: Icon and Icon Pool\n\ninfoIconAndIconPoolOpenUI=openUI5 Demo Kit - Documentation: Icon and Icon Pool\n\ninfoDownloadIconFonts=Download icon fonts\n\ninfoSAPBusinessSuite=SAP Business Suite\n\ninfoSAPIcons=SAP Icons\n\ninfoSAPIconsTNT=SAP TNT Icons/ SAP Fiori Tools\n\ninfoBTPIconography=BTP Experience Toolkit: Iconography\n\ninfoFigmaTitle=Figma plugin\n\ninfoFigmaText=The plugin is enabled globally for all Figma users in SAP. Just open a design document in Figma and navigate to Plugins >\n\ninfoFigmaLink=SAP Icon Browser\n\npreviewCopyMode=Copy Mode:\n\npreviewSearchResults=Search Results\n\npreviewFavoritesResults=Favorites\n\niconExplorerBrowseLibrary=Browse Library\n\n#TLNK: Text for link\nFOOTER_LEGAL_DISCOLURE = Legal Disclosure\n#TLNK: Text for link\nFOOTER_PRIVACY = Privacy\n#TLNK: Text for link\nFOOTER_TERMS = Terms of Use\n#TLNK: Text for link\nFOOTER_TRADEMARK = Trademark\n#TLNK: Text for link\nFOOTER_COPYRIGHT = Copyright\n#TLNK: Text for link\nFOOTER_LICENSE = License\n\n#XTIT: title of the preview info section\npreviewInfoTitle=Additional Information\n\n#XTIT: text of the unicode information label\npreviewInfoUnicode=Unicode\n\n#XTIT: text of the unicode in the way\npreviewInfoUnicodeWithParams=Unicode: {0}\n\n#XTIT: text of the CSS class information label\npreviewInfoCSSClass=CSS Class\n\n#XTIT: text of the category information label\npreviewInfoCategory=Categories\n\n#XTIT: text of the tags information label\npreviewInfoTag=Tags\n\n#XTIT: title of the preview copy section\npreviewCopyTitle=Copy\n\n#TOL: tooltip for copy icon code button\npreviewCopyCodeToClipboard=Copy icon code to clipboard\n\n#TOL: tooltip for copy character button\npreviewCopyIconToClipboard=Copy icon to clipboard\n\n#YMSG: success message for copying an icon to clipboard\npreviewCopyToClipboardSuccess=Icon {0} copied to clipboard\n\n#YMSG: error message for copying an icon to clipboard\npreviewCopyToClipboardFail=Icon {0} could not be copied to clipboard\n\n#YMSG: success message for copying an icon\'s unicode to clipboard\npreviewCopyUnicodeToClipboardSuccess= Unicode {0} copied to clipboard\n\n#YMSG: error message for copying an icon\'s unicode to clipboard\npreviewCopyUnicodeToClipboardFail= Unicode {0} could not be copied to clipboard\n\n#YMSG: message for adding an icon to favorites\noverviewFavoriteAdd=Icon {0} added to your favorites\n\n#YMSG: message for removing an icon from favorites\noverviewFavoriteRemove=Icon {0} removed from your favorites\n\n#XTOL: Tooltip for preview icon buttons\npreviewIconButton= Preview Icon Button\n\n#XTIT: Title for list item\nlistItemText=List Item\n\n#XFLD: Label for preview icon buttons\npreviewIconButtonText=Toolbar\n\n#XFLD: Label for icon tab bar\npreviewIconTabBarText=Icon Tab Bar\n\n#XTXT: Text for avatar icon\navatarText=Avatar\n\n#XFLD: Label for ARIA download button\nlabelDownloadButton=Download all icons\n\n#XFLD: Label for ARIA random button\nlabelRandomButton=Random icon\n\n#XFLD: Label for ARIA preview button\nlabelPreviewButton=Preview\n\n#XFLD: Label for ARIA copy button\nlabelCopyButton=Copy\n\n#XMIT: The menu item that navigates to the Appearance options\nAPP_INFORMATION_BTN_APPEARANCE = Appearance\n#XMIT: The menu item that selects the Appearance Light option\nAPP_INFORMATION_BTN_APPEARANCE_LIGHT = Light\n#XMIT: The menu item that selects the Appearance Dark option\nAPP_INFORMATION_BTN_APPEARANCE_DARK = Dark\n#XMIT: The menu item that selects the Appearance High Contrast Black option\nAPP_INFORMATION_BTN_APPEARANCE_HCB = High Contrast Black\n#XMIT: The menu item that selects the Appearance High Contrast White option\nAPP_INFORMATION_BTN_APPEARANCE_HCW = High Contrast White\n#XMIT: The menu item that selects the Appearance Auto option\nAPP_INFORMATION_BTN_APPEARANCE_AUTO = Auto (OS Dependant)\n\n#XFLD: Label for ARIA searchField\nlabelIconSearch=Search for icon\n\n#XFLD: Label for ARIA comboBox\nlabelCategory=Select a category\n\n#~~~ Info View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Info view title\ninfoTitle=All about icons and downloads\n\n#~~~ Not Found View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XLNK: text for button in \'not found\' pages\nbackToOverview=Back to Icon Explorer\n\n#~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~\n\n#YMSG: Error dialog description\nerrorText=Sorry, that\'s some technical error. Please try again later.\n',
	"sap/ui/demo/iconexplorer/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ui.demo.iconexplorer","type":"application","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""],"fallbackLocale":""},"title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://image-viewer","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.iconexplorer.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.98.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{},"sap.ui.documentation":{"lazy":true}}},"componentUsages":{"cookieSettingsDialog":{"name":"sap.ui.documentation.sdk.cookieSettingsDialog"}},"resources":{"css":[{"uri":"css/style.css"}]},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.iconexplorer.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}}},"routing":{"config":{"routerClass":"sap.m.routing.Router","type":"View","viewType":"XML","path":"sap.ui.demo.iconexplorer.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":"notFound"},"async":true},"routes":[{"pattern":"","name":"home","target":"home"},{"pattern":"info","name":"info","target":"info"},{"pattern":":?query:","name":"legacy","target":["overview"]},{"pattern":"overview/:fontName:/:?query:","name":"overview","target":"overview"}],"targets":{"home":{"name":"Home","id":"home","level":1},"info":{"name":"Info","id":"info","level":2},"overview":{"name":"Overview","id":"overview","level":2},"notFound":{"name":"NotFound","id":"notFound"}}}}}',
	"sap/ui/demo/iconexplorer/view/App.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.iconexplorer.controller.App"\n\tdisplayBlock="true"\n\theight="100%"\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><VBox renderType="Bare"><App id="app"\n\t\t\tbusy="{view>/busy}"\n\t\t\tbusyIndicatorDelay="{view>/delay}"\n\t\t\tclass="sapUiDemoIconExplorer"/><core:Fragment id="footerFragment" fragmentName="sap.ui.demo.iconexplorer.view.browse.Footer" type="XML" /></VBox></mvc:View>',
	"sap/ui/demo/iconexplorer/view/Home.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.iconexplorer.controller.Home"\n\txmlns="sap.m"\n\txmlns:l="sap.ui.layout"\n\txmlns:core="sap.ui.core"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:grid="sap.ui.layout.cssgrid"\n\txmlns:custom="sap.ui.demo.iconexplorer.controls"><Page\n\t\tshowHeader="false"\n\t\tid="page"\n\t\tclass="IconExplorerHomePage"><landmarkInfo><PageAccessibleLandmarkInfo\n\t\t\t\tcontentRole="Region"\n\t\t\t\tcontentLabel="{i18n>Home_contentLabel}"/></landmarkInfo><VBox\n\t\t\t\t\t\tclass="IconExplorerSearchContainer"\n\t\t\t\t\t\tjustifyContent="Center"\n\t\t\t\t\t\twidth="100%"><core:Icon\n\t\t\t\t\t\t\tsrc="sap-icon://sap-ui5"\n\t\t\t\t\t\t\tsize="6.625rem"\n\t\t\t\t\t\t\twidth="100%" /><Title\n\t\t\t\t\t\t\tclass="HomeHeaderText sapUiTinyMarginTop sapUiSmallMarginBottom"\n\t\t\t\t\t\t\ttext="{i18n>iconExplorerTitle}"\n\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\ttextAlign="Center"/><HBox justifyContent="Center"><RadioButtonGroup columns="3"><RadioButton id="cbSAPIcons" text="{i18n>infoSAPIcons}" select="onCheckBoxSelect" selected="true"/><RadioButton id="cbSAPIconsTNT" text="{i18n>fontName_SAPIconsTNT}" select="onCheckBoxSelect"/><RadioButton id="cbInfoSAPBusinessSuite" visible="{= !${versionData>/isOpenUI5}}" text="{i18n>infoSAPBusinessSuite}" select="onCheckBoxSelect"/></RadioButtonGroup></HBox><HBox justifyContent="Center"><Input\n\t\t\t\t\t\t\t\tid="search"\n\t\t\t\t\t\t\t\tplaceholder="{i18n>searchPlaceholder}"\n\t\t\t\t\t\t\t\ttype="Text"\n\t\t\t\t\t\t\t\tshowSuggestion="true"\n\t\t\t\t\t\t\t\tshowClearIcon="true"\n\t\t\t\t\t\t\t\tsubmit=".onEnter"\n\t\t\t\t\t\t\t\tshowTableSuggestionValueHelp="false"\n\t\t\t\t\t\t\t\tsuggestionRows="{\n\t\t\t\t\t\t\t\t\tpath: \'/AllIcons\'\n\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\tsuggestionItemSelected=".onSuggestionSelect"\n\t\t\t\t\t\t\t\tvalueLiveUpdate="true"\n\t\t\t\t\t\t\t\tstartSuggestion="2"><layoutData><FlexItemData growFactor="0.7" /></layoutData><suggestionColumns><Column\n\t\t\t\t\t\t\t\t\t\thAlign="Begin"\n\t\t\t\t\t\t\t\t\t\tpopinDisplay="Inline"\n\t\t\t\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\t\t\t\twidth="2em"><Label text="{i18n>SuggestionIconColumn}"/></Column><Column\n\t\t\t\t\t\t\t\t\t\thAlign="Begin"\n\t\t\t\t\t\t\t\t\t\tvAlign="Middle"\n\t\t\t\t\t\t\t\t\t\tpopinDisplay="Inline"\n\t\t\t\t\t\t\t\t\t\tdemandPopin="true"><Label text="{i18n>SuggestionNameColumn}"/></Column><Column\n\t\t\t\t\t\t\t\t\t\tid="tagsColumn"\n\t\t\t\t\t\t\t\t\t\tminScreenWidth="Desktop"\n\t\t\t\t\t\t\t\t\t\tvAlign="Middle"\n\t\t\t\t\t\t\t\t\t\tdemandPopin="false"><Text\n\t\t\t\t\t\t\t\t\t\t\tid="tagsColumnTitle"\n\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>tableTagsColumnTitle}"/></Column><Column\n\t\t\t\t\t\t\t\t\t\thAlign="Begin"\n\t\t\t\t\t\t\t\t\t\tvAlign="Middle"\n\t\t\t\t\t\t\t\t\t\tpopinDisplay="Inline"\n\t\t\t\t\t\t\t\t\t\tdemandPopin="true"><Label text="{i18n>SuggestionResourceColumn}"/></Column><Column\n\t\t\t\t\t\t\t\t\t\tdemandPopin="false"\n\t\t\t\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\t\t\t\thAlign="Begin"\n\t\t\t\t\t\t\t\t\t\tvAlign="Middle"\n\t\t\t\t\t\t\t\t\t\tpopinDisplay="Inline"><Label text="{i18n>SuggestionAvailabilityColumn}"/></Column></suggestionColumns><suggestionRows><ColumnListItem type="Navigation"><cells><core:Icon\n\t\t\t\t\t\t\t\t\t\t\t\tsize="1.2rem"\n\t\t\t\t\t\t\t\t\t\t\t\tsrc="sap-icon://{iconPath}{name}"\n\t\t\t\t\t\t\t\t\t\t\t\tcolor="Default"/><Label text="{name}"/><Tokenizer\n\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\t\t\trenderMode="Narrow"\n\t\t\t\t\t\t\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\t\t\t\t\t\t\ttokens="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath: \'tags\',\n\t\t\t\t\t\t\t\t\t\t\t\t\ttemplateShareable: true\n\t\t\t\t\t\t\t\t\t\t\t\t}"><Token\n\t\t\t\t\t\t\t\t\t\t\t\t\tselected="{tags>/selected}"\n\t\t\t\t\t\t\t\t\t\t\t\t\tpress=".onTokenPress"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{name}"\n\t\t\t\t\t\t\t\t\t\t\t\t\teditable="false"/></Tokenizer><Label text="{font}"/><ObjectNumber\n\t\t\t\t\t\t\t\t\t\t\t\tnumber="{path: \'delivery\'}"\n\t\t\t\t\t\t\t\t\t\t\t\tstate="{\n\t\t\t\t\t\t\t\t\t\t\t\t\tpath: \'delivery\',\n\t\t\t\t\t\t\t\t\t\t\t\t\tformatter: \'.formatter.deliveryState\'\n\t\t\t\t\t\t\t\t\t\t\t\t}"/></cells></ColumnListItem></suggestionRows></Input></HBox><HBox justifyContent="Center"><Button \n\t\t\t\t\t\t\t\ttext="{i18n>iconExplorerBrowseLibrary}"\n\t\t\t\t\t\t\t\tclass="sapUiSmallMarginEnd"\n\t\t\t\t\t\t\t\tpress=".onNavToLibrary"/><Button\n\t\t\t\t\t\t\t\ttext="{i18n>infoTitle}"\n\t\t\t\t\t\t\t\ticonFirst="false"\n\t\t\t\t\t\t\t\ticon="sap-icon://forward"\n\t\t\t\t\t\t\t\tpress=".onNavToInfo"/></HBox></VBox></Page></mvc:View>\n',
	"sap/ui/demo/iconexplorer/view/Info.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.iconexplorer.controller.Info"\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:card="sap.f.cards"\n\txmlns:l="sap.ui.layout"\n\txmlns:f="sap.f"\n\txmlns:mvc="sap.ui.core.mvc"><f:DynamicPage\n\t\ttoggleHeaderOnTitleClick="false"\n\t\tclass="sapUiNoContentPadding"\n\t\tid="page"><f:title><f:DynamicPageTitle><f:heading><VBox><Breadcrumbs currentLocationText="{i18n>infoTitle}" separatorStyle="GreaterThan"><Link press="onIconExplorerLinkPressed" text="{i18n>appTitle}"/></Breadcrumbs><Title text="{i18n>infoTitle}"/></VBox></f:heading></f:DynamicPageTitle></f:title><f:content><l:Grid class="sapUiSmallMarginTop"><f:Card><f:layoutData><l:GridData span="XL3 L4 M6 S12" /></f:layoutData><f:content><VBox><Image src=\'{info>/svgCard}\' width="100%" /><card:Header title="{i18n>infoIconsTileTitle}" /><FormattedText class="sapUiSmallMargin"\n\t\t\t\t\t\t\t\t\thtmlText=\'&lt;p&gt;{i18n>infoIconsTileFirstParagraph}&lt;/p&gt;\n\t\t\t\t\t\t\t\t\t&lt;p&gt;{i18n>infoIconsTileSecondParagraph}&lt;/p&gt;\n\t\t\t\t\t\t\t\t\t&lt;ul&gt;\n\t\t\t\t\t\t\t\t\t\t&lt;li&gt;\n\t\t\t\t\t\t\t\t\t\t\t{i18n>infoIconsTileFirstBullet}\n\t\t\t\t\t\t\t\t\t\t&lt;/li&gt;\n\t\t\t\t\t\t\t\t\t\t&lt;li&gt;\n\t\t\t\t\t\t\t\t\t\t\t{i18n>infoIconsTileSecondBullet}\n\t\t\t\t\t\t\t\t\t\t&lt;/li&gt;\n\t\t\t\t\t\t\t\t\t\t&lt;li&gt;\n\t\t\t\t\t\t\t\t\t\t\t{i18n>infoIconsTileThirdBullet}\n\t\t\t\t\t\t\t\t\t\t&lt;/li&gt;\n\t\t\t\t\t\t\t\t\t&lt;/ul&gt;\' /><Button class=\'sapUiSmallMargin\'\n\t\t\t\t\t\t\t\t\ttext=\'{i18n>infoBTPIconography}\'\n\t\t\t\t\t\t\t\t\twidth=\'calc(100% - 2rem)\'\n\t\t\t\t\t\t\t\t\tpress="onInfoBTPIconographyPress"\n\t\t\t\t\t\t\t\t\tvisible="{= !${versionData>/isOpenUI5}}" /></VBox></f:content></f:Card><f:Card><f:layoutData><l:GridData span="XL6 L5 M6 S12" /></f:layoutData><f:header><card:Header title="{i18n>infoMoreTileTitle}" /></f:header><f:content><VBox class=\'sapUiSmallMargin sapUiDocumentationInfoLinksHolder\'><HBox visible="{= ${versionData>/isOpenUI5}}" alignItems=\'Center\' class=\'sapUiTinyMarginTop\'><core:Icon\n\t\t\t\t\t\t\t\t\t\tsize=\'1.5rem\'\n\t\t\t\t\t\t\t\t\t\twidth=\'3rem\'\n\t\t\t\t\t\t\t\t\t\theight=\'3rem\'\n\t\t\t\t\t\t\t\t\t\tsrc="sap-icon://sap-logo-shape"\n\t\t\t\t\t\t\t\t\t\tbackgroundColor="#D1EFFF"\n\t\t\t\t\t\t\t\t\t\tcolor="#0057D2" /><Link text=\'{i18n>infoFioriWDHorizon}\'\n\t\t\t\t\t\t\t\t\t\twrapping="true"\n\t\t\t\t\t\t\t\t\t\temphasized="true"\n\t\t\t\t\t\t\t\t\t\tclass=\'sapUiSmallMarginBegin\'\n\t\t\t\t\t\t\t\t\t\thref=\'https://experience.sap.com/fiori-design-web/iconography-horizon/\' /></HBox><HBox visible="{= ${versionData>/isOpenUI5}}" alignItems=\'Center\' class=\'sapUiTinyMarginTop\'><core:Icon\n\t\t\t\t\t\t\t\t\t\tsize=\'1.5rem\'\n\t\t\t\t\t\t\t\t\t\twidth=\'3rem\'\n\t\t\t\t\t\t\t\t\t\theight=\'3rem\'\n\t\t\t\t\t\t\t\t\t\tsrc="sap-icon://sap-logo-shape"\n\t\t\t\t\t\t\t\t\t\tbackgroundColor="#DED3FF"\n\t\t\t\t\t\t\t\t\t\tcolor="#552CFF" /><Link text=\'{i18n>infoFioriWDQuartz}\'\n\t\t\t\t\t\t\t\t\t\twrapping="true"\n\t\t\t\t\t\t\t\t\t\temphasized="true"\n\t\t\t\t\t\t\t\t\t\tclass=\'sapUiSmallMarginBegin\'\n\t\t\t\t\t\t\t\t\t\thref=\'https://experience.sap.com/fiori-design-web/icons/\' /></HBox><HBox visible="{= ${versionData>/isOpenUI5}}" alignItems=\'Center\' class=\'sapUiTinyMarginTop\'><core:Icon\n\t\t\t\t\t\t\t\t\t\tsize=\'1.5rem\'\n\t\t\t\t\t\t\t\t\t\twidth=\'3rem\'\n\t\t\t\t\t\t\t\t\t\theight=\'3rem\'\n\t\t\t\t\t\t\t\t\t\tsrc="sap-icon://sap-ui5"\n\t\t\t\t\t\t\t\t\t\tbackgroundColor="#FFF3B8"\n\t\t\t\t\t\t\t\t\t\tcolor="#A45D00" /><Link text=\'{i18n>infoIconAndIconPoolOpenUI}\'\n\t\t\t\t\t\t\t\t\t\twrapping="true"\n\t\t\t\t\t\t\t\t\t\temphasized="true"\n\t\t\t\t\t\t\t\t\t\tclass=\'sapUiSmallMarginBegin\'\n\t\t\t\t\t\t\t\t\t\thref=\'https://openui5.hana.ondemand.com/topic/21ea0ea94614480d9a910b2e93431291\' /></HBox><HBox visible="{= !${versionData>/isOpenUI5}}" alignItems=\'Center\' class=\'sapUiTinyMarginTop\'><core:Icon\n\t\t\t\t\t\t\t\t\t\tsize=\'1.5rem\'\n\t\t\t\t\t\t\t\t\t\twidth=\'3rem\'\n\t\t\t\t\t\t\t\t\t\theight=\'3rem\'\n\t\t\t\t\t\t\t\t\t\tsrc="sap-icon://sap-logo-shape"\n\t\t\t\t\t\t\t\t\t\tbackgroundColor="#D1EFFF"\n\t\t\t\t\t\t\t\t\t\tcolor="#0057D2" /><Link text=\'{i18n>infoFioriWDHorizon}\'\n\t\t\t\t\t\t\t\t\t\twrapping="true"\n\t\t\t\t\t\t\t\t\t\temphasized="true"\n\t\t\t\t\t\t\t\t\t\tclass=\'sapUiSmallMarginBegin\'\n\t\t\t\t\t\t\t\t\t\thref=\'https://experience.sap.com/internal/fiori-design-web/iconography-horizon/\' /></HBox><HBox visible="{= !${versionData>/isOpenUI5}}" alignItems=\'Center\' class=\'sapUiTinyMarginTop\'><core:Icon\n\t\t\t\t\t\t\t\t\t\tsize=\'1.5rem\'\n\t\t\t\t\t\t\t\t\t\twidth=\'3rem\'\n\t\t\t\t\t\t\t\t\t\theight=\'3rem\'\n\t\t\t\t\t\t\t\t\t\tsrc="sap-icon://sap-logo-shape"\n\t\t\t\t\t\t\t\t\t\tbackgroundColor="#DED3FF"\n\t\t\t\t\t\t\t\t\t\tcolor="#552CFF" /><Link text=\'{i18n>infoFioriWDQuartz}\'\n\t\t\t\t\t\t\t\t\t\twrapping="true"\n\t\t\t\t\t\t\t\t\t\temphasized="true"\n\t\t\t\t\t\t\t\t\t\tclass=\'sapUiSmallMarginBegin\'\n\t\t\t\t\t\t\t\t\t\thref=\'https://experience.sap.com/internal/fiori-design-web/icons/\' /></HBox><HBox visible="{= !${versionData>/isOpenUI5}}" alignItems=\'Center\'><core:Icon\n\t\t\t\t\t\t\t\t\t\tsize=\'1.5rem\'\n\t\t\t\t\t\t\t\t\t\twidth=\'3rem\'\n\t\t\t\t\t\t\t\t\t\theight=\'3rem\'\n\t\t\t\t\t\t\t\t\t\tsrc="sap-icon://wrench"\n\t\t\t\t\t\t\t\t\t\tbackgroundColor="#C2FCEE"\n\t\t\t\t\t\t\t\t\t\tcolor="#256F3A" /><Link text=\'{i18n>infoBTPExperience}\'\n\t\t\t\t\t\t\t\t\t\twrapping="true"\n\t\t\t\t\t\t\t\t\t\temphasized="true"\n\t\t\t\t\t\t\t\t\t\tclass=\'sapUiSmallMarginBegin\'\n\t\t\t\t\t\t\t\t\t\thref=\'https://btpx.frontify.com/document/223120#/design-language/iconography-p7615\' /></HBox><HBox visible="{= !${versionData>/isOpenUI5}}" alignItems=\'Center\' class=\'sapUiTinyMarginTop\'><core:Icon\n\t\t\t\t\t\t\t\t\t\tsize=\'1.5rem\'\n\t\t\t\t\t\t\t\t\t\twidth=\'3rem\'\n\t\t\t\t\t\t\t\t\t\theight=\'3rem\'\n\t\t\t\t\t\t\t\t\t\tsrc="sap-icon://sap-ui5"\n\t\t\t\t\t\t\t\t\t\tbackgroundColor="#FFF3B8"\n\t\t\t\t\t\t\t\t\t\tcolor="#A45D00" /><Link text=\'{i18n>infoIconAndIconPool}\'\n\t\t\t\t\t\t\t\t\t\twrapping="true"\n\t\t\t\t\t\t\t\t\t\temphasized="true"\n\t\t\t\t\t\t\t\t\t\tclass=\'sapUiSmallMarginBegin\'\n\t\t\t\t\t\t\t\t\t\thref=\'https://sapui5.hana.ondemand.com/#/topic/21ea0ea94614480d9a910b2e93431291\' /></HBox></VBox></f:content></f:Card><f:Card><f:layoutData><l:GridData linebreakM="{= !${versionData>/isOpenUI5}}" span="XL3 L3 M6 S12" /></f:layoutData><f:header><card:Header title="{i18n>infoDownloadIconFonts}" /></f:header><f:content><VBox class=\'sapUiSmallMargin\' width="100%"><HBox visible="{= !${versionData>/isOpenUI5}}" alignItems=\'Center\' justifyContent="SpaceBetween"><Text text=\'{i18n>infoSAPBusinessSuite}\' /><Button press="onDownloadBusinessSuiteIcons" type="Transparent" icon=\'sap-icon://download\' /></HBox><HBox alignItems=\'Center\' justifyContent="SpaceBetween"><Text text=\'{i18n>infoSAPIcons}\' /><Button press="onDownloadSAPIcons" type="Transparent" icon=\'sap-icon://download\' /></HBox><HBox alignItems=\'Center\' justifyContent="SpaceBetween"><Text text=\'{i18n>infoSAPIconsTNT}\' /><Button press="onDownloadTNTIcons" type="Transparent" icon=\'sap-icon://download\' /></HBox></VBox></f:content></f:Card><f:Card visible="{= !${versionData>/isOpenUI5}}"><f:layoutData><l:GridData span="XL3 L3 M6 S12" /></f:layoutData><f:header><card:Header title="{i18n>infoFigmaTitle}" /></f:header><f:content><VBox class=\'sapUiSmallMargin\' width="100%"><FormattedText\n\t\t\t\t\t\t\t\t\thtmlText=\'\n\t\t\t\t\t\t\t\t\t\t&lt;span&gt;\n\t\t\t\t\t\t\t\t\t\t\t{i18n>infoFigmaText}\n\t\t\t\t\t\t\t\t\t\t\t&lt;strong&gt;{i18n>infoFigmaLink}&lt;/strong&gt;\n\t\t\t\t\t\t\t\t\t\t&lt;/span&gt;\' /><Link text=\'{i18n>sapIconGuidelines}\'\n\t\t\t\t\t\t\t\t\tclass=\'sapUiSmallMarginTop\'\n\t\t\t\t\t\t\t\t\thref="https://btpx.frontify.com/document/222572#/resources/how-to-use-the-figma-ui-kit:51648" /></VBox></f:content></f:Card></l:Grid></f:content></f:DynamicPage></mvc:View>',
	"sap/ui/demo/iconexplorer/view/NotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.iconexplorer.controller.NotFound"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m"><VBox renderType="Bare" justifyContent="Center" height="100%"><IllustratedMessage illustrationType="sapIllus-PageNotFound"><additionalContent><Button id="link" text="{i18n>backToOverview}" press=".onButtonPressed"/></additionalContent></IllustratedMessage></VBox></mvc:View>',
	"sap/ui/demo/iconexplorer/view/Overview.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.iconexplorer.controller.Overview"\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:l="sap.ui.layout"\n\txmlns:core="sap.ui.core"\n\tbusy="{view>/busy}"><f:DynamicPage\n\t\tclass="sapUiNoContentPadding"\n\t\ttoggleHeaderOnTitleClick="false"\n\t\tfitContent="true"\n\t\tid="page"><f:landmarkInfo><f:DynamicPageAccessibleLandmarkInfo\n\t\t\t\trootRole="Region"\n\t\t\t\trootLabel="{i18n>Overview_rootLabel}"\n\t\t\t\tcontentRole="Main"\n\t\t\t\tcontentLabel="{i18n>Overview_contentLabel}"\n\t\t\t\theaderRole="Banner"\n\t\t\t\theaderLabel="{i18n>Overview_headerLabel}"/></f:landmarkInfo><f:title><f:DynamicPageTitle><f:heading><HBox alignItems="Center"><Button icon="sap-icon://nav-back" type="Transparent" press="onBackButtonPress" class="sapUiTinyMarginEnd" /><Title text="Icon Explorer"/></HBox></f:heading><f:actions><Button\n\t\t\t\t\t\ttext="{i18n>infoTitle}"\n\t\t\t\t\t\ticonFirst="false"\n\t\t\t\t\t\ticon="sap-icon://forward"\n\t\t\t\t\t\ttype="Transparent"\n\t\t\t\t\t\tpress=".onNavToInfo"/></f:actions></f:DynamicPageTitle></f:title><f:header><core:Fragment fragmentName="sap.ui.demo.iconexplorer.view.browse.OverviewHeader" type="XML" /></f:header><f:content><VBox renderType="Bare" justifyContent="Center" height="100%"><f:SidePanel id="mySidePanel" toggle="onToggle"><f:mainContent><core:Fragment fragmentName="sap.ui.demo.iconexplorer.view.browse.OverviewMainContent" type="XML" /></f:mainContent><f:items><core:Fragment fragmentName="sap.ui.demo.iconexplorer.view.browse.OverviewSideContent" type="XML" /></f:items></f:SidePanel></VBox></f:content></f:DynamicPage></mvc:View>\n',
	"sap/ui/demo/iconexplorer/view/browse/Details.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><Table\n\t\tid="results"\n\t\twidth="auto"\n\t\tclass="sapUiSmallMargin"\n\t\tmode="SingleSelectMaster"\n\t\tselectionChange=".onSelectionChange"\n\t\titems="{\n\t\t\tpath: \'groups/0/icons\',\n\t\t\tsorter: {\n\t\t\t\tpath: \'name\',\n\t\t\t\tdescending: false\n\t\t\t},\n\t\t\ttemplateShareable: true\n\t\t}"\n\t\tgrowing="true"\n\t\tgrowingScrollToLoad="true"\n\t\tgrowingThreshold="{view>/growingThreshold}"\n\t\tupdateFinished=".onUpdateFinished"\n\t\tvisible="{= ${view>/iconsFound} }"><columns><Column id="iconColumn" width="3rem" vAlign="Middle"><Text id="iconColumnTitle" text="{i18n>tableIconColumnTitle}"/></Column><Column id="nameColumn" width="15%" vAlign="Middle"><Text id="nameColumnTitle" text="{i18n>tableNameColumnTitle}"/></Column><Column width="4rem"><Text text="{i18n>previewCopyTitle}"/></Column><Column width="7rem"><Text text="{i18n>tableNameLibrary}"/></Column><Column\n\t\t\t\twidth="25%"\n\t\t\t\tid="codeColumn"\n\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\tdemandPopin="true"\n\t\t\t\tvAlign="Middle"><Text id="codeColumnTitle" text="{i18n>tableCodeColumnTitle}"/></Column><Column\n\t\t\t\tid="tagsColumn"\n\t\t\t\tminScreenWidth="Desktop"\n\t\t\t\tdemandPopin="true"\n\t\t\t\thAlign="End"\n\t\t\t\tvAlign="Middle"><Text id="tagsColumnTitle" textAlign="Left" text="{i18n>tableTagsColumnTitle}"/></Column><Column id="favColumn" width="2rem" vAlign="Middle"/></columns><items><ColumnListItem\n\t\t\t\ttype="Active"><cells><core:Icon size="2rem" src="sap-icon://{view>/iconPath}{name}" color="Default" useIconTooltip="false"/><Label design="Bold" text="{name}"/><Button\n\t\t\t\t\t\ticon="sap-icon://copy"\n\t\t\t\t\t\ttype="Transparent"\n\t\t\t\t\t\ttooltip="{i18n>previewCopyIconToClipboard}"\n\t\t\t\t\t\tpress=".handleCopyToClipboardClick"\n\t\t\t\t\t\tariaLabelledBy="labelCopyButton"/><Text text="{\n\t\t\t\t\t\t\tpath: \'view>/fontName\',\n\t\t\t\t\t\t\tformatter: \'.formatter.fontName\'\n\t\t\t\t\t\t}"/><Text text="sap-icon://{view>/iconPath}{name}"/><Tokenizer\n\t\t\t\t\t\trenderMode="Narrow"\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\ttokens="{\n\t\t\t\t\t\t\tpath: \'tags\',\n\t\t\t\t\t\t\ttemplateShareable: true\n\t\t\t\t\t\t}"><Token text="{name}" press=".onTagSelect" editable="false"/></Tokenizer><RatingIndicator\n\t\t\t\t\t\ticonUnselected="sap-icon://unfavorite"\n\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\tpath: \'name\',\n\t\t\t\t\t\t\tformatter: \'.formatter.favoriteRating\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tmaxValue="1"\n\t\t\t\t\t\tchange=".onToggleFavorite"/></cells></ColumnListItem></items></Table></core:FragmentDefinition>',
	"sap/ui/demo/iconexplorer/view/browse/Favorites.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><Table\n\t\tid="results"\n\t\twidth="auto"\n\t\tclass="sapUiSmallMargin"\n\t\tmode="SingleSelectMaster"\n\t\tselectionChange=".onSelectionChange"\n\t\titems="{\n\t\t\tpath: \'fav>/icons\',\n\t\t\tsorter: {\n\t\t\t\tpath: \'name\',\n\t\t\t\tdescending: false\n\t\t\t},\n\t\t\ttemplateShareable: true\n\t\t}"\n\t\tgrowing="true"\n\t\tgrowingThreshold="{view>/growingThreshold}"\n\t\tupdateFinished=".onUpdateFinished"\n\t\tvisible="{= ${view>/iconsFound} }"><columns><Column\n\t\t\t\tid="iconColumn"\n\t\t\t\twidth="3rem"\n\t\t\t\tvAlign="Middle"><Text\n\t\t\t\t\tid="iconColumnTitle"\n\t\t\t\t\ttext="{i18n>tableIconColumnTitle}"/></Column><Column\n\t\t\t\tid="nameColumn"\n\t\t\t\twidth="15%"\n\t\t\t\tvAlign="Middle"><Text\n\t\t\t\t\tid="nameColumnTitle"\n\t\t\t\t\ttext="{i18n>tableNameColumnTitle}"/></Column><Column width="4rem"><Text text="{i18n>previewCopyTitle}"/></Column><Column width="7rem"><Text text="{i18n>tableNameLibrary}"/></Column><Column\n\t\t\t\tid="codeColumn"\n\t\t\t\twidth="25%"\n\t\t\t\tminScreenWidth="Desktop"\n\t\t\t\tdemandPopin="true"\n\t\t\t\tvAlign="Middle"><Text\n\t\t\t\t\tid="codeColumnTitle"\n\t\t\t\t\ttext="{i18n>tableCodeColumnTitle}"/></Column><Column\n\t\t\t\tid="tagsColumn"\n\t\t\t\tminScreenWidth="Desktop"\n\t\t\t\tdemandPopin="true"\n\t\t\t\thAlign="End"\n\t\t\t\tvAlign="Middle"><Text\n\t\t\t\t\tid="tagsColumnTitle"\n\t\t\t\t\ttext="{i18n>tableTagsColumnTitle}"/></Column><Column\n\t\t\t\tid="favColumn"\n\t\t\t\twidth="2rem"\n\t\t\t\tvAlign="Middle"/></columns><items><ColumnListItem\n\t\t\t\ttype="Active"><cells><core:Icon\n\t\t\t\t\t\tsize="2rem"\n\t\t\t\t\t\tsrc="sap-icon://{fav>iconPath}{fav>name}"\n\t\t\t\t\t\tcolor="Default"\n\t\t\t\t\t\tuseIconTooltip="false"/><Label\n\t\t\t\t\t\tdesign="Bold"\n\t\t\t\t\t\ttext="{fav>name}"/><Button\n\t\t\t\t\t\ticon="sap-icon://copy"\n\t\t\t\t\t\ttype="Transparent"\n\t\t\t\t\t\ttooltip="{i18n>previewCopyIconToClipboard}"\n\t\t\t\t\t\tpress=".handleCopyToClipboardClick"\n\t\t\t\t\t\tariaLabelledBy="labelCopyButton"/><Text text="{\n\t\t\t\t\t\t\tpath: \'view>/fontName\',\n\t\t\t\t\t\t\tformatter: \'.formatter.fontName\'\n\t\t\t\t\t\t}"/><Text\n\t\t\t\t\t\ttext="sap-icon://{fav>iconPath}{fav>name}"/><Tokenizer\n\t\t\t\t\t\trenderMode="Narrow"\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\ttokens="{\n\t\t\t\t\t\t\t\tpath: \'fav>tags\',\n\t\t\t\t\t\t\t\ttemplateShareable: true\n\t\t\t\t\t\t\t}"><Token\n\t\t\t\t\t\t\ttext="{fav>name}"\n\t\t\t\t\t\t\tpress=".onTagSelect"\n\t\t\t\t\t\t\teditable="false"/></Tokenizer><RatingIndicator\n\t\t\t\t\t\ticonUnselected="sap-icon://unfavorite"\n\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\tpath: \'fav>name\',\n\t\t\t\t\t\t\tformatter: \'.formatter.favoriteRating\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tmaxValue="1"\n\t\t\t\t\t\tchange=".onToggleFavorite"/></cells></ColumnListItem></items></Table></core:FragmentDefinition>',
	"sap/ui/demo/iconexplorer/view/browse/Footer.fragment.xml":'<core:FragmentDefinition\n\t\txmlns="sap.m"\n\t\txmlns:core="sap.ui.core"><Toolbar style="Clear" class="sapUiDocumentationFooter"><FlexBox\n\t\t\t\tjustifyContent="SpaceBetween"\n\t\t\t\twidth="100%"><items><Image\n\t\t\t\t\tsrc="../webapp/images/logo_sap.svg"\n\t\t\t\t\talt="SAP Company Logo"\n\t\t\t\t\tdensityAware="false"\n\t\t\t\t\twidth="3rem"\n\t\t\t\t\theight="1.5rem"\n\t\t\t\t\tclass="sapUiTinyMarginTop" /><FlexBox\n\t\t\t\t\t\tclass="sapUiTinyMarginTop" wrap="Wrap"><items><Link\n\t\t\t\t\t\t\t\tclass="sapUiTinyMarginEnd sapUiTinyMarginBottom sapUiTinyMarginBegin"\n\t\t\t\t\t\t\t\ttext="{i18n>FOOTER_LEGAL_DISCOLURE}"\n\t\t\t\t\t\t\t\thref="https://www.sap.com/corporate/en/legal/impressum.html"\n\t\t\t\t\t\t\t\ttarget="_blank"/><Link\n\t\t\t\t\t\t\t\tclass="sapUiTinyMarginEnd sapUiTinyMarginBottom sapUiTinyMarginBegin"\n\t\t\t\t\t\t\t\ttext="{i18n>FOOTER_PRIVACY}"\n\t\t\t\t\t\t\t\thref="https://www.sap.com/corporate/en/legal/privacy.html"\n\t\t\t\t\t\t\t\ttarget="_blank"/><Link\n\t\t\t\t\t\t\t\tclass="sapUiTinyMarginEnd sapUiTinyMarginBottom sapUiTinyMarginBegin"\n\t\t\t\t\t\t\t\ttext="{i18n>FOOTER_TERMS}"\n\t\t\t\t\t\t\t\thref="https://www.sap.com/corporate/en/legal/terms-of-use.html"\n\t\t\t\t\t\t\t\tvisible="{= !${versionData>/isOpenUI5} &amp;&amp; !${versionData>/isDevEnv} }"\n\t\t\t\t\t\t\t\ttarget="_blank"/><Link\n\t\t\t\t\t\t\t\ttext="{i18n>FOOTER_TRADEMARK}"\n\t\t\t\t\t\t\t\tclass="sapUiTinyMarginEnd sapUiTinyMarginBottom sapUiTinyMarginBegin"\n\t\t\t\t\t\t\t\thref="https://www.sap.com/corporate/en/legal/trademark.html"\n\t\t\t\t\t\t\t\ttarget="_blank"/><Link\n\t\t\t\t\t\t\t\tclass="sapUiTinyMarginEnd sapUiTinyMarginBottom sapUiTinyMarginBegin"\n\t\t\t\t\t\t\t\ttext="{i18n>FOOTER_COPYRIGHT}"\n\t\t\t\t\t\t\t\thref="https://www.sap.com/corporate/en/legal/copyright.html"\n\t\t\t\t\t\t\t\ttarget="_blank"/><Link\n\t\t\t\t\t\t\t\tclass="sapUiTinyMarginEnd sapUiTinyMarginBottom sapUiTinyMarginBegin"\n\t\t\t\t\t\t\t\ttext="{i18n>FOOTER_LICENSE}"\n\t\t\t\t\t\t\t\thref="LICENSE.txt"\n\t\t\t\t\t\t\t\tvisible="{versionData>/isOpenUI5}"\n\t\t\t\t\t\t\t\ttarget="_blank"/><Link\n\t\t\t\t\t\t\t\tclass="sapUiTinyMarginBegin"\n\t\t\t\t\t\t\t\ttext="{i18n>FOOTER_TERMS}"\n\t\t\t\t\t\t\t\thref="TermsOfUse.txt"\n\t\t\t\t\t\t\t\tvisible="{versionData>/isOpenUI5}"\n\t\t\t\t\t\t\t\ttarget="_blank"/></items></FlexBox></items></FlexBox></Toolbar><Toolbar style="Clear" class="sapUiDocumentationFooter"><Text text="© {sharedParams>/currentYear} SAP SE or an SAP affiliate company and OpenUI5 contributors" \n\t\t        textAlign="Center"\n\t\t\t\twidth="100%" \n\t\t\t\tclass="sapUiTinyMarginBegin" /></Toolbar></core:FragmentDefinition>',
	"sap/ui/demo/iconexplorer/view/browse/Grid.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:grid="sap.ui.layout.cssgrid"\n\txmlns:core="sap.ui.core"><f:GridList\n\t\tid="results"\n\t\twidth="auto"\n\t\tclass="sapUiTinyMargin sapUiNoContentPadding"\n\t\titems="{\n\t\t\tpath: \'groups/0/icons\',\n\t\t\tlength: \'200\',\n\t\t\tsorter: {\n\t\t\t\tpath: \'name\',\n\t\t\t\tdescending: false\n\t\t\t},\n\t\t\ttemplateShareable: true\n\t\t}"\n\t\tgrowing="true"\n\t\tgrowingScrollToLoad="true"\n\t\tgrowingThreshold="{view>/growingThreshold}"\n\t\tupdateFinished=".onUpdateFinished"\n\t\tshowNoData="false"><f:customLayout><grid:GridBoxLayout boxWidth="8.125rem"/></f:customLayout><f:GridListItem class="sapUiTinyMargin" type="Active"><VBox alignItems="Center"><core:Icon\n\t\t\t\t\tclass="sapUiTinyMarginTop"\n\t\t\t\t\tsize="2.5rem"\n\t\t\t\t\tsrc="sap-icon://{view>/iconPath}{name}"\n\t\t\t\t\tcolor="Default"\n\t\t\t\t\tuseIconTooltip="false"/><Label\n\t\t\t\t\ttext="{name}"\n\t\t\t\t\ttextAlign="Center"\n\t\t\t\t\twidth="6rem"\n\t\t\t\t\tclass="sapUiTinyMarginTop"/><HBox><RatingIndicator\n\t\t\t\t\t\ticonUnselected="sap-icon://unfavorite"\n\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\tpath: \'name\',\n\t\t\t\t\t\t\tformatter: \'.formatter.favoriteRating\'\n\t\t\t\t\t\t}"\n\t\t\t\t\t\tmaxValue="1"\n\t\t\t\t\t\tchange=".onToggleFavorite"/><Button\n\t\t\t\t\t\ticon="sap-icon://copy"\n\t\t\t\t\t\ttype="Transparent"\n\t\t\t\t\t\ttooltip="{i18n>previewCopyIconToClipboard}"\n\t\t\t\t\t\tpress=".handleCopyToClipboardClick"\n\t\t\t\t\t\tclass="sapUiTinyMarginBegin"\n\t\t\t\t\t\tariaLabelledBy="labelCopyButton"/></HBox></VBox></f:GridListItem></f:GridList></core:FragmentDefinition>\n',
	"sap/ui/demo/iconexplorer/view/browse/OverviewHeader.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:core="sap.ui.core"><f:DynamicPageHeader pinnable="false"><FlexBox wrap="Wrap"><VBox class="sapUiSmallMarginEnd"><Label text="Library:" labelFor="libraryPicker" /><Select id="libraryPicker"\n\t\t\t\t\t\tchange=".onChangeFont"\n\t\t\t\t\t\tselectedKey="{path: \'view>/fontName\', mode: \'OneWay\'}"\n\t\t\t\t\t\titems="{\n\t\t\t\t\t\tpath: \'/AllFonts\',\n\t\t\t\t\t\tsorter: {\n\t\t\t\t\t\t\tpath: \'name\',\n\t\t\t\t\t\t\tdescending: false\n\t\t\t\t\t\t}\n\t\t\t\t\t}"><core:Item key="{name}" text="{\n\t\t\t\t\t\t\tpath: \'name\',\n\t\t\t\t\t\t\tformatter: \'.formatter.fontName\'\n\t\t\t\t\t\t}" /></Select></VBox><VBox class="sapUiSmallMarginEnd"><Label text="Theme:" labelFor="themePicker"/><Select\n\t\t\t\t\tid="themePicker"\n\t\t\t\t\tchange="handleThemeSelection"\n\t\t\t\t\tselectedKey="{view>/SelectedTheme}"><core:ListItem  key="light" text="{i18n>APP_INFORMATION_BTN_APPEARANCE_LIGHT}" /><core:ListItem  key="dark" text="{i18n>APP_INFORMATION_BTN_APPEARANCE_DARK}" /><core:ListItem  key="hcb" text="{i18n>APP_INFORMATION_BTN_APPEARANCE_HCB}" /><core:ListItem  key="hcw" text="{i18n>APP_INFORMATION_BTN_APPEARANCE_HCW}" /><core:ListItem  key="auto" text="{i18n>APP_INFORMATION_BTN_APPEARANCE_AUTO}" /></Select></VBox><VBox\n\t\t\t\tid="categorySelectionContainer"\n\t\t\t\tvisible="{= ${device>/system/phone} ? false : true}"\n\t\t\t\tclass="sapUiSmallMarginEnd"><Label text="Category:" labelFor="categorySelection" /><ComboBox\n\t\t\t\t\tid="categorySelection"\n\t\t\t\t\titems="{groups}"\n\t\t\t\t\ttooltip="{i18n>overviewSelectCategoryTooltip}"\n\t\t\t\t\tselectionChange=".onSelectCategory"\n\t\t\t\t\tariaLabelledBy="labelCategory"\n\t\t\t\t\twidth="auto"><core:Item\n\t\t\t\t\t\tkey="{name}"\n\t\t\t\t\t\ttext="{text}"/></ComboBox></VBox><VBox><Label text="Search:" labelFor="searchField" /><SearchField\n\t\t\t\t\tid="searchField"\n\t\t\t\t\tliveChange=".onSearch"\n\t\t\t\t\ttooltip="{i18n>searchPlaceholder}"\n\t\t\t\t\twidth="auto"\n\t\t\t\t\tariaLabelledBy="labelIconSearch"></SearchField><layoutData><FlexItemData growFactor="1"/></layoutData></VBox></FlexBox><Toolbar\n            visible="{= ${view>/iconFilterCount} !== 0 &amp;&amp; (${device>/system/phone} ? false : true)}"\n            width="auto"\n            design="Transparent"\n            style="Clear"><Label text="{i18n>overviewTagSelectionLabel}" /><Tokenizer\n                id="tagSelection"\n                renderMode="Narrow"\n                editable="false"\n                width="100%"\n                tokens="{\n                    path: \'groups/0/tags\',\n                    factory: \'._tagSelectionFactory\',\n                    length: 50\n                }"></Tokenizer></Toolbar></f:DynamicPageHeader></core:FragmentDefinition>',
	"sap/ui/demo/iconexplorer/view/browse/OverviewMainContent.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:core="sap.ui.core"><ScrollContainer\n\t\tvertical="true"\n\t\thorizontal="false"\n\t\theight="100%"><Panel\n\t\t\tid="resultContainer"\n\t\t\tvisible="{= ${view>/empty}}"\n\t\t\taccessibleRole="Region"><Toolbar><Title visible="{= ${device>/system/phone} ? false : true}" \n\t\t\t\t\ttext="{\n\t\t\t\t\t\t\tpath : \'view>/iconFilterCount\',\n\t\t\t\t\t\t\tformatter : \'.formatToolbarTitleText\'\n\t\t\t\t\t\t}" /><ToolbarSpacer visible="{= ${device>/system/phone} ? false : true}" /><Label text=\'{i18n>previewCopyMode} \' /><Select\n\t\t\t\t\tselectedKey="{view>/SelectedCopyMode}"\n\t\t\t\t\titems="{\n\t\t\t\t\t\tpath: \'view>/CopyModeCollection\'\n\t\t\t\t\t}"><core:Item key="{view>CopyModeId}" text="{view>Name}" /></Select><SegmentedButton\n\t\t\t\t\tid="layoutSelectionSB"\n\t\t\t\t\tselectionChange=\'.onSegmentSelected\'\n\t\t\t\t\tselectedKey="grid"><items><SegmentedButtonItem\n\t\t\t\t\t\t\ticon="sap-icon://grid"\n\t\t\t\t\t\t\ttooltip="{i18n>overviewTabGridText}"\n\t\t\t\t\t\t\tkey="grid"/><SegmentedButtonItem\n\t\t\t\t\t\t\ticon="sap-icon://list"\n\t\t\t\t\t\t\ttooltip="{i18n>overviewTabDetailsText}"\n\t\t\t\t\t\t\tkey="details"/><SegmentedButtonItem\n\t\t\t\t\t\t\ticon="sap-icon://favorite-list"\n\t\t\t\t\t\t\ttooltip="{i18n>overviewTabFavoritesText}"\n\t\t\t\t\t\t\tkey="favorites"/></items></SegmentedButton></Toolbar><IllustratedMessage visible="{= !${view>/iconsFound} }" illustrationType="sapIllus-SearchFolder" title="{view>/overviewNoDataText}"/></Panel></ScrollContainer></core:FragmentDefinition>',
	"sap/ui/demo/iconexplorer/view/browse/OverviewSideContent.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:grid="sap.ui.layout.cssgrid"\n\txmlns:core="sap.ui.core"><f:SidePanelItem icon="sap-icon://information" text="Details"><f:GridList id="preview" class="SidePanelGridList"><f:customLayout><grid:GridBasicLayout gridTemplateColumns="1fr" gridGap="1rem" /></f:customLayout><f:GridListItem><VBox justifyContent="Center" alignItems="Center"><core:Icon\n\t\t\t\t\t\tid="previewIcon"\n\t\t\t\t\t\tsize="5rem"\n\t\t\t\t\t\tsrc="sap-icon://{view>/iconPath}{name}"/><Title text="{name}" class="sapUiSmallMarginTop" /><Text text="{\n\t\t\t\t\t\t\tpath: \'view>/fontName\',\n\t\t\t\t\t\t\tformatter: \'.formatter.fontName\'\n\t\t\t\t\t}"/></VBox></f:GridListItem><f:GridListItem id="previewCopy"><Title text="{i18n>previewCopyTitle}" /><HBox><Input\n\t\t\t\t\t\tid="previewCopyCode"\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\tvalue="sap-icon://{view>/iconPath}{name}"><layoutData><FlexItemData growFactor="1" /></layoutData></Input><Button\n\t\t\t\t\t\ticon="sap-icon://copy"\n\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\ttooltip="{i18n>previewCopyIconToClipboard}"\n\t\t\t\t\t\tpress=".onCopyCodeToClipboard"\n\t\t\t\t\t\tclass="sapUiTinyMarginBegin"\n\t\t\t\t\t\tariaLabelledBy="labelCopyButton"/></HBox><HBox><Input\n\t\t\t\t\t\tid="previewCopyIcon"\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\tvalue="{view>/iconPath}{name} {i18n>overviewSymbolText}"><layoutData><FlexItemData growFactor="1" /></layoutData></Input><Button\n\t\t\t\t\t\ticon="sap-icon://copy"\n\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\ttooltip="{i18n>previewCopyIconToClipboard}"\n\t\t\t\t\t\tpress=".onCopyIconToClipboard"\n\t\t\t\t\t\tclass="sapUiTinyMarginBegin"\n\t\t\t\t\t\tariaLabelledBy="labelCopyButton"/></HBox><HBox><Input\n\t\t\t\t\t\tid="previewCopyUnicode"\n\t\t\t\t\t\teditable="false"\n\t\t\t\t\t\tvalue="{\n\t\t\t\t\t\t\tpath: \'name\',\n\t\t\t\t\t\t\tformatter: \'.formatter.getUnicodeTextByName\'}"><layoutData><FlexItemData growFactor="1" /></layoutData></Input><Button\n\t\t\t\t\t\ticon="sap-icon://copy"\n\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\ttooltip="{i18n>previewCopyIconToClipboard}"\n\t\t\t\t\t\tpress=".onCopyUnicodeToClipboard"\n\t\t\t\t\t\tclass="sapUiTinyMarginBegin"\n\t\t\t\t\t\tariaLabelledBy="labelCopyButton"/></HBox></f:GridListItem><f:GridListItem id="previewUseCases"><HBox justifyContent="SpaceAround"><Button\n\t\t\t\t\t\ticon="sap-icon://{view>/iconPath}{name}"\n\t\t\t\t\t\tclass="sapUiTinyMarginEnd"\n\t\t\t\t\t\ttooltip="{i18n>previewIconButton}"\n\t\t\t\t\t\tariaLabelledBy="labelPreviewButton"/><Button\n\t\t\t\t\t\ticon="sap-icon://{view>/iconPath}{name}"\n\t\t\t\t\t\ttype="Accept"\n\t\t\t\t\t\tclass="sapUiTinyMarginEnd"\n\t\t\t\t\t\ttooltip="{i18n>previewIconButton}"\n\t\t\t\t\t\tariaLabelledBy="labelPreviewButton"/><Button\n\t\t\t\t\t\ticon="sap-icon://{view>/iconPath}{name}"\n\t\t\t\t\t\ttype="Reject"\n\t\t\t\t\t\tclass="sapUiTinyMarginEnd"\n\t\t\t\t\t\ttooltip="{i18n>previewIconButton}"\n\t\t\t\t\t\tariaLabelledBy="labelPreviewButton"/><Button\n\t\t\t\t\t\ticon="sap-icon://{view>/iconPath}{name}"\n\t\t\t\t\t\ttype="Emphasized"\n\t\t\t\t\t\tclass="sapUiTinyMarginEnd"\n\t\t\t\t\t\ttooltip="{i18n>previewIconButton}"\n\t\t\t\t\t\tariaLabelledBy="labelPreviewButton"/></HBox></f:GridListItem><f:GridListItem id="previewInfo"><Title text="{i18n>previewInfoTitle}" /><ObjectAttribute\n\t\t\t\t\tid="unicodeInfo"\n\t\t\t\t\ttitle="{i18n>previewInfoUnicode}"\n\t\t\t\t\ttext="?"/><ObjectAttribute\n\t\t\t\t\ttitle="{i18n>previewInfoCSSClass}"\n\t\t\t\t\ttext="icon-{name}"/></f:GridListItem><f:GridListItem><Title text="{i18n>previewInfoCategory}" /><ObjectAttribute\n\t\t\t\t\tid="categoryInfo"\n\t\t\t\t\ttext="?"/></f:GridListItem><f:GridListItem><Title text="{i18n>previewInfoTag}" /><Tokenizer\n\t\t\t\t\twidth="100%"\n\t\t\t\t\ttokens="{\n\t\t\t\t\t\tpath: \'tags\',\n\t\t\t\t\t\ttemplateShareable: true\n\t\t\t\t\t}"\n\t\t\t\t\trenderMode="Narrow"\n\t\t\t\t\teditable="false"><Token\n\t\t\t\t\t\ttext="{name}"\n\t\t\t\t\t\tpress=".onTagSelect"/></Tokenizer></f:GridListItem></f:GridList></f:SidePanelItem></core:FragmentDefinition>\n'
});
//# sourceMappingURL=Component-preload.js.map

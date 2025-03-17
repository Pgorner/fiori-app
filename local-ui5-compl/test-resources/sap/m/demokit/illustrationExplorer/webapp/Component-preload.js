//@ui5-bundle sap/ui/demo/illustrationExplorer/Component-preload.js
sap.ui.predefine("sap/ui/demo/illustrationExplorer/Component", [
    "sap/ui/core/UIComponent",
    "sap/ui/documentation/sdk/controller/util/ConfigUtil",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/documentation/sdk/controller/util/CookiesConsentManager"
], (UIComponent,
    ConfigUtil,
    Device,
    JSONModel,
    CookiesConsentManager) => {
    "use strict";

    return UIComponent.extend("sap.ui.demo.illustrationExplorer.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * Initializes the component instance after creation.
         * @public
         * @override
         */
        init() {
            UIComponent.prototype.init.apply(this, arguments);

            const oCategoriesModel = new JSONModel(sap.ui.require.toUrl(
                "sap/ui/demo/illustrationExplorer/model/categories.json"
            ));
            this.setModel(oCategoriesModel, "categories");

            const oIllustrationModel = new JSONModel();
            this.setModel(oIllustrationModel, "illustration");

            this.getRouter().initialize();
        },

        /**
         * Cleans up resources and destroys the component.
         * @public
         * @override
         */
        destroy() {
            this._oConfigUtil?.destroy();
            this._oConfigUtil = null;

            this._oCookiesConsentManager?.destroy();
            this._oCookiesConsentManager = null;

            UIComponent.prototype.destroy.apply(this, arguments);
        },

        /**
         * Retrieves the configuration utility instance.
         * If the instance does not exist, it creates a new one.
         * @returns {ConfigUtil} The configuration utility instance.
         */
        getConfigUtil() {
            if (!this._oConfigUtil) {
                this._oConfigUtil = new ConfigUtil(this);
            }
            return this._oConfigUtil;
        },

        /**
         * Retrieves the content density class according to the device.
         * @returns {string} The content density class.
         */
        getContentDensityClass() {
            return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
        },

        /**
         * Gets or creates the cookies consent manager instance.
         * @returns {object} The cookies consent manager instance
         */
        getCookiesConsentManager() {
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
sap.ui.predefine("sap/ui/demo/illustrationExplorer/controller/App.controller", [
    "sap/ui/demo/illustrationExplorer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/documentation/sdk/controller/util/ThemePicker",
    "sap/m/IllustrationPool",
    "sap/m/IllustratedMessage",
    "sap/m/IllustratedMessageType",
    "sap/ui/core/Fragment"
], (BaseController,
    JSONModel,
    ThemePicker,
    IllustrationPool,
    IllustratedMessage,
    IllustratedMessageType,
    Fragment) => {
    "use strict";

    return BaseController.extend("sap.ui.demo.illustrationExplorer.controller.App", {
        /**
         * Lifecycle method called when the controller is initialized.
         * @override
         */
        onInit() {
            BaseController.prototype.onInit.apply(this, arguments);

            this._defineIllustrationSizes();
            this._defineViewModel();
            this._initThemePicker();
            this._setAppTheme();
            this._registerTntIllustrationSet();
            this._setIllustrations();
            this._showWelcomeMessage();
        },

        _defineIllustrationSizes() {
            this._aIllustrationSizes = [
                "Dot",
                "Spot",
                "Dialog",
                "Scene"
            ];
        },

        _defineViewModel() {
            const oModel = new JSONModel({
                searchQuery: "",
                filteredIllustrations: this._aAllIllustrations,
                illustrationSizes: this._aIllustrationSizes.map((size) => ({ size })),
                illustrationSets: [
                    { set: "sapIllus", text: "Default" },
                    { set: "tnt", text: "TNT" }
                ],
                selectedIllustrationSet: "sapIllus",
                selectedIllustrationSize: "Dialog",
                selectedCategory: "All",
                currentYear: new Date().getFullYear()
            });
            this.setModel(oModel, "app");
        },

        _initThemePicker() {
            ThemePicker.init(this);
        },

        _setAppTheme() {
            const oModel = this.getModel("app");
            const oResourceBundle = this.getResourceBundle();
            const themeTextMap = {
                "light": oResourceBundle.getText("themeLight"),
                "dark": oResourceBundle.getText("themeDark"),
                "hcw": oResourceBundle.getText("themeHCW"),
                "hcb": oResourceBundle.getText("themeHCB"),
                "auto": oResourceBundle.getText("themeAuto"),
                "sap_fiori_3": oResourceBundle.getText("themeQuartz"),
                "sap_fiori_3_dark": oResourceBundle.getText("themeQuartzDark"),
                "sap_fiori_3_hcw": oResourceBundle.getText("themeQuartzHCW"),
                "sap_fiori_3_hcb": oResourceBundle.getText("themeQuartzHCB")
            };

            const aThemes = Object.keys(ThemePicker._getTheme()).map((theme) => {
                return { theme, text: themeTextMap[theme] || theme };
            });

            oModel.setProperty("/themes", aThemes);
            oModel.setProperty("/selectedTheme", this._getSelectedTheme());
        },

        _setIllustrations() {
            const oModel = this.getModel("app");
            const sSelectedSet = oModel.getProperty("/selectedIllustrationSet");
            const sSelectedSize = oModel.getProperty("/selectedIllustrationSize");
            const oSetMetadata = IllustrationPool.getIllustrationSetMetadata(sSelectedSet);

            const oCategoriesModel = this.getOwnerComponent().getModel("categories");
            const aCategories = oCategoriesModel.getProperty("/categories") || [];
            const illustrationToCategoryMap = {};

            aCategories.forEach((oCategory) => {
                const sCategoryName = oCategory.category;
                if (oCategory.illustrations && Array.isArray(oCategory.illustrations)) {
                    oCategory.illustrations.forEach((sType) => {
                        illustrationToCategoryMap[sType] = sCategoryName;
                    });
                }
            });

            this._aAllIllustrations = oSetMetadata.aSymbols.map((sType) => {
                const convertedType = this._convertIllustrationType(sType);
                return {
                    set: sSelectedSet,
                    size: sSelectedSize,
                    type: convertedType,
                    category: illustrationToCategoryMap[convertedType] || "Unknown"
                };
            }).sort((a, b) => a.type.localeCompare(b.type)); // Sort illustrations alphabetically

            this._applyMediaChange();
        },

        _registerTntIllustrationSet() {
            const oTntSet = {
                setFamily: "tnt",
                setURI: sap.ui.require.toUrl("sap/tnt/themes/base/illustrations")
            };
            IllustrationPool.registerIllustrationSet(oTntSet, false);
        },

        _convertIllustrationType(type) {
            return type.replace(/V(\d+)$/, "_v$1");
        },

        _getSelectedTheme() {
            return ThemePicker._oConfigUtil.getCookieValue("appearance") || "auto";
        },

        onSearch(oEvent) {
            const sQuery = oEvent.getParameter("newValue").toLowerCase();
            this.getModel("app").setProperty("/searchQuery", sQuery);
            this._applySearch();
        },

        onIllustrationSizeChange(oEvent) {
            const sSelectedSize = oEvent.getParameter("selectedItem").getKey();
            this.getModel("app").setProperty("/selectedIllustrationSize", sSelectedSize);
            this._applyMediaChange();
        },

        onIllustrationSetChange(oEvent) {
            const sSelectedSet = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getModel("app");
            oModel.setProperty("/selectedIllustrationSet", sSelectedSet);

            if (sSelectedSet === "tnt") {
                oModel.setProperty("/selectedCategory", "All");
                this.byId("categorySelect").setEnabled(false);
            } else {
                this.byId("categorySelect").setEnabled(true);
            }

            this._setIllustrations();
        },

        onCategoryChange(oEvent) {
            const sSelectedCategory = oEvent.getParameter("selectedItem").getKey();
            this.getModel("app").setProperty("/selectedCategory", sSelectedCategory);
            this._applySearch();
        },

        onThemeChange(oEvent) {
            const sSelectedTheme = oEvent.getParameter("selectedItem").getKey();
            ThemePicker._updateAppearance(sSelectedTheme);
            this.getModel("app").setProperty("/selectedTheme", sSelectedTheme);
        },

        _applyMediaChange() {
            const sSelectedSize = this.getModel("app").getProperty("/selectedIllustrationSize");
            this._aAllIllustrations = this._aAllIllustrations.map((oItem) => {
                return {
                    ...oItem,
                    size: sSelectedSize
                };
            });
            this._applySearch();
        },

        _applySearch() {
            const oModel = this.getModel("app");
            const sSearchQuery = oModel.getProperty("/searchQuery").toLowerCase();
            const sSelectedCategory = oModel.getProperty("/selectedCategory");
            const aFiltered = this._aAllIllustrations.filter(({ type, category }) => {
                const matchesQuery = !sSearchQuery || type.toLowerCase().includes(sSearchQuery);
                const matchesCategory = sSelectedCategory === "All" || category === sSelectedCategory;
                return matchesQuery && matchesCategory;
            });
            oModel.setProperty("/filteredIllustrations", aFiltered);
        },

        _showWelcomeMessage() {
            const oResourceBundle = this.getResourceBundle();
            const oSideContentContainer = this.byId("sideContentContainer");
            const oWelcomeMessage = new IllustratedMessage({
                illustrationType: IllustratedMessageType.SearchFolder,
                title: oResourceBundle.getText("welcomeMessageTitle"),
                description: oResourceBundle.getText("welcomeMessageDescription")
            });
            oSideContentContainer.addItem(oWelcomeMessage);
        },

        onIllustrationPress(oEvent) {
            const oIllustrationModel = this.getOwnerComponent().getModel("illustration");
            const oDynamicSideContent = this.byId("dynamicSideContent");
            const oSideContentContainer = this.byId("sideContentContainer");
            const oContext = oEvent.getSource().getBindingContext("app");
            const oSelectedIllustration = oContext.getObject();

            if (!oDynamicSideContent.isSideContentVisible()) {
                this.getRouter().navTo("illustrationDetails", {
                    category: oSelectedIllustration.category,
                    set: oSelectedIllustration.set,
                    type: oSelectedIllustration.type
                });
                return;
            }

            // Update the illustration model properties
            oIllustrationModel.setProperty("/category", oSelectedIllustration.category);
            oIllustrationModel.setProperty("/set", oSelectedIllustration.set);
            oIllustrationModel.setProperty("/type", `${oSelectedIllustration.set}-${oSelectedIllustration.type}`);

            // Load the fragment if not already loaded
            if (!this._pIllustrationDetailsFragment) {
                this._pIllustrationDetailsFragment = Fragment.load({
                    name: "sap.ui.demo.illustrationExplorer.view.fragments.IllustrationDetailsContent",
                    controller: this
                });
            }

            // Once the fragment is loaded, add it to the side content
            this._pIllustrationDetailsFragment.then((oFragment) => {
                oSideContentContainer.removeAllItems();
                oSideContentContainer.addItem(oFragment);
            });
        }
    });
});
sap.ui.predefine("sap/ui/demo/illustrationExplorer/controller/BaseController", [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/base/Log"
], (Controller, UIComponent, Log) => {
    "use strict";

    return Controller.extend("sap.ui.demo.illustrationExplorer.controller.BaseController", {
        /**
         * Lifecycle method called when the controller is initialized.
         */
        onInit() {
            Log.setLevel(Log.Level.WARNING);

            this.applyContentDensityClass();
        },

        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter() {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel(sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel(oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Adds the content density class to the view.
         * @public
         */
        applyContentDensityClass() {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        },

        /**
         * Navigates to home page
         * @public
         */
        onNavToHome() {
            this.getRouter().navTo("home");
        }
    });
});
sap.ui.predefine("sap/ui/demo/illustrationExplorer/controller/IllustrationDetails.controller", [
    "sap/ui/demo/illustrationExplorer/controller/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("sap.ui.demo.illustrationExplorer.controller.IllustrationDetails", {
        onInit() {
            this.getRouter().getRoute("illustrationDetails")
                .attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched(oEvent) {
            // Get route parameters
            const oArgs = oEvent.getParameter("arguments");
            const { category, set, type } = oArgs;

            // Get the existing "illustration" model
            const oModel = this.getModel("illustration");
            const oData = oModel.getData();

            const sIllustrationType = `${set}-${type}`;

            // Check if the model properties need to be updated
            if (oData.set !== set || oData.type !== sIllustrationType) {
                oModel.setProperty("/category", category);
                oModel.setProperty("/set", set);
                oModel.setProperty("/type", sIllustrationType);
            }
        }
    });
});
sap.ui.predefine("sap/ui/demo/illustrationExplorer/controller/NotFound.controller", [
    "sap/ui/demo/illustrationExplorer/controller/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("sap.ui.demo.illustrationExplorer.controller.NotFound", {
        // ...
    });
});
sap.ui.require.preload({
	"sap/ui/demo/illustrationExplorer/i18n/i18n.properties":'#XTIT: Application name\nappTitle=Illustration Explorer\n#YDES: Application description\nappDescription=Explore the different illustration types and their usage in the SAP Fiori design guidelines.\n#XTIT: Page title\npageTitle=Illustration Explorer\n#XTIT: Page title\nillustrationDetailsTitle=Illustration Details\n\nbackToHomeTooltip=Back to Home\n\nsearchPlaceholder=Search...\n\nthemeLight=SAP Horizon\nthemeDark=SAP Horizon Dark\nthemeHCW=SAP Horizon High Contrast White\nthemeHCB=SAP Horizon High Contrast Black\nthemeAuto=Auto \\u0028OS Dependant\\u0029\n\nthemeQuartz=SAP Fiori 3\nthemeQuartzDark=SAP Fiori 3 Dark\nthemeQuartzHCW=SAP Fiori 3 High Contrast White\nthemeQuartzHCB=SAP Fiori 3 High Contrast Black\n\nthemeLabel=Theme\nillustrationSizeLabel=Illustration Size\nillustrationSetLabel=Illustration Set\nillustrationCategoryLabel=Category\nillustrationTypeLabel=Illustration Type\n\ndefaultTntTitle=Sample Title\ndefaultTntDescription=Sample Description\n\nwelcomeMessageTitle=Welcome to the Illustration Explorer App\nwelcomeMessageDescription=This application allows you to explore various illustrations. Select an illustration from the main content area to see different media types and details.\n\nFOOTER_LEGAL_DISCOLURE=Legal Disclosure\nFOOTER_PRIVACY=Privacy\nFOOTER_TRADEMARK=Trademark\nFOOTER_COPYRIGHT=Copyright\n\npageNotFoundTitle=Page not found\n',
	"sap/ui/demo/illustrationExplorer/manifest.json":'{"_version":"1.68.0","sap.app":{"id":"sap.ui.demo.illustrationExplorer","type":"application","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""],"fallbackLocale":""}},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.illustrationExplorer.view.App","type":"XML","async":true},"dependencies":{"minUI5Version":"1.120.0","libs":{"sap.m":{},"sap.f":{},"sap.ui.core":{},"sap.ui.layout":{},"sap.ui.documentation":{}}},"componentUsages":{"cookieSettingsDialog":{"name":"sap.ui.documentation.sdk.cookieSettingsDialog"}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.illustrationExplorer.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.ui.demo.illustrationExplorer.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":"notFound"},"async":true},"routes":[{"pattern":"","name":"home","target":"home"},{"pattern":"illustration/{category}/{set}/{type}","name":"illustrationDetails","target":"illustrationDetails"}],"targets":{"home":{"viewName":"App","viewId":"main","viewLevel":1},"illustrationDetails":{"viewName":"IllustrationDetails","viewId":"illustrationDetails","viewLevel":2},"notFound":{"viewName":"NotFound","viewId":"notFound"}}}}}',
	"sap/ui/demo/illustrationExplorer/view/App.view.xml":'<mvc:XMLView\n    controllerName="sap.ui.demo.illustrationExplorer.controller.App"\n    displayBlock="true"\n    height="100%"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core"><App id="app" class="sapUiDemoIllustrationExplorer"><Page title="{i18n>pageTitle}" titleLevel="H1"\n            class="sapUiResponsivePadding--header sapUiResponsivePadding--subHeader sapUiResponsivePadding--footer"><subHeader><core:Fragment\n                    fragmentName="sap.ui.demo.illustrationExplorer.view.fragments.SubHeader"\n                    type="XML" /></subHeader><content><core:Fragment\n                    fragmentName="sap.ui.demo.illustrationExplorer.view.fragments.Main"\n                    type="XML" /></content><footer><core:Fragment\n                    fragmentName="sap.ui.demo.illustrationExplorer.view.fragments.Footer"\n                    type="XML" /></footer></Page></App></mvc:XMLView>',
	"sap/ui/demo/illustrationExplorer/view/IllustrationDetails.view.xml":'<mvc:View\n    controllerName="sap.ui.demo.illustrationExplorer.controller.IllustrationDetails"\n    displayBlock="true"\n    height="100%"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core"><Page title="{i18n>illustrationDetailsTitle}" titleLevel="H1" showNavButton="true"\n        navButtonPress=".onNavToHome" navButtonTooltip="{i18n>backToHomeTooltip}"\n        class="sapUiDemoIllustrationExplorerDetailsPage sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"><content><core:Fragment\n                fragmentName="sap.ui.demo.illustrationExplorer.view.fragments.IllustrationDetailsContent"\n                type="XML" /></content><footer><core:Fragment fragmentName="sap.ui.demo.illustrationExplorer.view.fragments.Footer"\n                type="XML" /></footer></Page></mvc:View>',
	"sap/ui/demo/illustrationExplorer/view/NotFound.view.xml":'<mvc:View\n    controllerName="sap.ui.demo.illustrationExplorer.controller.NotFound"\n    displayBlock="true"\n    height="100%"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core"><Page title="{i18n>pageNotFoundTitle}" titleLevel="H1" showNavButton="true"\n        navButtonPress=".onNavToHome" navButtonTooltip="{i18n>backToHomeTooltip}"\n        class="sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"><content><IllustratedMessage illustrationType="sapIllus-PageNotFound" /></content><footer><core:Fragment\n                fragmentName="sap.ui.demo.illustrationExplorer.view.fragments.Footer"\n                type="XML" /></footer></Page></mvc:View>',
	"sap/ui/demo/illustrationExplorer/view/fragments/Footer.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"><Toolbar class="sapUiDemoIllustrationExplorerFooter"><FlexBox\n            class="sapUiDemoIllustrationExplorerFooterContentWrapper"\n            width="100%"\n            justifyContent="SpaceBetween"\n            alignItems="Center"\n            wrap="Wrap"><FlexBox alignItems="Center"><Image\n                    class="sapUiTinyMarginEnd"\n                    src="../webapp/images/logo_sap.svg"\n                    alt="SAP Company Logo"\n                    width="3rem"\n                    height="1.5rem" /><Text\n                    text="© {app>/currentYear} SAP SE or an SAP affiliate company. All rights reserved." /></FlexBox><FlexBox><Link\n                    class="sapUiSmallMarginEnd"\n                    text="{i18n>FOOTER_LEGAL_DISCOLURE}"\n                    href="https://www.sap.com/corporate/en/legal/impressum.html"\n                    target="_blank" /><Link\n                    class="sapUiSmallMarginEnd"\n                    text="{i18n>FOOTER_PRIVACY}"\n                    href="https://www.sap.com/corporate/en/legal/privacy.html"\n                    target="_blank" /><Link\n                    class="sapUiSmallMarginEnd"\n                    text="{i18n>FOOTER_TRADEMARK}"\n                    href="https://www.sap.com/corporate/en/legal/trademark.html"\n                    target="_blank" /><Link\n                    text="{i18n>FOOTER_COPYRIGHT}"\n                    href="https://www.sap.com/corporate/en/legal/copyright.html"\n                    target="_blank" /></FlexBox></FlexBox></Toolbar></core:FragmentDefinition>',
	"sap/ui/demo/illustrationExplorer/view/fragments/IllustrationDetailsContent.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"><VBox class="sapUiDemoIllustrationExplorerDetailsContent"><HBox class="sapUiSmallMarginBottom"><ObjectStatus title="{i18n>illustrationTypeLabel}" text="{illustration>/type}"\n                state="Information"><layoutData><FlexItemData styleClass="sapUiSmallMarginEnd" /></layoutData></ObjectStatus><ObjectStatus title="{i18n>illustrationCategoryLabel}" text="{illustration>/category}"\n                state="Success"\n                visible="{= ${illustration>/set} !== \'tnt\' }" /></HBox><Panel headerText="{i18n>illustrationSizeLabel}: Dot"><IllustratedMessage\n                illustrationType="{illustration>/type}"\n                illustrationSize="Dot"\n                title="{= ${illustration>/set} === \'tnt\' ? ${i18n>defaultTntTitle} : \'\' }"\n                description="{= ${illustration>/set} === \'tnt\' ? ${i18n>defaultTntDescription} : \'\' }" /><layoutData><FlexItemData styleClass="sapUiSmallMarginBottom" /></layoutData></Panel><Panel headerText="{i18n>illustrationSizeLabel}: Spot"><IllustratedMessage\n                illustrationType="{illustration>/type}"\n                illustrationSize="Spot"\n                title="{= ${illustration>/set} === \'tnt\' ? ${i18n>defaultTntTitle} : \'\' }"\n                description="{= ${illustration>/set} === \'tnt\' ? ${i18n>defaultTntDescription} : \'\' }" /><layoutData><FlexItemData styleClass="sapUiSmallMarginBottom" /></layoutData></Panel><Panel headerText="{i18n>illustrationSizeLabel}: Dialog"><IllustratedMessage\n                illustrationType="{illustration>/type}"\n                illustrationSize="Dialog"\n                title="{= ${illustration>/set} === \'tnt\' ? ${i18n>defaultTntTitle} : \'\' }"\n                description="{= ${illustration>/set} === \'tnt\' ? ${i18n>defaultTntDescription} : \'\' }" /><layoutData><FlexItemData styleClass="sapUiSmallMarginBottom" /></layoutData></Panel><Panel headerText="{i18n>illustrationSizeLabel}: Scene"><IllustratedMessage\n                illustrationType="{illustration>/type}"\n                illustrationSize="Scene"\n                title="{= ${illustration>/set} === \'tnt\' ? ${i18n>defaultTntTitle} : \'\' }"\n                description="{= ${illustration>/set} === \'tnt\' ? ${i18n>defaultTntDescription} : \'\' }" /></Panel></VBox></core:FragmentDefinition>',
	"sap/ui/demo/illustrationExplorer/view/fragments/Main.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:f="sap.f"\n    xmlns:core="sap.ui.core"\n    xmlns:layout="sap.ui.layout"\n    xmlns:grid="sap.ui.layout.cssgrid"><layout:DynamicSideContent id="dynamicSideContent" equalSplit="true"><layout:mainContent><f:GridList class="sapUiDemoIllustrationExplorerMainContent"\n                items="{app>/filteredIllustrations}"><f:customLayout><grid:GridResponsiveLayout><grid:layoutS><grid:GridSettings\n                                gridTemplateColumns="1fr 1fr"\n                                gridAutoFlow="RowDense"\n                                gridGap="0.75rem" /></grid:layoutS><grid:layoutM><grid:GridSettings\n                                gridTemplateColumns="1fr 1fr"\n                                gridAutoFlow="RowDense"\n                                gridGap="0.75rem" /></grid:layoutM><grid:layout><grid:GridSettings\n                                gridTemplateColumns="repeat(auto-fill, minmax(12rem, 1fr))"\n                                gridAutoFlow="RowDense"\n                                gridGap="1rem" /></grid:layout></grid:GridResponsiveLayout></f:customLayout><f:GridListItem type="Active" press=".onIllustrationPress"><VBox alignItems="Center" class="sapUiSmallMargin"><Illustration class="sapUiDemoIllustrationExplorerImage" set="{app>set}"\n                            media="{app>size}" type="{app>type}" /><Text class="sapUiSmallMarginTop" text="{app>type}" /></VBox></f:GridListItem></f:GridList></layout:mainContent><layout:sideContent><grid:CSSGrid\n                id="sideContentContainer"\n                class="sapUiDemoIllustrationExplorerSideContent"\n                gridTemplateColumns="1fr"\n                gridGap="1rem"></grid:CSSGrid></layout:sideContent></layout:DynamicSideContent></core:FragmentDefinition>',
	"sap/ui/demo/illustrationExplorer/view/fragments/SubHeader.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"><OverflowToolbar><SearchField\n            id="searchField"\n            class="sapUiDemoIllustrationExplorerSearchField"\n            placeholder="{i18n>searchPlaceholder}"\n            liveChange=".onSearch"><layoutData><OverflowToolbarLayoutData\n                    priority="NeverOverflow"\n                    minWidth="12rem"\n                    maxWidth="22rem"\n                    shrinkable="true" /></layoutData></SearchField><ToolbarSpacer width="1rem" /><Label\n            text="{i18n>illustrationSizeLabel}"\n            labelFor="illustrationSizeSelect"\n            showColon="true"><layoutData><OverflowToolbarLayoutData group="1" /></layoutData></Label><Select\n            id="illustrationSizeSelect"\n            class="sapUiDemoIllustrationExplorerIllustrationSizeSelect"\n            width="100%"\n            items="{app>/illustrationSizes}"\n            selectedKey="{app>/selectedIllustrationSize}"\n            change=".onIllustrationSizeChange"><core:Item key="{app>size}" text="{app>size}" /><layoutData><OverflowToolbarLayoutData\n                    group="1"\n                    minWidth="12rem"\n                    maxWidth="14rem"\n                    shrinkable="true" /></layoutData></Select><Label\n            text="{i18n>illustrationSetLabel}"\n            labelFor="illustrationSetSelect"\n            showColon="true"><layoutData><OverflowToolbarLayoutData group="2" /></layoutData></Label><Select\n            id="illustrationSetSelect"\n            class="sapUiDemoIllustrationExplorerIllustrationSetSelect"\n            width="100%"\n            items="{app>/illustrationSets}"\n            selectedKey="{app>/selectedIllustrationSet}"\n            change=".onIllustrationSetChange"><core:Item key="{app>set}" text="{app>text}" /><layoutData><OverflowToolbarLayoutData\n                    group="2"\n                    minWidth="12rem"\n                    maxWidth="14rem"\n                    shrinkable="true" /></layoutData></Select><Label\n            text="{i18n>illustrationCategoryLabel}"\n            labelFor="categorySelect"\n            showColon="true"><layoutData><OverflowToolbarLayoutData group="3" /></layoutData></Label><Select\n            id="categorySelect"\n            class="sapUiDemoIllustrationExplorerCategorySelect"\n            width="100%"\n            items="{categories>/categories}"\n            selectedKey="{app>/selectedCategory}"\n            change=".onCategoryChange"><core:Item key="{categories>category}" text="{categories>category}" /><layoutData><OverflowToolbarLayoutData\n                    group="3"\n                    minWidth="12rem"\n                    maxWidth="14rem"\n                    shrinkable="true" /></layoutData></Select><Label\n            text="{i18n>themeLabel}"\n            labelFor="themeSelect"\n            showColon="true"><layoutData><OverflowToolbarLayoutData group="4" /></layoutData></Label><Select\n            id="themeSelect"\n            class="sapUiDemoIllustrationExplorerThemeSelect"\n            width="100%"\n            items="{app>/themes}"\n            selectedKey="{app>/selectedTheme}"\n            change=".onThemeChange"><core:Item key="{app>theme}" text="{app>text}" /><layoutData><OverflowToolbarLayoutData\n                    group="4"\n                    minWidth="12rem"\n                    maxWidth="14rem"\n                    shrinkable="true" /></layoutData></Select></OverflowToolbar></core:FragmentDefinition>'
});
//# sourceMappingURL=Component-preload.js.map

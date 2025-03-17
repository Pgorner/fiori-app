//@ui5-bundle sap/fe/plugins/managecache/library-preload.js
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/fe/plugins/managecache/comp/Component", ["sap/ui/core/UIComponent", "sap/ui/core/cache/CacheManager", "sap/ui/core/mvc/View", "sap/ui/core/mvc/ViewType", "sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel"], function (UIComponent, CacheManager, View, ViewType, JSONModel, i18nModel) {
  "use strict";

  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  let RequestSettingsComponent = /*#__PURE__*/function (_UIComponent) {
    function RequestSettingsComponent() {
      return _UIComponent.apply(this, arguments) || this;
    }
    _inheritsLoose(RequestSettingsComponent, _UIComponent);
    var _proto = RequestSettingsComponent.prototype;
    _proto.getWaitInit = async function getWaitInit() {
      return this.waitInit;
    };
    _proto.init = async function init() {
      let resolveFunction;
      _UIComponent.prototype.init.call(this);
      this.waitInit = new Promise(resolve => {
        resolveFunction = resolve;
      });
      const container = sap.ui.require("sap/ushell/Container");
      const personalizationService = await container.getServiceAsync("PersonalizationV2");
      this.model = new JSONModel({});
      this.personalizationService = personalizationService;
      this.scope = {
        clientStorageAllowed: false,
        keyCategory: personalizationService.constants.keyCategory.FIXED_KEY,
        validity: "Infinity",
        writeFrequency: personalizationService.constants.writeFrequency.LOW
      };
      this.personalizationId = {
        container: "sap.ushell.optimisticreq.personalization",
        item: "data"
      };
      const period = await this._getPersonalizedPeriod(personalizationService);
      // Remove old managecache entries via cache manager
      const timeStamp = new Date(Date.now() - period * 86400000);
      const filters = {
        olderThan: timeStamp,
        prefix: "sap.ui.model.odata.v4.managecache"
      };
      CacheManager.delWithFilters(filters);
      // Enhance user activities section with optimistic batch settings
      await this._createActivitiesSection();
      resolveFunction();
    };
    _proto._getPersonalizedPeriod = async function _getPersonalizedPeriod(personalizationService) {
      const personalizer = await personalizationService.getPersonalizer(this.personalizationId, this.scope);
      const personalizationContainer = await personalizer.getPersData();
      // Use personalization service to get/set period
      let period = personalizationContainer?.period;
      period ??= 30;
      this.model.setProperty("/period", period);
      this.model.setProperty("/oldperiod", period);
      return period;
    };
    _proto._setPersonalizedPeriod = async function _setPersonalizedPeriod(personalizationService, period) {
      const personalizer = await personalizationService.getPersonalizer(this.personalizationId, this.scope);
      return personalizer.setPersData(period);
    };
    _proto._createActivitiesSection = async function _createActivitiesSection() {
      const i18n = new i18nModel({
        bundleName: "sap.fe.plugins.managecache.comp.i18n.messagebundle"
      });
      const viewType = ViewType.XML;
      const viewSettings = {
        type: viewType,
        id: "requestCacheView",
        viewName: "sap.fe.plugins.managecache.comp.view.settings"
      };
      const container = sap.ui.require("sap/ushell/Container");
      const frameBoundExtension = await container.getServiceAsync("FrameBoundExtension");
      await frameBoundExtension.addGroupedUserSettingsEntry({
        title: i18n.getResourceBundle().getText("T_GROUP"),
        icon: "sap-icon://laptop",
        entryHelpId: "userActivitiesEntry",
        groupingId: "userActivities",
        groupingTabTitle: i18n.getResourceBundle().getText("title"),
        groupingTabHelpId: "requestCacheUserActivities-helpId",
        value: async function () {
          return Promise.resolve("Request Cache"); //check
        },
        content: async () => {
          return View.create(viewSettings).then(view => {
            view.setModel(this.model);
            view.setModel(i18n, "i18n");
            this.viewInstance = view;
            return this.viewInstance;
          });
        },
        onSave: async () => {
          const period = this.model.getProperty("/period");
          await this._setPersonalizedPeriod(this.personalizationService, {
            period: period
          });
          return this.viewInstance.getController().onSave(period);
        },
        onCancel: () => {
          return this.viewInstance.getController().onCancel();
        }
      });
    };
    return RequestSettingsComponent;
  }(UIComponent);
  return RequestSettingsComponent;
}, false);
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/fe/plugins/managecache/comp/controller/settings.controller", ["sap/m/MessageToast", "sap/ui/core/cache/CacheManager", "sap/ui/core/mvc/Controller", "sap/ui/model/resource/ResourceModel"], function (MessageToast, CacheManager, Controller, i18nModel) {
  "use strict";

  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  let RequestSettingsController = /*#__PURE__*/function (_Controller) {
    function RequestSettingsController() {
      return _Controller.apply(this, arguments) || this;
    }
    _inheritsLoose(RequestSettingsController, _Controller);
    var _proto = RequestSettingsController.prototype;
    _proto.onInit = function onInit() {
      this.viewInstance = this.getView();
    };
    _proto.onSave = function onSave(period) {
      const internalModel = this.viewInstance?.getModel();
      internalModel.setProperty("/oldperiod", period);
    };
    _proto.onCancel = function onCancel() {
      const internalModel = this.viewInstance?.getModel();
      const oldPeriod = internalModel.getProperty("/oldperiod");
      if (oldPeriod) {
        internalModel.setProperty("/period", oldPeriod);
      }
    };
    _proto.onChange = function onChange(event) {
      const internalModel = this.viewInstance?.getModel();
      const period = event.getParameter("value");
      internalModel.setProperty("/period", period);
    };
    _proto.onCleanup = function onCleanup() {
      // Remove all optimistic batch entries via cache manager
      CacheManager.delWithFilters();
      const i18n = new i18nModel({
        bundleName: "sap.fe.plugins.managecache.comp.i18n.messagebundle"
      });
      const successToast = i18n.getResourceBundle().getText("M_CLEANUP_SUCCESS");
      MessageToast.show(successToast);
    };
    return RequestSettingsController;
  }(Controller);
  return RequestSettingsController;
}, false);
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/fe/plugins/managecache/library", ["sap/ui/core/Lib", "sap/ui/core/XMLTemplateProcessor", "sap/ui/core/library", "sap/ui/thirdparty/jquery"], function (Lib, _XMLTemplateProcessor, _library, _jquery) {
  "use strict";

  var _exports = {};
  /**
   * Library containing the building blocks for SAP Fiori elements.
   * @namespace
   * @public
   */
  const managecache = "sap.fe.plugins.managecache";

  // library dependencies
  _exports.managecache = managecache;
  const thisLib = Lib.init({
    apiVersion: 2,
    name: "sap.fe.plugins.managecache",
    dependencies: ["sap.ui.core", "sap.m"],
    types: [],
    interfaces: [],
    controls: [],
    elements: [],
    // eslint-disable-next-line no-template-curly-in-string
    version: "1.132.0",
    noLibraryCSS: true
  });
  return thisLib;
}, false);
sap.ui.require.preload({
	"sap/fe/plugins/managecache/comp/manifest.json":'{"_version":"1.1.0","sap.app":{"id":"sap.fe.plugins.managecache.comp","type":"component","applicationVersion":{"version":"1.132.0"},"title":"Request cache settings","resources":"resources.json","ach":"CA-UI5-FE"},"sap.flp":{"type":"plugin","config":{}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"sap.fe.plugins.managecache.comp.view.settings","type":"XML","async":true,"id":"settings"},"config":{"fullWidth":false},"dependencies":{"minUI5Version":"${sap.ui5.dist.version}","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{},"sap.fe.plugins.managecache":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/messagebundle.properties"}}}}',
	"sap/fe/plugins/managecache/comp/view/settings.view.xml":'<mvc:View\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form"\n\tcontrollerName="sap.fe.plugins.managecache.comp.controller.settings"\n\txmlns="sap.m"\n><f:SimpleForm id="userActivitiesForm" layout="ResponsiveGridLayout"><f:content><HBox class="sapUiTinyMargin" justifyContent="SpaceBetween" alignItems="Center"><VBox><VBox><Label text="{i18n>T_EXPIRY}" /><StepInput\n\t\t\t\t\t\t\tvalue="{path: \'/period\', type: \'sap.ui.model.type.Integer\'}"\n\t\t\t\t\t\t\tdisplayValuePrecision="{displayValuePrecision}"\n\t\t\t\t\t\t\tmin="0"\n\t\t\t\t\t\t\tmax="360"\n\t\t\t\t\t\t\twidth="80%"\n\t\t\t\t\t\t\tstep="30"\n\t\t\t\t\t\t\ttextAlign="Center"\n\t\t\t\t\t\t\tdescription="{i18n>T_DAYS}"\n\t\t\t\t\t\t\tchange="onChange"\n\t\t\t\t\t\t/><Button id="clearRequestCache" width="40%" text="{i18n>B_CLEANUP_CACHE}" press="onCleanup" /><Text class="sapUshellFlpSettingsWideDescription" text="{i18n>T_CACHE_INFORMATION_MSG}" /></VBox></VBox></HBox></f:content></f:SimpleForm></mvc:View>\n',
	"sap/fe/plugins/managecache/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.fe.plugins.managecache","type":"library","embeds":["comp"],"applicationVersion":{"version":"1.132.0"},"title":"UI5 library: sap.fe.plugins.managecache","description":"UI5 library: sap.fe.plugins.managecache","ach":"CA-UI5-FE","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.132","libs":{"sap.m":{"minVersion":"1.132.1"},"sap.ui.core":{"minVersion":"1.132.1"}}},"library":{"i18n":false,"css":false,"content":{"controls":[],"elements":[],"types":[],"interfaces":[]}}}}'
});
//# sourceMappingURL=library-preload.js.map

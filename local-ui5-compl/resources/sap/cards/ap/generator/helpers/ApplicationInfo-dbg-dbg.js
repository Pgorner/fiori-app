/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/core/Component"], function (Component) {
  "use strict";

  var ODataModelVersion = /*#__PURE__*/function (ODataModelVersion) {
    ODataModelVersion["V2"] = "V2";
    ODataModelVersion["V4"] = "V4";
    return ODataModelVersion;
  }(ODataModelVersion || {});
  class ApplicationInfo {
    constructor(rootComponent) {
      this._rootComponent = rootComponent;
      const model = rootComponent.getModel();
      this._oDataModelVersion = model.isA("sap.ui.model.odata.v4.ODataModel") ? ODataModelVersion.V4 : ODataModelVersion.V2;
    }
    static createInstance(rootComponent) {
      if (!ApplicationInfo.instance) {
        ApplicationInfo.instance = new ApplicationInfo(rootComponent);
      }
      return ApplicationInfo.instance;
    }
    static getInstance() {
      if (ApplicationInfo.instance) {
        return ApplicationInfo.instance;
      }
      throw new Error("ApplicationInfo instance not found");
    }
    getRootComponent() {
      return this._rootComponent;
    }
    fetchDetails() {
      const model = this._rootComponent.getModel();
      const bODataV4 = this._oDataModelVersion === ODataModelVersion.V4;
      const serviceUrl = bODataV4 ? model.getServiceUrl() : model.sServiceUrl;
      const hash = window.hasher.getHash();
      const componentName = this._rootComponent.getManifest()["sap.app"].id;
      const [hashPartial] = hash.split("&/");
      const [semanticObject, action] = hashPartial.includes("?") ? hashPartial.split("?")[0].split("-") : hashPartial.split("-");
      let path = hash.split("&/")[1] || "";
      path = path.includes("/") ? path.split("/")[0] : path;
      if (path.startsWith("/")) {
        path = path.replace("/", "");
      }
      const index = path.indexOf("(");
      const entitySet = path.substring(0, index);
      return {
        rootComponent: this._rootComponent,
        floorPlan: "ObjectPage",
        odataModel: bODataV4 ? ODataModelVersion.V4 : ODataModelVersion.V2,
        entitySet,
        serviceUrl,
        entitySetWithObjectContext: path,
        componentName,
        semanticObject,
        action
      };
    }
    validateCardGeneration() {
      try {
        const _this = this;
        if (!_this._rootComponent || !(_this._rootComponent instanceof Component)) {
          return Promise.resolve(false);
        }
        const mApplicationInfo = _this.fetchDetails();
        if (!mApplicationInfo.serviceUrl || !mApplicationInfo.entitySet) {
          return Promise.resolve(false);
        }
        const entitySetWithContext = mApplicationInfo.entitySetWithObjectContext;
        if (!entitySetWithContext) {
          return Promise.resolve(false);
        }
        if (entitySetWithContext.indexOf("(") > -1) {
          const paranStart = entitySetWithContext.indexOf("(");
          const paranEnd = entitySetWithContext.indexOf(")");
          const sContext = entitySetWithContext.substring(paranStart + 1, paranEnd);
          if (!sContext) {
            return Promise.resolve(false);
          }
        } else {
          return Promise.resolve(false);
        }
        return Promise.resolve(true);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * For testing purposes only
     */
    _resetInstance() {
      ApplicationInfo.instance = null;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.ODataModelVersion = ODataModelVersion;
  __exports.ApplicationInfo = ApplicationInfo;
  return __exports;
});
//# sourceMappingURL=ApplicationInfo-dbg-dbg.js.map

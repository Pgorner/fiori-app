/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/i18n/ResourceBundle"], function (ResourceBundle) {
  "use strict";

  var ODataModelVersion = /*#__PURE__*/function (ODataModelVersion) {
    ODataModelVersion["V2"] = "V2";
    ODataModelVersion["V4"] = "V4";
    return ODataModelVersion;
  }(ODataModelVersion || {});
  /**
   * Fetches the details of the application
   *
   * @param {Component} rootComponent - The root component of the application
   * @param {FetchApplicationInfoOptions} fetchOptions
   * @returns {Promise<ApplicationInfo>} The application info
   */
  const fetchApplicationInfo = function (rootComponent, fetchOptions) {
    try {
      const isDesignMode = fetchOptions?.isDesignMode || false;
      const componentName = rootComponent.getManifest()["sap.app"].id;
      const model = rootComponent.getModel();
      const hash = window.hasher.getHash();
      const [hashPartial] = hash.split("&/");
      const [semanticObject, action] = hashPartial.includes("?") ? hashPartial.split("?")[0].split("-") : hashPartial.split("-");
      let path = hash.split("&/")[1] || "";
      path = path.includes("/") ? path.split("/")[0] : path;
      path = path.startsWith("/") ? path.slice(1) : path;
      const index = path.indexOf("(");
      const entitySet = index > -1 ? path.substring(0, index) : path;
      const context = index > -1 ? path.substring(index + 1, path.indexOf(")")) : "";
      const odataModel = model.isA("sap.ui.model.odata.v4.ODataModel") ? ODataModelVersion.V4 : ODataModelVersion.V2;
      const i18nModel = rootComponent.getModel("i18n") || rootComponent.getModel("@i18n");
      return Promise.resolve(i18nModel.getResourceBundle()).then(function (resourceBundle) {
        function _temp2() {
          return {
            odataModel,
            appModel: model,
            entitySet,
            entitySetWithObjectContext: path,
            context,
            componentName,
            resourceBundle,
            semanticObject,
            action
          };
        }
        const _temp = function () {
          if (isDesignMode) {
            /* Refreshing or destroying the i18nModel does not fetch the latest values because of caching.
            For cache busting, we are appending a unique identifier to the i18nBundleUrl to fetch the latest i18n values everytime dialog is opened. */
            const i18nBundleUrl = resourceBundle?.oUrlInfo?.url;
            const timeStamp = Date.now();
            return Promise.resolve(ResourceBundle.create({
              url: `${i18nBundleUrl}?v=${timeStamp}`,
              async: true
            })).then(function (_ResourceBundle$creat) {
              resourceBundle = _ResourceBundle$creat;
            });
          }
        }();
        return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var __exports = {
    __esModule: true
  };
  __exports.ODataModelVersion = ODataModelVersion;
  __exports.fetchApplicationInfo = fetchApplicationInfo;
  return __exports;
});
//# sourceMappingURL=ApplicationInfo-dbg-dbg.js.map

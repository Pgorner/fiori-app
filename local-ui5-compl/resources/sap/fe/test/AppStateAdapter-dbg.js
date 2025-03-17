/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery"], function (jQuery) {
  "use strict";

  var _exports = {};
  let AppStateAdapter = /*#__PURE__*/function () {
    function AppStateAdapter() {}
    _exports = AppStateAdapter;
    var _proto = AppStateAdapter.prototype;
    _proto.saveAppState = function saveAppState(sKey, sSessionKey, sValue, sAppName, sComponent) {
      const fetchPromise = fetch("/sap/bc/appState", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: sKey,
          sessionKey: sSessionKey,
          value: sValue,
          appName: sAppName,
          component: sComponent
        })
      });
      const oMyDeferred = jQuery.Deferred();
      fetchPromise.then(async response => {
        return response.json();
      }).then(data => {
        oMyDeferred.resolve(data);
      }).catch(error => {
        oMyDeferred.reject(error);
      });
      return oMyDeferred.promise();
    };
    _proto.loadAppState = function loadAppState(sKey) {
      const oMyDeferred = jQuery.Deferred();
      const fetchPromise = fetch(`/sap/bc/appState/${sKey}`, {
        method: "GET"
      });
      fetchPromise.then(async response => {
        return response.json();
      }).then(data => {
        oMyDeferred.resolve(data.key, data.value);
      }).catch(error => {
        oMyDeferred.reject(error);
      });
      return oMyDeferred.promise();
    };
    return AppStateAdapter;
  }();
  _exports = AppStateAdapter;
  return _exports;
}, false);
//# sourceMappingURL=AppStateAdapter-dbg.js.map

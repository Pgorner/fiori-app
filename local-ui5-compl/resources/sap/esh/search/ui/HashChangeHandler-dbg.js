/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./eventlogging/UserEvents", "./SearchModel"], function (___eventlogging_UserEvents, __SearchModel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const UserEventType = ___eventlogging_UserEvents["UserEventType"];
  const SearchModel = _interopRequireDefault(__SearchModel); // track navigation
  // model class for track navigation
  // =======================================================================
  const HashChangeHandler = {
    handle: async function (hashChangeInfo) {
      this.sourceUrlArray = [];
      if (hashChangeInfo.oldShellHash !== null) {
        this.sourceUrlArray.push(hashChangeInfo.oldShellHash);
      }
      if (hashChangeInfo.oldAppSpecificRoute !== null) {
        if (hashChangeInfo.oldAppSpecificRoute.substring(0, 2) === "&/") {
          // remove first special parameter indicator "&/"
          this.sourceUrlArray.push(hashChangeInfo.oldAppSpecificRoute.substring(2));
        } else {
          this.sourceUrlArray.push(hashChangeInfo.oldAppSpecificRoute);
        }
      }
      this._createSearchModel().then(function () {
        const event = {
          type: UserEventType.HASH_CHANGE,
          sourceUrlArray: this.sourceUrlArray,
          targetUrl: "#" + hashChangeInfo.newShellHash,
          systemAndClient: this._getSID()
        };
        if (event.targetUrl.indexOf("=") !== -1) {
          this.searchModel.sinaNext.logUserEvent(event);
        }
      }.bind(this));
    },
    _createSearchModel: async function () {
      if (this.initializedPromise) {
        return this.initializedPromise;
      }
      // get search model and call init
      this.searchModel = SearchModel.getModelSingleton({}, "flp");
      this.initializedPromise = this.searchModel.initBusinessObjSearch();
      return this.initializedPromise;
    },
    _getSID: function () {
      // extract System and Client from sap-system=sid(BE1.001)
      const systemAndClient = {
        systemId: "",
        client: ""
      };
      const url = window.location.href;
      const systemBegin = url.indexOf("sap-system=sid(");
      if (systemBegin !== -1) {
        const systemEnd = url.substring(systemBegin).indexOf(")");
        if (systemEnd !== -1) {
          const systemInUrl = url.substring(systemBegin + 15, systemBegin + systemEnd);
          if (systemInUrl.split(".").length === 2) {
            systemAndClient.systemId = systemInUrl.split(".")[0];
            systemAndClient.client = systemInUrl.split(".")[1];
          }
        }
      }
      return systemAndClient;
    }
  };
  return HashChangeHandler;
});
})();
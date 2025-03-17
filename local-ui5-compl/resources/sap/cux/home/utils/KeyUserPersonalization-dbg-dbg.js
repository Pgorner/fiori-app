/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/ui/base/Object", "sap/ui/core/Lib", "sap/ui/core/routing/HashChanger", "sap/ui/fl/write/api/FeaturesAPI", "sap/ui/rta/api/startKeyUserAdaptation", "sap/ushell/Container", "sap/ushell/EventHub"], function (Log, BaseObject, Lib, HashChanger, FeaturesAPI, startKeyUserAdaptation, Container, EventHub) {
  "use strict";

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  class KeyUserPersonalization extends BaseObject {
    constructor(component, i18nBundle) {
      super();
      this.component = component;
      this.i18nBundle = i18nBundle;
      EventHub.on("keyUserAdaptationDataChange").do(() => {
        const adaptationCustomData = this.component?.byId("sectionWrapper")?.getAggregation("adaptationData");
        if (adaptationCustomData) {
          this.adaptationData = adaptationCustomData.getValue();

          // parse adaptation data if string
          if (typeof this.adaptationData === "string") {
            this.adaptationData = JSON.parse(this.adaptationData);
            adaptationCustomData.setValue(this.adaptationData);
          }
        }
      });
    }
    getRTAUserAction() {
      try {
        const _this = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(Lib.load({
            name: "sap.ui.fl"
          })).then(function () {
            return Promise.resolve(FeaturesAPI.isKeyUser()).then(function (isKeyUser) {
              let rtaUserActionProperties;
              if (isKeyUser) {
                rtaUserActionProperties = {
                  id: `${_this.component?.getId()}-s4MyHomeAdaptUIBtn`,
                  icon: "sap-icon://wrench",
                  text: _this.i18nBundle.getText("adaptUIBtn"),
                  tooltip: _this.i18nBundle.getText("adaptUIBtn"),
                  press: () => _this.triggerRTA()
                };
              }
              return Promise.resolve(rtaUserActionProperties);
            });
          });
        }, function (error) {
          Log.error(error instanceof Error ? error.message : error);
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    triggerRTA() {
      try {
        const _this2 = this;
        const _temp = _catch(function () {
          return Promise.resolve(Lib.load({
            name: "sap.ui.fl"
          })).then(function () {
            if (_this2.component) {
              startKeyUserAdaptation({
                rootControl: _this2.component
              }).catch(function () {
                try {
                  return Promise.resolve(Container.getServiceAsync("URLParsing")).then(function (URLParsingService) {
                    const hashChangerInstance = HashChanger.getInstance();
                    //Trigger Manual Reload of Application in case of failure
                    const shellHash = URLParsingService.parseShellHash(hashChangerInstance.getHash());
                    const hashParams = shellHash?.params || {};
                    const rtaKey = "sap-ui-fl-max-layer";
                    const value = "CUSTOMER";
                    if (!Object.prototype.hasOwnProperty.call(hashParams, rtaKey)) {
                      hashParams[rtaKey] = value;
                      hashChangerInstance.replaceHash(URLParsingService.constructShellHash(shellHash), "Unknown");
                    }
                    window.location.reload();
                  });
                } catch (e) {
                  return Promise.reject(e);
                }
              });
            }
          });
        }, function (error) {
          Log.error(error instanceof Error ? error.message : error);
        });
        return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
  return KeyUserPersonalization;
});
//# sourceMappingURL=KeyUserPersonalization-dbg-dbg.js.map

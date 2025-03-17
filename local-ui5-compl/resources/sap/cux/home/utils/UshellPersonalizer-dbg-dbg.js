/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/base/Object", "sap/ushell/Container"], function (BaseObject, Container) {
  "use strict";

  /**
   *
   * Provides the UshellPersonalizer Class used for fetch and update end user (Ushell) personalisation.
   *
   * @extends sap.ui.BaseObject
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @private
   * @experimental Since 1.121
   * @hidden
   *
   * @alias sap.cux.home.utils.UshellPersonalizer
   */
  const UShellPersonalizer = BaseObject.extend("sap.cux.home.utils.UshellPersonalizer", {
    constructor: function _constructor(persContainerId, oOwnerComponent) {
      BaseObject.prototype.constructor.call(this);
      this.persContainerId = persContainerId;
      this.oOwnerComponent = oOwnerComponent;
    },
    init: function _init() {
      try {
        const _this = this;
        return Promise.resolve(Container.getServiceAsync("Personalization")).then(function (oPersonalizationService) {
          const oScope = {
              keyCategory: oPersonalizationService?.constants?.keyCategory?.FIXED_KEY,
              writeFrequency: oPersonalizationService?.constants?.writeFrequency?.LOW,
              clientStorageAllowed: true
            },
            oPersId = {
              container: _this.persContainerId,
              item: "settings"
            };
          _this.oPersonalizer = oPersonalizationService?.getPersonalizer(oPersId, oScope, _this.oOwnerComponent);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    write: function _write(oData) {
      try {
        const _this2 = this;
        return Promise.resolve(_this2.oPersonalizer?.setPersData(oData)).then(function () {
          return "success";
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    read: function _read() {
      try {
        const _this3 = this;
        return Promise.resolve(_this3.oPersonalizer.getPersData());
      } catch (e) {
        return Promise.reject(e);
      }
    }
  });
  UShellPersonalizer.oCacheInstances = {};
  UShellPersonalizer.getInstance = function getInstance(persContainerId, oOwnerComponent) {
    try {
      if (UShellPersonalizer.oCacheInstances[persContainerId]) {
        return Promise.resolve(UShellPersonalizer.oCacheInstances[persContainerId]);
      }
      const UShellPersonalizerInstance = new UShellPersonalizer(persContainerId, oOwnerComponent);
      return Promise.resolve(UShellPersonalizerInstance.init()).then(function () {
        UShellPersonalizer.oCacheInstances[persContainerId] = UShellPersonalizerInstance;
        return UShellPersonalizer.oCacheInstances[persContainerId];
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  return UShellPersonalizer;
});
//# sourceMappingURL=UshellPersonalizer-dbg-dbg.js.map

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/base/Object", "sap/ui/core/Component"], function (BaseObject, Component) {
  "use strict";

  const defaultContainerId = "sap.cux";

  /**
   *
   * Provides the util methods used for UshellPersonalizer.
   *
   * @extends sap.ui.BaseObject
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.122.0
   *
   * @private
   * @experimental Since 1.122
   * @hidden
   *
   * @alias sap.cux.home.utils.PersonalisationUtils
   */
  const PersonalisationUtils = BaseObject.extend("sap.cux.home.utils.PersonalisationUtils", {
    getPersContainerId: function _getPersContainerId(oManagedObject) {
      return `${Component.getOwnerIdFor(oManagedObject)}--${defaultContainerId}`;
    },
    getOwnerComponent: function _getOwnerComponent(oManagedObject) {
      return Component.getOwnerComponentFor(oManagedObject);
    }
  });
  var __exports = new PersonalisationUtils();
  return __exports;
});
//# sourceMappingURL=PersonalisationUtils-dbg-dbg.js.map

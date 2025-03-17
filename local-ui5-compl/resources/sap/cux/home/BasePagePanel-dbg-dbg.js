/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["./BasePanel"], function (__BasePanel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BasePanel = _interopRequireDefault(__BasePanel);
  /**
   *
   * Base Panel class for managing and storing Pages.
   *
   * @extends sap.ui.core.BasePanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @abstract
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.BasePagePanel
   */
  const BasePagePanel = BasePanel.extend("sap.cux.home.BasePagePanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        title: {
          type: "string",
          group: "Misc"
        },
        key: {
          type: "string",
          group: "Misc"
        }
      },
      aggregations: {
        pages: {
          type: "sap.cux.home.Page",
          singularName: "page",
          multiple: true
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BasePanel.prototype.constructor.call(this, id, settings);
    }
  });
  return BasePagePanel;
});
//# sourceMappingURL=BasePagePanel-dbg-dbg.js.map

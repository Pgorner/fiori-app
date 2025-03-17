/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["./BaseApp"], function (__BaseApp) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseApp = _interopRequireDefault(__BaseApp);
  /**
   *
   * Class for managing apps group.
   *
   * @extends sap.cux.home.BaseApp
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @private
   * @experimental Since 1.121
   *
   * @alias sap.cux.home.Group
   */
  const Group = BaseApp.extend("sap.cux.home.Group", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Number of apps, shown as folder badge
         */
        number: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Id of the group
         */
        groupId: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        }
      },
      aggregations: {
        /**
         * Apps aggregation for Groups
         */
        apps: {
          type: "sap.cux.home.App",
          multiple: true,
          singularName: "app"
        }
      },
      events: {
        press: {
          parameters: {
            groupId: {
              type: "string"
            }
          }
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BaseApp.prototype.constructor.call(this, id, settings);
    },
    /**
     * Handles the press event for a group.
     * Retrieves the parent of the group and shows the group detail dialog.
     * @private
     */
    _handlePress: function _handlePress() {
      this.firePress({
        groupId: this.getGroupId()
      });
    }
  });
  return Group;
});
//# sourceMappingURL=Group-dbg-dbg.js.map

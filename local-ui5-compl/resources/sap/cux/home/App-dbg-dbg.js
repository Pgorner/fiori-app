/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ushell/Container", "./BaseApp"], function (Container, __BaseApp) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseApp = _interopRequireDefault(__BaseApp);
  /**
   *
   * App class for managing and storing Apps.
   *
   * @extends sap.cux.home.BaseApp
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.App
   */
  const App = BaseApp.extend("sap.cux.home.App", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Url of the app where the user navigates to on click
         */
        url: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * VizId of the app. Used for enabling addition of apps to FavoriteApp panel
         */
        vizId: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BaseApp.prototype.constructor.call(this, id, settings);
    },
    /**
     * Navigates to the clicked app
     * @private
     */
    _launchApp: function _launchApp() {
      try {
        const _this = this;
        return Promise.resolve(Container.getServiceAsync("SpaceContent")).then(function (spaceContentService) {
          return Promise.resolve(spaceContentService.launchTileTarget(_this.getUrl(), _this.getTitle())).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * App Press Handler
     * @private
     */
    _handlePress: function _handlePress() {
      if (this.getUrl()) {
        void this._launchApp();
      }
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg-dbg.js.map

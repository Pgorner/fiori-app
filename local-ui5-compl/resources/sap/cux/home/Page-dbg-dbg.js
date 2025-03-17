/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/core/Element", "sap/ushell/Container"], function (Element, Container) {
  "use strict";

  /**
   *
   * Class for managing and storing Pages.
   *
   * @extends sap.ui.core.Element
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.Page
   */
  const Page = Element.extend("sap.cux.home.Page", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Title for the  page
         * @since 1.120
         */
        title: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Icon for the  page
         * @since 1.120
         */
        icon: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Subtitle for the  page
         * @since 1.120
         */
        subTitle: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Background color for the  page
         * @since 1.120
         */
        bgColor: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Id for the corresponding page
         * @since 1.120
         * @experimental Since 1.120
         */
        pageId: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Space id for the corresponding page
         * @since 1.120
         * @experimental Since 1.120
         */
        spaceId: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Space title for the corresponding page
         * @since 1.120
         * @experimental Since 1.120
         */
        spaceTitle: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Url to be launched for the corresponding page
         * @since 1.120
         * @experimental Since 1.120
         */
        url: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        }
      },
      events: {
        /**
         * Press event for the page
         */
        press: {}
      }
    },
    constructor: function _constructor(id, settings) {
      Element.prototype.constructor.call(this, id, settings);
    },
    onPageTilePress: function _onPageTilePress(oPage) {
      try {
        const sPageId = oPage.getProperty?.("pageId"),
          sSpaceId = oPage.getProperty?.("spaceId");
        return Promise.resolve(Container.getServiceAsync("Navigation")).then(function (navigationService) {
          return Promise.resolve(navigationService.navigate({
            target: {
              semanticObject: "Launchpad",
              action: "openFLPPage"
            },
            params: {
              pageId: sPageId,
              spaceId: sSpaceId
            }
          })).then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  });
  return Page;
});
//# sourceMappingURL=Page-dbg-dbg.js.map

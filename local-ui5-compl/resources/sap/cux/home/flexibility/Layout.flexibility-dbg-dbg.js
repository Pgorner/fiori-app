/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/fl/changeHandler/MoveControls", "../changeHandler/NewsFeedVisibilityChange", "../changeHandler/SetNewsFeedUrl", "../changeHandler/SpacePageColorHandler", "../changeHandler/SpacePageIconHandler"], function (MoveControls, __newsFeedVisibilityChange, __setNewsFeedUrl, __spacePageColorHandler, __SpacePageIconHandler) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const newsFeedVisibilityChange = _interopRequireDefault(__newsFeedVisibilityChange);
  const setNewsFeedUrl = _interopRequireDefault(__setNewsFeedUrl);
  const spacePageColorHandler = _interopRequireDefault(__spacePageColorHandler);
  const SpacePageIconHandler = _interopRequireDefault(__SpacePageIconHandler);
  var CHANGE_TYPES = /*#__PURE__*/function (CHANGE_TYPES) {
    CHANGE_TYPES["HIDE"] = "hideControl";
    CHANGE_TYPES["UNHIDE"] = "unhideControl";
    CHANGE_TYPES["MOVE"] = "moveControls";
    CHANGE_TYPES["PAGE_COLOR"] = "applyPageColor";
    CHANGE_TYPES["SPACE_COLOR"] = "applySpaceColor";
    CHANGE_TYPES["PAGE_ICON"] = "applyPageIcon";
    CHANGE_TYPES["SPACE_ICON"] = "applySpaceIcon";
    CHANGE_TYPES["NEWS_FEED_URL"] = "changeNewsFeedURL";
    CHANGE_TYPES["NEWS_FEED_VISIBILITY"] = "setNewsFeedVisibility";
    return CHANGE_TYPES;
  }(CHANGE_TYPES || {});
  var __exports = {
    [CHANGE_TYPES.MOVE]: {
      layers: {
        USER: true
      },
      changeHandler: MoveControls
    },
    [CHANGE_TYPES.HIDE]: "default",
    [CHANGE_TYPES.UNHIDE]: "default",
    [CHANGE_TYPES.SPACE_COLOR]: {
      layers: {
        CUSTOMER: true
      },
      changeHandler: spacePageColorHandler
    },
    [CHANGE_TYPES.PAGE_COLOR]: {
      layers: {
        CUSTOMER: true
      },
      changeHandler: spacePageColorHandler
    },
    [CHANGE_TYPES.SPACE_ICON]: {
      layers: {
        CUSTOMER: true
      },
      changeHandler: SpacePageIconHandler
    },
    [CHANGE_TYPES.PAGE_ICON]: {
      layers: {
        CUSTOMER: true
      },
      changeHandler: SpacePageIconHandler
    },
    [CHANGE_TYPES.NEWS_FEED_URL]: {
      layers: {
        CUSTOMER: true
      },
      changeHandler: setNewsFeedUrl
    },
    [CHANGE_TYPES.NEWS_FEED_VISIBILITY]: {
      layers: {
        CUSTOMER: true
      },
      changeHandler: newsFeedVisibilityChange
    }
  };
  __exports.CHANGE_TYPES = CHANGE_TYPES;
  return __exports;
});
//# sourceMappingURL=Layout.flexibility-dbg-dbg.js.map

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/core/Lib", "sap/ui/core/library", "sap/ui/integration/library"], function (Lib, sap_ui_core_library, sap_ui_integration_library) {
  "use strict";

  /**
   * Root namespace for all the libraries related to Common User Experience.
   *
   * @namespace
   * @public
   * @since 1.121
   */
  const cuxNamespace = "sap.cux";

  /**
   * This is an SAPUI5 library with controls specialized for common user experience.
   *
   * @namespace
   * @public
   * @since 1.121
   */
  const cuxHomeNamespace = "sap.cux.home";
  const thisLib = Lib.init({
    apiVersion: 2,
    name: "sap.cux.home",
    version: "0.0.1",
    dependencies: ["sap.ui.core", "sap.m", "sap.ui.integration"],
    types: ["sap.cux.home.LayoutType", "sap.cux.home.NewsType"],
    interfaces: [],
    controls: ["sap.cux.home.Layout", "sap.cux.home.ToDosContainer", "sap.cux.home.NewsAndPagesContainer", "sap.cux.home.AppsContainer", "sap.cux.home.InsightsContainer"],
    elements: ["sap.cux.home.MenuItem", "sap.cux.home.TaskPanel", "sap.cux.home.SituationPanel", "sap.cux.home.PagePanel", "sap.cux.home.NewsPanel", "sap.cux.home.FavAppPanel", "sap.cux.home.FrequentAppPanel", "sap.cux.home.RecentAppPanel", "sap.cux.home.RecommendedAppPanel", "sap.cux.home.TilesPanel", "sap.cux.home.CardsPanel"],
    noLibraryCSS: false,
    extensions: {
      flChangeHandlers: {
        "sap.cux.home.Layout": "sap/cux/home/flexibility/Layout",
        "sap.cux.home.ToDosContainer": "sap/cux/home/flexibility/BaseContainer",
        "sap.cux.home.NewsAndPagesContainer": "sap/cux/home/flexibility/BaseContainer",
        "sap.cux.home.InsightsContainer": "sap/cux/home/flexibility/BaseContainer",
        "sap.cux.home.AppsContainer": "sap/cux/home/flexibility/BaseContainer"
      }
    }
  });

  /**
   * Supported layout types for {@link sap.cux.home.BaseContainer}.
   *
   * @enum {string}
   * @public
   * @since 1.121
   * @experimental Since 1.121
   */
  var LayoutType = /*#__PURE__*/function (LayoutType) {
    LayoutType["SideBySide"] = "SideBySide";
    LayoutType["Vertical"] = "Vertical";
    LayoutType["Horizontal"] = "Horizontal";
    return LayoutType;
  }(LayoutType || {});
  thisLib.LayoutType = LayoutType;

  /**
   * Supported News Types for {@link sap.cux.home.NewsPanel}.
   *
   * @enum {string}
   * @public
   * @since 1.121
   * @experimental Since 1.121
   */
  var NewsType = /*#__PURE__*/function (NewsType) {
    NewsType["RSS"] = "rss";
    NewsType["Feed"] = "feed";
    NewsType["Custom"] = "customFeed";
    return NewsType;
  }(NewsType || {});
  thisLib.NewsType = NewsType;
  thisLib.cuxNamespace = cuxNamespace;
  thisLib.cuxHomeNamespace = cuxHomeNamespace;
  return thisLib;
});
//# sourceMappingURL=library-dbg-dbg.js.map

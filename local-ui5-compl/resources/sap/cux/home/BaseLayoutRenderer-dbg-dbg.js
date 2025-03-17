/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/PageRenderer"], function (PageRenderer) {
  "use strict";

  var __exports = {
    apiVersion: 2,
    /**
     * Renders the control.
     *
     * @public
     * @override
     * @param {RenderManager} rm - The RenderManager object.
     * @param {BaseLayout} control - The BaseLayout control to be rendered.
     */
    render: function (rm, control) {
      /*
       * Existing controls like NavContainer will not allow for control
       * over the duration of the transition. To overcome this limitation,
       * we render a simple div container and manage the transition from
       * one page to another using CSS.
       */
      const containerId = `${control.getId()}-layout-container`;
      const isContainerRenderedOnce = document.getElementById(containerId);
      if (!isContainerRenderedOnce) {
        rm.openStart("div", containerId).openEnd();
      }

      //render main container
      PageRenderer.render(rm, control);

      //render full-screen container
      rm.renderControl(control.getAggregation("fullScreenContainer"));
      if (!isContainerRenderedOnce) {
        rm.close("div");
      }
    }
  };
  return __exports;
});
//# sourceMappingURL=BaseLayoutRenderer-dbg-dbg.js.map

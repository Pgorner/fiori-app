/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/m/PageRenderer"],function(e){"use strict";var n={apiVersion:2,render:function(n,t){const r=`${t.getId()}-layout-container`;const i=document.getElementById(r);if(!i){n.openStart("div",r).openEnd()}e.render(n,t);n.renderControl(t.getAggregation("fullScreenContainer"));if(!i){n.close("div")}}};return n});
//# sourceMappingURL=BaseLayoutRenderer.js.map
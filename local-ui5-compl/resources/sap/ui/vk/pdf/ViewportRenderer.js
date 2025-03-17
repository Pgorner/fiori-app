/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Element"],e=>{"use strict";function t(e){return e.isA("sap.ui.vk.tools.RedlineTool")}function i(e){return e.isA("sap.ui.vk.tools.TransformSvgElementTool")}function n(t,i,n){i.getTools().map(t=>e.getElementById(t)).filter(e=>n(e)).map(e=>e.getGizmoForContainer(i)).filter(e=>e?.hasDomElement()).forEach(e=>t.renderControl(e))}return{apiVersion:2,render(e,o){{e.openStart("div",o);e.class("sapVizKitViewport");e.class("sapVizKitPDFViewport");e.attr("tabindex",0);e.attr("aria-label","Image");e.attr("role","figure");e.style("width",o.getWidth());e.style("height",o.getHeight());e.openEnd();o.renderContent(e);n(e,o,e=>!(t(e)||i(e)));{e.openStart("div",o.getId()+"-scrollContainer");e.class("sapVizKitPDFScrollContainer");e.openEnd();{e.openStart("div",o.getId()+"-document");e.class("sapVizKitPDFDocument");e.openEnd();{e.openStart("div",o.getId()+"-page");e.class("sapVizKitPDFPage");e.style("--sapUiVizKitRedlineScale",o._scale);e.openEnd();n(e,o,e=>t(e)||i(e));e.close("div")}e.close("div")}e.close("div")}e.close("div")}}}});
//# sourceMappingURL=ViewportRenderer.js.map
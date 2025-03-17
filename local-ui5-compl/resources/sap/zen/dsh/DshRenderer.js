/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global"],function(jQuery){jQuery.sap.declare("sap.zen.dsh.DshRenderer");var e=sap.zen.dsh.DshRenderer={apiVersion:2};e.render=function(e,s){e.openStart("div",s);e.style("width",s.getWidth());e.style("height",s.getHeight());e.class("sapZenDshDsh");e.class("sapUiBody");e.openEnd();e.openStart("div",s.getId()+"sapbi_snippet_ROOT");e.class("sapbi_snippet_ROOT");e.class("sapUiBody");e.style("width","100%");e.style("height","100%");e.openEnd();e.close("div");e.close("div")};return e});
//# sourceMappingURL=DshRenderer.js.map
/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var t={};t.render=function(t,e){t.write('<div id ="sap-ui-dummy-'+e.getId()+'" style ="display:none">');t.write("<div");t.writeControlData(e);t.writeAttribute("data-sap-ui-preserve",e.getId());t.addClass("sapMakitChart");t.writeClasses();t.write(">");t.write("</div>");t.write("</div>")};return t},true);
//# sourceMappingURL=ChartRenderer.js.map
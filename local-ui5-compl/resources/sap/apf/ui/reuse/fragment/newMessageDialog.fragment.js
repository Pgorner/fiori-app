/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(["sap/m/Button","sap/m/Dialog","sap/m/library","sap/m/Text"],function(t,e,o,n){"use strict";var a=o.DialogType;return{createContent:function(o){var r=new t(o.createId("idYesButton"),{text:o.oCoreApi.getTextNotHtmlEncoded("yes")});var d=new t(o.createId("idNoButton"),{text:o.oCoreApi.getTextNotHtmlEncoded("no")});var i=new e(o.createId("idNewDialog"),{type:a.Standard,title:o.oCoreApi.getTextNotHtmlEncoded("newPath"),content:new n({text:o.oCoreApi.getTextNotHtmlEncoded("analysis-path-not-saved")}).addStyleClass("textStyle"),buttons:[r,d],afterClose:function(){i.destroy()}});return i}}});
//# sourceMappingURL=newMessageDialog.fragment.js.map
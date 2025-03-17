/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../i18n","sap/m/Text","sap/m/Toolbar","sap/m/library"],function(t,e,i,n){"use strict";function s(t){return t&&t.__esModule&&typeof t.default!=="undefined"?t.default:t}const r=s(t);const o=n["ToolbarDesign"];const a=i.extend("sap.esh.search.ui.controls.SearchSelectionBar",{renderer:{apiVersion:2},constructor:function t(n){i.prototype.constructor.call(this,n);this.setProperty("design",o.Info);this.addStyleClass("sapElisaSearchSelectionBar");this.selectionText=new e(this.getId()+"-selectionText",{text:{parts:[{path:"/multiSelectionObjects"},{path:"/count"}],formatter:this.textFormatter.bind(this)}}).addStyleClass("sapElisaSearchSelectionText");this.bindProperty("visible",{parts:[{path:"/multiSelectionObjects"},{path:"/config"}],formatter:this.visibleFormatter.bind(this)});this.addContent(this.selectionText)},textFormatter:function t(e,i){const n=e.filter(t=>t.selected).length;return r.getText("selectionText",[n,i])},visibleFormatter:function t(e,i){return e.length>=i.enableSearchSelectionBarStartingWith}});return a})})();
//# sourceMappingURL=SearchSelectionBar.js.map
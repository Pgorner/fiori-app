//@ui5-bundle sap/cux/home/designtime/library-preload.designtime.js
sap.ui.require.preload({
	"sap/cux/home/designtime/Layout.designtime.js":function(){
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ui/core/Lib","../changeHandler/LayoutHandler"],function(e,n){"use strict";function t(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const i=t(n);const a={actions:{remove:null,settings:{icon:"sap-icon://edit",name:e.getResourceBundleFor("sap.cux.home.i18n").getText("editCurrentPage"),isEnabled:true,handler:(e,n)=>i.loadPersonalizationDialog(e,n).then(e=>e)}}};return a});
}
});
//# sourceMappingURL=library-preload-dbg.designtime.js.map

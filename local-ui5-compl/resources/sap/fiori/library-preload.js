//@ui5-bundle sap/fiori/library-preload.js
/*!
 * SAPUI5
 *
 * (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.predefine("sap/fiori/library", ["sap/base/i18n/Localization","sap/base/i18n/ResourceBundle","sap/ui/core/Lib","sap/ui/core/library"],function(e,i,a){"use strict";const s=a.init({name:"sap.fiori",apiVersion:2,dependencies:["sap.ui.core"],version:"1.132.1"});(()=>{let a=e.getLanguage();const s=e.getLanguagesDeliveredWithCore();const n=i._getFallbackLocales(a,s);a=n[0];if(a&&!window["sap-ui-debug"]&&!sap.ui.loader.config().async){sap.ui.requireSync("sap/fiori/messagebundle-preload_"+a)}})();return s});
sap.ui.require.preload({
	"sap/fiori/appruntimescube-min-1-dbg.js":function(){
/*!
 * SAPUI5
 *
 * (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
// intentionally empty
},
	"sap/fiori/appruntimescube-min-2-dbg.js":function(){
/*!
 * SAPUI5
 *
 * (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
// intentionally empty
},
	"sap/fiori/appruntimescube-min-3-dbg.js":function(){
/*!
 * SAPUI5
 *
 * (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
// intentionally empty
},
	"sap/fiori/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.fiori","type":"library","embeds":[],"applicationVersion":{"version":"1.132.1"},"title":"A hybrid UILibrary merged from the most common UILibraries that are used in Fiori apps","description":"A hybrid UILibrary merged from the most common UILibraries that are used in Fiori apps","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_base","sap_belize_hcb","sap_belize_hcw","sap_belize_plus","sap_bluecrystal","sap_bluecrystal_base","sap_fiori_3","sap_fiori_3_dark","sap_fiori_3_hcb","sap_fiori_3_hcw","sap_hcb","sap_horizon","sap_horizon_dark","sap_horizon_hcb","sap_horizon_hcw"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.132","libs":{"sap.ui.core":{"minVersion":"1.132.1"}}},"library":{"i18n":false,"content":{"controls":[],"elements":[],"types":[],"interfaces":[]}}}}'
});
//# sourceMappingURL=library-preload.js.map

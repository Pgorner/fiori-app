/*!
 * SAPUI5
 *
 * (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/i18n/Localization","sap/base/i18n/ResourceBundle","sap/ui/core/Lib","sap/ui/core/library"],function(e,i,a){"use strict";const s=a.init({name:"sap.fiori",apiVersion:2,dependencies:["sap.ui.core"],version:"1.132.1"});(()=>{let a=e.getLanguage();const s=e.getLanguagesDeliveredWithCore();const n=i._getFallbackLocales(a,s);a=n[0];if(a&&!window["sap-ui-debug"]&&!sap.ui.loader.config().async){sap.ui.requireSync("sap/fiori/messagebundle-preload_"+a)}})();return s});
//# sourceMappingURL=library.js.map
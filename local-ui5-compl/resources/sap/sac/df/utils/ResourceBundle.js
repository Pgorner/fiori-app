/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/utils/ResourceBundle",["sap/sac/df/utils/ResourceModel"],function(e){"use strict";const t=e.getResourceBundle();t.getTextWithPlaceholder=(e,s)=>t.getText(e,[s]);t.getTextWithPlaceholder2=(e,s,l)=>t.getText(e,[s,l]);t.getTextWithPlaceholders=(e,s)=>{const l=[];if(s!=null){for(let e=0;e<s.size();e++){l.push(s.get(e))}}return t.getText(e,l)};return t});
//# sourceMappingURL=ResourceBundle.js.map
/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/registry/Settings","sap/ui/rta/util/whatsNew/whatsNewContent/WhatsNewFeatures"],function(t,e){"use strict";function n(t,e){return t.filter(t=>!e?.includes(t.featureId))}async function r(t,e){const n=await Promise.all(t.map(t=>{if(typeof t.isFeatureApplicable==="function"){return t.isFeatureApplicable(e)}return true}));const r=t.filter((t,e)=>n[e]);return r}const s={getLearnMoreURL(e,n){const r=e.slice(-1);const s=t.getInstanceOrUndef();if(s?.isAtoEnabled()&&s?.getSystem()){return n[r].documentationUrls.s4HanaCloudUrl}if(!s?.isAtoEnabled()&&s?.getSystem()){return n[r].documentationUrls.s4HanaOnPremUrl}return n[r].documentationUrls.btpUrl},getFilteredFeatures(t,s){const a=e.getAllFeatures();const i=n(a,t);return r(i,s)}};return s});
//# sourceMappingURL=WhatsNewUtils.js.map
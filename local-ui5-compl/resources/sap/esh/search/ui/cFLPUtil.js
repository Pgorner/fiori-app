/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./sinaNexTS/providers/multi/FederationType","./sinaNexTS/sina/SinaConfiguration"],function(e,t){"use strict";const n=e["FederationType"];const r=t["AvailableProviders"];async function o(e){if(!sap||!sap.cf){return Promise.resolve(e)}const t=await window.sap.ushell.Container.getServiceAsync("CommonDataModel");const o=await t.getApplications();const a=Object.keys(o).reduce(function(e,t){const n=o[t];const r=n["sap.app"]&&n["sap.app"].contentProviderId;if(r){e[r]=true}return e},{});const s=Object.keys(a);const c=[];for(let e=0;e<s.length;++e){const t=s[e];c.push(i(t))}let u=await Promise.all(c);if(!u||u.length===0){return e}else{u=u.filter(function(e){if(typeof e!=="undefined"){return e}});return[{provider:r.MULTI,subProviders:u,federationType:n.advanced_round_robin,url:""},r.DUMMY]}}async function i(e){const t=await window.sap.ushell.Container.getServiceAsync("ClientSideTargetResolution");const n=await t.getSystemContext(e);const r=n.getFullyQualifiedXhrUrl("sap/opu/odata/sap/ESH_SEARCH_SRV");const o=n.getProperty("esearch.provider");if(!o){return}return{contentProviderId:e,provider:o.toLowerCase(),label:e,url:r}}var a={__esModule:true};a.readCFlpConfiguration=o;return a})})();
//# sourceMappingURL=cFLPUtil.js.map
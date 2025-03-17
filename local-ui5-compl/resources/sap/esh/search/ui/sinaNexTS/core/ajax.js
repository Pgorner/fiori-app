/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./requestNodePlain","./requestBrowser","./core","./Log"],function(a,t,e,s){"use strict";const n=a["requestNodePlain"];const r=t["requestBrowser"];const o=e["isBrowserEnv"];const d=s["Log"];async function c(a){let t;if(o()){t=await r(a)}else{t=await n(a)}try{delete t.dataJSON;t.dataJSON=JSON.parse(t.data)}catch(a){const e=new d("ajax");e.warn("Could not parse response data as JSON: "+t?.data+" ("+a+")")}return t}function u(a,t,e){const s=t.data;for(const s of e){t=s(a,t)}if(t.data!==s){try{delete t.dataJSON;t.dataJSON=JSON.parse(t.data)}catch(a){const e=new d("ajax");e.warn("Could not parse response data as JSON: "+t?.data+" ("+a+")")}}return t}var i={__esModule:true};i.request=c;i.applyResponseFormattersAndUpdateJSON=u;return i})})();
//# sourceMappingURL=ajax.js.map
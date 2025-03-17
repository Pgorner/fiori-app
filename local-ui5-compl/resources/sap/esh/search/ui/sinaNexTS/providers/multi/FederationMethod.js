/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";class t{sort(t){let e=[];for(let n=0;n<t.length;n++){e=e.concat(t[n])}e.sort(function(t,e){const n=e.score-t.score;return n});return e}}class e{sort(t){let e=[];for(let n=0;n<t.length;n++){e=this.mergeMultiResults(e,t[n],n+1)}return e}mergeMultiResults(t,e,n){if(n<1){return[]}if(n===1){return e}const r=t.length;const o=e.length;let s=[];for(let e=0;e<r;e++){s.push(t[e])}for(let t=0;t<r;t++){if(t>=o){break}s.splice(n*(t+1)-1,0,e[t])}if(o>r){s=s.concat(e.slice(r-o))}return s}}class n{sort(t){let e=[];for(let n=0;n<t.length;n++){e=e.concat(t[n])}let n;const r={};for(let t=0;t<e.length;t++){n=e[t].dataSource.id;if(!r[n]){r[n]=[]}r[n].push(e[t])}const o=[];let s=0;for(const t in r){const e=r[t][0];n=e.dataSource.id;const c=e.score;o.push({dataSourceId:n,score:c,index:s});s++}o.sort(function(t,e){let n=e.score-t.score;if(n===0){n=t.index-e.index}return n});const c=[];let l=0;for(let t=0;t<e.length;){const e=o[l];const n=r[e.dataSourceId];if(n.length>0){c.push(n.shift());t++}l=(l+1)%o.length}return c}}var r={__esModule:true};r.Ranking=t;r.RoundRobin=e;r.AdvancedRoundRobin=n;return r})})();
//# sourceMappingURL=FederationMethod.js.map
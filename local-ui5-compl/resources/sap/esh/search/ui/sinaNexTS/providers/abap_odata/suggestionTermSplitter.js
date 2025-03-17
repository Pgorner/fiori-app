/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SuggestionType"],function(e){"use strict";const t=e["SuggestionType"];function n(e){return typeof e==="object"&&e!==null&&"type"in e&&(e.type===t.SearchTerm||e.type===t.SearchTermAndDataSource)}class r{split(e){const t=e.lastIndexOf(" ");if(t<0){return{searchTerm:null,suggestionTerm:e}}let n=e.slice(0,t);n=n.replace(/\s+$/,"");if(n.length===0){return{searchTerm:null,suggestionTerm:e}}let r=e.slice(t);r=r.replace(/^\s+/,"");if(r.length===0){return{searchTerm:null,suggestionTerm:e}}return{searchTerm:n,suggestionTerm:r}}concatenate(e,t){if(!e.searchTerm){return}let r;const s=[];const c=e.searchTerm.split(" ");for(let e=0;e<c.length;e++){r=c[e];r=r.trim();s.push({term:r,regExp:new RegExp(this.escapeRegExp(r),"i")})}for(let c=0;c<t.length;++c){const i=t[c];if(!n(i)){continue}const l=[];for(let e=0;e<s.length;++e){const t=s[e];if(!t.regExp.test(i.filter.searchTerm)){l.push(t.term)}}const o=[];const u=l.join(" ");for(let e=0;e<l.length;e++){r=l[e];o.push("<b>"+r+"</b>")}const a=o.join(" ");i.label=a+" "+i.label;i.filter.searchTerm=i.searchTerm=u+" "+i.filter.searchTerm;if(i.childSuggestions&&i.childSuggestions.length>0){this.concatenate(e,i.childSuggestions)}}}escapeRegExp(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}}function s(e){const t=new r;return t.split(e)}function c(e,t){const n=new r;return n.concatenate(e,t)}var i={__esModule:true};i.split=s;i.concatenate=c;return i})})();
//# sourceMappingURL=suggestionTermSplitter.js.map
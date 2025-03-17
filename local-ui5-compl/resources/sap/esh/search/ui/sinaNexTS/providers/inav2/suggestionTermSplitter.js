/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SuggestionType"],function(e){"use strict";const t=e["SuggestionType"];class r{provider;sina;constructor(e){this.provider=e;this.sina=e.sina}split(e){const t=e.lastIndexOf(" ");if(t<0){return{searchTerm:null,suggestionTerm:e}}let r=e.slice(0,t);r=r.replace(/\s+$/,"");if(r.length===0){return{searchTerm:null,suggestionTerm:e}}let n=e.slice(t);n=n.replace(/^\s+/,"");if(n.length===0){return{searchTerm:null,suggestionTerm:e}}return{searchTerm:r,suggestionTerm:n}}concatenate(e,r){if(!e.searchTerm){return}let n;const s=[];const c=e.searchTerm.split(" ");for(let e=0;e<c.length;e++){n=c[e];n=n.trim();s.push({term:n,regExp:new RegExp(this.escapeRegExp(n),"i")})}for(let c=0;c<r.length;++c){const i=r[c];if(i.suggestionType!==t.SearchTerm&&i.suggestionType!==t.SearchTermAndDataSource){continue}const o=[];for(let e=0;e<s.length;++e){const t=s[e];if(!t.regExp.test(i.filter.searchTerm)){o.push(t.term)}}const l=[];const a=o.join(" ");for(let e=0;e<o.length;e++){n=o[e];l.push("<b>"+n+"</b>")}const u=l.join(" ");i.label=u+" "+i.label;i.filter.searchTerm=i.searchTerm=a+" "+i.filter.searchTerm;this.concatenate(e,i.childSuggestions)}}escapeRegExp(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}}function n(e,t){const n=new r(e);return n.split(t)}function s(e,t,n){const s=new r(e);return s.concatenate(t,n)}var c={__esModule:true};c.split=n;c.concatenate=s;return c})})();
//# sourceMappingURL=suggestionTermSplitter.js.map
/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/SearchResultSetItemAttributeGroup"],function(t){"use strict";const e=t["SearchResultSetItemAttributeGroup"];class i{sina;constructor(t){this.sina=t}processRegularWhyFoundAttributes(t,e,i,r){let s;for(const e in i){if(e===t&&i[e][0]){s=i[e][0];if(r.usage.Title||r.usage.TitleDescription||r.usage.Detail){delete i[e]}}}s=this.calculateValueHighlighted(e,r,s);return s}async processAdditionalWhyfoundAttributes(t,i){for(const r in t){if(t[r]&&t[r][0]){const s=i.dataSource.getAttributeMetadata(r);const a=s.id||r;const u=t[r][0];let n="";if(i.attributesMap[r]){n=i.attributesMap[r].valueFormatted;n=typeof n==="string"?n:JSON.stringify(n)}const l=typeof u==="string"?u:JSON.stringify(u);const f=this.sina._createSearchResultSetItemAttribute({id:a,label:s.label||r,value:"",valueFormatted:n,valueHighlighted:l,isHighlighted:true,metadata:s});const h=i.attributes.find(t=>t.id===a);if(i.detailAttributes.find(t=>t instanceof e&&t.isAttributeDisplayed(a))===undefined){if(h===undefined){i.detailAttributes.push(f);i.attributes.push(f);i.attributesMap[a]=f}else if(h.isHighlighted===true){i.detailAttributes.push(h)}else{h.valueHighlighted=f.valueHighlighted;h.isHighlighted=true;i.detailAttributes.push(h)}}delete t[r]}}return i}_getFirstItemIfArray(t){if(Array.isArray(t)){t=t[0]}return t}calculateValueHighlighted(t,e,i){const r="com.sap.vocabularies.Search.v1.Highlighted";const s="com.sap.vocabularies.Search.v1.Snippets";let a="";if(e.format==="MultilineText"){a=t[r];if(a){return this._getFirstItemIfArray(a)}a=t[s];if(a){return this._getFirstItemIfArray(a)}return i}a=t[s];if(a){return this._getFirstItemIfArray(a)}a=t[r];if(a){return this._getFirstItemIfArray(a)}return this._getFirstItemIfArray(i)}calIsHighlighted(t){if(typeof t==="string"&&t.length>0&&t.indexOf("<b>")>-1&&t.indexOf("</b>")>-1){return true}if(Array.isArray(t)&&t.length>0){return true}return false}}var r={__esModule:true};r.WhyfoundProcessor=i;return r})})();
//# sourceMappingURL=WhyfoundProcessor.js.map
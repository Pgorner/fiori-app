/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SearchResultSetItemAttributeBase"],function(t){"use strict";const e=t["SearchResultSetItemAttributeBase"];class s extends e{template;attributes=[];displayAttributes=[];constructor(t){super(t);this.template=t.template??this.template;this.attributes=t.attributes??this.attributes;this.displayAttributes=t.displayAttributes??this.displayAttributes}toString(){let t="",e=0;let s;const i=RegExp("{[a-z]+}","gi");while((s=i.exec(this.template))!==null){t+=this.template.substring(e,s.index);const r=s[0].slice(1,-1);t+=this.attributes[r]&&this.attributes[r].valueFormatted||"";e=i.lastIndex}t+=this.template.substring(e);return this.label+":"+t}isAttributeDisplayed(t){if(Array.isArray(this.displayAttributes)){return this.displayAttributes.includes(t)}return false}getSubAttributes(){const t=[];for(const e of this.attributes){t.push(...e.attribute.getSubAttributes())}return t}}var i={__esModule:true};i.SearchResultSetItemAttributeGroup=s;return i})})();
//# sourceMappingURL=SearchResultSetItemAttributeGroup.js.map
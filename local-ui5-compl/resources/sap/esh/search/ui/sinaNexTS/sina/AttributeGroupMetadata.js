/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./AttributeType","./AttributeMetadataBase"],function(t,e){"use strict";const s=t["AttributeType"];const i=e["AttributeMetadataBase"];class a extends i{type=(()=>s.Group)();label;isSortable=false;template;attributes=[];displayAttributes=[];constructor(t){super(t);this.id=t.id??this.id;this.usage=t.usage??this.usage;this.label=t.label??this.label;this.isSortable=t.isSortable??this.isSortable;this.template=t.template??this.template;this.attributes=t.attributes??this.attributes;this.displayAttributes=t.displayAttributes??this.displayAttributes}}var r={__esModule:true};r.AttributeGroupMetadata=a;return r})})();
//# sourceMappingURL=AttributeGroupMetadata.js.map
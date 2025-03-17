/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./AttributeMetadataBase"],function(t){"use strict";const e=t["AttributeMetadataBase"];class i extends e{label;isSortable;isKey;matchingStrategy;isHierarchy;hierarchyName;hierarchyDisplayType;iconUrlAttributeName;_private={semanticObjectType:"",temporaryUsage:{}};constructor(t){super(t);this.label=t.label??this.label;this.isSortable=t.isSortable??this.isSortable;this.format=t.format??this.format;this.isKey=t.isKey??this.isKey;this.semantics=t.semantics??this.semantics;this.matchingStrategy=t.matchingStrategy??this.matchingStrategy;this.isHierarchy=t.isHierarchy??false;this.hierarchyName=t.hierarchyName;this.hierarchyDisplayType=t.hierarchyDisplayType;this.iconUrlAttributeName=t.iconUrlAttributeName}}var a={__esModule:true};a.AttributeMetadata=i;return a})})();
//# sourceMappingURL=AttributeMetadata.js.map
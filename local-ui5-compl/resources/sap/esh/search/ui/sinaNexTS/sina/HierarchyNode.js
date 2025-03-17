/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./SinaObject"],function(i){"use strict";const s=i["SinaObject"];class t extends s{id;label;count;hasChildren;icon;isFirst;isLast;parentNode;childNodes;childNodeMap;constructor(i){super(i);this.id=i.id;this.label=i.label;this.count=i.count;this.hasChildren=i.hasChildren;this.icon=i.icon;this.isFirst=i.isFirst;this.isLast=i.isLast;this.parentNode=null;this.childNodes=[];this.childNodeMap={}}equals(i){return this.id===i.id}addChildNode(i){if(this.childNodeMap[i.id]){return}this.childNodes.push(i);this.childNodeMap[i.id]=i;i.parentNode=this}}var e={__esModule:true};e.HierarchyNode=t;return e})})();
//# sourceMappingURL=HierarchyNode.js.map
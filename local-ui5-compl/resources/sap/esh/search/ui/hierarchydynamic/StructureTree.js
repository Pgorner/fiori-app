/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){"use strict";class e{id;label;tree;childNodes;childNodeMap;parentNode;constructor(e){this.id=e.id;this.label=e.label;this.tree=e.tree;this.childNodes=[];this.childNodeMap={};this.parentNode=null}addChildNode(e){this.childNodes.push(e);this.childNodeMap[e.id]=e;e.parentNode=this}update(e){for(let t=0;t<e.childNodes.length;++t){const d=e.childNodes[t];let i=this.childNodeMap[d.id];if(!i){i=this.tree.createNode({id:d.id,label:d.label});this.addChildNode(i)}i.update(d)}}}class t{node;nodeMap;constructor(e){this.nodeMap={};this.node=this.createNode(e.rootNode)}createNode(t){t.tree=this;const d=new e(t);this.nodeMap[t.id]=d;return d}getNode(e){return this.nodeMap[e]}update(e){const t=this.nodeMap[e.id];if(!t){throw new Error(`structure tree update failed, node does not exist: ${e?.id}`)}t.update(e)}updateFromHierarchyNodePath(e){let t;for(const d of e.path){let e=this.getNode(d.id);if(!e){e=this.createNode({id:d.id,label:d.label||d.id});if(!t){throw"program error, parent node not set"}t.addChildNode(e)}t=e}}}t.StructureTreeNode=e;return t})})();
//# sourceMappingURL=StructureTree.js.map
/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e={};var t=function(e,t){this.nodeIdField=e;this.childrenField=t;this.memoizedIndex=[]};t.prototype.getPathToNode=function(e,t){const n=this.memoizedIndex[e];if(n){return n.stack}var i=[];this._walkTree(e,t,i);return i};t.prototype.getNodeById=function(e,t){const n=this.memoizedIndex[e];if(n){return n.node}this.getPathToNode(e,t);return this.memoizedIndex[e]?.node};t.prototype._walkTree=function(e,t,n){var i=this._findLeaf(t,e),r=!!i;if(r){n.push(e);this.memoizedIndex[e]={node:i,stack:n};return true}for(var o=0;o<t.length;o++){if(t[o][this.childrenField]){n.push(t[o][this.nodeIdField]);if(this._walkTree(e,t[o][this.childrenField],n)){return true}n.pop()}}};t.prototype._findLeaf=function(e,t){for(var n=0;n<e.length;n++){if(e[n][this.nodeIdField]===t){return e[n]}}return null};return{treeTypes:{Documentation:"Documentation",ApiReference:"ApiReference"},getInstance:function(n,i,r){if(!e[n]){e[n]=new t(i,r)}return e[n]}}});
//# sourceMappingURL=TreeUtil.js.map
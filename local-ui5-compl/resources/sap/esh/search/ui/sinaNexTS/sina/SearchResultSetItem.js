/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ResultSetItem","../core/core"],function(t,e){"use strict";const i=t["ResultSetItem"];const s=e["generateGuid"];class r extends i{dataSource;attributes;attributesMap;titleAttributes;titleDescriptionAttributes;detailAttributes;defaultNavigationTarget;navigationTargets;score=0;hierarchyNodePaths;constructor(t){super(t);this.dataSource=t.dataSource??this.dataSource;this.setAttributes(t.attributes||[]);this.setTitleAttributes(t.titleAttributes);this.setTitleDescriptionAttributes(t.titleDescriptionAttributes);this.setDetailAttributes(t.detailAttributes);this.setDefaultNavigationTarget(t.defaultNavigationTarget);this.setNavigationTargets(t.navigationTargets||[]);this.score=t.score??this.score;this.hierarchyNodePaths=t.hierarchyNodePaths??this.hierarchyNodePaths}setDefaultNavigationTarget(t){if(!t){this.defaultNavigationTarget=undefined;return}this.defaultNavigationTarget=t;t.parent=this}setNavigationTargets(t){this.navigationTargets=[];if(!t){return}for(const e of t){this.addNavigationTarget(e)}}addNavigationTarget(t){this.navigationTargets.push(t);t.parent=this}setAttributes(t){this.attributes=[];this.attributesMap={};for(const e of t){this.attributes.push(e);this.attributesMap[e.id]=e;e.parent=this}}setTitleAttributes(t){this.titleAttributes=[];if(!Array.isArray(t)||t.length<1){return this}for(let e=0;e<t.length;e++){const i=t[e];i.parent=this;this.titleAttributes.push(i)}return this}setTitleDescriptionAttributes(t){this.titleDescriptionAttributes=[];if(!Array.isArray(t)||t.length<1){return this}for(let e=0;e<t.length;e++){const i=t[e];i.parent=this;this.titleDescriptionAttributes.push(i)}return this}setDetailAttributes(t){this.detailAttributes=[];if(!Array.isArray(t)||t.length<1){return this}for(let e=0;e<t.length;e++){const i=t[e];i.parent=this;this.detailAttributes.push(i)}return this}get key(){const t=[];t.push(this.dataSource.id);for(const e of this.titleAttributes){const i=e.getSubAttributes();for(const e of i){t.push(e.value)}}if(t.length===1){t.push(s())}return t.join("-")}toString(){let t;const e=[];const i=[];for(t=0;t<this.titleAttributes.length;++t){const e=this.titleAttributes[t];i.push(e.toString())}e.push("--"+i.join(" "));for(t=0;t<this.detailAttributes.length;++t){const i=this.detailAttributes[t];e.push(i.toString())}return e.join("\n")}}var a={__esModule:true};a.SearchResultSetItem=r;return a})})();
//# sourceMappingURL=SearchResultSetItem.js.map
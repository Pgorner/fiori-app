/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ComparisonOperator","./ComplexCondition","./Filter","./LogicalOperator","./SearchResultSetItemAttribute","./SearchResultSetItemAttributeGroup","./SimpleCondition","./HierarchyDisplayType"],function(t,e,r,i,a,n,o,s){"use strict";const c=t["ComparisonOperator"];const u=e["ComplexCondition"];const l=r["Filter"];const f=i["LogicalOperator"];const p=a["SearchResultSetItemAttribute"];const h=n["SearchResultSetItemAttributeGroup"];const y=o["SimpleCondition"];const b=s["HierarchyDisplayType"];function d(t,e){if(e===c.Eq){return t}const r=[];const i=t.split(" ");for(let t=0;t<i.length;t++){let a=i[t].trim();if(a.length===0){continue}switch(e){case c.Co:a="*"+a+"*";break;case c.Bw:a=a+"*";break;case c.Ew:a="*"+a;break;default:break}r.push(a)}return r.join(" ")}function g(t,e,r,i){const a=[];if(e?.length&&t){const n=t.getBusinessObjectDataSources();n.forEach(t=>{if(t.getHierarchyDataSource()===i){a.push(t)}else if(t.hierarchyName===e){return}else{t.attributesMetadata.forEach(i=>{if(i.hierarchyName===r&&i.id===e&&i.hierarchyDisplayType===b.HierarchyResultView||i.hierarchyDisplayType===b.StaticHierarchyFacet){a.push(t)}})}})}return a}function m(t){const e=[];t.titleAttributes.forEach(t=>{if(t instanceof h&&Array.isArray(t.attributes)){t.attributes.forEach(t=>{if(t.attribute&&t.attribute instanceof p&&t.attribute.value?.startsWith("sap-icon://")!==true){e.push(t.attribute.valueFormatted)}})}else if(t instanceof p){if(t.value.startsWith("sap-icon://")!==true){e.push(t.valueFormatted)}}});return e.filter(t=>typeof t==="string"&&t.trim()!=="").join(" ")}function S(t,e,r,i,a){const n=new y({attribute:e,operator:c.DescendantOf,value:r,valueLabel:i});const o=new u({operator:f.And,conditions:[n]});const s=new u({operator:f.And,conditions:[o]});a.forEach(e=>{const r=new l({dataSource:e,searchTerm:"",rootCondition:s,sina:t.sina});t.navigationTargets.push(t.sina.createSearchNavigationTarget(r,e.labelPlural))})}function v(t){if(typeof t==="string"){return t}if(typeof t==="number"||typeof t==="boolean"){return String(t)}if(t===null||t===undefined){return""}if(typeof t==="object"){if(typeof t.toString==="function"){return t.toString()}else{return JSON.stringify(t)}}return""+t}var C={__esModule:true};C.convertOperator2Wildcards=d;C.getNavigationHierarchyDataSources=g;C.assembleTitle=m;C.assembleHierarchyDecendantsNavigations=S;C.stringifyValue=v;return C})})();
//# sourceMappingURL=util.js.map
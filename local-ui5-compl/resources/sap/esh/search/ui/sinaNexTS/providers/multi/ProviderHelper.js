/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";class t{provider;sina;constructor(t){this.provider=t;this.sina=t.sina}calculateMultiDataSourceLabel(t,e){if(e.label){const a=e.label||e.id;return t+" - "+a}return t}calculateMultiDataSourceId(t,e){return e+"_"+t}updateProviderId(t){let e=0;for(;;){if(e!==0){t.provider.id=t.provider.id+"_"+e}const a=this.findSinaById(t.provider.id);if(a){e++;continue}else{break}}}createMultiDataSource(t,e){return this.sina._createDataSource({id:t,label:this.calculateMultiDataSourceLabel(e.label,e.sina.provider),labelPlural:this.calculateMultiDataSourceLabel(e.labelPlural,e.sina.provider),type:e.type,hidden:e.hidden,attributesMetadata:e.attributesMetadata})}findSinaById(t){for(let e=0;e<this.provider.multiSina.length;e++){const a=this.provider.multiSina[e];if(t===a.provider.id){return a}}return undefined}updateAttributesMetadata(t,e){e.attributesMetadata=t.attributesMetadata;e.attributeMetadataMap=t.attributeMetadataMap}updateSuggestionDataSource(t){for(let e=0;e<t.items.length;e++){const a=t.items[e];if(a.childSuggestions){for(let t=0;t<a.childSuggestions.length;t++){const e=a.childSuggestions[t];const i=this.calculateMultiDataSourceId(e.dataSource.id,e.sina.provider.id);e.dataSource=this.sina.dataSourceMap[i];e.filter.dataSource=this.sina.dataSourceMap[i]}}if(a.dataSource){a.label=this.calculateMultiDataSourceLabel(a.label,a.sina.provider);const t=this.calculateMultiDataSourceId(a.dataSource.id,a.sina.provider.id);const e=this.sina.dataSourceMap[t];a.dataSource=e;a.sina=this.sina}}return t}createMultiChartResultSet(t){const e=this;const a=e.sina._createChartResultSet({id:t.id,items:[],query:t.query,title:t.title});for(let i=0;i<t.items.length;i++){const r=t.items[i];const o=e.sina.parseConditionFromJson(r.filterCondition.toJson());a.items.push(e.sina._createChartResultSetItem({filterCondition:o,dimensionValueFormatted:r.dimensionValueFormatted,measureValue:r.measureValue,measureValueFormatted:r.measureValueFormatted}))}return a}updateDataSourceFacets(t){for(let e=0;e<t[0].items.length;e++){const a=t[0].items[e];if(a.dataSource){const t=this.calculateMultiDataSourceId(a.dataSource.id,a.sina.provider.id);if(!this.provider.multiDataSourceMap[t]){this.createMultiDataSource(t,a.dataSource);this.provider.multiDataSourceMap[t]=a.dataSource}a.dataSource=this.sina.dataSourceMap[t]}}return t}updateRootCondition(t,e){t.sina=e;if(t.conditions&&t.conditions.length>0){for(let a=0;a<t.conditions.length;a++){this.updateRootCondition(t.conditions[a],e)}}}}var e={__esModule:true};e.ProviderHelper=t;return e})})();
//# sourceMappingURL=ProviderHelper.js.map
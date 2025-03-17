/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";class t{sina;navigationTargetGenerator;label;sourceObjectType;targetObjectType;conditions;_condition;constructor(t){this.sina=t.sina;this.navigationTargetGenerator=t.navigationTargetGenerator;this.label=t.label;this.sourceObjectType=t.sourceObjectType;this.targetObjectType=t.targetObjectType;this.conditions=t.conditions}generate(t){const e=this.sina.getDataSource(this.targetObjectType);const a=this.sina.createFilter({dataSource:e,searchTerm:"*"});for(let r=0;r<this.conditions.length;++r){const i=this.conditions[r];const n=this.sina.createSimpleCondition({attribute:i.targetPropertyName,attributeLabel:e.getAttributeMetadata(i.targetPropertyName).label,operator:this.sina.ComparisonOperator.Eq,value:t[i.sourcePropertyName].value,valueLabel:t[i.sourcePropertyName].valueFormatted});a.autoInsertCondition(n)}return this.sina.createNavigationTarget({text:this.label,targetUrl:this.navigationTargetGenerator.urlPrefix+encodeURIComponent(JSON.stringify(a.toJson()))})}}var e={__esModule:true};e.NavigationTargetTemplate=t;return e})})();
//# sourceMappingURL=NavigationTargetTemplate.js.map
/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./NavigationTargetTemplate","../../../sina/SinaObject"],function(t,e){"use strict";const i=t["NavigationTargetTemplate"];const n=e["SinaObject"];class a extends n{navigationTargetGenerator;sourceObjectType;targetObjectType;conditions;constructor(t){super(t);this.navigationTargetGenerator=t.navigationTargetGenerator;this.sourceObjectType=t.sourceObjectType;this.targetObjectType=t.targetObjectType;this.conditions=[]}add(t){this.conditions.push(t)}hasDuplicateSemanticObject(){const t={};for(let e=0;e<this.conditions.length;++e){const i=this.conditions[e];if(t[i.semanticObjectType]){return true}t[i.semanticObjectType]=true}return false}hasDistinctValue(t,e){let i;for(let n=0;n<this.conditions.length;++n){const a=this.conditions[n];if(a.semanticObjectType!==t){continue}if(!i){i=a[e];continue}if(i!==a[e]){return false}}return true}generateNavigationTargetTemplates(){if(this.hasDuplicateSemanticObject()){return this.createSingleConditionsTemplates()}return this.createMultipleConditionsTemplates()}createSingleConditionsTemplates(){const t=[];for(let e=0;e<this.conditions.length;++e){const n=this.conditions[e];const a=this.hasDistinctValue(n.semanticObjectType,"sourcePropertyName");const o=this.hasDistinctValue(n.semanticObjectType,"targetPropertyName");if(!a&&!o){continue}const s=new i({sina:this.sina,navigationTargetGenerator:this.navigationTargetGenerator,label:"dummy",sourceObjectType:this.sourceObjectType,targetObjectType:this.targetObjectType,conditions:[n]});s._condition=n;t.push(s)}this.assembleSingleConditionTemplateLabels(t);return t}createMultipleConditionsTemplates(){return[new i({sina:this.sina,navigationTargetGenerator:this.navigationTargetGenerator,label:this.navigationTargetGenerator.objectTypeMap[this.targetObjectType].label,sourceObjectType:this.sourceObjectType,targetObjectType:this.targetObjectType,conditions:this.conditions})]}assembleSingleConditionTemplateLabels(t){const e={};let i,n,a,o;for(let s=0;s<t.length;++s){a=t[s];o=this.navigationTargetGenerator.objectTypeMap[this.targetObjectType];n=o.label+" to:"+o.propertyMap[a._condition.targetPropertyName].label;a.label=n;i=e[n];if(!i){i=[];e[n]=i}i.push(a)}o=this.navigationTargetGenerator.objectTypeMap[this.sourceObjectType];for(n in e){i=e[n];if(i.length>1){for(let t=0;t<i.length;++t){a=i[t];a.label+=" from:"+o.propertyMap[a._condition.sourcePropertyName].label}}}}}var o={__esModule:true};o.JoinConditions=a;return o})})();
//# sourceMappingURL=JoinConditions.js.map
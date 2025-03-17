/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/errors","../../sina/AttributeType","../../sina/ComparisonOperator","../../sina/ComplexCondition","./typeConverter"],function(e,t,r,n,o){"use strict";const i=e["UnknownComparisonOperatorError"];const a=t["AttributeType"];const s=r["ComparisonOperator"];const c=n["ComplexCondition"];class u{dataSource;constructor(e){this.dataSource=e}convertSinaToInaOperator(e){switch(e){case s.Eq:return"=";case s.Lt:return"<";case s.Gt:return">";case s.Le:return"<=";case s.Ge:return">=";case s.Co:return"=";case s.Bw:return"=";case s.Ew:return"=";default:throw new i(e)}}serializeComplexCondition(e){const t={Selection:{Operator:{Code:e.operator,SubSelections:[]}}};const r=e.conditions;for(let e=0;e<r.length;++e){const n=r[e];t.Selection.Operator.SubSelections.push(this.serialize(n))}return t}serializeSimpleCondition(e){if(!e.value){return undefined}const t=e.attribute;let r;if(t.slice(0,2)==="$$"){r=a.String}else{const e=this.dataSource.getAttributeMetadata(t);r=e.type}let n="MemberOperand";if(t==="$$SuggestionTerms$$"||t==="$$SearchTerms$$"){n="SearchOperand"}const i={};i[n]={AttributeName:t,Comparison:this.convertSinaToInaOperator(e.operator),Value:o.sina2Ina(r,e.value,{operator:e.operator})};return i}serialize(e){if(e instanceof c){return this.serializeComplexCondition(e)}return this.serializeSimpleCondition(e)}}function l(e,t){const r=new u(e);return r.serialize(t)}var p={__esModule:true};p.serialize=l;return p})})();
//# sourceMappingURL=conditionSerializer.js.map
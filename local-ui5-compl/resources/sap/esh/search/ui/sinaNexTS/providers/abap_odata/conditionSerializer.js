/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/ComparisonOperator","./typeConverter","../../sina/ComplexCondition","../../sina/SimpleCondition","../../core/errors","./ComparisonOperator","../../sina/LogicalOperator"],function(t,e,o,r,n,i,a){"use strict";const s=t["ComparisonOperator"];const c=o["ComplexCondition"];const u=r["SimpleCondition"];const p=n["InBetweenConditionInConsistent"];const d=n["UnknownComparisonOperatorError"];const l=i["ABAPODataComparisonOperator"];const C=a["LogicalOperator"];class O{dataSource;constructor(t){this.dataSource=t}convertSinaToOdataOperator(t){switch(t){case s.Eq:return"EQ";case s.Lt:return"LT";case s.Gt:return"GT";case s.Le:return"LE";case s.Ge:return"GE";case s.Co:return"EQ";case s.Bw:return"EQ";case s.Ew:return"EQ";case C.And:return"AND";case C.Or:return"OR";default:throw new d(t)}}serializeComplexCondition(t){const e={ActAsQueryPart:false,Id:1,OperatorType:this.convertSinaToOdataOperator(t.operator),SubFilters:[]};const o="Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=SearchFilter]>Property[Name=ActAsQueryPart]";if(t.sina.provider.isQueryPropertySupported(o)){e.ActAsQueryPart=true}const r=t.conditions;for(let t=0;t<r.length;++t){const o=r[t];e.SubFilters.push(this.serialize(o))}return e}serializeSimpleCondition(t){const o=this.dataSource.getAttributeMetadata(t.attribute);const r=o.type;const n={ConditionAttribute:t.attribute,ConditionOperator:this.convertSinaToOdataOperator(t.operator),ConditionValue:t.isDynamicValue?t.value:e.sina2Odata(r,t.value,{operator:t.operator}),SubFilters:[]};return n}serializeBetweenCondition(t){let o;let r;const n=t.conditions[0];const i=t.conditions[1];if(n instanceof u&&i instanceof u){const t=this.dataSource.getAttributeMetadata(n.attribute);const a=t.type;if(n.operator===s.Ge){o=n.value;r=i.value}else{o=i.value;r=n.value}const c={ConditionAttribute:n.attribute,ConditionOperator:l.Bt,ConditionValue:e.sina2Odata(a,o),ConditionValueHigh:e.sina2Odata(a,r),SubFilters:[]};return c}throw new p}serialize(t){if(t instanceof c){if(t.operator===C.And&&t.conditions[0]&&(t.conditions[0].operator===s.Ge||t.conditions[0].operator===s.Gt||t.conditions[0].operator===s.Le||t.conditions[0].operator===s.Lt)){if(t.conditions.length===1){return this.serializeSimpleCondition(t.conditions[0])}return this.serializeBetweenCondition(t)}return this.serializeComplexCondition(t)}if(t instanceof u){return this.serializeSimpleCondition(t)}}}function S(t,e){const o=new O(t);return o.serialize(e)}var h={__esModule:true};h.serialize=S;return h})})();
//# sourceMappingURL=conditionSerializer.js.map
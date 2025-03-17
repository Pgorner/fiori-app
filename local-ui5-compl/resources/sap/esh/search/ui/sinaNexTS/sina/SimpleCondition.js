/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../core/util","./ComparisonOperator","./Condition","./ConditionType"],function(t,e,i,a){"use strict";const r=e["ComparisonOperator"];const s=i["Condition"];const u=a["ConditionType"];class n extends s{type=(()=>u.Simple)();operator=(()=>r.Eq)();attribute;isDynamicValue;value;constructor(t){super(t);this.operator=t.operator??this.operator;this.attribute=t.attribute??this.attribute;this.userDefined=t.userDefined??this.userDefined;this.isDynamicValue=t.isDynamicValue??false;this.value=t.value??this.value}clone(){return new n({operator:this.operator,attribute:this.attribute,attributeLabel:this.attributeLabel,value:this.value,valueLabel:this.valueLabel,userDefined:this.userDefined,isDynamicValue:this.isDynamicValue})}equals(t){if(!(t instanceof n)){return false}if(this.attribute!==t.attribute||this.operator!==t.operator){return false}if(this.isDynamicValue!==t.isDynamicValue){return false}if(this.value instanceof Date&&t.value instanceof Date){return this.value.getTime()===t.value.getTime()}return this.value===t.value}containsAttribute(t){return this.attribute===t}_collectAttributes(t){t[this.attribute]=true}getFirstAttribute(){return this.attribute}_collectFilterConditions(t,e){if(this.attribute===t){e.push(this)}}removeAttributeConditions(t){if(this.attribute===t){throw"program error"}return{deleted:false,attribute:"",value:""}}toJson(){let e;if(this.value instanceof Date){e=t.dateToJson(this.value)}else{e=this.value}const i={type:u.Simple,operator:this.operator,attribute:this.attribute,value:e,valueLabel:this.valueLabel,attributeLabel:this.attributeLabel};if(this.userDefined){i.userDefined=true}if(this.isDynamicValue){i.dynamic=this.isDynamicValue}return i}}var o={__esModule:true};o.SimpleCondition=n;return o})})();
//# sourceMappingURL=SimpleCondition.js.map
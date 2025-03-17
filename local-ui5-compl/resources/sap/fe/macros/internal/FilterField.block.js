/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/fe/base/BindingToolkit","sap/fe/core/buildingBlocks/templating/BuildingBlockSupport","sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor","sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase","sap/fe/core/converters/MetaModelConverter","sap/fe/core/helpers/StableIdHelper","sap/fe/core/templating/DataModelPathHelper","sap/fe/core/templating/PropertyFormatters","sap/fe/core/templating/PropertyHelper","sap/fe/core/templating/UIFormatters","sap/fe/macros/CommonHelper","sap/fe/macros/field/FieldHelper","sap/fe/macros/filter/FilterFieldHelper","sap/fe/macros/filter/FilterFieldTemplating","sap/fe/macros/filterBar/ExtendedSemanticDateOperators"],function(e,t,r,i,a,o,n,l,s,p,u,c,d,m,f,y){"use strict";var g,b,h,v,P,x,F,$,C,O,T,B,D,I,E,w,M,z,V;var j={};var H=f.getFilterFieldDisplayFormat;var S=m.maxConditions;var R=m.isRequiredInFilter;var k=m.getPlaceholder;var A=m.getDataType;var q=m.getConditionsBinding;var L=m.formatOptions;var _=m.constraints;var W=u.getDisplayMode;var K=p.getAssociatedExternalIdPropertyPath;var U=s.getRelativePropertyPath;var N=l.getTargetObjectPath;var X=l.getContextRelativeTargetObjectPath;var G=n.generate;var J=i.xml;var Q=i.SAP_UI_MODEL_CONTEXT;var Y=r.defineBuildingBlock;var Z=r.blockAttribute;var ee=t.formatResult;var te=t.constant;var re=t.compileExpression;function ie(e,t,r,i){r&&Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(i):void 0})}function ae(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,oe(e,t)}function oe(e,t){return oe=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},oe(e,t)}function ne(e,t,r,i,a){var o={};return Object.keys(i).forEach(function(e){o[e]=i[e]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},o),a&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(a):void 0,o.initializer=void 0),void 0===o.initializer?(Object.defineProperty(e,t,o),null):o}function le(e,t){throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform.")}let se=(g=Y({name:"FilterField",namespace:"sap.fe.macros.internal"}),b=Z({type:"sap.ui.model.Context",required:true,isPublic:true}),h=Z({type:"sap.ui.model.Context",required:true,isPublic:true}),v=Z({type:"sap.ui.model.Context",isPublic:true}),P=Z({type:"string",isPublic:true}),x=Z({type:"string",isPublic:true}),F=Z({type:"boolean",isPublic:true}),$=Z({type:"string",isPublic:true}),C=Z({type:"string",isPublic:false}),g(O=(T=function(t){function r(e,r,i){var a;a=t.call(this,e,r,i)||this;ie(a,"property",B,a);ie(a,"contextPath",D,a);ie(a,"visualFilter",I,a);ie(a,"idPrefix",E,a);ie(a,"vhIdPrefix",w,a);ie(a,"useSemanticDateRange",M,a);ie(a,"settings",z,a);ie(a,"editMode",V,a);const n=o.convertMetaModelContext(a.property);const l=K(n);if(l){a.propertyExternalId=a.property.getModel().createBindingContext(a.property.getPath().replace(n.name,l),a.property)}const s=a.propertyExternalId?o.convertMetaModelContext(a.propertyExternalId):undefined;const p=o.getInvolvedDataModelObjects(a.property,a.contextPath);const u=n.name,m=n.name,f=!!s?.annotations?.Common?.ValueListWithFixedValues||!!n.annotations?.Common?.ValueListWithFixedValues;a.controlId=a.idPrefix&&G([a.idPrefix,m]);a.sourcePath=N(p);a.documentRefText=p.targetObject?.annotations.Common?.DocumentationRef?.toString();a.dataType=A(s||n);const g=n?.annotations?.Common?.Label;const b=g?.toString()??te(u);a.label=re(b)||u;a.conditionsBinding=q(p)||"";a.placeholder=k(n);a.propertyKey=X(p,false,true)||u;a.vfEnabled=!!a.visualFilter&&!(a.idPrefix&&a.idPrefix.includes("Adaptation"));a.vfId=a.vfEnabled?G([a.idPrefix,u,"VisualFilter"]):undefined;const h=a.property,v=h.getModel(),P=d.valueHelpPropertyForFilterField(h),x=c.isPropertyFilterable(h),F=h.getObject(),$={context:h};a.display=H(p,n,$);a.isFilterable=!(x===false||x==="false");a.maxConditions=S(F,$);a.dataTypeConstraints=_(F,$);a.dataTypeFormatOptions=L(F,$);a.required=R(F,$);a.operators=d.operators(h,F,a.useSemanticDateRange,a.settings||"",a.contextPath.getPath());if(a.operators){y.addExtendedFilterOperators(a.operators.split(","))}const C=v.createBindingContext(P);const O=C.getObject(),T={context:C},j=U(O,T),W=U(F,$);a.valueHelpProperty=d.getValueHelpPropertyForFilterField(h,F,F.$Type,a.vhIdPrefix,W,j,f,a.useSemanticDateRange);return a}j=r;ae(r,t);var i=r.prototype;i.getVisualFilterContent=function e(){let t=this.visualFilter,r="";if(!this.vfEnabled||!t){return r}if(t?.isA?.(Q)){t=t.getObject()}const{contextPath:i,presentationAnnotation:a,outParameter:o,inParameters:n,valuelistProperty:l,selectionVariantAnnotation:s,multipleSelectionAllowed:p,required:u,requiredProperties:d=[],showOverlayInitially:m,renderLineChart:f,isValueListWithFixedValues:y}=t;r=J`
				<macro:VisualFilter
					id="${this.vfId}"
					contextPath="${i}"
					metaPath="${a}"
					outParameter="${o}"
					inParameters="${n}"
					valuelistProperty="${l}"
					selectionVariantAnnotation="${s}"
					multipleSelectionAllowed="${p}"
					required="${u}"
					requiredProperties="${c.stringifyCustomData(d)}"
					showOverlayInitially="${m}"
					renderLineChart="${f}"
					isValueListWithFixedValues="${y}"
					filterBarEntityType="${i}"
				/>
			`;return r};i.getTemplate=async function t(){let r=``;if(this.isFilterable){let t;const i=this.documentRefText===undefined||null?false:true;const a=re(ee([this.documentRefText],"sap.fe.core.formatters.StandardFormatter#asArray"));try{const e=this.propertyExternalId&&o.getInvolvedDataModelObjects(this.propertyExternalId,this.contextPath);t=e?W(e):await this.display}catch(t){e.error(`FE : FilterField BuildingBlock : Error fetching display property for ${this.sourcePath} : ${t}`)}r=J`
				<mdc:FilterField
					xmlns:mdc="sap.ui.mdc"
					xmlns:template="http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1"
					xmlns:macro="sap.fe.macros"
					xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"
					xmlns:fieldhelp="sap.ui.core.fieldhelp"
					customData:sourcePath="${this.sourcePath}"
					id="${this.controlId}"
					delegate="{name: 'sap/fe/macros/field/FieldBaseDelegate', payload:{isFilterField:true}}"
					propertyKey="${this.propertyKey}"
					label="${this.label}"
					dataType="${this.dataType}"
					display="${t}"
					maxConditions="${this.maxConditions}"
					valueHelp="${this.valueHelpProperty}"
					conditions="${this.conditionsBinding}"
					dataTypeConstraints="${this.dataTypeConstraints}"
					dataTypeFormatOptions="${this.dataTypeFormatOptions}"
					required="${this.required}"
					operators="${this.operators}"
					placeholder="${this.placeholder}"
					${this.attr("editMode",this.editMode)}
				>
					${i?J`
						<mdc:customData>
							<fieldhelp:FieldHelpCustomData
								${this.attr("value",a)}
							/>
						</mdc:customData>
					`:""}
					${this.vfEnabled?this.getVisualFilterContent():""}
				</mdc:FilterField>
			`}return r};return r}(a),B=ne(T.prototype,"property",[b],{configurable:true,enumerable:true,writable:true,initializer:null}),D=ne(T.prototype,"contextPath",[h],{configurable:true,enumerable:true,writable:true,initializer:null}),I=ne(T.prototype,"visualFilter",[v],{configurable:true,enumerable:true,writable:true,initializer:null}),E=ne(T.prototype,"idPrefix",[P],{configurable:true,enumerable:true,writable:true,initializer:function(){return"FilterField"}}),w=ne(T.prototype,"vhIdPrefix",[x],{configurable:true,enumerable:true,writable:true,initializer:function(){return"FilterFieldValueHelp"}}),M=ne(T.prototype,"useSemanticDateRange",[F],{configurable:true,enumerable:true,writable:true,initializer:function(){return true}}),z=ne(T.prototype,"settings",[$],{configurable:true,enumerable:true,writable:true,initializer:function(){return""}}),V=ne(T.prototype,"editMode",[C],{configurable:true,enumerable:true,writable:true,initializer:null}),T))||O);j=se;return j},false);
//# sourceMappingURL=FilterField.block.js.map
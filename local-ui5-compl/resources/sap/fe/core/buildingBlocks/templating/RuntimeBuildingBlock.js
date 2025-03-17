/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor","sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase","sap/fe/core/buildingBlocks/templating/RuntimeBuildingBlockFragment","sap/fe/core/helpers/TypeGuards","sap/ui/core/Lib"],function(t,e,n,i,o,a){"use strict";var r={};var s=o.isContext;var l=i.storeRuntimeBlock;var u=e.xml;var c=e.registerBuildingBlock;function p(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,f(t,e)}function f(t,e){return f=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},f(t,e)}let B=function(e){function n(){return e.apply(this,arguments)||this}r=n;p(n,e);var i=n.prototype;i.getContent=function t(e,n,i){return i};n.register=function t(){c(this);l(this)};n.load=async function e(){if(this.metadata.libraries){try{await Promise.all(this.metadata.libraries.map(async t=>a.load({name:t})))}catch(e){const n=`Couldn't load building block ${this.metadata.name} please make sure the following libraries are available ${this.metadata.libraries.join(",")}`;t.error(n);throw new Error(n)}}return Promise.resolve(this)};i.getTemplate=function t(e){return""};i.getRuntimeBuildingBlockTemplate=function t(e){const n=this.constructor.metadata;const i=`${n.namespace??n.publicNamespace}.${n.name}`;const o=[];const a=[];const r=[];const l=[];for(const t in n.properties){let e=this[t];if(e!==undefined&&e!==null){if(s(e)){e=e.getPath()}if(n.properties[t].type==="function"){a.push(e);l.push(e);r.push(t)}else{o.push(u`feBB:${t}="${e}"`)}}}if(a.length>0){o.push(u`functionHolder="${a.join(";")}"`);o.push(u`feBB:functionStringInOrder="${l.join(",")}"`);o.push(u`feBB:propertiesAssignedToFunction="${r.join(",")}"`)}const c=this.getTemplate(e);return u`<feBB:RuntimeBuildingBlockFragment
					xmlns:core="sap.ui.core"
					xmlns:feBB="sap.fe.core.buildingBlocks.templating"
					fragmentName="${i}"
					id="${this.id}"
					type="FE_COMPONENTS"
					${o.length>0?o:""}
				>
				${this.addConditionally(c.length>0,`<feBB:fragmentXML>\n\t\t\t\t\t\t${c}\n\t\t\t\t\t</feBB:fragmentXML>`)}
				<feBB:dependents>
					<slot name="dependents"/>
				</feBB:dependents>
				<feBB:customDataHolder>
					<slot name="customData"/>
				</feBB:customDataHolder>
				<feBB:layoutData>
					<slot name="layoutData"/>
				</feBB:layoutData>
				</feBB:RuntimeBuildingBlockFragment>`};return n}(n);B.isRuntime=true;r=B;return r},false);
//# sourceMappingURL=RuntimeBuildingBlock.js.map
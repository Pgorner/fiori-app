/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/actiontoolbar/ActionToolbarAction","../Util","sap/m/designtime/MenuButton.designtime"],(t,e,n)=>{"use strict";const i={description:"{description}",name:"{name}",aggregations:{action:{propagateMetadata:function(t){if(t.isA("sap.m.MenuButton")){return{actions:{remove:null,reveal:null,split:{CAUTION_variantIndependent:true}}}}return{actions:{rename:{changeType:"rename",domRef:function(t){return t.$()},getTextMutators:function(t){return{getText:function(){return t.getDomRef().textContent},setText:function(e){t.getDomRef().textContent=e}}},CAUTION_variantIndependent:true},remove:null,reveal:null}}}}},properties:{},actions:{}};const o=["action"];const r=[];return e.getDesignTime(t,r,o,i)});
//# sourceMappingURL=ActionToolbarAction.designtime.js.map
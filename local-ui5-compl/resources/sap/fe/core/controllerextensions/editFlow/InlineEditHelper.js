/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Element"],function(e){"use strict";var t={};const n="inlineEdit";function i(e,t){const n=e.getModel("ui");const i=n.getProperty("/registeredBindingContexts")??[];const o=e.getId();if(t){const t=`/${o}`;n.setProperty(t,{isEditable:true});e.bindElement({path:t,model:"ui"});i.push(o);n.setProperty("/registeredBindingContexts",i)}else{e.unbindElement("ui");n.setProperty("/registeredBindingContexts",i.filter(e=>e!==o))}}t.toggleControlLocalEdit=i;function o(t){t.getModel().resetChanges(n);const i=t.getModel("ui");const o=i.getProperty("/registeredBindingContexts")??[];for(const t of o){const n=e.getElementById(t);if(n){n.unbindElement("ui")}}i.setProperty("/registeredBindingContexts",[])}t.leaveInlineEdit=o;return t},false);
//# sourceMappingURL=InlineEditHelper.js.map
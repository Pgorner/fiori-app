/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"],function(e){"use strict";function n(e){if(e.getMetadata().getName()==="sap.cux.home.NewsAndPagesContainer"){return e}return e.getItems().find(e=>e.getMetadata().getName()==="sap.cux.home.NewsAndPagesContainer")}const t={applyChange:(e,t)=>{const a=n(t);a?.setIconPersonalizations(e.getContent());return true},revertChange:(e,t)=>{const a=e.getContent();a.forEach(e=>{e.icon=e.oldIcon});const o=n(t);o?.setIconPersonalizations(a)},completeChangeContent:()=>{},getCondenserInfo:n=>{const t=n.getContent();return{affectedControl:n.getSelector(),classification:e.LastOneWins,uniqueKey:t.spaceId+(t.pageId||"")+"_icon"}}};return t});
//# sourceMappingURL=SpacePageIconHandler.js.map
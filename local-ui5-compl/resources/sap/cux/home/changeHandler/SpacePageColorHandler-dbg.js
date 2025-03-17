/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"],function(e){"use strict";function t(e){return e.getItems().find(e=>e.getMetadata().getName()==="sap.cux.home.NewsAndPagesContainer")}const n={applyChange:(e,n)=>{const o=t(n);o?.setColorPersonalizations(e.getContent());return true},revertChange:(e,n)=>{const o=e.getContent();o.forEach(e=>{e.BGColor=e.oldColor;e.applyColorToAllPages=e.oldApplyColorToAllPages});const s=t(n);s?.setColorPersonalizations(o)},completeChangeContent:()=>{},getCondenserInfo:t=>{const n=t.getContent();return{affectedControl:t.getSelector(),classification:e.LastOneWins,uniqueKey:n.spaceId+(n.pageId||"")+"_color"}}};return n});
//# sourceMappingURL=SpacePageColorHandler-dbg.js.map
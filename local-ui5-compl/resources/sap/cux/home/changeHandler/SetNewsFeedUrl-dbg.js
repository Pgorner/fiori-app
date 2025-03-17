/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"],function(e){"use strict";function t(e){if(e.getMetadata().getName()==="sap.cux.home.NewsAndPagesContainer"){return e}return e.getItems().find(e=>e.getMetadata().getName()==="sap.cux.home.NewsAndPagesContainer")}let n=null;const s={applyChange:(e,s)=>{const o=t(s);if(n){clearTimeout(n)}n=setTimeout(()=>{o?.newsPersonalization(e.getContent())},0);return true},revertChange:(e,n)=>{const s=t(n);let o=e.getContent();o.newsFeedURL=o.oldNewsFeedUrl;o.showCustomNewsFeed=o.oldShowCustomNewsFeed;o.customNewsFeedKey=o.oldCustomNewsFeedKey;s?.newsPersonalization(o)},completeChangeContent:()=>{},getCondenserInfo:t=>({affectedControl:t.getSelector(),classification:e.LastOneWins,uniqueKey:"newsFeedUrl"})};return s});
//# sourceMappingURL=SetNewsFeedUrl-dbg.js.map
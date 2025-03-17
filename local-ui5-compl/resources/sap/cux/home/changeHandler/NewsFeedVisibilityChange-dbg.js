/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"],function(e){"use strict";function t(e){if(e.getMetadata().getName()==="sap.cux.home.NewsAndPagesContainer"){return e}return e.getItems().find(e=>e.getMetadata().getName()==="sap.cux.home.NewsAndPagesContainer")}let n=null;const i={applyChange:(e,i)=>{const s=t(i);if(n){clearTimeout(n)}n=setTimeout(()=>{s?.newsVisibilityChangeHandler(e.getContent())},0);return true},revertChange:(e,n)=>{const i=t(n);let s=e.getContent();s.isNewsFeedVisible=!s.isNewsFeedVisible;i?.newsVisibilityChangeHandler(s)},completeChangeContent:()=>{},getCondenserInfo:t=>({affectedControl:t.getSelector(),classification:e.LastOneWins,uniqueKey:"newsFeedVisibility"})};return i});
//# sourceMappingURL=NewsFeedVisibilityChange-dbg.js.map
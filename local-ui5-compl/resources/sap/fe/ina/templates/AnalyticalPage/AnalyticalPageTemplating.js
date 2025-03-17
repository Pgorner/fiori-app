/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/StableIdHelper"],function(e){"use strict";var a={};var t=e.generate;const n=function(e,a){if(e&&e.variantManagement==="Page"){return"fe::PageVariantManagement"}if(e&&e.variantManagement==="Control"){return t([a.filterBarId,"VariantManagement"])}return undefined};a.getVariantBackReference=n;const r=function(e){for(const a of e){if(a.defaultPath){return a.defaultPath}}};a.getDefaultPath=r;return a},false);
//# sourceMappingURL=AnalyticalPageTemplating.js.map
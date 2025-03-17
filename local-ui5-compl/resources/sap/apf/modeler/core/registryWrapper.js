/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/core/constants","sap/apf/utils/exportToGlobal","sap/ui/thirdparty/jquery"],function(t,e,jQuery){"use strict";function r(e){function r(t){var r=[];e.each(function(e,i){if(i.type===t){r.push(i)}});return r}this.getItem=function(t){return e.getItem(t)};this.getSteps=function(){var t=r("step");t=jQuery.merge(t,r("hierarchicalStep"));return t};this.getCategories=function(){return r("category")};this.getFacetFilters=function(){if(e.getItem(t.existsEmptyFacetFilterArray)===true){return{emptyArray:true}}return r("facetFilter")};this.getNavigationTargets=function(){return r("navigationTarget")}}e("sap.apf.modeler.core.RegistryWrapper",r);return r});
//# sourceMappingURL=registryWrapper.js.map
/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/utils/exportToGlobal"],function(t){"use strict";function e(){"use strict";this.getFFListDataFromFilterValues=function(t,e,i){var a=[];t.forEach(function(t){var r={};r.key=t[e];r.text=t.formattedValue;r.selected=false;if(i){i.forEach(function(i){if(i instanceof Date&&t[e]instanceof Date){if(i.toISOString()===t[e].toISOString()){r.selected=true}}else if(i==t[e]){r.selected=true}})}a.push(r)});return a}}t("sap.apf.ui.utils.FacetFilterListConverter",e);return e});
//# sourceMappingURL=facetFilterListConverter.js.map
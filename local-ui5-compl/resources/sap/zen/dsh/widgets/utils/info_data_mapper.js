/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/sac/df/thirdparty/lodash","sap/zen/dsh/widgets/utils/info_chart_exception","sap/zen/dsh/utils/BaseHandler"],function(jQuery,a,t){"use strict";var e=function(){};e.prototype.map=function(a){if(!a||!a.data||!a.data.length){throw new t("mapper.nodata")}return new sap.viz.api.data.FlatTableDataset(a)};e.prototype.getMeasuresDimensionKey=function(t,e){var n=t||[];n=n.concat(e);var s=a.find(n,{containsMeasures:true});return s&&s.key};return e});
//# sourceMappingURL=info_data_mapper.js.map
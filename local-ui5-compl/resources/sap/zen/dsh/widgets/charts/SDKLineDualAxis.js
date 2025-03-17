/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart","sap/zen/dsh/widgets/DualDataSeriesHelper"],function(e,t,i){"use strict";t.extend("sap.zen.SDKLineDualAxisChart",{init:function(){t.prototype.init.apply(this,arguments);this.registerHelper("sap.zen.DualDataSeriesHelper");i.apply(this,arguments)},getPropertyValues:function(){return{plotObjectType:this.getPlotObjectType()}},initCvomChartType:function(){this.cvomType="viz/dual_line";this.cvomErrorMappings={50005:"dualline_datamapping_rmd"}}});return sap.zen.SDKLineDualAxisChart});
//# sourceMappingURL=SDKLineDualAxis.js.map
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Group"],function(e){"use strict";var t=e.extend("sap.gantt.shape.ext.ulc.UtilizationLineChart",{});t.prototype.getEnableSelection=function(e,t){if(this.mShapeConfig.hasShapeProperty("enableSelection")){return this._configFirst("enableSelection",e)}return false};return t},true);
//# sourceMappingURL=UtilizationLineChart.js.map
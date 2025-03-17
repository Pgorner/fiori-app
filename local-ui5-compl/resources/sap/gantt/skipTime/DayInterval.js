/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"],function(t){"use strict";var e=t.extend("sap.gantt.skipTime.DayInterval",{metadata:{library:"sap.gantt",defaultAggregation:"skipIntervals",properties:{day:{type:"string"}},aggregations:{skipIntervals:{type:"sap.gantt.skipTime.SkipInterval",multiple:true,singularName:"skipInterval"}}}});e.prototype._getFormattedSkipIntervals=function(){return this.getSkipIntervals().map(function(t){return t._getFormattedTime()})};return e});
//# sourceMappingURL=DayInterval.js.map
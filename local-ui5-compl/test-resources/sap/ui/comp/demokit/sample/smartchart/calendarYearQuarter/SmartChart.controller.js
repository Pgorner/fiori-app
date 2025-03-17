sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartchart.calendarYearQuarter.SmartChart", {

		onInit: function() {

			// set max height for categoryAxis in order to allow longer labels being fully displayed
			var oSmartChart = this.getView().byId("smartChartCalendarYearQuarter");

			oSmartChart.attachInitialized(function(oControlEvent) {
				var sIgnoredChartTypes = "bar, bubble, bullet, line, pie, donut, heatmap, " +
					"vertical_bullet, stacked_bar, stacked_column, 100_stacked_bar, " +
					"100_stacked_column, waterfall, horizontal_waterfall";

				oSmartChart.setIgnoredChartTypes(sIgnoredChartTypes);
				oSmartChart.getChartAsync().then(function(oInnerChart) {
					oInnerChart.setVizProperties({
						categoryAxis: {
							layout:{
								maxHeight:0.8
							}
						}
					});
				});
			}, this);
		}
	});
});

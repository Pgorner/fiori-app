(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			sap.ui.require([
				"sap/m/Shell",
				"sap/ui/core/ComponentContainer"
			], function (Shell, ComponentContainer) {

				// initialize the UI component
				new ComponentContainer("CompCont1", {
					height: "100%",
					width: "100%",
					name: "applicationUnderTest.smartchart_Timezone_UTC",
					settings: {
						id: "SmartChartTimezoneComponent"
					},
					async: true
				}).placeAt("content");
			});
		});
	});
})();

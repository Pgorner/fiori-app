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
					name: "applicationUnderTest.smartfilterbar_AdaptFilterRearrange",
					settings: {
						id: "Comp1"
					},
					async: true
				}).placeAt("target1");
			});
		});
	});
})();

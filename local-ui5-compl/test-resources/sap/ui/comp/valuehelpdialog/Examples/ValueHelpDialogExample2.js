(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function (Core) {

		Core.ready(function () {
			sap.ui.require([
				"sap/m/Shell",
				"sap/ui/core/ComponentContainer"

			], function (Shell, ComponentContainer) {

				// initialize the UI component
				new Shell("myShell", {
					app: new ComponentContainer({
						height: "100%",
						name: "sap.ui.comp.sample.valuehelpdialog.example.2",
						settings: {
							id: "myComponent"
						}
					})
				}).placeAt("content");
			});
		});
	});
})();


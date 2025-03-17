(function () {
	"use strict";

	sap.ui.require([
		"sap/m/Shell",
		"sap/ui/core/Component",
		"sap/ui/core/ComponentContainer",
		"sap/ui/core/Core"
	], function (Shell, Component, ComponentContainer, Core) {
		// initialize the UI component
		Core.ready().then(async () => {
			const oComponent = await Component.create({
				name: "sap.ui.demoapps.rta.freestyle",
				id : "freestyle",
				componentData: {
					"showAdaptButton" : true
				}
			});
			new Shell({
				app: new ComponentContainer({
					height: "100%",
					component: oComponent
				})
			}).placeAt("content");
		});
	});
})();
sap.ui.require([
	"sap/m/Shell",
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/util/MockServer",
	'sap/ui/core/Component'
], function (Shell, ComponentContainer, MockServer, Component) {
	"use strict";

	// Start Mockserver
	var oMockServer = new MockServer({
		rootUri: "/my/mock/data/"
	});
	oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
	oMockServer.start();

	Component.create({
		name: "test.sap.ui.comp.smartchart.exampleFilterbar",
		id: "myComponent"
	}).then(function(oCOmponent){
		// initialize the UI component
		new Shell("myShell", {
			app: new ComponentContainer({
				height: "100%",
				component: oCOmponent
			})
		}).placeAt("content");
	});

});

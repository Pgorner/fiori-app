sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ZoomTo",
	"colladaLoader/thirdparty/ColladaLoader"
], function(
	MessageToast,
	Controller,
	ContentConnector,
	ZoomTo,
	ColladaLoaderLib
) {
	"use strict";

	return Controller.extend("colladaLoader.controller.App", {

		onInit: function() {
			var colladaLoader = function(parentNode, contentResource) {
				return new Promise(function(resolve, reject) {
					var loader = new ColladaLoaderLib.ColladaLoader();
					loader.load(contentResource.getSource(),
						function(collada) { // onload
							parentNode.add(collada.scene);
							resolve({
								node: parentNode,
								contentResource: contentResource
							});
						},
						null,  // onprogress
						reject // onfail
					);
				});
			};

			ContentConnector.addContentManagerResolver({
				pattern: "dae",
				dimension: 3,
				contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
				settings: {
					loader: colladaLoader
				}
			});

			var viewer = this.getView().byId("viewer");
			viewer.attachSceneLoadingSucceeded(function() {
				viewer.getViewport().zoomTo([ZoomTo.Visible, ZoomTo.ViewRight], null, 0);
			});
		}
	});
});

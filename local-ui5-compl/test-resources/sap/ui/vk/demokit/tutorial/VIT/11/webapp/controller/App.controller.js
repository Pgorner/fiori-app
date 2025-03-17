sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/Annotation",
	"sap/ui/vk/AnnotationStyle"
], function(Controller, ContentResource, ContentConnector, ViewStateManager, Annotation, AnnotationStyle) {
	"use strict";

	return Controller.extend("annotations.controller.App", {

		onInit: function() {
			var view = this.getView();
			var oViewport = view.byId("viewport");

			// Constructor for a new content resource. Provides an object that owns content resources, tracks changes, loads and destroys
			// content built from the content resource.
			var contentResource = new ContentResource({
				// specifying the resource to load
				source: "models/annotationDemo.vds",
				sourceType: "vds4",
				sourceId: "abc123"
			});

			// Constructor for a new content connector
			var contentConnector = new ContentConnector({
				contentChangesFinished: function(event) {
					if (event.getParameter("content") !== null) {
						var scene = event.getParameter("content");
						var nodeHierarchy = scene.getDefaultNodeHierarchy();

						var styles = [AnnotationStyle.Explode, AnnotationStyle.Random, AnnotationStyle.Square, AnnotationStyle.Default];

						// Find objects by their names
						var shapes = nodeHierarchy.findNodesByName({ "value": ["Box", "Cone", "Sphere"] });
						for (var i = 0; i < shapes.length; i++) {
							var shape = shapes[i];

							// Create annotation node in scene tree
							nodeHierarchy.createNode(null, shape.name + " Annotation", null, "Annotation", {
								type: "html",
								style: styles[i],
								// Use 3D object's name as part of annotation's text
								text: { html: "I am a " + shape.name + " Annotation" },
								animate: true,
								leaderLines: [
									{
										start: {
											// Point annotation to the scene 3D object
											sid: scene.nodeRefToPersistentId(shape)
										}
									}
								]
							});
						}
					}

					// Get HTML annotations corresponding to scene tree annotation nodes
					var annotations = oViewport.getAnnotations();
					for (var j = 0; j < annotations.length; j++) {
						// Set size and position of HTML annotations.

						var annotation = annotations[j];

						// Height is in range 0.0..1.0 where 1.0 represents viewport's height
						annotation.setHeight(0.08);

						// Width is in range 0.0-1.0 where 1.0 represents viewport's width
						annotation.setWidth(0.13);

						// Viewport coordinate system is in range -0.5..+0.5 with zero in the middle.
						annotation.setXCoordinate(0.3 - j * 0.25);
						annotation.setYCoordinate(j * 0.1);
					}
				}
			});

			// Manages the visibility and the selection states of nodes in the scene.
			var viewStateManager = new ViewStateManager("vsmA", {
				contentConnector: contentConnector
			});

			// set content connector and viewStateManager for viewport
			oViewport.setContentConnector(contentConnector);
			oViewport.setViewStateManager(viewStateManager);

			view.addDependent(contentConnector).addDependent(viewStateManager);

			// set content connector and viewStateManager for scene tree
			var sceneTree = view.byId("scenetree");
			sceneTree.setContentConnector(contentConnector);
			sceneTree.setViewStateManager(viewStateManager);

			// Add resource to load to content connector
			contentConnector.addContentResource(contentResource);

		},

		onChangeText: function(event) {
			var view = this.getView();
			var oViewport = view.byId("viewport");
			var annotations = oViewport.getAnnotations();
			for (var k = 0; k < annotations.length; k++) {
				var annotation = annotations[k];
				var text = annotation.getText();
				var annotationText = ["I am a " + annotation.getName(), "Updated Text", "Another Update"];
				for (var t = 0; t < annotationText.length; t++) {
					if (annotationText[t] == text) {
						if (t == 2) {
							annotation.setText(annotationText[0]);
						} else {
							annotation.setText(annotationText[t + 1]);
						}
					}
				}
			}
		}
	});
});

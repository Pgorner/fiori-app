sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/vk/ContentResource"
], function(
	Controller,
	MessageBox,
	JSONModel,
	ContentResource
) {
	"use strict";

	return Controller.extend("viewportWithViewGallery.controller.App", {
		onInit: function() {
			var view = this.getView();

			view.setModel(new JSONModel({ viewIndex: 1 }));

			var contentConnector = view.byId("contentConnector");

			var contentResource = new ContentResource({
				source: "models/998.vds",
				sourceType: "vds4",
				sourceId: "abc123"
			});

			contentConnector.addContentResource(contentResource);
		},

		activateView: function() {
			var view = this.getView();

			// We use the view gallery to get the index of the selected view group. It is not needed
			// for view activation, as any view can be activated in any order. In this example we
			// only allow activation of views from the view group currently selected in the view
			// gallery.
			var viewGallery = view.byId("viewGallery");

			// We use the view manager to activate a view. The view gallery internally also uses the
			// view manager when a user clicks on a view tile.
			var viewManager = view.byId("viewManager");

			// We use content connector to access the scene.
			var contentConnector = view.byId("contentConnector");

			// We use the scene to access the view groups. We could access the views directly via
			// `scene.getViews()` if we are not interested in grouping views by view groups.
			var scene = contentConnector.getContent();

			var views;

			if (viewGallery != null) {
				// The views in the view group currently selected in the view gallery.
				views = scene.getViewGroups()[viewGallery.getSelectedViewGroupIndex()].getViews();
			} else {
				// All the views in the scene. This `else` branch is for demo purposes only. The
				// application can play any view disregarding if there is a view gallery or not.
				views = scene.getViews();
			}

			var viewIndex = view.getModel().getProperty("/viewIndex") - 1;
			if (viewIndex >= 0 && viewIndex < views.length) {
				// Activate the view.
				viewManager.activateView(views[viewIndex]);
			} else {
				var resourceBundle = view.getModel("i18n").getResourceBundle();
				MessageBox.error(resourceBundle.getText("viewIndexRangeMessage", views.length));
			}
		}
	});
});

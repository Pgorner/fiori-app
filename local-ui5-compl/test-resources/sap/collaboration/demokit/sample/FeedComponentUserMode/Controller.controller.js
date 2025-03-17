sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./mockserver/MockServerInitializer",
	"sap/collaboration/library"
], function(Controller, MockServerInitializer, collaborationLibrary) {
	"use strict";

	// shortcut for sap.collaboration.FeedType
	var FeedType = collaborationLibrary.FeedType;

	return Controller.extend("sap.collaboration.sample.FeedComponentUserMode.Controller", {

		_oFeedComponent: null,

		/**
		 * This method is call as many times as subclasses are initialized. It's
		 * important to initialize static methods only once.
		 */
		onInit: function() {
			var oMockServerInitializer = new MockServerInitializer();
			oMockServerInitializer.initializeMockServers(["jam", "smi"]);

			// Set group feed settings for User mode
			var oSettings = {
				feedSources : {
					mode: FeedType.UserGroups,
				}
			};

			// Create group feed component
			this.getOwnerComponent().createComponent({
				usage: "feedComponent",
				id: "feed_component_user",
				settings: oSettings
			}).then(function(oFeedComponent) {

				this._oFeedComponent = oFeedComponent;
				oMockServerInitializer.initializeMockData(this._oFeedComponent);

				// Add group feed component to container
				this.getView()._FeedComponentContainer.setComponent(this._oFeedComponent);
				this.getView()._FeedComponentContainer.setHeight("800px");
			}.bind(this));
		}
	});
});

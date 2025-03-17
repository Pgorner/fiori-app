sap.ui.define([
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/mvc/View"
], function(ComponentContainer, View) {
	"use strict";

	return View.extend("sap.collaboration.sample.SocialTimelineComponent.View", {
		_socialTimelineComponentContainer: null,
		getControllerName: function() {
			return "sap.collaboration.sample.SocialTimelineComponent.Controller";
		},
		createContent: function() {
			return [(this._socialTimelineComponentContainer =  (new ComponentContainer()).setHeight("100%"))];
		}
	});
});

sap.ui.define([
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/mvc/View"
], function(ComponentContainer, View) {
	"use strict";

	return View.extend("sap.collaboration.sample.FeedComponentBOMode.View", {
		_FeedComponentContainer: null,
		getControllerName: function() {
			return "sap.collaboration.sample.FeedComponentBOMode.Controller";
		},
		createContent: function() {
			return [(this._FeedComponentContainer =  (new ComponentContainer()).setHeight("100%"))];
		}
	});
});

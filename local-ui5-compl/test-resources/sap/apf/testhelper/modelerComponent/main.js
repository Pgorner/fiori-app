sap.ui.define([
	"sap/apf/testhelper/helper",
	"sap/m/Shell",
	"sap/ui/core/ComponentContainer"
], function(helper, Shell, ComponentContainer) {
	"use strict";

	helper.injectURLParameters({"sap-client":"120"});
	new Shell({
		app : new ComponentContainer({
			name : "sap.apf.testhelper.modelerComponent"
		})
	}).placeAt("content");
});

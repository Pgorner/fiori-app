sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
	"use strict";

	return new JSONModel({
		selectedKey: "overview",
		topic: "Introduction",
		target: "overview",
		navigation: [
			{
				title: "Overview",
				icon: "sap-icon://home",
				key: "introduction"
			}
		]
	});
});

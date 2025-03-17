sap.ui.define([], function () {
	"use strict";
	var aMockData = [];
	for (var i = 0; i < 50; i++) {
		aMockData.push({
			KeyProp: "Value" + i,
			Description: "Description for Value" + i
		});
	}
	return aMockData;
});

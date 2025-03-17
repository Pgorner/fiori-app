sap.ui.define([
	"sap/ui/demoapps/rta/fe/test/integration/AllJourneys"
], function() {
	"use strict";

	var oUriParameters = new URLSearchParams(window.location.search);
	var sJourney = oUriParameters.get("journey");
	var data = ["RTAJourney", "IFrameJourney"].filter(function (name) {
		return !sJourney || sJourney === name;
	});

	var aJourneys = data.map(function (name) {
		return "sap/ui/demoapps/rta/fe/test/integration/" + name;
	});

	return new Promise(function (resolve, reject) {
		sap.ui.require(aJourneys, resolve, reject);
	});
});

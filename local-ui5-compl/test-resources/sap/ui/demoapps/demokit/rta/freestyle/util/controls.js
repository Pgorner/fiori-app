sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/syncStyleClass"
], function(Device, syncStyleClass) {
	"use strict";

	// class providing static utility methods for dealing with controls.

	// the density class that should be set according to the environment (may be "")
	var sContentDensityClass = (function() {
		var sCozyClass = "sapUiSizeCozy",
			sCompactClass = "sapUiSizeCompact";
		if (document.body.classList.contains(sCozyClass) || document.body.classList.contains(sCompactClass)) { // density class is already set by the FLP
			return "";
		} else {
			return Device.support.touch ? sCozyClass : sCompactClass;
		}
	}());

	return {
		// provide the density class that should be used according to the environment (may be "")
		getContentDensityClass: function() {
			return sContentDensityClass;
		},

		// defines a dependency from oControl to oView
		attachControlToView: function(oView, oControl) {
			syncStyleClass(sContentDensityClass, oView, oControl);
			oView.addDependent(oControl);
		}
	};
});
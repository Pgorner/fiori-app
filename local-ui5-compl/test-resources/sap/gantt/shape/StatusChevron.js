sap.ui.define(["sap/gantt/shape/ext/Chevron",
"sap/ui/core/Element"], function (Chevron, Element) {
	"use strict";
	var StatusChevron = Chevron.extend("sap.gantt.test.shape.StatusChevron", {});

	StatusChevron.prototype.getFill = function(oRawData, oRowData) {
		var sStatus = oRowData.data.status;
		if (sStatus == "completed") {
			return Element.getElementById("gradient_green").getRefString();
		} else if (sStatus == "released") {
			return Element.getElementById("gradient_blue").getRefString();
		} else {
			return Chevron.prototype.getFill.apply(this, arguments);
		}
	};

	return StatusChevron;
}, true);

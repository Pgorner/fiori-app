/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/Element'],
	function(Element) {
	"use strict";

	var YAxisControlThresholdData = Element.extend("sap.YAxisControl.YAxisControlThresholdData", {
		metadata : {
			library: "sap.YAxisControl",
			properties: {
				/**
				 *Label of the Threshold.
				*/
				label: {type: "string", group: "Misc", defaultValue: ""},
				/**
				 * Value of the Threshold.
				 */
				value: {type: "float", group: "Misc", defaultValue: "0"}
			}
		}
	});

	return YAxisControlThresholdData;

});

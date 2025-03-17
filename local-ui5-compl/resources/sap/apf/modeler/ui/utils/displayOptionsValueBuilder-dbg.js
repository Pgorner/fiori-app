/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/textManipulator",
	"sap/apf/utils/exportToGlobal"
], function(oTextManipulator, exportToGlobal) {
	"use strict";
	/**
	 * @class
	 * @alias sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder
	 */
	function DisplayOptionsValueBuilder(oTextReader, oOptionsValueModelBuilder) {
		this.oTextReader = oTextReader;
		this.oOptionsValueModelBuilder = oOptionsValueModelBuilder;
	}
	DisplayOptionsValueBuilder.prototype.constructor = DisplayOptionsValueBuilder;
	DisplayOptionsValueBuilder.prototype.getLabelDisplayOptions = function() {
		var aLabelDisplayOptionTypes = [ {
			key : "key",
			name : this.oTextReader("key")
		}, {
			key : "text",
			name : this.oTextReader("text")
		}, {
			key : "keyAndText",
			name : this.oTextReader("keyAndText")
		} ];
		return this.oOptionsValueModelBuilder.prepareModel(aLabelDisplayOptionTypes, aLabelDisplayOptionTypes.length);
	};
	DisplayOptionsValueBuilder.prototype.getMeasureDisplayOptions = function() {
		var aMeasureDisplayOptionTypes = [ {
			key : "line",
			name : this.oTextReader("line")
		}, {
			key : "bar",
			name : this.oTextReader("column")
		}];
		return this.oOptionsValueModelBuilder.prepareModel(aMeasureDisplayOptionTypes, aMeasureDisplayOptionTypes.length);
	};
	DisplayOptionsValueBuilder.prototype.getValidatedLabelDisplayOptions = function() {
		var aLabelDisplayOptionTypes = [ {
			key : "key",
			name : this.oTextReader("key")
		}, {
			key : oTextManipulator.addPrefixText([ "text" ], this.oTextReader)[0],
			name : oTextManipulator.addPrefixText([ this.oTextReader("text") ], this.oTextReader)[0]
		}, {
			key : oTextManipulator.addPrefixText([ "keyAndText" ], this.oTextReader)[0],
			name : oTextManipulator.addPrefixText([ this.oTextReader("keyAndText") ], this.oTextReader)[0]
		} ];
		return this.oOptionsValueModelBuilder.prepareModel(aLabelDisplayOptionTypes, aLabelDisplayOptionTypes.length);
	};

	// compatiblity export as the global name and the module name differ
	exportToGlobal("sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder", DisplayOptionsValueBuilder);

	return DisplayOptionsValueBuilder;
});

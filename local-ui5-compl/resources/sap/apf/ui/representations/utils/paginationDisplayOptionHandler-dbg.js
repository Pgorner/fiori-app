/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/* global sap */
sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/ui/representations/utils/displayOptionHandler",
	"sap/apf/utils/exportToGlobal",
	"sap/apf/utils/utils",
	"sap/apf/core/metadataProperty"
], function(coreConstants, displayOptionHandler, exportToGlobal, utils, MetadataProperty) {
	"use strict";
	function PaginationDisplayOptionHandler() {
		this.oKeyTextForProperties = {};
		this.oDisplayValueForProperties = {};
	}
	/**
	 * @description creates a lookup for the filters in table and treetable.
	 * @param sKeyValue - Value of the key property
	 * @param sTextPropertyValue - Text value of the key property
	 * @param sKeyDisplayValue (optional) - Display value of the key property (for treeTable where the key for filtering is not the displayed key)
	 * These representations might not load all the data response at once, hence the lookup is created whenever the data response comes.
	**/
	PaginationDisplayOptionHandler.prototype.createDisplayValueLookupForPaginatedFilter = function(sKeyValue, sTextPropertyValue, sKeyDisplayValue) {
		this.oKeyTextForProperties[sKeyValue] = sTextPropertyValue;
		if(sKeyDisplayValue) {
			this.oDisplayValueForProperties[sKeyValue] = sKeyDisplayValue;
		}
	};
	/**
	 * @param  sPropertyKey - filter propertyvalue 
	 * @param oRequiredFilteroptions - display option for filter
	 * @param sRequiredFilter - filter property
	 * @param oFormatter - formatter instance
	 * @param {sap.apf.core.EntityTypeMetadata} metadata
	 * @description based on the display option(key/text/keyAndText) it generates the display name which is used by selection pop up dialog to display the selected filters. 
	 * This is used for for table and treetable in case of the values, coming from pagination(table)/expansion(tree table).
	 * @returns sSelectionDisplayText -  filter display name.
	**/
	PaginationDisplayOptionHandler.prototype.getDisplayNameForPaginatedFilter = function(sPropertyKey, oRequiredFilteroptions, sRequiredFilter, oFormatter, metadata) {
		var sSelectionDisplayText = sPropertyKey, oValueToBeFormatted;
		var propertyMetadata = new MetadataProperty.constructor(metadata.getPropertyMetadata(sRequiredFilter));
		if(this.oDisplayValueForProperties[sPropertyKey]){
			sSelectionDisplayText = this.oDisplayValueForProperties[sPropertyKey];
		}
		if (oRequiredFilteroptions && oRequiredFilteroptions.labelDisplayOption) {
			if (oRequiredFilteroptions.labelDisplayOption === coreConstants.representationMetadata.labelDisplayOptions.TEXT && this.oKeyTextForProperties[sPropertyKey]) {
				return this.oKeyTextForProperties[sPropertyKey];
			} else if (oRequiredFilteroptions.labelDisplayOption === coreConstants.representationMetadata.labelDisplayOptions.KEY_AND_TEXT && this.oKeyTextForProperties[sPropertyKey]) {
				oValueToBeFormatted = {
					key : utils.convertToExternalFormat(sSelectionDisplayText, propertyMetadata),
					text : this.oKeyTextForProperties[sPropertyKey]
				};
				return oFormatter.getFormattedValueForTextProperty(sRequiredFilter, oValueToBeFormatted);
			}
		} 
		return utils.convertToExternalFormat(sSelectionDisplayText, propertyMetadata);
	};

	// compatiblity export as the global name and the module name differ
	exportToGlobal("sap.apf.ui.representations.utils.PaginationDisplayOptionHandler", PaginationDisplayOptionHandler);

	return PaginationDisplayOptionHandler;
});

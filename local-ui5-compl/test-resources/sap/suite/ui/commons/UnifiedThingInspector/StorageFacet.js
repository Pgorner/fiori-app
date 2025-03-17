/* eslint-disable */
sap.ui.define([
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities"
], function(FacetOverview, Utilities){
	var oStorageFacet = new FacetOverview("facet-storage-location", {
		title: "Storage Location View - DC Germany South",
		heightType: Utilities.isPhone ? "Auto" : "XS"
	});

	return {
		oStorageFacet
	};
});
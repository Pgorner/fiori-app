/* eslint-disable */
sap.ui.define([
	"sap/ui/vbm/VBI",
	"sap/suite/ui/commons/FacetOverview",
	"sap/m/Page"
], function(VBI, FacetOverview, Page){

	'use strict';

	var oVBI1 = new VBI("vizBizMap", {
		width: "100%",
		height: "100%"
	});
	
	var ovizBizMapFacet = function(oUTI){
		return new FacetOverview("vizBiz-facet", {
			title: "Relevant Addresses",
			content: oVBI1,
			heightType: "L",
			press: function() {
				var oVBIDetail = new VBI("vizBizDetailMap", {
					width: "100%",
					height: "100%"
				});
		
				$.getJSON("UnifiedThingInspector/main2.json", function(dat) {
					oVBIDetail.load(dat);
				});
		
				var oMapPage = new Page({
					title: "Article",
					enableScrolling: false,
					showNavButton: true,
					content: oVBIDetail
				});
		
				oUTI.navigateToPage(oMapPage, false);
			}
		});
	}
	
	var dat = $.getJSON("UnifiedThingInspector/main.json", function(dat) {
		oVBI1.load(dat);
	});

	return {
		ovizBizMapFacet,
		dat
	};
});
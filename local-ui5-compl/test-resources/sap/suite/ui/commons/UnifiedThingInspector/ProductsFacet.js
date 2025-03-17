/* eslint-disable */
sap.ui.define([
	"sap/m/Image",
	"sap/suite/ui/commons/FacetOverview",
	"sap/m/HBox",
	"./Utilities"
], function(Image, FacetOverview, HBox, Utilities) {
	'use strict';

	var oProductsContent = new HBox("products-box", {
		items: [
			new Image({
				src: "images/strawberry1.jpg",
				width: "64px",
				height: "64px"
			}).addStyleClass("sapUtiTileImagePadding"),
			new Image({
				src: "images/strawberry2.jpg",
				width: "64px",
				height: "64px"
			}).addStyleClass("sapUtiTileImagePadding"),
			new Image({
				src: "images/strawberry3.jpg",
				width: "64px",
				height: "64px"
			}).addStyleClass("sapUtiTileImagePadding")
		]
	});
	
	if (!Utilities.isPhone) {
		oProductsContent.addItem(new Image({
			src: "images/strawberry4.jpg",
			width: "64px",
			height: "64px"
		}).addStyleClass("sapUtiTileImagePadding"));
	
		oProductsContent.addItem(new Image({
			src: "images/strawberry5.jpg",
			width: "64px",
			height: "64px"
		}).addStyleClass("sapUtiTileImagePadding"));
	}
	
	var oProductsFacet = new FacetOverview("products-facet", {
		title: "Products",
		quantity: 5,
		content: oProductsContent,
		height: Utilities.isPhone ? "8rem" : "10rem"
	});

	return {
		oProductsFacet
	};
});

/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/m/library',
	'sap/m/Popover',
	'sap/ui/core/mvc/View',
	'sap/ui/layout/VerticalLayout'
], function(mobileLibrary, Popover, View, VerticalLayout) {
	"use strict";

	var PlacementType = mobileLibrary.PlacementType;

	/**
	 * Layout holds title of Analysis Path, saved path name, Toolbar and Carousel
	 * @class AnalysisPath view
	 * @name sap.apf.ui.reuse.view.analysisPath
	 */
	return View.extend("sap.apf.ui.reuse.view.analysisPath", /** @lends sap.apf.ui.reuse.view.analysisPath.prototype */ {
		/**
		 * @returns {sap.apf.ui.reuse.view.carousel}
		 *  KLS why no returns directive in the JSDOC. I also would propose to rename to getCarouselView TODO
		 */
		getCarouselView : function() {
			return this.oCarousel;
		},
		/**
		 * @returns {sap.apf.ui.reuse.view.toolbar}
		 */
		getToolbar : function() {
			return this.oActionListItem;
		},
		/**
		 */
		getPathGallery : function() {
			return this.pathGallery;
		},
		/**
		 */
		getPathGalleryWithDeleteMode : function() {
			return this.deleteAnalysisPath;
		},
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.analysisPath";
		},
		createContent : function(oController) {
			var self = this;
			this.oController = oController;
			this.oActionListPopover = new Popover({
				id : this.createId("idAnalysisPathMenuPopOver"),
				showHeader : false,
				placement : PlacementType.Bottom,
				contentWidth : "165px"
			});
			var oViewData = this.getViewData();
			self.oCoreApi = oViewData.oCoreApi;
			self.oUiApi = oViewData.uiApi;
			this.oActionListItem = self.oUiApi.getToolbar().addStyleClass("toolbarView");
			this.oCarousel = self.oUiApi.createCarouselSingleton();
			this.oCarousel.getViewData().analysisPath = self;
			this.pathGallery = self.oUiApi.getPathGallery();
			this.deleteAnalysisPath = self.oUiApi.getDeleteAnalysisPath();
			this.oAnalysisPath = new VerticalLayout({
				content : [ self.oContentTitle, self.oCarousel  ],
				width : '100%'
			});
			return this.oAnalysisPath;
		}
	});
});

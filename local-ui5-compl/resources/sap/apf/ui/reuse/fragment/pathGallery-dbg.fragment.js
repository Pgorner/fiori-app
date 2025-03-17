/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/m/Bar",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/NavContainer",
	"sap/m/Page",
	"sap/m/SearchField",
	"sap/m/StandardListItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/thirdparty/jquery"
],function(
	Bar,
	Button,
	Dialog,
	List,
	NavContainer,
	Page,
	SearchField,
	StandardListItem,
	Filter,
	FilterOperator,
	jQuery
) {
	"use strict";

	/**
	 * Holds the saved paths and displays them in a dialog using js fragment.
	 *
	 * @namespace
	 * @name sap.apf.ui.reuse.fragment.pathGallery
	 */
	return {
		createContent : function(oController) {
			var self = this;
			this.contentWidth = jQuery(window).height() * 0.6 + "px"; // height and width for the dialog relative to the window
			this.contentHeight = jQuery(window).height() * 0.6 + "px";
			this.oCoreApi = oController.oCoreApi;
			this.oUiApi = oController.oUiApi;
			var onLiveChangeInSearchField = function(oEvent) {
				var aListItemFilters = [];
				var sSerachElement = oEvent.getSource().getValue();
				var oListForFiltering = self.pathGalleryHierarchicalDialog.getContent()[0].getCurrentPage().getContent()[0];//get the current page and the list in it
				if (sSerachElement && sSerachElement.length > 0) {
					var oFilter = new Filter("title", FilterOperator.Contains, sSerachElement);
					aListItemFilters.push(oFilter);
				}
				var currentListBinding = oListForFiltering.getBinding("items");// update list binding
				currentListBinding.filter(aListItemFilters);
			};
			var pathGalleryStepList = new List().bindItems({
				path : 'StructuredAnalysisPath/steps',
				template : new StandardListItem({
					title : '{title}',
					tooltip : '{title}',
					type : "Active",
					icon : '{imgSrc}',
					press : function(oEvent) {
						self.oUiApi.getLayoutView().setBusy(true);
						var eventBindingContext = oEvent.getSource().getBindingContext().sPath.split('/');
						var pathName = this.getModel().getData().GalleryElements[eventBindingContext[2]].AnalysisPathName;
						var analysisPath = this.getModel().getData().GalleryElements[eventBindingContext[2]].AnalysisPath;
						var activeStepindex = eventBindingContext[5];
						oController.openPath(pathName, analysisPath, activeStepindex);
						self.oUiApi.getLayoutView().setBusy(false);
					}
				})
			});
			var pathGalleryStepPage = new Page({
				subHeader : new Bar({
					contentLeft : [ new SearchField({
						liveChange : onLiveChangeInSearchField
					}) ]
				}),
				content : pathGalleryStepList,
				showNavButton : true,
				navButtonPress : function() {
					self.oPathGalleryNavContainer.back();
				}
			});
			var pathGalleryPathNamelist = new List().bindItems({
				path : '/GalleryElements',
				template : new StandardListItem({
					title : '{title}',
					tooltip : '{title}',
					description : '{description}',
					type : "Navigation",
					press : function(evt) {
						var oBindingContext = evt.getSource().getBindingContext(); // evt.getSource() is the ListItem
						pathGalleryStepPage.setBindingContext(oBindingContext); //set the data context to the page to which navigation has to happen
						pathGalleryStepPage.setTitle(evt.getSource().getTitle());//set the title of step page as the selected path
						self.oPathGalleryNavContainer.to(self.oPathGalleryNavContainer.getPages()[1]);// navigate to the representation page
					}
				})
			});
			var pathGalleryPathNamePage = new Page({
				title : self.oCoreApi.getTextNotHtmlEncoded("select-analysis-path"),
				subHeader : new Bar({
					contentLeft : [ new SearchField({
						liveChange : onLiveChangeInSearchField
					}) ]
				}),
				content : pathGalleryPathNamelist
			});
			this.oPathGalleryNavContainer = new NavContainer({
				pages : [ pathGalleryPathNamePage, pathGalleryStepPage ]
			});
			this.oPathGalleryNavContainer.setModel(oController.getView().getModel()); // set the model to the App; it will be propagated to the children
			self.pathGalleryHierarchicalDialog = new Dialog({ // path gallery
				contentWidth : self.contentWidth,
				contentHeight : self.contentHeight,
				showHeader : false,
				content : [ this.oPathGalleryNavContainer ],
				endButton : new Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("cancel"),
					press : function() {
						self.pathGalleryHierarchicalDialog.close();
					}
				}),
				afterClose : function() {
					self.pathGalleryHierarchicalDialog.destroy();
				}
			});
			return this.pathGalleryHierarchicalDialog;
		}
	};
});

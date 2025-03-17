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
], function(
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
	'use strict';

	/**
	 * Holds the available steps of configuration and displays them in a dialog using js fragment.
	 *
	 * @namespace
	 * @name sap.apf.ui.reuse.fragment.stepGallery
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
				var oListForFiltering = self.oStepGalleryHierarchicalDialog.getContent()[0].getCurrentPage().getContent()[0];//get the current page and the list in it
				if (sSerachElement && sSerachElement.length > 0) {
					var oFilter = new Filter("title", FilterOperator.Contains, sSerachElement);
					aListItemFilters.push(oFilter);
				}
				var currentListBinding = oListForFiltering.getBinding("items");// update list binding
				currentListBinding.filter(aListItemFilters);
			};
			var onRepresentationPress = function(oEvent) {
				self.oUiApi.getLayoutView().setBusy(true);
				var eventBindingContext = oEvent.getSource().getBindingContext().sPath.split('/');
				var categoryIndex = eventBindingContext[2];
				var stepIndex = eventBindingContext[4];
				var representationIndex = eventBindingContext[6];
				var stepDetails = oController.getStepDetails(categoryIndex, stepIndex);
				oController.onStepPress(stepDetails.id, stepDetails.representationtypes[representationIndex].representationId);
			};
			var stepGalleryRepresentationList = new List().bindItems({
				path : 'representationtypes',
				template : new StandardListItem({
					title : '{title}',
					icon : '{picture}',
					tooltip : '{title}',
					type : "Active",
					wrapping : true,
					press : onRepresentationPress
				}).bindProperty("description", "sortDescription", function(value) {
					var sSortByText = [];
					if (value === undefined || value === null) {
						return null;
					}
					sSortByText = value.length ? value.join(", ") : value;
					return self.oCoreApi.getTextNotHtmlEncoded("sortBy") + ": " + sSortByText;
				})
			});
			var stepGalleryRepresentationPage = new Page({
				id : this.createId("idStepGalleryRepresentationPage"),
				subHeader : new Bar({
					contentLeft : [ new SearchField({
						liveChange : onLiveChangeInSearchField
					}) ]
				}).addStyleClass("searchMargin"),
				content : stepGalleryRepresentationList,
				showNavButton : true,
				navButtonPress : function() {
					self.oStepGalleryNavContainer.back();
				}
			});
			var stepGalleryStepList = new List().bindItems({
				path : 'stepTemplates',
				template : new StandardListItem({
					title : '{title}',
					tooltip : '{title}',
					type : "Navigation",
					press : function(oEvent) {
						var oBindingContext = oEvent.getSource().getBindingContext(); // evt.getSource() is the ListItem
						stepGalleryRepresentationPage.setBindingContext(oBindingContext); //set the data context to the page to which navigation has to happen
						stepGalleryRepresentationPage.setTitle(oEvent.getSource().getTitle());//set the title of representation page as the selected step
						self.oStepGalleryNavContainer.to(self.oStepGalleryNavContainer.getPages()[2]);// navigate to the representation page
						/*if (Device.system.desktop) {
							var repItems = self.oStepGalleryNavContainer.getPages()[2].getContent()[0].getItems();
							repItems.forEach(function(oItem) {
								oItem.addStyleClass("repItem");
							});
						}*/
					}
				})
			});
			var stepGalleryStepPage = new Page({
				id : this.createId("idStepGalleryStepPage"),
				subHeader : new Bar({
					contentLeft : [ new SearchField({
						liveChange : onLiveChangeInSearchField
					}) ]
				}).addStyleClass("searchMargin"),
				content : stepGalleryStepList,
				showNavButton : true,
				navButtonPress : function() {
					self.oStepGalleryNavContainer.back();
				}
			});
			var stepGalleryCategoryList = new List().bindItems({
				path : '/GalleryElements',
				template : new StandardListItem({
					title : '{title}',
					tooltip : '{title}',
					type : "Navigation",
					press : function(oEvent) {
						var oBindingContext = oEvent.getSource().getBindingContext(); // evt.getSource() is the ListItem
						stepGalleryStepPage.setBindingContext(oBindingContext); //set the data context to the page to which navigation has to happen
						stepGalleryStepPage.setTitle(oEvent.getSource().getTitle()); //set the title of step page as the selected category
						self.oStepGalleryNavContainer.to(self.oStepGalleryNavContainer.getPages()[1]); // navigate to the step page
					}
				})
			});
			var stepGalleryCategoryPage = new Page({
				id : this.createId("idStepGalleryCategoryPage"),
				title : self.oCoreApi.getTextNotHtmlEncoded("category"),
				tooltip : self.oCoreApi.getTextNotHtmlEncoded("category"),
				subHeader : new Bar({
					contentLeft : [ new SearchField({
						liveChange : onLiveChangeInSearchField
					}) ]
				}).addStyleClass("searchMargin"),
				content : stepGalleryCategoryList
			});
			this.oStepGalleryNavContainer = new NavContainer({
				pages : [ stepGalleryCategoryPage, stepGalleryStepPage, stepGalleryRepresentationPage ]
			});
			this.oStepGalleryNavContainer.setModel(oController.getView().getModel()); // set the model to the App; it will be propagated to the children
			this.oStepGalleryHierarchicalDialog = new Dialog({ // step gallery
				contentWidth : self.contentWidth,
				contentHeight : self.contentHeight,
				showHeader : false,
				content : [ this.oStepGalleryNavContainer ],
				endButton : new Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("cancel"),
					press : function() {
						self.oStepGalleryHierarchicalDialog.close();
						self.oStepGalleryHierarchicalDialog.destroy();
					}
				}),
				afterClose : function() {
					self.oStepGalleryHierarchicalDialog.destroy();
				}
			});
			return this.oStepGalleryHierarchicalDialog;
		}
	};
});

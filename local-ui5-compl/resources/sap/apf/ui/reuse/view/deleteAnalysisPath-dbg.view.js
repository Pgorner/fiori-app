/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/library",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/ui/Device",
	"sap/ui/core/mvc/View",
	"sap/ui/thirdparty/jquery",
], function(
	Button,
	Dialog,
	mobileLibrary,
	List,
	StandardListItem,
	Device,
	View,
	jQuery
) {
	"use strict";
	var ListMode = mobileLibrary.ListMode;

	return View.extend("sap.apf.ui.reuse.view.deleteAnalysisPath", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.deleteAnalysisPath";
		},
		createContent : function(oController) {
			var contentWidth = jQuery(window).height() * 0.6 + "px"; // height and width for the dialog relative to the window
			var contentHeight = jQuery(window).height() * 0.6 + "px";
			this.oCoreApi = this.getViewData().oInject.oCoreApi;
			this.oUiApi = this.getViewData().oInject.uiApi;
			var self = this;
			var list = new List({
				mode : ListMode.Delete,
				items : {
					path : "/GalleryElements",
					template : new StandardListItem({
						title : "{AnalysisPathName}",
						description : "{description}",
						tooltip : "{AnalysisPathName}"
					})
				},
				"delete" : oController.handleDeleteOfDialog.bind(oController)
			});
			var oDialog = new Dialog({
				title : self.oCoreApi.getTextNotHtmlEncoded("delPath"),
				contentWidth : contentWidth,
				contentHeight : contentHeight,
				content : list,
				beginButton : new Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("close"),
					press : function() {
						oDialog.close();
						self.oUiApi.getLayoutView().setBusy(false);
					}
				}),
				afterClose : function() {
					self.destroy();
				}
			});
			if (Device.system.desktop) {
				this.addStyleClass("sapUiSizeCompact");
				oDialog.addStyleClass("sapUiSizeCompact");
			}
			return oDialog;
		}
	});
});

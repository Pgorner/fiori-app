/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
sap.ui.define([
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/library',
	'sap/m/Text',
	'sap/ui/Device',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Button, Dialog, mobileLibrary, Text, Device, BaseController, JSONModel) {
	"use strict";

	const DialogType = mobileLibrary.DialogType;

	/**
	 * Controller of view.deleteAnalysisPath
	 * @class deleteAnalysisPath controller
	 * @name sap.apf.ui.reuse.controller.deleteAnalysisPath
	 */
	return BaseController.extend("sap.apf.ui.reuse.controller.deleteAnalysisPath", /** @lends sap.apf.ui.reuse.controller.deleteAnalysisPath.prototype */ {
		/**
		 *@this {sap.apf.ui.reuse.controller.pathGallery}
		 */
		onInit : function() {
			this.oCoreApi = this.getView().getViewData().oInject.oCoreApi;
			this.oUiApi = this.getView().getViewData().oInject.uiApi;
			this.oSerializationMediator = this.getView().getViewData().oInject.oSerializationMediator;
		},
		/**
		 * Opens the path gallery with delete mode
		 */
		openPathGallery : function() {
			var pathGalleryModel = new JSONModel();
			pathGalleryModel.setData(this.getView().getViewData().jsonData);
			this.oDialog = this.getView().getContent()[0];
			this.oDialog.getContent()[0].setModel(pathGalleryModel);
			this.oDialog.setInitialFocus(this.oDialog);
			this.oDialog.open();
		},
		handleDeleteOfDialog : function(evt) {
			var sPathName = evt.getParameter("listItem").getProperty('title');
			var oListInfo = {
				item : evt.getParameter("listItem"),
				list : this.getView().getContent()[0].getContent()[0],
				guid : this.getGuidForPath(sPathName, this.getView().getViewData().jsonData.GalleryElements),
				sPathName : sPathName
			};
			this.openConfirmDelDialog(oListInfo);
		},
		/**
		 * Fetches guid for a path
		 */
		getGuidForPath : function(sPathName, viewData) {
			var i;
			for(i = 0; i < viewData.length; i++) {
				var oData = viewData[i];
				if (oData.AnalysisPathName === sPathName) {
					return oData.guid;
				}
			}
		},
		/**
		 * Deletes the section and path from path gallery.
		 */
		deleteSavedPath : function(sPathName, oInfo) {
			var self = this;
			var guid = oInfo.guid;
			var pathName = sPathName;
			var oMessageObject;
			var currentPath = self.oUiApi.getLayoutView().getController().oSavedPathName.getText();
			self.oSerializationMediator.deletePath(guid, function(oResponse, metaData, msgObj) {
				if (msgObj === undefined && (typeof oResponse === "object")) {
					oInfo.list.removeItem(oInfo.item);
					oInfo.list.rerender();
					self.oCoreApi.readPaths(function(oResponse, metaData, msgObj) {
						if (msgObj === undefined && (typeof oResponse === "object")) {
							var noOfPaths = oResponse.paths.length;
							//Text to be shown in galery when all paths are deleted
							if (noOfPaths === 0) {
								jQuery(".pathText").removeClass("pathTextDontShow");
								jQuery(".pathText").addClass("pathTextShow");
							}
						} else {
							oMessageObject = self.oCoreApi.createMessageObject({
								code : "6005",
								aParameters : [ pathName ]
							});
							oMessageObject.setPrevious(msgObj);
							self.oCoreApi.putMessage(oMessageObject);
						}
					});
				} else {
					oMessageObject = self.oCoreApi.createMessageObject({
						code : "6009",
						aParameters : [ pathName ]
					});
					oMessageObject.setPrevious(msgObj);
					self.oCoreApi.putMessage(oMessageObject);
				}
			});
			//If current path is deleted reset the analysis path
			if (self.oCoreApi.isDirty()) {
				currentPath = currentPath.substring(1);
			}
			if (currentPath === pathName) {
				self.oUiApi.getAnalysisPath().getToolbar().getController().resetAnalysisPath();
			}
		},
		/**
		 * Confirm dialog before deleting path
		 */
		openConfirmDelDialog : function(oListInfo) {
			var self = this;
			var pathName = oListInfo.sPathName;
			var textControl = new Text().addStyleClass("textStyle");
			textControl.setText(self.oCoreApi.getTextNotHtmlEncoded("do-you-want-to-delete-analysis-path", [ "'" + pathName + "'" ]));
			self.delConfirmDialog = new Dialog({
				type : DialogType.Standard,
				title : self.oCoreApi.getTextNotHtmlEncoded("delPath"),
				content : textControl,
				beginButton : new Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("yes"),
					type : "Emphasized",
					press : function() {
						self.deleteSavedPath(pathName, oListInfo);
						self.delConfirmDialog.close();
					}
				}),
				endButton : new Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("no"),
					press : function() {
						self.delConfirmDialog.close();
					}
				}),
				afterClose : function() {
					self.oUiApi.getLayoutView().setBusy(false);
					self.delConfirmDialog.destroy();
				}
			});
			if (Device.system.desktop) {
				self.delConfirmDialog.addStyleClass("sapUiSizeCompact");
			}
			self.delConfirmDialog.open();
		}
	});
});
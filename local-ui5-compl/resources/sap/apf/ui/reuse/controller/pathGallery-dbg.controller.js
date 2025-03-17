/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/utils/trace',
	'sap/ui/Device',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(trace, Device, Fragment, Controller, JSONModel) {
	'use strict';

	/**
	 * @class Controller of pathGallery view
	 * @name sap.apf.ui.reuse.controller.pathGallery
	 */
	return Controller.extend("sap.apf.ui.reuse.controller.pathGallery", /** @lends sap.apf.ui.reuse.controller.pathGallery.prototype */ {
		/**
		 * @this {sap.apf.ui.reuse.controller.pathGallery}
		 */
		onInit : function() {
			this.oCoreApi = this.getView().getViewData().oInject.oCoreApi;
			this.oUiApi = this.getView().getViewData().oInject.uiApi;
			this.oSerializationMediator = this.getView().getViewData().oInject.oSerializationMediator;
			if (Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
		},

		/**
		 * Opens the path gallery with list of all saved paths.
		 */
		openPathGallery : async function() {
			if (this.oDialog) {
				this.oDialog.destroy();
			}
			this.oDialog = await Fragment.load({
				type: "JS",
				name: "sap.apf.ui.reuse.fragment.pathGallery",
				controller: this
			});
			var oModel = new JSONModel();
			var jsonData = this.getPathGalleryData();
			oModel.setData(jsonData);
			this.oDialog.setModel(oModel);
			if (Device.system.desktop) {
				this.oDialog.addStyleClass("sapUiSizeCompact");
			}
			this.oDialog.setInitialFocus(this.oDialog);
			this.oDialog.open();
		},

		/**
		 * Gets data for building the path gallery.
		 */
		getPathGalleryData : function() {
			var self = this;
			var jsonData = this.getView().getViewData() ? this.getView().getViewData().jsonData : {};
			//Get the application Configuration data
			var fetchConfigData = function() {
				var configData = {
					"steps" : self.oCoreApi.getStepTemplates()
				};
				return configData;
			};
			//Inject Image and Title in json data
			if (jsonData.GalleryElements.length !== 0) {
				var savedPaths = jsonData.GalleryElements;
				var configData = fetchConfigData();
				var i, j, k, index;
				for(i = 0; i < savedPaths.length; i++) {
					for(j = 0; j < savedPaths[i].StructuredAnalysisPath.steps.length; j++) {
						for(k = 0; k < configData.steps.length; k++) {
							var stepId = savedPaths[i].StructuredAnalysisPath.steps[j].stepId;
							var selectedRepresentationId = savedPaths[i].StructuredAnalysisPath.steps[j].selectedRepresentationId;
							if (stepId === configData.steps[k].id) {
								for(index in configData.steps[k].getRepresentationInfo()) {
									if (selectedRepresentationId === configData.steps[k].getRepresentationInfo()[index].representationId) {
										jsonData.GalleryElements[i].StructuredAnalysisPath.steps[j].imgSrc = configData.steps[k].getRepresentationInfo()[index].picture;
										jsonData.GalleryElements[i].StructuredAnalysisPath.steps[j].title = self.oCoreApi.getTextNotHtmlEncoded(configData.steps[k].title.key);
									}
								}
							}
						}
					}
				}
			}
			return jsonData;
		},

		/**
		 * Opens a saved analysis path.
		 *
		 * Takes analysis path name, guid and step which has been clicked as parameters.
		 *
		 * @param {string} pathName
		 * @param {string} guid
		 * @param {int} activeStepindex
		 */
		openPath : function(pathName, guid, activeStepindex) {
			trace.log("pathGallery.openPath", ", ", activeStepindex, ", guid", guid, "***********************");
			var self = this;
			var oMessageObject;
			var carousel = self.oUiApi.getAnalysisPath().getCarouselView();
			this.oDialog.setBusy(true);
			this.oUiApi.getAnalysisPath().getCarouselView().oController.removeAllThumbnails();
			self.oSerializationMediator.openPath(guid, (function(self) {
				return function(oResponse, oEntityTypeMetadata, msgObj) {
					var layoutController = self.oUiApi.getLayoutView().getController();
					var analysisPathController = self.oUiApi.getAnalysisPath().getController();
					trace.log("pathGallery.openPath continuation", ", activeStepindex=", activeStepindex, ", guid=", guid);
					if (msgObj === undefined && (typeof oResponse === "object")) {
						analysisPathController.setIsOpenPath(true);
						self.oUiApi.contextChanged();
						//					self.oUiApi.getLayoutView().getController().setFilter(oResponse.path.SerializedAnalysisPath.context);
						analysisPathController.refresh(-1);
						self.oCoreApi.updatePath(analysisPathController.callBackForUpdatePath.bind(analysisPathController));
						self.oCoreApi.setDirtyState(false);
						layoutController.setPathTitle();
						if (self.oDialog !== undefined) {
							self.oDialog.close();
						}
						carousel.rerender();
						self.oUiApi.getLayoutView().setBusy(false);
					} else {
						oMessageObject = self.oCoreApi.createMessageObject({
							code : "6008",
							aParameters : [ pathName ]
						});
						oMessageObject.setPrevious(msgObj);
						self.oUiApi.getLayoutView().setBusy(false);
						self.oCoreApi.putMessage(oMessageObject);
					}
				};
			}(this)), activeStepindex);
		}
	});
});

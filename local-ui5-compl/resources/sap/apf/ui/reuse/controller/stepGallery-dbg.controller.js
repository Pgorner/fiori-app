/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/ui/utils/helper',
	'sap/apf/utils/trace',
	'sap/ui/Device',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(UiUtilsHelper, trace, Device, Fragment, Controller, JSONModel) {
	'use strict';

	function _createMessageText(oMessageObject) {
		var text = oMessageObject.getMessage();
		while (oMessageObject.getPrevious()) {
			oMessageObject = oMessageObject.getPrevious();
			text = text + '\n' + oMessageObject.getMessage();
		}
		return text;
	}

	/**
	 *@class controller for step Gallery view.
	 *@name sap.apf.ui.reuse.controller.stepGallery
	 */
	return Controller.extend("sap.apf.ui.reuse.controller.stepGallery", /** @lends sap.apf.ui.reuse.controller.stepGallery.prototype */ {
		/**
		 * Returns array needed to draw step gallery content.
		 * @returns {object} jsonData
		 */
		getGalleryElementsData : function() {
			var self = this;
			var aGalleryElements = [];
			var aCategories = this.oCoreApi.getCategories();
			var label = this.oCoreApi.getTextNotHtmlEncoded("label");
			var steps = this.oCoreApi.getTextNotHtmlEncoded("steps");
			var category = this.oCoreApi.getTextNotHtmlEncoded("category");
			var oMessageObject;
			if (aCategories.length === 0) {
				oMessageObject = this.oCoreApi.createMessageObject({
					code : "6001",
					aParameters : [ "Categories" ]
				});
				this.oCoreApi.putMessage(oMessageObject);
			}
			var i;
			for(i = 0; i < aCategories.length; i++) {
				var oGalleryElement = {};
				var oCategory = aCategories[i];
				var categoryName;
				if (!oCategory.label) {
					oMessageObject = this.oCoreApi.createMessageObject({
						code : "6002",
						aParameters : [ label, category + ": " + categoryName ]
					});
					this.oCoreApi.putMessage(oMessageObject);
				} else {
					categoryName = this.oCoreApi.getTextNotHtmlEncoded(oCategory.label);
					oGalleryElement.title = this.oCoreApi.getTextNotHtmlEncoded(oCategory.label);
				}
				oGalleryElement.id = oCategory.id;
				oGalleryElement.stepTemplates = [];
				oCategory.stepTemplates.forEach(function(oStepTemplate) {
					var oStepDetail = {};
					if (!oStepTemplate.title) {
						oMessageObject = self.oCoreApi.createMessageObject({
							code : "6003",
							aParameters : [ "Title" ]
						});
						self.oCoreApi.putMessage(oMessageObject);
					} else {
						oStepDetail.title = self.oCoreApi.getTextNotHtmlEncoded(oStepTemplate.title);
					}
					oStepDetail.id = oStepTemplate.id;
					oStepDetail.representationtypes = oStepTemplate.getRepresentationInfo();
					oStepDetail.representationtypes.forEach(function(oRepresentation) {
						oRepresentation.title = self.oCoreApi.getTextNotHtmlEncoded(oRepresentation.label);
						if (oRepresentation.parameter && oRepresentation.parameter.orderby) { //if orderby has a value then only get the sort description
							new UiUtilsHelper(self.oCoreApi).getRepresentationSortInfo(oRepresentation).done(function(representationSortDetail) {
								var aSortDescription = [];
								for(var i = 0; i < representationSortDetail.length; i++) {
									representationSortDetail[i].done(function(sSortDescription) {
										aSortDescription.push(sSortDescription);
									});
								}
								oRepresentation.sortDescription = aSortDescription;
							});
						}
					});
					oStepDetail.defaultRepresentationType = oStepDetail.representationtypes[0];
					oGalleryElement.stepTemplates.push(oStepDetail);
				});
				aGalleryElements.push(oGalleryElement);
			}
			var aStepTemplates = this.oCoreApi.getStepTemplates();
			if (aStepTemplates.length === 0) {
				oMessageObject = this.oCoreApi.createMessageObject({
					code : "6002",
					aParameters : [ steps, category ]
				});
				this.oCoreApi.putMessage(oMessageObject);
			}
			var jsonData = {
				GalleryElements : aGalleryElements
			};
			return jsonData;
		},

		/**
		 * Bind gallery elements data to step gallery view.
		 */
		onInit : function() {
			if (Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
			this.oCoreApi = this.getView().getViewData().oCoreApi;
			this.oUiApi = this.getView().getViewData().uiApi;
			var aGalleryElements = this.getGalleryElementsData().GalleryElements;
			var oModel = new JSONModel({
				"GalleryElements" : aGalleryElements
			});
			this.getView().setModel(oModel);
		},
		/**
		 * @param {string} index of the category in the binding of step gallery dialog
		 * @param {string} index of the step in the binding of step gallery dialog
		 * @returns {any} details of a step i.e. id, representationTypes etc.
		 */
		getStepDetails : function(categoryIndex, stepIndex) {
			var aGalleryElements = this.getGalleryElementsData().GalleryElements;
			var stepDetails = aGalleryElements[categoryIndex].stepTemplates[stepIndex];
			return stepDetails;
		},
		openHierarchicalSelectDialog : async function() {
			if (this.pHierchicalSelectDialog) {
				this.bAbortOpeningHierchicalSelectDialog = true;
				this.oHierchicalSelectDialog = await this.pHierchicalSelectDialog;
				this.pHierchicalSelectDialog = undefined;
			}
			if (this.oHierchicalSelectDialog) {
				this.oHierchicalSelectDialog.destroy();
				this.oHierchicalSelectDialog = undefined;
			}
			this.pHierchicalSelectDialog = Fragment.load({
				type: "JS",
				name: "sap.apf.ui.reuse.fragment.stepGallery",
				controller: this
			});
			this.bAbortOpeningHierchicalSelectDialog = false;
			this.oHierchicalSelectDialog = await this.pHierchicalSelectDialog;
			this.pHierchicalSelectDialog = undefined;
			if ( this.bAbortOpeningHierchicalSelectDialog ) {
				this.oHierchicalSelectDialog.destroy();
				this.oHierchicalSelectDialog = undefined;
				return;
			}
			this.oHierchicalSelectDialog.setModel(this.getView().getModel());
			if (Device.system.desktop) {
				this.oHierchicalSelectDialog.addStyleClass("sapUiSizeCompact");
			}
			this.oHierchicalSelectDialog.open();
		},
		/**
		 * Creates new step.
		 *
		 * @param {string} sId Id for step being added
		 * @param {object} oRepresentationType Representation
		 */
		onStepPress : function(sId, oRepresentationType) {
			trace.logCall("stepGallery.onStepPress -- adds an active step, id=", sId, " ************************************** ");
			var oController = this;
			var analysisPathController = oController.oUiApi.getAnalysisPath().getController();
			this.oCoreApi.checkAddStep(sId).done(function(bCanStepBeAdded, oMessageObject) {
				trace.log("onStepPress->continuation", ", bCanStepBeAdded", bCanStepBeAdded, " oRepresentationType=", oRepresentationType);
				if (bCanStepBeAdded) {
					oController.oHierchicalSelectDialog.close();
					oController.oCoreApi.createStep(sId,
						analysisPathController.callBackForUpdatePathAndSetLastStepAsActive.bind(analysisPathController),
						oRepresentationType);
					analysisPathController.refresh(-1);
				} else {
					var sMessageText = _createMessageText(oMessageObject);
					var oFragmentParameter = {
						oController : oController,
						sMessageText : sMessageText
					};
					oController.openAddStepCheckDialog(oFragmentParameter);
				}
			});
			var steps = this.oCoreApi.getSteps();
			var selectedRepr = (steps.length > 0) ? steps[steps.length-1].getSelectedRepresentation() : {};
				trace.logReturn("onStepPress", ", step id=", sId,
					", repr.apfId=" + (selectedRepr ? selectedRepr.apfId : "--"),
					", selectedRepr=", (selectedRepr) ? selectedRepr : "error: no step existing");
		},
		openAddStepCheckDialog: async function(oFragmentParameter) {
			const addStepCheckDialog = await Fragment.load({
				type: "JS",
				name: "sap.apf.ui.reuse.fragment.addStepCheckDialog",
				controller: oFragmentParameter
			});
			addStepCheckDialog.open();
			this.oUiApi.getLayoutView().setBusy(false);
		}
	});
});

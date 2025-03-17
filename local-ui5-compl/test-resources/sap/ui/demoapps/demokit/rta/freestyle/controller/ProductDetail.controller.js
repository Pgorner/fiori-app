sap.ui.define([
	"../util/controls",
	"../util/messages",
	"./BaseController",
	"./utilities",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/rta/api/startKeyUserAdaptation"
], function(
	controls,
	messages,
	BaseController,
	utilities,
	MessageToast,
	JSONModel,
	Fragment,
	startKeyUserAdaptation
) {
	"use strict";

	return BaseController.extend("sap.ui.demoapps.rta.freestyle.controller.ProductDetail", {
		onInit: function() {
			this.getApplication().registerDisplay(this);
			this._oViewModel = new JSONModel({
				dataLoaded: false,
				originalBusyDelay: this.getView().getBusyIndicatorDelay(),
				showsMessage: false
			});
			this.setModel(this._oViewModel, "displayView");
		},

		productChanged: function() {
			var sProductId = this.getApplicationProperties().getProperty("/productId"),
				sContextPath = this.getApplication().getODataHelper().getPathForDraft(sProductId, utilities.getNullUUID(), true);
			if (sContextPath !== this._sContextPath) {
				this._sContextPath = sContextPath;
				this._oBindingContext = null;
				this._bindView(sContextPath);
			} else {
				this.getApplication().resetAppBusy();
			}
		},

		// Bind the header and the items to the context path
		_bindView: function(sContextPath) {
			this._oViewModel.setProperty("/dataLoaded", false);
			var oView = this.getView(),
				fnOnElementBindingCompleted  = function(oEvent){
					this._oViewModel.setProperty("/dataLoaded", true);
				}.bind(this),
				fnOnElementBindingRequested = function(oEvent) {
					if (sContextPath !== this._sContextPath) {
						return;
					}
					var oApplicationProperties = this.getApplicationProperties();
					this.getApplication().resetAppBusy();
					//oApplicationProperties.setProperty("/isBusySaving", false);
					oApplicationProperties.setProperty("/detailImmediateBusy", false); // this property is only true for one turnaround
					this._oBindingContext = oEvent.getSource().getBoundContext();
					if (this._oBindingContext) {
						var oProduct = this._getProduct(),
							oAdminData = this._getAdminData();
						if (oAdminData && oAdminData.DraftIsCreatedByMe && this.getApplication().getODataHelper().isDraftIdValid(oAdminData
								.DraftUUID)) { // there exists a draft for that object
							var sDraftResumePath = this.getApplication().getODataHelper().getPathForDraft(oProduct.ProductForEdit,
								oAdminData.DraftUUID, false);
							if (utilities.isDraftClean(oAdminData)) {
								this._deleteDraftFromResume(sDraftResumePath, oAdminData.DraftUUID);
								return;
							}
							var oProductTextInOriginalLang = this._getTextData();
							this._oViewModel.setProperty("/resumeDraftQuestion", this.getResourceBundle().getText("ymsg.editDraft", [
								oProductTextInOriginalLang.Name,
								oAdminData.LastChangeDateTime
							]));
							if (!this._oResumeDraftDialog) {
								var fnResume = function() {
										var oApplication = this.getApplication();
										oApplication.editProductDraft(oProduct.ProductForEdit, oAdminData.DraftUUID);
										this._oResumeDraftDialog.close();
									}.bind(this),
									fnDiscard = function() {
										this._oResumeDraftDialog.close();
										this._deleteDraftFromResume(sDraftResumePath, oAdminData.DraftUUID, true);
									}.bind(this);
								Fragment.load({
									name: "sap.ui.demoapps.rta.freestyle.view.ResumeDraftDialog",
									controller : {
										onResume: fnResume,
										onDiscard: fnDiscard
									}
								}).then(function(oResumeDraftDialog) {
									this._oResumeDraftDialog = oResumeDraftDialog;
									controls.attachControlToView(oView, this._oResumeDraftDialog);
									this._oResumeDraftDialog.open();
								}.bind(this));
							} else {
								this._oResumeDraftDialog.open();
							}
						}
					} else {
						this.getApplication().navToEmptyPage(this.getResourceBundle().getText("ymsg.productNotAvailable"));
					}
				}.bind(this);
			oView.bindElement({
				path: sContextPath,
				events: {
					change: fnOnElementBindingCompleted,
					dataReceived: fnOnElementBindingRequested
				},
				parameters: this.getApplication().getODataHelper().getParametersForRead()
			});
		},

		_deleteDraftFromResume: function(sPath, sDraftUUID, bDirty) {
			this.getApplication().getODataHelper().deleteDraftFromResume(sPath, sDraftUUID, bDirty);
		},

		unbind: function() {
			this._sContextPath = null;
			this._oBindingContext = null;
			this.getView().unbindElement();
		},

		onImagePressed: function() {
			if (!this._oLargeImage) {
				Fragment.load({
					name: "sap.ui.demoapps.rta.freestyle.view.dialog.ProductImage",
					controller: {
						onImageOKPressed: function() {
							this._oLargeImage.close();
						}.bind(this),
						formatImageUrl: this.formatter.formatImageUrl
					}
				}).then(function(oLargeImage) {
					this._oLargeImage = oLargeImage;
					controls.attachControlToView(this.getView(), this._oLargeImage);
					this._oLargeImage.open();
				}.bind(this));
			} else {
				this._oLargeImage.open();
			}
		},

		onEdit: function() {
			MessageToast.show('Edit action');
		},

		onCopy: function() {
			MessageToast.show('Copy action');
		},

		onNavBack: function() {
			this.getApplication().navBack(true, false);
		},

		onDelete: function() {
			MessageToast.show('Delete action');
		},

		sendEmail: function() {
			var sProductId = this.getApplicationProperties().getProperty("/productId"),
				oProduct = this._getProduct(),
				oProductTextOriginalLanguage = oProduct ? this._oBindingContext.getObject("to_ProductTextInOriginalLang") : null,
				sProductName = oProductTextOriginalLanguage ? oProductTextOriginalLanguage.Name : sProductId,
				sProductDescription = oProductTextOriginalLanguage ? oProductTextOriginalLanguage.Description : "",
				oSupplier = this._oBindingContext.getObject("to_Supplier"),
				sSupplierName = oSupplier ? oSupplier.CompanyName : "";
			utilities.sendEmailForProduct(this.getResourceBundle(), sProductName, sProductId, sProductDescription, sSupplierName);
		},

		_getProduct: function() {
			return this._oBindingContext && this._oBindingContext.getObject();
		},

		_getAdminData: function() {
			return this._oBindingContext && this._oBindingContext.getObject("DraftAdministrativeData");
		},

		_getTextData: function() {
			return this._oBindingContext && this._oBindingContext.getObject("to_ProductTextInOriginalLang");
		},

		switchToAdaptionMode: function() {
			startKeyUserAdaptation({
				rootControl: this.getOwnerComponent()
			});
		},

		modifyFailed: function(aArgs) {
			this._oViewModel.setProperty("/showsMessage", true);
			messages.showErrorMessage(aArgs[0].response, this._oViewModel.setProperty.bind(this._oViewModel, "/showsMessage", false));
			this.getView().getElementBinding().refresh(true);
		}
	});
});

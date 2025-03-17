sap.ui.define([
	"sap/m/Popover",
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	"sap/ui/core/Element",
	"sap/ui/core/Fragment",
	"../util/controls"
], function(
	Popover,
	JSONModel,
	BaseController,
	Element,
	Fragment,
	controls
) {
	"use strict";

	return BaseController.extend("sap.ui.demoapps.rta.freestyle.controller.ProductGeneralForm", {
		// User wants to open the business card of the product supplier
		onSupplierPressed: function(oEvent) {
			if (!this._oPopover || !Element.getElementById(this._oPopover.getId())) {
				this._initializeSupplierCard();
			}
			this._oPopover.openBy(oEvent.getSource());
		},

		_initializeSupplierCard: function() {
			var oCardModel = new JSONModel({
				open: true,
				delay:1000,
				loading: false
			});
			var oComponent = this.getOwnerComponent();
			oComponent.runAsOwner(function() {
				Fragment.load({
					id: this.getView().createId("companyQuickView"),
					name: "sap.ui.demoapps.rta.freestyle.view.SupplierCard",
					controller: {
						dataRequested: oCardModel.setProperty.bind(oCardModel, "/loading", true),
						change: oCardModel.setProperty.bind(oCardModel, "/loading", false)
					}
				}).then(function(oSupplierCard) {
					this._oSupplierCard = oSupplierCard;
					this._oPopover = new Popover({
						id: this.getView().createId("FormPopover"),
						showHeader: false,
						contentMinWidth: "250px",
						contentWidth: "20%",
						content: this._oSupplierCard,
						placement: "HorizontalPreferredRight",
						afterOpen: oCardModel.setProperty.bind(oCardModel, "/open", true),
						afterClose: function () {
							oCardModel.setProperty.bind(oCardModel, "/open", false);
						}
					});

					this._oPopover.removeStyleClass("sapUiPopupWithPadding");
					this._oPopover.addStyleClass("sapUiSizeCompact");
					this._oPopover.setModel(oCardModel, "supplierCard");
					controls.attachControlToView(this.getView(), this._oPopover);
				}.bind(this));
			}.bind(this));
		}
	});
});

/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
		"sap/ui/core/Control",
		"sap/m/Avatar"
	], function(Control, Avatar) {
	"use strict";

	var BarcodeScannerUIContainer =  Control.extend("sap.ndc.BarcodeScannerUIContainer", {
		metadata : {
			properties : {
				prefixId: "string"
			},
			aggregations: {
				_oCloseButton: {
					type: "sap.ui.core.Control",
					multiple: false,
					visibility: "hidden"
				},
				_oFlashLightButton: {
					type: "sap.ui.core.Control",
					multiple: false,
					visibility: "hidden"
				},
				_oControlFlexBox: {
					type: "sap.ui.core.Control",
					multiple: false,
					visibility: "hidden"
				}
			}
		},

		renderer : {
			apiVersion: 2,
			render: function(oRm, oControl) {
				// Video element that is visible to user
				oRm.openStart("div", oControl);
				oRm.class("sapNdcRTCDialogVideo");
				oRm.openEnd();
					oRm.openStart("video", oControl.getId() + "-video");
					oRm.attr("autoplay", "autoplay");
					oRm.attr("webkit-playsinline", "webkit-playsinline");
					oRm.attr("playsinline", "playsinline");
					oRm.class("sapNdcRTCDialogVideoContainer");
					oRm.openEnd();
					oRm.close("video");
				oRm.close("div");

				// Overlay that is used to mark scan area
				oRm.openStart("div", oControl.getId() + "-overlay");
				oRm.class("sapNdcRTCDialogOverlay");
				oRm.openEnd();
					oRm.openStart("div", oControl.getId() + "-overlay-box");
					oRm.class("sapNdcRTCDialogOverlayBox");
					oRm.openEnd();
						oRm.openStart("div", oControl.getId() + "-overlay-line");
						oRm.class("sapNdcRTCDialogOverlayLine");
						oRm.openEnd();
						oRm.close("div");
					oRm.close("div");
				oRm.close("div");

				// Render the barcode avatars
				if (Array.isArray(oControl._aBarcodeAvatars)) {
					for (var i = 0; i < oControl._aBarcodeAvatars.length; i++) {
						if (oControl._aBarcodeAvatars[i]) {
							oRm.renderControl(oControl._aBarcodeAvatars[i]);
						}
					}
				}

				// Div for select image
				oRm.openStart("input", oControl.getId() + "-image");
					oRm.attr("hidden", true);
					oRm.attr("type", "file");
					oRm.attr("accept", "image/*");
					oRm.openEnd();
				oRm.close("input");

				oRm.openStart("canvas", oControl.getId() + "-image-canvas");
					oRm.attr("hidden", true);
					oRm.style("position", "absolute");
					oRm.style("background-color", "white");
					oRm.class("sapNdcRTCDialogImageCanvas");
					oRm.openEnd();
				oRm.close("canvas");

				oRm.renderControl(oControl.getAggregation("_oCloseButton"));
				oRm.renderControl(oControl.getAggregation("_oFlashLightButton"));
				oRm.renderControl(oControl.getAggregation("_oControlFlexBox"));
			}
		}
	});

	/**
	 * Prepare the hided barcode avatars.
	 * @param {integer} iMaxBarcodeNumber the max barcode number
	 * @private
	 */
	BarcodeScannerUIContainer.prototype.prepareBarcodeAvatars = function (iMaxBarcodeNumber) {
		iMaxBarcodeNumber = iMaxBarcodeNumber || 1;
		this._aBarcodeAvatars = [];
		for (var i = 0; i < iMaxBarcodeNumber; i++) {
			var oBarcodeAvatar = new Avatar({
				src: "sap-icon://arrow-right",
				tooltip: this.oResourceModel.getResourceBundle().getText("BARCODE_DIALOG_SCAN_RESULT_BUTTON_TOOLTIP", [(i + 1)]),
				press: function(oEvent) {
					var oControl = oEvent.getSource();
					var aCustomDatas = oControl.getCustomData();
					if (aCustomDatas.length === 2) {
						var oBarcode = aCustomDatas[0].getValue();
						var fnPress = aCustomDatas[1].getValue();
						fnPress(oBarcode);
					}
				}
			}).addStyleClass("sapNdcRTCDialogBarcodeAvatar");
			this._aBarcodeAvatars.push(oBarcodeAvatar);
		}
	};

	/**
	 * Destroy the container including the barcode avatars.
	 * @private
	 */
	BarcodeScannerUIContainer.prototype.destroy = function () {
		if (Array.isArray(this._aBarcodeAvatars)) {
			for (var i = 0; i < this._aBarcodeAvatars.length; i++) {
				var oBarcodeAvatar = this._aBarcodeAvatars[i];
				if (oBarcodeAvatar) {
					oBarcodeAvatar.destroy();
				}
			}
		}
		Control.prototype.destroy.apply(this, arguments);
	};

	return BarcodeScannerUIContainer;
});
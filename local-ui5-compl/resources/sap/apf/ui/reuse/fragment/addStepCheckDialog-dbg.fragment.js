/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(
	[
		"sap/m/Button",
		"sap/m/Dialog",
		"sap/m/library",
		"sap/m/Link",
		"sap/m/Text",
		"sap/m/VBox",
		"sap/base/security/encodeXML",
		"sap/ui/core/HTML",
		"sap/ui/core/library",
		"sap/ui/thirdparty/jquery"
	],
	function(Button, Dialog, mobileLibrary, Link, Text, VBox, encodeXML, HTML, coreLibrary, jQuery) {
		"use strict";

		var DialogType = mobileLibrary.DialogType,
			FlexAlignItems = mobileLibrary.FlexAlignItems,
			ValueState = coreLibrary.ValueState;

		/**
		 * Dialog to show the message when a step cannot be added in the path.
		 *
		 * @namespace
		 * @name sap.apf.ui.reuse.fragment.addStepCheckDialog
		 */
		return {
			createContent : function(oFragmentParameter) {
				var oController = oFragmentParameter.oController;
				var oDialog = new Dialog(oController.createId("idAddStepCheckDialog"), {
					title : oController.oCoreApi.getTextNotHtmlEncoded("warning"),
					type : DialogType.Message,
					state : ValueState.Warning,
					content : [ new Text({
						text : oController.oCoreApi.getTextNotHtmlEncoded("addStepCheck")
					}), new VBox({
						alignItems : FlexAlignItems.End,
						items : [ new Link(oController.createId("idShowDetailsLinkForAddStep"), {
							text : oController.oCoreApi.getTextNotHtmlEncoded("showDetails"),
							press : function() {
								var oDetailLogDialog = new Dialog(oController.createId("idShowDetailsDialogForAddStep"), {
									contentWidth : jQuery(window).height() * 0.6 + "px",
									contentHeight : jQuery(window).height() * 0.6 + "px",
									title : oController.oCoreApi.getTextNotHtmlEncoded("warning"),
									type : DialogType.Message,
									state : ValueState.Warning,
									content : new HTML({
										content : [ '<div><p> ' + encodeXML(oFragmentParameter.sMessageText) + '</p></div>' ].join(""),
										sanitizeContent : true
									}),
									beginButton : new Button({
										text : oController.oCoreApi.getTextNotHtmlEncoded("close"),
										press : function() {
											oDetailLogDialog.close();
										}
									}),
									afterClose : function() {
										oDetailLogDialog.destroy();
									}
								});
								oDetailLogDialog.setInitialFocus(oDetailLogDialog);
								oDetailLogDialog.open();
							}
						}) ]
					}) ],
					beginButton : new Button({
						text : oController.oCoreApi.getTextNotHtmlEncoded("close"),
						press : function() {
							oDialog.close();
						}
					}),
					afterClose : function() {
						oDialog.destroy();
					}
				});
				return oDialog;
			}
		};
	}
);
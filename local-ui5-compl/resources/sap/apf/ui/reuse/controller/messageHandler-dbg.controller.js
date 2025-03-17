/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/core/constants",
	"sap/base/Log",
	"sap/base/security/encodeXML",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/library",
	"sap/m/Link",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/VBox",
	"sap/ui/Device",
	"sap/ui/core/HTML",
	"sap/ui/core/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/thirdparty/jquery"
], function(coreConstants, Log, encodeXML, Button, Dialog, mobileLibrary, Link, MessageBox, MessageToast, Text, VBox, Device, HTML, coreLibrary, Controller, jQuery) {
	"use strict";
	var DialogType = mobileLibrary.DialogType,
		FlexAlignItems = mobileLibrary.FlexAlignItems,
		ValueState = coreLibrary.ValueState;

	var oViewData;
	function _createMessageText(oMessageObject) {
		var text = oMessageObject.getMessage();
		while (oMessageObject.getPrevious()) {
			oMessageObject = oMessageObject.getPrevious();
			text = text + '\n' + oMessageObject.getMessage();
		}
		return text;
	}
	function _closeApplication(oController, oDialog) {
		var oCoreApi = oController.getView().getViewData().oCoreApi;  // CoreAPI is a member of ViewData here
		var closeFatalErrorDialog = oCoreApi.getGenericExit("closeFatalErrorDialog");
		if (closeFatalErrorDialog) {
			closeFatalErrorDialog(oCoreApi, oController, oDialog);
		} else {
			window.history.go(-1);
		}
	}
	function _showInfoMessageBox(oController, oMessageObject) {
		MessageBox.information(oMessageObject.getMessage(), {
			styleClass : Device.system.desktop ? "sapUiSizeCompact" : ""
		});
	}
	function _showSuccessMsgToast(oController, oMessageObject) {
		MessageToast.show(oMessageObject.getMessage(), {
			width : "20em"
		});
	}
	function _checkIsSessionTimeOut(oController) {
		var aLogMessages = oViewData.oCoreApi.getLogMessages();
		var bSessionTimeOut = false;
		for( var i = 0; i < aLogMessages.length; i++) {
			if (aLogMessages[i].search(5021) !== -1) {
				bSessionTimeOut = true;
				break;
			}
		}
		return bSessionTimeOut;
	}
	function _openDetailedLogDialog(oController, oMessageObject) {
		var oDetailLogDialog = new Dialog(oController.createId("idShowDetailsDialog"), {
			contentWidth : jQuery(window).height() * 0.6 + "px",
			contentHeight : jQuery(window).height() * 0.6 + "px",
			title : oViewData.oCoreApi.getTextNotHtmlEncoded("error"),
			type : DialogType.Message,
			state : ValueState.Error,
			content : new HTML({
				content : [ '<div><p> ' + encodeXML(_createMessageText(oMessageObject)) + '</p></div>' ].join(""),
				sanitizeContent : true
			}),
			beginButton : new Button({
				text : oViewData.oCoreApi.getTextNotHtmlEncoded("close"),
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
	function _showFatalErrorDialog(oController, oMessageObject) {
		var bSessionTimeOut = _checkIsSessionTimeOut(oController);
		var oDialog = new Dialog(oController.createId("idFatalDialog"), {
			title : oViewData.oCoreApi.getTextNotHtmlEncoded("error"),
			type : DialogType.Message,
			state : ValueState.Error,
			content : [ new Text({
				text : bSessionTimeOut ? oViewData.oCoreApi.getTextNotHtmlEncoded("application-reload") : oViewData.oCoreApi.getTextNotHtmlEncoded("fatalErrorMessage")
			}), new VBox({
				alignItems : FlexAlignItems.End,
				items : [ new Link({
					text : oViewData.oCoreApi.getTextNotHtmlEncoded("showDetails"),
					press : function() {
						_openDetailedLogDialog(oController, oMessageObject);
					}
				}) ]
			}) ],
			beginButton : new Button({
				text : oViewData.oCoreApi.getTextNotHtmlEncoded("close"),
				press : function() {
					_closeApplication(oController, oDialog);
				}
			}),
			afterClose : function() {
				oDialog.destroy();
			}
		});
		oDialog.setInitialFocus(oDialog);
		oDialog.open();
	}
	function _showLastValidStateDialog(oController, oMessageObject) {
		var oCoreApi = oViewData.oCoreApi;
		var oUiApi = oViewData.uiApi;
		var oDialog = new Dialog(oController.createId("idShowValidStateDialog"), {
			title : oCoreApi.getTextNotHtmlEncoded("error"),
			type : DialogType.Message,
			state : ValueState.Error,
			content : [ new Text({
				text : oCoreApi.getTextNotHtmlEncoded("lastValidStateMessage")
			}), new VBox({
				alignItems : FlexAlignItems.End,
				items : [ new Link({
					text : oCoreApi.getTextNotHtmlEncoded("showDetails"),
					press : function() {
						_openDetailedLogDialog(oController, oMessageObject);
					}
				}) ]
			}) ],
			beginButton : new Button({
				text : oCoreApi.getTextNotHtmlEncoded("gobackToValidState"),
				press : function() {
					var oPromise = oCoreApi.restoreApfState();
					oPromise.then(function() {
						oUiApi.getAnalysisPath().getController().bLastValidState = true;
						oUiApi.getAnalysisPath().getCarouselView().getController().removeAllThumbnails();
						oCoreApi.updatePath(oUiApi.getAnalysisPath().getController().callBackForUpdatePath.bind(oUiApi.getAnalysisPath().getController()));
						oUiApi.getLayoutView().getController().setPathTitle();
						oDialog.close();
						oUiApi.getAnalysisPath().getCarouselView().rerender();
						oUiApi.getLayoutView().setBusy(false);
					}, function() {
						oDialog.close();
					});
				}
			}),
			endButton : new Button({
				text : oCoreApi.getTextNotHtmlEncoded("startNewAnalysis"),
				press : function() {
					oUiApi.getAnalysisPath().getToolbar().getController().resetAnalysisPath();
					oDialog.close();
				}
			}),
			afterClose : function() {
				oDialog.destroy();
			}
		});
		oDialog.setInitialFocus(oDialog);
		oDialog.open();
	}
	function _checkIfLastValidStateIsAvailable(oController, oMessageObject) {
		var bIsLastValidStateAvailable = oViewData.oCoreApi.isApfStateAvailable();
		if (bIsLastValidStateAvailable) {
			_showLastValidStateDialog(oController, oMessageObject);
		} else {
			_showFatalErrorDialog(oController, oMessageObject);
		}
	}

	/**
	 * @class Controller for messageHandler view.
	 * @name sap.apf.ui.reuse.controller.messageHandler 
	 */
	return Controller.extend("sap.apf.ui.reuse.controller.messageHandler", {
		onInit : function() {
			var oController = this;
			if (Device.system.desktop) {
				oController.getView().addStyleClass("sapUiSizeCompact");
			}
			oViewData = oController.getView().getViewData();
		},
		showMessage : function(oMessageObject) {
			var oController = this;
			var severity = oMessageObject.getSeverity();
			var oSeverityConstant = coreConstants.message.severity;
			switch (severity) {
				case oSeverityConstant.fatal:
					oViewData.uiApi.getLayoutView().setBusy(false);
					_checkIfLastValidStateIsAvailable(oController, oMessageObject);
					break;
				case oSeverityConstant.error:
					oViewData.uiApi.getLayoutView().setBusy(false);
					break;
				case oSeverityConstant.information:
					_showInfoMessageBox(oController, oMessageObject);
					break;
				case oSeverityConstant.success:
					_showSuccessMsgToast(oController, oMessageObject);
					break;
				default:
					Log.error("Error type not defined");
					break;
			}
			if (severity === oSeverityConstant.warning || severity === oSeverityConstant.error) {
				MessageToast.show(oMessageObject.getMessage(), {
					width : "40%",
					offset : "0 -50",
					animationDuration : 2000
				});
			}
		}
	});
});
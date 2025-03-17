/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/core/constants",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/library",
	"sap/m/Link",
	"sap/m/Text",
	"sap/m/VBox",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/HTML",
	"sap/ui/core/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/thirdparty/jquery",
	"sap/base/security/encodeXML",
	"sap/base/Log",
	"sap/ui/Device"
], function(coreConstants, Button, Dialog, mobileLibrary, Link, Text, VBox, MessageBox, MessageToast, HTML, coreLibrary, Controller, jQuery, encodeXML, Log, Device) {
	"use strict";

	var DialogType = mobileLibrary.DialogType,
		FlexAlignItems = mobileLibrary.FlexAlignItems,
		ValueState = coreLibrary.ValueState;

	var oCoreApi;
	/**
	* @class messageHandler
	* @memberOf sap.apf.modeler.ui.controller
	* @name MessageHandler
	* @description helps in handling all types of errors in APF configuration modeler
	*/
	function _createMessageText(oMessageObject) {
		var text = oMessageObject.getMessage();
		while (oMessageObject.getPrevious()) {
			oMessageObject = oMessageObject.getPrevious();
			text = text + '\n' + oMessageObject.getMessage();
		}
		return text;
	}
	function _closeApplication(oController, oDialog) {
		var oCoreApi = oController.getView().getViewData(); // CoreAPI is the whole ViewData here
		var closeFatalErrorDialog = oCoreApi.getGenericExit("closeFatalErrorDialog");
		if (closeFatalErrorDialog) {
			closeFatalErrorDialog(oCoreApi, oController, oDialog);
		} else {
			window.history.go(-1);
		}
	}
	function _showErrorMessageBox(oMessageObject) {
		MessageBox.error(oMessageObject.getMessage(), {
			styleClass : Device.system.desktop ? "sapUiSizeCompact" : ""
		});
	}
	function _showInformationMessageBox(oMessageObject) {
		MessageBox.information(oMessageObject.getMessage(), {
			styleClass : Device.system.desktop ? "sapUiSizeCompact" : ""
		});
	}
	function _showSuccessMsgToast(oMessageObject) {
		MessageToast.show(oMessageObject.getMessage(), {
			width : "20em"
		});
	}
	function _openDetailedLogDialog(oController, oMessageObject) {
		var oDetailLogDialog = new Dialog(oController.createId("idShowDetailsDialog"), {
			contentWidth : jQuery(window).height() * 0.6 + "px",
			contentHeight : jQuery(window).height() * 0.6 + "px",
			title : oCoreApi.getText("error"),
			type : DialogType.Message,
			state : ValueState.Error,
			content : new HTML({
				content : [ '<div><p> ' + encodeXML(_createMessageText(oMessageObject)) + '</p></div>' ].join(""),
				sanitizeContent : true
			}),
			beginButton : new Button({
				text : oCoreApi.getText("close"),
				press : function() {
					oDetailLogDialog.close();
				}
			}),
			afterClose : function() {
				oDetailLogDialog.destroy();
			}
		}).addStyleClass("dialogContentPadding");
		oDetailLogDialog.setInitialFocus(oDetailLogDialog);
		oDetailLogDialog.open();
	}
	function _showFatalErrorDialog(oController, oMessageObject) {
		var oDialog = new Dialog(oController.createId("idFatalDialog"), {
			title : oCoreApi.getText("error"),
			type : DialogType.Message,
			state : ValueState.Error,
			content : [ new Text({
				text : oCoreApi.getText("fatalErrorMessage")
			}), new VBox({
				alignItems : FlexAlignItems.End,
				items : [ new Link({
					text : oCoreApi.getText("showDetailsLink"),
					press : function() {
						_openDetailedLogDialog(oController, oMessageObject);
					}
				}) ]
			}) ],
			beginButton : new Button({
				text : oCoreApi.getText("close"),
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

	var messageHandler = Controller.extend("sap.apf.modeler.ui.controller.messageHandler", {
		/**
		* @function
		* @name sap.apf.modeler.ui.controller.messageHandler#showMessage
		* @description shows message on UI using different UI controls based on the severity of the error
		* @param {sap.ui.core.MessageObject} Accepts core message object 
		* */
		onInit : function() {
			oCoreApi = this.getView().getViewData();
		},
		showMessage : function(oMessageObject) {
			var oController = this;
			var severity = oMessageObject.getSeverity();
			var oSeverityConstant = coreConstants.message.severity;
			switch (severity) {
				case oSeverityConstant.fatal:
					_showFatalErrorDialog(oController, oMessageObject);
					break;
				case oSeverityConstant.error:
					_showErrorMessageBox(oMessageObject);
					break;
				case oSeverityConstant.success:
					_showSuccessMsgToast(oMessageObject);
					break;
				case oSeverityConstant.information:
					_showInformationMessageBox(oMessageObject);
					break;
				default:
					Log.error("Error type not defined");
					break;
			}
		}
	});

	return messageHandler;
}, true);
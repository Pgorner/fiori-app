sap.ui.define([
	'sap/apf/core/constants',
	'sap/apf/utils/exportToGlobal',
	'sap/base/security/encodeXML',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/library',
	'sap/m/Link',
	'sap/m/Text',
	'sap/m/VBox',
	'sap/ui/core/HTML',
	'sap/ui/core/library'
], function(Constants, exportToGlobal, EncodeXML, Button, Dialog, mobileLibrary, Link, Text, VBox, HTML, coreLibrary) {
	'use strict';

	var DialogType = mobileLibrary.DialogType,
		FlexAlignItems = mobileLibrary.FlexAlignItems,
		ValueState = coreLibrary.ValueState;

	function messageCallbackForStartup(messageObject) {
		function closeApplication() {
			window.history.go(-1);
		}
		function createMessageText(messageObject) {
			var text = messageObject.getMessage();
			while (messageObject.getPrevious()) {
				messageObject = messageObject.getPrevious();
				text = text + '\n' + messageObject.getMessage();
			}
			return text;
		}
		function openDetailedLogDialog() {
			var oDetailLogDialog = new Dialog({
				title : "Error",
				type : DialogType.Message,
				state : ValueState.Error,
				content : new HTML({
					content : [ '<div><p> ' + EncodeXML(createMessageText(messageObject)) + '</p></div>' ].join(""),
					sanitizeContent : true
				}),
				beginButton : new Button({
					text : "Close", //This text has to be a translated text
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
		var oDialog = new Dialog({
			title : "Error",
			type : DialogType.Message,
			state : ValueState.Error,
			content : [ new Text({
				text : messageObject.getMessage()
			}), new VBox({
				alignItems : FlexAlignItems.End,
				items : [ new Link({
					text : "Show Details", //This text should be a translated text
					press : function() {
						openDetailedLogDialog();
					}
				}) ]
			}) ],
			beginButton : new Button({
				text : "Close", //This text has to be a translated text
				press : function() {
					if (messageObject.getSeverity() === Constants.message.severity.fatal) {
						closeApplication();
					}
				}
			}),
			afterClose : function() {
				oDialog.destroy();
			}
		});
		oDialog.setInitialFocus(oDialog);
		oDialog.open();
	}

	exportToGlobal("sap.apf.messageCallbackForStartup", messageCallbackForStartup);
	return messageCallbackForStartup;
}, true /*GLOBAL_EXPORT*/);

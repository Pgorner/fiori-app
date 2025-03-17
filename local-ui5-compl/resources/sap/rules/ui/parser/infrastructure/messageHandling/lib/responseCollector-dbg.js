sap.ui.define([
	"sap/rules/ui/parser/infrastructure/messageHandling/lib/message",
	"sap/rules/ui/parser/infrastructure/messageHandling/lib/opMessages",
	"sap/rules/ui/parser/infrastructure/locale/lib/constants",
	"sap/rules/ui/parser/infrastructure/errorHandling/hrfException",
	"sap/rules/ui/parser/infrastructure/locale/lib/resourceBundle",
	"sap/base/Log"
], function(messagesListLib, opMessagesLib, localePropertiesEnums, hrfException, resourceBundleLib, Logger) {
    "use strict";
    
	var messagesList = messagesListLib.messages;
	var opMessages = opMessagesLib.opMessages;
	var localePropertiesEnum = localePropertiesEnums.propertiesEnum;
  //Singletone
	var ResponseCollector = (function() {
		var SEVERITY_LEVEL = {
			error: 1,
			warn: 2,
			info: 3,
			debug: 4
		};

		var instance = null;

		function ResponseCollector() {

			var topSeverity = -1;

			var response = {
				code: {},
				message: {},
				output: {},
				details: []
			};

			var messagesStandByList = [];

			var Detail = function() {};

			var currentDetail = {};

			var onHold = false;

			var resourceBundle = resourceBundleLib.getInstance();


			function releaseHold() {
				messagesStandByList = [];
				onHold = false;
			}

			function addNewSubject(subject, isToReleaseHold) {

				if (!isToReleaseHold || isToReleaseHold === true) {
					releaseHold();
				}

				currentDetail = new Detail();
				currentDetail.subject = subject;
				response.details.push(currentDetail);
			}

			function initializeSubject() {
				if (!currentDetail || !currentDetail.subject) {
					Logger.error("ResponseCollector addMessage: no subject was defined");
					addNewSubject("GENERAL", false);
				}

				if (!currentDetail.messages) {
					currentDetail.messages = [];
				}
			}

			function getFormattedMessage(message, paramsArray) {
				var ret = "";
				ret = resourceBundle.getString(message.code, paramsArray, localePropertiesEnum.MESSAGES);
				return ret;
			}

			function insertMessage (message, path, additionalInfo) {
				if (additionalInfo) {
					message.additionalInfo = additionalInfo;
				}

				if (path) {
					message.path = path;
				}

				if (onHold === false) {
					if (topSeverity === -1 || SEVERITY_LEVEL[message.severity] < SEVERITY_LEVEL[topSeverity]) {
						topSeverity = message.severity;
					}
				}

				var obj = JSON.parse (JSON.stringify(message));

				if (onHold === true) {
					messagesStandByList.push(obj);
				} else {
					currentDetail.messages.push(obj);
				}
				
				return obj;
			}

			return {
				build: function() {
					return response;
				},

				setOutput: function(outputObj) {
					response.output = outputObj;
				},


				addMessage: function (message_enum, paramsArray, path, additionalInfo, formattedMessage) {

					initializeSubject();

					var message = JSON.parse(JSON.stringify(messagesList[message_enum]));

					if (formattedMessage !== null && formattedMessage !== undefined) {
						message.description = formattedMessage;
					} else {
						message.description = getFormattedMessage(message, paramsArray);
					}

					return insertMessage (message, path, additionalInfo);
				},

				getLastMessage: function() {
					if (!currentDetail.messages || currentDetail.messages.length === 0) {
						return null;
					}

					return currentDetail.messages[currentDetail.messages.length - 1].description;
				},

				getMessage: function(message_enum, paramsArray) {
					var ret = "";

					var message = JSON.parse(JSON.stringify(messagesList[message_enum]));
					ret = getFormattedMessage(message, paramsArray);
					return ret;
				},

				getTopSeverity: function() {
					if (topSeverity === -1) {
						return null;
					}
					return topSeverity;

				},

				hold: function() {
					messagesStandByList = [];
					onHold = true;

				},

				unHold: function() {
					releaseHold();
				},

				getStandByMessagesList: function() {
					return messagesStandByList;
				},

				addSubject: function(subject, isToReleaseHold) {
					addNewSubject(subject, isToReleaseHold);
				},

				setOpMessage: function(op_name, status) { /* success, failure */
					if (!op_name || !status) {
						throw new hrfException.HrfException ("setOpMessage: missing patrameters");
					}
					
					response.code = opMessages[op_name][status].code;
					response.message = resourceBundle.getString(response.code, null, localePropertiesEnum.OP_MESSAGES);
				},
				
				clear: function() { 
					topSeverity = -1;

					response = {
						code: {},
						message: {},
						output: {},
						details: []
					};

					messagesStandByList = [];

					Detail = function() {};

					currentDetail = {};

					onHold = false;
				},				

				trace: function (severity, message, exception) {
					if (exception) {
						hrfException.trace (exception);
						return;
					}

					var traceMassage = "HRF Trace Message: " + message;

					switch (severity) {
						case SEVERITY_LEVEL.error:
							Logger.error (traceMassage + "\n\nCall stack:\n----------\n" + (new Error()).stack + '\n\n-------------------------------------');
							break;
						case SEVERITY_LEVEL.info:
							Logger.info(traceMassage);
							break;
						case SEVERITY_LEVEL.debug:
							Logger.debug(traceMassage);
							break;
						case SEVERITY_LEVEL.warn:
							Logger.error(traceMassage);
							break;
					}
				}
			};
		}

		return {
			severity: function() {
				return SEVERITY_LEVEL;
			},

			getInstance: function() {
				if (!instance) {
					instance = new ResponseCollector();
					instance.constructor = null;
				}
				return instance;
			}
		};
	}());
	return {
		ResponseCollector: ResponseCollector
	};
}, true);